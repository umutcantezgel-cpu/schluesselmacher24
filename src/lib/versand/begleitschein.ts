/*
 * Begleitschein als PDF (G-24, A-010, A-050): Standard ohne Retourenlabel. Der Kunde legt ihn dem Schlüssel
 * bei und klebt die Anschrift auf die Sendung; das Porto zahlt er bei der Post. Er nennt die gewählte
 * Variante mit Haftung als Zahl, Porto mit Stand und den Verpackungshinweis des Inhabers.
 */

import type { Blatt } from '../pdf/blatt';
import { erzeugePdf } from '../pdf/erzeuge-pdf';
import { formatCents } from '../format';
import type { EinsendeEinstellungen } from '../types';

import type { Anschrift, Sendung, VersandAnbieter } from './typen';
import {
  HAFTUNG_HINWEIS,
  PORTO_UNBELEGT,
  VERPACKUNG_HINWEIS,
  einlieferungSatz,
  haftungSatz,
  haftungWarnung,
  varianteZu,
  versandBezeichnung,
} from './varianten';

const zeilen = (a: Anschrift) =>
  [a.name, a.zusatz, a.strasse, [a.plz, a.ort].filter(Boolean).join(' '), a.land && a.land !== 'Deutschland' ? a.land : undefined].filter(
    (z): z is string => Boolean(z),
  );

/** Zeile „So geben Sie die Sendung auf“: Variante, Abgabe, Porto mit Stand und Haftung (A-050). */
function aufgabeZeile(sendung: Sendung, e: EinsendeEinstellungen): string {
  // Ältere Vorgänge (vor den Varianten, G6) behalten ihre Angabe.
  if (sendung.art === 'versichert') {
    return `Den Umschlag bei der Post als Einschreiben aufgeben (${formatCents(e.portoVersichertCents)}, Haftung bis ${e.haftungVersichertEuro} €).`;
  }
  if (sendung.art === 'unversichert') return `Den Umschlag bei der Post als Großbrief aufgeben (${formatCents(e.portoUnversichertCents)}).`;
  const v = varianteZu(e, sendung.art);
  if (!v) return 'Die Sendung bei der Post aufgeben.';
  const porto = v.portoCents === null ? PORTO_UNBELEGT : `${formatCents(v.portoCents)} Porto laut Post`;
  const ort = einlieferungSatz(v);
  return `Als ${v.bezeichnung} aufgeben${ort ? ` (${ort})` : ''}: ${porto}, ${haftungSatz(v)}.`;
}

export function begleitscheinInhalt(sendung: Sendung, e: EinsendeEinstellungen, { jetzt = new Date(), attrappe = false } = {}): Blatt {
  const v = varianteZu(e, sendung.art);
  const warnung = v ? haftungWarnung(v) : undefined;
  return {
    titel: `${attrappe ? 'ATTRAPPE ' : ''}Begleitschein ${sendung.vorgangsnummer}`,
    nummer: sendung.vorgangsnummer,
    stand: jetzt,
    kopf: [
      { name: 'Vorgang', wert: sendung.vorgangsnummer, mono: true },
      { name: 'Versand', wert: versandBezeichnung(sendung.art, e), betont: true },
      { name: 'Inhalt', wert: sendung.inhalt },
    ],
    abschnitte: [
      { titel: 'Anschrift für die Sendung', adressfeld: zeilen(sendung.empfaenger) },
      { titel: 'Absender', zeilen: zeilen(sendung.absender).map((wert, i) => ({ name: i === 0 ? 'Name' : '', wert })) },
      {
        titel: 'So schicken Sie Ihren Schlüssel',
        zeilen: [
          { name: '1', wert: `${VERPACKUNG_HINWEIS} Diesen Schein beilegen.` },
          { name: '2', wert: 'Keinen Anhänger mit Ihrer Anschrift am Schlüssel lassen.' },
          { name: '3', wert: 'Die Anschrift oben ausschneiden und aufkleben oder abschreiben.' },
          { name: '4', wert: aufgabeZeile(sendung, e) },
          { name: '5', wert: 'Den Stand sehen Sie jederzeit auf Ihrer Vorgangsseite; dort steht auch, wann der Schlüssel zurückkommt.' },
        ],
      },
      ...(warnung ? [{ titel: 'Haftung', text: `${warnung} ${HAFTUNG_HINWEIS}` }] : []),
      ...(v ? [{ titel: 'Stand des Portos', text: v.portoStand }] : e.portoStand ? [{ titel: 'Stand der Portopreise', text: e.portoStand }] : []),
    ],
    fuss: `Begleitschein zum Vorgang ${sendung.vorgangsnummer} · SCHLÜSSELMACHER24`,
  };
}

export function begleitschein(e: EinsendeEinstellungen, { attrappe = false } = {}): VersandAnbieter {
  return {
    name: attrappe ? 'attrappe' : 'begleitschein',
    async erstelle(sendung) {
      const pdf = await erzeugePdf(begleitscheinInhalt(sendung, e, { attrappe }));
      return {
        anbieter: attrappe ? 'attrappe' : 'begleitschein',
        dateiname: `Begleitschein-${sendung.vorgangsnummer.replace(/[^A-Za-z0-9-]/g, '')}.pdf`,
        pdf,
        ...(attrappe ? { sendungsnummer: `ATTRAPPE-${sendung.vorgangsnummer}` } : {}),
        kostenlos: attrappe,
      };
    },
  };
}
