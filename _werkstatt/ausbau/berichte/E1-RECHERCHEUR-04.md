# E1-RECHERCHEUR-04 · Bericht Lagebild Suche

## GEÄNDERTE DATEIEN

Keine Projektdatei geändert. Neu angelegt: `_werkstatt/ausbau/erhebung/E1-lagebild-suche.md` und diese Datei. Nichts committet, nichts gepusht.

## WAS UND WARUM

Auftrag Abschnitt 13 verlangt, die Aussagen des Lagebilds gegen offizielle Quellen von Google und Bing zu prüfen. Geprüft wurden 13 Aussagen und 14 Prüfpunkte aus Schritt 3: Strukturdaten, Snippet-Steuerung, Speculation Rules, llms.txt, KI-Crawler und Messung. Vorgehen: robots.txt je Domain vorab, danach einzelne Abrufe. Jede Aussage trägt URL, Abrufdatum, Stand und Belegstufe.

## GEMEINSAME DATEIEN (nur Vorschläge, nicht umgesetzt)

1. AUFTRAG.md Abschnitt 13: „Seit Mai 2026 gelten die Spam-Richtlinien ausdrücklich auch für KI-Funktionen“ ersetzen durch „Seit 15. Mai 2026 gelten die Spam-Richtlinien ausdrücklich auch für generative KI-Antworten in der Google-Suche“.
2. AUFTRAG.md Abschnitt 13: „Sonderfassungen für Bots sind Cloaking“ ersetzen durch „Sonderfassungen für Suchmaschinen-Bots sind Cloaking“.
3. AUFTRAG.md Abschnitt 13: „Viele KI-Crawler lesen nur das ausgelieferte HTML“ ergänzen um „(Messung von Dezember 2024, neuere nicht gefunden)“.
4. AUFTRAG.md Abschnitt 13: „Bing Webmaster Tools zeigt KI-Zitate“ ergänzen um „(Vorschau seit 10. Februar 2026)“.
5. AUFTRAG.md Abschnitt 13: „IndexNow meldet Änderungen“ ergänzen um „an Bing und weitere Dienste, nicht an Google“.
6. LAGEBILD.md: Befunde aus Abschnitt 4 der Ergebnisdatei als Einträge mit Quelle und Stand aufnehmen.

## PRÜFUNG UND ERGEBNIS

- Lagebild, 13 Aussagen: 11 bestätigt, 1 bestätigt für den Stand Dezember 2024 (Nr. 10), 1 nicht belegt (Nr. 6), 0 abweichend.
- Schritt 3, 14 Prüfpunkte: 9 mit Änderungen 2026, 5 ohne belegte Änderung.
- Wichtigste Befunde: Die FAQ-Anzeige ist seit 7. Mai 2026 entfallen. Die Prüfpflicht für KI-Texte bei Titel, Beschreibung, Strukturdaten und Alt-Texten steht im Vermerk vom 1. Oktober 2026. Google Search ignoriert llms.txt. IndexNow erreicht Google nicht. Der Bericht zu generativer KI in der Search Console zeigt seit 3. Juni 2026 Impressionen.

## BELEGE

- 33 Seiten gelesen, 26 als Beleg zitiert. Zwei Adressen lieferten 404. 11 robots.txt geprüft, keine Sperre für die abgerufenen Pfade.
- Stufe A nur für den Vercel-Bericht (Messung vom 17. Dezember 2024). Herstellerangaben Stufe B, Schlüsse Stufe C.
- Markt: global, Sprache Englisch. Deutsche Ergebnisse nicht erhoben, die Websuche ist US-gewichtet.
- Ergebnisdatei: `_werkstatt/ausbau/erhebung/E1-lagebild-suche.md`.

## OFFENE FRAGEN

1. Bing und llms.txt: keine offizielle Aussage gefunden.
2. Google-Extended: offizielle Dokumentation nicht auffindbar. Gestützt nur durch den Beitrag vom 30. Oktober 2026.
3. Gemeinsames KI-Trainingssignal: für 2027 geplant. Token-Name und weitere Unterstützer sind nicht belegt.
4. Aktuelle Messung, ob KI-Crawler JavaScript ausführen, fehlt.
5. Ergebnisbilder für Deutschland und Hessen fehlen. Die Datenanfrage zu Keywords steht in MENSCHEN.md.
6. Wirkung von FAQ-Markup ohne Anzeige: nicht geklärt.
7. Inhaberentscheidungen: GPTBot, ClaudeBot, Google-Extended (Training) und die Grenze für max-snippet.
