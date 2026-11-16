import { KLASSEN_SEITEN, type SeitenKopf } from '@/lib/fahrzeuge/anfrage-klassen';
import type { CityPage, Guide, PageContent } from '@/lib/types';

/**
 * Redaktionell pflegbare Seiteninhalte (Titel, Beschreibung, Texte,
 * Abschnitte, Fragen und interne Links) je Route.
 */
export function pages(): PageContent[] {
  const now = '2026-09-15T00:00:00.000Z';

  const raw: Array<{
    route: string;
    headline: string;
    subline: string;
    intro: string;
    title: string;
    description: string;
    links: Array<[string, string]>;
  }> = [
    {
      route: '',
      headline: 'Autoschlüssel nachmachen und programmieren',
      subline: 'Dazu Schlüssel, Schließanlagen, Zutrittslösungen und Sicherheitstechnik aus einer Hand.',
      intro:
        'Wir sind ein Fachbetrieb für Schlüssel- und Schließtechnik. Der Schwerpunkt liegt auf '
        + 'Autoschlüsseln: nachmachen, programmieren, reparieren. Daneben bearbeiten wir Schlüssel '
        + 'nach Vorlage und nach Code, planen Schließanlagen, richten elektronische Zutrittslösungen '
        + 'ein und sichern Gebäude ab.',
      title: 'Schlüsselwerkstatt in Wetzlar | SCHLÜSSELMACHER24',
      description:
        'Wir fertigen Autoschlüssel in unserer Werkstatt in Wetzlar und liefern Schlüssel nach '
        + 'Code in ganz Deutschland. Wir planen auch Schließanlagen.',
      links: [
        ['/autoschluessel', 'Autoschlüssel'],
        ['/schluessel-nach-code', 'Schlüssel nach Code'],
        ['/schliessanlagen', 'Schließanlagen'],
      ],
    },
    {
      route: 'autoschluessel',
      headline: 'Autoschlüssel',
      subline:
        'Wir machen Autoschlüssel nach, programmieren und reparieren sie. Sie kommen mit festem Termin '
        + 'in unsere Werkstatt in Wetzlar, gern auch von weiter her.',
      intro:
        'Ob Zweitschlüssel, Ersatz nach Verlust, Programmierung oder Reparatur: Wir klären zuerst, '
        + 'was Ihr Fahrzeug braucht. Dann nennen wir Ihnen den Preis oder einen Preisrahmen. Erst '
        + 'danach buchen Sie einen Termin.',
      title: 'Autoschlüssel-Werkstatt in Wetzlar',
      description:
        'Autoschlüssel nachmachen, programmieren und reparieren in Wetzlar. Wir klären zuerst, '
        + 'was Ihr Fahrzeug braucht. Danach buchen Sie einen festen Termin.',
      links: [
        ['/autoschluessel/anfrage', 'Termin anfragen'],
        ['/autoschluessel/programmieren', 'Autoschlüssel programmieren'],
        ['/autoschluessel/marken', 'Fahrzeugmarken und Modelle'],
      ],
    },
    {
      route: 'autoschluessel/nachmachen',
      headline: 'Autoschlüssel nachmachen',
      subline: 'Wir fertigen einen Zweitschlüssel oder Ersatzschlüssel für Ihr Fahrzeug.',
      intro:
        'Am günstigsten ist ein neuer Schlüssel, solange noch einer funktioniert. Ist keiner mehr '
        + 'da, prüfen wir Ihren Fall zuerst einzeln. Der Aufwand ist dann deutlich höher.',
      title: 'Zweitschlüssel fürs Auto in Wetzlar',
      description:
        'Wir fertigen einen Zweitschlüssel oder Ersatzschlüssel für Ihr Fahrzeug in Wetzlar. Ist '
        + 'kein Schlüssel mehr da, prüfen wir Ihren Fall zuerst einzeln.',
      links: [
        ['/autoschluessel/anfrage', 'Termin anfragen'],
        ['/autoschluessel/programmieren', 'Programmierung und Anlernen'],
      ],
    },
    {
      route: 'autoschluessel/programmieren',
      headline: 'Autoschlüssel programmieren und anlernen',
      subline: 'Wir machen einen neuen oder vorhandenen Schlüssel Ihrem Fahrzeug bekannt.',
      intro:
        'Zum Anlernen brauchen wir in aller Regel Ihr Fahrzeug. Per Versand lässt sich das nicht lösen.',
      title: 'Autoschlüssel anlernen in Wetzlar',
      description:
        'Wir machen einen neuen oder vorhandenen Schlüssel Ihrem Fahrzeug bekannt. Zum Anlernen '
        + 'in Wetzlar brauchen wir in aller Regel Ihr Fahrzeug.',
      links: [
        ['/autoschluessel/anfrage', 'Termin anfragen'],
        ['/autoschluessel/smart-key', 'Smart Key und Keyless'],
      ],
    },
    {
      route: 'autoschluessel/kopieren',
      headline: 'Autoschlüssel kopieren',
      subline: 'Wir kopieren den mechanischen Teil Ihres Autoschlüssels nach Vorlage.',
      intro:
        'Die Kopie passt ins Schloss und öffnet bei vielen Fahrzeugen die Tür. Den Motor startet '
        + 'sie dort aber nicht. Der Kopie fehlt der Transponder, ein kleiner Chip im Schlüssel. Ohne ihn '
        + 'gibt die Wegfahrsperre den Motor nicht frei. Was in Ihrem Fall reicht, klären wir vorab.',
      title: 'Autoschlüssel kopieren in Wetzlar',
      description:
        'Wir kopieren den mechanischen Teil Ihres Autoschlüssels nach Vorlage. Der Kopie fehlt '
        + 'der Transponder, darum klären wir vorab, was in Ihrem Fall reicht.',
      links: [
        ['/schluessel-nach-vorlage', 'Schlüssel nach Vorlage anfragen'],
        ['/autoschluessel/programmieren', 'Programmierung ergänzen'],
      ],
    },
    {
      route: 'autoschluessel/funkschluessel',
      headline: 'Funkschlüssel und Funkfernbedienung',
      subline: 'Wir reparieren Tasten, Gehäuse und Funk oder fertigen einen neuen Schlüssel.',
      intro:
        'Reagiert das Fahrzeug nicht mehr auf Knopfdruck, liegt das nicht immer am Schlüssel. Wir '
        + 'prüfen, ob Batterie, Tasten, Elektronik oder das Anlernen am Fahrzeug die Ursache ist.',
      title: 'Funkschlüssel reparieren in Wetzlar',
      description:
        'Reagiert das Fahrzeug nicht mehr auf Knopfdruck? Wir prüfen Batterie, Tasten und '
        + 'Elektronik, reparieren Gehäuse und Funk oder fertigen einen neuen Schlüssel.',
      links: [
        ['/autoschluessel/anfrage', 'Termin anfragen'],
        ['/autoschluessel/nachmachen', 'Ersatzschlüssel anfertigen'],
      ],
    },
    {
      route: 'autoschluessel/smart-key',
      headline: 'Smart Key und Keyless',
      subline: 'Wir beschaffen Ersatz für Ihren Smart Key und lernen ihn an Ihrem Fahrzeug an.',
      intro:
        'Ein Smart Key ist ein Schlüssel, den das Fahrzeug in der Nähe erkennt. Keyless heißt, '
        + 'Sie öffnen und starten, ohne ihn in die Hand zu nehmen. Beschaffung und Anlernen sind '
        + 'aufwendiger als bei einem einfachen Funkschlüssel.',
      title: 'Smart Key und Keyless in Wetzlar',
      description:
        'Ein Smart Key ist ein Schlüssel, den das Fahrzeug in der Nähe erkennt. Wir beschaffen '
        + 'Ersatz für Ihren Smart Key und lernen ihn an Ihrem Fahrzeug an.',
      links: [
        ['/autoschluessel/anfrage', 'Termin anfragen'],
        ['/autoschluessel/programmieren', 'Programmierung und Anlernen'],
      ],
    },
    {
      route: 'autoschluessel/schluesselbart-fraesen',
      headline: 'Schlüsselbart fräsen',
      subline: 'Wir fräsen den Bart Ihres Autoschlüssels nach Vorlage oder nach Fahrzeugdaten.',
      intro:
        'Der Bart ist der metallene Teil mit den Einschnitten, der ins Schloss passt. Als Vorlage '
        + 'dient ein vorhandener Schlüssel oder geeignete Fahrzeugdaten. Die Elektronik ist davon '
        + 'unabhängig.',
      title: 'Schlüsselbart fräsen in Wetzlar',
      description:
        'Wir fräsen den Bart Ihres Autoschlüssels nach Vorlage oder nach Fahrzeugdaten. Der Bart '
        + 'ist der metallene Teil mit den Einschnitten, der ins Schloss passt.',
      links: [
        ['/schluessel-nach-vorlage', 'Nach Vorlage anfragen'],
        ['/autoschluessel/kopieren', 'Was eine Kopie leistet'],
      ],
    },
    {
      route: 'autoschluessel/fahrzeugoeffnung',
      headline: 'Fahrzeugöffnung',
      subline: 'Wir öffnen Ihr Fahrzeug, wenn Sie ausgesperrt sind.',
      intro:
        'Wir arbeiten zerstörungsfrei. Vor Ort weisen Sie bitte nach, dass Sie über das Fahrzeug '
        + 'verfügen dürfen. Die Öffnung ist eine eigene Leistung und ersetzt keinen '
        + 'Ersatzschlüssel.',
      title: 'Zerstörungsfreie Fahrzeugöffnung',
      description:
        'Wir öffnen Ihr Fahrzeug zerstörungsfrei, wenn Sie ausgesperrt sind. Vor Ort weisen Sie '
        + 'bitte nach, dass Sie über das Fahrzeug verfügen dürfen.',
      links: [
        ['/autoschluessel/anfrage?leistung=fahrzeugoeffnung', 'Termin anfragen'],
        ['/autoschluessel/nachmachen', 'Ersatzschlüssel anfertigen'],
      ],
    },
    {
      route: 'schluessel-nach-vorlage',
      headline: 'Schlüssel nach Vorlage',
      subline:
        'Sie haben einen Schlüssel und brauchen einen weiteren. Anhand Ihrer Fotos prüfen wir, '
        + 'ob wir ihn nachfertigen können.',
      intro:
        'Sie fotografieren Ihren Schlüssel aus drei Richtungen und schicken uns die Bilder. Wir '
        + 'sagen Ihnen, ob eine Anfertigung möglich ist und was sie kostet. Einsenden müssen Sie '
        + 'Ihren Schlüssel zunächst nicht.',
      title: 'Schlüssel nach Vorlage nachmachen',
      description:
        'Sie schicken uns drei Fotos Ihres Schlüssels. Wir sagen Ihnen, ob eine Anfertigung '
        + 'möglich ist und was sie kostet. Einsenden müssen Sie ihn zunächst nicht.',
      links: [
        ['/schluessel-nach-code', 'Code vorhanden? Schlüssel nach Code'],
        ['/autoschluessel/kopieren', 'Mechanische Autoschlüssel'],
      ],
    },
    {
      route: 'schluessel-nach-code',
      headline: 'Schlüssel nach Code',
      subline: 'Code eingeben, Stückzahl wählen, bestellen. Ihr Originalschlüssel bleibt bei Ihnen.',
      intro:
        'Viele Schlösser tragen einen aufgedruckten oder eingeprägten Code. Nach diesem Code '
        + 'fertigen wir den passenden Schlüssel. Ihr Originalschlüssel bleibt bei Ihnen.',
      title: 'Schlüssel nach Code bestellen',
      description:
        'Code eingeben, Stückzahl wählen, bestellen: Nach dem Code auf Ihrem Schloss fertigen wir '
        + 'den passenden Schlüssel. Ihr Originalschlüssel bleibt bei Ihnen.',
      links: [
        ['/schluessel-nach-vorlage', 'Kein Code? Schlüssel nach Vorlage'],
        ['/gleichschliessende-zylinder', 'Mehrere Türen mit einem Schlüssel'],
      ],
    },
    {
      route: 'gleichschliessende-zylinder',
      headline: 'Gleichschließende Zylinder (Sperrschließung)',
      subline:
        'Ein Schlüssel für mehrere Türen. Sie stellen die Zylinder selbst zusammen und bestellen direkt.',
      intro:
        'Sie wählen für jede Tür den passenden Zylinder und seine Maße. Alle Zylinder bekommen '
        + 'dieselbe Schließung. Jeder gemeinsame Schlüssel sperrt dann jede dieser Türen.',
      title: 'Gleichschließende Zylinder bestellen',
      description:
        'Ein Schlüssel für mehrere Türen: Sie wählen für jede Tür den passenden Zylinder und '
        + 'seine Maße. Alle Zylinder bekommen dieselbe Schließung.',
      links: [
        ['/schliessanlagen', 'Größere Anlage? Zur Projektplanung'],
        ['/tuer-und-schliesstechnik', 'Tür- und Schließtechnik'],
      ],
    },
    {
      route: 'schliessanlagen',
      headline: 'Mechanische Schließanlagen',
      subline:
        'Wir planen Ihre Schließanlage mit Ihnen, von der Gleichschließung bis zur '
        + 'Generalhauptschlüsselanlage.',
      intro:
        'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Arten in '
        + 'einfacher Sprache. Ihre Anlage planen wir so, dass sie später erweitert werden kann.',
      title: 'Mechanische Schließanlagen planen',
      description:
        'Wir planen Ihre mechanische Schließanlage mit Ihnen, von der Gleichschließung bis zur '
        + 'Generalhauptschlüsselanlage. Die Anlage bleibt später erweiterbar.',
      links: [
        ['/schliessanlagen/konfigurator', 'Projekt erfassen'],
        ['/elektronische-zutrittsloesungen', 'Elektronische Zutrittslösungen'],
      ],
    },
    {
      route: 'elektronische-zutrittsloesungen',
      headline: 'Elektronische Zutrittslösungen',
      subline:
        'Zutritt mit Karte, Transponder, PIN, App oder digitalem Zylinder. Wir planen die Lösung '
        + 'für Ihr Objekt und richten sie ein.',
      intro:
        'Eine elektronische Zutrittslösung ersetzt den mechanischen Schlüssel oder ergänzt ihn. '
        + 'Geht eine Karte oder ein Transponder verloren, sperren Sie das Medium selbst. Die '
        + 'Zylinder müssen Sie dafür nicht tauschen.',
      title: 'Elektronische Zutrittslösungen',
      description:
        'Zutritt mit Karte, Transponder, PIN, App oder digitalem Zylinder. Geht ein Medium '
        + 'verloren, sperren Sie es selbst. Wir planen die Lösung für Ihr Objekt.',
      links: [
        ['/elektronische-zutrittsloesungen/konfigurator', 'Bedarf erfassen'],
        ['/schliessanlagen', 'Mechanische Schließanlagen'],
      ],
    },
    {
      route: 'tuer-und-schliesstechnik',
      headline: 'Tür- und Schließtechnik',
      subline: 'Zylinder, Schlösser, Beschläge und Türtechnik.',
      intro:
        'Alles rund um die Tür selbst: Zylinder, Einsteckschlösser, Mehrfachverriegelungen, '
        + 'Beschläge, Türschließer und die Technik, die dafür sorgt, dass eine Tür sauber schließt.',
      title: 'Tür- und Schließtechnik',
      description:
        'Zylinder, Einsteckschlösser, Mehrfachverriegelungen, Beschläge und Türschließer: Wir '
        + 'kümmern uns um die Technik, die dafür sorgt, dass Ihre Tür sauber schließt.',
      links: [
        ['/gleichschliessende-zylinder', 'Gleichschließende Zylinder'],
        ['/sicherheitstechnik', 'Sicherheitstechnik'],
      ],
    },
    {
      route: 'sicherheitstechnik',
      headline: 'Sicherheitstechnik',
      subline: 'Einbruchschutz, Überwachung und Alarmierung.',
      intro:
        'Sicherheit entsteht aus dem Zusammenspiel: Mechanik hält auf, Meldetechnik erkennt, '
        + 'Alarmierung informiert. Wir planen die Bereiche gemeinsam statt einzeln.',
      title: 'Sicherheitstechnik gegen Einbruch',
      description:
        'Einbruchschutz, Überwachung und Alarmierung: Mechanik hält auf, Meldetechnik erkennt, '
        + 'Alarmierung informiert. Wir planen die Bereiche gemeinsam statt einzeln.',
      links: [
        ['/sicherheitstechnik/sicherheitscheck', 'Sicherheitscheck starten'],
        ['/tuer-und-schliesstechnik', 'Mechanischer Grundschutz'],
      ],
    },
    {
      route: 'autoschluessel/marken',
      headline: 'Fahrzeugmarken und Modelle',
      subline: 'Sehen Sie nach, welche Schlüsselarten es für Ihr Fahrzeug gibt und ob es zum Anlernen zu uns muss.',
      intro:
        'Welche Schlüsselart Ihr Fahrzeug hat, hängt von Marke, Modell und Baujahr ab. Davon hängt '
        + 'auch ab, ob Ihr Fahrzeug zum Anlernen bei uns sein muss. Beim Anlernen tragen wir den neuen '
        + 'Schlüssel im Fahrzeug ein. Hier sehen Sie, was wir zu gängigen Fahrzeugen hinterlegt haben.',
      title: 'Autoschlüssel je Marke und Modell',
      description:
        'Welche Schlüsselart hat Ihr Fahrzeug, und muss es zum Anlernen vor Ort sein? Das hängt '
        + 'von Marke, Modell und Baujahr ab. Hier finden Sie die gängigen Fahrzeuge.',
      links: [
        ['/autoschluessel/anfrage', 'Termin anfragen'],
        ['/autoschluessel', 'Alle Autoschlüssel-Leistungen'],
      ],
    },
    {
      route: 'autoschluessel/anfrage',
      headline: 'Autoschlüssel anfragen',
      subline: 'Fahrzeug angeben, Fotos hochladen, Preis sehen, Termin buchen.',
      intro:
        'Sie geben Schritt für Schritt an, welches Fahrzeug und welchen Schlüssel Sie haben. Am '
        + 'Ende sehen Sie den Preis oder den Preisrahmen, leisten eine Anzahlung und buchen einen '
        + 'festen Termin. Ihre Eingaben werden im Browser zwischengespeichert.',
      title: 'Autoschlüssel-Anfrage mit Termin',
      description:
        'Sie geben Schritt für Schritt Fahrzeug und Schlüssel an und laden Fotos hoch. Am Ende '
        + 'leisten Sie eine Anzahlung und buchen einen festen Termin.',
      links: [
        ['/autoschluessel', 'Alle Autoschlüssel-Leistungen'],
        ['/service-und-termin/terminstatus', 'Terminstatus abrufen'],
      ],
    },
    {
      route: 'schluessel-nach-vorlage/anfrage',
      headline: 'Schlüssel nach Vorlage anfragen',
      subline: 'Für die Prüfung genügen drei Fotos. Ihren Schlüssel behalten Sie zunächst.',
      intro:
        'Fotografieren Sie Ihren Schlüssel aus drei Richtungen und ergänzen Sie, was Sie über ihn '
        + 'wissen. Wir sagen Ihnen dann, ob wir ihn nachfertigen können und was es kostet. '
        + 'Einsenden müssen Sie Ihren Schlüssel zunächst nicht.',
      title: 'Schlüssel nach Vorlage anfragen',
      description:
        'Für die Prüfung genügen drei Fotos Ihres Schlüssels und Ihre Angaben dazu. Wir sagen '
        + 'Ihnen, ob wir ihn nachfertigen können. Den Schlüssel behalten Sie zunächst.',
      links: [
        ['/schluessel-nach-vorlage', 'So funktioniert es'],
        ['/schluessel-nach-code', 'Code vorhanden? Schlüssel nach Code'],
      ],
    },
    {
      route: 'gleichschliessende-zylinder/konfigurator',
      headline: 'Gleichschließende Zylinder zusammenstellen',
      subline: 'Bauform, Maße, Funktion und Anzahl gemeinsamer Schlüssel.',
      intro:
        'Legen Sie für jede Tür eine Position an. Am Ende sehen Sie die vollständige '
        + 'Preisaufstellung und legen die Zusammenstellung in den Warenkorb.',
      title: 'Gleichschließung zusammenstellen',
      description:
        'Legen Sie für jede Tür eine Position an: Bauform, Maße, Funktion und Anzahl gemeinsamer '
        + 'Schlüssel. Am Ende legen Sie die Zusammenstellung in den Warenkorb.',
      links: [
        ['/gleichschliessende-zylinder', 'Was ist eine Gleichschließung?'],
        ['/ratgeber/zylinder-richtig-ausmessen', 'Zylinder richtig messen'],
      ],
    },
    {
      route: 'schliessanlagen/konfigurator',
      headline: 'Schließanlage: Projekt erfassen',
      subline: 'Zehn Frageblöcke, aus denen ein belastbares Angebot entsteht.',
      intro:
        'Sie beschreiben Ihr Objekt, Ihre Nutzer und Ihre Türen. Am Ende sehen Sie eine '
        + 'Zusammenfassung, die wir als Projektbericht übernehmen. Ihre Eingaben werden im '
        + 'Browser zwischengespeichert.',
      title: 'Schließanlage: Projekt erfassen',
      description:
        'Sie beschreiben Ihr Objekt, Ihre Nutzer und Ihre Türen in zehn Frageblöcken. Am Ende '
        + 'sehen Sie eine Zusammenfassung, die wir als Projektbericht übernehmen.',
      links: [
        ['/schliessanlagen', 'Systeme im Vergleich'],
        ['/ratgeber/welche-schliessanlage-passt', 'Welche Anlage passt?'],
      ],
    },
    {
      route: 'elektronische-zutrittsloesungen/konfigurator',
      headline: 'Elektronische Zutrittslösung: Bedarf erfassen',
      subline: 'Acht Fragen zu Objekt, Umfang, Medien und Berechtigungen.',
      intro:
        'Wir klären, wie viele Türen und Nutzer es gibt, womit geöffnet werden soll und wie die '
        + 'Berechtigungen aussehen. Daraus entsteht ein passender Vorschlag.',
      title: 'Zutrittslösung: Bedarf erfassen',
      description:
        'Acht Fragen zu Objekt, Umfang, Medien und Berechtigungen: Wir klären, wie viele Türen '
        + 'und Nutzer es gibt und womit geöffnet werden soll.',
      links: [
        ['/elektronische-zutrittsloesungen', 'Überblick über die Lösungen'],
        ['/ratgeber/mechanisch-oder-elektronisch', 'Mechanisch oder elektronisch?'],
      ],
    },
    {
      route: 'sicherheitstechnik/sicherheitscheck',
      headline: 'Geführter Sicherheitscheck',
      subline: 'Bestandsaufnahme Ihres Objekts in wenigen Schritten.',
      intro:
        'Wir gehen Ihr Objekt gemeinsam durch: Zugänge, erreichbare Fenster, Nebengebäude und '
        + 'vorhandene Technik. Daraus entsteht ein Vorschlag, der zu Ihrer Situation passt.',
      title: 'Sicherheitscheck für Ihr Objekt',
      description:
        'Bestandsaufnahme Ihres Objekts in wenigen Schritten: Zugänge, erreichbare Fenster, '
        + 'Nebengebäude und vorhandene Technik. Daraus entsteht ein passender Vorschlag.',
      links: [
        ['/sicherheitstechnik', 'Alle Bereiche der Sicherheitstechnik'],
        ['/ratgeber/einbruchschutz-wo-anfangen', 'Wo sinnvoll anfangen?'],
      ],
    },
    {
      route: 'service-und-termin',
      headline: 'Service und Termin',
      subline:
        'Hier stellen Sie eine Anfrage, sehen den Stand Ihres Auftrags oder nehmen Kontakt mit '
        + 'uns auf.',
      intro:
        'Wählen Sie den Weg, der zu Ihrem Anliegen passt. Gehört es in keinen der Fachbereiche, '
        + 'stellen Sie eine allgemeine Anfrage.',
      title: 'Service und Termin',
      description:
        'Hier stellen Sie eine allgemeine Anfrage, sehen den Stand Ihres Auftrags oder nehmen '
        + 'Kontakt mit uns auf. Wählen Sie den Weg, der zu Ihrem Anliegen passt.',
      links: [
        ['/service-und-termin/anfrage', 'Anfrage zu einer Leistung'],
        ['/service-und-termin/terminstatus', 'Terminstatus prüfen'],
      ],
    },
    {
      route: 'partner-werden',
      headline: 'Partner werden',
      subline:
        'Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Fachbetriebe vor Ort weiter.',
      intro:
        'Bei uns gehen auch Anfragen aus Regionen ein, in denen wir selbst nicht tätig sind. Diese Aufträge '
        + 'vermitteln wir an zuverlässige Fachbetriebe vor Ort. Sie bewerben sich online mit Angaben zu Betrieb, Leistungen und Ausstattung; wir prüfen '
        + 'Ihre Bewerbung und melden uns bei Ihnen.',
      title: 'Autoschlüssel-Partner werden',
      description:
        'Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Fachbetriebe vor '
        + 'Ort weiter. Bewerben Sie sich online als Partner.',
      links: [
        ['/partner-werden/netzwerk-deutschland', 'Das Partnernetz für Fahrzeugschlüssel'],
        ['/autoschluessel', 'Autoschlüssel'],
        ['/service-und-termin/kontakt', 'Kontakt'],
      ],
    },
  ];

  // Seiten der gemeinsamen Fahrzeugschlüssel-Anfrage (FA-KERN-02B): Kopftexte aus den Klassendaten,
  // gleichlautend in content/seo.json. Verweise führen in die Anfrage und auf die Einstiegsseite.
  const klassenSeiten = Object.values(KLASSEN_SEITEN).flatMap(({ einstieg, anfrage }) =>
    [einstieg, anfrage].filter((kopf): kopf is SeitenKopf => kopf !== null),
  );
  for (const kopf of klassenSeiten) {
    raw.push({ ...kopf, links: [['/autoschluessel', 'Autoschlüssel']] });
  }

  return raw.map((entry) => ({
    route: entry.route,
    headline: entry.headline,
    subline: entry.subline,
    intro: entry.intro,
    sections: [],
    faq: [],
    seo: {
      title: entry.title,
      description: entry.description,
      internalLinks: entry.links.map(([href, label]) => ({ href, label })),
      socialImage: {
        motif: `Vorschaubild für soziale Netzwerke: ${entry.headline}`,
        ratio: '16/9',
      },
    },
    updatedAt: now,
  }));
}

