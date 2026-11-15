# FA-SOFORT-05 · Hub „Wobei können wir Ihnen helfen?“ mit den 14 Hauptzugängen des Inhabers

Kopf: Etappe FA Priorität 1 · Rolle Baumeister · Modell Opus · Stufe 3 (erster Bildschirm, gemeinsame Dateien) · Kostenklasse M · ändert das Datenschema (Werteliste der Symbole) und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-03-01 bis FA-03-16, FA-06-05, FA-06-06, FA-06-14, FA-01 (für ältere Kunden bedienbar) · Voraussetzung: FA-KERN-02B ist abgenommen (die Einstiegsseiten und Anfragewege der vier neuen Fahrzeugklassen stehen).

## Aufgabe in einem Satz
Der Hub im ersten Bildschirm zeigt genau die 14 Hauptzugänge des Inhabers in seiner Reihenfolge, jede Kachel führt auf eine Seite, die es gibt, und auf dem Telefon stehen alle Kacheln und die Zeile „Anrufen“ ohne Scrollen im Bild.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 03)
„Der Bereich ‚Wobei können wir Ihnen helfen?‘ gefällt grundsätzlich und soll erhalten bleiben. Inhaltlich muss er jedoch bereinigt und erweitert werden.“
Gewünschte Hauptzugänge: Autoschlüssel · Motorradschlüssel · Roller und Kleinstfahrzeuge · E Scooter und ähnliche Elektrofahrzeuge · Seniorenmobile und vergleichbare Fahrzeuge · Fahrradschlüssel · Schlüssel einschicken beziehungsweise Schlüssel nach Vorlage · Schlüssel nach Code · Sperrschließungen und gleichschließende Zylinder · Schließanlagen · Elektronische Zutrittslösungen · Sicherheitstechnik · Service vor Ort nach Termin · Allgemeine Anfrage für Sonderfälle.
Die Kachel „Schlüssel nach Foto“ ist bereits entfernt (FA-SOFORT-03).

## Entscheidung (A-052), so bauen
1. Rubrikdaten (`content/rubriken.json` und gleichlautend `src/lib/data/defaults/rubriken.ts`): Im Hub stehen genau diese 14 Rubriken in dieser Reihenfolge (Feld `reihenfolge` in Zehnerschritten):
   1. `autoschluessel` · Autoschlüssel · `/autoschluessel`
   2. `motorradschluessel` · Motorradschlüssel · `/motorradschluessel`
   3. neu `roller-und-kleinstfahrzeuge` · Roller und Kleinstfahrzeuge · `/roller-und-kleinstfahrzeuge` · Symbol `roller`
   4. neu `e-scooter` · E-Scooter und ähnliche Elektrofahrzeuge · `/e-scooter` · Symbol `e-scooter`
   5. neu `seniorenmobile` · Seniorenmobile und vergleichbare Fahrzeuge · `/seniorenmobile` · Symbol `seniorenmobil`
   6. neu `fahrradschluessel` · Fahrradschlüssel · `/fahrradschluessel` · Symbol `fahrradschluessel`
   7. `schluessel-nach-vorlage` · Schlüssel nach Vorlage oder einschicken · `/schluessel-nach-vorlage` (die Seite führt schon in beide Wege; `schluessel-einschicken` bleibt eine eigene Seite, ohne Kachel)
   8. `schluessel-nach-code` · Schlüssel nach Code
   9. `sperrschliessung` · Sperrschließungen und gleichschließende Zylinder · `/gleichschliessende-zylinder`
   10. `schliessanlage` · Schließanlagen
   11. `elektronische-schliesssysteme` · Elektronische Zutrittslösungen (Name ändern, Kennung und Adresse bleiben)
   12. `sicherheitstechnik` · Sicherheitstechnik
   13. `schluesseldienst-vor-ort` · Service vor Ort nach Termin (Name ändern, Kennung und Adresse bleiben; kein Wort, das einen Notdienst-Laden verspricht, R9)
   14. `beratung` wird zur Kachel „Allgemeine Anfrage“ mit der Erklärung „für Sonderfälle“: Prüfe, welcher bestehende Weg eine freie Anfrage ohne Rubrik annimmt (`/service-und-termin/anfrage` oder `/beratung`), und nimm den, der ohne Vorwissen funktioniert. Die Beratungsseite bleibt erreichbar (Navigation „Mehr“).
   Nicht mehr im Hub (Seite und Navigation bleiben): `autoschluessel-gehaeuse` (wird Shop-Kategorie, FA-SHOP-02).
   Jede Rubrik hat einen kurzen Kachelnamen für das Telefon (`laienname` oder das vorhandene Feld dafür: höchstens zwei Wörter je Zeile, zum Beispiel „Roller“, „E-Scooter“, „Seniorenmobil“, „Fahrrad“, „Nach Vorlage“, „Nach Code“, „Zylinder“, „Zutritt“, „Vor Ort“, „Anfrage“) und den vollen Namen des Inhabers als zugänglichen Namen und ab Tablet. Für die vier neuen Rubriken: `ablauf`, `abschluss` (`anfrage`), `pflichtUploads` und `nachweis` so, wie FA-KERN-02B den Weg gebaut hat (Bericht `berichte/FA-KERN-02B.md`, Abschnitt GEMEINSAME DATEIEN); nichts erfinden.
