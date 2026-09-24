import type { ArrayField, Field, GroupField, NumberField, SelectField, TextField } from 'payload';

/**
 * Wiederkehrende Felder des Backends. Beschriftungen und Hilfetexte sind für
 * den Betreiber geschrieben — ohne Fachbegriffe aus der Programmierung.
 */

export const BEREICHE = [
  { label: 'Autoschlüssel', value: 'autoschluessel' },
  { label: 'Schlüssel nach Vorlage', value: 'schluessel-nach-vorlage' },
  { label: 'Schlüssel nach Code', value: 'schluessel-nach-code' },
  { label: 'Gleichschließende Zylinder', value: 'gleichschliessende-zylinder' },
  { label: 'Schließanlagen', value: 'schliessanlagen' },
  { label: 'Elektronische Zutrittslösungen', value: 'elektronische-zutrittsloesungen' },
  { label: 'Tür- und Schließtechnik', value: 'tuer-und-schliesstechnik' },
  { label: 'Sicherheitstechnik', value: 'sicherheitstechnik' },
  { label: 'Service und Termin', value: 'service-und-termin' },
];

export const PROZESSE = [
  { label: 'Direktkauf', value: 'direktkauf' },
  { label: 'Geführte Anfrage', value: 'gefuehrte-anfrage' },
  { label: 'Projekt-Konfigurator', value: 'projektkonfigurator' },
  { label: 'Termin mit Anzahlung', value: 'termin-mit-anzahlung' },
];

export const SCHLUESSELARTEN = [
  { label: 'Mechanisch', value: 'mechanisch' },
  { label: 'Funk', value: 'funk' },
  { label: 'Klappschlüssel', value: 'klappschluessel' },
  { label: 'Smart-Key', value: 'smart-key' },
  { label: 'Keyless', value: 'keyless' },
];

export const VERSANDKLASSEN = [
  { label: 'Code-Schlüssel', value: 'code-schluessel' },
  { label: 'Zylinder', value: 'zylinder' },
  { label: 'Zubehör', value: 'zubehoer' },
];

const SLUG_MUSTER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Adresse-Teil, z. B. `ms-01`. Nur Kleinbuchstaben, Ziffern und Bindestriche. */
export function slugFeld(overrides: Partial<TextField> = {}): TextField {
  return {
    name: 'slug',
    type: 'text',
    label: 'Adresse (URL-Teil)',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'Nur Kleinbuchstaben, Ziffern und Bindestriche, z. B. „ms-01“. Ändert die Adresse der Seite.',
    },
    validate: (value: unknown) =>
      typeof value === 'string' && SLUG_MUSTER.test(value)
        ? true
        : 'Bitte nur Kleinbuchstaben, Ziffern und einzelne Bindestriche verwenden.',
    ...overrides,
  } as TextField;
}

/**
 * Feste Kennung, auf die sich Warenkörbe, Preisregeln und Bestellungen
 * beziehen. Wird beim Anlegen aus der Adresse übernommen und danach nicht
 * mehr geändert.
 */
export function kennungFeld(): TextField {
  return {
    name: 'kennung',
    type: 'text',
    label: 'Kennung',
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      readOnly: true,
      description: 'Wird automatisch vergeben und bleibt fest, damit Bestellungen und Warenkörbe gültig bleiben.',
    },
    hooks: {
      beforeChange: [
        ({ value, originalDoc, siblingData }) => {
          if (typeof originalDoc?.kennung === 'string' && originalDoc.kennung) return originalDoc.kennung;
          if (typeof value === 'string' && value) return value;
          return typeof siblingData?.slug === 'string' ? siblingData.slug : value;
        },
      ],
    },
  } as TextField;
}

/** Betrag in Euro mit höchstens zwei Nachkommastellen. */
export function euroFeld(name: string, label: string, overrides: Partial<NumberField> = {}): NumberField {
  return {
    name,
    type: 'number',
    label,
    min: 0,
    max: 1_000_000,
    admin: { step: 0.01, description: 'Betrag in Euro inklusive Umsatzsteuer.' },
    validate: (value: unknown, { required }: { required?: boolean }) => {
      if (value === null || value === undefined || value === '') {
        return required ? 'Bitte einen Betrag eintragen.' : true;
      }
      const zahl = Number(value);
      if (!Number.isFinite(zahl) || zahl < 0) return 'Bitte einen Betrag ab 0 eintragen.';
      if (Math.abs(Math.round(zahl * 100) - zahl * 100) > 1e-6) {
        return 'Bitte höchstens zwei Nachkommastellen verwenden.';
      }
      return true;
    },
    ...overrides,
  } as NumberField;
}

