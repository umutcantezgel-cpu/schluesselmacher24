import type { CollectionConfig } from 'payload';

import { BEWERBUNG_STATUS, statuswechselPruefen, type BewerbungStatus } from '../../lib/partner/bewerbung';
import { feldNurInhaber, istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { euroFeld, kennungFeld } from '../fields/gemeinsam';

/** Auftragsarten der Vermittlung (Bogen PARTNER, G-40). */
export const AUFTRAGSARTEN = [
  { label: 'Autoschlüssel vor Ort', value: 'autoschluessel-vor-ort' },
  { label: 'Schlüsseldienst vor Ort (Tür, Schloss, Zylinder)', value: 'schluesseldienst-vor-ort' },
  { label: 'Montage Zylinder', value: 'montage-zylinder' },
  { label: 'Montage Schließanlage', value: 'montage-schliessanlage' },
  { label: 'Beratung vor Ort', value: 'beratung-vor-ort' },
  { label: 'Einbau elektronischer Systeme', value: 'einbau-elektronik' },
];

/**
 * Partnerbetriebe (G-39, G-40, MA-16): Bewerbungsstand mit Prüfpflichten vor der Freischaltung,
 * Einsatzgebiet und Auftragsarten, Vertrag, Abrechnungsmodell (A aktiv, B erst nach
 * PARTNERMODELL: B). Provisionen sieht und ändert nur der Inhaber (G13).
 */
export const Partnerbetriebe: CollectionConfig = {
  slug: 'partnerbetriebe',
  labels: { singular: 'Partnerbetrieb', plural: 'Partnerbetriebe' },
  admin: {
    group: 'Aufträge',
    useAsTitle: 'firma',
    defaultColumns: ['firma', 'ort', 'status', 'abrechnungsmodell'],
    description: 'Freischalten erst nach Prüfung von Gewerbe, Identität und Eignung und mit unterschriebenem Vertrag.',
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber },
  trash: true,
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const von = (originalDoc?.status ?? 'eingegangen') as BewerbungStatus;
        const nach = (data?.status ?? von) as BewerbungStatus;
        const p = { ...(originalDoc?.pruefung ?? {}), ...(data?.pruefung ?? {}) };
        const vertrag = { ...(originalDoc?.vertrag ?? {}), ...(data?.vertrag ?? {}) };
        const fehler = statuswechselPruefen(von, nach, { ...p, vertragUnterschrieben: Boolean(vertrag.unterschriebenAm) });
        if (fehler) throw new Error(fehler);
        if (data?.abrechnungsmodell === 'B' && process.env.PARTNERMODELL_B !== 'aktiv') {
          throw new Error('Modell B ist ausgeschaltet, bis Anwalt und Steuerberatung es freigeben (PARTNERMODELL: B).');
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firma', type: 'text', label: 'Firma', required: true, admin: { width: '50%' } },
        { name: 'ansprechpartner', type: 'text', label: 'Ansprechperson', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'E-Mail', admin: { width: '34%' } },
        { name: 'telefon', type: 'text', label: 'Telefon', admin: { width: '33%' } },
        { name: 'ort', type: 'text', label: 'Ort', required: true, admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'select', label: 'Stand', required: true, defaultValue: 'eingegangen', options: [...BEWERBUNG_STATUS], index: true, admin: { width: '50%' } },
        {
          name: 'abrechnungsmodell',
          type: 'select',
          label: 'Abrechnung',
          required: true,
          defaultValue: 'A',
          options: [
            { label: 'A: Partner rechnet ab, Provision per Rechnung', value: 'A' },
            { label: 'B: Kunde zahlt an uns (ausgeschaltet)', value: 'B' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'einsatzgebiet',
      type: 'group',
      label: 'Einsatzgebiet',
      fields: [
        { name: 'postleitzahlen', type: 'text', label: 'Postleitzahlen', admin: { description: 'Kommagetrennt, auch Bereiche wie 355*.' } },
        { name: 'radiusKm', type: 'number', label: 'Umkreis (km)', min: 0, max: 300 },
      ],
    },
    { name: 'auftragsarten', type: 'select', label: 'Auftragsarten', hasMany: true, options: AUFTRAGSARTEN },
    {
      name: 'pruefung',
      type: 'group',
      label: 'Prüfung vor der Freischaltung (MA-16)',
      fields: [
        { type: 'row', fields: [
          { name: 'gewerbeGeprueft', type: 'checkbox', label: 'Gewerbe geprüft', admin: { width: '33%' } },
          { name: 'identitaetGeprueft', type: 'checkbox', label: 'Identität geprüft', admin: { width: '33%' } },
          { name: 'eignungGeprueft', type: 'checkbox', label: 'Fachliche Eignung geprüft', admin: { width: '34%' } },
        ] },
        { name: 'notiz', type: 'textarea', label: 'Notiz zur Prüfung' },
      ],
    },
    {
      name: 'vertrag',
      type: 'group',
      label: 'Vertrag',
      fields: [
        { type: 'row', fields: [
          { name: 'versendetAm', type: 'date', label: 'Versendet am', admin: { width: '50%' } },
          { name: 'unterschriebenAm', type: 'date', label: 'Unterschrieben am', admin: { width: '50%' } },
        ] },
        { name: 'datei', type: 'relationship', relationTo: 'interne-dateien', label: 'Unterschriebener Vertrag' },
      ],
    },
    {
      name: 'provisionen',
      type: 'array',
      label: 'Provision je Auftragsart',
      access: { read: feldNurInhaber, update: feldNurInhaber, create: feldNurInhaber },
      admin: { description: 'Nur für den Inhaber sichtbar.' },
      fields: [
        { type: 'row', fields: [
          { name: 'auftragsart', type: 'select', label: 'Auftragsart', required: true, options: AUFTRAGSARTEN, admin: { width: '40%' } },
          { name: 'prozent', type: 'number', label: 'Prozent', min: 0, max: 100, admin: { width: '30%', step: 0.5 } },
          euroFeld('festbetrag', 'Fester Betrag', { admin: { width: '30%', step: 0.01 } }),
        ] },
      ],
    },
    { name: 'bewerbung', type: 'relationship', relationTo: 'vorgaenge', label: 'Bewerbung (Vorgang)', filterOptions: { art: { equals: 'partner' } } },
    { name: 'notiz', type: 'textarea', label: 'Interne Notiz' },
    kennungFeld(),
  ],
};
