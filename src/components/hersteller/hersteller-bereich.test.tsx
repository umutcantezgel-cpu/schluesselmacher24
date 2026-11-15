import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { herstellerZuPayload, herstellerZuSeite } from '@/lib/data/payload-mapping';
import type { ShopHersteller } from '@/lib/types';

import { BEREICHE, bereicheDesHerstellers, herstellerFuerAnzeige } from './bereiche';
import { HerstellerBereich, namensliste } from './hersteller-bereich';

const startbestand = () => defaults.hersteller();
/** Alle Einsatztexte je Bereich aus dem Startbestand. */
const bereichsTexte = () => startbestand().flatMap((h) => (h.bereiche ?? []).map((b) => b.einsatz));
const zeichne = (hersteller: ShopHersteller[], bereich?: 'sperrschliessung' | 'zutritt') =>
  renderToStaticMarkup(<HerstellerBereich hersteller={hersteller} bereich={bereich} />);

/** Gespeichertes Payload-Dokument mit hochgeladener Logo-Datei und Freigabe-Haken nach Wahl. */
function mitLogoDatei(h: ShopHersteller, freigabe: boolean): ShopHersteller {
  const doc = {
    ...herstellerZuPayload(h),
    id: 1,
    logo: { bild: { id: 7, url: '/api/medien/file/logo-test.png', alt: `Logo ${h.name}`, width: 400, height: 120 }, freigabe },
    updatedAt: '2026-11-15T00:00:00.000Z',
    createdAt: '2026-11-15T00:00:00.000Z',
  };
  return herstellerZuSeite(doc as never);
}

