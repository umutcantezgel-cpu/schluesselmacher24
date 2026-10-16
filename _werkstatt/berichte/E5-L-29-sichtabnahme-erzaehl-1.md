# E5-L-29 · Sichtabnahme · Gruppe erzaehl-1 (H01 Start, H02 Autoschlüssel, H03 Modell Golf, H12 Ratgeber)

Rolle: unabhängiger Gestaltungsprüfer. Grundlage: `_werkstatt/KERN.md` 1.13 (K-001, K-003, K-006, K-007 mit B-01 bis B-25, K-008, K-009). Ich urteile nur nach den Bildern. Ausgeführt habe ich nur `ls` und Read.

## Angesehene Bilder
- **H01 Start:** `H01-start__desktop__00` bis `__06` (7) · `H01-start__mobil__00` bis `__08` (9) · Einzelbilder `einzelbilder/H01/start__desktop__main-section-first-of-type-role-img__0` bis `__4` (5).
- **H02 Autoschlüssel:** `H02-autoschluessel__desktop__00` bis `__07` (8) · `H02-autoschluessel__mobil__00` bis `__11` (12, alle; bei mehr als 10 trotzdem vollständig, weil die Seite lang ist) · Einzelbilder `einzelbilder/H02/autoschluessel__desktop__main-ol-has-svg-role-img__0` bis `__4` (5).
- **H03 Modell Golf:** `H03-modell-golf__desktop__00` bis `__07` (8) · `H03-modell-golf__mobil__00` bis `__08` (9) · Tablet `H03-modell-golf__tablet__00` und `__02`, weil ich an den Schlüsselarten einen Fehler im Umbruch vermutet habe (bestätigt).
- **H12 Ratgeber:** `H12-ratgeber__desktop__00` bis `__02` (3) · `H12-ratgeber__mobil__00` bis `__04` (5).
- Alle Dateien liegen unter `/root/sm24-bilder/e5-b/`. Die E0-Bilder habe ich nicht herangezogen.
- **Nicht prüfbar aus Standbildern:** Tastaturfokus. Für H03 und H12 gibt es keine Einzelbilder. Die Bewegung dort bewerte ich nur am Register und am Endzustand.

---

## H01 · Start (`/`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 8 | Die h1 in Plex Sans 700 setzt sich mit mehr als Faktor 2,2 vom Fließtext ab (desktop 00). Augenbrauen mit Bemaßungsmarke und laufender Nummer 01–06 ziehen durch, das Schriftfeld (Anzahlung, Vorlauf, Versand) und die Öffnungszeiten stehen sauber in Mono (desktop 00 und 06). |
| Komposition | 7 | Der Kopf mit 7/5 und hinausragender Zeichnung sitzt (desktop 00). Mobil schneidet der Ausschnitt die Reide zu einem Streifen ab, „Warum wir“ zerfällt in 150-px-Spalten (mobil 00 und 03), und auf dem Desktop folgen drei Gleichteilungen aufeinander (4 Spalten → 2 Karten → 3 Spalten, desktop 03 bis 05). |
| Farbe und Bild | 8 | Stahlblau trägt die Seite. Bereichsfarben erscheinen nur im Kontext: Icons im Schnelleinstieg (desktop 01), Violett am Code-Schlüssel, Orange am Zylinder (desktop 03), Magenta am Schließplan (desktop 04). Die Flächenstufen wechseln je Abschnitt. |
| Bewegung | 8 | B-01 erzählt die Mechanik: Rohling gestrichelt, Fräser setzt an, die Einschnitte 1–6 entstehen genau unter den Marken, und am Ende hebt der Fräser frei ab (Einzelbilder 0 bis 4). |
| Grafik | 8 | Eine Familie: Profilschnitt mit Positionsmarken, Bemaßung und Legende (desktop 00), Funkschlüssel, Code-Schlüssel, Zylinder mit A 30 / I 40, Schließplan GHS→ES (desktop 02 bis 04). Mobil wird der Schließplan schmal (HS/ES, mobil 05). |
| Details | 7 | Die ganzen Zeilen sind Links mit Pfeil (desktop 01 und 05). Daneben bleiben Restlinkwörter („Zum Konfigurator“, desktop 04), Zahl und Einheit werden getrennt („etwa 7 / Tagen“, mobil 02), und die mobile Leiste im Schnelleinstieg zeigt weder Nummer noch Mono-Zeile (mobil 01). |

**Ansichtswert: 7,7**

**Generisch-Katalog:**
- **Hart:** keine. Es gibt keine Platzhalter, keine gemischten Icon-Familien, keinen Vorlader und keinen verdeckenden Effekt. Den Fokus kann ich an Standbildern nicht prüfen.
- **Weich:**
  - **Drei Gleichteilungen in Folge** („Warum wir“ 4 Spalten, „Bestellen ohne Termin“ 2 Karten, „Ratgeber“ 3 Spalten): Die Leitidee trägt das nur teilweise. Die Haarlinien passen zur Werkstattzeichnung, die gleichen Teilungen hintereinander nicht.
  - **„Wobei können wir helfen?“** ist eine Floskel. Ohne neuen Text ist sie nicht zu ändern, daher kein Befund.

