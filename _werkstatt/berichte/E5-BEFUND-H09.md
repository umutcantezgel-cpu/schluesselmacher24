# E5-BEFUND-H09 · Bericht und Abnahme

3 Prüfrunde(n), Prüfurteil: nicht bestanden. Abnahme durch den Orchestrator:

- **Prüfung nach Runde 3 nicht bestanden** (Muss: Rechner nicht klebend; Soll: Leerfläche links). Abnahme mit Nacharbeit statt vierter Runde (L3):
  - **Klebender Rechner:** entfällt bewusst. Der Rechner ist 1 353 px hoch (1440 × 900) und damit höher als das Fenster; geheftet wäre seine Anfrage-Schaltfläche nicht erreichbar. Die Abweichung des Baumeisters gilt (D-040).
  - **Leerfläche links:** Das Schriftfeld „Elektronik trifft Mechanik / Ablauf in diesem Bereich“ steht ab `lg` in der linken Spalte unter der Liste (`lg:grid-rows-kopf`, Rechner `lg:row-span-2`); mobil bleibt die Reihenfolge Text → Rechner → Schriftfeld. Gemessen: links endet bei 2 104 px, der Rechner bei 2 017 px (1440); keine Lücke mehr.
- **Entschieden:** Ordnung 01–05 (die Wissensdatenbank entfällt, es gibt keinen sechsten Abschnitt). Floskeln bleiben Inhalt (TEXTVORSCHLAEGE).

## Prüfurteil

- **muss:** Entscheidung des Orchestrators nicht umgesetzt: Der Rechner in src/app/(site)/tuer-und-schliesstechnik/page.tsx Zeile 204 hat kein lg:sticky lg:top-28 lg:self-start. Das Paket verlangt es unter 'Entscheidungen des Orchestrators' (Abschnitt 01). Der Bericht begründet die Abweichung, genehmigt ist sie nicht. Die Messung messung-rechner-vorher.json belegt nur, dass die Anfrage im gehefteten Zustand nicht sichtbar ist (anfrageImGehefteten false). Sie belegt nicht, dass der Link nach dem Lösen unerreichbar bleibt. Eine Variante mit lg:row-span-2 wurde nicht geprüft.
- **soll:** Abschnitt 01 hat links unter der Leistungsliste eine Leerfläche von etwa 335 px bei 1440 px (Ausschnitt /root/sm24-bilder/E5-BEFUND-H09-pruefung-r3/ausschnitte/desk-abschn01.jpg). Der Befund Komposition 2 ist damit nur verlagert, nicht behoben. Ursache ist der entfernte Sticky-Rechner aus dem ersten Befund.
- **hinweis:** Dunkles Feld (Zeilen 288 bis 318): Die rechte Spalte zeigt nur das 96-px-Icon in einer sonst leeren Fläche (Ausschnitt desk-dunkel.jpg). Umgesetzt wie im Paket, wirkt aber dünn.
- **hinweis:** Das Paket nennt Kern-Version 1.10. KERN.md steht auf 1.12 (Änderungen 1.11 und 1.12). Ohne Auswirkung auf diese Seite. Die Ordnung endet bei 05, weil 'Verwandte Fachthemen' entfällt. Das Paket schrieb 01 bis 06. Das passt zur Alt-Neu-Liste, sollte aber vom Orchestrator bestätigt werden.
- **hinweis:** werte-suche hat eine neue, untracked Protokolldatei im Repository erzeugt: _werkstatt/protokolle/werte-suche-2026-10-16_11-23-54.json. Nicht gelöscht. Der Orchestrator sollte entscheiden, ob sie bleibt.
- **hinweis:** Logikwächter: Die Datei steht nicht auf der geschützten Liste. 'pruefen' meldet KEIN EINTRAG (Exit 3). 'sichern' wurde nicht ausgeführt, weil es ein Fingerabdruck-Protokoll schreibt. Die Diff-Prüfung zeigt keine Logikänderung: nur Markup, Klassen, Mikrotexte, den Entfall des Verwandte-Fachthemen-Blocks und den Import CardBody.
- **hinweis:** Mobile Ganzseitenaufnahme: Die fixe Bodenleiste und die Entwicklungs-Schaltfläche überdecken in Abschnitt 01 Teile des Textes. Das ist ein Effekt fixierter Elemente bei der Aufnahme, kein Seitenfehler.

## Bericht des Baumeisters

=== E5-BEFUND-H09 · RUNDE 3 (Überarbeitung nach Ablehnung in Runde 2) ===

GEÄNDERTE DATEIEN
- src/app/(site)/tuer-und-schliesstechnik/page.tsx (nur diese Datei)

WAS UND WARUM
1. Muss: Das Schriftfeld 'Elektronik trifft Mechanik' und 'Ablauf' steht jetzt unter beiden Spalten über volle Breite. Der Wrapper ist 'grid border-y md:grid-cols-2 lg:col-span-12'. Ab md steht links die Einordnung, rechts der Ablauf (dl mit md:border-l). Vorher stand es nur links in Spalte 1.
2. Soll, Sticky: 'lg:sticky lg:top-28 lg:row-span-2' am Rechner ist entfernt. Gemessen: Der Rechner ist 1.353 px hoch (1440x900) bzw. 1.389 px (1024x768), der Anfrage-Link liegt 1.328 px unter seiner Oberkante. Im gehefteten Zustand ist er bei keiner der vier Fensterhöhen (1024x768, 1280x800, 1440x900, 1920x1080) erreichbar. Der Ausgangsstand (1171973) hatte den Rechner aus demselben Grund nicht mitlaufend, mit Kommentar im Code. Die Befund-Messwerte (665 bis 2.017 px, Spielraum 140 px) habe ich nicht reproduziert. Meine Messung steht in messung-rechner-vorher.json.
3. Soll, mobile Leiste Systemerweiterungen: Karte p-6 mobil, p-8 ab md. Der Pfeil steht unten rechts statt neben dem Titel. basis-3/4 bleibt als KERN-Muster. Der Titel kann weiterhin umbrechen.
4. Soll, Ordnung: nicht geändert, siehe offene Fragen.
5. Soll, Haken und Linkwörter: bereits in Runde 2 erledigt, keine Änderung nötig.

