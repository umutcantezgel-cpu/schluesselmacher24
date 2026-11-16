# FA-QA-04D · Bericht: Schrift in den Zeichnungen mindestens 14 px

Anforderung FA-26-01 („gut lesbare Schrift“, auch für ältere Kunden). Grundlage: Befunde 1 und 2 der Nachbesserung in `berichte/FA-QA-04A.md` und die Liste `BEKANNTE_GRAFIKSCHRIFT` (14 Stellen).

## GEÄNDERTE DATEIEN

Zeichnungen (Schreibrecht `src/components/visual/**`):
- `src/components/visual/einsatzradius.tsx`, `einsatzradius.test.tsx`
- `src/components/visual/generators/ablauf.tsx`, `ablauf.test.tsx`
- `src/components/visual/generators/autoschluessel-aufbau.tsx`, `autoschluessel-aufbau.test.tsx`
- `src/components/visual/generators/code-fundstelle.tsx`, `code-fundstelle.test.tsx`
- `src/components/visual/generators/foto-beispiel.tsx`, `foto-beispiel.test.tsx`
- `src/components/visual/generators/profilschnitt.tsx`, `profilschnitt.test.tsx`
- `src/components/visual/generators/schliessplan.tsx`, `schliessplan.test.tsx`
- `src/components/visual/generators/schluessel.tsx`, `schluessel.test.tsx`
- `src/components/visual/generators/stiftzuhaltung.tsx`, `stiftzuhaltung.test.tsx`
- `src/components/visual/generators/tuer-schutz.tsx`, `tuer-schutz.test.tsx`
- `src/components/visual/generators/zylinder-mass.tsx`, `zylinder-mass.test.tsx`
- `src/components/visual/generators/grafik-basis.tsx`: `SCHRIFT` und `SCHRIFT_KLEIN` entfernt, weil keine Zeichnung sie mehr nutzt. An ihrer Stelle steht die Regel.
- `src/components/visual/beschriftung-test-hilfe.ts` (neu; in der Nachbesserung aus `generators/` herausgenommen, KERN K-008): Hilfen nur für Tests. Sie lesen die `<text>` aus dem Markup und schätzen ihren Platz (Mono 0,6 em, Oberlänge 0,75 em, Unterlänge 0,25 em).
- `src/components/visual/README.md`: Regel zur Grafikschrift, statt „SCHRIFT 13, SCHRIFT_KLEIN 12“.

Test: `src/app/(site)/schriftstufen.test.ts`. Seiten: keine. Es musste keine Legende auf eine Seite.

## WAS UND WARUM

Rechnung: Schrift auf dem Bildschirm = Schrift in Einheiten × Darstellungsbreite / Breite des Zeichenrasters (viewBox). Ziel waren mindestens 14 px bei 360 px Fensterbreite, und zwar an der schmalsten Stelle, an der die Zeichnung steht. Die Breiten habe ich aus dem Markup der Seiten gelesen: `shell` mit `px-5` ergibt 320 px Inhalt, `-mx-5` 360 px. Rahmen und Innenabstand der Kästen sind abgezogen. Eine gemeinsame Größe passt nicht, weil die Zeichnungen zwischen 206 und 360 px breit stehen. Deshalb hat jede Zeichnung ihren eigenen Wert. Die Rechnung steht an der Konstanten und im Test der Zeichnung.

Wege nach Vorgabe, in dieser Reihenfolge:
1. **Schrift angehoben, Anordnung angepasst.** Das gilt für alle Zeichnungen. Kreise, Kästen, Abstände und die Lage der Beschriftung sind mitgewachsen:
   - Positionskreise am Autoschlüssel: r 11 → 18.
   - Marken an der Tür: r 9 → 13. Die Legende ist nach links gerückt und endet bei x 466 statt 500.
   - Fahrzeugschein: Blatt kleiner, Legende in zwei Zeilen.
   - Typenschild und Schlüsselspitze: nach links gerückt.
   - Profilschnitt: Die Maßzahl steht jetzt unter der Maßlinie, frei von den Maßhilfslinien. Die Legende ist breiter gesetzt.
   - Schließplan breit: Schlüsselkasten mit Symbol enger (31 + Kürzel statt 34 + Kürzel), Schlüsselkasten schmal 24 statt 22 hoch.
   - Zylinder-Maß: „außen | innen“, „Mitte Stulpschraube“ und „Überstand“ stehen als Zeilen unter dem Zylinder statt seitlich. Der Maßstab folgt jetzt auch der Höhe. Ist eine Maßlinie kürzer als ihre Zahl, rückt die Zahl nach außen.
   - „Trennlinie“ steht jetzt knapp vor dem Gehäuse (Ende x 146).