**Befunde:**
1. **Komposition** · mobil 00, Kopfgrafik.
   - Stört: Der Ausschnitt lässt von der Reide nur einen etwa 12 px breiten Streifen am linken Rand stehen, das wirkt wie ein Versehen. Zugleich fallen „PROFILSCHNITT“ und die Bemaßung „Halm · 6 Einschnitte“ weg.
   - Änderung: das Ausschnittfenster (`ausschnitt` am `ImagePlaceholder` beziehungsweise `ausschnittStil()`) so weit nach links legen, dass die halbe Reide mit dem Loch sichtbar ist, und nach unten bis einschließlich der Bemaßungslinie öffnen. Die Legende darf dafür entfallen.
2. **Komposition** · mobil 03, „03 Warum wir“.
   - Stört: Das 2×2-Raster mit Textspalten von etwa 150 px erzeugt Einwortzeilen („der“) und Absätze mit fünf bis sieben Zeilen.
   - Änderung: unter 640 px einspaltig setzen, als Zeile „Nummer (Mono, `text-title-sm`) | Titel + Text“ wie die Einordnung auf H03 (`grid-cols-[3rem_1fr]`), ab `md` wie bisher.
3. **Komposition** · desktop 03 bis 05, Abfolge.
   - Stört: Auf „Warum wir“ (4 gleiche Spalten) folgen „Bestellen ohne Termin“ (2 gleiche Karten) und „Ratgeber“ (3 gleiche Spalten). „Warum wir“ hat dabei keinen Blickfang.
   - Änderung: „Warum wir“ als 5/7 bauen. Links stehen Überschrift und Satz, rechts eine 2×2-Liste mit großen Mono-Nummern 01–04 (`text-title-sm`, wie mobil bereits). So wechseln Text, Grafikkarten und Liste.
4. **Details** · mobil 02, Schritt 4 und 5.
   - Stört: Zahl und Einheit werden getrennt („etwa 7 / Tagen Vorlauf“, „69,90 €, wird / voll angerechnet“).
   - Änderung: ein geschütztes Leerzeichen zwischen Zahl und Einheit (`7 Tagen`, `69,90 €` liegt schon richtig) und `text-wrap: pretty` für die Schritttexte.
5. **Details** · desktop 04 und mobil 04, Karten „Bestellen ohne Termin“.
   - Stört: Unten steht ein eigener Link „Zum Konfigurator →“ beziehungsweise „Codelinien →“ (Linkwort-Muster).
   - Änderung: Die ganze Karte wird der Link, rechts am Titel steht nur `GlyphPfeilRechts` mit B-06 (K-006 „Keine Linkwörter“). Der freie Raum über dem Link entfällt.
6. **Details** · mobil 01, Leiste „Schnelleinstieg“.
   - Stört: Die Karten zeigen nur Icon und Namen, ohne die Nummer 01–08 und die Mono-Zeile („DIREKT KAUFEN“) der Desktopfassung. Darunter bleiben etwa 50 px leer.
   - Änderung: Nummer und Mono-Zeile aus der Desktopfassung in die Karte übernehmen und `pb-2` statt des bisherigen Abstands setzen.

**Das Stärkste:**
- B-01: Der Fräser schneidet sechs Einschnitte genau unter die Positionsmarken und hebt danach ab. Man sieht die Genauigkeit, bevor man sie liest (Einzelbilder 0 bis 4).
- Der Schnelleinstieg als nummerierte Haarlinien-Liste mit Fach-Icons in Bereichsfarbe (desktop 01) ist präzise und kein Kartenraster.

---

## H02 · Autoschlüssel (`/autoschluessel`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 7 | Kopf, Augenbraue mit Bereichs-Icon und Profillinie sitzen (desktop 00). Im Schriftfeld liegen die Werte aber auf drei Höhen (zweizeiliges Mono-Wort „Termin mit Anzahlung“, zweizeiliges Label „ERFASSTE MODELLE“), und die FAQ-Antwort läuft etwa 150 Zeichen breit (desktop 05). |
| Komposition | 6 | Der große Moment im Kopf ist ein 2×2-Raster getönter Karten mit etwa 150 px kleinen Zeichnungen (desktop 00). Danach folgen zwei gleich gebaute Listen über drei Bildschirmhöhen ohne Blickfang (desktop 01 bis 03), und im Ablauf bleibt die linke Spalte unter den Knöpfen leer (desktop 04). |
| Farbe und Bild | 7 | Die Farbe bleibt sachlich und richtig, wirkt aber blass. Die Kopfzeichnungen stehen in hellem Blau auf getönter Fläche, ohne Akzent (desktop 00). Danach kommt Grau-Blau ohne Bereichsakzent außer den Gruppen-Icons (desktop 02 und 03). |
| Bewegung | 7 | Die B-21-Staffel ist sichtbar (Einzelbilder 1 und 2). Zwischen ½ und 1 ändert sich fast nichts, und bei 0 fehlen auch die Kennungen „01 · ANSICHT“, obwohl nur die Zeichnung auftreten soll (Einzelbild 0). |
| Grafik | 7 | Die vier Schlüsselarten sind fachlich unterscheidbar: Chip, Tasten, Klappbart, Smart Key mit Signal (Einzelbild 4). Sie sind aber zu klein für den Kopf, und die Bemaßungsticks tragen keine Beschriftung. |
| Details | 6 | „Keyless“ steht in der falschen Spalte (desktop 01). „· ANSICHT“ sagt nichts (desktop 00). Die Zeilenpfeile sind hier schwarz, auf H01 und H12 blau, auf H03 grau (desktop 02 und 06). |

