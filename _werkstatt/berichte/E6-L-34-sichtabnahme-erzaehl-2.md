# E6-L-34 · Sichtabnahme · Gruppe erzaehl-2 (H05 Code-Shop, H06 Codelinie MS-01, H08 Schließanlagen, H09 Türtechnik)

Rolle: unabhängiger Gestaltungsprüfer · Kern-Version 1.15 · Grundlage: KERN K-001, K-003, K-006, K-007 (B-01 bis B-26), K-008, K-009 · Urteil nur nach Bildern und Register.

## Angesehene Bilder

- **H05 Code-Shop:** `H05-code-shop__desktop__00` bis `__07` (8), `H05-code-shop__mobil__00` bis `__09` (10, Höchstzahl; `__10`, `__11` nicht angesehen), Einzelbilder `einzelbilder/H05/schluessel-nach-code__desktop__main-role-img__0` bis `__4` (5).
- **H06 Codelinie MS-01:** `H06-code-produkt__desktop__00` bis `__03` (4), `H06-code-produkt__mobil__00` bis `__06` (7), Tablet `H06-code-produkt__tablet__01`, `__02` (Verdacht auf Bruch in der Bestellkarte, nicht bestätigt). Keine Einzelbilder vorhanden.
- **H08 Schließanlagen:** `H08-schliessanlagen__desktop__00` bis `__08` (9), `H08-schliessanlagen__mobil__00` bis `__09` (10, Höchstzahl; `__10`, `__11` nicht angesehen), Einzelbilder `einzelbilder/H08/schliessanlagen__desktop__main-svg-viewbox-0-0-480-300__0` bis `__4` (5).
- **H09 Türtechnik:** `H09-tuertechnik__desktop__00` bis `__06` (7), `H09-tuertechnik__mobil__00` bis `__09` (10, Höchstzahl; `__10` nicht angesehen), Einzelbilder `einzelbilder/H09/tuer-und-schliesstechnik__desktop__main-svg-viewbox-0-0-480-300__0` bis `__4` (5).

Alle Pfade relativ zu `/root/sm24-bilder/e6-c/`, Endung `.jpg`.

---

## H05 Code-Shop (`/schluessel-nach-code`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 8 | Display-h1, Lead und Mono-Kennungen, Formate und Preise sitzen sauber in einer klaren Hierarchie (desktop 00, 01; mobil 01–03). |
| Komposition | 7 | Der Kopf in 7/5 trägt, danach folgt am Desktop eine einzige Tabelle mit 52 Zeilen über fünf Bildschirmhöhen ohne Blickfang (desktop 01–05). Mobil ist die Liste je Familie auf 4 Zeilen eingeklappt und gut gelöst. |
| Farbe und Bild | 7 | Nach dem Kopf bleibt nur Grau auf Off-White, die Bereichsfarbe erscheint nur in den kleinen Familienköpfen (desktop 02–05). |
| Bewegung | 7 | Der Fundstellen-Moment ergibt Sinn (Kreis, Lupe, Strichcode, Einzelbilder 0–4). Die Lupe springt aber samt Verbindungslinien auf einmal ins Bild (Bild 2), sodass der Blick dem Weg nicht folgt. |
| Grafik | 7 | Die Kopfzeichnung ist sauber. Die Lupe zeigt aber nur fünf Striche, der Bart ist ein generisches Zickzack statt eines Profils aus Einschnitt-Regeln, und dieselbe Zeichnung kehrt auf H06 als Fundstelle wieder (desktop 00; Einzelbild 4). |
| Details | 7 | Die klebende Sprungleiste zeigt keinen aktiven Abschnitt, die Haarlinie unter der Leiste ist doppelt und mobil steht die Leiste abgesetzt (desktop 02–05; mobil 01). |

**Ansichtswert: 7,2**

**Generisch-Katalog**
- Hart: keine.
- Weich: Die lange, gleichförmige Zeilenliste ist durch die Shop-Aufgabe und die Bemaßung in Mono getragen. Am Desktop ist sie mit allen 52 Zeilen ausgeklappt aber zu lang für eine Erzählansicht (nur teilweise getragen).

