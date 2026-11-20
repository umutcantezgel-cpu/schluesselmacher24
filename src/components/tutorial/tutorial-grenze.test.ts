import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { TUTORIAL_ORTE } from '@/lib/tutorials/orte';

/*
 * Grenze der Importe (FA-INHALT-01B, A-071, Muster `src/lib/auftragsweg-grenze.test.ts`):
 * - Der Tutorial-Hinweis und die Dateien, die Formulare importieren, ziehen weder die Datenschicht noch den
 *   Client-Baustein der Einbettung herein. Formulare bekommen den Hinweis fertig gerendert als Eigenschaft.
 * - Der Client-Baustein der Einbettung hängt nur an der Tutorial-Seite (der einzigen, die ein Video zeigt).
 */

const lies = (datei: string) => readFileSync(datei, 'utf8');
/** Laufzeit-Importe; `import type` zählt nicht (wird beim Bauen entfernt). */
const ziele = (quelle: string) =>
  [...quelle.matchAll(/^import\s+(?!type\s)[^;]*?from\s+'([^']+)'|import\(\s*'([^']+)'\s*\)/gm)].map((m) => m[1] ?? m[2]);

/** Löst einen Import aus `datei` zu einer Datei unter src auf; Pakete ergeben `null`. */
function aufloesen(datei: string, ziel: string): string | null {
  const basis = ziel.startsWith('@/') ? path.join('src', ziel.slice(2)) : ziel.startsWith('.') ? path.join(path.dirname(datei), ziel) : null;
  if (!basis) return null;
  for (const kandidat of [basis, `${basis}.ts`, `${basis}.tsx`, path.join(basis, 'index.ts'), path.join(basis, 'index.tsx')]) {
    if (existsSync(kandidat) && !kandidat.endsWith(path.sep) && kandidat.match(/\.(ts|tsx)$/)) return path.normalize(kandidat);
  }
  return null;
}

/** Alle Dateien unter src, die `start` zur Laufzeit erreicht (ohne Pakete). */
function erreichbar(start: string): Set<string> {
  const gesehen = new Set<string>();
  const offen = [path.normalize(start)];
  while (offen.length) {
    const datei = offen.pop()!;
    if (gesehen.has(datei)) continue;
    gesehen.add(datei);
    for (const ziel of ziele(lies(datei))) {
      const naechste = aufloesen(datei, ziel);
      if (naechste && !gesehen.has(naechste)) offen.push(naechste);
    }
  }
  return gesehen;
}

const DATENSCHICHT = /^src\/lib\/data(\/|$)|^src\/lib\/tutorials\/hinweise\.ts$|^src\/payload/;
const EINBETTUNG = /^src\/components\/tutorial\/video-(rahmen|hinweis)\.tsx$/;

const FORMULARE = [
  'src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx',
  'src/app/(site)/autoschluessel/anfrage/assistent.tsx',
  'src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx',
];