**Ansichtswert: 6,7**

**Generisch-Katalog:**
- **Hart:** keine. Bei 0 sind die Kopfkarten für höchstens 1,6 s leer, aber die Titel stehen. Das ist kein Vorlader.
- **Weich:**
  - **Gleichförmige Karten im Kopf (2×2):** Die Leitidee trägt nur die Zeichnungen, nicht die getönten Karten.
  - **Zwei gleich gebaute Listen in Folge (01 und 02):** Die Leitidee trägt das nicht.

**Befunde:**
1. **Komposition** · desktop 01 bis 03, Abschnitte 01 und 02.
   - Stört: Beide Abschnitte sind Zeilenlisten „Name | Text“, zusammen 20 Zeilen über drei Bildschirmhöhen ohne Blickfang.
   - Änderung:
     - In 01 je Zeile die passende Kopfzeichnung als Marke links setzen (`grid-cols-[10rem_14rem_1fr]`, Zeichnung etwa 160 px), sodass 01 eine Grafikliste wird.
     - 02 als 4/8 bauen: Gruppen-Icon und Gruppentitel links `sticky top-24`, die Zeilen rechts.
2. **Komposition** · desktop 00, Kopf.
   - Stört: Das 2×2-Raster aus getönten Karten (`surface-muted`) hält die Zeichnungen auf etwa 150 px. Der große Moment ist klein.
   - Änderung: die Fläche entfernen und stattdessen ein Haarlinien-Raster von 1 px wie im Schnelleinstieg auf H01 setzen. Die Zeichnung füllt die Zellbreite (etwa 220 px), die Kennung steht darüber, der Name darunter.
3. **Komposition** · desktop 04 und mobil 06, Ablauf.
   - Stört: Links bleiben unter den Knöpfen etwa 340 px leer. Rechts wiederholt ein weißer Hinweiskasten „Anzahlung und Vorlauf“ die Schritte 4 und 5.
   - Änderung: den Hinweis als Zeile mit `GlyphInfo` ohne Kasten in die linke Spalte unter die Knöpfe setzen (K-006 „Flächen sparsam“). Mobil steht er nach den Schritten, ebenfalls ohne Kasten.
4. **Typografie** · desktop 05, FAQ.
   - Stört: Die Antwort läuft über die volle Breite (etwa 1120 px).
   - Änderung: den Antworttext auf `max-w-measure` begrenzen und das Akkordeon auf 8 Spalten setzen (`lg:col-span-8`).
5. **Typografie** · desktop 00, Schriftfeld.
   - Stört: Die Werte liegen auf drei Höhen, weil „Termin mit Anzahlung“ (Mono, zweizeilig) und das Label „ERFASSTE MODELLE“ (zweizeilig) umbrechen.
   - Änderung: Labels `whitespace-nowrap`. Den Wortwert „Termin mit Anzahlung“ in Inter `font-medium` statt Mono setzen (Mono bleibt für 69,90 €, ca. 7 Tage, 49) oder ihm nach K-006 eine eigene Zeile geben. Die Werte richten sich an einer Grundlinie aus (`items-end`).
6. **Typografie** · desktop 04 und mobil 06, Hinweistext.
   - Stört: Fettes Mono „69,90 €“ und „7 Tagen“ springt im Fließtext in Größe und Laufweite.
   - Änderung: im Satz `font-mono tabular-nums` ohne `font-semibold`, Größe `0.92em`, nur die Zahl in Mono, die Einheit in Inter.
7. **Farbe und Bild** · desktop 00, Kopf.
   - Stört: Die hellblauen Körper auf getönter Kartenfläche haben wenig Kontrast, der Kopf hat keinen Farbakzent.
   - Änderung: Die Zeichnungen stehen auf Papier (siehe Befund 2), die Körper in `fill-area-muted`, die Konturen in `stroke-foreground`.
8. **Bewegung** · Einzelbilder 0 bis 4.
   - Stört: Die Kennungen „01 · ANSICHT“ blenden mit der Zeichnung ein, und die Phasen Körper → Profil → Marken sind kaum zu unterscheiden.
   - Änderung: Die Kennungen stehen sofort. B-21 bleibt, aber mit größeren Zeichnungen (Befund 2): Körper 0,4 s, Profil `draw` 0,6 s, Marken `sm24-fade` zuletzt, Staffel 4 × 120 ms.
9. **Grafik** · desktop 00 und mobil 00.
   - Stört: Die Bemaßungsticks unter dem Bart haben keine Beschriftung und wirken dekorativ.
   - Änderung: die Mono-Beschriftung „Bart“ an die Bemaßung setzen. Der Begriff steht schon im Text der Seite. Geht das nicht, die Ticks weglassen.
