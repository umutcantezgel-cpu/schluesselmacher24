import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { PROCESS_LABELS } from '@/lib/navigation';
import type { ServicePage } from '@/lib/types';
import { servicePages } from './service-pages';

const lies = (...teile: string[]) =>
  JSON.parse(readFileSync(path.join(process.cwd(), 'content', ...teile), 'utf8')) as ServicePage[];

describe('Leistungsseiten Tür- und Schließtechnik und Sicherheitstechnik (FA-INHALT-03B)', () => {
  const json = lies('service-pages.json');
  const code = servicePages();

  it('JSON und Rückfall tragen denselben Stand', () => {
    expect(code).toEqual(json);
  });

  it('lässt den sichtbaren Titel gegenüber den Startwerten unverändert', () => {
    const start = lies('startwerte', '2026-10-25', 'service-pages.json');
    for (const seite of json) {
      const alt = start.find((p) => p.id === seite.id);
      expect(alt, seite.id).toBeDefined();
      if (seite.id !== 'sicherheit-smarte-funktionen') expect(seite.title, seite.id).toBe(alt?.title);
    }
  });

  /*
   * SEO-Felder nach der Regel aus FA-SEO-01A (statt des festgehaltenen Startwerts vom 25.10.2026):
   * Titel samt Marke aus der Titelvorlage höchstens 60 Zeichen, Beschreibung 120 bis 160 Zeichen,
   * beides eindeutig und ohne Gedankenstrich. Die Beschreibung stützt sich auf Sichtbares (R1, R8):
   * Sie ist ein Auszug aus Kurztext und Punkten, oder jedes Hauptwort darin steht auch sichtbar auf
   * der Seite (Titel, Kurztext, Punkte, Knopf, Ablaufkasten). Verglichen wird ohne Großschreibung und
   * ohne Endung (-e, -n, -en, -s), damit „Türen“ zu „Tür“ und „Meldern“ zu „Melder“ passt.
   */
  describe('SEO-Felder (FA-SEO-01A)', () => {
    const MARKE = ' | SCHLÜSSELMACHER24';
    const FUNKTIONSWOERTER = new Set([
      'Wir', 'Sie', 'Ihr', 'Ihre', 'Ihren', 'Ihrem', 'Ihrer', 'Ihnen', 'Unser', 'Unsere',
      'Ein', 'Eine', 'Einen', 'Der', 'Die', 'Das', 'Den', 'Dem', 'Zur', 'Zum',
      'Mit', 'Für', 'Bei', 'Nach', 'Von', 'Dann', 'Dazu', 'Auch',
    ]);
    const stamm = (wort: string) => wort.toLowerCase().replace(/-$/, '').replace(/(en|e|n|s)$/, '');
    const hauptwoerter = (text: string) =>
      (text.match(/(?<![\p{L}-])\p{Lu}[\p{L}]*-?/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w));
    const sichtbar = (seite: ServicePage) => {
      const ablauf = PROCESS_LABELS[seite.process];
      return [seite.title, seite.summary, ...seite.bullets, seite.ctaLabel, ablauf.label, ablauf.hint].join(' ');
    };

    it('Rückfall trägt dieselben SEO-Felder wie die Daten', () => {
      expect(code.map((p) => [p.id, p.seo])).toEqual(json.map((p) => [p.id, p.seo]));
    });

    it('Titel mit Marke höchstens 60 Zeichen, Beschreibung 120 bis 160 Zeichen, ohne Gedankenstrich', () => {
      for (const seite of json) {
        expect(seite.seo.title, seite.id).not.toContain('SCHLÜSSELMACHER24');
        expect([...`${seite.seo.title}${MARKE}`].length, seite.id).toBeLessThanOrEqual(60);
        const laenge = [...seite.seo.description].length;
        expect(laenge, `${seite.id}: ${laenge}`).toBeGreaterThanOrEqual(120);
        expect(laenge, `${seite.id}: ${laenge}`).toBeLessThanOrEqual(160);
        for (const text of [seite.seo.title, seite.seo.description]) {
          expect(text, seite.id).not.toMatch(/[–—]| - /);
        }
      }
    });

    it('Titel und Beschreibungen sind eindeutig', () => {
      expect(new Set(json.map((p) => p.seo.title)).size).toBe(json.length);
      expect(new Set(json.map((p) => p.seo.description)).size).toBe(json.length);
    });

    it('jedes Hauptwort der Beschreibung steht sichtbar auf der Seite, oder sie ist ein Auszug daraus', () => {
      for (const seite of json) {
        const text = sichtbar(seite);
        if ([seite.summary, ...seite.bullets].join(' ').includes(seite.seo.description)) continue;
        const klein = text.toLowerCase();
        const fehlend = hauptwoerter(seite.seo.description).filter((w) => !klein.includes(stamm(w)));
        expect(fehlend, seite.id).toEqual([]);
      }
    });

    it('die Alarmtechnik verspricht kein „zuverlässiges“ Erkennen', () => {
      const alarm = json.find((p) => p.id === 'sicherheit-alarmtechnik');
      expect(alarm?.seo.description).not.toMatch(/zuverlässig/i);
    });
  });

  it('sichtbare Texte ohne Gedankenstriche, Kurztext höchstens zwei Sätze, höchstens vier Punkte', () => {
    for (const seite of json) {
      for (const text of [seite.summary, ...seite.bullets]) {
        expect(text, seite.id).not.toMatch(/[–—]| - /);
        for (const satz of text.split(/(?<=[.!?])\s+/)) {
          expect(satz.split(/\s+/).length, `${seite.id}: ${satz}`).toBeLessThanOrEqual(25);
        }
      }
      expect(seite.summary.split(/(?<=[.!?])\s+/).length, seite.id).toBeLessThanOrEqual(2);
      expect(seite.bullets.length, seite.id).toBeLessThanOrEqual(4);
    }
  });
});

describe('Satz zur verdeckten Audioüberwachung bleibt wörtlich (MA-40)', () => {
  const seite = (datei: string) =>
    readFileSync(path.join(process.cwd(), 'src', 'app', '(site)', 'sicherheitstechnik', datei), 'utf8')
      .replace(/\s+/g, ' ');

  it('steht auf der Bereichsseite und auf den Leistungsseiten', () => {
    expect(seite('page.tsx')).toContain(
      'Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an. Mikrofone und Aufzeichnung von Ton sind im Regelfall abgeschaltet.',
    );
    expect(seite('[slug]/page.tsx')).toContain(
      'Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an; Gegensprech- und Alarmfunktionen richten wir nur für zulässige Einsatzzwecke ein.',
    );
  });
});
