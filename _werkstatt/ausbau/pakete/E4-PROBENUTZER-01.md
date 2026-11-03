# E4-PROBENUTZER-01 · Probelauf Startseite und Autoschlüssel-Weg

## 1. Kopfzeile
Kennung E4-PROBENUTZER-01 · Rolle Probenutzer · Modell Haiku 5.5 · Stufe 2 · Kern 2.5 · Kostenklasse M · Kriterien Z-04, Z-05 · Schreibrechte: _werkstatt/ausbau/berichte/E4-PROBENUTZER-01.md, _werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/ (Bilder, Json) · Umfang: Startseite (Hub, Navigation, Übergang) und Autoschlüssel-Weg bis vor das Absenden, mobil 390 × 844 und Desktop 1440 × 900

## 2. Rollenbriefing
Probenutzer: spielt echte Menschen, nicht Tester. Er liest, was dasteht, tippt, was er versteht, und notiert jedes Zögern. Fehler: Abkürzungen über die URL, Wissen über den Code nutzen, Stolpersteine schönreden, Formulare wirklich absenden.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und _werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md und halte dich daran.

## 3. Aufgabe in einem Satz
Spiele mit vier Personas je mobil und am Desktop den Weg von der Startseite bis zur Anzahlung des Autoschlüssel-Termins (ohne Absenden) und die Suche nach einer anderen Leistung, und protokolliere Tipps, Zeit, Stolpersteine und Abbruchpunkte.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar. Die Startseite fragt „Wobei können wir Ihnen helfen?“ und zeigt Kacheln für jede Leistung. Der Autoschlüssel-Weg (/autoschluessel/anfrage) beginnt mit einer Fahrzeugsuche über den KBA-Katalog, danach Baujahr, Schlüsselart, Fotos, Fahrzeugschein, Kontakt, Preis, Anzahlung und Termin. Fahrzeuge ohne gepflegte Daten führen in eine Anfrage. Der Prüfserver läuft im JSON-Modus auf http://localhost:3000; Zahlung und Mail sind Attrappen.

## 5. Kern-Auszug (unveränderlich)
- Personas (Auftrag 11): „Rentnerin, 72, Smartphone, wenig Technik“ (liest langsam, tippt nur Großes, versteht keine Fachwörter) · „Eilige, die nur Preis und Ablauf will“ (überspringt Text, sucht Zahlen) · „Hausverwaltung mit 20 Türen“ (sucht Schließanlage, Desktop) · „Schlüsseldienst aus Hamburg, der Partner werden will“ (sucht Partner werden).
- Aufgaben: Rentnerin und Eilige: Autoschlüssel für einen „VW Golf 7“ bis zur Anzahlungsseite, dazu einmal ein Fahrzeug, das nicht gepflegt ist (etwa „Dacia Sandero“), bis zur Anfrage. Hausverwaltung: von der Startseite zur Schließanlage und zur Planung. Schlüsseldienst: von der Startseite zu „Partner werden“.
- Messgrößen je Persona und Gerät: Zahl der Tipps vom ersten Bildschirm bis zur ersten Eingabe (Ziel höchstens drei, Auftrag 11), Zeit bis zum Ziel, jede Stelle mit Zögern über 5 s, jeder Abbruchpunkt, ob Anrufen in einem Schritt erreichbar war.
- Nie absenden: Vor dem letzten Knopf (Anzahlung bezahlen, Anfrage senden) aufhören. Uploads mit Testbildern aus _werkstatt/ausbau/werkzeuge/testdaten/ (falls vorhanden), sonst den Schritt nur ansehen. Erkennbar erfundene Testdaten (Name „Erika Testkundin“, Mail test@example.invalid).
- Playwright mit Attrappen: alle Anfragen außer localhost:3000 abbrechen (`page.route`), Bewegung an (keine reduzierte Bewegung erzwingen).

## 6. Maßstab
Bericht mit Tabelle je Persona und Gerät: Tipps bis zur ersten Eingabe · Zeit · Stolpersteine (Ort, Zitat des Textes, was die Persona dachte) · Abbruch ja/nein · Anrufen erreichbar. Danach die fünf wichtigsten Befunde nach Wirkung, je mit Bildpfad.

## 7. Grenzen
G4, G5, G8. Keine Projektdatei ändern, nichts absenden, keine echten Daten.

## 8. Schritte
1. Prüfserver prüfen: `_werkstatt/ausbau/werkzeuge/server.sh status` (läuft er nicht, `server.sh start`).
2. Je Persona und Gerät ein Playwright-Lauf mit Bildern der wichtigen Zustände nach _werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/.
3. Bericht.

## 9. Selbstprüfung
Alle acht Läufe (vier Personas, zwei Geräte) im Bericht; kein Lauf hat abgesendet; jede Zahl gemessen.

## 10. Ausgabe
Bilder und Json nach _werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/, Bericht nach _werkstatt/ausbau/berichte/E4-PROBENUTZER-01.md (höchstens 900 Wörter).

## 11. Letzte Zeile
=== ENDE E4-PROBENUTZER-01 · BEREIT ZUR RÜCKGABE ===