10. **Details** · desktop 01, Zeile „Keyless“ (y ≈ 680).
    - Stört: Der Titel steht in der Textspalte, die Namensspalte bleibt leer. Das bricht das Zeilenmuster.
    - Änderung: den Titel links wie in den übrigen Zeilen setzen.
11. **Details** · desktop 02, 06 und H01, H03, H12.
    - Stört: Derselbe Zeilenpfeil `GlyphPfeilRechts` erscheint in drei Farben: schwarz (H02), blau (H01 Ratgeber, H12 Weiterlesen) und grau (H03 Leistungsliste).
    - Änderung: ein Token für alle Zeilenlinks, `text-muted-foreground` in Ruhe und `text-primary` bei Hover und Fokus (B-06).
12. **Details** · desktop 00, Kopfkarten.
    - Stört: „01 · ANSICHT“ bis „04 · ANSICHT“ ist ein Wort ohne Information.
    - Änderung: nur „01“ bis „04“ stehen lassen.

**Das Stärkste:**
- Die Augenbraue mit Bereichs-Icon, Bemaßungsmarke und Profillinie über der h1 (desktop 00) ist die klarste Ausprägung der Leitidee im Kopf.
- Der Ablauf mit Fortschrittslinie und kurzen Schritten (desktop 03 und 04, mobil 05 und 06) ist ruhig und lesbar.

---

## H03 · Modell Golf (`/autoschluessel/marken/volkswagen/golf`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 7 | Die h1 und die Einordnung mit Mono-Nummern 01–04 sind sauber (desktop 00 und 04). Der mehrzeilige Mono-Wert der Schlüsselarten flattert rechtsbündig (desktop 01), und die Kopfzeile mischt Chips, freien Info-Glyph und Mono-Label (desktop 00). |
| Komposition | 4 | Die Schlüsselarten-Karten laufen über die volle Breite, jede Zeichnung ist etwa 840 px hoch. Drei Schlüssel belegen drei Bildschirmhöhen (desktop 01 bis 04, ebenso tablet 02). Die Datentabelle lässt rechts 4 Spalten und darunter etwa 160 px leer (desktop 01). |
| Farbe und Bild | 7 | Die Farbe ist an sich sachlich. Durch die Überskalierung werden aber Reiden-Flächen von etwa 360 × 270 px Hellblau zur bestimmenden Farbfläche (desktop 02 und 03). Der Status-Badge „Fahrzeug vor Ort nötig“ steht in Primärblau wie eine Aktion (desktop 00). |
| Bewegung | 7 | Nach Register gelten B-21 mit Kopien-Staffel und B-02. Den Kopf mit drei Kopien sieht man im Endzustand (desktop 00), Einzelbilder gibt es nicht. Bei dieser Größe wird jeder Auftritt der Schlüsselarten bildschirmfüllend. |
| Grafik | 5 | Die Kopfidee mit Original und zwei Kopien („nachmachen“) ist gut (desktop 00). In 1176 px Breite verlieren die Zeichnungen aber die feine Linie: Konturen wirken 4–5 px dick, Rasterfelder 70 px, die Bemaßungsticks bleiben ohne Beschriftung (desktop 02 und 03). |
| Details | 6 | „Keyless“ hängt als Info-Zeile unter der Bildunterschrift (desktop 04), hinter dem Chip „Keyless“ steht ein loser Info-Glyph (desktop 00), und „etwa 7 / Tage“ bricht (mobil 04). |

**Ansichtswert: 6,0**

**Generisch-Katalog:**
- **Hart:** keine.
- **Weich:** Gleichförmige Karten sind hier nach Fläche das vorherrschende Muster: drei Karten in voller Breite über drei Bildschirmhöhen. Die Leitidee trägt das nicht.

**Befunde:**
1. **Komposition** · desktop 01 bis 04 und tablet 02, Abschnitt „02 Schlüsselarten“.
   - Stört: Jede Karte läuft über die volle Breite (1176 px), die Zeichnung ist etwa 840 px hoch. Drei Schlüssel brauchen etwa 2600 px.
   - Änderung: als Reihe nach B-21 setzen, `md:grid-cols-3 gap-6`. Die Zeichnung ist je etwa 360 px breit, die Karte bleibt ohne Fläche (Papier, Haarlinie oben). Mobil bleibt der Stapel aus drei Karten.
2. **Komposition** · desktop 01, „01 Datensatz“.
   - Stört: Die Tabelle steht auf 8 Spalten, rechts bleiben 4 Spalten leer, darunter etwa 160 px Luft vor Abschnitt 02.
   - Änderung: 5/7 bauen. Links stehen Überschrift und Einleitungssatz (`lg:sticky top-24`), rechts die Tabelle. Den Abstand zum nächsten Abschnitt auf das Abschnittsmaß kürzen.
3. **Komposition** · desktop 00, Kopf.
   - Stört: Die Grafik steht in einem getönten, gerundeten Kasten, der Schlüssel nur im mittleren Drittel. Oben und unten bleiben je etwa 120 px leeres Raster.
   - Änderung: den Kasten entfernen (Papier oder `bg-area-soft/40` ohne Rahmen, K-006). Die viewBox auf den Inhalt plus ein Rasterfeld kürzen und die Grafik rechts über die Spalte hinausragen lassen.
