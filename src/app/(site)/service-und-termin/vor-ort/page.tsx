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
import { Accordion } from '@/components/ui/accordion';
import { OnSiteCalculator } from '@/components/service/on-site-calculator';

export const metadata: Metadata = {
  title: 'Vor-Ort-Leistungen & Montageservice',
  description:
    'Professionelle Sicherheits- und Schließtechnikmontage direkt bei Ihnen vor Ort. Erfahren Sie alles über unsere Prozesse, Vorbereitungen und architektonischen Standards.',
  alternates: { canonical: '/service-und-termin/vor-ort' },
};

const SERVICES = [
  {
    title: 'Autoschlüssel am Fahrzeug programmieren',
    body:
      'Moderne Fahrzeugschlüssel mit Wegfahrsperre und Funkfernbedienung (inklusive Keyless-Go) erfordern eine direkte Kommunikation mit dem Bordnetzsteuergerät. Programmieren und Anlernen setzen daher zwingend den Zugriff auf das Fahrzeug über die OBD-Schnittstelle voraus. Diese hochsensiblen Arbeiten lassen sich aus Sicherheitsgründen nicht per Versand erledigen.',
    needs: [
      'Fahrzeug am vereinbarten, zugänglichen Ort',
      'Fahrzeugschein im Original (Teil I)',
      'Amtlicher Lichtbildausweis zur Legitimation',
      'Alle noch vorhandenen Ersatzschlüssel',
    ],
    href: '/autoschluessel/anfrage',
    cta: 'Fahrzeugtermin vereinbaren',
  },
  {
    title: 'Zylinder- und Schlosstausch',
    body:
      'Der fachgerechte Austausch von Profilzylindern, Einsteckschlössern, Sicherheitsbeschlägen und komplexen Türzusatzschlössern direkt an der eingebauten Tür. Wir garantieren passgenaue Installationen unter Einhaltung der DIN 18252 (Profilzylinder) und DIN EN 1303, um maximalen Widerstand gegen Manipulationstechniken wie Picking oder Bohren zu gewährleisten.',
    needs: [
      'Uneingeschränkter Zugang zur betreffenden Tür',
      'Bestehende Schlüssel oder Maße (falls vorab bekannt)',
      'Freier Arbeitsbereich von mindestens 1,5 Quadratmetern',
    ],
    href: '/tuer-und-schliesstechnik',
    cta: 'Zur Schließtechnik wechseln',
  },
  {
    title: 'Montage komplexer Schließanlagen',
    body:
      'Einbau und Inbetriebnahme von mechanischen und mechatronischen Schließanlagen strikt nach dem zuvor definierten und genehmigten Schließplan. Dieser Service umfasst die Montage der Zylinder, die systematische Beschriftung der Schlüssel, die Funktionsprüfung jeder einzelnen Schließung sowie die feierliche Übergabe der Sicherungskarte und aller relevanter Dokumentationen.',
    needs: [
      'Zugang zu ausnahmslos allen Türen der geplanten Anlage',
      'Anwesenheit einer vertretungsberechtigten, verantwortlichen Person',
      'Freigegebener Schließplan zur Endabnahme',
    ],
    href: '/schliessanlagen/konfigurator',
    cta: 'Schließplan-Projekt starten',
  },
  {
    title: 'Elektronische Zutrittslösungen integrieren',
    body:
      'Von vernetzten Wandlesern bis hin zu digitalen Schließzylindern: Wir übernehmen die vollständige Montage, die physikalische und logische Einrichtung der Benutzerverwaltungssysteme sowie eine ausführliche Einweisung der Administratoren. Dabei achten wir auf verschlüsselte Kommunikationswege (z.B. MIFARE DESFire) und ausfallsichere Architekturen.',
    needs: [
      'Gesicherte Stromversorgung und ggf. vorbereitetes PoE-Netzwerk',
      'Vollständige Liste der initialen Nutzer und deren Berechtigungsprofile',
      'Ggf. Zugang zum Server- oder Technikraum',
    ],
    href: '/elektronische-zutrittsloesungen/konfigurator',
    cta: 'Zutrittslösung planen',
  },
  {
    title: 'Sicherheitstechnik & Alarmsysteme',
    body:
      'Professionelle Installation von hochauflösenden IP-Kamerasystemen, sensiblen Bewegungsmeldern, Magnetkontakten und zentralen Steuerungseinheiten. Wir richten die Alarmierungswege (TCP/IP, GSM) ein und binden das System auf Wunsch sicher in Ihre mobilen Endgeräte ein, um eine lückenlose 24/7-Überwachung zu garantieren.',
    needs: [
      'Zugang zu allen zu überwachenden und angrenzenden Bereichen',
      'Stabiler Internetzugang am Standort der Zentrale',
      'Vorabklärung von Datenschutzrichtlinien (z.B. im Gewerbe)',
    ],
    href: '/sicherheitstechnik/sicherheitscheck',
    cta: 'Sicherheitscheck initiieren',
  },
  {
    title: 'Architektonische Bestandsaufnahme (Audit)',
    body:
      'Unsere Experten evaluieren die bestehende Sicherheitsinfrastruktur Ihres Objekts direkt vor Ort. Wir identifizieren mechanische und elektronische Schwachstellen, prüfen die Fluchtwegsteuerung und erarbeiten auf Basis dieser Analyse ein belastbares, normgerechtes Angebot, das exakt auf das ermittelte Risikoprofil zugeschnitten ist.',
    needs: [
      'Begleiteter Zugang zum gesamten Objekt',
      'Einsicht in vorhandene Brandschutz- oder Sicherheitskonzepte',
      'Vorhandene Schließpläne (falls verfügbar)',
    ],
    href: '/service-und-termin/anfrage',
    cta: 'Audit & Beratung anfragen',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Warum muss ich mich für Arbeiten am Fahrzeug legitimieren?',
    answer: 'Das Anlernen von neuen Fahrzeugschlüsseln oder die Notöffnung eines Fahrzeugs sind hochsensible Eingriffe in fremdes Eigentum. Um Diebstahl oder unbefugten Zugriff strikt zu verhindern, sind wir rechtlich und moralisch verpflichtet, die Verfügungsberechtigung zweifelsfrei festzustellen. Ohne Vorlage von Fahrzeugschein und Lichtbildausweis dürfen und werden wir keine Arbeiten durchführen.'
  },
  {
    question: 'Wie lange dauert ein typischer Zylindertausch?',
    answer: 'Ein standardmäßiger Zylindertausch an einer gut zugänglichen Tür dauert in der Regel etwa 20 bis 30 Minuten. Sind jedoch spezielle Sicherheitsbeschläge mit Kernziehschutz verbaut, die eventuell angepasst werden müssen, oder handelt es sich um komplexe Mehrfachverriegelungen, kann der Aufwand entsprechend steigen. In solchen Fällen planen wir bis zu 60 Minuten ein, um höchste Präzision zu gewährleisten.'
  },
  {
    question: 'Können Sie auch elektronische Systeme in bestehende IT integrieren?',
    answer: 'Ja. Wir verstehen uns nicht nur als Mechaniker, sondern als Systemintegratoren. Moderne Zutrittskontrollsysteme können via API oder standardisierten Protokollen (wie OSDP oder Wiegand) in bestehende Gebäudeleittechnik oder Active Directory Umgebungen eingebunden werden. Dies erfordert jedoch eine präzise Vorabplanung in der Phase der Projektierung.'
  },
  {
    question: 'Was passiert, wenn bei der Montage ein Problem auftritt?',
    answer: 'Unsere Service-Fahrzeuge sind fahrende Fachwerkstätten. Wir führen eine breite Auswahl an gängigen Zylinderlängen, Beschlägen und Ersatzteilen mit uns. Sollte eine unerwartete architektonische Hürde auftreten (z.B. ein abweichendes Dornmaß), können wir in über 90% der Fälle sofort mit einer sicheren, temporären oder permanenten Lösung reagieren, ohne dass Ihr Objekt ungeschützt bleibt.'
  },
  {
    question: 'Gibt es eine Garantie auf die installierte Hardware?',
    answer: 'Selbstverständlich. Neben der gesetzlichen Gewährleistung auf unsere handwerkliche Arbeitsleistung erhalten Sie auf alle von uns verbauten Komponenten die vollen Herstellergarantien. Bei mechanischen Premium-Zylindern oder zertifizierten Schließanlagen sind dies oft mehrere Jahre. Zudem garantieren wir eine langfristige Nachbestellsicherheit für Schlüssel und Zylinder über die registrierte Sicherungskarte.'
  }
];

