# E6-BEFUND2-U-STANDORTE · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Bildbelege fehlen (Paket Schnellprüfung, Punkte 5 und Bilder): Port 3001 antwortet nicht (curl 000 auf localhost, 127.0.0.1, [::1]); ps zeigt nur next start auf Port 3000 (älterer Build, nicht als Beleg). Fehlend: 9 Bilder berlin, frankfurt-am-main, muenchen je mobil, tablet, desktop; Sichtabgleich mit /root/sm24-bilder/e5-b/uebrige/standorte-berlin__*; curl-Platzhalterzählung für sechs Stadtseiten. Nicht selbst gestartet (Paket: melden, nicht starten). Ohne diese Belege ist das Paket nicht bestanden.
- **hinweis:** Abweichung vom Paketwortlaut: dd in page.tsx Z. 79–84 enthält zusätzlich whitespace-nowrap (Paket Umsetzen 4 nennt nur font-mono tabular-nums). Sachlich vertretbar (hält „40 km“ zusammen), kein Logikeingriff; im Bericht nicht als Abweichung genannt.
- **hinweis:** Geometrie nur nachgerechnet, nicht am Bild: Spitze (260,43; 67,51) korrekt; Pfeilrichtung −40° passt zur Maßlinie; „r 40 km“ bei x 268–323, y ca. 50–62 liegt außerhalb des Kreises (Kreis bei y 62 endet bei x ca. 253,5), Abstand zur Spitze ca. 6 Einheiten; „Frankfurt am Main“ bei y 150–160 liegt zwischen x 114 und 246, innerhalb des Kreises (x 76–284). Am Bild offen.
- **hinweis:** Mobile Lesbarkeit offen: SCHRIFT 13 auf 360 Einheiten ergibt ca. 12,6 px bei 350 px Inhaltsbreite und ca. 11,6 px bei 320 px. Am Telefon-Bild zu prüfen (Paket-Risiko, KERN 1.8).
- **hinweis:** Versionsangabe im Auftrag: Der Auftrag nennt KERN 1.14; _werkstatt/KERN.md endet mit 1.15 (Änderungseintrag Z. 324, B-26 in K-007 Z. 214, Stufen stimmen mit einsatzradius.tsx überein). Befund nur die Versionsangabe, kein Inhaltsfehler.
- **hinweis:** Datenwert „40 km“ (content/cities.json, Feld Einsatzradius) hat ein normales Leerzeichen. Durch whitespace-nowrap im Schriftfeld nicht umbrochen; Inhalt nicht geändert.
- **hinweis:** Vitest-Gesamtzahl 1190 (69 Dateien) enthält die 8 neuen Tests aus einsatzradius.test.tsx (im Lauf bestätigt). Gegen den Vorlauf nicht belegbar, weil kein früherer Zählstand im Repo steht; die Zahl sinkt nicht gegen den Bericht.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-U-STANDORTE, Runde 3 (Antwort auf die Ablehnung der Runde 2)

GEÄNDERTE DATEIEN
In dieser Runde habe ich keine Datei geändert. Die drei Schreibrechte-Dateien habe ich vollständig gegen das Paket geprüft:
- src/app/(site)/standorte/[city]/page.tsx (175 Zeilen; Diff zu d4a1d47: 94 eingefügt, 97 entfernt, wie im Prüfvermerk)
- src/components/visual/einsatzradius.tsx (neu, 112 Zeilen)
- src/components/visual/einsatzradius.test.tsx (neu, 74 Zeilen)
Der Muss-Befund war nur die fehlende Bild- und curl-Belege. Ein Codefehler lag nicht vor.

