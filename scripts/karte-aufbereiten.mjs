#!/usr/bin/env node
// Kartendaten Hessen: vereinfachte Formen der Kreise und Gemeinden aus der
// BKG-Datei VG250, Stand 01.01.2026 (GeoPackage, Tabellen vg250_krs und vg250_gem).
//
//   node scripts/karte-aufbereiten.mjs [pfad-zur-gpkg]
//
// Ohne Argument wird die einzige .gpkg-Datei unter
// _werkstatt/ausbau/daten/geo/vg250/entpackt/ verwendet. Die Rohdaten bleiben dort
// und gehören nicht ins Repository. Ausgabe: content/karte/hessen-kreise.json und
// content/karte/hessen-gemeinden.json. Lizenz und Quellenvermerk: content/karte/LIZENZ.md.
//
// Verfahren: Die UTM-Koordinaten werden linear in Bildkoordinaten umgerechnet (Breite 1000,
// Norden oben) und auf 0,1 Einheiten gerundet. Jeder Ring wird mit Douglas-Peucker vereinfacht.
// Grenzen, die zwei Ringe teilen, werden je Bogen einmal vereinfacht und in beiden Ringen
// verwendet, damit zwischen Nachbarn keine Lücke entsteht. Ringe unter 2 Einheiten Fläche
// (in vereinfachter Form) entfallen.

import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENTPACKT = join(WURZEL, '_werkstatt/ausbau/daten/geo/vg250/entpackt');
const AUSGABE = join(WURZEL, 'content/karte');

const STAND = '2026-01-01';
const LAND = '06';
const BREITE = 1000;
const QUANT = 10; // Quantisierung auf 0,1 Einheiten
const TOLERANZ = { kreise: 1.0, gemeinden: 0.6 }; // Einheiten
const MIN_FLAECHE = 2; // Einheiten
const GROESSE_MAX = { 'hessen-kreise.json': 120000, 'hessen-gemeinden.json': 450000 }; // Bytes
const SOLL = { kreise: 27, landkreise: 21, kreisfreie: 6, gemeinden: 421, gemeindefrei: 4, lahnDill: 23 };

const QUELLE = [
  '© BKG (2026) dl-de/by-2-0, Datenquellen: https://sgx.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_vg_nuts.pdf.',
  'BKG: https://www.bkg.bund.de. dl-de/by-2-0: https://www.govdata.de/dl-de/by-2-0.',
  'Statistische Schlüssel: © Daten (im Auftrag der Herausgebergemeinschaft Statistische Ämter des Bundes und der Länder) Statistisches Bundesamt (Destatis), 2026.',
  'Geometrien vereinfacht und in Bildkoordinaten umgerechnet.',
].join(' ');

const ART_KREIS = new Map([
  ['Landkreis', 'Landkreis'],
  ['Kreisfreie Stadt', 'kreisfreie Stadt'],
]);
const ART_GEMEINDE = new Map([
  ['Stadt', 'Stadt'],
  ['Gemeinde', 'Gemeinde'],
  ['Gemeindefreies Gebiet', 'gemeindefrei'],
]);

// ---------- GeoPackage-Geometrie: Kopf "GP", danach WKB (Polygon 3, MultiPolygon 6, 2D) ----------
function leseWkb(dv, off) {
  const le = dv.getUint8(off) === 1;
  const typ = dv.getUint32(off + 1, le);
  off += 5;
  if (typ === 3) {
    const nRinge = dv.getUint32(off, le);
    off += 4;
    const ringe = [];
    for (let r = 0; r < nRinge; r++) {
      const n = dv.getUint32(off, le);
      off += 4;
      const ring = new Array(n);
      for (let i = 0; i < n; i++) {
        ring[i] = [dv.getFloat64(off, le), dv.getFloat64(off + 8, le)];
        off += 16;
      }
      ringe.push(ring);
    }
    return { polygone: [ringe], off };
  }
  if (typ === 6) {
    const nPoly = dv.getUint32(off, le);
    off += 4;
    const polygone = [];
    for (let p = 0; p < nPoly; p++) {
      const teil = leseWkb(dv, off);
      polygone.push(...teil.polygone);
      off = teil.off;
    }
    return { polygone, off };
  }
  throw new Error(`Geometrietyp ${typ} wird nicht unterstützt (erwartet Polygon 3 oder MultiPolygon 6)`);
}

