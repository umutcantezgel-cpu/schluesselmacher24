/* ==========================================================================
   Druckansichten fürs Team (Leitfaden Kap. 08, 11 und 17)
   - Vorgangsblatt: kompakte Übersicht eines Vorgangs (Kopf, Termin,
     Zusammenfassung, Positionen, Zahlung, Unterlagen, Notizen) — zum Drucken
     oder „als PDF speichern“ im Browser. Für Projekt-, Zutritts-,
     Sicherheits- und alle anderen Vorgänge gleich.
   - Produktionsliste: offene Code- und Zylinderpositionen (bezahlt, nicht
     versendet) mit Code, Stückzahl, Kunde und Hinweisen.
   Eigenständige HTML-Seiten ohne PDF-Bibliothek und ohne externe Dateien;
   jeder Wert wird maskiert. Der Druckknopf läuft über ein Skript mit Nonce
   (Content-Security-Policy des Endpunkts).
   Reine Funktionen, nur relative Importe (Endpunkte im Backend).
   ========================================================================== */

import { formatCents, formatDate, formatDateTime, formatDuration } from './format';
import { escapeHtml } from './mail/html';
import { ART_LABEL, BEREICH_LABEL, UMFANG_LABEL, ZAHLUNG_LABEL } from './mail/vorlagen/gemeinsam';
import { vorgangOrtText } from './terminort';
import type { BusinessRecord, CompanyProfile, OrderLine, UploadRef } from './types';
import { STATUS_LABEL } from './vorgang-status';

const KATEGORIE_LABEL: Record<UploadRef['category'], string> = {
  schluesselfoto: 'Schlüsselfoto',
  fahrzeugschein: 'Fahrzeugschein',
  grundriss: 'Grundriss',
  dokument: 'Dokument',
  objektfoto: 'Objektfoto',
};

const POSITION_LABEL: Record<OrderLine['kind'], string> = {
  'code-schluessel': 'Schlüssel nach Code',
  'zylinder-schliessung': 'Gleichschließende Zylinder',
  standard: 'Standardartikel',
};

/** Text maskieren, Zeilenumbrüche erhalten. */
function t(wert: string | number | undefined | null): string {
  return escapeHtml(String(wert ?? '')).replace(/\r?\n/g, '<br>');
}

const STIL = `
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px; font: 10.5pt/1.4 -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #192133; background: #fff; }
  header { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; border-bottom: 2px solid #1d5fd1; padding-bottom: 6px; margin-bottom: 12px; }
  .marke { font-weight: 700; letter-spacing: 0.02em; }
  .marke span { color: #1d5fd1; }
  .leise { color: #5B6578; font-size: 9pt; }
  h1 { font-size: 15pt; margin: 0 0 8px; }
  h2 { font-size: 11.5pt; margin: 14px 0 6px; padding-bottom: 2px; border-bottom: 1px solid #D9E0EA; }
  h3 { font-size: 10.5pt; margin: 10px 0 4px; }
  .nummer { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 15pt; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; vertical-align: top; padding: 3px 6px 3px 0; border-bottom: 1px solid #E5EAF1; }
  th { font-weight: 600; color: #5B6578; font-size: 9pt; }
  td.zahl, th.zahl { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .kv th { width: 32%; }
  .code { font-family: ui-monospace, Menlo, Consolas, monospace; font-weight: 600; }
  section { break-inside: avoid; }
  tr { break-inside: avoid; }
  .werkzeug { position: sticky; top: 0; background: #F7F9FC; border: 1px solid #D9E0EA; padding: 8px 12px; margin-bottom: 12px; display: flex; gap: 12px; align-items: center; }
  .werkzeug button { font: inherit; font-weight: 600; padding: 6px 14px; border: 1px solid #1d5fd1; background: #1d5fd1; color: #fff; border-radius: 4px; cursor: pointer; }
  footer { margin-top: 16px; padding-top: 6px; border-top: 1px solid #D9E0EA; }
  @media print { body { padding: 0; } .werkzeug { display: none; } a { color: inherit; text-decoration: none; } }
`;

interface Seite {
  titel: string;
  inhalt: string;
  /** Nonce für das Skript des Druckknopfs (CSP). */
  nonce: string;
  jetzt: Date;
}

