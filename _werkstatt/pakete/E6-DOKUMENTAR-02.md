E6-DOKUMENTAR-02 · Rolle Dokumentar · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.16 · Plankennung E6-D-02 · Schreibrechte (exakt): `_werkstatt/bilder/abschluss/**` (neu), `_werkstatt/bilder/blind/**` (neu), `_werkstatt/bilder/galerie.html` (neu), `/root/sm24-bilder/blind-schluessel/` (neu, außerhalb des Repositorys), `_werkstatt/berichte/E6-DOKUMENTAR-02.md` (neu) · Umfang: Abschluss-Bildsatz ins Repository, Blindvergleich neutral vorbereiten (Schlüssel getrennt), Vorher-Nachher-Galerie als eigenständige Seite (Abnahmekriterien Z-04 und Z-10)

## Rollenbriefing
Du bist Dokumentar. Du ordnest Bilder und beschreibst, was wirklich vorliegt. Jede Angabe hat einen Beleg (Pfad, den du mit `ls` geprüft hast). Häufige Fehler: Dateien vertauschen, Vorher und Nachher in Dateinamen des Blindvergleichs verraten, Bilder in der Galerie über absolute Pfade einbinden, Bilder löschen oder überschreiben. Du committest und pushst nie, löschst nie Dateien und änderst nichts außerhalb deiner Schreibrechte.

## Aufgabe in einem Satz
Lege den Abschluss-Bildsatz ins Repository, bereite für jede der 12 Hauptansichten ein neutral benanntes Bildpaar „A/B“ in zufälliger Reihenfolge vor, dessen Schlüssel nur außerhalb des Repositorys liegt, und baue die Vorher-Nachher-Galerie als eigenständige HTML-Seite.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3. Die Leitidee: Die Seite sieht aus wie eine saubere Werkstattzeichnung – helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift. Der Gestaltungslauf hat Gestaltung, Bewegung, Grafik, Bedienung und Technik überarbeitet; die Bilder zeigen den Stand vorher (E0) und nachher (Abschluss).

## Quellen
- **Vorher (E0):** `_werkstatt/bilder/e0/` – Dateinamen `Hxx-<name>__<gerät>__<nr>.jpg` (Geräte `mobil` 390×844, `tablet` 768×1024, `desktop` 1440×900; Nummer = Bildschirmhöhe ab 00).
- **Nachher (Abschluss, Prüfstufe C):** `/root/sm24-bilder/e6-c/` mit denselben Namen; dazu `einzelbilder/<Kürzel>/` (je 5 Bilder eines großen Moments über seine Dauer), `gefuellt/` (Warenkorb und Kasse mit Inhalt), `uebrige/` (Stichprobe übriger Ansichten).
- Die 12 Hauptansichten und ihre Routen: `_werkstatt/KERN.md` (K-002) oder `_werkstatt/LAGEBILD.md`.

## Auftrag
1. **Abschluss-Bildsatz:** Kopiere (`cp`, nicht verschieben) alle `*.jpg` aus `/root/sm24-bilder/e6-c/` (nur die oberste Ebene) nach `_werkstatt/bilder/abschluss/`, dazu `einzelbilder/` nach `_werkstatt/bilder/abschluss/einzelbilder/` und `gefuellt/` nach `_werkstatt/bilder/abschluss/gefuellt/`. Aus `uebrige/` nur die Bilder `__00` je Ansicht und Gerät nach `_werkstatt/bilder/abschluss/uebrige/`. Zähle danach je Ordner (`ls | wc -l`) und vergleiche mit der Quelle.
2. **Blindvergleich** (`_werkstatt/bilder/blind/`):
   - Je Hauptansicht ein Ordner `V01` bis `V12` in der Reihenfolge H01 bis H12 (die Ansicht selbst ist am Inhalt erkennbar, das ist erlaubt).
   - Je Ordner zwei Seiten `A` und `B`. Welche Seite vorher und welche nachher ist, entscheidet je Ansicht ein Zufall: `python3 -c "import secrets; print(secrets.choice(['A','B']))"` je Ansicht einmal; die Seite, die er nennt, bekommt NACHHER.
   - Je Seite die Bilder `__00`, `__01` und `__02` von `desktop` und `mobil` (fehlt eine Nummer auf einer Seite, nimm sie auf keiner Seite), benannt `A-desktop-1.jpg`, `A-desktop-2.jpg`, `A-desktop-3.jpg`, `A-mobil-1.jpg` … und ebenso `B-…`. Kein Name, keine Metadaten und kein Ordner darf „e0“, „abschluss“, „vorher“, „nachher“, „alt“, „neu“ oder ein Datum enthalten. Entferne keine EXIF-Daten; prüfe stattdessen mit `strings <datei> | grep -iE "e0|abschluss|e6-c"`, dass nichts verrät (Befund melden, nichts löschen).
   - Mögliche Hinweise, die du nicht entfernen kannst (etwa unterschiedliche Bildhöhen), meldest du im Bericht.
   - `_werkstatt/bilder/blind/LIESMICH.md`: Anleitung für den Prüfer – 12 Ordner, je zwei Seiten A und B, Frage je Ansicht: „Welche Seite ziehst du vor, und warum (ein Satz)?“ Kein Hinweis auf Schlüssel, Reihenfolge oder Quelle.
   - **Schlüssel nur außerhalb des Repositorys:** `/root/sm24-bilder/blind-schluessel/SCHLUESSEL.md` mit der Tabelle `Ordner · Ansicht (Hxx und Route) · A ist · B ist · Quelle A · Quelle B` (Quelle = Ordner und Dateiname). Kein Verweis auf diese Datei in irgendeiner Repository-Datei.
