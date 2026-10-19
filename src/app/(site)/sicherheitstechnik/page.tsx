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
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { SecurityAuditScanner } from '@/components/sicherheitstechnik/security-audit-scanner';

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
interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);


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
        <div className="space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed" data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
          <h2 className="text-2xl font-bold text-[oklch(0.16_0.02_260)]">Fundierte Sicherheitsarchitektur für moderne Objekte</h2>
          <p>
            Sicherheitstechnik im 21. Jahrhundert ist weit mehr als die bloße Aneinanderreihung von Riegeln und Kameras.
            Es ist ein komplexes Zusammenspiel aus physischen Barrieren, intelligenten Sensoren und vernetzten Meldesystemen.
            Jeder Aspekt der Gebäudeinfrastruktur muss als integraler Bestandteil eines ganzheitlichen Sicherheitskonzepts betrachtet werden.
            Die Zeiten, in denen eine einfache Schließanlage oder eine isolierte Alarmanlage ausreichte, sind endgültig vorbei.
            Moderne Gefährdungslagen erfordern adaptive, mehrschichtige Verteidigungsstrategien, die potenzielle Angreifer nicht nur abschrecken,
            sondern jeden Versuch des unbefugten Eindringens in Echtzeit detektieren, verifizieren und eskalieren.
            Um eine echte Sicherheit zu gewährleisten, müssen wir weg von Insellösungen hin zu integrierten Systemen, die miteinander kommunizieren.
            Die Verbindung von Mechanik, Mechatronik und reiner Elektronik bildet das Rückgrat eines jeden ernstzunehmenden Sicherheitsdispositivs.
            Dies beginnt bereits bei der architektonischen Planung, bei der Fluchtwege, Brandschutzanforderungen und Einbruchschutz in Einklang gebracht werden müssen.
            Eine fehlerhafte Planung in dieser frühen Phase führt später zu enormen Kosten für Nachrüstungen und Kompromissen bei der Sicherheit.
          </p>
          <p>
            Der Grundpfeiler jeder robusten Sicherheitsarchitektur bleibt die physische Mechanik.
            Mechanische Schließsysteme, Sicherheitstüren der entsprechenden Widerstandsklassen (RC3 bis RC6) und
            gepanzerte Fensterfronten bilden die erste Verteidigungslinie. Ihr primäres Ziel ist die Zeiterhöhung –
            die Maximierung der Dauer, die ein Täter benötigt, um die Barriere zu überwinden. In der Kriminologie
            und der Sicherheitstechnik spricht man hier vom &quot;Täter-Zeit-Diagramm&quot;. Je länger der Widerstand standhält,
            desto höher ist die Wahrscheinlichkeit eines Abbruchs der Tat. Moderne Schließzylinder verfügen heute über
            Bohr-, Zieh- und Nachschließschutz sowie komplexe Profilierungen, die unbefugtes Kopieren unmöglich machen.
            Doch Mechanik allein ist stumm. Sie leistet Widerstand, meldet aber keinen Angriff. Genau hier setzt die elektronische Überwachung an,
            um den Täter nicht nur aufzuhalten, sondern gleichzeitig die Interventionskräfte zu alarmieren.
            Der mechanische Grundschutz muss zwingend nach DIN EN 1627 zertifiziert sein, um von Versicherern anerkannt zu werden.
            Zusatzschlösser, Panzerriegel und Scharnierseitensicherungen ergänzen schwache Türen, können aber eine minderwertige Grundsubstanz nicht vollständig heilen.
          </p>

          <SecurityAuditScanner />

          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Elektronische Zutrittskontrolle als dynamischer Filter</h3>
          <p>
            Aufbauend auf der Mechanik ermöglicht die elektronische Zutrittskontrolle (EZK) eine granulare,
            zeit- und raumbezogene Steuerung der Personenströme. Anders als mechanische Schlüssel, die bei Verlust
            einen kostspieligen Austausch der gesamten Anlage erzwingen, lassen sich RFID-Transponder, Smart Cards
            oder mobile Credentials via Smartphone in Millisekunden sperren. Ein modernes Zutrittskontrollsystem
            fungiert als das zentrale Nervensystem des Gebäudes. Es protokolliert nicht nur Zutrittsereignisse,
            sondern integriert sich nahtlos in Personalzeiterfassung, Aufzugssteuerung und Gebäudeautomation.
            Die Implementierung kryptografisch abgesicherter Kommunikationsprotokolle (wie OSDP) zwischen Leser und
            Controller ist dabei obligatorisch, um Man-in-the-Middle-Angriffe (z.B. Skimming) effektiv zu unterbinden.
            Darüber hinaus ermöglicht eine vernetzte EZK die Umsetzung komplexer Logiken wie Anti-Passback (um die Weitergabe von Ausweisen zu verhindern),
            Vier-Augen-Prinzipien für Hochsicherheitsbereiche und automatische Schleusensteuerungen.
            Die Integration in Active Directory oder andere Identity-Provider automatisiert das Onboarding und Offboarding von Mitarbeitern
            und minimiert so administrative Sicherheitslücken.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Gefahrenmeldetechnik: Das wachsame Auge</h3>
          <p>
            Die dritte Säule bildet die Einbruchmeldeanlage (EMA), oft synonym als Alarmanlage bezeichnet.
            Sie übernimmt die Aufgabe der permanenten Raum- und Außenhautüberwachung. Moderne EMA-Systeme nutzen
            eine Fusion verschiedener Sensortechnologien (Dual-Melder mit Passiv-Infrarot und Mikrowelle), um
            Fehlalarme durch Haustiere oder thermische Schwankungen zu minimieren. Die Außenhautüberwachung mittels
            Magnetkontakten, Glasbruchsensoren und Erschütterungsmeldern detektiert den Angriffsversuch bereits
            bevor der Täter in das Objekt eingedrungen ist. Das Herzstück der Anlage, die Gefahrenmeldezentrale,
            muss strengen Normen (EN 50131 / VdS) entsprechen und über redundante Übertragungswege (IP, LTE, GSM)
            die Alarmierung einer Notruf- und Serviceleitstelle (NSL) sicherstellen.
            Eine professionelle EMA muss zudem manipulationssicher sein; Sabotagekontakte an Gehäusen und Meldern
            sowie die ständige Überwachung der Bus-Kommunikation sind unabdingbar.
            Die Zwangsläufigkeit – also die technische Unmöglichkeit, eine unscharfe Anlage bei noch offenen Fenstern scharfzuschalten –
            verhindert menschliche Bedienfehler und ist ein Kernkriterium für VdS-zertifizierte Anlagen.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Videosicherheit und Verifikation</h3>
          <p>
            Videoüberwachung (CCTV) dient heute nicht mehr primär der bloßen Aufzeichnung, sondern der proaktiven
            Intervention. Durch die Integration von Künstlicher Intelligenz (KI) und Deep-Learning-Algorithmen
            können Kamerasysteme Objekte klassifizieren, virtuelle Stolperdrähte ziehen (Line Crossing) und
            verwaiste Gepäckstücke erkennen. Im Alarmfall ermöglicht die Videoverifikation der NSL eine
            Echtzeit-Beurteilung der Lage. Dies ist entscheidend, um den Polizeieinsatz zu priorisieren und
            Falschalarme auszuschließen. Gleichzeitig müssen bei der Planung und Installation von Kamerasystemen
            strenge datenschutzrechtliche Vorgaben (DSGVO, BDSG) eingehalten werden. Privacy-Masking, minimale
            Vorhaltezeiten und verschlüsselte Datenspeicher sind zwingende Voraussetzungen für den rechtskonformen Betrieb.
            Die neuesten Generationen von Wärmebildkameras erlauben zudem eine Detektion selbst bei völliger Dunkelheit,
            starkem Nebel oder dichtem Laubwerk, wo konventionelle optische Sensoren an ihre physikalischen Grenzen stoßen.
            Ein intelligentes Videomanagementsystem (VMS) korreliert diese Videodaten mit den Ereignissen der Zutrittskontrolle
            und der Einbruchmeldeanlage, um dem Sicherheitsverantwortlichen ein umfassendes, sofort verständliches Lagebild zu präsentieren.
          </p>
          <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)] mt-8">Häufig gestellte Fragen (FAQ)</h3>
          <div className="space-y-4">
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-4 rounded-lg">
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">1. Wie oft sollte eine Schließanlage gewartet oder erneuert werden?</h4>
              <p className="mt-2 text-sm">Mechanische Komponenten unterliegen einem Verschleiß. Wir empfehlen eine jährliche Inspektion und einen Austausch nach spätestens 10-15 Jahren oder bei signifikanten Veränderungen im Personalbestand. Auch Schmutz, Staub und Witterungseinflüsse verkürzen die Lebensdauer von Außenzylindern erheblich. Eine regelmäßige Pflege mit speziellen Pflegesprays (niemals Öl!) erhält die Funktionsfähigkeit.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-4 rounded-lg">
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">2. Was unterscheidet eine VdS-anerkannte Anlage von einem Baumarkt-System?</h4>
              <p className="mt-2 text-sm">VdS-Systeme durchlaufen strenge Prüfverfahren bezüglich Manipulationssicherheit, Zuverlässigkeit und Fehlalarmsicherheit. Sie sind zudem oft Voraussetzung für den Versicherungsschutz bei Gewerbeobjekten. Ein Baumarkt-System bietet oft nur Scheinsicherheit, verwendet unverschlüsselte Funkprotokolle, die leicht gestört (Jamming) oder abgefangen (Replay-Angriffe) werden können, und verfügt nicht über die notwendige Sabotageüberwachung.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-4 rounded-lg">
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">3. Kann ich eine bestehende Mechanik mit Elektronik nachrüsten?</h4>
              <p className="mt-2 text-sm">Ja, in den meisten Fällen lassen sich mechatronische Zylinder oder elektronische Beschläge in bestehende DIN-Schlösser integrieren, ohne dass Türen ausgetauscht werden müssen. Der Vorteil dieser Lösung ist die Skalierbarkeit: Man kann zunächst die Außentüren elektronisch absichern und später Innentüren schrittweise in das System aufnehmen. Einzige Voraussetzung ist ein normgerechtes Einsteckschloss.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-4 rounded-lg">
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">4. Sind kabellose (Funk-) Alarmanlagen sicher?</h4>
              <p className="mt-2 text-sm">Moderne Funk-EMA nutzen bidirektionale, verschlüsselte Kommunikation (AES) und ständigen Rollcode. Sie erkennen Jamming-Versuche sofort und sind somit sehr sicher, sofern hochwertige Komponenten verwendet werden. Es muss jedoch beachtet werden, dass Funkkomponenten auf Batterien angewiesen sind, deren Zustand regelmäßig überwacht und deren Austausch turnusgemäß (ca. alle 2-3 Jahre) eingeplant werden muss.</p>
            </div>
            <div className="border border-[oklch(0.89_0.008_260/0.55)] p-4 rounded-lg">
              <h4 className="font-bold text-[oklch(0.16_0.02_260)]">5. Was passiert bei einem Stromausfall?</h4>
              <p className="mt-2 text-sm">Professionelle Sicherheitssysteme sind zwingend mit Notstromakkus ausgestattet, die den Betrieb (je nach Systemgröße und Konzeption) für mindestens 12 bis 60 Stunden gewährleisten. Bei Zutrittskontrollsystemen kann konfiguriert werden, ob Türen im stromlosen Zustand automatisch verriegeln (Fail-Secure, typisch für Hochsicherheitsbereiche) oder zur Flucht entriegeln (Fail-Safe, gesetzliche Pflicht bei Fluchtwegen).</p>
            </div>
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
