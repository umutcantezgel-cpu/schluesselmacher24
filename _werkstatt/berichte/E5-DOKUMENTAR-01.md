# E5-DOKUMENTAR-01 · Bericht und Abnahme (README auf den Ist-Stand, UMSETZUNG.md historisch)

3 Prüfrunden; letztes Prüfurteil: nicht bestanden (1 Muss: falscher Probe-Befehl). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Muss Probe-Befehl (Sicherheit):** nachgeprüft – `payload run` reicht nur die Positionsargumente durch (`node_modules/payload/dist/bin/index.js`, `minimist`); mit `npm run aufbewahrung:bereinigen -- --probe` sähe das Skript das Flag nicht und würde löschen. Die README nennt jetzt `npm run aufbewahrung:bereinigen -- -- --probe` mit Begründung und erwähnt auch die nie zugeordneten Uploads.
- **Nacharbeit:** Zählungen ohne Verweise auf Zwischenstände (Testdateien 66, lucide 4 Dateien – nach E5-L-12 fortgeschrieben).
- **Bestätigt:** übrige Aussagen mit Belegen der Prüfrunden 1 bis 3; der Hinweis über `UMSETZUNG.md` steht wortgleich.
- **Offen (nicht änderbar):** Der Kommentar in `src/lib/integrations/index.ts` nennt den Status „im Backend unter Einstellungen“; die Datei ist unantastbar, die README sagt es richtig.

## Prüfurteil (letzte Runde)

- **muss:** README Z.29: Der Probe-Befehl `npm run aufbewahrung:bereinigen -- --probe` löscht, statt anzuzeigen. Die Payload-CLI reicht --probe als Flag an minimist (node_modules/payload/bin.js:14, dist/bin/index.js:26 und :68-72). Das Flag fehlt dann in process.argv; src/scripts/aufbewahrung-bereinigen.ts:15 sieht es nicht, und kundendateien.ts:274-278 löscht. Simulation ohne Skript und ohne DB: das Skript sieht --probe nicht. Mit `npm run aufbewahrung:bereinigen -- -- --probe` sieht es --probe (Simulation). Alternativ `npx payload run src/scripts/aufbewahrung-bereinigen.ts -- --probe`. Die Begründung in Z.29 ist falsch.
- **soll:** README Z.33-37 (Abschnitt 'Ohne Datenbank'): Das Beispiel `SM24_DATA=json npm run dev` suggeriert keine Datenbank. package.json:7 ruft davor `scripts/db.mjs ensure` auf; ohne externe DATABASE_URL startet dort ein lokales Postgres (db.mjs:122-124). Z.40 sagt das, das Beispiel nicht. Hinweis am Beispiel ergänzen.
- **soll:** README Z.29: 'löscht Kundendateien mit abgelaufener Frist' ist unvollständig. Das Skript löscht auch Uploads, die nie einem Vorgang zugeordnet wurden und älter als 24 Stunden sind (src/scripts/aufbewahrung-bereinigen.ts:2-3 und :20, Grund 'nie-zugeordnet').
- **soll:** Belegliste im Bericht unvollständig: Z.82 '/admin/collections/<slug>' hat keinen Beleg (belegbar und zutreffend: node_modules/@payloadcms/ui/dist, Muster '/collections/${collectionConfig.slug}'). Z.114-116 'außerhalb von src/, nicht Teil der Website' hat keinen Beleg im Bericht (zutreffend: keine Imports aus _werkstatt in src; nur Kommentare in src/components/ui/image-placeholder.tsx:97 und src/lib/codelinie.ts:14).
- **hinweis:** README Z.104 nennt für storageStatus nur die Seiten. Die API-Route src/app/(site)/api/kunden-upload/route.ts:91 liest ihn ebenfalls (Offene Frage 4 des Berichts). Ergänzen oder 'unter anderem' setzen.
- **hinweis:** README Z.116: Die Aufzählung von _werkstatt/ ist unvollständig (ABNAHME.md, ENTSCHEIDUNGEN.md, LAGEBILD.md, MENSCHEN.md, PLAN-ENTWURF.md, TEXTVORSCHLAEGE.md, bilder/). Ohne 'unter anderem' wirkt sie vollständig.
- **hinweis:** README Z.67: Die Bausteine in motion/ werden mit vier genannt; motion/seitenwechsel.tsx (Seitenwechsel) fehlt. Mit 'unter anderem' kenntlich machen.
- **hinweis:** README Z.19-29: Die Tabelle 'Weitere Skripte aus package.json' lässt db:seed (package.json:22) und payload (package.json:14) aus.
- **hinweis:** src/lib/integrations/index.ts:6 behauptet, der Status sei im Backend unter 'Einstellungen' sichtbar. Im Code gibt es dafür keinen Bezug (grep über src/payload und src/app/(payload) ohne Treffer). README Z.104 ist richtig. Die Datei liegt außerhalb des Schreibrechts; nur gemeldet.
- **hinweis:** Kern-Version: _werkstatt/KERN.md:1 trägt Version 1.13. Das Paket nennt 1.12, der Auftrag 1.8. Die README nennt keine Version, daher ist das kein README-Fehler; der Orchestrator sollte die Angabe klären.

