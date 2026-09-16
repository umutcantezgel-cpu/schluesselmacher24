import type { ServicePage } from '@/lib/types';

/**
 * Leistungsseiten für Tür-/Schließtechnik und Sicherheitstechnik.
 * Über das Backend pflegbar und erweiterbar.
 */
export function servicePages(): ServicePage[] {
  const tuer: Array<[slug: string, title: string, summary: string, bullets: string[]]> = [
    [
      'profilzylinder-und-spezialzylinder',
      'Profilzylinder und Spezialzylinder',
      'Wir tauschen, passen an und beraten zu Zylindern für Haus-, Wohnungs- und Nebentüren — einschließlich Sonderbauformen.',
      [
        'Zylinder nach Maß für Ihre Türstärke',
        'Doppel-, Knauf- und Halbzylinder',
        'Sonderbauformen für Möbel, Technik und Außenanlagen',
        'Umstellung auf gleichschließende Lösungen möglich',
      ],
    ],
    [
      'einsteckschloesser',
      'Einsteckschlösser',
      'Austausch und Anpassung von Einsteckschlössern für Zimmer-, Wohnungs- und Haustüren.',
      [
        'Passendes Schloss nach Dorn-, Entfernungs- und Stulpmaß',
        'Buntbart, Profilzylinder und Wechselgarnitur',
        'Reparatur klemmender oder defekter Schlösser',
        'Einbau und Nacharbeit an der Tür',
      ],
    ],
    [
      'mehrfachverriegelungen',
      'Mehrfachverriegelungen',
      'Verriegelung an mehreren Punkten für Haus- und Wohnungseingangstüren.',
      [
        'Austausch defekter Mehrfachverriegelungen',
        'Nachrüstung an geeigneten Türen',
        'Einstellung von Fallen, Riegeln und Bolzen',
        'Abstimmung mit Beschlag und Zylinder',
      ],
    ],
    [
      'schutzbeschlaege',
      'Schutzbeschläge',
      'Beschläge, die Zylinder und Schloss vor mechanischen Angriffen schützen.',
      [
        'Zylinderabdeckung gegen Ziehen und Abbrechen',
        'Ausführungen mit und ohne Kernziehschutz',
        'Passend zu Türblatt und Zylinderüberstand',
        'Montage und Anpassung vor Ort',
      ],
    ],
    [
      'tuerzusatzschloesser',
      'Türzusatzschlösser',
      'Zusätzliche Verriegelung, wenn die vorhandene Tür nicht getauscht werden soll.',
      [
        'Querriegel- und Kastenzusatzschlösser',
        'Absicherung der Bandseite',
        'Sinnvoll für Wohnungs- und Nebentüren',
        'Kombinierbar mit mechanischem Grundschutz',
      ],
    ],
    [
      'tuerschliesser',
      'Türschließer',
      'Kontrolliertes Schließen von Haus-, Flur- und Objekttüren.',
      [
        'Oben liegende Schließer und Bodentürschließer',
        'Einstellung von Schließgeschwindigkeit und Endschlag',
        'Ausführungen für Flucht- und Rauchschutztüren im passenden Leistungsrahmen',
        'Wartung und Austausch',
      ],
    ],
    [
      'panik-und-fluchttuertechnik',
      'Panik- und Fluchttürtechnik',
      'Türtechnik, die im Notfall aus dem Gebäude heraus jederzeit begehbar bleibt.',
      [
        'Panikschlösser und Panikstangen im passenden Leistungsrahmen',
        'Abstimmung von Schloss, Beschlag und Zylinder',
        'Prüfung der vorhandenen Situation vor Ort',
        'Hinweis: Anforderungen ergeben sich aus dem konkreten Objekt und sind vorab zu klären',
      ],
    ],
    [
      'reparatur-und-austausch',
      'Reparatur und Austausch von Schließkomponenten',
      'Wenn ein Schlüssel klemmt, ein Riegel hakt oder ein Beschlag ausschlägt.',
      [
        'Fehlersuche an Schloss, Zylinder und Beschlag',
        'Austausch einzelner Komponenten statt der ganzen Tür',
        'Nacharbeit an Schließblech und Falz',
        'Ersatzteile passend zur vorhandenen Technik',
      ],
    ],
    [
      'technische-beratung',
      'Technische Beratung zu bestehenden Türen',
      'Wir schauen uns an, was verbaut ist, und sagen, was sinnvoll ist.',
      [
        'Bestandsaufnahme der vorhandenen Schließtechnik',
        'Einordnung von Schwachstellen',
        'Vorschlag mit mechanischen und elektronischen Möglichkeiten',
        'Grundlage für ein belastbares Angebot',
      ],
    ],
    [
      'montage-und-anpassung',
      'Montage und Anpassung',
      'Einbau, Justage und Nacharbeit — damit die Technik dauerhaft funktioniert.',
      [
        'Fachgerechte Montage der gelieferten Komponenten',
        'Justage von Tür, Band und Schließblech',
        'Funktionsprüfung nach dem Einbau',
        'Übergabe mit Einweisung',
      ],
    ],
  ];

  const sicherheit: Array<[slug: string, title: string, summary: string, bullets: string[]]> = [
    [
      'videoueberwachung',
      'Videoüberwachung',
      'Kameras für Innen- und Außenbereich mit geeigneter Aufzeichnung und App-Zugriff.',
      [
        'Kameras für Innen und Außen',
        'Aufzeichnung lokal oder im Netzwerk',
        'Zugriff über App im eigenen Netz oder per gesicherter Verbindung',
        'Planung der Blickfelder unter Beachtung der rechtlichen Vorgaben',
      ],
    ],
    [
      'alarmtechnik',
      'Alarmtechnik',
      'Alarmanlagen, Melder und Kontakte, die auffällige Ereignisse zuverlässig erkennen.',
      [
        'Alarmzentrale mit Bedienteil oder App',
        'Bewegungsmelder für Innenräume',
        'Glasbruchsensoren an gefährdeten Scheiben',
        'Tür- und Fensterkontakte an erreichbaren Öffnungen',
      ],
    ],
    [
      'aussenhautsicherung',
      'Sicherung der Außenhaut',
      'Absicherung aller Stellen, an denen ein Gebäude von außen erreichbar ist.',
      [
        'Türen, Fenster und Balkontüren',
        'Keller-, Garagen- und Nebengebäudezugänge',
        'Lichtschächte und Kellerfenster',
        'Abstimmung von Mechanik und Meldetechnik',
      ],
    ],
    [
      'mechanischer-schutz',
      'Mechanischer Schutz',
      'Mechanik hält auf, Elektronik meldet. Beides zusammen ergibt den Schutz.',
      [
        'Zusatzschlösser für Türen und Fenster',
        'Schutzbeschläge und Sicherheitszylinder',
        'Bandseitensicherung',
        'Gitter und Rollladensicherungen im passenden Rahmen',
      ],
    ],
    [
      'smarte-funktionen',
      'Smarte Funktionen',
      'Anwesenheitssimulation, Beleuchtung und Schaltmodule, sinnvoll eingesetzt.',
      [
        'Anwesenheitssimulation bei Abwesenheit',
        'Sicherheitsbeleuchtung im Außenbereich',
        'Geeignete Schaltmodule',
        'Fernsteuerung über gesicherte Zugänge',
      ],
    ],
    [
      'panik-und-alarmtaster',
      'Panik- und Alarmtaster',
      'Auslöser und Benachrichtigungswege für Situationen, in denen es schnell gehen muss.',
      [
        'Fest montierte oder mobile Auslöser',
        'Festgelegte Benachrichtigungswege',
        'Einsatz nur für zulässige Zwecke',
        'Abstimmung mit der vorhandenen Alarmtechnik',
      ],
    ],
    [
      'kombinierte-konzepte',
      'Kombinierte Sicherheitskonzepte',
      'Mechanik, Elektronik, Zutrittskontrolle, Kamera und Alarm in einem Konzept.',
      [
        'Gemeinsame Planung aller Bereiche',
        'Klare Zuständigkeiten je Gewerk',
        'Schrittweiser Ausbau möglich',
        'Dokumentierte Übergabe',
      ],
    ],
  ];

  const pages: ServicePage[] = [];

  for (const [slug, title, summary, bullets] of tuer) {
    pages.push({
      id: `tuer-${slug}`,
      slug,
      area: 'tuer-und-schliesstechnik',
      title,
      summary,
      bullets,
      image: { motif: `Werkstatt- oder Produktfoto: ${title}`, ratio: '4/3' },
      process: 'gefuehrte-anfrage',
      ctaHref: '/service-und-termin/anfrage?thema=tuer-und-schliesstechnik',
      ctaLabel: 'Anfrage starten',
      active: true,
      seo: {
        title: `${title}`,
        description: summary,
        internalLinks: [
          { href: '/tuer-und-schliesstechnik', label: 'Alle Leistungen der Tür- und Schließtechnik' },
          { href: '/gleichschliessende-zylinder', label: 'Gleichschließende Zylinder konfigurieren' },
        ],
      },
    });
  }

  for (const [slug, title, summary, bullets] of sicherheit) {
    pages.push({
      id: `sicherheit-${slug}`,
      slug,
      area: 'sicherheitstechnik',
      title,
      summary,
      bullets,
      image: { motif: `Anwendungsfoto: ${title}`, ratio: '4/3' },
      process: 'gefuehrte-anfrage',
      ctaHref: '/sicherheitstechnik/sicherheitscheck',
      ctaLabel: 'Sicherheitscheck starten',
      active: true,
      seo: {
        title: `${title}`,
        description: summary,
        internalLinks: [
          { href: '/sicherheitstechnik', label: 'Alle Bereiche der Sicherheitstechnik' },
          { href: '/elektronische-zutrittsloesungen', label: 'Elektronische Zutrittslösungen' },
        ],
      },
    });
  }

  return pages;
}
