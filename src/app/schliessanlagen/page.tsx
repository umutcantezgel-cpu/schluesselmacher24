import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
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


  return (
    <>
      <PageHeader data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}
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

      {/* Einstieg und Begriffe - Substantiell Erweitert */}
      <Section tight>
        <div className="space-y-16">
          <div className="prose prose-zinc max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed md:text-base space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">Fundierte architektonische Methodik moderner Schließanlagen</h2>

            <p>
              Eine mechatronische oder rein mechanische Schließanlage bildet das sicherheitstechnische Fundament komplexer Gebäudestrukturen.
              Sie regelt mit absoluter Präzision, welche Nutzergruppen zu welchen Zeitpunkten Zutritt zu definierten Zonen erhalten.
              Dabei geht es längst nicht mehr nur um das simple Öffnen und Schließen von Türen; es geht um hochkomplexe Organisationsstrukturen,
              die sich physisch in Zylindern, Schlüsseln und Schließplänen manifestieren. Die architektonische Methodik hinter einer solchen
              Anlage erfordert eine detaillierte Analyse der bestehenden und zukünftigen Nutzerströme, der Fluktuationsraten sowie der
              spezifischen Sicherheitsanforderungen jedes einzelnen Gebäudeabschnitts.
            </p>

            <p>
              Wir betrachten jedes Schließsystem als dynamischen Organismus, der sich an die Lebenszyklen eines Unternehmens oder einer Immobilie
              anpassen muss. Eine starre, unflexible Anlage wird zwangsläufig zu einem Sicherheitsrisiko und einem massiven Kostentreiber.
              Daher implementieren wir bereits in der Planungsphase Erweiterungsreserven, berücksichtigen absehbare strukturelle Veränderungen
              und evaluieren die Skalierbarkeit des Systems. Die technische Methodik stützt sich dabei auf modernste Berechnungsmodelle,
              die nicht nur die Anzahl der Schließstellen und Schlüssel berücksichtigen, sondern auch Parameter wie Schlüsselverlustraten,
              Verwaltungsaufwand und die nahtlose Integration in bestehende IT- oder Sicherheits-Ökosysteme.
            </p>

            <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Strukturierte Leistungsstufen und Vergleichsmatrizen</h3>

            <p>
              Um die optimale Lösung für Ihr spezifisches Anwendungsszenario zu identifizieren, gliedern wir unsere Schließsysteme in
              präzise definierte Leistungsstufen (Tiers). Diese Strukturierung ermöglicht eine transparente Evaluation von Kosten, Nutzen
              und langfristigem Return on Investment (ROI).
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>STANDARD-Tier:</strong> Konzipiert für überschaubare Strukturen mit bis zu 15 Türen und moderater Mitarbeiteranzahl. Fokus liegt auf grundlegender mechanischer Sicherheit und einfacher Verwaltung.</li>
              <li><strong>ENTERPRISE-Tier:</strong> Entwickelt für komplexe Organisationen ab 15 Türen. Hier verschmelzen mechanische Präzision und erste elektronische Komponenten. Hohe Flexibilität bei Mitarbeiterfluktuation und reduzierte Verwaltungskosten bei Schlüsselverlusten.</li>
              <li><strong>CUSTOM-Tier:</strong> Die vollumfängliche, mechatronische Hochsicherheitslösung für Großprojekte und kritische Infrastrukturen. Maximale Kontrolle, Echtzeit-Audit-Logs und nahtlose Skalierbarkeit.</li>
            </ul>

            <p>
              Der Übergang zwischen diesen Stufen ist oft fließend, weshalb eine detaillierte Vorabanalyse unerlässlich ist.
              Unser Enterprise ROI-Kalkulator bietet Ihnen ein datengestütztes Entscheidungswerkzeug, um die finanziellen
              und administrativen Auswirkungen der jeweiligen Systemarchitektur bereits vor Projektbeginn präzise zu evaluieren.
            </p>
          </div>

          <div className="py-8">
            <EnterpriseRoiCalculator />
          </div>

          <div className="prose prose-zinc max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed space-y-6">

            <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Tiefergehende Analyse und Konzeption</h3>

            <p>
              Bei der architektonischen Gestaltung hochkomplexer Schließanlagen spielen zahlreiche Variablen eine kritische Rolle. Neben den
              unmittelbaren Aspekten der Zugangskontrolle müssen wir auch sekundäre und tertiäre Faktoren in unsere Berechnungsmodelle
              einbeziehen. Beispielsweise beeinflusst die topologische Verteilung der Gebäude auf einem Firmencampus die Entscheidung
              zwischen zentralisierten oder dezentralen Verwaltungsarchitekturen maßgeblich. Ein zentralisierter Ansatz bietet zwar
              Konsistenz in der Auditierung, kann aber bei physisch weit verteilten Anlagen den Verwaltungsaufwand erhöhen, sofern keine
              Over-the-Air (OTA) Update-Mechanismen implementiert sind.
            </p>
            <p>
              Des Weiteren betrachten wir die Lebenszykluskosten (Life Cycle Costs, LCC) als primäre Metrik für den langfristigen Erfolg
              eines Projekts. Die Initialkosten für Zylinder, Schlüssel und Software-Infrastruktur machen oft nur einen Bruchteil der
              tatsächlichen Total Cost of Ownership (TCO) aus. Wartungsintervalle, Batteriewechsel-Zyklen bei mechatronischen Systemen,
              Kosten für Nachschlüssel und der administrative Overhead bei Personalfluktuation sind die wahren Kostentreiber. Unsere Methodik
              zielt darauf ab, diese verdeckten Kosten bereits in der Konzeptionsphase transparent zu machen und durch intelligente
              Systemarchitektur zu minimieren.
            </p>
            <p>
              Ein weiterer wesentlicher Bestandteil unserer Planung ist die Integration in übergeordnete Gebäude- und IT-Sicherheitssysteme.
              Moderne mechatronische Schließanlagen existieren nicht isoliert. Sie kommunizieren mit Zeiterfassungssystemen,
              Gefahrenmeldeanlagen (wie Einbruch- oder Brandmeldeanlagen) und Identitätsmanagement-Lösungen (IAM). Die Auswahl offener,
              standardisierter Schnittstellen (APIs) ist hierbei von entscheidender Bedeutung, um Vendor-Lock-in-Effekte zu vermeiden und
              die Anlage zukunftssicher in das wachsende Internet of Things (IoT) des Gebäudes zu integrieren.
            </p>
            <p>
              Wir legen zudem enormen Wert auf kryptografische Sicherheit. Bei kontaktlosen oder funkbasierten Übertragungswegen müssen
              höchste Standards (wie AES-128 oder AES-256) angewandt werden, um Replay-Angriffe, Relais-Attacken oder Klonierungsversuche
              erfolgreich abzuwehren. Die physische Robustheit des Zylinders gegen mechanische Manipulation (Bohren, Ziehen, Picken)
              muss untrennbar mit der digitalen Härtung der elektronischen Komponenten einhergehen, um ein kohärentes und lückenloses
              Sicherheitskonzept zu realisieren, welches auch strengsten Revisionsprüfungen standhält.
            </p>

