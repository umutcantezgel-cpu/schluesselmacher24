import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { bildFeld, seoFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';
import { neueSeiteVorAenderung } from '../hooks/seiten-adresse';

/**
 * Pflegbare Texte der festen Seiten (Überschrift, Einleitung, Fragen, Suchmaschinen) und eigene
 * Inhaltsseiten mit freier Adresse (FA-KERN-05): Sie erscheinen über die Auffangroute unter `/<adresse>`.
 */
export const Seiten: CollectionConfig = {
  slug: 'seiten',
  labels: { singular: 'Seitentext', plural: 'Seitentexte' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'headline',
    defaultColumns: ['headline', 'route', '_status', 'updatedAt'],
    listSearchableFields: ['headline', 'route'],
  },
  access: { read: istTeam, create: istInhaber, update: istTeam, delete: istInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: { ...erneuernHooks, beforeChange: [neueSeiteVorAenderung] },
  fields: [
    {
      name: 'route',
      type: 'text',
      label: 'Seite (Adresse)',
      unique: true,
      index: true,
      // Nur beim Anlegen einer neuen Seite wählbar, danach fest (FA-KERN-05). Geprüft in `neueSeiteVorAenderung`.
      access: { update: () => false },
      admin: {
        position: 'sidebar',
        description:
          'Adresse ohne führenden Schrägstrich; leer = Startseite. Neue Seite: ein freier Name aus Kleinbuchstaben, '
          + 'Ziffern und Bindestrichen, etwa „schluessel-fuer-vereine“. Danach nicht mehr änderbar. '
          + 'Neue Seiten stehen zunächst auf „Nicht in Suchmaschinen aufnehmen“.',
      },
    },
    { name: 'headline', type: 'text', label: 'Überschrift', required: true },
    { name: 'subline', type: 'text', label: 'Unterzeile' },
    { name: 'intro', type: 'textarea', label: 'Einleitung' },
    {
      name: 'abschnitte',
      type: 'array',
      label: 'Textabschnitte',
      labels: { singular: 'Abschnitt', plural: 'Abschnitte' },
      fields: [
        { name: 'ueberschrift', type: 'text', label: 'Zwischenüberschrift', required: true },
        { name: 'text', type: 'textarea', label: 'Text', required: true },
        bildFeld('bild', 'Bild'),
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Häufige Fragen',
      labels: { singular: 'Frage', plural: 'Fragen' },
      admin: { description: 'Leer lassen = die Seite zeigt ihre eingebauten Fragen.' },
      fields: [
        { name: 'frage', type: 'text', label: 'Frage', required: true },
        { name: 'antwort', type: 'textarea', label: 'Antwort', required: true },
      ],
    },
    seoFeld(),
  ],
};
