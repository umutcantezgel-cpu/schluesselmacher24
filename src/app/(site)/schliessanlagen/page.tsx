import { SchliessanlagenPlaner } from '@/components/schliessanlagen/schliessanlagen-planer';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { InfoHint } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SystemErklaerung, SystemVergleich } from '@/components/schliessanlagen/system-erklaerung';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'schliessanlagen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Mechanische Schließanlagen planen',
    description:
      page?.seo.description
      ?? 'Gleichschließung, Zentralschlossanlage, Hauptschlüsselanlage und '
        + 'Generalhauptschlüsselanlage — in einfacher Sprache erklärt und im Konfigurator erfassbar.',
    alternates: { canonical: '/schliessanlagen' },
  };
}

/** Begriffe, die auf dieser Seite immer wieder vorkommen. */
const GLOSSARY: { term: string; summary: string; hint: InfoHint }[] = [
  {
    term: 'Schließstelle',
    summary: 'Jede Stelle, an der geschlossen wird — meist ein Zylinder in einer Tür.',
    hint: {
      title: 'Schließstelle',
      body:
        'Eine Schließstelle ist ein Punkt, an dem ein Zylinder oder ein Schloss sitzt. Eine Tür '
        + 'mit einem Zylinder ist eine Schließstelle. Eine doppelflügelige Tür mit zwei Zylindern '
        + 'sind zwei. Auch Briefkästen, Schränke, Schranken oder Vorhangschlösser zählen mit, '
        + 'wenn sie in die Anlage aufgenommen werden sollen.',
      figure: {
        motif: 'Schemazeichnung Grundriss mit markierten Schließstellen an Türen und Nebenstellen',
        ratio: '4/3',
      },
    },
  },
  {
    term: 'Schließplan',
    summary: 'Die Tabelle, in der steht, welcher Schlüssel welche Tür öffnet.',
    hint: {
      title: 'Schließplan',
      body:
        'Der Schließplan ist eine Tabelle: In den Zeilen stehen die Türen, in den Spalten die '
        + 'Schlüssel. Ein Kreuz bedeutet, dass dieser Schlüssel diese Tür öffnet. Der Plan wird '
        + 'vor der Fertigung gemeinsam abgestimmt und danach zur Grundlage der Anlage.',
      figure: {
        motif: 'Schemazeichnung Schließplan: Raster aus Türen, Schlüsseln und Kreuzen',
        ratio: '16/9',
      },
    },
  },
  {
    term: 'Sicherungskarte',
    summary: 'Der Nachweis, mit dem Schlüssel zu einer bestehenden Anlage nachbestellt werden.',
    hint: {
      title: 'Sicherungskarte',
      body:
        'Bei vielen Anlagen gehört eine Karte oder ein Nachweisdokument dazu. Nur wer diesen '
        + 'Nachweis vorlegt, kann weitere Schlüssel für die Anlage bestellen. Wenn Sie die Karte '
        + 'nicht finden, sagen Sie uns das im Konfigurator — wir prüfen dann, welche Wege es gibt.',
      figure: {
        motif: 'Schemazeichnung Sicherungskarte mit Anlagennummer, neutral ohne Herstellerbezug',
        ratio: '3/2',
      },
    },
  },
];