function seite({ titel, inhalt, nonce, jetzt }: Seite): string {
  return (
    '<!doctype html><html lang="de"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">'
    + `<title>${t(titel)}</title><style>${STIL}</style></head><body>`
    + '<div class="werkzeug"><button type="button" id="drucken">Drucken / als PDF speichern</button>'
    + '<span class="leise">Im Druckdialog „Als PDF speichern“ wählen, um eine PDF-Datei abzulegen.</span></div>'
    + `<header><div class="marke">SCHLÜSSELMACHER<span>24</span> · ${t(titel)}</div>`
    + `<div class="leise">Stand ${t(formatDateTime(jetzt.toISOString()))} Uhr</div></header>`
    + inhalt
    + '<footer class="leise">Interne Unterlage mit personenbezogenen Daten — nur für die Bearbeitung des Auftrags, nicht weitergeben.</footer>'
    + `<script nonce="${escapeHtml(nonce)}">document.getElementById('drucken').addEventListener('click', function () { window.print(); });</script>`
    + '</body></html>'
  );
}

function tabelle(zeilen: Array<[string, string]>): string {
  const sichtbar = zeilen.filter(([, wert]) => wert !== '');
  if (sichtbar.length === 0) return '';
  return `<table class="kv">${sichtbar.map(([label, wert]) => `<tr><th>${t(label)}</th><td>${wert}</td></tr>`).join('')}</table>`;
}

function name(vorgang: BusinessRecord): string {
  const k = vorgang.contact;
  return [k.salutation, k.firstName, k.lastName].filter(Boolean).join(' ');
}

function anschrift(vorgang: BusinessRecord): string {
  const k = vorgang.contact;
  return [k.street, [k.postalCode, k.city].filter(Boolean).join(' '), k.country].filter(Boolean).join(', ');
}

/* ---------- Vorgangsblatt ------------------------------------------------- */

export interface Vorgangsblatt {
  vorgang: BusinessRecord;
  /** Firmendaten für den Terminort (Werkstatt-Anschrift). */
  firma?: CompanyProfile;
  nonce: string;
  jetzt?: Date;
}

