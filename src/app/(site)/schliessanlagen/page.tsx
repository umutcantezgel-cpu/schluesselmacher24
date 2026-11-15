import type { Metadata } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { getCodeLines, getPageContent, getRubrik } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { SpaetVorladen } from '@/lib/spaet-vorladen';
import type { InfoHint } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { InfoTip } from '@/components/ui/info-tip';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { NachbestellenAbschnitt, sicherungskartenLinie } from '@/components/schliessung/nachbestellen';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { ErweiterbareAnlage, SystemVergleich, systemReiter } from '@/components/schliessanlagen/system-erklaerung';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { IconEinsteckschloss } from '@/components/visual/icons/einsteckschloss';
import type { IconProps } from '@/components/visual/icons/icon-base';
import { IconPruefung } from '@/components/visual/icons/pruefung';
import { GlyphGebaeude } from '@/components/visual/glyphen/gebaeude';
import { GlyphPersonen } from '@/components/visual/glyphen/personen';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { SchliessplanInteraktiv } from '@/components/visual/interaktiv/schliessplan-interaktiv';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'schliessanlagen';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Mechanische Schließanlagen planen',
    description:
      page?.seo.description
      ?? 'Gleichschließung, Zentralschlossanlage, Hauptschlüsselanlage und '
        + 'Generalhauptschlüsselanlage — in einfacher Sprache erklärt und im Konfigurator erfassbar.',
    alternates: { canonical: '/schliessanlagen' },
  };
}

/** Begriffe, die auf dieser Seite immer wieder vorkommen. */
const GLOSSARY: { term: string; summary: string; hint: InfoHint }[] = [
  {
    term: 'Schließstelle',
    summary: 'Jede Stelle, an der geschlossen wird. Meist ist das ein Zylinder in einer Tür.',
    hint: {
      title: 'Schließstelle',
      body:
        'Eine Schließstelle ist ein Punkt, an dem ein Zylinder oder ein Schloss sitzt. Eine Tür '
        + 'mit einem Zylinder ist eine Schließstelle. Eine doppelflügelige Tür mit zwei Zylindern '
        + 'sind zwei. Auch Briefkästen, Schränke, Schranken oder Vorhangschlösser zählen mit, '
        + 'wenn sie in die Anlage aufgenommen werden sollen.',
      figure: {
        motif: 'Schemazeichnung Grundriss mit markierten Schließstellen an Türen und Nebenstellen',
        ratio: '4/3',
      },
    },
  },
  {
    term: 'Schließplan',
    summary: 'Die Tabelle, in der steht, welcher Schlüssel welche Tür öffnet.',
    hint: {
      title: 'Schließplan',
      body:
        'Der Schließplan ist eine Tabelle. In den Zeilen stehen die Türen, in den Spalten die '
        + 'Schlüssel. Ein Kreuz heißt, dass dieser Schlüssel diese Tür öffnet. Wir stimmen den Plan '
        + 'vor der Fertigung mit Ihnen ab. Danach ist er die Grundlage der Anlage.',
      figure: {
        motif: 'Schemazeichnung Schließplan: Raster aus Türen, Schlüsseln und Kreuzen',
        ratio: '16/9',
      },
    },
  },
  {
    term: 'Sicherungskarte',
    summary: 'Ein Nachweis, meist eine Karte. Nur damit lassen sich Schlüssel für eine bestehende Anlage nachbestellen.',
    hint: {
      title: 'Sicherungskarte',
      body:
        'Zu vielen Anlagen gehört eine Karte oder ein anderes Dokument als Nachweis. Nur wer diesen '
        + 'Nachweis vorlegt, kann weitere Schlüssel für die Anlage bestellen. Finden Sie die Karte '
        + 'nicht, sagen Sie uns das im Konfigurator. Wir prüfen dann, welche Wege es gibt.',
      figure: {
        motif: 'Schemazeichnung Sicherungskarte mit Anlagennummer, neutral ohne Herstellerbezug',
        ratio: '3/2',
      },
    },
  },
];

/** Zeichen des Bereichs Schließanlagen für die Zeile „Mehrere Gebäude“. */
function BereichsZeichen(props: IconProps) {
  return <BereichIcon area="schliessanlagen" {...props} />;
}

