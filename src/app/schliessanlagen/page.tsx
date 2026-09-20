import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users, ShieldCheck } from 'lucide-react';

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
    icon: Building2,
    title: 'Mehrfamilienhäuser',
    body: 'Ein Zentralschloss (z. B. Haustür) wird von allen Mietern geschlossen, die Wohnungen nur vom jeweiligen Mieter.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Zentralschlossanlage planen',
  },
  {
    icon: Layers,
    title: 'Gewerbe & Büro',
    body: 'Abteilungsleiter schließen ihre eigenen Bereiche, die Geschäftsführung hat einen Schlüssel für alle Türen im Gebäude.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Hauptschlüsselanlage planen',
  },
  {
    icon: Users,
    title: 'Komplexe Gebäude',
    body: 'Mehrere Standorte oder verschachtelte Berechtigungen erfordern komplexe Gruppen- und Generalhauptschlüssel.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'GHS-Anlage planen',
  },
];

const FALLBACK_FAQ = [
  {
    question: 'Welches Schließsystem ist für mich das richtige?',
    answer:
      'Das hängt von den Anforderungen ab. Einfamilienhäuser kommen oft mit gleichschließenden '
      + 'Zylindern aus. Mehrfamilienhäuser benötigen eine Zentralschlossanlage. Bei Unternehmen '
      + 'mit Abteilungen ist oft eine Hauptschlüssel- oder Generalhauptschlüsselanlage sinnvoll.',
  },
  {
    question: 'Wie funktioniert eine Gleichschließung?',
    answer:
      'Bei einer Gleichschließung können mehrere unterschiedliche Zylinder mit demselben Schlüssel '
      + 'geschlossen werden. Jeder Schlüssel passt in jedes Schloss. Das ist praktisch für '
      + 'Einfamilienhäuser (Haustür, Nebeneingang, Garage).',
  },
  {
    question: 'Was ist eine Sicherungskarte?',
    answer:
      'Eine Sicherungskarte ist ein Eigentumsnachweis. Nur gegen Vorlage dieser Karte können bei '
      + 'geschützten Systemen Nachschlüssel oder Ersatzzylinder angefertigt werden. Das schützt '
      + 'vor unberechtigten Kopien.',
  },
  {
    question: 'Kann ich meine bestehende Schließanlage erweitern?',
    answer:
      'Grundsätzlich ja, sofern das System noch unterstützt wird und Sie die Sicherungskarte '
      + 'besitzen. Bei sehr alten Anlagen kann es manchmal wirtschaftlicher sein, auf ein '
      + 'modernes, erweiterbares System zu wechseln.',
  },
  {
    question: 'Was kostet eine neue Schließanlage?',
    answer:
      'Erst nach der Erfassung der Türen und Berechtigungen wird ein Schließplan gefertigt. '
      + 'Preis und Aufwand hängen von der Anzahl der Schließstellen, der Schlüssel und der Ebenen '
      + 'ab. Deshalb nennen wir erst nach der Erfassung einen Betrag — und nicht vorab auf der Seite.',
  },
];

