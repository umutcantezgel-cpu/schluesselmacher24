/*
 * Schlüssel einschicken (G-24 bis G-26, E6-OPUS-02): die Angaben einer Einsendung, ihre Prüfung auf dem
 * Server und die Texte für Zusammenfassung und Status.
 *
 * Eine Einsendung ist ein Vorgang „Schlüssel nach Vorlage“ (kind anfrage, area schluessel-nach-vorlage)
 * mit der Quelle „einsenden“; die Vorlage ist hier der eingeschickte Schlüssel statt der Fotos. Damit
 * gelten Freigabe mit Preis und Zahlungslink, der Nachweis der Sicherungskarte (R13) und die Statusseite
 * wie bei der Foto-Anfrage, ohne einen Zahlungsablauf zu verändern (G9). Gewünschte Kopien stehen wie
 * dort in `stueckzahl`.
 *
 * Reine Funktionen ohne Seiteneffekte, im Browser und auf dem Server nutzbar.
 */

// Nur relative Importe: Mails und Datenabbildung laden dieses Modul auch in Backend-Hooks.
import { istFotoanfrage } from '../foto-freigabe';
import type { BusinessRecord, ContactDetails, EinsendeVariante, RecordStatus, SummarySection, UploadRef } from '../types';
import type { VersandArt } from '../versand/typen';
import {
  SCHLUESSELARTEN,
  STANDARD_VARIANTEN,
  brauchtFahrzeugschein,
  istSchluesselart,
  istVariantenKennung,
  versandBezeichnung,
  type Schluesselart,
} from '../versand/varianten';
import { KARTEN_LABEL, kartenAntwort } from '../wege/nachweis';

export const EINSENDE_QUELLE = 'einsenden';
export const MAX_ORIGINALE = 10;
export const MAX_KOPIEN = 20;
export const BESCHRIFTUNG_HOECHSTENS = 80;
export const HINWEIS_HOECHSTENS = 1000;

/** Bezeichnung der Versandart; „versichert“ und „unversichert“ nur für ältere Vorgänge (G6, A-050). */
export const VERSAND_LABEL: Record<VersandArt, string> = {
  'dhl-paket': versandBezeichnung('dhl-paket'),
  'einschreiben-einwurf': versandBezeichnung('einschreiben-einwurf'),
  'einschreiben-wert': versandBezeichnung('einschreiben-wert'),
  versichert: versandBezeichnung('versichert'),
  unversichert: versandBezeichnung('unversichert'),
};

const ARTEN_TITEL: Record<Schluesselart, string> = Object.fromEntries(SCHLUESSELARTEN.map((a) => [a.wert, a.titel])) as Record<Schluesselart, string>;

/** Die geprüften Angaben einer Einsendung, wie sie im Vorgang stehen. */
export interface EinsendePayload {
  quelle: typeof EINSENDE_QUELLE;
  /** Schlüssel im Umschlag. */
  originale: number;
  /** Gewünschte Kopien insgesamt (Feldname wie bei der Foto-Anfrage). */
  stueckzahl: number;
  beschriftung: string | null;
  hinweis: string | null;
  sicherungskarte: 'ja' | 'nein' | 'unklar';
  /** Was eingeschickt wird (A-050, Punkt 3); fehlt bei älteren Vorgängen. */
  schluesselart?: Schluesselart;
  /** Der Kunde gibt den Schlüssel als wertvoll an; dann ist DHL Paket empfohlen. */
  wertvoll?: boolean;
  /** Eine Variante des Inhabers; „versichert“ und „unversichert“ nur bei älteren Vorgängen. */
  versand: VersandArt;
  /** Sonderfall (Einschreiben Wert) ausdrücklich gewählt und den Hinweis bestätigt. */
  sonderfallBestaetigt?: boolean;
  /** Das Original liegt der Werkstatt vor, sobald die Sendung eingeht. */
  originalEingesendet: true;
}

/** `fehler`: Meldung für den Kunden, wenn er sie beheben kann (zum Beispiel der fehlende Fahrzeugschein). */
type Ergebnis = { ok: true; payload: EinsendePayload; summary: SummarySection[] } | { ok: false; fehler?: string };

/** Was der Server zum Berechtigungsnachweis einer Einsendung übergibt (R13). */
export interface EinsendeNachweis {
  uploads: readonly Pick<UploadRef, 'category' | 'storageKey' | 'uploadToken'>[];
  ablageEingerichtet: boolean;
}

const ganz = (wert: unknown, von: number, bis: number): number | null =>
  typeof wert === 'number' && Number.isInteger(wert) && wert >= von && wert <= bis ? wert : null;

