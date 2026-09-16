'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarClock, KeyRound, LifeBuoy, Search } from 'lucide-react';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/autoschluessel', label: 'Autoschlüssel', icon: KeyRound },
  { href: '/schluessel-nach-code', label: 'Nach Code', icon: Search },
  { href: '/autoschluessel/anfrage', label: 'Termin', icon: CalendarClock },
  { href: '/service-und-termin', label: 'Service', icon: LifeBuoy },
];

/** Feste Aktionsleiste am unteren Rand — nur auf schmalen Geräten. */
export function MobileActionBar() {
  const pathname = usePathname();

  // In den Abläufen stört die Leiste, dort führt die Ablauf-Navigation.
  const hidden =
    pathname.includes('/anfrage') ||
    pathname.includes('/konfigurator') ||
    pathname.includes('/sicherheitscheck') ||
    pathname.startsWith('/kasse') ||
    pathname.startsWith('/admin');

  if (hidden) return null;

  return (
    <nav
      aria-label="Schnellzugriff"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold',
                  active ? 'text-primary' : 'text-foreground-subtle',
                )}
              >
                <Icon size={19} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
