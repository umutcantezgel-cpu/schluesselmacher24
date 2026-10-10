import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PackageOpen } from 'lucide-react';

import { getCodeLines, getPageContent } from '@/lib/data';
import { PROCESS_LABELS } from '@/lib/navigation';
import type { NavLink } from '@/lib/navigation';
import { Alert } from '@/components/ui/alert';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

import { ShopListe } from './shop-liste';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { CodeAnalyzer } from '@/components/calculator/code-analyzer';

const ROUTE = 'schluessel-nach-code';

/** Interne Verlinkung am Seitenende — feste Ziele plus gepflegte Ziele aus der Datenschicht. */
const BASE_LINKS: NavLink[] = [
  {
    href: '/schluessel-nach-vorlage',
    label: 'Kein Code vorhanden? Schlüssel nach Vorlage',
    description: 'Drei Fotos hochladen, wir prüfen Machbarkeit und Preis.',
  },
  {
    href: '/ratgeber/schluesselcode-finden',
    label: 'Wo finde ich den Schlüsselcode?',
    description: 'Typische Fundstellen auf Schloss, Schlüssel und Unterlagen.',
  },
  {
    href: '/gleichschliessende-zylinder',
    label: 'Mehrere Türen mit einem Schlüssel',
    description: 'Gleichschließende Zylinder selbst zusammenstellen.',
  },
  {
    href: '/rechtliches/versand-und-zahlung',
    label: 'Zahlung und Versand',
    description: 'Welche Versandarten und Zahlungswege zur Verfügung stehen.',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Schlüssel nach Code bestellen',
    description:
      page?.seo.description
      ?? 'Nachschlüssel nach Code bestellen — ohne Einsendung des Originalschlüssels.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

export default async function SchluesselNachCodePage() {
  const [page, lines] = await Promise.all([getPageContent(ROUTE), getCodeLines()]);

  // Gepflegte interne Links ergänzen die festen Ziele, ohne sie zu doppeln.
  const extraLinks: NavLink[] = (page?.seo.internalLinks ?? []).filter(
    (link) => !BASE_LINKS.some((base) => base.href === link.href),
  );
  const links = [...BASE_LINKS, ...extraLinks];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/schluessel-nach-code',
          name: page?.headline ?? 'Schlüssel nach Code',
          description: page?.seo.description,
          crumbs: [{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }],
        })}
      />

      <PageHeader
        eyebrow={PROCESS_LABELS.direktkauf.label}
        title={page?.headline ?? 'Schlüssel nach Code'}
        lead={page?.subline ?? 'Code eingeben, Stückzahl wählen, bestellen.'}
        crumbs={[{ href: '/schluessel-nach-code', label: 'Schlüssel nach Code' }]}
      >
        <Alert tone="info" title="Ihr Originalschlüssel bleibt bei Ihnen">
          <p>
            Bei allen Artikeln in diesem Bereich ist <strong>keine Einsendung des
            Originalschlüssels</strong> nötig. Wir fertigen den Schlüssel allein anhand des Codes,
            den Sie bei der Bestellung angeben. Sie können Ihr Schloss also weiter benutzen,
            während der Nachschlüssel entsteht.
          </p>
          <p className="mt-2">
            Kein Code vorhanden?{' '}
            <Link href="/schluessel-nach-vorlage" className="font-semibold text-primary hover:underline">
              Dann geht es über Schlüssel nach Vorlage weiter.
            </Link>
          </p>
        </Alert>
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <SectionHeading
              eyebrow="Digitale Fertigungsarchitektur"
              title="Höchste Präzision: Die Methodik hinter der Code-basierten Schlüsselfertigung"
              lead="Die Bestellung eines Schlüssels nach Code repräsentiert die modernste und sicherste Form der Nachschlüsselproduktion. Statt einen potenziell abgenutzten Originalschlüssel mechanisch abzutasten, greifen wir direkt auf die mathematischen Rohdaten des Herstellers zurück. Das Ergebnis ist kein bloßes Duplikat, sondern ein originalgetreuer Nullserien-Schlüssel, der die exakten Toleranzwerte ab Werk erfüllt und den Verschleiß Ihres Zylinders minimiert."
            />

            <div className="mt-8 prose-sm24 max-w-none space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed">
              <p>
                Die mechanische Sicherheitstechnik hat in den letzten Jahrzehnten einen gewaltigen Evolutionssprung vollzogen. Während früher die mechanische Kopie eines Schlüssels (das sogenannte &quot;Nachmachen&quot; an der Fräsmaschine) der Standard war, basiert die professionelle Fertigung heute zunehmend auf kryptografischen und geometrischen Codes. Diese Entwicklung hat tiefgreifende Auswirkungen auf die Präzision, die Sicherheit und die Lebensdauer Ihrer Schließanlagen. Wenn Sie bei uns einen Schlüssel nach Code bestellen, durchlaufen Ihre Daten einen streng reglementierten, volldigitalen Fertigungsprozess, der jegliche mechanische Übertragungsfehler ausschließt.
              </p>

              <h2 className="text-xl font-bold text-[oklch(0.16_0.02_260)] tracking-tight mt-10">1. Die Überlegenheit der Code-basierten Fertigung</h2>
              <p>
                Um die Überlegenheit dieser Methodik zu verstehen, muss man den klassischen Kopiervorgang betrachten: Ein Originalschlüssel wird in eine Kopiermaschine gespannt. Ein Taster fährt die Konturen (die Einschnitte oder Bohrmulden) ab, während ein Fräser diese Bewegungen zeitgleich auf einen Rohling überträgt. Das Problem: Jeder Schlüssel unterliegt einem natürlichen Verschleiß. Mit jedem Schließvorgang im Zylinder reibt Metall auf Metall. Bruchteile von Millimetern gehen verloren. Wird nun dieser abgenutzte Schlüssel als Vorlage genutzt, wird der Verschleiß 1:1 mitkopiert – plus die mechanische Toleranz der Fräsmaschine selbst.
              </p>
              <p>
                Der Code-basierte Prozess eliminiert diese Fehlerkette vollständig. Der alphanumerische Code (z.B. auf der Sicherungskarte oder dem Schlüsselkopf eingraviert) ist im Grunde die DNA des Schlüssels. Er übersetzt sich in eine mathematische Matrix, die exakt definiert, an welcher Position (Y-Achse) und in welcher Tiefe (Z-Achse) Material abgetragen werden muss. Unsere computergesteuerten CNC-Präzisionsfräsmaschinen verarbeiten diese Matrix und fräsen den Schlüssel aus einem hochfesten Neusilber-Rohling. Das Resultat ist ein Schlüssel, der mathematisch und physisch exakt dem Zustand entspricht, den Ihr Zylinder am ersten Tag der Auslieferung hatte.
              </p>

              <h2 className="text-xl font-bold text-[oklch(0.16_0.02_260)] tracking-tight mt-10">2. Architektur der Schließcodes und Profiltypen</h2>
              <p>
                Ein Schlüsselcode ist keine bloße Seriennummer, sondern eine komplexe geometrische Anweisung. Die Struktur variiert je nach Architektur des Zylinders stark. Wir unterscheiden grundlegend drei Kategorien von Schließsystemen, die sich in der Komplexität ihrer Codierung niederschlagen:
              </p>
              <ul className="list-none space-y-4 my-6">
                <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[oklch(0.52_0.24_260)]">
                  <strong className="text-[oklch(0.16_0.02_260)]">Klassische Zackenschlüssel (z.B. ABUS C73, BKS 88):</strong> Hier definiert der Code die Einschnitttiefen auf dem Schlüsselbart. Ein 5-stelliger Code korrespondiert meist mit 5 Stiftpaaren im Zylinder. Die Fertigung erfolgt schnell und hochpräzise.
                </li>
                <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[oklch(0.52_0.24_260)]">
                  <strong className="text-[oklch(0.16_0.02_260)]">Moderne Bohrmuldenschlüssel (z.B. ABUS EC550, KESO 4000S):</strong> Diese Schlüssel weisen keine Zacken auf, sondern kalottenförmige Vertiefungen auf der Fläche. Der Code ist hier mehrdimensional, da Position, Tiefe und oft auch der Winkel der Bohrung exakt definiert sind. CNC-Maschinen mit speziellen Winkelfräsern sind für diese Fertigung unerlässlich.
                </li>
                <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[oklch(0.52_0.24_260)]">
                  <strong className="text-[oklch(0.16_0.02_260)]">Geschützte Profilanlagen (Hochsicherheit):</strong> Bei Schließanlagen (z.B. im gewerblichen Bereich) enthält der Code zusätzliche Informationen über die Profilvariation (die längs verlaufenden Nuten) und die Hierarchiestufe (z.B. Gruppenschlüssel vs. Einzelschlüssel). Die Fertigung erfordert hier zwingend die Autorisierung durch eine Sicherungskarte.
                </li>
              </ul>

              <h2 className="text-xl font-bold text-[oklch(0.16_0.02_260)] tracking-tight mt-10">3. Sicherheit, Autorisierung und Datenschutz</h2>
              <p>
                Mit der Bequemlichkeit der Code-Bestellung wächst die Verantwortung für die Sicherheit. Ein Code ist eine sensible Information. Unsere Infrastruktur ist darauf ausgelegt, diesen Datenfluss strikt zu schützen. Die Übertragung Ihrer Codes erfolgt über Ende-zu-Ende-verschlüsselte Verbindungen. Nach der erfolgreichen Fertigung und dem Ablauf der gesetzlichen Gewährleistungsfristen werden fertigungsrelevante Codematrizen aus unseren Systemen isoliert oder nach DSGVO-Standards anonymisiert, sofern Sie kein dediziertes Kundenkonto für Nachbestellungen unterhalten.
              </p>
              <p>
                Besonderes Augenmerk liegt auf der Prüfung der Legitimation. Während Standardschlüssel (wie viele Fahrradschlösser oder einfache Zylinder) frei nachbestellbar sind, unterliegen patentierte Systeme (die sogenannten geschützten Profile) einem strengen Autorisierungsprozess. Hier verlangen die Hersteller (wie KESO, BKS oder DOM) zwingend die Vorlage der Sicherungskarte. Der Code allein reicht nicht aus; er muss kryptografisch mit der Kartennummer oder einem digitalen Berechtigungs-Token (wie dem ABUS Code-QR) abgeglichen werden. Dieser Prozess schützt Sie davor, dass Dritte (z.B. Handwerker oder Mieter) unbemerkt Nachschlüssel für Ihr Objekt anfertigen.
              </p>

              <h2 className="text-xl font-bold text-[oklch(0.16_0.02_260)] tracking-tight mt-10">4. Qualitätskontrolle und Toleranzmanagement</h2>
              <p>
                Trotz der computergestützten Fertigung ist der Prozess ohne strenge Qualitätssicherung (QA) nicht komplett. Jeder gefräste Schlüssel wird vor dem Versand einer mehrstufigen Kontrolle unterzogen. Zunächst erfolgt eine optische Inspektion auf Gratfreiheit. Ein mikroskopischer Grat (feinste Metallrückstände vom Fräsen) könnte die filigranen Stifte im Zylinder blockieren. Daher wird jeder Schlüssel maschinell gebürstet und entgratet.
              </p>
              <p>
                Anschließend folgt die dimensionale Prüfung. Mittels digitaler Messschieber und optischer Projektoren wird die Einhaltung der Toleranzen stichprobenartig, bei Hochsicherheitsprofilen sogar lückenlos, verifiziert. Die erlaubten Toleranzen liegen hier im Bereich von Hundertstel Millimetern (0,01 mm). Nur ein Schlüssel, der diese enge Toleranzgrenze nicht überschreitet, garantiert die reibungslose Funktion und verhindert den vorzeitigen Verschleiß der Stiftzuhaltungen im Schließzylinder.
              </p>

              <h2 className="text-xl font-bold text-[oklch(0.16_0.02_260)] tracking-tight mt-10">5. Häufige Fragen (FAQ) zur Code-Fertigung</h2>

              <div className="space-y-6 mt-6">
                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.968_0.004_260)] shadow-sm">
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">Ist ein Nachschlüssel nach Code genauso gut wie das Original?</h3>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Nein, er ist nicht &quot;genauso gut&quot;, er ist strukturell identisch. Da wir die Original-Fräsdaten des Herstellers verwenden, erhalten Sie faktisch einen weiteren Originalschlüssel aus der &quot;Nullserie&quot;, keinen kopierten Nachschlüssel mit Toleranzverlusten.</p>
                </div>

                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.968_0.004_260)] shadow-sm">
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">Wo finde ich den Code, wenn ich keine Karte habe?</h3>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Bei vielen Standardprofilen (z.B. ABUS Fahrradschlösser, Briefkastenschlösser) ist der Code direkt in den Schlüsselkopf eingeprägt. Bei Zylindern steht er oft auf dem Zylindergehäuse oder in den Kaufunterlagen. Ist es ein geschütztes Profil ohne Karte, ist eine Code-Fertigung rechtlich nicht zulässig.</p>
                </div>

                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.968_0.004_260)] shadow-sm">
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">Warum hakt mein neuer Code-Schlüssel leicht?</h3>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Der neue Schlüssel ist absolut maßhaltig. Wenn er hakt, liegt dies in 99% der Fällen daran, dass die Stifte in Ihrem alten Zylinder bereits stark abgenutzt sind. Der neue, präzise Schlüssel &quot;passt&quot; nicht mehr zum verschlissenen Zylinder-Innenleben. Etwas Graphitpulver kann hier oft Abhilfe schaffen.</p>
                </div>

                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.968_0.004_260)] shadow-sm">
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">Können Sie Schlüssel für Fahrzeug-Dachboxen nach Code fertigen?</h3>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Ja, Thule, Kamei und andere Hersteller verwenden standardisierte Codes (meist beginnend mit einem Buchstaben, gefolgt von Zahlen, z.B. N001-N200). Diese können wir in der Regel innerhalb von 24 Stunden problemlos fertigen.</p>
                </div>

                <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-5 bg-[oklch(0.968_0.004_260)] shadow-sm">
                  <h3 className="font-semibold text-[oklch(0.16_0.02_260)]">Wie sicher ist der Versand eines Code-Schlüssels?</h3>
                  <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Wir versenden Code-Schlüssel grundsätzlich in neutralen, manipulationssicheren Verpackungen ohne Hinweis auf Schließtechnik. Wenn Sie höchste Sicherheit wünschen, empfehlen wir den Versand an eine abweichende Lieferadresse oder eine Packstation (nicht an die Adresse, wo der Zylinder verbaut ist).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-24">
              <CodeAnalyzer />
            </div>
          </div>
        </div>
      </Section>

      <Section tight>
        <SectionHeading
          eyebrow={`${lines.length} Codelinien`}
          title="Passende Codelinie finden"
          lead={
            page?.intro
            ?? 'Suchen Sie nach Anwendung, Schlüsseltyp oder Hersteller und grenzen Sie das '
              + 'Ergebnis über die Filter ein.'
          }
        />

        <ShopListe lines={lines} className="mt-8" />
      </Section>

      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Weiterlesen"
          title="Passende Bereiche und Erklärungen"
          lead="Wenn der Code fehlt oder mehrere Türen zusammengehören, führen diese Wege weiter."
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full items-start gap-3 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
              >
                <PackageOpen size={18} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-foreground group-hover:text-primary">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="mt-1 block text-[13px] leading-relaxed text-foreground-muted">
                      {link.description}
                    </span>
                  )}
                </span>
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
