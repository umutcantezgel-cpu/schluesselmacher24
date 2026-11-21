import type { CollectionConfig, FieldHook } from 'payload';

import { TUTORIAL_ORTE } from '../../lib/tutorials/orte';
import { YOUTUBE_MELDUNG, dauerSekunden, istYoutubeKennung, youtubeKennung } from '../../lib/tutorials/youtube';
import { istTeam, papierkorbTeamLoeschenInhaber } from '../access/rollen';
import { BEREICHE, bildFeld, kennungFeld, seoFeld, slugFeld } from '../fields/gemeinsam';
import { erneuernHooks } from '../hooks/revalidate';

/** Aus einem eingefügten Link wird beim Speichern die Kennung; Unlesbares bleibt stehen und fällt in der Prüfung auf. */
export const youtubeEingabeNormalisieren: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value;
  const text = value.trim();
  if (!text) return null;
  return youtubeKennung(text) ?? text;
};

/** Leer oder eine gültige Kennung (nach dem Normalisieren). */
export function youtubeFeldPruefen(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true;
  return istYoutubeKennung(value) || youtubeKennung(value) ? true : YOUTUBE_MELDUNG;
}

export function dauerFeldPruefen(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true;
  return dauerSekunden(value) !== null ? true : 'Bitte die Dauer wie bei YouTube eintragen, etwa 4:32 oder 1:02:15.';
}

const mitVideo = (_: unknown, siblingData: { youtube?: string | null } | undefined) => Boolean(siblingData?.youtube);

/**
 * Tutorials (FA-INHALT-01, Abschnitt 21 der Arbeitsanweisung): kurze Anleitungen als Frage und Antwort mit
 * nummerierten Schritten, auf Wunsch mit einem YouTube-Video. Die Seite ist auch ohne Video vollständig.
 * Videos liegen bei YouTube, nie in der Medienablage. Gespeichert wird nur die geprüfte Kennung des Videos.
 */
