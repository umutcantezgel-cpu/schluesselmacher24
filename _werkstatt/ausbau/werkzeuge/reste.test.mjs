// reste.test.mjs – Selbsttest des Prüfwerkzeugs „nichts Falsches bleibt übrig“ (FA-QA-03A).
// Kein Server, kein Build, kein Browser: alle Fixtures entstehen in einem vorübergehenden Ordner.
// Ausführen: node --test _werkstatt/ausbau/werkzeuge/reste.test.mjs
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  pruefeAlles, pruefeText, seitenSegmente, zeichenketten, telefonKuerzen, telefonZiffern,
  exitCodeFuer, ladeAusnahmen,
} from './reste.mjs';

const angelegt = [];
after(() => { for (const d of angelegt) rmSync(d, { recursive: true, force: true }); });

const SETTINGS = {
  company: {
    street: 'Langgasse 61',
    postalCode: '35576',
    city: 'Wetzlar',
    phone: '06441 8056279',
    email: 'info@schluesselmacher24.de',
    taxNumber: '03986300160',
    chamber: 'Handwerkskammer Wiesbaden, Zweigstelle Wetzlar, Ederstraße 2, 35576 Wetzlar',
  },
  reachability: { kernaussage: '24 Stunden erreichbar', zeilen: ['Notdienst rund um die Uhr'] },
};
// Erfundenes Beispiel wie in content/code-lines.json (example: true)
const BEISPIELE = [{ id: 'ms-01', slug: 'ms-01', name: 'Büroschrank und Rollcontainer — Serie MS-01', example: true }];

/** Legt einen Stand in einem vorübergehenden Ordner an. */
function werkstatt({ seiten = {}, build = true, code = {}, inhalt = {} } = {}) {
  const wurzel = mkdtempSync(path.join(os.tmpdir(), 'reste-test-'));
  angelegt.push(wurzel);
  const schreibe = (rel, text) => {
    const p = path.join(wurzel, rel);
    mkdirSync(path.dirname(p), { recursive: true });
    writeFileSync(p, text);
  };
  schreibe('content/settings.json', JSON.stringify(SETTINGS));
  schreibe('content/code-lines.json', JSON.stringify(BEISPIELE));
  for (const [rel, text] of Object.entries(inhalt)) schreibe(`content/${rel}`, text);
  for (const [rel, text] of Object.entries(code)) schreibe(`src/lib/${rel}`, text);
  if (build) schreibe('.next/BUILD_ID', 'test-build\n');
  for (const [rel, html] of Object.entries(seiten)) schreibe(`.next/server/app/${rel}`, html);
  return wurzel;
}

const seite = (koerper, kopf = '') =>
  `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Test</title>${kopf}</head><body>${koerper}</body></html>`;

/** Funde einer Prüfung auf einer einzelnen ausgelieferten Seite. */
function seitenFunde(koerper, kennung, kopf = '') {
  const wurzel = werkstatt({ seiten: { 'index.html': seite(koerper, kopf) } });
  return pruefeAlles({ wurzel, nur: [kennung] }).funde.filter((f) => f.quelle === 'ausgeliefert');
}

