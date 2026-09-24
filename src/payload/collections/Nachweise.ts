import type { CollectionConfig } from 'payload';

import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { bildFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/**
 * Zertifikate, Normen-Fachkunde, Versicherungen und Mitgliedschaften.
 * Nur Einträge mit Status „liegt vor“ und Haken „auf der Seite zeigen“
 * erscheinen öffentlich — Aussagen auf der Seite brauchen einen Nachweis.
 */
export const Nachweise: CollectionConfig = {
  slug: 'nachweise',
  labels: { singular: 'Nachweis', plural: 'Nachweise' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'art', 'status', 'oeffentlich', 'gueltigBis'],
    description: 'Jede Aussage wie „zertifiziert“ auf der Seite braucht hier einen Nachweis.',
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber },
  trash: true,
  hooks: erneuernHooks,
  fields: [
    { name: 'titel', type: 'text', label: 'Bezeichnung', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'art',
          type: 'select',
          label: 'Art',
          required: true,
          options: [
            { label: 'Zertifikat', value: 'zertifikat' },
            { label: 'Fachkunde nach Norm', value: 'norm' },
            { label: 'Schulung', value: 'schulung' },
            { label: 'Versicherung', value: 'versicherung' },
            { label: 'Mitgliedschaft', value: 'mitgliedschaft' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          required: true,
          defaultValue: 'bereithalten',
          options: [
            { label: 'Nachweis bereithalten', value: 'bereithalten' },
            { label: 'Liegt vor', value: 'liegt-vor' },
            { label: 'Abgelaufen', value: 'abgelaufen' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'beschreibung', type: 'textarea', label: 'Beschreibung' },
    {
      type: 'row',
      fields: [
        { name: 'aussteller', type: 'text', label: 'Ausgestellt von', admin: { width: '50%' } },
        {
          name: 'gueltigBis',
          type: 'date',
          label: 'Gültig bis',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
        },
      ],
    },
    bildFeld('bild', 'Foto des Nachweises', '4/3'),
    {
      name: 'oeffentlich',
      type: 'checkbox',
      label: 'Auf der Seite zeigen',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Nur möglich, wenn der Nachweis vorliegt.' },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
        !value || siblingData?.status === 'liegt-vor'
          ? true
          : 'Nur Nachweise mit Status „Liegt vor“ dürfen auf der Seite erscheinen.',
    },
  ],
};
