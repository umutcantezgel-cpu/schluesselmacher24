# E6-L-34 · Sichtabnahme · Gruppe „arbeit“ (H04 Assistent, H07 Zylinder-Konfigurator, H10 Warenkorb, H11 Kasse)

Rolle: unabhängiger Gestaltungsprüfer, Grundlage KERN 1.15 (K-001, K-003, K-006, K-007, K-008, K-009). Urteil nur anhand der Bilder und des Bewegungsregisters. Für diese Gruppe gibt es keine Einzelbilder; Bewegung ist nach Register (B-05, B-09, B-10, B-11, B-17, B-19, B-20) und den in den Bildern sichtbaren Zuständen bewertet (Fortschritt, gesperrtes Weiter mit Grund, Fehler mit „Erneut versuchen“, Haken in der Schrittleiste, Zähler-Plakette, Hover-Zustand).

Hinweis zu Prüfeingaben: „Erika Mustermann“, „pruefung@example.invalid“, „Baujahr 2026“ und das bunte Verlaufsbild in den Upload-Vorschauen (Schritte 08/09) sind Eingaben des Bildwerkzeugs, keine Inhalte der Seite. Sie zählen nicht als Platzhalter und nicht als Verlauf.

## Angesehene Bilder
- H04: `H04-assistent__desktop__00…02`, `H04-assistent__mobil__00…04`, `H04-assistent__tablet__01` (Verdacht auf verdeckten Weiter-Knopf), `schritte/01…13` (Autoschlüssel-Assistent, ganze Seiten, 390 px).
- H07: `H07-zylinder-konfigurator__desktop__00…03`, `H07-zylinder-konfigurator__mobil__00…05`, `H07-zylinder-konfigurator__tablet__01` (Maßfelder nebeneinander geprüft), `schritte/14…18` (Konfigurator, ganze Seiten, 1440 px).
- H10: `H10-warenkorb__desktop__00…01`, `H10-warenkorb__mobil__00…02`, `gefuellt/warenkorb-gefuellt__desktop__00…02`, `gefuellt/warenkorb-gefuellt__mobil__00…04`, `gefuellt/warenkorb-gefuellt__tablet__00…01`.
- H11: `H11-kasse__desktop__00…01`, `H11-kasse__mobil__00…02`, `gefuellt/kasse-gefuellt__desktop__00…03`, `gefuellt/kasse-gefuellt__mobil__00…06`, `gefuellt/kasse-gefuellt__tablet__02`.

---

## H04 Assistent (Autoschlüssel-Anfrage mit Termin und Anzahlung)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | h1 in `text-headline`, Band „Schritt 1 von 13 · Marke“ und die Schrittliste in Mono, Zählwerte „6 Modelle“ und Beträge („ab 249,00 €“, „69,90 €“ in schritte/11) sauber gestuft (desktop__00, schritte/11). |
| Komposition | 7 | Desktop 8/4 mit senkrechter Schrittliste trägt (desktop__00), aber mobil bleiben unter jedem Schritt 150–190 px leere Fläche (mobil__01), und Schritt 08 stapelt vier Fotofelder mit je einem gefüllten Primärknopf (schritte/08). |
| Farbe und Bild | 7 | Ruhiges Stahlblau mit Auswahl in `primary-soft` (desktop__00); die Warnfarbe wird in Schritt 13 für eine Ablaufinfo verbraucht (schritte/13), und die große Upload-Vorschau dominiert die Fotoschritte (schritte/08, 09). |
| Bewegung | 8 | Zustände sind erklärt: Fortschrittsband (B-10) wächst von 1/13 bis 13/13 (schritte/01–13), gesperrtes Weiter nennt den Grund („Bitte wählen Sie zuerst eine Marke aus.“, mobil__00), Upload-Fehler mit „Erneut versuchen“; keine Inszenierung. |
| Grafik | 8 | Schlüsselarten als kleine Fachzeichnungen in den Karten (schritte/05) und „So sollte das Foto aussehen“-Zeichnungen je Fotofeld (schritte/08) ersetzen Fotos sinnvoll. |
| Details | 7 | Die Haarlinie unter dem Band ist breiter als der Inhalt (desktop__00 x 100–1340 bei Inhalt 132–1308), und die Schrittliste rückt ab „10.“ die Wörter nach rechts (desktop__00). |