export function vorgangsblattHtml({ vorgang, firma, nonce, jetzt = new Date() }: Vorgangsblatt): string {
  const teile: string[] = [];

  teile.push(
    `<h1><span class="nummer">${t(vorgang.reference)}</span></h1>`,
    tabelle([
      ['Art', t(ART_LABEL[vorgang.kind] ?? vorgang.kind)],
      ['Bereich', t(BEREICH_LABEL[vorgang.area] ?? vorgang.area)],
      ['Status', t(STATUS_LABEL[vorgang.status] ?? vorgang.status)],
      ['Eingegangen', t(`${formatDateTime(vorgang.createdAt)} Uhr`)],
      ['Kunde', t([name(vorgang), vorgang.contact.company].filter(Boolean).join(' · '))],
      ['E-Mail', t(vorgang.contact.email)],
      ['Telefon', t(vorgang.contact.phone)],
      ['Anschrift', t(anschrift(vorgang))],
    ]),
  );

  if (vorgang.appointment) {
    const termin = vorgang.appointment;
    teile.push(
      '<section><h2>Termin</h2>',
      tabelle([
        ['Datum', t(`${formatDate(termin.date)}, ${termin.time} Uhr`)],
        ['Dauer', t(formatDuration(termin.durationMinutes))],
        ['Ort', t(vorgangOrtText(vorgang, firma) ?? '')],
      ]),
      '</section>',
    );
  }

  if (vorgang.lines?.length) {
    const zeilen = vorgang.lines
      .map(
        (line) =>
          `<tr><td class="zahl">${t(line.qty)}</td><td>${t(line.label)}<br><span class="leise">${t(POSITION_LABEL[line.kind])}</span></td>`
          + `<td class="code">${t(line.details)}</td><td class="zahl">${t(formatCents(line.unitPriceCents))}</td>`
          + `<td class="zahl">${t(formatCents(line.totalCents))}</td></tr>`,
      )
      .join('');
    const summen = vorgang.totals
      ? `<tr><td></td><td colspan="3">Versand${vorgang.totals.shippingLabel ? ` (${t(vorgang.totals.shippingLabel)})` : ''}</td>`
        + `<td class="zahl">${t(formatCents(vorgang.totals.shippingCents))}</td></tr>`
        + `<tr><td></td><td colspan="3"><strong>Gesamt</strong> (enthaltene USt. ${t(formatCents(vorgang.totals.vatCents))})</td>`
        + `<td class="zahl"><strong>${t(formatCents(vorgang.totals.totalCents))}</strong></td></tr>`
      : '';
    teile.push(
      '<section><h2>Positionen</h2><table><thead><tr><th class="zahl">Menge</th><th>Artikel</th><th>Angaben</th>'
        + '<th class="zahl">Einzelpreis</th><th class="zahl">Summe</th></tr></thead>'
        + `<tbody>${zeilen}${summen}</tbody></table></section>`,
    );
  }

  // Bei Bestellungen ersetzen die Positionen die Zusammenfassung (wie auf der Vorgangsseite).
  const zusammenfassung = vorgang.kind === 'bestellung' && vorgang.lines?.length ? [] : vorgang.summary;
  if (zusammenfassung.length) {
    teile.push('<h2>Angaben des Kunden</h2>');
    for (const abschnitt of zusammenfassung) {
      teile.push(
        '<section>',
        abschnitt.title ? `<h3>${t(abschnitt.title)}</h3>` : '',
        tabelle(abschnitt.rows.map((zeile) => [zeile.label, t(zeile.value)])),
        '</section>',
      );
    }
  }

  if (vorgang.payment) {
    const zahlung = vorgang.payment;
    teile.push(
      '<section><h2>Zahlung</h2>',
      tabelle([
        [UMFANG_LABEL[zahlung.scope], t(formatCents(zahlung.amountCents))],
        ['Zahlungsstand', t(ZAHLUNG_LABEL[zahlung.status])],
        ['Bezahlt am', zahlung.paidAt ? t(`${formatDateTime(zahlung.paidAt)} Uhr`) : ''],
        ['Erstattet', zahlung.refundedCents ? t(formatCents(zahlung.refundedCents)) : ''],
      ]),
      '</section>',
    );
  }

  if (vorgang.approval && Object.keys(vorgang.approval).length) {
    const freigabe = vorgang.approval;
    teile.push(
      '<section><h2>Freigabe</h2>',
      tabelle([
        ['Preis', freigabe.priceCents !== undefined ? t(formatCents(freigabe.priceCents)) : ''],
        ['Originalschlüssel einsenden', freigabe.sendInRequired === undefined ? '' : freigabe.sendInRequired ? 'ja' : 'nein'],
        ['Hinweis an den Kunden', t(freigabe.note ?? '')],
        ['Freigegeben am', freigabe.approvedAt ? t(`${formatDateTime(freigabe.approvedAt)} Uhr`) : ''],
      ]),
      '</section>',
    );
  }

  if (vorgang.uploads.length) {
    teile.push(
      '<section><h2>Unterlagen</h2><table><tbody>'
        + vorgang.uploads
          .map(
            (datei) =>
              `<tr><td>${t(KATEGORIE_LABEL[datei.category] ?? datei.category)}</td><td>${t(datei.fileName)}</td>`
              + `<td class="leise">${datei.storageKey ? 'im Backend' : 'nicht gespeichert'}</td></tr>`,
          )
          .join('')
        + '</tbody></table></section>',
    );
  }

  teile.push('<section><h2>Interne Notizen</h2>');
  teile.push(
    vorgang.internalNotes.length
      ? `<table><tbody>${vorgang.internalNotes
          .map((notiz) => `<tr><td class="leise" style="width:24%">${t(formatDateTime(notiz.at))}</td><td>${t(notiz.message)}</td></tr>`)
          .join('')}</tbody></table>`
      : '<p class="leise">Keine Notizen.</p>',
  );
  teile.push('</section>');

  return seite({ titel: `Vorgangsblatt ${vorgang.reference}`, inhalt: teile.join(''), nonce, jetzt });
}

/* ---------- Produktionsliste --------------------------------------------- */

/** Positionsarten, die in der Werkstatt gefertigt werden. */
const FERTIGUNG: ReadonlyArray<OrderLine['kind']> = ['code-schluessel', 'zylinder-schliessung'];

export interface Produktionsposition {
  vorgangId: string;
  nummer: string;
  bezahltAm?: string;
  kunde: string;
  art: OrderLine['kind'];
  artikel: string;
  /** Code bzw. Zylinder, Maße, Funktionen und Schlüssel. */
  angaben: string;
  stueck: number;
  hinweise: string[];
  status: BusinessRecord['status'];
}

