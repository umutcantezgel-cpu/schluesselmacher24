import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PageHeader } from '@/components/layout/page-header';
import { rubrikUebergang } from '@/components/visual/motion/seitenwechsel';
import { defaults } from '@/lib/data/defaults';

import { ABLAUF_PLATZHALTER, ablaufText, RubrikAblauf } from './rubrik-ablauf';
import { HUB_WECHSEL_SCHLUESSEL, UEBERBLENDUNG_KLASSE } from './rubrik-ankunft';

const auto = defaults.rubriken().find((r) => r.id === 'autoschluessel')!;

describe('So läuft Ihr Auftrag ab (G-10)', () => {
  it('setzt Anzahlung und Vorlauf aus den Einstellungen ein', () => {
    expect(ablaufText('Standard {anzahlung}. Der Betrag wird angerechnet.', { anzahlung: '69,90 €' })).toBe(
      'Standard 69,90 €. Der Betrag wird angerechnet.',
    );
  });

  it('lässt einen Satz weg, dessen Wert fehlt, statt eine Lücke zu zeigen', () => {
    expect(ablaufText('Standard {anzahlung}. Der Betrag wird angerechnet.', {})).toBe('Der Betrag wird angerechnet.');
  });

  it('zeigt jeden Schritt mit Nummer, Fach-Icon und Text aus den Daten', () => {
    const html = renderToStaticMarkup(<RubrikAblauf rubrik={auto} werte={{ anzahlung: '69,90 €', vorlauf: '7 Tage' }} />);
    expect(html.match(/<li\b/g)).toHaveLength(auto.ablauf.length);
    for (const schritt of auto.ablauf) expect(html).toContain(schritt.titel);
    expect(html.match(/<svg\b/g)?.length).toBe(auto.ablauf.length);
    expect(html).toContain('69,90 €');
    expect(html).not.toMatch(/\{[a-z]+\}/);
  });

  it('zeigt ohne Schritte nichts', () => {
    expect(renderToStaticMarkup(<RubrikAblauf rubrik={{ ...auto, ablauf: [] }} />)).toBe('');
  });

  it('nutzt in allen Rubriken nur bekannte Platzhalter, und die JSON-Daten gleichen den Standardwerten', () => {
    const erlaubt = new Set<string>(ABLAUF_PLATZHALTER);
    for (const r of defaults.rubriken()) {
      for (const s of r.ablauf) for (const m of s.text.matchAll(/\{([a-z]+)\}/g)) expect(erlaubt.has(m[1]), `${r.id}: ${m[1]}`).toBe(true);
    }
    const json = JSON.parse(readFileSync(path.join(process.cwd(), 'content/rubriken.json'), 'utf8'));
    const liste = (Array.isArray(json) ? json : Object.values(json).find(Array.isArray)) as Array<{ id: string; ablauf: unknown }>;
    expect(liste.find((r) => r.id === 'autoschluessel')!.ablauf).toEqual(auto.ablauf);
  });
});

describe('Rubrikkopf und Übergang (B-35)', () => {
  it('trägt das Fach-Icon der Rubrik unter ihrem Übergangsnamen und macht die h1 fokussierbar', () => {
    const html = renderToStaticMarkup(<PageHeader title="Autoschlüssel" bereich="autoschluessel" rubrik={auto} />);
    expect(html).toContain('id="seiten-titel"');
    expect(html).toContain('tabindex="-1"');
    // Der Name des gemeinsamen Elements steht nur im React-Canary der Laufzeit; hier zählt die Zuordnung.
    expect(rubrikUebergang(auto.id)).toBe('rubrik-autoschluessel');
  });

  it('fällt ohne live-Rubrik auf den Bereich zurück', () => {
    const html = renderToStaticMarkup(
      <PageHeader title="Motorrad" bereich="autoschluessel" rubrik={{ id: 'motorradschluessel', icon: 'motorradschluessel', status: 'spaeter' }} />,
    );
    expect(html).not.toContain('id="seiten-titel"');
  });

  it('merkt sich den Wechsel nur in der Sitzung und kennt den Rückfall', () => {
    expect(HUB_WECHSEL_SCHLUESSEL).toBe('sm24-hub-wechsel');
    const css = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
    expect(css).toContain(`:where(:root[data-bewegung='an']) .${UEBERBLENDUNG_KLASSE}`);
    expect(css).toMatch(/::view-transition \{\s*pointer-events: none;/);
  });
});
