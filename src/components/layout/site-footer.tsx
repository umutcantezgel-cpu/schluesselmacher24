import Link from 'next/link';
import { getSettings } from '@/lib/data';
import { FOOTER_CONTENT, FOOTER_LEGAL, NAV_AREAS, type NavLink } from '@/lib/navigation';
import { formatWeekday } from '@/lib/format';

/** Shop-Seiten ohne eigenen Leistungsbereich — stehen im Anschluss an die Bereiche. */
const FOOTER_SHOP: NavLink[] = [{ href: '/artikel', label: 'Artikel' }];

export async function SiteFooter() {
  const settings = await getSettings();
  const { company } = settings;

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="shell py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marke und Anschrift */}
          <div>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                SCHLÜSSELMACHER
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-primary">24</span>
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground-muted">
              Fachbetrieb für Autoschlüssel, Schlüssel- und Schließtechnik, elektronische
              Zutrittslösungen und Sicherheitstechnik.
            </p>

            <address className="mt-5 not-italic text-[13px] leading-relaxed text-foreground-muted">
              {company.legalName}
              <br />
              {company.street}
              <br />
              {company.postalCode} {company.city}
              <br />
              <a href={`tel:${company.phone}`} className="hover:text-primary hover:underline">
                {company.phone}
              </a>
              <br />
              <a href={`mailto:${company.email}`} className="hover:text-primary hover:underline">
                {company.email}
              </a>
            </address>

            {company.isPlaceholder && (
              <p className="mt-3 rounded border border-warning/30 bg-warning-soft px-2.5 py-2 text-[11px] font-semibold text-foreground">
                Hinweis für die Redaktion: Firmendaten sind noch Platzhalter.
              </p>
            )}
          </div>

          {/* Bereiche */}
          <div className="lg:col-span-2">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Bereiche
            </p>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {NAV_AREAS.map((area) => (
                <li key={area.key}>
                  <Link
                    href={area.href}
                    className="text-[13px] text-foreground-muted hover:text-primary hover:underline"
                  >
                    {area.label}
                  </Link>
                </li>
              ))}
              {FOOTER_SHOP.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-foreground-muted hover:text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mb-3 mt-8 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Öffnungszeiten
            </p>
            <ul className="space-y-1">
              {settings.openingHours.map((entry) => (
                <li key={entry.day} className="flex gap-3 text-[13px] text-foreground-muted">
                  <span className="w-24 shrink-0">{formatWeekday(entry.day)}</span>
                  <span>
                    {entry.spans.length === 0
                      ? 'geschlossen'
                      : entry.spans.map((s) => `${s.from}–${s.to}`).join(' · ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Service und Rechtliches */}
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Service
            </p>
            <ul className="space-y-2">
              {FOOTER_CONTENT.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-foreground-muted hover:text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mb-3 mt-8 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Rechtliches
            </p>
            <ul className="space-y-2">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-foreground-muted hover:text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-[12px] text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SCHLÜSSELMACHER24</p>
          <p>Preise inklusive gesetzlicher Umsatzsteuer, zuzüglich Versandkosten.</p>
        </div>
      </div>
    </footer>
  );
}