const AUDIENCES: { icon: ComponentType<IconProps>; title: string; body: string; href: string; linkLabel: string }[] = [
  {
    icon: IconEinsteckschloss,
    title: 'Privat',
    body:
      'Haus oder Wohnung mit Nebentüren wie Keller, Garage, Gartentor oder Briefkasten. Meist '
      + 'genügt eine Gleichschließung mit einem Schlüssel für alles.',
    href: '/gleichschliessende-zylinder',
    linkLabel: 'Zu den gleichschließenden Zylindern',
  },
  {
    icon: GlyphGebaeude,
    title: 'Gewerbe',
    body:
      'Büro, Werkstatt, Lager oder Serverraum. Nicht jede Person braucht jede Tür. Bei einer '
      + 'Hauptschlüsselanlage (HS) öffnet jeder Schlüssel nur die Türen, für die sein Nutzer zuständig ist.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Schließanlage konfigurieren',
  },
  {
    icon: GlyphPersonen,
    title: 'Hausverwaltung',
    body:
      'Mehrere Parteien teilen sich Türen wie Hauseingang und Keller, und Mieter wechseln. Bei '
      + 'einer Zentralschlossanlage (Z) öffnet jeder Schlüssel die eigene Wohnung und die '
      + 'gemeinsamen Türen.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Schließanlage konfigurieren',
  },
  {
    icon: IconPruefung,
    title: 'Öffentliche Einrichtung',
    body:
      'Schule, Verwaltung oder Einrichtung mit Publikumsverkehr. Hier gibt es viele Bereiche mit '
      + 'klar getrennten Zuständigkeiten. Ein Schließplan hält nachvollziehbar fest, wer wohin darf.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Schließanlage konfigurieren',
  },
  {
    icon: BereichsZeichen,
    title: 'Mehrere Liegenschaften',
    body:
      'Mehrere Standorte oder eine größere Liegenschaft. Bei einer Generalhauptschlüsselanlage '
      + '(GHS) hat jedes Gebäude einen eigenen Hauptschlüssel. Der Generalhauptschlüssel öffnet alle.',
    href: '/schliessanlagen/konfigurator',
    linkLabel: 'Schließanlage konfigurieren',
  },
];

/** Weiterführende Seiten: Stückliste mit Haarlinien, die ganze Zeile ist der Link. */
const WEITERFUEHREND = [
  {
    href: '/schliessanlagen/konfigurator',
    label: 'Projektkonfigurator',
    body: 'Zehn Frageblöcke zu Objekt, Nutzern, Türen und Berechtigungen.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    body: 'Für kleine Vorhaben ohne Berechtigungsstufen.',
  },
  {
    href: '/elektronische-zutrittsloesungen',
    label: 'Elektronische Zutrittslösungen',
    body: 'Wenn Rechte änderbar sein sollen, ohne Zylinder zu tauschen.',
  },
  {
    href: '/tuer-und-schliesstechnik',
    label: 'Tür- und Schließtechnik',
    body: 'Zylinder, Schlösser und Beschläge rund um die Tür.',
  },
  {
    href: '/ratgeber/welche-schliessanlage-passt',
    label: 'Welche Anlage passt?',
    body: 'Entscheidungshilfe im Ratgeber.',
  },
  {
    href: '/service-und-termin/kontakt',
    label: 'Kontakt',
    body: 'Wenn Sie vor der Erfassung eine Frage klären möchten.',
  },
];

