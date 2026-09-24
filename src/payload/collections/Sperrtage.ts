import type { CollectionConfig } from 'payload';

import { istTeam } from '../access/rollen';
import { zeitfensterFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Tage oder Zeitfenster, an denen keine Termine gebucht werden können. */
export const Sperrtage: CollectionConfig = {
  slug: 'sperrtage',
  labels: { singular: 'Sperrtag', plural: 'Sperrtage' },
  admin: { group: 'Termine', useAsTitle: 'grund', defaultColumns: ['datum', 'grund', 'updatedAt'] },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: istTeam },
  defaultSort: 'datum',
  hooks: erneuernHooks,
  fields: [
    {
      name: 'datum',
      type: 'date',
      label: 'Datum',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
    },
    { name: 'grund', type: 'text', label: 'Grund', required: true },
    {
      ...zeitfensterFeld('zeitfenster', 'Nur diese Zeitfenster sperren'),
      admin: { description: 'Leer lassen = ganzer Tag gesperrt.' },
    },
  ],
};
