'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';

import { SchliessplanGrafik, schliessplanSchluessel } from '@/components/visual/generators/schliessplan';
import { cn } from '@/lib/cn';

import { alleTueren, naechsterIndex, schliessBeschreibung, tuerBeschreibung, tuerName } from './auswahl';

export type SchliessSystem = 'gleichschliessung' | 'zentral' | 'haupt' | 'generalhaupt';

const SYSTEM_NAMEN: Record<SchliessSystem, string> = {
  gleichschliessung: 'Gleichschließung',
  zentral: 'Zentralschlossanlage',
  haupt: 'Hauptschlüsselanlage',
  generalhaupt: 'Generalhauptschlüsselanlage',
};

const chip =
  'inline-flex min-h-touch items-center rounded-full border px-4 text-small font-semibold transition-colors duration-quick ease-standard';
const chipAn = 'border-area bg-area-soft text-area-strong';
const chipAus = 'border-border-strong bg-surface text-foreground-muted hover:border-area hover:text-foreground';

export interface SchliessplanInteraktivProps {
  /** Wählbare Systeme; bei einem Eintrag entfällt die Auswahl. */
  systeme?: SchliessSystem[];
  /** System beim Laden. */
  anfang?: SchliessSystem;
  /** Zahl der Türen (bei Zentralschlossanlagen: Wohnungstüren), 2–8. */
  tueren?: number;
  /** Hauptgruppen bei Generalhauptschlüsselanlagen, 1–4. */
  gruppen?: number;
  className?: string;
}

/**
 * Großer Moment der Schließanlagen (B-14): Wer einen Schlüssel wählt, sieht alle
 * Türen, die er schließt; wer eine Tür wählt, sieht alle Schlüssel, die sie
 * öffnen. Dieselbe Aussage steht als Text für Screenreader in einer Live-Region.
 */
export function SchliessplanInteraktiv({
  systeme = ['gleichschliessung', 'zentral', 'haupt', 'generalhaupt'],
  anfang = 'haupt',
  tueren = 4,
  gruppen = 2,
  className,
}: SchliessplanInteraktivProps) {
  const id = useId();
  const [system, setSystem] = useState<SchliessSystem>(systeme.includes(anfang) ? anfang : systeme[0]);
  const [auswahl, setAuswahl] = useState<{ art: 'schluessel' | 'tuer'; kennung: string } | null>(null);

  const basis = useMemo(() => ({ system, tueren, gruppen }), [system, tueren, gruppen]);
  const schluessel = useMemo(() => schliessplanSchluessel(basis), [basis]);
  const tuerListe = useMemo(() => alleTueren(schluessel), [schluessel]);

  const params = {
    ...basis,
    ...(auswahl?.art === 'schluessel' ? { markiert: auswahl.kennung } : {}),
    ...(auswahl?.art === 'tuer' ? { tuer: auswahl.kennung } : {}),
  };

  const gewaehlterSchluessel = auswahl?.art === 'schluessel' ? schluessel.find((s) => s.kennung === auswahl.kennung) : undefined;
  const ansage = gewaehlterSchluessel
    ? schliessBeschreibung(gewaehlterSchluessel)
    : auswahl?.art === 'tuer'
      ? tuerBeschreibung(schluessel, auswahl.kennung)
      : 'Wählen Sie einen Schlüssel oder eine Tür.';

  const systemWaehlen = (neu: SchliessSystem) => {
    setSystem(neu);
    setAuswahl(null);
  };

  const systemTaste = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const ziel = naechsterIndex(index, event.key, systeme.length);
    if (ziel === null) return;
    event.preventDefault();
    systemWaehlen(systeme[ziel]);
    document.getElementById(`${id}-system-${systeme[ziel]}`)?.focus();
  };

  return (
    <div className={cn('grid gap-6', className)}>
      {systeme.length > 1 && (
        <div role="tablist" aria-label="Art der Schließanlage" className="flex flex-wrap gap-2">
          {systeme.map((s, index) => (
            <button
              key={s}
              id={`${id}-system-${s}`}
              type="button"
              role="tab"
              aria-selected={s === system}
              aria-controls={`${id}-plan`}
              tabIndex={s === system ? 0 : -1}
              onClick={() => systemWaehlen(s)}
              onKeyDown={(event) => systemTaste(event, index)}
              className={cn(chip, s === system ? chipAn : chipAus)}
            >
              {SYSTEM_NAMEN[s]}
            </button>
          ))}
        </div>
      )}

      <div
        id={`${id}-plan`}
        role={systeme.length > 1 ? 'tabpanel' : undefined}
        aria-labelledby={systeme.length > 1 ? `${id}-system-${system}` : undefined}
        className="rounded-lg border border-border bg-surface p-4 sm:p-6"
      >
        <SchliessplanGrafik key={system} params={params} title="" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className="font-mono text-caption uppercase tracking-label text-foreground-subtle">Schlüssel wählen</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {schluessel.map((s) => {
              const an = auswahl?.art === 'schluessel' && auswahl.kennung === s.kennung;
              return (
                <button
                  key={s.kennung}
                  type="button"
                  aria-pressed={an}
                  onClick={() => setAuswahl(an ? null : { art: 'schluessel', kennung: s.kennung })}
                  className={cn(chip, 'font-mono', an ? chipAn : chipAus)}
                >
                  {s.kuerzel}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-mono text-caption uppercase tracking-label text-foreground-subtle">Tür wählen</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {tuerListe.map((t) => {
              const an = auswahl?.art === 'tuer' && auswahl.kennung === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={an}
                  onClick={() => setAuswahl(an ? null : { art: 'tuer', kennung: t })}
                  className={cn(chip, an ? chipAn : chipAus)}
                >
                  {tuerName(t)}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <p aria-live="polite" className="min-h-touch border-l-2 border-area pl-4 text-body text-foreground">
        {ansage}
      </p>
    </div>
  );
}
