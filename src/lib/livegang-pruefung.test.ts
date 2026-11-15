import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { einstellungenZuPayload } from './data/payload-mapping';
import { defaults } from './data/defaults';
import { beispielFunde, firmendatenFunde, mailadresseFunde, musterKennungen, platzhalterImText, rechtsseitenFunde, umgebungsMailFunde } from './livegang-pruefung';
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

  it('meldet eine Firmen-E-Mail außerhalb der eigenen Domain, ohne den Wert auszugeben (FA-24)', async () => {
    const firma = { ...einstellungenZuPayload(settingsJson).firma, email: 'kunde.fremd@gmail.com' };
    const funde = await firmendatenFunde(firma as Record<string, unknown>);
    expect(funde).toHaveLength(1);
    expect(funde[0].ort).toBe('Einstellungen › Firma › E-Mail');
    expect(funde[0].hinweis).toMatch(/eigenen Domain schluesselmacher24\.de/);
    expect(JSON.stringify(funde)).not.toContain('gmail');
  });

  it('meldet eine Firmen-E-Mail mit Platzhalter genau einmal, unter „Noch offen“', async () => {
    const firma = { ...einstellungenZuPayload(settingsJson).firma, email: '[Platzhalter: E-Mail-Adresse]' };
    const funde = await firmendatenFunde(firma as Record<string, unknown>);
    expect(funde).toHaveLength(1);
    expect(funde[0].hinweis).toMatch(/Noch offen: .*E-Mail/);
    expect(JSON.stringify(funde)).not.toContain('Platzhalter: E-Mail');
  });
});

describe('mailadresseFunde (FA-24)', () => {
  it('lässt eine Adresse auf der eigenen Domain durch, auch in Großschreibung', () => {
    expect(mailadresseFunde('info@schluesselmacher24.de')).toEqual([]);
    expect(mailadresseFunde(' Info@Schluesselmacher24.DE ')).toEqual([]);
  });

  it('meldet leer und fremde Domains; ein Platzhalter steht unter firmendatenPruefen', () => {
    expect(mailadresseFunde('')).toHaveLength(1);
    expect(mailadresseFunde(undefined)).toHaveLength(1);
    expect(mailadresseFunde('[Platzhalter: E-Mail-Adresse]')).toEqual([]);
    expect(mailadresseFunde('info@schluesselmacher24.de.example.org')[0].hinweis).toMatch(/eigenen Domain/);
    expect(mailadresseFunde('info@xschluesselmacher24.de')[0].hinweis).toMatch(/eigenen Domain/);
  });
});

describe('umgebungsMailFunde (FA-24)', () => {
  it('lässt Adressen auf der eigenen Domain durch, auch mehrere Betriebsempfänger', () => {
    expect(
      umgebungsMailFunde({
        MAIL_FROM_ADDRESS: 'info@schluesselmacher24.de',
        MAIL_REPLY_TO: ' Info@Schluesselmacher24.DE ',
        MAIL_TEAM_ADDRESS: 'info@schluesselmacher24.de, team@schluesselmacher24.de',
      }),
    ).toEqual([]);
  });

  it('lässt nicht gesetzte und leere Variablen durch', () => {
    expect(umgebungsMailFunde({})).toEqual([]);
    expect(umgebungsMailFunde({ MAIL_REPLY_TO: '', MAIL_TEAM_ADDRESS: ' , ' })).toEqual([]);
  });

  it('meldet eine fremde Antwortadresse nur mit dem Variablennamen', () => {
    const funde = umgebungsMailFunde({ MAIL_FROM_ADDRESS: 'info@schluesselmacher24.de', MAIL_REPLY_TO: 'kunde.fremd@gmail.com' });
    expect(funde).toHaveLength(1);
    expect(funde[0].ort).toBe('Umgebung › MAIL_REPLY_TO');
    expect(JSON.stringify(funde)).not.toContain('gmail');
  });

  it('meldet fremden Absender und fremde Betriebsempfänger je Variable einmal', () => {
    const funde = umgebungsMailFunde({
      MAIL_FROM_ADDRESS: 'shop@example.org',
      MAIL_TEAM_ADDRESS: 'info@schluesselmacher24.de, werkstatt@example.org, inhaber@example.org',
    });
    expect(funde.map((fund) => fund.ort)).toEqual(['Umgebung › MAIL_FROM_ADDRESS', 'Umgebung › MAIL_TEAM_ADDRESS']);
    expect(JSON.stringify(funde)).not.toContain('example');
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
