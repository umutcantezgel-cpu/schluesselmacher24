'use client';

import Image from 'next/image';
import { useId, useState } from 'react';

import { cn } from '@/lib/cn';
import { umbauBeispielZeigbar } from '@/lib/data/fahrzeugteile';
import type { VergleichsBild } from '@/lib/types';

/*
 * Vorher-Nachher-Vergleich (FA-SHOP-02, FA-14-08, FA-20-05).
 *
 * - Zwei echte Fotos mit Beschriftung. Fehlt eines davon oder seine Beschriftung, erscheint
 *   nichts (keine Platzhalter, keine erzeugten Bilder, R4).
 * - Ruhige Fassung (Bewegung reduziert, ohne JavaScript): beide Bilder nebeneinander.
 * - Bewegte Fassung (`html[data-bewegung="an"]`, Variante `bewegt:`): Schieberegler über
 *   einem Bild. Der Regler ist ein natives `input type="range"`: Pfeiltasten, Bild auf und ab,
 *   Pos1 und Ende bewegen die Trennlinie.
 */

export interface VorherNachherProps {
  vorher: VergleichsBild;
  nachher: VergleichsBild;
  /** Überschrift des Vergleichs, etwa der Titel des Umbau-Beispiels. */
  titel?: string;
  className?: string;
  /** `sizes` für next/image. */
  sizes?: string;
}

/** Startposition der Trennlinie in Prozent. */
export const START_ANTEIL = 50;

/** Ansage des Reglers für Screenreader. */
export function reglerText(anteil: number): string {
  return `Links ${anteil} Prozent vorher, rechts ${100 - anteil} Prozent nachher`;
}

function Etikett({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'rounded bg-surface px-2 py-0.5 text-small font-semibold text-foreground shadow-sm',
        className,
      )}
    >
      {children}
    </span>
  );
}

function Einzelbild({ bild, etikett, sizes }: { bild: VergleichsBild; etikett: 'Vorher' | 'Nachher'; sizes: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-surface-muted">
        <Image src={bild.url} alt={bild.alt || bild.beschriftung} fill sizes={sizes} className="object-cover" />
        <Etikett className="absolute left-2 top-2">{etikett}</Etikett>
      </div>
      <p className="text-small text-foreground-muted">
        <span className="font-semibold text-foreground">{etikett}:</span> {bild.beschriftung}
      </p>
    </div>
  );
}

export function VorherNachher({ vorher, nachher, titel, className, sizes = '(min-width: 768px) 50vw, 100vw' }: VorherNachherProps) {
  const [anteil, setAnteil] = useState(START_ANTEIL);
  const reglerId = useId();

  if (!umbauBeispielZeigbar({ vorher, nachher })) return null;

  return (
    <figure className={cn('flex flex-col gap-3', className)} data-baustein="vorher-nachher">
      {titel ? <figcaption className="text-body font-semibold text-foreground">{titel}</figcaption> : null}

      {/* Ruhig: nebeneinander, ohne Regler. */}
      <div className="grid gap-4 sm:grid-cols-2 bewegt:hidden" data-ansicht="nebeneinander">
        <Einzelbild bild={vorher} etikett="Vorher" sizes={sizes} />
        <Einzelbild bild={nachher} etikett="Nachher" sizes={sizes} />
      </div>

      {/* Bewegt: ein Bild mit Trennlinie und Regler. */}
      <div className="hidden flex-col gap-2 bewegt:flex" data-ansicht="regler">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-surface-muted">
          <Image src={vorher.url} alt={vorher.alt || vorher.beschriftung} fill sizes={sizes} className="object-cover" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${anteil}%)` }}>
            <Image src={nachher.url} alt={nachher.alt || nachher.beschriftung} fill sizes={sizes} className="object-cover" />
          </div>
          <div aria-hidden className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-surface shadow" style={{ left: `${anteil}%` }} />
          <Etikett className="absolute left-2 top-2">Vorher</Etikett>
          <Etikett className="absolute right-2 top-2">Nachher</Etikett>
        </div>
        <label htmlFor={reglerId} className="text-small text-foreground-muted">
          Trennlinie verschieben: links vorher, rechts nachher
        </label>
        <input
          id={reglerId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={anteil}
          aria-valuetext={reglerText(anteil)}
          onChange={(e) => setAnteil(Number(e.currentTarget.value))}
          className="w-full accent-primary"
        />
        <p className="text-small text-foreground-muted">
          <span className="font-semibold text-foreground">Vorher:</span> {vorher.beschriftung}
        </p>
        <p className="text-small text-foreground-muted">
          <span className="font-semibold text-foreground">Nachher:</span> {nachher.beschriftung}
        </p>
      </div>
    </figure>
  );
}
