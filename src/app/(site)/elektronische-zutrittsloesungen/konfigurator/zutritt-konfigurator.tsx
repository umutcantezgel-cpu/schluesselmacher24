'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';

import { submitRecord } from '@/lib/actions/records';
import { clearFlow, useFlow, type FlowStep } from '@/lib/flow/use-flow';
import { scrollVerhalten } from '@/lib/bewegung';
import type { InfoHint, SummarySection, UploadRef } from '@/lib/types';
import { aktionMelden } from '@/lib/statistik';
import { Alert } from '@/components/ui/alert';
import { FlowShell } from '@/components/flow/flow-shell';
import { useFormularSchutz } from '@/components/forms/formular-schutz';
import { AnfrageHinweis } from '@/components/recht/anfrage-hinweis';
import { Field } from '@/components/forms/field';
import { AbsendeFehler, HilfeBlock } from '@/components/forms/hilfe';
import type { HilfeKontakt } from '@/components/forms/hilfe-daten';
import { Select, TextArea, TextInput } from '@/components/forms/controls';
import { OptionCard } from '@/components/forms/option-card';
import { PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile } from '@/components/forms/photo-upload';
import { SummaryList } from '@/components/layout/summary-list';
import { WegBestaetigung } from '@/components/weg/bestaetigung';
import { SCHRITTE_ZUTRITT } from '@/lib/wege/naechste-schritte-listen';

/* ==========================================================================
   Zutrittskonfigurator — acht Abfragen, ein freiwilliger Schritt für Grundriss
   und Fotos (FA-27-10), danach Zusammenfassung.
   Erfasst wird ausschließlich der Bedarf. Preise, Systeme und Produkte
   werden hier bewusst nicht genannt; sie gehören ins spätere Angebot.
   ========================================================================== */

const FLOW_ID = 'zutritt-konfigurator';
const FLOW_VERSION = 1;

interface Choice {
  id: string;
  title: string;
  description?: string;
  info?: InfoHint;
}

/* ---------- 1 Objekt ----------------------------------------------------- */

const OBJEKT: Choice[] = [
  {
    id: 'privat',
    title: 'Privates Wohnobjekt',
    description: 'Haus oder Wohnung mit festem Nutzerkreis.',
  },
  {
    id: 'buero',
    title: 'Büro',
    description: 'Verwaltung, Kanzlei, Agentur oder ähnliche Büronutzung.',
  },
  {
    id: 'praxis',
    title: 'Praxis',
    description: 'Räume mit Publikumsverkehr und getrennten Innenbereichen.',
    info: {
      title: 'Warum Praxen gesondert betrachtet werden',
      body:
        'In Praxen liegen Empfang, Behandlungsräume und Bereiche mit besonders schützenswerten '
        + 'Unterlagen dicht beieinander. Häufig sollen nicht alle Beschäftigten überall hinein. '
        + 'Das lässt sich über Gruppen sauber trennen.',
    },
  },
  {
    id: 'gewerbe',
    title: 'Gewerbe',
    description: 'Werkstatt, Lager, Produktion oder Handel.',
  },
  {
    id: 'hausverwaltung',
    title: 'Hausverwaltung',
    description: 'Mehrparteienhaus oder Mietobjekt mit wechselnden Parteien.',
    info: {
      title: 'Besonderheit bei Mietobjekten',
      body:
        'Bei Mieterwechseln ist der Umgang mit Medien entscheidend: Elektronisch wird das alte '
        + 'Medium gesperrt und ein neues ausgegeben, ohne Zylinder zu tauschen. Gemeinschaftstüren '
        + 'wie Haus- und Kellereingang und die Wohnungstüren werden dabei getrennt betrachtet.',
    },
  },
  {
    id: 'mehrere-standorte',
    title: 'Mehrere Standorte',
    description: 'Ein Betrieb mit mehreren Liegenschaften oder Filialen.',
    info: {
      title: 'Mehrere Standorte gemeinsam verwalten',
      body:
        'Sollen Personen an mehreren Standorten mit demselben Medium hineinkommen, muss das von '
        + 'Beginn an geplant werden. Nachträglich getrennte Anlagen zusammenzuführen ist deutlich '
        + 'aufwendiger.',
    },
  },
];

/* ---------- 2 Umfang ----------------------------------------------------- */

const TUEREN_INFO: InfoHint = {
  title: 'Was zählt als Tür?',
  body:
    'Gezählt wird jede Tür, die später ein Medium erkennen soll — Hauseingang, Nebeneingang, '
    + 'Büro, Technik- und Lagerraum. Türen, die mechanisch bleiben sollen, zählen hier nicht mit; '
    + 'die erfassen wir in Abfrage 7.',
};

const NUTZER_INFO: InfoHint = {
  title: 'Wer zählt als Nutzer?',
  body:
    'Jede Person, die eine eigene Berechtigung erhält — also ein eigenes Medium oder einen '
    + 'eigenen PIN. Ein gemeinsamer Code für eine ganze Gruppe zählt als eine Berechtigung, ist '
    + 'aber bei Personalwechsel weniger flexibel.',
};

const TUEREN: Choice[] = [
  { id: '1', title: 'Eine Tür' },
  { id: '2-5', title: '2 bis 5 Türen' },
  { id: '6-15', title: '6 bis 15 Türen' },
  { id: '16-40', title: '16 bis 40 Türen' },
  { id: 'mehr-40', title: 'Mehr als 40 Türen' },
  { id: 'unklar', title: 'Noch nicht bekannt' },
];

const NUTZER: Choice[] = [
  { id: 'bis-5', title: 'Bis 5 Personen' },
  { id: '6-20', title: '6 bis 20 Personen' },
  { id: '21-50', title: '21 bis 50 Personen' },
  { id: '51-200', title: '51 bis 200 Personen' },
  { id: 'mehr-200', title: 'Mehr als 200 Personen' },
  { id: 'unklar', title: 'Noch nicht bekannt' },
];

