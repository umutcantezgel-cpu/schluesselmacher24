import type { CheckboxField, GlobalBeforeValidateHook, GlobalConfig } from 'payload';

import { istInhaber, istTeam } from '../access/rollen';
import { bildFeld, euroFeld, gpsrFeld, infoFeld, slugFeld } from '../fields/gemeinsam';
import { nachGlobalAenderung } from '../hooks/revalidate';

export const BAUFORMEN = [
  { label: 'Doppelzylinder', value: 'doppelzylinder' },
  { label: 'Knaufzylinder', value: 'knaufzylinder' },
  { label: 'Halbzylinder', value: 'halbzylinder' },
];

/**
 * Haken „Preis nicht bestätigt“ (FA-SHOP-04): Solange er gesetzt ist, lässt sich nichts mit diesem
 * Eintrag bestellen; der Konfigurator führt dann in die Anfrage mit Angebot. Standard: nicht gesetzt,
 * damit sich am Bestand nichts ändert. Der Preis selbst bleibt, wie er ist.
 */
function preisNichtBestaetigtFeld(name = 'preisNichtBestaetigt', wofuer = 'diesem Eintrag'): CheckboxField {
  return {
    name,
    type: 'checkbox',
    label: 'Preis nicht bestätigt',
    defaultValue: false,
    admin: {
      description:
        `Setzen Sie den Haken, solange der Preis noch nicht geprüft ist. Dann lässt sich mit ${wofuer} nichts bestellen; `
        + 'Kunden schicken stattdessen eine Anfrage und bekommen ein Angebot.',
    },
  };
}

/** Kennung aus einem Verweis: Zahl, Text oder das geladene Dokument. */
function verweisId(wert: unknown): number | string | undefined {
  if (wert && typeof wert === 'object' && 'id' in wert) return (wert as { id: number | string }).id;
  return typeof wert === 'number' || (typeof wert === 'string' && wert !== '') ? wert : undefined;
}

/**
 * Hersteller aus der Hersteller-Liste (FA-SHOP-04): Name und Kennung übernimmt der Eintrag aus dem
 * Stamm, damit jeder Hersteller nur einmal gepflegt wird. Einträge ohne Auswahl behalten ihre Werte.
 */
export const herstellerAusStamm: GlobalBeforeValidateHook = async ({ data, req }) => {
  const zeilen = (data as { hersteller?: unknown } | undefined)?.hersteller;
  if (!Array.isArray(zeilen)) return data;
  for (const zeile of zeilen as Array<Record<string, unknown>>) {
    const id = verweisId(zeile?.stamm);
    if (id === undefined) continue;
    try {
      const stamm = await req.payload.findByID({ collection: 'hersteller', id, depth: 0, req, overrideAccess: true, trash: true });
      zeile.name = stamm.name;
      zeile.kennung = stamm.kennung || stamm.slug || zeile.kennung;
    } catch {
      // Nicht gefunden: Die Prüfung des Verweises meldet das; die bisherigen Werte bleiben.
    }
  }
  return data;
};

/** Bauformen, Funktionen und Extras für gleichschließende Zylinder. */
export const Zylinderkatalog: GlobalConfig = {
  slug: 'zylinderkatalog',
  label: 'Zylinderkatalog',
  admin: { group: 'Shop' },
  access: { read: istTeam, update: istInhaber },
  hooks: { beforeValidate: [herstellerAusStamm], afterChange: [nachGlobalAenderung] },
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
            preisNichtBestaetigtFeld('schluesselPreisNichtBestaetigt', 'mehr als den inklusiven Schlüsseln'),
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
                preisNichtBestaetigtFeld('preisNichtBestaetigt', 'dieser Bauform'),
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
                preisNichtBestaetigtFeld('preisNichtBestaetigt', 'dieser Funktion'),
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
                preisNichtBestaetigtFeld('preisNichtBestaetigt', 'diesem Extra'),
                infoFeld('info', 'Erklärung'),
              ],
            },
          ],
        },
        {
          label: 'Hersteller',
          description:
            'Hersteller und Systeme für den Konfigurator (z. B. ABUS, BKS). Wählen Sie den Hersteller aus der Hersteller-Liste '
            + '(Shop › Hersteller); Name und Kennung kommen von dort. Der Konfigurator fragt den Hersteller '
            + 'erst ab, wenn mindestens ein Eintrag angeboten wird.',
          fields: [
            {
              name: 'hersteller',
              type: 'array',
              label: 'Hersteller',
              labels: { singular: 'Hersteller', plural: 'Hersteller' },
              fields: [
                { type: 'row', fields: [
                  {
                    name: 'stamm',
                    type: 'relationship',
                    relationTo: 'hersteller',
                    label: 'Hersteller aus der Liste',
                    admin: { width: '80%', description: 'Name und Kennung übernimmt der Eintrag beim Speichern aus der Hersteller-Liste.' },
                  },
                  { name: 'aktiv', type: 'checkbox', label: 'Angeboten', defaultValue: false, admin: { width: '20%' } },
                ] },
                { type: 'row', fields: [
                  {
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    required: true,
                    // Ohne admin.condition, damit die Spalte NOT NULL bleibt (G6); der Hook füllt den Wert aus dem Stamm.
                    validate: (wert: unknown, { siblingData }: { siblingData?: { stamm?: unknown } }) =>
                      (typeof wert === 'string' && wert.trim() !== '') || verweisId(siblingData?.stamm) !== undefined
                        ? true
                        : 'Bitte oben den Hersteller aus der Liste wählen.',
                    admin: {
                      width: '50%',
                      readOnly: true,
                      description: 'Kommt beim Speichern aus dem gewählten Hersteller. Bei älteren Einträgen der bisherige Name.',
                    },
                  },
                  slugFeld({
                    name: 'kennung',
                    label: 'Kennung',
                    unique: false,
                    index: false,
                    validate: (wert: unknown, { siblingData }: { siblingData?: { stamm?: unknown } }) =>
                      verweisId(siblingData?.stamm) !== undefined
                      || (typeof wert === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(wert))
                        ? true
                        : 'Bitte oben den Hersteller aus der Liste wählen.',
                    admin: {
                      width: '50%',
                      readOnly: true,
                      description: 'Kommt beim Speichern aus dem gewählten Hersteller, z. B. „abus“.',
                    },
                  }),
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
                preisNichtBestaetigtFeld('preisNichtBestaetigt', 'diesem Hersteller (Aufpreis und Zusatzkomponenten)'),
                {
                  name: 'zusatzkomponenten',
                  type: 'array',
                  label: 'Zusatzkomponenten',
                  labels: { singular: 'Zusatzkomponente', plural: 'Zusatzkomponenten' },
                  fields: [
                    { type: 'row', fields: [
                      { name: 'name', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '60%' } },
                      euroFeld('preis', 'Preis', {
                        required: true,
                        admin: {
                          width: '40%',
                          step: 0.01,
                          description: 'Preis je Stück inklusive Umsatzsteuer. Die Stückzahl wählt der Kunde im Konfigurator.',
                        },
                      }),
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