4. **Typografie** · desktop 01, Zeile „Erfasste Schlüsselarten“.
   - Stört: Der zweizeilige Mono-Wert ist rechtsbündig und flattert links.
   - Änderung: je Schlüsselart eine Zeile setzen (Liste, rechtsbündig, `leading-relaxed`), damit keine Flatterkante entsteht.
5. **Typografie** · desktop 00, Kopfzeile unter dem Knopf.
   - Stört: Chips in 12 px, ein freier Info-Glyph, ein Mono-Label „BAUJAHRE · ab 2003“ und in der zweiten Zeile ein blauer Badge, also drei Schriftbilder ohne Ordnung.
   - Änderung: ein Schriftfeld wie auf H02 setzen mit den Feldern „Schlüsselarten“ (Chips), „Baujahre“ (ab 2003) und „Anlernen“ (vor Ort). Die Labels sind Mono-Caption, die Begriffe stammen aus der Datentabelle.
6. **Farbe und Bild** · desktop 00, Badge „Fahrzeug vor Ort nötig“.
   - Stört: Primärblau auf Blau-Tönung liest sich wie ein Link oder eine Aktion (K-003: Primär nur für Aktionen).
   - Änderung: einen neutralen Badge setzen (`surface-muted`, `text-foreground`, Haarlinie) und den Info-Glyph behalten.
7. **Bewegung** · desktop 02 bis 04.
   - Stört: B-21 zeichnet bei dieser Größe jede Zeichnung bildschirmfüllend. Statt einer Reihe entstehen drei gewichtige Auftritte nacheinander.
   - Änderung: Nach Befund 1 läuft die Reihe als ein Auftritt (Staffel 3 × 120 ms, Körper 0,4 s, dann Profile, je Zeichnung ≤ 1,6 s).
8. **Grafik** · desktop 02 und 03.
   - Stört: Die Striche skalieren mit, und die Werkstattlinie wird plump.
   - Änderung: die Darstellungsbreite der Generatorzeichnung auf `max-w-[480px]` begrenzen, also auf das Generatorraster 480 × 270. Nach Befund 1 ergibt sich das von selbst.
9. **Grafik** · desktop 02 und 03, Bemaßung unter dem Bart.
   - Stört: Sechs Ticks ohne Wert und ohne Beschriftung.
   - Änderung: die Mono-Beschriftung „Bart“ setzen (Begriff aus dem Seitentext) oder die Bemaßung weglassen.
10. **Grafik** · desktop 00, Kopien im Kopf.
    - Stört: Die zwei Kopien in hellgrauer Kontur gehen im Raster fast unter.
    - Änderung: Kopien in `stroke-border-strong` mit `fill-surface`, das Original bleibt `stroke-area`. So liest man „Original → Kopie“ sofort.
11. **Details** · desktop 04 und mobil 03, „Keyless“.
    - Stört: Keyless steht als Info-Zeile unter „Schematische Darstellung, nicht maßstäblich.“, abgetrennt von der Reihe.
    - Änderung: Keyless als vierte Zelle der Reihe setzen (Text mit `GlyphInfo`, ohne Zeichnung). Die Bildunterschrift steht danach unter der ganzen Reihe.
12. **Details** · desktop 00, Info-Glyph nach dem Chip „Keyless“.
    - Stört: Es bleibt unklar, wozu der Glyph gehört.
    - Änderung: den Glyph in den Chip „Keyless“ setzen (`InfoTip` als Teil des Chips) oder entfernen, weil Abschnitt 02 Keyless erklärt.
13. **Details** · mobil 04, Einordnung 03.
    - Stört: „etwa 7 / Tage in der Zukunft“ bricht zwischen Zahl und Einheit.
    - Änderung: `7 Tage` mit geschütztem Leerzeichen setzen.

**Das Stärkste:**
- Die Kopfzeichnung „Original plus zwei Kopien“ übersetzt das Wort „nachmachen“ ohne Text (desktop 00, mobil 00).
- Der Vorbehalt als 8-Spalten-Warnung auf `surface` mit 2-px-Leiste in Warnfarbe ist genau nach K-006 gebaut (desktop 05, mobil 05).

---

## H12 · Ratgeber (`/ratgeber/autoschluessel-verloren`)

