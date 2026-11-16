'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';

import { TextInput } from '@/components/forms/controls';
import { useKatalog } from '@/components/autoschluessel/fahrzeug-suche';
import { KATALOG_ADRESSE, KATALOG_QUELLE } from '@/components/autoschluessel/fahrzeug-ziel';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { sucheFahrzeuge } from '@/lib/fahrzeuge/suche';
import { fahrzeugFilter, type FahrzeugteilFilter } from '@/lib/data/fahrzeugteile';

import { teileAdresse } from './ansicht';

/** Rückfall, wenn die Suche nichts findet: das Filterformular darunter oder ein Verweis auf die Liste. */
export type MeinFahrzeugRueckfall =
  | { art: 'filter'; feld: 'modell' | 'marke' }
  | { art: 'verweis'; href: string; label: string };

/**
 * „Mein Fahrzeug“ über die vorhandene Fahrzeugsuche (FA-SHOP-02B, FA-14-10): derselbe Pkw-Katalog und
 * dieselbe Suche wie im Autoschlüssel-Assistenten. Jeder Treffer ist ein Verweis auf die Liste mit Marke
 * und Reihe in der Adresse; die übrigen Merkmale des Filters bleiben. Findet die Suche nichts oder ist die
 * Fahrzeugliste nicht erreichbar, nennt der Baustein den Rückfall: auf der Liste das Filterformular
 * darunter, auf anderen Seiten einen Verweis auf die Liste. Ohne JavaScript braucht jede Seite neben
 * dem Baustein einen gewöhnlichen Weg in die Liste.
 */
export function MeinFahrzeug({ filter = {}, rueckfall }: { filter?: FahrzeugteilFilter; rueckfall: MeinFahrzeugRueckfall }) {
  const [text, setText] = useState('');
  const id = useId();
  const { status, katalog, laden } = useKatalog(KATALOG_ADRESSE.pkw);
  const suche = text.trim();
  const treffer = useMemo(
    () => (suche.length >= 2 ? sucheFahrzeuge(suche, katalog, { hoechstens: 6, klasse: 'pkw' }) : []),
    [suche, katalog],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-small font-semibold text-foreground">
          Mein Fahrzeug: Marke und Modell
        </label>
        <TextInput
          id={id}
          aria-describedby={`${id}-hinweis`}
          type="search"
          value={text}
          onFocus={laden}
          onChange={(event) => {
            setText(event.target.value);
            laden();
          }}
          autoComplete="off"
          enterKeyHint="search"
        />
        <p id={`${id}-hinweis`} className="text-small leading-snug text-foreground-subtle">
          Zum Beispiel „VW Golf“. Tippfehler sind kein Problem.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {suche.length >= 2 && status === 'bereit' ? `${treffer.length} Treffer` : ''}
      </p>
      {suche.length >= 2 && status === 'laedt' && <p className="text-small text-foreground-muted">Fahrzeugliste wird geladen.</p>}
      {status === 'fehler' && (
        <p className="text-small text-foreground-muted" role="status">
          Die Fahrzeugliste ist gerade nicht erreichbar. <RueckfallText rueckfall={rueckfall} />
        </p>
      )}
      {suche.length >= 2 && status === 'bereit' && treffer.length === 0 && (
        <p className="text-small text-foreground-muted">
          Kein Treffer für „{suche}“. <RueckfallText rueckfall={rueckfall} />
        </p>
      )}

      {treffer.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface" aria-label="Treffer">
          {treffer.map(({ reihe }) => (
            <li key={reihe.id}>
              <Link
                href={teileAdresse({ ...filter, ...fahrzeugFilter(reihe) })}
                className="flex min-h-touch-lg w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-quick hover:bg-surface-muted"
              >
                <span className="text-body font-semibold text-foreground">
                  {reihe.marke} {reihe.reihe}
                </span>
                <GlyphPfeilRechts size={18} className="shrink-0 text-foreground-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="text-caption text-foreground-muted">{KATALOG_QUELLE}</p>
    </div>
  );
}

function RueckfallText({ rueckfall }: { rueckfall: MeinFahrzeugRueckfall }) {
  if (rueckfall.art === 'filter') {
    return <>{rueckfall.feld === 'modell' ? 'Wählen Sie das Modell bitte im Filter darunter.' : 'Wählen Sie die Marke bitte im Filter darunter.'}</>;
  }
  return (
    <Link href={rueckfall.href} className="font-semibold text-primary underline-offset-2 hover:underline">
      {rueckfall.label}
    </Link>
  );
}
