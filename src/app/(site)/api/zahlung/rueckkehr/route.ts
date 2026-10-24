import { getRecord } from '@/lib/data';
import { paymentStatus } from '@/lib/integrations';
import { checkoutAbrufen } from '@/lib/integrations/stripe';
import { verifyAccessToken } from '@/lib/server/access-token';
import { benachrichtigeZahlung, nachDerAntwort } from '@/lib/server/benachrichtigungen';
import { LIMITS, allowRequest } from '@/lib/server/rate-limit';
import { sitzungVerbuchen } from '@/lib/zahlung/verbuchen';

/*
 * GET /api/zahlung/rueckkehr?id=…&t=…&session_id=… — Rückkehr von der
 * Zahlungsseite (success_url).
 *
 * Fragt den Stand der Sitzung bei Stripe ab und verbucht ihn sofort — so
 * zeigt die Bestellseite „bezahlt“, auch wenn der Webhook noch unterwegs ist.
 * Webhook und Rückkehr dürfen beide verbuchen: Der Zustandsautomat ändert
 * einen erreichten Stand nicht noch einmal. Danach immer 303 auf die
 * Bestellseite; die prüft den Link-Schlüssel ohnehin selbst.
 */

const SITZUNG = /^cs_[A-Za-z0-9_]{1,250}$/;

function weiterleiten(ziel: URL): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: ziel.toString(), 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  });
}

function nichtGefunden(): Response {
  return new Response('Nicht gefunden', { status: 404, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') ?? '';
  const token = url.searchParams.get('t') ?? '';
  const sitzungId = url.searchParams.get('session_id') ?? '';
  if (!/^\d{1,15}$/.test(id) || !token || token.length > 128) return nichtGefunden();

  const ziel = new URL(`/bestellung/${id}`, request.url);
  ziel.searchParams.set('t', token);

  if (!paymentStatus().configured || !SITZUNG.test(sitzungId)) return weiterleiten(ziel);
  // Zu viele Abrufe: nur weiterleiten, Stripe nicht fragen — der Webhook verbucht trotzdem.
  if (!(await allowRequest(LIMITS.rueckkehr))) return weiterleiten(ziel);

  const record = await getRecord(id);
  if (!record || !verifyAccessToken(token, record.accessTokenHash)) return nichtGefunden();
  ziel.searchParams.set('rueckkehr', '1');

  try {
    const session = await checkoutAbrufen(sitzungId);
    // Nur die Sitzung dieses Vorgangs — sonst ließe sich eine fremde Zahlung „mitnehmen“.
    if (session.metadata?.vorgangId !== id || session.client_reference_id !== id) return weiterleiten(ziel);
    if (session.status === 'complete') {
      const verbucht = await sitzungVerbuchen(`rueckkehr:${session.id}`, 'checkout.session.completed', session);
      const { vorgang, mail } = verbucht;
      if (vorgang && mail) {
        await nachDerAntwort(() => benachrichtigeZahlung({ vorgang, mail, ereignisId: `rueckkehr:${session.id}` }));
      }
    }
  } catch (error) {
    // Kein Fehler für den Kunden: Der Webhook verbucht die Zahlung ebenfalls.
    console.error('[zahlung] Rückkehr nicht verbucht', error);
  }
  return weiterleiten(ziel);
}