**Befunde**
1. Komposition · desktop 01–05 · 52 Zeilen stehen am Stück, der Familienkopf scrollt weg. Änderung: Am Desktop dieselbe Kürzung wie mobil (4 Zeilen je Familie plus „Alle n anzeigen“). Alternativ den Familienkopf ab `lg` als klebende linke Spalte setzen (`lg:col-span-3`, `sticky`) und die Zeilen in `lg:col-span-9`, ein asymmetrischer Bruch nach K-006.
2. Komposition · desktop 00 (y ≈ 413–543) und mobil 00 (y ≈ 597–790) · Der Hinweis „Ihr Originalschlüssel bleibt bei Ihnen“ wiederholt mit vier Zeilen die Einleitung („Ohne Einsendung des Originals“) und schiebt mobil die Suche unter die zweite Bildschirmhöhe. Änderung: Den Hinweis auf eine Zeile mit `GlyphInfo` kürzen, den Absatz in einen InfoTip oder ein Aufklappelement legen und die Kürzung in `TEXTVORSCHLAEGE.md` vorschlagen. Die Zeile „Kein Code vorhanden? …“ bleibt.
3. Farbe und Bild · desktop 01–05 · Die Bereichsfarbe trägt nur die 12-px-Familienköpfe, die Liste wirkt farblos. Änderung: Unter jede Familienaugenbraue die kleine Profillinie (10 px, `stroke-area`, B-02) setzen, die K-006 erlaubt. So kehrt das Leitelement je Familie wieder, ohne neue Fläche.
4. Grafik · desktop 00 und Einzelbild 4 · In der Lupe stehen fünf Striche, das wirkt wie ein Platzhalter. Änderung: Den vorhandenen Beispielcode „0812“ in Plex Mono in die Lupe schreiben (Kennzeichnung „Beispielcode“ wie auf H06) und den Bart aus dem Profilgenerator zeichnen statt als Zickzack.
5. Grafik · desktop 00 gegen H06 desktop 01 · Der Kopf des Shops und die Fundstelle der Produktseite zeigen dieselbe Zeichnung. Änderung: Im Shop-Kopf die drei vorhandenen Fundstellen-Varianten (Schlüsselkopf, Sicherungskarte, Zylinderstirn) nebeneinander zeigen, als Übersicht vor der Wahl der Codelinie. Die Produktseite behält die Einzelansicht mit Umschalter.
6. Bewegung · Einzelbilder 2 → 3 · Lupe und Verbindungslinien erscheinen gleichzeitig. Änderung: Die zwei Verbindungslinien vom Kopf zur Lupe mit `sm24-draw` in `base` zeichnen, danach die Lupe mit `sm24-pop`, zuletzt den Code. Gesamt unter 1,6 s, Bestand B-22.
7. Details · desktop 02–05 und mobil 02–08 · In der klebenden Sprungleiste sind alle Kürzel gleich grau, ein aktiver Abschnitt ist nicht erkennbar. Änderung: Das Kürzel des Abschnitts an der Leselinie in `text-foreground` mit 2-px-Unterkante in `bg-area` setzen. Mobil die Leiste so mitscrollen, dass das aktive Kürzel sichtbar bleibt; jenseits von „FA“ ist es abgeschnitten.
8. Details · desktop 03 (y ≈ 132/137) · Unter der klebenden Leiste stehen zwei Haarlinien dicht übereinander. Änderung: Die obere Abschnittskante unter der Leiste entfernen oder die Unterkante der Leiste nur im klebenden Zustand zeigen.
9. Details · mobil 01 (y ≈ 455–540) · Zwischen „52 von 52 Codelinien / Filter anzeigen“ und der Sprungleiste liegen rund 60 px Leere mit einer Haarlinie, die Leiste wirkt abgekoppelt. Änderung: Abstand auf `mt-4` und die Leiste direkt an die Trefferzeile.

**Das Stärkste**
- Die Zeilenliste ist präzise bemaßt: Kennung, Codeformat und Preis stehen in Mono, mobil ist sie eingeklappt mit „Alle n anzeigen“.
- Der Kopf zeigt in der ersten Bildschirmhöhe die Fundstelle als Moment und verspricht „Code eingeben, bestellen, fertig“.

---

