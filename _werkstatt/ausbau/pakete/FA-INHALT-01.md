# FA-INHALT-01 · Tutorials: eigene Rubrik, zehn Themen, YouTube-Videos im Admin ohne Entwickler, Einbettung mit Einwilligung, Videos auf Leistungsseiten

Kopf: Etappe FA Priorität 5 · Rolle Baumeister und Autor · Modell Opus · Stufe 3 (Datenmodell, Einwilligung, Sicherheitsrichtlinie) · Kostenklasse L · ändert das Datenschema und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-21-01 bis FA-21-14, FA-22-32, FA-12-04, FA-26-06 · Befunde: `berichte/FA-ABGLEICH.md` Block 09, `berichte/FA-KUNDSCHAFTER-09.md` (falls vorhanden), `berichte/FA-BLINDPRUEFUNG-09.md`.

## Aufgabe in einem Satz
Baue die Rubrik „Tutorials“ und die technische Struktur, mit der der Betreiber YouTube-Videos ohne Entwickler ergänzt, austauscht und Leistungsseiten zuordnet, datenschutzgerecht eingebettet und mit vollwertigem Inhalt auch ohne Video.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 21)
„Es soll eine eigene Rubrik ‚Tutorials‘ geben. Zusätzlich werden passende Videos direkt in die jeweiligen Leistungsseiten eingebettet.“ Themen: Wie fotografiere ich einen Schlüssel richtig? · Wie fotografiere ich einen Autoschlüssel richtig? · Wo finde ich die benötigten Angaben im Fahrzeugschein? · Wie funktioniert Schlüssel nach Code? · Wie sende ich meinen Schlüssel ein? · Wie messe ich einen Profilzylinder? · Was ist die Not und Gefahrenfunktion? · Was bedeutet gleichschließend? · Was ist HS und GHS? · Wie funktioniert ein Gehäuseumbau? „Die Videos werden nach und nach geliefert. Die technische Struktur muss jetzt so vorbereitet sein, dass YouTube Videos ohne Entwickleraufwand ergänzt oder ausgetauscht werden können.“ Abschnitt 12: „Video und Bildtutorial integrieren, wie ein Schlüssel richtig fotografiert wird.“