describe('HerstellerBereich: Daten', () => {
  it('Sperrschließungen zeigen genau BKS und ABUS', () => {
    expect(herstellerFuerAnzeige(startbestand(), 'sperrschliessung').map((e) => e.name)).toEqual(['BKS', 'ABUS']);
    const html = zeichne(startbestand(), 'sperrschliessung');
    expect(html.match(/data-hersteller="/g)).toHaveLength(2);
    expect(html).toContain('data-hersteller="bks"');
    expect(html).toContain('data-hersteller="abus"');
    expect(html).not.toContain('BURG-WÄCHTER');
  });

  it('Elektronischer Zutritt zeigt BKS, ABUS und BURG-WÄCHTER', () => {
    expect(herstellerFuerAnzeige(startbestand(), 'zutritt').map((e) => e.name)).toEqual(['BKS', 'ABUS', 'BURG-WÄCHTER']);
  });

  it('zeigt nur angebotene Hersteller', () => {
    const liste = startbestand().map((h) => (h.id === 'abus' ? { ...h, angeboten: false } : h));
    expect(herstellerFuerAnzeige(liste).map((e) => e.id)).toEqual(['bks', 'burg-waechter']);
    expect(herstellerFuerAnzeige(liste, 'sperrschliessung').map((e) => e.id)).toEqual(['bks']);
    const html = zeichne(liste);
    expect(html).not.toContain('data-hersteller="abus"');
    expect(html).not.toContain('>ABUS<');
  });

  it('zeigt nichts, wenn kein Hersteller angeboten wird', () => {
    expect(zeichne([])).toBe('');
    expect(zeichne(startbestand().map((h) => ({ ...h, angeboten: false })))).toBe('');
  });

  it('Startseite: alle drei mit ihren Bereichen und Verweisen in den passenden Bereich', () => {
    const eintraege = herstellerFuerAnzeige(startbestand());
    expect(eintraege.map((e) => [e.name, e.bereiche.map((b) => b.art)])).toEqual([
      ['BKS', ['sperrschliessung', 'zutritt']],
      ['ABUS', ['sperrschliessung', 'zutritt']],
      ['BURG-WÄCHTER', ['zutritt']],
    ]);
    const html = zeichne(startbestand());
    expect(html).toContain('Systeme, mit denen wir arbeiten');
    expect(html).toContain('Wir arbeiten mit Systemen von BKS, ABUS und BURG-WÄCHTER. Auf den Karten steht, wofür ihre Systeme eingesetzt werden.');
    expect(html.match(/href="\/gleichschliessende-zylinder"/g)).toHaveLength(2);
    expect(html.match(/href="\/elektronische-zutrittsloesungen"/g)).toHaveLength(3);
  });

  it('ein neuer Hersteller ohne Bereichszuordnung erscheint nur auf der Startseite, mit seinem Einsatztext', () => {
    const neu: ShopHersteller = { id: 'test-hersteller', slug: 'test-hersteller', name: 'Testhersteller', einsatz: 'Möbelschlösser', angeboten: true, reihenfolge: 40 };
    expect(herstellerFuerAnzeige([neu])).toEqual([{ id: 'test-hersteller', name: 'Testhersteller', einsatz: 'Möbelschlösser', bereiche: [] }]);
    expect(herstellerFuerAnzeige([neu], 'zutritt')).toEqual([]);
    expect(zeichne([neu])).toContain('Möbelschlösser');
  });

  it('liest Bereiche und Einsatztexte aus den Daten (FA-SHOP-04): eine Änderung im Admin wirkt sofort', () => {
    const geaendert = startbestand().map((h) => {
      if (h.id === 'burg-waechter') return { ...h, bereiche: [{ art: 'sperrschliessung' as const, einsatz: 'Testtext Sperrschließung' }] };
      if (h.id === 'abus') return { ...h, bereiche: [] };
      return h;
    });
    expect(herstellerFuerAnzeige(geaendert, 'sperrschliessung').map((e) => [e.id, e.bereiche[0].einsatz])).toEqual([
      ['bks', 'BKS stellt Schließzylinder für Gleichschließungen und Schließanlagen her.'],
      ['burg-waechter', 'Testtext Sperrschließung'],
    ]);
    expect(herstellerFuerAnzeige(geaendert, 'zutritt').map((e) => e.id)).toEqual(['bks']);
    // ABUS ohne Bereich: nur noch auf der Startseite, mit dem allgemeinen Einsatztext
    expect(herstellerFuerAnzeige(geaendert).find((e) => e.id === 'abus')?.bereiche).toEqual([]);
    expect(zeichne(geaendert, 'sperrschliessung')).toContain('Testtext Sperrschließung');
  });

  it('zeigt Bereiche in fester Reihenfolge, je Bereich nur den ersten Text, leere Texte nicht', () => {
    const h: ShopHersteller = {
      ...startbestand()[0],
      bereiche: [
        { art: 'zutritt', einsatz: 'Zutritt eins' },
        { art: 'sperrschliessung', einsatz: '  ' },
        { art: 'zutritt', einsatz: 'Zutritt zwei' },
      ],
    };
    expect(bereicheDesHerstellers(h)).toEqual({ zutritt: 'Zutritt eins' });
    expect(herstellerFuerAnzeige([h])[0].bereiche).toEqual([{ art: 'zutritt', einsatz: 'Zutritt eins' }]);
  });

  it('Startwerte im JSON-Rückfall und in den Defaults stimmen überein', () => {
    const json = JSON.parse(readFileSync(path.join(process.cwd(), 'content/hersteller.json'), 'utf8')) as ShopHersteller[];
    expect(json).toEqual(startbestand());
  });

  it('Bereiche gehen verlustfrei durch das Mapping', () => {
    for (const h of startbestand()) {
      const doc = { ...herstellerZuPayload(h), id: 1, updatedAt: '', createdAt: '' };
      expect(herstellerZuSeite(doc as never).bereiche).toEqual(h.bereiche);
    }
  });

  it('jeder Bereich zeigt auf eine Seite der Anwendung', () => {
    for (const b of Object.values(BEREICHE)) {
      const seite = path.join(process.cwd(), 'src/app/(site)', b.href.replace(/^\//, ''), 'page.tsx');
      expect(() => readFileSync(seite), b.href).not.toThrow();
    }
  });

  it('Texte je Bereich kurz und ohne Gedankenstriche', () => {
    expect(bereichsTexte()).toHaveLength(5);
    for (const text of bereichsTexte()) {
      expect(text).not.toMatch(/[–—]/);
      expect(text.length).toBeLessThanOrEqual(300);
      expect(text).not.toMatch(/€|Euro|Partner/);
    }
    for (const h of startbestand()) {
      expect(h.einsatz).not.toMatch(/[–—]/);
      expect(h.einsatz.length).toBeLessThanOrEqual(300);
    }
  });

  it('nennt keine Produktreihen, solange der Inhaber sie nicht bestätigt hat (R4)', () => {
    const reihen = /belvius|\bSE\b|wAppLoxx|secuENTRY/i;
    for (const text of bereichsTexte()) expect(text).not.toMatch(reihen);
    for (const h of startbestand()) expect(h.einsatz).not.toMatch(reihen);
    expect(zeichne(startbestand())).not.toMatch(reihen);
  });

  it('verbindet Namen lesbar', () => {
    expect(namensliste(['BKS'])).toBe('BKS');
    expect(namensliste(['BKS', 'ABUS'])).toBe('BKS und ABUS');
    expect(namensliste(['BKS', 'ABUS', 'BURG-WÄCHTER'])).toBe('BKS, ABUS und BURG-WÄCHTER');
  });
});

describe('HerstellerBereich: Logos nur mit Freigabe (R12)', () => {
  it('ohne Freigabe kein Logo, auch wenn eine Datei hinterlegt ist', () => {
    const liste = startbestand().map((h) => mitLogoDatei(h, false));
    expect(liste.every((h) => h.logo === undefined)).toBe(true);
    const html = zeichne(liste);
    expect(html).not.toContain('<img');
    expect(html).not.toContain('logo-test.png');
    // Stattdessen der Name als Schriftzug
    expect(html).toContain('>BKS</h3>');
  });

  it('mit Freigabe und Datei ersetzt das Logo den Schriftzug', () => {
    const liste = startbestand().map((h) => (h.id === 'bks' ? mitLogoDatei(h, true) : h));
    const html = zeichne(liste, 'sperrschliessung');
    expect(html.match(/<img/g)).toHaveLength(1);
    expect(html).toContain('alt="Logo BKS"');
    expect(html).toContain('class="sr-only">BKS</h3>');
    expect(html).toContain('>ABUS</h3>');
  });

  it('Startbestand trägt kein Logo', () => {
    expect(zeichne(startbestand())).not.toContain('<img');
  });
});
