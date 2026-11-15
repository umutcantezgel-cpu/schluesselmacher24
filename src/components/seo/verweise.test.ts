import { describe, expect, it } from 'vitest';

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
    const quellen = quellenAusOrten([ort('wetzlar', 'Echter Text.'), ort('giessen', '[Platzhalter: Einleitung]'), ort('marburg', 'Text.', true)]);
    expect(quellen.map((q) => q.pfad)).toEqual(['/standorte/wetzlar']);
    expect(quellen[0].titel).toBe('Schlüssel- und Schließtechnik in wetzlar');
    expect(quellen[0].links.map((l) => l.href)).toEqual(['/standorte', '/autoschluessel', '/schliessanlagen']);
    expect(eingehendeVerweise('/autoschluessel', quellen)).toEqual([{ href: '/standorte/wetzlar', label: 'Schlüssel- und Schließtechnik in wetzlar' }]);
  });
});
