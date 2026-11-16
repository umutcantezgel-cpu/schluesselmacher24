import { getRubrik } from '@/lib/data';
import type { FormularKlasse } from '@/lib/fahrzeuge/anfrage-klassen';

/*
 * Rubrik-Stand und erste Brotkrume der Fahrzeugschlüssel-Anfrage (FA-KERN-02B, FA-SOFORT-05), ohne
 * Client-Baustein. `./seiten` exportiert sie unverändert weiter. Eigene Datei, weil Serverbausteine wie
 * `SeitenDaten` (fast jede Seite) sie brauchen: Ein Import aus `./seiten` hängte das Anfrageformular mit
 * Foto-Upload und allen Zeichnungs-Generatoren an das Client-Bündel jeder dieser Seiten (FA-SEO-03B).
 */

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

/**
 * Einleitung im Seitenkopf, solange die Rubrik nicht live ist: statt der Schritte des Formulars, das es dann
 * nicht gibt, ein neutraler Satz.
 */
export const RUBRIK_PAUSIERT_LEAD = 'Diese Anfrage nehmen wir gerade nicht online an. Wir helfen Ihnen gern auf anderem Weg.';

/**
 * Erste Brotkrume nach der Startseite: Krafträder gehören wie das Motorrad zu „Autoschlüssel“. E-Scooter,
 * Seniorenmobil und Fahrradschloss stehen direkt unter der Startseite; „Autoschlüssel“ verwirrte dort.
 */
export function bereichsKrume(klasse: FormularKlasse): Array<{ href: string; label: string }> {
  return klasse === 'motorrad' || klasse === 'roller' || klasse === 'nicht-gefunden' ? [{ href: '/autoschluessel', label: 'Autoschlüssel' }] : [];
}
