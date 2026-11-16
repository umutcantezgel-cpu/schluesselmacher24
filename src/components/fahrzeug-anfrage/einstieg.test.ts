import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/* Seiten ohne Formular dürfen das Anfrageformular nicht in ihr Skript-Bündel ziehen (FA-SEO-03B):
   Ein Serverbaustein, der aus einer Datei mit Client-Baustein importiert, hängt diesen an das Bündel
   jeder Seite, die ihn nutzt. Deshalb liegen Einstiegsseiten, Hinweise und Metadaten in ./einstieg
   und Rubrik-Werte in ./rubrik, beide ohne Client-Baustein; nur ./seiten bindet das Formular ein. */
const ORDNER = 'src/components/fahrzeug-anfrage';
const lies = (pfad: string) => readFileSync(pfad, 'utf8');
const importe = (quelle: string) => [...quelle.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);

/** Client-Bausteine dieses Ordners (beginnen mit 'use client'). */
const CLIENT = ['./formular', './kraftrad-suche', './zustand'];

describe('Fahrzeug-Anfrage: Seiten ohne Formular laden das Formular nicht', () => {
  it('die Liste der Client-Bausteine stimmt mit den Dateien überein', () => {
    for (const modul of CLIENT) {
      const datei = [`${ORDNER}/${modul.slice(2)}.tsx`, `${ORDNER}/${modul.slice(2)}.ts`].find((d) => {
        try { lies(d); return true; } catch { return false; }
      });
      expect(datei, modul).toBeDefined();
      expect(lies(datei as string).trimStart().startsWith("'use client'"), modul).toBe(true);
    }
  });

  it.each(['einstieg.tsx', 'rubrik.ts'])('%s bindet keinen Client-Baustein und nicht ./seiten ein', (datei) => {
    const quelle = lies(`${ORDNER}/${datei}`);
    expect(quelle).not.toContain("'use client'");
    for (const ziel of importe(quelle)) {
      expect(CLIENT, `${datei} importiert ${ziel}`).not.toContain(ziel);
      expect(ziel).not.toBe('./seiten');
    }
  });

  it.each([
    'src/app/(site)/e-scooter/page.tsx',
    'src/app/(site)/seniorenmobile/page.tsx',
    'src/app/(site)/fahrradschluessel/page.tsx',
    'src/app/(site)/roller-und-kleinstfahrzeuge/page.tsx',
    'src/app/(site)/motorradschluessel/page.tsx',
  ])('%s liest aus ./einstieg und nicht aus ./seiten', (seite) => {
    const ziele = importe(lies(seite));
    expect(ziele).toContain('@/components/fahrzeug-anfrage/einstieg');
    expect(ziele).not.toContain('@/components/fahrzeug-anfrage/seiten');
    expect(ziele).not.toContain('@/components/fahrzeug-anfrage/formular');
  });

  it('die Sitemap liest die Rubrik-Zuordnung aus ./rubrik', () => {
    const ziele = importe(lies('src/app/sitemap.ts'));
    expect(ziele).toContain('@/components/fahrzeug-anfrage/rubrik');
    expect(ziele).not.toContain('@/components/fahrzeug-anfrage/seiten');
  });

  it('./seiten gibt die Bausteine aus ./einstieg unverändert weiter', async () => {
    const [seiten, einstieg] = await Promise.all([import('./seiten'), import('./einstieg')]);
    expect(seiten.EinstiegSeite).toBe(einstieg.EinstiegSeite);
    expect(seiten.RubrikPausiertHinweis).toBe(einstieg.RubrikPausiertHinweis);
    expect(seiten.UnterlagenAusRegel).toBe(einstieg.UnterlagenAusRegel);
    expect(seiten.robotsFuer).toBe(einstieg.robotsFuer);
    expect(seiten.robotsNachStand).toBe(einstieg.robotsNachStand);
    expect(seiten.seitenMetadata).toBe(einstieg.seitenMetadata);
  }, 30_000);
});
