import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { RubrikAblaufAbschnitt } from '@/components/rubrik/rubrik-ablauf';
import { ButtonLink } from '@/components/ui/button';
import { getFahrzeugkatalog, getPageContent, getRubrik, getSettings, getUmbauBeispiele } from '@/lib/data';
import { PasstDazu } from '@/components/seo/passt-dazu';
import { HAFTUNG_HINWEIS, VERPACKUNG_HINWEIS, haftungSatz } from '@/lib/versand/varianten';

import { UmbauBeispiele } from '../customizing/umbau-beispiele';
import { GEHAEUSE_ABLAUF, GEHAEUSE_LEISTUNGEN, versandFuerElektronik } from './leistungen';

const ROUTE = 'autoschluessel/gehaeuse';
const ANFRAGE = '/autoschluessel/gehaeuse/anfrage';
const CRUMBS = [
  { href: '/autoschluessel', label: 'Autoschlüssel' },
  { href: `/${ROUTE}`, label: 'Gehäuse' },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel-Gehäuse erneuern',
    description:
      page?.seo.description
      ?? 'Ein neues Gehäuse für Ihren Funkschlüssel, die Elektronik bleibt. Senden Sie Fahrzeug, drei Fotos des Schlüssels und den Fahrzeugschein, wir nennen den Preis.',
    alternates: { canonical: `/${ROUTE}` },
  };
}

