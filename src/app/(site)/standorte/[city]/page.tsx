import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { partnerwegAktiv } from '@/lib/auftragsweg';
import { getCities, getCity, getSettings } from '@/lib/data';
import { kontaktweg, kreisAnzeige, partnerbezug, werkstattAnschrift } from '@/lib/orte/ortsseiten';
import { areaByKey } from '@/lib/navigation';
import { enthaeltPlatzhalter, istPlatzhalter } from '@/lib/platzhalter';
import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import { cn } from '@/lib/cn';
import { Erreichbarkeit } from '@/components/vertrauen/erreichbarkeit';
import { erreichbarkeit } from '@/lib/erreichbarkeit';
import { ButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { AreaScope } from '@/components/visual/area-scope';
import { BereichIcon } from '@/components/visual/bereich-icon';
import { EinsatzradiusZeichnung } from '@/components/visual/einsatzradius';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { JsonLd, serviceAreaSchema } from '@/components/seo/json-ld';

import { Quellenvermerk } from '../quellenvermerk';

/** Nur gepflegte, veröffentlichte Ortsseiten bekommen eine Seite, nie die Gemeinden des Stamms (FA-09-08). */
export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await props.params;
  const city = await getCity(slug);
  if (!city) return { title: 'Einsatzgebiet nicht gefunden' };

  return {
    title: city.seo.title,
    description: city.seo.description,
    alternates: { canonical: `/standorte/${city.slug}` },
    // Ohne eigenen Text oder ohne Leistungsweg verspricht die Seite Unbelegtes: nicht in Suchmaschinen (FA-09-05).
    ...(stadtIndexierbar(city) ? {} : { robots: { index: false, follow: true } }),
  };
}

/** Platzhalter aus den Inhalten („[Platzhalter …]“, „… eintragen“) erscheinen nie als Fakt (MENSCHEN M-03). */
const alsFakt = (wert: string) => !istPlatzhalter(wert) && !enthaeltPlatzhalter(wert);

