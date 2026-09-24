'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';

import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { submitRecord } from '@/lib/actions/records';
import { formatNumber } from '@/lib/format';
import type { ContactDetails, InfoHint, SummarySection, UploadRef } from '@/lib/types';
import { FlowShell } from '@/components/flow/flow-shell';
import { Field } from '@/components/forms/field';
import { QuantityInput, Select, TextArea, TextInput } from '@/components/forms/controls';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, type PickedFile } from '@/components/forms/photo-upload';
import { SummaryList } from '@/components/layout/summary-list';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { InfoTip } from '@/components/ui/info-tip';

/* ==========================================================================
   Datenmodell des Konfigurators
   ========================================================================== */

/** Zylinderbauform aus der Datenschicht — ohne Preisangaben. */
export interface DoorTypeOption {
  id: string;
  label: string;
  description: string;
  measureLabels: { a: string; b?: string };
  info: InfoHint;
}

export interface ProjektKonfiguratorProps {
  doorTypes: DoorTypeOption[];
  measuringInfo: InfoHint;
}

interface DoorEntry {
  uid: string;
  label: string;
  type: string;
  measureA: string;
  measureB: string;
  qty: number;
  note: string;
}

interface GroupEntry {
  uid: string;
  name: string;
  doors: string;
  people: number;
}

interface KeyEntry {
  uid: string;
  holder: string;
  count: number;
}

interface ProjectData {
  /* 1 Kundentyp */
  customerType: '' | 'privat' | 'unternehmen' | 'hausverwaltung' | 'oeffentlich' | 'organisation';
  organisation: string;

  /* 2 Objekt */
  buildings: number;
  properties: number;
  areas: number;
  lockPoints: number;
  objectNote: string;

  /* 3 Nutzer */
  userCount: number;
  keyHolders: number;
  rolesNote: string;
  differentRights: '' | 'ja' | 'nein';

  /* 4 Bestehende Anlage */
  hasExisting: '' | 'ja' | 'nein' | 'unbekannt';
  existingManufacturer: string;
  existingSystem: string;
  securityCard: '' | 'ja' | 'nein' | 'unbekannt';

  /* 5 Erweiterung */
  expandDoors: boolean;
  expandUsers: boolean;
  expandProperties: boolean;
  expansionHorizon: '' | 'keine' | 'absehbar' | 'wahrscheinlich' | 'offen';
  expansionNote: string;

  /* 6 Türen */
  doors: DoorEntry[];

  /* 7 Berechtigungen */
  masterKeyWanted: '' | 'ja' | 'nein' | 'unklar';
  groups: GroupEntry[];
  hierarchyNote: string;

  /* 8 Schlüssel */
  keys: KeyEntry[];
  keyNote: string;

  /* 10 Service */
  installation: '' | 'ja' | 'nein' | 'unklar';
  consultation: '' | 'werkstatt' | 'vor-ort' | 'telefon' | 'schriftlich';
  timeframe: '' | 'sofort' | 'naechste-monate' | 'laufendes-jahr' | 'offen';
  budget: string;
  serviceNote: string;

  /* Abschluss */
  contact: ContactDetails;
  consent: boolean;
}

const FLOW_ID = 'schliessanlagen-projekt';

const INITIAL: ProjectData = {
  customerType: '',
  organisation: '',

  buildings: 1,
  properties: 1,
  areas: 1,
  lockPoints: 1,
  objectNote: '',

  userCount: 1,
  keyHolders: 1,
  rolesNote: '',
  differentRights: '',

  hasExisting: '',
  existingManufacturer: '',
  existingSystem: '',
  securityCard: '',

  expandDoors: false,
  expandUsers: false,
  expandProperties: false,
  expansionHorizon: '',
  expansionNote: '',

  doors: [
    { uid: 'tuer-1', label: '', type: '', measureA: '', measureB: '', qty: 1, note: '' },
  ],

  masterKeyWanted: '',
  groups: [{ uid: 'gruppe-1', name: '', doors: '', people: 1 }],
  hierarchyNote: '',

  keys: [{ uid: 'schluessel-1', holder: '', count: 1 }],
  keyNote: '',

  installation: '',
  consultation: '',
  timeframe: '',
  budget: '',
  serviceNote: '',

  contact: {
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
  },
  consent: false,
};

const STEPS: FlowStep[] = [
  {
    id: 'kundentyp',
    short: 'Kundentyp',
    title: 'Wer plant das Projekt?',
    hint: 'Daraus ergibt sich, welche Angaben wir überhaupt brauchen.',
  },
  {
    id: 'objekt',
    short: 'Objekt',
    title: 'Ihr Objekt',
    hint: 'Grobe Zahlen genügen. Sie können später noch korrigieren.',
  },
  {
    id: 'nutzer',
    short: 'Nutzer',
    title: 'Nutzer und Rollen',
    hint: 'Wie viele Personen bekommen einen Schlüssel — und sollen alle dasselbe öffnen?',
  },
  {
    id: 'bestand',
    short: 'Bestand',
    title: 'Bestehende Anlage',
    hint: 'Wenn schon eine Anlage vorhanden ist, prüfen wir zuerst, ob sie erweitert werden kann.',
  },
  {
    id: 'erweiterung',
    short: 'Erweiterung',
    title: 'Erweiterung in der Zukunft',
    hint: 'Reserven im Schließplan lassen sich nur zu Beginn festlegen.',
  },
  {
    id: 'tueren',
    short: 'Türen',
    title: 'Türen und Schließstellen',
    hint: 'Eine Zeile je Tür. Gleiche Türen können Sie über die Anzahl zusammenfassen.',
  },
  {
    id: 'berechtigungen',
    short: 'Berechtigungen',
    title: 'Wer darf welche Tür öffnen?',
    hint: 'Gruppen statt Einzelpersonen genügen — Namen brauchen wir hier noch nicht.',
  },
  {
    id: 'schluessel',
    short: 'Schlüssel',
    title: 'Anzahl der Schlüssel',
    hint: 'Planen Sie lieber etwas großzügiger — Nachbestellungen sind aufwendiger.',
  },
  {
    id: 'dokumente',
    short: 'Unterlagen',
    title: 'Unterlagen hochladen',
    hint: 'Alles freiwillig. Jede Unterlage verkürzt die Rückfragen.',
  },
  {
    id: 'service',
    short: 'Service',
    title: 'Montage, Beratung und Zeitraum',
    hint: 'Damit wir wissen, wie viel Sie selbst übernehmen möchten.',
  },
  {
    id: 'abschluss',
    short: 'Abschluss',
    title: 'Zusammenfassung und Kontakt',
    hint: 'Bitte prüfen Sie Ihre Angaben, bevor Sie das Projekt absenden.',
  },
];

/* ==========================================================================
   Beschriftungen und Ableitungen
   ========================================================================== */

const CUSTOMER_TYPES: { value: ProjectData['customerType']; title: string; body: string }[] = [
  {
    value: 'privat',
    title: 'Privat',
    body: 'Eigenes Haus oder eigene Wohnung, meist mit Keller, Garage oder Gartentor.',
  },
  {
    value: 'unternehmen',
    title: 'Unternehmen',
    body: 'Betrieb, Büro, Praxis, Werkstatt, Handel oder Lager.',
  },
  {
    value: 'hausverwaltung',
    title: 'Hausverwaltung',
    body: 'Verwaltung von Wohn- oder Gewerbeobjekten mit mehreren Parteien.',
  },
  {
    value: 'oeffentlich',
    title: 'Öffentliche Einrichtung',
    body: 'Verwaltung, Schule, Einrichtung mit Publikumsverkehr.',
  },
  {
    value: 'organisation',
    title: 'Sonstige Organisation',
    body: 'Verein, Genossenschaft, Stiftung oder etwas anderes.',
  },
];

