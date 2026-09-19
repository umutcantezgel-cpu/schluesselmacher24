import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users, Lock, Cpu } from 'lucide-react';

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
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';

const ROUTE = 'schliessanlagen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Mechanische und Elektronische Schließanlagen planen',
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
    summary: 'Die Matrix, in der steht, welcher Schlüssel bzw. Transponder welche Tür öffnet.',
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
    summary: 'Der kryptografische oder physische Nachweis zur Nachbestellung von Schlüsseln.',
    hint: {
      title: 'Sicherungskarte',
      body:
        'Bei vielen mechanischen Anlagen gehört eine Karte oder ein Nachweisdokument dazu. Nur wer diesen '
        + 'Nachweis vorlegt, kann weitere Schlüssel bestellen. Bei elektronischen Systemen wird dies oft '
        + 'durch eine Admin-Software und Token-Verifizierung ersetzt.',
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
  {
    icon: Cpu,
    title: 'Enterprise & Industrie',
    body:
      'Hochkomplexe Strukturen mit Hunderten Nutzern, temporären Dienstleistern und '
      + 'dynamischen Berechtigungen. Hier sind elektronische Systeme zwingend.',
    href: '/elektronische-zutrittsloesungen',
    linkLabel: 'Enterprise Solutions ansehen',
  },
];

