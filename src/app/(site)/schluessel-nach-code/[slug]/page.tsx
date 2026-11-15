import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';

import { getCodeLines } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import { formatCents, formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Accordion } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { JsonLd, codelinieSchema } from '@/components/seo/json-ld';
import { GpsrAngaben } from '@/components/recht/gpsr-angaben';
import { werkstattAngaben } from '@/components/vertrauen/werkstatt-zeile';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphOrt } from '@/components/visual/glyphen/ort';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { CodeFundstelleInteraktiv } from '@/components/visual/interaktiv/code-fundstelle-interaktiv';
import { PROFILSCHNITT_GROESSE } from '@/components/visual/generators/profilschnitt';

import { BestellFormular } from './bestell-formular';
import { CodeAusAdresse } from './code-aus-adresse';
import { LinienListe } from '../linien-liste';
import { RATGEBER_FUNDSTELLE, shopDaten } from '../shop-daten';
import {
  codelinieAufloesen,
  codelinieIndexierbar,
  codelinienFamilie,
  codelinienKennung,
  codelinienPfad,
  codelinienTitel,
  gepflegt,
  herstellerDerLinie,
  herstellerPfad,
  kategoriePfad,
} from '@/lib/codelinie';
import { codelinienTexte, staffelStufen } from '@/lib/codelinie-texte';
import { VERFUEGBARKEIT_LABEL, istBestellbar, verfuegbarkeitVon } from '@/lib/data/shop';
import { codeAnfragePfad } from '@/lib/wege/code-anfrage';
import { VerfuegbarkeitHinweis } from '../verfuegbarkeit-hinweis';

/** Telefon-Ausschnitt des Profilschnitts (viewBox 480 × 360): Halm ab der Schulter, die Reide samt Kontur (bis x 125,1) ganz außerhalb; Nummern, Spitze, Fräser und Bemaßung (bis y 282) innen; rechter Rand wie PROFILSCHNITT_AUSSCHNITT (462). Schrift 11,5 px bei 320 px Zeichnungsbreite (360 px Viewport), etwa 10 px bei 280 px (320 px Viewport), darunter die Kern-Mindestgröße (K-008). */
const PROFILSCHNITT_HALM = {
  x: 128,
  y: 98,
  breite: 334,
  hoehe: 190,
  vollBreite: PROFILSCHNITT_GROESSE.breite,
  vollHoehe: PROFILSCHNITT_GROESSE.hoehe,
} as const;

interface CodeLinePageProps {
  /** In Next.js 16 sind Routenparameter ein Promise. */
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const lines = await getCodeLines();
  return lines.map((line) => ({ slug: line.slug }));
}

/**
 * Adressen außerhalb von `generateStaticParams` werden bei Bedarf erzeugt:
 * eine neu angelegte Linie ebenso wie die frühere Adresse einer Linie, deren
 * Slug im Backend geändert wurde — sie leitet über die feste Kennung dauerhaft
 * auf die neue Adresse weiter. Unbekanntes führt auf die 404-Seite.
 */
export const dynamicParams = true;

/** Linie samt Texten; leitet eine frühere Adresse dauerhaft weiter. */
async function laden(slug: string) {
  const daten = await shopDaten();
  const treffer = codelinieAufloesen(daten.lines, slug);
  if (treffer?.weiterleitung) permanentRedirect(treffer.weiterleitung);
  if (!treffer?.line) return null;
  const line = treffer.line;
  const texte = codelinienTexte(line, {
    alle: daten.lines,
    versand: daten.settings.shipping,
    ratgeber: daten.ratgeber,
  });
  // Hersteller laut Stammliste (Seite nur, wenn er Linien hat) und die Unterkategorie aus den Daten, falls zugeordnet.
  const herstellerAngabe = herstellerDerLinie(line, daten.stamm);
  const herstellerSeite = daten.hersteller.find((h) => h.name === herstellerAngabe.name);
  const kategorie = daten.kategorien.find((k) => k.kategorie.id === line.categoryId)?.kategorie;
  return { ...daten, line, texte, herstellerName: herstellerAngabe.name, herstellerSeite, kategorie };
}

