/* ==========================================================================
   Versand einer Vorlage mit Protokolleintrag
   Gemeinsam für die Seite (src/lib/server/benachrichtigungen.ts) und die
   Hooks im Backend. Deshalb ohne 'server-only' und ohne '@/lib/data': Wer
   versendet, schreibt das Protokoll selbst an den Vorgang.
   ========================================================================== */

import { enthaeltPlatzhalter, istPlatzhalter } from '../platzhalter';
import { getSiteUrl } from '../site-url';
import type { CompanyProfile, MailKind, MailLogEntry, Settings } from '../types';
import { mailKonfiguration, serverUrl } from '../umgebung';
import type { MailInhalt } from './html';
import { mailUmgebung, sendeUeberResend, type TransportOptionen } from './transport-resend';
import { ohneSchraegstrich, type VorlagenKontext } from './vorlagen/gemeinsam';

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

/** Seite und Firmendaten für die Vorlagen. */
export function vorlagenKontext(settings?: Pick<Settings, 'company'>): VorlagenKontext {
  return { site: ohneSchraegstrich(getSiteUrl()), firma: settings?.company };
}

/** Link auf einen Eintrag im Backend (feste Backend-Adresse, sonst die Seite); Standard: Vorgänge. */
export function adminLink(id: string, sammlung: 'vorgaenge' | 'widerrufe' = 'vorgaenge'): string {
  const basis = ohneSchraegstrich(serverUrl() || getSiteUrl());
  return `${basis}/admin/collections/${sammlung}/${encodeURIComponent(id)}`;
}

/** Firmenadresse nur, wenn sie echt ist — nie ein Platzhalter. */
function firmenAdresse(firma: CompanyProfile | undefined): string | undefined {
  const email = firma?.email?.trim();
  if (!firma || firma.isPlaceholder || !email || istPlatzhalter(email) || enthaeltPlatzhalter(email)) return undefined;
  return EMAIL.test(email) ? email : undefined;
}

/** Antworten der Kunden: `MAIL_REPLY_TO`, sonst die echte Firmenadresse. */
export function antwortAdresse(firma: CompanyProfile | undefined): string | undefined {
  return mailKonfiguration()?.replyTo ?? firmenAdresse(firma);
}

/** Empfänger der Betriebsmails: `MAIL_TEAM_ADDRESS`, sonst die echte Firmenadresse. */
export function teamEmpfaenger(firma: CompanyProfile | undefined): string[] {
  const team = mailKonfiguration()?.teamAdressen ?? [];
  if (team.length) return team;
  const firmenadresse = firmenAdresse(firma);
  return firmenadresse ? [firmenadresse] : [];
}

/**
 * Idempotenz-Schlüssel `<umgebung>-<nummer>-<art>[-<zusatz>]`. Die Kennung
 * des Vorgangs taugt nicht: Lokal, in Vorschauen und in Produktion beginnen
 * die Kennungen gleich.
 */
export function idempotenzSchluessel(nummer: string, art: string, zusatz?: string): string {
  const teile = [mailUmgebung(), nummer, art, zusatz].filter(Boolean).join('-');
  return teile.replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, 256);
}

export interface VorlageSenden {
  art: MailKind;
  an: string | string[];
  inhalt: MailInhalt;
  antwortAn?: string;
  idempotenzSchluessel?: string;
  /** Nur für Tests (fetch, Konfiguration). */
  transport?: TransportOptionen;
}

/** Sendet eine Vorlage und liefert den Eintrag fürs Mailprotokoll. Wirft nie. */
export async function sendeVorlage(senden: VorlageSenden): Promise<MailLogEntry> {
  const an = (Array.isArray(senden.an) ? senden.an : [senden.an]).filter(Boolean);
  const eintrag: MailLogEntry = { kind: senden.art, to: an.join(', '), at: new Date().toISOString(), result: 'fehlgeschlagen' };
  try {
    const ergebnis = await sendeUeberResend(
      {
        an,
        betreff: senden.inhalt.betreff,
        html: senden.inhalt.html,
        text: senden.inhalt.text,
        antwortAn: senden.antwortAn,
        tags: { art: senden.art, umgebung: mailUmgebung() },
        idempotenzSchluessel: senden.idempotenzSchluessel,
      },
      senden.transport,
    );
    eintrag.at = new Date().toISOString();
    if (ergebnis.status === 'nicht-eingerichtet') eintrag.result = 'nicht-eingerichtet';
    else if (ergebnis.status === 'gesendet' || ergebnis.status === 'moeglicherweise-gesendet') eintrag.result = 'gesendet';
    if (ergebnis.id) eintrag.providerId = ergebnis.id;
    if (ergebnis.status === 'moeglicherweise-gesendet') eintrag.error = `Möglicherweise bereits gesendet (${ergebnis.fehler ?? '409'})`;
    else if (ergebnis.fehler) eintrag.error = ergebnis.fehler;
  } catch (error) {
    // sendeUeberResend wirft nicht — nur zur Sicherheit, etwa bei Vorlagenfehlern.
    console.error('[mail] Versand fehlgeschlagen', error instanceof Error ? error.name : 'Fehler');
    eintrag.error = 'Interner Fehler';
  }
  return eintrag;
}
