# FA-INHALT-02 · Hersteller und Systeme früh sichtbar: Bereich auf der Startseite, BKS und ABUS bei Sperrschließungen, BKS, ABUS und BURG-WÄCHTER beim elektronischen Zutritt

Kopf: Etappe FA Priorität 5 · Rolle Autor und Baumeister · Modell Opus · Stufe 3 (Marken Dritter, R12) · Kostenklasse M · kein Datenschema (nutzt die Sammlung `Hersteller` aus FA-SHOP-01) · Anforderungen FA-17-02, FA-17-03, FA-17-20, FA-19-01 bis FA-19-05, FA-15-01, FA-15-02 · Befunde: `berichte/FA-ABGLEICH.md` Blöcke 08 und 07 · Recherche: `erhebung/FA-RECHERCHE-06.md` · Voraussetzung: FA-SHOP-01 ist abgenommen.

## Aufgabe in einem Satz
Zeige die Hersteller, mit deren Systemen die Werkstatt arbeitet, früh und sachlich: ein ruhiger Partner- und Systembereich auf der Startseite und die Hersteller in den Bereichen Sperrschließungen und elektronischer Zutritt, mit kurzer Erklärung des Einsatzes und mit Logos erst nach Freigabe.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026)
- Abschnitt 19: „BKS, ABUS und BURG WÄCHTER sollen nicht erst tief auf Unterseiten auftauchen. Bereits beim normalen Scrollen auf der Startseite soll ein hochwertiger Partner und Systembereich erscheinen. BKS und ABUS bei Sperrschließungen. BKS, ABUS und BURG WÄCHTER bei elektronischen Zutrittslösungen. Kurz erklären, wofür die jeweiligen Systeme eingesetzt werden. Logos nur in freigegebener Form und in guter Qualität verwenden. Nicht mit beliebigen Herstellerlogos werben, wenn keine entsprechende Zusammenarbeit oder Bezugsbeziehung besteht.“
- Abschnitt 15: „BKS und ABUS als Hauptpartner beziehungsweise angebotene Systeme sichtbar darstellen. Herstellerlogos sauber nach den jeweiligen Markenvorgaben einbinden.“
- Abschnitt 17: „BKS, ABUS und BURG WÄCHTER als angebotene Hersteller beziehungsweise Partner sichtbar darstellen. Herstellerlogos bereits beim Scrollen auf der Startseite in einem professionellen Partnerbereich sichtbar machen.“

## So bauen
1. Daten: In der Sammlung `Hersteller` (FA-SHOP-01) drei Einträge als Startbestand: BKS, ABUS, BURG-WÄCHTER, in der Schreibweise der Hersteller laut Recherche 06, je mit den Bereichen (Sperrschließungen: BKS, ABUS; elektronischer Zutritt: BKS, ABUS, BURG-WÄCHTER), „angeboten“ gesetzt (der Inhaber nennt sie selbst als angebotene Hersteller), Logo leer und „Freigabe liegt vor“ nicht gesetzt. Der Einsatzzweck je Hersteller und Bereich in ein bis zwei sachlichen Sätzen, nur aus dem, was die Recherche mit Herstellerquelle belegt (Systemnamen nur belegte; keine Leistungsversprechen, keine Preisangaben, kein „Partner“ im Sinne einer Auszeichnung, solange kein Beleg vorliegt: die Seite sagt „Wir arbeiten mit Systemen von …“).
2. Baustein `HerstellerBereich` (Server-Komponente, `src/components/hersteller/`): Überschrift („Systeme, mit denen wir arbeiten“), je Hersteller eine ruhige Karte mit dem Namen als Schriftzug in der Seitenschrift (kein nachgebautes Logo, keine Herstellerfarben), Einsatzzweck, Verweis in den passenden Bereich. Liegt ein freigegebenes Logo vor (Haken und Datei), ersetzt es den Schriftzug, in Originalfarben und mit Schutzraum; sonst nie. Hochwertig und ruhig, nur Tokens des Designsystems, mobil zuerst.
3. Einbindung: Den Baustein baust und testest du; in die Startseite bindet ihn der Orchestrator ein (nenne die Stelle: nach dem Abschnitt „Bestellen ohne Termin“, vor „Projekte“). Du bindest ihn selbst ein auf `/gleichschliessende-zylinder` (nur BKS und ABUS) und `/elektronische-zutrittsloesungen` (alle drei), jeweils früh auf der Seite, und zeigst die Hersteller im Zutritts-Konfigurator dort, wo heute die leere Herstellerliste steht.
4. Zylinderkatalog (Global, Reiter Hersteller): Er hat schon Felder für Hersteller mit Beschreibung; verbinde ihn mit dem Hersteller-Stamm (Auswahl statt Doppelpflege), ohne Preise oder Maßbereiche zu ändern (G9). Ohne Preisdaten der Hersteller bleibt der Konfigurator, wie er ist.
5. Für Menschen (in den Bericht und als Vorlage nach `_werkstatt/ausbau/AUSSEN.md`, falls die Datei existiert, sonst in den Bericht): je Hersteller ein kurzes, fertiges Anschreiben mit der Bitte um Logo-Freigabe und Markenvorgaben, mit der Stelle aus der Recherche, an die es geht. Nichts abschicken.

## Schreibrechte
- neu: src/components/hersteller/** mit Tests; ändern: content/hersteller.json und der Rückfall dazu (nur die drei Einträge), src/app/(site)/gleichschliessende-zylinder/page.tsx, src/app/(site)/elektronische-zutrittsloesungen/page.tsx und der Zutritts-Konfigurator (nur die Herstelleranzeige), src/payload/globals/Zylinderkatalog.ts und das zugehörige Mapping (nur die Verbindung zum Stamm; falls das eine Migration braucht, lass es und beschreibe es im Bericht)
- _werkstatt/ausbau/berichte/FA-INHALT-02.md
Nicht anfassen: src/app/(site)/page.tsx, Navigation, Preise, Rechtstexte.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`. Kein Build, kein Server, keine Befehle mit `--pg`, kein git. Tests: ohne Freigabe wird kein Logo ausgegeben, auch wenn eine Datei hinterlegt ist; nur angebotene Hersteller erscheinen; Sperrschließungen zeigen genau BKS und ABUS.

## Grenzen
R4, R8, R11, R12 (Herstellermarken nur sachlich; Logos nur nach Markenrichtlinie und Freigabe; kein Anschein einer Partnerschaft ohne Beleg), G9. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE (Quelle je Systemname und Einsatzzweck) · ANSCHREIBEN (drei Entwürfe) · OFFENE FRAGEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-02 · BEREIT ZUR RÜCKGABE ===
