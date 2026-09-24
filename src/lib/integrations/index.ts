/* ==========================================================================
   Externe Anbindungen
   Zahlung und Mailversand sind vorbereitet, aber ohne Zugangsdaten inaktiv.
   Die Dateiablage nutzt die eigene Datenbank und braucht keinen Anbieter.
   Es werden keine Zugangsdaten erfunden oder fest hinterlegt.
   Der Status ist im Backend unter „Einstellungen“ sichtbar.
   ========================================================================== */

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

/** Welche der benötigten Umgebungsvariablen sind nicht gesetzt? */
function missing(keys: string[]): string[] {
  return keys.filter((key) => !process.env[key]);
}

/* ---------- Zahlung ------------------------------------------------------ */

export function paymentStatus(): IntegrationStatus {
  return {
    id: 'zahlung',
    label: 'Online-Zahlung',
    configured: Boolean(process.env.PAYMENT_PROVIDER && process.env.PAYMENT_API_KEY),
    requiredEnv: ['PAYMENT_PROVIDER', 'PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET'],
    missingEnv: missing(['PAYMENT_PROVIDER', 'PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET']),
    fallback:
      'Vorgänge werden mit dem Zahlungsstatus „offen“ angelegt. Die Zahlung wird außerhalb '
      + 'des Systems abgewickelt und im Backend manuell auf „bezahlt“ gesetzt.',
  };
}

export interface PaymentIntent {
  recordId: string;
  amountCents: number;
  scope: 'anzahlung' | 'gesamt';
  description: string;
  returnUrl: string;
}

export interface PaymentResult {
  status: 'offen' | 'bezahlt' | 'fehlgeschlagen';
  providerRef?: string;
  /** Wohin der Kunde zum Bezahlen geschickt wird, sobald angebunden. */
  redirectUrl?: string;
  message: string;
}

/**
 * Startet eine Zahlung.
 *
 * Ohne hinterlegten Anbieter wird der Vorgang als „offen“ angelegt. Die
 * Anbindung eines Anbieters erfolgt genau an dieser Stelle — der restliche
 * Ablauf bleibt unverändert.
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

  // Anbindung des gewählten Anbieters hier ergänzen.
  throw new Error(
    `Zahlungsanbieter "${process.env.PAYMENT_PROVIDER}" ist konfiguriert, aber noch nicht implementiert. `
      + `Bitte die Anbindung in src/lib/integrations/index.ts ergänzen. Vorgang: ${intent.recordId}`,
  );
}

/* ---------- Mailversand -------------------------------------------------- */

export function mailStatus(): IntegrationStatus {
  return {
    id: 'mailversand',
    label: 'E-Mail-Versand',
    configured: Boolean(process.env.MAIL_PROVIDER && process.env.MAIL_API_KEY),
    requiredEnv: ['MAIL_PROVIDER', 'MAIL_API_KEY', 'MAIL_FROM_ADDRESS'],
    missingEnv: missing(['MAIL_PROVIDER', 'MAIL_API_KEY', 'MAIL_FROM_ADDRESS']),
    fallback:
      'Bestätigungen werden nicht automatisch versendet. Der Vorgang ist im Backend sichtbar '
      + 'und wird von Hand bestätigt.',
  };
}

export interface MailMessage {
  to: string;
  subject: string;
  body: string;
  /** Interner Verweis auf den Vorgang. */
  recordId?: string;
}

export interface MailResult {
  sent: boolean;
  message: string;
}

/** Versendet eine Bestätigung. Ohne Anbindung passiert bewusst nichts. */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  if (!mailStatus().configured) {
    return {
      sent: false,
      message:
        'Kein Mailversand angebunden. Die Bestätigung an '
        + `${message.to} wurde nicht versendet und muss im Backend ausgelöst werden.`,
    };
  }

  // Anbindung des gewählten Anbieters hier ergänzen.
  throw new Error(
    `Mailanbieter "${process.env.MAIL_PROVIDER}" ist konfiguriert, aber noch nicht implementiert. `
      + 'Bitte die Anbindung in src/lib/integrations/index.ts ergänzen.',
  );
}

/* ---------- Dateiablage für Uploads -------------------------------------- */

/**
 * Kundendateien liegen in der privaten Payload-Sammlung `kundendateien`
 * (Datenbank plus Ordner `private-uploads/` auf dem Server). Die Ablage ist
 * verfügbar, sobald die Seite mit der Datenbank arbeitet und der Server
 * dauerhaft auf die Festplatte schreiben darf — auf Plattformen mit
 * schreibgeschütztem Dateisystem (Vercel, SM24_READONLY_CONTENT=1) nicht.
 * Hochgeladen wird über /api/kunden-upload, zugeordnet beim Absenden
 * (src/lib/server/kundendateien.ts).
 */
export function storageStatus(): IntegrationStatus {
  const readonly = Boolean(process.env.VERCEL) || process.env.SM24_READONLY_CONTENT === '1';
  const ohneDatenbank = process.env.SM24_DATA === 'json';
  return {
    id: 'dateiablage',
    label: 'Dateiablage für Uploads',
    configured: Boolean(process.env.DATABASE_URL) && !ohneDatenbank && !readonly,
    requiredEnv: ['DATABASE_URL'],
    missingEnv: missing(['DATABASE_URL']),
    fallback:
      'Ohne Datenbank-Ablage werden hochgeladene Dateien nicht gespeichert. Am Vorgang wird nur '
      + 'vermerkt, welche Dateien der Kunde ausgewählt hat; die Dateien werden separat angefordert.',
  };
}