## H06 Codelinie MS-01 (`/schluessel-nach-code/…/ms-01`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 8 | Display-h1 auf zwei Zeilen, Schriftfeld „Technische Angaben“ mit Wortwerten in Inter und Formaten in Mono, Staffel und Summe in Mono (desktop 00, 01; mobil 04). |
| Komposition | 7 | Produktaufbau mit klebender Bestellkarte rechts, mobil Kopf → Bestellung → Erklärung (mobil 00–03). Die linke Kopfspalte endet aber nach den Plaketten, und die Bestellkarte stapelt vier gerahmte Flächen (desktop 00–02). |
| Farbe und Bild | 7 | Lila Profil auf Zeichenpapier trägt. Die aktive Staffelzeile steht aber in Primärblau auf `primary-soft`, obwohl sie nicht klickbar ist (desktop 01; mobil 01). |
| Bewegung | 7 | B-15 und B-16 erklären laut Register die Mechanik. Der sichtbare Rohling-Zustand liest sich aber kaum als „noch zu fräsen“, und für den Kopf-Profilschnitt gibt es keinen Moment (keine Einzelbilder; mobil 01, tablet 01). |
| Grafik | 8 | Der Profilschnitt im Kopf mit nummerierten Einschnitten, Bemaßung „Halm · 6 Einschnitte“, Legende, Fräser und ehrlicher Beispielkennzeichnung ist die Leitidee in Reinform (desktop 00). |
| Details | 7 | Die Unterschrift bricht mit hängendem Gedankenstrich, die Staffeltabelle ist mobil schmaler als die Karte und Rahmen stecken in Rahmen (desktop 00; mobil 00–02). |

**Ansichtswert: 7,3**

**Generisch-Katalog**
- Hart: keine. Der Beispielcode „0812“ ist als „Darstellung zum Beispielcode 0812 – keine echte Schließung“ gekennzeichnet und damit kein erfundener Inhalt.
- Weich: keine.

**Befunde**
1. Komposition · desktop 01–02 und mobil 01–02 · Die Bestellkarte enthält Live-Schlüssel (gerahmt), Fotobeispiel (gerahmt), Upload (gestrichelt gerahmt) und Summe (getönte Box): Rahmen im Rahmen (K-006, 1.14). Änderung: Den Live-Schlüssel rahmenlos auf `bg-area-soft/40` setzen. Fotobeispiel und Upload werden eine Zeile ohne eigenen Rahmen (Beispiel ⅓, Knöpfe ⅔). Die Summe steht als Haarlinien-Zeilen wie im Warenkorb, ohne Tönung.
2. Komposition · desktop 00 (y ≈ 430–600, linke Spalte) · Unter den Plaketten bleiben rund 170 px leer neben der Zeichnung. Der Preis erscheint erst in der Bestellkarte unter der Falz. Änderung: Den vorhandenen Preis „8,00 €“ je Stück und „Staffel ab 3 Stück“ in Mono (`text-title`, `tabular-nums`) unter die Plaketten in den Kopf setzen. Das ist bemaßt statt behauptet und kommt ohne neuen Inhalt aus.
3. Farbe und Bild · desktop 01 (y ≈ 583) und mobil 01 (y ≈ 604) · Die aktive Staffelzeile „1 Stück · 8,00 €“ steht in `text-primary` auf `primary-soft`, Primärblau gilt aber nur für Aktionen. Änderung: Die Zeile in `text-foreground font-semibold` mit 2-px-Leiste links in `bg-area` oder auf `bg-area-soft/40` setzen.
4. Bewegung · mobil 01 und tablet 01 · Die gestrichelte Einschnittzone des Rohlings ist eine kaum sichtbare helle Strichelung. Der Zustand „Profil erscheint nach Eingabe des Codes“ liest sich wie ein fertiger Schlüssel, sodass der Fräsmoment von B-15 keinen sichtbaren Ausgangspunkt hat. Änderung: Die Einschnittzone in `stroke-area` mit Strichstärke `LINIE` und deutlicher Strichelung zeichnen; die Leiste in `area-soft` am Halm entfällt im Rohling.
5. Bewegung · desktop 00 und mobil 00 · Der Profilschnitt mit Fräser-Symbol im Kopf steht statisch (keine Einzelbilder), obwohl die Produktseite die „entscheidende Stelle“ der Leitidee ist. Änderung: Beim ersten Sichtbarwerden das Profil einmal zeichnen (`draw` ≈ 1,1 s), der Fräser folgt per `transform` wie bei B-01. Das braucht einen Registereintrag durch den Orchestrator; sonst B-02 auf die Profilkante anwenden.
6. Details · desktop 00 (y ≈ 557–575) und mobil 00 (y ≈ 552–572) · Die Unterschrift „DARSTELLUNG ZUM BEISPIELCODE 0812 –“ bricht nach dem Gedankenstrich, der Strich hängt am Zeilenende. Änderung: Den Strich mit geschütztem Leerzeichen an „KEINE“ binden oder die Unterschrift auf die volle Zeichnungsbreite setzen (desktop passt sie dann in eine Zeile).
7. Details · mobil 01 (x ≈ 309) · Die Staffeltabelle endet rund 40 px vor dem Karteninnenrand, die Markierung der aktiven Zeile bricht davor ab. Änderung: Tabelle `w-full`, Preisspalte `text-right tabular-nums`.
8. Details · desktop 00 (y ≈ 405–427) und mobil 00 (y ≈ 613–667) · Die drei Plaketten sind 12–13 px klein und mobil auf zwei Zeilen verteilt. Sie tragen aber die Kernaussage „Ohne Einsendung“. Änderung: „Ohne Einsendung des Originalschlüssels“ als Zeile mit `GlyphHaken` in `text-small` statt Plakette. Die zwei Merkmale bleiben Plaketten in einer Zeile.

