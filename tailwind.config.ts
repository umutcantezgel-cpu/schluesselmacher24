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
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'oklch(var(--background))',
        surface: {
          DEFAULT: 'oklch(var(--surface))',
          muted: 'oklch(var(--surface-muted))',
          sunken: 'oklch(var(--surface-sunken))',
          ink: 'oklch(var(--surface-ink))',
        },
        foreground: {
          DEFAULT: 'oklch(var(--foreground))',
          muted: 'oklch(var(--foreground-muted))',
          subtle: 'oklch(var(--foreground-subtle))',
          inverse: 'oklch(var(--foreground-inverse))',
        },
        border: {
          DEFAULT: 'oklch(var(--border))',
          strong: 'oklch(var(--border-strong))',
        },
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          hover: 'oklch(var(--primary-hover))',
          soft: 'oklch(var(--primary-soft))',
          foreground: 'oklch(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          soft: 'oklch(var(--accent-soft))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        success: {
          DEFAULT: 'oklch(var(--success))',
          soft: 'oklch(var(--success-soft))',
        },
        warning: {
          DEFAULT: 'oklch(var(--warning))',
          soft: 'oklch(var(--warning-soft))',
        },
        danger: {
          DEFAULT: 'oklch(var(--danger))',
          soft: 'oklch(var(--danger-soft))',
        },
        info: {
          DEFAULT: 'oklch(var(--info))',
          soft: 'oklch(var(--info-soft))',
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
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
