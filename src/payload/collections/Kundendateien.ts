import path from 'node:path';
import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';

/**
 * Dateien, die Kunden über Formulare hochladen (Schlüsselfotos, Fahrzeugschein,
 * Grundrisse). Privat: nur das Team sieht sie. Anlegen nur über den eigenen
 * Upload-Weg der Seite (Prüfung von Größe und Dateityp), nie über das Backend.
 */
export const Kundendateien: CollectionConfig = {
  slug: 'kundendateien',
  labels: { singular: 'Kundendatei', plural: 'Kundendateien' },
  admin: {
    group: 'Aufträge',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'kategorie', 'vorgang', 'aufbewahrenBis', 'createdAt'],
    description: 'Von Kunden hochgeladene Unterlagen. Werden nach Ablauf der Aufbewahrungsfrist gelöscht.',
  },
  access: {
    read: istTeam,
    create: () => false,
    update: istTeam,
    delete: istInhaber,
  },
  upload: {
    // Außerhalb von public/ und getrennt von den öffentlichen Medien.
    staticDir: path.resolve(process.cwd(), 'private-uploads'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'],
  },
  fields: [
    {
      name: 'kategorie',
      type: 'select',
      label: 'Art',
      required: true,
      options: [
        { label: 'Schlüsselfoto', value: 'schluesselfoto' },
        { label: 'Fahrzeugschein', value: 'fahrzeugschein' },
        { label: 'Grundriss', value: 'grundriss' },
        { label: 'Dokument', value: 'dokument' },
        { label: 'Objektfoto', value: 'objektfoto' },
      ],
    },
    { name: 'vorgang', type: 'relationship', relationTo: 'vorgaenge', label: 'Vorgang', index: true },
    {
      name: 'aufbewahrenBis',
      type: 'date',
      label: 'Aufbewahren bis',
      index: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'uploadSchluesselHash',
      type: 'text',
      admin: { hidden: true },
      access: { read: () => false, update: () => false },
    },
  ],
};
