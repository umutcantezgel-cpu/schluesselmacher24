import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { tutorials } from '@/lib/data/defaults/tutorials';
import type { Tutorial } from '@/lib/types';

import { TUTORIAL_ORTE, istTutorialOrt } from './orte';
import {
  belegteSchritte,
  tutorialIndexierbar,
  tutorialIndexierbarBei,
  tutorialPfad,
  tutorialsFuer,
  VIDEO_EINBETTUNG_FREI,
  veroeffentlichteTutorials,
} from './tutorials';

/* Tutorials (FA-INHALT-01): Startbestand der zehn Themen des Inhabers, Rückfall wortgleich mit
 * content/tutorials.json, und die Regeln für Seite, Sitemap und Hinweis. */

const JSON_STAND = JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'tutorials.json'), 'utf8')) as Tutorial[];

/** Die zehn Themen im Wortlaut der Arbeitsanweisung, Abschnitt 21 (nur Satzzeichen wie dort). */
const THEMEN_DES_INHABERS = [
  'Wie fotografiere ich einen Schlüssel richtig?',
  'Wie fotografiere ich einen Autoschlüssel richtig?',
  'Wo finde ich die benötigten Angaben im Fahrzeugschein?',
  'Wie funktioniert Schlüssel nach Code?',
  'Wie sende ich meinen Schlüssel ein?',
  'Wie messe ich einen Profilzylinder?',
  'Was ist die Not- und Gefahrenfunktion?',
  'Was bedeutet gleichschließend?',
  'Was ist HS und GHS?',
  'Wie funktioniert ein Gehäuseumbau?',
];

function tutorial(extra: Partial<Tutorial> = {}): Tutorial {
  return {
    id: 'test',
    slug: 'test',
    title: 'Wie geht das?',
    answer: 'So geht das.',
    topic: 'schluessel-nach-vorlage',
    steps: [
      { heading: 'Erst', text: 'Das Erste.' },
      { heading: 'Dann', text: 'Das Zweite.' },
    ],
    places: ['schluessel-nach-vorlage'],
    order: 100,
    published: true,
    seo: { title: 'Test', description: 'Test', internalLinks: [] },
    updatedAt: '2026-11-16T00:00:00.000Z',
    ...extra,
  };
}