function leseGeometrie(bytes) {
  if (bytes[0] !== 0x47 || bytes[1] !== 0x50) throw new Error('Geometrie ohne GeoPackage-Kopf GP');
  const flags = bytes[3];
  const huelle = [0, 32, 48, 48, 64][(flags >> 1) & 0x07];
  if (huelle === undefined) throw new Error('Unbekannte Hüllkennung im GeoPackage-Kopf');
  if ((flags >> 4) & 1) return [];
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return leseWkb(dv, 8 + huelle).polygone;
}

function ladeEbene(db, tabelle, artKarte, muster) {
  const zeilen = db
    .prepare(`SELECT AGS, GEN, BEZ, geom FROM ${tabelle} WHERE SN_L = ? ORDER BY AGS`)
    .all(LAND);
  let angepasst = 0;
  const eintraege = zeilen.map((z) => {
    if (!muster.test(z.AGS)) throw new Error(`${tabelle}: unerwarteter Schlüssel ${z.AGS}`);
    const art = artKarte.get(z.BEZ);
    if (!art) throw new Error(`${tabelle}: unbekannte Bezeichnung ${z.BEZ} bei ${z.AGS}`);
    if (typeof z.GEN !== 'string' || z.GEN.length === 0) throw new Error(`${tabelle}: Name fehlt bei ${z.AGS}`);
    const name = z.GEN.normalize('NFC').trim();
    if (name !== z.GEN) angepasst++;
    const bytes = z.geom instanceof Uint8Array ? z.geom : new Uint8Array(z.geom);
    return { ags: z.AGS, name, art, polygone: leseGeometrie(bytes) };
  });
  return { eintraege, angepasst };
}

function findeGpkg(arg) {
  if (arg) return resolve(arg);
  if (!existsSync(ENTPACKT)) throw new Error(`Ordner fehlt: ${ENTPACKT}`);
  const treffer = [];
  const suche = (ordner, tiefe) => {
    for (const e of readdirSync(ordner, { withFileTypes: true })) {
      const p = join(ordner, e.name);
      if (e.isDirectory() && tiefe < 3) suche(p, tiefe + 1);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.gpkg')) treffer.push(p);
    }
  };
  suche(ENTPACKT, 0);
  if (treffer.length !== 1) {
    throw new Error(`Erwartet genau eine .gpkg-Datei unter ${ENTPACKT}, gefunden: ${treffer.length}`);
  }
  return treffer[0];
}

// ---------- Geometrie in Bildkoordinaten (Zehntel-Einheiten als ganze Zahlen) ----------
function bereinige(pts) {
  const out = [];
  for (const p of pts) {
    const l = out[out.length - 1];
    if (!l || l[0] !== p[0] || l[1] !== p[1]) out.push(p);
  }
  while (out.length > 1 && out[0][0] === out[out.length - 1][0] && out[0][1] === out[out.length - 1][1]) out.pop();
  return out;
}

function flaecheEinh(pts) {
  let s = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return Math.abs(s) / 2 / (QUANT * QUANT);
}

function abstand2(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  let t = l2 === 0 ? 0 : ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const x = a[0] + t * dx - p[0];
  const y = a[1] + t * dy - p[1];
  return x * x + y * y;
}

