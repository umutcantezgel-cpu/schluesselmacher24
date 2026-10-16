import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getServicePages } from '@/lib/data';
import { getNachweise } from '@/lib/data/nachweise';
import { getRichtwerte } from '@/lib/data/richtwerte';
import { PROCESS_LABELS } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { TUER_SCHUTZ_AUSSCHNITT } from '@/components/visual/generators/tuer-schutz';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';
import { TuerAbsicherungRechner } from '@/components/calculator/tuer-absicherung-rechner';
import { NachweiseListe } from '@/components/vertrauen/nachweise-liste';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
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

/** Angrenzende Bereiche — die Hauptnavigation bleibt davon unberührt. */
const RELATED_AREAS = [
  {
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    body: 'Mehrere Türen mit demselben Schlüssel schließen — ohne vollständige Anlagenplanung. Ideal für Einfamilienhäuser und kleine Gewerbeobjekte.',
  },
  {
    href: '/schliessanlagen',
    label: 'Schließanlagen',
    body: 'Wenn verschiedene Personen unterschiedlich weit schließen sollen, wird daraus eine Anlage. Strukturierte Hierarchien für komplexe Gebäude.',
  },
  {
    href: '/elektronische-zutrittsloesungen',
    label: 'Elektronische Zutrittslösungen',
    body: 'Karte, Transponder, PIN oder App statt Schlüssel — auch in Verbindung mit vorhandener Mechanik. Die flexible Alternative zur klassischen Mechanik.',
  },
  {
    href: '/sicherheitstechnik',
    label: 'Sicherheitstechnik',
    body: 'Wenn zusätzlich erkannt und gemeldet werden soll, was an der Tür passiert. Alarmanlagen und Überwachungssysteme.',
  },
];

const EXPERT_FAQ = [
  {
    question: 'Wann reicht ein Zylindertausch und wann muss die gesamte Türtechnik erneuert werden?',
    answer:
      'Ein einfacher Zylindertausch reicht oft aus, wenn Sie lediglich die Schließhoheit nach einem Schlüsselverlust oder Mieterwechsel wiederherstellen möchten, vorausgesetzt das Einsteckschloss und der Beschlag sind noch intakt und bieten ausreichend Schutz. Wenn die Tür jedoch veraltet ist, das Schloss hakt, der Beschlag keinen Ziehschutz bietet oder Sie den Einbruchschutz substanziell erhöhen wollen (z. B. auf Widerstandsklasse RC2 oder RC3), muss die Tür als Gesamtsystem betrachtet werden. Oft empfiehlt sich dann die Nachrüstung einer Mehrfachverriegelung oder eines Querriegelschlosses in Kombination mit einem Schutzbeschlag.',
  },
  {
    question: 'Was ist der Unterschied zwischen einem Einsteckschloss und einer Mehrfachverriegelung?',
    answer:
      'Ein Einsteckschloss verriegelt die Tür an genau einem Punkt, nämlich in Höhe des Schlosses über den Riegel. Eine Mehrfachverriegelung (oft auch als Stangenschloss bezeichnet) verriegelt die Tür zusätzlich an weiteren Punkten – meist oben und unten – über Schwenkriegel, Bolzen oder Pilzzapfen. Dadurch wird die Kraft bei einem Einbruchsversuch auf den gesamten Türrahmen verteilt, was ein Aufhebeln massiv erschwert und die Sicherheit signifikant erhöht.',
  },
  {
    question: 'Welche Anforderungen gibt es an Schlösser für Flucht- und Rettungswege?',
    answer:
      'Für Flucht- und Rettungswege gelten strenge gesetzliche Normen (EN 179 für Notausgänge und EN 1125 für Paniktüren). Das wichtigste Prinzip ist: Eine Tür im Fluchtweg muss sich von innen jederzeit und ohne Schlüssel öffnen lassen, auch wenn sie von außen verriegelt ist. Dies wird durch spezielle Panikschlösser und entsprechende Beschläge (wie Drücker oder Panikstangen) realisiert. Modifikationen an diesen Türen dürfen nur mit zugelassenen Komponenten und fachgerecht erfolgen, um die Zulassung nicht zu verlieren.',
  },
  {
    question: 'Lässt sich jede Haustür mit einem elektronischen Schloss nachrüsten?',
    answer:
      'In den meisten Fällen ja. Es gibt elektronische Zylinder, die den mechanischen Profilzylinder exakt ersetzen und ohne Kabelverlegung installiert werden können (Batteriebetrieb). Für vollautomatische Motorschlösser (die die Tür von selbst auf- und zuschließen) ist jedoch eine Stromversorgung im Türblatt erforderlich. Ist diese nicht vorhanden, können motorische Aufsatzantriebe auf den bestehenden Zylinder (mit Not- und Gefahrenfunktion) gesetzt werden. Wir prüfen die Gegebenheiten vor Ort und empfehlen die passende Lösung.',
  },
  {
    question: 'Wie pflege ich meine Schließzylinder und Türschlösser richtig?',
    answer:
      'Verwenden Sie für Schließzylinder niemals herkömmliches Öl oder harzende Schmiermittel, da diese den feinen Mechanismus im Inneren verkleben können. Nutzen Sie stattdessen spezielles Pflegespray für Schließzylinder (nicht fettend, z. B. auf Teflon- oder Graphitbasis). Einsteckschlösser und Mehrfachverriegelungen können hingegen an den beweglichen Teilen (Falle, Riegel) sparsam mit einem geeigneten Schmierfett behandelt werden. Schließbleche sollten regelmäßig auf festen Sitz geprüft und justiert werden, damit die Tür leichtgängig ins Schloss fällt und kein unnötiger Druck auf den Schlüssel ausgeübt wird.',
  },
];

