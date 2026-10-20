> Archiviert aus dem Arbeitsordner `_werkstatt/` des Gestaltungslaufs. Pfade wie `_werkstatt/…` in diesem Dokument beziehen sich auf den Stand in der Git-Geschichte (Zweig `claude/projekt-gestaltung-entwicklung-tofodh`, Commit `b8e7ea7`); dort liegen auch Bilder, Galerie und Protokolle.

# Bericht

## Abschluss · Stand 20. Oktober 2026

**Was erreicht ist** (Belege in `ABNAHME.md`):
- Alles läuft wie vorher und besser:
  - alle 14 Abläufe, die 7 Hauptaufgaben auch nur mit der Tastatur;
  - 1217 automatische Prüfungen und 52 Datenbankprüfungen grün;
  - an Preisen, Bestellung, Zahlung und Rechtstexten nichts verändert.
- Ein durchgängiges Designsystem: Schriftgrößen, Abstände, Farben und Bewegungen kommen aus einer Liste; frei gesetzte Werte gibt es nur noch in den Zeichnungen selbst und an vier begründeten Stellen. Eine einzige Symbolfamilie, eigene Fachzeichnungen statt „Bild folgt“, große bewegte Momente, die etwas erklären.
- Zugänglich: keine ernsten Fehler der automatischen Prüfung, sichtbarer Fokus, ruhige Seiten bei „Bewegung reduzieren“.
- Schnell: Auf dem Handy erscheinen alle Hauptseiten früher als vor dem Umbau, keine Zeichnung ruckelt.

**Zwei begründete Ausnahmen** (mehr erlaubt die Regel nicht):
1. **Gestaltungsnote:** Die strenge Bewertung gibt der Startseite 8 von 10, den übrigen Hauptseiten 7,2 bis 7,7; gefordert sind 8. Beide erlaubten Verbesserungsrunden sind verbraucht. Was fehlt, sind vor allem Dinge, die nur du liefern kannst: echte Fotos, Firmendaten und ein echter Artikelkatalog. Die unabhängige Endprüfung urteilt mit einem Blindvergleich.
2. **Ladezeit am großen Bildschirm:** Der Code-Shop erscheint dort 0,03 Sekunden später als vorher, knapp über der normalen Schwankung. Überall sonst und auf dem Handy ist es schneller.

**Zum Ansehen:**
- Galerie: `_werkstatt/bilder/galerie.html`, vorher und nachher nebeneinander, mit den großen Momenten.
- Alle Bilder des Endstands: `_werkstatt/bilder/abschluss/`.

**Für später:**
- Die offenen Hinweise der letzten Gestaltungsprüfung stehen in `_werkstatt/berichte/E6-L-34-sichtabnahme-*.md`, je Seite mit Vorschlag. Sie passen gut zu einer Runde nach dem Zusammenführen, wenn Fotos und echte Inhalte da sind.
- Was du prüfen oder entscheiden solltest, steht in `_werkstatt/MENSCHEN.md` (M-01 bis M-28).

**Endprüfung (E6-L-13, frischer unabhängiger Prüfer, 20. Oktober 2026), Urteil wörtlich** (Bericht: `_werkstatt/berichte/E6-L-13-endpruefung.md`):

Blindvergleich: Der neue Stand ist auf 12 von 12 Hauptansichten vorgezogen.

