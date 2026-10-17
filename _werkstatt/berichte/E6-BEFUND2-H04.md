# E6-BEFUND2-H04 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Pflichtbelege fehlen (Umgebung, kein Codefehler): Port 3001 ist nicht erreichbar (curl 000, kein Listener; nur ein 'next start -p 3000' mit altem Build). Nicht belegt sind Schrittbild 13 mit 390 px und scrollWidth 390 (Punkt 8), Markenraster im Desktop-Bild, Schritt 5 Zeichnung ohne InfoTip-Überdeckung, Schritt 8 Fotovorlagen 16:9, Schritt 10 PLZ-Fehlerzustand bei 390 px sowie der Vergleich der Schritte 11 bis 13 mit den e5-b-Bildern. Nachholen nach Serverstart in neuem Ordner. Gestartet habe ich nichts.
- **soll:** Befund 8 der Sichtabnahme verlangt die Zeichnung als Band über die Kartenbreite. Umgesetzt ist eine feste Breite von 96 px (option-card.tsx, Klasse 'block w-24' bei bildLage oben). Das Paket nennt 96 x 54 px ohne Begründung der Abweichung. Im Bild prüfen, ob die Schlüsselart-Zeichnung mobil lesbar ist.
- **hinweis:** Befund 9 (Fotovorlagen 5/7 ab sm, mobil max-h-40) ist nicht umgesetzt. Die Begründung im Paket stimmt: photo-upload.tsx steht unter dem Logikwächter und wird von sechs Dateien genutzt. Ersatz ist das 16:9-Format für drei Vorlagen in optionen.ts; die mobile Höhe bleibt im Bild zu prüfen.
- **hinweis:** Befund 6 (Umbruch 'Mercedes-/Benz' in der Markenkarte) bleibt offen. Die Begründung im Paket (gemeinsame OptionCard, kein Schreibrecht) stimmt.
- **hinweis:** Modellzähler nutzt whitespace-nowrap statt geschütztem Leerzeichen (assistent.tsx Z. 858). Das ist im Paket als benannte Abweichung von K-006 festgelegt und in logik-ausnahmen.json Z. 116 bis 118 eingetragen. Kein Befund.
- **hinweis:** KERN-Version: Die Aufgabe nennt 1.14, Paket und KERN.md (Kopf Z. 1, Änderungsliste Z. 324) nennen 1.15. Geprüft wurde gegen 1.15; am Code ergibt sich daraus kein Befund.
- **hinweis:** Fremde Abweichungen, nicht bewertet: logikwaechter pruefen meldet warenkorb-ansicht.tsx und gleichschliessende-zylinder/konfigurator/konfigurator.tsx als ABWEICHEND (Exit 3). Im Arbeitsbaum geändert sind außerdem tuer-und-schliesstechnik/page.tsx und warenkorb-ansicht.tsx.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H04 · Baumeister · Bericht Runde 3

GEÄNDERTE DATEIEN
Keine. Die fünf Schreibrecht-Dateien enthalten die Umsetzungen der Punkte 1 bis 13 bereits im Stand HEAD 6e4981c. Der Diff gegen d4a1d47 zeigt 113 Zeilen ein und 88 aus, wie vom Prüfer angegeben.

WAS UND WARUM
1. Hinweiszeile-Muster: erledigt in assistent.tsx (Schritt 11 Prüfung vor der Ausführung, Schritt 12 Wofür die Anzahlung steht), preis-anzeige.tsx (Hinweis zu Ihrem Fall) und termin-auswahl.tsx (Frühester Termin). Keine Rahmen, keine Fläche, keine Leiste.
2. Markenraster lg:grid-cols-3 und raster="seite" am FlowShell: erledigt (assistent.tsx Z. 842 und 849).
3. Schritt 11 Grundlage: Card variant="outline" mit rounded-none border-x-0, CardBody px-0 md:px-0, Mikrotext-Etikett "Grundlage". Ausdrücke unverändert: erledigt.
4. Schritt 11 Prüfung vor der Ausführung als Hinweiszeile mit GlyphWaage: erledigt.
5. preis-anzeige.tsx Hinweis zu Ihrem Fall als Hinweiszeile mit GlyphInfo, Alert-Import entfernt: erledigt.
6. Schritt 12 Wofür die Anzahlung steht als Hinweiszeile mit GlyphInfo. Die Warnung "Online-Zahlung ist noch nicht eingerichtet" bleibt Alert tone="warning": erledigt.
7. Schritt 13 termin-auswahl.tsx in der vorgeschriebenen Reihenfolge, Frühester Termin als Hinweiszeile mit   vor "Tagen": erledigt. Die 6 Tests bleiben grün.
8. 392 px statt 390 px: nur Prüfung. Messung offen, siehe unten.
9. Typografie 5: Label "Jahr" statt "Baujahr beziehungsweise Jahr der Erstzulassung" (Mikrotext, Alt-Neu hier): erledigt.
10. Typografie 6: Modellzähler mit whitespace-nowrap font-mono tabular-nums (Mikrotext: Alt "n Modelle hinterlegt", Neu "n Modelle"): erledigt, Form entspricht der Ausnahme.
11. Grafik 8 Schlüsselart: grid gap-2 sm:grid-cols-2 und bildLage="oben": erledigt. Im Bild offen, ob das InfoTip die Zeichnung überdeckt.
12. Grafik 9 Fotovorlagen: vorderseite, rueckseite, detail in optionen.ts auf 16/9, bart bleibt 4/3: erledigt.
13. Details 12 PLZ und Ort: Hülle grid grid-cols-3 gap-4 sm:col-span-2, PLZ ohne className, Ort col-span-2: erledigt. Die Breitenfrage steht im Soll-Punkt offen.
Nicht umsetzen laut Paket: unverändert, insbesondere flow-shell.tsx, option-card.tsx, photo-upload.tsx, globals.css.