**Ansichtswert: 7,5**

**Generisch-Katalog**
- Hart: keine.
- Weich: zwölf gleichförmige Markenkarten (desktop__00) – Auswahl in einer Arbeitsansicht, von K-003 Nr. 4 getragen; der Abschnitt „Weiterführend“ als Linkliste – getragen.

**Befunde**
1. Komposition · mobil__01 (y 272–465) und schritte/01–03, 05–07 · unter dem letzten Optionsfeld bleibt 150–190 px leere `surface-muted`-Fläche bis „Weiterführend“, weil Weiter in die Leiste wandert, der Platz aber stehen bleibt · unteren Abstand des Ablaufbereichs unter 768 px auf `pb-10` setzen (oder `py-section-tight` nur unten) und eine eventuelle Mindesthöhe des Schritts erst ab `md:` anwenden.
2. Komposition · schritte/08 (ganze Seite 6780 px) · vier gefüllte Primärknöpfe „Foto aufnehmen“ konkurrieren mit „Weiter“, das laut K-006 die einzige Hauptaktion im Ablauf ist; jedes Fotofeld stapelt Zeichnung, zwei Vollbreitenknöpfe und Hinweis · „Foto aufnehmen“ in der Outline-Variante wie „Aus Galerie wählen“, beide Knöpfe in eine Zeile (`grid grid-cols-2 gap-3`), Referenzzeichnung mobil halb breit (`w-1/2`) neben den Titel.
3. Komposition · desktop__00 · die Markenkarten sind 3-spaltig je etwa 250 × 85 px; die vierte Reihe wird von der Falz geschnitten, Weiter liegt erst darunter (tablet__01 zeigt ihn unter dem Band) · Karten als dichte Zeilen (`OptionCard zeile`, `py-3`, Zähler „6 Modelle“ als `metaSpalte` rechts), damit zwölf Marken und Weiter in die erste Bildschirmhöhe passen.
4. Farbe und Bild · schritte/13 · „Dieser Termin findet am Fahrzeug statt“ steht als Warnkasten mit Warnglyphe und Warnleiste, direkt nach dem echten Warnhinweis „Online-Zahlung ist noch nicht eingerichtet“ in schritte/12; die Signalfarbe nutzt sich ab · als Hinweiszeile mit `GlyphInfo` in `text-foreground-muted` ohne Fläche setzen, wie „Frühester Termin nach etwa 7 Tagen“ darunter.
5. Farbe und Bild · schritte/08 und 09 · die Vorschau der hochgeladenen Datei ist eine etwa 170 × 170 px große Kachel und wird mit jedem echten Foto die lauteste Fläche des Schritts · Vorschau als Zeile: Bild `w-16 h-16 rounded-md`, daneben Dateiname, Status („Die Datei konnte nicht hochgeladen werden.“) und „Erneut versuchen“.
6. Details · desktop__00/01 · die Haarlinie unter dem klebenden Band läuft von x 100 bis 1340, weder randabfallend noch an der Inhaltskante (132–1308) · Linie an die Innenbreite der `shell` legen oder als `border-b` an den vollbreiten Bandbehälter.
7. Details · desktop__00 Schrittliste rechts · einstellige Nummern („9.“) und zweistellige („10.“–„13.“) verschieben den Wortanfang um etwa 7 px · Nummern in fester Breite rechtsbündig (`w-6 text-right tabular-nums`), Wörter in einer Fluchtlinie.

