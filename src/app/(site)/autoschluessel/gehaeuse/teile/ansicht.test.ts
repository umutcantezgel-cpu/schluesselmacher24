import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { filterAuswahl, type Fahrzeugartikel, type FahrzeugteilFilter } from '@/lib/data/fahrzeugteile';
import type { FahrzeugReihe, FahrzeugTeil, GehaeuseBauform } from '@/lib/types';

import {
  MODELL_VORHER,
  filterFormular,
  filterZeilen,
  ohneMerkmal,
  passungEtikett,
  teileAdresse,
  teileFilter,
  teileGruppieren,
  teilKarte,
} from './ansicht';

/* Erfundene Testdaten (G4): Marken, Reihen und Preise stehen nur für die Logik. */

const KATALOG: Array<Pick<FahrzeugReihe, 'id' | 'marke' | 'reihe'>> = [
  { id: 'testmarke-alpha', marke: 'Testmarke', reihe: 'Alpha' },
  { id: 'testmarke-beta', marke: 'Testmarke', reihe: 'Beta' },
  { id: 'andere-gamma', marke: 'Anderemarke', reihe: 'Gamma' },
];
const BAUFORMEN: GehaeuseBauform[] = [{ id: 'klappschluessel', name: 'Klappschlüssel', reihenfolge: 10 } as GehaeuseBauform];
const QUELLEN = { bauformen: BAUFORMEN, katalog: KATALOG };

function teil(extra: Partial<FahrzeugTeil> = {}): FahrzeugTeil {
  return {
    teileart: 'gehaeuse',
    bauformen: ['klappschluessel'],
    reihen: [],
    schluesselarten: ['klappschluessel'],
    kompatibilitaet: 'Elektronik und Bart werden übernommen.',
    elektronik: 'pruefung',
    ...extra,
  };
}

function artikel(id: string, fahrzeugteil: FahrzeugTeil, extra: Partial<Fahrzeugartikel> = {}): Fahrzeugartikel {
  return {
    id,
    slug: id,
    name: id,
    description: '',
    manufacturer: '',
    scope: '',
    properties: [],
    deliveryTime: '',
    priceCents: 1990,
    maxQty: 5,
    shippingClass: 'zubehoer',
    image: { motif: id, ratio: '1/1' },
    gallery: [],
    tags: [],
    seo: { title: id, description: '', internalLinks: [] },
    example: false,
    fahrzeugteil,
    ...extra,
  };
}

const alphaGehaeuse = artikel('alpha-gehaeuse', teil({ marke: 'Testmarke', reihen: ['testmarke-alpha'], tastenzahl: 3 }));
const markenGehaeuse = artikel('marken-gehaeuse', teil({ marke: 'Testmarke', tastenzahl: 2 }));
const batterie = artikel('batterie', teil({ teileart: 'batterie', bauformen: [], schluesselarten: [], elektronik: 'ja' }));
const fremdGehaeuse = artikel('fremd-gehaeuse', teil({ marke: 'Anderemarke', tastenzahl: 3 }));
const ALLE = [batterie, markenGehaeuse, fremdGehaeuse, alphaGehaeuse];

describe('Filter aus der Adresse (FA-SHOP-02B)', () => {
  it('eine Reihe aus dem Katalog bringt ihre Marke mit', () => {
    expect(teileFilter({ reihe: 'testmarke-alpha' }, KATALOG)).toEqual({ marke: 'Testmarke', reihe: 'testmarke-alpha' });
  });

  it('eine andere Marke als die der Reihe gilt, die Reihe entfällt', () => {
    expect(teileFilter({ marke: 'Anderemarke', reihe: 'testmarke-alpha' }, KATALOG)).toEqual({ marke: 'Anderemarke' });
  });

  it('eine unbekannte Reihe entfällt still', () => {
    expect(teileFilter({ marke: 'Testmarke', reihe: 'gibt-es-nicht' }, KATALOG)).toEqual({ marke: 'Testmarke' });
  });

  it('Adresse und Entfernen eines Merkmals: ohne Marke entfällt auch die Reihe', () => {
    const filter = { marke: 'Testmarke', reihe: 'testmarke-alpha', tastenzahl: 3 };
    expect(teileAdresse(filter)).toBe('/autoschluessel/gehaeuse/teile?marke=Testmarke&reihe=testmarke-alpha&tasten=3#teile-liste');
    expect(ohneMerkmal(filter, 'marke')).toEqual({ tastenzahl: 3 });
    expect(teileAdresse({})).toBe('/autoschluessel/gehaeuse/teile');
    expect(filterZeilen(filter, QUELLEN).map((z) => z.text)).toEqual(['Fahrzeug: Testmarke Alpha', 'Tasten: 3']);
  });
});

