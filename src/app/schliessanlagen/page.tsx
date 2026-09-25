import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';
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
    question: 'Welches Schließsystem ist für einen kleinen Betrieb am besten geeignet?',
    answer: 'Für kleinere Betriebe empfehlen wir meist eine Hauptschlüsselanlage (HS-Anlage). Sie ermöglicht es der Geschäftsführung, alle Türen zu öffnen, während Mitarbeitende nur Zugang zu ihren spezifischen Bereichen erhalten. Dies bietet eine optimale Balance aus Sicherheit und Übersichtlichkeit.'
  },
  {
    question: 'Können bestehende mechanische Schließanlagen elektronisch aufgerüstet werden?',
    answer: 'Ja, das ist ein häufiger und sehr effizienter Weg. Wir können kritische Türen, wie Außeneingänge oder Serverräume, mit elektronischen Profilzylindern oder Beschlägen ausstatten. Diese lassen sich nahtlos in die Verwaltung Ihrer mechanischen Anlage integrieren, oft sogar mit hybriden Schlüsseln.'
  },
  {
    question: 'Wie lange dauert die Planung und Fertigung einer komplexen Schließanlage?',
    answer: 'Die Planungsphase dauert je nach Komplexität und Abstimmungsbedarf zwischen 1 und 3 Wochen. Nach Freigabe des Schließplans durch Sie, kalkulieren wir für die Fertigung im Werk weitere 3 bis 5 Wochen. Bei Express-Bedarf können bestimmte Systeme priorisiert werden.'
  },
  {
    question: 'Was passiert, wenn ein übergeordneter Hauptschlüssel verloren geht?',
    answer: 'Bei rein mechanischen Anlagen ohne Versicherung bedeutet der Verlust eines Generalhauptschlüssels oft den Austausch großer Teile der Anlage, um die Sicherheit wiederherzustellen. Bei elektronischen oder hybriden Systemen wird der verlorene Schlüssel (Transponder) einfach im System gesperrt, ohne physische Komponenten tauschen zu müssen.'
  },
  {
    question: 'Wie funktioniert der Nachweis der Schließberechtigung (Sicherungskarte)?',
    answer: 'Die Sicherungskarte ist das zentrale Legitimationsdokument. Nachschlüssel oder Ersatzzylinder können ausschließlich gegen Vorlage (im Original oder als verifizierte Kopie bei registrierten Partnern) bestellt werden. Dies schützt Sie effektiv vor unautorisierten Schlüsselkopien durch Dritte.'
  },
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
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchliessanlagenPage({ params, searchParams }: Props) {
  await params;
  await searchParams;
  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
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

            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Der Weg dorthin ist immer derselbe: Sie erfassen Ihr Objekt, Ihre Nutzer und Ihre
              Türen. Daraus entsteht ein Schließplan, den wir gemeinsam mit Ihnen abstimmen. Erst
              danach wird gefertigt.
            </p>
            <div className="mt-8 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <h4 className="text-md font-bold text-[oklch(0.16_0.02_260)] mb-4">Leistungsstufen im Überblick</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="font-semibold w-32 shrink-0">BASIC:</span>
                  <span className="text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Fundamentale mechanische Absicherung, ideal für kleine gewerbliche oder private Projekte. Fokus auf Kernfunktionalität und Langlebigkeit mit Standard-Profilzylindern.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold w-32 shrink-0">STANDARD:</span>
                  <span className="text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Erweiterte Schließhierarchien, für KMUs und mittelgroße Einrichtungen. Integration erster Kopierschutzmaßnahmen und modularer Zylinder für Anpassungsfähigkeit.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold w-32 shrink-0">ENTERPRISE:</span>
                  <span className="text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Hochkomplexe Generalhauptschlüsselanlagen für Filialisten oder weitläufige Campusse. Kombination aus höchster mechanischer Präzision (3D-Schlüsselprofile) und nahtloser Integration elektronischer Ident-Systeme (Smart-Key) für Echtzeit-Management.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h4 className="text-md font-bold text-[oklch(0.16_0.02_260)] mb-4">Erweiterte Matrix: Mechanik vs. Elektronik</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px] border-collapse">
                  <thead>
                    <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                      <th className="py-2 px-3 font-semibold text-[oklch(0.16_0.02_260)]">Feature</th>
                      <th className="py-2 px-3 font-semibold text-[oklch(0.16_0.02_260)]">Rein Mechanisch</th>
                      <th className="py-2 px-3 font-semibold text-[oklch(0.16_0.02_260)]">Hybride Anlage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                      <td className="py-2 px-3 font-medium">Rechteänderung</td>
                      <td className="py-2 px-3 text-[oklch(0.32_0.02_260)]">Zylindertausch nötig</td>
                      <td className="py-2 px-3 text-[oklch(0.32_0.02_260)]">Digital in Sekunden</td>
                    </tr>
                    <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                      <td className="py-2 px-3 font-medium">Investitionskosten</td>
                      <td className="py-2 px-3 text-[oklch(0.32_0.02_260)]">Wirtschaftlich (Basis)</td>
                      <td className="py-2 px-3 text-[oklch(0.32_0.02_260)]">Mittel bis Hoch (skalierbar)</td>
                    </tr>
                    <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                      <td className="py-2 px-3 font-medium">Wartungsaufwand</td>
                      <td className="py-2 px-3 text-[oklch(0.32_0.02_260)]">Gering (jährlich ölen)</td>
                      <td className="py-2 px-3 text-[oklch(0.32_0.02_260)]">Mittel (Batteriewechsel)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="mt-8 text-lg font-semibold text-[oklch(0.16_0.02_260)]">Architektonische Methodik & Planung</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die Planung einer komplexen Schließanlage erfordert eine durchdachte architektonische Methodik. Wir betrachten Gebäude nicht nur als Ansammlung von Türen, sondern analysieren Nutzerströme, Sicherheitszonen und zukünftige Expansionsmöglichkeiten. Unsere Methodik basiert auf einem dreistufigen Prozess: Bedarfsanalyse, Systemdesign und Implementierung.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Jedes Systemdesign wird in Form einer detaillierten Schließmatrix abgebildet, die klare Berechtigungsstrukturen visuell darstellt. Dies ermöglicht es Unternehmen, sowohl interne Richtlinien als auch gesetzliche Vorgaben (z.B. Brandschutz, Fluchtwege) effizient und nachvollziehbar umzusetzen. Wir verwenden fortschrittliche Planungssoftware, um Konflikte im Vorfeld zu erkennen und die Skalierbarkeit für kommende Jahre sicherzustellen.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Zusätzlich berücksichtigen wir hybride Ansätze, bei denen mechanische Systeme nahtlos mit elektronischer Zutrittskontrolle kombiniert werden. Dies bietet maximale Flexibilität: Hochsensible Bereiche erhalten elektronische Zylinder mit protokollierbaren Zutrittsrechten, während Standardtüren wirtschaftlich mit mechanischen Zylindern der gleichen Schließanlage ausgestattet werden.
            </p>

            <EnterpriseRoiCalculator />

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
