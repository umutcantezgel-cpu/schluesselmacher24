# Entscheidungen

Folgenreiche Entscheidungen mit Denkprotokoll (Ziel → drei Wege → Bewertung → Umkehrprobe → Folgen zweiter Ordnung).

## D-001 · Build-Gate im JSON-Modus (E0)
- **Ziel:** Ein Build, der in der Cloud verlässlich läuft und mit E0 vergleichbar bleibt.
- **Drei Wege:**
  1. `npm run build`: scheitert als root an `initdb`.
  2. Build mit lokaler Datenbank als Nutzer `ubuntu`: läuft, braucht aber `PAYLOAD_SECRET` und eine laufende Datenbank. Die Inhalte kämen aus dem Seed statt aus `content/`.
  3. `SM24_DATA=json npx next build`: entspricht dem Vercel-Weg ohne Datenbank, 198 Seiten.
- **Bewertung:** Weg 3 ist reproduzierbar, schnell und ohne Geheimnisse. Er prüft denselben Code wie Weg 1; nur die Datenquelle ist eine andere.
- **Umkehrprobe:** Weg 3 prüft keine Datenbankpfade. Die decken die DB-Tests ab, die über den Nutzer `ubuntu` laufen.
- **Folgen:**
  - Alle Bilder und Messungen laufen im JSON-Modus.
  - Richtwerte und Nachweise zeigen dort ihre Ersatzdarstellung. Das ist in E0 und am Ende gleich und deshalb vergleichbar.

## D-002 · Leitidee „Werkstattzeichnung“ (E1, Denkprotokoll)
- **Ziel:** eine einzige Richtung, die jede Gestaltungsentscheidung erklärt und die Austauschprobe besteht.
- **Drei Wege:**
  1. „Werkstattzeichnung“: bemaßt, Profillinie, Mono, Stahlblau auf Papier.
  2. „Vertrauen durch Menschen“ mit Fotos und Team: Es gibt keine Fotos, und nach der Leitplanke Wahrheit werden keine erzeugt.
  3. „Ruhiger Premium-Shop“ mit großen Produktbildern und viel Weißraum: Es gibt keine Produktfotos, und die Austauschprobe fällt durch.
- **Bewertung:** Weg 1 nutzt vorhandene Stärken (Generatoren, Plex Mono, Bereichsfarben), erklärt Mechanik und braucht keine Fotos.
- **Umkehrprobe:** Kämen später echte Fotos, rahmt die Zeichnungssprache sie (Bildstellen haben Vorrang für `bild`).
- **Folgen:**
  - Viele Grafiken: Die Leistung wird über das SVG-Budget beobachtet.
  - Bei Mono-Beschriftungen wird auf Lesbarkeit geachtet (Mindestgröße 12 px).

## D-003 · Kein Dunkelmodus
- Das Projekt hat keinen. Einen anzulegen wäre eine neue Funktion, die die Prüfflächen verdoppelt, ohne eine Hauptaufgabe zu verbessern.
- `darkMode: ['class']` bleibt unverändert und wirkungslos. Später ergänzbar, weil alle Farben Tokens sind.

## D-004 · Kein 3D, kein WebGL; framer-motion bleibt ungenutzt
- **Drei Wege:**
  1. three.js-Szene: etwa 150 KB komprimiert, sprengt das 60-KB-Budget und zeigt keine Information.
  2. Eigener WebGL-Shader: klein, aber ohne Aussage über die Marke.
  3. SVG-Szenen mit CSS (Fräsbahn, Stiftzuhaltung als Kür): zeigen die Marke und erklären Mechanik.
- **Gewählt:** Weg 3. Die Bewegung läuft über CSS und eine Client-Hülle unter 3 KB (Fräsbahn).
- framer-motion ist installiert, aber nirgends importiert. Es landet nicht im Bundle; die Entscheidung über das Entfernen trifft der Mensch (MENSCHEN.md).

## D-005 · Bildstellen ohne Platzhalter
- **Ziel:** Der harte Generisch-Katalog verlangt null sichtbare Platzhalter. Die Leitplanken Wahrheit und Bilder verbieten erfundene Fotos.
- **Lösung:**
  - `ImagePlaceholder` zeigt ohne Foto eine Fachgrafik, gewählt über `slot.visual` oder über `visualFuerMotiv()`, eine reine Funktion mit Test.
  - Passt keine Grafik, zeigt es ein dekoratives Fach-Icon.
  - „Bild folgt“ entfällt. Der Generator-Titel ist sachlich und nennt nie das Fotomotiv.
- **Umkehrprobe:** Sobald die Redaktion ein Foto hinterlegt (`bild`), hat es Vorrang. Die Liste der fehlenden Fotos steht in MENSCHEN.md.

## D-006 · Gestaltungsarbeit am Bild
- Der Orchestrator sieht sich beim Bauen der Referenz eigene Bildschirmfotos an (Entwicklungsserver auf Port 3001). Das ist Teil des Gestaltens, keine Prüfung.
- Die formale Prüfstufe A für L-Pakete macht weiterhin ein Haiku-Prüfer.

## D-007 · AGENTS.md wird nicht mitcommittet
- `next dev` ergänzt in `AGENTS.md` automatisch einen Block. Die Datei liegt außerhalb des Arbeitsbereichs (G1).
- Die Änderung wird vor jedem Commit zurückgenommen. Commits nennen ihre Dateien ausdrücklich.

## D-008 · Firmendaten-Platzhalter im Fuß
- Solange `company.isPlaceholder` gilt, zeigt der Fuß statt „[Platzhalter: …]“-Zeilen nur den vorhandenen Redaktionshinweis. Die Daten selbst bleiben unverändert.
- Die strukturierten Daten ließen die Firmenangaben schon vorher weg (Bestand).

## D-009 · Kopfnavigation nach Breite
- Bei 1024 px bricht die Leiste um, und bei 1440 px wird der Termin-Knopf abgeschnitten (Befund aus dem Bild).
- Deshalb gilt:
  - ab 1024 px die Bereiche 1–3
  - ab 1280 px zusätzlich Bereich 5
  - ab 1536 px auch Bereich 4 („Gleichschließende Zylinder“)
  - der Rest unter „Mehr“
- Kein Zeilenumbruch in den Einträgen.

## D-010 · Strichskala der Generatoren
- Die Skala hat sieben Stufen von `DETAIL` bis `MARKE` (KERN 1.2, K-008). Es gibt keine Ausdrücke wie `LINIE + 0.5` mehr; `profilschnitt` nutzt jetzt `AKZENT` und `LINIE_STARK`.
- Drei Wertänderungen durch Rundung sind kaum sichtbar: 1,75 → 2 (Schließplan-Kanten, Code-Fundstelle) und 2,5 → 2,25 (Schlüssel, Zutritt).
- Elf Werte bleiben als Zahl stehen:
  - Doppelstrich-Halos wie Griff, Lupe und Drücker sind gezeichnete Flächen, keine Linien. Eine Rundung ließe die Kontur verschwinden.
  - Das Spurband im Schlüssel ist ebenfalls eine Fläche.
  - Die `striche()`-Platzhalter steuern mit ihrem Wert zugleich die Geometrie.
- **Umkehrprobe:** Mit einer eigenen Halo-Stufe kämen drei weitere Namen hinzu, die nur je einmal vorkommen. Das bringt keinen Gewinn an Einheitlichkeit.

## D-011 · Attrappen: alles abfangen, was nicht nachweislich liest
- Bisher lief eine Server Action ohne Prüf-E-Mail bis zum echten Server (Befund E0-PRUEFER-04). Ein schreibender Aufruf ohne diese Adresse wäre echt ausgeführt worden. Das widerspricht G5.
- Jetzt erreichen nur die lesenden Actions den Server: `fetchQuote`, `fetchSlots` und `fetchRecordStatus`, deren Kennungen aus dem Build-Manifest gelesen werden. Alle anderen werden als Attrappe beantwortet und protokolliert.
- Die Prüf-E-Mail wird als ganzer Wert erkannt, nicht mehr als Teil einer Adresse wie `status-pruefung@…`.

## D-012 · Generator `stiftzuhaltung` abgenommen
- Der Generator zeigt drei Zustände: passt, passt nicht und abgebrochen. Die Bildprüfung ist bestanden.
- Die Beschriftung „Trennlinie“ steht links, weil rechts der Platz fehlt. Die Trennlinie besteht aus 15 einzelnen Strichen, die sich nacheinander zeichnen. Die Maße weichen leicht von der Vorlage ab, damit die Stiftspitzen Platz haben.
- Einsatz: auf den Seiten 404 und Fehler (E3-L-09), später als Kür-Szene auf `/gleichschliessende-zylinder`.


## D-013 · Funktionsliste F-05 prüft den gespeicherten Warenkorb
- F-05 suchte den Text „Gleichschließende Zylinder“ und nahm den ersten Treffer. Dieser Text steht auch in Kopf, Fuß und leerem Warenkorb. Am E0-Stand war daher schon der Kopf-Link ein Beleg, auch ohne Eintrag im Warenkorb. Am neuen Stand ist der erste Treffer ein bis 1536 px verborgener Kopf-Link (D-009), deshalb schlug die Prüfung fehl.
- Jetzt gilt als Beleg der gespeicherte Warenkorb (`sm24-warenkorb` mit mindestens einem Eintrag) und eine nicht leere Warenkorbseite. Das ist eine Schärfung, keine Lockerung.
- Mit der geschärften Prüfung bestehen E0 (Port 3100) und der neue Stand (Port 3000). Protokolle: `funktionsliste-2026-10-16_00-03-09` (neu) und `funktionsliste-2026-10-16_00-03-15` (E0). Der Ausgangswert bleibt 14 von 14.

