import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, KeyRound, Wrench } from 'lucide-react';

import { getPageContent, getSettings, getVehicleMakes } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { KEY_KIND_HINT } from '@/components/autoschluessel/key-kinds';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { AutoschluesselPreisKalkulator } from '@/components/autoschluessel/autoschluessel-preis-kalkulator';

const ROUTE = 'autoschluessel';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel — Leistungen im Überblick',
    description:
      page?.seo.description
      ?? 'Autoschlüssel nachmachen, kopieren, programmieren und reparieren. Alle Leistungen, '
        + 'der Ablauf und die passenden Fahrzeugmarken im Überblick.',
    alternates: { canonical: '/autoschluessel' },
  };
}

const TRANSPONDER_HINT: InfoHint = {
  title: 'Transponder und Wegfahrsperre',
  body:
    'Im Schlüssel sitzt ein kleiner Chip, der Transponder. Beim Starten fragt das Fahrzeug diesen '
    + 'Chip ab. Passt die Antwort nicht, bleibt die Wegfahrsperre aktiv und der Motor springt nicht '
    + 'an — auch dann, wenn der mechanische Bart passt und die Tür aufgeht. Die Verschlüsselungsalgorithmen '
    + 'sind mittlerweile hochkomplex (AES, Hitag, Megamos Crypto) und erfordern modernstes Equipment.',
  figure: {
    motif: 'Makroaufnahme: geöffnetes Schlüsselgehäuse mit sichtbarem Transponder',
    ratio: '3/2',
    note: 'Eigene Werkstattaufnahme, Chip deutlich erkennbar.',
  },
};

const BART_HINT: InfoHint = {
  title: 'Was ist der Schlüsselbart?',
  body:
    'Der Bart ist der metallene Teil des Schlüssels, der in das Schloss passt. Er wird nach einer '
    + 'Code-Nummer oder anhand eines Musterschafts gefräst. Es gibt verschiedene Typen wie Bahnenschlüssel, '
    + 'Zackenbart oder Kreuzbart, die unterschiedliche Fräsverfahren erfordern.',
  figure: {
    motif: 'Fräse in Aktion, Funken fliegen nicht, aber Späne',
    ratio: '3/2',
    note: 'Zeigt mechanische Präzisionsarbeit',
  },
};

