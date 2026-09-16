'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { submitRecord, type SubmitResult } from '@/lib/actions/records';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import type { InfoHint, SummarySection, UploadRef } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { InfoTip } from '@/components/ui/info-tip';
import { Field } from '@/components/forms/field';
import { QuantityInput, Select, TextArea, TextInput } from '@/components/forms/controls';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, type PickedFile } from '@/components/forms/photo-upload';
import { FlowShell } from '@/components/flow/flow-shell';
import { SummaryList } from '@/components/layout/summary-list';

const FLOW_ID = 'sicherheitscheck';

/* ---------- Auswahllisten ------------------------------------------------ */

interface Choice {
  value: string;
  label: string;
  description?: string;
  info?: InfoHint;
}

const OBJECT_TYPES: Choice[] = [
  {
    value: 'einfamilienhaus',
    label: 'Einfamilienhaus',
    description: 'Freistehend, mit eigenem Grundstück.',
  },
  {
    value: 'doppel-reihenhaus',
    label: 'Doppel- oder Reihenhaus',
    description: 'Direkt angrenzende Nachbarbebauung.',
  },
  {
    value: 'wohnung',
    label: 'Wohnung',
    description: 'Einzelne Wohneinheit in einem Mehrparteienhaus.',
  },
  {
    value: 'mehrfamilienhaus',
    label: 'Mehrfamilienhaus',
    description: 'Gesamtes Gebäude mit mehreren Parteien und gemeinsamen Zugängen.',
  },
  {
    value: 'gewerbe',
    label: 'Gewerbeobjekt',
    description: 'Betrieb, Werkstatt, Büro, Praxis oder Ladengeschäft.',
  },
  {
    value: 'sonstiges',
    label: 'Anderes Objekt',
    description: 'Zum Beispiel Lagerhalle, Vereinsheim oder Ferienobjekt.',
  },
];

const OUTDOOR_AREAS: Choice[] = [
  { value: 'garage', label: 'Garage oder Carport' },
  {
    value: 'keller',
    label: 'Kellerzugang, Kellerfenster oder Lichtschächte',
    info: {
      title: 'Warum Lichtschächte zählen',
      body:
        'Kellerfenster und Lichtschächte liegen oft uneinsehbar und lassen sich mit wenig Aufwand '
        + 'erreichen. Sie gehören deshalb zur Außenhaut und werden getrennt betrachtet.',
    },
  },
  { value: 'nebengebaeude', label: 'Nebengebäude, Schuppen oder Lager' },
  { value: 'hof', label: 'Hof, Einfahrt oder Stellplatz' },
  { value: 'garten', label: 'Garten, Terrasse oder Balkon' },
  { value: 'keine', label: 'Nichts davon vorhanden' },
];

const EXISTING_TECH: Choice[] = [
  { value: 'keine', label: 'Nichts vorhanden' },
  { value: 'kamera', label: 'Kameras' },
  { value: 'alarmanlage', label: 'Alarmanlage mit Zentrale' },
  { value: 'melder', label: 'Einzelne Melder oder Tür- und Fensterkontakte' },
  { value: 'sprechanlage', label: 'Tür- oder Videosprechanlage' },
  { value: 'schliessanlage', label: 'Mechanische Schließanlage' },
  { value: 'zutritt', label: 'Elektronisches Zutrittssystem' },
  { value: 'unbekannt', label: 'Unbekannt — bitte vor Ort prüfen' },
];

