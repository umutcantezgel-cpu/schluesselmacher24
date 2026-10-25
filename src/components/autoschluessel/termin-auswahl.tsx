'use client';

import { useState } from 'react';

import type { CompanyLocation, TimeSlot } from '@/lib/types';
import { cn } from '@/lib/cn';
import { formatDate, formatDuration } from '@/lib/format';
import { AUSSENEINSATZ_HINWEIS, BEIM_KUNDEN_HINWEIS, anschriftEinzeilig } from '@/lib/terminort';
import { Alert } from '@/components/ui/alert';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphKalender } from '@/components/visual/glyphen/kalender';
import { GlyphLaden } from '@/components/visual/glyphen/laden';
import { GlyphOrt } from '@/components/visual/glyphen/ort';

export interface TerminAuswahlProps {
  days: Array<{ date: string; slots: TimeSlot[] }>;
  loading: boolean;
  error?: string | null;
  leadTimeDays: number;
  slotMinutes: number;
  requiresVehicleOnSite: boolean;
  /** Leistung beim Fahrzeug des Kunden (Fahrzeugöffnung): kein Werkstatttermin. */
  beimKunden?: boolean;
  /** Werkstatt, in der der Termin stattfindet (`standort` aus den Firmendaten). */
  werkstatt?: CompanyLocation;
  /**
   * Wahr, wenn der zuvor gewählte Termin nicht mehr frei ist — etwa weil sich
   * durch eine geänderte Leistung die Terminlänge verschoben hat.
   */
  staleSelection?: boolean;
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
}

/** Ein Tag, an dem mindestens eine Zeit frei ist. */
interface FreierTag {
  date: string;
  slots: TimeSlot[];
}

/**
 * Wochentag kurz und Tag mit Monat ohne Jahr, etwa „Mo.“ und „06. Okt.“. Die
 * Form ohne Ziffernpaar mit Doppelpunkt oder Punkt hält Uhrzeiten und Tage
 * im Text getrennt.
 */
function tagKurz(iso: string): { wochentag: string; datum: string } {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return { wochentag: '', datum: iso };
  return {
    wochentag: new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(date),
    datum: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(date),
  };
}

/**
 * Zeitfenster als Tagesleiste: oben die Tage mit freien Zeiten, darunter nur
 * die Uhrzeiten des offenen Tages. Die Leiste hält den Ablauf kurz; eine
 * Terminliste über Wochen würde den Schritt endlos lang machen.
 */
