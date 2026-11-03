import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { measureOptions } from '@/lib/cylinder-rules';
import { SCHUTZ_OPTION_ID, VORLAGEN, leererPlan, preisFuerPlan, schluesselHinzufuegen, tuerHinzufuegen } from '@/lib/konfigurator';

import { alleTueren, formWechseln, neueTuer, planBefunde, PlanSumme, SchluesselMatrix, summeKurz, TuerenListe } from './schliessplan-editor';

const KATALOG = defaults.cylinderCatalog();
const ohne = () => undefined;

describe('Schließplan-Planer: Bausteine (E5-OPUS-01)', () => {
  it('legt neue Türen mit wählbaren Maßen aus dem Katalog an', () => {
    const tuer = neueTuer(KATALOG, 'Haustür');
    const form = KATALOG.forms.find((f) => f.id === tuer.form)!;
    expect(measureOptions(form)).toContain(tuer.a);
    if (form.measures === 'beide') expect(measureOptions(form)).toContain(tuer.b);
  });

  it('setzt beim Wechsel der Bauform Maße und Funktion auf erlaubte Werte', () => {
    const doppel = { id: 't1', ...neueTuer(KATALOG, 'Haustür'), a: 80, b: 80, funktionId: 'not-gefahr' };
    const halb = formWechseln(doppel, 'halbzylinder', KATALOG);
    const halbForm = KATALOG.forms.find((f) => f.id === 'halbzylinder')!;
    expect(halb.b).toBeUndefined();
    expect(measureOptions(halbForm)).toContain(halb.a);
    expect(halb.funktionId).toBeUndefined();
  });

  it('setzt „alle Türen“ für einen Schlüssel und löst sie wieder', () => {
    let plan = tuerHinzufuegen(tuerHinzufuegen(leererPlan(), neueTuer(KATALOG, 'A')), neueTuer(KATALOG, 'B'));
    plan = schluesselHinzufuegen(plan, { bezeichnung: 'Alle', anzahl: 2 });
    expect(alleTueren(plan, 's1', true).berechtigungen.s1).toEqual(['t1', 't2']);
    expect(alleTueren(alleTueren(plan, 's1', true), 's1', false).berechtigungen.s1).toEqual([]);
  });

  it('macht Maß-Rückfragen zu Hinweisen, die nicht sperren', () => {
    const plan = { ...VORLAGEN[0].erzeuge() };
    plan.tueren = plan.tueren.map((t, i) => (i === 0 ? { ...t, a: 30, b: 60 } : t));
    const befunde = planBefunde(plan, KATALOG);
    expect(befunde.some((b) => b.art === 'hinweis' && b.text.includes('unterscheiden'))).toBe(true);
    expect(befunde.some((b) => b.art === 'fehler')).toBe(false);
  });

  it('nennt in der Summe nur einen Preis, den der Katalog rechnet', () => {
    const sperr = VORLAGEN.find((v) => v.id === 'sperrschliessung')!.erzeuge();
    const preis = preisFuerPlan(sperr, KATALOG);
    expect(summeKurz(preis).label).toBe('Gesamt');
    const buero = VORLAGEN.find((v) => v.id === 'buero')!.erzeuge();
    expect(summeKurz(preisFuerPlan(buero, KATALOG))).toEqual({ label: 'Preis', wert: 'mit Angebot' });
    expect(renderToStaticMarkup(<PlanSumme plan={buero} katalog={KATALOG} />)).toContain('mit dem Angebot');
  });

  it('beschriftet jedes Feld der Matrix und jede Türkarte für Hilfsmittel', () => {
    const plan = VORLAGEN.find((v) => v.id === 'mehrfamilienhaus')!.erzeuge();
    const matrix = renderToStaticMarkup(<SchluesselMatrix plan={plan} onChange={ohne} />);
    expect(matrix).toContain('<caption class="sr-only">Schließmatrix');
    expect(matrix.match(/aria-label="„[^"]+“ schließt „[^"]+“"/g)).toHaveLength(plan.schluessel.length * plan.tueren.length);
    const tueren = renderToStaticMarkup(<TuerenListe plan={plan} katalog={KATALOG} onChange={ohne} />);
    expect(tueren.match(/<fieldset/g)).toHaveLength(plan.tueren.length);
    expect(tueren).toContain(KATALOG.extras.find((e) => e.id === SCHUTZ_OPTION_ID)!.label);
  });
});
