# Nachtschicht — Fortschritt

Plan: `/Users/umurey/.claude/plans/guck-mal-ich-m-chte-validated-bumblebee.md`
Branch: `nacht/shop-und-design` · Sicherung Bot-Branches: `~/sm24-bot-branches-2026-09-23.bundle` (110 Refs)

Gate je Commit: `npm run typecheck && npm run lint && npm test` · je Paket zusätzlich `npm run build`

| Paket | Inhalt | Status | Letzter grüner Commit |
|---|---|---|---|
| 0 | Einrichtung | fertig | 64429c9 |
| 1 | Payload-Probelauf (Entscheidung A/B) | fertig — **Pfad A** | c5cea73 |
| 2 | Sicherheit, Aufräumen, Ernte, Design-Verträge (CP1) | fertig | 55ece02 |
| 3 | Payload-Modell, Seed, Datenschicht (CP2) | fertig | (siehe git log) |
| 4 | Bestellungen, Termine, Artikel, Richtwerte (CP3) | offen | — |
| 5 | Stripe, Visual-Einbau, E2E (CP4) | offen | — |
| 6 | Puffer und Abschluss (CP5) | offen | — |

## Nächster Schritt
Paket 4: Vorgänge in Transaktion mit Zähler (`sm24_zaehler`) und Positionen-Schnappschuss,
Terminbuchung mit Advisory-Lock, Kundenuploads → `kundendateien`, `/artikel` + Standardartikel
(+ 8 Beispielartikel, nicht bestellbar), Richtwerte + Rechner, Nachweise, Löschsperre bei
Bestellbezug → CP3. DB: `npm run db:start`. Tests: `npm test` (Einheit + Datenbank).
Grafik-Agenten laufen parallel (Worktrees unter `.claude/worktrees/`).

## Notizen
- **Pfad A (Payload 3.90.2)** — Probelauf 17:08–17:15 bestanden:
  - Postgres 17.10 lokal über embedded-postgres (`scripts/db.mjs`, Port 5433, `.data/postgres`)
  - Routen nach `src/app/(site)/`, Payload unter `src/app/(payload)/`, altes `/admin` entfernt
  - `payload migrate:create` / `migrate` ohne CLI-Probleme; Admin-Zugang per `src/scripts/admin-anlegen.ts`
  - dev: Website + deutsches Backend; Anmeldung ok; ohne Anmeldung 403; fremde Herkunft abgewiesen (CSRF)
  - `npm run build` (Turbopack) 18 s, 187 Seiten; `next start` liefert Website, Backend, API
  - CSP: `blob:` ergänzt, Stripe-Formularziel, Framing `'self'`; Payload-Header nur auf `/admin`
- **Paket 2** (CP1): `submitRecord`/`submitOrder` gehärtet (zod, Server-Preise,
  `expectedTotalCents`, Ratenbegrenzung), Bestellseite nur mit Token, `saveContent`/altes Admin weg,
  JSON-Adapter ohne `/tmp`, Bot-Altlasten entfernt, erfundene Aussagen neutralisiert,
  `pageGraphSchema` für 9 Bereichsseiten, 5 FAQ Schließanlagen geerntet.
  Design-Vertrag: helle Palette, `--area*` je Bereich (`src/lib/visual/area-theme.ts`, Kontrasttest),
  `ImageSlot.visual/bild`, CSS-Bewegung + `InView`, `src/components/visual/README.md`.
  Bot-Sicherheitscheck-Schema (Türart/Schlossart/Dringlichkeit) → in Paket 4 bei den Richtwerten
  übernehmen (Beträge der Bots sind erfunden und entfallen).
- **Paket 3** (CP2): 11 Sammlungen + 2 Globals (deutsch), Migration `20260924_004222_datenmodell`,
  Seed `src/scripts/seed.ts` (nur leere Sammlungen, läuft im Build), Datenschicht über Local API
  (`src/lib/data/payload-adapter.ts`, Übersetzung `payload-mapping.ts` mit Hin-und-zurück-Test).
  Preisänderung per CMS → Seite zeigt neuen Preis + Staffeln folgen (im Browser geprüft).
  Datenbanktests `vitest.db.config.ts` (Port 5434). Payload-Falle: `delete({ trash: true })`
  löscht endgültig; Papierkorb = `deletedAt` setzen.
