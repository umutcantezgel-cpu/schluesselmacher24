import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DatenschutzInhalt } from '@/app/(site)/rechtliches/datenschutz/datenschutz-inhalt';
import { echteEinstellungen } from '@/lib/rechtliches/test-hilfen';
import { dienstleister, verarbeitungen } from '@/lib/rechtliches/verarbeitungen';

import {
  VIDEO_RAHMEN_ERSATZ,
  VIDEO_RAHMEN_HOST,
  VIDEO_RAHMEN_MODUL,
  videoRahmenAlias,
  videosFreiBei,
  videosFreigegeben,
} from './freigabe';
import VORHER from './freigabe-vorher.json';

/*
 * Freigabe-Schalter der Video-Einbettung (FA-INHALT-01B). Ohne `SM24_VIDEOS=an` bleiben Sicherheitsrichtlinie,
 * Datenschutzerklärung (beide Fassungen, mit und ohne Statistik) und Verarbeitungsübersicht Zeichen für Zeichen
 * wie vor dem Paket (`freigabe-vorher.json`, erfasst vor der ersten Änderung). Mit Schalter öffnet die Richtlinie
 * genau den einen Rahmen, und die Datenschutzerklärung nennt YouTube (Entwurf zur Prüfung, R10).
 */

type Regel = { source: string; headers: Array<{ key: string; value: string }> };

async function csp(): Promise<string> {
  vi.resetModules();
  const { default: config } = await import('../../../next.config');
  const regeln = (await config.headers!()) as Regel[];
  return regeln.flatMap((r) => r.headers).find((h) => h.key === 'Content-Security-Policy')!.value;
}

const richtlinien = (wert: string) => new Map(wert.split('; ').map((teil) => [teil.split(' ')[0], teil] as const));

afterEach(() => vi.unstubAllEnvs());

describe('Schalter SM24_VIDEOS', () => {
  it('schaltet nur mit „an“ frei', () => {
    for (const wert of [undefined, '', 'aus', '1', 'true', 'ja', 'an-', ' a n ']) expect(videosFreiBei(wert), String(wert)).toBe(false);
    for (const wert of ['an', ' AN ', 'An']) expect(videosFreiBei(wert), wert).toBe(true);
    vi.stubEnv('SM24_VIDEOS', '');
    expect(videosFreigegeben()).toBe(false);
    vi.stubEnv('SM24_VIDEOS', 'an');
    expect(videosFreigegeben()).toBe(true);
  });
});

describe('Sicherheitsrichtlinie', () => {
  it('bleibt ohne Schalter Zeichen für Zeichen gleich (mit und ohne Statistik, Entwicklung und Produktion)', async () => {
    for (const [schluessel, erwartet] of Object.entries(VORHER.csp)) {
      const [umgebung, messId] = schluessel.split('|');
      vi.stubEnv('NODE_ENV', umgebung);
      vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', messId);
      vi.stubEnv('SM24_VIDEOS', '');
      expect(await csp(), schluessel).toBe(erwartet);
      vi.stubEnv('SM24_VIDEOS', 'aus');
      expect(await csp(), `${schluessel} aus`).toBe(erwartet);
    }
  }, 30_000);

  it('erlaubt mit Schalter nur den einen Rahmen von youtube-nocookie.com und öffnet sonst nichts', async () => {
    for (const [schluessel, vorher] of Object.entries(VORHER.csp)) {
      const [umgebung, messId] = schluessel.split('|');
      vi.stubEnv('NODE_ENV', umgebung);
      vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', messId);
      vi.stubEnv('SM24_VIDEOS', 'an');
      const mit = richtlinien(await csp());
      const ohne = richtlinien(vorher);
      expect(mit.get('frame-src'), schluessel).toBe(`frame-src 'self' ${VIDEO_RAHMEN_HOST}`);
      expect(VIDEO_RAHMEN_HOST).toBe('https://www.youtube-nocookie.com');
      // Jede andere Richtlinie bleibt wie ohne Schalter: kein Skript, keine Verbindung, kein Bild von YouTube.
      expect([...mit.keys()].filter((k) => k !== 'frame-src')).toEqual([...ohne.keys()]);
      for (const [name, wert] of ohne) expect(mit.get(name), `${schluessel} ${name}`).toBe(wert);
      expect([...mit.values()].filter((w) => /youtube|ytimg|googlevideo/.test(w))).toEqual([`frame-src 'self' ${VIDEO_RAHMEN_HOST}`]);
    }
  }, 30_000);
});