2. **Schmale Fassung:** Die vorhandenen schmalen Fassungen (Ablauf, Schließplan, Zylinder-Maß) haben größere Schrift bekommen. Neue schmale Fassungen waren nicht nötig.
3. **Legende als Text unter der Zeichnung:** nicht nötig.

Keine Beschriftung entfällt, kein Text ist gekürzt, und die Beschriftungen nennen nur, was sie vorher nannten (R4). Zwei Stellen stehen jetzt anders, der Wortlaut ist gleich:
- Schließplan schmal: Liegen zwei Reservetüren enger als „frei“ breit ist, rückt das zweite „frei“ eine Zeile tiefer. Die Fläche wächst dann um 18 Einheiten, beim Generalhauptschlüsselplan 2/6/2 von 254 auf 272.
- Schlüssel Buntbart: Die Stufen sind nur 13 Einheiten breit. Die Lineal-Ziffern stehen deshalb abwechselnd in zwei Zeilen.

Alternativtexte habe ich nicht geändert.

`data-legende`: `globals.css` setzt Text mit diesem Attribut im Telefon-Ausschnitt auf 16 Einheiten zurück. Das waren 11,5 bis 11,6 px. Bei Code-Fundstelle, Tür-Schutz und Foto-Beispiel ist das Attribut deshalb entfernt. Tür-Schutz hält die Zeilengruppe mit `data-zeile`. `globals.css` habe ich nicht angefasst.

Test `schriftstufen.test.ts`: Die Liste `BEKANNTE_GRAFIKSCHRIFT` ist leer. Keine Grafikschrift liegt mehr unter 14 Einheiten. Diese Prüfung ist nur notwendig, nicht hinreichend. Hinreichend ist erst die Bildschirmgröße, und die prüft der Test jeder Zeichnung mit der Darstellungsbreite der Seite. Der Prüftest „findet die Beschriftung“ verlangt jetzt alle elf Zeichnungen mit Text und eine aufgelöste eigene Konstante. Vorher verlangte er die gemeinsamen Konstanten. Keine Prüfung ist gelockert.

Neu je Zeichnung ist ein Test. Er prüft:
- Schrift in Einheiten und auf dem Bildschirm (`bildschirmPx` ≥ 14 an der schmalsten Stelle),
- alle Beschriftungen in der Fläche bzw. im Telefon-Ausschnitt der Seite,
- keine Überlappung von Beschriftungen,
- Kürzel im eigenen Kasten (Schließplan),
- Marken frei voneinander (Tür-Schutz, Autoschlüssel),
- Zeilen unter Zylinder und Türblatt (Zylinder-Maß).

Angepasste bestehende Tests: Sie hielten feste Koordinaten und Größen des alten Layouts. Ich habe die neuen Werte eingetragen und dabei die Absicht des Tests erhalten. Das betrifft:
- Fingerabdrücke von Stiftzuhaltung (gleiche Längen) und Zylinder-Maß (4120 statt 3979 Zeichen; der alte Wert steht im Kommentar),
- Höhe 254 → 272 beim Schließplan 2/6/2 schmal,
- Pfade und Zeilen der Tür-Schutz-Legende,
- Lage der Maßlinien beim Zylinder-Maß. Statt fester x-Werte prüft der Test jetzt die Bezüge: A endet an der Stulpschraube, B beginnt dort, A:B = 35:45, Türblatt bis Innenende.

Sichtprobe: Ich habe jede geänderte Zeichnung als statisches Markup gerendert (sharp) und angesehen. Das Ergebnis: keine Überlappung und nichts außerhalb der Zeichnung, für alle Zeichnungen und Varianten in der Tabelle unten.

## TABELLE DER ZEICHNUNGEN

Schrift in Einheiten und daraus auf dem Bildschirm, bei 360 px und 1280 px Fensterbreite. „etwa“: Breite aus dem Raster der Seite gerechnet, nicht gemessen.

