import { paymentStatus } from '@/lib/integrations';
import { webhookEreignis } from '@/lib/integrations/stripe';
import { leseBegrenzt } from '@/lib/server/anfrage-koerper';
import { benachrichtigeZahlung, nachDerAntwort } from '@/lib/server/benachrichtigungen';
import { zahlungKonfiguration } from '@/lib/umgebung';
import { stripeEreignisVerbuchen } from '@/lib/zahlung/verbuchen';

/*
 * POST /api/zahlung/stripe — Webhook von Stripe.
 *
 * Liegt neben der Payload-Schnittstelle /api/[...slug]; der feste Pfad hat
 * Vorrang. Die Signatur wird über die exakten Bytes geprüft, deshalb erst den
 * Rohkörper lesen (begrenzt) und nie `request.json()`.
 *
 * Antworten: 503 ohne Einrichtung, 400 bei fehlender oder falscher Signatur
 * (ohne Details), 200 für verbuchte, doppelte und unbekannte Ereignisse,
 * 500 bei Fehlern im Verbuchen — Stripe stellt dann erneut zu. Mails gehen
 * erst nach der Antwort raus; ihr Ergebnis ändert die Antwort nie.
 */

/** Stripe-Ereignisse sind wenige Kilobyte groß. */
const MAX_KOERPER_BYTES = 512 * 1024;

function antwort(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request): Promise<Response> {
  const konfiguration = zahlungKonfiguration();
  if (!konfiguration || !paymentStatus().configured) {
    return antwort(503, { error: 'Online-Zahlung ist nicht eingerichtet.' });
  }

  const signatur = request.headers.get('stripe-signature');
  if (!signatur) return antwort(400, { error: 'Ungültige Anfrage.' });

  const koerper = await leseBegrenzt(request, MAX_KOERPER_BYTES);
  if (koerper === 'zu-gross') return antwort(413, { error: 'Anfrage zu groß.' });

  let event;
  try {
    event = webhookEreignis(Buffer.from(koerper), signatur, konfiguration.webhookSecret);
  } catch {
    return antwort(400, { error: 'Ungültige Anfrage.' });
  }

  try {
    const verbucht = await stripeEreignisVerbuchen(event);
    if (!verbucht) return antwort(200, { erhalten: true, verarbeitet: false });

    const { vorgang, mail } = verbucht;
    if (vorgang && mail) {
      await nachDerAntwort(() => benachrichtigeZahlung({ vorgang, mail, ereignisId: event.id }));
    }
    return antwort(200, { erhalten: true, ergebnis: verbucht.ergebnis });
  } catch (error) {
    console.error(`[zahlung] Webhook ${event.type} (${event.id}) nicht verbucht`, error);
    return antwort(500, { error: 'Ereignis konnte nicht verarbeitet werden.' });
  }
}
