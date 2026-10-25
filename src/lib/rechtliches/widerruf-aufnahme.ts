import { createHash, timingSafeEqual } from 'node:crypto';

import { z } from 'zod';

import type { CompanyProfile } from '@/lib/types';

import { kontakt } from './firma';
import { WIDERRUF_ERKLAERUNG, type WiderrufErgebnis, type WiderrufFeld } from './widerruf-typen';
import { eingangszeitText } from './zeit';

export { WIDERRUF_ERKLAERUNG, type WiderrufErgebnis, type WiderrufFeld };

/* ==========================================================================
   Widerruf über die Website (Widerrufsbutton)
   Jede Erklärung wird mit Eingangszeit gespeichert — wirksam ist sie mit dem
   Zugang. Einem Vorgang zugeordnet wird sie nur, wenn Vorgangsnummer und
   E-Mail-Adresse zusammenpassen (zeitkonstant verglichen); sonst steht sie
   im Backend auf „Zu prüfen“. Die Antwort verrät nie, ob es eine Nummer gibt.
   Es wird nie automatisch storniert oder erstattet.

   Die Abhängigkeiten (Speicher, Vorgangssuche, Mailversand) kommen als
   Parameter — so lässt sich der Ablauf ohne Datenbank und Netz testen.
   Die Mails selbst (Eingangsbestätigung an den Kunden, Meldung an den
   Betrieb) baut src/lib/server/benachrichtigungen.ts aus den Vorlagen.
   ========================================================================== */

export const widerrufSchema = z.object({
  name: z
    .string({ error: 'Bitte geben Sie Ihren Namen an.' })
    .trim()
    .min(2, 'Bitte geben Sie Ihren Namen an.')
    .max(120, 'Der Name ist zu lang.'),
  email: z
    .string({ error: 'Bitte geben Sie Ihre E-Mail-Adresse an.' })
    .trim()
    .max(254, 'Die E-Mail-Adresse ist zu lang.')
    .email('Bitte geben Sie eine gültige E-Mail-Adresse an.'),
  vorgangsnummer: z
    .string()
    .trim()
    .max(40, 'Die Vorgangsnummer ist zu lang.')
    .optional()
    .transform((wert) => (wert ? wert.toUpperCase() : undefined)),
  erklaerung: z
    .string()
    .trim()
    .max(2000, 'Der Text ist zu lang (höchstens 2000 Zeichen).')
    .optional()
    .transform((wert) => wert || undefined),
});

export type WiderrufEingabe = z.input<typeof widerrufSchema>;
/** Datensatz für die Sammlung `widerrufe`. */
export interface WiderrufDatensatz {
  name: string;
  email: string;
  vorgangsnummer?: string;
  eingegangenAm: string;
  erklaerung: string;
  vorgang?: number;
  zuordnung: 'zugeordnet' | 'zu-pruefen';
  bearbeitet: false;
}

export interface WiderrufBestaetigung {
  ergebnis: 'gesendet' | 'fehlgeschlagen' | 'nicht-eingerichtet';
  am: string;
  anbieterId?: string;
  fehler?: string;
}

/** Ergebnis des Mailversands, wie es im Protokoll steht. */
export type WiderrufMailErgebnis = Omit<WiderrufBestaetigung, 'am'>;

export interface WiderrufUmgebung {
  /** Ohne Datenbank wird nichts gespeichert. */
  mitDatenbank: boolean;
  firma: CompanyProfile;
  jetzt: () => Date;
  vorgangFinden: (nummer: string) => Promise<{ id: string; contact: { email: string } } | null>;
  speichern: (datensatz: WiderrufDatensatz) => Promise<{ id: number | string }>;
  bestaetigungVermerken: (id: number | string, bestaetigung: WiderrufBestaetigung) => Promise<void>;
  /** Eingangsbestätigung an den Kunden (dauerhafter Datenträger, mit Datum und Uhrzeit). */
  bestaetigungSenden: (datensatz: WiderrufDatensatz) => Promise<WiderrufMailErgebnis>;
  /** Meldung „Widerruf eingegangen“ an den Betrieb (optional, Fehler ändern nichts). */
  betriebInformieren?: (datensatz: WiderrufDatensatz, id: number | string) => Promise<void>;
  /** Interne Notiz am zugeordneten Vorgang (optional). */
  vorgangVermerken?: (vorgangId: string, notiz: string) => Promise<void>;
}

/* ---------- Hilfen ------------------------------------------------------- */

function hash(wert: string): Buffer {
  return createHash('sha256').update(wert.trim().toLowerCase(), 'utf8').digest();
}

/** Vergleicht zwei E-Mail-Adressen ohne Groß-/Kleinschreibung in konstanter Zeit. */
export function gleicheEmail(a: string, b: string): boolean {
  return timingSafeEqual(hash(a), hash(b));
}

function fehlerJeFeld(error: z.ZodError): Partial<Record<WiderrufFeld, string>> {
  const fehler: Partial<Record<WiderrufFeld, string>> = {};
  for (const problem of error.issues) {
    const feld = problem.path[0] as WiderrufFeld | undefined;
    if (feld && !fehler[feld]) fehler[feld] = problem.message;
  }
  return fehler;
}