describe('„Alle Marken“ im Formular (Gegenprüfung FA-SHOP-02B, Befund 6)', () => {
  it('Marke leer übergeben und Modell unverändert: Die Fahrzeugwahl entfällt ganz', () => {
    expect(teileFilter({ marke: '', reihe: 'testmarke-alpha', [MODELL_VORHER]: 'testmarke-alpha', tasten: '3' }, KATALOG)).toEqual({ tastenzahl: 3 });
    // Ohne Formular (Adresse von Hand): leere Marke hebt die Reihe ebenfalls auf.
    expect(teileFilter({ marke: '', reihe: 'testmarke-alpha' }, KATALOG)).toEqual({});
  });

  it('neues Modell bei „Alle Marken“: Die Marke folgt dem Modell', () => {
    expect(teileFilter({ marke: '', reihe: 'testmarke-beta', [MODELL_VORHER]: 'testmarke-alpha' }, KATALOG)).toEqual({
      marke: 'Testmarke',
      reihe: 'testmarke-beta',
    });
    expect(teileFilter({ marke: '', reihe: 'testmarke-alpha', [MODELL_VORHER]: '' }, KATALOG)).toEqual({ marke: 'Testmarke', reihe: 'testmarke-alpha' });
  });

  it('ohne Parameter marke bringt die Reihe ihre Marke weiter mit', () => {
    expect(teileFilter({ reihe: 'testmarke-alpha', [MODELL_VORHER]: 'testmarke-alpha' }, KATALOG)).toEqual({ marke: 'Testmarke', reihe: 'testmarke-alpha' });
  });
});

describe('Filterformular: gesetzte Werte überstehen das erneute Absenden (Gegenprüfung FA-SHOP-02B, Befund 9)', () => {
  /** Was der Browser beim Absenden schickt: jeder Feldwert und die verborgenen Felder, wie im Formular vorbelegt. */
  function absenden(filter: FahrzeugteilFilter, teile: Fahrzeugartikel[]) {
    const formular = filterFormular(filter, filterAuswahl(teile), QUELLEN);
    for (const feld of formular.felder) {
      expect(feld.wert === '' || feld.optionen.some((o) => o.wert === feld.wert), feld.name).toBe(true);
    }
    const params: Record<string, string> = Object.fromEntries([
      ...formular.felder.map((f) => [f.name, f.wert]),
      ...formular.verborgen.map((v) => [v.name, v.wert]),
      ...(formular.baujahr ? [['baujahr', filter.baujahr === undefined ? '' : String(filter.baujahr)]] : []),
    ]);
    return { formular, filter: teileFilter(params, KATALOG) };
  }

  it('ein Fahrzeug ohne Teile aus „Mein Fahrzeug“ bleibt gewählt, als Option „(gewählt)“', () => {
    // Nur Teile der Anderemarke: Testmarke Beta hat keine Option in der Auswahl.
    const filter = teileFilter(Object.fromEntries(new URL(teileAdresse({ marke: 'Testmarke', reihe: 'testmarke-beta' }), 'https://x.test').searchParams), KATALOG);
    const { formular, filter: neu } = absenden(filter, [fremdGehaeuse, batterie]);
    expect(neu).toEqual({ marke: 'Testmarke', reihe: 'testmarke-beta' });
    expect(formular.felder.find((f) => f.name === 'reihe')?.optionen.at(-1)).toEqual({ wert: 'testmarke-beta', text: 'Testmarke Beta (gewählt)' });
    expect(formular.modellFeld).toBe(true);
  });

  it('eine gesetzte Teileart bleibt, auch wenn es nur eine Teileart gibt (Einstieg vom Customizing)', () => {
    const filter: FahrzeugteilFilter = { teileart: 'gehaeuse', schluesselart: 'klappschluessel' };
    expect(absenden(filter, [alphaGehaeuse, markenGehaeuse]).filter).toEqual(filter);
  });

  it('alle Merkmale zusammen überstehen das Absenden, auch ohne passende Teile', () => {
    const filter: FahrzeugteilFilter = { marke: 'Testmarke', reihe: 'testmarke-alpha', baujahr: 2010, bauform: 'klappschluessel', tastenzahl: 4, teileart: 'tasten', schluesselart: 'funk' };
    expect(absenden(filter, ALLE).filter).toEqual(filter);
    expect(absenden({}, ALLE).filter).toEqual({});
  });

  it('ohne Modelle in der Auswahl gibt es kein Feld „Modell“: Der Hinweis nennt die Marke', () => {
    const formular = filterFormular({}, filterAuswahl([markenGehaeuse]), QUELLEN);
    expect(formular.modellFeld).toBe(false);
    expect(formular.verborgen).toEqual([]);
  });
});

