// leistung.test.mjs – Selbsttest des Leistungswerkzeugs (FA-SEO-03). Kein Server, kein Browser, kein Lighthouse.
// Ausführen: node --test _werkstatt/ausbau/werkzeuge/leistung.test.mjs
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANSICHTEN, KENNWERTE, Bedienfehler, STANDARD_BASIS, ansichtenWaehlen, argumente, basisWaehlen, fasseZusammen,
  markdown, median, medianLauf, methodeVon, methodeWaehlen, statistik, summeAttrappen, ursachenAus, vergleiche, werteAus,
  zaehleAttrappen,
} from './leistung.mjs';

const BASIS = 'http://localhost:3200';

/** Kleines Lighthouse-Ergebnis mit den Feldern, die das Werkzeug liest. */
function lhr({ score = 0.8, lcp = 2500, tbt = 300 } = {}) {
  return {
    categories: { performance: { score, auditRefs: [{ id: 'render-blocking-resources', weight: 0 }, { id: 'unused-javascript', weight: 0 }, { id: 'lcp-ok', weight: 0 }] } },
    audits: {
      'first-contentful-paint': { numericValue: 1200 },
      'largest-contentful-paint': { numericValue: lcp },
      'speed-index': { numericValue: 3000 },
      'total-blocking-time': { numericValue: tbt },
      'cumulative-layout-shift': { numericValue: 0.01 },
      'mainthread-work-breakdown': { numericValue: 1800, details: { items: [{ group: 'scriptEvaluation', groupLabel: 'Script Evaluation', duration: 900 }] } },
      'network-requests': {
        details: {
          items: [
            { url: `${BASIS}/`, resourceType: 'Document', transferSize: 81920 },
            { url: `${BASIS}/_next/a.js`, resourceType: 'Script', transferSize: 102400, priority: 'High' },
            { url: `${BASIS}/_next/b.js`, resourceType: 'Script', transferSize: 20480, priority: 'Low' },
            { url: `${BASIS}/f.woff2`, resourceType: 'Font', transferSize: 40960 },
          ],
        },
      },
      'bootup-time': { details: { items: [{ url: `${BASIS}/_next/a.js`, scripting: 410.4 }, { url: `${BASIS}/`, scripting: 55.2 }] } },
      'unused-javascript': {
        score: 0.5, scoreDisplayMode: 'metricSavings', displayValue: '30 KiB',
        details: { overallSavingsMs: 150, overallSavingsBytes: 30720, items: [{ url: `${BASIS}/_next/a.js`, wastedBytes: 30720 }] },
      },
      'render-blocking-resources': { score: 1, scoreDisplayMode: 'metricSavings', details: { items: [] } },
      'lcp-ok': { score: 1, scoreDisplayMode: 'numeric' },
      'largest-contentful-paint-element': {
        details: {
          items: [
            { type: 'table', items: [{ node: { selector: 'h1#hub-frage', snippet: '<h1 id="hub-frage">' } }] },
            { type: 'table', items: [{ phase: 'TTFB', timing: 600 }, { phase: 'Load Delay', timing: 0 }, { phase: 'Load Time', timing: 0 }, { phase: 'Render Delay', timing: 1900 }] },
          ],
        },
      },
      'long-tasks': { details: { items: [{ url: `${BASIS}/_next/a.js`, startTime: 1500, duration: 120 }, { url: `${BASIS}/`, startTime: 900, duration: 300 }] } },
      'layout-shifts': { details: { items: [] } },
    },
  };
}

