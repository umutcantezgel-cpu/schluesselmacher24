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
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

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

export default async function SicherheitstechnikPage() {
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



      {/* Fachkompetenz und Methodik - Erweiterung */}
      <Section id="architektur-und-methodik" tone="muted">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Architektur & Methodik"
              title="Die fundamentale Architektur moderner Sicherheitssysteme"
              lead="Wahre Sicherheit entsteht nicht durch die bloße Aneinanderreihung technischer Geräte, sondern durch ein kohärentes, architektonisches Gesamtkonzept."
            />
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
              <p>
                Die Planung und Implementierung hochwirksamer Sicherheitstechnik erfordert eine Methodik,
                die weit über die Auswahl einzelner Komponenten hinausgeht. Wir verfolgen einen strikten,
                mehrschichtigen Ansatz, der auf dem Prinzip der &quot;Defense in Depth&quot; (tiefengestaffelte Verteidigung) basiert.
                Dieses Konzept zielt darauf ab, Angreifern auf jeder Stufe ihres Vorgehens maximale Widerstände entgegenzusetzen,
                die Wahrscheinlichkeit einer Entdeckung signifikant zu erhöhen und gleichzeitig die Reaktionszeit der
                Einsatzkräfte zu optimieren.
              </p>
              <p>
                Der erste Schritt unserer Methodik ist stets die präzise Risiko- und Bedrohungsanalyse.
                Wir bewerten nicht nur die physische Beschaffenheit Ihres Objekts, sondern analysieren auch das Umfeld,
                die potenziellen Angriffsvektoren und das spezifische Schutzbedürfnis der Nutzer.
                Diese Phase der Architekturplanung ist essenziell, um Über- oder Unterdimensionierung zu vermeiden
                und Investitionen exakt dort zu platzieren, wo sie den höchsten Schutzwert generieren.
              </p>
              <p>
                Auf Basis dieser Analyse entwickeln wir eine ganzheitliche Sicherheitsarchitektur.
                Diese integriert mechanischen Grundschutz (die physische Barriere), elektronische Meldetechnik
                (die sensorische Erfassung), Videoüberwachung (die visuelle Verifikation) und smarte
                Zutrittskontrollsysteme (die präventive Steuerung) zu einem symbiotischen Gesamtsystem.
                Jede Komponente wird sorgfältig kalibriert, um Fehlalarme zu minimieren und die Systemintegrität
                auch unter widrigen Bedingungen sicherzustellen.
              </p>
              <p>
                Ein wesentlicher Aspekt unserer Methodik ist die Resilienz der Systeme.
                Dies beinhaltet redundante Kommunikationswege für Alarmübertragungen (Dual-Path-Signaling),
                unterbrechungsfreie Stromversorgungen (USV) und sabotageüberwachte Verkabelungen oder
                verschlüsselte Funkprotokolle. Nur ein System, das sich selbst überwacht und gegen Manipulationen
                härtet, bietet die Zuverlässigkeit, die im Ernstfall gefordert ist.
              </p>
              <p>
                Abschließend begleiten wir den gesamten Lebenszyklus der Sicherheitstechnik.
                Von der fachgerechten Installation nach aktuellen VdS- und DIN-Normen über die detaillierte
                Einweisung der Nutzer bis hin zu regelmäßigen Wartungen und Software-Updates.
                Sicherheit ist kein statischer Zustand, sondern ein kontinuierlicher Prozess,
                den wir als verlässlicher Partner dauerhaft betreuen.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Kalkulieren Sie Ihr Projekt</h3>
            <p className="text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
               Nutzen Sie unseren interaktiven Budget-Kalkulator, um einen ersten Eindruck von den
               Investitionskosten für Ihr maßgeschneidertes Sicherheitskonzept zu erhalten.
            </p>
            <ServiceBudgetCalculator />
          </div>
        </div>
      </Section>

      {/* Leistungsstufen und Vergleichsmatrix */}
      <Section id="leistungsstufen">
         <SectionHeading
          eyebrow="Vergleichsmatrix"
          title="Strukturierte Leistungsstufen für jedes Schutzbedürfnis"
          lead="Basierend auf unserer Erfahrung haben wir drei Kernprofile entwickelt, die als architektonische Grundlage für Ihre individuelle Planung dienen."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
           {/* Tier 1 */}
           <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] hover:border-[oklch(0.52_0.24_260/0.5)] transition-colors motion-reduce:transition-none flex flex-col h-full">
              <div className="mb-6">
                 <h4 className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)]">Grundschutz Profil</h4>
                 <p className="mt-2 text-2xl font-bold text-[oklch(0.16_0.02_260)]">Prävention</p>
                 <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                   Fokus auf mechanische Härtung und grundlegende Abschreckung für private Wohnobjekte mit normalem Risiko.
                 </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Zertifizierte Schließzylinder (SKG***)</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Mechanische Fenster- & Türsicherungen</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Lokale Alarmierung (Sirene/Blitzlicht)</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Sichtbare Dummy-Kameras zur Abschreckung</span>
                 </li>
              </ul>
           </div>

           {/* Tier 2 */}
           <div className="rounded-2xl border-2 border-[oklch(0.52_0.24_260)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_12px_32px_-8px_oklch(0.52_0.24_260/0.15)] relative flex flex-col h-full transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[oklch(0.52_0.24_260)] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                 Am häufigsten gewählt
              </div>
              <div className="mb-6">
                 <h4 className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)]">Erweitertes Profil</h4>
                 <p className="mt-2 text-2xl font-bold text-[oklch(0.16_0.02_260)]">Detektion & Verifikation</p>
                 <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                   Intelligente Kombination aus Mechanik, Sensorik und Videoüberwachung für anspruchsvolle Privathaushalte und Gewerbe.
                 </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Alle Leistungen des Grundschutz Profils</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Vernetzte Einbruchmeldeanlage (App-Steuerung)</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Smarte Zutrittskontrolle (RFID/Smartphone)</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>KI-gestützte IP-Videoüberwachung (Perimeter)</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Aufschaltung auf Wachdienst (optional)</span>
                 </li>
              </ul>
           </div>

           {/* Tier 3 */}
           <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.03)] hover:border-[oklch(0.52_0.24_260/0.5)] transition-colors motion-reduce:transition-none flex flex-col h-full">
              <div className="mb-6">
                 <h4 className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)]">Maximalschutz Profil</h4>
                 <p className="mt-2 text-2xl font-bold text-[oklch(0.16_0.02_260)]">Holistische Sicherheit</p>
                 <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                   Kompromisslose Sicherheitsarchitektur für Hochrisiko-Objekte, exponierte Lagen und kritische Infrastrukturen.
                 </p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Alle Leistungen des Erweiterten Profils</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>VdS-zertifizierte Anlagenkomponenten (Klasse B/C)</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Biometrische Zutrittssysteme (Venen-Scans)</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Redundante Übertragungswege & USV</span>
                 </li>
                 <li className="flex items-start text-[14px] text-[oklch(0.32_0.02_260)]">
                    <ShieldCheck className="mr-2 h-5 w-5 text-[oklch(0.52_0.24_260)] shrink-0" />
                    <span>Thermalkameras für vollständige Dunkelheit</span>
                 </li>
              </ul>
           </div>
        </div>
      </Section>

      {/* Fachspezifischer FAQ-Abschnitt */}
      <Section id="faq">
        <SectionHeading
          eyebrow="Fachwissen & Häufige Fragen"
          title="Klarheit für komplexe Sicherheitsentscheidungen"
          lead="Die Wahl der richtigen Sicherheitstechnik wirft oft tiefgreifende technische und strategische Fragen auf. Hier beantworten wir die wichtigsten."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
           <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                 Warum raten Experten von reinen WLAN-Kameras zur primären Objektsicherung ab?
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                 WLAN-Systeme sind anfällig für Signalstörungen (Jamming) und Verbindungsabbrüche.
                 Für eine professionelle Sicherheitsarchitektur setzen wir ausnahmslos auf PoE (Power over Ethernet) basierte IP-Kameras.
                 Diese bieten eine stabile, kabelgebundene Datenübertragung und werden gleichzeitig zentral über das Netzwerkkabel mit Strom versorgt,
                 was eine Absicherung durch eine zentrale USV (Unterbrechungsfreie Stromversorgung) ermöglicht.
              </p>
           </div>

           <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                 Was ist der Unterschied zwischen einer Alarmanlage und einer Einbruchmeldeanlage (EMA)?
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                 Während &quot;Alarmanlage&quot; oft ein umgangssprachlicher Begriff für Consumer-Produkte ist,
                 bezeichnet eine EMA ein normgerechtes, oft zertifiziertes (z.B. nach EN 50131) System.
                 Eine professionelle EMA verfügt über Notstromakkus, sabotageüberwachte Linien,
                 Zwangsläufigkeit (verhindert das Scharfschalten bei offenen Fenstern) und
                 zertifizierte Übertragungsgeräte zur Aufschaltung auf eine Notruf- und Serviceleitstelle (NSL).
              </p>
           </div>

           <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                 Wie funktioniert die Perimeterüberwachung mit KI?
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                 Moderne Kamerasysteme analysieren Bilddaten in Echtzeit direkt in der Kamera (Edge AI).
                 Sie können zuverlässig zwischen Menschen, Fahrzeugen, Tieren und witterungsbedingten Bewegungen
                 (z.B. wehende Äste) unterscheiden. Dies reduziert Falschalarme auf ein Minimum und ermöglicht es,
                 virtuelle Stolperdrähte (Line Crossing) oder Sperrzonen im Außenbereich (Perimeter) zu definieren,
                 die bei Betreten sofort eine Aktion (z.B. Push-Nachricht oder Lichtzuschaltung) auslösen.
              </p>
           </div>

           <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                 Ist eine elektronische Schließanlage sicherer als eine mechanische?
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                 Elektronische Anlagen bieten primär organisatorische Sicherheit und Flexibilität:
                 Verlorene Transponder können sofort gesperrt werden, ohne Zylinder tauschen zu müssen,
                 und Zutrittsrechte sind zeitlich steuerbar. Die rein physische Widerstandskraft gegen Aufbohren
                 oder Ziehen hängt jedoch, wie bei der Mechanik, von der Qualität und Zertifizierung des eingesetzten Zylinders ab.
                 Wir kombinieren oft beides: Elektronik für Komfort und Kontrolle, Mechanik für maximale Widerstandskraft.
              </p>
           </div>

           <div className="rounded-xl md:col-span-2 border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">
                 Welche rechtlichen Einschränkungen gelten für die Videoüberwachung im privaten und gewerblichen Umfeld?
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                 Der Einsatz von Videotechnik unterliegt strikten datenschutzrechtlichen Vorgaben (DSGVO).
                 Im privaten Bereich dürfen Kameras ausschließlich das eigene Grundstück erfassen. Öffentliche Gehwege,
                 Straßen oder Nachbargrundstücke sind tabu (oft durch softwareseitige Privacy-Masking-Zonen realisiert).
                 Im gewerblichen Umfeld muss ein berechtigtes Interesse vorliegen, die Speicherdauer ist auf das absolute
                 Minimum (meist 48-72 Stunden) zu begrenzen, und es besteht eine strikte Hinweispflicht (Beschilderung).
                 Wir beraten Sie bei der technischen Umsetzung dieser Vorgaben umfassend, um Bußgelder zu vermeiden.
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
