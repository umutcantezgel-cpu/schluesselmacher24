/* ==========================================================================
   Auftragsweg und Zahlung für Autoschlüssel-Aufträge (FA-KERN-03, A-049)

   Vorgabe des Inhabers (Arbeitsanweisung vom 11.11.2026, Abschnitt 05):
   - Hauptzentrale und regionaler Direkttermin: Anzahlung (Standard 69,90 Euro
     aus den Einstellungen), voll angerechnet, Rest beim Termin vor Ort.
   - Vermittelter Termin bei einem Partnerbetrieb: erst nach vollständiger
     Zahlung des Gesamtpreises verbindlich; die Anzahlung allein reicht nicht.
   - Der Kunde sieht vor der Zahlung, wo der Termin stattfindet und was fällig ist.

   Ermittlung aus Postleitzahl, gewähltem Terminstandort, Leistung, Eigenbereich
   (Einstellungen, Reiter Termine) und den Partnerbetrieben (Stand, Einsatzgebiet,
   Auftragsarten). Der Partner-Terminstandort erscheint nur mit dem Schalter
   `PARTNERMODELL_B=aktiv` (A-049: bis die rechtliche Klärung vorliegt).

   Reine Funktionen, nur relative Importe: Hooks, Mailvorlagen und der
   Assistent laden diese Datei ebenfalls.
   ========================================================================== */

import { formatCents, formatDateTime } from './format';
import { plzMusterAusText, plzPasst } from './partner/postleitzahl-muster';
// Die eine Definition der Abdeckung (FA-PLATTFORM-01C); region.ts importiert diese Datei nicht.
import type { AppointmentInfo, Auftragsweg, BusinessRecord, OwnArea, PaymentInfo, PriceQuote } from './types';

export type { Auftragsweg };

/** Alle Wege, in der Reihenfolge für Auswahl und Filter. */
export const AUFTRAGSWEGE: readonly Auftragsweg[] = ['hauptzentrale', 'eigenbereich', 'partner'];

/** Bezeichnungen für Admin, Vorgangsblatt und Export. */
export const AUFTRAGSWEG_LABEL: Record<Auftragsweg, string> = {
  hauptzentrale: 'Hauptzentrale (Werkstatt)',
  eigenbereich: 'Regionaler Eigenbereich',
  partner: 'Partnernetzwerk (vermittelt)',
};

export function istAuftragsweg(wert: unknown): wert is Auftragsweg {
  return typeof wert === 'string' && (AUFTRAGSWEGE as readonly string[]).includes(wert);
}

/** Rückfall für den Eigenbereich, wenn die Einstellungen nichts nennen (bisher fest im Code: `35`). */
export const EIGENBEREICH_STANDARD: OwnArea = { label: 'Wetzlar und Umgebung', postalPatterns: ['35*'] };

/** Auftragsart der Partnerbetriebe für Autoschlüssel-Aufträge (Sammlung `partnerbetriebe`). */
export const AUFTRAGSART_AUTOSCHLUESSEL = 'autoschluessel-vor-ort';

/* ---------- Postleitzahlen ---------------------------------------------- */

// Eigenes Modul (FA-PLATTFORM-01C, A-070): hier unverändert weitergegeben, damit kein Aufrufer bricht.
export { plzMusterAusText, plzPasst };

/** Muster des Eigenbereichs aus den Einstellungen, sonst der Rückfall `35*`. */
export function eigenbereichMuster(eigenbereich: OwnArea | undefined): string[] {
  const muster = (eigenbereich?.postalPatterns ?? []).filter((m) => /^\d{1,5}\*?$/.test(m));
  return muster.length ? muster : EIGENBEREICH_STANDARD.postalPatterns;
}

/** Liegt die Anschrift im regionalen Eigenbereich? Nur mit vollständiger deutscher Postleitzahl. */
export function imEigenbereich(postleitzahl: string, land: string | undefined, eigenbereich: OwnArea | undefined): boolean {
  if (land && land !== 'Deutschland') return false;
  return plzPasst(postleitzahl, eigenbereichMuster(eigenbereich));
}

/* ---------- Partner ----------------------------------------------------- */

