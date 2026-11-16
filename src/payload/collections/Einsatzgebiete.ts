import type { CollectionBeforeChangeHook, CollectionConfig, TextFieldSingleValidation } from 'payload';

import { prioritaetLesen } from '../../lib/orte/dateien';

import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { BEREICHE, kennungFeld, seoFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Stufe aus Anhang A: Steht der Gemeindeschlüssel in der Prioritätsliste des Inhabers? (FA-PLATTFORM-03B) */
const stufeSetzen: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data || !('gemeindeschluessel' in data)) return data;
  const schluessel = typeof data.gemeindeschluessel === 'string' ? data.gemeindeschluessel.trim() : '';
  if (!schluessel) return { ...data, gemeindeschluessel: null, stufeAnhangA: false };
  try {
    const liste = await prioritaetLesen();
    return { ...data, gemeindeschluessel: schluessel, stufeAnhangA: liste.eintraege.some((e) => e.schluessel === schluessel) };
  } catch {
    return { ...data, gemeindeschluessel: schluessel };
  }
};

/**
 * Gemeindeschlüssel: acht Ziffern, und je Gemeinde nur eine Ortsseite (eindeutiger Index). Hängt der Schlüssel schon an
 * einer anderen Seite, auch im Papierkorb, sagt die Meldung, an welcher und was zu tun ist, statt am Index zu scheitern.
 */
const gemeindeschluesselPruefen: TextFieldSingleValidation = async (wert, { req, id }) => {
  const schluessel = typeof wert === 'string' ? wert.trim() : '';
  if (!schluessel) return true;
  if (!/^\d{8}$/.test(schluessel)) return 'Bitte den achtstelligen Gemeindeschlüssel aus dem Ortsstamm eintragen.';
  try {
    const { docs } = await req.payload.find({
      collection: 'einsatzgebiete',
      where: { and: [{ gemeindeschluessel: { equals: schluessel } }, ...(id !== undefined ? [{ id: { not_equals: id } }] : [])] },
      trash: true,
      depth: 0,
      limit: 1,
      pagination: false,
      overrideAccess: true,
      select: { stadt: true, deletedAt: true },
      req,
    });
    const andere = docs[0];
    if (!andere) return true;
    return andere.deletedAt
      ? `Dieser Gemeindeschlüssel hängt an der Ortsseite „${andere.stadt}“ im Papierkorb. Bitte diese Seite wiederherstellen oder dort den Schlüssel leeren.`
      : `Dieser Gemeindeschlüssel hängt schon an der Ortsseite „${andere.stadt}“. Je Gemeinde gibt es eine Ortsseite.`;
  } catch {
    // Ohne Abfrage bleibt der eindeutige Index der Datenbank die Sperre.
    return true;
  }
};

/** Städteseiten mit örtlichem Mehrwert — kein Massentext. */
export const Einsatzgebiete: CollectionConfig = {
  slug: 'einsatzgebiete',
  labels: { singular: 'Einsatzgebiet', plural: 'Einsatzgebiete' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'stadt',
    defaultColumns: ['stadt', 'bundesland', 'gemeindeschluessel', 'prioritaet', '_status', 'updatedAt'],
    // Über der Liste: Veröffentlichung je Ortsseite mit Grund und die Prioritätsorte des Inhabers (FA-PLATTFORM-03B).
    components: { beforeListTable: ['/payload/components/Ortsseiten#Ortsseiten'] },
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 20 },
  trash: true,
  hooks: { ...erneuernHooks, beforeChange: [stufeSetzen] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'stadt', type: 'text', label: 'Stadt', required: true, admin: { width: '50%' } },
        { name: 'bundesland', type: 'text', label: 'Bundesland', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'lokalIntro', type: 'textarea', label: 'Örtliche Einleitung', required: true },
    {
      name: 'lokaleFakten',
      type: 'array',
      label: 'Örtliche Angaben',
      labels: { singular: 'Angabe', plural: 'Angaben' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Bezeichnung', required: true, admin: { width: '40%' } },
            { name: 'wert', type: 'text', label: 'Wert', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    { name: 'leistungen', type: 'select', label: 'Angebotene Leistungen', hasMany: true, options: BEREICHE },
    { name: 'radiusKm', type: 'number', label: 'Einsatzradius vor Ort (km)', min: 0, max: 500, defaultValue: 0 },
    {
      type: 'collapsible',
      label: 'Ortsstamm und Veröffentlichung',
      admin: {
        description:
          'In Suchmaschinen und in der Sitemap steht die Seite nur mit eigener Einleitung (mindestens 160 Zeichen, nicht gleich einer anderen Ortsseite), '
          + 'einem Gemeindeschlüssel aus dem Ortsstamm und einem Leistungsweg: Werkstatt im Ort oder Landkreis, ein freigeschalteter Partner deckt den Ort ab, oder eine konkrete Verfügbarkeit ist eingetragen. '
          + 'Den Grund zeigt die Liste der Einsatzgebiete.',
      },
      fields: [
        {
          name: 'gemeindeschluessel',
          type: 'text',
          label: 'Gemeindeschlüssel (Ortsstamm)',
          unique: true,
          index: true,
          admin: { description: 'Amtlicher Gemeindeschlüssel, acht Ziffern, siehe Sammlung „Orte (Stamm)“. Daraus kommen Landkreis und Postleitzahlen.' },
          validate: gemeindeschluesselPruefen,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'prioritaet',
              type: 'number',
              label: 'Priorität',
              min: 1,
              admin: { width: '33%', description: 'Kleiner zuerst. Leer: Platz in Anhang A, sonst hinten.' },
            },
            {
              name: 'stufeAnhangA',
              type: 'checkbox',
              label: 'Stufe: in Anhang A',
              defaultValue: false,
              admin: { width: '33%', readOnly: true, description: 'Wird aus der Prioritätsliste gesetzt.' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'suchvolumen',
              type: 'number',
              label: 'Suchvolumen je Monat',
              min: 0,
              admin: { width: '50%', description: 'Leer lassen, bis eine belegte Zahl mit Quelle vorliegt.' },
            },
            {
              name: 'fahrzeitMinuten',
              type: 'number',
              label: 'Fahrzeit zur Werkstatt (Minuten)',
              min: 0,
              admin: { width: '50%', description: 'Leer lassen, bis sie gemessen ist.' },
            },
          ],
        },
        {
          name: 'partnerregion',
          type: 'relationship',
          relationTo: 'partnerbetriebe',
          hasMany: true,
          label: 'Partnerregion',
          admin: { description: 'Partnerbetriebe für diesen Ort. Darf leer sein. Auf der Seite steht nie ein Name.' },
        },
        {
          name: 'verfuegbarkeit',
          type: 'textarea',
          label: 'Konkrete Verfügbarkeit',
          admin: { description: 'Eigener Text, etwa feste Tage vor Ort. Zählt als Leistungsweg. Nur Belegtes eintragen.' },
        },
      ],
    },
    seoFeld(),
    slugFeld(),
    kennungFeld(),
  ],
};