/* ---------- 2b Erweiterbarkeit ------------------------------------------- */

const ERWEITERUNG_INFO: InfoHint = {
  title: 'Warum wir nach später fragen',
  body:
    'Wie viele Türen und Nutzer ein System verwalten kann, hängt von seiner Auslegung ab. '
    + 'Wer spätere Ergänzungen früh nennt, bekommt eine Anlage, die mitwachsen kann, statt sie '
    + 'später umbauen zu müssen.',
};

const ERWEITERUNG: Choice[] = [
  { id: 'keine', title: 'Nein, der Umfang bleibt so' },
  { id: 'tueren', title: 'Ja, weitere Türen' },
  { id: 'nutzer', title: 'Ja, weitere Nutzer' },
  { id: 'beides', title: 'Ja, weitere Türen und Nutzer' },
  { id: 'unklar', title: 'Noch nicht absehbar' },
];

/** Nur bei einem klaren Ja fragt der Konfigurator nach dem ungefähren Zuwachs. */
export function fragtZuwachs(erweiterung: string): boolean {
  return ['tueren', 'nutzer', 'beides'].includes(erweiterung);
}

/* ---------- 3 Identmedium ------------------------------------------------ */

const MEDIEN: Choice[] = [
  {
    id: 'karte',
    title: 'Zutrittskarte',
    description: 'Karte im Scheckkartenformat, passt ins Portemonnaie.',
    info: {
      title: 'Zutrittskarte',
      body:
        'Unabhängig von Strom und Mobilfunk, für alle Nutzergruppen gleich bedienbar und einfach '
        + 'zu beschriften. Eine Karte kann verloren gehen — sie wird dann gesperrt und ersetzt.',
    },
  },
  {
    id: 'transponder',
    title: 'Transponder oder Schlüsselanhänger',
    description: 'Kleines Medium am Schlüsselbund.',
    info: {
      title: 'Transponder',
      body:
        'Funktioniert wie die Karte, ist aber robuster und bleibt am Schlüsselbund. Sinnvoll, wenn '
        + 'zusätzlich noch mechanische Schlüssel mitgeführt werden.',
    },
  },
  {
    id: 'smartphone',
    title: 'Smartphone und App',
    description: 'Berechtigung auf dem Mobiltelefon.',
    info: {
      title: 'Smartphone',
      body:
        'Spart die Übergabe eines Gegenstands und ist für kurzfristige Berechtigungen praktisch. '
        + 'Setzt voraus, dass alle Beteiligten ein geeignetes Gerät besitzen und es nutzen wollen. '
        + 'Wird deshalb meist zusätzlich zu Karte oder Transponder geführt.',
    },
  },
  {
    id: 'pin',
    title: 'PIN-Code an einer Tastatur',
    description: 'Zutritt über eine Zahlenkombination.',
    info: {
      title: 'PIN-Code',
      body:
        'Es muss nichts mitgeführt werden. Dafür muss der Code vertraulich bleiben: Wird er '
        + 'weitergegeben, lässt sich später nicht mehr nachvollziehen, wer ihn kennt. Codes je '
        + 'Person oder Gruppe zu vergeben, erleichtert den Wechsel.',
    },
  },
  {
    id: 'offen',
    title: 'Noch offen — bitte beraten',
    description: 'Wir schlagen ein passendes Medium vor.',
  },
];

/* ---------- 4 Verwaltung ------------------------------------------------- */

const VERWALTUNG: Choice[] = [
  {
    id: 'lokal',
    title: 'Lokal verwaltet',
    description: 'Änderungen werden direkt an der Tür eingespielt.',
    info: {
      title: 'Lokal verwaltete Systeme',
      body:
        'Berechtigungen werden mit einem Programmiergerät oder einem Mastermedium an die jeweilige '
        + 'Tür gebracht. Vorteil: unabhängig von Netz und laufender Verbindung, technisch einfach. '
        + 'Nachteil: Bei jeder Änderung muss jemand zu den betroffenen Türen gehen — bei vielen '
        + 'Türen wird das aufwendig.',
    },
  },
  {
    id: 'online',
    title: 'Online verwaltet',
    description: 'Änderungen und Sperren wirken ohne Gang zur Tür.',
    info: {
      title: 'Online verwaltete Systeme',
      body:
        'Die Türen sind mit einer Verwaltungsstelle verbunden. Vorteil: Sperren wirken unmittelbar, '
        + 'Änderungen sind auch bei vielen Türen schnell erledigt. Nachteil: Es braucht eine '
        + 'Verbindung und eine laufende Betreuung des Systems.',
    },
  },
  {
    id: 'offen',
    title: 'Noch offen — bitte beraten',
    description: 'Wir empfehlen anhand von Türanzahl und Änderungsrhythmus.',
  },
];

/* ---------- 5 Berechtigungen --------------------------------------------- */

