import type { GlobalConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { VERSANDKLASSEN, euroFeld, zeitfensterFeld } from '../fields/gemeinsam';
import { nachGlobalAenderung } from '../hooks/revalidate';

const WOCHENTAGE = [
  { label: 'Montag', value: '1' },
  { label: 'Dienstag', value: '2' },
  { label: 'Mittwoch', value: '3' },
  { label: 'Donnerstag', value: '4' },
  { label: 'Freitag', value: '5' },
  { label: 'Samstag', value: '6' },
  { label: 'Sonntag', value: '7' },
];

export const Einstellungen: GlobalConfig = {
  slug: 'einstellungen',
  label: 'Einstellungen',
  admin: { group: 'Verwaltung' },
  access: { read: istTeam, update: istInhaber },
  hooks: { afterChange: [nachGlobalAenderung] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Firma',
          name: 'firma',
          description: 'Erscheint im Impressum, in der Fußzeile und in strukturierten Daten.',
          fields: [
            { name: 'platzhalter', type: 'checkbox', label: 'Noch Platzhalter hinterlegt', defaultValue: true, admin: { description: 'Haken entfernen, sobald alle Angaben echt sind.' } },
            { type: 'row', fields: [
              { name: 'rechtlicherName', type: 'text', label: 'Rechtlicher Name', required: true, admin: { width: '50%' } },
              { name: 'marke', type: 'text', label: 'Markenname', required: true, admin: { width: '50%' } },
            ] },
            { name: 'strasse', type: 'text', label: 'Straße und Hausnummer', required: true },
            { type: 'row', fields: [
              { name: 'plz', type: 'text', label: 'PLZ', required: true, admin: { width: '25%' } },
              { name: 'ort', type: 'text', label: 'Ort', required: true, admin: { width: '45%' } },
              { name: 'land', type: 'text', label: 'Land', required: true, defaultValue: 'Deutschland', admin: { width: '30%' } },
            ] },
            { type: 'row', fields: [
              { name: 'telefon', type: 'text', label: 'Telefon', required: true, admin: { width: '50%' } },
              {
                name: 'email',
                type: 'text',
                label: 'E-Mail',
                required: true,
                admin: { width: '50%' },
                // Solange Platzhalter hinterlegt sind, darf hier noch Platzhaltertext stehen.
                validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
                  siblingData?.platzhalter || (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    ? true
                    : 'Bitte eine gültige E-Mail-Adresse eintragen.',
              },
            ] },
            { type: 'row', fields: [
              { name: 'ustId', type: 'text', label: 'USt-IdNr.', admin: { width: '34%' } },
              { name: 'registergericht', type: 'text', label: 'Registergericht', admin: { width: '33%' } },
              { name: 'registernummer', type: 'text', label: 'Registernummer', admin: { width: '33%' } },
            ] },
            { name: 'geschaeftsfuehrung', type: 'text', label: 'Geschäftsführung / Inhaber' },
          ],
        },
        {
          label: 'Öffnungszeiten',
          fields: [
            {
              name: 'oeffnungszeiten',
              type: 'array',
              label: 'Öffnungszeiten',
              labels: { singular: 'Tag', plural: 'Tage' },
              fields: [
                { name: 'tag', type: 'select', label: 'Wochentag', required: true, options: WOCHENTAGE },
                { ...zeitfensterFeld('zeiten', 'Geöffnet'), admin: { description: 'Leer lassen = geschlossen.' } },
              ],
            },
          ],
        },
        {
          label: 'Termine',
          name: 'buchung',
          description: 'Standardwerte für Autoschlüssel-Termine. Preisregeln können abweichen.',
          fields: [
            { type: 'row', fields: [
              { name: 'vorlaufTage', type: 'number', label: 'Vorlauf (Tage)', required: true, min: 0, max: 90, admin: { width: '33%', step: 1 } },
              { name: 'horizontTage', type: 'number', label: 'Buchbar für (Tage)', required: true, min: 7, max: 365, admin: { width: '33%', step: 1 } },
              { name: 'terminMinuten', type: 'number', label: 'Terminlänge (Minuten)', required: true, min: 15, max: 480, admin: { width: '34%', step: 15 } },
            ] },
            { type: 'row', fields: [
              euroFeld('anzahlung', 'Anzahlung', { required: true, admin: { width: '34%', step: 0.01 } }),
              euroFeld('anzahlungMin', 'Anzahlung mindestens', { required: true, admin: { width: '33%', step: 0.01 } }),
              euroFeld('anzahlungMax', 'Anzahlung höchstens', { required: true, admin: { width: '33%', step: 0.01 } }),
            ] },
            { name: 'termineJeFenster', type: 'number', label: 'Termine je Zeitfenster', required: true, min: 1, max: 20, defaultValue: 1, admin: { step: 1 } },
            zeitfensterFeld('fenster', 'Buchbare Zeitfenster'),
          ],
        },
        {
          label: 'Versand',
          fields: [
            {
              name: 'versand',
              type: 'array',
              label: 'Versandarten',
              labels: { singular: 'Versandart', plural: 'Versandarten' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'text', label: 'Kennung', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '70%' } },
                ] },
                { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
                { type: 'row', fields: [
                  euroFeld('preis', 'Preis', { required: true, admin: { width: '34%', step: 0.01 } }),
                  { name: 'verfolgt', type: 'checkbox', label: 'Sendungsverfolgung', admin: { width: '33%' } },
                  { name: 'versichert', type: 'checkbox', label: 'Versichert', admin: { width: '33%' } },
                ] },
                { name: 'produktklassen', type: 'select', label: 'Passend für', hasMany: true, required: true, options: VERSANDKLASSEN },
              ],
            },
          ],
        },
        {
          label: 'Aufbewahrung',
          name: 'aufbewahrung',
          description: 'Wie lange hochgeladene Unterlagen aufbewahrt werden (Tage).',
          fields: [
            { type: 'row', fields: [
              { name: 'fahrzeugschein', type: 'number', label: 'Fahrzeugschein', required: true, min: 1, admin: { width: '25%' } },
              { name: 'schluesselfotos', type: 'number', label: 'Schlüsselfotos', required: true, min: 1, admin: { width: '25%' } },
              { name: 'grundrisse', type: 'number', label: 'Grundrisse', required: true, min: 1, admin: { width: '25%' } },
              { name: 'projektunterlagen', type: 'number', label: 'Projektunterlagen', required: true, min: 1, admin: { width: '25%' } },
            ] },
          ],
        },
      ],
    },
  ],
};
