'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  CalendarDays,
  Car,
  ClipboardList,
  Euro,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  X,
} from 'lucide-react';

import { cn } from '@/lib/cn';

/* ==========================================================================
   Navigation des Backends
   Am Smartphone einklappbar, ab der großen Ansicht als feste Seitenleiste.
   Die Ziele werden von verschiedenen Bereichen des Backends bedient.
   ========================================================================== */

interface BackendBereich {
  href: string;
  label: string;
  beschreibung: string;
  icon: typeof LayoutDashboard;
  /** Nur bei genauer Übereinstimmung als aktiv markieren. */
  exakt?: boolean;
}

const BEREICHE: BackendBereich[] = [
  {
    href: '/admin',
    label: 'Übersicht',
    beschreibung: 'Kennzahlen und letzte Vorgänge',
    icon: LayoutDashboard,
    exakt: true,
  },
  {
    href: '/admin/vorgaenge',
    label: 'Vorgänge',
    beschreibung: 'Bestellungen, Anfragen, Termine, Projekte',
    icon: ClipboardList,
  },
  {
    href: '/admin/produkte',
    label: 'Produkte',
    beschreibung: 'Codelinien und Zylinder',
    icon: Package,
  },
  {
    href: '/admin/preise',
    label: 'Preise und Termine',
    beschreibung: 'Preise, Anzahlung, Vorlauf, Terminlänge',
    icon: Euro,
  },
  {
    href: '/admin/termine',
    label: 'Terminkalender',
    beschreibung: 'Belegung und Sperrtage',
    icon: CalendarDays,
  },
  {
    href: '/admin/fahrzeugdaten',
    label: 'Fahrzeugdaten',
    beschreibung: 'Marken, Modelle, Schlüsselarten',
    icon: Car,
  },
  {
    href: '/admin/inhalte',
    label: 'Inhalte und Suchmaschinen',
    beschreibung: 'Seitentexte und Angaben für Suchmaschinen',
    icon: FileText,
  },
  {
    href: '/admin/einstellungen',
    label: 'Einstellungen',
    beschreibung: 'Betrieb, Öffnungszeiten, Anbindungen',
    icon: Settings,
  },
];

function istAktiv(pfad: string, bereich: BackendBereich): boolean {
  if (bereich.exakt) return pfad === bereich.href;
  return pfad === bereich.href || pfad.startsWith(`${bereich.href}/`);
}

function bereichZu(pfad: string): BackendBereich | undefined {
  // Der längste passende Pfad gewinnt, damit Unterseiten richtig zugeordnet werden.
  return [...BEREICHE]
    .sort((a, b) => b.href.length - a.href.length)
    .find((bereich) => istAktiv(pfad, bereich));
}

/** Kopfzeile des Backends mit dem Namen des aktuellen Bereichs. */
export function AdminKopfzeile() {
  const pfad = usePathname() ?? '/admin';
  const aktuell = bereichZu(pfad);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 md:px-5">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
          Backend SCHLÜSSELMACHER24
        </p>
        <p className="mt-0.5 font-display text-lg font-bold text-foreground">
          {aktuell?.label ?? 'Backend'}
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
      >
        <ExternalLink size={16} aria-hidden />
        Website ansehen
      </Link>
    </div>
  );
}

/** Bereichsnavigation — am Smartphone einklappbar, ab 1024 Pixel als Liste. */
export function AdminNav() {
  const pfad = usePathname() ?? '/admin';
  const [offen, setOffen] = useState(false);
  const aktuell = bereichZu(pfad);

  return (
    <nav aria-label="Bereiche im Backend" className="lg:sticky lg:top-6 lg:self-start">
      <button
        type="button"
        onClick={() => setOffen((wert) => !wert)}
        aria-expanded={offen}
        aria-controls="admin-bereichsliste"
        className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 text-[15px] font-semibold text-foreground transition-colors hover:bg-surface-muted lg:hidden"
      >
        <span className="flex items-center gap-2">
          {offen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          Bereich wechseln
        </span>
        <span className="truncate text-sm font-medium text-foreground-muted">
          {aktuell?.label ?? 'Backend'}
        </span>
      </button>

      <ul
        id="admin-bereichsliste"
        className={cn(
          'mt-2 space-y-1 rounded-lg border border-border bg-surface p-2 lg:mt-0 lg:block',
          offen ? 'block' : 'hidden',
        )}
      >
        {BEREICHE.map((bereich) => {
          const aktiv = istAktiv(pfad, bereich);
          const Symbol = bereich.icon;

          return (
            <li key={bereich.href}>
              <Link
                href={bereich.href}
                aria-current={aktiv ? 'page' : undefined}
                onClick={() => setOffen(false)}
                className={cn(
                  'flex min-h-[44px] items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  aktiv
                    ? 'bg-primary-soft text-primary'
                    : 'text-foreground hover:bg-surface-muted',
                )}
              >
                <Symbol
                  size={18}
                  aria-hidden
                  className={cn('mt-0.5 shrink-0', aktiv ? 'text-primary' : 'text-foreground-subtle')}
                />
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold leading-snug">{bereich.label}</span>
                  <span
                    className={cn(
                      'mt-0.5 block text-[12px] leading-snug',
                      aktiv ? 'text-primary' : 'text-foreground-subtle',
                    )}
                  >
                    {bereich.beschreibung}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