/** Rubrikseite Autoschlüssel-Gehäuse (G-20, E6-BAUMEISTER-02): Ablauf, Gehäuse-Frage, Weg in die Anfrage. */
export default async function AutoschluesselGehaeusePage() {
  const [rubrik, page, settings, gehaeuseBeispiele, reparaturBeispiele, katalog] = await Promise.all([
    getRubrik('autoschluessel-gehaeuse'),
    getPageContent(ROUTE),
    getSettings(),
    getUmbauBeispiele('gehaeuse'),
    getUmbauBeispiele('reparatur'),
    getFahrzeugkatalog(),
  ]);
  // Beispiele für Gehäuse und Reparatur, jedes nur einmal (FA-14-08).
  const beispiele = [...gehaeuseBeispiele, ...reparaturBeispiele.filter((b) => !gehaeuseBeispiele.some((g) => g.id === b.id))];
  // Versand für Schlüssel mit Elektronik aus den Einstellungen des Betriebs (FA-SHOP-03, Empfehlung DHL Paket).
  const versand = versandFuerElektronik(settings.sendIn);

  // Sichtbarer Kurztext im Seitenkopf, zugleich Beschreibung der Leistung in den Strukturdaten (FA-25-10).
  const kurztext =
    page?.subline
    ?? 'Anfrage mit Fahrzeug, drei Fotos Ihres Schlüssels und Fahrzeugschein. Wir prüfen Ihre Angaben und melden uns mit Preis und Ablauf.';

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: `/${ROUTE}`,
          name: page?.headline ?? 'Autoschlüssel-Gehäuse erneuern',
          service: { name: page?.headline ?? 'Autoschlüssel-Gehäuse erneuern', description: kurztext },
          description: page?.seo.description,
          crumbs: CRUMBS,
        })}
      />

      <PageHeader
        rubrik={rubrik}
        eyebrow="Autoschlüssel"
        title={page?.headline ?? 'Autoschlüssel-Gehäuse erneuern'}
        lead={kurztext}
        crumbs={CRUMBS}
        bereich="autoschluessel"
        actions={
          <ButtonLink href={ANFRAGE} size="lg" pfeil>
            Anfrage stellen
          </ButtonLink>
        }
      />

      {/* 01 Ablauf aus den Rubrikdaten (G-10) */}
      <RubrikAblaufAbschnitt
        rubrik={rubrik}
        nummer="01"
        titel="Vom Fahrzeug bis zum Preis"
        aktion={
          <ButtonLink href={ANFRAGE} pfeil>
            Anfrage stellen
          </ButtonLink>
        }
      />

      {/* 02 Wann ein neues Gehäuse hilft (G-20, R9) */}
      <Section tone="muted" labelledBy="gehaeuse-titel">
        <SectionHeading id="gehaeuse-titel" nummer="02" eyebrow="Gehäuse" title="Wann ein neues Gehäuse hilft" />
        <p className="mt-6 max-w-measure text-body leading-relaxed text-foreground-muted">
          Ist das Gehäuse gebrochen oder klemmen die Tasten, tauschen wir die Hülle; die vorhandene Elektronik bleibt
          erhalten. Ob das bei Ihrem Schlüssel geht, sehen wir an Ihren Fotos.
        </p>
        <p className="mt-6">
          <Link href="/autoschluessel/funkschluessel" className="font-semibold text-primary underline-offset-2 hover:underline">
            Funkschlüssel und Gehäuse im Überblick
          </Link>
        </p>
      </Section>
      {/* 03 Leistungen mit Einsendung (FA-SHOP-02B, Punkt 2): ohne Preis des Inhabers als Anfrage (A-036). */}
      <Section labelledBy="leistungen-titel">
        <SectionHeading
          id="leistungen-titel"
          nummer="03"
          eyebrow="Leistungen"
          title="Tausch, Reparatur und Umbau"
          lead="Alle drei Leistungen beginnen mit der Gehäuse-Anfrage. Den Preis nennen wir Ihnen, wenn wir Ihren Schlüssel gesehen haben."
        />
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {GEHAEUSE_LEISTUNGEN.map((leistung) => (
            <li key={leistung.kennung} className="flex flex-col gap-2 border-t border-border pt-4">
              <h3 className="text-title-sm font-semibold text-foreground">{leistung.titel}</h3>
              <p className="text-body leading-relaxed text-foreground-muted">{leistung.satz}</p>
              <p className="text-small leading-relaxed text-foreground">{leistung.bedingung}</p>
            </li>
          ))}
        </ul>
        <ol className="mt-10 grid gap-3">
          {GEHAEUSE_ABLAUF.map((schritt, index) => (
            <li key={schritt} className="flex gap-4">
              <span className="w-8 shrink-0 font-mono text-caption tabular-nums text-foreground-muted">{String(index + 1).padStart(2, '0')}</span>
              <span className="max-w-measure text-body text-foreground">{schritt}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={ANFRAGE} pfeil>
            Anfrage stellen
          </ButtonLink>
          <ButtonLink href="/autoschluessel/customizing" variant="outline">
            Mehr zum Customizing
          </ButtonLink>
        </div>
      </Section>

      {/* 04 Einsenden: Versandart und Verpackung aus dem vorhandenen Einsendeweg (FA-SHOP-03), kein zweiter Weg. */}
      <Section tone="muted" labelledBy="einsenden-titel">
        <SectionHeading id="einsenden-titel" nummer="04" eyebrow="Einsenden" title="Den Schlüssel sicher schicken" />
        <div className="mt-6 grid max-w-measure gap-4 text-body leading-relaxed text-foreground-muted">
          <p>Schicken Sie Ihren Schlüssel erst, wenn wir uns gemeldet haben. Mit unserer Rückmeldung sagen wir Ihnen, wohin und wie.</p>
          {versand && (
            <p>
              Für Schlüssel mit Elektronik empfehlen wir <strong className="text-foreground">{versand.bezeichnung}</strong>
              {versand.sendungsverfolgung ? ' mit Sendungsverfolgung' : ''}: {haftungSatz(versand)}. {HAFTUNG_HINWEIS}
            </p>
          )}
          <p className="font-semibold text-foreground">{VERPACKUNG_HINWEIS}</p>
        </div>
      </Section>

      {/* 05 Gehäuse und Ersatzteile als Liste mit Filter nach Fahrzeug (FA-SHOP-02B, Punkt 1). */}
      <Section labelledBy="teile-verweis-titel">
        <SectionHeading
          id="teile-verweis-titel"
          nummer="05"
          eyebrow="Teile"
          title="Gehäuse und Ersatzteile"
          lead="Gehäuse, Tasten und weitere Teile für Ihren Schlüssel, soweit wir sie führen. Fehlt Ihr Teil, fragen Sie uns."
        />
        <p className="mt-6">
          <Link href="/autoschluessel/gehaeuse/teile" className="font-semibold text-primary underline-offset-2 hover:underline">
            Zu den Gehäusen und Ersatzteilen
          </Link>
        </p>
      </Section>

      {/* 06 Vorher und nachher: nur mit echten, freigegebenen Umbau-Beispielen (R4). */}
      {beispiele.length > 0 && (
        <Section tone="muted" labelledBy="beispiele-titel">
          <SectionHeading id="beispiele-titel" nummer="06" eyebrow="Beispiele" title="Vorher und nachher" />
          <UmbauBeispiele beispiele={beispiele} katalog={katalog} />
        </Section>
      )}

      {/* Verweisliste aus den Daten: eigene Links und Gegenrichtung (FA-SEO-01C) */}
      <PasstDazu pfad={`/${ROUTE}`} eigene={page?.seo.internalLinks} />
    </>
  );
}
