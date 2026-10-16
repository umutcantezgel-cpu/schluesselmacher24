# E4-L-23 · Sichtabnahme · Gruppe „erzaehl-1“ (H01, H02, H03, H12)

Rolle: unabhängiger Gestaltungsprüfer, frischer Unteragent. Grundlage: Bilder unter `/root/sm24-bilder/e4-b/`, `_werkstatt/KERN.md` (K-001, K-003, K-006, K-007 mit Register B-01 bis B-22, K-008, K-009). Alle vier Ansichten sind nach K-009 Erzählansichten. Maßstab: 8 heißt unverwechselbar und präzise.

## Angesehene Bilder

- **H01-start:** desktop 00, 01, 02, 03, 04, 05, 06 · mobil 00, 01, 02, 03, 04, 05, 06, 07, 08 · Einzelbilder `einzelbilder/H01/start__desktop__main-section-first-of-type-role-img__0` bis `__4`
- **H02-autoschluessel:** desktop 00, 01, 02, 03, 04, 05, 06, 07 · mobil 00, 01, 02, 03, 04, 05, 06, 07, 08, 09 (mobil 10 und 11 nicht angesehen, Grenze 10 je Gerät) · Einzelbilder `einzelbilder/H02/autoschluessel__desktop__main-ol-has-svg-role-img__0` bis `__4`
- **H03-modell-golf:** desktop 00, 01, 02, 03, 04 · mobil 00, 01, 02, 03, 04, 05, 06, 07 (keine Einzelbilder vorhanden)
- **H12-ratgeber:** desktop 00, 01, 02 · mobil 00, 01, 02, 03, 04 (keine Einzelbilder vorhanden)
- Tablet: keines, weil es keinen Verdacht auf Umbruchfehler gab. E0-Vergleichsbilder: nicht herangezogen, weil sie kein Maßstab sind.

Dateinamen jeweils `<id>__<geraet>__<k>.jpg`. Im Folgenden steht „D02“ für `__desktop__02`, „M02“ für `__mobil__02` und „E3“ für Einzelbild `__3`.

---

## H01-start

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Plex-Display mit Mono-Augenbrauen samt Bemaßungsmarke und Mono-Faktenleiste (D00) ist eigenständig. „Wobei können wir helfen?“ (D01, M01) ist dagegen eine generische Fragezeile, und die Mono-Kennungen der Kacheln stehen auf springenden Höhen. |
| Komposition | 7 | Der Kopf in 7/5 (D00) und der umgekehrte Projekte-Abschnitt (D04) tragen. Die Abschnitte 01, 02 und 03 (D01–D03) haben aber dreimal dasselbe Gerüst (Überschrift links, Inhalt rechts), und mobil wird der Schnelleinstieg zum 2×4-Kachelstapel (M01). |
| Farbe und Bild | 7 | Stahlblau auf Off-White und Flächenstufen sitzen; Bereichsfarben erscheinen nur im Bereichskontext (D01, D03). Code-Violett (Kachel 03) und Schließanlagen-Purpur (Kachel 05, Schließplan D04) sind aber kaum zu unterscheiden. |
| Bewegung | 8 | B-01 (E0–E4): Der Fräser setzt an, schneidet die sechs nummerierten Einschnitte, deckt die gefräste Fläche auf und hebt ab, alles in 1,58 s. Das ist Bewegung, die Mechanik zeigt. |
| Grafik | 8 | Profilschnitt mit Rohling/Profil-Legende und Halm-Bemaßung (D00), Zylinder A 30 / I 40 ab Stulpschraube (D03), Schließplan GHS→ES mit eigener reduzierter Mobilfassung (M06): präzise und nur in diesem Angebot denkbar. |
| Details | 7 | Mono-Öffnungszeiten und Profillinie im Fuß sind sorgfältig (D06). Daneben stehen ungleich breite gestapelte Knöpfe (M02), springende Kennungen (D01) und Leerraum unter der Kopfgrafik (D00). |

**Ansichtswert: 7,3**

**Harter Generisch-Katalog:** keine. Fokus ist am Standbild nicht prüfbar. Sichtbar ist kein Kontrastverdacht.

