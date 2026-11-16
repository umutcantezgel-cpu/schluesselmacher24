/*
 * Sendung des Kunden zur Werkstatt (FA-SHOP-03B, A-050 Punkte 6 und 8): Sendungsnummer prüfen und
 * bereinigen, am Vorgang eintragen, für Kunden anzeigen und den Stand der Einsendung in einfacher
 * Sprache. Getrennt von der Rücksendung an den Kunden (`BusinessRecord.shipment`).
 *
 * Reine Funktionen ohne Seiteneffekte, nur relative Importe (Seite, Server-Aktion, Mail, Vorgangsblatt).
 */

import { kundenStatus, type KundenStatus } from '../kundenstatus';
import { DIENSTLEISTER, verfolgungsLink } from '../mail/vorlagen/status';
import type { BusinessRecord, EinsendeEinstellungen, EinsendeSendung, EinsendeVarianteKennung, ShipmentCarrier, TimelineEntry } from '../types';
import { istVariantenKennung, versandBezeichnung } from '../versand/varianten';

import { istEinsendung, type EinsendePayload } from './vorgang';

/** Länge einer bereinigten Sendungsnummer (Briefe und Pakete der Post und von DHL liegen darin). */
export const SENDUNGSNUMMER_MIN = 8;
export const SENDUNGSNUMMER_MAX = 40;

/**
 * Bereinigt die Eingabe: Leerzeichen, Bindestriche, Punkte und Schrägstriche fallen weg, Buchstaben
 * werden groß. Gültig sind danach nur Buchstaben und Ziffern in der erlaubten Länge; sonst `null`.
 */
export function bereinigeSendungsnummer(roh: unknown): string | null {
  if (typeof roh !== 'string' || roh.length > SENDUNGSNUMMER_MAX * 2) return null;
  const nummer = roh.replace(/[\s\-./]/g, '').toUpperCase();
  const muster = new RegExp(`^[A-Z0-9]{${SENDUNGSNUMMER_MIN},${SENDUNGSNUMMER_MAX}}$`);
  return muster.test(nummer) ? nummer : null;
}

/** Wer die Sendung befördert: DHL Paket über DHL, Einschreiben über die Deutsche Post. */
export function dienstleisterFuerVariante(art: unknown): ShipmentCarrier | undefined {
  if (art === 'dhl-paket') return 'dhl';
  if (art === 'einschreiben-einwurf' || art === 'einschreiben-wert' || art === 'versichert' || art === 'unversichert') return 'deutsche-post';
  return undefined;
}

type Vorgang = Pick<BusinessRecord, 'kind' | 'area' | 'status'> & {
  payload?: Record<string, unknown>;
  approval?: BusinessRecord['approval'];
  einsendeSendung?: EinsendeSendung;
  shipment?: BusinessRecord['shipment'];
};

/**
 * Erwartet die Werkstatt gerade eine Sendung des Kunden? Bei der Einsendung bis zum Eingang (Status
 * „neu“), bei der Freigabe mit Einsendung, solange sie freigegeben oder in Fertigung ist. Dieselbe
 * Regel wie für den Begleitschein (`begleitscheinAnzeigen`).
 */
export function sendungErwartet(vorgang: Vorgang): boolean {
  if (istEinsendung(vorgang)) return vorgang.status === 'neu';
  return vorgang.approval?.sendInRequired === true && (vorgang.status === 'freigegeben' || vorgang.status === 'in-fertigung');
}

/** Variante der Sendung zur Werkstatt: bei der Einsendung aus dem Formular, sonst die am Vorgang gespeicherte. */
export function varianteDerSendung(vorgang: Vorgang): EinsendePayload['versand'] | undefined {
  if (istEinsendung(vorgang)) {
    const art = (vorgang.payload as unknown as EinsendePayload).versand;
    return istVariantenKennung(art) || art === 'versichert' || art === 'unversichert' ? art : undefined;
  }
  return vorgang.einsendeSendung?.variant;
}

export type SendungsnummerGrund = 'zugang' | 'nicht-erwartet' | 'nummer' | 'variante';