// Douglas-Peucker mit festen Endpunkten
function dp(pts, tol) {
  const n = pts.length;
  if (n <= 2) return pts.slice();
  const behalten = new Uint8Array(n);
  behalten[0] = 1;
  behalten[n - 1] = 1;
  const t2 = tol * tol;
  const stapel = [[0, n - 1]];
  while (stapel.length > 0) {
    const [a, b] = stapel.pop();
    let max = -1;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = abstand2(pts[i], pts[a], pts[b]);
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (idx > 0 && max > t2) {
      behalten[idx] = 1;
      stapel.push([a, idx], [idx, b]);
    }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (behalten[i]) out.push(pts[i]);
  return out;
}

// Geschlossener Bogen (Anfang gleich Ende): Teilung am weitesten entfernten Punkt
function schlaufeVereinfachen(pts, tol) {
  const a = pts[0];
  let max = -1;
  let idx = 1;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = (pts[i][0] - a[0]) ** 2 + (pts[i][1] - a[1]) ** 2;
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  const links = dp(pts.slice(0, idx + 1), tol);
  const rechts = dp(pts.slice(idx), tol);
  return links.concat(rechts.slice(1));
}

// Vereinfacht alle Ringe einer Ebene. Gemeinsame Bögen werden einmal vereinfacht.
// Rückgabe: rings[i] = vereinfachte Punkte oder null (entfallen), bogen = Anzahl Bögen.
function vereinfache(ringe, tolQ) {
  const vk = (p) => p[0] * 1000000 + p[1];
  const kante = (a, b) => (a < b ? a + ',' + b : b + ',' + a);
  const kantenRinge = new Map();
  const grad = new Map();
  ringe.forEach((ring, ri) => {
    const K = ring.pts.map(vk);
    ring.K = K;
    const n = K.length;
    for (let i = 0; i < n; i++) {
      const a = K[i];
      const b = K[(i + 1) % n];
      const k = kante(a, b);
      let liste = kantenRinge.get(k);
      if (!liste) {
        liste = [];
        kantenRinge.set(k, liste);
        grad.set(a, (grad.get(a) || 0) + 1);
        grad.set(b, (grad.get(b) || 0) + 1);
      }
      if (liste[liste.length - 1] !== ri) liste.push(ri);
    }
  });

  // Knoten: Grad ungleich 2, oder die Nachbarringe wechseln an dieser Stelle
  for (const ring of ringe) {
    const K = ring.K;
    const n = K.length;
    const J = [];
    for (let i = 0; i < n; i++) {
      const vor = kantenRinge.get(kante(K[(i - 1 + n) % n], K[i])).join(',');
      const nach = kantenRinge.get(kante(K[i], K[(i + 1) % n])).join(',');
      if (grad.get(K[i]) !== 2 || vor !== nach) J.push(i);
    }
    ring.J = J.length > 0 ? J : [0];
  }

  // Bögen zwischen Knoten, je Richtung einmal gespeichert
  const bogen = [];
  const bogenIndex = new Map();
  for (const ring of ringe) {
    const K = ring.K;
    const n = K.length;
    const J = ring.J;
    const k = J.length;
    ring.verweise = [];
    for (let m = 0; m < k; m++) {
      const s = J[m];
      const e = m + 1 < k ? J[m + 1] : J[0] + n;
      const pos = [];
      for (let p = s; p <= e; p++) pos.push(p % n);
      const vs = pos.map((p) => K[p]);
      const fwd = vs.join(';');
      const rev = vs.slice().reverse().join(';');
      const umkehr = fwd > rev;
      const kanon = umkehr ? rev : fwd;
      let bi = bogenIndex.get(kanon);
      if (bi === undefined) {
        const pts = pos.map((p) => ring.pts[p]);
        bi = bogen.length;
        bogenIndex.set(kanon, bi);
        bogen.push({ pts: umkehr ? pts.reverse() : pts, schlaufe: vs[0] === vs[vs.length - 1], n: 0 });
      }
      bogen[bi].n += 1;
      ring.verweise.push({ bi, umkehr });
    }
  }
  for (const b of bogen) b.S = b.schlaufe ? schlaufeVereinfachen(b.pts, tolQ) : dp(b.pts, tolQ);

  const rings = ringe.map((ring) => {
    const out = [];
    ring.verweise.forEach((v, m) => {
      const seq = bogen[v.bi].S;
      const folge = v.umkehr ? seq.slice().reverse() : seq;
      for (let j = m === 0 ? 0 : 1; j < folge.length; j++) out.push(folge[j]);
    });
    const sauber = bereinige(out);
    if (sauber.length < 3) return null;
    // Die Schwelle gilt für die vereinfachte Form, die gezeichnet wird
    if (flaecheEinh(sauber) < MIN_FLAECHE) return null;
    return sauber;
  });
  return { rings, bogen: bogen.length, geteilt: bogen.filter((b) => b.n >= 2).length };
}

// Ist (x, y) innerhalb der Ringe (gerade Parität über alle Ringe der Fläche)?
function innen(x, y, ringe) {
  let drin = false;
  for (const r of ringe) {
    const n = r.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = r[i];
      const [xj, yj] = r[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) drin = !drin;
    }
  }
  return drin;
}

