import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, PayloadRequest } from 'payload';

import { einstellungenZuSeite, vorgangAenderungZuPayload, vorgangZuSeite } from '../../lib/data/payload-mapping';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from '../../lib/mail/versand';
import { istStatusMitMail, statusMail, type StatusMitMail } from '../../lib/mail/vorlagen/status';
import { kundeBezahlt } from '../../lib/mail/vorlagen/zahlung';
import type { MailLogEntry, Settings } from '../../lib/types';
import { mailKonfiguration, zahlungKonfiguration } from '../../lib/umgebung';
import type { Einstellungen, Vorgaenge } from '../../payload-types';

/* ==========================================================================
   Hooks der Sammlung Vorgänge — nur für Änderungen des Teams im Backend
   (`req.user` gesetzt). Änderungen der Seite selbst (Webhook, Anlage,
   Mailprotokoll) laufen über die Local API ohne Benutzer oder mit
   `context.sm24System` und lösen hier nichts aus.

   Bewusst nur relative Importe und kein 'server-only': Die Sammlung wird
   auch von `payload migrate` und `payload run` geladen.
   ========================================================================== */

/** Kennzeichen für Änderungen, die der Server selbst schreibt (kein erneuter Hook-Lauf). */
export const SYSTEM_AENDERUNG = 'sm24System';

interface Vorhaben {
  statusMail?: { status: StatusMitMail; nachricht?: string };
  /** Zahlung von Hand auf „bezahlt“ gesetzt. */
  zahlungsMail?: boolean;
  /** Offene Checkout-Sitzung beim Stornieren beenden. */
  sitzungBeenden?: string;
}

const vorhabenSchluessel = (id: number | string) => `sm24Vorhaben:${id}`;

/** Name des Benutzers für Notizen — nur intern sichtbar. */
export function benutzerName(user: PayloadRequest['user']): string {
  const u = user as { name?: string | null; email?: string | null } | null;
  return u?.name?.trim() || u?.email || 'Team';
}

const ZAHLUNGSSTAND: Record<string, string> = {
  offen: 'Offen',
  bezahlt: 'Bezahlt',
  fehlgeschlagen: 'Fehlgeschlagen',
  erstattet: 'Erstattet',
};

/**
 * Vor dem Speichern: Zahlung von Hand nachhalten, Statuswechsel für die Mail
 * vormerken, Nachricht an den Kunden übernehmen und das Feld leeren — sonst
 * ginge sie beim nächsten Statuswechsel noch einmal hinaus.
 */
export const vorgangVorAenderung: CollectionBeforeChangeHook<Vorgaenge> = ({ data, originalDoc, operation, req }) => {
  if (operation !== 'update' || !req.user || req.context?.[SYSTEM_AENDERUNG] || !originalDoc) return data;
  const jetzt = new Date().toISOString();
  const vorhaben: Vorhaben = {};

  const zahlungAlt = originalDoc.zahlung?.status ?? null;
  const zahlungNeu = data.zahlung?.status ?? zahlungAlt;
  if (data.zahlung && zahlungNeu !== zahlungAlt) {
    data.zahlung = { ...data.zahlung };
    if (zahlungNeu === 'bezahlt') {
      if (!originalDoc.zahlung?.bezahltAm) data.zahlung.bezahltAm = jetzt;
      vorhaben.zahlungsMail = true;
    }
    data.notizen = [
      ...(data.notizen ?? originalDoc.notizen ?? []),
      {
        am: jetzt,
        von: 'team',
        text:
          `Zahlungsstand von Hand von „${ZAHLUNGSSTAND[zahlungAlt ?? ''] ?? '–'}“ auf „${ZAHLUNGSSTAND[zahlungNeu ?? ''] ?? '–'}“ `
          + `gesetzt (${benutzerName(req.user)}).`,
      },
    ];
  }

  if (data.status && data.status !== originalDoc.status) {
    const zahlung = originalDoc.zahlung;
    if (data.status === 'storniert' && zahlung?.status === 'offen' && zahlung.checkoutSitzung) {
      vorhaben.sitzungBeenden = zahlung.checkoutSitzung;
    }
    const informieren = (data.kundeInformieren ?? originalDoc.kundeInformieren) !== false;
    if (informieren && istStatusMitMail(data.status)) {
      const nachricht = (data.nachrichtAnKunde ?? originalDoc.nachrichtAnKunde ?? '').trim();
      vorhaben.statusMail = { status: data.status, ...(nachricht ? { nachricht } : {}) };
      data.nachrichtAnKunde = '';
    }
    // Das Häkchen gilt nur für diesen einen Wechsel.
    data.kundeInformieren = true;
  }

  if (Object.keys(vorhaben).length) req.context[vorhabenSchluessel(originalDoc.id)] = vorhaben;
  return data;
};

