import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { profillinienPunkte } from '@/components/visual/profillinie';
import { NAV_AREAS } from '@/lib/navigation';
import type { AreaKey } from '@/lib/types';
import { AREA_THEMES, DEFAULT_AREA_THEME } from '@/lib/visual/area-theme';

/**
 * Vorschaubild für geteilte Links (Kür K-06): eine Werkstattzeichnung im Format
 * 1200 × 630 – Papier mit Raster, Bereichsname, der vorhandene Satz des Bereichs
 * und die Profillinie aus dem Namen. Farben kommen aus den Tokens in `globals.css`
 * und `area-theme.ts`, die Schrift aus dem lokalen Paket `@fontsource/ibm-plex-sans`;
 * zur Laufzeit wird nichts von außen geladen.
 */

export const OG_BREITE = 1200;
export const OG_HOEHE = 630;

/** Grundfarben der Seite, gelesen aus `:root` in `globals.css` (eine Quelle). */
const TOKEN_NAMEN = ['background', 'foreground', 'foreground-muted', 'border', 'border-strong'] as const;
type Token = (typeof TOKEN_NAMEN)[number];

export function tokensAusCss(css: string): Record<Token, string> {
  const ergebnis = {} as Record<Token, string>;
  for (const name of TOKEN_NAMEN) {
    const treffer = new RegExp(`--${name}:\\s*([^;]+);`).exec(css);
    if (!treffer) throw new Error(`Token --${name} fehlt in globals.css`);
    ergebnis[name] = treffer[1].trim();
  }
  return ergebnis;
}

/** HSL-Tripel „H S% L%“ als Farbwert für das Bild. */

function oklchToRgbString(tripel: string): string {
  const [l, c, h] = tripel.split(' ').map(Number);
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const lr = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const lb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const channel = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  const r = Math.max(0, Math.min(255, Math.round(channel(lr) * 255)));
  const g = Math.max(0, Math.min(255, Math.round(channel(lg) * 255)));
  const bVal = Math.max(0, Math.min(255, Math.round(channel(lb) * 255)));

  return `rgb(${r}, ${g}, ${bVal})`;
}

export function farbe(tripel: string): string {
  return oklchToRgbString(tripel);
}


export interface BildInhalt {
  /** Augenbraue über dem Titel. */
  augenbraue: string;
  titel: string;
  text?: string;
  /** Bereich für die Akzentfarbe; ohne Bereich gilt die Grundfarbe. */
  bereich?: AreaKey;
}

/** Inhalt eines Bereichsbilds aus der Navigation – nur vorhandene Texte. */
export function bereichsInhalt(bereich: AreaKey): BildInhalt {
  const eintrag = NAV_AREAS.find((a) => a.key === bereich);
  if (!eintrag) throw new Error(`Unbekannter Bereich: ${bereich}`);
  return { augenbraue: 'SCHLÜSSELMACHER24', titel: eintrag.label, text: eintrag.summary, bereich };
}

const RASTER = 30;

export async function vorschaubild(inhalt: BildInhalt): Promise<ImageResponse> {
  const wurzel = process.cwd();
  const [css, halbfett, normal] = await Promise.all([
    readFile(join(wurzel, 'src/app/(site)/globals.css'), 'utf8'),
    readFile(join(wurzel, 'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff')),
    readFile(join(wurzel, 'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff')),
  ]);
  const t = tokensAusCss(css);
  const thema = inhalt.bereich ? AREA_THEMES[inhalt.bereich] : DEFAULT_AREA_THEME;

  const { punkte, breite, hoehe } = profillinienPunkte(inhalt.titel, 6, 'gross');
  const pfad = `M${punkte.map(([x, y]) => `${x} ${y}`).join('L')}`;
  const linienBreite = 1040;
  const linienHoehe = Math.round((linienBreite / breite) * hoehe);

  const senkrecht = Array.from({ length: Math.floor(OG_BREITE / RASTER) }, (_, i) => (i + 1) * RASTER);
  const waagrecht = Array.from({ length: Math.floor(OG_HOEHE / RASTER) }, (_, i) => (i + 1) * RASTER);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: farbe(t.background),
          color: farbe(t.foreground),
          fontFamily: 'IBM Plex Sans',
          position: 'relative',
        }}
      >
        <svg
          width={OG_BREITE}
          height={OG_HOEHE}
          viewBox={`0 0 ${OG_BREITE} ${OG_HOEHE}`}
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          {senkrecht.map((x) => (
            <line key={`x${x}`} x1={x} y1={0} x2={x} y2={OG_HOEHE} stroke={farbe(t.border)} strokeWidth={1} />
          ))}
          {waagrecht.map((y) => (
            <line key={`y${y}`} x1={0} y1={y} x2={OG_BREITE} y2={y} stroke={farbe(t.border)} strokeWidth={1} />
          ))}
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 4,
              color: farbe(thema.strong),
            }}
          >
            <div style={{ width: 28, height: 3, background: farbe(thema.strong), marginRight: 16 }} />
            {inhalt.augenbraue}
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: inhalt.titel.length > 30 ? 76 : 92,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {inhalt.titel}
          </div>
          {inhalt.text && (
            <div
              style={{
                marginTop: 28,
                maxWidth: 900,
                fontSize: 36,
                fontWeight: 400,
                lineHeight: 1.35,
                textWrap: 'balance',
                color: farbe(t['foreground-muted']),
              }}
            >
              {inhalt.text}
            </div>
          )}
        </div>

        <svg
          width={linienBreite}
          height={linienHoehe + 8}
          viewBox={`-1 -1 ${breite + 2} ${hoehe + 2}`}
          style={{ display: 'flex' }}
        >
          <path
            d={pfad}
            fill="none"
            stroke={farbe(thema.accent)}
            strokeWidth={0.6}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      width: OG_BREITE,
      height: OG_HOEHE,
      fonts: [
        { name: 'IBM Plex Sans', data: normal, weight: 400, style: 'normal' },
        { name: 'IBM Plex Sans', data: halbfett, weight: 600, style: 'normal' },
      ],
    },
  );
}
