# E4-L-23 · Sichtabnahme · Gruppe „erzaehl-2“ (H05, H06, H08, H09)

Rolle: unabhängiger Gestaltungsprüfer, frischer Unteragent. Grundlage: Bilder unter `/root/sm24-bilder/e4-b/` und `_werkstatt/KERN.md` (K-001, K-003, K-006, K-007 mit Register B-01 bis B-22, K-008, K-009). Alle vier Ansichten sind nach K-009 Erzählansichten, auch Code-Shop und Produkt. Maßstab: 8 heißt unverwechselbar und präzise.

## Angesehene Bilder

- **H05-code-shop:** desktop 00, 01, 02, 03, 04, 05, 06, 07, 08, 09 (10 und 11 nicht angesehen, Grenze 10 je Gerät) · mobil 00, 01, 02, 03, 04, 06, 09, 10, 11 · Einzelbilder `einzelbilder/H05/schluessel-nach-code__desktop__main-svg-role-img__0` bis `__4`
- **H06-code-produkt:** desktop 00, 01, 02, 03, 04 · mobil 00, 01, 02, 03, 04, 05, 06, 07 (keine Einzelbilder vorhanden)
- **H08-schliessanlagen:** desktop 00 bis 09 · mobil 00 bis 09 (10 und 11 nicht angesehen, Grenze) · Einzelbilder `einzelbilder/H08/schliessanlagen__desktop__main-svg-viewbox-0-0-480-300__0` bis `__4`
- **H09-tuertechnik:** desktop 00 bis 07 · mobil 00 bis 09 (10 und 11 nicht angesehen, Grenze) · Einzelbilder `einzelbilder/H09/tuer-und-schliesstechnik__desktop__main-svg-viewbox-0-0-480-300__0` bis `__4`
- Tablet: keines, weil kein Verdacht auf Umbruchfehler bestand. E0-Vergleichsbilder: nicht herangezogen, weil sie kein Maßstab sind.
- Zusätzlich gelesen, nur zur Einordnung: Tabelle in `_werkstatt/protokolle/E4-PRUEFER-B-a11y.log`, Zeilen H05 bis H09.

Dateinamen jeweils `<id>__<geraet>__<k>.jpg`. Im Folgenden steht „D02“ für `__desktop__02`, „M02“ für `__mobil__02` und „E3“ für Einzelbild `__3`.

---

## H05-code-shop

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Display-h1, Mono-Augenbraue mit Bemaßungsmarke und Mono-Datenzeilen (CODEFORMAT, Preis) tragen (D00, D01). Die 52 Kartentitel brechen aber unausgewogen um („Büroschrank und / Rollcontainer — Serie MS-01“, D01), der Untertitel wiederholt den Titel, und „01 52 CODELINIEN“ (D00) liest sich wie eine Zahl. |
| Komposition | 4 | Der Kopf (D00) hat keinen Blickfang, die rechten fünf Spalten bleiben leer. Danach folgen 52 gleiche Karten im Dreierraster (D01–D09), mobil 52 Karten übereinander (M01–M11): eine Kachelwüste auf beiden Geräten. |
| Farbe und Bild | 4 | Rund 60 % jeder Karte sind eine leere `surface-muted`-Fläche mit 24-px-Paket-Icon (D01–D09, M01–M11). Die Bereichsfarbe Violett erscheint nur als winziger Punkt in dieser Leere. |
| Bewegung | 7 | B-22 (E0–E4): Der Schlüssel erscheint, ein gestrichelter Kreis markiert die Fundstelle am Kopf, und die Lupe vergrößert den Code. Das zeigt Mechanik. In keinem der 19 Bildschirmbilder liegt dieser Moment aber im sichtbaren Bereich, und E0 ist ein leeres Raster. |
| Grafik | 4 | Die Fundstellen-Grafik (E4) ist präzise. Die Produktkarten zeigen aber keine Fachgrafik, sondern das Bereichs-Icon als Platzhalter (D01), obwohl H06 für dieselbe Serie ein eigenes Schlüsselprofil zeichnet (H06 D00). |
| Details | 6 | Mono-Preise mit Haarlinie und „Staffelpreis ab 3 Stück“ sind sauber (D02). Die Trennlinien über dem Preis springen innerhalb einer Reihe (D05: ZY-01 tiefer als MS/BK), und „Filter zurücksetzen“ steht deaktiviert in Blassgrau wie defekter Text (D01). |

**Ansichtswert: 5,2**

**Harter Generisch-Katalog:** 1 Treffer. *Platzhalter:* Alle 52 Kartenbildflächen sind leere Flächen mit zentriertem Bereichs-Icon (D01–D09, M01–M11). K-008 verlangt „Grafiken statt Platzhalter“.

