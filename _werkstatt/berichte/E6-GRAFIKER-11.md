# E6-GRAFIKER-11 · Bericht und Abnahme (Stiftzuhaltung am Scrollen, Kür K-01)

1 Prüfrunde, Prüfurteil: bestanden. Abnahme durch den Orchestrator:

- **Bestätigt:** Einfahrweg −244 (Halmspitze 20 Einheiten vor Bohrung 1, wie der Auftrag es meint; die Paketformel war falsch); Gehäuse- und Kernstift je Bohrung in einer Gruppe; Stiftweg 8 bis 30.
- **Ohne `szene`:** alle 19 Vergleichsfälle zeichengleich; reduzierte Bewegung zeigt pixelgleich die heutige Endlage.
- **Telefon:** Beschriftungen wären bei voller Breite etwa 9 px – der Einbau auf der Seite (K-01) löst das (siehe Abnahme K-01).

## Prüfurteil (letzte Runde)

- **soll:** Einfahrwert -244 statt Paketformel -70 (stiftzuhaltung.tsx Z. 79). Die Formel setzt die Halmspitze auf x=354 und damit hinter Bohrung 1 bis 3. Gemessen steht die Spitze bei x=180, vor Bohrung 1, wie es der Auftrag verlangt. Die Abweichung ist begründet; der Orchestrator muss sie bestätigen (offene Frage 1).
- **hinweis:** Stiftweg (Z. 207) und Federfaktor (Z. 209) nutzen den auf 8 bis 30 begrenzten Weg, die Paketformel nimmt STIFT_BODEN unbegrenzt. Der Federfaktor passt zur gemessenen Bewegung (1,71/1,57/1,71/1,48/1,71). Bestätigung durch den Orchestrator (offene Frage 2).
- **hinweis:** Zeichenreihenfolge: In der Szene wird der Gehäusestift nach dem Halm gezeichnet (Z. 357 gegen Z. 336 bis 338 ohne Szene). Der Auftrag verlangt zugleich eine Gruppe aus beiden Stiften und unveränderte Reihenfolge, das ist widersprüchlich. Ohne sichtbare Wirkung: Der Gehäusestift reicht höchstens bis y=148, der Halm beginnt bei 150.
- **soll:** Bildbeleg 'Endlage höchstens 37 von 255, ca. 1.031 Pixel' ist nicht reproduzierbar. Bewegt und nach 3 s warten: mobil 3.336 von 72.674 Pixeln ungleich, Desktop 9.050 von 266.944 (max 101 bzw. 82). Ein Versatz um ein Pixel verschlechtert den Vergleich, also liegt es an der Kantenrasterung, nicht an einer Verschiebung. Statisch (reduzierte Bewegung): 0 Pixel Unterschied. Die Zahl im Bericht sollte korrigiert werden.
- **soll:** Beschriftungen auf dem Telefon sind ca. 9 px groß (Trennlinie 12, Code 13 Einheiten, Skalierung 358/480). K-008 1.8 verlangt ca. 11,5 px. Das gilt vorbestehend auch für die unveränderte Fehlerseite und ist nicht durch das Paket verursacht. Der Orchestrator entscheidet über Ausschnitt oder schmales Format.
- **hinweis:** Ein unbekannter zustand (z. B. 'unbekannt') wird als passt gezeichnet und aktiviert dann die Szene. Das ist konsistent mit der Zeichnung, weicht aber vom Wortlaut 'nur bei passt' ab. Dafür fehlt ein Testfall.
- **hinweis:** Der Logikwächter meldet für beide Dateien 'nicht im Protokoll', also ohne Vergleichsbasis. Die manuelle Lektüre des Diffs zeigt keine Geschäftslogik, nur Darstellung. Der Orchestrator sollte vor der Abnahme 'sichern' ausführen.
- **hinweis:** Die README (Abschnitt stiftzuhaltung) dokumentiert den Parameter szene noch nicht. Laut Paket ist das Aufgabe des Orchestrators und bleibt offen (offene Frage 3).
- **hinweis:** In Stufe 1 und 2 schneidet der Bildrand den Halm links ab. Das ist gewollt, weil der Schlüssel von außen einfährt, und kein Fehler.

## Bericht des Ausführenden (letzte Runde)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/components/visual/generators/stiftzuhaltung.tsx
- /home/user/schluesselmacher24/src/components/visual/generators/stiftzuhaltung.test.tsx