ALT-NEU-LISTE (Mikrotexte gegenüber 1171973)
- Link Paniktechnik: 'Spezifikationen für Paniktechnik ansehen' → 'Spezifikationen für Paniktechnik' (Pfeil bleibt).
- Leistungskacheln: 'Leistungsdetails' (10×) → entfällt. Die ganze Zeile ist der Link, rechts nur der Pfeil.
- Systemerweiterungen: '{Bereich} erkunden' (4×) → entfällt. Die ganze Karte ist der Link, Pfeil unten rechts.
- FAQ-Antworten 1 und 5: 'z.B.' → 'z. B.'
- Abschnitt 'Verwandte Fachthemen' mit zwei Chips entfällt (Doppelung der Karten darüber).
- Neu: Augenbraue '03 Normen und Brandschutz' im dunklen Feld (vorher keine), Nummer in text-foreground-inverse/70.
- Neu: Nummern 04 (Fachwissen) und 05 (Systemerweiterungen) als SectionHeading nummer. Vorher ohne Nummer.
- FAQ-Liste: 'max-w-4xl mx-auto' entfällt, die Liste hat volle Breite. Überschrift unverändert.
- Nicht geändert: alle Texte mit Inhalt, also auch die Floskeln 'Präzise Handwerkskunst …' und 'Wir legen Wert auf transparente Aufklärung …'. Sie bleiben als Vorschläge des Orchestrators.

GEMEINSAME DATEIEN
- Keine gemeinsamen Dateien geändert.
- Kein Wert ohne Token neu eingeführt. Verwendet: gutter (md:gap-gutter, md:pr-gutter, md:pl-gutter), min-h-touch-lg, text-title, text-title-sm, text-small, text-body, rounded-lg, p-6 und md:p-8.
- Gemeldet: Die Leerfläche neben dem Rechner (335 px Desktop, 302 px bei 1024 px) ist eine Folge des vollen Schriftfelds. Sie braucht eine Entscheidung (siehe offene Fragen).

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0.
- eslint Seite: Exit 0, kein Befund.
- vitest run src/components src/lib: 60 Dateien, 1.100 Tests bestanden.
- vitest 'seitenstruktur.test.ts': 2 Tests bestanden.
- werte-suche.mjs: null Funde.
- grep lucide-react: kein Treffer.
- Platzhalter-Grep im gerenderten HTML (localhost:3001/tuer-und-schliesstechnik): 0 Treffer.
- Keine Befunde zu Props, Daten, Handlern oder Tests. Keine Teständerung.
- Lock /tmp/sm24-messfenster.lock: während des Laufs nicht vorhanden.

BILDBELEGE (Ordner /root/sm24-bilder/E5-BEFUND-H09-runde3/)
- tuer-und-schliesstechnik__desktop__ganz.jpg
- tuer-und-schliesstechnik__tablet__ganz.jpg
- tuer-und-schliesstechnik__mobil__ganz.jpg
- bild-desktop.json, bild-tablet.json, bild-mobil.json (Protokolle)
- messung-rechner-vorher.json (Sticky-Messung), messung-luecke.json (Leerfläche), messung-rechner.mjs, messung-luecke.mjs (Messskripte)
- alt-1171973.tsx (Ausgangsstand), seite-r3.html (gerenderte Seite)
- tsc.txt, eslint.txt, vitest.txt, vitest-seitenstruktur.txt, werte-suche.txt

OFFENE FRAGEN: siehe Feld offene_fragen. Dazu gehören Ordnung 01 bis 05 gegen 06, die Leerfläche links, die Sticky-Abweichung, die Icon-Größe im dunklen Feld und zwei Dateien außerhalb des Befundordners.

=== ENDE E5-BEFUND-H09 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen

- Ordnung: Das Paket verlangt 01 bis 06, umgesetzt sind 01 bis 05. Das Paket streicht zugleich die Wissensdatenbank, nach der kein sechster Abschnitt entsteht. Entscheidung des Orchestrators nötig.
- Leerfläche links: Das volle Schriftfeld unter beiden Spalten lässt neben dem Rechner rund 335 px Leerfläche (Desktop). Entscheidung nötig: Rechner kürzen, Schriftfeld zurück in die linke Spalte (widerspricht dem Muss) oder die Lücke hinnehmen.
- Sticky-Abweichung: Die Befund-Messwerte habe ich nicht reproduziert. Gemessen ist der Rechner in allen vier Fensterhöhen zu hoch für den gehefteten Zustand, daher ohne Sticky. Bitte bestätigen.
- Icon-Größe im dunklen Feld: Im Gesamtbild wirkt das Fach-Icon klein. Die Code-Angabe 96 px entspricht dem Paket; Einzelbild nicht geprüft.
- Falsch abgelegte Hilfsdatei: /root/sm24-bilder/_tmp_h09_alt.tsx liegt direkt im Bilderordner statt im Paketordner. Ich darf sie nicht löschen oder verschieben. Bitte entfernen oder bestätigen.
- Werte-Suche hat das Protokoll _werkstatt/protokolle/werte-suche-2026-10-16_11-18-05.json im Repository erzeugt (untracked). Bitte entscheiden, ob es bleibt.
