import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { SCHLUESSELARTEN, kennungFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Leistungen im Autoschlüssel-Bereich, z. B. Zweitschlüssel oder Programmierung. */
export const AutoschluesselLeistungen: CollectionConfig = {
  slug: 'autoschluessel-leistungen',
  labels: { singular: 'Autoschlüssel-Leistung', plural: 'Autoschlüssel-Leistungen' },
  admin: { group: 'Autoschlüssel', useAsTitle: 'label', defaultColumns: ['label', 'aktiv', 'updatedAt'] },
  access: { read: istTeam, create: istInhaber, update: istTeam, delete: istInhaber },
  trash: true,
  hooks: erneuernHooks,
  fields: [
    { name: 'label', type: 'text', label: 'Bezeichnung', required: true },
    { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
    {
      name: 'schluesselarten',
      type: 'select',
      label: 'Für Schlüsselarten',
      hasMany: true,
      required: true,
      options: SCHLUESSELARTEN,
    },
    { name: 'fahrzeugVorOrt', type: 'checkbox', label: 'Fahrzeug muss vor Ort sein', defaultValue: false },
    { name: 'aktiv', type: 'checkbox', label: 'Wird angeboten', defaultValue: true, admin: { position: 'sidebar' } },
    slugFeld(),
    kennungFeld(),
  ],
};
