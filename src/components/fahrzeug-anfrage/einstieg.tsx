import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Erreichbarkeit as ErreichbarkeitAnzeige } from '@/components/vertrauen/erreichbarkeit';
import { getPageContent, getSettings } from '@/lib/data';
import { erreichbarkeit } from '@/lib/erreichbarkeit';
import { ANFRAGE_FORMULAR, KLASSEN_SEITEN, type FormularKlasse, type SeitenKopf } from '@/lib/fahrzeuge/anfrage-klassen';
import { kontakt } from '@/lib/rechtliches/firma';
import { telefonLink } from '@/lib/telefon';

import { bereichsKrume, rubrikLive } from './rubrik';
import { pflichtListe, pflichtPunkte } from './pflicht';

/* ==========================================================================
   Einstiegsseiten und gemeinsame Teile der Fahrzeugschlüssel-Anfrage, ohne das Formular (FA-SEO-03B).
   Diese Datei bindet keinen Client-Baustein ein. Seiten, die kein Formular zeigen (Einstiegsseiten der
   Klassen, /motorradschluessel), lesen von hier und nicht aus ./seiten: Sonst hinge das Anfrageformular
   mit Foto-Upload und Zeichnungen am Skript-Bündel einer Seite, die es nie zeigt. ./seiten gibt alles
   von hier unverändert weiter und fügt nur die Bausteine mit Formular hinzu.
   ========================================================================== */

/* ==========================================================================
   Seiten der gemeinsamen Fahrzeugschlüssel-Anfrage (FA-KERN-02B)
   Kopftexte aus content/seo.json über die Datenschicht, sonst gleichlautend aus den Klassendaten
   (KLASSEN_SEITEN). Solange der Schalter `indexierbar` einer Klasse aus ist, stehen Einstiegsseite und
   Anfrage auf noindex und fehlen in der Sitemap.
   ========================================================================== */

/** Robots-Angabe nach dem Schalter der Klasse; ohne Angabe gilt die des Layouts. */
export function robotsFuer(klasse: FormularKlasse): Pick<Metadata, 'robots'> {
  return ANFRAGE_FORMULAR[klasse].indexierbar ? {} : { robots: { index: false, follow: true } };
}

/** Robots-Angabe nach Schalter und Rubrik: Ist die Rubrik nicht live, steht die Seite auf noindex. */
export async function robotsNachStand(klasse: FormularKlasse): Promise<Pick<Metadata, 'robots'>> {
  return (await rubrikLive(klasse)) ? robotsFuer(klasse) : { robots: { index: false, follow: true } };
}

/** Ruhiger Hinweis statt des Formulars, solange die Rubrik nicht live ist; mit Telefon, wenn gepflegt. */
export async function RubrikPausiertHinweis({ className }: { className?: string }) {
  const { telefon, erreichbarkeit: angabe } = await hilfeAngaben();
  return <RubrikPausiertInhalt className={className} telefon={telefon} angabe={angabe} />;
}

/** Inhalt des Hinweises, mit Telefon und Erreichbarkeit von außen (synchron, auch für Tests). */
export function RubrikPausiertInhalt({
  className,
  telefon,
  angabe,
}: {
  className?: string;
  telefon: Awaited<ReturnType<typeof hilfeAngaben>>['telefon'];
  angabe: Awaited<ReturnType<typeof hilfeAngaben>>['erreichbarkeit'];
}) {
  const telefonHref = telefonLink(telefon);
  return (
    <div className={className} data-block="rubrik-pausiert">
      <Alert tone="info" title="Diese Anfrage ist gerade nicht online möglich">
        {telefon ? (
          <>
            Bitte rufen Sie uns an, wir helfen Ihnen gern weiter:{' '}
            {telefonHref ? (
              <a href={telefonHref} className="whitespace-nowrap font-mono font-semibold tabular-nums text-primary">
                {telefon}
              </a>
            ) : (
              <span className="whitespace-nowrap font-mono tabular-nums">{telefon}</span>
            )}
          </>
        ) : (
          <>
            Bitte schreiben Sie uns über das{' '}
            <Link href="/service-und-termin/kontakt" className="font-semibold text-primary">
              Kontaktformular
            </Link>
            . Wir melden uns bei Ihnen.
          </>
        )}
      </Alert>
      {telefon && <ErreichbarkeitAnzeige angabe={angabe} className="mt-4" />}
    </div>
  );
}

export async function kopfMit(kopf: SeitenKopf) {
  const page = await getPageContent(kopf.route);
  return {
    headline: page?.headline ?? kopf.headline,
    subline: page?.subline ?? kopf.subline,
    intro: page?.intro || kopf.intro,
    title: page?.seo.title ?? kopf.title,
    description: page?.seo.description ?? kopf.description,
  };
}

/** Metadaten einer Seite der neuen Klassen: Kopftexte, Kanonische Adresse, noindex nach Schalter. */
export async function seitenMetadata(klasse: Exclude<FormularKlasse, 'motorrad'>, art: 'einstieg' | 'anfrage'): Promise<Metadata> {
  const kopf = KLASSEN_SEITEN[klasse][art];
  if (!kopf) return {};
  const texte = await kopfMit(kopf);
  return { title: texte.title, description: texte.description, alternates: { canonical: `/${kopf.route}` }, ...(await robotsNachStand(klasse)) };
}

/** Telefon und Erreichbarkeit aus den Einstellungen; nur veröffentlichte, gepflegte Angaben. */
export async function hilfeAngaben() {
  const settings = await getSettings();
  return { telefon: kontakt(settings.company).telefon, erreichbarkeit: erreichbarkeit(settings) };
}

