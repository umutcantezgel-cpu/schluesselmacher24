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
    <div className="rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex gap-3 border-b border-border pb-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Calculator size={20} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-foreground">{titel}</h3>
          <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">{einleitung}</p>
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
      <legend className="text-sm font-semibold text-foreground">{legende}</legend>
      {hinweis && <p className="mt-1 text-[13px] text-foreground-subtle">{hinweis}</p>}
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
    <div className="space-y-4">
      <div aria-live="polite" className="rounded-lg border border-border bg-surface-muted p-4 md:p-5">
        {ergebnis.art === 'unvollstaendig' ? (
          <p className="text-[15px] leading-relaxed text-foreground-muted">{aufforderung}</p>
        ) : (
          <>
            {ergebnis.art === 'spanne' ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Richtwert für Ihre Auswahl
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-foreground">
                  {spanneText(ergebnis.spanne)}
                </p>
                <p className="mt-1 text-[13px] text-foreground-muted">
                  {['inklusive Umsatzsteuer', zusatz].filter(Boolean).join(', ')}
                </p>
              </>
            ) : (
              <p className="text-[15px] font-semibold leading-relaxed text-foreground">{KEIN_RICHTWERT_TEXT}</p>
            )}

            <dl className="mt-4 divide-y divide-border border-t border-border">
              {zusammenfassung.map((zeile) => (
                <div key={zeile.label} className="grid gap-0.5 py-2.5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3">
                  <dt className="text-[13px] font-semibold text-foreground-muted">{zeile.label}</dt>
                  <dd className="text-[14px] text-foreground">{zeile.wert}</dd>
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
