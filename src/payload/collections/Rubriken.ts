import type { CollectionConfig } from 'payload';

import {
  RUBRIK_ABSCHLUESSE,
  RUBRIK_ICONS,
  RUBRIK_NACHWEISE,
  RUBRIK_NAVIGATION,
  RUBRIK_STATUS,
  RUBRIK_UPLOADS,
} from '../../lib/rubriken';
import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { BEREICHE, kennungFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

const ICON_OPTIONEN = RUBRIK_ICONS.map((icon) => ({ label: icon, value: icon }));

/**
 * Rubriken des Intent-Hubs und der Navigation (G-03, G-08, G-11, KERN K-014).
 * Eine neue Rubrik entsteht hier als Datensatz: Kachel im Hub, Eintrag in der
 * Navigation, Ablaufschritte und Abschluss ihres Wegs.
 */
export const Rubriken: CollectionConfig = {
  slug: 'rubriken',
  labels: { singular: 'Rubrik', plural: 'Rubriken' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'reihenfolge', 'navigation', 'imHub'],
    description:
      'Kacheln auf der Startseite („Wobei können wir Ihnen helfen?“) und Einträge in der Navigation. Reihenfolge: kleinere Zahl zuerst.',
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { maxPerDoc: 20 },
  trash: true,
  defaultSort: 'reihenfolge',
  hooks: erneuernHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true, admin: { width: '34%' } },
        {
          name: 'laienname',
          type: 'text',
          label: 'Name auf der Kachel',
          required: true,
          maxLength: 40,
          admin: { width: '33%', description: 'Höchstens zwei kurze Zeilen.' },
        },
        {
          name: 'zusatz',
          type: 'text',
          label: 'Laienerklärung (immer sichtbar)',
          maxLength: 48,
          admin: { width: '33%', description: 'Etwa „ein Schlüssel für alle Türen“. Leer lassen, wenn der Name genügt.' },
        },
      ],
    },
    {
      name: 'erklaerung',
      type: 'textarea',
      label: 'Ein Satz, was hier passiert',
      required: true,
      maxLength: 140,
    },
    {
      type: 'row',
      fields: [
        { name: 'icon', type: 'select', label: 'Symbol', required: true, options: ICON_OPTIONEN, admin: { width: '34%' } },
        {
          name: 'ziel',
          type: 'text',
          label: 'Ziel (Adresse)',
          required: true,
          admin: { width: '33%', description: 'Beginnt mit „/“, etwa /autoschluessel.' },
          validate: (wert: string | null | undefined) =>
            typeof wert === 'string' && /^\/[a-z0-9\-/]*$/.test(wert) ? true : 'Bitte eine Adresse der Seite angeben, etwa /autoschluessel.',
        },
        { name: 'bereich', type: 'select', label: 'Bereich (Farbe, Vorgänge)', required: true, options: BEREICHE, admin: { width: '33%' } },
      ],
    },
    {
      name: 'ablauf',
      type: 'array',
      label: 'So läuft Ihr Auftrag ab',
      labels: { singular: 'Schritt', plural: 'Schritte' },
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'titel', type: 'text', label: 'Schritt', required: true, admin: { width: '35%' } },
            { name: 'text', type: 'text', label: 'Erklärung', required: true, admin: { width: '45%' } },
            { name: 'icon', type: 'select', label: 'Symbol', required: true, options: ICON_OPTIONEN, admin: { width: '20%' } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'abschluss', type: 'select', label: 'Abschluss', required: true, options: [...RUBRIK_ABSCHLUESSE], admin: { width: '34%' } },
        {
          name: 'nachweis',
          type: 'select',
          label: 'Berechtigungsnachweis',
          required: true,
          defaultValue: 'keiner',
          options: [...RUBRIK_NACHWEISE],
          admin: { width: '33%' },
        },
        {
          name: 'pflichtUploads',
          type: 'select',
          label: 'Pflicht-Uploads',
          hasMany: true,
          options: RUBRIK_UPLOADS.map((k) => ({ label: k, value: k })),
          admin: { width: '33%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Sichtbarkeit',
          required: true,
          defaultValue: 'spaeter',
          options: [...RUBRIK_STATUS],
          admin: { width: '25%' },
        },
        { name: 'reihenfolge', type: 'number', label: 'Reihenfolge', required: true, defaultValue: 100, admin: { width: '25%' } },
        {
          name: 'navigation',
          type: 'select',
          label: 'Gruppe in der Navigation',
          required: true,
          options: [...RUBRIK_NAVIGATION],
          admin: { width: '25%' },
        },
        { name: 'imHub', type: 'checkbox', label: 'Kachel auf der Startseite', defaultValue: true, admin: { width: '25%' } },
      ],
    },
    kennungFeld(),
  ],
};
