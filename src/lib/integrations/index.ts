/* ==========================================================================
   Externe Anbindungen
   Alle drei Anbindungen sind vorbereitet, aber ohne Zugangsdaten inaktiv.
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

export function storageStatus(): IntegrationStatus {
  return {
    id: 'dateiablage',
    label: 'Dateiablage für Uploads',
    configured: Boolean(process.env.STORAGE_PROVIDER && process.env.STORAGE_BUCKET),
    requiredEnv: ['STORAGE_PROVIDER', 'STORAGE_BUCKET', 'STORAGE_ACCESS_KEY', 'STORAGE_SECRET_KEY'],
    missingEnv: missing(['STORAGE_PROVIDER', 'STORAGE_BUCKET', 'STORAGE_ACCESS_KEY', 'STORAGE_SECRET_KEY']),
    fallback:
      'Hochgeladene Dateien werden nicht dauerhaft gespeichert. Am Vorgang wird nur vermerkt, '
      + 'welche Dateien der Kunde ausgewählt hat; die Dateien werden separat angefordert.',
  };
}

export interface StoredFile {
  storageKey?: string;
  stored: boolean;
  message: string;
}

/** Legt eine hochgeladene Datei ab. Ohne Anbindung nur vermerkt. */
export async function storeUpload(
  fileName: string,
  _data: ArrayBuffer,
  category: string,
): Promise<StoredFile> {
  if (!storageStatus().configured) {
    return {
      stored: false,
      message:
        `Keine Dateiablage angebunden. "${fileName}" (${category}) wurde am Vorgang vermerkt, `
        + 'aber nicht gespeichert.',
    };
  }

  // Anbindung des gewählten Anbieters hier ergänzen.
  throw new Error(
    `Dateiablage "${process.env.STORAGE_PROVIDER}" ist konfiguriert, aber noch nicht implementiert. `
      + 'Bitte die Anbindung in src/lib/integrations/index.ts ergänzen.',
  );
}
