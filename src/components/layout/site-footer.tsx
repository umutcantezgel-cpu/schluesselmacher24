import Link from 'next/link';
import { Profillinie } from '@/components/visual/profillinie';
import { getSettings } from '@/lib/data';
import { FOOTER_CONTENT, FOOTER_LEGAL, NAV_AREAS, type NavLink } from '@/lib/navigation';
import { formatWeekday } from '@/lib/format';

/** Shop-Seiten ohne eigenen Leistungsbereich — stehen im Anschluss an die Bereiche. */
const FOOTER_SHOP: NavLink[] = [{ href: '/artikel', label: 'Artikel' }];

/** Feldbeschriftung im Schriftfeld (Mono, Großbuchstaben). */
function Feldtitel({ children }: { children: string }) {
  return <p className="mb-3 font-mono text-caption uppercase tracking-label text-foreground-muted">{children}</p>;
}

const linkKlasse =
  'inline-flex min-h-touch items-center text-small text-foreground-muted transition-colors duration-quick hover:text-primary md:min-h-0 md:py-1';

/**
 * Fußbereich als Schriftfeld einer Werkstattzeichnung (KERN K-001): Felder mit
 * Haarlinien, Beschriftung in Mono, darüber die Profillinie als Abschluss.
 */
export async function SiteFooter() {
  const settings = await getSettings();
  const { company } = settings;

  return (
    <footer className="bg-surface-sunken pb-safe-nav">
      <div className="shell pt-section-tight">
        <Profillinie text="SCHLÜSSELMACHER24" groesse="gross" voll ruhig className="text-border-strong" />
      </div>

      <div className="shell pb-section-tight">
        <div className="grid border-b border-border md:grid-cols-2 lg:grid-cols-12">
          {/* Marke und Anschrift */}
          <div className="border-b border-border py-8 md:border-r md:pr-8 lg:col-span-4 lg:border-b-0">
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-title font-bold tracking-tight text-foreground">SCHLÜSSELMACHER</span>
              <span className="font-display text-title font-bold tracking-tight text-primary">24</span>
            </p>
            <p className="mt-3 max-w-xs text-small text-foreground-muted">
              Fachbetrieb für Autoschlüssel, Schlüssel- und Schließtechnik, elektronische
              Zutrittslösungen und Sicherheitstechnik.
            </p>

            {/*
              Solange die Firmendaten Platzhalter sind, entfällt die Anschrift. Den Hinweis
              sieht nur die Redaktion beim Entwickeln, nie ein Besucher (D-016, MENSCHEN M-01).
            */}
            {company.isPlaceholder ? (
              process.env.NODE_ENV !== 'production' && (
                <p className="mt-6 rounded-sm border border-warning/30 bg-warning-soft px-3 py-2 text-caption font-semibold text-foreground">
                  Hinweis für die Redaktion: Firmendaten sind noch Platzhalter.
                </p>
              )
            ) : (
              <address className="mt-6 text-small not-italic text-foreground-muted">
                {company.legalName}
                <br />
                {company.street}
                <br />
                {company.postalCode} {company.city}
                <br />
                <a
                  href={`tel:${company.phone}`}
                  className="font-mono tabular-nums transition-colors duration-quick hover:text-primary"
                >
                  {company.phone}
                </a>
                <br />
                <a href={`mailto:${company.email}`} className="transition-colors duration-quick hover:text-primary">
                  {company.email}
                </a>
              </address>
            )}
          </div>

          {/* Bereiche und Öffnungszeiten */}
          <div className="border-b border-border py-8 md:pl-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:pr-8">
            <Feldtitel>Bereiche</Feldtitel>
            <ul className="grid grid-cols-2 gap-x-6">
              {[...NAV_AREAS.map((area) => ({ href: area.href, label: area.label })), ...FOOTER_SHOP].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkKlasse}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Feldtitel>Öffnungszeiten</Feldtitel>
              <dl className="grid max-w-md grid-cols-3 gap-y-1 text-small">
                {settings.openingHours.map((entry) => (
                  <div key={entry.day} className="contents">
                    <dt className="text-foreground-muted">{formatWeekday(entry.day)}</dt>
                    <dd className="col-span-2 font-mono tabular-nums text-foreground">
                      {entry.spans.length === 0
                        ? 'geschlossen'
                        : entry.spans.map((s) => `${s.from}–${s.to}`).join(' · ')}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Service und Rechtliches */}
          <div className="grid grid-cols-2 gap-6 py-8 md:col-span-2 lg:col-span-3 lg:grid-cols-1 lg:pl-8">
            <div>
              <Feldtitel>Service</Feldtitel>
              <ul>
                {FOOTER_CONTENT.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkKlasse}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Feldtitel>Rechtliches</Feldtitel>
              <ul>
                {FOOTER_LEGAL.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkKlasse}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 font-mono text-caption text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SCHLÜSSELMACHER24</p>
          <p>Preise inklusive gesetzlicher Umsatzsteuer, zuzüglich Versandkosten.</p>
        </div>
      </div>
    </footer>
  );
}
