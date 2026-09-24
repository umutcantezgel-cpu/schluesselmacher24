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
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';
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

interface Props {
  params: Promise<{ [key: string]: string | undefined }>;
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


      {/* Enterprise ROI and Methodology */}
      <Section id="methodology" tight>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14 py-16 md:py-24">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">Fundierte architektonische Methodik</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die Planung einer mechanischen Schließanlage ist weitaus komplexer als die bloße Anordnung von Zylindern und Schlüsseln. Sie ist eine fundamentale architektonische Entscheidung, die die Sicherheit, Flexibilität und Skalierbarkeit Ihres Gebäudes auf Jahrzehnte hinaus prägt. Unsere Methodik basiert auf einer tiefgreifenden Analyse Ihrer Organisationsstruktur, der physischen Beschaffenheit Ihres Objekts und der spezifischen Sicherheitsanforderungen jeder einzelnen Zugangszone. Wir betrachten Schließanlagen nicht als statische Produkte, sondern als dynamische Sicherheitssysteme, die sich mit Ihrem Unternehmen weiterentwickeln müssen.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Ein zentraler Aspekt unserer Planung ist die sogenannte &quot;Schließplanhierarchie&quot;. Diese Hierarchie definiert die Zugriffsrechte präzise und strukturiert. An der Spitze steht der Generalhauptschlüssel, der uneingeschränkten Zugang gewährt. Darunter gliedern sich Hauptgruppenschlüssel, Gruppenschlüssel und schließlich Einzelschlüssel. Die Kunst besteht darin, diese Hierarchie so flach wie möglich, aber so differenziert wie nötig zu gestalten. Zu viele Ebenen erhöhen die Komplexität und die Anfälligkeit für Fehler, während zu wenige Ebenen die Flexibilität einschränken. Wir nutzen modernste Planungssoftware und mathematische Modelle, um die optimale Balance zwischen Sicherheit und Praktikabilität zu finden.
            </p>
            <h3 className="mt-8 text-xl font-semibold text-[oklch(0.16_0.02_260)]">Strukturierte Leistungsstufen und Skalierbarkeit</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Jede von uns konzipierte Anlage wird mit Reserven für zukünftiges Wachstum geplant. Wir berücksichtigen bereits in der Initialphase mögliche Erweiterungen, Umbauten oder Nutzungsänderungen. Dies geschieht durch die strategische Integration von &quot;Leerschließungen&quot; in den Schließplan, die später bei Bedarf aktiviert werden können. Diese vorausschauende Planung reduziert die langfristigen Gesamtbetriebskosten (Total Cost of Ownership - TCO) signifikant, da spätere Anpassungen ohne kompletten Austausch der Anlage realisiert werden können.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Darüber hinaus differenzieren wir zwischen verschiedenen Sicherheitsniveaus innerhalb eines Objekts. Nicht jede Tür erfordert die höchste Sicherheitsstufe. Durch die intelligente Kombination von Hochsicherheitszylindern (z.B. mit Bohr- und Ziehschutz, komplexen Profilen und aktiven Kopierschutzelementen) an der Außenhülle und in sensiblen Bereichen mit Standardzylindern im Innenbereich optimieren wir das Kosten-Nutzen-Verhältnis. Diese hybride Herangehensweise, bei der mechanische Systeme zunehmend mit elektronischen Zutrittskontrollsystemen kombiniert werden (Mechatronik), bietet die maximale Sicherheit bei gleichzeitiger Kosteneffizienz. Die nahtlose Integration beider Welten ist die Königsdisziplin der modernen Schließtechnik.
            </p>
          </div>
          <div>
            <EnterpriseRoiCalculator />
          </div>
        </div>
      </Section>

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
        <SectionHeading eyebrow="Fragen" title="Häufige Fragen zu Schließanlagen (FAQ)" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
              <h4 className="text-[oklch(0.16_0.02_260)] font-bold">1. Wie unterscheidet sich eine Z-Anlage von einer HS-Anlage?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm leading-relaxed">Eine Zentralschlossanlage (Z-Anlage) zeichnet sich dadurch aus, dass verschiedene Einzelschlüssel ein gemeinsames Schloss (z.B. die Haustür) schließen können, aber nicht die Türen der anderen (z.B. Wohnungen). Bei einer Hauptschlüsselanlage (HS-Anlage) gibt es hingegen einen übergeordneten Schlüssel (Hauptschlüssel), der alle Zylinder der Anlage schließen kann, während die Einzelschlüssel nur ihre jeweilige Tür öffnen.</p>
            </div>
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
              <h4 className="text-[oklch(0.16_0.02_260)] font-bold">2. Kann eine mechanische Schließanlage später erweitert werden?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm leading-relaxed">Ja, wenn sie von Anfang an professionell geplant wurde. Durch die Berücksichtigung von sogenannten &quot;Reserven&quot; im Schließplan können später weitere Schließzylinder hinzugefügt werden, ohne die bestehende Hierarchie oder die Sicherheit zu gefährden. Dies muss zwingend in der Planungsphase berücksichtigt werden.</p>
            </div>
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
              <h4 className="text-[oklch(0.16_0.02_260)] font-bold">3. Was passiert, wenn ein Generalhauptschlüssel verloren geht?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm leading-relaxed">Der Verlust eines GHS ist kritisch, da dieser alle Türen schließt. Aus Sicherheitsgründen muss in der Regel die gesamte Anlage oder zumindest große Teile davon ausgetauscht werden. Dies verdeutlicht, warum GHS besonders geschützt aufbewahrt werden müssen und elektronische Systeme als Ergänzung sinnvoll sein können.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
              <h4 className="text-[oklch(0.16_0.02_260)] font-bold">4. Welcher Kopierschutz ist bei Schlüsseln empfehlenswert?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm leading-relaxed">Wir empfehlen Systeme mit einem aktiven, patentierten Kopierschutz (z.B. bewegliche Elemente im Schlüssel). Diese bieten rechtlichen Schutz gegen illegale Rohlinge und physischen Schutz, da sie von herkömmlichen Schlüsseldiensten nicht ohne Sicherungskarte kopiert werden können.</p>
            </div>
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
              <h4 className="text-[oklch(0.16_0.02_260)] font-bold">5. Wie oft müssen Schließzylinder gewartet werden?</h4>
              <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm leading-relaxed">Mechanische Schließzylinder sollten mindestens einmal jährlich mit speziellem Pflegespray (niemals Öl oder Graphit!) behandelt werden. Bei Türen mit hoher Begehungsfrequenz oder im Außenbereich empfehlen wir eine halbjährliche Wartung, um die Langlebigkeit zu garantieren.</p>
            </div>
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