// Beschriftungspunkt: Schwerpunkt des größten Rings, sonst breiteste innere Strecke
function mitte(ringe) {
  let gross = ringe[0];
  let grossFl = -1;
  for (const r of ringe) {
    const f = flaecheEinh(r);
    if (f > grossFl) {
      grossFl = f;
      gross = r;
    }
  }
  let sx = 0;
  let sy = 0;
  let a = 0;
  const n = gross.length;
  for (let i = 0; i < n; i++) {
    const p = gross[i];
    const q = gross[(i + 1) % n];
    const c = p[0] * q[1] - q[0] * p[1];
    a += c;
    sx += (p[0] + q[0]) * c;
    sy += (p[1] + q[1]) * c;
  }
  if (a !== 0) {
    const cx = Math.round(sx / (3 * a));
    const cy = Math.round(sy / (3 * a));
    if (innen(cx, cy, ringe)) return [cx, cy];
  }
  let minY = Infinity;
  let maxY = -Infinity;
  for (const r of ringe) {
    for (const p of r) {
      if (p[1] < minY) minY = p[1];
      if (p[1] > maxY) maxY = p[1];
    }
  }
  let beste = null;
  const N = 400;
  for (let k = 0; k < N; k++) {
    const y = minY + ((k + 0.5) * (maxY - minY)) / N;
    const xs = [];
    for (const r of ringe) {
      const m = r.length;
      for (let i = 0, j = m - 1; i < m; j = i++) {
        const [xi, yi] = r[i];
        const [xj, yj] = r[j];
        if ((yi > y) !== (yj > y)) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi));
      }
    }
    xs.sort((p, q) => p - q);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const breite = xs[i + 1] - xs[i];
      if (!beste || breite > beste.breite) beste = { breite, x: (xs[i] + xs[i + 1]) / 2, y };
    }
  }
  if (!beste) throw new Error('Kein Beschriftungspunkt gefunden');
  const px = Math.round(beste.x);
  const py = Math.round(beste.y);
  if (!innen(px, py, ringe)) throw new Error('Beschriftungspunkt liegt nicht innerhalb der Fläche');
  return [px, py];
}

const fmt = (q) => String(q / QUANT);
// Muster eines Pfads: "M x y L x y ... Z", mehrere Ringe hintereinander
const PFAD = /^M [\d.]+ [\d.]+(?: L [\d.]+ [\d.]+)+ Z(?: M [\d.]+ [\d.]+(?: L [\d.]+ [\d.]+)+ Z)*$/;

function pfad(ringe) {
  return ringe.map((r) => 'M ' + r.map((p) => fmt(p[0]) + ' ' + fmt(p[1])).join(' L ') + ' Z').join(' ');
}

function baueEbene(name, eintraege, tol, alsQ) {
  const ringe = [];
  let roh = 0;
  let zuKlein = 0;
  let punkteVor = 0;
  eintraege.forEach((e, fi) => {
    e.ringe = [];
    for (const poly of e.polygone) {
      for (const ring of poly) {
        roh++;
        const pts = bereinige(ring.map(alsQ));
        if (pts.length < 3) {
          zuKlein++;
          continue;
        }
        punkteVor += pts.length;
        ringe.push({ fi, pts });
      }
    }
  });
  const erg = vereinfache(ringe, tol * QUANT);
  let verworfen = 0;
  let punkteNach = 0;
  ringe.forEach((r, i) => {
    const pts = erg.rings[i];
    if (pts === null) {
      verworfen++;
      return;
    }
    punkteNach += pts.length;
    eintraege[r.fi].ringe.push(pts);
  });
  for (const e of eintraege) {
    if (e.ringe.length === 0) throw new Error(`${name}: ${e.ags} ohne Fläche nach der Vereinfachung`);
    e.d = pfad(e.ringe);
    e.mq = mitte(e.ringe);
  }
  return { roh, zuKlein, verworfen, punkteVor, punkteNach, bogen: erg.bogen, geteilt: erg.geteilt };
}

function jsonText(eintraege, viewBox) {
  const kopf =
    `{\n  "quelle": ${JSON.stringify(QUELLE)},\n  "stand": ${JSON.stringify(STAND)},\n` +
    `  "viewBox": ${JSON.stringify(viewBox)},\n  "eintraege": [\n`;
  return kopf + eintraege.map((e) => '    ' + JSON.stringify(e)).join(',\n') + '\n  ]\n}\n';
}

