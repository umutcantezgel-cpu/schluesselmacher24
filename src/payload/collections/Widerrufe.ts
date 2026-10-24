import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';

/** Die Erklärung des Kunden bleibt, wie sie eingegangen ist. */
const unveraenderlich = { access: { update: () => false } };

/**
 * Widerrufserklärungen über den Widerrufsbutton der Seite.
 *
 * Jede Erklärung wird mit Eingangszeit gespeichert — wirksam ist sie mit dem
 * Zugang. Anlegen nur auf dem Server (Local API); niemals wird dabei
 * automatisch storniert oder erstattet. Lässt sich die Erklärung keinem
 * Vorgang sicher zuordnen, steht sie auf „Zu prüfen“.
 */
export const Widerrufe: CollectionConfig = {
  slug: 'widerrufe',
  labels: { singular: 'Widerruf', plural: 'Widerrufe' },
  admin: {
    group: 'Aufträge',
    useAsTitle: 'name',
    defaultColumns: ['eingegangenAm', 'name', 'vorgangsnummer', 'zuordnung', 'bearbeitet'],
    listSearchableFields: ['name', 'email', 'vorgangsnummer'],
    description: 'Über die Seite eingegangene Widerrufserklärungen. Neueste oben.',
  },
  defaultSort: '-eingegangenAm',
  access: {
    read: istTeam,
    create: () => false,
    update: istTeam,
    delete: istInhaber,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Name', admin: { width: '50%', readOnly: true }, ...unveraenderlich },
        { name: 'email', type: 'text', label: 'E-Mail', admin: { width: '50%', readOnly: true }, ...unveraenderlich },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'vorgangsnummer',
          type: 'text',
          label: 'Angegebene Vorgangsnummer',
          index: true,
          admin: { width: '50%', readOnly: true },
          ...unveraenderlich,
        },
        {
          name: 'eingegangenAm',
          type: 'date',
          label: 'Eingegangen am',
          required: true,
          index: true,
          admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm' } },
          ...unveraenderlich,
        },
      ],
    },
    { name: 'erklaerung', type: 'textarea', label: 'Erklärung', admin: { readOnly: true }, ...unveraenderlich },
    {
      name: 'vorgang',
      type: 'relationship',
      relationTo: 'vorgaenge',
      label: 'Vorgang',
      index: true,
      admin: { position: 'sidebar', description: 'Nur sicher zugeordnete Vorgänge — sonst von Hand prüfen.' },
    },
    {
      name: 'zuordnung',
      type: 'select',
      label: 'Zuordnung',
      defaultValue: 'zu-pruefen',
      options: [
        { label: 'Zugeordnet', value: 'zugeordnet' },
        { label: 'Zu prüfen', value: 'zu-pruefen' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'bearbeitet', type: 'checkbox', label: 'Bearbeitet', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'notiz', type: 'textarea', label: 'Interne Notiz' },
    {
      name: 'bestaetigung',
      type: 'group',
      label: 'Eingangsbestätigung an den Kunden',
      admin: { readOnly: true },
      ...unveraenderlich,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'ergebnis',
              type: 'select',
              label: 'Ergebnis',
              options: [
                { label: 'Gesendet', value: 'gesendet' },
                { label: 'Fehlgeschlagen', value: 'fehlgeschlagen' },
                { label: 'Nicht eingerichtet', value: 'nicht-eingerichtet' },
              ],
              admin: { width: '30%' },
            },
            { name: 'am', type: 'date', label: 'Zeitpunkt', admin: { width: '30%', date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm' } } },
            { name: 'anbieterId', type: 'text', label: 'Kennung beim Mailanbieter', admin: { width: '40%' } },
          ],
        },
        { name: 'fehler', type: 'text', label: 'Fehler' },
      ],
    },
  ],
};
