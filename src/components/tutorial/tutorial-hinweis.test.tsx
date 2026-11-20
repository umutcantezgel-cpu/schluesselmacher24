import { readFileSync } from 'node:fs';
import path from 'node:path';

import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { tutorials } from '@/lib/data/defaults/tutorials';
import { TUTORIAL_ORTE } from '@/lib/tutorials/orte';
import { ersterSatz, tutorialsFuer, tutorialVerweise } from '@/lib/tutorials/tutorials';
import type { Tutorial, TutorialOrt } from '@/lib/types';

import { MIT_VIDEO_TEXT, NEUES_FENSTER_ZUSATZ, TUTORIAL_HINWEIS, TutorialHinweis } from './tutorial-hinweis';

/* Tutorial-Hinweis (FA-INHALT-01B): nur veröffentlichte, zugeordnete Tutorials; ohne Eintrag kein Markup; in
 * Formularen ein gewöhnlicher Verweis in neuem Fenster mit sichtbarem Zusatz; „mit Video“ nur mit Schalter. */

const JSON_STAND = JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'tutorials.json'), 'utf8')) as Tutorial[];
const START = tutorials();
const fotografieren = START.find((t) => t.id === 'schluessel-richtig-fotografieren')!;

afterEach(() => vi.unstubAllEnvs());

function eintrag(teil: Partial<Tutorial>): Tutorial {
  return { ...fotografieren, ...teil };
}