3. **Galerie** `_werkstatt/bilder/galerie.html` – eigenständige Seite, ohne externe Ressourcen (kein CDN, keine Webschrift; Systemschrift), deutsch, `<html lang="de">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>Vorher und nachher · SCHLÜSSELMACHER24</title>`:
   - Kopf: ein Satz, was die Seite zeigt; Stand (Datum 17.10.2026, Zweig `claude/projekt-gestaltung-entwicklung-tofodh`); Hinweis, dass die Bilder automatisch aufgenommen sind (Chromium, drei Gerätegrößen).
   - Je Hauptansicht ein Abschnitt mit Überschrift (Hxx, Name, Route), darunter Vorher und Nachher nebeneinander (ab 900 px Breite; schmaler untereinander) für Desktop `__00` und Mobil `__00`, und darunter aufklappbar (`<details>`) alle weiteren Bildschirmhöhen beider Stände.
   - Abschnitt „Große Momente“: je Kürzel aus `abschluss/einzelbilder/` die 5 Bilder in einer Reihe.
   - Abschnitt „Gefüllter Warenkorb und Kasse“ und „Weitere Ansichten (Stichprobe)“ nur nachher, mit Dateiname als Unterschrift.
   - Bilder mit relativen Pfaden (`e0/…`, `abschluss/…`), `loading="lazy"`, `alt` mit Ansicht, Gerät, Stand und Bildschirmhöhe, `width`/`height` aus der Datei (`python3 -c "import struct"` oder `file <datei>` liefert die Maße).
   - Einfache CSS-Gestaltung in `<style>`: heller Grund, dunkle Schrift, Haarlinien, Etikett „Vorher“/„Nachher“ über jedem Bild. Kein JavaScript nötig.
   - Die Galerie verlinkt den Blindvergleich NICHT.
4. **Prüfe die Galerie** mit einem kurzen Python-Skript (unter `/root/sm24-bilder/blind-schluessel/`, nicht im Repository): Jedes `src` existiert relativ zu `_werkstatt/bilder/`, und die Zahl der Bilder je Abschnitt stimmt mit den Ordnern überein. Nenne beide Zahlen im Bericht.

## Grenzen
- Nur die genannten Pfade. Nie Dateien löschen oder überschreiben (gibt es ein Ziel schon, melde es und brich diesen Schritt ab).
- Keine Zugangsdaten oder Umgebungswerte in Bildern, Dateinamen oder Texten.
- Keine Wertung der Gestaltung.

## Prüfung
- Zählung je Ordner Quelle gegen Ziel.
- Blindordner: 12 Ordner, je Ordner gleich viele A- und B-Bilder; `grep -rniE "e0|abschluss|vorher|nachher" _werkstatt/bilder/blind` ergibt keinen Treffer (Dateinamen: `find _werkstatt/bilder/blind | grep -iE …`).
- Schlüssel: 12 Zeilen, je Zeile die Quelle der Bilder; `grep -rn "blind-schluessel" /home/user/schluesselmacher24 --include=*.md --include=*.html` ergibt keinen Treffer.
- Galerie: alle `src` vorhanden; Größe der Datei; Zahl der Bilder.

## Ausgabeformular
GEÄNDERTE DATEIEN (Ordner mit Zahl der Dateien) · WAS UND WARUM · BELEGE (Zählungen, Prüfbefehle mit Ergebnis) · OFFENE FRAGEN (auch: Hinweise im Blindvergleich, die du nicht entfernen konntest)

Schreibe den Bericht auch nach `_werkstatt/berichte/E6-DOKUMENTAR-02.md` – OHNE die Zuordnung A/B (die steht nur im Schlüssel).

Letzte Zeile: === ENDE E6-DOKUMENTAR-02 · BEREIT ZUR RÜCKGABE ===
