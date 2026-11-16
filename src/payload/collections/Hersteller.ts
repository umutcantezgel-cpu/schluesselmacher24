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
      + 'Artikel wählen ihren Hersteller aus dieser Liste. '
      + 'Mit dem Haken „angeboten“ erscheint der Hersteller sofort auf der Startseite und auf den Seiten der Bereiche, '
      + 'die Sie ihm unter „Bereiche“ zuordnen (Sperrschließungen, elektronischer Zutritt). Ein Logo erscheint nur mit Datei und Haken „Freigabe liegt vor“. '
      + 'Bei Schlüssel nach Code bekommt ein Hersteller eine eigene Seite, sobald ihm mindestens ein veröffentlichter Artikel zugeordnet ist.',
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
      admin: {
        description:
          'Ein kurzer Satz, etwa an welchen Schlössern die Systeme sitzen. Nur, was Sie belegen können. '
          + 'Erscheint auf der Herstellerseite bei Schlüssel nach Code und auf der Startseite bei Herstellern ohne Bereich; '
          + 'mit Bereich zeigt die Startseite den Text des Bereichs.',
      },
    },
    {
      name: 'bereiche',
      type: 'array',
      label: 'Bereiche',
      labels: { singular: 'Bereich', plural: 'Bereiche' },
      admin: {
        description:
          'In welchen Bereichen der Hersteller erscheint, mit einem Satz je Bereich, wofür seine Systeme dort eingesetzt werden. '
          + 'Ohne Bereich erscheint er auf keiner dieser beiden Seiten. Jeden Bereich nur einmal anlegen. Nur, was Sie belegen können, ohne Preise.',
      },
      validate: (wert: unknown) => {
        // Zeilen ohne gewählten Bereich meldet das Pflichtfeld „Bereich“ selbst, nicht als Doppel.
        const arten = (Array.isArray(wert) ? wert : [])
          .map((zeile) => (zeile as { art?: string })?.art)
          .filter(Boolean);
        return new Set(arten).size === arten.length || 'Jeder Bereich darf nur einmal vorkommen.';
      },
      fields: [
        {
          name: 'art',
          type: 'select',
          label: 'Bereich',
          required: true,
          options: [
            { label: 'Sperrschließungen', value: 'sperrschliessung' },
            { label: 'Elektronischer Zutritt', value: 'zutritt' },
          ],
        },
        {
          name: 'einsatz',
          type: 'textarea',
          label: 'Wofür die Systeme in diesem Bereich eingesetzt werden',
          required: true,
          maxLength: 300,
          admin: { description: 'Ein sachlicher Satz, ohne Preise und ohne Produktreihen, die wir nicht verbauen.' },
        },
      ],
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