describe('Startbestand der Tutorials', () => {
  it('Rückfall tutorials() ist wortgleich mit content/tutorials.json', () => {
    expect(tutorials()).toEqual(JSON_STAND);
  });

  it('enthält die zehn Themen des Inhabers als Fragen, mit eindeutiger Kennung und Adresse', () => {
    expect(JSON_STAND.map((t) => t.title)).toEqual(THEMEN_DES_INHABERS);
    expect(new Set(JSON_STAND.map((t) => t.id)).size).toBe(10);
    expect(new Set(JSON_STAND.map((t) => t.slug)).size).toBe(10);
    for (const t of JSON_STAND) expect(t.slug, t.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('erfindet kein Video und verlinkt keines (R4)', () => {
    for (const t of JSON_STAND) expect(t.video, t.id).toBeUndefined();
    expect(JSON.stringify(JSON_STAND)).not.toMatch(/youtu|google/i);
  });

  it('lässt Fahrzeugschein und Gehäuseumbau unveröffentlicht: Der Bestand trägt sie nicht vollständig', () => {
    const offen = JSON_STAND.filter((t) => !t.published).map((t) => t.id);
    expect(offen).toEqual(['angaben-im-fahrzeugschein', 'gehaeuseumbau']);
  });

  it('jeder Eintrag hat eine Kurzantwort, Schritte und gültige Orte; Texte ohne Gedankenstrich', () => {
    for (const t of JSON_STAND) {
      expect(t.answer.trim().length, t.id).toBeGreaterThan(40);
      expect(belegteSchritte(t).length, t.id).toBeGreaterThanOrEqual(3);
      expect(t.places.length, t.id).toBeGreaterThan(0);
      for (const ort of t.places) expect(istTutorialOrt(ort), `${t.id}: ${ort}`).toBe(true);
      const texte = [t.title, t.answer, ...t.steps.flatMap((s) => [s.heading, s.text])];
      for (const text of texte) expect(text, t.id).not.toMatch(/[–—]| - /);
    }
  });

  it('verweist auf Ratgeber nur, wo es sie gibt, und nur auf vorhandene Seiten', () => {
    const ratgeber = (JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'guides.json'), 'utf8')) as Array<{ slug: string }>).map(
      (g) => g.slug,
    );
    for (const t of JSON_STAND.filter((x) => x.guideSlug)) expect(ratgeber, t.id).toContain(t.guideSlug);
    for (const link of JSON_STAND.flatMap((t) => t.seo.internalLinks)) {
      const ziel = link.href.split(/[?#]/)[0];
      if (ziel.startsWith('/ratgeber/')) expect(ratgeber).toContain(ziel.slice('/ratgeber/'.length));
    }
  });

  it('jede Zuordnung des Admins hat einen Ort mit Pfad', () => {
    for (const ort of TUTORIAL_ORTE) expect(ort.pfad, ort.value).toMatch(/^\/[a-z]/);
  });
});

describe('Regeln für Seite, Sitemap und Hinweis', () => {
  it('nicht veröffentlichte Tutorials erzeugen keine Seite und keinen Hinweis', () => {
    const offen = tutorial({ id: 'offen', slug: 'offen', published: false, places: ['schluessel-nach-code'] });
    const fertig = tutorial({ id: 'fertig', slug: 'fertig', places: ['schluessel-nach-code'] });
    expect(veroeffentlichteTutorials([offen, fertig]).map((t) => t.id)).toEqual(['fertig']);
    expect(tutorialsFuer([offen, fertig], 'schluessel-nach-code').map((t) => t.id)).toEqual(['fertig']);
    expect(tutorialsFuer([offen], 'schluessel-nach-code')).toEqual([]);
    expect(tutorialIndexierbar(offen)).toBe(false);
  });

  it('der Startbestand: veröffentlichte Hinweise nur für veröffentlichte Einträge', () => {
    expect(tutorialsFuer(JSON_STAND, 'autoschluessel-fahrzeugschein')).toEqual([]);
    expect(tutorialsFuer(JSON_STAND, 'autoschluessel-gehaeuse')).toEqual([]);
    expect(tutorialsFuer(JSON_STAND, 'autoschluessel-fotos').map((t) => t.id)).toEqual(['autoschluessel-richtig-fotografieren']);
  });

  it('sortiert nach Reihenfolge, dann Titel', () => {
    const a = tutorial({ id: 'a', title: 'B', order: 20 });
    const b = tutorial({ id: 'b', title: 'A', order: 20 });
    const c = tutorial({ id: 'c', title: 'C', order: 10 });
    expect(veroeffentlichteTutorials([a, b, c]).map((t) => t.id)).toEqual(['c', 'b', 'a']);
  });

  it('indexiert nur mit belegtem Inhalt (R3)', () => {
    expect(tutorialIndexierbar(tutorial())).toBe(true);
    expect(tutorialIndexierbar(tutorial({ steps: [{ heading: 'Nur', text: 'Ein Schritt.' }] }))).toBe(false);
    expect(tutorialIndexierbar(tutorial({ steps: [{ heading: 'Leer', text: ' ' }, { heading: 'Dann', text: 'Text.' }] }))).toBe(false);
    expect(tutorialIndexierbar(tutorial({ seo: { title: 'T', description: 'D', internalLinks: [], noindex: true } }))).toBe(false);
  });

  it('ein Doppel zum Ratgeber bleibt draußen, solange kein Video auf der Seite erscheint', () => {
    const doppel = tutorial({ guideSlug: 'zylinder-richtig-ausmessen' });
    const mitVideo = { ...doppel, video: { youtubeId: 'aB3_dE-5gH7', transcript: 'Erst Maß A, dann Maß B.' } };
    expect(tutorialIndexierbar(doppel)).toBe(false);
    // Teil A: Die Einbettung ist nicht freigeschaltet, sichtbar käme nur der Hinweissatz dazu (R3).
    expect(VIDEO_EINBETTUNG_FREI).toBe(false);
    expect(tutorialIndexierbar(mitVideo)).toBe(false);
    // Teil B schaltet die Einbettung frei: dann bringt das Video eigenen Wert.
    expect(tutorialIndexierbarBei(mitVideo, true)).toBe(true);
    expect(tutorialIndexierbarBei(doppel, true)).toBe(false);
    expect(tutorialIndexierbarBei({ ...doppel, video: { youtubeId: '' } }, true)).toBe(false);
  });

  it('Startbestand: Messen und HS/GHS verweisen auf den Ratgeber und sind ohne Video nicht indexiert', () => {
    const indexiert = JSON_STAND.filter(tutorialIndexierbar).map((t) => t.id);
    expect(indexiert).toEqual([
      'schluessel-richtig-fotografieren',
      'autoschluessel-richtig-fotografieren',
      'so-funktioniert-schluessel-nach-code',
      'schluessel-richtig-einschicken',
      'not-und-gefahrenfunktion',
      'was-bedeutet-gleichschliessend',
    ]);
  });

  it('bildet die Adresse unter /tutorials', () => {
    expect(tutorialPfad({ slug: 'profilzylinder-messen' })).toBe('/tutorials/profilzylinder-messen');
  });
});
