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
import { getNachweise } from '@/lib/data/nachweise';
import { getRichtwerte } from '@/lib/data/richtwerte';
import { PROCESS_LABELS } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Accordion } from '@/components/ui/accordion';
import { TuerAbsicherungRechner } from '@/components/calculator/tuer-absicherung-rechner';
import { NachweiseListe } from '@/components/vertrauen/nachweise-liste';
import { ServiceBudgetCalculator } from "@/components/calculator/service-budget-calculator";
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

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
    question: 'Wie erkenne ich, ob mein Profilzylinder ausreichend geschützt ist?',
    answer: 'Ein hochwertiger Profilzylinder verfügt über spezifische Sicherheitsmerkmale wie Bohrschutz (gehärtete Stahlstifte im Zylinderkern und -gehäuse), Ziehschutz (oft in Kombination mit einem Schutzbeschlag) und einen komplexen Schlüsselquerschnitt mit Kopierschutz. Ein Blick auf die Prägungen am Zylinder kann Aufschluss geben (z.B. VdS-Klasse oder SKG-Sterne). Wir empfehlen grundsätzlich Zylinder mit einer Sicherungskarte, die das unbefugte Kopieren von Schlüsseln verhindert. Zudem sollte der Zylinder nicht mehr als 3mm über den Türbeschlag hinausragen, um ein Abbrechen zu erschweren.'
  },
  {
    question: 'Was ist der Unterschied zwischen einer Gleichschließung und einer Schließanlage?',
    answer: 'Bei einer Gleichschließung können mehrere Zylinder (z.B. Haustür, Kellertür, Garage) mit demselben Schlüssel bedient werden. Es gibt jedoch keine Hierarchie oder unterschiedliche Berechtigungen. Eine Schließanlage hingegen ist ein komplexes System, bei dem Schlüssel mit verschiedenen Berechtigungen ausgestattet sind. Ein Hauptschlüssel (HS) schließt beispielsweise alle Türen, während ein Gruppenschlüssel (GS) nur Zugang zu einer bestimmten Abteilung gewährt und Einzelschlüssel (ES) nur für spezifische Räume codiert sind. Schließanlagen erfordern eine exakte Planung mittels eines Schließplans.'
  },
  {
    question: 'Können elektronische Schließsysteme bei einem Stromausfall weiterhin genutzt werden?',
    answer: 'Ja, professionelle elektronische und mechatronische Schließsysteme sind für solche Szenarien ausgelegt. Mechatronische Zylinder werden in der Regel durch Batterien im Zylinder selbst oder im Schlüssel (z.B. bei Systemen mit aktiven Transpondern) mit Strom versorgt und arbeiten völlig autark vom Stromnetz. Vernetzte Systeme oder Motorschlösser verfügen über Notstromakkus (USV), die den Betrieb über mehrere Stunden oder Tage aufrechterhalten. Zudem gibt es bei vielen Systemen mechanische Notöffnungsfunktionen, um in jedem Fall Zugang zu gewährleisten.'
  },
  {
    question: 'Welche Anforderungen gelten für Fluchttüren nach DIN EN 179 und DIN EN 1125?',
    answer: 'Türen in Flucht- und Rettungswegen müssen jederzeit von innen ohne Schlüssel und mit einem einzigen Handgriff (Panikfunktion) zu öffnen sein. DIN EN 179 gilt für Notausgänge, die von Personen genutzt werden, die mit den Fluchtwegen vertraut sind (Bedienung über Türdrücker oder Stoßplatte). DIN EN 1125 gilt für Paniktüren in öffentlichen Gebäuden, wo Personen in Panik geraten könnten (Bedienung über horizontale Betätigungsstangen). Nachträgliche Änderungen, wie der Einbau von Zusatzschlössern oder elektronischen Zutrittskontrollen, dürfen diese Funktionen unter keinen Umständen beeinträchtigen und bedürfen spezieller Systemprüfungen.'
  },
  {
    question: 'Was bedeutet die Widerstandsklasse (RC) bei einbruchhemmenden Türen?',
    answer: 'Die Widerstandsklasse (Resistance Class, kurz RC) nach DIN EN 1627 gibt an, wie lange und gegen welche Werkzeuge eine Tür einem Einbruchsversuch standhält. RC1N bietet nur einen geringen Grundschutz. Für private Wohnungen und Häuser empfiehlt die Polizei mindestens RC2 (Schutz gegen Gelegenheitstäter mit einfachen Werkzeugen wie Schraubendreher oder Keil für mindestens 3 Minuten). RC3 bietet Schutz gegen Gewohnheitstäter mit erweitertem Werkzeug (z.B. Kuhfuß) für 5 Minuten. Die Klassen RC4 bis RC6 sind für Bereiche mit hohem bis extremem Gefährdungspotenzial konzipiert und widerstehen erfahrenen Tätern mit Akku- und Elektrowerkzeugen.'
  }
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

              <h2 className="text-2xl font-bold text-foreground mt-12 mb-4 tracking-tight">Tiefgehende architektonische Methodik in der Schließtechnik</h2>
              <p className="mt-4">
                Unsere Methodik bei der Konzeption von Schließanlagen und Sicherheitssystemen basiert auf einem ganzheitlichen Ansatz, der mechanische und elektronische Komponenten perfekt aufeinander abstimmt. Die Architektur eines sicheren Gebäudes beginnt an der Peripherie und setzt sich bis in die innersten Sicherheitszonen fort. Dabei analysieren wir nicht nur die offensichtlichen Schwachstellen wie Türen und Fenster, sondern auch strukturelle Integrität, Fluchtwege und die Integration in übergeordnete Gebäudemanagementsysteme. Die Auswahl der richtigen Zylinder, Schlösser und Beschläge erfordert ein tiefes Verständnis der Materialwissenschaften, der Mechanik und der aktuellen Einbruchsmethoden.
              </p>
              <p className="mt-4">
                Ein wesentlicher Bestandteil unserer Methodik ist die Risikobewertung. Wir kategorisieren Gebäude nach verschiedenen Sicherheitsstufen und entwickeln darauf basierend maßgeschneiderte Konzepte. Für Hochsicherheitsbereiche setzen wir auf mechatronische Systeme, die kryptografisch abgesichert sind und physischen Angriffen extremen Widerstand entgegensetzen. Diese Systeme sind so konzipiert, dass sie selbst bei Stromausfall oder Netzwerkunterbrechungen ihre Kernfunktionen beibehalten. Darüber hinaus legen wir großen Wert auf die Wartbarkeit und Skalierbarkeit unserer Anlagen. Eine Schließanlage muss mit den Anforderungen des Nutzers wachsen können, ohne dass grundlegende Strukturänderungen notwendig werden.
              </p>
              <p className="mt-4">
                Ein weiterer entscheidender Faktor ist die Benutzerfreundlichkeit. Die komplexeste Sicherheitstechnik nützt wenig, wenn sie im Alltag als hinderlich empfunden wird oder durch Fehlbedienung ihre Wirkung verliert. Daher integrieren wir intuitive Bedienkonzepte und barrierefreie Lösungen, die höchsten Sicherheitsstandards entsprechen. Dazu gehören beispielsweise elektronische Zylinder, die per Smartphone oder Transponder bedient werden können, sowie Panikschlösser, die im Notfall eine schnelle und sichere Evakuierung gewährleisten, ohne die äußere Sicherheit zu kompromittieren.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4 tracking-tight">Vergleichsmatrix: Mechanische vs. Mechatronische Zylinder</h3>
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-foreground">
                      <th className="py-4 px-6 font-semibold">Eigenschaft</th>
                      <th className="py-4 px-6 font-semibold">Mechanische Zylinder</th>
                      <th className="py-4 px-6 font-semibold">Mechatronische Zylinder</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-foreground-muted">
                    <tr className="border-b border-border">
                      <td className="py-4 px-6 font-medium text-foreground">Sicherheitsniveau</td>
                      <td className="py-4 px-6">Hoch (je nach RC-Klasse und Bohrschutz)</td>
                      <td className="py-4 px-6">Sehr hoch (kombiniert physischen Widerstand mit elektronischer Authentifizierung)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6 font-medium text-foreground">Flexibilität</td>
                      <td className="py-4 px-6">Gering (Änderungen erfordern oft den Austausch von Zylindern/Schlüsseln)</td>
                      <td className="py-4 px-6">Sehr hoch (Berechtigungen können in Echtzeit entzogen oder erteilt werden)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6 font-medium text-foreground">Protokollierung</td>
                      <td className="py-4 px-6">Nicht möglich</td>
                      <td className="py-4 px-6">Umfassend (Wer, wann, wo)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6 font-medium text-foreground">Schlüsselverlust</td>
                      <td className="py-4 px-6">Hohes Risiko (kostenintensiver Austausch der Anlage oft notwendig)</td>
                      <td className="py-4 px-6">Geringes Risiko (Medium wird einfach im System gesperrt)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6 font-medium text-foreground">Kosten (Initial)</td>
                      <td className="py-4 px-6">Geringer bis mittel</td>
                      <td className="py-4 px-6">Höher (Elektronik und Software-Infrastruktur)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4 tracking-tight">Zertifizierungen und Normen im Detail</h3>
              <p className="mt-4">
                Unsere Arbeit richtet sich strikt nach den relevanten DIN- und EN-Normen, um eine nachvollziehbare und überprüfbare Qualität zu gewährleisten. Die DIN EN 1627 beispielsweise definiert die Anforderungen und Klassifizierungen für einbruchhemmende Türen, Fenster und Abschlüsse. Wir verbauen standardmäßig Komponenten, die mindestens der Widerstandsklasse RC2 entsprechen, was einen soliden Grundschutz gegen Gelegenheitstäter bietet. Für gewerbliche Objekte oder bei erhöhtem Gefährdungspotenzial empfehlen wir die Klassen RC3 bis RC6, die auch gezielten Angriffen mit schwerem Werkzeug standhalten.
              </p>
              <p className="mt-4">
                Darüber hinaus sind die Vorgaben für Brandschutz und Fluchtwege von essenzieller Bedeutung. Die DIN EN 179 regelt Notausgangsverschlüsse mit Drückern oder Stoßplatten, während die DIN EN 1125 Paniktürverschlüsse mit horizontaler Betätigungsstange für Gebäude mit öffentlichem Publikumsverkehr spezifiziert. Jede Modifikation an solchen Türen, wie der Einbau eines Motorschlosses oder eines elektronischen Zylinders, muss zwingend mit der bauaufsichtlichen Zulassung der Tür übereinstimmen. Ein Verstoß hiergegen führt nicht nur zum Verlust des Versicherungsschutzes, sondern kann im Schadensfall auch strafrechtliche Konsequenzen haben. Daher dokumentieren wir alle Änderungen minutiös und verwenden ausschließlich zertifizierte und zugelassene Bauteile.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4 tracking-tight">Wartung und Lebenszyklusmanagement</h3>
              <p className="mt-4">
                Eine Schließanlage ist kein statisches Gebilde, sondern bedarf regelmäßiger Pflege und Wartung, um ihre Funktion und Sicherheit über Jahre hinweg zu gewährleisten. Mechanische Bauteile unterliegen einem natürlichen Verschleiß, der durch Umwelteinflüsse, unsachgemäße Bedienung oder Vandalismus beschleunigt werden kann. Wir bieten umfassende Wartungsverträge an, die eine regelmäßige Inspektion, Reinigung und Schmierung der relevanten Komponenten umfassen. Dabei prüfen wir auch die korrekte Funktion von Türschließern, Mehrfachverriegelungen und elektronischen Komponenten.
              </p>
              <p className="mt-4">
                Besonderes Augenmerk legen wir auf das Lebenszyklusmanagement. Dies beinhaltet die rechtzeitige Identifikation von veralteten oder nicht mehr unterstützten Systemen und die Planung von Migrationsstrategien. Gerade im Bereich der mechatronischen Anlagen ist es wichtig, Software-Updates und Hardware-Upgrades proaktiv zu planen, um Sicherheitslücken zu schließen und die Kompatibilität mit neuen Technologien sicherzustellen. Unser Ziel ist es, den Wert Ihrer Investition langfristig zu erhalten und ungeplante Ausfallzeiten zu minimieren. Durch eine vorausschauende Planung und regelmäßige Wartung können wir die Lebensdauer Ihrer Schließanlage signifikant verlängern und die Betriebskosten optimieren.
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

          {/* Nicht mitlaufend: Der Rechner ist höher als das Fenster, Ergebnis und
              Anfrage lägen sonst außer Reichweite. */}
          <div className="space-y-8">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: Detailaufnahme einer massiven Mehrfachverriegelung im Querschnitt, Schwenkriegel greift in Schließblech',
                ratio: '4/3',
                note: 'Hochauflösendes Detailfoto zur Verdeutlichung der mechanischen Präzision.',
              }}
            />
            <ServiceBudgetCalculator />
            <TuerAbsicherungRechner
              werte={richtwerte.tuerAbsicherung}
              anfrageHref={`/service-und-termin/anfrage?thema=${ROUTE}`}
            />
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
        {/* Erscheint erst, wenn im Backend ein Nachweis vorliegt und freigegeben ist. */}
        <NachweiseListe nachweise={nachweise} titel="Unsere Nachweise" ebene="h3" className="mt-8 max-w-3xl" />
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
