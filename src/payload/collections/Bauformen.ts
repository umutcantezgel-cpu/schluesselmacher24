import type { CollectionConfig } from 'payload';

import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { kennungFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';
import { adresseAusName, freiwilligeAdresse } from './Kategorien';

/**
 * Bauformen der Autoschlüssel-Gehäuse (FA-SHOP-02, FA-14-02) als pflegbare Liste:
 * Klappschlüssel, Smart Key, Karte, Fernbedienung, Schlüsselkopf und alles, was
 * der Betrieb ergänzt. Gehäuse und Ersatzteile wählen ihre Bauform hier aus.
 */
export const Bauformen: CollectionConfig = {
  slug: 'bauformen',
  typescript: { interface: 'Bauformen' },
  labels: { singular: 'Bauform', plural: 'Bauformen' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'reihenfolge', 'updatedAt'],
    listSearchableFields: ['name', 'slug'],
    description:
      'Bauformen der Autoschlüssel-Gehäuse, etwa Klappschlüssel, Smart Key oder Karte. '
      + 'Gehäuse und Ersatzteile unter Shop › Artikel wählen ihre Bauform aus dieser Liste. Jede Bauform nur einmal anlegen.',
    pagination: { defaultLimit: 50 },
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { maxPerDoc: 20 },
  trash: true,
  defaultSort: 'reihenfolge',
  disableDuplicate: true,
  hooks: { ...erneuernHooks, beforeValidate: [adresseAusName] },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      unique: true,
      maxLength: 60,
      admin: { description: 'So, wie Kunden die Bauform kennen, etwa „Klappschlüssel“.' },
    },
    {
      name: 'beschreibung',
      type: 'textarea',
      label: 'Kurze Erklärung',
      maxLength: 300,
      admin: { description: 'Optional. Ein Satz, woran man die Bauform erkennt. Nur, was Sie belegen können.' },
    },
    freiwilligeAdresse('Nur Kleinbuchstaben, Ziffern und Bindestriche. Leer lassen: wird aus dem Namen gebildet.'),
    kennungFeld(),
    {
      name: 'reihenfolge',
      type: 'number',
      label: 'Reihenfolge',
      required: true,
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Kleinere Zahl steht weiter vorn.' },
    },
  ],
};
