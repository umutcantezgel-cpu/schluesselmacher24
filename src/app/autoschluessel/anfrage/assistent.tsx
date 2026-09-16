'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

import type {
  AppointmentInfo,
  CarKeyService,
  KeyKind,
  PriceQuote,
  SummarySection,
  UploadRef,
  VehicleMake,
} from '@/lib/types';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { fetchQuote, fetchSlots, type SlotsResponse } from '@/lib/actions/booking';
import { submitRecord } from '@/lib/actions/records';
import { formatCents, formatDuration } from '@/lib/format';
import { Alert } from '@/components/ui/alert';
import { Card, CardBody } from '@/components/ui/card';
import { InfoTip } from '@/components/ui/info-tip';
import { FlowShell } from '@/components/flow/flow-shell';
import { Field } from '@/components/forms/field';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, type PickedFile } from '@/components/forms/photo-upload';
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
import { PreisAnzeige } from '@/components/autoschluessel/preis-anzeige';
import { TerminAuswahl } from '@/components/autoschluessel/termin-auswahl';
import { Bestaetigung } from '@/components/autoschluessel/bestaetigung';

/* ==========================================================================
   Autoschlüssel — geführter Ablauf in 13 Schritten
   Prozessart: Termin mit Anzahlung.
   Alle Fahrzeug-, Leistungs-, Preis- und Termindaten kommen aus der
   Datenschicht; in dieser Datei steht kein fachlicher Wert fest.
   ========================================================================== */

const FLOW_ID = 'autoschluessel-anfrage';
/** Erhöhen, sobald sich AssistentData ändert — alte Zwischenstände verfallen. */
const FLOW_VERSION = 1;

/** Kennung für „Modell nicht in der Liste“. */
const OTHER_MODEL = '__nicht-aufgefuehrt';

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_PATTERN = /^\d{4,5}$/;

const COUNTRIES = ['Deutschland', 'Österreich', 'Schweiz'];

const STEPS: FlowStep[] = [
  {
    id: 'marke',
    short: 'Marke',
    title: 'Welche Marke hat Ihr Fahrzeug?',
    hint: 'Wir brauchen die Marke, um die passenden Modelle und Schlüsselarten anzuzeigen.',
  },
  {
    id: 'modell',
    short: 'Modell',
    title: 'Welches Modell fahren Sie?',
    hint: 'Das Modell entscheidet darüber, welche Schlüsselarten technisch infrage kommen.',
  },
  {
    id: 'baujahr',
    short: 'Baujahr',
    title: 'Baujahr beziehungsweise Erstzulassung',
    hint: 'Innerhalb einer Baureihe ändert sich die Schlüsseltechnik oft mit dem Modelljahr.',
  },
  {
    id: 'fahrzeugdaten',
    short: 'Fahrzeugdaten',
    title: 'Weitere Fahrzeugdaten (freiwillig)',
    hint: 'Diese Angaben sind freiwillig. Sie helfen uns, den richtigen Schlüssel eindeutig zuzuordnen.',
  },
  {
    id: 'schluesselart',
    short: 'Schlüsselart',
    title: 'Welche Schlüsselart haben Sie?',
    hint: 'Angezeigt werden nur die Arten, die für Ihr Modell hinterlegt sind.',
  },
  {
    id: 'vorhandene-schluessel',
    short: 'Vorhandene',
    title: 'Wie viele funktionierende Schlüssel haben Sie noch?',
    hint: 'Davon hängt ab, wie aufwendig die Arbeit wird und wie belastbar wir den Preis nennen können.',
  },
  {
    id: 'leistung',
    short: 'Leistung',
    title: 'Was sollen wir für Sie tun?',
    hint: 'Angezeigt werden nur Leistungen, die zu Ihrer Schlüsselart passen.',
  },
  {
    id: 'schluesselfotos',
    short: 'Schlüsselfotos',
    title: 'Fotos Ihres Schlüssels',
    hint: 'Anhand der Fotos erkennen wir Bauform, Profil und Elektronik. Drei Aufnahmen brauchen wir auf jeden Fall.',
  },
  {
    id: 'fahrzeugschein',
    short: 'Fahrzeugschein',
    title: 'Zulassungsbescheinigung Teil I',
    hint: 'Wir fertigen Fahrzeugschlüssel nur für Berechtigte. Dafür brauchen wir einen Nachweis.',
  },
  {
    id: 'kontakt',
    short: 'Kontakt',
    title: 'Wie erreichen wir Sie?',
    hint: 'Über diese Angaben bestätigen wir den Termin und melden uns bei Rückfragen.',
  },
  {
    id: 'preis',
    short: 'Preis',
    title: 'Preis für Ihren Fall',
    hint: 'Aus Fahrzeug, Schlüsselart und Leistung ermitteln wir, was für Sie gilt.',
  },
  {
    id: 'anzahlung',
    short: 'Anzahlung',
    title: 'Anzahlung',
    hint: 'Die Anzahlung reserviert Ihren Platz im Terminplan und wird vollständig angerechnet.',
  },
  {
    id: 'termin',
    short: 'Termin',
    title: 'Termin auswählen',
    hint: 'Wählen Sie ein freies Zeitfenster. Danach senden Sie Ihre Anfrage ab.',
  },
];

