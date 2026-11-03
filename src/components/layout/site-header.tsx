'use client';

import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSpaetVorladen } from '@/lib/spaet-vorladen';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphKreuz } from '@/components/visual/glyphen/kreuz';
import { GlyphMenue } from '@/components/visual/glyphen/menue';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphTelefon } from '@/components/visual/glyphen/telefon';
import { GlyphWarenkorb } from '@/components/visual/glyphen/warenkorb';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';
import { istAktiv, type NavGruppe, type NavRubrik } from '@/lib/navigation';
import { useHydrated } from '@/lib/client-state';
import { useCartStore } from '@/lib/store/cart';
import type { RubrikNavigation } from '@/lib/types';
import { cn } from '@/lib/cn';

type Stufe = 'lg' | 'xl' | '2xl';

/**
 * Ab welcher Breite eine Gruppe der Hauptnavigation (G-08) mit ihrer Kurzbezeichnung in der Leiste
 * steht; sonst steht sie unter „Mehr“ (und immer in der Schublade). Nachgemessen mit Plex Sans
 * halbfett 15 px und dem Kopfknopf „Termin anfragen“ (E4-OPUS-03): Bei 1024, 1280, 1440 und 1536 px
 * bleibt die Leiste einzeilig. Wer eine Kurzbezeichnung verlängert, misst diese Breiten nach.
 */
const LEISTE: Partial<Record<RubrikNavigation, Stufe>> = {
  autoschluessel: 'lg',
  code: 'lg',
  sperrschliessung: 'lg',
  schliessanlagen: 'xl',
};

/** Sichtbarkeit in der Leiste (die Leiste selbst erscheint erst ab 1024 px). */
const IN_LEISTE: Record<Stufe, string> = { lg: '', xl: 'hidden xl:block', '2xl': 'hidden 2xl:block' };
/** Sichtbarkeit unter „Mehr“: dort nur, solange die Gruppe nicht in der Leiste steht. */
const UNTER_MEHR: Record<Stufe, string> = { lg: 'hidden', xl: 'xl:hidden', '2xl': '2xl:hidden' };
/** Markierung von „Mehr“, wenn die aktuelle Seite in einer Gruppe liegt, die ab einer Breite in die Leiste wandert. */
const MEHR_MARKE: Record<Stufe | 'immer', string> = {
  immer: 'scale-x-100',
  lg: 'scale-x-0',
  xl: 'scale-x-100 xl:scale-x-0',
  '2xl': 'scale-x-100 2xl:scale-x-0',
};
const MEHR_TEXT: Record<Stufe | 'immer', string> = {
  immer: 'text-primary',
  lg: '',
  xl: 'text-primary xl:text-foreground-muted',
  '2xl': 'text-primary 2xl:text-foreground-muted',
};

/** Ob die Seite zu einer Gruppe gehört: Gruppenseite oder eine ihrer Rubriken. */
function gruppeAktiv(pathname: string, gruppe: NavGruppe): boolean {
  if (gruppe.href && istAktiv(pathname, gruppe.href)) return true;
  return gruppe.rubriken.some((r) => istAktiv(pathname, r.href)) || gruppe.weitere.some((l) => istAktiv(pathname, l.href));
}

export interface SiteHeaderProps {
  /** Die fünf Gruppen nach G-08 (`navigationsGruppen` aus den Rubriken). */
  gruppen: NavGruppe[];
  /** Fach-Icons der Rubriken, auf dem Server gezeichnet (kein Icon-Code im Browser-Bündel). */
  rubrikIcons?: Record<string, ReactNode>;
  /** Telefon für „Anrufen“ in der Schublade. */
  telefon?: { anzeige: string; href: string | null } | null;
}

/** Fokussierbare Elemente innerhalb eines Containers (für die Fokusfalle des Drawers). */
function fokussierbare(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  );
}

/** Feste Ziele im Kopf: erst nach dem großen Moment vorladen (D-044). */
const KOPF_ZIELE = ['/', '/warenkorb', '/autoschluessel/anfrage'] as const;

