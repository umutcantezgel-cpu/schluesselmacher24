import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { BEREICHE, bildFeld, kennungFeld, seoFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

export const Ratgeber: CollectionConfig = {
  slug: 'ratgeber',
  labels: { singular: 'Ratgeber-Artikel', plural: 'Ratgeber' },
  admin: { group: 'Inhalte', useAsTitle: 'titel', defaultColumns: ['titel', 'thema', '_status', 'updatedAt'] },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: istInhaber, readVersions: istTeam },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 30 },
  trash: true,
  hooks: erneuernHooks,
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true },
    { name: 'auszug', type: 'textarea', label: 'Kurzfassung', required: true },
    { name: 'thema', type: 'select', label: 'Thema', required: true, options: BEREICHE, admin: { position: 'sidebar' } },
    {
      name: 'abschnitte',
      type: 'array',
      label: 'Abschnitte',
      labels: { singular: 'Abschnitt', plural: 'Abschnitte' },
      minRows: 1,
      fields: [
        { name: 'ueberschrift', type: 'text', label: 'Zwischenüberschrift', required: true },
        { name: 'text', type: 'textarea', label: 'Text', required: true },
      ],
    },
    bildFeld('bild', 'Bild'),
    {
      name: 'naechsterSchritt',
      type: 'group',
      label: 'Nächster Schritt für Leser',
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
    seoFeld(),
    slugFeld(),
    kennungFeld(),
  ],
};
