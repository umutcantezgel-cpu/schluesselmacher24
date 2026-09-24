import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Ban,
  Blend,
  Building2,
  CalendarClock,
  Clock,
  CreditCard,
  DoorClosed,
  FileText,
  Hash,
  Layers,
  Smartphone,
  UserCog,
} from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

const ROUTE = 'elektronische-zutrittsloesungen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Elektronische Zutrittslösungen',
    description:
      page?.seo.description
      ?? 'Elektronische Zutrittskontrolle mit Karte, Transponder, PIN, Smartphone und digitalen '
        + 'Zylindern. Benutzerverwaltung, zeitliche Berechtigungen und Kombination mit Mechanik.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/* Die elf Bausteine einer elektronischen Zutrittslösung — je Baustein wird
   erklärt, was er leistet und wann er sinnvoll ist. */
interface BuildingBlock {
  id: string;
  title: string;
  body: string;
  points: string[];
  icon: typeof CreditCard;
  /** Baustein über die volle Breite, wenn er zusätzlichen Hinweis trägt. */
  wide?: boolean;
}

const BLOCKS: BuildingBlock[] = [
  {
    id: 'rfid',
    title: 'RFID-Transponder und Zutrittskarten',
    body:
      'Ein Transponder oder eine Karte wird vor einen Leser gehalten, der die hinterlegte '
      + 'Berechtigung prüft. Das Medium selbst trägt keinen Bart und lässt sich nicht nachfeilen.',
    points: [
      'Karten im Scheckkartenformat, Schlüsselanhänger oder Aufkleber',
      'Ein Medium kann mehrere Türen öffnen, ohne dass Schlüssel dazukommen',
      'Ausgabe und Entzug erfolgen in der Verwaltung, nicht an der Tür',
    ],
    icon: CreditCard,
  },
  {
    id: 'smartphone',
    title: 'Smartphone- und App-Steuerung',
    body:
      'Die Berechtigung liegt auf dem Mobiltelefon der Nutzerin oder des Nutzers. Das ist '
      + 'praktisch, wenn Personen kurzfristig Zutritt brauchen und kein Medium übergeben werden kann.',
    points: [
      'Keine Übergabe eines Gegenstands nötig',
      'Setzt voraus, dass alle Beteiligten ein geeignetes Gerät haben und bedienen wollen',
      'Sinnvoll als Ergänzung, selten als einziges Medium',
    ],
    icon: Smartphone,
  },
  {
    id: 'pin',
    title: 'PIN-Code und Tastatur',
    body:
      'Zutritt über eine Zahlenkombination an einer Tastatur. Es muss nichts mitgeführt werden — '
      + 'dafür muss der Code bekannt und vertraulich bleiben.',
    points: [
      'Gut für Räume mit wechselnden, kurz anwesenden Personen',
      'Codes sollten je Person oder Gruppe vergeben und regelmäßig gewechselt werden',
      'Häufig in Kombination mit Karte oder Transponder eingesetzt',
    ],
    icon: Hash,
  },
  {
    id: 'digitale-zylinder',
    title: 'Digitale Zylinder',
    body:
      'Ein digitaler Zylinder ersetzt den mechanischen Zylinder in der vorhandenen Tür. Der Knauf '
      + 'dreht erst dann durch, wenn ein berechtigtes Medium erkannt wurde.',
    points: [
      'In der Regel ohne Kabel und ohne Eingriff in das Türblatt',
      'Maße der Tür und die vorhandene Beschlagsituation entscheiden über die Auswahl',
      'Batteriebetrieben — der Wechselrhythmus gehört in die Planung',
    ],
    icon: Layers,
  },
  {
    id: 'beschlaege',
    title: 'Elektronische Beschläge und Smart Locks',
    body:
      'Statt des Zylinders wird der Beschlag oder der komplette Griffbereich getauscht. Das ist '
      + 'sinnvoll, wenn zusätzlich zur Leseeinheit eine andere Griffform oder ein Schutzbeschlag nötig ist.',
    points: [
      'Leser und Griff bilden eine Einheit',
      'Einsatz hängt von Türstärke, Dornmaß und Schlossart ab',
      'Bei Brand- und Fluchttüren gelten besondere Anforderungen an die Ausführung',
    ],
    icon: DoorClosed,
  },
  {
    id: 'zeitlich-begrenzt',
    title: 'Zeitlich begrenzte Zugangsberechtigungen',
    body:
      'Eine Berechtigung erhält ein Start- und ein Enddatum. Nach Ablauf verliert das Medium seine '
      + 'Gültigkeit, ohne dass jemand es zurückgeben muss.',
    points: [
      'Passend für Handwerk, Reinigung, Praktikum oder befristete Verträge',
      'Verhindert, dass alte Berechtigungen unbemerkt bestehen bleiben',
      'Der Ablauf wird bei der Einrichtung festgelegt und lässt sich später ändern',
    ],
    icon: CalendarClock,
  },
  {
    id: 'benutzerverwaltung',
    title: 'Benutzerverwaltung und Berechtigungsgruppen',
    body:
      'Nutzer werden zu Gruppen zusammengefasst — etwa Verwaltung, Werkstatt oder Reinigung. '
      + 'Berechtigungen werden an der Gruppe gepflegt, nicht an jeder einzelnen Person.',
    points: [
      'Neue Personen übernehmen die Rechte ihrer Gruppe',
      'Änderungen wirken auf alle Mitglieder gleichzeitig',
      'Die Gruppenstruktur sollte vor dem Aufbau der Anlage festgelegt werden',
    ],
    icon: UserCog,
  },
  {
    id: 'zeitprofile',
    title: 'Berechtigungen nach Wochentag oder Uhrzeit',
    body:
      'Zusätzlich zur Frage, wer eine Tür öffnen darf, lässt sich festlegen, wann. Ein Medium '
      + 'öffnet dann nur innerhalb der hinterlegten Zeitfenster.',
    points: [
      'Zum Beispiel Reinigung nur dienstags und donnerstags am Abend',
      'Zeitfenster je Tür und je Gruppe unterschiedlich möglich',
      'Feiertage und Ausnahmen sind je nach System gesondert zu pflegen',
    ],
    icon: Clock,
  },
  {
    id: 'sperren',
    title: 'Verlorene Karten und Transponder schnell sperren',
    body:
      'Geht ein Medium verloren, wird es gesperrt. Die Zylinder bleiben, wie sie sind — der '
      + 'Austausch ganzer Schließungen entfällt.',
    points: [
      'Ersatzmedium wird mit denselben Rechten ausgegeben',
      'Bei lokal verwalteten Anlagen muss die Sperre an die betroffenen Türen übertragen werden',
      'Bei online verwalteten Anlagen wirkt die Sperre unmittelbar',
    ],
    icon: Ban,
  },
  {
    id: 'protokoll',
    title: 'Ereignisprotokoll — optional',
    body:
      'Manche Systeme können festhalten, welches Medium wann an welcher Tür verwendet wurde. Diese '
      + 'Funktion ist optional und nur dort einsetzbar, wo System und Einsatzbereich das '
      + 'rechtmäßig zulassen.',
    points: [
      'Umfang und Aufbewahrungsdauer werden vor der Einrichtung festgelegt',
      'In vielen Objekten ist die Funktion nicht erforderlich und bleibt abgeschaltet',
      'Ob und wie protokolliert wird, entscheiden Sie als Betreiber',
    ],
    icon: FileText,
    wide: true,
  },
  {
    id: 'kombination',
    title: 'Kombination aus mechanischer und elektronischer Lösung',
    body:
      'Beide Welten lassen sich verbinden: elektronisch an den Türen mit wechselnden Nutzern, '
      + 'mechanisch überall dort, wo sich selten etwas ändert.',
    points: [
      'Häufig elektronisch an Haupteingang, Technik- und Lagerräumen',
      'Mechanisch an Innentüren mit festem Nutzerkreis',
      'Beide Teile werden gemeinsam geplant, damit die Schlüsselübersicht stimmig bleibt',
    ],
    icon: Blend,
  },
];