2. Symbole: `roller`, `e-scooter`, `seniorenmobil`, `fahrradschluessel` (liegen seit FA-SOFORT-05A in `src/components/visual/fach-icon.tsx`) in `RUBRIK_ICONS` (`src/lib/rubriken.ts`) aufnehmen; additive Migration für die Werteliste (`sicher.sh --pg -- npx payload migrate:create rubrik_symbole_fahrzeugklassen`), `src/migrations/index.ts`, `src/payload-types.ts`. Seed: neue Rubriken anlegen, geänderte Namen und Hub-Haken über den vorhandenen Abgleich (Startwerte, `umbenannt`), wiederholbar; Datenmigration für bestehende Datenbanken wie in `20261115_120000_rubrik_nach_vorlage` (dort steht, welche Spalten es in der Versionstabelle gibt; teste gegen die Datenbank, bevor du fertig meldest).
3. Raster (`src/components/hub/intent-hub.tsx`, `hub-kachel.tsx`): 14 Kacheln. Ab 768 px vier Spalten ohne Leitkachel (4, 4, 4, 2); die letzte Reihe steht linksbündig. Telefon: drei Spalten in fünf Reihen (3, 3, 3, 3, 2). Bei 390 × 844 stehen Frage, Satz, alle 14 Kacheln und die Zeile mit Telefon und Erreichbarkeit vollständig über der unteren Leiste; bei 360 × 780 mindestens zwölf Kacheln. Mittel dafür in dieser Reihenfolge: Kacheln flacher (Symbol kleiner, ein bis zwei Zeilen Text, Innenabstand knapper), Abstand zwischen Frage, Satz und Raster knapper, der Satz unter der Frage auf dem Telefon höchstens zwei Zeilen. Schrift der Kachel nicht unter 13 px, Trefferfläche mindestens 44 × 44 px, Fokusrahmen sichtbar. Das größte Element bleibt die Frage. Kein Wischen, kein Karussell, kein Einklappen. Passe `hubRaster` und seine Tests an die neue Regel an (die Regel ändert sich, weil der Inhaber die Zahl der Zugänge festgelegt hat; keine Prüfung lockern, G8).
4. Navigation (`src/lib/navigation.ts`) und Fuß: Die vier neuen Rubriken erscheinen in der Gruppe „Autoschlüssel“ unter einer Zwischenzeile „Weitere Fahrzeuge“ (oder der vorhandenen Entsprechung), der Name „Elektronische Zutrittslösungen“ und „Service vor Ort nach Termin“ überall gleich (Navigation, Fuß, Brotkrumen, `llms.txt`, Sitemap-Beschriftungen). Suche im ganzen Repository nach den alten Namen „Elektronische Schließsysteme“ und „Schlüsseldienst vor Ort“ als sichtbarem Text und gleiche sie an; Adressen bleiben.
5. Index-Regel: Die vier Einstiegsseiten aus FA-KERN-02B stehen auf `noindex`, bis sie freigegeben sind. Gib sie frei (Schalter aus FA-KERN-02B), wenn jede Seite die Probe besteht: eigener Nutzen für den Kunden, kein Platzhalter, kein doppelter Text (R2, R3). Besteht eine Seite die Probe nicht, bleibt sie auf `noindex` und steht im Bericht unter OFFENE FRAGEN; die Kachel gibt es trotzdem.
6. Startseite (`src/app/(site)/page.tsx`): Nur was der Hub braucht. Der Satz unter der Frage bleibt der Wortlaut aus `content/seo.json` (FA-SOFORT-02).

## Schreibrechte
content/rubriken.json, src/lib/data/defaults/rubriken.ts, src/lib/rubriken.ts, src/payload/collections/Rubriken.ts (nur Werteliste und Hilfetexte), neue Migration, src/migrations/index.ts, src/payload-types.ts, src/payload/seed.ts (nur Rubriken), src/components/hub/**, src/lib/navigation.ts, src/components/layout/** (nur Namen und neue Einträge), src/app/(site)/page.tsx (nur Hub), src/app/llms.txt/** und src/app/sitemap.ts (nur Namen und neue Seiten), der Index-Schalter aus FA-KERN-02B; zugehörige Tests; `_werkstatt/ausbau/berichte/FA-SOFORT-05.md`.
Nicht anfassen: die Seiten und Formulare der Rubriken selbst, Preise, Rechtstexte, `content/seo.json` außer sichtbaren Rubriknamen, Farben und Marke.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build` (Seitenzahl nennen)
- Rechne die Höhe des ersten Bildschirms bei 390 × 844 aus den Klassen nach und nenne die Rechnung im Bericht; die Sichtprobe im Browser macht der Orchestrator (Bilder bei 360, 390, 768, 1024, 1440).
- Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs` (G12). Kein Server, kein git.

## Grenzen
G6 (additive Migration, JSON-Fallback, Seed wiederholbar), G8, G9, R1, R2, R3, R4, R9, R13. Texte kurz, verständlich, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen, Höhenrechnung) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SOFORT-05 · BEREIT ZUR RÜCKGABE ===
