import type { ReactNode } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';

import { orientierungsHinweis, spanneText } from '@/lib/richtwerte/rechnen';
import type { AuswahlZeile, RichtwertErgebnis as Ergebnis } from '@/lib/richtwerte/typen';
import { ButtonLink } from '@/components/ui/button';

/* Gemeinsame Bausteine der Orientierungsrechner — beide Rechner sehen gleich
 * aus und sagen dasselbe, nur die Auswahl unterscheidet sich. */

export function RechnerRahmen({
  titel,
  einleitung,
  children,
}: {
  titel: string;
  einleitung: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <div className="flex gap-4 border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260)] text-white shadow-sm">
          <Calculator size={20} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">{titel}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">{einleitung}</p>
        </div>
      </div>
      <div className="mt-5 space-y-6">{children}</div>
    </div>
  );
}

export function Auswahlgruppe({
  legende,
  hinweis,
  children,
}: {
  legende: string;
  hinweis?: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-base font-semibold text-[oklch(0.16_0.02_260)]">{legende}</legend>
      {hinweis && <p className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">{hinweis}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/**
 * Die Auswahlkarten verstecken ihr Eingabefeld; der Tastaturfokus wird
 * deshalb am Rahmen der Karte sichtbar gemacht.
 */
export function Fokusrahmen({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background">
      {children}
    </div>
  );
}

export const KEIN_RICHTWERT_TEXT = 'Für diese Auswahl nennen wir Ihnen den Rahmen nach einer kurzen Anfrage.';

export interface RichtwertErgebnisProps {
  ergebnis: Ergebnis;
  zusammenfassung: AuswahlZeile[];
  hinweis: string | null;
  /** Was noch fehlt, solange die Auswahl unvollständig ist. */
  aufforderung: string;
  /** Ergänzung unter dem Betrag, z. B. „einschließlich Anfahrt“. */
  zusatz?: string;
  anfrageHref: string;
}

/**
 * Ergebnisbereich: eine Spanne nur, wenn alle Beträge gepflegt sind — sonst
 * die Auswahl und die Bitte um eine Anfrage. Nie ein erfundener Betrag.
 */
export function RichtwertErgebnis({
  ergebnis,
  zusammenfassung,
  hinweis,
  aufforderung,
  zusatz,
  anfrageHref,
}: RichtwertErgebnisProps) {
  return (
    <div className="space-y-6 pt-4">
      <div aria-live="polite" className="rounded-xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
        {ergebnis.art === 'unvollstaendig' ? (
          <p className="text-[15px] leading-relaxed text-foreground-muted">{aufforderung}</p>
        ) : (
          <>
            {ergebnis.art === 'spanne' ? (
              <>
                <p className="text-sm text-[oklch(0.52_0.015_260)] font-medium">
                  Richtwert für Ihre Auswahl
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums text-[oklch(0.16_0.02_260)]">
                  {spanneText(ergebnis.spanne)}
                </p>
                <p className="mt-1 text-[13px] text-foreground-muted">
                  {['inklusive Umsatzsteuer', zusatz].filter(Boolean).join(', ')}
                </p>
              </>
            ) : (
              <p className="text-[15px] font-semibold leading-relaxed text-foreground">{KEIN_RICHTWERT_TEXT}</p>
            )}

            <dl className="mt-6 divide-y divide-[oklch(0.890_0.008_260/0.55)] border-t border-[oklch(0.890_0.008_260/0.55)] pt-2">
              {zusammenfassung.map((zeile) => (
                <div key={zeile.label} className="flex items-center justify-between py-3">
                  <dt className="text-sm font-medium text-[oklch(0.32_0.02_260)]">{zeile.label}</dt>
                  <dd className="text-sm font-medium text-[oklch(0.16_0.02_260)] text-right">{zeile.wert}</dd>
                </div>
              ))}
            </dl>

            {ergebnis.art === 'spanne' && (
              <p className="mt-3 text-[13px] leading-relaxed text-foreground-muted">{orientierungsHinweis(hinweis)}</p>
            )}
          </>
        )}
      </div>

      <ButtonLink href={anfrageHref} fullWidth>
        Anfrage stellen
        <ArrowRight size={18} aria-hidden />
      </ButtonLink>
    </div>
  );
}
