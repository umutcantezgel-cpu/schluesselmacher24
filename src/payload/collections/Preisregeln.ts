import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { SCHLUESSELARTEN, euroFeld, kennungFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/**
 * Preis, Anzahlung und Terminlänge je Fahrzeuggruppe und Leistung.
 * Die spezifischste Regel gewinnt (Schlüsselart vor „alle“).
 */
export const Preisregeln: CollectionConfig = {
  slug: 'preisregeln',
  labels: { singular: 'Preisregel', plural: 'Preisregeln' },
  admin: {
    group: 'Autoschlüssel',
    useAsTitle: 'kennung',
    defaultColumns: ['kennung', 'preisgruppe', 'leistung', 'schluesselart', 'modus', 'preis'],
    description: 'Welche Leistung in welcher Fahrzeuggruppe was kostet und wie lange der Termin dauert.',
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: istInhaber },
  hooks: {
    ...erneuernHooks,
    beforeValidate: [
      ({ data }) => {
        if (data && !data.kennung && data.preisgruppe && data.leistung) {
          data.kennung = `${String(data.preisgruppe)}--${String(data.leistung)}--${String(data.schluesselart ?? 'alle')}`;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'preisgruppe', type: 'relationship', relationTo: 'preisgruppen', label: 'Preisgruppe', required: true, admin: { width: '50%' } },
        { name: 'leistung', type: 'relationship', relationTo: 'autoschluessel-leistungen', label: 'Leistung', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'schluesselart',
          type: 'select',
          label: 'Schlüsselart',
          required: true,
          defaultValue: 'alle',
          options: [{ label: 'Alle Schlüsselarten', value: 'alle' }, ...SCHLUESSELARTEN],
          admin: { width: '50%' },
        },
        {
          name: 'modus',
          type: 'select',
          label: 'Preisangabe',
          required: true,
          defaultValue: 'fest',
          options: [
            { label: 'Festpreis', value: 'fest' },
            { label: 'Preisrahmen (von–bis)', value: 'rahmen' },
            { label: 'Nach Prüfung', value: 'pruefung' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    euroFeld('preis', 'Festpreis', { admin: { condition: (_, s) => s?.modus === 'fest', step: 0.01 } }),
    {
      type: 'row',
      admin: { condition: (_, s) => s?.modus === 'rahmen' },
      fields: [
        euroFeld('preisVon', 'Preis von', { admin: { width: '50%', step: 0.01 } }),
        euroFeld('preisBis', 'Preis bis', { admin: { width: '50%', step: 0.01 } }),
      ],
    },
    {
      type: 'collapsible',
      label: 'Abweichungen von den Standardwerten (optional)',
      admin: { initCollapsed: true },
      fields: [
        euroFeld('anzahlung', 'Anzahlung'),
        {
          type: 'row',
          fields: [
            { name: 'terminMinuten', type: 'number', label: 'Terminlänge in Minuten', min: 15, max: 480, admin: { width: '50%', step: 15 } },
            { name: 'vorlaufTage', type: 'number', label: 'Vorlauf in Tagen', min: 0, max: 90, admin: { width: '50%', step: 1 } },
          ],
        },
      ],
    },
    { name: 'hinweis', type: 'text', label: 'Hinweis für Kunden' },
    { ...kennungFeld(), admin: { position: 'sidebar', readOnly: true, description: 'Wird automatisch vergeben.' } },
  ],
};