const FOCUS_OPTIONS: Choice[] = [
  {
    value: 'kamera',
    label: 'Kamera',
    description: 'Bereiche im Blick behalten und Ereignisse nachvollziehen.',
    info: {
      title: 'Kamera heißt auch Verantwortung',
      body:
        'Wer Kameras betreibt, verantwortet deren rechtmäßige Nutzung. Öffentliche Flächen und '
        + 'Nachbargrundstücke dürfen nicht erfasst werden. Wir planen Aufstellort und Blickfeld '
        + 'entsprechend.',
    },
  },
  {
    value: 'alarm',
    label: 'Alarm',
    description: 'Zentrale, Melder und ein festgelegter Benachrichtigungsweg.',
  },
  {
    value: 'glasbruch',
    label: 'Glasbruch',
    description: 'Sensorik an gefährdeten Scheiben.',
    info: {
      title: 'Glasbruch getrennt betrachtet',
      body:
        'Glasbruchsensorik erkennt das Zerstören einer Scheibe. Sie ersetzt keine mechanische '
        + 'Sicherung des Rahmens, sondern ergänzt sie.',
    },
  },
  {
    value: 'fenster',
    label: 'Fenster',
    description: 'Sicherung erreichbarer Fenster und Balkontüren.',
  },
  {
    value: 'tueren',
    label: 'Türen',
    description: 'Zylinder, Beschläge, Zusatzschlösser und Kontakte.',
  },
  {
    value: 'zutritt',
    label: 'Zutritt',
    description: 'Wer darf wann wohin — mit Karte, Transponder, PIN oder App.',
    info: {
      title: 'Zutritt statt Schlüssel',
      body:
        'Beim Zutritt geht es um Berechtigungen, nicht um Einbruchschutz. Verlorene Medien lassen '
        + 'sich sperren, ohne Zylinder zu tauschen. Details klären wir im Bereich Elektronische '
        + 'Zutrittslösungen.',
    },
  },
  {
    value: 'aussenbereich',
    label: 'Außenbereich',
    description: 'Hof, Einfahrt, Garten und Nebengebäude.',
  },
];

const YES_NO_UNKNOWN: Choice[] = [
  { value: 'ja', label: 'Ja' },
  { value: 'nein', label: 'Nein' },
  { value: 'unklar', label: 'Weiß ich nicht' },
];

const WIFI_OPTIONS: Choice[] = [
  { value: 'gut', label: 'Überall guter Empfang' },
  { value: 'teilweise', label: 'Nur in Teilen des Objekts' },
  { value: 'nein', label: 'Kein WLAN vorhanden' },
  { value: 'unklar', label: 'Weiß ich nicht' },
];

const ON_SITE_OPTIONS: Choice[] = [
  { value: 'ja', label: 'Ja, bitte Vor-Ort-Termin anfragen' },
  { value: 'spaeter', label: 'Später — zuerst schriftliche Rückmeldung' },
  { value: 'nein', label: 'Nein, ich möchte nur eine Einschätzung' },
];

/* ---------- Erklärungen -------------------------------------------------- */

const HINT_WINDOWS: InfoHint = {
  title: 'Was heißt „leicht erreichbar“?',
  body:
    'Als leicht erreichbar gelten Öffnungen, die ohne Hilfsmittel oder über vorhandene '
    + 'Aufstiegshilfen erreicht werden können — typischerweise im Erdgeschoss, über Anbauten, '
    + 'Balkone, Mülltonnen oder Garagendächer.',
  figure: {
    motif: 'Messzeichnung: Gebäudeschnitt mit markierten, leicht erreichbaren Öffnungen',
    ratio: '4/3',
  },
};

const HINT_ENTRANCES: InfoHint = {
  title: 'Welche Zugänge zählen',
  body:
    'Gezählt werden alle Türen, durch die man von außen ins Objekt gelangt: Haustür, Nebeneingang, '
    + 'Terrassentür, Kellertür und die Tür vom Objekt in die Garage.',
};

const HINT_LOGGING: InfoHint = {
  title: 'Was Protokollfunktionen aufzeichnen',
  body:
    'Protokolle halten fest, wer wann eine Tür geöffnet, eine Anlage scharf geschaltet oder einen '
    + 'Alarm quittiert hat. Das sind personenbezogene Daten. Zweck, Speicherdauer und Zugriff legen '
    + 'Sie als Betreiberin oder Betreiber vorab fest.',
};

const HINT_APP: InfoHint = {
  title: 'App-Steuerung setzt Technik voraus',
  body:
    'Eine App braucht einen stabilen Internetanschluss und ausreichende Abdeckung am Aufstellort. '
    + 'Ohne beides bleibt die Anlage vor Ort bedienbar, aber nicht aus der Ferne.',
};

const HINT_BUDGET: InfoHint = {
  title: 'Wozu die Angabe dient',
  body:
    'Die Angabe ist freiwillig und wird nicht als Preis verstanden. Sie hilft uns, den Vorschlag '
    + 'passend zu dimensionieren und sinnvolle Ausbaustufen vorzuschlagen. Den Preis nennen wir '
    + 'erst nach der Prüfung.',
};