## Bericht des Ausführenden (letzte Runde)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/README.md: Z.40 (Qualifikation 'Ohne externe DATABASE_URL'), Z.42 (Build-Satz präzisiert: externe DATABASE_URL startet kein lokales Postgres, Migrationen und Seed laufen gegen die angegebene Datenbank), Z.72 (Satz zu den zwei Testdateien korrigiert: nicht 'noch nicht committet', sondern nach f0e1382 hinzugekommen und in HEAD über Commit 0fca06c). Zeilenzahl 116.
- /home/user/schluesselmacher24/UMSETZUNG.md: Hinweisblock Z.1-2 (Zitat und Leerzeile) bereits eingetragen; Wortlaut geprüft, nicht erneut geändert.
- Hilfsdatei /root/sm24-bilder/E5-DOKUMENTAR-01/schnellpruefung.mjs (außerhalb des Repos).

WAS UND WARUM
- Muss (Belegliste vollständig): Jede Aussage der README mit Beleg Datei:Zeile, unten.
- Soll 1: README Z.72 korrigiert. Die zwei Dateien sind nicht uncommittet; beide sind in HEAD (0fca06c). 66 und 64 stimmen (gezählt).
- Soll 2: README Z.42 präzisiert nach scripts/db.mjs Z.104-114 und 119-123 sowie package.json Skript build. Z.40 mit gleicher Ausnahme qualifiziert (offene Frage 2).