const BERECHTIGUNGEN: Choice[] = [
  {
    id: 'zeitlich-begrenzt',
    title: 'Zeitlich begrenzte Berechtigungen',
    description: 'Gültig ab einem Datum und bis zu einem Datum.',
    info: {
      title: 'Zeitlich begrenzt',
      body:
        'Die Berechtigung läuft von selbst ab — etwa für Handwerk, Reinigung oder befristete '
        + 'Verträge. So bleiben keine alten Berechtigungen unbemerkt bestehen.',
    },
  },
  {
    id: 'gruppen',
    title: 'Berechtigungsgruppen',
    description: 'Rechte werden an der Gruppe gepflegt, nicht je Person.',
    info: {
      title: 'Gruppen statt Einzelrechte',
      body:
        'Personen mit gleichen Aufgaben werden zusammengefasst — etwa Verwaltung, Werkstatt, '
        + 'Reinigung. Neue Personen übernehmen die Rechte ihrer Gruppe, Änderungen wirken auf alle '
        + 'Mitglieder. Ab etwa zehn Nutzern spart das spürbar Aufwand.',
    },
  },
  {
    id: 'wochentage',
    title: 'Berechtigungen nach Wochentag',
    description: 'Zutritt nur an bestimmten Tagen.',
    info: {
      title: 'Nach Wochentag',
      body:
        'Zum Beispiel Reinigung nur dienstags und donnerstags. Feiertage und Ausnahmen sind je '
        + 'nach System gesondert zu pflegen — das klären wir vor der Einrichtung.',
    },
  },
  {
    id: 'uhrzeiten',
    title: 'Berechtigungen nach Uhrzeit',
    description: 'Zutritt nur innerhalb bestimmter Zeitfenster.',
    info: {
      title: 'Nach Uhrzeit',
      body:
        'Ein Medium öffnet nur innerhalb des hinterlegten Zeitfensters, etwa werktags zwischen '
        + 'Öffnung und Schließung. Zeitfenster können je Tür und je Gruppe unterschiedlich sein.',
    },
  },
  {
    id: 'keine',
    title: 'Keine Einschränkungen nötig',
    description: 'Alle berechtigten Personen dürfen jederzeit überall hinein.',
  },
];

/* ---------- 6 Standorte -------------------------------------------------- */

const STANDORTE: Choice[] = [
  {
    id: 'ein-objekt',
    title: 'Ein Objekt',
    description: 'Alle Türen befinden sich an einer Adresse.',
  },
  {
    id: 'mehrere',
    title: 'Mehrere Liegenschaften',
    description: 'Türen verteilen sich auf mehrere Adressen.',
    info: {
      title: 'Mehrere Liegenschaften',
      body:
        'Wichtig ist die Frage, ob dieselben Personen an mehreren Standorten hineinkommen sollen. '
        + 'Ist das der Fall, wird die Anlage von Beginn an gemeinsam aufgebaut. Sollen die '
        + 'Standorte getrennt bleiben, planen wir sie als eigenständige Einheiten.',
    },
  },
];

/* ---------- 7 Integration ------------------------------------------------ */

const INTEGRATION: Choice[] = [
  {
    id: 'ja',
    title: 'Ja, vorhandene mechanische Anlage einbinden',
    description: 'Mechanik bleibt teilweise bestehen und wird mitgeplant.',
    info: {
      title: 'Was Einbindung bedeutet',
      body:
        'Elektronisch werden nur die Türen ausgestattet, an denen sich der Nutzerkreis ändert. '
        + 'Alle übrigen Türen bleiben mechanisch. Beide Teile werden gemeinsam geplant, damit die '
        + 'Übersicht stimmig bleibt und Personen nicht doppelt ausgestattet werden müssen.',
    },
  },
  {
    id: 'nein',
    title: 'Nein, rein elektronische Lösung',
    description: 'Die betroffenen Türen werden vollständig elektronisch ausgestattet.',
  },
  {
    id: 'unklar',
    title: 'Noch unklar',
    description: 'Wir sehen uns den Bestand an und schlagen etwas vor.',
  },
];

/* ---------- 8 Service ---------------------------------------------------- */

const SERVICE: Choice[] = [
  {
    id: 'montage',
    title: 'Montage vor Ort',
    description: 'Einbau der Zylinder, Beschläge und Leser durch uns.',
    info: {
      title: 'Montage',
      body:
        'Wir bauen die Komponenten ein und prüfen, ob die Türen sauber schließen. Bei Brand- und '
        + 'Fluchttüren gelten besondere Anforderungen an die Ausführung; das sehen wir uns vorab an.',
    },
  },
  {
    id: 'einrichtung',
    title: 'Einrichtung des Systems',
    description: 'Anlegen von Nutzern, Gruppen, Türen und Zeitfenstern.',
    info: {
      title: 'Einrichtung',
      body:
        'Wir legen die Struktur gemeinsam mit Ihnen an: welche Gruppen es gibt, welche Türen dazu '
        + 'gehören und welche Zeitfenster gelten. Danach übergeben wir die Verwaltung an Sie.',
    },
  },
  {
    id: 'einweisung',
    title: 'Einweisung vor Ort',
    description: 'Wir zeigen der verantwortlichen Person die Bedienung.',
    info: {
      title: 'Einweisung',
      body:
        'Die Person, die später Medien ausgibt und sperrt, sollte den Ablauf einmal selbst '
        + 'durchgeführt haben — Medium anlegen, Rechte vergeben, Medium sperren, Ersatz ausgeben.',
    },
  },
  {
    id: 'keine',
    title: 'Kein Service nötig',
    description: 'Einbau und Einrichtung übernehmen Sie selbst.',
  },
];

/* ---------- Schritte ----------------------------------------------------- */