const TOPIC_GROUPS = [
  {
    title: 'Mechanik und Hardware',
    icon: Wrench,
    lead: 'Arbeiten am Gehäuse und dem Schlüsselbart.',
    topics: [
      {
        term: 'Schlüsselbart fräsen',
        href: '/autoschluessel/schluesselbart-fraesen',
        body: 'Der metallene Teil wird nach Vorlage oder Code neu geschnitten. Wir nutzen CNC-gesteuerte Präzisionsfräsen für exakte Kopien, selbst wenn die Vorlage abgenutzt ist. Durch diese computergestützte Präzision garantieren wir, dass auch hochkomplexe Bahnenschlüssel (sogenannte Laser-Cut Schlüssel) absolut maßhaltig gefräst werden, wodurch der Verschleiß an den Schließzylindern in Ihrem Fahrzeug auf ein Minimum reduziert wird. Diese Präzision ist besonders bei modernen Fahrzeugen mit empfindlichen Schließzylindern essenziell.',
        hint: BART_HINT,
      },
      {
        term: 'Gehäuse wechseln',
        href: '/autoschluessel/reparieren',
        body: 'Tasten sind abgenutzt oder das Gehäuse ist gebrochen. Elektronik wird übernommen. Oft brechen auch die Scharniere bei Klappschlüsseln, was wir kostengünstig beheben. Wir verwenden ausschließlich hochwertige Ersatzgehäuse in Erstausrüsterqualität, die haptisch und optisch dem Original in nichts nachstehen. Das fragile Innenleben (Transponderglasröhrchen und Platinen) wird dabei unter Antistatik-Bedingungen fachgerecht umgebettet.',
      },
      {
        term: 'Mechanische Kopie',
        href: '/autoschluessel/kopieren',
        body: 'Eine exakte Kopie des Bartes. Öffnet die Tür, startet aber nicht zwingend den Motor. Ideal als reiner Notschlüssel (z.B. für den Strand), der nass werden darf. Diese Variante ist besonders beliebt bei Surfern oder Tauchern, da ein solcher rein mechanischer Schlüssel keinerlei empfindliche Elektronik enthält, die durch Salz- oder Süßwasser zerstört werden könnte.',
      },
    ],
  },
  {
    title: 'Elektronik und Wegfahrsperre',
    icon: KeyRound,
    lead: 'Programmieren und Anlernen von Transpondern und Fernbedienungen.',
    topics: [
      {
        term: 'Schlüssel programmieren',
        href: '/autoschluessel/programmieren',
        body: 'Die Wegfahrsperre (Transponder) wird auf das Fahrzeug codiert. Dies geschieht in der Regel über die OBD-Schnittstelle des Fahrzeugs unter Verwendung hochspezialisierter Diagnosehardware, die den passenden kryptografischen Seed-Key mit dem Motorsteuergerät oder der Wegfahrsperren-Einheit aushandelt und permanent speichert.',
        hint: TRANSPONDER_HINT,
      },
      {
        term: 'Funkschlüssel anlernen',
        href: '/autoschluessel/funkschluessel',
        body: 'Die Fernbedienung für die Zentralverriegelung wird synchronisiert. Bei manchen Fahrzeugen geschieht dies durch manuelle Anlern-Prozeduren im Fahrzeuginnenraum, bei den meisten modernen Fahrzeugen muss die Funkfrequenz (meist 433 MHz oder 868 MHz) jedoch über unsere Diagnosetester zwingend im Komfortsteuergerät hinterlegt werden. Häufig ist dies direkt mit der Programmierung der Wegfahrsperre kombiniert.',
      },
      {
        term: 'Smart-Key / Keyless Go',
        href: '/autoschluessel/smart-key',
        body: 'Aufwändige Programmierung von schlüssellosen Zugangssystemen. Diese Systeme nutzen bidirektionale Kommunikation, dynamische Rolling-Codes und Challenge-Response-Verfahren für allerhöchste Sicherheit. Wir sind in der Lage, auch solche komplexen Smart-Keys als vollwertigen Ersatz oder zusätzliche Kopie direkt an das Bordnetz Ihres Fahrzeugs anzulernen.',
      },
    ],
  },
  {
    title: 'Notdienste und Spezialfälle',
    icon: Car,
    lead: 'Wenn nichts mehr geht oder alle Schlüssel weg sind.',
    topics: [
      {
        term: 'Alle Schlüssel verloren (All Keys Lost)',
        href: '/autoschluessel/alle-verloren',
        body: 'Aufwendiger Prozess: Neues Schloss codieren, neue Schlüssel fräsen und anlernen. In solchen All-Keys-Lost Situationen müssen wir häufig Türschlösser ausbauen, um den mechanischen Schlüsselcode zu dekodieren, und anschließend einen Reset des Wegfahrsperrensystems durchführen, um neue Schlüssel autorisieren zu können. Dabei werden die verlorenen Schlüssel permanent aus dem System gelöscht.',
      },
      {
        term: 'Fahrzeugöffnung',
        href: '/autoschluessel/fahrzeugoeffnung',
        body: 'Schlüssel liegt im Auto oder Kofferraum. Wir bieten eine absolut beschädigungsfreie Öffnung über spezielle Dekoder-Werkzeuge am Türschloss an. Es entstehen keinerlei Kratzer am Lack oder verbogene Türrahmen, wie es oft bei veralteten Öffnungsmethoden der Fall ist.',
      },
      {
        term: 'Wegfahrsperre defekt',
        href: '/autoschluessel/wegfahrsperre',
        body: 'Diagnose und Reparatur, wenn das Fahrzeug den Schlüssel nicht mehr erkennt. Wir analysieren tiefgreifend Fehlercodes im Motorsteuergerät oder Komfortsteuergerät, prüfen die Lesespulen am Zündschloss auf Leitungsbrüche und können häufig durch gezielte Bauteilreparatur einen teuren Austausch kompletter Steuergeräte vermeiden.',
      },
    ],
  },
];

