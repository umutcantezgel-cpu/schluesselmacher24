# E5-BEFUND-H01 · Bericht und Abnahme (Startseite)

3 Prüfrunden (Bau, Reparatur, Nachprüfung); letztes Prüfurteil: nicht bestanden (1 Muss: Alt-Neu-Liste fehlte). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Alt-Neu-Liste (Muss, hier nachgetragen):** „Alle Leistungen ansehen“ → „Alle Leistungen“ (2×) und „Codelinien ansehen“ → „Codelinien“ – Linkwörter entfallen (K-006 „Keine Linkwörter“); Linkziele unverändert.
- **Nacharbeit:** Die Klebung der linken Ablaufspalte entfällt; sie hatte keinen Weg, weil die Spalte die höchste Einheit der Zeile ist (Kommentar angepasst).
- **Entschieden:** Schrittabstand über `lg:justify-between` bestätigt – gleicher Takt, der letzte Schritt schließt bündig mit dem Funkschlüssel (eigenes Bild 1440). Schiene `bottom-11` endet im Kreis von Schritt 5.
- **Bilder:** eigene Ganzseite 1440 (`/root/sm24-bilder/L-nacharbeit/start-*.jpg`).

## Prüfurteil (letzte Runde)

- **muss:** Alt-Neu-Liste für Mikrotexte fehlt. Die Paketregel erlaubt die Änderung nur mit Alt-Neu-Liste im Bericht. Geändert, aber nicht gelistet: „Alle Leistungen ansehen“ → „Alle Leistungen“ (page.tsx Z. 266 und 270) und „Codelinien ansehen“ → „Codelinien“ (Z. 345). Der Bericht behauptet „Keine Änderung an … Mikrotexten“, was der Diff gegen a71b945 widerlegt.
- **soll:** Schritt-Liste 1440: Die Liste ist auf die Höhe der linken Spalte gestreckt (lg:justify-between, Z. 281). Der Abstand zwischen den Schritten liegt bei rund 76 px. Im Vollbild wirkt der Ablauf locker auseinandergezogen. Der Baumeister hat das als offene Frage gemeldet.
- **hinweis:** Klebeverhalten: Die Klebung auf der ganzen linken Spalte (Z. 247) hat keinen Verschiebeweg, weil die Spalte die höchste Einheit der Zeile ist. Sie scrollt mit der Seite. Eine Überlappung tritt nicht auf: Der Abstand Kopf zu Grafik bleibt bei k=0/150/300/420 konstant 234 px (1440). Das Paket verlangt keine Klebung. Der „Muss-Befund Klebeverhalten“ des Baumeisters ist im Paket nicht verankert.
- **hinweis:** Schiene der Ablauf-Grafik: bottom-6 wurde auf bottom-11 gesetzt (Z. 284 und 285). Die Änderung steht nicht im Alt-Neu des Berichts. Sie ist visuell unauffällig und die Schiene endet im Kreis von Schritt 5.
- **hinweis:** Kennungen (Z. 229): mt-auto und sm:pt-3 stehen am inneren Textspan (sm:flex sm:flex-col), nicht an der Kachel selbst. Die Kachel bleibt ab sm flex-row. Die Grundlinie innerhalb jeder Reihe stimmt (1440: 987/987, 1151/1151, 1315/1315, 1456/1456). Die Anforderung ist erfüllt, die Umsetzung weicht nur im Detail ab.
- **hinweis:** Kopfgrafik (Z. 106, lg:self-end): Die Unterkante der Grafik liegt auf der Unterkante der Faktenleiste, Differenz 0 px bei 1440 und 1024. Die Anforderung ist erfüllt.
- **hinweis:** KERN-Version: Das Paket nennt 1.10, maßgeblich ist 1.12. Die Einträge 1.11 (B-23, B-24) und 1.12 (B-25) betreffen Ablaufzeichnung, Lesefortschritt und Stiftzuhaltung. Der Diff berührt diese Bereiche nicht. Keine Verletzung.
- **hinweis:** Logikwächter: page.tsx steht nicht im Protokoll und ist damit nicht geschützt. Ein Urteil gab es deshalb nicht. „sichern“ habe ich nicht ausgeführt, weil es _werkstatt/protokolle/logik-fingerabdruecke.json ändert. Die Logikgleichheit habe ich am Diff geprüft: nur JSX-Klassen, JSX-Text und das Datenfeld link (Z. 345) geändert, keine Hooks, Props oder Handler.
- **hinweis:** Zahlen: tsc exit 0, eslint exit 0, vitest 62 Dateien und 1116 Tests grün (Bericht: 1114). werte-suche 0 Funde. Ergebnis-JSON nach /root/sm24-bilder/E5-BEFUND-H01-nachpruefung-r2/werte-suche.json, nicht in den vorhandenen Ordner E5-BEFUND-H01 geschrieben, dessen Datei nicht überschrieben wurde.
- **hinweis:** Fremde Dateien (nicht geprüft, nicht behoben): Der Logikwächter meldet src/app/(site)/kasse/kasse-formular.tsx und src/app/(site)/warenkorb/warenkorb-ansicht.tsx als ABWEICHEND. Beide gehören zu anderen Paketen.
- **hinweis:** Bild-Nachweis Projekte-Abschnitt: Im Vollbild wirkte der Schließplan leer. Im Ansichtsfenster nach 4 s Wartezeit ist er vollständig gezeichnet (projekte-1440.png). Der Vollbild-Befund war eine Momentaufnahme mitten in der Animation.

