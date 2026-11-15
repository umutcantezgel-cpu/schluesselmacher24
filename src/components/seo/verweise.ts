import { getCities, getCollection, getGuides, getServicePages } from '@/lib/data';
import { areaByKey } from '@/lib/navigation';
import { stadtIndexierbar } from '@/lib/rechtliches/indexierung';
import type { CityPage, Guide, PageContent, ServicePage } from '@/lib/types';

/* ==========================================================================
   Verweisliste „Passt dazu“ (FA-25-16 bis FA-25-18, FA-SEO-01C)
   Ein System, keine handgesetzten Blöcke: Jede Seite nennt in `seo.internalLinks`
   (content/seo.json, service-pages.json, guides.json, cities.json und ihre
   Rückfälle, im Admin pflegbar), wohin sie verweist. Die Gegenrichtung entsteht
   hier aus denselben Daten: Verweist ein Ratgeber auf eine Leistung, verweist die
   Leistung zurück auf den Ratgeber; ebenso Ortsseite ↔ Leistung (nur
   veröffentlichte Ortsseiten), Partnerseite ↔ Autoschlüssel und Fahrzeugklasse ↔
   Autoschlüssel. Anker sind die sichtbaren Überschriften der Quellseiten, keine
   Suchbegriffe (R6).
   ========================================================================== */

export interface Verweis {
  href: string;
  label: string;
}

/** Eine Seite als Quelle von Verweisen: ihr Pfad, ihre sichtbare Überschrift und ihre gepflegten Links. */
export interface VerweisQuelle {
  pfad: string;
  titel: string;
  links: Verweis[];
}

/** Pfad ohne Abfrage und Anker, ohne Schrägstrich am Ende (außer der Startseite). */
export function zielPfad(href: string): string {
  const pfad = href.split(/[?#]/, 1)[0] || '/';
  return pfad.length > 1 ? pfad.replace(/\/+$/, '') : pfad;
}

/**
 * Seiten, die eine Rückverbindung tragen: Formularschritte (…/anfrage, …/anmelden) und die
 * „Fahrzeug nicht gefunden“-Anfrage sind Abläufe, keine Lesestücke — sie stehen nicht in „Passt dazu“.
 */
function istLeseseite(pfad: string): boolean {
  return !/\/(anfrage|anmelden|fahrzeug-nicht-gefunden)$/.test(pfad) && pfad !== '/';
}

/**
 * Quellen, die auf `pfad` verweisen (Gegenrichtung), ohne `pfad` selbst, ohne Abläufe und ohne eigene
 * Unterseiten (`/bereich/…` → `/bereich`): Die Bereichsseite listet ihre Unterseiten ohnehin.
 */
export function eingehendeVerweise(pfad: string, quellen: VerweisQuelle[]): Verweis[] {
  const ziel = zielPfad(pfad);
  return quellen
    .filter((quelle) => quelle.pfad !== ziel && !quelle.pfad.startsWith(`${ziel}/`) && istLeseseite(quelle.pfad))
    .filter((quelle) => quelle.links.some((link) => zielPfad(link.href) === ziel))
    .map((quelle) => ({ href: quelle.pfad, label: quelle.titel }));
}

/**
 * „Passt dazu“ für eine Seite: zuerst die eigenen gepflegten Links, dann die Gegenrichtung. Ohne die
 * Seite selbst, ohne doppelte Ziele (gleicher Pfad ohne Abfrage), ohne `ausser` (Ziele, die die Seite
 * an anderer Stelle schon zeigt), höchstens `max` Einträge.
 */
export function passtDazu(
  pfad: string,
  eigene: Verweis[],
  quellen: VerweisQuelle[],
  { ausser = [], max = 6 }: { ausser?: string[]; max?: number } = {},
): Verweis[] {
  const gesehen = new Set([zielPfad(pfad), ...ausser.map(zielPfad)]);
  const ergebnis: Verweis[] = [];
  for (const verweis of [...eigene, ...eingehendeVerweise(pfad, quellen)]) {
    const ziel = zielPfad(verweis.href);
    if (gesehen.has(ziel) || !verweis.label.trim()) continue;
    gesehen.add(ziel);
    ergebnis.push(verweis);
    if (ergebnis.length >= max) break;
  }
  return ergebnis;
}

/* ---------- Quellen aus der Datenschicht --------------------------------- */

export function quellenAusSeiten(seiten: PageContent[]): VerweisQuelle[] {
  return seiten
    .filter((seite) => !seite.seo.noindex && seite.headline?.trim())
    .map((seite) => ({ pfad: seite.route ? `/${seite.route}` : '/', titel: seite.headline, links: seite.seo.internalLinks ?? [] }));
}

export function quellenAusLeistungen(leistungen: ServicePage[]): VerweisQuelle[] {
  return leistungen
    .filter((leistung) => !leistung.seo.noindex)
    .map((leistung) => ({ pfad: `/${leistung.area}/${leistung.slug}`, titel: leistung.title, links: leistung.seo.internalLinks ?? [] }));
}

export function quellenAusRatgebern(ratgeber: Guide[]): VerweisQuelle[] {
  return ratgeber
    .filter((beitrag) => !beitrag.seo.noindex)
    .map((beitrag) => ({ pfad: `/ratgeber/${beitrag.slug}`, titel: beitrag.title, links: beitrag.seo.internalLinks ?? [] }));
}

/**
 * Nur veröffentlichte Ortsseiten (ohne Platzhalter, ohne noindex); Anker ist ihre Überschrift. Neben den
 * gepflegten Links zählen die Bereiche, die die Ortsseite unter „Bereiche in dieser Region“ verlinkt
 * (`servicesOffered`): So verweist jede angebotene Leistung zurück auf den Ort (FA-25-17).
 */
export function quellenAusOrten(orte: CityPage[]): VerweisQuelle[] {
  return orte.filter(stadtIndexierbar).map((ort) => ({
    pfad: `/standorte/${ort.slug}`,
    titel: `Schlüssel- und Schließtechnik in ${ort.city}`,
    links: [
      ...(ort.seo.internalLinks ?? []),
      ...ort.servicesOffered.flatMap((key) => {
        const bereich = areaByKey(key);
        return bereich ? [{ href: bereich.href, label: bereich.label }] : [];
      }),
    ],
  }));
}

/**
 * Alle Quellen der Verweisliste. Fehlt eine Sammlung, fehlen nur ihre Verweise. Reihenfolge = Vorrang in
 * der Gegenrichtung: Ratgeber und Orte vor Seiten, Leistungsseiten zuletzt (deren Bereichsseite listet
 * sie ohnehin).
 */
export async function verweisQuellen(): Promise<VerweisQuelle[]> {
  const leer = <T>(): T[] => [];
  const [seiten, leistungen, ratgeber, orte] = await Promise.all([
    getCollection('pages').catch(leer<PageContent>),
    getServicePages().catch(leer<ServicePage>),
    getGuides().catch(leer<Guide>),
    getCities().catch(leer<CityPage>),
  ]);
  return [...quellenAusRatgebern(ratgeber), ...quellenAusOrten(orte), ...quellenAusSeiten(seiten), ...quellenAusLeistungen(leistungen)];
}