**Das Stärkste**
- 13 Schritte bleiben mühelos lesbar: Band „Schritt n von 13 · Name“ über die ganze Shell plus senkrechte Schrittliste am Desktop, mobil Leiste mit Grund für das gesperrte Weiter.
- Fachgrafik statt Foto genau dort, wo man sie braucht: Schlüsselarten und „So sollte das Foto aussehen“.

---

## H07 Zylinder-Konfigurator

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | Schriftfeld mit Großbuchstaben-Etiketten und Mono-Werten, „Laufende Summe 39,00 €“ hervorgehoben, Optionspreise „ab 39,00 €“ inline in Mono (desktop__00, mobil__01). |
| Komposition | 7 | Die Teilung Maßfelder links, Zeichnung rechts sitzt (desktop__01), aber Bauform und Funktion stehen als Karten in der Positionskarte (mobil__01, schritte/14) und dieselbe Summe erscheint dreifach (mobil__00, mobil__03). |
| Farbe und Bild | 8 | Bereichsfarbe nur in Augenbraue und Zeichnung, Aktionen bleiben Stahlblau, Auswahl in `primary-soft` (desktop__01). |
| Bewegung | 8 | Schrittleiste mit Haken und wachsendem Band (schritte/16–18, B-10), Maß und Summe aktualisieren live (B-17, B-20); keine Zierbewegung. |
| Grafik | 8 | Die bemaßte Zylinderzeichnung mit „A 35 / B 35“, Mittelachse, „Mitte Stulpschraube“ und Zeichenpapier-Raster ist das Leitbild der Werkstattzeichnung (desktop__01, tablet__01). |
| Details | 7 | Die Zeichnung in der Zusammenfassung ist so klein, dass ihre Beschriftung unter 12 px fällt (schritte/18), und der Wortwert „ohne Aufpreis“ steht in Mono (mobil__02). |

**Ansichtswert: 7,7**

**Generisch-Katalog**
- Hart: keine.
- Weich: Kennzahlenleiste Zylinder · Schlüssel · Optionen · Summe (desktop__00) – nicht hochzählend, als Schriftfeld von „Bemaßt statt behauptet“ getragen.

**Befunde**
1. Komposition · desktop__01, mobil__01, schritte/14 und 15 · Bauform- und Funktionskarten stehen als umrandete Karten in der umrandeten Karte „Position 1“, in Schritt 2 steht die Tabelle „Im Grundpreis enthalten …“ als zweite Karte in der Karte; mobil schrumpft die Textspalte dadurch auf etwa 230 px, Beschreibungen laufen über vier Zeilen · innerhalb der Position `Auswahlgruppe liste` mit `OptionCard zeile` und Preis als `metaSpalte`; die Schlüsseltabelle ohne eigenen Rahmen nur mit Haarlinien direkt in die Karte (K-006 „Kein Rahmen im Rahmen“).
2. Komposition · mobil__00, mobil__03, desktop__00 · „39,00 €“ steht dreifach: „Summe“ im Band oder in der Leiste, „Laufende Summe“ im Schriftfeld und „Zwischensumme“ der Position; mobil__00 zeigt zwei davon in einer Bildschirmhöhe · Feld „Laufende Summe“ aus dem Schriftfeld nehmen (Band und Leiste tragen die Summe mit B-20), Schriftfeld dreispaltig; „Zwischensumme“ je Position erst ab zwei Positionen zeigen.
3. Komposition · mobil__03 (y 278–478) · zwischen „Bisher 1 von 30 möglichen Zylindern.“ und „Weiterführend“ liegen etwa 200 px leere Fläche · wie bei H04 den unteren Abstand des Ablaufbereichs unter 768 px auf `pb-10` kürzen.
4. Details · schritte/18 „Ihre Zylinder · Position 1“ · die Zeichnung ist nur etwa 370 px breit, „A 35“, „außen“ und „Mitte Stulpschraube“ fallen deutlich unter 12 px · Zeichnung in der Zusammenfassung mindestens in Generatorbreite (480 px, `lg:col-span-5`) setzen; mehrere Positionen nebeneinander als Leiste.
5. Details · mobil__02 und desktop__01 · der Wortwert „ohne Aufpreis“ steht in Mono und mobil in einer eigenen Zeile, während Preise wie „+ 12,00 € je Zylinder“ Mono zu Recht tragen · „ohne Aufpreis“ in Inter `text-small text-foreground-muted` (K-006: Mono nur für Zahlen, Maße, Beträge, Kennungen).
6. Details · desktop__00 · Haarlinie unter dem Band läuft wie bei H04 von x 100 bis 1340 statt an der Inhaltskante · gleiche Änderung wie H04 Befund 6 (eine Stelle im gemeinsamen Band).

