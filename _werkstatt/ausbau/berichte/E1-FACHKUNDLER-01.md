# E1-FACHKUNDLER-01 · Bericht Schließtechnik: Systeme, Anlagenarten, ABUS und BKS

## GEÄNDERTE DATEIEN

Keine Projektdatei. Neu geschrieben: /home/user/schluesselmacher24/_werkstatt/ausbau/erhebung/E1-schliesstechnik-systeme.md (1.732 Wörter) und diese Datei.

## WAS UND WARUM

Erhebung zu Anlagenarten, ABUS- und BKS-Systemen, Schlüsselkennzeichnung, Normen und zum Einsatz für Privat oder Unternehmen, als Grundlage für Konfigurator und Fachseiten. Der Bestand wurde gegen die Erhebung geprüft. Geändert wurde nichts.

Befunde:

- Die Systemseite zählt „Die fünf Systeme“. Die Komponente beschreibt vier Schließsysteme. Die fünfte Karte „Erweiterbare Anlage“ ist laut eigenem Text kein Schließsystem.
- Die Hauptschlüssel-Zentralschlossanlage (KHZ) fehlt. Die Quellen widersprechen sich zu ihrer Wirkung.
- DIN EN 1303:2026-08 ist laut DIN-Seite aktuell und ersetzt die Ausgabe 2015. Schließanlagen-Zylinder sind jetzt erfasst. VdS 2156-1 gilt nur für Einzelschließungen. Einschlägig für Schließanlagen ist VdS 2386.
- „Pro Cap“ ist ein belegter ABUS-Begriff. „Scun Cap“ fand sich nirgends. Nächstliegend ist „Skuni Cap“ (ABUS).
- Janus8000 (Serie 45/46) und Ixalo führen BKS-Seiten und die GU-Konzernseite. Ixalo ist elektronisch, nicht mechanisch.
- Der Bravus-2000-Bezug im Kern-Auszug ist im Bestand nicht nachweisbar. „Sperrschließung“ ist in keiner Quelle als Gleichschließung definiert.

## GEMEINSAME DATEIEN (gewünschte Änderungen)

1. /home/user/schluesselmacher24/src/components/schliessanlagen/system-erklaerung.tsx, Zeilen 185 bis 198: Eintrag „Erweiterbare Anlage“ entfernen oder als Planungshinweis kennzeichnen.
2. /home/user/schluesselmacher24/src/app/(site)/schliessanlagen/page.tsx, Zeile 355: Überschrift „Die fünf Systeme in einfacher Sprache“ an Punkt 1 anpassen.
3. /home/user/schluesselmacher24/src/components/schliessanlagen/system-erklaerung.tsx: Eintrag Hauptschlüssel-Zentralschlossanlage (KHZ) ergänzen, sobald Offene Frage 2 geklärt ist.
4. Schreibweise festlegen: Zentralschlossanlage oder Zentralschließanlage, einheitlich auf Seiten und im Konfigurator.
5. Kern-Auszug, Abschnitt 5: Bravus-Verweis und die Gleichsetzung „Sperrschließung“ durch den Orchestrator prüfen lassen.
6. Abkürzungen HS und GHS auf Seiten: Entscheidung zwischen dem IKON-Hinweis (keine Abkürzungen in Ausschreibungen) und dem DIN-Titel „HS-Anlagen“.

## PRÜFUNG UND ERGEBNIS

- Suchen: 33 WebSearch. Abrufe: 12 WebFetch, je einzeln ohne parallele Seitenabrufe. Davon 6 robots.txt und 6 Seiten. Inhaltlich abgerufen wurden die DIN-Normseite EN 1303:2026 und ein Baunetz-Artikel. 3 Seiten leiteten auf eine Anmeldung um, 1 lieferte HTTP 404.
- robots.txt: abus.com liefert HTTP 403, kein Abruf. dach.assaabloy.com sperrt ClaudeBot, kein Abruf. bks.de, g-u.com, baunetzwissen.de und dinmedia.de erlauben die Abrufe. Anmeldeumleitungen wurden nicht verfolgt.
- Erhebung: 1.732 Wörter (Limit 1.800), 49 Quellenangaben mit 38 eindeutigen URLs. Jede Faktenzeile hat Quelle, Datum und Stufe. Stufe A: 0, B: 45, C: 13. Keine Gedankenstriche, keine Ausrufezeichen.
- Angaben zu abus.com, bks.de, g-u.com und dach.assaabloy.com sind Suchauszüge und nicht am Original geprüft.
- Keine Projektdatei geändert, keine Projektbefehle ausgeführt, nichts heruntergeladen, keine Formulare oder Konten.

## BELEGE (Auswahl)

- DIN EN 1303:2026-08, Normseite: https://www.dinmedia.de/de/norm/din-en-1303/401073981 (abgerufen)
- Baunetz, Schließanlagen, Arten und Funktionen: https://www.baunetzwissen.de/sicherheitstechnik/fachwissen/mechan-schliesstechnik/schliessanlagen---arten-und-funktionen-164832 (abgerufen)
- VdS 2386, Titel laut Listing: https://www.dinmedia.de/de/technische-regel/vds-2386/168155183 (Suchauszug)
- ABUS Bravus Produktblatt: https://www.abus.com/de/abusproductsheet.pdf/212146/ger-DE (Suchauszug)
- ABUS Pro Cap: https://www.abus.com/de/Privat/Tuersicherheit/Tuerzylinder/Premium/Schluesselkappe-Pro-Cap (Suchauszug)
- BKS janus8000: https://www.bks.de/de-de/produkte/schliess-und-zutrittskontrollsysteme/mechanische-schliesssysteme/janus8000 (Suchauszug)
- ASSA ABLOY, Schließanlagenarten: https://dach.assaabloy.com/de/images/catalog/mediacockpit/IKON/orig/Schliessanlagenarten_DE.pdf (Suchauszug)

## OFFENE FRAGEN

Vollständig in Abschnitt 9 der Erhebung (16 Punkte). Vorrangig:

1. KHZ-Wirkung: Die Quellen widersprechen sich, ein Originaltext fehlt. Der ASSA-Katalog ist per robots.txt gesperrt.
2. Sperrschließung und Planreserve sind in keiner Quelle definiert.
3. Bravus-Patentlaufzeit: 2030, 2037 und 2038 nebeneinander. DPMA und Espacenet wurden nicht abgefragt.
4. EN 1303: Zurückziehung der Ausgabe 2015 und das Klassensystem der Ausgabe 2026 am Normtext prüfen.
5. „Scun Cap“: Rückfrage beim Auftraggeber, ob „Skuni Cap“ gemeint ist.
6. Originalseiten von abus.com, bks.de und g-u.com sind nur über einen geklärten Zugang prüfbar.
7. Türenzahl als Entscheidungsgrenze: keine Quelle belegt sie.
