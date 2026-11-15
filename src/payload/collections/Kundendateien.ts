import path from 'node:path';
import type { CollectionConfig } from 'payload';

import { STECKPLATZ_LABEL, UPLOAD_STECKPLAETZE } from '../../lib/wege/nachweis';
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
    defaultColumns: ['filename', 'kategorie', 'steckplatz', 'vorgang', 'aufbewahrenBis', 'createdAt'],
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
        { label: 'Sicherungskarte', value: 'sicherungskarte' },
        { label: 'Vollmacht', value: 'vollmacht' },
      ],
    },
    {
      // Steckplatz (FA-KERN-02, A-048): welche Aufnahme oder Unterlage die Datei ist. Setzt nur der
      // Upload-Weg nach seiner Prüfung; ältere Dateien haben keinen.
      name: 'steckplatz',
      type: 'select',
      label: 'Steckplatz',
      options: UPLOAD_STECKPLAETZE.map((value) => ({ label: STECKPLATZ_LABEL[value], value })),
      admin: { readOnly: true },
      access: { update: () => false },
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
