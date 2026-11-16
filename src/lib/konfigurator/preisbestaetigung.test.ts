import { describe, expect, it } from 'vitest';

import { validateCylinderDraft } from '@/lib/cylinder-rules';
import { defaults } from '@/lib/data/defaults';
import { priceCylinderOrder } from '@/lib/pricing';
import type { CylinderCatalog, CylinderOrderDraft } from '@/lib/types';

import { preisFuerPlan } from './preis';
import { ohneSperreWeg, PREIS_SPERRE_WEG, preisSperre, preisSperreText, unbestaetigteInPosition, unbestaetigtePreise } from './preisbestaetigung';
import type { Schliessplan } from './schliessplan';

/* Sperre für unbestätigte Preise (FA-SHOP-04). Der Bestand trägt keinen Haken; gesetzt wird er hier nur
 * im Test. Kein Preis wird geändert (G9). */

const katalog = (): CylinderCatalog => defaults.cylinderCatalog();

/** Gleichschließender Satz mit drei verschiedenen Maßen, Not- und Gefahrenfunktion und Sicherungskarte. */
const satz = (): CylinderOrderDraft => ({
  items: [
    { uid: 'a', form: 'doppelzylinder', measureAMm: 30, measureBMm: 30, qty: 2 },
    { uid: 'b', form: 'doppelzylinder', measureAMm: 35, measureBMm: 45, functionId: 'not-gefahr', qty: 1 },
    { uid: 'c', form: 'halbzylinder', measureAMm: 40, qty: 1 },
  ],
  keyCount: 5,
  extraIds: ['sicherungskarte'],
  expandable: false,
});

function mitHaken(k: CylinderCatalog, haken: { form?: string; funktion?: string; extra?: string; schluessel?: boolean }): CylinderCatalog {
  return {
    ...k,
    keyPriceUnconfirmed: haken.schluessel ?? k.keyPriceUnconfirmed,
    forms: k.forms.map((f) => (f.id === haken.form ? { ...f, priceUnconfirmed: true } : f)),
    functions: k.functions.map((f) => (f.id === haken.funktion ? { ...f, priceUnconfirmed: true } : f)),
    extras: k.extras.map((e) => (e.id === haken.extra ? { ...e, priceUnconfirmed: true } : e)),
  };
}

