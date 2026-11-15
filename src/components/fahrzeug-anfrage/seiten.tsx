import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Erreichbarkeit as ErreichbarkeitAnzeige } from '@/components/vertrauen/erreichbarkeit';
import { jahrInBerlin } from '@/lib/berliner-zeit';
import { getPageContent, getRubrik, getSettings } from '@/lib/data';
import { erreichbarkeit } from '@/lib/erreichbarkeit';
import { ANFRAGE_FORMULAR, KLASSEN_SEITEN, type FormularKlasse, type SeitenKopf } from '@/lib/fahrzeuge/anfrage-klassen';
import { PROCESS_LABELS } from '@/lib/navigation';
import { kontakt } from '@/lib/rechtliches/firma';
import { telefonLink } from '@/lib/telefon';

import { FahrzeugAnfrageFormular } from './formular';
import { vorbelegungAus } from './kern';
import { pflichtListe, pflichtPunkte, pflichtTabelle } from './pflicht';

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

/**
 * Rubrik je Klasse (FA-SOFORT-05, wie in `src/lib/actions/records.ts`): Steht sie im Backend nicht auf „live“,
 * lehnt der Server die Anfrage ab. Die Seiten zeigen dann einen ruhigen Hinweis mit Telefon statt des
 * Formulars, stehen auf noindex und fehlen in der Sitemap (FA-KERN-05).
 */
export const KLASSE_RUBRIK: Readonly<Record<FormularKlasse, string>> = {
  motorrad: 'motorradschluessel',
  roller: 'roller-und-kleinstfahrzeuge',
  'e-scooter': 'e-scooter',
  seniorenmobil: 'seniorenmobile',
  fahrrad: 'fahrradschluessel',
  'nicht-gefunden': 'autoschluessel',
};

/** Ist die Rubrik der Klasse live? Abgeschaltet, „später“ oder gelöscht heißt: nein. */
export async function rubrikLive(klasse: FormularKlasse): Promise<boolean> {
  return (await getRubrik(KLASSE_RUBRIK[klasse]))?.status === 'live';
}

/** Robots-Angabe nach Schalter und Rubrik: Ist die Rubrik nicht live, steht die Seite auf noindex. */
export async function robotsNachStand(klasse: FormularKlasse): Promise<Pick<Metadata, 'robots'>> {
  return (await rubrikLive(klasse)) ? robotsFuer(klasse) : { robots: { index: false, follow: true } };
}

/** Ruhiger Hinweis statt des Formulars, solange die Rubrik nicht live ist; mit Telefon, wenn gepflegt. */
export async function RubrikPausiertHinweis({ className }: { className?: string }) {
  const { telefon, erreichbarkeit: angabe } = await hilfeAngaben();
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
            <a href="/service-und-termin/kontakt" className="font-semibold text-primary">
              Kontaktformular
            </a>
            . Wir melden uns bei Ihnen.
          </>
        )}
      </Alert>
      {telefon && <ErreichbarkeitAnzeige angabe={angabe} className="mt-4" />}
    </div>
  );
}

async function kopfMit(kopf: SeitenKopf) {
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
async function hilfeAngaben() {
  const settings = await getSettings();
  return { telefon: kontakt(settings.company).telefon, erreichbarkeit: erreichbarkeit(settings) };
}

type Suchparameter = { [key: string]: string | string[] | undefined };

/**
 * Das Formular einer Klasse mit allem, was es vom Server braucht: Pflichtliste der Regel, Telefon,
 * Erreichbarkeit, Jahr und, bei „nicht gefunden“, die Vorbelegung aus der Adresse.
 */
export async function FahrzeugAnfrageInhalt({ klasse, suchparameter }: { klasse: FormularKlasse; suchparameter?: Suchparameter }) {
  // Rubrik nicht live (FA-KERN-05): Hinweis mit Telefon statt eines Formulars, das der Server ablehnen würde.
  if (!(await rubrikLive(klasse))) return <RubrikPausiertHinweis />;
  const { telefon, erreichbarkeit: angabe } = await hilfeAngaben();
  const vorbelegung = klasse === 'nicht-gefunden' && suchparameter ? vorbelegungAus(suchparameter) : undefined;
  return (
    <FahrzeugAnfrageFormular
      klasse={klasse}
      pflichtTabelle={pflichtTabelle(klasse)}
      telefon={telefon}
      erreichbarkeit={angabe}
      vorbelegung={vorbelegung}
      jahr={jahrInBerlin()}
    />
  );
}

/** Ganze Anfrageseite einer neuen Klasse: Kopf als Arbeitsansicht und das Formular. */
export async function FahrzeugAnfrageSeite({ klasse, suchparameter }: { klasse: Exclude<FormularKlasse, 'motorrad'>; suchparameter?: Suchparameter }) {
  const formular = ANFRAGE_FORMULAR[klasse];
  const kopf = await kopfMit(KLASSEN_SEITEN[klasse].anfrage);
  const crumbs = formular.einstieg
    ? [
        { href: formular.einstieg, label: KLASSEN_SEITEN[klasse].einstieg?.headline ?? formular.titel },
        { href: formular.anfrage, label: 'Anfrage' },
      ]
    : [
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: formular.anfrage, label: 'Fahrzeug nicht gefunden' },
      ];
  return (
    <>
      <PageHeader bereich="autoschluessel" art="arbeit" eyebrow={PROCESS_LABELS['gefuehrte-anfrage'].label} title={kopf.headline} lead={kopf.subline} crumbs={crumbs} />
      <div className="shell py-8 md:py-12">
        <FahrzeugAnfrageInhalt klasse={klasse} suchparameter={suchparameter} />
      </div>
    </>
  );
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

/**
 * Erste Brotkrume nach der Startseite: Krafträder gehören wie das Motorrad zu „Autoschlüssel“. E-Scooter,
 * Seniorenmobil und Fahrradschloss stehen direkt unter der Startseite; „Autoschlüssel“ verwirrte dort.
 */
export function bereichsKrume(klasse: FormularKlasse): Array<{ href: string; label: string }> {
  return klasse === 'motorrad' || klasse === 'roller' || klasse === 'nicht-gefunden' ? [{ href: '/autoschluessel', label: 'Autoschlüssel' }] : [];
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
        {!live && <RubrikPausiertHinweis className="mt-8" />}
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