- Z-01 · bestätigt · `PLAN.md` · 101 von 102 Pflichtzeilen tragen eine Commit-Kennung (Stichprobe von 17 Kennungen vorhanden); offen ist nur E6-L-13 selbst, das mit diesem Bericht erledigt ist; die Kür K-01 bis K-06 ist mit Beleg abgearbeitet.
- Z-02 · bestätigt · `protokolle/E7-PRUEFER-C-build.log`, `E7-L-44-build.log`, `-typecheck.log`, `-lint.log`, `-test-unit.log`, `-test-db.log`, `-funktionsliste.log`, `funktionsliste-2026-10-15_23-58-16.md` (E0), `-konsole.log`, `-logik.log`, `-textabzug.log` · Build 208/208, Typprüfung und Linter EXIT 0, Unit 1217/1217 in 73 Dateien, DB 52/52, Funktionsliste 14/14 mit denselben Messwerten wie im E0-Lauf, Konsole 0/0/0 in 23 Ansichten, Logikwächter 0 abweichend, Textabzug 6/6 gleich; die eine spätere Codeänderung (3315165, sechs `className`-Zeilen) ist mit Build und TypeScript EXIT 0 belegt und am Code als ohne Wirkung auf Tests und Linter begründet.
- Z-03 · bestätigt · `protokolle/E7-PRUEFER-C-werte.log`, D-015/D-034/D-039 · 232 geänderte Dateien, 0 Funde ohne Ausnahme, 22 benannte Ausnahmen; eine eigene Stichprobe findet 0 freie Pixelwerte und Tokens in den neuen Bausteinen.
- Z-04 · Ausnahme bestätigt · Bericht Teil C, `bilder/abschluss/`, `bilder/blind/`, ABNAHME AUSNAHME 1, D-051 · Die Notenschwelle ist verfehlt (8 oder mehr nur H01; H04 und H11 mit Kategorien bei 6), der Blindvergleich ist mit 12 von 12 erfüllt, und AUSNAHME 1 trägt.
- Z-05 · bestätigt · `E7-PRUEFER-02-bildrate.log`, `E7-PRUEFER-C-bewegung-reduziert.log`, `-animationen.log`, `E7-L-44-animationen.log`, `-register.md`, KERN 1.19 · 8 von 8 Momenten mit Median 0,0 % verworfen (höchster Einzelwert 3,7 %) bei 390 × 844 und vierfacher Drosselung, reduziert 0 Befunde in 23 Ansichten, 0 unbekannte Keyframes, kein Übergang ohne Dauer-Token; offen nur R-8 (am Code belegt).
- Z-06 · bestätigt · `E7-PRUEFER-C-svg.log`, D-049, G8 · 0 unbenannte sichtbare SVG, 0 doppelte ids, lucide 0; der einzige Befund `icon.svg` ist Logo und Favicon und nach G8 unantastbar.
- Z-07 · bestätigt · `E7-PRUEFER-C-a11y.log`, `E7-L-44-a11y.log`, `-tastatur-mobil.log`, `-tastatur-desktop.log`, `area-theme.test.ts` · axe 0 ernst und 0 kritisch in 23 Ansichten auf beiden Geräten, Tastatur 7/7 je Gerät ohne fehlenden Fokus, Kontrasttests grün.
- Z-08 · Ausnahme bestätigt · `E7-PRUEFER-02-messung-mobil.log`, `-messung-desktop.log`, `E7-PRUEFER-02-ergebnis.md`, `E7-PRUEFER-01-ergebnis.md` · Budgets auf allen 24 Serien eingehalten, mobil 36 von 36, Desktop 35 von 36 (H05 LCP +28 ms bei 24 ms Spanne); AUSNAHME 2 trägt.
- Z-09 · bestätigt · `E7-PRUEFER-C-bildsatz.log`, `bilder/abschluss/` · 69 von 69 Läufen ohne Überlauf, kein überlappender Text, angeschnittene Wörter nur am Rand quer wischbarer Leisten, ein Thema, eine Sprache.
- Z-10 (Nachprüfung) · bestätigt · `README.md` (Zeile 74), `MENSCHEN.md` (M-02, M-07), `src/components/layout/site-footer.tsx` (Zeilen 49–52), `protokolle/E7-PRUEFER-C-test-unit.log`, dazu `BERICHT.md`, `KERN.md`, `bilder/galerie.html` · README nennt jetzt „73 Unit-Testdateien mit 1217 Tests“, und das stimmt mit dem dort genannten Befehl (73) und dem Unit-Protokoll (73 Dateien, 1217 Tests) überein; M-02 beschreibt den Fuß so, wie ihn der Code baut (bei Platzhalterdaten keine Firmenzeilen, Redaktionshinweis nur bei `NODE_ENV !== 'production'`), M-07 nennt Safari auf iPhone und Computer, Chrome auf Android, Firefox sowie VoiceOver, TalkBack und NVDA und deckt damit U-1 bis U-3; BERICHT (Galerie, Anleitung zum Zusammenführen und Zurückrollen, Hinweis zu `_werkstatt`), KERN 1.19 und die übrigen README-Stichproben waren schon bestätigt.
- AUSNAHME 1 (Z-04) · Ausnahme bestätigt · ABNAHME, D-051, `pakete/E5-BEFUND-*`, `pakete/E6-BEFUND2-*`, PLAN-Commits, `bilder/blind/`, `galerie.html` · Denkprotokoll, zwei belegte Befundrunden je Ansicht und eine tragende Ersatzlösung (Blindvergleich 12/12) liegen vor, die Ausnahme deckt nur den Notenteil ab; die Spalte „Was fehlt“ ist auf die Werte dieser Endprüfung zu berichtigen.
- AUSNAHME 2 (Z-08) · Ausnahme bestätigt · ABNAHME, D-050, D-051, `E7-PRUEFER-01-ergebnis.md`, `E7-PRUEFER-02-ergebnis.md` · Zwei belegte Anläufe, Denkprotokoll und Ersatzlösung (alle Budgets mit großer Reserve) liegen vor; die Ausnahme deckt genau den einen Wert H05 Desktop LCP ab.
- U-1 bis U-4: je eine Zeile „bestätigt“; der Wortlaut steht im Bericht.

