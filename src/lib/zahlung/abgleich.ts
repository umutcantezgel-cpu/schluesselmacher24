import 'server-only';

import type { Where } from 'payload';

import { vorgangAendern } from '@/lib/data';
import { payloadInstanz } from '@/lib/data/payload-adapter';
import { vorgangZuSeite } from '@/lib/data/payload-mapping';
import { checkoutAbrufen } from '@/lib/integrations/stripe';
import { benachrichtigeZahlung, nachDerAntwort } from '@/lib/server/benachrichtigungen';
import type { BusinessRecord } from '@/lib/types';
import type { Vorgaenge } from '@/payload-types';

import { VERLAUF } from './uebergaenge';
import { sitzungVerbuchen } from './verbuchen';

/* ==========================================================================
   Abgleich offener Termin-Zahlungen (täglicher Cron, Sicherheitsnetz zum Webhook)
   Sicherheitsnetz, falls ein Webhook ausbleibt: Ein unbezahlter Termin darf
   sein Zeitfenster nicht dauerhaft belegen.
   ========================================================================== */

/** Ab wann eine Termin-Sitzung sicher beendet ist (Stripe: 31 Minuten). */
const SITZUNG_ALT_MS = 2 * 60 * 60 * 1000;
/** Termin ohne Sitzung: nach dieser Zeit freigeben. */
const OHNE_SITZUNG_MS = 60 * 60 * 1000;
const HOECHSTENS = 50;

export interface AbgleichErgebnis {
  geprueft: number;
  verbucht: number;
  freigegeben: number;
  fehler: number;
}

async function offeneTermine(where: Where[]): Promise<BusinessRecord[]> {
  const payload = await payloadInstanz();
  const { docs } = await payload.find({
    collection: 'vorgaenge',
    where: { and: [{ art: { equals: 'termin' } }, { 'zahlung.status': { equals: 'offen' } }, ...where] },
    sort: 'createdAt',
    limit: HOECHSTENS,
    depth: 0,
    overrideAccess: true,
  });
  return (docs as Vorgaenge[]).map(vorgangZuSeite);
}

export async function zahlungenAbgleichen(jetzt = new Date()): Promise<AbgleichErgebnis> {
  const ergebnis: AbgleichErgebnis = { geprueft: 0, verbucht: 0, freigegeben: 0, fehler: 0 };

  // 1. Termine mit Sitzung, die längst abgelaufen oder abgeschlossen sein muss.
  const mitSitzung = await offeneTermine([
    { 'zahlung.checkoutSitzung': { exists: true } },
    { status: { not_equals: 'storniert' } },
    { createdAt: { less_than: new Date(jetzt.getTime() - SITZUNG_ALT_MS).toISOString() } },
  ]);
  for (const vorgang of mitSitzung) {
    const sitzungId = vorgang.payment?.checkoutSessionId;
    if (!sitzungId) continue;
    ergebnis.geprueft += 1;
    try {
      const session = await checkoutAbrufen(sitzungId);
      const typ =
        session.status === 'expired' ? 'checkout.session.expired'
        : session.status === 'complete' ? 'checkout.session.completed'
        : null;
      if (!typ) continue;
      const ereignisId = `abgleich:${session.id}`;
      const verbucht = await sitzungVerbuchen(ereignisId, typ, session);
      if (verbucht.ergebnis !== 'doppelt' && verbucht.ergebnis !== 'ignoriert') ergebnis.verbucht += 1;
      const { vorgang: neu, mail } = verbucht;
      if (neu && mail) await nachDerAntwort(() => benachrichtigeZahlung({ vorgang: neu, mail, ereignisId }));
    } catch (error) {
      ergebnis.fehler += 1;
      console.error(`[zahlung] Abgleich für Vorgang ${vorgang.id} fehlgeschlagen`, error);
    }
  }

  // 2. Termine, deren Zahlung gar nicht erst gestartet ist (Stripe-Ausfall).
  //    Nur mit dem Vermerk „Zahlung konnte nicht gestartet werden.“ — Termine
  //    aus der Zeit ohne Online-Zahlung bleiben unberührt.
  const ohneSitzung = await offeneTermine([
    { 'zahlung.checkoutSitzung': { exists: false } },
    { status: { equals: 'neu' } },
    { createdAt: { less_than: new Date(jetzt.getTime() - OHNE_SITZUNG_MS).toISOString() } },
  ]);
  for (const kandidat of ohneSitzung) {
    if (!kandidat.timeline.some((e) => e.message === VERLAUF.nichtGestartet)) continue;
    ergebnis.geprueft += 1;
    try {
      const at = jetzt.toISOString();
      const neu = await vorgangAendern(kandidat.id, (v) => {
        // Unter der Sperre erneut prüfen — inzwischen könnte bezahlt oder bearbeitet worden sein.
        if (v.status !== 'neu' || v.payment?.status !== 'offen' || v.payment.checkoutSessionId) return null;
        return {
          status: 'storniert',
          payment: { ...v.payment, status: 'fehlgeschlagen' },
          timeline: [...v.timeline, { at, actor: 'system', message: VERLAUF.terminFrei }],
          internalNotes: [
            ...v.internalNotes,
            {
              at,
              actor: 'system',
              message: 'Automatisch storniert: Die Online-Zahlung kam nicht zustande (keine Checkout-Sitzung). Zeitfenster freigegeben.',
            },
          ],
        };
      });
      if (neu?.status === 'storniert') {
        ergebnis.freigegeben += 1;
        await nachDerAntwort(() =>
          benachrichtigeZahlung({
            vorgang: neu,
            mail: { art: 'nicht-abgeschlossen', terminFreigegeben: true },
            ereignisId: `abgleich:ohne-sitzung:${neu.id}`,
          }),
        );
      }
    } catch (error) {
      ergebnis.fehler += 1;
      console.error(`[zahlung] Freigabe für Vorgang ${kandidat.id} fehlgeschlagen`, error);
    }
  }

  return ergebnis;
}