## So bauen
1. Sammlung `Tutorials` (und JSON-Fallback `content/tutorials.json`, Rückfall in `defaults`): Titel (als Frage), Adresse, Kurzantwort (zwei bis drei Sätze), Schritte (nummeriert, je Überschrift, Text, freiwillig Bild aus der Medienablage), freiwillig YouTube-Video (Eingabe: Link oder Kennung; der Server zieht und prüft die Kennung, nur youtube.com, youtu.be und youtube-nocookie.com), Videotitel, Dauer, Datum, Transkript oder Zusammenfassung als Text, „erscheint auf“ (Mehrfachauswahl der Leistungsseiten und Wege, zum Beispiel Schlüssel nach Vorlage, Autoschlüssel-Anfrage, Schlüssel nach Code, Einschicken, Gleichschließende Zylinder, Schließanlagen, Gehäuse), Reihenfolge, veröffentlicht, SEO-Felder. Im Admin kurze Hilfetexte in Alltagssprache („YouTube-Link einfügen, speichern, fertig“).
2. Startbestand: die zehn Themen des Inhabers als Einträge mit Titel und Zuordnung. Inhalt nur, wo der Bestand ihn belegt trägt: Lies die vorhandenen Ratgeber (`content/guides.json`), die Fotoanleitung der Vorlage-Seite, die Messhilfe des Zylinder-Konfigurators, die Erklärungen zu Z, HS und GHS und zur Not- und Gefahrenfunktion und führe sie als Schritte zusammen (verweisen statt verdoppeln, wo ein Ratgeber das Thema schon vollständig trägt). Wo der Bestand nichts Belegtes hat (etwa Gehäuseumbau im Einzelnen), bleibt der Eintrag unveröffentlicht und steht im Bericht unter FÜR MENSCHEN. Keine erfundenen Abläufe, Zeiten, Preise (R4). Kein Video wird erfunden oder verlinkt.
3. Seiten: `/tutorials` (Übersicht, nach Themen gruppiert) und `/tutorials/[slug]`. Jede Seite ist auch ohne Video vollständig (Schritte und Bilder); mit Video steht es oben. Nicht veröffentlichte Einträge erzeugen keine Seite. Eine Seite ohne belegten Inhalt wird nicht indexiert (R3).
4. Baustein `VideoEinbettung`: lädt nichts von YouTube, bevor der Kunde zustimmt. Zuerst eine Fassade aus eigenen Mitteln (kein Vorschaubild von YouTube-Servern; nutze ein Bild aus der Medienablage, falls gepflegt, sonst eine gezeichnete Fläche mit Titel und Dauer), darunter der Satz, dass mit dem Start Daten an YouTube übertragen werden, mit Verweis auf die Datenschutzerklärung, und der Knopf „Video laden“. Nach dem Klick Einbettung über `youtube-nocookie.com`. Die Zustimmung gilt je Sitzung oder über die vorhandene Einwilligungsverwaltung (lies `src/components/recht` und die Cookie-Einstellungen; erweitere sie um die Kategorie „Videos“, ohne das Verhalten der vorhandenen Kategorien zu ändern, G9). Tastatur und Screenreader bedienbar, Titel am Rahmen, kein automatischer Start.
5. Sicherheitsrichtlinie: Erweitere die Content-Security-Policy gezielt um `frame-src` für `https://www.youtube-nocookie.com` (lies, wo die Richtlinie gesetzt wird, und die Anleitung in `node_modules/next/dist/docs`). Nichts anderes öffnen.
6. Baustein `TutorialHinweis` für Leistungsseiten und Formulare: zeigt die dem Ort zugeordneten Tutorials (Video oder Schrittfolge) kompakt an. Binde ihn ein auf: Schlüssel nach Vorlage (Seite und Fotoschritt der Anfrage), Autoschlüssel-Anfrage (Fotoschritt und Fahrzeugschein-Schritt), Schlüssel nach Code, Schlüssel einschicken, Gleichschließende Zylinder (Messschritt, Not- und Gefahrenfunktion), Schließanlagen (HS und GHS), Gehäuse. Ohne zugeordneten, veröffentlichten Eintrag erscheint nichts.
7. Strukturdaten: `VideoObject` nur, wenn ein Video wirklich hinterlegt ist und Titel, Beschreibung, Datum und ein eigenes Vorschaubild vorliegen; `HowTo` nicht (R8, keine Auszeichnung in Erwartung besonderer Ergebnisse).
8. Datenschutz: Den Wortlaut der Datenschutzerklärung änderst du nicht. Schreibe den nötigen Absatz zu YouTube als Entwurf in den Bericht (für den Anwalt) und ergänze die Verarbeitungsübersicht (`src/lib/rechtliches/verarbeitungen.ts`), falls sie Dienste automatisch listet; prüfe, wie der Bestand mit GA4 verfährt, und halte dasselbe Muster ein.
9. Rubrik, Hub und Navigation bindet der Orchestrator ein; nenne die gewünschten Einträge im Bericht (Rubrik „Tutorials“ im Menü „Mehr“ und im Fuß unter „Service“).

## Schreibrechte
- neu: src/payload/collections/Tutorials.ts, content/tutorials.json, src/lib/data/defaults/tutorials.ts, src/lib/tutorials/** , src/components/tutorial/**, src/app/(site)/tutorials/**
- ändern: payload.config (Sammlung), neue Migration (`sicher.sh --pg -- npx payload migrate:create tutorials`), src/migrations/index.ts, src/payload-types.ts, src/payload/seed.ts (Plan Tutorials), src/lib/data/** (Adapter, Mapping), src/lib/types.ts (neue Typen), die Stelle der Content-Security-Policy, die Einwilligungsverwaltung (nur neue Kategorie), src/lib/rechtliches/verarbeitungen.ts, src/app/sitemap.ts, je eine Einbindung des Bausteins auf den genannten Seiten (nur die Zeile der Einbindung)
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-INHALT-01.md
Nicht anfassen: content/rubriken.json, Navigation, Startseite, Rechtstexte, die Medienablage in ihren erlaubten Dateitypen (Videos liegen bei YouTube, nicht in der Ablage).

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`
- Tests, die nicht fehlen dürfen: Kennung aus allen üblichen Linkformen gezogen und fremde Adressen abgelehnt; vor der Zustimmung enthält das HTML keine Adresse von YouTube oder Google; nach der Zustimmung nur `youtube-nocookie.com`; nicht veröffentlichte Tutorials erzeugen keine Seite und keinen Hinweis; die Richtlinie erlaubt nur den einen Rahmen.
- Kein Server, kein git, keine Netzabrufe.

## Grenzen
G4, G5, G6, G7 (keine neue Laufzeitbibliothek), G8, G9 (bestehende Einwilligungen unverändert), R4, R8, R10, R11 (keine fremden Videos, Bilder, Texte). Texte kurz, für ältere Kunden verständlich, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Einträge) · PRÜFUNG UND ERGEBNIS · ENTWURF ZUR ANWALTLICHEN PRÜFUNG (Absatz zu YouTube, wörtlich) · OFFENE FRAGEN · FÜR MENSCHEN (welche Videos und Inhalte fehlen).
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-01 · BEREIT ZUR RÜCKGABE ===