**Das Stärkste**
- Die bemaßte Zylinderzeichnung neben den Maßfeldern: Man sieht Maß A und Maß B, bevor man sie liest – Leitidee wörtlich eingelöst.
- Die Zusammenfassung als bemaßte Tabelle („Doppelzylinder 35/35 mm · 1 × 39,00 € = 39,00 €“, Gesamt in Textfarbe) mit Schrittleiste aus Haken.

---

## H10 Warenkorb (leer und gefüllt)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | „Positionen (1)“ mit Mono-Zähler, Beträge rechtsbündig in Mono, „Gesamtbetrag 20,95 €“ als größter Wert in Textfarbe (warenkorb-gefuellt__desktop__00). |
| Komposition | 7 | Saubere 8/4-Teilung, doch mobil steht „Zur Kasse“ zweimal in einer Bildschirmhöhe (warenkorb-gefuellt__mobil__01), Weiter-einkaufen-Links sind doppelt (desktop__01) und die Summenkarte klebt nicht (desktop__01). |
| Farbe und Bild | 8 | Ruhig, Primärblau nur für Aktionen und Auswahl, Rohling-Zeichnung im leeren Zustand ohne Rahmen (H10-warenkorb__desktop__00). |
| Bewegung | 8 | Zähler-Plakette „2“ am Korb und Summen mit Schleier (B-20), Mengenstepper mit Rückmeldung (B-05); Ruhe sonst richtig. |
| Grafik | 7 | Das Positionsbild zeigt den ganzen Schlüssel so klein, dass die Einschnitte mobil nicht lesbar sind (warenkorb-gefuellt__mobil__00), und das Rasterfeld des leeren Zustands endet als sichtbares Rechteck (H10-warenkorb__desktop__00). |
| Details | 7 | Doppelte Haarlinie unter „Summe“ und zweizeilige Versandzeile in der Summenkarte (warenkorb-gefuellt__desktop__00, tablet__01). |

**Ansichtswert: 7,5**

**Generisch-Katalog**
- Hart: keine.
- Weich: drei Versandarten als Karten (warenkorb-gefuellt__tablet__00) – echte Auswahl direkt auf `bg-background`, getragen.