**Das Stärkste**
- Der Profilschnitt im Kopf mit nummerierten Einschnitten 1–6, Bemaßung, Legende Rohling/gefrästes Profil und Fräser zeigt Genauigkeit, bevor man sie liest.
- Mobil steht die Reihenfolge Kopf → Bestellung → Fundstelle → Angaben: die Handlung kommt vor der Erklärung.

---

## H08 Schließanlagen (`/schliessanlagen`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 8 | Klare Hierarchie. Abkürzungen (Z), (HS), (GHS) in Mono, Etiketten „GEEIGNET FÜR“ als Caption, mobil ausgewogene Umbrüche in den Fragen (desktop 03; mobil 08). |
| Komposition | 7 | Die Abschnitte wechseln gut zwischen Plan, Text, Tabelle, Liste, Grafik und Fragen. In Abschnitt 01 sind aber linke Spalte und Planfläche großteils leer, und die Kopfgrafik füllt ihre Fläche nur zur Hälfte (desktop 00, 01). |
| Farbe und Bild | 8 | Das Magenta des Bereichs trägt konsequent alle Pläne, Haken, Augenbrauen und den Schlüsselstapel, Aktionen bleiben Stahlblau (desktop 00–05). |
| Bewegung | 8 | Der Kopfplan baut sich in Reihenfolge auf (HS → ES → Türen, Einzelbilder 0–4) und erklärt die Hierarchie, B-14 für die Wahl im Plan ist sinnvoll. |
| Grafik | 8 | Eigene Planfamilie: Kopfplan, wählbarer Schließplan, GHS-Baum mit gestrichelten „frei“-Reserven und gleichschließender Schlüsselstapel (desktop 01, 02, 05; mobil 03). |
| Details | 7 | Gleichlautende Links „Projekt erfassen“ wiederholen sich, ein loses Etikett „PROJEKTKONFIGURATOR“ steht ohne Link, und der Einleitungsabschnitt hat keine Augenbraue (desktop 00, 04; mobil 01, 05–06). |

**Ansichtswert: 7,7**

**Generisch-Katalog**
- Hart: keine.
- Weich: Überschrift mit zwei Knöpfen (desktop 00). Sie ist linksbündig vor einer Fachgrafik statt zentriert vor abstraktem Hintergrund und wird von der Leitidee getragen. Weitere weiche Treffer: keine.

**Befunde**
1. Komposition · desktop 01 · Die linke Spalte unter dem Lead ist ab y ≈ 420 leer. Die Planfläche ist ≈ 420 px hoch, der Plan selbst nur ≈ 170 px. Änderung: Die Rasterfläche auf das Format 480 × 270 beschneiden. Die Steuerung („Schlüssel wählen“, „Tür wählen“) in die linke Spalte unter den Lead ziehen, sodass Wahl und Plan nebeneinanderstehen; mobil bleibt die Reihenfolge.
2. Komposition · desktop 00 (rechte Spalte) · Der Kopfplan belegt nur die mittlere Hälfte der Rasterfläche, die Etiketten „HS“ und „ES“ wirken klein (≈ 11 px). Änderung: Den Plan auf die Spaltenbreite skalieren (≈ 1,3-fach), damit die Etiketten mindestens 12 px erreichen, und die Grafik nach K-006 über die Spaltenkante hinausragen lassen.
3. Details · desktop 04 und mobil 05–06 · Vier von fünf „Für wen“-Zeilen enden mit dem gleichlautenden Link „Projekt erfassen →“. Änderung: Die ganze Zeile wird der Link mit `GlyphPfeilRechts` rechts (Zeilenpfeil nach K-006), dazu ein einzelner Knopf „Projekt erfassen“ unter der Liste. „Kleine Vorhaben direkt konfigurieren“ bleibt als Zeilenziel von „Privat“.
4. Details · desktop 00 (y ≈ 818–843) und mobil 01 (y ≈ 227–272) · „PROJEKTKONFIGURATOR / Sie erfassen Ihr Projekt, wir erstellen daraus ein Angebot.“ steht als Etikett-Zeile ohne Link oder Pfeil und wirkt verwaist. Änderung: Daraus eine ganze Link-Zeile zum Konfigurator mit `GlyphPfeilRechts` machen (Muster „Ablauf in diesem Bereich“ von H09) oder die Zeile streichen.
5. Details · desktop 00 und mobil 01 · Als einziger Abschnitt hat die Einleitung (Text und Begriffe Schließstelle, Schließplan, Sicherungskarte) weder Augenbraue noch Nummer, während 01–05 durchnummeriert sind. Änderung: `SectionHeading nummer` mit Augenbraue (Mikrotext, etwa „00 Begriffe“) setzen.

