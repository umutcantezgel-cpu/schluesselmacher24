# Prüfwerkzeuge des Gestaltungslaufs

## Einrichtung

Auch in einer neu aufgesetzten Umgebung, im Repository-Wurzelordner:

```
mkdir -p /root/sm24-werkzeuge
cp _werkstatt/werkzeuge/package.json /root/sm24-werkzeuge/
(cd /root/sm24-werkzeuge && npm install --no-audit --no-fund)
ln -sfn /root/sm24-werkzeuge/node_modules _werkstatt/werkzeuge/node_modules
```

Die Abhängigkeiten liegen außerhalb des Repositorys. Der Symlink ist in `.gitignore` erfasst. Chromium kommt aus `lib.mjs` (`/opt/pw-browsers/…`, überschreibbar mit `SM24_CHROMIUM`). Ein Produktionsserver läuft über `./_werkstatt/werkzeuge/server.sh start` (Voraussetzung: `SM24_DATA=json npx next build`).

## Skripte

- `server.sh start|stop|status|neu` – Produktionsserver auf Port 3000, idempotent.
- `node bild.mjs <pfad> [--geraet mobil|tablet|desktop|alle] [--ganz] [--reduziert] [--warte ms] [--ziel ordner] [--name praefix]` – Bildschirmfoto einer Seite je Gerät, JPEG Qualität 60.
- `node bildsatz.mjs [--routen p,p] [--ziel ordner] [--max n]` – Bildsatz der Hauptansichten je Gerät mit Überlaufprüfung.
- `node messung.mjs [--routen p,p] [--laeufe 3] [--profil mobil|desktop|beide]` – LCP, CLS, INP-Näherung, TBT, JS-Menge und Übertragung; Median (Min–Max) je Ansicht und Profil, Budgetverstöße am Median.
- `node a11y.mjs [--routen p,p] [--geraet mobil|desktop|beide]` – axe-core, WCAG 2.0/2.1/2.2 Stufen A und AA.
- `node konsole.mjs [--routen p,p]` – Konsolenfehler, Warnungen, Seitenfehler und Netzfehler (Desktop).
- `node bewegung.mjs reduziert [--routen p,p]` – laufende Animationen und verborgene Textelemente bei „Bewegung reduzieren“.
- `node bewegung.mjs einzelbilder <pfad> --selektor <css> --dauer <ms> [--geraet mobil|desktop] [--ziel ordner]` – 5 Bilder eines Auftritts bei 0, ¼, ½, ¾, 1 der Dauer.
- `node bewegung.mjs bildrate <pfad> --selektor <css> --dauer <ms>` – verworfene Bilder in % (mobil, CPU 4-fach gedrosselt), Schwelle 5 %.
- `node werte-suche.mjs [--seit commit] [dateien…]` – feste Werte im Quelltext: Tailwind-Klassen mit `[…]`, Hex-Farben, `rgb(`/`hsl(`/`oklch(`, `style` mit px/rem; Bildinhalte getrennt ausgewiesen.

## Gemeinsame Regeln

- Ausgabe: Markdown-Tabelle auf stdout und JSON-Protokoll. Standard `_werkstatt/protokolle/<skript>-<zeitstempel>.json`, mit `--json <datei>` anders.
- Exit-Codes: 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
- Bilder landen standardmäßig außerhalb des Repositorys (`/root/sm24-bilder`, `SM24_BILDER`), nur mit `--ziel` anders.
- Schreibende Anfragen fängt `attrappenSetzen()` aus `lib.mjs` ab. Fremde Anfragen außer Google-Schriften werden abgebrochen; dadurch fehlen Netzmengen externer Quellen in `messung.mjs`, und `konsole.mjs` zählt sie getrennt als Attrappen-Abbrüche.
- `messung.mjs`: Der Klick trifft den ersten sichtbaren Knopf, der nicht im Formular liegt und kein Absende-Knopf ist. TBT = Summe (Dauer − 50 ms) der Long Tasks bis 5 s nach Ladebeginn. INP 0 bedeutet kein Ereignis über 16 ms.
- `bewegung.mjs einzelbilder` lädt ohne Durchscrollen, damit der Auftritt beim Scrollen zum Element ausgelöst wird.
