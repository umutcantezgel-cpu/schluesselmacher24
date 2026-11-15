import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { LOCK_SYSTEMS } from '@/components/schliessanlagen/system-erklaerung';
import type { PageContent } from '@/lib/types';
import { pages } from './content';

/* FA-INHALT-03C: sichtbare Kopftexte der Rubrikseiten Zylinder, Schließanlagen, Zutritt und
 * Service. Daten und Rückfall tragen denselben Wortlaut. */
const ROUTEN = [
  'gleichschliessende-zylinder',
  'schliessanlagen',
  'elektronische-zutrittsloesungen',
  'service-und-termin',
];

const lies = (...teile: string[]) =>
  JSON.parse(readFileSync(path.join(process.cwd(), 'content', ...teile), 'utf8')) as PageContent[];

const saetze = (text: string) =>
  text.split(/(?<=[.!?])\s+/).map((s) => s.split(/\s+/).filter(Boolean).length);

describe('Kopftexte der Rubrikseiten (FA-INHALT-03C)', () => {
  const json = lies('seo.json');
  const code = pages();

  it.each(ROUTEN)('„%s“: Daten und Rückfall gleich', (route) => {
    const daten = json.find((p) => p.route === route);
    const rueckfall = code.find((p) => p.route === route);
    expect(daten, route).toBeDefined();
    expect(rueckfall, route).toBeDefined();
    expect(rueckfall?.headline).toBe(daten?.headline);
    expect(rueckfall?.subline).toBe(daten?.subline);
    expect(rueckfall?.intro).toBe(daten?.intro);
  });

  it.each(ROUTEN)('„%s“: ohne Gedankenstrich, kein Satz über 25 Wörter, Unterzeile höchstens zwei Sätze', (route) => {
    const daten = json.find((p) => p.route === route);
    for (const text of [daten?.headline ?? '', daten?.subline ?? '', daten?.intro ?? '']) {
      expect(text).not.toMatch(/[–—]/);
      expect(Math.max(...saetze(text))).toBeLessThanOrEqual(25);
    }
    expect(saetze(daten?.subline ?? '').length).toBeLessThanOrEqual(2);
  });
});

describe('Anlagenarten nach der Tabelle des Inhabers (FA-16)', () => {
  const art = (id: string) => LOCK_SYSTEMS.find((s) => s.id === id);

  it('Z-Anlage: mehrere Einzelschlüssel öffnen gemeinsame Türen', () => {
    expect(art('z')?.explanation).toMatch(/^Bei einer Zentralschlossanlage, auch Zentralschließung genannt/);
    expect(art('z')?.explanation).toMatch(/mehrere verschiedene Einzelschlüssel/);
    expect(art('z')?.explanation).toMatch(/gemeinsamen Türen/);
  });

  it('HS-Anlage: feste Rechte je Person, Hauptschlüssel öffnet alle zugeordneten Türen', () => {
    expect(art('hs')?.explanation).toMatch(/feste Rechte/);
    expect(art('hs')?.explanation).toMatch(/Hauptschlüssel öffnet alle ihm zugeordneten Türen/);
  });

  it('GHS-Anlage: mehrere Bereiche und Stufen, Generalhauptschlüssel ganz oben', () => {
    expect(art('ghs')?.explanation).toMatch(/mehrere Bereiche und mehrere Stufen/);
    expect(art('ghs')?.explanation).toMatch(/Ganz oben steht der Generalhauptschlüssel/);
  });

  it('Erklärungen ohne Gedankenstrich und ohne Satz über 25 Wörter', () => {
    for (const s of LOCK_SYSTEMS) {
      for (const text of [s.explanation, s.info.body, s.opensWhat, s.expandable, ...s.bullets]) {
        expect(text, s.id).not.toMatch(/[–—]/);
        expect(Math.max(...saetze(text)), s.id).toBeLessThanOrEqual(25);
      }
    }
  });
});