| Zeichnung | Seiten | Raster (viewBox) | Darstellungsbreite 360 / 1280 px | Schrift vorher | Schrift nachher |
|---|---|---|---|---|---|
| Einsatzradius | `/standorte/[city]` (Kopf) | 360 × 270 | 320 / etwa 472 px | 13 → 11,6 / 17,0 px | 16 → 14,2 / 21,0 px |
| Autoschlüssel-Aufbau (Positionsnummern) | `/autoschluessel` | 560 × 320 | 294 / etwa 639 px | 12 → 6,3 / 13,7 px | 28 → 14,7 / 31,9 px |
| Ablauf schmal (unter 640 px) | `/service-und-termin` (Kopf), Partnerseiten (Kasten `p-4`, 288 px); `ratgeber/[slug]` frei in 4:3 (320 × 240 px, bei vier Stationen durch die Höhe begrenzt) | 300 × 136–316 (Nachbesserung; vorher 156–360) | 288 px; Ratgeber 320 × 240 px | 12 → 11,5 px | 16 → 15,4 px; Ratgeber mit vier Stationen 16 × 240 / 256 = 15,0 px (vor der Nachbesserung 13,2 px) |
| Ablauf breit (ab 640 px) | dieselben | 480 × 270 | – / etwa 424 px; schmalste Stelle 1024 px: etwa 335 px (Kasten `p-6`), Ratgeber frei etwa 384 px | 16 → 14,1 px bei 1280, 11,2 px bei 1024 | Nachbesserung: 20,5 (Nummern 22) → 14,3 px bei 1024, 18,1 px bei 1280 |
| Code-Fundstelle („Am Schlüsselkopf“) | `/schluessel-nach-code` (Kopf; unter 640 px Ausschnitt 440) | 480 × 270 | 320 px auf 440 / etwa 472 px | 16 per CSS → 11,6 / 13 → 12,8 px | 20 → 14,5 / 19,7 px |
| Foto-Beispiel (5 Motive) | Upload-Felder: Fahrzeug-Anfrage, Einsenden, Vorlage-Anfrage, Partner, Autoschlüssel-Fotos | 480 × 300 | 288–320 / etwa 378 px | 13 → 7,8–8,7 / 10,2 px | 24 → 14,4–16 / 18,9 px |
| Profilschnitt (Nummern, Maßzahl, Legende) | Startseite (Ausschnitt 350), `/schluessel-nach-code/[slug]` (Ausschnitt 334) | 480 × 360 | 320 px auf 350 bzw. 334 / etwa 472–604 px | 12 → 11,0 bzw. 11,5 / 11,8 px | 18 → 16,5 bzw. 17,2 / 17,7 px |
| Schließplan schmal | Kopf `/schliessanlagen`, Systeme (Erweiterbare Anlage), `/gleichschliessende-zylinder`, Plan-Interaktiv, Projekt-Konfigurator | 360 × 116–272 | 318–360 px | 12 → 10,6–12 px | 16 → 14,1–16 px |
| Schließplan breit | Startseite (Ausschnitt), Kopf `/schliessanlagen`, Konfigurator, ab 640 px überall | 480 × 300 | 286 px auf den Ausschnitt / etwa 408 px (Konfigurator 1280); schmalste Stelle 1024 px: Konfigurator etwa 318 px, Kopf `/schliessanlagen` etwa 384 px (3:2) | 13 → 11,4 / 11,6 px | Nachbesserung: 21,5 → Konfigurator 14,3 px bei 1024, 18,3 px bei 1280; Kopf 17,2 px bei 1024 |
| Schlüssel (Lineal-Ziffern, nur mit `einschnitte`, derzeit auf keiner Seite) | über die Registry möglich | 480 × 270 | mindestens 280 px (Annahme) | 12 → 7,0 px | 24 → 14,0 px |
| Stiftzuhaltung (Code, „Trennlinie“) | Fehlerseiten 404/500 | 480 × 270 | 318 / etwa 572 px | 13/12 → 8,6/7,95 / 15,5/14,3 px | 22 → 14,6 / 26,2 px |
| Stiftzuhaltung, Szene („Trennlinie“) | `/gleichschliessende-zylinder` (Ausschnitt 370, bis an den Rand) | 480 × 270 | 360 px auf 370 / etwa 673 px | 12 → 11,7 / 16,8 px | 14,5 → 14,1 / 20,3 px |
| Tür-Schutz (Legende und Marken) | Kopf `/tuer-und-schliesstechnik`, `/sicherheitstechnik`, `/service-und-termin/vor-ort` (Ausschnitt 444) | 480 × 300 | 318 px auf 444 / etwa 472 px | Legende 16 per CSS → 11,5, Marke 15 → 10,7 / 12,8 px | 20 → 14,3 / 19,7 px |
| Zylinder-Maß schmal | Startseite (Karte), Kopf `/gleichschliessende-zylinder` (16/9, durch die Höhe begrenzt), Zylinder-Konfigurator | 300 × 220 | 206 / 245 / etwa 250 px | 16/15 → 11,0/10,3 px (Karte) | 21 → 14,4 / 17,2 / 17,5 px |
| Zylinder-Maß breit | Schließanlagen-Konfigurator (auch auf dem Telefon), Startseite ab 1024 px | 480 × 270 | 294 / etwa 522 px | 13/12 → 8,0/7,4 / 14,1/13,1 px | 23 → 14,1 / 25 px |

