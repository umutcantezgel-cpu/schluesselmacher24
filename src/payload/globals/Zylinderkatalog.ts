import type { GlobalConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { bildFeld, euroFeld, gpsrFeld, infoFeld, slugFeld } from '../fields/gemeinsam';
import { nachGlobalAenderung } from '../hooks/revalidate';

export const BAUFORMEN = [
  { label: 'Doppelzylinder', value: 'doppelzylinder' },
  { label: 'Knaufzylinder', value: 'knaufzylinder' },
  { label: 'Halbzylinder', value: 'halbzylinder' },
];

/** Bauformen, Funktionen und Extras für gleichschließende Zylinder. */
export const Zylinderkatalog: GlobalConfig = {
  slug: 'zylinderkatalog',
  label: 'Zylinderkatalog',
  admin: { group: 'Shop' },
  access: { read: istTeam, update: istInhaber },
  hooks: { afterChange: [nachGlobalAenderung] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Grundwerte',
          fields: [
            { type: 'row', fields: [
              euroFeld('schluesselPreis', 'Preis je weiterem Schlüssel', { required: true, admin: { width: '25%', step: 0.01 } }),
              { name: 'inklusiveSchluessel', type: 'number', label: 'Schlüssel inklusive', required: true, min: 0, max: 20, admin: { width: '25%', step: 1 } },
              { name: 'maxSchluessel', type: 'number', label: 'Höchstens Schlüssel', required: true, min: 1, max: 100, admin: { width: '25%', step: 1 } },
              { name: 'maxZylinder', type: 'number', label: 'Höchstens Zylinder', required: true, min: 1, max: 100, admin: { width: '25%', step: 1 } },
            ] },
            infoFeld('messInfo', 'Erklärung: richtig messen'),
            bildFeld('messGrafik', 'Grafik: richtig messen', '16/9'),
          ],
        },
        {
          label: 'Bauformen',
          fields: [
            {
              name: 'bauformen',
              type: 'array',
              label: 'Bauformen',
              labels: { singular: 'Bauform', plural: 'Bauformen' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'select', label: 'Bauform', required: true, options: BAUFORMEN, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '50%' } },
                  { name: 'aktiv', type: 'checkbox', label: 'Angeboten', defaultValue: true, admin: { width: '20%' } },
                ] },
                { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
                { type: 'row', fields: [
                  { name: 'masse', type: 'select', label: 'Abgefragte Maße', required: true, options: [
                    { label: 'Außen und innen', value: 'beide' },
                    { label: 'Nur eines', value: 'eines' },
                  ], admin: { width: '34%' } },
                  { name: 'massLabelA', type: 'text', label: 'Bezeichnung Maß A', required: true, admin: { width: '33%' } },
                  { name: 'massLabelB', type: 'text', label: 'Bezeichnung Maß B', admin: { width: '33%' } },
                ] },
                { type: 'row', fields: [
                  { name: 'minMm', type: 'number', label: 'Kleinstes Maß (mm)', required: true, min: 10, max: 200, admin: { width: '25%' } },
                  { name: 'maxMm', type: 'number', label: 'Größtes Maß (mm)', required: true, min: 10, max: 200, admin: { width: '25%' } },
                  { name: 'schrittMm', type: 'number', label: 'Schritt (mm)', required: true, min: 1, max: 20, admin: { width: '25%' } },
                  { name: 'grundlaengeMm', type: 'number', label: 'Grundlänge (mm)', required: true, min: 10, max: 200, admin: { width: '25%' } },
                ] },
                { type: 'row', fields: [
                  euroFeld('grundpreis', 'Grundpreis', { required: true, admin: { width: '50%', step: 0.01 } }),
                  euroFeld('laengenAufpreis', 'Aufpreis je angefangene 5 mm', { required: true, admin: { width: '50%', step: 0.01 } }),
                ] },
                infoFeld('info', 'Erklärung'),
                bildFeld('grafik', 'Grafik', '4/3'),
              ],
            },
          ],
        },
        {
          label: 'Funktionen',
          fields: [
            {
              name: 'funktionen',
              type: 'array',
              label: 'Funktionen',
              labels: { singular: 'Funktion', plural: 'Funktionen' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'text', label: 'Kennung', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '50%' } },
                  { name: 'aktiv', type: 'checkbox', label: 'Angeboten', defaultValue: true, admin: { width: '20%' } },
                ] },
                { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
                { type: 'row', fields: [
                  euroFeld('aufpreis', 'Aufpreis', { required: true, admin: { width: '40%', step: 0.01 } }),
                  { name: 'bauformen', type: 'select', label: 'Für Bauformen', hasMany: true, required: true, options: BAUFORMEN, admin: { width: '60%' } },
                ] },
                infoFeld('info', 'Erklärung'),
              ],
            },
          ],
        },
        {
          label: 'Extras',
          fields: [
            {
              name: 'extras',
              type: 'array',
              label: 'Extras',
              labels: { singular: 'Extra', plural: 'Extras' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'text', label: 'Kennung', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '50%' } },
                  { name: 'aktiv', type: 'checkbox', label: 'Angeboten', defaultValue: true, admin: { width: '20%' } },
                ] },
                { name: 'beschreibung', type: 'textarea', label: 'Beschreibung', required: true },
                { type: 'row', fields: [
                  euroFeld('preis', 'Preis', { required: true, admin: { width: '50%', step: 0.01 } }),
                  { name: 'einheit', type: 'select', label: 'Berechnung', required: true, options: [
                    { label: 'Einmal je Bestellung', value: 'einmal' },
                    { label: 'Je Zylinder', value: 'stueck' },
                  ], admin: { width: '50%' } },
                ] },
                infoFeld('info', 'Erklärung'),
              ],
            },
          ],
        },
        {
          label: 'Hersteller',
          description:
            'Hersteller und Systeme für den Konfigurator (z. B. ABUS, BKS). Der Konfigurator fragt den Hersteller '
            + 'erst ab, wenn mindestens ein Eintrag angeboten wird.',
          fields: [
            {
              name: 'hersteller',
              type: 'array',
              label: 'Hersteller',
              labels: { singular: 'Hersteller', plural: 'Hersteller' },
              fields: [
                { type: 'row', fields: [
                  { name: 'name', type: 'text', label: 'Name', required: true, admin: { width: '40%' } },
                  slugFeld({ name: 'kennung', label: 'Kennung', unique: false, index: false, admin: { width: '40%', description: 'z. B. „abus“.' } }),
                  { name: 'aktiv', type: 'checkbox', label: 'Angeboten', defaultValue: false, admin: { width: '20%' } },
                ] },
                { name: 'beschreibung', type: 'textarea', label: 'Beschreibung' },
                { type: 'row', fields: [
                  euroFeld('aufpreisJeZylinder', 'Aufpreis je Zylinder', { admin: { width: '40%', step: 0.01 } }),
                  {
                    name: 'bauformen',
                    type: 'select',
                    label: 'Für Bauformen',
                    hasMany: true,
                    options: BAUFORMEN,
                    admin: { width: '60%', description: 'Leer = für alle Bauformen.' },
                  },
                ] },
                {
                  name: 'zusatzkomponenten',
                  type: 'array',
                  label: 'Zusatzkomponenten',
                  labels: { singular: 'Zusatzkomponente', plural: 'Zusatzkomponenten' },
                  fields: [
                    { type: 'row', fields: [
                      { name: 'name', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '60%' } },
                      euroFeld('preis', 'Preis', { required: true, admin: { width: '40%', step: 0.01 } }),
                    ] },
                    { name: 'beschreibung', type: 'textarea', label: 'Beschreibung' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Produktsicherheit',
          description: 'Gilt für alle Zylinder aus diesem Katalog.',
          fields: [gpsrFeld()],
        },
      ],
    },
  ],
};