export default async function CityPage(props: { params: Promise<{ city: string }> }) {
  const { city: slug } = await props.params;
  const [city, settings] = await Promise.all([getCity(slug), getSettings()]);

  if (!city) notFound();

  // Die Werkstatt steht in den Einstellungen (Werkstattadresse, sonst Firmensitz). Liegt sie in dieser Gemeinde, zeigt die
  // Seite Anschrift und Erreichbarkeit; liegt sie im Landkreis, nennt der Kopf ihre Anschrift, damit der Knopf
  // „Termin in unserer Werkstatt“ einen Ort hat.
  const werkstatt = werkstattAnschrift(settings.company);
  const werkstattHier = werkstatt && (city.lage?.werkstatt === 'ort' || werkstatt.city === city.city) ? werkstatt : undefined;
  const werkstattImKreis = !werkstattHier && city.lage?.werkstatt === 'kreis' ? werkstatt : undefined;
  // Ort am Stamm (FA-PLATTFORM-03B): Kreis und Postleitzahlen; ohne Postleitzahl im Stamm kein Abschnitt dazu.
  const kreis = kreisAnzeige(city.lage?.kreis ?? null);
  const postleitzahlen = city.lage?.postleitzahlen ?? [];
  const partnerSatz = partnerbezug(city);
  const verfuegbarkeit = city.lage?.verfuegbarkeit && city.verfuegbarkeit ? city.verfuegbarkeit.trim() : null;
  const mitOrtAbschnitt = Boolean(kreis || postleitzahlen.length > 0 || partnerSatz || verfuegbarkeit);
  const weg = kontaktweg(city, partnerwegAktiv(), werkstatt?.city);
  let laufend = 0;
  const nummer = () => String(++laufend).padStart(2, '0');
  const mitRadius = city.onSiteRadiusKm > 0;
  const werkstattImKopf = werkstattHier ?? werkstattImKreis;
  const lead = werkstattImKopf
    ? `Unsere Werkstatt: ${werkstattImKopf.street}, ${werkstattImKopf.postalCode} ${werkstattImKopf.city}. Einsätze vor Ort nur nach Prüfung; Bestellungen aus dem Shop liefern wir innerhalb Deutschlands.`
    : mitRadius
      ? `Vor-Ort-Leistungen im Umkreis von etwa ${city.onSiteRadiusKm}\u00a0km. Bestellungen aus dem Shop liefern wir innerhalb Deutschlands.`
      : 'Einsätze vor Ort nur nach Prüfung. Bestellungen aus dem Shop liefern wir innerhalb Deutschlands.';

  const areas = city.servicesOffered.map((key) => areaByKey(key)).filter(Boolean);
  const einleitung = alsFakt(city.localIntro) ? city.localIntro : null;
  // Angaben, die die Augenbraue (Bundesland) wiederholen, entfallen; die Daten bleiben
  const angaben = city.localFacts.filter((fact) => alsFakt(fact.value) && fact.value !== city.state);

  const crumbs = [
    { href: '/standorte', label: 'Einsatzgebiete' },
    { href: `/standorte/${city.slug}`, label: city.city },
  ];

  // Einleitung und Schriftfeld im Kopf; ohne beides kein leerer Block (PageHeader)
  const schriftfeld =
    einleitung || angaben.length > 0 ? (
      <>
        {einleitung && <p className="max-w-measure text-body text-foreground-muted">{einleitung}</p>}

        {/* Angaben als Schriftfeld: Haarlinien, Wortwerte in Plex Sans, Zahlen in Mono. Platzhalter entfallen. */}
        {angaben.length > 0 && (
          <dl className={cn('grid grid-cols-2 border-y border-border sm:grid-cols-4', einleitung && 'mt-8')}>
            {angaben.map((fact, index) => (
              <div
                key={fact.label}
                className={cn(
                  'py-4 pr-3 sm:pr-4',
                  index % 2 === 1 && 'border-l border-border pl-3 sm:pl-4',
                  index >= 2 && 'border-t border-border sm:border-t-0',
                  index === 2 && 'sm:border-l sm:border-border sm:pl-4',
                )}
              >
                <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  {fact.label}
                </dt>
                <dd
                  className={cn(
                    'mt-1 text-title-sm font-semibold text-foreground',
                    /\d/.test(fact.value) && 'font-mono tabular-nums whitespace-nowrap',
                  )}
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </>
    ) : null;

  return (
    <>
      <JsonLd data={serviceAreaSchema(city, crumbs)} />

      <PageHeader
        eyebrow={city.state}
        title={`Schlüssel- und Schließtechnik in ${city.city}`}
        lead={lead}
        crumbs={crumbs}
        actions={
          <ButtonLink href={weg.href} pfeil>
            {weg.label}
          </ButtonLink>
        }
        visual={<EinsatzradiusZeichnung ort={city.city} radiusKm={city.onSiteRadiusKm} />}
      >
        {schriftfeld}
      </PageHeader>

      {werkstattHier && (
        <Section tight labelledBy="werkstatt-titel">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
            <SectionHeading
              id="werkstatt-titel"
              className="lg:col-span-4"
              nummer={nummer()}
              eyebrow={werkstattHier.label}
              title={`Werkstatt in ${werkstattHier.city}`}
            />
            <div className="lg:col-span-8">
              <address className="text-body not-italic text-foreground">
                {werkstattHier.street}
                <br />
                {werkstattHier.postalCode} {werkstattHier.city}
              </address>
              <p className="mt-6 font-mono text-caption uppercase tracking-label text-foreground-muted">Erreichbarkeit</p>
              <Erreichbarkeit angabe={erreichbarkeit(settings)} className="mt-2 max-w-md" />
            </div>
          </div>
        </Section>
      )}

      {mitOrtAbschnitt && (
        <Section tight labelledBy="ort-titel">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
            <SectionHeading id="ort-titel" className="lg:col-span-4" nummer={nummer()} eyebrow="Region" title={`${city.city} und Umgebung`} />
            <div className="lg:col-span-8">
              {(kreis || postleitzahlen.length > 0) && (
                <dl className="grid gap-6 border-y border-border py-4 sm:grid-cols-2">
                  {kreis && (
                    <div>
                      <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">{kreis.bezeichnung}</dt>
                      <dd className="mt-1 text-body font-semibold text-foreground">{kreis.name}</dd>
                    </div>
                  )}
                  {postleitzahlen.length > 0 && (
                    <div>
                      <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted">Postleitzahlen</dt>
                      <dd className="mt-1 font-mono text-body tabular-nums text-foreground">{postleitzahlen.join(', ')}</dd>
                    </div>
                  )}
                </dl>
              )}
              {verfuegbarkeit && (
                <>
                  <p className="mt-6 font-mono text-caption uppercase tracking-label text-foreground-muted">Verfügbarkeit vor Ort</p>
                  <p className="mt-2 max-w-measure whitespace-pre-line text-body text-foreground">{verfuegbarkeit}</p>
                </>
              )}
              {partnerSatz && <p className="mt-6 max-w-measure text-body text-foreground">{partnerSatz}</p>}
            </div>
          </div>
        </Section>
      )}

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <SectionHeading
            className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
            nummer={nummer()}
            eyebrow="Leistungen"
            title="Bereiche in dieser Region"
          />

          <div className="lg:col-span-8">
            {/* Haarlinienliste wie auf den Bereichsseiten: die ganze Zeile ist der Link, einspaltig */}
            <ul className="border-t border-border">
              {areas.map((area) => (
                <li key={area!.key} className="border-b border-border">
                  <AreaScope area={area!.key}>
                    <Link
                      href={area!.href}
                      className="group flex min-h-touch-lg items-start gap-4 py-5 transition-colors duration-quick sm:gap-6 sm:py-6"
                    >
                      <BereichIcon area={area!.key} size={40} className="mt-0.5 shrink-0 text-area-strong" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-title-sm font-semibold text-foreground transition-colors duration-quick group-hover:text-area-strong">
                          {area!.label}
                        </span>
                        <span className="mt-1 block max-w-measure text-small leading-relaxed text-foreground-muted">
                          {area!.summary}
                        </span>
                      </span>
                      <GlyphPfeilRechts
                        size={18}
                        className="mt-2 shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-area-strong group-focus-visible:text-area-strong"
                      />
                    </Link>
                  </AreaScope>
                </li>
              ))}
            </ul>

            {/* Weiterlesen: interne Links als Stückliste, die ganze Zeile ist der Link */}
            <p className="mt-12 font-mono text-caption uppercase tracking-label text-foreground-muted">Weiterlesen</p>
            <ul className="mt-3 border-t border-border">
              {city.seo.internalLinks.map((link) => (
                <li key={link.href} className="border-b border-border">
                  <Link
                    href={link.href}
                    className="group flex min-h-touch items-center justify-between gap-4 py-4 text-body font-semibold text-foreground transition-colors duration-quick hover:text-primary"
                  >
                    {link.label}
                    <GlyphPfeilRechts
                      size={18}
                      className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Quellenvermerk der Ortsdaten (A-051 Nr. 8), nur wenn die Seite Daten aus dem Stamm zeigt. */}
      {city.lage?.gemeinde && (
        <Section tight>
          <Quellenvermerk mitPostleitzahlen={postleitzahlen.length > 0} />
        </Section>
      )}
    </>
  );
}