const AUDIENCES = [
  {
    icon: Layers,
    title: 'Privat',
    body:
      'Haus oder Wohnung mit Nebentüren: Keller, Garage, Gartentor, Briefkasten. Meist genügt '
      + 'eine Gleichschließung — ein Schlüssel für alles.',
    href: '/gleichschliessende-zylinder',
    linkLabel: 'Kleine Vorhaben direkt konfigurieren',
  },
  {
    icon: Building2,
    title: 'Unternehmen',
    body:
      'Büro, Werkstatt, Lager, Serverraum: Nicht jede Person braucht jede Tür. Eine '
      + 'Hauptschlüsselanlage (HS) bildet Zuständigkeiten ab, ohne den Alltag zu erschweren.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Projekt erfassen',
  },
  {
    icon: Users,
    title: 'Hausverwaltung',
    body:
      'Mehrere Parteien, gemeinsame Türen, wechselnde Mieter. Eine Zentralschlossanlage (Z) '
      + 'trennt die Wohnungen und öffnet die gemeinsamen Zugänge für alle.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Objekt erfassen',
  },
  {
    icon: Building2,
    title: 'Öffentliche Einrichtung',
    body:
      'Schule, Verwaltung, Einrichtung mit Publikumsverkehr: viele Bereiche, klar getrennte '
      + 'Zuständigkeiten und ein nachvollziehbarer Schließplan.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Bedarf erfassen',
  },
  {
    icon: Layers,
    title: 'Mehrere Gebäude',
    body:
      'Verteilte Standorte oder eine größere Liegenschaft: Eine Generalhauptschlüsselanlage '
      + '(GHS) fasst mehrere Gebäude unter einer gemeinsamen Ebene zusammen.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Liegenschaft erfassen',
  },
];

/** Fällt nur ein, solange in der Datenschicht keine Fragen gepflegt sind. */
const FALLBACK_FAQ = [
  {
    question: 'Muss ich die Abkürzungen Z, HS und GHS kennen, bevor ich anfrage?',
    answer:
      'Nein. Im Konfigurator beschreiben Sie Ihr Objekt und wer welche Tür öffnen soll. Daraus '
      + 'leiten wir einen Vorschlag für das passende System ab und besprechen ihn mit Ihnen.',
  },
  {
    question: 'Was ist der Unterschied zwischen einer Gleichschließung und einer Schließanlage?',
    answer:
      'Bei einer Gleichschließung öffnet jeder Schlüssel jede Tür. Eine Schließanlage unterscheidet '
      + 'dagegen, wer welche Tür öffnen darf, und bildet dafür Ebenen ab — vom Nutzerschlüssel bis '
      + 'zum Hauptschlüssel.',
  },
  {
    question: 'Kann ich eine Anlage später erweitern?',
    answer:
      'Das entscheidet sich bei der Planung. Wenn im Schließplan Reserven für weitere Türen und '
      + 'Nutzer vorgesehen sind, lassen sich später Schließstellen ergänzen. Sagen Sie uns deshalb '
      + 'im Konfigurator, was Sie in den nächsten Jahren vorhaben.',
  },
  {
    question: 'Ich habe schon eine Anlage. Können Sie sie ergänzen?',
    answer:
      'Das hängt vom vorhandenen System und vom Nachweis ab. Geben Sie im Konfigurator Hersteller, '
      + 'System und die Sicherungskarte an, soweit Ihnen das bekannt ist, und laden Sie vorhandene '
      + 'Pläne oder Fotos hoch. Wir prüfen danach, was möglich ist.',
  },
  {
    question: 'Wie kommt der Preis zustande?',
    answer:
      'Eine Schließanlage wird nach Ihrem Schließplan gefertigt. Preis und Aufwand hängen von der '
      + 'Anzahl der Schließstellen, der Schlüssel und der Ebenen ab. Deshalb nennen wir erst nach '
      + 'der Erfassung einen Betrag — und nicht vorab auf der Seite.',
  },
  {
    question: 'Brauchen alle Türen denselben Zylinder?',
    answer:
      'Nein. Innerhalb einer Anlage können Zylinder unterschiedlich ausgestattet sein — etwa '
      + 'Außentüren mit höherem Schutz gegen Aufbohren und Ziehen, Innentüren in einfacherer '
      + 'Ausführung. Welche Tür welche Ausstattung braucht, halten wir im Schließplan fest.',
  },
  {
    question: 'Was passiert, wenn ein Hauptschlüssel verloren geht?',
    answer:
      'Ein übergeordneter Schlüssel öffnet viele Türen. Bei einer rein mechanischen Anlage müssen '
      + 'deshalb meist die betroffenen Zylinder getauscht oder umgestellt werden. Für Türen mit '
      + 'hohem Verlustrisiko kann eine elektronische Lösung sinnvoll sein, weil sich ein verlorenes '
      + 'Medium dort sperren lässt.',
  },
  {
    question: 'Wer darf Nachschlüssel bestellen?',
    answer:
      'Bei Anlagen mit Sicherungskarte nur, wer die Karte vorlegt. Ob ein Profil zusätzlich '
      + 'geschützt ist und wie lange, hängt vom Hersteller und vom System ab. Bewahren Sie die '
      + 'Karte getrennt von den Schlüsseln auf.',
  },
  {
    question: 'Was gilt an Flucht- und Rettungswegen?',
    answer:
      'Türen in Flucht- und Rettungswegen müssen sich in Fluchtrichtung jederzeit ohne Schlüssel '
      + 'öffnen lassen. Dafür gibt es Notausgangs- und Paniktürverschlüsse nach DIN EN 179 und '
      + 'DIN EN 1125 sowie passende Zylinder. Kennzeichnen Sie solche Türen im Konfigurator, damit '
      + 'wir sie im Schließplan berücksichtigen.',
  },
  {
    question: 'Wie pflege ich die Zylinder?',
    answer:
      'Verwenden Sie kein Öl und kein Kriechöl — beides verharzt und zieht Schmutz an. Geeignet ist '
      + 'ein Pflegespray für Schließzylinder nach Angabe des Herstellers.',
  },
];