**Weicher Katalog:**
- Drei gleich gebaute Abschnitte in Folge (D01–D03, Gerüst 5/7 dreimal): Die Leitidee trägt das nicht, K-006 fordert Strukturwechsel.
- Gleichförmige Kacheln (Schnelleinstieg D01/M01): Auf dem Desktop tragen Haarlinien, Mono-Nummern und Mono-Kennungen das Muster teilweise. Mobil trägt es nicht (K-003.6).
- Zwei Knöpfe (D02): nicht zentriert und nicht vor leerem Grund, daher unkritisch.
- Floskel „Wobei können wir helfen?“: schwach, kein Grund aus der Leitidee.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D01–D03, Abschnitte 01 „Schnelleinstieg“, 02 „Schwerpunkt Autoschlüssel“, 03 „Warum wir“ | Dreimal dasselbe Gerüst: Überschrift links in 5 Spalten, Inhalt rechts in 7. Der Wechsel steckt nur im Inhalt. | Abschnitt 03 umbauen: Überschrift über volle Breite, darunter die vier Punkte 01–04 als vierspaltiges Schriftfeld mit Haarlinien (`grid-cols-4`, `border-l` je Feld). Alternativ 7/5 spiegeln, mit der Liste links. |
| Komposition | M01, Schnelleinstieg | Ein 2×4-Kachelraster füllt eine ganze Bildschirmhöhe; mobil ist das ein verkleinerter Desktop. | Als horizontale Scroll-Leiste mit sichtbarem Anschnitt bauen, wie „Bestellen ohne Termin“ (M04): `snap-x scroll-px-5`, Karte etwa 40 % breit, Icon über dem Titel. |
| Komposition | D02, Funkschlüssel-Grafik im Ablauf-Abschnitt | Die Grafik sitzt in einer weißen Karte mit Rahmen, gefangen in der 5er-Spalte. K-006 verlangt, dass Grafiken über die Spalte ragen. | Kartenrahmen und weiße Fläche entfernen und die Grafik direkt auf `surface-sunken` setzen. Sie soll nach links bis an den `shell`-Rand ragen (`-ml-8`), Unterkante bündig mit Schritt 5. |
| Typografie | D01/M01, Überschrift Abschnitt 01 | „Wobei können wir helfen?“ ist die einzige generische Fragezeile der Seite und behauptet, statt zu bemaßen. | Durch eine sachliche Zeile aus Vorhandenem ersetzen, etwa „Acht Bereiche, je ein klarer Ablauf“ (die acht Kacheln stehen ohnehin darunter). |
| Typografie | D01, Kacheln 03/04 und 05/06 | Die Mono-Kennungen („DIREKT KAUFEN“, „PROJEKTKONFIGURATOR“) springen um 24 px, je nachdem ob der Titel ein- oder zweizeilig ist (217 gegenüber 241 px). | Die Kennung mit `mt-auto` an die Kachelunterkante setzen (Kachel als `flex flex-col`), damit alle Kennungen einer Reihe auf einer Grundlinie stehen. |
| Farbe und Bild | D01 Kachel 03 gegenüber 05; D03 linke Karte gegenüber D04 Schließplan | Das `area`-Violett von „Schlüssel nach Code“ und das Purpur von „Schließanlagen“ liegen im Farbton zu nah. Die Bereichsunterscheidung kippt. | Einen der beiden `area`-Tokens im Farbton um mindestens 30° verschieben, etwa Code Richtung Indigo und Schließanlagen Richtung Magenta. Die Helligkeitsstufen von `area-muted` bleiben gleich. |
| Details | M02, Knöpfe „Ablauf starten“ / „Alle Leistungen ansehen“ | Zwei gestapelte Knöpfe, ungleich breit (etwa 170 und 220 px), wirken zufällig. | Unter 640 px beide Knöpfe `w-full` setzen, oder den sekundären Knopf wie im Kopf als Textlink mit Pfeil-Glyph führen. |
| Details | D00, rechte Spalte unter der Profilschnitt-Grafik | Die Grafik endet bei etwa 570 px, die Faktenleiste links bei 710 px. Darunter bleiben rund 140 px leere Spalte. | Die Grafik vertikal an Kopf und Faktenleiste ausrichten (`self-end`), so dass die Grafik-Unterkante und die Unterkante der Faktenleiste eine Linie bilden. |