const text = (wert: unknown, hoechstens: number): string | null | false => {
  if (wert === null || wert === undefined) return null;
  if (typeof wert !== 'string') return false;
  const getrimmt = wert.trim();
  if (getrimmt.length > hoechstens) return false;
  return getrimmt || null;
};

/** Rücksendeanschrift vollständig: Straße, fünfstellige Postleitzahl, Ort. */
export function ruecksendeanschriftVollstaendig(contact: Pick<ContactDetails, 'street' | 'postalCode' | 'city'>): boolean {
  return Boolean(contact.street?.trim()) && /^\d{5}$/.test(contact.postalCode?.trim() ?? '') && Boolean(contact.city?.trim());
}

/** Was im Umschlag liegt, für Begleitschein und Zusammenfassung: „2 Schlüssel zum Nachmachen“. */
export function inhaltText(p: Pick<EinsendePayload, 'originale'>): string {
  return `${p.originale} Schlüssel zum Nachmachen`;
}

/** Zusammenfassung für Vorgang, Bestätigung und Vorgangsblatt; gebaut aus geprüften Angaben. */
export function einsendeZusammenfassung(p: EinsendePayload, contact: ContactDetails, varianten?: readonly EinsendeVariante[]): SummarySection[] {
  const anschrift = [contact.street, [contact.postalCode, contact.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  return [
    {
      title: 'Einsendung',
      rows: [
        { label: 'Im Umschlag', value: inhaltText(p) },
        { label: 'Gewünschte Kopien', value: String(p.stueckzahl) },
        { label: 'Beschriftung', value: p.beschriftung ?? 'keine Angabe' },
        ...(p.schluesselart ? [{ label: 'Schlüsselart', value: ARTEN_TITEL[p.schluesselart] }] : []),
        ...(p.wertvoll ? [{ label: 'Wertvoll', value: 'ja, laut Kunde' }] : []),
        { label: brauchtFahrzeugschein(p.schluesselart) ? 'Nachweis' : 'Sicherungskarte', value: brauchtFahrzeugschein(p.schluesselart) ? 'Fahrzeugschein (Pflicht)' : KARTEN_LABEL[p.sicherungskarte] },
        // Name der Variante aus den Einstellungen, wenn übergeben (wie Formular und Begleitschein).
        { label: 'Versand', value: varianten ? versandBezeichnung(p.versand, { varianten: [...varianten] }) : (VERSAND_LABEL[p.versand] ?? 'keine Angabe') },
        ...(p.sonderfallBestaetigt ? [{ label: 'Sonderfall', value: 'Hinweis bestätigt' }] : []),
        ...(p.hinweis ? [{ label: 'Hinweis', value: p.hinweis }] : []),
      ],
    },
    {
      title: 'Kontakt und Rücksendung',
      rows: [
        { label: 'Name', value: [contact.salutation, contact.firstName, contact.lastName].filter(Boolean).join(' ') },
        ...(contact.company ? [{ label: 'Firma', value: contact.company }] : []),
        { label: 'E-Mail', value: contact.email },
        { label: 'Telefon', value: contact.phone },
        { label: 'Rücksendung an', value: anschrift },
      ],
    },
  ];
}

/**
 * Prüft die Angaben aus dem Browser und baut daraus Payload und Zusammenfassung neu; nichts davon
 * wird ungeprüft übernommen. Ohne vollständige Rücksendeanschrift keine Einsendung.
 *
 * `varianten`: die Varianten aus den Einstellungen (`variantenAus(settings.sendIn)`); nur dann gelten
 * „aktiv“ und „nur Sonderfall“ aus dem Admin auch auf dem Server. Die Startwerte sind nur die Vorgabe
 * für Tests und ältere Aufrufer.
 *
 * `nachweis`: Uploads und Ablage-Stand. Ein Fahrzeugschlüssel wird nur mit Fahrzeugschein angenommen
 * (R13); fehlt die Angabe, lehnt die Funktion ihn ab (sicher voreingestellt).
 */
export function einsendeVorgang(
  roh: Record<string, unknown>,
  contact: ContactDetails,
  varianten: readonly EinsendeVariante[] = STANDARD_VARIANTEN,
  nachweis?: EinsendeNachweis,
): Ergebnis {
  if (roh.quelle !== EINSENDE_QUELLE) return { ok: false };
  const originale = ganz(roh.originale, 1, MAX_ORIGINALE);
  const stueckzahl = ganz(roh.stueckzahl, 1, MAX_KOPIEN);
  const beschriftung = text(roh.beschriftung, BESCHRIFTUNG_HOECHSTENS);
  const hinweis = text(roh.hinweis, HINWEIS_HOECHSTENS);
  const sicherungskarte = kartenAntwort(roh.sicherungskarte);
  // Nur die Varianten des Inhabers; „versichert“ und „unversichert“ wählt niemand mehr (A-050).
  const variante = istVariantenKennung(roh.versand) ? varianten.find((v) => v.kennung === roh.versand && v.aktiv) : undefined;
  const schluesselart = istSchluesselart(roh.schluesselart) ? roh.schluesselart : null;
  if (roh.wertvoll !== undefined && typeof roh.wertvoll !== 'boolean') return { ok: false };
  const wertvoll = roh.wertvoll === true;
  const sonderfallBestaetigt = roh.sonderfallBestaetigt === true;
  if (originale === null || stueckzahl === null || beschriftung === false || hinweis === false || !sicherungskarte || !variante || !schluesselart) {
    return { ok: false };
  }
  // Sonderfall nur mit ausdrücklicher Bestätigung des Hinweises (A-050, Punkt 1).
  if (variante.nurSonderfall && !sonderfallBestaetigt) return { ok: false };
  if (!ruecksendeanschriftVollstaendig(contact)) return { ok: false };
  // Berechtigungsnachweis für Fahrzeugschlüssel (R13, A-050 Punkt 3): ohne geprüften Fahrzeugschein keine Einsendung.
  if (brauchtFahrzeugschein(schluesselart)) {
    const fehlt = nachweis ? einsendeNachweisPruefen({ schluesselart }, nachweis.uploads, nachweis.ablageEingerichtet) : EINSENDUNG_FAHRZEUGSCHEIN_FEHLT;
    if (fehlt) return { ok: false, fehler: fehlt };
  }
  const payload: EinsendePayload = {
    quelle: EINSENDE_QUELLE,
    originale,
    stueckzahl,
    beschriftung,
    hinweis,
    sicherungskarte,
    schluesselart,
    wertvoll,
    versand: variante.kennung,
    ...(variante.nurSonderfall ? { sonderfallBestaetigt: true } : {}),
    originalEingesendet: true,
  };
  return { ok: true, payload, summary: einsendeZusammenfassung(payload, contact, varianten) };
}

/** Meldung, wenn der Fahrzeugschein fehlt (R13). */
export const EINSENDUNG_FAHRZEUGSCHEIN_FEHLT =
  'Für einen Autoschlüssel brauchen wir Ihren Fahrzeugschein (Zulassungsbescheinigung Teil I). Bitte laden Sie ein Foto oder eine Datei hoch.';

/**
 * Berechtigungsnachweis einer Einsendung (R13): Bei Fahrzeugschlüsseln gehört der Fahrzeugschein dazu.
 * Mit eingerichteter Dateiablage zählt nur eine hochgeladene Datei. Meldung oder `null`.
 * `einsendeVorgang` ruft diese Prüfung auf, wenn der Aufrufer den Nachweis übergibt; ohne Nachweis lehnt
 * sie Fahrzeugschlüssel ab.
 */
export function einsendeNachweisPruefen(
  payload: Pick<EinsendePayload, 'schluesselart'> | Record<string, unknown>,
  uploads: readonly Pick<UploadRef, 'category' | 'storageKey' | 'uploadToken'>[],
  ablageEingerichtet: boolean,
): string | null {
  if (!brauchtFahrzeugschein(payload.schluesselart)) return null;
  const scheine = uploads.filter((u) => u.category === 'fahrzeugschein');
  const da = scheine.length > 0 && (!ablageEingerichtet || scheine.some((u) => u.storageKey && u.uploadToken));
  return da ? null : EINSENDUNG_FAHRZEUGSCHEIN_FEHLT;
}

/** Ist der Vorgang eine Einsendung? Nur Foto-Anfragen mit der Quelle „einsenden“. */
export function istEinsendung(vorgang: Pick<BusinessRecord, 'kind' | 'area'> & { payload?: Record<string, unknown> }): boolean {
  return istFotoanfrage(vorgang) && vorgang.payload?.quelle === EINSENDE_QUELLE;
}

/** Status, die bei einer Einsendung anders heißen als bei der Foto-Anfrage: Erst kommt der Schlüssel an. */
export const EINSENDE_STATUS: Partial<Record<RecordStatus, { label: string; text: string }>> = {
  neu: {
    label: 'Angemeldet',
    text: 'Wir erwarten Ihren Schlüssel. Bitte legen Sie den Begleitschein Ihrer Sendung bei.',
  },
  'in-pruefung': {
    label: 'Schlüssel eingegangen',
    text: 'Ihr Schlüssel ist bei uns angekommen und wird geprüft.',
  },
  'nicht-moeglich': {
    label: 'Nicht möglich',
    text: 'Eine Kopie ist nicht möglich. Ihr Original schicken wir Ihnen zurück.',
  },
};
