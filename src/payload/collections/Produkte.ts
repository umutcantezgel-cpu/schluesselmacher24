import type { CollectionConfig } from 'payload';

import { pruefeCodeMuster, codePasst } from '../../lib/code-pattern';
import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import {
  VERSANDKLASSEN,
  bildFeld,
  euroFeld,
  kennungFeld,
  seoFeld,
  slugFeld,
} from '../fields/gemeinsam';
import { loeschsperre } from '../hooks/loeschsperre';
import { erneuernHooks } from '../hooks/revalidate';

const istCodeSchluessel = (data: Record<string, unknown> | undefined) => data?.typ !== 'standard';
const istStandardartikel = (data: Record<string, unknown> | undefined) => data?.typ === 'standard';

/**
 * Artikel im Shop: Schlüssel nach Code und Standardartikel.
 *
 * Sicher pflegbar: Entwürfe mit Versionsverlauf, Papierkorb statt endgültigem
 * Löschen, feste Kennung für Warenkörbe und Bestellungen, geprüfte Codemuster.
 */
export const Produkte: CollectionConfig = {
  slug: 'produkte',
  labels: { singular: 'Artikel', plural: 'Artikel' },
  admin: {
    group: 'Shop',
    useAsTitle: 'name',
    defaultColumns: ['name', 'typ', 'preis', 'beispiel', '_status', 'updatedAt'],
    listSearchableFields: ['name', 'kennung', 'hersteller', 'einsatz'],
    description:
      'Neue Artikel als Entwurf anlegen und erst veröffentlichen, wenn alles stimmt. '
      + 'Nicht mehr angebotene Artikel in den Papierkorb legen — sie lassen sich wiederherstellen.',
    pagination: { defaultLimit: 50 },
  },
  access: {
    read: istTeam,
    create: istTeam,
    update: istTeam,
    delete: papierkorbTeamLoeschenInhaber,
    readVersions: istTeam,
  },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 50 },
  trash: true,
  hooks: { ...erneuernHooks, beforeDelete: [loeschsperre] },
  fields: [
    {
      name: 'typ',
      type: 'select',
      label: 'Art des Artikels',
      required: true,
      defaultValue: 'code_key',
      options: [
        { label: 'Schlüssel nach Code', value: 'code_key' },
        { label: 'Standardartikel', value: 'standard' },
      ],
      admin: { position: 'sidebar' },
    },
    slugFeld(),
    kennungFeld(),
    {
      name: 'beispiel',
      type: 'checkbox',
      label: 'Beispielartikel',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Beispielartikel sind sichtbar und als „Beispiel“ gekennzeichnet, aber nicht bestellbar '
          + 'und nicht in Suchmaschinen.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Artikel',
          fields: [
            { name: 'name', type: 'text', label: 'Name', required: true },
            { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
            {
              type: 'row',
              fields: [
                { name: 'hersteller', type: 'text', label: 'Hersteller', admin: { width: '50%' } },
                { name: 'schluesseltyp', type: 'text', label: 'Schlüsseltyp', admin: { width: '50%' } },
              ],
            },
            { name: 'einsatz', type: 'text', label: 'Einsatzbereich', admin: { description: 'z. B. „Briefkasten“ oder „Büroschrank“.' } },
            { name: 'umfang', type: 'text', label: 'Lieferumfang' },
            {
              name: 'eigenschaften',
              type: 'array',
              label: 'Eigenschaften',
              labels: { singular: 'Eigenschaft', plural: 'Eigenschaften' },
              admin: { condition: istStandardartikel },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', label: 'Merkmal', required: true, admin: { width: '40%' } },
                    { name: 'wert', type: 'text', label: 'Wert', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
            { name: 'lieferzeit', type: 'text', label: 'Lieferzeit', admin: { condition: istStandardartikel } },
            {
              name: 'schlagworte',
              type: 'text',
              label: 'Schlagworte für Filter und Suche',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Preis und Versand',
          fields: [
            euroFeld('preis', 'Preis je Stück', { required: true }),
            {
              name: 'staffeln',
              type: 'array',
              label: 'Mengenrabatte',
              labels: { singular: 'Staffel', plural: 'Staffeln' },
              admin: {
                description:
                  'Rabatt in Prozent ab einer Stückzahl. Ändert sich der Preis, passen sich die Staffeln an.',
              },
              validate: (value: unknown) => {
                const staffeln = (value ?? []) as { abMenge?: number }[];
                const mengen = staffeln.map((s) => s.abMenge);
                return new Set(mengen).size === mengen.length
                  ? true
                  : 'Jede Stückzahl darf nur einmal vorkommen.';
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'abMenge', type: 'number', label: 'Ab Stück', required: true, min: 2, max: 999, admin: { width: '50%', step: 1 } },
                    { name: 'rabattProzent', type: 'number', label: 'Rabatt in %', required: true, min: 0.01, max: 90, admin: { width: '50%', step: 0.5 } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'maxMenge', type: 'number', label: 'Höchstmenge je Bestellung', required: true, defaultValue: 20, min: 1, max: 999, admin: { width: '50%', step: 1 } },
                { name: 'versandklasse', type: 'select', label: 'Versandklasse', required: true, defaultValue: 'code-schluessel', options: VERSANDKLASSEN, admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Code',
          admin: { condition: istCodeSchluessel },
          description: 'Wie der Kunde seinen Schlüsselcode findet und eingibt.',
          fields: [
            { name: 'codeFormat', type: 'text', label: 'Aufbau des Codes (für Kunden)', admin: { description: 'z. B. „3 bis 4 Ziffern“.' } },
            {
              type: 'row',
              fields: [
                {
                  name: 'codeMuster',
                  type: 'text',
                  label: 'Prüfmuster',
                  admin: { width: '60%', description: 'Regulärer Ausdruck, z. B. ^[0-9]{3,4}$ — wird beim Speichern geprüft.' },
                  validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
                    istCodeSchluessel(siblingData) ? pruefeCodeMuster(value) : true,
                },
                {
                  name: 'codeBeispiel',
                  type: 'text',
                  label: 'Beispielcode',
                  admin: { width: '40%' },
                  validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
                    if (!istCodeSchluessel(siblingData)) return true;
                    if (typeof value !== 'string' || !value) return 'Bitte einen Beispielcode eintragen.';
                    const muster = siblingData.codeMuster;
                    if (typeof muster !== 'string' || pruefeCodeMuster(muster) !== true) return true;
                    return codePasst(muster, value) ? true : 'Der Beispielcode passt nicht zum Prüfmuster.';
                  },
                },
              ],
            },
            { name: 'codeHinweis', type: 'textarea', label: 'Wo steht der Code?' },
            bildFeld('codeFundstelle', 'Bild: Fundstelle des Codes', '4/3'),
            {
              type: 'row',
              fields: [
                {
                  name: 'fotoUpload',
                  type: 'select',
                  label: 'Foto vom Schlüssel',
                  defaultValue: 'optional',
                  options: [
                    { label: 'Nicht nötig', value: 'nein' },
                    { label: 'Freiwillig', value: 'optional' },
                    { label: 'Pflicht', value: 'pflicht' },
                  ],
                  admin: { width: '40%' },
                },
                { name: 'fotoHinweis', type: 'text', label: 'Hinweis zum Foto', admin: { width: '60%' } },
              ],
            },
          ],
        },
        {
          label: 'Bilder',
          fields: [
            bildFeld('produktbild', 'Produktbild', '1/1'),
            {
              name: 'weitereBilder',
              type: 'upload',
              relationTo: 'medien',
              hasMany: true,
              label: 'Weitere Fotos',
            },
          ],
        },
        { label: 'Suchmaschinen', fields: [seoFeld()] },
      ],
    },
  ],
};
