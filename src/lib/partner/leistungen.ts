/*
 * Leistungen und Auftragsarten des Partnernetzes (FA-PLATTFORM-01, FA-07-02 bis FA-07-12): genau die
 * neun Leistungen aus der Arbeitsanweisung des Inhabers vom 11.11.2026, Abschnitt 07. Eine Liste für
 * Formular, Sammlung, Zuordnung und Seiten. Das Netz ist ausschließlich für Autoschlüssel und
 * Fahrzeugschlüssel; Türöffnungen an Wohnung und Haus, Schließtechnik, Zutritt und Sicherheitstechnik
 * gehören nicht dazu.
 *
 * Alte Werte bleiben in der Datenbank lesbar (G6, additiv) und tragen in der Auswahl „früher“. Neu
 * wählen lassen sie sich nicht. Reine Daten und Funktionen, nur relative Importe.
 */

export type PartnerLeistung =
  | 'schluessel-nachmachen'
  | 'programmierung-anlernen'
  | 'schluesselverlust'
  | 'keyless-smart-key'
  | 'transponder'
  | 'funk'
  | 'fahrzeugoeffnung'
  | 'reparatur-gehaeuse'
  | 'motorrad-weitere';

export interface PartnerLeistungEintrag {
  value: PartnerLeistung;
  /** Name, wie ihn der Inhaber nennt. */
  label: string;
  /** Ein Satz für Formular und Seiten. */
  beschreibung: string;
}

/** Die neun Leistungen des Netzes, in der Reihenfolge des Inhabers. */
export const PARTNER_LEISTUNGEN_LISTE: readonly PartnerLeistungEintrag[] = [
  { value: 'schluessel-nachmachen', label: 'Autoschlüssel nachmachen', beschreibung: 'Zweitschlüssel und Ersatzschlüssel nach Fahrzeug oder Vorlage.' },
  { value: 'programmierung-anlernen', label: 'Programmierung und Anlernen', beschreibung: 'Schlüssel am Fahrzeug anlernen, auch nach einem Steuergerätetausch.' },
  { value: 'schluesselverlust', label: 'Schlüsselverlust', beschreibung: 'Neuer Schlüssel, wenn keiner mehr da ist.' },
  { value: 'keyless-smart-key', label: 'Keyless und Smart Key', beschreibung: 'Schlüssellose Zugangs- und Startsysteme.' },
  { value: 'transponder', label: 'Transponder', beschreibung: 'Der Chip für die Wegfahrsperre.' },
  { value: 'funk', label: 'Funk', beschreibung: 'Fernbedienung zum Ver- und Entriegeln.' },
  { value: 'fahrzeugoeffnung', label: 'Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln', beschreibung: 'Etwa wenn der Autoschlüssel im Fahrzeug liegt.' },
  { value: 'reparatur-gehaeuse', label: 'Reparaturen und Gehäuse', beschreibung: 'Defekte Tasten, gebrochene Gehäuse, Gehäusetausch.' },
  { value: 'motorrad-weitere', label: 'Motorrad und weitere Fahrzeugschlüssel', beschreibung: 'Sofern der Partner dies anbietet.' },
];

/**
 * Sammelwert für Autoschlüssel-Aufträge (Bestand, FA-KERN-03/04): Der Server setzt ihn am Vorgang,
 * solange die Leistung eines Auftrags noch nicht einer der neun zugeordnet wird. Am Partnerbetrieb ist er
 * nicht mehr neu wählbar; ein Partner mit mindestens einer der neun Leistungen deckt ihn ab.
 */
export const AUFTRAGSART_SAMMELWERT = 'autoschluessel-vor-ort';

/** Ein Name für den Sammelwert in Auswahl, Meldungen und PDF. */
export const AUFTRAGSART_SAMMELWERT_NAME = 'Autoschlüssel allgemein';

