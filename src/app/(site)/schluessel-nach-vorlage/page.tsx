import type { Metadata } from 'next';
import Link from 'next/link';

import { getPageContent, getRubrik, getSettings } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { istPlatzhalter } from '@/lib/platzhalter';
import type { ImageSlot } from '@/lib/types';
import { cn } from '@/lib/cn';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphLineal } from '@/components/visual/glyphen/lineal';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

const ROUTE = 'schluessel-nach-vorlage';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel nach Vorlage nachmachen',
    description:
      page?.seo.description
      ?? 'Sie schicken uns drei Fotos Ihres Schlüssels. Wir sagen Ihnen, ob eine Anfertigung möglich ist '
        + 'und was sie kostet. Einsenden müssen Sie ihn zunächst nicht.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/*
 * Die drei Aufnahmen, die wir für die Prüfung brauchen. Die Bildstellen zeichnen
 * sich aus Daten (Zeichnungsblätter), solange kein Foto hinterlegt ist.
 */
const PHOTOS: Array<{ title: string; body: string; slot: ImageSlot }> = [
  {
    title: 'Vorderseite',
    body:
      'Der Schlüssel flach von oben, vollständig im Bild. Kopf und Bart müssen zusammen '
      + 'zu sehen sein.',
    slot: {
      motif: 'Beispielfoto: Schlüssel flach von oben, Kopf und Bart vollständig im Bild',
      ratio: '4/3',
      note: 'Neutraler, heller Untergrund. Aufnahme ohne Blitzreflexe.',
      visual: { generator: 'schluessel', params: { typ: 'zylinder' } },
    },
  },
  {
    title: 'Rückseite',
    body:
      'Derselbe Schlüssel gewendet. Viele Schlüssel tragen nur auf einer Seite eine '
      + 'Beschriftung.',
    slot: {
      motif: 'Beispielfoto: Schlüssel gewendet, Prägung auf der Rückseite lesbar',
      ratio: '4/3',
      note: 'Gleicher Abstand und gleicher Untergrund wie bei der Vorderseite.',
      visual: { generator: 'schluessel', params: { typ: 'zylinder', code: 'rueckseite' } },
    },
  },
  {
    title: 'Spitze und Profil',
    body:
      'Von vorne auf die Spitze fotografiert. Aus dieser Ansicht erkennen wir den '
      + 'Profilquerschnitt und damit den passenden Rohling.',
    slot: {
      motif: 'Beispielfoto: Blick von vorne auf die Schlüsselspitze, Profilquerschnitt erkennbar',
      ratio: '1/1',
      note: 'Schlüssel aufstellen oder anlehnen, damit die Spitze zur Kamera zeigt.',
      visual: { generator: 'profilschnitt', params: { beschriftung: false } },
    },
  },
];

/* Weiterführende Bereiche als Stückliste; jede Zeile ist der Link. */
const WEITER: Array<{ href: string; label: string; body: string }> = [
  {
    href: '/schluessel-nach-code',
    label: 'Schlüssel nach Code',
    body: 'Trägt Ihr Schloss einen Code, fertigen wir nach diesem Code. Ihren Schlüssel müssen Sie dafür nicht fotografieren. Den Nachweis, dass Sie ihn nachmachen lassen dürfen, brauchen wir trotzdem.',
  },
  {
    href: '/autoschluessel/kopieren',
    label: 'Autoschlüssel kopieren',
    body: 'Mechanische Kopie für Fahrzeugschlüssel, mit allem, was dabei zu beachten ist.',
  },
  {
    href: '/autoschluessel/programmieren',
    label: 'Programmieren und anlernen',
    body: 'Transponder, Funk und Wegfahrsperre am Fahrzeug anlernen lassen.',
  },
  {
    href: '/ratgeber/schluesselcode-finden',
    label: 'Wo steht der Schlüsselcode?',
    body: 'Typische Fundstellen an Schloss, Schlüssel und Unterlagen.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Gleichschließende Zylinder',
    body: 'Mehrere Türen mit einem Schlüssel, direkt zusammenstellbar.',
  },
  {
    href: '/service-und-termin/kontakt',
    label: 'Kontakt',
    body: 'Wenn Ihr Fall in keinen der Abläufe passt.',
  },
];

/*
 * Antworten, die ein Redaktions-Platzhalter sind, werden nicht angezeigt (M-03).
 * `istPlatzhalter` prüft nur den Anfang; der Platzhalter im FAQ-Rückfall steht
 * mitten im Satz, deshalb gilt zusätzlich jede eckige Klammer als Platzhalter.
 */
