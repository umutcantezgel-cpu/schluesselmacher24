# FA-SEO-03 · Mobile Leistung: messen mit festem Maßstab, Ursachen an der Startseite beheben

Kopf: Etappe FA Priorität 6 · Rolle Prüfer und Baumeister · Modell Opus · Stufe 3 (erste Ansicht der Startseite, wirkt auf Bewegung und Ladereihenfolge) · Kostenklasse L · ohne Datenschema · Anforderungen FA-25-13, FA-25-15 · Befunde: `berichte/FA-BESTAND.md` (Zeilen FA-25-13, FA-25-15), `berichte/FA-SEO-01C.md` (Abschnitt 5 und offene Frage 5), `berichte/FA-SEO-02-onpage.md`.

## Aufgabe in einem Satz
Miss die mobile Leistung der wichtigen Ansichten mit einem festen, wiederholbaren Maßstab gegen den Produktions-Build, finde die Ursachen der schwachen Werte und behebe die größten an der Startseite, ohne Inhalte oder Bedienung zu verschlechtern.

## Vorgabe des Inhabers (wörtlich, Abschnitt 25)
„Sehr gute mobile Performance, optimierte Bilder und kurze Ladezeiten.“ Und: „Der Score ist ein Qualitätsindikator, aber kein Selbstzweck: echte Inhalte, Nutzbarkeit und saubere Technik gehen vor künstlichem Score Tuning.“

## So bauen
1. Messwerkzeug `_werkstatt/ausbau/werkzeuge/leistung.mjs` neben `onpage.mjs` (lies es als Muster): Lighthouse mobil gegen den Messstand `http://localhost:3200` (ruhende Kopie des geprüften Produktions-Builds vom Commit 321f64b; der Orchestrator hat ihn gestartet, du startest keinen Server und baust nicht um). Die Adresse nimmt das Werkzeug als Argument oder Umgebungsvariable (`BASIS`, Standard `http://localhost:3000`), damit der Orchestrator nach dem Build am Prüfserver auf Port 3000 mit demselben Werkzeug nachmisst. Miss nicht auf Port 3000: Dort kann während deiner Arbeit ein anderes Paket bauen. Prüfe zuerst, ob Lighthouse in der Werkzeugumgebung vorhanden ist (`/root/sm24-werkzeuge`, siehe `protokolle/einrichtung.md` Abschnitt 11) und nutze den vorinstallierten Browser unter `/opt/pw-browsers/chromium` mit `--headless --no-sandbox`. Fehlt Lighthouse, installiere nichts in das Projekt (G7): Miss dann mit dem vorinstallierten Playwright die Kennwerte selbst (größtes sichtbares Element, Verschiebungen, lange Aufgaben, Gewicht und Zahl der Dateien der ersten Ansicht, bei gedrosselter Leitung und gedrosseltem Prozessor) und sag im Bericht klar, dass es keine Lighthouse-Zahl ist. Maßstab festlegen und im Bericht nennen: Geräteprofil, Drosselung, Median aus drei Läufen, Liste der Ansichten (Startseite, Autoschlüssel, Assistent, Schlüssel nach Code mit Liste, Konfigurator, Shop, eine Ortsseite, eine Ratgeberseite, Kontakt).
2. Ursachen je Ansicht: Was hält das größte sichtbare Element auf, was blockiert, was liegt im ersten Bündel (Kandidaten laut `berichte/FA-SEO-01C.md`: Eingangsinszenierung und die Bewegung der Fräsbahn auf der Startseite). Belege mit Zahlen.
3. Beheben an der Startseite (FA-25-15): Bewegung und Inszenierung dürfen die erste Ansicht nicht aufhalten: nach dem ersten Zeichnen starten oder nachladen, ohne dass der Hub („Wobei können wir Ihnen helfen?“) später erscheint oder springt. Der Schalter „Bewegung: ruhig“ und `prefers-reduced-motion` bleiben wirksam. Keine Inhalte entfernen, keinen Text vor Suchmaschinen verbergen (R1). Vorher und nachher mit demselben Maßstab messen.
4. Weitere Ursachen mit kleinem Eingriff beheben (Bildgrößen, Vorladen); größere als OFFENE FRAGE mit Zahl und Vorschlag.
5. Bericht mit Tabelle: Ansicht, Kennwerte vorher, nachher, Ursache, was getan wurde. Rohdaten nach `_werkstatt/ausbau/protokolle/`.

## Hinweis (vom Orchestrator, 16.11.2026)
- Gleichzeitig läuft FA-PLATTFORM-03B (Ortsseiten am Ortsstamm, mit Schema: `src/payload/**`, `src/migrations/**`, `src/payload-types.ts`, `src/lib/orte/**`, `src/app/(site)/standorte/**`, `src/app/sitemap.ts`, `content/cities.json`, `docs/betrieb/orte-pflegen.md`). Diese Dateien fasst du nicht an. Schlägt die Typprüfung oder ein Test nur in Dateien dieses Pakets fehl, wiederhole den Lauf später und nenne das im Bericht.
- Stand der Seite seit A-068: kleinste Textstufe 14 px; jede Beschriftung in einer Zeichnung ist auf dem Bildschirm mindestens 14 px groß (`src/components/visual/generators/**` und ihre Tests rechnen das nach). An Schriftgrößen, Ausschnitten und Größen der Zeichnungen änderst du nichts; `src/components/visual/generators/**` fasst du nicht an.
- Die Eingangsinszenierung und der Hub dürfen sich in der Ladereihenfolge ändern, nicht im Inhalt: derselbe Text, dieselben Verweise, dieselbe Reihenfolge der 14 Zugänge (A-052).

## Schreibrechte
`_werkstatt/ausbau/werkzeuge/leistung.mjs` (neu, mit Selbsttest wie die anderen Werkzeuge), `src/app/(site)/page.tsx` und die Bausteine der ersten Ansicht der Startseite (`src/components/hub/**`, `src/components/visual/motion/**`, die Eingangsinszenierung), `src/app/(site)/layout.tsx` nur für Vorladen und Ladereihenfolge, zugehörige Tests, `_werkstatt/ausbau/berichte/FA-SEO-03.md`, Rohdaten unter `_werkstatt/ausbau/protokolle/`.
Nicht anfassen: Texte, Rubrikdaten, Formulare, Kasse, `next.config` außer mit Begründung als OFFENE FRAGE, Abhängigkeiten (G7).

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`. Den Build für die Nachher-Messung macht der Orchestrator; schreibe in den Bericht, welche Messung er nach dem Build wiederholen soll. Kein git.

## Grenzen
G1 (Messung nur gegen localhost), G7, G8, R1, R4. Kein künstliches Tuning: Was Kunden sehen und bedienen, geht vor der Zahl.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-03 · BEREIT ZUR RÜCKGABE ===
