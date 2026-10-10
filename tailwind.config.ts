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
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
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
      maxWidth: {
        shell: 'var(--shell-max)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
      },
    },
  },
  plugins: [
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
