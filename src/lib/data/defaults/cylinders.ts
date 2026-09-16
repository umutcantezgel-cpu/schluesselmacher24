import type { CylinderCatalog } from '@/lib/types';

/**
 * Gleichschließende Zylinder — Bauformen, Maße, Funktionen und Zubehör.
 * Alle Preise und Optionen sind im Backend pflegbar.
 */
export function cylinderCatalog(): CylinderCatalog {
  return {
    includedKeys: 3,
    keyPriceCents: 1490,
    maxKeys: 50,
    maxCylinders: 30,
    measuringInfo: {
      title: 'So messen Sie richtig',
      body:
        'Gemessen wird immer von der Mitte der Stulpschraube bis zum äußeren Ende des Zylinders — '
        + 'einmal nach außen (Maß A) und einmal nach innen (Maß B). Messen Sie den eingebauten '
        + 'Zylinder oder legen Sie den ausgebauten Zylinder an ein Lineal. Ein zu kurzer Zylinder '
        + 'lässt sich nicht sicher schließen, ein zu langer steht vor und lässt sich leichter angreifen.',
      figure: {
        motif: 'Messzeichnung Zylinder: Maß A außen, Maß B innen, Mitte Stulpschraube',
        ratio: '16/9',
        note: 'Einfache technische Zeichnung, beschriftet, ohne Fotomaterial.',
      },
    },
    measuringFigure: {
      motif: 'Messzeichnung Zylinder mit Bemaßung A und B',
      ratio: '16/9',
    },
    forms: [
      {
        id: 'doppelzylinder',
        label: 'Doppelzylinder',
        description:
          'Auf beiden Seiten mit Schlüssel bedienbar. Die übliche Bauform für Haus-, Wohnungs- und Nebentüren.',
        measures: 'beide',
        measureLabels: { a: 'Maß A (außen)', b: 'Maß B (innen)' },
        info: {
          title: 'Doppelzylinder',
          body:
            'Beide Seiten werden mit einem Schlüssel bedient. Wenn innen ein Schlüssel steckt, '
            + 'lässt sich die Tür von außen je nach Zylinder nicht mehr öffnen — außer Sie wählen '
            + 'die Not- und Gefahrenfunktion.',
          figure: {
            motif: 'Schemazeichnung Doppelzylinder, beide Seiten mit Schlüsselkanal',
            ratio: '4/3',
          },
        },
        figure: {
          motif: 'Produktfoto Doppelzylinder, Seitenansicht',
          ratio: '4/3',
        },
        minMm: 27,
        maxMm: 80,
        stepMm: 5,
        basePriceCents: 3900,
        lengthSurchargeCents: 350,
        baseLengthMm: 70,
        active: true,
      },
      {
        id: 'knaufzylinder',
        label: 'Knaufzylinder',
        description:
          'Innen ein Drehknauf statt Schlüssel. Die Tür lässt sich von innen jederzeit ohne Schlüssel öffnen.',
        measures: 'beide',
        measureLabels: { a: 'Maß A (außen, Schlüsselseite)', b: 'Maß B (innen, Knaufseite)' },
        info: {
          title: 'Knaufzylinder',
          body:
            'Von innen wird über einen Drehknauf geschlossen, von außen mit Schlüssel. Praktisch, '
            + 'wenn Sie innen keinen Schlüssel suchen wollen. Bei Türen mit Glasausschnitt in '
            + 'Griffweite ist ein Knauf nicht in jedem Fall die sicherere Wahl.',
          figure: {
            motif: 'Schemazeichnung Knaufzylinder, Knauf innen, Schlüssel außen',
            ratio: '4/3',
          },
        },
        figure: {
          motif: 'Produktfoto Knaufzylinder, Seitenansicht',
          ratio: '4/3',
        },
        minMm: 27,
        maxMm: 80,
        stepMm: 5,
        basePriceCents: 4900,
        lengthSurchargeCents: 350,
        baseLengthMm: 70,
        active: true,
      },
      {
        id: 'halbzylinder',
        label: 'Halbzylinder',
        description:
          'Nur von einer Seite bedienbar. Üblich für Garagen, Technikräume, Schranken und Klappen.',
        measures: 'eines',
        measureLabels: { a: 'Maß A (Schlüsselseite)' },
        info: {
          title: 'Halbzylinder',
          body:
            'Der Halbzylinder hat nur einen Schlüsselkanal und wird dort eingesetzt, wo von der '
            + 'Gegenseite kein Zugang nötig ist — etwa an Garagentoren, Technikschränken oder '
            + 'Nebenklappen.',
          figure: {
            motif: 'Schemazeichnung Halbzylinder mit einseitigem Schlüsselkanal',
            ratio: '4/3',
          },
        },
        figure: {
          motif: 'Produktfoto Halbzylinder, Seitenansicht',
          ratio: '4/3',
        },
        minMm: 27,
        maxMm: 60,
        stepMm: 5,
        basePriceCents: 2900,
        lengthSurchargeCents: 350,
        baseLengthMm: 45,
        active: true,
      },
    ],
    functions: [
      {
        id: 'standard',
        label: 'Standardfunktion',
        description: 'Von außen nicht bedienbar, solange innen ein Schlüssel steckt.',
        surchargeCents: 0,
        forms: ['doppelzylinder', 'knaufzylinder', 'halbzylinder'],
        info: {
          title: 'Standardfunktion',
          body:
            'Die übliche Ausführung. Steckt innen ein Schlüssel, lässt sich von außen nicht '
            + 'aufschließen. Für die meisten Innen- und Nebentüren ausreichend.',
        },
        active: true,
      },
      {
        id: 'not-gefahr',
        label: 'Not- und Gefahrenfunktion',
        description:
          'Von außen auch dann bedienbar, wenn innen ein Schlüssel steckt.',
        surchargeCents: 1200,
        forms: ['doppelzylinder'],
        info: {
          title: 'Not- und Gefahrenfunktion',
          body:
            'Sie können von außen aufschließen, selbst wenn innen ein Schlüssel steckt. Sinnvoll '
            + 'für Wohnungstüren, Pflegesituationen oder überall dort, wo im Notfall von außen '
            + 'geöffnet werden muss.',
          figure: {
            motif: 'Schemazeichnung Not- und Gefahrenfunktion',
            ratio: '4/3',
          },
        },
        active: true,
      },
    ],
    extras: [
      {
        id: 'sicherungskarte',
        label: 'Sicherungskarte und geschütztes System',
        description:
          'Nachschlüssel werden nur gegen Vorlage der Sicherungskarte gefertigt.',
        priceCents: 2900,
        unit: 'einmal',
        info: {
          title: 'Sicherungskarte',
          body:
            'Mit einer Sicherungskarte kann niemand ohne Ihre Zustimmung Nachschlüssel bestellen. '
            + 'Bewahren Sie die Karte getrennt von den Schlüsseln auf. Ohne Karte ist später keine '
            + 'Nachbestellung möglich.',
        },
        active: true,
      },
      {
        id: 'ziehschutz',
        label: 'Aufbohr- und Ziehschutz',
        description: 'Verstärkte Ausführung gegen mechanische Angriffe.',
        priceCents: 1900,
        unit: 'stueck',
        info: {
          title: 'Aufbohr- und Ziehschutz',
          body:
            'Zusätzliche Härtung im Zylinder erschwert Aufbohren und Ziehen. Wirkt am besten '
            + 'zusammen mit einem passenden Schutzbeschlag an der Tür.',
        },
        active: true,
      },
      {
        id: 'gleichschliessung-erweiterbar',
        label: 'Erweiterbar reservieren',
        description:
          'Ihre Schließung wird hinterlegt, damit später weitere Zylinder ergänzt werden können.',
        priceCents: 1500,
        unit: 'einmal',
        info: {
          title: 'Spätere Erweiterung',
          body:
            'Wir hinterlegen Ihre Schließung, sodass Sie später weitere Zylinder mit derselben '
            + 'Schließung nachbestellen können — zum Beispiel für eine zusätzliche Tür. Ohne diese '
            + 'Option ist eine passgenaue Erweiterung später nicht in jedem Fall möglich.',
        },
        active: true,
      },
      {
        id: 'zusatz-schluesselanhaenger',
        label: 'Beschriftete Schlüsselanhänger',
        description: 'Jeder Schlüssel erhält einen beschrifteten Anhänger zur Zuordnung.',
        priceCents: 190,
        unit: 'stueck',
        info: {
          title: 'Beschriftete Anhänger',
          body:
            'Hilfreich, sobald mehrere Türen oder Nutzer im Spiel sind. Die Beschriftung sollte '
            + 'keine Adresse enthalten.',
        },
        active: true,
      },
    ],
  };
}
