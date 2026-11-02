# Prüfwerkzeuge des Ausbaulaufs

Stand 2. November 2026, geprüft im Paket E0-PRUEFER-02 gegen den Produktionsserver auf Port 3000. Die Werkzeuge liegen in `_werkstatt/ausbau/werkzeuge`. Gemeinsame Grundlage ist `lib.mjs`; sie ändert nur der Orchestrator.

## Einrichtung

Die Abhängigkeiten liegen außerhalb des Repositorys und sind per Symlink verlinkt. Nichts wird nachinstalliert.

```
# 1. Abhängigkeiten prüfen (axe-core 4.10.2, lighthouse 12.6.1, svgo 3.3.2)
ls -la _werkstatt/ausbau/werkzeuge/node_modules

# 2. Produktionsserver (Port 3000), setzt einen aktuellen Build voraus
_werkstatt/ausbau/werkzeuge/server.sh status      # start, stop, status, neu

# 3. Jeder Projektbefehl und jeder Probelauf läuft über die Datenweiche
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/bild.mjs / --geraet mobil
```

- `--als-root` ist nötig, weil die Abhängigkeiten unter `/root` liegen und der Nutzer `ubuntu` dort nicht lesen kann. Die Datenweiche leert die Umgebung und prüft die Hosts in beiden Fällen.
- Die Datenweiche wechselt in den Repository-Wurzelordner. Relative Pfade in `--json`, `--ziel` und `--md` beziehen sich deshalb auf diesen Ordner; absolute Pfade sind sicherer.
- Playwright 1.63 kommt aus `/opt/node-tools/node_modules/playwright`, Chromium aus `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` (überschreibbar mit `SM24_CHROMIUM`). Nie `playwright install` ausführen.

## Gemeinsame Regeln

- Geräte: `lib.mjs` führt fünf Größen: mobil-klein 360 × 780, mobil 390 × 844, tablet 768 × 1024, desktop 1440 × 900, breit 1920 × 1080. Werkzeuge wählen ein Gerät über seine Kennung, nie über die Position in der Liste.
- Routen: `HAUPTANSICHTEN` in `lib.mjs` (derzeit 14 Ansichten).
- Ausgabe: Markdown-Tabelle auf stdout und JSON-Protokoll. Standard ist `protokolle/<skript>-<zeitstempel>.json`, mit `--json <datei>` anders. Bilder landen standardmäßig in `bilder/arbeit`, mit `--ziel` anders.
- Exit-Codes: 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
- Schreibende Anfragen fängt `attrappenSetzen()` aus `lib.mjs` ab. Fremde Ursprünge werden abgebrochen, außer Google-Schriften. `konsole.mjs` zählt solche Abbrüche getrennt als Attrappen-Abbrüche, nicht als Befunde.
- Probeläufe ohne Schreiben in Projektordner: `--json`, `--ziel` und `--md` lenken die Ausgaben um. Dazu kommen `SM24_FOTO` (funktionsliste, Testbild für den Upload), `SM24_TEXTABZUG` (textabzug) und `SM24_FINGERABDRUECKE` (logikwaechter).

## Werkzeuge

| Werkzeug | Aufruf (Beispiel) | Zweck | Stand |
|---|---|---|---|
| server.sh | `server.sh start`, `stop`, `status`, `neu` | Produktionsserver auf Port 3000 über die Datenweiche | läuft |
| bild.mjs | `node bild.mjs / --geraet mobil` | Bildschirmfoto einer Seite je Gerät | läuft |
| bildsatz.mjs | `node bildsatz.mjs --routen /,/kasse --max 2` | Bildsatz je Ansicht und Gerät mit Überlaufprüfung | läuft |
| konsole.mjs | `node konsole.mjs --routen /` | Konsolenfehler, Warnungen und Netzfehler (Gerät desktop) | läuft |
| a11y.mjs | `node a11y.mjs --routen / --geraet mobil` | axe-core, WCAG 2.0 bis 2.2, Stufen A und AA | läuft (axe-core aus node_modules je Ansicht eingefügt) |
| svg-pruefung.mjs | `node svg-pruefung.mjs --routen /` | SVG-Dateien und SVG je Ansicht | läuft |
| werte-suche.mjs | `node werte-suche.mjs --seit b8e7ea7` | feste Werte im Quelltext, ohne Browser | läuft mit Einschränkung: die Standardbasis fcbcfb2 fehlt im Repository, daher `--seit` angeben |
| messung.mjs | `node messung.mjs --routen / --laeufe 3 --profil mobil` | LCP, CLS, INP, TBT und JS-Menge, Median aus den Läufen | läuft (Probelauf mit einem Lauf; Ergebnisse brauchen drei Läufe) |
| ladeweg.mjs | `node ladeweg.mjs --routen / --laeufe 3` | Ladeweg mobil: Anfragen, FCP, LCP und Wasserfall | läuft |
| bewegung.mjs | `node bewegung.mjs reduziert --routen /` | laufende Animationen bei „Bewegung reduzieren“ | läuft mit Einschränkung: Modi `einzelbilder` und `bildrate` noch nicht probiert |
| animationen.mjs | `node animationen.mjs --routen / --geraet mobil` | CSS-Animationen, Übergänge und WAAPI je Ansicht | läuft mit Einschränkung: `--bedienen` noch nicht probiert |
| textabzug.mjs | `node textabzug.mjs sichern`, `vergleichen` | Text der sechs Rechtsseiten festhalten und vergleichen | läuft (Probelauf sichern und vergleichen) |
| gefuellt.mjs | `node gefuellt.mjs --geraet mobil` | Warenkorb und Kasse mit Inhalt fotografieren | läuft |
| logikwaechter.mjs | `node logikwaechter.mjs sichern`, `pruefen` | Fingerabdruck geschützter Dateien, Abweichung bei Logikänderung | läuft (das Protokoll im Repository legt der Orchestrator an) |
| funktionsliste.mjs | `node funktionsliste.mjs --nur F-01,F-04 --md <datei>` | Funktionen F-01 bis F-14 im Browser | läuft (Probelauf: 14 von 14 BESTANDEN) |