function selbsttest(kreise, gemeinden, layers, hoehe, groessen) {
  const fehler = [];
  let anzahl = 0;
  const pruef = (ok, text) => {
    anzahl++;
    if (!ok) fehler.push(text);
  };
  pruef(kreise.length === SOLL.kreise, `Kreise: ${kreise.length} statt ${SOLL.kreise}`);
  pruef(kreise.filter((k) => k.art === 'Landkreis').length === SOLL.landkreise, 'Landkreise abweichend');
  pruef(kreise.filter((k) => k.art === 'kreisfreie Stadt').length === SOLL.kreisfreie, 'kreisfreie Städte abweichend');
  pruef(gemeinden.length === SOLL.gemeinden + SOLL.gemeindefrei, `Gemeindeflächen: ${gemeinden.length}`);
  pruef(gemeinden.filter((g) => g.art === 'gemeindefrei').length === SOLL.gemeindefrei, 'gemeindefreie Gebiete abweichend');
  pruef(gemeinden.filter((g) => g.art !== 'gemeindefrei').length === SOLL.gemeinden, 'Städte und Gemeinden abweichend');
  const lahnDill = gemeinden.filter((g) => g.kreis === '06532');
  pruef(lahnDill.length === SOLL.lahnDill, `Lahn-Dill-Kreis: ${lahnDill.length} Kommunen`);
  const wetzlar = gemeinden.find((g) => g.ags === '06532023');
  pruef(Boolean(wetzlar) && wetzlar.name === 'Wetzlar' && wetzlar.kreis === '06532', 'Wetzlar 06532023 fehlt oder falsch');
  const kreisSchl = new Set(kreise.map((k) => k.ags));
  pruef(kreisSchl.size === kreise.length, 'doppelte Kreisschlüssel');
  pruef(new Set(gemeinden.map((g) => g.ags)).size === gemeinden.length, 'doppelte Gemeindeschlüssel');
  pruef(gemeinden.every((g) => kreisSchl.has(g.kreis)), 'Gemeinde ohne bekannten Kreis');
  for (const e of [...kreise, ...gemeinden]) {
    pruef(PFAD.test(e.d), `Pfad ${e.ags} ungültig`);
    pruef(e.name.length > 0, `Name leer bei ${e.ags}`);
    pruef(
      e.mitte.every(Number.isFinite) && e.mitte[0] >= 0 && e.mitte[0] <= BREITE && e.mitte[1] >= 0 && e.mitte[1] <= hoehe,
      `Beschriftungspunkt ${e.ags} außerhalb der viewBox`,
    );
  }
  for (const L of layers) {
    for (const e of L) pruef(innen(e.mq[0], e.mq[1], e.ringe), `Beschriftungspunkt ${e.ags} nicht in der Fläche`);
  }
  for (const [datei, bytes] of Object.entries(groessen)) {
    pruef(bytes <= GROESSE_MAX[datei], `${datei}: ${bytes} Byte über der Grenze ${GROESSE_MAX[datei]}`);
  }
  return { fehler, anzahl };
}

