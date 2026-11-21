# FA-INHALT-01C · Tutorials, Teil C: Videos direkt auf Leistungsseiten, kein Skript ohne Schalter, Cookie-Seite und Admin-Texte

Stand 21.11.2026. Startcommit 8a9d6ee. Der Baumeister wurde nach rund acht Minuten vom Nutzungslimit unterbrochen (Zwischenstand c5971fe); den Rest hat der Orchestrator selbst fertiggestellt, zwei Gegenprüfer (Lauf wf_ccd0527d-2af) haben den Stand geprüft, ihre 13 Befunde sind eingearbeitet. Dieser Bericht stammt deshalb vom Orchestrator. Keine echten Videos; YouTube wurde im Browser nie abgerufen (Attrappe). Anforderungen FA-21-02, FA-21-08 bis FA-21-14.

## Was Kunden jetzt sehen

1. Ohne den Schalter `SM24_VIDEOS=an` (der heutige Betrieb) ändert dieses Paket für Besucher nur eines: Im Zylinder-Konfigurator stehen die beiden Anleitungen („Maße“ und „Funktion“) als ein Block mit einer Überschrift.
2. Mit Schalter und hinterlegtem Video steht das Video direkt im Hinweis der Leistungsseite (Vorschau mit „Video laden“, darunter der Satz zur Datenübertragung und der Verweis auf die Schrittfolge). In Formularen bleibt es beim Verweis in neuem Fenster mit dem Kennzeichen „mit Video“.
3. Mit Schalter sagen Datenschutzerklärung, Übersicht der Verarbeitungen und die Seite Cookie-Einstellungen, was dann gilt (Entwürfe, siehe unten).

## Je Entscheidung der Paketdatei

| Nr. | Entscheidung | Umsetzung | Beleg |
|---|---|---|---|
| 1 | Alias ohne Schalter | `videoRahmenAlias` in `src/lib/tutorials/freigabe.ts`; `next.config.ts` setzt ihn in `turbopack.resolveAlias` und im `webpack`-Zweig, nur ohne Schalter. Ersatz `src/components/tutorial/video-rahmen-aus.tsx` (kein Client-Baustein). | Tests in `freigabe.test.tsx` (Regel; Turbopack bei leer, „aus“, „1“ und ganz ohne Variable; `webpack`-Funktion wirklich ausgeführt). Build ohne Schalter: 0 Dateien unter `.next/static` mit „Video laden“ oder `youtube-nocookie`. |
| 2 | Videos direkt auf Leistungsseiten | Neuer Baustein `TutorialHinweisSeite` (`tutorial-hinweis-seite.tsx`) auf den sechs Leistungsseiten; `TutorialHinweis` bleibt die Fassung für Formulare und importiert die Einbettung nie. `TutorialVerweis.video` reist nur mit, wenn das Video sichtbar ist. Kein `VideoObject` auf Leistungsseiten. | Tests `tutorial-hinweis-seite.test.tsx` (HTML ohne Schalter Zeichen für Zeichen gleich `hinweis-vorher.json`; Klick ausgeführt), `tutorial-grenze.test.ts` (Formular-Fassung ohne Einbettung im Importgraphen). Browser siehe unten. |
| 3 | Cookie-Einstellungen hinter dem Schalter | `cookie-einstellungen/page.tsx`: zwei neue Einleitungen und ein Satz unter der Liste, nur mit Schalter. `cookie-einstellungen.tsx` unberührt. | Test `page.test.tsx`: ohne Schalter beide Fassungen Zeichen für Zeichen wie vorher; mit Schalter nur Einleitung und der eine Satz anders. Browser: Seite ohne Schalter bytegleich mit dem Live-Stand. |
| 4 | Admin-Texte | `src/payload/collections/Tutorials.ts`: drei Beschreibungstexte berichtigt. `payload-types.ts` neu erzeugt: drei Kommentarzeilen geändert, sonst nichts. | Diff; Datenbanktests 190 grün. |
| 5 | Videoeintrag ohne `embedUrl` | Kommentar in `json-ld.tsx` und Betriebsanleitung berichtigt: Google verlangt `name`, `thumbnailUrl`, `uploadDate`; die Adresse des Players ist nur empfohlen und fehlt bewusst. | Dokumentation von Google Search Central zu Video-Strukturdaten, geprüft am 20.11.2026. |
| 6 | Fund in der Livegang-Prüfung für eine eigene Datenschutzerklärung im Admin | **Nicht gebaut** (Entscheidung des Orchestrators nach dem Limit-Ereignis, um das Kontingent zu schonen). Die Bedingung steht in der Betriebsanleitung, Abschnitt 4, und unter FÜR MENSCHEN. | offen, siehe OFFENE FRAGEN 1 |
| 7 | Konfigurator: ein Block | `konfigurator/page.tsx` fasst beide Orte zusammen, ohne Doppel. | Browser: genau ein Block mit beiden Verweisen, 412 und 1280 px. |
| 8 | `frame-src 'self' https://www.youtube-nocookie.com` | bestätigt, unverändert. | Antwortkopf mit Schalter. |

