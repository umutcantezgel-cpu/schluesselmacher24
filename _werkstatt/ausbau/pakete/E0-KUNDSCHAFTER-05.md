# E0-KUNDSCHAFTER-05 · Qualität: Tests, Evaluierung, offene Punkte, Livegang

## 1. Kopfzeile
Kennung E0-KUNDSCHAFTER-05 · Rolle Kundschafter · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: Z-02, Z-03, Z-19, Auftrag 3 (Quellen M und E) · Schreibrechte: _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-05-qualitaet.md · Umfang: siehe Schritte

## 2. Rollenbriefing
Kundschafter: erfasst einen Bereich vollständig mit Datei- und Zeilenangaben. Fehler, die du vermeidest: zusammenfassen statt auflisten; Vermutung als Befund; Teile außerhalb der Navigation übersehen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei; du liest nur und schreibst ausschließlich die Dateien deiner Schreibrechte.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 3. Aufgabe in einem Satz
Erfasse den Qualitätsstand des Bestands: Testabdeckung je Bereich, offene Befunde der Evaluierung, offene Menschensachen, Fortschritt des Nachtlaufs und offene Punkte vor dem Livegang, je mit Fundstelle.

## 5. Kern-Auszug (unveränderlich)
Keine Anforderung verschwindet still. Was in docs/gestaltung/MENSCHEN.md, docs/wert/EVALUIERUNG.md, docs/nacht/FORTSCHRITT.md und docs/LIVEGANG.md offen ist, muss in diesem Lauf einen Endstatus bekommen.

## 6. Maßstab
/home/user/schluesselmacher24/docs/wert/EVALUIERUNG.md, docs/wert/belege/, docs/gestaltung/MENSCHEN.md, docs/gestaltung/BERICHT.md, docs/nacht/FORTSCHRITT.md, docs/nacht/bot-branches.txt, docs/LIVEGANG.md, src/**/*.test.ts, src/**/*.db.test.ts, src/scripts/livegang-pruefen.ts.

## 7. Grenzen
Nur lesen.

## 8. Schritte
1. Tests: Zähle Testdateien und `it(`/`test(`-Aufrufe je Ordner unter src (Unit getrennt von *.db.test.ts). Welche Bereiche haben keine Tests (Ordner unter src/lib und src/payload ohne Testdatei)?
2. Livegang-Prüfung: Was prüft src/scripts/livegang-pruefen.ts (Liste der Prüfpunkte mit Datei:Zeile)?
3. docs/LIVEGANG.md: Liste jeden Schritt, der vor dem Livegang offen ist (Abschnitt, Satz).
4. docs/gestaltung/MENSCHEN.md: Liste jeden Eintrag (M-Nummer, Thema, Status offen oder erledigt nach dem Wortlaut, Kurzinhalt in einem Satz).
5. docs/wert/EVALUIERUNG.md: Liste die offenen Befunde aus Abschnitt 4 (Leitfaden-Abgleich, nur Zeilen mit Ist ungleich Soll), Abschnitt 5.5 (gefundene Fehler: behoben oder offen), Abschnitt 6 (Ideen mit Status) und Abschnitt 10 (offene Fragen), je mit Zeilennummer. Lange Listen als Tabelle.
6. docs/nacht/FORTSCHRITT.md: Was war geplant, was ist erledigt, was offen?
7. docs/gestaltung/BERICHT.md: Welche Kriterien hatte der Gestaltungslauf als AUSNAHME oder offen beendet?
8. Gibt es in docs/wert/belege Messwerte (Lighthouse, Persona-Zeiten), die als Ausgangswerte taugen? Liste Datei und Wert.

## 9. Selbstprüfung
Jede M-Nummer kommt vor; jeder offene Befund aus EVALUIERUNG hat eine Zeilennummer.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-05-qualitaet.md (höchstens 1.500 Wörter, Tabellen erlaubt).

## 11. Letzte Zeile
=== ENDE E0-KUNDSCHAFTER-05 · BEREIT ZUR RÜCKGABE ===
