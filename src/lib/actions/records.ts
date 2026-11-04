'use server';

import { getCollection, getRecordByReference, getRubrik, getSettings, vorgangAendern } from '@/lib/data';
import { folgeterminErlaubt, vorherAusAdresse } from '@/lib/zahlung/neu-buchen';
import { defaults } from '@/lib/data/defaults';
import { begleitscheinZumVorgang } from '@/lib/einsenden/schein';
import { EINSENDE_QUELLE, einsendeVorgang } from '@/lib/einsenden/vorgang';
import { SCHUTZ_ERNEUERT, type FormularSchutz, type SchutzAntwort } from '@/lib/formular-schutz';
import { storageStatus } from '@/lib/integrations';
import { PLANER_QUELLE, SCHNAPPSCHUSS_FELD, planerVorgang } from '@/lib/konfigurator/vorgang';
import { RECHTSTEXTE_FASSUNG } from '@/lib/rechtliches/texte';
import { createRecord, verifyCarKeyBooking, type GepruefteAngaben } from '@/lib/server/create-record';
import { botVerdachtMelden, formularSchutzPruefen, scheinNummer } from '@/lib/server/formular-schutz';
import { publicRecordSchema, terminZustimmungenSchema, type TerminZustimmungen } from '@/lib/server/record-schema';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import { fahrzeugscheinPruefen, nachweisPruefen, rubrikUnterlagenPruefen } from '@/lib/server/unterlagen-pflicht';
import { QUELLE_RUBRIK, fotoAnfrageVerlangtKarte, vorOrtOhneBerechtigung } from '@/lib/wege/nachweis';
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
  /** Begleitschein einer Einsendung als PDF (Base64), zum Speichern gleich nach dem Absenden (G-24). */
  begleitschein?: { dateiname: string; pdfBase64: string };
  /** Hinweise zu nicht angebundenen Diensten. */
  notices: string[];
  error?: string;
}

const INVALID_INPUT =
  'Einige Angaben sind unvollständig oder ungültig. Bitte prüfen Sie das Formular.';