**Das Stärkste**
- B-01 Fräsbahn (E0–E4): Genauigkeit wird gezeigt, bevor man sie liest. Das ist die Leitidee wörtlich.
- Fachgrafiken mit echter Bemaßung (Profilschnitt, Zylinder A/I, Schließplan) und eine eigene, reduzierte Mobilfassung des Schließplans (M06).

---

## H02-autoschluessel

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Die Mono-Faktenleiste (D00) und die Kennungen „01 · ANSICHT“ (D01) sitzen. Der Kopfknopf bricht mobil zweizeilig (M00), und zwei Abschnitte haben keine Augenbrauen-Zeile (D01, D06). |
| Komposition | 5 | Der Kopf hat keinen Blickfang, nur ein 90 px großes Icon am rechten Rand (D00). Dazu kommen 200 px Leere vor „Worum es…“ (D01), fast zwei Bildschirmhöhen Linkliste (D02–D03) und mobil zwei Kachelstapel (M01, M09). |
| Farbe und Bild | 6 | Die Seite ist sauber, aber durchgehend einblau. Die getönte Infobox (D04) ist eine blaue Fläche ohne eigene Bedeutung neben den Schritten. |
| Bewegung | 6 | B-21 staffelt die vier Schlüsselarten (E0→E1). Von E1 bis E4 (etwa 1,5 bis 6 s) ändert sich sichtbar nichts mehr, obwohl das Fenster 6 s und 53 Animationen umfasst. Die Klapp-Mechanik wird nur als Pfeil behauptet (E3). |
| Grafik | 7 | Die Schlüsselarten-Typologie ist präzise und einheitlich (D01). Die Grafik in „Worum es…“ (D01/D02) ist aber der Startseiten-Profilschnitt ohne Bezug zum Text daneben. |
| Details | 6 | „Zur Seite →“ steht 14-mal identisch (D02–D03), ⓘ-Glyphen wirken wie Aufzählungszeichen (D03), und „Mercedes-Benz“ bricht im Chip um (D05). |

**Ansichtswert: 6,2**

**Harter Generisch-Katalog:** keine. In E0 sind Grafiken und Kennungen der Schlüsselarten vor dem Auslösen unsichtbar. Das ist der InView-Auftritt B-21 und kein Vorlader; nach etwa 1,5 s ist alles sichtbar.

**Weicher Katalog:**
- Gleichförmige Karten:
  - Schlüsselarten D01: Die Leitidee trägt das, denn es ist ein Typenvergleich mit Zeichnung.
  - „Weiterführende Seiten“ D06/M09, sechs gleiche Textkarten ohne Grafik: trägt nicht.