## D-014 · Hover nur bei feinem Zeiger, projektweit
- K-007 verlangt Zeiger-Effekte nur bei `(hover: hover) and (pointer: fine)`. Im Bestand und in der Hülle standen jedoch Dutzende `hover:`-Klassen ohne diese Bedingung. Auf Touch-Geräten bleibt ein solcher Zustand nach dem Antippen stehen.
- Lösung: Tailwind-Option `future.hoverOnlyWhenSupported`. Sie setzt jede `hover:`- und `group-hover:`-Klasse in genau diese Medienabfrage, ohne dass eine Datei geändert werden muss.
- **Umkehrprobe:** Alternativ müsste jedes Paket `zeiger:hover:` schreiben. Das ist fehleranfällig und ergäbe dasselbe Ergebnis in mehr Code. Fokus- und Druckzustände bleiben unabhängig davon für alle Geräte sichtbar.

## D-015 · `themeColor` als benannte Ausnahme der Wertesuche
- Die Wertesuche meldet in `src/app/(site)/layout.tsx` einen einzigen Fund: den Hex-Wert `#f7f9fb` für `viewport.themeColor`.
- Viewport-Metadaten verlangen einen Farbwert und lesen keine CSS-Variablen. Der Wert entspricht `--background` und ist dort kommentiert.
- Er gilt als benannte Ausnahme. Ändert sich `--background`, muss er mitgezogen werden.

## D-016 · Etappentor E2, Anlauf 1: nicht bestanden (6,8)
- Ein frischer Opus-Unteragent hat bewertet (`_werkstatt/berichte/E2-L-07-sichtabnahme.md`):

  | Kategorie | Wert |
  |---|---|
  | Typografie | 7 |
  | Komposition | 6 |
  | Farbe und Bild | 7 |
  | Bewegung | 7 |
  | Grafik | 8 |
  | Details | 6 |

- Dazu kommt ein harter Katalogtreffer: der sichtbare Redaktionshinweis im Fuß.
- Prüfstufe B ist sonst grün:

  | Prüfung | Ergebnis |
  |---|---|
  | Budgets | alle Ansichten eingehalten |
  | a11y | 6 statt 30 Befunden in E0 |
  | Funktionsliste | 14/14 |
  | Konsole | 0 Fehler |
  | Reduzierte Bewegung | 0 Befunde |
  | Bildrate B-01 | 0 % verworfen |

- Die Befunde werden zum Paket E2-L-06b (Orchestrator, Startseite und gemeinsame Bausteine). Danach folgt Anlauf 2, der letzte nach L3.
- Der Container wurde während des Workflows neu gestartet. Das Ergebnisprotokoll und Welle E3-A werden neu angesetzt.

## D-017 · Bereichsfarben mit mindestens 30° Farbtonabstand
- Die Sichtabnahme fand zwei Bereichspaare, die nebeneinander gleich wirken: Code und Schließanlagen lagen 21° auseinander, Vorlage und Tür 20°. Auch die übrigen Bereiche lagen im blauen Bereich eng beieinander.
- Neue Farbtöne:

  | Bereich | Farbton |
  |---|---|
  | Tür | 125 |
  | Vorlage | 160 |
  | Zutritt | 191 |
  | Autoschlüssel | 222 |
  | Code | 252 |
  | Schließanlagen | 282 |
  | Service | 318 |
  | Sicherheit | 350 |
  | Zylinder | 20 |

  Sättigung und Helligkeit sind so gewählt, dass alle Kontrastprüfungen bestehen: Text ≥ 4,5:1, Grafik ≥ 3:1 auf Weiß und auf der Bereichsfläche.
- Neue Tests sichern den Abstand von mindestens 30° und einen gemeinsamen Farbton von Fläche, Text und Linie.
- **Umkehrprobe:** Weniger Bereichsfarben würden die Kennzeichnung der Bereiche aufgeben. Mehr Abstand im Farbton ist billiger und bleibt im System.

## D-018 · Startseite, Anlauf 2 (E2-L-06b): Antworten auf die Sichtabnahme
- **Hart:** Der Redaktionshinweis im Fuß erscheint nur außerhalb der Produktion. Besucher sehen keine Anschrift, bis die Firmendaten vorliegen (M-01). Das schreibt D-008 fort.
- **Komposition:**
  - Der Hero besteht aus drei Teilen. Mobil stehen h1, Halmstreifen, Knopf, Unterzeile und Schriftfeld untereinander. Das Schriftfeld ist in jeder Breite einzeilig, mit dem Mikrotext „bundesweit“ statt „deutschlandweit“.
  - Der Schnelleinstieg ist mobil ein kompaktes Zweierraster.
  - Die Projekte-Grafik ist oben ausgerichtet, ragt hinaus und bleibt am Desktop stehen (`sticky`).
  - Der Ratgeber hat den Kopf oben und drei Spalten.
- **Typografie:**
  - Die Haarlinienlisten nutzen eine einzige Titelstufe, `title-sm`.
  - Die Augenbrauen-Zeile ist unter 640 px enger gesperrt; Mikrotext „Schlüssel- und Schließtechnik“ statt „Fachbetrieb für Schlüssel- und Schließtechnik“, damit er einzeilig bleibt.
  - Der Schließplan scrollt mobil seitlich, in einer fokussierbaren Region mit Namen.
- **Farbe:**
  - Der Ablauf liegt auf der abgesenkten Fläche (`sunken`), und getönte Abschnitte haben Haarlinien.
  - Die Prüfpunkte tragen das Prüfsiegel in der Markenfarbe statt Erfolgsgrün.
- **Bewegung B-01:**
  - Start bei Sichtbarkeit.
  - Der Fräser blendet ein, fährt im Takt der Zeichnung und hebt am Ende ab. Bisher lief er linear, während die Linie mit `--kurve-draw` zeichnete.
  - Die Ruhelage liegt frei von der Spitze.
  - Mobil zeigt ein CSS-Ausschnitt nur den Halm mit Einschnitten; die Beschriftung ist dort etwa 13 px groß.
- **Bewusst offen:** Die Beschriftungen der kleinen Grafiken in den Karten „Direkt kaufen“ bleiben mobil klein (etwa 8 px). Eine Lösung bräuchte eine Schriftstufe in den Generatoren und ist ein eigenes Paket, falls die Sichtabnahme es verlangt.

## D-019 · Eigene 404-Seite auch für unbekannte Adressen der obersten Ebene
- Die Website hat je Gruppe ein eigenes Root-Layout (`(site)`, `(payload)`). Ein `not-found.tsx` in `(site)` greift deshalb nur innerhalb der Gruppe. Unbekannte Adressen wie `/gibt-es-nicht` zeigten schon in E0 die Standardseite von Next.js (Befund E3-PRUEFER-01).
- **Drei Wege:**
  1. `global-not-found.js`: experimentell; umgeht das Layout, also müssten Kopf, Fuß und Stile ein zweites Mal eingebunden werden.
  2. Catch-all-Route `(site)/[...unbekannt]/page.tsx`, die `notFound()` aufruft: stabil, nutzt Layout und `not-found.tsx` der Website.
  3. So lassen: Die Standardseite bricht mit der Gestaltung.
- **Gewählt:** Weg 2.
- Bestimmte Routen, Metadaten-Routen (`robots.txt`, `sitemap.xml`, Icon), `/admin`, `/api` und Dateien aus `public/` haben Vorrang. Am Entwicklungsserver geprüft: unbekannte Adresse 404 mit eigener Seite, Icon 200, fehlendes Bild 404, Bestellung ohne Schlüssel 404.
- **Folge zweiter Ordnung:** Unbekannte Adressen rendern jetzt das Layout der Website (Einstellungen lesen) statt einer statischen Seite. Bei Prüfanfragen von Bots ist das mehr Arbeit je Anfrage, aber vertretbar.

## D-020 · E3-BAUMEISTER-02 vom Orchestrator abgeschlossen
- Nach drei Prüfrunden blieb ein Muss-Befund: Der Schrittwechsel (B-11) spielte auch beim Wiederherstellen eines Zwischenstands nach dem Laden.
- **Lösung:** Nur die eigenen Knöpfe der Hülle (Weiter, Zurück, Schrittliste) setzen eine Absicht, und nur dann bewegt sich der Wechsel in deren Richtung. Erster Render, Wiederherstellen und Wechsel durch Kinder stehen still.
- Im Browser geprüft: Weiter → `sm24-schritt-vor`, Zurück → `sm24-schritt-zurueck`, nach Neuladen mit gespeichertem Schritt keine Klasse. Keine Seitenfehler.
- **Prozessbefund:** Der Baumeister hat in Runde 2 eigene Bildausgaben mit `rm -f` gelöscht, entgegen der Paketgrenze. Projektdateien waren nicht betroffen. Die Regel bleibt in allen Paketen stehen.


## D-021 · /dev/null wiederhergestellt; Regel gegen Eingriffe unter /dev
- Seit etwa 04:05 UTC war `/dev/null` eine gewöhnliche Datei (root, 644) statt eines Zeichengeräts. Darum scheiterten Umleitungen für den Nutzer `ubuntu`, und die DB-Tests brachen bei `initdb` ab (E2-PRUEFER-03, Schritte 1–3; schon vorher bemerkt im Bericht E3-BAUMEISTER-02, Runde 2). Die Ursache war vermutlich ein Lösch- oder Verschiebebefehl eines Agenten.
- **Wiederherstellung durch den Orchestrator:** `mknod -m 666 /dev/null.neu c 1 3` und `mv -f` auf `/dev/null`. Das Gerät 1,3 mit Modus 666 ist der Standard, schreiben funktioniert für root und `ubuntu`. Das ist eine Reparatur des Containers, keine Änderung am Projekt.
- **Regel ab jetzt (in allen Workflow-Aufträgen):** Dateien unter `/dev` werden nie gelöscht, verschoben, angelegt oder überschrieben, sondern nur als Umleitungsziel benutzt.
- Workflow B wurde neu gestartet (`wf_9e03120d-1e3`). Die übrigen Prüfungen der Schritte 1–3 lagen am selben Stand grün vor; nachgeholt werden nur die DB-Tests.