const BEGLEITSCHEIN_SPAETER =
  'Den Begleitschein konnten wir gerade nicht erzeugen. Sie finden ihn auf Ihrer Vorgangsseite; '
  + 'den Link dorthin schicken wir Ihnen per E-Mail. Bitte schicken Sie Ihren Schlüssel erst mit dem Begleitschein ein.';

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
    const art = (['anfrage', 'termin', 'projekt', 'partner'] as const).find((k) => k === input?.kind) ?? 'anfrage';
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
  // Partner-Bewerbung („Partner werden“): fester Bereich, Einwilligung zum Datenschutz Pflicht.
  if (data.kind === 'partner' && (data.area !== 'service-und-termin' || data.payload.datenschutz !== true)) {
    return { ok: false, notices: [], error: INVALID_INPUT };
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
    // Fahrzeugschein ist Pflicht (Leitfaden Kap. 05, Schritt 9) — auch bei Totalverlust.
    const unterlagen = fahrzeugscheinPruefen(data.uploads, storageStatus().configured);
    if (unterlagen) {
      return { ok: false, notices: [], error: unterlagen };
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

  // Anfrage aus dem Schließplan-Planer (E5-OPUS-03): Der Server prüft den Plan selbst und legt den
  // Schnappschuss mit den Namen aus dem Katalog in den Vorgang; nichts davon kommt aus dem Browser.
  // Auch die Zusammenfassung baut der Server aus dem Plan; die aus dem Browser fällt weg. Andere
  // Anfragen dürfen keinen Schnappschuss mitbringen.
  let payload = data.payload;
  if (data.kind === 'projekt' && payload.quelle === PLANER_QUELLE) {
    const vorgang = planerVorgang(payload, await getCollection('cylinderCatalog'));
    if (!vorgang.ok) {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    payload = vorgang.payload;
    summary = vorgang.summary;
  } else if (SCHNAPPSCHUSS_FELD in payload) {
    payload = { ...payload };
    delete payload[SCHNAPPSCHUSS_FELD];
  }

  // Einsendung (E6-OPUS-02): Der Server prüft die Angaben selbst und baut Payload und Zusammenfassung
  // neu; die Zusammenfassung aus dem Browser fällt weg. Eine Einsendung ist immer „Schlüssel nach Vorlage“.
  const einsendung = data.kind === 'anfrage' && payload.quelle === EINSENDE_QUELLE;
  if (einsendung) {
    const vorgang = data.area === 'schluessel-nach-vorlage' ? einsendeVorgang(payload, data.contact) : null;
    if (!vorgang?.ok) {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    payload = { ...vorgang.payload };
    summary = vorgang.summary;
  }

  // Anfragen aus Rubrik-Wegen (Motorrad, Gehäuse): Nachweis und Pflicht-Uploads der Rubrik (R13, G-11).
  const rubrikId = data.kind === 'anfrage' && typeof payload.quelle === 'string' ? QUELLE_RUBRIK[payload.quelle] : undefined;
  if (rubrikId) {
    const rubrik = data.area === 'autoschluessel' ? await getRubrik(rubrikId) : null;
    if (!rubrik) {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    const fehlt = rubrikUnterlagenPruefen(rubrik, data.uploads, storageStatus().configured);
    if (fehlt) {
      return { ok: false, notices: [], error: fehlt };
    }
  }

  // Folgetermin nach nicht eingegangener Anzahlung (E-120): Verweis nur auf einen stornierten Termin derselben
  // E-Mail-Adresse; sonst fällt er weg. Nach dem Anlegen bekommen beide Vorgänge einen Eintrag.
  let vorherigerTermin: { id: string; reference: string } | null = null;
  if ('vorherigerVorgang' in payload) {
    const nummer = typeof payload.vorherigerVorgang === 'string' ? vorherAusAdresse(payload.vorherigerVorgang) : undefined;
    let alt: Awaited<ReturnType<typeof getRecordByReference>> = null;
    try {
      alt = data.kind === 'termin' && nummer ? await getRecordByReference(nummer) : null;
    } catch (fehler) {
      // Die Verknüpfung ist ein Zusatz: Ein Lesefehler kostet nur den Verweis, nie die Buchung.
      console.error('[termin] Vorheriger Termin nicht lesbar', fehler);
    }
    payload = { ...payload };
    if (alt && folgeterminErlaubt(alt, data.contact.email)) {
      vorherigerTermin = { id: alt.id, reference: alt.reference };
      payload.vorherigerVorgang = alt.reference;
    } else {
      delete payload.vorherigerVorgang;
    }
  }

  // Berechtigungsnachweis der Foto-Anfrage (R13, E6-OPUS-01): Wer eine Sicherungskarte angibt, lädt sie hoch.
  if (data.kind === 'anfrage' && data.area === 'schluessel-nach-vorlage' && fotoAnfrageVerlangtKarte(payload)) {
    const fehlt = nachweisPruefen('sicherungskarte', data.uploads, storageStatus().configured);
    if (fehlt) {
      return { ok: false, notices: [], error: fehlt };
    }
  }

  // Einsatz vor Ort (E6-BAUMEISTER-05): nur mit bestätigter Berechtigung (R13).
  if (data.kind === 'anfrage' && vorOrtOhneBerechtigung(payload)) {
    return { ok: false, notices: [], error: INVALID_INPUT };
  }

  const result = await createRecord({
    kind: data.kind,
    area: data.area,
    process: data.process,
    contact: data.contact,
    payload,
    summary,
    uploads: data.uploads,
    quote,
    appointment,
    payment,
    consents,
  });

  if (vorherigerTermin && result.ok && result.reference && result.recordId) {
    const jetzt = new Date().toISOString();
    const neu = result.reference;
    const alt = vorherigerTermin;
    try {
      await vorgangAendern(alt.id, (v) => ({
        timeline: [...v.timeline, { at: jetzt, actor: 'system', message: `Neuer Termin gebucht: ${neu}.` }],
        internalNotes: [...v.internalNotes, { at: jetzt, actor: 'system', message: `Folgetermin ${neu} gebucht.` }],
      }));
      await vorgangAendern(result.recordId, (v) => ({
        internalNotes: [
          ...v.internalNotes,
          { at: jetzt, actor: 'system', message: `Folgetermin zu ${alt.reference}: Die Anzahlung dort ist nicht eingegangen.` },
        ],
      }));
    } catch (fehler) {
      console.error('[termin] Folgetermin nicht verknüpft', fehler);
    }
  }

  // Begleitschein der Einsendung gleich mitgeben; fehlt er, steht er später auf der Vorgangsseite.
  const notices = [...result.notices];
  let begleitschein: SubmitResult['begleitschein'];
  if (einsendung && result.ok && result.reference) {
    try {
      const settings = await getSettings();
      const schein = await begleitscheinZumVorgang(
        { reference: result.reference, kind: data.kind, area: data.area, contact: data.contact, payload },
        { company: settings.company, einstellungen: settings.sendIn ?? defaults.settings().sendIn! },
      );
      if (schein) begleitschein = { dateiname: schein.dateiname, pdfBase64: schein.pdf.toString('base64') };
    } catch (fehler) {
      console.error('[einsenden] Begleitschein fehlgeschlagen', fehler);
    }
    if (!begleitschein) notices.push(BEGLEITSCHEIN_SPAETER);
  }

  // Der Link-Schlüssel gehört nur zur Bestellbestätigung und bleibt hier intern.
  return {
    ok: result.ok,
    reference: result.reference,
    recordId: result.recordId,
    redirectUrl: result.redirectUrl,
    begleitschein,
    notices,
    error: result.error,
  };
}