const STEPS: FlowStep[] = [
  {
    id: 'objekt',
    short: 'Objekt',
    title: '1. Um welches Objekt geht es?',
    hint: 'Die Objektart bestimmt, welche Fragen später wichtig werden.',
  },
  {
    id: 'umfang',
    short: 'Umfang',
    title: '2. Wie groß ist der Umfang?',
    hint: 'Anzahl der Türen und der Personen, die eine Berechtigung erhalten sollen.',
  },
  {
    id: 'medien',
    short: 'Medium',
    title: '3. Womit soll geöffnet werden?',
    hint: 'Mehrfachauswahl möglich — daraus wird eine Kombination mehrerer Medien.',
  },
  {
    id: 'verwaltung',
    short: 'Verwaltung',
    title: '4. Wie soll die Anlage verwaltet werden?',
    hint: 'Die Verwaltungsart entscheidet darüber, wie viel Aufwand spätere Änderungen machen.',
  },
  {
    id: 'berechtigungen',
    short: 'Rechte',
    title: '5. Welche Berechtigungen brauchen Sie?',
    hint: 'Mehrfachauswahl möglich. Was Sie hier nicht brauchen, lassen Sie weg.',
  },
  {
    id: 'standorte',
    short: 'Standorte',
    title: '6. Ein Objekt oder mehrere Liegenschaften?',
    hint: 'Das entscheidet, ob die Anlage von Beginn an standortübergreifend aufgebaut wird.',
  },
  {
    id: 'integration',
    short: 'Integration',
    title: '7. Soll vorhandene Mechanik eingebunden werden?',
    hint: 'In vielen Objekten bleibt ein Teil der Türen bewusst mechanisch.',
  },
  {
    id: 'service',
    short: 'Service',
    title: '8. Welchen Service wünschen Sie?',
    hint: 'Mehrfachauswahl möglich.',
  },
  {
    id: 'unterlagen',
    short: 'Unterlagen',
    title: '9. Grundriss und Fotos hochladen',
    hint: 'Freiwillig, aber hilfreich: Mit Grundriss und Fotos der Türen können wir die Türsituation genauer einschätzen.',
  },
  {
    id: 'zusammenfassung',
    short: 'Absenden',
    title: 'Zusammenfassung und Kontakt',
    hint: 'Bitte prüfen Sie Ihre Angaben und ergänzen Sie, wie wir Sie erreichen.',
  },
];

/* ---------- Daten -------------------------------------------------------- */

export interface ZutrittData {
  objekt: string;
  tueren: string;
  nutzer: string;
  umfangNotiz: string;
  /** Spätere Erweiterung (FA-17-18): ob Türen oder Nutzer hinzukommen sollen. */
  erweiterung: string;
  /** Ungefährer Zuwachs, freiwillig. */
  erweiterungUmfang: string;
  medien: string[];
  verwaltung: string;
  berechtigungen: string[];
  standorte: string;
  standorteNotiz: string;
  integration: string;
  integrationNotiz: string;
  service: string[];
  serviceNotiz: string;
  anrede: string;
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  plz: string;
  ort: string;
  nachricht: string;
}

export const INITIAL: ZutrittData = {
  objekt: '',
  tueren: '',
  nutzer: '',
  umfangNotiz: '',
  erweiterung: '',
  erweiterungUmfang: '',
  medien: [],
  verwaltung: '',
  berechtigungen: [],
  standorte: '',
  standorteNotiz: '',
  integration: '',
  integrationNotiz: '',
  service: [],
  serviceNotiz: '',
  anrede: '',
  vorname: '',
  nachname: '',
  firma: '',
  email: '',
  telefon: '',
  plz: '',
  ort: '',
  nachricht: '',
};

/** Auswahlmöglichkeiten, die jede andere Auswahl ausschließen. */
const EXCLUSIVE = new Set(['offen', 'keine']);

function toggleMulti(current: string[], value: string): string[] {
  if (EXCLUSIVE.has(value)) {
    return current.includes(value) ? [] : [value];
  }
  const withoutExclusive = current.filter((id) => !EXCLUSIVE.has(id));
  return withoutExclusive.includes(value)
    ? withoutExclusive.filter((id) => id !== value)
    : [...withoutExclusive, value];
}

function labelOf(choices: Choice[], id: string): string {
  return choices.find((c) => c.id === id)?.title ?? 'Keine Angabe';
}

function labelsOf(choices: Choice[], ids: string[]): string {
  if (ids.length === 0) return 'Keine Angabe';
  return ids.map((id) => labelOf(choices, id)).join(', ');
}

function optionalRow(label: string, value: string) {
  const trimmed = value.trim();
  return trimmed ? [{ label, value: trimmed }] : [];
}

/** Nutzlast des Vorgangs: abhängige Felder nur, wenn ihre Frage gestellt wurde. */
export function buildPayload(data: ZutrittData): ZutrittData {
  return fragtZuwachs(data.erweiterung) ? { ...data } : { ...data, erweiterungUmfang: '' };
}

/** Anzahl der gewählten Dateien im Schritt „Unterlagen“ (FA-27-10). */
export interface ZutrittDateien {
  grundriss: number;
  fotos: number;
}

const KEINE_DATEIEN: ZutrittDateien = { grundriss: 0, fotos: 0 };

function dateienText(anzahl: number, ohne: string): string {
  if (anzahl <= 0) return ohne;
  return anzahl === 1 ? '1 Datei' : `${anzahl} Dateien`;
}