**Befunde**
1. Komposition · warenkorb-gefuellt__mobil__01 · „Zur Kasse“ steht in der Summenkarte und in der Aktionsleiste gleichzeitig im Bild · Knopf in der Summenkarte unter 768 px ausblenden (`hidden md:flex`); die Leiste trägt Gesamtbetrag und Aktion.
2. Komposition · warenkorb-gefuellt__desktop__01 und H10-warenkorb__desktop__00 · „Weiter einkaufen: Schlüssel nach Code oder Zylinder-Konfigurator“ steht direkt über „Passend dazu“, dessen erste zwei Zeilen dieselben Ziele haben; im leeren Zustand wiederholen diese Zeilen zudem die beiden Knöpfe der Leerkarte · Satz „Weiter einkaufen …“ streichen und im leeren Zustand die ersten zwei Zeilen von „Passend dazu“ weglassen.
3. Komposition · warenkorb-gefuellt__desktop__00/01 · die Summenkarte scrollt mit; bei k=01 ist „Zur Kasse“ verschwunden, während links noch die Versandart gewählt wird · Summenspalte ab `lg:` klebend (`lg:sticky lg:top-24`), wie die Bestellübersicht der Kasse.
4. Grafik · warenkorb-gefuellt__mobil__00 (und desktop__00) · die Schlüsselzeichnung im Positionsbild ist mobil etwa 55 px breit in einer 80-px-Kachel; Profil und Einschnitte sind nicht lesbar · Ausschnitt auf Bart und Einschnitte (`ausschnitt`), Zeichnung kachelfüllend; der Code „0812“ wird so im Bild sichtbar.
5. Grafik · H10-warenkorb__desktop__00 und mobil__00 · das Zeichenpapier-Raster hinter dem Rohling endet als helles Rechteck mit harter Kante und wirkt wie ein aufgeklebter Zettel · Raster zum Rand hin auslaufen lassen (Maske im Generator) oder weglassen; Zeichnung an der Oberkante des Titels „Ihr Warenkorb ist leer“ ausrichten.
6. Details · warenkorb-gefuellt__desktop__00, tablet__01 · unter der Kopfzeile „Summe“ folgt im Abstand von etwa 20 px eine zweite Haarlinie (obere Linie der Zeile „Zwischensumme“) · obere Linie der ersten Summenzeile entfernen.
7. Details · gleiche Bilder, Zeile „Versand“ · „Versand verfolgbar“ und „4,95 €“ stehen rechts zweizeilig, alle anderen Zeilen sind einzeilig · Versandart als `text-small text-foreground-muted` unter „Versand“ in die linke Spalte, Betrag rechts in der ersten Zeile.

**Das Stärkste**
- Klare Rechenordnung: Mono-Beträge rechtsbündig, „8,00 € je Stück“ unter „16,00 €“, Gesamtbetrag als einziger großer Wert in Textfarbe.
- Mobile Leiste mit „Gesamtbetrag 20,95 €“ und „Zur Kasse“ in der Daumenzone.

---

## H11 Kasse (leer und gefüllt)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | Abschnittstitel „Kontaktdaten“, „Lieferanschrift“ in `text-title`, Feldetiketten halbfett, Übersicht mit Mono-Beträgen und Großbuchstaben-Etiketten (kasse-gefuellt__desktop__00). |
| Komposition | 7 | 7/5-Teilung mit klebender Übersicht trägt (desktop__01), aber die Übersicht ist höher als der Bildschirm, sodass „Zahlungspflichtig bestellen“ an oder unter der Falz liegt (desktop__00/01), und der Gesamtbetrag steht doppelt (mobil__03). |
| Farbe und Bild | 8 | Warnhinweis nach Muster: `surface`, 2-px-Warnleiste links, höchstens 8 Spalten (desktop__00); sonst nur Stahlblau für Aktionen und Links. |
| Bewegung | 8 | Ruhig, Übersicht klebt mit, Zähler-Plakette und Summen nach B-20, einklappbare Übersicht mobil (B-09, mobil__00), Hover der Rechtslinks sichtbar (desktop__02). |
| Grafik | 7 | Die gefüllte Kasse zeigt die Position nur als Text, obwohl der Warenkorb dieselbe Position mit Schlüsselzeichnung zeigt (desktop__00); der Leerzustand teilt das harte Rasterfeld mit H10 (H11-kasse__desktop__00). |
| Details | 7 | Augenbrauen nur mit Nummer „01“–„04“ ohne Wort (desktop__00, mobil__00), dreizeilige Artikelzeile und zweizeilige Versandzeile (tablet__02). |

**Ansichtswert: 7,5**

**Generisch-Katalog**
- Hart: keine.
- Weich: keine.