const FAQ = [
  {
    question: 'Muss ich mit meinem Auto zwingend in der Werkstatt vorbeikommen?',
    answer: 'In den allermeisten Fällen ist dies zwingend erforderlich. Besonders für das Programmieren der Wegfahrsperre (Transponder-Codierung) und das Anlernen der Funkfernbedienung an das Komfortsteuergerät benötigen wir das Fahrzeug physisch vor Ort an unserem Standort. Nur so können wir unsere speziellen Diagnosegeräte direkt an die OBD-Schnittstelle (On-Board-Diagnose) anschließen. Lediglich für einfache mechanische Kopien (Fräsen nach Muster) oder rein physische Gehäusewechsel, bei denen die intakte Elektronikplatine und der Transponder nur umgesetzt werden, reicht oft der Schlüssel selbst aus. Wir empfehlen aber generell und ausdrücklich, mit dem betreffenden Fahrzeug vorzufahren, um die volle Funktionalität (Schließen der Türen, Zündung an, Motorstart ohne Fehlermeldung) direkt vor Ort unter realen Bedingungen testen zu können. Dies garantiert Ihnen höchste Sicherheit und erspart Ihnen unnötige Wege, falls noch Anpassungen nötig sein sollten.',
  },
  {
    question: 'Wie lange dauert das Nachmachen eines Autoschlüssels in der Regel?',
    answer: 'Der zeitliche Aufwand hängt extrem stark von der Fahrzeugmarke, dem exakten Modell, dem Baujahr und der verbauten Technologiegeneration ab. Ein einfacher mechanischer Schlüssel ohne Wegfahrsperre (typisch bei Old- und Youngtimern vor Baujahr 1995) dauert oft nur 10 bis 15 Minuten. Das CNC-Fräsen und vollständige elektronische Programmieren eines modernen Smart-Keys (Keyless Go) dauert in der Regel 45 bis 90 Minuten, sobald der passende Rohling aus unserem Lager vorrätig ist. Einige spezielle Fahrzeugmarken aus dem Premiumsegment erfordern zudem einen Online-Abgleich von Sicherheitszertifikaten mit den Herstellerservern im Hintergrund, was den Prozess durch Download- und Verifikationszeiten zusätzlich verlängern kann.',
  },
  {
    question: 'Was brauche ich, wenn alle Schlüssel komplett verloren sind (All Keys Lost Situation)?',
    answer: 'Dies ist der aufwändigste, teuerste und technisch komplexeste Fall, da wir keine funktionierende Vorlage mehr haben. Wir benötigen in dieser Situation zwingend die Zulassungsbescheinigung (Teil I oder II, ehemals Fahrzeugschein/Fahrzeugbrief) sowie Ihren gültigen Personalausweis im Original, um rechtlich einwandfrei sicherzustellen, dass Sie als Auftraggeber auch tatsächlich berechtigt sind, für dieses spezifische Fahrzeug Schlüssel anfertigen zu lassen. Je nach Fahrzeug müssen wir dann neue Schlüsselrohlinge über die Fahrgestellnummer (VIN) beim Hersteller bestellen, oder wir müssen Türschlösser vor Ort ausbauen und zerlegen, um den mechanischen Schlüsselcode zu dekodieren. Anschließend müssen die neuen Schlüssel tief im Motorsteuergerät oder Komfortsteuergerät (BSI/BCM) autorisiert werden, was oft den Ausbau dieser Steuergeräte (EEPROM/MCU-Auslesen am Tisch) erfordert. Wir beraten Sie hierzu gerne vorab telefonisch.',
  },
  {
    question: 'Können Sie auch modernste Keyless-Go-Schlüssel nachmachen und anlernen?',
    answer: 'Ja, das gehört zu unserem täglichen Geschäft. Wir können für die überwiegende Mehrheit der gängigen europäischen, asiatischen und amerikanischen Marken und Modelle Smart-Keys (Keyless-Entry / Keyless-Go Systeme) beschaffen, den in das Kunststoffgehäuse integrierten Notschlüssel (Bart) mechanisch präzise fräsen und die hochkomplexe Elektronik an das Fahrzeug anlernen. Diese modernen Schlüssel nutzen kryptografische Rolling-Codes und Challenge-Response-Verfahren für die Authentifizierung, was immens teures und spezielles Programmierequipment erfordert. Auch hier gilt ausnahmslos: Das Fahrzeug muss zwingend bei uns vor Ort in der Halle sein.',
  },
  {
    question: 'Reparieren Sie auch kaputte Schlüssel oder tauschen Sie nur die Gehäuse?',
    answer: 'Absolut, die Reparatur von Schlüsselelektronik ist eine unserer Spezialitäten. Sehr oft ist nur das äußere Kunststoffgehäuse durch Herunterfallen gebrochen, der Klappmechanismus des Bartes ist ausgeleiert, die Gummitasten sind eingedrückt (die Mikroschalter darunter sind mechanisch defekt) oder die Akku-Zelle/Batterie ist leer. Wir können Gehäuse wechseln, neue Mikroschalter per feiner SMD-Löttechnik unter dem Mikroskop auf der Platine neu einlöten und fest verlötete Akkus (wie sie oft bei älteren BMW- oder Ford-Modellen vorkommen) fachmännisch tauschen. Die teure Elektronik und der Wegfahrsperren-Chip bleiben dabei erhalten, sodass in der Regel kein neues, kostenpflichtiges Anlernen am Fahrzeug nötig ist. Wir können häufig auch Feuchtigkeitsschäden reparieren.',
  },
  {
    question: 'Kann ich einen gebrauchten Schlüssel von eBay oder vom Schrottplatz anlernen lassen?',
    answer: 'In 95% der Fälle lautet die Antwort hierauf leider: Nein. Sobald ein moderner Transponder (wie z.B. Hitag2 oder Megamos) einmal mit einem Fahrzeug "verheiratet" wurde, wird er softwareseitig verriegelt (locked) und kann nicht ohne Weiteres für ein anderes Fahrzeug derselben Marke wiederverwendet werden. Nur durch extrem aufwändiges "Renewing" (Entsperren des Chips durch Auslöten und Überschreiben des EEPROMs) können einige wenige Schlüsselarten wiederverwendbar gemacht werden. Dies lohnt sich wirtschaftlich oft nicht. Wir raten dringend davon ab, gebrauchte Schlüssel zu kaufen, da die Enttäuschung beim Anlernversuch groß ist.',
  },
];


interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AutoschluesselPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const [page, settings, makes] = await Promise.all([
    getPageContent(ROUTE),
    getSettings(),
    getVehicleMakes(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;
  const modelCount = makes.reduce((acc, make) => acc + make.models.length, 0);

  const steps = [
    {
      title: 'Fahrzeug exakt bestimmen',
      body: 'Geben Sie Marke, Modell und Baujahr präzise ein, damit wir sofort wissen, um welche spezifische Schlüsseltechnologie und Wegfahrsperren-Generation es geht.',
    },
    {
      title: 'Aktuellen Zustand angeben',
      body: 'Haben Sie noch einen voll funktionierenden Schlüssel? Brauchen Sie lediglich eine Zweitkopie oder ist alles restlos verloren gegangen?',
    },
    {
      title: 'Verbindlichen Preis erfahren',
      body: 'Wir prüfen die technische Machbarkeit im Hintergrund und zeigen Ihnen sofort den kalkulierten Preis oder einen engen Preisrahmen für die benötigte Leistung.',
    },
    {
      title: 'Termin online vereinbaren',
      body: 'Buchen Sie bequem und digital einen freien Termin in unserer zertifizierten Werkstatt für die Programmierung und das Fräsen.',
    },
    {
      title: 'Vor Ort final abschließen',
      body: 'Wir fräsen und programmieren den Schlüssel direkt an Ihrem Fahrzeug. Sie testen alles ausführlich und bezahlen erst dann den Restbetrag.',
    },
  ];

  return (
    <main className="bg-[oklch(0.988_0.002_260)] text-[oklch(0.32_0.02_260)]" data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <JsonLd data={pageGraphSchema({ path: ROUTE, name: 'Autoschlüssel — Leistungen im Überblick' })} />
      <PageHeader
        title="Autoschlüssel nachmachen, programmieren & reparieren"
        lead="Vom einfachen mechanischen Nachschlüsseln über komplizierte SMD-Elektronikreparaturen bis hin zum kryptografischen Anlernen modernster Smart-Keys — hier erfahren Sie detailliert, welche Möglichkeiten es für Ihr Fahrzeug gibt und wie unser Prozess abläuft."
      >
        <dl className="mt-8 flex flex-wrap gap-8 sm:gap-12">
          <div>
            <dt className="text-sm font-medium text-foreground-subtle">
              Unterstützte Marken
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{makes.length}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-foreground-subtle">
              Erfasste Modelle
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{modelCount}</dd>
          </div>
        </dl>
      </PageHeader>

      {/* Einordnung */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading title="Systemarchitektur von Fahrzeugschlüsseln: Mechanik trifft Hochtechnologie" />
            <div className="prose-sm24 mt-5 space-y-4">
              <p>
                {page?.intro
                  ?? 'Wir klären zuerst, was Ihr Fahrzeug braucht, und nennen Ihnen danach Preis oder '
                    + 'Preisrahmen. Erst dann buchen Sie einen Termin.'}
              </p>
              <p>
                Ein moderner Autoschlüssel ist längst kein einfaches Stück Metall mehr, sondern ein hochkomplexes
                elektronisches Bauteil, das in die tiefsten Sicherheitssysteme Ihres Fahrzeugs eingreift. Er besteht
                fundamental aus zwei grundlegenden Komponenten, die für die Funktionalität zwingend erforderlich sind
                und bei Reparaturen oder Nachfertigungen technisch strikt getrennt betrachtet werden müssen: dem
                mechanischen Bart und der elektronischen Baugruppe. Für Ihren konkreten Auftrag ist es absolut
                entscheidend, welcher dieser beiden Teile bearbeitet, kopiert oder komplett neu programmiert werden
                muss. Davon hängen der zeitliche Aufwand in unserer Werkstatt, die Notwendigkeit, dass das Fahrzeug
                zwingend vor Ort sein muss, sowie letztlich auch der kalkulierte Preis maßgeblich ab. Wir verwenden
                für diese Arbeiten modernstes Equipment, das stetig durch Updates auf dem neuesten Stand gehalten wird.
              </p>
              <p>
                Der mechanische Bart ist für das rein physische Aufschließen der Türen (oft versteckt als Notschlüssel)
                oder das Drehen des Zündschlosses verantwortlich. Das Fräsen dieses Bartes geschieht in unserer
                Werkstatt auf hochpräzisen, computergesteuerten CNC-Maschinen. Diese Maschinen dekodieren die Form
                entweder optisch anhand eines Musters oder fräsen exakt nach Herstellercode (Key Code), um abgenutzte
                Kanten einer alten Vorlage nicht zu übernehmen, sondern einen Schlüssel in Erstausrüsterqualität
                mit minimalen Toleranzen herzustellen. Dies ist essenziell, um einen übermäßigen Verschleiß der
                Schließzylinder im Fahrzeug zu verhindern. Sollten alle mechanischen Schlüssel verloren gegangen sein,
                können wir durch spezielle Dekodierwerkzeuge (sogenannte Lishi-Picks) direkt am Türschloss das Schnittprofil
                ermitteln und einen neuen Bart fräsen, ohne das komplette Fahrzeugschlosssystem austauschen zu müssen.
              </p>
              <p>
                Die Elektronik hingegen – insbesondere der Transponder-Chip für die Wegfahrsperre (RFID-Technologie,
                oft passive Chips aus Glas oder Carbon) und die Platine für die Funkfernbedienung – erfordert
                tiefgreifende Diagnose-Hard- und Software. Nur wenn der Transponder und das Motorsteuergerät
                (ECU) oder Komfortsteuergerät (BSI/BCM) exakt aufeinander abgestimmt (&quot;verheiratet&quot;) sind, gibt
                das Fahrzeug die Kraftstoffzufuhr und Zündung frei. Moderne Keyless-Go (Smart-Key) Systeme
                erhöhen diesen elektronischen Aufwand noch einmal drastisch durch komplexe Krypto-Berechnungen,
                Rolling-Codes und bidirektionale Kommunikation zwischen Schlüssel und Antennen im Fahrzeug. Hier
                werden kryptografische Keys ausgetauscht, die bei jedem Startvorgang neu generiert werden müssen.
                Die Programmierung solcher Systeme erfordert teils zwingend verschlüsselte Online-Verbindungen zu den
                Servern der Fahrzeughersteller, um Sicherheitszertifikate abzurufen, was höchste Expertise und
                modernstes Equipment erfordert. Dies ist auch der Grund, warum &quot;gebrauchte&quot; Schlüssel meist nicht
                funktionieren.
              </p>
              <p>
                Die folgenden Leistungsbegriffe und Kategorien führen Sie gezielt zu der Unterseite, die Ihren
                individuellen Fall exakt beschreibt. Wir trennen bewusst zwischen mechanischen Arbeiten (Fräsen,
                Gehäusetausch), elektronischer Programmierung (Transponder, Funk) und SMD-Reparaturen, um maximale
                Transparenz zu schaffen. Wenn Sie unsicher sind, was genau Sie benötigen oder welche Generation
                der Wegfahrsperre in Ihrem Fahrzeug verbaut ist, empfehlen wir Ihnen nachdrücklich, direkt mit
                unserem geführten Ablauf zu starten. Dort fragen wir Schritt für Schritt über eine intuitive Maske
                genau die Angaben ab (Fahrzeugmarke, Modell, genaues Baujahr, aktueller Schlüsselzustand), die
                für eine verbindliche technische Aussage und Preiskalkulation für Ihr spezifisches Fahrzeug
                zwingend nötig sind. Dieser Service spart Ihnen Zeit und stellt sicher, dass wir bei Ihrem
                Termin optimal vorbereitet sind und die passenden Rohlinge direkt griffbereit haben. Sie erhalten
                somit vorab immer volle Kostentransparenz und Planungssicherheit, noch bevor Sie in unsere
                Fachwerkstatt kommen. Dies ist ein Qualitätsversprechen, an dem wir uns gerne messen lassen.
              </p>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Arbeitsplatz mit CNC-Schlüsselfräse und modernem OBD-Diagnosegerät',
              ratio: '4/3',
              note: 'Eigene Aufnahme aus dem Betrieb. Kein Stockfoto. Zeigt die Symbiose aus Mechanik und Elektronik.',
            }}
          />
        </div>
      </Section>

      {/* Leistungsbegriffe */}
      <Section tone="muted" id="leistungen" className="bg-[oklch(0.968_0.004_260)] py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Leistungen"
          title="Alle Begriffe, sauber getrennt"
          lead="Die Begriffe werden im Alltag oft vermischt. Hier steht, was jeweils gemeint ist und wohin er führt."
        />

        <div className="mt-8 space-y-12">
          {TOPIC_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)] border border-[oklch(0.890_0.008_260/0.55)]">
                    <Icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">{group.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                      {group.lead}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ gridTemplateRows: 'subgrid' }}>
                  {group.topics.map((topic) => (
                    <li key={topic.term} className="row-span-1">
                      <div className="flex h-full flex-col rounded-2xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.05)]">
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-[15px] font-semibold text-[oklch(0.16_0.02_260)]">{topic.term}</h4>
                            {topic.hint && <InfoTip hint={topic.hint} className="shrink-0" />}
                          </div>
                          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                            {topic.body}
                          </p>
                          <Link
                            href={topic.href}
                            className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] transition-colors hover:text-[oklch(0.46_0.24_260)]"
                          >
                            Zur Detailseite
                            <ArrowRight size={15} aria-hidden />
                            <span className="sr-only">{topic.term}</span>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Kalkulator */}
      <Section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Kalkulation"
            title="Kosteneinschätzung & Budgetierung"
            lead="Nutzen Sie unseren interaktiven Rechner für eine erste Budgeteinschätzung basierend auf dem geschätzten technischen Aufwand."
          />
          <div className="mt-8">
            <AutoschluesselPreisKalkulator />
          </div>
          <div className="mt-8 prose-sm24 text-[oklch(0.32_0.02_260)] space-y-4">
            <p>
              Unser Preisrechner bietet Ihnen eine erste, unverbindliche Orientierung für die zu erwartenden Kosten.
              Die tatsächlichen Preise für das Nachmachen, Programmieren oder Reparieren von Autoschlüsseln können
              aufgrund der enormen Vielfalt an Fahrzeugherstellern, Modellen, Baujahren und der jeweils verbauten
              Sicherheitstechnik (Wegfahrsperren-Generationen, kryptografische Verschlüsselungsalgorithmen wie AES
              oder Hitag) zum Teil erheblich variieren. So kostet ein einfacher mechanischer Schlüsselbart als
              reine Notöffnungskopie ohne Transponder nur einen Bruchteil dessen, was für einen hochkomplexen
              Smart-Key (Keyless Go) inklusive Online-Anmeldung am Motorsteuergerät fällig wird.
            </p>
            <p>
              Auch der Materialeinsatz spielt eine entscheidende Rolle: Originalschlüssel vom Vertragshändler sind in
              der Regel deutlich teurer als hochwertige Aftermarket-Alternativen in Erstausrüsterqualität, die wir
              ebenfalls anbieten können, und die bei gleicher Funktionalität oftmals ein hervorragendes
              Preis-Leistungs-Verhältnis bieten. Für ein verbindliches Angebot starten Sie bitte unseren detaillierten
              Anfrageprozess.
            </p>
          </div>
        </div>
      </Section>

      {/* Ablauf in fünf Schritten */}
      <Section id="ablauf" className="py-16 md:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Ablauf"
              title="In fünf geführten Schritten zum Termin"
              lead="Vollständig mobil bedienbar. Ihre Eingaben bleiben sicher erhalten, wenn Sie den Vorgang zwischendurch abbrechen müssen."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/autoschluessel/anfrage" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99]">
                Geführten Ablauf starten
                <ArrowRight size={17} aria-hidden />
              </Link>
              <Link href="/autoschluessel/marken" className="inline-flex items-center justify-center rounded-xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-6 py-3 text-sm font-semibold text-[oklch(0.16_0.02_260)] transition-colors hover:border-[oklch(0.16_0.02_260)]">
                Erst Fahrzeugkatalog nachschlagen
              </Link>
            </div>

            <Alert tone="info" title="Wichtige Hinweise zu Anzahlung und Vorlaufzeiten" className="mt-7 border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] text-[oklch(0.32_0.02_260)]">
              Die Anzahlung für Materialbestellungen beträgt standardmäßig {deposit} und wird bei Abschluss
              vollständig auf den Gesamtpreis angerechnet. Der Vorlauf von etwa {leadDays} Tagen entsteht durch
              die fahrzeugspezifische Beschaffung des passenden Schlüsselrohlings und der Elektronikplatine aus
              dem Fachgroßhandel oder direkt vom Hersteller. Für einzelne, exotische Fahrzeuge oder ältere Modelle
              können abweichende Werte gelten — diese Details sehen Sie jedoch transparent im Ablauf, bevor Sie
              etwas verbindlich buchen.
            </Alert>
          </div>

          <ol className="relative space-y-8 border-l border-[oklch(0.890_0.008_260/0.55)] pl-8">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] font-display text-sm font-bold text-[oklch(0.16_0.02_260)]"
                >
                  {index + 1}
                </span>
                <h3 className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Fahrzeuge */}
      <Section tone="muted" tight className="bg-[oklch(0.968_0.004_260)] py-16 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Fahrzeugkatalog"
              title="Spezifische Informationen für Ihre Marke und Ihr Modell"
              lead={`In unserer umfangreichen Datenbank zu ${makes.length} Marken und ${modelCount} Modellen haben wir präzise hinterlegt, welche Schlüsselarten (Funk, Keyless, reiner Transponder) vorkommen und ob das Fahrzeug zum Anlernen zwingend vor Ort in unserer Werkstatt sein muss oder ob wir den Schlüssel rein nach Code fertigen können.`}
            />
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/autoschluessel/marken" className="inline-flex items-center gap-2 text-sm font-semibold text-[oklch(0.52_0.24_260)] hover:underline">
                Alle {makes.length} Marken im Katalog ansehen
                <ArrowRight size={17} aria-hidden />
              </Link>
              <InfoTip hint={KEY_KIND_HINT} />
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {makes.slice(0, 9).map((make) => (
              <li key={make.id}>
                <Link
                  href={`/autoschluessel/marken/${make.slug}`}
                  className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-3 text-[14px] font-semibold text-[oklch(0.16_0.02_260)] transition-all hover:border-[oklch(0.16_0.02_260)] hover:shadow-sm"
                >
                  {make.name}
                  <ArrowRight size={14} aria-hidden className="shrink-0 text-[oklch(0.32_0.02_260)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Fragen */}
      <Section className="py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Häufige Fragen (FAQ)"
          title="Tiefgehende Antworten auf häufige Anliegen unserer Kunden"
          className="max-w-2xl"
        />
        <div className="mt-8 prose-sm24 text-[oklch(0.32_0.02_260)] max-w-3xl">
          <p>
            Im Rahmen unserer täglichen hochspezialisierten Arbeit rund um Autoschlüssel, Wegfahrsperren und Fahrzeugelektronik
            begegnen uns immer wieder ähnliche Fragen unserer Kunden. Dies ist absolut verständlich, da die Technologie
            in modernen Fahrzeugschlüsseln äußerst komplex ist und weit über das einfache mechanische Aufschließen eines Schlosses
            hinausgeht. Die Transponder-Technologie (RFID), Krypto-Algorithmen und synchronisierte Funkfrequenzen für die Zentralverriegelung
            machen den Autoschlüssel zu einem hochsicheren elektronischen Bauteil, das streng vor unbefugtem Zugriff geschützt ist.
            In unserem umfangreichen FAQ-Bereich greifen wir die drängendsten Fragen auf und beantworten sie mit unserer fundierten
            fachlichen Expertise transparent und detailliert, damit Sie genau wissen, was bei einem Auftrag auf Sie zukommt.
          </p>
        </div>
        <Accordion items={page?.faq?.length ? page.faq : FAQ} className="mt-8 max-w-3xl" />
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight className="bg-[oklch(0.968_0.004_260)] py-16 md:py-24 lg:py-32">
        <SectionHeading
          title="Weiterführende Informationsseiten"
          lead="Vertiefende Ratgeber und nützliche Links passend zum hochkomplexen Thema Autoschlüssel und Fahrzeugelektronik."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/autoschluessel/anfrage', label: 'Geführter Anfrageprozess', description: 'Fahrzeug wählen, Preis erhalten, Termin in der Werkstatt buchen' },
            { href: '/autoschluessel/marken', label: 'Marken und Modellkatalog', description: 'Schlüsselarten, Frequenzen und Transpondertypen je Fahrzeug nachschlagen' },
            { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Schlüssel komplett verloren — was tun?', description: 'Die richtige Reihenfolge bei All Keys Lost Situationen' },
            { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder echte Programmierung?', description: 'Der technische Unterschied zwischen Klonen und Anlernen kurz erklärt' },
            { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Code oder Vorlage', description: 'Für mechanische Schlüssel ohne Fahrzeugbezug oder Elektronik' },
            { href: '/service-und-termin/terminstatus', label: 'Online Terminstatus', description: 'Den aktuellen Stand Ihres Werkstatt-Vorgangs bequem online abrufen' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full min-h-[44px] flex-col rounded-2xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 transition-all hover:border-[oklch(0.16_0.02_260)] hover:shadow-sm"
              >
                <span className="text-[15px] font-semibold text-[oklch(0.16_0.02_260)]">
                  {link.label}
                </span>
                <span className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                  {link.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