BELEGE (README-Zeile: Aussage -> Beleg)
Kopf
- Z.3 Satz 1 (Website/Shop, Sortiment): Verzeichnisse src/app/(site)/autoschluessel, kasse, warenkorb, schliessanlagen, elektronische-zutrittsloesungen, schluessel-nach-code, schluessel-nach-vorlage, gleichschliessende-zylinder, sicherheitstechnik, tuer-und-schliesstechnik (ls).
- Z.3 Satz 2 (Termine mit Anzahlung; Konfiguratoren): content/settings.json:90-91 (depositCents 6990, depositMinCents 5000); Konfiguratoren src/app/(site)/schliessanlagen/konfigurator/, elektronische-zutrittsloesungen/konfigurator/, gleichschliessende-zylinder/konfigurator/ (ls).
- Z.5 Domain schluesselmacher24.de in src/lib/site-url.ts:21.
Entwicklung
- Z.9-17 Befehle: package.json:7 dev (next dev ohne -p; Standardport 3000, zusätzlich _werkstatt/STATUS.md:21 nennt Port 3000), :8 build, :9 start, :10 lint, :11 typecheck, :13 test (vitest run, danach vitest.db.config.ts).
- Z.23 test:unit -> package.json:24. Z.24 test:db -> package.json:25 (vitest.db.config.ts). Z.25 seed -> package.json:12 (src/scripts/seed.ts); Übernahme aus content/*.json: src/payload/seed.ts:5. Z.26 admin:anlegen -> package.json:23. Z.27 db:start, db:stop, db:status, db:reset -> package.json:15-18, Befehle in scripts/db.mjs:116-138. Z.28 db:migrate, generate:types, generate:importmap -> package.json:19-21. Z.29 aufbewahrung:bereinigen -> package.json:26; --probe: src/scripts/aufbewahrung-bereinigen.ts:6 und :15. Alle 12 genannten npm-run-Befehle stehen in package.json (Schnellprüfung).
- Z.31 .env.example: nur Vorlage, keine Zugangsdaten (.env.example:1-4); vorbelegt nur NEXT_PUBLIC_SITE_URL (.env.example:7; übrige Werte leer, :12-33). Im Code gelesen: DATABASE_URL -> src/lib/data/index.ts:22; PAYLOAD_SECRET -> src/payload.config.ts:37; SM24_DATA -> src/lib/data/index.ts:22; SM24_READONLY_CONTENT -> src/lib/data/json-adapter.ts:40; NEXT_PUBLIC_SERVER_URL -> src/payload.config.ts:32; NEXT_PUBLIC_SITE_URL -> src/lib/site-url.ts:9; SEED_ADMIN_EMAIL -> src/scripts/admin-anlegen.ts:13; SEED_ADMIN_PASSWORD -> src/scripts/admin-anlegen.ts:14.
- Z.33 'Ohne Datenbank': Payload bei DATABASE_URL, sonst content/ -> src/lib/data/index.ts:22-23. SM24_DATA=json erzwingt das gleiche (index.ts:22).
- Z.36-37 Befehle SM24_DATA=json npm run dev / npx next build: package.json:7 und :8; Build ohne DB in _werkstatt/STATUS.md:20.
- Z.40 'npm run dev ruft scripts/db.mjs ensure auf' -> package.json:7. 'Port 5433, nur localhost, Daten unter .data/postgres' -> scripts/db.mjs:21 (DATA_DIR .data/postgres), :23 (PORT 5433), :84 (listen_addresses=127.0.0.1). 'Paket embedded-postgres' -> package.json:57 und scripts/db.mjs:5-6, :31. 'Skript setzt DATABASE_URL nicht' -> scripts/db.mjs:105 (nur lesend).
- Z.42 Auf Vercel ohne DATABASE_URL ohne Datenbank -> package.json:8 (else-Zweig, Text 'Keine DATABASE_URL: Build ohne Datenbank'). 'Sonst' -> package.json:8 (db.mjs ensure, payload migrate, payload run seed, dann next build). Lokales Postgres ohne DATABASE_URL -> scripts/db.mjs:122-124 (start). Externe DATABASE_URL -> scripts/db.mjs:104-114 (usesExternalDatabase), :122-123 (keine lokale Instanz). 'Als root scheitert initdb' -> _werkstatt/STATUS.md:20 und scripts/db.mjs:55 (initdb). 'SM24_DATA=json npx next build' -> _werkstatt/STATUS.md:20.
Technischer Aufbau
- Z.46 Next.js ^16.3.5 -> package.json:39; App Router -> Verzeichnis src/app/. React 19.2.4 -> package.json:41. TypeScript ^5.9.3 -> package.json:64; strict -> tsconfig.json:11.
- Z.47 Tailwind ^3.4.19 -> package.json:63. Tokens in src/app/(site)/globals.css (:86-112) und tailwind.config.ts (:22, :29, :37, :47, :169-170). src/app/globals.css fehlt (ls).
- Z.48 Payload ^3.90.2 -> package.json:40. Postgres-Adapter -> package.json:31, src/payload.config.ts:4 und :89-94. Sammlungen src/payload/collections/ (16 Dateien, ls); Globals src/payload/globals/ (3 Dateien, ls).
- Z.49 Datenschicht -> src/lib/data/index.ts:22-23; src/lib/data/json-adapter.ts:32 (Klasse), :5 und :55 (Standardwerte aus defaults); Verzeichnis src/lib/data/defaults/ (ls).
- Z.50 zod ^4.4.3 -> package.json:47; Importe in drei Dateien: src/app/(site)/api/kunden-upload/route.ts, src/lib/actions/orders.ts, src/lib/server/record-schema.ts (grep). react-hook-form in package.json:43; kein Import (grep über src: kein Treffer). @hookform/resolvers in package.json:30, kein Import.
- Z.51 Schriften next/font/google -> src/app/(site)/layout.tsx:2; Variablen --font-display :16, --font-body :23, --font-mono :30.
- Z.52 Zwischenstände -> src/lib/flow/use-flow.ts:6-10 (Import aus client-state), src/lib/client-state.ts:43, :56, :66 (localStorage). Warenkorb-Store -> src/lib/store/cart.ts:3-4 (zustand create, persist), :41 (useCartStore).
- Z.53 Verzeichnisse: src/app/(site)/, src/app/(payload)/, src/components/ (Bereiche: autoschluessel, layout, schliessanlagen, seo, ui, vertrauen, visual, forms, flow, calculator), src/components/visual/, src/lib/pricing.ts, src/lib/scheduling.ts, src/lib/actions/, src/lib/integrations/ (ls).
Gestaltung
- Z.57 Leitidee K-001 -> _werkstatt/KERN.md:8-9 (Wortlaut identisch mit README-Zitat). Z.58 K-003 -> KERN.md:32; K-006 -> KERN.md:134; visual/README.md -> src/components/visual/README.md:1.
- Z.59 Tokens -> src/app/(site)/globals.css:86-112 (:root-Block mit Tokens).
- Z.60 Schrift --text-caption bis --text-display -> globals.css:87 bis :95; fließend 390 bis 1440 px -> globals.css:86 (Kommentar).
- Z.61 --space-section -> globals.css:98; --space-gutter -> globals.css:100.
- Z.62 --dauer-instant 120ms -> globals.css:103; --dauer-scene 900ms -> globals.css:108; --kurve-standard, -enter, -exit, -draw -> globals.css:109-112.
- Z.63 shadow-raised, shadow-overlay -> tailwind.config.ts:169-170.
- Z.64 surface -> tailwind.config.ts:29; foreground-muted -> tailwind.config.ts:37; primary -> tailwind.config.ts:47. data-area -> src/components/visual/area-scope.tsx:12. Werte in src/lib/visual/area-theme.ts:39 (AREA_THEMES).
- Z.65 54 Fach-Icons in src/components/visual/icons/ (57 .tsx minus icon-base.tsx, icon-base.test.tsx, icons.test.tsx; Zählung per ls/grep); gemeinsamer Rahmen icon-base.tsx (Datei vorhanden). 39 Glyphen in glyphen/ (40 minus glyphen.test.tsx). einfarbig -> _werkstatt/KERN.md:215, src/components/visual/README.md:60. lucide-react ^1.17.0 -> package.json:38; Importe in 4 Dateien: src/app/(site)/bestellung/[id]/page.tsx, rechtliches/cookie-einstellungen/cookie-einstellungen.tsx, standorte/[city]/page.tsx, standorte/page.tsx (grep -rl). Basisstand f0e1382: git grep -l lucide-react f0e1382 -- src = 14.
- Z.66 9 Generatoren in src/components/visual/generators/ (ablauf, code-fundstelle, profilschnitt, schliessplan, schluessel, stiftzuhaltung, tuer-schutz, zutritt-signal, zylinder-mass; je .tsx und .test.tsx, ls). Registry src/components/visual/registry.tsx:5-13 (Import der 9). Strichskala und Raster in generators/grafik-basis.tsx:14-31 und :17. Deterministisches SVG: Generatoren ohne Zufall (Datei-Lektüre: Kopf der Generatoren). Jeder hat einen Test (9 Testdateien).
- Z.67 CSS-Klassen sm24-* -> src/app/(site)/globals.css:352-426 (keyframes), :432-470 (Klassen). Bausteine in src/components/visual/motion/: InView -> in-view.tsx:43; Reveal -> reveal.tsx:25; DrawOn -> draw-on.tsx:57; CheckDraw -> check-draw.tsx:36. Regel 'transform und opacity sowie Strich- und Maskenbewegungen' -> _werkstatt/KERN.md:166 (K-007, Abschnitt :159).
- Z.68 reduzierte Bewegung -> globals.css:640 (@media prefers-reduced-motion: reduce; verkürzt Animationen und Übergänge auf 0,01 ms). scrollVerhalten() -> src/lib/bewegung.ts:21; Nutzung in src/lib/flow/use-flow.ts:5 (Import) und zwei weiteren Dateien (grep).
Tests
- Z.72 Vitest 2 -> package.json:65 (^2.1.8). Umgebung node, ohne DOM -> vitest.config.ts:9. npm run test:unit -> package.json:24. 66 Unit-Testdateien (Befehl in README; Zählung: 66 im Arbeitsbaum und in HEAD). Basisstand f0e1382: 64 (git ls-tree -r --name-only f0e1382 src, gefiltert). Differenz: src/lib/codelinie.test.ts und src/components/visual/interaktiv/code-fundstelle-interaktiv.test.tsx; beide in HEAD (git cat-file -e HEAD:…); Hinzufügung in 0fca06c (git log --diff-filter=A); git merge-base --is-ancestor 0fca06c HEAD bestätigt.
- Z.73 test:db -> package.json:25 und vitest.db.config.ts:31 (include *.db.test.ts). 7 Dateien *.db.test.ts (Zählung: create-record, kundendateien, rate-limit, richtwerte, nachweise, payload, vorgaenge). db-global-setup.ts:12 (Port 5434, SM24_TEST_PG_PORT), :33 (payload migrate), :34 (seed).
- Z.74 DB-Tests als root nicht lauffähig -> _werkstatt/STATUS.md:28.
- Z.75 typecheck -> package.json:11; lint -> package.json:10.
Inhaltspflege
- Z.79 Mit laufender Datenbank in Payload -> src/lib/data/index.ts:22 (PayloadAdapter ohne SM24_DATA=json und mit DATABASE_URL). content/ als Ausgangsbestand -> src/payload/seed.ts:5 und package.json:12.
- Z.81 Backend /admin -> Verzeichnis src/app/(payload)/admin/[[...segments]]/ (ls); admin.user Benutzer -> src/payload.config.ts:48; slug 'benutzer' -> src/payload/collections/Benutzer.ts:10. Rollen Inhaber/Mitarbeiter -> src/payload/access/rollen.ts:5-6. admin:anlegen -> package.json:23 und src/scripts/admin-anlegen.ts:13-16 (Prüfung 12 Zeichen in :16-17). Zugangsdaten nur aus SEED_ADMIN_EMAIL/PASSWORD (:13-14).
- Z.82 Sammlungen (16) -> src/payload.config.ts:63-86 (Vorgaenge, Kundendateien, Produkte, Fahrzeugmarken, AutoschluesselLeistungen, Preisregeln, Preisgruppen, Sperrtage, Seiten, Leistungsseiten, Ratgeber, Einsatzgebiete, Nachweise, Medien, Benutzer, WebhookEreignisse). Globals (3) -> src/payload.config.ts:87 (Zylinderkatalog, Richtwerte, Einstellungen). Adresse /admin/collections/<slug> ist Payload-Standard (offene Frage 6).
- Z.83 Übernahme einmal je Sammlung -> src/payload/seed.ts:5; Befehl package.json:12.
- Tabelle Z.85-98 (Dateien und Anzahl, Zählung per node):
  - content/settings.json: company.isPlaceholder :15 (true); openingHours :17; booking :88; shipping :123; retentionDays :163.
  - service-pricing.json: 24 Einträge (Zählung); Felder pricingGroupId, serviceId, keyKind, priceCents, slotMinutes (erster Eintrag Z.2 ff.).
  - pricing-groups.json: 4 (Zählung).
  - car-key-services.json: 6 (Zählung); requiresVehicleOnSite :7, :22; keyKinds :8.
  - vehicles.json: 12 Marken (Zählung), 49 Modelle (Summe der models-Arrays).
  - code-lines.json: 52 (Zählung).
  - cylinder-catalog.json: keyPriceCents :3; measuringFigure :15; forms :19 (3 Einträge); functions :107 (2); extras (4).
  - blocked-days.json: 5 (Zählung); reason :5.
  - seo.json: 24 (Zählung); Felder title, description in seo-Objekt.
  - service-pages.json: 17 (Zählung); area :5 (tuer-und-schliesstechnik, sicherheitstechnik).
  - guides.json: 8 (Zählung).
  - cities.json: 6 (Zählung); onSiteRadiusKm :33 (Umkreis km); localIntro :7 (Ortstexte).
- Z.100 records.json nicht im Repo -> .gitignore:45 (/content/records.json). Im JSON-Modus lesen und schreiben -> src/lib/data/json-adapter.ts:23 (records: 'records.json'), :27 (Kommentar Lesen und Schreiben). Nicht schreibbar auf Vercel oder mit SM24_READONLY_CONTENT=1 -> json-adapter.ts:40 (writable).
Offene Anbindungen
- Z.102/104 Status in src/lib/integrations/index.ts (Datei vorhanden, Funktionen :21-23, :32-43, :87-98, :142-155). Lesestellen: integrationStatuses -> src/app/(site)/rechtliches/versand-und-zahlung/page.tsx:5, :14; paymentStatus -> src/app/(site)/kasse/page.tsx:5, :36 und src/app/(site)/autoschluessel/anfrage/page.tsx:4, :80; mailStatus und storageStatus -> src/app/(site)/bestellung/[id]/page.tsx:9, :163, :169. Vorgang beim Absenden -> src/lib/server/create-record.ts:13 (Import), :184 (createPayment), :232 (sendMail), :416 (storageStatus). Kein Backend-Bezug: grep über src/payload und src/app/(payload) ohne Treffer.
- Z.106 Zahlung: configured aus PAYMENT_PROVIDER und PAYMENT_API_KEY -> src/lib/integrations/index.ts:36. Fallback 'offen' -> index.ts:68-76. Wurf bei gesetzten Werten -> index.ts:78-82. PAYMENT_WEBHOOK_SECRET in requiredEnv -> index.ts:37, nicht in configured (:36). .env.example:12-14.
- Z.107 Mailversand: configured -> index.ts:91; kein Versand ohne Konfiguration -> index.ts:114-122. .env.example:18-20.
- Z.108 Dateiablage: Sammlung kundendateien -> src/payload/collections/Kundendateien.ts:12 (slug). Ordner private-uploads/ -> .gitignore:52. Bedingungen (DATABASE_URL, SM24_DATA nicht json, kein VERCEL/SM24_READONLY_CONTENT) -> index.ts:143-148. STORAGE_* aus .env.example:25-28 werden im Code nicht gelesen (grep ohne Treffer).
- Z.109 stripe in package.json:46; kein Import 'stripe' in src/ oder scripts/ (grep); Treffer nur als Feldwert 'stripe' in src/payload/collections/WebhookEreignisse.ts:21.
- Z.110 Rechtstexte und Firmendaten offen -> _werkstatt/MENSCHEN.md:8 (M-02), :11 (M-05).
- Z.112 Verweis MENSCHEN.md -> Datei vorhanden (_werkstatt/MENSCHEN.md:19 M-13 als Beleg für UMSETZUNG).
Gestaltungslauf
- Z.114-116 _werkstatt/ enthält AUFTRAG.md, KERN.md, PLAN.md, STATUS.md, PRUEFPUNKT.md, BERICHT.md, berichte/, pakete/, protokolle/, werkzeuge/ (mit werkzeuge/package.json); außerhalb von src/ (ls). Nicht Teil der Website: keine Imports aus _werkstatt in src/ (nicht geprüft, Auftrag ohne Pflicht).
UMSETZUNG.md
- Z.1 Hinweis (Zitat) wortgleich mit dem Paketwortlaut. Z.5 'Stand: 15.09.2026' (vorher Z.3). M-13 in MENSCHEN.md:19 bestätigt (JSON-Backend ohne Anmeldung, UMSETZUNG.md als historisch).

PRÜFUNG
- Schnellprüfung erneut: git diff f0e1382 --stat -- README.md UMSETZUNG.md = 2 Dateien, 99 Einfügungen, 26 Löschungen (unverändert). UMSETZUNG.md: nur zwei Zeilen oben im Diff. Pfade und npm-Befehle geprüft (12 Befehle, alle in package.json). Länge 116 Zeilen. Keine Bildprüfung (keine Ansicht).

OFFENE FRAGEN
1. KERN-Version: _werkstatt/KERN.md trägt Version 1.13 (Z.1). Der Auftrag nennt 1.8 bzw. 1.12. README nennt keine Versionsnummer.
2. README Z.40: Ich habe 'Ohne externe DATABASE_URL' vorangestellt. Das ist nicht im Prüfbefund genannt, folgt aber derselben Ausnahme wie Z.42. Bitte bestätigen oder zurücknehmen.
3. src/lib/integrations/index.ts Z.6 (Kommentar) behauptet Sichtbarkeit im Backend unter 'Einstellungen'. Der Code hat dort keinen Bezug. README Z.104 ist korrekt. Die Datei liegt außerhalb meines Schreibrechts.
4. README Z.104: Leser von storageStatus() sind auch src/app/(site)/api/kunden-upload/route.ts:91 und create-record.ts:416. Nicht ergänzt.
5. README Z.116: Die Aufzählung in _werkstatt/ ist nicht vollständig (u. a. ABNAHME.md, ENTSCHEIDUNGEN.md, LAGEBILD.md, MENSCHEN.md, PLAN-ENTWURF.md, TEXTVORSCHLAEGE.md, bilder/). Nicht ergänzt.
6. README Z.82: '/admin/collections/<slug>' ist Payload-Standard; eine eigene Route ist im Code nicht belegt.

=== ENDE E5-DOKUMENTAR-01 · BEREIT ZUR RÜCKGABE ===
