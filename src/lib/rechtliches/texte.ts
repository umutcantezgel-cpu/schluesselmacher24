import { formatCents } from '@/lib/format';
import { getSiteUrl } from '@/lib/site-url';
import type { CompanyProfile, Settings } from '@/lib/types';

import { anbieterEinzeilig, angabe, firmenname, kontakt, standort } from './firma';

/* ==========================================================================
   Rechtstexte als Daten
   AGB, Widerrufsbelehrungen und Muster-Widerrufsformular liegen hier als
   Abschnitte (Überschrift + Absätze). Die Rechtsseiten rendern sie, die
   Vertragsbestätigung per E-Mail nutzt dieselben Texte über
   `abschnitteAlsText()`. Firmendaten kommen immer als Parameter — es steht
   kein Name und keine Anschrift fest im Text.

   Entwurf: Die juristische Freigabe liegt beim Inhaber. Ein im Backend
   hinterlegter Eigentext ersetzt die jeweilige Seite.
   ========================================================================== */

/** Fassung der eingebauten Texte, z. B. für den Nachweis erteilter Zustimmungen. */
export const RECHTSTEXTE_FASSUNG = '2026-10-24';

/** Ein Absatz: Fließtext oder eine Aufzählung. */
export type Absatz = string | { liste: string[] };

export interface RechtsAbschnitt {
  /** Anker auf der Seite, z. B. `widerrufsrecht-waren`. */
  id: string;
  ueberschrift: string;
  /** 2 = Hauptabschnitt, 3 = Unterabschnitt. */
  ebene: 2 | 3;
  absaetze: Absatz[];
}

/* ---------- Hilfen ------------------------------------------------------- */

function ohneSchraegstrich(url: string): string {
  return url.replace(/\/+$/, '');
}

/** Widerrufsadressat: Name, Anschrift, Telefon und E-Mail, soweit gepflegt. */
export function widerrufsadressat(company: CompanyProfile): string {
  const { telefon, email } = kontakt(company);
  return [
    anbieterEinzeilig(company),
    ...(telefon ? [`Telefon ${telefon}`] : []),
    ...(email ? [`E-Mail ${email}`] : []),
  ].join(', ');
}

/** Adresse des Online-Widerrufs (Widerrufsbutton). */
export function widerrufErklaerenUrl(siteUrl = getSiteUrl()): string {
  return `${ohneSchraegstrich(siteUrl)}/rechtliches/widerruf/erklaeren`;
}

/* ---------- Widerrufsbelehrung ------------------------------------------- */

export type Vertragsart = 'waren' | 'dienstleistung';

/**
 * Muster-Widerrufsbelehrung nach Anlage 1 zu Art. 246a § 1 Abs. 2 Satz 2
 * EGBGB. `waren`: Frist ab Erhalt der Ware (Shop). `dienstleistung`: Frist ab
 * Vertragsschluss, mit Wertersatz bei verlangtem vorzeitigem Beginn
 * (Autoschlüssel-Termine). Der Wortlaut folgt dem gesetzlichen Muster.
 */