| Kategorie | Wert | Begründung (Bildbezug) |
|---|---|---|
| Typografie | 8 | Die h1 ist stark und gut umbrochen („verloren — / was jetzt zu tun ist“, desktop 00). Der Fließtext steht im Maß, die Abschnittsnummern stehen in Mono und das Verzeichnis ist klar (desktop 00 und 01, mobil 01). |
| Komposition | 7 | 8/4 mit Verzeichnis und „Weiterlesen“ ist richtig (desktop 00). Die Kopfzeichnung belegt nur das obere Drittel ihres Rasters (desktop 00), der Kasten „Ihr nächster Schritt“ lässt rechts etwa 400 px leer (desktop 01), und mobil bleibt die rechte Hälfte der Zeichnung leer (mobil 00). |
| Farbe und Bild | 7 | Die Seite ist ruhig und richtig. Primärblau erscheint aber auch auf allen Abschnittsnummern und Stationen, nicht nur auf Aktionen (desktop 00 und 01). |
| Bewegung | 7 | Die B-24-Leiste am Verzeichnis ist sichtbar (desktop 01). Weil alle Abschnittsnummern im Artikel schon Primärblau tragen, kann die Hervorhebung an der Leselinie nicht sichtbar werden (desktop 00 und 01). Zu B-23 gibt es keine Einzelbilder. |
| Grafik | 6 | Die Ablaufzeichnung ist korrekt, aber generisch (Kreis → Pfeil → Kreis) und ohne Fachgeometrie. „bestellen“ endet etwa 8 px vor dem Rasterrand (desktop 00). |
| Details | 7 | Die Profillinien als Trenner sind schön (desktop 00 und 01). Der mobile Hauptknopf bricht aber zweizeilig (mobil 02), und die Nummer „03“ im Verzeichnis steht vertikal mittig statt an der ersten Zeile (desktop 01). |

**Ansichtswert: 7,0**

**Generisch-Katalog:**
- **Hart:** keine.
- **Weich:** keine Treffer. Der CTA-Kasten ist eine Fläche ohne eigenen Anlass, siehe Befund 2 zur Komposition.

**Befunde:**
1. **Komposition** · desktop 00, Kopfgrafik.
   - Stört: Die Stationen sitzen bei y ≈ 290–370, das Raster läuft bis etwa 450. Die Zeichnung hängt oben.
   - Änderung: die viewBox auf den Inhalt plus ein Rasterfeld (30) kürzen und die Grafik an der h1 ausrichten (`items-center` im Kopfraster).
2. **Komposition** · desktop 01 und mobil 02, „Ihr nächster Schritt“.
   - Stört: Ein weißer Kasten über 8 Spalten mit Knopf links, rechts bleibt leer.
   - Änderung: den Kasten entfernen. Eine Profillinie dient als Trenner (wie zwischen den Abschnitten), darunter stehen die Augenbraue „IHR NÄCHSTER SCHRITT“ und der Knopf auf Papier (K-006 „Flächen sparsam“).
3. **Komposition** · mobil 00, Kopfgrafik schmal.
   - Stört: Die senkrechte Ablaufzeichnung steht linksbündig, die rechte Hälfte des Rasters ist leer.
   - Änderung: die Zeichnung in der Breite zentrieren oder die Stationsbeschriftungen auf etwa 14 px setzen und die viewBox auf die Inhaltsbreite kürzen.
4. **Farbe und Bild** · desktop 00, Stationen und Abschnittsnummern.
   - Stört: Primärblau steht für Nicht-Aktionen (Stationskreise, Nummern 01–04, Pfeilspitzen).
   - Änderung: Stationskreise und Pfeile in `stroke-area` beziehungsweise `text-muted-foreground`, Abschnittsnummern in Ruhe `text-muted-foreground`. Primär bleibt für den Knopf und die B-24-Hervorhebung.
5. **Bewegung** · desktop 00 und 01, B-24.
   - Stört: Die Nummern 01–04 sind dauerhaft Primärblau. Die Hervorhebung „Nummer an der Leselinie in Primärfarbe“ bleibt deshalb unsichtbar.
   - Änderung: Grundfarbe `text-muted-foreground`, nur die Nummer an der 40-%-Linie wechselt per `animation-timeline` auf `text-primary` (Farbe `quick`). Ohne Unterstützung bleibt die Grundfarbe.
6. **Grafik** · desktop 00, Ablaufzeichnung.
   - Stört: Es ist ein austauschbares Dreischrittschema, das jede Branche haben könnte.
   - Änderung: in die Stationen vorhandene Glyphen setzen, nämlich `GlyphVerbot` für sichern, `GlyphSuche` für prüfen und `GlyphWarenkorb` für bestellen. Dazu Bemaßungsenden mit Pfeilspitze als Pfad nach K-008 statt gefüllter Dreiecke mitten auf der Linie.
7. **Grafik** · desktop 00, Beschriftung „bestellen“.
   - Stört: Die Beschriftung endet etwa 8 px vor dem Rasterrand, „sichern“ steht bündig links. Das wirkt eng.
   - Änderung: ein Polster von mindestens einem Rasterfeld (30) links und rechts in der viewBox. Die Beschriftungen stehen mittig unter der Station.
8. **Details** · mobil 02, Knopf „Anfrage für Ersatzschlüssel starten“.
   - Stört: Der Knopf bricht zweizeilig (K-006 „Hauptknöpfe mobil einzeilig“).
   - Änderung: Mobil fällt der Kasten weg (siehe Befund 2), der Knopf nimmt die volle Breite (350 px). Er bleibt `w-full justify-between`, dann passt der Wortlaut in eine Zeile.
9. **Details** · desktop 01, Verzeichniszeile 03.
   - Stört: Bei zweizeiligem Titel steht die Nummer vertikal mittig, in den anderen Zeilen auf der Grundlinie.
   - Änderung: `items-baseline` beziehungsweise `items-start` mit Grundlinienversatz für die Verzeichniszeilen.

