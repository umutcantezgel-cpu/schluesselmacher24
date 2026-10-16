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
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          muted: 'hsl(var(--surface-muted))',
          sunken: 'hsl(var(--surface-sunken))',
          ink: 'hsl(var(--surface-ink))',
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          muted: 'hsl(var(--foreground-muted))',
          subtle: 'hsl(var(--foreground-subtle))',
          inverse: 'hsl(var(--foreground-inverse))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          strong: 'hsl(var(--border-strong))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          soft: 'hsl(var(--primary-soft))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          soft: 'hsl(var(--accent-soft))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          soft: 'hsl(var(--success-soft))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          soft: 'hsl(var(--warning-soft))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          soft: 'hsl(var(--danger-soft))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          soft: 'hsl(var(--info-soft))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        area: {
          DEFAULT: 'hsl(var(--area) / <alpha-value>)',
          strong: 'hsl(var(--area-strong) / <alpha-value>)',
          soft: 'hsl(var(--area-soft) / <alpha-value>)',
          muted: 'hsl(var(--area-muted) / <alpha-value>)',
          foreground: 'hsl(var(--area-foreground) / <alpha-value>)',
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
        raised: '0 1px 2px hsl(var(--shadow-color) / 0.06), 0 10px 24px -12px hsl(var(--shadow-color) / 0.22)',
        overlay: '0 2px 6px hsl(var(--shadow-color) / 0.08), 0 20px 44px -14px hsl(var(--shadow-color) / 0.3)',
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
      addVariant('korb-leer', '.group\\/warenkorb:has([data-leerzustand]) &');
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
