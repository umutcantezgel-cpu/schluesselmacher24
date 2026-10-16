# E4-BAUMEISTER-17 · Bericht und Abnahme

Workflow `wf_8c908891-137` (Welle E), 1 Prüfrunde(n), letzte Prüfung bestanden. Abnahme und Nacharbeit durch den Orchestrator (D-033), Commit siehe PLAN.

## Abnahme durch den Orchestrator

- Ganzer Unterschied gegen `fab24ac` gelesen. Alle Texte sind erhalten, die FAQ-Überschrift wurde verschoben. Mikrotexte: „Ebenfalls passend:“ steht ohne Doppelpunkt als Feldtitel, „Ansehen“ entfällt in den Weiterführend-Zeilen (der Pfeil trägt die Aktion). Beides sind erlaubte Mikrotextänderungen.
- Neues Schriftfeld im Kopf (Ablauf, Aufnahmen, Original, Einsendung): Die Werte stammen aus vorhandenen Texten (`PROCESS_LABELS`, Anzahl der Aufnahmen, FAQ „Ihr Schlüssel bleibt bei Ihnen“, „Nur wenn die Bilder … nicht ausreichen“). Der Orchestrator hat das bestätigt (D-033).
- FAQ-Antworten mit Redaktions-Platzhalter („[Platzhalter: …]“) erscheinen weder auf der Seite noch in den JSON-LD-Daten. Die Pflege der Bearbeitungsdauer steht als M-19 in MENSCHEN.
- Soll-Befund Fotokarten: Ab `md` teilen sich die drei Blätter die Zeilen über ein Subgrid (`md:row-span-3 md:grid-rows-subgrid`). Die Titel stehen auf einer Linie, das Bildformat aus den Daten (1/1 für „Spitze und Profil“) bleibt.
- Soll-Befund Redaktionshinweis im Fuß: Der Hinweis erscheint nur im Entwicklungsmodus (`NODE_ENV !== 'production'`, D-016); der Prüfer sah ihn auf Port 3001. Keine Änderung nötig.
- Offen (TEXTVORSCHLAEGE, bestehend): Abschnitt „Vier Abschnitte“ und Text „acht Schritte“ widersprechen sich.

## Prüfurteil (letzte Runde)