Gesamturteil: „ABSCHLUSS ist möglich, denn alle Zeilen sind bestätigt oder als Ausnahme bestätigt: Z-01 bis Z-03, Z-05 bis Z-07, Z-09 und Z-10 sowie U-1 bis U-4 bestätigt, Z-04 und Z-08 über AUSNAHME 1 und AUSNAHME 2 bestätigt, mit zwei Ausnahmen und keiner für Z-02.“

Hinweis des Prüfers für die Zeit nach dem Zusammenführen: Für den Codestand 3315165 (sechs Klassen an Übergängen) gibt es kein eigenes Protokoll von Linter und Unit-Tests. Die Prüfungen liefen vor dem Commit grün (tsc 0, ESLint 0, Vitest 1217/1217, D-051); ein kurzer Lauf vor dem Zusammenführen ist trotzdem gut.

## Anleitung · Zusammenführen und Zurückrollen

Alles liegt auf dem Zweig `claude/projekt-gestaltung-entwicklung-tofodh`. Er zweigt von `main` beim Commit `71dbadd` („build: auf Vercel nie ein lokales Postgres starten“) ab. Nichts ist zusammengeführt oder veröffentlicht; das entscheidest du (MENSCHEN M-14).

**Was sich ändert (gegenüber `main`)**
- Website-Code: 244 Dateien, vor allem unter `src/` (Gestaltung, Grafiken, Bewegung, Bedienung). Unverändert: Datenmodelle und Migrationen, Server-Aktionen, Preis- und Terminlogik, Anbindungen (`src/lib/integrations`), Inhalte unter `content/` und `public/`.
- Abhängigkeiten: `lucide-react` entfernt (`package.json`, `package-lock.json`); keine neue Bibliothek.
- Konfiguration: `tailwind.config.ts` (Designsystem), `next.config.ts` (CSS im Dokument für schnelleres erstes Laden, noch experimentell, siehe MENSCHEN M-28), `README.md` (Ist-Stand), `UMSETZUNG.md` (Hinweis „historisch“). Für den Arbeitsordner `_werkstatt/` je eine Ausnahme in `.gitignore`, `eslint.config.mjs`, `tsconfig.json` und `vitest.config.ts`.
- `_werkstatt/` (rund 46 MB, davon 36 MB Bilder): Auftrag, Kern, Plan, Berichte, Prüfprotokolle, Bildsätze, Galerie (`_werkstatt/bilder/galerie.html`) und Prüfwerkzeuge mit eigener Paketdatei. Nicht Teil der Website.

**Vor dem Zusammenführen: `_werkstatt` bewusst entscheiden**
- *Entfernen* (empfohlen, wenn das Repository schlank bleiben soll): auf dem Zweig `git rm -r _werkstatt` und die vier `_werkstatt`-Zeilen in `.gitignore`, `eslint.config.mjs`, `tsconfig.json` und `vitest.config.ts` wieder herausnehmen; committen. Die Unterlagen bleiben in der Geschichte des Zweigs erhalten.
- *Behalten* (wenn Kern, Plan und Belege im Repository nachlesbar bleiben sollen): nichts tun; die Ausnahmen sorgen dafür, dass Typprüfung, Linter und Tests den Ordner nicht anfassen.