const CUSTOMER_LABELS: Record<string, string> = Object.fromEntries(
  CUSTOMER_TYPES.map((t) => [t.value, t.title]),
);

const EXISTING_LABELS: Record<string, string> = {
  ja: 'Ja, eine Anlage ist vorhanden',
  nein: 'Nein, wir fangen neu an',
  unbekannt: 'Unbekannt',
};

const CARD_LABELS: Record<string, string> = {
  ja: 'Sicherungskarte liegt vor',
  nein: 'Keine Sicherungskarte vorhanden',
  unbekannt: 'Nicht bekannt',
};

const HORIZON_LABELS: Record<string, string> = {
  keine: 'Keine Erweiterung vorgesehen',
  absehbar: 'Erweiterung ist bereits absehbar',
  wahrscheinlich: 'Erweiterung ist wahrscheinlich',
  offen: 'Noch offen',
};

const MASTER_LABELS: Record<string, string> = {
  ja: 'Ja, ein übergeordneter Schlüssel ist gewünscht',
  nein: 'Nein, keinen Schlüssel über alle Türen',
  unklar: 'Noch nicht entschieden',
};

const INSTALLATION_LABELS: Record<string, string> = {
  ja: 'Montage durch uns gewünscht',
  nein: 'Montage übernehmen wir selbst',
  unklar: 'Noch offen',
};

const CONSULTATION_LABELS: Record<string, string> = {
  werkstatt: 'Beratungstermin im Betrieb',
  'vor-ort': 'Beratungstermin im Objekt',
  telefon: 'Telefonische Beratung',
  schriftlich: 'Zunächst nur schriftlich',
};

const TIMEFRAME_LABELS: Record<string, string> = {
  sofort: 'So bald wie möglich',
  'naechste-monate': 'In den nächsten Monaten',
  'laufendes-jahr': 'Im laufenden Jahr',
  offen: 'Zeitraum noch offen',
};

const SYSTEM_NAMES = {
  gleichschliessung: 'Gleichschließung',
  z: 'Zentralschlossanlage (Z)',
  hs: 'Hauptschlüsselanlage (HS)',
  ghs: 'Generalhauptschlüsselanlage (GHS)',
} as const;

interface Recommendation {
  system: string;
  reasons: string[];
}

/**
 * Einordnung aus den Angaben — ausdrücklich ein Vorschlag.
 * Jede Regel nennt den Grund, damit die Empfehlung nachvollziehbar bleibt.
 */
function recommend(d: ProjectData): Recommendation {
  const reasons: string[] = [];
  let system: string;

  if (d.differentRights === 'nein') {
    system = SYSTEM_NAMES.gleichschliessung;
    reasons.push('Alle Schlüssel sollen alle Türen öffnen — es sind keine Ebenen nötig.');
  } else if (d.masterKeyWanted === 'nein') {
    system = SYSTEM_NAMES.z;
    reasons.push('Unterschiedliche Personen sollen unterschiedliche Türen öffnen.');
    reasons.push('Ein Schlüssel über alle Türen ist ausdrücklich nicht gewünscht.');
  } else if (d.buildings > 1 || d.properties > 1 || d.groups.length >= 4) {
    system = SYSTEM_NAMES.ghs;
    if (d.buildings > 1) reasons.push(`Sie haben ${formatNumber(d.buildings)} Gebäude angegeben.`);
    if (d.properties > 1) {
      reasons.push(`Sie haben ${formatNumber(d.properties)} Liegenschaften angegeben.`);
    }
    if (d.groups.length >= 4) {
      reasons.push(`Sie haben ${formatNumber(d.groups.length)} Berechtigungsgruppen angelegt.`);
    }
    reasons.push('Für mehrere Ebenen über mehrere Einheiten ist eine übergeordnete Stufe sinnvoll.');
  } else {
    system = SYSTEM_NAMES.hs;
    reasons.push('Die Nutzer sollen nur ihre eigenen Türen öffnen.');
    reasons.push('Zusätzlich soll ein Schlüssel alle Türen der Anlage öffnen.');
  }

  if (d.masterKeyWanted === 'unklar') {
    reasons.push(
      'Ob es einen übergeordneten Schlüssel geben soll, ist noch offen — das klären wir im Gespräch.',
    );
  }

  if (d.expandDoors || d.expandUsers || d.expandProperties) {
    reasons.push('Sie rechnen mit Ergänzungen — wir halten dafür Reserven im Schließplan frei.');
  }

  if (d.hasExisting === 'ja') {
    reasons.push('Eine bestehende Anlage ist vorhanden. Wir prüfen zuerst, ob sie erweitert werden kann.');
  }

  return { system, reasons };
}

/* ==========================================================================
   Prüfung und Relevanz der Schritte
   ========================================================================== */

function isFilled(value: string): boolean {
  return value.trim().length > 0;
}

function validateStep(d: ProjectData, stepId: string): boolean {
  switch (stepId) {
    case 'kundentyp':
      return d.customerType !== '';
    case 'objekt':
      return d.buildings >= 1 && d.areas >= 1 && d.lockPoints >= 1 && d.properties >= 1;
    case 'nutzer':
      return d.userCount >= 1 && d.keyHolders >= 1 && d.differentRights !== '';
    case 'bestand':
      return d.hasExisting !== '' && (d.hasExisting !== 'ja' || d.securityCard !== '');
    case 'erweiterung':
      return d.expansionHorizon !== '';
    case 'tueren':
      return d.doors.length > 0 && d.doors.every((door) => isFilled(door.label) && door.qty >= 1);
    case 'berechtigungen':
      return (
        d.masterKeyWanted !== ''
        && d.groups.length > 0
        && d.groups.every((group) => isFilled(group.name) && isFilled(group.doors))
      );
    case 'schluessel':
      return d.keys.length > 0 && d.keys.every((entry) => isFilled(entry.holder) && entry.count >= 1);
    case 'dokumente':
      return true;
    case 'service':
      return d.installation !== '' && d.consultation !== '' && d.timeframe !== '';
    case 'abschluss':
      return (
        isFilled(d.contact.firstName)
        && isFilled(d.contact.lastName)
        && d.contact.email.includes('@')
        && isFilled(d.contact.phone)
        && d.consent
      );
    default:
      return true;
  }
}

/**
 * Blendet den Berechtigungsblock aus, wenn ohnehin jeder Schlüssel jede Tür
 * öffnen soll. Pflichtangaben werden dadurch nicht versteckt: Die Frage nach
 * unterschiedlichen Rechten steht einen Schritt vorher.
 */
function isStepRelevant(d: ProjectData, stepId: string): boolean {
  if (stepId === 'berechtigungen') return d.differentRights !== 'nein';
  return true;
}

/* ==========================================================================
   Zusammenfassung
   ========================================================================== */

function doorLine(door: DoorEntry, types: DoorTypeOption[]): string {
  const type = types.find((t) => t.id === door.type);
  const parts = [door.label.trim()];
  parts.push(type ? type.label : 'Zylindertyp offen');
  if (isFilled(door.measureA) || isFilled(door.measureB)) {
    parts.push(`${door.measureA.trim() || '?'} / ${door.measureB.trim() || '?'} mm`);
  } else {
    parts.push('Maß noch nicht gemessen');
  }
  parts.push(`${formatNumber(door.qty)} Stück`);
  if (isFilled(door.note)) parts.push(door.note.trim());
  return parts.join(' · ');
}

