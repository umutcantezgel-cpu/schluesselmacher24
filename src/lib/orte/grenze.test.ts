import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

/*
 * Der Ortsstamm bleibt auf dem Server (FA-PLATTFORM-03, Zusatz 2): stamm.ts ist server-only, und keine Datei mit
 * „use client“ importiert den Stamm, sein Lesemodul oder die Dateien unter content/orte/. Die reinen Module
 * (typen, index-stamm, entfernung, abfrage) dürfen überall stehen; sie enthalten keine Daten.
 */

const SRC = path.resolve(__dirname, '../..');
const STAMM_IMPORTE = [/['"]@\/lib\/orte\/(stamm|dateien|uebernahme)['"]/, /['"][./]*\/(stamm|dateien|uebernahme)['"]/, /content\/orte\//, /orte\/[a-z-]+\.json['"]/];

function dateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const voll = path.join(ordner, name);
    if (statSync(voll).isDirectory()) return dateien(voll);
    return /\.(ts|tsx|js|jsx|mjs)$/.test(name) ? [voll] : [];
  });
}

describe('Ortsstamm nur auf dem Server', () => {
  it('stamm.ts beginnt mit import server-only', () => {
    const text = readFileSync(path.join(__dirname, 'stamm.ts'), 'utf8');
    expect(text.trimStart().startsWith("import 'server-only';")).toBe(true);
  });

  it('keine Client-Datei importiert den Stamm oder content/orte', () => {
    const verstoesse = dateien(SRC)
      .filter((datei) => /^\s*['"]use client['"]/m.test(readFileSync(datei, 'utf8').slice(0, 200)))
      .filter((datei) => {
        const text = readFileSync(datei, 'utf8');
        return STAMM_IMPORTE.some((muster) => muster.test(text));
      })
      .map((datei) => path.relative(SRC, datei));
    expect(verstoesse).toEqual([]);
  });

  it('kein Modul importiert die JSON-Dateien des Stamms (sie würden mitgebündelt)', () => {
    const verstoesse = dateien(SRC)
      .filter((datei) => /from\s+['"][^'"]*orte\/[a-z-]+\.json['"]|import\(['"][^'"]*orte\/[a-z-]+\.json['"]\)/.test(readFileSync(datei, 'utf8')))
      .map((datei) => path.relative(SRC, datei));
    expect(verstoesse).toEqual([]);
  });

  it('die reinen Module lesen keine Dateien', () => {
    for (const name of ['typen.ts', 'index-stamm.ts', 'entfernung.ts', 'abfrage.ts', 'ortsseiten.ts', 'abdeckung.ts']) {
      const text = readFileSync(path.join(__dirname, name), 'utf8');
      expect(text).not.toMatch(/node:fs|from '\.\/dateien'|from '\.\/stamm'/);
    }
  });
});
