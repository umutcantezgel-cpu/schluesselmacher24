import 'server-only';

import { after } from 'next/server';

import { getSettings, vorgangAendern } from '@/lib/data';
import { MAIL_NICHT_EINGERICHTET, MAIL_NICHT_VERSENDET } from '@/lib/mail/hinweise';
import {
  adminLink,
  antwortAdresse,
  idempotenzSchluessel,
  sendeVorlage,
  teamEmpfaenger,
  vorlagenKontext,
} from '@/lib/mail/versand';
import {
  betriebBezahlt,
  betriebNeuerVorgang,
  kundeBezahlt,
  kundeEingang,
  kundeErstattet,
  kundeNichtAbgeschlossen,
  statusMail,
  widerrufEingang,
  type StatusMitMail,
} from '@/lib/mail/vorlagen';
import type { BusinessRecord, MailLogEntry, Settings } from '@/lib/types';
import { mailKonfiguration } from '@/lib/umgebung';
import type { ZahlungsMail } from '@/lib/zahlung/uebergaenge';

/* ==========================================================================
   Benachrichtigungen
   Wann welche Mail an Kunde und Betrieb geht — und dass jede Mail im
   Protokoll des Vorgangs landet. Das Protokoll wird immer über
   `vorgangAendern` geschrieben (frisch gelesen, gesperrt), nie aus einem
   älteren Stand des Vorgangs abgeleitet.
   Mailfehler werden nie geworfen: Der Vorgang, die Zahlung oder der Webhook
   sind wichtiger als die Mail.
   ========================================================================== */

/**
 * Arbeit nach der Antwort an den Browser (Vercel hält die Funktion dafür
 * offen). Außerhalb einer Anfrage — Tests, Skripte — läuft sie sofort und
 * wird abgewartet.
 */
export async function nachDerAntwort(arbeit: () => Promise<unknown>): Promise<void> {
  const sicher = async () => {
    try {
      await arbeit();
    } catch (error) {
      console.error('[benachrichtigung] Nacharbeit fehlgeschlagen', error);
    }
  };
  try {
    after(sicher);
  } catch {
    await sicher();
  }
}

/** Hängt Einträge ans Mailprotokoll (und optional einen Kundentext an den Verlauf). */
async function protokollieren(id: string, eintraege: MailLogEntry[], verlauf?: string): Promise<void> {
  if (eintraege.length === 0) return;
  try {
    await vorgangAendern(id, (v) => ({
      mailLog: [...(v.mailLog ?? []), ...eintraege],
      ...(verlauf ? { timeline: [...v.timeline, { at: new Date().toISOString(), actor: 'system' as const, message: verlauf }] } : {}),
    }));
  } catch (error) {
    console.error('[benachrichtigung] Mailprotokoll nicht gespeichert', error);
  }
}

/* ---------- Neuer Vorgang ----------------------------------------------- */

export interface NeuerVorgangMail {
  /** Stand nach dem Start der Zahlung (mit Ablaufzeit der Reservierung). */
  saved: BusinessRecord;
  /** Link-Schlüssel für die private Vorgangsseite. */
  token: string;
  settings: Settings;
}

/**
 * Eingangsbestätigung an den Kunden und Benachrichtigung an den Betrieb —
 * parallel. Auf die Kundenmail wird gewartet (höchstens 8 s), damit ein
 * Fehler als Hinweis erscheint; die Betriebsmail läuft nach der Antwort zu
 * Ende. Liefert die Hinweise für den Kunden.
 */
export async function benachrichtigeNeuerVorgang({ saved, token, settings }: NeuerVorgangMail): Promise<string[]> {
  if (!mailKonfiguration()) return [MAIL_NICHT_EINGERICHTET];

  const kontext = vorlagenKontext(settings);
  const kunde = sendeVorlage({
    art: 'eingang-kunde',
    an: saved.contact.email,
    inhalt: kundeEingang({ vorgang: saved, token, onlineZahlung: Boolean(saved.payment?.checkoutSessionId), kontext }),
    antwortAn: antwortAdresse(settings.company),
    idempotenzSchluessel: idempotenzSchluessel(saved.reference, 'eingang-kunde'),
  });

  const teamAn = teamEmpfaenger(settings.company);
  const team = teamAn.length
    ? sendeVorlage({
        art: 'eingang-team',
        an: teamAn,
        inhalt: betriebNeuerVorgang({ vorgang: saved, adminUrl: adminLink(saved.id), kontext }),
        idempotenzSchluessel: idempotenzSchluessel(saved.reference, 'eingang-team'),
      })
    : null;
  if (!team) console.warn('[benachrichtigung] Keine Adresse für Betriebsmails (MAIL_TEAM_ADDRESS fehlt).');

  const [kundeErgebnis] = await Promise.allSettled([kunde]);
  const eintrag = kundeErgebnis.status === 'fulfilled' ? kundeErgebnis.value : null;
  await protokollieren(
    saved.id,
    eintrag ? [eintrag] : [],
    eintrag?.result === 'gesendet' ? 'Eingangsbestätigung per E-Mail versendet.' : undefined,
  );

  if (team) {
    await nachDerAntwort(async () => {
      const [teamErgebnis] = await Promise.allSettled([team]);
      if (teamErgebnis.status === 'fulfilled') await protokollieren(saved.id, [teamErgebnis.value]);
    });
  }

  if (eintrag?.result === 'gesendet') return [];
  return [eintrag?.result === 'nicht-eingerichtet' ? MAIL_NICHT_EINGERICHTET : MAIL_NICHT_VERSENDET];
}