**Zusammenführen**
1. Einen Pull Request von `claude/projekt-gestaltung-entwicklung-tofodh` nach `main` öffnen und die Galerie ansehen.
2. Prüfen wie im Projekt üblich: `npm ci`, `npx tsc --noEmit`, `npx eslint .`, `npm run test:unit`, Build (auf Vercel wie bisher; lokal ohne Datenbank `SM24_DATA=json npx next build`).
3. Mit einem Merge-Commit zusammenführen (nicht „squash“), damit die Paketkennungen in den Commits erhalten bleiben.

**Zurückrollen**
- Nach dem Zusammenführen: `git revert -m 1 <Merge-Commit>` auf `main` und pushen – das nimmt alle Änderungen in einem neuen Commit zurück, ohne die Geschichte umzuschreiben.
- Einzelne Pakete: Jeder Commit trägt seine Kennung (etwa `[E7-L-36]`); `git log --grep "E7-L-36"` findet ihn, `git revert <commit>` nimmt ihn zurück.

## Morgenbericht · Dienstag, 20. Oktober 2026 (nachgeholt um 14:50 Uhr)

Der Bericht vom 19. Oktober fehlt: Der Arbeitsprozess hing nach einem Neustart über einen Tag, ohne dass etwas verloren ging. Seitdem lief nichts weiter, dieser Bericht holt beide Tage nach.

**Fertig seit Sonntag** (Bilder in `bilder/morgen-2026-10-20/`)
- Auf dem Handy laden alle 12 Hauptseiten jetzt schneller als vor dem Umbau: die Überschrift steht 0,3 bis 0,4 Sekunden früher, im Warenkorb sogar nach 0,5 statt 2,6 Sekunden. Beim Laden verrutscht nichts mehr; nur in Warenkorb und Kasse bleibt eine winzige Bewegung, ein Zehntel von früher.
- Das Menü reagiert schneller als vorher. Keine der acht großen Zeichnungen ruckelt mehr (`fraesbahn-mitte__desktop.jpg`, `schliessanlagen__desktop.jpg`).
- Die Linien im Ablaufbild enden jetzt über der Schrift (`ablauf-ohne-ueberschneidung__desktop.jpg`), die Legende der Türzeichnung ist gut lesbar (`tuertechnik-legende__desktop.jpg`).
- Die zweite Schlussprüfung ist sauber: alle 14 Abläufe, die 7 Hauptaufgaben auch nur mit der Tastatur, keine Zugänglichkeits- und keine Browserfehler (`kasse__mobil.jpg`, `startseite__mobil.jpg`).

**Ehrlich**
- Am großen Bildschirm erscheint der Code-Shop 0,03 Sekunden später als vorher, knapp mehr als die normale Messschwankung. Mehr als zwei Anläufe erlaubt die Regel nicht; das wird eine begründete Ausnahme.
- Die Gestaltungsnoten liegen bei etwa 7,5 von 10 statt 8. Das wird die zweite und letzte erlaubte Ausnahme; das Urteil fällt die unabhängige Endprüfung.

**Als Nächstes:** zwei kleine Unstimmigkeiten in der Bewegungsliste beheben, neue Vorher-Nachher-Bilder und Blindvergleich, Endprüfung, Übergabe.

**Für dich:** eine neue Ladeoption, die bei Updates zu prüfen ist (M-28), Platzhalter in den AGB (M-05), nur 8 Beispielartikel (M-25), Zusagen auf der Bestellbestätigung (M-26), Firmendaten (M-02), Galerie ansehen (M-08). Nichts ist veröffentlicht.

## Morgenbericht · Sonntag, 18. Oktober 2026, 07:00 Uhr (geschrieben um 10:40 Uhr nach einem Neustart)

**Fertig seit gestern**
- Die zweite und letzte Verbesserungsrunde ist auf allen Seiten abgenommen.
- Die große Schlussprüfung ist gelaufen:
  - Alle 14 Abläufe laufen durch, die 7 Hauptaufgaben auch nur mit der Tastatur.
  - Keine Zugänglichkeitsfehler und keine Fehler im Browser.
  - Nichts ragt über den Bildschirmrand; mit „Bewegung reduzieren“ steht alles still und bleibt sichtbar.
  - Die Liste aller Bewegungen ist jetzt vollständig.