function istPlatzhalterAntwort(text: string): boolean {
  return istPlatzhalter(text) || /\[[^\]]*\]/.test(text);
}

export default async function SchluesselNachVorlagePage() {
  // Rubrik dieser Seite: Ziel des Übergangs aus der Hub-Kachel (B-35)
  const rubrik = await getRubrik('schluessel-nach-vorlage');
  const [page, settings] = await Promise.all([getPageContent(ROUTE), getSettings()]);

  const process = PROCESS_LABELS['gefuehrte-anfrage'];

  // FAQ bevorzugt aus der Datenschicht; solange dort nichts gepflegt ist,
  // greift dieser fachlich geprüfte Grundbestand.
  const faqQuelle: Array<{ question: string; answer: string }> =
    page?.faq && page.faq.length > 0
      ? page.faq
      : [
          {
            question: 'Muss ich meinen Schlüssel einschicken?',
            answer:
              'Zunächst nicht. Für die Anfrage genügen drei Fotos, Ihr Schlüssel bleibt bei Ihnen. '
              + 'Ist eine sichere Fertigung nur am Original möglich, bitten wir Sie um die Einsendung '
              + 'und sagen Ihnen, wie sie abläuft. Sie können den Schlüssel auch gleich einschicken, '
              + 'ohne vorher Fotos zu senden.',
          },
          {
            question: 'Woran erkennen Sie, ob eine Nachfertigung möglich ist?',
            answer:
              'Entscheidend sind das Profil, also die Form im Querschnitt, die Form des Rohlings und '
              + 'die Beschriftung auf Kopf oder Bart. Daran bestimmen wir die Schlüsselart und den Rohling, '
              + 'aus dem der neue Schlüssel entsteht. '
              + 'Schließwerte lesen wir nicht aus Fotos ab. Gefertigt wird nach den Angaben auf dem '
              + 'Schlüssel oder am eingesendeten Original.',
          },
          {
            question: 'Was kostet die Anfrage?',
            answer:
              'Preis und Machbarkeit nennen wir nach der Prüfung Ihrer Fotos. Mit dem Absenden '
              + 'der Anfrage entsteht noch kein Auftrag und kein Vertrag. Sie entscheiden erst, '
              + 'wenn Ihnen unsere Rückmeldung vorliegt.',
          },
          {
            question: 'Wie erteile ich den Auftrag?',
            answer:
              'Ist die Anfertigung möglich, erhalten Sie von uns die Freigabe mit Preis und einem '
              + 'persönlichen Zahlungslink. Mit Ihrer Zahlung erteilen Sie den Auftrag; erst danach '
              + 'fertigen wir. Die Freigabe allein ist noch keine Fertigungszusage.',
          },
          {
            question: 'Wie lange dauert die Prüfung?',
            answer:
              'Die Dauer hängt vom Schlüsseltyp und von der Qualität der Fotos ab. Wir melden '
              + 'uns, sobald die Prüfung abgeschlossen ist. '
              + '[Platzhalter: übliche Bearbeitungsdauer ergänzen]',
          },
          {
            question: 'Gilt das auch für Autoschlüssel?',
            answer:
              'Für den mechanischen Teil ja. Der Bart lässt sich nach Vorlage anfertigen. '
              + 'Mechanische Autoschlüssel und reine Schlüsselbärte können Sie je nach Fall auch einsenden. '
              + 'Transponder, Funk und Wegfahrsperre sind ein eigener Schritt. Sie lassen sich in '
              + 'aller Regel nur am Fahrzeug anlernen.',
          },
          {
            question: 'Und bei Schlüsseln mit Sicherungskarte oder geschütztem Profil?',
            answer:
              'Solche Schlüssel fertigen wir nur eingeschränkt nach. Je nach System brauchen wir einen '
              + 'Nachweis der Berechtigung, etwa die Sicherungskarte, oder der Weg führt über den Hersteller. '
              + 'Der Nachweis verhindert, dass Unbefugte Ihren Schlüssel nachmachen lassen. Das prüfen wir '
              + 'im Einzelfall und sagen Ihnen das Ergebnis.',
          },
          {
            question: 'Was passiert mit meinen Fotos?',
            answer:
              `Die Fotos werden ausschließlich für Ihren Vorgang verwendet und nach `
              + `${settings.retentionDays.keyPhotos} Tagen gelöscht. Einzelheiten stehen in der `
              + 'Datenschutzerklärung.',
          },
        ];
  const faq = faqQuelle.filter((frage) => !istPlatzhalterAntwort(frage.answer));

  const links = page?.seo.internalLinks ?? [];

  /* Schriftfeld im Kopf: nur Angaben, die auch in den Abschnitten stehen. */
  const felder = [
    { label: 'Ablauf', wert: process.label },
    { label: 'Aufnahmen', wert: String(PHOTOS.length) },
    { label: 'Original', wert: 'Bleibt zunächst bei Ihnen' },
    { label: 'Einsendung', wert: 'Nur wenn nötig' },
  ];

  // Sichtbarer Kurztext im Seitenkopf, zugleich Beschreibung der Leistung in den Strukturdaten (FA-25-10).
  const kurztext =
    page?.subline
    ?? 'Sie haben den Schlüssel. Anhand Ihrer Fotos bestimmen wir ihn und prüfen, ob wir ihn nachfertigen können.';

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schluessel-nach-vorlage',
          name: page?.headline ?? 'Schlüssel nach Vorlage',
          service: { name: page?.headline ?? 'Schlüssel nach Vorlage', description: kurztext },
          description: page?.seo.description,
          crumbs: [{ href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' }],
          faq: faq,
        })}
      />

      {/* Großer Moment (B-04): Zeichnung „Vorlage und Kopie“ im Kopf, auf Papier */}
      <PageHeader
        rubrik={rubrik}
        eyebrow={process.label}
        title={page?.headline ?? 'Schlüssel nach Vorlage'}
        lead={kurztext}
        crumbs={[{ href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage' }]}
        bereich="schluessel-nach-vorlage"
        visual={
          <div className="rounded-lg border border-border bg-surface p-4 sm:p-6">
            <SchluesselGrafik
              params={{ typ: 'zylinder', anzahl: 2 }}
              title="Zeichnung: Schlüssel und Kopie nach Vorlage"
              className="w-full"
            />
          </div>
        }
        actions={
          <ButtonLink href="/schluessel-nach-vorlage/anfrage" size="lg" pfeil>
            Schlüssel prüfen lassen
          </ButtonLink>
        }
      >
        <p className="max-w-measure text-body text-foreground-muted">{page?.intro}</p>

        {/* Vorgabe des Inhabers (FA-03, A-046): Fotos dienen nur der Bestimmung, gefertigt wird nie nach einem Foto. */}
        <p className="mt-4 max-w-measure text-body font-semibold text-foreground">
          Ihre Fotos dienen nur der Identifikation und Prüfung. Schließwerte lesen wir nicht aus Fotos ab. Braucht die
          Fertigung das Original, senden Sie es ein.
        </p>

        <dl className="mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-4">
          {felder.map((feld, index) => (
            <div
              key={feld.label}
              className={cn(
                'py-4 pr-3 sm:pr-4',
                index % 2 === 1 && 'border-l border-border pl-3',
                index > 0 && 'sm:border-l sm:pl-4',
              )}
            >
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng">
                {feld.label}
              </dt>
              <dd className="mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground">
                {feld.wert}
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* Ablauf als Stückliste mit Fach-Icons; die Überschrift nennt keine Zahl (R4, E6-OPUS-01) */}
      <Section labelledBy="ablauf-titel">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionHeading
              id="ablauf-titel"
              nummer="01"
              eyebrow="So läuft Ihr Auftrag ab"
              title="Von der Anfrage bis zum Schlüssel"
              lead={process.hint}
            />

            <Alert tone="info" title="Ihr Original bleibt zunächst bei Ihnen" className="mt-7">
              Für die Anfrage müssen Sie den Originalschlüssel <strong>nicht</strong> einsenden.
              Wir bestimmen den Schlüssel anhand Ihrer Fotos. Das Original brauchen wir nur, wenn
              eine sichere Fertigung anders nicht möglich ist. Wer den Schlüssel lieber gleich
              einschickt,{' '}
              <Link href="/schluessel-einschicken" className="font-semibold underline">
                meldet die Einsendung an
              </Link>
              .
            </Alert>

            <div className="mt-7">
              <ButtonLink href="/schluessel-nach-vorlage/anfrage" pfeil>
                Schlüssel prüfen lassen
              </ButtonLink>
            </div>
          </div>

          {/* Ablauf aus den Rubrikdaten (G-10, G-11): dieselben Schritte wie überall, wo die Rubrik erscheint */}
          {rubrik && <RubrikAblauf rubrik={rubrik} variante="liste" className="lg:col-span-7" />}
        </div>
      </Section>

      {/* Die drei Aufnahmen als Zeichnungsblätter mit Haarlinien (Muster Schlüsselarten-Reihe) */}
      <Section tone="muted" id="fotos">
        <SectionHeading
          nummer="02"
          eyebrow="Vorbereitung"
          title="Diese drei Aufnahmen brauchen wir"
          lead="Die Fotos sollen scharf und hell sein, ohne Blitzreflexe. Der Schlüssel soll das Bild fast ganz ausfüllen. Beschriftungen und Prägungen müssen lesbar sein."
        />

        {/* Ab md teilen sich die Blätter die Zeilen (Subgrid): Die Titel stehen auf
            einer Linie, auch wenn die Bildformate aus den Daten verschieden sind. */}
        <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {PHOTOS.map((photo, index) => (
            <li
              key={photo.title}
              className="flex flex-col bg-surface p-4 sm:p-5 md:row-span-3 md:grid md:grid-rows-subgrid md:gap-y-0"
            >
              <div className="sm24-reveal" style={motionStyle(index * 0.12)}>
                <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <span aria-hidden> · </span>
                  Foto
                </p>
                <ImagePlaceholder slot={photo.slot} frei className="mt-2" />
              </div>
              <h3 className="mt-3 text-title-sm font-semibold text-foreground">{photo.title}</h3>
              <p className="mt-1 text-small text-foreground-muted">{photo.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-measure text-small text-foreground-muted">
          Nicht jedes Foto ist ablesbar. Reichen die Bilder für eine sichere Bestimmung nicht, bitten wir Sie, den Schlüssel einzuschicken.
        </p>

        <Card className="mt-6">
          <CardBody>
            <p className="flex items-center gap-2 text-title-sm font-semibold text-foreground">
              <GlyphLineal size={20} className="text-primary" />
              Beschriftungen mitfotografieren
            </p>
            <p className="mt-2 max-w-measure text-small text-foreground-muted">
              Zahlen und Buchstaben auf Kopf, Bart oder Schaft helfen uns sehr bei der Bestimmung.
              Tragen Sie sie im Formular als Text ein. Fotografieren Sie sie zusätzlich, bei kleinen
              Prägungen aus der Nähe.
            </p>
          </CardBody>
        </Card>
      </Section>

      {/* Autoschlüssel */}
      <Section id="autoschluessel">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading
              nummer="03"
              eyebrow="Sonderfall Fahrzeuge"
              title="Auch für mechanische Autoschlüssel"
              lead="Der Bart lässt sich nach Vorlage anfertigen. Die Elektronik ist ein eigener Schritt."
            />

            <div className="prose-sm24 mt-6 max-w-none">
              <p>
                Viele Fahrzeugschlüssel bestehen aus zwei Teilen: dem mechanischen Bart, der das
                Türschloss bewegt, und der Elektronik im Schlüsselkopf. Nach Vorlage fertigen wir
                den mechanischen Teil.
              </p>
              <p>
                Ein nachgefertigter Bart öffnet bei vielen Fahrzeugen die Tür, startet den
                Motor aber nicht. Denn der Chip im Schlüssel (Transponder), die Funkfernbedienung
                und die Wegfahrsperre müssen dem Fahrzeug erst bekannt gemacht werden. Dafür ist in
                aller Regel das Fahrzeug selbst nötig.
              </p>
              <p>
                Mechanische Autoschlüssel und reine Schlüsselbärte können Sie je nach Fall auch
                einsenden.
              </p>
            </div>

            <Alert tone="warning" title="Wichtig für Fahrzeugschlüssel" className="mt-6">
              Ein kopierter Bart ersetzt bei vielen Fahrzeugen <strong>nicht</strong> automatisch
              Transponder, Funk oder Wegfahrsperre. Ob Ihr Fahrzeug einen rein mechanischen
              Schlüssel nutzt, klären wir mit Ihrer Anfrage.
            </Alert>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/autoschluessel/kopieren" variant="outline">
                Autoschlüssel kopieren
              </ButtonLink>
              <ButtonLink href="/autoschluessel/programmieren" variant="outline">
                Programmieren und anlernen
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ImagePlaceholder
              slot={{
                motif: 'Werkstattfoto: mechanischer Fahrzeugschlüssel neben aufgeklapptem Schlüsselkopf mit Transponder',
                ratio: '4/3',
                note: 'Zeigt den Unterschied zwischen mechanischem Bart und Elektronik.',
              }}
            />
          </div>
        </div>
      </Section>

      {/* Einsendung: wenn die Fertigung das Original braucht, oder direkt über die Einsendung */}
      <Section tone="sunken" id="einsendung">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              nummer="04"
              eyebrow="Original einsenden"
              title="Wenn die Fertigung das Original braucht"
              lead="Bei ungewöhnlichen Profilen oder unleserlichen Prägungen ist eine sichere Fertigung nur am Original möglich. Dann senden Sie den Schlüssel ein."
            />

            <div className="prose-sm24 mt-6 max-w-none">
              <p>
                Läuft Ihre Anfrage mit Fotos, schicken Sie bitte nichts unaufgefordert ein. Mit der
                Freigabe nennen wir Ihnen die Versandadresse, den genauen Umfang und Ihre
                Vorgangsnummer. Den Begleitschein finden Sie dann auf Ihrer Vorgangsseite. Senden Sie
                das Original erst, nachdem Sie den Auftrag mit der Zahlung erteilt haben.
              </p>
              <p>
                Sie können den Schlüssel auch ohne vorherige Anfrage direkt einschicken. Dafür melden
                Sie die Einsendung an und legen den Begleitschein bei.
              </p>
            </div>

            <Alert tone="legal" title="Versandweg" className="mt-6">
              Wählen Sie einen versicherten oder mindestens nachverfolgbaren Versand. Ein
              Schlüssel im unverfolgten Brief ist bei Verlust nicht auffindbar und nicht
              ersetzbar.
            </Alert>

            <Link
              href="/schluessel-einschicken"
              className="group mt-6 inline-flex min-h-touch items-center gap-2 text-small font-semibold text-primary hover:underline"
            >
              Alles zur Einsendung: Schlüssel einschicken
              <GlyphPfeilRechts
                size={16}
                className="shrink-0 transition-transform duration-quick ease-standard group-hover:translate-x-1"
              />
            </Link>
          </div>

          <Card className="lg:col-span-7">
            <CardBody>
              <h3 className="text-title-sm font-semibold text-foreground">Was der Sendung beiliegen soll</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'Der Begleitschein von Ihrer Vorgangsseite, alternativ ein Zettel mit Ihrer Vorgangsnummer, Ihrem Namen und Ihrer Telefonnummer.',
                  'Die vollständige Rücksendeadresse.',
                  'Nur den betreffenden Schlüssel, ohne Schlüsselring, Anhänger und weitere Schlüssel.',
                  'Falls vorhanden: eine Kopie der Sicherungskarte oder des Berechtigungsnachweises.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <GlyphHakenKreis size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span className="text-small text-foreground-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 text-small text-foreground-muted">
                Nach der Anfertigung erhalten Sie Original und neuen Schlüssel getrennt
                voneinander zurück, sofern Sie das wünschen. Die Versandart stimmen wir vorher
                mit Ihnen ab.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Fragen (Platzhalter-Antworten werden nicht angezeigt) */}
      <Section id="fragen">
        <SectionHeading nummer="05" eyebrow="Fragen" title="Häufige Fragen zur Anfrage nach Vorlage" />
        <Accordion items={faq} className="mt-8" />
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight>
        <SectionHeading
          nummer="06"
          eyebrow="Weiter im Thema"
          title="Passende Bereiche"
          lead="Vielleicht passt einer dieser Wege besser zu Ihrem Fall."
        />

        <ul className="mt-8 grid border-t border-border sm:grid-cols-2 sm:gap-x-gutter lg:grid-cols-3">
          {WEITER.map((item) => (
            <li key={item.href} className="border-b border-border">
              <Link
                href={item.href}
                className="group flex min-h-touch flex-col gap-2 py-5 transition-colors duration-quick"
              >
                <span className="flex items-center justify-between gap-3 text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-primary">
                  {item.label}
                  <GlyphPfeilRechts
                    size={16}
                    className="shrink-0 text-primary transition-transform duration-quick ease-standard group-hover:translate-x-1"
                  />
                </span>
                <span className="text-small text-foreground-muted">{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>

        {links.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Ebenfalls passend
            </p>
            <ul className="mt-3 border-t border-border">
              {links.map((link) => (
                <li key={link.href} className="border-b border-border">
                  <Link
                    href={link.href}
                    className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small font-semibold text-primary"
                  >
                    {link.label}
                    <GlyphPfeilRechts
                      size={16}
                      className="shrink-0 transition-transform duration-quick ease-standard group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </>
  );
}