Zusätzlich aus der Gegenprüfung und der eigenen Sichtprüfung:
- Ortsangabe der Videos in den Texten hinter dem Schalter berichtigt („Tutorial-Seiten und Leistungsseiten“) in `datenschutz-inhalt.tsx` und `verarbeitungen.ts`. Ohne Schalter bleiben beide Zeichen für Zeichen gleich (Test gegen `freigabe-vorher.json`, Browser gegen den Live-Stand).
- Gezeichnete Vorschau: Die Dauer steht jetzt in der Kopfzeile („VIDEO · 2:47“), der Titel ist am Telefon auf zwei Zeilen begrenzt (ab 640 px drei) und schrumpft nicht. Vorher lief ein langer Titel bei 360 px unter den Knopf oder wurde mitten in der Zeile abgeschnitten. Der volle Titel steht im Namen des Knopfs und am Rahmen des Players.
- Betriebsanleitung `docs/betrieb/tutorials-videos.md` auf den Stand gebracht (Video auf Leistungsseiten, Cookie-Seite stellt sich mit dem Schalter um, welche Texte der Anwalt vor dem Schalter prüft).

## Belege (eigene Proben des Orchestrators, Skripte im Arbeitsordner der Sitzung)

**Kette auf dem Endstand:** Typprüfung, Lint, Unit-Tests (283 Dateien), Datenbanktests 190, Build ohne Datenbank 190 von 190; Zahlen im Abschnitt Abnahme.

**Ohne Schalter, Prüfserver gegen den Live-Stand (Messstand, Commit 0c2123d):**
- 17 Seiten (Start, `/tutorials`, alle acht Tutorial-Seiten, Datenschutzerklärung, Cookie-Einstellungen, Impressum, AGB, Kontakt, Shop, Ratgeber): Sicherheitsrichtlinie gleich, `<main>` Zeichen für Zeichen gleich, Strukturdaten gleich, keine Adresse von YouTube: 85 von 85.
- 16 von 16 Seitenbildern bytegleich (acht Seiten bei 412 und 1280 px).
- Was der Browser lädt (bis Netzruhe plus 5 s, 412 px): auf 14 von 15 Ansichten dieselbe Zahl Dateien und dieselben Kilobyte wie der Live-Stand; `/schluessel-einschicken` 26 statt 27 Dateien (307,0 statt 309,3 KB), nicht diesem Paket zuzuschreiben (Vorladen). Kein Bündel mit „Video laden“ im Build.
- Hinweise: alle Orte mit veröffentlichtem Tutorial zeigen den richtigen Verweis, Orte ohne Eintrag nichts (84 von 86; die zwei Abweichungen sind die Erwartung meiner Probe „genau ein Hinweis“ auf `/gleichschliessende-zylinder`, wo die drei Tutorials absichtlich an drei Abschnitten stehen: Grundprinzip, Funktion, Messhilfe; einzeln nachgeprüft). In den Formularschritten im Browser: Assistent Schritt „Fotos Ihres Schlüssels“ mit dem Verweis, Schritt „Zulassungsbescheinigung Teil I“ ohne; Konfigurator ein Block mit beiden Verweisen; neues Fenster, Zusatz sichtbar, 44 px, Formular bleibt im selben Schritt mit demselben Zwischenstand: 20 von 20.

