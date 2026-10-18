import { notFound } from 'next/navigation';
import { getPageContent, getServicePages } from '@/lib/data';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { ShieldCheck, Video, BellRing, Lock, Key, Eye, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { SecurityScoreCalculator } from '@/components/calculator/security-score-calculator';
import type { Metadata } from 'next';

const ROUTE = 'sicherheitstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  if (!page) return {};

  return {
    title: page.seo.title,
    description: page.seo.description,
  };
}

const SERVICE_ICONS: Record<string, React.ElementType> = {
  alarmanlagen: BellRing,
  videoueberwachung: Video,
  'smarte-schloesser': Lock,
  'schliessanlagen': Key,
  'zutrittskontrolle': Eye,
  'tresore': FileText,
};

const PRINCIPLE = [
  {
    term: 'Mechanik hält auf',
    body: 'Der Grundschutz jeder Immobilie ist physischer Natur. Hochwertige Schließzylinder, Schutzbeschläge mit Zylinderabdeckung und massive Zusatzschlösser zwingen Täter dazu, schweres Werkzeug und mehr Zeit einzusetzen. Genau diese Zeit ist der entscheidende Faktor beim Einbruchschutz.',
    href: '/tuer-und-schliesstechnik',
    linkLabel: 'Zur Mechanik',
  },
  {
    term: 'Meldetechnik erkennt',
    body: 'Elektronische Systeme wie Alarmanlagen und Videokameras bilden die zweite Verteidigungslinie. Sie erfassen Bewegungen, Glasbruch oder das Öffnen von Türen. Ihre Präsenz allein wirkt oft schon präventiv, doch ihr wahrer Wert liegt in der sofortigen Registrierung eines Vorfalls.',
    href: '/sicherheitstechnik/alarmanlagen',
    linkLabel: 'Zur Meldetechnik',
  },
  {
    term: 'Alarmierung informiert',
    body: 'Erkannte Vorfälle müssen kommuniziert werden. Lokale Sirenen schrecken ab und alarmieren Nachbarn. Stille Alarme, aufgeschaltet auf eine Notruf- und Serviceleitstelle (NSL), garantieren eine professionelle und vor allem sofortige Intervention durch Sicherheitskräfte oder die Polizei.',
    href: '/service-und-termin',
    linkLabel: 'Zur Beratung',
  },
];

