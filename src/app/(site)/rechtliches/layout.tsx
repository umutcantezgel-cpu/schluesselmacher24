import type { ReactNode } from 'react';
import Link from 'next/link';

import { FOOTER_LEGAL } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { istProduktion } from '@/lib/umgebung';

export default function RechtlichesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
        <nav
          aria-label="Rechtliche Hinweise"
          className="-mx-5 min-w-0 sm:-mx-6 lg:sticky lg:top-28 lg:col-span-3 lg:mx-0 lg:self-start"
        >
          <p className="mb-3 px-5 font-mono text-caption uppercase tracking-label text-foreground-muted sm:px-6 lg:px-0">
            Rechtliches
          </p>
          <ul className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 scroll-px-5 sm:px-6 sm:scroll-px-6 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:scroll-px-0">
            {FOOTER_LEGAL.map((link) => (
              <li key={link.href} className="shrink-0 snap-start">
                <Link
                  href={link.href}
                  className="inline-flex min-h-touch items-center rounded-md border border-border px-3 text-small text-foreground-muted hover:text-primary hover:underline lg:w-full lg:rounded-none lg:border-0 lg:px-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 lg:col-span-8 lg:col-start-5">
          {/* Nur außerhalb der Produktion: Die Texte sind Entwürfe und brauchen die Freigabe des Inhabers. */}
          {!istProduktion() && (
            <Alert tone="legal" title="Hinweis für die Redaktion" className="mb-8 max-w-measure">
              Diese Rechtstexte sind vollständige Entwürfe aus den Firmendaten im Backend. Sie müssen
              <strong> vor dem Livegang juristisch geprüft</strong> und freigegeben werden. Eine
              eigene Fassung (etwa vom Anwalt) lässt sich im Backend unter „Einstellungen →
              Rechtstexte“ hinterlegen und ersetzt dann den Entwurf. Dieser Kasten erscheint auf der
              Live-Seite nicht.
            </Alert>
          )}

          <article className="prose-sm24">{children}</article>
        </div>
      </div>
    </div>
  );
}