**Befunde**
1. Komposition · kasse-gefuellt__desktop__00/01 · die klebende Bestellübersicht ist höher als 900 px; „Zahlungspflichtig bestellen“ liegt bei y ≈ 895 bzw. außerhalb, weil fünf Zeilen „Noch nicht ausgefüllt“ Platz nehmen · leere Kontaktzeilen zu einer Zeile zusammenfassen (solange leer: „Kontakt und Lieferanschrift · Noch nicht ausgefüllt“, danach nur ausgefüllte Werte), damit Gesamtbetrag und Knopf in der ersten Bildschirmhöhe der klebenden Spalte stehen.
2. Komposition · kasse-gefuellt__mobil__03 und tablet__02 · „Gesamtbetrag 20,95 €“ steht zweimal in der Übersicht (im Summenblock und über dem Knopf) · Reihenfolge Artikel → Kontakt und Lieferanschrift → Summe; der Summenblock endet mit dem Gesamtbetrag direkt über „Zahlungspflichtig bestellen“, die Wiederholung entfällt.
3. Grafik · kasse-gefuellt__desktop__00 Bestellübersicht „Artikel“ · die Position steht nur als Text; im Warenkorb trägt sie eine Schlüsselzeichnung · das vorhandene Positionsbild klein (`w-12`) vor den Artikelnamen setzen, damit dieselbe Position in Warenkorb und Kasse wiedererkannt wird.
4. Grafik · H11-kasse__desktop__00 und mobil__00 · Rasterfeld hinter dem Rohling endet als hartes Rechteck · gleiche Änderung wie H10 Befund 5 (gemeinsamer Leerzustand).
5. Details · kasse-gefuellt__desktop__00/01/02, mobil__00, H11-kasse__desktop__00 · die Augenbrauen zeigen nur „⊢ 01“, „02“, „03“, „04“ ohne Wort; im Warenkorb steht „01 WEITERLESEN“ · Augenbraue mit Wort ergänzen (Mikrotext, z. B. „KONTAKT“, „LIEFERUNG“, „BESTÄTIGUNG“, „RECHTLICHES“) oder die Nummer in die Titelzeile ziehen.
6. Details · tablet__02 und desktop__00 Artikelzeile · Titel links, „Code 0812 · 2 Stück“ rechts in der zweiten Zeile, „16,00 €“ in der dritten – das Auge springt im Zickzack · Code und Stückzahl als `text-small text-foreground-muted` unter den Titel (links), Betrag rechts in der Titelzeile.
7. Details · tablet__02 Zeile „Versand“ · „Versand verfolgbar / 4,95 €“ zweizeilig rechts · wie H10 Befund 7.

**Das Stärkste**
- Mobil eine eigene Komposition: einklappbare „Bestellübersicht · 20,95 €“ oben, volle Übersicht direkt vor dem Knopf; Desktop klebende Übersicht, die die Eingaben spiegelt.
- Der Zahlungshinweis ist ehrlich und musterkonform gesetzt (Fläche, Warnleiste, Glyphe, 8 Spalten) und lenkt nicht von der Eingabe ab.

---

## Gruppe „arbeit“ · Mittel

| Ansicht | T | K | F | B | G | D | Wert |
|---|---|---|---|---|---|---|---|
| H04 Assistent | 8 | 7 | 7 | 8 | 8 | 7 | 7,5 |
| H07 Zylinder-Konfigurator | 8 | 7 | 8 | 8 | 8 | 7 | 7,7 |
| H10 Warenkorb | 8 | 7 | 8 | 8 | 7 | 7 | 7,5 |
| H11 Kasse | 8 | 7 | 8 | 8 | 7 | 7 | 7,5 |

**Mittel der Gruppe: 7,5** (genau 7,54)

