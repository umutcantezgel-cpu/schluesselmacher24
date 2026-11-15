'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { scrollVerhalten } from '@/lib/bewegung';

import { Field } from '@/components/forms/field';
import { TextInput } from '@/components/forms/controls';
import { FahrzeugNichtGefunden } from '@/components/fahrzeug-anfrage/nicht-gefunden';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { sucheFahrzeuge } from '@/lib/fahrzeuge/suche';
import type { VehicleMake } from '@/lib/types';

import { anfrageHref, fahrzeugZiel, KATALOG_QUELLE, markenZuordnung, type FahrzeugZiel, type KatalogEintrag } from './fahrzeug-ziel';

/** Geladene Kataloge je Adresse: Ein Schrittwechsel lädt nicht neu. */
const geladen = new Map<string, Promise<KatalogEintrag[]>>();

export type KatalogStatus = 'leer' | 'laedt' | 'bereit' | 'fehler';

/**
 * Katalog einer Klasse nachladen (A-047): erst beim ersten Gebrauch der Suche, nicht mit der Seite. Ein
 * Fehler lässt sich mit `laden` erneut versuchen; die Wege ohne Suche bleiben davon unberührt.
 */
export function useKatalog(adresse: string): { status: KatalogStatus; katalog: KatalogEintrag[]; laden: () => void } {
  const [zustand, setZustand] = useState<{ status: KatalogStatus; katalog: KatalogEintrag[] }>({ status: 'leer', katalog: [] });
  const aktiv = useRef(true);
  useEffect(() => {
    aktiv.current = true;
    return () => {
      aktiv.current = false;
    };
  }, []);
  const laden = useCallback(() => {
    setZustand((z) => (z.status === 'leer' || z.status === 'fehler' ? { ...z, status: 'laedt' } : z));
    let anfrage = geladen.get(adresse);
    if (!anfrage) {
      anfrage = fetch(adresse, { headers: { Accept: 'application/json' } }).then(async (antwort) => {
        if (!antwort.ok) throw new Error(`Katalog: ${antwort.status}`);
        const daten: unknown = await antwort.json();
        return Array.isArray(daten) ? (daten as KatalogEintrag[]) : [];
      });
      geladen.set(adresse, anfrage);
    }
    anfrage.then(
      (katalog) => {
        if (aktiv.current) setZustand({ status: 'bereit', katalog });
      },
      () => {
        geladen.delete(adresse);
        if (aktiv.current) setZustand({ status: 'fehler', katalog: [] });
      },
    );
  }, [adresse]);
  return { ...zustand, laden };
}

/** Gewählter Treffer: Ziel im Ablauf und der Katalogeintrag (etwa für Generationen). */
export interface FahrzeugWahl {
  ziel: Exclude<FahrzeugZiel, { art: 'anfrage' }>;
  eintrag: KatalogEintrag;
}

const HINWEIS: Record<FahrzeugZiel['art'], string> = {
  gepflegt: 'Preis und Termin online',
  marke: 'Termin nach Prüfung Ihrer Angaben',
  anfrage: 'Anfrage mit Fahrzeugschein und drei Schlüsselfotos',
};

/**
 * Fahrzeugsuche über den Pkw-Katalog (G-14): Marke und Modell in einem Feld, Tippfehler erlaubt,
 * gewichtet nach Bestand. Der Katalog kommt erst beim ersten Gebrauch aus `katalogAdresse` (A-047). Ein
 * Treffer führt je nach Datenlage in den Weg mit Preis und Anzahlung, in „Modell nicht aufgeführt“ oder
 * in die Anfrage (G-15). „Nicht dabei“ führt immer in die Anfrage. Mit `onVorschlag` meldet die Suche den
 * ersten wählbaren Treffer, damit „Weiter“ ihn übernehmen kann (A-025); er trägt dann die Marke
 * „Vorschlag“. Ohne `mitQuelle` steht die Quelle des Katalogs nicht hier, sondern beim Aufrufer.
 * Unter der Suche steht fest der Block „Fahrzeug nicht gefunden?“ mit Telefon (FA-KERN-02B); ein Aufrufer,
 * der ihn selbst am Ende seines Schritts zeigt, schaltet ihn mit `nichtGefunden={false}` hier ab.
 */