describe('Ausgelieferter Stand: welche Teile zählen', () => {
  test('Skriptinhalt zählt nicht', () => {
    const funde = seitenFunde('<p>Hallo</p><script>const t = "TODO Platzhalter";</script>', 'platzhalter');
    assert.equal(funde.length, 0);
  });

  test('Strukturdaten (application/ld+json) zählen', () => {
    const funde = seitenFunde('<p>Hallo</p>', 'platzhalter',
      '<script type="application/ld+json">{"name":"Lorem ipsum"}</script>');
    assert.equal(funde.length, 1);
    assert.equal(funde[0].ort, 'Strukturdaten');
  });

  test('alt, title, aria-label und meta content zählen', () => {
    const funde = seitenFunde('<img src="/a.png" alt="TODO Bild"><a href="/x" aria-label="Lorem ipsum">x</a>',
      'platzhalter', '<meta name="description" content="Musterweg 3">');
    const orte = funde.map((f) => f.ort).sort();
    assert.deepEqual(orte, ['Attribut alt', 'Attribut aria-label', 'Attribut content'].sort());
  });

  test('HTML-Kommentare zählen nicht', () => {
    const funde = seitenFunde('<p>Hallo</p><!-- TODO später -->', 'platzhalter');
    assert.equal(funde.length, 0);
  });

  test('Segmente tragen Art und entschlüsselten Text', () => {
    const segs = seitenSegmente('<p>Schl&uuml;ssel &amp; Co</p><script type="application/ld+json">{}</script>');
    assert.ok(segs.some((s) => s.art === 'sichtbarer Text' && s.wert.includes('Schlüssel & Co')));
    assert.ok(segs.some((s) => s.art === 'Strukturdaten'));
  });
});

describe('Prüfung demo', () => {
  test('Fund: Demo als Wort und Beispielname im Stand', () => {
    assert.equal(seitenFunde('<p>Demo Produkte</p>', 'demo').length, 1);
    // Name und Kennung werden einzeln geprüft; der volle Name enthält die Kennung also zweimal
    assert.ok(seitenFunde('<p>Büroschrank und Rollcontainer — Serie MS-01</p>', 'demo').length >= 1);
    assert.equal(seitenFunde('<p>Kennung MS-01 in der Liste</p>', 'demo').length, 1);
  });

  test('Kein Fund: Demografie und Produkte ohne Beispielkennung', () => {
    assert.equal(seitenFunde('<p>Demografie der Kundschaft</p>', 'demo').length, 0);
    assert.equal(seitenFunde('<p>Büroschrank mit Schloss</p>', 'demo').length, 0);
  });
});

describe('Prüfung platzhalter', () => {
  test('Fund: eckige Klammern mit Wort, TODO, Lorem ipsum, Musteradressen, example.com', () => {
    for (const text of ['[Ort]', 'TODO', 'Lorem ipsum dolor', 'Max Mustermann', 'Musterstraße 5', 'example.com', 'Platzhalter', 'Firmendaten sind noch Platzhalter']) {
      assert.ok(seitenFunde(`<p>${text}</p>`, 'platzhalter').length >= 1, `Fund erwartet: ${text}`);
    }
  });

  test('Kein Fund: Muster wie [A-Z] und XXL, normaler Text', () => {
    assert.equal(pruefeText('^[A-Z]{2}[0-9]{3}$', { nur: new Set(['platzhalter']), telefon: new Set(), kerne: new Set(), beispiele: [], demo: false, kontakt: false }).length, 0);
    assert.equal(seitenFunde('<p>XXL Schlüssel für Ihr Auto</p>', 'platzhalter').length, 0);
  });
});

describe('Prüfung alt', () => {
  test('Fund: alte Anschrift, alte Zeiten in Schreibweisen, Öffnungszeiten, nach Foto', () => {
    for (const text of ['Langgasse 70', 'Gloelstraße 4', '09:00 bis 13:00', '9:00 Uhr – 13:00 Uhr',
      '09:00-13:00', '14:00 bis 17:00', 'Öffnungszeiten', 'Schlüssel nach Foto']) {
      assert.ok(seitenFunde(`<p>${text}</p>`, 'alt').length >= 1, `Fund erwartet: ${text}`);
    }
  });

  test('Kein Fund: aktuelle Anschrift und andere Leistung', () => {
    assert.equal(seitenFunde('<p>Langgasse 61, 35576 Wetzlar</p>', 'alt').length, 0);
    assert.equal(seitenFunde('<p>Schlüssel nach Vorlage</p>', 'alt').length, 0);
  });
});