**Mit Schalter, Kopie mit drei erfundenen Probevideos (nie committet), bei 412 und 1280 px:**
- Tutorial-Seite und drei Leistungsseiten (Vorlage, Schlüssel nach Code, Gleichschließende Zylinder): vor dem Klick kein Rahmen, keine fremde Anfrage, keine Adresse von YouTube in Server-HTML und DOM; „Video laden“ mit Tab erreichbar, Fokus sichtbar; nach Enter genau ein Rahmen von `https://www.youtube-nocookie.com/embed/…`, Titel am Rahmen, Fokus auf dem Player, Seitenhöhe unverändert, keine Layoutverschiebung, keine Meldung der Sicherheitsrichtlinie, kein Cookie, nichts gespeichert, nach dem Neuladen wieder die Vorschau. Je Seite 54 von 56; die zwei übrigen Punkte je Seite sind meine zu strenge Erwartung, der Player müsse deckungsgleich mit dem Rahmen sein (er sitzt um den 1 px breiten Rand innerhalb).
- Gezeichnete Vorschau mit langen Titeln bei 320, 360, 412, 768 und 1280 px auf vier Seiten: Text endet über dem Knopf, keine angeschnittene Zeile, Knopf 44 px: 20 von 20.
- Formularseiten und Startseite binden das Skript der Einbettung nicht in ihr eigenes HTML ein; es steht nur in den Bündeln der Leistungs- und Tutorial-Seiten (und wird von anderen Seiten höchstens vorgeladen, wenn sie auf diese verweisen).
- Datenschutzerklärung, Übersicht der Verarbeitungen und Cookie-Einstellungen zeigen ihre Fassung mit Videos.

## ENTWURF ZUR ANWALTLICHEN PRÜFUNG (R10; erscheint nur mit `SM24_VIDEOS=an`)

Ergänzt den Entwurf im Bericht FA-INHALT-01B. Dort ist an zwei Stellen „Tutorial-Seiten“ durch „Tutorial-Seiten und Leistungsseiten“ zu ersetzen (so steht es jetzt im Code): im neuen Absatz von Abschnitt 5 der Datenschutzerklärung, im Zweck der Verarbeitung und beim Dienstleister.

**Seite Cookie-Einstellungen, Einleitung ohne Statistik:**
„Diese Website setzt keine Analyse-, Werbe- oder Marketingdienste ein. Videos von YouTube bindet sie erst nach Ihrem Klick auf „Video laden“ ein; dabei kann YouTube Cookies setzen (siehe Datenschutzerklärung). Inhalte anderer Anbieter bindet sie nicht ein. Alles andere, was gespeichert wird, ist für die von Ihnen genutzten Funktionen technisch notwendig und liegt im lokalen Speicher Ihres Browsers. Eine Einwilligung ist dafür nicht erforderlich.“

**Einleitung mit Statistik:**
„Diese Website setzt keine Werbe- oder Marketingdienste ein. Für die Reichweitenmessung nutzen wir Google Analytics, aber nur, wenn Sie unten in „Statistik“ einwilligen. Videos von YouTube laden erst nach Ihrem Klick auf „Video laden“; dabei kann YouTube Cookies setzen (siehe Datenschutzerklärung). Alles Weitere, was gespeichert wird, ist für die von Ihnen genutzten Funktionen technisch notwendig und liegt im lokalen Speicher Ihres Browsers; dafür ist keine Einwilligung erforderlich.“

**Satz unter der Liste „Was genau gespeichert wird“:**
„Cookies, die YouTube nach Ihrem Klick auf „Video laden“ setzt, speichern nicht wir. Sie löschen sie über die Einstellungen Ihres Browsers.“

Fragen an den Anwalt (zusätzlich zu denen im Bericht FA-INHALT-01B): Genügt es, dass die Seite Cookie-Einstellungen YouTube nur in der Einleitung und in dem einen Satz nennt, ohne eigene Kategorie, weil die Zustimmung je Klick gilt und nicht gespeichert wird?

## OFFENE FRAGEN