/** Fällt nur ein, solange in der Datenschicht keine Fragen gepflegt sind. */
const FALLBACK_FAQ = [
  {
    question: 'Muss ich die Abkürzungen Z, HS und GHS kennen, bevor ich anfrage?',
    answer:
      'Nein. Im Konfigurator beschreiben Sie Ihr Objekt und wer welche Tür öffnen soll. Daraus '
      + 'machen wir einen Vorschlag für das passende System und besprechen ihn mit Ihnen.',
  },
  {
    question: 'Was ist der Unterschied zwischen einer Gleichschließung und einer Schließanlage?',
    answer:
      'Bei einer Gleichschließung öffnet jeder Schlüssel jede Tür. Eine Schließanlage legt fest, '
      + 'wer welche Tür öffnen darf. Dafür hat sie Stufen, vom Nutzerschlüssel bis zum '
      + 'Hauptschlüssel.',
  },
  {
    question: 'Kann ich eine Anlage später erweitern?',
    answer:
      'Das entscheidet sich bei der Planung. Sieht der Schließplan Reserven für weitere Türen und '
      + 'Nutzer vor, lassen sich später Schließstellen ergänzen. Sagen Sie uns deshalb im '
      + 'Konfigurator, was Sie in den nächsten Jahren vorhaben.',
  },
  {
    question: 'Ich habe schon eine Anlage. Können Sie sie ergänzen?',
    answer:
      'Das hängt vom vorhandenen System und vom Nachweis ab. Geben Sie im Konfigurator Hersteller, '
      + 'System und Sicherungskarte an, soweit Sie sie kennen. Laden Sie vorhandene Pläne oder '
      + 'Fotos hoch. Wir prüfen dann, was möglich ist.',
  },
  {
    question: 'Wie kommt der Preis zustande?',
    answer:
      'Eine Schließanlage wird nach Ihrem Schließplan gefertigt. Preis und Aufwand hängen von der '
      + 'Zahl der Schließstellen, Schlüssel und Ebenen ab. Deshalb nennen wir einen Betrag erst '
      + 'nach der Erfassung und nicht vorab auf der Seite.',
  },
  {
    question: 'Brauchen alle Türen denselben Zylinder?',
    answer:
      'Nein. In einer Anlage können Zylinder verschieden ausgestattet sein. Außentüren bekommen '
      + 'zum Beispiel mehr Schutz gegen Aufbohren und Ziehen, Innentüren eine einfachere '
      + 'Ausführung. Welche Tür was braucht, halten wir im Schließplan fest.',
  },
  {
    question: 'Was passiert, wenn ein Hauptschlüssel verloren geht?',
    answer:
      'Ein Hauptschlüssel öffnet viele Türen. Bei einer rein mechanischen Anlage müssen deshalb '
      + 'meist die betroffenen Zylinder getauscht oder umgestellt werden. Gehen an einer Tür oft '
      + 'Schlüssel verloren, kann dort eine elektronische Lösung sinnvoll sein. Eine verlorene '
      + 'Karte oder ein verlorener Transponder lässt sich dort sperren.',
  },
  {
    question: 'Wer darf Nachschlüssel bestellen?',
    answer:
      'Bei Anlagen mit Sicherungskarte nur, wer die Karte vorlegt. Ob das Schlüsselprofil, also '
      + 'die Form des Schlüssels, zusätzlich geschützt ist und wie lange, hängt vom Hersteller und '
      + 'vom System ab. Bewahren Sie die Karte getrennt von den Schlüsseln auf.',
  },
  {
    question: 'Was gilt an Flucht- und Rettungswegen?',
    answer:
      'Türen in Flucht- und Rettungswegen müssen sich in Fluchtrichtung jederzeit ohne Schlüssel '
      + 'öffnen lassen. Für Notausgänge gilt DIN EN 179, für Paniktüren DIN EN 1125. Dafür gibt es '
      + 'eigene Verschlüsse und passende Zylinder. Kennzeichnen Sie solche Türen im Konfigurator. Dann berücksichtigen wir '
      + 'sie im Schließplan.',
  },
  {
    question: 'Wie pflege ich die Zylinder?',
    answer:
      'Verwenden Sie kein Öl und kein Kriechöl. Beides verharzt und zieht Schmutz an. Geeignet ist '
      + 'ein Pflegespray für Schließzylinder nach Angabe des Herstellers.',
  },
];