describe('Prüfung kontakt', () => {
  test('Fund: fremde Mailadresse, fremde Rufnummer, fremde Anschrift', () => {
    assert.equal(seitenFunde('<p>kunde@gmail.com</p>', 'kontakt').length, 1);
    assert.equal(seitenFunde('<p>0644 1999 8877</p>', 'kontakt').length, 1);
    assert.equal(seitenFunde('<p>Musterweg 5, 12345 Berlin</p>', 'kontakt').length, 1);
    assert.equal(seitenFunde('<p>Langgasse 70, 35576 Wetzlar</p>', 'kontakt').length, 1);
  });

  test('Kein Fund: Angaben aus settings.json, Dateiendungen, Gemeindeschlüssel', () => {
    assert.equal(seitenFunde('<p>info@schluesselmacher24.de</p>', 'kontakt').length, 0);
    assert.equal(seitenFunde('<p>Ruf an: 06441 8056279</p>', 'kontakt').length, 0);
    assert.equal(seitenFunde('<p>+49 6441 8056279</p>', 'kontakt').length, 0);
    assert.equal(seitenFunde('<p>Rufen Sie uns an: 06441 8056279 24 Stunden erreichbar</p>', 'kontakt').length, 0);
    assert.equal(seitenFunde('<p>Steuer-Nr. 039/863/00160</p>', 'kontakt').length, 0);
    assert.equal(seitenFunde('<p>Ederstraße 2, 35576 Wetzlar</p>', 'kontakt').length, 0);
    assert.equal(seitenFunde('<img src="/icon@2x.png" alt="Logo">', 'kontakt').length, 0);
    assert.equal(seitenFunde('<p>06411000 und 0 0 1000 1444</p>', 'kontakt').length, 0);
  });
});

describe('Prüfung erreichbarkeit', () => {
  test('Fund: Aussagen gegen den Wortlaut des Inhabers', () => {
    for (const text of ['24 Stunden geöffnet', '24h geöffnet', 'rund um die Uhr geöffnet', 'durchgehend geöffnet']) {
      assert.equal(seitenFunde(`<p>${text}</p>`, 'erreichbarkeit').length, 1, text);
    }
  });

  test('Kein Fund: Sätze des Inhabers', () => {
    assert.equal(seitenFunde('<p>24 Stunden erreichbar</p>', 'erreichbarkeit').length, 0);
    assert.equal(seitenFunde('<p>Notdienst rund um die Uhr</p>', 'erreichbarkeit').length, 0);
    assert.equal(seitenFunde('<p>Werkstatt und persönliche Beratung nach Terminvereinbarung</p>', 'erreichbarkeit').length, 0);
  });
});

describe('Quellen Inhalt und Code', () => {
  test('Inhalt: Fund mit Zeigerpfad, startwerte bleiben außen vor', () => {
    const wurzel = werkstatt({
      seiten: { 'index.html': seite('<p>Hallo</p>') },
      inhalt: { 'x.json': JSON.stringify({ abschnitt: { titel: 'TODO bitte' } }),
        'startwerte/alt.json': JSON.stringify({ t: 'Langgasse 70' }) },
    });
    const funde = pruefeAlles({ wurzel, nur: ['platzhalter', 'alt'] }).funde.filter((f) => f.quelle === 'inhalt');
    assert.equal(funde.length, 1);
    assert.equal(funde[0].datei, 'content/x.json');
    assert.equal(funde[0].ort, '.abschnitt.titel');
  });

  test('Code: Zeichenketten zählen, Kommentare und Testdateien nicht', () => {
    const wurzel = werkstatt({
      seiten: { 'index.html': seite('<p>Hallo</p>') },
      code: {
        'pdf/a.ts': '// TODO im Kommentar\n/* Platzhalter im Kommentar */\nconst t = "Platzhalter für Ort";\n',
        'pdf/a.test.ts': 'const t = "TODO im Test";\n',
      },
    });
    const funde = pruefeAlles({ wurzel, nur: ['platzhalter'] }).funde.filter((f) => f.quelle === 'code');
    assert.equal(funde.length, 1);
    assert.equal(funde[0].datei, 'src/lib/pdf/a.ts');
    assert.equal(funde[0].ort, 'Zeile 3');
  });

  test('zeichenketten: URLs mit // bleiben Zeichenkette', () => {
    const z = zeichenketten('const u = "https://schluesselmacher24.de"; // "TODO"\n');
    assert.deepEqual(z.map((x) => x.wert), ['https://schluesselmacher24.de']);
  });
});

