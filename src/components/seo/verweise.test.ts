import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ortsseiteGruende } from '@/lib/rechtliches/indexierung';
import type { CityPage } from '@/lib/types';

import { eingehendeVerweise, passtDazu, quellenAusOrten, zielPfad, type VerweisQuelle } from './verweise';

const QUELLEN: VerweisQuelle[] = [
  { pfad: '/ratgeber/zylinder-richtig-ausmessen', titel: 'Zylinder richtig ausmessen', links: [{ href: '/gleichschliessende-zylinder', label: 'x' }] },
  { pfad: '/gleichschliessende-zylinder/konfigurator', titel: 'Konfigurator', links: [{ href: '/gleichschliessende-zylinder', label: 'x' }] },
  { pfad: '/autoschluessel/anfrage', titel: 'Anfrage', links: [{ href: '/gleichschliessende-zylinder', label: 'x' }] },
  { pfad: '/partner-werden', titel: 'Partner werden', links: [{ href: '/autoschluessel?x=1', label: 'x' }] },
  { pfad: '/tuer-und-schliesstechnik', titel: 'Tür- und Schließtechnik', links: [{ href: '/gleichschliessende-zylinder/', label: 'x' }] },
];

describe('Verweisliste „Passt dazu“', () => {
  it('vergleicht Ziele ohne Abfrage, Anker und Schrägstrich am Ende', () => {
    expect(zielPfad('/autoschluessel/anfrage?vorhanden=0')).toBe('/autoschluessel/anfrage');
    expect(zielPfad('/schluessel-nach-code#codelinien')).toBe('/schluessel-nach-code');
    expect(zielPfad('/ratgeber/')).toBe('/ratgeber');
    expect(zielPfad('/')).toBe('/');
  });

  it('bildet die Gegenrichtung ohne eigene Unterseiten und ohne Abläufe', () => {
    expect(eingehendeVerweise('/gleichschliessende-zylinder', QUELLEN)).toEqual([
      { href: '/ratgeber/zylinder-richtig-ausmessen', label: 'Zylinder richtig ausmessen' },
      { href: '/tuer-und-schliesstechnik', label: 'Tür- und Schließtechnik' },
    ]);
    expect(eingehendeVerweise('/autoschluessel', QUELLEN)).toEqual([{ href: '/partner-werden', label: 'Partner werden' }]);
  });

  it('zeigt eigene Links zuerst, ohne Dopplung, ohne die Seite selbst, ohne bereits gezeigte Ziele, höchstens max', () => {
    const eigene = [
      { href: '/gleichschliessende-zylinder', label: 'Selbst' },
      { href: '/schliessanlagen', label: 'Schließanlagen' },
      { href: '/schliessanlagen?x', label: 'Doppelt' },
      { href: '/ratgeber/zylinder-richtig-ausmessen', label: 'Ausmessen (gepflegt)' },
      { href: '/leer', label: '  ' },
    ];
    expect(passtDazu('/gleichschliessende-zylinder', eigene, QUELLEN)).toEqual([
      { href: '/schliessanlagen', label: 'Schließanlagen' },
      { href: '/ratgeber/zylinder-richtig-ausmessen', label: 'Ausmessen (gepflegt)' },
      { href: '/tuer-und-schliesstechnik', label: 'Tür- und Schließtechnik' },
    ]);
    expect(passtDazu('/gleichschliessende-zylinder', eigene, QUELLEN, { ausser: ['/tuer-und-schliesstechnik'], max: 1 })).toEqual([
      { href: '/schliessanlagen', label: 'Schließanlagen' },
    ]);
  });

  it('nimmt nur veröffentlichte Ortsseiten und ihre angebotenen Bereiche (FA-25-17)', () => {
    const ort = (slug: string, intro: string, noindex = false): CityPage => ({
      id: slug,
      slug,
      city: slug,
      state: 'Hessen',
      localIntro: intro,
      localFacts: [],
      servicesOffered: ['autoschluessel', 'schliessanlagen'],
      onSiteRadiusKm: 20,
      seo: { title: `Ort ${slug}`, description: 'Beschreibung', internalLinks: [{ href: '/standorte', label: 'Alle' }], noindex },
      updatedAt: '2026-11-01',
    });
    // Lage wie aus getCities (FA-PLATTFORM-03B): Werkstatt im Ort; die Gründe rechnet die echte Regel.
    const echt = 'Echter Text über die Werkstatt in der Altstadt, Schlüssel nach Muster, Autoschlüssel nach Termin und die Abholung von Bestellungen. Anreise aus dem Umland, vor Ort nach Prüfung.';
    const roh = [ort('wetzlar', echt), ort('giessen', '[Platzhalter: Einleitung]'), ort('marburg', `${echt} Marburg.`, true)];
    const weg = { gemeinde: { schluessel: '06532023', name: 'Wetzlar' }, werkstatt: 'ort' as const, partnerDeckt: false, verfuegbarkeit: false };
    const mitLage = roh.map((o) => ({
      ...o,
      lage: { kreis: null, land: null, postleitzahlen: [], koordinaten: null, prioritaet: null, ...weg, gruende: ortsseiteGruende(o, roh, weg) },
    }));
    const quellen = quellenAusOrten(mitLage);
    expect(quellen.map((q) => q.pfad)).toEqual(['/standorte/wetzlar']);
    expect(quellen[0].titel).toBe('Schlüssel- und Schließtechnik in wetzlar');
    expect(quellen[0].links.map((l) => l.href)).toEqual(['/standorte', '/autoschluessel', '/schliessanlagen']);
    expect(eingehendeVerweise('/autoschluessel', quellen)).toEqual([{ href: '/standorte/wetzlar', label: 'Schlüssel- und Schließtechnik in wetzlar' }]);
  });
});

