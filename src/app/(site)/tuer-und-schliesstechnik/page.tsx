import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getRubrik, getServicePages } from '@/lib/data';
import { getNachweise } from '@/lib/data/nachweise';
import { getRichtwerte } from '@/lib/data/richtwerte';
import { PROCESS_LABELS } from '@/lib/navigation';
import { SpaetVorladen } from '@/lib/spaet-vorladen';
import { cn } from '@/lib/cn';
import type { AreaKey } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { TUER_SCHUTZ_AUSSCHNITT } from '@/components/visual/generators/tuer-schutz';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';
import { TuerAbsicherungRechner } from '@/components/calculator/tuer-absicherung-rechner';
import { NachweiseListe } from '@/components/vertrauen/nachweise-liste';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconEinsteckschloss } from '@/components/visual/icons/einsteckschloss';
import { IconMehrfachverriegelung } from '@/components/visual/icons/mehrfachverriegelung';
import { IconMontage } from '@/components/visual/icons/montage';
import { IconPanikFluchttuer } from '@/components/visual/icons/panik-fluchttuer';
import { IconProfilzylinder } from '@/components/visual/icons/profilzylinder';
import { IconReparaturAustausch } from '@/components/visual/icons/reparatur-austausch';
import { IconSchutzbeschlag } from '@/components/visual/icons/schutzbeschlag';
import { IconTechnischeBeratung } from '@/components/visual/icons/technische-beratung';
import { IconTuerschliesser } from '@/components/visual/icons/tuerschliesser';
import { IconTuerzusatzschloss } from '@/components/visual/icons/tuerzusatzschloss';

const ROUTE = 'tuer-und-schliesstechnik';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Tür- und Schließtechnik: Sicherheit vom Zylinder bis zum Mehrfachschloss',
    description:
      page?.seo.description
      ?? 'Ganzheitliche Tür- und Schließtechnik. Beratung, Montage und Reparatur von Zylindern, Einsteckschlössern, Mehrfachverriegelungen und Beschlägen. Erhöhen Sie Ihre Sicherheit durch fachgerechte Türtechnik.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Fach-Icon je Leistung — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  'profilzylinder-und-spezialzylinder': IconProfilzylinder,
  einsteckschloesser: IconEinsteckschloss,
  mehrfachverriegelungen: IconMehrfachverriegelung,
  schutzbeschlaege: IconSchutzbeschlag,
  tuerzusatzschloesser: IconTuerzusatzschloss,
  tuerschliesser: IconTuerschliesser,
  'panik-und-fluchttuertechnik': IconPanikFluchttuer,
  'reparatur-und-austausch': IconReparaturAustausch,
  'technische-beratung': IconTechnischeBeratung,
  'montage-und-anpassung': IconMontage,
};

/** Angrenzende Bereiche — die Hauptnavigation bleibt davon unberührt. `area` färbt die Zeile in der Bereichsfarbe. */
const RELATED_AREAS: { area: AreaKey; href: string; label: string; body: string }[] = [
  {
    area: 'gleichschliessende-zylinder',
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    body: 'Mehrere Türen schließen mit demselben Schlüssel. Dafür braucht es keine ganze Schließanlage. Das passt etwa für Einfamilienhäuser und kleine Betriebe.',
  },
  {
    area: 'schliessanlagen',
    href: '/schliessanlagen',
    label: 'Schließanlagen',
    body: 'Wenn verschiedene Personen unterschiedlich viele Türen öffnen sollen, wird daraus eine Schließanlage. Das ist bei größeren Gebäuden üblich.',
  },
  {
    area: 'elektronische-zutrittsloesungen',
    href: '/elektronische-zutrittsloesungen',
    label: 'Elektronische Zutrittslösungen',
    body: 'Karte, Transponder, PIN oder App statt Schlüssel. Das geht auch zusammen mit vorhandener Mechanik.',
  },
  {
    area: 'sicherheitstechnik',
    href: '/sicherheitstechnik',
    label: 'Sicherheitstechnik',
    body: 'Alarmanlagen und Kameras melden, was an der Tür passiert. Sie ergänzen den mechanischen Schutz.',
  },
];

