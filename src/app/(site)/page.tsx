import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
} from 'lucide-react';

import { getGuides, getPageContent, getSettings } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { formatCents } from '@/lib/format';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { SpatialBentoGrid } from '@/components/showcase/spatial-bento-grid';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, localBusinessSchema } from '@/components/seo/json-ld';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('');
  return {
    // Der Titel der Startseite trägt den Markennamen bereits selbst,
    // deshalb greift die Vorlage aus dem Wurzel-Layout hier nicht.
    title: { absolute: page?.seo.title ?? 'SCHLÜSSELMACHER24' },
    description: page?.seo.description,
    alternates: { canonical: '/' },
  };
}



const TRUST_POINTS = [
  {
    title: 'Fachbetrieb mit eigener Werkstatt',
    body: 'Die Arbeiten erfolgen im eigenen Betrieb mit den dafür vorgesehenen Maschinen — nicht unterwegs im Fahrzeug.',
  },
  {
    title: 'Erst prüfen, dann buchen',
    body: 'Wir sagen Ihnen vor der Terminbestätigung, was machbar ist und was es kostet. Keine Überraschung vor Ort.',
  },
  {
    title: 'Nachvollziehbare Abläufe',
    body: 'Jeder Vorgang bekommt eine Nummer. Den Stand können Sie jederzeit selbst abrufen.',
  },
  {
    title: 'Sichere Zahlung',
    body: 'Die Anzahlung wird vollständig auf den Gesamtpreis angerechnet. Beleg und Vorgang gehören zusammen.',
  },
];



