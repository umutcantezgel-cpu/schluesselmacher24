# E6-BEFUND2-H08 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Pflichtprüfung Bilder nicht belegt: Port 3001 antwortet nicht (curl 000, kein Listener; ss zeigt nur Port 3000, laut Paket ein älterer Build, nicht verwendbar). Nach vier Minuten Wartezeit nicht selbst gestartet. Nicht geprüft: Ganzseite mobil, tablet und desktop, Bildschirmhöhen, Planbeschriftung per getBoundingClientRect, Überlauf, Ausweichregel bei 768 px, 2×2-Feld bei 1024 px, Fokusringe, Regression Startseite und gleichschließende Zylinder. Die Sichtbefunde 1 bis 14 sind damit nicht abgenommen.
- **muss:** Grenze verletzt, nach eigener Angabe des Baumeisters: In Runde 2 wurde mit rm -f eine Hilfsdatei unter /root/sm24-bilder/E6-BEFUND2-H08/ gelöscht (Paket: nie Dateien löschen). Nicht nachprüfbar, weil die Datei fehlt. Kein Repository-Bezug. Entscheidung beim Orchestrator.
- **soll:** Kopfplan (page.tsx Z. 279 bis 284, mobil 16/9, Kopf in shell px-5): Schrift nach der Paketformel 12 × (Breite − 40) / 360 ergibt 11,7 px bei 390 px, 11,2 px bei 375 px und 10,7 px bei 360 px. KERN 1.8 verlangt auf Telefonen etwa 11,5 px. Das Paket misst nur 390 px. Bei 360 und 375 px am Bild und per getBoundingClientRect prüfen.
- **soll:** Mobiles Kopf-Format 16/9: Das Paket behauptet, die schmale Fassung 360×162 'füllt' 350×197. Gezeichnet werden 350×158, oben und unten bleiben je rund 20 px frei (ImagePlaceholder xMidYMid meet, Z. 123 bis 130). Die Kommentarzeile page.tsx Z. 283 benennt den Rand ehrlich. Die Begründung des Pakets stimmt so nicht; das Bild entscheidet, ob 16/9 bleibt.
- **hinweis:** Test 'setzt die Türnummern 1 bis 4 in den Plan, je einmal' (schliessplan-interaktiv.test.tsx Z. 71 bis 78) prüft nur das Vorkommen per toContain, nicht die Einmaligkeit. Der Name verspricht mehr als der Test.
- **hinweis:** Systemreiter: px-3 statt px-4 im Segment (schliessplan-interaktiv.tsx Z. 21). Grundlage ist der Ausweg aus den Paket-Risiken, der Bericht nennt ihn. Abweichung vom Wortlaut von Punkt 6, kein Mangel.
- **hinweis:** Punkt 11 verlangt, den Kommentar an der Stelle entfallen zu lassen. Im Code (schliessplan-interaktiv.tsx Z. 110) steht ein neuer Kommentar. Kleinigkeit.
- **hinweis:** Der Auftrag nennt KERN 1.14, KERN.md steht in der Kopfzeile auf 1.15. Die H08-Regeln sind in beiden Fassungen erfüllt; die Änderungen von 1.15 (B-20 Shop-Liste, B-23, B-26, Zeilenpfeil in Behältern) betreffen H08 nicht. Nur zur Kenntnis.
- **hinweis:** Die Anfangsbelegung des interaktiven Plans wechselt auf gleichschliessung (page.tsx Z. 355). Das ist eine Paket-Entscheidung; die Abnahme muss sie am Bild bestätigen, eine Regel verletzt sie nicht.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H08 · aktualisierter Bericht (Runde 3 nach Ablehnung der Runde 2)

Status: nicht abnehmbar. Die Pflichtprüfung Bilder fehlt (Server auf Port 3001 nicht erreichbar, Paket verbietet Eigenstart). Der Code-Teil ist mit den Befunden abgeglichen, bis auf die unten genannten Mess- und Bildpunkte.

