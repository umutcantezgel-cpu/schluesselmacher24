# E5-BEFUND-H05 · Bericht und Abnahme

2 Prüfrunde(n), Prüfurteil: bestanden. Abnahme durch den Orchestrator:

- **Bilder (eigene, Port 3001):** Kopf 7/5 mit der Fundstellen-Zeichnung ohne Rahmen, Bereichs-Icon an der Augenbraue; Liste als Haarlinien-Zeilen mit Mono-Kennung und rechtsbündigem Preis.
- **Nacharbeit:** Codeformat ab `lg` vier statt drei Spalten (keine zweizeiligen Formate mehr), Preis ab `lg` zwei Spalten; Pfeil nach B-06 (`zeiger:group-hover:translate-x-1`, `duration-quick` statt 2 px und `duration-base`); Platzhalter der Suche „Anwendung, Typ oder Hersteller“ (mobil nicht mehr abgeschnitten, Mikrotext).
- **Entschieden:** Die Reiter der Code-Fundstelle bleiben auf der Produktseite (H06), wo die Codelinie feststeht; die Übersicht zeigt die ruhige Zeichnung (D-040). Badge nur mit Zahl, „aktiv“ für Screenreader: bestätigt. Drei Preiszeilen am Tablet: bestätigt.

## Prüfurteil

- **soll:** Die Fundstellen-Auswahl ist ohne Freigabe entfallen. page.tsx zeigt nur noch die Schlüsselkopf-Zeichnung (CodeFundstelleGrafik, ort schluesselkopf). Sicherungskarte und Zylinderstirn sind auf der Seite nicht mehr erreichbar. Die Entscheidung des Orchestrators erlaubte den Generator, hat aber den Verlust der Auswahl nicht entschieden. Offene Frage an den Orchestrator: Reiter wieder aufnehmen oder fest lassen.
- **hinweis:** Alt-Neu-Angaben des Berichts stimmen nicht mit dem Render überein. Die Augenbraue zeigt „01 Codelinien“ ohne „·“. Der Staffelhinweis steht mobil in einer Zeile mit dem Preis (flex-wrap, gap), nicht in zwei Zeilen. Bitte Bericht oder Markup angleichen.
- **hinweis:** Mobil (390 px) wird der Platzhalter im Suchfeld „Anwendung, Schlüsseltyp oder Herstelle…“ am Feldrand abgeschnitten. Der Mikrotext ist kürzbar (shop-liste.tsx, TextInput placeholder).
- **hinweis:** Desktop 1440: Das Codeformat bricht bei col-span-3 in zwei Zeilen um (MS-02, MS-04 „1 bis 2 Buchstaben, dann 3 / Ziffern“). Lesbar, aber unruhig. Breite des Codeformat-Feldes prüfen.
- **hinweis:** Tablet 768: Die Staffelpreiszeile steht als drei getrennte Zeilen (Preis, je Stück, Staffelpreis). Lesbar, kein Überlauf. Die Bestätigung bleibt offen, wie der Bericht angibt.
- **hinweis:** Aktiver Filter ist nicht als eigenes Bild belegt. Badge (sr-only „aktiv“) und Rücksetzer (nur bei activeCount > 0) sind im Code geprüft, nicht im Render.
- **hinweis:** Prüfprozess, meine Verantwortung: In /root/sm24-bilder/E5-BEFUND-H05-pruefung-r2 habe ich tsc.txt, eslint.txt, vitest.txt, werte-suche.json und html.txt überschrieben. Der Ordner enthielt schon Dateien (filter-aktiv-r2__*, crop-*), es wurde nichts gelöscht. Die Ganzseitenbilder und bild-*.json wurden ebenfalls neu geschrieben. Alle weiteren Hilfsdateien liegen in ...-pruefung-r2-b.
- **hinweis:** Fremd, nicht Teil dieses Pakets: src/app/(site)/schluessel-nach-code/opengraph-image.tsx weicht seit 1171973 ab, stammt aus Commit edae43b (E5-L-28) und liegt nicht in den Schreibrechten. Der Testfehler der Vorrunde (registry ablauf) ist behoben: vitest ist jetzt grün.

## Bericht des Baumeisters

BERICHT E5-BEFUND-H05 Runde 2 (Baumeister): alle Muss-Befunde und die drei Soll-Befunde umgesetzt. Schnellprüfung nach Runde 2 bestanden, soweit die Werkzeuge reichen. Ein fremder Testfehler ist getrennt gemeldet. Nähere Einzelheiten stehen im Feld pruefung dieser Rückgabe.

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/schluessel-nach-code/page.tsx
- /home/user/schluesselmacher24/src/app/(site)/schluessel-nach-code/shop-liste.tsx

