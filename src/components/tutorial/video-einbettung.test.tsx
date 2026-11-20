// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"disableIframePageLoading":true,"disableJavaScriptFileLoading":true,"disableCSSFileLoading":true}}
import { act } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { tutorials } from '@/lib/data/defaults/tutorials';
import { VIDEO_RAHMEN_HOST } from '@/lib/tutorials/freigabe';
import type { Tutorial, TutorialVideo } from '@/lib/types';

import { TutorialInhalt } from './tutorial-inhalt';
import { TRANSKRIPT_TITEL, VIDEO_DATEN_SATZ, VIDEO_DATENSCHUTZ_HREF, VIDEO_HINWEIS_TEXT, VideoHinweis } from './video-hinweis';
import { VIDEO_LADEN_TEXT, VideoRahmen, videoPlayerAdresse } from './video-rahmen';

/*
 * Video-Einbettung (FA-INHALT-01B). Die Tests führen den Klick in einem DOM aus (happy-dom), sie lesen nicht
 * nur den Quelltext. Rahmen werden nie geladen (`disableIframePageLoading`), und jede Netzanfrage fiele auf.
 *
 * - Ohne Schalter: der Satz aus Teil A, keine Einbettung.
 * - Mit Schalter vor dem Klick: Fassade aus eigenen Mitteln, im HTML keine Adresse von YouTube oder Google.
 * - Nach dem Klick: genau ein Rahmen, und der zeigt auf www.youtube-nocookie.com; der Fokus steht auf ihm.
 */

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Adressen von YouTube oder Google (nicht das Wort „YouTube“ im Satz). */
const FREMDE_ADRESSEN = /youtube\.com|youtube-nocookie|youtu\.be|ytimg|googlevideo|google\.[a-z]|googleapis|gstatic|doubleclick|\/\/[^"' ]*google/i;

const KENNUNG = 'aB3_dE-5gH7';
const VIDEO: TutorialVideo = {
  youtubeId: KENNUNG,
  title: 'Schlüssel richtig fotografieren',
  duration: '3:05',
  date: '2026-11-20',
  transcript: 'Erst die Vorderseite, dann die Rückseite.',
};
const fotografieren = tutorials().find((t) => t.id === 'schluessel-richtig-fotografieren')!;
const mitVideo: Tutorial = { ...fotografieren, video: VIDEO };

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

function knopf(): HTMLButtonElement {
  const k = [...behaelter.querySelectorAll('button')].find((b) => b.textContent?.includes(VIDEO_LADEN_TEXT));
  if (!k) throw new Error('Knopf „Video laden“ fehlt');
  return k;
}

describe('ohne Schalter (wie Teil A)', () => {
  it('zeigt nur den Satz, keinen Rahmen, keinen Knopf und keine Adresse', () => {
    for (const html of [
      renderToStaticMarkup(<VideoHinweis video={VIDEO} />),
      renderToStaticMarkup(<VideoHinweis video={VIDEO} freigegeben={false} />),
      renderToStaticMarkup(<TutorialInhalt tutorial={mitVideo} />),
    ]) {
      expect(html).toContain(VIDEO_HINWEIS_TEXT);
      expect(html).toContain(TRANSKRIPT_TITEL);
      expect(html).not.toContain(VIDEO_LADEN_TEXT);
      expect(html).not.toContain('data-video-rahmen');
      expect(html).not.toContain(KENNUNG);
      expect(html).not.toMatch(FREMDE_ADRESSEN);
      expect(html).not.toMatch(/<iframe/i);
    }
  });
});

describe('mit Schalter, vor dem Klick', () => {
  it('Fassade im Rahmen 16 zu 9, Knopf, Satz zur Datenübertragung mit Verweis; keine Adresse von YouTube oder Google', () => {
    const html = renderToStaticMarkup(<TutorialInhalt tutorial={mitVideo} videosFrei />);
    expect(html).toContain('data-video-rahmen');
    expect(html).toContain('aspect-video');
    expect(html).toContain(VIDEO_LADEN_TEXT);
    expect(html).toContain(VIDEO.title!);
    expect(html).toContain('3:05');
    expect(html).toContain('Dauer: 3 Minuten 5 Sekunden');
    expect(html).toContain(VIDEO_DATEN_SATZ);
    expect(html).toContain(`href="${VIDEO_DATENSCHUTZ_HREF}"`);
    expect(html).toContain(TRANSKRIPT_TITEL);
    expect(html).not.toContain(VIDEO_HINWEIS_TEXT);
    expect(html).not.toMatch(FREMDE_ADRESSEN);
    expect(html).not.toMatch(/<iframe|<script|<img[^>]+src="https?:/i);
    // Der Knopf steht vor den Schritten; das Video liegt über dem Text wie in Teil A.
    expect(html.indexOf(VIDEO_LADEN_TEXT)).toBeLessThan(html.indexOf(fotografieren.steps[0].text));
  });

  it('eigenes Vorschaubild aus der Medienablage statt der gezeichneten Fläche, nie ein Bild von YouTube', () => {
    const html = renderToStaticMarkup(
      <VideoHinweis video={{ ...VIDEO, thumbnail: { url: '/api/medien/file/vorschau.jpg', alt: 'Schlüssel auf hellem Grund' } }} freigegeben />,
    );
    expect(html).toContain('Schlüssel auf hellem Grund');
    expect(html).toContain('vorschau.jpg');
    expect(html).not.toMatch(FREMDE_ADRESSEN);
    // Ein fremdes Bild wird nicht gezeigt, die Fassade bleibt gezeichnet.
    const fremd = renderToStaticMarkup(<VideoHinweis video={{ ...VIDEO, thumbnail: { url: 'https://i.ytimg.com/vi/x/0.jpg', alt: 'x' } }} freigegeben />);
    expect(fremd).not.toMatch(FREMDE_ADRESSEN);
  });

  it('eine ungültige Kennung bettet nichts ein und zeigt auch nicht den Satz aus Teil A', () => {
    const html = renderToStaticMarkup(<VideoHinweis video={{ ...VIDEO, youtubeId: 'x"><script>' }} freigegeben />);
    expect(html).toBe('');
    expect(html).not.toContain(VIDEO_LADEN_TEXT);
    expect(html).not.toContain(VIDEO_HINWEIS_TEXT);
  });

  it('ohne Schalter bleibt es bei ungültiger Kennung beim Satz aus Teil A', () => {
    const html = renderToStaticMarkup(<VideoHinweis video={{ ...VIDEO, youtubeId: 'x"><script>' }} />);
    expect(html).toContain(VIDEO_HINWEIS_TEXT);
    expect(html).not.toContain('<script');
  });
});

describe('Klick auf „Video laden“', () => {
  it('lädt ohne Klick nichts; nach dem Klick genau den Rahmen von youtube-nocookie.com, Fokus auf dem Player', () => {
    act(() => {
      wurzel = createRoot(behaelter);
      wurzel.render(
        <VideoRahmen kennung={KENNUNG} titel={VIDEO.title!}>
          <p>Fassade</p>
        </VideoRahmen>,
      );
    });
    expect(behaelter.querySelectorAll('iframe')).toHaveLength(0);
    expect(behaelter.innerHTML).not.toMatch(FREMDE_ADRESSEN);
    expect(behaelter.textContent).toContain('Fassade');
    const rahmenVorher = behaelter.querySelector('[data-video-rahmen]')!;

    const k = knopf();
    expect(k.type).toBe('button');
    expect(k.className).toContain('min-h-touch');
    act(() => {
      k.focus();
      k.click();
    });

    const rahmen = behaelter.querySelectorAll('iframe');
    expect(rahmen).toHaveLength(1);
    const adresse = new URL(rahmen[0].getAttribute('src')!);
    expect(adresse.origin).toBe(VIDEO_RAHMEN_HOST);
    expect(adresse.origin).toBe('https://www.youtube-nocookie.com');
    expect(adresse.pathname).toBe(`/embed/${KENNUNG}`);
    expect(adresse.searchParams.get('autoplay')).toBe('1');
    expect(rahmen[0].getAttribute('title')).toBe(VIDEO.title);
    // Derselbe Rahmen 16 zu 9: keine Verschiebung im Layout; die Fassade ist ersetzt.
    expect(behaelter.querySelector('[data-video-rahmen]')).toBe(rahmenVorher);
    expect(rahmen[0].parentElement).toBe(rahmenVorher);
    expect(behaelter.textContent).not.toContain('Fassade');
    expect(behaelter.querySelector('button')).toBeNull();
    // Der Fokus fällt nicht auf die Seite, er steht auf dem Player (A-077).
    expect(document.activeElement).toBe(rahmen[0]);
    // Nur der Rahmen: keine eigene Anfrage, kein Skript, nichts im Speicher.
    expect(anfragen).toEqual([]);
    expect(behaelter.querySelectorAll('script')).toHaveLength(0);
    expect(document.cookie).toBe('');
    expect(window.localStorage.length).toBe(0);
  });

  it('auf der Seite: aus dem Server-HTML ohne Adresse wird nach dem Klick nur youtube-nocookie.com', () => {
    const html = renderToString(<VideoHinweis video={VIDEO} freigegeben />);
    expect(html).not.toMatch(FREMDE_ADRESSEN);
    behaelter.innerHTML = html;
    act(() => {
      wurzel = hydrateRoot(behaelter, <VideoHinweis video={VIDEO} freigegeben />);
    });
    expect(behaelter.querySelectorAll('iframe')).toHaveLength(0);
    act(() => knopf().click());
    const adressen = [...behaelter.querySelectorAll('[src],[href]')].map((el) => el.getAttribute('src') ?? el.getAttribute('href')!);
    const fremde = adressen.filter((a) => /^https?:/.test(a)).map((a) => new URL(a).origin);
    expect(fremde).toEqual(['https://www.youtube-nocookie.com']);
    // Satz und Transkript bleiben unter dem Player stehen.
    expect(behaelter.textContent).toContain(VIDEO_DATEN_SATZ);
    expect(behaelter.textContent).toContain(TRANSKRIPT_TITEL);
  });

  it('die Adresse des Players nimmt nur die Kennung auf', () => {
    expect(videoPlayerAdresse(KENNUNG)).toBe(`https://www.youtube-nocookie.com/embed/${KENNUNG}?autoplay=1`);
    expect(new URL(videoPlayerAdresse('a/../b?c')).origin).toBe('https://www.youtube-nocookie.com');
  });
});
