# FA-QA-04E · Bedienbarkeit, Teil 2E: Fokus nach dem Schrittwechsel und Fortsetzen ohne Sprung

Kopf: Etappe FA Priorität 7 · Rolle Baumeister und Prüfer · Modell Opus · Stufe 3 (gemeinsamer Ablauf-Baustein aller mehrschrittigen Formulare) · Kostenklasse M · ohne Datenschema · Anforderungen FA-26 (Bedienbarkeit auf allen Geräten, Tastatur) · Befunde: `berichte/FA-SEO-03C.md` (Abnahme, Punkt 4), `protokolle/FA-SEO-03C/upload-pruefung-3200-1711.json` (`fokus8` und `fokus8b`: Fokus auf `body`; Teil B: Layoutverschiebung 0,13 bei 412 px und 0,09 bei 1280 px), Entscheidung A-076.

## Aufgabe in einem Satz
Nach „Weiter“, „Zurück“ und einem Klick auf einen Schrittknopf steht der Tastaturfokus auf der Überschrift des neuen Schritts, und wer einen gespeicherten Zwischenstand fortsetzt, sieht die Seite nicht springen; sonst ändert sich für niemanden etwas.

## Vorgabe des Inhabers (Arbeitsanweisung vom 11.11.2026, Abschnitt 26, sinngemäß)
Die Seite muss auf Telefon, Tablet und Desktop vollständig bedienbar sein; viele Kunden sind über 60. Jeder Prozess muss ohne Hilfe zu Ende gehen.

## Stand (Commit 9c89d95, Quelltext wie d1615fa)
- `src/components/flow/flow-shell.tsx` trägt alle mehrschrittigen Formulare (19 Dateien nutzen `FlowShell`). Beim Schrittwechsel setzt niemand den Fokus. Ist „Weiter“ im neuen Schritt zunächst gesperrt, verliert der Knopf den Fokus, und er fällt auf die Seite selbst: Wer mit der Tastatur arbeitet, beginnt beim nächsten Tab wieder ganz oben in der Kopfzeile. Die Zeile „Schritt x von y“ hat `aria-live="polite"`; die Überschrift des Schritts ist `h2[data-schritt-titel]`; am Telefon rollt `zumSchrittScrollen` nach „Weiter“ zur Überschrift.
- Fortsetzen: Der Server liefert Schritt 1; nach dem Hydrieren springt ein gespeicherter Zwischenstand auf seinen Schritt. Gemessen am Autoschlüssel-Assistenten mit Zwischenstand auf Schritt 8: Layoutverschiebung 0,13 (412 px) und 0,09 (1280 px). Ohne Zwischenstand ist die Verschiebung 0.

## Teil 1: Fokus nach dem Schrittwechsel (umsetzen)
1. Nach einem Schrittwechsel, den der Kunde selbst auslöst („Weiter“, „Zurück“, Schrittknopf in der Leiste, Vor und Zurück des Browsers innerhalb des Ablaufs, übernommener Vorschlag), bekommt die Überschrift des neuen Schritts den Fokus (`tabIndex={-1}`), ohne dass die Seite dadurch zusätzlich rollt (`preventScroll`; das Rollen am Telefon bleibt Sache von `zumSchrittScrollen`).
2. Kein Fokus beim ersten Laden, beim Wiederherstellen eines Zwischenstands und nach einem Wechsel, den nicht der Kunde ausgelöst hat: Niemandem wird beim Laden der Seite der Fokus weggenommen.
3. Bleibt der Schritt stehen (gesperrtes „Weiter“, Fehlermeldung), bleibt der Fokus, wo er ist.
4. Der Fokus ist sichtbar, wie es die Seite überall hält (Fokusring für Tastatur, `focus-visible`); mit der Maus oder dem Finger erscheint an der Überschrift kein Ring.
5. Vorlesegeräte: Die Überschrift wird beim Fokus vorgelesen. Prüfe, ob die Zeile „Schritt x von y“ dann doppelt spricht, und halte die Ansage knapp (eine Ansage, die Schrittzahl und Titel nennt, reicht); ändere an sichtbaren Texten nichts.
6. Eingebettete Abläufe (`eingebettet`) und der Abschluss (letzter Schritt, Bestätigung, Weiterleitung zur Kasse) bleiben, wie sie sind; prüfe, dass der Fokus dort nicht ins Leere geht.

