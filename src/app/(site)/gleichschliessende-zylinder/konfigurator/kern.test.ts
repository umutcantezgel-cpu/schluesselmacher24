import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import {
  KEINE_HERSTELLER_VORGABE,
  dekodiere,
  kodiere,
  planZuEntwurf,
  preisFuerPlan,
  systemeFuerSperrschliessung,
  unbestaetigtePreise,
  wuenscheAusLink,
} from '@/lib/konfigurator';
import { priceCylinderOrder } from '@/lib/pricing';
import type { CylinderLineItem } from '@/lib/types';

import {
  ANDERE_BAUFORM_ANFRAGE,
  ALLGEMEINE_ANFRAGE,
  abschlussAktion,
  abschlussKnopf,
  anfrageZiel,
  ausLink,
  istStartzustand,
  masseRueckfragen,
  planZuPositionen,
  positionenZuPlan,
  zuEntwurf,
  zusammenfassungBereit,
  type Zusammenstellung,
} from './kern';

const KATALOG = defaults.cylinderCatalog();
const FORM = KATALOG.forms.find((f) => f.active && f.measures === 'beide')!;
const FUNKTION = KATALOG.functions.find((fn) => fn.active && fn.forms.includes(FORM.id))!.id;

/* Erfundene Testdaten (G4): zwei Haustüren gleich, ein Keller anders. */
const POSITIONEN: CylinderLineItem[] = [
  { uid: 'position-1', form: FORM.id, measureAMm: 30, measureBMm: 35, functionId: FUNKTION, qty: 2 },
  { uid: 'position-2', form: FORM.id, measureAMm: 30, measureBMm: 30, functionId: FUNKTION, qty: 1 },
];

const START: Zusammenstellung = { items: [{ ...POSITIONEN[1], uid: 'position-1' }], keyCount: 3, extraIds: [], expandable: null, manufacturerId: '', components: [], herstellerAngabe: '' };

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

