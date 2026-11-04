import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { RubrikAblauf, RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';

import { defaults } from '../data/defaults';

const RUBRIKEN = defaults.rubriken();
const rubrik = (id: string) => RUBRIKEN.find((r) => r.id === id)!;

/** Rubriken, deren Seite der Ablauf erst mit einem späteren Paket erreicht (mit Grund). */
const SPAETER: Record<string, string> = {
  'schluessel-einschicken': 'E6-OPUS-02 baut die Seite mit Begleitschein neu und setzt dabei den Ablauf aus den Daten ein.',
};

describe('Ablauf je Rubrik aus den Daten (G-10, G-11, E6-OPUS-01)', () => {
  it('zeigt auf jeder Live-Rubrikseite den Ablauf aus den Rubrikdaten', () => {
    for (const r of RUBRIKEN.filter((x) => x.status === 'live')) {
      if (SPAETER[r.id]) continue;
      const datei = path.join(process.cwd(), 'src/app/(site)', r.ziel, 'page.tsx');
      const quelltext = readFileSync(datei, 'utf8');
      expect(quelltext, `${r.id}: ${r.ziel}`).toMatch(/<RubrikAblauf(Abschnitt)?\b/);
      expect(quelltext, `${r.id}: ${r.ziel}`).toContain(`getRubrik('${r.id}')`);
    }
  });

  it('kennt keine handgeschriebenen Schrittlisten mehr auf Seiten mit Ablauf aus den Daten', () => {
    for (const ziel of ['/schluessel-nach-vorlage', '/elektronische-zutrittsloesungen']) {
      const quelltext = readFileSync(path.join(process.cwd(), 'src/app/(site)', ziel, 'page.tsx'), 'utf8');
      expect(quelltext, ziel).not.toMatch(/^const (STEPS|ABLAUF)\b/m);
    }
  });

  it('setzt die Liste mit Nummer, Icon und Zwischenüberschrift je Schritt', () => {
    const foto = rubrik('schluessel-nach-foto');
    const html = renderToStaticMarkup(<RubrikAblauf rubrik={foto} variante="liste" />);
    expect(html.match(/<li /g)).toHaveLength(foto.ablauf.length);
    expect(html).toContain('<span class="sr-only">Schritt 1: </span>');
    expect(html).toContain('>01<');
    for (const s of foto.ablauf) expect(html).toContain(s.titel);
    expect(html.match(/<h3 /g)).toHaveLength(foto.ablauf.length);
  });

  it('setzt den Abschnitt mit „So läuft Ihr Auftrag ab“ und lässt ihn ohne Schritte weg', () => {
    const code = rubrik('schluessel-nach-code');
    const html = renderToStaticMarkup(<RubrikAblaufAbschnitt rubrik={code} nummer="03" titel="Vom Code zum fertigen Schlüssel" />);
    expect(html).toContain('So läuft Ihr Auftrag ab');
    expect(html).toContain('Vom Code zum fertigen Schlüssel');
    expect(html).toContain(`aria-labelledby="ablauf-${code.id}-titel"`);
    expect(html).toContain(`data-ablauf="${code.id}"`);
    expect(renderToStaticMarkup(<RubrikAblaufAbschnitt rubrik={null} titel="x" />)).toBe('');
    expect(renderToStaticMarkup(<RubrikAblaufAbschnitt rubrik={{ ...code, ablauf: [] }} titel="x" />)).toBe('');
  });

  it('nennt im Ablauf der Schlüsselwege den Nachweis, wo die Rubrik ihn verlangt (R13)', () => {
    for (const id of ['schluessel-nach-code', 'schluessel-nach-foto']) {
      expect(rubrik(id).ablauf.map((s) => s.text).join(' '), id).toContain('Sicherungskarte');
    }
  });
});
