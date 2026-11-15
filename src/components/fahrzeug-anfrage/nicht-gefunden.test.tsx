import { readFileSync } from 'node:fs';
import path from 'node:path';

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { FahrzeugSuche } from '@/components/autoschluessel/fahrzeug-suche';
import { anfrageHref } from '@/components/autoschluessel/fahrzeug-ziel';
import { ERREICHBARKEIT_STANDARD } from '@/lib/erreichbarkeit';

import { KraftradSuche } from './kraftrad-suche';
import { FahrzeugNichtGefunden, NICHT_GEFUNDEN_KENNUNG } from './nicht-gefunden';

/* „Fahrzeug nicht gefunden?“ steht an jeder Fahrzeugsuche (FA-KERN-02B, FA Abschnitte 06 und 26). */

const BLOCK = `data-block="${NICHT_GEFUNDEN_KENNUNG}"`;
const quelle = (datei: string) => readFileSync(path.join(process.cwd(), 'src', 'app', '(site)', datei), 'utf8');

describe('Block „Fahrzeug nicht gefunden?“', () => {
  it('führt in die Anfrage mit Unterlagen und bietet die Telefonnummer an', () => {
    const html = renderToStaticMarkup(<FahrzeugNichtGefunden telefon="06441 123456" erreichbarkeit={ERREICHBARKEIT_STANDARD} />);
    expect(html).toContain(BLOCK);
    expect(html).toContain('Fahrzeug nicht gefunden?');
    expect(html).toContain('href="/autoschluessel/fahrzeug-nicht-gefunden"');
    expect(html).toContain('Fahrzeugschein, drei Fotos Ihres Schlüssels und eine kurze Beschreibung');
    expect(html).toContain('href="tel:+4964411234');
    expect(html).toContain('24 Stunden erreichbar.');
    expect(html).not.toContain('service-und-termin');
  });

  it('bleibt ohne Telefonnummer ein vollständiger Weg', () => {
    const html = renderToStaticMarkup(<FahrzeugNichtGefunden />);
    expect(html).toContain('href="/autoschluessel/fahrzeug-nicht-gefunden"');
    expect(html).not.toContain('tel:');
  });

  it('steht fest unter der Fahrzeugsuche', () => {
    const html = renderToStaticMarkup(<FahrzeugSuche katalogAdresse="/autoschluessel/anfrage/fahrzeuge" makes={[]} onWahl={() => {}} telefon="06441 123456" />);
    expect(html).toContain(BLOCK);
    expect(html).toContain('tel:+4964411234');
    // Wer ihn selbst am Ende des Schritts zeigt, schaltet ihn hier ab.
    expect(renderToStaticMarkup(<FahrzeugSuche katalogAdresse="/x" makes={[]} onWahl={() => {}} nichtGefunden={false} />)).not.toContain(BLOCK);
  });

  it('steht in der Motorradsuche (Kraftradsuche von Motorrad und Roller)', () => {
    const html = renderToStaticMarkup(<KraftradSuche onWahl={() => {}} telefon="06441 123456" />);
    expect(html).toContain(BLOCK);
    expect(html).toContain('Tragen Sie Hersteller und Typ unten selbst ein');
    expect(html).toContain('href="/autoschluessel/fahrzeug-nicht-gefunden"');
    // Roller: kein Verweis in die Anfrage „nicht gefunden“ (verlangt immer einen Fahrzeugschein), Telefon bleibt.
    const roller = renderToStaticMarkup(<KraftradSuche onWahl={() => {}} telefon="06441 123456" nichtGefundenHref={null} erreichbarkeit={ERREICHBARKEIT_STANDARD} />);
    expect(roller).toContain(BLOCK);
    expect(roller).not.toContain('href="/autoschluessel/fahrzeug-nicht-gefunden"');
    expect(roller).toContain('tel:+4964411234');
    expect(roller).toContain('24 Stunden erreichbar.');
  });

  it('steht im Fahrzeugschritt des Termin-Assistenten, auf der Markenübersicht und jeder Markenseite', () => {
    const assistent = quelle('autoschluessel/anfrage/assistent.tsx');
    expect(assistent).toMatch(/<FahrzeugNichtGefunden href=\{ANFRAGE_OHNE_MARKE\} telefon=\{werkstatt\?\.telefon\} erreichbarkeit=\{erreichbarkeit\} \/>/);
    expect(assistent).toContain('const ANFRAGE_OHNE_MARKE = anfrageHref();');
    // Mit Telefon und Erreichbarkeit aus den Einstellungen; je Seite genau ein Ausweg.
    for (const datei of ['autoschluessel/marken/page.tsx', 'autoschluessel/marken/[make]/page.tsx']) {
      const text = quelle(datei);
      expect(text, datei).toMatch(/<FahrzeugNichtGefunden\s+telefon=\{kontakt\(settings\.company\)\.telefon\}\s+erreichbarkeit=\{erreichbarkeit\(settings\)\}/);
      expect(text.match(/<FahrzeugNichtGefunden\b/g) ?? [], datei).toHaveLength(1);
      expect(text, datei).not.toMatch(/title="(Modell|Marke) nicht dabei\?"|Fahrzeug nicht gefunden\?\{' '\}/);
    }
    // Die Motorradanfrage nutzt das gemeinsame Formular mit der Kraftradsuche.
    expect(quelle('motorradschluessel/anfrage/page.tsx')).toContain('<FahrzeugAnfrageInhalt klasse="motorrad" />');
  });

  it('kein Verweis führt mehr mit einer Fahrzeug-Schlüsselanfrage in die allgemeine Anfrage', () => {
    expect(anfrageHref()).toBe('/autoschluessel/fahrzeug-nicht-gefunden');
    for (const datei of ['autoschluessel/marken/page.tsx', 'autoschluessel/marken/[make]/page.tsx', 'autoschluessel/anfrage/assistent.tsx']) {
      expect(quelle(datei), datei).not.toContain('/service-und-termin/anfrage?thema=autoschluessel');
    }
  });
});
