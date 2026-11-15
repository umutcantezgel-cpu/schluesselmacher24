# FA-SEO-02 · Eigene Onpage-Prüfung über alle Seiten des Builds (Kriterien wie bei Seobility)

Kopf: Etappe FA Priorität 6 · Rolle Prüfer · Modell Haiku · Stufe 1 bis 2 (Werkzeug nach Muster) · Kostenklasse M · Anforderungen FA-25-21, FA-25-22, FA-AB-04, FA-25-01 bis -04, FA-25-20 · Recherche: `_werkstatt/ausbau/erhebung/FA-RECHERCHE-05.md` · Muster: vorhandene Prüfwerkzeuge in `_werkstatt/ausbau/werkzeuge/` (lies `inventar.mjs` oder das Werkzeug, das Adressen, Titel und Beschreibungen erhebt, und `a11y.mjs` für den Aufbau mit Playwright).

## Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft, berichtet knapp mit Belegpfaden. Fehler, die du vermeidest: Entwicklungsserver statt Produktions-Build; deuten statt berichten; Schwellen erfinden.

## Aufgabe in einem Satz
Baue das Werkzeug `_werkstatt/ausbau/werkzeuge/onpage.mjs`, das jede indexierbare Seite des laufenden Produktions-Builds nach technischen und Onpage-Kriterien prüft, je Seite einen Wert zwischen 0 und 100 bildet und eine Befundliste schreibt.

## Vorgabe des Inhabers (wörtlich)
„Seobility für technische und Onpage Kontrolle verwenden. Ziel: nach Fertigstellung bei den wichtigen Seiten möglichst über 95 Prozent, idealerweise in Richtung 98 Prozent Seobility Score, soweit dies technisch sinnvoll erreichbar ist. Der Score ist ein Qualitätsindikator, aber kein Selbstzweck.“ Seobility selbst braucht ein Konto und die öffentliche Adresse; das Werkzeug stellt die belegten Prüfungen am eigenen Build nach, damit Fehler vor dem Livegang sichtbar sind. Es behauptet nicht, der Seobility-Score zu sein.

## So bauen
1. Lies `erhebung/FA-RECHERCHE-05.md`. Verwende nur Kriterien und Schwellen, die dort belegt sind oder in der Google-Dokumentation stehen; jede Prüfung trägt im Code ihre Quelle als Kommentar. Wo die Recherche keine Schwelle belegt, nutze die Schwellen des Bestands (Titel bis 580 Pixel beziehungsweise höchstens 60 Zeichen, Beschreibung 120 bis 160 Zeichen; siehe `_werkstatt/ausbau/LAGEBILD.md` Abschnitt 4) und kennzeichne sie als „Schwelle des Projekts“.
2. Adressen: aus der Sitemap des laufenden Servers (`http://localhost:3000/sitemap.xml`), dazu die Startseite. Kein Abruf nach außen; blockiere im Browser jede fremde Adresse.
3. Prüfungen je Seite (jede einzeln an- und abschaltbar, jede mit Gewicht): Statuscode 200 · genau ein Titel, Länge · Beschreibung vorhanden, Länge · genau eine h1 · Überschriften ohne Sprung in der Ebene · Sprachangabe `lang="de"` · Canonical vorhanden und auf die eigene Adresse · kein `noindex` auf einer Seite der Sitemap · Bilder mit Alt-Text · interne Verweise ohne Fehlerziel (Stichprobe je Seite gegen die Sitemap und per HEAD am lokalen Server) · sprechende Ankertexte (kein „hier“, „mehr“) · Titel und Beschreibung über alle Seiten eindeutig · Textmenge (Wörter im Hauptinhalt) · strukturierte Daten als gültiges JSON · Größe des HTML-Dokuments · Viewport-Angabe · Favicon.
4. Seitenübergreifend: doppelte Titel, doppelte Beschreibungen, Seiten ohne eingehenden internen Verweis, `robots.txt` und Sitemap erreichbar, Sitemap ohne Fehleradressen.
5. Ausgabe: `_werkstatt/ausbau/protokolle/onpage.json` (alle Werte) und `_werkstatt/ausbau/berichte/FA-SEO-02-onpage.md` (Tabelle je Seite: Wert, rote und gelbe Befunde; oben Zusammenfassung: Zahl der Seiten, Median, Seiten unter 95, die zehn häufigsten Befunde). Aufruf: `_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/onpage.mjs [--nur /pfad] [--grenze 95]`; Rückgabewert 1, wenn eine Seite unter der Grenze liegt.
6. Selbsttest: `_werkstatt/ausbau/werkzeuge/onpage.test.mjs` mit kleinen HTML-Beispielen für jede Prüfung (ohne Server), ausführbar mit `node --test`.
7. Lauf: Der Produktionsserver läuft auf Port 3000 (prüfe mit `bash _werkstatt/ausbau/werkzeuge/server.sh status`; starte ihn nicht neu und baue nicht, andere Pakete arbeiten gerade am Quelltext). Führe das Werkzeug einmal über alle Seiten aus und berichte die Zahlen. Abhängigkeiten der Werkzeuge liegen unter `/root/sm24-werkzeuge` (siehe `protokolle/einrichtung.md` Abschnitt 11; richte sie so ein, falls sie fehlen).

## Schreibrechte
Nur: _werkstatt/ausbau/werkzeuge/onpage.mjs, onpage.test.mjs, _werkstatt/ausbau/protokolle/onpage.json, _werkstatt/ausbau/berichte/FA-SEO-02-onpage.md, _werkstatt/ausbau/berichte/FA-SEO-02.md (dein Bericht). Keine Datei unter src, content oder scripts.

## Grenzen
G1 (nur localhost), G5, G7 (keine neue Abhängigkeit im Projekt; Werkzeug-Abhängigkeiten nur, wenn sie in `_werkstatt/ausbau/werkzeuge/package.json` schon stehen), G8. Kein git.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahl der Seiten, Median, Seiten unter 95, häufigste Befunde) · BELEGE · OFFENE FRAGEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-02 · BEREIT ZUR RÜCKGABE ===