export function widerrufsbelehrung(
  art: Vertragsart,
  company: CompanyProfile,
  siteUrl = getSiteUrl(),
): RechtsAbschnitt[] {
  const fristbeginn =
    art === 'waren'
      ? ', an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren '
        + 'in Besitz genommen haben bzw. hat'
      : ' des Vertragsabschlusses';

  const rueckzahlung =
    'Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten '
    + 'haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus '
    + 'ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste '
    + 'Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag '
    + 'zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen '
    + 'ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der '
    + 'ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas '
    + 'anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.';

  const folgen: string[] =
    art === 'waren'
      ? [
          rueckzahlung,
          'Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder '
            + 'bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, '
            + 'welches der frühere Zeitpunkt ist.',
          'Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem '
            + 'Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden '
            + 'oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von '
            + 'vierzehn Tagen absenden.',
          'Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.',
          'Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust '
            + 'auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren '
            + 'nicht notwendigen Umgang mit ihnen zurückzuführen ist.',
        ]
      : [
          rueckzahlung,
          'Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen soll, so '
            + 'haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem '
            + 'Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses '
            + 'Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum '
            + 'Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.',
        ];

  const praefix = art === 'waren' ? 'waren' : 'dienstleistung';
  return [
    {
      id: `widerrufsrecht-${praefix}`,
      ueberschrift: 'Widerrufsrecht',
      ebene: 3,
      absaetze: [
        'Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.',
        `Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag${fristbeginn}.`,
        `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${widerrufsadressat(company)}) mittels einer `
          + 'eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren '
          + 'Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte '
          + 'Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.',
        'Sie können das Muster-Widerrufsformular oder eine andere eindeutige Erklärung auch auf unserer '
          + `Webseite (${widerrufErklaerenUrl(siteUrl)}) elektronisch ausfüllen und übermitteln. Machen `
          + 'Sie von dieser Möglichkeit Gebrauch, so werden wir Ihnen unverzüglich (z. B. per E-Mail) '
          + 'eine Bestätigung über den Eingang eines solchen Widerrufs übermitteln.',
        'Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des '
          + 'Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.',
      ],
    },
    {
      id: `folgen-${praefix}`,
      ueberschrift: 'Folgen des Widerrufs',
      ebene: 3,
      absaetze: folgen,
    },
  ];
}

/** Ausschluss nach § 312g Abs. 2 Nr. 1 BGB für Anfertigungen nach Kundenangabe. */
export function ausschlussSonderanfertigung(): RechtsAbschnitt {
  return {
    id: 'ausschluss',
    ueberschrift: 'Ausschluss des Widerrufsrechts bei Anfertigungen nach Ihren Angaben',
    ebene: 2,
    absaetze: [
      'Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt '
        + 'sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den '
        + 'Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des '
        + 'Verbrauchers zugeschnitten sind (§ 312g Abs. 2 Nr. 1 BGB).',
      'Das betrifft bei uns insbesondere:',
      {
        liste: [
          'Schlüssel, die wir nach dem von Ihnen angegebenen Code fertigen',
          'Schlüssel, die wir nach Ihrer Vorlage (Fotos oder Originalschlüssel) anfertigen',
          'gleichschließende Zylinder mit einer eigens für Sie erzeugten Schließung samt den zugehörigen Schlüsseln',
        ],
      },
      'Bei diesen Waren weisen wir Sie vor der Bestellung gesondert darauf hin.',
    ],
  };
}

/** Vorzeitiges Erlöschen bei Dienstleistungen (§ 356 Abs. 4 BGB). */
export function erloeschenDienstleistung(): RechtsAbschnitt {
  return {
    id: 'erloeschen',
    ueberschrift: 'Vorzeitiges Erlöschen bei Dienstleistungen',
    ebene: 2,
    absaetze: [
      'Bei einem Vertrag über die Erbringung von Dienstleistungen erlischt das Widerrufsrecht, wenn '
        + 'wir die Dienstleistung vollständig erbracht haben und mit der Ausführung erst begonnen '
        + 'haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre '
        + 'Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger '
        + 'Vertragserfüllung durch uns verlieren.',
    ],
  };
}

/** Muster-Widerrufsformular nach Anlage 2 zu Art. 246a § 1 Abs. 2 Satz 1 Nr. 1 EGBGB. */
export function musterWiderrufsformular(company: CompanyProfile): RechtsAbschnitt {
  const { email } = kontakt(company);
  const an = [anbieterEinzeilig(company), ...(email ? [`E-Mail ${email}`] : [])].join(', ');
  return {
    id: 'muster-widerrufsformular',
    ueberschrift: 'Muster-Widerrufsformular',
    ebene: 2,
    absaetze: [
      '(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)',
      {
        liste: [
          `An ${an}:`,
          'Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf '
            + 'der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)',
          'Bestellt am (*)/erhalten am (*)',
          'Name des/der Verbraucher(s)',
          'Anschrift des/der Verbraucher(s)',
          'Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)',
          'Datum',
        ],
      },
      '(*) Unzutreffendes streichen.',
    ],
  };
}

