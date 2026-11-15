import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getPageContent, getRubrik } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { ZutrittSignalGrafik } from '@/components/visual/generators/zutritt-signal';
import { GlyphGebaeude } from '@/components/visual/glyphen/gebaeude';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphPersonen } from '@/components/visual/glyphen/personen';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphRaute } from '@/components/visual/glyphen/raute';
import { GlyphUhr } from '@/components/visual/glyphen/uhr';
import { GlyphVerbot } from '@/components/visual/glyphen/verbot';
import { IconKombinierteKonzepte } from '@/components/visual/icons/kombinierte-konzepte';
import { IconNachweis } from '@/components/visual/icons/nachweis';
import { IconProfilzylinder } from '@/components/visual/icons/profilzylinder';
import { IconSchutzbeschlag } from '@/components/visual/icons/schutzbeschlag';
import { IconSmarteFunktionen } from '@/components/visual/icons/smarte-funktionen';
import { IconTermin } from '@/components/visual/icons/termin';
import { IconTransponder } from '@/components/visual/icons/transponder';

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

/** Fach-Icon oder Glyph eines Bausteins: beide nehmen `size` und `className`. */
type BausteinIcon = ComponentType<{ size?: number; className?: string }>;

/* Die elf Bausteine einer elektronischen Zutrittslösung — je Baustein wird
   erklärt, was er leistet und wann er sinnvoll ist. */
interface BuildingBlock {
  id: string;
  title: string;
  body: string;
  points: string[];
  icon: BausteinIcon;
  /** Fach-Icons 40 px, Glyphen 24 px (KERN K-008a). */
  iconSize: 24 | 40;
  /** Baustein über zwei Spalten, wenn er zusätzlichen Hinweis trägt. */
  wide?: boolean;
}