describe('Tutorial-Hinweis: Grenze der Importe', () => {
  it('Selbsttest: der Graph findet die Datenschicht hinter den Verweisen und die Einbettung hinter der Seite', () => {
    expect([...erreichbar('src/lib/tutorials/hinweise.ts')].some((d) => /^src\/lib\/data\/index\.ts$/.test(d))).toBe(true);
    expect([...erreichbar('src/app/(site)/tutorials/[slug]/page.tsx')].filter((d) => EINBETTUNG.test(d)).sort()).toEqual([
      'src/components/tutorial/video-hinweis.tsx',
      'src/components/tutorial/video-rahmen.tsx',
    ]);
    // Mehrzeilige Importe und `import type` werden richtig gelesen.
    expect(ziele("import {\n  a,\n  b,\n} from './x';\nimport type { T } from './y';")).toEqual(['./x']);
  });

  it('der Hinweis zieht weder die Datenschicht noch die Einbettung herein', () => {
    const graph = [...erreichbar('src/components/tutorial/tutorial-hinweis.tsx')];
    expect(graph.length).toBeGreaterThan(1);
    expect(graph.filter((d) => DATENSCHICHT.test(d))).toEqual([]);
    expect(graph.filter((d) => EINBETTUNG.test(d))).toEqual([]);
    // Kein eigenes Skript: der Hinweis ist kein Client-Baustein.
    expect(lies('src/components/tutorial/tutorial-hinweis.tsx')).not.toMatch(/^'use client'/m);
  });

  it('die Formulare importieren weder Hinweis, Verweise, Datenschicht noch Einbettung', () => {
    for (const formular of FORMULARE) {
      const importe = ziele(lies(formular));
      expect(importe.filter((z) => /tutorial|@\/lib\/data$|@\/lib\/data\//.test(z)), formular).toEqual([]);
      // Auch nicht über Umwege: Der Modulgraph des Formulars erreicht weder die Einbettung noch die Verweise.
      const graph = [...erreichbar(formular)];
      expect(graph.filter((d) => EINBETTUNG.test(d) || /^src\/lib\/tutorials\/hinweise\.ts$/.test(d)), formular).toEqual([]);
      expect(graph.filter((d) => /^src\/components\/tutorial\//.test(d)), formular).toEqual([]);
    }
  });

  it('kein Baustein mit „use client“ importiert die Verweise oder den Hinweis', () => {
    const dateien = execSync("grep -rl \"^'use client'\" src --include=*.ts --include=*.tsx", { encoding: 'utf8' }).split('\n').filter(Boolean);
    expect(dateien.length).toBeGreaterThan(20);
    for (const datei of dateien) {
      const importe = ziele(lies(datei));
      expect(importe.some((z) => /tutorials\/hinweise$|tutorial\/tutorial-hinweis$/.test(z)), datei).toBe(false);
    }
  });

  it('die Einbettung hängt nur an der Tutorial-Seite', () => {
    const nutzer = (name: string) =>
      execSync(`grep -rlE "from '(\\./|@/components/tutorial/)${name}'" src --include=*.ts --include=*.tsx`, { encoding: 'utf8' })
        .split('\n')
        .filter((d) => d && !d.endsWith('.test.tsx') && !d.endsWith('.test.ts'));
    expect(nutzer('video-rahmen')).toEqual(['src/components/tutorial/video-hinweis.tsx']);
    expect(nutzer('video-hinweis')).toEqual(['src/components/tutorial/tutorial-inhalt.tsx']);
    expect(nutzer('tutorial-inhalt')).toEqual(['src/app/(site)/tutorials/[slug]/page.tsx']);
  });

  it('die Seiten geben den Hinweis an jedem Ort aus TUTORIAL_ORTE weiter', () => {
    const seiten: Record<string, string[]> = {
      'src/app/(site)/schluessel-nach-vorlage/page.tsx': ['schluessel-nach-vorlage'],
      'src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx': ['schluessel-nach-vorlage-fotos'],
      'src/app/(site)/autoschluessel/anfrage/page.tsx': ['autoschluessel-fotos', 'autoschluessel-fahrzeugschein'],
      'src/app/(site)/schluessel-nach-code/page.tsx': ['schluessel-nach-code'],
      'src/app/(site)/schluessel-einschicken/page.tsx': ['schluessel-einschicken'],
      'src/app/(site)/gleichschliessende-zylinder/page.tsx': ['gleichschliessende-zylinder'],
      'src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx': [
        'gleichschliessende-zylinder-messen',
        'gleichschliessende-zylinder-funktion',
      ],
      'src/app/(site)/schliessanlagen/page.tsx': ['schliessanlagen'],
      'src/app/(site)/autoschluessel/gehaeuse/page.tsx': ['autoschluessel-gehaeuse'],
    };
    const alle = Object.values(seiten).flat().sort();
    expect(alle).toEqual(TUTORIAL_ORTE.map((ort) => ort.value).sort());
    for (const [seite, orte] of Object.entries(seiten)) {
      const quelle = lies(seite);
      for (const ort of orte) {
        expect(quelle, `${seite} ${ort}`).toContain(`tutorialVerweiseFuer('${ort}')`);
        expect(quelle, `${seite} ${ort}`).toContain(`ort="${ort}"`);
      }
    }
    // In Formularen öffnet der Verweis ein neues Fenster (Zwischenstand bleibt).
    for (const seite of FORMULARE.map((f) => path.join(path.dirname(f), 'page.tsx'))) {
      expect(lies(seite).match(/<TutorialHinweis[^>]*>/g)!.every((tag) => tag.includes('neuesFenster')), seite).toBe(true);
    }
  });
});
