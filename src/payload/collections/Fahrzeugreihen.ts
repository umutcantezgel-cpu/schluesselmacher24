import type { CollectionConfig } from 'payload';

import { GEHAEUSE, KLONBARKEIT, LEISTUNGEN } from '../../lib/fahrzeuge/katalog';
import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { kennungFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/**
 * Fahrzeugkatalog (G-14, G-17, G-18, A-009): alle Modellreihen aus der KBA-Statistik FZ 12,
 * dazu die gepflegten Modelle des Bestands. Jede Angabe trägt ihre Quelle; Klonbarkeit erscheint
 * auf der Seite erst nach Bestätigung im Bogen KLONBAR.
 */
export const Fahrzeugreihen: CollectionConfig = {
  slug: 'fahrzeugreihen',
  labels: { singular: 'Fahrzeugreihe', plural: 'Fahrzeugkatalog' },
  admin: {
    group: 'Autoschlüssel',
    useAsTitle: 'reihe',
    defaultColumns: ['marke', 'reihe', 'bestand', 'klonbar', 'sichtbar'],
    listSearchableFields: ['marke', 'reihe', 'kbaName'],
    description: 'Modellreihen für die Fahrzeugsuche. Preise und Schlüsselarten kommen aus den gepflegten Marken und Modellen (Spalte „Gepflegtes Modell“).',
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  trash: true,
  defaultSort: 'marke',
  hooks: erneuernHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'marke', type: 'text', label: 'Marke', required: true, index: true, admin: { width: '34%' } },
        { name: 'reihe', type: 'text', label: 'Modellreihe', required: true, admin: { width: '33%' } },
        { name: 'kbaName', type: 'text', label: 'Name bei KBA', admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'bestand', type: 'number', label: 'Bestand laut KBA', min: 0, admin: { width: '25%' } },
        { name: 'rang', type: 'number', label: 'Rang', min: 1, admin: { width: '25%' } },
        { name: 'segment', type: 'text', label: 'Segment', admin: { width: '25%' } },
        { name: 'sichtbar', type: 'checkbox', label: 'In der Suche', defaultValue: true, admin: { width: '25%' } },
      ],
    },
    { name: 'quelle', type: 'text', label: 'Quelle', required: true, admin: { description: 'Etwa „KBA FZ 12, Stand 1.1.2026“.' } },
    { name: 'bestandsModell', type: 'text', label: 'Gepflegtes Modell', admin: { description: 'Marke/Modell aus „Fahrzeugmarken“, etwa volkswagen/golf. Nur dann zeigt die Seite Preise und Schlüsselarten.' } },
    {
      type: 'row',
      fields: [
        { name: 'baujahrVon', type: 'number', label: 'Baujahr von', min: 1950, max: 2100, admin: { width: '25%' } },
        { name: 'baujahrBis', type: 'number', label: 'Baujahr bis', min: 1950, max: 2100, admin: { width: '25%' } },
        { name: 'baujahrQuelle', type: 'text', label: 'Quelle Bauzeitraum', admin: { width: '50%' } },
      ],
    },
    {
      name: 'transponder',
      type: 'group',
      label: 'Transponder',
      admin: { description: 'Nur mit Quelle; ohne Quelle leer lassen.' },
      fields: [
        { type: 'row', fields: [
          { name: 'typ', type: 'text', label: 'Typ', admin: { width: '40%' } },
          { name: 'quelle', type: 'text', label: 'Quelle', admin: { width: '60%' } },
        ] },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'klonbar',
          type: 'select',
          label: 'Klonbar',
          required: true,
          defaultValue: 'unbekannt',
          options: [...KLONBARKEIT],
          admin: { width: '34%', description: '„Bestätigt“ nur nach dem Bogen KLONBAR.' },
        },
        { name: 'gehaeuse', type: 'select', label: 'Gehäuse', required: true, defaultValue: 'unbekannt', options: [...GEHAEUSE], admin: { width: '33%' } },
        { name: 'leistungen', type: 'select', label: 'Leistungen', hasMany: true, options: [...LEISTUNGEN], admin: { width: '33%' } },
      ],
    },
    {
      name: 'alias',
      type: 'array',
      label: 'Weitere Suchbegriffe',
      labels: { singular: 'Begriff', plural: 'Begriffe' },
      fields: [{ name: 'begriff', type: 'text', label: 'Begriff', required: true }],
    },
    kennungFeld(),
  ],
};
