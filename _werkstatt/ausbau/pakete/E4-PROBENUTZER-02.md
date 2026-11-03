# E4-PROBENUTZER-02 · Probelauf des zweiten Anlaufs

## 1. Kopfzeile
Kennung E4-PROBENUTZER-02 · Rolle Probenutzer · Modell Haiku 5.5 · Stufe 1 · Kostenklasse M · Kriterium Z-05 · Schreibrechte: _werkstatt/ausbau/protokolle/E4-PROBENUTZER-02/ (Protokolle, Bilder), _werkstatt/ausbau/berichte/E4-PROBENUTZER-02.md · Umfang: Startseite, Autoschlüssel-Weg, Wege der Hausverwaltung und des Schlüsseldienstes

## 2. Rollenbriefing
Probenutzer: spielt Personas, folgt nur sichtbaren Knöpfen und schreibt auf, was die Persona denkt. Fehler: Wissen aus dem Quelltext nutzen; absenden oder bezahlen; Stolpersteine schönreden.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Wiederhole den Probelauf aus E4-PROBENUTZER-01 (Paketdatei dort, Abschnitt 5) mit vier Personas mobil und am Desktop, diesmal mit Testbildern, und belege, ob jede Persona ihr Ziel ohne Abbruch erreicht.

## 4. Hintergrund
Im ersten Lauf brachen Rentnerin und Eilige an den Pflichtfotos ab, auch weil es keine Testbilder gab. Neu: Etappen statt Schrittzählung, „Vorschlag“ aus der Suche mit freiem „Weiter“, „Zurück“ beschriftet, in den Fotoschritten Anrufen und „Anfrage ohne Fotos senden“. Testbilder (erfunden, gekennzeichnet): _werkstatt/ausbau/testdaten/testbild-schluessel-vorderseite.jpg, -rueckseite.jpg, -bart.jpg und testbild-fahrzeugschein-muster.jpg. Der Server läuft im JSON-Modus auf http://localhost:3000; nicht bauen, nicht stoppen.

## 5. Regeln (unveränderlich)
- Personas und Messgrößen wie in E4-PROBENUTZER-01 (Abschnitt 5). Ziel erreicht heißt: Anzahlungsseite erreicht (Rentnerin und Eilige mit Testbildern), Anfrage fertig ausgefüllt vor dem Senden (Dacia Sandero und je einmal über „Anfrage ohne Fotos senden“), Schließanlage mit Planung erreicht (Hausverwaltung), „Partner werden“ erreicht (Schlüsseldienst). Ein Anruf über einen sichtbaren tel:-Link zählt als erreichtes Ziel, wenn die Persona ohne Fotos nicht weiterkommt. Abbruch heißt: Die Persona gibt ohne eines dieser Ziele auf.
- Nie absenden und nie bezahlen; vor dem letzten Knopf aufhören. Erfundene Kontaktdaten (Erika Testkundin, test@example.invalid, 0000 000000). Playwright: alle Anfragen außer localhost abbrechen, Bewegung an.

## 6. Maßstab
Tabelle je Persona und Gerät wie im ersten Lauf (Tipps bis zur ersten Eingabe, Zeit, Zögern über 5 s, Abbruch, Anrufen in einem Schritt) und die Spalte „Ziel erreicht“; Stolpersteine mit Ort, Textzitat und Gedanken der Persona; die fünf wichtigsten Befunde nach Wirkung mit Bildpfad.

## 7. Grenzen
G1, G4, G5, G13. Keine Projektdatei ändern, kein Commit.

## 8. Schritte
1. Paketdatei und Bericht von E4-PROBENUTZER-01 lesen.
2. Acht Läufe (vier Personas, zwei Geräte), dazu je Gerät einmal der Weg ohne Fotos.
3. Bericht schreiben.

## 9. Selbstprüfung
Acht Läufe plus zwei Läufe ohne Fotos protokolliert; nirgends abgesendet (Netzwerkprotokoll ohne Formularsendung); jede Zahl mit Protokollpfad.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E4-PROBENUTZER-02.md (höchstens 600 Wörter).

## 11. Letzte Zeile
=== ENDE E4-PROBENUTZER-02 · BEREIT ZUR RÜCKGABE ===
