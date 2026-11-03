import type { Rubrik, RubrikAbschluss, RubrikNachweis, RubrikNavigation, RubrikStatus } from '@/lib/types';

/**
 * Rubriken-Modell (KERN K-014, G-11): Wertelisten und reine Hilfen für Hub,
 * Navigation und Rubrikseiten. Ohne React und ohne Datenzugriff, damit
 * Backend, Seed, Seiten und Tests dieselben Listen nutzen.
 */

/** Fach-Icons und Glyphen, die eine Rubrik oder ein Ablaufschritt tragen darf (KERN K-008). */
export const RUBRIK_ICONS = [
  // Fach-Icons des Bestands
  'alarmtechnik', 'anzahlung', 'aussenhautsicherung', 'autoschluessel', 'beratung-telefon', 'datenschutz',
  'einsteckschloss', 'elektronische-zutrittsloesungen', 'fahrzeugmarke', 'fahrzeugoeffnung', 'foto-hochladen',
  'funkschluessel', 'gleichschliessende-zylinder', 'halbzylinder', 'klappschluessel', 'knaufzylinder',
  'kombinierte-konzepte', 'lieferung', 'mechanischer-schutz', 'mehrfachverriegelung', 'montage', 'nachweis',
  'panik-alarmtaster', 'panik-fluchttuer', 'profilzylinder', 'pruefung', 'reparatur-austausch', 'rueckgabe',
  'schliessanlagen', 'schluessel-kopieren', 'schluessel-nach-code', 'schluessel-nach-vorlage',
  'schluessel-programmieren', 'schluesselbart-fraesen', 'schutzbeschlag', 'service-und-termin', 'sicherheitscheck',
  'sicherheitstechnik', 'sicherungskarte', 'smart-key', 'smarte-funktionen', 'standort', 'technische-beratung',
  'termin', 'transponder', 'tuer-und-schliesstechnik', 'tuerschliesser', 'tuerzusatzschloss', 'versand-paket',
  'videoueberwachung', 'warenkorb', 'werkstatt', 'zahlung', 'zylinder-mass',
  // Neue Fach-Icons (E3-GRAFIKER-01)
  'motorradschluessel', 'schluesselgehaeuse', 'transponder-kopie', 'schluesselfinder', 'vor-ort', 'karte', 'video',
  // Glyphen
  'dokument',
] as const;

export type RubrikIcon = (typeof RUBRIK_ICONS)[number];

export const RUBRIK_ABSCHLUESSE: ReadonlyArray<{ value: RubrikAbschluss; label: string }> = [
  { value: 'kasse', label: 'Kasse (Warenkorb und Bezahlung)' },
  { value: 'anfrage', label: 'Anfrage' },
  { value: 'termin-anzahlung', label: 'Termin mit Anzahlung' },
  { value: 'angebot-zahlungslink', label: 'Angebot mit Zahlungslink' },
  { value: 'beratung', label: 'Beratungsanfrage' },
];

export const RUBRIK_STATUS: ReadonlyArray<{ value: RubrikStatus; label: string }> = [
  { value: 'live', label: 'Live (sichtbar)' },
  { value: 'spaeter', label: 'Später (vorbereitet, nicht sichtbar)' },
  { value: 'aus', label: 'Aus' },
];

/** Gruppen der Hauptnavigation nach G-08, in dieser Reihenfolge. */
export const RUBRIK_NAVIGATION: ReadonlyArray<{ value: RubrikNavigation; label: string }> = [
  { value: 'autoschluessel', label: 'Autoschlüssel' },
  { value: 'code', label: 'Schlüssel nach Code' },
  { value: 'sperrschliessung', label: 'Sperrschließungen' },
  { value: 'schliessanlagen', label: 'Schließanlagen' },
  { value: 'mehr', label: 'Mehr' },
];

export const RUBRIK_NACHWEISE: ReadonlyArray<{ value: RubrikNachweis; label: string }> = [
  { value: 'keiner', label: 'Kein Nachweis nötig' },
  { value: 'fahrzeugschein', label: 'Fahrzeugschein auf den Besteller oder Vollmacht' },
  { value: 'sicherungskarte', label: 'Sicherungskarte bei geschützten Profilen' },
];

/** Upload-Kategorien der vorhandenen Strecke (src/lib/server/datei-pruefung.ts). */
export const RUBRIK_UPLOADS = ['schluesselfoto', 'fahrzeugschein', 'grundriss', 'dokument', 'objektfoto', 'sicherungskarte', 'vollmacht'] as const;

/** Sortiert nach Reihenfolge; bei Gleichstand nach Kennung, damit die Ausgabe stabil bleibt. */
export function sortiereRubriken(liste: readonly Rubrik[]): Rubrik[] {
  return [...liste].sort((a, b) => a.reihenfolge - b.reihenfolge || a.id.localeCompare(b.id));
}

/** Kacheln des Hubs: live und für den Hub vorgesehen. */
export function hubKacheln(liste: readonly Rubrik[]): Rubrik[] {
  return sortiereRubriken(liste).filter((r) => r.status === 'live' && r.imHub);
}

/** Live-Rubriken je Navigationsgruppe in der Reihenfolge von G-08. */
export function rubrikenNachGruppe(liste: readonly Rubrik[]): Array<{ gruppe: RubrikNavigation; label: string; rubriken: Rubrik[] }> {
  const live = sortiereRubriken(liste).filter((r) => r.status === 'live');
  return RUBRIK_NAVIGATION.map(({ value, label }) => ({ gruppe: value, label, rubriken: live.filter((r) => r.navigation === value) }));
}