GEÄNDERTE DATEIEN
- Diese Runde: src/app/(site)/schliessanlagen/page.tsx Z. 283 bis 284. Kommentar und Klasse korrigiert. Vorher: className="aspect-360/162 sm:aspect-3/2" mit dem Kommentar "Mobil das Maß der schmalen Fassung (360 × 162): die Zeichnung füllt die Fläche ohne Bänder." Nachher: className="sm:aspect-3/2" mit dem Kommentar "Mobil 16/9 aus ratio (Paketvorgabe), ab sm 3/2. Die schmale Fassung 360 × 162 steht mittig; oben und unten bleibt ein freier Rand." Begründung: aspect-360/162 erzeugt in Tailwind 3.4.19 keine Regel (Probe in /root/sm24-bilder/E6-BEFUND2-H08-pruefung-r2/tw-probe-out.css). Mobil galt schon bisher aspect-video aus ratio '16/9', also die Paketvorgabe. Die Behauptung "füllt ohne Bänder" in Kommentar und Vorrunden-Bericht wird zurückgenommen.
- Gesamtpaket (Vorrunden, unverändert in dieser Runde): page.tsx; system-erklaerung.tsx; schliessplan-interaktiv.tsx und .test.tsx; schliessplan.tsx und .test.tsx (Parameter nummern, Standard aus); visual/README.md (Abschnitt schliessplan).

WAS UND WARUM (je Punkt aus „Umsetzen“)
1. Augenbraue (erledigt): page.tsx Z. 269 bis 270 eyebrow="Leistungsbereich", bereich={ROUTE}; das Fach-Icon steht im PageHeader. Alt-Neu: "Mechanische Schließanlagen" → "Leistungsbereich".
2. SystemName und ErweiterbarUrteil (erledigt): system-erklaerung.tsx Z. 297 (SystemName, Kürzel in font-mono) und Z. 312 (ErweiterbarUrteil, Ja/Begrenzt in font-medium text-foreground), eingesetzt in Z. 336 und 356 (Leiste) sowie Z. 389 und 398 (Tabelle). Wortlaut unverändert, systemName() bleibt für systemReiter und ErweiterbareAnlage.
3. Kopfplan (Code erledigt, Bild offen): page.tsx Z. 281 generator schliessplan, system haupt, tueren 4; ratio '16/9'; Klasse sm:aspect-3/2 (siehe oben). Ab sm 3/2 wirkt; mobil 16/9. Der Plan steht statisch über ImagePlaceholder, ohne neues Client-JavaScript. Z. 355 anfang="gleichschliessung" (Vorher "haupt"; Abnahme soll bestätigen).
4. Fächer nach 03 (erledigt): page.tsx Z. 421 ff. Links SectionHeading, Absatz, Knopfreihe (Z. 431 mt-6 flex flex-col gap-3 sm:flex-row), darunter Alert mt-8 (Z. 440). Rechts ImagePlaceholder lg:col-span-5 (Z. 449), ratio 16/9, generator schluessel typ zylinder anzahl 3. Bild offen.
5. Vergleich als Leiste (Code erledigt): system-erklaerung.tsx Z. 323 Kommentar "ab md Tabelle, darunter Leiste"; Z. 328 role="region", aria-label, tabIndex 0; Z. 331 Leiste mit md:hidden; Karten shrink-0 basis-3/4 snap-start. Tabelle Z. 364 md:table. Ausweichregel bei 768 px nicht gemessen (offen).
6. Systemumschalter (erledigt): schliessplan-interaktiv.tsx Z. 21 segment mit whitespace-nowrap und px-3; Z. 147 Tablist -mx-5 flex snap-x … sm:grid sm:grid-cols-2. Z. 160 cn(segment, …). Mobil Leiste mit Anschnitt, ab sm 2×2. Bild offen (Fokusring, 2×2 bei 1024 px).
7. Ton (erledigt): page.tsx Z. 344 tone="muted" für Abschnitt 01 (Systeme). Tonfolge laut Paket.
8. Randlose Pläne (erledigt): schliessplan-interaktiv.tsx Z. 174 Kommentar zur Hülle shell, Z. 175 -mx-5 overflow-hidden bg-area-soft/40 sm:mx-0 sm:rounded-lg. system-erklaerung.tsx Z. 265 gleiche Klassen am Ende des Vergleichsblocks, ImagePlaceholder className sm:aspect-3/2 frei. Bild offen.
9. Planbeschriftung mobil (Code erledigt, nicht gemessen): Die Breite kommt aus Punkt 8; kein Generatorumbau. Erwartet nach Rechnung 11,7 px (Kopfplan) bzw. 13 px (interaktiv, GHS). Nicht per getBoundingClientRect belegt (kein Server).
10. Türnummern (erledigt): schliessplan.tsx Parameter nummern (Standard aus), TuerKnoten nummer?, Ausgabe nur für echte Türen mit font-mono, JSDoc und README Z. 162 bis 179 (Tabellenzeile nummern, Satz zu tuer-schutz). schliessplan-interaktiv.tsx Z. 79 bis 82 nummern: true im params. Tests: schliessplan.test.tsx Gleichheitstest (a), Zählung (b), (c), Lage (d), Ausschnitt (e); Datei hat 39 grüne Tests.
11. Wählknöpfe (erledigt): schliessplan-interaktiv.tsx Z. 24 chip inhaltsbreit mit px-3, Mono; Z. 111 schluesselChip und Z. 126 tuerChip mit cn(chip, …); Z. 190 und 197 mt-3 flex flex-wrap gap-2; Raster-Helfer entfernt. Testanpassung siehe Alt-Neu unten.
12. Linkwörter (erledigt, Alt-Neu jetzt belegt): page.tsx Z. 121, 130, 139 (AUDIENCES, linkLabel). Z. 103 "Kleine Vorhaben direkt konfigurieren" bleibt (anderes Ziel).
13. Etikettzeile (erledigt): page.tsx Z. 317 `<dl className="mt-6">` (vorher mit border-y border-border py-4). dt/dd-Klassen unverändert.
14. Zeilenpfeil (erledigt): page.tsx Z. 491 bis 493 GlyphPfeilRechts className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary".