function main() {
  const gpkg = findeGpkg(process.argv[2]);
  const sha = createHash('sha256').update(readFileSync(gpkg)).digest('hex');
  const db = new DatabaseSync(gpkg, { readOnly: true });
  for (const t of ['vg250_krs', 'vg250_gem']) {
    const zeile = db.prepare('SELECT srs_id FROM gpkg_contents WHERE table_name = ?').get(t);
    if (!zeile || zeile.srs_id !== 25832) throw new Error(`${t}: Koordinatensystem ist nicht EPSG:25832`);
  }
  const krs = ladeEbene(db, 'vg250_krs', ART_KREIS, /^06\d{3}$/);
  const gem = ladeEbene(db, 'vg250_gem', ART_GEMEINDE, /^06\d{6}$/);
  db.close();
  const kreiseRoh = krs.eintraege;
  const gemRoh = gem.eintraege;

  // Zahlen der Quelle vor jeder Ausgabe gegen die Erwartung prüfen
  const zaehl = (liste, art) => liste.filter((e) => e.art === art).length;
  const quellPruefung = [
    [kreiseRoh.length, SOLL.kreise, 'Kreise'],
    [zaehl(kreiseRoh, 'Landkreis'), SOLL.landkreise, 'Landkreise'],
    [zaehl(kreiseRoh, 'kreisfreie Stadt'), SOLL.kreisfreie, 'kreisfreie Städte'],
    [gemRoh.length, SOLL.gemeinden + SOLL.gemeindefrei, 'Gemeindeflächen'],
    [zaehl(gemRoh, 'gemeindefrei'), SOLL.gemeindefrei, 'gemeindefreie Gebiete'],
    [gemRoh.filter((e) => e.art !== 'gemeindefrei').length, SOLL.gemeinden, 'Städte und Gemeinden'],
    [gemRoh.filter((e) => e.ags.startsWith('06532')).length, SOLL.lahnDill, 'Kommunen Lahn-Dill-Kreis'],
  ];
  const abweichung = quellPruefung.filter(([ist, soll]) => ist !== soll);
  if (abweichung.length > 0) {
    throw new Error('Quelle weicht ab: ' + abweichung.map(([i, s, t]) => `${t} ist ${i}, erwartet ${s}`).join('; '));
  }

  // Gemeinsamer Maßstab für beide Ebenen aus dem Gesamtumfang
  let minE = Infinity;
  let maxE = -Infinity;
  let minN = Infinity;
  let maxN = -Infinity;
  for (const e of [...kreiseRoh, ...gemRoh]) {
    for (const poly of e.polygone) {
      for (const ring of poly) {
        for (const [x, y] of ring) {
          if (x < minE) minE = x;
          if (x > maxE) maxE = x;
          if (y < minN) minN = y;
          if (y > maxN) maxN = y;
        }
      }
    }
  }
  const skal = BREITE / (maxE - minE);
  const hoehe = Math.ceil((maxN - minN) * skal * 10) / 10;
  const alsQ = ([x, y]) => [Math.round((x - minE) * skal * QUANT), Math.round((maxN - y) * skal * QUANT)];
  const viewBox = `0 0 ${BREITE} ${hoehe}`;

  const kreise = baueEbene('Kreise', kreiseRoh, TOLERANZ.kreise, alsQ);
  const gemeinden = baueEbene('Gemeinden', gemRoh, TOLERANZ.gemeinden, alsQ);

  const kreiseEint = kreiseRoh.map((e) => ({
    ags: e.ags,
    name: e.name,
    art: e.art,
    d: e.d,
    mitte: [e.mq[0] / QUANT, e.mq[1] / QUANT],
  }));
  const gemEint = gemRoh.map((e) => ({
    ags: e.ags,
    name: e.name,
    art: e.art,
    kreis: e.ags.slice(0, 5),
    d: e.d,
    mitte: [e.mq[0] / QUANT, e.mq[1] / QUANT],
  }));

  const texte = {
    'hessen-kreise.json': jsonText(kreiseEint, viewBox),
    'hessen-gemeinden.json': jsonText(gemEint, viewBox),
  };
  const groessen = {};
  for (const [datei, text] of Object.entries(texte)) groessen[datei] = Buffer.byteLength(text, 'utf8');

  const pruefung = selbsttest(kreiseEint, gemEint, [kreiseRoh, gemRoh], hoehe, groessen);
  if (pruefung.fehler.length > 0) {
    throw new Error('Selbsttest fehlgeschlagen: ' + pruefung.fehler.join('; '));
  }

  mkdirSync(AUSGABE, { recursive: true });
  for (const [datei, text] of Object.entries(texte)) writeFileSync(join(AUSGABE, datei), text, 'utf8');
  for (const datei of Object.keys(texte)) {
    const zurueck = JSON.parse(readFileSync(join(AUSGABE, datei), 'utf8'));
    if (zurueck.viewBox !== viewBox || !Array.isArray(zurueck.eintraege)) throw new Error(`${datei}: Gegenprobe fehlgeschlagen`);
  }

  const teilZeile = (name, k, anz) =>
    `${name}: ${anz} Einträge, Ringe in Quelle ${k.roh}, zu klein ${k.zuKlein}, unter 2 Einheiten entfallen ${k.verworfen}, ` +
    `Punkte ${k.punkteVor} zu ${k.punkteNach}, Bögen ${k.bogen} (gemeinsam ${k.geteilt})`;
  console.log(`Quelle: ${gpkg}`);
  console.log(`SHA-256 GeoPackage: ${sha}`);
  console.log(`Maßstab: ${BREITE} Einheiten breit, viewBox ${viewBox}, 1 Einheit = ${(1 / skal / 1000).toFixed(1)} km`);
  console.log(`Kreise: ${kreiseEint.length} (${zaehl(kreiseRoh, 'Landkreis')} Landkreise, ${zaehl(kreiseRoh, 'kreisfreie Stadt')} kreisfreie Städte)`);
  console.log(teilZeile('Kreise (Toleranz 1,0)', kreise, kreiseEint.length));
  console.log(teilZeile('Gemeinden (Toleranz 0,6)', gemeinden, gemEint.length));
  console.log(`Namen mit Normalisierung (NFC, Leerraum): Kreise ${krs.angepasst}, Gemeinden ${gem.angepasst}`);
  for (const [datei, b] of Object.entries(groessen)) console.log(`${datei}: ${b} Byte (Grenze ${GROESSE_MAX[datei]})`);
  console.log(`Selbsttest bestanden: ${pruefung.anzahl} Prüfungen`);
}

try {
  main();
} catch (err) {
  console.error(`karte-aufbereiten: ${err.message}`);
  process.exitCode = 1;
}
