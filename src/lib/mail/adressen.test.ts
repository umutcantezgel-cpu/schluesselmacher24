/* Adressprüfung (FA-24): Jede Absender-, Antwort- und Empfängeradresse der Seite
 * liegt auf der eigenen Domain. Geprüft wird Quelltext und Inhalt, ohne Tests
 * und Testdaten (dort sind Beispiele wie example.org erlaubt). */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import settingsJson from '../../../content/settings.json';
import { EIGENE_MAILDOMAIN } from '../livegang-pruefung';
import type { CompanyProfile } from '../types';
import { antwortAdresse, teamEmpfaenger } from './versand';

const FIRMA = settingsJson.company as unknown as CompanyProfile;

const WURZEL = fileURLToPath(new URL('../../..', import.meta.url));
/** Quelltext, Inhalte und Wurzeldateien, die ausgeliefert werden oder deren Adressen dorthin wirken. */
const PRUEFBAR = [
  'src',
  'scripts',
  'docs',
  'content',
  '.env.example',
  'README.md',
  'UMSETZUNG.md',
  'vercel.json',
  'next.config.ts',
  'package.json',
];
const TEXT = /\.(tsx?|mjs|cjs|js|jsx|json|md|mdx|txt|html)$/;
/** Bildnamen mit Dichte-Angabe wie „logo@2x.png“ sind keine Adressen. Nur der ganze Treffer zählt. */
const BILDNAME = /@\d+x\.(png|jpe?g|webp|avif|gif|svg|ico)$/i;
const ADRESSE = /[A-Za-z0-9._%+-]+@((?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,})/g;

function dateien(ordner: string): string[] {
  const ergebnis: string[] = [];
  for (const name of readdirSync(ordner)) {
    if (name === 'node_modules' || name === '.next' || name === 'test') continue;
    const pfad = path.join(ordner, name);
    if (statSync(pfad).isDirectory()) {
      ergebnis.push(...dateien(pfad));
    } else if (!/\.test\.[cm]?[jt]sx?$/.test(name) && (TEXT.test(name) || name === '.env.example')) {
      ergebnis.push(pfad);
    }
  }
  return ergebnis;
}

/** Alle Adressen mit Fundstelle, ohne Testdaten-Ordner. */
function adressenIm(): Array<{ datei: string; zeile: number; adresse: string }> {
  const funde: Array<{ datei: string; zeile: number; adresse: string }> = [];
  for (const ziel of PRUEFBAR) {
    const pfad = path.join(WURZEL, ziel);
    const liste = ziel === '.env.example' ? [pfad] : statSync(pfad).isDirectory() ? dateien(pfad) : [pfad];
    for (const datei of liste) {
      if (path.relative(WURZEL, datei).split(path.sep).includes('testdaten')) continue;
      const zeilen = readFileSync(datei, 'utf8').split('\n');
      zeilen.forEach((zeile, index) => {
        for (const treffer of zeile.matchAll(ADRESSE)) {
          if (BILDNAME.test(treffer[0])) continue;
          funde.push({ datei: path.relative(WURZEL, datei), zeile: index + 1, adresse: treffer[0] });
        }
      });
    }
  }
  return funde;
}

describe('Adressen im ausgelieferten Bestand (FA-24)', () => {
  it('nennt außerhalb der Tests nur Adressen auf der eigenen Domain', () => {
    const alle = adressenIm();
    // Die Suche muss bekannte Fundstellen finden. Sonst wäre die Prüfung unten leer und grün.
    expect(alle.some((f) => f.datei === '.env.example' && f.adresse === 'info@schluesselmacher24.de')).toBe(true);
    expect(alle.some((f) => f.datei === path.join('content', 'settings.json') && f.adresse === 'info@schluesselmacher24.de')).toBe(true);
    const fremd = alle.filter((f) => !f.adresse.toLowerCase().endsWith(`@${EIGENE_MAILDOMAIN}`));
    expect(fremd.map((f) => `${f.datei}:${f.zeile} ${f.adresse}`)).toEqual([]);
  });

  it('nennt als Firmen-E-Mail genau info@schluesselmacher24.de', () => {
    expect(settingsJson.company.email).toBe('info@schluesselmacher24.de');
  });
});

describe('Absender- und Empfängeradressen folgen der Firmen-E-Mail (FA-24)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('antwortet an die Firmen-E-Mail, solange kein Mailanbieter eingetragen ist', () => {
    vi.stubEnv('MAIL_PROVIDER', '');
    vi.stubEnv('MAIL_REPLY_TO', '');
    expect(antwortAdresse(FIRMA)).toBe('info@schluesselmacher24.de');
  });

  it('schickt Betriebsmails an die Firmen-E-Mail, wenn keine Team-Adresse gesetzt ist', () => {
    vi.stubEnv('MAIL_PROVIDER', '');
    vi.stubEnv('MAIL_TEAM_ADDRESS', '');
    expect(teamEmpfaenger(FIRMA)).toEqual(['info@schluesselmacher24.de']);
  });
});