/** Was wir brauchen, aus der Pflichtregel: beim Roller beide Wege, sonst eine Liste. */
export function UnterlagenAusRegel({ klasse }: { klasse: FormularKlasse }) {
  const wege =
    klasse === 'roller'
      ? [
          { titel: 'Mit Fahrzeugschein', punkte: pflichtPunkte(klasse, pflichtListe(klasse, 'zulassung', 'vorhanden')) },
          { titel: 'Mit Versicherungskennzeichen', punkte: pflichtPunkte(klasse, pflichtListe(klasse, 'versicherungskennzeichen', 'vorhanden')) },
        ]
      : [{ titel: null, punkte: pflichtPunkte(klasse, pflichtListe(klasse, null, 'vorhanden')) }];
  return (
    <div className={wege.length > 1 ? 'grid gap-8 md:grid-cols-2' : ''}>
      {wege.map((weg) => (
        <div key={weg.titel ?? 'liste'}>
          {weg.titel && <h3 className="text-body font-semibold text-foreground">{weg.titel}</h3>}
          <ul className="mt-3 space-y-2 text-body leading-relaxed text-foreground-muted">
            {weg.punkte.map((punkt) => (
              <li key={punkt} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{punkt}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className={wege.length > 1 ? 'text-small text-foreground-muted md:col-span-2' : 'mt-4 text-small text-foreground-muted'}>
        Ist kein Schlüssel mehr da, entfallen die Fotos des Schlüssels. Die Unterlagen schützen Sie vor Missbrauch: Wir fertigen
        Schlüssel nur für Berechtigte.
      </p>
    </div>
  );
}

export interface EinstiegAbschnitt {
  titel: string;
  absaetze: string[];
}

/**
 * Einstiegsseite einer neuen Klasse nach dem Muster von /motorradschluessel: was wir tun, was bei dieser
 * Fahrzeugart anders ist, was wir brauchen (aus der Regel), Knopf zur Anfrage, Telefon. Keine Preise,
 * keine Zeiten, keine Marken- oder Modellversprechen (R4).
 */
/**
 * `ablauf`: der Ablauf aus den Rubrikdaten (G-10, FA-SOFORT-05), etwa `<RubrikAblaufAbschnitt …/>`; er steht
 * nach den eigenen Abschnitten und vor „Das brauchen wir von Ihnen“.
 */
export async function EinstiegSeite({
  klasse,
  abschnitte,
  ablauf,
}: {
  klasse: Exclude<FormularKlasse, 'motorrad' | 'nicht-gefunden'>;
  abschnitte: EinstiegAbschnitt[];
  ablauf?: ReactNode;
}) {
  const formular = ANFRAGE_FORMULAR[klasse];
  const kopfDaten = KLASSEN_SEITEN[klasse].einstieg!;
  const [kopf, hilfe, live] = await Promise.all([kopfMit(kopfDaten), hilfeAngaben(), rubrikLive(klasse)]);
  const telefonHref = telefonLink(hilfe.telefon);
  const crumbs = [...bereichsKrume(klasse), { href: formular.einstieg!, label: kopf.headline }];

  return (
    <>
      <PageHeader
        eyebrow="Fahrzeugschlüssel"
        title={kopf.headline}
        lead={kopf.subline}
        crumbs={crumbs}
        bereich="autoschluessel"
        actions={
          live ? (
            <ButtonLink href={formular.anfrage} size="lg" pfeil>
              Anfrage stellen
            </ButtonLink>
          ) : undefined
        }
      />

      <Section>
        <div className="max-w-measure space-y-10">
          {kopf.intro && <p className="text-body leading-relaxed text-foreground">{kopf.intro}</p>}
          {abschnitte.map((abschnitt, i) => (
            <div key={abschnitt.titel}>
              <SectionHeading nummer={String(i + 1).padStart(2, '0')} title={abschnitt.titel} />
              <div className="mt-4 space-y-3 text-body leading-relaxed text-foreground-muted">
                {abschnitt.absaetze.map((absatz) => (
                  <p key={absatz}>{absatz}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {ablauf}

      <Section tone="muted" labelledBy="unterlagen-titel">
        <SectionHeading id="unterlagen-titel" nummer={String(abschnitte.length + (ablauf ? 2 : 1)).padStart(2, '0')} eyebrow="Für die Anfrage" title="Das brauchen wir von Ihnen" />
        <div className="mt-6 max-w-3xl">
          <UnterlagenAusRegel klasse={klasse} />
        </div>
        {!live && <RubrikPausiertInhalt className="mt-8" telefon={hilfe.telefon} angabe={hilfe.erreichbarkeit} />}
        {live && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink href={formular.anfrage} size="lg" pfeil>
              Anfrage stellen
            </ButtonLink>
            {hilfe.telefon && (
              <p className="text-body text-foreground-muted">
                Lieber persönlich?{' '}
                {telefonHref ? (
                  <a href={telefonHref} className="whitespace-nowrap font-mono font-semibold tabular-nums text-primary">
                    {hilfe.telefon}
                  </a>
                ) : (
                  <span className="whitespace-nowrap font-mono tabular-nums">{hilfe.telefon}</span>
                )}
              </p>
            )}
          </div>
        )}
        {live && hilfe.telefon && <ErreichbarkeitAnzeige angabe={hilfe.erreichbarkeit} className="mt-4" />}
      </Section>
    </>
  );
}