describe('Bedienfehler und Ausnahmen', () => {
  test('Fehlender Build ist Bedienfehler, die übrigen Quellen werden trotzdem geprüft', () => {
    const wurzel = werkstatt({ build: false, inhalt: { 'x.json': JSON.stringify({ t: 'TODO' }) } });
    const e = pruefeAlles({ wurzel, nur: ['platzhalter'] });
    assert.equal(e.bedienfehler.length, 1);
    assert.equal(e.quellen.ausgeliefert.status, 'fehlt');
    assert.equal(e.funde.filter((f) => f.quelle === 'inhalt').length, 1);
    assert.equal(exitCodeFuer(e), 2);
  });

  test('Ausnahme mit genauem Fundstück entfernt den Fund; Exit 0', () => {
    const wurzel = werkstatt({
      seiten: { 'index.html': seite('<p>Hallo</p>') },
      inhalt: { 'x.json': JSON.stringify({ t: 'TODO' }) },
    });
    const ausnahmen = [{ pruefung: 'platzhalter', quelle: 'inhalt', datei: 'content/x.json',
      fundstueck: 'TODO', grund: 'Testfall', datum: '2026-11-16' }];
    const e = pruefeAlles({ wurzel, nur: ['platzhalter'], ausnahmen });
    assert.equal(e.funde.length, 0);
    assert.equal(e.ausgenommen.length, 1);
    assert.equal(e.veraltet.length, 0);
    assert.equal(exitCodeFuer(e), 0);
  });

  test('Ausnahme, die nichts mehr trifft, wird als veraltet gemeldet; Exit 1', () => {
    const wurzel = werkstatt({ seiten: { 'index.html': seite('<p>Hallo</p>') } });
    const ausnahmen = [{ pruefung: 'platzhalter', quelle: 'ausgeliefert', datei: '.next/server/app/index.html',
      fundstueck: 'TODO', grund: 'Testfall', datum: '2026-11-16' }];
    const e = pruefeAlles({ wurzel, nur: ['platzhalter'], ausnahmen });
    assert.equal(e.veraltet.length, 1);
    assert.equal(exitCodeFuer(e), 1);
  });

  test('Ausnahme für eine nicht gelaufene Prüfung ist nicht veraltet', () => {
    const wurzel = werkstatt({ seiten: { 'index.html': seite('<p>Hallo</p>') } });
    const ausnahmen = [{ pruefung: 'platzhalter', quelle: 'ausgeliefert', datei: 'x', fundstueck: 'TODO', grund: 'G', datum: '2026-11-16' }];
    const e = pruefeAlles({ wurzel, nur: ['demo'], ausnahmen });
    assert.equal(e.veraltet.length, 0);
  });

  test('ladeAusnahmen weist Einträge ohne Grund ab', () => {
    const wurzel = werkstatt();
    const datei = path.join(wurzel, 'ausnahmen.json');
    writeFileSync(datei, JSON.stringify([{ pruefung: 'alt', quelle: 'code', datei: 'x', fundstueck: 'y', datum: '2026-11-16' }]));
    assert.throws(() => ladeAusnahmen(datei), /grund/);
  });
});

describe('Hilfsfunktionen Telefon', () => {
  test('telefonKuerzen lässt einzelne Ziffernbündel nach der Nummer weg', () => {
    assert.equal(telefonKuerzen('06441 8056279 24'), '06441 8056279');
  });

  test('telefonZiffern normalisiert +49 und 0049 zur 0', () => {
    assert.equal(telefonZiffern('+49 6441 8056279'), '064418056279');
    assert.equal(telefonZiffern('0049 6441 8056279'), '064418056279');
    assert.equal(telefonZiffern('06441 8056279'), '064418056279');
  });

  test('telefonZiffern entfernt „(0)“ nach +49', () => {
    assert.equal(telefonZiffern('+49 (0) 30 1234567'), '0301234567');
  });

  test('telefonKuerzen zählt die Vorwahl nicht mit: 0049 und +49 (0) bleiben vollständig', () => {
    assert.equal(telefonKuerzen('0049 30 12345678'), '0049 30 12345678');
    assert.equal(telefonKuerzen('+49 (0) 30 1234567'), '+49 (0) 30 1234567');
  });
});

