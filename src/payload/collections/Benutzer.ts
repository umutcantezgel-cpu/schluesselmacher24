import type { CollectionConfig } from 'payload';

import { ROLLEN, feldNurInhaber, hatRolle, istInhaber } from '../access/rollen';
import { anmeldungBegrenzen, erstregistrierungSperren } from '../hooks/benutzer-schutz';

/**
 * Zugänge zum Backend. Es gibt bewusst keine offene Registrierung: Den ersten
 * Zugang legt src/scripts/admin-anlegen.ts aus SEED_ADMIN_EMAIL und
 * SEED_ADMIN_PASSWORD an (im Produktions-Build Pflicht, scripts/build.mjs);
 * /admin/create-first-user ist gesperrt (hooks/benutzer-schutz.ts).
 */
export const Benutzer: CollectionConfig = {
  slug: 'benutzer',
  labels: { singular: 'Benutzer', plural: 'Benutzer' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'rollen'],
    group: 'Verwaltung',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  hooks: {
    beforeOperation: [erstregistrierungSperren, anmeldungBegrenzen],
  },
  access: {
    // Nur Konten mit Backend-Rolle kommen ins Backend.
    admin: ({ req: { user } }) => hatRolle(user, 'inhaber', 'mitarbeiter'),
    create: istInhaber,
    delete: istInhaber,
    unlock: istInhaber,
    read: ({ req: { user } }) => {
      if (hatRolle(user, 'inhaber')) return true;
      return user ? { id: { equals: user.id } } : false;
    },
    update: ({ req: { user } }) => {
      if (hatRolle(user, 'inhaber')) return true;
      return user ? { id: { equals: user.id } } : false;
    },
  },
  fields: [
    { name: 'name', type: 'text', label: 'Name' },
    {
      name: 'rollen',
      type: 'select',
      label: 'Rollen',
      hasMany: true,
      required: true,
      defaultValue: ['mitarbeiter'],
      options: [...ROLLEN],
      saveToJWT: true,
      access: { create: feldNurInhaber, update: feldNurInhaber },
    },
  ],
};
