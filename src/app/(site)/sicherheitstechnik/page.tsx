import { JsonLd } from '@/components/seo/json-ld';
import { pageGraphSchema } from '@/components/seo/json-ld';

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { SecurityBudgetCalculator } from '@/components/sicherheitstechnik/security-budget-calculator';

const ROUTE = 'sicherheitstechnik';

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  if (!page) return {};
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: {
      canonical: `/${ROUTE}`,
    },
  };
}

export default async function SicherheitstechnikPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  void resolvedParams;
  void resolvedSearch;
  const page = await getPageContent(ROUTE);

  const PRINCIPLE = [
    {
      term: 'Mechanische Sicherung',
      body: 'Massive Schließbleche, Sicherheitsrosetten und Schutzbeschläge bilden den physischen Widerstand. Sie verlängern die Zeit, die ein Täter benötigt, um in das Objekt einzudringen. Dies ist die absolute Basis – ohne eine solide mechanische Grundlage ist jede elektronische Erweiterung zwecklos. Eine hochwertige Mechanik hält den ersten Einbruchsversuchen stand und schreckt viele Gelegenheitstäter bereits im Vorfeld ab.',
      href: '/tuer-und-schliesstechnik',
      linkLabel: 'Zur Tür- und Schließtechnik',
    },
    {
      term: 'Elektronische Meldetechnik',
      body: 'Sensoren an Türen und Fenstern (Glasbruchmelder, Magnetkontakte) sowie Infrarot-Bewegungsmelder im Innenraum erkennen unbefugtes Eindringen sofort. Sie sind das Nervensystem eines jeden Sicherheitskonzepts. Diese Sensoren übermitteln die Signale in Echtzeit an die zentrale Steuerungseinheit, welche die Informationen auswertet und entsprechende Reaktionen einleitet.',
      href: '/sicherheitstechnik/alarmanlagen',
      linkLabel: 'Zu Alarmanlagen',
    },
    {
      term: 'Aktive Alarmierung',
      body: 'Sirenen, Blitzleuchten oder die stille Alarmierung auf ein mobiles Endgerät bzw. zu einem Wachdienst stellen die unmittelbare Reaktion auf einen Einbruchsversuch dar. Sie dienen nicht nur der Abschreckung des Täters, sondern vor allem der sofortigen Information der berechtigten Personen oder Institutionen, damit schnelle Gegenmaßnahmen ergriffen werden können.',
      href: '/sicherheitstechnik/alarmanlagen',
      linkLabel: 'Zu Alarmanlagen',
    },
  ];