/** Die acht Abfragen und die Unterlagen als strukturierte Zusammenfassung. */
export function buildAnswerSummary(data: ZutrittData, dateien: ZutrittDateien = KEINE_DATEIEN): SummarySection[] {
  return [
    {
      title: '1. Objekt',
      rows: [{ label: 'Art des Objekts', value: labelOf(OBJEKT, data.objekt) }],
    },
    {
      title: '2. Umfang',
      rows: [
        { label: 'Anzahl Türen', value: labelOf(TUEREN, data.tueren) },
        { label: 'Anzahl Nutzer', value: labelOf(NUTZER, data.nutzer) },
        ...optionalRow('Ergänzung', data.umfangNotiz),
        { label: 'Spätere Erweiterung', value: labelOf(ERWEITERUNG, data.erweiterung) },
        ...(fragtZuwachs(data.erweiterung)
          ? optionalRow('Ungefährer Zuwachs', data.erweiterungUmfang)
          : []),
      ],
    },
    {
      title: '3. Identmedium',
      rows: [{ label: 'Gewünschte Medien', value: labelsOf(MEDIEN, data.medien) }],
    },
    {
      title: '4. Verwaltung',
      rows: [{ label: 'Verwaltungsart', value: labelOf(VERWALTUNG, data.verwaltung) }],
    },
    {
      title: '5. Berechtigungen',
      rows: [{ label: 'Gewünschte Steuerung', value: labelsOf(BERECHTIGUNGEN, data.berechtigungen) }],
    },
    {
      title: '6. Standorte',
      rows: [
        { label: 'Verteilung', value: labelOf(STANDORTE, data.standorte) },
        ...optionalRow('Ergänzung', data.standorteNotiz),
      ],
    },
    {
      title: '7. Integration',
      rows: [
        { label: 'Vorhandene Mechanik', value: labelOf(INTEGRATION, data.integration) },
        ...optionalRow('Angaben zum Bestand', data.integrationNotiz),
      ],
    },
    {
      title: '8. Service',
      rows: [
        { label: 'Gewünschte Leistungen', value: labelsOf(SERVICE, data.service) },
        ...optionalRow('Ergänzung', data.serviceNotiz),
      ],
    },
    {
      title: '9. Unterlagen',
      rows: [
        { label: 'Grundriss', value: dateienText(dateien.grundriss, 'Nicht hochgeladen') },
        { label: 'Fotos von Türen und Bestand', value: dateienText(dateien.fotos, 'Nicht hochgeladen') },
      ],
    },
  ];
}

/**
 * Dateien für das Absenden: Grundriss als `grundriss`, Fotos als `objektfoto`. Ohne Steckplatz wie im
 * Sicherheitscheck; was gespeichert wird, ordnet der Server über Kennung und Einmal-Schlüssel zu.
 */
export function zutrittUploads(grundrisse: PickedFile[], fotos: PickedFile[]): Array<Omit<UploadRef, 'id' | 'uploadedAt'>> {
  return [
    ...grundrisse.map((file) => alsUpload(file, 'grundriss')),
    ...fotos.map((file) => alsUpload(file, 'objektfoto')),
  ];
}

function buildContactSummary(data: ZutrittData): SummarySection {
  const name = [data.anrede, data.vorname, data.nachname].filter(Boolean).join(' ').trim();
  return {
    title: 'Kontakt',
    rows: [
      { label: 'Name', value: name || 'Keine Angabe' },
      ...optionalRow('Firma', data.firma),
      { label: 'E-Mail', value: data.email.trim() },
      { label: 'Telefon', value: data.telefon.trim() },
      ...optionalRow('Ort', [data.plz.trim(), data.ort.trim()].filter(Boolean).join(' ')),
      ...optionalRow('Nachricht', data.nachricht),
    ],
  };
}

function isEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 4 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

export function validate(data: ZutrittData, stepId: string): boolean {
  switch (stepId) {
    case 'objekt':
      return data.objekt !== '';
    case 'umfang':
      return data.tueren !== '' && data.nutzer !== '' && data.erweiterung !== '';
    case 'medien':
      return data.medien.length > 0;
    case 'verwaltung':
      return data.verwaltung !== '';
    case 'berechtigungen':
      return data.berechtigungen.length > 0;
    case 'standorte':
      return data.standorte !== '';
    case 'integration':
      return data.integration !== '';
    case 'service':
      return data.service.length > 0;
    case 'zusammenfassung':
      return (
        data.vorname.trim().length > 1
        && data.nachname.trim().length > 1
        && isEmail(data.email)
        && data.telefon.trim().length > 4
      );
    default:
      return true;
  }
}

const BLOCKED_HINTS: Record<string, string> = {
  objekt: 'Bitte wählen Sie eine Objektart aus.',
  umfang: 'Bitte wählen Sie je einen Bereich für Türen und Nutzer und sagen Sie, ob später etwas hinzukommt.',
  medien: 'Bitte wählen Sie mindestens ein Medium aus.',
  verwaltung: 'Bitte wählen Sie eine Verwaltungsart aus.',
  berechtigungen: 'Bitte wählen Sie mindestens einen Punkt aus.',
  standorte: 'Bitte geben Sie an, ob es um ein oder mehrere Objekte geht.',
  integration: 'Bitte geben Sie an, ob vorhandene Mechanik eingebunden werden soll.',
  service: 'Bitte wählen Sie mindestens einen Punkt aus.',
  zusammenfassung: 'Bitte ergänzen Sie Name, E-Mail-Adresse und Telefonnummer.',
};

interface SubmitState {
  reference: string;
  notices: string[];
}

export interface ZutrittKonfiguratorProps {
  hilfe?: HilfeKontakt;
  /** Aufbewahrungsfristen aus den Einstellungen, in Tagen (wie im Sicherheitscheck). */
  retention: { floorPlans: number; objectPhotos: number };
}