- Vorher-Nachher-Galerie zum Durchblättern: `_werkstatt/bilder/galerie.html` (Ausschnitt `bilder/morgen-2026-10-18/galerie-vorher-nachher__desktop.jpg`). Der Blindvergleich für die Endprüfung ist vorbereitet.
- Beispiele von heute: `schliessanlagen__mobil.jpg`, `code-shop__desktop.jpg`, `kasse__mobil.jpg`, `startseite-profilschnitt__desktop.jpg`.

**Ehrlich**
- Auf dem Handy erscheint die Überschrift 0,05 bis 0,2 Sekunden später als vor dem Umbau, weil die neuen Zeichnungen mitgeladen werden. Alle Grenzwerte sind weit eingehalten (gut 1 statt erlaubter 2,5 Sekunden), die strenge Regel „nicht langsamer als vorher“ aber nicht.
- Das Menü auf dem Handy reagiert etwa 0,1 Sekunden träger.
- Vier Zeichnungen ruckeln auf schwachen Handys leicht; bei einer davon wurde zudem die falsche Grafik gemessen.
- Zwei Bildfehler: Linien kreuzen Beschriftungen (`service-linien-ueber-beschriftung__desktop.jpg`), und eine Legende ist zu blass.
- Gestaltungsnoten: Startseite 8 von 10, die übrigen Hauptseiten 7,2 bis 7,7; Ziel war überall 8.

**Als Nächstes:** Ladeweg und Menü beschleunigen, Zeichnungen erst nach dem Laden starten, die zwei Bildfehler beheben. Danach folgen eine zweite Schlussprüfung, die unabhängige Endprüfung und die Übergabe.

**Für dich:** Platzhalter in den AGB (M-05), nur 8 Beispielartikel (M-25), Zusagen auf der Bestellbestätigung (M-26), Firmendaten (M-02), Galerie ansehen und Richtung freigeben (M-08). Nichts ist veröffentlicht.

## Morgenbericht · Samstag, 17. Oktober 2026, 07:00 Uhr (geschrieben um 11:00 Uhr nach einem Neustart)

Bilder: `_werkstatt/bilder/morgen-2026-10-17/`

1. **Alle Seiten sind umgebaut:** die 12 Hauptseiten und dazu Service, Kontakt, Standorte, Rechtstexte, Artikel, alle Konfiguratoren und die Bestellseite.
2. **Code-Shop:** Oben zeigt eine Zeichnung den Schlüssel mit seinen Einschnitten für den eingegebenen Code (`code-produkt__desktop.jpg`).
3. **Schließanlagen:** Den Plan kannst du anklicken. Wählst du einen Schlüssel, leuchten die Türen auf, die er öffnet (`schliessanlagen-plan__desktop.jpg`).
4. **Gleichschließende Zylinder:** Beim Scrollen heben sich die Stifte im Zylinder bis an die Trennlinie (`gleichschliessung-stifte__desktop.jpg`).
5. **Zylinder, Warenkorb, Kasse:** Sie sind ruhiger. Die Summe steht immer im Blick, auf dem Handy unten mit dem Knopf „Zur Kasse“ (`zylinder-konfigurator__desktop.jpg`, `warenkorb__mobil.jpg`).
6. **Türtechnik:** Eine Zeichnung zeigt die fünf Schutzpunkte einer Tür (`tuertechnik__desktop.jpg`).
7. **Einheitliche Symbole:** Die zweite, fremde Symbolfamilie ist ganz entfernt. Alle Symbole stammen jetzt aus einem Satz.
8. **Alle sechs Extras sind fertig:**
   - die Stifte-Szene;
   - das Funksignal bei den Zutrittslösungen;
   - Fachzeichnungen statt „Bild folgt“;
   - eine Lesefortschritt-Linie im Ratgeber;
   - eine Druckansicht der Bestellbestätigung;
   - Vorschaubilder, wenn jemand einen Link teilt.
9. **Alles Bestehende funktioniert weiter:**
   - 1.150 automatische Prüfungen sind grün.
   - Alle 14 Hauptabläufe laufen von Anfang bis Ende durch.
   - Die Ladezeiten bleiben in den Grenzen, und die Bedienbarkeitsprüfung findet keine Fehler.
   - Preise, Bestellung und Zahlung sind unverändert.