describe('Nachbesserung: Telefon in Auslandsschreibweise', () => {
  test('Fund: 0049 und +49 (0) mit fremder Nummer', () => {
    for (const text of ['0049 30 12345678', '0049 641 1234567', '0049-6441-1234567', '+49 (0) 30 1234567']) {
      assert.equal(seitenFunde(`<p>${text}</p>`, 'kontakt').length, 1, text);
    }
  });

  test('Kein Fund: eigene Nummer in +49 (0)-Schreibweise', () => {
    assert.equal(seitenFunde('<p>+49 (0) 6441 8056279</p>', 'kontakt').length, 0);
  });

  test('Fund: ausländische Nummern wie +43 1 234567890', () => {
    assert.equal(seitenFunde('<p>+43 1 234567890</p>', 'kontakt').length, 1);
    assert.equal(seitenFunde('<p>0043 1 234567890</p>', 'kontakt').length, 1);
  });
});

describe('Nachbesserung: Uhrzeiten ohne Minuten', () => {
  test('Fund: „9 bis 13 Uhr“, „Mo–Fr 9–13 Uhr“, „14 bis 17 Uhr“', () => {
    for (const text of ['9 bis 13 Uhr', 'Mo–Fr 9–13 Uhr', '14 bis 17 Uhr', '14–17 Uhr']) {
      assert.ok(seitenFunde(`<p>${text}</p>`, 'alt').length >= 1, `Fund erwartet: ${text}`);
    }
  });

  test('Kein Fund: andere Zeiten', () => {
    assert.equal(seitenFunde('<p>Ab 9 Uhr bis 18 Uhr</p>', 'alt').length, 0);
    assert.equal(seitenFunde('<p>Vom 9 bis 13 Mai</p>', 'alt').length, 0);
  });
});

describe('Nachbesserung: Platzhalter in Klammern und Wortform', () => {
  test('Fund: [PLZ], [ort], [Name, Ort], Platzhaltertext', () => {
    for (const text of ['[PLZ]', '[ort]', '[Name, Ort]', 'Platzhaltertext', 'Platzhaltern']) {
      assert.ok(seitenFunde(`<p>${text}</p>`, 'platzhalter').length >= 1, `Fund erwartet: ${text}`);
    }
  });

  test('Kein Fund: Muster wie [A-Z] oder [0-9] in der Ausgabe', () => {
    assert.equal(seitenFunde('<p>Code [A-Z] und [0-9]</p>', 'platzhalter').length, 0);
  });

  test('Kein Fund: Zugriff im Code wie ART_LABEL[art] in einer Zeichenkette', () => {
    const wurzel = werkstatt({ seiten: { 'index.html': seite('<p>Hallo</p>') },
      code: { 'vorlagen/a.ts': 'const t = `${ART_LABEL[art]} ist eingegangen`;\n' } });
    const funde = pruefeAlles({ wurzel, nur: ['platzhalter'] }).funde.filter((f) => f.quelle === 'code');
    assert.equal(funde.length, 0);
  });
});

describe('Nachbesserung: Demo-Wörter und Beispielartikel', () => {
  test('Kein Fund: Demontage, demontieren', () => {
    assert.equal(seitenFunde('<p>Demontage des Zylinders</p>', 'demo').length, 0);
    assert.equal(seitenFunde('<p>Schloss-Demontage</p>', 'demo').length, 0);
    assert.equal(seitenFunde('<p>Zylinder demontieren</p>', 'demo').length, 0);
  });

  test('Fund: Beispielartikel mit „(Beispiel)“', () => {
    assert.equal(seitenFunde('<p>Schlüssel nachmachen (Beispiel)</p>', 'demo').length, 1);
  });
});