**Die drei wirksamsten Änderungen**
1. **Kein Rahmen im Rahmen im Konfigurator:** Bauform, Funktion und Schlüsseltabelle in „Position n“ als Liste (`Auswahlgruppe liste` + `OptionCard zeile`, Preis als `metaSpalte`). Das macht die Position mobil 120 px breiter im Text und ruhiger (H07).
2. **Jede Summe und jede Hauptaktion einmal je Bildschirmhöhe:** H07 ohne „Laufende Summe“ im Schriftfeld, H10 ohne zweiten „Zur Kasse“-Knopf mobil, H11 Übersicht in der Reihenfolge Artikel → Kontakt → Summe mit dem Gesamtbetrag direkt über dem Knopf und zusammengefassten leeren Kontaktzeilen.
3. **FlowShell mobil straffen:** Leerraum unter dem Schritt (150–200 px) auf `pb-10` kürzen, in Schritt 08 die vier „Foto aufnehmen“ als Outline-Knöpfe, damit „Weiter“ die einzige Hauptaktion bleibt; dazu die Bandlinie am Desktop an die Inhaltskante (H04, H07).

---

## Abgleich mit E5-L-29

Den Bericht E5-L-29 habe ich erst nach meinem Urteil gelesen. Werte und Befunde oben bleiben unverändert. Die Werte steigen von 6,8 / 7,0 / 7,3 / 7,2 (Mittel 7,1) auf 7,5 / 7,7 / 7,5 / 7,5 (Mittel 7,5).

**H04 Assistent (6,8 → 7,5)**
- Behoben:
  - K1 Desktop über 12 Spalten: jetzt 8/4 mit senkrechter Schrittliste rechts, kein Umbruch der Schrittnamen (desktop__00); Weiter rechtsbündig statt Balken (tablet__01).
  - K3 Band ohne Grundfläche: Band liegt jetzt auf Grund mit Haarlinie (desktop__01). Neu: die Linie ist breiter als der Inhalt (mein Befund 6).
  - T4 Kastentitel: entfallen, das Band zeigt „Schritt 1 von 13 · Marke“.
  - T5 doppeltes Label in Schritt 03: Label jetzt „Jahr *“.
  - T6 „5 Modelle / hinterlegt“: jetzt einzeilig „5 Modelle“ in Mono (mobil__00). „Mercedes-/Benz“ bricht weiter, ohne Folgen für die Reihe.
  - F7 blau geleistete Info-Kästen in Schritt 11/12: jetzt Zeilen mit `GlyphInfo`.
  - G8 Schlüsselzeichnung in Schritt 05: steht jetzt als Band oben in der Karte.
  - D10 Seitenbreite 392 px in Schritt 13: das Ganzseitenbild ist 390 px breit, kein seitliches Scrollen sichtbar.
  - D11 Kopfknopf „Termin starten“ im Ablauf: ausgeblendet (desktop__00).
  - D12 PLZ und Ort: stehen jetzt nebeneinander (schritte/10).
- Teilweise:
  - K2 Kästen in Schritt 11–13: Schritt 13 beginnt jetzt mit den Zeitfenstern, „Frühester Termin“ ist eine Zeile. Neu steht dort aber der Warnkasten „Dieser Termin findet am Fahrzeug statt“ (mein Befund 4).
- Bleibt:
  - G9 Schritt 08 mit vier hohen Fotovorlagen, Seite weiter rund 6800 px (mein Befund 2, dazu vier Primärknöpfe).

**H07 Zylinder-Konfigurator (7,0 → 7,7)**
- Behoben:
  - K1 Zeichnung in Karte in Fläche: Zeichnung steht jetzt rahmenlos auf Papier neben den Maßfeldern (desktop__01).
  - K2 Kasten „So messen Sie richtig“: ersetzt durch die Zeile „Zylinder richtig ausmessen“ mit Glyphe (desktop__00).
  - K3 Summe nicht in der mobilen Leiste: Leiste zeigt „Summe 39,00 €“ links, Weiter rechts (mobil__00); am Desktop rechts im Band. Folge: die Summe steht jetzt dreifach (mein Befund 2).
  - T4 „Bis 70 / mm“: Zahlen und Einheiten jetzt in Mono, untrennbar (mobil__02).
  - T5 „A / I“ gegen „Maß B“: Zeichnung beschriftet jetzt „A 35 / B 35“.
  - T6 Kastentitel: entfallen, Band „Schritt 1 von 5 · Zylinder“.
  - B7 blasse Zeichnung im Ganzseitenbild: in schritte/14 und /18 vollständig mit Bemaßung.
  - D8 „auf alle 1 Zylinder“: jetzt „zurzeit 1 Stück“ (schritte/16).
  - D9 „02 WEITERLESEN“ ohne 01: jetzt „01 WEITERFÜHREND“.
  - D10 halbtransparentes Weiter in Schritt 17: jetzt deckend (schritte/17).