Zeichnung ohne Schrift, unverändert: `zutritt-signal`.

## PRÜFUNG UND ERGEBNIS

Alle Läufe über die Datenweiche:
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`: 256 Dateien, 4037 Tests bestanden, 0 rot.
- `… -- npm run typecheck` (`tsc --noEmit`): ohne Fehler.
- `… -- npm run lint` (`eslint .`): ohne Befund.
- `… --json -- npm run build`: Exit 0, alle Routen gebaut.

Kein Server, kein git. Die Sichtprobe der geänderten Zeichnungen lief als statisches Markup, gerendert mit `sharp` außerhalb des Repos. Die Sichtprobe auf den Seiten bei 360, 390, 768 und 1280 px steht beim Orchestrator. Die Seiten je Zeichnung stehen in der Tabelle.

## OFFENE FRAGEN

1. **Fensterbreiten 1024 bis etwa 1270 px:** in der Nachbesserung behoben (siehe dort, Befund 1). Alle drei Stellen liegen jetzt bei 1024 px über 14 px, ohne Änderung an den Seiten.
2. **Veraltete Kommentare in Seiten**, die ich nicht ändern durfte. Sie nennen alte Lagen und 11,5 bis 12 px, die Werte im Code stimmen:
   - `src/app/(site)/page.tsx` Z. 49–55 („Text y 266, Linie 274 … 12 px Schrift“),
   - `src/app/(site)/schluessel-nach-code/[slug]/page.tsx` Z. 49 („Schrift 11,5 px“),
   - `src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx` Z. 1997 („Schrift 12“).

   Folgepaket mit Schreibrecht auf diese Seiten: Kommentare berichtigen und die Ausschnitte (`KOPF_AUSSCHNITT_MOBIL`, `PROFILSCHNITT_HALM`, `STIFTZUHALTUNG_AUSSCHNITT`) als Konstanten neben die Generatoren legen und dort importieren. Seiten dürfen in Next.js keine eigenen Werte exportieren; bis dahin lesen die Tests die Werte aus dem Quelltext der Seiten (Nachbesserung, Befunde 6 und 10).
3. **Angenommene Darstellungsbreiten:** Foto-Beispiel in einem Kasten mit `p-4` (288 px), Schlüssel-Ziffern mindestens 280 px, Schließplan schmal mindestens 318 px. Die Formulare und Bildflächen habe ich aus dem Markup gelesen, nicht im Browser gemessen. Bitte in der Sichtprobe bei 360 px bestätigen.
4. **Schließplan breit mit acht Blättern** (etwa 2/6/2 mit Reserve): Das vorhandene Sicherheitsnetz verkleinert die Zeichnung bei Schrift 21,5 um rund 2,0 % (Maßstab 0,980; Grenze des Tests 0,98). Der Test lässt höchstens 2 % zu und prüft verkleinerte Pläne jetzt ebenfalls auf Lage, Überlappung und Kürzel im Kasten. Mit zehn Blättern (8 Türen und 2 Reserve, Bestand) verkleinert er wie vorher stärker; diese Lage steht auf keiner Seite.
5. **Neue Anordnung beim Zylinder-Maß** („außen | innen“ an der Stulpschraube unter dem Zylinder statt an den Enden) und **zweizeilige Ziffern beim Buntbart:** fachlich gleichwertig, aber eine Gestaltungsentscheidung. Bitte in der Sichtprobe ansehen.
6. **KERN und Entscheidungen veraltet (außerhalb meiner Schreibrechte):** `docs/gestaltung/KERN.md` Z. 228 und `_werkstatt/ausbau/KERN.md` Z. 235 nennen „Beschriftungen im Bild mindestens etwa 11,5 px“ und „Legenden mit `data-legende` werden darin größer gesetzt“; `_werkstatt/ausbau/ENTSCHEIDUNGEN.md` Z. 343 beschreibt die Legende von Tür-Schutz mit 16 Einheiten über `data-legende`. Beides gilt nicht mehr: Untergrenze 14 px (FA-26-01), und kein Generator setzt `data-legende` mehr. Die Regel `.sm24-ausschnitt [data-legende]` in `src/app/(site)/globals.css` Z. 882 wirkt damit ins Leere. Vorschlag für ein Folgepaket: KERN auf „mindestens 14 px“, den Satz zu `data-legende` streichen, die tote CSS-Regel entfernen (Gestaltungswerte in `globals.css` waren mir untersagt).
7. **Ablauf breit in bis zu drei Reihen:** Gestaltungsentscheidung der Nachbesserung (Befund 1). Bitte in der Sichtprobe auf `/service-und-termin` ab 1024 px ansehen.

## FÜR MENSCHEN

- Keine Entscheidung des Inhabers nötig. Preise, Rechtstexte und Texte der Seiten sind unberührt.
- Gestaltung, zur Sichtprobe: Auf großen Bildschirmen wirken einige Beschriftungen jetzt kräftig, etwa 26 px auf der Fehlerseite und 32 px an den Positionsnummern des Autoschlüssels. Das folgt aus „gut lesbar auch auf dem Telefon“, weil dieselbe Zeichnung mitwächst. Wirkt das zu groß, bräuchten diese Zeichnungen eine eigene breite Fassung mit kleinerer Schrift ab 1024 px.

## NACHBESSERUNG

Zwölf Befunde zweier Gegenprüfer, jeder am Code geprüft. Keine Seite geändert; alle Änderungen liegen in `src/components/visual/**` und in diesem Bericht.

| Nr. | Befund | Ergebnis |
|---|---|---|
| 1 | [rot] Schrift unter 14 px zwischen 1024 und etwa 1270 px | **behoben** |
| 2 | Ablauf schmal auf `ratgeber/[slug]` mit vier Stationen 13,2 px | **behoben** |
| 3 | README Z. 180, 274, 368 veraltet | **behoben** |
| 4 | Testhilfe liegt in `generators/` | **behoben** |
| 5 | KERN, ENTSCHEIDUNGEN, `globals.css` zu `data-legende` und 11,5 px | **zutreffend, offen** (außerhalb der Schreibrechte, OFFENE FRAGE 6) |
| 6 | Profilschnitt-Test mit abgeschriebenen Ausschnitten, alte Seitenkommentare | **behoben** im Test; Seitenkommentare offen (OFFENE FRAGE 2) |
| 7 | [rot] Zylinder-Maß: Gleichheit von Maß A und B mit/ohne Beschlag entfernt | **behoben** |
| 8 | Schlüssel: Platz unter dem Lineal nicht in Flächeneinheiten | **behoben** |
| 9 | Code-Fundstelle: feste Zahl 234 im Test | **behoben** |
| 10 | Stiftzuhaltung-Test mit kopiertem Ausschnitt | **behoben** |
| 11 | Einrückung `hash,` in `profilschnitt.tsx` | **behoben** |
| 12 | README Z. 367 zu `data-legende` widersprüchlich | **behoben** |

Je Befund:

1. **Zutreffend, behoben ohne Seitenänderung.** Die Schreibrechte reichen nicht auf die Seiten. Deshalb ist die Schrift in den Generatoren gehoben. Gerechnet ist an der schmalsten Stelle bei 1024 px: Inhalt 960 px, Spaltenabstand 28 px, 5 von 12 Spalten = 383,7 px.
   - **Ablauf breit:** Schrift 16 → 20,5, Nummern 18 → 22. Im Kasten mit `p-6` (335,7 px) ergibt das 14,3 px, die Nummern 15,4 px; frei auf dem Ratgeber (383,7 px) 16,4 px. Bei 20,5 Einheiten passen lange Beschriftungen nicht mehr in zwei Reihen: Die Seite `/service-und-termin` braucht für „Bedarfsanalyse … Dokumentation“ 75 Einheiten Abstand, verfügbar sind 62. Neu ist `ablaufReihen`: so wenige Reihen wie möglich, höchstens drei, reihum (01/04, 02/05, 03). Tiefe Führungslinien enden über der obersten Beschriftung einer höheren Reihe, der sie näher als 10 Einheiten kämen (`tiefeFuehrung` nimmt jetzt die Grundlinien der Hindernisse). 21 statt 20,5 passt bei fünf Einträgen mit je 14 Zeichen auch in drei Reihen nicht (Fehlbetrag 0,3 Einheiten bei 30 Einheiten Rand).
   - **Schließplan breit:** Schrift 17 → 21,5. Die engste Stelle ist der Projekt-Konfigurator bei 1024 px. Er steht in einer Karte (Rand 1, `px-6`), darin 5 von 12 Spalten mit `gap-8` und ein Kasten mit Rand und `p-5`. Das ergibt etwa 318 px. Die Gegenprüfung nannte 341 px; dort fehlt der Innenabstand der Karte. 21,5 × 318 / 480 ergibt 14,3 px. Im Kopf von `/schliessanlagen` (Fläche 3:2) ergibt es 17,2 px. 22 überlappt in den Prüffällen, 21,5 nicht. Acht Blätter verkleinert das Sicherheitsnetz auf Maßstab 0,980, genau an der Grenze des Tests (0,98); dort liegt die Schrift bei 21,1 Einheiten. Auf keiner der genannten Seiten steht ein Plan mit acht Blättern.
   - **Tests:** Ablauf rechnet 335,7 px mit drei Beschriftungen, der Seite und dem Grenzfall fünfmal 14 Zeichen. Schließplan rechnet Kopf und Konfigurator bei 1024 px. Neu geprüft werden die seitliche Luft aller Führungslinien zu allen Beschriftungen, die Seite, die Partnerseiten und die Grenzfälle. Die Prüfung verkleinerter Pläne wird nicht mehr übersprungen: Sie prüft jetzt Lage auf der Fläche, Überlappung und Kürzel im Kasten.
   - **Angepasste Erwartungen:** drei statt zwei Reihen bei vier und fünf Einträgen mit 14 Zeichen, Schriftgrößen 20,5 und 22, Unit-Tests von `tiefeFuehrung` mit der neuen Signatur. Keine Prüfung ist gelockert. Die Prüfung auf Überlappung gilt jetzt für jede Reihe mit der Schriftgröße statt fest 16.
   - **Sichtprobe:** als statisches Markup gerendert (Seite, fünfmal 14 Zeichen, Partner, drei Schritte, schmal mit vier Stationen, Schließplan-Varianten). Keine Überlappung, nichts außerhalb.
2. **Zutreffend, behoben.** Schmal: `kopf` 88 → 76, `zeile` 68 → 60. Die Höhen sind jetzt 136/196/256/316 für zwei bis fünf Stationen, vorher 156/224/292/360. In 320 × 240 px mit vier Stationen ergibt das 16 × 240 / 256 = 15,0 px. Kreise (r 22) und Schrift haben weiter Abstand. Der Test rechnet 4:3 bei 320 px für zwei bis vier Stationen. Die Tabellenzeile oben ist berichtigt.
3. **Zutreffend, behoben.** README: Schließplan `format` „breit Schrift 21,5 · schmal Schrift 16“, Ablauf „breit Schrift 20,5 · schmal Schrift 16“, Nummer 22, Reihen und Höhe schmal. Die Telefonzeile lautet jetzt „mindestens 14 px (FA-26-01)“.
4. **Zutreffend, behoben.** Die Testhilfe liegt jetzt in `src/components/visual/beschriftung-test-hilfe.ts`. Die Importe in den sieben Tests sind angepasst; nur diese sieben importieren sie, nicht elf.
5. **Zutreffend, nicht in meinen Schreibrechten** (KERN, ENTSCHEIDUNGEN, Gestaltungswerte in `globals.css`). Als OFFENE FRAGE 6 aufgenommen.
6. **Zutreffend, im Test behoben.** Die Konstanten lassen sich nicht aus den Seiten importieren: Next.js lässt in `page.tsx` keine eigenen Exporte zu, und Seiten sind außerhalb meiner Schreibrechte. Neu ist `ausschnittAusQuelle` in der Testhilfe. Es liest `KOPF_AUSSCHNITT_MOBIL` (mit `...PROFILSCHNITT_AUSSCHNITT` aus dem Generator) und `PROFILSCHNITT_HALM` aus dem Quelltext der Seiten. Ändert eine Seite ihren Ausschnitt, prüft der Test den neuen Wert. Ein eigener Test bestätigt die heutigen Werte. Die Seitenkommentare bleiben offen (OFFENE FRAGE 2, mit Vorschlag zum gemeinsamen Ablageort).
7. **Zutreffend, behoben.** Der Maßstab rechnet jetzt immer mit dem Platz für drei Zeilen und Strecke (`untenPlatz`). Er ist damit mit und ohne Schutzbeschlag gleich. `expect(masslinienEnden(mit)).toEqual(masslinienEnden(ohne))` steht wieder im Test, zusätzlich für breit und schmal. Der Fingerabdruck ist neu genommen (4244 Zeichen, Hash 2908997467; der alte Wert steht im Kommentar). Die Schrift ist unverändert, weil sie nicht mit dem Maßstab skaliert. Ohne Beschlag ist der Zylinder in höhenbegrenzten Fällen etwas kleiner als in FA-QA-04D.
8. **Zutreffend, behoben.** Neu ist `einpassungUnterLineal`. Es rechnet den Platz unter dem Lineal in Flächeneinheiten beim endgültigen Maßstab: skala · (linealY − y1) + unten ≤ 230. Das gilt für eine und für zwei Zeilen Ziffern. Bei Maßstab 1 ist das Ergebnis gleich wie vorher. Kleine Maßstäbe kommen nur beim Funkschlüssel vor (0,93 bis 0,96), nicht beim Buntbart. Der neue Test prüft deshalb Funk mit zwei und drei Kopien, Funk in der Bartansicht und Buntbart mit drei Kopien: Die Ziffern enden innerhalb der Einpassung (≤ 250), ohne den Rand von 20 Einheiten zu brauchen. Er prüft auch, dass mindestens ein Fall unter Maßstab 1 liegt.
9. **Zutreffend, behoben.** Das Linienende kommt aus dem Markup: die senkrechte Linie mit dem x der Schrift. Der Test vergleicht es mit der Oberkante der Schrift.
10. **Zutreffend, behoben** wie Befund 6. `STIFTZUHALTUNG_AUSSCHNITT` wird aus dem Quelltext der Seite gelesen. Zusätzlich muss die Beschriftung rechts und unten im Ausschnitt liegen.
11. **Zutreffend, behoben** (zwei Leerzeichen).
12. **Zutreffend, behoben.** README Z. 367: „`data-legende` setzt Text darin auf 16 Einheiten, derzeit ungenutzt und nicht für Text mit Mindestgröße“. Die tote Regel in `globals.css` ist als OFFENE FRAGE 6 an den Orchestrator gegeben.

Geänderte Dateien in der Nachbesserung:
- Generatoren: `src/components/visual/generators/ablauf.tsx`, `schliessplan.tsx`, `schluessel.tsx`, `zylinder-mass.tsx`, `profilschnitt.tsx`.
- Tests: `ablauf.test.tsx`, `schliessplan.test.tsx`, `schluessel.test.tsx`, `zylinder-mass.test.tsx`, `profilschnitt.test.tsx`, `stiftzuhaltung.test.tsx`, `code-fundstelle.test.tsx`, `foto-beispiel.test.tsx`, `tuer-schutz.test.tsx` (die letzten zwei nur der Importpfad).
- Testhilfe verschoben: `src/components/visual/generators/beschriftung-test-hilfe.ts` → `src/components/visual/beschriftung-test-hilfe.ts`, ergänzt um `ausschnittAusQuelle`.
- `src/components/visual/README.md`.

Prüfung der Nachbesserung, alle Läufe über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 256 Dateien, 4045 Tests bestanden, 0 rot.
- `… -- npm run typecheck`: ohne Fehler.
- `… -- npm run lint`: ohne Befund.
- `… --json -- npm run build`: Exit 0.

Kein Server, kein git.

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh`, alle vier Pakete der Welle gemeinsam im Arbeitsbaum, nach allen Eingriffen des Orchestrators): Typprüfung grün, Lint grün, Unit 4047 von 4047, Datenbanktests 171 von 171, Build 181 von 181 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 137 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Messung im Browser statt Rechnung (Produktions-Build, Skripte im Arbeitsordner der Sitzung): Für jedes sichtbare `<text>` einer Zeichnung die Schriftgröße auf dem Bildschirm (Schriftgröße × Maßstab der Zeichnung), die Lage im sichtbaren Ausschnitt und Überlappungen.
- Alle 138 Seiten (Sitemap und Fehlerseite) bei 360, 390, 640, 768, 1024, 1100, 1280 und 1440 px: 184 Zeichnungen mit Schrift, kleinste Schrift 14,0 px, kein Befund. Sechs Meldungen betreffen Titel und Legende des Profilschnitts, die auf dem Telefon seit jeher außerhalb des Ausschnitts liegen (kein halb abgeschnittener Text).
- Seiten mit Umschaltern (Reiter, Wahlknöpfe, anklickbare Pläne) bei 360, 640, 1024 und 1280 px: 566 Messungen, kein Befund.
- Schritte der Konfiguratoren und Formulare (Schließanlage, Sperrschließung, Zutritt, Gehäuse, Kleinstfahrzeuge, Partner, Einsenden, Vorlage, Autoschlüssel, Vor-Ort, Sicherheitscheck): alle Zeichnungen an den Upload-Feldern und in den Zusammenfassungen ab 14,1 px.

Zwei Stellen lagen unter 14 px; Rechnung und Gegenprüfung hatten sie nicht gesehen. Beide behoben und im Browser nachgemessen:
1. Zylinder-Konfigurator, Prüfliste „Ihre Zylinder“: Die breite Maßzeichnung stand bei 1024 px in drei Spalten von 192 px (Schrift 9,2 px), bei 1280 px mit 11,4 px. Jetzt steht dort immer die schmale Fassung (`ZylinderMassLive` mit `schmal`), drei Spalten erst ab 1280 px: 15,9 px bei 1024 px, 16,6 px bei 1280 px. Tests in `zylinder-mass-live.test.tsx`.
2. Schließanlagen-Konfigurator, vorgeschlagener Plan auf dem Telefon: Der Kasten hatte 8 px Innenabstand, die Zeichnung war 302 statt der angenommenen 318 px breit (13,4 px). Der Innenabstand links und rechts ist entfernt: 318 px, 14,1 px. `schliessplan.test.tsx` liest die Klasse aus der Seite.

Außerdem vom Orchestrator (offene Fragen 2 und 6): veraltete Kommentare in `page.tsx`, `schluessel-nach-code/[slug]/page.tsx` und `projekt-konfigurator.tsx` berichtigt; die tote Regel `.sm24-ausschnitt [data-legende]` aus `globals.css` entfernt; KERN (beide Fassungen) nennt jetzt „mindestens 14 px bei jeder Fensterbreite“; README der Zeichnungen angepasst.

Sichtprobe der Gestaltung (Bilder der Zeichnungen auf den Seiten bei 360, 1024 und 1280 px angesehen): Ablauf schmal und breit (breit in drei Reihen auf `/service-und-termin`), Schließpläne, Zylinder-Maß, Stiftzuhaltung auf der Fehlerseite und als Szene, Aufbau des Funkschlüssels, Tür-Schutz, Einsatzgebiet, Code-Fundstelle, Profilschnitt: keine Überlappung, nichts abgeschnitten, alles lesbar. Eng, aber sauber: die Kreise des breiten Ablaufs mit fünf Stationen und langen Wörtern, die untere Reihe des Generalhauptschlüsselplans mit acht Blättern.

Nicht gesehen: `/schluessel-nach-code/[slug]` (ohne echte Codelinien gibt es die Seite am Prüfserver nicht; die Lage im Ausschnitt deckt der Test, der den Ausschnitt aus der Seite liest) und der Schlüssel mit Lineal-Ziffern (steht auf keiner Seite).

Entschieden (A-068): eigene Schriftgröße je Zeichnung, Messung im Browser als Teil der Abnahme. Für Menschen (MA-57): Die Schrift wirkt auf großen Bildschirmen in einigen Zeichnungen kräftig; bitte ansehen. Kleiner Rest für die nächste Textrunde: Die Bildunterschrift der Maßzeichnung enthält einen Gedankenstrich („Schematisch – maßgeblich sind die gewählten Maße“).

=== ENDE FA-QA-04D · BEREIT ZUR RÜCKGABE ===
