import type { Metadata } from 'next';
import Link from 'next/link';

import { getCities, getSettings } from '@/lib/data';
import { standort } from '@/lib/rechtliches/firma';
import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

/** Nur Einsatzgebiete ohne Platzhalter erscheinen — sonst versprächen sie Leistungen, die nicht belegt sind. */
async function sichtbareGebiete() {
  return (await getCities()).filter(stadtIndexierbar);
}

export async function generateMetadata(): Promise<Metadata> {
  const gebiete = await sichtbareGebiete();
  return {
    title: 'Einsatzgebiete',
    description:
      'Vor-Ort-Leistungen nach Absprache, Versand von Schlüsseln und Zylindern innerhalb Deutschlands.',
    alternates: { canonical: '/standorte' },
    // Ohne fertig gepflegtes Gebiet hat die Seite keinen eigenen Inhalt für Suchmaschinen.
    ...(gebiete.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function StandortePage() {
  const [cities, settings] = await Promise.all([sichtbareGebiete(), getSettings()]);
  const werkstatt = standort(settings.company);

  return (
    <>
      <PageHeader
        eyebrow="Einsatzgebiete"
        title={cities.length > 0 ? 'Vor Ort und deutschlandweit' : 'Werkstatt und Versand'}
        lead={
          cities.length > 0
            ? 'Schlüssel nach Code und gleichschließende Zylinder versenden wir innerhalb Deutschlands. Was wir in den aufgeführten Orten anbieten, steht auf der jeweiligen Seite.'
            : 'Schlüssel nach Code und gleichschließende Zylinder versenden wir innerhalb Deutschlands. Vor-Ort-Leistungen stimmen wir im Einzelfall mit Ihnen ab.'
        }
        crumbs={[{ href: '/standorte', label: 'Einsatzgebiete' }]}
        visual={
          <ImagePlaceholder
            slot={{
              motif: 'Einsatzgebiete: Anfrage, Termin und Einsatz vor Ort',
              ratio: '16/9',
              visual: { generator: 'schluessel', params: { typ: 'zylinder' } },
            }}
          />
        }
      />

      <Section>
        {werkstatt && (
          <p className="mb-10 flex max-w-measure items-start gap-3 text-body text-foreground-muted">
            <GlyphOrt size={20} className="mt-1 shrink-0 text-primary" />
            <span>
              <span className="font-semibold text-foreground">{werkstatt.label}:</span> {werkstatt.street},{' '}
              {werkstatt.postalCode} {werkstatt.city}
            </span>
          </p>
        )}

        {cities.length > 0 && (
          <>
            <SectionHeading
              nummer="01"
              eyebrow="Vor-Ort-Gebiete"
              title="Regionen"
              lead="Jeder Ort hat eigene Angaben zu Werkstatt, Anreise und angebotenen Leistungen."
            />

            {/* Stückliste mit Haarlinien: die ganze Zeile ist der Link. Mobil eine Spalte, ab 768 px zwei. */}
            <ul className="mt-10 border-t border-border md:grid md:grid-cols-2 md:gap-x-gutter">
              {cities.map((city) => (
                <li key={city.id} className="border-b border-border">
                  <Link
                    href={`/standorte/${city.slug}`}
                    className="group flex min-h-touch-lg items-center gap-4 py-5 transition-colors duration-quick sm:gap-6 sm:py-6"
                  >
                    <GlyphOrt size={24} className="shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-primary">
                        {city.city}
                      </span>
                      <span className="mt-1 block text-small text-foreground-muted">
                        {city.state} ·{' '}
                        {city.onSiteRadiusKm > 0 ? (
                          <>
                            Einsatzradius etwa{' '}
                            <span className="whitespace-nowrap font-mono tabular-nums text-foreground">{city.onSiteRadiusKm} km</span>
                          </>
                        ) : (
                          'Einsätze vor Ort nach Prüfung'
                        )}
                      </span>
                    </span>
                    <GlyphPfeilRechts
                      size={18}
                      className="shrink-0 text-foreground-muted transition-transform duration-quick group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <Alert
          tone="info"
          title={cities.length > 0 ? 'Ihre Region ist nicht dabei?' : 'Vor-Ort-Leistungen'}
          className={cities.length > 0 ? 'mt-10' : undefined}
        >
          Bestellungen aus dem Shop liefern wir innerhalb Deutschlands. Für Vor-Ort-Leistungen
          {cities.length > 0 ? ' außerhalb der aufgeführten Gebiete' : ''} stellen Sie bitte eine{' '}
          <Link href="/service-und-termin/anfrage" className="font-semibold underline">
            allgemeine Anfrage
          </Link>{' '}
          — wir sagen Ihnen, was möglich ist.
        </Alert>
      </Section>
    </>
  );
}
