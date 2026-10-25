/* ==========================================================================
   Mailgerüst
   Jede Mail entsteht aus denselben Bausteinen als HTML und als reiner Text.
   HTML: Tabellen mit Inline-Stilen, 600 px breit, helles Papier, Linien in
   Stahlblau, Wortmarke als Text — keine externen Bilder, kein Tracking.
   Ohne 'server-only' und nur mit relativen Importen (Backend-Hooks).
   ========================================================================== */

import { enthaeltPlatzhalter, istPlatzhalter } from '../platzhalter';
import { standort } from '../rechtliches/firma';
import type { CompanyProfile } from '../types';

export interface MailInhalt {
  betreff: string;
  html: string;
  text: string;
}

export type Baustein =
  | { art: 'absatz'; text: string }
  | { art: 'ueberschrift'; text: string }
  /** Vorgangsnummer groß in Monoschrift. */
  | { art: 'nummer'; label: string; nummer: string }
  /** Angaben als zweispaltige Tabelle. */
  | { art: 'felder'; zeilen: Array<[string, string]> }
  | { art: 'knopf'; href: string; label: string }
  | { art: 'hinweis'; titel?: string; text: string }
  /** Nachricht des Teams, abgesetzt dargestellt. */
  | { art: 'nachricht'; titel: string; text: string };

export interface Mailgeruest {
  betreff: string;
  /** Vorschauzeile im Postfach (nicht sichtbar im Text). */
  vorschau?: string;
  anrede: string;
  bausteine: Baustein[];
  /** Für den Fuß: nur mit echten Firmendaten. */
  firma?: CompanyProfile;
  /** Absolute Adresse der Seite (ohne Schrägstrich am Ende). */
  site: string;
}

const FARBE = {
  papier: '#F7F9FC',
  flaeche: '#FFFFFF',
  linie: '#1d5fd1',
  haarlinie: '#D9E0EA',
  text: '#192133',
  leise: '#5B6578',
  hinweis: '#EEF3FC',
};

const SCHRIFT = "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace";

const ERSATZ: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Text für HTML unschädlich machen — für jeden Wert, der in eine Mail kommt. */
export function escapeHtml(wert: string): string {
  return wert.replace(/[&<>"']/g, (zeichen) => ERSATZ[zeichen]);
}

/** Zeilenumbrüche bleiben sichtbar. */
function mehrzeilig(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, '<br>');
}

/** Nur http(s)-Links in Knöpfen. */
function sichereUrl(href: string): string {
  return /^https?:\/\//i.test(href) ? escapeHtml(href) : '#';
}

/* ---------- Anrede ------------------------------------------------------- */

/**
 * Nur Buchstaben (auch Umlaute und Akzente), Leerzeichen, Bindestrich und
 * Apostroph. Ziffern, Punkte und Adressen fallen heraus: Der Name kommt aus
 * dem Formular und ginge sonst als beliebiger Text an eine frei wählbare
 * Adresse — unsere Domain würde zum Werbe- oder Phishing-Verteiler.
 */
const NAME = /^\p{L}[\p{L}\p{M} '’-]*$/u;

export function sichererName(vorname: string | undefined, nachname: string | undefined): string | null {
  const name = [vorname, nachname]
    .map((teil) => (teil ?? '').trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join(' ');
  if (!name || name.length > 60 || name.includes('://')) return null;
  return NAME.test(name) ? name : null;
}

/** „Guten Tag Erika Muster,“ — oder neutral „Guten Tag,“. */
export function anrede(kontakt: { firstName?: string; lastName?: string } | undefined): string {
  const name = kontakt ? sichererName(kontakt.firstName, kontakt.lastName) : null;
  return name ? `Guten Tag ${name},` : 'Guten Tag,';
}

/* ---------- Fuß ---------------------------------------------------------- */

/**
 * Firmendaten nur, wenn sie echt sind — nie mit „[Platzhalter …]“. Nach dem
 * Firmensitz die Werkstatt, falls sie woanders liegt (Erg. Leitfaden §1:
 * Kundinnen und Kunden kommen zur Werkstatt).
 */
function firmenzeilen(firma: CompanyProfile | undefined): string[] {
  if (!firma || firma.isPlaceholder) return [];
  const werkstatt = standort(firma);
  const zeilen = [
    firma.legalName,
    firma.street,
    [firma.postalCode, firma.city].filter(Boolean).join(' '),
    werkstatt ? `${werkstatt.label}: ${werkstatt.street}, ${werkstatt.postalCode} ${werkstatt.city}` : '',
    firma.phone ? `Telefon ${firma.phone}` : '',
    firma.email ? `E-Mail ${firma.email}` : '',
    firma.vatId ? `USt-IdNr. ${firma.vatId}` : '',
  ].filter((zeile) => zeile && !istPlatzhalter(zeile) && !enthaeltPlatzhalter(zeile));
  return zeilen;
}

/* ---------- HTML --------------------------------------------------------- */

function bausteinHtml(baustein: Baustein): string {
  switch (baustein.art) {
    case 'absatz':
      return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${FARBE.text};">${mehrzeilig(baustein.text)}</p>`;
    case 'ueberschrift':
      return `<h2 style="margin:24px 0 12px;font-size:17px;line-height:1.35;font-weight:700;color:${FARBE.text};">${escapeHtml(baustein.text)}</h2>`;
    case 'nummer':
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-top:2px solid ${FARBE.linie};border-bottom:1px solid ${FARBE.haarlinie};">`
        + `<tr><td style="padding:12px 0;">`
        + `<div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${FARBE.leise};">${escapeHtml(baustein.label)}</div>`
        + `<div style="margin-top:4px;font-family:${MONO};font-size:22px;font-weight:700;color:${FARBE.text};">${escapeHtml(baustein.nummer)}</div>`
        + `</td></tr></table>`
      );
    case 'felder':
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-top:1px solid ${FARBE.haarlinie};">`
        + baustein.zeilen
          .map(
            ([label, wert]) =>
              `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid ${FARBE.haarlinie};font-size:14px;color:${FARBE.leise};vertical-align:top;width:40%;">${escapeHtml(label)}</td>`
              + `<td style="padding:8px 0;border-bottom:1px solid ${FARBE.haarlinie};font-size:14px;color:${FARBE.text};vertical-align:top;">${mehrzeilig(wert)}</td></tr>`,
          )
          .join('')
        + `</table>`
      );
    case 'knopf':
      return (
        `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 24px;"><tr>`
        + `<td style="background:${FARBE.linie};border-radius:6px;">`
        + `<a href="${sichereUrl(baustein.href)}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;">${escapeHtml(baustein.label)}</a>`
        + `</td></tr></table>`
      );
    case 'hinweis':
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr>`
        + `<td style="padding:12px 14px;background:${FARBE.hinweis};border-left:3px solid ${FARBE.linie};font-size:14px;line-height:1.55;color:${FARBE.text};">`
        + (baustein.titel ? `<strong>${escapeHtml(baustein.titel)}</strong><br>` : '')
        + `${mehrzeilig(baustein.text)}</td></tr></table>`
      );
    case 'nachricht':
      return (
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr>`
        + `<td style="padding:12px 14px;border:1px solid ${FARBE.haarlinie};font-size:14px;line-height:1.55;color:${FARBE.text};">`
        + `<div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${FARBE.leise};margin-bottom:6px;">${escapeHtml(baustein.titel)}</div>`
        + `${mehrzeilig(baustein.text)}</td></tr></table>`
      );
  }
}