/** Offen in der Fertigung: bezahlte Bestellung, noch nicht versendet, abgeschlossen oder storniert. */
export function inProduktion(vorgang: BusinessRecord): boolean {
  return (
    vorgang.kind === 'bestellung'
    && vorgang.payment?.status === 'bezahlt'
    && !['versendet', 'abgeschlossen', 'storniert'].includes(vorgang.status)
  );
}

function text(wert: unknown): string | undefined {
  return typeof wert === 'string' && wert.trim() ? wert.trim() : undefined;
}

/**
 * Offene Code- und Zylinderpositionen, älteste Zahlung zuerst. Hinweise: die
 * Anmerkung zum Artikel (Warenkorb, gleiche Reihenfolge wie die Positionen),
 * der Lieferhinweis und die Versandart.
 */
export function produktionsPositionen(vorgaenge: BusinessRecord[]): Produktionsposition[] {
  const positionen: Produktionsposition[] = [];
  for (const vorgang of vorgaenge.filter(inProduktion)) {
    const artikel = Array.isArray(vorgang.payload?.items) ? (vorgang.payload.items as Array<Record<string, unknown>>) : [];
    const lieferhinweis = text(vorgang.payload?.deliveryNote);
    const versand = vorgang.totals?.shippingLabel;
    (vorgang.lines ?? []).forEach((line, index) => {
      if (!FERTIGUNG.includes(line.kind)) return;
      const notiz = text(artikel[index]?.note);
      positionen.push({
        vorgangId: vorgang.id,
        nummer: vorgang.reference,
        bezahltAm: vorgang.payment?.paidAt,
        kunde: [name(vorgang), vorgang.contact.company].filter(Boolean).join(' · '),
        art: line.kind,
        artikel: line.label,
        angaben: line.details,
        stueck: line.qty,
        hinweise: [
          ...(notiz ? [`Anmerkung: ${notiz}`] : []),
          ...(lieferhinweis ? [`Lieferhinweis: ${lieferhinweis}`] : []),
          ...(versand ? [`Versand: ${versand}`] : []),
        ],
        status: vorgang.status,
      });
    });
  }
  return positionen.sort((a, b) => (a.bezahltAm ?? '').localeCompare(b.bezahltAm ?? '') || a.nummer.localeCompare(b.nummer));
}

export interface Produktionsliste {
  vorgaenge: BusinessRecord[];
  nonce: string;
  jetzt?: Date;
  /** Link auf einen Vorgang im Backend (relativ oder absolut). */
  vorgangLink?: (id: string) => string;
}

export function produktionslisteHtml({ vorgaenge, nonce, jetzt = new Date(), vorgangLink }: Produktionsliste): string {
  const positionen = produktionsPositionen(vorgaenge);
  const inhalt = positionen.length
    ? '<p class="leise">Bezahlte Bestellungen, noch nicht versendet — älteste Zahlung zuerst.</p>'
      + '<table><thead><tr><th>Vorgang</th><th>Kunde</th><th>Artikel</th><th>Code / Angaben</th><th class="zahl">Stück</th>'
      + '<th>Hinweise</th><th>Status</th><th>Erledigt</th></tr></thead><tbody>'
      + positionen
        .map((p) => {
          const nummer = vorgangLink ? `<a href="${escapeHtml(vorgangLink(p.vorgangId))}">${t(p.nummer)}</a>` : t(p.nummer);
          return (
            `<tr><td>${nummer}${p.bezahltAm ? `<br><span class="leise">bezahlt ${t(formatDateTime(p.bezahltAm))}</span>` : ''}</td>`
            + `<td>${t(p.kunde)}</td><td>${t(p.artikel)}<br><span class="leise">${t(POSITION_LABEL[p.art])}</span></td>`
            + `<td class="code">${t(p.angaben)}</td><td class="zahl">${t(p.stueck)}</td>`
            + `<td>${p.hinweise.map(t).join('<br>')}</td><td>${t(STATUS_LABEL[p.status])}</td><td>☐</td></tr>`
          );
        })
        .join('')
      + `</tbody></table><p class="leise">${positionen.length} Position${positionen.length === 1 ? '' : 'en'}.</p>`
    : '<p>Keine offenen Code- oder Zylinderpositionen.</p>';
  return seite({ titel: 'Produktionsliste', inhalt: `<h1>Produktionsliste</h1>${inhalt}`, nonce, jetzt });
}
