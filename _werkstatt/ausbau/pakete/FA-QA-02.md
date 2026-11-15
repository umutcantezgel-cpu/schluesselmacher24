# FA-QA-02 · Bedienbarkeit auch für ältere Kunden: alle mehrstufigen Formulare gegen Abschnitt 26 prüfen und Lücken schließen

Kopf: Etappe FA Priorität 7 · Rolle Prüfer und Baumeister · Modell Opus · Stufe 3 (Formulare der Schlüsselwege) · Kostenklasse L · kein Datenschema, kein `--pg` · Anforderungen FA-26-01 bis FA-26-09, FA-01 · Befunde: `berichte/FA-ABGLEICH.md` (Block zu Abschnitt 26), `berichte/FA-KERN-02B.md` (gemeinsames Formular als Muster).

## Aufgabe in einem Satz
Prüfe jedes mehrstufige Formular der Seite Punkt für Punkt gegen die Liste des Inhabers und behebe, was fehlt, ohne Wege, Pflichtangaben oder Nachweise zu ändern.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 26)
„Bedienbarkeit: auch für ältere Kunden. Große klare Buttons und gut lesbare Schrift. Keine überladene Navigation. Mehrstufige Formulare mit Fortschrittsanzeige. Zurückfunktion ohne Datenverlust. Verständliche Fehlermeldungen. Foto Upload mit konkreten Beispielen. Telefon und Hilfeoption an kritischen Stellen. Keine Sackgassen: immer ‚nicht gefunden‘, ‚unsicher‘ oder ‚individuelle Anfrage‘ anbieten. Mobile Bedienung besonders intensiv testen.“

## Formulare (alle nutzen den gemeinsamen Ablauf `useFlow`)
1. Termin-Assistent `src/app/(site)/autoschluessel/anfrage/assistent.tsx`
2. Gehäuse-Anfrage `src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx`
3. Gemeinsame Fahrzeugschlüssel-Anfrage `src/components/fahrzeug-anfrage/formular.tsx` (gilt als Muster; nur prüfen)
4. Schlüssel nach Vorlage `src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`
5. Einsendung `src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx`
6. Zylinder-Konfigurator `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`
7. Schließanlagen `src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx` und Schließplan `src/components/konfigurator/schliessplan-planer.tsx`
8. Zutritt `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`
9. Sicherheitscheck `src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx`
10. Allgemeine Anfrage (Rückruf) `src/app/(site)/beratung/beratung-formular.tsx`, Anfrage zu einer Leistung `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx`, Kontakt `kontakt-formular.tsx`, Einsatz vor Ort `vor-ort/einsatz-formular.tsx`
11. Partnerbewerbung `src/app/(site)/partner-werden/partner-formular.tsx`
Nicht in diesem Paket (dort arbeitet gerade FA-SHOP-01, sie folgen nach FA-SHOP-01B): Bestellformular der Codelinie, Artikelkauf, Warenkorb, Kasse.