/* Welche Partner eine Postleitzahl abdecken und welche Terminstandorte es damit gibt, rechnet nur der Server:
   `src/lib/auftragsweg-partner.ts` (PartnerFuerWeg, partnerFuerWegAusBetrieb, passendePartner, terminstandorte).
   Diese Datei hier laden auch Bausteine im Browser (Assistent, Preisanzeige, Bestätigung); sie importiert
   deshalb weder die Abdeckungsregel noch die Prüfliste oder die Vermittlung (Abnahme FA-PLATTFORM-01C). */

/** Ist der Partnerweg für Kunden eingeschaltet? Nur mit `PARTNERMODELL_B=aktiv` (A-049). */
export function partnerwegAktiv(env: Record<string, string | undefined> = process.env): boolean {
  return env.PARTNERMODELL_B === 'aktiv';
}

/* ---------- Terminstandorte --------------------------------------------- */

/** Was der Kunde wählt: unsere Werkstatt (Hauptzentrale) oder ein vermittelter Partnerbetrieb. */
export type Terminstandort = 'werkstatt' | 'partner';

export interface StandortAngebot {
  standort: Terminstandort;
  weg: Auftragsweg;
}

export interface StandortErmittlung {
  /** Standorte, die der Kunde wählen kann; die Werkstatt steht immer zuerst. */
  standorte: StandortAngebot[];
  /** Weg beim Werkstatttermin: `eigenbereich` innerhalb, sonst `hauptzentrale`. */
  werkstattWeg: Auftragsweg;
  /**
   * Partnerweg eingeschaltet, Postleitzahl außerhalb des Eigenbereichs, aber kein passender Partner:
   * Dann steht der ehrliche Satz `KEIN_PARTNER_HINWEIS` da.
   */
  ohnePartner: boolean;
  /** Kennungen der passenden Partner, nur für den Server und das Team, nie für den Kunden. */
  passendePartnerIds: string[];
}

/**
 * Weg zum gewählten Standort. Wählt der Browser einen Standort, den es hier nicht gibt (etwa den
 * Partner ohne Schalter), gilt der Werkstatttermin: Der Server übernimmt nie einen Weg, den er nicht
 * selbst ermittelt hat.
 */
export function wegFuerStandort(ermittlung: StandortErmittlung, gewaehlt: unknown): Auftragsweg {
  if (gewaehlt === 'partner' && ermittlung.standorte.some((s) => s.standort === 'partner')) return 'partner';
  return ermittlung.werkstattWeg;
}

/* ---------- Zahlung je Weg ---------------------------------------------- */

export type ZahlungsPlan =
  /** Direktweg: Anzahlung jetzt, voll angerechnet, Rest beim Termin (bei Festpreis bekannt). */
  | { art: 'anzahlung'; jetztCents: number; gesamtCents?: number; restCents?: number }
  /** Partnerweg mit Festpreis: Gesamtbetrag sofort. */
  | { art: 'gesamt'; jetztCents: number; gesamtCents: number }
  /** Partnerweg ohne Festpreis: Anfrage ohne Zahlung; das Team nennt den Gesamtpreis und schickt den Link. */
  | { art: 'anfrage'; jetztCents: 0 };

/**
 * Was jetzt fällig ist. Im Partnerweg wird nie nur die Anzahlung genommen: mit Festpreis der
 * Gesamtbetrag, sonst gar nichts (Anfrage). Im Direktweg bleibt die Anzahlung wie im Bestand.
 */
export function zahlungsPlan(weg: Auftragsweg, quote: PriceQuote): ZahlungsPlan {
  const fest = quote.mode === 'fest' && typeof quote.priceCents === 'number' && quote.priceCents > 0;
  if (weg === 'partner') {
    return fest ? { art: 'gesamt', jetztCents: quote.priceCents!, gesamtCents: quote.priceCents! } : { art: 'anfrage', jetztCents: 0 };
  }
  if (fest) {
    return {
      art: 'anzahlung',
      jetztCents: quote.depositCents,
      gesamtCents: quote.priceCents!,
      restCents: quote.remainderCents ?? Math.max(0, quote.priceCents! - quote.depositCents),
    };
  }
  return { art: 'anzahlung', jetztCents: quote.depositCents };
}

/**
 * Schlüssel des Zahlungsplans für die Zustimmung im Assistenten: Die Zustimmung gilt nur für den Betrag,
 * den der Kunde gesehen hat. Ändert sich der Schlüssel (anderer Standort, andere Postleitzahl und damit
 * anderer Weg), muss er neu zustimmen.
 */
export function zustimmungsSchluessel(plan: ZahlungsPlan | null | undefined): string {
  return plan ? `${plan.art}|${plan.jetztCents}` : '';
}

