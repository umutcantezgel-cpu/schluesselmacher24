import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, KeyRound, Wrench } from 'lucide-react';

import { getPageContent, getSettings, getVehicleMakes } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { KEY_KIND_HINT, ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { CarKeyConfigurator } from '@/components/autoschluessel/car-key-configurator';

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
    + 'an — auch dann, wenn der mechanische Bart passt und die Tür aufgeht.',
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
    + 'Vorlage oder nach geeigneten Fahrzeugdaten gefräst. Mit der Elektronik im Schlüssel hat er '
    + 'nichts zu tun.',
  figure: {
    motif: 'Messzeichnung: Schlüsselbart mit Einschnitten und Bezeichnung der Positionen',
    ratio: '3/2',
  },
};

const SMART_KEY_HINT: InfoHint = {
  title: 'Smart Key und Keyless',
  body:
    'Bei diesen Systemen erkennt das Fahrzeug den Schlüssel, sobald er sich in der Nähe befindet. '
    + 'Sie öffnen und starten, ohne den Schlüssel in die Hand zu nehmen. Beschaffung und Anlernen '
    + 'sind aufwendiger als bei einem einfachen Funkschlüssel.',
};

interface Topic {
  term: string;
  href: string;
  body: string;
  hint?: InfoHint;
}

interface TopicGroup {
  title: string;
  lead: string;
  icon: typeof KeyRound;
  topics: Topic[];
}

const TOPIC_GROUPS: TopicGroup[] = [
  {
    title: 'Schlüssel anfertigen',
    lead: 'Alles, was einen zusätzlichen oder neuen Schlüssel für Ihr Fahrzeug betrifft.',
    icon: KeyRound,
    topics: [
      {
        term: 'Autoschlüssel nachmachen',
        href: '/autoschluessel/nachmachen',
        body: 'Ein vollständiger weiterer Schlüssel — mechanisch gefertigt und elektronisch angelernt.',
      },
      {
        term: 'Zweitschlüssel',
        href: '/autoschluessel/nachmachen',
        body: 'Ein zusätzlicher Schlüssel, solange mindestens ein funktionierender vorhanden ist.',
      },
      {
        term: 'Ersatzschlüssel nach Verlust',
        href: '/autoschluessel/nachmachen',
        body: 'Kein Schlüssel mehr vorhanden. Umfang und Machbarkeit prüfen wir im Einzelfall.',
      },
      {
        term: 'Autoschlüssel kopieren',
        href: '/autoschluessel/kopieren',
        body: 'Mechanische Kopie nach Vorlage. Ohne Elektronik startet sie das Fahrzeug nicht.',
      },
      {
        term: 'Schlüsselbart fräsen',
        href: '/autoschluessel/schluesselbart-fraesen',
        body: 'Der metallene Teil des Schlüssels — nach Vorlage oder geeigneten Fahrzeugdaten.',
        hint: BART_HINT,
      },
    ],
  },
  {
    title: 'Elektronik und Programmierung',
    lead: 'Damit das Fahrzeug den Schlüssel erkennt und annimmt.',
    icon: Wrench,
    topics: [
      {
        term: 'Programmieren und anlernen',
        href: '/autoschluessel/programmieren',
        body: 'Der Schlüssel wird dem Fahrzeug bekannt gemacht. Dafür ist Zugriff auf das Fahrzeug nötig.',
        hint: ON_SITE_HINT,
      },
      {
        term: 'Transponder und Wegfahrsperre',
        href: '/autoschluessel/programmieren',
        body: 'Der Chip im Schlüssel entscheidet darüber, ob der Motor startet.',
        hint: TRANSPONDER_HINT,
      },
      {
        term: 'Funkschlüssel',
        href: '/autoschluessel/funkschluessel',
        body: 'Fernbedienung zum Ver- und Entriegeln. Funk und Wegfahrsperre sind getrennte Funktionen.',
      },
      {
        term: 'Smart Key und Keyless',
        href: '/autoschluessel/smart-key',
        body: 'Schlüsselloser Zugang und Start. Mehr Vorlauf und mehr Zeit am Fahrzeug einplanen.',
        hint: SMART_KEY_HINT,
      },
    ],
  },
  {
    title: 'Reparatur und Sonderfälle',
    lead: 'Wenn der vorhandene Schlüssel nicht mehr richtig arbeitet oder gar nicht greifbar ist.',
    icon: Car,
    topics: [
      {
        term: 'Gehäuse, Tasten und Batterie',
        href: '/autoschluessel/funkschluessel',
        body: 'Gebrochenes Gehäuse, klemmende Tasten oder schwache Batterie — die Elektronik bleibt erhalten.',
      },
      {
        term: 'Schlüsselverlust',
        href: '/autoschluessel/nachmachen',
        body: 'Die richtige Reihenfolge spart Zeit: erst prüfen, was noch vorhanden ist, dann beauftragen.',
      },
      {
        term: 'Fahrzeugöffnung',
        href: '/autoschluessel/fahrzeugoeffnung',
        body: 'Zerstörungsfreies Öffnen als eigene Leistung. Sie ersetzt keinen Ersatzschlüssel.',
      },
    ],
  },
];