export default async function HomePage() {

  const [page, settings, guides] = await Promise.all([
    getPageContent(''),
    getSettings(),
    getGuides(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;

  const carKeySteps = [
    { title: 'Fahrzeug wählen', body: 'Marke, Modell, Baujahr und Schlüsselart.' },
    { title: 'Fotos hochladen', body: 'Schlüssel aus drei Richtungen und den Fahrzeugschein.' },
    { title: 'Preis oder Prüfung', body: 'Fester Preis, Preisrahmen oder Hinweis auf manuelle Prüfung.' },
    { title: 'Anzahlung', body: `Standard ${deposit}, wird voll angerechnet.` },
    { title: 'Termin buchen', body: `Frühester Termin nach etwa ${leadDays} Tagen Vorlauf.` },
  ];

  return (
    <>
      <JsonLd data={localBusinessSchema(settings)} />

      {/* Einstieg */}
      <section className="border-b border-border bg-surface">
        <div className="shell grid gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow">
              <span className="h-px w-6 bg-current" aria-hidden />
              Fachbetrieb für Schlüssel- und Schließtechnik
            </p>

            <h1 className="mt-4 text-[2rem] font-bold leading-[1.1] md:text-5xl">
              {page?.headline ?? 'Autoschlüssel nachmachen und programmieren'}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {page?.subline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/autoschluessel/anfrage" size="lg">
                Fahrzeug auswählen und Termin starten
                <ArrowRight size={18} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/schluessel-nach-code" size="lg" variant="outline">
                Schlüssel nach Code bestellen
              </ButtonLink>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Anzahlung
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-foreground">{deposit}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Vorlauf
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-foreground">
                  ca. {leadDays} Tage
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                  Versand
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-foreground">
                  deutschlandweit
                </dd>
              </div>
            </dl>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schlüsselfräse mit Autoschlüssel in Bearbeitung',
              ratio: '4/3',
              note: 'Echtes Foto aus der eigenen Werkstatt. Kein Stockfoto.',
            }}
          />
        </div>
      </section>

      {/* Schnelleinstiege */}
      <Section tight>
        <SectionHeading
          eyebrow="Schnelleinstieg"
          title="Wobei können wir helfen?"
          lead="Jeder Bereich hat einen klaren Ablauf — vom direkten Kauf bis zur Projektplanung."
        />

        <SpatialBentoGrid />
      </Section>

      {/* Autoschlüssel-Ablauf */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Schwerpunkt Autoschlüssel"
              title="So läuft Ihr Autoschlüssel-Auftrag ab"
              lead="Fünf Schritte, mobil bedienbar. Sie geben nur die Daten an, die für Ihr Fahrzeug gebraucht werden."
            />
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/autoschluessel/anfrage">Ablauf starten</ButtonLink>
              <ButtonLink href="/autoschluessel" variant="outline">
                Alle Leistungen ansehen
              </ButtonLink>
            </div>
          </div>

          <ol className="relative space-y-4 border-l border-border pl-7">
            {carKeySteps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-display text-xs font-bold text-primary"
                >
                  {index + 1}
                </span>
                <p className="text-[15px] font-bold text-foreground">{step.title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>


      {/* Fachlicher Tiefgang: Methodik und Expertise */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Unsere Methodik"
          title="Moderne Schließtechnik trifft auf Handwerkstradition"
          lead="Als zertifizierter Fachbetrieb vereinen wir jahrzehntelange Erfahrung mit modernster CNC- und Lasertechnik, um Ihnen maximale Präzision und Sicherheit zu garantieren."
        />

        <div className="mt-10 grid gap-10 md:grid-cols-2 text-[oklch(0.32_0.02_260)]">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Technologische Exzellenz in der Schlüsselanfertigung</h3>
            <p>
              Die moderne Schlüssel- und Schließtechnik hat sich in den letzten Jahren rasant entwickelt. Wo früher rein mechanische Kopierfräsen zum Einsatz kamen, arbeiten wir heute mit hochpräzisen, computergesteuerten (CNC) Schlüsselfräsmaschinen. Diese erlauben es uns, nicht nur einfache Zylinderschlüssel, sondern auch komplexe Bahnenschlüssel, Wendeschlüssel und Hochsicherheitsschlüssel mit Toleranzen im Hundertstel-Millimeter-Bereich anzufertigen.
            </p>
            <p>
              Besonders bei Autoschlüsseln zeigt sich der technologische Wandel deutlich. Ein moderner Fahrzeugschlüssel ist ein hochkomplexes elektronisches Bauteil, das neben dem mechanischen Bart einen Transponder für die Wegfahrsperre und eine Platine für die Funkfernbedienung enthält. Unsere Werkstatt ist mit modernsten Diagnose- und Programmiergeräten ausgestattet, die es uns ermöglichen, Autoschlüssel für über 90% aller auf dem europäischen Markt befindlichen Fahrzeuge anzulernen – vom Kleinwagen bis zum Premium-SUV.
            </p>
            <p>
              Dabei greifen wir ausschließlich auf Rohlinge in Erstausrüsterqualität zurück. Dies garantiert nicht nur eine einwandfreie Funktion, sondern auch eine Langlebigkeit, die dem Original in nichts nachsteht. Bei der Programmierung halten wir uns streng an die Herstellervorgaben und dokumentieren jeden Schritt sorgfältig.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Architektur sicherer Schließanlagen</h3>
            <p>
              Die Planung und Konzeption von Schließanlagen erfordert ein tiefgreifendes Verständnis für organisatorische Abläufe und Sicherheitsanforderungen. Wir begleiten unsere Kunden von der ersten Bedarfsanalyse über die Erstellung eines detaillierten Schließplans bis hin zur fachgerechten Montage und anschließenden Wartung.
            </p>
            <p>
              Ob es sich um eine überschaubare Zentralschlossanlage für ein Mehrfamilienhaus, eine komplexe General-Hauptschlüsselanlage für ein Firmengebäude oder eine moderne elektronische Zutrittskontrollanlage handelt – wir entwickeln maßgeschneiderte Lösungen. Dabei legen wir besonderen Wert auf die Skalierbarkeit der Systeme. Eine gut geplante Schließanlage muss in der Lage sein, mit Ihrem Unternehmen zu wachsen und sich an veränderte Organisationsstrukturen anzupassen.
            </p>
            <p>
              Wir setzen konsequent auf mechanische und mechatronische Systeme renommierter deutscher und europäischer Hersteller (wie z.B. BKS, DOM, ABUS, KESO). Diese Produkte zeichnen sich durch höchste Manipulationssicherheit, patentierten Kopierschutz und eine garantierte Nachlieferbarkeit von Ersatzschlüsseln und -zylindern aus. Für Bereiche mit stark fluktuierendem Personenverkehr empfehlen wir zunehmend elektronische Systeme, die eine flexible Rechtevergabe und eine schnelle Reaktion bei Schlüsselverlust ermöglichen.
            </p>
          </div>
        </div>
      </Section>

      {/* Fachlicher FAQ */}
      <Section>
        <SectionHeading
          eyebrow="Experten-FAQ"
          title="Häufige Fragen zur Schließtechnik"
          lead="Fundierte Antworten auf technische und organisatorische Fragen rund um Schlüssel und Schließzylinder."
        />

        <div className="mt-10 space-y-8">
          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie funktioniert das Klonen eines Transponders für einen Autoschlüssel?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Beim Klonen eines Transponders lesen wir die kryptografischen Daten des Originalschlüssels über eine spezielle Antenne aus. Bei älteren Fahrzeugen (Festcode) ist dies ein direkter Kopiervorgang. Bei modernen Crypto-Transpondern (z.B. Megamos Crypto, Texas Crypto) müssen wir zunächst die Verschlüsselung durch ein Sniffing-Verfahren am Fahrzeug oder durch eine Online-Berechnung am Server decodieren. Anschließend wird der ermittelte Code auf einen blanko Transponder (Emulator) geschrieben. Das Steuergerät des Fahrzeugs kann den geklonten Schlüssel nicht vom Original unterscheiden, weshalb kein zusätzliches Anlernen über die OBD-Schnittstelle notwendig ist.
            </p>
          </div>

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Was ist der Unterschied zwischen einem Zylinderschloss mit Not- und Gefahrenfunktion und einem Standardzylinder?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Ein Profilzylinder mit Not- und Gefahrenfunktion (N&G), auch Prioritätsfunktion genannt, verfügt über eine spezielle Kupplung im Inneren. Diese federgelagerte Mechanik ermöglicht es, die Schließnase auch dann zu drehen, wenn auf der gegenüberliegenden Seite bereits ein Schlüssel im Zylinder steckt. Bei einem Standardzylinder blockiert der innere Schlüssel die Kupplung, sodass von außen nicht aufgeschlossen werden kann. Die N&G-Funktion ist besonders bei Wohnungs- und Haustüren dringend zu empfehlen, um ein ungewolltes Aussperren zu verhindern und in Notfällen (z.B. medizinischen Notlagen) jederzeit Zugang gewähren zu können.
            </p>
          </div>

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Warum lassen sich manche Schlüssel nur gegen Vorlage einer Sicherungskarte nachmachen?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Sicherungskarten sind ein integraler Bestandteil von Hochsicherheits- und Schließanlagensystemen. Sie dienen als Legitimation gegenüber dem Schlüsseldienst oder Hersteller. Die entsprechenden Schlüsselprofile sind rechtlich (durch Patente oder Markenrechte) und teilweise auch technisch (durch bewegliche Elemente im Schlüssel) vor unberechtigten Kopien geschützt. Die Rohlinge für diese geschützten Profile sind auf dem freien Markt nicht erhältlich. Wenn wir einen solchen Schlüssel bestellen oder anfertigen, müssen wir die Sicherungskarte verifizieren und den Vorgang dokumentieren. Dies schützt Sie als Anlagenbetreiber davor, dass z.B. ehemalige Mitarbeiter unbemerkt Nachschlüssel anfertigen lassen.
            </p>
          </div>

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Sicherheitsmerkmale sollte ein moderner Profilzylinder aufweisen?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Ein hochwertiger Profilzylinder (ab SKG** oder VdS Klasse B) sollte mindestens über einen Bohrschutz und einen Ziehschutz verfügen. Der Bohrschutz wird durch gehärtete Stahlstifte im Gehäuse und im Kern realisiert, die ein Aufbohren des Zylinders deutlich erschweren. Der Ziehschutz (häufig in Kombination mit einem passenden Schutzbeschlag) verhindert das gewaltsame Herausziehen des Zylinderkerns. Zusätzliche Sicherheitsmerkmale sind Anti-Pick-Stifte (erschweren das manipulierte Öffnen mit Spezialwerkzeugen) und ein Schlagschlüssel-Schutz. Für maximale Sicherheit empfehlen wir Zylinder mit interaktiven Elementen im Schlüssel (z.B. schwimmend gelagerte Kugeln), die einen 3D-Kopierschutz bieten.
            </p>
          </div>

          <div className="pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wann ist der Wechsel von einer mechanischen zu einer elektronischen Schließanlage sinnvoll?</h4>
            <p className="mt-3 text-[oklch(0.32_0.02_260)] leading-relaxed">
              Der Wechsel (oder die Ergänzung) zu einer elektronischen Zutrittskontrolle ist immer dann betriebswirtschaftlich und sicherheitstechnisch sinnvoll, wenn in Ihrem Objekt eine hohe Fluktuation von Personen herrscht (z.B. durch wechselnde Mitarbeiter, Dienstleister oder Mieter). Bei einer rein mechanischen Anlage erfordert ein verlorener Generalhauptschlüssel im schlimmsten Fall den kostspieligen Austausch aller Zylinder. Bei einem elektronischen System wird das verlorene Transpondermedium (Karte oder Chip) einfach im System gesperrt – der Zylinder bleibt erhalten. Zudem bieten elektronische Systeme die Möglichkeit, zeitlich begrenzte Zutrittsrechte zu vergeben (z.B. für Reinigungskräfte nur Dienstagvormittags) und im Verdachtsfall Schließereignisse lückenlos zu protokollieren.
            </p>
          </div>
        </div>
      </Section>


      {/* Vertrauen */}
      <Section>
        <SectionHeading
          eyebrow="Warum wir"
          title="Sachlich, nachvollziehbar, ohne Überraschungen"
          lead="Wir arbeiten wie ein Fachbetrieb, nicht wie ein Vermittler."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {TRUST_POINTS.map((point) => (
            <li key={point.title}>
              <Card className="h-full">
                <CardBody>
                  <p className="text-[15px] font-bold text-foreground">{point.title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">{point.body}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Shop-Teaser */}
      <Section tone="muted" tight>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/schluessel-nach-code"
            className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors hover:border-primary"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Direkt kaufen
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Schlüssel nach Code</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                Code eingeben, Stückzahl wählen, bestellen. Ihr Originalschlüssel bleibt bei Ihnen.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
              Codelinien ansehen
              <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/gleichschliessende-zylinder/konfigurator"
            className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors hover:border-primary"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Direkt kaufen
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">Gleichschließende Zylinder</p>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                Mehrere Türen mit einem Schlüssel. Bauform, Maße und Schlüsselanzahl selbst
                zusammenstellen.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary">
              Zum Konfigurator
              <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </Section>

      {/* Projektbereiche */}
      <Section>
        <SectionHeading
          eyebrow="Projekte"
          title="Größere Vorhaben planen wir strukturiert"
          lead="Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik erfassen wir über geführte Konfiguratoren. Am Ende steht eine Zusammenfassung, aus der ein belastbares Angebot wird."
        />

        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {NAV_AREAS.filter((a) =>
            ['schliessanlagen', 'elektronische-zutrittsloesungen', 'sicherheitstechnik'].includes(a.key),
          ).map((area) => (
            <li key={area.key}>
              <Card className="group relative flex h-full flex-col overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]">
                <CardBody className="flex flex-1 flex-col">
                  <p className="text-[15px] font-bold text-foreground">{area.label}</p>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                    {area.summary}
                  </p>
                  <Link
                    href={area.highlight?.href ?? area.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                  >
                    {area.highlight?.label ?? `${area.label} entdecken`}
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Ratgeber */}
      <Section tone="muted" tight>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Ratgeber"
            title="Antworten auf die häufigsten Fragen"
            className="max-w-xl"
          />
          <Link
            href="/ratgeber"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
          >
            Zum Ratgeber wechseln
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <li key={guide.id}>
              <Link
                href={`/ratgeber/${guide.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                  {guide.title}
                </span>
                <span className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                  {guide.excerpt}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Beitrag lesen
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
