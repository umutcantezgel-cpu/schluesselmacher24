# E6-BEFUND2-H03 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 2 · Urteil letzte Runde: bestanden
- Abnahme durch den Orchestrator: siehe `_werkstatt/berichte/E6-BEFUND2-welle1-abnahme.md` (D-047).

## Befunde der letzten Prüfrunde
- **soll:** Punkt 2 (Keyless als Textzelle) und der Zellen-Teil von Punkt 1 (Array zellen, ol unter zellen.length) sind offen. Gate geprüft: in _werkstatt/ENTSCHEIDUNGEN.md fehlt der Aufhebungseintrag zu D-026 (letzter Eintrag D-045). Der Grund stimmt, daher kein muss. Keyless bleibt Infozeile unter den Zeichnungen (page.tsx Z. 382ff.). Nach Eintrag nachziehen.
- **soll:** B-21 (Baumeister-Frage 4): Im Einzelbild bei 375 ms sind Profilkonturen der ersten Zeichnung schon sichtbar, die blauen Profile erst ab 750 ms. Die Soll-Regel „Profile erst nach allen Körpern“ ist am Einzelbild nicht sicher belegbar. Ursache läge im gemeinsamen Generator, nicht in der Seite. Melden.
- **soll:** Kopfgrafik bei 1024 px: Grid und Schlüssel reichen bis an den rechten Viewport-Rand ohne Randabstand (/root/sm24-bilder/E6-BEFUND2-H03-pruefung-r2/b1024-kopf-check.png). Seitliches Scrollen gibt es nicht (scrollWidth 1024 = clientWidth). Visuell knapp, Baumeister-Frage 3 an den Orchestrator.
- **hinweis:** Tablet 768 px: drei Zeichnungen je etwa 224 px nebeneinander (md:grid-cols-3). Das entspricht der Tabelle des Pakets für drei Zellen, die Beschriftungen bleiben lesbar. Gegenüber der 2x2-Erwartung für vier Zellen kleiner; nach dem Keyless-Gate neu bewerten.
- **hinweis:** Anlernen-Wert „vor Ort“ steht in text-title-sm Inter ohne font-mono (page.tsx Z. ~283). Der Paketwortlaut verlangt Mono. KERN 1.14 (Mono nur für Zahlen) stützt die Abweichung des Baumeisters. Akzeptiert, im Bericht als Abweichung zu nennen.
- **soll:** Fremdbefund site-header (nicht im Paket): bei 1024 px ist der Knopf „Termin starten“ rechts abgeschnitten (rechte Kante 1075 px, gemessen). Betrifft laut Baumeister auch /, /autoschluessel. An den Orchestrator melden.
- **hinweis:** Fremdbefund info-tip (gemeinsamer Baustein): InfoTip-Panel bei 390 px über den Rand (Baumeister: x 137–457 und 278–598). Von mir nicht erneut gemessen, da der Button-Selektor keinen Treffer lieferte. Die Baumeister-Bilder b390-infotip-0/1.png sind nicht geprüft.
- **hinweis:** Logikwächter: page.tsx steht nicht in GESCHUETZTE, pruefen meldet KEIN EINTRAG (exit 3, nicht anwendbar). Manueller Diff gegen 69d8213: Logik unverändert. Geändert nur erlaubte Teile (angaben-Typ string[], Importe, SPALTEN, Escape  , Klassen, ratio 16/9, max-w-md).
- **hinweis:** Vitest run src/components src/lib: 67 Dateien, 1159 Tests grün (Baumeister nannte 1157). Die Abweichung ist plausibel durch parallel hinzugekommene Tests anderer Agenten (ablauf.test.tsx im git status). Kein Fehler dieses Pakets.
- **hinweis:** Zeilenpfeil-Gruppenregel (Punkt 10) korrekt: Link mit group, Pfeil text-foreground-muted, zeiger:group-hover:translate-x-1, group-hover und group-focus-visible text-primary, duration-quick und ease-standard vorhanden. Reduzierte Bewegung: 0 laufende Animationen, 0 Befunde.
- **hinweis:** Mobiles Ganzseitenbild: die fixierte Bottom-Navigation überdeckt in der Aufnahme die Zeile Schlüsselarten. Das ist ein Capture-Artefakt, kein Befund der Seite. Die Einzelansicht der Mobilseite ist sauber (m-strip-a.png).

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H03 · Runde 2 · Baumeister · Modellseite VW Golf

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx: Zeile 204, das literale Zeichen U+00A0 vor „Tage“ ist durch den Escape   ersetzt. Sichtbar gleich. Vorher-Stand: /root/sm24-bilder/E6-BEFUND2-H03/page-vorher.tsx. Sonst keine Änderung (git diff: 1 Zeile).