export default async function SchliessanlagenPage() {
  // Rubrik dieser Seite: Ziel des Übergangs aus der Hub-Kachel (B-35)
  const rubrik = await getRubrik('schliessanlage');
  const [page, codeLines] = await Promise.all([getPageContent(ROUTE), getCodeLines()]);
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schliessanlagen',
          name: page?.headline ?? 'Schließanlagen',
          description: page?.seo.description,
          crumbs: [{ href: '/schliessanlagen', label: 'Schließanlagen' }],
          faq: faq,
        })}
      />

      <PageHeader
        rubrik={rubrik}
        eyebrow="Leistungsbereich"
        bereich={ROUTE}
        title={page?.headline ?? 'Mechanische Schließanlagen'}
        lead={page?.subline ?? 'Wir planen Ihre Schließanlage mit Ihnen, von der Zentralschließung bis zur Generalhauptschlüsselanlage.'}
        crumbs={[{ href: '/schliessanlagen', label: 'Schließanlagen' }]}
        /* Blickfang im Kopf: der Schließplan in Stufe HS, ohne Auswahlknöpfe. */
        visual={
          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Schließplan auf dem Tisch neben sortierten Profilzylindern',
              ratio: '16/9',
              note: 'Echtes Foto aus dem eigenen Betrieb. Kein Stockfoto.',
              visual: { generator: 'schliessplan', params: { system: 'haupt', tueren: 4 } },
            }}
            /* Mobil 16/9 aus ratio (Paketvorgabe), ab sm 3/2. Die schmale Fassung 360 × 162 steht mittig; oben und unten bleibt ein freier Rand. */
            className="sm:aspect-3/2"
            frei
          />
        }
        actions={
          <>
            <ButtonLink href="/schliessanlagen/konfigurator" prefetch={false} size="lg" pfeil>
              Schließanlage konfigurieren
            </ButtonLink>
            {/* Ziel des Kopfknopfs erst nach der Fräsbahn vorladen (D-044) */}
            <SpaetVorladen ziele={['/schliessanlagen/konfigurator']} />
            {/* Schließplan-Planer (E5-OPUS-01): Türen, Schlüssel und Matrix selbst anlegen */}
            <ButtonLink href="/schliessanlagen/konfigurator/schliessplan" prefetch={false} size="lg" variant="outline">
              Schließplan selbst anlegen
            </ButtonLink>
            <ButtonLink href="#systeme" size="lg" variant="outline">
              Zu den Systemen
            </ButtonLink>
          </>
        }
      />

      {/* Einstieg: Text und Ablauf links, Begriffe als Haarlinienliste rechts */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <p className="text-body leading-relaxed text-foreground-muted">
              {page?.intro
                ?? 'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Arten in '
                  + 'einfacher Sprache. Ihre Anlage planen wir so, dass sie später erweitert werden kann.'}
            </p>

            <p className="mt-4 text-body leading-relaxed text-foreground-muted">
              Der Weg ist immer gleich. Sie beschreiben Ihr Objekt, Ihre Nutzer und Ihre Türen.
              Daraus entsteht ein Schließplan, den wir mit Ihnen abstimmen. Erst danach wird
              gefertigt.
            </p>

            <dl className="mt-6">
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                {process.label}
              </dt>
              <dd className="mt-1.5 max-w-measure text-small leading-relaxed text-foreground-muted">
                {process.hint}
              </dd>
            </dl>

            {/* Schritte aus den Rubrikdaten (G-10, G-11) */}
            {rubrik && (
              <>
                <p className="mt-8 font-mono text-caption uppercase tracking-label text-foreground-muted">So läuft Ihr Auftrag ab</p>
                <RubrikAblauf rubrik={rubrik} className="mt-5" />
              </>
            )}
          </div>

          <dl className="border-t border-border lg:col-span-5">
            {GLOSSARY.map((item) => (
              <div key={item.term} className="border-b border-border py-5">
                <dt className="flex items-start justify-between gap-3">
                  <span className="text-title-sm font-semibold text-foreground">{item.term}</span>
                  <InfoTip hint={item.hint} />
                </dt>
                <dd className="mt-1.5 max-w-measure text-small leading-relaxed text-foreground-muted">
                  {item.summary}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Die fünf Systeme einmal erzählt: der interaktive Plan mit den Texten als Reiterinhalt */}
      <Section id="systeme" labelledBy="systeme-titel" tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <SectionHeading
            id="systeme-titel"
            className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
            nummer="01"
            eyebrow="Systeme"
            title="Die fünf Systeme in einfacher Sprache"
            lead="Vorwissen brauchen Sie nicht. Zuerst steht immer der volle Name, die übliche Abkürzung folgt in Klammern."
          />
          <div className="lg:col-span-7">
            <SchliessplanInteraktiv anfang="gleichschliessung" tueren={4} gruppen={2} details={systemReiter()} />
          </div>
        </div>

        <div className="mt-16">
          <ErweiterbareAnlage />
        </div>

        <div className="mt-16">
          <h3 className="text-title font-bold text-foreground">Die Systeme im Vergleich</h3>
          <p className="mt-2 max-w-2xl text-body leading-relaxed text-foreground-muted">
            Die Tabelle zeigt die Unterschiede nebeneinander. Wenn Sie unsicher sind, beschreiben
            Sie Ihr Objekt im Konfigurator. Daraus machen wir Ihnen einen Vorschlag.
          </p>
          <div className="mt-6">
            <SystemVergleich />
          </div>
        </div>
      </Section>

      {/* Für wen: Stückliste, ganze Zeile ist der Link */}
      <Section labelledBy="fuer-wen-titel">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            id="fuer-wen-titel"
            className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
            nummer="02"
            eyebrow="Für wen"
            title="Welche Anlage zu wem passt"
            lead="Die Zuordnung ist ein Anhaltspunkt, keine Festlegung. Entscheidend sind Ihre Türen und Ihre Zuständigkeiten."
          />

          <ol className="border-t border-border lg:col-span-8">
            {AUDIENCES.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="border-b border-border">
                  <Link href={item.href} className="group flex min-h-touch gap-4 py-6 sm:gap-6">
                    <span className="w-6 shrink-0 pt-1 font-mono text-caption tabular-nums text-foreground-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon size={24} className="mt-0.5 shrink-0 text-area-strong" />
                    <span className="min-w-0 flex-1">
                      <h3 className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                        {item.title}
                      </h3>
                      <span className="mt-1.5 block max-w-measure text-small leading-relaxed text-foreground-muted">
                        {item.body}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-primary">
                        {item.linkLabel}
                        <GlyphPfeilRechts
                          size={16}
                          className="transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Kleine Vorhaben */}
      <Section tone="muted" tight>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading nummer="03" eyebrow="Gleichschließung" title="Wenige Türen, ein Schlüssel für alles" />
            <p className="mt-3 text-body leading-relaxed text-foreground-muted">
              Dafür brauchen Sie keinen Schließplan. Gleichschließende Zylinder stellen Sie selbst
              zusammen und bestellen sie direkt. Sie wählen Bauform, Maße und die Zahl der
              gemeinsamen Schlüssel. Der Projektkonfigurator lohnt sich erst, wenn verschiedene
              Personen verschiedene Türen öffnen sollen.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/gleichschliessende-zylinder">
                Zu den gleichschließenden Zylindern
              </ButtonLink>
              <ButtonLink href="/schliessanlagen/konfigurator" variant="outline">
                Trotzdem Schließanlage konfigurieren
              </ButtonLink>
            </div>

            <Alert tone="info" title="Woran Sie den Unterschied erkennen" className="mt-8">
              Soll jemand eine Tür nicht öffnen können, reicht eine Gleichschließung nicht mehr aus.
              Das gilt etwa für einen Mieter und die Wohnung nebenan oder für eine Aushilfe und das
              Büro der Leitung. Dann planen wir eine Anlage mit Ebenen.
            </Alert>
          </div>

          {/* Schemazeichnung der Gleichschließung: drei Schlüssel mit derselben Schließung. */}
          <ImagePlaceholder
            className="lg:col-span-5"
            slot={{
              motif: 'Schemazeichnung Gleichschließung: drei Schlüssel mit derselben Schließung',
              ratio: '16/9',
              visual: { generator: 'schluessel', params: { typ: 'zylinder', anzahl: 3 } },
            }}
            frei
          />
        </div>
      </Section>

      {/* Nachbestellen mit Sicherungskarte */}
      <NachbestellenAbschnitt linie={sicherungskartenLinie(codeLines)} nummer="04" />

      {/* Fragen */}
      <Section tone="muted">
        <SectionHeading nummer="05" eyebrow="Fragen" title="Häufige Fragen zu Schließanlagen" />
        <div className="mt-8">
          <Accordion items={faq} />
        </div>
      </Section>

      {/* Weiterführend: nummerierte Stückliste mit Haarlinien */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading nummer="06" eyebrow="Weiterlesen" title="Passend dazu" className="lg:col-span-4" />

          <ol className="border-t border-border lg:col-span-8">
            {WEITERFUEHREND.map((link, index) => (
              <li key={link.href} className="border-b border-border">
                <Link
                  href={link.href}
                  className="group flex min-h-touch items-center gap-4 py-5 transition-colors duration-quick ease-standard sm:gap-6"
                >
                  <span className="w-6 shrink-0 self-start pt-1 font-mono text-caption tabular-nums text-foreground-muted sm:w-8">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-title-sm font-semibold text-foreground group-hover:text-primary">
                      {link.label}
                    </span>
                    <span className="mt-1 block max-w-measure text-small leading-relaxed text-foreground-muted">
                      {link.body}
                    </span>
                  </span>
                  <GlyphPfeilRechts
                    size={18}
                    className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
