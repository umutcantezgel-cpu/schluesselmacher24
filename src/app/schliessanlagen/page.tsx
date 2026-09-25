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


      {/* Enterprise ROI Kalkulator */}
      <Section id="roi-kalkulator">
        <SectionHeading
          eyebrow="Wirtschaftlichkeit"
          title="Interaktiver Enterprise ROI- und Ladezeit-Kalkulator"
          lead="Berechnen Sie die langfristige Rentabilität und Effizienz einer maßgeschneiderten Schließanlage im Vergleich zu Standardlösungen."
        />
        <div className="mt-8">
          <EnterpriseROICalculator />
        </div>

        <div className="mt-12 space-y-6 text-[15px] leading-relaxed text-foreground-muted md:text-base">
          <h3 className="text-xl font-bold text-foreground">Mechanische Schließanlagen: Die architektonische Methodik</h3>
          <p>
            Die Planung einer mechanischen Schließanlage ist ein hochkomplexer Prozess, der weit über das bloße
            Zusammenstellen von Zylindern und Schlüsseln hinausgeht. Es handelt sich um eine präzise architektonische
            Methodik, bei der Sicherheitsanforderungen, organisatorische Hierarchien und physische Gegebenheiten
            in einem kohärenten System vereint werden. Jede Schließanlage wird als Unikat konzipiert, das exakt
            auf die spezifischen Bedürfnisse eines Objekts zugeschnitten ist. Die Grundlage jeder Planung bildet
            der Schließplan. Dieses Dokument ist nicht nur eine einfache Liste von Türen und Berechtigungen, sondern
            das strategische Herzstück des gesamten Systems. Im Schließplan wird in einer mehrdimensionalen Matrix
            definiert, welcher Schlüssel welche Zylinder schließen darf. Dabei müssen verschiedene Ebenen und Hierarchien
            berücksichtigt werden. Eine einfache Zentralschlossanlage für ein Mehrfamilienhaus erfordert eine grundlegend
            andere Herangehensweise als eine komplexe Generalhauptschlüsselanlage (GHS-Anlage) für einen weitläufigen
            Industriekomplex. Die architektonische Herausforderung besteht darin, diese Strukturen so aufzubauen,
            dass sie nicht nur den aktuellen Anforderungen genügen, sondern auch zukünftige Entwicklungen und
            Erweiterungen antizipieren.
          </p>
          <p>
            Ein zentraler Aspekt bei der Konzeption ist die Analyse der sogenannten Schließkreise. Ein Schließkreis
            umfasst eine Gruppe von Zylindern, die durch einen gemeinsamen Gruppenschlüssel (GS) oder Hauptschlüssel (HS)
            bedient werden können. Die Definition dieser Kreise erfordert ein tiefes Verständnis für die Arbeitsabläufe
            und Zutrittsberechtigungen innerhalb der Organisation. Beispielsweise könnten in einem Krankenhaus
            verschiedene Abteilungen (wie Chirurgie, Innere Medizin, Verwaltung) jeweils eigene Schließkreise bilden.
            Der Chefarzt der Chirurgie erhält einen Gruppenschlüssel für seinen Bereich, während der ärztliche Direktor
            einen Generalhauptschlüssel (GHS) besitzt, der alle Bereiche schließt. Die technische Umsetzung solcher
            Hierarchien erfolgt durch hochpräzise mechanische Codierungen im Inneren der Profilzylinder. Durch die
            Verwendung von Sperrstiften unterschiedlicher Länge und Position sowie durch komplexe Profilvariationen
            im Schlüsselkanal werden die verschiedenen Berechtigungsebenen physisch realisiert. Moderne Schließanlagen
            nutzen dabei patentierte Profile und zusätzliche Sicherheitsmerkmale wie Kopierschutz und Bohr- oder
            Ziehschutz, um ein Höchstmaß an Sicherheit zu gewährleisten. Die Berechnung dieser mechanischen Permutationen
            ist eine anspruchsvolle Aufgabe, die heute durch spezialisierte Software unterstützt wird, um Konflikte
            (sogenannte Schließüberschneidungen) absolut auszuschließen.
          </p>
          <h3 className="text-xl font-bold text-foreground">Sicherheitsarchitekturen und Systemauswahl</h3>
          <p>
            Die Wahl des richtigen Systems ist entscheidend für die langfristige Sicherheit und Funktionalität.
            Die verschiedenen Anlagentypen – von der Gleichschließung über die Zentralschlossanlage (Z-Anlage)
            und Hauptschlüsselanlage (HS-Anlage) bis hin zur Generalhauptschlüsselanlage (GHS-Anlage) – bieten
            unterschiedliche Grade an Komplexität und Flexibilität. Eine Gleichschließung ist die einfachste Form,
            bei der mehrere Zylinder mit demselben Schlüssel bedient werden können. Dies ist ideal für Einfamilienhäuser
            oder kleine Büros ohne hierarchische Strukturen. Die Zentralschlossanlage ist typisch für Mehrfamilienhäuser.
            Hier gibt es einen zentralen Zylinder (z.B. die Haustür), der von allen Parteien mit ihren jeweiligen
            Wohnungsschlüsseln geschlossen werden kann. Die Wohnungstüren selbst können jedoch nur mit dem jeweiligen
            Einzelschlüssel geöffnet werden. Dies erfordert eine spezielle Stiftanordnung im Zentralzylinder, die
            die verschiedenen Schließungen der Einzelschlüssel aufnimmt.
          </p>
          <p>
            Die Hauptschlüsselanlage führt eine hierarchische Ebene ein. Es gibt Einzelschlüssel für spezifische
            Türen und einen übergeordneten Hauptschlüssel, der alle Zylinder der Anlage schließen kann. Diese
            Struktur eignet sich für Schulen, kleine bis mittlere Unternehmen oder Hotels. Die höchste Komplexitätsstufe
            bietet die Generalhauptschlüsselanlage. Sie kombiniert mehrere Hauptschlüsselanlagen unter einem Dach.
            Unterhalb des Generalhauptschlüssels (GHS) gibt es Hauptgruppen- (HGS) und Gruppenschlüssel (GS),
            die jeweils für spezifische Abteilungen oder Gebäudeteile zuständig sind. Die Planung einer GHS-Anlage
            erfordert höchste Präzision, da die Anzahl der möglichen mechanischen Variationen begrenzt ist und
            die Anlage oft über Jahrzehnte hinweg erweiterbar bleiben muss. Wir legen großen Wert darauf,
            ausreichend Reserven für zukünftige Erweiterungen einzuplanen, sogenannte &quot;Reserve-Schließungen&quot;,
            um die Lebensdauer der Anlage zu maximieren.
          </p>
          <h3 className="text-xl font-bold text-foreground">Strukturierte Leistungsstufen und Vergleichsmatrizen</h3>
          <p>
            Um unseren Kunden die bestmögliche Entscheidungsgrundlage zu bieten, arbeiten wir mit strukturierten
            Leistungsstufen und detaillierten Vergleichsmatrizen. Diese Instrumente machen die technischen
            Unterschiede der verschiedenen Systeme transparent und quantifizierbar. Zu den wesentlichen Bewertungskriterien
            gehören der Patentschutz (Laufzeit und rechtliche Absicherung gegen unberechtigte Schlüsselkopien),
            die technische Kopiersicherheit (z.B. durch bewegliche Elemente im Schlüssel, Hinterschnitte oder
            komplexe 3D-Profile), der Manipulationsschutz (Bohr-, Zieh- und Schlagschutz) sowie die Erweiterbarkeit
            des Systems. Eine fundierte Vergleichsmatrix stellt diese Parameter für die zur Auswahl stehenden
            Fabrikate und Systeme gegenüber. So wird auf einen Blick ersichtlich, welches System das optimale
            Verhältnis von Sicherheit, Flexibilität und Wirtschaftlichkeit für das spezifische Projekt bietet.
            Darüber hinaus integrieren wir in unsere Beratung auch Lebenszykluskosten-Analysen. Eine Schließanlage
            ist eine langfristige Investition. Daher müssen neben den initialen Anschaffungskosten auch die Kosten
            für zukünftige Erweiterungen, Ersatzschlüssel und mögliche Systemmigrationen berücksichtigt werden.
            Durch die Gegenüberstellung von konventionellen und hochsicheren Systemen in einer Matrix können wir
            die langfristige Rentabilität (ROI) der verschiedenen Optionen transparent darstellen.
          </p>
          <h3 className="text-xl font-bold text-foreground">Zusätzliche FAQs zur Anlagenplanung</h3>
          <div className="space-y-4 mt-6">
            <div className="rounded-lg border border-border bg-surface px-5 py-4">
              <h4 className="font-bold text-foreground">Wie lange ist ein patentiertes Schließsystem geschützt?</h4>
              <p className="mt-2 text-sm text-foreground-muted">Der Patentschutz variiert je nach Hersteller und System, liegt in der Regel jedoch zwischen 10 und 20 Jahren. Nach Ablauf des Patents können Schlüsselrohlinge theoretisch von Drittherstellern frei produziert werden. Wir empfehlen Systeme mit möglichst langem Patentschutz oder zusätzlichem technischen Kopierschutz (Markenschutz), um unberechtigte Schlüsselkopien langfristig zu verhindern.</p>
            </div>
            <div className="rounded-lg border border-border bg-surface px-5 py-4">
              <h4 className="font-bold text-foreground">Was passiert, wenn ein Generalhauptschlüssel (GHS) verloren geht?</h4>
              <p className="mt-2 text-sm text-foreground-muted">Der Verlust eines GHS ist ein gravierendes Sicherheitsrisiko, da er potenziell Zugang zu allen Bereichen gewährt. Bei konventionellen mechanischen Anlagen muss im schlimmsten Fall die gesamte Anlage oder zumindest große Teile davon ausgetauscht werden. Dies unterstreicht die Wichtigkeit eines sorgfältigen Schlüsselmanagements und macht in hochsensiblen Bereichen hybride oder vollelektronische Systeme oft zur wirtschaftlicheren Wahl, da dort Berechtigungen einfach digital entzogen werden können.</p>
            </div>
            <div className="rounded-lg border border-border bg-surface px-5 py-4">
              <h4 className="font-bold text-foreground">Können mechanische Anlagen später elektronisch erweitert werden?</h4>
              <p className="mt-2 text-sm text-foreground-muted">Ja, viele moderne mechanische Systeme sind als sogenannte hybride Anlagen konzipiert oder können zu solchen ausgebaut werden. Dies bedeutet, dass in einer bestehenden mechanischen Anlage ausgewählte Türen (z.B. Außentüren, Serverräume) mit elektronischen Zylindern, Beschlägen oder Wandlesern nachgerüstet werden können. Die Identifikation erfolgt dann oft über einen mechatronischen Schlüssel, der sowohl den mechanischen Bart als auch einen RFID-Chip für die elektronische Zutrittskontrolle enthält.</p>
            </div>
            <div className="rounded-lg border border-border bg-surface px-5 py-4">
              <h4 className="font-bold text-foreground">Was sind Schließüberschneidungen und wie werden sie vermieden?</h4>
              <p className="mt-2 text-sm text-foreground-muted">Eine Schließüberschneidung (auch &quot;Ghost Keying&quot; genannt) tritt auf, wenn ein Schlüssel ungewollt einen Zylinder schließt, für den er eigentlich keine Berechtigung besitzt. Dies ist ein fataler Sicherheitsmangel, der oft auf unzureichende Planung oder fehlerhafte Berechnung der Stiftvariationen zurückzuführen ist. Um dies absolut auszuschließen, nutzen wir modernste Planungssoftware, die alle mathematischen Permutationen simuliert und prüft. Jede Anlage wird zudem vor der Auslieferung durch den Hersteller strengen Qualitäts- und Funktionskontrollen unterzogen.</p>
            </div>
            <div className="rounded-lg border border-border bg-surface px-5 py-4">
              <h4 className="font-bold text-foreground">Wie wird die VdS-Anerkennung bei Schließanlagen bewertet?</h4>
              <p className="mt-2 text-sm text-foreground-muted">Die VdS-Anerkennung ist ein wichtiges Qualitätsmerkmal für Schließzylinder in Deutschland, das von Sachversicherern gefordert werden kann. VdS-anerkannte Zylinder durchlaufen strenge Prüfungen hinsichtlich ihrer mechanischen Widerstandsfähigkeit gegen Einbruchversuche (wie Bohren, Ziehen, Nachschließen). Je nach Gefährdungsgrad des Objekts empfehlen wir Zylinder der entsprechenden VdS-Klasse (A, B oder C), um sowohl den Versicherungsschutz zu gewährleisten als auch ein hohes Maß an Einbruchschutz zu bieten.</p>
            </div>
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
