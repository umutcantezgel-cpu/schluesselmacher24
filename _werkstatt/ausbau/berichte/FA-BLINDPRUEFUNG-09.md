# FA-BLINDPRUEFUNG-09 · Blindprüfung Abschnitte 20 und 21 (Bilder, Tutorials, Videos)

Quelle: `_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt`, Zeilen 462–486. Ich habe nur gelesen und keine Projektbefehle ausgeführt.
Der Kundschafterbericht `berichte/FA-KUNDSCHAFTER-09.md` existiert nicht. Geprüft habe ich deshalb nur die Urteile aus dem Auftrag.

## Vollständigkeit
- Abschnitt 20 hat einen Einleitungssatz und 6 Punkte. Der Kundschafter führt sie als FA-20-01 bis 20-08; Optimierung und Alternativtexte stehen getrennt. Alles ist abgedeckt.
- Abschnitt 21 hat eine Einleitung mit Rubrik und Einbettung, 10 Tutorialthemen und einen Schlusskasten. Der Kundschafter führt sie als FA-21-01 bis 21-14. Alles ist abgedeckt.
- Übersehene Anforderungen: keine.

## Korrekturen (Urteil geändert)
- **FA-21-05 fehlt → teilweise.** `src/components/autoschluessel/optionen.ts:133-139` (VIN_INFO) erklärt, wo eine Angabe steht: „Die 17-stellige Fahrgestellnummer steht in der Zulassungsbescheinigung unter Feld E“. Dazu kommen das Beispiel in `optionen.ts:209-213` (REGISTRATION_EXAMPLE) und der Schritt „Zulassungsbescheinigung Teil I“ in `autoschluessel/anfrage/assistent.tsx:140-145`. Die Aussage des Kundschafters, es fehle „jede Erklärung“, stimmt also nicht. Es fehlt ein eigenes Tutorial mit allen Feldern, etwa HSN/TSN (2.1/2.2). Diese Angaben nicht erfinden (R4).
- **FA-21-12 fehlt → teilweise.** Die Seite `/autoschluessel/gehaeuse` existiert: `src/app/(site)/autoschluessel/gehaeuse/page.tsx`, dazu `anfrage/`. Ihr Ablauf aus Rubrikdaten hat vier Schritte: Fotos, Preis, Einschicken, Rückversand (`src/lib/data/defaults/rubriken.ts:94-131`). Abschnitt 02 heißt „Wann ein neues Gehäuse hilft“ (page.tsx:75). Die Behauptung „keine Seite autoschluessel-gehaeuse“ ist überholt. Es fehlen das Tutorial, das Video und Vorher-Nachher-Bilder.