WAS UND WARUM
- Parameter szene: 'scroll' (nur bei zustand passt; bei passt-nicht und abgebrochen ohne Wirkung; andere Werte ohne Wirkung).
- Mit szene: scroll wird sm24-szene an GrafikRahmen angehängt (übergebene className zuerst, dann sm24-szene). Der Schlüssel (Halm, Reide, Reidenloch, Code) liegt in <g class="sm24-scrub-schluessel"> mit --schluessel-von = -244. Je Bohrung liegt ein <g class="sm24-scrub-stift"> mit Gehäusestift und Kernstift, --stift-von = 200 minus Spitze, auf 8 bis 30 begrenzt (Standardeinschnitte ergeben 30, 24, 30, 20, 30), --stift-nr 0 bis 4. Je Feder ein sm24-scrub-feder mit --feder-von = Länge Ausgangslage durch Länge Endlage (Standard 1,71 / 1,57 / 1,71 / 1,48 / 1,71) und --stift-nr. Die Prüfmarken liegen in <g class="sm24-scrub-pruefung">.
- Abweichungen vom Paket, jeweils begründet: (a) Einfahrwert -244 statt der Formel -70: -70 setzt die Halmspitze auf x=354 und damit hinter die Bohrungen 1 bis 3; umgesetzt ist -(Spitze.x - Bohrung 1) - 20, Spitze bei x=180, 20 Einheiten vor Bohrung 1. (b) Gehäusestift und Kernstift teilen eine Gruppe (Testvertrag: fünf Stiftgruppen), daher wird der Gehäusestift in der Szene nach dem Halm gezeichnet; bildlich ohne Wirkung, weil der Gehäusestift höchstens bis y=148 reicht und die Halmoberkante bei 150 liegt. (c) Der Stiftweg ist begrenzt; der Federfaktor nutzt denselben Weg.
- Ohne szene: Ausgabe zeichen-identisch zur vorherigen Fassung. Die Vergleichstexte vor der Änderung liegen unter /root/sm24-bilder/E6-GRAFIKER-11/vorher.json, nach der Änderung unter nachher.json; cmp meldet identisch. Der Test prüft zusätzlich Länge und FNV-Fingerabdruck.
- style enthält nur Zahlen ohne Einheit (Test). Exporte, Parameter und Standardwerte sind unverändert. Keine Änderung an globals.css, README oder Registry.

GEMEINSAME DATEIEN
- src/components/visual/README.md, Abschnitt stiftzuhaltung: Parameter szene (scroll, nur bei passt) dokumentieren. Vom Orchestrator zu ändern, nicht von mir.
- Keine Registry-Änderung nötig (VisualProps unverändert). Block B-25 in globals.css nur verwendet.

PRÜFUNG UND ERGEBNIS
- Ohne szene: 19 von 19 Vergleichsfällen identisch.
- npx tsc --noEmit: Exit 0, 0 Fehler im gesamten Projekt.
- npx eslint der zwei Dateien: Exit 0, keine Meldungen.
- npx vitest run src/components/visual: 28 Dateien, 786 Tests, alle bestanden (letzter Lauf nach allen Änderungen). stiftzuhaltung.test.tsx: 17 Tests, vorher 10, alle bestehenden erhalten, 7 neu. Neu geprüft: szene nur mit scroll und bei passt; ein Schlüssel mit negativem --schluessel-von; fünf Stift- und fünf Federgruppen mit --stift-nr 0 bis 4; --stift-von zwischen 8 und 30; --feder-von über 1; eine Prüfgruppe; gleiche Zeichenelemente wie ohne szene; nur Zahlen ohne Einheit in style; Determinismus; className-Reihenfolge; Fingerabdruck ohne szene.
- werte-suche.mjs (beide Dateien): Keine Funde, 2 Ausnahmen (rgb( und oklch( als Vertragsprüfung aus dem Bestand). JSON: /root/sm24-bilder/E6-GRAFIKER-11/werte-suche.json.
- Messfenster-Lock während aller Läufe nicht vorhanden. Nichts committet, nichts gelöscht, Hilfsdateien nur unter /root/sm24-bilder/E6-GRAFIKER-11/.
- Fremd geändert im Arbeitsbaum, nicht angefasst: src/components/visual/generators/schluessel.tsx und schluessel.test.tsx. tsc und vitest zeigen dafür keinen Fehler.

BILDBELEGE
- Aufnahmen: Chromium 1194, Viewport 1280 x 960, Szene über react-dom/server in eine Seite mit 1200 px Leerraum davor und danach, CSS über Tailwind CLI aus globals.css. Schriften: Systemschrift, nicht IBM Plex.
- Fünf Scrollpositionen (scrollY: Stufe, Zustand):
  - stufe-1-schluessel-draussen.png (348: Schlüssel -244, Stifte am Ausgang)
  - stufe-2-schluessel-halb-drin.png (540: Schlüssel -127,5)
  - stufe-3-schluessel-drin.png (756: Schlüssel 0, Stifte noch 19,5 bis 30 tief)
  - stufe-4-stifte-halb.png (780: Stifte 13 bis 25)
  - stufe-5-alles-ausgerichtet.png (972: alle Stifte 0, Prüfmarken sichtbar)
  - montage-fuenf-stufen.png: alle fünf Stufen nebeneinander
- Reduzierte Bewegung: reduziert-szene.png und reduziert-ohne-szene.png sind pixelgleich (Endlage wie heute).
- Normale Bewegung, Endlage gegen ohne szene: vergleich-ohne-szene-972.png und detail-vergleich-ohne-links-szene-rechts-differenz-unten.png. Ungefähr 1.031 Pixel weichen um höchstens 37 von 255 ab, nur an Kanten der Federzickzacks und des Halmrandes. Ursache ist Antialiasing, weil animierte Gruppen eine eigene Ebene bekommen. Keine Verschiebung. Die Feder-Transformation in der Endlage ist matrix(1,0,0,1,0,0).
- Messdaten: abtastung-960.json (Scrollraster 4 px), fotos-protokoll.json.

OFFENE FRAGEN
1. Einfahrwert -244 statt Paketformel -70 bestätigen (siehe oben).
2. Gruppenzuschnitt Gehäusestift/Kernstift und die geänderte Zeichenreihenfolge des Gehäusestifts in der Szene bestätigen.
3. Dokumentation des Parameters szene im README (Abschnitt stiftzuhaltung) übernehmen.
4. KERN-Version: Der Auftragstext nennt 1.12 und 1.8; zugrunde gelegt wurde 1.12 gemäß Kopfzeile von _werkstatt/KERN.md und Paket.

=== ENDE E6-GRAFIKER-11 · BEREIT ZUR RÜCKGABE ===
