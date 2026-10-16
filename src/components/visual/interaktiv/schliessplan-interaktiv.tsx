'use client';

import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

import { SchliessplanGrafik, schliessplanSchluessel } from '@/components/visual/generators/schliessplan';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { cn } from '@/lib/cn';

import { alleTueren, naechsterIndex, schliessBeschreibung, tuerBeschreibung, tuerName, type PlanSchluessel } from './auswahl';

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

/** Reiterinhalt eines Systems unter dem Plan: Texte, keine Funktionen (reine Daten vom Server). */
export interface SchliessDetail {
  /** Name mit Abkürzung in Klammern, etwa „Hauptschlüsselanlage (HS)“. */
  name: string;
  beschreibung: string;
  /** Kurze Merkpunkte mit Haken. */
  haken: string[];
  geeignetFuer: string;
  /** Erklärung hinter dem Info-Symbol, vom Server gerendert. */
  infoTip?: ReactNode;
}

export interface SchliessplanInteraktivProps {
  /** Wählbare Systeme; bei einem Eintrag entfällt die Auswahl. */
  systeme?: SchliessSystem[];
  /** System beim Laden. */
  anfang?: SchliessSystem;
  /** Zahl der Türen (bei Zentralschlossanlagen: Wohnungstüren), 2–8. */
  tueren?: number;
  /** Hauptgruppen bei Generalhauptschlüsselanlagen, 1–4. */
  gruppen?: number;
  /**
   * Reiterinhalt je System (ab B-14 der Schließanlagen): Beschreibung, Merkpunkte und
   * Eignung erscheinen unter dem Plan. Ohne Eintrag bleibt der Bereich leer.
   */
  details?: Partial<Record<SchliessSystem, SchliessDetail>>;
  className?: string;
}

/** Schlüsselreihe: bis fünf Chips in einer Reihe, sonst gleichmäßig auf Reihen verteilt (kein Einzelchip). */
function reihenSpalten(anzahl: number): number {
  if (anzahl <= 5) return Math.max(1, anzahl);
  return Math.ceil(anzahl / Math.ceil(anzahl / 5));
}

/** Türen unter ihrem Schlüssel: je Schlüssel mit genau einer eigenen Tür, sonst `null`. Nur bei einer Reihe. */
function tuerUnterSchluessel(schluessel: PlanSchluessel[]): (string | null)[] | null {
  if (schluessel.length > 5) return null;
  return schluessel.map((s) => {
    const eigene = s.tueren.filter((t) => t.startsWith('t'));
    return eigene.length === 1 ? eigene[0] : null;
  });
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
  details,
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

  /* Türen unter ihrem Schlüssel; die übrigen (etwa Zentraltüren) folgen darunter. */
  const ausrichtung = tuerUnterSchluessel(schluessel);
  const ausgerichtet = new Set(ausrichtung?.filter((t): t is string => t !== null) ?? []);
  const eigeneReihe = ausrichtung !== null && ausgerichtet.size > 0;
  const uebrige = tuerListe.filter((t) => !ausgerichtet.has(t));
  const detail = details?.[system];
  const mehrere = systeme.length > 1;

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

  /* Rasterchips füllen ihre Zelle (`w-full`), die Reihe mit Schlüssel und Tür bleibt bündig. */
  const schluesselChip = (s: PlanSchluessel) => {
    const an = auswahl?.art === 'schluessel' && auswahl.kennung === s.kennung;
    return (
      <button
        key={s.kennung}
        type="button"
        aria-pressed={an}
        onClick={() => setAuswahl(an ? null : { art: 'schluessel', kennung: s.kennung })}
        className={cn(chip, 'w-full px-2.5 font-mono tabular-nums', an ? chipAn : chipAus)}
      >
        {s.kuerzel}
      </button>
    );
  };

  const tuerChip = (t: string, raster: boolean) => {
    const an = auswahl?.art === 'tuer' && auswahl.kennung === t;
    return (
      <button
        key={t}
        type="button"
        aria-pressed={an}
        onClick={() => setAuswahl(an ? null : { art: 'tuer', kennung: t })}
        className={cn(chip, 'font-mono tabular-nums', raster && 'w-full px-2.5', an ? chipAn : chipAus)}
      >
        {tuerName(t)}
      </button>
    );
  };

  const spalten = reihenSpalten(schluessel.length);
  const rasterStil = { gridTemplateColumns: `repeat(${spalten}, minmax(0, 1fr))` };

  return (
    <div className={cn('grid gap-6', className)}>
      {mehrere && (
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
        role={mehrere ? 'tabpanel' : undefined}
        aria-labelledby={mehrere ? `${id}-system-${system}` : undefined}
        className="grid gap-6"
      >
        <div className="rounded-lg border border-border bg-surface p-4 sm:p-6">
          {/* Unter 640 px die schmale Fassung mit größerer Schrift, darüber die breite (Muster zylinder-mass-live). */}
          <div key={system}>
            <div className="sm:hidden">
              <SchliessplanGrafik params={{ ...params, format: 'schmal' }} title="" />
            </div>
            <div className="hidden sm:block">
              <SchliessplanGrafik params={params} title="" />
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <fieldset className="min-w-0">
            <legend className="font-mono text-caption uppercase tracking-label text-foreground-muted">Schlüssel wählen</legend>
            <div className="mt-3 grid gap-2" style={rasterStil}>
              {schluessel.map((s) => schluesselChip(s))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="font-mono text-caption uppercase tracking-label text-foreground-muted">Tür wählen</legend>
            {ausrichtung && eigeneReihe && (
              <div className="mt-3 grid gap-2" style={rasterStil}>
                {ausrichtung.map((t, index) =>
                  t === null ? (
                    <span key={`leer-${schluessel[index].kennung}`} aria-hidden="true" />
                  ) : (
                    tuerChip(t, true)
                  ),
                )}
              </div>
            )}
            {uebrige.length > 0 && (
              <div className={cn('flex flex-wrap gap-2', eigeneReihe ? 'mt-2' : 'mt-3')}>
                {uebrige.map((t) => tuerChip(t, false))}
              </div>
            )}
          </fieldset>
        </div>

        <p aria-live="polite" className="min-h-touch border-l-2 border-area pl-4 text-body text-foreground">
          {ansage}
        </p>

        {detail && (
          <div className="border-t border-border pt-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-title-sm font-bold text-foreground">{detail.name}</h3>
              {detail.infoTip}
            </div>
            <p className="mt-3 max-w-measure text-body leading-relaxed text-foreground-muted">{detail.beschreibung}</p>
            <ul className="mt-5 grid max-w-measure gap-2.5">
              {detail.haken.map((haken) => (
                <li key={haken} className="flex gap-2.5 text-small leading-relaxed text-foreground-muted">
                  <GlyphHaken size={16} className="mt-0.5 shrink-0 text-area-strong" />
                  {haken}
                </li>
              ))}
            </ul>
            <div className="mt-6 max-w-measure border-t border-border pt-4">
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Geeignet für</p>
              <p className="mt-1.5 text-small leading-relaxed text-foreground">{detail.geeignetFuer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