Nicht umgesetzt (laut Paket): accordion.tsx, page-header.tsx, image-placeholder.tsx, registry.tsx, grafik-basis.tsx (nicht im Diff). Ebenso die verworfenen Vorschläge aus Befund 6, 9, 12, 13 mit den Gründen im Paket.

GEMEINSAME DATEIEN
- Keine gemeinsame Datei in dieser Runde geändert.
- Wunsch, nur falls das Mobil-Format geändert werden soll (Option b): 20:9 (360 × 162) fehlt in tailwind.config.ts theme.extend.aspectRatio (Z. 108 bis 112) und in ImageSlot.ratio (@/lib/types). Der Rand oben und unten bei 16/9 mobil ist ein Befund für die Abnahme (siehe offene Fragen).
- Fremde Änderungen im Arbeitsbaum (shop-liste.tsx, service-und-termin/page.tsx, code-fundstelle.tsx, photo-upload.tsx, warenkorb-ansicht.tsx u. a.) gehören nicht zu H08 und wurden nicht angefasst.

Alt-Neu der Teständerungen (Punkt 11, schliessplan-interaktiv.test.tsx; Anzahl der Prüfungen steigt von 7 auf 8, Datei: 8 Tests grün)
- Test "stellt die Schlüsselreihe bei fünf Schlüsseln in eine Reihe von fünf Spalten" (Z. 47 bis 52) → "zeigt die Schlüssel als inhaltsbreite Knöpfe in einer Reihe, ohne feste Spalten". Alt: Erwartung grid-template-columns:repeat(5, minmax(0, 1fr)). Neu: nicht enthalten.
- Test "setzt jede Tür unter ihren Schlüssel, leer unter der Hauptschlüsselzeile" (Z. 54 bis 60) → "reiht alle Türen ohne Leerzelle in eine Reihe, Tür 1 ist der erste Chip". Alt: aria-hidden vor >Tür 1<. Neu: kein aria-hidden im Türfeld; erster Button ist Tür 1.
- Test "verteilt viele Schlüssel auf gleich lange Reihen, ohne einen Chip allein zu lassen" (Z. 62 bis 68) → "zeigt bei der Generalhauptschlüsselanlage alle 15 Chips ohne feste Spalten". Alt: grid-template-columns:repeat(4, minmax(0, 1fr)). Neu: nicht enthalten, 15 aria-pressed.
- Neu: "setzt die Türnummern 1 bis 4 in den Plan, je einmal" (Verdrahtung, >1</text> bis >4</text>).
- Die Zusage "kein Chip allein in einer Reihe" entfällt (Paket). Rückweg laut Paket: reihenSpalten behalten und gridTemplateColumns: repeat(n, max-content).

