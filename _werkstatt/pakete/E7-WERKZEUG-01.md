E7-WERKZEUG-01 · Rolle Baumeister (Werkzeuge) · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.16 · Schreibrechte (exakt): `_werkstatt/werkzeuge/messung.mjs`, `_werkstatt/werkzeuge/bewegung.mjs`, `_werkstatt/werkzeuge/animationen.mjs`, `_werkstatt/werkzeuge/ladeweg.mjs` (neu), `_werkstatt/werkzeuge/LIESMICH.md` · Umfang: vier Prüfwerkzeuge für Etappe E7 „Absichern“ (Kriterien Z-05, Z-08)

## Rollenbriefing
Du baust Prüfwerkzeuge in Node (ES-Module, Playwright aus `_werkstatt/werkzeuge/node_modules`, gemeinsame Helfer in `_werkstatt/werkzeuge/lib.mjs` – nur lesen, nicht ändern). Die Werkzeuge messen ehrlich: kein Wert wird geschönt, kein Kriterium verändert, jede Einschränkung steht im Protokoll. Häufige Fehler: Code, der im Browser läuft, greift auf Node-Variablen zu; Ausnahmen werden verschluckt; vorhandene Aufrufe und Ausgaben ändern sich unbemerkt (andere Prüfer nutzen sie weiter). Alle bestehenden Optionen und Ausgabeformate bleiben gleich; neues kommt nur als neue Option hinzu.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, Zutrittslösungen und Sicherheitstechnik. Technisch ist es Next.js 16 mit React 19, TypeScript, Tailwind CSS 3 und Payload CMS 3; ohne Datenbank laufen die Prüfserver im JSON-Modus. Port 3000 ist der aktuelle Produktionsbuild, Port 3100 der Ausgangsstand E0, Port 3001 der Entwicklungsserver (nicht für Messungen). Die Werkzeuge in `_werkstatt/werkzeuge/` sind die einzige Messgrundlage für die Abnahme. Gemessen wird mobil mit vierfach gedrosseltem Prozessor und langsamem Netz (siehe `messung.mjs`).

## Auftrag
1. **`messung.mjs --vergleich <url>`** (neue Option):
   - Misst je Ansicht und Profil abwechselnd Lauf um Lauf gegen den zweiten Server (z. B. `--vergleich http://localhost:3100`): Lauf 1 jetzt, Lauf 1 Vergleich, Lauf 2 jetzt, … So liegen beide Serien im selben Zeitfenster.
   - Ausgabe zusätzlich zur bisherigen Tabelle: Tabelle „Ansicht · Profil · Wert (LCP, CLS, INP) · Median jetzt · Median Vergleich · Spanne Vergleich (max − min) · Differenz · erfüllt (Differenz ≤ Spanne oder Differenz ≤ 0)“ und eine Summenzeile. JSON enthält beide Serien vollständig (`serien` wie bisher, neu `vergleich`).
   - Ohne die Option verhält sich das Werkzeug exakt wie heute.
2. **`ladeweg.mjs`** (neu, gleiche Drosselung und Gerät wie `messung.mjs` mobil):
   - Aufruf `node ladeweg.mjs --routen /,/schliessanlagen [--laeufe 3] [--basis <url>] [--json <datei>]` (`--basis` überschreibt `BASIS_URL`, damit E0 auf 3100 messbar ist).
   - Je Lauf über CDP (`Network.requestWillBeSent`, `Network.responseReceived`, `Network.loadingFinished`): je Anfrage Typ, URL (ohne Host, gekürzt), Priorität, Start, Ende, übertragene Bytes; dazu FCP, LCP (Zeit und Element: Tag, Klasse gekürzt, Text gekürzt), Schriftstatus bei FCP (`document.fonts` geladen ja/nein je Familie, per `PerformanceObserver` für paint und einem Abgleich der Schrift-Anfragen gegen FCP), Long Tasks vor FCP (Anzahl, Summe), Zahl der DOM-Elemente, Größe des HTML (übertragen).
   - Ausgabe: je Route Median der Läufe und eine Wasserfall-Tabelle des mittleren Laufs (nur Dokument, CSS, Schriften, Skripte; sortiert nach Start), dazu „Bytes vor FCP“ je Typ.
