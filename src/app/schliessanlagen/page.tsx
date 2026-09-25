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
import { EnterpriseROICalculator } from '@/components/calculator/enterprise-roi-calculator';
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


{/* Architektonische Methodik */}
<Section tone="muted">
  <div className="grid gap-8 lg:grid-cols-2">
    <div>
      <h2 className="text-3xl font-bold text-foreground">Architektonische Methodik</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
        Die Konzeption einer modernen Schließanlage erfordert mehr als das bloße Aneinanderreihen von Schließzylindern. Sie verlangt ein tiefgreifendes Verständnis der architektonischen Gegebenheiten, der operativen Prozesse und der zukünftigen Skalierbarkeit des Gebäudes. Unsere Methodik basiert auf einem systematischen, phasengetriebenen Ansatz, der höchste Sicherheit mit administrativer Effizienz vereint.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
        Im Zentrum steht die Entwicklung eines redundanzfreien Schließplans. Dieser fungiert als architektonische Matrix, die räumliche Zonen, Berechtigungsebenen und physische Zugangspunkte in einem logischen Modell abbildet. Durch die Anwendung topologischer Prinzipien stellen wir sicher, dass komplexe Hierarchien – von der Generalhauptschlüsselebene bis zum Individualzugang – präzise abgebildet und verwaltet werden können.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
        Darüber hinaus integrieren wir zukunftssichere Erweiterungspuffer. Die Dynamik moderner Organisationen erfordert Schließsysteme, die mitwachsen können, ohne ihre strukturelle Integrität zu verlieren. Jede von uns geplante Anlage ist so konzipiert, dass räumliche Expansionen oder organisatorische Umstrukturierungen mit minimalem Hardware-Eingriff und maximaler Kosteneffizienz realisiert werden können.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
        Die Auswahl der Schließzylinder selbst erfolgt nach strengen Kriterien hinsichtlich Manipulationsschutz, Verschleißresistenz und Zertifizierungsstandards (z. B. VdS-Klassen, DIN EN 1303). Wir setzen konsequent auf Präzisionsmechanik, die nicht nur den aktuellen Sicherheitsanforderungen entspricht, sondern diesen oft voraus ist. Der Fokus liegt dabei stets auf einem optimalen Gleichgewicht zwischen initialer Investition und langfristigem Return on Investment (ROI), insbesondere im Enterprise-Umfeld.
      </p>
    </div>
    <div>
      <EnterpriseROICalculator />
    </div>
  </div>
</Section>

{/* Performance Tiers */}
<Section>
  <h2 className="text-3xl font-bold text-foreground mb-8">Performance Tiers und Vergleichsmatrix</h2>
  <p className="text-[15px] leading-relaxed text-foreground-muted mb-6">
    Die nachfolgende Matrix bietet einen fundierten Vergleich unserer Architektur-Level, von der grundlegenden Gleichschließung bis hin zur hochkomplexen Generalhauptschlüsselanlage. Sie dient als Entscheidungsgrundlage für Facility Manager, Architekten und Bauherren, um die optimale Lösung für ihr spezifisches Anforderungsprofil zu identifizieren.
  </p>
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm text-foreground-muted">
      <thead className="bg-surface-muted text-foreground">
        <tr>
          <th className="px-6 py-4 font-bold border-b border-border">Merkmal</th>
          <th className="px-6 py-4 font-bold border-b border-border">Zentralschloss (Z)</th>
          <th className="px-6 py-4 font-bold border-b border-border">Hauptschlüssel (HS)</th>
          <th className="px-6 py-4 font-bold border-b border-border">Generalhauptschlüssel (GHS)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border">
          <td className="px-6 py-4">Hierarchische Ebenen</td>
          <td className="px-6 py-4">Flach (Eine Ebene)</td>
          <td className="px-6 py-4">Zweistufig</td>
          <td className="px-6 py-4">Mehrstufig (Komplex)</td>
        </tr>
        <tr className="border-b border-border bg-surface-muted/50">
          <td className="px-6 py-4">Skalierbarkeit</td>
          <td className="px-6 py-4">Gering</td>
          <td className="px-6 py-4">Mittel</td>
          <td className="px-6 py-4">Hoch (Enterprise)</td>
        </tr>
        <tr className="border-b border-border">
          <td className="px-6 py-4">Idealer Einsatzbereich</td>
          <td className="px-6 py-4">Mehrfamilienhäuser</td>
          <td className="px-6 py-4">Kleine bis mittlere Gewerbe</td>
          <td className="px-6 py-4">Konzerne, Universitäten, Kliniken</td>
        </tr>
        <tr className="border-b border-border bg-surface-muted/50">
          <td className="px-6 py-4">Administrative Komplexität</td>
          <td className="px-6 py-4">Minimal</td>
          <td className="px-6 py-4">Moderat</td>
          <td className="px-6 py-4">Hoch (Softwaregestützt)</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p className="mt-6 text-[15px] leading-relaxed text-foreground-muted">
    Die Wahl des richtigen Systems ist entscheidend für die langfristige Sicherheit und Betriebseffizienz. Während eine Z-Anlage durch Einfachheit besticht, bietet eine GHS-Anlage die notwendige Granularität für komplexe Organisationsstrukturen. Unsere Experten analysieren Ihre Anforderungen detailliert und erarbeiten ein Konzept, das Ihre Sicherheitsziele wirtschaftlich optimal umsetzt.
  </p>
  <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
    Dabei berücksichtigen wir auch hybride Ansätze, die mechanische Grundsicherung mit elektronischer Flexibilität an neuralgischen Punkten kombinieren. Dies ermöglicht eine dynamische Rechtevergabe in hochfrequentierten Bereichen, ohne die Robustheit der mechanischen Kernarchitektur zu kompromittieren.
  </p>