export function SiteHeader({ gruppen, rubrikIcons = {}, telefon }: SiteHeaderProps) {
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
  // Der Fokus folgt ein Bild später: `focus()` erzwingt Stil und Layout, im Klick selbst
  // verzögerte das die Antwort auf den Menüknopf (E7-L-36).
  const warOffen = useRef(false);
  useEffect(() => {
    if (drawerOpen) {
      warOffen.current = true;
      const bild = requestAnimationFrame(() => fokussierbare(drawerRef.current)[0]?.focus({ preventScroll: true }));
      return () => cancelAnimationFrame(bild);
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

  const schliessen = useCallback(() => setDrawerOpen(false), []);
  const umschalten = useCallback((key: string) => setOpenMobileArea((offen) => (offen === key ? null : key)), []);

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
        <DesktopNav gruppen={gruppen} pathname={pathname} openArea={openArea} setOpenArea={setOpenArea} />

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
                className="sm24-pop [--sm24-duration:var(--dauer-quick)] absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-caption font-semibold tabular-nums text-primary-foreground"
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
            data-kopfknopf
            className="hidden min-h-touch items-center whitespace-nowrap rounded-md bg-primary px-4 text-small font-semibold text-primary-foreground transition-colors duration-quick hover:bg-primary-hover active:scale-druck ruhig:transform-none sm:inline-flex"
          >
            Termin anfragen
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            // Öffnen als Transition: Der Klick antwortet sofort, die Schublade baut sich im nächsten Bild auf.
            onClick={() => startTransition(() => setDrawerOpen(true))}
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
              <MehrMenue gruppen={gruppen} rubrikIcons={rubrikIcons} />
            ) : (
              (() => {
                const gruppe = gruppen.find((g) => g.key === openArea);
                return gruppe ? <GruppenMenue gruppe={gruppe} rubrikIcons={rubrikIcons} /> : null;
              })()
            )}
          </div>
        </div>
      )}

      {/* Schublade für Smartphone und Tablet (B-07) */}
      {drawerOpen && (
        <MobilSchublade
          gruppen={gruppen}
          rubrikIcons={rubrikIcons}
          telefon={telefon}
          pathname={pathname}
          drawerRef={drawerRef}
          openMobileArea={openMobileArea}
          onToggle={umschalten}
          onClose={schliessen}
        />
      )}
    </header>
  );
}

/** Eine Rubrik als Menüzeile: Fach-Icon, Name, Laienerklärung. */
function RubrikZeile({ rubrik, icon, dicht = false }: { rubrik: NavRubrik; icon?: ReactNode; dicht?: boolean }) {
  return (
    <AreaScope area={rubrik.bereich}>
      <Link
        href={rubrik.href}
        className={cn(
          'group flex items-start gap-3 rounded-md transition-colors duration-quick',
          dicht ? 'min-h-touch py-2' : '-m-2 p-2 hover:bg-surface-muted',
        )}
      >
        <span className="shrink-0 text-area-strong">{icon}</span>
        <span className="min-w-0">
          <span className="block text-small font-semibold text-foreground group-hover:text-primary">{rubrik.label}</span>
          {rubrik.zusatz && <span className="mt-0.5 block text-small text-foreground-muted">{rubrik.zusatz}</span>}
        </span>
      </Link>
    </AreaScope>
  );
}

