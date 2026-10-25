/* ==========================================================================
   Externe Anbindungen
   Zahlung (Stripe), Mailversand (Resend) und Dateiablage (S3-kompatibler
   Bucket). Ohne Zugangsdaten bleiben Zahlung und Mailversand inaktiv; die
   Dateiablage nutzt dann — wo erlaubt — die eigene Festplatte. Zugangsdaten
   stehen nur in Umgebungsvariablen (`src/lib/umgebung.ts`), nie im Code.
   Den Stand liefert `integrationStatuses()`; das Backend zeigt ihn unter
   Einstellungen → Anbindungen (mit „Testmail an mich“).
   ========================================================================== */

import { sendeUeberResend } from '@/lib/mail/transport-resend';
import type { AppointmentInfo, OrderLine, RecordKind } from '@/lib/types';
import {
  dateiablage,
  dateisystemSchreibbar,
  datenbankUrl,
  mailKonfiguration,
  mitDatenbank,
  zahlungKonfiguration,
} from '@/lib/umgebung';

export interface IntegrationStatus {
  id: 'zahlung' | 'mailversand' | 'dateiablage';
  label: string;
  configured: boolean;
  /** Welche Umgebungsvariablen gesetzt sein müssen. */
  requiredEnv: string[];
  /** Welche davon derzeit fehlen. */
  missingEnv: string[];
  /** Was ohne diese Anbindung passiert. */
  fallback: string;
}

export function integrationStatuses(): IntegrationStatus[] {
  return [paymentStatus(), mailStatus(), storageStatus()];
}

/** Pflichtwerte für die Anbieterwahl — ein anderer Wert zählt als fehlend. */
const ANBIETER: Record<string, string> = { PAYMENT_PROVIDER: 'stripe', MAIL_PROVIDER: 'resend' };

/** Welche der benötigten Umgebungsvariablen fehlen (oder passen nicht)? */
function missing(keys: string[]): string[] {
  return keys.filter((key) => {
    // Die Datenbank darf auch über POSTGRES_URL (Vercel-Integration) kommen.
    if (key === 'DATABASE_URL') return !datenbankUrl();
    const value = process.env[key]?.trim();
    if (!value) return true;
    return key in ANBIETER && value !== ANBIETER[key];
  });
}

/* ---------- Zahlung ------------------------------------------------------ */

/**
 * Online-Zahlung braucht Stripe und die Datenbank: Webhooks verbuchen die
 * Zahlung am gespeicherten Vorgang.
 */
export function paymentStatus(): IntegrationStatus {
  const requiredEnv = ['PAYMENT_PROVIDER', 'PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET', 'DATABASE_URL'];
  return {
    id: 'zahlung',
    label: 'Online-Zahlung',
    configured: zahlungKonfiguration() !== null && mitDatenbank(),
    requiredEnv,
    missingEnv: missing(requiredEnv),
    fallback:
      'Vorgänge werden mit dem Zahlungsstatus „offen“ angelegt. Die Zahlung wird außerhalb '
      + 'des Systems abgewickelt und im Backend manuell auf „bezahlt“ gesetzt.',
  };
}

export interface PaymentIntent {
  recordId: string;
  /** Vorgangsnummer, z. B. „SM24-T-2026-0001“. */
  reference: string;
  recordKind: RecordKind;
  amountCents: number;
  scope: 'anzahlung' | 'gesamt';
  /** Vom Server gebildet, nie aus dem Browser. */
  description: string;
  /** Link-Schlüssel für Rückkehr und Abbruch (`/bestellung/<id>?t=…`). */
  accessToken: string;
  customerEmail: string;
  /** Bestellung: festgeschriebene Positionen. Nur `label`, Menge und Preis gehen an den Anbieter. */
  lines?: OrderLine[];
  shipping?: { label: string; cents: number };
  /** Termin: für die Bezeichnung der Anzahlung. */
  appointment?: AppointmentInfo;
}

export interface PaymentResult {
  status: 'offen' | 'bezahlt' | 'fehlgeschlagen';
  providerRef?: string;
  /** Kennung der Checkout-Sitzung beim Anbieter. */
  checkoutSessionId?: string;
  /** Bis wann die Zahlung möglich ist (ISO-Zeitpunkt). */
  expiresAt?: string;
  /** Wohin der Kunde zum Bezahlen geschickt wird, sobald angebunden. */
  redirectUrl?: string;
  message: string;
  /** Hinweis fürs Team (interne Notiz), nie für den Kunden. */
  internalNote?: string;
}

/**
 * Startet eine Zahlung.
 *
 * Ohne hinterlegten Anbieter wird der Vorgang als „offen“ angelegt (ohne
 * `redirectUrl`). Mit Stripe entsteht eine Checkout-Sitzung; der Kunde wird
 * zu `redirectUrl` geschickt. Scheitert Stripe, wirft die Funktion — der
 * Aufrufer meldet das als Hinweis, der Vorgang bleibt gespeichert.
 */
