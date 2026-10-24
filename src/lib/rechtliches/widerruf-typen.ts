/*
 * Gemeinsame Angaben des Widerrufsbuttons für Formular (Browser) und Server —
 * bewusst ohne Server-Abhängigkeiten.
 */

/** Was der Kunde mit dem Absenden erklärt; steht so auch im Formular. */
export const WIDERRUF_ERKLAERUNG = 'Hiermit widerrufe ich den oben bezeichneten Vertrag.';

export type WiderrufFeld = 'name' | 'email' | 'vorgangsnummer' | 'erklaerung';

export type WiderrufErgebnis =
  | {
      status: 'eingegangen';
      /** ISO-Zeitpunkt des Eingangs. */
      eingangAm: string;
      name: string;
      email: string;
      vorgangsnummer?: string;
      /** Eingangsbestätigung per E-Mail versendet. */
      mailGesendet: boolean;
    }
  | { status: 'ungueltig'; fehler: Partial<Record<WiderrufFeld, string>> }
  /** Ohne Datenbank (Notbetrieb): nichts gespeichert, Erklärung bitte per E-Mail. */
  | { status: 'ohne-speicher'; email?: string }
  | { status: 'fehler'; meldung: string };