export async function generateMetadata(props: CodeLinePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const geladen = await laden(slug);

  if (!geladen) {
    return { title: 'Codelinie nicht gefunden', robots: { index: false, follow: true } };
  }
  const { line, texte } = geladen;

  return {
    title: texte.metaTitel,
    description: texte.metaBeschreibung,
    alternates: { canonical: codelinienPfad(line) },
    ...(codelinieIndexierbar(line) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CodeLinePage(props: CodeLinePageProps) {
  const { slug } = await props.params;
  const geladen = await laden(slug);

  if (!geladen) notFound();
  const { line, texte, settings, ratgeber, herstellerName, herstellerSeite, kategorie } = geladen;

  const kennung = codelinienKennung(line);
  const familie = codelinienFamilie(line);
  const hersteller = herstellerName;
  const system = gepflegt(line.system);
  const stufen = staffelStufen(line);
  // Verfügbarkeit (FA-22-10): Nur lieferbare Linien zeigen den Kaufbereich, Bestellangaben und ein Angebot in den Strukturdaten (R8).
  const verfuegbarkeit = verfuegbarkeitVon(line);
  const bestellbar = verfuegbarkeit === 'lieferbar';

  // Nur gepflegte Angaben: Platzhalter (etwa „[Hersteller eintragen]“) und leere Felder entfallen.
  const facts: Array<{ label: string; value: string | undefined; mono?: boolean }> = [
    { label: 'Hersteller', value: hersteller },
    { label: 'System', value: system },
    { label: 'Codebereich', value: gepflegt(line.codeRange), mono: true },
    { label: 'Lieferzeit', value: bestellbar ? gepflegt(line.deliveryTime) : undefined },
    { label: 'Profil', value: gepflegt(line.profile) },
    { label: 'Codeserie', value: gepflegt(line.codeSeries) },
    { label: 'Anwendung', value: gepflegt(line.application) },
    { label: 'Anwendungsfamilie', value: gepflegt(familie) },
    { label: 'Schlüsseltyp', value: gepflegt(line.keyType) },
    {
      label: 'Codeformat',
      value: gepflegt(line.codeFormatLabel) && `${line.codeFormatLabel} (Beispiel: ${line.codeExample})`,
      mono: true,
    },
    { label: 'Lieferumfang', value: gepflegt(line.scope) },
    { label: 'Stückzahl je Bestellung', value: bestellbar ? `1 bis ${formatNumber(line.maxQty)} Stück` : undefined, mono: true },
    {
      label: 'Staffelpreise',
      value: bestellbar && stufen.length
        ? stufen.map((s) => `ab ${formatNumber(s.minQty)} Stück: ${formatCents(s.priceCents)}`).join(' · ')
        : undefined,
      mono: true,
    },
    {
      label: 'Versand',
      value: bestellbar && texte.versand.length
        ? texte.versand
            .map((o) => `${o.label}: ${o.priceCents > 0 ? formatCents(o.priceCents) : 'ohne Versandkosten'}`)
            .join(' · ')
        : undefined,
    },
  ];
  const technik = facts.filter((fact): fact is { label: string; value: string; mono?: boolean } => Boolean(fact.value));

  // Pflichtlinks laut Leitfaden, ergänzt um Kategorie, Hersteller und die gepflegten Ziele der Codelinie.
  const baseLinks = [
    ...(herstellerSeite ? [{ href: herstellerPfad(herstellerSeite.adresse), label: `Codelinien von ${herstellerSeite.name}` }] : []),
    ...(kategorie ? [{ href: kategoriePfad(kategorie.slug), label: `Alle Codelinien: ${kategorie.name}` }] : []),
    { href: '/schluessel-nach-code', label: 'Alle Codelinien' },
    { href: codeAnfragePfad({ schloss: line.name }), label: 'Code passt nicht? Code anfragen' },
    { href: '/schluessel-nach-vorlage', label: 'Kein Code? Schlüssel nach Vorlage' },
    { href: `/ratgeber/${RATGEBER_FUNDSTELLE}`, label: 'Ratgeber: Wo finde ich den Code?' },
  ];
  // Die Startwerte führen die Übersicht ein zweites Mal; doppelte Ziele entfallen.
  const links = [
    ...baseLinks,
    ...line.seo.internalLinks.filter((link) => !baseLinks.some((b) => b.href === link.href)),
  ];
  // Brotkrumen: Schlüssel nach Code › Hersteller (oder Kategorie) › Produkt; nur Stufen mit eigener Seite.
  const crumbs = [
    { href: '/schluessel-nach-code', label: 'Schlüssel nach Code' },
    ...(herstellerSeite
      ? [{ href: herstellerPfad(herstellerSeite.adresse), label: herstellerSeite.name }]
      : kategorie
        ? [{ href: kategoriePfad(kategorie.slug), label: kategorie.name }]
        : []),
    { href: codelinienPfad(line), label: codelinienTitel(line) },
  ];
  const titel = codelinienTitel(line);
  const produktbild = line.productImage.bild ? line.productImage : undefined;
  const verwandtTitel = system && hersteller ? `${hersteller} ${system}` : familie;
  const ratgeberVorhanden = Boolean(ratgeber);

  return (
    <>
      {/* Ein Graph je Seite (FA-SHOP-01B, 4a): Webseite, Brotkrumen, Fragen; Produkt mit Angebot nur bei echtem Preis (R8). */}
      <JsonLd
        data={codelinieSchema({
          line,
          beschreibung: texte.beschreibung,
          crumbs,
          faq: texte.faq,
          hersteller,
          angebot: istBestellbar(line),
        })}
      />
      <PageHeader
        eyebrow={`${kennung} · ${bestellbar ? PROCESS_LABELS.direktkauf.label : VERFUEGBARKEIT_LABEL[verfuegbarkeit]}`}
        title={titel}
        lead={texte.einleitung}
        crumbs={crumbs}
        visual={
          produktbild ? (
            /* Produktbild im Kopf (FA-11-11), wenn ein eigenes Foto hinterlegt ist */
            <figure className="m-0">
              <ImagePlaceholder slot={produktbild} sizes="(min-width: 1024px) 40vw, 100vw" />
            </figure>
          ) : (
          /* Blickfang im Kopf (K-006): die Fräsbahn zum Beispielcode der Codelinie, ohne Kartenrahmen */
          <figure className="m-0">
            <ImagePlaceholder
              frei
              sizes="(min-width: 1024px) 40vw, 100vw"
              ausschnitt={PROFILSCHNITT_HALM}
              className="sm24-ausschnitt-bemasst"
              slot={{
                motif: `Fräsbahn zum Beispielcode ${line.codeExample}`,
                ratio: '4/3',
                visual: { generator: 'profilschnitt', params: { code: line.codeExample } },
              }}
            />
            <figcaption className="mt-2 font-mono text-caption uppercase tracking-label text-foreground-muted">
              Darstellung zum Beispielcode {line.codeExample},{' '}
              <span className="whitespace-nowrap">keine echte Schließung</span>
            </figcaption>
          </figure>
          )
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline">
            <GlyphHaken size={14} className="shrink-0" />
            Ohne Einsendung des Originalschlüssels
          </Badge>
          {gepflegt(line.keyType) && <Badge tone="outline">{line.keyType}</Badge>}
          <Badge tone="outline">
            Codeformat: <span className="font-mono font-medium tabular-nums text-foreground">{line.codeFormatLabel}</span>
          </Badge>
        </div>
      </PageHeader>

      <Section tight>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-gutter">
          {/* Bestellung steht im DOM zuerst: mobil oben, ab lg rechts. Lese- und Fokusfolge entsprechen der Sichtfolge. */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8 lg:row-start-1">
            {bestellbar ? (
              /* Code aus der Adresse (?code=) liest eine Client-Komponente; die Grenze hält die Seite statisch. */
              <>
                <Suspense fallback={<BestellFormular line={line} werkstatt={werkstattAngaben(settings.company)} />}>
                  <CodeAusAdresse line={line} werkstatt={werkstattAngaben(settings.company)} />
                </Suspense>
                {/* Code passt nicht eindeutig (FA-11-17): die Anfrage steht neben dem Bestellformular. */}
                <p className="mt-4 text-small text-foreground-muted">
                  Ihr Code passt nicht sicher zu dieser Linie?{' '}
                  <Link
                    href={codeAnfragePfad({ schloss: line.name })}
                    prefetch={false}
                    className="inline py-1 -my-1 font-semibold text-primary hover:underline"
                  >
                    Code anfragen
                  </Link>
                </p>
              </>
            ) : (
              <VerfuegbarkeitHinweis
                verfuegbarkeit={verfuegbarkeit}
                was="Diesen Schlüssel"
                anfrage={{ href: codeAnfragePfad({ schloss: line.name }), label: 'Code anfragen' }}
                uebersicht={{ href: '/schluessel-nach-code', label: 'Alle Codelinien' }}
              />
            )}
          </div>

          {/* Codefundstelle, Angaben, Hinweis und Passende Seiten: ab lg links, füllen die Spalte unter dem Kopf */}
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            {/* Großer Moment (B-16): Fundstelle als Zeichnung, solange kein Foto hinterlegt ist */}
            <div>
              <SectionHeading nummer="01" eyebrow="Codefundstelle" title="Wo steht der Code?" />
              {texte.fundstelle && <p className="prose-sm24 mt-4">{texte.fundstelle}</p>}
              {gepflegt(line.codeHint) && <p className="prose-sm24 mt-4">{line.codeHint}</p>}

              {line.codeLocationImage.bild ? (
                <figure className="m-0 mt-6 sm:max-w-md">
                  <ImagePlaceholder slot={line.codeLocationImage} />
                  <figcaption className="mt-2 flex items-start gap-1.5 text-caption leading-snug text-foreground-muted">
                    <GlyphOrt size={16} className="mt-0.5 shrink-0" />
                    <span>So finden Sie den Code an Schloss und Schlüssel.</span>
                  </figcaption>
                </figure>
              ) : (
                <CodeFundstelleInteraktiv className="mt-6" />
              )}

              <p className="prose-sm24 mt-4">
                Sie finden den Code nicht?{' '}
                {ratgeberVorhanden && (
                  <>
                    <Link
                      href={`/ratgeber/${RATGEBER_FUNDSTELLE}`}
                      className="inline py-1 -my-1 font-semibold text-primary hover:underline"
                    >
                      Der Ratgeber zeigt die üblichen Fundstellen.
                    </Link>{' '}
                  </>
                )}
                Ohne Code ist{' '}
                <Link
                  href="/schluessel-nach-vorlage"
                  className="inline py-1 -my-1 font-semibold text-primary hover:underline"
                >
                  Schlüssel nach Vorlage
                </Link>{' '}
                der passende Weg.
              </p>
            </div>

            {/* Schriftfeld-Liste: Haarlinien statt Karte, Codeformat und Stückzahl in Mono; der Lieferumfang steht als erster Absatz davor */}
            <div className="mt-12">
              <SectionHeading nummer="02" eyebrow="Angaben" title="Technische Angaben" />
              <p className="prose-sm24 mt-4">{texte.beschreibung}</p>
              <dl className="mt-6 border-t border-border">
                {technik.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4"
                  >
                    <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng sm:col-span-4">
                      {fact.label}
                    </dt>
                    <dd
                      className={cn('text-body text-foreground sm:col-span-8', fact.mono && 'font-mono tabular-nums')}
                    >
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <GpsrAngaben info={line.gpsr} className="mt-12" />

            <Alert tone="legal" title="Anfertigung nach Ihrer Codeangabe" className="mt-10">
              <p>
                Dieser Schlüssel wird eigens für Sie nach dem Code gefertigt, den Sie angeben. Ein
                falsch eingegebener Code führt zu einem nicht passenden Schlüssel.
                {bestellbar && ' Bitte prüfen Sie Ihre Eingabe deshalb vor dem Absenden.'}
              </p>
              <p className="mt-2">
                Weil der Schlüssel nach Ihrer Angabe angefertigt wird, besteht nach § 312g Abs. 2
                Nr. 1 BGB kein Widerrufsrecht. Einzelheiten stehen unter{' '}
                <Link
                  href="/rechtliches/widerruf"
                  className="inline py-1 -my-1 font-semibold text-primary hover:underline"
                >
                  Widerruf und Rückgabe
                </Link>
                .
              </p>
            </Alert>

            {/* Häufige Fragen: Antworten aus den Daten genau dieser Linie */}
            {texte.faq.length > 0 && (
              <div className="mt-12">
                <SectionHeading nummer="03" eyebrow="Fragen" title={`Häufige Fragen zu ${kennung}`} />
                <Accordion items={texte.faq} className="mt-6" />
              </div>
            )}

            {/* Verwandte Linien derselben Familie als echte Links */}
            {texte.verwandte.length > 0 && (
              <div className="mt-12">
                <SectionHeading
                  nummer="04"
                  eyebrow={system ? 'Gleiches System' : 'Gleiche Familie'}
                  title={`Weitere Codelinien: ${verwandtTitel}`}
                />
                <LinienListe lines={texte.verwandte} className="mt-6" />
              </div>
            )}

            {/* Stückliste mit Haarlinien: die ganze Zeile ist der Link */}
            <div className="mt-12">
              <SectionHeading
                nummer="05"
                eyebrow="Weiter im Bereich"
                title="Passende Seiten zu dieser Codelinie"
              />

              <ol className="mt-6 border-t border-border">
                {links.map((link, index) => (
                  <li key={link.href} className="border-b border-border">
                    <Link
                      href={link.href}
                      className="group flex min-h-touch items-center gap-4 py-5 transition-colors duration-quick ease-standard sm:gap-6"
                    >
                      <span className="w-6 shrink-0 font-mono text-caption tabular-nums text-foreground-muted sm:w-8">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1 text-title-sm font-semibold text-foreground group-hover:text-primary">
                        {link.label}
                      </span>
                      <GlyphPfeilRechts
                        size={18}
                        className="shrink-0 text-foreground-muted transition-transform duration-base ease-standard group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