**Weicher Katalog:**
- Gleichförmige Karten als vorherrschendes Muster (D01–D09, M01–M11): Die Leitidee trägt das nicht. 52 identische Karten sind weder bemaßt noch gegliedert, die Anwendungsfamilien (MS, SP, BK, ZY, VH, TS, FE) stehen nur im Kleingedruckten.
- Floskeln: keine. Zentrierter Kopf mit zwei Knöpfen: keiner.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D01–D09, M01–M11, Kartenraster | 52 gleiche Karten von je etwa 600 px Höhe. Die Familien sind nicht gegliedert, und mobil sind es rund 30 Bildschirmhöhen Scrollen. | Nach Anwendungsfamilie gruppieren, je Gruppe eine Mono-Augenbraue (`.eyebrow`, „MS · MÖBEL- UND BÜROSCHLOSS“). Darunter dichte Zeilen statt Karten: Serie in Mono · Titel · Codeformat in Mono · Preis in Mono · Pfeil, Zeilenhöhe `min-h-touch-lg`, Haarlinie `border-b`. Mobil je Familie eine Liste mit 3 Zeilen und „alle n anzeigen“ oder eine `snap-x`-Leiste mit `scroll-px-5`. |
| Komposition | D00, M00, Kopf | Ohne Blickfang: Rechts liegen fünf leere Spalten, und der Hinweiskasten läuft über die volle Breite. | Kopf in 7/5 teilen: h1, Einleitung und Hinweiskasten in `lg:col-span-7`, die Fundstellen-Grafik (B-22) in `lg:col-span-5`, die über die Spalte ragt. Mobil steht die Grafik als Ausschnitt unter der Einleitung. |
| Komposition | M01, Suche und Filter | Suche, Filterknopf, Zähler und der deaktivierte Rücksetzer füllen eine ganze Bildschirmhöhe, bevor die erste Codelinie erscheint. | „Filter zurücksetzen“ erst bei aktivem Filter zeigen. Zähler „52 Codelinien von 52“ und „Filter anzeigen“ in eine Zeile setzen (`flex justify-between`). |
| Farbe und Bild | D01, M01, Kartenbildflächen | Quadratische Leerflächen mit 24-px-Icon dominieren jede Karte. Bild ist hier nur Leere. | Die Bildfläche ganz entfernen (Listenaufbau wie oben) oder auf `aspect-video` mit der Fachgrafik des Produkts verkleinern (siehe Grafik). |
| Bewegung | E0–E4, Fundstelle | E0 zeigt ein leeres Raster. Der Schlüssel selbst ist Inhalt und baut sich erst auf, sodass der eigentliche Moment (Code unter der Lupe) erst bei ¾ beginnt. | Den Schlüsselumriss sofort stehen lassen. Animieren nur den gestrichelten Kreis (`sm24-draw`), die zwei Verbindungslinien (`draw`, `enter` 600 ms) und die Lupe (`sm24-pop`), gesamt ≤ 1,2 s. Grafik in den Kopf setzen, damit der Moment in der ersten Bildschirmhöhe läuft. |
| Grafik | D01–D09, Kartenbild | Das Bereichs-Icon steht stellvertretend für ein Bild. H06 D00 zeigt, dass es je Serie ein gezeichnetes Schlüsselprofil gibt. | In jeder Karte (oder Zeile, dann 96 × 54 px) dieselbe deterministische Produktgrafik wie auf der Produktseite zeigen, mit Profil aus der Serienkennung, Strich `LINIE` und Farbe `stroke-area`. |
| Grafik | E3–E4 (und H06 D02), Fundstelle | Die untere Verbindungslinie vom Kreis zur Lupe läuft über Bart und Halm des Schlüssels. | Linien unter den Schlüssel legen (Schlüssel in der Malreihenfolge zuletzt) oder die untere Linie an der Tangente oberhalb der Halmkante enden lassen. |
| Typografie | D01–D09, Kartentitel | Unausgewogene Umbrüche. Die Serienkennung hängt am Titelende und bricht mit („— Serie MS-01“). | Serienkennung als eigene Mono-Zeile über dem Titel (`font-mono text-caption tracking-label text-foreground-muted`, „MS-01“). Titel ohne „— Serie …“ und mit `text-wrap: balance`. |
| Typografie | D01, M02, Untertitel | „Möbel- und Büroschloss: Büroschrank und Rollcontainer“ wiederholt den Titel. Die Karte hat damit zweimal denselben Text. | Untertitel auf die Familie kürzen („Möbel- und Büroschloss“), `text-small text-foreground-muted`. |
| Typografie | D00, M00, Augenbraue Abschnitt 01 | „01 52 CODELINIEN“: Zwei Zahlen stoßen aneinander. | „01 · CODELINIEN“. Die 52 steht ohnehin im Zähler darunter. |
| Details | D05 (ZY-01), D06 (ZY-03, ZY-05), D07 (VH-04) | Die Trennlinie über dem Preis sitzt je nach Textlänge auf anderer Höhe, darunter ist eine Leerzone. Die Reihe wirkt unruhig. | Karte als `flex flex-col`, Datenblock `flex-1`, Trennlinie und Preiszeile `mt-auto`. Dann sitzen alle Preise einer Reihe auf einer Linie. |
| Details | D01, deaktivierter Rücksetzer | „Filter zurücksetzen“ in Blassgrau auf `text-body`-Größe liest sich wie ein Darstellungsfehler. | Erst bei aktivem Filter zeigen (siehe Komposition), sonst nicht rendern. |