/** Fällt nur ein, solange in der Datenschicht keine Fragen gepflegt sind. */
const FALLBACK_FAQ = [
  {
    question: 'Was ist der Unterschied zwischen einer Gleichschließung und einer Schließanlage?',
    answer:
      'Bei einer Gleichschließung öffnet jeder Schlüssel exakt jede Tür, da alle Zylinder identisch gestiftet sind. Eine Schließanlage unterscheidet '
      + 'dagegen präzise, wer welche Tür öffnen darf, und bildet dafür hierarchische Ebenen ab — vom einfachen Nutzerschlüssel bis '
      + 'zum Generalhauptschlüssel, der als Master fungiert.'
  },
  {
    question: 'Wann sollte ich mich für eine elektronische Anlage anstelle einer mechanischen entscheiden?',
    answer:
      'Mechanische Anlagen sind robust und oft in der Anschaffung günstiger. Sobald jedoch Schlüsselverluste ein signifikantes Sicherheitsrisiko oder hohe Kosten (durch den nötigen Austausch mehrerer Zylinder) verursachen, ist eine elektronische Anlage überlegen. Bei elektronischen Systemen können Sie einen verlorenen Transponder mit einem Klick sperren. Als Faustregel gilt: Ab ca. 150 Nutzern oder hoher Fluktuation rechnet sich die Elektronik schnell.'
  },
  {
    question: 'Muss ich die Abkürzungen Z, HS und GHS kennen, bevor ich anfrage?',
    answer:
      'Nein, dieses Fachwissen ist nicht erforderlich. Im Projektkonfigurator beschreiben Sie lediglich Ihr Objekt und definieren, wer welche Tür öffnen soll. Daraus '
      + 'leiten wir als Experten einen detaillierten Vorschlag für das architektonisch passende System ab und besprechen diesen mit Ihnen.'
  },
  {
    question: 'Kann ich eine mechanische Anlage später erweitern?',
    answer:
      'Das entscheidet sich zwingend bereits bei der initialen Planung. Wenn im Schließplan ausreichende Reserven (Permutationen) für weitere Türen und '
      + 'Nutzer mathematisch vorgesehen sind, lassen sich später Schließstellen nahtlos ergänzen. Kommunizieren Sie deshalb '
      + 'im Konfigurator unbedingt Ihre voraussichtlichen Ausbaupläne für die nächsten Jahre.'
  },
  {
    question: 'Wie hoch sind die Sicherheitsstandards gegen Manipulation (z.B. Lockpicking)?',
    answer:
      'Moderne Schließanlagen verfügen über mehrdimensionale Sicherheitsprofile. Dazu gehören ein parazentrisches Schlüsselprofil, gehärtete Stahlstifte als Anbohrschutz und oft magnetische oder bewegliche Elemente im Schlüssel, die illegale 3D-Kopien (sogenannten 3D-Druck-Schlüsseln) und Picking-Werkzeugen massiven Widerstand leisten. Unsere Systeme erfüllen höchste VdS-Klassen.'
  },
  {
    question: 'Ich habe bereits eine bestehende Anlage. Können Sie diese ergänzen?',
    answer:
      'Die Erweiterung hängt stark vom vorhandenen System, dem Alter und dem Vorliegen des Nachweises (Sicherungskarte) ab. Geben Sie im Konfigurator Hersteller, '
      + 'System und die Sicherungskarte an. Laden Sie idealerweise vorhandene Pläne oder Detailfotos hoch. Wir analysieren dann die Kompatibilität und zeigen Lösungswege auf.'
  },
  {
    question: 'Wie setzt sich der Preis einer professionellen Anlage zusammen?',
    answer:
      'Eine Schließanlage ist immer eine individuelle Sonderanfertigung nach Ihrem Schließplan. Der Preis und der fertigungstechnische Aufwand hängen primär von der '
      + 'Anzahl der Schließstellen (Zylinder), der benötigten Schlüssel, dem gewählten Sicherheitsstandard (z.B. VdS-Klasse) und der Komplexität der Hierarchieebenen ab. Daher nennen wir erst nach '
      + 'der präzisen Erfassung einen verbindlichen Betrag.'
  },
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchliessanlagenPage({ params, searchParams }: Props) {
  // Asynchronous parameter resolution required by Next.js 16+
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <PageHeader
        eyebrow="Mechanische und Elektronische Schließanlagen"
        title={page?.headline ?? 'Architektur der Sicherheit: Schließanlagen'}
        lead={page?.subline ?? 'Fundierte Planung und präzise Implementierung von der Gleichschließung bis zur hochkomplexen Generalhauptschlüsselanlage. Für maximale Sicherheit und Kosteneffizienz.'}
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

      {/* Einstieg und architektonische Grundlagen */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              Die Matrix der Berechtigungen
            </h2>
            <p className="text-[15px] leading-relaxed text-foreground-muted md:text-base">
              Eine professionelle Schließanlage ist weit mehr als eine Ansammlung von Zylindern. Es ist die physische Manifestation Ihrer organisatorischen Sicherheitsrichtlinien. Sie regelt mit absoluter Zuverlässigkeit, wer wann und wo Zutritt erhält. Wir konzipieren und strukturieren diese Systeme mit architektonischer Präzision – von der Anforderungsanalyse bis zum fertigen Schließplan.
            </p>

            <p className="text-[15px] leading-relaxed text-foreground-muted">
              Der Implementierungsprozess folgt einer strikten Methodik: In der Initialphase erfassen wir die Topologie Ihres Objekts, die Nutzergruppen und die spezifischen Türen. Daraus synthetisieren wir einen Entwurf des Schließplans, der die mathematischen Permutationen der Berechtigungsebenen abbildet. Dieser Entwurf wird iterativ mit Ihnen verfeinert. Erst nach der finalen Freigabe erfolgt die hochpräzise Fertigung der Zylinder und Schlüssel.
            </p>

            <div className="rounded-lg border border-border bg-surface-muted px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {process.label}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
            </div>

            <p className="text-[15px] leading-relaxed text-foreground-muted">
              Bei der Konzeption berücksichtigen wir zudem zukünftige Skalierbarkeit. Durch vorausschauende Einplanung von Schließungsreserven gewährleisten wir, dass Ihre Anlage auch bei organisatorischem Wachstum oder baulichen Erweiterungen funktional und sicher bleibt, ohne dass ein vollständiger Austausch erforderlich wird.
            </p>

            <ul className="space-y-3 pt-2">
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

          <div className="space-y-6">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: Schließplan auf dem Tisch neben sortierten Profilzylindern',
                ratio: '4/3',
                note: 'Echtes Foto aus dem eigenen Betrieb. Kein Stockfoto.',
              }}
            />
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-sm">
               <h3 className="flex items-center gap-2 font-semibold text-[oklch(0.16_0.02_260)]">
                  <Lock size={18} className="text-primary" />
                  Sicherheit auf höchstem Niveau
               </h3>
               <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                  Unsere mechanischen High-End-Anlagen bieten massiven Schutz gegen gängige Einbruchsmethoden. Durch komplexe Stiftreihen, parazentrische Profile und integrierten Bohr- sowie Ziehschutz gewährleisten wir ein Sicherheitsniveau, das den strengsten industriellen und versicherungstechnischen Standards entspricht.
               </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Interaktiver Kalkulator Sektion */}
      <Section id="roi-kalkulator" tone="muted">
        <SectionHeading
          eyebrow="Wirtschaftlichkeit"
          title="Elektronik oder Mechanik? Der ROI-Check."
          lead="Ab einer bestimmten Nutzerzahl und Fluktuationsrate kippt die Wirtschaftlichkeit zugunsten elektronischer Systeme, da die Folgekosten bei Schlüsselverlusten (Zylindertausch) bei mechanischen Anlagen exponentiell steigen."
        />
        <div className="mt-12">
          <EnterpriseRoiCalculator />
        </div>
      </Section>

      {/* Die fünf Systeme */}
      <Section id="systeme">
        <SectionHeading
          eyebrow="System-Architekturen"
          title="Die fünf hierarchischen Systeme"
          lead="Wir übersetzen komplexe Berechtigungsstrukturen in klare, nachvollziehbare Systeme. Die vollständige Bezeichnung steht immer zuerst, die branchenübliche Abkürzung folgt in Klammern."
        />
        <div className="mt-8">
          <SystemErklaerung />
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold text-foreground">Die Architektur-Matrix: Systeme im Direktvergleich</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
            Die Wahl der richtigen Architektur ist eine strategische Entscheidung. Die nachfolgende Matrix stellt die strukturellen Kernunterschiede gegenüber. Im Rahmen des Konfigurator-Workflows analysieren wir Ihre spezifischen Anforderungen und leiten daraus eine fundierte Empfehlung ab.
          </p>
          <div className="mt-6">
            <SystemVergleich />
          </div>
        </div>
      </Section>

      {/* Für wen */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Zielgruppen & Anwendungsfälle"
          title="Spezifische Lösungen für komplexe Anforderungen"
          lead="Die strukturelle Zuordnung ist ein erster Anhaltspunkt für die Planung. Die finale Architektur richtet sich stets kompromisslos nach der Topologie Ihrer Türen und den definierten Zuständigkeiten."
        />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Card className="flex h-full flex-col transition-shadow hover:shadow-md border-[oklch(0.89_0.008_260/0.55)] bg-surface">
                  <CardBody className="flex flex-1 flex-col">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260)/0.1] text-primary">
                      <Icon size={22} aria-hidden />
                    </span>
                    <h3 className="mt-5 text-[16px] font-semibold text-foreground tracking-tight">{item.title}</h3>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                      {item.body}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-[oklch(0.48_0.24_260)] transition-colors"
                    >
                      {item.linkLabel}
                      <ArrowRight size={16} aria-hidden />
                    </Link>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Kleine Vorhaben */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl tracking-tight">
              Kompakte Sicherheit: Wenige Türen, ein Zentralschlüssel?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Für überschaubare Projekte ohne differenzierte Berechtigungsebenen ist die Erstellung eines komplexen Schließplans nicht erforderlich. Gleichschließende Zylinder können Sie modular und eigenständig zusammenstellen — definieren Sie Bauform, präzise Zylindermaße sowie die Anzahl der gemeinsamen Schlüssel — und platzieren Sie die Bestellung direkt.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Die Nutzung des umfassenden Projektkonfigurators ist erst dann indiziert, wenn eine granulare Rechtevergabe notwendig wird, sprich: wenn unterschiedliche Personen nur Zugang zu spezifischen, für sie autorisierten Bereichen erhalten sollen.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/gleichschliessende-zylinder" size="lg">
                Zu den gleichschließenden Zylindern
              </ButtonLink>
              <ButtonLink href="/schliessanlagen/konfigurator" variant="outline" size="lg">
                Komplexes Projekt erfassen
              </ButtonLink>
            </div>
          </div>

          <Alert tone="info" title="Die kritische Unterscheidung: Gleichschließung vs. Anlage">
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
               Sobald die Anforderung besteht, dass eine Person bestimmte Bereiche <strong>nicht</strong> betreten darf — beispielsweise ein externer Dienstleister, der nur Zugang zum Technikraum, nicht aber zu den Büros erhalten soll —, stößt die Gleichschließung an ihre Grenzen. Ab diesem Punkt konzipieren wir zwingend eine dedizierte Schließanlage mit definierten Hierarchieebenen.
            </p>
          </Alert>
        </div>
      </Section>

      {/* Fragen */}
      <Section tone="muted">
        <SectionHeading eyebrow="Wissensdatenbank" title="Expertenantworten zu Schließanlagen" lead="Wir beantworten detailliert die häufigsten technischen und organisatorischen Fragen rund um die Planung, Sicherheit und Erweiterbarkeit." />
        <div className="mt-10">
          <Accordion items={faq} />
        </div>
      </Section>

      {/* Weiterführend */}
      <Section tight>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Systemintegration & Ergänzende Services</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/schliessanlagen/konfigurator',
              label: 'Projektkonfigurator (Workflow)',
              body: 'Geführter Prozess durch zehn analytische Frageblöcke zur exakten Definition von Objekt, Topologie, Nutzern und Berechtigungsstruktur.',
            },
            {
              href: '/gleichschliessende-zylinder',
              label: 'Gleichschließende Zylinder (Modul)',
              body: 'Die effiziente Lösung für kompakte Vorhaben ohne die Notwendigkeit komplexer Berechtigungsstufen.',
            },
            {
              href: '/elektronische-zutrittsloesungen',
              label: 'Elektronische Zutrittskontrolle',
              body: 'Maximale Flexibilität durch digitale Berechtigungsvergabe. Ideal bei hoher Fluktuation und dem Bedarf an zeitlich begrenztem Zutritt.',
            },
            {
              href: '/tuer-und-schliesstechnik',
              label: 'Physische Tür- und Schließtechnik',
              body: 'Hochsicherheitszylinder, einbruchhemmende Schlösser und massive Schutzbeschläge für die ganzheitliche Absicherung der Tür.',
            },
            {
              href: '/ratgeber/welche-schliessanlage-passt',
              label: 'Ratgeber: Architektur-Wahl',
              body: 'Ein analytischer Leitfaden zur methodischen Entscheidungsfindung zwischen den verschiedenen Schließanlagensystemen.',
            },
            {
              href: '/service-und-termin/kontakt',
              label: 'Expertenberatung',
              body: 'Kontaktieren Sie unsere Spezialisten zur Vorabklärung komplexer technischer Fragestellungen vor der finalen Konfiguration.',
            },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-surface p-6 transition-all hover:border-[oklch(0.52_0.24_260)/0.5] hover:shadow-md"
              >
                <span className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                  {link.body}
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
                  Details ansehen
                  <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
