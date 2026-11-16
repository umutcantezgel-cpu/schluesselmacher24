import { PageHeader } from '@/components/layout/page-header';
import { jahrInBerlin } from '@/lib/berliner-zeit';
import { ANFRAGE_FORMULAR, KLASSEN_SEITEN, type FormularKlasse } from '@/lib/fahrzeuge/anfrage-klassen';
import { PROCESS_LABELS } from '@/lib/navigation';

import { RubrikPausiertInhalt, hilfeAngaben, kopfMit } from './einstieg';
import { FahrzeugAnfrageFormular } from './formular';
import { KLASSE_RUBRIK, RUBRIK_PAUSIERT_LEAD, bereichsKrume, rubrikLive } from './rubrik';
import { vorbelegungAus } from './kern';
import { pflichtTabelle } from './pflicht';

/* Rubrik-Stand und Brotkrume liegen in ./rubrik (ohne Client-Baustein), damit Serverbausteine wie
   `SeitenDaten` sie lesen können, ohne das Anfrageformular in das Bündel jeder Seite zu ziehen (FA-SEO-03B). */
export { KLASSE_RUBRIK, RUBRIK_PAUSIERT_LEAD, bereichsKrume, rubrikLive };

/* Einstiegsseiten, Hinweise und Metadaten liegen in ./einstieg (ebenfalls ohne Client-Baustein). Seiten ohne
   Formular lesen dort; diese Datei gibt alles unverändert weiter, damit bisherige Importe gleich bleiben. */
export {
  EinstiegSeite,
  RubrikPausiertHinweis,
  UnterlagenAusRegel,
  robotsFuer,
  robotsNachStand,
  seitenMetadata,
  type EinstiegAbschnitt,
} from './einstieg';

/* ==========================================================================
   Seiten der gemeinsamen Fahrzeugschlüssel-Anfrage mit Formular (FA-KERN-02B)
   ========================================================================== */

type Suchparameter = { [key: string]: string | string[] | undefined };

/**
 * Das Formular einer Klasse mit allem, was es vom Server braucht: Pflichtliste der Regel, Telefon,
 * Erreichbarkeit, Jahr und, bei „nicht gefunden“, die Vorbelegung aus der Adresse.
 */
export async function FahrzeugAnfrageInhalt({ klasse, suchparameter }: { klasse: FormularKlasse; suchparameter?: Suchparameter }) {
  // Rubrik nicht live (FA-KERN-05): Hinweis mit Telefon statt eines Formulars, das der Server ablehnen würde.
  const [live, { telefon, erreichbarkeit: angabe }] = await Promise.all([rubrikLive(klasse), hilfeAngaben()]);
  if (!live) return <RubrikPausiertInhalt telefon={telefon} angabe={angabe} />;
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
  const [kopf, live] = await Promise.all([kopfMit(KLASSEN_SEITEN[klasse].anfrage), rubrikLive(klasse)]);
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
      <PageHeader bereich="autoschluessel" art="arbeit" eyebrow={PROCESS_LABELS['gefuehrte-anfrage'].label} title={kopf.headline} lead={live ? kopf.subline : RUBRIK_PAUSIERT_LEAD} crumbs={crumbs} />
      <div className="shell py-8 md:py-12">
        <FahrzeugAnfrageInhalt klasse={klasse} suchparameter={suchparameter} />
      </div>
    </>
  );
}