**Das Stärkste**
- Die Mono-Datenzeilen CODEFORMAT und SCHLÜSSELTYP sowie Mono-Preise (D01–D09) machen jede Karte zum kleinen Datenblatt. Das ist „bemaßt statt behauptet“.
- Die Fundstellen-Sequenz (E1–E4) erklärt mit Kreis, Leitlinien und Lupe genau die Frage des Bereichs: Wo steht der Code?

---

## H06-code-produkt

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Die Display-h1 und die Technischen Angaben als Schriftfeld mit Mono-Etiketten (D01) sind stark. Im Fließtext aber ist die Kategorie kleingeschrieben („möbel- und büroschloss: büroschrank …“, D01, M01), Zeilen mit Links reißen auf (D02, M02, M05), und „Max. 12.0 MB“ hat einen englischen Dezimalpunkt (D02). |
| Komposition | 5 | Rechts im Kopf (D00) liegt Leere. Die Produktgrafik steht in einem 330 px schmalen Kasten mit rund 380 px Leerraum bis zum Bestellfeld (D00). Mobil beginnt die Bestellung erst in der vierten Bildschirmhöhe (M03), nach der Erklärung (K-006: Handlung vor Erklärung). |
| Farbe und Bild | 6 | Code-Violett nur in Grafik und Augenbraue, Preisstufe „1 Stück“ in `primary-soft` (D01): sauber. Das Feld „So sollte das Foto aussehen“ ist aber eine leere Fläche mit Mini-Icon (D01, M04). |
| Bewegung | 7 | Keine Einzelbilder. Am Register sind B-15 (Live-Schlüssel) und B-16 (Fundstelle umschalten) sinnvolle Rückmeldungen. Am Bild ist keine davon belegbar, und die Überblendung zeigt das Fräsen nicht. |
| Grafik | 6 | Fundstelle mit drei Schaltern (Schlüsselkopf, Sicherungskarte, Zylinderstirn) und Produktschlüssel mit Halmbemaßung sind fachlich (D00, D01, M02). Derselbe Schlüssel steht aber zweimal (D00 und Bestellfeld D01). Er zeigt schon ein volles Profil, während die Beschriftung sagt „Profil erscheint nach Eingabe des Codes“ (D01, M03). |
| Details | 5 | Aufgerissene Zeilenabstände an Inline-Links (D02: 44 px statt 26 px), ein deaktivierter Warenkorbknopf, der wie ein heller Aktivknopf wirkt (D02), und eine doppelte Preiszeile unter „Passende Seiten“ (D03). |

**Ansichtswert: 5,8**

**Harter Generisch-Katalog:** 1 Treffer. *Platzhalter:* Unter „SO SOLLTE DAS FOTO AUSSEHEN“ steht eine leere Fläche mit kleinem Schlüssel-Icon (D01 rechts unten, M04). Sie verspricht ein Beispiel und zeigt keins. Hinweis außerhalb des Bildurteils: Laut a11y-Protokoll fehlen den beiden Datei-Eingaben `#foto-ms-01-camera` und `#foto-ms-01-gallery` die Labels (critical, beide Geräte). Am Bild ist das nicht sichtbar, die Bauseite sollte es aber kennen.