describe('Etikett zum Fahrzeug: keine falschen Versprechen (Gegenprüfung Teil A, Punkt 3)', () => {
  it('„passt zu Ihrem Modell“ nur bei gewähltem Modell und ausdrücklich genannter Reihe', () => {
    const modell = { marke: 'Testmarke', reihe: 'testmarke-alpha' };
    expect(teilKarte(alphaGehaeuse, modell, QUELLEN).etikett).toBe('Passt zu Ihrem Modell');
    expect(teilKarte(markenGehaeuse, modell, QUELLEN).etikett).toBe('Passt zu Ihrer Marke, bitte Modell prüfen');
  });

  it('nur Marke gewählt: auch ein Teil mit Reihen sagt nicht „Ihr Modell“', () => {
    expect(teilKarte(alphaGehaeuse, { marke: 'Testmarke' }, QUELLEN).etikett).toBe('Für einzelne Modelle dieser Marke, bitte Modell prüfen');
    expect(passungEtikett('marke', { marke: 'Testmarke' })).toBe('Passt zu Ihrer Marke, bitte Modell prüfen');
  });

  it('ohne Fahrzeug im Filter kein Etikett', () => {
    expect(passungEtikett('reihe', {})).toBeNull();
    expect(teilKarte(alphaGehaeuse, {}, QUELLEN).etikett).toBeNull();
  });
});

describe('„Mein Fahrzeug“: markenübergreifende Teile getrennt und benannt (Gegenprüfung Teil A, Punkt 2)', () => {
  it('mit Fahrzeug: passende Gehäuse vorn, Batterien eigens, fremde Marke nicht', () => {
    const gruppen = teileGruppieren(ALLE, { marke: 'Testmarke', reihe: 'testmarke-alpha' });
    expect(gruppen.passend.map((a) => a.id)).toEqual(['alpha-gehaeuse', 'marken-gehaeuse']);
    expect(gruppen.allgemein.map((a) => a.id)).toEqual(['batterie']);
    expect(teilKarte(batterie, { marke: 'Testmarke' }, QUELLEN).etikett).toBe('Passt zu jedem Fahrzeug');
  });

  it('ohne Fahrzeug: alle Teile in einer Liste, nichts getrennt', () => {
    const gruppen = teileGruppieren(ALLE, {});
    expect(gruppen.passend).toHaveLength(4);
    expect(gruppen.allgemein).toEqual([]);
  });

  it('ein Gehäuse ohne Marke (Altdaten) passt zu keinem Fahrzeug', () => {
    const ohneMarke = artikel('ohne-marke', teil({ tastenzahl: 3 }));
    const gruppen = teileGruppieren([ohneMarke], { marke: 'Testmarke' });
    expect([...gruppen.passend, ...gruppen.allgemein]).toEqual([]);
  });
});

describe('Karte eines Teils', () => {
  it('zeigt Fahrzeug, Bauform und Tasten so wie gepflegt', () => {
    const karte = teilKarte(alphaGehaeuse, {}, QUELLEN);
    expect(karte).toMatchObject({ teileart: 'Gehäuse', fahrzeug: 'Testmarke Alpha', bauformen: ['Klappschlüssel'], tasten: '3 Tasten' });
    expect(teilKarte(markenGehaeuse, {}, QUELLEN).fahrzeug).toBe('Testmarke, alle Modelle');
    expect(teilKarte(batterie, {}, QUELLEN).fahrzeug).toBe('Passt zu jedem Fahrzeug');
  });

  it('Preis nur bei bestellbaren Artikeln, sonst der ehrliche Stand (R9)', () => {
    expect(teilKarte(alphaGehaeuse, {}, QUELLEN).preis).toMatch(/19,90/);
    expect(teilKarte({ ...alphaGehaeuse, example: true }, {}, QUELLEN).preis).toBe('Beispiel, nicht bestellbar');
    expect(teilKarte({ ...alphaGehaeuse, availability: 'auf-anfrage' }, {}, QUELLEN).preis).not.toMatch(/€/);
  });
});

/* Befund der Sichtprobe (Abnahme FA-SHOP-02B): Nach einem Wechsel ohne Neuladen, etwa über einen Treffer aus
 * „Mein Fahrzeug“, blieben die Auswahlfelder auf dem alten Stand, und „Filter anwenden“ verlor das Fahrzeug.
 * Das Verhalten selbst prüft die Browserprobe; dieser Test hält nur fest, dass das Formular seinen Schlüssel
 * aus dem Filter bekommt und deshalb neu aufgebaut wird. */
describe('Filterformular nach einem Wechsel ohne Neuladen', () => {
  it('das Formular der Liste trägt den Filter als Schlüssel', () => {
    const seite = readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
    expect(seite).toMatch(/<form\s+key=\{teileAdresse\(filter\)\}/);
  });

  it('der Schlüssel ändert sich mit jedem Merkmal und ist ohne Filter die Liste selbst', () => {
    const ohne = teileAdresse({});
    const marke = teileAdresse({ marke: 'Testmarke' });
    const reihe = teileAdresse({ marke: 'Testmarke', reihe: 'testmarke-alpha' });
    expect(new Set([ohne, marke, reihe, teileAdresse({ teileart: 'gehaeuse' })]).size).toBe(4);
    expect(ohne).toBe('/autoschluessel/gehaeuse/teile');
  });
});
