/* ==========================================================================
   Mailversand über Resend (REST, ohne SDK)
   Bewusst ohne 'server-only' und nur mit relativen Importen: Die Hooks im
   Backend (Payload) laden dieses Modul ebenfalls.
   Die Funktion wirft nie — ein Mailfehler darf keinen Vorgang, keine Zahlung
   und keine Statusänderung scheitern lassen. Mailinhalte werden nie geloggt.
   ========================================================================== */

import { istProduktion, mailKonfiguration, type MailKonfiguration } from '../umgebung';

const RESEND_URL = 'https://api.resend.com/emails';

/** Gesamtzeit für einen Versand einschließlich einer Wiederholung. */
const BUDGET_MS = 8000;
/** Wartezeit vor der Wiederholung bei 429/5xx. */
const WARTEN_MS = 1000;

/** Anhang als Text, z. B. ein Kalendereintrag (.ics). */
export interface MailAnhang {
  /** Dateiname, nur Buchstaben, Ziffern, Punkt, Binde- und Unterstrich. */
  dateiname: string;
  /** Inhalt als Text (UTF-8); Resend erhält ihn Base64-kodiert. */
  inhalt: string;
  /** MIME-Typ, z. B. „text/calendar; charset=utf-8; method=PUBLISH“. Ohne Angabe leitet Resend ihn aus dem Namen ab. */
  typ?: string;
}

export interface AusgehendeMail {
  an: string | string[];
  betreff: string;
  text: string;
  html?: string;
  /** Antwortadresse (`reply_to`). */
  antwortAn?: string | string[];
  /** Schlagworte für die Auswertung bei Resend (nur a–z, 0–9, _ und -). */
  tags?: Record<string, string>;
  /**
   * Schützt vor doppeltem Versand bei Wiederholungen (24 h bei Resend).
   * Aufbau: `<umgebung>-<nummer>-<art>`; beim erneuten Senden von Hand mit
   * Zeitstempel, sonst verwirft Resend die zweite Mail.
   */
  idempotenzSchluessel?: string;
  /** Anhänge — klein halten (Resend: höchstens 40 MB je Mail nach Kodierung). */
  anhaenge?: MailAnhang[];
}

export type Versandstatus = 'gesendet' | 'moeglicherweise-gesendet' | 'fehlgeschlagen' | 'nicht-eingerichtet';

export interface Versandergebnis {
  status: Versandstatus;
  /** Kennung der Mail bei Resend. */
  id?: string;
  /** Kurzer, technischer Grund — ohne Mailinhalt. */
  fehler?: string;
}

export interface TransportOptionen {
  konfiguration?: MailKonfiguration | null;
  fetchImpl?: typeof fetch;
  budgetMs?: number;
  wartenMs?: number;
}

/** Umgebung für Idempotenz-Schlüssel: Vorschau, Produktion und lokal getrennt. */
export function mailUmgebung(): string {
  return process.env.VERCEL_ENV?.trim() || 'lokal';
}

/** Zeilenumbrüche im Betreff ermöglichen eingeschleuste Kopfzeilen — entfernen. */
export function saubererBetreff(betreff: string): string {
  return betreff.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 200);
}

/** „Name <adresse>“ ohne Zeichen, die die Angabe aufbrechen könnten. */
function absender(konfiguration: MailKonfiguration): string {
  const name = konfiguration.fromName.replace(/[\r\n<>"]/g, '').trim();
  return name ? `${name} <${konfiguration.fromAddress}>` : konfiguration.fromAddress;
}

function liste(wert: string | string[] | undefined): string[] {
  return (Array.isArray(wert) ? wert : wert ? [wert] : []).map((a) => a.trim()).filter(Boolean);
}

/** Resend erlaubt in Schlagworten nur ASCII-Buchstaben, Ziffern, _ und -. */
function tagsFuerResend(tags: Record<string, string> | undefined) {
  if (!tags) return undefined;
  const sauber = (wert: string) => wert.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 256);
  return Object.entries(tags).map(([name, value]) => ({ name: sauber(name), value: sauber(value) }));
}

/** Dateiname ohne Pfad und Steuerzeichen. */
function sichererDateiname(name: string): string {
  const sauber = name.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '').slice(0, 120);
  return sauber || 'anhang';
}

/** Anhänge im Format der Resend-API (`content` Base64). */
function anhaengeFuerResend(anhaenge: MailAnhang[] | undefined) {
  if (!anhaenge?.length) return undefined;
  return anhaenge.map((anhang) => ({
    filename: sichererDateiname(anhang.dateiname),
    content: Buffer.from(anhang.inhalt, 'utf8').toString('base64'),
    ...(anhang.typ ? { content_type: anhang.typ.replace(/[\r\n]/g, '') } : {}),
  }));
}

const schlafen = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Antwort {
  status: number;
  koerper: { id?: unknown; name?: unknown } | null;
}