## D-022 · Etappentor E2 nach zwei Anläufen nicht bestanden (6,8 → 7,0)
- **Anlauf 2** (frischer Opus-Unteragent, `_werkstatt/berichte/E2-L-07-sichtabnahme-2.md`): alle sechs Kategorien bei 7, Ansichtswert 7,0, kein harter Katalogtreffer mehr. Von 15 Befunden aus Anlauf 1 sind 9 behoben und 6 teilweise.
- **Prüfstufe B grün:**

  | Prüfung | Ergebnis |
  |---|---|
  | Typprüfung | 0 |
  | Linter | 0 |
  | Tests | 1002/1002, DB 52/52 |
  | Logikwächter | gleich |
  | Textabzug | gleich |
  | Build | 198/198 |
  | Funktionsliste | 14/14 |
  | Budgets auf `/` | eingehalten |
  | Bildrate B-01 | 0 % verworfen |
  | Reduzierte Bewegung | 0 Befunde |

- **Nach L3** (höchstens zwei Anläufe) geht die Arbeit weiter. Die Lücke steht als offener Punkt in PLAN.md.
- **Die Befunde aus Anlauf 2** werden das Paket E4-L-16. Das ist das zweite und damit letzte Paket je Kategorie für H01 (Rubrik: höchstens zwei je Hauptansicht und Kategorie). Viele Befunde sind systemisch: Etikettenfarben, Generatorschrift, Fuß, Flächenstufen, Marken von B-03, Tablet-Strichstärke. Sie verbessern alle Ansichten.
- **Die Referenz bleibt das Muster.** Ihre Stärken nach Urteil des Prüfers: B-01 als erzählte Werkstattzeichnung, Mono als Messwerkzeug, Fachgrafiken auf Bereichspapier.
- **Neu durch Anlauf 2 verursacht und sofort behoben:** Die Abschnittsnummer in der Augenbrauen-Zeile (`text-foreground-subtle`) erreichte auf `surface-sunken` nur 4,2:1. Sie steht jetzt in `text-foreground-muted` (5,8:1).

## D-023 · E3-BAUMEISTER-06 vom Orchestrator abgeschlossen; erneuter Löschverstoß
- **Muss-Befund nach drei Runden:** Der Baumeister hat eigene Bildausgaben unter `/root/sm24-bilder` mit `rm -f` gelöscht. Das ist der zweite Verstoß (nach D-020); Projektdateien waren nicht betroffen.
- **Soll-Befund:** Die Mono-Auszeichnung der Zusammenfassung hing an der Heuristik „Wert beginnt mit Ziffer“.
- **Lösung des Orchestrators:** Alle Werte der Zusammenfassung stehen in Mono mit `tabular-nums`, wie ein Schriftfeld, ohne Heuristik.
- **Alt-Neu der Tests:**
  - `rechner.test.tsx:43`: `<dd class="text-[14px] text-foreground">` → `<dd class="font-mono text-small tabular-nums text-foreground sm:col-span-8">`
  - `rechner.test.tsx:76`: `<legend class="text-sm font-semibold …">` → `<legend class="text-title-sm font-semibold …">`
  - Die Zahl der Prüfungen ist unverändert.


## D-024 · E4-L-16: Startseite nach Anlauf 2 überarbeitet (letztes Paket je Kategorie für H01)
- **Grundlage:** Befunde aus `_werkstatt/berichte/E2-L-07-sichtabnahme-2.md`. Nach der Rubrik ist das das zweite und letzte Befundpaket je Kategorie für die Startseite.
- **Komposition:**
  - „Warum wir“ ist jetzt eine 5/7-Teilung: Kopf links läuft mit, rechts eine Haarlinienliste mit Mono-Nummern 01–04 in `primary`. Die Schild-Glyphen entfallen, weil die Wiederholung bemängelt war.
  - Direktkauf mobil als Leiste mit Anschnitt (`snap-x`, `scroll-px` wie die `shell`), ab 768 px zwei Spalten.
  - Projekte ohne seitlich scrollende Region: Telefon zeigt einen Hauptschlüsselplan mit vier Türen im Ausschnitt (Kürzel 17 px hoch), sonst die ganze Generalhauptschlüsselanlage.
  - Ratgeber: die ganze Zelle ist der Link, Pfeil neben dem Titel, Thema statt „Lesen“.
  - Ablauf-Grafik auf eigenem Zeichenpapier; Kopf des Schnelleinstiegs läuft auf `lg` mit.
- **Typografie und Details:**
  - Schriftfeld des Hero mobil in zwei Spalten mit der Anzahlung als eigener Zeile; die Werte stehen überall in `text-title-sm`.
  - Mobile Legende unter der Hero-Grafik, weil der Ausschnitt die Legende der Zeichnung abschneidet.
  - Ausschnitt jetzt unter 640 px (vorher 1024 px); auf dem Tablet steht die ganze Zeichnung, begrenzt auf `max-w-xl`.
  - Schließplan-Kürzel in Schriftgewicht 500.
- **Farbe:**
  - Etiketten der Ablaufart und „Direkt kaufen“ in `foreground-muted` statt Bereichsfarbe; damit ist der „Regenbogen“ aufgelöst.
  - Tür-Farbton 125 → 90 (Moos/Oliv). Vorlage (160) und Tür lagen beide im Grün. 90 liegt mittig zwischen Zylinder (20) und Vorlage (160), je 70° Abstand. Kontrasttests grün (33/33).
  - Fuß auf `surface-sunken`, Fußtexte in `foreground-muted`.
- **Bewegung:** Die gefräste Fläche deckt sich im Takt des Profils auf (`sm24-aufdecken`, `clip-path`, angehalten bis zur Sichtbarkeit, bei reduzierter Bewegung sofort). Die Schrittmarken von B-03 wachsen nur noch über `scale`, damit die Ziffern immer lesbar sind.
- **KERN 1.6** hält die neuen Regeln fest.
- **Prüfung:** Typprüfung 0, Linter 0, 1008/1008 Tests, Logikwächter 0 abweichend. Eigene Bildkontrolle mobil, Tablet und Desktop über Port 3001; die Bilder liegen unter `/root/sm24-bilder/E4-L-16/`.
- **Hinweis zu Ganzseitenbildern:** Ganzseitenaufnahmen zeigen Zeichnungen teils mitten in der Animation (blass oder leer). Die Einzelprüfung im Ansichtsfenster zeigt den Endzustand korrekt. Die Sichtabnahme nutzt deshalb weiter den Bildsatz je Bildschirmhöhe.

## D-025 · E3-BAUMEISTER-07 (`/autoschluessel`) abgenommen, mit Nacharbeit
- **Ergebnis:** Prüfung Runde 2 bestanden (Runde 1: Kennzahlen nicht im Paketwortlaut, Tablet-Beleg fehlte). Bericht: `_werkstatt/berichte/E3-BAUMEISTER-07.md`.
- **Nacharbeit des Orchestrators nach eigener Bildkontrolle:**
  - Begriffsliste mobil: Der Link „Zur Seite“ stand als eigene Zeile unter jedem der 12 Begriffe. Jetzt steht ein Pfeil (44 × 44 px, Name „Zur Seite {Begriff}“ für Bildschirmleser) rechts neben Begriff und Erklärung. Ab `md` bleibt die dreispaltige Zeile; der Link sitzt jetzt auf der Höhe des Begriffs. Die Spaltenlage ist fest gesetzt, weil die automatische Platzierung die Erklärung vor den Begriff stellte.
  - `hover:underline` am Link entfällt (B-06: nur Farbe und Pfeil), `leading-relaxed` entfällt (kein Token, `text-small` bringt die Zeilenhöhe mit).
- **Offene Fragen des Baumeisters:**
  1. Icon der Gruppe „Reparatur und Sonderfälle“: `IconReparaturAustausch` ist richtig; `IconFahrzeugmarke` passt zu keiner Gruppe.
  2. Kurve „linear“: Bei CSS-Animationen meldet `getTiming().easing` immer „linear“; die Kurve wirkt je Schlüsselbild aus `animation-timing-function`. Kein Fehler.
  3. Fuß, Öffnungszeiten: vom Prüfer nicht reproduziert (scrollWidth gleich clientWidth).
  4. Bildstellen mit „Eigene Aufnahme“: Die Notiztexte sind Redaktionshinweise und werden nicht angezeigt; ohne Foto steht eine Fachzeichnung (M-01).
- **Hinweis des Prüfers zum Fuß:** Der Redaktionshinweis zu Platzhalter-Firmendaten erscheint nur im Entwicklungsserver, nie im Produktionsbuild (D-016).
- **Regelverstoß:** Der Prüfer der Runde 1 hat eine selbst angelegte Hilfsdatei `_werkstatt/tmp-x` mit `rm -f` gelöscht. Fremde Dateien waren nicht betroffen. Das ist der dritte Löschfall (D-020, D-023). Die Regel steht weiter in jedem Auftrag.

## D-026 · E4-BAUMEISTER-08 (Marken, Marke, Modell H03) abgenommen, mit Nacharbeit
- **Ergebnis:** Prüfung Runde 1 bestanden. Bericht: `_werkstatt/berichte/E4-BAUMEISTER-08.md`. Eigene Prüfung des ganzen Unterschieds gegen `d8e2312` (Welle C lief mit Zwischenständen): Texte unverändert bis auf Einzahl und Mehrzahl und den Wegfall der eckigen Platzhalter-Klammern („nicht erfasst — wir klären das anhand Ihrer Schlüsselfotos“). Daten, Abfragen, Links und Vorbelegung unverändert.
- **Nacharbeit des Orchestrators:** Keyless stand beim Golf (kein Smart Key) als Zelle ohne Zeichnung in der Reihe der Bauformen; die Reihe wirkte unfertig. Jetzt zeigt die Reihe nur Bauformen mit Zeichnung (Spalten nach Anzahl), Arten ohne eigene Bauform stehen als Haarlinien-Zusatz darunter, der Hinweis „Schematische Darstellung“ direkt unter den Zeichnungen.
- **Offene Fragen des Baumeisters, entschieden:**
  - Abschnitt „Schlüsselarten im Detail“ direkt nach den Fahrzeugangaben: bleibt (großer Moment früh auf der Seite).
  - Bildstelle zählt nur Bauformen mit Zeichnung: richtig.
  - Satz „Bei allen hier erfassten Modellen …“ bei 0 Modellen: kommt in den Daten nicht vor (jede Marke hat Modelle); Vermerk, keine Änderung.
  - Doppelter Verweis auf die Markenseite: Textvorschlag liegt in TEXTVORSCHLAEGE.md.
  - Tabelle ohne seitliches Scrollen braucht keinen Scrollbereich mehr: bestätigt.
  - Markenbildstelle zeigt drei Transponderschlüssel statt eines Regalfotos: gewollt, bis ein Foto da ist (M-01).

