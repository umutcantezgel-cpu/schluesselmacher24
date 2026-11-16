/*
 * Ortsstamm (FA-PLATTFORM-03, A-051): Typen der Dateien unter content/orte/, erzeugt mit scripts/orte-import.mjs.
 * Der Gemeindeschlüssel (Amtlicher Gemeindeschlüssel, acht Ziffern) ist der Schlüssel jeder Gemeinde.
 */

/** Art der Gemeinde nach dem Textkennzeichen des Gemeindeverzeichnisses. */
export type GemeindeArt = 'markt' | 'kreisfreie-stadt' | 'stadtkreis' | 'stadt' | 'gemeinde' | 'grosse-kreisstadt';

/** Art des Kreises nach dem Textkennzeichen des Gemeindeverzeichnisses. */
export type KreisArt = 'kreisfreie-stadt' | 'stadtkreis' | 'kreis' | 'landkreis' | 'regionalverband';

export interface Gemeinde {
  /** Amtlicher Gemeindeschlüssel, acht Ziffern (Land, Regierungsbezirk, Kreis, Gemeinde). */
  schluessel: string;
  /** Amtlicher Regionalschlüssel, zwölf Ziffern (mit Gemeindeverband). */
  regionalschluessel: string;
  /** Name ohne Bezeichnung („Wetzlar“). */
  name: string;
  /** Bezeichnung nach dem Komma im Gemeindeverzeichnis („Stadt“, „Universitätsstadt“), sonst null. */
  bezeichnung: string | null;
  art: GemeindeArt;
  /** Adresse für eine Ortsseite, eindeutig über alle Gemeinden und über Stände gleich (Regel in scripts/orte-import.mjs). */
  slug: string;
  /** Kreisschlüssel, fünf Ziffern. */
  kreis: string;
  /** Landesschlüssel, zwei Ziffern. */
  land: string;
  /** Postleitzahl des Verwaltungssitzes. */
  plz: string;
  breite: number | null;
  laenge: number | null;
  /** Bevölkerung am 31.12. des Gebietsstands, auf Grundlage des Zensus 2022. */
  einwohner: number | null;
}

export interface Kreis {
  schluessel: string;
  /** Name wie im Gemeindeverzeichnis („Lahn-Dill-Kreis“, „Flensburg, Stadt“). */
  name: string;
  art: KreisArt;
  land: string;
}

export interface PostleitzahlEintrag {
  plz: string;
  /** Ortsnamen laut GeoNames, auch Ortsteile. */
  orte: string[];
  /** Kreisschlüssel; eine Postleitzahl kann mehrere Kreise berühren. */
  kreise: string[];
  /** Gemeindeschlüssel, nur wo die Zuordnung eindeutig ist (Regel in scripts/orte-import.mjs). */
  gemeinden: string[];
  /** Mittelpunkt (Mittel der GeoNames-Koordinaten). */
  breite: number | null;
  laenge: number | null;
}

/** Wie der Eintrag des Anhangs A seinen Gemeindeschlüssel bekam. */
export type PrioritaetZuordnung = 'name' | 'ohne-klammer' | 'tabelle' | 'offen';

export interface PrioritaetEintrag {
  /** Landesschlüssel. */
  land: string;
  /** Platz innerhalb des Landes in der Reihenfolge des Inhabers, ab 1. */
  rang: number;
  /** Name wie im Anhang. */
  name: string;
  schluessel: string | null;
  amtlicherName: string | null;
  zuordnung: PrioritaetZuordnung;
  hinweis?: string;
  /** Nur bei „offen“: Kandidaten für Menschen als „Name (Schlüssel)“. */
  kandidaten?: string[];
  /** Nur bei „offen“ aus der Tabelle: vorgeschlagener, noch nicht bestätigter Schlüssel. Nicht als Zuordnung verwenden. */
  vorschlag?: string;
}

/** Herkunft einer Stammdatei. */
export interface StammHerkunft {
  datei: string;
  sha256: string;
  gebietsstand?: string;
  zeilen?: number;
}

export interface GemeindenDatei {
  quelle: string;
  herkunft: StammHerkunft;
  hinweis: string;
  anzahl: number;
  gemeinden: Gemeinde[];
}

export interface KreiseDatei {
  quelle: string;
  herkunft: StammHerkunft;
  anzahl: number;
  kreise: Kreis[];
}

export interface PostleitzahlenDatei {
  quelle: string;
  herkunft: StammHerkunft;
  hinweis: string;
  anzahl: number;
  postleitzahlen: PostleitzahlEintrag[];
}

export interface PrioritaetDatei {
  quelle: string;
  hinweis: string;
  gebietsstand: string;
  anzahl: number;
  offen: number;
  eintraege: PrioritaetEintrag[];
}

/** Die vier Dateien des Stamms. */
export interface OrtsstammDaten {
  gemeinden: GemeindenDatei;
  kreise: KreiseDatei;
  postleitzahlen: PostleitzahlenDatei;
  prioritaet: PrioritaetDatei;
}

/** Bundesländer nach dem Landesschlüssel (wie im Gemeindeverzeichnis). */
export const LAENDER: Readonly<Record<string, string>> = {
  '01': 'Schleswig-Holstein',
  '02': 'Hamburg',
  '03': 'Niedersachsen',
  '04': 'Bremen',
  '05': 'Nordrhein-Westfalen',
  '06': 'Hessen',
  '07': 'Rheinland-Pfalz',
  '08': 'Baden-Württemberg',
  '09': 'Bayern',
  '10': 'Saarland',
  '11': 'Berlin',
  '12': 'Brandenburg',
  '13': 'Mecklenburg-Vorpommern',
  '14': 'Sachsen',
  '15': 'Sachsen-Anhalt',
  '16': 'Thüringen',
};

/** Quellenvermerke für Seiten (A-051 Nr. 8); der volle Wortlaut steht in content/orte/LIZENZ.md. */
export interface OrtsstammQuelle {
  /** Sichtbarer Vermerk. */
  text: string;
  /** Link auf die Quelle. */
  url: string;
  /** Link auf die Lizenz, wo die Lizenz ihn verlangt (CC BY 4.0). */
  lizenzUrl?: string;
}

export const ORTSSTAMM_QUELLEN: Readonly<Record<'gemeinden' | 'postleitzahlen', OrtsstammQuelle>> = {
  gemeinden: {
    text: 'Statistisches Bundesamt (Destatis), Gemeindeverzeichnis, Gebietsstand 31.12.2025',
    url: 'https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Administrativ/Archiv/GVAuszugJ/31122025_Auszug_GV.html',
  },
  postleitzahlen: {
    text: 'Postleitzahlen: GeoNames (www.geonames.org), CC BY 4.0',
    url: 'https://www.geonames.org',
    lizenzUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
};
