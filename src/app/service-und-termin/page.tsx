import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarSearch, MapPin, MessageSquare, Phone, Clock, ShieldCheck, Wrench, CheckCircle2 } from 'lucide-react';

import { getPageContent, getSettings } from '@/lib/data';
import { NAV_AREAS, PROCESS_LABELS } from '@/lib/navigation';
import { formatWeekday } from '@/lib/format';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';
import { ServiceBudgetCalculator } from '@/components/service/service-budget-calculator';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('service-und-termin');
  return {
    title: page?.seo.title ?? 'Service und Termin',
    description: page?.seo.description,
    alternates: { canonical: '/service-und-termin' },
  };
}

const ENTRIES = [
  {
    href: '/service-und-termin/anfrage',
    label: 'Allgemeine Anfrage',
    description: 'Wenn Ihr Anliegen in keinen der Fachbereiche passt.',
    icon: MessageSquare,
  },
  {
    href: '/service-und-termin/terminstatus',
    label: 'Terminstatus',
    description: 'Stand Ihres Vorgangs mit Vorgangsnummer und E-Mail-Adresse abrufen.',
    icon: CalendarSearch,
  },
  {
    href: '/service-und-termin/vor-ort',
    label: 'Vor-Ort-Leistungen',
    description: 'Was wir direkt bei Ihnen im Objekt erledigen.',
    icon: MapPin,
  },
  {
    href: '/service-und-termin/kontakt',
    label: 'Kontakt',
    description: 'Erreichbarkeit, Anschrift und Anfahrt.',
    icon: Phone,
  },
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ServiceUndTerminPage({ params, searchParams }: Props) {
  await params;
  await searchParams;

  const [page, settings] = await Promise.all([
    getPageContent('service-und-termin'),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Service und Termin"
        title={page?.headline ?? 'Service, Wartung und Terminvereinbarung'}
        lead={page?.subline ?? 'Fachgerechte Umsetzung, präzise Planung und höchste Zuverlässigkeit bei allen Aufträgen vor Ort und in der Werkstatt.'}
        crumbs={[{ href: '/service-und-termin', label: 'Service und Termin' }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">Präzision in der Umsetzung</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              <p>
                Ein fachmännisch geplantes Sicherheitssystem entfaltet seine volle Schutzwirkung erst durch eine absolut
                korrekte und kompromisslos präzise Montage. Unsere hochqualifizierten Techniker verfügen über jahrzehntelange
                Erfahrung in der Installation und Wartung von komplexen Schließanlagen, elektronischer Zutrittskontrolle
                und anspruchsvoller Sicherheitstechnik.
              </p>
              <p>
                Wir legen größten Wert auf eine saubere, effiziente und störungsfreie Ausführung der Arbeiten vor Ort.
                Die Integration neuer Systeme in den laufenden Betrieb erfordert Fingerspitzengefühl und eine detaillierte
                Abstimmung. Wir dokumentieren alle Schritte präzise und übergeben Ihnen die Anlage erst nach ausführlicher
                Prüfung aller Funktionen und einer fundierten Einweisung in die Bedienung.
              </p>
              <p>
                Neben der Neuinstallation übernehmen wir selbstverständlich auch die vorbeugende Wartung und turnusmäßige
                Inspektion Ihrer bestehenden Systeme. Verschleißteile werden rechtzeitig erkannt und ausgetauscht,
                bevor ein Ausfall die Sicherheit Ihres Objekts gefährdet.
              </p>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="block font-semibold text-[oklch(0.16_0.02_260)]">Termintreue</span>
                  <span className="text-[13px] text-foreground-muted">Pünktliche Ausführung aller Aufträge.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="block font-semibold text-[oklch(0.16_0.02_260)]">Höchste Standards</span>
                  <span className="text-[13px] text-foreground-muted">Montage nach strengen VdS-Richtlinien.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4">
                <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="block font-semibold text-[oklch(0.16_0.02_260)]">Spezialwerkzeug</span>
                  <span className="text-[13px] text-foreground-muted">Schonende Installation an sensiblen Türen.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="block font-semibold text-[oklch(0.16_0.02_260)]">Endabnahme</span>
                  <span className="text-[13px] text-foreground-muted">Strenge Funktionsprüfung vor Übergabe.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="lg:sticky lg:top-24">
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Strukturierte Prozesse"
          title="Unsere Service-Level im Überblick"
          lead="Abhängig von der Komplexität Ihres Anliegens strukturieren wir unsere Serviceeinsätze, um höchste Effizienz und Kostentransparenz zu gewährleisten."
        />

        <div className="mt-10 overflow-hidden rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-surface shadow-sm">
          <div className="table-scroll">
            <table className="w-full min-w-[48rem] text-left text-[14px]">
              <thead className="border-b border-[oklch(0.89_0.008_260/0.55)] bg-surface-muted">
                <tr>
                  <th className="py-4 pl-6 pr-4 font-semibold text-[oklch(0.16_0.02_260)]">Service-Level</th>
                  <th className="py-4 px-4 font-semibold text-[oklch(0.16_0.02_260)]">Typische Anwendungsfälle</th>
                  <th className="py-4 px-4 font-semibold text-[oklch(0.16_0.02_260)]">Reaktionszeit</th>
                  <th className="py-4 pr-6 pl-4 font-semibold text-[oklch(0.16_0.02_260)]">Dokumentation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                <tr>
                  <td className="py-4 pl-6 pr-4 font-bold text-primary">Standard-Service</td>
                  <td className="py-4 px-4 text-foreground-muted">Zylindertausch, Schlüsselkopien, Türschließer einstellen</td>
                  <td className="py-4 px-4 text-foreground-muted">2-3 Werktage</td>
                  <td className="py-4 pr-6 pl-4 text-foreground-muted">Servicebericht</td>
                </tr>
                <tr>
                  <td className="py-4 pl-6 pr-4 font-bold text-primary">Erweiterter Service</td>
                  <td className="py-4 px-4 text-foreground-muted">Montage kleiner Schließanlagen, Elektronik-Zutritt</td>
                  <td className="py-4 px-4 text-foreground-muted">1-2 Wochen (nach Materialeingang)</td>
                  <td className="py-4 pr-6 pl-4 text-foreground-muted">Anlagenzertifikat & Prüfprotokoll</td>
                </tr>
                <tr>
                  <td className="py-4 pl-6 pr-4 font-bold text-primary">Projekt-Service</td>
                  <td className="py-4 px-4 text-foreground-muted">Gewerbeobjekte, komplexe Vernetzung, Fluchtwegtechnik</td>
                  <td className="py-4 px-4 text-foreground-muted">Genaue Taktung nach Bauzeitenplan</td>
                  <td className="py-4 pr-6 pl-4 text-foreground-muted">Umfassende Systemdokumentation & CAD</td>
                </tr>
                <tr>
                  <td className="py-4 pl-6 pr-4 font-bold text-primary">Wartungsvertrag</td>
                  <td className="py-4 px-4 text-foreground-muted">Jährliche Prüfung von Brandschutztüren und Feststellanlagen</td>
                  <td className="py-4 px-4 text-foreground-muted">Automatische Terminierung</td>
                  <td className="py-4 pr-6 pl-4 text-foreground-muted">Rechtssicheres Prüfbuch</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Direktzugriff"
          title="Schnelleinstieg in unsere Service-Kanäle"
          lead="Wählen Sie den passenden Bereich für Ihr aktuelles Anliegen."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="group flex h-full flex-col gap-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 transition-colors hover:border-primary"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-105">
                    <Icon size={22} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold text-foreground group-hover:text-primary transition-colors">
                      {entry.label}
                    </span>
                    <span className="mt-2 block text-[14px] leading-relaxed text-foreground-muted">
                      {entry.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Abläufe"
          title="Geführte Prozesse für komplexe Anliegen"
          lead="Um Ihnen die Anfrage so einfach wie möglich zu machen, haben wir spezialisierte Assistenten entwickelt."
        />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PROCESS_LABELS) as Array<keyof typeof PROCESS_LABELS>).map((key) => {
            const process = PROCESS_LABELS[key];
            const areas = NAV_AREAS.filter((a) => a.process === key);
            return (
              <li key={key} className="grid grid-rows-[subgrid] row-span-4 gap-0">
                <Card className="h-full border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                  <CardBody className="flex h-full flex-col p-6">
                    <p className="text-[16px] font-bold text-foreground">{process.label}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                      {process.hint}
                    </p>
                    <ul className="mt-6 flex-1 space-y-2.5 border-t border-[oklch(0.89_0.008_260/0.55)] pt-5">
                      {areas.map((area) => (
                        <li key={area.key}>
                          <Link
                            href={area.href}
                            className="flex items-center justify-between text-[14px] font-medium text-foreground-muted hover:text-primary transition-colors"
                          >
                            <span>{area.label}</span>
                            <ArrowRight size={14} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="FAQ"
          title="Häufig gestellte Fragen"
          lead="Die wichtigsten Antworten rund um Termine, Wartung und Vor-Ort-Service."
        />

        <div className="mt-8 max-w-3xl">
          <Accordion
            items={[
              {
                question: 'Wie lange dauert ein typischer Wartungseinsatz?',
                answer: 'Die Dauer eines Wartungseinsatzes hängt stark vom Umfang der Anlage ab. Bei einer einzelnen Tür rechnen wir in der Regel mit 30 bis 45 Minuten für die vollständige Überprüfung von Schloss, Zylinder, Schließblech und Türschließer inklusive Justierung. Bei größeren Gewerbeobjekten mit Fluchtwegsteuerung und Feststellanlagen vereinbaren wir feste Zeitfenster. Wir erstellen einen detaillierten Ablaufplan, damit Ihr Betriebsablauf so wenig wie möglich gestört wird.'
              },
              {
                question: 'Muss ich bei der Montage meiner Schließanlage persönlich anwesend sein?',
                answer: 'Bei der Erstmontage oder der Übergabe einer neuen Schließanlage ist die Anwesenheit eines Entscheidungsbefugten dringend zu empfehlen. Wir übergeben nicht nur die Schlüssel gegen Quittung, sondern erläutern auch wichtige Funktionen und geben Pflegehinweise. Zudem erfolgt die formelle Abnahme, die dokumentiert, dass alle Schließungen wie bestellt funktionieren.'
              },
              {
                question: 'Bieten Sie feste Wartungsverträge an?',
                answer: 'Ja. Für sicherheitsrelevante Anlagen (z.B. Feststellanlagen an Brandschutztüren, Fluchtwegsteuerungen, komplexe elektronische Zutrittssysteme) bieten wir maßgeschneiderte Wartungsverträge an. Diese beinhalten eine automatische Terminierung der gesetzlich vorgeschriebenen Prüfintervalle sowie die fachgerechte Führung des Prüfbuchs. Dies gibt Ihnen maximale Rechtssicherheit gegenüber Versicherungen und Behörden.'
              },
              {
                question: 'Was passiert, wenn bei der Wartung ein Defekt festgestellt wird?',
                answer: 'Kleinere Defekte, die sich mit Standard-Ersatzteilen beheben lassen, reparieren unsere Techniker nach kurzer Rücksprache oft direkt vor Ort. Bei größeren Schäden oder benötigten Spezialteilen dokumentieren wir den Fehler und erstellen Ihnen kurzfristig ein transparentes Angebot für die Instandsetzung. Erst nach Ihrer Freigabe führen wir die Reparatur durch.'
              },
              {
                question: 'Wie dokumentieren Sie die ausgeführten Arbeiten?',
                answer: 'Transparenz ist uns wichtig. Nach jedem Einsatz erhalten Sie einen digitalen Servicebericht. Dieser dokumentiert detailliert die ausgeführten Tätigkeiten, verbaute Materialien sowie Arbeits- und Anfahrtszeiten. Bei Wartungen von Brandschutz- und Fluchtwegtechnik erhalten Sie zudem die gesetzlich geforderten Prüfprotokolle mit Prüfsiegel.'
              }
            ]}
          />
        </div>
      </Section>

      <Section tone="muted" tight>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <SectionHeading eyebrow="Erreichbarkeit" title="Öffnungszeiten" />
            <div className="table-scroll mt-6">
              <table className="w-full min-w-[22rem] max-w-lg border-collapse text-[15px]">
                <tbody>
                  {settings.openingHours.map((entry) => (
                    <tr key={entry.day} className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                      <th scope="row" className="py-3 pr-6 text-left font-semibold text-foreground">
                        {formatWeekday(entry.day)}
                      </th>
                      <td className="py-3 text-foreground-muted">
                        {entry.spans.length === 0
                          ? 'geschlossen'
                          : entry.spans.map((s) => `${s.from}–${s.to} Uhr`).join(' und ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-[oklch(0.968_0.004_260)] p-8 border border-[oklch(0.89_0.008_260/0.55)] max-w-md w-full">
            <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)] mb-4">Weiterführende Links</h3>
            <div className="flex flex-col gap-3">
              {page?.seo.internalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center justify-between gap-1.5 text-[15px] font-semibold text-primary hover:text-primary-dark transition-colors p-3 rounded-lg bg-surface border border-transparent hover:border-[oklch(0.89_0.008_260/0.55)]"
                >
                  {link.label}
                  <ArrowRight size={16} aria-hidden className="opacity-70" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
