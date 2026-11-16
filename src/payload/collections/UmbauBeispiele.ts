import type { CollectionConfig, Field } from 'payload';

import {
  UMBAU_EINSAETZE,
  UMBAU_EINSATZ_LABEL,
  UMBAU_TEILE,
  UMBAU_TEIL_LABEL,
} from '../../lib/data/fahrzeugteile';
import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { SCHLUESSELARTEN } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';
import { markeImKatalog, reihenDerMarke, reihenZurMarke } from './Produkte';

const vergleichsbild = (name: 'vorher' | 'nachher', label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'bild',
          type: 'upload',
          relationTo: 'medien',
          label: 'Foto',
          required: true,
          admin: { width: '50%', description: 'Nur echte Fotos dieses Umbaus.' },
        },
        {
          name: 'beschriftung',
          type: 'text',
          label: 'Beschriftung',
          required: true,
          maxLength: 120,
          admin: { width: '50%', description: 'Erscheint unter dem Bild und beschreibt es für Screenreader.' },
        },
      ],
    },
  ],
});

/**
 * Umbau-Beispiele (FA-SHOP-02, FA-14-07, FA-14-08, FA-20-05): echte Fälle mit Vorher- und
 * Nachher-Foto für Customizing, Gehäuse und Reparatur. Auf der Seite erscheint ein Beispiel
 * nur veröffentlicht, mit beiden Fotos und mit dem Haken „Fotos freigegeben“. Ohne Beispiele
 * zeigt die Seite keinen Vergleich, und es gibt keine Platzhalterbilder (R4).
 */
export const UmbauBeispiele: CollectionConfig = {
  slug: 'umbau-beispiele',
  labels: { singular: 'Umbau-Beispiel', plural: 'Umbau-Beispiele' },
  admin: {
    group: 'Autoschlüssel',
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'marke', 'freigabe', 'reihenfolge', '_status'],
    listSearchableFields: ['titel', 'marke'],
    description:
      'Echte Umbauten mit Foto vorher und nachher. Bitte Kennzeichen, Fahrzeugschein und Schlüsselnummern auf den Fotos unkenntlich machen. '
      + 'Ein Beispiel erscheint erst veröffentlicht und mit dem Haken „Fotos freigegeben“.',
    pagination: { defaultLimit: 50 },
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 20 },
  trash: true,
  defaultSort: 'reihenfolge',
  hooks: erneuernHooks,
  fields: [
    { name: 'titel', type: 'text', label: 'Titel', required: true, maxLength: 90, admin: { description: 'Kurz und sachlich, etwa was umgebaut wurde.' } },
    vergleichsbild('vorher', 'Vorher'),
    vergleichsbild('nachher', 'Nachher'),
    {
      type: 'row',
      fields: [
        {
          name: 'marke',
          type: 'text',
          label: 'Fahrzeugmarke',
          maxLength: 60,
          admin: { width: '40%', description: 'Genau wie im Fahrzeugkatalog. Optional.' },
          validate: markeImKatalog as never,
        },
        {
          name: 'reihe',
          type: 'relationship',
          relationTo: 'fahrzeugreihen',
          label: 'Modell oder Reihe',
          filterOptions: reihenDerMarke,
          admin: { width: '60%', description: 'Optional, nur zusammen mit der Marke.' },
          validate: reihenZurMarke as never,
        },
      ],
    },
    { name: 'schluesselart', type: 'select', label: 'Schlüsseltyp', options: SCHLUESSELARTEN },
    {
      name: 'uebernommen',
      type: 'select',
      label: 'Was übernommen wurde',
      hasMany: true,
      options: UMBAU_TEILE.map((value) => ({ label: UMBAU_TEIL_LABEL[value], value })),
    },
    {
      name: 'hinweis',
      type: 'textarea',
      label: 'Hinweis',
      required: true,
      maxLength: 600,
      admin: { description: 'Unter welchen Bedingungen sich der Umbau auf andere Schlüssel übertragen lässt und was nicht geht.' },
    },
    {
      name: 'einsatz',
      type: 'select',
      label: 'Wo das Beispiel erscheint',
      hasMany: true,
      required: true,
      options: UMBAU_EINSAETZE.map((value) => ({ label: UMBAU_EINSATZ_LABEL[value], value })),
    },
    {
      name: 'freigabe',
      type: 'checkbox',
      label: 'Fotos freigegeben',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Nur setzen, wenn die Fotos gezeigt werden dürfen und nichts Persönliches erkennbar ist.',
      },
    },
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