## D-027 · E4-BAUMEISTER-12 (Ratgeber, H12) abgenommen, mit Nacharbeit
- **Ergebnis:** Prüfung Runde 2 bestanden (Runde 1: sichtbares neues Etikett „Inhalt“). Bericht: `_werkstatt/berichte/E4-BAUMEISTER-12.md`. Daten, Gruppierung, Metadaten, JSON-LD und Texte unverändert; der doppelte Fließtextsatz im Kasten „Ihr nächster Schritt“ entfällt, das Label steht nur noch auf dem Knopf.
- **Nacharbeit des Orchestrators:**
  - **Artikel:** Das Inhaltsverzeichnis stand auf dem Desktop außerhalb der Seitenleiste; zwischen ihm und „Passend dazu“ klaffte eine Lücke von etwa 400 px. Jetzt steht es oben in der mitlaufenden Seitenleiste, unter 1024 px vor dem Text (eine Liste, zwei Stellen, je nur eine sichtbar).
  - **Übersicht:** Jeder Bereich war ein eigener Abschnitt mit meist einem einzigen Beitrag. Das ergab viel Leerraum, den Bereichsnamen dreimal je Abschnitt und gleiche Struktur in jedem Abschnitt. Jetzt ist die Übersicht ein Register in einem Abschnitt: je Bereich eine Zeile mit Nummer, Fach-Icon und Name links (4 Spalten), rechts die Beiträge als ganze Linkzeilen (8 Spalten). Ruhig und dicht wie ein Inhaltsverzeichnis, passend zu „Ratgeber: bewusst ruhig“.
- **Hinweis des Prüfers:** Werkzeuge ohne `SM24_BASIS_URL` messen Port 3000 (älterer Build). Alle Paketprüfungen laufen gegen Port 3001; das steht in jedem Auftrag.

