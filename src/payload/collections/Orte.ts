import type { CollectionConfig } from 'payload';

import { istTeam } from '../access/rollen';

const nie = () => false;

/**
 * Ortsstamm (FA-PLATTFORM-03, A-051): alle Gemeinden aus dem Gemeindeverzeichnis des Statistischen Bundesamtes
 * mit Kreis, Land, Postleitzahlen und Mittelpunkt. Reine Stammdaten, keine Seiten: Ortsseiten bleiben
 * redaktionelle Einträge unter „Einsatzgebiete“ und verweisen auf den Stamm.
 *
 * Gepflegt wird der Stamm nur über den Import (scripts/orte-import.mjs) und den Seed (src/lib/orte/uebernahme.ts);
 * im Admin ist er nur lesbar, damit eine Hand-Änderung nicht beim nächsten Stand verloren geht.
 */
export const Orte: CollectionConfig = {
  slug: 'orte',
  labels: { singular: 'Ort (Stamm)', plural: 'Orte (Stamm)' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kreisName', 'land', 'plzVerwaltungssitz', 'einwohner', 'aktiv'],
    listSearchableFields: ['name', 'gemeindeschluessel', 'plzVerwaltungssitz', 'kreisName'],
    description:
      'Alle Gemeinden laut Gemeindeverzeichnis (Statistisches Bundesamt) mit Postleitzahlen von GeoNames. Nur lesbar; '
      + 'aktualisiert wird über den Import (content/orte/LIZENZ.md, Abschnitt Aktualisierung). Aus einem Eintrag entsteht keine Seite.',
  },
  access: { read: istTeam, create: nie, update: nie, delete: nie },
  defaultSort: 'gemeindeschluessel',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true, index: true, admin: { width: '40%' } },
        { name: 'bezeichnung', type: 'text', label: 'Bezeichnung', admin: { width: '30%', description: 'Wie im Gemeindeverzeichnis, etwa „Stadt“.' } },
        {
          name: 'art',
          type: 'select',
          label: 'Art',
          required: true,
          admin: { width: '30%' },
          options: [
            { label: 'Markt', value: 'markt' },
            { label: 'Kreisfreie Stadt', value: 'kreisfreie-stadt' },
            { label: 'Stadtkreis', value: 'stadtkreis' },
            { label: 'Stadt', value: 'stadt' },
            { label: 'Gemeinde', value: 'gemeinde' },
            { label: 'Große Kreisstadt', value: 'grosse-kreisstadt' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'gemeindeschluessel',
          type: 'text',
          label: 'Amtlicher Gemeindeschlüssel',
          required: true,
          unique: true,
          index: true,
          admin: { width: '34%' },
        },
        { name: 'regionalschluessel', type: 'text', label: 'Regionalschlüssel', admin: { width: '33%' } },
        {
          name: 'slug',
          type: 'text',
          label: 'Adresse für eine Ortsseite',
          index: true,
          admin: { width: '33%', description: 'Eindeutig; bei gleichnamigen Gemeinden mit Kreis oder Land als Zusatz.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'kreisSchluessel', type: 'text', label: 'Kreisschlüssel', index: true, admin: { width: '20%' } },
        { name: 'kreisName', type: 'text', label: 'Kreis', admin: { width: '40%' } },
        { name: 'landSchluessel', type: 'text', label: 'Landesschlüssel', admin: { width: '15%' } },
        { name: 'land', type: 'text', label: 'Land', admin: { width: '25%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'plzVerwaltungssitz', type: 'text', label: 'Postleitzahl des Verwaltungssitzes', index: true, admin: { width: '34%' } },
        { name: 'einwohner', type: 'number', label: 'Einwohner', admin: { width: '33%' } },
        { name: 'aktiv', type: 'checkbox', label: 'Im aktuellen Gebietsstand', defaultValue: true, admin: { width: '33%' } },
      ],
    },
    {
      name: 'postleitzahlen',
      type: 'textarea',
      label: 'Postleitzahlen',
      admin: { description: 'Postleitzahlen mit eindeutiger Zuordnung zu dieser Gemeinde (GeoNames). Ortsteile führt das Gemeindeverzeichnis nicht.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'breite', type: 'number', label: 'Breitengrad', admin: { width: '33%' } },
        { name: 'laenge', type: 'number', label: 'Längengrad', admin: { width: '33%' } },
        { name: 'stand', type: 'text', label: 'Gebietsstand', admin: { width: '34%' } },
      ],
    },
  ],
};
