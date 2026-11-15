import { ServiceArticle, type ServiceArticleProps } from '@/components/autoschluessel/service-article';
import { RUBRIK_PAUSIERT_LEAD, bereichsKrume, rubrikLive } from '@/components/fahrzeug-anfrage/seiten';
import { getPageContent } from '@/lib/data';
import { ANFRAGE_FORMULAR, KLASSEN_SEITEN, type FormularKlasse } from '@/lib/fahrzeuge/anfrage-klassen';

import { JsonLd, pageGraphSchema, type LeistungsAngabe } from './json-ld';
import { eingehendeVerweise, verweisQuellen, zielPfad } from './verweise';

/**
 * Strukturdaten einer Seite ohne eigenen Graphen (FA-SEO-01C): Webseite mit Verweis auf den Betrieb
 * aus dem Root-Layout und die sichtbaren Brotkrumen als BreadcrumbList. Nur übergeben, was auf der
 * Seite sichtbar steht (R8): `crumbs` sind dieselben, die der Seitenkopf zeigt.
 */
export function SeitenDaten({
  pfad,
  name,
  beschreibung,
  crumbs,
  leistung,
  faq,
}: {
  pfad: string;
  name: string;
  beschreibung?: string;
  crumbs: Array<{ href: string; label: string }>;
  leistung?: LeistungsAngabe;
  faq?: Array<{ question: string; answer: string }>;
}) {
  return (
    <JsonLd
      data={pageGraphSchema({
        path: pfad,
        name,
        ...(beschreibung ? { description: beschreibung } : {}),
        crumbs,
        ...(leistung ? { service: leistung } : {}),
        ...(faq?.length ? { faq } : {}),
      })}
    />
  );
}

/**
 * Leistungsseite der Autoschlüssel (Nachmachen, Programmieren …) mit ihren Strukturdaten: Leistung
 * (`Service`) aus Überschrift und Kurztext des Seitenkopfs, Brotkrumen und die Fragen, die der
 * Abschnitt „Häufige Fragen“ zeigt — dieselbe Auswahl wie in `ServiceArticle` (gepflegte vor festen).
 *
 * Der vorhandene Block „Passend dazu“ bekommt die Gegenrichtung der Verweisliste (./verweise.ts):
 * Ratgeber, veröffentlichte Ortsseiten und Seiten, die auf diese Leistung verweisen (höchstens drei).
 */
export async function LeistungsArtikel({ pfad, ...props }: ServiceArticleProps & { pfad: string }) {
  const vorhanden = new Set([...(props.content?.seo.internalLinks ?? []), ...(props.related ?? [])].map((link) => zielPfad(link.href)));
  const zurueck = eingehendeVerweise(pfad, await verweisQuellen())
    .filter((verweis) => !vorhanden.has(zielPfad(verweis.href)))
    .slice(0, 3);
  const name = props.content?.headline ?? props.fallback.headline;
  const kurztext = props.content?.subline ?? props.fallback.subline;
  const gepflegt = props.content?.faq ?? [];
  const faq = gepflegt.length > 0 ? gepflegt : props.faq;
  return (
    <>
      <SeitenDaten
        pfad={pfad}
        name={name}
        beschreibung={kurztext}
        crumbs={props.crumbs}
        leistung={{ name, description: kurztext }}
        faq={faq}
      />
      <ServiceArticle {...props} related={[...(props.related ?? []), ...zurueck]} />
    </>
  );
}

/**
 * Strukturdaten der Seiten der Fahrzeugklassen (FA-KERN-02B): dieselben Brotkrumen und Kopftexte, die
 * `EinstiegSeite` und `FahrzeugAnfrageSeite` zeigen (gepflegte Texte vor den festen). Die Einstiegsseite
 * beschreibt eine Leistung, die Anfrageseite einen Ablauf.
 *
 * Ist die Rubrik pausiert, nimmt die Seite keine Anfrage an: keine Leistung (`Service`), und die Anfrageseite
 * beschreibt sich mit dem Pausentext, den ihr Kopf dann sichtbar zeigt (R8).
 */
export async function KlassenSeitenDaten({ klasse, art }: { klasse: Exclude<FormularKlasse, 'motorrad'>; art: 'einstieg' | 'anfrage' }) {
  const formular = ANFRAGE_FORMULAR[klasse];
  const seiten = KLASSEN_SEITEN[klasse];
  const fest = seiten[art];
  if (!fest) return null;
  const [page, live] = await Promise.all([getPageContent(fest.route), rubrikLive(klasse)]);
  const headline = page?.headline ?? fest.headline;
  const subline = page?.subline ?? fest.subline;

  if (art === 'einstieg' && formular.einstieg) {
    const crumbs = [...bereichsKrume(klasse), { href: formular.einstieg, label: headline }];
    return (
      <SeitenDaten
        pfad={formular.einstieg}
        name={headline}
        beschreibung={subline}
        crumbs={crumbs}
        {...(live ? { leistung: { name: headline, description: subline } } : {})}
      />
    );
  }

  // Wie FahrzeugAnfrageSeite: die erste Krume trägt den festen Kopftext der Einstiegsseite.
  const crumbs = formular.einstieg
    ? [
        { href: formular.einstieg, label: seiten.einstieg?.headline ?? formular.titel },
        { href: formular.anfrage, label: 'Anfrage' },
      ]
    : [
        { href: '/autoschluessel', label: 'Autoschlüssel' },
        { href: formular.anfrage, label: 'Fahrzeug nicht gefunden' },
      ];
  return <SeitenDaten pfad={formular.anfrage} name={headline} beschreibung={live ? subline : RUBRIK_PAUSIERT_LEAD} crumbs={crumbs} />;
}