function buildSummary(
  d: ProjectData,
  types: DoorTypeOption[],
  planFiles: PickedFile[],
  docFiles: PickedFile[],
  rec: Recommendation,
): SummarySection[] {
  const expansion = [
    d.expandDoors ? 'weitere Türen' : null,
    d.expandUsers ? 'weitere Nutzer' : null,
    d.expandProperties ? 'weitere Immobilien' : null,
  ].filter(Boolean) as string[];

  const sections: SummarySection[] = [
    {
      title: '1. Kundentyp',
      rows: [
        { label: 'Art des Auftraggebers', value: CUSTOMER_LABELS[d.customerType] ?? 'Keine Angabe' },
        { label: 'Organisation', value: isFilled(d.organisation) ? d.organisation.trim() : 'Keine Angabe' },
      ],
    },
    {
      title: '2. Objekt',
      rows: [
        { label: 'Gebäude', value: formatNumber(d.buildings) },
        { label: 'Liegenschaften', value: formatNumber(d.properties) },
        { label: 'Bereiche', value: formatNumber(d.areas) },
        { label: 'Schließstellen (geschätzt)', value: formatNumber(d.lockPoints) },
        { label: 'Hinweise zum Objekt', value: isFilled(d.objectNote) ? d.objectNote.trim() : 'Keine' },
      ],
    },
    {
      title: '3. Nutzer',
      rows: [
        { label: 'Nutzer insgesamt', value: formatNumber(d.userCount) },
        { label: 'Schlüsselinhaber', value: formatNumber(d.keyHolders) },
        {
          label: 'Rollen und Abteilungen',
          value: isFilled(d.rolesNote) ? d.rolesNote.trim() : 'Keine Angabe',
        },
        {
          label: 'Unterschiedliche Rechte',
          value:
            d.differentRights === 'ja'
              ? 'Ja, nicht jeder soll jede Tür öffnen'
              : 'Nein, alle Schlüssel öffnen alle Türen',
        },
      ],
    },
    {
      title: '4. Bestehende Anlage',
      rows: [
        { label: 'Anlage vorhanden', value: EXISTING_LABELS[d.hasExisting] ?? 'Keine Angabe' },
        {
          label: 'Hersteller',
          value: isFilled(d.existingManufacturer) ? d.existingManufacturer.trim() : 'Keine Angabe',
        },
        {
          label: 'System oder Anlagennummer',
          value: isFilled(d.existingSystem) ? d.existingSystem.trim() : 'Keine Angabe',
        },
        { label: 'Sicherungskarte', value: CARD_LABELS[d.securityCard] ?? 'Keine Angabe' },
        {
          label: 'Fotos und Schließplan',
          value: planFiles.length > 0 ? planFiles.map((f) => f.name).join(', ') : 'Keine Dateien',
        },
      ],
    },
    {
      title: '5. Erweiterung',
      rows: [
        { label: 'Geplante Ergänzungen', value: expansion.length > 0 ? expansion.join(', ') : 'Keine' },
        { label: 'Zeitliche Einschätzung', value: HORIZON_LABELS[d.expansionHorizon] ?? 'Keine Angabe' },
        {
          label: 'Hinweise zur Erweiterung',
          value: isFilled(d.expansionNote) ? d.expansionNote.trim() : 'Keine',
        },
      ],
    },
    {
      title: '6. Türen',
      rows: d.doors.map((door, index) => ({
        label: `Position ${index + 1}`,
        value: doorLine(door, types),
      })),
    },
  ];

  if (d.differentRights !== 'nein') {
    sections.push({
      title: '7. Berechtigungen',
      rows: [
        { label: 'Übergeordneter Schlüssel', value: MASTER_LABELS[d.masterKeyWanted] ?? 'Keine Angabe' },
        ...d.groups.map((group, index) => ({
          label: `Gruppe ${index + 1}`,
          value: `${group.name.trim()} · ${group.doors.trim()} · ${formatNumber(group.people)} Personen`,
        })),
        {
          label: 'Rangfolge und Hierarchie',
          value: isFilled(d.hierarchyNote) ? d.hierarchyNote.trim() : 'Keine Angabe',
        },
      ],
    });
  } else {
    sections.push({
      title: '7. Berechtigungen',
      rows: [
        {
          label: 'Berechtigungsstufen',
          value: 'Nicht erforderlich — alle Schlüssel sollen alle Türen öffnen.',
        },
      ],
    });
  }

  sections.push(
    {
      title: '8. Schlüssel',
      rows: [
        ...d.keys.map((entry, index) => ({
          label: `Schlüssel ${index + 1}`,
          value: `${entry.holder.trim()} · ${formatNumber(entry.count)} Stück`,
        })),
        {
          label: 'Schlüssel gesamt (geplant)',
          value: formatNumber(d.keys.reduce((sum, entry) => sum + entry.count, 0)),
        },
        { label: 'Hinweise zu den Schlüsseln', value: isFilled(d.keyNote) ? d.keyNote.trim() : 'Keine' },
      ],
    },
    {
      title: '9. Unterlagen',
      rows: [
        {
          label: 'Hochgeladene Dateien',
          value: docFiles.length > 0 ? docFiles.map((f) => f.name).join(', ') : 'Keine Dateien',
        },
      ],
    },
    {
      title: '10. Service',
      rows: [
        { label: 'Montage', value: INSTALLATION_LABELS[d.installation] ?? 'Keine Angabe' },
        { label: 'Beratung', value: CONSULTATION_LABELS[d.consultation] ?? 'Keine Angabe' },
        { label: 'Gewünschter Zeitraum', value: TIMEFRAME_LABELS[d.timeframe] ?? 'Keine Angabe' },
        { label: 'Budgetrahmen', value: isFilled(d.budget) ? d.budget.trim() : 'Keine Angabe' },
        {
          label: 'Hinweise zum Service',
          value: isFilled(d.serviceNote) ? d.serviceNote.trim() : 'Keine',
        },
      ],
    },
    {
      title: 'Einordnung (Vorschlag)',
      rows: [
        { label: 'Vorgeschlagenes System', value: rec.system },
        { label: 'Begründung', value: rec.reasons.join(' ') },
        {
          label: 'Verbindlichkeit',
          value: 'Vorschlag aus den Angaben. Wird im Beratungsgespräch geprüft.',
        },
      ],
    },
  );

  return sections;
}

/* ==========================================================================
   Kleine Bausteine
   ========================================================================== */

function newUid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Frage mit Überschrift, optionaler Erklärung und Auswahlflächen. */
function Question({
  title,
  hint,
  info,
  required = false,
  children,
}: {
  title: string;
  hint?: string;
  info?: InfoHint;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1">
        <span className="inline-flex flex-wrap items-center gap-2 align-middle">
          <span className="text-sm font-semibold text-foreground">
            {title}
            {required && (
              <span className="ml-1 text-danger" aria-hidden>
                *
              </span>
            )}
            {required && <span className="sr-only"> (Pflichtangabe)</span>}
          </span>
          {info && <InfoTip hint={info} />}
        </span>
      </legend>
      {hint && <p className="mb-3 text-[13px] leading-snug text-foreground-subtle">{hint}</p>}
      <div className="mt-2 grid gap-2.5">{children}</div>
    </fieldset>
  );
}

/** Rahmen für eine Position in einer Liste — mit Entfernen-Schaltfläche. */
function ListRow({
  title,
  onRemove,
  removeLabel,
  canRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  removeLabel: string;
  canRemove: boolean;
  children: ReactNode;
}) {
  return (
    <li className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
          {title}
        </p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-foreground-muted hover:text-danger"
          >
            <Trash2 size={15} aria-hidden />
            Entfernen
            <span className="sr-only"> — {removeLabel}</span>
          </button>
        )}
      </div>
      {children}
    </li>
  );
}