- Zwei Knöpfe (D04 „Ablauf starten“ / „Erst Fahrzeug nachschlagen“): nicht zentriert, unkritisch.
- Floskelnahe Überschriften „Worum es in diesem Bereich geht“ und „Weiterführende Seiten“: schwach.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D00, Kopf | Kein Blickfang in der ersten Bildschirmhöhe. Das Bereichs-Icon (etwa 90 px) schwebt allein am rechten Rand, die Mitte ist leer. | Kopf auf 7/5 wie H01. Die Schlüsselarten-Reihe (vier vorhandene Generatoren, B-21) in die 5er-Spalte heben, als 2×2-Raster ohne Kartenrahmen. Das Einzel-Icon entfällt. |
| Komposition | D01, zwischen Bildunterschrift (515 px) und „Worum es…“ (748 px) | Rund 200 px Leere ohne Inhalt. Der Abschnitt wiederholt den Hero der Startseite und hat keine Augenbrauen-Zeile. | Abschnitt „Worum es…“ als Einleitung in Abschnitt 01 über die Schlüsselarten-Reihe ziehen (Text 7 Spalten, `max-w-measure`). Die Profilschnitt-Wiederholung streichen und den Abstand auf den regulären Abschnittstakt setzen. |
| Komposition | M01 und M09, Schlüsselarten und „Weiterführende Seiten“ | M01: ein 2×2-Raster mit etwa 150 px schmalen Textspalten (sechs bis sieben Zeilen je Karte). M09: sechs gestapelte Karten über eine volle Bildschirmhöhe. | Beide als horizontale Leiste mit Anschnitt bauen (`snap-x scroll-px-5`, Karte etwa 75 % breit), wie „Bestellen ohne Termin“ auf H01 M04. |
| Typografie | M00, Kopfknopf | „Fahrzeug auswählen und Termin starten“ bricht zweizeilig, ist zentriert, der Pfeil steht abgesetzt. | Unter 640 px den vorhandenen Kurzlaut „Termin starten“ aus dem Seitenkopf verwenden, oder `text-left justify-between` setzen und den Pfeil an die erste Zeile binden. |
| Typografie | D01 „Worum es…“, D06 „Weiterführende Seiten“ | Ohne Augenbrauen-Zeile, obwohl alle übrigen Abschnitte 01–05 eine nummerierte Mono-Zeile haben. Die Reihe bricht. | `.eyebrow` mit Bemaßungsmarke ergänzen und die Nummerierung durchziehen (01 bis 06). Bei Zusammenlegung gemäß Komposition-Befund 2 entfällt einer der beiden Abschnitte. |
| Farbe und Bild | D04/M06, Box „Anzahlung und Vorlauf“ | Eine blau getönte Fläche mit blauem Rahmen konkurriert mit den Schrittmarken. Mobil steht sie vor den Schritten, also Erklärung vor Handlung. | Die Box auf `surface` mit 1-px-Haarlinie setzen, 69,90 € und 7 Tage in `font-mono tabular-nums` hervorheben. Mobil nach Schritt 5 stellen. |
| Bewegung | E1–E4, Schlüsselarten-Reihe | Ab etwa 1,5 s (E1) gibt es keine sichtbare Änderung mehr. Das gemessene Fenster läuft bis 6000 ms mit 53 Animationen; das ist unsichtbare Dauerbewegung über dem Höchstmaß von 1,6 s. | Alle Teilanimationen der Reihe auf zusammen höchstens 1,6 s begrenzen (Staffel 4 × 120 ms, `draw` höchstens 1,1 s), `sm24-dash` an Signalbögen und Pfeil auf einen Durchgang. |
| Bewegung | E3, Klappschlüssel | „Der Bart klappt auf Knopfdruck aus“ wird nur mit einem statischen Pfeil gezeigt. Die Mechanik bleibt unbewegt. | Als Stufe von B-21 (Registerergänzung durch den Orchestrator): Der Bart dreht per `transform: rotate()` aus der eingeklappten Lage in die Endlage, `enter` 600 ms, der Pfeil zeichnet mit. Reduziert: Endlage sofort. |
| Bewegung | D00, erste Bildschirmhöhe | Kein Moment über der Falz. Der einzige Auftritt (B-21) liegt in Bildschirmhöhe 2. | Ergibt sich aus Komposition-Befund 1: Mit der Reihe im Kopf liegt der große Moment oben. |
| Grafik | D01/D02, Grafik neben „Worum es…“ | Es ist der Startseiten-Profilschnitt. Der Text daneben erklärt aber die Zweiteilung in Bart und Elektronik, die die Grafik nicht zeigt. | Den mechanischen Schlüssel aus 01 mit zwei Bemaßungsbeschriftungen in Mono, „Bart“ und „Elektronik“ (Wörter aus dem Text), an Halm und Griff zeigen. Oder die Grafik streichen, siehe Komposition-Befund 2. |
| Grafik | D01, Karte 04 „Smart Key“ | Der Text nennt den Notschlüssel im Gehäuse, die Zeichnung zeigt ihn nicht. | Den Notschlüssel als gestrichelte Kontur (`HILFSLINIE`, `stroke-dasharray`) im Gehäuse einzeichnen, wie der Rohling im Profilschnitt. |
| Details | D02–D03, Leistungslisten | „Zur Seite →“ steht 14-mal identisch am rechten Rand. K-010 verlangt Knöpfe, die sagen, was passiert. | Den Linktext entfernen. Die ganze Zeile wird Link mit Pfeil-Glyph rechts (B-06: `translateX(4px)`, Rahmenfarbe), der Titel trägt die Bedeutung. |
| Details | D03, ⓘ-Glyphen bei „Programmieren und anlernen“ u. a. | Die Glyphen stehen nur in drei von vier Zeilen und in einer eigenen Spalte vor der Beschreibung. Sie wirken wie Aufzählungszeichen. | Die Glyphe inline direkt hinter den Titel setzen (16 px, `ml-1.5`). Die Spalte entfällt. |
| Details | D05, Marken-Chip „Mercedes-Benz“; D01 Karten 01–03 | Der Chip bricht zweizeilig, dadurch ist Reihe 1 höher (93–135 gegenüber 145–187 px). Die Karten 01–03 haben unten etwa 120 px Leerraum, weil nur Karte 04 den Keyless-Zusatz trägt. | Chips mit `whitespace-nowrap` und `min-w-[11rem]` setzen. Den Keyless-Zusatz als eigene Haarlinien-Zeile unter das Raster stellen. |

