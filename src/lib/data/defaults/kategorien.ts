import type { ShopKategorie } from '@/lib/types';

/** Hinweis für Kategorien, zu denen es noch keine Produkte gibt (FA-SHOP-01). */
export const HINWEIS_PRODUKTE_FOLGEN = 'Direkt bestellen können Sie hier derzeit nicht. Bitte fragen Sie bei uns an.';

/**
 * Startbestand der Shop-Kategorien: die neun Hauptkategorien aus Abschnitt 10
 * der Arbeitsanweisung des Inhabers, in seiner Reihenfolge. Jede führt auf den
 * Weg, den es heute gibt. Kategorien ohne Produkte sagen das ehrlich und
 * führen in die passende Anfrage. „Weitere Sicherheitstechnik“ ist angelegt,
 * aber nicht sichtbar.
 *
 * Gepflegt wird im Backend (Sammlung „Shop-Kategorien“); diese Liste ist der
 * Startwert und der Inhalt ohne Datenbank (`content/kategorien.json`).
 */
export function kategorien(): ShopKategorie[] {
  const basis = { fruehereAdressen: [] as string[] };
  return [
    {
      ...basis,
      id: 'schluessel-nach-code',
      slug: 'schluessel-nach-code',
      name: 'Schlüssel nach Code',
      beschreibung: 'Ein neuer Schlüssel nach dem Code auf Schloss, Schlüssel oder Sicherungskarte. Ihr Original müssen Sie nicht einschicken.',
      reihenfolge: 10,
      art: 'codeprodukte',
      ziel: '/schluessel-nach-code',
      sichtbar: true,
    },
    {
      ...basis,
      id: 'schluessel-nach-vorlage',
      slug: 'schluessel-nach-vorlage',
      name: 'Schlüssel nach Vorlage',
      beschreibung: 'Ein weiterer Schlüssel nach Ihrem vorhandenen Schlüssel. Sie schicken uns Fotos, und wir prüfen, ob wir ihn nachmachen können.',
      reihenfolge: 20,
      art: 'anfrage',
      ziel: '/schluessel-nach-vorlage',
      sichtbar: true,
    },
    {
      ...basis,
      id: 'autoschluessel-produkte',
      slug: 'autoschluessel-produkte',
      name: 'Autoschlüssel als Produkte',
      beschreibung: 'Hier geht es um den Autoschlüssel selbst, ohne Termin in der Werkstatt. Einen Termin in der Werkstatt fragen Sie getrennt an.',
      reihenfolge: 30,
      art: 'anfrage',
      ziel: '/service-und-termin/anfrage?thema=autoschluessel&anliegen=frage',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
      sichtbar: true,
    },
    {
      ...basis,
      id: 'autoschluesselgehaeuse',
      slug: 'autoschluesselgehaeuse',
      name: 'Autoschlüsselgehäuse',
      beschreibung: 'Nur das Gehäuse für Ihren Funkschlüssel, ohne Elektronik. Den Preis nennen wir Ihnen nach Ihrer Anfrage.',
      reihenfolge: 40,
      art: 'anfrage',
      ziel: '/autoschluessel/gehaeuse',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
      sichtbar: true,
    },
    {
      ...basis,
      id: 'gehaeuseumbau-und-reparaturservice',
      slug: 'gehaeuseumbau-und-reparaturservice',
      name: 'Gehäuseumbau und Reparaturservice',
      beschreibung: 'Die Arbeit übernehmen wir: Wir setzen die Elektronik Ihres Autoschlüssels in ein neues Gehäuse oder reparieren den Schlüssel.',
      reihenfolge: 50,
      art: 'anfrage',
      ziel: '/autoschluessel/gehaeuse/anfrage',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
      sichtbar: true,
    },
    {
      ...basis,
      id: 'customizing-und-modifikation',
      slug: 'customizing-und-modifikation',
      name: 'Customizing und Modifikation',
      beschreibung: 'Ihr Autoschlüssel in neuer Optik, etwa in einem moderneren Gehäuse. Das geht nur, wenn die Technik hineinpasst.',
      reihenfolge: 60,
      art: 'anfrage',
      ziel: '/service-und-termin/anfrage',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
      sichtbar: true,
    },
    {
      ...basis,
      id: 'gleichschliessende-zylinder',
      slug: 'gleichschliessende-zylinder',
      name: 'Gleichschließende Zylinder und Sperrschließungen',
      beschreibung: 'Mehrere Zylinder, die alle mit demselben Schlüssel schließen. Sie stellen sie im Konfigurator zusammen.',
      reihenfolge: 70,
      art: 'konfigurator',
      ziel: '/gleichschliessende-zylinder/konfigurator',
      sichtbar: true,
    },
    {
      ...basis,
      id: 'schliesstechnik-und-zubehoer',
      slug: 'schliesstechnik-und-zubehoer',
      name: 'Schließtechnik und Zubehör',
      beschreibung: 'Artikel rund um Tür und Schloss.',
      reihenfolge: 80,
      art: 'artikel',
      ziel: '/artikel',
      sichtbar: true,
    },
    {
      ...basis,
      id: 'weitere-sicherheitstechnik',
      slug: 'weitere-sicherheitstechnik',
      name: 'Weitere Sicherheitstechnik',
      beschreibung: 'Technik für Einbruchschutz, Überwachung und Alarmierung.',
      reihenfolge: 90,
      art: 'anfrage',
      ziel: '/sicherheitstechnik',
      hinweis: HINWEIS_PRODUKTE_FOLGEN,
      sichtbar: false,
    },
  ];
}