**Weicher Katalog:** keine Treffer. Keine Verläufe, keine Kartenwüste, keine Floskeln.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | M00–M03, Reihenfolge mobil | Der Weg zur Bestellung führt durch Produktgrafik, „Was Sie erhalten“, Technische Angaben, Fundstelle und Rechtshinweis. Das Codefeld erscheint erst in M03. | Unter 1024 px das Bestellfeld direkt nach dem Kopf setzen (`order-first` im Inhaltsraster, `lg:order-none`). Erklärung und Angaben folgen darunter. |
| Komposition | D00, Produktgrafik und Kopf | Die Grafik ist in einem 330-px-Kasten gefangen. Zwischen ihr und dem Bestellfeld liegen etwa 380 px Leere, und auch rechts im Kopf ist es leer. | Den separaten Produktkasten streichen (der Live-Schlüssel im Bestellfeld ist das Produktbild, siehe Grafik). Die linke Spalte beginnt dann direkt mit „Was Sie erhalten“. Alternativ die Grafik über volle 7 Spalten (`lg:col-span-7 aspect-video`) setzen. |
| Komposition | D03–D04, Abschnitt „Passende Seiten“ | Unter der Linkliste wiederholt „Preis je Stück: 8,00 €. Die Versandart …“ das Bestellfeld. Der Abschnitt endet in einer Fußnote. | Die Zeile entfernen. Der Abschnitt endet mit Link 03 auf der Haarlinie. |
| Farbe und Bild | D01, M04, „So sollte das Foto aussehen“ | Eine 420 × 260 px große leere Fläche mit 20-px-Icon. Das versprochene Beispiel fehlt. | Durch eine Fachgrafik aus dem Bestand ersetzen: Schlüssel flach auf dem Zeichenraster, Fundstelle mit gestricheltem Kreis (Fundstellen-Generator, Ausschnitt Schlüsselkopf, ohne Lupe). Sonst die Fläche streichen und nur den Satz darüber stehen lassen. |
| Bewegung | Bestellfeld D01, M03, B-15 | Die Überblendung zum neuen Profil (B-15 `quick`) zeigt das Ergebnis, aber nicht die Leitidee „fräst eine Linie sichtbar das Profil“. | Beim Orchestrator beantragen, B-15 nach gültiger Eingabe einmalig als Zeichnen der Einschnitte auszuführen (`stroke-dashoffset`, `draw`, `slow` 400 ms) und bei weiteren Änderungen `quick` zu überblenden. Reduziert: sofort. |
| Grafik | D01, M03, Live-Schlüssel vor Eingabe | Die Beschriftung sagt „Profil erscheint nach Eingabe des Codes“, die Grafik zeigt aber schon ein gezacktes Profil. | Vor der Eingabe nur den Rohling zeigen: gerader Halm, Einschnittzone gestrichelt in `stroke-border-strong`. Erst mit gültigem Code die Einschnitte zeichnen. |
| Grafik | D00 und D01, doppelter Schlüssel | Dieselbe Schlüsselgrafik steht zweimal untereinander (Produktkasten und Bestellfeld). | Nur den Live-Schlüssel im Bestellfeld behalten (siehe Komposition). |
| Grafik | D02, M02, Fundstelle | Die untere Leitlinie vom Kreis zur Lupe kreuzt Halm und Bart. | Leitlinien unter den Schlüssel legen oder die untere Linie oberhalb der Halmkante führen. |
| Typografie | D02, M02, M05, Inline-Links | Zeilen mit „Schlüssel nach Vorlage“ oder „Widerruf und Rückgabe“ springen auf etwa 44 px Abstand. Fließtext und Hinweiskasten wirken zerrissen. | Inline-Links im Fließtext ohne `min-h-touch` und `inline-flex` setzen (`inline`, Zeilenhöhe erben). Die Trefferfläche über `py-1 -my-1` vergrößern, ohne die Zeile zu dehnen. |
| Typografie | D01, M01, „Was Sie erhalten“ | „Nachschlüssel für möbel- und büroschloss: büroschrank und rollcontainer“: Die Kategorie ist durchgehend kleingeschrieben eingesetzt. | Kategorie in Originalschreibung einsetzen oder auf die Serienkennung verweisen („… für die Codelinie MS-01“). |
| Typografie | D02, M04, Upload-Hinweis | „Max. 12.0 MB je Datei“: englischer Dezimalpunkt in einem deutschen Mono-Wert. | „max. 12 MB je Datei“ (K-010, Zahl in Mono mit Einheit). |
| Details | D02, deaktivierter Knopf „In den Warenkorb“ | Er ist ein hellblau gefüllter Balken in voller Breite und wirkt eher wie ein Zweitknopf als wie gesperrt. Der Grund steht darunter. | Deaktiviert als `bg-surface-sunken text-foreground-muted border border-border`. Den Hinweis „Bitte tragen Sie zuerst den Schlüsselcode ein.“ mit `GlyphInfo` über den Knopf setzen. |

**Das Stärkste**
- Die Fundstelle mit drei Schaltern (D01–D02, M02) ist ein Erklärwerkzeug, das nur dieser Betrieb braucht.
- Das Bestellfeld ist bemaßt: Staffelpreistabelle, Stückzahl-Stepper und Mono-Zwischensumme ergeben ein ruhiges Schriftfeld (D01–D02).