## Teil 2: Fortsetzen ohne Sprung (erst klären, dann nur sauber umsetzen)
1. Finde am Autoschlüssel-Assistenten, was sich verschiebt und wann (Skript `protokolle/FA-SEO-03C/experimente/upload-pruefung.mjs`, Teil B, als Vorlage; eigene Skripte nach `protokolle/FA-QA-04E/`).
2. Setze eine Lösung nur um, wenn alles Folgende gilt: Für Besucher ohne Zwischenstand ändert sich nichts (HTML vom Server, erstes Bild, größtes Element des ersten Bildschirms, Layoutverschiebung 0); das Fortsetzen verhält sich wie bisher (derselbe Schritt, dieselben Angaben, „Später weitermachen“ und die Regel „Fotos bitte erneut wählen“ unverändert); kein Flackern, keine leere Fläche; kein eingebettetes Skript vor dem Hydrieren (Sicherheitskopfzeilen bleiben); die Verschiebung beim Fortsetzen liegt danach unter 0,02.
3. Gibt es keine solche Lösung, ändere nichts und beschreibe im Bericht die Ursache und zwei bis drei Wege mit ihren Folgen (zum Beispiel eine ausdrückliche Rückfrage „Zwischenstand fortsetzen?“) als OFFENE FRAGE. Das ist ein gültiges Ergebnis.

## Grenzen
- Keine Änderung an Texten, Reihenfolge, Pflichtfeldern, Preisen, Zahlwegen, am Berechtigungsnachweis (R13) und an der Bewegung des Schrittwechsels (B-11; „Bewegung: ruhig“ bleibt ruhig).
- Die Farbwelt (A-074, A-075) bleibt: Die feste Formularleiste trägt am Telefon `max-md:buehne`; Fokusringe folgen den Tokens.
- Kleinste Textstufe 14 px; nichts läuft über; keine neue Abhängigkeit (G7); was im Browser landet, wächst nicht nennenswert (A-071, A-076: nenne das Skript-Gewicht des Assistenten vorher und nachher, gemessen am frisch gestarteten Server).
- Vor Änderungen an Next-Dateien die passende Anleitung unter `node_modules/next/dist/docs/` lesen (G12).

## Arbeitsweise
Du arbeitest im Arbeitsbaum; kein anderes Paket läuft. Du darfst bauen (`SM24_INDEXIERUNG=an _werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`) und den Prüfserver über `bash _werkstatt/ausbau/werkzeuge/server.sh stop|start` auf Port 3000 starten. Der Messstand auf Port 3200 zeigt den Stand vor diesem Paket (nur lesen). Im Browser (Playwright, Attrappen nach G5, nichts absenden, nur localhost; Skripte und Protokolle unter `_werkstatt/ausbau/protokolle/FA-QA-04E/`, schreiben über `sicher.sh --json --als-root`) belegst du bei 412 und 1280 px:
- Autoschlüssel-Assistent nur mit der Tastatur von Schritt 1 bis zum Schritt mit den Fotos und zurück: nach jedem Wechsel das fokussierte Element, und dass der nächste Tab im Schritt landet (nicht in der Kopfzeile).
- Drei weitere Abläufe mit `FlowShell` (ein Konfigurator, die Partner-Bewerbung, eine Fahrzeug-Anfrage) mit je zwei Wechseln.
- Laden ohne Zwischenstand: Der Fokus liegt nicht im Formular; Layoutverschiebung 0.
- Fortsetzen mit Zwischenstand: Schritt, Fokus, Layoutverschiebung vorher und nachher.
- Maus und Finger: kein Ring an der Überschrift; am Telefon steht die Überschrift nach „Weiter“ sichtbar unter dem festen Kopf.
- Baum der Zugänglichkeit: Die fokussierte Überschrift hat Rolle und Namen.

## Schreibrechte
`src/components/flow/**` mit Tests, `src/lib/flow/**` falls der Zustand des Ablaufs dort liegt, für Teil 2 die Stelle des Wiederherstellens (`src/app/(site)/autoschluessel/anfrage/assistent.tsx` und gemeinsame Hilfen dafür, nur diese Stelle), `src/app/(site)/globals.css` nur für eine Regel zum Fokus der Überschrift, `_werkstatt/ausbau/berichte/FA-QA-04E.md`, `_werkstatt/ausbau/protokolle/FA-QA-04E/**`.
Nicht anfassen: Texte, `content/**`, `src/payload/**`, `src/migrations/**`, `src/lib/data/**`, `src/components/forms/photo-upload.tsx`, `src/components/visual/**`, die Farbwelt, `package.json`, `next.config.ts`.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, Build wie oben. Alles grün, bevor du zurückgibst; nenne Zahlen. Tests, die das Verhalten ausführen (Fokus nach dem Wechsel, kein Fokus beim ersten Render und beim Wiederherstellen), nicht nur den Quelltext lesen.

## Bericht (`_werkstatt/ausbau/berichte/FA-QA-04E.md`)
Was sich für wen ändert, in zwei Sätzen; Tabelle der Abläufe mit fokussiertem Element nach jedem Wechsel vorher und nachher; Teil 2 mit Ursache, Messwerten und entweder der Lösung mit Belegen oder den Wegen als OFFENE FRAGE; Skript-Gewicht vorher und nachher.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-04E · BEREIT ZUR RÜCKGABE ===