GEMEINSAME DATEIEN
- Ausnahme Logikwächter, bereits in logik-ausnahmen.json eingetragen (nicht neu): `{entry.models.length} Modelle` (Modellzähler, E4-BAUMEISTER-16) und `bild={<SchluesselartZeichnung art={kind} />}` (E5-BEFUND-H04).
- Der Wächter meldet assistent.tsx als gleich, gegen Protokoll und gegen d4a1d47.
- Fremde Abweichungen, nicht von mir: warenkorb-ansicht.tsx und gleichschliessende-zylinder/konfigurator/konfigurator.tsx (jeweils ABWEICHEND, Teil B). Zusätzlich ist tuer-und-schliesstechnik/page.tsx im Arbeitsbaum geändert. Nichts davon angefasst.

PRÜFUNG UND ERGEBNIS
- Lock /tmp/sm24-messfenster.lock: nicht vorhanden.
- Port 3001: curl 000. Der Server läuft nicht, das Paket verbietet den Start durch mich. Port 3000 hat nur den alten Build und ist nicht maßgeblich. Gestartet habe ich nichts.
- tsc --noEmit: Exit 0, keine Ausgabe.
- eslint auf die fünf Dateien: Exit 0, keine Ausgabe.
- vitest run src/components src/lib: 67 Dateien, 1163 Tests grün.
- werte-suche: keine Funde.
- logikwaechter pruefen: assistent.tsx gleich (Basis b49fe04 und d4a1d47), jeweils mit den zwei Ausnahmen.
- Platzhalter-Grep im Quelltext: keine Treffer. Die curl-Prüfung auf Port 3001 ist nicht möglich.
- Bildbelege dieser Runde: keine. Die Pflichtbelege sind offen (OFFENE FRAGEN 1).

BILDBELEGE
Keine neuen Bilder. Ältere Ansichten aus dem Lauf 10:26 bis 10:28 liegen im Paketordner (siehe Feld bilder). Sie sind keine Belege dieser Runde. Grobe Sicht: schritte/05 mobil zeigt die Schlüsselart-Karten einspaltig mit der Zeichnung über dem Titel. schritte/10 mobil zeigt PLZ und Ort in einer Zeile, die PLZ-Spalte ist schmal, und "Land" liegt in der Aufnahme teils unter der klebenden Leiste. Schrittbild 13 ist 390 px breit (JPEG 390x3648). Im älteren messung/lauf.log steht für "Termin auswählen" scrollWidth 390. Ein Bild des PLZ-Fehlerzustands gibt es nicht.

OFFENE FRAGEN
1. Pflichtbelege fehlen (siehe Feld offene_fragen). Ursache: Port 3001 läuft nicht, der Start ist mir laut Paket untersagt. Nachholen nach einem Serverstart in einem neuen Ordner.
2. Soll PLZ-Fehlermeldung mobil: nicht geändert, weil die Spaltenaufteilung eine Entscheidung des Orchestrators ist. Berechnet bei 350 px: Ist 1:2 PLZ etwa 106 px, Text etwa 84 px; grid-cols-5 PLZ col-span-2 etwa 130 px, Text etwa 108 px; 1:1 PLZ etwa 167 px, Text etwa 145 px. Zeilenzahlen nicht gemessen. Vorschlag: nach dem Serverlauf im Bild entscheiden.
3. KERN-Version: Aufgabe nennt 1.14, Paket und KERN.md nennen 1.15. Ich habe mich an 1.15 gehalten.
4. Altbestand im Paketordner: nicht gelöscht, nicht überschrieben, nicht neu erzeugt. Zeitlich nach der letzten Änderung der fünf Dateien, aber nicht in dieser Sitzung erzeugt. Entscheidung beim Prüfer.

=== ENDE E6-BEFUND2-H04 · RÜCKGABE MIT OFFENEN BILDBELEGEN ===