/** Marke im Fließtext: die Nummer des Bauteils in der Kopfzeichnung (`tuer-schutz`). */
function Marke({ nummer }: { nummer: number }) {
  return (
    <span
      aria-hidden
      className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-area-strong align-middle font-mono text-caption font-semibold tabular-nums text-surface"
    >
      {nummer}
    </span>
  );
}

const EXPERT_FAQ = [
  {
    question: 'Wann reicht ein neuer Zylinder und wann muss mehr an der Tür erneuert werden?',
    answer:
      'Nach einem Schlüsselverlust oder einem Mieterwechsel reicht oft ein neuer Zylinder. Dann haben nur Sie wieder alle Schlüssel. Voraussetzung ist, dass Schloss und Beschlag in Ordnung sind und ausreichend schützen. Ist die Tür alt, hakt das Schloss oder fehlt dem Beschlag der Ziehschutz, sehen wir uns die ganze Tür an. Das gilt auch, wenn Sie den Einbruchschutz deutlich verbessern wollen. Oft hilft dann eine Mehrfachverriegelung oder ein Querriegelschloss zusammen mit einem Schutzbeschlag.',
  },
  {
    question: 'Was ist der Unterschied zwischen einem Einsteckschloss und einer Mehrfachverriegelung?',
    answer:
      'Ein Einsteckschloss verriegelt die Tür an einem Punkt, in Höhe des Schlosses. Eine Mehrfachverriegelung, auch Stangenschloss genannt, verriegelt zusätzlich an weiteren Punkten, meist oben und unten. Dafür sorgen Schwenkriegel, Bolzen oder Pilzzapfen. So verteilt sich die Kraft bei einem Einbruchsversuch auf den ganzen Rahmen. Die Tür lässt sich dann deutlich schwerer aufhebeln.',
  },
  {
    question: 'Welche Anforderungen gibt es an Schlösser für Flucht- und Rettungswege?',
    answer:
      'Eine Tür im Fluchtweg muss sich von innen jederzeit und ohne Schlüssel öffnen lassen. Das gilt auch, wenn sie von außen verriegelt ist. Für Notausgänge gilt DIN EN 179, für Paniktüren DIN EN 1125. Dafür gibt es Panikschlösser mit passenden Beschlägen, etwa Drücker oder Panikstangen. Änderungen an diesen Türen sind nur mit zugelassenen Teilen und fachgerecht erlaubt. Sonst kann die Zulassung der Tür verloren gehen.',
  },
  {
    question: 'Lässt sich jede Haustür mit einem elektronischen Schloss nachrüsten?',
    answer:
      'Oft ja. Ein elektronischer Zylinder ersetzt den mechanischen Profilzylinder genau. Er läuft mit Batterie, Kabel sind nicht nötig. Ein Motorschloss schließt die Tür von selbst auf und zu. Dafür braucht es Strom im Türblatt. Fehlt dieser, kann ein Antrieb auf den vorhandenen Zylinder gesetzt werden. Der Zylinder braucht dann eine Not- und Gefahrenfunktion. Wir prüfen Ihre Tür vor Ort und empfehlen eine passende Lösung.',
  },
  {
    question: 'Wie pflege ich Zylinder und Türschlösser richtig?',
    answer:
      'Geben Sie kein normales Öl und kein harzendes Schmiermittel in den Zylinder. Beides kann die feine Mechanik verkleben. Nehmen Sie ein Pflegespray für Schließzylinder, das nicht fettet, etwa auf Teflon- oder Graphitbasis. Bei Einsteckschlössern und Mehrfachverriegelungen dürfen Falle und Riegel sparsam etwas Schmierfett bekommen. Prüfen Sie ab und zu, ob das Schließblech fest sitzt. Dann fällt die Tür leicht ins Schloss, und der Schlüssel muss nicht gegen Druck arbeiten.',
  },
];

