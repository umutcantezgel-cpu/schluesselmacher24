import type { CollectionConfig } from 'payload';

import { istInhaber } from '../access/rollen';

/**
 * Bereits verarbeitete Zahlungsereignisse (Stripe). Verhindert, dass ein
 * wiederholt zugestelltes Ereignis eine Zahlung doppelt verbucht.
 */
export const WebhookEreignisse: CollectionConfig = {
  slug: 'webhook-ereignisse',
  labels: { singular: 'Zahlungsereignis', plural: 'Zahlungsereignisse' },
  admin: {
    group: 'Verwaltung',
    useAsTitle: 'ereignisId',
    hidden: ({ user }) => !(user as { rollen?: string[] } | null)?.rollen?.includes('inhaber'),
    defaultColumns: ['ereignisId', 'typ', 'vorgang', 'createdAt'],
  },
  access: { read: istInhaber, create: () => false, update: () => false, delete: istInhaber },
  fields: [
    { name: 'ereignisId', type: 'text', label: 'Ereignis', required: true, unique: true, index: true },
    { name: 'anbieter', type: 'text', label: 'Anbieter', required: true, defaultValue: 'stripe' },
    { name: 'typ', type: 'text', label: 'Typ', required: true },
    { name: 'vorgang', type: 'relationship', relationTo: 'vorgaenge', label: 'Vorgang' },
    { name: 'ergebnis', type: 'text', label: 'Ergebnis' },
  ],
};