**Das Stärkste**
- Die Schlüsselarten-Typologie mit Kennung „01 · ANSICHT“ und dem ehrlichen Hinweis „Schematische Darstellung, nicht maßstäblich“ (D01).
- Die Mono-Faktenleiste im Kopf (Ablauf, Anzahlung, Vorlauf, erfasste Modelle) ist bemaßt statt behauptet (D00).

---

## H03-modell-golf

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Die H1 sitzt einzeilig und kräftig (D00). Die Tabellenwerte stehen in Inter statt Mono (D01/M01), „ab 2003.“ bricht als Waise um (D00), und drei Abschnitte haben keine Augenbrauen-Zeile. |
| Komposition | 5 | Der Kopf ist reiner Text, die rechten 5 Spalten bleiben leer (D00). Etwa 200 px Leere vor „Schlüsselarten“ (D01), die Keyless-Zeile hängt (D02), mobil folgen ein Kartenstapel (M02–M03) und eine reine Textstrecke (M04). |
| Farbe und Bild | 6 | Ruhig und korrekt. Die einzige warme Fläche ist der vollbreite Warnkasten (D03, M05), der die Seite farblich dominiert. |
| Bewegung | 6 | Keine Einzelbilder. Nach Register gilt nur B-21 für die Bauformen in Bildschirmhöhe 2; die erste Bildschirmhöhe hat keinen Moment. |
| Grafik | 7 | Die gestapelte Schlüsselgrafik für „hinterlegt“ ist eine gute Idee (D00/M01). Die Bauformen sind 1:1 die H02-Zeichnungen, und Keyless bleibt ungezeichnet (D02). |
| Details | 6 | Der Knopfwortlaut wechselt für dieselbe Handlung (D00 gegenüber D03). Dazu ein umbrechendes Tabellenlabel (D01) und eine isolierte ⓘ-Glyphe (D00). |

**Ansichtswert: 6,0**

**Harter Generisch-Katalog:** keine. Der Hinweis „Was darin nicht steht, erfinden wir nicht“ und der Warnkasten belegen ausdrücklich, dass nichts erfunden wird.

