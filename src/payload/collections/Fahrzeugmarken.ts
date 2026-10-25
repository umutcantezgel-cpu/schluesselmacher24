import type { CollectionConfig } from 'payload';

import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { SCHLUESSELARTEN, bildFeld, kennungFeld, seoFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Fahrzeugmarken mit Modellen für die Autoschlüssel-Buchung. */
export const Fahrzeugmarken: CollectionConfig = {
  slug: 'fahrzeugmarken',
  labels: { singular: 'Fahrzeugmarke', plural: 'Fahrzeugmarken' },
  admin: { group: 'Autoschlüssel', useAsTitle: 'name', defaultColumns: ['name', 'preisgruppe', '_status', 'updatedAt'] },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 30 },
  trash: true,
  hooks: erneuernHooks,
  fields: [
    { name: 'name', type: 'text', label: 'Marke', required: true },
    { name: 'preisgruppe', type: 'relationship', relationTo: 'preisgruppen', label: 'Preisgruppe', required: true },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Einleitung auf der Markenseite',
      admin: { description: 'Eigener Text des Betriebs — geht vor automatisch erzeugten Texten.' },
    },
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
        {
          name: 'fahrzeugVorOrt',
          type: 'checkbox',
          label: 'Programmierung nur am Fahrzeug',
          defaultValue: true,
          admin: {
            description:
              'Gilt nur für Leistungen mit Anlernen (Zweitschlüssel, Ersatz bei Verlust, Programmierung), '
              + 'die laut Leistung das Fahrzeug brauchen. Ohne Haken wird dafür kein Fahrzeugtermin verlangt.',
          },
        },
        { name: 'preisgruppe', type: 'relationship', relationTo: 'preisgruppen', label: 'Abweichende Preisgruppe' },
        { name: 'hinweise', type: 'text', label: 'Hinweise' },
        {
          name: 'einleitung',
          type: 'textarea',
          label: 'Einleitung auf der Modellseite',
          admin: { description: 'Eigener Text. Leer lassen = die Seite erzeugt ihn aus den Modelldaten.' },
        },
        {
          name: 'seo',
          type: 'group',
          label: 'Suchmaschinen',
          admin: { description: 'Eigener Titel und eigene Beschreibung der Modellseite. Leer = automatisch.' },
          fields: [
            { name: 'titel', type: 'text', label: 'Seitentitel', maxLength: 90 },
            { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', maxLength: 320 },
            { name: 'noindex', type: 'checkbox', label: 'Nicht in Suchmaschinen aufnehmen', defaultValue: false },
          ],
        },
      ],
    },
    seoFeld(),
    slugFeld(),
    kennungFeld(),
  ],
};
