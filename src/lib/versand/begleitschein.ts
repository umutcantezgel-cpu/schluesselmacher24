/*
 * Begleitschein als PDF (G-24, A-010): Standard ohne Retourenlabel. Der Kunde legt ihn dem Schlüssel
 * bei und klebt die Anschrift auf den Umschlag; das Porto zahlt er bei der Post.
 */

import type { Blatt } from '../pdf/blatt';
import { erzeugePdf } from '../pdf/erzeuge-pdf';
import { formatCents } from '../format';
import type { EinsendeEinstellungen } from '../types';

import type { Anschrift, Sendung, VersandAnbieter } from './typen';

const zeilen = (a: Anschrift) =>
  [a.name, a.zusatz, a.strasse, [a.plz, a.ort].filter(Boolean).join(' '), a.land && a.land !== 'Deutschland' ? a.land : undefined].filter(
    (z): z is string => Boolean(z),
  );

export function begleitscheinInhalt(sendung: Sendung, e: EinsendeEinstellungen, { jetzt = new Date(), attrappe = false } = {}): Blatt {
  const versichert = sendung.art === 'versichert';
  const porto = versichert
    ? `als Einschreiben (Empfehlung, ${formatCents(e.portoVersichertCents)}, Haftung bis ${e.haftungVersichertEuro} €)`
    : `als Großbrief (${formatCents(e.portoUnversichertCents)}, ohne Haftung bei Verlust)`;
  return {
    titel: `${attrappe ? 'ATTRAPPE ' : ''}Begleitschein ${sendung.vorgangsnummer}`,
    nummer: sendung.vorgangsnummer,
    stand: jetzt,
    kopf: [
      { name: 'Vorgang', wert: sendung.vorgangsnummer, mono: true },
      { name: 'Versand', wert: versichert ? 'versichert' : 'unversichert', betont: true },
      { name: 'Inhalt', wert: sendung.inhalt },
    ],
    abschnitte: [
      { titel: 'Anschrift für den Umschlag', adressfeld: zeilen(sendung.empfaenger) },
      { titel: 'Absender', zeilen: zeilen(sendung.absender).map((wert, i) => ({ name: i === 0 ? 'Name' : '', wert })) },
      {
        titel: 'So schicken Sie Ihren Schlüssel',
        zeilen: [
          { name: '1', wert: 'Schlüssel in einen gepolsterten Umschlag legen und diesen Schein beilegen.' },
          { name: '2', wert: 'Keinen Anhänger mit Ihrer Anschrift am Schlüssel lassen.' },
          { name: '3', wert: 'Die Anschrift oben ausschneiden und auf den Umschlag kleben oder abschreiben.' },
          { name: '4', wert: `Den Umschlag bei der Post ${porto} aufgeben.` },
          { name: '5', wert: 'Den Stand sehen Sie jederzeit auf Ihrer Vorgangsseite; dort steht auch, wann der Schlüssel zurückkommt.' },
        ],
      },
      ...(e.portoStand ? [{ titel: 'Stand der Portopreise', text: e.portoStand }] : []),
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