/* ---------- AGB ---------------------------------------------------------- */

export interface AgbKontext {
  settings: Pick<Settings, 'company' | 'shipping' | 'booking'>;
  /** Anzeigetexte der Online-Zahlarten; `null` ohne Online-Zahlung. */
  zahlarten: string[] | null;
  siteUrl?: string;
}

/** Allgemeine Geschäftsbedingungen als nummerierte Abschnitte. */
export function agbAbschnitte({ settings, zahlarten, siteUrl = getSiteUrl() }: AgbKontext): RechtsAbschnitt[] {
  const { company, shipping, booking } = settings;
  const basis = ohneSchraegstrich(siteUrl);
  const name = firmenname(company);
  const { telefon, email } = kontakt(company);
  const werkstatt = standort(company);
  const sitzOrt = angabe(company.city);
  const lieferzeiten = shipping
    .filter((option) => angabe(option.deliveryTime))
    .map((option) => `${option.label}: ${option.deliveryTime!.trim()}`);

  const kontaktSatz = [
    ...(telefon ? [`Telefon ${telefon}`] : []),
    ...(email ? [`E-Mail ${email}`] : []),
  ].join(', ');

  const abschnitt = (nummer: number, id: string, titel: string, absaetze: Absatz[]): RechtsAbschnitt => ({
    id,
    ueberschrift: `§ ${nummer} ${titel}`,
    ebene: 2,
    absaetze,
  });

  return [
    abschnitt(1, 'geltungsbereich', 'Geltungsbereich', [
      `(1) Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die Sie mit ${name} `
        + '(im Folgenden „wir“) über diese Website schließen: Bestellungen im Shop (Schlüssel nach '
        + 'Code, gleichschließende Zylinder und Artikel), Buchungen von Autoschlüssel-Terminen und '
        + 'Aufträge, die aus Anfragen über diese Website entstehen.',
      '(2) Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die '
        + 'überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit '
        + 'zugerechnet werden können (§ 13 BGB). Unternehmer ist eine natürliche oder juristische '
        + 'Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines '
        + 'Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit '
        + 'handelt (§ 14 BGB).',
      '(3) Individuelle Vereinbarungen haben Vorrang vor diesen Bedingungen. Abweichende '
        + 'Bedingungen des Kunden gelten nur, wenn wir ihnen ausdrücklich zustimmen.',
    ]),
    abschnitt(2, 'vertragspartner', 'Vertragspartner', [
      `Ihr Vertragspartner ist ${anbieterEinzeilig(company)}.`
        + (kontaktSatz ? ` Sie erreichen uns unter ${kontaktSatz}.` : '')
        + ' Weitere Angaben stehen im Impressum.',
    ]),
    abschnitt(3, 'vertragsschluss-shop', 'Vertragsschluss im Shop', [
      '(1) Die Darstellung der Waren im Shop ist kein rechtlich bindendes Angebot, sondern eine '
        + 'Aufforderung zur Bestellung.',
      '(2) Sie legen Waren in den Warenkorb, wählen eine Versandart und geben in der Kasse Ihre '
        + 'Daten ein. Vor dem Absenden sehen Sie alle Angaben in einer Übersicht und können '
        + 'Eingabefehler dort und im Warenkorb jederzeit berichtigen. Mit dem Klick auf '
        + '„Zahlungspflichtig bestellen“ geben Sie ein verbindliches Angebot zum Kauf der Waren im '
        + 'Warenkorb ab.',
      '(3) Wir bestätigen den Eingang Ihrer Bestellung unverzüglich per E-Mail. Diese '
        + 'Eingangsbestätigung ist noch keine Annahme Ihres Angebots. Der Vertrag kommt zustande, '
        + 'wenn wir Ihre Bestellung mit einer Auftragsbestätigung per E-Mail annehmen oder die Ware '
        + 'versenden bzw. zur Abholung bereitstellen.',
    ]),
    abschnitt(4, 'vertragsschluss-termin', 'Autoschlüssel-Termine', [
      '(1) Im Autoschlüssel-Ablauf wählen Sie Fahrzeug, Leistung und Schlüsselart. Wir zeigen Ihnen '
        + 'daraufhin einen Festpreis, einen Preisrahmen oder den Hinweis, dass der Preis erst nach '
        + 'einer Prüfung feststeht, sowie die Höhe der Anzahlung. Anschließend wählen Sie einen Termin.',
      '(2) Mit dem Klick auf „Zahlungspflichtig buchen“ geben Sie ein verbindliches Angebot über die '
        + 'gewählte Leistung zum gewählten Termin ab. Der Vertrag kommt zustande, wenn wir die Buchung '
        + 'per E-Mail bestätigen.',
      '(3) Haben wir einen Preisrahmen genannt oder steht der Preis erst nach einer Prüfung fest, '
        + 'teilen wir Ihnen den verbindlichen Preis vor Beginn der Arbeiten mit. Liegt er über dem '
        + 'genannten Rahmen, führen wir die Leistung nur mit Ihrer Zustimmung aus.',
    ]),
    abschnitt(5, 'anfragen', 'Anfragen und Projekte', [
      '(1) Anfragen über die geführten Formulare und Konfiguratoren – etwa Schlüssel nach Vorlage, '
        + 'Schließanlagen, elektronische Zutrittslösungen, Sicherheitstechnik und allgemeine '
        + 'Anfragen – sind unverbindlich. Mit dem Absenden kommt noch kein Vertrag zustande.',
      '(2) Wir prüfen Ihre Anfrage und unterbreiten Ihnen ein Angebot in Textform. Der Vertrag kommt '
        + 'erst zustande, wenn Sie dieses Angebot annehmen. Inhalt, Umfang und Preis der Leistung '
        + 'richten sich dann nach dem Angebot.',
    ]),
    abschnitt(6, 'preise', 'Preise und Versandkosten', [
      '(1) Alle Preise sind Endpreise in Euro einschließlich der gesetzlichen Umsatzsteuer von '
        + 'derzeit 19 %.',
      '(2) Bei Lieferungen kommen Versandkosten hinzu. Sie richten sich nach der gewählten '
        + 'Versandart und werden im Warenkorb sowie auf der Seite „Zahlung und Versand“ '
        + `(${basis}/rechtliches/versand-und-zahlung) ausgewiesen.`,
    ]),
    abschnitt(7, 'zahlung', 'Zahlung', [
      zahlarten && zahlarten.length > 0
        ? '(1) Die Zahlung erfolgt online über den Zahlungsdienstleister Stripe Payments Europe, '
          + 'Limited (Dublin, Irland). Nach dem Absenden werden Sie dazu auf eine Bezahlseite von '
          + 'Stripe weitergeleitet. Zur Verfügung stehen:'
        : '(1) Die Zahlung erfolgt per Überweisung nach Rechnung oder vor Ort. Die '
          + 'Zahlungsinformationen erhalten Sie mit unserer Bestätigung.',
      ...(zahlarten && zahlarten.length > 0 ? [{ liste: zahlarten }] : []),
      '(2) Bei Online-Zahlung ist der Betrag mit der Bestellung bzw. Buchung fällig, bei Zahlung nach '
        + 'Rechnung mit Zugang der Rechnung.',
      '(3) Für Aufträge aus Anfragen gelten die im Angebot genannten Zahlungsbedingungen.',
    ]),
    abschnitt(8, 'anzahlung', 'Anzahlung bei Autoschlüssel-Terminen', [
      '(1) Für Autoschlüssel-Termine erheben wir eine Anzahlung. Ihre Höhe hängt von Fahrzeug und '
        + `Leistung ab (derzeit ${formatCents(booking.depositMinCents)} bis `
        + `${formatCents(booking.depositMaxCents)}) und wird vor der Buchung angezeigt. Sie sichert die `
        + 'Beschaffung fahrzeugspezifischen Materials und den reservierten Termin.',
      '(2) Die Anzahlung wird vollständig mit dem Endpreis verrechnet. Der Restbetrag ist mit '
        + 'Abschluss der Leistung fällig.',
      '(3) Was bei Absage, Verschiebung oder Nichterscheinen mit der Anzahlung geschieht, richtet '
        + 'sich nach der individuellen Vereinbarung mit Ihnen. Ihr gesetzliches Widerrufsrecht '
        + '(§ 15) bleibt davon unberührt.',
    ]),
    abschnitt(9, 'lieferung', 'Lieferung, Abholung und Lieferzeiten', [
      '(1) Wir liefern ausschließlich an Lieferanschriften in Deutschland.',
      ...(lieferzeiten.length > 0
        ? ['(2) Es gelten folgende Lieferzeiten je Versandart:', { liste: lieferzeiten }]
        : ['(2) Ist bei einer Ware eine Lieferzeit angegeben, gilt diese.']),
      '(3) Eine angegebene Lieferzeit beginnt mit dem Vertragsschluss, bei Online-Zahlung mit dem '
        + 'Eingang der Zahlung.',
      werkstatt
        ? `(4) Wählen Sie die Abholung, holen Sie die Ware nach unserer Benachrichtigung in unserer `
          + `Werkstatt ab: ${werkstatt.street}, ${werkstatt.postalCode} ${werkstatt.city}.`
        : '(4) Wählen Sie die Abholung, holen Sie die Ware nach unserer Benachrichtigung an unserem '
          + 'Geschäftssitz ab.',
      '(5) Sind Sie Verbraucher, geht die Gefahr des zufälligen Untergangs und der zufälligen '
        + 'Verschlechterung der Ware erst mit der Übergabe an Sie über. Sind Sie Unternehmer, geht '
        + 'sie mit der Übergabe an das Transportunternehmen über.',
    ]),
    abschnitt(10, 'anfertigung', 'Anfertigung nach Code oder Vorlage', [
      '(1) Schlüssel nach Code, Schlüssel nach Vorlage und gleichschließende Zylinder fertigen wir '
        + 'eigens nach Ihren Angaben (Code, Vorlage, Maße, Funktionen und Schlüsselanzahl).',
      '(2) Sie sind für die Richtigkeit dieser Angaben verantwortlich. Bitte prüfen Sie Code, Maße '
        + 'und Auswahl vor dem Absenden. Eine Ware, die Ihren Angaben entspricht, ist nicht deshalb '
        + 'mangelhaft, weil die Angaben unzutreffend waren.',
      '(3) Für diese Waren besteht nach § 312g Abs. 2 Nr. 1 BGB kein Widerrufsrecht (siehe § 15).',
    ]),
    abschnitt(11, 'berechtigung', 'Nachweis der Berechtigung', [
      '(1) Wir fertigen Schlüssel und lernen Fahrzeugschlüssel nur für Berechtigte an. Für '
        + 'Fahrzeugschlüssel verlangen wir die Zulassungsbescheinigung Teil I (Fahrzeugschein). Für '
        + 'Schlüssel zu Schließanlagen und geschützten Profilen verlangen wir die Sicherungskarte '
        + 'oder einen gleichwertigen Nachweis.',
      '(2) Solange ein geforderter Nachweis fehlt oder begründete Zweifel an der Berechtigung '
        + 'bestehen, dürfen wir die Leistung zurückstellen oder ablehnen. Gesetzliche Ansprüche '
        + 'bleiben unberührt.',
      '(3) Wie wir Nachweise speichern und wann wir sie löschen, steht in der Datenschutzerklärung.',
    ]),
    abschnitt(12, 'eigentumsvorbehalt', 'Eigentumsvorbehalt', [
      'Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.',
    ]),
    abschnitt(13, 'maengel', 'Mängelrechte', [
      '(1) Es gelten die gesetzlichen Mängelrechte.',
      '(2) Bitte melden Sie offensichtliche Transportschäden möglichst sofort dem Zusteller und uns. '
        + 'Ihre gesetzlichen Rechte hängen davon nicht ab.',
      '(3) Planen, liefern oder montieren wir Video-, Alarm- oder Zutrittstechnik, sind Sie als '
        + 'Betreiber für deren rechtmäßigen Betrieb verantwortlich – insbesondere für die Ausrichtung '
        + 'von Kameras, die Speicherdauer von Aufzeichnungen, die Kennzeichnung überwachter Bereiche '
        + 'und die Information betroffener Personen.',
    ]),
    abschnitt(14, 'haftung', 'Haftung', [
      '(1) Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei der Verletzung von '
        + 'Leben, Körper oder Gesundheit, nach dem Produkthaftungsgesetz und soweit wir eine Garantie '
        + 'übernommen haben.',
      '(2) Bei leicht fahrlässiger Verletzung einer wesentlichen Vertragspflicht ist unsere Haftung '
        + 'auf den vertragstypischen, vorhersehbaren Schaden begrenzt. Wesentlich sind Pflichten, '
        + 'deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und '
        + 'auf deren Einhaltung Sie regelmäßig vertrauen dürfen.',
      '(3) Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.',
    ]),
    abschnitt(15, 'widerruf', 'Widerrufsrecht', [
      'Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Einzelheiten – auch zu den Ausnahmen '
        + 'bei Anfertigungen nach Ihren Angaben – stehen in der Widerrufsbelehrung unter '
        + `${basis}/rechtliches/widerruf. Den Widerruf können Sie auch online unter `
        + `${widerrufErklaerenUrl(basis)} erklären.`,
    ]),
    abschnitt(16, 'datenschutz', 'Datenschutz', [
      'Wie wir personenbezogene Daten verarbeiten, steht in der Datenschutzerklärung unter '
        + `${basis}/rechtliches/datenschutz.`,
    ]),
    abschnitt(17, 'streitbeilegung', 'Streitbeilegung', [
      'Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer '
        + 'Verbraucherschlichtungsstelle teilzunehmen.',
    ]),
    abschnitt(18, 'schluss', 'Schlussbestimmungen', [
      '(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. '
        + 'Gegenüber Verbrauchern gilt diese Rechtswahl nur, soweit ihnen dadurch nicht der Schutz '
        + 'zwingender Bestimmungen des Staates entzogen wird, in dem sie ihren gewöhnlichen '
        + 'Aufenthalt haben.',
      sitzOrt
        ? '(2) Sind Sie Kaufmann, juristische Person des öffentlichen Rechts oder '
          + 'öffentlich-rechtliches Sondervermögen, ist Gerichtsstand für alle Streitigkeiten aus dem '
          + `Vertrag ${sitzOrt}.`
        : '(2) Sind Sie Kaufmann, juristische Person des öffentlichen Rechts oder '
          + 'öffentlich-rechtliches Sondervermögen, ist Gerichtsstand für alle Streitigkeiten aus dem '
          + 'Vertrag unser Geschäftssitz.',
      '(3) Vertragssprache ist Deutsch. Wir speichern den Vertragstext. Die Vertragsdaten und diese '
        + 'Bedingungen erhalten Sie mit unserer Bestätigung per E-Mail; die aktuelle Fassung können '
        + 'Sie auf dieser Seite jederzeit abrufen und ausdrucken.',
      '(4) Sind einzelne Bestimmungen unwirksam, bleibt die Wirksamkeit der übrigen unberührt.',
    ]),
  ];
}

/* ---------- Textausgabe (E-Mail) ----------------------------------------- */

/** Abschnitte als schlichter Text, z. B. für die Vertragsbestätigung per E-Mail. */
export function abschnitteAlsText(abschnitte: readonly RechtsAbschnitt[]): string {
  return abschnitte
    .map((abschnitt) => {
      const kopf = abschnitt.ebene === 2 ? abschnitt.ueberschrift.toUpperCase() : abschnitt.ueberschrift;
      const absaetze = abschnitt.absaetze.map((absatz) =>
        typeof absatz === 'string' ? absatz : absatz.liste.map((punkt) => `– ${punkt}`).join('\n'),
      );
      return [kopf, ...absaetze].join('\n\n');
    })
    .join('\n\n\n');
}
