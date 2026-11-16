/* Versand-Adapter (G-24, G-25, A-010): gemeinsame Typen. Reine Daten, nur relative Importe. */

import type { EinsendeVarianteKennung } from '../types';

/**
 * Versand der Einsendung: eine Variante des Inhabers (A-050). „versichert“ und „unversichert“ bleiben nur
 * lesbar, für Vorgänge von vor den Varianten (G6); der Kunde kann sie nicht mehr wählen.
 */
export type VersandArt = EinsendeVarianteKennung | 'versichert' | 'unversichert';

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

/** `dhl-paket`: Paket-Label über die Versenden-API für Geschäftskunden (FA-SHOP-03B), abgeschaltet. */
export type AnbieterName = 'begleitschein' | 'attrappe' | 'dhl-retoure' | 'dhl-paket';

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