**Das Stärkste:**
- Die Profillinie als Trenner zwischen den Abschnitten und der nummerierte Artikel mit Verzeichnis und B-24-Leiste (desktop 01) ergeben eine ruhige, ordentliche Lesefläche.
- Der Ablauf im Kopf wird mobil eine eigene, senkrechte Komposition, kein verkleinerter Desktop (mobil 00).

---

## Gruppe erzaehl-1 · Zusammenfassung

| Ansicht | Typo | Komp | Farbe | Bew | Grafik | Details | Wert |
|---|---|---|---|---|---|---|---|
| H01 Start | 8 | 7 | 8 | 8 | 8 | 7 | 7,7 |
| H02 Autoschlüssel | 7 | 6 | 7 | 7 | 7 | 6 | 6,7 |
| H03 Modell Golf | 7 | 4 | 7 | 7 | 5 | 6 | 6,0 |
| H12 Ratgeber | 8 | 7 | 7 | 7 | 6 | 7 | 7,0 |

**Mittel der Gruppe: 6,8** (genau 6,83)

**Die drei wirksamsten Änderungen:**
1. **H03 Schlüsselarten als Reihe** (`md:grid-cols-3`, Zeichnung ≤ 480 px, Karte ohne Fläche, Keyless als vierte Textzelle). Das spart etwa 2600 px und behebt Komposition, Grafik und Bewegung zugleich.
2. **H02 Kopf und die Abschnitte 01/02 umbauen.** Die Kopfzeichnungen werden auf Papier im Haarlinien-Raster größer. Abschnitt 01 wird eine Grafikliste mit Zeichnung je Zeile, Abschnitt 02 ein 4/8 mit festem Gruppentitel. So bekommt jede Bildschirmhöhe einen Blickfang.
3. **Gemeinsame Kleinregeln für die Gruppe:**
   - ein Farb-Token für alle Zeilenpfeile (heute schwarz, blau und grau)
   - geschütztes Leerzeichen zwischen Zahl und Einheit (H01 mobil 02, H03 mobil 04)
   - Primärblau nur für Aktionen (H03 Badge, H12 Nummern und Stationen)
   - mobile Hauptknöpfe einzeilig (H12)
   - mobiler Kopf-Ausschnitt auf H01 mit halber Reide und Bemaßung

---

## Abgleich mit E4-L-23

Diesen Abschnitt habe ich erst nach dem Urteil oben gelesen und geschrieben. Das Urteil ist unverändert. Werte E4 → E5: H01 7,3 → 7,7 · H02 6,2 → 6,7 · H03 6,0 → 6,0 · H12 5,7 → 7,0 · Gruppe 6,3 → 6,8.

### H01 Start
- **Behoben:**
  - **Dreimal dasselbe 5/7-Gerüst (D01–D03):** „Warum wir“ hat jetzt eine Überschrift über die volle Breite und vier Felder darunter (desktop 02 und 03). Diese Vierteilung ist jetzt Teil meiner neuen Folge-Kritik (drei Gleichteilungen).
  - **Schnelleinstieg mobil als 2×4-Stapel:** jetzt eine Leiste mit Anschnitt (mobil 01). Neu kritisiere ich, dass Nummer und Mono-Zeile fehlen.
  - **Funkschlüssel in weißer Karte (D02):** steht jetzt rahmenlos auf der Fläche und ragt links über die Spalte (desktop 02).
  - **Springende Mono-Kennungen:** stehen jetzt je Reihe auf einer Grundlinie (desktop 01).
  - **Violett gegen Purpur zu nah:** Code ist jetzt Violett, Schließanlagen Magenta, beide sind unterscheidbar (desktop 01 und 04).
  - **Leerraum unter der Kopfgrafik:** Die Unterkante der Grafik liegt jetzt in einer Linie mit dem Schriftfeld (desktop 00).
  - **Ungleiche Knöpfe mobil:** Der Hauptknopf nimmt jetzt die volle Breite (mobil 01). Den zweiten Knopf sehe ich im Ausschnitt nicht.
- **Bleibt:** Die Floskel „Wobei können wir helfen?“ (desktop 01, mobil 01) braucht neuen Wortlaut. Das ist Sache der Textvorschläge.

### H02 Autoschlüssel
- **Behoben:**
  - **Kopf ohne Blickfang:** Die Schlüsselarten stehen jetzt mit B-21 im Kopf (desktop 00). Neu kritisiere ich, dass die Karten getönt und die Zeichnungen klein sind.
  - **200 px Leere und wiederholter Profilschnitt:** beides entfallen (desktop 01).
  - **Mobile Stapel:** Die Schlüsselarten sind jetzt eine Leiste (mobil 00), „Weiterführende Seiten“ ist eine Zeilenliste (mobil 08 und 09).
  - **Kopfknopf mobil zweizeilig:** jetzt „Termin starten“, einzeilig (mobil 00).
  - **Fehlende Augenbrauen:** 01 bis 06 ziehen jetzt durch.
  - **Getönte Infobox:** jetzt `surface` mit Haarlinie, mobil nach Schritt 5 (desktop 04, mobil 06). Neu: Ich empfehle, den Kasten ganz durch eine Glyph-Zeile zu ersetzen und das Mono im Satz nicht fett zu setzen.
  - **Kein Moment über der Falz:** B-21 liegt jetzt im Kopf.
  - **Profilschnitt ohne Bezug zum Text:** entfernt.
  - **„Zur Seite →“ vierzehnmal:** jetzt sind die Zeilen selbst Links mit Pfeil (desktop 02 und 03).
  - **ⓘ als Aufzählungszeichen:** steht jetzt inline hinter dem Titel.
  - **Chip „Mercedes-Benz“ zweizeilig:** jetzt einzeilig (desktop 04).