- Neu in meinem Urteil: Rahmen im Rahmen bei Bauform, Funktion und Schlüsseltabelle; dreifache Summe; Leerraum mobil; zu kleine Zeichnung in der Zusammenfassung; „ohne Aufpreis“ in Mono.

**H10 Warenkorb (7,3 → 7,5)**
- Behoben:
  - K1 Versandart als Karte mit Karten: jetzt Abschnitt mit Haarlinie, Radiokarten direkt auf dem Grund.
  - K3 „Passend dazu“ ohne Augenbraue, 3-Spalten-Raster: jetzt „01 WEITERLESEN“ mit einspaltigen Reihen.
  - F4 Linkreihen in Primärblau: jetzt Textfarbe mit Pfeil.
  - G5 leerer Zustand mit Taschen-Icon: jetzt Rohling-Zeichnung ohne Rahmen (Rasterfeld siehe mein Befund 5).
  - D6 „0,00 €“ mobil umgebrochen: steht jetzt in der Titelzeile (warenkorb-gefuellt__mobil__01).
  - D8 Metazeile wiederholt Titel: jetzt nur „Möbelschlüssel“ mit Plakette.
- Teilweise:
  - K2 leerer Zustand: Karte jetzt Zeichnung links, Text und Knöpfe rechts. Die Einleitung „Prüfen Sie Ihre Positionen …“ bleibt nach D-046 stehen; der zustandsneutrale Wortlaut steht noch aus.
  - D7 „Versand (Versand verfolgbar)“: Doppelung weg, die Zeile ist jetzt aber rechts zweizeilig (mein Befund 7).

**H11 Kasse (7,2 → 7,5)**
- Behoben:
  - K2 leere Karte über 12 Spalten: jetzt 8 Spalten mit „Rechtliche Hinweise“ daneben.
  - K3 Einleitung außerhalb des Kopfs: steht jetzt im Kopf.
  - T4 „Gesamtbetrag“ gegen „Gesamtsumme“: ein Begriff „Gesamtbetrag“ in Warenkorb und Kasse, USt-Zeile einzeilig mit „(19 %)“ in Mono.
  - T5 „Deutschland“ in anderer Größe: jetzt gleiche Größe wie die übrigen Werte.
  - G7 leerer Zustand mit Taschen-Icon: jetzt Rohling-Zeichnung.
  - D8 „Rechtliche Hinweise“ ohne Nummer: jetzt „04“ (die Augenbrauen tragen aber kein Wort, mein Befund 5).
- Teilweise:
  - K1 mobile Übersicht am Ende: Zeilen jetzt einzeilig mit Beträgen rechtsbündig in Mono (mobil__03). Die fünf Zeilen „Noch nicht ausgefüllt“ bleiben und machen die klebende Übersicht am Desktop zu hoch (mein Befund 1).
  - D9 Artikeltitel dreizeilig: Titel jetzt einzeilig, Code, Stückzahl und Betrag stehen aber rechts in zwei weiteren Zeilen (mein Befund 6).
- Bleibt:
  - G6 Positionsbild fehlt in der Bestellübersicht (mein Befund 3).

=== ENDE E6-L-34 · BEREIT ZUR RÜCKGABE ===