## Bericht des Baumeisters (letzte Runde)

E5-BEFUND-H01 · Runde 2 · Baumeister · Haiku 5.5 · KERN 1.10 (Ansicht Startseite)

GEÄNDERTE DATEIEN
- src/app/(site)/page.tsx (einzige Datei dieses Pakets)

WAS UND WARUM
1. Muss-Befund Funkschlüssel-Grafik (Ablauf, Zeilen 273–276): Die Grafik-Unterkante lag 145 px unter Schritt 5. Ursache: mt-auto richtete an der Spalte aus, die die Grafik bestimmte. Änderung: Die Schritt-Liste (ol) bekommt lg:flex lg:flex-col lg:justify-between. Die Schritte verteilen sich über die Zeilenhöhe der linken Spalte, und der letzte Schritt steht mit der Unterkante der Grafik auf einer Kante (1440 px: beide 2281 in Seitenkoordinaten). Die Schiene (zwei Spans) geht von bottom-6 auf bottom-11 und endet unter dem Kreis von Schritt 5, nicht darunter.
   Abweichung von der Abhilfe „Zeilenhöhe von der Schritt-Liste bestimmen lassen“: Die Grafik (283 px hoch) passt neben der Überschrift (291 px) nicht in die natürliche Höhe der Liste (470 px). Die linke Spalte bestimmt die Zeilenhöhe (615 px); die Liste nimmt sie auf. Siehe offene Fragen.
2. Soll-Befund Bericht: Dieser Bericht ist nachgereicht und enthält Alt-Neu-Liste, Ausgabeformular und GEMEINSAME DATEIEN.
3. Kopfblock des Ablaufs: lg:self-start entfernt, weil die Spalte jetzt flex-col ist und self-start die Breite schrumpfen ließe. Sticky bleibt.
4. Alt-Neu-Mikrotexte: „Codelinien ansehen“ → „Codelinien“ (Zeile 342); „Alle Leistungen ansehen“ → „Alle Leistungen“ (Zeilen 265, 269).

Befunde aus Runde 1, unverändert im Diff gegen HEAD:
- Abschnitt 03 „Warum wir“: Schriftfeld mit vier Feldern und Haarlinien (lg:grid-cols-4, mobil zwei Spalten), Kopf über volle Breite.
- Schnelleinstieg mobil: Leiste mit Anschnitt (basis-2/5, snap-x), ab sm das bisherige Raster.
- Funkschlüssel: ohne weiße Karte, -ml-8, direkt auf surface-sunken.
- Kennungen mit sm:mt-auto an der Kachelunterkante, Kacheln flex flex-col, Grundlinie gleich.
- Mobiler Ablauf: Knöpfe w-full, sekundärer Weg als Textlink mit GlyphPfeilRechts.
- Kopfgrafik Startseite: lg:self-end, bündig mit der Faktenleiste (gemessen bei 660 px).
Nicht geändert: Hero und B-01 Fräsbahn, Texte mit Inhalt (Abschnittstitel, „Wobei können wir helfen?“), Daten, Props, Handler, TRUST_POINTS, QUICK_ENTRIES.

GEMEINSAME DATEIEN
- Keine Werte ohne Token. Tokens genutzt: bottom-11 (Abstandsskala, Tailwind-Erweiterung unverändert), lg:flex, lg:flex-col, lg:justify-between, sm:mt-auto.
- Keine Zeichnung mobil mit Schrift unter 11,5 px neu eingeführt.
- Keine Wünsche an gemeinsame Dateien.

