import type { ReactNode } from 'react';

import type { SummarySection } from '@/lib/types';
import { cn } from '@/lib/cn';

/** Beträge („1.234,50 €“), Stückzahlen („2 Stück“) und Maße („30 mm“) in einem Anzeigetext. */
const ZAHLENTEIL = /(\d+(?:,\d+)?\s(?:mm|Stück)|\d{1,3}(?:\.\d{3})*,\d{2}\s€)/;

/**
 * Zerlegt einen Anzeigetext in Teile; Zahlen mit Einheit sind als `mono` markiert,
 * damit sie im Schriftfeld in Mono mit Tabellenziffern stehen, der Text daneben nicht.
 */
export function monoTeile(text: string): { text: string; mono: boolean }[] {
  return text
    .split(ZAHLENTEIL)
    .map((teil, index) => ({ text: teil, mono: index % 2 === 1 }))
    .filter((teil) => teil.text !== '');
}

function MonoText({ text }: { text: string }) {
  return (
    <>
      {monoTeile(text).map((teil, index): ReactNode =>
        teil.mono ? (
          <span key={index} className="font-mono tabular-nums">
            {teil.text}
          </span>
        ) : (
          teil.text
        ),
      )}
    </>
  );
}

/**
 * Strukturierte Zusammenfassung — identisch im Kundenformular und im
 * Backend, damit beide Seiten dieselbe Sicht auf den Vorgang haben.
 *
 * - `karte` (Standard): Abschnitte als Karten.
 * - `schriftfeld`: Haarlinien wie ein Schriftfeld; Zahlen mit Einheit in Mono, die Zeile
 *   mit der Beschriftung `hervorheben` (etwa „Gesamtbetrag“) groß in Mono.
 */
export function SummaryList({
  sections,
  className,
  variante = 'karte',
  hervorheben,
}: {
  sections: SummarySection[];
  className?: string;
  variante?: 'karte' | 'schriftfeld';
  hervorheben?: string;
}) {
  if (sections.length === 0) return null;

  if (variante === 'schriftfeld') {
    return (
      <div className={cn('space-y-6', className)}>
        {sections.map((section) => (
          <div key={section.title}>
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">{section.title}</p>
            <dl className="mt-2 border-t border-border">
              {section.rows.map((row, index) => (
                <div
                  key={`${row.label}-${index}`}
                  className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4"
                >
                  <dt className="text-small font-semibold text-foreground-muted sm:col-span-5">{row.label}</dt>
                  <dd
                    className={cn(
                      'sm:col-span-7',
                      row.label === hervorheben
                        ? 'font-mono text-title font-semibold tabular-nums text-foreground'
                        : 'text-body text-foreground',
                    )}
                  >
                    {row.label === hervorheben ? row.value : <MonoText text={row.value} />}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-5', className)}>
      {sections.map((section) => (
        <div key={section.title} className="overflow-hidden rounded-lg border border-border bg-surface">
          <p className="border-b border-border bg-surface-muted px-4 py-2.5 text-caption font-mono uppercase tracking-label text-foreground-muted">
            {section.title}
          </p>
          <dl className="divide-y divide-border">
            {section.rows.map((row, index) => (
              <div key={`${row.label}-${index}`} className="grid gap-1 px-4 py-3 sm:grid-cols-12 sm:gap-4">
                <dt className="text-small font-semibold text-foreground-muted sm:col-span-4">{row.label}</dt>
                <dd className="text-body text-foreground sm:col-span-8">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
