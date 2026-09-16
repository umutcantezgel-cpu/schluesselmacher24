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
      subline: 'Zweitschlüssel und Ersatzschlüssel für Ihr Fahrzeug.',
      intro:
        'Ein zweiter Schlüssel ist dann am günstigsten, wenn noch ein funktionierender vorhanden '
        + 'ist. Ist kein Schlüssel mehr da, prüfen wir den Einzelfall gesondert — Umfang und '
        + 'Aufwand unterscheiden sich deutlich.',
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
      subline: 'Transponder, Funk und Smart Key elektronisch am Fahrzeug anlernen.',
      intro:
        'Ein neuer oder vorhandener Schlüssel muss dem Fahrzeug bekannt gemacht werden. Dafür ist '
        + 'in aller Regel Zugriff auf das Fahrzeug nötig — das lässt sich nicht per Versand lösen.',
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
      subline: 'Mechanische Kopie nach Vorlage — und was sie leistet.',
      intro:
        'Eine mechanische Kopie bildet den Bart des Originals ab. Bei vielen Fahrzeugen öffnet sie '
        + 'die Tür, startet den Motor aber nicht, weil Transponder und Wegfahrsperre fehlen. Was in '
        + 'Ihrem Fall möglich ist, klären wir vorab.',
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
      subline: 'Tasten, Funkfunktion, Gehäuse und Ersatz.',
      intro:
        'Wenn das Fahrzeug auf Knopfdruck nicht mehr reagiert, liegt das nicht immer am Schlüssel. '
        + 'Wir grenzen ein, ob Batterie, Taster, Platine oder das Anlernen die Ursache ist.',
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
      subline: 'Schlüsselloser Zugang und Start — je nach Fahrzeug.',
      intro:
        'Smart-Key-Systeme erkennen den Schlüssel in der Nähe des Fahrzeugs. Beschaffung und '
        + 'Anlernen sind aufwendiger als bei einfachen Funkschlüsseln. Planen Sie dafür mehr '
        + 'Vorlauf und mehr Zeit am Fahrzeug ein.',
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
      subline: 'Mechanische Fertigung nach Vorlage oder geeigneten Fahrzeugdaten.',
      intro:
        'Der Bart ist der mechanische Teil des Schlüssels. Wir fräsen ihn nach einem vorhandenen '
        + 'Schlüssel oder anhand geeigneter Fahrzeugdaten. Die Elektronik ist davon unabhängig.',
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
      subline: 'Wenn der Schlüssel im Fahrzeug liegt.',
      intro:
        'Wir öffnen Fahrzeuge zerstörungsfrei. Vor Ort weisen Sie bitte nach, dass Sie über das '
        + 'Fahrzeug verfügen dürfen. Die Öffnung ist eine eigene Leistung und ersetzt keinen '
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
      subline: 'Sie haben den Schlüssel — wir prüfen, ob wir ihn nachfertigen können.',
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
      subline: 'Code eingeben, bestellen, fertig. Ohne Einsendung des Originals.',
      intro:
        'Viele Schlösser tragen einen aufgedruckten oder eingeprägten Code. Mit diesem Code '
        + 'fertigen wir den passenden Schlüssel an — Sie behalten Ihren Originalschlüssel.',
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
      headline: 'Gleichschließende Zylinder',
      subline: 'Mehrere Türen, ein Schlüssel. Direkt konfigurierbar.',
      intro:
        'Sie stellen sich Ihre Zylinder mit den passenden Maßen zusammen. Alle erhalten dieselbe '
        + 'Schließung und werden mit derselben Anzahl gemeinsamer Schlüssel geliefert.',
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
      subline: 'Von der Gleichschließung bis zur Generalhauptschlüsselanlage.',
      intro:
        'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Systeme in '
        + 'einfacher Sprache und planen Ihre Anlage so, dass sie später erweitert werden kann.',
      title: 'Schließanlagen planen — Z, HS und GHS',
      description:
        'Mechanische Schließanlagen für Privat, Unternehmen und Hausverwaltungen. '
        + 'Gleichschließung, Zentralschloss, Hauptschlüssel und Generalhauptschlüssel.',
      links: [
        ['/schliessanlagen/konfigurator', 'Projekt erfassen'],
        ['/elektronische-zutrittsloesungen', 'Elektronische Zutrittslösungen'],
      ],
    },
    {
      route: 'elektronische-zutrittsloesungen',
      headline: 'Elektronische Zutrittslösungen',
      subline: 'Karte, Transponder, PIN, App und digitale Zylinder.',
      intro:
        'Elektronische Zutrittslösungen ersetzen den mechanischen Schlüssel oder ergänzen ihn. '
        + 'Verlorene Medien sperren Sie selbst — ohne die Zylinder zu tauschen.',
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
      headline: 'Autoschlüssel-Anfrage mit Termin und Anzahlung',
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
      headline: 'Anfrage: Schlüssel nach Vorlage',
      subline: 'Drei Fotos genügen für die Prüfung.',
      intro:
        'Fotografieren Sie Ihren Schlüssel aus drei Richtungen und ergänzen Sie, was Sie über ihn '
        + 'wissen. Wir melden uns mit Machbarkeit und Preis. Einsenden müssen Sie Ihren Schlüssel '
        + 'zunächst nicht.',
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
      subline: 'Anfrage stellen, Terminstatus prüfen, Kontakt aufnehmen.',
      intro:
        'Hier finden Sie alles, was nicht in einen der Fachbereiche gehört: die allgemeine '
        + 'Anfrage, den Stand Ihres Vorgangs, unsere Erreichbarkeit und unsere Vor-Ort-Leistungen.',
      title: 'Service und Termin',
      description:
        'Allgemeine Anfrage stellen, Terminstatus abrufen, Kontakt aufnehmen und '
        + 'Vor-Ort-Leistungen ansehen.',
      links: [
        ['/service-und-termin/anfrage', 'Allgemeine Anfrage'],
        ['/service-und-termin/terminstatus', 'Terminstatus prüfen'],
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
      next: ['/autoschluessel/anfrage', 'Anfrage für Ersatzschlüssel starten'],
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
 * Stadtseiten. Jede Seite braucht echten örtlichen Mehrwert —
 * keine Massenkopien. Die Startseiten sind bewusst als Gerüst mit
 * gekennzeichneten Platzhaltern angelegt.
 */
export function cities(): CityPage[] {
  const now = '2026-09-15T00:00:00.000Z';

  const raw: Array<[slug: string, city: string, state: string, radius: number]> = [
    ['berlin', 'Berlin', 'Berlin', 40],
    ['hamburg', 'Hamburg', 'Hamburg', 40],
    ['muenchen', 'München', 'Bayern', 40],
    ['koeln', 'Köln', 'Nordrhein-Westfalen', 40],
    ['frankfurt-am-main', 'Frankfurt am Main', 'Hessen', 40],
    ['stuttgart', 'Stuttgart', 'Baden-Württemberg', 40],
  ];

  return raw.map(([slug, city, state, radius]) => ({
    id: slug,
    slug,
    city,
    state,
    localIntro:
      `[Platzhalter — örtlicher Text für ${city} eintragen] Dieser Abschnitt soll beschreiben, `
      + `was den Bereich ${city} konkret ausmacht: welche Objektarten hier häufig vorkommen, `
      + 'welche Anfahrtszeiten realistisch sind und welche Leistungen wir vor Ort erbringen. '
      + 'Bitte keinen allgemeinen Text mehrfach verwenden.',
    localFacts: [
      { label: 'Bundesland', value: state },
      { label: 'Einsatzradius', value: `${radius} km` },
      { label: 'Vor-Ort-Leistungen', value: '[Platzhalter: konkrete Leistungen eintragen]' },
      { label: 'Übliche Anfahrt', value: '[Platzhalter: Anfahrtszeit eintragen]' },
    ],
    servicesOffered: [
      'autoschluessel',
      'tuer-und-schliesstechnik',
      'schliessanlagen',
      'elektronische-zutrittsloesungen',
      'sicherheitstechnik',
    ],
    onSiteRadiusKm: radius,
    seo: {
      title: `Schlüsseldienst und Autoschlüssel in ${city}`,
      description:
        `Autoschlüssel, Schließtechnik und Sicherheitstechnik für ${city} und Umgebung. `
        + 'Termine nach Vereinbarung, Versand deutschlandweit.',
      internalLinks: [
        { href: '/standorte', label: 'Alle Einsatzgebiete' },
        { href: '/autoschluessel/anfrage', label: 'Autoschlüssel-Termin' },
      ],
    },
    updatedAt: now,
  }));
}