export function ZutrittKonfigurator({ hilfe, retention }: ZutrittKonfiguratorProps) {
  const schutz = useFormularSchutz();
  // Dateien liegen nur im Browser-Zustand; die Rückfrage vor dem Verlassen nennt sie (mitDateien).
  const [grundrisse, setGrundrisse] = useState<PickedFile[]>([]);
  const [fotos, setFotos] = useState<PickedFile[]>([]);

  const flow = useFlow<ZutrittData>({
    id: FLOW_ID,
    steps: STEPS,
    initial: INITIAL,
    version: FLOW_VERSION,
    validate,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitState | null>(null);

  const { data, set } = flow;

  // Mehrfachauswahl: ausschließende Optionen wie "noch offen" leeren die übrigen.
  const toggle = useCallback(
    (key: 'medien' | 'berechtigungen' | 'service', value: string) => {
      set(key, toggleMulti(data[key], value));
    },
    [data, set],
  );

  const answerSummary = buildAnswerSummary(data, { grundriss: grundrisse.length, fotos: fotos.length });

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    // Ohne Verbindung bleibt es nicht beim drehenden Knopf: Meldung, Angaben bleiben (FA-QA-02).
    let response: Awaited<ReturnType<typeof submitRecord>>;
    try {
      // Laufende Uploads abschließen, damit ihre Kennungen mitgehen.
      await uploadsAbwarten();
      response = await submitRecord({
        schutz: await schutz.daten(),
        kind: 'projekt',
        area: 'elektronische-zutrittsloesungen',
        process: 'projektkonfigurator',
        contact: {
          salutation: data.anrede || undefined,
          firstName: data.vorname.trim(),
          lastName: data.nachname.trim(),
          company: data.firma.trim() || undefined,
          email: data.email.trim(),
          phone: data.telefon.trim(),
          postalCode: data.plz.trim() || undefined,
          city: data.ort.trim() || undefined,
          country: 'Deutschland',
        },
        payload: { ...buildPayload(data) },
        summary: [...answerSummary, buildContactSummary(data)],
        uploads: zutrittUploads(grundrisse, fotos),
      });
    } catch {
      setSubmitting(false);
      setError('Die Verbindung wurde unterbrochen. Bitte versuchen Sie es noch einmal.');
      return;
    }
    schutz.antwortBeachten(response);

    setSubmitting(false);

    if (response.ok && response.reference) {
      aktionMelden('projektanfrage', 'elektronische-zutrittsloesungen');
      clearFlow(FLOW_ID);
      setResult({ reference: response.reference, notices: response.notices });
      window.scrollTo({ top: 0, behavior: scrollVerhalten() });
      return;
    }

    setError(
      response.error
        ?? 'Ihre Angaben konnten nicht übermittelt werden. Bitte versuchen Sie es erneut.',
    );
  }

  /* ---------- Erfolgsansicht -------------------------------------------- */

  if (result) {
    return (
      <div className="mx-auto max-w-3xl">
        <WegBestaetigung
          marke="Projekt eingegangen"
          titel="Ihr Projekt ist eingegangen"
          text="Wir prüfen Ihre Angaben und melden uns mit den nächsten Schritten."
          reference={result.reference}
          notices={result.notices}
          schritte={SCHRITTE_ZUTRITT}
          summary={[...answerSummary, buildContactSummary(data)]}
          zurueck={{ href: '/elektronische-zutrittsloesungen', label: 'Zurück zur Übersicht' }}
        />
      </div>
    );
  }

  /* ---------- Ablauf ----------------------------------------------------- */

  return (
    <FlowShell
      schutz={schutz}
      abschlussHinweis={<AnfrageHinweis />}
      flow={flow}
      title="Zutrittskonfigurator"
      submitLabel="Projekt absenden"
      onSubmit={handleSubmit}
      submitting={submitting}
      blockedHint={BLOCKED_HINTS[flow.step?.id ?? '']}
      ungesichert={grundrisse.length > 0 || fotos.length > 0}
      mitDateien
    >
      {error && <AbsendeFehler fehler={error} hilfe={hilfe} titel="Übermittlung nicht möglich" />}

      {/* 1 Objekt */}
      {flow.step?.id === 'objekt' && (
        <fieldset>
          <legend className="sr-only">Art des Objekts</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {OBJEKT.map((choice) => (
              <OptionCard
                key={choice.id}
                name="objekt"
                value={choice.id}
                checked={data.objekt === choice.id}
                onSelect={(value) => set('objekt', value)}
                title={choice.title}
                description={choice.description}
                info={choice.info}
              />
            ))}
          </div>
        </fieldset>
      )}

      {/* 2 Umfang */}
      {flow.step?.id === 'umfang' && (
        <div className="space-y-8">
          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-small font-bold text-foreground">
              Wie viele Türen sollen elektronisch werden?
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {TUEREN.map((choice, index) => (
                <OptionCard
                  key={choice.id}
                  name="tueren"
                  value={choice.id}
                  checked={data.tueren === choice.id}
                  onSelect={(value) => set('tueren', value)}
                  title={choice.title}
                  info={index === 0 ? TUEREN_INFO : undefined}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-small font-bold text-foreground">
              Wie viele Personen sollen eine Berechtigung erhalten?
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {NUTZER.map((choice, index) => (
                <OptionCard
                  key={choice.id}
                  name="nutzer"
                  value={choice.id}
                  checked={data.nutzer === choice.id}
                  onSelect={(value) => set('nutzer', value)}
                  title={choice.title}
                  info={index === 0 ? NUTZER_INFO : undefined}
                />
              ))}
            </div>
          </fieldset>

          <Field
            label="Genaue Anzahl oder Besonderheiten"
            hint="Freiwillig. Zum Beispiel: 9 Türen, davon 2 Fluchttüren; 14 Personen in 3 Gruppen."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={data.umfangNotiz}
                onChange={(event) => set('umfangNotiz', event.target.value)}
                placeholder="Ihre Ergänzung"
              />
            )}
          </Field>

          <fieldset>
            <legend className="mb-3 text-small font-bold text-foreground">
              Sollen später Türen oder Nutzer hinzukommen?
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {ERWEITERUNG.map((choice, index) => (
                <OptionCard
                  key={choice.id}
                  name="erweiterung"
                  value={choice.id}
                  checked={data.erweiterung === choice.id}
                  onSelect={(value) =>
                    fragtZuwachs(value)
                      ? set('erweiterung', value)
                      : flow.update({ erweiterung: value, erweiterungUmfang: '' })
                  }
                  title={choice.title}
                  info={index === 0 ? ERWEITERUNG_INFO : undefined}
                />
              ))}
            </div>
          </fieldset>

          {fragtZuwachs(data.erweiterung) && (
            <Field
              label="Ungefähr wie viele?"
              hint="Freiwillig. Eine Schätzung genügt, zum Beispiel: etwa 5 Türen und 20 Personen in zwei Jahren."
            >
              {({ id, describedBy }) => (
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  value={data.erweiterungUmfang}
                  onChange={(event) => set('erweiterungUmfang', event.target.value)}
                />
              )}
            </Field>
          )}
        </div>
      )}

      {/* 3 Identmedium */}
      {flow.step?.id === 'medien' && (
        <fieldset>
          <legend className="sr-only">Gewünschte Identmedien</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {MEDIEN.map((choice) => (
              <OptionCard
                key={choice.id}
                name="medien"
                value={choice.id}
                checked={data.medien.includes(choice.id)}
                onSelect={(value) => toggle('medien', value)}
                title={choice.title}
                description={choice.description}
                info={choice.info}
                multiple
              />
            ))}
          </div>
          <p className="mt-4 text-small text-foreground-subtle">
            Werden mehrere Medien gewählt, führen wir sie in derselben Anlage. In der Praxis ist die
            Kombination aus einem festen Medium und PIN häufig.
          </p>
        </fieldset>
      )}

      {/* 4 Verwaltung */}
      {flow.step?.id === 'verwaltung' && (
        <fieldset>
          <legend className="sr-only">Verwaltungsart</legend>
          <div className="grid gap-3">
            {VERWALTUNG.map((choice) => (
              <OptionCard
                key={choice.id}
                name="verwaltung"
                value={choice.id}
                checked={data.verwaltung === choice.id}
                onSelect={(value) => set('verwaltung', value)}
                title={choice.title}
                description={choice.description}
                info={choice.info}
              />
            ))}
          </div>
        </fieldset>
      )}

      {/* Technische Fragen ohne Fachwissen: Telefon und Rückruf (FA-QA-02). Für „weiß nicht“ steht je Frage
          „offen“ oder „noch nicht bekannt“ bereit. */}
      {(flow.step?.id === 'medien' || flow.step?.id === 'verwaltung' || flow.step?.id === 'integration') && (
        <HilfeBlock
          hilfe={hilfe}
          stelle="technik"
          satz="Wählen Sie „Noch offen“ oder „Noch unklar“, wenn Sie es nicht wissen. Wir beraten Sie gern am Telefon."
          className="mt-8"
        />
      )}

      {/* 5 Berechtigungen */}
      {flow.step?.id === 'berechtigungen' && (
        <fieldset>
          <legend className="sr-only">Gewünschte Berechtigungssteuerung</legend>
          <div className="grid gap-3">
            {BERECHTIGUNGEN.map((choice) => (
              <OptionCard
                key={choice.id}
                name="berechtigungen"
                value={choice.id}
                checked={data.berechtigungen.includes(choice.id)}
                onSelect={(value) => toggle('berechtigungen', value)}
                title={choice.title}
                description={choice.description}
                info={choice.info}
                multiple
              />
            ))}
          </div>
        </fieldset>
      )}

      {/* 6 Standorte */}
      {flow.step?.id === 'standorte' && (
        <div className="space-y-6">
          <fieldset>
            <legend className="sr-only">Verteilung der Türen</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {STANDORTE.map((choice) => (
                <OptionCard
                  key={choice.id}
                  name="standorte"
                  value={choice.id}
                  checked={data.standorte === choice.id}
                  onSelect={(value) => set('standorte', value)}
                  title={choice.title}
                  description={choice.description}
                  info={choice.info}
                />
              ))}
            </div>
          </fieldset>

          {data.standorte === 'mehrere' && (
            <Field
              label="Welche Standorte sind betroffen?"
              hint="Freiwillig. Zum Beispiel Anzahl der Liegenschaften und ob dieselben Personen überall Zutritt brauchen."
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  value={data.standorteNotiz}
                  onChange={(event) => set('standorteNotiz', event.target.value)}
                  placeholder="Ihre Angaben zu den Standorten"
                />
              )}
            </Field>
          )}
        </div>
      )}

      {/* 7 Integration */}
      {flow.step?.id === 'integration' && (
        <div className="space-y-6">
          <fieldset>
            <legend className="sr-only">Einbindung vorhandener Mechanik</legend>
            <div className="grid gap-3">
              {INTEGRATION.map((choice) => (
                <OptionCard
                  key={choice.id}
                  name="integration"
                  value={choice.id}
                  checked={data.integration === choice.id}
                  onSelect={(value) => set('integration', value)}
                  title={choice.title}
                  description={choice.description}
                  info={choice.info}
                />
              ))}
            </div>
          </fieldset>

          {data.integration !== 'nein' && (
            <Field
              label="Was ist mechanisch vorhanden?"
              hint="Freiwillig. Zum Beispiel: bestehende Schließanlage, Anzahl der Schlüssel, Sicherungskarte vorhanden."
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  value={data.integrationNotiz}
                  onChange={(event) => set('integrationNotiz', event.target.value)}
                  placeholder="Ihre Angaben zum Bestand"
                />
              )}
            </Field>
          )}

          <p className="text-small text-foreground-subtle">
            Wie Sie mechanische und elektronische Türen sinnvoll aufteilen, erklären wir im{' '}
            <Link
              href="/ratgeber/mechanisch-oder-elektronisch"
              className="font-semibold text-primary hover:underline"
            >
              Ratgeber zur Entscheidung
            </Link>
            .
          </p>
        </div>
      )}

      {/* 8 Service */}
      {flow.step?.id === 'service' && (
        <div className="space-y-6">
          <fieldset>
            <legend className="sr-only">Gewünschte Serviceleistungen</legend>
            <div className="grid gap-3">
              {SERVICE.map((choice) => (
                <OptionCard
                  key={choice.id}
                  name="service"
                  value={choice.id}
                  checked={data.service.includes(choice.id)}
                  onSelect={(value) => toggle('service', value)}
                  title={choice.title}
                  description={choice.description}
                  info={choice.info}
                  multiple
                />
              ))}
            </div>
          </fieldset>

          <Field
            label="Wünsche zur Terminlage oder zum Ablauf"
            hint="Freiwillig. Zum Beispiel: Montage außerhalb Ihrer Geschäftszeiten, Ansprechperson vor Ort."
          >
            {({ id, describedBy }) => (
              <TextArea
                id={id}
                aria-describedby={describedBy}
                value={data.serviceNotiz}
                onChange={(event) => set('serviceNotiz', event.target.value)}
                placeholder="Ihre Ergänzung"
              />
            )}
          </Field>
        </div>
      )}

      {/* 9 Unterlagen (FA-27-10): freiwillig, „Weiter“ geht auch ohne Datei */}
      {flow.step?.id === 'unterlagen' && (
        <div className="space-y-8">
          <PhotoUpload
            category="grundriss"
            id="zutritt-grundriss"
            label="Grundriss oder Lageplan"
            description={`Als Foto oder PDF, gern mit eingezeichneten Türen. Wir bewahren Grundrisse ${retention.floorPlans} Tage auf.`}
            example={{
              motif: 'Beispiel: Grundriss einer Etage mit eingezeichneten Türen, gut lesbar abfotografiert',
              ratio: '4/3',
            }}
            files={grundrisse}
            onChange={setGrundrisse}
            multiple
            maxFiles={4}
            allowDocuments
          />

          <PhotoUpload
            category="objektfoto"
            id="zutritt-fotos"
            label="Fotos von Türen und Bestand"
            description={`Die Türen, die elektronisch werden sollen, und vorhandene Schlösser, Zylinder oder Leser. Wir bewahren Fotos ${retention.objectPhotos} Tage auf.`}
            example={{
              motif: 'Beispielfoto: ganze Tür mit Schloss und Beschlag, gut ausgeleuchtet',
              ratio: '4/3',
            }}
            files={fotos}
            onChange={setFotos}
            multiple
            maxFiles={6}
          />

          <Alert tone="info" title="Hochladen ist freiwillig">
            Ohne Unterlagen geht es auch weiter. Wir klären die offenen Punkte dann telefonisch oder
            bei einem Termin vor Ort.
          </Alert>
          <HilfeBlock hilfe={hilfe} stelle="unterlagen" titel="Unsicher, was Sie hochladen sollen?" spaeter mitDateien />
        </div>
      )}

      {/* 10 Zusammenfassung und Kontakt */}
      {flow.step?.id === 'zusammenfassung' && (
        <div className="space-y-8">
          <section className="border-t border-border pt-6">
            <h3 className="text-title-sm font-semibold text-foreground">Ihre Angaben</h3>
            <p className="mt-1 text-small text-foreground-muted">
              Über die Schrittleiste oben kommen Sie zu jedem Punkt zurück.
            </p>
            <SummaryList sections={answerSummary} variante="schriftfeld" leer="Keine Angabe" className="mt-4" />
          </section>

          <section className="border-t border-border pt-6">
            <h3 className="text-title-sm font-semibold text-foreground">Wie erreichen wir Sie?</h3>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field label="Anrede">
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    aria-describedby={describedBy}
                    value={data.anrede}
                    onChange={(event) => set('anrede', event.target.value)}
                  >
                    <option value="">Keine Angabe</option>
                    <option value="Frau">Frau</option>
                    <option value="Herr">Herr</option>
                  </Select>
                )}
              </Field>

              <Field label="Firma" hint="Nur bei gewerblichen Vorhaben nötig.">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    autoComplete="organization"
                    value={data.firma}
                    onChange={(event) => set('firma', event.target.value)}
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
                    value={data.vorname}
                    onChange={(event) => set('vorname', event.target.value)}
                  />
                )}
              </Field>

              <Field label="Nachname" required>
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    autoComplete="family-name"
                    value={data.nachname}
                    onChange={(event) => set('nachname', event.target.value)}
                  />
                )}
              </Field>

              <Field
                label="E-Mail-Adresse"
                required
                error={
                  data.email.trim() !== '' && !isEmail(data.email)
                    ? 'Bitte prüfen Sie die E-Mail-Adresse.'
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
                    onChange={(event) => set('email', event.target.value)}
                  />
                )}
              </Field>

              <Field label="Telefon" required hint="Für Rückfragen zur Türsituation.">
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    type="tel"
                    inputMode="tel"
                    aria-describedby={describedBy}
                    invalid={invalid}
                    autoComplete="tel"
                    value={data.telefon}
                    onChange={(event) => set('telefon', event.target.value)}
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
                    value={data.plz}
                    onChange={(event) => set('plz', event.target.value)}
                  />
                )}
              </Field>

              <Field label="Ort">
                {({ id, describedBy }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    autoComplete="address-level2"
                    value={data.ort}
                    onChange={(event) => set('ort', event.target.value)}
                  />
                )}
              </Field>
            </div>

            <Field
              label="Nachricht"
              hint="Freiwillig. Alles, was für die Einschätzung wichtig ist."
              className="mt-5"
            >
              {({ id, describedBy }) => (
                <TextArea
                  id={id}
                  aria-describedby={describedBy}
                  value={data.nachricht}
                  onChange={(event) => set('nachricht', event.target.value)}
                  placeholder="Ihre Nachricht"
                />
              )}
            </Field>
          </section>

          <Alert tone="legal" title="Zu Ihren Angaben">
            <p>
              Ihre Angaben verwenden wir, um Ihr Vorhaben zu prüfen und Ihnen ein Angebot zu
              erstellen. Einzelheiten zur Verarbeitung stehen in der{' '}
              <Link
                href="/rechtliches/datenschutz"
                className="font-semibold text-primary hover:underline"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </Alert>
        </div>
      )}
    </FlowShell>
  );
}
