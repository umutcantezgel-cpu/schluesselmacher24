# E3-PRUEFER-01 · Berichte aus Workflow wf_a39c6e70-8a1

## E3-PRUEFER-01 Prüfstufe A L-09/L-14
GEÄNDERTE DATEIEN
Keine Projektdatei geändert. Nur Protokolle unter _werkstatt/protokolle/E3-PRUEFER-01-* und Bilder unter /root/sm24-bilder/E3-PRUEFER-01/ angelegt. Nicht committet, nicht gepusht.

WAS UND WARUM
Prüfstufe A nach Arbeitspaket E3-PRUEFER-01 für E3-L-09 (404, Fehlergrenze) und E3-L-14 (Zeichnungsblatt). Schritte 1 bis 7 ausgeführt.

GEMEINSAME DATEIEN
Keine Befunde in fremden Dateien. Die Lint-Warnung betrifft schluesselarten-reihe.tsx (E3-L-14). Gemeinsame Bausteine (fehler-ansicht.tsx) sind Teil von E3-L-09 und ohne Befund in eslint.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: 0 Fehler (Protokoll leer). Pfad: _werkstatt/protokolle/E3-PRUEFER-01-typecheck.log
- eslint (4 Dateien + Test): 1 Warnung, schluesselarten-reihe.tsx:4 (cn ungenutzt). Pfad: _werkstatt/protokolle/E3-PRUEFER-01-lint.log
- vitest (autoschluessel + stiftzuhaltung): 2 Dateien, 13 Tests, alle bestanden. Pfad: _werkstatt/protokolle/E3-PRUEFER-01-test.log
- werte-suche (4 Dateien + Test): keine Funde. Pfad: _werkstatt/protokolle/E3-PRUEFER-01-werte-suche.json
- Quelltext 404: genau eine h1 (src/components/layout/fehler-ansicht.tsx:47).
- Quelltext Fehlergrenze: retry() vorhanden (src/app/(site)/error.tsx:19); error.digest nur bei Vorhandensein (:29). Texte nennen Ursache und nächsten Schritt. package.json unverändert.
- Urteil E3-L-09 (404 und Fehlergrenze): NICHT BESTANDEN. Die Pflicht-URL /gibt-es-nicht-pruefung zeigt die Standardseite von Next.js statt der eigenen 404-Seite. Wahrscheinliche Ursache, nicht abschließend geprüft: Keine src/app/not-found.tsx für Adressen außerhalb der Route-Gruppe (site). Die Fehlergrenze ist nur am Quelltext belegt.
- Urteil E3-L-14 (Zeichnungsblatt): BESTANDEN MIT BEFUND (eine Lint-Warnung).
- Protokoll: _werkstatt/protokolle/E3-PRUEFER-01-ergebnis.md (Tabelle Prüfung · Ergebnis · Beleg je Paket).

BILDBELEGE
- Pflicht-URL /gibt-es-nicht-pruefung (Port 3001), alle drei Geräte, ganze Seite: zeigt die Next.js-Standardseite, nicht die eigene 404-Seite. Dateien: /root/sm24-bilder/E3-PRUEFER-01/fehler-404__mobil__ganz.jpg, fehler-404__tablet__ganz.jpg, fehler-404__desktop__ganz.jpg (Protokoll: bild.json).
- Zusatzprobe innerhalb der Site, /schluessel-nach-code/gibt-es-nicht-pruefung, alle drei Geräte, ganze Seite: eigene 404-Seite mit Zylinderschnitt (Code 404), Auswegen und der vollständigen Liste mit 9 Bereichen, Site-Kopf und -Fuß sichtbar. Dateien: /root/sm24-bilder/E3-PRUEFER-01/fehler-404-in-site__mobil__ganz.jpg, fehler-404-in-site__tablet__ganz.jpg, fehler-404-in-site__desktop__ganz.jpg (Protokoll: bild-in-site.json).
- Mobil (390 px): Die untere Navigationsleiste überdeckt im Ganzseitenbild den Eintrag "Autoschlüssel". Vermutlich Artefakt der fixierten Leiste, nicht bewertet.

OFFENE FRAGEN
1. Ist die Ursache der Standardseite wirklich das Fehlen einer src/app/not-found.tsx außerhalb der Route-Gruppe (site)? Nicht im Quelltext getestet, nur aus dem Verhalten abgeleitet.
2. Die Fehlergrenze (error.tsx) wurde zur Laufzeit nicht ausgelöst; nur am Quelltext belegt.
3. Im gerenderten DOM der Site-404 erscheint zusätzlich das Next-Fallback-h1 (next-error-h1). Ob es sichtbar ist, ist nicht belegt.
4. Fokus- und Hover-Zustände sind mit Ganzseitenbildern nicht belegt.
5. Die Lint-Warnung zu cn (schluesselarten-reihe.tsx:4) ist eine Warnung, kein Fehler. Ob sie als Befund zählt, entscheidet der Orchestrator.

=== ENDE E3-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
