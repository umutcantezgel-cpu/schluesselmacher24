'use client';

import { useId, useState } from 'react';

import { tuerAbsicherungBerechnen, tuerAbsicherungZusammenfassung } from '@/lib/richtwerte/rechnen';
import type { TuerAbsicherungWerte } from '@/lib/richtwerte/typen';
import { OptionCard } from '@/components/forms/option-card';
import { Auswahlgruppe, RechnerRahmen, RichtwertErgebnis } from './rechner-bausteine';

export interface TuerAbsicherungRechnerProps {
  /** Aufbereitete Richtwerte aus `getRichtwerte()` — kommen von der Seite. */
  werte: TuerAbsicherungWerte;
  anfrageHref: string;
}

/** Nennt genau, was noch fehlt — der Text wird bei jeder Änderung vorgelesen. */
function aufforderung(auswaehlbar: boolean, mitTuer: boolean, mitMassnahme: boolean): string {
  if (!auswaehlbar) return 'Den Rahmen für Ihre Tür nennen wir Ihnen nach einer kurzen Anfrage.';
  if (mitTuer) return 'Wählen Sie mindestens eine Maßnahme.';
  if (mitMassnahme) return 'Wählen Sie noch die Tür.';
  return 'Wählen Sie eine Tür und mindestens eine Maßnahme.';
}

/** Orientierung für die Absicherung einer Tür: Türart plus gewählte Maßnahmen. */
export function TuerAbsicherungRechner({ werte, anfrageHref }: TuerAbsicherungRechnerProps) {
  const name = useId();
  const [tuerart, setTuerart] = useState<string | null>(null);
  const [massnahmen, setMassnahmen] = useState<string[]>([]);

  const auswahl = { tuerart, massnahmen };
  const auswaehlbar = werte.tuerarten.length > 0 && werte.massnahmen.length > 0;

  function umschalten(kennung: string) {
    setMassnahmen((vorher) =>
      vorher.includes(kennung) ? vorher.filter((k) => k !== kennung) : [...vorher, kennung],
    );
  }

  return (
    <RechnerRahmen
      titel="Orientierung für Ihre Türabsicherung"
      einleitung="Wählen Sie die Tür und die Maßnahmen, die für Sie infrage kommen. Soweit möglich, zeigen wir eine unverbindliche Spanne."
    >
      {auswaehlbar && (
        <>
          <Auswahlgruppe legende="1. Um welche Tür geht es?" liste>
            {werte.tuerarten.map((t) => (
              <OptionCard
                key={t.kennung}
                zeile
                name={`${name}-tuerart`}
                value={t.kennung}
                checked={tuerart === t.kennung}
                onSelect={setTuerart}
                title={t.label}
                description={t.beschreibung ?? undefined}
              />
            ))}
          </Auswahlgruppe>

          <Auswahlgruppe legende="2. Welche Maßnahmen kommen infrage?" hinweis="Mehrfachauswahl möglich." liste>
            {werte.massnahmen.map((m) => (
              <OptionCard
                key={m.kennung}
                zeile
                multiple
                name={`${name}-massnahmen`}
                value={m.kennung}
                checked={massnahmen.includes(m.kennung)}
                onSelect={umschalten}
                title={m.label}
                description={m.beschreibung ?? undefined}
              />
            ))}
          </Auswahlgruppe>
        </>
      )}

      <RichtwertErgebnis
        ergebnis={tuerAbsicherungBerechnen(werte, auswahl)}
        zusammenfassung={tuerAbsicherungZusammenfassung(werte, auswahl)}
        hinweis={werte.hinweis}
        aufforderung={aufforderung(auswaehlbar, tuerart !== null, massnahmen.length > 0)}
        anfrageHref={anfrageHref}
      />
    </RechnerRahmen>
  );
}