</Section>

{/* Erweitertes FAQ */}
<Section tone="muted">
  <h2 className="text-3xl font-bold text-foreground mb-8">Umfassender Experten-FAQ</h2>
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">1. Wie unterscheidet sich eine HS-Anlage technisch von einer GHS-Anlage?</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">Eine Hauptschlüsselanlage (HS) operiert auf einem zweistufigen Hierarchiemodell: Ein übergeordneter Schlüssel schließt alle Zylinder, während die Einzelschlüssel nur spezifische, ihnen zugeordnete Schließzylinder betätigen können. Eine Generalhauptschlüsselanlage (GHS) hingegen implementiert eine mehrstufige Matrix. Hier gibt es neben dem GHS, der alles schließt, Gruppenhauptschlüssel (für Abteilungen oder Gebäudeabschnitte) und Einzelschlüssel. Die GHS-Anlage erfordert eine wesentlich komplexere mechanische Kodierung im Zylinderkern (oft über zusätzliche Stiftreihen oder Profilrippen) und zwingend eine präzise mathematische Schließplanberechnung, um die notwendige Kombinatorik sicher abzubilden.</p>
    </div>
    <div>
      <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">2. Welche kryptografischen oder mechanischen Sicherheitsmerkmale bieten moderne Schließzylinder?</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">Hochsicherheitszylinder verfügen über einen integralen Bohr-, Zieh- und Schlagschutz. Dies wird durch den Einsatz von gehärteten Stahlstiften, Hartmetallstegen und komplexen Schlüsselprofilen (parazentrische Profile) erreicht. Zylinder der VdS-Klassen BZ oder BZ+ bieten zudem einen erweiterten Abreißschutz. Darüber hinaus verwenden moderne Systeme im Enterprise-Sektor oft Kopierschutzmaßnahmen wie bewegliche Elemente (z. B. Rollen oder Kugeln) im Schlüsselreiden, die durch den Zylinder abgefragt werden. Diese multidimensionalen Abfragen machen ein unautorisiertes Kopieren durch 3D-Druck oder klassisches Fräsen nahezu unmöglich und sichern die organisatorische Hoheit über die Schließanlage.</p>
    </div>
    <div>
      <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">3. Wie wird die Skalierbarkeit einer Schließanlage während der initialen Planungsphase sichergestellt?</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">Die Skalierbarkeit wird durch die Allokation von sogenannten &apos;Erweiterungspuffern&apos; oder &apos;Reservegruppen&apos; im Schließplan gewährleistet. Bei der Berechnung der Matrix lassen wir bewusst Permutationen ungenutzt, die logisch an bestehende Strukturen anschließen. Dies erfordert eine vorausschauende Analyse des Gebäudes – beispielsweise die Berücksichtigung zukünftiger Anbauten oder veränderter Nutzungsstrukturen. Ein professionell geplanter Schließplan kann so um 20% bis 30% erweitert werden, ohne dass ein Austausch der bestehenden Zentralzylinder (z.B. Außentüren) notwendig wird. Dies schützt das initiale Investment maßgeblich.</p>
    </div>
    <div>
      <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">4. Was sind die kritischen Risikofaktoren bei der Verwaltung komplexer Schließpläne?</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">Das größte Risiko in der Administration einer Schließanlage liegt im Verlust der organisatorischen Kontrolle über ausgegebene Schlüssel (Schlüsselverlust) und der mangelhaften Dokumentation von Berechtigungsänderungen. Mechanische Anlagen besitzen keine Protokollierungsfunktion oder Revokations-Fähigkeit (Echtzeit-Sperrung). Ein verlorener GHS oder Hauptschlüssel kompromittiert potenziell die Sicherheit großer Gebäudeteile und kann einen kostenintensiven Austausch ganzer Gruppen erforderlich machen. Daher ist eine strikte, softwaregestützte Schlüsselverwaltung, die Ausgabeprotokolle, Rückgabetermine und Haftungserklärungen zentral erfasst, im Enterprise-Kontext absolut unerlässlich.</p>
    </div>
    <div>
      <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">5. In welchen Szenarien ist eine hybride Architektur (Mechanik + Elektronik) ökonomisch sinnvoll?</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">Eine hybride Architektur entfaltet ihren optimalen ROI in Umgebungen mit hoher Fluktuation bei gleichzeitiger Anforderung an physische Robustheit. Neuralgische Punkte – wie Haupteingänge, Serverräume oder Bereiche mit temporären Zugängen (z.B. Fremdfirmen) – werden mit mechatronischen oder rein elektronischen Komponenten (Wandleser, elektronische Zylinder) ausgestattet. Dies erlaubt eine zeitliche und räumliche Flexibilität sowie eine sofortige Sperrung bei Schlüsselverlust. Für Bereiche mit statischen Berechtigungen (z.B. Bürotüren der Stammbelegschaft, Technikräume) bleibt die mechanische Lösung aufgrund der geringeren Anschaffungs- und Wartungskosten die überlegene Wahl. Diese Dual-Architektur optimiert das Verhältnis aus Investitionskosten (CAPEX) und laufenden Betriebskosten (OPEX).</p>
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