/** Meldungen für den Kunden, ohne zu verraten, ob es den Vorgang gibt. */
export const SENDUNGSNUMMER_MELDUNG: Record<SendungsnummerGrund | 'gespeichert' | 'fehler', string> = {
  zugang: 'Dieser Link ist ungültig. Bitte nutzen Sie den Link aus Ihrer Bestätigung.',
  'nicht-erwartet': 'Für diesen Vorgang erwarten wir gerade keine Sendung. Bei Fragen erreichen Sie uns über die Kontaktseite.',
  nummer: 'Bitte prüfen Sie die Sendungsnummer. Sie besteht aus Buchstaben und Ziffern, meist 12 bis 20 Zeichen.',
  variante: 'Bitte wählen Sie, wie Sie den Schlüssel schicken.',
  gespeichert: 'Danke. Ihre Sendungsnummer ist gespeichert.',
  fehler: 'Die Sendungsnummer konnte gerade nicht gespeichert werden. Bitte versuchen Sie es in einigen Minuten erneut.',
};

export interface SendungsnummerEingabe {
  /** Link-Schlüssel des Vorgangs geprüft (unter der Sperre des Vorgangs). */
  zugangGueltig: boolean;
  nummer: unknown;
  /** Nur bei der Freigabe mit Einsendung: die Wahl des Kunden. */
  variante?: unknown;
  /** Varianten, die die Vorgangsseite anbietet (bei der Freigabe Pflicht für die Prüfung der Wahl). */
  angeboten?: readonly EinsendeVarianteKennung[];
  jetzt: string;
}

export type SendungsnummerErgebnis =
  | { ok: true; aenderung: { einsendeSendung: EinsendeSendung; timeline: TimelineEntry[] } | null; nummer: string }
  | { ok: false; grund: SendungsnummerGrund };

/**
 * Trägt die Sendungsnummer des Kunden ein. Ohne gültigen Zugang, außerhalb der Zeit, in der wir die
 * Sendung erwarten, mit ungültiger Nummer oder einer Variante, die die Seite nicht anbietet, ändert sich
 * nichts. Dieselbe Nummer noch einmal ergibt keine Änderung (`aenderung: null`).
 */
export function sendungsnummerAnwenden(
  vorgang: Vorgang & Pick<BusinessRecord, 'timeline'>,
  eingabe: SendungsnummerEingabe,
): SendungsnummerErgebnis {
  if (!eingabe.zugangGueltig) return { ok: false, grund: 'zugang' };
  if (!sendungErwartet(vorgang)) return { ok: false, grund: 'nicht-erwartet' };
  const nummer = bereinigeSendungsnummer(eingabe.nummer);
  if (!nummer) return { ok: false, grund: 'nummer' };

  let variante: EinsendeVarianteKennung | undefined;
  if (istEinsendung(vorgang)) {
    const art = varianteDerSendung(vorgang);
    variante = istVariantenKennung(art) ? art : undefined;
  } else {
    if (!istVariantenKennung(eingabe.variante) || !(eingabe.angeboten ?? []).includes(eingabe.variante)) return { ok: false, grund: 'variante' };
    variante = eingabe.variante;
  }

  const vorher = vorgang.einsendeSendung;
  if (vorher?.trackingNumber === nummer && vorher.variant === variante) return { ok: true, aenderung: null, nummer };

  const carrier = dienstleisterFuerVariante(istEinsendung(vorgang) ? varianteDerSendung(vorgang) : variante);
  const einsendeSendung: EinsendeSendung = {
    trackingNumber: nummer,
    ...(carrier ? { carrier } : {}),
    ...(variante ? { variant: variante } : {}),
    enteredAt: eingabe.jetzt,
    enteredBy: 'kunde',
  };
  const text = vorher?.trackingNumber
    ? `Sendungsnummer Ihrer Sendung an uns geändert: ${nummer}.`
    : `Sendungsnummer Ihrer Sendung an uns eingetragen: ${nummer}.`;
  return {
    ok: true,
    nummer,
    aenderung: { einsendeSendung, timeline: [...vorgang.timeline, { at: eingabe.jetzt, actor: 'kunde', message: text }] },
  };
}

/** Sendung zur Werkstatt für Kunden: Nummer, Dienstleister, öffentlicher Verfolgungslink, Variante. */
export interface KundenEinsendeSendung {
  nummer: string;
  dienstleister?: string;
  link?: string;
  variante?: string;
}

export function kundenEinsendeSendung(
  vorgang: Vorgang,
  einstellungen?: Pick<EinsendeEinstellungen, 'varianten'>,
): KundenEinsendeSendung | undefined {
  const nummer = vorgang.einsendeSendung?.trackingNumber?.trim();
  if (!nummer) return undefined;
  const carrier = vorgang.einsendeSendung?.carrier ?? dienstleisterFuerVariante(varianteDerSendung(vorgang));
  const art = varianteDerSendung(vorgang);
  const link = verfolgungsLink(carrier, nummer) ?? undefined;
  return {
    nummer,
    ...(carrier ? { dienstleister: DIENSTLEISTER[carrier] } : {}),
    ...(link ? { link } : {}),
    ...(art ? { variante: versandBezeichnung(art, einstellungen) } : {}),
  };
}