describe('Preis nicht bestätigt (FA-SHOP-04)', () => {
  it('der Bestand trägt keinen Haken: alles bleibt bestellbar wie bisher', () => {
    const k = katalog();
    expect(k.keyPriceUnconfirmed).toBeUndefined();
    expect([...k.forms, ...k.functions, ...k.extras].some((e) => e.priceUnconfirmed)).toBe(false);
    expect(unbestaetigtePreise(satz(), k)).toEqual([]);
    expect(validateCylinderDraft(satz(), k)).toBeNull();
  });

  it('findet Bauform, Funktion, Option und Schlüsselpreis, ohne Doppelte', () => {
    const k = mitHaken(katalog(), { form: 'doppelzylinder', funktion: 'not-gefahr', extra: 'sicherungskarte', schluessel: true });
    expect(unbestaetigtePreise(satz(), k).map((t) => [t.art, t.kennung])).toEqual([
      ['bauform', 'doppelzylinder'],
      ['funktion', 'not-gefahr'],
      ['schluessel', 'schluessel'],
      ['option', 'sicherungskarte'],
    ]);
    expect(preisSperre(satz(), k)).toBe(
      `Die Preise für „Doppelzylinder“, „Not- und Gefahrenfunktion“, „zusätzliche Schlüssel“ und „Sicherungskarte und geschütztes System“ sind noch nicht bestätigt. ${PREIS_SPERRE_WEG}`,
    );
  });

  it('sperrt nur, was die Zusammenstellung nutzt', () => {
    expect(unbestaetigtePreise(satz(), mitHaken(katalog(), { form: 'knaufzylinder' }))).toEqual([]);
    expect(unbestaetigtePreise(satz(), mitHaken(katalog(), { extra: 'ziehschutz' }))).toEqual([]);
    // Schlüsselpreis nur, wenn mehr Schlüssel als inklusive gewählt sind.
    const k = mitHaken(katalog(), { schluessel: true });
    expect(unbestaetigtePreise({ ...satz(), keyCount: k.includedKeys }, k)).toEqual([]);
    expect(unbestaetigtePreise({ ...satz(), keyCount: k.includedKeys + 1 }, k)).toHaveLength(1);
  });

  it('„Erweiterbar reservieren“ zählt über die Antwort zur Erweiterung, wie in der Kasse', () => {
    const k = mitHaken(katalog(), { extra: 'gleichschliessung-erweiterbar' });
    expect(validateCylinderDraft({ ...satz(), expandable: true }, k)).toBe(`Der Preis für „Erweiterbar reservieren“ ist noch nicht bestätigt. ${PREIS_SPERRE_WEG}`);
    expect(validateCylinderDraft({ ...satz(), expandable: false }, k)).toBeNull();
  });

  it('ein Hersteller mit Haken sperrt seine Zusammenstellungen', () => {
    const k: CylinderCatalog = {
      ...katalog(),
      manufacturers: [
        { id: 'test-a', name: 'Testhersteller A', active: true, description: '', surchargeCentsPerCylinder: 0, forms: [], components: [], priceUnconfirmed: true },
        { id: 'test-b', name: 'Testhersteller B', active: true, description: '', surchargeCentsPerCylinder: 0, forms: [], components: [] },
      ],
    };
    expect(validateCylinderDraft({ ...satz(), manufacturerId: 'test-a' }, k)).toBe(`Der Preis für „Testhersteller A“ ist noch nicht bestätigt. ${PREIS_SPERRE_WEG}`);
    expect(validateCylinderDraft({ ...satz(), manufacturerId: 'test-b' }, k)).toBeNull();
  });

  it('die Kassenprüfung lehnt ab; der Preis selbst bleibt unverändert (G9)', () => {
    const k = mitHaken(katalog(), { form: 'halbzylinder' });
    expect(validateCylinderDraft(satz(), k)).toBe(`Der Preis für „Halbzylinder“ ist noch nicht bestätigt. ${PREIS_SPERRE_WEG}`);
    expect(priceCylinderOrder(satz(), k)).toEqual(priceCylinderOrder(satz(), katalog()));
  });

  it('eine Position kennt ihre unbestätigten Einträge', () => {
    const k = mitHaken(katalog(), { funktion: 'not-gefahr' });
    const [a, b] = satz().items;
    expect(unbestaetigteInPosition(a, k)).toEqual([]);
    expect(unbestaetigteInPosition(b, k)).toEqual([{ art: 'funktion', kennung: 'not-gefahr', label: 'Not- und Gefahrenfunktion' }]);
  });

  it('der Schließplan-Planer macht daraus ein Angebot statt eines Preises', () => {
    const plan: Schliessplan = {
      version: 1,
      tueren: [
        { id: 't1', bezeichnung: 'Haustür', form: 'doppelzylinder', a: 30, b: 35 },
        { id: 't2', bezeichnung: 'Keller', form: 'halbzylinder', a: 30 },
      ],
      schluessel: [{ id: 's1', bezeichnung: 'Schlüssel', anzahl: 3 }],
      berechtigungen: { s1: ['t1', 't2'] },
    };
    expect(preisFuerPlan(plan, katalog()).art).toBe('preis');
    const ergebnis = preisFuerPlan(plan, mitHaken(katalog(), { form: 'halbzylinder' }));
    expect(ergebnis).toEqual({
      art: 'angebot',
      grund: 'Der Preis für „Halbzylinder“ ist noch nicht bestätigt. Diese Schließung planen wir mit Ihnen und schicken Ihnen ein Angebot.',
    });
  });

  it('Texte ohne Gedankenstriche', () => {
    expect(preisSperreText([])).toBeNull();
    expect(preisSperreText([{ art: 'bauform', kennung: 'x', label: 'X' }])).not.toMatch(/[–—]/);
    expect(PREIS_SPERRE_WEG).not.toMatch(/[–—]/);
  });

  it('Kasse und Warenkorb bekommen einen Weg in die Anfrage, der Planer nicht doppelt', () => {
    const k = mitHaken(katalog(), { form: 'halbzylinder' });
    const meldung = validateCylinderDraft(satz(), k)!;
    expect(meldung).toContain('Konfigurator');
    expect(meldung).toContain('als Anfrage');
    expect(ohneSperreWeg(meldung)).toBe('Der Preis für „Halbzylinder“ ist noch nicht bestätigt.');
    // Andere Meldungen bleiben unverändert.
    expect(ohneSperreWeg('Höchstens 30 Zylinder je Schließung.')).toBe('Höchstens 30 Zylinder je Schließung.');
  });
});
