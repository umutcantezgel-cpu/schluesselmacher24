'use client';

import { CalendarClock, Loader2 } from 'lucide-react';
import type { TimeSlot } from '@/lib/types';
import { formatDate, formatDuration } from '@/lib/format';
import { Alert } from '@/components/ui/alert';
import { OptionCard } from '@/components/forms/option-card';

export interface TerminAuswahlProps {
  days: Array<{ date: string; slots: TimeSlot[] }>;
  loading: boolean;
  error?: string | null;
  leadTimeDays: number;
  slotMinutes: number;
  requiresVehicleOnSite: boolean;
  /**
   * Wahr, wenn der zuvor gewählte Termin nicht mehr frei ist — etwa weil sich
   * durch eine geänderte Leistung die Terminlänge verschoben hat.
   */
  staleSelection?: boolean;
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
}

/** Zeitfenster nach Tagen gruppiert — mobil als große, antippbare Flächen. */
export function TerminAuswahl({
  days,
  loading,
  error,
  leadTimeDays,
  slotMinutes,
  requiresVehicleOnSite,
  staleSelection = false,
  selectedDate,
  selectedTime,
  onSelect,
}: TerminAuswahlProps) {
  return (
    <div className="space-y-5">
      <Alert tone="info" title={`Frühester Termin nach etwa ${leadTimeDays} Tagen`}>
        <p>
          Der Vorlauf entsteht durch die Prüfung Ihrer Unterlagen und die Beschaffung des passenden
          Rohlings beziehungsweise Schlüsselgehäuses. Deshalb bieten wir erst Termine ab diesem
          Zeitpunkt an. Jeder Termin ist mit {formatDuration(slotMinutes)} eingeplant.
        </p>
      </Alert>

      {requiresVehicleOnSite && (
        <Alert tone="warning" title="Dieser Termin findet mit Fahrzeug statt">
          <p>
            Für Ihre Kombination aus Modell und Leistung muss das Fahrzeug beim Termin verfügbar
            sein — elektronische Schlüssel werden direkt am Fahrzeug angelernt. Ihr Vorgang wird
            deshalb als Vor-Ort-Termin mit Fahrzeug angelegt.
          </p>
          <p className="mt-2">
            Wo der Termin stattfindet, stimmen wir nach der Prüfung Ihrer Unterlagen mit Ihnen ab und
            bestätigen es Ihnen zusammen mit dem Preis.
          </p>
        </Alert>
      )}

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
        <p className="flex items-center gap-2 text-[15px] text-foreground-muted" role="status">
          <Loader2 size={17} className="animate-spin" aria-hidden />
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

      {!loading &&
        !error &&
        days.map((day) => {
          const free = day.slots.filter((slot) => slot.available);
          if (free.length === 0) return null;

          return (
            <section key={day.date} aria-label={formatDate(day.date)}>
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
                <CalendarClock size={17} className="text-foreground-subtle" aria-hidden />
                {formatDate(day.date)}
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {free.map((slot) => (
                  <OptionCard
                    key={`${slot.date}-${slot.time}`}
                    name="termin"
                    value={`${slot.date}T${slot.time}`}
                    checked={selectedDate === slot.date && selectedTime === slot.time}
                    onSelect={() => onSelect(slot.date, slot.time)}
                    title={`${slot.time} Uhr`}
                    description={`Dauer ${formatDuration(slot.durationMinutes)}`}
                  />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