## So prüfen und bauen
1. Lege zuerst eine Tabelle an (im Bericht): je Formular eine Zeile, je Forderung eine Spalte, mit Beleg (Datei und Zeile) oder Lücke:
   a. Fortschrittsanzeige: sichtbar, sagt „Schritt x von y“ und den Namen des Schritts, auch für Vorleseprogramme.
   b. Zurück ohne Datenverlust: Angaben bleiben beim Zurückgehen; nach einem Neuladen der Seite bleibt der Stand (Zwischenstand im Browser), ausgewählte Dateien dürfen fehlen, dann sagt das Formular es und führt zum unvollständigen Schritt; ein Browser-Zurück verlässt das Formular nicht ohne Vorwarnung, wenn Angaben verloren gingen.
   c. Fehlermeldungen: nennen das Feld, was fehlt oder falsch ist, und wie es richtig aussieht; stehen am Feld und sind mit ihm verknüpft; der gesperrte Knopf „Weiter“ sagt, was noch fehlt (wie im Muster); nach einem Fehler beim Absenden bleiben alle Angaben erhalten und der Kunde erfährt, was er tun kann (noch einmal versuchen, anrufen).
   d. Foto-Upload mit konkreten Beispielen: wo ein Foto verlangt wird, steht ein Beispielbild oder eine Zeichnung mit einem Satz, was zu sehen sein muss (Muster: `src/components/autoschluessel/schluessel-fotos.tsx`). Wo nur ein Symbol statt eines echten Beispiels steht, heißt die Zeile darüber nicht „So sollte das Foto aussehen“, sondern sagt, was auf dem Foto zu sehen sein muss.
   e. Telefon und Hilfe an kritischen Stellen: im Schritt mit Unterlagen, im Schritt mit der Zahlung oder Preisangabe und überall, wo ein Kunde ohne Fachwissen eine Angabe vielleicht nicht machen kann (Maße, Profil, Code, Schlüsselnummer): Telefonnummer aus den Einstellungen mit der Erreichbarkeit (`erreichbarkeit(settings)`), dazu „Rückruf erbitten“ oder „Später weitermachen“, wo der Bestand es trägt. Kein eigener Satz zu Zeiten.
   f. Keine Sackgassen: Jede Auswahl hat einen Ausweg „nicht gefunden“, „unsicher“ oder „individuelle Anfrage“ (zum Beispiel „Maß unbekannt“, „Hersteller unbekannt“, „Ich bin nicht sicher“), der in einen vollständigen Weg führt und keinen Nachweis schwächt (R13). Jeder leere Zustand und jede Ablehnung nennt den nächsten Schritt.
   g. Große Schaltflächen und lesbare Schrift: Trefferfläche mindestens 44 × 44 px, Hauptknöpfe auf dem Telefon über die ganze Breite oder mindestens 48 px hoch, Fließtext nicht unter 16 px, Hilfetexte nicht unter 14 px; prüfe das an den Klassen.
2. Behebe jede Lücke mit dem kleinsten Eingriff, nach dem Muster der gemeinsamen Fahrzeugschlüssel-Anfrage. Baue einen fehlenden Baustein einmal gemeinsam (zum Beispiel einen Hilfeblock „Unsicher bei einer Angabe?“ mit Telefon, Erreichbarkeit und Rückruf unter `src/components/forms/`), statt ihn je Formular neu zu schreiben; prüfe vorher, ob es ihn schon gibt (`src/components/fahrzeug-anfrage`, `src/components/weg`, `src/components/forms`).
3. Was sich nicht ohne Umbau oder ohne Entscheidung des Inhabers beheben lässt, steht mit Begründung unter OFFENE FRAGEN.
4. Tests je behobener Lücke; ein Sammeltest hält fest, dass jedes Formular der Liste Fortschritt, Hilfeblock und Fehlertext am gesperrten Knopf trägt.

## Schreibrechte
Die Formulare der Liste (außer Nummer 3: nur lesen) und ihre Seiten nur für die Übergabe von Telefon und Erreichbarkeit; `src/components/forms/**`, `src/components/weg/**` (gemeinsame Bausteine); `src/lib/flow/**` oder die Datei des gemeinsamen Ablaufs nur, wenn eine Lücke dort liegt (dann mit Tests für alle Formulare); zugehörige Tests; `_werkstatt/ausbau/berichte/FA-QA-02.md`.
Nicht anfassen: Pflichtangaben, Prüfregeln und Nachweise (`src/lib/server/**`, `src/lib/actions/**`), Preise und Berechnung der Konfiguratoren, Rechtstexte und Zustimmungen, `src/payload/**`, Shopseiten (`schluessel-nach-code`, `artikel`, `warenkorb`, `kasse`), Navigation, Hub. Sichtbare Texte der Formulare sind frisch überarbeitet (FA-INHALT-03): Ändere Wortlaut nur, wo eine Lücke aus der Liste es verlangt, im selben Ton.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- Kein Build, kein Server, kein `--pg`, kein git. Die Sichtprobe auf dem Telefon macht der Orchestrator. Ein roter Test in Dateien des gleichzeitig laufenden Pakets (Shop) ist nicht dein Fehler; wiederhole den Lauf und nenne es im Bericht.

## Grenzen
G5, G8, G9, R4, R9, R13. Texte kurz, verständlich, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · TABELLE (Formular × Forderung, vorher und nachher) · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-02 · BEREIT ZUR RÜCKGABE ===