<h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Der Weg zur maßgeschneiderten Anlage</h3>
            <p>
              Der Evaluierungsprozess folgt einem strikten, normierten Ablauf. Im ersten Schritt digitalisieren wir Ihr Gebäude in Form
              eines detaillierten Schließplans. Dieser Plan ist das Herzstück der gesamten Anlage. Er kartografiert jede Tür, ordnet
              Sicherheitsstufen zu und verknüpft sie mit den entsprechenden Nutzergruppen. Wir nutzen modernste Softwarelösungen,
              um auch hochkomplexe Generalhauptschlüsselanlagen (GHS) fehlerfrei zu modellieren und Kollisionen in der Berechtigungsmatrix
              auszuschließen.
            </p>
            <p>
              Erst wenn dieser virtuelle Prototyp von allen Stakeholdern autorisiert wurde, beginnt die physische Fertigung der Zylinder
              und Schlüssel. Dieser zweistufige Prozess garantiert, dass die gelieferte Anlage exakt Ihren betrieblichen Realitäten
              entspricht und teure Fehlproduktionen vermieden werden.
            </p>
          </div>
        </div>
      </Section>

      {/* Fachspezifischer FAQ-Abschnitt */}
      <Section tone="muted">
        <SectionHeading eyebrow="FAQ" title="Umfassende Antworten zur Methodik" />
        <div className="mt-8 space-y-4">
          {[
            {
              q: "Wie berechnet sich der ROI bei einem Wechsel von mechanischen zu mechatronischen Systemen?",
              a: "Der ROI wird primär durch die signifikante Reduzierung der Folgekosten bei Schlüsselverlusten sowie durch den minimierten administrativen Aufwand bei Fluktuation getrieben. Bei mechatronischen Systemen entfällt der teure Austausch ganzer Zylindergruppen; stattdessen werden Berechtigungen digital entzogen. Die Amortisation erfolgt je nach Fluktuationsrate oft bereits nach 18 bis 24 Monaten."
            },
            {
              q: "Welche Erweiterungsreserven müssen zwingend bei der Initialplanung berücksichtigt werden?",
              a: "Eine zukunftssichere Planung kalkuliert grundsätzlich einen Puffer von 15 bis 20 Prozent für zusätzliche Türen und Nutzer ein. Darüber hinaus müssen bereits in der Grundstruktur der Schließhierarchie Platzhalter für künftige, noch nicht definierte Abteilungen oder Gebäudetrakte geschaffen werden, um spätere Zylinder-Kollisionen zu verhindern."
            },
            {
              q: "Wie gewährleisten Sie die Ausfallsicherheit mechatronischer Komponenten bei Stromverlust?",
              a: "Unsere mechatronischen Hochsicherheitssysteme sind vollständig autark konzipiert. Die Energieversorgung erfolgt wahlweise über langlebige Batterien in den Zylindern selbst oder wird bei der kontaktbasierten Systemen direkt durch den intelligenten Schlüssel induziert. Ein Stromausfall im Gebäude hat somit keinerlei Auswirkungen auf die grundlegende Schließfunktion."
            },
            {
              q: "Können bestehende mechanische Anlagen sukzessive in ein Enterprise-Tier System migriert werden?",
              a: "Ja, dies ist ein gängiges Szenario in der architektonischen Praxis. Wir implementieren hybride Strukturen, bei denen kritische Außenhaut- und IT-Türen mit mechatronischen Zylindern aufgerüstet werden, während weniger sensible Innentüren vorerst im mechanischen Bestand verbleiben. Beide Welten werden dabei über einen einzigen Kombischlüssel bedient."
            },
            {
              q: "Welche Sicherheitszertifizierungen sind für den VdS-konformen Versicherungsschutz relevant?",
              a: "Für einen vollständigen Versicherungsschutz müssen die Zylinder mindestens den VdS-Klassen B oder BZ (bzw. DIN EN 1303 Verschlusssicherheitsklasse 6) entsprechen. Bei Enterprise- und Custom-Tiers implementieren wir standardmäßig Systeme mit integriertem Bohr-, Zieh- und Kopierschutz, die diese strengen normativen Anforderungen weit übertreffen."
            }
          ].map((faq, i) => (
            <div key={i} className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
              <h4 className="text-base font-semibold text-[oklch(0.16_0.02_260)]">{faq.q}</h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">{faq.a}</p>
            </div>
          ))}
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
