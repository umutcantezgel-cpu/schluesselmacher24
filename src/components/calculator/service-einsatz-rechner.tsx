'use client';

import { useId, useState } from 'react';

import { MAX_TUEREN, serviceEinsatzBerechnen, serviceEinsatzZusammenfassung } from '@/lib/richtwerte/rechnen';
import type { ServiceEinsatzWerte } from '@/lib/richtwerte/typen';
import { QuantityInput } from '@/components/forms/controls';
import { Field } from '@/components/forms/field';
import { OptionCard } from '@/components/forms/option-card';
import { Auswahlgruppe, Fokusrahmen, RechnerRahmen, RichtwertErgebnis } from './rechner-bausteine';

export interface ServiceEinsatzRechnerProps {
  /** Aufbereitete Richtwerte aus `getRichtwerte()` — kommen von der Seite. */
  werte: ServiceEinsatzWerte;
  anfrageHref: string;
}

/** Orientierung für einen Serviceeinsatz: Leistungen, Anzahl Türen, Anfahrt. */
export function ServiceEinsatzRechner({ werte, anfrageHref }: ServiceEinsatzRechnerProps) {
  const name = useId();
  const [leistungen, setLeistungen] = useState<string[]>([]);
  const [anzahlTueren, setAnzahlTueren] = useState(1);

  const auswahl = { leistungen, anzahlTueren };
  const auswaehlbar = werte.leistungen.length > 0;
  // Die Türanzahl zählt nur für Leistungen, die je Tür berechnet werden.
  const mitTueren = werte.leistungen.some((l) => l.einheit === 'je-tuer');

  function umschalten(kennung: string) {
    setLeistungen((vorher) =>
      vorher.includes(kennung) ? vorher.filter((k) => k !== kennung) : [...vorher, kennung],
    );
  }

  return (
    <RechnerRahmen
      titel="Orientierung für Ihren Serviceeinsatz"
      einleitung="Wählen Sie die Leistungen und die Zahl der Türen. Soweit möglich, zeigen wir eine unverbindliche Spanne einschließlich Anfahrt."
    >
      {auswaehlbar && (
        <>
          <Auswahlgruppe legende="1. Welche Leistungen brauchen Sie?" hinweis="Mehrfachauswahl möglich.">
            {werte.leistungen.map((l) => (
              <Fokusrahmen key={l.kennung}>
                <OptionCard
                  multiple
                  name={`${name}-leistungen`}
                  value={l.kennung}
                  checked={leistungen.includes(l.kennung)}
                  onSelect={umschalten}
                  title={l.label}
                  description={l.beschreibung ?? undefined}
                  meta={l.einheit === 'je-tuer' ? 'je Tür' : 'pauschal'}
                />
              </Fokusrahmen>
            ))}
          </Auswahlgruppe>

          {mitTueren && (
            <Field label="2. Anzahl Türen" hint="Zählt nur für Leistungen, die je Tür berechnet werden.">
              {({ id }) => (
                // Eigener Block, damit das Zählfeld nicht auf volle Breite gezogen wird.
                <div>
                  <QuantityInput
                    id={id}
                    label="Anzahl Türen"
                    value={anzahlTueren}
                    onChange={setAnzahlTueren}
                    min={1}
                    max={MAX_TUEREN}
                  />
                </div>
              )}
            </Field>
          )}
        </>
      )}

      <RichtwertErgebnis
        ergebnis={serviceEinsatzBerechnen(werte, auswahl)}
        zusammenfassung={serviceEinsatzZusammenfassung(werte, auswahl)}
        hinweis={werte.hinweis}
        aufforderung={
          auswaehlbar
            ? 'Wählen Sie mindestens eine Leistung.'
            : 'Den Rahmen für Ihren Einsatz nennen wir Ihnen nach einer kurzen Anfrage.'
        }
        zusatz="einschließlich Anfahrt"
        anfrageHref={anfrageHref}
      />
    </RechnerRahmen>
  );
}