**Weicher Katalog:**
- Gleichförmige Karten (drei Bauformen, D01/D02): Die Leitidee trägt das (Typenvergleich).
- Zwei Knöpfe „Volkswagen Golf auswählen“ / „Andere Volkswagen-Modelle“ (D03): links gesetzt, nicht vor abstraktem Grund, unkritisch.
- „Einordnung“ (D02) hat dasselbe Gerüst wie „Warum wir“ auf H01: innerhalb der Ansicht kein Dreifachmuster, aber seitenübergreifend vorhersehbar.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D00, Kopf | Reiner Text: Die rechte Hälfte (ab etwa 1060 px) ist leer, die Stapelgrafik erscheint erst in Bildschirmhöhe 2. | Kopf auf 7/5: Die Stapelgrafik in die 5er-Spalte holen, ohne Kartenrahmen, über die Spalte nach rechts ragend. Der Abschnitt „hinterlegt“ zeigt dann nur die Tabelle über 8 Spalten. |
| Komposition | D01, zwischen Tabellenende (321 px) und „Schlüsselarten“ (525 px) | Rund 200 px Leere. Die Grafikkarte rechts endet 170 px über der Tabelle, so entsteht ein Loch rechts unten. | Den Abschnittsabstand auf den regulären Takt reduzieren. Fällt Befund 1 weg, die Grafikkarte auf Tabellenhöhe strecken (`self-stretch`, Grafik mittig). |
| Komposition | M02–M03, Bauformen | Drei Karten gestapelt über etwa 1,3 Bildschirmhöhen, Keyless hängt als Textzeile darunter. | Horizontale Leiste mit Anschnitt (`snap-x scroll-px-5`, Karte etwa 80 % breit). Keyless wird vierte Karte, siehe Grafik-Befund. |
| Typografie | D01/M01, Tabelle „Hinterlegte Fahrzeugangaben“ | Die Werte „Golf“, „ab 2003“ und „Ja“ stehen in Inter. Nach K-003.1 gehören Kennungen und Baujahre in Mono. | Die Wertespalte auf `font-mono tabular-nums` setzen, die Labelspalte bleibt Inter, wie die Faktenleiste auf H02 D00. |
| Typografie | D00, Unterzeile | Der Umbruch nach „Baujahre:“ lässt „ab 2003.“ allein in Zeile 2. | Das Baujahr aus dem Satz lösen und als Mono-Feld „BAUJAHRE · ab 2003“ in die Chipzeile stellen. Sonst `text-wrap: balance` mit geschütztem Leerzeichen `Baujahre:&nbsp;ab&nbsp;2003`. |
| Typografie | D00 „Das ist zu diesem Modell hinterlegt“, D03 „Was wir ohne Ihre Unterlagen…“, „Der nächste Schritt“ | Drei von fünf Abschnitten haben keine Augenbrauen-Zeile, die anderen sind nicht nummeriert. Die Ordnung der Seite ist unklar. | `.eyebrow` mit Bemaßungsmarke und laufender Nummer 01–05 für alle Abschnitte. |
| Farbe und Bild | D03/M05, Warnkasten „Angaben ohne Gewähr“ | Eine beige Vollfläche über 12 Spalten ist die stärkste Farbfläche der Seite. Die Signalfarbe wird zur Fläche. | Auf 8 Spalten begrenzen, Hintergrund `surface`, links 2-px-Leiste in Warnfarbe, Glyph `GlyphWarnung` bleibt. |
| Bewegung | D00, erste Bildschirmhöhe | Kein Moment über der Falz. B-21 wirkt erst bei den Bauformen. | Mit Komposition-Befund 1: Die drei Ebenen der Stapelgrafik nacheinander per `sm24-reveal` (3 × 120 ms), danach zeichnet das vordere Profil (`draw`, höchstens 1,1 s), als H03-Stufe von B-21. Reduziert: sofort. Einzelbilder für H03 nachmessen. |
| Grafik | D02/M03, Keyless | Vier Arten sind erfasst, aber nur drei gezeichnet. Keyless hängt als nackte Textzeile auf 8/12 Breite unter dem Raster. | Den vorhandenen Smart-Key-Generator aus H02 als vierte Karte einsetzen, Raster auf `grid-cols-4`. |
| Details | D00 „Mit diesem Fahrzeug starten“ gegenüber D03/M05 „Volkswagen Golf auswählen“ | Zwei Wortlaute für dieselbe Handlung. | Einen Wortlaut für beide Knöpfe, „Mit diesem Fahrzeug starten“. |
| Details | D01, Label „Fahrzeug zum Anlernen vor Ort“ | Das Label bricht zweizeilig, die Wertespalte beginnt bei etwa 33 %. | Labelspalte auf 40 % (`grid-cols-[2fr_3fr]`). |
| Details | D00/M00, ⓘ nach Chip „Fahrzeug vor Ort nötig“ | Die Glyphe steht 12 px abgesetzt und ohne Bezug neben der Chipzeile. | Die InfoTip-Glyphe in den Chip ziehen (rechts im Chip, 14 px). |

**Das Stärkste**
- Ehrliche Datenhaltung als Gestaltung: Tabelle „Hinterlegte Fahrzeugangaben“ und klar abgegrenzter Hinweis, was der Datensatz nicht weiß (D01, D03).
- Gestapelte Schlüsselgrafik mit Ebenen als Bild für „Varianten innerhalb der Baureihe“ (D00/M01).

---

## H12-ratgeber

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Gute Lesespalte und Mono-Nummern im Inhaltsverzeichnis (D00, D01). Die H1 bricht aber vor dem Gedankenstrich (D00/M00), und die Fließtext-H2 tragen die Nummern 01–04 des Verzeichnisses nicht (D01). |
| Komposition | 6 | Die 8/4-Teilung mit mitlaufendem Verzeichnis trägt (D01). Im Kopf bleibt die rechte Hälfte leer (D00), und der Artikel ist eine volle Bildschirmhöhe nur Text (D01, M01). |
| Farbe und Bild | 6 | Die einzige Farbfläche ist das große hellblaue Gehäuse der Grafik (D00), das zu keinem Inhalt gehört. |
| Bewegung | 5 | Keine Einzelbilder und im Register kein großer Moment für Ratgeber. Die Ansicht ruht als Erzählansicht vollständig, außer der Profillinie (B-02). |
| Grafik | 5 | Der vergrößerte Funkschlüssel aus der Typologie (D00) hat keinen Bezug zur Reihenfolge „sichern, prüfen, bestellen“. Die Bemaßungsticks sind ohne Bedeutung, die Konturen bei dieser Größe dicker als anderswo. |
| Details | 6 | Die Handlung „Anfrage für Ersatzschlüssel starten“ steht doppelt (D01, M02), der Knopf bricht mobil zweizeilig (M02), und „Passend dazu“ hat nur einen Eintrag (D01). |

