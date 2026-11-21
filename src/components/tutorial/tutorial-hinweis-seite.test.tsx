// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableIframePageLoading":true,"disableJavaScriptFileLoading":true,"disableCSSFileLoading":true}}
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { act } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VORHER from '@/lib/tutorials/hinweis-vorher.json';
import { TUTORIAL_ORTE } from '@/lib/tutorials/orte';
import { tutorialsFuer, tutorialVerweise } from '@/lib/tutorials/tutorials';
import type { Tutorial, TutorialOrt } from '@/lib/types';

import { MIT_VIDEO_TEXT, TutorialHinweis } from './tutorial-hinweis';
import { HINWEIS_VIDEO, TutorialHinweisSeite } from './tutorial-hinweis-seite';
import { VIDEO_DATEN_SATZ, VIDEO_DATENSCHUTZ_HREF } from './video-hinweis';
import { VIDEO_LADEN_TEXT } from './video-rahmen';

/*
 * Videos direkt auf Leistungsseiten (FA-INHALT-01C, FA-21-02).
 * - Ohne Schalter oder ohne Video ist das HTML der Hinweise Zeichen für Zeichen der Stand vor dem Paket
 *   (`hinweis-vorher.json`, erfasst vor der ersten Änderung), auf Leistungsseiten wie in Formularen.
 * - Mit Schalter und sichtbarem Video zeigt der Hinweis der Leistungsseite die Fassade: vor dem Klick keine Adresse
 *   von YouTube, nach dem Klick (im DOM ausgeführt) nur youtube-nocookie.com. Kein VideoObject.
 * - In Formularen bleibt es beim Verweis mit „mit Video“.
 */

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const FREMDE_ADRESSEN = /youtube\.com|youtube-nocookie|youtu\.be|ytimg|googlevideo|google\.[a-z]|googleapis|gstatic|doubleclick|\/\/[^"' ]*google/i;

const STAND = JSON.parse(readFileSync(path.join(process.cwd(), 'content', 'tutorials.json'), 'utf8')) as Tutorial[];
/** Wie bei der Erfassung: jedes veröffentlichte Tutorial mit einem erfundenen Video. */
const PROBE = STAND.map((t) =>
  t.published ? { ...t, video: { youtubeId: 'Pr0be_V1d3o', title: 'Probe', duration: '2:47', date: '2026-11-20' } } : t,
) as Tutorial[];
const HINWEISE = VORHER.hinweise as Record<string, string>;

const LANGER_TITEL = 'So fotografieren Sie Vorderseite, Rückseite und Spitze Ihres Schlüssels ohne Spiegelung und Schatten';

let behaelter: HTMLDivElement;
let wurzel: Root | null = null;
const anfragen: string[] = [];

beforeEach(() => {
  anfragen.length = 0;
  vi.stubGlobal('fetch', (eingabe: unknown) => {
    anfragen.push(String(eingabe));
    return Promise.reject(new Error('Netz im Test gesperrt'));
  });
  behaelter = document.createElement('div');
  document.body.appendChild(behaelter);
});

afterEach(() => {
  act(() => wurzel?.unmount());
  wurzel = null;
  behaelter.remove();
  vi.unstubAllGlobals();
});

function verweiseFuer(liste: Tutorial[], ort: TutorialOrt, videosFrei: boolean) {
  return tutorialVerweise(tutorialsFuer([...liste], ort), videosFrei);
}

describe('ohne Schalter oder ohne Video: Hinweis-HTML wie vor dem Paket', () => {
  it('der Stand ist vollständig erfasst (alle Orte, mit und ohne Probevideo, drei Darstellungen)', () => {
    expect(Object.keys(HINWEISE)).toHaveLength(TUTORIAL_ORTE.length * 2 * 3);
    expect(Object.values(HINWEISE).filter(Boolean).length).toBeGreaterThan(30);
  });

  it('Leistungsseiten und Formulare: Zeichen für Zeichen gleich, ohne Schalter auch mit Video', () => {
    for (const { value } of TUTORIAL_ORTE) {
      const ort = value as TutorialOrt;
      for (const [name, liste] of [['stand', STAND], ['probe', PROBE]] as const) {
        const verweise = verweiseFuer(liste, ort, false);
        expect(verweise.some((v) => 'video' in v), `${ort} ${name}`).toBe(false);
        const k = `${ort}|${name}`;
        expect(renderToStaticMarkup(<TutorialHinweisSeite verweise={verweise} ort={ort} className="mt-8" />), `${k} kompakt`).toBe(HINWEISE[`${k}|kompakt`]);
        expect(renderToStaticMarkup(<TutorialHinweisSeite verweise={verweise} variante="verweis" ort={ort} />), `${k} verweis`).toBe(HINWEISE[`${k}|verweis`]);
        expect(renderToStaticMarkup(<TutorialHinweis verweise={verweise} ort={ort} className="mt-8" />), `${k} kompakt`).toBe(HINWEISE[`${k}|kompakt`]);
        expect(renderToStaticMarkup(<TutorialHinweis verweise={verweise} variante="verweis" ort={ort} />), `${k} verweis`).toBe(HINWEISE[`${k}|verweis`]);
        expect(
          renderToStaticMarkup(<TutorialHinweis verweise={verweise} variante="verweis" neuesFenster ort={ort} className="mt-4" />),
          `${k} formular`,
        ).toBe(HINWEISE[`${k}|formular`]);
      }
    }
  });

  it('mit Schalter, aber ohne Video (Startbestand): ebenfalls unverändert', () => {
    for (const { value } of TUTORIAL_ORTE) {
      const ort = value as TutorialOrt;
      const verweise = verweiseFuer(STAND, ort, true);
      expect(renderToStaticMarkup(<TutorialHinweisSeite verweise={verweise} ort={ort} className="mt-8" />), ort).toBe(HINWEISE[`${ort}|stand|kompakt`]);
      expect(renderToStaticMarkup(<TutorialHinweisSeite verweise={verweise} variante="verweis" ort={ort} />), ort).toBe(HINWEISE[`${ort}|stand|verweis`]);
    }
  });
});

describe('Videodaten reisen nur mit, wenn das Video sichtbar ist (A-071)', () => {
  it('ohne Schalter oder mit ungültiger Kennung kein `video`; mit Schalter nur Kennung, Titel, Dauer, Vorschaubild', () => {
    const fotografieren = PROBE.find((t) => t.slug === 'schluessel-richtig-fotografieren')!;
    const mitTranskript = { ...fotografieren, video: { ...fotografieren.video!, transcript: 'Geheim nicht, aber nicht nötig.' } };
    expect(tutorialVerweise([mitTranskript], false)[0]).not.toHaveProperty('video');
    expect(tutorialVerweise([{ ...fotografieren, video: { youtubeId: 'kaputt' } }], true)[0]).not.toHaveProperty('video');
    expect(tutorialVerweise([mitTranskript], true)[0].video).toEqual({ youtubeId: 'Pr0be_V1d3o', title: 'Probe', duration: '2:47' });
  });
});

describe('mit Schalter und Video auf der Leistungsseite', () => {
  const verweise = verweiseFuer(PROBE, 'schluessel-nach-vorlage', true);

  it('vor dem Klick: Fassade, Knopf, Satz mit Verweis, darunter der Verweis auf die Schrittfolge; keine Adresse, kein VideoObject', () => {
    for (const html of [
      renderToStaticMarkup(<TutorialHinweisSeite verweise={verweise} variante="verweis" ort="schluessel-nach-vorlage" />),
      renderToStaticMarkup(<TutorialHinweisSeite verweise={verweise} ort="schluessel-nach-vorlage" />),
    ]) {
      expect(html).toContain(HINWEIS_VIDEO);
      expect(html).toContain('data-video-rahmen');
      expect(html).toContain('aspect-video');
      expect(html).toContain('max-w-[40rem]');
      expect(html).toContain(VIDEO_LADEN_TEXT);
      expect(html).toContain(VIDEO_DATEN_SATZ);
      expect(html).toContain(`href="${VIDEO_DATENSCHUTZ_HREF}"`);
      expect(html).not.toMatch(FREMDE_ADRESSEN);
      expect(html).not.toMatch(/<iframe|<script|VideoObject|ld\+json/i);
      // Darunter bleibt der Verweis auf die Schrittfolge.
      expect(html.indexOf(VIDEO_LADEN_TEXT)).toBeLessThan(html.indexOf('href="/tutorials/schluessel-richtig-fotografieren"'));
    }
  });

  it('nach dem Klick (im DOM ausgeführt): genau ein Rahmen, nur youtube-nocookie.com, Fokus auf dem Player, nichts gespeichert', () => {
    const element = <TutorialHinweisSeite verweise={verweise} variante="verweis" ort="schluessel-nach-vorlage" />;
    const html = renderToString(element);
    expect(html).not.toMatch(FREMDE_ADRESSEN);
    behaelter.innerHTML = html;
    act(() => {
      wurzel = hydrateRoot(behaelter, element);
    });
    expect(behaelter.querySelectorAll('iframe')).toHaveLength(0);
    const knopf = [...behaelter.querySelectorAll('button')].find((b) => b.textContent?.includes(VIDEO_LADEN_TEXT))!;
    expect(knopf.className).toContain('min-h-touch');
    act(() => {
      knopf.focus();
      knopf.click();
    });
    const rahmen = behaelter.querySelectorAll('iframe');
    expect(rahmen).toHaveLength(1);
    expect(new URL(rahmen[0].getAttribute('src')!).origin).toBe('https://www.youtube-nocookie.com');
    expect(rahmen[0].getAttribute('title')).toBe('Probe');
    const fremde = [...behaelter.querySelectorAll('[src],[href]')]
      .map((el) => el.getAttribute('src') ?? el.getAttribute('href')!)
      .filter((a) => /^https?:/.test(a))
      .map((a) => new URL(a).origin);
    expect(fremde).toEqual(['https://www.youtube-nocookie.com']);
    expect(document.activeElement).toBe(rahmen[0]);
    expect(anfragen).toEqual([]);
    expect(document.cookie).toBe('');
    expect(window.localStorage.length).toBe(0);
    // Der Verweis auf die Schrittfolge bleibt stehen.
    expect(behaelter.querySelector('a[href="/tutorials/schluessel-richtig-fotografieren"]')).not.toBeNull();
  });

  it('mehrere Videos stehen untereinander, jedes mit seinem Titel; ein eigenes Vorschaubild bekommt den Titel darüber', () => {
    const drei = verweiseFuer(PROBE, 'gleichschliessende-zylinder', true).map((v, i) => ({
      ...v,
      video: {
        ...v.video!,
        title: `${LANGER_TITEL} ${i}`,
        ...(i === 0 ? { thumbnail: { url: '/api/medien/file/vorschau.jpg', alt: 'Vorschau' } } : {}),
      },
    }));
    expect(drei).toHaveLength(3);
    const html = renderToStaticMarkup(<TutorialHinweisSeite verweise={drei} variante="verweis" ort="gleichschliessende-zylinder" />);
    expect(html.split(`${HINWEIS_VIDEO}=""`)).toHaveLength(4);
    expect(html.split('data-video-rahmen=""')).toHaveLength(4);
    for (let i = 0; i < 3; i++) expect(html).toContain(`${LANGER_TITEL} ${i}`);
    expect(html).toContain('vorschau.jpg');
    expect(html).not.toMatch(FREMDE_ADRESSEN);
  });

  it('in Formularen bleibt es beim Verweis in neuem Fenster mit „mit Video“, ohne Einbettung', () => {
    const fotos = verweiseFuer(PROBE, 'schluessel-nach-vorlage-fotos', true);
    expect(fotos[0].video).toBeDefined();
    const html = renderToStaticMarkup(<TutorialHinweis verweise={fotos} variante="verweis" neuesFenster ort="schluessel-nach-vorlage-fotos" />);
    expect(html).toContain(MIT_VIDEO_TEXT);
    expect(html).toContain('target="_blank"');
    expect(html).not.toContain(VIDEO_LADEN_TEXT);
    expect(html).not.toContain('data-video-rahmen');
    expect(html).not.toContain('Pr0be_V1d3o');
  });
});
