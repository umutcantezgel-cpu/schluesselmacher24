import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import { priceCylinderOrder } from '../pricing';

import {
  VORLAGEN,
  UNTERSCHIED_RUECKFRAGE_MM,
  berechtigen,
  dekodiere,
  ebene,
  istGleichschliessung,
  kodiere,
  leererPlan,
  matrix,
  planZuEntwurf,
  preisFuerPlan,
  pruefeMasse,
  pruefePlan,
  schluesselEntfernen,
  schluesselHinzufuegen,
  tuerEntfernen,
  tuerHinzufuegen,
  ZWISCHENSTAND_HOECHSTENS,
} from './index';

const KATALOG = defaults.cylinderCatalog();
const doppel = (bezeichnung: string, a = 30, b = 30) => ({ bezeichnung, form: 'doppelzylinder' as const, a, b });

function zweiTuerenEinSchluessel() {
  let plan = tuerHinzufuegen(tuerHinzufuegen(leererPlan(), doppel('Haustür')), doppel('Keller'));
  plan = schluesselHinzufuegen(plan, { bezeichnung: 'Familie', anzahl: 3 }, true);
  return plan;
}

describe('Schließplan und Matrix (G-27)', () => {
  it('legt Türen und Schlüssel mit eindeutigen Kennungen an und führt die Matrix', () => {
    let plan = zweiTuerenEinSchluessel();
    expect(plan.tueren.map((t) => t.id)).toEqual(['t1', 't2']);
    expect(matrix(plan)).toEqual([[true, true]]);
    plan = schluesselHinzufuegen(plan, { bezeichnung: 'Keller', anzahl: 1 });
    plan = berechtigen(plan, 's2', 't2', true);
    expect(matrix(plan)).toEqual([[true, true], [false, true]]);
    plan = berechtigen(plan, 's2', 't2', false);
    expect(matrix(plan)[1]).toEqual([false, false]);
  });

  it('entfernt Türen und Schlüssel samt Matrixfeldern', () => {
    let plan = zweiTuerenEinSchluessel();
    plan = tuerEntfernen(plan, 't1');
    expect(plan.berechtigungen.s1).toEqual(['t2']);
    plan = schluesselEntfernen(plan, 's1');
    expect(plan.schluessel).toEqual([]);
    expect(plan.berechtigungen).toEqual({});
  });

  it('benennt Ebenen in Laiensprache und erkennt die Gleichschließung (G-28)', () => {
    const plan = VORLAGEN.find((v) => v.id === 'mehrfamilienhaus')!.erzeuge();
    expect(ebene(plan, 's1')).toBe('generalhauptschluessel');
    expect(ebene(plan, 's2')).toBe('gruppenschluessel');
    expect(istGleichschliessung(plan)).toBe(false);
    expect(istGleichschliessung(zweiTuerenEinSchluessel())).toBe(true);
    expect(istGleichschliessung(leererPlan())).toBe(false);
  });

  it('meldet Lücken: Tür ohne Schlüssel, Schlüssel ohne Tür, leere Bezeichnung, Obergrenzen', () => {
    expect(pruefePlan(leererPlan()).map((b) => b.art)).toEqual(['fehler', 'fehler']);
    let plan = tuerHinzufuegen(zweiTuerenEinSchluessel(), doppel('Garage'));
    expect(pruefePlan(plan).some((b) => b.text.includes('„Garage“ gibt es noch keinen Schlüssel'))).toBe(true);
    plan = schluesselHinzufuegen(plan, { bezeichnung: 'Ersatz', anzahl: 1 });
    expect(pruefePlan(plan).some((b) => b.art === 'hinweis' && b.text.includes('„Ersatz“ schließt noch keine Tür'))).toBe(true);
    expect(pruefePlan(tuerHinzufuegen(leererPlan(), doppel(' '))).some((b) => b.text === 'Jede Tür braucht eine Bezeichnung.')).toBe(true);
    expect(pruefePlan(zweiTuerenEinSchluessel(), { hoechstensTueren: 1 }).some((b) => b.text.startsWith('Höchstens 1 Türen'))).toBe(true);
  });
});

describe('Vorlagen', () => {
  it('sind ohne Fehler und mit gültigen Maßen des Katalogs', () => {
    for (const vorlage of VORLAGEN) {
      const plan = vorlage.erzeuge();
      expect(pruefePlan(plan).filter((b) => b.art === 'fehler'), vorlage.id).toEqual([]);
      expect(pruefeMasse(plan, KATALOG).befunde.filter((b) => b.art === 'fehler'), vorlage.id).toEqual([]);
      expect(vorlage.satz).not.toMatch(/[–—!?]/);
    }
  });
});

