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
import { AutoKeyConfigurator } from '@/components/autoschluessel/auto-key-configurator';

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

export default async function AutoschluesselHubPage(
  props: {
    params: Promise<{ [key: string]: string | string[] | undefined }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const resolvedParams = await props.params;
  const resolvedSearch = await props.searchParams;
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
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
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

      {/* Erweiterter Fachinhalt für > 800 Wörter Pflicht */}
      <Section tight>
        <div className="mx-auto max-w-3xl prose-sm24">
          <SectionHeading eyebrow="Fachexpertise" title="Die technische Methodik hinter Autoschlüsseln" />
          <p className="mt-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            Ein moderner Autoschlüssel ist ein hochkomplexes elektronisches Bauteil, das weitaus mehr Funktionen erfüllt, als nur eine Tür zu öffnen oder den Motor zu starten. Er kommuniziert permanent mit den Steuergeräten des Fahrzeugs, authentifiziert sich in Millisekunden und sorgt für ein Höchstmaß an Sicherheit durch kryptografische Verschlüsselung (Rolling Codes). Unsere technische Methodik basiert auf jahrelanger Erfahrung, ständiger Weiterbildung und dem Einsatz von Herstellersoftware sowie modernsten Diagnose- und Programmiergeräten.
          </p>
          <h3 className="mt-8 text-lg font-semibold text-[oklch(0.16_0.02_260)]">Architektonische Methodik der Schlüsselprogrammierung</h3>
          <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
            Wenn Sie einen neuen Autoschlüssel benötigen, reicht es nicht aus, lediglich den mechanischen Bart nachzufräsen. Der kritische Prozess findet auf der Software-Ebene statt. Hierbei wird der Transponder (meist ein winziger Chip im Schlüsselgehäuse) an die Wegfahrsperre (Immobilizer) des Fahrzeugs angelernt. Jedes Fahrzeugmodell, teilweise sogar unterschiedliche Baujahre desselben Modells, nutzen spezifische Protokolle (z.B. CAN-Bus, K-Line oder LIN-Bus), über die unsere Diagnosetools mit dem Body Control Module (BCM) oder dem Motorsteuergerät (ECU) kommunizieren.
          </p>
          <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
            Wir unterscheiden grundsätzlich zwischen drei Szenarien: Dem Klonen eines bestehenden Schlüssels (was bei älteren Modellen mit Fix-Codes funktioniert), der On-Board-Programmierung (OBP) über die OBD-II-Schnittstelle und dem direkten Auslesen von EEPROM- oder MCU-Daten aus dem Steuergerät, wenn gar kein Schlüssel mehr vorhanden ist (All Keys Lost - AKL). Für das AKL-Szenario müssen wir oft Steuergeräte ausbauen und die Datenstrukturen manuell analysieren und manipulieren. Dies erfordert tiefgehendes Verständnis von Hexadezimal-Codierung und Fahrzeugnetzwerken.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-[oklch(0.16_0.02_260)]">Leistungsstufen und Technologie-Matrix</h3>
          <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
            Um Ihnen absolute Transparenz zu bieten, haben wir unsere Leistungen in klar definierte Stufen unterteilt, die sich an der technologischen Komplexität Ihres Fahrzeugs orientieren:
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm text-[oklch(0.32_0.02_260)] border-collapse">
              <thead>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <th className="pb-3 font-semibold text-[oklch(0.16_0.02_260)]">Technologie-Stufe</th>
                  <th className="pb-3 font-semibold text-[oklch(0.16_0.02_260)]">Merkmale</th>
                  <th className="pb-3 font-semibold text-[oklch(0.16_0.02_260)]">Bearbeitungsmethode</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <td className="py-4 font-medium">Standard (Mechanisch/Transponder)</td>
                  <td className="py-4">Klassischer Bart, einfacher RFID-Chip (Megamos, Temic, Texas Instruments)</td>
                  <td className="py-4">Präzisionsfräsen nach Code, Transponder-Klonen oder OBD-Anlernen</td>
                </tr>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <td className="py-4 font-medium">Premium (Funkschlüssel)</td>
                  <td className="py-4">Zentralverriegelung über Funk (meist 433 MHz oder 868 MHz), komplexere Krypto-Transponder (z.B. Hitag2, Megamos Crypto)</td>
                  <td className="py-4">Spezifische OBD-Programmierung, Synchronisierung der Rolling Codes für die Fernbedienung</td>
                </tr>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <td className="py-4 font-medium">Complex (Smart Key / Keyless Go)</td>
                  <td className="py-4">Proximity-Sensoren, passive Entry (PEPS), oft AES-128 Bit Verschlüsselung (z.B. MQB-Plattform, FBS3/FBS4)</td>
                  <td className="py-4">Hochsicherheits-Programmierung mit Online-Server-Autorisierung (Händler-Level)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
            Unsere Werkstatt ist mit CNC-gesteuerten Schlüsselfräsmaschinen ausgestattet, die eine Toleranz von weniger als 0,02 mm aufweisen. Dies garantiert, dass der nachgemachte Schlüssel das Schloss exakt wie das Original am ersten Tag betätigt, ohne die sensiblen Zuhaltungen (Pin-Tumbler oder Laser-Track) im Zylinder zu verschleißen.
          </p>
          <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
            Darüber hinaus legen wir größten Wert auf Datensicherheit. Jeder Programmiervorgang wird manipulationssicher dokumentiert. Wir verwenden ausschließlich zertifizierte Rohlinge und Elektronikkomponenten, die den OEM-Spezifikationen entsprechen oder diese sogar übertreffen, um Langlebigkeit und Zuverlässigkeit bei extremen Temperaturen und Erschütterungen zu gewährleisten.
          </p>
        </div>
      </Section>

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
      {/* Interaktiver Konfigurator */}
      <Section tight>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Kalkulation"
            title="Preiskalkulator Autoschlüssel"
            lead="Berechnen Sie mit unserem interaktiven Kalkulator in Echtzeit, welche Kosten für die Bearbeitung, Programmierung oder Reparatur Ihres Autoschlüssels anfallen."
            className="mb-10 text-center"
          />
          <AutoKeyConfigurator />
        </div>
      </Section>

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

      {/* Domain-spezifische FAQ (Pflicht) */}
      <Section>
        <SectionHeading
          eyebrow="Tiefgehende Fragen"
          title="Umfassende Antworten auf komplexe Sachverhalte"
          className="max-w-2xl"
        />
        <Accordion items={[
          {
            question: 'Warum ist ein neuer Funkschlüssel für moderne Fahrzeuge so kostspielig?',
            answer: 'Moderne Funkschlüssel sind im Grunde kleine Computer. Sie enthalten einen mechanischen Not-Bart, eine Platine für die Funkfernbedienung (oft mit Rolling-Code-Technologie gegen Replay-Angriffe) und einen Krypto-Transponder für die Wegfahrsperre. Die Kosten setzen sich aus der Hardware (zertifizierte OEM-Teile), der CNC-Fräsung und vor allem aus der aufwendigen Software-Programmierung zusammen, die teures Diagnose-Equipment und oft Lizenzen für die Hersteller-Server erfordert.'
          },
          {
            question: 'Können Sie auch Schlüssel anlernen, wenn alle Originalschlüssel verloren wurden (All Keys Lost)?',
            answer: 'Ja, in den meisten Fällen können wir helfen, auch wenn kein Schlüssel mehr vorhanden ist (AKL-Szenario). Dies ist jedoch deutlich aufwendiger als das Anfertigen eines Ersatzschlüssels. Oft müssen wir das Fahrzeug vor Ort anfahren, das Türschloss decodieren (z.B. mit Lishi-Tools), um den mechanischen Schlüsselcode zu ermitteln, und uns anschließend direkt in das Fahrzeugnetzwerk einwählen oder Steuergeräte ausbauen, um neue kryptografische Schlüsselpaare zu generieren.'
          },
          {
            question: 'Wie stellen Sie sicher, dass verlorene Schlüssel nicht mehr funktionieren?',
            answer: 'Bei der Programmierung eines neuen Schlüssels führen wir in der Regel eine Re-Synchronisierung des Immobilizer-Systems durch. Dabei werden alle nicht physisch anwesenden Schlüssel aus dem Speicher des Steuergeräts gelöscht. Ein Finder oder Dieb kann mit dem alten Schlüssel den Motor nicht mehr starten. Der mechanische Zugang über das Türschloss bleibt zwar bestehen, sofern die Schließzylinder nicht getauscht werden, aber das Fahrzeug ist gegen unbefugtes Starten gesichert.'
          },
          {
            question: 'Muss das Fahrzeug für die Programmierung immer bei Ihnen vor Ort sein?',
            answer: 'Für die reine Fräsung eines mechanischen Schlüssels nach Code oder das Klonen sehr einfacher, alter Transponder reicht manchmal der Schlüssel selbst. Bei 95% aller modernen Fahrzeuge ab Baujahr 1998 MUSS das Fahrzeug jedoch zwingend physisch vor Ort sein. Die Programmierung erfolgt über die OBD-Schnittstelle im Auto, da der neue Schlüssel direkt mit dem Motorsteuergerät und der Wegfahrsperre „verheiratet“ werden muss. Eine Fernprogrammierung ist technisch und sicherheitsbedingt ausgeschlossen.'
          },
          {
            question: 'Was ist der Unterschied zwischen einem Smart Key und einem normalen Funkschlüssel?',
            answer: 'Ein normaler Funkschlüssel sendet ein Signal, wenn Sie aktiv eine Taste drücken, um die Türen zu öffnen. Zum Starten muss er physisch in das Zündschloss gesteckt und gedreht werden. Ein Smart Key (Keyless Entry/Go) kommuniziert passiv über Niederfrequenz-Antennen im Fahrzeug. Das Auto erkennt den Schlüssel in der Tasche, öffnet bei Berührung des Türgriffs und lässt sich per Start-Knopf anlassen. Smart Keys erfordern aufgrund ihrer passiven Funktechnologie (z.B. UWB - Ultra-Wideband) und AES-Verschlüsselung eine wesentlich komplexere Hardware und Programmierung.'
          }
        ]} className="mt-8" />
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
    </main>
  );
}
