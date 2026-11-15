import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

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

  it('lässt Titel und SEO-Felder gegenüber den Startwerten unverändert', () => {
    const start = lies('startwerte', '2026-10-25', 'service-pages.json');
    for (const seite of json) {
      const alt = start.find((p) => p.id === seite.id);
      expect(alt, seite.id).toBeDefined();
      expect(seite.seo.description, seite.id).toBe(alt?.seo.description);
      if (seite.id !== 'sicherheit-smarte-funktionen') expect(seite.title, seite.id).toBe(alt?.title);
    }
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