describe('Maßprüfung (G-29)', () => {
  const form = KATALOG.forms.find((f) => f.id === 'doppelzylinder')!;

  it('lehnt Maße außerhalb der Systemdaten ab und verlangt beide Maße', () => {
    const plan = tuerHinzufuegen(leererPlan(), { bezeichnung: 'Haustür', form: 'doppelzylinder', a: form.maxMm + form.stepMm });
    const texte = pruefeMasse(plan, KATALOG).befunde.map((b) => b.text);
    expect(texte.some((t) => t.includes('Maß A') && t.includes('nicht wählbar'))).toBe(true);
    expect(texte).toContain('„Haustür“: Bitte auch Maß B angeben.');
  });

  it('fragt bei großem Unterschied zwischen A und B nach, ohne zu sperren', () => {
    const a = form.minMm % form.stepMm === 0 ? form.minMm : Math.ceil(form.minMm / form.stepMm) * form.stepMm;
    const b = a + Math.ceil(UNTERSCHIED_RUECKFRAGE_MM / form.stepMm) * form.stepMm;
    const plan = { ...tuerHinzufuegen(leererPlan(), doppel('Haustür', a, b)), masseGeprueft: true };
    const ergebnis = pruefeMasse(plan, KATALOG);
    expect(ergebnis.befunde.map((x) => x.art)).toEqual(['rueckfrage']);
    expect(ergebnis.bestellbar).toBe(true);
  });

  it('ist erst mit der Bestätigung „Maße geprüft“ bestellbar', () => {
    const plan = zweiTuerenEinSchluessel();
    expect(pruefeMasse(plan, KATALOG).bestellbar).toBe(false);
    expect(pruefeMasse({ ...plan, masseGeprueft: true }, KATALOG).bestellbar).toBe(true);
  });

  it('prüft, ob die Funktion zur Bauform passt', () => {
    const plan = tuerHinzufuegen(leererPlan(), { ...doppel('Haustür'), funktionId: 'gibt-es-nicht' });
    expect(pruefeMasse(plan, KATALOG).befunde.some((b) => b.text.includes('Funktion'))).toBe(true);
  });
});

describe('Preis über die vorhandenen Preisregeln (G9)', () => {
  it('berechnet die Sperrschließung genau wie der Bestand', () => {
    const plan = zweiTuerenEinSchluessel();
    const preis = preisFuerPlan(plan, KATALOG);
    expect(preis.art).toBe('preis');
    if (preis.art !== 'preis') return;
    expect(preis.entwurf).toEqual({ items: [{ uid: 'p1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 2 }], keyCount: 3, extraIds: [], expandable: false });
    expect(preis.aufstellung).toEqual(priceCylinderOrder(preis.entwurf, KATALOG));
  });

  it('nimmt die Planreserve als Option „erweiterbar“ aus dem Katalog', () => {
    let plan = zweiTuerenEinSchluessel();
    plan = { ...plan, schluessel: plan.schluessel.map((s) => ({ ...s, reserve: 2 })) };
    expect(planZuEntwurf(plan).extraIds).toContain('gleichschliessung-erweiterbar');
  });

  it('nennt für Schließanlagen mit Ebenen keinen erfundenen Preis, sondern ein Angebot (R9)', () => {
    const plan = VORLAGEN.find((v) => v.id === 'buero')!.erzeuge();
    expect(preisFuerPlan(plan, KATALOG)).toEqual({ art: 'angebot', grund: expect.stringContaining('Angebot') });
  });
});

describe('Zwischenstand per Link', () => {
  it('kodiert und liest denselben Plan, auch mit Umlauten', () => {
    const plan = VORLAGEN.find((v) => v.id === 'mehrfamilienhaus')!.erzeuge();
    const umlaute = { ...plan, tueren: plan.tueren.map((t, i) => (i === 0 ? { ...t, bezeichnung: 'Haustür Süd' } : t)) };
    const link = kodiere(umlaute);
    expect(link).toMatch(/^1\.[A-Za-z0-9_-]+$/);
    expect(link.length).toBeLessThan(ZWISCHENSTAND_HOECHSTENS);
    expect(dekodiere(link)).toEqual(umlaute);
  });

  it('liest nichts Fremdes: falsche Version, kaputte Daten, Schemafehler, zu lang', () => {
    expect(dekodiere(null)).toBeNull();
    expect(dekodiere('2.abc')).toBeNull();
    expect(dekodiere('1.%%%')).toBeNull();
    expect(dekodiere(`1.${btoa(JSON.stringify({ version: 1, tueren: [{ id: 't1' }] }))}`)).toBeNull();
    expect(dekodiere(`1.${'A'.repeat(ZWISCHENSTAND_HOECHSTENS)}`)).toBeNull();
  });
});
