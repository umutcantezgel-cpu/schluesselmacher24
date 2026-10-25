import type { Metadata } from 'next';
import Link from 'next/link';

import { getCities, getSettings } from '@/lib/data';
import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { TUER_SCHUTZ_AUSSCHNITT } from '@/components/visual/generators/tuer-schutz';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

export const metadata: Metadata = {
  title: 'Vor-Ort-Leistungen',
  description:
    'Welche Arbeiten wir direkt bei Ihnen im Objekt oder am Fahrzeug erledigen und was dafür '
    + 'vorbereitet sein muss.',
  alternates: { canonical: '/service-und-termin/vor-ort' },
};

const SERVICES = [
  {
    title: 'Autoschlüssel am Fahrzeug',
    body:
      'Programmieren und Anlernen setzen Zugriff auf das Fahrzeug voraus. Diese Arbeiten lassen '
      + 'sich nicht per Versand erledigen.',
    needs: [
      'Fahrzeug am vereinbarten Ort',
      'Fahrzeugschein im Original',
      'Nachweis, dass Sie über das Fahrzeug verfügen dürfen',
    ],
    href: '/autoschluessel/anfrage',
    cta: 'Termin starten',
  },
  {
    title: 'Zylinder- und Schlosstausch',
    body:
      'Austausch von Zylindern, Einsteckschlössern, Beschlägen und Türzusatzschlössern an der '
      + 'eingebauten Tür.',
    needs: ['Zugang zur Tür', 'Maße oder der ausgebaute Zylinder', 'freier Arbeitsbereich'],
    href: '/tuer-und-schliesstechnik',
    cta: 'Zur Tür- und Schließtechnik',
  },
  {
    title: 'Montage von Schließanlagen',
    body:
      'Einbau der Zylinder nach Schließplan, Beschriftung der Schlüssel und Übergabe der '
      + 'Unterlagen.',
    needs: ['Zugang zu allen Türen der Anlage', 'anwesende verantwortliche Person', 'Schließplan'],
    href: '/schliessanlagen/konfigurator',
    cta: 'Projekt erfassen',
  },
  {
    title: 'Elektronische Zutrittslösungen einrichten',
    body: 'Montage, Einrichtung der Benutzerverwaltung und Einweisung in die Bedienung.',
    needs: ['Strom und, falls nötig, Netzwerk', 'Liste der Nutzer und Berechtigungen'],
    href: '/elektronische-zutrittsloesungen/konfigurator',
    cta: 'Bedarf erfassen',
  },
  {
    title: 'Sicherheitstechnik installieren',
    body:
      'Montage von Kameras, Meldern und Kontakten sowie Einrichtung der Alarmierungswege.',
    needs: ['Zugang zu allen betroffenen Bereichen', 'Internetzugang, falls App-Steuerung gewünscht'],
    href: '/sicherheitstechnik/sicherheitscheck',
    cta: 'Sicherheitscheck starten',
  },
  {
    title: 'Bestandsaufnahme und Beratung',
    body:
      'Wir sehen uns die vorhandene Situation an und sagen Ihnen, was sinnvoll ist — als Grundlage '
      + 'für ein belastbares Angebot.',
    needs: ['Zugang zum Objekt', 'vorhandene Unterlagen, falls verfügbar'],
    href: '/service-und-termin/anfrage',
    cta: 'Beratungstermin anfragen',
  },
];

