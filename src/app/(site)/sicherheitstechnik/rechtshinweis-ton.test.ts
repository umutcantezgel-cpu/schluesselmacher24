import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { servicePages } from '@/lib/data/defaults/service-pages';
import { HINWEIS_TON_UND_AUFZEICHNUNG } from './rechtshinweis-ton';

const ordner = path.dirname(new URL(import.meta.url).pathname);
const quelle = (datei: string) => readFileSync(path.join(ordner, datei), 'utf8');

describe('Sicherheitstechnik: Hinweis zu Ton und Aufzeichnung (FA-18-13, FA-18-14)', () => {
  it('nennt heimliche Aufzeichnung, Datenschutz und Strafrecht ohne Paragrafen', () => {
    expect(HINWEIS_TON_UND_AUFZEICHNUNG).toMatch(/heimliche Aufzeichnung/);
    expect(HINWEIS_TON_UND_AUFZEICHNUNG).toMatch(/Datenschutz und Strafrecht/);
    expect(HINWEIS_TON_UND_AUFZEICHNUNG).toMatch(/rechtmäßig/);
    expect(HINWEIS_TON_UND_AUFZEICHNUNG).not.toMatch(/§|StGB|–|—/);
  });

  it('steht auf der Bereichsseite, den Leistungsseiten und im Sicherheitscheck', () => {
    for (const datei of ['page.tsx', '[slug]/page.tsx', 'sicherheitscheck/sicherheitscheck.tsx']) {
      expect(quelle(datei), datei).toContain('{HINWEIS_TON_UND_AUFZEICHNUNG}');
    }
    expect(quelle('[slug]/page.tsx')).toMatch(/'videoueberwachung',/);
  });
});

describe('Smart-Home-Sicherheitsfunktionen (FA-18-09)', () => {
  it('trägt den neuen Namen unter der alten Adresse, gleich in JSON und Startwerten', () => {
    const json = JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'service-pages.json'), 'utf8')) as ReturnType<typeof servicePages>;
    const ausJson = json.find((p) => p.id === 'sicherheit-smarte-funktionen');
    const ausCode = servicePages().find((p) => p.id === 'sicherheit-smarte-funktionen');
    expect(ausJson?.slug).toBe('smarte-funktionen');
    expect(ausJson?.title).toBe('Smart-Home-Sicherheitsfunktionen');
    expect(ausJson?.seo.title).toBe('Smart-Home-Sicherheitsfunktionen');
    expect(ausCode).toEqual(ausJson);
  });
});