/** Muss die Zustimmung zur Zahlung neu gegeben werden? Nur bei einem Wechsel zwischen zwei bekannten Plänen. */
export function zustimmungNeuNoetig(vorher: string, jetzt: string): boolean {
  return Boolean(vorher && jetzt && vorher !== jetzt);
}

/** Preisrahmen oder „nach Prüfung“ als Text. */
export function preisrahmenText(quote: Pick<PriceQuote, 'mode' | 'priceFromCents' | 'priceToCents'>): string {
  if (quote.mode === 'rahmen' && typeof quote.priceFromCents === 'number') {
    return typeof quote.priceToCents === 'number' && quote.priceToCents > 0
      ? `${formatCents(quote.priceFromCents)} bis ${formatCents(quote.priceToCents)}`
      : `ab ${formatCents(quote.priceFromCents)}`;
  }
  return 'nennen wir nach Prüfung';
}

/**
 * Beträge vor der Zahlung, ohne Kleingedrucktes: „Jetzt fällig“, „Gesamtpreis“ oder Preisrahmen und im
 * Direktweg „Rest beim Termin“. Für Assistent, Bestätigung und Mail.
 */
export function faelligZeilen(weg: Auftragsweg, quote: PriceQuote): Array<{ label: string; value: string }> {
  const plan = zahlungsPlan(weg, quote);
  if (plan.art === 'gesamt') {
    return [
      { label: 'Jetzt fällig', value: formatCents(plan.jetztCents) },
      { label: 'Gesamtpreis', value: formatCents(plan.gesamtCents) },
    ];
  }
  if (plan.art === 'anfrage') {
    return [
      { label: 'Jetzt fällig', value: PARTNER_JETZT_NICHTS },
      { label: 'Preisrahmen', value: preisrahmenText(quote) },
    ];
  }
  if (typeof plan.gesamtCents === 'number') {
    return [
      { label: 'Jetzt fällig (Anzahlung)', value: formatCents(plan.jetztCents) },
      { label: 'Gesamtpreis', value: formatCents(plan.gesamtCents) },
      { label: 'Rest beim Termin', value: formatCents(plan.restCents ?? 0) },
    ];
  }
  return [
    { label: 'Jetzt fällig (Anzahlung)', value: formatCents(plan.jetztCents) },
    { label: 'Preisrahmen', value: preisrahmenText(quote) },
    { label: 'Rest beim Termin', value: 'Gesamtpreis abzüglich Anzahlung' },
  ];
}

/* ---------- Restbetrag -------------------------------------------------- */

/**
 * Rest nach Anrechnung der Online-Zahlung: Gesamtpreis minus Betrag der Zahlung (Anzahlung oder
 * Gesamtbetrag). Angerechnet wird nur eine eingegangene Zahlung (`bezahlt`); offen, fehlgeschlagen oder
 * erstattet zählt nichts. Ohne Gesamtpreis gibt es keinen Rest (`undefined`).
 * „Teilweise erstattet“ (FA-KERN-04) zählt wie „bezahlt“.
 */
export function restbetragCents(
  gesamtpreisCents: number | null | undefined,
  zahlung: Pick<PaymentInfo, 'amountCents' | 'status'> | null | undefined,
): number | undefined {
  if (typeof gesamtpreisCents !== 'number' || !Number.isFinite(gesamtpreisCents) || gesamtpreisCents < 0) return undefined;
  // „Teilweise erstattet“ (FA-KERN-04) bleibt eingegangen; die Erstattung ändert den Rest nicht (wie bisher die Teilerstattung).
  const angerechnet = zahlung?.status === 'bezahlt' || zahlung?.status === 'teilweise-erstattet' ? Math.max(0, zahlung.amountCents || 0) : 0;
  return Math.max(0, Math.round(gesamtpreisCents) - angerechnet);
}

/** Rest offen: es gibt einen Rest größer null, und er ist noch nicht als bezahlt vermerkt. */
export function restOffen(vorgang: Pick<BusinessRecord, 'remainder'>): boolean {
  const r = vorgang.remainder;
  return Boolean(r && typeof r.remainderCents === 'number' && r.remainderCents > 0 && !r.paidAt);
}

/* ---------- Weg eines gespeicherten Vorgangs ---------------------------- */