export default async function VorOrtPage() {
  const [settings, alleGebiete] = await Promise.all([getSettings(), getCities()]);
  // Wie /standorte: Gebiete mit Platzhaltern versprächen Leistungen, die nicht belegt sind (Erg. Leitfaden §5).
  const cities = alleGebiete.filter(stadtIndexierbar);

  return (
    <>
      {/* Kopf: Fach-Icon als Anker und Ziel des Seitenwechsels (B-13) */}
      <PageHeader
        bereich="service-und-termin"
        eyebrow="Vor Ort"
        title="Was wir direkt bei Ihnen erledigen"
        lead="Nicht jede Arbeit lässt sich per Versand lösen. Hier steht, was vor Ort passiert und was dafür vorbereitet sein sollte."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/vor-ort', label: 'Vor-Ort-Leistungen' },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-7">
            <SectionHeading nummer="01" eyebrow="Vor Ort" title="Leistungen im Überblick" />

            {/* Stückliste statt Karten: die ganze Zeile ist der Link zum Ablauf */}
            <ol className="mt-12 border-t border-border">
              {SERVICES.map((service, index) => (
                <li key={service.title} className="group relative border-b border-border">
                  <Link href={service.href} className="absolute inset-0 rounded-lg">
                    <span className="sr-only">
                      {service.title}: {service.cta}
                    </span>
                  </Link>
                  <div className="pointer-events-none grid grid-cols-12 gap-x-4 py-6">
                    <span className="col-span-2 font-mono text-title font-semibold tabular-nums text-area-strong sm:col-span-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="col-span-10 sm:col-span-11">
                      <p className="text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                        {service.title}
                      </p>
                      <p className="mt-2 max-w-measure text-small text-foreground-muted">{service.body}</p>
                      <p className="mt-4 font-mono text-caption uppercase tracking-label text-foreground-muted">
                        Bitte vorbereiten
                      </p>
                      <ul className="mt-2 space-y-1 text-small text-foreground-muted">
                        {service.needs.map((need) => (
                          <li key={need}>· {need}</li>
                        ))}
                      </ul>
                      <span
                        aria-hidden
                        className="mt-4 inline-flex min-h-touch items-center gap-1.5 text-small font-semibold text-primary"
                      >
                        {service.cta}
                        <GlyphPfeilRechts
                          size={16}
                          className="transition-transform duration-quick zeiger:group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-5">
            {/* Fachzeichnung nach Motiv; der Ausschnitt hält die Legende unter 640 px lesbar (KERN 1.8) */}
            <ImagePlaceholder
              slot={{
                motif: 'Montagesituation: Zylindertausch an einer Wohnungstür',
                ratio: '4/3',
                note: 'Echtes Foto aus einem abgeschlossenen Auftrag, Persönlichkeitsrechte beachten.',
                visual: { generator: 'tuer-schutz', params: { fokus: 'zylinder' } },
              }}
              ausschnitt={TUER_SCHUTZ_AUSSCHNITT}
            />

            <Alert tone="legal" title="Nachweis der Verfügungsberechtigung" className="mt-6">
              Vor Arbeiten an Fahrzeugen, Türen und Schließanlagen weisen Sie bitte nach, dass Sie
              über das Objekt verfügen dürfen. Das schützt Sie und uns. Welche Nachweise wir
              benötigen, sagen wir Ihnen bei der Terminbestätigung.
            </Alert>

            {cities.length > 0 && (
              <div className="mt-12 border-t border-border pt-6">
                <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Einsatzgebiete
                </p>
                <p className="mt-2 max-w-measure text-small text-foreground-muted">
                  Werkstatt, Anreise und regionale Leistungen stehen auf diesen Seiten. Bestellungen aus
                  dem Shop liefern wir deutschlandweit.
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4">
                  {cities.map((city) => (
                    <li key={city.id}>
                      <Link
                        href={`/standorte/${city.slug}`}
                        className="inline-flex min-h-touch items-center text-small font-semibold text-primary hover:underline"
                      >
                        {city.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 border-y border-border py-6">
              <p className="text-title-sm font-semibold text-foreground">Terminvorlauf</p>
              <p className="mt-2 max-w-measure text-small text-foreground-muted">
                Termine für Autoschlüssel bieten wir in der Regel ab etwa{' '}
                {settings.booking.leadTimeDays} Tagen an, damit fahrzeugspezifisches Material sicher
                beschafft und vorbereitet werden kann.
              </p>
              <ButtonLink href="/autoschluessel/anfrage" className="mt-4" size="sm">
                Termin starten
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