describe('Nachbesserung: Anschrift mit Postleitzahl', () => {
  test('Fund: fremde Postleitzahl bei Firmenstraße', () => {
    assert.equal(seitenFunde('<p>Langgasse 61, 99999 Berlin</p>', 'kontakt').length, 1);
  });

  test('Fund: Anschrift mit „in“ zwischen Hausnummer und Postleitzahl', () => {
    assert.equal(seitenFunde('<p>Hauptstraße 5 in 35576 Wetzlar</p>', 'kontakt').length, 1);
  });

  test('Kein Fund: Firmenanschrift mit richtiger Postleitzahl', () => {
    assert.equal(seitenFunde('<p>Langgasse 61, 35576 Wetzlar</p>', 'kontakt').length, 0);
  });
});

describe('Nachbesserung: Umgebung und Ausnahmen mit Feld ort', () => {
  test('Umgebung: 30 Zeichen links und rechts vom Fundstück', () => {
    // Bindestriche als Füllung, damit „TODO“ als eigenes Wort gilt
    const links = '-'.repeat(40);
    const rechts = '+'.repeat(40);
    const wurzel = werkstatt({ seiten: { 'index.html': seite('<p>Hallo</p>') },
      inhalt: { 'x.json': JSON.stringify({ t: `${links}TODO${rechts}` }) } });
    const f = pruefeAlles({ wurzel, nur: ['platzhalter'] }).funde.find((x) => x.quelle === 'inhalt');
    assert.equal(f.umgebung, `${'-'.repeat(30)}TODO${'+'.repeat(30)}`);
  });

  test('Ausnahme mit Feld ort trifft nur die genannte Stelle', () => {
    const wurzel = werkstatt({ seiten: { 'index.html': seite('<p>Hallo</p>') },
      inhalt: { 'x.json': JSON.stringify({ t: 'TODO', u: 'TODO' }) } });
    const ausnahmen = [{ pruefung: 'platzhalter', quelle: 'inhalt', datei: 'content/x.json',
      fundstueck: 'TODO', ort: '.u', grund: 'Testfall', datum: '2026-11-16' }];
    const e = pruefeAlles({ wurzel, nur: ['platzhalter'], ausnahmen });
    assert.equal(e.ausgenommen.length, 1);
    assert.equal(e.ausgenommen[0].ort, '.u');
    assert.equal(e.funde.length, 1);
    assert.equal(e.funde[0].ort, '.t');
    assert.equal(e.warnungen.length, 0);
  });

  test('Ausnahme ohne Feld ort, die mehrere Stellen trifft, wird gemeldet', () => {
    const wurzel = werkstatt({ seiten: { 'index.html': seite('<p>Hallo</p>') },
      inhalt: { 'x.json': JSON.stringify({ t: 'TODO', u: 'TODO' }) } });
    const ausnahmen = [{ pruefung: 'platzhalter', quelle: 'inhalt', datei: 'content/x.json',
      fundstueck: 'TODO', grund: 'Testfall', datum: '2026-11-16' }];
    const e = pruefeAlles({ wurzel, nur: ['platzhalter'], ausnahmen });
    assert.equal(e.funde.length, 0);
    assert.equal(e.warnungen.length, 1);
    assert.equal(exitCodeFuer(e), 0);
  });

  test('ladeAusnahmen weist leeres Feld ort ab', () => {
    const wurzel = werkstatt();
    const datei = path.join(wurzel, 'ausnahmen.json');
    writeFileSync(datei, JSON.stringify([{ pruefung: 'alt', quelle: 'code', datei: 'x', fundstueck: 'y', ort: ' ', grund: 'G', datum: '2026-11-16' }]));
    assert.throws(() => ladeAusnahmen(datei), /ort/);
  });
});
