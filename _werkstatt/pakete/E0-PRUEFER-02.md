E0-PRUEFER-02 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 0 · Schreibrechte (exakt): `_werkstatt/werkzeuge/bild.mjs`, `bildsatz.mjs`, `messung.mjs`, `a11y.mjs`, `konsole.mjs`, `bewegung.mjs`, `werte-suche.mjs`, `LIESMICH.md`, außerhalb des Repos `/root/sm24-werkzeuge/**` und `/root/sm24-bilder/**`, dazu der Symlink `_werkstatt/werkzeuge/node_modules` · Umfang: Prüfwerkzeuge für Bild, Bildsatz, Messung, Zugänglichkeit, Konsole, Bewegung und Wertesuche einrichten und je einmal erproben

## Rollenbriefing
Du bist Prüfer. Du richtest Prüfwerkzeuge ein und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen. Du committest und pushst nie und änderst keine Projektdatei.

## Aufgabe in einem Satz
Baue in `_werkstatt/werkzeuge` sieben Node-Skripte (ESM, ohne TypeScript), die alle späteren Pakete für Bilder, Messungen und Prüfungen nutzen, und erprobe jedes einmal an der Startseite.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Gemeinsame Grundlage, **nur lesen und importieren, nicht ändern**: `_werkstatt/werkzeuge/lib.mjs` (Hauptansichten, Geräte, Browserstart, Attrappen, `laden`, `durchscrollen`, `argumente`, Pfade) und `_werkstatt/werkzeuge/server.sh` (`start|stop|status|neu`, Port 3000, JSON-Modus). `package.json` dort nennt `playwright-core@1.56.1` und `@axe-core/playwright@4.10.2`.
- Chromium: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (in `lib.mjs` gesetzt). Kein `playwright install`.
- Budgets: LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms, Bewegungscode ≤ 60 KB komprimiert. Mobilprofil: 390×844, Prozessor 4-fach gedrosselt, Netz „langsames 4G“ (150 ms Latenz, 1,6 Mbit/s runter, 0,75 Mbit/s hoch). Desktopprofil: 1440×900 ohne Drosselung.
- Bilder: JPEG, Qualität 60, Gerätepixelverhältnis 1 (höchstens 1.440 px breit). Standardziel außerhalb des Repos (`BILDER_EXTERN` aus `lib.mjs`); nur mit `--ziel <ordner>` an einen anderen Ort.

## Maßstab
Muster für Aufbau und Stil: `lib.mjs`. Jedes Skript: `#!/usr/bin/env node`, Kopfkommentar mit Zweck und Aufruf (deutsch), Parameter über `argumente()`, Ausgabe als Markdown-Tabelle auf stdout **und** als JSON-Datei (Pfad mit `--json <datei>`; Standard `_werkstatt/protokolle/<skript>-<zeitstempel()>.json`), Exit-Code 0 bei erfolgreichem Lauf auch bei Befunden (Befunde sind Daten), 2 bei Bedienfehler, 1 bei technischem Fehler.

## Grenzen
- Nur die Dateien aus den Schreibrechten. `lib.mjs`, `server.sh` und `package.json` nicht ändern; fehlt dort etwas, melde es unter GEMEINSAME DATEIEN.
- Keine Projektabhängigkeit installieren, kein `npm install` im Repository-Wurzelordner.
- Den Server nur über `server.sh` starten; er läuft eventuell schon (aus E0-PRUEFER-01).
- Rechenintensive Läufe nacheinander.

