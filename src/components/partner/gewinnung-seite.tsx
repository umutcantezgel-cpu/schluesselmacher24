import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { RubrikAblauf } from '@/components/rubrik/rubrik-ablauf';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { AblaufGrafik } from '@/components/visual/generators/ablauf';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphTelefon } from '@/components/visual/glyphen/telefon';
import {
  NUR_FAHRZEUGSCHLUESSEL,
  PARTNER_HAUPTSEITE,
  PARTNER_LEISTUNGEN,
  PARTNER_QUALITAET,
  weitereGewinnungSeiten,
  type GewinnungAbschnitt,
  type GewinnungPunkt,
  type GewinnungSeite as GewinnungSeiteDaten,
  type GewinnungVerweis,
} from '@/lib/partner/gewinnung';
import { telefonLink } from '@/lib/telefon';

const BAUSTEINE: Record<NonNullable<GewinnungAbschnitt['baustein']>, GewinnungPunkt[]> = {
  leistungen: PARTNER_LEISTUNGEN,
  qualitaet: PARTNER_QUALITAET,
};

function nummer(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/** Stückliste mit Haarlinien: Titel und Erklärung je Punkt. */
export function PunktListe({ punkte }: { punkte: GewinnungPunkt[] }) {
  return (
    <ul className="border-t border-border">
      {punkte.map((punkt) => (
        <li key={punkt.titel} className="flex gap-3 border-b border-border py-4">
          <GlyphHakenKreis size={16} aria-hidden className="mt-1 shrink-0 text-primary" />
          <div className="min-w-0">
            <h3 className="text-body font-semibold text-foreground">{punkt.titel}</h3>
            <p className="mt-1 max-w-measure text-small text-foreground-muted">{punkt.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function TextVerweis({ verweis }: { verweis: GewinnungVerweis }) {
  return (
    <Link
      href={verweis.href}
      className="group mt-6 inline-flex min-h-touch items-center gap-1.5 text-body font-semibold text-primary"
    >
      {verweis.label}
      <GlyphPfeilRechts
        size={16}
        aria-hidden
        className="shrink-0 transition-transform duration-quick ease-standard group-hover:translate-x-1"
      />
    </Link>
  );
}

function AbschnittInhalt({ abschnitt }: { abschnitt: GewinnungAbschnitt }) {
  const punkte = abschnitt.baustein ? BAUSTEINE[abschnitt.baustein] : abschnitt.punkte;
  return (
    <div className="space-y-4">
      {abschnitt.absaetze?.map((absatz) => (
        <p key={absatz} className="max-w-measure text-body text-foreground-muted">
          {absatz}
        </p>
      ))}
      {punkte && <PunktListe punkte={punkte} />}
      {abschnitt.liste && (
        <ul className="grid gap-x-gutter gap-y-3 sm:grid-cols-2">
          {abschnitt.liste.map((eintrag) => (
            <li key={eintrag} className="flex gap-3">
              <GlyphHakenKreis size={16} aria-hidden className="mt-1 shrink-0 text-primary" />
              <span className="text-body text-foreground-muted">{eintrag}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Gemeinsame Vorlage der Partnerseiten unter /partner-werden (FA-08-03 bis FA-08-08): Kopf mit
 * Klarstellung „nur Fahrzeugschlüssel“, optional der Ablauf mit Grafik, die eigenen Abschnitte,
 * Verweise auf die übrigen Partnerseiten und ein nächster Schritt mit Telefon. Inhalte aus
 * `src/lib/partner/gewinnung.ts`.
 */
export function GewinnungSeite({ seite, telefon }: { seite: GewinnungSeiteDaten; telefon?: string }) {
  const crumbs = [
    { href: PARTNER_HAUPTSEITE, label: 'Partner werden' },
    { href: seite.pfad, label: seite.kurzname },
  ];
  const telefonHref = telefonLink(telefon);
  const weitere = weitereGewinnungSeiten(seite.slug);
  const versatz = seite.ablauf ? 1 : 0;
  const ablaufTitel = seite.ablauf ? `Ablauf eines Partnerauftrags: ${seite.ablauf.stationen.join(', ')}` : '';

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: seite.pfad,
          name: seite.ueberschrift,
          description: seite.beschreibung,
          crumbs,
        })}
      />

      <PageHeader
        eyebrow={seite.augenbraue}
        title={seite.ueberschrift}
        lead={seite.einleitung}
        crumbs={crumbs}
        actions={
          <ButtonLink href={seite.naechsterSchritt.primaer.href} size="lg" pfeil className="w-full sm:w-auto">
            {seite.naechsterSchritt.primaer.label}
          </ButtonLink>
        }
      >
        <Alert tone="info" title={NUR_FAHRZEUGSCHLUESSEL.titel} className="max-w-3xl">
          {NUR_FAHRZEUGSCHLUESSEL.text}
        </Alert>
      </PageHeader>

      {seite.ablauf && (
        <Section labelledBy={`${seite.slug}-ablauf-titel`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
            <div className="lg:col-span-5">
              <SectionHeading
                id={`${seite.slug}-ablauf-titel`}
                nummer="01"
                eyebrow={seite.ablauf.augenbraue}
                title={seite.ablauf.ueberschrift}
                lead={seite.ablauf.einleitung}
              />
              <div className="mt-8 rounded-lg bg-area-soft/40 p-4 sm:p-6">
                <AblaufGrafik
                  params={{ schritte: seite.ablauf.stationen.join('|'), format: 'schmal' }}
                  title={ablaufTitel}
                  className="sm:hidden"
                />
                <AblaufGrafik
                  params={{ schritte: seite.ablauf.stationen.join('|') }}
                  title={ablaufTitel}
                  className="hidden sm:block"
                />
              </div>
            </div>
            <RubrikAblauf
              rubrik={{ id: `partner-${seite.slug}`, ablauf: seite.ablauf.schritte }}
              className="lg:col-span-7"
            />
          </div>
        </Section>
      )}

      {seite.abschnitte.map((abschnitt, index) => (
        <Section
          key={abschnitt.id}
          id={abschnitt.id}
          tone={(index + versatz) % 2 === 1 ? 'muted' : 'default'}
          labelledBy={`${abschnitt.id}-titel`}
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
            <div className="lg:col-span-5">
              <SectionHeading
                id={`${abschnitt.id}-titel`}
                nummer={nummer(index + versatz)}
                eyebrow={abschnitt.augenbraue}
                title={abschnitt.ueberschrift}
                lead={abschnitt.einleitung}
              />
            </div>
            <div className="lg:col-span-7">
              <AbschnittInhalt abschnitt={abschnitt} />
              {abschnitt.verweis && <TextVerweis verweis={abschnitt.verweis} />}
            </div>
          </div>
        </Section>
      ))}

      <Section tone="sunken" labelledBy={`${seite.slug}-weiter-titel`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
          <div className="lg:col-span-5">
            <SectionHeading
              id={`${seite.slug}-weiter-titel`}
              eyebrow="Nächster Schritt"
              title={seite.naechsterSchritt.ueberschrift}
              lead={seite.naechsterSchritt.text}
            />
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href={seite.naechsterSchritt.primaer.href} size="lg" pfeil className="w-full sm:w-auto">
                {seite.naechsterSchritt.primaer.label}
              </ButtonLink>
              {seite.naechsterSchritt.sekundaer && (
                <ButtonLink
                  href={seite.naechsterSchritt.sekundaer.href}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {seite.naechsterSchritt.sekundaer.label}
                </ButtonLink>
              )}
            </div>
            {telefon && (
              <p className="mt-6 flex items-center gap-3 text-body text-foreground-muted">
                <GlyphTelefon size={20} aria-hidden className="shrink-0 text-primary" />
                <span>
                  Lieber telefonisch?{' '}
                  {telefonHref ? (
                    <a
                      href={telefonHref}
                      className="inline-flex min-h-touch items-center font-mono font-semibold tabular-nums text-foreground hover:text-primary hover:underline"
                    >
                      {telefon}
                    </a>
                  ) : (
                    <span className="font-mono tabular-nums text-foreground">{telefon}</span>
                  )}
                </span>
              </p>
            )}
          </div>
          <nav aria-label="Weitere Seiten für Partner" className="lg:col-span-7">
            <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Weitere Seiten für Partner</p>
            <ul className="mt-3 border-t border-border">
              <li className="border-b border-border">
                <GewinnungLink href={PARTNER_HAUPTSEITE} label="Partner werden und bewerben" text="Der ganze Weg von der Bewerbung bis zur Freischaltung." />
              </li>
              {weitere.map((andere) => (
                <li key={andere.slug} className="border-b border-border">
                  <GewinnungLink href={andere.pfad} label={andere.kurzname} text={andere.kurztext} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Section>
    </>
  );
}

/** Eintrag einer Verweisliste: Name, ein Satz, Pfeil. */
export function GewinnungLink({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <Link href={href} className="group flex min-h-touch items-start justify-between gap-4 py-4">
      <span className="min-w-0">
        <span className="block text-body font-semibold text-primary">{label}</span>
        <span className="mt-1 block text-small text-foreground-muted">{text}</span>
      </span>
      <GlyphPfeilRechts
        size={16}
        aria-hidden
        className="mt-1 shrink-0 text-primary transition-transform duration-quick ease-standard group-hover:translate-x-1"
      />
    </Link>
  );
}
