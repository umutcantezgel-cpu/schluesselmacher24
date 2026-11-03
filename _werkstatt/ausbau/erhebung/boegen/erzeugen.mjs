// Erzeugt je Erhebungsbogen eine druckbare HTML-Seite (A4 hoch) aus der CSV-Datei im selben Ordner.
// Liest nur die CSV-Dateien dieses Ordners und schreibt nur die HTML-Dateien dieses Ordners.
// Aufruf: node erzeugen.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ORDNER = path.dirname(fileURLToPath(import.meta.url));
const DATUM = '03.11.2026';

const BOGEN = [
  {
    datei: 'preise', name: 'PREISE', untertitel: 'Preise des Bestands und neue Positionen',
    intro: [
      'Dieser Bogen enthält alle Preise, die heute im Bestand stehen, und neue Positionen, für die es noch keinen Preis gibt.',
      'Der Bestand ist der Wert, der heute auf der Seite steht. Der Vorschlag kommt aus der Recherche und steht nur mit Quelle.',
      'Bestätigen Sie den Bestand oder schreiben Sie den neuen Betrag in die Antwortspalte. Ohne Antwort zeigt die Seite für neue Positionen keinen Preis.',
    ],
    antwortHinweis: 'Betrag in Euro oder Bestand bestätigen',
  },
  {
    datei: 'klonbar', name: 'KLONBAR', untertitel: 'Fahrzeuge und Transponder, die die Werkstatt klonen kann',
    intro: [
      'Ein Fahrzeug erscheint auf der Seite nur dann als klonbar, wenn Sie es mit ja bestätigen.',
      'Schreiben Sie ja, nein oder weiß nicht in die Antwortspalte. Ohne Antwort gilt: nicht klonbar.',
      'Für jede Transponder-Kopie brauchen Sie einen Berechtigungsnachweis, etwa die Zulassungsbescheinigung Teil I und den Personalausweis (erhebung/E1-transponder.md, Abschnitt 4).',
      'Die Vorschläge sind Fundstellen aus Herstellerangaben und Fachquellen. Nichts davon ist bestätigt.',
    ],
    antwortHinweis: 'ja, nein oder weiß nicht',
  },
  {
    datei: 'sortiment', name: 'SORTIMENT', untertitel: 'Schlüssel nach Code: welche Codelinien der Betrieb führt',
    intro: [
      'Jede Codelinie hat eine feste Kennung. Die Liste enthält alle Codelinien aus dem Bestand.',
      'Tragen Sie in der Antwortspalte ein, ob die Linie im Sortiment ist, wie viele Tage die Lieferung dauert und ob ein Foto vorhanden ist. Den Hersteller nennen Sie im eigenen Feld.',
      'Ohne Antwort bleibt die Codelinie wie im Bestand.',
    ],
    antwortHinweis: 'Sortiment ja oder nein; Tage; Foto ja oder nein',
    zusatzFeld: 'Hersteller (Antwort)',
  },
  {
    datei: 'produkte', name: 'PRODUKTE', untertitel: 'Elektronische Schließsysteme: Hersteller, Produktname und Technik',
    intro: [
      'Nennen Sie einen Produktnamen nur, wenn Sie ihn selbst bestätigen können.',
      'Ohne Antwort zeigt die Seite nur Hersteller und Technik, keine Produktnamen. Namen aus dem Gespräch sind bisher nicht belegt.',
    ],
    antwortHinweis: 'Produktname, Technik, ja oder nein',
  },
  {
    datei: 'partner', name: 'PARTNER', untertitel: 'Auftragsarten, die über Partner vermittelt werden können',
    intro: [
      'Entscheiden Sie hier, welche Auftragsarten über Partner vermittelt werden. Schreiben Sie ja oder nein.',
      'Provisionen tragen Sie nicht in diesen Bogen ein. Die Spalten Provision und Abrechnungsart bleiben leer, Provisionen kommen nur als Nachricht.',
      'Ohne Antwort wird die Auftragsart nicht über Partner vermittelt.',
    ],
    antwortHinweis: 'ja oder nein',
  },
];

// ------------------------------------------------------------ CSV lesen
function parseCsv(text) {
  const zeilen = []; let zeile = []; let feld = ''; let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { feld += '"'; i++; } else { inQuotes = false; }
      } else feld += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ';') { zeile.push(feld); feld = ''; }
    else if (c === '\r') { /* Zeilenende wird über \n erkannt */ }
    else if (c === '\n') { zeile.push(feld); zeilen.push(zeile); zeile = []; feld = ''; }
    else feld += c;
  }
  if (feld.length || zeile.length) { zeile.push(feld); zeilen.push(zeile); }
  return zeilen;
}

function leseCsv(datei) {
  const text = fs.readFileSync(path.join(ORDNER, datei), 'utf8').replace(/^﻿/, '');
  const [kopf, ...rest] = parseCsv(text);
  return rest.map((z) => Object.fromEntries(kopf.map((k, i) => [k, z[i] ?? ''])));
}

