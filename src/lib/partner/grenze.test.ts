import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

/*
 * Grenze des Partnermoduls (FA-PLATTFORM-01C, Nachbesserung 3). src/lib/partner/** wird von den Sammlungen und
 * Hooks geladen, auch unter `payload run`, wo es weder die Bedingung „react-server“ noch den Pfadalias `@/` gibt.
 * Darum gilt für jede Datei dort außer Tests:
 *   - kein `import 'server-only'`,
 *   - kein Import mit `@/` (nur relative Importe),
 *   - kein Import des Ortsstamms (orte/stamm, orte/dateien); die Auskunft kommt als Parameter herein.
 * Einzige Ausnahme: partnerweg-daten.ts. Sie ist der Server-Aufrufer des Partnerwegs für Kunden (liest Datenbank,
 * Einstellungen und Ortsstamm), wird nur von Serveraktionen unter src/lib/actions geladen und ist deshalb
 * server-only. Keine Sammlung und kein Hook darf sie importieren.
 * Stand bei Einführung (16.11.2026): Die übrigen Dateien importieren nur relativ (../types, ../format, ./…).
 */

const SRC = path.resolve(__dirname, '../..');
const PARTNER = __dirname;

/** Server-Aufrufer des Partnerwegs; Grund siehe oben. */
const AUSNAHMEN = new Set(['partnerweg-daten.ts']);

function dateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const voll = path.join(ordner, name);
    if (statSync(voll).isDirectory()) return dateien(voll);
    return /\.(ts|tsx|js|jsx|mjs)$/.test(name) ? [voll] : [];
  });
}

const istTest = (datei: string) => /\.test\.(ts|tsx)$/.test(datei);

/** Alle Modulangaben einer Datei: statische Importe und Exporte, `import 'x'`, dynamisches `import('x')`, `require('x')`. */
function modulangaben(text: string): string[] {
  const muster = [/\bfrom\s+['"]([^'"]+)['"]/g, /\bimport\s+['"]([^'"]+)['"]/g, /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g, /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g];
  return muster.flatMap((m) => [...text.matchAll(m)].map((treffer) => treffer[1]));
}

const STAMM = /(^|\/)orte\/(stamm|dateien)$|^\.\/(stamm|dateien)$/;

describe('Grenze von src/lib/partner', () => {
  const geprueft = dateien(PARTNER).filter((d) => !istTest(d) && !AUSNAHMEN.has(path.relative(PARTNER, d)));

  it('findet die Dateien (sonst prüft der Test nichts)', () => {
    expect(geprueft.length).toBeGreaterThan(10);
    expect(geprueft.map((d) => path.basename(d))).toEqual(expect.arrayContaining(['region.ts', 'postleitzahl-muster.ts', 'pruefliste.ts']));
  });

  it('die Ausnahme gibt es und sie ist server-only', () => {
    for (const name of AUSNAHMEN) {
      const text = readFileSync(path.join(PARTNER, name), 'utf8');
      expect(text.trimStart().startsWith("import 'server-only';")).toBe(true);
    }
  });

  it('kein server-only, kein Import mit @/, kein Import des Ortsstamms', () => {
    const verstoesse = geprueft.flatMap((datei) =>
      modulangaben(readFileSync(datei, 'utf8'))
        .filter((angabe) => angabe === 'server-only' || angabe.startsWith('@/') || STAMM.test(angabe))
        .map((angabe) => `${path.relative(SRC, datei)}: ${angabe}`),
    );
    expect(verstoesse).toEqual([]);
  });

  it('die Regel erkennt Verstöße (Gegenprobe)', () => {
    const probe = ["import 'server-only';", "import { a } from '@/lib/auftragsweg';", "import { ortsstamm } from '../orte/stamm';", "const d = await import('../orte/dateien');"].join('\n');
    expect(modulangaben(probe).filter((angabe) => angabe === 'server-only' || angabe.startsWith('@/') || STAMM.test(angabe))).toHaveLength(4);
  });
});

describe('Sammlungen und Hooks laden den Partnerweg-Server nicht', () => {
  // Admin-Bausteine unter src/payload/components sind ausgenommen: Sie laufen als Serverbausteine in Next und dürfen
  // stamm.ts nutzen (Ortsseiten.tsx); partnerweg-daten.ts nutzen sie heute nicht.
  const ordner = ['collections', 'hooks'].map((teil) => path.join(SRC, 'payload', teil));

  it('keine Datei unter src/payload/collections oder src/payload/hooks importiert partnerweg-daten', () => {
    const verstoesse = ordner
      .flatMap(dateien)
      .filter((datei) => !istTest(datei))
      .filter((datei) => modulangaben(readFileSync(datei, 'utf8')).some((angabe) => /(^|\/)partnerweg-daten$/.test(angabe)))
      .map((datei) => path.relative(SRC, datei));
    expect(verstoesse).toEqual([]);
  });
});
