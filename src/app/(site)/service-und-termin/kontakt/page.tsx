import type { Metadata } from 'next';
import Link from 'next/link';

import { getSettings } from '@/lib/data';
import { formatWeekday } from '@/lib/format';
import { enthaeltPlatzhalter } from '@/lib/platzhalter';
import { anbieterZeilen, standort } from '@/lib/rechtliches/firma';
import { telefonLink } from '@/lib/telefon';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { KontaktRoutingAgent } from '@/components/calculator/kontakt-routing';
import { Accordion } from '@/components/ui/accordion';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphMail } from '@/components/visual/glyphen/mail';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { GlyphTelefon } from '@/components/visual/glyphen/telefon';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Anschrift, Erreichbarkeit und Anfahrt zu SCHLÜSSELMACHER24.',
  alternates: { canonical: '/service-und-termin/kontakt' },
};

/** Hinweis zur Anfahrt aus der Redaktion. Solange er einen Platzhalter enthält, bleibt er ungezeigt. */
const ANFAHRT_HINWEIS =
  '[Platzhalter: Hinweise zur Anfahrt, zu Parkmöglichkeiten und zur Erreichbarkeit mit öffentlichen Verkehrsmitteln eintragen. Eine eingebettete Karte eines externen Anbieters ist erst nach Einwilligung zulässig und muss über die Cookie-Einstellungen gesteuert werden.]';