**Ansichtswert: 5,7**

**Harter Generisch-Katalog:** keine.

**Weicher Katalog:** keine harten Muster. Die Grafik ist ein dekoratives Bild ohne Aussage; formal ist das kein Katalogpunkt, verstößt aber gegen K-003.7/K-008 („Grafiken statt Platzhalter“ mit passender Fachgrafik).

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Grafik | D00, Grafik über 8 Spalten (etwa 770 × 400 px) | Ein Funkschlüssel aus H02, dreifach vergrößert, ohne Bezug zum Thema „verloren“. Die Bemaßungsticks messen nichts. | Ersetzen durch eine Ablaufgrafik aus dem vorhandenen Dreischritt der Unterzeile, „sichern → prüfen → bestellen“: drei Marken auf einer Bemaßungslinie, Mono-Beschriftung, Strich `LINIE`, Raster 480 × 270. |
| Grafik | D00 gegenüber H02 D01 | Bei dieser Darstellungsgröße wirken die Konturen deutlich dicker als derselbe Generator in H02. Die Strichskala ist nicht mehr einheitlich. | Generatoren höchstens in Rastergröße (480 px Breite) darstellen, oder `vector-effect: non-scaling-stroke` auch für Generator-Konturen setzen. |
| Komposition | D00, Kopf | Die rechte Hälfte (910–1308 px) ist leer, die Grafik schiebt den Artikel in Bildschirmhöhe 2. | Kopf auf 7/5, die neue Ablaufgrafik in die 5er-Spalte. Das Inhaltsverzeichnis beginnt dann in Bildschirmhöhe 1. |
| Komposition | D01/M01, Artikelkörper | Vier Abschnitte reiner Text über eine volle Bildschirmhöhe, ohne Blickfang. | Zwischen die vier Abschnitte die Profillinie (`profillinie`, 10 px, `stroke-primary`, B-02) als Trenner setzen und jede H2 mit großer Mono-Nummer führen (siehe Typografie). |
| Typografie | D00/M00, H1 | Die Zeile 2 beginnt mit „—“, der Gedankenstrich hängt vorn. | `verloren&nbsp;—` setzen, damit der Strich am Zeilenende von Zeile 1 bleibt, dazu `text-wrap: balance`. |
| Typografie | D01, H2 „Zuerst: …“ bis „Was wir von Ihnen brauchen“ | Das Verzeichnis nummeriert 01–04 in Mono, der Text selbst nicht. Leser verlieren den Bezug. | Vor jede H2 die Nummer in `font-mono text-primary text-title-sm` setzen, wie „Warum wir“ auf H01 D02. |
| Farbe und Bild | D00, Gehäusefläche der Grafik | Eine hellblaue Fläche von etwa 240 × 200 px ist der stärkste Farbreiz der Seite, ohne Inhalt. | Mit dem Grafiktausch entfällt sie. Falls die Grafik bleibt: Fläche auf `fill-area-muted`/`surface-muted` absenken, Akzent nur in den Schrittnummern. |
| Bewegung | D01, Inhaltsverzeichnis rechts (mitlaufend) | Die Erzählansicht hat keinen Moment. Das mitlaufende Verzeichnis zeigt nicht, wo man liest. | Eine Fortschrittslinie links am Verzeichnis per `animation-timeline: view()`, `scaleY` 0→1, aktive Nummer `text-primary`. Das ist B-03 übertragen und braucht einen Registereintrag durch den Orchestrator. Reduziert: statisch. |
| Bewegung | D00, Kopf (mit der Ablaufgrafik nach Grafik-Befund 1) | Die erste Bildschirmhöhe ruht vollständig, es gibt keinen großen Moment. | Die drei Marken nacheinander per `sm24-pop` (3 × 120 ms), die Verbindungslinie zeichnet (`draw`, 600 ms), gesamt unter 1,6 s. |
| Details | D01 rechts und M02, „Anfrage für Ersatzschlüssel starten“ | Dieselbe Handlung steht als Knopf in der Box und direkt daneben bzw. darunter noch einmal unter „Weiterlesen“. | Den Eintrag aus „Weiterlesen“ streichen. |
| Details | M02, Knopf in „Ihr nächster Schritt“ | Der Knopf bricht zweizeilig und zentriert, der Pfeil steht abgesetzt. | Box-Innenabstand mobil auf `px-4`, Knopf `w-full text-left justify-between`, Pfeil an das letzte Wort binden. |
| Details | D01, „Passend dazu“ mit nur einem Eintrag | Eine eigene Mono-Überschrift für einen einzigen Link. | „Passend dazu“ und „Weiterlesen“ zu einer Liste zusammenführen. |