describe('Konfigurator gegen Abschnitt 15 (FA-SHOP-04B)', () => {
  const SYSTEME = systemeFuerSperrschliessung(defaults.hersteller());
  const BKS = SYSTEME.find((s) => s.name === 'BKS')!;
  /* Drei verschiedene Maße in einem gleichschließenden Satz, mit Sicherungskarte, Ziehschutz und Erweiterung. */
  const DREI: Zusammenstellung = {
    ...START,
    items: [
      { uid: 'position-1', form: 'doppelzylinder', measureAMm: 30, measureBMm: 35, qty: 2 },
      { uid: 'position-2', form: 'doppelzylinder', measureAMm: 40, measureBMm: 45, qty: 1 },
      { uid: 'position-3', form: 'halbzylinder', measureAMm: 40, qty: 1 },
    ],
    keyCount: 5,
    extraIds: ['sicherungskarte', 'ziehschutz'],
    expandable: true,
    herstellerAngabe: BKS.id,
  };

  it('nimmt das gewählte System als Angabe in den Entwurf, „keine Vorgabe“ nicht', () => {
    const entwurf = zuEntwurf(DREI, KATALOG, SYSTEME);
    expect(entwurf.herstellerAngabe).toBe('BKS');
    expect(entwurf.manufacturerId).toBeUndefined();
    expect(entwurf.extraIds).toEqual(['sicherungskarte', 'ziehschutz', 'gleichschliessung-erweiterbar']);
    expect(entwurf.items.map((i) => [i.measureAMm, i.measureBMm])).toEqual([[30, 35], [40, 45], [40, undefined]]);
    expect(zuEntwurf({ ...DREI, herstellerAngabe: KEINE_HERSTELLER_VORGABE }, KATALOG, SYSTEME).herstellerAngabe).toBeUndefined();
    // Bietet der Katalog Hersteller an, gilt seine Wahl; die Angabe aus dem Stamm fällt weg.
    const mitKatalog = { ...KATALOG, manufacturers: [{ id: 'h1', name: 'Testhersteller', active: true, description: '', surchargeCentsPerCylinder: 0, forms: [], components: [] }] };
    const katalogEntwurf = zuEntwurf({ ...DREI, manufacturerId: 'h1' }, mitKatalog, SYSTEME);
    expect(katalogEntwurf.manufacturerId).toBe('h1');
    expect(katalogEntwurf.herstellerAngabe).toBeUndefined();
  });

  it('der Weg in die Anfrage trägt Zylinder, Maße, Schlüssel, Optionen und Hersteller', () => {
    const ziel = anfrageZiel(DREI, 'BKS');
    expect(ziel.mitPlan).toBe(true);
    const adresse = new URL(ziel.href, 'https://beispiel.test');
    expect(adresse.pathname).toBe('/schliessanlagen/konfigurator/schliessplan');
    const plan = dekodiere(adresse.searchParams.get('plan'))!;
    expect(plan.system).toBe('BKS');
    expect(plan.tueren).toHaveLength(4);
    expect(plan.tueren.every((t) => t.optionen?.includes('ziehschutz'))).toBe(true);
    expect(plan.schluessel[0]).toMatchObject({ anzahl: 5, reserve: 1 });
    expect(wuenscheAusLink(adresse.searchParams.get('wuensche'), KATALOG)).toEqual(['sicherungskarte']);
    // Ohne Hersteller kein System im Plan.
    expect(dekodiere(new URL(anfrageZiel(DREI).href, 'https://beispiel.test').searchParams.get('plan'))!.system).toBeUndefined();
  });

  it('bei unbestätigtem Preis gibt es keinen Bestellknopf, sondern den Weg in die Anfrage', () => {
    const katalog = { ...KATALOG, extras: KATALOG.extras.map((e) => (e.id === 'sicherungskarte' ? { ...e, priceUnconfirmed: true } : e)) };
    const offen = unbestaetigtePreise(zuEntwurf(DREI, katalog, SYSTEME), katalog).length > 0;
    expect(offen).toBe(true);
    expect(abschlussKnopf(offen)).toEqual({ label: 'Zusammenstellung als Anfrage schicken', ziel: 'anfrage' });
    expect(abschlussKnopf(false)).toEqual({ label: 'In den Warenkorb', ziel: 'warenkorb' });
  });

  it('der Knopf führt bei offenem Preis in den Planer statt in den Warenkorb; die Zusammenfassung sperrt nicht', () => {
    const katalog = { ...KATALOG, extras: KATALOG.extras.map((e) => (e.id === 'sicherungskarte' ? { ...e, priceUnconfirmed: true } : e)) };
    const offen = unbestaetigtePreise(zuEntwurf(DREI, katalog, SYSTEME), katalog).length > 0;
    const ziel = anfrageZiel(DREI, 'BKS');
    // Vollständige Angaben: Die Schrittprüfung der Zusammenfassung lässt den Knopf trotz offenem Preis frei.
    expect(zusammenfassungBereit({ herstellerOk: true, cylindersOk: true, keysOk: true, erweiterungOk: true })).toBe(true);
    expect(zusammenfassungBereit({ herstellerOk: true, cylindersOk: true, keysOk: true, erweiterungOk: false })).toBe(false);
    const aktion = abschlussAktion(offen, ziel.href);
    expect(aktion).toEqual({ art: 'anfrage', href: ziel.href });
    expect(new URL(ziel.href, 'https://beispiel.test').pathname).toBe('/schliessanlagen/konfigurator/schliessplan');
    expect(abschlussAktion(false, ziel.href)).toEqual({ art: 'warenkorb' });
  });

  it('der Knopf in handleSubmit entscheidet über abschlussAktion, bevor etwas in den Warenkorb geht', () => {
    // Ohne DOM-Testumgebung (keine neue Bibliothek, G7) sichert dieser Blick in den Quelltext den Zweig.
    const quelle = readFileSync(fileURLToPath(new URL('./konfigurator.tsx', import.meta.url)), 'utf8');
    const absenden = quelle.slice(quelle.indexOf('function handleSubmit'));
    const weiche = absenden.indexOf("if (aktion.art === 'anfrage')");
    expect(absenden.indexOf('abschlussAktion(preisOffen, anfrage.href)')).toBeGreaterThan(-1);
    expect(weiche).toBeGreaterThan(-1);
    expect(weiche).toBeLessThan(absenden.indexOf('addCylinderOrder('));
    expect(quelle).toContain('return zusammenfassungBereit({ herstellerOk, cylindersOk, keysOk, erweiterungOk });');
  });

  it('passt die Zusammenstellung nicht in einen Link, führt die Anfrage in denselben Fachbereich', () => {
    expect(new URL(ALLGEMEINE_ANFRAGE, 'https://beispiel.test').searchParams.get('thema')).toBe('gleichschliessende-zylinder');
  });

  it('eine fehlende Bauform führt in eine Anfrage mit vorbelegtem Thema', () => {
    const adresse = new URL(ANDERE_BAUFORM_ANFRAGE, 'https://beispiel.test');
    expect(adresse.pathname).toBe('/service-und-termin/anfrage');
    expect(adresse.searchParams.get('thema')).toBe('gleichschliessende-zylinder');
    expect(adresse.searchParams.get('artikel')).toBe('Andere Zylinder-Bauform');
  });
});