export default async function KontaktPage() {
  const settings = await getSettings();
  const { company } = settings;
  const anbieter = anbieterZeilen(company).filter((zeile) => zeile !== company.country);
  const telefonHref = telefonLink(company.phone);
  const werkstatt = standort(company);

  return (
    <>
      {/* Kopf: Fach-Icon als Anker und Ziel des Seitenwechsels (B-13) */}
      <PageHeader
        bereich="service-und-termin"
        eyebrow="Kontakt"
        title="So erreichen Sie uns"
        lead="Für konkrete Aufträge nutzen Sie bitte die geführten Abläufe — dort erfassen wir gleich alles, was wir brauchen."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/kontakt', label: 'Kontakt' },
        ]}
        actions={<ButtonLink href="/service-und-termin/anfrage">Anfrage stellen</ButtonLink>}
      />

      <Section>
        {/* Redaktionshinweis nur im Entwicklungsmodus (D-016), wie im Fuß */}
        {company.isPlaceholder && process.env.NODE_ENV !== 'production' && (
          <Alert tone="warning" title="Kontaktdaten noch nicht hinterlegt" className="mb-8">
            Anschrift, Telefonnummer und E-Mail-Adresse sind derzeit Platzhalter. Sie werden im
            Backend unter „Einstellungen“ gepflegt und müssen vor dem Livegang ersetzt werden.
          </Alert>
        )}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading nummer="01" eyebrow="Erreichbarkeit" title="Fachbetrieb" />

            {company.isPlaceholder ? (
              /* Ohne hinterlegte Daten keine Anschrift, kein tel:- oder mailto:-Link mit Platzhalter */
              <p className="mt-6 flex max-w-measure gap-3 text-small text-foreground-muted">
                <GlyphInfo size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  Anschrift, Telefon und E-Mail sind noch nicht hinterlegt. Für Ihr Anliegen stellen Sie
                  bitte eine{' '}
                  <Link href="/service-und-termin/anfrage" className="font-semibold underline">
                    Anfrage
                  </Link>
                  .
                </span>
              </p>
            ) : (
              <dl className="mt-6 border-t border-border">
                <div className="flex gap-4 border-b border-border py-5">
                  <GlyphOrt size={20} className="mt-1 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      {werkstatt ? 'Firmensitz' : 'Anschrift'}
                    </dt>
                    <dd className="mt-2 text-body text-foreground">
                      {anbieter.map((zeile, index) => (
                        <span key={zeile}>
                          {index > 0 && <br />}
                          {zeile}
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>

                {werkstatt && (
                  <div className="flex gap-4 border-b border-border py-5">
                    <GlyphOrt size={20} className="mt-1 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                        {werkstatt.label}
                      </dt>
                      <dd className="mt-2 text-body text-foreground">
                        {werkstatt.street}
                        <br />
                        {werkstatt.postalCode} {werkstatt.city}
                      </dd>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 border-b border-border py-5">
                  <GlyphTelefon size={20} className="mt-1 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      Telefon
                    </dt>
                    <dd className="mt-2 font-mono tabular-nums text-body text-foreground">
                      {telefonHref ? (
                        <a
                          href={telefonHref}
                          className="inline-flex min-h-touch items-center hover:text-primary hover:underline"
                        >
                          {company.phone}
                        </a>
                      ) : (
                        company.phone
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-4 border-b border-border py-5">
                  <GlyphMail size={20} className="mt-1 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                      E-Mail
                    </dt>
                    <dd className="mt-2 break-words text-body text-foreground">
                      <a
                        href={`mailto:${company.email}`}
                        className="inline-flex min-h-touch items-center hover:text-primary hover:underline"
                      >
                        {company.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            )}

            <h3 className="mt-12 text-title-sm font-semibold text-foreground">Öffnungszeiten</h3>
            <dl className="mt-6 border-t border-border">
              {settings.openingHours.map((entry) => (
                <div
                  key={entry.day}
                  className="grid gap-1 border-b border-border py-3 sm:grid-cols-3 sm:gap-x-4"
                >
                  <dt className="text-foreground-muted">{formatWeekday(entry.day)}</dt>
                  <dd className="font-mono tabular-nums text-foreground sm:col-span-2">
                    {entry.spans.length === 0
                      ? 'geschlossen'
                      : entry.spans.map((s) => `${s.from}–${s.to}`).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>

            <Alert tone="info" className="mt-8">
              Arbeiten an Fahrzeugen und Schließanlagen finden ausschließlich nach Terminvereinbarung
              statt. Bitte buchen Sie Ihren Termin über den{' '}
              <Link href="/autoschluessel/anfrage" className="font-semibold underline">
                Autoschlüssel-Ablauf
              </Link>{' '}
              oder stellen Sie eine{' '}
              <Link href="/service-und-termin/anfrage" className="font-semibold underline">
                allgemeine Anfrage
              </Link>
              .
            </Alert>
          </div>

          <div className="lg:col-span-5">
            <ImagePlaceholder
              slot={{
                motif: 'Foto des Betriebs: Eingang und Fassade mit Hausnummer',
                ratio: '4/3',
                note: 'Hilft Kundinnen und Kunden beim Wiederfinden vor Ort.',
              }}
            />
            <ImagePlaceholder
              slot={{
                motif: 'Anfahrtsskizze: Lage, Parkmöglichkeiten und nächste Haltestelle',
                ratio: '4/3',
                note: 'Einfache Zeichnung oder Kartenausschnitt mit geklärten Nutzungsrechten.',
              }}
              className="mt-4"
            />
            {!enthaeltPlatzhalter(ANFAHRT_HINWEIS) && (
              <p className="mt-4 text-small text-foreground-muted">{ANFAHRT_HINWEIS}</p>
            )}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading nummer="02" eyebrow="Intelligente Weiterleitung" title="Finden Sie den schnellsten Weg" lead="Abhängig von Ihrem Anliegen leiten wir Sie an den passenden Fachablauf oder empfehlen den direkten Anruf." />
        <div className="mt-12 max-w-3xl">
           <KontaktRoutingAgent />
        </div>
      </Section>

      <Section tone="sunken">
        <div className="max-w-4xl mx-auto">
          <SectionHeading nummer="03" eyebrow="Beratung & Methodik" title="Unsere Kommunikationsarchitektur" lead="Wir legen Wert auf transparente, effiziente und sichere Kommunikation. Erfahren Sie mehr über unsere Erreichbarkeitsstandards und SLAs." />

          <div className="mt-12 prose-sm24">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Präzise Vorqualifizierung für schnellere Lösungen</h3>
            <p>
              In einer modernen Sicherheitsarchitektur beginnt die Qualität der Lösung bereits bei der ersten Kontaktaufnahme. Anstatt unstrukturierter E-Mails, die oft Rückfragen erfordern, setzen wir auf geführte Prozesse. Egal, ob es sich um den Nachbau eines komplexen Autoschlüssels, die Planung einer vernetzten Schließanlage oder eine akute Türöffnung handelt – unser System leitet Ihr Anliegen direkt an den qualifiziertesten Techniker weiter. Diese Vorqualifizierung garantiert nicht nur eine schnellere Reaktionszeit, sondern stellt auch sicher, dass wir bei einem eventuellen Vor-Ort-Termin sofort mit den passenden Werkzeugen und Ersatzteilen ausgestattet sind.
            </p>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">Service-Level-Agreements (SLA) und Reaktionszeiten</h3>
            <p>
              Unsere Reaktionszeiten richten sich nach der Kritikalität Ihres Anliegens. Bei akuten Notfällen – etwa einer zugefallenen Tür mit einer Gefahrensituation im Innenraum (z.B. Kleinkind oder laufender Herd) – hat der telefonische Kontakt absolute Priorität. Unsere Hotline ist in solchen Fällen direkt mit der Einsatzsteuerung verbunden, um die sofortige Disposition eines Technikers zu ermöglichen. Für komplexe Planungsanfragen, wie die Konzeption elektronischer Zutrittslösungen, nehmen wir uns die notwendige Zeit für eine fundierte Vorabanalyse. Hier erhalten Sie in der Regel innerhalb von 24 bis 48 Stunden eine detaillierte technische Ersteinschätzung.
            </p>

            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mt-8">Datensicherheit in der Kommunikation</h3>
            <p>
              Die Planung von Sicherheitstechnik erfordert ein Höchstmaß an Diskretion und Datensicherheit. Aus diesem Grund übertragen wir alle Formulareingaben und hochgeladenen Dokumente (wie Schließpläne oder Sicherungskarten) ausschließlich über Ende-zu-Ende-verschlüsselte Verbindungen. Sensible Kundendaten werden in unserem internen ERP-System streng nach den Vorgaben der DSGVO verarbeitet und nicht an unbeteiligte Dritte weitergegeben. Dieser Standard gilt für jede Interaktion, vom ersten Klick bis zur finalen Übergabe der Schließanlage.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading nummer="04" eyebrow="Fachwissen" title="Häufige Fragen zur Kontaktaufnahme (FAQ)" lead="Hier finden Sie Antworten auf typische Fragen rund um unsere Erreichbarkeit, Terminvereinbarungen und Notdienste." />
        <Accordion items={[
          { question: "Wie schnell erhalte ich eine Antwort auf meine Anfrage?", answer: "Bei allgemeinen Serviceanfragen über unsere Formulare melden wir uns in der Regel innerhalb eines Werktages bei Ihnen. In dringenden Fällen empfehlen wir stets den direkten telefonischen Kontakt." },
          { question: "Bieten Sie einen 24-Stunden-Notdienst an?", answer: "Die Verfügbarkeit unseres Notdienstes hängt von der aktuellen Kapazität und der Uhrzeit ab. Rufen Sie im akuten Notfall immer unsere Hotline an, um die sofortige Verfügbarkeit eines Technikers in Ihrer Region zu prüfen." },
          { question: "Kann ich Bilder meines defekten Schlosses mitsenden?", answer: "Ja, unsere geführten Anfrageprozesse (z.B. für Autoschlüssel oder allgemeine Reparaturen) bieten eine sichere Upload-Funktion für Fotos. Dies hilft uns enorm bei der Fehlerdiagnose und der Mitnahme der richtigen Ersatzteile." },
          { question: "Warum werde ich gebeten, geführte Abläufe statt E-Mails zu nutzen?", answer: "Ein geführter Ablauf stellt sicher, dass wir sofort alle relevanten technischen Daten (wie Hersteller, Modell, Art des Defekts) erhalten. Dies eliminiert unnötige Rückfragen, beschleunigt die Bearbeitung und ermöglicht uns, Ihnen schneller ein präzises Angebot zu unterbreiten." },
          { question: "Ist mein Schließplan bei Ihnen sicher?", answer: "Absolut. Alle Daten, die Sie über unsere Plattform übertragen, werden verschlüsselt gesendet und auf sicheren, DSGVO-konformen Servern verarbeitet. Der Zugriff auf Schließpläne ist strikt auf autorisiertes Fachpersonal beschränkt." }
        ]} className="mt-12 max-w-4xl" />
      </Section>

    </>
  );
}
