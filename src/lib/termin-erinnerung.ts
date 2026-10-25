/* ==========================================================================
   Termin-Erinnerung: welche Termine heute eine Erinnerung bekommen
   Reine Funktionen. Der tägliche Cron (/api/cron/taeglich) liest die Termine
   des Zieltags und versendet über `src/lib/server/termin-erinnerungen.ts`.

   - Zieltag: heute in deutscher Zeit plus `reminderDaysBefore` Tage (0 = aus).
   - Nur Termine (Art „termin“), nicht storniert oder abgeschlossen, mit
     bezahlter Anzahlung oder vom Team bestätigt (Status „terminiert“).
   - Doppelversand: Eine gesendete Erinnerung (Mailprotokoll, Art
     „erinnerung“) zählt für den Termin, wenn sie frühestens am Tag der
     Erinnerung für das aktuelle Termindatum verschickt wurde. Wird der
     Termin verschoben, liegt die alte Erinnerung davor — dann wird erneut
     erinnert.
   ========================================================================== */

import { heuteInBerlin } from './berliner-zeit';
import type { BusinessRecord, MailLogEntry } from './types';

/** ISO-Tag plus Tage (ohne Zeitzone, nur Kalender). */
export function tagPlus(iso: string, tage: number): string {
  const datum = new Date(`${iso}T12:00:00Z`);
  datum.setUTCDate(datum.getUTCDate() + tage);
  return datum.toISOString().slice(0, 10);
}

/** Tag der Termine, an die heute erinnert wird — `null`, wenn die Erinnerung aus ist. */
export function erinnerungsZieltag(heute: string, tageVorher: number): string | null {
  if (!Number.isInteger(tageVorher) || tageVorher < 1) return null;
  return tagPlus(heute, tageVorher);
}

/** Kommt der Vorgang grundsätzlich für eine Erinnerung infrage? */
export function erinnerungMoeglich(vorgang: BusinessRecord): boolean {
  if (vorgang.kind !== 'termin' || !vorgang.appointment) return false;
  if (vorgang.status === 'storniert' || vorgang.status === 'abgeschlossen') return false;
  if (!vorgang.contact.email?.trim()) return false;
  return vorgang.payment?.status === 'bezahlt' || vorgang.status === 'terminiert';
}

/** Gesendete Erinnerung zum aktuellen Termindatum (siehe Kopf). */
export function erinnerungZumTermin(eintrag: MailLogEntry, termindatum: string, tageVorher: number): boolean {
  if (eintrag.kind !== 'erinnerung' || eintrag.result !== 'gesendet') return false;
  const tag = heuteInBerlin(new Date(eintrag.at));
  return tag >= tagPlus(termindatum, -tageVorher) && tag <= termindatum;
}

export function bereitsErinnert(vorgang: BusinessRecord, tageVorher: number): boolean {
  const datum = vorgang.appointment?.date;
  if (!datum) return false;
  return (vorgang.mailLog ?? []).some((eintrag) => erinnerungZumTermin(eintrag, datum, tageVorher));
}

export interface ErinnerungsAuswahl {
  /** Termin am Zieltag, noch nicht erinnert. */
  faellig: BusinessRecord[];
  /** Termin am Zieltag, Erinnerung schon gesendet (etwa bei einem zweiten Lauf). */
  bereitsErinnert: BusinessRecord[];
}

/** Wählt aus den Vorgängen die Termine am Zieltag aus. */
export function erinnerungAuswahl(
  vorgaenge: BusinessRecord[],
  { heute, tageVorher }: { heute: string; tageVorher: number },
): ErinnerungsAuswahl {
  const auswahl: ErinnerungsAuswahl = { faellig: [], bereitsErinnert: [] };
  const zieltag = erinnerungsZieltag(heute, tageVorher);
  if (!zieltag) return auswahl;
  for (const vorgang of vorgaenge) {
    if (vorgang.appointment?.date !== zieltag || !erinnerungMoeglich(vorgang)) continue;
    if (bereitsErinnert(vorgang, tageVorher)) auswahl.bereitsErinnert.push(vorgang);
    else auswahl.faellig.push(vorgang);
  }
  return auswahl;
}
