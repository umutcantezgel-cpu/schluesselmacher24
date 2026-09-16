'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, ShoppingBag, X } from 'lucide-react';
import { NAV_AREAS } from '@/lib/navigation';
import { useHydrated } from '@/lib/client-state';
import { useCartStore } from '@/lib/store/cart';
import { cn } from '@/lib/cn';

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [openMobileArea, setOpenMobileArea] = useState<string | null>(null);
  // Der Warenkorb liegt nur im Browser; vor dem Hydrieren zeigen wir keine Zahl.
  const mounted = useHydrated();
  const cartCount = useCartStore((state) =>
    state.items.reduce((summe, item) => summe + item.qty, 0),
  );

  // Menü bei jedem Seitenwechsel schließen. Der Vergleich beim Rendern ist
  // der von React empfohlene Weg, Zustand an eine geänderte Eingabe
  // anzupassen — ein Effekt würde einen zusätzlichen Durchlauf auslösen.
  const [letzterPfad, setLetzterPfad] = useState(pathname);
  if (letzterPfad !== pathname) {
    setLetzterPfad(pathname);
    setDrawerOpen(false);
    setOpenArea(null);
    setOpenMobileArea(null);
  }

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Die ersten fünf Bereiche im Balken, der Rest unter „Mehr“.
  const primary = NAV_AREAS.slice(0, 5);
  const secondary = NAV_AREAS.slice(5);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="shell-wide flex h-16 items-center gap-4 md:h-20">
        {/* Wortmarke — bewusst ohne Bilddatei */}
        <Link href="/" className="flex shrink-0 items-baseline gap-1.5" aria-label="SCHLÜSSELMACHER24 — Startseite">
          <span className="font-display text-[17px] font-bold tracking-tight text-foreground md:text-xl">
            SCHLÜSSELMACHER
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight text-primary md:text-xl">24</span>
        </Link>

        {/* Hauptnavigation ab Desktop */}
        <nav className="ml-auto hidden lg:block" aria-label="Hauptnavigation">
          <ul className="flex items-center gap-0.5">
            {primary.map((area) => (
              <li key={area.key} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenArea(openArea === area.key ? null : area.key)}
                  onMouseEnter={() => setOpenArea(area.key)}
                  aria-expanded={openArea === area.key}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold transition-colors',
                    pathname.startsWith(area.href)
                      ? 'text-primary'
                      : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
                  )}
                >
                  {area.label}
                  <ChevronDown size={13} aria-hidden />
                </button>
              </li>
            ))}

            <li className="relative">
              <button
                type="button"
                onClick={() => setOpenArea(openArea === 'mehr' ? null : 'mehr')}
                onMouseEnter={() => setOpenArea('mehr')}
                aria-expanded={openArea === 'mehr'}
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-semibold text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                Mehr
                <ChevronDown size={13} aria-hidden />
              </button>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href="/warenkorb"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-muted hover:text-foreground"
          >
            <ShoppingBag size={19} aria-hidden />
            {mounted && cartCount > 0 && (
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
            <span className="sr-only">
              Warenkorb{mounted && cartCount > 0 ? `, ${cartCount} Artikel` : ', leer'}
            </span>
          </Link>

          <Link
            href="/autoschluessel/anfrage"
            className="hidden min-h-[44px] items-center rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary-hover sm:inline-flex"
          >
            Termin starten
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-surface-muted lg:hidden"
          >
            <Menu size={21} aria-hidden />
            <span className="sr-only">Menü öffnen</span>
          </button>
        </div>
      </div>

      {/* Aufklappmenü Desktop */}
      {openArea && (
        <div
          className="hidden border-t border-border bg-surface shadow-lg lg:block"
          onMouseLeave={() => setOpenArea(null)}
        >
          <div className="shell-wide py-7">
            {openArea === 'mehr' ? (
              <ul className="grid grid-cols-4 gap-6">
                {secondary.map((area) => (
                  <li key={area.key}>
                    <Link href={area.href} className="group block">
                      <span className="block text-sm font-bold text-foreground group-hover:text-primary">
                        {area.label}
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-foreground-muted">
                        {area.summary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              (() => {
                const area = NAV_AREAS.find((a) => a.key === openArea);
                if (!area) return null;
                return (
                  <div className="grid grid-cols-4 gap-8">
                    {area.columns.map((column) => (
                      <div key={column.title}>
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                          {column.title}
                        </p>
                        <ul className="space-y-2.5">
                          {column.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} className="group block">
                                <span className="block text-[13px] font-semibold text-foreground group-hover:text-primary">
                                  {link.label}
                                </span>
                                {link.description && (
                                  <span className="mt-0.5 block text-[12px] leading-snug text-foreground-subtle">
                                    {link.description}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {area.highlight && (
                      <div className="col-start-4 rounded-lg border border-border bg-surface-muted p-5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                          Nächster Schritt
                        </p>
                        <Link
                          href={area.highlight.href}
                          className="mt-2 block text-[15px] font-bold text-foreground hover:text-primary"
                        >
                          {area.highlight.label}
                        </Link>
                        {area.highlight.description && (
                          <p className="mt-1.5 text-[13px] leading-snug text-foreground-muted">
                            {area.highlight.description}
                          </p>
                        )}
                        <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary">
                          Starten <ChevronRight size={14} aria-hidden />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* Schublade für Smartphone und Tablet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="Menü schließen"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(24rem,100%)] flex-col bg-surface">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              <span className="font-display text-base font-bold">Menü</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-surface-muted"
              >
                <X size={20} aria-hidden />
                <span className="sr-only">Menü schließen</span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain" aria-label="Hauptnavigation">
              <ul className="divide-y divide-border">
                {NAV_AREAS.map((area) => (
                  <li key={area.key}>
                    <div className="flex items-stretch">
                      <Link
                        href={area.href}
                        className="flex-1 px-5 py-4 text-[15px] font-semibold text-foreground"
                      >
                        {area.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenMobileArea(openMobileArea === area.key ? null : area.key)}
                        aria-expanded={openMobileArea === area.key}
                        className="w-14 shrink-0 border-l border-border text-foreground-subtle"
                      >
                        <ChevronDown
                          size={18}
                          aria-hidden
                          className={cn('mx-auto transition-transform', openMobileArea === area.key && 'rotate-180')}
                        />
                        <span className="sr-only">Unterpunkte von {area.label} anzeigen</span>
                      </button>
                    </div>

                    {openMobileArea === area.key && (
                      <div className="bg-surface-muted px-5 pb-4 pt-1">
                        {area.highlight && (
                          <Link
                            href={area.highlight.href}
                            className="mb-3 block rounded-lg bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground"
                          >
                            {area.highlight.label}
                          </Link>
                        )}
                        {area.columns.map((column) => (
                          <div key={column.title} className="mb-3 last:mb-0">
                            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                              {column.title}
                            </p>
                            <ul className="space-y-0.5">
                              {column.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    className="block py-2 text-[14px] text-foreground-muted"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 border-t border-border p-5">
              <Link
                href="/autoschluessel/anfrage"
                className="flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-4 text-[15px] font-semibold text-primary-foreground"
              >
                Autoschlüssel-Termin starten
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