**Das Stärkste**
- Die Seite zeichnet Pläne statt sie zu beschreiben: Der Kopfplan baut sich auf, der Plan ist wählbar, der GHS-Baum zeigt „frei“-Reserven und der Schlüsselstapel die Gleichschließung.
- Mobil wird der Systemvergleich zur Leiste mit Anschnitt, die Systemwahl zu waagerechten Reitern; das ist eine eigene mobile Komposition.

---

## H09 Türtechnik (`/tuer-und-schliesstechnik`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 8 | Display-h1, gut gesetzte Textabschnitte mit fetten Fachbegriffen und runden Textmarken ③ ② ④ im Fließtext (desktop 00, 01; mobil 03). |
| Komposition | 7 | Kopf mit Türzeichnung und Werkzeug rechts tragen. Danach folgen eine Textwand (Abschnitt 01), ein Raster aus zehn Zeilen und eine einzelne Karte auf 8 Spalten mit leerem Rest (desktop 01–03). |
| Farbe und Bild | 7 | Das Bereichsgrün erscheint nach dem Kopf nur noch in Icons und Haken. Die Leiste der Regulatorik-Karte in Oliv-Braun liest sich wie ein verschmutzter Bereichston (desktop 03; mobil 06). |
| Bewegung | 8 | B-18: Die Marken 1–5 erscheinen gestaffelt und die Führungslinien zeichnen sich zur Legende (Einzelbilder 0–4). Das erklärt die Bauteile der Tür. |
| Grafik | 7 | Die Türzeichnung ist präzise und mit dem Text verknüpft. Sie bleibt aber die einzige Fachgrafik, und die Textmarken verweisen auf eine Zeichnung, die beim Lesen nicht mehr im Bild ist (desktop 01; mobil 03). |
| Details | 6 | Mehrere Floskeln brechen den sachlichen Ton. Die Orientierung steckt Rahmen in Rahmen, und Normen und Klassen stehen nicht in Mono (desktop 01, 02, 04; mobil 01–02). |

**Ansichtswert: 7,2**

**Generisch-Katalog**
- Hart: keine sicher feststellbar. **Zu prüfen (Mensch, `MENSCHEN.md`):** „Wir sind zertifiziert für die Bearbeitung und Instandhaltung von Flucht- und Rettungswegtechnik nach DIN EN 179 und DIN EN 1125“ (desktop 03; mobil 06). Ist das nicht belegt, ist es ein erfundener Inhalt und damit ein harter Treffer.
- Weich: Floskeln, von der Leitidee nicht getragen: „Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik“ (desktop 02), „Wir legen Wert auf transparente Aufklärung … die komplexesten Fragen“ (desktop 04), „höchste fachliche Expertise“, „hochkomplexer“, Augenbrauen „Leistungsportfolio“ und „Architektur der Sicherheit“.