export async function createPayment(intent: PaymentIntent): Promise<PaymentResult> {
  if (!paymentStatus().configured) {
    return {
      status: 'offen',
      message:
        'Es ist noch kein Zahlungsdienstleister angebunden. Ihr Vorgang wurde gespeichert; '
        + 'wir melden uns mit den Zahlungsinformationen.',
    };
  }
  // Erst bei Bedarf laden: Das Stripe-Paket braucht nur, wer bezahlt.
  const { starteCheckout } = await import('./stripe');
  return starteCheckout(intent);
}

/* ---------- Mailversand -------------------------------------------------- */

/**
 * Kundenmails gehen, sobald Resend vollständig eingetragen ist. Ohne
 * MAIL_TEAM_ADDRESS fehlt nur die Mail an den Betrieb — deshalb steht sie in
 * der Liste, entscheidet aber nicht über `configured`.
 */
export function mailStatus(): IntegrationStatus {
  const requiredEnv = ['MAIL_PROVIDER', 'MAIL_API_KEY', 'MAIL_FROM_ADDRESS', 'MAIL_TEAM_ADDRESS'];
  return {
    id: 'mailversand',
    label: 'E-Mail-Versand',
    configured: mailKonfiguration() !== null,
    requiredEnv,
    missingEnv: missing(requiredEnv),
    fallback:
      'Bestätigungen werden nicht automatisch versendet. Der Vorgang ist im Backend sichtbar '
      + 'und wird von Hand bestätigt.',
  };
}

export interface MailMessage {
  to: string | string[];
  subject: string;
  /** Reiner Text — Rückfall, wenn `text` fehlt. */
  body: string;
  /** Interner Verweis auf den Vorgang. */
  recordId?: string;
  html?: string;
  text?: string;
  replyTo?: string;
  /** Schlagworte für die Auswertung beim Anbieter. */
  tags?: Record<string, string>;
  /** Schützt vor doppeltem Versand (`<umgebung>-<nummer>-<art>`). */
  idempotencyKey?: string;
}

export interface MailResult {
  sent: boolean;
  message: string;
  /** Kennung beim Mailanbieter. */
  providerId?: string;
}

/**
 * Versendet eine Mail über Resend. Ohne Anbindung passiert bewusst nichts.
 * Wirft nie — ein Mailfehler bricht keinen Ablauf ab.
 */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  if (!mailStatus().configured) {
    return {
      sent: false,
      message: 'Kein Mailversand angebunden. Die Mail wurde nicht versendet und muss im Backend ausgelöst werden.',
    };
  }
  const ergebnis = await sendeUeberResend({
    an: message.to,
    betreff: message.subject,
    text: message.text ?? message.body,
    html: message.html,
    antwortAn: message.replyTo,
    tags: message.tags,
    idempotenzSchluessel: message.idempotencyKey,
  });
  const sent = ergebnis.status === 'gesendet' || ergebnis.status === 'moeglicherweise-gesendet';
  return {
    sent,
    message: sent ? 'Mail versendet.' : `Mail nicht versendet (${ergebnis.fehler ?? ergebnis.status}).`,
    ...(ergebnis.id ? { providerId: ergebnis.id } : {}),
  };
}

/* ---------- Dateiablage für Uploads -------------------------------------- */

/**
 * Kundendateien liegen in der privaten Payload-Sammlung `kundendateien`.
 * Die Dateien selbst liegen in einem privaten S3-Bucket (STORAGE_*) oder —
 * wo der Server dauerhaft auf die Festplatte schreiben darf — im Ordner
 * `private-uploads/`. Auf Vercel (oder mit SM24_READONLY_CONTENT=1) geht es
 * nur mit Bucket. Ohne Datenbank gibt es keine Ablage.
 * Hochgeladen wird über /api/kunden-upload, zugeordnet beim Absenden
 * (src/lib/server/kundendateien.ts).
 */
export function storageStatus(): IntegrationStatus {
  const requiredEnv = dateisystemSchreibbar()
    ? ['DATABASE_URL']
    : ['DATABASE_URL', 'STORAGE_BUCKET', 'STORAGE_ACCESS_KEY', 'STORAGE_SECRET_KEY'];
  return {
    id: 'dateiablage',
    label: 'Dateiablage für Uploads',
    configured: mitDatenbank() && (dateiablage() !== null || dateisystemSchreibbar()),
    requiredEnv,
    missingEnv: missing(requiredEnv),
    fallback:
      'Ohne Datenbank-Ablage werden hochgeladene Dateien nicht gespeichert. Am Vorgang wird nur '
      + 'vermerkt, welche Dateien der Kunde ausgewählt hat; die Dateien werden separat angefordert.',
  };
}
