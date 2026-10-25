'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlyphHilfe } from '@/components/visual/glyphen/hilfe';
import { GlyphKalender } from '@/components/visual/glyphen/kalender';
import { GlyphSchluessel } from '@/components/visual/glyphen/schluessel';
import { GlyphSuche } from '@/components/visual/glyphen/suche';
import { aktiverEintrag } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { useSpaetVorladen } from '@/lib/spaet-vorladen';

const ITEMS = [
  { href: '/autoschluessel', label: 'Autoschlüssel', icon: GlyphSchluessel },
  { href: '/schluessel-nach-code', label: 'Nach Code', icon: GlyphSuche },
  { href: '/autoschluessel/anfrage', label: 'Termin anfragen', icon: GlyphKalender },
  { href: '/service-und-termin', label: 'Service', icon: GlyphHilfe },
];

const HREFS = ITEMS.map((item) => item.href);

/** Feste Aktionsleiste am unteren Rand — nur auf schmalen Geräten (Daumenzone). */
export function MobileActionBar() {
  const pathname = usePathname();
  // Ziele erst nach dem großen Moment vorladen, nicht beim Erscheinen (D-044)
  useSpaetVorladen(HREFS, pathname);

  // In den Abläufen stört die Leiste, dort führt die Ablauf-Navigation.
  const hidden =
    pathname.includes('/anfrage') ||
    pathname.includes('/konfigurator') ||
    pathname.includes('/sicherheitscheck') ||
    pathname.startsWith('/kasse') ||
    pathname.startsWith('/admin');

  if (hidden) return null;

  // Auch Unterseiten markieren ihren Bereich (z. B. Modellseiten unter „Autoschlüssel“).
  const aktiv = aktiverEintrag(pathname, HREFS);

  return (
    <nav
      aria-label="Schnellzugriff"
      data-aktionsleiste
      className="pb-safe-area fixed inset-x-0 bottom-0 z-sticky border-t border-border bg-surface md:hidden"
    >
      {/* Spalten nach Inhalt statt gleich breit: „Termin anfragen“ bleibt ab 320 px einzeilig */}
      <ul className="flex">
        {ITEMS.map((item) => {
          const active = item.href === aktiv;
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-auto">
              <Link
                href={item.href}
                prefetch={false}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-touch-lg flex-col items-center justify-center gap-1 px-1 py-2 text-center text-caption font-semibold leading-tight transition-colors duration-quick',
                  active ? 'text-primary' : 'text-foreground-muted',
                )}
              >
                {/* Markierung oben: wächst aus der Mitte, wenn der Bereich aktiv ist */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-5 top-0 h-0.5 rounded-full bg-primary transition-transform duration-base ease-standard',
                    active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
                <Icon size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