export default async function SicherheitstechnikPage() {
  const page = await getPageContent(ROUTE);
  const services = await getServicePages(ROUTE);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: ROUTE,
          name: page?.headline ?? 'Sicherheitstechnik',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }],
        })}
      />

      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Ganzheitliche Sicherheitstechnik für Ihr Objekt'}
        lead={page?.subline ?? 'Moderne Sicherheitsarchitektur erfordert das nahtlose Ineinandergreifen von mechanischem Grundschutz, elektronischer Überwachung und intelligenter Alarmierung. Entdecken Sie unsere maßgeschneiderten Lösungen.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Sicherheitstechnik' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/sicherheitscheck`} size="lg">
            Sicherheitscheck starten
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      <Section tight className="py-16 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
          <div className="space-y-8 text-[oklch(0.32_0.02_260)] leading-relaxed">
            <h2 className="text-3xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">
              Architektur eines sicheren Objekts
            </h2>
            <p>
              Sicherheit ist kein einzelnes Produkt, sondern ein durchdachtes Konzept. Ein wirksamer Schutzmechanismus basiert auf dem Prinzip der konzentrischen Sicherheitsringe, bei dem verschiedene Ebenen von Barrieren und Überwachungssystemen zusammenwirken, um einen unbefugten Zugriff zu erkennen, zu verzögern und letztendlich zu verhindern.
            </p>
            <p>
              Die Basis bildet stets der <strong>mechanische Grundschutz</strong>. Nur wenn Türen, Fenster und andere Zugänge physisch hinreichend Widerstand leisten, gewinnt die Elektronik die notwendige Zeit, um effektiv zu reagieren. Ein Einbrecher bricht in der Regel ab, wenn er nach drei bis fünf Minuten keinen Erfolg hat. Hier setzen unsere VdS-zertifizierten Schließzylinder und Sicherheitsbeschläge an.
            </p>
            <p>
              Die zweite Säule ist die <strong>Meldetechnik</strong>. Moderne Gefahrenmeldeanlagen (GMA) arbeiten heute hochgradig vernetzt. Sie nutzen Dual-Melder-Technologie (Passiv-Infrarot kombiniert mit Mikrowelle), um Fehlalarme nahezu auszuschließen, und überwachen gleichzeitig die Außenhaut des Gebäudes mittels Magnetkontakten und seismischen Meldern. So wird ein Einbruchsversuch detektiert, noch bevor der Täter im Gebäude ist.
            </p>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              Integration und Smarte Steuerung
            </h3>
            <p>
              Heutige Sicherheitstechnik muss nicht kompliziert sein. Durch die Integration von Alarmanlagen, Videoüberwachung und elektronischen Zutrittssystemen auf einer zentralen Plattform behalten Sie stets die Kontrolle. Ob per App von unterwegs oder über ein lokales Touchpanel – Sie sehen den Status aller Systeme auf einen Blick.
            </p>
            <p>
              Wir setzen dabei auf hybride Systeme, die sowohl kabelgebundene (BUS-Technologie) als auch verschlüsselte Funk-Komponenten nutzen. Dies ermöglicht eine flexible Nachrüstung ohne aufwendige Stemmarbeiten, ohne dabei Kompromisse bei der Sabotagesicherheit einzugehen.
            </p>
          </div>

          <div className="sticky top-24">
            <SecurityScoreCalculator />
          </div>
        </div>
      </Section>

      <Section tone="muted" className="py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Methodik"
          title="Mechanik hält auf, Meldetechnik erkennt, Alarmierung informiert"
          lead="Unsere dreistufige Sicherheitsphilosophie kombiniert physische Barrieren mit intelligenter Sensorik."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLE.map((item) => (
            <div key={item.term} className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:border-[oklch(0.52_0.24_260)] grid grid-rows-[auto_1fr_auto]">
              <dt className="text-xl font-bold text-[oklch(0.16_0.02_260)]">{item.term}</dt>
              <dd className="mt-4 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                {item.body}
              </dd>
              <div className="mt-8">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
                >
                  {item.linkLabel}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Bereiche */}
      <Section className="py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Bereiche"
          title="Sieben Bereiche, die zusammen gedacht werden"
          lead="Einzeln betrachtet bleibt jeder Bereich Stückwerk. Welche Kombination zu Ihrem Objekt passt, klären wir in der Bestandsaufnahme."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: { id: string; slug: string; title: string; summary: string }) => {
            const Icon = SERVICE_ICONS[service.slug] ?? ShieldCheck;
            return (
              <li key={service.id}>
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-[oklch(0.52_0.24_260)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
                    <Icon size={19} aria-hidden />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-foreground group-hover:text-[oklch(0.52_0.24_260)]">
                    {service.title}
                  </span>
                  <span className="mt-1.5 block flex-1 text-[13px] leading-relaxed text-[oklch(0.32_0.02_260)]">
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

      <Section tone="muted" className="py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Matrix"
          title="Ihre Matrix der Objektsicherheit"
          lead="Ein umfassendes Konzept erfordert die Berücksichtigung aller Zugänge und potenziellen Schwachstellen. Wir bieten maßgeschneiderte Lösungen für jeden Bereich."
        />

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[oklch(0.968_0.004_260)] text-[oklch(0.16_0.02_260)]">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Schutzbereich</th>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Primäres Risiko</th>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Mechanische Lösung</th>
                <th className="px-6 py-4 font-semibold border-b border-[oklch(0.89_0.008_260/0.55)]">Elektronische Ergänzung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] text-[oklch(0.32_0.02_260)]">
              <tr className="transition-colors hover:bg-[oklch(0.968_0.004_260)]">
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Haupteingang</td>
                <td className="px-6 py-4">Aufhebeln, Zylinder-Manipulation</td>
                <td className="px-6 py-4">Schutzbeschlag mit Zylinderabdeckung, Schließblech mit Mauerankern</td>
                <td className="px-6 py-4">Elektronischer Zylinder (Zutrittskontrolle), Öffnungsmelder</td>
              </tr>
              <tr className="transition-colors hover:bg-[oklch(0.968_0.004_260)]">
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Nebeneingang / Keller</td>
                <td className="px-6 py-4">Unbemerkter Zugang, geringer Widerstand</td>
                <td className="px-6 py-4">Panzerriegel, massives Stangenschloss</td>
                <td className="px-6 py-4">Riegelkontakt, Videoüberwachung im Außenbereich</td>
              </tr>
              <tr className="transition-colors hover:bg-[oklch(0.968_0.004_260)]">
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Fenster (EG)</td>
                <td className="px-6 py-4">Einschlagen, schnelles Aufhebeln</td>
                <td className="px-6 py-4">Abschließbare Fenstergriffe, Pilzkopfverriegelung (RC2)</td>
                <td className="px-6 py-4">Akustische Glasbruchmelder, Erschütterungssensoren</td>
              </tr>
              <tr className="transition-colors hover:bg-[oklch(0.968_0.004_260)]">
                <td className="px-6 py-4 font-medium text-[oklch(0.16_0.02_260)]">Innenräume</td>
                <td className="px-6 py-4">Diebstahl von Wertsachen bei Durchgriff</td>
                <td className="px-6 py-4">Zertifizierter Wertschutzschrank (Tresor), Verankerung</td>
                <td className="px-6 py-4">Passiv-Infrarot-Bewegungsmelder (Dual-Tech)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Fachwissen zur Sicherheitstechnik"
            lead="Die wichtigsten Antworten rund um Planung, Installation und Betrieb von Sicherheitsanlagen."
          />

          <div className="mt-12 space-y-6">
            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Förderungen gibt es für den Einbau von Sicherheitstechnik?</h4>
              <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">Die KfW (Kreditanstalt für Wiederaufbau) fördert einbruchhemmende Maßnahmen in Bestandsgebäuden. Das Programm 455-E gewährt Zuschüsse für den Einbau von Alarmanlagen, einbruchhemmenden Haus- und Wohnungseingangstüren sowie Nachrüstsystemen für Fenster. Wichtig: Der Antrag muss vor Beginn der Maßnahmen gestellt werden und die Ausführung durch einen Fachbetrieb erfolgen.</p>
            </div>

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Was bedeutet die Zertifizierung nach DIN EN 50131?</h4>
              <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">Die DIN EN 50131 ist die europäische Norm für Einbruch- und Überfallmeldeanlagen. Sie teilt Anlagen in vier Sicherheitsgrade (Grades) ein. Für private Wohnobjekte wird in der Regel Grade 2 empfohlen, der Schutz vor erfahrenen Einbrechern mit speziellen Werkzeugen bietet. Für gewerbliche Objekte mit höherem Risiko sind Grade 3 oder 4 erforderlich. Die Zertifizierung garantiert, dass alle Komponenten (Melder, Zentrale, Signalgeber) zuverlässig zusammenarbeiten und gegen Sabotage geschützt sind.</p>
            </div>

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Kabelgebundene Anlage oder Funk-Alarmanlage – was ist besser?</h4>
              <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">Bei Neubauten oder Kernsanierungen empfehlen wir klar verkabelte Systeme (BUS-Technik), da sie weniger Wartung (kein Batteriewechsel) erfordern und extrem störsicher sind. In Bestandsgebäuden sind professionelle Funk-Alarmanlagen oft die wirtschaftlichere Wahl. Moderne Funk-Systeme arbeiten im reservierten Frequenzband (868 MHz), nutzen rollierende Verschlüsselung (Rolling Code) und erkennen Störversuche (Jamming) sofort. Beide Varianten bieten bei fachgerechter Installation ein sehr hohes Sicherheitsniveau.</p>
            </div>

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie funktioniert eine Aufschaltung auf eine Notrufleitstelle (NSL)?</h4>
              <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">Bei einem Alarm überträgt das System über gesicherte Wege (redundant via IP und Mobilfunk/LTE) ein Signal an eine besetzte Leitstelle. Dort wird der Alarm verifiziert (z.B. durch Rückruf oder Videoaufschaltung) und ein vorab definierter Interventionsplan abgearbeitet. Dies kann die Benachrichtigung des Eigentümers, die Entsendung eines Wachdienstes oder die direkte Alarmierung der Polizei umfassen. So ist sichergestellt, dass 24/7 angemessen reagiert wird, auch wenn Sie selbst im Urlaub oder nicht erreichbar sind.</p>
            </div>

            <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Darf ich mein Grundstück mit Videokameras überwachen?</h4>
              <p className="mt-3 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">Ja, aber mit strengen Auflagen. Die Kameras dürfen ausschließlich das eigene Privatgrundstück erfassen. Öffentliche Wege, Straßen oder das Nachbargrundstück dürfen nicht im Bildbereich liegen. Moderne IP-Kameras bieten hierfür Privacy-Masking-Funktionen, mit denen Bereiche dauerhaft und unveränderlich geschwärzt werden. Zudem müssen Besucher durch gut sichtbare Schilder auf die Videoüberwachung hingewiesen werden, bevor sie den Erfassungsbereich betreten.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="recht-und-verantwortung" tone="muted" className="py-16 md:py-24 lg:py-32">
        <SectionHeading
          eyebrow="Recht und Verantwortung"
          title="Was Sie beim Betrieb von Video, Audio und Protokollen beachten müssen"
          lead="Diese Punkte klären wir vor der Planung, damit die Technik so aufgebaut wird, wie Sie sie später auch betreiben dürfen."
        />

        <Alert
          tone="legal"
          title="Verantwortlich für die Nutzung ist die Betreiberin oder der Betreiber der Anlage"
          className="mt-8 border-[oklch(0.89_0.008_260/0.55)]"
        >
          <ul className="space-y-3 text-[14px] text-[oklch(0.32_0.02_260)]">
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

          <p className="mt-4">
            <Link
              href="/rechtliches/datenschutz"
              className="font-semibold text-[oklch(0.52_0.24_260)] hover:underline"
            >
              Hinweise zum Datenschutz
            </Link>
          </p>
        </Alert>
      </Section>

      {page && page.seo.internalLinks.length > 0 && (
        <Section tight className="py-16 md:py-24 lg:py-32">
          <SectionHeading eyebrow="Weiterlesen" title="Passende Seiten" />
          <ul className="mt-6 flex flex-wrap gap-3">
            {page.seo.internalLinks.map((link: { href: string; label: string }) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] px-5 text-[14px] font-semibold text-[oklch(0.16_0.02_260)] transition-colors hover:border-[oklch(0.52_0.24_260)] hover:text-[oklch(0.52_0.24_260)]"
                >
                  {link.label}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
