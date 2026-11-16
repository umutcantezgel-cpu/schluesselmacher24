import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import seiten from '../../../../../content/seo.json';
import servicesJson from '../../../../../content/car-key-services.json';
import { pages } from '@/lib/data/defaults/content';
import type { CarKeyService, KeyKind } from '@/lib/types';

import { leistungAusAdresse, leistungPasst, vorgewaehlteLeistung } from './leistung-vorwahl';

/*
 * Vorgewählte Leistung im Termin-Assistenten (FA-05-09, FA-05-07): Die Leistungsseiten führen mit
 * `?leistung=` in den Assistenten, und die Seite übernimmt die Leistung, sobald die Schlüsselart passt.
 * Erfundene Leistungen und abgeschaltete fallen weg.
 */

const LEISTUNGEN = servicesJson as CarKeyService[];
const ARTEN: KeyKind[] = ['mechanisch', 'funk', 'klappschluessel', 'smart-key', 'keyless'];

/** Wert von `?leistung=` in einer Adresse, wie die Seite ihn liest (erster Wert). */
const leistungDer = (href: string) => new URL(href, 'https://beispiel.invalid').searchParams.get('leistung') ?? '';

/** Ziel des Hauptknopfs („primary“) einer Leistungsseite, gelesen aus dem Quelltext. */
function hauptknopf(route: string): string {
  const datei = path.join(process.cwd(), 'src', 'app', '(site)', ...route.split('/'), 'page.tsx');
  const text = readFileSync(datei, 'utf8');
  const direkt = /primary:\s*\{\s*href:\s*'([^']+)'/.exec(text)?.[1];
  if (direkt) return direkt;
  const name = /primary:\s*\{\s*href:\s*([A-Z_]+)\b/.exec(text)?.[1];
  const wert = name ? new RegExp(`const ${name}\\s*=\\s*'([^']+)'`).exec(text)?.[1] : undefined;
  if (!wert) throw new Error(`${route}: Hauptknopf nicht gefunden`);
  return wert;
}

describe('Leistung aus der Adresse (FA-05-09)', () => {
  it('nimmt nur aktive gepflegte Leistungen an', () => {
    expect(leistungAusAdresse('fahrzeugoeffnung', LEISTUNGEN)).toBe('fahrzeugoeffnung');
    expect(leistungAusAdresse(' ersatz-bei-verlust ', LEISTUNGEN)).toBe('ersatz-bei-verlust');
    expect(leistungAusAdresse('', LEISTUNGEN)).toBe('');
    expect(leistungAusAdresse('gratis-schluessel', LEISTUNGEN)).toBe('');
    const abgeschaltet = LEISTUNGEN.map((s) => (s.id === 'fahrzeugoeffnung' ? { ...s, active: false } : s));
    expect(leistungAusAdresse('fahrzeugoeffnung', abgeschaltet)).toBe('');
  });

  it('wählt die Leistung, sobald die Schlüsselart dazu passt, sonst keine', () => {
    for (const art of ARTEN) expect(vorgewaehlteLeistung('fahrzeugoeffnung', LEISTUNGEN, art, null), art).toBe('fahrzeugoeffnung');
    expect(vorgewaehlteLeistung('fahrzeugoeffnung', LEISTUNGEN, '', null)).toBe('');
    // Programmierung gibt es für rein mechanische Schlüssel nicht.
    expect(vorgewaehlteLeistung('programmierung', LEISTUNGEN, 'mechanisch', 1)).toBe('');
    expect(vorgewaehlteLeistung('', LEISTUNGEN, 'funk', 1)).toBe('');
  });

  it('ein Zweitschlüssel ohne funktionierenden Schlüssel entfällt (wie die Auswahl im Schritt „Leistung“)', () => {
    expect(vorgewaehlteLeistung('zweitschluessel', LEISTUNGEN, 'funk', 0)).toBe('');
    expect(vorgewaehlteLeistung('zweitschluessel', LEISTUNGEN, 'funk', 1)).toBe('zweitschluessel');
    const zweit = LEISTUNGEN.find((s) => s.id === 'zweitschluessel')!;
    expect(leistungPasst(zweit, 'funk', null)).toBe(true);
    expect(leistungPasst(zweit, 'funk', 0)).toBe(false);
  });
});

describe('Die Leistungsseiten wählen ihre Leistung im Assistenten vor (FA-05-07, FA-05-09)', () => {
  it.each([
    ['autoschluessel/fahrzeugoeffnung', 'fahrzeugoeffnung'],
    ['autoschluessel/schluesselverlust', 'ersatz-bei-verlust'],
  ])('%s: Hauptknopf führt in den Assistenten mit „%s“', (route, leistung) => {
    const href = hauptknopf(route);
    expect(href.split('?')[0]).toBe('/autoschluessel/anfrage');
    const gewaehlt = leistungAusAdresse(leistungDer(href), LEISTUNGEN);
    expect(gewaehlt).toBe(leistung);
    for (const art of ARTEN) expect(vorgewaehlteLeistung(gewaehlt, LEISTUNGEN, art, null), art).toBe(leistung);
  });

  it('Fahrzeugöffnung: kein Weg mehr über die allgemeine Anfrage, Daten und Rückfall gleich', () => {
    const daten = (seiten as Array<{ route: string; seo: { internalLinks: Array<{ href: string; label: string }> } }>)
      .find((s) => s.route === 'autoschluessel/fahrzeugoeffnung')!;
    const rueckfall = pages().find((s) => s.route === 'autoschluessel/fahrzeugoeffnung')!;
    expect(rueckfall.seo.internalLinks).toEqual(daten.seo.internalLinks);
    const verweis = daten.seo.internalLinks.find((l) => l.href.startsWith('/autoschluessel/anfrage'));
    expect(verweis).toEqual({ href: '/autoschluessel/anfrage?leistung=fahrzeugoeffnung', label: 'Termin anfragen' });
    expect(leistungAusAdresse(leistungDer(verweis!.href), LEISTUNGEN)).toBe('fahrzeugoeffnung');
    for (const link of daten.seo.internalLinks) expect(link.href).not.toContain('thema=fahrzeugoeffnung');
    expect(hauptknopf('autoschluessel/fahrzeugoeffnung')).not.toContain('/service-und-termin/anfrage');
  });
});
