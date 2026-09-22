import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';
import { EnterpriseROICalculator } from '@/components/calculator/enterprise-roi-calculator';


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
            <div className="text-[15px] leading-relaxed text-foreground-muted md:text-base space-y-4">
              <p>{page?.intro ?? 'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Systeme in einfacher Sprache und planen Ihre Anlage so, dass sie später erweitert werden kann.'}</p>

              <p>Mechanische Schließanlagen bilden seit Jahrzehnten das Rückgrat der Gebäudesicherheit. Sie bieten eine robuste, stromunabhängige Lösung, um Zutrittsberechtigungen physisch zu steuern. Die architektonische Methodik hinter einer solchen Anlage ist komplexer, als es auf den ersten Blick scheint. Es geht nicht nur darum, Zylinder und Schlüssel bereitzustellen, sondern ein in sich logisches, hierarchisches System aufzubauen, das den organisatorischen Strukturen eines Unternehmens oder einer Wohnanlage entspricht.</p>

              <p>Der Weg dorthin ist immer derselbe: Sie erfassen Ihr Objekt, Ihre Nutzer und Ihre Türen. Daraus entsteht ein Schließplan, den wir gemeinsam mit Ihnen abstimmen. Erst danach wird gefertigt. Eine detaillierte Planung berücksichtigt dabei nicht nur den Status quo, sondern auch zukünftige Entwicklungen. Mechanische Anlagen stoßen an ihre Grenzen, wenn sich Berechtigungen häufig ändern oder Schlüssel verloren gehen. Genau hier setzt die Schwachstellen-Analyse bei Wohn- und Geschäftsgebäuden an. Die Abwägung zwischen mechanischen und mechatronischen oder rein elektronischen Systemen ist eine strategische Entscheidung, bei der wir Sie mit unserer Expertise begleiten.</p>
            </div>

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


      {/* Enterprise ROI Calculator */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
                <SectionHeading
                  eyebrow="Wirtschaftlichkeit"
                  title="Mechanik vs. Elektronik: Wann rechnet sich der Umstieg?"
                  lead="Schlüsselverluste und Verwaltungsaufwand verursachen bei mechanischen Anlagen oft verdeckte Kosten. Berechnen Sie das Einsparpotenzial."
                />
                <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground-muted">
                    <p>
                        Die Investition in ein elektronisches Zutrittskontrollsystem scheint initial oft hoch.
                        Doch bei näherer Betrachtung der Total Cost of Ownership (TCO) wandelt sich das Bild dramatisch.
                        Jeder verlorene mechanische Schlüssel aus einer Generalhauptschlüsselanlage kann den Austausch
                        zahlreicher Zylinder nach sich ziehen – ein immenser finanzieller und organisatorischer Aufwand.
                    </p>
                    <p>
                        Zusätzlich verschlingt die manuelle Verwaltung von mechanischen Schlüsseln in größeren Organisationen
                        wertvolle Arbeitszeit. Wer hat welchen Schlüssel? Wurde er bei Austritt zurückgegeben?
                        Mit elektronischen Systemen werden Berechtigungen per Klick entzogen oder erteilt.
                    </p>
                    <p>
                        Unser interaktiver Enterprise ROI-Kalkulator gibt Ihnen einen ersten Richtwert, ab wann sich
                        die Modernisierung für Ihr Objekt amortisiert und wie stark Sie Ihre administrativen Prozesse verschlanken können.
                    </p>
                </div>
            </div>
            <EnterpriseROICalculator />
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


      {/* Fachliche Methodik und Zertifizierungen */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Methodik & Normen"
            title="Sicherheit durch zertifizierte Standards"
          />
          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-foreground-muted">
            <p>
              Die Konzeption einer Schließanlage unterliegt strengen normativen Vorgaben.
              Zertifizierungen nach DIN EN 1303, DIN 18252 und VdS-Klassen stellen sicher,
              dass die verbauten Zylinder und Schlüssel einen definierten Widerstand gegen
              Angriffsmethoden wie Aufbohren, Kernziehen, Picking oder die Schlagschlüsselmethode aufweisen.
            </p>
            <p>
              Besonders im gewerblichen Bereich und bei sicherheitskritischen Infrastrukturen
              ist die Wahl der richtigen VdS-Klasse entscheidend für den Versicherungsschutz.
              Wir analysieren Ihr Objekt ganzheitlich und empfehlen Systeme, die nicht nur
              organisatorisch sinnvoll sind, sondern auch den geforderten mechanischen Widerstandswert (Resistance Class) erfüllen.
            </p>
            <p>
              Ein wesentlicher Bestandteil unserer Methodik ist die nachhaltige Schließplanerstellung.
              Durch die geschickte Ausnutzung von Profilvarianzen und Stiftzuhaltungen sorgen wir dafür,
              dass Ihre Anlage auch Jahre nach der Installation um weitere Schließzylinder und
              Schlüssel erweitert werden kann, ohne die bestehende Sicherheitsarchitektur zu kompromittieren.
              Dieser vorausschauende Ansatz schützt Ihre Investition langfristig.
            </p>

            <h3 className="mt-8 text-lg font-bold text-foreground">Leistungsstufen im Vergleich</h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-surface-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">Leistungsstufe</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">Geeignet für</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">Besonderheiten</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">Kopierschutz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">Basis (DIN EN 1303)</td>
                    <td className="px-4 py-3 text-foreground-muted">Einfamilienhäuser, kleine Büros</td>
                    <td className="px-4 py-3 text-foreground-muted">Grundlegender Einbruchschutz</td>
                    <td className="px-4 py-3 text-foreground-muted">Patentiertes Profil</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">Standard (VdS Klasse A)</td>
                    <td className="px-4 py-3 text-foreground-muted">Mehrfamilienhäuser, Gewerbe</td>
                    <td className="px-4 py-3 text-foreground-muted">Erhöhter Bohr- und Ziehschutz</td>
                    <td className="px-4 py-3 text-foreground-muted">Technischer und rechtlicher Kopierschutz</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">High-End (VdS Klasse B/BZ)</td>
                    <td className="px-4 py-3 text-foreground-muted">Banken, Juweliere, Behörden</td>
                    <td className="px-4 py-3 text-foreground-muted">Höchster Widerstand gegen zerstörende Angriffe</td>
                    <td className="px-4 py-3 text-foreground-muted">Lebenslanger Markenschutz, 3D-Kopierschutz</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-foreground-muted">
                Die Wahl der Leistungsstufe hängt stark vom Gefährdungspotenzial ab. Für komplexe Anlagen
                empfehlen wir die Kombination verschiedener Stufen (z.B. High-End für die Außenhautsicherung
                und Standard für Innentüren), um ein optimales Preis-Leistungs-Verhältnis zu erzielen.
            </p>
          </div>
        </div>
      </Section>

      {/* Erweiterte Fachfragen */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Experten-FAQ"
          title="Tiefgreifende Antworten zu Schließanlagen"
          lead="Detailliertes Fachwissen zu Planung, Erweiterbarkeit und Sicherheit."
        />
        <div className="mt-8 space-y-4 max-w-3xl mx-auto">
          <details className="group rounded-lg border border-border bg-surface p-4">
            <summary className="cursor-pointer text-[15px] font-bold text-foreground">
              Wie wird die Schließgeheimniskombination bei komplexen Anlagen berechnet?
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
              Die Berechnung erfolgt mathematisch über Permutationsmatrizen, basierend auf der Anzahl der
              Stiftzuhaltungen und den Profilvariationen (z.B. parazentrische Profile). Bei einer
              Generalhauptschlüsselanlage müssen alle untergeordneten Schließungen so berechnet werden,
              dass keine unautorisierten Schließungen (&quot;Geisterschließungen&quot;) durch Kreuzpermutationen
              entstehen. Dies erfordert hochentwickelte Berechnungssoftware und eine vorausschauende
              Reserveplanung für zukünftige Erweiterungen.
            </p>
          </details>
          <details className="group rounded-lg border border-border bg-surface p-4">
            <summary className="cursor-pointer text-[15px] font-bold text-foreground">
              Was ist der Unterschied zwischen rechtlichem und technischem Kopierschutz?
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
              Ein rechtlicher Kopierschutz basiert auf einem angemeldeten Patent oder Markenschutz.
              Rohlinge dürfen für die Dauer des Patents nicht frei auf dem Markt gehandelt werden;
              Kopien erfordern zwingend die Sicherungskarte. Der technische Kopierschutz erschwert
              das unautorisierte Nachmachen durch komplexe Fräsungen, Hinterschnitte oder bewegliche
              Elemente (z.B. Kugeln oder Rollen im Schlüssel), die von gängigen 3D-Druckern oder
              Kopiermaschinen nicht exakt abgebildet werden können.
            </p>
          </details>
          <details className="group rounded-lg border border-border bg-surface p-4">
            <summary className="cursor-pointer text-[15px] font-bold text-foreground">
              Wie funktioniert der Bohr- und Ziehschutz (BZ) in VdS-zertifizierten Zylindern?
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
              Zylinder mit hohem VdS-Zertifikat verfügen über gehärtete Stahlstifte und Hartmetallplatten
              im Zylinderkern und -gehäuse. Beim Versuch aufzubohren, greifen spezielle Schutzmechanismen:
              Bohrer werden abgelenkt, brechen ab oder verkeilen sich. Der Kernziehschutz wird oft durch
              eine Stahleinlage im Gehäuse realisiert, die ein Herausreißen des Zylinderkerns mit
              Spezialwerkzeugen (&quot;Glocke&quot;) verhindert. Zusätzlich raten wir immer zu
              Sicherheitsbeschlägen mit Zylinderabdeckung.
            </p>
          </details>
          <details className="group rounded-lg border border-border bg-surface p-4">
            <summary className="cursor-pointer text-[15px] font-bold text-foreground">
              Können mechanische und elektronische Komponenten in einer Anlage kombiniert werden?
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
              Ja, mechatronische Anlagen verbinden beide Welten. Häufig werden Außen- und stark
              frequentierte Innentüren mit elektronischen Schließzylindern oder Wandlesern
              ausgestattet, während weniger kritische Bereiche (wie Lagerräume) rein mechanisch
              geschlossen bleiben. Der Vorteil: Ein einziger Hybrid-Schlüssel (mit mechanischer
              Fräsung und integriertem RFID-Chip) bedient beide Systemtypen nahtlos.
            </p>
          </details>
          <details className="group rounded-lg border border-border bg-surface p-4">
            <summary className="cursor-pointer text-[15px] font-bold text-foreground">
              Was passiert bei Verlust eines Hauptschlüssels und wie minimiert man das Risiko?
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
              Bei rein mechanischen Anlagen ist der Verlust eines (General-)Hauptschlüssels
              ein worst-case-Szenario. Um den Schutz wiederherzustellen, müssen oft alle betroffenen
              Zylinder ausgetauscht werden. Elektronische Zutrittskontrollen minimieren dieses
              Risiko, da ein verlorenes Medium sofort gesperrt werden kann. Für mechanische Anlagen
              empfehlen wir, Hauptschlüssel nur für Notfälle (z.B. Feuerwehrschließung)
              einzusetzen und den regulären Betrieb über untergeordnete Gruppenschlüssel abzuwickeln.
            </p>
          </details>
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