10. **Ehrlich gesagt:** Die strenge Gestaltungsprüfung gibt den Seitengruppen 6,4 bis 7,1 von 10 Punkten; gefordert sind 8. Jetzt kommt die letzte Verbesserungsrunde je Seite, danach die Schlussprüfung mit Vergleich zum Ausgangsstand.
11. **Für dich zu prüfen** (`_werkstatt/MENSCHEN.md`):
    - **Artikel (M-25):** Es gibt nur 8 Beispielartikel. Katalog pflegen oder den Bereich vorerst ausblenden.
    - **Bestellbestätigung (M-26):** Stimmen die Zusagen dort?
    - **Konfiguratoren und Sicherheitscheck (M-21 bis M-24):** Stimmen die Zahlen und Beispiele?
    - **Weiter offen:** Firmendaten, echte Fotos, Hersteller der Codelinien und die rechtliche Prüfung der Rechtstexte.
    - **Textvorschläge:** in `_werkstatt/TEXTVORSCHLAEGE.md`.
12. **Veröffentlicht ist nichts.** Alles liegt nur auf dem Arbeitszweig `claude/projekt-gestaltung-entwicklung-tofodh`.

## Morgenbericht · Freitag, 16. Oktober 2026, 07:00 Uhr (ergänzt um 07:30 Uhr)

1. **Startseite:** Oben fräst eine technische Zeichnung einen Schlüssel, Einschnitt für Einschnitt; zum Schluss hebt das Werkzeug ab. Heute früh habe ich alle Kritikpunkte der Gestaltungsprüfung umgesetzt. Auf dem Handy sind Zahlen und Pläne jetzt groß genug, die Karten lassen sich seitlich wischen, und kein Abschnitt wiederholt mehr den Aufbau des vorigen. Bilder: `_werkstatt/bilder/morgen-2026-10-16/startseite__mobil.jpg`, `…__tablet.jpg`, `…__desktop.jpg`.
2. **Farben:** Jeder Leistungsbereich hat seine eigene Farbe, und keine zwei liegen mehr nah beieinander. Tür- und Schließtechnik ist jetzt olivgrün statt eines zweiten Grüns. Die bunten Beschriftungen unter den Bereichen sind ruhig grau (`schnelleinstieg-farben__desktop.jpg`).
3. **Seite „Autoschlüssel“:** Sie ist fertig umgebaut. Eine Zeichnung zeigt alle vier Schlüsselarten, dazu kommen eine klare Begriffsliste und der Ablauf in fünf Schritten (`autoschluessel__desktop.jpg`, `autoschluessel-begriffe__mobil.jpg`).
4. **Seitenwechsel:** Klickst du auf der Startseite einen Bereich an, wandert sein Symbol in den Kopf der neuen Seite. Das funktioniert in aktuellen Browsern; ohne diese Unterstützung wechselt die Seite einfach wie bisher.
5. **Gerade in Arbeit:** die Seiten für Automarken und Modelle, den Code-Shop, Schließanlagen und Türtechnik. Dort wird aus dem Code ein Schlüssel live gezeichnet, und es gibt einen Schließplan zum Anklicken. Danach folgen Ratgeber, Zylinder-Konfigurator, Warenkorb und Kasse.
6. **Alles Bestehende funktioniert weiter:** Über 1.000 automatische Prüfungen sind grün, und an Bestellung, Preisen und Zahlung ist nichts verändert.
7. **Ehrlich gesagt:** Die strenge Gestaltungsprüfung gab der Startseite zweimal 7 von 10 Punkten; gefordert sind 8. Die Kritik ist jetzt umgesetzt. Ob es für 8 reicht, zeigt die Schlussprüfung.
8. **Neu für dich zu prüfen** (`_werkstatt/MENSCHEN.md`, M-16 und M-17): Stimmen die Zertifizierungsangaben auf der Türtechnik-Seite (DIN-Normen für Fluchttüren)? Und die Beschreibungen der Codelinien sind teils kleingeschrieben und brauchen eine Korrektur.
9. **Weiter offen von dir:** Firmendaten, echte Werkstattfotos, die Hersteller der Codelinien, die Prüfung der Rechtstexte und ein Blick auf die Gestaltungsrichtung.
10. Nichts ist veröffentlicht. Alles liegt nur auf dem Arbeitszweig `claude/projekt-gestaltung-entwicklung-tofodh`.