/** Werte aus der Zeit vor FA-PLATTFORM-01. Lesbar, nicht mehr neu wählbar. */
export const FRUEHERE_AUFTRAGSARTEN: ReadonlyArray<{ value: string; name: string }> = [
  { value: 'schluesseldienst-vor-ort', name: 'Schlüsseldienst vor Ort (Tür, Schloss, Zylinder)' },
  { value: 'montage-zylinder', name: 'Montage Zylinder' },
  { value: 'montage-schliessanlage', name: 'Montage Schließanlage' },
  { value: 'beratung-vor-ort', name: 'Beratung vor Ort' },
  { value: 'einbau-elektronik', name: 'Einbau elektronischer Systeme' },
];

/** Leistungskennungen des alten Bewerbungsformulars (im Vorgang gespeichert), nur zum Lesen. */
export const FRUEHERE_FORMULAR_LEISTUNGEN: Readonly<Record<string, string>> = {
  autoschluessel: 'Autoschlüssel',
  schliesstechnik: 'Schließtechnik',
  tueroeffnung: 'Türöffnung',
  zutritt: 'Zutritt',
  sicherheitstechnik: 'Sicherheitstechnik',
};

/**
 * Auswahl für die Sammlungen (Partnerbetriebe, Provisionen, Vermittlung am Vorgang). Die neun zuerst, dann
 * der Sammelwert und die früheren Werte; die Reihenfolge der alten Werte bleibt, damit die Migration nur
 * Werte ergänzt (ADD VALUE, G6).
 */
export const AUFTRAGSART_OPTIONEN: Array<{ label: string; value: string }> = [
  ...PARTNER_LEISTUNGEN_LISTE.map((l) => ({ label: l.label, value: l.value })),
  { label: AUFTRAGSART_SAMMELWERT_NAME, value: AUFTRAGSART_SAMMELWERT },
  ...FRUEHERE_AUFTRAGSARTEN.map((a) => ({ label: `früher: ${a.name}`, value: a.value })),
];

const NEUN = new Set<string>(PARTNER_LEISTUNGEN_LISTE.map((l) => l.value));

export function istPartnerLeistung(wert: unknown): wert is PartnerLeistung {
  return typeof wert === 'string' && NEUN.has(wert);
}

/** Name einer Auftragsart oder Leistung ohne Zusatz „früher“ (Vertrag, Übersichten). */
export function auftragsartName(wert: string): string {
  const neu = PARTNER_LEISTUNGEN_LISTE.find((l) => l.value === wert);
  if (neu) return neu.label;
  if (wert === AUFTRAGSART_SAMMELWERT) return AUFTRAGSART_SAMMELWERT_NAME;
  return FRUEHERE_AUFTRAGSARTEN.find((a) => a.value === wert)?.name ?? FRUEHERE_FORMULAR_LEISTUNGEN[wert] ?? wert;
}

/**
 * Werte, die beim Speichern eines Partnerbetriebs neu hinzukämen, aber nicht zu den neun gehören. Was der
 * Betrieb schon hatte, bleibt erlaubt (lesbar, G6); entfernen geht immer.
 */
export function nichtMehrWaehlbar(neu: readonly string[] | null | undefined, bisher: readonly string[] | null | undefined): string[] {
  const alt = new Set(bisher ?? []);
  return (neu ?? []).filter((w) => !istPartnerLeistung(w) && !alt.has(w));
}

/**
 * Wie `nichtMehrWaehlbar`, aber für Auftragsarten an Aufträgen und Provisionen: Dort bleibt der Sammelwert
 * wählbar, weil der Server ihn an jedem Autoschlüssel-Vorgang setzt.
 */
export function nichtMehrWaehlbarFuerAuftrag(neu: readonly string[] | null | undefined, bisher: readonly string[] | null | undefined): string[] {
  return nichtMehrWaehlbar(neu, bisher).filter((w) => w !== AUFTRAGSART_SAMMELWERT);
}

/**
 * Deckt ein Partner mit diesen Auftragsarten die Auftragsart eines Auftrags ab? Gleicher Wert passt immer.
 * Den Sammelwert deckt auch jeder Partner mit mindestens einer der neun Leistungen.
 */
