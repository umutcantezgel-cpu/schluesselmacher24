'use server';

import { SCHUTZ_ERNEUERT, type FormularSchutz, type SchutzAntwort } from '@/lib/formular-schutz';
import { RECHTSTEXTE_FASSUNG } from '@/lib/rechtliches/texte';
import { createRecord, verifyCarKeyBooking, type GepruefteAngaben } from '@/lib/server/create-record';
import { botVerdachtMelden, formularSchutzPruefen, scheinNummer } from '@/lib/server/formular-schutz';
import { publicRecordSchema, terminZustimmungenSchema, type TerminZustimmungen } from '@/lib/server/record-schema';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import type {
  AppointmentInfo,
  AreaKey,
  ContactDetails,
  KeyKind,
  PriceQuote,
  ProcessKind,
  RecordConsents,
  RecordKind,
  SummarySection,
  UploadRef,
} from '@/lib/types';

/**
 * Eingabe der Formulare und Konfiguratoren.
 *
 * `quote`, `appointment` und `payment` sind hier nur Wünsche des Browsers.
 * Der Server übernimmt davon nichts Preisbestimmendes: Für Autoschlüssel-
 * Termine leitet er Preis, Anzahlung und Termin über `verify` selbst her,
 * bei allen anderen Anfragen entfallen sie.
 */
export interface SubmitInput {
  kind: RecordKind;
  area: AreaKey;
  process: ProcessKind;
  contact: ContactDetails;
  payload: Record<string, unknown>;
  summary: SummarySection[];
  uploads: Array<Omit<UploadRef, 'id' | 'uploadedAt'>>;
  quote?: PriceQuote;
  appointment?: AppointmentInfo;
  payment?: { scope: 'anzahlung' | 'gesamt'; amountCents: number; description: string };
  verify?: {
    kind: 'autoschluessel';
    makeSlug: string;
    modelSlug?: string | null;
    serviceId: string;
    keyKind: KeyKind;
    workingKeys: number;
  };
  /** Nur Termine: Pflicht-Zustimmungen aus dem Anzahlungsschritt (alle müssen `true` sein). */
  consents?: { [K in keyof TerminZustimmungen]: boolean };
  /** Bot-Schutz: Honigtopf und signierter Startzeitpunkt. */
  schutz?: FormularSchutz;
}

export interface SubmitResult extends SchutzAntwort {
  ok: boolean;
  reference?: string;
  recordId?: string;
  /** Wohin der Kunde zum Bezahlen geleitet wird, sobald angebunden. */
  redirectUrl?: string;
  /** Hinweise zu nicht angebundenen Diensten. */
  notices: string[];
  error?: string;
}

const INVALID_INPUT =
  'Einige Angaben sind unvollständig oder ungültig. Bitte prüfen Sie das Formular.';

const ZUSTIMMUNG_FEHLT =
  'Bitte bestätigen Sie im Schritt „Anzahlung“ alle Punkte, um den Termin verbindlich zu buchen.';

/** Zeilen der Zusammenfassung, die bei Terminen der Server aus den Stammdaten setzt. */
const GEPRUEFTE_ZEILEN = new Set(['Gewünschte Leistung', 'Marke', 'Modell']);

/**
 * Leistung und Fahrzeug eines Termins aus den Stammdaten statt aus dem
 * Browser. Der Abschnitt steht vorn: Vertragsbestätigung und CSV-Export
 * lesen den ersten Treffer. Ein Modell außerhalb der Liste kennt nur der
 * Kunde — es bleibt als seine Angabe stehen, aber nicht als „Modell“.
 */
function mitGeprueftenAngaben(summary: SummarySection[], angaben: GepruefteAngaben): SummarySection[] {
  const browser = summary.map((abschnitt) => ({
    ...abschnitt,
    rows: abschnitt.rows.flatMap((zeile) => {
      if (!GEPRUEFTE_ZEILEN.has(zeile.label)) return [zeile];
      if (zeile.label === 'Modell' && !angaben.modell) return [{ label: 'Modell (Angabe des Kunden)', value: zeile.value }];
      return [];
    }),
  }));
  return [
    {
      title: 'Leistung und Fahrzeug',
      rows: [
        { label: 'Gewünschte Leistung', value: angaben.leistung },
        { label: 'Marke', value: angaben.marke },
        ...(angaben.modell ? [{ label: 'Modell', value: angaben.modell }] : []),
      ],
    },
    ...browser,
  ];
}

