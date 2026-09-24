import path from 'node:path';
import type { CollectionConfig } from 'payload';

import { istTeam, oeffentlich } from '../access/rollen';

/**
 * Öffentliche Bilder: echte Produkt- und Werkstattfotos. Sobald hier ein Foto
 * hinterlegt und einem Bildplatz zugeordnet ist, ersetzt es den Platzhalter.
 */
export const Medien: CollectionConfig = {
  slug: 'medien',
  labels: { singular: 'Bild', plural: 'Medien' },
  admin: { group: 'Inhalte', defaultColumns: ['filename', 'alt', 'updatedAt'] },
  access: {
    read: oeffentlich,
    create: istTeam,
    update: istTeam,
    delete: istTeam,
  },
  upload: {
    // Nie unter public/, sonst umginge die Auslieferung die Zugriffsprüfung.
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    imageSizes: [
      { name: 'klein', width: 480 },
      { name: 'mittel', width: 960 },
      { name: 'gross', width: 1600 },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Bildbeschreibung (Alternativtext)',
      required: true,
      admin: { description: 'Was ist auf dem Bild zu sehen? Wichtig für Barrierefreiheit und Suchmaschinen.' },
    },
  ],
};