PRÜFUNG UND ERGEBNIS
- Messung (Port 3001, 1440 px, Seitenkoordinaten): vorher Schritt-5-Text 2136, Grafik 2281, Liste 2281, Schiene 2257. Nachher Schritt-5-Text 2281 = Grafik 2281 = Liste 2281; Schiene endet im Kreis (Kreis 2219–2259).
- Mobil: Schiene endet am Kreisrand, vorher etwa 24 px darunter.
- npx tsc --noEmit: exit 0, keine Fehler. Lauf vor der Schienen-Änderung (nur className).
- npx eslint "src/app/(site)/page.tsx": exit 0, nach der letzten Änderung wiederholt.
- npx vitest run src/components src/lib: 61 Dateien, 1111 Tests, alle grün. Lauf vor der Schienen-Änderung (nur className).
- werte-suche.mjs "src/app/(site)/page.tsx": keine Funde.
- grep lucide-react: kein Treffer.
- Platzhalter im gerenderten HTML von / (curl 3001): kein Treffer für [Platzhalter, [PLZ], [Ort].
- Bilder: Ablauf-Ausschnitte Desktop und Mobil in Originalgröße geprüft (Schiene, Kreise, Grafik-Unterkante, Abstände). Vollbilder Mobil nur verkleinert gesehen; Tablet und Desktop Vollbild noch nicht im Detail.
- Keine Tests angepasst, nichts gelockert, nichts gelöscht, nicht committet, nicht gepusht.
- Ordner: Runde-1-Bilder unverändert in /root/sm24-bilder/E5-BEFUND-H01/. Runde-2-Zwischenstand (vor Schienen-Änderung) in /root/sm24-bilder/E5-BEFUND-H01-runde2/. Endstand in /root/sm24-bilder/E5-BEFUND-H01-runde2-final/.

BILDBELEGE
- /root/sm24-bilder/E5-BEFUND-H01-runde2/ablauf-desktop.png (Ablauf 1440, Endstand)
- /root/sm24-bilder/E5-BEFUND-H01-runde2/ablauf-mobil.png (Ablauf 390, Endstand)
- /root/sm24-bilder/E5-BEFUND-H01-runde2-final/start__mobil__ganz.jpg, start__tablet__ganz.jpg, start__desktop__ganz.jpg (Vollbilder, Endstand)
- Messskripte: /root/sm24-bilder/E5-BEFUND-H01-runde2/messen.mjs, ausschnitt.mjs
- Prüfprotokolle: /root/sm24-bilder/E5-BEFUND-H01-runde2/tsc.txt, eslint.txt, vitest.txt

OFFENE FRAGEN
1. Die Schritte im Ablauf stehen bei 1440 mit rund 76 px Abstand (vorher 40 px), weil die linke Spalte die Zeilenhöhe bestimmt. Bitte im Ansichtsurteil prüfen, ob das trägt, oder ob die Grafik kleiner werden soll.
2. „Wobei können wir helfen?“ bleibt als Inhalt stehen (Befundentscheidung). Vorschlag beim Orchestrator.
3. Werkzeug-Nebenwirkung: werte-suche.mjs hat _werkstatt/protokolle/werte-suche-2026-10-16_12-09-32.json angelegt. Die Datei liegt im Repository und ist nicht Teil dieses Pakets; Löschen war nicht erlaubt.
4. Vollbild Tablet und Desktop noch nicht im Detail geprüft.

=== ENDE E5-BEFUND-H01 · BEREIT ZUR RÜCKGABE ===

OFFENE FRAGEN
- Abweichung von der Abhilfe 'Zeilenhoehe von der Schritt-Liste bestimmen lassen': Die Funkschlüssel-Grafik ist 283 px hoch. Neben der Überschrift mit Knöpfen (291 px) passt sie in die natürliche Höhe der Schritt-Liste (470 px bei 1440 px) nicht. Deshalb bestimmt die linke Spalte die Zeilenhöhe (615 px), und die Schritt-Liste verteilt ihre fünf Schritte über diese Höhe (lg:justify-between). Die Schritte stehen dadurch mit rund 76 px statt 40 px Abstand. Bitte im Ansichtsurteil prüfen, ob das Bild so trägt oder die Grafik kleiner werden soll.
- Typografie 1 ('Wobei können wir helfen?') ist unverändert, weil die Befundentscheidung das als Inhalt führt. Vorschlag bleibt beim Orchestrator.
- Vollbild-Abnahme: Die Ablauf-Ausschnitte (Desktop 1440, Mobil 390) habe ich in Originalgröße geprüft. Die Vollbilder Mobil (390 x 7218) habe ich nur verkleinert gesehen, Tablet und Desktop Vollbild noch nicht im Detail. Das Vollbild kann nachgesehen werden unter /root/sm24-bilder/E5-BEFUND-H01-runde2-final/.
- Hinweis zum Werkzeug: werte-suche.mjs hat beim Lauf eine neue Protokolldatei in _werkstatt/protokolle/ angelegt (werte-suche-2026-10-16_12-09-32.json). Sie ist nicht gelöscht, da Löschen nicht erlaubt ist. Die Datei liegt im Repository und ist nicht Teil dieses Pakets.

GEMEINSAME DATEIEN
- Keine Werte ohne Token im Diff. Die neuen Klassen nutzen Tokens: bottom-11 (Tailwind-Abstandsskala, erweitert, nicht überschrieben), lg:flex, lg:flex-col, lg:justify-between, sm:mt-auto. Keine Zeichnung zeigt mobil kleinere Schrift als 11,5 px; die Funkschlüssel-Grafik ist ab lg sichtbar und hat 503 px Breite.
