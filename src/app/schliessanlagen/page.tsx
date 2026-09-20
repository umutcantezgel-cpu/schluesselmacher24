import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { EnterpriseROICalculator } from '@/components/calculator/enterprise-roi-calculator';
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


interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchliessanlagenPage({ params, searchParams }: Props) {
  // Access params and searchParams to conform to Next.js 16 async requirement,
  // utilizing void to prevent unused variable linting errors.
  void (await params);
  void (await searchParams);

  const page = await getPageContent(ROUTE);

  // Extended FAQ directly overriding the fallback to ensure >800 words and deep content
  const extendedFaq = [
    {
      question: 'Muss ich die Abkürzungen Z, HS und GHS kennen, bevor ich anfrage?',
      answer: 'Nein. Im Konfigurator beschreiben Sie Ihr Objekt und wer welche Tür öffnen soll. Daraus leiten wir einen fundierten Vorschlag für das passende System ab und besprechen ihn mit Ihnen in einem persönlichen Termin. Wir übersetzen Ihre Anforderungen in die technische Struktur.'
    },
    {
      question: 'Was ist der Unterschied zwischen einer Gleichschließung und einer Schließanlage?',
      answer: 'Bei einer Gleichschließung öffnet jeder Schlüssel jede Tür – es gibt keine Hierarchie. Eine Schließanlage unterscheidet dagegen präzise, wer welche Tür öffnen darf, und bildet dafür Ebenen ab. Vom einfachen Nutzerschlüssel für eine bestimmte Bürotür bis zum Generalhauptschlüssel, der Zugriff auf die gesamte Liegenschaft gewährt. Dies erfordert eine detaillierte Projektierung per Schließplan.'
    },
    {
      question: 'Kann ich eine Anlage später erweitern (z.B. durch Anbau oder neue Mitarbeiter)?',
      answer: 'Ja, das entscheidet sich maßgeblich bei der initialen Planung. Wenn im Schließplan von Anfang an Reserven für weitere Türen und Nutzer vorgesehen sind, lassen sich später problemlos neue Schließstellen ergänzen. Sagen Sie uns deshalb im Konfigurator, was Sie in den nächsten 5 bis 10 Jahren vorhaben. Eine nachträgliche Erweiterung ohne geplante Reserven kann den kompletten Austausch der Anlage bedeuten.'
    },
    {
      question: 'Ich habe bereits eine Anlage im Einsatz. Können Sie diese ergänzen?',
      answer: 'Das hängt vom vorhandenen System, dem Hersteller und dem Nachweis ab. Geben Sie im Konfigurator Hersteller, System und die Sicherungskarte an, soweit Ihnen das bekannt ist. Ohne Sicherungskarte ist eine Erweiterung rechtlich und technisch meist ausgeschlossen. Laden Sie vorhandene Pläne oder Fotos hoch, dann prüfen wir machbare Wege.'
    },
    {
      question: 'Wie kommt der Preis für eine Schließanlage zustande?',
      answer: 'Eine mechanische Schließanlage wird hochindividuell nach Ihrem Schließplan gefertigt. Der Preis setzt sich zusammen aus der Anzahl der Zylinder (Schließstellen), der benötigten Schlüssel, der Komplexität der Hierarchieebenen (HS, GHS) und dem zugrundeliegenden Schließsystemprofil. Zudem fließt die Projektierungsleistung in die Kosten ein. Nutzen Sie unseren Enterprise ROI-Kalkulator für eine erste Schätzung.'
    },
    {
      question: 'Wie lange dauert die Planung und Fertigung?',
      answer: 'Nach der Erfassung im Konfigurator erstellen wir in der Regel innerhalb von 2-4 Werktagen einen Schließplan-Entwurf. Nach Ihrer Freigabe dauert die Fertigung ab Werk je nach Komplexität und Hersteller zwischen 2 und 6 Wochen. Wir koordinieren den exakten Zeitplan transparent mit Ihnen.'
    }
  ];

  const faq = page?.faq?.length ? page.faq : extendedFaq;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
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

            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die architektonische Methodik hinter einer professionellen Schließanlage basiert stets auf einer präzisen Bedarfsanalyse. Der Weg dorthin ist methodisch fundiert und immer derselbe: Sie erfassen systematisch Ihr Objekt, definieren Ihre Nutzergruppen und kartografieren Ihre Türen. Daraus extrapolieren wir einen logischen Schließplan, der die Zugriffsrechte mathematisch exakt abbildet. Dieser Plan wird in einem iterativen Prozess gemeinsam mit Ihnen validiert und verfeinert. Erst nach absoluter Klarheit und technischer Machbarkeitsprüfung geht die Anlage in die hochpräzise Fertigung. Diese methodische Strenge garantiert, dass die Anlage nicht nur heute funktioniert, sondern auch zukünftiges Wachstum abbilden kann.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Eine Schließanlage ist mehr als nur Metall – sie ist die physische Manifestation Ihrer Sicherheitsarchitektur und Organisationsstruktur. Sie schützt Werte, regelt Abläufe und definiert Verantwortlichkeiten. Daher behandeln wir jede Anlage als individuelles Ingenieursprojekt. Von der ersten Skizze über die Profilauswahl bis zur Schlüsselübergabe setzen wir auf höchste Standards in Beratung, Planung und Ausführung. Mechanische Systeme bieten dabei eine unübertroffene Langlebigkeit und Zuverlässigkeit, völlig unabhängig von Stromausfällen oder IT-Infrastrukturen.
            </p>

            <div className="mt-8 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] px-6 py-5 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)]">
                {process.label}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {process.hint} Wir nutzen strukturierte Erfassungsbögen, um keine sicherheitsrelevante Facette Ihres Gebäudes zu übersehen.
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

      {/* Enterprise Calculator Section */}
      <Section tight tone="muted">
        <div className="mb-12">
          <SectionHeading
            eyebrow="Investitionsplanung"
            title="Kosten und ROI frühzeitig kalkulieren"
            lead="Nutzen Sie unser interaktives Tool, um Budgets für Ihr Schließanlagen-Projekt zu schätzen und den administrativen Zeitgewinn (Return on Investment) transparent zu machen. Dies hilft Ihnen bei der internen Budgetfreigabe."
          />
        </div>
        <EnterpriseROICalculator />
      </Section>

      {/* Für wen */}
      <Section>
        <SectionHeading
          eyebrow="Architektur & Einsatzgebiete"
          title="Wer plant welche Anlage?"
          lead="Die Zuordnung ist ein architektonischer Anhaltspunkt, keine starre Festlegung. Entscheidend sind die Topologie Ihrer Gebäude und Ihre organisatorischen Zuständigkeiten."
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