- **Teilweise:**
  - **6-s-Restbewegung von B-21:** Dauern kann ich an fünf Einzelbildern nicht messen. Zwischen ½ und 1 ändert sich weiter kaum etwas.
  - **Keyless-Zusatz als eigene Zeile:** Keyless ist jetzt eine eigene Zeile, steht aber in der falschen Spalte (desktop 01, neuer Befund).
- **Bleibt:**
  - **Klappbart dreht aus:** nur der Pfeil ist zu sehen, der Bart dreht nicht (Einzelbild 3 und 4). Das braucht einen Registereintrag.
  - **Notschlüssel im Smart Key gestrichelt:** an 150 px nicht erkennbar (desktop 00, Karte 04).

### H03 Modell Golf
- **Behoben:**
  - **Kopf reiner Text:** Die Stapelgrafik steht jetzt im Kopf (desktop 00). Neu kritisiere ich den getönten Kasten und das leere Raster.
  - **Tabellenwerte in Inter:** jetzt Mono (desktop 01).
  - **Waise „ab 2003.“:** jetzt das Mono-Feld „BAUJAHRE · ab 2003“ (desktop 00).
  - **Fehlende Augenbrauen:** 01 bis 05 ziehen jetzt durch.
  - **Warnkasten vollbreit und beige:** jetzt 8 Spalten, `surface`, 2-px-Leiste (desktop 05).
  - **Zwei Knopfwortlaute:** jetzt einheitlich „Mit diesem Fahrzeug starten“ (desktop 00 und 06).
  - **Tabellenlabel zweizeilig:** jetzt einzeilig (desktop 01).
- **Teilweise:**
  - **Isolierte ⓘ-Glyphe:** am Badge „Fahrzeug vor Ort nötig“ sitzt die Glyphe jetzt im Badge. Hinter dem Chip „Keyless“ steht aber eine neue freie ⓘ (desktop 00).
  - **200 px Leere nach der Tabelle:** jetzt etwa 160 px, und rechts neben der Tabelle bleiben 4 Spalten leer (desktop 01).
  - **Moment im Kopf:** Die Grafik steht oben, aber ohne Einzelbilder kann ich die Bewegung nicht prüfen.
- **Bleibt, mit Rückschritt:**
  - **Keyless als vierte Karte mit `grid-cols-4`:** nicht umgesetzt. Keyless hängt weiter als Textzeile (desktop 04, mobil 03). Statt eines Vierer-Rasters laufen die Karten jetzt über die volle Breite mit etwa 840 px hohen Zeichnungen (desktop 01 bis 04, tablet 02). Das ist der schwerste Befund dieser Abnahme.
  - **Bauformen mobil als Stapel:** weiter gestapelt (mobil 02 und 03). Nach K-006 ist das bei drei Karten zulässig, deshalb kein neuer Befund.
  - Der E4-Befund zur Strichskala bei Überskalierung (dort H12) tritt jetzt auf H03 auf (desktop 02 und 03).

### H12 Ratgeber
- **Behoben:**
  - **Funkschlüssel ohne Bezug:** ersetzt durch die Ablaufzeichnung „sichern → prüfen → bestellen“ (desktop 00, mobil 00). Neu kritisiere ich, dass die Zeichnung generisch ist und oben hängt.
  - **Dicke Striche durch Überskalierung:** entfallen mit dem Tausch.
  - **Kopf rechts leer:** jetzt 7/5.
  - **Artikel als reiner Text:** jetzt Profillinien-Trenner und Mono-Nummern 01–04 (desktop 00 und 01).
  - **Gedankenstrich vorn in der H1:** steht jetzt am Zeilenende (desktop 00).
  - **H2 ohne Nummern:** jetzt nummeriert.
  - **Hellblaue Gehäusefläche:** entfallen.
  - **Fortschritt am Verzeichnis:** B-24 ist eingetragen, die Leiste ist sichtbar (desktop 01). Neu: Die Hervorhebung bleibt unsichtbar, weil alle Nummern schon Primärblau tragen.
  - **Doppelte Handlung in „Weiterlesen“:** entfallen.
  - **„Passend dazu“ mit einem Eintrag:** mit „Weiterlesen“ zusammengeführt.
- **Teilweise:** Der Knopf mobil ist jetzt linksbündig mit Pfeil rechts, bricht aber weiter zweizeilig (mobil 02).
- **Nicht prüfbar:** B-23 im Kopf. Es gibt keine Einzelbilder, der Eintrag im Register besteht.

=== ENDE E5-L-29 · BEREIT ZUR RÜCKGABE ===