/* ---------- Ablauf ------------------------------------------------------- */

/**
 * Nimmt eine Widerrufserklärung auf: prüfen, speichern, zuordnen, bestätigen.
 * Ein Fehler beim Mailversand ändert das Ergebnis nicht — die Erklärung ist
 * gespeichert und die Eingangszeit steht auf dem Bildschirm.
 */
export async function widerrufAufnehmen(eingabe: unknown, umgebung: WiderrufUmgebung): Promise<WiderrufErgebnis> {
  const geprueft = widerrufSchema.safeParse(eingabe);
  if (!geprueft.success) return { status: 'ungueltig', fehler: fehlerJeFeld(geprueft.error) };
  const { name, email, vorgangsnummer, erklaerung } = geprueft.data;
  const firmaEmail = kontakt(umgebung.firma).email;

  if (!umgebung.mitDatenbank) return { status: 'ohne-speicher', ...(firmaEmail ? { email: firmaEmail } : {}) };

  const eingegangenAm = umgebung.jetzt().toISOString();

  // Zuordnung nur bei passender E-Mail. Ohne Treffer wird trotzdem verglichen,
  // damit die Laufzeit nicht verrät, ob es die Nummer gibt.
  let vorgang: Awaited<ReturnType<WiderrufUmgebung['vorgangFinden']>> = null;
  if (vorgangsnummer) {
    try {
      vorgang = await umgebung.vorgangFinden(vorgangsnummer);
    } catch (error) {
      console.error('[widerruf] Vorgangssuche fehlgeschlagen, Erklärung wird zur Prüfung gespeichert.', error);
    }
  }
  const emailPasst = gleicheEmail(vorgang?.contact.email ?? email, email);
  const zugeordnet = Boolean(vorgang) && emailPasst && /^\d+$/.test(vorgang!.id);

  const datensatz: WiderrufDatensatz = {
    name,
    email,
    ...(vorgangsnummer ? { vorgangsnummer } : {}),
    eingegangenAm,
    erklaerung: erklaerung ? `${WIDERRUF_ERKLAERUNG}\n\n${erklaerung}` : WIDERRUF_ERKLAERUNG,
    ...(zugeordnet ? { vorgang: Number(vorgang!.id) } : {}),
    zuordnung: zugeordnet ? 'zugeordnet' : 'zu-pruefen',
    bearbeitet: false,
  };

  let gespeichert: { id: number | string };
  try {
    gespeichert = await umgebung.speichern(datensatz);
  } catch (error) {
    console.error('[widerruf] Speichern fehlgeschlagen.', error);
    return {
      status: 'fehler',
      meldung:
        'Ihre Erklärung konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut'
        + (firmaEmail ? ` oder senden Sie Ihren Widerruf per E-Mail an ${firmaEmail}.` : ' oder senden Sie uns Ihren Widerruf per E-Mail oder Brief.'),
    };
  }

  if (zugeordnet && umgebung.vorgangVermerken) {
    try {
      await umgebung.vorgangVermerken(
        vorgang!.id,
        `Widerrufserklärung über die Website eingegangen am ${eingangszeitText(eingegangenAm)} (Widerruf #${gespeichert.id}). Bitte prüfen und bearbeiten.`,
      );
    } catch (error) {
      console.error('[widerruf] Vermerk am Vorgang fehlgeschlagen.', error);
    }
  }

  // Eingangsbestätigung — Fehler ändern das Ergebnis nicht.
  let bestaetigung: WiderrufBestaetigung;
  try {
    const antwort = await umgebung.bestaetigungSenden(datensatz);
    bestaetigung = {
      ergebnis: antwort.ergebnis,
      am: umgebung.jetzt().toISOString(),
      ...(antwort.anbieterId ? { anbieterId: antwort.anbieterId } : {}),
      ...(antwort.ergebnis === 'fehlgeschlagen' && antwort.fehler ? { fehler: antwort.fehler.slice(0, 500) } : {}),
    };
  } catch (error) {
    bestaetigung = {
      ergebnis: 'fehlgeschlagen',
      am: umgebung.jetzt().toISOString(),
      fehler: (error instanceof Error ? error.message : String(error)).slice(0, 500),
    };
  }
  try {
    await umgebung.bestaetigungVermerken(gespeichert.id, bestaetigung);
  } catch (error) {
    console.error('[widerruf] Bestätigung konnte nicht vermerkt werden.', error);
  }

  if (umgebung.betriebInformieren) {
    try {
      await umgebung.betriebInformieren(datensatz, gespeichert.id);
    } catch (error) {
      console.error('[widerruf] Meldung an den Betrieb fehlgeschlagen.', error);
    }
  }

  return {
    status: 'eingegangen',
    eingangAm: eingegangenAm,
    name,
    email,
    ...(vorgangsnummer ? { vorgangsnummer } : {}),
    mailGesendet: bestaetigung.ergebnis === 'gesendet',
  };
}