export default async function VorOrtPage(props: {
  params: Promise<unknown>;
  searchParams: Promise<unknown>;
}) {
  // Await asynchronous parameters for Next.js 16+ Turbopack compatibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedParams = await props.params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedSearch = await props.searchParams;

  const [settings, cities] = await Promise.all([getSettings(), getCities()]);

  return (
    <main>
      <PageHeader
        eyebrow="Vor Ort & Montage"
        title="Architektonische Integration vor Ort"
        lead="Präzision, die zu Ihnen kommt: Erfahren Sie alles über unsere Vor-Ort-Leistungen, von der Fahrzeugprogrammierung bis zur Installation komplexer Sicherheitssysteme. Wir verbinden handwerkliche Exzellenz mit modernster Technik direkt an Ihrem Objekt."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/vor-ort', label: 'Vor-Ort-Leistungen' },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Leistungskatalog"
              title="Unsere Einsätze im Detail"
              lead="Jeder Einsatz vor Ort folgt strengen methodischen Vorgaben. Hier finden Sie eine detaillierte Aufschlüsselung unserer Kompetenzbereiche und die Voraussetzungen für einen reibungslosen Ablauf."
            />

            <div className="mt-8 prose-sm24 max-w-none text-[oklch(0.32_0.02_260)] mb-8">
              <p>
                Die Installation von Sicherheitstechnik ist Vertrauenssache. Ein noch so hochwertiger Hochsicherheitszylinder verliert seine Schutzwirkung, wenn er nicht fachgerecht unter Berücksichtigung der spezifischen Türmetrik und der angrenzenden Beschläge montiert wird. Unsere Vor-Ort-Einsätze zeichnen sich durch absolute Sorgfalt, den Einsatz spezialisierter Mess- und Montagewerkzeuge und ein tiefes Verständnis für das Zusammenspiel von Mechanik und Gebäudeinfrastruktur aus.
              </p>
              <p>
                Ob es sich um ein privates Einfamilienhaus, eine weitläufige Gewerbeimmobilie oder ein modernes Fahrzeug handelt — wir bringen die Lösung direkt zum Problem. Dabei legen wir größten Wert auf eine transparente Kommunikation im Vorfeld. Die unten aufgeführten <strong>Vorbereitungsmaßnahmen</strong> sind essenziell, damit unsere Techniker ohne Verzögerung und mit höchster Effizienz für Ihre Sicherheit sorgen können.
              </p>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-rows-[subgrid]">
              {SERVICES.map((service) => (
                <li key={service.title} className="flex">
                  <Card className="flex-1 transition-all duration-300 hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] group">
                    <CardBody className="flex h-full flex-col">
                      <h3 className="text-[16px] font-bold text-[oklch(0.16_0.02_260)] tracking-tight">{service.title}</h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                        {service.body}
                      </p>

                      <div className="mt-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)] mb-3">
                          Zwingend vorzubereiten
                        </p>
                        <ul className="space-y-2 flex-1">
                          {service.needs.map((need) => (
                            <li key={need} className="text-[13px] text-[oklch(0.32_0.02_260)] flex items-start gap-2">
                              <span className="text-[oklch(0.89_0.008_260)] mt-0.5">•</span>
                              <span>{need}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6">
                        <Link
                          href={service.href}
                          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] transition-colors hover:text-[oklch(0.46_0.24_260)] group-hover:underline"
                        >
                          {service.cta}
                          <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            {/* Interactive Calculator Integration */}
            <OnSiteCalculator />

            <Alert tone="legal" title="Legitimation & Verfügungsberechtigung" className="shadow-sm">
              Sicherheit beginnt bei der Legitimation. Vor Arbeiten an Fahrzeugen, sicherheitsrelevanten Türen oder bestehenden Schließanlagen weisen Sie bitte nach, dass Sie rechtmäßig über das Objekt verfügen dürfen. Dieses strikte Vorgehen schützt Ihr Eigentum vor unbefugtem Zugriff und sichert uns rechtlich ab. Die genauen erforderlichen Dokumente teilen wir Ihnen bei der Terminbestätigung detailliert mit.
            </Alert>

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 md:p-8 shadow-sm">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)] mb-3">
                Operative Einsatzgebiete
              </h4>
              <p className="text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)] mb-5">
                Unsere qualifizierten Techniker erbringen Vor-Ort-Leistungen schwerpunktmäßig in den folgenden Metropolregionen und deren Umland. Reine Warenbestellungen aus dem Shop sowie vorbereitete Schlüsselkopien versenden wir selbstverständlich bundesweit sicher verpackt.
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {cities.map((city) => (
                  <li key={city.id}>
                    <Link
                      href={`/standorte/${city.slug}`}
                      className="text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:underline hover:text-[oklch(0.46_0.24_260)] transition-colors"
                    >
                      {city.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 md:p-8 shadow-sm">
              <h4 className="text-[18px] font-bold text-[oklch(0.16_0.02_260)] tracking-tight mb-3">Logistik & Terminvorlauf</h4>
              <p className="text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)] mb-6">
                Qualität erfordert Vorbereitung. Termine für komplexe Arbeiten oder Fahrzeugschlüssel bieten wir in der Regel mit einem Vorlauf von etwa <strong>{settings.booking.leadTimeDays} Tagen</strong> an. Diese Zeit nutzen wir, um fahrzeugspezifisches Material (wie Transponder oder OEM-Schlüsselrohlinge) zu beschaffen und Anlagenkomponenten in unserer Werkstatt vorzukonfigurieren, um Ihre Wartezeit vor Ort zu minimieren.
              </p>
              <ButtonLink href="/service-und-termin/anfrage" size="md" className="w-full justify-center">
                Terminplanung beginnen
              </ButtonLink>
            </div>

            <ImagePlaceholder
              slot={{
                motif: 'Hochauflösendes Foto einer präzisen Installation: Ein Techniker montiert einen elektronischen Schließzylinder, Fokus auf das Spezialwerkzeug und die saubere Arbeitsweise.',
                ratio: '4/3',
                note: 'Visualisiert den hohen handwerklichen Standard und die architektonische Sorgfalt.',
              }}
              className="rounded-2xl overflow-hidden shadow-sm"
            />
          </div>
        </div>
      </Section>

      <Section tight className="bg-[oklch(0.968_0.004_260)] border-y border-[oklch(0.89_0.008_260/0.55)] py-16 md:py-24 mt-12">
        <div className="max-w-4xl mx-auto px-4 md:px-0">
          <SectionHeading
            eyebrow="Methodenwissen"
            title="Architektonische FAQs"
            lead="Transparenz ist uns wichtig. Hier beantworten wir tiefgreifende Fragen zu unseren Vor-Ort-Prozessen, technischen Standards und rechtlichen Rahmenbedingungen."
          />
          <div className="mt-10 bg-[oklch(0.988_0.002_260)] rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm overflow-hidden">
             <Accordion items={FAQ_ITEMS} />
          </div>
        </div>
      </Section>
    </main>
  );
}
