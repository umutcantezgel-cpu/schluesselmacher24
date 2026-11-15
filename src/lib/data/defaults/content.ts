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
      subline: 'Nachmachen, programmieren, reparieren — mit klarem Ablauf und festem Termin.',
      intro:
        'Ob Zweitschlüssel, Ersatz nach Verlust, Programmierung oder Reparatur: Wir klären zuerst, '
        + 'was Ihr Fahrzeug braucht, und nennen Ihnen danach Preis oder Preisrahmen. Erst dann '
        + 'buchen Sie einen Termin.',
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
        ['/service-und-termin/anfrage?thema=fahrzeugoeffnung', 'Fahrzeugöffnung anfragen'],
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
      subline: 'Was bei Ihrem Fahrzeug technisch möglich ist.',
      intro:
        'Welche Schlüsselart Ihr Fahrzeug hat und ob es zum Anlernen vor Ort sein muss, hängt '
        + 'von Marke, Modell und Baujahr ab. Hier finden Sie, was wir zu den gängigen Fahrzeugen '
        + 'hinterlegt haben.',
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
        'Hier stellen Sie eine Anfrage, sehen den Stand Ihres Vorgangs oder nehmen Kontakt mit '
        + 'uns auf.',
      intro:
        'Wählen Sie den Weg, der zu Ihrem Anliegen passt. Gehört es in keinen der Fachbereiche, '
        + 'stellen Sie eine allgemeine Anfrage.',
      title: 'Service und Termin',
      description:
        'Hier stellen Sie eine allgemeine Anfrage, sehen den Stand Ihres Vorgangs oder nehmen '
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
        + 'vermitteln wir an zuverlässige Fachbetriebe vor Ort. Sie bewerben sich mit wenigen Angaben; wir prüfen '
        + 'Ihre Bewerbung und melden uns bei Ihnen.',
      title: 'Autoschlüssel-Partner werden',
      description:
        'Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Fachbetriebe vor '
        + 'Ort weiter. Bewerben Sie sich mit wenigen Angaben als Partner.',
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
  }> = [
    {
      slug: 'autoschluessel-verloren-was-tun',
      title: 'Autoschlüssel verloren — was jetzt zu tun ist',
      excerpt:
        'Die richtige Reihenfolge spart Zeit und Geld: erst sichern, dann prüfen, dann bestellen.',
      topic: 'autoschluessel',
      body: [
        [
          'Zuerst: Ruhe bewahren und nachsehen',
          'Prüfen Sie zuerst die üblichen Stellen und fragen Sie an den Orten nach, an denen Sie '
            + 'zuletzt waren. Ein wiedergefundener Schlüssel ist immer die günstigste Lösung.',
        ],
        [
          'Prüfen: Ist noch ein Schlüssel vorhanden?',
          'Wenn noch ein funktionierender Schlüssel da ist, ist der Aufwand für einen Ersatz '
            + 'deutlich geringer. Ist kein Schlüssel mehr vorhanden, ist mehr Vorarbeit nötig — '
            + 'und wir brauchen Ihre Fahrzeugpapiere.',
        ],
        [
          'Sicherheitsfrage: Sollte etwas gesperrt werden?',
          'Wenn der Schlüssel zusammen mit Unterlagen verloren ging, aus denen sich Ihre Adresse '
            + 'ergibt, sprechen Sie mit uns über das weitere Vorgehen. In manchen Fällen ist es '
            + 'sinnvoll, den verlorenen Schlüssel aus dem Fahrzeug zu entfernen.',
        ],
        [
          'Was wir von Ihnen brauchen',
          'Fahrzeugmarke, Modell und Baujahr, Fotos eines vorhandenen Schlüssels, falls es einen '
            + 'gibt, und den Fahrzeugschein. Damit können wir Machbarkeit und Preis einordnen.',
        ],
      ],
      next: ['/autoschluessel/anfrage?vorhanden=0', 'Anfrage für Ersatzschlüssel starten'],
    },
    {
      slug: 'unterschied-kopie-und-programmierung',
      title: 'Kopie oder Programmierung — wo ist der Unterschied?',
      excerpt:
        'Ein gefräster Bart öffnet die Tür. Für den Motorstart braucht es meist mehr.',
      topic: 'autoschluessel',
      body: [
        [
          'Der mechanische Teil',
          'Der Bart ist der gefräste Teil des Schlüssels. Er passt in das Schloss und öffnet Tür '
            + 'oder Lenkradschloss. Diesen Teil können wir nach Vorlage oder geeigneten '
            + 'Fahrzeugdaten anfertigen.',
        ],
        [
          'Der elektronische Teil',
          'Im Schlüssel sitzt meist zusätzlich ein Transponder. Das Fahrzeug startet nur, wenn es '
            + 'diesen Transponder kennt. Dieses Anlernen ist ein eigener Arbeitsschritt am Fahrzeug.',
        ],
        [
          'Was das für Sie bedeutet',
          'Eine reine Kopie kann ausreichen, wenn Sie nur eine Tür oder eine Klappe öffnen wollen. '
            + 'Soll der Schlüssel das Fahrzeug starten, gehört die Programmierung dazu.',
        ],
      ],
      next: ['/autoschluessel/programmieren', 'Programmierung und Anlernen'],
    },
    {
      slug: 'zylinder-richtig-ausmessen',
      title: 'Zylinder richtig ausmessen',
      excerpt: 'Maß A und Maß B — gemessen ab der Mitte der Stulpschraube.',
      topic: 'gleichschliessende-zylinder',
      body: [
        [
          'Der Bezugspunkt',
          'Gemessen wird immer ab der Mitte der Stulpschraube — das ist die Schraube in der '
            + 'schmalen Stirnseite der Tür. Von dort nach außen ist Maß A, nach innen Maß B.',
        ],
        [
          'So gehen Sie vor',
          'Öffnen Sie die Tür und messen Sie mit einem Lineal oder Zollstock von der Schraubenmitte '
            + 'bis zum jeweiligen Ende des Zylinders. Runden Sie auf volle 5 Millimeter.',
        ],
        [
          'Typische Fehler',
          'Ein zu kurzer Zylinder lässt sich nicht sicher betätigen. Ein zu langer steht über und '
            + 'bietet unnötig Angriffsfläche. Ein Überstand von mehr als etwa 3 Millimetern sollte '
            + 'durch einen passenden Schutzbeschlag abgedeckt sein.',
        ],
      ],
      next: ['/gleichschliessende-zylinder', 'Zylinder konfigurieren'],
    },
    {
      slug: 'welche-schliessanlage-passt',
      title: 'Welche Schließanlage passt zu meinem Objekt?',
      excerpt: 'Gleichschließung, Z, HS oder GHS — in einfacher Sprache erklärt.',
      topic: 'schliessanlagen',
      body: [
        [
          'Gleichschließung',
          'Alle Zylinder werden mit demselben Schlüssel geöffnet. Passt für ein Einfamilienhaus '
            + 'oder einen klar abgegrenzten Bereich.',
        ],
        [
          'Zentralschlossanlage (Z)',
          'Jeder hat seinen eigenen Schlüssel für die eigene Tür. Zusätzlich öffnet jeder Schlüssel '
            + 'eine gemeinsame Tür, meist den Hauseingang. Typisch für Mehrfamilienhäuser.',
        ],
        [
          'Hauptschlüsselanlage (HS)',
          'Einzelschlüssel öffnen bestimmte Türen. Ein Hauptschlüssel öffnet alle oder eine größere '
            + 'Gruppe davon. Typisch für Betriebe und Verwaltungen.',
        ],
        [
          'Generalhauptschlüsselanlage (GHS)',
          'Mehrere Ebenen: Abteilungs- oder Bereichsschlüssel, darüber Hauptschlüssel und ganz oben '
            + 'ein Generalhauptschlüssel. Für größere Liegenschaften mit mehreren Gebäuden.',
        ],
        [
          'Und die Erweiterbarkeit?',
          'Planen Sie früh mit, ob später Türen, Nutzer oder Gebäude dazukommen. Eine Anlage, die '
            + 'von Anfang an Reserve hat, lässt sich später ergänzen, ohne alles zu tauschen.',
        ],
      ],
      next: ['/schliessanlagen/konfigurator', 'Projekt erfassen'],
    },
    {
      slug: 'schluesselcode-finden',
      title: 'Wo finde ich den Schlüsselcode?',
      excerpt: 'Auf dem Schloss, auf dem Schlüsselkopf oder in den Unterlagen.',
      topic: 'schluessel-nach-code',
      body: [
        [
          'Am Schloss selbst',
          'Bei Möbel-, Spind- und Briefkastenschlössern steht der Code häufig auf der Stirnseite '
            + 'des Schlosses oder auf dem Schließzylinder — sichtbar, sobald die Tür offen ist.',
        ],
        [
          'Auf dem Schlüssel',
          'Viele Schlüssel tragen den Code auf dem Kopf oder am Schaft. Fotografieren Sie ihn bei '
            + 'gutem Licht, damit die Prägung lesbar ist.',
        ],
        [
          'In den Unterlagen',
          'Bei Schließanlagen und geschützten Systemen steht die Nummer auf der Sicherungskarte '
            + 'oder im Schließplan. Bewahren Sie diese Unterlagen getrennt von den Schlüsseln auf.',
        ],
        [
          'Wenn Sie keinen Code finden',
          'Dann ist der Weg über Schlüssel nach Vorlage der richtige: drei Fotos, und wir prüfen, '
            + 'ob eine Anfertigung möglich ist.',
        ],
      ],
      next: ['/schluessel-nach-code', 'Codelinien ansehen'],
    },
    {
      slug: 'einbruchschutz-wo-anfangen',
      title: 'Einbruchschutz — wo fängt man sinnvoll an?',
      excerpt: 'Erst die erreichbaren Stellen, dann die Meldetechnik.',
      topic: 'sicherheitstechnik',
      body: [
        [
          'Schauen Sie von außen auf Ihr Gebäude',
          'Welche Türen und Fenster sind ohne Hilfsmittel erreichbar? Genau dort beginnt sinnvoller '
            + 'Schutz — nicht bei der Kamera.',
        ],
        [
          'Mechanik zuerst',
          'Mechanik hält auf und kostet Zeit. Zusatzschlösser, Schutzbeschläge und geeignete '
            + 'Zylinder wirken auch dann, wenn niemand zu Hause ist und kein Strom fließt.',
        ],
        [
          'Dann Meldetechnik',
          'Alarm- und Meldetechnik erkennt und informiert. Sie ersetzt keine Mechanik, sondern '
            + 'ergänzt sie.',
        ],
        [
          'Kamera zuletzt — und rechtlich sauber',
          'Kameras helfen bei der Aufklärung. Achten Sie darauf, dass Sie nur Ihren eigenen Bereich '
            + 'erfassen. Öffentliche Flächen und Nachbargrundstücke dürfen nicht gefilmt werden.',
        ],
      ],
      next: ['/sicherheitstechnik/sicherheitscheck', 'Sicherheitscheck starten'],
    },
    {
      slug: 'schluessel-verloren-wohnung',
      title: 'Wohnungsschlüssel verloren — Schloss tauschen oder nicht?',
      excerpt: 'Es kommt darauf an, ob der Schlüssel Ihrer Wohnung zugeordnet werden kann.',
      topic: 'tuer-und-schliesstechnik',
      body: [
        [
          'Die entscheidende Frage',
          'Kann jemand den gefundenen Schlüssel Ihrer Wohnung zuordnen? Wenn am Schlüsselbund eine '
            + 'Adresse oder ein beschrifteter Anhänger hing, sollten Sie handeln.',
        ],
        [
          'Bei einer Schließanlage',
          'Gehört der Schlüssel zu einer Anlage, betrifft der Verlust nicht nur Ihre Tür. '
            + 'Informieren Sie in diesem Fall Vermieter oder Verwaltung.',
        ],
        [
          'Die praktische Lösung',
          'Oft genügt ein Zylindertausch an der betroffenen Tür. Wenn mehrere Türen betroffen sind, '
            + 'ist eine gleichschließende Lösung häufig günstiger als einzelne Zylinder.',
        ],
      ],
      next: ['/gleichschliessende-zylinder', 'Gleichschließende Zylinder'],
    },
    {
      slug: 'mechanisch-oder-elektronisch',
      title: 'Mechanisch oder elektronisch — was ist sinnvoller?',
      excerpt: 'Beides hat seinen Platz. Entscheidend ist, wie oft sich etwas ändert.',
      topic: 'elektronische-zutrittsloesungen',
      body: [
        [
          'Wenn sich selten etwas ändert',
          'Bei einem Einfamilienhaus mit festen Nutzern ist eine mechanische Lösung robust, '
            + 'wartungsarm und unabhängig von Strom und Netz.',
        ],
        [
          'Wenn sich häufig etwas ändert',
          'Wechseln Nutzer regelmäßig — Personal, Reinigung, Handwerk, Mieter — spielt Elektronik '
            + 'ihre Stärke aus: Ein verlorenes Medium wird gesperrt, statt Zylinder zu tauschen.',
        ],
        [
          'Die Kombination',
          'In der Praxis ist die Mischung häufig die beste Lösung: elektronisch an den Türen mit '
            + 'wechselnden Nutzern, mechanisch überall dort, wo Ruhe herrscht.',
        ],
      ],
      next: ['/elektronische-zutrittsloesungen/konfigurator', 'Bedarf erfassen'],
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
      title: `${g.title}`,
      description: g.excerpt,
      internalLinks: [
        { href: '/ratgeber', label: 'Alle Ratgeber' },
        { href: g.next[0], label: g.next[1] },
      ],
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
