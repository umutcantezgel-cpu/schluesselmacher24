import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { InfoHint } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

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
            <h2 className="text-2xl font-bold leading-tight text-[oklch(0.16_0.02_260)] md:text-3xl mb-4">
              Architektonische Methodik und strategische Planung
            </h2>
            <p className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)] md:text-base mb-4">
              Eine Schließanlage ist mehr als nur eine Sammlung von Zylindern und Schlüsseln. Sie ist ein maßgeschneidertes Sicherheitssystem, das präzise regelt, wer welche Tür in Ihrem Gebäude öffnen darf. Die architektonische Methodik bei der Planung einer solchen Anlage erfordert ein tiefes Verständnis der organisatorischen Strukturen und der physischen Gegebenheiten Ihres Objekts. Wir betrachten nicht nur den aktuellen Zustand, sondern antizipieren auch zukünftige Erweiterungen und Nutzungsänderungen. Dieser vorausschauende Ansatz garantiert, dass Ihre Investition in Sicherheitstechnik langfristig Bestand hat.
            </p>
            <p className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)] md:text-base mb-4">
              Der Weg dorthin folgt einem strukturierten, bewährten Prozess. Zunächst erfassen Sie detailliert Ihr Objekt, die verschiedenen Nutzergruppen und jede einzelne Tür. Aus diesen Daten entwickeln wir eine komplexe Matrix, die alle Schließberechtigungen abbildet. Diese Matrix bildet das Fundament für den Schließplan, den wir in iterativen Abstimmungsschleifen gemeinsam mit Ihnen perfektionieren. Jeder Schlüssel und jeder Zylinder wird spezifisch für seine Funktion innerhalb des Gesamtsystems konzipiert.
            </p>
            <p className="text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)] md:text-base mb-4">
              Bei der technischen Umsetzung setzen wir auf höchste Präzision und langlebige Materialien. Die Zylinder werden so gefertigt, dass sie maximalen Widerstand gegen Manipulation und gewaltsame Öffnungsversuche bieten. Gleichzeitig muss die Handhabung im Alltag reibungslos und komfortabel bleiben. Durch die Kombination von mechanischer Robustheit und intelligenter Schließlogik entsteht ein System, das Sicherheit und Flexibilität optimal vereint. Dieser hohe Anspruch an Qualität und Methodik ist das Fundament unserer Arbeit.
            </p>

            <div className="mt-6 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)]">
                {process.label}
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {process.hint}
              </p>
            </div>

            <h3 className="mt-8 text-xl font-bold text-[oklch(0.16_0.02_260)]">Wichtige Fachbegriffe</h3>
            <ul className="mt-4 space-y-3">
              {GLOSSARY.map((item) => (
                <li
                  key={item.term}
                  className="flex items-start gap-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] px-4 py-3 shadow-[0_4px_12px_-4px_oklch(0.16_0.02_260/0.04)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-[oklch(0.16_0.02_260)]">{item.term}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                      {item.summary}
                    </span>
                  </span>
                  <InfoTip hint={item.hint} />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: Schließplan auf dem Tisch neben sortierten Profilzylindern',
                ratio: '4/3',
                note: 'Echtes Foto aus dem eigenen Betrieb. Kein Stockfoto.',
              }}
            />
            <EnterpriseRoiCalculator />
          </div>
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
        <SectionHeading eyebrow="Fachspezifische FAQ" title="Häufige Fragen zu Schließanlagen und ROI" />
        <div className="mt-8 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)] space-y-6">
          <div>
            <h3 className="font-bold text-[oklch(0.16_0.02_260)]">1. Wie unterscheidet sich eine Generalhauptschlüsselanlage von einer Zentralschlossanlage im Hinblick auf den ROI?</h3>
            <p>Die Generalhauptschlüsselanlage (GHS) bietet eine hochkomplexe Hierarchie, die ideal für große Unternehmensstrukturen ist. Der Return on Investment (ROI) ergibt sich hier durch die drastische Reduktion der Schlüsselverwaltungskosten und die erhöhte Sicherheit, da Zugriffsrechte präzise gesteuert werden können. Eine Zentralschlossanlage ist eher für Wohngebäude konzipiert, wo mehrere Nutzer einen gemeinsamen Zugang (z.B. Haustür) teilen, aber individuelle Wohnungsschlüssel besitzen. Hier liegt der Fokus auf Komfort und reduzierter Schlüsselanzahl pro Nutzer, was die Verwaltungskosten im Wohnbau senkt.</p>
          </div>
          <div>
            <h3 className="font-bold text-[oklch(0.16_0.02_260)]">2. Welche Faktoren beeinflussen die Ladezeit bei der Nutzung digitaler Schließsysteme im Enterprise-Umfeld?</h3>
            <p>Obwohl diese Seite primär mechanische Anlagen behandelt, ist der Vergleich wichtig. Digitale Systeme erfordern Netzwerkkommunikation und Datenbankabfragen, was zu Latenzen führen kann. Bei der Integration mechanischer Systeme in digitale Verwaltungstools hängt die Performance von der Effizienz der Datenbankarchitektur und der Optimierung der Schnittstellen ab. Ein gut konfiguriertes System gewährleistet eine nahezu sofortige Verarbeitung der Berechtigungsanfragen, was entscheidend für einen reibungslosen Betriebsablauf ist.</p>
          </div>
          <div>
            <h3 className="font-bold text-[oklch(0.16_0.02_260)]">3. Wie skalierbar ist eine mechanische Schließanlage, wenn das Unternehmen wächst?</h3>
            <p>Die Skalierbarkeit muss bereits in der initialen Planungsphase berücksichtigt werden. Wir konzipieren den Schließplan mit ausreichenden Reserven für zukünftige Erweiterungen. Dies bedeutet, dass in der Schließhierarchie &quot;Platz&quot; gelassen wird, um neue Abteilungen, Gebäude oder Nutzergruppen nahtlos integrieren zu können, ohne die bestehende Sicherheitsstruktur zu gefährden oder Zylinder austauschen zu müssen. Eine vorausschauende Planung minimiert die zukünftigen Erweiterungskosten signifikant.</p>
          </div>
          <div>
            <h3 className="font-bold text-[oklch(0.16_0.02_260)]">4. Was sind die häufigsten Schwachstellen bei unzureichend geplanten Schließanlagen?</h3>
            <p>Häufige Schwachstellen sind fehlende Flexibilität für Erweiterungen, unzureichende Dokumentation der Schlüsselübergaben und eine fehlerhafte Strukturierung der Berechtigungsebenen. Dies führt oft dazu, dass Personen Zugriff auf Bereiche erhalten, die sie nicht betreten sollten, oder dass bei Schlüsselverlust ein unverhältnismäßig großer Aufwand beim Austausch von Zylindern entsteht. Unsere detaillierte Methodik schließt diese Risiken systematisch aus.</p>
          </div>
          <div>
            <h3 className="font-bold text-[oklch(0.16_0.02_260)]">5. Wie lange dauert die Produktion und Implementierung einer komplexen Enterprise-Schließanlage?</h3>
            <p>Die Dauer hängt maßgeblich von der Komplexität des Schließplans und der Anzahl der Schließstellen ab. Nach der finalen Freigabe des Schließplans durch den Kunden benötigt die Fertigung in der Regel 3 bis 6 Wochen. Wir legen großen Wert auf höchste Präzision, was diese Zeitspanne rechtfertigt. Die anschließende Installation wird von unseren Fachkräften effizient und mit minimalen Unterbrechungen des Betriebsablaufs durchgeführt.</p>
          </div>
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