/** Ratgeberseiten — beantworten je eine konkrete Frage. */
export function guides(): Guide[] {
  const now = '2026-09-15T00:00:00.000Z';

  const raw: Array<{
    slug: string;
    title: string;
    excerpt: string;
    topic: Guide['topic'];
    body: Array<[string, string]>;
    next: [string, string];
    /** Suchergebnis-Texte und Verweise, wortgleich mit content/guides.json (FA-SEO-01B). */
    seo: { title: string; description: string; links: Array<[string, string]> };
  }> = [
    {
      slug: 'autoschluessel-verloren-was-tun',
      title: 'Autoschlüssel verloren: Was jetzt zu tun ist',
      excerpt:
        'Suchen Sie zuerst gründlich nach dem Schlüssel. Hilft das nicht, gehen Sie Schritt für '
        + 'Schritt vor. Erst prüfen, dann sichern, dann anfragen.',
      topic: 'autoschluessel',
      body: [
        [
          'Zuerst gründlich suchen',
          'Sehen Sie an den üblichen Stellen nach. Fragen Sie dort nach, wo Sie zuletzt waren. Ein '
            + 'wiedergefundener Schlüssel ist immer die günstigste Lösung.',
        ],
        [
          'Prüfen, ob noch ein Schlüssel da ist',
          'Haben Sie noch einen funktionierenden Schlüssel, ist der Aufwand für den Ersatz deutlich '
            + 'geringer. Ist kein Schlüssel mehr da, braucht es mehr Vorarbeit. Dann brauchen wir auch '
            + 'Ihre Fahrzeugpapiere.',
        ],
        [
          'Klären, ob etwas gesperrt werden sollte',
          'Vielleicht lagen beim Schlüssel Unterlagen, aus denen sich Ihre Adresse ergibt. Dann '
            + 'sprechen Sie mit uns über das weitere Vorgehen. In manchen Fällen ist es sinnvoll, den '
            + 'verlorenen Schlüssel aus dem Fahrzeug zu entfernen.',
        ],
        [
          'Was wir von Ihnen brauchen',
          'Wir brauchen Marke, Modell und Baujahr des Fahrzeugs. Als Nachweis, dass Sie den '
            + 'Schlüssel bekommen dürfen, zeigen Sie uns Ihren Ausweis und den Fahrzeugschein. Steht '
            + 'das Fahrzeug nicht auf Ihren Namen, brauchen wir zusätzlich eine Vollmacht des Halters. '
            + 'Gibt es noch einen Schlüssel, schicken Sie uns Fotos davon. Damit können wir Machbarkeit '
            + 'und Preis einordnen.',
        ],
      ],
      next: ['/autoschluessel/anfrage?vorhanden=0', 'Anfrage für Ersatzschlüssel starten'],
      seo: {
        title: 'Autoschlüssel verloren: Was tun?',
        description:
          'Suchen Sie zuerst gründlich. Hilft das nicht, gehen Sie in dieser Reihenfolge vor: erst '
          + 'prüfen, dann sichern, dann einen Ersatzschlüssel anfragen.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/autoschluessel/anfrage?vorhanden=0', 'Anfrage für Ersatzschlüssel starten'],
        ],
      },
    },
    {
      slug: 'unterschied-kopie-und-programmierung',
      title: 'Kopie oder Programmierung: Wo ist der Unterschied?',
      excerpt:
        'Eine reine Kopie kann Türen und Klappen öffnen. Soll der Schlüssel auch den Motor '
        + 'starten, muss er meist zusätzlich programmiert werden.',
      topic: 'autoschluessel',
      body: [
        [
          'Der mechanische Teil',
          'Der Bart ist der gefräste Teil des Schlüssels. Er passt ins Schloss und öffnet Tür oder '
            + 'Lenkradschloss. Diesen Teil fertigen wir nach Vorlage oder nach geeigneten '
            + 'Fahrzeugdaten.',
        ],
        [
          'Der elektronische Teil',
          'Im Schlüssel sitzt meist zusätzlich ein Transponder, also ein kleiner Chip. Das Fahrzeug '
            + 'startet nur, wenn es diesen Chip kennt. Dieses Anlernen ist ein eigener Arbeitsschritt '
            + 'am Fahrzeug.',
        ],
        [
          'Was das für Sie bedeutet',
          'Wollen Sie nur eine Tür oder eine Klappe öffnen, kann eine reine Kopie reichen. Soll der '
            + 'Schlüssel das Fahrzeug starten, gehört die Programmierung dazu.',
        ],
      ],
      next: ['/autoschluessel/programmieren', 'Programmierung und Anlernen'],
      seo: {
        title: 'Autoschlüssel: Kopie oder Anlernen?',
        description:
          'Eine reine Kopie öffnet Türen und Klappen. Soll der Schlüssel auch den Motor starten, '
          + 'muss sein Chip meist zusätzlich am Fahrzeug angelernt werden.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/autoschluessel/programmieren', 'Programmierung und Anlernen'],
        ],
      },
    },
    {
      slug: 'zylinder-richtig-ausmessen',
      title: 'Zylinder richtig ausmessen',
      excerpt:
        'Sie messen zwei Längen, Maß A nach außen und Maß B nach innen. Beide messen Sie ab der '
        + 'Mitte der Stulpschraube in der schmalen Stirnseite der Tür.',
      topic: 'gleichschliessende-zylinder',
      body: [
        [
          'Der Bezugspunkt',
          'Gemessen wird immer ab der Mitte der Stulpschraube. Das ist die Schraube in der schmalen '
            + 'Stirnseite der Tür. Von dort nach außen ist Maß A, nach innen Maß B.',
        ],
        [
          'So gehen Sie vor',
          'Öffnen Sie die Tür. Messen Sie mit Lineal oder Zollstock von der Schraubenmitte bis zum '
            + 'Ende des Zylinders, einmal außen und einmal innen. Runden Sie auf die nächsten vollen 5 '
            + 'Millimeter auf.',
        ],
        [
          'Typische Fehler',
          'Ein zu kurzer Zylinder lässt sich nicht sicher bedienen. Ein zu langer steht über und '
            + 'bietet unnötig Angriffsfläche. Der Zylinder sollte höchstens 3 Millimeter über den '
            + 'Beschlag außen vorstehen. Sonst braucht es einen Schutzbeschlag. Das ist ein verstärkter '
            + 'Beschlag außen an der Tür.',
        ],
      ],
      next: ['/gleichschliessende-zylinder', 'Zylinder konfigurieren'],
      seo: {
        title: 'Zylinder richtig ausmessen',
        description:
          'Sie messen zwei Längen: Maß A nach außen und Maß B nach innen, beide ab der Mitte der '
          + 'Stulpschraube. So gehen Sie vor, und diese Fehler vermeiden Sie.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/gleichschliessende-zylinder', 'Zylinder konfigurieren'],
        ],
      },
    },
    {
      slug: 'welche-schliessanlage-passt',
      title: 'Welche Schließanlage passt zu meinem Objekt?',
      excerpt:
        'Das hängt davon ab, wer welche Türen öffnen soll. Öffnet ein Schlüssel alle Türen, ist '
        + 'das eine Gleichschließung. Brauchen Personen unterschiedliche Rechte, passt eine '
        + 'Schließanlage.',
      topic: 'schliessanlagen',
      body: [
        [
          'Gleichschließung',
          'Alle Zylinder öffnen mit demselben Schlüssel. Das passt für ein Einfamilienhaus oder '
            + 'einen klar abgegrenzten Bereich.',
        ],
        [
          'Zentralschlossanlage (Z)',
          'Jeder hat einen eigenen Schlüssel für die eigene Tür. Zusätzlich öffnet jeder dieser '
            + 'Schlüssel die gemeinsamen Türen, meist den Hauseingang. Das ist typisch für '
            + 'Mehrfamilienhäuser.',
        ],
        [
          'Hauptschlüsselanlage (HS)',
          'Jeder Einzelschlüssel öffnet nur die Türen, die ihm zugeordnet sind. Ein Hauptschlüssel '
            + 'öffnet alle ihm zugeordneten Türen, meist alle Türen der Anlage. Das ist typisch für '
            + 'Betriebe und Verwaltungen.',
        ],
        [
          'Generalhauptschlüsselanlage (GHS)',
          'Diese Anlage hat mehrere Ebenen. Unten stehen Schlüssel für einzelne Abteilungen oder '
            + 'Bereiche, darüber Hauptschlüssel. Ganz oben steht ein Generalhauptschlüssel. Das passt '
            + 'für größere Grundstücke mit mehreren Gebäuden.',
        ],
        [
          'An später denken',
          'Planen Sie früh, ob später Türen, Nutzer oder Gebäude dazukommen. Hat die Anlage von '
            + 'Anfang an Reserve, lässt sie sich später ergänzen. Sie müssen dann nicht alles tauschen.',
        ],
      ],
      next: ['/schliessanlagen/konfigurator', 'Projekt erfassen'],
      seo: {
        title: 'Welche Schließanlage passt zu mir?',
        description:
          'Gleichschließung, Zentralschlossanlage, Hauptschlüsselanlage oder '
          + 'Generalhauptschlüsselanlage: Es hängt davon ab, wer welche Türen öffnen soll.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/schliessanlagen/konfigurator', 'Projekt erfassen'],
        ],
      },
    },
    {
      slug: 'schluesselcode-finden',
      title: 'Wo finde ich den Schlüsselcode?',
      excerpt:
        'Der Code steht auf dem Schloss, auf dem Schlüsselkopf oder in Ihren Unterlagen. Finden '
        + 'Sie keinen, hilft der Weg über Schlüssel nach Vorlage.',
      topic: 'schluessel-nach-code',
      body: [
        [
          'Am Schloss selbst',
          'Bei Möbel-, Spind- und Briefkastenschlössern steht der Code häufig auf der Vorderseite '
            + 'des Schlosses oder rund um das Schlüsselloch. Sie sehen ihn, sobald die Tür offen ist.',
        ],
        [
          'Auf dem Schlüssel',
          'Viele Schlüssel tragen den Code auf dem Kopf oder am Schaft. Fotografieren Sie ihn bei '
            + 'gutem Licht, damit die Prägung lesbar ist.',
        ],
        [
          'In den Unterlagen',
          'Bei Schließanlagen und geschützten Systemen steht die Nummer auf der Sicherungskarte '
            + 'oder im Schließplan. Die Sicherungskarte ist zugleich Ihr Nachweis, dass Sie '
            + 'Nachschlüssel bestellen dürfen. Bewahren Sie diese Unterlagen getrennt von den '
            + 'Schlüsseln auf.',
        ],
        [
          'Wenn Sie keinen Code finden',
          'Dann nutzen Sie Schlüssel nach Vorlage. Sie schicken uns drei Fotos, und wir prüfen, ob '
            + 'eine Anfertigung möglich ist.',
        ],
      ],
      next: ['/schluessel-nach-code', 'Schlüssel nach Code'],
      seo: {
        title: 'Wo finde ich den Schlüsselcode?',
        description:
          'Der Code steht auf dem Schloss, auf dem Schlüsselkopf oder in Ihren Unterlagen. Finden '
          + 'Sie keinen, hilft der Weg über Schlüssel nach Vorlage mit drei Fotos.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/schluessel-nach-code', 'Schlüssel nach Code'],
        ],
      },
    },
    {
      slug: 'einbruchschutz-wo-anfangen',
      title: 'Einbruchschutz: Wo fängt man sinnvoll an?',
      excerpt:
        'Fangen Sie bei Türen und Fenstern an, die man ohne Hilfsmittel erreicht. Dort hilft '
        + 'zuerst gute Mechanik. Meldetechnik und Kamera ergänzen sie später.',
      topic: 'sicherheitstechnik',
      body: [
        [
          'Schauen Sie von außen auf Ihr Gebäude',
          'Prüfen Sie, welche Türen und Fenster man ohne Hilfsmittel erreicht. Genau dort beginnt '
            + 'sinnvoller Schutz, nicht bei der Kamera.',
        ],
        [
          'Mechanik zuerst',
          'Mechanik hält Einbrecher auf und kostet sie Zeit. Zusatzschlösser, Schutzbeschläge und '
            + 'geeignete Zylinder wirken auch, wenn niemand zu Hause ist. Sie brauchen dafür keinen '
            + 'Strom.',
        ],
        [
          'Dann Meldetechnik',
          'Alarm- und Meldetechnik erkennt einen Einbruch und gibt Bescheid. Sie ersetzt keine '
            + 'Mechanik, sondern ergänzt sie.',
        ],
        [
          'Kamera zuletzt und rechtlich sauber',
          'Kameras helfen bei der Aufklärung. Achten Sie darauf, dass Sie nur Ihren eigenen Bereich '
            + 'erfassen. Öffentliche Flächen und Nachbargrundstücke dürfen nicht gefilmt werden.',
        ],
      ],
      next: ['/sicherheitstechnik/sicherheitscheck', 'Sicherheitscheck starten'],
      seo: {
        title: 'Einbruchschutz: Wo fange ich an?',
        description:
          'Fangen Sie bei Türen und Fenstern an, die man ohne Hilfsmittel erreicht. Dort hilft '
          + 'zuerst gute Mechanik. Meldetechnik und Kamera ergänzen sie später.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/sicherheitstechnik/sicherheitscheck', 'Sicherheitscheck starten'],
        ],
      },
    },
    {
      slug: 'schluessel-verloren-wohnung',
      title: 'Wohnungsschlüssel verloren: Schloss tauschen oder nicht?',
      excerpt:
        'Das hängt davon ab, ob jemand den Schlüssel Ihrer Wohnung zuordnen kann. Hing eine '
        + 'Adresse am Schlüsselbund, sollten Sie handeln. Oft genügt dann ein neuer Zylinder an der '
        + 'betroffenen Tür.',
      topic: 'tuer-und-schliesstechnik',
      body: [
        [
          'Die entscheidende Frage',
          'Entscheidend ist, ob ein Finder den Schlüssel Ihrer Wohnung zuordnen kann. Hing am '
            + 'Schlüsselbund eine Adresse oder ein beschrifteter Anhänger, sollten Sie handeln.',
        ],
        [
          'Bei einer Schließanlage',
          'Gehört der Schlüssel zu einer Schließanlage, betrifft der Verlust nicht nur Ihre Tür. '
            + 'Sagen Sie dann Ihrem Vermieter oder der Hausverwaltung Bescheid.',
        ],
        [
          'Die praktische Lösung',
          'Oft genügt es, an der betroffenen Tür den Zylinder zu tauschen. Der Zylinder ist der '
            + 'Teil des Schlosses, in den Sie den Schlüssel stecken. Sind mehrere Türen betroffen, sind '
            + 'gleichschließende Zylinder häufig günstiger als einzelne. Gleichschließend heißt, ein '
            + 'Schlüssel öffnet alle diese Türen.',
        ],
      ],
      next: ['/gleichschliessende-zylinder', 'Gleichschließende Zylinder'],
      seo: {
        title: 'Wohnungsschlüssel verloren',
        description:
          'Ob Sie das Schloss tauschen sollten, hängt davon ab, ob ein Finder den Schlüssel Ihrer '
          + 'Wohnung zuordnen kann. Oft genügt ein neuer Zylinder an der Tür.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/gleichschliessende-zylinder', 'Gleichschließende Zylinder'],
        ],
      },
    },
    {
      slug: 'mechanisch-oder-elektronisch',
      title: 'Mechanisch oder elektronisch: Was ist sinnvoller?',
      excerpt:
        'Entscheidend ist, wie oft sich etwas ändert. Bleiben die Nutzer gleich, ist Mechanik '
        + 'robust und wartungsarm. Wechseln sie oft, spielt Elektronik ihre Stärke aus.',
      topic: 'elektronische-zutrittsloesungen',
      body: [
        [
          'Wenn sich selten etwas ändert',
          'Bei einem Einfamilienhaus mit festen Nutzern ist eine mechanische Lösung robust und '
            + 'wartungsarm. Sie funktioniert ohne Strom und Netz.',
        ],
        [
          'Wenn sich häufig etwas ändert',
          'Wechseln Nutzer regelmäßig, etwa Personal, Reinigung, Handwerker oder Mieter, spielt '
            + 'Elektronik ihre Stärke aus. Geht ein elektronischer Schlüssel oder eine Karte verloren, '
            + 'lässt sich beides sperren. Zylinder müssen Sie dafür nicht tauschen.',
        ],
        [
          'Die Kombination',
          'In der Praxis ist eine Mischung häufig die beste Lösung. Elektronik kommt an die Türen '
            + 'mit wechselnden Nutzern, Mechanik überall dort, wo sich wenig ändert.',
        ],
      ],
      next: ['/elektronische-zutrittsloesungen/konfigurator', 'Bedarf erfassen'],
      seo: {
        title: 'Zutritt mechanisch oder elektronisch?',
        description:
          'Entscheidend ist, wie oft sich etwas ändert. Bei festen Nutzern ist Mechanik robust und '
          + 'wartungsarm, bei wechselnden Nutzern spielt Elektronik ihre Stärke aus.',
        links: [
          ['/ratgeber', 'Alle Ratgeber'],
          ['/elektronische-zutrittsloesungen/konfigurator', 'Bedarf erfassen'],
        ],
      },
    },
  ];

  return raw.map((g) => ({
    id: g.slug,
    slug: g.slug,
    title: g.title,
    excerpt: g.excerpt,
    topic: g.topic,
    body: g.body.map(([heading, text]) => ({ heading, text })),
    image: { motif: `Beitragsbild: ${g.title}`, ratio: '16/9' },
    nextStep: { href: g.next[0], label: g.next[1] },
    seo: {
      title: g.seo.title,
      description: g.seo.description,
      internalLinks: g.seo.links.map(([href, label]) => ({ href, label })),
    },
    updatedAt: now,
  }));
}

/**
 * Stadtseiten. Bewusst leer: keine künstlich erzeugten Städteseiten
 * (Erg. Leitfaden §5). Eine Stadt kommt erst dazu, wenn der Betrieb dort
 * echte Vor-Ort-Leistungen erbringt und den örtlichen Text selbst schreibt —
 * im Backend unter „Einsatzgebiete“.
 */
export function cities(): CityPage[] {
  return [];
}
