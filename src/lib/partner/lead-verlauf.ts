/*
 * Lead-Verlauf am Vorgang (FA-PLATTFORM-01B, FA-22-41). Vorgabe des Inhabers: „Im Adminbereich muss
 * nachvollziehbar sein, welcher Lead welchem Partner angeboten oder zugeteilt wurde.“
 *
 * Jede Änderung der Zuordnung schreibt einen Eintrag: Partner, Zeitpunkt, wer, Ergebnis, Notiz. Die
 * Einträge bildet diese reine Funktion aus altem und neuem Stand der Vermittlung; geschrieben werden sie
 * vom Hook am Vorgang (`leadVerlaufVorAenderung`), nie von Hand.
 *
 * - Partnerbetrieb gewählt oder gewechselt: „zugeteilt“ für den neuen; der bisherige bekommt
 *   „zurückgezogen“ (oder „abgelehnt“, wenn das Team das angibt), sofern sein letzter Eintrag noch offen ist.
 * - Stand „an Partner vermittelt“: „angeboten“. Stand „vom Partner angenommen“: „angenommen“.
 * - Schritt zurück aus einer laufenden Vermittlung (oder leeren): „abgelehnt“ oder „zurückgezogen“.
 * - Partnerbetrieb pausiert oder gesperrt, während der Lead läuft: „zur Klärung“ (Hook am Partnerbetrieb).
 *
 * Nur relative Importe.
 */

import type { ReferralStatus } from '../types';

export type LeadErgebnis = 'zugeteilt' | 'angeboten' | 'angenommen' | 'abgelehnt' | 'zurueckgezogen' | 'zur-klaerung';

export const LEAD_ERGEBNISSE: ReadonlyArray<{ label: string; value: LeadErgebnis }> = [
  { label: 'zugeteilt', value: 'zugeteilt' },
  { label: 'angeboten', value: 'angeboten' },
  { label: 'angenommen', value: 'angenommen' },
  { label: 'abgelehnt', value: 'abgelehnt' },
  { label: 'zurückgezogen', value: 'zurueckgezogen' },
  { label: 'zur Klärung', value: 'zur-klaerung' },
];

/** Was das Team beim Schritt zurück oder beim Wechsel angeben kann. */
export type LeadRueckgabe = 'abgelehnt' | 'zurueckgezogen';

export const LEAD_RUECKGABEN: ReadonlyArray<{ label: string; value: LeadRueckgabe }> = [
  { label: 'Partner hat abgelehnt', value: 'abgelehnt' },
  { label: 'Wir haben zurückgezogen', value: 'zurueckgezogen' },
];

export interface LeadEintrag {
  partnerbetrieb: string;
  am: string;
  von: string;
  ergebnis: LeadErgebnis;
  notiz?: string | null;
}

export interface ZuordnungsStand {
  status?: ReferralStatus | null;
  /** Kennung des Partnerbetriebs. */
  partner?: string | null;
}

/** Stände, in denen ein Lead einem Partner angeboten ist oder von ihm angenommen wurde. */
export const LEAD_LAUFEND: readonly ReferralStatus[] = ['partner-angefragt', 'angenommen', 'termin-bestaetigt'];

const OFFEN_ENDE: readonly LeadErgebnis[] = ['abgelehnt', 'zurueckgezogen'];

/** Letzter Eintrag eines Partners im Verlauf. */
export function letzterEintrag(verlauf: readonly LeadEintrag[], partner: string): LeadEintrag | undefined {
  for (let i = verlauf.length - 1; i >= 0; i -= 1) {
    if (verlauf[i].partnerbetrieb === partner) return verlauf[i];
  }
  return undefined;
}

/**
 * Neue Einträge für einen Wechsel von `alt` nach `neu`. Leer, wenn sich an der Zuordnung nichts ändert.
 * `bisher` ist der gespeicherte Verlauf (damit ein Partner nicht zweimal als zurückgezogen erscheint).
 */
export function leadEintraege(
  alt: ZuordnungsStand,
  neu: ZuordnungsStand,
  bisher: readonly LeadEintrag[],
  k: { am: string; von: string; rueckgabe?: LeadRueckgabe | null; notiz?: string | null },
): LeadEintrag[] {
  const eintraege: LeadEintrag[] = [];
  const notiz = (k.notiz ?? '').trim() || null;
  const eintrag = (partnerbetrieb: string, ergebnis: LeadErgebnis): LeadEintrag => ({ partnerbetrieb, am: k.am, von: k.von, ergebnis, notiz });
  const rueckgabe: LeadErgebnis = k.rueckgabe === 'abgelehnt' ? 'abgelehnt' : 'zurueckgezogen';
  const partnerAlt = alt.partner || null;
  const partnerNeu = neu.partner || null;
  const statusAlt = alt.status ?? undefined;
  const statusNeu = neu.status ?? undefined;

  if (partnerAlt !== partnerNeu) {
    if (partnerAlt) {
      const letzter = letzterEintrag(bisher, partnerAlt);
      if (!letzter || !OFFEN_ENDE.includes(letzter.ergebnis)) eintraege.push(eintrag(partnerAlt, rueckgabe));
    }
    if (partnerNeu) eintraege.push(eintrag(partnerNeu, 'zugeteilt'));
  } else if (partnerNeu && statusAlt && LEAD_LAUFEND.includes(statusAlt) && (!statusNeu || statusNeu === 'neu' || statusNeu === 'geprueft')) {
    // Schritt zurück beim selben Partner: Er hat abgelehnt, oder wir ziehen zurück.
    eintraege.push(eintrag(partnerNeu, rueckgabe));
  }

  if (partnerNeu && statusNeu !== statusAlt) {
    if (statusNeu === 'partner-angefragt') eintraege.push(eintrag(partnerNeu, 'angeboten'));
    if (statusNeu === 'angenommen') eintraege.push(eintrag(partnerNeu, 'angenommen'));
  }
  return eintraege;
}

