# E6-PROBENUTZER-01 · Probelauf der Wege aus Abschnitt 11 mit vier Personas

## 1. Kopfzeile
Kennung E6-PROBENUTZER-01 · Rolle Probenutzer · Modell Haiku 5.5 · Stufe 1 · Kostenklasse M · Kriterien Z-05, Z-06 · Schreibrechte: `_werkstatt/ausbau/protokolle/E6-PROBENUTZER-01/` (Protokolle, Bilder), `_werkstatt/ausbau/berichte/E6-PROBENUTZER-01.md` · Umfang: Startseite (Hub), /autoschluessel und der Assistent, /motorradschluessel, /autoschluessel/gehaeuse, /schluessel-nach-code mit Codesuche bis zum Warenkorb, /schluessel-nach-vorlage mit Anfrage, /schluessel-einschicken mit Anmeldung, /service-und-termin/vor-ort, /beratung, /service-und-termin/kontakt, /partner-werden, /service-und-termin/terminstatus

## 2. Rollenbriefing
Probenutzer: spielt Personas, folgt nur sichtbaren Knöpfen und Links und schreibt auf, was die Persona denkt. Fehler: Wissen aus dem Quelltext nutzen; absenden oder bezahlen; Stolpersteine schönreden.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Lass vier Personas mobil (390 × 844) und am Desktop (1440 × 900) ihre Wege bis kurz vor dem Absenden gehen und belege Tipps, Zeit, Zögern, Fehler und Abbruchpunkte.

## 4. Hintergrund
In E6 sind neu: gemeinsamer Ablauf je Rubrik und gemeinsame Bestätigung, Schlüssel einschicken mit Begleitschein, Motorrad- und Gehäuse-Anfrage, Beratung mit Rückruf, Kontakt mit Fotos, Einsatz-Anfrage vor Ort mit Berechtigung, gezeichnete Beispiele in der Foto-Anfrage, „Nach Code bestellen“ an den Treffern der Codesuche, Kundenstatus in einfacher Sprache im Terminstatus.

## 5. Regeln (unveränderlich)
- Personas aus AUFTRAG.md Abschnitt 11, mit diesen Wegen:
  - „Rentnerin, 72, Smartphone, wenig Technik“ (Frau Testrentnerin): möchte zwei Kopien ihres Haustürschlüssels und weiß nicht, ob Fotos reichen. Wege: vom Hub zu Foto oder Einschicken, Anmeldung zum Einschicken bis vor „Absenden“; danach Beratung mit Rückruf bis vor „Absenden“.
  - „Eilige, die nur Preis und Ablauf will“ (Herr Testeilig): Wege: Autoschlüssel (Preis und Ablauf finden, im Assistenten bis zur Preisanzeige), Motorradschlüssel und Gehäuse (versteht er, warum es erst eine Anfrage ist?), Schlüssel nach Code mit dem Code „0812“ über „Nach Code bestellen“ bis in den Warenkorb, nicht zur Kasse.
  - „Hausverwaltung mit 20 Türen“ (Frau Testverwalterin): Wege: Vor Ort, Einsatz anfragen für einen Zylindertausch bis vor „Absenden“; Kontakt mit einem Foto (eine erfundene Bilddatei) bis vor „Absenden“.
  - „Schlüsseldienst aus Hamburg, der Partner werden will“ (Herr Testpartner): Wege: vom Hub zu „Partner werden“ bis vor „Absenden“; liest dabei Vor Ort und prüft, ob dort etwas über Partner versprochen wird.
- Je Persona zusätzlich: Terminstatus mit der erfundenen Nummer „SM24-T-2026-9999“ und test@example.invalid abfragen und die Meldung zitieren.
- Prüfpunkte aus Abschnitt 11: vom Hub bis zur ersten Eingabe höchstens drei Tipps; jede Seite sagt in einem Satz, was hier passiert und was es kostet; keine Sackgassen; Anrufen oder Rückruf von jeder besuchten Rubrikseite in einem Schritt erreichbar.
- Nie absenden und nie bezahlen; vor dem letzten Knopf aufhören, im Warenkorb nicht zur Kasse. Erfundene Kontaktdaten (Erika Testkundin, test@example.invalid, 0000 000000, 12345 Musterstadt). Playwright mit `_werkstatt/ausbau/werkzeuge/lib.mjs` (`browserStarten`, `kontextFuer` mit `GERAETE` „mobil“ und „desktop“, `attrappenSetzen`, `laden`): alle Anfragen außer localhost abbrechen. Den Server startet der Orchestrator (http://localhost:3000); falls er nicht antwortet: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/server.sh status` melden, nicht selbst bauen.

## 6. Maßstab
Tabelle je Persona und Gerät: Tipps vom Hub bis zur ersten Eingabe, Tipps bis zum Ziel, Zeit, Zögern über 5 s mit Ort, Fehler, Abbruch ja oder nein, Ziel erreicht. Prüfpunkte aus Abschnitt 5 je besuchter Seite (ja oder nein mit Zitat). Die acht wichtigsten Stolpersteine nach Wirkung mit Ort, Textzitat, Gedanken der Persona und Bildpfad.

## 7. Grenzen
G1, G4, G5, G13. Keine Projektdatei ändern, kein Commit, kein Build.

## 8. Schritte
1. Seiten nur über sichtbare Knöpfe und Links erschließen, beginnend auf der Startseite.
2. Acht Läufe (vier Personas, zwei Geräte), Bilder an jeder Stelle mit Zögern oder Fehler, Bilder klein halten (nur Ausschnitte, kein Vollbild über 3000 px Höhe).
3. Bericht schreiben.

## 9. Selbstprüfung
Acht Läufe protokolliert; nirgends abgesendet (Netzwerkprotokoll ohne Formularsendung und ohne Kasse); jede Zahl mit Protokollpfad; kein echter Name, keine echte Adresse.

## 10. Ausgabe
Bericht nach `_werkstatt/ausbau/berichte/E6-PROBENUTZER-01.md` (höchstens 600 Wörter), Protokolle und Bilder unter `_werkstatt/ausbau/protokolle/E6-PROBENUTZER-01/`.

## 11. Letzte Zeile
=== ENDE E6-PROBENUTZER-01 · BEREIT ZUR RÜCKGABE ===
