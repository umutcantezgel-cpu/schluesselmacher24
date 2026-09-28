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
import { KeyCodeCalculator } from '@/components/calculator/key-code-calculator';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';

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



      <Section tight>
        <SectionHeading
          eyebrow="Die Methode"
          title="Präzise Fertigung nach Code-Profil"
          lead="Erfahren Sie, wie wir Ihren Schlüssel passgenau reproduzieren – ganz ohne das Original."
        />
        <div className="mt-8 space-y-6 text-[oklch(0.32_0.02_260)] leading-relaxed max-w-3xl">
          <p>
            Die Bestellung eines Schlüssels nach Code revolutioniert den herkömmlichen Weg der Ersatzbeschaffung.
            Traditionell musste man den Originalschlüssel einsenden oder vor Ort abgeben, damit dieser mechanisch kopiert werden konnte.
            Dieser Prozess barg Risiken wie den Verlust des Schlüssels auf dem Postweg und führte dazu, dass Schließanlagen während der
            Produktion nicht nutzbar waren. Durch die Code-basierte Fertigung entfällt diese Hürde komplett. Jeder Schlüssel, der von
            renommierten Herstellern wie ABUS, BKS oder CES produziert wird, besitzt ein einzigartiges Schließprofil, das sich mathematisch
            in einem alphanumerischen Code ausdrücken lässt.
          </p>
          <p>
            Der Schlüsselcode ist mehr als nur eine Seriennummer – er ist die exakte Bauanleitung für das Fräswerkzeug.
            Er definiert die Schnitttiefen, Abstände und spezifischen Winkel der Einschnitte oder Bohrmulden. In unserer hochmodernen
            Fertigungsanlage werden diese Parameter direkt an CNC-gesteuerte Spezialmaschinen übermittelt. Das bedeutet, dass Ihr neuer Schlüssel
            keine &quot;Kopie einer Kopie&quot; ist, bei der sich minimalste Abweichungen summieren könnten (der sogenannte Generationenverlust),
            sondern er wird als exakter Original-Ersatzschlüssel frisch aus dem Rohling gefräst. Die Toleranzen bewegen sich dabei im
            Hundertstelmillimeter-Bereich.
          </p>
          <p>
            Dieser Prozess bietet eine Reihe entscheidender Vorteile:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Sicherheit & Komfort:</strong> Sie müssen das Original nicht aus der Hand geben. Gerade bei sicherheitskritischen Anlagen (Büros, Schließanlagen) ist dies ein massiver Sicherheitsgewinn.</li>
            <li><strong>Präzision:</strong> Der gefertigte Schlüssel ist qualitativ von einem Erstanfertigungsschlüssel nicht zu unterscheiden. Er schließt leichtgängig und schont die Zylindermechanik, was die Lebensdauer des gesamten Schlosses signifikant erhöht.</li>
            <li><strong>Verlässlichkeit bei Abnutzung:</strong> Auch wenn Ihr Originalschlüssel bereits Verschleißspuren zeigt, wird der neue Code-Schlüssel perfekt passen, da er anhand der theoretischen Idealmaße des Herstellers geschnitten wird.</li>
          </ul>
        </div>
      </Section>

      <Section tone="muted" tight>
        <SectionHeading
          eyebrow="Vergleich"
          title="Schlüssel nach Code vs. Klassische Kopie"
          lead="Warum die Code-Fertigung der mechanischen Kopie überlegen ist."
        />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-4">Nach Code gefertigt</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-[oklch(0.52_0.24_260)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-[oklch(0.32_0.02_260)]"><strong>Original-Toleranzen:</strong> 100% maßhaltig nach Herstellerangaben.</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-[oklch(0.52_0.24_260)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-[oklch(0.32_0.02_260)]"><strong>Kein Einsenden nötig:</strong> Das Original bleibt sicher bei Ihnen.</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-[oklch(0.52_0.24_260)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-[oklch(0.32_0.02_260)]"><strong>Verschleiß-Kompensation:</strong> Ignoriert die Abnutzung des alten Schlüssels komplett.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-surface p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground-muted mb-4">Mechanische Kopie</h3>
            <ul className="space-y-4 opacity-75">
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span className="text-[oklch(0.32_0.02_260)]"><strong>Generationenverlust:</strong> Fehler in der Kopie addieren sich auf.</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span className="text-[oklch(0.32_0.02_260)]"><strong>Sicherheitsrisiko:</strong> Schlüssel muss aus der Hand gegeben werden.</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span className="text-[oklch(0.32_0.02_260)]"><strong>Verschleißübertragung:</strong> Ein abgenutzter Schlüssel führt zu einer abgenutzten Kopie.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section tight>
        <SectionHeading
          eyebrow="FAQ"
          title="Häufig gestellte Fragen"
          lead="Expertenantworten rund um die Schlüsselfertigung nach Code."
        />
        <div className="mt-8 space-y-6 max-w-3xl">

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">Wie sicher ist die Bestellung nach Code?</h4>
            <p className="text-[oklch(0.32_0.02_260)]">
              Höchst sicher. Da Sie Ihren Schlüssel nicht physisch versenden, gibt es kein Risiko, dass dieser auf dem Postweg verloren geht.
              Zudem erfolgt die Fertigung in unserem zertifizierten Schließtechnik-Zentrum unter strengsten Datenschutzrichtlinien.
              Sensible Anlagendaten werden verschlüsselt übertragen und nicht dauerhaft ungesichert gespeichert.
            </p>
          </div>

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">Was passiert, wenn der Code nicht lesbar ist?</h4>
            <p className="text-[oklch(0.32_0.02_260)]">
              Sollte der Code auf Ihrem Schlüssel oder der Sicherungskarte durch Abnutzung nicht mehr vollständig lesbar sein,
              bieten wir als Alternative die &quot;Bestellung nach Vorlage&quot; an. Dort prüfen unsere Fachberater anhand von drei detaillierten Fotos,
              ob eine Rekonstruktion des Schließprofils möglich ist.
            </p>
          </div>

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">Wie lange dauert die CNC-Fertigung?</h4>
            <p className="text-[oklch(0.32_0.02_260)]">
              Die reine Maschinenzeit pro Schlüssel liegt meist im Bereich weniger Minuten.
              Durch unsere optimierte Prozesskette – von der digitalen Auftragserfassung direkt an die CNC-Maschine –
              verlassen Standard-Codeschlüssel unser Haus in der Regel innerhalb von 24 bis 48 Stunden nach Zahlungseingang.
            </p>
          </div>

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">Kann jeder Schlüssel nach Code gefertigt werden?</h4>
            <p className="text-[oklch(0.32_0.02_260)]">
              Die meisten modernen Zylinderschlüssel, KFZ-Schlüssel und Briefkastenschlüssel namhafter Hersteller verfügen über einen Code.
              Ausnahmen bilden stark veraltete Systeme oder asiatische Billigimporte, für die keine standardisierten Fräsdaten vorliegen.
            </p>
          </div>

          <div className="border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
            <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-2">Warum schließt der neue Schlüssel manchmal hakt er anfangs?</h4>
            <p className="text-[oklch(0.32_0.02_260)]">
              Wenn Sie einen Original-Ersatzschlüssel nach Code erhalten, hat dieser die perfekten Werksmaße (0% Abnutzung).
              Ihr altes Schloss und die Stifte im Zylinder können jedoch bereits über Jahre abgenutzt sein.
              In sehr seltenen Fällen benötigt der Zylinder eine minimale &quot;Einlaufphase&quot; (oft hilft auch ein Tropfen spezielles Zylinderpflegespray),
              damit die Stifte sich an die wiederhergestellten, korrekten Maße des neuen Schlüssels anpassen.
            </p>
          </div>

        </div>
      </Section>

      <Section tight className="bg-[oklch(0.988_0.002_260)]">
        <SectionHeading
          eyebrow="Analytik"
          title="Schließanlagen-Berechner"
          lead="Kalkulieren Sie den Bedarf an Nachschlüsseln interaktiv."
        />
        <div className="mt-8">
          <KeyCodeCalculator />
        </div>
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