export default async function TuerUndSchliesstechnikPage() {
  const [page, services, richtwerte, nachweise] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
    getRichtwerte(),
    getNachweise(),
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
        title={page?.headline ?? 'Ganzheitliche Tür- und Schließtechnik'}
        lead={page?.subline ?? 'Sicherheit erfordert Systemverständnis. Vom hochsicheren Zylinder über Mehrfachverriegelungen bis zum geprüften Schutzbeschlag.'}
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
          <ButtonLink href={`/service-und-termin/anfrage?thema=${ROUTE}`} size="lg" pfeil>
            Beratungstermin vereinbaren
          </ButtonLink>
        }
      />

      {/* Tiefgreifende Fachliche Einführung */}
      <Section tight>
        {/* Ab lg: Text und Schriftfeld links übereinander, der hohe Rechner rechts über beide Zeilen – ohne Leerfläche links. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:grid-rows-kopf lg:items-start lg:gap-gutter">
          <div className="space-y-8 lg:col-span-7 lg:row-start-1">
            <SectionHeading
              nummer="01"
              eyebrow="Architektur der Sicherheit"
              title="Die Tür als geschlossenes Sicherheitssystem"
              lead="Wirkungsvoller Einbruchschutz und reibungslose Funktion entstehen nicht durch Einzelkomponenten, sondern durch das präzise Zusammenspiel aller Elemente einer Tür."
            />

            <div className="prose-sm24 max-w-none">
              <p>
                Die Sicherheit einer Tür wird stets durch ihr schwächstes Glied definiert. Ein hochkomplexer, aufbohrgeschützter Schließzylinder verfehlt seine Wirkung vollständig, wenn das dazugehörige Einsteckschloss einer Hebelwirkung nicht standhält oder der Schutzbeschlag von außen einfach abmontiert werden kann. <strong>Ganzheitliche Tür- und Schließtechnik</strong> bedeutet, die physikalischen Kräfte und potenziellen Angriffsvektoren zu verstehen und das Türsystem entsprechend aufzubauen.
              </p>

              <h3 className="mt-8 mb-4 text-title font-bold text-foreground tracking-tight">Mechanische Kernkomponenten im Verbund</h3>
              <p>
                Das Fundament jeder mechanischen Türsicherung bildet das Zusammenspiel aus <strong>Profilzylinder</strong>, <strong>Einsteckschloss</strong>, <strong>Schutzbeschlag</strong> und <strong>Schließblech</strong> im Rahmen.
                Der Zylinder identifiziert den berechtigten Schlüssel. Das Einsteckschloss übersetzt diese Drehbewegung in die Ver- oder Entriegelung. Der Schutzbeschlag schirmt den Zylinder vor mechanischen Angriffen (Ziehen, Abbrechen) ab, und das Schließblech nimmt die Riegelkraft auf und leitet sie in das Mauerwerk ab.
              </p>
            </div>

            {/* Haarlinienliste: die drei Schutzpunkte als Stückliste */}
            <ul className="grid border-t border-border">
              {[
                { title: 'Widerstandsklassen (RC)', desc: 'Wir orientieren uns bei der Konzeption an den DIN EN 1627 Normen. Für den privaten Bereich empfehlen wir mindestens RC2, bei erhöhtem Schutzbedarf RC3.' },
                { title: 'Zieh- und Bohrschutz', desc: 'Sicherheitsrosetten und Schutzbeschläge mit Zylinderabdeckung verhindern das gewaltsame Kernziehen, eine der häufigsten Einbruchmethoden.' },
                { title: 'Mehrfachverriegelung', desc: 'Die Verteilung der Schließpunkte über die gesamte Türhöhe verhindert ein Aufhebeln der Tür effektiv. Die Riegel greifen dabei tief in massive Schließleisten.' }
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

          {/* Nicht mitlaufend: Der Rechner ist höher als das Fenster, Ergebnis und Anfrage lägen sonst außer Reichweite. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <TuerAbsicherungRechner
              werte={richtwerte.tuerAbsicherung}
              anfrageHref={`/service-und-termin/anfrage?thema=${ROUTE}`}
            />
          </div>

          {/* Schriftfeld: mobil nach dem Rechner, ab lg unter dem Text; ab md zweispaltig: Einordnung links, Ablauf rechts. */}
          <div className="grid border-y border-border md:grid-cols-2 md:gap-gutter lg:col-span-7 lg:row-start-2 lg:self-start">
            <div className="py-6 md:pr-gutter">
              <div className="prose-sm24 max-w-none">
                <h3 className="mb-4 text-title font-bold text-foreground tracking-tight">Elektronik trifft Mechanik</h3>
                <p>
                  Die moderne Türtechnik verschmilzt zunehmend mit elektronischen Systemen. Mechatronische Zylinder, Motorschlösser und digitale Zutrittskontrollen erfordern ein noch tieferes Systemverständnis. Ein Motorschloss muss beispielsweise so konfiguriert sein, dass es im Brandfall eine sichere Flucht ermöglicht, während es im verriegelten Zustand maximalen Widerstand gegen Einbruch bietet.
                </p>
              </div>
            </div>

            {/* Schriftfeld: der Ablauf in diesem Bereich wie eine Zeile der Bemaßung */}
            <dl className="border-t border-border py-6 md:border-l md:border-t-0 md:pl-gutter">
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                Ablauf in diesem Bereich
              </dt>
              <dd className="mt-2 text-title-sm font-semibold text-foreground">{process.label}</dd>
              <dd className="mt-2 max-w-measure text-small text-foreground-muted">
                {process.hint} Wir analysieren die bauliche Substanz Ihrer Tür und erstellen darauf basierend ein präzises Sicherheitskonzept, bevor wir Komponenten austauschen.
              </dd>
            </dl>
          </div>
        </div>
      </Section>

      {/* Leistungsportfolio: Haarlinien wie der Schnelleinstieg der Startseite */}
      <Section tone="muted">
        <SectionHeading
          nummer="02"
          eyebrow="Leistungsportfolio"
          title="Technische Spezialisierung"
          lead="Unsere Kernkompetenzen in der Tür- und Schließtechnik. Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik."
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

      {/* Normen und Brandschutz */}
      <Section tight>
        <div className="relative overflow-hidden rounded-lg bg-surface-ink p-8 text-foreground-inverse md:p-12 lg:p-16">
          <div className="relative z-raised grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-gutter">
            <div className="lg:col-span-8">
              <p className="eyebrow text-foreground-inverse">
                <span className="tabular-nums text-foreground-inverse/70">03</span>
                Normen und Brandschutz
              </p>
              <h2 className="mt-3 mb-6 text-headline font-bold text-foreground-inverse">Regulatorik: Fluchtwege und Brandschutz</h2>
              <div className="space-y-6 text-foreground-inverse/80 text-lead leading-relaxed">
                <p>
                  Eingriffe an Brand-, Rauchschutz- oder Fluchttüren erfordern höchste fachliche Expertise und die strikte Einhaltung bauaufsichtlicher Zulassungen. Eine nachträglich falsch montierte Mehrfachverriegelung an einer T30-Brandschutztür kann zum sofortigen Erlöschen der Zulassung führen – mit gravierenden haftungsrechtlichen Konsequenzen im Schadensfall.
                </p>
                <p>
                  Wir sind zertifiziert für die Bearbeitung und Instandhaltung von Flucht- und Rettungswegtechnik nach DIN EN 179 und DIN EN 1125. Jede technische Modifikation wird vorab auf Zulässigkeit geprüft und fachgerecht dokumentiert.
                </p>
                <Link
                  href={`/${ROUTE}/panik-und-fluchttuertechnik`}
                  className="group inline-flex min-h-touch items-center gap-2 border-b border-primary pb-1 font-semibold text-foreground-inverse transition-colors duration-quick hover:text-primary-soft focus-visible:ring-offset-surface-ink"
                >
                  Spezifikationen für Paniktechnik
                  <GlyphPfeilRechts size={18} className="transition-transform duration-quick group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Rechte Spalte: die Fachgrafik der Kachel Panik- und Fluchttürtechnik, Strich auf dunklem Grund */}
            <div className="flex justify-center lg:col-span-4 lg:justify-end">
              <IconPanikFluchttuer size={96} className="stroke-foreground-inverse" />
            </div>
          </div>
        </div>
        {/* Erscheint erst, wenn im Backend ein Nachweis vorliegt und freigegeben ist. */}
        <NachweiseListe nachweise={nachweise} titel="Unsere Nachweise" ebene="h3" className="mt-8 max-w-3xl" />
      </Section>

      {/* FAQ Sektion */}
      <Section id="fachwissen">
        <SectionHeading
          nummer="04"
          eyebrow="Fachwissen & Beratung"
          title="Häufig gestellte Fragen zur Türtechnik"
          lead="Wir legen Wert auf transparente Aufklärung. Hier beantworten wir die komplexesten Fragen rund um Zylinder, Schlösser und mechanische Sicherheit."
          className="max-w-3xl"
        />
        <div className="mt-12">
          <Accordion items={EXPERT_FAQ} />
        </div>
      </Section>

      {/* Angrenzende Bereiche: die ganze Karte ist der Link, unten rechts nur der Pfeil */}
      <Section tone="muted" tight>
        <SectionHeading
          nummer="05"
          eyebrow="Systemerweiterungen"
          title="Gewerkeübergreifende Lösungen"
          lead="Tür- und Schließtechnik ist oft der erste Schritt. Erweitern Sie Ihr System um vernetzte oder komplexe Hierarchien."
        />

        {/* Mobil eine Leiste mit Anschnitt, ab 768 px zwei Spalten (Muster Startseite „Bestellen ohne Termin“). */}
        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-gutter md:overflow-visible md:px-0 md:pb-0 scroll-px-5 sm:scroll-px-6 md:scroll-px-0">
          {RELATED_AREAS.map((area) => (
            <li key={area.href} className="shrink-0 basis-3/4 snap-start md:basis-auto">
              <Card className="h-full border-border transition-colors hover:border-primary">
                <Link
                  href={area.href}
                  className="group flex h-full flex-col rounded-lg p-6 transition-colors duration-quick md:p-8"
                >
                  <span className="text-title font-bold tracking-tight text-foreground">{area.label}</span>
                  <span className="mt-4 flex-1 text-body leading-relaxed text-foreground-muted">
                    {area.body}
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="mt-6 self-end text-primary transition-transform duration-quick group-hover:translate-x-1"
                  />
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