/** Stand „unterwegs zu uns“: nur bei der Einsendung im Status „neu“ und nur mit Sendungsnummer. */
export const EINSENDE_UNTERWEGS = {
  label: 'Unterwegs zu uns',
  text: 'Ihre Sendung ist auf dem Weg zu uns. Sobald der Schlüssel bei uns ist, sehen Sie es hier.',
} as const;

/** Kundenstatus mit dem Stand „unterwegs zu uns“; sonst wie `kundenStatus`. */
export function einsendeKundenStatus(vorgang: Vorgang): KundenStatus {
  if (istEinsendung(vorgang) && vorgang.status === 'neu' && vorgang.einsendeSendung?.trackingNumber) {
    return { ...EINSENDE_UNTERWEGS, titel: EINSENDE_UNTERWEGS.label, erledigt: false };
  }
  return kundenStatus(vorgang);
}

export type EinsendeSchrittKennung = 'angemeldet' | 'unterwegs' | 'eingegangen' | 'angebot' | 'fertigung' | 'rueckversand';

export interface EinsendeSchritt {
  kennung: EinsendeSchrittKennung;
  titel: string;
  /** Zusatz, etwa die Sendungsnummer. */
  zusatz?: string;
  stand: 'erledigt' | 'aktuell' | 'offen';
}

const SCHRITT_TITEL: Record<EinsendeSchrittKennung, string> = {
  angemeldet: 'Angemeldet',
  unterwegs: 'Unterwegs zu uns',
  eingegangen: 'Eingegangen',
  angebot: 'Geprüft, Angebot',
  fertigung: 'In Fertigung',
  rueckversand: 'Rückversand',
};

/** Welcher Schritt zu welchem Status gehört (vorhandene Stände, nichts Neues am Status). */
function aktuellerSchritt(vorgang: Vorgang): EinsendeSchrittKennung | null {
  switch (vorgang.status) {
    case 'neu':
      return vorgang.einsendeSendung?.trackingNumber ? 'unterwegs' : 'angemeldet';
    case 'in-pruefung':
      return 'eingegangen';
    case 'geprueft':
    case 'freigegeben':
    case 'wartet-auf-kunde':
    case 'terminiert':
      return 'angebot';
    case 'in-fertigung':
      return 'fertigung';
    case 'versendet':
    case 'abgeschlossen':
      return 'rueckversand';
    default:
      // Storniert und nicht möglich: Der Statustext sagt, was geschieht; keine Schrittfolge.
      return null;
  }
}

/**
 * Stand der Einsendung als Schritte für die Vorgangsseite (A-050, Punkt 8): angemeldet, unterwegs zu
 * uns (nur mit Sendungsnummer), eingegangen, geprüft mit Angebot, in Fertigung, Rückversand mit
 * Sendungsnummer. `null` für Vorgänge, die keine Einsendung sind, und für erledigte ohne Rückversand.
 */
export function einsendeStand(vorgang: Vorgang): EinsendeSchritt[] | null {
  if (!istEinsendung(vorgang)) return null;
  const aktuell = aktuellerSchritt(vorgang);
  if (!aktuell) return null;
  const nummerZuUns = vorgang.einsendeSendung?.trackingNumber;
  const reihe: EinsendeSchrittKennung[] = ['angemeldet', ...(nummerZuUns ? (['unterwegs'] as const) : []), 'eingegangen', 'angebot', 'fertigung', 'rueckversand'];
  const index = reihe.indexOf(aktuell);
  const rueckNummer = vorgang.shipment?.trackingNumber?.trim();
  return reihe.map((kennung, i): EinsendeSchritt => {
    const stand = i < index || (kennung === 'rueckversand' && vorgang.status === 'abgeschlossen') ? 'erledigt' : i === index ? 'aktuell' : 'offen';
    const zusatz =
      kennung === 'unterwegs' && nummerZuUns
        ? `Sendungsnummer ${nummerZuUns}`
        : kennung === 'rueckversand' && rueckNummer && stand !== 'offen'
          ? `Sendungsnummer ${rueckNummer}`
          : undefined;
    return { kennung, titel: SCHRITT_TITEL[kennung], ...(zusatz ? { zusatz } : {}), stand };
  });
}
