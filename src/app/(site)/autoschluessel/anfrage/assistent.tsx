'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import type {
  AppointmentInfo,
  CarKeyService,
  Erreichbarkeit,
  KeyKind,
  OwnArea,
  PriceQuote,
  SummarySection,
  UploadRef,
  VehicleMake,
} from '@/lib/types';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { fetchQuote, fetchSlots, fetchTerminstandorte, type SlotsResponse, type StandorteResponse } from '@/lib/actions/booking';
import {
  KEIN_PARTNER_HINWEIS,
  PARTNER_NACH_ZAHLUNG,
  PARTNER_OHNE_FESTPREIS,
  faelligZeilen,
  standortText,
  terminortZeile,
  zustimmungNeuNoetig,
  zustimmungsSchluessel,
  zahlungsPlan,
  type Auftragsweg,
  type Terminstandort,
} from '@/lib/auftragsweg';
import { submitRecord } from '@/lib/actions/records';
import { erreichbarkeitSatz } from '@/lib/erreichbarkeit';
import { formatCents, formatDuration } from '@/lib/format';
import { aktionMelden } from '@/lib/statistik';
import { Alert } from '@/components/ui/alert';
import { Card, CardBody } from '@/components/ui/card';
import { InfoTip } from '@/components/ui/info-tip';
import { FlowShell } from '@/components/flow/flow-shell';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import {
  KEY_KIND_OPTIONS,
  KEY_KIND_ORDER,
  KEY_PHOTO_SLOTS,
  REGISTRATION_EXAMPLE,
  VIN_INFO,
  WORKING_KEYS_INFO,
  WORKING_KEYS_OPTIONS,
  serviceInfo,
} from '@/components/autoschluessel/optionen';
import { FahrzeugSuche, type FahrzeugWahl } from '@/components/autoschluessel/fahrzeug-suche';
import { anfrageHref, KATALOG_QUELLE, type KatalogEintrag } from '@/components/autoschluessel/fahrzeug-ziel';
import { FahrzeugNichtGefunden } from '@/components/fahrzeug-anfrage/nicht-gefunden';
import { ETAPPEN } from '@/components/autoschluessel/etappen';
import { PreisAnzeige } from '@/components/autoschluessel/preis-anzeige';
import { TerminAuswahl } from '@/components/autoschluessel/termin-auswahl';
import { Bestaetigung } from '@/components/autoschluessel/bestaetigung';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphLaden } from '@/components/visual/glyphen/laden';
import { GlyphPruefsiegel } from '@/components/visual/glyphen/pruefsiegel';
import { GlyphWaage } from '@/components/visual/glyphen/waage';
import { SchluesselartZeichnung } from '@/components/visual/schluesselart-zeichnung';
import { WerkstattZeile, type WerkstattAngaben } from '@/components/vertrauen/werkstatt-zeile';
import { telefonLink } from '@/lib/telefon';
import { BESCHREIBUNG_MIN, beschreibungGueltig } from '@/lib/wege/nachweis';
import { ausserhalbDerRegion, ausserhalbHinweis, buchungsOrt, terminBeimKunden } from '@/lib/terminort';
import {
  schluesselfotosFreiwillig,
  unterlagenSchrittErfuellt,
  type UploadSlotId,
} from './unterlagen-pruefung';

/* ==========================================================================
   Autoschlüssel – geführter Ablauf in fünf Etappen mit 13 Schritten
   Prozessart: Termin mit Anzahlung.
   Alle Fahrzeug-, Leistungs-, Preis- und Termindaten kommen aus der
   Datenschicht; in dieser Datei steht kein fachlicher Wert fest.
   ========================================================================== */

const FLOW_ID = 'autoschluessel-anfrage';
/** Erhöhen, sobald sich AssistentData ändert – alte Zwischenstände verfallen. */
const FLOW_VERSION = 3;

/** Kennung für „Modell nicht in der Liste“. */
const OTHER_MODEL = '__nicht-aufgefuehrt';

/** „Fahrzeug nicht gefunden?“: Anfrage mit Fahrzeugschein, drei Schlüsselfotos und Beschreibung (FA-KERN-02B). */
const ANFRAGE_OHNE_MARKE = anfrageHref();

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_PATTERN = /^\d{4,5}$/;

const COUNTRIES = ['Deutschland', 'Österreich', 'Schweiz'];

const STEPS: FlowStep[] = [
  {
    id: 'marke',
    etappe: ETAPPEN.fahrzeug,
    short: 'Fahrzeug',
    title: 'Welches Fahrzeug haben Sie?',
    hint: 'Geben Sie Marke und Modell ein oder wählen Sie die Marke. So sehen Sie die passenden Schlüsselarten und Preise.',
  },
  {
    id: 'modell',
    etappe: ETAPPEN.fahrzeug,
    short: 'Modell',
    title: 'Welches Modell fahren Sie?',
    hint: 'Das Modell entscheidet darüber, welche Schlüsselarten technisch infrage kommen.',
  },
  {
    id: 'baujahr',
    etappe: ETAPPEN.fahrzeug,
    short: 'Baujahr',
    title: 'Baujahr oder Erstzulassung',
    hint: 'Innerhalb einer Baureihe ändert sich die Schlüsseltechnik oft mit dem Modelljahr.',
  },
  {
    id: 'fahrzeugdaten',
    etappe: ETAPPEN.fahrzeug,
    short: 'Fahrzeugdaten',
    title: 'Weitere Fahrzeugdaten (freiwillig)',
    hint: 'Diese Angaben sind freiwillig. Sie helfen uns, den richtigen Schlüssel eindeutig zuzuordnen.',
  },
  {
    id: 'schluesselart',
    etappe: ETAPPEN.fahrzeug,
    short: 'Schlüsselart',
    title: 'Welche Schlüsselart haben Sie?',
    hint: 'Angezeigt werden nur die Arten, die für Ihr Modell hinterlegt sind.',
  },
  {
    id: 'vorhandene-schluessel',
    etappe: ETAPPEN.fahrzeug,
    short: 'Vorhandene Schlüssel',
    title: 'Wie viele funktionierende Schlüssel haben Sie noch?',
    hint: 'Davon hängt ab, wie aufwendig die Arbeit wird und wie belastbar wir den Preis nennen können.',
  },
  {
    id: 'leistung',
    etappe: ETAPPEN.fahrzeug,
    short: 'Leistung',
    title: 'Was sollen wir für Sie tun?',
    hint: 'Angezeigt werden nur Leistungen, die zu Ihrer Schlüsselart passen.',
  },
  {
    id: 'schluesselfotos',
    etappe: ETAPPEN.fotos,
    short: 'Schlüsselfotos',
    title: 'Fotos Ihres Schlüssels',
    hint: 'Anhand der Fotos erkennen wir Bauform, Profil und Elektronik. Drei Aufnahmen brauchen wir auf jeden Fall.',
  },
  {
    id: 'fahrzeugschein',
    etappe: ETAPPEN.fotos,
    short: 'Fahrzeugschein',
    title: 'Zulassungsbescheinigung Teil I',
    hint: 'Wir fertigen Fahrzeugschlüssel nur für Berechtigte. Dafür brauchen wir einen Nachweis.',
  },
  {
    id: 'kontakt',
    etappe: ETAPPEN.preis,
    short: 'Kontakt',
    title: 'Wie erreichen wir Sie?',
    hint: 'Über diese Angaben bestätigen wir den Termin und melden uns bei Rückfragen.',
  },
  {
    id: 'preis',
    etappe: ETAPPEN.preis,
    short: 'Preis',
    title: 'Preis für Ihren Fall',
    hint: 'Aus Fahrzeug, Schlüsselart und Leistung ermitteln wir, was für Sie gilt.',
  },
  {
    id: 'anzahlung',
    etappe: ETAPPEN.anzahlung,
    short: 'Anzahlung',
    title: 'Anzahlung',
    hint: 'Die Anzahlung reserviert Ihren Platz im Terminplan und wird vollständig angerechnet.',
  },
  {
    id: 'termin',
    etappe: ETAPPEN.termin,
    short: 'Termin',
    title: 'Termin auswählen',
    hint: 'Wählen Sie ein freies Zeitfenster. Danach senden Sie Ihre Anfrage ab.',
  },
];

/**
 * Hilfe statt Ausstieg (FA-KERN-02, A-048): Fotos und Fahrzeugschein bleiben Pflicht, ein Weg ohne
 * Unterlagen entfällt. Wer nicht weiterkommt, ruft an, macht später weiter (die Angaben bleiben auf diesem
 * Gerät gespeichert) oder erbittet einen Rückruf. Der Rückruf ist nur eine Kontaktbitte über die
 * bestehende Beratung, kein Auftrag und kein Weg zu einem Schlüssel.
 */
function HilfeBeiUnterlagen({ telefon, erreichbarkeit }: { telefon?: string; erreichbarkeit?: Erreichbarkeit }) {
  const telefonHref = telefonLink(telefon);
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-4">
      <p className="text-body font-semibold text-foreground">Sie kommen hier nicht weiter?</p>
      <ul className="mt-2 max-w-measure space-y-2 text-small text-foreground-muted">
        {telefon && (
          <li>
            Rufen Sie uns an:{' '}
            {telefonHref ? (
              <a href={telefonHref} className="font-mono font-semibold tabular-nums text-primary">
                {telefon}
              </a>
            ) : (
              <span className="font-mono tabular-nums">{telefon}</span>
            )}
            {erreichbarkeit && <span className="block">{erreichbarkeitSatz(erreichbarkeit)}</span>}
          </li>
        )}
        <li>
          Später weitermachen: Ihre Angaben bleiben auf diesem Gerät gespeichert. Die Fotos wählen Sie dann bitte erneut aus.
        </li>
        <li>
          <Link href="/beratung#rueckruf" className="font-semibold text-primary underline">
            Rückruf erbitten
          </Link>
          : Wir rufen Sie an und klären Ihre Fragen.
        </li>
      </ul>
      <p className="mt-3 max-w-measure text-small text-foreground-muted">
        Die Unterlagen schützen Sie vor Missbrauch: Wir fertigen Fahrzeugschlüssel nur für Berechtigte.
      </p>
    </div>
  );
}

