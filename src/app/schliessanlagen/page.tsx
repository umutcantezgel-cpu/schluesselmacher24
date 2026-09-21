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
import { EnterpriseROICalculator } from '@/components/calculator/enterprise-roi-calculator';

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

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchliessanlagenPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const page = await getPageContent(ROUTE);
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
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
            <div className="prose prose-neutral max-w-none">
              <p className="text-[15px] leading-relaxed text-foreground-muted md:text-base">
                Eine Schließanlage regelt mit mathematischer Präzision, welche Person mit welchem Schlüssel welche Türen, Tore oder Zugänge öffnen darf. Ob es sich dabei um ein einfaches Zweifamilienhaus, eine mittelständische Unternehmenszentrale oder einen hochkomplexen Industriekomplex handelt – die konzeptionellen Grundprinzipien der Zugangsarchitektur bleiben stets identisch. Wir erklären Ihnen die unterschiedlichen mechanischen und elektronischen Systeme in leicht verständlicher, aber fachlich hochpräziser Sprache und planen Ihre Anlage von Anfang an so zukunftssicher, dass sie bei organisatorischen Veränderungen oder baulichen Erweiterungen nahtlos mitwachsen kann, ohne dass ein vollständiger Austausch der Zylinder erforderlich wird.
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Der architektonische Weg zu einer sicheren, effizienten und normgerechten Schließanlage folgt immer einer fest definierten, standardisierten Methodik: Zunächst erfassen Sie die strukturelle Beschaffenheit Ihres Objekts, definieren die Nutzergruppen (wie Geschäftsführung, Verwaltung, Facility Management oder externe Dienstleister) und kartieren alle relevanten Türen und Zugänge. Aus dieser mehrdimensionalen Matrix generieren wir anschließend einen detaillierten, logisch konsistenten Schließplan. Dieser Plan wird in einem iterativen Prozess gemeinsam mit Ihnen auf Herz und Nieren geprüft, optimiert und final freigegeben. Erst wenn jede Hierarchieebene und jede Schließberechtigung exakt Ihren Sicherheitsrichtlinien entspricht, leiten wir die Präzisionsfertigung der Schließzylinder und Schlüssel bei unseren zertifizierten Partner-Manufakturen ein.
              </p>

              <h2 className="mt-8 text-xl font-bold text-foreground">Architektonische Methodik und Planungstiefe</h2>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Die Konzeption einer Schließanlage ist weit mehr als nur die bloße Zuordnung von Schlüsseln zu Zylindern. Sie ist die physikalische Manifestation Ihrer organisatorischen Sicherheitsrichtlinien und Unternehmensstrukturen. Eine sorgfältig geplante Anlage minimiert nicht nur das Risiko von unbefugtem Zutritt und Spionage, sondern optimiert auch signifikant die täglichen Abläufe im Gebäude. Das Facility Management muss nicht mehr mit unübersichtlichen Schlüsselbünden hantieren, und bei Personalwechseln oder dem Verlust eines Schlüssels lassen sich die Sicherheitsrisiken durch intelligente Anlagenstrukturen – etwa durch den Einsatz von Sperrschließungen oder modular aufgebauten Zylindern – effektiv und kostengünstig eingrenzen.
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Ein entscheidender Faktor bei der Planung ist die Antizipation zukünftiger Entwicklungen. Die sogenannte &quot;Reserve&quot;, also vorausschauend eingeplante, aber noch nicht physisch produzierte Schließzylinder und Schlüsselprofile, ermöglicht es, zu einem späteren Zeitpunkt neue Abteilungen, Gebäudeerweiterungen oder geänderte Berechtigungsstrukturen nahtlos in die bestehende Anlage zu integrieren. Diese vorausschauende Planung, kombiniert mit der Auswahl der richtigen Zylindertechnologie (z.B. Wendeschlüsselsysteme mit aktivem Kopierschutz, Magnetcodierung oder mechatronische Komponenten), stellt sicher, dass die Investition in Ihre Gebäudesicherheit auch nach Jahrzehnten noch Bestand hat und den wachsenden normativen Anforderungen gerecht wird.
              </p>

              <h3 className="mt-8 text-lg font-bold text-foreground">Mechanik, Mechatronik und vollelektronische Systeme</h3>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Während rein mechanische Systeme durch ihre absolute Zuverlässigkeit, Wartungsfreiheit und Unabhängigkeit von Stromquellen bestechen, bieten mechatronische und elektronische Systeme eine beispiellose Flexibilität in der Rechteverwaltung. Eine moderne Sicherheitsarchitektur setzt oft auf hybride Konzepte: Sensible Außenhüllen, Serverräume und Vorstands-Etagen werden mit elektronischen Zylindern ausgestattet, bei denen Berechtigungen in Echtzeit erteilt, entzogen und Zutrittsereignisse protokolliert werden können. Weniger kritische Innenbereiche, Lagerräume oder Technikschächte hingegen werden aus wirtschaftlichen Gründen oft weiterhin mit hochsicheren mechanischen Komponenten in das Gesamtsystem integriert.
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Diese hybriden Anlagen erfordern eine besonders präzise Planung, da die mechanischen Schließhierarchien und die elektronischen Berechtigungsmatrizen logisch und administrativ miteinander verknüpft werden müssen. Die Verwaltung erfolgt in der Regel über eine zentrale Management-Software, die es dem Administrator ermöglicht, sowohl die mechanischen Schlüssel als auch die elektronischen Transponder oder Smart-Cards über eine einheitliche Oberfläche zu verwalten. Dies reduziert den administrativen Overhead erheblich und schließt Sicherheitslücken, die durch redundante oder asynchrone Datenhaltung in getrennten Systemen entstehen könnten.
              </p>

              <h3 className="mt-8 text-lg font-bold text-foreground">Sicherheitsklassen und Einbruchhemmung</h3>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Ein entscheidendes Kriterium bei der Planung und Dimensionierung einer Schließanlage ist die geforderte Einbruchhemmung der einzelnen Zylinder. Mechanische und mechatronische Schließzylinder werden nach verschiedenen DIN- und EN-Normen zertifiziert, die ihre Widerstandsfähigkeit gegenüber gewaltsamen Öffnungsmethoden klassifizieren. Die EN 1303 definiert beispielsweise detaillierte Anforderungen an die Verschlusssicherheit, die Dauerhaftigkeit und den Feuerwiderstand. Für den Einsatz in stark gefährdeten Bereichen, wie etwa bei Außentüren von Gewerbeobjekten oder Juweliergeschäften, empfehlen wir den Einsatz von Zylindern mit integriertem Bohr- und Ziehschutz. Diese Spezialzylinder sind mit gehärteten Stahlstiften und massiven Hartmetallplatten im Zylinderkern und -gehäuse ausgestattet, die ein zerstörerisches Aufbohren oder das gewaltsame Herausziehen des Zylinderkerns extrem erschweren.
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Darüber hinaus spielt der aktive Kopierschutz der verwendeten Schlüsselprofile eine essenzielle Rolle. Bei minderwertigen Systemen können Nachschlüssel von Unbefugten problemlos bei jedem Schlüsseldienst angefertigt werden, sofern sie kurzfristig Zugriff auf den Originalschlüssel haben. Hochwertige Schließanlagen nutzen hingegen patentierte Schlüsselprofile, die nur unter Vorlage einer eindeutig zugeordneten Sicherungskarte und oft nur vom Originalhersteller selbst reproduziert werden dürfen. Einige moderne Wendeschlüsselsysteme integrieren zudem bewegliche Elemente (wie kleine Kugeln oder Rotoren) im Schlüsselschaft, die eine illegale Kopie mit 3D-Druckern oder Fräsmaschinen technisch nahezu unmöglich machen. Diese Kombination aus physischem Einbruchschutz und organisatorischem Kopierschutz bildet das Fundament einer kompromisslosen Sicherheitsarchitektur.
              </p>

              <h3 className="mt-8 text-lg font-bold text-foreground">Projektphasen: Von der Analyse bis zur Inbetriebnahme</h3>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Die Realisierung einer maßgeschneiderten Schließanlage erfolgt in strukturierten, streng dokumentierten Phasen. In der initialen Bedarfsanalyse erfassen wir die architektonischen Gegebenheiten Ihres Objekts. Dies umfasst nicht nur die Anzahl und Art der Türen, sondern auch spezifische Anforderungen wie Brandschutzvorgaben, Flucht- und Rettungswege (Panikschlösser) sowie die Integration in bestehende Gefahrenmeldeanlagen. Basierend auf dieser Analyse erstellen wir eine detaillierte Matrix der Berechtigungsstrukturen. Diese Matrix visualisiert transparent, welche Nutzergruppen (z.B. Reinigungspersonal, IT-Administration, Geschäftsführung) zu welchen Zeiten Zugang zu welchen Gebäudezonen erhalten sollen.
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
                Nach der Freigabe der Planungsdokumente beginnt die Produktionsphase. Jeder Zylinder und jeder Schlüssel wird mit höchster Präzision individuell gefertigt und codiert. Wir überwachen den gesamten Herstellungsprozess und führen vor der Auslieferung rigorose Qualitätskontrollen durch. Die abschließende Montage und Inbetriebnahme erfolgt durch unsere zertifizierten Servicetechniker. Dabei legen wir größten Wert auf eine fachgerechte Installation, die sicherstellt, dass die Zylinder bündig mit dem Schutzbeschlag abschließen und keine Angriffsflächen für Werkzeuge bieten. Eine ausführliche Dokumentation, einschließlich des finalen Schließplans und der Übergabe der Sicherungskarten, bildet den Abschluss des Projekts und garantiert Ihnen eine transparente und sichere Verwaltung Ihrer neuen Anlage.
              </p>

            </div>

            <EnterpriseROICalculator />

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
    </main>
  );
}
