# E0-PRUEFER-06 · Funktionsliste F-15 bis F-19 und Gesamtlauf

## GEÄNDERTE DATEIEN
- `_werkstatt/ausbau/werkzeuge/funktionsliste.mjs`: 243 Zeilen ergänzt, 0 entfernt, gemessen gegen den Vorgänger des Commits 9fcba63 (siehe OFFENE FRAGEN 1).
- Logs `protokolle/E0-PRUEFER-06-*.log` (Gesamt-, Tastatur- und drei Probeläufe).
- Protokoll-JSON nach Paketschritt 7: `E0-funktionsliste-vorher.json`, `E0-funktionsliste-tastatur-vorher.json`.

## WAS UND WARUM
- F-15 Partner werden: fünf Schritte mit festen Testwerten (Firma „Testschlüsseldienst Muster“, PLZ 35578, Ort Wetzlar, Radius 25 km), Einwilligung, Absenden. Die Anfrage wird als `action-schreibend` mit Prüf-E-Mail abgefangen. Ihr Inhalt enthält Firma, PLZ und Prüf-E-Mail.
- F-16 Widerruf erklären: Name „Erika Mustermann“, Prüf-E-Mail, Absenden. Abfangen wie bei F-15.
- F-17 Codesuche: Kennung `ms-01` und Code `0812` werden aus `content/code-lines.json` gelesen. Serie und Code finden die Linie. Die Kategorie „Briefkasten und Postanlagen“ listet 5 Linien.
- F-18 Fahrzeugwahl: Marken, Volkswagen, Golf, Link mit `marke=volkswagen&modell=golf`. Im Assistenten ist die Option Volkswagen gewählt. Geprüft wird die gewählte Option, nicht der Text „Volkswagen“. Gerät mobil wie bei F-04.
- F-19 Kontakt und Vor-Ort: `tel:` und `mailto:` auf der Kontaktseite, drei Anfrage-Verweise auf der Vor-Ort-Seite, „Foto prüfen lassen“ führt auf Einsenden zu `/schluessel-nach-vorlage/anfrage`.
- F-01 bis F-14 sind unverändert.

## GEMEINSAME DATEIEN
Keine gewünschten Änderungen. `lib.mjs` bleibt unberührt.

## PRÜFUNG UND ERGEBNIS
- `node --check` fehlerfrei. Je neue Funktion ein Probelauf. Zwei Fehlläufe (Schrittüberschrift, Locator für „Golf“) sind korrigiert; die Logs bleiben als Beleg.
- Gesamtlauf F-01 bis F-19: 19 von 19 BESTANDEN, Exit 0.
- Tastaturlauf F-04, F-05, F-11: 3 von 3 BESTANDEN. Bedienungen 35, 6 und 2; Tab-Schritte 423, 80 und 55; ohne sichtbaren Fokus jeweils 0.
- Prüfpunkte: Einzelprüfungen je Funktion, aus dem Quelltext gezählt. Dauer: Gesamtlauf.

| F-Nr. | Funktion | Ergebnis | Prüfpunkte | Dauer |
|---|---|---|---|---|
| F-01 | Warenkorb: Code-Schlüssel, Menge, Entfernen, Summe | BESTANDEN | 6 | 3,5 s |
| F-02 | Kasse bis Absenden | BESTANDEN | 3 | 4,1 s |
| F-03 | Bestellseite nur mit Zugangsschlüssel | BESTANDEN | 1 | 1,2 s |
| F-04 | Autoschlüssel-Assistent | BESTANDEN | 2 | 3,4 s |
| F-05 | Zylinder-Konfigurator in den Warenkorb | BESTANDEN | 3 | 5,9 s |
| F-06 | Schließanlagen-Konfigurator bis Absenden | BESTANDEN | 2 | 5,7 s |
| F-07 | Weitere Abläufe, vier Routen | BESTANDEN | 4 | 20,4 s |
| F-08 | Terminstatus abfragen | BESTANDEN | 1 | 1,6 s |
| F-09 | Cookie-Einstellungen speichern und löschen | BESTANDEN | 2 | 1,1 s |
| F-10 | Zwischenspeicherung („Weitermachen“) | BESTANDEN | 2 | 1,8 s |
| F-11 | Navigation: Megamenü, Drawer, Sprunglink, Aktionsleiste | BESTANDEN | 8 | 2,9 s |
| F-12 | robots.txt, sitemap.xml, llms.txt, JSON-LD | BESTANDEN | 5 | 1,8 s |
| F-13 | Rechner Türabsicherung und Serviceeinsatz | BESTANDEN | 2 | 5,4 s |
| F-14 | Shop-Filter und Codelinien-Liste | BESTANDEN | 1 | 1,8 s |
| F-15 | Partner werden, fünf Schritte | BESTANDEN | 4 | 4,0 s |
| F-16 | Widerruf erklären | BESTANDEN | 5 | 1,5 s |
| F-17 | Codesuche, Serie, Kategorie-Seite | BESTANDEN | 3 | 1,8 s |
| F-18 | Fahrzeugwahl mit Vorauswahl | BESTANDEN | 6 | 1,9 s |
| F-19 | Kontakt, Vor-Ort, Einsenden | BESTANDEN | 4 | 2,6 s |

## BELEGE
- `protokolle/E0-funktionsliste-vorher.json`: 19 Ergebnisse mit Attrappen je Funktion.
- `protokolle/E0-funktionsliste-tastatur-vorher.json`: drei Ergebnisse mit Tastaturprotokoll.
- Schreibende Attrappen: je eine bei F-02, F-04, F-06, F-15 und F-16, drei bei F-07. Bei F-17 und F-19 keine Attrappen.
- `content/records.json` ist vor und nach dem Lauf nicht vorhanden. Es wurde nichts geschrieben.

## OFFENE FRAGEN
1. Commit 9fcba63 (E0-PRUEFER-03, 22:36 Uhr) enthält meine Änderung an `funktionsliste.mjs` und zwei Probe-Logs. Ich habe nichts committet; die Entscheidung liegt beim Orchestrator.
2. Die beiden JSON-Dateien aus Schritt 7 stehen nicht in der Schreibrechte-Kopfzeile des Pakets; angelegt wie vorgegeben.
3. Der Tastaturlauf ohne `--md` hat `protokolle/funktionsliste-2026-11-03_00-36-34.md` erzeugt; nichts gelöscht.
4. F-18 hat eine Server-Aktion als `action-unbekannt` abgefangen; die Ursache ist nicht untersucht. F-15 hat zwei solche Aufrufe ohne Inhalt, vermutlich Bot-Schutz.
5. Kopfkommentar von `funktionsliste.mjs` (nennt F-01 bis F-14) und Markdown-Kopf („E0-PRUEFER-04“) sind Altbestand. Sie blieben unverändert, damit der Diff rein additiv bleibt.
