// Gemeinsame Grundlage aller Prüfwerkzeuge des Gestaltungslaufs.
// Wird nur vom Orchestrator geändert; Pakete importieren daraus.
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const hier = path.dirname(fileURLToPath(import.meta.url));

export const REPO = path.resolve(hier, '..', '..');
export const WERKSTATT = path.join(REPO, '_werkstatt');
export const PROTOKOLLE = path.join(WERKSTATT, 'protokolle');
/** Bilder außerhalb des Repositorys (alles, was nicht ausdrücklich ins Repo soll). */
export const BILDER_EXTERN = process.env.SM24_BILDER ?? '/root/sm24-bilder';
export const BASIS_URL = process.env.SM24_BASIS_URL ?? 'http://localhost:3000';
export const CHROMIUM = process.env.SM24_CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/** Die zwölf Hauptansichten (in E0 festgelegt, danach unveränderlich). */
export const HAUPTANSICHTEN = [
  { id: 'H01-start', pfad: '/', art: 'erzaehl' },
  { id: 'H02-autoschluessel', pfad: '/autoschluessel', art: 'erzaehl' },
  { id: 'H03-modell-golf', pfad: '/autoschluessel/marken/volkswagen/golf', art: 'erzaehl' },
  { id: 'H04-assistent', pfad: '/autoschluessel/anfrage', art: 'arbeit' },
  { id: 'H05-code-shop', pfad: '/schluessel-nach-code', art: 'erzaehl' },
  { id: 'H06-code-produkt', pfad: '/schluessel-nach-code/ms-01', art: 'erzaehl' },
  { id: 'H07-zylinder-konfigurator', pfad: '/gleichschliessende-zylinder/konfigurator', art: 'arbeit' },
  { id: 'H08-schliessanlagen', pfad: '/schliessanlagen', art: 'erzaehl' },
  { id: 'H09-tuertechnik', pfad: '/tuer-und-schliesstechnik', art: 'erzaehl' },
  { id: 'H10-warenkorb', pfad: '/warenkorb', art: 'arbeit' },
  { id: 'H11-kasse', pfad: '/kasse', art: 'arbeit' },
  { id: 'H12-ratgeber', pfad: '/ratgeber/autoschluessel-verloren-was-tun', art: 'erzaehl' },
];

/** Übrige Ansichten (für Stichproben in Prüfstufe C). Dynamische Routen mit Beispiel-Slug. */
export const UEBRIGE_ANSICHTEN = [
  '/artikel', '/artikel/beispiel-schluesselkasten',
  '/autoschluessel/nachmachen', '/autoschluessel/programmieren', '/autoschluessel/kopieren',
  '/autoschluessel/funkschluessel', '/autoschluessel/smart-key', '/autoschluessel/schluesselbart-fraesen',
  '/autoschluessel/fahrzeugoeffnung', '/autoschluessel/marken', '/autoschluessel/marken/volkswagen',
  '/elektronische-zutrittsloesungen', '/elektronische-zutrittsloesungen/konfigurator',
  '/gleichschliessende-zylinder', '/ratgeber',
  '/rechtliches/agb', '/rechtliches/widerruf', '/rechtliches/impressum', '/rechtliches/datenschutz',
  '/rechtliches/versand-und-zahlung', '/rechtliches/cookie-einstellungen',
  '/schliessanlagen/konfigurator', '/schluessel-nach-vorlage', '/schluessel-nach-vorlage/anfrage',
  '/service-und-termin', '/service-und-termin/anfrage', '/service-und-termin/kontakt',
  '/service-und-termin/terminstatus', '/service-und-termin/vor-ort',
  '/sicherheitstechnik', '/sicherheitstechnik/videoueberwachung', '/sicherheitstechnik/sicherheitscheck',
  '/standorte', '/standorte/berlin', '/tuer-und-schliesstechnik/einsteckschloesser',
  '/gibt-es-nicht-404',
];

/** Gerätegrößen aus den Einstellungen des Auftrags. */
export const GERAETE = [
  { id: 'mobil', breite: 390, hoehe: 844, touch: true },
  { id: 'tablet', breite: 768, hoehe: 1024, touch: true },
  { id: 'desktop', breite: 1440, hoehe: 900, touch: false },
];

/** E-Mail-Adresse, an der Prüfläufe ihre schreibenden Anfragen erkennen. */
export const PRUEF_EMAIL = 'pruefung@example.invalid';

export function ordner(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
  return p;
}

export async function browserStarten() {
  return chromium.launch({ executablePath: CHROMIUM, headless: true });
}

/**
 * Neuer Kontext für ein Gerät. `reduziert` emuliert „Bewegung reduzieren“.
 * Bilder mit Gerätepixelverhältnis 1, damit nichts breiter als 1.440 px wird.
 */
export async function kontextFuer(browser, geraet, { reduziert = false } = {}) {
  return browser.newContext({
    viewport: { width: geraet.breite, height: geraet.hoehe },
    deviceScaleFactor: 1,
    hasTouch: geraet.touch,
    isMobile: geraet.touch && geraet.breite < 1024,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    reducedMotion: reduziert ? 'reduce' : 'no-preference',
  });
}