**Befunde**
1. Komposition · desktop 03 (y ≈ 508 ff.) und mobil 06 · Abschnitt 03 „Regulatorik“ steckt mit Augenbraue und h2 in einer einzelnen Karte auf 8 Spalten, die rechten 4 Spalten sind leer. Änderung: Die Überschrift wie in den übrigen Abschnitten frei setzen. Rechts die im Text genannten Normen als Schriftfeld in Mono (DIN EN 179 · DIN EN 1125 · T30) auf `surface-sunken`. Die Warnleiste nur um den Haftungssatz, nicht um den ganzen Abschnitt.
2. Komposition · desktop 01–02 · Abschnitt 01 ist am Desktop rund 1,5 Bildschirmhöhen Fließtext mit drei Zwischenüberschriften, ohne Blickfang neben dem Werkzeug. Änderung: Die Häkchenliste (RC, Zieh- und Bohrschutz, Mehrfachverriegelung) vor „Mechanische Kernkomponenten im Verbund“ ziehen und „Elektronik trifft Mechanik“ mit der Zeile „Ablauf in diesem Bereich“ als eigene, schmalere Zeile (8/4) absetzen. Dadurch wechseln Dichte und Struktur.
3. Farbe und Bild · desktop 03 (x ≈ 133) und mobil 06 (x ≈ 20) · Die linke Leiste der Regulatorik-Karte steht in Oliv-Braun, nah am Bereichsgrün (Farbton 90°), und ist weder klar Warnung noch klar Bereich. Änderung: Die Leiste in `warning` (deutlich Bernstein) und nur am Haftungssatz, siehe Befund 1, oder ganz ohne Kasten als Zeile mit `GlyphWarnung`.
4. Farbe und Bild · desktop 05 und mobil 08 · Die vier Nachbarbereiche (Orange, Magenta, Türkis, Rot) sind die lauteste Farbstelle der Seite, lauter als das eigene Grün. Änderung: Die Fach-Icons der Nachbarbereiche in Ruhe zweitönig in `text-foreground-muted`, die Bereichsfarbe erst bei Hover und Fokus der Zeile (B-06).
5. Grafik · desktop 01 (y ≈ 250–380) und mobil 03 · Die Textmarken ③ ② ④ verweisen auf die Kopfzeichnung, die beim Lesen schon außer Sicht ist. Änderung: Die Türzeichnung (Generator `tuer-schutz`) als Ausschnitt mit den Marken 2–4 direkt über „Mechanische Kernkomponenten im Verbund“ wiederholen; am Desktop in der linken Spalte, ohne Kartenrahmen.
6. Grafik · desktop 01–02 und mobil 01–02 · Das Orientierungswerkzeug hat keine Zeichnung, die gewählten Maßnahmen bleiben abstrakt. Änderung: Über der Maßnahmenliste dieselbe Türzeichnung klein (`w-40`) zeigen; gewählte Maßnahmen heben ihre Marke hervor (Deckkraft und Farbe `base` wie B-14, Registereintrag durch den Orchestrator).
7. Details · desktop 02, 04 und mobil 07 · Die Floskeln (siehe weiche Treffer) brechen den sachlichen Ton von H08. Änderung: In `TEXTVORSCHLAEGE.md` sachlich kürzen. Lead „Präzise Handwerkskunst …“ und „Wir legen Wert auf transparente Aufklärung …“ streichen; Augenbrauen „Leistungen“ statt „Leistungsportfolio“ und „Aufbau“ statt „Architektur der Sicherheit“ (Mikrotexte direkt).
8. Details · desktop 01 (y ≈ 365–750) und mobil 01–02 · Die Türwahl und die Maßnahmen stehen als gerahmte Listen in der gerahmten Karte „Orientierung für Ihre Türabsicherung“: Rahmen im Rahmen (K-006, 1.14). Änderung: `Auswahlgruppe liste` mit `OptionCard zeile` ohne äußeren Listenrahmen, getrennt nur durch Haarlinien. Der Hinweis „Wählen Sie eine Tür …“ wird eine Zeile mit `GlyphInfo` statt getönter Box.
9. Details · desktop 01 (y ≈ 488–510) und mobil 03 · Kennungen wie „DIN EN 1627“, „RC2“, „RC3“, „T30“ stehen in Inter, nicht in Mono. Änderung: Normen und Widerstandsklassen in `font-mono tabular-nums` setzen (K-006 „Werte“), mit geschütztem Leerzeichen in „DIN EN 1627“.

**Das Stärkste**
- Die Türzeichnung mit gestaffelten Marken 1–5, Führungslinien und Legende ist im Fließtext mit runden Textmarken verknüpft. Zeichnung und Erklärung sprechen dieselbe Sprache.
- Das Orientierungswerkzeug klebt am Desktop rechts neben der Erklärung und steht mobil davor: Handlung vor Erklärung.

---

## Gruppe erzaehl-2 · Zusammenfassung

| Ansicht | Typo | Komp. | Farbe | Beweg. | Grafik | Details | Ansichtswert |
|---|---|---|---|---|---|---|---|
| H05 Code-Shop | 8 | 7 | 7 | 7 | 7 | 7 | 7,2 |
| H06 Codelinie MS-01 | 8 | 7 | 7 | 7 | 8 | 7 | 7,3 |
| H08 Schließanlagen | 8 | 7 | 8 | 8 | 8 | 7 | 7,7 |
| H09 Türtechnik | 8 | 7 | 7 | 8 | 7 | 6 | 7,2 |

**Mittel der Gruppe: 7,3**

