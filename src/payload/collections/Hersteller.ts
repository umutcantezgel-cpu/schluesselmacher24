import type { CollectionConfig } from 'payload';

import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { kennungFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';
import { adresseAusName, freiwilligeAdresse } from './Kategorien';

/**
 * Hersteller-Stammliste (FA-11-05 bis FA-11-07): Artikel wählen ihren
 * Hersteller hier aus, statt ihn frei zu tippen. So entsteht jeder Hersteller
 * nur einmal, und unter einem Hersteller stehen nur seine Produkte.
 *
 * Logos nur mit Freigabe (R12): Ohne den Haken „Freigabe liegt vor“ gibt die
 * Seite kein Logo aus, auch wenn eines hochgeladen ist.
 */
export const Hersteller: CollectionConfig = {
  slug: 'hersteller',
  labels: { singular: 'Hersteller', plural: 'Hersteller' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'angeboten', 'reihenfolge', 'updatedAt'],
    listSearchableFields: ['name', 'slug'],
    description:
      'Liste der Hersteller. Bitte jeden Hersteller nur einmal anlegen, in seiner eigenen Schreibweise. '
      + 'Artikel wählen ihren Hersteller aus dieser Liste.',
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
      admin: { description: 'Genau so geschrieben wie vom Hersteller selbst, etwa mit Großbuchstaben.' },
    },
    {
      name: 'einsatz',
      type: 'textarea',
      label: 'Wofür die Systeme eingesetzt werden',
      maxLength: 300,
      admin: { description: 'Ein kurzer Satz, etwa an welchen Schlössern die Systeme sitzen. Nur, was Sie belegen können.' },
    },
    {
      name: 'angeboten',
      type: 'checkbox',
      label: 'Wir bieten Produkte dieses Herstellers an',
      defaultValue: false,
    },
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      admin: { description: 'Nur hochladen, wenn der Hersteller die Nutzung erlaubt hat.' },
      fields: [
        { name: 'bild', type: 'upload', relationTo: 'medien', label: 'Logo-Datei' },
        {
          name: 'freigabe',
          type: 'checkbox',
          label: 'Freigabe liegt vor',
          defaultValue: false,
          admin: { description: 'Ohne diesen Haken zeigt die Seite kein Logo.' },
        },
        { name: 'freigabeNotiz', type: 'text', label: 'Wer hat wann zugestimmt?', admin: { description: 'Nur intern.' } },
      ],
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
