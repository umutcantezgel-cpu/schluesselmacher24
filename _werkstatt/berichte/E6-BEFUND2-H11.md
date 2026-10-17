# E6-BEFUND2-H11 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Pflichtbelege fehlen: Port 3001 antwortet nicht (HTTP 000) und /tmp/sm24-messfenster.lock fehlt. Nicht ausgeführt sind bild.mjs für /kasse leer (mobil, tablet, desktop), gefuellt.mjs, das Akkordeon mobil, der Klick auf „Zahlungspflichtig bestellen“, der Platzhalter-curl und messung.mjs mit CLS-Vergleich gegen E5-b. Damit sind Befund 1, 7, 8, 9, 10 und 11 am Ergebnis nicht belegt. Die Mindesthöhen min-h-96 und sm:min-h-64 (kasse-formular.tsx Z. 332 und 344) sind ohne Bildmessung gesetzt. Ich habe keinen Codefehler gefunden. Den Server habe ich nicht selbst gestartet, weil das Paket es untersagt. Port 3000 läuft laut Auftrag mit einem älteren Build und taugt nicht als Beleg.
- **soll:** JS-Budget unbelegt und widersprüchlich: Der Paketkopf sagt „kein neues Client-JavaScript“, Punkt 8 importiert SchluesselGrafik in das 'use client'-Formular (kasse-formular.tsx Z. 30). K-011 (60 KB) ist nicht gemessen, ein Produktionsbuild fehlt. Entscheidung des Orchestrators nötig.
- **soll:** Layoutsprung im gefüllten Pfad: Ladekarte und Leerkarte tragen data-leerzustand und lg:col-span-8 (kasse-formular.tsx Z. 332). Dadurch steht im SSR und im Ladezustand die Seitenspalte „Rechtliche Hinweise“ (page.tsx Z. 97). Nach der Hydrierung mit gefülltem Korb verschwindet sie, das Formular wird 12-spaltig und das Band erscheint unten. Das ist im Paket so angelegt, aber nicht gemessen; das CLS-Risiko aus D-046 bleibt offen.
- **soll:** Bericht falsch zum Ladezustand: Der Baumeister schreibt, der Ladezustand zeige keine Einleitung (PRÜFUNG, Punkt 12, und OFFENE FRAGE 5). Tatsächlich steht die Einleitung als PageHeader-lead in page.tsx Z. 80 ohne Zustandsbezug und erscheint auch im Ladezustand, wie es die Orchestrator-Anpassung verlangt. Der Bericht muss korrigiert werden, die Bestätigungsfrage entfällt.
- **soll:** Einleitung nicht zustandsneutral: KERN.md Z. 163 verlangt für die Einleitung im Kopf von Warenkorb und Kasse „zustandsneutralen Wortlaut (Textvorschlag)“. Der Satz „Bitte geben Sie Ihre Kontakt- und Lieferdaten an. Danach sehen Sie …“ fordert im leeren Korb Daten, die nicht gebraucht werden. Der Vorschlag steht in _werkstatt/TEXTVORSCHLAEGE.md Z. 106, ist aber nicht eingetragen. Das Paket verbietet Textänderungen, daher ist eine Orchestrator-Entscheidung nötig.
- **soll:** Die beiden Leerkarten sind nicht gleich gebaut: Die Kasse nutzt CardBody „flex flex-col gap-6 sm:flex-row sm:items-center“ mit max-w-xl (kasse-formular.tsx Z. 345 und 349). H10 nutzt „gap-4 sm:gap-gutter“ und „min-w-0 flex-1“ (warenkorb-ansicht.tsx Z. 146). Die Orchestrator-Anpassung verlangt denselben Bau. Abstand und Breite der Zeichnung zum Text weichen ab. Am Bild zu prüfen.
- **hinweis:** Logik-Ausnahme noch nicht eingetragen: logikwaechter pruefen meldet genau einen Teil-B-Ausdruck in kasse-formular.tsx, params={{ typ: 'zylinder', rohling: true }} (Z. 347). Der Ausdruck ist als reiner Anzeige-Ausdruck mit Zweck gemeldet und passt zur Regel. Der Eintrag in _werkstatt/werkzeuge/logik-ausnahmen.json fehlt noch (Orchestrator). Derselbe Ausdruck steht in der fremden Datei warenkorb-ansicht.tsx (H10).

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H11 · Baumeister · Runde 3 (Nachlauf nach Ablehnung in Runde 2)

