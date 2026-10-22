import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import {
  AREA_THEMES,
  DEFAULT_AREA_THEME,
  areaCssVariables,
} from './src/lib/visual/area-theme';

/**
 * SCHLÜSSELMACHER24 — Tailwind-Konfiguration
 * Farben werden ausschließlich aus den semantischen CSS-Variablen in
 * `src/app/globals.css` gespeist. Keine Markenfarbe steht fest im Code.
 */
const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  /* `hover:` und `group-hover:` nur bei feinem Zeiger (KERN K-007): kein Kleben nach Antippen. */
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      fontFamily: {
        /* Plex Sans und Mono: hinter dem Ersatz von next/font der eigene für Systeme ohne Arial (globals.css, E7-L-43) */
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', "'SM24 Ersatz Plex Sans'", 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', "'SM24 Ersatz Plex Mono'", 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        surface: {
          DEFAULT: 'oklch(var(--surface) / <alpha-value>)',
          muted: 'oklch(var(--surface-muted) / <alpha-value>)',
          sunken: 'oklch(var(--surface-sunken) / <alpha-value>)',
          ink: 'oklch(var(--surface-ink) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'oklch(var(--foreground) / <alpha-value>)',
          muted: 'oklch(var(--foreground-muted) / <alpha-value>)',
          subtle: 'oklch(var(--foreground-subtle) / <alpha-value>)',
          inverse: 'oklch(var(--foreground-inverse) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'oklch(var(--border) / <alpha-value>)',
          strong: 'oklch(var(--border-strong) / <alpha-value>)',
        },
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          hover: 'oklch(var(--primary-hover) / <alpha-value>)',
          soft: 'oklch(var(--primary-soft) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          soft: 'oklch(var(--accent-soft) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'oklch(var(--success) / <alpha-value>)',
          soft: 'oklch(var(--success-soft) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'oklch(var(--warning) / <alpha-value>)',
          soft: 'oklch(var(--warning-soft) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'oklch(var(--danger) / <alpha-value>)',
          soft: 'oklch(var(--danger-soft) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'oklch(var(--info) / <alpha-value>)',
          soft: 'oklch(var(--info-soft) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        area: {
          DEFAULT: 'oklch(var(--area) / <alpha-value>)',
          strong: 'oklch(var(--area-strong) / <alpha-value>)',
          soft: 'oklch(var(--area-soft) / <alpha-value>)',
          muted: 'oklch(var(--area-muted) / <alpha-value>)',
          foreground: 'oklch(var(--area-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 6px)',
      },
      /* Seitenverhältnisse der Bildstellen (ImageSlot.ratio) */
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '21/9': '21 / 9',
      },
      /* Typoskala (KERN K-005): fließend zwischen 390 und 1440 px. */
      fontSize: {
        caption: ['var(--text-caption)', { lineHeight: '1.4' }],
        small: ['var(--text-small)', { lineHeight: '1.5' }],
        body: ['var(--text-body)', { lineHeight: '1.6' }],
        eingabe: ['var(--text-eingabe)', { lineHeight: '1.5' }],
        lead: ['var(--text-lead)', { lineHeight: '1.55' }],
        'title-sm': ['var(--text-title-sm)', { lineHeight: '1.35' }],
        title: ['var(--text-title)', { lineHeight: '1.3' }],
        headline: ['var(--text-headline)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        display: ['var(--text-display)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
      },
      borderWidth: {
        /* Haarlinie der Bemaßung */
        strich: 'var(--strich)',
      },
      letterSpacing: {
        /* Großbuchstaben-Zeilen (Augenbraue, Bemaßung); schmal: unter 640 px, damit sie einzeilig bleiben */
        label: '0.12em',
        'label-eng': '0.06em',
      },
      spacing: {
        section: 'var(--space-section)',
        'section-tight': 'var(--space-section-tight)',
        gutter: 'var(--space-gutter)',
        header: 'var(--header-height)',
      },
      minHeight: {
        /* Kleine Knöpfe nur am Desktop neben anderen Bedienelementen */
        'touch-sm': '2.5rem',
        touch: '2.75rem',
        'touch-lg': '3.25rem',
      },
      minWidth: {
        touch: '2.75rem',
        /* Fachgrafik mit Beschriftung: darunter scrollt sie seitlich statt zu schrumpfen */
        zeichnung: '35rem',
      },
      /* Spalten nach verfügbarer Breite (ohne Container-Abfragen): ab 15rem je Spalte nebeneinander. */
      gridTemplateColumns: {
        kacheln: 'repeat(auto-fit, minmax(min(100%, 15rem), 1fr))',
      },
      gridTemplateRows: {
        /* Kopfzeile so hoch wie ihr Inhalt, der Rest nimmt den übrigen Platz (Startseiten-Kopf) */
        kopf: 'min-content 1fr',
      },
      width: {
        /* Aufklappender Hinweis: höchstens 20rem, auf Telefonen 3rem schmaler als das Fenster */
        tipp: 'min(20rem, calc(100vw - 3rem))',
      },
      maxWidth: {
        shell: 'var(--shell-max)',
        /* Messbreite für Fließtext: 60–75 Zeichen je Zeile */
        measure: '68ch',
      },
      boxShadow: {
        raised: '0 1px 2px oklch(var(--shadow-color) / 0.06), 0 10px 24px -12px oklch(var(--shadow-color) / 0.22)',
        overlay: '0 2px 6px oklch(var(--shadow-color) / 0.08), 0 20px 44px -14px oklch(var(--shadow-color) / 0.3)',
      },
      zIndex: {
        raised: '10',
        sticky: '30',
        header: '40',
        overlay: '50',
        drawer: '60',
        skip: '70',
      },
      /* Bewegung (KERN K-007) */
      transitionDuration: {
        instant: 'var(--dauer-instant)',
        quick: 'var(--dauer-quick)',
        base: 'var(--dauer-base)',
        slow: 'var(--dauer-slow)',
        enter: 'var(--dauer-enter)',
        scene: 'var(--dauer-scene)',
      },
      scale: {
        /* Knopfdruck (B-05) */
        druck: '0.98',
      },
      keyframes: {
        /* Zustandswechsel des Megamenüs (B-08) und des Drawers (B-07) */
        'menue-ein': {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'schublade-ein': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'none' },
        },
        'schleier-ein': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'menue-ein': 'menue-ein var(--dauer-base) var(--kurve-enter) both',
        'schublade-ein': 'schublade-ein var(--dauer-base) var(--kurve-enter) both',
        'schleier-ein': 'schleier-ein var(--dauer-quick) var(--kurve-standard) both',
        /* Ladeanzeige (B-19): 900 ms je Umdrehung */
        spin: 'spin var(--dauer-scene) linear infinite',
      },
      transitionTimingFunction: {
        standard: 'var(--kurve-standard)',
        enter: 'var(--kurve-enter)',
        exit: 'var(--kurve-exit)',
        draw: 'var(--kurve-draw)',
      },
    },
  },
  plugins: [
    /* Zeiger-Details nur bei feinen Zeigegeräten (KERN K-007, B-06): `zeiger:group-hover:…` */
    plugin(({ addVariant }) => {
      addVariant('zeiger', '@media (hover: hover) and (pointer: fine)');
      /* Sichtbarer Tastaturfokus für Karten mit verstecktem Eingabefeld (KERN K-009) */
      addVariant('fokus-innen', '&:has(:focus-visible)');
      /* Warenkorb-Seite: Geschwister der Leerkarte, solange der Korb leer ist (Gruppe `group/warenkorb`) */
      addVariant('korb-leer', '.group\\/warenkorb:has(.sm24-leerzustand) &');
    }),
    plugin(({ addBase }) => {
      addBase({
        ':root': areaCssVariables(DEFAULT_AREA_THEME),
        ...Object.fromEntries(
          Object.entries(AREA_THEMES).map(([key, theme]) => [
            `[data-area="${key}"]`,
            areaCssVariables(theme),
          ]),
        ),
      });
    }),
  ],
} satisfies Config;

export default config;