**Die drei wirksamsten Änderungen**
1. **Rahmen im Rahmen in den Handlungskarten auflösen:** In der Bestellkarte von H06 und in der Orientierungskarte von H09 stehen Auswahlen, Vorschau und Summe als Haarlinien-Zeilen direkt in der Karte. Der Live-Schlüssel steht rahmenlos auf `bg-area-soft/40`, die aktive Staffelzeile in Textfarbe statt Primärblau. Beide Karten sind die Stellen, an denen gekauft oder angefragt wird.
2. **H09 auf den sachlichen Ton bringen und Abschnitt 03 neu gliedern:** Floskeln über `TEXTVORSCHLAEGE.md` streichen, Normen und Klassen in Mono setzen, Regulatorik ohne Kartenhülle mit Normen-Schriftfeld rechts. Die Türzeichnung mit den Marken neben dem Text wiederholen, auf den die Textmarken zeigen. Der Zertifizierungssatz wird beim Menschen geprüft.
3. **H05 am Desktop verdichten und führen:** 4 Zeilen je Familie mit „Alle n anzeigen“ (wie mobil), dazu ein aktives Kürzel in der klebenden Sprungleiste und die kleine Profillinie unter jedem Familienkopf. In die Lupe des Kopfes kommt der vorhandene Beispielcode in Mono statt fünf Striche.

---

## Abgleich mit E5-L-29

Den Bericht `_werkstatt/berichte/E5-L-29-sichtabnahme-erzaehl-2.md` habe ich erst gelesen, nachdem das Urteil oben feststand. Das Urteil bleibt unverändert. Mittel damals 7,0, heute 7,3.

### H05 · damals 6,7 · heute 7,2
- **Behoben:**
  - Befund 1: Der Preis steht einzeilig. Der Staffelhinweis steht einmal je Gruppe rechts im Gruppenkopf.
  - Befund 3: Der Zähler lautet „52 von 52 Codelinien“.
  - Befund 4: Die Sprungleiste der zehn Kürzel steht klebend unter dem Kopf, mobil als Leiste mit Anschnitt.
  - Befund 6 weitgehend: Die Code-Spalte ist schmal (≈ 100 px).
  - Befund 7: Schlüsselkopf auf Papier mit Kontur. Nur Fundkreis und Lupenglas tragen `area-soft`.
  - Befund 9 zur Hälfte: Hinweislinie und Mono-Beschriftung „Am Schlüsselkopf“ sind da.
  - Befund 11: Der mobile Umbruch des Staffelhinweises entfällt mit Befund 1.
  - Befund 12: „Alle n anzeigen“ hat `GlyphWinkelUnten` und Haarlinien.
  - Befund 13: Die zweite Kopfzeile über der Grafik ist weg.
- **Bleibt oder teilweise:**
  - Befund 2 teilweise: Der Rahmen ist weg, der Hinweis ist aber noch ein vierzeiliger Absatz (heute Befund 2).
  - Befund 5: Am Desktop ist die Liste weiter ungekürzt (heute Befund 1).
  - Befund 8: Die Verbindungslinien erscheinen weiter fertig (heute Befund 6).
  - Befund 9, zweite Hälfte: Der Bart ist weiter ein Zickzack (heute Befund 4).
  - Befund 10: Die Kopfgrafik gleicht weiter der Fundstelle auf H06 (heute Befund 5).
  - Neu: Die Sprungleiste zeigt keinen aktiven Abschnitt und erzeugt eine doppelte Haarlinie (heute Befunde 7, 8).

### H06 · damals 7,3 · heute 7,3
- **Behoben:**
  - Befund 1: Die h1 hat zwei Zeilen, „MS-01“ steht in Mono in der Augenbraue.
  - Befund 2: Der doppelte Lead ist gestrichen.
  - Befund 3: „3 bis 4 Ziffern“ in Mono.
  - Befund 4 weitgehend: Die Fundstelle steht kleiner und rahmenlos auf `bg-area-soft/40`.
  - Befund 5: Die Abschnitte sind neu nummeriert (01 Codefundstelle, 02 Angaben, 03 Weiter im Bereich).
  - Befund 6: Der mobile Ausschnitt beginnt an der Schulter und enthält die Bemaßung.
  - Befund 7: „Foto aufnehmen“ ist ein Rahmenknopf.
  - Befund 8: „Ohne Einsendung“ ist neutral, mit `GlyphHaken`.
  - Befund 10: Die Umschalter sind eine Segmentleiste mit `rounded-md`, mobil eine Leiste mit Anschnitt.
