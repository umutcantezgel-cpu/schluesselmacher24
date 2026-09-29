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
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';
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


interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchliessanlagenPage({ params, searchParams }: Props) {
  await params;
  await searchParams;
  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : [
  {
    question: "Was ist der Unterschied zwischen einer Gleichschließung und einer Schließanlage?",
    answer: "Bei einer Gleichschließung haben alle Schlösser dieselbe Schließung (denselben Code). Ein Schlüssel passt überall. Es gibt keine Hierarchie. Bei einer Schließanlage (z.B. Zentralschlossanlage oder Hauptschlüsselanlage) gibt es über- und untergeordnete Schlüssel. Ein Mieter kann nur seine Wohnung und die Haustür öffnen, der Hausmeister mit seinem Schlüssel aber alle Haustüren und Technikräume."
  },
  {
    question: "Was passiert, wenn ein Schlüssel einer Schließanlage verloren geht?",
    answer: "Das hängt vom System und vom verlorenen Schlüssel ab. Verliert ein Mieter seinen Wohnungsschlüssel (Einzelschlüssel), muss meist nur der Wohnungszylinder und ggf. der Zentralzylinder getauscht werden. Verliert jemand den Generalhauptschlüssel (GHS), der überall schließt, muss aus Sicherheitsgründen oft die gesamte Anlage ausgetauscht werden. Daher empfiehlt sich hierfür ein elektronisches System oder eine strenge Schlüsselverwaltung."
  },
  {
    question: "Kann ich meine Schließanlage später erweitern?",
    answer: "Ja, wenn dies bei der Erstplanung berücksichtigt wurde. Wir planen Anlagen standardmäßig mit sogenannten 'Ausbaureserven'. Dabei werden mathematische Schließmöglichkeiten für zukünftige Türen im Schließplan freigehalten, ohne sie sofort zu fertigen. So können später problemlos neue Zylinder hinzugefügt werden, die sich nahtlos in die bestehende Hierarchie einfügen."
  },
  {
    question: "Was ist eine Sicherungskarte und warum ist sie wichtig?",
    answer: "Die Sicherungskarte (auch Servicekarte genannt) ist der 'Fahrzeugbrief' Ihrer Schließanlage. Nur wer diese Karte im Original vorlegt, ist berechtigt, Nachschlüssel oder zusätzliche Zylinder für die Anlage fertigen zu lassen. Sie schützt das System effektiv vor illegalen Schlüsselkopien und garantiert, dass Sie jederzeit die volle Kontrolle über die ausgegebenen Schlüssel behalten."
  },
  {
    question: "Wie lange dauert die Lieferung einer neuen Schließanlage?",
    answer: "Nach der finalen Freigabe des Schließplans durch Sie, dauert die werkseitige Fertigung einer mechanischen Schließanlage bei unseren Partnern in der Regel 10 bis 15 Werktage. Die anschließende fachgerechte Montage vor Ort erfolgt dann zu einem vereinbarten Termin und nimmt je nach Anlagengröße wenige Stunden bis mehrere Tage in Anspruch."
  }
];
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
                ?? 'Eine Schließanlage ist das zentrale physische Berechtigungsmanagement-System eines Gebäudes. Sie regelt mit höchster Präzision, wer welche Tür öffnen darf, und bildet damit das sicherheitstechnische Rückgrat moderner Immobilien – von der privaten Wohnanlage bis zum komplexen Industriekomplex. Wir erklären die zugrundeliegende architektonische Methodik, die verschiedenen Systemklassen und planen Ihre Anlage zukunftssicher. \n\n' +
              'Die architektonische Methodik bei der Planung einer Schließanlage basiert auf der Definition von Nutzergruppen und deren Bewegungsradien. Anstatt jeder Tür ein separates Schloss und jedem Nutzer ein Bund voller Schlüssel zuzuordnen, wird ein mathematisch-mechanisches Beziehungsgeflecht erschaffen. Zylinder und Schlüssel werden ab Werk so codiert, dass ein einzelner Schlüssel hunderte unterschiedliche Türen öffnen kann, während ein anderer Schlüssel in derselben Anlage nur für eine einzige Tür passt. \n\n' +
              'Dieser modulare Ansatz garantiert nicht nur maximalen Komfort für die Anwender, sondern ermöglicht es auch, das System bei organisatorischen Veränderungen oder baulichen Erweiterungen nachträglich anzupassen und zu skalieren. Die Sicherheit wird dabei durch geschützte Schlüsselprofile und strenge Legitimation bei Nachbestellungen (Sicherungskarte) auf höchstem Niveau gewährleistet.'}
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


      {/* Enterprise ROI und Planung */}
      <Section id="roi-kalkulator" tone="muted">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Wirtschaftlichkeit"
              title="Enterprise ROI und Systemeffizienz"
              lead="Eine moderne Schließanlage ist mehr als ein Sicherheitsmerkmal. Sie ist ein Instrument zur betriebswirtschaftlichen Prozessoptimierung."
            />
            <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-foreground-muted">
              <p>
                In der architektonischen und betriebswirtschaftlichen Bewertung von Schließsystemen wird häufig unterschätzt, welche laufenden Kosten durch ineffizientes Schlüsselmanagement entstehen. Die Administration von Berechtigungen, der physische Austausch bei Verlusten und die Dokumentation von Ausgabe-Prozessen binden erhebliche Ressourcen in der Gebäudeverwaltung.
              </p>
              <p>
                Mechanische Schließanlagen der Enterprise-Klasse, insbesondere Generalhauptschlüsselanlagen (GHS), minimieren diesen Aufwand durch präzise hierarchische Strukturierung. Jeder Nutzer trägt genau einen Schlüssel, der exakt die Türen öffnet, für die eine Autorisierung vorliegt. Dieses Prinzip der &quot;Minimierung der Schlüsselanzahl&quot; (Least Privilege Access auf physischer Ebene) senkt nicht nur das Verlustrisiko, sondern reduziert auch den administrativen Overhead massiv.
              </p>
              <p>
                Unser interaktiver ROI-Kalkulator demonstriert die potenziellen Einsparungen. Er vergleicht den Aufwand dezentraler, unstrukturierter Schließsysteme mit einer zentral geplanten GHS- oder HS-Anlage. Berücksichtigt werden dabei typische Opportunitätskosten für Hausmeisterdienste, Neuanschaffungen bei Schlüsselverlust und die Verwaltung von Ausgabeprotokollen.
              </p>
            </div>
          </div>

          <div className="relative">
            <EnterpriseRoiCalculator />
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
