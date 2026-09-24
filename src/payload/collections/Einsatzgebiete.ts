import type { CollectionConfig } from 'payload';

import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { BEREICHE, kennungFeld, seoFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Städteseiten mit örtlichem Mehrwert — kein Massentext. */
export const Einsatzgebiete: CollectionConfig = {
  slug: 'einsatzgebiete',
  labels: { singular: 'Einsatzgebiet', plural: 'Einsatzgebiete' },
  admin: { group: 'Inhalte', useAsTitle: 'stadt', defaultColumns: ['stadt', 'bundesland', '_status', 'updatedAt'] },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 20 },
  trash: true,
  hooks: erneuernHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'stadt', type: 'text', label: 'Stadt', required: true, admin: { width: '50%' } },
        { name: 'bundesland', type: 'text', label: 'Bundesland', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'lokalIntro', type: 'textarea', label: 'Örtliche Einleitung', required: true },
    {
      name: 'lokaleFakten',
      type: 'array',
      label: 'Örtliche Angaben',
      labels: { singular: 'Angabe', plural: 'Angaben' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '40%' } },
            { name: 'wert', type: 'text', label: 'Wert', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    { name: 'leistungen', type: 'select', label: 'Angebotene Leistungen', hasMany: true, options: BEREICHE },
    { name: 'radiusKm', type: 'number', label: 'Einsatzradius vor Ort (km)', min: 0, max: 500, defaultValue: 0 },
    seoFeld(),
    slugFeld(),
    kennungFeld(),
  ],
};
