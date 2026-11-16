import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { herstellerZuPayload, herstellerZuSeite } from '@/lib/data/payload-mapping';
import { priceCylinderOrder } from '@/lib/pricing';
import type { CylinderCatalog, CylinderManufacturer, ShopHersteller } from '@/lib/types';

import { herstellerAngabeProblem, herstellerModus, systemeFuerSperrschliessung } from './hersteller-angabe';
import { planZuEntwurf, preisFuerPlan, wuenscheAusLink } from './preis';
import { schluesselHinzufuegen, leererPlan, tuerHinzufuegen, type Schliessplan } from './schliessplan';
import { planerZusammenfassung, schnappschuss } from './vorgang';

/* Erfundene Testdaten (G4). */
const KATALOG = defaults.cylinderCatalog();
const STAMM = defaults.hersteller();
const SYSTEME = systemeFuerSperrschliessung(STAMM);

/** Katalog mit einem angebotenen Hersteller (Preisregel des Bestands), Aufpreis frei erfunden. */
const MIT_HERSTELLER: CylinderCatalog = {
  ...KATALOG,
  manufacturers: [
    { id: 'test-h', name: 'Testhersteller', active: true, description: '', surchargeCentsPerCylinder: 111, forms: [], components: [] } satisfies CylinderManufacturer,
  ],
};

/** Gespeicherter Hersteller mit Logo-Datei und Freigabe nach Wahl (wie in hersteller-bereich.test.tsx). */
function mitLogo(h: ShopHersteller, freigabe: boolean): ShopHersteller {
  const doc = {
    ...herstellerZuPayload(h),
    id: 1,
    logo: { bild: { id: 7, url: '/api/medien/file/logo-test.png', alt: `Logo ${h.name}`, width: 400, height: 120 }, freigabe },
    updatedAt: '2026-11-16T00:00:00.000Z',
    createdAt: '2026-11-16T00:00:00.000Z',
  };
  return herstellerZuSeite(doc as never);
}

/** Sperrschließung mit drei verschiedenen Maßen, ein Schlüssel für alle Türen. */
function sperrPlan(system?: string): Schliessplan {
  let plan = leererPlan(system);
  plan = tuerHinzufuegen(plan, { bezeichnung: 'Haustür', form: 'doppelzylinder', a: 30, b: 35 });
  plan = tuerHinzufuegen(plan, { bezeichnung: 'Keller', form: 'doppelzylinder', a: 40, b: 45 });
  plan = tuerHinzufuegen(plan, { bezeichnung: 'Garage', form: 'halbzylinder', a: 40 });
  return schluesselHinzufuegen(plan, { bezeichnung: 'Familie', anzahl: 3 }, true);
}

describe('Herstellerwahl im Konfigurator (FA-SHOP-04B, FA-15-01, FA-15-02)', () => {
  it('zeigt BKS und ABUS aus dem Stamm als Systeme für Sperrschließungen, ohne BURG-WÄCHTER', () => {
    expect(SYSTEME.map((s) => s.name)).toEqual(['BKS', 'ABUS']);
    expect(SYSTEME.every((s) => s.logo === undefined)).toBe(true);
  });

  it('nicht angebotene Hersteller erscheinen nicht', () => {
    const liste = STAMM.map((h) => (h.name === 'ABUS' ? { ...h, angeboten: false } : h));
    expect(systemeFuerSperrschliessung(liste).map((s) => s.name)).toEqual(['BKS']);
  });

  it('Logo nur mit Freigabe im Stamm (R12)', () => {
    expect(systemeFuerSperrschliessung(STAMM.map((h) => mitLogo(h, false))).every((s) => !s.logo)).toBe(true);
    const frei = systemeFuerSperrschliessung(STAMM.map((h) => mitLogo(h, true)));
    expect(frei[0].logo?.url).toBe('/api/medien/file/logo-test.png');
  });

  it('Katalog mit Hersteller: Preisregel des Bestands; ohne: Angabe aus dem Stamm; ohne beides: kein Schritt', () => {
    expect(herstellerModus(MIT_HERSTELLER, SYSTEME)).toBe('katalog');
    expect(herstellerModus(KATALOG, SYSTEME)).toBe('angabe');
    expect(herstellerModus(KATALOG, [])).toBe('keine');
  });

  it('die Kasse nimmt nur ein System aus dem Stamm und nur ohne Katalog-Hersteller', () => {
    expect(herstellerAngabeProblem({}, KATALOG, SYSTEME)).toBeNull();
    expect(herstellerAngabeProblem({ herstellerAngabe: 'BKS' }, KATALOG, SYSTEME)).toBeNull();
    expect(herstellerAngabeProblem({ herstellerAngabe: 'Erfunden' }, KATALOG, SYSTEME)).toContain('im Konfigurator neu');
    expect(herstellerAngabeProblem({ herstellerAngabe: 'BURG-WÄCHTER' }, KATALOG, SYSTEME)).not.toBeNull();
    expect(herstellerAngabeProblem({ herstellerAngabe: 'BKS' }, MIT_HERSTELLER, SYSTEME)).not.toBeNull();
  });

  it('die Angabe ändert den Preis nicht (kein zweiter Preispfad)', () => {
    const entwurf = planZuEntwurf(sperrPlan());
    expect(priceCylinderOrder({ ...entwurf, herstellerAngabe: 'BKS' }, KATALOG)).toEqual(priceCylinderOrder(entwurf, KATALOG));
  });
});

