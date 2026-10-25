import { APIError, isolateObjectProperty, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type PayloadRequest } from 'payload';

import { einstellungenZuSeite, vorgangAenderungZuPayload, vorgangZuSeite } from '../../lib/data/payload-mapping';
import { formatCents } from '../../lib/format';
import { auftragErteiltVerlauf, fotoanfrageVerlauf, freigabeZahlbar, istFotoanfrage } from '../../lib/foto-freigabe';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from '../../lib/mail/versand';
import { BESTAETIGENDE_STATUS, sendeVertragsbestaetigung, vertragsbestaetigungOffen } from '../../lib/mail/vertrag';
import { vorgangsLink } from '../../lib/mail/vorlagen/gemeinsam';
import { istStatusMitMail, mailArtZumStatus, statusMail, type StatusMailDaten, type StatusMitMail } from '../../lib/mail/vorlagen/status';
import { kundeBezahlt } from '../../lib/mail/vorlagen/zahlung';
import type { AreaKey, BusinessRecord, MailLogEntry, Settings } from '../../lib/types';
import { mailKonfiguration, zahlungKonfiguration } from '../../lib/umgebung';
import type { Einstellungen, Vorgaenge } from '../../payload-types';
import { statusBezeichnung } from '../fields/vorgang-status';

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
  /** Vertrag angenommen (bestätigender Status oder Zahlung von Hand): Vertragsbestätigung, falls noch offen. */
  vertrag?: boolean;
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

const veraltet = (grund: string) => `Der Vorgang wurde inzwischen geändert (${grund}). Bitte die Seite neu laden.`;
export const MELDUNG_ZAHLUNG_EINGEGANGEN = veraltet('Zahlung eingegangen');
export const MELDUNG_TERMIN_FREIGEGEBEN = veraltet('Termin wurde freigegeben');

type Notizen = NonNullable<Vorgaenge['notizen']>;

/** Zeitpunkt + Text — unabhängig von der Schreibweise des Datums. */
function notizSchluessel({ am, text }: Notizen[number]): string {
  const zeit = Date.parse(am);
  return `${Number.isNaN(zeit) ? am : zeit}|${text}`;
}

/**
 * Notizen sind ein Protokoll: Einträge, die das Formular nicht mitschickt
 * (inzwischen vom Server ergänzt oder im Formular gelöscht), hängen wieder an —
 * ohne alte Zeilenkennung, damit eine bearbeitete Notiz keine doppelte erzeugt.
 */
function notizenZusammenfuehren(formular: Notizen, gespeichert: Notizen): Notizen {
  const vorhanden = new Set(formular.map(notizSchluessel));
  const fehlend = gespeichert.filter((n) => !vorhanden.has(notizSchluessel(n))).map(({ am, von, text }) => ({ am, von, text }));
  return fehlend.length ? [...formular, ...fehlend] : formular;
}

/**
 * Vor dem Speichern: Zahlung von Hand nachhalten, Statuswechsel für die Mail
 * vormerken, Nachricht an den Kunden übernehmen und das Feld leeren — sonst
 * ginge sie beim nächsten Statuswechsel noch einmal hinaus. Jeder
 * Statuswechsel steht mit altem und neuem Status, Zeit und Bearbeiter in den
 * Notizen (Erg. Leitfaden §2).
 *
 * Foto-Freigabe („Schlüssel nach Vorlage“): Mit „Freigegeben“ und Preis legt
 * der Hook die Zahlung an (Gesamtbetrag, offen); die Mail mit dem neuen
 * persönlichen Zahlungslink geht nach dem Speichern hinaus. Wird der Preis
 * später eingetragen oder geändert, folgt die Freigabe-Mail erneut. Zahlt der
 * Kunde (oder setzt das Team „bezahlt“), springt der Status auf „In Fertigung“.
 *
 * Das Backend-Formular schickt den ganzen Stand vom Öffnen mit. Was der
 * Zahlungsdienst inzwischen gebucht hat, darf es nicht zurückdrehen: Ein
 * Rückschritt von „bezahlt“ (über Stripe) oder die Wiederbelebung eines
 * automatisch freigegebenen Termins wird mit 409 abgelehnt.
 */