const BLOCKS: BuildingBlock[] = [
  {
    id: 'rfid',
    title: 'RFID-Transponder und Zutrittskarten',
    body:
      'RFID heißt, dass ein Chip per Funk gelesen wird. Sie halten eine Karte oder einen '
      + 'Transponder, also einen kleinen Anhänger mit Chip, vor einen Leser. Der Leser prüft, ob '
      + 'Sie hinein dürfen. Das Medium hat keinen Bart und lässt sich nicht nachfeilen.',
    points: [
      'Karten im Scheckkartenformat, Schlüsselanhänger oder Aufkleber',
      'Ein Medium kann mehrere Türen öffnen, ohne dass Schlüssel dazukommen',
      'Ausgeben und Entziehen erledigen Sie in der Verwaltung, nicht an der Tür',
    ],
    icon: IconTransponder,
    iconSize: 40,
  },
  {
    id: 'smartphone',
    title: 'Smartphone- und App-Steuerung',
    body:
      'Die Berechtigung liegt in einer App auf dem Smartphone. Das ist praktisch, wenn jemand '
      + 'kurzfristig hinein muss und Sie keine Karte übergeben können.',
    points: [
      'Keine Übergabe eines Gegenstands nötig',
      'Setzt voraus, dass alle Beteiligten ein geeignetes Gerät haben und bedienen wollen',
      'Sinnvoll als Ergänzung, selten als einziges Medium',
    ],
    icon: IconSmarteFunktionen,
    iconSize: 40,
  },
  {
    id: 'pin',
    title: 'PIN-Code und Tastatur',
    body:
      'Sie tippen eine Zahlenfolge an einer Tastatur ein. Mitnehmen müssen Sie nichts. Dafür muss '
      + 'der Code bekannt sein und geheim bleiben.',
    points: [
      'Gut für Räume mit wechselnden, kurz anwesenden Personen',
      'Codes sollten je Person oder Gruppe vergeben und regelmäßig gewechselt werden',
      'Häufig in Kombination mit Karte oder Transponder eingesetzt',
    ],
    icon: GlyphRaute,
    iconSize: 24,
  },
  {
    id: 'digitale-zylinder',
    title: 'Digitale Zylinder',
    body:
      'Ein digitaler Zylinder kommt statt des mechanischen Zylinders in Ihre vorhandene Tür. Erst '
      + 'wenn er ein berechtigtes Medium erkennt, etwa eine Karte oder einen Transponder, können '
      + 'Sie mit dem Knauf schließen.',
    points: [
      'In der Regel ohne Kabel und ohne Eingriff in das Türblatt',
      'Maße der Tür und die vorhandene Beschlagsituation entscheiden über die Auswahl',
      'Läuft mit Batterie, deshalb gehört der Batteriewechsel in die Planung',
    ],
    icon: IconProfilzylinder,
    iconSize: 40,
  },
  {
    id: 'beschlaege',
    title: 'Elektronische Beschläge und Smart Locks',
    body:
      'Hier wird nicht der Zylinder getauscht, sondern der Beschlag mit dem ganzen Griffbereich. '
      + 'Das ist sinnvoll, wenn Sie zum Leser auch einen anderen Griff oder einen Schutzbeschlag '
      + 'brauchen.',
    points: [
      'Leser und Griff bilden eine Einheit',
      'Ob er passt, hängt von Türstärke, Schlossart und Dornmaß ab, dem Abstand von der Türkante zur Mitte des Zylinders',
      'Bei Brand- und Fluchttüren gelten besondere Anforderungen an die Ausführung',
    ],
    icon: IconSchutzbeschlag,
    iconSize: 40,
  },
  {
    id: 'zeitlich-begrenzt',
    title: 'Zeitlich begrenzte Zugangsberechtigungen',
    body:
      'Eine Berechtigung bekommt ein Start- und ein Enddatum. Danach öffnet das Medium nicht mehr, '
      + 'auch wenn niemand es zurückgegeben hat.',
    points: [
      'Passend für Handwerk, Reinigung, Praktikum oder befristete Verträge',
      'Verhindert, dass alte Berechtigungen unbemerkt bestehen bleiben',
      'Der Ablauf wird bei der Einrichtung festgelegt und lässt sich später ändern',
    ],
    icon: IconTermin,
    iconSize: 40,
  },
  {
    id: 'benutzerverwaltung',
    title: 'Benutzerverwaltung und Berechtigungsgruppen',
    body:
      'Sie fassen Nutzer zu Gruppen zusammen, etwa Verwaltung, Werkstatt oder Reinigung. Die '
      + 'Rechte pflegen Sie dann für die Gruppe, nicht für jede einzelne Person.',
    points: [
      'Neue Personen übernehmen die Rechte ihrer Gruppe',
      'Änderungen wirken auf alle Mitglieder gleichzeitig',
      'Die Gruppenstruktur sollte vor dem Aufbau der Anlage festgelegt werden',
    ],
    icon: GlyphPersonen,
    iconSize: 24,
  },
  {
    id: 'zeitprofile',
    title: 'Berechtigungen nach Wochentag oder Uhrzeit',
    body:
      'Sie legen nicht nur fest, wer eine Tür öffnen darf, sondern auch wann. Ein Medium öffnet '
      + 'dann nur in den hinterlegten Zeitfenstern.',
    points: [
      'Zum Beispiel Reinigung nur dienstags und donnerstags am Abend',
      'Zeitfenster je Tür und je Gruppe unterschiedlich möglich',
      'Feiertage und Ausnahmen sind je nach System gesondert zu pflegen',
    ],
    icon: GlyphUhr,
    iconSize: 24,
  },
  {
    id: 'sperren',
    title: 'Verlorene Karten und Transponder schnell sperren',
    body:
      'Geht eine Karte oder ein Transponder verloren, wird das Medium gesperrt. Die Zylinder '
      + 'bleiben, wie sie sind. Ganze Schließungen müssen Sie nicht austauschen.',
    points: [
      'Ersatzmedium wird mit denselben Rechten ausgegeben',
      'Bei lokal verwalteten Anlagen muss die Sperre an die betroffenen Türen übertragen werden',
      'Bei online verwalteten Anlagen wirkt die Sperre sofort',
    ],
    icon: GlyphVerbot,
    iconSize: 24,
  },
  {
    id: 'protokoll',
    title: 'Ereignisprotokoll (optional)',
    body:
      'Manche Systeme können festhalten, welches Medium wann an welcher Tür verwendet wurde. Diese '
      + 'Funktion ist optional und nur dort einsetzbar, wo System und Einsatzbereich das '
      + 'rechtmäßig zulassen.',
    points: [
      'Umfang und Aufbewahrungsdauer werden vor der Einrichtung festgelegt',
      'In vielen Objekten ist die Funktion nicht erforderlich und bleibt abgeschaltet',
      'Ob und wie protokolliert wird, entscheiden Sie als Betreiber',
    ],
    icon: IconNachweis,
    iconSize: 40,
    wide: true,
  },
  {
    id: 'kombination',
    title: 'Kombination aus mechanischer und elektronischer Lösung',
    body:
      'Sie können beides verbinden. Türen, an denen die Nutzer oft wechseln, bekommen eine '
      + 'elektronische Lösung. Wo sich selten etwas ändert, bleibt es beim mechanischen Schlüssel.',
    points: [
      'Häufig elektronisch an Haupteingang, Technik- und Lagerräumen',
      'Mechanisch an Innentüren mit festem Nutzerkreis',
      'Wir planen beide Teile zusammen, damit die Übersicht über alle Schlüssel und Medien stimmt',
    ],
    icon: IconKombinierteKonzepte,
    iconSize: 40,
  },
];

