/*
 * Schließplan als PDF (E5-OPUS-03, G-27, G-37): Abschnitte aus dem Schnappschuss für das
 * Vorgangsblatt und ein eigenes Blatt zum Herunterladen im Planer. Reine Daten wie vorgangsblatt.ts;
 * gesetzt wird mit erzeugePdf.
 */

import type { SchliessplanSchnappschuss } from '../konfigurator/vorgang';
import type { Blatt, BlattAbschnitt, BlattZeile } from './blatt';

/** Türen je Matrixtabelle; mehr Spalten passen auf A4 hoch nicht lesbar nebeneinander. */
export const MATRIX_SPALTEN = 12;
/** Breite einer Türspalte der Matrix höchstens, als Anteil der Seitenbreite. */
export const MATRIX_SPALTE_HOECHSTENS = 0.08;

export const SCHLIESSPLAN_DATEINAME = 'Schliessplan.pdf';

export const SCHLIESSPLAN_FUSS = 'Schließplan aus dem Planer auf schluesselmacher24.de. Dieses Blatt ist keine Bestellung.';

function schliesstText(tueren: number[], alle: number): string {
  if (!tueren.length) return 'noch keine Tür';
  if (alle > 1 && tueren.length === alle) return 'alle Türen';
  return `${tueren.length === 1 ? 'Tür' : 'Türen'} ${tueren.join(', ')}`;
}

function summen(s: SchliessplanSchnappschuss) {
  return {
    jetzt: s.schluessel.reduce((n, k) => n + k.anzahl, 0),
    vorgemerkt: s.schluessel.reduce((n, k) => n + k.reserve, 0),
  };
}

/** Türen, Schlüssel, Matrix (in Blöcken zu höchstens zwölf Türen) und die Eckdaten des Plans. */
export function schliessplanAbschnitte(s: SchliessplanSchnappschuss, { mitAngaben = true }: { mitAngaben?: boolean } = {}): BlattAbschnitt[] {
  const abschnitte: BlattAbschnitt[] = [
    {
      titel: 'Schließplan: Türen',
      tabelle: {
        kopf: ['Nr.', 'Tür', 'Bauform', 'Maße', 'Funktion und Schutz'],
        breiten: [0.07, 0.25, 0.2, 0.22, 0.26],
        rechts: [0],
        zeilen: s.tueren.map((t) => [String(t.nr), t.bezeichnung, t.bauform, t.masse, [t.funktion, t.schutz].filter(Boolean).join(', ') || '–']),
      },
    },
    {
      titel: 'Schließplan: Schlüssel',
      tabelle: {
        kopf: ['Nr.', 'Schlüssel', 'Jetzt', 'Vorgemerkt', 'Schließt'],
        breiten: [0.07, 0.31, 0.1, 0.14, 0.38],
        rechts: [0, 2, 3],
        zeilen: s.schluessel.map((k) => [
          String(k.nr),
          k.kennzeichnung ? `${k.bezeichnung} (${k.kennzeichnung})` : k.bezeichnung,
          String(k.anzahl),
          String(k.reserve),
          schliesstText(k.tueren, s.tueren.length),
        ]),
      },
    },
  ];

  for (let von = 0; von < s.tueren.length; von += MATRIX_SPALTEN) {
    const block = s.tueren.slice(von, von + MATRIX_SPALTEN);
    // Schmale Türspalten wie auf einem gedruckten Schließplan; was übrig bleibt, nimmt eine leere Spalte.
    const spalte = Math.min(0.7 / block.length, MATRIX_SPALTE_HOECHSTENS);
    const rest = 0.7 - spalte * block.length;
    const fuellen = rest > 0.001;
    abschnitte.push({
      titel: s.tueren.length > MATRIX_SPALTEN ? `Schließmatrix, Türen ${block[0].nr} bis ${block[block.length - 1].nr}` : 'Schließmatrix',
      tabelle: {
        kopf: ['Schlüssel', ...block.map((t) => String(t.nr)), ...(fuellen ? [''] : [])],
        breiten: [0.3, ...block.map(() => spalte), ...(fuellen ? [rest] : [])],
        zeilen: s.schluessel.map((k) => [k.bezeichnung, ...block.map((t) => (k.tueren.includes(t.nr) ? 'X' : '–')), ...(fuellen ? [''] : [])]),
      },
    });
  }

  if (mitAngaben) {
    const { jetzt, vorgemerkt } = summen(s);
    const zeilen: BlattZeile[] = [
      ...(s.system ? [{ name: 'System', wert: s.system }] : []),
      { name: 'Türen', wert: String(s.tueren.length) },
      { name: 'Schlüssel jetzt', wert: String(jetzt) },
      { name: 'Schlüssel vorgemerkt', wert: vorgemerkt ? `${vorgemerkt}, für spätere Nachbestellungen` : 'keine' },
      { name: 'Maße geprüft', wert: s.masseGeprueft ? 'ja, vom Kunden bestätigt' : 'nein' },
      { name: 'Preis', wert: s.preis.text },
      ...(s.wuensche.length ? [{ name: 'Zusatzwünsche', wert: s.wuensche.join(', ') }] : []),
    ];
    abschnitte.push({ titel: 'Schließplan: Eckdaten', zeilen });
  }
  return abschnitte;
}

/** Eigenes Blatt zum Herunterladen: Eckdaten im Kopf, danach Türen, Schlüssel und Matrix. */
export function schliessplanBlatt(s: SchliessplanSchnappschuss, { nummer = 'Entwurf', jetzt = new Date() }: { nummer?: string; jetzt?: Date } = {}): Blatt {
  const { jetzt: anzahl, vorgemerkt } = summen(s);
  return {
    titel: 'Schließplan',
    nummer,
    stand: jetzt,
    kopf: [
      { name: 'Türen', wert: String(s.tueren.length) },
      { name: 'Schlüssel', wert: vorgemerkt ? `${anzahl} jetzt, ${vorgemerkt} vorgemerkt` : `${anzahl} jetzt` },
      { name: 'Preis', wert: s.preis.text },
    ],
    abschnitte: schliessplanAbschnitte(s, { mitAngaben: false }),
    fuss: SCHLIESSPLAN_FUSS,
  };
}
