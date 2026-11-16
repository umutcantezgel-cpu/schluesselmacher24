import type { CollectionConfig } from 'payload';

import { BEWERBUNG_STATUS, statuswechselPruefen, type BewerbungStatus } from '../../lib/partner/bewerbung';
import { GERAETE_ARTEN, MAX_ERFAHRUNG_JAHRE, MAX_GERAETE, MAX_RADIUS_KM } from '../../lib/partner/bewerbungsformular';
import { AUFTRAGSART_OPTIONEN } from '../../lib/partner/leistungen';
import { feldNurInhaber, istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { euroFeld, kennungFeld } from '../fields/gemeinsam';
import { auftragsartenPruefen, bewerbungUebernehmen, provisionenPruefen } from '../hooks/partner-bewerbung';
import { partnervertragEndpunkte } from '../hooks/partnervertrag-pdf';

/**
 * Auftragsarten der Vermittlung (Bogen PARTNER, G-40; FA-PLATTFORM-01): die neun Leistungen des Inhabers,
 * dazu der Sammelwert für Autoschlüssel-Aufträge und die früheren Werte, damit alte Daten lesbar bleiben
 * (G6). Neu wählen lassen sich am Partnerbetrieb nur die neun (`auftragsartenPruefen`), bei Provisionen und
 * am Vorgang dazu der Sammelwert (`provisionenPruefen`, `auftragsartAmVorgangPruefen`).
 */
export const AUFTRAGSARTEN = AUFTRAGSART_OPTIONEN;

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
  endpoints: partnervertragEndpunkte,
  hooks: {
    // Bewerbung verknüpft: leere Felder aus dem Formular übernehmen (FA-PLATTFORM-01).
    beforeValidate: [bewerbungUebernehmen],
    beforeChange: [
      ({ data, originalDoc }) => {
        // Nur Autoschlüssel und Fahrzeugschlüssel (FA-07-02): frühere Auftragsarten nicht neu setzen.
        const artFehler = auftragsartenPruefen(data?.auftragsarten, originalDoc?.auftragsarten);
        if (artFehler) throw new Error(artFehler);
        const provisionFehler = provisionenPruefen(data?.provisionen, originalDoc?.provisionen);
        if (provisionFehler) throw new Error(provisionFehler);
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
        { name: 'email', type: 'email', label: 'E-Mail', admin: { width: '50%' } },
        { name: 'telefon', type: 'text', label: 'Telefon', admin: { width: '50%' } },
      ],
    },
    {
      // Region des Betriebs (FA-08-09): Postleitzahl und Ort des Betriebssitzes.
      type: 'row',
      fields: [
        {
          name: 'plz',
          type: 'text',
          label: 'Postleitzahl',
          admin: { width: '30%' },
          validate: (wert: unknown) => (wert === null || wert === undefined || wert === '' || /^\d{5}$/.test(String(wert)) ? true : 'Bitte fünf Ziffern.'),
        },
        { name: 'ort', type: 'text', label: 'Ort', required: true, admin: { width: '70%' } },
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
            // Modell des Inhabers für Plattformaufträge (FA-KERN-03, A-049); wählbar mit PARTNERMODELL_B=aktiv.
            { label: 'B: Kunde zahlt an Schlüsselmacher24, Auszahlung an den Partner', value: 'B' },
          ],
          admin: {
            width: '50%',
            description: 'B ist erst wählbar, wenn der Schalter PARTNERMODELL_B nach rechtlicher Klärung eingeschaltet ist.',
          },
        },
      ],
    },
    {
      name: 'einsatzgebiet',
      type: 'group',
      label: 'Einsatzgebiet',
      fields: [
        {
          name: 'postleitzahlen',
          type: 'text',
          label: 'Postleitzahlen',
          admin: {
            description:
              'Kommagetrennt, auch Bereiche wie 355*. Ohne Postleitzahlen keine Zuordnung: Der Umkreis wird noch nicht ausgewertet. Bitte Postleitzahlen eintragen.',
          },
        },
        { name: 'radiusKm', type: 'number', label: 'Umkreis (km)', min: 0, max: MAX_RADIUS_KM },
      ],
    },
    {
      name: 'auftragsarten',
      type: 'select',
      label: 'Leistungen und Auftragsarten',
      hasMany: true,
      options: AUFTRAGSARTEN,
      admin: {
        description:
          'Nur Autoschlüssel und Fahrzeugschlüssel. Wählbar sind die neun Leistungen; Werte mit „früher“ bleiben lesbar, lassen sich aber nicht neu setzen.',
      },
    },
    {
      // Werkstatt und mobiler Einsatz (FA-08-12, FA-07-15); füllt die Bewerbung.
      name: 'werkstatt',
      type: 'group',
      label: 'Werkstatt und mobiler Einsatz',
      fields: [
        { type: 'row', fields: [
          {
            name: 'vorhanden',
            type: 'select',
            label: 'Feste Werkstatt',
            options: [
              { label: 'ja', value: 'ja' },
              { label: 'nein', value: 'nein' },
            ],
            admin: { width: '30%' },
          },
          { name: 'mobil', type: 'checkbox', label: 'Mobiler Einsatz beim Kunden', admin: { width: '70%' } },
        ] },
        { name: 'anschrift', type: 'text', label: 'Anschrift der Werkstatt' },
      ],
    },
    {
      // Geräte (FA-08-11, FA-07-15): Hersteller und Typ als freie Angabe (R12: nur sachlich).
      name: 'geraete',
      type: 'array',
      label: 'Geräte',
      maxRows: MAX_GERAETE,
      labels: { singular: 'Gerät', plural: 'Geräte' },
      fields: [
        { type: 'row', fields: [
          { name: 'art', type: 'select', label: 'Art', required: true, options: [...GERAETE_ARTEN], admin: { width: '34%' } },
          { name: 'hersteller', type: 'text', label: 'Hersteller', admin: { width: '33%' } },
          { name: 'typ', type: 'text', label: 'Typ', admin: { width: '33%' } },
        ] },
      ],
    },
    {
      // Erfahrung (FA-08-14, FA-07-14); füllt die Bewerbung.
      name: 'erfahrung',
      type: 'group',
      label: 'Erfahrung',
      fields: [
        { name: 'jahre', type: 'number', label: 'Jahre mit Autoschlüsseln', min: 0, max: MAX_ERFAHRUNG_JAHRE },
        { name: 'schwerpunkte', type: 'textarea', label: 'Schwerpunkte' },
        { name: 'fahrzeugabdeckung', type: 'textarea', label: 'Fahrzeugabdeckung', admin: { description: 'Marken und Baujahre laut Betrieb, freie Angabe.' } },
      ],
    },
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
      // Partnervertrag als PDF aus der Vorlage (E7-OPUS-01, G-39); ohne Vorlage des Anwalts ein Entwurf.
      name: 'partnervertragPdf',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '/payload/components/PartnervertragKnopf#PartnervertragKnopf' } },
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
    {
      // Konto beim Zahlungsdienst (FA-KERN-04): nur für die vorbereitete Auszahlung über Stripe Connect.
      name: 'kontoKennung',
      type: 'text',
      label: 'Konto-Kennung beim Zahlungsdienst',
      admin: {
        description: 'Freiwillig. Kennung des verbundenen Kontos bei Stripe Connect (acct_…). Ohne sie zahlt das Team von Hand aus.',
      },
      validate: (wert: unknown) =>
        wert === null || wert === undefined || wert === '' || /^acct_[A-Za-z0-9]{6,64}$/.test(String(wert))
          ? true
          : 'Bitte eine Kennung im Format acct_… eintragen.',
    },
    {
      // Vorgänge dieses Partners mit offener, freigegebener oder gesperrter Auszahlung (FA-KERN-04). Nur Anzeige.
      name: 'offeneAuszahlungen',
      type: 'join',
      collection: 'vorgaenge',
      on: 'vermittlung.partnerbetrieb',
      label: 'Vorgänge mit offener Auszahlung',
      where: { 'auszahlung.stand': { in: ['offen', 'freigegeben', 'gesperrt'] } },
      defaultLimit: 50,
      admin: { allowCreate: false, defaultColumns: ['nummer', 'vermittlung.status', 'auszahlung.stand', 'vermittlung.partnerbetragCent'] },
    },
    {
      name: 'bewerbung',
      type: 'relationship',
      relationTo: 'vorgaenge',
      label: 'Bewerbung (Vorgang)',
      filterOptions: { art: { equals: 'partner' } },
      admin: { description: 'Beim Verknüpfen füllt der Server leere Felder aus der Bewerbung.' },
    },
    { name: 'notiz', type: 'textarea', label: 'Interne Notiz' },
    kennungFeld(),
  ],
};