/** Menü einer Gruppe: Kopf, ihre Rubriken, die Spalten des Bestands, der nächste Schritt. */
function GruppenMenue({ gruppe, rubrikIcons }: { gruppe: NavGruppe; rubrikIcons: Record<string, ReactNode> }) {
  return (
    <AreaScope area={gruppe.bereich}>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3 border-r border-border pr-8">
          <BereichIcon area={gruppe.bereich} size={48} className="text-area-strong" />
          {gruppe.href ? (
            <Link href={gruppe.href} className="mt-4 block text-title font-bold text-foreground hover:text-primary">
              {gruppe.label}
            </Link>
          ) : (
            <p className="mt-4 text-title font-bold text-foreground">{gruppe.label}</p>
          )}
          {gruppe.zusatz && <p className="mt-1 text-small font-semibold text-area-strong">{gruppe.zusatz}</p>}
          {gruppe.zusammenfassung && <p className="mt-2 text-small text-foreground-muted">{gruppe.zusammenfassung}</p>}
        </div>
        <div className="col-span-6 grid grid-cols-2 gap-8">
          {gruppe.rubriken.length > 0 && (
            <div>
              <p className="mb-3 font-mono text-caption uppercase tracking-label text-foreground-subtle">Bestellen und anfragen</p>
              <ul className="space-y-3">
                {gruppe.rubriken.map((rubrik) => (
                  <li key={rubrik.id}>
                    <RubrikZeile rubrik={rubrik} icon={rubrikIcons[rubrik.id]} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {gruppe.spalten.map((column) => (
            <div key={column.title}>
              <p className="mb-3 font-mono text-caption uppercase tracking-label text-foreground-subtle">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group block">
                      <span className="block text-small font-semibold text-foreground group-hover:text-primary">{link.label}</span>
                      {link.description && <span className="mt-0.5 block text-small text-foreground-subtle">{link.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {gruppe.hinweis && (
          <div className="col-span-3 rounded-lg border border-border bg-area-soft p-5">
            <p className="font-mono text-caption uppercase tracking-label text-area-strong">Nächster Schritt</p>
            <Link href={gruppe.hinweis.href} className="group mt-2 block text-title-sm font-bold text-foreground hover:text-primary">
              {gruppe.hinweis.label}
              <GlyphPfeilRechts
                size={18}
                className="ml-1 inline-block align-text-bottom text-primary transition-transform duration-quick zeiger:group-hover:translate-x-1"
              />
            </Link>
            {gruppe.hinweis.description && <p className="mt-1.5 text-small text-foreground-muted">{gruppe.hinweis.description}</p>}
          </div>
        )}
      </div>
    </AreaScope>
  );
}

/** „Mehr“: Gruppen, die bei dieser Breite nicht in die Leiste passen, die Rubriken von „Mehr“ und weitere Seiten. */
function MehrMenue({ gruppen, rubrikIcons }: { gruppen: NavGruppe[]; rubrikIcons: Record<string, ReactNode> }) {
  const mehr = gruppen.find((g) => g.key === 'mehr');
  const ausgelagert = gruppen.filter((g) => g.key !== 'mehr' && LEISTE[g.key] !== 'lg');
  return (
    <div className="grid grid-cols-12 gap-8">
      <ul className="col-span-9 grid grid-cols-3 content-start gap-6">
        {ausgelagert.map((gruppe) => (
          <li key={gruppe.key} className={cn(LEISTE[gruppe.key] && UNTER_MEHR[LEISTE[gruppe.key]!])}>
            <AreaScope area={gruppe.bereich}>
              <Link href={gruppe.href ?? '/'} className="group -m-2 flex gap-3 rounded-md p-2 hover:bg-surface-muted">
                <BereichIcon area={gruppe.bereich} size={36} className="shrink-0 text-area-strong" />
                <span>
                  <span className="block text-body font-semibold text-foreground group-hover:text-primary">{gruppe.label}</span>
                  {gruppe.zusatz && <span className="mt-1 block text-small text-foreground-muted">{gruppe.zusatz}</span>}
                </span>
              </Link>
            </AreaScope>
          </li>
        ))}
        {mehr?.rubriken.map((rubrik) => (
          <li key={rubrik.id}>
            <RubrikZeile rubrik={rubrik} icon={rubrikIcons[rubrik.id]} />
          </li>
        ))}
      </ul>
      {mehr && mehr.weitere.length > 0 && (
        <div className="col-span-3 border-l border-border pl-8">
          <p className="mb-3 font-mono text-caption uppercase tracking-label text-foreground-subtle">Außerdem</p>
          <ul className="space-y-3">
            {mehr.weitere.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="group block">
                  <span className="block text-small font-semibold text-foreground group-hover:text-primary">{link.label}</span>
                  {link.description && <span className="mt-0.5 block text-small text-foreground-subtle">{link.description}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

type DesktopNavProps = {
  gruppen: NavGruppe[];
  pathname: string;
  openArea: string | null;
  setOpenArea: Dispatch<SetStateAction<string | null>>;
};

/**
 * Hauptnavigation ab Desktop (G-08). Eigene, gemerkte Komponente: Das Öffnen der Schublade
 * zeichnet sie nicht mit neu (E7-L-36).
 */
const DesktopNav = memo(function DesktopNav({ gruppen, pathname, openArea, setOpenArea }: DesktopNavProps) {
  // Liegt die Seite in einer Gruppe, die (noch) unter „Mehr“ steht, trägt „Mehr“ die Markierung.
  const aktiv = gruppen.find((g) => gruppeAktiv(pathname, g));
  const mehrStufe = aktiv ? (aktiv.key === 'mehr' ? 'immer' : (LEISTE[aktiv.key] ?? 'immer')) : undefined;
  const leiste = gruppen
    .filter((g) => g.key !== 'mehr' && LEISTE[g.key])
    .map((g) => ({
      key: g.key,
      label: g.kurz,
      sichtbar: IN_LEISTE[LEISTE[g.key]!],
      marke: gruppeAktiv(pathname, g) ? 'scale-x-100' : 'scale-x-0',
      text: gruppeAktiv(pathname, g) ? 'text-primary' : '',
    }));
  return (
    <nav className="ml-auto hidden lg:block" aria-label="Hauptnavigation">
      <ul className="flex items-center gap-0.5">
        {[
          ...leiste,
          {
            key: 'mehr',
            label: 'Mehr',
            sichtbar: '',
            marke: mehrStufe ? MEHR_MARKE[mehrStufe] : 'scale-x-0',
            text: mehrStufe ? MEHR_TEXT[mehrStufe] : '',
          },
        ].map((eintrag) => (
          <li key={eintrag.key} className={cn('relative', eintrag.sichtbar)}>
            <button
              type="button"
              onClick={() => setOpenArea(openArea === eintrag.key ? null : eintrag.key)}
              onMouseEnter={() => setOpenArea(eintrag.key)}
              aria-expanded={openArea === eintrag.key}
              aria-controls="megamenue"
              className={cn(
                'relative inline-flex min-h-touch items-center gap-1 whitespace-nowrap rounded-md px-3 text-small font-semibold transition-colors duration-quick',
                openArea === eintrag.key || eintrag.text === 'text-primary'
                  ? 'text-primary'
                  : cn('text-foreground-muted hover:bg-surface-muted hover:text-foreground', eintrag.text),
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
                  eintrag.marke,
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
});

type SchubladeProps = {
  gruppen: NavGruppe[];
  rubrikIcons: Record<string, ReactNode>;
  telefon?: { anzeige: string; href: string | null } | null;
  pathname: string;
  drawerRef: RefObject<HTMLDivElement | null>;
  openMobileArea: string | null;
  onToggle: (key: string) => void;
  onClose: () => void;
};

/** Schublade für Smartphone und Tablet (B-07). Wird beim Öffnen eingehängt. */
const MobilSchublade = memo(function MobilSchublade({
  gruppen,
  rubrikIcons,
  telefon,
  pathname,
  drawerRef,
  openMobileArea,
  onToggle,
  onClose,
}: SchubladeProps) {
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

  return (
    <div className="fixed inset-0 z-drawer lg:hidden">
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 animate-schleier-ein bg-surface-ink/40"
        onClick={onClose}
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
            onClick={onClose}
            className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-md hover:bg-surface-muted"
          >
            <GlyphKreuz size={22} />
            <span className="sr-only">Menü schließen</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain" aria-label="Hauptnavigation">
          <ul className="divide-y divide-border">
            {gruppen.map((gruppe) => (
              <SchubladenZeile
                key={gruppe.key}
                gruppe={gruppe}
                rubrikIcons={rubrikIcons}
                aktiv={gruppeAktiv(pathname, gruppe)}
                offen={openMobileArea === gruppe.key}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-border p-5">
          <Link
            href="/autoschluessel/anfrage"
            className="flex min-h-touch-lg items-center justify-center rounded-md bg-primary px-4 text-body font-semibold text-primary-foreground"
          >
            Autoschlüssel-Termin anfragen
          </Link>
          {telefon?.href && (
            <a
              href={telefon.href}
              className="flex min-h-touch-lg items-center justify-center gap-2 rounded-md border border-border px-4 text-body font-semibold text-primary"
            >
              <GlyphTelefon size={20} aria-hidden />
              Anrufen: <span className="font-mono tabular-nums">{telefon.anzeige}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

type SchubladenZeileProps = {
  gruppe: NavGruppe;
  rubrikIcons: Record<string, ReactNode>;
  aktiv: boolean;
  offen: boolean;
  onToggle: (key: string) => void;
};

/** Eine Gruppe in der Schublade; beim Auf- und Zuklappen zeichnen nur die betroffenen Zeilen neu. */
const SchubladenZeile = memo(function SchubladenZeile({ gruppe, rubrikIcons, aktiv, offen, onToggle }: SchubladenZeileProps) {
  const kopf = (
    <>
      <BereichIcon area={gruppe.bereich} size={28} className="shrink-0 text-area-strong" />
      <span className="min-w-0">
        <span className="block">{gruppe.label}</span>
        {gruppe.zusatz && <span className="block text-small font-normal text-foreground-muted">{gruppe.zusatz}</span>}
      </span>
    </>
  );
  return (
    <li>
      <AreaScope area={gruppe.bereich}>
        <div className="flex items-stretch">
          {gruppe.href ? (
            <Link
              href={gruppe.href}
              aria-current={aktiv ? 'page' : undefined}
              className="flex min-h-touch-lg flex-1 items-center gap-3 px-5 py-3 text-body font-semibold text-foreground"
            >
              {kopf}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onToggle(gruppe.key)}
              aria-expanded={offen}
              className="flex min-h-touch-lg flex-1 items-center gap-3 px-5 py-3 text-left text-body font-semibold text-foreground"
            >
              {kopf}
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggle(gruppe.key)}
            aria-expanded={offen}
            className="w-14 shrink-0 border-l border-border text-foreground-subtle"
          >
            <GlyphWinkelUnten
              size={20}
              className={cn('mx-auto transition-transform duration-base ease-standard', offen && 'rotate-180')}
            />
            <span className="sr-only">Unterpunkte von {gruppe.label} anzeigen</span>
          </button>
        </div>

        {offen && (
          <div className="animate-menue-ein bg-surface-muted px-5 pb-4 pt-1">
            {gruppe.hinweis && (
              <Link
                href={gruppe.hinweis.href}
                className="mb-3 flex min-h-touch items-center rounded-md bg-primary px-4 text-small font-semibold text-primary-foreground"
              >
                {gruppe.hinweis.label}
              </Link>
            )}
            {gruppe.rubriken.length > 0 && (
              <ul className="mb-3">
                {gruppe.rubriken.map((rubrik) => (
                  <li key={rubrik.id}>
                    <RubrikZeile rubrik={rubrik} icon={rubrikIcons[rubrik.id]} dicht />
                  </li>
                ))}
              </ul>
            )}
            {gruppe.spalten.map((column) => (
              <div key={column.title} className="mb-3 last:mb-0">
                <p className="mb-1.5 font-mono text-caption uppercase tracking-label text-foreground-subtle">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="flex min-h-touch items-center text-small text-foreground-muted">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {gruppe.weitere.length > 0 && (
              <ul>
                {gruppe.weitere.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex min-h-touch items-center text-small text-foreground-muted">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </AreaScope>
    </li>
  );
});
