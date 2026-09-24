import type { CollectionConfig, Field } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { BEREICHE, PROZESSE } from '../fields/gemeinsam';

export const VORGANG_STATUS = [
  { label: 'Neu', value: 'neu' },
  { label: 'In Prüfung', value: 'in-pruefung' },
  { label: 'Geprüft', value: 'geprueft' },
  { label: 'Wartet auf Kunde', value: 'wartet-auf-kunde' },
  { label: 'In Fertigung', value: 'in-fertigung' },
  { label: 'Terminiert', value: 'terminiert' },
  { label: 'Versendet', value: 'versendet' },
  { label: 'Abgeschlossen', value: 'abgeschlossen' },
  { label: 'Storniert', value: 'storniert' },
];

const AKTEURE = [
  { label: 'Kunde', value: 'kunde' },
  { label: 'Team', value: 'team' },
  { label: 'System', value: 'system' },
];

const nurLesen = { readOnly: true };

function eintragFelder(): Field[] {
  return [
    {
      type: 'row',
      fields: [
        { name: 'am', type: 'date', label: 'Zeitpunkt', required: true, admin: { width: '30%', date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm' } } },
        { name: 'von', type: 'select', label: 'Von', required: true, defaultValue: 'team', options: AKTEURE, admin: { width: '20%' } },
        { name: 'text', type: 'textarea', label: 'Eintrag', required: true, admin: { width: '50%' } },
      ],
    },
  ];
}

/**
 * Bestellungen, Anfragen, Termine und Projekte.
 *
 * Vorgänge entstehen nur auf dem Server (Kasse, Formulare, Buchung) — über
 * das Backend und die Programmierschnittstelle kann niemand einen anlegen.
 * Beträge und Positionen sind festgeschrieben; das Team pflegt Status,
 * Zahlungsstand und interne Notizen.
 */
export const Vorgaenge: CollectionConfig = {
  slug: 'vorgaenge',
  labels: { singular: 'Vorgang', plural: 'Vorgänge' },
  admin: {
    group: 'Aufträge',
    useAsTitle: 'nummer',
    defaultColumns: ['nummer', 'art', 'bereich', 'status', 'createdAt'],
    listSearchableFields: ['nummer', 'kontakt.email', 'kontakt.nachname', 'kontakt.firma'],
    pagination: { defaultLimit: 50 },
    description: 'Alle Bestellungen, Anfragen, Termine und Projekte. Neueste oben.',
  },
  defaultSort: '-createdAt',
  access: {
    read: istTeam,
    create: () => false,
    update: istTeam,
    delete: istInhaber,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'nummer', type: 'text', label: 'Vorgangsnummer', required: true, unique: true, index: true, admin: { width: '25%', ...nurLesen } },
        {
          name: 'art',
          type: 'select',
          label: 'Art',
          required: true,
          options: [
            { label: 'Bestellung', value: 'bestellung' },
            { label: 'Anfrage', value: 'anfrage' },
            { label: 'Termin', value: 'termin' },
            { label: 'Projekt', value: 'projekt' },
          ],
          admin: { width: '25%', ...nurLesen },
        },
        { name: 'bereich', type: 'select', label: 'Bereich', required: true, options: BEREICHE, admin: { width: '25%', ...nurLesen } },
        { name: 'prozess', type: 'select', label: 'Ablauf', required: true, options: PROZESSE, admin: { width: '25%', ...nurLesen } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'neu',
      index: true,
      options: VORGANG_STATUS,
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Übersicht',
          fields: [
            {
              name: 'zusammenfassung',
              type: 'array',
              label: 'Angaben des Kunden',
              admin: nurLesen,
              fields: [
                { name: 'titel', type: 'text', label: 'Abschnitt' },
                {
                  name: 'zeilen',
                  type: 'array',
                  label: 'Zeilen',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', label: 'Angabe', admin: { width: '40%' } },
                        { name: 'wert', type: 'text', label: 'Wert', admin: { width: '60%' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'dateien',
              type: 'relationship',
              relationTo: 'kundendateien',
              hasMany: true,
              label: 'Hochgeladene Dateien',
              admin: nurLesen,
            },
            {
              name: 'termin',
              type: 'group',
              label: 'Termin',
              admin: { condition: (data) => data?.art === 'termin' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'datum', type: 'text', label: 'Datum', admin: { width: '25%', ...nurLesen } },
                    { name: 'uhrzeit', type: 'text', label: 'Uhrzeit', admin: { width: '25%', ...nurLesen } },
                    { name: 'dauerMinuten', type: 'number', label: 'Dauer (Minuten)', admin: { width: '25%', ...nurLesen } },
                    {
                      name: 'ort',
                      type: 'select',
                      label: 'Ort',
                      options: [
                        { label: 'Werkstatt', value: 'werkstatt' },
                        { label: 'Vor Ort', value: 'vor-ort' },
                      ],
                      admin: { width: '25%', ...nurLesen },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Positionen',
          admin: { condition: (data) => data?.art === 'bestellung' },
          description: 'Beim Bestellen festgeschrieben — spätere Preisänderungen ändern diese Angaben nicht.',
          fields: [
            {
              name: 'positionen',
              type: 'array',
              label: 'Positionen',
              labels: { singular: 'Position', plural: 'Positionen' },
              admin: nurLesen,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'bezeichnung', type: 'text', label: 'Artikel', required: true, admin: { width: '40%' } },
                    { name: 'kennung', type: 'text', label: 'Kennung', required: true, index: true, admin: { width: '20%' } },
                    {
                      name: 'art',
                      type: 'select',
                      label: 'Art',
                      required: true,
                      options: [
                        { label: 'Schlüssel nach Code', value: 'code-schluessel' },
                        { label: 'Gleichschließende Zylinder', value: 'zylinder-schliessung' },
                        { label: 'Standardartikel', value: 'standard' },
                      ],
                      admin: { width: '40%' },
                    },
                  ],
                },
                { name: 'details', type: 'textarea', label: 'Angaben' },
                {
                  type: 'row',
                  fields: [
                    { name: 'menge', type: 'number', label: 'Menge', required: true, admin: { width: '20%' } },
                    { name: 'einzelpreisCent', type: 'number', label: 'Einzelpreis (Cent)', required: true, admin: { width: '30%' } },
                    { name: 'summeCent', type: 'number', label: 'Summe (Cent)', required: true, admin: { width: '30%' } },
                    { name: 'steuersatz', type: 'number', label: 'USt. %', required: true, admin: { width: '20%' } },
                  ],
                },
              ],
            },
            {
              name: 'summen',
              type: 'group',
              label: 'Summen',
              admin: nurLesen,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'artikelCent', type: 'number', label: 'Artikel (Cent)', admin: { width: '25%' } },
                    { name: 'versandCent', type: 'number', label: 'Versand (Cent)', admin: { width: '25%' } },
                    { name: 'gesamtCent', type: 'number', label: 'Gesamt (Cent)', admin: { width: '25%' } },
                    { name: 'steuerCent', type: 'number', label: 'Enthaltene USt. (Cent)', admin: { width: '25%' } },
                  ],
                },
                { name: 'versandart', type: 'text', label: 'Versandart' },
              ],
            },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'kontakt',
              type: 'group',
              label: 'Kontakt',
              admin: nurLesen,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'anrede', type: 'text', label: 'Anrede', admin: { width: '20%' } },
                    { name: 'vorname', type: 'text', label: 'Vorname', required: true, admin: { width: '40%' } },
                    { name: 'nachname', type: 'text', label: 'Nachname', required: true, admin: { width: '40%' } },
                  ],
                },
                { name: 'firma', type: 'text', label: 'Firma' },
                {
                  type: 'row',
                  fields: [
                    { name: 'email', type: 'email', label: 'E-Mail', required: true, admin: { width: '50%' } },
                    { name: 'telefon', type: 'text', label: 'Telefon', required: true, admin: { width: '50%' } },
                  ],
                },
                { name: 'strasse', type: 'text', label: 'Straße und Hausnummer' },
                {
                  type: 'row',
                  fields: [
                    { name: 'plz', type: 'text', label: 'PLZ', admin: { width: '25%' } },
                    { name: 'ort', type: 'text', label: 'Ort', admin: { width: '45%' } },
                    { name: 'land', type: 'text', label: 'Land', required: true, admin: { width: '30%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Zahlung',
          fields: [
            {
              name: 'zahlung',
              type: 'group',
              label: 'Zahlung',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'umfang',
                      type: 'select',
                      label: 'Umfang',
                      options: [
                        { label: 'Anzahlung', value: 'anzahlung' },
                        { label: 'Gesamtbetrag', value: 'gesamt' },
                      ],
                      admin: { width: '25%', ...nurLesen },
                    },
                    { name: 'betragCent', type: 'number', label: 'Betrag (Cent)', admin: { width: '25%', ...nurLesen } },
                    {
                      name: 'status',
                      type: 'select',
                      label: 'Zahlungsstand',
                      options: [
                        { label: 'Offen', value: 'offen' },
                        { label: 'Bezahlt', value: 'bezahlt' },
                        { label: 'Fehlgeschlagen', value: 'fehlgeschlagen' },
                        { label: 'Erstattet', value: 'erstattet' },
                      ],
                      admin: { width: '25%' },
                    },
                    { name: 'bezahltAm', type: 'date', label: 'Bezahlt am', admin: { width: '25%', ...nurLesen } },
                  ],
                },
                { name: 'anbieterRef', type: 'text', label: 'Zahlungskennung (Stripe)', admin: nurLesen },
                { name: 'checkoutSitzung', type: 'text', label: 'Stripe-Checkout-Sitzung', index: true, admin: nurLesen },
                { name: 'erstattetCent', type: 'number', label: 'Erstattet (Cent)', admin: nurLesen },
              ],
            },
          ],
        },
        {
          label: 'Notizen und Verlauf',
          fields: [
            {
              name: 'notizen',
              type: 'array',
              label: 'Interne Notizen',
              labels: { singular: 'Notiz', plural: 'Notizen' },
              admin: { description: 'Nur für das Team sichtbar.' },
              fields: eintragFelder(),
            },
            {
              name: 'verlauf',
              type: 'array',
              label: 'Verlauf',
              admin: nurLesen,
              fields: eintragFelder(),
            },
          ],
        },
      ],
    },
    // Technische Rohdaten — für die Seite nötig, im Backend ausgeblendet.
    { name: 'daten', type: 'json', admin: { hidden: true } },
    { name: 'angebot', type: 'json', admin: { hidden: true } },
    { name: 'uploads', type: 'json', admin: { hidden: true } },
    { name: 'zugriffsHash', type: 'text', admin: { hidden: true }, access: { read: () => false, update: () => false } },
  ],
};
