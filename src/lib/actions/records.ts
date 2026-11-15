'use server';

import {
  AUFTRAGSWEG_DATEN,
  PARTNER_ZAHLUNG,
  restbetragCents,
  standortText,
  wegFuerStandort,
  zahlungsPlan,
  type Auftragsweg,
  type Terminstandort,
} from '@/lib/auftragsweg';
import { getCollection, getRecordByReference, getRubrik, getSettings, vorgangAendern } from '@/lib/data';
import { folgeterminErlaubt, vorherAusAdresse } from '@/lib/zahlung/neu-buchen';
import { defaults } from '@/lib/data/defaults';
import { begleitscheinZumVorgang } from '@/lib/einsenden/schein';
import { EINSENDE_QUELLE, einsendeVorgang } from '@/lib/einsenden/vorgang';
import { SCHUTZ_ERNEUERT, type FormularSchutz, type SchutzAntwort } from '@/lib/formular-schutz';
import { storageStatus } from '@/lib/integrations';
import { PLANER_QUELLE, SCHNAPPSCHUSS_FELD, planerVorgang } from '@/lib/konfigurator/vorgang';
import { standorteErmitteln } from '@/lib/partner/partnerweg-daten';
import { RECHTSTEXTE_FASSUNG } from '@/lib/rechtliches/texte';
import { buchungsOrt } from '@/lib/terminort';
import { createRecord, verifyCarKeyBooking, type GepruefteAngaben } from '@/lib/server/create-record';
import { botVerdachtMelden, formularSchutzPruefen, scheinNummer } from '@/lib/server/formular-schutz';
import { publicRecordSchema, terminZustimmungenSchema, type TerminZustimmungen } from '@/lib/server/record-schema';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';
import {
  allgemeineVorlageAnfrage,
  anfrageQuelleUnbekannt,
  fahrzeugFall,
  fehlendePflichtunterlagen,
  nachweisPruefen,
  rubrikUnterlagenPruefen,
  unterlagenMeldung,
  unterlagenWeg,
  type UnterlagenWeg,
} from '@/lib/server/unterlagen-pflicht';
import { QUELLE_RUBRIK, fotoAnfrageVerlangtKarte, vorOrtOhneBerechtigung } from '@/lib/wege/nachweis';
import { FAHRZEUG_ANFRAGE_QUELLE, type AnfrageKlasse } from '@/lib/fahrzeuge/anfrage-klassen';
import { istPlatzhalter } from '@/lib/platzhalter';
import { CODE_ANFRAGE_QUELLE, codeAnfragePruefen, mitGeprueftemCode } from '@/lib/wege/code-anfrage';
import type {
  AppointmentInfo,
  AreaKey,
  ContactDetails,
  KeyKind,
  PriceQuote,
  ProcessKind,
  RecordConsents,
  RecordKind,
  RemainderInfo,
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
  /**
   * Nur Termine: gewählter Terminstandort (FA-KERN-03). Nur ein Wunsch: Der Server ermittelt die
   * möglichen Standorte selbst; ohne passenden Partner oder ohne Schalter gilt die Werkstatt.
   */
  terminstandort?: Terminstandort;
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

/**
 * Rubrik je Klasse der gemeinsamen Fahrzeug-Anfrage (FA-SOFORT-05); „nicht gefunden“ und das Auto (die
 * Pflichtregel kennt es auch hier) gehören zu den Autoschlüsseln.
 */
const KLASSE_RUBRIK: ReadonlyMap<string, string> = new Map(
  Object.entries({
    auto: 'autoschluessel',
    motorrad: 'motorradschluessel',
    roller: 'roller-und-kleinstfahrzeuge',
    'e-scooter': 'e-scooter',
    seniorenmobil: 'seniorenmobile',
    fahrrad: 'fahrradschluessel',
    'nicht-gefunden': 'autoschluessel',
  } satisfies Record<AnfrageKlasse, string>),
);

const INVALID_INPUT =
  'Einige Angaben sind unvollständig oder ungültig. Bitte prüfen Sie das Formular.';

/** Meldung, wenn die Rubrik einer Fahrzeugklasse im Backend nicht live ist (FA-SOFORT-05). */
function wegGesperrtMeldung(telefon: string | undefined): string {
  return `Diese Anfrage ist gerade nicht möglich. Bitte rufen Sie uns an${telefon ? `: ${telefon}` : ''}.`;
}

const BEGLEITSCHEIN_SPAETER =
  'Den Begleitschein konnten wir gerade nicht erzeugen. Sie finden ihn auf Ihrer Vorgangsseite; '
  + 'den Link dorthin schicken wir Ihnen per E-Mail. Bitte schicken Sie Ihren Schlüssel erst mit dem Begleitschein ein.';

const STECKPLATZ_GEFAELSCHT =
  'Die Zuordnung Ihrer Fotos und Unterlagen stimmt nicht. Bitte laden Sie sie in den einzelnen Feldern erneut hoch.';

const UNTERLAGEN_NICHT_PRUEFBAR =
  'Ihre Unterlagen konnten gerade nicht geprüft werden. Bitte versuchen Sie es in einigen Minuten erneut.';

const TASTEN_FEHLT = 'Bitte geben Sie an, wie viele Tasten der Schlüssel hat.';
const STUECKZAHL_UNGUELTIG = 'Bitte geben Sie eine Stückzahl von 1 bis 20 an.';
const TASTEN_ANTWORTEN = new Set(['1-2', '3-4', 'unklar']);

type UploadEingabe = SubmitInput['uploads'][number];

/**
 * Steckplatz und Kategorie aus der gespeicherten Kundendatei (FA-KERN-02, A-048): nie aus dem Browser.
 * Mit Dateiablage liest der Server jede Datei mit Kennung und Einmal-Schlüssel nach. Passt die Angabe des
 * Browsers nicht zum gespeicherten Steckplatz oder nennt er dieselbe Datei zweimal, lehnt er ab. Eine
 * Datei, die sich nicht bestätigen lässt, zählt nicht als hochgeladen. Ohne Ablage bleibt die Angabe des
 * Browsers, geprüft nur auf Steckplatz und Kategorie (record-schema.ts).
 */
async function unterlagenAusAblage(uploads: UploadEingabe[]): Promise<{ ok: true; uploads: UploadEingabe[] } | { ok: false; error: string }> {
  if (!storageStatus().configured) return { ok: true, uploads };
  const verweise = uploads.flatMap((upload, index) =>
    upload.storageKey && upload.uploadToken ? [{ index, id: upload.storageKey, uploadToken: upload.uploadToken }] : [],
  );
  if (verweise.length === 0) return { ok: true, uploads };
  if (new Set(verweise.map((v) => v.id)).size !== verweise.length) return { ok: false, error: STECKPLATZ_GEFAELSCHT };
  let geprueft: Awaited<ReturnType<typeof import('@/lib/server/kundendateien').kundendateienPruefen>>;
  try {
    const { kundendateienPruefen } = await import('@/lib/server/kundendateien');
    geprueft = await kundendateienPruefen({ uploads: verweise.map(({ id, uploadToken }) => ({ id, uploadToken })) });
  } catch (fehler) {
    console.error('[vorgang] Unterlagen nicht prüfbar', fehler);
    return { ok: false, error: UNTERLAGEN_NICHT_PRUEFBAR };
  }
  const neu = uploads.map((upload) => ({ ...upload }));
  for (const [stelle, verweis] of verweise.entries()) {
    const datei = geprueft[stelle];
    const upload = neu[verweis.index];
    if (!datei) {
      delete upload.storageKey;
      delete upload.uploadToken;
      continue;
    }
    if (datei.kategorie !== upload.category || (datei.steckplatz ?? undefined) !== (upload.steckplatz ?? undefined)) {
      return { ok: false, error: STECKPLATZ_GEFAELSCHT };
    }
  }
  return { ok: true, uploads: neu };
}

/** Pflichtunterlagen nach der einen Regel (unterlagen-pflicht.ts): Meldung, die sagt, was fehlt, oder `null`. */
function pflichtMeldung(
  vorgang: { kind: RecordKind; area: AreaKey; payload: Record<string, unknown>; workingKeys?: number | null },
  uploads: UploadEingabe[],
): string | null {
  const fehlt = fehlendePflichtunterlagen(vorgang, uploads, storageStatus().configured);
  if (fehlt === 'ungueltig') return INVALID_INPUT;
  return fehlt ? unterlagenMeldung(fehlt) : null;
}

const ZUSTIMMUNG_FEHLT =
  'Bitte bestätigen Sie im Schritt „Anzahlung“ alle Punkte, um den Termin verbindlich zu buchen.';

/** Zeilen der Zusammenfassung, die bei Terminen der Server aus den Stammdaten setzt. */
const GEPRUEFTE_ZEILEN = new Set(['Gewünschte Leistung', 'Marke', 'Modell', 'Terminstandort']);

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
  // Allgemeine Anfrage mit dem Thema „Schlüssel nach Vorlage“ (FA-KERN-02): keine Foto-Anfrage, sie trägt
  // keine Steckplätze. Der Server legt sie unter „Service und Termin“ ab, damit sie im Backend nie zur
  // Freigabe mit Zahlung führt; das Thema bleibt im Vorgang stehen.
  const data = allgemeineVorlageAnfrage(parsed.data) ? { ...parsed.data, area: 'service-und-termin' as const } : parsed.data;

  // Bekannte Quellen je Bereich (FA-KERN-02): Eine erfundene Quelle darf die Pflichtregel nicht umgehen.
  if (anfrageQuelleUnbekannt(data)) {
    return { ok: false, notices: [], error: INVALID_INPUT };
  }
  // Ein Termin ist immer ein Autoschlüssel-Termin; die Pflichtregel gilt für jeden (R13).
  if (data.kind === 'termin' && data.area !== 'autoschluessel') {
    return { ok: false, notices: [], error: INVALID_INPUT };
  }

  // Wege mit Pflichtunterlagen (FA-KERN-02): Steckplätze aus der Ablage bestätigen, bevor geprüft wird.
  const weg: UnterlagenWeg | null = unterlagenWeg(data);
  let uploads = data.uploads;
  if (weg) {
    const bestaetigt = await unterlagenAusAblage(uploads);
    if (!bestaetigt.ok) {
      return { ok: false, notices: [], error: bestaetigt.error };
    }
    uploads = bestaetigt.uploads;
  }

  if (data.kind === 'bestellung') {
    return { ok: false, notices: [], error: 'Bestellungen werden über die Kasse abgeschlossen.' };
  }
  // Partner-Bewerbung („Partner werden“): fester Bereich, Einwilligung zum Datenschutz Pflicht.
  if (data.kind === 'partner' && (data.area !== 'service-und-termin' || data.payload.datenschutz !== true)) {
    return { ok: false, notices: [], error: INVALID_INPUT };
  }

  let quote: PriceQuote | undefined;
  let appointment: AppointmentInfo | undefined;
  let payment: { scope: 'anzahlung' | 'gesamt'; amountCents: number; description: string } | undefined;
  let consents: RecordConsents | undefined;
  let summary = data.summary;
  // Auftragsweg (FA-KERN-03, A-049): vom Server ermittelt, nie aus dem Browser übernommen.
  let auftragsweg: Auftragsweg | undefined;
  let remainder: RemainderInfo | undefined;
  let art: RecordKind = data.kind;
  let prozess: ProcessKind = data.process;

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
    // Pflichtunterlagen (FA-KERN-02): Fahrzeugschein immer, auch bei Totalverlust; die drei Schlüsselfotos,
    // außer bei ausdrücklich bestätigtem Totalverlust (keine funktionierenden Schlüssel und kein Schlüssel mehr);
    // eine kurze Beschreibung des Anliegens.
    const unterlagen = pflichtMeldung({ ...data, workingKeys: data.verify.workingKeys }, uploads);
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
    summary = mitGeprueftenAngaben(data.summary, verified.angaben);

    // Auftragsweg aus Postleitzahl, gewähltem Standort, Leistung, Eigenbereich und Partnern (FA-KERN-03).
    // Den Partner bietet der Server nur mit Schalter und passendem, freigeschaltetem Partner an.
    const ermittlung = await standorteErmitteln({
      postleitzahl: data.contact.postalCode ?? '',
      land: data.contact.country,
      leistung: data.verify.serviceId,
    });
    auftragsweg = wegFuerStandort(ermittlung, input.terminstandort);
    const plan = zahlungsPlan(auftragsweg, verified.quote);
    // Eigener Abschnitt direkt hinter „Leistung und Fahrzeug“; den ersten Abschnitt lesen Vertragsbestätigung und Export.
    summary = [
      summary[0],
      { title: 'Terminstandort', rows: [{ label: 'Terminstandort', value: standortText(auftragsweg === 'partner' ? 'partner' : 'werkstatt', undefined, buchungsOrt(data.verify.serviceId)) }] },
      ...summary.slice(1),
    ];

    if (plan.art === 'anzahlung') {
      // Direktweg (Hauptzentrale, Eigenbereich): Anzahlung wie im Bestand, voll angerechnet, Rest beim Termin.
      appointment = verified.appointment;
      payment = {
        scope: 'anzahlung',
        amountCents: verified.quote.depositCents,
        // Vom Server gebildet — der Text aus dem Browser geht nirgends hin.
        description: 'Anzahlung Autoschlüssel-Termin',
      };
      if (typeof plan.gesamtCents === 'number') {
        remainder = { totalCents: plan.gesamtCents, remainderCents: restbetragCents(plan.gesamtCents, { amountCents: plan.jetztCents, status: 'offen' }) };
      }
    } else if (plan.art === 'gesamt') {
      // Partnerweg mit Festpreis: Gesamtbetrag sofort, nie nur die Anzahlung. Den genauen Termin stimmt der
      // Partnerbetrieb nach der Zahlung ab; ein Zeitfenster der Werkstatt wird nicht belegt.
      payment = { scope: 'gesamt', amountCents: plan.jetztCents, description: PARTNER_ZAHLUNG };
      remainder = { totalCents: plan.gesamtCents, remainderCents: restbetragCents(plan.gesamtCents, { amountCents: plan.jetztCents, status: 'offen' }) };
    } else {
      // Partnerweg ohne Festpreis: Anfrage ohne Zahlung. Das Team trägt den Gesamtpreis ein und gibt frei;
      // der Kunde erhält den persönlichen Zahlungslink über den Gesamtbetrag (vorgang-benachrichtigen.ts).
      art = 'anfrage';
      prozess = 'gefuehrte-anfrage';
    }
  }

  // Anfrage aus dem Schließplan-Planer (E5-OPUS-03): Der Server prüft den Plan selbst und legt den
  // Schnappschuss mit den Namen aus dem Katalog in den Vorgang; nichts davon kommt aus dem Browser.
  // Auch die Zusammenfassung baut der Server aus dem Plan; die aus dem Browser fällt weg. Andere
  // Anfragen dürfen keinen Schnappschuss mitbringen.
  let payload = data.payload;
  // Den Auftragsweg in den Daten schreibt nur der Server (FA-KERN-03).
  if (AUFTRAGSWEG_DATEN in payload) {
    payload = { ...payload };
    delete payload[AUFTRAGSWEG_DATEN];
  }
  if (auftragsweg) payload = { ...payload, [AUFTRAGSWEG_DATEN]: auftragsweg };
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

  // Gehäuse (FA-05-10): Die Tastenzahl ist Pflicht und wird hier geprüft, nicht nur im Browser.
  if (weg === 'gehaeuse' && !TASTEN_ANTWORTEN.has(String(payload.tasten))) {
    return { ok: false, notices: [], error: TASTEN_FEHLT };
  }
  // Schlüssel nach Vorlage (FA-12-03): Stückzahl 1 bis 20 wie bei der Einsendung.
  if (weg === 'vorlage') {
    const stueck = payload.stueckzahl;
    if (typeof stueck !== 'number' || !Number.isInteger(stueck) || stueck < 1 || stueck > 20) {
      return { ok: false, notices: [], error: STUECKZAHL_UNGUELTIG };
    }
  }

  // Pflichtunterlagen der Anfrage-Wege (FA-KERN-02): Motorrad, Gehäuse, Foto-Anfrage, gemeinsame Fahrzeug-Anfrage.
  if (weg && weg !== 'termin') {
    const fehlt = pflichtMeldung({ ...data, payload }, uploads);
    if (fehlt) {
      return { ok: false, notices: [], error: fehlt };
    }
  }

  // Anfragen aus Rubrik-Wegen (Motorrad, Gehäuse): Nachweis und Pflicht-Uploads der Rubrik (R13, G-11).
  // Bei bestätigtem Totalverlust entfällt das Schlüsselfoto (FA-KERN-02); der Nachweis bleibt.
  const rubrikId = data.kind === 'anfrage' && typeof payload.quelle === 'string' ? QUELLE_RUBRIK[payload.quelle] : undefined;
  if (rubrikId) {
    const rubrik = data.area === 'autoschluessel' ? await getRubrik(rubrikId) : null;
    if (!rubrik) {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    const fall = weg === 'motorrad' || weg === 'gehaeuse' ? fahrzeugFall(weg, payload) : null;
    const pflichtUploads = fall?.keinSchluesselMehr ? rubrik.pflichtUploads.filter((art) => art !== 'schluesselfoto') : rubrik.pflichtUploads;
    const fehlt = rubrikUnterlagenPruefen({ nachweis: rubrik.nachweis, pflichtUploads }, uploads, storageStatus().configured);
    if (fehlt) {
      return { ok: false, notices: [], error: fehlt };
    }
  }

  // Gemeinsame Fahrzeug-Anfrage (FA-KERN-02B, FA-SOFORT-05): Jede Klasse gehört zu ihrer Rubrik. Steht die
  // Rubrik im Backend nicht auf „live“ (abgeschaltet, „später“ oder gelöscht), ist auch der Weg gesperrt;
  // der Kunde bekommt dann keinen Formularfehler, den er nicht beheben kann, sondern den Weg zum Telefon.
  // Welche Unterlagen Pflicht sind, entscheidet allein die Pflichtregel oben; diese Prüfung kommt nur
  // hinzu und lockert nichts.
  if (data.kind === 'anfrage' && payload.quelle === FAHRZEUG_ANFRAGE_QUELLE) {
    const klasseRubrik = typeof payload.klasse === 'string' ? KLASSE_RUBRIK.get(payload.klasse) : undefined;
    if (!klasseRubrik || data.area !== 'autoschluessel') {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    if ((await getRubrik(klasseRubrik))?.status !== 'live') {
      const telefon = (await getSettings()).company?.phone ?? '';
      return { ok: false, notices: [], error: wegGesperrtMeldung(istPlatzhalter(telefon) ? undefined : telefon.trim()) };
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
    const fehlt = nachweisPruefen('sicherungskarte', uploads, storageStatus().configured);
    if (fehlt) {
      return { ok: false, notices: [], error: fehlt };
    }
  }

  // Code-Anfrage (FA-11-17, A-046): Hersteller oder Schloss, Code, Stückzahl und Berechtigung (R13) sind Pflicht.
  // Die geprüften Werte ersetzen die aus dem Browser, im Vorgang und im Abschnitt „Code“ der Zusammenfassung.
  if (data.kind === 'anfrage' && data.area === 'schluessel-nach-code') {
    const angaben = codeAnfragePruefen(payload);
    if (!angaben) {
      return { ok: false, notices: [], error: INVALID_INPUT };
    }
    payload = { ...payload, ...angaben, quelle: CODE_ANFRAGE_QUELLE, berechtigt: true };
    summary = mitGeprueftemCode(summary, angaben);
  }

  // Einsatz vor Ort (E6-BAUMEISTER-05): nur mit bestätigter Berechtigung (R13).
  if (data.kind === 'anfrage' && vorOrtOhneBerechtigung(payload)) {
    return { ok: false, notices: [], error: INVALID_INPUT };
  }

  const result = await createRecord({
    kind: art,
    area: data.area,
    process: prozess,
    contact: data.contact,
    payload,
    summary,
    uploads,
    quote,
    appointment,
    payment,
    consents,
  });

  // Auftragsweg und Gesamtpreis als eigene Felder am Vorgang (FA-KERN-03). Ein Fehler hier kostet nur die
  // Felder: Der Weg steht auch in den Daten des Vorgangs und wird daraus gelesen (`auftragswegVon`).
  if (auftragsweg && result.ok && result.recordId) {
    const weg = auftragsweg;
    try {
      await vorgangAendern(result.recordId, (v) => ({
        auftragsweg: weg,
        ...(remainder ? { remainder: { ...remainder, remainderCents: restbetragCents(remainder.totalCents, v.payment) ?? remainder.remainderCents } } : {}),
      }));
    } catch (fehler) {
      console.error('[termin] Auftragsweg nicht gespeichert', fehler);
    }
  }

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