- `node lighthouse.mjs [--routen <pfad,pfad>] [--laeufe 3] [--profil mobil|desktop]` – Lighthouse je Hauptansicht als Median aus frischen Läufen, mit Budgetspalte „erfüllt“
- `node kontaktbogen.mjs --bilder <ordner oder dateien> --ziel <datei.jpg> [--spalten 4] [--titel text]` – Kontaktbogen aus Bildern als ein JPEG mit Dateinamen
- `node inventar.mjs [--basis http://localhost:3000] [--max 2000] [--manifest <datei>]` – Inventar der Seiten mit Status, Weiterleitungen, Meta-Angaben, Strukturdaten und Dubletten
- `node snippet.mjs [--inventar <json>]` – Titelbreite in Pixeln (20px Arial, hier Liberation Sans) und Beschreibungslänge je indexierbarer Seite
- `node slopscan.mjs [--routen p,p] [--geraet mobil|desktop|beide]` – Slop-Scan S1 bis S8 je Ansicht und Gerät mit Slop-Index
- `node stil.mjs [--routen p,p | --alle] [--quellen]` – Stilprüfung nach Auftrag 14 und S9 (Gedankenstriche, Floskeln, Bindestriche, Fragen, Platzhalter)
- `node svgo-pruefung.mjs [dateien…]` – SVGO-Voreinstellung je SVG prüfen, schreibt nichts
- `node kontingent.mjs [--seit ISO] [--kalibrieren % --zeit ISO]` – Kontingent aus den Sitzungsprotokollen schätzen und kalibrieren
- `node plan.mjs pruefen|naechste|setze|stand|zeichne|abschluss` und `node anforderungen.mjs pruefen|zeichne|zusammenfuehren` – Plan und Anforderungs-Spur (Selbsttest: `node --test plan.pruef.mjs`)
- `./sicher.sh [--json|--pg] -- <befehl>` – Datenweiche für jeden Projektbefehl (Selbsttest: `./sicher.test.sh`)

## Hinweise je Werkzeug

- `messung.mjs --vergleich <url>` misst abwechselnd gegen einen zweiten Server und ergänzt eine Vergleichstabelle. Zeigt der zweite Server auf denselben Rechner und Port, bricht das Werkzeug ab.
- `ladeweg.mjs --basis <url>` überschreibt Port 3000, etwa für einen Vergleichsserver.
- `bewegung.mjs einzelbilder` und `bildrate` nehmen den ersten gerenderten Treffer des Selektors. Ohne gerenderten Treffer ist es ein Bedienfehler.
- `animationen.mjs --bedienen` bedient Schublade, Untermenü, Megamenü, Akkordeon, „Weiter“ und „Zurück“. Knöpfe, die absenden, übergeht es.
- `funktionsliste.mjs --tastatur` bedient alles nur mit Tab, Pfeiltasten, Leertaste und Enter. Die Überschrift des Markdowns nennt noch die Kennung E0-PRUEFER-04; das ist ein Altbestand im Text.
- `textabzug.mjs` legt den Ordner nur bei `sichern` an. `vergleichen` ohne vorherige Sicherung endet mit Bedienfehler 2.
- `logikwaechter.mjs pruefen` braucht ein Protokoll; ohne `sichern` endet es mit Bedienfehler 2.