/** Hinweis im Fotoschritt, wenn kein funktionierender Schlüssel mehr da ist (noch nicht bestätigt). */
const HINWEIS_OHNE_SCHLUESSEL =
  'Ist noch ein Schlüssel da, auch ein defekter, fotografieren Sie ihn bitte. Ist keiner mehr da, '
  + 'bestätigen Sie das unten.';

/** Hinweis im Fotoschritt nach der Bestätigung „Ich habe keinen Schlüssel mehr“. */
const HINWEIS_KEIN_SCHLUESSEL_BESTAETIGT =
  'Sie haben bestätigt, dass kein Schlüssel mehr da ist. Die Fotos sind dann freiwillig.';

interface AssistentData {
  makeSlug: string;
  modelSlug: string;
  /** Freitext, wenn das Modell nicht aufgeführt ist. */
  modelOther: string;
  /** Generationen der in der Suche gewählten Reihe (A-047); leer, wenn sie keine trägt. */
  generationen: NonNullable<KatalogEintrag['generationen']>;
  /** Gewählte Generation (Bezeichnung), freiwillig. */
  generation: string;
  year: string;
  /** Monat der Erstzulassung, freiwillig ("1" bis "12"). */
  registrationMonth: string;
  engine: string;
  vin: string;
  keyKind: KeyKind | '';
  workingKeys: number | null;
  /** Ausdrücklich bestätigt: kein Schlüssel mehr vorhanden (nur bei 0 funktionierenden Schlüsseln). */
  keinSchluesselMehr: boolean;
  serviceId: string;
  entitlementConfirmed: boolean;
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  note: string;
  depositAccepted: boolean;
  /** AGB gelesen, Widerrufsbelehrung zur Kenntnis genommen. */
  termsAccepted: boolean;
  /** Ausdrückliches Verlangen nach Beginn vor Ende der Widerrufsfrist (§ 356 Abs. 4, § 357a Abs. 2 BGB). */
  earlyStartRequested: boolean;
  slotDate: string;
  slotTime: string;
  /** Gewählter Terminstandort (FA-KERN-03); der Partner erscheint nur, wenn der Server ihn anbietet. */
  terminstandort: Terminstandort;
}

/** Ende der Reservierung ab jetzt (Stripe hält die Zahlungsseite 31 Minuten offen, angezeigt werden 30). */
function reservierungsEnde(): string {
  return new Date(Date.now() + 30 * 60 * 1000).toISOString();
}

/** Schlüssel für die Terminstandorte: Postleitzahl, Land und Leistung. */
function standorteKeyOf(data: AssistentData): string {
  return [data.postalCode.trim(), data.country, data.serviceId].join('|');
}

/**
 * Schlüssel, der alle preisbestimmenden Eingaben zusammenfasst.
 * Ändert sich eine davon, gilt ein zuvor ermittelter Preis als überholt.
 */
function quoteKeyOf(data: AssistentData): string {
  const modelSlug = data.modelSlug === OTHER_MODEL ? '' : data.modelSlug;
  return [
    data.makeSlug,
    modelSlug,
    data.serviceId,
    data.keyKind,
    String(data.workingKeys ?? ''),
  ].join('|');
}

export interface AssistentProps {
  makes: VehicleMake[];
  /** Adresse, unter der die Suche den Fahrzeugkatalog nachlädt (G-14, A-047); ohne sie bleibt nur das Markenraster. */
  katalogAdresse?: string;
  services: CarKeyService[];
  /** Ist ein Zahlungsdienstleister angebunden? */
  paymentConfigured: boolean;
  /** Aufbewahrungsfristen in Tagen. */
  retentionDays: { vehicleRegistration: number; keyPhotos: number };
  /** Aktuelles Jahr – auf dem Server ermittelt, damit Server und Browser übereinstimmen. */
  currentYear: number;
  /** Vorbelegung aus ?marke=, ?modell= und ?vorhanden=. */
  preselect: { makeSlug: string; modelSlug: string; workingKeys: number | null };
  /** Nummer eines stornierten Termins, dessen Anzahlung nicht einging (E-120); der Server prüft sie. */
  vorherigerVorgang?: string;
  /** Werkstatt und Telefon über dem Buchungsknopf – fehlt der Standort, entfällt die Zeile. */
  werkstatt?: WerkstattAngaben;
  /** Erreichbarkeit aus den Einstellungen, neben der Telefonnummer in der Hilfe bei den Unterlagen. */
  erreichbarkeit?: Erreichbarkeit;
  /** Regionaler Eigenbereich aus den Einstellungen (FA-KERN-03); ohne Angabe gilt 35*. */
  eigenbereich?: OwnArea;
}

