import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import servicesJson from '../../../content/car-key-services.json';
import rubrikenJson from '../../../content/rubriken.json';
import type { CarKeyService, Rubrik } from '@/lib/types';
import { carKeyServices } from './defaults/pricing';
import { rubriken } from './defaults/rubriken';

/*
 * Zusagen mit Bedingung (FA-14-11): „Optischer Umbau nur dort anbieten, wo Elektronik, Transponder, Tasten
 * und Bart technisch passend übernommen werden können.“ Die Stellen, die das früher ohne Bedingung
 * zusagten, tragen jetzt die Bedingung; Daten und Rückfall lauten gleich.
 */

const BEDINGUNG_ELEKTRONIK = 'Die Elektronik bleibt, wenn sie in das neue Gehäuse passt.';
const BEDINGUNG_RUECKVERSAND = 'Passt alles, kommt Ihr Schlüssel im neuen Gehäuse zurück.';
/** Unbedingte Zusagen, die nicht wiederkommen sollen. */
const UNBEDINGT = /Elektronik bleibt erhalten|^Ihr Schlüssel kommt im neuen Gehäuse zurück/;

const gehaeuseLeistung = (liste: CarKeyService[]) => liste.find((s) => s.id === 'gehaeuse-reparatur');
const rueckversand = (liste: Rubrik[]) => liste.find((r) => r.id === 'autoschluessel-gehaeuse')?.ablauf?.find((s) => s.titel === 'Rückversand');

describe('Zusagen mit Bedingung im Autoschlüsselbereich (FA-14-11)', () => {
  it('Leistung „Gehäuse, Tasten und Batterie“: Elektronik nur, wenn sie passt (Daten und Rückfall gleich)', () => {
    const daten = gehaeuseLeistung(servicesJson as CarKeyService[]);
    const rueckfall = gehaeuseLeistung(carKeyServices());
    expect(daten?.description).toContain(BEDINGUNG_ELEKTRONIK);
    expect(rueckfall?.description).toBe(daten?.description);
    expect(daten?.description).not.toMatch(UNBEDINGT);
  });

  it('Rubrik Gehäuse, Schritt „Rückversand“: nur, wenn alles passt (Daten und Rückfall gleich)', () => {
    const daten = rueckversand(rubrikenJson as unknown as Rubrik[]);
    const rueckfall = rueckversand(rubriken());
    expect(daten?.text).toBe(BEDINGUNG_RUECKVERSAND);
    expect(rueckfall?.text).toBe(BEDINGUNG_RUECKVERSAND);
  });

  it('Übersicht Autoschlüssel: Glossar „Gehäuse, Tasten und Batterie“ mit Bedingung', () => {
    const datei = path.join(process.cwd(), 'src', 'app', '(site)', 'autoschluessel', 'page.tsx');
    const text = readFileSync(datei, 'utf8');
    expect(text).toContain('Die vorhandene Elektronik bleibt, wenn sie in das neue Gehäuse passt.');
    expect(text).not.toMatch(UNBEDINGT);
  });

  it('keine Leistung und kein Ablaufschritt sagt die Elektronik oder den Rückversand ohne Bedingung zu', () => {
    const texte = [
      ...(servicesJson as CarKeyService[]).map((s) => s.description),
      ...carKeyServices().map((s) => s.description),
      ...[...(rubrikenJson as unknown as Rubrik[]), ...rubriken()].flatMap((r) => [r.erklaerung, ...(r.ablauf ?? []).map((s) => s.text)]),
    ];
    for (const text of texte) expect(text ?? '').not.toMatch(UNBEDINGT);
  });

  // Nachtrag der Abnahme (Befund der Gegenprüfung): auch die Leistungsseiten selbst, etwa Funkschlüssel.
  it('Leistungsseiten im Autoschlüsselbereich sagen die Elektronik nicht ohne Bedingung zu', () => {
    const wurzel = path.join(process.cwd(), 'src', 'app', '(site)', 'autoschluessel');
    const dateien: string[] = [];
    const sammeln = (ordner: string) => {
      for (const name of readdirSync(ordner)) {
        const pfad = path.join(ordner, name);
        if (statSync(pfad).isDirectory()) sammeln(pfad);
        else if (/\.tsx?$/.test(name) && !/\.test\./.test(name)) dateien.push(pfad);
      }
    };
    sammeln(wurzel);
    expect(dateien.length).toBeGreaterThan(10);
    for (const datei of dateien) {
      const text = readFileSync(datei, 'utf8');
      expect(text, path.relative(process.cwd(), datei)).not.toMatch(/Elektronik bleibt (dann )?erhalten/);
    }
    const funk = readFileSync(path.join(wurzel, 'funkschluessel', 'page.tsx'), 'utf8');
    expect(funk).toContain('wenn sie in das neue Gehäuse passt');
  });
});