/**
 * Schlüssel in den Daten (`payload`) des Vorgangs, unter dem der Server den ermittelten Weg beim Anlegen
 * ablegt. Einen Wert aus dem Browser entfernt `submitRecord` vorher.
 */
export const AUFTRAGSWEG_DATEN = 'auftragsweg';

/**
 * Weg eines Vorgangs: das gespeicherte Feld, sonst der Wert in den Daten. Fehlt beides (ältere Termine),
 * wird er abgeleitet: Ein Termin mit Gesamtbetrag gilt als vermittelt, jeder andere als Werkstatttermin
 * (`hauptzentrale`), auch im Eigenbereich, weil der Weg dort früher nicht gespeichert wurde. Der Ort
 * (Werkstatt oder beim Fahrzeug) steht im Termin selbst. Vorgänge, die kein Termin sind, haben ohne
 * gespeicherten Wert keinen Weg.
 */
export function auftragswegVon(
  vorgang: Pick<BusinessRecord, 'auftragsweg' | 'kind' | 'payment'> & { payload?: Record<string, unknown> | null },
): Auftragsweg | undefined {
  if (vorgang.auftragsweg) return vorgang.auftragsweg;
  // Vom Server beim Anlegen in die Daten geschrieben (`AUFTRAGSWEG_DATEN`), nie aus dem Browser übernommen.
  const gespeichert = vorgang.payload?.[AUFTRAGSWEG_DATEN];
  if (istAuftragsweg(gespeichert)) return gespeichert;
  if (vorgang.kind !== 'termin') return undefined;
  return vorgang.payment?.scope === 'gesamt' ? 'partner' : 'hauptzentrale';
}

/** Zahlart beim Termin für Vorgangsblatt und Admin. */
export const REST_ZAHLART_LABEL: Record<NonNullable<NonNullable<BusinessRecord['remainder']>['method']>, string> = {
  bar: 'Bar',
  karte: 'Karte',
  ueberweisung: 'Überweisung',
};

/**
 * Zeilen für Vorgangsblatt und Druckansicht (FA-KERN-03): Auftragsweg, Gesamtpreis, Rest, Rest bezahlt am
 * und Zahlart. Nur Zeilen mit Wert; ohne Weg und ohne Gesamtpreis leer.
 */
export function auftragswegZeilen(
  vorgang: Pick<BusinessRecord, 'auftragsweg' | 'kind' | 'payment' | 'remainder'> & { payload?: Record<string, unknown> | null },
): Array<[string, string]> {
  const zeilen: Array<[string, string]> = [];
  // Nur der gespeicherte Weg: Bei älteren Vorgängen ohne Weg bleibt der Abschnitt weg.
  const gespeichert = vorgang.payload?.[AUFTRAGSWEG_DATEN];
  const weg = vorgang.auftragsweg ?? (istAuftragsweg(gespeichert) ? gespeichert : undefined);
  if (weg) zeilen.push(['Auftragsweg', AUFTRAGSWEG_LABEL[weg]]);
  const r = vorgang.remainder;
  if (typeof r?.totalCents === 'number') zeilen.push(['Gesamtpreis', formatCents(r.totalCents)]);
  if (typeof r?.remainderCents === 'number') zeilen.push([weg === 'partner' ? 'Rest' : 'Rest beim Termin', formatCents(r.remainderCents)]);
  if (r?.paidAt) zeilen.push(['Rest bezahlt am', `${formatDateTime(r.paidAt)} Uhr`]);
  if (r?.method) zeilen.push(['Zahlart beim Termin', REST_ZAHLART_LABEL[r.method]]);
  return zeilen;
}

/* ---------- Texte für Kunden -------------------------------------------- */

/**
 * Ort des Direkttermins: `werkstatt` (Werkstatt in Wetzlar) oder `vor-ort` (bei Leistungen wie der
 * Fahrzeugöffnung beim Fahrzeug des Kunden, `buchungsOrt` in src/lib/terminort.ts).
 */
export type DirektOrt = AppointmentInfo['location'];

/**
 * Die eine Zeile vor der Zahlung (Assistent, Zusammenfassung, Zahlungsseite, Bestätigung, Mail):
 * „Ihr Termin: in unserer Werkstatt in Wetzlar“, beim Fahrzeug des Kunden oder der vermittelte Partnertermin.
 */
