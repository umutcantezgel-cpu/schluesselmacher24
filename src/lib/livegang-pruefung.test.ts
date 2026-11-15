import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { einstellungenZuPayload } from './data/payload-mapping';
import { defaults } from './data/defaults';
import { beispielFunde, firmendatenFunde, musterKennungen, platzhalterImText, rechtsseitenFunde } from './livegang-pruefung';
import type { Settings } from './types';

const settingsJson = (await import('../../content/settings.json')).default as unknown as Settings;
const codeLinesJson = (await import('../../content/code-lines.json')).default as Array<{ id: string; name: string; example?: boolean }>;

describe('firmendatenFunde', () => {
  it('lässt die echten Firmendaten aus content/settings.json durch', async () => {
    expect(await firmendatenFunde(einstellungenZuPayload(settingsJson).firma as Record<string, unknown>)).toEqual([]);
  });

  it('meldet den gesetzten Haken und Platzhalter in den Feldern — ohne Werte auszugeben', async () => {
    const funde = await firmendatenFunde(einstellungenZuPayload(defaults.settings()).firma as Record<string, unknown>);
    expect(funde.map((f) => f.hinweis).join(' ')).toMatch(/Noch Platzhalter hinterlegt/);
    expect(funde.length).toBeGreaterThan(1);

    const firma = { ...einstellungenZuPayload(settingsJson).firma, steuernummer: '[Steuernummer eintragen]' };
    const nurSteuer = await firmendatenFunde(firma as Record<string, unknown>);
    expect(nurSteuer).toHaveLength(1);
    expect(nurSteuer[0].hinweis).toMatch(/Steuernummer/);
    expect(nurSteuer[0].hinweis).not.toContain('eintragen]');
  });

  it('meldet fehlende Firmendaten', async () => {
    expect(await firmendatenFunde(null)).toHaveLength(1);
  });
});

describe('platzhalterImText', () => {
  it('findet Platzhalter mit Zeile, auch über mehrere Zeilen', () => {
    const text = [
      'export default function Seite() {',
      '  return (<>',
      '    <p>[Platzhalter: Angaben zur Streitbeilegung',
      '      ergänzen.]</p>',
      '    <p>Musterstraße 1, [PLZ] [Ort]</p>',
      '  </>);',
      '}',
    ].join('\n');
    expect(platzhalterImText(text)).toEqual([
      { zeile: 3, auszug: '[Platzhalter: Angaben zur Streitbeilegung ergänzen.]' },
      { zeile: 5, auszug: '[PLZ]' },
      { zeile: 5, auszug: '[Ort]' },
    ]);
  });

  it('übergeht Code-Klammern und die bloße Erwähnung des Musters im Hinweiskasten', () => {
    const text = [
      'const liste = [...FOOTER_LEGAL];',
      'const [a, b] = paar;',
      '<Alert>Die mit <strong> [Platzhalter: …]</strong> gekennzeichneten Stellen</Alert>',
      'Möbelschloss [Serie 2]',
    ].join('\n');
    expect(platzhalterImText(text)).toEqual([]);
  });

  it('kürzt lange Fundstellen', () => {
    const [fund] = platzhalterImText(`[Platzhalter: ${'sehr lang '.repeat(20)}]`);
    expect(fund.auszug.length).toBeLessThanOrEqual(90);
  });
});

describe('rechtsseitenFunde', () => {
  const ordner = mkdtempSync(path.join(os.tmpdir(), 'sm24-livegang-'));
  afterAll(() => rmSync(ordner, { recursive: true, force: true }));

  it('durchsucht Seiten rekursiv, aber keine Tests', () => {
    mkdirSync(path.join(ordner, 'agb'));
    writeFileSync(path.join(ordner, 'agb', 'page.tsx'), 'x\n<p>[Platzhalter: Eigentumsvorbehalt]</p>\n');
    writeFileSync(path.join(ordner, 'agb', 'page.test.tsx'), '<p>[Platzhalter: nur im Test]</p>');
    writeFileSync(path.join(ordner, 'layout.tsx'), '<p>Fertiger Text</p>');
    expect(rechtsseitenFunde(ordner, ordner)).toEqual([
      { ort: `${path.join('agb', 'page.tsx')}:2`, hinweis: '[Platzhalter: Eigentumsvorbehalt]' },
    ]);
  });
});

describe('beispielFunde (A-046)', () => {
  const muster = musterKennungen();

  it('kennt die 52 Muster-Codelinien und die Beispielartikel', () => {
    expect(muster.has('ms-01')).toBe(true);
    expect(muster.has('zy-02')).toBe(true);
    expect(muster.has(defaults.standardArticles()[0].id)).toBe(true);
    expect(muster.size).toBe(52 + defaults.standardArticles().length);
  });

  it('lässt markierte Beispiele und echte Produkte durch', () => {
    expect(beispielFunde([{ kennung: 'ms-01', name: 'Muster', beispiel: true }, { kennung: 'abus-1', name: 'Echt', beispiel: false }], {})).toEqual([]);
  });

  it('meldet Musterdaten ohne Beispiel-Haken, ohne den Rest', () => {
    const funde = beispielFunde([{ kennung: 'zy-02', name: 'Profilzylinder', beispiel: false }, { kennung: 'abus-1', name: 'Echt', beispiel: false }], {});
    expect(funde).toHaveLength(1);
    expect(funde[0].ort).toBe('Produkte › zy-02');
  });

  it('meldet SM24_BEISPIELE=1', () => {
    const funde = beispielFunde([], { SM24_BEISPIELE: '1' });
    expect(funde).toHaveLength(1);
    expect(funde[0].hinweis).toContain('SM24_BEISPIELE=1');
    expect(beispielFunde([], { SM24_BEISPIELE: '0' })).toEqual([]);
  });

  it('meldet für den heutigen Inhalt ohne Datenbank nichts: alle Musterdaten sind markiert', () => {
    const eintraege = [...codeLinesJson, ...defaults.standardArticles()].map((e) => ({ kennung: e.id, name: e.name, beispiel: e.example === true }));
    expect(beispielFunde(eintraege, {})).toEqual([]);
  });
});