describe('Leistung ↔ Ortsseite mit den echten Inhalten (FA-25-17)', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('jede Leistung aus servicesOffered einer veröffentlichten Ortsseite verweist auf diese Ortsseite', async () => {
    vi.stubEnv('SM24_DATA', 'json');
    vi.resetModules();
    const { getCities, getPageContent } = await import('@/lib/data');
    const { stadtIndexierbar } = await import('@/lib/rechtliches/indexierung');
    const { areaByKey } = await import('@/lib/navigation');
    const verweise = await import('./verweise');
    const quellen = await verweise.verweisQuellen();

    const orte = (await getCities()).filter(stadtIndexierbar);
    expect(orte.length).toBeGreaterThan(0);
    const fehlend: string[] = [];
    for (const ort of orte) {
      const ortPfad = `/standorte/${ort.slug}`;
      for (const key of ort.servicesOffered) {
        const ziel = areaByKey(key)?.href;
        if (!ziel) continue;
        const datei = path.resolve(__dirname, '../../app/(site)', `.${ziel}`, 'page.tsx');
        const quelle = existsSync(datei) ? readFileSync(datei, 'utf8') : '';
        // Was die Seite zeigt, konservativ gerechnet (ohne `ausser`, das nur Platz schafft):
        // „Passt dazu“ = eigene gepflegte Links + Gegenrichtung (max. 6); sonst nur die Gegenrichtung im eigenen Block (max. 3).
        let gezeigt: string[] = [];
        if (quelle.includes('<PasstDazu')) {
          const eigene = (await getPageContent(ziel.slice(1)))?.seo.internalLinks ?? [];
          gezeigt = verweise.passtDazu(ziel, eigene, quellen).map((v) => v.href);
        } else if (quelle.includes('gegenrichtung(')) {
          gezeigt = verweise.passtDazu(ziel, [], quellen, { max: 3 }).map((v) => v.href);
        }
        if (!gezeigt.includes(ortPfad)) fehlend.push(`${ziel} → ${ortPfad}`);
      }
    }
    expect(fehlend).toEqual([]);
  });
});