/** Einstellungen für die Vorlagen; ohne sie fehlt nur der Firmenfuß. */
export async function einstellungenLaden(req: PayloadRequest): Promise<Settings | undefined> {
  try {
    const doc = (await req.payload.findGlobal({ slug: 'einstellungen', depth: 0, overrideAccess: true, req })) as Einstellungen;
    return einstellungenZuSeite(doc);
  } catch (error) {
    req.payload.logger.warn({ msg: 'Einstellungen für die Mail nicht geladen', err: error });
    return undefined;
  }
}

/**
 * Schreibt Einträge gezielt an den Vorgang (Mailprotokoll, Notizen, Link-
 * Schlüssel) — als Systemänderung, ohne die Hooks erneut auszulösen.
 */
export async function vorgangVermerken(
  req: PayloadRequest,
  id: number,
  daten: Parameters<typeof vorgangAenderungZuPayload>[0],
): Promise<Vorgaenge> {
  req.context[SYSTEM_AENDERUNG] = true;
  try {
    return (await req.payload.update({
      collection: 'vorgaenge',
      id,
      data: vorgangAenderungZuPayload(daten),
      overrideAccess: true,
      depth: 0,
      req,
    })) as Vorgaenge;
  } finally {
    // Payload kopiert `req.context` — deshalb am aktuellen Objekt zurücksetzen.
    delete req.context[SYSTEM_AENDERUNG];
  }
}

/**
 * Nach dem Speichern: Statusmail bzw. Zahlungsmail an den Kunden, Eintrag im
 * Mailprotokoll, offene Zahlungsseite beim Stornieren beenden.
 *
 * Die Mail geht noch in der Transaktion hinaus; scheitert danach das
 * Speichern, hat der Kunde eine Mail zu einem nicht gespeicherten Stand.
 * Das ist seltener und harmloser als eine verlorene Mail.
 */
export const vorgangNachAenderung: CollectionAfterChangeHook<Vorgaenge> = async ({ doc, operation, req }) => {
  if (operation !== 'update' || req.context?.[SYSTEM_AENDERUNG]) return doc;
  const schluessel = vorhabenSchluessel(doc.id);
  const vorhaben = req.context?.[schluessel] as Vorhaben | undefined;
  if (!vorhaben) return doc;
  delete req.context[schluessel];

  if (vorhaben.sitzungBeenden && zahlungKonfiguration()) {
    try {
      // Erst hier laden: Stripe gehört nur in den Server der Seite.
      const { checkoutBeenden } = await import('../../lib/integrations/stripe');
      await checkoutBeenden(vorhaben.sitzungBeenden);
    } catch (error) {
      // Schon abgelaufen oder bezahlt — nur protokollieren.
      req.payload.logger.warn({ msg: `Checkout-Sitzung zu Vorgang ${doc.id} nicht beendet`, err: error });
    }
  }

  if ((!vorhaben.statusMail && !vorhaben.zahlungsMail) || !mailKonfiguration()) return doc;

  const vorgang = vorgangZuSeite(doc);
  const settings = await einstellungenLaden(req);
  const kontext = vorlagenKontext(settings);
  const antwortAn = antwortAdresse(settings?.company);
  const eintraege: MailLogEntry[] = [];

  if (vorhaben.statusMail) {
    const { status, nachricht } = vorhaben.statusMail;
    eintraege.push(
      await sendeVorlage({
        art: 'status',
        an: vorgang.contact.email,
        inhalt: statusMail({ vorgang, status, nachricht, kontext }),
        antwortAn,
        idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, `status-${status}`, doc.updatedAt),
      }),
    );
  }
  if (vorhaben.zahlungsMail) {
    eintraege.push(
      await sendeVorlage({
        art: 'zahlung-erhalten',
        an: vorgang.contact.email,
        inhalt: kundeBezahlt({ vorgang, kontext }),
        antwortAn,
        idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'zahlung-erhalten'),
      }),
    );
  }

  try {
    const neu = await vorgangVermerken(req, doc.id, { mailLog: [...(vorgang.mailLog ?? []), ...eintraege] });
    return { ...doc, mails: neu.mails };
  } catch (error) {
    req.payload.logger.error({ msg: `Mailprotokoll zu Vorgang ${doc.id} nicht gespeichert`, err: error });
    return doc;
  }
};