describe('Schließplan-Planer übernimmt Optionen und Hersteller aus dem Konfigurator (FA-SHOP-04B, Punkt 9)', () => {
  it('liest nur angebotene Wünsche, ohne Schutz, Vormerkung und Doppel', () => {
    expect(wuenscheAusLink('sicherungskarte,ziehschutz,gleichschliessung-erweiterbar,erfunden,sicherungskarte', KATALOG)).toEqual(['sicherungskarte']);
    expect(wuenscheAusLink(null, KATALOG)).toEqual([]);
    const aus = { ...KATALOG, extras: KATALOG.extras.map((e) => (e.id === 'sicherungskarte' ? { ...e, active: false } : e)) };
    expect(wuenscheAusLink('sicherungskarte', aus)).toEqual([]);
  });

  it('rechnet mit der Sicherungskarte aus dem Link und trägt den Hersteller als Angabe in den Entwurf', () => {
    const preis = preisFuerPlan(sperrPlan('BKS'), KATALOG, ['sicherungskarte']);
    expect(preis.art).toBe('preis');
    if (preis.art !== 'preis') return;
    expect(preis.entwurf.herstellerAngabe).toBe('BKS');
    expect(preis.entwurf.extraIds).toContain('sicherungskarte');
    expect(preis.entwurf.items).toHaveLength(3);
  });

  it('ein nicht mehr angebotener Hersteller aus einem alten Planer-Link: die Kasse nennt einen Ausweg für beide Wege', () => {
    // Erfundener Name (G4): ein gespeicherter Link mit einem System, das der Stamm nicht mehr anbietet.
    const preis = preisFuerPlan(sperrPlan('Alt-System'), KATALOG);
    expect(preis.art).toBe('preis');
    if (preis.art !== 'preis') return;
    const meldung = herstellerAngabeProblem(preis.entwurf, KATALOG, SYSTEME);
    expect(meldung).toContain('Bitte entfernen Sie die Position');
    expect(meldung).toContain('oder schicken Sie uns eine Anfrage');
    expect(meldung).not.toContain('wählen Sie ihn');
  });

  it('eine unbestätigte Option aus dem Link führt im Planer in das Angebot, nicht in einen Preis ohne sie', () => {
    const katalog = { ...KATALOG, extras: KATALOG.extras.map((e) => (e.id === 'sicherungskarte' ? { ...e, priceUnconfirmed: true } : e)) };
    const preis = preisFuerPlan(sperrPlan('BKS'), katalog, wuenscheAusLink('sicherungskarte', katalog));
    expect(preis.art).toBe('angebot');
    if (preis.art === 'angebot') expect(preis.grund).toContain('Sicherungskarte');
  });

  it('mit Katalog-Hersteller nennt das Angebot den gewählten Hersteller', () => {
    const preis = preisFuerPlan(sperrPlan('Testhersteller'), MIT_HERSTELLER);
    expect(preis).toEqual({ art: 'angebot', grund: expect.stringContaining('Testhersteller') });
  });

  it('Hersteller und Wünsche stehen in der Zusammenfassung des Vorgangs', () => {
    const bild = schnappschuss(sperrPlan('ABUS'), KATALOG, { extraIds: ['sicherungskarte'], jetzt: new Date('2026-11-16T10:00:00Z') });
    const zusammenfassung = planerZusammenfassung(bild);
    expect(zusammenfassung.find((a) => a.title === 'Hersteller')?.rows).toEqual([{ label: 'Hersteller (Ihre Wahl)', value: 'ABUS' }]);
    expect(zusammenfassung.find((a) => a.title === 'Zusatzwünsche')?.rows.map((r) => r.label)).toEqual(['Sicherungskarte und geschütztes System']);
    expect(planerZusammenfassung(schnappschuss(sperrPlan(), KATALOG)).some((a) => a.title === 'Hersteller')).toBe(false);
  });
});
