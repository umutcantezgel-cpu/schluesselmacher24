import { describe, expect, it } from 'vitest';

import servicesJson from '../../content/car-key-services.json';
import rulesJson from '../../content/service-pricing.json';
import settingsJson from '../../content/settings.json';
import vehiclesJson from '../../content/vehicles.json';
import type { CarKeyService, PricingRule, Settings, VehicleMake } from '@/lib/types';
import { quoteCarKeyService } from '@/lib/pricing';

import {
  BESCHREIBUNG_MAX,
  TITEL_MAX,
  leistungsPreise,
  markenTexte,
  modellIndexierbar,
  modellTexte,
  preisAngabe,
} from './fahrzeug-texte';

const MARKEN = vehiclesJson as VehicleMake[];
const SERVICES = servicesJson as CarKeyService[];
const RULES = rulesJson as PricingRule[];
const BOOKING = (settingsJson as unknown as Settings).booking;
const kontext = { services: SERVICES, rules: RULES, booking: BOOKING };
const WERKSTATT = { street: 'Langgasse 70', postalCode: '35576', city: 'Wetzlar' };

const marke = (slug: string) => MARKEN.find((m) => m.slug === slug)!;
const modell = (makeSlug: string, modelSlug: string) => marke(makeSlug).models.find((m) => m.slug === modelSlug)!;

describe('leistungsPreise', () => {
  it('nutzt für jede Leistung und Schlüsselart genau das Ergebnis des Assistenten', () => {
    const make = marke('volkswagen');
    const model = modell('volkswagen', 'passat');
    const preise = leistungsPreise(make, model, kontext);
    expect(preise.length).toBeGreaterThan(0);
    for (const eintrag of preise) {
      for (const zeile of eintrag.mitSchluessel) {
        for (const art of zeile.arten) {
          // Derselbe Aufruf wie in fetchQuote (src/lib/actions/booking.ts) mit „ein funktionierender Schlüssel“.
          const erwartet = quoteCarKeyService(
            { make, model, service: eintrag.service, keyKind: art, workingKeys: 1 },
            RULES,
            BOOKING,
          );
          expect(zeile.quote, `${eintrag.service.id}/${art}`).toEqual(erwartet);
        }
      }
    }
  });

  it('bietet nur Leistungen an, die zu den Schlüsselarten des Modells passen', () => {
    const preise = leistungsPreise(marke('renault'), modell('renault', 'kangoo'), kontext);
    for (const eintrag of preise) {
      expect(eintrag.service.keyKinds.some((art) => ['mechanisch', 'funk'].includes(art))).toBe(true);
      expect(eintrag.mitSchluessel.flatMap((z) => z.arten).every((art) => ['mechanisch', 'funk'].includes(art))).toBe(true);
    }
  });

  it('richtet sich nach der Preisgruppe des Modells (Passat ≠ Golf)', () => {
    const golf = leistungsPreise(marke('volkswagen'), modell('volkswagen', 'golf'), kontext);
    const passat = leistungsPreise(marke('volkswagen'), modell('volkswagen', 'passat'), kontext);
    const zweit = (p: typeof golf) => preisAngabe(p.find((e) => e.service.id === 'zweitschluessel')!.mitSchluessel[0].quote);
    expect(zweit(golf)).not.toBe(zweit(passat));
  });

  it('nennt den Preis ohne funktionierenden Schlüssel nur, wenn er abweicht', () => {
    const preise = leistungsPreise(marke('volkswagen'), modell('volkswagen', 'golf'), kontext);
    const zweit = preise.find((e) => e.service.id === 'zweitschluessel')!;
    // Fester Preis mit Schlüssel, ohne Schlüssel nur ein Rahmen (quoteCarKeyService).
    expect(zweit.mitSchluessel[0].quote.mode).toBe('fest');
    expect(zweit.ohneSchluessel[0]?.quote.mode).toBe('rahmen');
  });
});

