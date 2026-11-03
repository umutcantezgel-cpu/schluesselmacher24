import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { dekodiere, kodiere, planZuEntwurf, preisFuerPlan } from '@/lib/konfigurator';
import { priceCylinderOrder } from '@/lib/pricing';
import type { CylinderLineItem } from '@/lib/types';

import { ausLink, istStartzustand, masseRueckfragen, planZuPositionen, positionenZuPlan, type Zusammenstellung } from './kern';

const KATALOG = defaults.cylinderCatalog();
const FORM = KATALOG.forms.find((f) => f.active && f.measures === 'beide')!;
const FUNKTION = KATALOG.functions.find((fn) => fn.active && fn.forms.includes(FORM.id))!.id;

/* Erfundene Testdaten (G4): zwei Haustüren gleich, ein Keller anders. */
const POSITIONEN: CylinderLineItem[] = [
  { uid: 'position-1', form: FORM.id, measureAMm: 30, measureBMm: 35, functionId: FUNKTION, qty: 2 },
  { uid: 'position-2', form: FORM.id, measureAMm: 30, measureBMm: 30, functionId: FUNKTION, qty: 1 },
];

const START: Zusammenstellung = { items: [{ ...POSITIONEN[1], uid: 'position-1' }], keyCount: 3, extraIds: [], expandable: null, manufacturerId: '', components: [] };

const zurueck = (plan: ReturnType<typeof positionenZuPlan>) => planZuPositionen(dekodiere(kodiere(plan))!, KATALOG);

describe('Bestandskonfigurator auf dem Konfigurator-Kern (E5-OPUS-02)', () => {
  it('macht aus Positionen je Zylinder eine Tür und einen Schlüssel für alle Türen', () => {
    const plan = positionenZuPlan(POSITIONEN, 5);
    expect(plan.tueren.map((t) => t.bezeichnung)).toEqual(['Zylinder 1', 'Zylinder 2', 'Zylinder 3']);
    expect(plan.tueren[0].funktionId).toBe(FUNKTION);
    expect(plan.schluessel).toEqual([{ id: 's1', bezeichnung: 'Schlüssel', anzahl: 5 }]);
    expect(plan.berechtigungen.s1).toEqual(['t1', 't2', 't3']);
  });

  it('kommt über den Link verlustfrei zurück: Positionen mit Funktion, Schlüsselzahl, Ziehschutz und Erweiterung', () => {
    expect(zurueck(positionenZuPlan(POSITIONEN, 5))).toEqual({ items: POSITIONEN, keyCount: 5, extraIds: [], expandable: null, schutzTeilweise: false });
    const mit = zurueck(positionenZuPlan(POSITIONEN, 5, { extraIds: ['ziehschutz'], expandable: true }));
    expect(mit).toMatchObject({ extraIds: ['ziehschutz'], expandable: true, schutzTeilweise: false });
  });

  it('nimmt aus dem Planer Ziehschutz an allen Türen und Vormerkung so, wie der Planer sie berechnet', () => {
    const planer = positionenZuPlan(POSITIONEN, 5, { extraIds: ['ziehschutz'], expandable: true });
    const inhalt = planZuPositionen(planer, KATALOG)!;
    const bestand = priceCylinderOrder({ items: inhalt.items, keyCount: inhalt.keyCount, extraIds: [...inhalt.extraIds, 'gleichschliessung-erweiterbar'], expandable: true }, KATALOG);
    const kern = preisFuerPlan(planer, KATALOG);
    expect(kern.art).toBe('preis');
    if (kern.art === 'preis') expect(bestand.totalCents).toBe(kern.aufstellung.totalCents);
  });

  it('rechnet über den Kern denselben Preis wie der Bestand für dieselbe Zusammenstellung (G9)', () => {
    const kern = priceCylinderOrder(planZuEntwurf(positionenZuPlan(POSITIONEN, 5)), KATALOG);
    const bestand = priceCylinderOrder({ items: POSITIONEN, keyCount: 5, extraIds: [], expandable: false }, KATALOG);
    expect(kern.totalCents).toBe(bestand.totalCents);
    expect(kern.cylinderCount).toBe(3);
  });

  it('meldet Ziehschutz nur an einigen Türen, statt ihn still zu übernehmen', () => {
    const plan = positionenZuPlan(POSITIONEN, 5);
    plan.tueren[0] = { ...plan.tueren[0], optionen: ['ziehschutz'] };
    expect(planZuPositionen(plan, KATALOG)).toMatchObject({ extraIds: [], schutzTeilweise: true });
  });

  it('übernimmt nur, was der Bestand so bestellen kann', () => {
    const plan = positionenZuPlan(POSITIONEN, 5);
    const mitEbenen = { ...plan, schluessel: [...plan.schluessel, { id: 's2', bezeichnung: 'Kind', anzahl: 1 }], berechtigungen: { ...plan.berechtigungen, s2: ['t1'] } };
    expect(planZuPositionen(mitEbenen, KATALOG)).toBeNull();
    const inaktiv = { ...KATALOG, forms: KATALOG.forms.map((f) => (f.id === FORM.id ? { ...f, active: false } : f)) };
    expect(planZuPositionen(plan, inaktiv)).toBeNull();
    expect(planZuPositionen({ ...plan, tueren: [{ ...plan.tueren[0], a: 32 }, ...plan.tueren.slice(1)] }, KATALOG)).toBeNull();
    expect(planZuPositionen({ ...plan, tueren: [{ ...plan.tueren[0], funktionId: 'erfunden' }, ...plan.tueren.slice(1)] }, KATALOG)).toBeNull();
    expect(planZuPositionen(positionenZuPlan([{ ...POSITIONEN[0], qty: KATALOG.maxCylinders + 1 }], 5), KATALOG)).toBeNull();
    expect(planZuPositionen(positionenZuPlan(POSITIONEN, 0), KATALOG)).toBeNull();
    expect(planZuPositionen(positionenZuPlan(POSITIONEN, KATALOG.maxKeys + 1), KATALOG)).toBeNull();
  });

  it('meldet Rückfragen der Maßprüfung je Position, ohne etwas aufzuhalten', () => {
    expect(masseRueckfragen(POSITIONEN, KATALOG)).toEqual([]);
    const ungleich: CylinderLineItem[] = [{ uid: 'position-1', form: FORM.id, measureAMm: 30, measureBMm: 70, qty: 1 }];
    const rueckfragen = masseRueckfragen(ungleich, KATALOG);
    expect(rueckfragen).toHaveLength(1);
    expect(rueckfragen[0]).toContain('Tür 1');
  });

  it('erkennt den Startzustand an allen Feldern und ersetzt beim Übernehmen alles', () => {
    expect(istStartzustand({ ...START, items: [{ ...START.items[0], uid: 'position-7' }] }, START)).toBe(true);
    expect(istStartzustand({ ...START, expandable: true }, START)).toBe(false);
    expect(istStartzustand({ ...START, extraIds: ['ziehschutz'] }, START)).toBe(false);
    expect(istStartzustand({ ...START, manufacturerId: 'h1' }, START)).toBe(false);
    const inhalt = zurueck(positionenZuPlan(POSITIONEN, 5))!;
    expect(ausLink(inhalt, START)).toEqual({ ...START, items: POSITIONEN, keyCount: 5, extraIds: [], expandable: null });
  });
});