const HINT_ON_SITE: InfoHint = {
  title: 'Warum ein Vor-Ort-Termin hilft',
  body:
    'Viele Punkte lassen sich erst am Objekt beurteilen: Beschaffenheit von Türen und Fenstern, '
    + 'Leitungswege, Montageorte und Blickfelder. Den Termin stimmen wir nach der Prüfung mit Ihnen ab.',
};

/* ---------- Schritte ----------------------------------------------------- */

const STEPS: FlowStep[] = [
  {
    id: 'objekt',
    short: 'Objekt',
    title: 'Um welches Objekt geht es?',
    hint: 'Die Objektart bestimmt, welche Bereiche wir überhaupt betrachten müssen.',
  },
  {
    id: 'zugaenge',
    short: 'Zugänge',
    title: 'Zugänge und leicht erreichbare Fenster',
    hint: 'Eine grobe Zahl genügt. Wir prüfen die Details später am Objekt oder anhand Ihrer Unterlagen.',
  },
  {
    id: 'aussen',
    short: 'Außen',
    title: 'Garage, Keller, Nebengebäude und Außenflächen',
    hint: 'Diese Bereiche werden häufig vergessen und sind oft der einfachste Weg ins Objekt.',
  },
  {
    id: 'bestand',
    short: 'Bestand',
    title: 'Vorhandene Kamera-, Alarm- oder Schließtechnik',
    hint: 'Was schon da ist, lässt sich in vielen Fällen weiter nutzen oder erweitern.',
  },
  {
    id: 'schwerpunkte',
    short: 'Schwerpunkte',
    title: 'Wo liegt Ihr Schwerpunkt?',
    hint: 'Mehrfachauswahl möglich. Die Reihenfolge der Umsetzung stimmen wir danach mit Ihnen ab.',
  },
  {
    id: 'netz',
    short: 'Netz und App',
    title: 'Internet, WLAN und gewünschte App-Steuerung',
    hint: 'Davon hängt ab, welche Geräte und Betriebsarten überhaupt in Frage kommen.',
  },
  {
    id: 'unterlagen',
    short: 'Unterlagen',
    title: 'Fotos und Grundriss hochladen',
    hint: 'Freiwillig, aber hilfreich: Mit Bildern und Grundriss können wir deutlich genauer einschätzen.',
  },
  {
    id: 'rahmen',
    short: 'Rahmen',
    title: 'Budgetrahmen und Vor-Ort-Termin',
    hint: 'Beides ist optional und dient nur der Einordnung.',
  },
  {
    id: 'kontakt',
    short: 'Kontakt',
    title: 'Ihre Kontaktdaten',
    hint: 'Wir brauchen eine Rückmeldemöglichkeit und die Anschrift des Objekts.',
  },
  {
    id: 'zusammenfassung',
    short: 'Übersicht',
    title: 'Zusammenfassung',
    hint: 'Bitte prüfen Sie Ihre Angaben. Über die Schrittliste oben können Sie jederzeit zurück.',
  },
];

/* ---------- Daten -------------------------------------------------------- */

type CheckData = {
  objectType: string;
  objectNote: string;
  entrances: number;
  windows: number;
  outdoorAreas: string[];
  outdoorNote: string;
  existing: string[];
  existingNote: string;
  focus: string[];
  internet: string;
  wifi: string;
  appControl: string;
  logging: string;
  budget: string;
  onSite: string;
  timeWish: string;
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
  message: string;
  privacy: boolean;
};

const INITIAL: CheckData = {
  objectType: '',
  objectNote: '',
  entrances: 1,
  windows: 0,
  outdoorAreas: [],
  outdoorNote: '',
  existing: [],
  existingNote: '',
  focus: [],
  internet: '',
  wifi: '',
  appControl: '',
  logging: '',
  budget: '',
  onSite: '',
  timeWish: '',
  salutation: '',
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  street: '',
  postalCode: '',
  city: '',
  country: 'Deutschland',
  message: '',
  privacy: false,
};

/* ---------- Hilfen ------------------------------------------------------- */

function labelOf(list: Choice[], value: string): string {
  return list.find((item) => item.value === value)?.label ?? value;
}

function labelsOf(list: Choice[], values: string[]): string {
  return values.length > 0 ? values.map((v) => labelOf(list, v)).join(', ') : 'Keine Angabe';
}

