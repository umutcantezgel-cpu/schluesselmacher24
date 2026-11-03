/*
 * Datenmodell eines Vorgangsblatts als PDF (G-37, A-004, A-015). Reine Daten: Der Renderer
 * (`erzeuge-pdf.ts`) kennt keine Vorgänge, die Ableitung (`vorgangsblatt.ts`) kein pdfkit.
 */

export interface BlattZeile {
  name: string;
  wert: string;
  /** Wert in Mono (Kennungen, Codes). */
  mono?: boolean;
  /** Wert hervorgehoben (fett). */
  betont?: boolean;
}

export interface BlattTabelle {
  kopf: string[];
  /** Spaltenbreiten als Anteile, Summe 1. */
  breiten: number[];
  /** Spalten mit rechtsbündigen Zahlen (Index). */
  rechts?: number[];
  zeilen: string[][];
  /** Zeilen unter der Tabelle, etwa Versand und Gesamt. */
  summen?: BlattZeile[];
}

export interface BlattBild {
  name: string;
  /** JPEG oder PNG. */
  daten: Uint8Array;
}

export interface BlattAbschnitt {
  titel: string;
  zeilen?: BlattZeile[];
  tabelle?: BlattTabelle;
  /** Freier Text, etwa „Keine Notizen.“ */
  text?: string;
  bilder?: BlattBild[];
}

export interface Blatt {
  /** Titel in den PDF-Metadaten und im Kopf, etwa „Vorgangsblatt SM24-T-2026-0007“. */
  titel: string;
  /** Vorgangsnummer, groß im Kopf. */
  nummer: string;
  /** Stand des Blatts; auch Erstellzeit in den Metadaten (gleiche Eingabe, gleiche Datei). */
  stand: Date;
  /** Kopfzeilen „auf einen Blick“ (Status, nächster Schritt …). */
  kopf: BlattZeile[];
  abschnitte: BlattAbschnitt[];
  /** Fußzeile auf jeder Seite. */
  fuss: string;
}
