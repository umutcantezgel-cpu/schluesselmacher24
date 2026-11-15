import type { Settings } from '@/lib/types';
import { erreichbarkeit, erreichbarkeitSatz } from '@/lib/erreichbarkeit';

/*
 * Titel und Beschreibung der Kontaktseite (FA-SEO-01B).
 *
 * Die Beschreibung nennt die Erreichbarkeit aus denselben Einstellungen wie der sichtbare Abschnitt
 * „Erreichbarkeit“ (`erreichbarkeit(settings)`), im Wortlaut des Inhabers (FA-23, R1, R9). Ändert er
 * sie im Backend, ändert sich das Suchergebnis mit. Trägt die Länge den ganzen Satz nicht, steht nur
 * die Kernaussage; ist der Text zu kurz, folgt ein Satz aus dem Kopf der Seite.
 */

export const KONTAKT_TITEL = 'Kontakt und Erreichbarkeit';

const BESCHREIBUNG_MIN = 120;
const BESCHREIBUNG_MAX = 160;
const ANFANG = 'Anschrift, Telefon und E-Mail.';
/** Aus dem Kopf der Seite („Für einen Auftrag nutzen Sie am besten den passenden Ablauf …“). */
const ERGAENZUNG = 'Für Aufträge nutzen Sie den passenden Ablauf.';

const laenge = (text: string) => [...text].length;
const satz = (teil: string) => (/[.!?]$/.test(teil) ? teil : `${teil}.`);

export function kontaktBeschreibung(settings: Pick<Settings, 'reachability'>): string {
  const angabe = erreichbarkeit(settings);
  const voll = `${ANFANG} ${erreichbarkeitSatz(angabe)}`;
  const kern = `${ANFANG} ${satz(angabe.kernaussage)}`;
  let text = laenge(voll) <= BESCHREIBUNG_MAX ? voll : kern;
  if (laenge(text) > BESCHREIBUNG_MAX) return ANFANG;
  const ergaenzt = `${text} ${ERGAENZUNG}`;
  if (laenge(text) < BESCHREIBUNG_MIN && laenge(ergaenzt) <= BESCHREIBUNG_MAX) text = ergaenzt;
  return text;
}
