import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import { schnappschuss } from '../konfigurator/vorgang';
import type { Schliessplan } from '../konfigurator/schliessplan';
import type { BusinessRecord } from '../types';
import { erzeugePdf } from './erzeuge-pdf';
import { MATRIX_SPALTEN, SCHLIESSPLAN_FUSS, schliessplanAbschnitte, schliessplanBlatt } from './schliessplan';
import { vorgangsblattInhalt } from './vorgangsblatt';

const KATALOG = defaults.cylinderCatalog();
const JETZT = new Date('2026-11-03T19:00:00.000Z');

/* Erfundene Testdaten (G4): n Wohnungen, eine Hausverwaltung für alle, je Wohnung ein Mieterschlüssel. */
function haus(wohnungen: number): Schliessplan {
  const form = KATALOG.forms[0].id;
  const tueren = Array.from({ length: wohnungen }, (_, i) => ({ id: `t${i + 1}`, bezeichnung: `Wohnung ${i + 1}`, form, a: 30, b: 30 }));
  const mieter = tueren.map((t, i) => ({ id: `s${i + 2}`, bezeichnung: `Mieter ${i + 1}`, anzahl: 2 }));
  return {
    version: 1,
    tueren,
    schluessel: [{ id: 's1', bezeichnung: 'Hausverwaltung', anzahl: 1, reserve: 2 }, ...mieter],
    berechtigungen: { s1: tueren.map((t) => t.id), ...Object.fromEntries(mieter.map((m, i) => [m.id, [tueren[i].id]])) },
    masseGeprueft: true,
  };
}

const summe = (breiten: number[]) => breiten.reduce((a, b) => a + b, 0);

describe('Schließplan-Abschnitte (E5-OPUS-03, G-27)', () => {
  it('setzt Türen, Schlüssel, Matrix und Eckdaten mit Spaltenbreiten, die zusammen 1 ergeben', () => {
    const abschnitte = schliessplanAbschnitte(schnappschuss(haus(3), KATALOG));
    expect(abschnitte.map((a) => a.titel)).toEqual(['Schließplan: Türen', 'Schließplan: Schlüssel', 'Schließmatrix', 'Schließplan: Eckdaten']);
    for (const a of abschnitte) if (a.tabelle) {
      expect(summe(a.tabelle.breiten)).toBeCloseTo(1, 6);
      for (const zeile of a.tabelle.zeilen) expect(zeile).toHaveLength(a.tabelle.kopf.length);
    }
    const matrix = abschnitte[2].tabelle!;
    expect(matrix.kopf).toEqual(['Schlüssel', '1', '2', '3', '']);
    expect(matrix.zeilen[0]).toEqual(['Hausverwaltung', 'X', 'X', 'X', '']);
    expect(matrix.zeilen[1]).toEqual(['Mieter 1', 'X', '–', '–', '']);
    expect(abschnitte[1].tabelle!.zeilen[0][4]).toBe('alle Türen');
    expect(abschnitte[1].tabelle!.zeilen[1][4]).toBe('Tür 1');
    const eckdaten = Object.fromEntries((abschnitte[3].zeilen ?? []).map((z) => [z.name, z.wert]));
    expect(eckdaten['Schlüssel vorgemerkt']).toBe('2, für spätere Nachbestellungen');
    expect(eckdaten['Maße geprüft']).toBe('ja, vom Kunden bestätigt');
  });

  it(`teilt die Matrix in Blöcke zu höchstens ${MATRIX_SPALTEN} Türen`, () => {
    const abschnitte = schliessplanAbschnitte(schnappschuss(haus(25), KATALOG));
    const bloecke = abschnitte.filter((a) => a.titel.startsWith('Schließmatrix'));
    expect(bloecke.map((a) => a.titel)).toEqual(['Schließmatrix, Türen 1 bis 12', 'Schließmatrix, Türen 13 bis 24', 'Schließmatrix, Türen 25 bis 25']);
    for (const b of bloecke) expect(b.tabelle!.kopf.length).toBeLessThanOrEqual(MATRIX_SPALTEN + 1);
    expect(bloecke[1].tabelle!.zeilen[14]).toEqual(['Mieter 14', '–', 'X', ...Array(10).fill('–')]);
  });
});