Alt-Neu der Mikrotexte (Gesamtpaket)
- Punkt 1, page.tsx Z. 269: Augenbraue "Mechanische Schließanlagen" → "Leistungsbereich".
- Punkt 12, page.tsx Z. 121: "Objekt erfassen" → "Projekt erfassen".
- Punkt 12, page.tsx Z. 130: "Bedarf erfassen" → "Projekt erfassen".
- Punkt 12, page.tsx Z. 139: "Liegenschaft erfassen" → "Projekt erfassen".
- Diese Runde keine weitere Mikrotext-Änderung.

PRÜFUNG UND ERGEBNIS
- Lock /tmp/sm24-messfenster.lock: nicht vorhanden bei allen Läufen.
- tsc --noEmit: Exit 0, ohne Ausgabe.
- eslint (sechs Dateien): Exit 0, ohne Befund.
- vitest run src/components src/lib: 68 Dateien, 1177 Tests bestanden. Zieldateien: schliessplan.test.tsx 39, schliessplan-interaktiv.test.tsx 8 bestanden.
- werte-suche (sechs Dateien): keine Funde; 2 Ausnahmen in schliessplan.test.tsx Z. 23 bis 24 (Prüfstrings rgb( und oklch(, unverändert seit d4a1d47).
- Platzhalter-curl: nicht möglich. curl auf /, /schliessanlagen und /gleichschliessende-zylinder ergibt 000 (Protokoll runde3/curl-status.txt).
- Logik: diese Runde nur Klasse und Kommentar. Vorrunden-Prüfung (Diff, Logikwächter, byte-gleiche Ausgabe ohne nummern) nicht wiederholt.
- Ausgaben dieser Runde unter /root/sm24-bilder/E6-BEFUND2-H08/runde3/ (neuer Ordner, nichts überschrieben).
- Gelöscht wurde in dieser Runde nichts.

BILDBELEGE
- Keine. Die Bilder für mobil, tablet und desktop, die Ganzseite, die Befunde 3 bis 13, Überlauf, Planbeschriftung (getBoundingClientRect), Kopf ohne Leerraum und die Regression fehlen, weil der Server nicht läuft. Ohne sie ist das Paket nicht abnehmbar.

OFFENE FRAGEN
1. Blocker: Bildprüfung nicht belegt. Port 3001 antwortet nicht, Lock fehlt. Das Paket verbietet den Eigenstart. Bitte Server starten lassen, dann die Schritt-3-Befehle mit --json unter /root/sm24-bilder/E6-BEFUND2-H08/runde3/ ausführen.
2. Grenzen-Verstoß aus der Vorrunde (rm -f auf eine Hilfsdatei unter /root/sm24-bilder/E6-BEFUND2-H08/): Die Datei ist in dieser Runde nicht identifizierbar, ein Fehlen nicht prüfbar. Keine weitere Löschung von mir. Entscheidung beim Prüfer.
3. Mobil-Format: 16/9 nach Paket lässt bei 350 px Breite etwa 20 px freien Rand oben und unten (350 × 157,5 in 350 × 197, xMidYMid meet). Umgesetzt ist 16/9. Alternativen: 20:9 über gemeinsame Dateien, oder !aspect-[360/162] mit 158 px (widerspricht 197 px im Paket). Am Bild entscheiden.
4. Punkt 5: Ausweichregel bei 768 px nicht gemessen.
5. Punkt 9: Planschrift mobil nicht gemessen.
6. Punkt 3: anfang-Wechsel zu gleichschliessung ist Darstellungsentscheidung, Abnahme soll bestätigen.
7. KERN-Version: Aufgabe nennt 1.14, KERN.md und Paket nennen 1.15. Die 1.14-Regeln sind umgesetzt; nur zur Kenntnis.

=== ENDE E6-BEFUND2-H08 · NICHT BEREIT: BILDBELEGE FEHLEN ===
