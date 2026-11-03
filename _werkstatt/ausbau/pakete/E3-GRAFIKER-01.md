# E3-GRAFIKER-01 · Neue Fach-Icons und Glyphen der eigenen Familie

## 1. Kopfzeile
Kennung E3-GRAFIKER-01 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern 2.0 · Kostenklasse M · Anforderungen: G-03 (Kacheln mit Icon), G-47, S4 · Kriterien Z-11, Z-13 · Schreibrechte (exakt): src/components/visual/icons/motorradschluessel.tsx, schluesselgehaeuse.tsx, transponder-kopie.tsx, schluesselfinder.tsx, vor-ort.tsx, karte.tsx, video.tsx (alle unter src/components/visual/icons/), src/components/visual/glyphen/pause.tsx, src/components/visual/glyphen/bewegung.tsx, src/components/visual/icons/icons.test.tsx, die Testdatei der Glyphen unter src/components/visual/glyphen/ (vorhandene Datei erweitern), _werkstatt/ausbau/berichte/E3-GRAFIKER-01.md · Umfang: 7 Fach-Icons, 2 Glyphen, Tests

## 2. Rollenbriefing
Grafiker: setzt Icons, Illustrationen, Messgrafiken und Bewegungseinträge nach Formsystem und Register um. Fehler: mehr animieren als vorgesehen; reduzierte Bewegung vergessen; uneinheitliche Strichstärken.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Zeichne sieben neue Fach-Icons und zwei Glyphen im vorhandenen Formsystem (IconBase, 48er-Raster, runde Enden, Zweitonfläche nur bei Fach-Icons) und nimm sie in die vorhandenen Tests auf.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
KERN.md K-008 (Formsystem): Fach-Icons in src/components/visual/icons/ mit IconBase, viewBox 0 0 48 48, Strichstärke über IconBase und [data-sm24-icon] (1,75 px), Zweitonfläche als zuerst gezeichnete Form mit className="fill-area-muted" stroke="none", danach die Kontur; Glyphen in src/components/visual/glyphen/ einfarbig ohne Zweiton, Standardgröße 20. Keine id, kein fill oder stroke mit Hex-Werten, keine Texte im SVG, Koordinaten ganzzahlig oder in halben Schritten, Abstand zum Rand mindestens 4 Einheiten. Jede Datei exportiert genau eine Funktion IconName oder GlyphName mit einem deutschen Kommentar in einer Zeile.

## 6. Maßstab
Muster: src/components/visual/icons/autoschluessel.tsx (Fach-Icon mit Zweiton), src/components/visual/icons/transponder.tsx, src/components/visual/icons/standort.tsx, src/components/visual/glyphen/laden.tsx (Glyph). Tests: src/components/visual/icons/icons.test.tsx und die Testdatei unter glyphen/ (Liste der Komponenten erweitern, sonst nichts ändern).

## 7. Grenzen
G8 (Tests nicht lockern), R11 (keine fremden Icons nachzeichnen), R12 (keine Herstellerlogos). Nur die Dateien der Schreibrechte.

## 8. Schritte
1. IconMotorradschluessel (motorradschluessel.tsx): kurzer Schlüssel mit rundem Kopf und Transponderpunkt, links oben; rechts unten ein kleines Rad (Kreis mit Nabe), das ihn vom Autoschlüssel unterscheidet. Zweiton: Kopf.
2. IconSchluesselgehaeuse (schluesselgehaeuse.tsx): aufgeklapptes Funkschlüsselgehäuse: zwei Halbschalen (abgerundete Rechtecke) leicht versetzt übereinander, auf der oberen zwei Tastenkreise, rechts die Klinge als kurzes Rechteck. Zweiton: untere Halbschale.
3. IconTransponderKopie (transponder-kopie.tsx): zwei kleine Chips (Quadrat mit je zwei Beinchen oben und unten) nebeneinander, dazwischen ein Pfeil nach rechts. Zweiton: rechter Chip.
4. IconSchluesselfinder (schluesselfinder.tsx): Auto von vorn (Karosserie als abgerundetes Trapez, zwei Scheinwerfer als Kreise, Kühlergrill als Linie) und rechts unten ein kleiner Schlüsselkopf mit Bart. Zweiton: Karosserie.
5. IconVorOrt (vor-ort.tsx): Haustür (Rechteck mit Klinke) und darüber rechts ein Standortpunkt (Tropfenform mit Kreis). Zweiton: Tür.
6. IconKarte (karte.tsx): gefaltete Karte aus drei Feldern im Zickzack, auf dem mittleren Feld ein Punkt. Zweiton: mittleres Feld.
7. IconVideo (video.tsx): Bildschirmrahmen (abgerundetes Rechteck) mit Abspieldreieck in der Mitte. Zweiton: Rahmenfläche.
8. GlyphPause (glyphen/pause.tsx): zwei senkrechte Balken mit runden Enden; GlyphBewegung (glyphen/bewegung.tsx): Kreis links, rechts davon drei kurze waagerechte Linien unterschiedlicher Länge (Bewegungsspur).
9. Tests: Nimm alle neuen Komponenten in die vorhandenen Listen der Testdateien auf, sodass die bestehenden Prüfungen (viewBox, keine id, aria, Strich) für sie laufen.
10. Prüfung: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run src/components/visual` und `… sicher.sh --json -- npx eslint src/components/visual/icons src/components/visual/glyphen` und `… sicher.sh --json -- npx tsc --noEmit` (Typprüfung des Projekts; melde nur Fehler in deinen Dateien).
11. Bild: Rendere alle neuen Icons auf einer kleinen HTML-Seite in deinem Scratchpad (renderToStaticMarkup über ein kurzes tsx-Skript ist nicht nötig; kopiere die SVG-Ausgabe aus einem Vitest-Snapshot oder schreibe die Pfade in eine statische HTML-Datei) in 48 und 24 px und speichere ein Bild nach _werkstatt/ausbau/bilder/arbeit/E3-GRAFIKER-01.png (Playwright aus /opt/node-tools/node_modules/playwright, Chromium aus lib.mjs). Beschreibe im Bericht, ob jedes Motiv in 24 px erkennbar ist.

## 9. Selbstprüfung
9 neue Dateien, jede mit genau einem Export; Tests grün; keine id, kein Hex; Strichstärken einheitlich über IconBase.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E3-GRAFIKER-01.md (höchstens 600 Wörter). Ausdrücklich erlaubt.

## 11. Letzte Zeile
=== ENDE E3-GRAFIKER-01 · BEREIT ZUR RÜCKGABE ===