WAS UND WARUM (je Punkt aus „Umsetzen“)
1. Komposition Befund 1 (Zeichnungen, Spalten): In Runde 1 erledigt, unverändert übernommen. Ohne Keyless-Zelle stehen drei Zeichnungen (Spalten md:grid-cols-3). Keyless-Teil: NICHT umgesetzt, siehe Punkt 2.
2. Details Befund 11 (Keyless als Textzelle): NICHT umgesetzt. Gate: Der Aufhebungseintrag zu D-026 fehlt in _werkstatt/ENTSCHEIDUNGEN.md (letzter Eintrag D-045). Die Datei liegt nicht in meinen Schreibrechten. Keyless bleibt Infozeile unter der Bildunterschrift. Die Reihe zeigt drei Zeichnungen statt 2 × 2.
3. Grafik Befund 8 (Striche skalieren, max-w-md): unverändert übernommen, vom Prüfer geprüft, nicht erneut geändert.
4. Komposition Befund 3 (Kopf 16:9, Kasten weg): unverändert übernommen. Beim Golf bleibt Leerraster oben und unten (fest viewBox, nur der Generator kann das lösen). Gemessen: kein Scrollen bei 1024 und 1280 px. Die Grafik reicht bei 1024 px bis an den rechten Rand (offene Frage).
5. Typografie Befund 5, 6, 12 (Schriftfeld statt Chips): unverändert übernommen. Labels einzeilig (dt 24 px). Keine Änderung nötig.
6. Komposition Befund 2 (Abschnitt 01, 5/7): unverändert übernommen.
7. Typografie Befund 4 (Angaben als Liste): unverändert übernommen. Die Liste steht untereinander.
8. Details Befund 13 (etwa 7 / Tage): NUN ERLEDIGT. Literal U+00A0 durch   ersetzt (Zeile 204). Der Wortlaut bleibt.
9. Bewegung Befund 7: kein Code. Einzelbilder 0 bis 1500 ms, siehe Bilder.
10. Details Gruppenregel Zeilenpfeil: unverändert übernommen (Runde 1).

Nicht umgesetzt (mit Grund, wie im Paket): Befund 9 (Bemaßungsticks, Generator), Befund 10 (Kopien, Generator), Befund 12 Variante ⓘ im Chip, Befund 3 wörtlich (viewBox kürzen), Befund 8 wörtlich (max-w-[480px]).

Muss-Befund: ERLEDIGT (Z. 204, Escape).
Soll-Befunde: Punkt 2 und Keyless-Teil von Punkt 1 OFFEN (Gate, Orchestrator). Die Fremdbefunde unten sind gemeldet, nicht behoben.

