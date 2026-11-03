import { FachIcon } from '@/components/visual/fach-icon';
import type { Rubrik } from '@/lib/types';

/** Platzhalter in Schritt-Texten, die aus den Einstellungen gefüllt werden (G9: Werte nie im Text). */
export const ABLAUF_PLATZHALTER = ['anzahlung', 'vorlauf'] as const;
export type AblaufWerte = Partial<Record<(typeof ABLAUF_PLATZHALTER)[number], string>>;

/** Setzt `{anzahlung}` und `{vorlauf}` ein; ein Satz mit fehlendem Wert entfällt, statt eine Lücke zu zeigen. */
export function ablaufText(text: string, werte: AblaufWerte = {}): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((satz) =>
      satz.replace(/\{([a-z]+)\}/g, (roh, name: string) => (name in werte && werte[name as keyof AblaufWerte] ? werte[name as keyof AblaufWerte]! : roh)),
    )
    .filter((satz) => !/\{[a-z]+\}/.test(satz))
    .join(' ');
}

/**
 * „So läuft Ihr Auftrag ab“ (G-10) aus den Rubrikdaten (`rubrik.ablauf`): nummerierte Schritte mit
 * Fach-Icon auf einer Schiene, deren Fortschritt mit dem Scrollen läuft (B-03, `sm24-scrub-*`, nur wo
 * unterstützt; sonst steht die Schiene ruhig). Eine neue Rubrik bekommt ihren Ablauf ohne Umbau (G-11).
 */
export function RubrikAblauf({ rubrik, werte, className }: { rubrik: Pick<Rubrik, 'ablauf' | 'id'>; werte?: AblaufWerte; className?: string }) {
  if (!rubrik.ablauf.length) return null;
  return (
    <ol className={className ? `relative ${className}` : 'relative'} data-ablauf={rubrik.id}>
      {/* Schiene und Fortschritt: der Strich füllt sich, während die Schritte vorbeiziehen */}
      <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px bg-border-strong" />
      <span aria-hidden className="sm24-scrub-y absolute bottom-6 left-5 top-6 w-px bg-area" />
      {rubrik.ablauf.map((schritt, index) => (
        <li key={`${index}-${schritt.titel}`} className="relative flex gap-6 pb-10 last:pb-0">
          <span
            aria-hidden
            className="sm24-scrub-marke relative z-raised flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-area bg-surface font-mono text-small font-semibold tabular-nums text-area-strong"
          >
            {index + 1}
          </span>
          <div className="pt-1.5">
            <p className="flex items-center gap-2.5 text-title-sm font-semibold text-foreground">
              <FachIcon name={schritt.icon} size={28} aria-hidden className="shrink-0 text-area-strong" />
              <span>
                <span className="sr-only">Schritt {index + 1}: </span>
                {schritt.titel}
              </span>
            </p>
            <p className="mt-1.5 max-w-measure text-body text-foreground-muted">{ablaufText(schritt.text, werte)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
