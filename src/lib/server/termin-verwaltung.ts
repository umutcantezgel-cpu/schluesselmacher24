import 'server-only';

import { z } from 'zod';

import { heuteInBerlin, jahrInBerlin } from '@/lib/berliner-zeit';
import {
  TerminVergebenFehler,
  getCollection,
  getRecord,
  getSettings,
  terminVerschieben as terminInDatenbankVerschieben,
  vorgangAnlegen,
} from '@/lib/data';
import { formatDate, formatDuration } from '@/lib/format';
import { SPERRGRUND_TEXT, zeitpunktPruefen, type SperrGrund } from '@/lib/scheduling';
import type { AppointmentInfo, BlockedDay, BusinessRecord, MailLogEntry, Settings } from '@/lib/types';

import { benachrichtigeStatus, benachrichtigeVertrag } from './benachrichtigungen';
import { AREA_KEYS } from './record-schema';

/* ==========================================================================
   Termine im Backend: verschieben und telefonisch eintragen
   Gleiche Regeln wie die Buchung auf der Seite (Öffnungszeiten, Sperrtage,
   Feiertage, Belegung je Zeitfenster) und dieselbe Tagessperre wie
   `vorgangAnlegen` — so vergibt die Website keinen Termin doppelt, den das
   Team gerade einträgt. Vorlauf und Raster der Buchungsfenster gelten fürs
   Team nicht. Aufgerufen von den Endpunkten der Sammlung Vorgänge
   (src/payload/hooks/termin-aktionen.ts), die Anmeldung und Rolle prüfen.
   ========================================================================== */

export type TerminAktionErgebnis =
  | { ok: true; meldung: string; vorgangId: string; nummer: string }
  | { ok: false; status: 400 | 404 | 409; fehler: string };

const datum = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const uhrzeit = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const dauer = z.number().int().min(15).max(600);
const ort = z.enum(['werkstatt', 'vor-ort']);

export const verschiebenSchema = z.object({
  datum,
  uhrzeit,
  dauerMinuten: dauer.optional(),
  ort: ort.optional(),
  nachricht: z.string().trim().max(2000).optional(),
  kundeInformieren: z.boolean().default(true),
});

export const telefonterminSchema = z.object({
  vorname: z.string().trim().min(1).max(120),
  nachname: z.string().trim().min(1).max(120),
  email: z.string().trim().max(254).email(),
  telefon: z.string().trim().min(3).max(60),
  datum,
  uhrzeit,
  dauerMinuten: dauer,
  ort: ort.default('werkstatt'),
  bereich: z.enum(AREA_KEYS).default('autoschluessel'),
  leistung: z.string().trim().max(200).optional(),
  notiz: z.string().trim().max(2000).optional(),
  kundeInformieren: z.boolean().default(true),
});

const UNGUELTIG = 'Bitte prüfen Sie die Angaben (Datum JJJJ-MM-TT, Uhrzeit HH:MM, Dauer 15–600 Minuten).';
const VERGANGENHEIT = 'Der Termin liegt in der Vergangenheit.';

function terminText(termin: Pick<AppointmentInfo, 'date' | 'time'>): string {
  return `${formatDate(termin.date)}, ${termin.time} Uhr`;
}

function belegt(grund: SperrGrund | null): string {
  return `Zu diesem Zeitpunkt ist kein Termin möglich: ${grund ? SPERRGRUND_TEXT[grund] : 'Bereits vergeben'}.`;
}

/** Statusmail „terminiert“ (auf Wunsch) und — einmalig — die Vertragsbestätigung. */
async function kundeInformieren(vorgang: BusinessRecord, informieren: boolean, nachricht?: string): Promise<string> {
  let status: MailLogEntry | null = null;
  if (informieren) status = await benachrichtigeStatus({ vorgang, status: 'terminiert', nachricht });
  const vertrag = await benachrichtigeVertrag({ vorgang });
  const teile: string[] = [];
  if (informieren) {
    teile.push(
      status?.result === 'gesendet'
        ? `Terminmail an ${vorgang.contact.email} gesendet.`
        : 'Terminmail nicht gesendet (Mailversand prüfen).',
    );
  }
  if (vertrag) teile.push(vertrag.result === 'gesendet' ? 'Vertragsbestätigung gesendet.' : 'Vertragsbestätigung nicht gesendet.');
  return teile.join(' ');
}

/** Prüfung unter der Tagessperre; der Grund landet in `grund`. */
function pruefer(settings: Settings, blockedDays: BlockedDay[], termin: AppointmentInfo, exceptRecordId?: string) {
  const ergebnis: { grund: SperrGrund | null } = { grund: null };
  const istFrei = (existing: BusinessRecord[]) => {
    ergebnis.grund = zeitpunktPruefen({
      date: termin.date,
      time: termin.time,
      durationMinutes: termin.durationMinutes,
      booking: settings.booking,
      openingHours: settings.openingHours,
      blockedDays,
      existing,
      exceptRecordId,
    });
    return ergebnis.grund === null;
  };
  return { ergebnis, istFrei };
}