describe('TutorialHinweis', () => {
  it('ohne Eintrag kein Markup, auch keine Überschrift', () => {
    expect(renderToStaticMarkup(<TutorialHinweis verweise={[]} />)).toBe('');
    expect(renderToStaticMarkup(<TutorialHinweis verweise={[]} variante="verweis" neuesFenster />)).toBe('');
  });

  it('nicht veröffentlichte und nicht zugeordnete Tutorials erzeugen keinen Hinweis', () => {
    const offen = eintrag({ id: 'offen', slug: 'offen', published: false, places: ['schluessel-nach-code'] });
    const anderswo = eintrag({ id: 'anderswo', slug: 'anderswo', places: ['schliessanlagen'] });
    const verweise = tutorialVerweise(tutorialsFuer([offen, anderswo], 'schluessel-nach-code'), true);
    expect(verweise).toEqual([]);
    expect(renderToStaticMarkup(<TutorialHinweis verweise={verweise} />)).toBe('');
    // Auch eine unveröffentlichte Liste direkt bleibt ohne Verweis.
    expect(tutorialVerweise([offen], true)).toEqual([]);
  });

  it('Startbestand: Orte ohne veröffentlichten Eintrag zeigen nichts, die übrigen ihre Tutorials', () => {
    const erwartet: Record<string, string[]> = {
      'schluessel-nach-vorlage': ['schluessel-richtig-fotografieren'],
      'schluessel-nach-vorlage-fotos': ['schluessel-richtig-fotografieren'],
      'autoschluessel-fotos': ['autoschluessel-richtig-fotografieren'],
      'autoschluessel-fahrzeugschein': [],
      'schluessel-nach-code': ['so-funktioniert-schluessel-nach-code'],
      'schluessel-einschicken': ['schluessel-richtig-einschicken'],
      'gleichschliessende-zylinder': ['profilzylinder-messen', 'not-und-gefahrenfunktion', 'was-bedeutet-gleichschliessend'],
      'gleichschliessende-zylinder-messen': ['profilzylinder-messen'],
      'gleichschliessende-zylinder-funktion': ['not-und-gefahrenfunktion'],
      schliessanlagen: ['hs-und-ghs'],
      'autoschluessel-gehaeuse': [],
    };
    expect(Object.keys(erwartet).sort()).toEqual(TUTORIAL_ORTE.map((o) => o.value).sort());
    for (const [ort, slugs] of Object.entries(erwartet)) {
      const verweise = tutorialVerweise(tutorialsFuer(JSON_STAND, ort as TutorialOrt), false);
      expect(verweise.map((v) => v.slug), ort).toEqual(slugs);
      const html = renderToStaticMarkup(<TutorialHinweis verweise={verweise} ort={ort} />);
      if (slugs.length === 0) expect(html, ort).toBe('');
      for (const slug of slugs) expect(html, ort).toContain(`href="/tutorials/${slug}"`);
    }
  });

  it('kompakt: Titel als Frage, ein kurzer Satz, Verweis auf die Tutorial-Seite', () => {
    const [verweis] = tutorialVerweise([fotografieren], false);
    expect(verweis.satz).toBe(ersterSatz(fotografieren.answer));
    const html = renderToStaticMarkup(<TutorialHinweis verweise={[verweis]} ort="schluessel-nach-code" />);
    expect(html).toContain(TUTORIAL_HINWEIS);
    expect(html).toContain(fotografieren.title);
    expect(html).toContain(verweis.satz);
    expect(html).toContain('href="/tutorials/schluessel-richtig-fotografieren"');
    expect(html).not.toContain('target="_blank"');
    expect(html).not.toContain(MIT_VIDEO_TEXT);
    // Der Hinweis bringt kein Skript mit und nennt keine fremde Adresse.
    expect(html).not.toMatch(/<script|<iframe|youtube|google/i);
  });

  it('Verweis-Variante: kein zweiter Text neben einer vorhandenen Anleitung', () => {
    const [verweis] = tutorialVerweise([fotografieren], false);
    const html = renderToStaticMarkup(<TutorialHinweis verweise={[verweis]} variante="verweis" />);
    expect(html).toContain(fotografieren.title);
    expect(html).not.toContain(verweis.satz);
  });

  it('in Formularen: gewöhnlicher Verweis in neuem Fenster mit sichtbarem Zusatz', () => {
    const verweise = tutorialVerweise([fotografieren], false);
    const html = renderToStaticMarkup(<TutorialHinweis verweise={verweise} variante="verweis" neuesFenster />);
    expect(html).toContain('<a href="/tutorials/schluessel-richtig-fotografieren" target="_blank" rel="noopener"');
    expect(html).toContain(NEUES_FENSTER_ZUSATZ);
  });

  it('Kennzeichen „mit Video“ nur mit hinterlegtem Video und gesetztem Schalter', () => {
    const mitVideo = eintrag({ video: { youtubeId: 'aB3_dE-5gH7', title: 'Probe' } });
    expect(tutorialVerweise([mitVideo], false)[0].mitVideo).toBe(false);
    expect(tutorialVerweise([fotografieren], true)[0].mitVideo).toBe(false);
    expect(tutorialVerweise([eintrag({ video: { youtubeId: 'kurz' } })], true)[0].mitVideo).toBe(false);
    const [frei] = tutorialVerweise([mitVideo], true);
    expect(frei.mitVideo).toBe(true);
    expect(renderToStaticMarkup(<TutorialHinweis verweise={[frei]} />)).toContain(MIT_VIDEO_TEXT);
    expect(renderToStaticMarkup(<TutorialHinweis verweise={[frei]} />)).not.toContain('aB3_dE-5gH7');
  });

  it('nennt jedes Tutorial nur einmal, auch wenn es an zwei Orten zugeordnet ist', () => {
    const doppelt = [...tutorialsFuer(JSON_STAND, 'gleichschliessende-zylinder'), ...tutorialsFuer(JSON_STAND, 'gleichschliessende-zylinder-messen')];
    expect(tutorialVerweise(doppelt, false).map((v) => v.slug)).toEqual([
      'profilzylinder-messen',
      'not-und-gefahrenfunktion',
      'was-bedeutet-gleichschliessend',
    ]);
  });

  it('erster Satz: bis zum ersten Satzende, sonst der ganze Text', () => {
    expect(ersterSatz('Erst A. Dann B.')).toBe('Erst A.');
    expect(ersterSatz('  Ohne   Punkt  ')).toBe('Ohne Punkt');
    expect(ersterSatz('Was ist das? Eine Frage.')).toBe('Was ist das?');
    for (const t of START) expect(ersterSatz(t.answer).length, t.id).toBeGreaterThan(20);
  });
});