export default async function TuerUndSchliesstechnikPage() {
  const [page, services, richtwerte, nachweise, rubrik] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
    getRichtwerte(),
    getNachweise(),
    getRubrik('tuer-und-schliesstechnik'),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>

      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Tür- und Schließtechnik',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Tür- und Schließtechnik' }],
          faq: EXPERT_FAQ,
        })}
      />

      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Tür- und Schließtechnik'}
        lead={page?.subline ?? 'Zylinder, Schlösser, Beschläge und Türtechnik.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Tür- und Schließtechnik' }]}
        bereich={ROUTE}
        /* Blickfang im Kopf (E4-L-23): die nummerierte Tür, auf Papier ohne Rahmen. */
        visual={
          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Detailaufnahme einer massiven Mehrfachverriegelung im Querschnitt, Schwenkriegel greift in Schließblech',
              ratio: '4/3',
              note: 'Hochauflösendes Detailfoto zur Verdeutlichung der mechanischen Präzision.',
              visual: { generator: 'tuer-schutz', params: {} },
            }}
            ausschnitt={TUER_SCHUTZ_AUSSCHNITT}
            frei
          />
        }
        actions={
          <>
            <ButtonLink href={`/service-und-termin/anfrage?thema=${ROUTE}`} prefetch={false} size="lg" pfeil>
              Anfrage starten
            </ButtonLink>
            {/* Ziel des Kopfknopfs erst nach der Fräsbahn vorladen (D-044) */}
            <SpaetVorladen ziele={[`/service-und-termin/anfrage?thema=${ROUTE}`]} />
          </>
        }
      />

      {/* Tiefgreifende Fachliche Einführung. Mobil in dieser Reihenfolge: Überschrift 01, Rechner, Text, Liste, Schriftfeld. */}
      <Section tight>
        {/* Ab lg: Überschrift und Text links, der hohe Rechner rechts über beide Zeilen – ohne Leerfläche links. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:grid-rows-kopf lg:items-start lg:gap-x-gutter lg:gap-y-8">
          <SectionHeading
            nummer="01"
            eyebrow="Grundlagen"
            title="Eine Tür ist so sicher wie ihr schwächstes Teil"
            lead="Zylinder, Schloss, Beschlag und Schließblech arbeiten zusammen. Deshalb sehen wir uns die ganze Tür an und nicht nur ein Teil."
            className="lg:col-span-7 lg:row-start-1"
          />

          {/* Nicht mitlaufend: Der Rechner ist höher als das Fenster, Ergebnis und Anfrage lägen sonst außer Reichweite. Mobil steht er direkt nach der Überschrift; der Anker führt vom Schriftfeld hierher. */}
          <div id="orientierung" className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <TuerAbsicherungRechner
              werte={richtwerte.tuerAbsicherung}
              anfrageHref={`/service-und-termin/anfrage?thema=${ROUTE}`}
            />
          </div>

          <div className="space-y-8 lg:col-span-7 lg:row-start-2">
            <div className="prose-sm24">
              <p>
                Ein guter Zylinder mit Bohrschutz hilft wenig, wenn das Schloss beim Hebeln nachgibt. Dasselbe gilt, wenn sich der Beschlag von außen abschrauben lässt. Wir sehen uns an, wo an Ihrer Tür Kraft angreifen kann. Danach richten wir <strong>Zylinder, Schloss und Beschlag</strong> aufeinander aus.
              </p>

              <h3 className="mt-8 mb-4 text-title font-bold text-foreground tracking-tight">Vier Teile, die zusammenarbeiten</h3>
              <p>
                Der <strong>Profilzylinder</strong><Marke nummer={3} /> erkennt den richtigen Schlüssel.
                Das <strong>Einsteckschloss</strong> macht aus der Drehung des Schlüssels das Ver- und Entriegeln.
                Der <strong>Schutzbeschlag</strong><Marke nummer={2} /> schützt den Zylinder vor Ziehen und Abbrechen.
                Das <strong>Schließblech</strong><Marke nummer={4} /> im Rahmen nimmt den Riegel auf und leitet die Kraft in die Wand.
              </p>
            </div>

            {/* Haarlinienliste: die drei Schutzpunkte als Stückliste */}
            <ul className="grid border-t border-border">
              {[
                { title: 'Schloss und Schließblech', desc: 'Das Schloss muss beim Hebeln halten. Das Schließblech muss fest im Rahmen sitzen.' },
                { title: 'Ziehschutz', desc: 'Sicherheitsrosetten und Schutzbeschläge mit Zylinderabdeckung erschweren es, den Zylinderkern mit Gewalt herauszuziehen.' },
                { title: 'Mehrfachverriegelung', desc: 'Die Tür schließt an mehreren Punkten über ihre ganze Höhe. Das macht das Aufhebeln deutlich schwerer.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 border-b border-border py-6">
                  <GlyphHakenKreis size={22} className="mt-0.5 shrink-0 text-area-strong" />
                  <div className="min-w-0">
                    <strong className="block text-title-sm font-semibold text-foreground">{item.title}</strong>
                    <span className="mt-1 block max-w-measure text-small text-foreground-muted">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Schriftfeld (Variante A): eigene Zeile unter Text und Rechner; ab lg Einordnung links, Ablauf rechts. */}
          <div className="grid border-y border-border lg:col-span-12 lg:row-start-3 lg:grid-cols-12 lg:gap-x-gutter">
            <div className="py-6 lg:col-span-7">
              <div className="prose-sm24">
                <h3 className="mb-4 text-title font-bold text-foreground tracking-tight">Wenn Elektronik dazukommt</h3>
                <p>
                  An vielen Türen kommt heute Elektronik dazu: elektronische Zylinder, Motorschlösser oder eine Zutrittskontrolle. Dann muss beides zusammenpassen. Ein Motorschloss etwa muss im Brandfall den Weg nach draußen freigeben. Verriegelt soll es trotzdem gut gegen Einbruch schützen.
                </p>
              </div>
            </div>

            {/* Schriftfeld: der Ablauf in diesem Bereich wie eine Zeile der Bemaßung; das Ziel führt zum Rechner. */}
            <dl className="border-t border-border py-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-gutter">
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                So läuft Ihr Auftrag ab
              </dt>
              <dd className="mt-1">
                <Link
                  href="#orientierung"
                  className="group inline-flex min-h-touch items-center gap-2 text-title-sm font-semibold text-foreground transition-colors duration-quick ease-standard hover:text-primary"
                >
                  {process.label}
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard group-hover:text-primary group-focus-visible:text-primary zeiger:group-hover:translate-x-1"
                  />
                </Link>
              </dd>
              <dd className="mt-2 max-w-measure text-small text-foreground-muted">
                {process.hint} Bevor wir Teile tauschen, prüfen wir Ihre Tür und schlagen vor, was sinnvoll ist.
              </dd>
              {/* Schritte aus den Rubrikdaten (G-10, G-11) */}
              {rubrik && (
                <dd className="mt-6">
                  <RubrikAblauf rubrik={rubrik} />
                </dd>
              )}
            </dl>
          </div>
        </div>
      </Section>

      {/* Leistungsportfolio: Haarlinien wie der Schnelleinstieg der Startseite */}
      <Section tone="muted">
        <SectionHeading
          nummer="02"
          eyebrow="Leistungen"
          title="Unsere Leistungen an der Tür"
          lead="Hier finden Sie unsere Leistungen an der Tür, vom Zylinder bis zum Türschließer. Jede Leistung hat eine eigene Seite."
        />

        {/* Zweispaltige Haarlinienliste ab lg: zehn Leistungen ergeben fünf volle Zeilen ohne Waise.
            Mobil: Icon, Titel, Pfeil; die Beschreibung erscheint ab 640 px. Die ganze Zeile ist der Link. */}
        <ul className="mt-12 grid border-t border-border lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = SERVICE_ICONS[service.slug];
            return (
              <li
                key={service.id}
                className={cn('border-b border-border', index % 2 === 1 && 'lg:border-l')}
              >
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className={cn(
                    'group flex min-h-touch-lg items-center gap-4 py-5 transition-colors duration-quick sm:gap-6 sm:py-6',
                    index % 2 === 1 ? 'lg:pl-gutter' : 'lg:pr-gutter',
                  )}
                >
                  {Icon ? (
                    <Icon size={24} className="shrink-0 text-area-strong sm:h-8 sm:w-8" />
                  ) : (
                    <BereichIcon area={ROUTE} size={24} className="shrink-0 text-area-strong sm:h-8 sm:w-8" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                      {service.title}
                    </span>
                    <span className="mt-1 hidden max-w-measure text-small text-foreground-muted sm:block">
                      {service.summary}
                    </span>
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 text-foreground-muted transition-transform duration-quick group-hover:translate-x-1"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Normen und Brandschutz: Warnung auf Papier mit Leiste links (KERN K-006), nicht als dunkle Fläche */}
      <Section tone="sunken" tight>
        <div className="grid lg:grid-cols-12 lg:gap-gutter">
          <div className="rounded-md border border-l-2 border-border border-l-warning bg-surface p-6 md:p-8 lg:col-span-8">
            <div className="flex items-center gap-3">
              <IconPanikFluchttuer size={40} className="shrink-0 text-area-strong" />
              <p className="eyebrow">
                <span className="tabular-nums text-foreground-muted">03</span>
                Normen und Brandschutz
              </p>
            </div>
            <h2 className="mt-3 text-headline font-bold text-foreground">Fluchttüren und Brandschutztüren</h2>
            <div className="prose-sm24 mt-6">
              <p>
                An Brand-, Rauchschutz- und Fluchttüren gelten die bauaufsichtlichen Zulassungen der Tür. Wird dort etwa eine Mehrfachverriegelung falsch nachgerüstet, kann die Zulassung erlöschen. Im Schadensfall kann das zu Fragen der Haftung führen.
              </p>
              <p>
                Wir bearbeiten und warten Notausgangs- und Paniktürverschlüsse nach DIN EN 179 und DIN EN 1125. Jede Änderung an diesen Türen prüfen wir vorher darauf, ob sie zulässig ist. Was wir ändern, dokumentieren wir.
              </p>
            </div>
            <Link
              href={`/${ROUTE}/panik-und-fluchttuertechnik`}
              className="group mt-6 inline-flex min-h-touch items-center gap-2 font-semibold text-primary transition-colors duration-quick ease-standard hover:text-primary-hover"
            >
              Zur Panik- und Fluchttürtechnik
              <GlyphPfeilRechts size={18} className="shrink-0 transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        {/* Erscheint erst, wenn im Backend ein Nachweis vorliegt und freigegeben ist. */}
        <NachweiseListe nachweise={nachweise} titel="Unsere Nachweise" ebene="h3" className="mt-8 max-w-3xl" />
      </Section>

      {/* FAQ Sektion */}
      <Section id="fachwissen">
        <SectionHeading
          nummer="04"
          eyebrow="Fragen und Antworten"
          title="Häufige Fragen zur Türtechnik"
          lead="Kurze Antworten zu Zylindern, Schlössern, elektronischer Nachrüstung und Pflege."
          className="max-w-3xl"
        />
        <div className="mt-12">
          <Accordion items={EXPERT_FAQ} />
        </div>
      </Section>

      {/* Angrenzende Bereiche: nummerierte Bereichsliste mit Fach-Icon je Bereich; die ganze Zeile ist der Link, der Pfeil steht auf Titelhöhe. */}
      <Section tone="muted" tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            nummer="05"
            eyebrow="Angrenzende Bereiche"
            title="Wenn es um mehr als eine Tür geht"
            lead="Oft beginnt es mit einer Tür. Diese Bereiche schließen daran an."
            className="lg:col-span-5"
          />

          {/* Mobil eine Leiste mit Anschnitt; ab md eine Liste mit Haarlinien über die volle Breite; ab lg 5/7 neben der Überschrift (Muster H08 05). */}
          <ol className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scroll-px-5 sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:block md:overflow-visible md:border-t md:border-border md:px-0 md:pb-0 md:scroll-px-0 lg:col-span-7">
            {RELATED_AREAS.map((item, index) => (
              <li
                key={item.href}
                className="shrink-0 basis-3/4 snap-start md:basis-auto md:border-b md:border-border"
              >
                <AreaScope area={item.area}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-wrap items-center gap-x-3 gap-y-4 rounded-lg border border-border bg-surface p-6 transition-colors duration-quick ease-standard hover:border-area md:flex-nowrap md:items-start md:gap-6 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-5"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-caption tabular-nums text-foreground-muted md:w-8 md:shrink-0 md:pt-1"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <BereichIcon area={item.area} size={32} className="shrink-0 text-area-strong md:-mt-1" />
                    <span className="order-last basis-full md:order-none md:min-w-0 md:flex-1 md:basis-auto">
                      <span className="block text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                        {item.label}
                      </span>
                      <span className="mt-1 block max-w-measure text-small leading-relaxed text-foreground-muted">
                        {item.body}
                      </span>
                    </span>
                    <GlyphPfeilRechts
                      size={18}
                      className="ml-auto shrink-0 text-foreground-muted transition-transform duration-quick ease-standard group-hover:text-area-strong group-focus-visible:text-area-strong zeiger:group-hover:translate-x-1 md:ml-0 md:mt-1"
                    />
                  </Link>
                </AreaScope>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
