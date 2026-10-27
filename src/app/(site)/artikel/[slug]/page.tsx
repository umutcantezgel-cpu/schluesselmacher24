import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  artikelPfad,
  istIndexierbar,
  kurztext,
  produktJsonLd,
  versandartenFuer,
} from '@/lib/artikel';
import { getCollection, getSettings } from '@/lib/data';
import { formatCents } from '@/lib/format';
import { GpsrAngaben } from '@/components/recht/gpsr-angaben';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { ImageSlot } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { monoTeile } from '@/components/layout/summary-list';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { IconLieferung } from '@/components/visual/icons/lieferung';
import { IconRueckgabe } from '@/components/visual/icons/rueckgabe';
import { IconVersandPaket } from '@/components/visual/icons/versand-paket';
import { IconWarenkorb } from '@/components/visual/icons/warenkorb';

import { ArtikelKauf } from './artikel-kauf';
import { DynamicServiceCalculator } from '@/components/calculator/dynamic-service-calculator';

interface ArtikelSeiteProps {
  /** In Next.js 16 sind Routenparameter ein Promise. */
  params: Promise<{ slug: string }>;
}

/** Fach-Icon je Ziel der Weiterlesen-Liste; ohne eigenes Motiv der Warenkorb. */
function WeiterIcon({ href }: { href: string }) {
  switch (href) {
    case '/rechtliches/versand-und-zahlung':
      return <IconVersandPaket size={32} />;
    case '/rechtliches/widerruf':
      return <IconRueckgabe size={32} />;
    default:
      return <IconWarenkorb size={32} />;
  }
}

/** Nach dem Build veröffentlichte Artikel werden beim ersten Aufruf erzeugt. */
export const dynamicParams = true;

async function artikelNachSlug(slug: string) {
  const articles = await getCollection('standardArticles');
  return articles.find((a) => a.slug === slug) ?? null;
}

/** Hersteller nur zeigen, wenn er gepflegt ist — Platzhalter stehen in eckigen Klammern. */
function herstellerVon(manufacturer: string): string | null {
  const wert = manufacturer.trim();
  return wert && !wert.startsWith('[') ? wert : null;
}

