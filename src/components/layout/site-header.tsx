'use client';

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSpaetVorladen } from '@/lib/spaet-vorladen';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphKreuz } from '@/components/visual/glyphen/kreuz';
import { GlyphMenue } from '@/components/visual/glyphen/menue';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphWarenkorb } from '@/components/visual/glyphen/warenkorb';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';
import { NAV_AREAS, istAktiv } from '@/lib/navigation';
import { useHydrated } from '@/lib/client-state';
import { useCartStore } from '@/lib/store/cart';
import { cn } from '@/lib/cn';

/** Fokussierbare Elemente innerhalb eines Containers (für die Fokusfalle des Drawers). */
function fokussierbare(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  );
}

/** Feste Ziele im Kopf: erst nach dem großen Moment vorladen (D-044). */
const KOPF_ZIELE = ['/', '/warenkorb', '/autoschluessel/anfrage'] as const;

export function SiteHeader() {
  const pathname = usePathname();
  useSpaetVorladen(KOPF_ZIELE, pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [openMobileArea, setOpenMobileArea] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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

  // Drawer: Fokus hinein beim Öffnen, zurück auf den Menüknopf nach dem Schließen
  // (nicht beim ersten Laden – dort bleibt der Fokus, wo der Browser ihn setzt).
  const warOffen = useRef(false);
  useEffect(() => {
    if (drawerOpen) {
      warOffen.current = true;
      fokussierbare(drawerRef.current)[0]?.focus();
      return;
    }
    if (warOffen.current && document.activeElement === document.body) {
      menuButtonRef.current?.focus({ preventScroll: true });
    }
    warOffen.current = false;
  }, [drawerOpen]);

  // Escape schließt Megamenü und Drawer.
  useEffect(() => {
    if (!drawerOpen && !openArea) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (drawerOpen) {
        setDrawerOpen(false);
        menuButtonRef.current?.focus();
      }
      setOpenArea(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen, openArea]);

  // Fokusfalle: Tab bleibt im geöffneten Drawer.
  const fokusFalle = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const elemente = fokussierbare(drawerRef.current);
    if (elemente.length === 0) return;
    const erstes = elemente[0];
    const letztes = elemente[elemente.length - 1];
    if (event.shiftKey && document.activeElement === erstes) {
      event.preventDefault();
      letztes.focus();
    } else if (!event.shiftKey && document.activeElement === letztes) {
      event.preventDefault();
      erstes.focus();
    }
  };

  // Im Balken ab 1024 px die ersten drei Bereiche, ab 1280 px zusätzlich Bereich 5,
  // ab 1536 px auch Bereich 4; alles andere steht unter „Mehr“.
  const primary = NAV_AREAS.slice(0, 5);
  const secondary = NAV_AREAS.slice(3);
  const mehrAktiv = NAV_AREAS.slice(5).some((area) => istAktiv(pathname, area.href));

  return (
    <header className="fixed inset-x-0 top-0 z-header border-b border-border bg-surface">
      <div className="shell-wide flex h-header items-center gap-4">
        {/* Wortmarke — bewusst ohne Bilddatei (Logo, unverändert) */}
        <Link href="/" prefetch={false} className="flex shrink-0 items-baseline gap-1.5" aria-label="SCHLÜSSELMACHER24 — Startseite">
          <span className="font-display text-title-sm font-bold tracking-tight text-foreground md:text-title">
            SCHLÜSSELMACHER
          </span>
          <span className="font-display text-title-sm font-bold tracking-tight text-primary md:text-title">24</span>
        </Link>

        {/* Hauptnavigation ab Desktop */}
        <nav className="ml-auto hidden lg:block" aria-label="Hauptnavigation">
          <ul className="flex items-center gap-0.5">
            {[
              ...primary.map((area, index) => ({
                key: area.key,
                label: area.label,
                aktiv: istAktiv(pathname, area.href),
                /* Bereich 4 (langer Name) erst ab 1536 px, Bereich 5 ab 1280 px im Balken */
                sichtbar: index === 3 ? 'hidden 2xl:block' : index === 4 ? 'hidden xl:block' : '',
              })),
              { key: 'mehr', label: 'Mehr', aktiv: mehrAktiv, sichtbar: '' },
            ].map(
              (eintrag) => (
                <li key={eintrag.key} className={cn('relative', eintrag.sichtbar)}>
                  <button
                    type="button"
                    onClick={() => setOpenArea(openArea === eintrag.key ? null : eintrag.key)}
                    onMouseEnter={() => setOpenArea(eintrag.key)}
                    aria-expanded={openArea === eintrag.key}
                    aria-controls="megamenue"
                    className={cn(
                      'relative inline-flex min-h-touch items-center gap-1 whitespace-nowrap rounded-md px-3 text-small font-semibold transition-colors duration-quick',
                      eintrag.aktiv || openArea === eintrag.key
                        ? 'text-primary'
                        : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
                    )}
                  >
                    {eintrag.label}
                    <GlyphWinkelUnten
                      size={14}
                      className={cn(
                        'transition-transform duration-base ease-standard',
                        openArea === eintrag.key && 'rotate-180',
                      )}
                    />
                    {/* Bemaßungsstrich unter dem aktiven Bereich */}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-x-3 -bottom-px h-0.5 bg-primary transition-transform duration-base ease-standard',
                        eintrag.aktiv ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </button>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href="/warenkorb"
            prefetch={false}
            className="relative inline-flex min-h-touch min-w-touch items-center justify-center rounded-md text-foreground-muted transition-colors duration-quick hover:bg-surface-muted hover:text-foreground"
          >
            <GlyphWarenkorb size={22} />
            {mounted && cartCount > 0 && (
              <span
                key={cartCount}
                aria-hidden
                className="sm24-pop absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-caption font-semibold tabular-nums text-primary-foreground"
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
            prefetch={false}
            className="hidden min-h-touch items-center whitespace-nowrap rounded-md bg-primary px-4 text-small font-semibold text-primary-foreground transition-colors duration-quick hover:bg-primary-hover active:scale-druck motion-reduce:transform-none sm:inline-flex"
          >
            Termin starten
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="hauptmenue-mobil"
            className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-md text-foreground hover:bg-surface-muted lg:hidden"
          >
            <GlyphMenue size={24} />
            <span className="sr-only">Menü öffnen</span>
          </button>
        </div>
      </div>

      {/* Megamenü Desktop (B-08) */}
      {openArea && (
        <div
          id="megamenue"
          className="hidden animate-menue-ein border-t border-border bg-surface shadow-overlay lg:block"
          onMouseLeave={() => setOpenArea(null)}
        >
          <div className="shell-wide py-8">
            {openArea === 'mehr' ? (
              <ul className="grid grid-cols-4 gap-6">
                {secondary.map((area, index) => (
                  <li key={area.key} className={cn(index === 0 && '2xl:hidden', index === 1 && 'xl:hidden')}>
                    <AreaScope area={area.key}>
                      <Link href={area.href} className="group flex gap-3 rounded-md p-2 -m-2 hover:bg-surface-muted">
                        <BereichIcon area={area.key} size={36} className="text-area-strong" />
                        <span>
                          <span className="block text-body font-semibold text-foreground group-hover:text-primary">
                            {area.label}
                          </span>
                          <span className="mt-1 block text-small text-foreground-muted">{area.summary}</span>
                        </span>
                      </Link>
                    </AreaScope>
                  </li>
                ))}
              </ul>
            ) : (
              (() => {
                const area = NAV_AREAS.find((a) => a.key === openArea);
                if (!area) return null;
                return (
                  <AreaScope area={area.key}>
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-3 border-r border-border pr-8">
                        <BereichIcon area={area.key} size={48} className="text-area-strong" />
                        <Link
                          href={area.href}
                          className="mt-4 block text-title font-bold text-foreground hover:text-primary"
                        >
                          {area.label}
                        </Link>
                        <p className="mt-2 text-small text-foreground-muted">{area.summary}</p>
                      </div>
                      <div className="col-span-6 grid grid-cols-2 gap-8">
                        {area.columns.map((column) => (
                          <div key={column.title}>
                            <p className="mb-3 font-mono text-caption uppercase tracking-label text-foreground-subtle">
                              {column.title}
                            </p>
                            <ul className="space-y-3">
                              {column.links.map((link) => (
                                <li key={link.href}>
                                  <Link href={link.href} className="group block">
                                    <span className="block text-small font-semibold text-foreground group-hover:text-primary">
                                      {link.label}
                                    </span>
                                    {link.description && (
                                      <span className="mt-0.5 block text-small text-foreground-subtle">
                                        {link.description}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {area.highlight && (
                        <div className="col-span-3 rounded-lg border border-border bg-area-soft p-5">
                          <p className="font-mono text-caption uppercase tracking-label text-area-strong">
                            Nächster Schritt
                          </p>
                          <Link
                            href={area.highlight.href}
                            className="group mt-2 block text-title-sm font-bold text-foreground hover:text-primary"
                          >
                            {area.highlight.label}
                            <GlyphPfeilRechts
                              size={18}
                              className="ml-1 inline-block align-text-bottom text-primary transition-transform duration-quick zeiger:group-hover:translate-x-1"
                            />
                          </Link>
                          {area.highlight.description && (
                            <p className="mt-1.5 text-small text-foreground-muted">{area.highlight.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </AreaScope>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* Schublade für Smartphone und Tablet (B-07) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-drawer lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 animate-schleier-ein bg-surface-ink/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="Menü schließen"
          />
          <div
            id="hauptmenue-mobil"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            onKeyDown={fokusFalle}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm animate-schublade-ein flex-col bg-surface shadow-overlay"
          >
            <div className="flex h-header shrink-0 items-center justify-between border-b border-border px-5">
              <span className="font-mono text-caption uppercase tracking-label text-foreground-subtle">Menü</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-md hover:bg-surface-muted"
              >
                <GlyphKreuz size={22} />
                <span className="sr-only">Menü schließen</span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain" aria-label="Hauptnavigation">
              <ul className="divide-y divide-border">
                {NAV_AREAS.map((area) => (
                  <li key={area.key}>
                    <AreaScope area={area.key}>
                      <div className="flex items-stretch">
                        <Link
                          href={area.href}
                          aria-current={istAktiv(pathname, area.href) ? 'page' : undefined}
                          className="flex min-h-touch-lg flex-1 items-center gap-3 px-5 py-3 text-body font-semibold text-foreground"
                        >
                          <BereichIcon area={area.key} size={28} className="text-area-strong" />
                          {area.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setOpenMobileArea(openMobileArea === area.key ? null : area.key)}
                          aria-expanded={openMobileArea === area.key}
                          className="w-14 shrink-0 border-l border-border text-foreground-subtle"
                        >
                          <GlyphWinkelUnten
                            size={20}
                            className={cn(
                              'mx-auto transition-transform duration-base ease-standard',
                              openMobileArea === area.key && 'rotate-180',
                            )}
                          />
                          <span className="sr-only">Unterpunkte von {area.label} anzeigen</span>
                        </button>
                      </div>

                      {openMobileArea === area.key && (
                        <div className="animate-menue-ein bg-surface-muted px-5 pb-4 pt-1">
                          {area.highlight && (
                            <Link
                              href={area.highlight.href}
                              className="mb-3 flex min-h-touch items-center rounded-md bg-primary px-4 text-small font-semibold text-primary-foreground"
                            >
                              {area.highlight.label}
                            </Link>
                          )}
                          {area.columns.map((column) => (
                            <div key={column.title} className="mb-3 last:mb-0">
                              <p className="mb-1.5 font-mono text-caption uppercase tracking-label text-foreground-subtle">
                                {column.title}
                              </p>
                              <ul>
                                {column.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      className="flex min-h-touch items-center text-small text-foreground-muted"
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
                    </AreaScope>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 border-t border-border p-5">
              <Link
                href="/autoschluessel/anfrage"
                className="flex min-h-touch-lg items-center justify-center rounded-md bg-primary px-4 text-body font-semibold text-primary-foreground"
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
