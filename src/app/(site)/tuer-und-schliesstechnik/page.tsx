import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  DoorClosed,
  KeyRound,
  Layers,
  Lock,
  PanelTop,
  ScanLine,
  ShieldCheck,
  Siren,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

import { getPageContent, getServicePages } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';
import { SecurityCheckCalculator } from '@/components/calculator/security-check-calculator';
import { JsonLd, faqSchema } from '@/components/seo/json-ld';

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

/** Symbole je Leistung — rein dekorativ, die Inhalte kommen aus der Datenschicht. */
const SERVICE_ICONS: Record<string, typeof KeyRound> = {
  'profilzylinder-und-spezialzylinder': KeyRound,
  einsteckschloesser: Lock,
  mehrfachverriegelungen: Layers,
  schutzbeschlaege: ShieldCheck,
  tuerzusatzschloesser: PanelTop,
  tuerschliesser: DoorClosed,
  'panik-und-fluchttuertechnik': Siren,
  'reparatur-und-austausch': Wrench,
  'technische-beratung': ScanLine,
  'montage-und-anpassung': Wrench,
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
      'Ein einfacher Zylindertausch reicht oft aus, wenn Sie lediglich die Schließhoheit nach einem Schlüsselverlust oder Mieterwechsel wiederherstellen möchten, vorausgesetzt das Einsteckschloss und der Beschlag sind noch intakt und bieten ausreichend Schutz. Wenn die Tür jedoch veraltet ist, das Schloss hakt, der Beschlag keinen Ziehschutz bietet oder Sie den Einbruchschutz substanziell erhöhen wollen (z.B. auf Widerstandsklasse RC2 oder RC3), muss die Tür als Gesamtsystem betrachtet werden. Oft empfiehlt sich dann die Nachrüstung einer Mehrfachverriegelung oder eines Querriegelschlosses in Kombination mit einem Schutzbeschlag.',
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
      'Verwenden Sie für Schließzylinder niemals herkömmliches Öl oder harzende Schmiermittel, da diese den feinen Mechanismus im Inneren verkleben können. Nutzen Sie stattdessen spezielles Pflegespray für Schließzylinder (nicht fettend, z.B. auf Teflon- oder Graphitbasis). Einsteckschlösser und Mehrfachverriegelungen können hingegen an den beweglichen Teilen (Falle, Riegel) sparsam mit einem geeigneten Schmierfett behandelt werden. Schließbleche sollten regelmäßig auf festen Sitz geprüft und justiert werden, damit die Tür leichtgängig ins Schloss fällt und kein unnötiger Druck auf den Schlüssel ausgeübt wird.',
  },
];