/**
 * Öffentliche Aktion für Anfragen, Projekte und Autoschlüssel-Termine.
 * Bestellungen laufen ausschließlich über `submitOrder` in der Kasse.
 */
export async function submitRecord(input: SubmitInput): Promise<SubmitResult> {
  if (!(await allowRequest(LIMITS.vorgang))) {
    return { ok: false, notices: [], error: RATE_LIMIT_MESSAGE };
  }

  // Bot-Schutz: Beim Honigtopf still „angenommen“, aber nichts gespeichert
  // und nichts versendet. Sonst ein sichtbarer Fehler, der Browser holt einen
  // neuen Startzeitpunkt — die Eingaben bleiben stehen.
  const befund = formularSchutzPruefen(input?.schutz);
  if (befund === 'honigtopf') {
    botVerdachtMelden('submitRecord', befund);
    const art = (['anfrage', 'termin', 'projekt'] as const).find((k) => k === input?.kind) ?? 'anfrage';
    return { ok: true, reference: scheinNummer(art), notices: [] };
  }
  if (befund !== 'ok') {
    botVerdachtMelden('submitRecord', befund);
    return { ok: false, notices: [], error: SCHUTZ_ERNEUERT, schutzNeu: true };
  }

  const parsed = publicRecordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, notices: [], error: INVALID_INPUT };
  }
  const data = parsed.data;

  if (data.kind === 'bestellung') {
    return { ok: false, notices: [], error: 'Bestellungen werden über die Kasse abgeschlossen.' };
  }

  let quote: PriceQuote | undefined;
  let appointment: AppointmentInfo | undefined;
  let payment: { scope: 'anzahlung'; amountCents: number; description: string } | undefined;
  let consents: RecordConsents | undefined;
  let summary = data.summary;

  if (data.kind === 'termin') {
    // Zustimmungen sind Pflicht und werden als Nachweis gespeichert — nicht
    // aus dem freien `payload`, sondern aus einem eigenen, geprüften Objekt.
    const zustimmungen = terminZustimmungenSchema.safeParse(input.consents);
    if (!zustimmungen.success) {
      return { ok: false, notices: [], error: ZUSTIMMUNG_FEHLT };
    }
    consents = {
      terms: true,
      withdrawalNotice: true,
      deposit: true,
      authorization: true,
      earlyStart: true,
      at: new Date().toISOString(),
      version: RECHTSTEXTE_FASSUNG,
    };

    // Ein Termin mit Anzahlung braucht die Angaben, aus denen der Server den
    // Preis selbst ermittelt. Beträge aus dem Browser werden nie übernommen.
    if (!data.verify) {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    const verified = await verifyCarKeyBooking(
      data.verify,
      data.appointment ? { date: data.appointment.date, time: data.appointment.time } : undefined,
    );
    if (!verified.ok) {
      return { ok: false, notices: [], error: verified.error };
    }
    quote = verified.quote;
    appointment = verified.appointment;
    summary = mitGeprueftenAngaben(data.summary, verified.angaben);
    payment = {
      scope: 'anzahlung',
      amountCents: verified.quote.depositCents,
      // Vom Server gebildet — der Text aus dem Browser geht nirgends hin.
      description: 'Anzahlung Autoschlüssel-Termin',
    };
  }

  const result = await createRecord({
    kind: data.kind,
    area: data.area,
    process: data.process,
    contact: data.contact,
    payload: data.payload,
    summary,
    uploads: data.uploads,
    quote,
    appointment,
    payment,
    consents,
  });

  // Der Link-Schlüssel gehört nur zur Bestellbestätigung und bleibt hier intern.
  return {
    ok: result.ok,
    reference: result.reference,
    recordId: result.recordId,
    redirectUrl: result.redirectUrl,
    notices: result.notices,
    error: result.error,
  };
}
