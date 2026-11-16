# FA-QA-03D · Abnahmebogen: je Hauptprozess Protokoll und Bild, Stand aller Anforderungen

Kopf: Etappe FA Priorität 7 · Rolle Prüfer und Dokumentar · Modell Opus · Stufe 2 · Kostenklasse M · kein Quelltext des Produkts · Anforderungen FA-27-15, FA-27-16, FA-22-00 · Voraussetzung: FA-QA-01 (Pflichttests P-01 bis P-13) und FA-QA-03C sind abgenommen; lies zuerst `berichte/FA-QA-01.md`.

## Aufgabe in einem Satz
Ein Abnahmebogen für den Inhaber zeigt je Hauptprozess aus Abschnitt 27, was geprüft wurde, mit welchem Ergebnis, mit Protokoll und Bild als Beleg, und was ein Mensch noch selbst prüfen oder entscheiden muss.

## Vorgabe des Inhabers (wörtlich, Abschnitt 27)
„Jeder Prozess muss vollständig getestet werden. Es reicht nicht, dass eine Seite optisch funktioniert.“ Und zur Abnahme: „Keine Demo Daten, keine Platzhalter, keine falschen Kontaktdaten.“

## So bauen
1. Datei `docs/abnahme/ABNAHMEBOGEN.md` (für den Inhaber lesbar, ohne Fachwörter der Entwicklung) und daneben die Belege unter `docs/abnahme/belege/` (Bilder klein gerechnet, je Prozess höchstens sechs; Protokolle als kurze Textdateien). Keine echten Daten, keine internen Zahlen (G13): nur erfundene Testdaten aus den Läufen.
2. Je Zeile der Pflichttests des Inhabers (dreizehn Zeilen aus Abschnitt 27; die Liste steht in `pakete/FA-QA-01.md`) ein Abschnitt:
   - Was der Inhaber verlangt (wörtlich).
   - Was der Lauf getan hat, Schritt für Schritt in einfachen Worten, mit Ergebnis je Schritt (bestanden, nicht bestanden, nicht prüfbar mit Grund).
   - Geräte (Desktop, iPhone-, iPad- und Android-Profil; ob WebKit lief).
   - Belege: Bild der Bestätigung beim Kunden und des Vorgangs im Admin, Name des Protokolls.
   - Was Attrappe war (Zahlung, Mail, Versandmarke) und deshalb von einem Menschen einmal echt geprüft werden muss.
   - Offene Punkte mit Verweis auf MENSCHEN (MA-Nummer).
   Du erfindest kein Ergebnis: Was FA-QA-01 nicht geprüft hat, steht als „nicht geprüft“ im Bogen (R4).
3. Abschnitt „Keine Demo-Daten, keine Platzhalter, keine falschen Kontaktdaten“: Ergebnis von `werkzeuge/reste.mjs` (der Orchestrator gibt dir das Protokoll des letzten Laufs) und der Livegang-Prüfung aus FA-QA-03C, mit den bekannten offenen Stellen (Vertragstext des Anwalts, MA-29).
4. Abschnitt „Stand aller Anforderungen“: Zahlen aus `berichte/FA-BESTAND.md` fortgeschrieben mit `FA-PLAN.md` (erfüllt, teilweise, offen, wartet auf den Inhaber), als kurze Tabelle je Abschnitt der Arbeitsanweisung. Prüfe jede Zeile, die du auf „erfüllt“ setzt, gegen den Bericht des Pakets (Abnahmeabschnitt des Orchestrators); ohne Abnahme bleibt sie „teilweise“.
5. Abschnitt „Was der Inhaber vor dem Livegang selbst tun muss“: aus MENSCHEN.md nach Wirkung geordnet (ohne das geht nichts live; sollte vorher entschieden sein; kann später), je Punkt ein Satz und die MA-Nummer.
6. Unterschriftsfeld am Ende: Datum, Name, „abgenommen“ oder „abgenommen mit Auflagen“, Platz für Auflagen.
7. Prüfe den Bogen mit dem Prüfwerkzeug: `sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/reste.mjs` darf durch den Bogen und die Belege keinen neuen Fund bekommen (die erfundenen Testdaten stehen nur in Bildern und in als Testdaten gekennzeichneten Protokollen; liegt der Ordner in einer geprüften Quelle, nenne das als OFFENE FRAGE statt eine Ausnahme einzutragen).

## Schreibrechte
`docs/abnahme/**` (neu), `_werkstatt/ausbau/berichte/FA-QA-03D.md`.
Nicht anfassen: Quelltext, Werkzeuge, MENSCHEN.md und FA-PLAN.md (nur lesen; Abweichungen meldest du).

## Prüfen
Jede Zahl im Bogen hat eine Quelle (Bericht, Protokoll, Plan), die du im Bericht nennst. Kein Server, kein git.

## Grenzen
G4, G13, R4, R7 (der Bogen sagt klar, was Maschine und was Mensch geprüft hat), R10.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-03D · BEREIT ZUR RÜCKGABE ===
