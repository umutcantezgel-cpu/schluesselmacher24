import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getCities, getSettings } from '@/lib/data';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

export const metadata: Metadata = {
  title: 'Vor-Ort-Leistungen | Vor-Ort-Service & Reparaturen',
  description:
    'Umfassende Vor-Ort-Leistungen: Autoschlüssel programmieren, Schließanlagen montieren, Zylindertausch und Sicherheitstechnik. Was Sie vorbereiten müssen.',
  alternates: { canonical: '/service-und-termin/vor-ort' },
};

const SERVICES = [
  {
    title: 'Autoschlüssel am Fahrzeug',
    body:
      'Programmieren und Anlernen setzen Zugriff auf das Fahrzeug voraus. Diese Arbeiten lassen '
      + 'sich nicht per Versand erledigen. Unser mobiles Equipment erlaubt es uns, moderne Transponder, Keyless-Go-Systeme und Infrarotschlüssel direkt an Ihrem Fahrzeug anzulernen.',
    needs: [
      'Fahrzeug am vereinbarten Ort (frei zugänglich)',
      'Fahrzeugschein (Zulassungsbescheinigung Teil 1) im Original',
      'Personalausweis oder Reisepass als Nachweis',
      'Ggf. vorhandene Restschlüssel',
    ],
    href: '/autoschluessel/anfrage',
    cta: 'Termin starten',
  },
  {
    title: 'Zylinder- und Schlosstausch',
    body:
      'Wir tauschen Zylinder, Einsteckschlösser, Schutzbeschläge und Türzusatzschlösser (z.B. Panzerriegel) an der '
      + 'eingebauten Tür. Egal ob nach einem Verlust, Defekt oder zur reinen Sicherheitssteigerung.',
    needs: ['Ungehinderter Zugang zur Tür', 'Maße (Dornmaß, Entfernungsmaß) oder der ausgebaute Zylinder', 'Freier Arbeitsbereich beidseitig'],
    href: '/tuer-und-schliesstechnik',
    cta: 'Zur Tür- und Schließtechnik',
  },
  {
    title: 'Montage von Schließanlagen',
    body:
      'Fachgerechter Einbau komplexer mechanischer und mechatronischer Schließanlagen nach definiertem Schließplan. Inklusive Beschriftung, Funktionstest und Übergabe der Sicherungskarte.',
    needs: ['Zugang zu allen Türen der Anlage', 'Anwesende verantwortliche Person für die Abnahme', 'Geprüfter und freigegebener Schließplan'],
    href: '/schliessanlagen/konfigurator',
    cta: 'Projekt erfassen',
  },
  {
    title: 'Elektronische Zutrittslösungen',
    body: 'Komplette Installation, Verkabelung, Einrichtung der Software/App und Benutzerverwaltung für elektronische Zylinder, Wandleser und smarte Türbeschläge. Umfassende Einweisung inklusive.',
    needs: ['Sichere Stromversorgung (230V) und ggf. Netzwerkanschluss (LAN/WLAN)', 'Liste der initialen Nutzer und ihrer Berechtigungen', 'Zugang zu Serverraum/Verteiler falls zentral gesteuert'],
    href: '/elektronische-zutrittsloesungen/konfigurator',
    cta: 'Bedarf erfassen',
  },
  {
    title: 'Sicherheitstechnik & Alarm',
    body:
      'Professionelle Montage von Überwachungskameras, Bewegungsmeldern, Glasbruchsensoren und Magnetkontakten. Einrichtung der Alarmierungswege (App, SMS, Aufschaltung) nach DIN EN 50131.',
    needs: ['Zugang zu allen betroffenen Räumen und Gebäudehüllen', 'Stabiler Internetzugang für App-Steuerung und Fernwartung', 'Ggf. Leiter/Steiger-Zugang bei großer Höhe'],
    href: '/sicherheitstechnik/sicherheitscheck',
    cta: 'Sicherheitscheck starten',
  },
  {
    title: 'Bestandsaufnahme vor Ort',
    body:
      'Unsere Techniker analysieren die bestehende Situation, prüfen vorhandene mechanische oder elektronische Systeme und erarbeiten mit Ihnen ein belastbares, lückenloses Sicherheitskonzept.',
    needs: ['Zugang zum Objekt (alle relevanten Türen und Fenster)', 'Vorhandene Unterlagen (Schließpläne, alte Rechnungen)', 'Ausreichend Zeit für eine detaillierte Begehung'],
    href: '/service-und-termin/anfrage',
    cta: 'Beratungstermin anfragen',
  },
];

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VorOrtPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [settings, cities] = await Promise.all([getSettings(), getCities()]);

  return (
    <main data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
      <PageHeader
        eyebrow="Vor Ort"
        title="Was wir direkt bei Ihnen erledigen"
        lead="Nicht jede Arbeit lässt sich per Versand lösen. Manche Eingriffe erfordern unser Fachpersonal direkt am Objekt. Hier erfahren Sie detailliert, was bei Vor-Ort-Einsätzen passiert und wie Sie diese optimal vorbereiten."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/vor-ort', label: 'Vor-Ort-Leistungen' },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div>
            <SectionHeading title="Leistungen im Überblick" />
            <div className="mt-6 prose prose-sm max-w-none text-[oklch(0.32_0.02_260)] mb-8">
              <p>
                Unsere Vor-Ort-Einsätze sind geprägt von maximaler Diskretion, handwerklicher Präzision und technologischem Know-how. Ein Sicherheitssystem ist immer nur so stark wie sein schwächstes Glied – und oft ist dies nicht die Hardware selbst, sondern eine unsachgemäße Montage. Deshalb legen wir bei der Installation vor Ort höchste Maßstäbe an.
              </p>
              <p>
                Um einen reibungslosen Ablauf zu gewährleisten und unnötige Kosten durch Mehrfachanfahrten zu vermeiden, sind wir auf Ihre Mitarbeit angewiesen. Bitte stellen Sie sicher, dass zum vereinbarten Termin alle notwendigen Voraussetzungen geschaffen sind. Die spezifischen Anforderungen finden Sie detailliert bei den jeweiligen Leistungsbereichen aufgeführt.
              </p>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2" style={{ gridTemplateRows: 'subgrid' }}>
              {SERVICES.map((service) => (
                <li key={service.title}>
                  <Card className="h-full border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.06)]">
                    <CardBody className="flex h-full flex-col">
                      <p className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">{service.title}</p>
                      <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                        {service.body}
                      </p>
                      <div className="mt-6 rounded-lg bg-white p-4 border border-[oklch(0.89_0.008_260/0.4)]">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)] mb-2">
                          Vorbereitung Checkliste
                        </p>
                        <ul className="space-y-1.5 flex-1">
                          {service.needs.map((need) => (
                            <li key={need} className="text-[13px] text-[oklch(0.32_0.02_260)] flex items-start">
                              <span className="mr-2 text-[oklch(0.52_0.24_260)] mt-0.5">•</span>
                              <span>{need}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-auto pt-6">
                        <Link
                          href={service.href}
                          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:text-[oklch(0.48_0.24_260)] hover:underline transition-colors"
                        >
                          {service.cta}
                          <ArrowRight size={16} aria-hidden />
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>

            <div className="mt-16">
              <SectionHeading title="Häufige Fragen zu Einsätzen" />
              <div className="mt-6 space-y-6">
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                  <h4 className="text-base font-semibold text-[oklch(0.16_0.02_260)]">Wie wird abgerechnet, wenn Teile fehlen oder ein Zweittermin nötig ist?</h4>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Wir bemühen uns, durch detaillierte Vorabklärung (Fotos, Beschreibungen) genau zu planen. Sollte dennoch ein unvorhersehbares Problem auftreten (z.B. versteckte Bauschäden) und ein Zweittermin nötig werden, berechnen wir die zweite Anfahrt in der Regel zu einem stark reduzierten Kulanzsatz, sofern die Verzögerung nicht durch mangelnde Vorbereitung (siehe Checklisten) verursacht wurde.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                  <h4 className="text-base font-semibold text-[oklch(0.16_0.02_260)]">Sind Notöffnungen am Wochenende möglich?</h4>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Außerhalb unserer regulären Öffnungszeiten bieten wir ausgewählten Vertragskunden (z.B. Hausverwaltungen) einen Notdienst. Für Privatkunden verweisen wir in der Regel auf spezialisierte Notdienste in der Region. Geplante Montagen finden ausschließlich zu den vereinbarten Servicezeiten statt.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                  <h4 className="text-base font-semibold text-[oklch(0.16_0.02_260)]">Welche Garantie erhalte ich auf die Montage?</h4>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Wir gewähren die volle gesetzliche Gewährleistung auf alle verbauten Teile und unsere Handwerksleistung. Bei vielen elektronischen Systemen und Schließanlagen bieten wir zudem erweiterte Service- und Wartungsverträge an, die die Lebensdauer und Ausfallsicherheit deutlich erhöhen.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                  <h4 className="text-base font-semibold text-[oklch(0.16_0.02_260)]">Wie lange dauert ein typischer Zylindertausch?</h4>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Der reine Tausch eines Standard-Profilzylinders dauert bei vorbereiteter, zugänglicher Tür oft nur 10 bis 15 Minuten. Wenn zusätzlich Schutzbeschläge montiert oder Türmaße vor Ort aufwändig angepasst werden müssen, sollten Sie 45 bis 60 Minuten einplanen.
                  </p>
                </div>
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-6 bg-white">
                  <h4 className="text-base font-semibold text-[oklch(0.16_0.02_260)]">Was passiert mit meinen alten Schlüsseln und Zylindern?</h4>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Auf Wunsch entsorgen wir alte mechanische Komponenten fachgerecht. Funktionierende Alt-Zylinder können Sie selbstverständlich auch behalten, beispielsweise für den Einsatz in untergeordneten Bereichen (Gartentor, Keller) – wir prüfen gerne, ob eine Weiternutzung sicherheitstechnisch vertretbar ist.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            <ServiceBudgetCalculator />

            <ImagePlaceholder
              slot={{
                motif: 'Präzise Montage eines mechatronischen Schließzylinders',
                ratio: '4/3',
                note: 'Echtes Foto aus einem abgeschlossenen Auftrag, Fokus auf das Spezialwerkzeug.',
              }}
            />

            <Alert tone="legal" title="Legitimation & Eigentumsnachweis" className="mt-6 border-[oklch(0.89_0.008_260/0.55)]">
              Die Sicherheit unserer Kunden hat oberste Priorität. Vor sensiblen Arbeiten an Fahrzeugen, Haus- oder Wohnungstüren sowie Schließanlagen sind wir gesetzlich und moralisch verpflichtet, die Legitimation (Verfügungsberechtigung) zu prüfen.
              <br /><br />
              Bitte halten Sie dazu immer einen amtlichen Lichtbildausweis (Personalausweis, Reisepass) sowie einen Nachweis (Fahrzeugschein, Mietvertrag, Meldebescheinigung) bereit. Fehlt dieser Nachweis, müssen wir die Arbeit leider vor Ort abbrechen.
            </Alert>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
                Service-Regionen
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Unsere qualifizierten Techniker erbringen Vor-Ort-Leistungen primär in unserem direkten Einzugsgebiet. Größere Projekte (Schließanlagen) realisieren wir auf Anfrage auch bundesweit.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                {cities.map((city) => (
                  <li key={city.id}>
                    <Link
                      href={`/standorte/${city.slug}`}
                      className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[13px] font-medium text-[oklch(0.16_0.02_260)] border border-[oklch(0.89_0.008_260/0.55)] hover:border-[oklch(0.52_0.24_260)] hover:text-[oklch(0.52_0.24_260)] transition-colors"
                    >
                      {city.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6">
              <p className="text-[16px] font-semibold text-[oklch(0.16_0.02_260)]">Planung & Vorlaufzeiten</p>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Wir arbeiten nicht als Ad-hoc-Dienstleister. Qualität erfordert Planung. Für Autoschlüssel und Standard-Montagen rechnen Sie bitte mit einem Vorlauf von ca. {settings.booking.leadTimeDays} Tagen.
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                Komplexe Schließanlagen oder Elektronik-Projekte benötigen oft 2-4 Wochen Planungs- und Beschaffungszeit.
              </p>
              <ButtonLink href="/autoschluessel/anfrage" className="mt-5 w-full justify-center bg-[oklch(0.52_0.24_260)] hover:bg-[oklch(0.48_0.24_260)] text-white" size="sm">
                Jetzt Termin vereinbaren
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
