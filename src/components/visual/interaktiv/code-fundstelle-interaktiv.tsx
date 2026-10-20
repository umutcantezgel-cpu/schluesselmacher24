'use client';

import { useId, useState, type KeyboardEvent } from 'react';

import { CodeFundstelleGrafik } from '@/components/visual/generators/code-fundstelle';
import { cn } from '@/lib/cn';

import { naechsterIndex } from './auswahl';

export type Fundort = 'schluesselkopf' | 'sicherungskarte' | 'zylinderstirn';

const ORTE: { ort: Fundort; name: string }[] = [
  { ort: 'schluesselkopf', name: 'Am Schlüsselkopf' },
  { ort: 'sicherungskarte', name: 'Auf der Sicherungskarte' },
  { ort: 'zylinderstirn', name: 'Auf der Zylinderstirn' },
];

/** Zeichenfläche ohne Kartenrahmen, auf dem Bereichston (Befund H06, Muster Modellseite). */
const FLAECHE = 'rounded-lg bg-area-soft/40 p-4 sm:p-6 lg:max-w-lg';

export interface CodeFundstelleInteraktivProps {
  /** Kurzer Hinweis je Ort unter der Zeichnung (aus den Inhalten der Seite). */
  texte?: Partial<Record<Fundort, string>>;
  className?: string;
}

/**
 * Großer Moment des Code-Shops (B-16): Wo steht die Schlüsselnummer? Drei
 * Registerkarten (Pfeiltasten, Pos1, Ende) wechseln die Zeichnung mit einer
 * kurzen Überblendung. Nach dem ersten Wechsel spielen die Einstiegsbewegungen
 * der Zeichnung nicht erneut (`sm24-ruhig`).
 */
export function CodeFundstelleInteraktiv({ texte, className }: CodeFundstelleInteraktivProps) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const [gewechselt, setGewechselt] = useState(false);
  const aktiv = ORTE[index];

  const waehlen = (neu: number) => {
    setIndex(neu);
    setGewechselt(true);
  };

  const taste = (event: KeyboardEvent<HTMLButtonElement>) => {
    const ziel = naechsterIndex(index, event.key, ORTE.length);
    if (ziel === null) return;
    event.preventDefault();
    waehlen(ziel);
    document.getElementById(`${id}-tab-${ORTE[ziel].ort}`)?.focus();
  };

  return (
    <div className={cn('grid gap-5', className)}>
      {/* Leiste wie in K-006: mobil horizontal mit Anschnitt, ab md als feste Segmentleiste */}
      <div className="-mx-5 snap-x snap-mandatory overflow-x-auto px-5 pb-2 scroll-px-5 sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0 md:scroll-px-0">
        <div
          role="tablist"
          aria-label="Wo steht die Schlüsselnummer?"
          className="flex w-max divide-x divide-border-strong rounded-md border border-border-strong bg-surface"
        >
          {ORTE.map((eintrag, i) => (
            <button
              key={eintrag.ort}
              id={`${id}-tab-${eintrag.ort}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls={`${id}-panel`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => waehlen(i)}
              onKeyDown={taste}
              className={cn(
                'inline-flex min-h-touch shrink-0 snap-start items-center whitespace-nowrap px-3 text-small font-semibold transition-colors duration-quick ease-standard first:rounded-l-md last:rounded-r-md focus-visible:ring-inset focus-visible:ring-offset-0',
                i === index
                  ? 'bg-area-soft text-area-strong'
                  : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground',
              )}
            >
              {eintrag.name}
            </button>
          ))}
        </div>
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${aktiv.ort}`}
        className={cn(FLAECHE, gewechselt && 'sm24-ruhig')}
      >
        <div key={aktiv.ort} className={cn(gewechselt && 'animate-schleier-ein')}>
          <CodeFundstelleGrafik params={{ ort: aktiv.ort }} title="" />
        </div>
        {texte?.[aktiv.ort] && <p className="mt-4 max-w-measure text-body text-foreground-muted">{texte[aktiv.ort]}</p>}
      </div>
    </div>
  );
}