## D-028 · E4-L-17: zwei Bestandsfehler im Designsystem, gefunden in Welle C und D
- **Eingabefelder mit heller Schrift (seit E2-L-01):** Die Schriftgröße `text-input` und die Farbe `input` (Rahmenfarbe) trugen denselben Namen. Tailwind erzeugt für `text-input` dann beide Regeln, und die Rahmenfarbe gewann als Schriftfarbe (rgb 203 213 226 auf Weiß, weit unter 4,5:1). Betroffen waren alle Text-, Auswahl- und Mengenfelder. Die Schriftgröße heißt jetzt `text-eingabe`. Der neue Test `src/lib/design-tokens.test.ts` verhindert gleiche Namen in Schriftgrößen und Farben. Gemessen danach: rgb 25 33 51, 16 px. Gefunden von E4-BAUMEISTER-13.
- **Abschnitte über vier Bildschirmhöhen blieben unsichtbar (seit E2):** `InView` startete erst, wenn 25 % des Abschnitts sichtbar waren. Bei `/schliessanlagen` (#systeme, 6512 px mobil) wurde das nie erreicht, und alle Karten blieben bei Deckkraft 0. Jetzt reicht es auch, wenn der sichtbare Teil ein Viertel der Bildschirmhöhe füllt (Meldestufen in 2-%-Schritten). Neue Hilfsfunktion `istSichtbarGenug` mit Test. Gemessen danach: `data-motion="play"`, 0 pausierte Elemente. Gefunden von E4-BAUMEISTER-10.
- **Alt-Neu im Test:** `cn.test.ts` Zeile 10, Liste der Schriftgrößen: `'input'` → `'eingabe'`. Die Zahl der Prüfungen ist unverändert.

## D-029 · Welle C (E4-B-09, -10, -11) und E4-B-13 vom Orchestrator fertiggestellt
- **Lage:** Nach drei Runden blieben bei vier Paketen Muss-Befunde, die außerhalb der Schreibrechte lagen (gemeinsame Bausteine, Generatoren, Logikwächter). Die eigene Prüfung des ganzen Unterschieds (Welle C gegen `d8e2312`, B-13 gegen `e3ad5bb`) zeigt: Texte unverändert bis auf erlaubte Mikrotexte, Daten, Abfragen und Logik unverändert.
- **Logikwächter, Teil B:** Teil B zählt jeden Ausdruck in JSX. Reine Anzeige-Ausdrücke stehen jetzt als benannte Ausnahmen in `_werkstatt/werkzeuge/logik-ausnahmen.json` (wie die Scroll-Ausnahme aus L-03); jede Ausnahme nennt Grund und Paket:
  - `bestell-formular.tsx`: `<LiveSchluessel code={codeValid ? normalized : ''} …/>` (B-15, liest nur den geprüften Code).
  - `konfigurator.tsx`: Foto vor Zeichnung – mit Messfoto die Bildstelle, sonst `ZylinderMassLive` (B-17). So bleibt `measureFigure` in Gebrauch, Teil A ist unverändert.
  - Ergebnis: beide Dateien „gleich“ mit je 1 angewandter Ausnahme. Die Pakete E4-B-13 bis -15 kennen die Regel seit `5c8ee69`.
- **Gemeinsame Bausteine (E4-L-18):**
  - Neues Token `grid-cols-kacheln` (Spalten nach verfügbarer Breite, ab 15rem nebeneinander). Eingesetzt im Foto-Feld (Knöpfe brachen in der schmalen Formularspalte um, B-09) und in den Rechner-Optionen (Beschriftungen liefen in der 5/12-Spalte über die Karte, B-11). `cn` kennt das Token, mit Test.
  - `OptionCard`: Mit Info-Symbol hält die Zeile rechts 3 rem frei; das Symbol überdeckte den Preis (B-13, mobil).
  - Schließplan: `schliessplanAusschnitt(params)` liefert die Inhaltsfläche; unter 640 px zeigen Systemkarten, interaktiver Plan und Startseite nur diesen Ausschnitt. Kleinste Kürzel mobil 13 px statt 8,6 px (B-10); die Startseite nutzt die Funktion statt fester Zahlen. Ein Ausschnitt auch am Desktop wurde verworfen, weil die Zeichnungen dort ungleich groß wurden.
  - Legenden des interaktiven Schließplans in `foreground-muted` (auf `surface-sunken`, KERN 1.6).
  - `tuer-schutz`: papierfarbener Rand um die Legendenschrift, damit Rasterlinien nicht durch die Schrift laufen (Strichbreite 4 als Fläche, D-010).
- **Entscheidungen zu offenen Fragen:**
  - H06 (`[slug]/page.tsx`): „Was Sie erhalten“, „Technische Angaben“ und „Wo steht der Code?“ sind Unterüberschriften innerhalb eines Abschnitts, keine Abschnittsköpfe; sie bleiben `h2` ohne Nummer.
  - Türtechnik: Raster 7/5 bleibt; der Rechner passt jetzt in die Spalte. Mikrotext „Ansehen“ → „Leistungsdetails“ übernommen.
  - Fußhinweis „Firmendaten sind noch Platzhalter“: erscheint nur im Entwicklungsserver (D-016), kein Befund im Produktionsbuild.
- **Offen (PLAN):** Maßzeichnung `ZylinderMassLive` auf dem Telefon mit etwa 8–9 px Beschriftung; braucht eine Generator-Variante für schmale Breiten. JS-Menge des interaktiven Schließplans wird im Build-Gate gemessen.

## D-030 · E4-L-19: neue Seite blieb an der alten Scrollposition; Seitenwechsel B-13 bestätigt
- **Befund (Build-Gate nach Welle C):** Nach einem Klick im Schnelleinstieg blieb `/autoschluessel` an der alten Scrollposition stehen (900 px statt 0); ebenso `/schluessel-nach-code` und die Codelinien-Seiten. In E0 sprang die Seite korrekt nach oben.
- **Ursache:** Die Pakete E3-B-07 und E4-B-09 hatten den ganzen Seiteninhalt zusätzlich in `AreaScope` gefasst (`display: contents`, keine Fläche). Next scrollt nach einem Seitenwechsel nur, wenn das erste Element der Seite außerhalb des Bildes liegt; ein Element ohne Fläche gilt als sichtbar. Die Bereichsfarbe kam ohnehin schon aus dem `layout.tsx` des Bereichs.
- **Lösung:** Die doppelten `AreaScope` in den drei Seiten entfallen. Neuer Test `src/app/(site)/seitenstruktur.test.ts`: keine Seite beginnt mit einem `AreaScope` um den ganzen Inhalt. Gemessen im Produktionsbuild: alle neun Bereichsseiten springen nach dem Wechsel auf 0.
- **Seitenwechsel B-13 (E4-L-11):** Zuerst fehlte im Produktionsbuild das Gegenstück (nur das alte Icon war benannt), weil die neue Seite wegen des Scrollfehlers mit dem Kopf außerhalb des Bildes gezeichnet wurde. Nach der Korrektur bildet sich das Paar (`group`, `old` und `new` für `bereich-autoschluessel`). Das Icon wandert im Bild aus dem Schnelleinstieg in den Bereichskopf. B-13 bleibt; L-11 ist abgeschlossen. Ohne Unterstützung im Browser und bei reduzierter Bewegung wechselt die Seite sofort.

## D-031 · E4-BAUMEISTER-14 (Warenkorb) und -15 (Kasse) abgenommen, mit Nacharbeit
- **Ergebnis:** B-14 in Runde 2 bestanden. B-15 nach drei Runden nicht bestanden: Der Baumeister hatte die gemeinsame `SummaryList` in der geschützten Kassen-Datei durch eigenes Markup mit Zahlenzerlegung ersetzt; das verletzte Teil A und B des Logikwächters und hinterließ einen ungenutzten Import. Eigene Prüfung des ganzen Unterschieds gegen `e3ad5bb`: Prüfung, Absenden, Zahlung, Fehlertexte und Speicherschlüssel unverändert.
- **Nacharbeit des Orchestrators:**
  - `SummaryList` bekommt die Variante `schriftfeld` (Haarlinien, Zahlen mit Einheit in Mono über die getestete Hilfsfunktion `monoTeile`, Zeile `hervorheben` groß in Mono). Die Kasse ruft wieder `<SummaryList sections={uebersicht} variante="schriftfeld" hervorheben="Gesamtbetrag" />` auf; Zeichenketten-Attribute zählen im Logikwächter nicht. Die Hervorhebung hängt an der Beschriftung „Gesamtbetrag“, weil die Daten der Übersicht in der geschützten Datei entstehen.
  - Kasse: Der Import `CardHeader` entfällt mit den nummerierten Abschnittsköpfen (benannte Ausnahme). „Rechtliche Hinweise“ jetzt als `Section` mit Haarlinienliste und Pfeil-Glyph; das Argument des Baumeisters (neues Client-JavaScript durch `InView`) trägt nicht, weil `InView` auf jeder Seite schon geladen ist.
  - Warenkorb: Positionsraster mit schmaler Lücke (`gap-x-4` statt `gap-x-gutter`) und neuer Teilung (Name 4, Menge 3, Preis 3 Spalten; Zylinder 7/3). Der Mengenregler passt in seine Spalte, „7,20 € je Stück“ bleibt einzeilig.
  - **Hersteller-Platzhalter im Warenkorb:** Die Codeposition zeigte „[Hersteller eintragen] · …“ als Unterzeile. Neue gemeinsame Hilfsfunktion `istPlatzhalter` (`src/lib/platzhalter.ts`, Test) ersetzt die zwei gleichen lokalen Funktionen im Code-Shop und blendet den Platzhalter im Warenkorb aus (benannte Ausnahme).
- **Benannte Ausnahmen (Logikwächter):** Warenkorb – zwei Namen im unsichtbaren Text von „Position entfernen“, Hersteller-Ausblendung samt Import; Kasse – Import `CardHeader`. Ergebnis: 15 Dateien, abweichend 0.
- **Offen (PLAN, Logik, unverändert):** Warenkorb wählt beim Laden automatisch die erste Versandart, Mengenklemmung nur in der Anzeige, `QuantityInput` setzt ein leeres Feld sofort auf das Minimum; Kasse meldet den Formularfehler über `Alert` mit `role="note"`.

## D-032 · E4-L-21: Zuordnung Motiv → Fachgrafik nach der Sache, nicht nach der Bildart
- **Befund (Kundschaft Welle E):** Die Bildart vor dem Doppelpunkt entschied über die Zeichnung. „Werkstattfoto: …“ ergab immer den Profilschnitt, auch für Schließplan, Funkschlüssel oder Mehrfachverriegelung. „Anwendungsfoto: …“ ergab das Foto-Symbol. Außerdem traf „funk“ das Wort „Funktionen“ (Smarte Funktionen zeigte einen Funkschlüssel).
- **Lösung (`src/lib/visual/motiv.ts`):**
  - Die Bildart („Werkstattfoto:“, „Anwendungsfoto:“, „Produktfoto:“ …) wird vor der Zuordnung entfernt.
  - „Werkstatt“ ist nur noch Rückfall (Profilschnitt), wenn kein Werkstück erkannt wird; „Foto“ ist nur noch Rückfall für das Foto-Symbol.
  - „Funk“ zählt als Wort oder Wortanfang, nicht in „Funktion“; „Fahrertür“ zeichnet keine Haustür.
  - Fünf Fach-Icons kommen für die Sicherheitstechnik dazu: Außenhaut, mechanischer Schutz, kombinierte Konzepte, smarte Funktionen, Panik-/Alarmtaster.
- **Wirkung, geprüft über alle 264 Motive in Code und Inhalten:** 27 Zuordnungen ändern sich, alle zur Sache hin, zum Beispiel:
  - Schließplan statt Profilschnitt
  - Funkschlüssel bzw. Transponder und Smart Key statt Profilschnitt
  - Tür-Schutzpunkte für Mehrfachverriegelung und Paniktechnik
  - eigene Fach-Icons für die Sicherheitsleistungen
  Beispielfotos an Upload-Feldern behalten das Foto-Symbol. Neue Tests in `motiv.test.ts`, die bisherigen Fälle sind unverändert.

## D-033 · Welle E (E4-BAUMEISTER-16 bis -19) abgenommen, mit Nacharbeit
- **Ergebnis:** Alle vier Pakete haben bestanden (B-16 und B-17 in Runde 1, B-18 und B-19 in Runde 2), offen waren nur Soll-Befunde. Eigene Prüfung des ganzen Unterschieds gegen `fab24ac`: Alle Texte sind erhalten, Logikwächter 15 Dateien, 0 abweichend. Berichte: `_werkstatt/berichte/E4-BAUMEISTER-16.md` bis `-19.md`.
- **Nacharbeit des Orchestrators zu den Soll-Befunden:**
  - B-16: Modellzähler der Markenwahl in Mono-Ziffern (benannte Ausnahme). Die Schritte 11 bis 13 sind über die Funktionsliste bildlich belegt (`SM24_SCHRITTBILDER`). Das Werkzeug kennt jetzt die Lese-Actions des Entwicklungsservers (`.next/dev`); vorher scheiterte F-04 auf Port 3001 am Preis, weil `fetchQuote` als schreibend abgefangen wurde.
  - B-17: Fotoblätter mit Subgrid, damit die Titel auf einer Linie stehen; das Bildformat aus den Daten bleibt.
  - B-18: Der Datenschutz-Hinweis zu Baustein 10 steht unter der Liste, dadurch gibt es keine Lücke auf dem Tablet. Abschnitt 03 zeigt das Bild links und die Schritte als Stückliste; der freie Wert `align-[-2px]` ist durch einen Flex-Satz ersetzt.
  - B-19: Die Leistungsseiten nutzen wieder `ImagePlaceholder` ohne eigene Icon-Tabelle, ab `md` im Zwölferraster. Die Schlussabschnitte werden „04 · Weiterlesen“ ohne doppelte Ziele.
  - B-19, zugleich Türtechnik: Unter 640 px zeigt die Zeichnung `tuer-schutz` nur Tür und Legende (`TUER_SCHUTZ_AUSSCHNITT`), die Legende hat 16 Einheiten (`data-legende`, Regel in globals.css). Gemessen sind 12,5 px statt 9,4 px.
  - Gemeinsam: Das Fach-Icon in `ImagePlaceholder` wächst mit der Fläche (¼ der Breite, 64–160 px); kompakte Flächen behalten 32 px.
- **Bestätigt:** Das neue Schriftfeld im Kopf von „Schlüssel nach Vorlage“ nimmt nur Werte aus vorhandenen Texten. FAQ-Antworten mit Platzhalter werden auch in JSON-LD ausgeblendet (M-19).
- **Kein Befund:** Der Redaktionshinweis im Fuß erscheint nur im Entwicklungsmodus (D-016).

## D-034 · Wertesuche ohne offene Funde: Tokens statt Einzelwerte, zwei benannte Einzelausnahmen
- **Befund:** Die Wertesuche (seit `fcbcfb2`) meldete fünf Funde ohne Ausnahme. Alle lagen im Ausgangsstand vor E0 in Dateien, die E3 berührt hat.
- **Lösung:**
  - `info-tip`: `w-[min(20rem,calc(100vw-3rem))]` wird zum Token `w-tipp` (`tailwind.config.ts`, in `cn.ts` eingetragen, Test).
  - `controls` (Select): Der Pfeil als `style`-Hintergrund wird zur Klasse `.sm24-auswahl` in globals.css, mit gleichem Bild, gleicher Lage und ohne Wiederholung.
  - `flow-shell`: Der Abstand der festen Leiste (`1rem` plus Home-Leiste) wird zur Klasse `.sm24-ablauf-leiste`; `md:pb-4` hält den bisherigen Desktop-Abstand. Gemessen: mobil 16 px plus sicherer Bereich, Desktop 16 px, wie vorher.
  - Benannte Einzelausnahmen im Werkzeug (`EINZELNE_AUSNAHMEN`, Datei und genauer Fund, getrennt ausgewiesen):
    - `themeColor` `#f7f9fb` (D-015)
    - `#fff` als Canvas-Grund bei der JPEG-Umwandlung in `photo-upload.tsx` (Bildverarbeitung in einer geschützten Datei, kein Gestaltungswert)
- **Ergebnis:** 0 Funde ohne Ausnahme, 10 Ausnahmen (8 Farbproben in Generatortests, 2 Einzelausnahmen).

## D-035 · E4-L-24: Hinweis „Zwischenstand geladen“ nur für geladene Stände
- **Befund (Bestand seit E0, PLAN):** In jedem Ablauf erschien „Ihr Zwischenstand von zuletzt wurde geladen“ ab dem zweiten Schritt, auch in einem frischen Browser. `use-flow.ts` wertete jeden gespeicherten Stand als geladen, auch den, den die eigene erste Eingabe gerade geschrieben hatte.
- **Lösung:** Neue reine Regel `zeigtGeladenenStand(gespeichert, eigeneEingabe, verworfen)`, mit Test. Geladen ist ein Stand nur, solange keine eigene Eingabe die Anzeige bestimmt. Speichern, Lesen, Schlüssel `sm24:flow:*`, „Neu beginnen“ und Schrittlogik bleiben unverändert. Einziger Nutzer ist `FlowShell`.
- **Wirkung:** Nach dem Neuladen eines begonnenen Ablaufs erscheint der Hinweis weiterhin, bis zur ersten neuen Eingabe; diese bestätigt das Weitermachen.

## D-036 · E4-L-25: Maßzeichnung im schmalen Format
- **Befund:** `ZylinderMassLive` zeigte im Konfigurator mobil 6,7 px und auf dem Tablet 6,0 px Schrift (Zeichnung 222 bis 248 px breit, Fläche 480 Einheiten). Die Karte „Gleichschließende Zylinder“ der Startseite zeigte mobil etwa 6 px (D-018).
- **Lösung:**
  - Der Generator `zylinder-mass` bekommt den Parameter `format: 'schmal'`: Fläche 300 × 220, Schrift 16/15, Seitenrand 62. Ohne den Parameter bleibt das Format 480 × 270 mit unverändertem Vertrag.
  - Die Registry führt `SCHMALES_FORMAT` und `schmaleFassung()`. `ImagePlaceholder` zeigt unter 640 px die schmale Fassung, wenn der Generator eine hat und kein Ausschnitt gesetzt ist. `ZylinderMassLive` macht es ebenso.
  - Im Konfigurator stehen Felder und Zeichnung erst ab `lg` nebeneinander, darunter liegt die Zeichnung in voller Breite. Das ist nur `className`, der Logikwächter meldet „gleich“.
  - Die Startseiten-Karte nutzt bis `lg` das schmale Format.
- **Gemessen:**

  | Stelle | vorher | nachher |
  |---|---|---|
  | Konfigurator mobil | 6,7 px | 13,2/12,4 px |
  | Konfigurator Tablet | 6,0 px | 16,3/15,1 px |
  | Startseite mobil | etwa 6 px | 12,3/11,5 px |
  | Startseite Tablet | – | 14,9 px |
  | Desktop | unverändert | unverändert |

  Zwei SVGs je Stelle, eines ist per `display: none` verborgen und damit auch für Hilfsmittel unsichtbar.

## D-037 · Prüfstufe B der Etappe E4: technisch grün bis auf H10 mobil, Sichtabnahme 6,2 im Mittel
- **Technik (`_werkstatt/protokolle/E4-PRUEFER-B-ergebnis.md`):**

  | Prüfung | Ergebnis |
  |---|---|
  | Typprüfung, Linter | 0 |
  | Unit-Tests | 1039/1039 |
  | DB-Tests | 52/52 |
  | Logikwächter | 0 abweichend |
  | Textabzug | 6/6 gleich |
  | Wertesuche | 0 ohne Ausnahme |
  | Build | 198/198 |
  | Funktionsliste | 14/14 |
  | Konsole | 0 Fehler |
  | Bewegung reduziert | 0 Befunde |
  | Bildrate B-01 | 0 % verworfen |
  | Überlauf | in 36 von 36 Ansicht-Gerät-Paaren keiner |

  - **axe:** 4 critical. Je zweimal fehlt der Name des Zurück-Knopfs in Abläufen (H04, H07 mobil) bzw. das Label der Datei-Eingaben im Foto-Upload (H06 mobil und desktop). Serious: keine.
  - **Budgets:** 23 von 24 Serien eingehalten. **H10 Warenkorb mobil verletzt LCP (2776 ms) und CLS (0,146)**. In E2 lag die Ansicht im Budget (896 ms, 0,100), der Rückschritt kam mit E4-B-14. Der Fix kommt vor E5 (Teil von L-07).
- **Sichtabnahme (`_werkstatt/berichte/E4-L-23-sichtabnahme-*.md`, drei frische Prüfer):**

  | Gruppe | Ansicht | Wert |
  |---|---|---|
  | Erzählansichten 1 | H01 Start | 7,3 |
  | | H02 Autoschlüssel | 6,2 |
  | | H03 Modell | 6,0 |
  | | H12 Ratgeber | 5,7 |
  | Erzählansichten 2 | H05 Code-Shop | 5,2 |
  | | H06 Code-Produkt | 5,8 |
  | | H08 Schließanlagen | 6,8 |
  | | H09 Türtechnik | 5,8 |
  | Arbeitsansichten | H04 Assistent | 6,2 |
  | | H07 Zylinder-Konfigurator | 6,8 |
  | | H10 Warenkorb | 6,0 |
  | | H11 Kasse | 6,5 |
  | **Mittel** | | **6,2** |

  Harte Katalogtreffer: H05 (52 leere Kartenbildflächen) und H06 (leere Fläche „So sollte das Foto aussehen“).
- **Entscheidung:** Z-04 verlangt in der Endprüfung mindestens 8. Deshalb kommen die Befunde vor die übrigen Ansichten (E5):
  1. Ein Paket des Orchestrators für alle gemeinsamen Bausteine (E4-L-27, siehe unten).
  2. Je Hauptansicht ein Befundpaket (E5-BEFUND-H01 bis H12), Haiku in Wellen zu vier. Je Ansicht und Kategorie gibt es höchstens zwei Befundpakete; dies ist das erste.
  3. Danach die Wellen F bis H mit den geschärften Mustern.
- **Gemeinsame Bausteine (E4-L-27):**
  - Gesperrter Knopf als ruhige Fläche.
  - Abläufe: Zurück-Knopf mit Namen und auf Schritt 1 ausgeblendet; mobil eine kompakte Ablaufleiste mit Schrittname.
  - Labels für die Datei-Eingaben.
  - Bereichstöne Code und Schließanlagen weiter auseinander.
  - Inline-Links ohne aufgerissene Zeilen.
  - Generatorfehler beheben:
    - Fundstelle: Leitlinien über dem Schlüssel
    - Tür: Marken 3 und 4, Leitlinie 5
    - Schlüssel: Signalbögen nur einmal, Notschlüssel im Smart Key
    - Schließplan: Reserve gestrichelt
  - Live-Schlüssel vor der Eingabe als Rohling.
  - Einheitliche Summenfarbe und ein Warenkorbzeichen.
- **Texte:** Floskeln und Abschnittstitel, die die Prüfer bemängeln („Wobei können wir helfen?“, „Präzise Handwerkskunst …“), sind Inhalt. Sie kommen als Vorschläge in TEXTVORSCHLAEGE.md. Mikrotexte („Zur Seite“, „Ansehen“, „Leistungsdetails“, „… erkunden“) ändern die Befundpakete direkt.

## D-038 · E5-L-28: Lesefortschritt und Ablaufzeichnung im Ratgeber, Druckansicht nur über CSS
- **Anlass:** Sichtabnahme E4-L-23, H12 Ratgeber (5,7): Kopfgrafik ohne Bezug, keine Orientierung beim Lesen. Kür K-04 (Lesefortschritt) und K-05 (Druckansicht) stehen ohnehin im Plan.
- **Lesefortschritt (B-24, K-04):** reine CSS-Szene über benannte Scroll-Timelines (`timeline-scope`, `view-timeline-name`, `view-timeline-inset: 40% 59.9%` als Leselinie). Im Browser geprüft: genau eine Nummer ist hervorgehoben, die Leiste wächst mit dem Artikel (0 → 1). Ohne Unterstützung oder bei reduzierter Bewegung gibt es weder Leiste noch Hervorhebung. Kein JavaScript, höchstens sechs Abschnitte.
- **Ablaufzeichnung (B-23):** neuer Generator `ablauf` (E4-GRAFIKER-10). Die Schritte kommen nur aus vorhandenem Text: `ablaufAusText` liest „erst …, dann …“ mit zwei bis vier einzelnen Wörtern, sonst bleibt die Fachgrafik zum Motiv. So zeichnet die Seite nichts, was der Text nicht sagt.
- **Druckansicht (K-05):** nur `@media print` in `globals.css` (Kopf, Fuß, Aktions- und Ablaufleiste, Brotkrumen und `[data-nicht-drucken]` entfallen; keine klebenden Spalten, keine Bewegung, Abschnitte ungeteilt). Kein eigener Druckknopf: Bestellseite und Bestätigungen stehen unter dem Logikwächter, und ein Knopf bräuchte einen Import außerhalb von `@/components/visual/` und neues Client-JavaScript. Drucken geht über den Browser. Geprüft mit Druckdarstellung in Chromium (Ratgeber, Warenkorb).

## D-039 · Kür K-06: Vorschaubilder je Bereich über `next/og`
- **Umsetzung:** `src/lib/og/bereichsbild.tsx` zeichnet 1200 × 630 als Werkstattzeichnung: Papier mit 30-px-Raster, Augenbraue „SCHLÜSSELMACHER24“ in der Bereichsfarbe, Bereichsname, der vorhandene Satz des Bereichs aus der Navigation und die Profillinie aus dem Namen. `opengraph-image.tsx` in `(site)` (Startseite und alle Seiten ohne eigenes Bild) und in den neun Bereichsordnern; Next erzeugt sie beim Build statisch.
- **Keine fremden Quellen:** Schrift aus dem vorhandenen Paket `@fontsource/ibm-plex-sans` (WOFF 400/600, `next/og` liest kein WOFF2), Farben aus `globals.css` (`tokensAusCss`) und `area-theme.ts`. Keine neue Abhängigkeit, kein Logo-Nachbau (der Name steht nur als Text in der Augenbraue).
- **Wertesuche:** `next/og` kennt keine CSS-Variablen, deshalb steht genau ein `hsl(` im Helfer (und eines im Test); beide sind benannte Einzelausnahmen.
- **Geprüft:** Bilder auf Port 3001 angesehen (Startseite, Autoschlüssel, Code, Sicherheitstechnik), `og:image` mit Größe und Alternativtext im Kopf der Bereichsseiten; 4 Tests für Token-Lesen, Farbwert und Inhalt.

## D-040 · Abnahme Befundwelle 1 (H04, H05, H09) und E5-BAUMEISTER-20
- **H05 Code-Shop:** bestanden in Runde 2. Die Reiter der Code-Fundstelle stehen auf der Produktseite (H06), wo die Codelinie feststeht; die Übersicht zeigt die Zeichnung ruhig im Kopf. Nacharbeit: Spaltenaufteilung ab `lg`, Pfeil nach B-06, kürzerer Platzhalter der Suche.
- **H09 Türtechnik:** nach Runde 3 nicht bestanden, mit Nacharbeit abgenommen. Ein klebender Rechner ist bei 1 353 px Höhe nicht bedienbar und entfällt; die Leerfläche links verschwindet, weil das Schriftfeld ab `lg` unter dem Text in der linken Spalte steht (Rechner über zwei Rasterzeilen).
- **H04 Assistent:** nach Runde 3 nicht bestanden, mit Nacharbeit abgenommen. Der F-04-Fehler des Prüfers kam aus einer Werkzeugkopie ohne Lese-Aktionen (zweimal bestanden aus `_werkstatt/werkzeuge/`). Tagesleiste und Zeitraster sind belegt; der Preisschritt zeigt ein Schriftfeld statt getönter Kästen (`preis-anzeige.tsx`, Orchestrator). Schlüsselart-Zeichnungen und Modellzähler gehen in Befundpaket 2 für H04.
- **E5-BAUMEISTER-20 Service:** bestanden in Runde 1. Neue Mikrotexte der Abschnittsordnung bestätigt; öffentlicher Hinweis bei fehlenden Firmendaten statt Platzhaltern (bis M-02); Linknamen der Vor-Ort-Liste mit Leistungstitel.
- **Werkzeuge:** Die Funktionsliste wird nur aus `_werkstatt/werkzeuge/` gestartet; der Hinweis steht in den laufenden und künftigen Paketen.

## D-041 · Hinweiskästen ruhig, Arbeitsköpfe ohne Fach-Icon
- **Alert:** Statt getönter Flächen mit Rahmen in der Tonfarbe zeigt `Alert` jetzt Papier (`bg-surface`), eine Haarlinie und eine 2-px-Leiste links in der Tonfarbe; das Glyph trägt die Tonfarbe. Grund: KERN 1.10 „sparsame Flächen“, Prüferwünsche aus E5-BAUMEISTER-23 und Sichtabnahme (H03 Warnkasten). Wirkt auf rund 80 Stellen; Rollen, Texte und Props bleiben gleich, die drei Alert-Tests sind grün.
- **Arbeitsköpfe:** `PageHeader` zeigt das Bereichs-Icon nur in Erzählansichten. Arbeitsansichten (Assistent, Kasse, Vorlage-Anfrage, Konfiguratoren) bleiben ohne Fach-Icon im Kopf; ein Icon darf in einem Schriftfeld unter dem Kopf stehen (Sicherheitscheck).

## D-042 · Benannte Ausnahmen für Anzeige-Ausdrücke (H07, H04 Runde 2), Funktionsliste nach Neustart
- **H07 Zylinder-Konfigurator:** Die Positionszeilen des Baumeisters holten ihre Beschriftung über `breakdown.lines[index]`. `priceCylinderOrder` überspringt Positionen ohne Bauform im Katalog, die Zuordnung kann dann verrutschen. Stattdessen bleibt das Schriftfeld vollständig (`sections={summary}` mit Preisrechnung), darüber steht je Position nur die Maßzeichnung. Drei benannte Ausnahmen: Zeichnungsreihe, Leerzeichen der Warnzeile, entfallene Musterzeichnung.
- **H04 Runde 2 (Orchestrator):** Neue Komponente `src/components/visual/schluesselart-zeichnung.tsx` (Schlüsselart → Bauform des Generators `schluessel`, dekorativ, ruhig) und additive Prop `bild` an `OptionCard`. Im Assistenten eine benannte Ausnahme für `bild={<SchluesselartZeichnung art={kind} />}`. Der Modellzähler bleibt in der Größe der Beschreibung (die Ausnahme E4-B-16 legt den Ausdruck fest; der Gewinn wäre gering).
- **Funktionsliste:** Nach einem Neustart des Entwicklungsservers stehen Server-Actions erst nach dem Kompilieren der Seite im Manifest. `attrappenSetzen` liest das Manifest bei einer unbekannten Kennung einmal neu; durch dürfen weiterhin nur `fetch*` aus `src/lib/actions/booking.ts`. Damit ist F-04 auch direkt nach dem Neustart bestanden.

## D-043 · Nacharbeit nach L3 ohne Reparaturrunden, Rahmen um Szenen, lucide entfernt (E5-L-12)
- **Welle G/H und Befundwelle:** Wo ein Paket nach drei Prüfrunden (oder wegen des Sitzungslimits ohne Reparatur) nicht bestanden hatte, hat der Orchestrator die offenen Befunde selbst behoben und mit eigenen Bildern abgenommen (H01, H02, H03, H06, H10, H11, B-26, B-27, B-28, B-29, DOKUMENTAR-01). Denkprotokoll: Ein vierter Anlauf ist nach L3 nicht zulässig; die Befunde waren klein und belegbar, eine neue Welle hätte Stunden gekostet.
- **Logikwächter, entfernte Importe:** Eine Ausnahme bildet immer den neuen Stand auf den alten ab (Lookahead, damit die Basis unberührt bleibt); sonst meldet der Wächter ein veraltetes Protokoll.
- **Abschnitte, die nur mit Daten erscheinen:** laufende Nummern über einen CSS-Zähler (`.sm24-zaehlung`), nicht über neue JSX-Ausdrücke.
- **Szenen am Scrollen:** Ein Rahmen mit `overflow: hidden` ist Scrollcontainer und hält eine `view()`-Zeitleiste an. Rahmen um `.sm24-szene` schneiden in unterstützenden Browsern mit `clip` (KERN 1.13, B-25).
- **lucide-react:** Nutzungssuche ohne Treffer (nur ein Test prüft das Fehlen), `npm uninstall lucide-react` entfernt nur dieses Paket aus Paketdatei und Lock; Build 208/208 grün. Damit nutzt die Seite eine Icon-Familie (Z-06).

## D-044 · Prüfstufe B E5: Ergebnis, spätes Vorladen der festen Ziele, Bildrate als Median
- **Ergebnis Prüfstufe B E5** (`_werkstatt/protokolle/E5-PRUEFER-B-ergebnis.md`):
  - Bestand grün: Typprüfung 0, Build 208/208, 66 Testdateien mit 1150 Tests, DB 52/52, Logikwächter 0, Textabzug gleich, Wertesuche 0 ohne Ausnahme. Der Linterfehler im Seitenkopf-Test ist behoben (eb5cda6).
  - Funktionsliste 14/14, keine Budget-Verstöße (E4: H10 mobil), axe ohne Befund in 56 Zeilen (E4: 4 kritische).
- **Sichtabnahme E5-L-29** (Ansichtswerte, Ziel ≥ 8):
  - erzaehl-1 6,8: H01 7,7, H02 6,7, H03 6,0, H12 7,0.
  - erzaehl-2 7,0 (E4 5,9): H05 6,7, H06 7,3, H08 7,2, H09 6,8.
  - arbeit 7,1: H04 6,8, H07 7,0, H10 7,3, H11 7,2.
  - uebrige 6,4: Gleichschließung 7,5, Service 5,3, Artikel 5,8, Standorte Berlin 6,0, Sicherheitscheck 7,0, AGB 6,7.
  - Harte Katalogtreffer nur bei Platzhalter-Inhalten, die Gestaltung nicht lösen darf: Beispielartikel (M-25) und Platzhalter im Wortlaut der AGB (unantastbar, M-05). Keine Hauptansicht hat einen harten Treffer.
  - Folge: Befundpakete Runde 2 (letzte Runde, L3) für alle Hauptansichten unter 8, dazu für Service und Standorte.
- **Bildrate B-01 (Startseite mobil, 4-fach gedrosselt):** Der Einzellauf zeigte 26,6 % verworfene Bilder. Ursache laut Messung der langen Bilder: Gleich nach der Hydrierung lud Next.js alle sichtbaren Links vor (Logo, Warenkorb, Termin, vier Ziele der Aktionsleiste, zwei Knöpfe im Kopf). Die RSC-Antworten wurden parallel verarbeitet, mit Bildern von 100–145 ms.
  - Abhilfe (E5-L-30): Diese festen Ziele haben `prefetch={false}` und werden über `useSpaetVorladen` erst nach 2,5 s im Leerlauf vorgeladen, bei „Daten sparen“ gar nicht (`src/lib/spaet-vorladen.ts`, mit Test). `ButtonLink` bekommt dafür die optionale Prop `prefetch`.
  - Ergebnis: keine Anfragen mehr im Messfenster. Übrig bleibt die Hydrierung, wenn die Messung vor ihrem Ende beginnt; die Fräsbahn startet erst danach (`data-motion`).
- **Messung:** `bewegung.mjs bildrate` hat die Option `--laeufe n`; das Ergebnis ist der Median, alle Einzelwerte stehen in Tabelle und JSON. Der Standard bleibt 1 Lauf, die Schwelle unverändert 5 %.
  - Denkprotokoll: Ein Einzellauf hängt am Zeitpunkt der Hydrierung (0 % bis 7 % bei unverändertem Stand); `messung.mjs` misst aus demselben Grund im Median. Prüfstufe C misst die Bildrate mit 5 Läufen.
  - Stand nach der Abhilfe: Median 0,0 %, Einzelwerte 0 / 0 / 6,4 / 0 / 2,8 % (vorher 23,9–28,4 %).

## D-045 · Gemeinsame Befunde der Runde 2 zentral (E6-L-31), Lineal nur mit Ziffern, ein Summenbegriff
- **Anlass:** Die Entscheidungsentwürfe der Runde 2 (Workflows `wf_e9710b7f-3ab`, `wf_d633ea4c-f45`) verlangen dieselben gemeinsamen Bausteine mehrfach. `OptionCard` wollen H04 (`bildLage`), H09 (`zeile`) und H10 (`metaSpalte`), `FlowShell` H04 und H07, `Accordion` H02, H08 und H09, `PageHeader` H10 und H11. Parallel gebaut, würden sich die Pakete gegenseitig überschreiben.
- **Entscheidung:** Der Orchestrator setzt alle Erweiterungen vorab in E6-L-31 um. Jede Erweiterung ist additiv und optional; ohne neue Prop bleibt das Markup aller bisherigen Aufrufer gleich (Vorher-Nachher-Abgleich des gerenderten HTML für OptionCard und PageHeader). Die Pakete der Runde 2 bekommen auf diese Bausteine kein Schreibrecht, nur die Nutzung.
  - `FlowShell`: Das Band läuft über die ganze Shell und zeigt auf allen Breiten „Schritt n von m · Name“; der Titel benennt nur noch den Fortschrittsbalken. Ab 768 px stehen Zurück und Weiter in einer Zeile. Dazu Opt-in `raster="seite"` (8/4 mit klebender Schrittliste), `seite` und `summe`. Das Raster ist bewusst kein Standard, weil Projekt- und Zutritts-Konfigurator breite Inhalte (Schließplan, Tabellen) in zwölf Spalten brauchen. Eine Probe mit `raster="seite"` in H04 und `summe` in H07 ist am Bild geprüft und wieder zurückgenommen; setzen werden sie die Pakete.
  - Im laufenden Ablauf blendet der Kopfknopf „Termin starten“ aus (`data-kopfknopf`, Regel neben der für die Aktionsleiste), damit „Weiter“ die einzige Hauptaktion bleibt.
  - `Accordion`: Die Antwort steht in `<p class="max-w-measure hyphens-auto">`, die Fläche bleibt breit (K-006).
  - globals.css: `.sm24-ruhig` hält auch `.sm24-dash` an. In ruhigen Zeichnungen lief der Signalbogen sonst beim Eintritt einmal durch, ohne Registereintrag (Gegenprüfung H02). `sm24-ausschnitt-bemasst` lässt die Bemaßung im Telefon-Ausschnitt stehen (H01).
  - `zylinder-mass` beschriftet das Innenmaß mit „B“ statt „I“, wie alle Texte und Felder (Maß A/B). Teständerung mit Alt-Neu: fünf Prüfungen `'I …'` → `'B …'`, gleiche Zahl.
  - `funktionsliste.mjs` wartet vor jedem Schrittbild 400 ms, damit die Bilder ruhende Schritte zeigen (H07, Details 10).
- **Lineal der Schlüsselzeichnung:** Unbeschriftete Teilstriche unter dem Bart behaupten ein Maß, das niemand lesen kann (K-003 „Bemaßt statt behauptet“, Befund 9 in H02 und H03). Das Lineal steht deshalb nur noch zusammen mit Ziffern (`einschnitte`). Heute übergibt kein Aufrufer `einschnitte`, also verschwindet das Lineal überall (Gegenprüfung H02); die Zeichnungen werden dadurch minimal größer. Der Zweig mit Ziffern bleibt als Parameter des Generators mit Test bestehen.
- **Ein Summenbegriff: „Gesamtbetrag“.** Die Sichtabnahme verlangt einen einzigen Begriff. Kasse (Schriftfeld mit `hervorheben`) und Terminstatus sagen „Gesamtbetrag“, nur der Warenkorb sagt „Gesamtsumme“ (zwei Mikrotexte). Das Paket H10 stellt diese zwei um; die Kasse bleibt unberührt.
- **Belege:**
  - Prüfungen: Typprüfung 0, ESLint 0, Unit 69 Dateien mit 1163 Tests (neu: `option-card.test.tsx`, `flow-shell.test.tsx`, je ein Fall in `page-header.test.tsx` und `schluessel.test.tsx`), Logikwächter 0 abweichend, Wertesuche 0 ohne Ausnahme.
  - Funktionsliste 14/14 gegen Port 3001. F-12 lief zuerst in eine Zeitüberschreitung, weil der Entwicklungsserver die Route kalt übersetzte; der zweite Lauf ist bestanden.
  - Bilder: `/root/sm24-bilder/E6-L-31/`.

## D-046 · Einleitung von Warenkorb und Kasse bleibt sichtbar, Abstimmungen der Runde 2
- **Anlass:** KERN 1.14 sah vor, die Einleitung des Kopfes im Leerzustand über `PageHeader leadClassName="korb-leer:hidden"` auszublenden. Die Gegenprüfung von H10 belegt, dass das nicht trägt: Der Kopf steht außerhalb von `group/warenkorb`, die Variante greift dort nicht. Verlegt man die Gruppe, gilt sie auch im Ladezustand, weil die Ladekarte `data-leerzustand` trägt. Dann springt die Einleitung im gefüllten Korb nach der Hydrierung ein, mobil rund 88 px (CLS), und der leere Korb bekommt ein spätes LCP (L-07a: LCP 1004 ms, CLS 0,000).
- **Entscheidung:** In Warenkorb und Kasse steht die Einleitung im Kopf und bleibt in allen Zuständen sichtbar. Der Wortlaut wird zustandsneutral, aber nur als Textvorschlag. Die Kasse holt ihre Einleitung wortgleich in den Kopf (H11 Befund 3), ohne `leadClassName`. Die optionale Prop bleibt im Baustein (additiv, getestet) und wird derzeit nicht genutzt. KERN 1.14 ist im Text angepasst.
- **Abstimmungen für die Pakete der Runde 2:**
  - **Leere Zustände:** H10 und H11 setzen die Rohling-Zeichnung gleich, als Generator direkt in `<div aria-hidden="true" className="sm24-ruhig w-40 shrink-0">` mit `title=""`, ohne `ImagePlaceholder` (der zeichnet einen Rahmen). H11 baut nach H10.
  - **Warenkorb:** Das Positionsbild der Codeposition blendet beim Einhängen ohne Registereintrag ein. Es bekommt `sm24-ruhig` an der Hülle (nur `className`).
  - **Funktionsliste:** Sie liest die Endsumme als „Gesamtbetrag“ und weiter als „Gesamtsumme“, damit F-01 vor und nach H10 besteht.
  - **Logikwächter:** Vorab eingetragen sind die Ausnahmen für `kamera` in `photo-upload.tsx` (H06) und die Suchform des Modellzählers im Assistenten als Alternation aus alter und neuer Form (H04). Beide sind wirkungslos, solange der neue Wortlaut fehlt; der Wächter bleibt bei 0 abweichend.
  - **Startseite des Assistenten:** H04 bekommt zusätzlich `autoschluessel/anfrage/page.tsx` für den Zeilenpfeil unter „01 Weiterführend“ nach K-006 (Hinweis aus der Gegenprüfung H07).

## D-047 · Bauwelle 1 der Runde 2 abgenommen, Keyless als Zelle, Kopf und InfoTip
- **Ergebnis:**
  - H02 und H03 haben die Prüfstufe A in Runde 2 bestanden, H01 und H12 nach drei Runden nicht.
  - Die Pflichtbefunde sind nachgeprüft: Die Bildrate von H01 kam von einer Messung am Entwicklungsserver. Am Produktionsbuild des Wellenstands liegt der Median bei 0,0 % aus 5 Läufen, genau wie vor der Welle.
  - Die übrigen Pflichtbefunde (überschriebene eigene Bilder, eine Farbe) sind Verfahrensfehler oder in der Nacharbeit erledigt.
  - Alle vier Pakete sind mit Nacharbeit des Orchestrators abgenommen (L3, keine weitere Runde). Bericht: `_werkstatt/berichte/E6-BEFUND2-welle1-abnahme.md`.
- **Keyless (hebt D-026 in diesem Punkt auf):**
  - Auf der Modellseite steht Keyless als eigene Zelle mit Info-Glyphe in der Reihe der Schlüsselarten.
  - Die Sichtabnahme E5-L-29 hat die Hinweiszeile unter den Zeichnungen erneut als hängend bewertet (H03, Befund 11). Die Reihe richtet ihre Spalten nach der Zahl der Zellen.
- **Kopfnavigation:** Ab 1024 px stehen die Bereiche 1 und 3 im Balken, ab 1280 px zusätzlich 2 und 5. Bereich 4 (Gleichschließende Zylinder, langer Name) steht immer unter „Mehr“.
  - Denkprotokoll: Bei 1024 px und bei 1536 px ragte der Kopfknopf um 69 px über den Innenrand. Kürzere Abstände oder ein kleineres Logo hätten nicht gereicht oder das Logo berührt (unantastbar).
  - Die Verlagerung in „Mehr“ hält alle Bereiche erreichbar. „Mehr“ ist aktiv markiert, wenn ein Bereich daraus offen ist, der nur dort steht.
- **InfoTip:** Die Erklärung rückt am Bildschirmrand nach innen. Dafür misst ein Layout-Effekt die Lage und setzt nur `translate`, ohne Zustand und ohne Logik.

## D-048 · Bauwelle 2 der Runde 2 abgenommen, Absturz des Entwicklungsservers, benannte Ausnahmen
- **Lage:** Alle elf Pakete lehnte die Prüfstufe A in Runde 3 ab. Ursache war fast überall der abgestürzte Entwicklungsserver: Ohne Server gab es keine Bildbelege, und die Prüfer durften ihn nicht starten.
- **Vorgehen:** Der Orchestrator hat den Server neu gestartet, den Code als Ganzes geprüft und die Bildprüfung durch elf Haiku-Prüfer nachgeholt, nur prüfend. Pflichtbefunde am Bild behebt er selbst (L3, keine weitere Reparaturrunde).
  - Echt waren zwei Befunde: seitliches Scrollen im Code-Shop und der Umbruch in der Leiste des Zylinder-Konfigurators.
  - Dazu kam eine Abweichung von K-008: die Ziffern der Tür-Schutzpunkte.
  - Alle drei sind behoben und gemessen. Bericht: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md`.
- **Ausnahmen des Logikwächters:** fünf benannte Ausnahmen in Kasse, Warenkorb und Zylinder-Konfigurator, jede nur Darstellung. Danach 0 abweichend.
  - Denkprotokoll: Der Wächter vergleicht mit dem Fingerabdruck des Basisstands. Entfernte Anzeige-Ausdrücke werden deshalb auf der neuen Seite für den Vergleich wieder eingefügt, und zwar an festen Ankern oder per Lookahead, nie im Basisstand getilgt.
- **G4, entfernte Anzeigen mit Ersatz:**
  - Anwendung der Codeposition im Warenkorb: wiederholte den Titel.
  - Kasten „So messen Sie richtig“: Der Text bleibt im InfoTip jeder Position.
  - Lead der Codelinien-Seite: Ersatz ist die Zeile „Anwendung“.
  - Daten unverändert.
- **Werkzeug:** Die Prüfer schreiben ihre Protokolle nach `/root/sm24-bilder`. Die Funktionsliste legt ihre Markdown-Protokolle weiter in `_werkstatt/protokolle/` ab; sie gehören zum Beleg und werden committet.