export function terminortZeile(weg: Auftragsweg, werkstattStadt?: string, ort?: DirektOrt): string {
  if (weg === 'partner') return 'Ihr Termin: bei einem Partnerbetrieb in Ihrer Region, vermittelt durch Schlüsselmacher24';
  if (ort === 'vor-ort') return 'Ihr Termin: bei Ihrem Fahrzeug, Ort nach telefonischer Absprache';
  return werkstattStadt ? `Ihr Termin: in unserer Werkstatt in ${werkstattStadt}` : 'Ihr Termin: in unserer Werkstatt';
}

/** Auswahltext je Standort im Assistenten. */
export function standortText(standort: Terminstandort, werkstattStadt?: string, ort?: DirektOrt): string {
  if (standort === 'partner') return 'Termin bei einem Partnerbetrieb in Ihrer Region (vermittelt)';
  if (ort === 'vor-ort') return 'Bei Ihrem Fahrzeug (Ort nach telefonischer Absprache)';
  return werkstattStadt ? `In unserer Werkstatt in ${werkstattStadt}` : 'In unserer Werkstatt';
}

/** Der ehrliche Satz, wenn es in der Region noch keinen Partnerbetrieb gibt. */
export const KEIN_PARTNER_HINWEIS =
  'In Ihrer Region gibt es noch keinen Partnerbetrieb. Sie können einen Termin in unserer Werkstatt buchen '
  + 'oder uns Ihr Anliegen als Anfrage schicken.';

/** Partnerweg mit Festpreis: was nach der Zahlung geschieht. */
export const PARTNER_NACH_ZAHLUNG =
  'Verbindlich wird der Auftrag mit Ihrer Zahlung. Danach geben wir ihn an den Partnerbetrieb weiter, '
  + 'der den genauen Termin mit Ihnen abstimmt.';

/**
 * Partnerweg mit Gesamtbetrag: Die Zahlung ist nicht eingegangen (abgelaufen oder fehlgeschlagen). Es gibt
 * weder eine Anzahlung noch ein reserviertes Zeitfenster der Werkstatt.
 */
export const PARTNER_NICHT_ZUSTANDE =
  'Ihre Zahlung ist nicht eingegangen. Der Auftrag ist nicht zustande gekommen. Sie können ihn neu buchen.';

/** „Jetzt fällig“ bei der Partner-Anfrage ohne Festpreis. */
export const PARTNER_JETZT_NICHTS = 'Jetzt nichts. Sie zahlen erst, wenn wir Ihnen den Preis genannt haben.';

/** Partnerweg ohne Festpreis: Anfrage ohne Zahlung. */
export const PARTNER_OHNE_FESTPREIS =
  'Für Ihren Fall gibt es noch keinen festen Preis. Sie senden uns eine Anfrage ohne Zahlung. Wir nennen Ihnen '
  + 'den Gesamtpreis und schicken Ihnen einen persönlichen Zahlungslink. Verbindlich wird der Auftrag erst mit Ihrer Zahlung.';

/** Beschreibung der Zahlung im Partnerweg (Zahlungsseite, Kontoauszug). */
export const PARTNER_ZAHLUNG = 'Autoschlüssel-Auftrag über Partnerbetrieb (Gesamtbetrag)';

/** Ist der Vorgang eine Partner-Anfrage ohne Festpreis, die das Team mit Preis und Zahlungslink freigibt? */
export function istPartnerAnfrage(
  vorgang: Pick<BusinessRecord, 'kind' | 'area' | 'auftragsweg'> & { payload?: Record<string, unknown> | null },
): boolean {
  if (vorgang.kind !== 'anfrage' || vorgang.area !== 'autoschluessel') return false;
  return (vorgang.auftragsweg ?? vorgang.payload?.[AUFTRAGSWEG_DATEN]) === 'partner';
}

/**
 * Freigegebene Partner-Anfrage mit offenem Gesamtbetrag: Der Kunde kann den Auftrag jetzt mit der
 * Zahlung erteilen (wie die Freigabe der Foto-Anfrage, src/lib/foto-freigabe.ts).
 */
export function partnerFreigabeZahlbar(vorgang: BusinessRecord): boolean {
  const zahlung = vorgang.payment;
  return (
    istPartnerAnfrage(vorgang)
    && vorgang.status === 'freigegeben'
    && Boolean(zahlung && zahlung.scope === 'gesamt' && zahlung.amountCents > 0 && (zahlung.status === 'offen' || zahlung.status === 'fehlgeschlagen'))
  );
}