const FAQ = [
  {
    question: 'Muss mein Fahrzeug für einen neuen Autoschlüssel vor Ort sein?',
    answer:
      'Für rein mechanische Arbeiten am Bart in vielen Fällen nicht. Sobald der Schlüssel elektronisch '
      + 'angelernt werden muss, ist Zugriff auf das Fahrzeug erforderlich. Ob das bei Ihrem Fahrzeug '
      + 'der Fall ist, sehen Sie auf der jeweiligen Modellseite und im geführten Ablauf.',
  },
  {
    question: 'Was kostet ein neuer Autoschlüssel?',
    answer:
      'Das hängt vom Fahrzeug und von der Schlüsselart ab. Im geführten Ablauf erhalten Sie nach der '
      + 'Auswahl Ihres Fahrzeugs entweder einen festen Preis, einen Preisrahmen oder den Hinweis, dass '
      + 'wir Ihren Fall zuerst manuell prüfen. Erst danach buchen Sie einen Termin.',
  },
  {
    question: 'Warum brauchen Sie Fotos von meinem Schlüssel?',
    answer:
      'Die Bauform sagt uns, welches Gehäuse, welcher Rohling und welche Elektronik verbaut sind. '
      + 'Drei Aufnahmen aus unterschiedlichen Richtungen reichen in aller Regel aus. Das erspart '
      + 'Rückfragen und verhindert, dass beim Termin etwas fehlt.',
  },
  {
    question: 'Kann ich meinen Schlüssel einschicken?',
    answer:
      'Für mechanische Arbeiten ist ein Versand in vielen Fällen möglich. Muss der Schlüssel am '
      + 'Fahrzeug angelernt werden, hilft ein Versand nicht weiter — dann ist ein Termin mit Fahrzeug '
      + 'der richtige Weg.',
  },
  {
    question: 'Wofür ist die Anzahlung?',
    answer:
      'Die Anzahlung sichert Ihren Termin und die Beschaffung des passenden Schlüssels. Sie wird '
      + 'vollständig auf den Gesamtpreis angerechnet.',
  },
  {
    question: 'Ich habe meinen Schlüssel im Fahrzeug eingeschlossen. Was jetzt?',
    answer:
      'Dafür gibt es die Fahrzeugöffnung als eigene Leistung. Bitte halten Sie einen Nachweis bereit, '
      + 'dass Sie über das Fahrzeug verfügen dürfen.',
  },
];