---

## H08-schliessanlagen

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Display-h1, nummerierte Mono-Augenbrauen 01–03 und Mono-Kürzel HS, ES, GHS in den Plänen (D01–D04) sind eigenständig. „Wenige Türen, ein Schlüssel für alles?“ (D06) und „Passend dazu“ (D08) fallen aus dem System: ohne Augenbraue, „Passend dazu“ nur in Titelgröße. In den Wählchips mischen sich Mono („ES 1“) und Inter („Tür 1“) (D02). |
| Komposition | 6 | Starke Wechsel (Schriftfeld-Glossar, Pläne, Tabelle, nummerierte Liste D05–D06). Die fünf Systeme erscheinen aber dreimal (interaktiver Plan D01, Karten D02–D04, Tabelle D05), der Kopf hat keinen Blickfang (D00), und mobil stapeln sich fünf Systemkarten über fünf Bildschirmhöhen (M03–M07). |
| Farbe und Bild | 7 | Das Purpur des Bereichs steht nur in Plan, Augenbraue und Icons (D01–D06), die Kartenflächen in `area-soft`. Der Ton liegt aber so nah am Code-Violett von H05 (H05 D00 gegen H08 D00), dass die Bereiche kaum unterscheidbar sind. |
| Bewegung | 8 | E0–E4: Der Plan baut sich von oben auf (HS, dann Abzweig, ES, Leitungen, Türen) und ist nach etwa der Hälfte von 1,93 s fertig. Die Bewegung erklärt die Hierarchie und passt zu B-14. |
| Grafik | 7 | Die Schließplan-Familie (Gleichschließung, Z, HS, GHS) ist präzise und unverwechselbar (D02–D04). „Erweiterbare Anlage“ zeigt aber keine Reserve, nur einen größeren GHS-Baum (D04), und mobil sind die Kürzel in GHS und Erweiterbar etwa 8–9 px klein (M05, M06). |
| Details | 6 | „ES 4“ bricht allein in die zweite Reihe, und zwischen Schlüssel- und Türchips klafft eine Lücke (D02). Dasselbe Schlüssel-Icon steht für „Privat“ und „Mehrere Gebäude“ (D05, D06). Sechs gleiche „Ansehen“-Links folgen in „Passend dazu“ (D08). |

**Ansichtswert: 6,8**

**Harter Generisch-Katalog:** keine.