## Sachfehler ohne Urteilsänderung
- **FA-20-07:** Eine Umwandlung in WebP fehlt nicht. Ohne `images`-Block in next.config.ts arbeitet der Standard-Optimierer von next/image (`/_next/image`) und liefert WebP. AVIF ist nicht eingeschaltet. Richtig bleibt: Ausgeliefert wird nur die Quelle `mittel` mit 960 px (`payload-mapping.ts:105-113`), das deckelt breite Flächen. Kopfbilder sind nicht vorgeladen. Das Urteil „teilweise“ bleibt.
- **FA-20-08:** Fachgrafiken sind nicht aria-hidden. Sie tragen `role="img"` und einen `<title>`, der aus ihren Parametern entsteht, etwa „Maßzeichnung eines Schließzylinders“ (registry.test.tsx:128-149, generators/*). aria-hidden ist nur die Icon-Fläche (bild-flaeche.tsx:78). Der Alternativtext für Fotos ist Pflicht (Medien.ts:40-45). Das Urteil „erfuellt“ für die Technik bleibt. Echte Fotos gibt es noch nicht.

## Bestätigt (am Code nachgeprüft)
20-01, 20-02, 20-03, 20-04, 20-05, 20-06, 20-07, 20-08, 21-01, 21-02, 21-04, 21-07, 21-10, 21-11, 21-13 und 21-14.
- Kein public-Ordner. Einziges Bild im Laufzeitcode ist `src/app/icon.svg`. Unter `_werkstatt/` und `docs/wert/belege` liegen nur Bildschirmfotos.
- Kein Treffer für YouTube oder iframe. Weder Leistungsseiten noch Ratgeber haben ein Videofeld. Die Ratgeber-Abschnitte bestehen nur aus Textfeldern (Ratgeber.ts:19-29).
- Die CSP hat kein frame-src, `default-src 'self'` gilt (next.config.ts:30-42). Die Datenschutzerklärung schließt fremde Videos aus (datenschutz-inhalt.tsx:157, 163).
- `_werkstatt/ausbau/logo/` enthält nur .gitkeep. sharp ist nur in der Payload-Konfiguration eingebunden. Code für ein Logo-Overlay gibt es nicht.

## Wichtigster Zusatzbefund (Pflegbarkeit, Maßstab 29)
16 der 36 Bildstellen (`<ImagePlaceholder>`/`<KompaktBild>` in src/app und src/components) haben ihr `slot={{…}}` fest im Code. Beispiele sind `service-und-termin/kontakt/page.tsx:165-178`, `tuer-und-schliesstechnik/page.tsx:164-170` und die Beispielbilder an den Upload-Feldern (`optionen.ts` KEY_PHOTO_SLOTS). Dort kann der Betreiber auch nach dem Hochladen kein Foto zuordnen, nur ein Entwickler. Der Weg „Foto hat Vorrang“ (FA-20-01) wirkt nur bei Bildstellen, deren Daten aus Payload kommen (`bildFeld`).

## Risiken für den Bau
1. **YouTube:** Nach § 25 TDDDG und DSGVO braucht es vor dem Laden eine Einwilligung (Zwei-Klick-Lösung oder youtube-nocookie mit Vorschaubild). Dafür ist im Code eine neue Freigabe in der CSP (frame-src, img-src für Vorschaubilder) nötig. Dazu kommen die Einwilligungskategorie (komfort ist heute ohne Dienst) und eine Änderung der Datenschutzerklärung. Beides ist ein Rechtstext und Einwilligungsverhalten nach G9, also Entwurf und Freigabe durch den Inhaber.
2. **Fotos von Personen und Fahrzeugen:** Für Personen braucht es eine Einwilligung (§ 22 KUG, DSGVO), Kennzeichen sind unkenntlich zu machen. Die Medienbibliothek hat dafür weder ein Feld noch einen Hinweis.
3. **EXIF/GPS:** `Medien.read` ist öffentlich und das Original wird mit abgelegt. `medienBild` greift auf `bild.url` zurück, wenn `mittel` fehlt. Hochgeladene Handyfotos können so Ortsdaten der Werkstatt oder von Kunden preisgeben. Vor dem Fotolauf sollte das Original von Metadaten bereinigt werden. OFFENE FRAGE: Ist die Original-URL öffentlich abrufbar? Das hängt von der Ablage und vom Plugin ab und ist hier nicht prüfbar.
4. **Logo-Overlay:** Das Logo ist geschützt (G9), eine Logodatei liegt nicht vor. Das Logo dauerhaft ins Bild zu rendern ist nicht umkehrbar. Ein CSS-Overlay mit Schalter pro Bild ist sicherer.
5. **Herstellermarken auf Fotos** (Maschinen, Programmiergeräte, Zylinder) nur sachlich zeigen (R12). Keine Herstellerbilder (R11).
6. **Videos nicht hochladen:** Uploads sind auf 4,5 MB begrenzt (Vercel, siehe Medien.ts). Videos also nur über YouTube-ID oder -Adresse in einem Payload-Feld einbinden.
7. **Bestehende Tests:** `registry.test.tsx` und `image-placeholder.test.tsx` legen Rolle und Titel der Grafiken fest. Ein neuer Typ „Tutorial“ in BEREICHE oder Ratgeber braucht eine additive Migration (G6) und einen JSON-Fallback in content/*.json. Die Navigationstests (MEHR_LINKS) prüfen.
8. **Tutorials:** Keine Doppelinhalte mit dem Ratgeber (R3). Tutorials sollten vorhandene Erklärungen verlinken oder in sie übergehen, etwa content.ts:557 ff. und guides.json zum Zylindermessen.
