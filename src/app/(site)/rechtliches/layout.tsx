import type { ReactNode } from 'react';
import Link from 'next/link';

import { FOOTER_LEGAL } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';

export default function RechtlichesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <nav aria-label="Rechtliche Hinweise" className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
            Rechtliches
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-2">
            {FOOTER_LEGAL.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[14px] text-foreground-muted hover:text-primary hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Alert tone="legal" title="Hinweis zum Stand dieser Seite" className="mb-8">
            Die folgenden Texte sind als vollständig aufgebautes Gerüst angelegt. Die mit
            <strong> [Platzhalter: …]</strong> gekennzeichneten Stellen müssen ausgefüllt und der
            gesamte Text muss <strong>vor dem Livegang juristisch geprüft</strong> werden. Besonders
            zu prüfen sind kundenspezifische Sonderanfertigungen, Anzahlungen, Datei-Uploads und
            Überwachungstechnik. Hier steht bewusst kein erfundener Rechtstext.
          </Alert>

          <article className="prose-sm24 max-w-3xl">{children}</article>
        </div>
      </div>
    </div>
  );
}