describe('Schließplan als eigenes Blatt und im Vorgangsblatt (E5-OPUS-03, G-37)', () => {
  it('erzeugt ein mehrseitiges PDF mit Titel „Schließplan“ für große Pläne', async () => {
    const blatt = schliessplanBlatt(schnappschuss(haus(30), KATALOG), { jetzt: JETZT });
    expect(blatt.fuss).toBe(SCHLIESSPLAN_FUSS);
    expect(blatt.abschnitte.some((a) => a.titel === 'Schließplan: Eckdaten')).toBe(false);
    const pdf = await erzeugePdf(blatt, { komprimieren: false });
    const text = pdf.toString('latin1');
    expect(text.startsWith('%PDF-')).toBe(true);
    expect(text.match(/\/Type \/Page\b/g)?.length ?? 0).toBeGreaterThan(1);
  });

  it('ordnet jedem Zeichen seinen Text zu, auch einem u nach einem ü (Textebene, E5-PRUEFER-01)', async () => {
    const pdf = await erzeugePdf(
      { titel: 'Probe', nummer: 'Türen', stand: JETZT, kopf: [{ name: 'Tür', wert: 'Haustür' }], abschnitte: [{ titel: 'Bauform', text: 'Bauform und Schutz laut Katalog' }], fuss: 'Fuß' },
      { komprimieren: false },
    );
    const text = pdf.toString('latin1');
    const tabellen = [...text.matchAll(/begincmap[\s\S]*?endcmap/g)].map((m) => m[0]);
    expect(tabellen.length).toBeGreaterThan(0);
    // Jede Glyphe hat ein Zeichen; ein leerer Eintrag <> ließe das Zeichen beim Kopieren und Suchen fehlen.
    for (const t of tabellen) expect(t).not.toContain('<>');
    expect(tabellen.join(' ')).toMatch(/<0075>/);
  });

  it('hängt die Abschnitte an das Vorgangsblatt, wenn der Vorgang einen Schnappschuss trägt', () => {
    const vorgang: BusinessRecord = {
      id: '9',
      reference: 'SM24-P-2026-0009',
      kind: 'projekt',
      area: 'schliessanlagen',
      process: 'projektkonfigurator',
      status: 'neu',
      createdAt: '2026-11-03T19:00:00.000Z',
      updatedAt: '2026-11-03T19:00:00.000Z',
      contact: { firstName: 'Erika', lastName: 'Muster', email: 'erika@example.org', phone: '0301234567', street: 'Musterweg 1', postalCode: '35576', city: 'Wetzlar', country: 'Deutschland' },
      payload: { quelle: 'schliessplan-planer', schnappschuss: schnappschuss(haus(2), KATALOG, { jetzt: JETZT }) },
      summary: [{ title: 'Türen', rows: [{ label: 'Wohnung 1', value: 'Doppelzylinder' }] }],
      uploads: [],
      internalNotes: [],
      timeline: [],
    };
    const titel = vorgangsblattInhalt({ vorgang, jetzt: JETZT }).abschnitte.map((a) => a.titel);
    expect(titel).toContain('Angaben des Kunden: Türen');
    expect(titel).toContain('Schließmatrix');
    const ohne = vorgangsblattInhalt({ vorgang: { ...vorgang, payload: { quelle: 'schliessplan-planer' } }, jetzt: JETZT }).abschnitte.map((a) => a.titel);
    expect(ohne).not.toContain('Schließmatrix');
    // Nur Projekte aus dem Projektkonfigurator mit der Quelle des Planers tragen einen Schnappschuss des Servers.
    for (const fremd of [{ kind: 'anfrage' as const }, { process: 'gefuehrte-anfrage' as const }, { payload: { schnappschuss: vorgang.payload.schnappschuss } }]) {
      expect(vorgangsblattInhalt({ vorgang: { ...vorgang, ...fremd }, jetzt: JETZT }).abschnitte.map((a) => a.titel)).not.toContain('Schließmatrix');
    }
  });
});