export const vorgangVorAenderung: CollectionBeforeChangeHook<Vorgaenge> = ({ data, originalDoc, operation, req }) => {
  if (operation !== 'update' || !req.user || req.context?.[SYSTEM_AENDERUNG] || !originalDoc) return data;
  const jetzt = new Date().toISOString();
  const vorhaben: Vorhaben = {};
  const bearbeiter = benutzerName(req.user);
  const fotoanfrage = istFotoanfrage({ kind: originalDoc.art, area: originalDoc.bereich as AreaKey });
  const freigabe = data.freigabe ?? originalDoc.freigabe;
  const preis = Number(freigabe?.preisCent ?? 0);
  const mitPreis = Number.isSafeInteger(preis) && preis > 0;
  const informieren = (data.kundeInformieren ?? originalDoc.kundeInformieren) !== false;
  const notiz = (text: string) => {
    data.notizen = [...(data.notizen ?? originalDoc.notizen ?? []), { am: jetzt, von: 'team', text }];
  };
  const verlauf = (text: string) => {
    data.verlauf = [...(data.verlauf ?? originalDoc.verlauf ?? []), { am: jetzt, von: 'team', text }];
  };

  const gespeichert = originalDoc.zahlung;
  const formularZahlung = data.zahlung?.status;
  if (
    gespeichert?.status === 'bezahlt'
    && gespeichert.anbieterRef
    && (formularZahlung === 'offen' || formularZahlung === 'fehlgeschlagen')
  ) {
    throw new APIError(MELDUNG_ZAHLUNG_EINGEGANGEN, 409);
  }
  if (
    originalDoc.status === 'storniert'
    && gespeichert?.status === 'fehlgeschlagen'
    && data.status
    && data.status !== 'storniert'
    && formularZahlung === 'offen'
  ) {
    throw new APIError(MELDUNG_TERMIN_FREIGEGEBEN, 409);
  }
  if (Array.isArray(data.notizen) && originalDoc.notizen?.length) {
    data.notizen = notizenZusammenfuehren(data.notizen, originalDoc.notizen);
  }

  const zahlungAlt = originalDoc.zahlung?.status ?? null;
  const zahlungNeu = data.zahlung?.status ?? zahlungAlt;
  if (data.zahlung && zahlungNeu !== zahlungAlt) {
    data.zahlung = { ...data.zahlung };
    if (zahlungNeu === 'bezahlt') {
      if (!originalDoc.zahlung?.bezahltAm) data.zahlung.bezahltAm = jetzt;
      vorhaben.zahlungsMail = true;
      vorhaben.vertrag = true;
      // Freigegebene Fotoanfrage von Hand bezahlt (Überweisung, bar): Auftrag erteilt.
      if (fotoanfrage && (data.status ?? originalDoc.status) === 'freigegeben') {
        if (!data.zahlung.umfang && mitPreis) data.zahlung = { ...data.zahlung, umfang: 'gesamt', betragCent: preis };
        data.status = 'in-fertigung';
        verlauf(auftragErteiltVerlauf(freigabe?.einsendenNoetig === true));
      }
    }
    notiz(
      `Zahlungsstand von Hand von „${ZAHLUNGSSTAND[zahlungAlt ?? ''] ?? '–'}“ auf „${ZAHLUNGSSTAND[zahlungNeu ?? ''] ?? '–'}“ `
        + `gesetzt (${bearbeiter}).`,
    );
  }

  const statusWechsel = Boolean(data.status && data.status !== originalDoc.status);
  if (data.status && data.status !== originalDoc.status) {
    // Statusverlauf (Erg. Leitfaden §2): intern mit altem und neuem Status, Zeit und Bearbeiter.
    notiz(`Status von „${statusBezeichnung(originalDoc.status)}“ auf „${statusBezeichnung(data.status)}“ geändert (${bearbeiter}).`);
    // Für den Kunden nur die Schritte der Foto-Prüfung (Statusabfrage).
    const kundentext = fotoanfrage ? fotoanfrageVerlauf(data.status, mitPreis) : null;
    if (kundentext) verlauf(kundentext);

    // Foto-Freigabe: Zeitpunkt der ersten Freigabe festhalten (Systemfeld).
    if (data.status === 'freigegeben' && !originalDoc.freigabe?.freigegebenAm) {
      data.freigabe = { ...(data.freigabe ?? originalDoc.freigabe ?? {}), freigegebenAm: jetzt };
    }
    const zahlung = originalDoc.zahlung;
    // Storniert, abgelehnt (bei jeder Art) oder Rückfrage zur Fotoanfrage: Eine offene Zahlungsseite gilt nicht mehr.
    const zahlungBeenden =
      data.status === 'storniert' || data.status === 'nicht-moeglich' || (fotoanfrage && data.status === 'wartet-auf-kunde');
    if (zahlungBeenden && zahlung?.status === 'offen' && zahlung.checkoutSitzung) {
      vorhaben.sitzungBeenden = zahlung.checkoutSitzung;
    }
    if (informieren && istStatusMitMail(data.status)) {
      const nachricht = (data.nachrichtAnKunde ?? originalDoc.nachrichtAnKunde ?? '').trim();
      vorhaben.statusMail = { status: data.status, ...(nachricht ? { nachricht } : {}) };
      data.nachrichtAnKunde = '';
    }
    // Das Häkchen gilt nur für diesen einen Wechsel.
    data.kundeInformieren = true;
    // Annahme durch das Team: Ohne Online-Zahlung ist das der Vertragsschluss
    // (§ 3 Abs. 3, § 4 Abs. 2 der AGB) — die Bestätigung geht unabhängig vom Häkchen.
    if (BESTAETIGENDE_STATUS.includes(data.status)) vorhaben.vertrag = true;
  }

  // Foto-Freigabe mit Preis: Zahlung anlegen — beim Wechsel auf „Freigegeben“
  // oder wenn der Preis danach eingetragen bzw. geändert wird.
  if (fotoanfrage && (data.status ?? originalDoc.status) === 'freigegeben' && mitPreis) {
    const alt = originalDoc.zahlung;
    const erledigt = alt?.status === 'bezahlt' || alt?.status === 'erstattet';
    const betragAlt = alt?.umfang ? (alt.betragCent ?? null) : null;
    if (!erledigt && (statusWechsel || betragAlt !== preis)) {
      if (alt?.status === 'offen' && alt.checkoutSitzung) vorhaben.sitzungBeenden = alt.checkoutSitzung;
      data.zahlung = {
        ...(data.zahlung ?? alt ?? {}),
        umfang: 'gesamt',
        betragCent: preis,
        status: 'offen',
        anbieterRef: null,
        checkoutSitzung: null,
        ablaufAm: null,
        bezahltAm: null,
        erstattetCent: null,
      };
      notiz(
        betragAlt === null
          ? `Zahlung über ${formatCents(preis)} zur Freigabe angelegt (${bearbeiter}).`
          : betragAlt === preis
            ? `Zahlung über ${formatCents(preis)} zur Freigabe wieder geöffnet (${bearbeiter}).`
            : `Betrag zur Freigabe von ${formatCents(betragAlt)} auf ${formatCents(preis)} geändert (${bearbeiter}).`,
      );
      // Preis nachgetragen, Status unverändert: Freigabe mit Zahlungslink erneut senden.
      if (!statusWechsel && informieren) {
        const nachricht = (data.nachrichtAnKunde ?? originalDoc.nachrichtAnKunde ?? '').trim();
        vorhaben.statusMail = { status: 'freigegeben', ...(nachricht ? { nachricht } : {}) };
        data.nachrichtAnKunde = '';
        data.kundeInformieren = true;
      }
    }
  }

  // Freigabepreis entfernt, Freigabe bleibt: Die offene Zahlung zum alten Betrag gilt nicht mehr.
  // Der Kunde bekommt den Zahlungslink erst wieder mit einem neuen Preis.
  const offeneZahlung = originalDoc.zahlung;
  if (
    fotoanfrage
    && (data.status ?? originalDoc.status) === 'freigegeben'
    && !mitPreis
    && offeneZahlung?.umfang
    && (offeneZahlung.status === 'offen' || offeneZahlung.status === 'fehlgeschlagen')
  ) {
    if (offeneZahlung.status === 'offen' && offeneZahlung.checkoutSitzung) vorhaben.sitzungBeenden = offeneZahlung.checkoutSitzung;
    data.zahlung = {
      ...(data.zahlung ?? offeneZahlung),
      umfang: null,
      betragCent: null,
      status: null,
      checkoutSitzung: null,
      ablaufAm: null,
    };
    notiz(`Freigabepreis entfernt – Zahlung zur Freigabe zurückgezogen (${bearbeiter}).`);
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
 *
 * Das Kennzeichen steht nur im eigenen Kontext dieses Aufrufs: Bei der
 * Sammelbearbeitung teilen sich alle Vorgänge dasselbe `req` und laufen
 * parallel — am geteilten `req.context` unterdrückte es die Mails der übrigen.
 * Die Transaktion (`transactionID`) bleibt geteilt.
 */
export async function vorgangVermerken(
  req: PayloadRequest,
  id: number,
  daten: Parameters<typeof vorgangAenderungZuPayload>[0],
): Promise<Vorgaenge> {
  const eigenerReq = isolateObjectProperty(req, 'context');
  eigenerReq.context = { ...req.context, [SYSTEM_AENDERUNG]: true };
  return (await req.payload.update({
    collection: 'vorgaenge',
    id,
    data: vorgangAenderungZuPayload(daten),
    overrideAccess: true,
    depth: 0,
    req: eigenerReq,
  })) as Vorgaenge;
}

/**
 * Zusätze zur Freigabe-Mail einer Fotoanfrage: neuer persönlicher Link zur
 * Zahlung (nur mit Online-Zahlung und offenem Betrag) und die Anschrift für
 * die Einsendung. Der Link-Schlüssel selbst wird nie gespeichert, nur sein
 * Hash — und der erst, wenn die Mail mit ihm rausging.
 */
async function freigabeAngaben(
  vorgang: BusinessRecord,
  status: StatusMitMail,
  settings: Settings | undefined,
  site: string,
): Promise<{ mail: Pick<StatusMailDaten, 'zahlungsLink' | 'einsendeAnschrift'>; hash?: string }> {
  if (status !== 'freigegeben' || !istFotoanfrage(vorgang)) return { mail: {} };
  const mail: Pick<StatusMailDaten, 'zahlungsLink' | 'einsendeAnschrift'> = {};
  let hash: string | undefined;
  if (freigabeZahlbar(vorgang) && zahlungKonfiguration()) {
    // Erst hier laden: Der Link-Schlüssel gehört zum Server der Seite.
    const { createAccessToken } = await import('../../lib/server/access-token');
    const neu = createAccessToken();
    mail.zahlungsLink = vorgangsLink(site, vorgang.id, neu.token);
    hash = neu.hash;
  }
  if (vorgang.approval?.sendInRequired) {
    // Erst hier laden: Die Firmendaten importieren mit `@/`-Pfaden.
    const { einsendeAnschrift } = await import('../../lib/mail/einsendung');
    mail.einsendeAnschrift = einsendeAnschrift(settings?.company);
  }
  return { mail, hash };
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

  if ((!vorhaben.statusMail && !vorhaben.zahlungsMail && !vorhaben.vertrag) || !mailKonfiguration()) return doc;

  const vorgang = vorgangZuSeite(doc);
  const settings = await einstellungenLaden(req);
  const kontext = vorlagenKontext(settings);
  const antwortAn = antwortAdresse(settings?.company);
  const eintraege: MailLogEntry[] = [];
  /** Neuer Link-Schlüssel aus der Freigabe-Mail — nur, wenn sie mit ihm rausging. */
  let neuerLink: string | undefined;

  if (vorhaben.statusMail) {
    const { status, nachricht } = vorhaben.statusMail;
    const freigabe = await freigabeAngaben(vorgang, status, settings, kontext.site);
    const eintrag = await sendeVorlage({
      art: mailArtZumStatus(status),
      an: vorgang.contact.email,
      inhalt: statusMail({ vorgang, status, nachricht, kontext, ...freigabe.mail }),
      antwortAn,
      idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, `status-${status}`, doc.updatedAt),
    });
    eintraege.push(eintrag);
    // „Gesendet“ umfasst auch „möglicherweise gesendet“ (siehe versand.ts). Bei einer
    // Zeitüberschreitung kann die Mail ebenfalls angekommen sein — dann muss ihr Link gelten.
    const vielleichtZugestellt = eintrag.result === 'fehlgeschlagen' && /Zeitlimit/.test(eintrag.error ?? '');
    if (freigabe.hash && (eintrag.result === 'gesendet' || vielleichtZugestellt)) neuerLink = freigabe.hash;
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
  if (vorhaben.vertrag && vertragsbestaetigungOffen(vorgang)) {
    if (settings) {
      // Erst hier laden: Die Zahlarten lesen die Umgebung der Seite.
      const { onlineZahlarten } = await import('../../lib/rechtliches/zahlarten');
      const eintrag = await sendeVertragsbestaetigung({ vorgang, settings, zahlarten: onlineZahlarten() });
      if (eintrag) eintraege.push(eintrag);
    } else {
      req.payload.logger.warn({ msg: `Vertragsbestätigung zu Vorgang ${doc.id} nicht gesendet: Einstellungen fehlen` });
    }
  }
  if (eintraege.length === 0) return doc;

  try {
    const neu = await vorgangVermerken(req, doc.id, {
      mailLog: [...(vorgang.mailLog ?? []), ...eintraege],
      ...(neuerLink
        ? {
            accessTokenHash: neuerLink,
            internalNotes: [
              ...vorgang.internalNotes,
              {
                at: new Date().toISOString(),
                actor: 'system' as const,
                message: 'Freigabe mit neuem persönlichem Zahlungslink gesendet; der bisherige Link gilt nicht mehr.',
              },
            ],
          }
        : {}),
    });
    return { ...doc, mails: neu.mails, notizen: neu.notizen };
  } catch (error) {
    req.payload.logger.error({ msg: `Mailprotokoll zu Vorgang ${doc.id} nicht gespeichert`, err: error });
    return doc;
  }
};