GEÄNDERTE DATEIEN
Die vier Schreibrechte-Dateien wurden im Vorlauf geändert und in diesem Lauf nicht verändert:
- src/app/(site)/kasse/page.tsx
- src/app/(site)/kasse/kasse-formular.tsx
- src/components/layout/summary-list.tsx
- src/components/layout/summary-list.test.tsx
Der Diff gegen d4a1d47 zeigt nur Änderungen in diesen vier Dateien.

WAS UND WARUM (Stand der Punkte, am Code geprüft)
- Punkt 1 (Übersicht dicht): erledigt, summary-list.tsx Z. 101 (Prop dicht), Z. 123 bis 150 (Flex-Zeile, dt font-medium, Zeile hervorheben font-semibold).
- Punkt 2 (dicht als erstes Attribut): erledigt, kasse-formular.tsx Z. 388 und 658.
- Punkt 3 (Werte text-small): erledigt, gefüllte Werte text-small text-foreground im dicht-Zweig.
- Punkt 4 (Mono für Prozent und Code): erledigt, ZAHLENTEIL_DICHT Z. 17 mit einer Fanggruppe; muster in MonoText und SchriftfeldWert. dt bleibt ZAHLENTEIL.
- Punkt 5 (Tests): erledigt, 5 neue Prüfungen, keine bestehende geändert (siehe PRÜFUNG).
- Punkt 6 (Einleitung in den Kopf): erledigt, page.tsx Z. 80 als lead, ohne leadClassName; kasse-formular.tsx enthält die Einleitung nicht mehr.
- Punkt 7 (Leerzustand 8/4 mit Seitenspalte): erledigt, Wrapper page.tsx Z. 75, Grid Z. 87, Seitenspalte Z. 97, Band Z. 108, Formular Z. 367, Karten Z. 319, 332, 344. Offen ist der Layoutwechsel nach dem Laden (siehe OFFENE FRAGEN).
- Punkt 8 (Rohling-Zeichnung): erledigt, kasse-formular.tsx Z. 346 bis 347 (aria-hidden, sm24-ruhig, w-40, title=\"\"); IconWarenkorb entfernt. Offen ist die JS-Frage (siehe OFFENE FRAGEN).
- Punkt 9 (Abschnittsnummern): erledigt, sm24-nummer in page.tsx Z. 99 und 110 und kasse-formular.tsx Z. 396, 505, 582; Zähler per CSS (globals.css Z. 232 bis 239).
- Punkt 10 (Zeilenpfeil nach KERN 1.14): erledigt, page.tsx Z. 48 bis 51 (muted in Ruhe, primary bei Hover und Fokus der Zeile, zeiger:-Verschiebung).
- Punkt 11 (Mindesthöhe): umgesetzt wie beschrieben (min-h-96 sm:min-h-64, identisch in Lade- und Leerkarte), aber der Bildwert und der CLS sind nicht belegt.
- Punkt 12 (Mikrotexte): keine Wortänderung; siehe PRÜFUNG.

GEMEINSAME DATEIEN
- Ausnahme Logikwächter: params={{ typ: 'zylinder', rohling: true }} in kasse-formular.tsx Z. 347. Zweck: Rohling-Zeichnung der Leerkarte, reine Anzeige mit konstanten Werten, kein Aufruf mit Wirkung. Der Eintrag in _werkstatt/werkzeuge/logik-ausnahmen.json liegt beim Orchestrator.
- Messung Generator (esbuild-Bündel, nur SchluesselGrafik, Ordner /root/sm24-bilder/E6-BEFUND2-H11/runde3/groesse/): ohne React 42.036 Byte minifiziert, 13.976 Byte gzip -9; mit React 43.747 Byte, 14.612 Byte gzip -9.
- Fremde Dateien mit Logikwächter-Abweichung (nicht von mir, nicht behoben, nur gemeldet): warenkorb-ansicht.tsx (H10-Datei, 7 Ausdrücke, darunter derselbe Rohling-Ausdruck) und gleichschliessende-zylinder/konfigurator/konfigurator.tsx (4 Ausdrücke).

PRÜFUNG UND ERGEBNIS
- Schreibrechte: nur die vier Dateien im Diff gegen d4a1d47; keine fremde Datei angefasst.
- tsc --noEmit: exit 0, keine Fehler.
- eslint für die vier Dateien: exit 0, keine Befunde.
- vitest run src/components src/lib: 69 Dateien, 1190 Tests grün. src/app/(site)/seitenstruktur.test.ts: 2 Tests grün.
- Teständerungen (Alt-Neu): summary-list.test.tsx nur Import-Zeile um ZAHLENTEIL_DICHT erweitert. Keine bestehende Prüfung geändert oder entfernt. Neu: 5 Prüfungen (a) dicht mit flex, ohne sm:col-span-5; (b) gefüllt text-foreground, offen text-foreground-muted, beide text-small; (c) 19 % und Code 0812 · 2 Stück als Mono-Spanne mit whitespace-nowrap; (d) monoTeile ohne Muster unverändert, mit Muster eine Spanne; (e) Vorher-Nachher ohne dicht byte-gleich zum Stand vor dem Paket.
- werte-suche (vier Dateien): 0 Funde, 0 Ausnahmen.
- Logikwächter: in kasse-formular.tsx genau ein Ausdruck (params), als Ausnahme gemeldet.
- Mikrotexte: in diesem Lauf keine Änderung. Gegenüber Runde 1 keine Wortänderung; 01 bis 03 sind CSS-Zähler mit gleicher Anzeige; Einleitung wortgleich in den Kopf verschoben; Ladezustand ohne Einleitung (bewusste Änderung laut Paket).
- Platzhalter per curl: nicht ausführbar, Port 3001 antwortet nicht.
- Bild-, Klick- und Messprüfung: nicht ausgeführt, weil Port 3001 nicht antwortet (HTTP 000 auf localhost und 127.0.0.1, 13:00 Uhr) und /tmp/sm24-messfenster.lock fehlt. Das Paket verlangt Melden statt Selbststart; ich habe den Server nicht gestartet.
- Gesamtergebnis: Code-Stand und Schnellprüfung sind in Ordnung. Das Paket ist nicht abnahmefähig, solange der Muss-Befund Beleg fehlt nicht durch Bilder, Klicks und messung.mjs belegt ist.
- Nichts committet, nichts gepusht, nichts gelöscht. Neue Hilfsdateien nur unter /root/sm24-bilder/E6-BEFUND2-H11/runde3/. Vorhandene Ordner (alt, groesse, runde2 und die Logs) blieben unverändert.

BILDBELEGE
Keine. Die Bildläufe konnten nicht ausgeführt werden (Port 3001 nicht erreichbar). Die vorhandenen Bilder der Sichtabnahme liegen unter /root/sm24-bilder/e5-b/ und wurden nicht ausgewertet.

OFFENE FRAGEN
1. MUSS, nicht in diesem Lauf behebbar: Beleg fehlt. Benötigt wird ein laufender Entwicklungsserver auf Port 3001 (oder die Freigabe, ihn zu starten). Danach offen: bild.mjs für /kasse leer (mobil, tablet, desktop), gefuellt.mjs (desktop 00 bis 03, tablet 00 bis 04, mobil 00 bis 06), Akkordeon mobil, Klick auf „Zahlungspflichtig bestellen“ ohne Pflichtangaben, Platzhalter-curl, messung.mjs für H11 mobil und desktop (CLS gegen E5-b). ABNAHME.md Z-08 nennt für H11 mobil CLS 0,104 vor dieser Runde.
2. SOLL, Entscheidung Orchestrator: Layoutwechsel nach dem Laden. Ladekarte und Leerkarte tragen data-leerzustand und lg:col-span-8. Der SSR-Stand zeigt daher die Seitenspalte ab lg; mit gefülltem Korb verschwindet sie nach der Hydrierung, das Formular wird 12-spaltig und das Band erscheint unten. Offene Frage 4 ist nicht entschieden. Optionen: (a) so belassen, CLS per messung.mjs entscheiden lassen; (b) data-leerzustand von der Ladekarte nehmen, dann verschiebt sich der Leerfall nach dem Laden. Nicht umgesetzt.
3. SOLL, Entscheidung Orchestrator: JS-Budget. Der Paketkopf sagt „kein neues Client-JavaScript“, Punkt 8 führt SchluesselGrafik in den Kassen-Chunk ein. Gemessen ist nur der Generator mit rund 14,0 KB gzip -9 ohne React. Die Summe der Bewegungscode-Teile gegen K-011 (60 KB) ist nicht gemessen; dafür braucht es einen Produktionsbuild, den ich nicht gestartet habe. Ob für die Kasse ein Zuwachs entsteht, hängt davon ab, ob der Chunk mit Startseite und Warenkorb geteilt wird.
4. Der Orchestrator trägt die Logikwächter-Ausnahme für params={{ typ: 'zylinder', rohling: true }} in logik-ausnahmen.json ein. Derselbe Ausdruck steht in warenkorb-ansicht.tsx (fremde Datei, H10).
5. Die Einleitung im Ladezustand fehlt jetzt; das ist die im Paket genannte bewusste Änderung. Bestätigung durch den Orchestrator erbeten.

=== ENDE E6-BEFUND2-H11 · BEREIT ZUR RÜCKGABE ===