export default async function AutoschluesselHubPage() {
  const [page, settings, makes] = await Promise.all([
    getPageContent(ROUTE),
    getSettings(),
    getVehicleMakes(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  // Der Ablauf ist überall derselbe; Beträge und Vorlauf kommen aus den Einstellungen.
  const steps = [
    {
      title: 'Fahrzeug wählen',
      body: 'Marke, Modell, Baujahr und Schlüsselart. Wir fragen nur ab, was für Ihr Fahrzeug zählt.',
    },
    {
      title: 'Fotos hochladen',
      body: 'Ihren Schlüssel aus drei Richtungen und den Fahrzeugschein.',
    },
    {
      title: 'Preis oder Prüfung',
      body: 'Sie erhalten einen festen Preis, einen Preisrahmen oder den Hinweis auf eine manuelle Prüfung.',
    },
    {
      title: 'Anzahlung',
      body: `Standard ${deposit}. Der Betrag wird vollständig auf den Gesamtpreis angerechnet.`,
    },
    {
      title: 'Termin buchen',
      body: `Der früheste Termin liegt etwa ${leadDays} Tage in der Zukunft, weil wir Ihren Schlüssel vorher beschaffen.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/autoschluessel',
          name: page?.headline ?? 'Autoschlüssel',
          description: page?.seo.description,
          crumbs: [{ href: '/autoschluessel', label: 'Autoschlüssel' }],
          faq: page?.faq?.length ? page.faq : FAQ,
        })}
      />

      <PageHeader
        eyebrow="Themenwelt Autoschlüssel"
        title={page?.headline ?? 'Autoschlüssel'}
        lead={page?.subline ?? 'Nachmachen, programmieren, reparieren — mit klarem Ablauf und festem Termin.'}
        crumbs={[{ href: '/autoschluessel', label: 'Autoschlüssel' }]}
        actions={
          <ButtonLink href="/autoschluessel/anfrage">
            Fahrzeug auswählen und Termin starten
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Ablauf
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              {PROCESS_LABELS['termin-mit-anzahlung'].label}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Anzahlung
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{deposit}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Vorlauf
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              ca. {leadDays} Tage
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
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
            <SectionHeading title="Worum es in diesem Bereich geht" />
            <div className="prose-sm24 mt-5">
              <p>
                {page?.intro
                  ?? 'Wir klären zuerst, was Ihr Fahrzeug braucht, und nennen Ihnen danach Preis oder '
                    + 'Preisrahmen. Erst dann buchen Sie einen Termin.'}
              </p>

        <div className="prose prose-slate max-w-none mt-12 text-[oklch(0.32_0.02_260)]">
            <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mb-6">Architektonische Methodik & Technologische Expertise</h2>
            <p className="mb-4">
                Die moderne Fahrzeugsicherheitstechnik hat sich von rein mechanischen Schließsystemen zu hochkomplexen, kryptografisch abgesicherten Netzwerken entwickelt. Ein zeitgemäßer Autoschlüssel ist nicht länger nur ein passendes Stück Metall, sondern ein vollwertiger Authentifizierungs-Token, der permanent in einem verschlüsselten Dialog mit den Steuergeräten (ECU) Ihres Fahrzeugs steht. Unser Ansatz beim Nachmachen, Programmieren oder Reparieren von Autoschlüsseln basiert auf tiefgreifendem Verständnis dieser zugrundeliegenden Architektur. Wir betrachten jeden Auftrag nicht nur als handwerkliche Dienstleistung, sondern als hochspezialisierten datentechnischen Eingriff in die Sicherheitsinfrastruktur des Fahrzeugs.
            </p>
            <p className="mb-4">
                Das Fundament unserer Arbeit bildet die präzise Analyse der vorhandenen Schließanlage und der dazugehörigen Elektronik. Wenn wir einen Schlüssel nachmachen, beginnen wir in der Regel mit der physischen Rekonstruktion des Schlüsselbarts. Dies geschieht heute nicht mehr manuell nach Augenmaß, sondern mittels hochpräziser CNC-Fräsmaschinen, die auf Basis von hinterlegten Code-Tabellen der Hersteller exakte Kopien mit minimalen Toleranzen im Mikrometerbereich anfertigen. Doch die eigentliche Herausforderung liegt im digitalen Bereich. Der im Schlüssel integrierte Transponder, der die Kommunikation mit der Wegfahrsperre übernimmt, muss exakt auf die spezifische Frequenz und das Protokoll des Fahrzeugs abgestimmt sein. Dies erfordert nicht nur das richtige Equipment, sondern auch fortlaufend aktualisiertes Fachwissen über die sich stetig wandelnden Verschlüsselungsstandards der verschiedenen Automobilhersteller.
            </p>

            <CarKeyConfigurator />

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-4">Der Programmierprozess: Diagnose und Kryptografie</h3>
            <p className="mb-4">
                Die Programmierung eines neuen Schlüssels ist ein mehrstufiger Vorgang. Zunächst muss eine Verbindung über die OBD-II-Schnittstelle (On-Board Diagnostics) des Fahrzeugs hergestellt werden. Hierbei setzen wir auf modernste Diagnosetechnik, die es uns ermöglicht, sicher auf die relevanten Steuergeräte, insbesondere das Wegfahrsperren-Modul, zuzugreifen. In vielen Fällen ist es notwendig, einen Security Access Code (PIN) auszulesen oder vom Hersteller anzufordern, um die Programmierroutinen freizuschalten. Dieser Prozess unterliegt strengen Sicherheitsvorkehrungen, um unbefugten Zugriff zu verhindern.
            </p>
            <p className="mb-4">
                Nach erfolgreicher Autorisierung wird der neue Transponderchip im System registriert. Dabei wird oft ein neues kryptografisches Schlüsselpaar generiert oder ein Rolling-Code-Verfahren synchronisiert, um sicherzustellen, dass die Kommunikation zwischen Schlüssel und Fahrzeug abhörsicher bleibt. Bei Fahrzeugen mit Keyless-Go oder Smart-Key-Systemen wird zusätzlich die Nahfeldkommunikation (RFID/NFC) kalibriert, damit das Fahrzeug zuverlässig erkennt, wenn Sie sich nähern, und die Türen automatisch entriegelt. Jeder dieser Schritte erfordert absolute Präzision, da Fehlkonfigurationen im schlimmsten Fall zur vollständigen Sperrung des Motorsteuergeräts führen können.
            </p>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8 mb-4">Mechanik vs. Elektronik: Eine ganzheitliche Betrachtung</h3>
            <p className="mb-4">
                Trotz der Dominanz der Elektronik darf die mechanische Komponente nicht vernachlässigt werden. Ein perfekt programmierter Chip ist nutzlos, wenn der Schlüsselbart im Zylinderschloss hakt. Oft erleben wir Fälle, in denen verschlissene Originalschlüssel als Kopiervorlage dienen. Hier liegt unsere Expertise darin, nicht einfach den Verschleiß zu kopieren, sondern anhand der Abnutzungsmuster den ursprünglichen Code zu rekonstruieren (Decodierung). So erhalten Sie einen Schlüssel in Werksqualität, der Schließzylinder schont und eine lange Lebensdauer garantiert.
            </p>
            <p className="mb-4">
                Ebenso bieten wir professionelle Reparaturen an. Ein defekter Taster auf der Platine, ein gebrochenes Gehäuse oder eine leere Batterie müssen nicht zwingend den Austausch des gesamten Schlüssels bedeuten. Durch mikroelektronische Lötverfahren können wir viele Defekte kostengünstig und nachhaltig beheben, ohne dass eine teure Neuprogrammierung erforderlich wird. Diese ressourcenschonende Herangehensweise ist fester Bestandteil unserer Philosophie.
            </p>

            <div className="my-12">
                <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mb-6">Umfassende Fachspezifische Fragen & Antworten</h2>

                <div className="space-y-6">
                    <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
                        <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">1. Was genau passiert, wenn ein Schlüssel die Wegfahrsperre deaktiviert?</h4>
                        <p className="text-sm">Beim Einschalten der Zündung sendet eine Spule am Zündschloss ein elektromagnetisches Feld aus, das den passiven Transponder im Schlüssel mit Energie versorgt. Der Transponder sendet daraufhin einen verschlüsselten Code zurück an das Motorsteuergerät. Nur wenn dieser Code mit dem im Steuergerät hinterlegten Wert übereinstimmt, wird die Kraftstoffzufuhr und die Zündung freigegeben. Dieser Handshake findet in Bruchteilen von Sekunden statt.</p>
                    </div>

                    <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
                        <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">2. Warum ist das Nachmachen ohne Originalschlüssel deutlich teurer?</h4>
                        <p className="text-sm">Fehlt der Originalschlüssel, müssen wir sowohl den mechanischen Schließcode als auch die elektronischen Zugangsdaten komplett neu ermitteln. Dies bedeutet oft, dass wir das Türschloss oder Zündschloss ausbauen und zerlegen müssen, um die mechanische Fräsung abzuleiten. Elektronisch muss das Steuergerät zurückgesetzt und mit neuen Schlüsseln synchronisiert werden, was bei vielen modernen Fahrzeugen einen enormen Aufwand und spezielle, herstellergebundene Software erfordert.</p>
                    </div>

                    <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
                        <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">3. Können Sie jeden Keyless-Go-Schlüssel kopieren?</h4>
                        <p className="text-sm">Wir decken eine sehr hohe Bandbreite an Herstellern ab, jedoch gibt es Ausnahmen. Einige der neuesten Fahrzeuggenerationen (insbesondere bei Premium-Herstellern) nutzen stark geschlossene Ökosysteme mit sogenanntem Component Protection (Komponentenschutz), bei dem selbst freie Werkstätten kaum Zugriff auf die Programmierroutinen erhalten. In solchen speziellen Fällen muss der Schlüssel zwingend über das Händlernetz des Herstellers bezogen werden.</p>
                    </div>

                    <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
                        <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">4. Wie lange dauert die Neuprogrammierung eines Transponders?</h4>
                        <p className="text-sm">Die reine Datenübertragung und Synchronisation dauert oft nur wenige Minuten. Der zeitaufwendige Teil ist jedoch die Vorbereitung: Das Herstellen der sicheren Verbindung über die OBD-Schnittstelle, das Auslesen der Sicherheitsprotokolle und das eventuelle Warten auf Freigabecodes vom Herstellerserver. Im Durchschnitt kalkulieren wir für eine Standard-Programmierung zwischen 20 und 45 Minuten ein.</p>
                    </div>

                    <div className="bg-[oklch(0.988_0.002_260)] p-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)]">
                        <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">5. Was bedeutet &apos;Klonen&apos; im Gegensatz zum &apos;Anlernen&apos;?</h4>
                        <p className="text-sm">Beim Klonen wird der exakte elektronische Code eines vorhandenen Schlüssels auf einen neuen, leeren Transponder 1:1 kopiert. Das Fahrzeug &apos;denkt&apos; weiterhin, es gäbe nur den einen ursprünglichen Schlüssel. Beim Anlernen hingegen wird ein komplett neuer, eindeutiger Code generiert und dem Fahrzeug mitgeteilt, dass nun ein weiterer, eigenständiger Schlüssel existiert. Das Anlernen ist die sicherere und professionellere Methode, wird jedoch nicht von jedem Diagnosegerät unterstützt.</p>
                    </div>
                </div>
            </div>

            <p className="mb-8 font-medium text-[oklch(0.16_0.02_260)]">
                Vertrauen Sie auf unsere Expertise. Wir bieten Ihnen transparente Prozesse, höchste technische Standards und Lösungen, die exakt auf die Anforderungen Ihres Fahrzeugs zugeschnitten sind.
            </p>
        </div>

              <p>
                Ein Autoschlüssel besteht aus zwei Teilen, die getrennt betrachtet werden: dem
                mechanischen Bart und der Elektronik. Für Ihren Auftrag ist entscheidend, welcher der
                beiden Teile bearbeitet werden muss — davon hängen Aufwand, Termin und Preis ab.
              </p>
              <p>
                Die folgenden Begriffe führen Sie zu der Seite, die Ihren Fall beschreibt. Wenn Sie
                unsicher sind, beginnen Sie mit dem geführten Ablauf: Dort fragen wir Schritt für
                Schritt genau die Angaben ab, die für Ihr Fahrzeug nötig sind.
              </p>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Arbeitsplatz mit Schlüsselfräse und Diagnosegerät',
              ratio: '4/3',
              note: 'Eigene Aufnahme aus dem Betrieb. Kein Stockfoto.',
            }}
          />
        </div>
      </Section>

      {/* Leistungsbegriffe */}
      <Section tone="muted" id="leistungen">
        <SectionHeading
          eyebrow="Leistungen"
          title="Alle Begriffe, sauber getrennt"
          lead="Die Begriffe werden im Alltag oft vermischt. Hier steht, was jeweils gemeint ist und wohin er führt."
        />

        <div className="mt-8 space-y-8">
          {TOPIC_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold text-foreground">{group.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                      {group.lead}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.topics.map((topic) => (
                    <li key={topic.term}>
                      <Card className="flex h-full flex-col">
                        <CardBody className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-[15px] font-bold text-foreground">{topic.term}</h4>
                            {topic.hint && <InfoTip hint={topic.hint} className="shrink-0" />}
                          </div>
                          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                            {topic.body}
                          </p>
                          <Link
                            href={topic.href}
                            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                          >
                            Zur Seite
                            <ArrowRight size={15} aria-hidden />
                            <span className="sr-only">{topic.term}</span>
                          </Link>
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Ablauf in fünf Schritten */}
      <Section id="ablauf">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Ablauf"
              title="In fünf Schritten zum Termin"
              lead="Mobil bedienbar. Ihre Eingaben bleiben erhalten, wenn Sie zwischendurch abbrechen."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/autoschluessel/anfrage" size="lg">
                Ablauf starten
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/autoschluessel/marken" size="lg" variant="outline">
                Erst Fahrzeug nachschlagen
              </ButtonLink>
            </div>

            <Alert tone="info" title="Anzahlung und Vorlauf" className="mt-7">
              Die Anzahlung beträgt standardmäßig {deposit} und wird vollständig auf den Gesamtpreis
              angerechnet. Der Vorlauf von etwa {leadDays} Tagen entsteht durch die Beschaffung des
              passenden Schlüssels. Für einzelne Fahrzeuge und Leistungen können abweichende Werte
              gelten — diese sehen Sie im Ablauf, bevor Sie etwas verbindlich buchen.
            </Alert>
          </div>

          <ol className="relative space-y-5 border-l border-border pl-7">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-display text-xs font-bold text-primary"
                >
                  {index + 1}
                </span>
                <h3 className="text-[15px] font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Fahrzeuge */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Fahrzeuge"
              title="Was für Ihre Marke und Ihr Modell gilt"
              lead={`Zu ${makes.length} Marken und ${modelCount} Modellen haben wir hinterlegt, welche Schlüsselarten vorkommen und ob das Fahrzeug zum Anlernen vor Ort sein muss.`}
            />
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/autoschluessel/marken">
                Alle Marken ansehen
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <InfoTip hint={KEY_KIND_HINT} />
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {makes.slice(0, 9).map((make) => (
              <li key={make.id}>
                <Link
                  href={`/autoschluessel/marken/${make.slug}`}
                  className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {make.name}
                  <ArrowRight size={14} aria-hidden className="shrink-0 text-foreground-subtle" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Was vor dem Auftrag meist offen ist"
          className="max-w-2xl"
        />
        <Accordion items={page?.faq?.length ? page.faq : FAQ} className="mt-8" />
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight>
        <SectionHeading
          title="Weiterführende Seiten"
          lead="Passend zum Thema Autoschlüssel."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/autoschluessel/anfrage', label: 'Geführter Ablauf', description: 'Fahrzeug wählen, Preis erhalten, Termin buchen' },
            { href: '/autoschluessel/marken', label: 'Marken und Modelle', description: 'Schlüsselarten je Fahrzeug nachschlagen' },
            { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Schlüssel verloren — was tun?', description: 'Die richtige Reihenfolge' },
            { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?', description: 'Der Unterschied kurz erklärt' },
            { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage', description: 'Für Schlüssel ohne Fahrzeugbezug' },
            { href: '/service-und-termin/terminstatus', label: 'Terminstatus', description: 'Stand Ihres Vorgangs abrufen' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full min-h-[44px] flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                  {link.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