1. **Eigene Datenschutzerklärung im Admin.** Ist dort ein eigener Text hinterlegt, ersetzt er den eingebauten samt dem Absatz zu YouTube. Ein technischer Riegel (Fund in der Livegang-Prüfung, wenn der Schalter gesetzt ist und der eigene Text „YouTube“ nicht nennt) ist nicht gebaut. Bis dahin gilt die Bedingung in der Betriebsanleitung.
2. **Skript mit Schalter.** Mit Schalter tragen die Bündel der Leistungs- und Tutorial-Seiten die Einbettung (rund 1,2 KB komprimiert), auch wenn das Tutorial der Seite kein Video hat. Das ist der Preis der Einbettung; ohne Schalter 0.
3. **`embedUrl` im Videoeintrag.** Bleibt weg. Sobald echte Videos da sind, lässt sich neu entscheiden, ob die Adresse des Players in den Strukturdaten stehen soll (sie löst keinen Abruf aus, stünde aber vor dem Klick im HTML).
4. **Titel der Videos.** Die gezeichnete Vorschau zeigt am Telefon höchstens zwei Zeilen (rund 50 Zeichen). Längere Titel werden mit „…“ gekürzt; mit eigenem Vorschaubild steht der volle Titel über dem Bild.

## FÜR MENSCHEN

- **Anwalt:** die Entwürfe prüfen (dieser Bericht und Bericht FA-INHALT-01B): Absatz zu YouTube in der Datenschutzerklärung, Eintrag in der Übersicht der Verarbeitungen und bei den Dienstleistern, Einleitungen und Satz auf der Seite Cookie-Einstellungen, Satz unter der Vorschau, Einwilligung durch den Klick ohne Speicherung.
- **Inhaber:** die geprüften Texte freigeben; Fassung und Stand der Datenschutzerklärung festlegen.
- **Betrieb:** erst danach `SM24_VIDEOS=an` bei Vercel setzen und neu bauen lassen (`docs/betrieb/tutorials-videos.md`). Ist im Admin eine eigene Datenschutzerklärung hinterlegt, muss sie den geprüften Absatz zu YouTube enthalten.
- **Inhaber und Team:** Videos liefern (YouTube-Link, Titel bis etwa 50 Zeichen, Dauer, Datum, eigenes Vorschaubild, Transkript); die Tutorials „Angaben im Fahrzeugschein“ und „Gehäuseumbau“ fachlich prüfen und veröffentlichen.

=== ENDE FA-INHALT-01C ===

## Abnahme durch den Orchestrator (2026-11-21 03:50 MEZ, gemeinsam für FA-INHALT-01B und FA-INHALT-01C)

- **Kette auf dem Endstand:** Typprüfung grün, Lint grün, Unit-Tests 4392 (283 Dateien), Datenbanktests 190, Build ohne Datenbank 190 von 190 (Next.js 16.4.6).
- **Ohne Schalter gegen den Live-Stand (0c2123d):** Sicherheitsrichtlinie, `<main>` und Strukturdaten auf 17 Seiten gleich (85 von 85), 16 von 16 Seitenbildern bytegleich, auf 15 Ansichten kein zusätzliches Skript, kein Bündel der Einbettung im Build. Neu sichtbar sind nur die Tutorial-Hinweise an neun Orten.
- **Hinweise:** alle Orte geprüft, Formularschritte im Browser (Assistent, Konfigurator, Vorlage-Anfrage): neues Fenster, Zusatz sichtbar, Zwischenstand bleibt.
- **Mit Schalter (Kopie mit erfundenen Probevideos):** vor dem Klick kein Abruf und keine Adresse von YouTube, nach dem Klick nur der eine Rahmen, Fokus auf dem Player, kein Sprung, nichts gespeichert; Vorschau bei 320 bis 1280 px ohne Überlauf.
- **Zwei Gegenprüfungen:** Lauf wf_be5ef52c-985 (11 Befunde, 5 rot) und Lauf wf_ccd0527d-2af (13 Befunde, 4 rot); alle roten behoben, gelbe behoben oder im Bericht FA-INHALT-01C als offen benannt.
- **Nicht gebaut:** Fund in der Livegang-Prüfung für eine eigene Datenschutzerklärung im Admin (steht als Bedingung in der Betriebsanleitung).
- **Zwischenfall (aus der Umsetzung von 01B):** Ein Testlauf startete einmal eine Anfrage an `youtube-nocookie.com`, die beim Abbau des Tests abgebrochen wurde; ob sie den Rechner verließ, ist nicht feststellbar. Der Test sperrt seitdem das Laden von Rahmen und `fetch`.
- Entscheidung A-084; für Menschen MA-63.