export const Tutorials: CollectionConfig = {
  slug: 'tutorials',
  typescript: { interface: 'Tutorials' },
  labels: { singular: 'Tutorial', plural: 'Tutorials' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'thema', 'reihenfolge', '_status', 'updatedAt'],
    listSearchableFields: ['titel', 'slug'],
    description:
      'Kurze Anleitungen unter /tutorials. Ein Video ergänzen Sie so: YouTube-Link einfügen, speichern, fertig. '
      + 'Ein Tutorial erscheint erst, wenn es veröffentlicht ist. Videos erscheinen, sobald die Einbettung freigeschaltet ist.',
    pagination: { defaultLimit: 50 },
  },
  access: { read: istTeam, create: istTeam, update: istTeam, delete: papierkorbTeamLoeschenInhaber, readVersions: istTeam },
  versions: { drafts: true, maxPerDoc: 30 },
  trash: true,
  defaultSort: 'reihenfolge',
  hooks: erneuernHooks,
  fields: [
    {
      name: 'titel',
      type: 'text',
      label: 'Titel als Frage',
      required: true,
      maxLength: 90,
      admin: { description: 'So, wie Kunden fragen, etwa „Wie messe ich einen Profilzylinder?“.' },
    },
    {
      name: 'kurzantwort',
      type: 'textarea',
      label: 'Kurzantwort',
      required: true,
      maxLength: 500,
      admin: { description: 'Zwei bis drei Sätze, die die Frage gleich beantworten. Steht oben auf der Seite.' },
    },
    { name: 'thema', type: 'select', label: 'Thema', required: true, options: BEREICHE, admin: { position: 'sidebar' } },
    {
      name: 'schritte',
      type: 'array',
      label: 'Schritte',
      labels: { singular: 'Schritt', plural: 'Schritte' },
      minRows: 1,
      admin: { description: 'Die Schritte werden in dieser Reihenfolge nummeriert. Die Seite muss auch ohne Video verständlich sein.' },
      fields: [
        { name: 'ueberschrift', type: 'text', label: 'Überschrift', required: true, maxLength: 90 },
        { name: 'text', type: 'textarea', label: 'Text', required: true },
        bildFeld('bild', 'Bild zum Schritt (optional)', '4/3'),
      ],
    },
    {
      name: 'video',
      type: 'group',
      label: 'YouTube-Video (optional)',
      admin: {
        description:
          'YouTube-Link einfügen, speichern, fertig. Zum Austauschen einfach einen anderen Link einfügen. '
          + 'Erlaubt sind nur Links von YouTube. Das Video erscheint auf der Seite, sobald die Einbettung freigeschaltet ist; '
          + 'bis dahin steht dort nur ein kurzer Hinweis. Von YouTube wird erst etwas geladen, wenn der Kunde zustimmt.',
      },
      fields: [
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube-Link oder Kennung',
          admin: { description: 'Zum Beispiel aus „Teilen“ bei YouTube. Beim Speichern bleibt nur die Kennung des Videos stehen.' },
          hooks: { beforeValidate: [youtubeEingabeNormalisieren], beforeChange: [youtubeEingabeNormalisieren] },
          validate: youtubeFeldPruefen as never,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'titel',
              type: 'text',
              label: 'Titel des Videos',
              maxLength: 100,
              admin: { width: '50%', condition: mitVideo },
            },
            {
              name: 'dauer',
              type: 'text',
              label: 'Dauer',
              maxLength: 8,
              admin: { width: '25%', description: 'Etwa 4:32', condition: mitVideo },
              validate: dauerFeldPruefen as never,
            },
            {
              name: 'datum',
              type: 'date',
              label: 'Veröffentlicht bei YouTube am',
              admin: { width: '25%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' }, condition: mitVideo },
            },
          ],
        },
        {
          name: 'vorschaubild',
          type: 'upload',
          relationTo: 'medien',
          label: 'Eigenes Vorschaubild (optional)',
          admin: {
            description: 'Ein eigenes Foto aus der Medienablage, das vor dem Laden des Videos erscheint. Bitte kein Bild von YouTube hochladen.',
            condition: mitVideo,
          },
        },
        {
          name: 'transkript',
          type: 'textarea',
          label: 'Transkript oder Zusammenfassung',
          admin: {
            description:
              'Was im Video gesagt und gezeigt wird, als Text. Erscheint auf der Seite unter dem Video zum Aufklappen und hilft allen, die das Video nicht ansehen.',
            condition: mitVideo,
          },
        },
      ],
    },
    {
      name: 'erscheintAuf',
      type: 'select',
      label: 'Erscheint auf',
      hasMany: true,
      options: TUTORIAL_ORTE.map(({ value, label }) => ({ value, label })),
      admin: {
        description:
          'Hier wählen Sie, wo das Tutorial als Hilfe erscheint: auf Leistungsseiten und in Anfrageformularen. Es erscheint dort, sobald es veröffentlicht ist. '
          + 'Ist die Einbettung freigeschaltet, steht ein Video auf Leistungsseiten direkt im Hinweis; in Formularen bleibt es beim Verweis.',
      },
    },
    {
      name: 'ratgeber',
      type: 'relationship',
      relationTo: 'ratgeber',
      label: 'Ausführlich im Ratgeber',
      admin: {
        position: 'sidebar',
        description:
          'Nur wählen, wenn ein Ratgeber das Thema schon vollständig erklärt. Solange kein Video auf der Seite zu sehen ist, verweist das Tutorial dorthin und erscheint nicht bei Google. '
          + 'Ein Video ist erst zu sehen, wenn die Einbettung freigeschaltet ist.',
      },
    },
    {
      name: 'reihenfolge',
      type: 'number',
      label: 'Reihenfolge',
      required: true,
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Kleinere Zahl steht weiter vorn.' },
    },
    seoFeld(),
    slugFeld(),
    kennungFeld(),
  ],
};