/* ==========================================================================
   Erklärungen
   ========================================================================== */

const HINT_LOCK_POINTS: InfoHint = {
  title: 'Schließstelle',
  body:
    'Jede Stelle, an der geschlossen wird: Türzylinder, aber auch Briefkasten, Schrank, '
    + 'Vorhangschloss oder Schranke. Eine Tür mit zwei Zylindern zählt doppelt. Eine Schätzung '
    + 'genügt — die genaue Liste entsteht im nächsten Schritt.',
  figure: {
    motif: 'Schemazeichnung Grundriss mit nummerierten Schließstellen',
    ratio: '4/3',
  },
};

const HINT_AREAS: InfoHint = {
  title: 'Bereich',
  body:
    'Ein Bereich ist ein Teil des Objekts, der zusammengehört: Wohnung, Etage, Abteilung, '
    + 'Werkstatt, Lager oder Außenanlage. Bereiche helfen später beim Aufbau der Ebenen.',
};

const HINT_PROPERTIES: InfoHint = {
  title: 'Liegenschaft',
  body:
    'Eine Liegenschaft ist ein Grundstück mit allem, was darauf steht. Ein Einfamilienhaus mit '
    + 'Garage ist eine Liegenschaft. Zwei Häuser an verschiedenen Adressen sind zwei.',
};

const HINT_DIFFERENT_RIGHTS: InfoHint = {
  title: 'Warum diese Frage entscheidend ist',
  body:
    'Wenn jeder Schlüssel jede Tür öffnen darf, brauchen Sie keinen Schließplan mit Ebenen — '
    + 'eine Gleichschließung genügt. Sobald jemand eine Tür nicht öffnen können soll, planen wir '
    + 'eine Anlage mit mehreren Stufen. Diese Angabe steuert die folgenden Fragen.',
  figure: {
    motif: 'Schemazeichnung: links ein Schlüssel für alle Türen, rechts Ebenen mit getrennten Rechten',
    ratio: '16/9',
  },
};

const HINT_SECURITY_CARD: InfoHint = {
  title: 'Sicherungskarte',
  body:
    'Zu vielen Anlagen gehört eine Karte oder ein Nachweisdokument. Nur wer diesen Nachweis '
    + 'vorlegt, kann weitere Schlüssel für die Anlage bestellen. Wenn Sie die Karte nicht finden, '
    + 'wählen Sie „Nicht bekannt“ — wir prüfen dann, welche Wege es gibt.',
  figure: {
    motif: 'Schemazeichnung Sicherungskarte mit Anlagennummer, neutral ohne Herstellerbezug',
    ratio: '3/2',
  },
};

const HINT_EXPANSION: InfoHint = {
  title: 'Warum wir jetzt danach fragen',
  body:
    'Reserven für spätere Türen und Nutzer werden beim Anlegen des Schließplans festgelegt. '
    + 'Fehlen sie, muss eine Anlage später unter Umständen neu aufgebaut werden. Auch ein noch '
    + 'unentschiedenes Vorhaben ist hier eine hilfreiche Angabe.',
};

const HINT_MASTER_KEY: InfoHint = {
  title: 'Übergeordneter Schlüssel',
  body:
    'Gemeint ist ein Schlüssel, der alle Türen der Anlage öffnet — oft bei Leitung, Haustechnik '
    + 'oder Verwaltung. Gibt es ihn, sprechen wir von einer Hauptschlüsselanlage (HS). Gibt es ihn '
    + 'bewusst nicht, ist häufig eine Zentralschlossanlage (Z) die passende Form.',
  figure: {
    motif: 'Schemazeichnung: Hauptschlüssel über Nutzerschlüsseln, daneben Variante ohne Hauptschlüssel',
    ratio: '16/9',
  },
};

const HINT_GROUPS: InfoHint = {
  title: 'Berechtigungsgruppe',
  body:
    'Eine Gruppe fasst Personen mit denselben Rechten zusammen — zum Beispiel „Büro“, '
    + '„Werkstatt“, „Reinigung“ oder „Wohnung 1“. Für den Schließplan sind Gruppen wichtiger als '
    + 'einzelne Namen. Namen brauchen wir erst bei der Ausgabe der Schlüssel.',
};

const HINT_KEYS: InfoHint = {
  title: 'Anzahl der Schlüssel',
  body:
    'Rechnen Sie Ersatzschlüssel und Vertretungen mit ein. Schlüssel einer Anlage werden nach '
    + 'Plan gefertigt; eine spätere Nachbestellung ist möglich, aber aufwendiger als die '
    + 'Fertigung in einem Zug.',
};

const HINT_DOCUMENTS: InfoHint = {
  title: 'Welche Unterlagen helfen',
  body:
    'Grundrisse mit eingezeichneten Türen, vorhandene Türlisten, Fotos der eingebauten Zylinder '
    + 'und bestehende Schließpläne. Alles freiwillig — jede Unterlage spart eine Rückfrage.',
};

const HINT_BUDGET: InfoHint = {
  title: 'Budgetrahmen',
  body:
    'Freiwillig. Ein grober Rahmen hilft uns, Ihnen passende Varianten vorzuschlagen, statt an '
    + 'Ihrem Vorhaben vorbeizuplanen. Die Angabe ist keine Bestellung und bindet Sie nicht.',
};

/* ==========================================================================
   Konfigurator
   ========================================================================== */

