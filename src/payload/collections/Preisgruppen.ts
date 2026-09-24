import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { kennungFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Fahrzeuggruppen mit gemeinsamen Preis-, Anzahlungs- und Terminregeln. */
export const Preisgruppen: CollectionConfig = {
  slug: 'preisgruppen',
  labels: { singular: 'Preisgruppe', plural: 'Preisgruppen' },
  admin: { group: 'Autoschlüssel', useAsTitle: 'label', defaultColumns: ['label', 'kennung', 'updatedAt'] },
  access: { read: istTeam, create: istInhaber, update: istInhaber, delete: istInhaber },
  hooks: erneuernHooks,
  fields: [
    { name: 'label', type: 'text', label: 'Bezeichnung', required: true },
    { name: 'beschreibung', type: 'textarea', label: 'Beschreibung' },
    slugFeld({ label: 'Kurzname', admin: { position: 'sidebar', description: 'z. B. „gruppe-a“.' } }),
    kennungFeld(),
  ],
};