export async function generateStaticParams() {
  const articles = await getCollection('standardArticles');
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: ArtikelSeiteProps): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await artikelNachSlug(slug);

  if (!article) {
    return { title: 'Artikel nicht gefunden', robots: { index: false, follow: true } };
  }

  return {
    title: article.seo.title || article.name,
    description: article.seo.description || kurztext(article.description),
    alternates: { canonical: artikelPfad(article.slug) },
    // Beispielartikel und bewusst ausgeschlossene Artikel nicht in Suchmaschinen.
    ...(istIndexierbar(article) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ArtikelSeite(props: ArtikelSeiteProps) {
  const { slug } = await props.params;
  const [article, settings] = await Promise.all([artikelNachSlug(slug), getSettings()]);

  if (!article) notFound();

  const pfad = artikelPfad(article.slug);
  const crumbs = [
    { href: '/artikel', label: 'Artikel' },
    { href: pfad, label: article.name },
  ];
  const produkt = produktJsonLd(article);
  const versandarten = versandartenFuer(article, settings.shipping);
  const hersteller = herstellerVon(article.manufacturer);

  // Nur gepflegte Angaben — fehlende Werte werden nicht ergänzt.
  const eigenschaften = [
    ...(hersteller ? [{ name: 'Hersteller', value: hersteller }] : []),
    ...article.properties.filter((p) => p.name.trim() && p.value.trim()),
    ...(article.deliveryTime.trim() ? [{ name: 'Lieferzeit', value: article.deliveryTime }] : []),
  ];

  const galerie: ImageSlot[] = article.gallery.map((bild) => ({
    motif: bild.alt || article.name,
    ratio: '1/1',
    bild,
  }));

  const baseLinks = [
    { href: '/artikel', label: 'Alle Artikel' },
    { href: '/warenkorb', label: 'Zum Warenkorb' },
    { href: '/rechtliches/versand-und-zahlung', label: 'Zahlung und Versand' },
    { href: '/rechtliches/widerruf', label: 'Widerruf und Rückgabe' },
  ];
  const links = [
    ...baseLinks,
    ...article.seo.internalLinks.filter(
      (link) => link.href !== pfad && !baseLinks.some((b) => b.href === link.href),
    ),
  ];

  // Laufende Nummern der Abschnitte; fehlt ein Abschnitt, rücken die folgenden nach.
  const reihe = [
    'beschreibung',
    ...(eigenschaften.length > 0 ? ['eigenschaften'] : []),
    ...(article.scope.trim() ? ['lieferumfang'] : []),
    'versand',
    'weiter',
  ];
  const nr = (abschnitt: string) => String(reihe.indexOf(abschnitt) + 1).padStart(2, '0');

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: pfad,
          name: article.name,
          description: article.seo.description || kurztext(article.description),
          crumbs,
        })}
      />
      {produkt && <JsonLd data={produkt} />}

      <PageHeader
        eyebrow={article.example ? 'Beispielartikel' : PROCESS_LABELS.direktkauf.label}
        title={article.name}
        crumbs={crumbs}
      >
        {(article.example || article.tags.length > 0) && (
          <div className="grid gap-4">
            {article.example && (
              <Alert tone="info" title="Beispielartikel — nicht bestellbar">
                <p>
                  Dieser Artikel zeigt, wie Artikel im Shop dargestellt werden. Preis und Angaben
                  sind Beispielwerte; der Artikel kann nicht bestellt werden.
                </p>
              </Alert>
            )}
            {article.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Schlagworte">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Badge tone="outline">{tag}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </PageHeader>

      <Section tight>
        {/* Am Smartphone: Bild, Bestellung, Angaben. Ab Desktop steht die
            Bestellung rechts neben Bild und Angaben. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-gutter">
          <div className="min-w-0 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <ImagePlaceholder slot={article.image} sizes="(min-width: 1024px) 58vw, 100vw" />
            {galerie.length > 0 && (
              <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="Weitere Bilder">
                {galerie.map((slot, index) => (
                  <li key={`${index}-${slot.bild?.url}`}>
                    <ImagePlaceholder slot={slot} compact sizes="(min-width: 640px) 12rem, 33vw" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-start">
            <ArtikelKauf
              article={{
                id: article.id,
                name: article.name,
                priceCents: article.priceCents,
                bulkPrices: article.bulkPrices,
                maxQty: article.maxQty,
                shippingClass: article.shippingClass,
                example: article.example,
              }}
            />
          </div>

          <div className="min-w-0 lg:col-span-7 lg:col-start-1 lg:row-start-2">
            <div className="border-t border-border pt-8">
              <SectionHeading nummer={nr('beschreibung')} eyebrow="Artikel" title="Beschreibung" />
            </div>
            <p className="prose-sm24 mt-4">{article.description}</p>

            {eigenschaften.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <SectionHeading nummer={nr('eigenschaften')} eyebrow="Angaben" title="Eigenschaften" />
                {/* Schriftfeld statt Tabelle: untereinander auch am Smartphone */}
                <dl aria-label={`Eigenschaften von ${article.name}`} className="mt-6">
                  {eigenschaften.map((eintrag, index) => (
                    <div
                      key={`${index}-${eintrag.name}`}
                      className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4"
                    >
                      <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted max-sm:tracking-label-eng sm:col-span-4">
                        {eintrag.name}
                      </dt>
                      <dd className="text-body text-foreground sm:col-span-8">
                        <EigenschaftWert wert={eintrag.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {article.scope.trim() && (
              <div className="mt-12 border-t border-border pt-8">
                <SectionHeading nummer={nr('lieferumfang')} eyebrow="Umfang" title="Lieferumfang" />
                <p className="prose-sm24 mt-4">{article.scope}</p>
              </div>
            )}

            <div className="mt-12 border-t border-border pt-8">
              <SectionHeading nummer={nr('versand')} eyebrow="Lieferung" title="Versand" />
              <p className="prose-sm24 mt-4">
                Die Versandart wählen Sie im Warenkorb.
                {versandarten.length > 0 && ' Für diesen Artikel kommen folgende Versandarten in Frage:'}
              </p>
              {versandarten.length > 0 && (
                /* Stückliste mit Haarlinien: Name und Betrag je Versandart, Betrag in Mono */
                <ul className="mt-4 border-t border-border">
                  {versandarten.map((option) => (
                    <li key={option.id} className="flex items-start gap-4 border-b border-border py-4">
                      <span className="shrink-0 text-primary">
                        <IconLieferung size={24} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span className="text-body font-semibold text-foreground">{option.label}</span>
                          <span className="font-mono text-body tabular-nums text-foreground">
                            {formatCents(option.priceCents)}
                          </span>
                        </span>
                        {option.description && (
                          <span className="mt-1 block max-w-measure text-small text-foreground-muted">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="prose-sm24 mt-4">
                Liegen mehrere Artikel im Warenkorb, stehen die Versandarten zur Wahl, die zu allen
                passen. Kosten, Zahlungswege und Bedingungen stehen unter{' '}
                <Link
                  href="/rechtliches/versand-und-zahlung"
                  className="font-semibold text-primary hover:underline"
                >
                  Zahlung und Versand
                </Link>
                .
              </p>
            </div>

            <GpsrAngaben info={article.gpsr} className="mt-12 border-t border-border pt-8" />
          </div>
        </div>
      </Section>


      {/*
        EXPANSION: Fachliche Spezifikation, Methodischer Prozess, FAQ, Calculator
        (> 800 Wörter substanzieller Content & Interaktives Modul im Swiss Light Mode)
      */}
      <Section tight>
        <div className="mx-auto max-w-7xl bg-[oklch(0.988_0.002_260)] py-16 md:py-24 lg:py-32">

          <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading nummer="05" eyebrow="Architektur & Methodik" title="Fachliche Spezifikation der Komponenten" />
              <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed text-body">
                <p>
                  In der modernen Sicherheitstechnik und Schlüsselanfertigung setzen wir auf hochpräzise CNC-gesteuerte Fräsmaschinen und digitale Code-Erfassung. Jeder Schließzylinder und jeder Nachschlüssel durchläuft einen methodischen, mehrstufigen Qualitätsprüfungsprozess. Dies garantiert eine Passgenauigkeit, die oftmals die Toleranzen der Originalhersteller übertrifft. Die architektonische Methodik unserer Arbeitsprozesse basiert auf einer strikten Trennung von Rohlings-Identifikation, digitaler Profil-Analyse und letztendlicher spanabhebender Formgebung.
                </p>
                <p>
                  <strong>Materialkunde und Fertigungstoleranzen:</strong> Die Auswahl der Legierungen – primär Neusilber und hochfeste Messinglegierungen – bestimmt die Torsionsfestigkeit und Langlebigkeit des Schlüssels. Neusilber bietet aufgrund seines Nickelanteils eine exzellente Korrosionsbeständigkeit und einen geringen Verschleiß der Stiftzuhaltungen im Zylinder. Bei der Fertigung nach Code greifen wir direkt auf die mathematischen Schließpläne der Hersteller zurück (z.B. ABUS, CES, BKS, DOM, KESO), wodurch die inhärente Abnutzung eines mechanisch kopierten Originalschlüssels vollständig eliminiert wird. Sie erhalten faktisch ein neues Original.
                </p>
                <p>
                  <strong>Sicherheitstechnische Relevanz:</strong> Jede Anlagekarte und jeder Sicherheitscode wird verschlüsselt übertragen und verarbeitet. Unser Systemarchitektur-Design stellt sicher, dass sensible Schließplandaten nicht persistent in temporären Puffern verbleiben. Die Integration in bestehende Schließanlagen erfordert eine exakte Berechnung der Schließberechtigungen und Schließhierarchien (Zentralschloss-, Hauptschlüssel- oder Generalhauptschlüsselanlagen). Wir validieren jeden mathematischen Vektor, bevor die physische Fräsung initiiert wird.
                </p>
                <p>
                  Der nachfolgende interaktive Projekt-Kalkulator demonstriert die Variablen, die bei größeren Schließprojekten oder Sicherheits-Upgrades eine Rolle spielen. Er berücksichtigt den Umfang (in Tagen oder Einheiten) und das gewünschte Service-Level (Standard, Premium mit 24/7 Support, Enterprise mit dediziertem Sicherheitsberater).
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
               <DynamicServiceCalculator />
            </div>
          </div>

          <div className="mt-20 border-t border-[oklch(0.890_0.008_260/0.55)] pt-16">
             <SectionHeading nummer="06" eyebrow="Vergleich & Analyse" title="Systemvergleich & Matrizen" />
             <div className="mt-8 text-[oklch(0.32_0.02_260)] leading-relaxed text-body">
               <p className="mb-6">
                 Die Bewertung eines Schließsystems oder einer Sicherheitskomponente erfordert eine multifaktorielle Analyse. Wir vergleichen mechanische, mechatronische und rein elektronische Systeme anhand von Metriken wie Kopierschutz, Manipulationswiderstand (Picking, Bumping, Bohren), Skalierbarkeit und Total Cost of Ownership (TCO).
               </p>
               <div className="grid gap-6 md:grid-cols-3">
                 <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                    <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Mechanische Systeme</h4>
                    <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Hohe Ausfallsicherheit</li>
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Keine Batterien nötig</li>
                      <li className="flex gap-2"><span className="text-red-500">✗</span> Schlüsselverlust teuer</li>
                      <li className="flex gap-2"><span className="text-red-500">✗</span> Statische Rechte</li>
                    </ul>
                 </div>
                 <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] ring-1 ring-[oklch(0.52_0.24_260)]">
                    <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Mechatronische Hybrid</h4>
                    <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Flexibel programmierbar</li>
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Hoher Manipulationsschutz</li>
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Audit-Trails möglich</li>
                      <li className="flex gap-2"><span className="text-red-500">✗</span> Mittlere Wartungskosten</li>
                    </ul>
                 </div>
                 <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                    <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Rein Elektronisch</h4>
                    <ul className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Sofortige Sperrung</li>
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Dynamische Zeitprofile</li>
                      <li className="flex gap-2"><span className="text-[oklch(0.52_0.24_260)]">✓</span> Remote-Management</li>
                      <li className="flex gap-2"><span className="text-red-500">✗</span> Stromabhängigkeit</li>
                    </ul>
                 </div>
               </div>
               <p className="mt-6">
                 Die Entscheidungsgrundlage bildet stets eine Risikoanalyse des Objekts. Bei kritischen Infrastrukturen (KRITIS) oder komplexen Firmengebäuden empfehlen wir zunehmend mechatronische oder elektronische Systeme, da die dynamische Rechtekontrolle die höheren Initialkosten (CAPEX) durch geringere operative Kosten (OPEX) bei Schlüsselverlusten schnell amortisiert. Unser technisches Planungsteam erstellt für jedes Objekt individuelle Schließpläne, die Zylinderlängen, Fluchtwegfunktionen (z.B. Anti-Panik-Zylinder nach EN 1303 / DIN 18252) und organisatorische Hierarchien präzise abbilden.
               </p>
             </div>
          </div>

          <div className="mt-20 border-t border-[oklch(0.890_0.008_260/0.55)] pt-16">
             <SectionHeading nummer="07" eyebrow="Wissensdatenbank" title="Ausführliche Experten-FAQ" />
             <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-sm">
                  <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Welche Toleranzen gelten bei der CNC-Schlüsselanfertigung?</h4>
                  <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)]">
                    Unsere CNC-Fräszentren arbeiten mit einer Präzision im Hundertstel-Millimeter-Bereich (±0.02 mm). Dies garantiert, dass ein nach Code gefertigter Schlüssel exakt den Werksspezifikationen entspricht und nicht die additiven Fehler einer mechanischen Kopie aufweist.
                  </p>
                </div>
                <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-sm">
                  <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Was bedeutet der Not- und Gefahrenfunktion-Zusatz (N+G)?</h4>
                  <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)]">
                    Ein Schließzylinder mit N+G-Funktion (oft auch BSZ - beidseitig schließbar genannt) verfügt über eine spezielle Kupplung. Diese stellt sicher, dass der Zylinder von außen mit einem berechtigten Schlüssel geschlossen werden kann, selbst wenn innen ein Schlüssel steckt. Dies ist ein kritisches Sicherheitsmerkmal für Wohnungen.
                  </p>
                </div>
                <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-sm">
                  <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Wie funktioniert der technische Kopierschutz bei Wendeschlüsseln?</h4>
                  <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)]">
                    Hochsicherheitssysteme nutzen neben den standardmäßigen Bohr- und Fräsmulden oft aktive, bewegliche Elemente im Schlüssel (z.B. Intellitec-System, Rollen oder Magnete). Diese werden beim Einführen vom Zylinder abgefragt. Ohne dieses bewegliche Element lässt sich der Zylinderkern nicht drehen.
                  </p>
                </div>
                <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-sm">
                  <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Welche Kryptografie nutzen elektronische Schließzylinder?</h4>
                  <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)]">
                    Moderne RFID/NFC-basierte Systeme (wie MIFARE DESFire EV2/EV3) verwenden AES-128 oder AES-256 Bit Verschlüsselung für die Luftschnittstelle. Challenge-Response-Authentifizierungsverfahren verhindern Replay-Attacken, während die Daten auf dem Transponder kryptografisch signiert sind.
                  </p>
                </div>
                <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-sm">
                  <h4 className="text-base font-bold text-[oklch(0.16_0.02_260)]">Wie ist das Vorgehen bei Verlust eines Generalhauptschlüssels (GHS)?</h4>
                  <p className="mt-3 text-sm text-[oklch(0.32_0.02_260)]">
                    Bei rein mechanischen Anlagen erfordert dies aus versicherungstechnischen Gründen oft den Austausch der gesamten Anlage. Bei mechatronischen Anlagen kann der verlorene Schlüssel (Transponder) einfach in der Verwaltungssoftware gesperrt und die Aktualisierung über Update-Terminals an die Zylinder verteilt werden.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" tight labelledBy="weiter-titel">
        <SectionHeading
          id="weiter-titel"
          nummer={nr('weiter')}
          eyebrow="Weiter im Shop"
          title="Passende Seiten zu diesem Artikel"
        />

        {/* Stückliste mit Fach-Icons: die ganze Zeile ist der Link */}
        <ol className="mt-8 border-t border-border">
          {links.map((link) => (
            <li key={link.href} className="border-b border-border">
              <Link
                href={link.href}
                className="group flex min-h-touch items-center gap-4 py-5 transition-colors duration-quick ease-standard sm:gap-6"
              >
                <span className="shrink-0 text-primary">
                  <WeiterIcon href={link.href} />
                </span>
                <span className="min-w-0 flex-1 text-title-sm font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <GlyphPfeilRechts
                  size={18}
                  className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

/** Wert einer Eigenschaft: reine Zahlen ganz in Mono, sonst Zahlen mit Einheit in Mono und Text in der Grundschrift (K-006). */
function EigenschaftWert({ wert }: { wert: string }) {
  if (/^[\d.,\s×x/–-]+$/.test(wert)) return <span className="font-mono tabular-nums">{wert}</span>;
  return (
    <>
      {monoTeile(wert).map((teil, index) =>
        teil.mono ? (
          <span key={index} className="whitespace-nowrap font-mono tabular-nums">
            {teil.text}
          </span>
        ) : (
          teil.text
        ),
      )}
    </>
  );
}
