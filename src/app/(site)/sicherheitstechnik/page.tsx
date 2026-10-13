import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  Camera,
  Layers,
  Lock,
  ShieldCheck,
  Siren,
  Smartphone,
} from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';

const ROUTE = 'sicherheitstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Sicherheitstechnik',
    description:
      page?.seo.description
      ?? 'Videoüberwachung, Alarmtechnik, Sicherung der Außenhaut, mechanischer Schutz und kombinierte Konzepte.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Symbole je Bereich — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, typeof ShieldCheck> = {
  videoueberwachung: Camera,
  alarmtechnik: Siren,
  aussenhautsicherung: ShieldCheck,
  'mechanischer-schutz': Lock,
  'smarte-funktionen': Smartphone,
  'panik-und-alarmtaster': BellRing,
  'kombinierte-konzepte': Layers,
};

/** Der Grundsatz, nach dem wir die Bereiche zusammenstellen. */
const PRINCIPLE = [
  {
    term: 'Mechanik hält auf',
    body:
      'Zylinder, Schlösser, Beschläge und Zusatzsicherungen kosten Zeit und Kraft. Ohne diesen '
      + 'Grundschutz meldet jede Elektronik nur, dass bereits etwas passiert ist.',
    href: '/tuer-und-schliesstechnik',
    linkLabel: 'Zur Tür- und Schließtechnik',
  },
  {
    term: 'Meldetechnik erkennt',
    body:
      'Melder, Kontakte und Kameras erkennen, dass an einer Stelle etwas geschieht — an der Tür, '
      + 'am Fenster, an der Scheibe oder im Raum.',
    href: `/${ROUTE}/alarmtechnik`,
    linkLabel: 'Zur Alarmtechnik',
  },
  {
    term: 'Alarmierung informiert',
    body:
      'Signalgeber und Benachrichtigungen bringen die Information dorthin, wo jemand darauf '
      + 'reagieren kann. Der Weg wird vorab festgelegt.',
    href: `/${ROUTE}/panik-und-alarmtaster`,
    linkLabel: 'Zu Panik- und Alarmtastern',
  },
];