export function decktAuftragsart(partnerArten: readonly string[], auftragsart: string): boolean {
  if (partnerArten.includes(auftragsart)) return true;
  return auftragsart === AUFTRAGSART_SAMMELWERT && partnerArten.some(istPartnerLeistung);
}

/** Eintrag einer Provision je Auftragsart (Sammlung Partnerbetriebe); Beträge nur in der Datenbank (G13). */
export interface ProvisionsEintrag {
  auftragsart: string;
  prozent?: number | null;
  festbetrag?: number | null;
}

/**
 * Welcher Provisionseintrag gilt für die Auftragsart eines Auftrags? Gleicher Wert zuerst. Für den Sammelwert
 * ohne eigenen Eintrag gelten die Einträge der neun Leistungen, aber nur, wenn sie alle gleich sind
 * (gleicher Prozentsatz, gleicher fester Betrag). Weichen sie voneinander ab, ist die Wahl offen
 * (`mehrdeutig`) und das Team trägt den Plattformanteil von Hand ein; der Code rät nicht.
 */
export function provisionsEintragWaehlen<T extends ProvisionsEintrag>(
  eintraege: readonly T[] | null | undefined,
  auftragsart: string | null | undefined,
): { eintrag?: T; mehrdeutig?: true } {
  if (!auftragsart || !eintraege?.length) return {};
  const gleich = eintraege.find((e) => e.auftragsart === auftragsart);
  if (gleich) return { eintrag: gleich };
  if (auftragsart !== AUFTRAGSART_SAMMELWERT) return {};
  const neun = eintraege.filter((e) => istPartnerLeistung(e.auftragsart));
  if (!neun.length) return {};
  const schluessel = (e: T) => `${e.prozent ?? ''}|${e.festbetrag ?? ''}`;
  return new Set(neun.map(schluessel)).size === 1 ? { eintrag: neun[0] } : { mehrdeutig: true };
}

/**
 * Leistungen des Autoschlüssel-Assistenten (`content/car-key-services.json`, Kennung `serviceId`) und die
 * Leistung des Partnernetzes, die sie abdeckt (FA-PLATTFORM-01B, Zusatz 7). Nur eindeutige Zuordnungen;
 * was hier fehlt, behält den Sammelwert „Autoschlüssel allgemein“. „Schlüsselbart fräsen“ fehlt bewusst:
 * Es gehört zum Nachmachen ebenso wie zum Ersatz bei Verlust (offene Frage im Bericht).
 */
export const AUFTRAGSLEISTUNG_ZU_PARTNERLEISTUNG: Readonly<Record<string, PartnerLeistung>> = {
  zweitschluessel: 'schluessel-nachmachen',
  'ersatz-bei-verlust': 'schluesselverlust',
  programmierung: 'programmierung-anlernen',
  'gehaeuse-reparatur': 'reparatur-gehaeuse',
  fahrzeugoeffnung: 'fahrzeugoeffnung',
};

/**
 * Auftragsart eines Autoschlüssel-Auftrags aus der gebuchten Leistung: eine der neun, wenn die Zuordnung
 * eindeutig ist, sonst der Sammelwert. Gilt für neue Zuordnungen; gespeicherte Vorgänge bleiben, wie sie sind.
 */
export function auftragsartFuerLeistung(leistung: unknown): string {
  return typeof leistung === 'string' && Object.hasOwn(AUFTRAGSLEISTUNG_ZU_PARTNERLEISTUNG, leistung)
    ? AUFTRAGSLEISTUNG_ZU_PARTNERLEISTUNG[leistung]
    : AUFTRAGSART_SAMMELWERT;
}

/** Auftragsart aus den Daten eines Vorgangs (`daten.serviceId` des Assistenten). */
export function auftragsartFuerVorgang(daten: unknown): string {
  const d = daten && typeof daten === 'object' && !Array.isArray(daten) ? (daten as Record<string, unknown>) : {};
  return auftragsartFuerLeistung(d.serviceId);
}