describe('modellTexte', () => {
  it('setzt für zwei Modelle unterschiedliche Texte aus den Fahrzeugdaten zusammen', () => {
    const golf = modellTexte(marke('volkswagen'), modell('volkswagen', 'golf'), leistungsPreise(marke('volkswagen'), modell('volkswagen', 'golf'), kontext), WERKSTATT);
    const a3 = modellTexte(marke('audi'), modell('audi', 'a3'), leistungsPreise(marke('audi'), modell('audi', 'a3'), kontext), WERKSTATT);
    expect(golf.metaTitel).not.toBe(a3.metaTitel);
    expect(golf.metaBeschreibung).not.toBe(a3.metaBeschreibung);
    expect(golf.einleitung).toContain('ab 2003');
    expect(golf.metaTitel.length).toBeLessThanOrEqual(TITEL_MAX);
    expect(golf.metaBeschreibung.length).toBeLessThanOrEqual(BESCHREIBUNG_MAX);
    expect(golf.faq.some((f) => f.answer.includes('Wetzlar'))).toBe(true);
    expect(golf.mitbringen.map((p) => p.titel)).toContain('Fahrzeugschein und Ausweisdokument');
  });

  it('hält Titel und Beschreibung aller Modelle kurz und eindeutig', () => {
    const alle = MARKEN.flatMap((make) =>
      make.models.map((model) => modellTexte(make, model, leistungsPreise(make, model, kontext), WERKSTATT)),
    );
    expect(alle).toHaveLength(49);
    for (const t of alle) {
      expect(t.metaTitel.length, t.metaTitel).toBeLessThanOrEqual(TITEL_MAX);
      expect(t.metaBeschreibung.length, t.metaBeschreibung).toBeLessThanOrEqual(BESCHREIBUNG_MAX);
    }
    expect(new Set(alle.map((t) => t.metaTitel)).size).toBe(49);
    expect(new Set(alle.map((t) => t.metaBeschreibung)).size).toBe(49);
  });

  it('weist bei Prüfung auf „verbindlich nach Prüfung der Unterlagen“ hin', () => {
    const make = marke('mercedes-benz');
    const model = make.models[0];
    const t = modellTexte(make, model, leistungsPreise(make, model, kontext), WERKSTATT);
    expect(t.faq.find((f) => f.question.startsWith('Warum'))?.answer).toContain('verbindlich nach Prüfung der Unterlagen');
  });

  it('lässt Einleitung, Titel und Beschreibung aus dem Backend gewinnen und beachtet noindex', () => {
    const make = marke('volkswagen');
    const model = {
      ...modell('volkswagen', 'golf'),
      intro: 'Eigene Einleitung zum Golf.',
      seo: { title: 'Golf-Schlüssel in Wetzlar', description: 'Eigene Beschreibung.', noindex: true },
    };
    const t = modellTexte(make, model, leistungsPreise(make, model, kontext), WERKSTATT);
    expect(t.einleitung).toBe('Eigene Einleitung zum Golf.');
    expect(t.metaTitel).toBe('Golf-Schlüssel in Wetzlar');
    expect(t.metaBeschreibung).toBe('Eigene Beschreibung.');
    expect(t.noindex).toBe(true);
    expect(modellIndexierbar(model)).toBe(false);
    expect(modellIndexierbar(modell('volkswagen', 'golf'))).toBe(true);
  });
});

describe('markenTexte', () => {
  it('nennt die Modelle der Marke und lässt Backend-Angaben gewinnen', () => {
    const vw = markenTexte(marke('volkswagen'));
    expect(vw.metaBeschreibung).toContain('Golf');
    expect(vw.metaTitel.length).toBeLessThanOrEqual(TITEL_MAX);
    expect(markenTexte(marke('bmw')).metaBeschreibung).not.toBe(vw.metaBeschreibung);
    const eigen = markenTexte({ ...marke('volkswagen'), seo: { title: 'VW-Schlüssel', description: '', internalLinks: [], noindex: true } });
    expect(eigen.metaTitel).toBe('VW-Schlüssel');
    expect(eigen.metaBeschreibung).toBe(vw.metaBeschreibung);
    expect(eigen.noindex).toBe(true);
  });
});
