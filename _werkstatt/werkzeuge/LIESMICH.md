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
  - `--vergleich <url>` misst Lauf um Lauf abwechselnd gegen einen zweiten Server (z. B. E0 auf 3100) und ergänzt eine Vergleichstabelle: Median jetzt, Median Vergleich, Spanne, Differenz, erfüllt (Differenz ≤ Spanne oder ≤ 0), dazu je Serie „Läufe (mit Wert)“. Spanne erst ab zwei Werten, sonst „–“ und „nicht bewertbar“. Zeigt der zweite Server auf denselben Rechner und Port wie die Messung (localhost, 127.0.0.1 und ::1 gelten als gleich), bricht das Werkzeug ab. JSON-Schlüssel `vergleich`. Beispiel: `node messung.mjs --routen / --laeufe 2 --profil mobil --vergleich http://localhost:3100`.
- `node ladeweg.mjs [--routen p,p] [--laeufe 3] [--basis <url>] [--json datei]` – Ladeweg mobil wie `messung.mjs` (gleiche Drosselung): Anfragen mit Typ, Priorität, Start, Ende und Bytes über CDP, FCP, LCP mit Element, Schriftstand bei FCP, Long Tasks vor FCP, Bytes vor FCP je Typ, Wasserfall des mittleren Laufs. `--basis` überschreibt Port 3000, z. B. `node ladeweg.mjs --routen / --basis http://localhost:3100` für E0.
- `node a11y.mjs [--routen p,p] [--geraet mobil|desktop|beide]` – axe-core, WCAG 2.0/2.1/2.2 Stufen A und AA.
- `node konsole.mjs [--routen p,p]` – Konsolenfehler, Warnungen, Seitenfehler und Netzfehler (Desktop).
- `node bewegung.mjs reduziert [--routen p,p]` – laufende Animationen und verborgene Textelemente bei „Bewegung reduzieren“.
- `node bewegung.mjs einzelbilder <pfad> --selektor <css> [--dauer <ms>] [--echtzeit] [--rand <px>] [--geraet mobil|desktop] [--ziel ordner]` – 5 Bilder bei 0, ¼, ½, ¾, 1 der Animationszeit des Moments (Standard); `--echtzeit` = alter Wanduhr-Ablauf (braucht `--dauer`); `--rand` Standard 24 px.
- `node bewegung.mjs bildrate <pfad> --selektor <css> --dauer <ms>` – verworfene Bilder in % (mobil, CPU 4-fach gedrosselt), Schwelle 5 %.
- `node funktionsliste.mjs [--nur F-xx,…] [--json datei] [--tastatur] [--geraet mobil|tablet|desktop]` – Funktionen F-01 bis F-14 im Browser; `--tastatur` bedient alles nur mit Tab, Pfeiltasten, Leertaste und Enter und protokolliert je Bedienung Tab-Schritte und sichtbaren Fokus (Abschnitt „Tastatur“ im Markdown).
- `node svg-pruefung.mjs [--routen p,p] [--json datei]` – alle SVG-Dateien (viewBox, Editor-Reste, Kommentare, Nachkommastellen) und die SVG je Ansicht (benannt oder verborgen, doppelte id, lucide-Reste, Familie).
- `node animationen.mjs [--routen p,p] [--geraet mobil|desktop] [--json datei] [--bedienen]` – jede abgelaufene CSS-Animation, jeder Übergang und jede WAAPI-Animation je Ansicht; unbekannte Keyframes sind Befunde (Abgleich mit dem Register K-007).
  - `--bedienen` bedient nach dem Durchscrollen Schublade und Untermenü (mobil) bzw. Megamenü (Desktop), Akkordeon und „Weiter“/„Zurück“; Spalte „Bedienung“ zeigt gefunden/ausgeführt je Schritt. Knöpfe, die absenden (type="submit" oder ohne type im Formular), werden für Akkordeon, Weiter und Zurück übergangen. Beispiel: `node animationen.mjs --routen /,/autoschluessel/anfrage --geraet mobil --bedienen`.
- `node werte-suche.mjs [--seit commit] [dateien…]` – feste Werte im Quelltext: Tailwind-Klassen mit `[…]`, Hex-Farben, `rgb(`/`hsl(`/`oklch(`, `style` mit px/rem; Bildinhalte getrennt ausgewiesen.

## Gemeinsame Regeln

- Ausgabe: Markdown-Tabelle auf stdout und JSON-Protokoll. Standard `_werkstatt/protokolle/<skript>-<zeitstempel>.json`, mit `--json <datei>` anders.
- Exit-Codes: 0 Lauf fertig (auch mit Befunden), 2 Bedienfehler, 1 technischer Fehler.
- Bilder landen standardmäßig außerhalb des Repositorys (`/root/sm24-bilder`, `SM24_BILDER`), nur mit `--ziel` anders.
- Schreibende Anfragen fängt `attrappenSetzen()` aus `lib.mjs` ab. Fremde Anfragen außer Google-Schriften werden abgebrochen; dadurch fehlen Netzmengen externer Quellen in `messung.mjs`, und `konsole.mjs` zählt sie getrennt als Attrappen-Abbrüche.
- `messung.mjs`: Der Klick trifft den ersten sichtbaren Knopf, der nicht im Formular liegt und kein Absende-Knopf ist. TBT = Summe (Dauer − 50 ms) der Long Tasks bis 5 s nach Ladebeginn. INP 0 bedeutet kein Ereignis über 16 ms.
- `bewegung.mjs einzelbilder` und `bewegung.mjs bildrate` nehmen den ersten **gerenderten** Treffer des Selektors (Breite > 0). Protokoll und Text nennen Index unter allen Treffern, Größe in px und viewBox. Ohne gerenderten Treffer ist es ein Bedienfehler mit Zahl der versteckten Treffer. Beispiel: `node bewegung.mjs bildrate /schliessanlagen --selektor "main header [role=img]" --dauer 1600 --geraet mobil`.
- `bewegung.mjs einzelbilder` lädt ohne Durchscrollen, scrollt das Element in den Blick und wartet auf die zugehörige Hülle (Vorfahre oder Nachfahre mit `data-motion`, höchstens 5 s, bis „play“). Danach werden alle endlichen Animationen des Elements und seiner Hülle (ohne CSS-Übergänge) nach `ready` gesetzt, zwei Frames gewartet, pausiert und je Bild auf dieselbe absolute Zeit gesetzt (`currentTime`, inkl. Verzögerung). Zeitfenster: kleinste Verzögerung bis größte endliche Endzeit; unendliche Animationen werden übersprungen. Ein Element kleiner als 200 × 120 px (eine Seite) wird auf den nächsten Vorfahren mit `role="img"` oder `<svg>` erweitert; das steht im Protokoll.
