/*
 * Was die Seite zum Einschicken sagt (G-24, R9, MA-08, MA-18): „kostenlos“ nur mit aktivem und
 * eingerichtetem Retourenlabel; sonst Begleitschein und die Portopreise der Post als Empfehlung.
 * Reine Funktion.
 */

import { formatCents } from '../format';
import type { EinsendeEinstellungen } from '../types';

import type { VersandArt } from './typen';

export interface EinsendeOption {
  art: VersandArt;
  titel: string;
  empfohlen: boolean;
  /** Aufpreis des Betriebs (Cent), 0 = keiner. */
  aufpreisCents: number;
  /** Porto bei der Post, nur ohne Retourenlabel. */
  portoCents?: number;
  hinweis: string;
}

export interface EinsendeAngebot {
  kostenlos: boolean;
  /** Ein Satz für die Seite. */
  satz: string;
  optionen: EinsendeOption[];
  /** Quelle der Portopreise, sichtbar unter den Optionen. */
  stand?: string;
}

export function einsendeAngebot(e: EinsendeEinstellungen, labelEingerichtet: boolean): EinsendeAngebot {
  const kostenlos = e.labelAktiv && labelEingerichtet;
  if (kostenlos) {
    return {
      kostenlos,
      satz: 'Sie drucken das Versandlabel aus, das Porto zahlt SCHLÜSSELMACHER24.',
      optionen: [
        { art: 'versichert', titel: 'Versichert', empfohlen: true, aufpreisCents: e.aufpreisVersichertCents, hinweis: 'Empfohlen: mit Sendungsverfolgung und Haftung des Versanddienstleisters.' },
        { art: 'unversichert', titel: 'Unversichert', empfohlen: false, aufpreisCents: e.aufpreisUnversichertCents, hinweis: 'Ohne Haftung bei Verlust.' },
      ],
    };
  }
  return {
    kostenlos,
    satz: 'Sie drucken den Begleitschein aus und frankieren den Umschlag selbst; das Porto zahlen Sie bei der Post.',
    optionen: [
      {
        art: 'versichert',
        titel: 'Versichert',
        empfohlen: true,
        aufpreisCents: e.aufpreisVersichertCents,
        portoCents: e.portoVersichertCents,
        hinweis: `Empfohlen: als Einschreiben, ${formatCents(e.portoVersichertCents)} bei der Post, Haftung bis ${e.haftungVersichertEuro} €.`,
      },
      {
        art: 'unversichert',
        titel: 'Unversichert',
        empfohlen: false,
        aufpreisCents: e.aufpreisUnversichertCents,
        portoCents: e.portoUnversichertCents,
        hinweis: `Als Großbrief, ${formatCents(e.portoUnversichertCents)} bei der Post, ohne Haftung bei Verlust.`,
      },
    ],
    stand: e.portoStand,
  };
}