**Weicher Katalog:**
- Zwei Knöpfe im Kopf (D00, M00): linksbündig, aber vor leerem Weiß ohne Grafik. Die Leitidee trägt das nur halb, weil die Grafik einen Abschnitt tiefer steht.
- Gleichförmige Karten: Die Systemkarten (D02–D04) trägt die Leitidee, weil jede Karte einen anderen Plan zeigt. „Passend dazu“ (D08, 6 × gleiche Karte mit „Ansehen“) trägt sie nicht.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D01–D05, Abschnitt 01 „Systeme“ | Die fünf Systeme werden dreimal erzählt: interaktiver Plan mit Reitern, fünf Karten mit eigenem Plan und Vergleichstabelle. Der HS-Plan steht zweimal (D01, D03). | Die Karten auflösen. Ihr Text (Beschreibung, Haken, „Geeignet für“) erscheint als Reiterinhalt unter dem interaktiven Plan, die Tabelle bleibt als Vergleich. Damit ersetzt ein großer Moment fünf kleine. |
| Komposition | D00, M00–M01, Kopf | Unter h1 und zwei Knöpfen kein Blickfang. Die Schlüsselstapel-Grafik kommt erst neben dem Glossar (D00 unten, M01). | Kopf in 7/5: rechts die Schlüsselstapel-Grafik (oder der HS-Plan) in `lg:col-span-5`, über die Spalte ragend. Das Glossar rückt in 7/5 darunter. Mobil steht die Grafik als Ausschnitt zwischen Einleitung und Knöpfen. |
| Komposition | M03–M07, Systemkarten mobil | Fünf hohe Karten übereinander, ein verkleinerter Desktop (K-003.6). | Falls die Karten bleiben: als `snap-x`-Leiste mit 85 % Kartenbreite, `scroll-px-5` und sichtbarem Anschnitt. Sonst entfällt das mit dem ersten Befund. |
| Typografie | D06, D08, Abschnitte ohne Augenbraue | „Wenige Türen, ein Schlüssel für alles?“ und „Passend dazu“ brechen die Zählung 01–03. „Passend dazu“ steht nur in `text-title`. | Augenbrauen „04 GLEICHSCHLIESSUNG“ und „05 PASSEND DAZU“ mit Bemaßungsmarke ergänzen. „Passend dazu“ in `text-headline`. |
| Typografie | D02, Wählchips | Schlüsselchips in Mono mit Sperrung („ES  1“), Türchips in Inter („Tür 1“): zwei Schriften in einer Bedienzeile. | Beide Gruppen in Mono, `text-small tabular-nums`, Türen als „TÜR 1“ mit `tracking-label` oder beide in Inter. Die Gruppenetiketten „SCHLÜSSEL WÄHLEN“ und „TÜR WÄHLEN“ wie mobil (M02) auch am Desktop über die Gruppen setzen. |
| Farbe und Bild | H08 D00 gegen H05 D00, Bereichston | Schließanlagen-Purpur und Code-Violett liegen im Ton nah beieinander. Augenbrauen, Profillinien und Icons beider Bereiche wirken gleich. | `--area` für `[data-area=schliessanlagen]` deutlicher Richtung Magenta verschieben (Tonabstand zu Code ≥ 40°). Kontraste über `area-theme.test.ts` erneut prüfen. |
| Grafik | D04, M07, „Erweiterbare Anlage“ | Der Plan zeigt nur einen größeren GHS-Baum. Die eigentliche Aussage „Plätze bleiben frei“ ist nicht gezeichnet. | Zwei ES-Knoten und zwei Türen als Reserve zeichnen: Umriss gestrichelt (`stroke-dasharray`, `stroke-border-strong`), ohne Füllung, die Leitung dorthin ebenfalls gestrichelt. |
| Grafik | M05, M06, GHS- und Erweiterbar-Plan mobil | Die Kürzel HGS, GS und ES sind auf 390 px etwa 8–9 px groß, unter den 11,5 px aus K-008. | Für beide Pläne `format: 'schmal'` in `SCHMALES_FORMAT` eintragen: ein Hauptzweig vollständig, der zweite als Stummel mit „…“, oder `.sm24-ausschnitt` auf den linken Zweig. |
| Details | D02, Chips „HS ES 1 ES 2 ES 3 / ES 4“ | „ES 4“ bricht allein um, und die Türchips stehen ohne Bezug daneben. | Chips im Raster des Plans ausrichten: Schlüsselreihe `grid-cols-5` (HS + ES 1–4), Türreihe `grid-cols-4` darunter, jede Tür unter ihrem ES. Kein Umbruch. |
| Details | D05–D06, M09, Liste „Für wen“ | 01 „Privat“ und 05 „Mehrere Gebäude“ tragen dasselbe Schlüssel-Icon, 02 und 04 fast gleiche Gebäude-Icons. | Je Zeile ein eigenes Zeichen aus K-008a: 01 `einsteckschloss`, 02 `GlyphGebaeude`, 03 `GlyphPersonen`, 04 `pruefung`, 05 `BereichIcon schliessanlagen`. |
| Details | D08–D09, „Passend dazu“ | Sechs gleiche Karten mit „Ansehen“ (K-010). | Als nummerierte Linkliste mit Haarlinien bauen wie „Passende Seiten“ auf H06 (H06 D03: Mono-Nummer 01–06 · Titel · Pfeil). „Ansehen“ entfällt, die ganze Zeile ist der Link. |

**Das Stärkste**
- Die Schließplan-Familie (D02–D04) mit Mono-Kürzeln, Purpurleitungen und Türsymbolen ist Werkstattzeichnung im besten Sinn. Ein Technikshop hätte so etwas nicht.
- Der Planaufbau von oben nach unten (E1–E2) erklärt die Hierarchie in unter einer Sekunde, ohne Dekoration.

---

## H09-tuertechnik

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Display-h1, Mono-Augenbrauen und Mono-Beschriftung der Türzeichnung (D00) sind eigen. Die Abschnittseinleitungen sind aber Floskeln („Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik“ D02, „Wir legen Wert auf transparente Aufklärung“ D05, „höchste fachliche Expertise“ D04), und die Nummerierung der Augenbrauen bricht nach 02 ab (D05–D06, M09). |
| Komposition | 5 | Der Kopf hat keinen Blickfang, nur ein etwa 80 px kleines Tür-Icon am rechten Rand (D00). Links unter dem Text bleibt eine Leerfläche von rund 670 × 330 px (D02), die zehn Kacheln enden mit einer Waise (D03), das dunkle Feld ist im rechten Drittel leer (D04), und mobil folgen 10 Kacheln übereinander (M05–M07). |
| Farbe und Bild | 6 | Das Grün des Bereichs sitzt in Augenbrauen, Zeichnung und Fach-Icons (D00, D03). Die Aufzählungsglyphen im Bereichskontext sind aber Stahlblau (D01), und das tintenschwarze Feld mit großem Radius (D04, M08) bricht Werkstückkanten und Flächenstufen. |
| Bewegung | 7 | B-18 (E0–E4): Die Beschriftungen stehen von Anfang an, Marken 1–5 erscheinen gestaffelt, und die Leitlinien zeichnen sich zu den Etiketten. Das ist ordentlich und lässt den Inhalt sichtbar. Marken 3 und 4 erscheinen aber übereinander (E2), und der Moment liegt mobil erst nach rund drei Bildschirmhöhen Text (M02–M03). |
| Grafik | 6 | Die Tür mit nummerierten Bauteilen und Mono-Legende (D00, E4) ist präzise. Im Kopf steht aber ein loses Fach-Icon als Dekor, Marken 3 und 4 überdecken sich, und Leitlinie 5 läuft quer durch das ganze Türblatt (E4). |
| Details | 5 | Zehnmal „LEISTUNGSDETAILS“ (D03), viermal „… erkunden“ (D06). „Verwandte Fachthemen“ wiederholt zwei Karten direkt darüber (D06–D07). Die Fragen-Liste ist schmaler als alle anderen Inhalte (D05), dazu „z.B.“ ohne Leerzeichen. |

