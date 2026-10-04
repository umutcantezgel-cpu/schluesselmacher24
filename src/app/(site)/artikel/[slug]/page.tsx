import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Truck } from 'lucide-react';

import {
  artikelPfad,
  istIndexierbar,
  kurztext,
  produktJsonLd,
  versandartenFuer,
} from '@/lib/artikel';
import { getCollection, getSettings } from '@/lib/data';
import { formatCents } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { ImageSlot } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { EnterpriseRoiCalculator } from '@/components/calculator/enterprise-roi-calculator';


import { ArtikelKauf } from './artikel-kauf';

interface ArtikelSeiteProps {
  /** In Next.js 16 sind Routenparameter ein Promise. */
  params: Promise<{ slug: string }>;
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
    { href: '/artikel', label: 'Alle Artikel ansehen' },
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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-x-12">
          <div className="min-w-0 lg:col-start-1">
            <ImagePlaceholder slot={article.image} sizes="(min-width: 1024px) 50vw, 100vw" />
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

          <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
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

          <div className="min-w-0 lg:col-start-1">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Beschreibung</h2>
            <p className="prose-sm24 mt-3">{article.description}</p>

            {eigenschaften.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">Eigenschaften</h2>
                <Card className="mt-4 overflow-hidden">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">Eigenschaften von {article.name}</caption>
                    <tbody className="divide-y divide-border">
                      {eigenschaften.map((eintrag, index) => (
                        <tr key={`${index}-${eintrag.name}`}>
                          <th
                            scope="row"
                            className="w-2/5 px-4 py-3 align-top text-[13px] font-semibold text-foreground-muted"
                          >
                            {eintrag.name}
                          </th>
                          <td className="px-4 py-3 align-top text-[15px] text-foreground">
                            {eintrag.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}


            <div className="mt-16 border-t border-[oklch(0.89_0.008_260/0.55)] pt-12">
              <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] md:text-3xl">Institutionelle Leistungsübersicht</h2>
              <p className="prose-sm24 mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Unsere standardisierten Artikel rund um Schlüssel, Schloss und Tür bilden das Fundament für sichere und skalierbare Schließlösungen in privaten, gewerblichen und institutionellen Umgebungen. Jede Komponente – vom präzisionsgefertigten Nachschlüssel bis zum hochsicheren Schließzylinder – wird nach strengen Qualitätskriterien gefertigt und geprüft. Diese Leistungsübersicht detailliert die architektonische Methodik hinter unserem Sortiment und verdeutlicht, warum kompromisslose Qualität bei der mechanischen und elektronischen Absicherung unverzichtbar ist.
              </p>
              <p className="prose-sm24 mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Die Anforderungen an moderne Schließtechnik haben sich in den letzten Jahren dramatisch gewandelt. Während früher rein mechanische Barrieren im Vordergrund standen, erfordern heutige Sicherheitskonzepte eine intelligente Integration von physischem Widerstand, organisatorischer Kontrolle und nahtloser Nachverfolgbarkeit. Unsere Produkte sind so konzipiert, dass sie diese multidimensionalen Anforderungen erfüllen, ohne die tägliche Handhabung für die Endnutzer zu verkomplizieren.
              </p>

              <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mt-8">Methodischer Transformationsprozess</h3>
              <p className="prose-sm24 mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Der Weg von einem einzelnen Zylinder zu einer ganzheitlichen, auditierbaren Schließanlage erfolgt bei uns in einem strukturierten, vierstufigen Transformationsprozess. Zunächst erfolgt die <strong>Bedarfsanalyse und Risikobewertung</strong>, bei der wir die spezifischen Sicherheitsanforderungen Ihrer Liegenschaft detailliert erfassen. Im zweiten Schritt, der <strong>Topologischen Planung</strong>, entwerfen wir einen passgenauen Schließplan, der Zugriffsrechte logisch strukturiert und zukünftige Erweiterungen antizipiert.
              </p>
              <p className="prose-sm24 mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed">
                Die dritte Phase umfasst die <strong>Präzisionsfertigung und Qualitätssicherung</strong>. Hier kommen modernste CNC-Maschinen und strenge Toleranzprüfungen zum Einsatz, um sicherzustellen, dass jeder Schlüssel und jeder Zylinder exakt den Vorgaben entspricht. Den Abschluss bildet die <strong>Implementierung und Dokumentation</strong>. Eine saubere Übergabe, inklusive detaillierter Sicherungskarten und Pflegeanleitungen, garantiert die langfristige Integrität und Erweiterbarkeit Ihres Systems.
              </p>

              <EnterpriseRoiCalculator />

              <h2 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] md:text-3xl mt-16">Detaillierte Fach-FAQ</h2>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Zertifizierungen weisen die Zylinder auf?</h3>
                  <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Unsere Hochsicherheitszylinder sind standardmäßig nach DIN EN 1303, DIN 18252 sowie VdS (Klasse B oder höher) zertifiziert. Diese Normen garantieren einen definierten Widerstand gegen gewaltfreie Öffnungsmethoden (wie Picking oder Schlagschlüssel) sowie gegen physische Angriffe (Aufbohren, Kernziehen). Für kritische Infrastrukturen bieten wir zudem Zylinder mit modularer Bauweise und integriertem Ziehschutz an, die selbst massiven mechanischen Einwirkungen standhalten.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie wird die Nachschlüsselsicherheit gewährleistet?</h3>
                  <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Die Integrität einer Schließanlage steht und fällt mit der Kontrolle über Schlüsselkopien. Wir setzen konsequent auf Systeme mit patentiertem Kopierschutz (oft bis 2030 oder länger gültig) und geschützten Schlüsselprofilen. Nachschlüssel und Erweiterungszylinder werden ausschließlich gegen Vorlage der originalen, registrierten Sicherungskarte gefertigt. Dieser prozessuale Schutz verhindert unautorisierte Duplikate durch Dritte effektiv.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Ist eine nachträgliche Erweiterung zur elektronischen Zutrittskontrolle möglich?</h3>
                  <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Ja, unser Portfolio ist auf Skalierbarkeit ausgelegt. Viele unserer mechanischen Wendeschlüsselsysteme lassen sich nahtlos mit mechatronischen Komponenten kombinieren. Ein sogenannter Kombischlüssel enthält neben den mechanischen Fräsungen einen RFID-Transponder. Damit können Sie hochfrequentierte Außentüren elektronisch (mit Protokollierung und temporären Rechten) und Innentüren wirtschaftlich mechanisch absichern.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Welche Wartungsintervalle werden empfohlen?</h3>
                  <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Für eine optimale Lebensdauer und reibungslose Funktion empfehlen wir, Schließzylinder halbjährlich – bei starker Beanspruchung oder Witterungseinflüssen vierteljährlich – mit einem speziellen, harz- und säurefreien Pflegespray zu behandeln. Die Verwendung von Öl oder Grafit ist strikt zu vermeiden, da diese Substanzen verharzen oder verklumpen und die feine Mechanik der Stiftzuhaltungen blockieren können.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Was passiert bei Schlüsselverlust in einer Anlage?</h3>
                  <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Der Verlust eines übergeordneten Gruppenschlüssels oder Generalhauptschlüssels erfordert eine sofortige Risikobewertung. Mechanisch bedeutet dies oft den kostspieligen Austausch der betroffenen Zylinder, um die Sicherheit wiederherzustellen. Um dieses Risiko zu minimieren, raten wir bei größeren Anlagen zur Hybrid-Strategie: Äußere Gebäudehüllen elektronisch absichern (wo verlorene Transponder sofort gelöscht werden können) und nur innere Bereiche mechanisch schließen.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)]">Wie unterscheiden sich Wendeschlüssel von konventionellen Zackenschlüsseln?</h3>
                  <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
                    Wendeschlüsselbieten einen signifikanten Bedienkomfort, da sie beidseitig (horizontal) eingeführt werden können. Konstruktiv verfügen sie oft über Muldenbohrungen anstelle von Einschnitten, was eine höhere Anzahl von Zuhaltungsstiften auf mehreren Ebenen ermöglicht. Dies resultiert nicht nur in einer deutlich höheren Verschlusssicherheit und komplexeren Schließanlagen-Berechnungen, sondern auch in einem verminderten Verschleiß, da die Kraftübertragung flächiger erfolgt.
                  </p>
                </div>
              </div>
            </div>

            {article.scope.trim() && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">Lieferumfang</h2>
                <p className="prose-sm24 mt-3">{article.scope}</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground md:text-2xl">Versand</h2>
              <p className="prose-sm24 mt-3">
                Die Versandart wählen Sie im Warenkorb.
                {versandarten.length > 0 && ' Für diesen Artikel kommen folgende Versandarten in Frage:'}
              </p>
              {versandarten.length > 0 && (
                <ul className="mt-4 grid gap-2">
                  {versandarten.map((option) => (
                    <li
                      key={option.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4"
                    >
                      <Truck size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span className="text-[15px] font-semibold text-foreground">{option.label}</span>
                          <span className="text-[14px] text-foreground-muted">
                            {formatCents(option.priceCents)}
                          </span>
                        </span>
                        {option.description && (
                          <span className="mt-1 block text-[13px] leading-relaxed text-foreground-muted">
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
          </div>
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading eyebrow="Weiter im Shop" title="Passende Seiten zu diesem Artikel" />

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full min-h-[44px] items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4 text-[15px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {link.label}
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