function fussHtml(geruest: Mailgeruest): string {
  const zeilen = firmenzeilen(geruest.firma);
  const links = [
    `<a href="${sichereUrl(`${geruest.site}/rechtliches/impressum`)}" style="color:${FARBE.leise};">Impressum</a>`,
    `<a href="${sichereUrl(`${geruest.site}/rechtliches/datenschutz`)}" style="color:${FARBE.leise};">Datenschutz</a>`,
  ].join(' · ');
  return (
    `<tr><td style="padding:20px 32px 28px;border-top:1px solid ${FARBE.haarlinie};font-size:12px;line-height:1.6;color:${FARBE.leise};">`
    + (zeilen.length ? `${zeilen.map(escapeHtml).join('<br>')}<br><br>` : '')
    + links
    + `</td></tr>`
  );
}

function html(geruest: Mailgeruest): string {
  const vorschau = geruest.vorschau
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(geruest.vorschau)}</div>`
    : '';
  return (
    `<!doctype html><html lang="de"><head><meta charset="utf-8">`
    + `<meta name="viewport" content="width=device-width, initial-scale=1">`
    + `<title>${escapeHtml(geruest.betreff)}</title></head>`
    + `<body style="margin:0;padding:0;background:${FARBE.papier};">`
    + vorschau
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${FARBE.papier};"><tr><td align="center" style="padding:24px 12px;">`
    + `<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${FARBE.flaeche};border-top:4px solid ${FARBE.linie};font-family:${SCHRIFT};color:${FARBE.text};">`
    + `<tr><td style="padding:24px 32px 8px;font-size:18px;font-weight:700;letter-spacing:0.02em;color:${FARBE.text};">SCHLÜSSELMACHER<span style="color:${FARBE.linie};">24</span></td></tr>`
    + `<tr><td style="padding:16px 32px 8px;">`
    + `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${FARBE.text};">${escapeHtml(geruest.anrede)}</p>`
    + geruest.bausteine.map(bausteinHtml).join('')
    + `<p style="margin:8px 0 16px;font-size:15px;line-height:1.6;color:${FARBE.text};">Viele Grüße<br>Ihr Team von SCHLÜSSELMACHER24</p>`
    + `</td></tr>`
    + fussHtml(geruest)
    + `</table></td></tr></table></body></html>`
  );
}

/* ---------- Text --------------------------------------------------------- */

function bausteinText(baustein: Baustein): string {
  switch (baustein.art) {
    case 'absatz':
      return baustein.text;
    case 'ueberschrift':
      return `${baustein.text}\n${'-'.repeat(Math.min(baustein.text.length, 60))}`;
    case 'nummer':
      return `${baustein.label}: ${baustein.nummer}`;
    case 'felder':
      return baustein.zeilen.map(([label, wert]) => `${label}: ${wert}`).join('\n');
    case 'knopf':
      return `${baustein.label}:\n${baustein.href}`;
    case 'hinweis':
      return baustein.titel ? `${baustein.titel}\n${baustein.text}` : baustein.text;
    case 'nachricht':
      return `${baustein.titel}:\n${baustein.text}`;
  }
}

function text(geruest: Mailgeruest): string {
  const zeilen = firmenzeilen(geruest.firma);
  return [
    'SCHLÜSSELMACHER24',
    '',
    geruest.anrede,
    '',
    ...geruest.bausteine.map((b) => `${bausteinText(b)}\n`),
    'Viele Grüße',
    'Ihr Team von SCHLÜSSELMACHER24',
    '',
    '--',
    ...zeilen,
    `Impressum: ${geruest.site}/rechtliches/impressum`,
    `Datenschutz: ${geruest.site}/rechtliches/datenschutz`,
  ].join('\n');
}

/** Baut Betreff, HTML und Text aus denselben Bausteinen. */
export function baueMail(geruest: Mailgeruest): MailInhalt {
  return { betreff: geruest.betreff, html: html(geruest), text: text(geruest) };
}