type UploadSlotId = 'vorderseite' | 'rueckseite' | 'bart' | 'detail' | 'fahrzeugschein';

interface AssistentData {
  makeSlug: string;
  modelSlug: string;
  /** Freitext, wenn das Modell nicht aufgeführt ist. */
  modelOther: string;
  year: string;
  /** Monat der Erstzulassung, freiwillig ("1" bis "12"). */
  registrationMonth: string;
  engine: string;
  vin: string;
  keyKind: KeyKind | '';
  workingKeys: number | null;
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
  slotDate: string;
  slotTime: string;
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
  services: CarKeyService[];
  /** Ist ein Zahlungsdienstleister angebunden? */
  paymentConfigured: boolean;
  /** Aufbewahrungsfristen in Tagen. */
  retentionDays: { vehicleRegistration: number; keyPhotos: number };
  /** Aktuelles Jahr — auf dem Server ermittelt, damit Server und Browser übereinstimmen. */
  currentYear: number;
  /** Vorbelegung aus ?marke= und ?modell=. */
  preselect: { makeSlug: string; modelSlug: string };
}

export function Assistent({
  makes,
  services,
  paymentConfigured,
  retentionDays,
  currentYear,
  preselect,
}: AssistentProps) {
  const initial = useMemo<AssistentData>(
    () => ({
      makeSlug: preselect.makeSlug,
      modelSlug: preselect.modelSlug,
      modelOther: '',
      year: '',
      registrationMonth: '',
      engine: '',
      vin: '',
      keyKind: '',
      workingKeys: null,
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
      slotDate: '',
      slotTime: '',
    }),
    [preselect.makeSlug, preselect.modelSlug],
  );

  /* Dateien bleiben bewusst außerhalb des Zwischenspeichers — sie lassen
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
     mehr — das alte Ergebnis gilt damit automatisch als überholt. */
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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    reference: string;
    appointment: AppointmentInfo;
    quote: PriceQuote;
    summary: SummarySection[];
    notices: string[];
    redirectUrl?: string;
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
        ? services.filter((s) => s.active && s.keyKinds.includes(data.keyKind as KeyKind))
        : [],
    [services, data.keyKind],
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
    const list: number[] = [];
    for (let year = to; year >= from; year -= 1) list.push(year);
    return list;
  }, [make, model, currentYear]);

  const months = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('de-DE', { month: 'long' });
    return Array.from({ length: 12 }, (_, index) => ({
      value: String(index + 1),
      label: formatter.format(new Date(Date.UTC(2000, index, 1))),
    }));
  }, []);

  const modelName = isOtherModel ? data.modelOther.trim() : model?.name ?? '';

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
        return (
          files.vorderseite.length > 0 && files.rueckseite.length > 0 && files.bart.length > 0
        );
      case 'fahrzeugschein':
        return files.fahrzeugschein.length > 0 && current.entitlementConfirmed;
      case 'kontakt':
        return isContactComplete(current);
      case 'preis':
        return quoteFor(current) !== null;
      case 'anzahlung':
        return quoteFor(current) !== null && current.depositAccepted;
      case 'termin':
        return isSelectedSlotFree(current);
      default:
        return true;
    }
  }

  function blockedHint(stepId: string): string {
    switch (stepId) {
      case 'marke':
        return 'Bitte wählen Sie zuerst eine Marke aus.';
      case 'modell':
        return isOtherModel
          ? 'Bitte tragen Sie die Modellbezeichnung ein.'
          : 'Bitte wählen Sie ein Modell aus.';
      case 'baujahr':
        return 'Bitte wählen Sie das Baujahr beziehungsweise das Jahr der Erstzulassung.';
      case 'fahrzeugdaten':
        return 'Die Fahrgestellnummer besteht aus genau 17 Zeichen. Bitte prüfen Sie die Eingabe oder lassen Sie das Feld leer.';
      case 'schluesselart':
        return 'Bitte wählen Sie die Schlüsselart aus.';
      case 'vorhandene-schluessel':
        return 'Bitte geben Sie an, wie viele Schlüssel noch funktionieren.';
      case 'leistung':
        return 'Bitte wählen Sie die gewünschte Leistung aus.';
      case 'schluesselfotos':
        return 'Bitte laden Sie Vorderseite, Rückseite und Bart Ihres Schlüssels hoch.';
      case 'fahrzeugschein':
        return 'Bitte laden Sie die Zulassungsbescheinigung hoch und bestätigen Sie Ihre Berechtigung.';
      case 'kontakt':
        return 'Bitte füllen Sie Name, E-Mail-Adresse, Telefonnummer, Postleitzahl und Ort aus.';
      case 'preis':
        return 'Der Preis wird noch ermittelt.';
      case 'anzahlung':
        return 'Bitte bestätigen Sie die Anzahlung, um fortzufahren.';
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
      year: '',
      keyKind: '',
      serviceId: '',
      slotDate: '',
      slotTime: '',
      depositAccepted: false,
    });
  }

  function selectModel(slug: string) {
    flow.update({
      modelSlug: slug,
      modelOther: '',
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
    flow.update({ workingKeys: value, slotDate: '', slotTime: '', depositAccepted: false });
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
    // Die Eingaben stecken vollständig im Schlüssel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsQuote, hasQuoteInputs, quoteKey]);

  /* ---------- Termine laden --------------------------------------------- */

  const isSlotStep = flow.step.id === 'termin';
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
        if (!cancelled) setSlotsResult({ key: slotsKey, days: response, error: null });
      })
      .catch(() => {
        if (!cancelled) setSlotsResult({ key: slotsKey, days: null, error: failure });
      });

    return () => {
      cancelled = true;
    };
    // slotsKey fasst Terminlänge und Vorlauf zusammen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSlotStep, slotsKey]);

  /* ---------- Zusammenfassung und Absenden ------------------------------ */

  function buildUploads(): Array<Omit<UploadRef, 'id' | 'uploadedAt' | 'storageKey'>> {
    const result: Array<Omit<UploadRef, 'id' | 'uploadedAt' | 'storageKey'>> = [];
    for (const slot of KEY_PHOTO_SLOTS) {
      for (const file of files[slot.id]) {
        result.push({
          fileName: file.name,
          sizeBytes: file.sizeBytes,
          mimeType: file.mimeType,
          category: 'schluesselfoto',
        });
      }
    }
    for (const file of files.fahrzeugschein) {
      result.push({
        fileName: file.name,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        category: 'fahrzeugschein',
      });
    }
    return result;
  }

  function priceValue(current: PriceQuote): string {
    if (current.mode === 'fest' && current.priceCents !== undefined) {
      return formatCents(current.priceCents);
    }
    if (current.mode === 'rahmen') {
      if (current.priceFromCents !== undefined && current.priceToCents !== undefined) {
        return `${formatCents(current.priceFromCents)} — ${formatCents(current.priceToCents)}`;
      }
      if (current.priceFromCents !== undefined) return `ab ${formatCents(current.priceFromCents)}`;
      return 'Preisrahmen wird nach Prüfung genannt';
    }
    return 'Wird vor der verbindlichen Buchung geprüft';
  }

  function buildSummary(current: PriceQuote): SummarySection[] {
    const vehicleRows = [
      { label: 'Marke', value: make?.name ?? '—' },
      {
        label: 'Modell',
        value: isOtherModel ? `${modelName} (nicht in der Liste aufgeführt)` : modelName || '—',
      },
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

    const keyKindLabel = data.keyKind ? KEY_KIND_OPTIONS[data.keyKind as KeyKind].label : '—';
    const workingKeysLabel =
      WORKING_KEYS_OPTIONS.find((option) => option.value === data.workingKeys)?.label ?? '—';

    const sections: SummarySection[] = [
      { title: 'Fahrzeug', rows: vehicleRows },
      {
        title: 'Schlüssel und Leistung',
        rows: [
          { label: 'Schlüsselart', value: keyKindLabel },
          { label: 'Funktionierende Schlüssel', value: workingKeysLabel },
          { label: 'Gewünschte Leistung', value: service?.label ?? '—' },
          {
            label: 'Fahrzeug beim Termin',
            value: current.requiresVehicleOnSite ? 'wird benötigt' : 'nicht zwingend nötig',
          },
        ],
      },
      {
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
      {
        title: 'Termin',
        rows: [
          { label: 'Datum', value: data.slotDate },
          { label: 'Uhrzeit', value: `${data.slotTime} Uhr` },
          { label: 'Eingeplante Dauer', value: formatDuration(current.slotMinutes) },
          {
            label: 'Art des Termins',
            value: current.requiresVehicleOnSite ? 'Vor-Ort-Termin mit Fahrzeug' : 'Termin im Fachbetrieb',
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
          ...(data.note.trim() ? [{ label: 'Ihre Nachricht', value: data.note.trim() }] : []),
        ],
      },
      {
        title: 'Unterlagen',
        rows: [
          {
            label: 'Schlüsselfotos',
            value: `${KEY_PHOTO_SLOTS.reduce((sum, slot) => sum + files[slot.id].length, 0)} Datei(en)`,
          },
          { label: 'Zulassungsbescheinigung', value: `${files.fahrzeugschein.length} Datei(en)` },
        ],
      },
    ];

    return sections;
  }

  /** Erster Schritt, der noch nicht vollständig ist — sonst null. */
  function firstIncompleteStep(): FlowStep | null {
    return STEPS.find((step) => !isStepComplete(data, step.id)) ?? null;
  }

  async function handleSubmit() {
    if (!quote || !data.slotDate || !data.slotTime) return;

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

    const appointment: AppointmentInfo = {
      date: data.slotDate,
      time: data.slotTime,
      durationMinutes: quote.slotMinutes,
      location: quote.requiresVehicleOnSite ? 'vor-ort' : 'werkstatt',
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
          makeSlug: data.makeSlug,
          makeName: make?.name,
          modelSlug: isOtherModel ? null : model?.slug,
          modelName,
          modelNotListed: isOtherModel,
          year: data.year,
          registrationMonth: data.registrationMonth || null,
          engine: data.engine.trim() || null,
          vin: data.vin.trim().toUpperCase() || null,
          keyKind: data.keyKind,
          workingKeys: data.workingKeys,
          serviceId: data.serviceId,
          serviceLabel: service?.label,
          note: data.note.trim() || null,
          entitlementConfirmed: data.entitlementConfirmed,
          depositAccepted: data.depositAccepted,
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
        payment: {
          scope: 'anzahlung',
          amountCents: quote.depositCents,
          description: `Anzahlung für ${service?.label ?? 'Autoschlüssel-Leistung'}`,
        },
      });

      if (result.ok && result.reference) {
        setDone({
          reference: result.reference,
          appointment,
          quote,
          summary,
          notices: result.notices,
          redirectUrl: result.redirectUrl,
        });
        clearFlow(FLOW_ID);
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
        quote={done.quote}
        summary={done.summary}
        notices={done.notices}
        redirectUrl={done.redirectUrl}
      />
    );
  }

  /* ---------- Darstellung der einzelnen Schritte ------------------------ */

  return (
    <FlowShell
      flow={flow}
      title="Autoschlüssel: Anfrage mit Termin"
      submitLabel="Zahlungspflichtig buchen"
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint={blockedHint(flow.step.id)}
    >
      {submitError && (
        <Alert tone="warning" title="Absenden nicht möglich" className="mb-5">
          {submitError}
        </Alert>
      )}

      {/* 1 — Marke */}
      {flow.step.id === 'marke' && (
        <div className="grid gap-2 sm:grid-cols-2">
          {makes.map((entry) => (
            <OptionCard
              key={entry.id}
              name="marke"
              value={entry.slug}
              checked={data.makeSlug === entry.slug}
              onSelect={selectMake}
              title={entry.name}
              description={`${entry.models.length} Modelle hinterlegt`}
            />
          ))}
        </div>
      )}

      {/* 2 — Modell */}
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
            <p className="text-[14px] leading-relaxed text-foreground-muted">{make.intro}</p>
          )}
        </div>
      )}

      {/* 3 — Baujahr / Erstzulassung */}
      {flow.step.id === 'baujahr' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Baujahr beziehungsweise Jahr der Erstzulassung"
            required
            info={{
              title: 'Wo Sie das Jahr finden',
              body:
                'Das Datum der Erstzulassung steht in der Zulassungsbescheinigung Teil I unter Feld B. '
                + 'Wenn Sie unsicher sind, nehmen Sie das Baujahr — wir gleichen es mit Ihren Fotos ab.',
            }}
          >
            {({ id, describedBy, invalid }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                invalid={invalid}
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

      {/* 4 — Freiwillige Fahrzeugdaten */}
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
              geben sie nicht zu anderen Zwecken weiter. Die Angabe ist freiwillig — ohne sie können
              wir Ihren Auftrag ebenfalls bearbeiten.
            </p>
          </Alert>
        </div>
      )}

      {/* 5 — Schlüsselart */}
      {flow.step.id === 'schluesselart' && (
        <div className="space-y-4">
          {keyKinds.length === 0 && (
            <Alert tone="warning" title="Für dieses Modell ist noch keine Schlüsselart hinterlegt">
              Bitte gehen Sie einen Schritt zurück und wählen Sie ein anderes Modell, oder schildern
              Sie uns Ihren Fall über die allgemeine Anfrage.
            </Alert>
          )}
          <div className="grid gap-2">
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
              />
            ))}
          </div>
          <p className="text-[13px] leading-relaxed text-foreground-subtle">
            Unsicher? Wählen Sie die Art, die am ehesten passt. Anhand Ihrer Fotos prüfen wir das
            und melden uns, falls etwas anderes verbaut ist.
          </p>
        </div>
      )}

      {/* 6 — Vorhandene Schlüssel */}
      {flow.step.id === 'vorhandene-schluessel' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Funktionierende Schlüssel</p>
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

      {/* 7 — Leistung */}
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
                  info={serviceInfo(entry)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8 — Schlüsselfotos */}
      {flow.step.id === 'schluesselfotos' && (
        <div className="space-y-7">
          <Alert tone="info" title="So werden die Fotos brauchbar">
            <ul className="space-y-1">
              <li>Legen Sie den Schlüssel auf einen einfarbigen, hellen Untergrund.</li>
              <li>Fotografieren Sie senkrecht von oben, ohne Blitz und ohne Schatten.</li>
              <li>Der Schlüssel sollte das Bild möglichst ausfüllen und scharf sein.</li>
            </ul>
          </Alert>

          {KEY_PHOTO_SLOTS.map((slot) => (
            <PhotoUpload
              key={slot.id}
              id={`schluessel-${slot.id}`}
              label={slot.label}
              description={slot.description}
              example={slot.example}
              required={slot.required}
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
              {retentionDays.keyPhotos} Tage nach Abschluss des Vorgangs auf und löschen sie
              anschließend.
            </p>
          </Alert>
        </div>
      )}

      {/* 9 — Fahrzeugschein */}
      {flow.step.id === 'fahrzeugschein' && (
        <div className="space-y-6">
          <PhotoUpload
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
              Abschluss des Vorgangs auf und löschen sie danach. Eine Weitergabe zu anderen Zwecken
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

      {/* 10 — Kontaktdaten */}
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

            <Field label="Ort" required>
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

            <Field
              label="Land"
              required
              info={{
                title: 'Wozu wir die Anschrift brauchen',
                body:
                  'Steht bei Ihrer Leistung das Fahrzeug im Mittelpunkt, stimmen wir den Ort des '
                  + 'Termins mit Ihnen ab. Dafür brauchen wir mindestens Postleitzahl und Ort.',
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
            label="Ihre Nachricht an uns (freiwillig)"
            hint="Zum Beispiel Besonderheiten am Schlüssel oder Wunschzeiten."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={data.note}
                onChange={(event) => flow.set('note', event.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {/* 11 — Preis */}
      {flow.step.id === 'preis' && (
        <div className="space-y-5">
          {quoteLoading && (
            <p className="flex items-center gap-2 text-[15px] text-foreground-muted" role="status">
              <Loader2 size={17} className="animate-spin" aria-hidden />
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
              <Card variant="muted">
                <CardBody>
                  <p className="text-[13px] leading-relaxed text-foreground-muted">
                    Grundlage: {make?.name} {modelName}, Baujahr {data.year},{' '}
                    {data.keyKind ? KEY_KIND_OPTIONS[data.keyKind as KeyKind].label : ''},{' '}
                    {service?.label}.
                  </p>
                </CardBody>
              </Card>

              <PreisAnzeige quote={quote} />

              <Alert tone="legal" title="Prüfung vor der Ausführung">
                <p>
                  Bevor wir arbeiten, sehen wir uns Ihre Fotos und die Zulassungsbescheinigung an.
                  Ergibt sich daraus ein anderer Fall als hier angenommen, melden wir uns mit dem
                  angepassten Preis. Sie entscheiden dann, ob der Termin bestehen bleibt.
                </p>
              </Alert>
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
            <p className="flex items-center gap-2 text-[15px] text-foreground-muted" role="status">
              <Loader2 size={17} className="animate-spin" aria-hidden />
              Ihre Angaben werden geprüft …
            </p>
          )}
        </div>
      )}

      {/* 12 — Anzahlung */}
      {flow.step.id === 'anzahlung' && quote && (
        <div className="space-y-5">
          <Card>
            <CardBody>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Jetzt fällig
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">
                {formatCents(quote.depositCents)}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
                Die Anzahlung wird <strong className="font-semibold text-foreground">vollständig
                auf den Gesamtpreis angerechnet</strong>. Sie ist kein Zuschlag und keine
                Bearbeitungsgebühr.
              </p>
              {quote.mode === 'fest' && quote.remainderCents !== undefined && (
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Beim Termin verbleiben damit {formatCents(quote.remainderCents)}.
                </p>
              )}
              {quote.mode !== 'fest' && (
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  Den Restbetrag nennen wir Ihnen, sobald der Gesamtpreis feststeht.
                </p>
              )}
            </CardBody>
          </Card>

          <Alert tone="info" title="Wofür die Anzahlung steht">
            <p>
              Mit der Anzahlung reservieren wir Ihnen ein festes Zeitfenster und beginnen mit der
              Beschaffung des passenden Rohlings beziehungsweise Gehäuses. Dadurch entsteht uns
              Aufwand, bevor Sie in der Werkstatt sind.
            </p>
          </Alert>

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

          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground-subtle">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden />
            Im nächsten Schritt wählen Sie Ihren Termin. Erst danach senden Sie die Anfrage ab.
          </p>
        </div>
      )}

      {/* 13 — Termin */}
      {flow.step.id === 'termin' && quote && (
        <TerminAuswahl
          days={slots?.days ?? []}
          loading={slotsLoading}
          error={slotsError}
          leadTimeDays={slots?.leadTimeDays ?? quote.leadTimeDays}
          slotMinutes={quote.slotMinutes}
          requiresVehicleOnSite={quote.requiresVehicleOnSite}
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
    data.country.trim().length > 0
  );
}