export const FORMATE: SelectField['options'] = [
  { label: 'Breit (16:9)', value: '16/9' },
  { label: 'Klassisch (4:3)', value: '4/3' },
  { label: 'Quadratisch (1:1)', value: '1/1' },
  { label: 'Foto (3:2)', value: '3/2' },
  { label: 'Panorama (21:9)', value: '21/9' },
];

/**
 * Bildplatz: beschreibt das Motiv und nimmt optional ein echtes Foto auf.
 * Ohne Foto zeigt die Seite eine passende Grafik oder einen ruhigen Platzhalter.
 */
export function bildFeld(name: string, label: string, standardFormat = '16/9'): GroupField {
  return {
    name,
    type: 'group',
    label,
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'motiv',
            type: 'text',
            label: 'Motiv',
            admin: { width: '60%', description: 'Was hier zu sehen sein soll. Dient auch als Bildbeschreibung.' },
          },
          {
            name: 'format',
            type: 'select',
            label: 'Format',
            defaultValue: standardFormat,
            options: FORMATE,
            admin: { width: '40%' },
          },
        ],
      },
      {
        name: 'bild',
        type: 'upload',
        relationTo: 'medien',
        label: 'Foto (optional)',
        admin: { description: 'Nur echte eigene Fotos. Ohne Foto erscheint eine passende Grafik.' },
      },
      { name: 'hinweis', type: 'text', label: 'Notiz für die Redaktion', admin: { hidden: true } },
    ],
  };
}

/** Kurzerklärung hinter einem Info-Symbol. */
export function infoFeld(name: string, label: string): GroupField {
  return {
    name,
    type: 'group',
    label,
    fields: [
      { name: 'titel', type: 'text', label: 'Titel', required: true },
      { name: 'text', type: 'textarea', label: 'Erklärung', required: true },
      bildFeld('grafik', 'Erklärgrafik', '4/3'),
    ],
  };
}

export function seoFeld(): GroupField {
  return {
    name: 'seo',
    type: 'group',
    label: 'Suchmaschinen',
    admin: { description: 'Titel und Beschreibung, wie sie bei Google erscheinen.' },
    fields: [
      { name: 'titel', type: 'text', label: 'Seitentitel', maxLength: 90 },
      { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', maxLength: 320 },
      {
        name: 'interneLinks',
        type: 'array',
        label: 'Verwandte Seiten',
        labels: { singular: 'Link', plural: 'Links' },
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'href', type: 'text', label: 'Adresse', required: true, admin: { width: '50%' } },
              { name: 'label', type: 'text', label: 'Linktext', required: true, admin: { width: '50%' } },
            ],
          },
        ],
      },
      {
        name: 'noindex',
        type: 'checkbox',
        label: 'Nicht in Suchmaschinen aufnehmen',
        defaultValue: false,
      },
      bildFeld('socialBild', 'Vorschaubild für soziale Netzwerke'),
    ],
  };
}

export function textListe(name: string, label: string, feldLabel = 'Eintrag'): ArrayField {
  return {
    name,
    type: 'array',
    label,
    labels: { singular: feldLabel, plural: label },
    fields: [{ name: 'text', type: 'text', label: feldLabel, required: true }],
  };
}

export function zeitfensterFeld(name: string, label: string): ArrayField {
  return {
    name,
    type: 'array',
    label,
    labels: { singular: 'Zeitfenster', plural: 'Zeitfenster' },
    fields: [
      {
        type: 'row',
        fields: [
          uhrzeitFeld('von', 'Von'),
          uhrzeitFeld('bis', 'Bis'),
        ],
      },
    ],
  };
}

function uhrzeitFeld(name: string, label: string): TextField {
  return {
    name,
    type: 'text',
    label,
    required: true,
    admin: { width: '50%', placeholder: '09:00' },
    validate: (value: unknown) =>
      typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
        ? true
        : 'Bitte als Uhrzeit eintragen, z. B. 09:00.',
  } as TextField;
}

export type { Field };
