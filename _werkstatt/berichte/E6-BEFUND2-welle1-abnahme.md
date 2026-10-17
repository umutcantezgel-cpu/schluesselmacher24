# Abnahme Bauwelle 1 der Runde 2 (E6-BEFUND2-H01, -H02, -H03, -H12)

Workflow `wf_78d2c95c-665`, Basis `69d8213`. Je Paket gab es Bau, Prüfstufe A und bis zu zwei Reparaturen. Die Berichte der Baumeister und die Urteile stehen in `_werkstatt/berichte/E6-BEFUND2-<id>.md`.

| Paket | Prüfstufe A | Abnahme des Orchestrators |
|---|---|---|
| H01 Startseite | nicht bestanden nach 3 Runden | abgenommen mit Nacharbeit |
| H02 Autoschlüssel | bestanden in Runde 2 | abgenommen |
| H03 Modellseite | bestanden in Runde 2 | abgenommen mit Nacharbeit (Keyless) |
| H12 Ratgeber | nicht bestanden nach 3 Runden | abgenommen |

## Pflichtbefunde der Prüfer, nachgeprüft
- **H01, Bildrate B-01 mobil (39–50 %):** Gemessen wurde auf dem Entwicklungsserver (Port 3001, ungebaut). Das taugt für Bildraten nicht. Gegenmessung am Produktionsbuild:
  - Stand der Welle per `git archive` nach `/root/sm24-w1` exportiert (außerhalb des Repositorys), gebaut (208/208) und auf Port 3002 gestartet.
  - 5 Läufe, 390 px, 4-fach gedrosselt, Messsperre gesetzt.
  - Ergebnis: Median 0,0 % (Einzelwerte 0 / 0,8 / 0 / 0 / 0 %). Der Build vor der Welle (Port 3000) misst ebenfalls 0,0 %.
  - Befund widerlegt; Belege in `/root/sm24-bilder/E6-abnahme-w1/bildrate-3002.json` und `-3000.json`.
- **H01, Stationen in der Bereichsfarbe:** Die Ziffern der fünf Stationen im Autoschlüssel-Ablauf stehen jetzt in `text-foreground` (KERN 1.14). Der Kreis bleibt in der Bereichsfarbe.
- **H01 und H12, überschriebene eigene Bilder:** Das ist ein Verstoß gegen die Arbeitsregel, aber kein Fehler im Produkt. Die Belege der letzten Runde liegen vor.
- **H12, Hilfslinie im schmalen Format:** In Runde 3 behoben. Die Ablaufzeichnung prüfe ich selbst am Bild (desktop waagerecht, mobil senkrecht mit Bemaßungskette), `MAX_SCHRITTE` ist 5 für das Service-Paket.

## Nacharbeit des Orchestrators (L3, keine weitere Reparaturrunde)
- **H03, Keyless als Zelle:** Keyless steht als Zelle mit `GlyphInfo`, Titel und Beschreibung in der Reihe der Schlüsselarten, statt als Hinweiszeile darunter. Die Spalten richten sich nach der Zahl der Zellen (Golf: vier Zellen, ab 1024 px eine Reihe). Das hebt D-026 in diesem Punkt auf (D-047).
- **Kopf (gemeinsamer Baustein, Fremdbefund H03):** Der Knopf „Termin starten“ ragte bei 1024 px und bei 1536 px um 69 px über den Innenrand.
  - Neu stehen im Balken ab 1024 px die Bereiche 1 und 3, ab 1280 px zusätzlich 2 und 5. Bereich 4 (Gleichschließende Zylinder) steht immer unter „Mehr“, und „Mehr“ ist dort aktiv markiert.
  - Gemessen bei 1024, 1280, 1440, 1536 und 1920 px: Der Knopf endet immer am Innenrand.
- **InfoTip (gemeinsamer Baustein, Fremdbefund H03):** Die Erklärung rückt am Bildschirmrand nach innen (16 px Abstand). Gemessen bei 390 px auf der Golf-Seite: 54–374 px.
- **Zeilenpfeil H02:** `group-focus-within` bleibt, denn die Zeile ist ein `li` mit überdeckendem Link und InfoTip. KERN 1.15 nennt diese Form jetzt ausdrücklich.
- **H12, Abschnittsnummern:** Sie ruhen in `text-foreground-muted`, weil B-24 die aktive Nummer an der Leselinie in Primärfarbe hebt. KERN 1.15 führt das als Ausnahme der Kleinregel.

## Offen als „soll“, bewusst nicht weiter verfolgt (letzte Runde)
- **H02 mobil:** Die zweite Zeile des Schriftfelds liegt im ersten Bildschirm unter der Aktionsleiste, wie in der Referenz.
- **H02 Tablet:** Die Beschreibung in Abschnitt 01 steht unter dem Namen statt daneben.
- **H01 auf ms-01:** Der Ausschnitt nutzt dort den gemeinsamen Generator, links bleibt ein angeschnittener Griff.
- **H12 bei 360 px:** Der Knopf „Anfrage für Ersatzschlüssel starten“ bricht zweizeilig. Ein kürzerer Wortlaut steht als Vorschlag in `TEXTVORSCHLAEGE.md`.

## Bestand nach der Nacharbeit
- Typprüfung 0, ESLint 0, Vitest 69 Dateien mit 1173 Tests, Wertesuche 0 ohne Ausnahme.
- Der Logikwächter meldet für die Dateien der Welle 0 Abweichungen. Zwei Abweichungen stammen aus der laufenden Welle 2 (Warenkorb, Zylinder-Konfigurator); deren Ausnahmen folgen bei der Abnahme.
- Eigene Bilder: `/root/sm24-bilder/E6-abnahme-w1/`.