/**
 * Kennungen der lesenden Server Actions (`fetch*` aus `src/lib/actions/booking.ts`),
 * aus den Manifesten der Builds gelesen (aktueller Build und eingefrorener E0-Build).
 * Alles andere gilt als schreibend und wird abgefangen – auch ohne Prüf-E-Mail.
 */
function leseActions() {
  const ordner = [process.env.SM24_NEXT_DIR, path.join(REPO, '.next'), '/root/sm24-e0/.next'].filter(Boolean);
  const ids = new Set();
  for (const o of ordner) {
    const datei = path.join(o, 'server', 'server-reference-manifest.json');
    if (!existsSync(datei)) continue;
    try {
      const m = JSON.parse(readFileSync(datei, 'utf8'));
      for (const [id, eintrag] of Object.entries(m.node ?? {})) {
        if (eintrag.filename === 'src/lib/actions/booking.ts' && /^fetch[A-Z]/.test(eintrag.exportedName)) ids.add(id);
      }
    } catch {
      // Unlesbares Manifest: keine Lese-Kennungen, also wird jede Action abgefangen.
    }
  }
  return ids;
}

/** Enthält der Inhalt die Prüf-E-Mail als ganzen Wert (nicht als Teil einer anderen Adresse)? */
function enthaeltPruefEmail(inhalt) {
  const muster = PRUEF_EMAIL.replace(/[.@]/g, (z) => `\\${z}`);
  return new RegExp(`(^|[^A-Za-z0-9._%+-])${muster}($|[^A-Za-z0-9._%+-])`).test(inhalt);
}

/**
 * Attrappen nach G5: Jede schreibende Anfrage wird abgefangen.
 * - `/api/kunden-upload` → immer Attrappe.
 * - Server Actions (POST mit Kopf `next-action`): nur die lesenden Actions aus `leseActions()`
 *   (Preis, Zeitfenster, Status) erreichen den Server; jede andere wird als Attrappe beantwortet
 *   und als `action-schreibend` (Prüf-E-Mail im Inhalt) oder `action-unbekannt` vermerkt.
 * - Alle übrigen POST/PUT/PATCH/DELETE → Attrappe; Anfragen an fremde Ursprünge → abgebrochen.
 * Gibt eine Liste zurück, in der jede abgefangene Anfrage vermerkt wird.
 */
export async function attrappenSetzen(context) {
  const abgefangen = [];
  const lesend = leseActions();
  await context.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const methode = req.method();
    const eigen = url.origin === new URL(BASIS_URL).origin;
    if (!eigen) {
      if (methode === 'GET' && /fonts\.(gstatic|googleapis)\.com$/.test(url.hostname)) return route.continue();
      abgefangen.push({ art: 'fremd', methode, url: req.url() });
      return route.abort();
    }
    if (methode === 'GET' || methode === 'HEAD') return route.continue();
    if (url.pathname.startsWith('/api/kunden-upload')) {
      abgefangen.push({ art: 'upload', methode, url: url.pathname });
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, id: 'attrappe-upload', schluessel: 'attrappe' }),
      });
    }
    const action = req.headers()['next-action'];
    const inhalt = req.postData() ?? '';
    // Nur bekannte lesende Actions erreichen den Server; jede andere wird als Attrappe beantwortet.
    if (action && lesend.has(action)) return route.continue();
    if (action) {
      abgefangen.push({
        art: enthaeltPruefEmail(inhalt) ? 'action-schreibend' : 'action-unbekannt',
        methode,
        url: url.pathname,
        laenge: inhalt.length,
      });
      return route.fulfill({ status: 200, contentType: 'text/x-component', body: '0:{"a":"$@1","f":"","b":"attrappe"}\n1:null\n' });
    }
    abgefangen.push({ art: 'post-sonstig', methode, url: url.pathname });
    return route.fulfill({ status: 204, body: '' });
  });
  return abgefangen;
}

/** Seite laden und warten, bis Netz und Schriften ruhen. */
export async function laden(page, pfad, { timeout = 45000 } = {}) {
  const antwort = await page.goto(BASIS_URL + pfad, { waitUntil: 'networkidle', timeout });
  await page.evaluate(() => document.fonts?.ready);
  return antwort;
}

/** Einmal langsam bis zum Ende und zurück scrollen, damit InView-Bereiche auslösen. */
export async function durchscrollen(page, { schritt = 0.8, pause = 120 } = {}) {
  await page.evaluate(async ({ schritt, pause }) => {
    const h = window.innerHeight * schritt;
    for (let y = 0; y < document.documentElement.scrollHeight; y += h) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, pause));
    }
    window.scrollTo(0, 0);
  }, { schritt, pause });
}

export function zeitstempel() {
  return new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Berlin' }).replace(' ', '_').replace(/:/g, '-');
}

export function argumente(argv = process.argv.slice(2)) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const name = t.slice(2);
      const naechstes = argv[i + 1];
      if (naechstes === undefined || naechstes.startsWith('--')) a[name] = true;
      else { a[name] = naechstes; i += 1; }
    } else a._.push(t);
  }
  return a;
}