export function Assistent({
  makes,
  katalogAdresse,
  services,
  paymentConfigured,
  retentionDays,
  currentYear,
  preselect,
  werkstatt,
  erreichbarkeit,
  vorherigerVorgang,
  eigenbereich,
}: AssistentProps) {
  const initial = useMemo<AssistentData>(
    () => ({
      makeSlug: preselect.makeSlug,
      modelSlug: preselect.modelSlug,
      modelOther: '',
      generationen: [],
      generation: '',
      year: '',
      registrationMonth: '',
      engine: '',
      vin: '',
      keyKind: '',
      workingKeys: preselect.workingKeys,
      keinSchluesselMehr: false,
      serviceId: '',
      entitlementConfirmed: false,
      salutation: '',
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      street: '',
      postalCode: '',
      city: '',
      country: COUNTRIES[0],
      note: '',
      depositAccepted: false,
      termsAccepted: false,
      earlyStartRequested: false,
      slotDate: '',
      slotTime: '',
      terminstandort: 'werkstatt',
    }),
    [preselect.makeSlug, preselect.modelSlug, preselect.workingKeys],
  );

  /* Dateien bleiben bewusst außerhalb des Zwischenspeichers – sie lassen
     sich nicht im Browserspeicher ablegen und werden nach einem Neuladen
     erneut ausgewählt. */
  const [files, setFiles] = useState<Record<UploadSlotId, PickedFile[]>>(() => ({
    vorderseite: [],
    rueckseite: [],
    bart: [],
    detail: [],
    fahrzeugschein: [],
  }));

  /* Preis und Termine werden zusammen mit dem Schlüssel gespeichert, aus dem
     sie ermittelt wurden. Ändert sich eine Eingabe, passt der Schlüssel nicht
     mehr – das alte Ergebnis gilt damit automatisch als überholt. */
  const [quoteResult, setQuoteResult] = useState<{
    key: string;
    quote: PriceQuote | null;
    error: string | null;
  } | null>(null);

  const [slotsResult, setSlotsResult] = useState<{
    key: string;
    days: SlotsResponse | null;
    error: string | null;
  } | null>(null);

  /* Terminstandorte (FA-KERN-03) hängen an Postleitzahl, Land und Leistung; der Server ermittelt sie. */
  const [standorteResult, setStandorteResult] = useState<{ key: string; daten: StandorteResponse } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Erster wählbarer Treffer der Fahrzeugsuche: „Weiter“ übernimmt ihn (A-025)
  const [vorschlag, setVorschlag] = useState<FahrzeugWahl | null>(null);
  const [done, setDone] = useState<{
    reference: string;
    /** Fehlt im Partnerweg: Den Termin stimmt der Partnerbetrieb ab. */
    appointment?: AppointmentInfo;
    weg: Auftragsweg;
    quote: PriceQuote;
    summary: SummarySection[];
    notices: string[];
    redirectUrl?: string;
    /** Bis wann der Termin ohne Anzahlung reserviert bleibt (ISO). */
    reserviertBis?: string;
  } | null>(null);

  /* Preis und Zeitfenster werden über einen Schlüssel an die Eingaben
     gebunden. Die folgenden Funktionen sind bewusst vor dem Ablauf definiert,
     weil die Schrittprüfung sie schon beim ersten Rendern braucht. */
  function quoteFor(current: AssistentData): PriceQuote | null {
    return quoteResult?.key === quoteKeyOf(current) ? quoteResult.quote : null;
  }

  function slotsKeyOf(current: AssistentData): string {
    const found = quoteFor(current);
    return `${found?.slotMinutes ?? ''}|${found?.leadTimeDays ?? ''}`;
  }

  function slotsFor(current: AssistentData): SlotsResponse | null {
    return slotsResult?.key === slotsKeyOf(current) ? slotsResult.days : null;
  }

  function standorteFor(current: AssistentData): StandorteResponse | null {
    return standorteResult?.key === standorteKeyOf(current) ? standorteResult.daten : null;
  }

  /** Partner gewählt und vom Server angeboten? Sonst gilt der Werkstatttermin. */
  function partnerGewaehlt(current: AssistentData): boolean {
    return current.terminstandort === 'partner' && Boolean(standorteFor(current)?.standorte.some((s) => s.standort === 'partner'));
  }

  /** Weg zum gewählten Standort, wie ihn der Server ermitteln wird. */
  function wegFor(current: AssistentData): Auftragsweg {
    if (partnerGewaehlt(current)) return 'partner';
    return standorteFor(current)?.standorte[0]?.weg ?? 'hauptzentrale';
  }

  /**
   * Ein zwischengespeicherter Termin kann inzwischen vergeben sein. Erst wenn
   * die Zeitfenster geladen sind, gilt eine Auswahl als gesichert.
   */
  function isSelectedSlotFree(current: AssistentData): boolean {
    const loaded = slotsFor(current);
    if (!loaded || !current.slotDate || !current.slotTime) return false;
    return loaded.days.some(
      (day) =>
        day.date === current.slotDate &&
        day.slots.some((entry) => entry.time === current.slotTime && entry.available),
    );
  }

  const schutz = useFormularSchutz();

  const flow = useFlow<AssistentData>({
    id: FLOW_ID,
    version: FLOW_VERSION,
    steps: STEPS,
    initial,
    validate: (data, stepId) => isStepComplete(data, stepId),
  });

  const data = flow.data;

  /* ---------- Abgeleitete Daten ----------------------------------------- */

  const make = useMemo(
    () => makes.find((m) => m.slug === data.makeSlug) ?? null,
    [makes, data.makeSlug],
  );
  const isOtherModel = data.modelSlug === OTHER_MODEL;
  const model = useMemo(
    () => (make && !isOtherModel ? make.models.find((m) => m.slug === data.modelSlug) ?? null : null),
    [make, isOtherModel, data.modelSlug],
  );
  const keyKinds = useMemo<KeyKind[]>(() => {
    if (model) return KEY_KIND_ORDER.filter((kind) => model.keyKinds.includes(kind));
    if (!make) return [];
    // Ohne konkretes Modell zeigen wir alle Arten, die bei dieser Marke vorkommen.
    const known = new Set(make.models.flatMap((m) => m.keyKinds));
    return KEY_KIND_ORDER.filter((kind) => known.has(kind));
  }, [make, model]);

  const matchingServices = useMemo(
    () =>
      data.keyKind
        ? services.filter(
            (s) =>
              s.active &&
              s.keyKinds.includes(data.keyKind as KeyKind) &&
              // Ein Zweitschlüssel braucht einen funktionierenden Schlüssel als Vorlage (E4-PROBENUTZER-01).
              !(s.id === 'zweitschluessel' && data.workingKeys === 0),
          )
        : [],
    [services, data.keyKind, data.workingKeys],
  );
  const service = useMemo(
    () => services.find((s) => s.id === data.serviceId) ?? null,
    [services, data.serviceId],
  );

  const years = useMemo(() => {
    const from = model
      ? model.yearFrom
      : make
        ? Math.min(...make.models.map((m) => m.yearFrom))
        : currentYear;
    const to = model?.yearTo ?? currentYear;
    // Gewählte Generation mit Bauzeitraum (A-047): nur ihre Jahre, sonst die Jahre wie bisher.
    const generation = data.generationen.find((g) => g.bezeichnung === data.generation);
    const von = generation?.baujahrVon ? Math.max(from, generation.baujahrVon) : from;
    const bis = generation?.baujahrBis ? Math.min(to, generation.baujahrBis) : to;
    const list: number[] = [];
    for (let year = bis >= von ? bis : to; year >= (bis >= von ? von : from); year -= 1) list.push(year);
    return list;
  }, [make, model, currentYear, data.generationen, data.generation]);

  const months = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long' });
    return Array.from({ length: 12 }, (_, index) => ({
      value: String(index + 1),
      label: formatter.format(new Date(Date.UTC(2000, index, 1))),
    }));
  }, []);

  const modelName = isOtherModel ? data.modelOther.trim() : model?.name ?? '';
  const fotosFreiwillig = schluesselfotosFreiwillig(data.workingKeys, data.keinSchluesselMehr);

  /* ---------- Schrittprüfung -------------------------------------------- */

  function isStepComplete(current: AssistentData, stepId: string): boolean {
    switch (stepId) {
      case 'marke':
        return Boolean(current.makeSlug);
      case 'modell':
        return current.modelSlug === OTHER_MODEL
          ? current.modelOther.trim().length >= 2
          : Boolean(current.modelSlug);
      case 'baujahr':
        return /^\d{4}$/.test(current.year);
      case 'fahrzeugdaten':
        return current.vin.trim() === '' || VIN_PATTERN.test(current.vin.trim());
      case 'schluesselart':
        return Boolean(current.keyKind);
      case 'vorhandene-schluessel':
        return current.workingKeys !== null;
      case 'leistung':
        return Boolean(current.serviceId);
      case 'schluesselfotos':
      case 'fahrzeugschein':
        return unterlagenSchrittErfuellt(stepId, current, files);
      case 'kontakt':
        return isContactComplete(current);
      case 'preis':
        return quoteFor(current) !== null;
      case 'anzahlung':
        return (
          quoteFor(current) !== null
          && current.depositAccepted
          && current.termsAccepted
          && current.earlyStartRequested
        );
      case 'termin':
        // Partnerweg: Den Termin stimmt der Partnerbetrieb nach der Zahlung ab (FA-KERN-03).
        return partnerGewaehlt(current) || isSelectedSlotFree(current);
      default:
        return true;
    }
  }

  function blockedHint(stepId: string): string {
    switch (stepId) {
      case 'marke':
        return 'Bitte wählen Sie zuerst Ihr Fahrzeug.';
      case 'modell':
        return isOtherModel
          ? 'Bitte tragen Sie die Modellbezeichnung ein.'
          : 'Bitte wählen Sie ein Modell aus.';
      case 'baujahr':
        return 'Bitte wählen Sie das Baujahr oder das Jahr der Erstzulassung.';
      case 'fahrzeugdaten':
        return 'Die Fahrgestellnummer besteht aus genau 17 Zeichen. Bitte prüfen Sie die Eingabe oder lassen Sie das Feld leer.';
      case 'schluesselart':
        return 'Bitte wählen Sie die Schlüsselart aus.';
      case 'vorhandene-schluessel':
        return 'Bitte geben Sie an, wie viele Schlüssel noch funktionieren.';
      case 'leistung':
        return 'Bitte wählen Sie die gewünschte Leistung aus.';
      case 'schluesselfotos':
        return data.workingKeys === 0
          ? 'Bitte laden Sie Vorderseite, Rückseite und Spitze Ihres Schlüssels hoch oder bestätigen Sie, dass Sie keinen Schlüssel mehr haben.'
          : 'Bitte laden Sie Vorderseite, Rückseite und Spitze Ihres Schlüssels hoch.';
      case 'fahrzeugschein':
        return 'Bitte laden Sie die Zulassungsbescheinigung hoch und bestätigen Sie Ihre Berechtigung.';
      case 'kontakt':
        return `Bitte füllen Sie Name, E-Mail-Adresse, Telefonnummer, Postleitzahl und Ort aus und beschreiben Sie Ihr Anliegen kurz (mindestens ${BESCHREIBUNG_MIN} Zeichen).`;
      case 'preis':
        return 'Der Preis wird noch ermittelt.';
      case 'anzahlung':
        return 'Bitte bestätigen Sie die Anzahlung, die AGB und den Beginn vor Ablauf der Widerrufsfrist, um fortzufahren.';
      case 'termin':
        return 'Bitte wählen Sie ein freies Zeitfenster aus.';
      default:
        return '';
    }
  }

  /* ---------- Auswahl zurücksetzen, wenn sich die Grundlage ändert ------- */

  function selectMake(slug: string) {
    flow.update({
      makeSlug: slug,
      modelSlug: '',
      modelOther: '',
      generationen: [],
      generation: '',
      year: '',
      keyKind: '',
      serviceId: '',
      slotDate: '',
      slotTime: '',
      depositAccepted: false,
    });
  }

  /**
   * Treffer der Fahrzeugsuche: gepflegtes Modell direkt zum Baujahr, sonst „Modell nicht aufgeführt“
   * vorbelegt. Trägt die Reihe Generationen, bietet der Schritt Baujahr sie zur Auswahl an (A-047).
   */
  function fahrzeugGewaehlt({ ziel, eintrag }: FahrzeugWahl) {
    const neu: Partial<AssistentData> = {
      makeSlug: ziel.makeSlug,
      modelSlug: ziel.art === 'gepflegt' ? ziel.modelSlug : OTHER_MODEL,
      modelOther: ziel.art === 'gepflegt' ? '' : ziel.modelOther,
      generationen: eintrag.generationen ?? [],
      generation: '',
      year: '',
      keyKind: '',
      serviceId: '',
      slotDate: '',
      slotTime: '',
      depositAccepted: false,
    };
    flow.updateAndGoTo(neu, ziel.art === 'gepflegt' ? 'baujahr' : 'modell');
  }

  function selectModel(slug: string) {
    flow.update({
      modelSlug: slug,
      modelOther: '',
      generationen: [],
      generation: '',
      year: '',
      keyKind: '',
      serviceId: '',
      slotDate: '',
      slotTime: '',
      depositAccepted: false,
    });
  }

  function selectKeyKind(kind: string) {
    flow.update({
      keyKind: kind as KeyKind,
      serviceId: '',
      slotDate: '',
      slotTime: '',
      depositAccepted: false,
    });
  }

  function selectService(id: string) {
    flow.update({ serviceId: id, slotDate: '', slotTime: '', depositAccepted: false });
  }

  function selectWorkingKeys(value: number) {
    // Totalverlust gilt nur bei 0 funktionierenden Schlüsseln (FA-KERN-02).
    flow.update({ workingKeys: value, keinSchluesselMehr: value === 0 && data.keinSchluesselMehr, slotDate: '', slotTime: '', depositAccepted: false });
  }

  function setSlotFiles(slot: UploadSlotId, next: PickedFile[]) {
    setFiles((prev) => ({ ...prev, [slot]: next }));
  }

  /* ---------- Preis ermitteln ------------------------------------------- */

  const needsQuote =
    flow.step.id === 'preis' || flow.step.id === 'anzahlung' || flow.step.id === 'termin';
  const hasQuoteInputs = Boolean(
    data.makeSlug && data.serviceId && data.keyKind && data.workingKeys !== null,
  );
  const quoteKey = quoteKeyOf(data);
  const quote = quoteFor(data);
  const quoteError = quoteResult?.key === quoteKey ? quoteResult.error : null;
  const quoteLoading = needsQuote && hasQuoteInputs && quoteResult?.key !== quoteKey;

  useEffect(() => {
    if (!needsQuote || !hasQuoteInputs) return;

    let cancelled = false;
    const failure = 'Der Preis konnte nicht ermittelt werden. Bitte versuchen Sie es erneut.';

    fetchQuote({
      makeSlug: data.makeSlug,
      modelSlug: model?.slug,
      serviceId: data.serviceId,
      keyKind: data.keyKind as KeyKind,
      workingKeys: data.workingKeys ?? 0,
    })
      .then((response) => {
        if (cancelled) return;
        setQuoteResult(
          response.ok && response.quote
            ? { key: quoteKey, quote: response.quote, error: null }
            : { key: quoteKey, quote: null, error: response.error ?? failure },
        );
      })
      .catch(() => {
        if (!cancelled) setQuoteResult({ key: quoteKey, quote: null, error: failure });
      });

    return () => {
      cancelled = true;
    };
  }, [needsQuote, hasQuoteInputs, quoteKey, data.makeSlug, model?.slug, data.serviceId, data.keyKind, data.workingKeys]);

  /* ---------- Terminstandorte laden (FA-KERN-03) ------------------------- */

  const standorteKey = standorteKeyOf(data);
  const standorte = standorteFor(data);
  const weg = wegFor(data);
  const partnerweg = weg === 'partner';
  const plan = quote ? zahlungsPlan(weg, quote) : null;
  const werkstattStadt = werkstatt?.standort?.city;
  // Ort des Direkttermins: Werkstatt oder beim Fahrzeug (Fahrzeugöffnung).
  const direktOrt = buchungsOrt(data.serviceId);
  const kontaktVollstaendig = isContactComplete(data);

  useEffect(() => {
    if (!needsQuote || !kontaktVollstaendig) return;
    let cancelled = false;
    fetchTerminstandorte({ postleitzahl: data.postalCode.trim(), land: data.country, leistung: data.serviceId })
      .then((daten) => {
        if (!cancelled) setStandorteResult({ key: standorteKey, daten });
      })
      .catch(() => {
        // Ohne Antwort bleibt es beim Werkstatttermin wie bisher.
        if (!cancelled) setStandorteResult({ key: standorteKey, daten: { standorte: [{ standort: 'werkstatt', weg: 'hauptzentrale' }], ohnePartner: false } });
      });
    return () => {
      cancelled = true;
    };
  }, [needsQuote, kontaktVollstaendig, standorteKey, data.postalCode, data.country, data.serviceId]);

  // Die Zustimmung zur Zahlung gilt nur für den Betrag, den der Kunde bestätigt hat (FA-KERN-03): Wechselt
  // der Zahlungsplan, etwa durch einen anderen Standort oder eine andere Postleitzahl, muss sie neu her.
  const planSchluessel = zustimmungsSchluessel(plan);
  const letzterPlan = useRef(planSchluessel);
  const zustimmungGegeben = data.depositAccepted;
  const setFlow = flow.set;
  useEffect(() => {
    if (!planSchluessel) return;
    const vorher = letzterPlan.current;
    letzterPlan.current = planSchluessel;
    if (zustimmungGegeben && zustimmungNeuNoetig(vorher, planSchluessel)) setFlow('depositAccepted', false);
  }, [planSchluessel, zustimmungGegeben, setFlow]);

  /* ---------- Termine laden --------------------------------------------- */

  const isSlotStep = flow.step.id === 'termin' && !partnerweg;
  const slotMinutes = quote?.slotMinutes ?? null;
  const leadTimeDays = quote?.leadTimeDays ?? null;
  const slotsKey = slotsKeyOf(data);
  const slots = slotsFor(data);
  const slotsError = slotsResult?.key === slotsKey ? slotsResult.error : null;
  const slotsLoading = isSlotStep && slotMinutes !== null && slotsResult?.key !== slotsKey;
  const staleSlotSelection = Boolean(data.slotDate) && slots !== null && !isSelectedSlotFree(data);

  useEffect(() => {
    if (!isSlotStep || slotMinutes === null || leadTimeDays === null) return;

    let cancelled = false;
    const failure = 'Die freien Termine konnten nicht geladen werden. Bitte versuchen Sie es erneut.';

    fetchSlots(slotMinutes, leadTimeDays)
      .then((response) => {
        if (cancelled) return;
        setSlotsResult(
          response.error
            ? { key: slotsKey, days: null, error: response.error }
            : { key: slotsKey, days: response, error: null },
        );
      })
      .catch(() => {
        if (!cancelled) setSlotsResult({ key: slotsKey, days: null, error: failure });
      });

    return () => {
      cancelled = true;
    };
  }, [isSlotStep, slotMinutes, leadTimeDays, slotsKey]);

  /* ---------- Zusammenfassung und Absenden ------------------------------ */

  function buildUploads(): Array<Omit<UploadRef, 'id' | 'uploadedAt'>> {
    const result: Array<Omit<UploadRef, 'id' | 'uploadedAt'>> = [];
    // Jede Datei mit ihrem Steckplatz (FA-KERN-02); der Server prüft die drei Pflichtaufnahmen daran.
    for (const slot of KEY_PHOTO_SLOTS) {
      for (const file of files[slot.id]) {
        result.push(alsUpload(file, 'schluesselfoto', slot.steckplatz));
      }
    }
    for (const file of files.fahrzeugschein) {
      result.push(alsUpload(file, 'fahrzeugschein', 'fahrzeugschein'));
    }
    return result;
  }

  function priceValue(current: PriceQuote): string {
    if (current.mode === 'fest' && current.priceCents !== undefined) {
      return formatCents(current.priceCents);
    }
    if (current.mode === 'rahmen') {
      if (current.priceFromCents !== undefined && current.priceToCents !== undefined) {
        return `${formatCents(current.priceFromCents)} – ${formatCents(current.priceToCents)}`;
      }
      if (current.priceFromCents !== undefined) return `ab ${formatCents(current.priceFromCents)}`;
      return 'Preisrahmen wird nach Prüfung genannt';
    }
    return 'Wird vor der verbindlichen Buchung geprüft';
  }

  function buildSummary(current: PriceQuote): SummarySection[] {
    const vehicleRows = [
      { label: 'Marke', value: make?.name ?? '–' },
      {
        label: 'Modell',
        value: isOtherModel ? `${modelName} (nicht in der Liste aufgeführt)` : modelName || '–',
      },
      ...(data.generation ? [{ label: 'Generation', value: data.generation }] : []),
      {
        label: 'Baujahr / Erstzulassung',
        value: data.registrationMonth
          ? `${months.find((m) => m.value === data.registrationMonth)?.label ?? ''} ${data.year}`
          : data.year,
      },
    ];
    if (data.engine.trim()) vehicleRows.push({ label: 'Motorisierung', value: data.engine.trim() });
    if (data.vin.trim()) {
      vehicleRows.push({ label: 'Fahrgestellnummer', value: data.vin.trim().toUpperCase() });
    }

    const keyKindLabel = data.keyKind ? KEY_KIND_OPTIONS[data.keyKind as KeyKind].label : '–';
    const anzahlFotos = KEY_PHOTO_SLOTS.reduce((sum, slot) => sum + files[slot.id].length, 0);
    const workingKeysLabel =
      WORKING_KEYS_OPTIONS.find((option) => option.value === data.workingKeys)?.label ?? '–';

    const sections: SummarySection[] = [
      { title: 'Fahrzeug', rows: vehicleRows },
      {
        title: 'Schlüssel und Leistung',
        rows: [
          { label: 'Schlüsselart', value: keyKindLabel },
          { label: 'Funktionierende Schlüssel', value: workingKeysLabel },
          { label: 'Gewünschte Leistung', value: service?.label ?? '–' },
          {
            label: 'Fahrzeug beim Termin',
            value: current.requiresVehicleOnSite ? 'wird benötigt' : 'nicht zwingend nötig',
          },
        ],
      },
      partnerweg
        ? {
            // Partnerweg (FA-KERN-03): nie nur die Anzahlung.
            title: 'Preis und Zahlung',
            rows: faelligZeilen('partner', current),
          }
        : {
            title: 'Preis und Anzahlung',
            rows: [
              {
                label:
                  current.mode === 'fest'
                    ? 'Gesamtpreis'
                    : current.mode === 'rahmen'
                      ? 'Preisrahmen'
                      : 'Preis',
                value: priceValue(current),
              },
              { label: 'Anzahlung', value: formatCents(current.depositCents) },
              ...(current.mode === 'fest' && current.remainderCents !== undefined
                ? [{ label: 'Restbetrag beim Termin', value: formatCents(current.remainderCents) }]
                : []),
            ],
          },
      partnerweg
        ? {
            title: 'Termin',
            rows: [
              { label: 'Terminstandort', value: standortText('partner') },
              { label: 'Termin', value: 'stimmt der Partnerbetrieb nach Ihrer Zahlung mit Ihnen ab' },
            ],
          }
        : {
            title: 'Termin',
            rows: [
              { label: 'Terminstandort', value: standortText('werkstatt', werkstattStadt, buchungsOrt(data.serviceId)) },
              { label: 'Datum', value: data.slotDate },
              { label: 'Uhrzeit', value: `${data.slotTime} Uhr` },
              { label: 'Eingeplante Dauer', value: formatDuration(current.slotMinutes) },
              {
                label: 'Art des Termins',
                value: terminBeimKunden(data.serviceId)
                  ? 'Bei Ihrem Fahrzeug (Ort nach telefonischer Absprache)'
                  : current.requiresVehicleOnSite
                    ? 'In der Werkstatt, mit Fahrzeug'
                    : 'In der Werkstatt',
              },
            ],
          },
      {
        title: 'Kontakt',
        rows: [
          {
            label: 'Name',
            value: [data.salutation, data.firstName.trim(), data.lastName.trim()]
              .filter(Boolean)
              .join(' '),
          },
          ...(data.company.trim() ? [{ label: 'Firma', value: data.company.trim() }] : []),
          { label: 'E-Mail', value: data.email.trim() },
          { label: 'Telefon', value: data.phone.trim() },
          {
            label: 'Anschrift',
            value: [
              data.street.trim(),
              `${data.postalCode.trim()} ${data.city.trim()}`.trim(),
              data.country,
            ]
              .filter(Boolean)
              .join(', '),
          },
          { label: 'Ihr Anliegen', value: data.note.trim() },
        ],
      },
      {
        title: 'Unterlagen',
        rows: [
          {
            label: 'Schlüsselfotos',
            value:
              anzahlFotos === 0 && fotosFreiwillig
                ? 'keine Schlüsselfotos (kein Schlüssel vorhanden)'
                : `${anzahlFotos} Datei(en)`,
          },
          { label: 'Zulassungsbescheinigung', value: `${files.fahrzeugschein.length} Datei(en)` },
        ],
      },
    ];

    return sections;
  }

  /** Erster Schritt, der noch nicht vollständig ist – sonst null. */
  function firstIncompleteStep(): FlowStep | null {
    return STEPS.find((step) => !isStepComplete(data, step.id)) ?? null;
  }

  async function handleSubmit() {
    if (!quote || (!partnerweg && (!data.slotDate || !data.slotTime))) return;
    // Laufende Uploads abschließen, damit ihre Kennungen mitgehen.
    await uploadsAbwarten();

    /* Ein geladener Zwischenstand enthält keine Dateien mehr. Deshalb vor dem
       Absenden noch einmal jeden Schritt prüfen und notfalls dorthin zurück. */
    const incomplete = firstIncompleteStep();
    if (incomplete) {
      setSubmitError(
        `Bitte ergänzen Sie zuerst den Schritt „${incomplete.title}“. ${blockedHint(incomplete.id)}`,
      );
      flow.goTo(incomplete.id);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    // Im Partnerweg stimmt der Partnerbetrieb den Termin ab; es wird kein Zeitfenster der Werkstatt belegt.
    const appointment: AppointmentInfo | undefined = partnerweg
      ? undefined
      : {
          date: data.slotDate,
          time: data.slotTime,
          durationMinutes: quote.slotMinutes,
          // Online gebuchte Termine finden in der Werkstatt statt (Erg. Leitfaden §1),
          // Leistungen beim Fahrzeug des Kunden (Fahrzeugöffnung) nach Absprache.
          location: buchungsOrt(data.serviceId),
        };
    const summary = buildSummary(quote);

    try {
      const result = await submitRecord({
        kind: 'termin',
        area: 'autoschluessel',
        process: 'termin-mit-anzahlung',
        contact: {
          salutation: data.salutation || undefined,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          company: data.company.trim() || undefined,
          email: data.email.trim(),
          phone: data.phone.trim(),
          street: data.street.trim() || undefined,
          postalCode: data.postalCode.trim(),
          city: data.city.trim(),
          country: data.country,
        },
        payload: {
          ...(vorherigerVorgang ? { vorherigerVorgang } : {}),
          makeSlug: data.makeSlug,
          makeName: make?.name,
          modelSlug: isOtherModel ? null : model?.slug,
          modelName,
          modelNotListed: isOtherModel,
          year: data.year,
          registrationMonth: data.registrationMonth || null,
          generation: data.generation || null,
          engine: data.engine.trim() || null,
          vin: data.vin.trim().toUpperCase() || null,
          keyKind: data.keyKind,
          workingKeys: data.workingKeys,
          keinSchluesselMehr: data.workingKeys === 0 && data.keinSchluesselMehr,
          serviceId: data.serviceId,
          serviceLabel: service?.label,
          note: data.note.trim(),
          entitlementConfirmed: data.entitlementConfirmed,
          depositAccepted: data.depositAccepted,
        },
        // Pflicht-Zustimmungen – der Server prüft sie und speichert sie mit Zeitpunkt.
        consents: {
          terms: data.termsAccepted,
          deposit: data.depositAccepted,
          authorization: data.entitlementConfirmed,
          earlyStart: data.earlyStartRequested,
        },
        summary,
        uploads: buildUploads(),
        quote,
        appointment,
        // Der Server leitet Preis, Anzahlung und Terminlänge aus diesen
        // Angaben selbst her und prüft das Zeitfenster erneut.
        verify: {
          kind: 'autoschluessel',
          makeSlug: data.makeSlug,
          modelSlug: isOtherModel ? null : (model?.slug ?? null),
          serviceId: data.serviceId,
          keyKind: data.keyKind as KeyKind,
          workingKeys: data.workingKeys ?? 0,
        },
        // Nur ein Wunsch: Der Server ermittelt Standort, Weg und Betrag selbst (FA-KERN-03).
        terminstandort: partnerweg ? 'partner' : 'werkstatt',
        payment: plan?.art === 'gesamt'
          ? { scope: 'gesamt', amountCents: plan.jetztCents, description: 'Gesamtbetrag Autoschlüssel-Auftrag' }
          : {
              scope: 'anzahlung',
              amountCents: quote.depositCents,
              description: `Anzahlung für ${service?.label ?? 'Autoschlüssel-Leistung'}`,
            },
        schutz: await schutz.daten(),
      });
      schutz.antwortBeachten(result);

      if (result.ok && result.reference) {
        // Messung (nur mit Einwilligung in die Statistik): Terminanfrage abgesendet.
        aktionMelden('terminanfrage', 'autoschluessel');
        setDone({
          reference: result.reference,
          appointment,
          weg,
          quote,
          summary,
          notices: result.notices,
          redirectUrl: result.redirectUrl,
          // Stripe hält die Zahlungsseite 31 Minuten offen – angezeigt wird die sichere Untergrenze.
          reserviertBis: result.redirectUrl ? reservierungsEnde() : undefined,
        });
        clearFlow(FLOW_ID);
        // Wie in der Kasse: sofort zur Zahlungsseite. Ohne Anzahlung wird das Zeitfenster wieder frei.
        if (result.redirectUrl) window.location.assign(result.redirectUrl);
      } else {
        setSubmitError(
          result.error ?? 'Ihre Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        );
      }
    } catch {
      setSubmitError('Ihre Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Bestaetigung
        reference={done.reference}
        appointment={done.appointment}
        weg={done.weg}
        quote={done.quote}
        summary={done.summary}
        notices={done.notices}
        redirectUrl={done.redirectUrl}
        reserviertBis={done.reserviertBis}
        werkstatt={werkstatt?.standort}
      />
    );
  }

  /* ---------- Darstellung der einzelnen Schritte ------------------------ */

  /* Ohne funktionierenden Schlüssel ersetzt ein eigener Hinweis den des Fotoschritts: vor der Bestätigung
     der Weg dorthin, danach die Bestätigung selbst. Der Rahmen zeigt den Hinweis aus dem aktuellen Schritt. */
  const anzeigeFlow =
    flow.step.id === 'schluesselfotos' && data.workingKeys === 0
      ? { ...flow, step: { ...flow.step, hint: fotosFreiwillig ? HINWEIS_KEIN_SCHLUESSEL_BESTAETIGT : HINWEIS_OHNE_SCHLUESSEL } }
      : partnerweg && flow.step.id === 'anzahlung'
        ? {
            ...flow,
            step: {
              ...flow.step,
              title: 'Zahlung',
              hint: plan?.art === 'anfrage'
                ? 'Ohne festen Preis senden Sie zuerst eine Anfrage. Bezahlt wird erst, wenn wir Ihnen den Gesamtpreis genannt haben.'
                : 'Beim vermittelten Termin zahlen Sie den Gesamtbetrag vorab. Erst damit wird der Auftrag verbindlich.',
            },
          }
        : partnerweg && flow.step.id === 'termin'
          ? { ...flow, step: { ...flow.step, title: 'Termin beim Partnerbetrieb', hint: 'Den genauen Termin stimmt der Partnerbetrieb mit Ihnen ab.' } }
          : flow;

  return (
    <FlowShell
      flow={anzeigeFlow}
      title="Autoschlüssel: Anfrage mit Termin"
      submitLabel={partnerweg && plan?.art === 'anfrage' ? 'Anfrage senden' : 'Zahlungspflichtig buchen'}
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint={blockedHint(flow.step.id)}
      vorschlag={
        flow.step.id === 'marke' && !data.makeSlug && vorschlag
          ? { hinweis: `Weiter mit ${vorschlag.ziel.name}`, onWeiter: () => fahrzeugGewaehlt(vorschlag) }
          : null
      }
      raster="seite"
      schutz={schutz}
      abschlussHinweis={
        werkstatt?.standort && (
          <WerkstattZeile standort={werkstatt.standort} telefon={werkstatt.telefon} />
        )
      }
    >
      {submitError && (
        <Alert tone="warning" title="Absenden nicht möglich" className="mb-5">
          {submitError}
        </Alert>
      )}

      {/* 1 – Marke */}
      {flow.step.id === 'marke' && (
        <div className="space-y-4">
          {katalogAdresse && (
            <>
              <FahrzeugSuche katalogAdresse={katalogAdresse} makes={makes} onWahl={fahrzeugGewaehlt} onVorschlag={setVorschlag} mitQuelle={false} nichtGefunden={false} />
              <p className="pt-2 font-mono text-caption uppercase tracking-label text-foreground-muted">Oder Marke wählen</p>
            </>
          )}
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {makes.map((entry) => (
              <OptionCard
                key={entry.id}
                name="marke"
                value={entry.slug}
                checked={data.makeSlug === entry.slug}
                onSelect={selectMake}
                title={entry.name}
                description={<span className="whitespace-nowrap font-mono tabular-nums">{entry.models.length} Modelle</span>}
              />
            ))}
          </div>
          {/* Fester Block am Ende des Fahrzeugschritts (FA-KERN-02B): Fahrzeug nicht gefunden, mit Telefon. */}
          <FahrzeugNichtGefunden href={ANFRAGE_OHNE_MARKE} telefon={werkstatt?.telefon} erreichbarkeit={erreichbarkeit} />
          {/* Quelle des Katalogs am Ende des Schritts statt im Arbeitsfluss (A-025, MA-17) */}
          {katalogAdresse && <p className="text-caption text-foreground-muted">{KATALOG_QUELLE}</p>}
        </div>
      )}

      {/* 2 – Modell */}
      {flow.step.id === 'modell' && make && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {make.models.map((entry) => (
              <OptionCard
                key={entry.id}
                name="modell"
                value={entry.slug}
                checked={data.modelSlug === entry.slug}
                onSelect={selectModel}
                title={entry.name}
                description={`ab ${entry.yearFrom}${entry.yearTo ? ` bis ${entry.yearTo}` : ''}`}
              />
            ))}
            <OptionCard
              name="modell"
              value={OTHER_MODEL}
              checked={isOtherModel}
              onSelect={selectModel}
              title="Mein Modell ist nicht aufgeführt"
              description="Wir ordnen Ihr Fahrzeug anhand Ihrer Angaben und Fotos manuell zu."
            />
          </div>

          {isOtherModel && (
            <Field
              label="Modellbezeichnung"
              required
              hint="Bitte so genau wie möglich, zum Beispiel Baureihe und Ausstattungsvariante."
            >
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={data.modelOther}
                  onChange={(event) => flow.set('modelOther', event.target.value)}
                  autoComplete="off"
                />
              )}
            </Field>
          )}

          {make.intro && (
            <p className="text-small leading-relaxed text-foreground-muted">{make.intro}</p>
          )}
        </div>
      )}

      {/* 3 – Baujahr / Erstzulassung */}
      {flow.step.id === 'baujahr' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {make && (
            <p className="flex flex-wrap items-baseline gap-x-3 text-body text-foreground sm:col-span-2">
              <span>
                Ihr Fahrzeug: <strong className="font-semibold">{make.name} {isOtherModel ? data.modelOther : (model?.name ?? '')}</strong>
              </span>
              <button type="button" onClick={() => flow.goTo('marke')} className="text-small font-semibold text-primary hover:underline">
                Ändern
              </button>
            </p>
          )}
          {/* Generation nur bei Reihen, die welche tragen (A-047); sonst bleibt es beim Baujahr. */}
          {data.generationen.length > 0 && (
            <div className="sm:col-span-2">
              <Field label="Generation (freiwillig)" hint="Grenzt die Jahre auf den Bauzeitraum der Generation ein.">
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    aria-describedby={describedBy}
                    value={data.generation}
                    onChange={(event) => flow.update({ generation: event.target.value, year: '' })}
                  >
                    <option value="">Weiß ich nicht</option>
                    {data.generationen.map((g) => (
                      <option key={g.bezeichnung} value={g.bezeichnung}>
                        {g.bezeichnung}
                        {g.baujahrVon ? ` (${g.baujahrVon} bis ${g.baujahrBis ?? 'heute'})` : ''}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
          )}
          <Field
            label="Jahr"
            required
            info={{
              title: 'Wo Sie das Jahr finden',
              body:
                'Das Datum der Erstzulassung steht in der Zulassungsbescheinigung Teil I unter Feld B. '
                + 'Wenn Sie unsicher sind, nehmen Sie das Baujahr – wir gleichen es mit Ihren Fotos ab.',
            }}
          >
            {({ id, describedBy, invalid }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                className="font-mono tabular-nums"
                value={data.year}
                onChange={(event) => flow.set('year', event.target.value)}
              >
                <option value="">Bitte wählen</option>
                {years.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Monat der Erstzulassung (freiwillig)"
            hint="Hilfreich, wenn die Schlüsseltechnik innerhalb eines Jahres gewechselt hat."
          >
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={data.registrationMonth}
                onChange={(event) => flow.set('registrationMonth', event.target.value)}
              >
                <option value="">Keine Angabe</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {model?.notes && (
            <Alert tone="info" title="Hinweis zu diesem Modell" className="sm:col-span-2">
              {model.notes}
            </Alert>
          )}
        </div>
      )}

      {/* 4 – Freiwillige Fahrzeugdaten */}
      {flow.step.id === 'fahrzeugdaten' && (
        <div className="space-y-5">
          <Field
            label="Motorisierung (freiwillig)"
            hint="Zum Beispiel Leistung in kW oder die Motorkennung aus dem Fahrzeugschein."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={data.engine}
                onChange={(event) => flow.set('engine', event.target.value)}
                autoComplete="off"
              />
            )}
          </Field>

          <Field
            label="Fahrgestellnummer / FIN (freiwillig)"
            info={VIN_INFO}
            hint="17 Zeichen, ohne Leerzeichen. Sie können das Feld auch leer lassen."
            error={
              data.vin.trim() !== '' && !VIN_PATTERN.test(data.vin.trim())
                ? 'Die Fahrgestellnummer besteht aus genau 17 Zeichen (Buchstaben und Ziffern, ohne I, O und Q).'
                : undefined
            }
          >
            {({ id, describedBy, invalid }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                value={data.vin}
                onChange={(event) => flow.set('vin', event.target.value.toUpperCase())}
                maxLength={17}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
              />
            )}
          </Field>

          <Alert tone="legal" title="Zur Fahrgestellnummer">
            <p>
              Die Fahrgestellnummer ist ein personenbezogenes Datum, weil sie sich einem Fahrzeug und
              damit seiner Halterin oder seinem Halter zuordnen lässt. Wir verwenden sie
              ausschließlich zur technischen Zuordnung des Schlüssels innerhalb dieses Vorgangs und
              geben sie nicht zu anderen Zwecken weiter. Die Angabe ist freiwillig – ohne sie können
              wir Ihren Auftrag ebenfalls bearbeiten.
            </p>
          </Alert>
        </div>
      )}

      {/* 5 – Schlüsselart */}
      {flow.step.id === 'schluesselart' && (
        <div className="space-y-4">
          {keyKinds.length === 0 && (
            <Alert tone="warning" title="Für dieses Modell ist noch keine Schlüsselart hinterlegt">
              Bitte gehen Sie einen Schritt zurück und wählen Sie ein anderes Modell, oder schildern
              Sie uns Ihren Fall über die allgemeine Anfrage.
            </Alert>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {keyKinds.map((kind) => (
              <OptionCard
                key={kind}
                name="schluesselart"
                value={kind}
                checked={data.keyKind === kind}
                onSelect={selectKeyKind}
                title={KEY_KIND_OPTIONS[kind].label}
                description={KEY_KIND_OPTIONS[kind].description}
                info={KEY_KIND_OPTIONS[kind].info}
                bildLage="oben"
                bild={<SchluesselartZeichnung art={kind} />}
              />
            ))}
          </div>
          <p className="text-small leading-relaxed text-foreground-subtle">
            Unsicher? Wählen Sie die Art, die am ehesten passt. Anhand Ihrer Fotos prüfen wir das
            und melden uns, falls etwas anderes verbaut ist.
          </p>
        </div>
      )}

      {/* 6 – Vorhandene Schlüssel */}
      {flow.step.id === 'vorhandene-schluessel' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-small font-semibold text-foreground">Funktionierende Schlüssel</p>
            <InfoTip hint={WORKING_KEYS_INFO} />
          </div>
          <div className="grid gap-2">
            {WORKING_KEYS_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                name="vorhandene-schluessel"
                value={String(option.value)}
                checked={data.workingKeys === option.value}
                onSelect={(value) => selectWorkingKeys(Number(value))}
                title={option.label}
                description={option.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* 7 – Leistung */}
      {flow.step.id === 'leistung' && (
        <div className="space-y-4">
          {matchingServices.length === 0 ? (
            <Alert tone="warning" title="Zu dieser Schlüsselart ist keine Leistung hinterlegt">
              Bitte gehen Sie zurück und prüfen Sie die Schlüsselart, oder schildern Sie uns Ihren
              Fall über die allgemeine Anfrage.
            </Alert>
          ) : (
            <div className="grid gap-2">
              {matchingServices.map((entry) => (
                <OptionCard
                  key={entry.id}
                  name="leistung"
                  value={entry.id}
                  checked={data.serviceId === entry.id}
                  onSelect={selectService}
                  title={entry.label}
                  description={entry.description}
                  info={serviceInfo(entry, model)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8 – Schlüsselfotos */}
      {flow.step.id === 'schluesselfotos' && (
        <div className="space-y-7">
          <HilfeBeiUnterlagen telefon={werkstatt?.telefon} erreichbarkeit={erreichbarkeit} />
          {/* Totalverlust nur ausdrücklich bestätigt (FA-KERN-02): Ein defekter Schlüssel zählt als vorhanden. */}
          {data.workingKeys === 0 && (
            <OptionCard
              name="kein-schluessel"
              value="kein-schluessel"
              multiple
              checked={data.keinSchluesselMehr}
              onSelect={() => flow.set('keinSchluesselMehr', !data.keinSchluesselMehr)}
              title="Ich habe keinen Schlüssel mehr"
              description="Auch keinen defekten. Dann entfallen die Schlüsselfotos; der Fahrzeugschein bleibt Pflicht."
            />
          )}
          <Alert tone="info" title="So werden die Fotos brauchbar">
            <ul className="space-y-1">
              <li>Drei Aufnahmen: Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne.</li>
              <li>Beschriftungen und Prägungen müssen lesbar sein.</li>
              <li>Legen Sie den Schlüssel auf einen einfarbigen, hellen Untergrund.</li>
              <li>Fotografieren Sie senkrecht von oben, ohne Blitz und ohne Schatten.</li>
              <li>Der Schlüssel sollte das Bild möglichst ausfüllen und scharf sein.</li>
            </ul>
          </Alert>

          {KEY_PHOTO_SLOTS.map((slot) => (
            <PhotoUpload
              category="schluesselfoto"
              steckplatz={slot.steckplatz}
              key={slot.id}
              id={`schluessel-${slot.id}`}
              label={fotosFreiwillig && slot.required ? `${slot.label} (freiwillig)` : slot.label}
              description={slot.description}
              example={slot.example}
              required={slot.required && !fotosFreiwillig}
              multiple={slot.id === 'detail'}
              maxFiles={slot.id === 'detail' ? 3 : 1}
              files={files[slot.id]}
              onChange={(next) => setSlotFiles(slot.id, next)}
            />
          ))}

          <Alert tone="legal" title="Was mit den Fotos geschieht">
            <p>
              Die Schlüsselfotos verwenden wir ausschließlich, um Bauform, Profil und Elektronik zu
              bestimmen und Ihren Auftrag auszuführen. Wir bewahren sie höchstens{' '}
              {retentionDays.keyPhotos} Tage nach dem Hochladen auf und löschen sie
              anschließend.
            </p>
          </Alert>
        </div>
      )}

      {/* 9 – Fahrzeugschein */}
      {flow.step.id === 'fahrzeugschein' && (
        <div className="space-y-6">
          <HilfeBeiUnterlagen telefon={werkstatt?.telefon} erreichbarkeit={erreichbarkeit} />
          <PhotoUpload
            category="fahrzeugschein"
            steckplatz="fahrzeugschein"
            id="fahrzeugschein"
            label="Zulassungsbescheinigung Teil I (Fahrzeugschein)"
            description="Als Foto oder als PDF. Bitte vollständig und lesbar, alle vier Ecken im Bild."
            example={REGISTRATION_EXAMPLE}
            required
            allowDocuments
            files={files.fahrzeugschein}
            onChange={(next) => setSlotFiles('fahrzeugschein', next)}
          />

          <Alert tone="legal" title="Zweck und Aufbewahrung">
            <p>
              Wir fertigen Fahrzeugschlüssel ausschließlich für Berechtigte. Die
              Zulassungsbescheinigung dient allein diesem Nachweis und der Zuordnung Ihres
              Fahrzeugs. Wir bewahren sie höchstens {retentionDays.vehicleRegistration} Tage nach
              dem Hochladen auf und löschen sie danach. Eine Weitergabe zu anderen Zwecken
              findet nicht statt.
            </p>
            <p className="mt-2">
              Angaben, die für diesen Zweck nicht nötig sind, dürfen Sie vor dem Hochladen
              unkenntlich machen.
            </p>
          </Alert>

          <OptionCard
            name="berechtigung"
            value="bestaetigt"
            multiple
            checked={data.entitlementConfirmed}
            onSelect={() => flow.set('entitlementConfirmed', !data.entitlementConfirmed)}
            title="Ich bin berechtigt, für dieses Fahrzeug einen Schlüssel anfertigen zu lassen."
            description="Halterin, Halter oder von ihnen beauftragt. Den Nachweis können wir beim Termin erneut sehen wollen."
          />
        </div>
      )}

      {/* 10 – Kontaktdaten */}
      {flow.step.id === 'kontakt' && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Anrede (freiwillig)">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={data.salutation}
                  onChange={(event) => flow.set('salutation', event.target.value)}
                >
                  <option value="">Keine Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>

            <Field label="Firma (freiwillig)">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={data.company}
                  onChange={(event) => flow.set('company', event.target.value)}
                  autoComplete="organization"
                />
              )}
            </Field>

            <Field label="Vorname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={data.firstName}
                  onChange={(event) => flow.set('firstName', event.target.value)}
                  autoComplete="given-name"
                />
              )}
            </Field>

            <Field label="Nachname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={data.lastName}
                  onChange={(event) => flow.set('lastName', event.target.value)}
                  autoComplete="family-name"
                />
              )}
            </Field>

            <Field
              label="E-Mail-Adresse"
              required
              hint="An diese Adresse geht die Bestätigung mit Ihrer Vorgangsnummer."
              error={
                data.email.trim() !== '' && !EMAIL_PATTERN.test(data.email.trim())
                  ? 'Bitte prüfen Sie die E-Mail-Adresse.'
                  : undefined
              }
            >
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="email"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={data.email}
                  onChange={(event) => flow.set('email', event.target.value)}
                  autoComplete="email"
                  inputMode="email"
                />
              )}
            </Field>

            <Field label="Telefonnummer" required hint="Für Rückfragen zu Ihrem Fahrzeug oder zum Termin.">
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="tel"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={data.phone}
                  onChange={(event) => flow.set('phone', event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                />
              )}
            </Field>

            <Field label="Straße und Hausnummer (freiwillig)" className="sm:col-span-2">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={data.street}
                  onChange={(event) => flow.set('street', event.target.value)}
                  autoComplete="street-address"
                />
              )}
            </Field>

            <div className="grid grid-cols-3 gap-4 sm:col-span-2">
              <Field
                label="Postleitzahl"
                required
                error={
                  data.postalCode.trim() !== '' && !POSTAL_PATTERN.test(data.postalCode.trim())
                    ? 'Bitte geben Sie eine gültige Postleitzahl ein.'
                    : undefined
                }
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    value={data.postalCode}
                    onChange={(event) => flow.set('postalCode', event.target.value)}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={5}
                  />
                )}
              </Field>

              <Field label="Ort" required className="col-span-2">
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    value={data.city}
                    onChange={(event) => flow.set('city', event.target.value)}
                    autoComplete="address-level2"
                  />
                )}
              </Field>
            </div>

            {/* Erg. Leitfaden §1: Schwerpunkt Wetzlar – Kunden von außerhalb reisen an. */}
            {/* Bietet der Server einen Partnerbetrieb an (FA-KERN-03), stimmt „Termine nur in der Werkstatt“ nicht. */}
            {ausserhalbDerRegion(data.postalCode, data.country, eigenbereich) && !standorte?.standorte.some((s) => s.standort === 'partner') && (
              <Alert tone="info" title="Termin in unserer Werkstatt" className="sm:col-span-2">
                {ausserhalbHinweis(werkstatt?.standort?.city)}
              </Alert>
            )}

            <Field
              label="Land"
              required
              info={{
                title: 'Wozu wir die Anschrift brauchen',
                body:
                  'Termine finden in unserer Werkstatt statt. Ein Einsatz bei Ihnen ist nur nach '
                  + 'individueller Prüfung möglich – dafür brauchen wir mindestens Postleitzahl und Ort.',
              }}
            >
              {({ id, describedBy, invalid }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  value={data.country}
                  onChange={(event) => flow.set('country', event.target.value)}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          <Field
            label="Kurze Beschreibung Ihres Anliegens"
            required
            hint={`Ein Satz genügt, zum Beispiel: Zweitschlüssel gewünscht, der Funkschlüssel klemmt. Mindestens ${BESCHREIBUNG_MIN} Zeichen.`}
          >
            {({ id, describedBy, invalid }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
                value={data.note}
                onChange={(event) => flow.set('note', event.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {/* 11 – Preis */}
      {flow.step.id === 'preis' && (
        <div className="space-y-5">
          {quoteLoading && (
            <p className="flex items-center gap-2 text-body text-foreground-muted" role="status">
              <GlyphLaden size={17} className="animate-spin ruhig:animate-none" />
              Ihr Preis wird ermittelt …
            </p>
          )}

          {!quoteLoading && quoteError && (
            <Alert tone="warning" title="Preis konnte nicht ermittelt werden">
              {quoteError}
            </Alert>
          )}

          {!quoteLoading && !quoteError && quote && (
            <>
              <Card variant="outline" className="rounded-none border-x-0">
                <CardBody className="px-0 md:px-0">
                  <p className="text-small leading-relaxed text-foreground">
                    <span className="mb-1 block font-mono text-caption uppercase tracking-label text-foreground-muted">Grundlage</span>
                    {make?.name} {modelName}, Baujahr <span className="font-mono tabular-nums">{data.year}</span>,{' '}
                    {data.keyKind ? KEY_KIND_OPTIONS[data.keyKind as KeyKind].label : ''},{' '}
                    {service?.label}.
                  </p>
                </CardBody>
              </Card>

              {/* Terminstandort (FA-KERN-03): Werkstatt immer; ein Partnerbetrieb nur, wenn der Server ihn anbietet. */}
              <div className="space-y-3">
                <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Terminstandort</p>
                {standorte && standorte.standorte.length > 1 ? (
                  <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Terminstandort">
                    {standorte.standorte.map((angebot) => (
                      <OptionCard
                        key={angebot.standort}
                        name="terminstandort"
                        value={angebot.standort}
                        checked={(partnerweg ? 'partner' : 'werkstatt') === angebot.standort}
                        // Anderer Standort, anderer Betrag: Die Zustimmung zur Zahlung muss neu gegeben werden.
                        onSelect={() => flow.update({ terminstandort: angebot.standort, depositAccepted: false })}
                        title={standortText(angebot.standort, werkstattStadt, direktOrt)}
                        description={
                          angebot.standort === 'partner'
                            ? 'Zahlung des Gesamtbetrags vorab, der Partnerbetrieb stimmt den Termin mit Ihnen ab.'
                            : 'Anzahlung jetzt, Rest beim Termin.'
                        }
                      />
                    ))}
                  </div>
                ) : null}
                <p className="text-body font-semibold text-foreground">{terminortZeile(weg, werkstattStadt, direktOrt)}</p>
                {standorte?.ohnePartner && (
                  <Alert tone="info" title="Noch kein Partnerbetrieb in Ihrer Region">
                    {KEIN_PARTNER_HINWEIS}{' '}
                    <Link href={ANFRAGE_OHNE_MARKE} className="font-semibold text-primary hover:underline">
                      Zur Anfrage
                    </Link>
                  </Alert>
                )}
                <dl className="divide-y divide-border border-y border-border">
                  {faelligZeilen(weg, quote).map((zeile) => (
                    <div key={zeile.label} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                      <dt className="text-small text-foreground-muted">{zeile.label}</dt>
                      <dd className="font-mono text-title-sm font-semibold tabular-nums text-foreground">{zeile.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <PreisAnzeige quote={quote} beimKunden={terminBeimKunden(data.serviceId)} weg={weg} />

              <div role="note" className="flex items-start gap-2 text-small leading-relaxed text-foreground-muted">
                <GlyphWaage size={16} className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">Prüfung vor der Ausführung</p>
                  <p className="mt-1">
                    Bevor wir arbeiten, sehen wir uns Ihre Fotos und die Zulassungsbescheinigung an.
                    Ergibt sich daraus ein anderer Fall als hier angenommen, melden wir uns mit dem
                    angepassten Preis. Sie entscheiden dann, ob der Termin bestehen bleibt.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Preis wird für Anzahlung und Termin gebraucht */}
      {(flow.step.id === 'anzahlung' || flow.step.id === 'termin') && !quote && (
        <div className="space-y-4">
          {quoteError ? (
            <Alert tone="warning" title="Preis konnte nicht ermittelt werden">
              <p>{quoteError}</p>
              <p className="mt-2">
                Bitte gehen Sie einen Schritt zurück und prüfen Sie Ihre Angaben.
              </p>
            </Alert>
          ) : (
            <p className="flex items-center gap-2 text-body text-foreground-muted" role="status">
              <GlyphLaden size={17} className="animate-spin ruhig:animate-none" />
              Ihre Angaben werden geprüft …
            </p>
          )}
        </div>
      )}

      {/* 12 – Zahlung im Partnerweg (FA-KERN-03): Gesamtbetrag vorab oder Anfrage ohne Zahlung */}
      {flow.step.id === 'anzahlung' && quote && partnerweg && (
        <div className="space-y-5">
          <p className="text-body font-semibold text-foreground">{terminortZeile('partner')}</p>
          <dl className="divide-y divide-border border-y border-border">
            {faelligZeilen('partner', quote).map((zeile) => (
              <div key={zeile.label} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
                <dt className="text-small text-foreground-muted">{zeile.label}</dt>
                <dd className="font-mono text-title-sm font-semibold tabular-nums text-foreground">{zeile.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-small leading-relaxed text-foreground-muted">
            {plan?.art === 'anfrage' ? PARTNER_OHNE_FESTPREIS : PARTNER_NACH_ZAHLUNG}
          </p>

          {!paymentConfigured && plan?.art === 'gesamt' && (
            <Alert tone="warning" title="Online-Zahlung ist noch nicht eingerichtet">
              <p>
                Ihr Vorgang wird mit dem Zahlungsstatus „offen“ angelegt. Wir melden uns mit den
                Zahlungsinformationen. Bitte bewahren Sie Ihre Vorgangsnummer auf.
              </p>
            </Alert>
          )}

          <OptionCard
            name="anzahlung"
            value="bestaetigt"
            multiple
            checked={data.depositAccepted}
            onSelect={() => flow.set('depositAccepted', !data.depositAccepted)}
            title={
              plan?.art === 'gesamt'
                ? `Ich habe verstanden, dass der Gesamtbetrag von ${formatCents(plan.jetztCents)} vorab fällig ist.`
                : 'Ich habe verstanden, dass mein Auftrag erst mit der Zahlung des Gesamtpreises verbindlich wird.'
            }
            description="Eine Anzahlung allein reicht beim vermittelten Termin nicht aus."
          />

          <p className="text-small leading-relaxed text-foreground-muted">
            Bitte lesen Sie vor der Buchung unsere{' '}
            <Link href="/rechtliches/agb" target="_blank" className="font-semibold text-primary hover:underline">
              AGB
            </Link>{' '}
            und die{' '}
            <Link href="/rechtliches/widerruf" target="_blank" className="font-semibold text-primary hover:underline">
              Widerrufsbelehrung
            </Link>
            . Beide öffnen sich in einem neuen Fenster; Ihre Angaben bleiben hier erhalten.
          </p>

          <OptionCard
            name="agb"
            value="bestaetigt"
            multiple
            checked={data.termsAccepted}
            onSelect={() => flow.set('termsAccepted', !data.termsAccepted)}
            title="Ich habe die AGB gelesen und die Widerrufsbelehrung zur Kenntnis genommen."
          />

          <OptionCard
            name="vorzeitiger-beginn"
            value="verlangt"
            multiple
            checked={data.earlyStartRequested}
            onSelect={() => flow.set('earlyStartRequested', !data.earlyStartRequested)}
            title="Ich verlange ausdrücklich, dass Sie vor Ablauf der Widerrufsfrist mit der Leistung beginnen (z. B. Rohling bestellen)."
            description="Mir ist bekannt, dass ich bei vollständiger Vertragserfüllung mein Widerrufsrecht verliere und bei Widerruf Wertersatz leiste."
          />
        </div>
      )}

      {/* 12 – Anzahlung */}
      {flow.step.id === 'anzahlung' && quote && !partnerweg && (
        <div className="space-y-5">
          <p className="text-body font-semibold text-foreground">{terminortZeile(weg, werkstattStadt, direktOrt)}</p>
          <dl className="border-y border-border py-5">
            <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Jetzt fällig
            </dt>
            <dd className="mt-1 font-mono text-title font-semibold tabular-nums text-foreground">
              {formatCents(quote.depositCents)}
            </dd>
          </dl>

          <div className="space-y-2">
            <p className="text-small leading-relaxed text-foreground-muted">
              Die Anzahlung wird <strong className="font-semibold text-foreground">vollständig
              auf den Gesamtpreis angerechnet</strong>. Sie ist kein Zuschlag und keine
              Bearbeitungsgebühr.
            </p>
            {quote.mode === 'fest' && quote.remainderCents !== undefined && (
              <p className="text-small leading-relaxed text-foreground-muted">
                Beim Termin verbleiben damit <span className="font-mono tabular-nums">{formatCents(quote.remainderCents)}</span>.
              </p>
            )}
            {quote.mode !== 'fest' && (
              <p className="text-small leading-relaxed text-foreground-muted">
                Den Restbetrag nennen wir Ihnen, sobald der Gesamtpreis feststeht.
              </p>
            )}
          </div>

          <div role="note" className="flex items-start gap-2 text-small leading-relaxed text-foreground-muted">
            <GlyphInfo size={16} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground">Wofür die Anzahlung steht</p>
              <p className="mt-1">
                Mit der Anzahlung reservieren wir Ihnen ein festes Zeitfenster und beginnen mit der
                Beschaffung des passenden Rohlings beziehungsweise Gehäuses. Dadurch entsteht uns
                Aufwand, bevor Sie in der Werkstatt sind.
              </p>
            </div>
          </div>

          {!paymentConfigured && (
            <Alert tone="warning" title="Online-Zahlung ist noch nicht eingerichtet">
              <p>
                Ihr Vorgang wird mit dem Zahlungsstatus „offen“ angelegt. Wir melden uns mit den
                Zahlungsinformationen. Bitte bewahren Sie Ihre Vorgangsnummer auf.
              </p>
            </Alert>
          )}

          <OptionCard
            name="anzahlung"
            value="bestaetigt"
            multiple
            checked={data.depositAccepted}
            onSelect={() => flow.set('depositAccepted', !data.depositAccepted)}
            title={`Ich habe verstanden, dass eine Anzahlung von ${formatCents(quote.depositCents)} anfällt.`}
            description="Sie wird vollständig auf den Gesamtpreis angerechnet."
          />

          <p className="text-small leading-relaxed text-foreground-muted">
            Bitte lesen Sie vor der Buchung unsere{' '}
            <Link href="/rechtliches/agb" target="_blank" className="font-semibold text-primary hover:underline">
              AGB
            </Link>{' '}
            und die{' '}
            <Link href="/rechtliches/widerruf" target="_blank" className="font-semibold text-primary hover:underline">
              Widerrufsbelehrung
            </Link>
            . Beide öffnen sich in einem neuen Fenster; Ihre Angaben bleiben hier erhalten.
          </p>

          <OptionCard
            name="agb"
            value="bestaetigt"
            multiple
            checked={data.termsAccepted}
            onSelect={() => flow.set('termsAccepted', !data.termsAccepted)}
            title="Ich habe die AGB gelesen und die Widerrufsbelehrung zur Kenntnis genommen."
          />

          <OptionCard
            name="vorzeitiger-beginn"
            value="verlangt"
            multiple
            checked={data.earlyStartRequested}
            onSelect={() => flow.set('earlyStartRequested', !data.earlyStartRequested)}
            title="Ich verlange ausdrücklich, dass Sie vor Ablauf der Widerrufsfrist mit der Leistung beginnen (z. B. Rohling bestellen)."
            description="Mir ist bekannt, dass ich bei vollständiger Vertragserfüllung mein Widerrufsrecht verliere und bei Widerruf Wertersatz leiste."
          />

          <p className="flex items-start gap-2 text-small leading-relaxed text-foreground-subtle">
            <GlyphPruefsiegel size={15} className="mt-0.5 shrink-0" />
            Im nächsten Schritt wählen Sie Ihren Termin. Erst danach senden Sie die Anfrage ab.
          </p>
        </div>
      )}

      {/* 13 – Termin im Partnerweg: kein Zeitfenster der Werkstatt (FA-KERN-03) */}
      {flow.step.id === 'termin' && quote && partnerweg && (
        <div className="space-y-4">
          <p className="text-body font-semibold text-foreground">{terminortZeile('partner')}</p>
          <p className="text-small leading-relaxed text-foreground-muted">
            {plan?.art === 'anfrage' ? PARTNER_OHNE_FESTPREIS : PARTNER_NACH_ZAHLUNG}
          </p>
        </div>
      )}

      {/* 13 – Termin */}
      {flow.step.id === 'termin' && quote && !partnerweg && (
        <TerminAuswahl
          days={slots?.days ?? []}
          loading={slotsLoading}
          error={slotsError}
          leadTimeDays={slots?.leadTimeDays ?? quote.leadTimeDays}
          slotMinutes={quote.slotMinutes}
          requiresVehicleOnSite={quote.requiresVehicleOnSite}
          beimKunden={terminBeimKunden(data.serviceId)}
          eigenbereichName={eigenbereich?.label}
          werkstatt={werkstatt?.standort}
          staleSelection={staleSlotSelection}
          selectedDate={data.slotDate}
          selectedTime={data.slotTime}
          onSelect={(date, time) => flow.update({ slotDate: date, slotTime: time })}
        />
      )}
    </FlowShell>
  );
}

function isContactComplete(data: AssistentData): boolean {
  return (
    data.firstName.trim().length >= 2 &&
    data.lastName.trim().length >= 2 &&
    EMAIL_PATTERN.test(data.email.trim()) &&
    data.phone.trim().length >= 6 &&
    POSTAL_PATTERN.test(data.postalCode.trim()) &&
    data.city.trim().length >= 2 &&
    data.country.trim().length > 0 &&
    beschreibungGueltig(data.note)
  );
}