interface Props {
  params: Promise<{ slug?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Sicherheitstechnik',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }],
        })}
      />

      <div style={{ display: 'none' }} data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)} />
      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Sicherheitstechnik'}
        lead={page?.subline}
        crumbs={[{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/sicherheitscheck`} size="lg">
            Sicherheitscheck starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Grundsatz */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Einordnung"
              title="Mechanik hält auf, Meldetechnik erkennt, Alarmierung informiert"
              lead={page?.intro}
            />

            <dl className="mt-6 space-y-4">
              {PRINCIPLE.map((item) => (
                <div key={item.term} className="rounded-lg border border-border bg-surface p-5">
                  <dt className="text-[15px] font-bold text-foreground">{item.term}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                    {item.body}
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                    >
                      {item.linkLabel}
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6">
            <ImagePlaceholder
              slot={{
                motif: 'Objektfoto: Hauseingang mit Außenkamera, Türkontakt und Sicherheitsbeschlag',
                ratio: '4/3',
                note: 'Eigene Aufnahme aus einem abgeschlossenen Projekt. Kein Stockfoto.',
              }}
            />

            <div className="rounded-lg border border-border bg-surface-muted p-5">
              <p className="text-[13px] font-bold uppercase tracking-wider text-foreground-subtle">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 text-[15px] font-bold text-foreground">{process.label}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
              <div className="mt-5">
                <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline">
                  Bestandsaufnahme starten
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>


      {/* Architektonische Methodik */}
      <Section id="methodik">
        <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Architektonische Methodik"
                title="Von der Schwachstellenanalyse zum ganzheitlichen Sicherheitskonzept"
                lead="Ein wirksames Sicherheitskonzept entsteht nicht durch das wahllose Addieren von Einzelkomponenten. Es erfordert eine methodische, architektonische Planung."
              />
              <div className="mt-8 prose prose-slate max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed">
                  <p>
                      Die Integration von Sicherheitstechnik in moderne Gebäude und Anlagen folgt einer strikten <strong>Architektonischen Methodik</strong>.
                      Unser Ansatz basiert auf dem Prinzip der Zwiebelschalen-Sicherheit (Defense in Depth), bei dem mehrere gestaffelte Verteidigungslinien
                      etabliert werden. Jede Ebene - Perimeterschutz, Außenhautsicherung, Innenraumüberwachung und Objektschutz - greift nahtlos in die nächste.
                  </p>
                  <p className="mt-4">
                      Zu Beginn jedes Projekts steht eine umfassende Schwachstellenanalyse. Wir betrachten nicht nur die offensichtlichen Zugänge
                      wie Türen und Fenster, sondern analysieren auch bauliche Gegebenheiten, das direkte Umfeld und spezifische Gefährdungsszenarien.
                      Aus diesen Daten entwickeln wir ein Schutzziel, das als Fundament für die gesamte technische Planung dient.
                  </p>
                  <p className="mt-4">
                      Die Symbiose aus <strong>Mechanik und Elektronik</strong> ist hierbei essenziell. Während mechanische Sicherungen (wie RC3/RC4 Türen, Sperrelemente)
                      den primären Widerstand gegen physische Angriffe leisten und wertvolle Zeit (den sogenannten Widerstandszeitwert) erkaufen,
                      übernimmt die elektronische Sicherheitstechnik die frühestmögliche Detektion, Verifikation und Alarmierung.
                      Ein gut geplantes System meldet einen Einbruchsversuch bereits an der Gebäudehülle, bevor der mechanische Widerstand überwunden wurde.
                  </p>
                  <p className="mt-4">
                      Besonderes Augenmerk legen wir auf die <strong>Systemintegration</strong>. Insellösungen gehören der Vergangenheit an. Moderne Alarm-,
                      Video- und Zutrittskontrollsysteme müssen miteinander kommunizieren. Ein Zutrittsversuch außerhalb der Geschäftszeiten
                      sollte nicht nur protokolliert werden, sondern unmittelbar die entsprechende Videokamera aufschalten, die Außenbeleuchtung aktivieren
                      und eine stille Alarmierung an die Notruf- und Serviceleitstelle (NSL) absetzen. Diese tiefe Integration erfordert
                      spezifisches Know-how in der Netzwerktechnik und Kenntnisse der etablierten Schnittstellen (z.B. OPC, SIP, ONVIF, KNX).
                  </p>
                  <p className="mt-4">
                      Darüber hinaus berücksichtigen wir die <strong>Ausfallsicherheit und Redundanz</strong>. Durch die Nutzung redundanter Übertragungswege
                      (z.B. IP und LTE), USV-Anlagen (Unterbrechungsfreie Stromversorgung) für kritische Komponenten und die kontinuierliche
                      Überwachung des Systemstatus (Heartbeat-Monitoring) gewährleisten wir, dass Ihre Sicherheitstechnik auch unter widrigen
                      Bedingungen wie Stromausfällen oder Sabotageversuchen zuverlässig funktioniert. Dies entspricht den Anforderungen
                      der VdS-Richtlinien und der DIN EN 50131 für Gefahrenmeldeanlagen.
                  </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
               <ServiceBudgetCalculator />
            </div>
        </div>
      </Section>

      {/* Leistungsstufen & Matrix */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Vergleich"
          title="Leistungsstufen und Schutzklassen"
          lead="Abgestimmte Konzepte für private, gewerbliche und hochsensible Anforderungen."
        />
        <div className="mt-8 overflow-x-auto pb-4">
           <table className="w-full text-left border-collapse border-spacing-0">
               <thead>
                   <tr>
                       <th className="border-b border-[oklch(0.89_0.008_260/0.55)] py-4 pl-4 pr-3 text-sm font-semibold text-[oklch(0.16_0.02_260)] sm:pl-6 md:pl-0">Schutzklasse / Aspekt</th>
                       <th className="border-b border-[oklch(0.89_0.008_260/0.55)] py-4 px-3 text-sm font-semibold text-[oklch(0.16_0.02_260)]">Standard (Privat/Kleingewerbe)</th>
                       <th className="border-b border-[oklch(0.89_0.008_260/0.55)] py-4 px-3 text-sm font-semibold text-[oklch(0.16_0.02_260)]">Premium (Gewerbe/Industrie)</th>
                       <th className="border-b border-[oklch(0.89_0.008_260/0.55)] py-4 px-3 text-sm font-semibold text-[oklch(0.16_0.02_260)]">Enterprise (Kritische Infrastruktur)</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)]">
                   <tr>
                       <td className="py-4 pl-4 pr-3 text-sm font-medium text-[oklch(0.16_0.02_260)] sm:pl-6 md:pl-0">Risikoprofil</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Gering bis mittel. Gelegenheitstäter.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Mittel bis hoch. Gezielte Einbrüche, Vandalismus.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Sehr hoch. Professionelle Angriffe, Spionage, Sabotage.</td>
                   </tr>
                   <tr>
                       <td className="py-4 pl-4 pr-3 text-sm font-medium text-[oklch(0.16_0.02_260)] sm:pl-6 md:pl-0">Mechanische Grundsicherung</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">RC2/RC3 Türen & Fenster. Profilzylinder mit Bohr/Ziehschutz.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">RC3/RC4 Elemente. Elektronische Schließanlagen. Mechatronische Absicherung.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">RC4+ Elemente. Hochsicherheitszylinder. Vereinzelungsanlagen, Schleusen.</td>
                   </tr>
                   <tr>
                       <td className="py-4 pl-4 pr-3 text-sm font-medium text-[oklch(0.16_0.02_260)] sm:pl-6 md:pl-0">Alarmierung & Detektion</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Raumüberwachung (PIR). Öffnungsmelder (Magnetkontakte). App-Notifikation.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Außenhautüberwachung. Glasbruchmelder. VdS-zertifizierte Anlagen (Klasse B/C). Aufschaltung NSL.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Perimeterschutz (Zaundetektion, Radar). Körperschallmelder (Tresore). VdS Klasse C. Redundante NSL-Aufschaltung.</td>
                   </tr>
                   <tr>
                       <td className="py-4 pl-4 pr-3 text-sm font-medium text-[oklch(0.16_0.02_260)] sm:pl-6 md:pl-0">Videoüberwachung (CCTV)</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Eingangsbereiche. Lokale Speicherung.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Vollständige Perimeter- und Flurabdeckung. AI-basierte Objekt- & Personenklassifizierung.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Wärmebildkameras (Thermal). PTZ-Tracking. Vollintegrierte Videoanalyse (VCA) im Managementsystem.</td>
                   </tr>
                   <tr>
                       <td className="py-4 pl-4 pr-3 text-sm font-medium text-[oklch(0.16_0.02_260)] sm:pl-6 md:pl-0">Zutrittskontrolle</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Offline-Schließzylinder (RFID).</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Online-Systeme. Zeitzonensteuerung. Integration mit Gefahrenmeldeanlage.</td>
                       <td className="py-4 px-3 text-sm text-[oklch(0.32_0.02_260)]">Biometrische Verifikation (Fingerprint, Iris). Anti-Passback. Mehr-Augen-Prinzip.</td>
                   </tr>
               </tbody>
           </table>
        </div>
        <div className="mt-6 prose prose-slate max-w-none text-[oklch(0.32_0.02_260)] leading-relaxed">
            <p>
                Die richtige Wahl der Schutzklasse hängt von der individuellen Gefährdungsbeurteilung ab.
                Während für ein Einfamilienhaus in der Regel Maßnahmen nach RC2/RC3 in Kombination mit einer VdS Home / Klasse A
                Alarmanlage ausreichend sind, verlangen gewerbliche Objekte mit hohen Sachwerten zwingend VdS Klasse B oder C Anlagen.
                Die Matrix verdeutlicht, dass Sicherheitstechnologie skalierbar sein muss. Ein späteres Upgrade von einer reinen
                Raumüberwachung zu einer umfassenden Außenhautüberwachung mit Perimeter-Detektion ist bei frühzeitiger Planung der
                Kabelwege und Zentralenkapazitäten effizient umsetzbar.
            </p>
        </div>
      </Section>

      {/* Fachspezifische FAQ */}
      <Section>
         <SectionHeading
          eyebrow="Wissen"
          title="Fachspezifischer FAQ-Abschnitt"
          lead="Häufige Fragen zur Planung und Implementierung von Sicherheitstechnik, fachlich fundiert beantwortet."
        />
        <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                <h4 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">1. Was ist der Unterschied zwischen Außenhautüberwachung und Raumüberwachung?</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Die <strong>Außenhautüberwachung</strong> sichert alle Zugänge (Fenster, Türen, Lichtschächte) von innen ab,
                    bevor der Täter in das Objekt eindringt. Sie nutzt Magnetkontakte und Glasbruchmelder. Der Vorteil:
                    Sie können sich im Objekt frei bewegen, während die Anlage scharfgeschaltet ist (intern scharf).
                    Die <strong>Raumüberwachung</strong> (Fallenüberwachung) detektiert Bewegung im Inneren (via Passiv-Infrarot-Melder, PIR).
                    Sie ist oft kostengünstiger, alarmiert jedoch erst, wenn der Täter bereits im Gebäude ist. Ein ganzheitliches Konzept kombiniert beide Ansätze.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                <h4 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">2. Warum ist die Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL) so wichtig?</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Eine Alarmierung per App auf Ihr Smartphone nutzt wenig, wenn Sie im Funkloch sind, schlafen oder
                    die Situation nicht einschätzen können. Eine zertifizierte NSL (nach DIN EN 50518) ist 24/7 besetzt.
                    Die Disponenten prüfen den Alarm (z.B. durch parallele Video-Verifikation) und leiten gemäß einem
                    vorab definierten Interventionsplan sofort Maßnahmen ein – bis hin zur Alarmierung der Polizei.
                    Dies garantiert eine garantierte Reaktionskette, unberührt von Ihrer persönlichen Verfügbarkeit.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                <h4 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">3. Welche Anforderungen stellt die VdS an Einbruchmeldeanlagen (EMA)?</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Der VdS (Vertrauen durch Sicherheit) definiert strikte Richtlinien für Errichter und Technik.
                    VdS-zertifizierte Anlagen (Klassen A, B, C) erfordern u.a. Sabotageüberwachung aller Komponenten,
                    verschlüsselte Kommunikation, redundante Energieversorgung (Akkus) und spezifische Widerstandszeiten
                    der Gehäuse. Gewerbliche Sachversicherer verlangen oft zwingend den Einbau einer VdS-zertifizierten Anlage
                    durch einen anerkannten Errichter, um das Risiko abzusichern.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                <h4 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">4. Lassen sich bestehende Gebäude sinnvoll nachrüsten?</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Ja, absolut. Wo eine konventionelle Verkabelung unverhältnismäßig aufwändig wäre (Schlitze klopfen,
                    Wände neu verputzen), setzen wir auf hochsichere Hybrid- oder Funkalarmanlagen. Moderne Funkprotokolle
                    (oft im 868 MHz Bereich) nutzen Frequency Hopping (Frequenzsprungverfahren), um Störsender (Jamming)
                    zu detektieren und zu umgehen. Zudem sind die Batterielaufzeiten der Melder mittlerweile bei 3 bis 5 Jahren.
                </p>
            </div>

            <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
                <h4 className="text-[17px] font-semibold text-[oklch(0.16_0.02_260)]">5. Was bedeutet &quot;Zwangsläufigkeit&quot; in der Sicherheitstechnik?</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    Die Zwangsläufigkeit ist ein essenzielles Konzept zur Vermeidung von Falschalarmen. Sie stellt technisch sicher,
                    dass eine Alarmanlage nur scharfgeschaltet werden kann, wenn alle überwachten Türen und Fenster geschlossen sind.
                    Ebenso wird verhindert, dass eine Person den gesicherten Bereich betreten kann, bevor die Anlage unscharf geschaltet wurde
                    (z.B. durch ein Sperrelement an der Eingangstür, das bei scharfer Anlage blockiert). Falschalarme binden Ressourcen und
                    verursachen Kosten; Zwangsläufigkeit eliminiert den Faktor menschliches Fehlverhalten.
                </p>
            </div>
        </div>
      </Section>


      {/* Bereiche */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Bereiche"
          title="Sieben Bereiche, die zusammen gedacht werden"
          lead="Einzeln betrachtet bleibt jeder Bereich Stückwerk. Welche Kombination zu Ihrem Objekt passt, klären wir in der Bestandsaufnahme."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? ShieldCheck;
            return (
              <li key={service.id}>
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-foreground group-hover:text-primary">
                    {service.title}
                  </span>
                  <span className="mt-1.5 block flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {service.summary}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground-subtle">
                    Zum Bereich
                    <ArrowRight
                      size={13}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Recht und Verantwortung */}
      <Section id="recht-und-verantwortung">
        <SectionHeading
          eyebrow="Recht und Verantwortung"
          title="Was Sie beim Betrieb von Video, Audio und Protokollen beachten müssen"
          lead="Diese Punkte klären wir vor der Planung, damit die Technik so aufgebaut wird, wie Sie sie später auch betreiben dürfen."
        />

        <Alert
          tone="legal"
          title="Verantwortlich für die Nutzung ist die Betreiberin oder der Betreiber der Anlage"
          className="mt-8"
        >
          <ul className="space-y-2">
            <li>
              Wer eine Anlage mit Video-, Audio- oder Protokollfunktion betreibt, verantwortet deren
              rechtmäßige Nutzung — also Zweck, Umfang, Speicherdauer, Zugriff und Kennzeichnung.
              Wir liefern und montieren die Technik und beraten technisch; eine Rechtsberatung ist
              das ausdrücklich nicht.
            </li>
            <li>
              Kameras dürfen öffentliche Flächen wie Gehwege und Straßen sowie Nachbargrundstücke
              nicht erfassen. Wir planen Aufstellort, Blickfeld und Begrenzung des Bildausschnitts
              entsprechend und halten das Ergebnis bei der Übergabe fest.
            </li>
            <li>
              Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an. Mikrofone und
              Aufzeichnung von Ton sind im Regelfall abgeschaltet.
            </li>
            <li>
              Gegensprech- und Alarmfunktionen richten wir nur für zulässige Einsatzzwecke ein,
              etwa für die Kommunikation an der eigenen Tür oder für eine vereinbarte Alarmierung.
            </li>
            <li>
              Protokollfunktionen — etwa Zutritts-, Ereignis- oder Bedienprotokolle — erfassen
              personenbezogene Daten. Zweck, Speicherdauer und Zugriffsberechtigung legen Sie vorab
              fest; im Beschäftigtenkontext ist zusätzlich die betriebliche Mitbestimmung zu
              beachten.
            </li>
          </ul>

          <p className="mt-3">
            <Link
              href="/rechtliches/datenschutz"
              className="font-semibold text-primary hover:underline"
            >
              Hinweise zum Datenschutz
            </Link>
          </p>
        </Alert>
      </Section>

      {/* Verbindung zur Mechanik */}
      <Section tone="muted" tight>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-full">
            <CardBody className="flex h-full flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Grundschutz zuerst
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Tür- und Schließtechnik</p>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                Zylinder, Schlösser, Beschläge und Zusatzsicherungen sind die Grundlage. Erst darauf
                setzen wir Melde- und Alarmtechnik auf.
              </p>
              <Link
                href="/tuer-und-schliesstechnik"
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
              >
                Zur Tür- und Schließtechnik
                <ArrowRight size={15} aria-hidden />
              </Link>
            </CardBody>
          </Card>

          <Card className="h-full">
            <CardBody className="flex h-full flex-col">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Bestandsaufnahme
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Sicherheitscheck</p>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                Zehn Schritte zu Objekt, Zugängen, vorhandener Technik, Schwerpunkten und
                Unterlagen. Ihr Zwischenstand bleibt erhalten.
              </p>
              <Link
                href={`/${ROUTE}/sicherheitscheck`}
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
              >
                Sicherheitscheck starten
                <ArrowRight size={15} aria-hidden />
              </Link>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Weiterführende Seiten */}
      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