export default async function SchliessanlagenPage(props: {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await props.params;
  const resolvedSearch = await props.searchParams;

  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <PageHeader
        eyebrow="Mechanische Schließanlagen"
        title={page?.headline ?? 'Mechanische Schließanlagen'}
        lead={page?.subline ?? 'Von der Gleichschließung bis zur Generalhauptschlüsselanlage. Fundierte Planung und Architektur für jedes Sicherheitsbedürfnis.'}
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
      <Section tight className="py-16 md:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] md:text-3xl">
              Architektur und Planung von Schließanlagen
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[oklch(0.32_0.02_260)] md:text-lg">
              {page?.intro
                ?? 'Eine Schließanlage regelt, wer welche Tür öffnen darf. Sie bildet die organisatorische Struktur Ihres Gebäudes in mechanischer Form ab. Wir erklären die Systeme in einfacher Sprache und planen Ihre Anlage so, dass sie höchsten Sicherheitsansprüchen genügt und später problemlos erweitert werden kann.'}
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die Planung einer Anlage erfordert eine systematische Herangehensweise. Der Weg dorthin ist methodisch klar strukturiert: Sie erfassen Ihr Objekt, definieren Ihre Nutzergruppen und kartieren Ihre Türen. Daraus entsteht in enger Abstimmung ein präziser Schließplan. Dieser Plan ist das Herzstück der Anlage und definiert jede einzelne Zugangsberechtigung. Erst wenn dieser Plan fachlich geprüft und von Ihnen freigegeben ist, beginnt die handwerkliche Fertigung. Diese Sorgfalt stellt sicher, dass die Anlage exakt Ihren betrieblichen oder privaten Anforderungen entspricht.
            </p>

            <div className="mt-6 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] px-6 py-5 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)] flex items-center gap-2">
                <ShieldCheck size={16} />
                {process.label}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {process.hint}
              </p>
            </div>

            <ul className="mt-8 space-y-4">
              {GLOSSARY.map((item) => (
                <li
                  key={item.term}
                  className="flex items-start gap-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-5 py-4 transition-all hover:border-[oklch(0.52_0.24_260/0.4)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">{item.term}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                      {item.summary}
                    </span>
                  </span>
                  <InfoTip hint={item.hint} />
                </li>
              ))}
            </ul>
          </div>

          <div className="sticky top-24">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: Präziser Schließplan auf dem Tisch neben sorgfältig sortierten Profilzylindern und Werkzeugen',
                ratio: '4/3',
                note: 'Echtes Foto aus dem eigenen Betrieb. Authentische Handwerkskunst.',
              }}
            />
          </div>
        </div>
      </Section>

      {/* Enterprise ROI Calculator Integration */}
      <Section tone="muted" className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Wirtschaftlichkeit"
              title="Enterprise ROI Analyse"
              lead="Bewerten Sie das Einsparpotenzial einer gut geplanten Schließanlage. Mechanische Anlagen bieten oft einen erheblichen Kostenvorteil bei der Anschaffung gegenüber elektronischen Vollsystemen."
            />
            <p className="mt-6 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Bei der Investitionsentscheidung für eine Schließanlage spielen nicht nur die reinen Anschaffungskosten eine Rolle, sondern auch die langfristigen Verwaltungskosten. Eine mechanische Schließanlage besticht durch ihre Langlebigkeit und den geringen Wartungsaufwand, da keine Batterien getauscht oder Software-Updates durchgeführt werden müssen.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Nutzen Sie unseren interaktiven Kalkulator, um eine erste Einschätzung der Initialkosten und der potenziellen jährlichen Ersparnisse im Vergleich zu wartungsintensiveren Systemen zu erhalten. Diese Daten dienen als exzellente Grundlage für das Beratungsgespräch.
            </p>
            <ul className="mt-6 space-y-3">
               <li className="flex items-center gap-3 text-[14px] text-[oklch(0.32_0.02_260)]">
                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
                   <ShieldCheck size={14} />
                 </div>
                 Minimale laufende Kosten
               </li>
               <li className="flex items-center gap-3 text-[14px] text-[oklch(0.32_0.02_260)]">
                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
                   <ShieldCheck size={14} />
                 </div>
                 Keine Software-Lizenzgebühren
               </li>
               <li className="flex items-center gap-3 text-[14px] text-[oklch(0.32_0.02_260)]">
                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
                   <ShieldCheck size={14} />
                 </div>
                 Jahrzehntelange Funktionsgarantie
               </li>
            </ul>
          </div>
          <div>
            <EnterpriseRoiCalculator />
          </div>
        </div>
      </Section>

      {/* Die fünf Systeme */}
      <Section id="systeme" className="py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Systemarchitektur"
          title="Die fünf Systeme in einfacher Sprache"
          lead="Die vollständige Bezeichnung steht immer zuerst, die übliche Abkürzung folgt in Klammern. Fachwissen ist nicht erforderlich."
        />
        <div className="mt-12">
          <SystemErklaerung />
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Die Systeme im fundierten Vergleich</h3>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-[oklch(0.32_0.02_260)]">
            Die Wahl des richtigen Systems ist entscheidend für die Sicherheit und den Komfort Ihres Gebäudes. Wenn Sie unsicher sind, welches System zu Ihrer Organisationsstruktur passt: Die nachfolgende Matrix zeigt die technischen Unterschiede und Anwendungsgebiete nebeneinander. Im Projektkonfigurator analysieren wir Ihre Eingaben und leiten daraus einen präzisen, maßgeschneiderten Systemvorschlag ab.
          </p>
          <div className="mt-8 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <SystemVergleich />
          </div>
        </div>
      </Section>

      {/* Für wen */}
      <Section tone="muted" className="py-16 md:py-24">
        <SectionHeading
          eyebrow="Zielgruppen & Anwendungsbereiche"
          title="Wer plant welche Anlage?"
          lead="Die Zuordnung ist ein bewährter Anhaltspunkt aus unserer Praxis, keine starre Festlegung. Entscheidend sind Ihre spezifischen Raumkonzepte und Berechtigungsstrukturen."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Card className="flex h-full flex-col border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] transition-all hover:border-[oklch(0.52_0.24_260/0.4)] hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.06)]">
                  <CardBody className="flex flex-1 flex-col p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
                      <Icon size={24} aria-hidden />
                    </span>
                    <h3 className="mt-6 text-[18px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">{item.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                      {item.body}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
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
      <Section tight className="py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] md:text-3xl">
              Wenige Türen, ein Schlüssel für alles?
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Dann benötigen Sie keinen komplexen Schließplan. Gleichschließende Zylinder stellen Sie sich völlig flexibel selbst zusammen — Sie wählen die Bauform (Doppelzylinder, Halbzylinder, Knaufzylinder), die genauen Längenmaße und die Anzahl der gewünschten gemeinsamen Schlüssel — und bestellen diese direkt.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Der ausführliche Projektkonfigurator entfaltet seinen vollen Wert erst, wenn unterschiedliche Personen unterschiedliche Türen öffnen sollen. Für das private Einfamilienhaus ist die Gleichschließung in 95% der Fälle die eleganteste und wirtschaftlichste Lösung.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/gleichschliessende-zylinder" className="bg-[oklch(0.52_0.24_260)] text-white hover:bg-[oklch(0.48_0.24_260)]">
                Zu den gleichschließenden Zylindern
              </ButtonLink>
              <ButtonLink href="/schliessanlagen/konfigurator" variant="outline" className="border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.16_0.02_260)]">
                Trotzdem Projekt erfassen
              </ButtonLink>
            </div>
          </div>

          <Alert tone="info" title="Die entscheidende Grenze zur Anlage" className="border-[oklch(0.52_0.24_260/0.3)] bg-[oklch(0.52_0.24_260/0.05)] text-[oklch(0.16_0.02_260)]">
            <p className="mt-2 text-[14px] leading-relaxed">
              Sobald jemand eine Tür <strong>nicht</strong> öffnen können soll — etwa ein Mieter die Wohnung nebenan, der Gärtner das Haupthaus oder eine Aushilfe das Büro der Geschäftsleitung — reicht eine einfache Gleichschließung mechanisch nicht mehr aus. Genau ab diesem Punkt planen wir für Sie eine professionelle Schließanlage mit definierten Berechtigungsebenen und Profilüberschneidungen.
            </p>
          </Alert>
        </div>
      </Section>

      {/* Fragen */}
      <Section tone="muted" className="py-16 md:py-24">
        <SectionHeading eyebrow="Wissensdatenbank" title="Häufige Fragen & Expertenantworten" lead="Fundiertes Wissen rund um Planung, Sicherheit und Verwaltung mechanischer Schließsysteme." />
        <div className="mt-10 max-w-3xl">
          <Accordion items={faq} />
        </div>
      </Section>

      {/* Weiterführend */}
      <Section tight className="py-16 md:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Weiterführende Ressourcen</h2>
        <p className="mt-2 text-[15px] text-[oklch(0.32_0.02_260)]">Entdecken Sie weitere Lösungen und vertiefendes Wissen für Ihr Sicherheitsprojekt.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 grid-rows-subgrid">
          {[
            {
              href: '/schliessanlagen/konfigurator',
              label: 'Projektkonfigurator',
              body: 'Zehn detaillierte Frageblöcke zu Objekt, Nutzern, Türen und Berechtigungen für eine exakte Planung.',
            },
            {
              href: '/gleichschliessende-zylinder',
              label: 'Gleichschließende Zylinder',
              body: 'Die smarte Lösung für kleine Vorhaben und Einfamilienhäuser ohne hierarchische Berechtigungsstufen.',
            },
            {
              href: '/elektronische-zutrittsloesungen',
              label: 'Elektronische Zutrittslösungen',
              body: 'Maximale Flexibilität: Wenn Rechte dynamisch änderbar sein sollen, ohne jemals Zylinder tauschen zu müssen.',
            },
            {
              href: '/tuer-und-schliesstechnik',
              label: 'Tür- und Schließtechnik',
              body: 'Hochwertige Zylinder, zertifizierte Schlösser und massive Schutzbeschläge rund um die Tür.',
            },
            {
              href: '/ratgeber/welche-schliessanlage-passt',
              label: 'Welche Anlage passt?',
              body: 'Unsere ausführliche Entscheidungshilfe im Ratgeber für private und gewerbliche Bauherren.',
            },
            {
              href: '/service-und-termin/kontakt',
              label: 'Experten-Kontakt',
              body: 'Persönliche Beratung: Wenn Sie vor der digitalen Erfassung eine komplexe Frage klären möchten.',
            },
          ].map((link) => (
            <li key={link.href} className="row-span-3 grid grid-rows-subgrid">
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 transition-all hover:border-[oklch(0.52_0.24_260/0.4)] hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]"
              >
                <span className="text-[16px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors">
                  {link.label}
                </span>
                <span className="mt-3 flex-1 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                  {link.body}
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[oklch(0.52_0.24_260)]">
                  Jetzt entdecken
                  <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
