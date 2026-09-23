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
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';

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

export default async function SchliessanlagenPage() {
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


      {/* Fachliche Tiefenbetrachtung: Architektonische Methodik und Strukturebenen */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Die Anatomie hochkomplexer mechanischer Schließanlagen"
          lead="Eine tiefgreifende Analyse der strukturellen Ebenen, technischen Spezifikationen und der Planungsmethodik für Enterprise-Umgebungen."
        />
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
          <p>
            Die Konzeption einer mechanischen Schließanlage für komplexe Gebäudestrukturen erfordert ein Höchstmaß an präziser Planung und architektonischem Weitblick. Es geht nicht nur darum, Türen zu verschließen, sondern vielmehr um die Orchestrierung von Zutrittsberechtigungen in einer mehrdimensionalen Matrix. Eine sorgfältig geplante Anlage spiegelt die Organisationsstruktur eines Unternehmens wider und übersetzt diese in physische Zugangskontrollen.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Strukturelle Hierarchien und Ebenenmodelle</h3>
          <p>
            In der Welt der Schließtechnik unterscheiden wir fundamental zwischen verschiedenen Hierarchieebenen. Die Basis bildet der Einzelschlüssel, gefolgt von Gruppenschlüsseln, Hauptschlüsseln und schließlich dem Generalhauptschlüssel (GHS). Ein GHS-System ist ein Meisterwerk der Feinmechanik. Es ermöglicht die Abbildung beliebig vieler und beliebig komplexer Hierarchiestufen. Jeder Zylinder in einem solchen System verfügt über spezifische Stiftzuhaltungen, die mathematisch exakt berechnet werden, um Überschneidungen zu vermeiden und maximale Sicherheit zu garantieren.
          </p>
          <p>
            Die mathematische Kombinatorik bei der Berechnung von Schließanlagen ist von entscheidender Bedeutung. Bei einer Anlage mit Tausenden von Zylindern muss sichergestellt sein, dass kein Schlüssel versehentlich einen nicht autorisierten Zylinder öffnet. Dies wird durch komplexe Profilvariationen und mehrdimensionale Stiftanordnungen realisiert. Moderne mechanische Systeme nutzen zudem patentierte Profile und bewegliche Elemente im Schlüssel, um unberechtigte Schlüsselkopien, beispielsweise durch 3D-Druckverfahren, effektiv zu verhindern.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Materialwissenschaft und physische Resilienz</h3>
          <p>
            Ein weiterer kritischer Aspekt ist die Materialbeschaffenheit der Komponenten. Hochsicherheitszylinder werden aus gehärtetem Stahl, Neusilber und speziellen Legierungen gefertigt. Sie müssen extremen mechanischen Belastungen standhalten – von Aufbohrversuchen über Kernziehen bis hin zur zerstörungsfreien Überwindungstechnik wie der Schlagschlüsselmethode oder dem Lockpicking. Integrierte Hartmetallstifte und komplexe Geometrien der Schlüsselkanäle bilden hierbei die erste Verteidigungslinie.
          </p>
          <p>
            Darüber hinaus spielt die Langlebigkeit eine zentrale Rolle. Eine mechanische Schließanlage ist eine langfristige Investition. Die Zylinder müssen über Jahrzehnte hinweg zehntausende von Schließzyklen verschleißfrei überstehen. Dies erfordert präzise Fertigungstoleranzen im Mikrometerbereich und den Einsatz spezieller Schmiermittel, die weder verharzen noch Schmutz binden.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Zukunftssicherheit durch modulares Anlagendesign</h3>
          <p>
            Eine der größten Herausforderungen bei der Planung ist die Antizipation zukünftiger Veränderungen. Unternehmen wachsen, Abteilungen werden umstrukturiert, neue Gebäude kommen hinzu. Eine starre Schließanlage würde hier schnell an ihre Grenzen stoßen. Daher setzen wir auf modulare Anlagenarchitekturen. Dies bedeutet, dass bei der initialen Berechnung sogenannte &quot;Reserven&quot; eingeplant werden. Diese mathematischen Freiräume erlauben es, das System später zu erweitern, ohne die bestehende Sicherheitsstruktur zu kompromittieren.
          </p>
          <p>
            Modulare Zylindersysteme bieten zudem den Vorteil, dass die Länge des Zylinders bei einem Umzug in ein anderes Türblatt flexibel angepasst werden kann. Dies schützt die Investition und reduziert die Total Cost of Ownership (TCO) signifikant.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Integration von Mechanik und Elektronik (Mechatronik)</h3>
          <p>
            Auch wenn der Fokus auf der Mechanik liegt, ist die Konvergenz mit elektronischen Systemen unaufhaltsam. In hochkritischen Bereichen werden rein mechanische Zylinder zunehmend durch mechatronische Systeme ergänzt. Dabei kommuniziert ein Mikrochip im Schlüsselkopf mit einer Elektronik im Zylinder. Dies kombiniert die absolute Robustheit der Mechanik mit der Flexibilität der Elektronik (z. B. zeitlich befristete Zutrittsrechte oder die sofortige Sperrung verlorener Schlüssel).
          </p>
          <p>
            Die strategische Planung einer solchen hybriden Infrastruktur erfordert tiefgreifendes Wissen über beide Domänen. Es gilt, die Schnittstellen zwischen mechanischer und elektronischer Schließebene nahtlos zu gestalten und ein homogenes Benutzererlebnis zu schaffen.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Zertifizierungen, Normen und Versicherungsrechtliche Relevanz</h3>
          <p>
            Im professionellen Umfeld ist die Einhaltung einschlägiger Normen wie der DIN 18252, DIN EN 1303 sowie der VdS-Richtlinien nicht nur ein Qualitätsmerkmal, sondern eine zwingende juristische Notwendigkeit. Im Falle eines Einbruchs prüfen Sachversicherer akribisch, ob die verbauten Schließzylinder den vereinbarten Sicherheitsklassen entsprechen. Eine Abweichung kann zum vollständigen Verlust des Versicherungsschutzes führen.
          </p>
          <p>
            Die DIN EN 1303 definiert beispielsweise detaillierte Leistungsanforderungen an Schließzylinder in Bezug auf Verschlusssicherheit, Korrosionsbeständigkeit, Feuerwiderstand und Angriffswiderstand. Hochwertige Enterprise-Anlagen werden systematisch auf die höchsten Stufen dieser Skalen projektiert. So wird sichergestellt, dass nicht nur der physische Zugang reglementiert ist, sondern auch das unternehmerische Risiko im Schadensfall rechtssicher minimiert wird. Die lückenlose Dokumentation durch Sicherungskarten und zertifizierte Montageprotokolle bildet hierbei das fundamentale Rückgrat der Compliance.
          </p>
        </div>
      </Section>

      {/* ROI Calculator Injection */}
      <Section>
        <SectionHeading
          eyebrow="Wirtschaftlichkeit"
          title="Enterprise ROI- und Ladezeit-Kalkulator"
          lead="Berechnen Sie den Return on Investment und die langfristigen Kostenvorteile einer professionell geplanten Schließanlage."
        />
        <div className="mt-8">
          <EnterpriseRoiCalculator />
        </div>
      </Section>

      {/* Erweiterter FAQ Bereich mit fachlicher Tiefe */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Experten-FAQ"
          title="Tiefgehende Antworten zur Schließtechnik"
          lead="Detailwissen für Facility Manager, Architekten und Sicherheitsverantwortliche."
        />
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">1. Wie wird die mathematische Sicherheit gegen Schlüsseldeplikation gewährleistet?</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Moderne Hochsicherheitssysteme nutzen patentierte, mehrdimensionale Schlüsselprofile. Dies beinhaltet unterschnittene Profile, bewegliche Elemente (wie z. B. gefederte Kugeln oder Röllchen) im Schlüssel und komplexe seitliche Codierungen. Diese technischen Barrieren machen es nahezu unmöglich, den Schlüssel mit konventionellen Methoden (einschließlich 3D-Druck oder Fräsen ohne Original-Rohling) zu kopieren. Zudem ist die Rohlingsausgabe strikt restriktiert und werkseitig dokumentiert.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">2. Was bedeutet &quot;Anlagenreserve&quot; und wie wird sie berechnet?</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die Anlagenreserve ist ein mathematischer Puffer im Schließplan. Bei der Konstruktion der Matrix werden bestimmte Stiftkombinationen bewusst ausgelassen und für zukünftige Erweiterungen &quot;reserviert&quot;. Die Berechnung erfordert eine vorausschauende Analyse des potenziellen Unternehmenswachstums. Eine zu knapp bemessene Reserve erfordert bei Erweiterungen einen kompletten Anlagentausch; eine zu großzügige Reserve kann die maximal mögliche Sicherheit (Anzahl der theoretischen Schließverschiedenheiten) reduzieren. Der Sweet-Spot liegt meist bei einer Reserve von 20-30% in strategisch wichtigen Gruppen.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">3. Wie verhält sich die Mechanik bei extremen klimatischen Bedingungen?</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Für Außenbereiche oder aggressive Umgebungen (z. B. maritime Umgebungen oder Industrieanlagen mit hoher Staubbelastung) müssen Zylinder spezielle Spezifikationen erfüllen. Dies beinhaltet den Einsatz von seewasserfesten Materialien (wie speziellen Messinglegierungen oder Edelstahl), integrierte Staub- und Wetterschutzkappen sowie die Schmierung mit temperaturbeständigen Hochleistungsgleitmitteln, die auch bei -20°C nicht verharzen und bei +60°C nicht auslaufen.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">4. Was ist der genaue Unterschied zwischen VdS-Klasse B und VdS-Klasse C bei Schließzylindern?</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Die VdS-Zertifizierung definiert den Widerstandsgrad gegen physische Angriffe. Klasse B bietet einen mittleren bis hohen Schutz und ist für den gewerblichen Bereich oft ausreichend (geprüfter Bohr- und Ziehschutz). Klasse C stellt die höchste Sicherheitsstufe dar. Zylinder dieser Klasse verfügen über massive Hartmetallschutzelemente im Gehäuse und Kern, die extremen Angriffen (wie schwerem Bohrgerät oder Kernziehwerkzeugen) deutlich länger standhalten. Für Hochrisikobereiche ist Klasse C oft eine Vorgabe der Sachversicherer.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)]">5. Wie geht man mit dem Verlust eines Generalhauptschlüssels (GHS) um?</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              Der Verlust eines GHS ist das Worst-Case-Szenario, da dieser alle Zylinder der Anlage schließt. In rein mechanischen Anlagen erfordert dies oft den Austausch der gesamten Anlage, um die Sicherheit wiederherzustellen. Um dieses Risiko zu minimieren, empfehlen wir in der Planung, sensible Bereiche so zu entkoppeln, dass der GHS diese bewusst nicht schließt, oder mechatronische Zylinder in der Außenhülle einzusetzen. Bei Letzteren kann ein verlorener (hybrider) GHS elektronisch gesperrt werden, ohne dass die mechanische Struktur der Anlage verändert werden muss.
            </p>
          </div>
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
