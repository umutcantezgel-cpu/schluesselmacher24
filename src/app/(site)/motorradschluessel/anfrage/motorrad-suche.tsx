'use client';

import { useMemo, useState } from 'react';

import { useKatalog } from '@/components/autoschluessel/fahrzeug-suche';
import { KATALOG_ADRESSE, type KatalogEintrag } from '@/components/autoschluessel/fahrzeug-ziel';
import { TextInput } from '@/components/forms/controls';
import { Field } from '@/components/forms/field';
import { sucheFahrzeuge } from '@/lib/fahrzeuge/suche';

/**
 * Suche über die Krafträder aus KBA FZ 2 (A-047): eine Erleichterung im Motorradweg. Ein Treffer füllt
 * Hersteller und Typ vor; beide Felder bleiben frei änderbar. Der Katalog kommt erst beim ersten Gebrauch.
 */
export function MotorradSuche({ onWahl }: { onWahl: (eintrag: KatalogEintrag) => void }) {
  const [text, setText] = useState('');
  const { status, katalog, laden } = useKatalog(KATALOG_ADRESSE.kraftrad);
  const suche = text.trim();
  const treffer = useMemo(
    () => (suche.length >= 2 ? sucheFahrzeuge(suche, katalog, { hoechstens: 6, klasse: 'kraftrad' }).map((t) => t.reihe) : []),
    [suche, katalog],
  );

  return (
    <div className="space-y-3">
      <Field label="Motorrad suchen (freiwillig)" hint="Zum Beispiel „BMW R 1250 GS“ oder „Vespa GTS 125“. Ein Treffer füllt die Felder darunter aus.">
        {({ id, describedBy }) => (
          <TextInput
            id={id}
            aria-describedby={describedBy}
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
        )}
      </Field>

      <p aria-live="polite" className="sr-only">
        {suche.length >= 2 && status === 'bereit' ? `${treffer.length} Treffer` : ''}
      </p>
      {suche.length >= 2 && status === 'laedt' && <p className="text-small text-foreground-muted">Liste der Krafträder wird geladen.</p>}
      {status === 'fehler' && (
        <p className="text-small text-foreground-muted" role="status">
          Die Liste ist gerade nicht erreichbar. Tragen Sie Hersteller und Typ bitte selbst ein.{' '}
          <button type="button" onClick={laden} className="font-semibold text-primary hover:underline">
            Erneut versuchen
          </button>
        </p>
      )}

      {treffer.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface" aria-label="Treffer">
          {treffer.map((eintrag) => (
            <li key={eintrag.id}>
              <button
                type="button"
                onClick={() => {
                  onWahl(eintrag);
                  setText('');
                }}
                className="flex min-h-touch w-full items-center px-4 py-3 text-left text-body font-semibold text-foreground transition-colors duration-quick hover:bg-surface-muted"
              >
                {eintrag.marke} {eintrag.reihe}
              </button>
            </li>
          ))}
        </ul>
      )}
      {suche.length >= 2 && status === 'bereit' && treffer.length === 0 && (
        <p className="text-small text-foreground-muted">Kein Treffer für „{suche}“.</p>
      )}
    </div>
  );
}