// ------------------------------------------------------------ Darstellung
const anzeige = (t) => String(t ?? '').replace(/\s*[—–]\s*/g, ': ');
const esc = (t) => anzeige(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function karte(z, b) {
  const einheit = z.Einheit ? ` <span class="einheit">· ${esc(z.Einheit)}</span>` : "";
  const bestand = z.Bestand ? esc(z.Bestand) : "kein Eintrag im Bestand";
  const bestandQuelle = z["Quelle Bestand"] ? ` <span class="quelle">Quelle: ${esc(z["Quelle Bestand"])}</span>` : "";
  const vorschlag = z.Vorschlag ? esc(z.Vorschlag) : "kein Vorschlag mit Quelle";
  const vorschlagQuelle = z["Quelle Vorschlag"] ? ` <span class="quelle">Quelle: ${esc(z["Quelle Vorschlag"])}</span>` : "";
  const hersteller = b.zusatzFeld ? `<p class="feld-zeile">${esc(b.zusatzFeld)}:</p>` : "";
  return `
<article class="karte">
  <div class="inhalt">
    <p class="gegen"><span class="ken">${esc(z.Kennung)}</span> ${esc(z.Gegenstand)}${einheit}</p>
    <p class="zeile"><span class="lab">Bestand:</span> ${bestand}${bestandQuelle}</p>
    <p class="zeile"><span class="lab">Vorschlag:</span> ${vorschlag}${vorschlagQuelle}</p>
    <p class="hinweis">${esc(z.Hinweis)}</p>
  </div>
  <div class="antwort">
    <p class="lab">Antwort</p>
    <p class="form">${esc(b.antwortHinweis)}</p>
    ${hersteller}
  </div>
</article>`;
}

// Überschrift je Bereich, Karten in der Reihenfolge der CSV-Zeilen
function abschnitte(zeilen, b) {
  const ausgabe = [];
  let letzter = null;
  for (const z of zeilen) {
    if (z.Bereich !== letzter) {
      ausgabe.push(`<h2>${esc(z.Bereich)}</h2>`);
      letzter = z.Bereich;
    }
    ausgabe.push(karte(z, b));
  }
  return ausgabe.join("\n");
}

function seite(b, zeilen) {
  const titel = `Erhebungsbogen ${b.name}`;
  const karten = abschnitte(zeilen, b);
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel}</title>
<style>
@page {
  size: A4 portrait;
  margin: 24mm 15mm 22mm 15mm;
  @top-left { content: "${titel}"; font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; }
  @top-center { content: "Datum: ${DATUM}"; font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; }
  @top-right { content: "Ausgefüllt von: ______________"; font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; }
  @bottom-left { content: "Vorschlag, bitte prüfen"; font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; }
  @bottom-right { content: "Seite " counter(page) " von " counter(pages); font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; }
}
html { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; background: #fff; }
body { margin: 0; line-height: 1.25; }
h1 { font-size: 16pt; margin: 0 0 1mm; }
.untertitel { margin: 0 0 3mm; font-weight: bold; }
.intro p { margin: 0 0 1.8mm; }
.kopfzeile { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin: 4mm 0 5mm; }
.kopfzeile div { border-bottom: 0.6pt solid #000; padding-bottom: 1mm; }
.karte { display: grid; grid-template-columns: 1fr 34mm; border: 0.6pt solid #000; margin: 0 0 1.8mm; break-inside: avoid; page-break-inside: avoid; }
.inhalt { padding: 1.3mm 2.5mm; }
.h2x { margin: 0; }
h2 { font-size: 11pt; margin: 3mm 0 1.6mm; text-decoration: underline; }
.einheit { font-weight: normal; }
.kopf { margin: 0 0 0.8mm; }
.ken { font-weight: bold; }
.gegen { font-weight: bold; margin: 0 0 0.8mm; }
.zeile { margin: 0.5mm 0 0; }
.lab { font-weight: bold; }
.quelle { display: block; color: #000; margin-top: 0.4mm; }
.hinweis { margin: 1.2mm 0 0; border-top: 0.4pt solid #000; padding-top: 0.8mm; }
.antwort { border-left: 0.6pt solid #000; padding: 1.6mm 2.2mm; }
.antwort .form { margin: 0.6mm 0 0; }
.feld-zeile { margin: 4mm 0 0; border-bottom: 0.6pt solid #000; padding-bottom: 1mm; }
.fuss { margin-top: 4mm; }
.ende { margin-top: 2mm; }
@media screen {
  body { max-width: 180mm; margin: 0 auto; padding: 10mm 0; }
}
</style>
</head>
<body>
<header>
  <h1>${titel}</h1>
  <p class="untertitel">${esc(b.untertitel)}</p>
  <div class="intro">
    ${b.intro.map((s) => `<p>${esc(s)}</p>`).join('\n    ')}
  </div>
  <div class="kopfzeile">
    <div>Ausgefüllt von:</div>
    <div>Datum:</div>
  </div>
</header>
<main>
${karten}
</main>
<footer class="fuss">
  <p class="ende">Rückgabe: siehe LIESMICH.md im Ordner erhebung/boegen. Bitte den Bogen ohne interne Werte zurückgeben.</p>
</footer>
</body>
</html>
`;
}

for (const b of BOGEN) {
  const zeilen = leseCsv(`${b.datei}.csv`);
  if (zeilen.length === 0) throw new Error(`Keine Zeilen in ${b.datei}.csv`);
  for (const z of zeilen) {
    if (!String(z.Hinweis).startsWith('Vorschlag, bitte prüfen')) throw new Error(`Hinweis ohne Pflichtphrase in ${b.datei}.csv: ${z.Kennung}`);
  }
  fs.writeFileSync(path.join(ORDNER, `${b.datei}.html`), seite(b, zeilen), 'utf8');
  console.log(`${b.datei}.html: ${zeilen.length} Zeilen`);
}