export function FahrzeugSuche({
  katalogAdresse,
  makes,
  onWahl,
  onVorschlag,
  mitQuelle = true,
  nichtGefunden = true,
  telefon,
}: {
  katalogAdresse: string;
  makes: VehicleMake[];
  onWahl: (wahl: FahrzeugWahl) => void;
  onVorschlag?: (wahl: FahrzeugWahl | null) => void;
  mitQuelle?: boolean;
  /** Block „Fahrzeug nicht gefunden?“ unter der Suche (Standard: an). */
  nichtGefunden?: boolean;
  /** Telefonnummer aus den Einstellungen für den Block. */
  telefon?: string;
}) {
  const [text, setText] = useState('');
  const liste = useRef<HTMLUListElement>(null);
  const { status, katalog, laden } = useKatalog(katalogAdresse);
  const marken = useMemo(() => markenZuordnung(katalog, makes), [katalog, makes]);
  const suche = text.trim();
  const treffer = useMemo(
    () =>
      suche.length >= 2
        ? sucheFahrzeuge(suche, katalog, { hoechstens: 6, klasse: 'pkw' }).map((t) => ({ ziel: fahrzeugZiel(t.reihe, makes, marken), eintrag: t.reihe }))
        : [],
    [suche, katalog, makes, marken],
  );

  // Erster wählbarer Treffer als Vorschlag für „Weiter“ (A-025)
  const erster = treffer[0];
  const vorschlag = useMemo<FahrzeugWahl | null>(
    () => (erster && erster.ziel.art !== 'anfrage' ? { ziel: erster.ziel, eintrag: erster.eintrag } : null),
    [erster],
  );
  useEffect(() => {
    onVorschlag?.(vorschlag);
  }, [vorschlag, onVorschlag]);

  // Neue Treffer ins Bild holen: Mobil läge die Liste sonst unter der festen Leiste des Ablaufs.
  const anzahl = treffer.length;
  useEffect(() => {
    if (anzahl > 0) liste.current?.scrollIntoView({ block: 'nearest', behavior: scrollVerhalten() });
  }, [anzahl]);

  return (
    <div className="space-y-3">
      <Field label="Marke und Modell" hint="Zum Beispiel „VW Golf“ oder „Opel Corsa“. Tippfehler sind kein Problem.">
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

      {suche.length >= 2 && status === 'laedt' && <p className="text-small text-foreground-muted">Fahrzeugliste wird geladen.</p>}
      {status === 'fehler' && (
        <p className="text-small text-foreground-muted" role="status">
          Die Fahrzeugliste ist gerade nicht erreichbar.{' '}
          <button type="button" onClick={laden} className="font-semibold text-primary hover:underline">
            Erneut versuchen
          </button>{' '}
          oder{' '}
          <Link href={anfrageHref(suche)} className="font-semibold text-primary hover:underline">
            Fahrzeug anfragen
          </Link>
        </p>
      )}

      {treffer.length > 0 && (
        <ul ref={liste} className="scroll-mb-28 divide-y divide-border rounded-lg border border-border bg-surface" aria-label="Treffer">
          {treffer.map(({ ziel, eintrag }, i) => {
            const vorgeschlagen = Boolean(onVorschlag) && i === 0 && ziel.art !== 'anfrage';
            const inhalt = (
              <>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 text-body font-semibold text-foreground">
                    {ziel.name}
                    {vorgeschlagen && (
                      <span className="rounded-full bg-primary-soft px-2 font-mono text-caption font-semibold text-primary">Vorschlag</span>
                    )}
                  </span>
                  <span className="block text-small text-foreground-muted">{HINWEIS[ziel.art]}</span>
                </span>
                <GlyphPfeilRechts size={18} className="shrink-0 text-foreground-muted" />
              </>
            );
            const klasse =
              'flex min-h-touch-lg w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-quick hover:bg-surface-muted';
            return (
              <li key={eintrag.id}>
                {ziel.art === 'anfrage' ? (
                  <Link href={anfrageHref({ marke: eintrag.marke, reihe: eintrag.reihe })} className={klasse}>
                    {inhalt}
                  </Link>
                ) : (
                  <button type="button" onClick={() => onWahl({ ziel, eintrag })} className={klasse}>
                    {inhalt}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {suche.length >= 2 && status === 'bereit' && treffer.length === 0 && (
        <p className="scroll-mb-28 text-small text-foreground-muted">
          Kein Treffer für „{suche}“.{' '}
          <Link href={anfrageHref(suche)} className="font-semibold text-primary hover:underline">
            Fahrzeug trotzdem anfragen
          </Link>
        </p>
      )}

      {nichtGefunden && <FahrzeugNichtGefunden telefon={telefon} href={anfrageHref(suche.length >= 2 ? suche : undefined)} />}

      {mitQuelle && <p className="text-caption text-foreground-muted">{KATALOG_QUELLE}</p>}
    </div>
  );
}