describe('Datenschutzerklärung und Verarbeitungsübersicht', () => {
  const settings = echteEinstellungen();

  it('ohne Schalter: beide Fassungen Zeichen für Zeichen wie vor dem Paket', () => {
    vi.stubEnv('SM24_VIDEOS', '');
    // Ohne Angabe gilt der Schalter des Servers (so rendert die Seite), ausdrücklich `false` ebenso.
    expect(renderToStaticMarkup(<DatenschutzInhalt settings={settings} />)).toBe(VORHER.datenschutz.ohneStatistik);
    expect(renderToStaticMarkup(<DatenschutzInhalt settings={settings} statistik />)).toBe(VORHER.datenschutz.mitStatistik);
    expect(renderToStaticMarkup(<DatenschutzInhalt settings={settings} videos={false} />)).toBe(VORHER.datenschutz.ohneStatistik);
    expect(renderToStaticMarkup(<DatenschutzInhalt settings={settings} statistik videos={false} />)).toBe(VORHER.datenschutz.mitStatistik);
  });

  it('ohne Schalter: Verarbeitungen und Dienstleister unverändert', () => {
    expect(JSON.parse(JSON.stringify(verarbeitungen(settings)))).toEqual(VORHER.verarbeitungen.ohneStatistik);
    expect(JSON.parse(JSON.stringify(verarbeitungen(settings, { statistik: true })))).toEqual(VORHER.verarbeitungen.mitStatistik);
    expect(JSON.parse(JSON.stringify(verarbeitungen(settings, { videos: false })))).toEqual(VORHER.verarbeitungen.ohneStatistik);
    expect(JSON.parse(JSON.stringify(dienstleister()))).toEqual(VORHER.dienstleister);
    expect(dienstleister({ statistik: true }).map((d) => d.id)).toEqual(['vercel', 'supabase', 'stripe', 'resend', 'google']);
  });

  it('mit Schalter: YouTube in Übersicht, Dienstleistern und Drittland; Videos nicht mehr unter „nicht eingebunden“', () => {
    vi.stubEnv('SM24_VIDEOS', 'an');
    for (const statistik of [false, true]) {
      const liste = verarbeitungen(settings, { statistik, videos: true });
      const eintrag = liste.find((e) => e.id === 'videos')!;
      expect(eintrag.rechtsgrundlage).toContain('Art. 6 Abs. 1 lit. a DSGVO');
      expect(eintrag.rechtsgrundlage).toContain('§ 25 Abs. 1 TDDDG');
      expect(eintrag.rechtsgrundlage).toContain('Video laden');
      expect(eintrag.drittland).toContain('USA');
      expect(dienstleister({ statistik, videos: true }).map((d) => d.id)).toContain('youtube');

      const html = renderToStaticMarkup(<DatenschutzInhalt settings={settings} statistik={statistik} />);
      expect(html).not.toContain('Karten, Videos oder Schriftarten-Dienste');
      expect(html).toContain('erweiterten Datenschutzmodus (youtube-nocookie.com)');
      expect(html).toContain('id="verarbeitung-videos"');
      expect(html).toContain('Google Ireland Limited (YouTube)');
      // Alles andere in Abschnitt 5 bleibt: keine Verbindung beim Aufruf, eigene Schriften.
      expect(html).toContain('Die Schriftarten liefern wir selbst aus');
    }
  });

  it('mit Schalter verweist der Absatz auf die richtige Nummer der Übersicht', () => {
    const liste = verarbeitungen(settings, { videos: true });
    const nummer = liste.findIndex((e) => e.id === 'videos') + 1;
    const html = renderToStaticMarkup(<DatenschutzInhalt settings={settings} videos />).replace(/<!-- -->/g, '');
    expect(html).toContain(`Einwilligung durch den Klick (siehe 2.${nummer})`);
  });
});

/* ---------- Alias ohne Schalter (FA-INHALT-01C) ---------------------------- */

describe('Alias für den Client-Baustein der Einbettung', () => {
  type Konfig = { turbopack?: { resolveAlias?: Record<string, string> }; webpack?: unknown };

  async function konfig(schalter: string): Promise<Konfig> {
    vi.resetModules();
    vi.stubEnv('SM24_VIDEOS', schalter);
    const { default: config } = await import('../../../next.config');
    return config as Konfig;
  }

  it('die reine Regel: Alias genau ohne Schalter, auf den Ersatz ohne Client-Baustein', () => {
    expect(videoRahmenAlias(false)).toEqual({ '@/components/tutorial/video-rahmen': './src/components/tutorial/video-rahmen-aus.tsx' });
    expect(videoRahmenAlias(true)).toEqual({});
    expect(VIDEO_RAHMEN_MODUL).toBe('@/components/tutorial/video-rahmen');
    expect(existsSync(path.join(process.cwd(), VIDEO_RAHMEN_ERSATZ))).toBe(true);
    expect(readFileSync(path.join(process.cwd(), VIDEO_RAHMEN_ERSATZ), 'utf8')).not.toMatch(/^'use client'/m);
  });

  it('next.config.ts: ohne Schalter (leer, „aus“, fehlend) gesetzt, mit Schalter nicht (Turbopack)', async () => {
    for (const wert of ['', 'aus', '1']) {
      const alias = (await konfig(wert)).turbopack?.resolveAlias;
      expect(alias, wert).toEqual({ [VIDEO_RAHMEN_MODUL]: VIDEO_RAHMEN_ERSATZ });
    }
    for (const wert of ['an', ' AN ']) {
      const turbopack = (await konfig(wert)).turbopack ?? {};
      expect(turbopack, wert).not.toHaveProperty('resolveAlias');
    }
  }, 30_000);

  it('next.config.ts: der Zweig für webpack setzt denselben Alias, nur ohne Schalter', () => {
    const quelle = readFileSync(path.join(process.cwd(), 'next.config.ts'), 'utf8');
    expect(quelle).toContain('const videoAlias = videoRahmenAlias(mitVideos);');
    expect(quelle).toContain('resolveAlias: videoAlias');
    expect(quelle).toMatch(/for \(const \[modul, ersatz\] of Object\.entries\(videoAlias\)\)[\s\S]{0,200}\[`\$\{modul\}\$`\]: path\.resolve\(dirname, ersatz\)/);
  });
});
