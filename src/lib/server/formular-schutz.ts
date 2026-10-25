import 'server-only';

import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

import { jahrInBerlin } from '@/lib/berliner-zeit';
import { HOECHSTALTER_MS, HONIGTOPF_FELD, MINDESTDAUER_MS, type FormularSchutz } from '@/lib/formular-schutz';
import { buildReference } from '@/lib/reference';
import type { RecordKind } from '@/lib/types';
import { istProduktion } from '@/lib/umgebung';

/* ==========================================================================
   Bot-Schutz ohne Fremddienst
   Zwei Merkmale, die Menschen nicht bemerken:
   - ein verstecktes Honigtopf-Feld, das nur Programme ausfüllen,
   - ein beim Öffnen signierter Zeitpunkt (HMAC): zwischen Öffnen und
     Absenden liegen mindestens 4 Sekunden und höchstens 24 Stunden.
   Nur beim ausgefüllten Honigtopf antworten die Aktionen wie bei Erfolg und
   speichern nichts. Ein fehlender oder unpassender Startzeitpunkt kann auch
   Menschen treffen (ohne JavaScript, Netz weg, neuer Schlüssel): Dann gibt
   es einen sichtbaren Fehler mit `schutzNeu` — der Browser holt einen neuen
   Startzeitpunkt, der zweite Versuch geht durch. Der Widerruf wird in diesem
   Fall trotzdem gespeichert (src/lib/actions/widerruf.ts).
   ========================================================================== */

export type SchutzBefund = 'ok' | 'honigtopf' | 'ohne-start' | 'ungueltig' | 'zu-schnell' | 'abgelaufen';

/** Fester Rückfall nur für Entwicklung und Tests — in Produktion nie. */
const RUECKFALL = 'sm24-formularschutz-entwicklung';

let warnungGezeigt = false;

/** Schlüssel für die Signatur; `null` in Produktion ohne PAYLOAD_SECRET. */
function geheimnis(): string | null {
  const gesetzt = process.env.PAYLOAD_SECRET?.trim();
  if (gesetzt) return gesetzt;
  if (!istProduktion()) return RUECKFALL;
  if (!warnungGezeigt) {
    warnungGezeigt = true;
    console.error('[bot-schutz] PAYLOAD_SECRET fehlt — der Startzeitpunkt wird nicht geprüft, nur das Honigtopf-Feld.');
  }
  return null;
}

function signatur(schluessel: string, zeitpunkt: number): Buffer {
  return createHmac('sha256', schluessel).update(`sm24:formular:${zeitpunkt}`, 'utf8').digest();
}

/** Signierter Startzeitpunkt „<ms>.<signatur>“; leer, wenn nicht signiert werden kann. */
export function startSignieren(jetzt = Date.now()): string {
  const schluessel = geheimnis();
  if (!schluessel) return '';
  return `${jetzt}.${signatur(schluessel, jetzt).toString('base64url')}`;
}

/** Prüft Honigtopf und Startzeitpunkt eines abgesendeten Formulars. */
export function formularSchutzPruefen(schutz: FormularSchutz | null | undefined, jetzt = Date.now()): SchutzBefund {
  const honig = schutz?.[HONIGTOPF_FELD];
  if (typeof honig === 'string' && honig.trim() !== '') return 'honigtopf';

  const schluessel = geheimnis();
  if (!schluessel) return 'ok';

  const start = schutz?.start;
  if (typeof start !== 'string' || start === '') return 'ohne-start';
  const treffer = /^(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(start);
  if (!treffer) return 'ungueltig';
  const zeitpunkt = Number(treffer[1]);
  const erhalten = Buffer.from(treffer[2], 'base64url');
  const erwartet = signatur(schluessel, zeitpunkt);
  if (erhalten.length !== erwartet.length || !timingSafeEqual(erhalten, erwartet)) return 'ungueltig';

  const dauer = jetzt - zeitpunkt;
  if (dauer < MINDESTDAUER_MS) return 'zu-schnell';
  if (dauer > HOECHSTALTER_MS) return 'abgelaufen';
  return 'ok';
}

/** Vermerkt einen Treffer im Server-Log — ohne personenbezogene Angaben. */
export function botVerdachtMelden(
  formular: string,
  befund: Exclude<SchutzBefund, 'ok'>,
  folge = befund === 'honigtopf' ? 'still verworfen' : 'abgewiesen, neuer Versuch möglich',
): void {
  console.warn(`[bot-schutz] ${formular}: ${befund} — ${folge}.`);
}

/** Plausible Nummer für die stille Antwort — es gibt keinen Vorgang dazu. */
export function scheinNummer(art: RecordKind, jahr = jahrInBerlin()): string {
  return buildReference(art, jahr, randomInt(1000, 10000));
}