describe('Basis und Argumente', () => {
  test('Standard ist Port 3000, Umgebung BASIS und Argument gewinnen in dieser Reihenfolge', () => {
    assert.equal(STANDARD_BASIS, 'http://localhost:3000');
    assert.equal(basisWaehlen(undefined, undefined), 'http://localhost:3000');
    assert.equal(basisWaehlen(undefined, 'http://localhost:3200'), 'http://localhost:3200');
    assert.equal(basisWaehlen('http://127.0.0.1:3300/', 'http://localhost:3200'), 'http://127.0.0.1:3300');
  });
  test('fremde Hosts und Pfade sind Bedienfehler (G1)', () => {
    assert.throws(() => basisWaehlen('https://schluesselmacher24.de'), Bedienfehler);
    assert.throws(() => basisWaehlen('http://localhost:3200/shop'), Bedienfehler);
    assert.throws(() => basisWaehlen('kein url'), Bedienfehler);
  });
  test('Methode: simulate als Standard, devtools erlaubt, sonst Bedienfehler', () => {
    assert.equal(methodeWaehlen(undefined), 'simulate');
    assert.equal(methodeWaehlen('devtools'), 'devtools');
    assert.throws(() => methodeWaehlen('provided'), Bedienfehler);
  });
  test('argumente liest Schalter mit und ohne Wert', () => {
    assert.deepEqual(argumente(['--basis', BASIS, '--laeufe', '3', '--x']), { _: [], basis: BASIS, laeufe: '3', x: true });
  });
  test('Ansichten: neun feste, Auswahl nach Kennung oder Pfad, unbekannte sind Bedienfehler', () => {
    assert.equal(ANSICHTEN.length, 9);
    assert.equal(new Set(ANSICHTEN.map((a) => a.pfad)).size, 9);
    assert.equal(ansichtenWaehlen(undefined).length, 9);
    assert.deepEqual(ansichtenWaehlen('start,/shop').map((a) => a.pfad), ['/', '/shop']);
    assert.equal(ansichtenWaehlen('/neu').at(0).pfad, '/neu');
    assert.throws(() => ansichtenWaehlen('quatsch'), Bedienfehler);
    assert.throws(() => ansichtenWaehlen(true), Bedienfehler);
  });
});

describe('Statistik', () => {
  test('Median ungerade, gerade, ohne Werte', () => {
    assert.equal(median([3, 1, 2]), 2);
    assert.equal(median([4, 1, 2, 3]), 2.5);
    assert.equal(median([null, undefined]), null);
    assert.deepEqual(statistik([5, null, 1, 3]), { median: 3, min: 1, max: 5, n: 3 });
    assert.equal(statistik([]), null);
  });
  test('Medianlauf: mittlere Leistung, bei Gleichstand der niedrigere LCP', () => {
    const l = (lauf, leistung, lcp) => ({ lauf, werte: { leistung, lcp } });
    assert.equal(medianLauf([l(1, 90, 2000), l(2, 70, 3000), l(3, 80, 2500)]).lauf, 3);
    assert.equal(medianLauf([l(1, 80, 2600), l(2, 80, 2400)]).lauf, 2);
    assert.equal(medianLauf([{ lauf: 1, werte: null }]), null);
  });
});

describe('Auswertung eines Laufs', () => {
  test('werteAus: Kennwerte, Gewicht und Dateien', () => {
    const w = werteAus(lhr());
    assert.equal(w.leistung, 80);
    assert.equal(w.lcp, 2500);
    assert.equal(w.tbt, 300);
    assert.equal(w.dateien, 4);
    assert.equal(w.gesamtKB, 240);
    assert.equal(w.jsKB, 120);
    assert.equal(w.htmlKB, 80);
    for (const { k } of KENNWERTE) assert.ok(k in w, k);
  });
  test('werteAus ohne Netzdaten lässt Gewichte leer', () => {
    const w = werteAus({ categories: {}, audits: {} });
    assert.equal(w.leistung, null);
    assert.equal(w.dateien, null);
    assert.equal(w.htmlKB, null);
  });
  test('ursachenAus: LCP-Element, Phasen, Skripte, lange Aufgaben, Befunde', () => {
    const u = ursachenAus(lhr(), BASIS);
    assert.equal(u.lcpElement.selektor, 'h1#hub-frage');
    assert.deepEqual(u.lcpPhasen, { serverantwort: 600, ladeverzoegerung: 0, ladedauer: 0, darstellungsverzoegerung: 1900 });
    assert.equal(u.skripte[0].datei, '/_next/a.js');
    assert.equal(u.skripte[0].ausfuehrungMs, 410);
    assert.equal(u.skripte[0].ungenutztKB, 30);
    assert.equal(u.dokumentSkriptMs, 55);
    assert.equal(u.langeAufgaben[0].dauerMs, 300);
    assert.equal(u.langeAufgaben[0].datei, '/');
    assert.deepEqual(u.befunde.map((b) => b.id), ['unused-javascript']);
  });
});