const PROTOCOL_HINT = {
  title: 'Protokollierung betrifft personenbezogene Daten',
  body:
    'Ein Ereignisprotokoll hält fest, welches Medium wann an welcher Tür verwendet wurde. Damit '
    + 'entstehen personenbezogene Daten. Für die zulässige Nutzung — Zweck, Umfang, '
    + 'Aufbewahrungsdauer und die Beteiligung betroffener Personen oder einer Interessenvertretung '
    + '— ist der Betreiber der Anlage verantwortlich.',
};

const MEDIA_HINT = {
  title: 'Welches Medium passt?',
  body:
    'Karte und Transponder sind unabhängig von Strom und Mobilfunk und für alle Nutzergruppen '
    + 'gleich bedienbar. Das Smartphone spart die Übergabe eines Gegenstands, setzt aber ein '
    + 'geeignetes Gerät voraus. PIN braucht gar kein Medium, dafür muss der Code vertraulich '
    + 'bleiben. In der Praxis werden häufig zwei Medien parallel geführt.',
};

const ADMIN_HINT = {
  title: 'Lokal oder online verwaltet',
  body:
    'Lokal verwaltet heißt: Berechtigungen werden mit einem Programmiergerät oder einem '
    + 'Mastermedium direkt an die Tür gebracht. Online verwaltet heißt: Die Türen sind mit einer '
    + 'Verwaltungsstelle verbunden, Änderungen und Sperren wirken ohne Gang zur Tür. Lokal ist '
    + 'einfacher und unabhängiger, online ist bei vielen Türen und häufigen Änderungen deutlich '
    + 'weniger Aufwand.',
};

