import type { ServicePage } from '@/lib/types';

/**
 * Leistungsseiten für Tür-/Schließtechnik und Sicherheitstechnik.
 * Über das Backend pflegbar und erweiterbar.
 * Gleichlautend mit content/service-pages.json. Die SEO-Beschreibung steht getrennt vom
 * sichtbaren Kurztext, weil sie zu einem eigenen Paket gehört (FA-INHALT-03B).
 */
export function servicePages(): ServicePage[] {
  const tuer: Array<[slug: string, title: string, summary: string, bullets: string[], seoDescription: string]> = [
    [
      'profilzylinder-und-spezialzylinder',
      'Profilzylinder und Spezialzylinder',
      'Wir tauschen Zylinder an Haus-, Wohnungs- und Nebentüren und passen sie an. Wir beraten auch zu Sonderbauformen.',
      [
        'Zylinder in der Länge, die zur Stärke Ihrer Tür passt',
        'Doppelzylinder, Knaufzylinder und Halbzylinder',
        'Sonderbauformen für Möbel, Technik und Außenanlagen',
        'Auf Wunsch schließen mehrere Türen mit demselben Schlüssel',
      ],
      'Wir tauschen, passen an und beraten zu Zylindern für Haus-, Wohnungs- und Nebentüren — einschließlich Sonderbauformen.',
    ],
    [
      'einsteckschloesser',
      'Einsteckschlösser',
      'Wir tauschen Einsteckschlösser an Zimmer-, Wohnungs- und Haustüren aus und passen sie an. Das Einsteckschloss sitzt in der Tür und bewegt den Riegel.',
      [
        'Ein Schloss, das nach Dornmaß, Entfernung und Stulpmaß in Ihre Tür passt',
        'Schlösser für Buntbartschlüssel, für Profilzylinder und mit Wechselgarnitur',
        'Reparatur, wenn das Schloss klemmt oder defekt ist',
        'Einbau und Nacharbeit an der Tür',
      ],
      'Austausch und Anpassung von Einsteckschlössern für Zimmer-, Wohnungs- und Haustüren.',
    ],
    [
      'mehrfachverriegelungen',
      'Mehrfachverriegelungen',
      'Eine Mehrfachverriegelung schließt die Tür an mehreren Punkten. Wir tauschen sie an Haus- und Wohnungseingangstüren aus, stellen sie ein und rüsten sie nach.',
      [
        'Austausch, wenn die Verriegelung defekt ist',
        'Nachrüstung, wenn Ihre Tür dafür geeignet ist',
        'Einstellen von Falle, Riegeln und Bolzen',
        'Abgestimmt auf Beschlag und Zylinder',
      ],
      'Verriegelung an mehreren Punkten für Haus- und Wohnungseingangstüren.',
    ],
    [
      'schutzbeschlaege',
      'Schutzbeschläge',
      'Ein Schutzbeschlag schützt Zylinder und Schloss vor Angriffen von außen. Wir wählen den passenden Beschlag und montieren ihn bei Ihnen.',
      [
        'Abdeckung des Zylinders gegen Ziehen und Abbrechen',
        'Mit oder ohne Kernziehschutz, der das Herausziehen des Zylinderkerns erschwert',
        'Passend zum Türblatt und dazu, wie weit der Zylinder außen vorsteht',
        'Montage und Anpassung vor Ort',
      ],
      'Beschläge, die Zylinder und Schloss vor mechanischen Angriffen schützen.',
    ],
    [
      'tuerzusatzschloesser',
      'Türzusatzschlösser',
      'Ein Zusatzschloss verriegelt Ihre Tür ein zweites Mal. Die Tür selbst muss dafür nicht getauscht werden.',
      [
        'Querriegelschlösser und Kastenzusatzschlösser',
        'Sicherung der Bandseite, also der Seite mit den Türbändern',
        'Geeignet für Wohnungstüren und Nebentüren',
        'Lässt sich mit weiterem mechanischem Schutz kombinieren',
      ],
      'Zusätzliche Verriegelung, wenn die vorhandene Tür nicht getauscht werden soll.',
    ],
    [
      'tuerschliesser',
      'Türschließer',
      'Ein Türschließer schließt die Tür kontrolliert von selbst. Wir stellen Schließer an Haus-, Flur- und Objekttüren ein, warten sie und tauschen sie aus.',
      [
        'Obenliegende Türschließer und Bodentürschließer',
        'Einstellen von Schließgeschwindigkeit und Endschlag, dem letzten Stück vor dem Schloss',
        'Schließer für Flucht- und Rauchschutztüren im Rahmen unserer Leistungen',
        'Wartung und Austausch',
      ],
      'Kontrolliertes Schließen von Haus-, Flur- und Objekttüren.',
    ],
    [
      'panik-und-fluchttuertechnik',
      'Panik- und Fluchttürtechnik',
      'Eine Fluchttür muss sich im Notfall von innen jederzeit öffnen lassen. Wir prüfen Ihre Tür vor Ort und stimmen die Technik darauf ab.',
      [
        'Panikschlösser und Panikstangen im Rahmen unserer Leistungen',
        'Schloss, Beschlag und Zylinder aufeinander abgestimmt',
        'Prüfung der Tür und ihrer Lage vor Ort',
        'Die Anforderungen hängen vom Gebäude ab und müssen vorab geklärt werden',
      ],
      'Türtechnik, die im Notfall aus dem Gebäude heraus jederzeit begehbar bleibt.',
    ],
    [
      'reparatur-und-austausch',
      'Reparatur und Austausch von Schließkomponenten',
      'Klemmt der Schlüssel, hakt der Riegel oder wackelt der Beschlag, suchen wir den Fehler. Dann tauschen wir das Teil, das nicht mehr richtig arbeitet.',
      [
        'Fehlersuche an Schloss, Zylinder und Beschlag',
        'Austausch einzelner Teile statt der ganzen Tür',
        'Nacharbeit an Schließblech und Türfalz',
        'Ersatzteile passend zur vorhandenen Technik',
      ],
      'Wenn ein Schlüssel klemmt, ein Riegel hakt oder ein Beschlag ausschlägt.',
    ],
    [
      'technische-beratung',
      'Technische Beratung zu bestehenden Türen',
      'Wir schauen uns an, was an Ihrer Tür verbaut ist, und sagen Ihnen, was sinnvoll ist.',
      [
        'Bestandsaufnahme der vorhandenen Schließtechnik',
        'Wir zeigen Ihnen, wo die Schwachstellen liegen',
        'Vorschlag mit mechanischen und elektronischen Möglichkeiten',
        'Grundlage für ein genaues Angebot',
      ],
      'Wir schauen uns an, was verbaut ist, und sagen, was sinnvoll ist.',
    ],
    [
      'montage-und-anpassung',
      'Montage und Anpassung',
      'Wir bauen die gelieferten Teile ein und stellen Tür und Schloss genau ein. Ziel ist, dass die Technik dauerhaft funktioniert.',
      [
        'Einbau der gelieferten Teile',
        'Einstellen von Tür, Türband und Schließblech',
        'Funktionsprüfung nach dem Einbau',
        'Übergabe mit Einweisung',
      ],
      'Einbau, Justage und Nacharbeit — damit die Technik dauerhaft funktioniert.',
    ],
  ];

  const sicherheit: Array<[slug: string, title: string, summary: string, bullets: string[], seoDescription: string]> = [
    [
      'videoueberwachung',
      'Videoüberwachung',
      'Wir planen Ihre Videoüberwachung und montieren die Kameras. Sie sehen die Bilder per App und können sie aufzeichnen.',
      [
        'Kameras für innen und außen',
        'Aufzeichnung vor Ort oder im Netzwerk',
        'Zugriff per App im eigenen Netz oder über eine gesicherte Verbindung',
        'Bei der Planung der Blickfelder beachten wir die rechtlichen Vorgaben',
      ],
      'Kameras für Innen- und Außenbereich mit geeigneter Aufzeichnung und App-Zugriff.',
    ],
    [
      'alarmtechnik',
      'Alarmtechnik',
      'Wir planen Alarmanlagen mit Meldern und Kontakten. Die Anlage erkennt, wenn an Tür, Fenster oder im Raum etwas geschieht.',
      [
        'Alarmzentrale mit Bedienteil oder App',
        'Bewegungsmelder für Innenräume',
        'Glasbruchsensoren an gefährdeten Scheiben',
        'Kontakte an Türen und Fenstern, die von außen erreichbar sind',
      ],
      'Alarmanlagen, Melder und Kontakte, die auffällige Ereignisse zuverlässig erkennen.',
    ],
    [
      'aussenhautsicherung',
      'Sicherung der Außenhaut',
      'Zur Außenhaut gehören alle Stellen, an denen man von außen ins Gebäude kommt. Wir sichern sie ab, von der Haustür bis zum Kellerfenster.',
      [
        'Türen, Fenster und Balkontüren',
        'Zugänge zu Keller, Garage und Nebengebäuden',
        'Lichtschächte und Kellerfenster',
        'Mechanik und Meldetechnik aufeinander abgestimmt',
      ],
      'Absicherung aller Stellen, an denen ein Gebäude von außen erreichbar ist.',
    ],
    [
      'mechanischer-schutz',
      'Mechanischer Schutz',
      'Wir sichern Türen und Fenster mechanisch ab. Mechanik hält auf, Elektronik meldet, und erst beides zusammen ergibt den Schutz.',
      [
        'Zusatzschlösser für Türen und Fenster',
        'Schutzbeschläge und Sicherheitszylinder',
        'Sicherung der Bandseite, also der Seite mit den Türbändern',
        'Gitter und Rollladensicherungen im Rahmen unserer Leistungen',
      ],
      'Mechanik hält auf, Elektronik meldet. Beides zusammen ergibt den Schutz.',
    ],
    [
      'smarte-funktionen',
      'Smart-Home-Sicherheitsfunktionen',
      'Wir richten Smart-Home-Funktionen ein, die beim Schutz helfen. Licht und Schaltmodule lassen das Gebäude bewohnt wirken, auch wenn niemand da ist.',
      [
        'Anwesenheitssimulation, wenn Sie nicht zu Hause sind',
        'Sicherheitsbeleuchtung im Außenbereich',
        'Passende Schaltmodule',
        'Fernsteuerung über gesicherte Zugänge',
      ],
      'Anwesenheitssimulation, Beleuchtung und Schaltmodule, sinnvoll eingesetzt.',
    ],
    [
      'panik-und-alarmtaster',
      'Panik- und Alarmtaster',
      'Mit einem Panik- oder Alarmtaster lösen Sie im Notfall eine Benachrichtigung aus. Wir richten die Taster ein und legen vorab fest, wer sie erhält.',
      [
        'Fest montierte oder mobile Taster',
        'Feste Wege für die Benachrichtigung',
        'Einsatz nur für zulässige Zwecke',
        'Abgestimmt auf Ihre vorhandene Alarmtechnik',
      ],
      'Auslöser und Benachrichtigungswege für Situationen, in denen es schnell gehen muss.',
    ],
    [
      'kombinierte-konzepte',
      'Kombinierte Sicherheitskonzepte',
      'Wir planen Mechanik, Elektronik, Zutrittskontrolle, Kamera und Alarm gemeinsam in einem Konzept.',
      [
        'Gemeinsame Planung aller Bereiche',
        'Für jedes beteiligte Handwerk ist klar, wer zuständig ist',
        'Ausbau in Schritten möglich',
        'Übergabe mit Dokumentation',
      ],
      'Mechanik, Elektronik, Zutrittskontrolle, Kamera und Alarm in einem Konzept.',
    ],
  ];

  const pages: ServicePage[] = [];

  for (const [slug, title, summary, bullets, seoDescription] of tuer) {
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
        description: seoDescription,
        internalLinks: [
          { href: '/tuer-und-schliesstechnik', label: 'Alle Leistungen der Tür- und Schließtechnik' },
          { href: '/gleichschliessende-zylinder', label: 'Gleichschließende Zylinder konfigurieren' },
        ],
      },
    });
  }

  for (const [slug, title, summary, bullets, seoDescription] of sicherheit) {
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
        description: seoDescription,
        internalLinks: [
          { href: '/sicherheitstechnik', label: 'Alle Bereiche der Sicherheitstechnik' },
          { href: '/elektronische-zutrittsloesungen', label: 'Elektronische Zutrittslösungen' },
        ],
      },
    });
  }

  return pages;
}