**Das Stärkste**
- Die Lesespalte in `max-w-measure` mit mitlaufendem, Mono-nummeriertem Inhaltsverzeichnis (D01).
- Mobil steht das Inhaltsverzeichnis vor dem Text: eine eigene Reihenfolge statt eines verkleinerten Desktops (M00).

---

## Zusammenfassung

| Ansicht | Typo | Komp. | Farbe | Bew. | Grafik | Details | Wert |
|---|---|---|---|---|---|---|---|
| H01-start | 7 | 7 | 7 | 8 | 8 | 7 | 7,3 |
| H02-autoschluessel | 7 | 5 | 6 | 6 | 7 | 6 | 6,2 |
| H03-modell-golf | 6 | 5 | 6 | 6 | 7 | 6 | 6,0 |
| H12-ratgeber | 6 | 6 | 6 | 5 | 5 | 6 | 5,7 |

**Mittel der vier Ansichtswerte: 6,3**

Die Startseite erreicht mit B-01 und den bemaßten Fachgrafiken das Niveau der Leitidee. Die drei Folgeansichten fallen deutlich ab: Ihren Köpfen fehlt der Blickfang, und ihre Grafiken werden wiederverwendet statt auf den Inhalt bezogen.

**Die drei wirksamsten Änderungen über alle vier Ansichten**
1. **Kopf mit Blickfang und großem Moment für H02, H03 und H12, nach dem Muster von H01:** 7/5-Teilung, vorhandener Generator in der 5er-Spalte ohne Kartenrahmen und über die Spalte ragend.
   - H02: die Schlüsselarten-Reihe mit B-21.
   - H03: die Stapelgrafik mit gestaffelten Ebenen.
   - H12: eine Ablaufgrafik „sichern → prüfen → bestellen“ statt des vergrößerten Funkschlüssels.

   Jeder Moment bleibt unter 1,6 s; die unsichtbare 6-s-Restbewegung auf H02 entfällt.
2. **Mobile Kachelstapel durch horizontale Leisten mit Anschnitt ersetzen** (`snap-x scroll-px-5`): H01 Schnelleinstieg (M01), H02 Schlüsselarten und „Weiterführende Seiten“ (M01, M09), H03 Bauformen (M02–M03). Vorbild ist die eigene Leiste „Bestellen ohne Termin“ (H01 M04).
3. **Bemaßungs-Ordnung lückenlos durchziehen:**
   - jede Abschnittsüberschrift mit `.eyebrow`, Bemaßungsmarke und laufender Nummer (H02 D01/D06, H03 D00/D03);
   - Werte in Tabellen in `font-mono tabular-nums` (H03 D01);
   - Ratgeber-H2 mit den Mono-Nummern des Verzeichnisses (H12 D01);
   - „Zur Seite →“ ersetzen durch ganze Zeilen als Link (H02 D02–D03);
   - zweizeilige Hauptknöpfe mobil vermeiden (H02 M00, H12 M02).

Hinweis außerhalb meiner Grundlage: Der Bildprüfer meldet 4 critical-Befunde aus axe. Fokus und Kontrast sind am Standbild nicht prüfbar; die Zuordnung dieser Befunde zu Ansichten liegt beim Orchestrator.

=== ENDE E4-L-23 · BEREIT ZUR RÜCKGABE ===
