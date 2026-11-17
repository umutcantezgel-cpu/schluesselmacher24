import type { Tutorial } from '@/lib/types';

/*
 * Startbestand der Tutorials (FA-INHALT-01, Abschnitt 21 der Arbeitsanweisung): die zehn Themen des
 * Inhabers. Jeder Satz stammt aus dem Bestand der Seite (Fotoanleitung der Vorlage-Seite und der
 * Autoschlüssel-Anfrage, Messhilfe des Zylinder-Konfigurators, Zylinderkatalog, Ratgeber, Ablauf der
 * Rubriken, Einsendung); nichts ist hinzuerfunden (R4). Kein Video ist hinterlegt.
 *
 * Unveröffentlicht bleiben „Fahrzeugschein“ und „Gehäuseumbau“: Dort trägt der Bestand das Thema nicht
 * vollständig (weitere Felder des Fahrzeugscheins, Ablauf des Umbaus im Einzelnen).
 *
 * Wortgleich mit content/tutorials.json (Test in src/lib/tutorials/tutorials.test.ts).
 */
const STAND = '2026-11-16T00:00:00.000Z';

export function tutorials(): Tutorial[] {
  return [
    {
      id: 'schluessel-richtig-fotografieren',
      slug: 'schluessel-richtig-fotografieren',
      title: 'Wie fotografiere ich einen Schlüssel richtig?',
      answer:
        'Wir brauchen drei Aufnahmen: Vorderseite, Rückseite und die Spitze von vorne. Legen Sie den Schlüssel auf einen hellen, einfarbigen Untergrund und fotografieren Sie ohne Blitz. Beschriftungen und Prägungen müssen lesbar sein.',
      topic: 'schluessel-nach-vorlage',
      steps: [
        {
          heading: 'Untergrund und Licht',
          text: 'Legen Sie den Schlüssel flach auf einen hellen, einfarbigen Untergrund. Fotografieren Sie ohne Blitz und ohne Schatten. Die Fotos sollen scharf und hell sein.',
        },
        {
          heading: 'Vorderseite',
          text: 'Fotografieren Sie den Schlüssel von oben, vollständig im Bild. Kopf und Bart müssen zusammen zu sehen sein. Der Schlüssel soll das Bild fast ganz ausfüllen.',
          image: { motif: 'Beispielfoto: Schlüssel flach von oben, Kopf und Bart vollständig im Bild', ratio: '4/3' },
        },
        {
          heading: 'Rückseite',
          text: 'Wenden Sie den Schlüssel und fotografieren Sie ihn erneut von oben, mit gleichem Abstand und gleichem Untergrund. Viele Schlüssel tragen nur auf einer Seite eine Beschriftung.',
          image: { motif: 'Beispielfoto: Schlüssel gewendet, Prägung auf der Rückseite lesbar', ratio: '4/3' },
        },
        {
          heading: 'Spitze und Profil',
          text: 'Stellen Sie den Schlüssel auf oder lehnen Sie ihn an, damit die Spitze zur Kamera zeigt. Aus dieser Ansicht erkennen wir den Profilquerschnitt und damit den passenden Rohling.',
          image: { motif: 'Beispielfoto: Blick von vorne auf die Schlüsselspitze, Profilquerschnitt erkennbar', ratio: '1/1' },
        },
        {
          heading: 'Beschriftungen mitfotografieren',
          text: 'Zahlen und Buchstaben auf Kopf, Bart oder Schaft helfen uns sehr bei der Bestimmung. Fotografieren Sie kleine Prägungen zusätzlich aus der Nähe und tragen Sie sie im Formular als Text ein.',
        },
        {
          heading: 'Sicherungskarte',
          text: 'Gibt es zu Ihrem Schlüssel eine Sicherungskarte, fotografieren Sie auch die Karte. Sie zeigt, dass Sie den Schlüssel nachmachen lassen dürfen.',
        },
        {
          heading: 'Wenn die Fotos nicht reichen',
          text: 'Ihre Fotos dienen nur der Identifikation und Prüfung. Schließwerte lesen wir nicht aus Fotos ab. Reichen die Bilder für eine sichere Bestimmung nicht, bitten wir Sie, den Schlüssel einzuschicken.',
        },
      ],
      places: ['schluessel-nach-vorlage', 'schluessel-nach-vorlage-fotos'],
      order: 10,
      published: true,
      seo: {
        title: 'Schlüssel richtig fotografieren',
        description:
          'Drei Aufnahmen brauchen wir: Vorderseite, Rückseite und Spitze. So fotografieren Sie Ihren Schlüssel auf hellem Untergrund, ohne Blitz und gut lesbar.',
        internalLinks: [
          { href: '/schluessel-nach-vorlage/anfrage', label: 'Schlüssel prüfen lassen' },
          { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' },
        ],
      },
      updatedAt: STAND,
    },
    {
      id: 'autoschluessel-richtig-fotografieren',
      slug: 'autoschluessel-richtig-fotografieren',
      title: 'Wie fotografiere ich einen Autoschlüssel richtig?',
      answer:
        'Wir brauchen drei Aufnahmen: Vorderseite, Rückseite und die Spitze beziehungsweise das Profil von vorne. Anhand der Fotos erkennen wir Bauform, Profil und Elektronik. Einen Klappschlüssel fotografieren Sie ausgeklappt.',
      topic: 'autoschluessel',
      steps: [
        {
          heading: 'Untergrund und Licht',
          text: 'Legen Sie den Schlüssel auf einen einfarbigen, hellen Untergrund. Fotografieren Sie senkrecht von oben, ohne Blitz und ohne Schatten. Der Schlüssel sollte das Bild möglichst ausfüllen und scharf sein.',
        },
        {
          heading: 'Vorderseite',
          text: 'Die Tastenseite vollständig im Bild, von oben aufgenommen.',
          image: { motif: 'Beispielfoto: Autoschlüssel von vorn, Tastenseite vollständig und scharf', ratio: '16/9' },
        },
        {
          heading: 'Rückseite',
          text: 'Die Rückseite mit allen Aufdrucken. Häufig stehen dort Hersteller- und Teilenummern, die wir für die Zuordnung brauchen.',
          image: { motif: 'Beispielfoto: Autoschlüssel von hinten mit lesbarer Kennzeichnung', ratio: '16/9' },
        },
        {
          heading: 'Spitze beziehungsweise Profil von vorne',
          text: 'Halten Sie den Schlüssel so, dass die Spitze zur Kamera zeigt. Profil und Fräsungen müssen erkennbar sein. Einen Klappschlüssel fotografieren Sie ausgeklappt.',
          image: { motif: 'Beispielfoto: Blick von vorne auf die Spitze, Profil deutlich erkennbar', ratio: '4/3' },
        },
        {
          heading: 'Nummern und Logos aus der Nähe',
          text: 'Stehen auf dem Schlüssel Nummern, Buchstabenfolgen oder ein Logo, hilft uns eine Nahaufnahme davon bei der Zuordnung. Diese Aufnahme ist freiwillig.',
        },
        {
          heading: 'Fahrzeugschein dazu',
          text: 'Wir fertigen Fahrzeugschlüssel nur für Berechtigte. Dafür laden Sie zusätzlich die Zulassungsbescheinigung Teil I hoch. Haben Sie keinen Schlüssel mehr, auch keinen defekten, entfallen die Schlüsselfotos. Der Fahrzeugschein bleibt Pflicht.',
        },
      ],
      places: ['autoschluessel-fotos'],
      order: 20,
      published: true,
      seo: {
        title: 'Autoschlüssel richtig fotografieren',
        description:
          'Vorderseite, Rückseite und Spitze von vorne: So fotografieren Sie Ihren Autoschlüssel für die Anfrage, damit wir Bauform, Profil und Elektronik erkennen.',
        internalLinks: [{ href: '/autoschluessel/anfrage', label: 'Termin anfragen' }],
      },
      updatedAt: STAND,
    },
    {
      id: 'angaben-im-fahrzeugschein',
      slug: 'angaben-im-fahrzeugschein',
      title: 'Wo finde ich die benötigten Angaben im Fahrzeugschein?',
      answer:
        'Die 17-stellige Fahrgestellnummer steht in der Zulassungsbescheinigung Teil I unter Feld E. Sie steht oft auch sichtbar an der Windschutzscheibe. Für die Anfrage laden Sie den Fahrzeugschein vollständig und lesbar hoch.',
      topic: 'autoschluessel',
      steps: [
        {
          heading: 'Fahrgestellnummer in Feld E',
          text: 'Die 17-stellige Fahrgestellnummer steht in der Zulassungsbescheinigung unter Feld E und oft sichtbar an der Windschutzscheibe. Sie hilft uns, den passenden Schlüssel eindeutig zuzuordnen.',
        },
        {
          heading: 'Fahrzeugschein hochladen',
          text: 'Als Foto oder als PDF. Bitte vollständig und lesbar, alle vier Ecken im Bild.',
        },
        {
          heading: 'Was Sie unkenntlich machen dürfen',
          text: 'Angaben, die für den Nachweis und die Zuordnung Ihres Fahrzeugs nicht nötig sind, dürfen Sie vor dem Hochladen unkenntlich machen.',
        },
      ],
      places: ['autoschluessel-fahrzeugschein'],
      order: 30,
      published: false,
      seo: {
        title: 'Angaben im Fahrzeugschein finden',
        description:
          'Wo im Fahrzeugschein die Fahrgestellnummer steht und wie Sie die Zulassungsbescheinigung Teil I für die Anfrage vollständig und lesbar hochladen.',
        internalLinks: [{ href: '/autoschluessel/anfrage', label: 'Termin anfragen' }],
      },
      updatedAt: STAND,
    },
    {
      id: 'so-funktioniert-schluessel-nach-code',
      slug: 'so-funktioniert-schluessel-nach-code',
      title: 'Wie funktioniert Schlüssel nach Code?',
      answer:
        'Sie bestellen den Schlüssel über die Nummer, die auf Ihrem Schlüssel oder am Schloss steht. Ihren Schlüssel müssen Sie dafür nicht fotografieren. Bei einem geschützten Profil brauchen wir als Nachweis ein Foto Ihrer Sicherungskarte.',
      topic: 'schluessel-nach-code',
      steps: [
        {
          heading: 'Code finden',
          text: 'Die Nummer steht auf dem Schlüssel oder am Schloss. Bei Schließanlagen und geschützten Systemen steht sie auf der Sicherungskarte oder im Schließplan.',
        },
        {
          heading: 'Bestellen',
          text: 'Code eingeben, Stückzahl wählen, bezahlen. Bei geschütztem Profil laden Sie ein Foto der Sicherungskarte hoch. Sie ist Ihr Nachweis, dass Sie Nachschlüssel bestellen dürfen.',
        },
        {
          heading: 'Fertigung',
          text: 'Wir fertigen den Schlüssel in unserer Werkstatt.',
        },
        {
          heading: 'Versand',
          text: 'Der Schlüssel kommt per Post zu Ihnen.',
        },
        {
          heading: 'Wenn Sie keinen Code finden',
          text: 'Dann nutzen Sie Schlüssel nach Vorlage. Sie schicken uns drei Fotos, und wir prüfen, ob eine Anfertigung möglich ist.',
        },
      ],
      places: ['schluessel-nach-code'],
      order: 40,
      published: true,
      seo: {
        title: 'So funktioniert Schlüssel nach Code',
        description:
          'Code finden, bestellen, Nachweis hochladen: So läuft Schlüssel nach Code ab, von der Nummer auf Schlüssel oder Schloss bis zum Versand per Post.',
        internalLinks: [
          { href: '/ratgeber/schluesselcode-finden', label: 'Wo finde ich den Schlüsselcode?' },
          { href: '/schluessel-nach-code', label: 'Schlüssel nach Code' },
        ],
      },
      updatedAt: STAND,
    },
    {
      id: 'schluessel-richtig-einschicken',
      slug: 'schluessel-richtig-einschicken',
      title: 'Wie sende ich meinen Schlüssel ein?',
      answer:
        'Sie melden die Einsendung an und erhalten einen Begleitschein. Den legen Sie dem gut verpackten Schlüssel bei und schicken ihn mit Sendungsverfolgung an unsere Werkstatt. Original und Kopien kommen zu Ihnen zurück.',
      topic: 'schluessel-nach-vorlage',
      steps: [
        {
          heading: 'Einsendung anmelden',
          text: 'Name und Anschrift eingeben, Begleitschein ausdrucken. Ohne Begleitschein oder Vorgangsnummer können wir eine Sendung keinem Auftrag zuordnen.',
        },
        {
          heading: 'Was in die Sendung gehört',
          text: 'Der Begleitschein mit Ihrer Vorgangsnummer und Ihrer Rücksendeanschrift. Nur die betreffenden Schlüssel, ohne Schlüsselring und Anhänger. Bei Schlüsseln mit Sicherungskarte eine Kopie der Karte, falls Sie bei der Anmeldung kein Foto hochgeladen haben. Die Karte selbst behalten Sie.',
        },
        {
          heading: 'Verpacken',
          text: 'Schlüssel nicht lose in einen einfachen Papierumschlag legen, sondern gepolstert beziehungsweise stabil verpacken.',
        },
        {
          heading: 'Abschicken',
          text: 'Wählen Sie einen Versand mit Sendungsverfolgung und einer Haftung, die zum Wert Ihres Schlüssels passt. Ein Schlüssel im unverfolgten Brief ist bei Verlust nicht auffindbar. Die Anschrift steht auf Ihrem Begleitschein.',
        },
        {
          heading: 'Prüfung und Rücksendung',
          text: 'Wir prüfen den Schlüssel und nennen Ihnen den Preis. Nach Ihrer Zahlung fertigen wir die Kopie. Ihr Original kommt zusammen mit den Kopien zurück, auf Wunsch getrennt voneinander.',
        },
      ],
      places: ['schluessel-einschicken'],
      order: 50,
      published: true,
      seo: {
        title: 'Schlüssel richtig einschicken',
        description:
          'Einsendung anmelden, Begleitschein beilegen, gepolstert verpacken und mit Sendungsverfolgung verschicken: So kommt Ihr Schlüssel sicher zu uns und zurück.',
        internalLinks: [
          { href: '/schluessel-einschicken/anmelden', label: 'Einsendung anmelden' },
          { href: '/schluessel-einschicken', label: 'Schlüssel einschicken' },
        ],
      },
      updatedAt: STAND,
    },
    {
      id: 'profilzylinder-messen',
      slug: 'profilzylinder-messen',
      title: 'Wie messe ich einen Profilzylinder?',
      answer:
        'Sie messen zwei Längen ab der Mitte der Stulpschraube: Maß A nach außen und Maß B nach innen. Runden Sie auf die nächsten vollen 5 Millimeter auf. Messen Sie jede Tür einzeln.',
      topic: 'gleichschliessende-zylinder',
      steps: [
        {
          heading: 'Stulpschraube suchen',
          text: 'Das ist die Schraube in der Türkante, die den Zylinder hält. Von ihrer Mitte aus messen Sie beide Maße.',
        },
        {
          heading: 'Maß A nach außen messen',
          text: 'Maß A ist die Länge nach außen. Messen Sie von der Mitte der Stulpschraube bis zum Ende des Zylinders auf der Außenseite der Tür.',
          image: { motif: 'Messzeichnung Profilzylinder mit Maß A und Maß B', ratio: '16/9' },
        },
        {
          heading: 'Maß B nach innen messen',
          text: 'Maß B ist die Länge nach innen. Messen Sie von der Mitte der Stulpschraube bis zum Ende auf der Innenseite. Ein Halbzylinder hat dieses Maß nicht.',
        },
        {
          heading: 'Jede Tür einzeln notieren',
          text: 'Türen desselben Gebäudes haben oft verschiedene Maße. Notieren Sie sie getrennt, bevor Sie den Konfigurator öffnen.',
        },
      ],
      places: ['gleichschliessende-zylinder-messen', 'gleichschliessende-zylinder'],
      guideSlug: 'zylinder-richtig-ausmessen',
      order: 60,
      published: true,
      seo: {
        title: 'Profilzylinder messen',
        description:
          'Maß A nach außen, Maß B nach innen, beide ab der Mitte der Stulpschraube: So messen Sie Ihren Profilzylinder Schritt für Schritt für die Bestellung.',
        internalLinks: [{ href: '/gleichschliessende-zylinder/konfigurator', label: 'Zylinder zusammenstellen' }],
      },
      updatedAt: STAND,
    },
    {
      id: 'not-und-gefahrenfunktion',
      slug: 'not-und-gefahrenfunktion',
      title: 'Was ist die Not- und Gefahrenfunktion?',
      answer:
        'Mit der Not- und Gefahrenfunktion können Sie von außen aufschließen, selbst wenn innen ein Schlüssel steckt. Sinnvoll ist das für Wohnungstüren, Pflegesituationen oder überall dort, wo im Notfall von außen geöffnet werden muss.',
      topic: 'gleichschliessende-zylinder',
      steps: [
        {
          heading: 'Ohne die Funktion',
          text: 'Bei der üblichen Ausführung lässt sich von außen nicht aufschließen, solange innen ein Schlüssel steckt. Für die meisten Innen- und Nebentüren reicht das aus.',
        },
        {
          heading: 'Mit der Funktion',
          text: 'Die Tür lässt sich von außen auch dann öffnen, wenn innen ein Schlüssel steckt.',
        },
        {
          heading: 'Wo sie hilft',
          text: 'An Wohnungstüren, in Pflegesituationen und überall dort, wo im Notfall jemand von außen öffnen muss. Auch ein Antrieb, der auf den vorhandenen Zylinder gesetzt wird, braucht einen Zylinder mit Not- und Gefahrenfunktion.',
        },
        {
          heading: 'Für jede Tür wählen',
          text: 'Die Funktion legen Sie im Konfigurator für jede Tür fest. Nicht jede Funktion gibt es für jede Bauform. Der Konfigurator zeigt Ihnen, wo sie wählbar ist.',
        },
      ],
      places: ['gleichschliessende-zylinder-funktion', 'gleichschliessende-zylinder'],
      order: 70,
      published: true,
      seo: {
        title: 'Not- und Gefahrenfunktion erklärt',
        description:
          'Mit der Not- und Gefahrenfunktion öffnen Sie die Tür von außen, auch wenn innen ein Schlüssel steckt. Wo sie sinnvoll ist und wie Sie sie auswählen.',
        internalLinks: [
          { href: '/gleichschliessende-zylinder/konfigurator', label: 'Zylinder zusammenstellen' },
          { href: '/gleichschliessende-zylinder', label: 'Gleichschließende Zylinder' },
        ],
      },
      updatedAt: STAND,
    },
    {
      id: 'was-bedeutet-gleichschliessend',
      slug: 'was-bedeutet-gleichschliessend',
      title: 'Was bedeutet gleichschließend?',
      answer:
        'Alle Zylinder einer Bestellung bekommen dieselbe Schließung. Ein Schlüssel sperrt dann jede dieser Türen. Bauform und Maße dürfen sich von Tür zu Tür unterscheiden.',
      topic: 'gleichschliessende-zylinder',
      steps: [
        {
          heading: 'Ein Schlüssel für mehrere Türen',
          text: 'Jeder mitgelieferte Schlüssel sperrt jede Tür der Bestellung. Sie brauchen also nur noch einen Schlüssel statt eines ganzen Bundes.',
          image: { motif: 'Schließplan einer Gleichschließung: mehrere Türen, ein gemeinsamer Schlüssel', ratio: '3/2' },
        },
        {
          heading: 'Verschiedene Zylinder sind möglich',
          text: 'Eine Haustür braucht andere Maße als eine Kellertür. Die Bauform wählen Sie für jede Tür getrennt. Wichtig ist nur, dass alle Zylinder zusammen gefertigt werden.',
        },
        {
          heading: 'Später nachbestellen',
          text: 'Weitere Zylinder mit derselben Schließung gibt es später, wenn wir Ihre Schließung hinterlegen. Das wählen Sie im Konfigurator als Option aus.',
        },
        {
          heading: 'Wann eine Schließanlage passt',
          text: 'Eine Gleichschließung unterscheidet nicht zwischen Personen. Jeder Schlüssel öffnet jede Tür. Sollen einzelne Personen nur bestimmte Türen öffnen, brauchen Sie eine Schließanlage.',
        },
      ],
      places: ['gleichschliessende-zylinder'],
      order: 80,
      published: true,
      seo: {
        title: 'Gleichschließend einfach erklärt',
        description:
          'Gleichschließend heißt: Alle Zylinder einer Bestellung haben dieselbe Schließung, ein Schlüssel sperrt jede Tür. Was das bedeutet und wo die Grenze liegt.',
        internalLinks: [
          { href: '/gleichschliessende-zylinder', label: 'Gleichschließende Zylinder' },
          { href: '/ratgeber/welche-schliessanlage-passt', label: 'Welche Schließanlage passt zu meinem Objekt?' },
        ],
      },
      updatedAt: STAND,
    },
    {
      id: 'hs-und-ghs',
      slug: 'hs-und-ghs',
      title: 'Was ist HS und GHS?',
      answer:
        'HS steht für Hauptschlüsselanlage, GHS für Generalhauptschlüsselanlage. In beiden öffnet jeder Einzelschlüssel nur die Türen, die ihm zugeordnet sind. Übergeordnete Schlüssel öffnen mehrere Türen, bei der GHS in mehreren Ebenen.',
      topic: 'schliessanlagen',
      steps: [
        {
          heading: 'Hauptschlüsselanlage (HS)',
          text: 'Jeder Einzelschlüssel öffnet nur die Türen, die ihm zugeordnet sind. Ein Hauptschlüssel öffnet alle ihm zugeordneten Türen, meist alle Türen der Anlage. Das ist typisch für Betriebe und Verwaltungen.',
          image: { motif: 'Schemazeichnung Hauptschlüsselanlage', ratio: '4/3' },
        },
        {
          heading: 'Generalhauptschlüsselanlage (GHS)',
          text: 'Diese Anlage hat mehrere Ebenen. Unten stehen Schlüssel für einzelne Abteilungen oder Bereiche, darüber Hauptschlüssel. Ganz oben steht ein Generalhauptschlüssel. Das passt für größere Grundstücke mit mehreren Gebäuden.',
          image: { motif: 'Schemazeichnung Generalhauptschlüsselanlage', ratio: '4/3' },
        },
        {
          heading: 'Abgrenzung zur Zentralschlossanlage (Z)',
          text: 'Bei einer Zentralschlossanlage hat jeder einen eigenen Schlüssel für die eigene Tür. Zusätzlich öffnet jeder dieser Schlüssel die gemeinsamen Türen, meist den Hauseingang. Das ist typisch für Mehrfamilienhäuser.',
        },
        {
          heading: 'An später denken',
          text: 'Planen Sie früh, ob später Türen, Nutzer oder Gebäude dazukommen. Hat die Anlage von Anfang an Reserve, lässt sie sich später ergänzen.',
        },
      ],
      places: ['schliessanlagen'],
      guideSlug: 'welche-schliessanlage-passt',
      order: 90,
      published: true,
      seo: {
        title: 'HS und GHS erklärt',
        description:
          'HS ist die Hauptschlüsselanlage, GHS die Generalhauptschlüsselanlage. Wer welche Tür öffnet und für welche Objekte welche Anlage passt, kurz erklärt.',
        internalLinks: [
          { href: '/schliessanlagen/konfigurator', label: 'Projekt erfassen' },
          { href: '/schliessanlagen', label: 'Schließanlagen' },
        ],
      },
      updatedAt: STAND,
    },
    {
      id: 'gehaeuseumbau',
      slug: 'gehaeuseumbau',
      title: 'Wie funktioniert ein Gehäuseumbau?',
      answer:
        'Sie senden uns Fahrzeugangaben und Fotos. Wir prüfen und melden uns mit Preis und Ablauf. Nach Ihrer Zusage schicken Sie den Schlüssel ein, und passt alles, kommt er im neuen Gehäuse zurück.',
      topic: 'autoschluessel',
      steps: [
        {
          heading: 'Fahrzeug und Fotos senden',
          text: 'Fahrzeug angeben, Schlüssel und Fahrzeugschein fotografieren.',
        },
        {
          heading: 'Preis erhalten',
          text: 'Wir prüfen Ihre Angaben und melden uns mit Preis und Ablauf. Geht es bei Ihrem Schlüssel nicht, sagen wir Ihnen das.',
        },
        {
          heading: 'Schlüssel einschicken',
          text: 'Nach Ihrer Zusage schicken Sie den Schlüssel an unsere Werkstatt.',
        },
        {
          heading: 'Rückversand',
          text: 'Passt alles, kommt Ihr Schlüssel im neuen Gehäuse zurück.',
        },
      ],
      places: ['autoschluessel-gehaeuse'],
      order: 100,
      published: false,
      seo: {
        title: 'Gehäuseumbau beim Autoschlüssel',
        description:
          'Wie ein Gehäuseumbau beim Autoschlüssel abläuft: Fahrzeug und Fotos senden, Preis erhalten, Schlüssel einschicken und im neuen Gehäuse zurückbekommen.',
        internalLinks: [{ href: '/autoschluessel/gehaeuse', label: 'Autoschlüssel-Gehäuse' }],
      },
      updatedAt: STAND,
    },
  ];
}
