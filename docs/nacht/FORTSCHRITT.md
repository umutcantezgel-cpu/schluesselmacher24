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
| 4 | Bestellungen, Termine, Artikel, Richtwerte (CP3) | fertig | 1b685f3 |
| 5 | Stripe, Visual-Einbau, E2E (CP4) | offen | — |
| 6 | Puffer und Abschluss (CP5) | offen | — |

## Nächster Schritt
Prüf-Workflow `paket4-pruefung` (Run `wf_b92d5c55-28d`) auswerten, bestätigte Mängel beheben.
Danach Paket 5 als Workflow: Stripe (Checkout, Webhook, Erstattung) | Grafiken auf die Seiten |
anschließend Playwright-E2E. Gate: `npm run typecheck && npm run lint && npm test`, Build `npm run build`.

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
- **Paket 4 (Vorbereitung)**: Standardartikel im Warenkorb/Kasse + 8 Beispielartikel, Seed mit
  dauerhaftem Vermerk (`payload.kv`), Strukturen Richtwerte/Kundendateien/Nachweise/Zahlungsereignisse,
  Tabellen `sm24_zaehler`/`sm24_ratenbegrenzung`, 54 Icons + 4 Generatoren übernommen.
- **Paket 4** (CP3): Workflow-Welle 1 — 3 von 5 Agenten fertig, 2 hingen (vermutlich Nutzungslimit)
  kurz vor dem Commit; ihre Arbeit war grün und wurde nach eigener Durchsicht übernommen.
  Vorgänge atomar (Zähler, Terminsperre per Advisory-Lock, Schnappschuss, Löschsperre), /artikel,
  Richtwert-Rechner (ersetzen Bot-Rechner), Kunden-Uploads (Route, Magic Bytes, Einmal-Schlüssel,
  Zuordnung, Aufräum-Skript), Ratenbegrenzung über DB, Grafik-Registry + BereichIcon.
  Geprüft am laufenden Server: echtes PNG angenommen, gefälschtes 415, fremde Herkunft 403,
  Dateien/Listen ohne Anmeldung 403. Build 198 Seiten. Tests 680 + 52 (DB).