/**
 * Spalte je Baustein, wie das CSS-Raster sie setzt: Die Zeilen füllen sich von links,
 * der breite Baustein belegt zwei Spalten. Daraus folgen die senkrechten Haarlinien.
 */
function spaltenStart(spalten: number, breiteWide: number): number[] {
  const starts: number[] = [];
  let spalte = 0;
  for (const block of BLOCKS) {
    const breite = block.wide ? breiteWide : 1;
    if (spalte + breite > spalten) spalte = 0;
    starts.push(spalte);
    spalte = (spalte + breite) % spalten;
  }
  return starts;
}

const SPALTE_AB_SM = spaltenStart(2, 1);
const SPALTE_AB_LG = spaltenStart(3, 2);

const PROTOCOL_HINT = {
  title: 'Protokollierung betrifft personenbezogene Daten',
  body:
    'Ein Ereignisprotokoll hält fest, welches Medium wann an welcher Tür verwendet wurde. Damit '
    + 'entstehen personenbezogene Daten. Für die zulässige Nutzung ist der Betreiber der Anlage '
    + 'verantwortlich. Dazu gehören Zweck, Umfang, Aufbewahrungsdauer und die Beteiligung '
    + 'betroffener Personen oder einer Interessenvertretung.',
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
    'Lokal verwaltet heißt, dass Sie Berechtigungen direkt an der Tür übertragen. Dafür nutzen Sie '
    + 'ein Programmiergerät oder ein Mastermedium, also eine Karte mit Verwaltungsrechten. Online '
    + 'verwaltet heißt, dass die Türen mit einer Verwaltungsstelle verbunden sind. Änderungen und '
    + 'Sperren wirken dann, ohne dass jemand zur Tür geht. Lokal ist einfacher und unabhängiger. '
    + 'Online macht bei vielen Türen und häufigen Änderungen deutlich weniger Arbeit.',
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
    elektronisch: 'Medium sperren und Ersatz ausgeben, die Zylinder bleiben',
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
      'In der Regel nicht. Ein digitaler Zylinder ersetzt meist den vorhandenen Zylinder, ein '
      + 'elektronischer Beschlag den vorhandenen Beschlag. Ob das bei Ihrer Tür geht, hängt von '
      + 'Maßen, Schlossart und Einbau ab. Das klären wir vor dem Angebot.',
  },
  {
    question: 'Was passiert, wenn eine Karte oder ein Transponder verloren geht?',
    answer:
      'Das Medium wird gesperrt, und Sie bekommen Ersatz mit denselben Rechten. Die Zylinder '
      + 'müssen dafür nicht getauscht werden. Bei lokal verwalteten Anlagen muss die Sperre an die '
      + 'betroffenen Türen übertragen werden. Bei online verwalteten Anlagen wirkt sie sofort.',
  },
  {
    question: 'Kann ich mechanische und elektronische Türen mischen?',
    answer:
      'Ja, das kommt oft vor. Türen, an denen die Nutzer wechseln, bekommen eine elektronische '
      + 'Lösung. Alle übrigen Türen bleiben mechanisch. Wichtig ist, beide Teile zusammen zu planen.',
  },
  {
    question: 'Werden Zutritte automatisch aufgezeichnet?',
    answer:
      'Nein. Ein Ereignisprotokoll ist eine optionale Funktion. Sie lässt sich nicht in jedem '
      + 'System und nicht in jedem Einsatzbereich rechtmäßig nutzen. Ob protokolliert wird, '
      + 'entscheiden Sie als Betreiber. Die Verantwortung für die zulässige Nutzung liegt bei Ihnen.',
  },
  {
    question: 'Was ist der Unterschied zwischen lokal und online verwalteten Systemen?',
    answer:
      'Bei lokal verwalteten Systemen bringen Sie Änderungen mit einem Programmiergerät oder einem '
      + 'Mastermedium an die jeweilige Tür. Bei online verwalteten Systemen sind die Türen mit '
      + 'einer Verwaltungsstelle verbunden. Änderungen und Sperren wirken dann ohne Gang zur Tür.',
  },
  {
    question: 'Was kostet eine elektronische Zutrittslösung?',
    answer:
      'Das hängt von der Zahl der Türen und Nutzer ab, von den Medien, der Art der Verwaltung und '
      + 'dem Aufwand für die Montage. Erfassen Sie Ihr Vorhaben im Konfigurator. Daraus erstellen '
      + 'wir ein Angebot mit nachvollziehbaren Positionen.',
  },
];