GEMEINSAME DATEIEN
- Fremdbefund, site-header (src/components/layout/site-header.tsx), nicht in meinen Rechten: Bei 1024 px ragt der Knopf „Termin starten“ über den Rand (rechte Kante 1075 px). Gleich auf /, /autoschluessel und dieser Seite. Kein horizontales Scrollen der Seite (scrollWidth 1024). Bild: /root/sm24-bilder/E6-BEFUND2-H03/runde2/b1024-oben.png
- Fremdbefund, info-tip.tsx (gemeinsamer Baustein, nicht in meinen Rechten): geöffnetes InfoTip-Panel bei 390 px. Panel „Schlüsselarten“ x 137 bis 457 px, Panel „Anlernen“ x 278 bis 598 px. Über den rechten Rand. Bilder: /root/sm24-bilder/E6-BEFUND2-H03/runde2/b390-infotip-0.png und b390-infotip-1.png
- ENTSCHEIDUNGEN.md: Aufhebungseintrag zu D-026 fehlt (Gate für Punkt 2).

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0, keine Fehler (/root/sm24-bilder/E6-BEFUND2-H03/runde2/tsc.txt).
- eslint (Seite): Exit 0, keine Befunde (…/runde2/eslint.txt).
- vitest run src/components src/lib: 67 Dateien, 1157 Tests grün (…/runde2/vitest-libs.txt). Keine Tests neben der Seite.
- werte-suche: 0 Funde, 0 Ausnahmen (…/runde2/werte.json).
- Sichtbare Platzhalter: 0 auf Golf, Polo, 3er, Yaris, Kangoo.
- Logik unverändert: generateStaticParams, generateMetadata, Daten, assistantHref, detailFelder, Ableitung gezeichnet/hinweise, Schwelle > 3, Texte mit Inhalt.
- Messung Golf (1024, 1280, 390): kein horizontales Scrollen, Schriftfeld-Labels einzeilig, Termin-Knopf 1248 px bei 1280 px (in Ordnung).
- Messung Modelle (390, 768, 1440): kein Überlauf. Polo 3 Zellen; 3er und Kangoo 2 Zellen; Yaris 4 Zellen mit Leiste (snap-x, tabindex 0) auf dem Telefon.
- Bewegung: 5 Einzelbilder Schlüsselarten-Reihe (0 bis 1500 ms), 5 Einzelbilder Kopfgrafik (0 bis 1510 ms). Reduzierte Bewegung: 0 laufende Animationen, 0 Befunde.
- Vergleich mit der Sichtabnahme (/root/sm24-bilder/e5-b/H03-modell-golf__desktop__01.jpg): Datensatz nicht mehr breit, Arten untereinander, Schlüsselarten ohne Kasten. Befunde 1, 4, 6 sichtbar behoben, soweit ohne Keyless möglich.
- Folgen der drei Zellen: Bei 768 px stehen drei Zeichnungen nebeneinander, je etwa 224 px (der Paket-Entwurf rechnete mit 2 × 2 bei vier Zellen). Bei 1440 px etwa 376 px je Zeichnung, wie erwartet.

BILDBELEGE (alle unter /root/sm24-bilder/E6-BEFUND2-H03/runde2/)
- autoschluessel-marken-volkswagen-golf__desktop__ganz.jpg, __mobil__ganz.jpg, __tablet__ganz.jpg
- reduziert__desktop__ganz.jpg (nur Größenvergleich gemacht; Bewegungsprüfung über bewegung-reduziert.json)
- b1024-oben.png, b1280-oben.png, b390-oben.png, b390-infotip-0.png, b390-infotip-1.png
- autoschluessel-marken-volkswagen-golf__desktop__schluesselarten-detail-ol__0..4.jpg, __header-svg-role-img__0..4.jpg
- Messprotokolle: mess-h03.json, mess-modelle.json, bewegung-*.json, bild-*.json, werte.json
- Alte Ausgaben (Runde 1) bleiben in /root/sm24-bilder/E6-BEFUND2-H03/ (nichts gelöscht). Neue Ausgaben in /root/sm24-bilder/E6-BEFUND2-H03/runde2/.

OFFENE FRAGEN
1. Gate für Punkt 2 (Keyless als Textzelle): Orchestrator trägt den Aufhebungseintrag zu D-026 in ENTSCHEIDUNGEN.md ein; danach baue ich den Keyless-Teil (4 Zellen, md:grid-cols-2 lg:grid-cols-4).
2. Drei Zellen bei 768 px (je etwa 224 px): Soll der Orchestrator das nach dem Keyless-Gate neu bewerten?
3. Kopf 1024 px: Grafik reicht bis an den rechten Rand ohne Rand. Akzeptiert oder anpassen?
4. Bewegung B-21: bei 375 ms stehen Körper der dritten Zeichnung, Profile noch nicht. Abweichung von „Profile erst nach allen Körpern“ melden, keine Änderung.
5. Fremdbefunde site-header (Termin-Knopf bei 1024 px) und info-tip (InfoTip bei 390 px) an den Orchestrator.

=== ENDE E6-BEFUND2-H03 · BEREIT ZUR RÜCKGABE ===