const ERGEBNIS_LABEL = Object.fromEntries(LEAD_ERGEBNISSE.map((e) => [e.value, e.label])) as Record<LeadErgebnis, string>;

export function leadErgebnisLabel(ergebnis: LeadErgebnis): string {
  return ERGEBNIS_LABEL[ergebnis] ?? ergebnis;
}

/** Stände, in denen eine Warnung zum Partnerbetrieb am Vorgang noch etwas bewirkt (vor der Auszahlung). */
const WARNUNG_STAENDE: readonly ReferralStatus[] = ['neu', 'geprueft', 'partner-angefragt', 'angenommen', 'termin-bestaetigt', 'erledigt', 'kunde-bestaetigt', 'auszahlung-freigegeben'];

/** Stände des Partnerbetriebs, die jede neue Zuordnung ausschließen, mit Anzeige. */
const AUSGESCHLOSSEN: Readonly<Record<string, string>> = { pausiert: 'pausiert', gesperrt: 'gesperrt', beendet: 'beendet' };

/**
 * Warnung am Vorgang, wenn der zugeordnete Partnerbetrieb pausiert, gesperrt oder beendet ist (FA-07-19).
 * `null` ohne Anlass. Der Vorgang bleibt sichtbar; das Team klärt ihn.
 */
export function zuordnungWarnung(
  partner: { firma?: string | null; status?: string | null; sperre?: { grund?: string | null; seit?: string | null } | null } | null | undefined,
  vermittlungStatus: ReferralStatus | null | undefined,
): string | null {
  if (!partner?.status || !AUSGESCHLOSSEN[partner.status]) return null;
  if (vermittlungStatus && !WARNUNG_STAENDE.includes(vermittlungStatus)) return null;
  const seit = partner.sperre?.seit ? ` seit ${partner.sperre.seit.slice(0, 10)}` : '';
  const grund = (partner.sperre?.grund ?? '').trim();
  return (
    `Achtung: Der Partnerbetrieb „${partner.firma ?? 'ohne Namen'}“ ist ${AUSGESCHLOSSEN[partner.status]}${seit}${grund ? ` (${grund.slice(0, 300)})` : ''}. `
    + 'Er bekommt keine neue Zuordnung. Bitte diesen Vorgang klären und bei Bedarf über „geprüft“ einem anderen Betrieb zuordnen.'
  );
}

export const BETRIEB_HINWEIS =
  'Der Kunde weiß noch nicht, welcher Betrieb ausführt. Bitte vor dem Einsatz die Nachricht „Ihr ausführender Betrieb“ senden '
  + '(Seitenleiste, „Nachricht an den Kunden“). Firma und Ort setzt der Server aus dem Partnerbetrieb ein.';

/**
 * Hinweis am Vorgang (FA-07-03): Partner hat angenommen, die Nachricht „Ihr ausführender Betrieb“ ist aber
 * noch nicht gesendet. Gilt bei „vom Partner angenommen“ und „Termin bestätigt“, also vor dem Einsatz.
 */
export function betriebHinweis(vermittlungStatus: ReferralStatus | null | undefined, mitPartner: boolean, mitgeteilt: boolean): string | null {
  if (!mitPartner || mitgeteilt) return null;
  return vermittlungStatus === 'angenommen' || vermittlungStatus === 'termin-bestaetigt' ? BETRIEB_HINWEIS : null;
}

/** Bedingung „wartet auf Zuordnung“ für die Liste der Vorgänge (FA-22-41). */
export const WARTET_AUF_ZUORDNUNG_STATUS_AUS = ['storniert', 'abgeschlossen', 'nicht-moeglich'] as const;

/**
 * Filter „wartet auf Zuordnung“: kein Partnerbewerbungs-Vorgang, nicht storniert oder abgeschlossen, und
 * entweder in der Vermittlung bei „neu“ oder „geprüft“ (noch keinem Partner angeboten oder nach einer
 * Ablehnung zurück) oder im Partnerweg ganz ohne Vermittlung. Als Abfrage für Payload und als Adresse.
 */
export function wartetAufZuordnungFilter(): { where: Record<string, unknown>; suche: string } {
  const basis = [{ art: { not_equals: 'partner' } }, { status: { not_in: [...WARTET_AUF_ZUORDNUNG_STATUS_AUS] } }];
  const where = {
    or: [
      { and: [...basis, { 'vermittlung.status': { in: ['neu', 'geprueft'] } }] },
      { and: [...basis, { auftragsweg: { equals: 'partner' } }, { 'vermittlung.status': { exists: false } }] },
    ],
  };
  const teile: string[] = [];
  const schreiben = (pfad: string, wert: unknown) => {
    if (Array.isArray(wert)) wert.forEach((w, i) => schreiben(`${pfad}[${i}]`, w));
    else if (wert && typeof wert === 'object') for (const [k, w] of Object.entries(wert)) schreiben(`${pfad}[${k}]`, w);
    else teile.push(`${pfad}=${encodeURIComponent(String(wert))}`);
  };
  schreiben('where', where);
  return { where, suche: `?${teile.join('&')}` };
}
