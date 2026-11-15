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
      title: 'SCHLÜSSELMACHER24 — Autoschlüssel, Schließtechnik und Sicherheitstechnik',
      description:
        'Autoschlüssel nachmachen und programmieren, Schlüssel nach Code und Vorlage, '
        + 'gleichschließende Zylinder, Schließanlagen, elektronische Zutrittslösungen und '
        + 'Sicherheitstechnik — aus einer Hand.',
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
      title: 'Autoschlüssel nachmachen und programmieren',
      description:
        'Autoschlüssel nachmachen, kopieren, programmieren und reparieren. Geführte Anfrage mit '
        + 'Schlüsselfotos, Preisangabe, Anzahlung und fester Terminbuchung.',
      links: [
        ['/autoschluessel/anfrage', 'Fahrzeug auswählen und Termin starten'],
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
      title: 'Autoschlüssel nachmachen — Zweit- und Ersatzschlüssel',
      description:
        'Zweitschlüssel und Ersatzschlüssel für Ihr Fahrzeug anfertigen lassen. Mit Schlüsselfotos, '
        + 'Preisangabe und fester Terminbuchung.',
      links: [
        ['/autoschluessel/anfrage', 'Anfrage starten'],
        ['/autoschluessel/programmieren', 'Programmierung und Anlernen'],
      ],
    },
    {
      route: 'autoschluessel/programmieren',
      headline: 'Autoschlüssel programmieren und anlernen',
      subline: 'Wir machen einen neuen oder vorhandenen Schlüssel Ihrem Fahrzeug bekannt.',
      intro:
        'Zum Anlernen brauchen wir in aller Regel Ihr Fahrzeug. Per Versand lässt sich das nicht lösen.',
      title: 'Autoschlüssel programmieren und anlernen',
      description:
        'Transponder, Wegfahrsperre, Funkfernbedienung und Smart Key anlernen lassen. '
        + 'Termin mit Fahrzeug vor Ort.',
      links: [
        ['/autoschluessel/anfrage', 'Termin mit Fahrzeug buchen'],
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
      title: 'Autoschlüssel kopieren — was mechanisch möglich ist',
      description:
        'Mechanische Kopie von Autoschlüsseln nach Vorlage. Wir erklären, wann eine Kopie reicht '
        + 'und wann zusätzlich programmiert werden muss.',
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
      title: 'Funkschlüssel und Funkfernbedienung',
      description:
        'Funkschlüssel reparieren, Gehäuse und Tasten tauschen, Funkfunktion prüfen und Ersatz '
        + 'anfertigen lassen.',
      links: [
        ['/autoschluessel/anfrage', 'Anfrage starten'],
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
      title: 'Smart Key und Keyless — Ersatz und Programmierung',
      description:
        'Smart Key und schlüssellose Systeme: Ersatz, Programmierung und Prüfung. '
        + 'Mit Vorlaufzeit und festem Termin.',
      links: [
        ['/autoschluessel/anfrage', 'Anfrage starten'],
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
      title: 'Schlüsselbart fräsen nach Vorlage oder Fahrzeugdaten',
      description:
        'Schlüsselbart für Autoschlüssel fräsen lassen — nach Original oder geeigneten '
        + 'Fahrzeugdaten.',
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
      title: 'Fahrzeugöffnung — zerstörungsfrei',
      description:
        'Zerstörungsfreie Fahrzeugöffnung als eigene Serviceleistung. Nachweis der '
        + 'Verfügungsberechtigung erforderlich.',
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
      title: 'Schlüssel nach Vorlage nachmachen lassen',
      description:
        'Schlüssel nach Vorlage: drei Fotos hochladen, Machbarkeit und Preis erhalten. '
        + 'Einsendung des Originals nur, wenn es nötig ist.',
      links: [
        ['/schluessel-nach-code', 'Code vorhanden? Direkt bestellen'],
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
        'Nachschlüssel nach Code für Möbel, Briefkasten, Spind, Technikschrank und mehr. '
        + 'Ohne Einsendung des Originalschlüssels.',
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
      title: 'Gleichschließende Zylinder konfigurieren und bestellen',
      description:
        'Gleichschließende Zylinder online zusammenstellen: Bauform, Maße, Funktion, Stückzahl '
        + 'und Anzahl gemeinsamer Schlüssel.',
      links: [
        ['/schliessanlagen', 'Größere Anlage? Zur Projektplanung'],
        ['/tuer-und-schliesstechnik', 'Tür- und Schließtechnik'],
      ],
    },
    {
      route: 'schliessanlagen',
      headline: 'Mechanische Schließanlagen',
      subline:
        'Wir planen Ihre Schließanlage mit Ihnen, von der Zentralschließung bis zur '
        + 'Generalhauptschlüsselanlage.',
      intro:
        'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Arten in '
        + 'einfacher Sprache. Ihre Anlage planen wir so, dass sie später erweitert werden kann.',
      title: 'Schließanlagen planen — Z, HS und GHS',
      description:
        'Mechanische Schließanlagen für Privat, Gewerbe und Hausverwaltungen. '
        + 'Gleichschließung, Zentralschloss, Hauptschlüssel und Generalhauptschlüssel.',
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
      title: 'Elektronische Zutrittslösungen — RFID, PIN, App',
      description:
        'Elektronische Zutrittskontrolle mit Karte, Transponder, PIN, Smartphone und digitalen '
        + 'Zylindern. Benutzerverwaltung und zeitliche Berechtigungen.',
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
      title: 'Tür- und Schließtechnik — Zylinder, Schlösser, Beschläge',
      description:
        'Profilzylinder, Einsteckschlösser, Mehrfachverriegelungen, Schutzbeschläge, '
        + 'Türzusatzschlösser und Türschließer — Beratung, Montage und Reparatur.',
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
      title: 'Sicherheitstechnik — Kamera, Alarm, Einbruchschutz',
      description:
        'Videoüberwachung, Alarmanlagen, Glasbruch- und Bewegungsmelder, Tür- und '
        + 'Fenstersicherung sowie kombinierte Einbruchschutzkonzepte.',
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
      title: 'Autoschlüssel nach Fahrzeugmarke und Modell',
      description:
        'Übersicht der Fahrzeugmarken und Modelle: mögliche Schlüsselarten, Baujahre und ob das '
        + 'Fahrzeug zum Anlernen vor Ort sein muss.',
      links: [
        ['/autoschluessel/anfrage', 'Anfrage für Ihr Fahrzeug starten'],
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
      title: 'Autoschlüssel-Anfrage mit Termin und Anzahlung',
      description:
        'Geführte Autoschlüssel-Anfrage: Fahrzeugdaten, Schlüsselfotos, Fahrzeugschein, '
        + 'Preisangabe, Anzahlung und feste Terminbuchung.',
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
        'Anfrage für einen Schlüssel nach Vorlage: drei Fotos, Nummern und Beschriftungen, '
        + 'Stückzahl und Kontaktdaten.',
      links: [
        ['/schluessel-nach-vorlage', 'So funktioniert es'],
        ['/schluessel-nach-code', 'Code vorhanden? Direkt bestellen'],
      ],
    },
    {
      route: 'gleichschliessende-zylinder/konfigurator',
      headline: 'Gleichschließende Zylinder zusammenstellen',
      subline: 'Bauform, Maße, Funktion und Anzahl gemeinsamer Schlüssel.',
      intro:
        'Legen Sie für jede Tür eine Position an. Am Ende sehen Sie die vollständige '
        + 'Preisaufstellung und legen die Zusammenstellung in den Warenkorb.',
      title: 'Gleichschließende Zylinder konfigurieren',
      description:
        'Zylinder zusammenstellen: Bauform, Maß A und Maß B, Funktion, Stückzahl, Anzahl '
        + 'gemeinsamer Schlüssel und Zusatzoptionen.',
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
      title: 'Schließanlage planen — Projektkonfigurator',
      description:
        'Projektkonfigurator für mechanische Schließanlagen: Kundentyp, Objekt, Nutzer, '
        + 'bestehende Anlage, Türen, Berechtigungen, Schlüssel, Unterlagen und Service.',
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
      title: 'Elektronische Zutrittslösung konfigurieren',
      description:
        'Bedarf für eine elektronische Zutrittslösung erfassen: Objekt, Türen, Nutzer, '
        + 'Identmedium, Verwaltung, Berechtigungen, Standorte und Service.',
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
        'Geführter Sicherheitscheck: Objektart, Zugänge, erreichbare Fenster, vorhandene Technik, '
        + 'Schwerpunkte und Vor-Ort-Termin.',
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
        'Allgemeine Anfrage stellen, Terminstatus abrufen, Kontakt aufnehmen und '
        + 'Vor-Ort-Leistungen ansehen.',
      links: [
        ['/service-und-termin/anfrage', 'Allgemeine Anfrage'],
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
        'Für Fachbetriebe für Autoschlüssel und Fahrzeugschlüssel: Werden Sie Partner von SCHLÜSSELMACHER24. '
        + 'Wir geben geprüfte Anfragen aus Ihrer Region weiter.',
      links: [
        ['/partner-werden/netzwerk-deutschland', 'Das Partnernetz für Fahrzeugschlüssel'],
        ['/autoschluessel', 'Autoschlüssel'],
        ['/service-und-termin/kontakt', 'Kontakt'],
      ],
    },
  ];

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