WAS UND WARUM (Punkte aus „Umsetzen“, Stand geprüft)
1. Grafik 1, erledigt: einsatzradius.tsx Z. 44–112 (EinsatzradiusZeichnung, ohne 'use client', ohne Hooks, kein Generator, nicht in der Registry). page.tsx Z. 14 Import, Z. 109 `visual={<EinsatzradiusZeichnung ort={city.city} radiusKm={city.onSiteRadiusKm} />}`. ImagePlaceholder ist aus page.tsx entfernt. Geometrie nachgerechnet: Spitze (180 + 105·cos40°, 135 − 105·sin40°) = (260,43; 67,51). Kreis-Pfad, Mittellinie M60 135H300, Pfeilwinkel −40 und Klassen wie im Paket. Mittelpunktmarke (circle r=4) nach der Maßlinie (Z. 82).
2. Grafik 2, erledigt: Die Zeichnung ist ein reines svg aus GrafikRahmen (grafik-basis Z. 254 ff.: nur viewBox, role, title, keine border, rounded oder shadow). Keine Hülle in page.tsx.
3. Bewegung 1, erledigt: einsatzradius.tsx Z. 36–37 (KREIS_DAUER 0,6; MASS_DAUER 0,28), Z. 66 Kreis sm24-draw ab 0,1 s; Z. 76 Maßlinie ab 0,7 s; Z. 78 Pfeilspitze sm24-pop ab 0,95 s; Z. 82 Marke sm24-pop ab 0 s; Z. 91 Ort sm24-fade ab 0,2 s; Z. 105 „r … km“ sm24-pop ab 0,95 s. Ende 1,55 s (≤ 1,6 s). Reduzierte Variante: Klassen wirken nur unter prefers-reduced-motion: no-preference (globals.css Z. 448), sonst sofort vollständig. Kein InView, kein neues Client-JavaScript.
4. Typografie 1, erledigt: page.tsx Z. 50 Filter `fact.value !== city.state` mit Kommentar; Z. 63–90 Schriftfeld (dl grid-cols-2 sm:grid-cols-4, Feldklassen Z. 69–74 wörtlich wie im Paket, dd Z. 79–84 mit font-mono nur bei Ziffern).
5. Komposition 1, erledigt: Der erste Section (Abschnitt 01) ist entfernt. Einleitung ist ein p in schriftfeld (Z. 61), schriftfeld wird nur bei Einleitung oder Angaben übergeben (Z. 58–59). Bereiche-Abschnitt nummer="01" (Z. 118).
6. Komposition 2, erledigt: Z. 115 grid lg:grid-cols-12; SectionHeading Z. 116–121 mit lg:col-span-4 lg:sticky lg:top-28 lg:self-start; Liste ul.border-t (Z. 125), li.border-b (Z. 127) einspaltig; Etikett „Weiterlesen“ (Z. 153), Linkliste mt-3 border-t (Z. 154).
7. Details 1, erledigt: Bereichszeile Pfeil Z. 142–145 (text-foreground-muted, group-hover:text-area-strong, group-focus-visible:text-area-strong); Titel group-hover:text-area-strong Z. 135; Linkzeile Pfeil Z. 162–165 (group-hover:text-primary); Linktext hover:text-primary Z. 159. Kein transition-colors am Pfeil.
8. Typografie KERN 1.14, erledigt:   in page.tsx Z. 102 (Einleitung, Wortlaut sonst gleich; alt: „… etwa X km. Bestellungen …“), im Titel der Zeichnung (einsatzradius.tsx Z. 50) und im Radiustext (Z. 107).
9. Prüfung, erledigt: einsatzradius.test.tsx mit 8 Tests (Titel und role=img; r 40 km und Titel; 12,5 → „12,5“; kein id; NaN, −5, 0, Infinity ohne km und ohne Maßlinie mit Titel „Einsatzgebiet Berlin“; leerer Ort ohne Orts-Text und ohne Leerzeichen am Titelende; Determinismus; Kreispfad sm24-draw und pathLength="1"; Ort höchstens 20 Zeichen). Alle 8 grün.
10. Mikrotexte, erledigt. Alt-Neu-Liste:
- Augenbraue „02 Leistungen“ → „01 Leistungen“ (alt nummer="02", neu page.tsx Z. 118).
- Augenbraue „01 Einsatzgebiet“ und Titel „{Stadt} und Umgebung“ entfallen mit Abschnitt 01 (alt Z. 87–88).
- Feld „Bundesland“ entfällt in der Anzeige, Daten bleiben (page.tsx Z. 50).
- Neu: Etikett „Weiterlesen“ (Z. 153).
- Alt-Text Zeichnung „Einsatzgebiet {Stadt}: Schlüssel- und Schließtechnik vor Ort“ → „Einsatzradius von etwa {km} km um {Stadt}“, ohne Radius „Einsatzgebiet {Stadt}“ (einsatzradius.tsx Z. 50–51).
- Neu in der Zeichnung: „r {km} km“ und der Ortsname.
- Teständerungen: keine. Der neue Test ist additiv.