- **Bleibt oder teilweise:**
  - Befund 9: Der Widerrufshinweis steht weiter zweimal in einer Bildschirmhöhe (desktop 02). Das hängt am Menschen und ist heute nicht erneut als Befund geführt.
  - Befund 11 teilweise: Die Unterschrift bricht jetzt nach „0812 –“, der Strich hängt (heute Befund 6).
  - Neu sichtbar:
    - In der Bestellkarte steckt Rahmen in Rahmen (heute Befund 1).
    - Die aktive Staffelzeile steht in Primärblau (heute Befund 3).
    - Der Rohling liest sich kaum als „noch zu fräsen“ (heute Befund 4).

### H08 · damals 7,2 · heute 7,7
- **Behoben:**
  - Befund 1: Die Augenbraue lautet „LEISTUNGSBEREICH“, mit `BereichIcon`.
  - Befund 2: Die Antworten stehen auf `max-w-measure`.
  - Befund 3: Die Kürzel stehen in Mono, „Ja“ und „Begrenzt“ als betontes erstes Wort.
  - Befund 4: Der Schließplan steht im Kopf, der Schlüsselstapel in 03.
  - Befund 5: Der mobile Vergleich ist eine Leiste mit Anschnitt.
  - Befund 7: Abschnitt 01 hebt sich vom Fuß ab.
  - Befund 8: Plan und GHS-Baum stehen ohne Kartenrahmen auf `bg-area-soft/40`.
  - Befund 9 weitgehend: Die mobilen Planbeschriftungen liegen am Bild bei etwa 12 px.
  - Befund 10: Unter den Türen stehen Nummern 1–4.
  - Befund 11: Die Knöpfe sind inhaltsbreit, Mono, `rounded-md`.
- **Bleibt oder teilweise:**
  - Befund 6 teilweise: Mobil ist die Leiste umgesetzt, am Desktop stehen die Umschalter weiter 2 × 2 statt einzeilig (heute nicht als Befund geführt).
  - Befund 12 teilweise: Der Wortlaut ist einheitlich „Projekt erfassen“, wiederholt sich jetzt aber viermal. Die Variante „ganze Zeile als Link“ fehlt (heute Befund 3).
  - Befund 13 teilweise: Die Haarlinien sind weg, die Zeile „PROJEKTKONFIGURATOR“ steht aber als verwaistes Etikett (heute Befund 4).
  - Neu: Planfläche und linke Spalte in 01 sind leer (heute Befund 1), der Kopfplan ist klein (heute Befund 2), die Einleitung hat keine Augenbraue (heute Befund 5).

### H09 · damals 6,8 · heute 7,2
- **Behoben:**
  - Befund 1: Die Antworten stehen auf `max-w-measure`.
  - Befund 3: Keine 290-px-Doppelspalte mehr; „Geführte Anfrage“ ist eine Zeile mit Pfeil.
  - Befund 4: Mobil steht die Orientierung vor der Prosa.
  - Befund 5: Abschnitt 05 ist eine nummerierte Bereichsliste mit `BereichIcon`, mobil eine Leiste.
  - Befund 6 zur Hälfte: Das Icon steht neben der Augenbraue, der Text auf Messbreite.
  - Befund 7: Keine `surface-ink`-Fläche mehr; jetzt `surface` mit Leiste links.
  - Befund 8: Die Glyphe der Formularkarte steht nicht mehr in Primärblau.
  - Befund 9: Die Hinweislinie 5 ist kurz, mit einem Knick.
  - Befund 10: Die Textmarken ③ ② ④ stehen im Absatz.
  - Befund 12: Der Pfeil steht auf Titelhöhe.
- **Bleibt oder teilweise:**
  - Befund 2: Die Floskeln stehen weiter im Bild (heute Befund 7 und weicher Treffer).
  - Der Zertifizierungssatz (DIN EN 179/1125) ist weiter beim Menschen zu klären.
  - Befund 6, zweite Hälfte: Die 8/4-Teilung ist da, die rechten 4 Spalten bleiben aber leer (heute Befund 1).
  - Befund 7 teilweise: Der Ton der Leiste liegt nah am Bereichsgrün (heute Befund 3).
  - Befund 11 teilweise: Die Optionen stehen in einer gemeinsamen Hülle mit Haarlinien, diese steckt aber in der Karte, also Rahmen im Rahmen nach K-006 1.14 (heute Befund 8).
  - Neu: Die Textmarken verweisen auf eine Zeichnung außer Sicht (heute Befund 5).

=== ENDE E6-L-34 · BEREIT ZUR RÜCKGABE ===
