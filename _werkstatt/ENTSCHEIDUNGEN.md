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