export function ProjektKonfigurator({ doorTypes, measuringInfo }: ProjektKonfiguratorProps) {
  const flow = useFlow<ProjectData>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: 1,
    validate: validateStep,
    isStepRelevant,
  });

  // Dateien bleiben bewusst außerhalb des Zwischenspeichers: Vorschauen aus
  // dem Browser lassen sich nach einem Neuladen nicht wiederherstellen.
  const [planFiles, setPlanFiles] = useState<PickedFile[]>([]);
  const [docFiles, setDocFiles] = useState<PickedFile[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; notices: string[] } | null>(null);

  const d = flow.data;
  const recommendation = useMemo(() => recommend(d), [d]);
  const summary = useMemo(
    () => buildSummary(d, doorTypes, planFiles, docFiles, recommendation),
    [d, doorTypes, planFiles, docFiles, recommendation],
  );

  function setContact<K extends keyof ContactDetails>(key: K, value: ContactDetails[K]) {
    flow.update({ contact: { ...d.contact, [key]: value } });
  }

  /* ---- Listen ---------------------------------------------------------- */

  function addDoor() {
    flow.update({
      doors: [
        ...d.doors,
        { uid: newUid('tuer'), label: '', type: '', measureA: '', measureB: '', qty: 1, note: '' },
      ],
    });
  }

  function updateDoor(uid: string, patch: Partial<DoorEntry>) {
    flow.update({ doors: d.doors.map((door) => (door.uid === uid ? { ...door, ...patch } : door)) });
  }

  function removeDoor(uid: string) {
    flow.update({ doors: d.doors.filter((door) => door.uid !== uid) });
  }

  function addGroup() {
    flow.update({ groups: [...d.groups, { uid: newUid('gruppe'), name: '', doors: '', people: 1 }] });
  }

  function updateGroup(uid: string, patch: Partial<GroupEntry>) {
    flow.update({ groups: d.groups.map((g) => (g.uid === uid ? { ...g, ...patch } : g)) });
  }

  function removeGroup(uid: string) {
    flow.update({ groups: d.groups.filter((g) => g.uid !== uid) });
  }

  function addKey() {
    flow.update({ keys: [...d.keys, { uid: newUid('schluessel'), holder: '', count: 1 }] });
  }

  function updateKey(uid: string, patch: Partial<KeyEntry>) {
    flow.update({ keys: d.keys.map((k) => (k.uid === uid ? { ...k, ...patch } : k)) });
  }

  function removeKey(uid: string) {
    flow.update({ keys: d.keys.filter((k) => k.uid !== uid) });
  }

  /* ---- Absenden -------------------------------------------------------- */

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const uploads: Array<Omit<UploadRef, 'id' | 'uploadedAt' | 'storageKey'>> = [
      ...planFiles.map((file) => ({
        fileName: file.name,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        category: 'dokument' as const,
      })),
      ...docFiles.map((file) => ({
        fileName: file.name,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        category: 'grundriss' as const,
      })),
    ];

    try {
      const response = await submitRecord({
        kind: 'projekt',
        area: 'schliessanlagen',
        process: 'projektkonfigurator',
        contact: d.contact,
        payload: {
          ...d,
          empfehlung: recommendation.system,
          empfehlungBegruendung: recommendation.reasons,
        },
        summary,
        uploads,
      });

      if (response.ok && response.reference) {
        clearFlow(FLOW_ID);
        setResult({ reference: response.reference, notices: response.notices });
      } else {
        setError(response.error ?? 'Der Vorgang konnte nicht gespeichert werden.');
      }
    } catch {
      setError('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- Erfolgsansicht --------------------------------------------------- */

  if (result) {
    return (
      <div className="mx-auto max-w-3xl">
        <Alert tone="success" title="Ihr Projekt ist bei uns eingegangen">
          Wir haben Ihre Angaben aufgenommen und melden uns mit Rückfragen oder einem Vorschlag
          für den Schließplan.
        </Alert>

        <Card className="mt-5">
          <CardBody>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-foreground-subtle">
              Ihre Vorgangsnummer
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {result.reference}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
              Bitte notieren Sie sich diese Nummer. Mit ihr können Sie den Stand Ihres Vorgangs
              jederzeit abrufen.
            </p>
          </CardBody>
        </Card>

        {result.notices.length > 0 && (
          <div className="mt-4 space-y-3">
            {result.notices.map((notice) => (
              <Alert key={notice} tone="warning">
                {notice}
              </Alert>
            ))}
          </div>
        )}

        <h2 className="mt-8 text-xl font-bold text-foreground">Wie es weitergeht</h2>
        <ol className="mt-4 space-y-3">
          {[
            'Wir prüfen Ihre Angaben und melden uns bei offenen Punkten.',
            'Gemeinsam legen wir fest, welches System zu Ihrem Objekt passt.',
            'Sie erhalten einen Entwurf des Schließplans zur Abstimmung.',
            'Erst nach Ihrer Freigabe wird die Anlage gefertigt.',
          ].map((text, index) => (
            <li key={text} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border font-display text-xs font-bold text-primary"
              >
                {index + 1}
              </span>
              <span className="text-[14px] leading-relaxed text-foreground-muted">{text}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground">Ihre Angaben</h2>
          <SummaryList sections={summary} className="mt-4" />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/service-und-termin/terminstatus">Stand des Vorgangs abrufen</ButtonLink>
          <ButtonLink href="/schliessanlagen" variant="outline">
            Zurück zu den Schließanlagen
          </ButtonLink>
        </div>
      </div>
    );
  }

  /* ---- Schrittinhalte --------------------------------------------------- */

  const stepId = flow.step?.id ?? 'kundentyp';

  return (
    <FlowShell
      flow={flow}
      title="Projektkonfigurator Schließanlage"
      submitLabel="Projekt absenden"
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint="Bitte füllen Sie die mit Stern gekennzeichneten Angaben aus."
    >
      {error && (
        <Alert tone="warning" title="Das Absenden hat nicht geklappt" className="mb-6">
          {error}
        </Alert>
      )}

      {/* 1 Kundentyp */}
      {stepId === 'kundentyp' && (
        <div className="grid gap-6">
          <Question title="Für wen planen wir die Anlage?"
            required>
            {CUSTOMER_TYPES.map((option) => (
              <OptionCard
                key={option.value}
                name="kundentyp"
                value={option.value}
                checked={d.customerType === option.value}
                onSelect={(value) =>
                  flow.set('customerType', value as ProjectData['customerType'])
                }
                title={option.title}
                description={option.body}
              />
            ))}
          </Question>

          <Field
            label="Name der Organisation"
            hint="Nur ausfüllen, wenn die Anlage nicht privat genutzt wird."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={d.organisation}
                onChange={(e) => flow.set('organisation', e.target.value)}
                autoComplete="organization"
              />
            )}
          </Field>
        </div>
      )}

      {/* 2 Objekt */}
      {stepId === 'objekt' && (
        <div className="grid gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Anzahl Gebäude"
                    required>
              {({ id }) => (
                <QuantityInput
                  id={id}
                  label="Anzahl Gebäude"
                  value={d.buildings}
                  min={1}
                  max={200}
                  onChange={(value) => flow.set('buildings', value)}
                />
              )}
            </Field>

            <Field
              label="Anzahl Liegenschaften"
              required
              info={HINT_PROPERTIES}
              hint="Bei einem Haus mit Garage auf demselben Grundstück: 1."
            >
              {({ id }) => (
                <QuantityInput
                  id={id}
                  label="Anzahl Liegenschaften"
                  value={d.properties}
                  min={1}
                  max={200}
                  onChange={(value) => flow.set('properties', value)}
                />
              )}
            </Field>

            <Field label="Anzahl Bereiche" required info={HINT_AREAS}>
              {({ id }) => (
                <QuantityInput
                  id={id}
                  label="Anzahl Bereiche"
                  value={d.areas}
                  min={1}
                  max={500}
                  onChange={(value) => flow.set('areas', value)}
                />
              )}
            </Field>

            <Field
              label="Schließstellen insgesamt"
              required
              info={HINT_LOCK_POINTS}
              hint="Eine Schätzung genügt."
            >
              {({ id }) => (
                <QuantityInput
                  id={id}
                  label="Anzahl Schließstellen"
                  value={d.lockPoints}
                  min={1}
                  max={2000}
                  onChange={(value) => flow.set('lockPoints', value)}
                />
              )}
            </Field>
          </div>

          <Field
            label="Besonderheiten am Objekt"
            hint="Zum Beispiel Nebengebäude, Außentore, Tiefgarage, Aufzug, Technikräume."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={d.objectNote}
                onChange={(e) => flow.set('objectNote', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {/* 3 Nutzer */}
      {stepId === 'nutzer' && (
        <div className="grid gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nutzer insgesamt" required hint="Alle Personen, die regelmäßig hineinkommen.">
              {({ id }) => (
                <QuantityInput
                  id={id}
                  label="Anzahl Nutzer"
                  value={d.userCount}
                  min={1}
                  max={5000}
                  onChange={(value) => flow.set('userCount', value)}
                />
              )}
            </Field>

            <Field
              label="Schlüsselinhaber"
              required
              hint="Personen, die einen eigenen Schlüssel bekommen sollen."
            >
              {({ id }) => (
                <QuantityInput
                  id={id}
                  label="Anzahl Schlüsselinhaber"
                  value={d.keyHolders}
                  min={1}
                  max={5000}
                  onChange={(value) => flow.set('keyHolders', value)}
                />
              )}
            </Field>
          </div>

          <Field
            label="Rollen und Abteilungen"
            hint="Zum Beispiel: Leitung, Büro, Werkstatt, Reinigung, Hausmeister, Mieter."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={d.rolesNote}
                onChange={(e) => flow.set('rolesNote', e.target.value)}
              />
            )}
          </Field>

          <Question
            title="Sollen unterschiedliche Personen unterschiedliche Türen öffnen?"
            required
            info={HINT_DIFFERENT_RIGHTS}
            hint="Diese Angabe entscheidet, ob wir Berechtigungsstufen planen müssen."
          >
            <OptionCard
              name="rechte"
              value="ja"
              checked={d.differentRights === 'ja'}
              onSelect={() => flow.set('differentRights', 'ja')}
              title="Ja, nicht jeder soll jede Tür öffnen"
              description="Zum Beispiel: Mieter nur die eigene Wohnung, Reinigung nur bestimmte Räume."
            />
            <OptionCard
              name="rechte"
              value="nein"
              checked={d.differentRights === 'nein'}
              onSelect={() => flow.set('differentRights', 'nein')}
              title="Nein, alle Schlüssel sollen alle Türen öffnen"
              description="Dann entfällt der Block zu den Berechtigungen — eine Gleichschließung genügt."
            />
          </Question>
        </div>
      )}

      {/* 4 Bestehende Anlage */}
      {stepId === 'bestand' && (
        <div className="grid gap-6">
          <Question title="Gibt es bereits eine Schließanlage?"
            required>
            <OptionCard
              name="bestand"
              value="nein"
              checked={d.hasExisting === 'nein'}
              onSelect={() => flow.set('hasExisting', 'nein')}
              title="Nein, wir fangen neu an"
            />
            <OptionCard
              name="bestand"
              value="ja"
              checked={d.hasExisting === 'ja'}
              onSelect={() => flow.set('hasExisting', 'ja')}
              title="Ja, eine Anlage ist vorhanden"
              description="Dann prüfen wir zuerst, ob sich die vorhandene Anlage erweitern lässt."
            />
            <OptionCard
              name="bestand"
              value="unbekannt"
              checked={d.hasExisting === 'unbekannt'}
              onSelect={() => flow.set('hasExisting', 'unbekannt')}
              title="Das ist mir nicht bekannt"
            />
          </Question>

          {d.hasExisting === 'ja' && (
            <div className="grid gap-6 rounded-lg border border-border bg-surface-muted p-4 md:p-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Hersteller"
                  hint="Steht oft seitlich auf dem Schlüssel oder auf dem Zylinder."
                >
                  {({ id, describedBy }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      value={d.existingManufacturer}
                      onChange={(e) => flow.set('existingManufacturer', e.target.value)}
                    />
                  )}
                </Field>

                <Field
                  label="System oder Anlagennummer"
                  hint="Falls bekannt — sonst leer lassen."
                >
                  {({ id, describedBy }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      value={d.existingSystem}
                      onChange={(e) => flow.set('existingSystem', e.target.value)}
                    />
                  )}
                </Field>
              </div>

              <Question title="Ist eine Sicherungskarte vorhanden?" required info={HINT_SECURITY_CARD}>
                <OptionCard
                  name="sicherungskarte"
                  value="ja"
                  checked={d.securityCard === 'ja'}
                  onSelect={() => flow.set('securityCard', 'ja')}
                  title="Ja, die Karte liegt vor"
                />
                <OptionCard
                  name="sicherungskarte"
                  value="nein"
                  checked={d.securityCard === 'nein'}
                  onSelect={() => flow.set('securityCard', 'nein')}
                  title="Nein, sie ist nicht vorhanden"
                />
                <OptionCard
                  name="sicherungskarte"
                  value="unbekannt"
                  checked={d.securityCard === 'unbekannt'}
                  onSelect={() => flow.set('securityCard', 'unbekannt')}
                  title="Nicht bekannt"
                />
              </Question>

              <PhotoUpload
                id="bestand-plan"
                label="Fotos oder vorhandener Schließplan"
                description="Fotos der Schlüssel und Zylinder, die Sicherungskarte oder ein vorhandener Schließplan. Freiwillig."
                example={{
                  motif: 'Beispielfoto: Schlüsselkopf mit lesbarer Prägung, scharf und gerade aufgenommen',
                  ratio: '1/1',
                }}
                files={planFiles}
                onChange={setPlanFiles}
                multiple
                maxFiles={6}
                allowDocuments
              />
            </div>
          )}
        </div>
      )}

      {/* 5 Erweiterung */}
      {stepId === 'erweiterung' && (
        <div className="grid gap-6">
          <Question
            title="Was soll später ergänzt werden können?"
            info={HINT_EXPANSION}
            hint="Mehrfachauswahl möglich. Nichts auswählen ist auch eine Antwort."
          >
            <OptionCard
              name="erweiterung-tueren"
              value="tueren"
              multiple
              checked={d.expandDoors}
              onSelect={() => flow.set('expandDoors', !d.expandDoors)}
              title="Weitere Türen"
              description="Anbau, Umbau, zusätzliche Nebenräume oder Außenanlagen."
            />
            <OptionCard
              name="erweiterung-nutzer"
              value="nutzer"
              multiple
              checked={d.expandUsers}
              onSelect={() => flow.set('expandUsers', !d.expandUsers)}
              title="Weitere Nutzer"
              description="Neue Mitarbeitende, Mietparteien oder Dienstleister."
            />
            <OptionCard
              name="erweiterung-immobilien"
              value="immobilien"
              multiple
              checked={d.expandProperties}
              onSelect={() => flow.set('expandProperties', !d.expandProperties)}
              title="Weitere Immobilien"
              description="Zusätzliche Gebäude oder Standorte in derselben Anlage."
            />
          </Question>

          <Question title="Wie sicher ist diese Erweiterung?"
            required>
            {(['keine', 'absehbar', 'wahrscheinlich', 'offen'] as const).map((value) => (
              <OptionCard
                key={value}
                name="horizont"
                value={value}
                checked={d.expansionHorizon === value}
                onSelect={() => flow.set('expansionHorizon', value)}
                title={HORIZON_LABELS[value]}
              />
            ))}
          </Question>

          <Field
            label="Was ist konkret geplant?"
            hint="Zum Beispiel: Dachgeschoss wird ausgebaut, zweiter Standort ab kommendem Jahr."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={d.expansionNote}
                onChange={(e) => flow.set('expansionNote', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {/* 6 Türen */}
      {stepId === 'tueren' && (
        <div className="grid gap-5">
          <Alert tone="info" title="So füllen Sie die Liste aus">
            Geben Sie jeder Tür eine Bezeichnung, die Sie selbst wiedererkennen — zum Beispiel
            „Haustür“, „Büro 1. OG“ oder „Lager hinten“. Zylindertyp und Maß dürfen offen bleiben,
            wenn Sie noch nicht gemessen haben.
          </Alert>

          <ul className="grid gap-4">
            {d.doors.map((door, index) => (
              <ListRow
                key={door.uid}
                title={`Position ${index + 1}`}
                onRemove={() => removeDoor(door.uid)}
                removeLabel={door.label || `Position ${index + 1}`}
                canRemove={d.doors.length > 1}
              >
                <div className="grid gap-5">
                  <Field label="Bezeichnung der Tür"
                    required>
                    {({ id, invalid }) => (
                      <TextInput
                        id={id}
                        invalid={invalid}
                        value={door.label}
                        placeholder="z. B. Haustür"
                        onChange={(e) => updateDoor(door.uid, { label: e.target.value })}
                      />
                    )}
                  </Field>

                  <Field
                    label="Zylindertyp"
                    info={
                      doorTypes.find((t) => t.id === door.type)?.info
                      ?? {
                        title: 'Zylindertyp',
                        body:
                          'Die Bauform bestimmt, wie die Tür von innen und außen bedient wird. '
                          + 'Wenn Sie unsicher sind, wählen Sie „Weiß ich nicht“ — wir klären das '
                          + 'anhand Ihrer Fotos oder vor Ort.',
                      }
                    }
                  >
                    {({ id }) => (
                      <Select
                        id={id}
                        value={door.type}
                        onChange={(e) => updateDoor(door.uid, { type: e.target.value })}
                      >
                        <option value="">Weiß ich nicht</option>
                        {doorTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Maß außen in mm"
                      info={measuringInfo}
                      hint="Von der Mitte der Stulpschraube nach außen."
                    >
                      {({ id, describedBy }) => (
                        <TextInput
                          id={id}
                          aria-describedby={describedBy}
                          inputMode="numeric"
                          value={door.measureA}
                          placeholder="z. B. 30"
                          onChange={(e) => updateDoor(door.uid, { measureA: e.target.value })}
                        />
                      )}
                    </Field>

                    <Field
                      label="Maß innen in mm"
                      hint="Von der Mitte der Stulpschraube nach innen."
                    >
                      {({ id, describedBy }) => (
                        <TextInput
                          id={id}
                          aria-describedby={describedBy}
                          inputMode="numeric"
                          value={door.measureB}
                          placeholder="z. B. 35"
                          onChange={(e) => updateDoor(door.uid, { measureB: e.target.value })}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Anzahl gleicher Türen"
                    required>
                      {({ id }) => (
                        <QuantityInput
                          id={id}
                          label={`Anzahl für Position ${index + 1}`}
                          value={door.qty}
                          min={1}
                          max={500}
                          onChange={(value) => updateDoor(door.uid, { qty: value })}
                        />
                      )}
                    </Field>

                    <Field label="Bemerkung" hint="Zum Beispiel Brandschutztür oder Panikfunktion.">
                      {({ id, describedBy }) => (
                        <TextInput
                          id={id}
                          aria-describedby={describedBy}
                          value={door.note}
                          onChange={(e) => updateDoor(door.uid, { note: e.target.value })}
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </ListRow>
            ))}
          </ul>

          <div>
            <Button variant="outline" size="lg" onClick={addDoor}>
              <Plus size={17} aria-hidden />
              Weitere Tür hinzufügen
            </Button>
          </div>
        </div>
      )}

      {/* 7 Berechtigungen */}
      {stepId === 'berechtigungen' && (
        <div className="grid gap-6">
          <Question
            title="Soll es einen Schlüssel geben, der alle Türen öffnet?"
            required
            info={HINT_MASTER_KEY}
          >
            {(['ja', 'nein', 'unklar'] as const).map((value) => (
              <OptionCard
                key={value}
                name="hauptschluessel"
                value={value}
                checked={d.masterKeyWanted === value}
                onSelect={() => flow.set('masterKeyWanted', value)}
                title={MASTER_LABELS[value]}
              />
            ))}
          </Question>

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Berechtigungsgruppen</h3>
              <InfoTip hint={HINT_GROUPS} />
            </div>
            <p className="mb-4 text-[13px] leading-snug text-foreground-subtle">
              Legen Sie je Gruppe fest, welche Türen sie öffnen soll. Die Bezeichnungen der Türen
              aus dem vorherigen Schritt dürfen Sie hier einfach übernehmen.
            </p>

            <ul className="grid gap-4">
              {d.groups.map((group, index) => (
                <ListRow
                  key={group.uid}
                  title={`Gruppe ${index + 1}`}
                  onRemove={() => removeGroup(group.uid)}
                  removeLabel={group.name || `Gruppe ${index + 1}`}
                  canRemove={d.groups.length > 1}
                >
                  <div className="grid gap-5">
                    <Field label="Bezeichnung der Gruppe"
                    required>
                      {({ id }) => (
                        <TextInput
                          id={id}
                          value={group.name}
                          placeholder="z. B. Werkstatt"
                          onChange={(e) => updateGroup(group.uid, { name: e.target.value })}
                        />
                      )}
                    </Field>

                    <Field
                      label="Diese Gruppe soll folgende Türen öffnen"
                      required
                      hint="Türen mit Komma trennen."
                    >
                      {({ id, describedBy }) => (
                        <TextArea
                          id={id}
                          aria-describedby={describedBy}
                          rows={3}
                          value={group.doors}
                          placeholder="z. B. Haustür, Werkstatt, Lager hinten"
                          onChange={(e) => updateGroup(group.uid, { doors: e.target.value })}
                        />
                      )}
                    </Field>

                    <Field label="Personen in dieser Gruppe">
                      {({ id }) => (
                        <QuantityInput
                          id={id}
                          label={`Personen in Gruppe ${index + 1}`}
                          value={group.people}
                          min={1}
                          max={2000}
                          onChange={(value) => updateGroup(group.uid, { people: value })}
                        />
                      )}
                    </Field>
                  </div>
                </ListRow>
              ))}
            </ul>

            <div className="mt-4">
              <Button variant="outline" size="lg" onClick={addGroup}>
                <Plus size={17} aria-hidden />
                Weitere Gruppe hinzufügen
              </Button>
            </div>
          </div>

          <Field
            label="Rangfolge zwischen den Gruppen"
            hint="Zum Beispiel: Die Leitung öffnet alles, die Haustechnik alles außer Büros."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={d.hierarchyNote}
                onChange={(e) => flow.set('hierarchyNote', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {/* 8 Schlüssel */}
      {stepId === 'schluessel' && (
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              Wie viele Schlüssel werden gebraucht?
            </p>
            <InfoTip hint={HINT_KEYS} />
          </div>

          <ul className="grid gap-4">
            {d.keys.map((entry, index) => (
              <ListRow
                key={entry.uid}
                title={`Schlüssel ${index + 1}`}
                onRemove={() => removeKey(entry.uid)}
                removeLabel={entry.holder || `Schlüssel ${index + 1}`}
                canRemove={d.keys.length > 1}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Person, Rolle oder Gruppe"
                    required>
                    {({ id }) => (
                      <TextInput
                        id={id}
                        value={entry.holder}
                        placeholder="z. B. Hausmeister"
                        onChange={(e) => updateKey(entry.uid, { holder: e.target.value })}
                      />
                    )}
                  </Field>

                  <Field label="Anzahl Schlüssel"
                    required>
                    {({ id }) => (
                      <QuantityInput
                        id={id}
                        label={`Anzahl Schlüssel für Position ${index + 1}`}
                        value={entry.count}
                        min={1}
                        max={2000}
                        onChange={(value) => updateKey(entry.uid, { count: value })}
                      />
                    )}
                  </Field>
                </div>
              </ListRow>
            ))}
          </ul>

          <div>
            <Button variant="outline" size="lg" onClick={addKey}>
              <Plus size={17} aria-hidden />
              Weitere Zeile hinzufügen
            </Button>
          </div>

          <p className="text-[14px] text-foreground-muted">
            Geplante Schlüssel insgesamt:{' '}
            <strong className="font-bold text-foreground">
              {formatNumber(d.keys.reduce((sum, entry) => sum + entry.count, 0))}
            </strong>
          </p>

          <Field
            label="Hinweise zu den Schlüsseln"
            hint="Zum Beispiel Reserveschlüssel, Schlüssel für Vertretungen oder für den Notfall."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={d.keyNote}
                onChange={(e) => flow.set('keyNote', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {/* 9 Dokumente */}
      {stepId === 'dokumente' && (
        <div className="grid gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Unterlagen zu Ihrem Objekt</p>
            <InfoTip hint={HINT_DOCUMENTS} />
          </div>

          <PhotoUpload
            id="projekt-dokumente"
            label="Türlisten, Grundrisse, Fotos und vorhandene Pläne"
            description="Bilder oder PDF-Dateien. Alles freiwillig — Sie können diesen Schritt auch überspringen."
            example={{
              motif: 'Beispielbild: Grundriss mit nummerierten Türen, gut lesbar abfotografiert',
              ratio: '4/3',
            }}
            files={docFiles}
            onChange={setDocFiles}
            multiple
            maxFiles={8}
            allowDocuments
          />

          <Alert tone="legal" title="Zu Ihren Dateien">
            Wir verwenden hochgeladene Unterlagen ausschließlich zur Bearbeitung Ihres Vorgangs.
            Wie lange sie aufbewahrt werden, steht in unserer Datenschutzerklärung.
          </Alert>
        </div>
      )}

      {/* 10 Service */}
      {stepId === 'service' && (
        <div className="grid gap-6">
          <Question title="Sollen wir die Montage übernehmen?"
            required>
            {(['ja', 'nein', 'unklar'] as const).map((value) => (
              <OptionCard
                key={value}
                name="montage"
                value={value}
                checked={d.installation === value}
                onSelect={() => flow.set('installation', value)}
                title={INSTALLATION_LABELS[value]}
              />
            ))}
          </Question>

          <Question title="Wie möchten Sie beraten werden?"
            required>
            {(['werkstatt', 'vor-ort', 'telefon', 'schriftlich'] as const).map((value) => (
              <OptionCard
                key={value}
                name="beratung"
                value={value}
                checked={d.consultation === value}
                onSelect={() => flow.set('consultation', value)}
                title={CONSULTATION_LABELS[value]}
              />
            ))}
          </Question>

          <Question
            title="In welchem Zeitraum soll das Projekt umgesetzt werden?"
            required
            hint="Ihre Wunschvorstellung. Den machbaren Zeitplan stimmen wir danach mit Ihnen ab."
          >
            {(['sofort', 'naechste-monate', 'laufendes-jahr', 'offen'] as const).map((value) => (
              <OptionCard
                key={value}
                name="zeitraum"
                value={value}
                checked={d.timeframe === value}
                onSelect={() => flow.set('timeframe', value)}
                title={TIMEFRAME_LABELS[value]}
              />
            ))}
          </Question>

          <Field
            label="Budgetrahmen"
            info={HINT_BUDGET}
            hint="Freiwillig. Frei formulierbar, zum Beispiel als Rahmen oder Obergrenze."
          >
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                value={d.budget}
                onChange={(e) => flow.set('budget', e.target.value)}
              />
            )}
          </Field>

          <Field
            label="Sonstige Hinweise"
            hint="Alles, was uns bei der Planung helfen könnte."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={d.serviceNote}
                onChange={(e) => flow.set('serviceNote', e.target.value)}
              />
            )}
          </Field>
        </div>
      )}

      {/* Abschluss */}
      {stepId === 'abschluss' && (
        <div className="grid gap-8">
          <Card variant="muted">
            <CardBody>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Vorschlag aus Ihren Angaben
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">
                Ihre Angaben sprechen für eine {recommendation.system}.
              </p>
              <ul className="mt-3 space-y-1.5">
                {recommendation.reasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex gap-2 text-[14px] leading-relaxed text-foreground-muted"
                  >
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {reason}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] leading-relaxed text-foreground-subtle">
                Das ist ein Vorschlag, keine Festlegung. Wir prüfen ihn im Beratungsgespräch
                gemeinsam mit Ihnen und ändern ihn, wenn Ihre Türen etwas anderes verlangen.
              </p>
              <Link
                href="/schliessanlagen#systeme"
                className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
              >
                Systeme noch einmal nachlesen
                <ArrowRight size={15} aria-hidden />
              </Link>
            </CardBody>
          </Card>

          <div>
            <h3 className="text-lg font-bold text-foreground">Ihre Kontaktdaten</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
              Wir brauchen sie, um Ihnen den Entwurf des Schließplans zu schicken.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Anrede">
                {({ id }) => (
                  <Select
                    id={id}
                    value={d.contact.salutation ?? ''}
                    onChange={(e) => setContact('salutation', e.target.value)}
                  >
                    <option value="">Keine Angabe</option>
                    <option value="Frau">Frau</option>
                    <option value="Herr">Herr</option>
                  </Select>
                )}
              </Field>

              <Field label="Firma oder Organisation">
                {({ id }) => (
                  <TextInput
                    id={id}
                    autoComplete="organization"
                    value={d.contact.company ?? ''}
                    onChange={(e) => setContact('company', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Vorname"
                    required>
                {({ id }) => (
                  <TextInput
                    id={id}
                    autoComplete="given-name"
                    value={d.contact.firstName}
                    onChange={(e) => setContact('firstName', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Nachname"
                    required>
                {({ id }) => (
                  <TextInput
                    id={id}
                    autoComplete="family-name"
                    value={d.contact.lastName}
                    onChange={(e) => setContact('lastName', e.target.value)}
                  />
                )}
              </Field>

              <Field label="E-Mail"
                    required>
                {({ id }) => (
                  <TextInput
                    id={id}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={d.contact.email}
                    onChange={(e) => setContact('email', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Telefon" required hint="Für kurze Rückfragen zum Schließplan.">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-describedby={describedBy}
                    value={d.contact.phone}
                    onChange={(e) => setContact('phone', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Straße und Hausnummer" className="sm:col-span-2">
                {({ id }) => (
                  <TextInput
                    id={id}
                    autoComplete="street-address"
                    value={d.contact.street ?? ''}
                    onChange={(e) => setContact('street', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Postleitzahl">
                {({ id }) => (
                  <TextInput
                    id={id}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    value={d.contact.postalCode ?? ''}
                    onChange={(e) => setContact('postalCode', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Ort">
                {({ id }) => (
                  <TextInput
                    id={id}
                    autoComplete="address-level2"
                    value={d.contact.city ?? ''}
                    onChange={(e) => setContact('city', e.target.value)}
                  />
                )}
              </Field>

              <Field label="Land" className="sm:col-span-2">
                {({ id }) => (
                  <TextInput
                    id={id}
                    autoComplete="country-name"
                    value={d.contact.country}
                    onChange={(e) => setContact('country', e.target.value)}
                  />
                )}
              </Field>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground">Ihre Angaben im Überblick</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
              Bitte prüfen Sie alles in Ruhe. Über die Schrittanzeige oben kommen Sie zu jedem
              Block zurück.
            </p>
            <SummaryList sections={summary} className="mt-5" />
          </div>

          <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
            <input
              type="checkbox"
              checked={d.consent}
              onChange={(e) => flow.set('consent', e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-border-strong"
            />
            <span className="text-[14px] leading-relaxed text-foreground-muted">
              Ich habe die{' '}
              <Link href="/rechtliches/datenschutz" className="font-semibold text-primary hover:underline">
                Datenschutzerklärung
              </Link>{' '}
              gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung dieses
              Projekts verarbeitet werden.
              <span className="ml-1 text-danger" aria-hidden>
                *
              </span>
              <span className="sr-only"> (Pflichtangabe)</span>
            </span>
          </label>
        </div>
      )}
    </FlowShell>
  );
}
