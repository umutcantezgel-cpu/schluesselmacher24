import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import seiten from '../../content/seo.json';

import { rubriken } from './data/defaults/rubriken';
import { NAV_AREAS } from './navigation';
import { hubKacheln, RUBRIK_ICONS, RUBRIK_UPLOADS, rubrikenNachGruppe, sortiereRubriken } from './rubriken';
import type { Rubrik } from './types';

const ALLE = rubriken();
const JSON_INHALT = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'rubriken.json'), 'utf8')) as Rubrik[];

/** Reihenfolge der Hub-Kacheln nach G-03; „Schlüssel einschicken“ ist seit FA-03 kein eigener Hauptzugang mehr. */
const G03 = [
  'autoschluessel',
  'motorradschluessel',
  'autoschluessel-gehaeuse',
  'schluessel-nach-code',
  'schluessel-nach-vorlage',
  'sperrschliessung',
  'schliessanlage',
  'elektronische-schliesssysteme',
  'sicherheitstechnik',
  'schluesseldienst-vor-ort',
  'beratung',
];

function texte(r: Rubrik): string[] {
  return [r.name, r.laienname, r.zusatz ?? '', r.erklaerung, ...r.ablauf.flatMap((s) => [s.titel, s.text])];
}

describe('Rubriken-Modell (G-03, G-11, KERN K-014)', () => {
  it('content/rubriken.json entspricht dem Startinhalt', () => {
    expect(JSON_INHALT).toEqual(ALLE);
  });

  it('der Hub führt die elf Rubriken aus G-03 in dieser Reihenfolge', () => {
    const hub = sortiereRubriken(ALLE).filter((r) => r.imHub).map((r) => r.id);
    expect(hub).toEqual(G03);
  });

  it('Kennungen sind eindeutig und Reihenfolgen steigen', () => {
    const ids = ALLE.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    const reihen = ALLE.map((r) => r.reihenfolge);
    expect(new Set(reihen).size).toBe(reihen.length);
  });

  it('jedes Symbol und jeder Upload stammt aus den Wertelisten', () => {
    for (const r of ALLE) {
      expect(RUBRIK_ICONS).toContain(r.icon);
      for (const s of r.ablauf) expect(RUBRIK_ICONS).toContain(s.icon);
      for (const u of r.pflichtUploads) expect(RUBRIK_UPLOADS).toContain(u);
    }
  });

  it('jedes Ziel ist eine Adresse der Seite', () => {
    for (const r of ALLE) expect(r.ziel).toMatch(/^\/[a-z0-9\-/]*$/);
  });

  it('jede Rubrik hat zwei bis sechs Ablaufschritte (G-10)', () => {
    for (const r of ALLE) {
      expect(r.ablauf.length).toBeGreaterThanOrEqual(2);
      expect(r.ablauf.length).toBeLessThanOrEqual(6);
    }
  });

  it('Kachelnamen bleiben kurz', () => {
    for (const r of ALLE) {
      expect(r.laienname.length).toBeLessThanOrEqual(40);
      expect((r.zusatz ?? '').length).toBeLessThanOrEqual(48);
      expect(r.erklaerung.length).toBeLessThanOrEqual(140);
    }
  });

  it('Texte ohne Gedankenstriche, Ausrufezeichen und Fragezeichen (G-48)', () => {
    for (const r of ALLE) {
      for (const t of texte(r)) {
        expect(t, `${r.id}: ${t}`).not.toMatch(/[–—!?]|\s-\s/);
      }
    }
  });

  it('Sperrschließung und Schließanlage tragen ihre Laienerklärung (G-09)', () => {
    const nach = new Map(ALLE.map((r) => [r.id, r]));
    expect(nach.get('sperrschliessung')?.zusatz).toBe('ein Schlüssel für alle Türen');
    expect(nach.get('schliessanlage')?.zusatz).toBeTruthy();
  });

  it('Wege, an deren Ende ein Fahrzeugschlüssel entsteht, verlangen den Fahrzeugschein (R13)', () => {
    for (const id of ['autoschluessel', 'motorradschluessel', 'autoschluessel-gehaeuse', 'transponder-kopie']) {
      const r = ALLE.find((x) => x.id === id);
      expect(r?.nachweis, id).toBe('fahrzeugschein');
      expect(r?.pflichtUploads, id).toContain('fahrzeugschein');
    }
    for (const id of ['schluessel-nach-code', 'schluessel-nach-vorlage', 'schluessel-einschicken']) {
      expect(ALLE.find((x) => x.id === id)?.nachweis, id).toBe('sicherungskarte');
    }
  });

  it('hubKacheln zeigt nur live geschaltete Hub-Rubriken in Reihenfolge', () => {
    const kacheln = hubKacheln(ALLE);
    expect(kacheln.every((r) => r.status === 'live' && r.imHub)).toBe(true);
    expect(kacheln.map((r) => r.id)).toEqual(G03.filter((id) => ALLE.find((r) => r.id === id)?.status === 'live'));
  });

  it('rubrikenNachGruppe folgt der Navigation aus G-08', () => {
    const gruppen = rubrikenNachGruppe(ALLE);
    expect(gruppen.map((g) => g.label)).toEqual(['Autoschlüssel', 'Schlüssel nach Code', 'Sperrschließungen', 'Schließanlagen', 'Mehr']);
    expect(gruppen[0].rubriken.map((r) => r.id)).toContain('autoschluessel');
    expect(gruppen.flatMap((g) => g.rubriken).every((r) => r.status === 'live')).toBe(true);
  });

  it('die Leistung „Schlüssel nach Foto“ gibt es nicht mehr, der Weg heißt „Schlüssel nach Vorlage“ (FA-03, A-046)', () => {
    const nachFoto = /nach[- ]foto|Foto prüfen lassen/i;
    for (const quelle of [ALLE, JSON_INHALT]) {
      for (const r of quelle) for (const t of texte(r)) expect(t, `${r.id}: ${t}`).not.toMatch(nachFoto);
    }
    expect(JSON.stringify(NAV_AREAS)).not.toMatch(nachFoto);
    expect(JSON.stringify(seiten)).not.toMatch(nachFoto);

    const vorlage = ALLE.find((r) => r.id === 'schluessel-nach-vorlage')!;
    expect(vorlage.name).toBe('Schlüssel nach Vorlage');
    expect(vorlage.laienname).toBe('Schlüssel nach Vorlage');
    expect(NAV_AREAS.find((a) => a.key === 'schluessel-nach-vorlage')?.label).toBe('Schlüssel nach Vorlage');
  });

  it('im Hub steht genau eine Kachel für den Weg nach Vorlage (FA-03)', () => {
    const kacheln = hubKacheln(ALLE).filter((r) => r.bereich === 'schluessel-nach-vorlage');
    expect(kacheln.map((r) => r.id)).toEqual(['schluessel-nach-vorlage']);
    expect(hubKacheln(JSON_INHALT).filter((r) => r.bereich === 'schluessel-nach-vorlage')).toHaveLength(1);
  });
});