/* ---------- Zahlung ------------------------------------------------------ */

/**
 * Mail nach einer verbuchten Zahlung: „bezahlt“ an Kunde und Betrieb,
 * „nicht abgeschlossen“ und „erstattet“ an den Kunden.
 */
export async function benachrichtigeZahlung({
  vorgang,
  mail,
  ereignisId,
}: {
  vorgang: BusinessRecord;
  mail: ZahlungsMail;
  ereignisId: string;
}): Promise<void> {
  if (!mailKonfiguration()) return;
  try {
    const settings = await getSettings();
    const kontext = vorlagenKontext(settings);
    const antwortAn = antwortAdresse(settings.company);
    const kunde = vorgang.contact.email;
    const sendungen: Array<Promise<MailLogEntry>> = [];

    switch (mail.art) {
      case 'bezahlt': {
        sendungen.push(
          sendeVorlage({
            art: 'zahlung-erhalten',
            an: kunde,
            inhalt: kundeBezahlt({ vorgang, kontext }),
            antwortAn,
            idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'zahlung-erhalten'),
          }),
        );
        const teamAn = teamEmpfaenger(settings.company);
        if (teamAn.length) {
          sendungen.push(
            sendeVorlage({
              art: 'zahlung-erhalten',
              an: teamAn,
              inhalt: betriebBezahlt({ vorgang, kontext, adminUrl: adminLink(vorgang.id) }),
              idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'zahlung-erhalten-team'),
            }),
          );
        }
        break;
      }
      case 'nicht-abgeschlossen':
        sendungen.push(
          sendeVorlage({
            art: 'zahlung-nicht-abgeschlossen',
            an: kunde,
            inhalt: kundeNichtAbgeschlossen({ vorgang, kontext, terminFreigegeben: mail.terminFreigegeben }),
            antwortAn,
            idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'zahlung-nicht-abgeschlossen', ereignisId),
          }),
        );
        break;
      case 'erstattet':
        sendungen.push(
          sendeVorlage({
            art: 'erstattung',
            an: kunde,
            inhalt: kundeErstattet({ vorgang, kontext, betragCent: mail.betragCent }),
            antwortAn,
            idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'erstattung', ereignisId),
          }),
        );
        break;
    }

    const ergebnisse = await Promise.allSettled(sendungen);
    await protokollieren(
      vorgang.id,
      ergebnisse.flatMap((e) => (e.status === 'fulfilled' ? [e.value] : [])),
    );
  } catch (error) {
    console.error('[benachrichtigung] Zahlungsmail nicht versendet', error);
  }
}

/* ---------- Status ------------------------------------------------------- */

/**
 * Statusmail an den Kunden, ausgelöst von der Seite. Änderungen im Backend
 * versendet der Hook der Sammlung Vorgänge selbst (gleiche Vorlage).
 */
export async function benachrichtigeStatus({
  vorgang,
  status,
  nachricht,
}: {
  vorgang: BusinessRecord;
  status: StatusMitMail;
  nachricht?: string;
}): Promise<MailLogEntry | null> {
  if (!mailKonfiguration()) return null;
  try {
    const settings = await getSettings();
    const eintrag = await sendeVorlage({
      art: 'status',
      an: vorgang.contact.email,
      inhalt: statusMail({ vorgang, status, nachricht, kontext: vorlagenKontext(settings) }),
      antwortAn: antwortAdresse(settings.company),
      idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, `status-${status}`, String(Date.now())),
    });
    await protokollieren(vorgang.id, [eintrag]);
    return eintrag;
  } catch (error) {
    console.error('[benachrichtigung] Statusmail nicht versendet', error);
    return null;
  }
}

/* ---------- Widerruf ----------------------------------------------------- */

export interface WiderrufEingangMail {
  an: string;
  vorname?: string;
  nachname?: string;
  vorgangsnummer?: string;
  /** ISO-Zeitpunkt des Eingangs. */
  eingegangenAm: string;
  settings?: Settings;
}

/**
 * Bestätigt den Eingang einer Widerrufserklärung. Liefert das Ergebnis für
 * die Ablage (Sammlung `widerrufe`, Gruppe `bestaetigung`); ein Protokoll am
 * Vorgang schreibt der Aufrufer, wenn die Erklärung zugeordnet ist.
 */
export async function sendeWiderrufEingang(daten: WiderrufEingangMail): Promise<MailLogEntry> {
  const settings = daten.settings ?? (await getSettings().catch(() => undefined));
  return sendeVorlage({
    art: 'widerruf',
    an: daten.an,
    inhalt: widerrufEingang({
      vorname: daten.vorname,
      nachname: daten.nachname,
      vorgangsnummer: daten.vorgangsnummer,
      eingegangenAm: daten.eingegangenAm,
      kontext: vorlagenKontext(settings),
    }),
    antwortAn: antwortAdresse(settings?.company),
    idempotenzSchluessel: idempotenzSchluessel(
      daten.vorgangsnummer?.trim().toUpperCase() || 'ohne-nummer',
      'widerruf',
      String(Date.parse(daten.eingegangenAm) || Date.now()),
    ),
  });
}