3. **`bewegung.mjs`** (Einzelbilder und Bildrate):
   - Statt des ersten DOM-Treffers des Selektors nimm den ersten **gerenderten** Treffer: `[...document.querySelectorAll(sel)].find((e) => e.getClientRects().length > 0 && e.getBoundingClientRect().width > 0)`; in Playwright entsprechend (z. B. `page.locator(sel).filter({ visible: true }).first()` oder Auswertung im Browser). Gibt es keinen gerenderten Treffer: Bedienfehler mit Zahl der versteckten Treffer.
   - Schreibe ins Protokoll (Text und JSON), welcher Treffer genommen wurde: Index unter allen Treffern, Größe in px, `viewBox` falls SVG.
   - Grund: Bisher traf der Selektor bei `/schliessanlagen` (mobil) und `/ratgeber/…`, `/service-und-termin` (Desktop) die versteckte zweite Fassung einer Grafik; die Messung galt dann einem unsichtbaren Element. Das ist eine Korrektur eines Messfehlers – Schwellen und Messfenster bleiben unverändert.
4. **`animationen.mjs --bedienen`** (neue Option):
   - Nach Laden und Durchscrollen bedient das Werkzeug je Gerät, was es auf der Seite findet, und wartet nach jeder Bedienung 600 ms:
     - mobil: Knopf mit `aria-controls="hauptmenue-mobil"` klicken (Schublade); darin den ersten Knopf mit `aria-expanded="false"` klicken (Untermenü); dann `Escape`.
     - Desktop: über den ersten Knopf der Hauptnavigation mit `aria-controls="megamenue"` fahren (`hover`), dann klicken, dann `Escape`.
     - beide Geräte: den ersten Knopf mit `aria-expanded` in `main` (Akkordeon) klicken und wieder schließen; gibt es einen Knopf mit dem Text „Weiter“ in `main`, der aktiviert ist und kein `type="submit"` hat, ihn klicken und danach „Zurück“ klicken.
   - Jede Bedienung wird protokolliert (gefunden ja/nein, ausgeführt ja/nein, Fehler). Neue Spalte „Bedienung“ in der Tabelle; die Zählung von CSS-Animationen, WAAPI und Übergängen umfasst dann auch die Bedienungen.
   - Schreibende Anfragen fängt `attrappenSetzen` ab (bleibt so).
5. **`LIESMICH.md`**: je Werkzeug zwei bis vier Zeilen zu den neuen Optionen, mit Beispielaufruf.

## Grenzen
- Nur die fünf Dateien. `lib.mjs` und andere Werkzeuge nicht ändern; braucht ein Werkzeug einen Helfer, lege ihn in die eigene Datei.
- Keine neuen Abhängigkeiten (Playwright-Core und axe sind vorhanden).
- Nie Dateien löschen; Hilfs- und Probedateien nur unter `/root/sm24-bilder/e7-w01/`.
- Ports 3000 und 3100 laufen; 3001 nicht für Messungen benutzen. Besteht `/tmp/sm24-messfenster.lock`, warte (ein anderer Prüfer misst).
- Du committest und pushst nie.

## Prüfung (Schnellprüfung)
- `node --check` je geänderter Datei.
- Probeläufe (Ausgaben unter `/root/sm24-bilder/e7-w01/`, JSON mit `--json`):
  - `node messung.mjs --routen / --laeufe 2 --profil mobil --vergleich http://localhost:3100 --json /root/sm24-bilder/e7-w01/messung.json` → beide Serien, Vergleichstabelle.
  - `node messung.mjs --routen / --laeufe 1 --profil mobil --json /root/sm24-bilder/e7-w01/messung-alt.json` → Ausgabe wie bisher (Spalten vergleichen mit einem älteren Protokoll unter `_werkstatt/protokolle/E6-PRUEFER-C-messung.log`).
  - `node ladeweg.mjs --routen / --laeufe 1` und `node ladeweg.mjs --routen / --laeufe 1 --basis http://localhost:3100`.
  - `node bewegung.mjs bildrate /schliessanlagen --selektor "main svg[viewBox='0 0 480 300']" --dauer 1600 --laeufe 1 --geraet mobil` → Bedienfehler mit Hinweis auf versteckte Treffer ODER gerenderter Treffer; dann mit `"main header [role=img]"` → gerenderter Treffer 360×… protokolliert.
  - `node bewegung.mjs einzelbilder /service-und-termin --selektor "main header svg[role=img]" --geraet desktop --dauer 1600 --ziel /root/sm24-bilder/e7-w01/eb` → nicht leer, Treffer-Index 1.
  - `node animationen.mjs --routen /,/autoschluessel/anfrage --geraet mobil --bedienen` und `--geraet desktop --bedienen` → Spalte Bedienung gefüllt, Keyframes `schublade-ein` bzw. `menue-ein` erscheinen.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (je Probelauf Befehl und Kernergebnis) · OFFENE FRAGEN

Letzte Zeile: === ENDE E7-WERKZEUG-01 · BEREIT ZUR RÜCKGABE ===