/** Verschiebt den Termin eines Vorgangs (nur Art „termin“, nicht storniert oder abgeschlossen). */
export async function terminVerschieben(id: string, eingabe: unknown, team: string): Promise<TerminAktionErgebnis> {
  const geprueft = verschiebenSchema.safeParse(eingabe);
  if (!geprueft.success) return { ok: false, status: 400, fehler: UNGUELTIG };
  const daten = geprueft.data;
  if (daten.datum < heuteInBerlin()) return { ok: false, status: 400, fehler: VERGANGENHEIT };

  const vorher = await getRecord(id);
  if (!vorher) return { ok: false, status: 404, fehler: 'Vorgang nicht gefunden.' };
  if (vorher.kind !== 'termin') return { ok: false, status: 400, fehler: 'Nur Termine lassen sich verschieben.' };
  if (vorher.status === 'storniert' || vorher.status === 'abgeschlossen') {
    return { ok: false, status: 409, fehler: 'Stornierte oder abgeschlossene Termine lassen sich nicht verschieben.' };
  }

  const [settings, blockedDays] = await Promise.all([getSettings(), getCollection('blockedDays')]);
  const neu: AppointmentInfo = {
    date: daten.datum,
    time: daten.uhrzeit,
    durationMinutes: daten.dauerMinuten ?? vorher.appointment?.durationMinutes ?? settings.booking.slotMinutes,
    location: daten.ort ?? vorher.appointment?.location ?? 'werkstatt',
  };
  const { ergebnis, istFrei } = pruefer(settings, blockedDays, neu, vorher.id);
  const at = new Date().toISOString();
  const alt = vorher.appointment ? terminText(vorher.appointment) : 'ohne Termin';

  let vorgang: BusinessRecord | null;
  try {
    vorgang = await terminInDatenbankVerschieben({
      vorgangId: id,
      neu,
      istFrei: (tag) => istFrei(tag),
      aendern: (aktuell) => ({
        status: 'terminiert',
        timeline: [...aktuell.timeline, { at, actor: 'team', message: `Termin verlegt auf ${terminText(neu)}.` }],
        internalNotes: [
          ...aktuell.internalNotes,
          { at, actor: 'team', message: `Termin von ${alt} auf ${terminText(neu)} (${formatDuration(neu.durationMinutes)}) verschoben (${team}).` },
        ],
      }),
    });
  } catch (error) {
    if (error instanceof TerminVergebenFehler) return { ok: false, status: 409, fehler: belegt(ergebnis.grund) };
    throw error;
  }
  if (!vorgang) return { ok: false, status: 404, fehler: 'Vorgang nicht gefunden.' };

  const mails = await kundeInformieren(vorgang, daten.kundeInformieren, daten.nachricht);
  return {
    ok: true,
    vorgangId: vorgang.id,
    nummer: vorgang.reference,
    meldung: `Termin auf ${terminText(neu)} verschoben. ${mails}`.trim(),
  };
}

/**
 * Legt einen telefonisch vereinbarten Termin als Vorgang an — Art „termin“,
 * Ablauf „Termin mit Anzahlung“ (einen eigenen Ablauf „telefonisch“ gibt es
 * im Datenmodell nicht), Status „terminiert“, ohne Online-Zahlung.
 */
export async function telefonterminEintragen(eingabe: unknown, team: string): Promise<TerminAktionErgebnis> {
  const geprueft = telefonterminSchema.safeParse(eingabe);
  if (!geprueft.success) return { ok: false, status: 400, fehler: `${UNGUELTIG} Name, E-Mail und Telefon sind Pflicht.` };
  const daten = geprueft.data;
  if (daten.datum < heuteInBerlin()) return { ok: false, status: 400, fehler: VERGANGENHEIT };

  const [settings, blockedDays] = await Promise.all([getSettings(), getCollection('blockedDays')]);
  const termin: AppointmentInfo = { date: daten.datum, time: daten.uhrzeit, durationMinutes: daten.dauerMinuten, location: daten.ort };
  const { ergebnis, istFrei } = pruefer(settings, blockedDays, termin);
  const at = new Date().toISOString();

  let vorgang: BusinessRecord;
  try {
    vorgang = await vorgangAnlegen({
      art: 'termin',
      jahr: jahrInBerlin(),
      termin: { datum: termin.date, istFrei },
      aufbauen: () => ({
        area: daten.bereich,
        process: 'termin-mit-anzahlung',
        status: 'terminiert',
        createdAt: at,
        updatedAt: at,
        contact: {
          firstName: daten.vorname,
          lastName: daten.nachname,
          email: daten.email,
          phone: daten.telefon,
          country: 'Deutschland',
        },
        payload: { telefonisch: true, eingetragenVon: team, ...(daten.leistung ? { serviceLabel: daten.leistung } : {}) },
        summary: [
          {
            title: 'Telefonisch vereinbart',
            rows: [
              ...(daten.leistung ? [{ label: 'Gewünschte Leistung', value: daten.leistung }] : []),
              { label: 'Termin', value: terminText(termin) },
              { label: 'Dauer', value: formatDuration(termin.durationMinutes) },
              { label: 'Ort', value: termin.location === 'werkstatt' ? 'Werkstatt' : 'Vor Ort' },
            ],
          },
        ],
        uploads: [],
        appointment: termin,
        internalNotes: [
          { at, actor: 'team', message: `Telefonisch eingetragen (${team}).${daten.notiz ? ` ${daten.notiz}` : ''}` },
        ],
        timeline: [{ at, actor: 'team', message: `Termin telefonisch vereinbart: ${terminText(termin)}.` }],
      }),
    });
  } catch (error) {
    if (error instanceof TerminVergebenFehler) return { ok: false, status: 409, fehler: belegt(ergebnis.grund) };
    throw error;
  }

  const mails = await kundeInformieren(vorgang, daten.kundeInformieren);
  return {
    ok: true,
    vorgangId: vorgang.id,
    nummer: vorgang.reference,
    meldung: `Termin ${vorgang.reference} am ${terminText(termin)} eingetragen. ${mails}`.trim(),
  };
}
