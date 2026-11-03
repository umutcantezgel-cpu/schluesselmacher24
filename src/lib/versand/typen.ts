/* Versand-Adapter (G-24, G-25, A-010): gemeinsame Typen. Reine Daten, nur relative Importe. */

export type VersandArt = 'versichert' | 'unversichert';

export interface Anschrift {
  name: string;
  zusatz?: string;
  strasse: string;
  plz: string;
  ort: string;
  land?: string;
}

/** Eine Einsendung des Kunden an die Werkstatt. */
export interface Sendung {
  vorgangsnummer: string;
  art: VersandArt;
  /** Kunde. */
  absender: Anschrift;
  /** Werkstatt. */
  empfaenger: Anschrift;
  /** Was im Umschlag liegt, etwa „1 Schlüssel zum Nachmachen“. */
  inhalt: string;
}

export type AnbieterName = 'begleitschein' | 'attrappe' | 'dhl-retoure';

export interface Versandschein {
  anbieter: AnbieterName;
  dateiname: string;
  pdf: Buffer;
  sendungsnummer?: string;
  /** Kosten trägt der Betrieb (echtes Retourenlabel); nur dann darf die Seite „kostenlos“ sagen (R9). */
  kostenlos: boolean;
}

export interface VersandAnbieter {
  readonly name: AnbieterName;
  erstelle(sendung: Sendung): Promise<Versandschein>;
}