const DECISION_ROWS = [
  {
    situation: 'Fester Nutzerkreis, selten Änderungen',
    mechanisch: 'Meist ausreichend und wartungsarm',
    elektronisch: 'Selten nötig',
  },
  {
    situation: 'Nutzer wechseln regelmäßig',
    mechanisch: 'Jeder Verlust kann einen Zylindertausch bedeuten',
    elektronisch: 'Medium sperren, Ersatz ausgeben — Zylinder bleiben',
  },
  {
    situation: 'Zutritt nur zu bestimmten Zeiten',
    mechanisch: 'Nicht abbildbar',
    elektronisch: 'Über Zeitfenster je Gruppe abbildbar',
  },
  {
    situation: 'Mehrere Liegenschaften',
    mechanisch: 'Getrennte Schließpläne je Objekt',
    elektronisch: 'Gemeinsame Verwaltung möglich',
  },
  {
    situation: 'Strom, Batterie und Netz unerwünscht',
    mechanisch: 'Klarer Vorteil',
    elektronisch: 'Nur eingeschränkt sinnvoll',
  },
];

const FALLBACK_FAQ = [
  {
    question: 'Muss ich für eine elektronische Lösung neue Türen einbauen?',
    answer:
      'In der Regel nicht. Digitale Zylinder ersetzen meist den vorhandenen Zylinder, '
      + 'elektronische Beschläge den vorhandenen Beschlag. Ob das bei Ihrer Tür funktioniert, '
      + 'hängt von Maßen, Schlossart und Türsituation ab. Das klären wir vor dem Angebot.',
  },
  {
    question: 'Was passiert, wenn eine Karte oder ein Transponder verloren geht?',
    answer:
      'Das Medium wird gesperrt und ein Ersatz mit denselben Rechten ausgegeben. Die Zylinder '
      + 'müssen dafür nicht getauscht werden. Bei lokal verwalteten Anlagen muss die Sperre an die '
      + 'betroffenen Türen übertragen werden, bei online verwalteten Anlagen wirkt sie unmittelbar.',
  },
  {
    question: 'Kann ich mechanische und elektronische Türen mischen?',
    answer:
      'Ja. Das ist sogar der häufigste Fall. Elektronisch werden die Türen ausgestattet, an denen '
      + 'sich der Nutzerkreis ändert; alle übrigen Türen bleiben mechanisch. Wichtig ist, beide '
      + 'Teile gemeinsam zu planen.',
  },
  {
    question: 'Werden Zutritte automatisch aufgezeichnet?',
    answer:
      'Nein. Ein Ereignisprotokoll ist eine optionale Funktion, die nicht in jedem System und '
      + 'nicht in jedem Einsatzbereich rechtmäßig genutzt werden kann. Ob protokolliert wird, '
      + 'entscheiden Sie als Betreiber; die Verantwortung für die zulässige Nutzung liegt bei Ihnen.',
  },
  {
    question: 'Was ist der Unterschied zwischen lokal und online verwalteten Systemen?',
    answer:
      'Bei lokal verwalteten Systemen bringen Sie Änderungen mit einem Programmiergerät oder einem '
      + 'Mastermedium an die jeweilige Tür. Bei online verwalteten Systemen sind die Türen mit '
      + 'einer Verwaltungsstelle verbunden, Änderungen und Sperren wirken ohne Gang zur Tür.',
  },
  {
    question: 'Was kostet eine elektronische Zutrittslösung?',
    answer:
      'Das hängt von der Anzahl der Türen und Nutzer, den gewählten Medien, der Verwaltungsart und '
      + 'dem Montageumfang ab. Erfassen Sie Ihr Vorhaben im Konfigurator — daraus erstellen wir ein '
      + 'Angebot mit nachvollziehbaren Positionen.',
  },
];

