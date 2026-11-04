# E5-PROBENUTZER-01 · Probelauf der Konfiguratoren: Hausverwaltung mit 20 Türen und Rentnerin

## 1. Kopfzeile
Kennung E5-PROBENUTZER-01 · Rolle Probenutzer · Modell Haiku 5.5 · Stufe 1 · Kostenklasse M · Kriterien Z-05, Z-06 · Schreibrechte: _werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/ (Protokolle, Bilder), _werkstatt/ausbau/berichte/E5-PROBENUTZER-01.md · Umfang: /schliessanlagen, /schliessanlagen/konfigurator/schliessplan, /gleichschliessende-zylinder/konfigurator, Warenkorb bis vor die Kasse

## 2. Rollenbriefing
Probenutzer: spielt Personas, folgt nur sichtbaren Knöpfen und schreibt auf, was die Persona denkt. Fehler: Wissen aus dem Quelltext nutzen; absenden oder bezahlen; Stolpersteine schönreden.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Lass zwei Personas mobil (390 × 844) und am Desktop (1440 × 900) mit den Konfiguratoren ihr Ziel erreichen und belege, wo sie zögern, sich irren oder abbrechen.

## 4. Hintergrund
Neu in E5: Der Schließplan-Planer legt Türen mit Bauform, Maßen, Funktion und Schutz an, Schlüssel mit Anzahl und Vormerkung, eine Matrix (wer öffnet welche Tür), prüft die Maße („Maße geprüft“), legt Sperrschließungen in den Warenkorb und schickt Schließanlagen mit Ebenen als Anfrage; der Plan lässt sich als Link speichern und als PDF herunterladen. Der Sperrschließungs-Konfigurator kann eine Zusammenstellung als Link speichern und Links aus dem Planer öffnen.

## 5. Regeln (unveränderlich)
- Persona „Hausverwaltung“: Frau Testverwalterin, verwaltet ein Mehrfamilienhaus mit 20 Türen (Haustür, Keller, Müllraum, Fahrradraum, 16 Wohnungen). Jede Mieterpartei öffnet Haustür, Keller, Müllraum, Fahrradraum und die eigene Wohnung; die Verwaltung alle Türen; je Wohnung 3 Schlüssel, Verwaltung 2 plus 2 vorgemerkt. Maße frei aus den wählbaren Werten. Ziel: Anfrage im Planer bis vor „Angebot anfragen“ vollständig ausgefüllt, dazu einmal „Schließplan als PDF“ geöffnet und „Plan als Link speichern“ benutzt.
- Persona „Rentnerin“: Frau Testrentnerin, 74, Einfamilienhaus, möchte, dass Haustür, Kellertür und Garage mit einem Schlüssel schließen, 4 Schlüssel. Liest langsam, misst unsicher. Ziel: Sperrschließung im Warenkorb (über den Planer oder den Sperrschließungs-Konfigurator, wie sie es findet), Start auf /schliessanlagen.
- Nie absenden und nie bezahlen; vor dem letzten Knopf der Anfrage aufhören, im Warenkorb nicht zur Kasse. Erfundene Kontaktdaten (Erika Testkundin, test@example.invalid, 0000 000000). Playwright: alle Anfragen außer localhost abbrechen, Bewegung an. Den Server startet der Orchestrator (http://localhost:3000); falls er nicht antwortet: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/server.sh start`.

## 6. Maßstab
Tabelle je Persona und Gerät: Tipps bis zum Ziel, Zeit, Zögern über 5 s mit Ort, Fehler (etwa falsche Zuordnung in der Matrix), Abbruch ja oder nein, Ziel erreicht. Stolpersteine mit Ort, Textzitat und Gedanken der Persona; die fünf wichtigsten Befunde nach Wirkung mit Bildpfad.

## 7. Grenzen
G1, G4, G5, G13. Keine Projektdatei ändern, kein Commit.

## 8. Schritte
1. Seiten nur über sichtbare Knöpfe erschließen, beginnend bei /schliessanlagen.
2. Vier Läufe (zwei Personas, zwei Geräte), Bilder an jeder Stelle mit Zögern oder Fehler.
3. Bericht schreiben.

## 9. Selbstprüfung
Vier Läufe protokolliert; nirgends abgesendet (Netzwerkprotokoll ohne Formularsendung und ohne Kasse); jede Zahl mit Protokollpfad.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E5-PROBENUTZER-01.md (höchstens 600 Wörter).

## 11. Letzte Zeile
=== ENDE E5-PROBENUTZER-01 · BEREIT ZUR RÜCKGABE ===
