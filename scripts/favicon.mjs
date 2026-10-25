#!/usr/bin/env node
/**
 * Erzeugt src/app/favicon.ico aus src/app/icon.svg — 16, 32 und 48 px
 * als PNG im ICO-Container (von allen aktuellen Browsern unterstützt).
 * Nur nötig, wenn sich icon.svg ändert:
 *
 *   node scripts/favicon.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const root = process.cwd();
const svg = readFileSync(path.join(root, 'src/app/icon.svg'));
const groessen = [16, 32, 48];

const bilder = await Promise.all(
  groessen.map((groesse) => sharp(svg, { density: 72 * (groesse / 32) * 4 }).resize(groesse, groesse).png().toBuffer()),
);

// ICONDIR (6 Byte) + je Bild ein ICONDIRENTRY (16 Byte), danach die PNG-Daten.
const kopf = Buffer.alloc(6);
kopf.writeUInt16LE(0, 0);
kopf.writeUInt16LE(1, 2);
kopf.writeUInt16LE(bilder.length, 4);

let versatz = 6 + 16 * bilder.length;
const eintraege = bilder.map((bild, i) => {
  const eintrag = Buffer.alloc(16);
  eintrag.writeUInt8(groessen[i] % 256, 0);
  eintrag.writeUInt8(groessen[i] % 256, 1);
  eintrag.writeUInt8(0, 2);
  eintrag.writeUInt8(0, 3);
  eintrag.writeUInt16LE(1, 4);
  eintrag.writeUInt16LE(32, 6);
  eintrag.writeUInt32LE(bild.length, 8);
  eintrag.writeUInt32LE(versatz, 12);
  versatz += bild.length;
  return eintrag;
});

const ziel = path.join(root, 'src/app/favicon.ico');
writeFileSync(ziel, Buffer.concat([kopf, ...eintraege, ...bilder]));
console.log(`favicon.ico geschrieben (${groessen.join(', ')} px): ${path.relative(root, ziel)}`);