**Ansichtswert: 5,8**

**Harter Generisch-Katalog:** keine bestätigt. Ein Verdacht ist am Menschen zu belegen: „Wir sind zertifiziert für … nach DIN EN 179 und DIN EN 1125“ (D04, M08) ist eine konkrete Zertifizierungsaussage. Ist sie nicht belegt, gilt sie als erfundener Inhalt.

**Weicher Katalog:**
- Floskeln (D00, D02, D04, D05; „erkunden“ D06): nicht von der Leitidee getragen (K-003.1).
- Gleichförmige Kacheln (D03 mit 10 gleichen Feldern, D06 mit 2 × 2 gleichen Karten): Die Fach-Icons tragen die Kacheln teilweise. Die Folge Kachelraster → Karten → Linkchips trägt die Leitidee nicht.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | D00, M00, Kopf | Das 80-px-Tür-Icon schwebt am rechten Rand ohne Bezug. Die Türzeichnung, der eigentliche Blickfang, steht erst in Abschnitt 01. | Kopf in 7/5: den Generator `tuer-schutz` (die nummerierte Tür) in `lg:col-span-5`, über die Spalte ragend. Icon entfernen. Mobil steht die Zeichnung als Ausschnitt direkt unter der Einleitung, vor dem Knopf. |
| Komposition | D02, linke Spalte Abschnitt 01 | Der Text endet etwa 330 px vor dem Formular. Links bleibt eine große Leerfläche. | Das Formular `lg:sticky lg:top-24 self-start` setzen, sodass es mit dem Text läuft. „Elektronik trifft Mechanik“ und „Geführte Anfrage“ als zweispaltiges Schriftfeld unter beide Spalten über volle Breite. |
| Komposition | D03, M05–M07, Leistungsraster | Zehn gleiche Felder im Dreierraster mit einer Waise („Montage und Anpassung“). Mobil sind es drei Bildschirmhöhen Kachelstapel. | Desktop: zweispaltige Liste mit Haarlinien, Icon 32 px links, Titel und Satz rechts, Pfeil am Zeilenende, also fünf Zeilen ohne Waise. Mobil: Icon 24 px, Titel, Pfeil, Beschreibung unter 640 px ausblenden, `min-h-touch-lg`. |
| Typografie | D02, D04, D05, M08, M09, Einleitungen | Floskeln: „Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik“, „höchste fachliche Expertise“, „Wir legen Wert auf transparente Aufklärung … die komplexesten Fragen“. | Streichen, nichts Neues ergänzen: D02 nur „Unsere Leistungen in der Tür- und Schließtechnik.“ D04 „erfordern die strikte Einhaltung …“ ohne „höchste fachliche Expertise und“. Die Einleitung in D05 entfällt ganz. |
| Typografie | D02, D05, D06, M09, Augenbrauen | 01 und 02 sind nummeriert, „SYSTEMERWEITERUNGEN“, „FACHWISSEN & BERATUNG“ und „WISSENSDATENBANK“ nicht, und das dunkle Feld hat keine Augenbraue. | Durchgehend 01–06 nummerieren. Im dunklen Feld die Augenbraue in `text-foreground-inverse` mit Bemaßungsmarke. |
| Farbe und Bild | D04, M08, dunkles Feld | Vollfläche `surface-ink` mit etwa 24 px Radius. Kein anderes Element der Seite hat diese Rundung (K-003.5: kleine Radien, Tiefe über Flächenstufen). | `rounded-lg` (10 px). Rechts 4 Spalten nutzen: das vorhandene Fach-Icon `panik-alarmtaster` oder das Icon der Kachel „Panik- und Fluchttürtechnik“ in 96 px, Strich `stroke-foreground-inverse`, Zweiton in `fill-area-muted`. |
| Farbe und Bild | D01, M01–M02, Aufzählung RC / Zieh- und Bohrschutz / Mehrfachverriegelung | Haken-Glyphen in Stahlblau mitten im grünen Bereichskontext. Sie sind weder Aktion noch Marke. | Glyphen auf `text-area-strong` stellen. |
| Bewegung | D00, M00–M03, Platz des Moments | Der einzige große Moment (B-18) läuft mobil erst nach etwa 2,5 Bildschirmhöhen Fließtext, der erste Bildschirm hat keinen. | Mit dem Kopfbefund die Zeichnung nach oben holen. B-18 startet dann in der ersten Bildschirmhöhe, die Staffel ≤ 5 × 120 ms bleibt. |
| Grafik | E2–E4, D00, Marken 3 und 4 | Marke 3 (Zylinder) und 4 (Schließblech) überdecken sich an der Zylinderkante. Der Staffelschritt zwischen ihnen ist nicht lesbar. | Marke 4 auf den Schließblech-Kasten im rechten Zargenholm setzen, mindestens einen Markendurchmesser tiefer. Leitlinie waagerecht zum Etikett 4. |
| Grafik | E4, D00, Leitlinie 5 | Die Linie von der Bandseite läuft quer durch das ganze Türblatt und kreuzt den Schutzbeschlag-Bereich. | Leitlinie 5 außen um die Tür führen: entlang der Bodenlinie unter der Tür nach rechts, dann senkrecht zum Etikett. |
| Details | D03, D06, M05–M07, Linktexte | „LEISTUNGSDETAILS“ zehnmal und „Gleichschließende Zylinder erkunden“ usw. viermal: generisch, „erkunden“ ist die verbotene „Entdecken“-Floskel (K-010). | Die ganze Kachel oder Karte ist der Link. Nur Pfeil-Glyph rechts, kein Zusatzwort. |
| Details | D06–D07, „Verwandte Fachthemen“ | Zwei Chips wiederholen zwei der vier Karten direkt darüber. | Abschnitt streichen. |
| Details | D05, Fragen-Liste | Mit 896 px schmaler als die übrigen Inhalte (1176 px) und als die Fragen auf H08 (H08 D07). Im Text steht „z.B.“. | Auf volle `shell`-Breite wie H08 setzen. „z. B.“ mit schmalem Leerzeichen. |

