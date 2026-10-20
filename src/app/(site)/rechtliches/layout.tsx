import type { ReactNode } from 'react';
import Link from 'next/link';

import { FOOTER_LEGAL } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';

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
          <Alert tone="legal" title="Hinweis zum Stand dieser Seite" className="mb-8 max-w-measure">
            Die folgenden Texte sind als vollständig aufgebautes Gerüst angelegt. Die mit
            <strong> [Platzhalter: …]</strong> gekennzeichneten Stellen müssen ausgefüllt und der
            gesamte Text muss <strong>vor dem Livegang juristisch geprüft</strong> werden. Besonders
            zu prüfen sind kundenspezifische Sonderanfertigungen, Anzahlungen, Datei-Uploads und
            Überwachungstechnik. Hier steht bewusst kein erfundener Rechtstext.
          </Alert>

          <article className="prose-sm24">{children}</article>
        </div>
      </div>
    </div>
  );
}