const RELATED_LINKS = [
  {
    href: '/elektronische-zutrittsloesungen/konfigurator',
    label: 'Zutrittskonfigurator',
    description: 'Acht Fragen zu Ihrem Objekt. Daraus erstellen wir das Angebot.',
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
  // Rubrik dieser Seite: Ziel des Übergangs aus der Hub-Kachel (B-35)
  const rubrik = await getRubrik('elektronische-schliesssysteme');
  const page = await getPageContent(ROUTE);
  const faq = page?.faq.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Elektronische Zutrittslösungen',
          description: page?.seo.description,
          crumbs: [{ href: `/${ROUTE}`, label: 'Elektronische Zutrittslösungen' }],
          faq: faq,
        })}
      />

      {/* Großer Moment: Medium, Funk, Leser und Freigabe; die Bewegung steckt im Generator. */}
      <PageHeader
        rubrik={rubrik}
        eyebrow={process.label}
        title={page?.headline ?? 'Elektronische Zutrittslösungen'}
        lead={page?.subline ?? 'Zutritt mit Karte, Transponder, PIN, App oder digitalem Zylinder. Wir planen die Lösung für Ihr Objekt und richten sie ein.'}
        crumbs={[{ href: `/${ROUTE}`, label: 'Elektronische Zutrittslösungen' }]}
        bereich="elektronische-zutrittsloesungen"
        visual={
          <ZutrittSignalGrafik
            params={{ medium: 'transponder' }}
            title="Zeichnung: Transponder öffnet eine Tür mit Leser"
          />
        }
        actions={
          <ButtonLink href={`/${ROUTE}/konfigurator`} size="lg" pfeil>
            Bedarf erfassen
          </ButtonLink>
        }
      />

      {/* Einordnung */}
      <Section tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <p className="prose-sm24 max-w-2xl text-body">
              {page?.intro
                ?? 'Eine elektronische Zutrittslösung ersetzt den mechanischen Schlüssel oder ergänzt '
                  + 'ihn. Geht eine Karte oder ein Transponder verloren, sperren Sie das Medium '
                  + 'selbst. Die Zylinder müssen Sie dafür nicht tauschen.'}
            </p>

            <p className="prose-sm24 mt-4 max-w-2xl">
              Hier finden Sie die elf Bausteine, aus denen sich eine solche Lösung zusammensetzt.
              Sie brauchen nicht alle. In vielen Objekten reichen zwei oder drei. Welche das sind,
              klären wir mit Ihren Angaben aus dem Konfigurator.
            </p>

            <div className="mt-6 rounded-lg border border-border bg-surface-muted p-4">
              <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                {process.label}
              </p>
              <p className="mt-1 text-small text-foreground-muted">{process.hint}</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ImagePlaceholder
              slot={{
                motif:
                  'Werkstattfoto: digitaler Zylinder und Transponder neben dem ausgebauten '
                  + 'mechanischen Zylinder',
                ratio: '4/3',
                note: 'Echtes Foto aus der eigenen Werkstatt. Kein Stockfoto, kein Herstellerbild.',
                visual: { generator: 'zutritt-signal', params: { medium: 'karte' } },
              }}
            />
          </div>
        </div>
      </Section>

      {/* Die elf Bausteine */}
      <Section tone="muted" id="bausteine">
        <SectionHeading
          nummer="01"
          eyebrow="Bausteine"
          title="Elf Bausteine einer elektronischen Zutrittslösung"
          lead="Jeder Baustein löst eine Aufgabe. Zusammen ergeben sie die Lösung für Ihr Objekt."
          className="sm24-reveal"
        />

        {/* Haarlinien wie im Leistungsportfolio der Türtechnik; mobil eine Spalte */}
        <ul className="mt-12 grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {BLOCKS.map((block, index) => {
            const Icon = block.icon;
            const sm = SPALTE_AB_SM[index] > 0;
            const lg = SPALTE_AB_LG[index] > 0;
            return (
              <li
                key={block.id}
                id={block.id}
                className={cn(
                  'border-b border-border',
                  block.wide && 'lg:col-span-2',
                  block.id === 'kombination' && 'sm:col-span-2 lg:col-span-1',
                  sm && 'sm:border-l',
                  sm && !lg && 'lg:border-l-0',
                  lg && 'lg:border-l',
                )}
              >
                <div className="flex h-full flex-col py-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center text-area-strong">
                      <Icon size={block.iconSize} />
                    </span>
                    <span className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      Baustein {index + 1}
                    </span>
                    {block.id === 'rfid' && <InfoTip hint={MEDIA_HINT} />}
                    {block.id === 'sperren' && <InfoTip hint={ADMIN_HINT} />}
                  </div>

                  <h3 className="mt-6 text-title-sm font-semibold text-foreground">{block.title}</h3>
                  <p className="mt-2 text-small text-foreground-muted">{block.body}</p>

                  <ul className="mt-4 space-y-2 text-small text-foreground-muted">
                    {block.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <GlyphHaken size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </li>
            );
          })}
        </ul>

        {/* Hinweis zu Baustein 10 unter der Liste: In der Zelle machte er sie mehr als
            doppelt so hoch wie ihre Nachbarin, auf dem Tablet blieb daneben eine Lücke. */}
        <Alert tone="legal" title={PROTOCOL_HINT.title} className="mt-8 max-w-measure">
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
      </Section>

      {/* Mechanisch oder elektronisch */}
      <Section id="mechanisch-oder-elektronisch">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              nummer="02"
              eyebrow="Entscheidungshilfe"
              title="Mechanisch, elektronisch oder beides"
              lead="Das hängt weniger vom Objekt ab als davon, wie oft sich ändert, wer hinein darf."
            />

            <p className="prose-sm24 mt-5">
              Bleiben die Nutzer über Jahre gleich, ist eine mechanische Anlage robust und
              wartungsarm. Sie braucht weder Strom noch Netz. Wechseln die Personen regelmäßig,
              kostet bei Mechanik jeder Verlust neue Zylinder und Schlüssel. Elektronisch sperren
              Sie nur das verlorene Medium. Deshalb ist eine Mischung aus beidem in der Praxis oft
              die richtige Lösung.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/ratgeber/mechanisch-oder-elektronisch" variant="outline" pfeil>
                Zum Ratgeber
              </ButtonLink>
              <ButtonLink href="/schliessanlagen" variant="outline">
                Mechanische Schließanlagen
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Ab md die Tabelle; darunter dieselben Daten als gestapelte Zeilen. */}
            <table className="hidden w-full border-collapse text-left md:table">
              <caption className="sr-only">
                Vergleich mechanischer und elektronischer Lösungen nach Situation
              </caption>
              <thead>
                <tr className="border-b border-border-strong">
                  <th scope="col" className="py-2.5 pr-4 font-mono text-caption uppercase tracking-label text-foreground-muted">
                    Situation
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-mono text-caption uppercase tracking-label text-foreground-muted">
                    Mechanisch
                  </th>
                  <th scope="col" className="py-2.5 font-mono text-caption uppercase tracking-label text-foreground-muted">
                    Elektronisch
                  </th>
                </tr>
              </thead>
              <tbody>
                {DECISION_ROWS.map((row) => (
                  <tr key={row.situation} className="border-b border-border align-top">
                    <th
                      scope="row"
                      className="py-3 pr-4 text-small font-semibold text-foreground"
                    >
                      {row.situation}
                    </th>
                    <td className="py-3 pr-4 text-small text-foreground-muted">
                      {row.mechanisch}
                    </td>
                    <td className="py-3 text-small text-foreground-muted">
                      {row.elektronisch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className="border-t border-border md:hidden">
              {DECISION_ROWS.map((row) => (
                <div key={row.situation} className="border-b border-border py-5">
                  <dt className="text-title-sm font-semibold text-foreground">{row.situation}</dt>
                  <dd className="mt-3 text-small text-foreground-muted">
                    <span className="block font-mono text-caption uppercase tracking-label text-foreground-muted">
                      Mechanisch
                    </span>
                    {row.mechanisch}
                  </dd>
                  <dd className="mt-2 text-small text-foreground-muted">
                    <span className="block font-mono text-caption uppercase tracking-label text-foreground-muted">
                      Elektronisch
                    </span>
                    {row.elektronisch}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* Ablauf */}
      {/* Gegenstück zu 02: Zeichnung links, Schritte als nummerierte Stückliste rechts */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <SectionHeading
              nummer="03"
              eyebrow="So läuft Ihr Auftrag ab"
              title="Vom Bedarf zum Angebot"
              lead="Der Konfigurator stellt acht Fragen zu Ihrem Objekt. Sie können jederzeit unterbrechen. Ihre Angaben bleiben im Browser gespeichert."
            />

            {/* Ablauf aus den Rubrikdaten (G-10, G-11) */}
            {rubrik && <RubrikAblauf rubrik={rubrik} variante="liste" className="mt-7" />}

            <div className="mt-7">
              <ButtonLink href={`/${ROUTE}/konfigurator`} size="lg" pfeil>
                Bedarf erfassen
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <ImagePlaceholder
              slot={{
                motif:
                  'Schemazeichnung: Türenübersicht eines Objekts mit Kennzeichnung elektronisch und '
                  + 'mechanisch ausgestatteter Türen',
                ratio: '3/2',
                note: 'Technische Zeichnung, keine Fotomontage.',
                visual: { generator: 'zutritt-signal', params: { medium: 'smartphone' } },
              }}
            />
          </div>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading
          nummer="04"
          eyebrow="Häufige Fragen"
          title="Häufige Fragen zu elektronischen Zutrittslösungen"
        />
        <Accordion items={faq} className="mt-8" />
      </Section>

      {/* Interne Verlinkung: Haarlinienliste, die ganze Zeile ist der Link */}
      <Section tone="muted" tight>
        <SectionHeading nummer="05" eyebrow="Weiterlesen" title="Passende Bereiche" />

        <ul className="mt-8 border-t border-border">
          {RELATED_LINKS.map((link, index) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex items-center gap-4 py-5 transition-colors duration-quick sm:gap-6 sm:py-6"
              >
                <span className="hidden w-8 shrink-0 font-mono text-caption tabular-nums text-foreground-muted sm:block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-small text-foreground-muted">
                    {link.description}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-small font-semibold text-primary">
                  Ansehen
                  <GlyphPfeilRechts
                    size={16}
                    className="transition-transform duration-quick group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 flex gap-2 text-small text-foreground-muted">
          <GlyphGebaeude size={16} className="mt-0.5 shrink-0" />
          <span>
            Passt Ihr Vorhaben nicht genau hierher, stellen Sie eine{' '}
            <Link
              href="/service-und-termin/anfrage"
              className="font-semibold text-primary hover:underline"
            >
              allgemeine Anfrage
            </Link>
            . Wir ordnen es für Sie ein.
          </span>
        </p>
      </Section>
    </>
  );
}
