'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useKatalog } from '@/components/autoschluessel/fahrzeug-suche';
import { KATALOG_ADRESSE, type KatalogEintrag } from '@/components/autoschluessel/fahrzeug-ziel';
import { FahrzeugNichtGefunden } from '@/components/fahrzeug-anfrage/nicht-gefunden';
import { TextInput } from '@/components/forms/controls';
import { Field } from '@/components/forms/field';
import { scrollVerhalten } from '@/lib/bewegung';
import { sucheFahrzeuge } from '@/lib/fahrzeuge/suche';
import type { Erreichbarkeit } from '@/lib/types';

/** Satz des Blocks „Fahrzeug nicht gefunden?“ in der Kraftradsuche: Die freie Eingabe ist der erste Ausweg. */
export const KRAFTRAD_NICHT_GEFUNDEN = 'Ihr Fahrzeug ist nicht in der Liste? Tragen Sie Hersteller und Typ unten selbst ein. Oder rufen Sie uns an.';

/**
 * Suche über die Krafträder aus KBA FZ 2 (A-047): eine Erleichterung für Motorrad und Roller in der
 * gemeinsamen Anfrage (FA-KERN-02B). Ein Treffer füllt Hersteller und Typ vor; beide Felder bleiben frei
 * änderbar. Der Katalog kommt erst beim ersten Gebrauch. Darunter steht fest „Fahrzeug nicht gefunden?“.
 * `nichtGefundenHref` ist `null`, wo die Anfrage „nicht gefunden“ nicht passt (Roller: Sie verlangt immer
 * einen Fahrzeugschein); dann bleiben freie Eingabe und Telefon.
 */
export function KraftradSuche({
  onWahl,
  telefon,
  erreichbarkeit,
  nichtGefundenHref,
  label = 'Motorrad suchen (freiwillig)',
}: {
  onWahl: (eintrag: KatalogEintrag) => void;
  telefon?: string;
  erreichbarkeit?: Erreichbarkeit;
  nichtGefundenHref?: string | null;
  label?: string;
}) {
  const [text, setText] = useState('');
  const liste = useRef<HTMLUListElement>(null);
  const { status, katalog, laden } = useKatalog(KATALOG_ADRESSE.kraftrad);
  const suche = text.trim();
  const treffer = useMemo(
    () => (suche.length >= 2 ? sucheFahrzeuge(suche, katalog, { hoechstens: 6, klasse: 'kraftrad' }).map((t) => t.reihe) : []),
    [suche, katalog],
  );

  // Neue Treffer ins Bild holen: Auf dem Telefon läge die Liste sonst unter der festen Leiste des Ablaufs.
  const anzahl = treffer.length;
  useEffect(() => {
    if (anzahl > 0) liste.current?.scrollIntoView?.({ block: 'nearest', behavior: scrollVerhalten() });
  }, [anzahl]);

  return (
    <div className="space-y-3">
      <Field label={label} hint="Zum Beispiel „BMW R 1250 GS“ oder „Vespa GTS 125“. Ein Treffer füllt die Felder darunter aus.">
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
        <ul ref={liste} className="scroll-mb-48 divide-y divide-border rounded-lg border border-border bg-surface" aria-label="Treffer">
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
        <p className="text-small text-foreground-muted">Kein Treffer für „{suche}“. Tragen Sie Hersteller und Typ bitte unten selbst ein.</p>
      )}
      <FahrzeugNichtGefunden telefon={telefon} erreichbarkeit={erreichbarkeit} href={nichtGefundenHref} satz={KRAFTRAD_NICHT_GEFUNDEN} />
    </div>
  );
}