- **soll:** Desktop, Abschnitt 02 (Fotobeispiele): Die Kartentitel stehen nicht auf einer Linie. Die 1/1-Bildstelle "Spitze und Profil" ist höher als die 4/3-Stellen, deshalb liegt ihr Titel rund 90 px tiefer. Beleg: crop-desktop-fotos-r1.jpg.
- **soll:** Mikrotext nicht in der Alt-Neu-Liste: In den Weiterführend-Kacheln entfällt das Wort "Ansehen" mit Pfeil (fab24ac: 1 Treffer, jetzt 0). Der Bericht nennt nur drei Mikrotext-Änderungen.
- **soll:** Sichtbarer Redaktionshinweis "Hinweis für die Redaktion: Firmendaten sind noch Platzhalter." steht im Footer des Layouts und damit auf der Seite. Das Layout gehört nicht zu den Schreibrechten; an den Orchestrator melden. Der Platzhalter der Seite selbst ("[Platzhalter …]") ist im HTML nicht mehr vorhanden.
- **hinweis:** FAQ-Filter (Zeile 156-158): istPlatzhalterAntwort prüft zusätzlich jede eckige Klammer, das Paket verlangt nur istPlatzhalter. Jede künftige Antwort mit [ wird damit ausgeblendet. Der Bericht nennt die Abweichung; die Lösung gehört in src/lib/platzhalter.ts (Orchestrator).
- **hinweis:** Die Schritt-Überschriften im Ablauf (Zeilen 326, 356) sind von p auf h3 umgestellt. Das ändert die Gliederung; der Bericht erwähnt es nicht.
- **hinweis:** Schrittzahl sichtbar widersprüchlich: Überschrift "Vier Abschnitte" (vier Schritte, korrekt) neben dem Fließtext "Der Ablauf hat acht Schritte" (Zeile 92). Paket-konform belassen; offene Frage für den Orchestrator.
- **hinweis:** Logikwächter nicht zuständig: page.tsx steht nicht in GESCHUETZTE (logikwaechter.mjs ab Zeile 36). Der Aufruf pruefen mit Dateiargument meldet "abweichend: 1", weil kein Fingerabdruck existiert, nicht wegen einer Änderung. Sichern nicht ausgeführt, da es ins Repository schreibt. Die Diff-Lesung zeigt keine Logikänderung außer dem gewollten FAQ-Filter.
- **hinweis:** Mein werte-suche-Lauf hat ein neues Protokoll im Repository angelegt (untracked: _werkstatt/protokolle/werte-suche-2026-10-16_09-12-41.json). Nicht gelöscht; zur Kenntnis.
- **hinweis:** Gesamtbilder: Die feste Bodennavigation im mobilen Gesamtbild und der Next-Entwicklungsindikator unten links sind Aufnahmeartefakte, kein Befund dieser Datei.
- **hinweis:** Nicht geprüft: Tastatur-Fokusring, Überlauf per scrollWidth, messung.mjs, a11y.mjs, reduzierte Bewegung im Browser. Die reduzierte Variante ist im CSS belegt: sm24-reveal steht in globals.css Zeile 383 und 390 unter prefers-reduced-motion: no-preference.

## Letzter Bericht des Baumeisters

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/schluessel-nach-vorlage/page.tsx (einzige geänderte Datei; Props, Daten und Texte der Seite unverändert, bis auf die unten genannten Ausnahmen)

WAS UND WARUM
- Kopf: PageHeader mit bereich="schluessel-nach-vorlage" und visual = SchluesselGrafik (typ zylinder, anzahl 2, Titel "Zeichnung: Schlüssel und Kopie nach Vorlage"). Die Zeichnung steht in einer Fläche auf Papier (rounded-lg border border-border bg-surface p-4 sm:p-6), wie KERN verlangt. Der Button trägt pfeil.
- Kopf-Schriftfeld (dl, Muster Startseite) neu mit vier Feldern: Ablauf, Aufnahmen (3), Original, Einsendung. Werte aus bestehenden Texten (siehe offene Fragen).
- Ablauf (Abschnitt 01, Ton default): Zwölfer-Raster 5/7. Links Kopf und Alert, rechts vier Schritte als Stückliste mit Haarlinien. Nummern 01–04 in Mono, Fach-Icons 40 px in text-area-strong: IconFotoHochladen, IconPruefung, IconAnzahlung, IconVersandPaket. Die Nummernkreise an der Schiene entfallen.
- Fotobeispiele (Abschnitt 02, Ton muted): drei Zeichnungsblätter im Raster mit Haarlinien (Muster Schlüsselarten-Reihe), md:grid-cols-3. Etikett "01 · Foto" bis "03 · Foto". Bildstellen mit visual laut Paket: Vorderseite schluessel zylinder; Rückseite schluessel zylinder code rueckseite; Spitze und Profil profilschnitt beschriftung false. Titel text-title-sm, Text text-small. Die Zeichnungen sind über ImagePlaceholder mit frei gesetzt. Bewegung: sm24-reveal mit motionStyle (Register B-04), gestaffelt wie in der Schlüsselarten-Reihe.
- Beschriftungskarte: GlyphLineal statt Ruler.
- Autoschlüssel (Abschnitt 03, Ton default): Zwölfer-Raster 7/5. Text unverändert. Button "Ablauf starten" und Kopf-Button mit Prop pfeil statt eigenem Pfeil. Werkstattbild ohne explizites visual, die Zuordnung nach D-032 zeigt einen Schlüssel mit Chip (im Desktop-Bild geprüft).
- Einsendung (Abschnitt 04, Ton sunken): Zwölfer-Raster 5/7. Checkliste mit GlyphHakenKreis statt CheckCircle2. Fußnote in text-small text-foreground-muted (vorher text-[13px] foreground-subtle).
- Fragen (Abschnitt 05): Accordion wie vorher, nur mit gefilterter FAQ-Liste (siehe unten).
- Weiterführend (Abschnitt 06, Ton muted tight): die sechs Kacheln sind jetzt eine Haarlinienliste (Stückliste, ganze Zeile ist der Link, Pfeil GlyphPfeilRechts mit group-hover:translate-x-1). "Ebenfalls passend" ist ebenfalls eine Haarlinienliste.
- FAQ-Filter: Antworten mit Platzhalter werden nicht angezeigt, auch nicht in den JSON-LD-Daten. Der Text bleibt im Code. Abweichung vom Paket: istPlatzhalter prüft nur den Anfang, der Platzhalter steht mitten im Satz. Deshalb zusätzlich jede eckige Klammer (lokale Funktion istPlatzhalterAntwort in page.tsx).
- Freie Werte nach K-005a: text-[11px] → text-caption (mit Mono, uppercase, tracking-label); text-[13px] und text-[14px] → text-small; text-[15px] → text-body oder text-title-sm; text-xs → text-caption; tracking-wider → tracking-label; leading-relaxed entfällt (text-small trägt die Zeilenhöhe); font-bold → font-semibold; grid-cols-[…] → lg:grid-cols-12 mit col-span; -left-[38px] entfällt; font-display entfällt; max-w-3xl → max-w-measure; lucide-Icons entfallen vollständig.
- Keine Änderung an getPageContent, getSettings, PROCESS_LABELS, Metadaten, JSON-LD-Aufbau, Links und Hrefs.

Text-Alt-Neu (Mikrotexte):
- "Ebenfalls passend:" → "Ebenfalls passend" (Doppelpunkt als Etikett entfallen)
- "Foto 1" → "01 · Foto" (Etikett nach Schlüsselarten-Muster)
- Schriftfeld neu: Ablauf / Aufnahmen / Original / Einsendung (Werte siehe offene Fragen)
Alle übrigen Texte unverändert, auch "Vier Abschnitte" und "acht Schritte".

GEMEINSAME DATEIEN
- src/lib/platzhalter.ts: istPlatzhalter prüft nur den Anfang eines Textes. Wunsch: Klammern im ganzen Text erkennen. Nicht geändert.
- Footer-Hinweis "Hinweis für die Redaktion: Firmendaten sind noch Platzhalter." steht auf allen Seiten im Layout (fremd, nicht meine Datei). Sichtbar im Bild und im HTML. Dem Orchestrator melden.
- _werkstatt/protokolle/werte-suche-2026-10-16_09-03-16.json: vom Werkzeug angelegt, nicht von mir in Quelltexte geschrieben, nicht committet.
- Keine Werte ohne Token in meiner Datei. werte-suche: 0 Funde.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: ohne Fehler.
- eslint page.tsx: ohne Befund.
- vitest run src/components: 30 Dateien, 758 Tests grün.
- vitest seitenstruktur.test.ts: 2 Tests grün.
- werte-suche.mjs: 0 Funde.
- grep lucide-react: kein Treffer.
- Messfenster: keine Sperre während des Laufs.
- Bilder mit SM24_BASIS_URL=http://localhost:3001, --ganz: mobil 390 px, tablet 768 px, desktop 1440 px, alle HTTP 200. Angesehen: Kopf, Ablauf, Fotobeispiele (mobil und tablet), Desktop-Kopf.
- Im gerenderten HTML: kein "[Platzhalter" auf der Seite. Das Wort "Platzhalter" steht zweimal im fremden Footer-Hinweis.
- Überlauf: optisch kein seitliches Abschneiden. bild.mjs misst keinen scrollWidth, daher nicht gemessen.
- Nicht gelaufen (nicht im Paket verlangt): messung.mjs, a11y.mjs, bewegung.mjs reduziert. Reduzierte Bewegung ist durch die globale Regel abgedeckt, nicht geprüft.
- Hinweis: Auf dem mobilen Gesamtbild erscheint die fixierte Bodennavigation mitten im Text. Artefakt des Gesamtbild-Modus, betrifft alle Seiten.

BILDBELEGE
- /root/sm24-bilder/E4-BAUMEISTER-17/schluessel-nach-vorlage__mobil__ganz.jpg
- /root/sm24-bilder/E4-BAUMEISTER-17/schluessel-nach-vorlage__tablet__ganz.jpg
- /root/sm24-bilder/E4-BAUMEISTER-17/schluessel-nach-vorlage__desktop__ganz.jpg
- JSON-Protokolle: bild-mobil.json, bild-tablet.json, bild-desktop.json im selben Ordner
- Ausschnitte: crop-desktop-kopf.jpg, crop-desktop-fotos.jpg, crop-mobil-kopf.jpg, crop-mobil-ablauf.jpg, crop-mobil-fotos.jpg, crop-tablet-fotos.jpg
- Vorlage vor dem Umbau: /root/sm24-bilder/E4-BAUMEISTER-17/page-vorher.tsx
- Gerenderter HTML-Abzug: /root/sm24-bilder/E4-BAUMEISTER-17/seite-html.txt

OFFENE FRAGEN
1. FAQ "Wie lange dauert die Prüfung?" enthält im Fallback "[Platzhalter: übliche Bearbeitungsdauer ergänzen]". Die Frage ist jetzt ausgeblendet (auch in JSON-LD). Dauer pflegen (MENSCHEN) oder Frage dauerhaft streichen?
2. Schriftfeld im Kopf mit neuen Etiketten und Werten (Ablauf, Aufnahmen 3, Original "Bleibt bei Ihnen", Einsendung "Nur auf Aufforderung"). Bestätigen oder streichen?
3. Schrittzahl widersprüchlich: "Vier Abschnitte" in der Überschrift, "acht Schritte" im Fließtext. Unverändert belassen, Entscheidung beim Orchestrator.
4. istPlatzhalter prüft nur den Anfang. Soll die Funktion in src/lib/platzhalter.ts die Klammern im ganzen Text erkennen? Dann könnte der lokale Zusatz entfallen.
5. Footer-Hinweis "Firmendaten sind noch Platzhalter" erscheint auf allen Seiten. Bitte beim Orchestrator oder im Layout prüfen.
6. Bildnotizen (slot.note) werden weiterhin nicht gerendert. Soll die Redaktion sie sehen?
7. Werkstattbild: ohne explizites visual, nach D-032 mit Schlüssel-Chip. Soll ein visual nachgesetzt werden?

=== ENDE E4-BAUMEISTER-17 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen des Baumeisters

- FAQ-Eintrag 'Wie lange dauert die Pruefung?' (Fallback) enthaelt '[Platzhalter: uebliche Bearbeitungsdauer ergaenzen]'. Die Frage wird jetzt ausgeblendet, auch in den JSON-LD-Daten. Der Text bleibt im Code. Ob die Dauer gepflegt wird (MENSCHEN), entscheidet der Orchestrator.
- Schriftfeld im Kopf (Ablauf, Aufnahmen, Original, Einsendung) ist neu. Werte: 'Gefuehrte Anfrage' (PROCESS_LABELS), '3' (Anzahl Aufnahmen), 'Bleibt bei Ihnen' und 'Nur auf Aufforderung' (aus bestehenden Texten uebernommen). Bitte bestaetigen oder streichen.
- Schrittzahl bleibt unveraendert widerspruechlich: Abschnittsueberschrift 'Vier Abschnitte', Text 'Der Ablauf hat acht Schritte'. Gemaess Paket beim Orchestrator belassen.
- Bildnotizen (slot.note) werden weiterhin nicht gerendert, wie vor dem Umbau. Ob die Redaktion sie sehen soll, ist offen.
- Die Werkstattbild-Stelle im Autoschluessel-Abschnitt bekam kein explizites visual. Nach D-032 zeigt sie einen Schluessel mit Chip (geprueft im Desktop-Bild). Falls gewuenscht, kann ein visual nachgesetzt werden.
