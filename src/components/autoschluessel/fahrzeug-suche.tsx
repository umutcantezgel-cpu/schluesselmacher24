'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Field } from '@/components/forms/field';
import { TextInput } from '@/components/forms/controls';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { sucheFahrzeuge } from '@/lib/fahrzeuge/suche';
import type { VehicleMake } from '@/lib/types';

import { anfrageHref, fahrzeugZiel, KATALOG_QUELLE, markenZuordnung, type FahrzeugZiel, type KatalogEintrag } from './fahrzeug-ziel';

const HINWEIS: Record<FahrzeugZiel['art'], string> = {
  gepflegt: 'Preis und Termin online',
  marke: 'Termin nach Prüfung Ihrer Angaben',
  anfrage: 'Anfrage mit Fahrzeugschein und Schlüsselfoto',
};

/**
 * Fahrzeugsuche über den ganzen Katalog (G-14): Marke und Modell in einem Feld, Tippfehler
 * erlaubt, gewichtet nach Bestand. Ein Treffer führt je nach Datenlage in den Weg mit Preis und
 * Anzahlung, in „Modell nicht aufgeführt“ oder in die Anfrage (G-15). „Nicht dabei“ führt immer
 * in die Anfrage.
 */
export function FahrzeugSuche({
  katalog,
  makes,
  onWahl,
}: {
  katalog: KatalogEintrag[];
  makes: VehicleMake[];
  onWahl: (ziel: Exclude<FahrzeugZiel, { art: 'anfrage' }>) => void;
}) {
  const [text, setText] = useState('');
  const marken = useMemo(() => markenZuordnung(katalog, makes), [katalog, makes]);
  const suche = text.trim();
  const treffer = useMemo(
    () => (suche.length >= 2 ? sucheFahrzeuge(suche, katalog, { hoechstens: 6 }).map((t) => fahrzeugZiel(t.reihe, makes, marken)) : []),
    [suche, katalog, makes, marken],
  );

  return (
    <div className="space-y-3">
      <Field label="Marke und Modell" hint="Zum Beispiel „VW Golf“ oder „Opel Corsa“. Tippfehler sind kein Problem.">
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            aria-describedby={describedBy}
            type="search"
            value={text}
            onChange={(event) => setText(event.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
        )}
      </Field>

      <p aria-live="polite" className="sr-only">
        {suche.length >= 2 ? `${treffer.length} Treffer` : ''}
      </p>

      {treffer.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface" aria-label="Treffer">
          {treffer.map((ziel) => {
            const inhalt = (
              <>
                <span className="min-w-0">
                  <span className="block text-body font-semibold text-foreground">{ziel.name}</span>
                  <span className="block text-small text-foreground-muted">{HINWEIS[ziel.art]}</span>
                </span>
                <GlyphPfeilRechts size={18} className="shrink-0 text-foreground-muted" />
              </>
            );
            const klasse =
              'flex min-h-touch-lg w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-quick hover:bg-surface-muted';
            return (
              <li key={ziel.name}>
                {ziel.art === 'anfrage' ? (
                  <Link href={anfrageHref(ziel.name)} className={klasse}>
                    {inhalt}
                  </Link>
                ) : (
                  <button type="button" onClick={() => onWahl(ziel)} className={klasse}>
                    {inhalt}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {suche.length >= 2 && treffer.length === 0 && (
        <p className="text-small text-foreground-muted">
          Kein Treffer für „{suche}“.{' '}
          <Link href={anfrageHref(suche)} className="font-semibold text-primary hover:underline">
            Fahrzeug trotzdem anfragen
          </Link>
        </p>
      )}

      <p className="text-caption text-foreground-muted">{KATALOG_QUELLE}</p>
    </div>
  );
}