interface Props { params: Promise<{ id?: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }
export default async function SchliessanlagenPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  void resolvedParams;
  void resolvedSearch;
  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schliessanlagen',
          name: page?.headline ?? 'Schließanlagen',
          description: page?.seo.description,
          crumbs: [{ href: '/schliessanlagen', label: 'Schließanlagen' }],
          faq: faq,
        })}
      />

      <PageHeader
        eyebrow="Mechanische Schließanlagen"
        title={page?.headline ?? 'Mechanische Schließanlagen'}
        lead={page?.subline ?? 'Von der Gleichschließung bis zur Generalhauptschlüsselanlage.'}
        crumbs={[{ href: '/schliessanlagen', label: 'Schließanlagen' }]}
        actions={
          <>
            <ButtonLink href="/schliessanlagen/konfigurator" size="lg">
              Projekt erfassen
              <ArrowRight size={18} aria-hidden />
            </ButtonLink>
            <ButtonLink href="#systeme" size="lg" variant="outline">
              Systeme ansehen
            </ButtonLink>
          </>
        }
      />

      {/* Einstieg und Begriffe */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-[15px] leading-relaxed text-foreground-muted md:text-base">
              {page?.intro
                ?? 'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Systeme '
                  + 'in einfacher Sprache und planen Ihre Anlage so, dass sie später erweitert '
                  + 'werden kann.'}
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Der Weg dorthin ist immer derselbe: Sie erfassen Ihr Objekt, Ihre Nutzer und Ihre
              Türen. Daraus entsteht ein Schließplan, den wir gemeinsam mit Ihnen abstimmen. Erst
              danach wird gefertigt.
            </p>

            <div className="mt-6 rounded-lg border border-border bg-surface-muted px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {process.label}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {GLOSSARY.map((item) => (
                <li
                  key={item.term}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-foreground">{item.term}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-foreground-muted">
                      {item.summary}
                    </span>
                  </span>
                  <InfoTip hint={item.hint} />
                </li>
              ))}
            </ul>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schließplan auf dem Tisch neben sortierten Profilzylindern',
              ratio: '4/3',
              note: 'Echtes Foto aus dem eigenen Betrieb. Kein Stockfoto.',
            }}
          />
        </div>
      </Section>

      {/* Die fünf Systeme */}
      <Section id="systeme" tone="muted">
        <SectionHeading
          eyebrow="Systeme"
          title="Die fünf Systeme in einfacher Sprache"
          lead="Die vollständige Bezeichnung steht immer zuerst, die übliche Abkürzung folgt in Klammern. Vorwissen brauchen Sie nicht."
        />
        <div className="mt-8">
          <SystemErklaerung />
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-foreground">Die Systeme im Vergleich</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
            Wenn Sie unsicher sind, welches System zu Ihnen passt: Die Tabelle zeigt die
            Unterschiede nebeneinander. Im Konfigurator leiten wir daraus einen Vorschlag ab.
          </p>
          <div className="mt-5">
            <SystemVergleich />
          </div>
        </div>
      </Section>

      {/* Für wen */}
      <Section>
        <SectionHeading
          eyebrow="Für wen"
          title="Wer plant welche Anlage?"
          lead="Die Zuordnung ist ein Anhaltspunkt, keine Festlegung. Entscheidend sind Ihre Türen und Ihre Zuständigkeiten."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Card className="flex h-full flex-col">
                  <CardBody className="flex flex-1 flex-col">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon size={19} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-[15px] font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                      {item.body}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                    >
                      {item.linkLabel}
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>


      {/* Fachliche Tiefenbetrachtung: Architektonische Methodik & Planung von Schließanlagen */}
      <Section id="architektur" tone="muted">
        <SectionHeading
          eyebrow="Architektur"
          title="Tiefenbetrachtung: Architektonische Methodik & Planung"
          lead="Erfahren Sie alles über die zugrundeliegenden Strukturen, Planungsprinzipien und Sicherheitsaspekte von mechanischen Schließanlagen."
        />
        <div className="mt-8 prose prose-slate max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Eine moderne Schließanlage ist weitaus mehr als nur eine Ansammlung von Zylindern und Schlüsseln. Sie repräsentiert eine komplexe architektonische Methodik, die darauf abzielt, Sicherheit, Flexibilität und Benutzerfreundlichkeit harmonisch miteinander zu vereinen. Die Planung einer solchen Anlage erfordert ein tiefes Verständnis für die organisatorischen Abläufe innerhalb eines Gebäudes oder eines Gebäudeensembles sowie für die technischen Möglichkeiten, die heutige Schließsysteme bieten. In den folgenden Abschnitten werden wir die grundlegenden Konzepte, die verschiedenen Systemarchitekturen und die essenziellen Planungsschritte detailliert beleuchten.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] mt-8 mb-4 font-semibold text-xl tracking-tight">1. Grundlegende Prinzipien der Schließanlagen-Architektur</h3>
          <p>
            Das Fundament jeder Schließanlage ist die hierarchische oder funktionale Strukturierung von Zugangsberechtigungen. Jeder Zylinder und jeder Schlüssel wird zu einem integralen Bestandteil eines übergreifenden Sicherheitskonzepts. Dabei spielen zwei wesentliche Konzepte eine zentrale Rolle: die <strong>Schließungsart</strong> und die <strong>Gruppenbildung</strong>.
          </p>
          <p>
            Die Schließungsart bestimmt, wie Zylinder auf Schlüssel reagieren. Bei einer Einzelschließung öffnet ein Schlüssel genau einen Zylinder. Bei einer Gleichschließung öffnet ein Schlüssel mehrere Zylinder gleicher Bauart. Die eigentliche Komplexität entsteht jedoch erst bei übergeordneten Schließungen, bei denen ein Schlüssel unterschiedliche Zylinder öffnen kann. Hier kommt die Gruppenbildung ins Spiel, die es ermöglicht, Benutzer mit ähnlichen Berechtigungsprofilen zu logischen Einheiten zusammenzufassen.
          </p>
          <p>
            Ein weiteres wichtiges Prinzip ist die <strong>Erweiterbarkeit</strong>. Gebäude und Organisationen verändern sich im Laufe der Zeit, und eine Schließanlage muss in der Lage sein, sich diesen Veränderungen anzupassen. Eine vorausschauende Planung berücksichtigt daher von Anfang an Reservekapazitäten für zukünftige Erweiterungen, ohne dass die Sicherheit oder die logische Struktur des Gesamtsystems beeinträchtigt wird.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] mt-8 mb-4 font-semibold text-xl tracking-tight">2. Systemarchitekturen im Detail</h3>
          <p>
            Mechanische Schließanlagen lassen sich in verschiedene grundlegende Architekturen unterteilen, die jeweils spezifische Vor- und Nachteile aufweisen und für unterschiedliche Anwendungsszenarien optimiert sind. Die Wahl der richtigen Architektur ist eine der wichtigsten Entscheidungen im Planungsprozess.
          </p>

          <h4 className="text-[oklch(0.16_0.02_260)] mt-6 mb-3 font-medium text-lg">2.1 Zentralschlossanlage (Z-Anlage)</h4>
          <p>
            Die Zentralschlossanlage zeichnet sich durch ein sternförmiges Berechtigungskonzept aus. Im Mittelpunkt stehen ein oder mehrere Zentralschließzylinder (z.B. Hauseingangstür, Kellereingang, Fahrradraum), die von allen Nutzern der Anlage aufgeschlossen werden können. Jeder Nutzer verfügt jedoch über einen individuellen Schlüssel, der neben den zentralen Zylindern nur seinen persönlichen Bereich (z.B. Wohnungstür, Kellerabteil) öffnet.
          </p>
          <p>
            Diese Architektur ist typisch für Mehrfamilienhäuser und Wohnanlagen. Sie bietet ein hohes Maß an Komfort für die Bewohner, da diese nur einen einzigen Schlüssel benötigen, um alle für sie relevanten Türen zu öffnen. Gleichzeitig wird die Privatsphäre der einzelnen Nutzer gewahrt. Die Planung einer Z-Anlage erfordert eine sorgfältige Definition der zentralen und der individuellen Schließbereiche.
          </p>

          <h4 className="text-[oklch(0.16_0.02_260)] mt-6 mb-3 font-medium text-lg">2.2 Hauptschlüsselanlage (HS-Anlage)</h4>
          <p>
            Die Hauptschlüsselanlage basiert auf einer streng hierarchischen Struktur. An der Spitze der Hierarchie steht der Hauptschlüssel, der als übergeordneter Schlüssel konzipiert ist und sämtliche Schließzylinder innerhalb der gesamten Anlage sperrt. Darunter befinden sich die Einzelschlüssel, die jeweils nur für einen ganz spezifischen, ihnen zugeordneten Zylinder berechtigt sind.
          </p>
          <p>
            Diese Architektur kommt häufig in kleineren bis mittelgroßen Gewerbebetrieben, Schulen oder Arztpraxen zum Einsatz. Der Inhaber oder der Hausmeister erhält den Hauptschlüssel und hat somit jederzeit Zugang zu allen Räumlichkeiten. Die Mitarbeiter oder Lehrkräfte erhalten hingegen Einzelschlüssel, die ihnen nur den Zugang zu ihren jeweiligen Arbeitsbereichen oder Büros gewähren. Die klare hierarchische Struktur erleichtert die Verwaltung der Zugangsrechte erheblich.
          </p>

          <h4 className="text-[oklch(0.16_0.02_260)] mt-6 mb-3 font-medium text-lg">2.3 Generalhauptschlüsselanlage (GHS-Anlage)</h4>
          <p>
            Die Generalhauptschlüsselanlage ist die komplexeste und flexibelste Architektur für mechanische Schließsysteme. Sie kombiniert Elemente der Z- und der HS-Anlage und fügt weitere hierarchische Ebenen hinzu. An der Spitze steht der Generalhauptschlüssel (GHS), der alle Zylinder der Anlage sperrt. Darunter sind mehrere Hauptgruppen angeordnet, die jeweils von einem Hauptgruppenschlüssel (HGS) bedient werden. Diese Hauptgruppen können wiederum in Untergruppen mit eigenen Gruppenschlüsseln (GS) unterteilt sein. Auf der untersten Ebene befinden sich schließlich die Einzelschlüssel.
          </p>
          <p>
            GHS-Anlagen sind für große, komplexe Gebäude oder Liegenschaften wie Krankenhäuser, Universitäten oder große Industrieanlagen konzipiert. Sie ermöglichen eine fein granulierte und hochgradig differenzierte Vergabe von Zugangsrechten, die exakt auf die Organisationsstruktur des jeweiligen Nutzers zugeschnitten ist. Die Planung einer GHS-Anlage ist eine anspruchsvolle Aufgabe, die ein tiefes Verständnis der organisatorischen Abläufe und eine präzise Dokumentation aller Berechtigungen erfordert. Die Erstellung eines detaillierten Schließplans ist hierbei unerlässlich.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] mt-8 mb-4 font-semibold text-xl tracking-tight">3. Methodik der Schließplan-Erstellung</h3>
          <p>
            Die Erstellung eines Schließplans ist das Herzstück der Anlagenplanung. Der Schließplan ist eine Matrix, die alle Türen (Zylinder) und alle Nutzer (Schlüssel) einer Anlage erfasst und deren Beziehungen zueinander definiert. Ein sorgfältig erstellter Schließplan ist die Voraussetzung für eine fehlerfreie Fertigung und eine reibungslose Inbetriebnahme der Anlage.
          </p>
          <p>
            Der Prozess der Schließplan-Erstellung lässt sich in mehrere Phasen unterteilen:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Bestandsaufnahme:</strong> Erfassung aller relevanten Türen, Tore und sonstigen Schließstellen. Dabei müssen auch Details wie Türblattstärke, Dornmaß und gewünschte Zylinderart (z.B. Doppelzylinder, Halbzylinder, Knaufzylinder) dokumentiert werden.</li>
            <li><strong>Nutzeranalyse:</strong> Identifikation aller Personen oder Personengruppen, die Zugang zu bestimmten Bereichen benötigen. Definition der jeweiligen Berechtigungsprofile.</li>
            <li><strong>Matrix-Erstellung:</strong> Zuordnung der Berechtigungsprofile zu den erfassten Schließstellen. Hierbei wird festgelegt, welcher Schlüssel welchen Zylinder öffnen darf.</li>
            <li><strong>Optimierung und Reserveplanung:</strong> Überprüfung der Matrix auf Konsistenz und Plausibilität. Einplanung von Reservezylindern und -schlüsseln für zukünftige Erweiterungen.</li>
            <li><strong>Freigabe:</strong> Überprüfung und formelle Freigabe des Schließplans durch den Auftraggeber.</li>
          </ul>

          <h3 className="text-[oklch(0.16_0.02_260)] mt-8 mb-4 font-semibold text-xl tracking-tight">4. Sicherheitsaspekte und Profilsysteme</h3>
          <p>
            Die Sicherheit einer mechanischen Schließanlage hängt maßgeblich von den verwendeten Zylinder- und Schlüsselprofilen ab. Hochwertige Schließanlagen nutzen in der Regel geschützte Profilsysteme, die einen effektiven Schutz vor unberechtigten Schlüsselkopien und Manipulationen bieten.
          </p>
          <p>
            Ein zentrales Element ist der <strong>Marken- und Patentschutz</strong>. Geschützte Profile dürfen nur vom Hersteller oder von autorisierten Fachpartnern kopiert werden. Die Anfertigung eines Nachschlüssels erfordert in der Regel die Vorlage einer Sicherungskarte, die die Legitimation des Auftraggebers bestätigt.
          </p>
          <p>
            Darüber hinaus verfügen moderne Schließzylinder über verschiedene technische Sicherheitsmerkmale, wie z.B. <strong>Bohrschutz</strong> (gehärtete Stahlstifte im Zylindergehäuse und -kern erschweren das Aufbohren), <strong>Ziehschutz</strong> (spezielle Vorrichtungen verhindern das Herausziehen des Zylinderkerns) und <strong>Abtastschutz</strong> (komplexe Profilformen und zusätzliche Sperrelemente erschweren das zerstörungsfreie Öffnen mit Spezialwerkzeugen).
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] mt-8 mb-4 font-semibold text-xl tracking-tight">5. Integration und hybride Systeme</h3>
          <p>
            In zunehmendem Maße werden mechanische Schließanlagen mit elektronischen Zutrittskontrollsystemen kombiniert. Diese hybriden Systeme bieten das Beste aus beiden Welten: die Robustheit und Zuverlässigkeit der Mechanik und die Flexibilität und Intelligenz der Elektronik.
          </p>
          <p>
            Bei einer hybriden Anlage werden sensible Bereiche (z.B. Serverräume, Entwicklungslabore) mit elektronischen Zylindern oder Wandlesern ausgestattet, während weniger kritische Bereiche weiterhin mechanisch gesichert bleiben. Die elektronischen Komponenten ermöglichen eine zeitliche Befristung von Zugangsrechten, die Protokollierung von Zutrittsereignissen und das schnelle Sperren verlorener Medien. Moderne Mechatronik-Schlüssel integrieren sowohl das mechanische Profil als auch einen RFID-Chip, sodass der Nutzer nur noch ein einziges Medium für beide Systemwelten benötigt.
          </p>

          <h3 className="text-[oklch(0.16_0.02_260)] mt-8 mb-4 font-semibold text-xl tracking-tight">6. Detaillierter Fach-FAQ: Mechanische Schließanlagen</h3>
          <div className="space-y-6 mt-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Warum ist ein geschütztes Profilsystem zwingend erforderlich?</h4>
              <p className="mt-2">Ein geschütztes Profilsystem, das durch Patente und Markenrechte abgesichert ist, garantiert, dass Schlüsselrohlinge nicht im freien Handel erhältlich sind. Nachschlüssel dürfen ausschließlich gegen Vorlage der Sicherungskarte gefertigt werden. Dies verhindert illegale Kopien und ist essenziell für die Integrität des Schließplans.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Was passiert bei Schlüsselverlust in einer GHS-Anlage?</h4>
              <p className="mt-2">Bei mechanischen Systemen ist ein Schlüsselverlust kritisch, insbesondere wenn es sich um einen Haupt- oder Generalhauptschlüssel handelt. In diesem Fall muss oft die gesamte Anlage oder zumindest der betroffene Schließbereich ausgetauscht werden, da die Sicherheit kompromittiert ist. Hier empfiehlt sich zunehmend eine mechatronische Lösung.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Können mechanische Anlagen nachträglich erweitert werden?</h4>
              <p className="mt-2">Ja, aber nur im Rahmen der bei der Initialplanung vorgesehenen Reservekapazitäten. Jede Schließanlage hat eine definierte &quot;Mathematik&quot;. Wurden bestimmte Hierarchieebenen nicht mit Reserven geplant, ist eine Erweiterung oft nicht mehr möglich, ohne die Schließlogik zu brechen.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Wie lange ist die Lebensdauer einer mechanischen Schließanlage?</h4>
              <p className="mt-2">Bei regelmäßiger Wartung (z.B. Schmierung der Zylinder mit speziellem Pflegespray) und durchschnittlicher Nutzung können hochwertige mechanische Anlagen 15 bis 20 Jahre zuverlässig funktionieren. Der limitierende Faktor ist oft nicht der Verschleiß, sondern das Auslaufen des Patentschutzes für das verwendete Profil.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[oklch(0.16_0.02_260)]">Welche Anforderungen stellt der Brandschutz an Schließanlagen?</h4>
              <p className="mt-2">In Flucht- und Rettungswegen gelten strenge Normen (z.B. DIN EN 179 und DIN EN 1125). Türen müssen sich in Paniksituationen von innen immer ohne Schlüssel öffnen lassen. Hier müssen spezielle Panikschlösser und ggf. Freilaufzylinder in die Schließanlage integriert werden, um die rechtlichen Vorgaben zu erfüllen.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="planer" tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Interaktiv"
              title="Budget & Komplexität simulieren"
              lead="Nutzen Sie unseren Schließanlagen-Planer, um ein erstes Gefühl für die Kostenstruktur Ihrer geplanten Anlage zu bekommen."
            />
            <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed text-sm">
              Dieser Kalkulator dient als erste Orientierungshilfe. Die tatsächlichen Kosten hängen von vielen weiteren Faktoren ab, wie z.B. den genauen Zylinderlängen, eventuellen Sonderfunktionen (z.B. Gefahreneinrichtung, Bohrschutz) und dem gewählten Profilsystem. Für ein verbindliches Angebot erfassen Sie Ihr Projekt bitte vollständig in unserem Konfigurator.
            </p>
          </div>
          <div className="mt-8 lg:mt-0">
            <SchliessanlagenPlaner />
          </div>
        </div>
      </Section>


      {/* Kleine Vorhaben */}
      <Section tone="muted" tight>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
              Wenige Türen, ein Schlüssel für alles?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Dann brauchen Sie keinen Schließplan. Gleichschließende Zylinder stellen Sie selbst
              zusammen — Bauform, Maße und Anzahl der gemeinsamen Schlüssel — und bestellen direkt.
              Der Projektkonfigurator lohnt sich erst, wenn unterschiedliche Personen
              unterschiedliche Türen öffnen sollen.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/gleichschliessende-zylinder">
                Zu den gleichschließenden Zylindern
              </ButtonLink>
              <ButtonLink href="/schliessanlagen/konfigurator" variant="outline">
                Trotzdem Projekt erfassen
              </ButtonLink>
            </div>
          </div>

          <Alert tone="info" title="Woran Sie den Unterschied erkennen">
            Sobald jemand eine Tür nicht öffnen können soll — etwa ein Mieter die Wohnung nebenan
            oder eine Aushilfe das Büro der Leitung — reicht eine Gleichschließung nicht mehr aus.
            Dann planen wir eine Anlage mit Ebenen.
          </Alert>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading eyebrow="Fragen" title="Häufige Fragen zu Schließanlagen" />
        <div className="mt-8">
          <Accordion items={faq} />
        </div>
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight>
        <h2 className="text-xl font-bold text-foreground">Passend dazu</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/schliessanlagen/konfigurator',
              label: 'Projektkonfigurator',
              body: 'Zehn Frageblöcke zu Objekt, Nutzern, Türen und Berechtigungen.',
            },
            {
              href: '/gleichschliessende-zylinder',
              label: 'Gleichschließende Zylinder',
              body: 'Für kleine Vorhaben ohne Berechtigungsstufen.',
            },
            {
              href: '/elektronische-zutrittsloesungen',
              label: 'Elektronische Zutrittslösungen',
              body: 'Wenn Rechte änderbar sein sollen, ohne Zylinder zu tauschen.',
            },
            {
              href: '/tuer-und-schliesstechnik',
              label: 'Tür- und Schließtechnik',
              body: 'Zylinder, Schlösser und Beschläge rund um die Tür.',
            },
            {
              href: '/ratgeber/welche-schliessanlage-passt',
              label: 'Welche Anlage passt?',
              body: 'Entscheidungshilfe im Ratgeber.',
            },
            {
              href: '/service-und-termin/kontakt',
              label: 'Kontakt',
              body: 'Wenn Sie vor der Erfassung eine Frage klären möchten.',
            },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1.5 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                  {link.body}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Ansehen
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
