import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';

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



export default async function SchliessanlagenPage() {
  const page = await getPageContent(ROUTE);

  const FALLBACK_FAQ2 = [
    {
      question: 'Ab wann lohnt sich eine elektronische statt einer mechanischen Schließanlage?',
      answer: 'Elektronische Systeme amortisieren sich bei einer Fluktuation von mehr als 5% pro Jahr, da bei Verlust eines Transponders dieser einfach aus dem System gelöscht wird. Bei mechanischen Systemen müsste aus Sicherheitsgründen oft der gesamte Schließzylinder ausgetauscht werden.'
    },
    {
      question: 'Können mechanische und elektronische Systeme kombiniert werden?',
      answer: 'Ja, das nennt sich mechatronisches System. Häufig werden Außentüren und sensible Bereiche (Serverräume) elektronisch gesichert, während Innentüren mechanisch bleiben. Das optimiert die Investitionskosten bei gleichzeitig hoher Sicherheit.'
    },
    {
      question: 'Was ist eine Reserve-Profilierung und warum ist sie wichtig?',
      answer: 'Bei der Planung einer Anlage werden sogenannte Reserve-Schließungen einkalkuliert. Das bedeutet, das System wird so berechnet, dass in Zukunft weitere Zylinder oder neue Abteilungen hinzugefügt werden können, ohne dass sich Profilüberschneidungen ergeben.'
    },
    {
      question: 'Wie lange dauert die Lieferung einer maßgefertigten Schließanlage?',
      answer: 'Nach Freigabe des Schließplans durch Sie, dauert die Fertigung einer mechanischen Anlage in der Regel 2 bis 3 Wochen. Elektronische Systeme können aufgrund komplexerer Programmierung und Bauteilen bis zu 4 Wochen in Anspruch nehmen.'
    },
    {
      question: 'Wer verwaltet die Schlüssel und Transponder nach der Installation?',
      answer: 'Sie erhalten eine Sicherungskarte (Mechanik) oder Administratoren-Rechte in der Software (Elektronik). Bei elektronischen Anlagen bieten wir auch Managed Services an, bei denen wir die Rechteverwaltung und Pflege aus der Ferne für Sie übernehmen.'
    }
  ];
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ2;
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
              {page?.intro ?? (
                <>
                  Eine Schließanlage ist das zentrale Nervensystem der Gebäudesicherheit. Sie regelt durch präzise mechanische oder elektronische Hierarchien, wer zu welcher Zeit welche Tür öffnen darf. Im Gegensatz zu einfachen Einzelschließungen erfordert die Konzeption einer Schließanlage ein tiefes Verständnis für die organisatorischen Abläufe, Flucht- und Rettungswege sowie die langfristige Skalierbarkeit des Gebäudes.
                </>
              )}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted md:text-base">
              Die architektonische Methodik bei der Planung basiert auf der Erstellung eines detaillierten Schließplans. Dieser Matrix-Ansatz kreuzt sämtliche Zugangspunkte (Zylinder, Beschläge, Vorhängeschlösser) mit den Nutzergruppen (Geschäftsführung, Haustechnik, Reinigung, externe Dienstleister). Das Ergebnis ist ein mathematisch exaktes Berechtigungskonzept, das sowohl höchste Sicherheitsstandards erfüllt als auch im Alltag reibungslos funktioniert. Besonderes Augenmerk liegt dabei auf der Erweiterbarkeit (Reserve-Profilierungen), um zukünftige Anbauten oder Umstrukturierungen ohne Austausch der gesamten Anlage abbilden zu können.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted md:text-base">
              Unsere Fachkompetenz umfasst die gesamte Bandbreite: von der klassischen Zentralschlossanlage (Z-Anlage) für Mehrfamilienhäuser, über Hauptschlüsselanlagen (HS-Anlagen) für kleine Betriebe, bis hin zu komplexen Generalhauptschlüsselanlagen (GHS-Anlagen) mit hunderten Zylindern und mehrstufigen Hierarchien für große Industrie- oder Bürokomplexe.
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

          <div className="mt-16">
            <h3 className="text-xl font-bold text-foreground">Leistungsstufen Matrix</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">
              Detaillierte Analyse der Sicherheitsarchitektur nach Anlagentyp.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-[14px] text-foreground-muted border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th className="p-4 font-bold text-foreground">Funktion / Merkmal</th>
                    <th className="p-4 font-bold text-foreground">Mechanisch (Z-Anlage)</th>
                    <th className="p-4 font-bold text-foreground">Mechanisch (GHS-Anlage)</th>
                    <th className="p-4 font-bold text-foreground">Elektronisch</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-foreground">Hierarchie-Tiefe</td>
                    <td className="p-4">1 Ebene (Wohnung + Zentral)</td>
                    <td className="p-4">3+ Ebenen (General, Haupt, Gruppen)</td>
                    <td className="p-4">Unbegrenzt (Software-basiert)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-foreground">Flexibilität bei Umstrukturierung</td>
                    <td className="p-4">Keine (Zylinder müssen getauscht werden)</td>
                    <td className="p-4">Gering (Abhängig von Reserve-Profilierung)</td>
                    <td className="p-4">Sehr hoch (Echtzeit per Mausklick)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-foreground">Verlust eines Schlüssels/Mediums</td>
                    <td className="p-4">Hohes Risiko (Zylindertausch nötig)</td>
                    <td className="p-4">Kritisches Risiko (Anlagentausch droht)</td>
                    <td className="p-4">Kein Risiko (Transponder wird gesperrt)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-foreground">Protokollierung / Audit Trail</td>
                    <td className="p-4">Nicht möglich</td>
                    <td className="p-4">Nicht möglich</td>
                    <td className="p-4">Vollständig (Zeit/Datum/Person)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Interaktiver Enterprise ROI- und Ladezeit-Kalkulator */}
      <Section tight>
        <SectionHeading
          eyebrow="Wirtschaftlichkeit"
          title="Enterprise ROI- & Effizienz-Kalkulator"
          lead="Berechnen Sie die langfristige Wirtschaftlichkeit und die Amortisationszeit einer modernen Schließanlage im Vergleich zu Einzelschließungen."
        />
        <div className="mt-8">
          <EnterpriseRoiCalculator />
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