async function senden(
  fetchImpl: typeof fetch,
  apiKey: string,
  body: string,
  idempotenz: string | undefined,
  restMs: number,
): Promise<Antwort> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (idempotenz) headers['Idempotency-Key'] = idempotenz.slice(0, 256);
  const response = await fetchImpl(RESEND_URL, {
    method: 'POST',
    headers,
    body,
    signal: AbortSignal.timeout(Math.max(restMs, 1)),
  });
  const koerper = (await response.json().catch(() => null)) as Antwort['koerper'];
  return { status: response.status, koerper };
}

/** Darf ein 429 wiederholt werden? Nicht, wenn das Tages- oder Monatskontingent erschöpft ist. */
function wiederholbar(antwort: Antwort): boolean {
  if (antwort.status >= 500) return true;
  if (antwort.status !== 429) return false;
  const name = typeof antwort.koerper?.name === 'string' ? antwort.koerper.name : '';
  return !/quota/i.test(name);
}

function fehlerText(antwort: Antwort): string {
  const name = typeof antwort.koerper?.name === 'string' ? antwort.koerper.name : '';
  return `HTTP ${antwort.status}${name ? ` (${name.slice(0, 60)})` : ''}`;
}

/**
 * Sendet eine Mail über Resend.
 *
 * Außerhalb der Produktion leitet `MAIL_REDIRECT_TO` alle Mails an eine
 * Testadresse um — Vorschauen erreichen so nie echte Kundinnen und Kunden.
 * 409 heißt bei Resend „derselbe Schlüssel ist schon unterwegs oder mit
 * anderem Inhalt verwendet“ — die Mail ist dann möglicherweise schon raus.
 */
export async function sendeUeberResend(mail: AusgehendeMail, optionen: TransportOptionen = {}): Promise<Versandergebnis> {
  const konfiguration = optionen.konfiguration === undefined ? mailKonfiguration() : optionen.konfiguration;
  if (!konfiguration) return { status: 'nicht-eingerichtet' };

  const fetchImpl = optionen.fetchImpl ?? fetch;
  const budgetMs = optionen.budgetMs ?? BUDGET_MS;
  const wartenMs = optionen.wartenMs ?? WARTEN_MS;
  const ende = Date.now() + budgetMs;

  let empfaenger = liste(mail.an);
  if (empfaenger.length === 0) return { status: 'fehlgeschlagen', fehler: 'Kein Empfänger' };

  let betreff = saubererBetreff(mail.betreff);
  const umleitung = !istProduktion() ? konfiguration.redirectTo : undefined;
  if (umleitung) {
    betreff = saubererBetreff(`[Umgeleitet, an: ${empfaenger.join(', ')}] ${betreff}`);
    empfaenger = [umleitung];
  }

  const antwortAn = liste(mail.antwortAn ?? konfiguration.replyTo);
  const anhaenge = anhaengeFuerResend(mail.anhaenge);
  const body = JSON.stringify({
    from: absender(konfiguration),
    to: empfaenger,
    subject: betreff,
    text: mail.text,
    ...(mail.html ? { html: mail.html } : {}),
    ...(antwortAn.length ? { reply_to: antwortAn } : {}),
    ...(mail.tags ? { tags: tagsFuerResend(mail.tags) } : {}),
    ...(anhaenge ? { attachments: anhaenge } : {}),
  });

  for (let versuch = 1; versuch <= 2; versuch += 1) {
    const restMs = ende - Date.now();
    if (restMs <= 0) return { status: 'fehlgeschlagen', fehler: 'Zeitlimit erreicht' };
    let antwort: Antwort;
    try {
      antwort = await senden(fetchImpl, konfiguration.apiKey, body, mail.idempotenzSchluessel, restMs);
    } catch (error) {
      const zeit = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
      // Bei Zeitüberschreitung kann die Mail angekommen sein — keine Wiederholung.
      return { status: 'fehlgeschlagen', fehler: zeit ? 'Zeitlimit erreicht' : 'Netzwerkfehler' };
    }

    if (antwort.status >= 200 && antwort.status < 300) {
      const id = typeof antwort.koerper?.id === 'string' ? antwort.koerper.id : undefined;
      return id ? { status: 'gesendet', id } : { status: 'gesendet' };
    }
    if (antwort.status === 409) {
      return { status: 'moeglicherweise-gesendet', fehler: fehlerText(antwort) };
    }
    // Nur wiederholen, wenn danach noch Zeit für eine Antwort bleibt.
    if (versuch === 1 && wiederholbar(antwort) && ende - Date.now() > wartenMs + 500) {
      await schlafen(wartenMs);
      continue;
    }
    console.warn(`[mail] Versand abgelehnt: ${fehlerText(antwort)}`);
    return { status: 'fehlgeschlagen', fehler: fehlerText(antwort) };
  }
  return { status: 'fehlgeschlagen', fehler: 'Zeitlimit erreicht' };
}
