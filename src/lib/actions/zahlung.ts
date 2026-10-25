'use server';

import { getRecord, vorgangAendern } from '@/lib/data';
import { createPayment, paymentStatus } from '@/lib/integrations';
import { checkoutAbrufen } from '@/lib/integrations/stripe';
import { FOTOANFRAGE_ZAHLUNG, istFotoanfrage } from '@/lib/foto-freigabe';
import { verifyAccessToken } from '@/lib/server/access-token';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import { terminNochBezahlbar } from '@/lib/zahlung/ansicht';
import { sitzungVerbuchen } from '@/lib/zahlung/verbuchen';

export interface ZahlungFortsetzenErgebnis {
  ok: boolean;
  /** Zahlungsseite, auf die der Browser weitergeleitet wird. */
  url?: string;
  meldung?: string;
  /** Termin verfallen: Adresse für eine neue Buchung. */
  neuBuchen?: string;
}

const NEU_BUCHEN = '/autoschluessel/anfrage';
const UNGUELTIG = 'Dieser Link ist ungültig. Bitte nutzen Sie den Link aus Ihrer Bestätigung.';
const FEHLER = 'Die Zahlung konnte gerade nicht gestartet werden. Bitte versuchen Sie es in einigen Minuten erneut.';
const ABGELAUFEN = 'Die Reservierung ist abgelaufen – bitte buchen Sie den Termin neu.';

/**
 * „Jetzt bezahlen“ / „Erneut bezahlen“ auf der Bestellseite.
 *
 * Eine offene Zahlungsseite wird wiederverwendet — so entsteht keine zweite.
 * Ist sie abgelaufen, startet bei Bestellungen eine neue; ein Termin muss neu
 * gebucht werden, weil sein Zeitfenster dann wieder frei ist. Eine
 * Fotoanfrage lässt sich nur bezahlen, solange sie freigegeben ist — mit der
 * Zahlung erteilt der Kunde den Auftrag.
 */
export async function zahlungFortsetzen(eingabe: { recordId: string; token: string }): Promise<ZahlungFortsetzenErgebnis> {
  if (!(await allowRequest(LIMITS.zahlung))) return { ok: false, meldung: RATE_LIMIT_MESSAGE };
  const { recordId, token } = eingabe ?? {};
  if (typeof recordId !== 'string' || typeof token !== 'string' || recordId.length > 40) {
    return { ok: false, meldung: UNGUELTIG };
  }

  const vorgang = await getRecord(recordId);
  if (!vorgang || !verifyAccessToken(token, vorgang.accessTokenHash)) return { ok: false, meldung: UNGUELTIG };

  const zahlung = vorgang.payment;
  if (!zahlung) return { ok: false, meldung: 'Für diesen Vorgang ist keine Online-Zahlung vorgesehen.' };
  if (zahlung.status === 'bezahlt' || zahlung.status === 'erstattet') {
    return { ok: false, meldung: 'Dieser Vorgang ist bereits bezahlt.' };
  }
  const termin = vorgang.kind === 'termin';
  if (vorgang.status === 'storniert') {
    return termin
      ? { ok: false, meldung: 'Dieser Termin ist storniert.', neuBuchen: NEU_BUCHEN }
      : { ok: false, meldung: 'Dieser Vorgang ist storniert.' };
  }
  const foto = istFotoanfrage(vorgang);
  if (foto && vorgang.status !== 'freigegeben') {
    return { ok: false, meldung: 'Für diese Anfrage ist derzeit keine Zahlung möglich. Wir melden uns bei Ihnen.' };
  }
  if (!paymentStatus().configured) {
    return { ok: false, meldung: 'Die Online-Zahlung ist derzeit nicht verfügbar. Wir melden uns mit den Zahlungsinformationen.' };
  }

  try {
    if (zahlung.checkoutSessionId) {
      const session = await checkoutAbrufen(zahlung.checkoutSessionId);
      if (session.status === 'open' && session.url) return { ok: true, url: session.url };
      // Nach einer gescheiterten Lastschrift bleibt die Sitzung „complete“ —
      // dann braucht es eine neue (beim Termin: neu buchen, siehe unten).
      if (session.status === 'complete' && zahlung.status !== 'fehlgeschlagen') {
        // Schon bezahlt (oder bei der Bank unterwegs) — den Stand gleich verbuchen.
        await sitzungVerbuchen(`rueckkehr:${session.id}`, 'checkout.session.completed', session).catch((error) => {
          console.error('[zahlung] Abgeschlossene Sitzung nicht verbucht', error);
        });
        return {
          ok: false,
          meldung:
            session.payment_status === 'unpaid'
              ? 'Ihre Zahlung ist eingeleitet; die Bestätigung der Bank steht noch aus.'
              : 'Ihre Zahlung ist bereits eingegangen.',
        };
      }
    }

    // Neue Zahlungsseite — beim Termin nur, solange er reserviert ist.
    if (termin && (zahlung.status !== 'offen' || !terminNochBezahlbar(vorgang, new Date()) || zahlung.checkoutSessionId)) {
      return { ok: false, meldung: ABGELAUFEN, neuBuchen: NEU_BUCHEN };
    }

    const ergebnis = await createPayment({
      recordId: vorgang.id,
      reference: vorgang.reference,
      recordKind: vorgang.kind,
      amountCents: zahlung.amountCents,
      scope: zahlung.scope,
      description: termin ? 'Anzahlung Autoschlüssel-Termin' : foto ? FOTOANFRAGE_ZAHLUNG : 'Bestellung',
      accessToken: token,
      customerEmail: vorgang.contact.email,
      lines: vorgang.lines,
      shipping: vorgang.totals ? { label: vorgang.totals.shippingLabel, cents: vorgang.totals.shippingCents } : undefined,
      appointment: vorgang.appointment,
    });
    if (!ergebnis.redirectUrl || !ergebnis.checkoutSessionId) return { ok: false, meldung: ergebnis.message };

    const at = new Date().toISOString();
    await vorgangAendern(vorgang.id, (v) => {
      if (!v.payment || v.payment.status === 'bezahlt' || v.payment.status === 'erstattet') return null;
      return {
        payment: {
          ...v.payment,
          status: 'offen',
          checkoutSessionId: ergebnis.checkoutSessionId,
          expiresAt: ergebnis.expiresAt,
          ...(ergebnis.providerRef ? { providerRef: ergebnis.providerRef } : {}),
        },
        timeline: [...v.timeline, { at, actor: 'system', message: 'Online-Zahlung erneut gestartet.' }],
      };
    });
    return { ok: true, url: ergebnis.redirectUrl };
  } catch (error) {
    console.error('[zahlung] Zahlung nicht fortgesetzt', error);
    return { ok: false, meldung: FEHLER };
  }
}
