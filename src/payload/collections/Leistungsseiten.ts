import type { CollectionConfig } from 'payload';

import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { BEREICHE, PROZESSE, bildFeld, kennungFeld, seoFeld, slugFeld, textListe } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Unterseiten der Tür-/Schließtechnik und Sicherheitstechnik. */
export const Leistungsseiten: CollectionConfig = {
  slug: 'leistungsseiten',
  labels: { singular: 'Leistungsseite', plural: 'Leistungsseiten' },
  admin: { group: 'Inhalte', useAsTitle: 'titel', defaultColumns: ['titel', 'bereich', '_status', 'updatedAt'] },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 30 },
  trash: true,
  hooks: erneuernHooks,
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true },
    { name: 'bereich', type: 'select', label: 'Bereich', required: true, options: BEREICHE, admin: { position: 'sidebar' } },
    { name: 'zusammenfassung', type: 'textarea', label: 'Zusammenfassung', required: true },
    textListe('stichpunkte', 'Stichpunkte', 'Stichpunkt'),
    bildFeld('bild', 'Bild'),
    {
      type: 'row',
      fields: [
        { name: 'prozess', type: 'select', label: 'Ablauf', required: true, defaultValue: 'gefuehrte-anfrage', options: PROZESSE, admin: { width: '34%' } },
        { name: 'ctaHref', type: 'text', label: 'Ziel der Schaltfläche', required: true, admin: { width: '33%' } },
        { name: 'ctaLabel', type: 'text', label: 'Text der Schaltfläche', required: true, admin: { width: '33%' } },
      ],
    },
    seoFeld(),
    slugFeld({ unique: false }),
    kennungFeld(),
  ],
};
