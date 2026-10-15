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
      <div role="tablist" aria-label="Wo steht die Schlüsselnummer?" className="flex flex-wrap gap-2">
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
              'inline-flex min-h-touch items-center rounded-full border px-4 text-small font-semibold transition-colors duration-quick ease-standard',
              i === index
                ? 'border-area bg-area-soft text-area-strong'
                : 'border-border-strong bg-surface text-foreground-muted hover:border-area hover:text-foreground',
            )}
          >
            {eintrag.name}
          </button>
        ))}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${aktiv.ort}`}
        className={cn('rounded-lg border border-border bg-surface p-4 sm:p-6', gewechselt && 'sm24-ruhig')}
      >
        <div key={aktiv.ort} className={cn(gewechselt && 'animate-schleier-ein')}>
          <CodeFundstelleGrafik params={{ ort: aktiv.ort }} title="" />
        </div>
        {texte?.[aktiv.ort] && <p className="mt-4 max-w-measure text-body text-foreground-muted">{texte[aktiv.ort]}</p>}
      </div>
    </div>
  );
}