/** Mehrfachauswahl mit einer sich ausschließenden Option („Nichts vorhanden“). */
function toggleValue(current: string[], value: string, exclusive?: string): string[] {
  if (exclusive && value === exclusive) {
    return current.includes(value) ? [] : [value];
  }
  const without = current.filter((v) => v !== exclusive);
  return without.includes(value) ? without.filter((v) => v !== value) : [...without, value];
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Rechtlicher Hinweis, der im Ablauf erscheint, sobald er einschlägig wird. */
function LegalNotice({ className }: { className?: string }) {
  return (
    <Alert
      tone="legal"
      title="Recht und Verantwortung bei Video, Audio und Protokollierung"
      className={className}
    >
      <ul className="space-y-2">
        <li>
          Für die rechtmäßige Nutzung ist die Betreiberin oder der Betreiber der Anlage
          verantwortlich — also für Zweck, Umfang, Speicherdauer, Zugriff und Kennzeichnung.
        </li>
        <li>
          Kameras dürfen öffentliche Flächen und Nachbargrundstücke nicht erfassen. Blickfeld und
          Bildausschnitt planen wir entsprechend.
        </li>
        <li>
          Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an. Gegensprech- und
          Alarmfunktionen richten wir nur für zulässige Einsatzzwecke ein.
        </li>
        <li>
          Protokollfunktionen erfassen personenbezogene Daten. Im Beschäftigtenkontext ist
          zusätzlich die betriebliche Mitbestimmung zu beachten.
        </li>
        <li>Wir beraten technisch und leisten keine Rechtsberatung.</li>
      </ul>
      <p className="mt-3">
        <Link href="/rechtliches/datenschutz" className="font-semibold text-primary hover:underline">
          Hinweise zum Datenschutz
        </Link>
      </p>
    </Alert>
  );
}

/* ---------- Ablauf ------------------------------------------------------- */

export interface SicherheitscheckProps {
  /** Aufbewahrungsfristen aus den Einstellungen, in Tagen. */
  retention: { floorPlans: number; objectPhotos: number };
}

export function Sicherheitscheck({ retention }: SicherheitscheckProps) {
  const [objectPhotos, setObjectPhotos] = useState<PickedFile[]>([]);
  const [floorPlans, setFloorPlans] = useState<PickedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const flow = useFlow<CheckData>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: (data, stepId) => {
      switch (stepId) {
        case 'objekt':
          return data.objectType !== '';
        case 'zugaenge':
          return data.entrances >= 1;
        case 'bestand':
          return data.existing.length > 0;
        case 'schwerpunkte':
          return data.focus.length > 0;
        case 'netz':
          return (
            data.internet !== '' && data.wifi !== '' && data.appControl !== '' && data.logging !== ''
          );
        case 'rahmen':
          return data.onSite !== '';
        case 'kontakt':
        case 'zusammenfassung':
          return (
            data.firstName.trim() !== ''
            && data.lastName.trim() !== ''
            && EMAIL_PATTERN.test(data.email.trim())
            && data.phone.trim() !== ''
            && data.country.trim() !== ''
            && data.privacy
          );
        default:
          return true;
      }
    },
  });

  const { data } = flow;

  // Der rechtliche Hinweis wird eingeblendet, sobald Kamera oder Protokolle im Spiel sind.
  const legalRelevant =
    data.focus.includes('kamera') || data.existing.includes('kamera') || data.logging === 'ja';

  const summary = useMemo<SummarySection[]>(() => {
    const sections: SummarySection[] = [
      {
        title: 'Objekt',
        rows: [
          { label: 'Objektart', value: labelOf(OBJECT_TYPES, data.objectType) },
          { label: 'Zugänge von außen', value: String(data.entrances) },
          { label: 'Leicht erreichbare Fenster', value: String(data.windows) },
          {
            label: 'Außenbereiche',
            value: labelsOf(OUTDOOR_AREAS, data.outdoorAreas),
          },
        ],
      },
      {
        title: 'Bestand und Schwerpunkte',
        rows: [
          { label: 'Vorhandene Technik', value: labelsOf(EXISTING_TECH, data.existing) },
          { label: 'Schwerpunkte', value: labelsOf(FOCUS_OPTIONS, data.focus) },
        ],
      },
      {
        title: 'Netz und Bedienung',
        rows: [
          { label: 'Internetanschluss', value: labelOf(YES_NO_UNKNOWN, data.internet) },
          { label: 'WLAN im Objekt', value: labelOf(WIFI_OPTIONS, data.wifi) },
          { label: 'App-Steuerung gewünscht', value: labelOf(YES_NO_UNKNOWN, data.appControl) },
          { label: 'Protokollfunktionen gewünscht', value: labelOf(YES_NO_UNKNOWN, data.logging) },
        ],
      },
      {
        title: 'Unterlagen',
        rows: [
          {
            label: 'Objektfotos',
            value: objectPhotos.length > 0 ? `${objectPhotos.length} Datei(en)` : 'Keine',
          },
          {
            label: 'Grundriss',
            value: floorPlans.length > 0 ? `${floorPlans.length} Datei(en)` : 'Kein Grundriss',
          },
        ],
      },
      {
        title: 'Rahmen',
        rows: [
          { label: 'Budgetrahmen', value: data.budget.trim() || 'Keine Angabe' },
          { label: 'Vor-Ort-Termin', value: labelOf(ON_SITE_OPTIONS, data.onSite) },
          { label: 'Zeitliche Vorstellung', value: data.timeWish.trim() || 'Keine Angabe' },
        ],
      },
      {
        title: 'Kontakt',
        rows: [
          {
            label: 'Name',
            value: [data.salutation, data.firstName, data.lastName].filter(Boolean).join(' ').trim(),
          },
          { label: 'Firma', value: data.company.trim() || 'Keine Angabe' },
          { label: 'E-Mail', value: data.email.trim() },
          { label: 'Telefon', value: data.phone.trim() },
          {
            label: 'Objektanschrift',
            value:
              [data.street, [data.postalCode, data.city].filter(Boolean).join(' '), data.country]
                .filter((part) => part && part.trim() !== '')
                .join(', ') || 'Keine Angabe',
          },
        ],
      },
    ];

    const notes = [
      data.objectNote.trim() && `Objekt: ${data.objectNote.trim()}`,
      data.outdoorNote.trim() && `Außenbereich: ${data.outdoorNote.trim()}`,
      data.existingNote.trim() && `Bestand: ${data.existingNote.trim()}`,
      data.message.trim() && `Nachricht: ${data.message.trim()}`,
    ].filter((entry): entry is string => Boolean(entry));

    if (notes.length > 0) {
      sections.push({
        title: 'Anmerkungen',
        rows: notes.map((value, index) => ({ label: `Hinweis ${index + 1}`, value })),
      });
    }

    return sections;
  }, [data, objectPhotos.length, floorPlans.length]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const uploads: Array<Omit<UploadRef, 'id' | 'uploadedAt' | 'storageKey'>> = [
      ...objectPhotos.map((file) => ({
        fileName: file.name,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        category: 'objektfoto' as const,
      })),
      ...floorPlans.map((file) => ({
        fileName: file.name,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        category: 'grundriss' as const,
      })),
    ];

    try {
      const response = await submitRecord({
        kind: 'anfrage',
        area: 'sicherheitstechnik',
        process: 'gefuehrte-anfrage',
        contact: {
          salutation: data.salutation || undefined,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          company: data.company.trim() || undefined,
          email: data.email.trim(),
          phone: data.phone.trim(),
          street: data.street.trim() || undefined,
          postalCode: data.postalCode.trim() || undefined,
          city: data.city.trim() || undefined,
          country: data.country.trim(),
        },
        payload: { ...data, legalNoticeShown: legalRelevant },
        summary,
        uploads,
      });

      if (response.ok) {
        setResult(response);
        clearFlow(FLOW_ID);
      } else {
        setError(response.error ?? 'Die Anfrage konnte nicht gespeichert werden.');
      }
    } catch {
      setError('Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- Erfolgsansicht -------------------------------------------- */

  if (result?.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 size={22} aria-hidden />
          </span>

          <h2 className="mt-5 text-xl font-bold text-foreground md:text-2xl">
            Ihre Anfrage ist bei uns eingegangen
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">
            Wir prüfen Ihre Angaben und melden uns mit einer Einschätzung sowie den nächsten
            Schritten.
          </p>

          <div className="mt-6 rounded-lg border border-border bg-surface-muted p-5">
            <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
              Ihre Vorgangsnummer
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {result.reference}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
              Bitte notieren Sie sich diese Nummer. Damit können Sie den Stand Ihres Vorgangs
              abrufen.
            </p>
          </div>

          {result.notices.length > 0 && (
            <div className="mt-5 space-y-3">
              {result.notices.map((notice) => (
                <Alert key={notice} tone="warning">
                  {notice}
                </Alert>
              ))}
            </div>
          )}

          {legalRelevant && <LegalNotice className="mt-5" />}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/service-und-termin/terminstatus" size="lg">
              Stand des Vorgangs abrufen
            </ButtonLink>
            <ButtonLink href="/sicherheitstechnik" size="lg" variant="outline">
              Zurück zur Sicherheitstechnik
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Ablauf ----------------------------------------------------- */

  return (
    <FlowShell
      flow={flow}
      title="Sicherheitscheck"
      submitLabel="Anfrage absenden"
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint="Bitte füllen Sie die Pflichtangaben dieses Schrittes aus."
    >
      {error && (
        <Alert tone="warning" title="Senden nicht möglich" className="mb-5">
          {error}
        </Alert>
      )}

      {/* 1 Objektart */}
      {flow.step?.id === 'objekt' && (
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-foreground">
              Objektart (Pflichtangabe)
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {OBJECT_TYPES.map((option) => (
                <OptionCard
                  key={option.value}
                  name="objectType"
                  value={option.value}
                  checked={data.objectType === option.value}
                  onSelect={(value) => flow.set('objectType', value)}
                  title={option.label}
                  description={option.description}
                />
              ))}
            </div>
          </fieldset>

          <Field
            label="Ergänzung zum Objekt"
            hint="Zum Beispiel Baujahr, Anzahl der Etagen oder besondere Nutzung."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={data.objectNote}
                onChange={(event) => flow.set('objectNote', event.target.value)}
                placeholder="Optional"
              />
            )}
          </Field>
        </div>
      )}

      {/* 2 Zugänge und Fenster */}
      {flow.step?.id === 'zugaenge' && (
        <div className="space-y-6">
          <Field
            label="Zugänge von außen"
            hint="Alle Türen, durch die man von außen ins Objekt gelangt."
            info={HINT_ENTRANCES}
            required
          >
            {({ id }) => (
              <QuantityInput
                id={id}
                label="Zugänge von außen"
                value={data.entrances}
                onChange={(value) => flow.set('entrances', value)}
                min={1}
                max={99}
              />
            )}
          </Field>

          <Field
            label="Leicht erreichbare Fenster und Balkontüren"
            hint="Eine Schätzung genügt. Null ist möglich."
            info={HINT_WINDOWS}
          >
            {({ id }) => (
              <QuantityInput
                id={id}
                label="Leicht erreichbare Fenster und Balkontüren"
                value={data.windows}
                onChange={(value) => flow.set('windows', value)}
                min={0}
                max={99}
              />
            )}
          </Field>
        </div>
      )}

      {/* 3 Außenbereiche */}
      {flow.step?.id === 'aussen' && (
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-foreground">
              Was gehört zum Objekt? Mehrfachauswahl möglich.
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {OUTDOOR_AREAS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="outdoorAreas"
                  value={option.value}
                  multiple
                  checked={data.outdoorAreas.includes(option.value)}
                  onSelect={(value) =>
                    flow.set('outdoorAreas', toggleValue(data.outdoorAreas, value, 'keine'))
                  }
                  title={option.label}
                  description={option.description}
                  info={option.info}
                />
              ))}
            </div>
          </fieldset>

          <Field
            label="Hinweise zu den Außenflächen"
            hint="Zum Beispiel Zufahrt, Beleuchtungssituation oder uneinsehbare Ecken."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={data.outdoorNote}
                onChange={(event) => flow.set('outdoorNote', event.target.value)}
                placeholder="Optional"
              />
            )}
          </Field>
        </div>
      )}

      {/* 4 Vorhandene Technik */}
      {flow.step?.id === 'bestand' && (
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-foreground">
              Was ist bereits vorhanden? Mehrfachauswahl möglich. (Pflichtangabe)
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {EXISTING_TECH.map((option) => (
                <OptionCard
                  key={option.value}
                  name="existing"
                  value={option.value}
                  multiple
                  checked={data.existing.includes(option.value)}
                  onSelect={(value) =>
                    flow.set('existing', toggleValue(data.existing, value, 'keine'))
                  }
                  title={option.label}
                  description={option.description}
                />
              ))}
            </div>
          </fieldset>

          <Field
            label="Hersteller, Alter oder Zustand der vorhandenen Technik"
            hint="Falls bekannt. Das erspart uns Rückfragen."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={data.existingNote}
                onChange={(event) => flow.set('existingNote', event.target.value)}
                placeholder="Optional"
              />
            )}
          </Field>

          {data.existing.includes('kamera') && <LegalNotice />}
        </div>
      )}

      {/* 5 Schwerpunkte */}
      {flow.step?.id === 'schwerpunkte' && (
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-foreground">
              Schwerpunkte — mindestens einer (Pflichtangabe)
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {FOCUS_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="focus"
                  value={option.value}
                  multiple
                  checked={data.focus.includes(option.value)}
                  onSelect={(value) => flow.set('focus', toggleValue(data.focus, value))}
                  title={option.label}
                  description={option.description}
                  info={option.info}
                />
              ))}
            </div>
          </fieldset>

          {data.focus.includes('kamera') && <LegalNotice />}
        </div>
      )}

      {/* 6 Netz und App */}
      {flow.step?.id === 'netz' && (
        <div className="space-y-5">
          <Field label="Internetanschluss im Objekt vorhanden?" required>
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={data.internet}
                onChange={(event) => flow.set('internet', event.target.value)}
              >
                <option value="">Bitte wählen</option>
                {YES_NO_UNKNOWN.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="WLAN-Abdeckung im Objekt" required>
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={data.wifi}
                onChange={(event) => flow.set('wifi', event.target.value)}
              >
                <option value="">Bitte wählen</option>
                {WIFI_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="App-Steuerung gewünscht?" info={HINT_APP} required>
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={data.appControl}
                onChange={(event) => flow.set('appControl', event.target.value)}
              >
                <option value="">Bitte wählen</option>
                {YES_NO_UNKNOWN.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Protokollfunktionen gewünscht?"
            hint="Zum Beispiel Zutritts-, Ereignis- oder Bedienprotokolle."
            info={HINT_LOGGING}
            required
          >
            {({ id, describedBy }) => (
              <Select
                id={id}
                aria-describedby={describedBy}
                value={data.logging}
                onChange={(event) => flow.set('logging', event.target.value)}
              >
                <option value="">Bitte wählen</option>
                {YES_NO_UNKNOWN.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {legalRelevant && <LegalNotice />}
        </div>
      )}

      {/* 7 Unterlagen */}
      {flow.step?.id === 'unterlagen' && (
        <div className="space-y-8">
          <PhotoUpload
            id="objektfotos"
            label="Fotos vom Objekt"
            description={`Außenansicht, Eingangsbereich, Fenster und Nebenzugänge. Wir bewahren Objektfotos ${retention.objectPhotos} Tage auf.`}
            example={{
              motif: 'Beispielfoto: Hauseingang frontal, gesamte Tür mit Umgebung sichtbar',
              ratio: '4/3',
            }}
            files={objectPhotos}
            onChange={setObjectPhotos}
            multiple
            maxFiles={6}
          />

          <PhotoUpload
            id="grundriss"
            label="Grundriss oder Lageplan"
            description={`Als Foto oder PDF. Wir bewahren Grundrisse ${retention.floorPlans} Tage auf.`}
            example={{
              motif: 'Beispiel: Grundrisszeichnung einer Etage mit eingezeichneten Türen und Fenstern',
              ratio: '4/3',
            }}
            files={floorPlans}
            onChange={setFloorPlans}
            multiple
            maxFiles={4}
            allowDocuments
          />

          <Alert tone="info" title="Hochladen ist freiwillig">
            Ohne Unterlagen geht es auch weiter. Wir klären die offenen Punkte dann schriftlich oder
            bei einem Termin vor Ort.
          </Alert>
        </div>
      )}

      {/* 8 Budget und Vor-Ort-Termin */}
      {flow.step?.id === 'rahmen' && (
        <div className="space-y-5">
          <Field
            label="Budgetrahmen"
            hint="Freiwillige Angabe in eigenen Worten, zum Beispiel eine Größenordnung oder eine Obergrenze."
            info={HINT_BUDGET}
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={data.budget}
                onChange={(event) => flow.set('budget', event.target.value)}
                placeholder="Optional"
              />
            )}
          </Field>

          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              Vor-Ort-Termin anfragen? (Pflichtangabe)
              <InfoTip hint={HINT_ON_SITE} />
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {ON_SITE_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="onSite"
                  value={option.value}
                  checked={data.onSite === option.value}
                  onSelect={(value) => flow.set('onSite', value)}
                  title={option.label}
                />
              ))}
            </div>
          </fieldset>

          <Field
            label="Zeitliche Vorstellung"
            hint="Zum Beispiel ein Zeitraum, der Ihnen passt, oder Tage, an denen Sie erreichbar sind."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={data.timeWish}
                onChange={(event) => flow.set('timeWish', event.target.value)}
                placeholder="Optional"
              />
            )}
          </Field>
        </div>
      )}

      {/* 9 Kontakt */}
      {flow.step?.id === 'kontakt' && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Anrede">
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  aria-describedby={describedBy}
                  value={data.salutation}
                  onChange={(event) => flow.set('salutation', event.target.value)}
                >
                  <option value="">Ohne Angabe</option>
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </Select>
              )}
            </Field>

            <Field label="Firma" hint="Nur bei gewerblichen Objekten nötig.">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  autoComplete="organization"
                  value={data.company}
                  onChange={(event) => flow.set('company', event.target.value)}
                />
              )}
            </Field>

            <Field label="Vorname" required>
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="given-name"
                  value={data.firstName}
                  onChange={(event) => flow.set('firstName', event.target.value)}
                />
              )}
            </Field>

            <Field label="Nachname" required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  autoComplete="family-name"
                  value={data.lastName}
                  onChange={(event) => flow.set('lastName', event.target.value)}
                />
              )}
            </Field>

            <Field
              label="E-Mail"
              required
              error={
                data.email.trim() !== '' && !EMAIL_PATTERN.test(data.email.trim())
                  ? 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
                  : undefined
              }
            >
              {({ id, describedBy, invalid }) => (
                <TextInput
                  id={id}
                  type="email"
                  inputMode="email"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="email"
                  value={data.email}
                  onChange={(event) => flow.set('email', event.target.value)}
                />
              )}
            </Field>

            <Field label="Telefon" hint="Für kurze Rückfragen zum Objekt." required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  type="tel"
                  inputMode="tel"
                  aria-describedby={describedBy}
                  autoComplete="tel"
                  value={data.phone}
                  onChange={(event) => flow.set('phone', event.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <Field label="Straße und Hausnummer des Objekts">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  autoComplete="street-address"
                  value={data.street}
                  onChange={(event) => flow.set('street', event.target.value)}
                />
              )}
            </Field>

            <Field label="Postleitzahl">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  inputMode="numeric"
                  aria-describedby={describedBy}
                  autoComplete="postal-code"
                  value={data.postalCode}
                  onChange={(event) => flow.set('postalCode', event.target.value)}
                />
              )}
            </Field>

            <Field label="Ort">
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  autoComplete="address-level2"
                  value={data.city}
                  onChange={(event) => flow.set('city', event.target.value)}
                />
              )}
            </Field>

            <Field label="Land" required>
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  autoComplete="country-name"
                  value={data.country}
                  onChange={(event) => flow.set('country', event.target.value)}
                />
              )}
            </Field>
          </div>

          <Field label="Ihre Nachricht" hint="Alles, was oben nicht gepasst hat.">
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={data.message}
                onChange={(event) => flow.set('message', event.target.value)}
                placeholder="Optional"
              />
            )}
          </Field>

          <div className="rounded-lg border border-border bg-surface p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={data.privacy}
                onChange={(event) => flow.set('privacy', event.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-border-strong text-primary"
              />
              <span className="text-[14px] leading-relaxed text-foreground-muted">
                Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung dieser Anfrage
                gespeichert und verarbeitet werden.{' '}
                <Link
                  href="/rechtliches/datenschutz"
                  className="font-semibold text-primary hover:underline"
                >
                  Hinweise zum Datenschutz
                </Link>
                <span className="ml-1 text-danger" aria-hidden>
                  *
                </span>
              </span>
            </label>
          </div>
        </div>
      )}

      {/* 10 Zusammenfassung */}
      {flow.step?.id === 'zusammenfassung' && (
        <div className="space-y-6">
          <SummaryList sections={summary} />

          {legalRelevant && <LegalNotice />}

          <Alert tone="info" title="Was danach passiert">
            Wir prüfen Ihre Angaben und melden uns mit einer Einschätzung und den nächsten
            Schritten. Sie erhalten eine Vorgangsnummer, über die Sie den Stand abrufen können. Ein
            Preis wird erst nach der Prüfung genannt.
          </Alert>
        </div>
      )}
    </FlowShell>
  );
}
