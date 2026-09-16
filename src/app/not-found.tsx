import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button';
import { NAV_AREAS } from '@/lib/navigation';

export default function NotFound() {
  return (
    <div className="shell flex flex-col items-start py-16 md:py-24">
      <p className="eyebrow">
        <span className="h-px w-6 bg-current" aria-hidden />
        Fehler 404
      </p>
      <h1 className="mt-3 text-[1.75rem] font-bold leading-tight md:text-4xl">
        Diese Seite gibt es nicht.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-foreground-muted md:text-lg">
        Die Adresse ist falsch geschrieben oder die Seite wurde verschoben. Unten finden Sie
        alle Bereiche im Überblick.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <ButtonLink href="/">Zur Startseite</ButtonLink>
        <ButtonLink href="/service-und-termin/kontakt" variant="outline">
          Kontakt aufnehmen
        </ButtonLink>
      </div>

      <ul className="mt-12 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NAV_AREAS.map((area) => (
          <li key={area.key}>
            <Link
              href={area.href}
              className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <span className="block text-[15px] font-semibold text-foreground">{area.label}</span>
              <span className="mt-1 block text-[13px] leading-snug text-foreground-muted">
                {area.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
