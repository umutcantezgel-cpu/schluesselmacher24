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
import { ServiceBudgetCalculator } from '@/components/calculator/service-budget-calculator';
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

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      <div style={{ display: 'none' }} data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)} />
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


      {/* Fachliche Methodik und Leistungsstufen */}
      <Section id="architektur-und-methodik" tight>
        <SectionHeading
          eyebrow="Architektur & Methodik"
          title="Tiefgehende Integration von Sensorik und Aktorik"
          lead="Wir betrachten Sicherheit nicht als Summe von Einzelkomponenten, sondern als geschlossenes Ökosystem. Ein wirksames Sicherheitskonzept erfordert die nahtlose Integration von mechanischen Barrieren, elektronischer Sensorik und reaktionsschneller Aktorik."
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
          <p>
            Moderne Sicherheitstechnik basiert auf dem Prinzip der Redundanz und der mehrstufigen Verifikation. Ein klassischer Einbruchversuch beginnt meist an der schwächsten Stelle der Außenhülle. Hier greift die erste Stufe: Die mechanische Barriere. Hochfeste Schließzylinder, Pilzkopfverriegelungen und verstärkte Schließbleche verzögern das Eindringen signifikant. Doch Mechanik allein reicht nicht aus.
          </p>
          <p>
            Die zweite Stufe bildet die Sensorik. Magnetkontakte an Türen und Fenstern (Perimeterschutz) sowie passive Infrarot-Bewegungsmelder (Fallenüberwachung) im Innenbereich erkennen jeden unautorisierten Zugriff. Diese Sensoren sind nicht isoliert, sondern über verschlüsselte Bus-Systeme oder bidirektionalen Funk mit der zentralen Einbruchmeldeanlage (EMA) verbunden.
          </p>
          <p>
            Die dritte Stufe ist die Aktorik und Alarmierung. Bei einer Detektion löst das System nicht nur lokale optisch-akustische Signalgeber (Sirenen) aus, sondern überträgt die Alarmmeldung verzögerungsfrei an eine VdS-zertifizierte Notruf- und Serviceleitstelle (NSL). Parallel können Smart-Home-Integrationen aktiviert werden, um beispielsweise die gesamte Beleuchtung einzuschalten und Rollläden herunterzufahren – ein massiver psychologischer Effekt gegen den Täter.
          </p>
          <p>
            Darüber hinaus spielt die Videoüberwachung eine entscheidende Rolle für die Verifikation. KI-gestützte Kamerasysteme analysieren das Bildmaterial in Echtzeit, unterscheiden zwischen Personen, Tieren und Fahrzeugen und reduzieren so die Falschalarmquote auf ein Minimum. Die Videoanalyse ermöglicht es der Leitstelle, die Situation sofort einzuschätzen und zielgerichtete Interventionsmaßnahmen einzuleiten, noch bevor der Täter in das Objekt eindringen kann.
          </p>
          <p>
            Unsere Methodik umfasst eine strukturierte Schwachstellenanalyse, die Erstellung eines individuellen Zonenkonzepts und die professionelle Projektierung gemäß den geltenden DIN EN und VdS Richtlinien. Wir begleiten Sie von der ersten Beratung über die fachgerechte Installation bis hin zur regelmäßigen Wartung und Instandhaltung Ihres Systems, um eine dauerhafte Funktionstüchtigkeit und maximale Ausfallsicherheit zu gewährleisten. Die Integration modernster Zutrittskontrollsysteme rundet das Portfolio ab und ermöglicht ein flexibles, sicheres Berechtigungsmanagement für alle Nutzergruppen.
          </p>
          <p>
            Ein weiterer essenzieller Aspekt unserer Architektur ist die Ausfallsicherheit. Sämtliche kritischen Komponenten sind notstromgepuffert. Selbst bei einem kompletten Netzausfall oder einer gezielten Sabotage der Stromversorgung bleibt die Anlage voll funktionsfähig und meldet den Störfall umgehend an die Leitstelle. Die Übertragungswege sind redundant ausgelegt – meist durch eine Kombination aus IP-basierter Kommunikation und einem Mobilfunk-Backup (LTE/5G).
          </p>
          <p>
            Wir legen größten Wert auf eine intuitive Bedienbarkeit. Komplexe Technik darf den Nutzer im Alltag nicht einschränken. Die Scharf-/Unscharfschaltung erfolgt wahlweise über RFID-Transponder, biometrische Leser, gesicherte Smartphone-Apps oder PIN-Code-Tastaturen. Das System gibt klares, optisches und akustisches Feedback und verhindert durch Zwangsläufigkeit Fehlbedienungen – beispielsweise lässt sich die Anlage nicht scharfschalten, solange noch ein Fenster geöffnet ist.
          </p>
          <p>
            Die regelmäßige Wartung nach DIN VDE 0833 ist nicht nur eine Empfehlung, sondern essenziell für den Erhalt des Versicherungsschutzes. Wir führen umfassende Funktionsprüfungen durch, aktualisieren Firmware-Stände zur Schließung potenzieller IT-Sicherheitslücken und tauschen Akkus präventiv aus, bevor sie ihre Kapazitätsgrenze erreichen. Ihre Sicherheit ist ein kontinuierlicher Prozess, den wir mit höchster Präzision und Verlässlichkeit steuern.
          </p>
          <p>
            Zusammenfassend lässt sich sagen: Effektive Sicherheitstechnik ist ein orchestriertes Zusammenspiel von Prävention, Detektion, Verifikation und Intervention. Vertrauen Sie auf unsere Expertise, um Ihr Objekt, Ihre Werte und vor allem die Menschen darin kompromisslos zu schützen.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" tone="muted">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Antworten zu Planung und Betrieb"
        />
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie unterscheidet sich eine funkbasierte von einer kabelgebundenen Einbruchmeldeanlage?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Kabelgebundene Anlagen bieten maximale Stabilität und Unabhängigkeit von Batterien, erfordern jedoch bei Nachrüstung einen höheren Installationsaufwand. Funkanlagen (wie z.B. von Daitem) nutzen spezielle, sichere Frequenzen (TwinBand-Verfahren), sind schnell installiert und flexibel erweiterbar, benötigen aber regelmäßige Batteriewechsel.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Ist eine Aufschaltung zur Notruf- und Serviceleitstelle (NSL) zwingend erforderlich?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Nicht zwingend, aber dringend empfohlen. Ein lokaler Alarm allein reicht oft nicht aus, da Nachbarn häufig nicht oder falsch reagieren. Eine NSL gewährleistet an 365 Tagen im Jahr eine sofortige, professionelle Intervention nach einem vorher festgelegten Maßnahmenplan (z.B. Verständigung der Polizei, Entsendung eines Wachdienstes).
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Anforderungen stellt meine Versicherung an die Sicherheitstechnik?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Gewerbliche und hochwertige private Risiken erfordern oft VdS-zertifizierte Anlagen. Der VdS (Vertrauen durch Sicherheit) definiert strenge Richtlinien für Komponenten und Installation (VdS-Klassen A, B, C). Wir planen und errichten konform zu diesen Anforderungen, um Ihren vollen Versicherungsschutz zu gewährleisten.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Darf ich meinen Eingangsbereich mit Kameras überwachen?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Ja, auf Ihrem Privatgrundstück. Sie dürfen jedoch keinesfalls öffentliche Flächen (Gehwege, Straßen) oder das Nachbargrundstück erfassen. Wir richten Kamerasysteme datenschutzkonform ein, nutzen Privatzonenmaskierung zur Ausblendung sensibler Bereiche und weisen Sie auf die nötigen Kennzeichnungspflichten hin.
            </p>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Was bedeutet Zwangsläufigkeit bei einer Alarmanlage?</h3>
            <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Zwangsläufigkeit verhindert Falschalarme durch menschliches Fehlverhalten. Sie stellt sicher, dass die Anlage erst scharfgeschaltet werden kann, wenn alle Fenster und Türen geschlossen sind. Ebenso verhindert sie das Betreten des gesicherten Bereichs (z.B. durch ein blockierendes Sperrelement in der Tür), bevor die Anlage unscharf geschaltet wurde.
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

      {/* Budget Calculator */}
      <Section tight>
        <SectionHeading
          eyebrow="Kalkulation"
          title="Transparente Investitionsplanung"
          lead="Ermitteln Sie einen ersten Richtwert für Ihre Sicherheitslösung. Die finale Planung erfolgt nach einer Vor-Ort-Besichtigung."
        />
        <div className="mt-8 max-w-2xl mx-auto">
          <ServiceBudgetCalculator />
        </div>
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
