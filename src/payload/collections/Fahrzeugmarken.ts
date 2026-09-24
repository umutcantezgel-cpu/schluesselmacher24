import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { SCHLUESSELARTEN, bildFeld, kennungFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Fahrzeugmarken mit Modellen für die Autoschlüssel-Buchung. */
export const Fahrzeugmarken: CollectionConfig = {
  slug: 'fahrzeugmarken',
  labels: { singular: 'Fahrzeugmarke', plural: 'Fahrzeugmarken' },
  admin: { group: 'Autoschlüssel', useAsTitle: 'name', defaultColumns: ['name', 'preisgruppe', '_status', 'updatedAt'] },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: istInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 30 },
  trash: true,
  hooks: erneuernHooks,
  fields: [
    { name: 'name', type: 'text', label: 'Marke', required: true },
    { name: 'preisgruppe', type: 'relationship', relationTo: 'preisgruppen', label: 'Preisgruppe', required: true },
    { name: 'intro', type: 'textarea', label: 'Einleitung auf der Markenseite' },
    bildFeld('bild', 'Bild der Markenseite'),
    {
      name: 'modelle',
      type: 'array',
      label: 'Modelle',
      labels: { singular: 'Modell', plural: 'Modelle' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', label: 'Modell', required: true, admin: { width: '40%' } },
            { name: 'slug', type: 'text', label: 'Adresse', required: true, admin: { width: '30%' } },
            { name: 'kennung', type: 'text', label: 'Kennung', admin: { width: '30%', description: 'Leer lassen = wie Adresse.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'baujahrVon', type: 'number', label: 'Baujahr von', required: true, min: 1950, max: 2100, admin: { width: '50%', step: 1 } },
            { name: 'baujahrBis', type: 'number', label: 'Baujahr bis', min: 1950, max: 2100, admin: { width: '50%', step: 1 } },
          ],
        },
        { name: 'schluesselarten', type: 'select', label: 'Mögliche Schlüsselarten', hasMany: true, required: true, options: SCHLUESSELARTEN },
        { name: 'fahrzeugVorOrt', type: 'checkbox', label: 'Programmierung nur am Fahrzeug', defaultValue: true },
        { name: 'preisgruppe', type: 'relationship', relationTo: 'preisgruppen', label: 'Abweichende Preisgruppe' },
        { name: 'hinweise', type: 'text', label: 'Hinweise' },
      ],
    },
    slugFeld(),
    kennungFeld(),
  ],
};
