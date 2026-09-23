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
];

export default async function SchliessanlagenPage(props: { params: Promise<{ id?: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await props.params;
  const resolvedSearch = await props.searchParams;
  void resolvedParams;
  void resolvedSearch;
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


      {/* Architektonische Methodik und Planungstiefe */}
      <Section tight>
        <SectionHeading
          eyebrow="Architektur & Planung"
          title="Methodik und Planungstiefe für zukunftssichere Sicherheit"
        />
        <div className="mt-8 prose prose-lg prose-slate text-[oklch(0.32_0.02_260)] leading-relaxed max-w-none">
          <p>
            Die Planung einer mechanischen Schließanlage ist weit mehr als die bloße Zuordnung von Schlüsseln zu Türen. Sie erfordert eine profunde architektonische Methodik, die sowohl die aktuellen Sicherheitsanforderungen als auch die zukünftige Skalierbarkeit Ihres Objekts berücksichtigt. Unsere Experten analysieren die physische Struktur Ihres Gebäudes, die Laufwege der Nutzer und die spezifischen Sicherheitszonen.
          </p>
          <p className="mt-4">
            Wir beginnen mit einer detaillierten Schwachstellen-Analyse, bei der wir nicht nur die offensichtlichen Zugangspunkte wie Haupt- und Nebeneingänge betrachten, sondern auch sensible Innenbereiche, Serverräume und Lagereinheiten evaluieren. Diese holistische Herangehensweise stellt sicher, dass Ihre Schließanlage keine blinden Flecken aufweist.
          </p>
          <p className="mt-4">
            Ein zentraler Bestandteil unserer Methodik ist die zukunftssichere Dimensionierung. Eine professionell geplante Anlage muss mitwachsen können. Egal ob Abteilungszusammenlegungen, Gebäudeerweiterungen oder ein Wechsel der Mieterstruktur anstehen – die Grundarchitektur des Schließplans wird so ausgelegt, dass spätere Erweiterungen nahtlos und ohne vollständigen Austausch der Kernkomponenten integriert werden können. Dies schont nicht nur Ihr langfristiges Budget, sondern minimiert auch den administrativen Aufwand bei strukturellen Veränderungen.
          </p>
          <p className="mt-4">
            Zusätzlich integrieren wir modernste Erkenntnisse der Kriminalprävention in die Planung. Durch den gezielten Einsatz von unterschiedlichen Sicherheitsstufen innerhalb derselben Anlage – beispielsweise hochsichere Zylinder mit Kopierschutz für Außentüren und funktionale Standardzylinder für Innentüren – optimieren wir das Verhältnis von maximaler Sicherheit und wirtschaftlicher Effizienz.
          </p>
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

        <div className="mt-8 prose prose-lg prose-slate text-[oklch(0.32_0.02_260)] leading-relaxed max-w-none">
          <h3>1. Gleichschließung (GS)</h3>
          <p>Die Basis-Stufe für Einfamilienhäuser und kleine Gewerbeeinheiten. Ein einziger Schlüssel öffnet alle definierten Türen (z. B. Haustür, Garage, Kellertür). Diese Variante bietet hohen Komfort, eignet sich jedoch nicht für die Vergabe differenzierter Zutrittsrechte.</p>
          <h3 className="mt-6">2. Zentralschlossanlage (Z-Anlage)</h3>
          <p>Die klassische Lösung für Mehrfamilienhäuser. Jeder Mieter erhält einen individuellen Wohnungsschlüssel, der zusätzlich die Zentraltüren (Haupteingang, Kellereingang) öffnet. Ein gegenseitiges Aufschließen der Privatwohnungen ist dabei ausgeschlossen.</p>
          <h3 className="mt-6">3. Hauptschlüsselanlage (HS-Anlage)</h3>
          <p>Konzipiert für kleinere bis mittlere Unternehmen oder Schulen. Ein übergeordneter Hauptschlüssel (HS) schließt alle Zylinder der Anlage. Darunter gibt es Einzelschlüssel, die jeweils nur eine bestimmte Tür (z. B. ein spezifisches Büro) öffnen.</p>
          <h3 className="mt-6">4. Generalhauptschlüsselanlage (GHS-Anlage)</h3>
          <p>Die Spitzenklasse für große Unternehmen, Krankenhäuser und komplexe Behördenzentren. Die Architektur ist streng hierarchisch gegliedert: Der Generalhauptschlüssel (GHS) öffnet das gesamte Objekt. Darunter ordnen sich Hauptgruppenschlüssel (HGS) für Gebäudeteile, Gruppenschlüssel (GS) für Abteilungen und schließlich Einzelschlüssel für spezifische Räume an. Diese extrem leistungsfähige Matrix erlaubt die Abbildung auch hochkomplexer Unternehmensstrukturen.</p>
        </div>

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


      {/* Enterprise ROI Calculator */}
      <Section>
        <SectionHeading
          eyebrow="Investition"
          title="Planungssicherheit für Ihr Projekt"
        />
        <div className="mt-8">
          <EnterpriseRoiCalculator />
        </div>
      </Section>



      {/* Fachspezifische FAQs */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Fachwissen"
          title="Häufige Fragen zur Anlagenarchitektur (FAQ)"
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)]">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[oklch(0.16_0.02_260)]">1. Wie lange dauert die Produktion einer individuellen Schließanlage?</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Die Produktionszeit hängt stark vom gewählten System und der Komplexität ab. Bei Standardanlagen (Z- oder HS-Anlagen) rechnen Sie im Schnitt mit 10 bis 14 Werktagen nach finaler Freigabe des Schließplans. Hochkomplexe GHS-Anlagen können aufgrund der aufwendigen Matrixberechnung und Fertigung auch 3 bis 4 Wochen in Anspruch nehmen.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[oklch(0.16_0.02_260)]">2. Kann eine bestehende Anlage später erweitert werden?</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Ja, das ist ein Kernpunkt unserer architektonischen Methodik. Wenn wir den Schließplan entwerfen, kalkulieren wir standardmäßig Reserven für zukünftige Erweiterungen (sogenannte Sperrungsreserven) ein. Wichtig ist jedoch, dass Sie uns bei der Erstplanung mitteilen, in welchem Rahmen Expansionen denkbar sind, damit die Matrix groß genug dimensioniert wird.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[oklch(0.16_0.02_260)]">3. Was passiert, wenn ein übergeordneter Schlüssel (z. B. der Hauptschlüssel) verloren geht?</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Der Verlust eines Haupt- oder Generalhauptschlüssels ist ein gravierendes Sicherheitsrisiko, da er potenziell Zugang zum gesamten Gebäude gewährt. Bei rein mechanischen Anlagen muss in diesem Fall oft ein großer Teil der Zylinder ausgetauscht werden, um die Sicherheit wiederherzustellen. Für Bereiche mit hohem Verlustrisiko empfehlen wir daher oft Hybrid-Anlagen, bei denen kritische Außentüren elektronisch gesichert sind, da elektronische Medien bei Verlust einfach gesperrt werden können.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[oklch(0.16_0.02_260)]">4. Sind die Schlüssel meiner Anlage vor unberechtigten Kopien geschützt?</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Absolut. Alle unsere professionellen Schließanlagen werden mit einer Sicherungskarte ausgeliefert. Nur wer im Besitz dieser Karte ist, ist legitimiert, bei uns oder dem Hersteller Ersatzschlüssel oder Erweiterungszylinder anfertigen zu lassen. Zudem verwenden wir patentrechtlich geschützte Profile, für die im freien Handel keine Rohlinge verfügbar sind.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[oklch(0.16_0.02_260)]">5. Wie verhält es sich mit dem Brandschutz?</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Schließanlagen in öffentlichen und gewerblichen Gebäuden unterliegen strengen Brandschutz- und Fluchtwegverordnungen (DIN EN 179 und DIN EN 1125). Unsere Planung stellt sicher, dass Flucht- und Rettungswege jederzeit in Fluchtrichtung ohne Schlüssel geöffnet werden können (Panikfunktion). Wir integrieren diese Anforderungen nahtlos in den Gesamtschließplan.
            </p>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[oklch(0.16_0.02_260)]">6. Wie pflege ich die Zylinder meiner neuen Anlage richtig?</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Mechanische Präzisionszylinder erfordern Pflege, jedoch mit dem richtigen Mittel. Verwenden Sie niemals Öl oder herkömmliche Schmiersprays (wie WD-40), da diese verharzen und den Zylinder zerstören können. Nutzen Sie ausschließlich spezielles Pflegespray des jeweiligen Herstellers. Eine Pflegeeinheit vor Beginn der kalten Jahreszeit ist in der Regel ausreichend.
            </p>
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