## Schritte
1. Abhängigkeiten außerhalb des Repos: `mkdir -p /root/sm24-werkzeuge && cp _werkstatt/werkzeuge/package.json /root/sm24-werkzeuge/ && (cd /root/sm24-werkzeuge && npm install --no-audit --no-fund)`, dann `ln -sfn /root/sm24-werkzeuge/node_modules _werkstatt/werkzeuge/node_modules`. Prüfe mit `git status --short`, dass der Symlink ignoriert wird.
2. `bild.mjs` – Aufruf: `node bild.mjs <pfad> [--geraet mobil|tablet|desktop|alle] [--ganz] [--reduziert] [--warte <ms>] [--ziel <ordner>] [--name <praefix>]`. Lädt die Seite mit `laden()`, löst mit `durchscrollen()` alle Auftritte aus, wartet `--warte` (Standard 800 ms) und speichert den ersten Bildschirm (oder mit `--ganz` die ganze Seite). Standard `--geraet alle` erzeugt 3 Bilder. Gibt die Dateipfade aus.
3. `bildsatz.mjs` – Aufruf: `node bildsatz.mjs [--routen <pfad,pfad>] [--ziel <ordner>] [--max <n>]`. Standard: alle 12 `HAUPTANSICHTEN` × 3 `GERAETE`. Je Ansicht und Gerät: laden, durchscrollen, dann für jede Bildschirmhöhe einen Ausschnitt (scrollTo y = k·Höhe, 400 ms warten, Viewport-Bild), höchstens `--max` (Standard 15) Ausschnitte; gekappte Seiten im Bericht vermerken. Dateiname `<id>__<geraet>__<k zweistellig>.jpg`. **Überlaufprüfung** je Ansicht und Gerät: `document.documentElement.scrollWidth > innerWidth` sowie bis zu 10 sichtbare Elemente, deren `getBoundingClientRect().right > innerWidth + 1` oder deren Text abgeschnitten ist (`scrollWidth > clientWidth` bei `overflow:hidden` und nicht `text-overflow:ellipsis` gewollt), mit kurzem CSS-Selektor. Ausgabe: Tabelle „Ansicht · Gerät · Ausschnitte · Überlauf ja/nein · Befunde“.
4. `messung.mjs` – Aufruf: `node messung.mjs [--routen …] [--laeufe 3] [--profil mobil|desktop|beide]`. Je Lauf ein frischer Kontext; mobil per CDP `Emulation.setCPUThrottlingRate {rate:4}` und `Network.emulateNetworkConditions` (Werte oben). Erfasse über `PerformanceObserver` (buffered): LCP (ms), CLS (Summe ohne `hadRecentInput`, nach einmaligem Durchscrollen bis zum Ende), INP-Näherung (größte `event`-Dauer, `durationThreshold: 16`, nach einem Klick auf das erste sichtbare `button` ohne Navigation – beim Kopf zum Beispiel der Menüknopf – und einem Tastendruck `Tab`), TBT (Summe `longtask`-Dauer über 50 ms bis 5 s nach Laden), JS-Menge komprimiert (Summe `transferSize` aller Skript-Ressourcen in KB) und Gesamtübertragung. Berichte je Ansicht und Profil **Median, Minimum und Maximum** der Läufe (die Spanne ist für Z-08 nötig) und markiere Budgetverstöße.
5. `a11y.mjs` – Aufruf: `node a11y.mjs [--routen …] [--geraet mobil|desktop|beide]`. `@axe-core/playwright` mit Tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`. Je Ansicht: Zahl der Befunde nach `impact` (critical, serious, moderate, minor), dazu je ernstem oder kritischem Befund Regel-ID, Hilfetext und bis zu 3 Ziel-Selektoren.
6. `konsole.mjs` – Aufruf: `node konsole.mjs [--routen …]`. Je Ansicht (Desktop) Konsolenfehler, Konsolenwarnungen, `pageerror` und fehlgeschlagene Anfragen (Status ≥ 400 oder `requestfailed`) einsammeln; vorher `durchscrollen()`. Nutze `attrappenSetzen()`.
7. `bewegung.mjs` – drei Modi:
   a. `node bewegung.mjs reduziert [--routen …]`: Kontext mit `reduziert: true`, laden, durchscrollen, dann im Browser `document.getAnimations()` auswerten: laufende Animationen, deren Keyframes `transform`, `translate`, `scale`, `rotate`, `top`, `left`, `width` oder `height` ändern → Befund. Außerdem sichtbare Textelemente (nicht `.sr-only`, nicht `aria-hidden`) mit berechneter `opacity` < 0,1 oder `visibility:hidden` → Befund „Inhalt verborgen“.
   b. `node bewegung.mjs einzelbilder <pfad> --selektor <css> --dauer <ms> [--geraet mobil|desktop] [--ziel <ordner>]`: Element in den Blick scrollen und 5 Bilder gleichmäßig über `--dauer` aufnehmen (bei 0, ¼, ½, ¾, 1 der Dauer), zugeschnitten auf das Element.
   c. `node bewegung.mjs bildrate <pfad> --selektor <css> --dauer <ms>`: mobil 390×844, Prozessor 4-fach gedrosselt; vor dem Auslösen (Element in den Blick scrollen) eine `requestAnimationFrame`-Schleife starten, über `--dauer` + 200 ms alle Zeitstempel sammeln; verworfene Bilder = Summe über alle Abstände von `round(abstand / 16,67) − 1`; Anteil = verworfen ÷ (gezeichnet + verworfen). Ausgabe: Bilder, verworfen, Anteil in %, Schwelle 5 %.
8. `werte-suche.mjs` – Aufruf: `node werte-suche.mjs [--seit <commit>] [dateien…]`. Ohne Dateien: alle `.ts/.tsx/.css`-Dateien aus `git diff --name-only <commit>` (Standard `--seit fcbcfb2`) unter `src/`. Sucht je Zeile: Tailwind-Klassen mit eckigen Klammern (`[a-z-]+-\[[^\]]+\]`, auch mit Präfixen wie `md:` oder `hover:`), Hex-Farben `#[0-9a-fA-F]{3,8}\b` außerhalb von Kommentaren, `rgb(`/`rgba(`/`hsl(`/`oklch(` außerhalb von `src/app/(site)/globals.css` und `tailwind.config.ts`, `style={{ … }}` mit Zahl plus `px`/`rem`. Ausnahmen, die mitgezählt, aber getrennt ausgewiesen werden: Dateien unter `src/components/visual/generators/` und `src/components/visual/icons/` (Bildinhalte, SVG-Koordinaten). Ausgabe: Tabelle „Datei · Zeile · Fund“ und Summe je Datei.
9. `LIESMICH.md` in `_werkstatt/werkzeuge`: Einrichtung (Schritt 1 als Befehle, auch für eine neu aufgesetzte Umgebung), dann je Skript eine Zeile mit Aufruf und Zweck, dazu `server.sh`.
10. Erprobung: `./server.sh start`, dann je Skript einen Lauf, nur für `/` (bei `bewegung.mjs einzelbilder` und `bildrate` mit `--selektor main --dauer 600`). `messung.mjs` mit `--laeufe 3` für `/` mobil. Notiere Laufzeit und Ergebnis je Skript.

## Schnellprüfung und Selbstprüfung
- 7 Skripte vorhanden, jedes einmal mit Exit-Code 0 gelaufen (Befehl und Ausgabepfad im Bericht).
- `git status --short` zeigt nur die erlaubten Dateien; keine Bilder im Repository.
- `node --check <skript>` für alle 7 Skripte ohne Fehler.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste) · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E0-PRUEFER-02 · BEREIT ZUR RÜCKGABE ===