export default async function TuerUndSchliesstechnikPage() {
  const [page, services] = await Promise.all([
    getPageContent(ROUTE),
    getServicePages(ROUTE),
  ]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  return (
    <>
      <JsonLd data={faqSchema(EXPERT_FAQ.map((g) => ({ question: g.question, answer: g.answer })))} />

      <PageHeader
        eyebrow="Leistungsbereich"
        title={page?.headline ?? 'Ganzheitliche Tür- und Schließtechnik'}
        lead={page?.subline ?? 'Sicherheit erfordert Systemverständnis. Vom hochsicheren Zylinder über Mehrfachverriegelungen bis zum geprüften Schutzbeschlag.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Tür- und Schließtechnik' }]}
        actions={
          <ButtonLink href={`/service-und-termin/anfrage?thema=${ROUTE}`} size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-all active:scale-[0.99]">
            Beratungstermin vereinbaren
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Tiefgreifende Fachliche Einführung */}
      <Section tight>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Architektur der Sicherheit"
              title="Die Tür als geschlossenes Sicherheitssystem"
              lead="Wirkungsvoller Einbruchschutz und reibungslose Funktion entstehen nicht durch Einzelkomponenten, sondern durch das präzise Zusammenspiel aller Elemente einer Tür."
            />

            <div className="prose-sm24 max-w-none">
              <p>
                Die Sicherheit einer Tür wird stets durch ihr schwächstes Glied definiert. Ein hochkomplexer, aufbohrgeschützter Schließzylinder verfehlt seine Wirkung vollständig, wenn das dazugehörige Einsteckschloss einer Hebelwirkung nicht standhält oder der Schutzbeschlag von außen einfach abmontiert werden kann. <strong>Ganzheitliche Tür- und Schließtechnik</strong> bedeutet, die physikalischen Kräfte und potenziellen Angriffsvektoren zu verstehen und das Türsystem entsprechend aufzubauen.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4 tracking-tight">Mechanische Kernkomponenten im Verbund</h3>
              <p>
                Das Fundament jeder mechanischen Türsicherung bildet das Zusammenspiel aus <strong>Profilzylinder</strong>, <strong>Einsteckschloss</strong>, <strong>Schutzbeschlag</strong> und <strong>Schließblech</strong> im Rahmen.
                Der Zylinder identifiziert den berechtigten Schlüssel. Das Einsteckschloss übersetzt diese Drehbewegung in die Ver- oder Entriegelung. Der Schutzbeschlag schirmt den Zylinder vor mechanischen Angriffen (Ziehen, Abbrechen) ab, und das Schließblech nimmt die Riegelkraft auf und leitet sie in das Mauerwerk ab.
              </p>

              <ul className="grid gap-4 mt-6">
                {[
                  { title: 'Widerstandsklassen (RC)', desc: 'Wir orientieren uns bei der Konzeption an den DIN EN 1627 Normen. Für den privaten Bereich empfehlen wir mindestens RC2, bei erhöhtem Schutzbedarf RC3.' },
                  { title: 'Zieh- und Bohrschutz', desc: 'Sicherheitsrosetten und Schutzbeschläge mit Zylinderabdeckung verhindern das gewaltsame Kernziehen, eine der häufigsten Einbruchmethoden.' },
                  { title: 'Mehrfachverriegelung', desc: 'Die Verteilung der Schließpunkte über die gesamte Türhöhe verhindert ein Aufhebeln der Tür effektiv. Die Riegel greifen dabei tief in massive Schließleisten.' }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 p-4 rounded-xl border border-border bg-surface-muted">
                    <CheckCircle2 className="shrink-0 text-primary mt-0.5" size={20} />
                    <div>
                      <strong className="block text-foreground">{item.title}</strong>
                      <span className="text-sm mt-1 block">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4 tracking-tight">Elektronik trifft Mechanik</h3>
              <p>
                Die moderne Türtechnik verschmilzt zunehmend mit elektronischen Systemen. Mechatronische Zylinder, Motorschlösser und digitale Zutrittskontrollen erfordern ein noch tieferes Systemverständnis. Ein Motorschloss muss beispielsweise so konfiguriert sein, dass es im Brandfall eine sichere Flucht ermöglicht, während es im verriegelten Zustand maximalen Widerstand gegen Einbruch bietet.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Ablauf in diesem Bereich
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">{process.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {process.hint} Wir analysieren die bauliche Substanz Ihrer Tür und erstellen darauf basierend ein präzises Sicherheitskonzept, bevor wir Komponenten austauschen.
              </p>
            </div>
          </div>

          <div className="sticky top-8 space-y-8">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: Detailaufnahme einer massiven Mehrfachverriegelung im Querschnitt, Schwenkriegel greift in Schließblech',
                ratio: '4/3',
                note: 'Hochauflösendes Detailfoto zur Verdeutlichung der mechanischen Präzision.',
              }}
            />
            {/* Interaktives Modul */}
            <SecurityCheckCalculator />
          </div>
        </div>
      </Section>

      {/* Leistungen als Bento Grid */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Leistungsportfolio"
          title="Technische Spezialisierung"
          lead="Unsere Kernkompetenzen in der Tür- und Schließtechnik. Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? Wrench;
            return (
              <li key={service.id}>
                <Link
                  href={`/${ROUTE}/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-8 transition-all hover:border-primary hover:shadow-md"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-110 group-hover:bg-primary-soft">
                    <Icon size={26} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="mt-6 block text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </span>
                  <span className="mt-3 block flex-1 text-sm leading-relaxed text-foreground-muted">
                    {service.summary}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Leistungsdetails
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Normen und Brandschutz */}
      <Section tight>
        <div className="rounded-3xl bg-surface-ink text-foreground-inverse p-8 md:p-12 lg:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none">
            <ShieldCheck size={400} />
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Regulatorik: Fluchtwege und Brandschutz</h2>
            <div className="space-y-6 text-foreground-inverse text-lg leading-relaxed">
              <p>
                Eingriffe an Brand-, Rauchschutz- oder Fluchttüren erfordern höchste fachliche Expertise und die strikte Einhaltung bauaufsichtlicher Zulassungen. Eine nachträglich falsch montierte Mehrfachverriegelung an einer T30-Brandschutztür kann zum sofortigen Erlöschen der Zulassung führen – mit gravierenden haftungsrechtlichen Konsequenzen im Schadensfall.
              </p>
              <p>
                Wir sind zertifiziert für die Bearbeitung und Instandhaltung von Flucht- und Rettungswegtechnik nach DIN EN 179 und DIN EN 1125. Jede technische Modifikation wird vorab auf Zulässigkeit geprüft und fachgerecht dokumentiert.
              </p>
              <Link
                href={`/${ROUTE}/panik-und-fluchttuertechnik`}
                className="inline-flex items-center gap-2 mt-4 text-foreground-inverse font-semibold hover:text-primary transition-colors border-b border-primary pb-1"
              >
                Spezifikationen für Paniktechnik ansehen
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Sektion */}
      <Section id="fachwissen">
        <SectionHeading
          eyebrow="Fachwissen & Beratung"
          title="Häufig gestellte Fragen zur Türtechnik"
          lead="Wir legen Wert auf transparente Aufklärung. Hier beantworten wir die komplexesten Fragen rund um Zylinder, Schlösser und mechanische Sicherheit."
          className="max-w-3xl"
        />
        <div className="mt-12 max-w-4xl mx-auto">
          <Accordion items={EXPERT_FAQ} />
        </div>
      </Section>

      {/* Angrenzende Bereiche */}
      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Systemerweiterungen"
          title="Gewerkeübergreifende Lösungen"
          lead="Tür- und Schließtechnik ist oft der erste Schritt. Erweitern Sie Ihr System um vernetzte oder komplexe Hierarchien."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {RELATED_AREAS.map((area) => (
            <li key={area.href}>
              <Card className="h-full border-border hover:border-primary transition-colors">
                <CardBody className="flex h-full flex-col p-8">
                  <p className="text-xl font-bold tracking-tight text-foreground">{area.label}</p>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground-muted">
                    {area.body}
                  </p>
                  <Link
                    href={area.href}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary group"
                  >
                    {area.label} erkunden
                    <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Weiterführende Seiten */}
      {page && page.seo.internalLinks.length > 0 && (
        <Section tight>
          <SectionHeading eyebrow="Wissensdatenbank" title="Verwandte Fachthemen" />
          <ul className="mt-8 flex flex-wrap gap-4">
            {page.seo.internalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[48px] items-center gap-3 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary hover:shadow-sm"
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
