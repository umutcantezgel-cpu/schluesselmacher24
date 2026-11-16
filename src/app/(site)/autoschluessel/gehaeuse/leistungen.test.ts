import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { STANDARD_VARIANTEN } from '@/lib/versand/varianten';
import type { EinsendeEinstellungen } from '@/lib/types';

import { GEHAEUSE_ABLAUF, GEHAEUSE_LEISTUNGEN, versandFuerElektronik } from './leistungen';

/* Dienstleistungen mit Einsendung (FA-SHOP-02B, Punkt 2; FA-14-04). */

const einstellungen = (varianten: EinsendeEinstellungen['varianten']) => ({ varianten }) as EinsendeEinstellungen;

describe('Gehäuse-Leistungen', () => {
  it('nennt die drei Leistungen in der Benennung der Vorgabe', () => {
    expect(GEHAEUSE_LEISTUNGEN.map((l) => l.titel)).toEqual([
      'Gehäusetausch im Einsendeservice',
      'Reparatur (Tasten, Mechanik)',
      'Umbau auf anderes Gehäuse (Customizing)',
    ]);
  });

  it('jede Leistung nennt ihre Bedingung; keine Zusage von Preis, Zahlungslink oder Frist (G9, A-036, R9)', () => {
    const texte = [...GEHAEUSE_LEISTUNGEN.flatMap((l) => [l.titel, l.satz, l.bedingung]), ...GEHAEUSE_ABLAUF];
    for (const l of GEHAEUSE_LEISTUNGEN) expect(l.bedingung.trim().length, l.titel).toBeGreaterThan(0);
    for (const text of texte) {
      expect(text).not.toMatch(/€|\d+\s?(tage|werktage|stunden)|zahlungslink|kostenlos|versichert|garantiert|immer/i);
      expect(text).not.toMatch(/[–—]| - /);
    }
  });

  it('der Ablauf beginnt mit Fahrzeugschein und drei Fotos und schickt erst nach der Rückmeldung (R13)', () => {
    expect(GEHAEUSE_ABLAUF[0]).toMatch(/drei Fotos.*Fahrzeugschein/);
    expect(GEHAEUSE_ABLAUF.at(-1)).toMatch(/Erst dann schicken Sie den Schlüssel ein/);
  });
});

describe('Versand für Schlüssel mit Elektronik (FA-SHOP-03, Empfehlung DHL Paket)', () => {
  it('mit den Startwerten: DHL Paket', () => {
    expect(versandFuerElektronik(einstellungen([...STANDARD_VARIANTEN]))?.kennung).toBe('dhl-paket');
    expect(versandFuerElektronik(undefined)?.kennung).toBe('dhl-paket');
  });

  it('nie eine abgeschaltete Variante und nie ein Sonderfall', () => {
    const aus = STANDARD_VARIANTEN.map((v) => (v.kennung === 'dhl-paket' ? { ...v, aktiv: false } : v));
    expect(versandFuerElektronik(einstellungen(aus))).toBeNull();
    const sonder = STANDARD_VARIANTEN.map((v) =>
      v.kennung === 'einschreiben-wert' ? { ...v, empfohlenFuer: ['originalschluessel' as const] } : { ...v, aktiv: v.kennung !== 'dhl-paket' },
    );
    expect(versandFuerElektronik(einstellungen(sonder))).toBeNull();
  });

  it('die Seite baut keinen zweiten Einsendeweg und verlinkt nicht das Einsendeformular', () => {
    const seite = readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
    expect(seite).not.toContain('/schluessel-einschicken/anmelden');
    expect(seite).toContain('VERPACKUNG_HINWEIS');
  });
});
