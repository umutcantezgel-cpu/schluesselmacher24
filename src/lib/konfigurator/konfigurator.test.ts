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
  SCHUTZ_OPTION_ID,
  passtInLink,
  schutzUmfang,
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

describe('Kern gehärtet für den Schließplan-Planer (E5-OPUS-01)', () => {
  const mitSchutz = (plan: ReturnType<typeof zweiTuerenEinSchluessel>, ids: string[]) => ({
    ...plan,
    tueren: plan.tueren.map((t) => (ids.includes(t.id) ? { ...t, optionen: [SCHUTZ_OPTION_ID] } : t)),
  });

  it('nennt für einen unvollständigen Plan keinen Preis, sondern den ersten Fehler', () => {
    const plan = tuerHinzufuegen(zweiTuerenEinSchluessel(), doppel('Garage'));
    const preis = preisFuerPlan(plan, KATALOG);
    expect(preis).toEqual({ art: 'offen', grund: expect.stringContaining('Garage') });
  });

  it('nennt auch bei Maßen außerhalb des Katalogs keinen Preis', () => {
    const plan = tuerHinzufuegen(leererPlan(), doppel('Haustür', 31, 30));
    const voll = schluesselHinzufuegen(plan, { bezeichnung: 'Familie', anzahl: 3 }, true);
    expect(preisFuerPlan(voll, KATALOG).art).toBe('offen');
  });

  it('rechnet den Aufbohr- und Ziehschutz an allen Türen wie die Kasse (G9)', () => {
    const plan = mitSchutz(zweiTuerenEinSchluessel(), ['t1', 't2']);
    expect(schutzUmfang(plan)).toBe('alle');
    const preis = preisFuerPlan(plan, KATALOG);
    expect(preis.art).toBe('preis');
    if (preis.art !== 'preis') return;
    expect(preis.entwurf.extraIds).toContain(SCHUTZ_OPTION_ID);
    expect(preis.aufstellung).toEqual(priceCylinderOrder(preis.entwurf, KATALOG));
  });

  it('macht Schutz an einzelnen Türen zum Angebot statt zu einem Schätzwert (R9)', () => {
    const plan = mitSchutz(zweiTuerenEinSchluessel(), ['t1']);
    expect(schutzUmfang(plan)).toBe('einige');
    expect(preisFuerPlan(plan, KATALOG)).toEqual({ art: 'angebot', grund: expect.stringContaining('einzelnen Türen') });
  });

  it('übernimmt die Höchstwerte der Kasse: mehr Zylinder als der Katalog erlaubt werden ein Angebot', () => {
    let plan = leererPlan();
    for (let n = 1; n <= KATALOG.maxCylinders + 1; n += 1) plan = tuerHinzufuegen(plan, doppel(`Tür ${n}`));
    plan = schluesselHinzufuegen(plan, { bezeichnung: 'Alle', anzahl: 3 }, true);
    expect(preisFuerPlan(plan, KATALOG)).toEqual({ art: 'angebot', grund: expect.stringContaining(String(KATALOG.maxCylinders)) });
  });

  it('übernimmt „Maße geprüft“ nie aus einem Link und lässt fremde Verweise fallen (G-29)', () => {
    const plan = { ...zweiTuerenEinSchluessel(), masseGeprueft: true };
    const gelesen = dekodiere(kodiere(plan));
    expect(gelesen?.masseGeprueft).toBeUndefined();
    const fremd = { ...zweiTuerenEinSchluessel(), berechtigungen: { s1: ['t1', 't9'], s7: ['t1'] } };
    expect(dekodiere(kodiere(fremd))?.berechtigungen).toEqual({ s1: ['t1'] });
  });

  it('lehnt Links mit doppelten Kennungen ab und sagt vorher, ob ein Plan in den Link passt', () => {
    const plan = zweiTuerenEinSchluessel();
    const doppelt = { ...plan, tueren: [plan.tueren[0], { ...plan.tueren[1], id: plan.tueren[0].id }] };
    expect(dekodiere(kodiere(doppelt))).toBeNull();
    expect(passtInLink(plan)).toBe(true);
    let gross = leererPlan();
    for (let n = 1; n <= 40; n += 1) gross = tuerHinzufuegen(gross, doppel(`Wohnung ${n} mit langer Bezeichnung`));
    for (let n = 1; n <= 6; n += 1) gross = schluesselHinzufuegen(gross, { bezeichnung: `Gruppe ${n}`, anzahl: 2 }, true);
    expect(passtInLink(gross)).toBe(false);
  });

  it('macht Planreserve ohne angebotene Option und aktive Hersteller zum Angebot statt zum stillen Fehler', () => {
    let plan = zweiTuerenEinSchluessel();
    plan = { ...plan, schluessel: plan.schluessel.map((s) => ({ ...s, reserve: 1 })) };
    const ohneErweiterbar = { ...KATALOG, extras: KATALOG.extras.map((e) => (e.id === 'gleichschliessung-erweiterbar' ? { ...e, active: false } : e)) };
    expect(preisFuerPlan(plan, ohneErweiterbar)).toEqual({ art: 'angebot', grund: expect.stringContaining('vormerken') });
    const mitHersteller = { ...KATALOG, manufacturers: [{ id: 'h1', name: 'Hersteller', active: true, forms: [], surchargeCentsPerCylinder: 0, components: [] }] } as unknown as typeof KATALOG;
    expect(preisFuerPlan(zweiTuerenEinSchluessel(), mitHersteller)).toEqual({ art: 'angebot', grund: expect.stringContaining('Hersteller') });
  });
});
