# FA-INHALT-04B · Bilder, Teil B: Wortmarke unten rechts, Alt-Text und Datenschutz-Angaben an der Medienablage, Betreiberanleitung

Kopf: Etappe FA Priorität 5 · Rolle Baumeister · Modell Opus · Stufe 3 (Medienablage, Datenmodell) · Kostenklasse M · ändert das Datenschema und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-20-05 bis FA-20-07, FA-04 (Bilder mit Branding), FA-22-31 · Befunde: `berichte/FA-ABGLEICH.md` Block 09, `berichte/FA-BLINDPRUEFUNG-09.md` · Voraussetzung: FA-INHALT-04 (Teil A) ist abgenommen; lies zuerst `berichte/FA-INHALT-04.md`, Abschnitt „Stand für Teil B“, und die Paketdatei `pakete/FA-INHALT-04.md` (Vorgabe des Inhabers im Wortlaut, Punkte 3, 4 und 6).

## Aufgabe in einem Satz
Der Betreiber kann ein eigenes Foto beim Hochladen dezent mit der Wortmarke versehen, gibt an, ob Kennzeichen oder Personen zu sehen sind, und findet in einer kurzen Anleitung, wie ein Foto auf die Seite kommt.

## Vorgabe des Inhabers (wörtlich, Abschnitte 20 und 04)
„Hochwertige Bilder aus eigenem Bestand können dezent mit Logo unten rechts versehen werden. Bilder technisch für schnelle Ladezeiten optimieren und mit sinnvollen Alt Texten versehen.“ · „Bilder aus dem eigenen Betrieb können dezent mit Schlüsselmacher24 Branding beziehungsweise Logo unten rechts versehen werden, sofern das Bild dadurch nicht unruhig wirkt.“ · „Fahrzeuge und Arbeitssituationen, soweit datenschutzrechtlich sauber.“

## So bauen
1. Wortmarke unten rechts (Punkt 3 der Paketdatei): in der Medienablage ein Haken „Mit Wortmarke versehen“ (Standard aus) und beim Hochladen eine zweite, gebrandete Fassung des Bildes: Wortmarke „SCHLÜSSELMACHER24“ mit orangefarbener 24 als Vektor in der Seitenschrift, unten rechts, mit Abstand zum Rand, halbtransparent auf einer ruhigen Fläche, Breite höchstens ein Fünftel des Bildes. Nutze die Bildverarbeitung, die der Bestand für die Größen der Medienablage schon einbindet (keine neue Bibliothek, G7). Das Original bleibt unverändert gespeichert; die Seite nimmt die gebrandete Fassung nur, wenn der Haken gesetzt ist. Das alte Logo bleibt unberührt (G9); die Wortmarke ist die der Seite. Test mit einem erkennbar erfundenen Testbild.
2. Alt-Text und Datenschutz (Punkt 4): Alt-Text bleibt Pflicht, mit Hilfetext und Beispiel. Neu ein Pflichtfeld „Auf dem Bild sind“ (nichts davon · Fahrzeug mit Kennzeichen · Personen) und, wenn Kennzeichen oder Personen gewählt sind, die Bestätigungen „Kennzeichen unkenntlich gemacht“ beziehungsweise „Einwilligung der abgebildeten Personen liegt vor“; ohne Bestätigung lässt sich das Bild nicht auf der Seite verwenden (Prüfung an der einen Stelle, über die jede Bildstelle ihr Bild bezieht; Bestand im Admin bleibt verwendbar, für ihn gilt „nichts davon“ als Startwert nur, wenn das Bild heute schon auf der Seite steht, sonst leer und Pflicht beim nächsten Speichern: beschreibe die gewählte Regel). Kundenuploads (Unterlagen, Schlüsselfotos) sind davon nicht betroffen. Kurzer Hinweistext, keine Rechtsberatung.
3. Betreiberanleitung `docs/betrieb/bilder-pflegen.md` (Punkt 6): Foto aufnehmen (Querformat, Licht, ruhiger Hintergrund), hochladen, Alt-Text schreiben, Angabe zu Kennzeichen und Personen, Wortmarke, Bildstelle zuordnen (nach der Liste `BILDBEDARF.md` aus Teil A).

## Schreibrechte
src/payload/collections/Medien.ts, src/payload/hooks/** (Medien), neue Migration (`sicher.sh --pg -- npx payload migrate:create medien_wortmarke`), src/migrations/index.ts, src/payload-types.ts, src/lib/data/** (nur Abbildung der Medienfelder), src/lib/types.ts (nur Bildtypen), src/components/ui/image-placeholder.tsx (nur Wahl der Fassung), docs/betrieb/bilder-pflegen.md, zugehörige Tests, _werkstatt/ausbau/berichte/FA-INHALT-04B.md.
Nicht anfassen: Texte, Preise, Navigation, Rechtstexte, die Upload-Strecke für Kundenunterlagen.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --pg -- npx vitest run -c vitest.db.config.ts`, `… --json -- npm run build`. Tests, die nicht fehlen dürfen: Original bleibt bytegleich; gebrandete Fassung nur mit Haken; Bild mit Personen ohne Bestätigung erscheint nicht auf der Seite; Bestand bleibt sichtbar. Kein Server, kein git.

## Grenzen
G4, G6, G7, G8, G9 (altes Logo unberührt), G13 (keine Fotos ohne Freigabe committen; Testbilder sind erkennbar erfunden), R4, R10, R11. Texte kurz, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-04B · BEREIT ZUR RÜCKGABE ===