describe('Zusammenfassung, Vergleich, Bericht', () => {
  const ansicht = { id: 'start', name: 'Startseite', pfad: '/' };
  const laeufe = [0.7, 0.9, 0.8].map((score, i) => {
    const x = lhr({ score, lcp: 2000 + i * 500, tbt: 100 * (i + 1) });
    return { lauf: i + 1, werte: werteAus(x), ursachen: ursachenAus(x, BASIS) };
  });
  laeufe.push({ lauf: 4, fehler: 'Technischer Fehler: x', werte: null, ursachen: null });
  const z = fasseZusammen(ansicht, laeufe);
  test('fasseZusammen: Median je Kennwert aus gültigen Läufen, Medianlauf mit Ursachen', () => {
    assert.equal(z.gueltig, 3);
    assert.equal(z.statistik.leistung.median, 80);
    assert.equal(z.statistik.tbt.median, 200);
    assert.equal(z.medianLauf.lauf, 3);
    assert.equal(z.laeufe[3].fehler, 'Technischer Fehler: x');
  });
  test('vergleiche: Differenz der Mediane je Pfad, fehlende Ansicht ergibt null', () => {
    const vorher = [{ ...z, statistik: { ...z.statistik, tbt: { median: 500 } } }];
    const v = vergleiche(vorher, [z, { id: 'neu', pfad: '/neu', statistik: {} }]);
    assert.equal(v[0].diff.tbt.differenz, -300);
    assert.equal(v[1].diff.tbt, null);
  });
  test('markdown nennt Maßstab, Übersicht und Ursachen', () => {
    const md = markdown({
      marke: 'vorher', zeit: 'x', basis: BASIS, lighthouse: '12.6.1', chrome: '1', laeufe: 3,
      drosselung: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 }, geraet: '412 × 823',
    }, [z], vergleiche([z], [z]));
    assert.match(md, /Rundlaufzeit 150 ms, 1\.638,4 kbit\/s, CPU 4-fach/);
    assert.match(md, /\| Startseite \(\/\) \| 3\/3 \| 80 /);
    assert.match(md, /LCP-Element: h1#hub-frage/);
    assert.match(md, /Vergleich mit der Vorher-Messung/);
    assert.match(md, /LCP-Phasen \(simuliert\)/);
    assert.match(md, /Attrappen \(G5\): nicht gezählt/);
    const md2 = markdown({
      marke: 'x', methode: 'devtools', zeit: 'x', basis: BASIS, lighthouse: '12.6.1', chrome: '1', laeufe: 1,
      drosselung: { requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56, cpuSlowdownMultiplier: 4 }, geraet: '412 × 823',
    }, [z], null);
    assert.match(md2, /angewandte Drosselung \(devtools\): Latenz 562,5 ms je Anfrage, 1\.474,6 kbit\/s, CPU 4-fach/);
    assert.match(md2, /LCP-Phasen \(gemessen\)/);
    assert.doesNotMatch(md2, /LCP-Phasen \(simuliert\)/);
  });
  test('Attrappen: Zählung je Lauf, Summe je Ansicht, Ausgabe im Markdown (G5)', () => {
    const a1 = zaehleAttrappen([{ art: 'fremd', url: 'https://example.org/x.js' }, { art: 'post-sonstig', url: '/x' }]);
    assert.equal(a1.fremd, 1);
    assert.equal(a1['post-sonstig'], 1);
    assert.equal(a1['action-unbekannt'], 0);
    assert.deepEqual(a1.fremdHosts, ['example.org']);
    assert.equal(zaehleAttrappen([]).fremd, 0);
    assert.equal(summeAttrappen([{ attrappen: null }]), null);
    const mit = laeufe.map((l, i) => ({ ...l, attrappen: i === 0 ? a1 : zaehleAttrappen([]) }));
    const zz = fasseZusammen(ansicht, mit);
    assert.equal(zz.attrappen.fremd, 1);
    assert.equal(zz.attrappen.laeufe, 4);
    assert.equal(zz.laeufe[0].attrappen.fremd, 1);
    const md = markdown({ marke: 'x', zeit: 'x', basis: BASIS, lighthouse: '1', chrome: '1', laeufe: 3, drosselung: {}, geraet: 'x' }, [zz], null);
    assert.match(md, /Attrappen \(G5\) in 4 Läufen: fremd 1, upload 0, action-schreibend 0, action-unbekannt 0, post-sonstig 1 \(fremde Hosts: example\.org\)/);
  });
  test('methodeVon: fehlendes Feld gilt als simulate (Vorfassung), sonst das Feld', () => {
    assert.equal(methodeVon({}), 'simulate');
    assert.equal(methodeVon({ methode: 'devtools' }), 'devtools');
  });
});