**Das Stärkste**
- Die nummerierte Türzeichnung mit Mono-Legende und Leitlinien (D00, E4) erklärt die Tür als System aus fünf Teilen auf einen Blick.
- Die „Orientierung für Ihre Türabsicherung“ (D01–D02, M03–M04) ist als ruhiges Arbeitselement richtig zurückhaltend gestaltet.

---

## Gesamt

**Mittel der vier Ansichtswerte: (5,2 + 5,8 + 6,8 + 5,8) / 4 = 5,9**

**Die drei wirksamsten Änderungen über alle vier Ansichten**
1. **Platzhalter durch vorhandene Fachgrafik ersetzen (H05, H06):** Die 52 leeren Kartenbildflächen im Code-Shop zeigen die deterministische Produktgrafik, die H06 je Serie schon zeichnet, oder entfallen im Listenaufbau. Das Fotobeispiel auf H06 wird zur Fundstellen-Grafik. Das beseitigt beide harten Treffer und hebt Farbe und Bild sowie Grafik in H05 um je 3 Stufen.
2. **Jeder Kopf bekommt seinen großen Moment (H05, H06, H08, H09):** Kopf in 7/5 teilen und die vorhandene Grafik in die rechten 5 Spalten über die Spalte hinaus setzen: Fundstelle (H05), Live-Schlüssel mit Bestellfeld mobil zuerst (H06), Schlüsselstapel oder Plan (H08), Tür `tuer-schutz` (H09). Damit laufen B-22, B-14 und B-18 in der ersten Bildschirmhöhe, und das lose Tür-Icon sowie die leeren Kopfhälften verschwinden.
3. **Gleichförmige Karten in Listen und Leisten umbauen (H05, H08, H09):** Codelinien nach Familien gruppiert als dichte Mono-Datenzeilen, Systemkarten in den interaktiven Plan zusammenführen, Leistungsraster als zweispaltige Haarlinienliste, „Passend dazu“ und „erkunden“-Karten als nummerierte Linkliste wie H06 D03. Mobil verschwinden so die Kachelstapel (H05 M01–M11, H08 M03–M07, H09 M05–M07).

=== ENDE E4-L-23 · BEREIT ZUR RÜCKGABE ===