const RELATED_LINKS = [
  {
    href: '/elektronische-zutrittsloesungen/konfigurator',
    label: 'Zutrittskonfigurator',
    description: 'Acht Fragen zu Ihrem Objekt — daraus wird das Angebot.',
  },
  {
    href: '/schliessanlagen',
    label: 'Mechanische Schließanlagen',
    description: 'Gleichschließung, Zentralschloss, Haupt- und Generalhauptschlüssel.',
  },
  {
    href: '/ratgeber/mechanisch-oder-elektronisch',
    label: 'Ratgeber: mechanisch oder elektronisch?',
    description: 'Entscheidungshilfe anhand der Frage, wie oft sich etwas ändert.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    description: 'Mehrere Türen mit einem mechanischen Schlüssel.',
  },
  {
    href: '/tuer-und-schliesstechnik',
    label: 'Tür- und Schließtechnik',
    description: 'Zylinder, Schlösser, Beschläge und Türtechnik.',
  },
  {
    href: '/sicherheitstechnik',
    label: 'Sicherheitstechnik',
    description: 'Einbruchschutz, Überwachung und Alarmierung.',
  },
];

export default async function ElektronischeZutrittsloesungenPage() {
  const page = await getPageContent(ROUTE);
  const faq = page?.faq.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <PageHeader
        eyebrow={process.label}
        title={page?.headline ?? 'Elektronische Zutrittslösungen'}
        lead={page?.subline ?? 'Karte, Transponder, PIN, App und digitale Zylinder.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Elektronische Zutrittslösungen' }]}
        actions={
          <ButtonLink href={`/${ROUTE}/konfigurator`} size="lg">
            Bedarf erfassen
            <ArrowRight size={18} aria-hidden />
          </ButtonLink>
        }
      />

      {/* Einordnung */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
          <div>
            <p className="prose-sm24 max-w-2xl text-base">
              {page?.intro
                ?? 'Elektronische Zutrittslösungen ersetzen den mechanischen Schlüssel oder ergänzen '
                  + 'ihn. Verlorene Medien sperren Sie selbst — ohne die Zylinder zu tauschen.'}
            </p>

            <p className="prose-sm24 mt-4 max-w-2xl">
              Auf dieser Seite finden Sie die elf Bausteine, aus denen sich eine solche Lösung
              zusammensetzt. Sie müssen nicht alle davon nutzen: In vielen Objekten reichen zwei
              oder drei Bausteine aus. Welche das sind, klären wir anhand Ihrer Angaben im
              Konfigurator.
            </p>

            <div className="mt-6 rounded-lg border border-border bg-surface-muted p-4">
              <p className="text-[13px] font-bold text-foreground">{process.label}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                {process.hint}
              </p>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif:
                'Werkstattfoto: digitaler Zylinder und Transponder neben dem ausgebauten '
                + 'mechanischen Zylinder',
              ratio: '4/3',
              note: 'Echtes Foto aus der eigenen Werkstatt. Kein Stockfoto, kein Herstellerbild.',
            }}
          />
        </div>
      </Section>

      {/* Die elf Bausteine */}
      <Section tone="muted" id="bausteine">
        <SectionHeading
          eyebrow="Bausteine"
          title="Elf Bausteine einer elektronischen Zutrittslösung"
          lead="Jeder Baustein löst eine bestimmte Aufgabe. Erst die Kombination ergibt die Lösung für Ihr Objekt."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BLOCKS.map((block, index) => {
            const Icon = block.icon;
            return (
              <li
                key={block.id}
                id={block.id}
                className={block.wide ? 'sm:col-span-2 lg:col-span-3' : undefined}
              >
                <Card className="h-full">
                  <CardBody className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon size={19} aria-hidden />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                        Baustein {index + 1}
                      </span>
                      {block.id === 'rfid' && <InfoTip hint={MEDIA_HINT} />}
                      {block.id === 'sperren' && <InfoTip hint={ADMIN_HINT} />}
                    </div>

                    <h3 className="mt-4 text-[15px] font-bold text-foreground">{block.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                      {block.body}
                    </p>

                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-foreground-muted">
                      {block.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>

                    {block.id === 'protokoll' && (
                      <Alert tone="legal" title={PROTOCOL_HINT.title} className="mt-4">
                        <p>{PROTOCOL_HINT.body}</p>
                        <p className="mt-2">
                          Wie wir mit personenbezogenen Daten umgehen, steht in unserer{' '}
                          <Link
                            href="/rechtliches/datenschutz"
                            className="font-semibold text-primary hover:underline"
                          >
                            Datenschutzerklärung
                          </Link>
                          .
                        </p>
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Mechanisch oder elektronisch */}
      <Section id="mechanisch-oder-elektronisch">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Entscheidungshilfe"
              title="Mechanisch oder elektronisch?"
              lead="Die Antwort hängt weniger am Objekt als an einer Frage: Wie oft ändert sich, wer hineindarf?"
            />

            <p className="prose-sm24 mt-5">
              Bleibt der Nutzerkreis über Jahre gleich, ist eine mechanische Anlage robust,
              wartungsarm und unabhängig von Strom und Netz. Wechseln Personen regelmäßig, kostet
              jeder Verlust bei Mechanik Zylinder und Schlüssel — elektronisch kostet er eine
              Sperrung. Deshalb ist die Mischung aus beidem in der Praxis häufig die sachlich
              richtige Lösung.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/ratgeber/mechanisch-oder-elektronisch" variant="outline">
                Zum Ratgeber
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/schliessanlagen" variant="outline">
                Mechanische Schließanlagen
              </ButtonLink>
            </div>
          </div>

          <div className="table-scroll">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only">
                Vergleich mechanischer und elektronischer Lösungen nach Situation
              </caption>
              <thead>
                <tr className="border-b border-border-strong">
                  <th scope="col" className="py-2.5 pr-4 text-[13px] font-bold text-foreground">
                    Situation
                  </th>
                  <th scope="col" className="py-2.5 pr-4 text-[13px] font-bold text-foreground">
                    Mechanisch
                  </th>
                  <th scope="col" className="py-2.5 text-[13px] font-bold text-foreground">
                    Elektronisch
                  </th>
                </tr>
              </thead>
              <tbody>
                {DECISION_ROWS.map((row) => (
                  <tr key={row.situation} className="border-b border-border align-top">
                    <th
                      scope="row"
                      className="py-3 pr-4 text-[13px] font-semibold leading-relaxed text-foreground"
                    >
                      {row.situation}
                    </th>
                    <td className="py-3 pr-4 text-[13px] leading-relaxed text-foreground-muted">
                      {row.mechanisch}
                    </td>
                    <td className="py-3 text-[13px] leading-relaxed text-foreground-muted">
                      {row.elektronisch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="So geht es weiter"
              title="Vom Bedarf zum Angebot"
              lead="Der Konfigurator stellt acht Fragen zu Ihrem Objekt. Sie können jederzeit unterbrechen — Ihre Angaben bleiben im Browser gespeichert."
            />

            <ol className="mt-7 space-y-3 text-[14px] leading-relaxed text-foreground-muted">
              <li>
                <span className="font-semibold text-foreground">Bedarf erfassen.</span> Objekt,
                Umfang, Medien, Verwaltung, Berechtigungen, Standorte, Integration und Service.
              </li>
              <li>
                <span className="font-semibold text-foreground">Prüfen.</span> Wir schauen uns die
                Türsituation an und sagen Ihnen, was technisch möglich ist.
              </li>
              <li>
                <span className="font-semibold text-foreground">Angebot.</span> Sie erhalten eine
                Aufstellung mit nachvollziehbaren Positionen.
              </li>
            </ol>

            <div className="mt-7">
              <ButtonLink href={`/${ROUTE}/konfigurator`} size="lg">
                Bedarf erfassen
                <ArrowRight size={18} aria-hidden />
              </ButtonLink>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif:
                'Schemazeichnung: Türenübersicht eines Objekts mit Kennzeichnung elektronisch und '
                + 'mechanisch ausgestatteter Türen',
              ratio: '3/2',
              note: 'Technische Zeichnung, keine Fotomontage.',
            }}
          />
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Was Kundinnen und Kunden vorab wissen wollen"
        />
        <Accordion items={faq} className="mt-8" />
      </Section>

      {/* Interne Verlinkung */}
      <Section tone="muted" tight>
        <SectionHeading eyebrow="Weiterlesen" title="Passende Bereiche" />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1.5 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                  {link.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Ansehen
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[13px] leading-relaxed text-foreground-muted">
          <Building2 size={14} className="mr-1.5 inline align-[-2px]" aria-hidden />
          Sie sind unsicher, ob Ihr Vorhaben hierher gehört?{' '}
          <Link
            href="/service-und-termin/anfrage"
            className="font-semibold text-primary hover:underline"
          >
            Allgemeine Anfrage stellen
          </Link>{' '}
          — wir ordnen es für Sie ein.
        </p>
      </Section>
    </>
  );
}
