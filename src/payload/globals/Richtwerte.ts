import type { GlobalConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { euroFeld } from '../fields/gemeinsam';
import { nachGlobalAenderung } from '../hooks/revalidate';

const spanne = (prefix: string, label: string) => ({
  type: 'row' as const,
  fields: [
    euroFeld(`${prefix}Von`, `${label} von`, { admin: { width: '50%', step: 0.01 } }),
    euroFeld(`${prefix}Bis`, `${label} bis`, { admin: { width: '50%', step: 0.01 } }),
  ],
});

/**
 * Richtwerte für die Orientierungsrechner der Seite. Die Rechner nennen nur
 * Spannen als „unverbindliche Orientierung“. Solange „Noch Platzhalter“
 * angehakt ist, zeigen sie keine Beträge, sondern bitten um eine Anfrage.
 */
export const Richtwerte: GlobalConfig = {
  slug: 'richtwerte',
  label: 'Richtwerte für Rechner',
  admin: { group: 'Shop' },
  access: { read: istTeam, update: istInhaber },
  hooks: { afterChange: [nachGlobalAenderung] },
  fields: [
    {
      name: 'platzhalter',
      type: 'checkbox',
      label: 'Noch Platzhalter — Rechner zeigen keine Beträge',
      defaultValue: true,
      admin: { description: 'Erst entfernen, wenn alle Spannen unten geprüft sind.' },
    },
    {
      name: 'hinweis',
      type: 'textarea',
      label: 'Hinweis unter jedem Rechner',
      defaultValue:
        'Unverbindliche Orientierung. Der tatsächliche Preis hängt von Tür, Einbausituation und '
        + 'Material ab und steht erst nach unserer Prüfung fest.',
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'tuerAbsicherung',
          label: 'Türabsicherung',
          description: 'Rechner auf der Seite „Tür- und Schließtechnik“.',
          fields: [
            {
              name: 'tuerarten',
              type: 'array',
              label: 'Türarten',
              labels: { singular: 'Türart', plural: 'Türarten' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'text', label: 'Kennung', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '70%' } },
                ] },
                { name: 'beschreibung', type: 'text', label: 'Kurzbeschreibung' },
                spanne('preis', 'Richtwert'),
              ],
            },
            {
              name: 'massnahmen',
              type: 'array',
              label: 'Maßnahmen',
              labels: { singular: 'Maßnahme', plural: 'Maßnahmen' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'text', label: 'Kennung', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '70%' } },
                ] },
                { name: 'beschreibung', type: 'text', label: 'Kurzbeschreibung' },
                spanne('preis', 'Richtwert'),
              ],
            },
          ],
        },
        {
          name: 'serviceEinsatz',
          label: 'Serviceeinsatz',
          description: 'Rechner auf der Seite „Service und Termin“.',
          fields: [
            {
              name: 'leistungen',
              type: 'array',
              label: 'Leistungen',
              labels: { singular: 'Leistung', plural: 'Leistungen' },
              fields: [
                { type: 'row', fields: [
                  { name: 'kennung', type: 'text', label: 'Kennung', required: true, admin: { width: '30%' } },
                  { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '50%' } },
                  {
                    name: 'einheit',
                    type: 'select',
                    label: 'Berechnung',
                    required: true,
                    defaultValue: 'pauschal',
                    options: [
                      { label: 'Pauschal', value: 'pauschal' },
                      { label: 'Je Tür', value: 'je-tuer' },
                    ],
                    admin: { width: '20%' },
                  },
                ] },
                { name: 'beschreibung', type: 'text', label: 'Kurzbeschreibung' },
                spanne('preis', 'Richtwert'),
              ],
            },
            spanne('anfahrt', 'Anfahrt'),
          ],
        },
      ],
    },
  ],
};