Nicht umgesetzt, wie im Paket begründet: Farbe und Bild, Variante Linkzeilen in freie Zelle, Einleitung ohne Kürzung, Registry und Generatoren unberührt, PageHeader und Section unverändert, Platzhalterfilter aus R1 unverändert, Kopfknopf und Knopfziel unverändert, JSON-LD, Metadaten und generateStaticParams unverändert.

GEMEINSAME DATEIEN
Keine geändert. Keine Werte ohne Token gefunden (werte-suche 0). Die SVG-Klassen existieren im Farbsystem (tailwind.config.ts: area, area-strong, border-strong, foreground-muted).

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0, keine Ausgabe.
- eslint für die drei Dateien: Exit 0, keine Befunde.
- vitest src/components src/lib: 69 Dateien, 1190 Tests grün (Vorlauf Runde 2: 1190, nicht gesunken); einsatzradius.test.tsx 8 grün.
- vitest src/app/(site)/standorte und seitenstruktur.test.ts: 2 grün.
- werte-suche für die drei Dateien: 0 Funde, 0 Ausnahmen.
- Lock-Datei nicht vorhanden; alle Prüfungen liefen ohne Sperre.
- Port 3001: HTTP 000 (dreimal geprüft), kein Listener gefunden. Gemäß Paket („falls nicht: melden, nicht selbst starten“) habe ich den Server nicht gestartet. Port 3000 antwortet (200), ist aber ein älterer Build und wurde nicht als Beleg benutzt.
- Nicht ausgeführt, weil der Server fehlt: Bild-Werkzeug (bild.mjs) für mobil, tablet, desktop; curl-Platzhalterzählung für die sechs Stadtseiten.
- Statische Vorprüfung (kein Ersatz für die Messung): Platzhalter in den Daten nur in localIntro (alle sechs Städte) und in zwei localFacts je Stadt; alle werden durch alsFakt ausgeblendet. seo.title und seo.description enthalten keine Platzhalter.
Ergebnis: Codeprüfung grün. Die Pflichtbelege fehlen; das Paket ist nicht bestanden.

BILDBELEGE
Keine. Grund: Port 3001 ohne Antwort. Fehlend: 9 Bilder (berlin, frankfurt-am-main, muenchen je mobil/tablet/desktop), Vergleich mit /root/sm24-bilder/e5-b/uebrige/standorte-berlin__* (vorhanden), curl-Zählung für sechs Stadtseiten. Der Orchestrator muss den Server auf Port 3001 starten; danach können diese Schritte nachgeholt werden.

Hilfsdateien: nur unter /root/sm24-bilder/E6-BEFUND2-U-STANDORTE/runde3/ angelegt (tsc.txt, eslint.txt, vitest-komp-lib.txt, vitest-standorte.txt, werte.json, werte.txt). Keine Datei gelöscht, nichts committet, nichts gepusht.

OFFENE FRAGEN
1. Port 3001 starten lassen, dann Bild- und curl-Schritte nachholen (siehe oben).
2. KERN-Version: Auftrag nennt 1.14, KERN.md und Paketkopf nennen 1.15. Bitte bestätigen.
3. Mobile Lesbarkeit (SCHRIFT 13 auf 360 Einheiten) und die Lage von „Frankfurt am Main“ im Kreis sind erst am Bild prüfbar.

=== ENDE E6-BEFUND2-U-STANDORTE · BLOCKIERT: BILDBELEGE FEHLEN (PORT 3001) ===