export function TerminAuswahl({
  days,
  loading,
  error,
  leadTimeDays,
  slotMinutes,
  requiresVehicleOnSite,
  beimKunden = false,
  werkstatt,
  staleSelection = false,
  selectedDate,
  selectedTime,
  onSelect,
}: TerminAuswahlProps) {
  /* Anzeige-Zustand: welcher Tag gerade offen ist. Ohne Angabe gilt der Tag des
     gewählten Termins, sonst der erste Tag mit freien Zeiten. Gewählt wird erst
     beim Antippen einer Uhrzeit (onSelect). */
  const [offenerTag, setOffenerTag] = useState('');

  const tage: FreierTag[] = days
    .map((day) => ({ date: day.date, slots: day.slots.filter((slot) => slot.available) }))
    .filter((tag) => tag.slots.length > 0);
  const aktiv =
    tage.find((tag) => tag.date === offenerTag) ??
    tage.find((tag) => tag.date === selectedDate) ??
    tage[0];

  return (
    <div className="space-y-5">
      {staleSelection && !loading && (
        <Alert tone="warning" title="Bitte Termin erneut wählen">
          <p>
            Ihr zuvor gewählter Termin steht nicht mehr zur Verfügung. Das kann daran liegen, dass
            sich durch eine geänderte Angabe die Dauer verschoben hat oder das Zeitfenster
            zwischenzeitlich vergeben wurde. Bitte wählen Sie unten einen neuen Termin.
          </p>
        </Alert>
      )}

      {staleSelection && (
        <Alert tone="warning" title="Ihr zuletzt gewähltes Zeitfenster ist nicht mehr frei">
          <p>
            In der Zwischenzeit wurde dieser Termin vergeben oder die eingeplante Dauer hat sich
            geändert. Bitte wählen Sie unten ein anderes Zeitfenster.
          </p>
        </Alert>
      )}

      {loading && (
        <p className="flex items-center gap-2 text-body text-foreground-muted" role="status">
          <GlyphLaden size={17} className="animate-spin motion-reduce:animate-none" />
          Freie Termine werden geladen …
        </p>
      )}

      {!loading && error && (
        <Alert tone="warning" title="Termine konnten nicht geladen werden">
          {error}
        </Alert>
      )}

      {!loading && !error && days.length === 0 && (
        <Alert tone="warning" title="Im buchbaren Zeitraum ist gerade nichts frei">
          <p>
            Bitte versuchen Sie es später noch einmal oder schildern Sie uns Ihren Fall über die
            allgemeine Anfrage. Wir melden uns dann mit einem Terminvorschlag.
          </p>
        </Alert>
      )}

      {!loading && !error && aktiv && (
        <section className="space-y-4">
          <div
            role="group"
            aria-label="Tag wählen"
            className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 scroll-px-5 sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:scroll-px-0"
          >
            {tage.map((tag) => {
              const { wochentag, datum } = tagKurz(tag.date);
              const offen = tag.date === aktiv.date;
              return (
                <button
                  key={tag.date}
                  type="button"
                  aria-pressed={offen}
                  onClick={() => setOffenerTag(tag.date)}
                  className={cn(
                    'min-h-touch w-24 shrink-0 snap-start rounded-lg border px-3 py-2.5 text-left transition-colors duration-quick',
                    offen
                      ? 'border-primary bg-primary-soft'
                      : 'border-border bg-surface hover:border-border-strong',
                  )}
                >
                  <span className="block font-mono text-caption uppercase tracking-label text-foreground-muted">
                    {wochentag}
                  </span>
                  <span className="mt-0.5 block font-mono text-small font-semibold tabular-nums text-foreground">
                    {datum}
                  </span>
                  <span className="mt-0.5 block font-mono text-caption tabular-nums text-foreground-muted">
                    {`${tag.slots.length} frei`}
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-title-sm font-semibold text-foreground">
              <GlyphKalender size={18} className="text-foreground-subtle" />
              <span>{formatDate(aktiv.date)}</span>
            </h3>
            <div role="group" aria-label="Uhrzeit wählen" className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-6">
              {aktiv.slots.map((slot) => {
                const gewaehlt = selectedDate === slot.date && selectedTime === slot.time;
                return (
                  <button
                    key={`${slot.date}-${slot.time}`}
                    type="button"
                    aria-pressed={gewaehlt}
                    onClick={() => onSelect(slot.date, slot.time)}
                    className={cn(
                      'min-h-touch rounded-lg border px-3 py-2.5 text-left transition-colors duration-quick',
                      gewaehlt
                        ? 'border-primary bg-primary-soft'
                        : 'border-border bg-surface hover:border-border-strong',
                    )}
                  >
                    <span className="block font-mono text-small font-semibold tabular-nums text-foreground">
                      {`${slot.time} Uhr`}
                    </span>
                    <span className="mt-0.5 block text-caption text-foreground-muted">
                      Dauer{' '}
                      <span className="font-mono tabular-nums">{formatDuration(slot.durationMinutes)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Terminort (Erg. Leitfaden §1): Kundinnen und Kunden kommen zur Werkstatt. */}
      {beimKunden ? (
        <Alert tone="info" title="Termin bei Ihrem Fahrzeug">
          <p>{BEIM_KUNDEN_HINWEIS}</p>
        </Alert>
      ) : requiresVehicleOnSite ? (
        <Alert tone="warning" title="Bitte bringen Sie Ihr Fahrzeug mit">
          <p>
            Für Ihre Kombination aus Modell und Leistung muss das Fahrzeug beim Termin verfügbar
            sein — elektronische Schlüssel werden direkt am Fahrzeug angelernt. Der Termin findet
            in unserer Werkstatt statt, mit Fahrzeug
            {werkstatt ? `: ${werkstatt.label}, ${anschriftEinzeilig(werkstatt)}.` : '.'}
          </p>
          <p className="mt-2">{AUSSENEINSATZ_HINWEIS}</p>
        </Alert>
      ) : (
        <div role="note" className="flex items-start gap-2 text-small leading-relaxed text-foreground-muted">
          <GlyphOrt size={16} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-foreground">
              Termin in unserer Werkstatt{werkstatt ? `: ${anschriftEinzeilig(werkstatt)}` : ''}
            </p>
            <p className="mt-1">{AUSSENEINSATZ_HINWEIS}</p>
          </div>
        </div>
      )}

      <div role="note" className="flex items-start gap-2 text-small leading-relaxed text-foreground-muted">
        <GlyphInfo size={16} className="mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold text-foreground">
            Frühester Termin nach etwa <span className="font-mono tabular-nums">{`${leadTimeDays}\xa0Tagen`}</span>
          </p>
          <p className="mt-1">
            Der Vorlauf entsteht durch die Prüfung Ihrer Unterlagen und die Beschaffung des passenden
            Rohlings beziehungsweise Schlüsselgehäuses. Deshalb bieten wir erst Termine ab diesem
            Zeitpunkt an. Jeder Termin ist mit{' '}
            <span className="font-mono tabular-nums">{formatDuration(slotMinutes)}</span> eingeplant.
          </p>
        </div>
      </div>
    </div>
  );
}
