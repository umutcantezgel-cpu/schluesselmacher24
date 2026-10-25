import path from 'node:path';
import type { CollectionConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';

/**
 * Interne Unterlagen des Betriebs, etwa Fotos von Zertifikaten zu den
 * Nachweisen. Privat: nur das angemeldete Team kann sie abrufen — anders als
 * die öffentlichen `medien`.
 */
export const InterneDateien: CollectionConfig = {
  slug: 'interne-dateien',
  labels: { singular: 'Interne Datei', plural: 'Interne Dateien' },
  admin: {
    group: 'Verwaltung',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'beschreibung', 'updatedAt'],
    description: 'Nur für das Team sichtbar, z. B. Fotos von Zertifikaten und Versicherungsnachweisen.',
  },
  access: {
    read: istTeam,
    create: istTeam,
    update: istTeam,
    delete: istInhaber,
  },
  upload: {
    // Außerhalb von public/ und getrennt von den öffentlichen Medien.
    staticDir: path.resolve(process.cwd(), 'private-uploads', 'intern'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'],
  },
  fields: [{ name: 'beschreibung', type: 'text', label: 'Beschreibung' }],
};