const process = PROCESS_LABELS['gefuehrte-anfrage'];

  const services = await getServicePages(ROUTE);

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: ROUTE,
          name: page?.seo.title ?? page?.headline ?? 'Sicherheitstechnik',

          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }],
        })}
      />
      <main
      data-params={JSON.stringify(resolvedParams)}
      data-search={JSON.stringify(resolvedSearch)}
      className="bg-[oklch(0.988_0.002_260)] text-[oklch(0.32_0.02_260)]"
    >
      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Sicherheitstechnik der neuesten Generation'}
        lead={page?.subline ?? 'Ganzheitliche Sicherheitskonzepte für private und gewerbliche Objekte. Von der mechanischen Grundsicherung bis zur vernetzten Alarm- und Videotechnik.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/sicherheitscheck`} size="lg" className="bg-[oklch(0.52_0.24_260)] text-white hover:bg-[oklch(0.46_0.24_260)]">
            Sicherheitscheck starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Grundsatz */}
      <Section tight className="py-16 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Architektonische Methodik"
              title="Ein ganzheitlicher Ansatz: Prävention, Detektion und Intervention"
              lead="Sicherheit ist kein Zufall, sondern das Ergebnis präziser Planung und Ausführung. Wir betrachten Ihr Objekt nicht isoliert, sondern als System, in dem alle Komponenten – mechanisch und elektronisch – nahtlos ineinandergreifen müssen, um maximalen Schutz zu gewährleisten."
            />

            <div className="mt-8 prose prose-lg text-[oklch(0.32_0.02_260)] leading-relaxed">
              <p>
                Die Grundlage jedes seriösen Sicherheitskonzepts ist das sogenannte Zwiebelschalenprinzip. Die äußere Schale bildet die Grundstücksgrenze, gefolgt von der Gebäudehülle (Türen, Fenster) als mittlere Schale und schließlich den sensiblen Innenbereichen als innere Schale. Jede dieser Schichten muss spezifisch abgesichert werden.
              </p>
              <p>
                Die <strong>mechanische Grundsicherung</strong> (Widerstandsklasse RC2 oder höher) ist essenziell. Sie stellt den physischen Widerstand dar. Ein Täter, der auf massiven Widerstand trifft, bricht sein Vorhaben oft innerhalb weniger Minuten ab.
              </p>
              <p>
                Ergänzt wird diese Basis durch die <strong>elektronische Detektion</strong>. Moderne Sensortechnik ist in der Lage, nicht nur das tatsächliche Eindringen, sondern bereits den Manipulationsversuch an der Mechanik (z.B. durch intelligente Erschütterungssensoren) zu erkennen und sofort zu melden.
              </p>
            </div>

            <dl className="mt-12 space-y-4">
              {PRINCIPLE.map((item) => (
                <div key={item.term} className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                  <dt className="text-[16px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">{item.term}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    {item.body}
                    <Link
                      href={item.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[oklch(0.52_0.24_260)] hover:text-[oklch(0.46_0.24_260)] hover:underline"
                    >
                      {item.linkLabel}
                      <ArrowRight size={15} aria-hidden />
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-8 lg:sticky lg:top-8">
            <SecurityBudgetCalculator />

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)]">
                Methodischer Ablauf
              </p>
              <p className="mt-2 text-[18px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">{process.label}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {process.hint}
              </p>
              <div className="mt-6">
                <ButtonLink href={`/${ROUTE}/sicherheitscheck`} variant="outline" className="w-full justify-center">
                  Zur Bestandsaufnahme
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Detailbereiche */}
      <Section className="py-16 md:py-24 bg-[oklch(0.968_0.004_260)]">
        <SectionHeading
          eyebrow="Integrative Systeme"
          title="Modular, skalierbar und intelligent vernetzt"
          lead="Moderne Sicherheitstechnik wächst mit Ihren Anforderungen. Wir setzen auf offene Standards und etablierte Hersteller, um eine langfristige Verfügbarkeit und Erweiterbarkeit zu garantieren."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ShieldCheck;
            return (
              <div key={service.id} style={{ display: "grid", gridTemplateRows: "subgrid" }} className="row-span-4 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.02)] transition-all hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.06)] hover:border-[oklch(0.52_0.24_260/0.3)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                  {service.summary}
                </p>
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:text-[oklch(0.46_0.24_260)]"
                >
                  Details ansehen
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            );
          })}
        </div>
      </Section>

      {/* FAQ Sektion */}
      <Section className="py-16 md:py-24">
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Fachliche Klarheit für Ihre Entscheidungsfindung"
          lead="Die Planung einer Sicherheitsanlage wirft technische und konzeptionelle Fragen auf. Hier beantworten wir die wichtigsten Punkte aus unserer Beratungspraxis."
        />

        <div className="mt-12 space-y-6 max-w-3xl mx-auto">
          {[
            { q: "Wie oft muss eine Alarmanlage gewartet werden?", a: "Gemäß DIN VDE 0833 sollte eine Einbruchmeldeanlage mindestens einmal jährlich von einem qualifizierten Fachbetrieb gewartet werden. Dabei werden unter anderem die Batterien geprüft, die Sensorik auf korrekte Funktion getestet und Software-Updates eingespielt." },
            { q: "Ist eine Funk-Alarmanlage genauso sicher wie ein verkabeltes System?", a: "Professionelle Funk-Alarmanlagen (z.B. nach EN 50131 Grad 2) nutzen hochverschlüsselte Zwei-Wege-Kommunikation und wechselnde Frequenzbänder, um Sabotage durch Jamming (Störsender) zu verhindern. Für private und kleine bis mittlere gewerbliche Objekte bieten sie ein sehr hohes Sicherheitsniveau, vergleichbar mit kabelgebundenen Systemen. Im Hochsicherheitsbereich (Grad 3 oder 4) ist jedoch nach wie vor eine Verkabelung vorgeschrieben." },
            { q: "Können Haustiere einen Fehlalarm auslösen?", a: "Nein, nicht zwingend. Wir verwenden spezielle 'tierimmune' Bewegungsmelder, die anhand von Größe, Gewicht und Bewegungsmuster unterscheiden können, ob sich ein Mensch oder ein Haustier (bis zu einem gewissen Gewicht, meist 20-30 kg) im Raum aufhält. Bei großen Hunden oder vielen Katzen müssen jedoch spezielle Planungsrichtlinien beachtet werden, z.B. durch den verstärkten Einsatz von Außenhautüberwachung anstatt Innenraumüberwachung." },
            { q: "Muss ich meine Videoüberwachung anmelden?", a: "Im privaten Bereich nicht, solange die Kameras ausschließlich das eigene Grundstück erfassen. Sobald öffentliche Flächen (Gehwege, Straßen) oder Nachbargrundstücke gefilmt werden, ist dies unzulässig. Im gewerblichen Bereich unterliegt die Videoüberwachung strengen DSGVO-Auflagen, erfordert eine Vorab-Dokumentation, ein berechtigtes Interesse und eine deutliche Beschilderung." },
            { q: "Was passiert bei einem Stromausfall?", a: "Alle von uns installierten professionellen Einbruchmeldeanlagen verfügen über eine integrierte Notstromversorgung (Akkus). Bei einem Stromausfall läuft das System nahtlos weiter, in der Regel für mindestens 12 bis 24 Stunden, abhängig von der Anlagengröße und dem Stromverbrauch der Komponenten. Der Ausfall des Stromnetzes wird zudem umgehend als Störungsmeldung an Ihr Smartphone oder den Wachdienst gesendet." }
          ].map((faq, i) => (
            <details key={i} className="group rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 open:bg-[oklch(0.988_0.002_260)]">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-[oklch(0.16_0.02_260)] text-[16px] marker:content-none">
                {faq.q}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>


      {/* Recht und Verantwortung */}
      <Section id="recht-und-verantwortung" className="py-16">
        <SectionHeading
          eyebrow="Compliance"
          title="Rechtliche Rahmenbedingungen beim Betrieb"
          lead="Wir planen und installieren die Technik so, dass sie den geltenden Datenschutzrichtlinien entspricht. Die letztendliche Verantwortung für den konformen Betrieb liegt jedoch beim Betreiber."
        />

        <Alert
          tone="legal"
          title="Betreiberverantwortung für Video- und Audiosysteme"
          className="mt-8 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-sm"
        >
          <ul className="space-y-3 mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.52_0.24_260)] mt-2 shrink-0"></div>
              <span>Wer eine Anlage mit Video-, Audio- oder Protokollfunktion betreibt, verantwortet deren rechtmäßige Nutzung — also Zweck, Umfang, Speicherdauer, Zugriff und Kennzeichnung.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.52_0.24_260)] mt-2 shrink-0"></div>
              <span>Kameras dürfen öffentliche Flächen (Gehwege, Straßen) und fremde Grundstücke nicht erfassen (BVerfG, Az. 1 BvR 2368/06). Wir planen Aufstellort und Blickfeld entsprechend.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.52_0.24_260)] mt-2 shrink-0"></div>
              <span>Gegensprech- und Alarmfunktionen richten wir ausschließlich für zulässige Einsatzzwecke (z.B. Kommunikation an der Tür, Alarmierung) ein. Verdeckte Audioüberwachung ist ausgeschlossen.</span>
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.52_0.24_260)] mt-2 shrink-0"></div>
              <span>Protokollfunktionen (Zutritts-, Bedienprotokolle) erfassen personenbezogene Daten gem. DSGVO. Zweck, Löschfristen und Zugriffsberechtigungen sind vorab zu definieren (Verfahrensverzeichnis).</span>
            </li>
          </ul>

          <p className="mt-6">
            <Link
              href="/rechtliches/datenschutz"
              className="inline-flex items-center gap-1.5 font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
            >
              Zu den ausführlichen Datenschutzhinweisen
              <ArrowRight size={15} aria-hidden />
            </Link>
          </p>
        </Alert>
      </Section>

    </main>
      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 text-[14px] font-semibold text-[oklch(0.16_0.02_260)] transition-colors hover:border-[oklch(0.52_0.24_260)] hover:text-[oklch(0.52_0.24_260)]"
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
