# FA-INHALT-04 · Bilder: eigene Fotos schnell und sauber einsetzen (Logo unten rechts, Alt-Text, Datenschutz-Haken, Bildstellen aus dem Admin füllen)

Kopf: Etappe FA Priorität 5 · Rolle Baumeister · Modell Opus · Stufe 3 (Medienablage, Datenmodell) · Kostenklasse M bis L · ändert das Datenschema und nutzt `sicher.sh --pg` · Anforderungen FA-20-01 bis FA-20-07, FA-04 (Bilder mit Branding), FA-25-14, FA-22-31 · Befunde: `berichte/FA-ABGLEICH.md` Block 09, `berichte/FA-BLINDPRUEFUNG-09.md`.

## Aufgabe in einem Satz
Bereite die Seite so vor, dass der Betreiber echte Fotos aus Werkstatt und Büro im Admin hochlädt und sie ohne Entwickler an den vorgesehenen Bildstellen erscheinen: optimiert, mit Alt-Text, auf Wunsch dezent mit der Wortmarke unten rechts, und mit einer Prüfung auf Kennzeichen und Personen.

## Vorgabe des Inhabers (wörtlich, Abschnitte 20 und 04)
„Auf der Seite fehlen deutlich zu viele Bilder. Sie darf nicht hauptsächlich aus Text, Icons und Formularen bestehen. Echte Bilder aus Werkstatt und Büro. Maschinen, Fräsarbeiten, Programmiergeräte, Schlüssel, Gehäuse, Zylinder und Schließanlagen. Fahrzeuge und Arbeitssituationen, soweit datenschutzrechtlich sauber. Vorher Nachher Bilder bei Gehäuseumbauten und Reparaturen. Hochwertige Bilder aus eigenem Bestand können dezent mit Logo unten rechts versehen werden. Bilder technisch für schnelle Ladezeiten optimieren und mit sinnvollen Alt Texten versehen.“ · „Bilder aus dem eigenen Betrieb können dezent mit Schlüsselmacher24 Branding beziehungsweise Logo unten rechts versehen werden, sofern das Bild dadurch nicht unruhig wirkt.“

## Lage
Es liegen keine Fotos vor (MA-05). Die Seite hat Bildstellen (`ImageSlot` mit `motif`), die sich aus Daten zeichnen, solange kein Foto hinterlegt ist. Erfundene oder generierte Bilder, die als echte Werkstatt gelten könnten, sind ausgeschlossen (R4).

## So bauen
1. Bildstellen-Verzeichnis: Erhebe alle Bildstellen der Seite (jede `ImageSlot`- und Platzhalter-Verwendung in `src` und `content`) mit Seite, Motivbeschreibung, Seitenverhältnis und ob sie im Admin schon ein Foto annehmen kann. Schreibe daraus `_werkstatt/ausbau/BILDBEDARF.md` als Aufnahmeliste für den Inhaber (nach Seiten geordnet, je Motiv ein Satz, Querformat oder Hochformat, Hinweis zu Kennzeichen und Personen) und nenne die Zahl.
2. Jede Bildstelle wird aus dem Admin füllbar: Wo eine Bildstelle heute nur gezeichnet wird und kein Feld hat, bekommt der zugehörige Datensatz (Seite, Leistungsseite, Rubrik, Produkt, Ratgeber, Tutorial) ein Bildfeld aus der Medienablage, oder es entsteht eine kleine Sammlung „Bildstellen“ mit Schlüssel und Bild, die der Betreiber nach Liste füllt. Wähle den Weg mit den wenigsten Feldern und beschreibe ihn. Ohne Foto bleibt die Zeichnung.
3. Wortmarke unten rechts: In der Medienablage ein Haken „Mit Wortmarke versehen“ (Standard aus) und beim Hochladen eine zweite, gebrandete Fassung des Bildes: Wortmarke „SCHLÜSSELMACHER24“ mit orangefarbener 24 als Vektor in der Seitenschrift, unten rechts, mit Abstand zum Rand, halbtransparent auf einer ruhigen Fläche, Breite höchstens ein Fünftel des Bildes. Nutze die Bildverarbeitung, die der Bestand für die Größen der Medienablage schon einbindet (keine neue Bibliothek). Das Original bleibt unverändert gespeichert; die Seite nimmt die gebrandete Fassung nur, wenn der Haken gesetzt ist. Test mit einem erfundenen Testbild.
4. Alt-Text und Datenschutz: Alt-Text bleibt Pflicht, mit Hilfetext und Beispiel. Neu ein Pflichtfeld „Auf dem Bild sind“ (nichts davon · Fahrzeug mit Kennzeichen · Personen) und, wenn Kennzeichen oder Personen gewählt sind, die Bestätigungen „Kennzeichen unkenntlich gemacht“ beziehungsweise „Einwilligung der abgebildeten Personen liegt vor“; ohne Bestätigung lässt sich das Bild nicht auf der Seite verwenden. Kurzer Hinweistext, keine Rechtsberatung.
5. Ladezeit: Bilder über die Bildkomponente von Next mit festen Seitenverhältnissen, passenden Größenangaben und modernen Formaten; lies die Anleitung in `node_modules/next/dist/docs` zu Bildern und prüfe die erlaubten Quellen in `next.config.ts` (Datei nur ändern, wenn nötig; nenne es im Bericht). Bilder unterhalb des ersten Bildschirms werden nachgeladen; das größte Bild im ersten Bildschirm wird vorrangig geladen.
6. Betreiberanleitung `docs/betrieb/bilder-pflegen.md`: Foto aufnehmen (Querformat, Licht, ruhiger Hintergrund), hochladen, Alt-Text schreiben, Wortmarke, Bildstelle zuordnen.

## Schreibrechte
src/payload/collections/Medien.ts und die betroffenen Sammlungen (nur Bildfelder), neue Migration (`sicher.sh --pg -- npx payload migrate:create bilder`), src/migrations/index.ts, src/payload-types.ts, src/payload/hooks/** (Medien), src/lib/data/** (Mapping der Bildfelder), src/lib/types.ts (nur Bildtypen), src/components/ui/image-placeholder.tsx und die Bildkomponenten unter src/components/visual, Seiten nur für die Übergabe des Bildes an die Bildstelle, docs/betrieb/bilder-pflegen.md, _werkstatt/ausbau/BILDBEDARF.md, zugehörige Tests, _werkstatt/ausbau/berichte/FA-INHALT-04.md.
Nicht anfassen: Texte, Preise, Navigation, Rechtstexte.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --pg -- npx vitest run -c vitest.db.config.ts`, `… --json -- npm run build`. Kein Server, kein git.

## Grenzen
G4, G6, G7, G8, G13 (keine Fotos ohne Freigabe committen; Testbilder sind erkennbar erfunden), R4, R10, R11. Texte kurz, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN (Aufnahmeliste).
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-04 · BEREIT ZUR RÜCKGABE ===