WAS UND WARUM
- Muss 1 (Kopf mit Kartenrahmen): page.tsx bindet CodeFundstelleGrafik aus dem Generator code-fundstelle direkt ein, ohne Rahmen. Die Grafik steht auf Papier im visual-Slot des PageHeader. Der Import der Tab-Komponente CodeFundstelleInteraktiv entfällt in dieser Seite.
- Soll 1 (Bereichs-Icon): PageHeader erhält bereich="schluessel-nach-code".
- Soll 2 (Filterzeile mobil): Das Badge zeigt nur die Zahl, 'aktiv' ist sr-only. Zähler und Knopf erhalten whitespace-nowrap.
- Soll 3 (Preisspalte): Titel md:col-span-4 wird zu 3, Preis md:col-span-2 wird zu 3. Die Preiszeile wird in 'je Stück' und 'Staffelpreis ab n Stück' geteilt, nowrap.
- Nicht geändert: Datenabruf, Suche, Filterlogik, Sortierung, Zähler-Logik, Links, Preise, Props ShopListeProps, istPlatzhalter-Regel, Leerzustand. Kein neues Client-JavaScript.

ALT-NEU (Mikrotexte)
- Filter-Badge: '1 aktiv' wird '1' (sichtbar), 'aktiv' nur für Screenreader.
- Staffelhinweis: 'je Stück · Staffelpreis ab 3 Stück' wird 'je Stück' und 'Staffelpreis ab 3 Stück' in zwei Zeilen (Trenner entfällt).
- Kopf-Fundstelle: drei Reiter entfallen, feste Zeichnung Schlüsselkopf.

PRÜFUNG (Kurzfassung)
- tsc: Exit 0, keine Fehler. eslint: Exit 0, keine Befunde.
- vitest components und lib: 1096 Tests, 1095 bestanden, 1 Fehlschlag (fremd, siehe gemeinsame Dateien).
- werte-suche: keine Funde. kein lucide-Treffer. Platzhalter-Prüfung im gerenderten HTML: kein Treffer.
- Messung 360/390 px: Zähler und Knopf auf einer Zeile, kein Überlauf. Tablet 768 und Desktop 1440: Preiszelle drei getrennte Zeilen.

GEMEINSAME DATEIEN
- Kein Eingriff. Fremder Testfehler: src/components/visual/registry.test.tsx erwartet 'ablauf' in der Registry. Ursache ist die untracked Datei src/components/visual/generators/ablauf.tsx eines fremden Agenten.
- Nebenwirkung der Werkzeuge: werte-suche.mjs schrieb ein Protokoll nach /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_11-12-26.json (Standardpfad, untracked).

OFFENE FRAGEN
1. Die drei Fundstellen-Reiter entfallen. Eine Auswahl bräuchte eine Client-Komponente mit neuem JavaScript, das außerhalb des Budgets liegt. Entscheidung des Orchestrators: Reiter wieder aufnehmen oder feste Zeichnung lassen.
2. Der Filter-Bildbeleg mobil zeigt nur das Suchfeld, weil die Tab-Leiste den Zähler verdeckt. Die Zeilenlage ist über Messwerte belegt.
3. Bei Staffelpreisen wächst die Zeile am Tablet auf drei Preiszeilen. Bitte bestätigen, ob das bleiben soll.

=== ENDE E5-BEFUND-H05 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen

- Die drei Fundstellen-Reiter (Schlüsselkopf, Sicherungskarte, Zylinderstirn) entfallen im Kopf. Die Paketvorgabe 'ohne Kartenrahmen' verlangt den Generator direkt, und der Generator ist Server-SVG ohne Auswahl. Eine Auswahl bräuchte eine Client-Komponente und damit neues Client-JavaScript, das außerhalb des Budgets liegt (nur 'Alle n anzeigen' ist erlaubt). Entscheidung des Orchestrators: Reiter wieder aufnehmen (eigene Client-Komponente, Budget-Ausnahme) oder die Fundstelle als feste Zeichnung lassen. Aktuell zeigt der Kopf den Schlüsselkopf.
- Der Vorschlag aus dem Befund 'Filter anzeigen' mit Badge: Das Badge zeigt jetzt nur die Zahl, 'aktiv' ist für Screenreader erhalten. Bitte Wortlaut bestätigen.
- Bildbeleg für den aktiven Filter auf dem Smartphone zeigt nur das Suchfeld, weil die Tab-Leiste den Zähler verdeckt. Die Zeilenlage ist deshalb über Messwerte belegt (messung-filter-preis.txt), nicht über ein Bild.
