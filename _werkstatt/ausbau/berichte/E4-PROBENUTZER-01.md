# E4-PROBENUTZER-01 · Probelauf Startseite und Autoschlüssel-Weg

Prüfserver localhost:3000 (JSON), acht Läufe: vier Personas je Telefon (390 × 844) und Desktop (1440 × 900), Stand 2026-11-03.

## GEÄNDERTE DATEIEN
Keine Projektdatei. Fortgeschrieben: protokolle/datenweiche.log (sicher.sh). Geschrieben: dieser Bericht, acht JSON-Protokolle, 54 Bilder. Ordner mit Rechten 777 für ubuntu.

## WAS UND WARUM
Jede Persona startet auf der Startseite und folgt nur sichtbaren Knöpfen. Gemessen: Tipps, erste Eingabe, Maschinenzeit, Antwortzeit je Tipp, Wischbewegungen, Anruf, Abbruch. Sicherung: nur localhost:3000 (keine Fremdanfrage), kein Upload, kein Endknopf, Testdaten „Erika Testkundin“. Grenzen: Zeiten sind Maschinenzeiten ohne Lesezeit. Gemessen wurde nur die Antwortzeit der Seite (max. 1,1 s), menschliches Zögern nicht. Gedanken der Personas sind Einschätzungen aus dem sichtbaren Text.

## PRÜFUNG UND ERGEBNIS
Das Ziel Anzahlung wurde nicht erreicht. Als zweites Ziel lief die Dacia-Anfrage bis Schritt 5 von 5, „Anfrage absenden“ blieb unberührt.

| Persona · Gerät | Tipps bis Eingabe | Sekunden Abbruch / Ziel | Zögern über 5 s | Abbruch | Anrufen in einem Schritt |
|---|---|---|---|---|---|
| Rentnerin · Telefon | 3 | 9,2 / 16,7 | nein | ja, Schritt 8 | Start ja, Anfrage nein |
| Rentnerin · Desktop | 3 | 11,5 / 21,3 | nein | ja, Schritt 8 | Start ja, Anfrage nein |
| Eilige · Telefon | 2 | 7,9 / 15,7 | nein | ja, Schritt 9 | Start ja, Anfrage nein |
| Eilige · Desktop | 2 | 10,1 / 19,7 | nein | ja, Schritt 9 | Start ja, Anfrage nein |
| Hausverwaltung · Telefon | keine | Ziel 4,8 | nein | nein | Start und Schließanlagen ja, Planung nein |
| Hausverwaltung · Desktop | keine | Ziel 4,6 | nein | nein | Start ja, übrige nein |
| Schlüsseldienst · Telefon | keine | Ziel 4,7 | nein | nein | Start ja, Partnerseite nein |
| Schlüsseldienst · Desktop | keine | Ziel 2,9 | nein | nein | Start ja, Partnerseite nein |

Erkundung: am Telefon neun Kacheln ohne Scrollen über der Fußleiste. Das Feld „Bitte dieses Feld leer lassen“ ist nicht sichtbar.

## STOLPERSTEINE (Ort, Zitat, Gedanke der Persona)
1. Suche, Schritt 1, alle Autoschlüssel-Läufe: „VW Golf 7“ ergibt „Kein Treffer für „VW Golf 7“. Fahrzeug trotzdem anfragen“. Gedanke: „Ich habe das Beispiel eingegeben.“ Am Telefon liegt die Rückmeldung unter der Fußleiste.
2. Schritt 8, Rentnerin: „Drei Aufnahmen brauchen wir auf jeden Fall.“ Gedanke: „Das schaffe ich nicht allein.“
3. Schritt 7, Eilige: Nach „Kein funktionierender Schlüssel“ wird „Zweitschlüssel anfertigen“ angeboten. Gedanke: „Das passt nicht zu meiner Angabe.“
4. Schritt 9, Eilige: „Zulassungsbescheinigung Teil I (Fahrzeugschein)*“, Weiter gesperrt. Gedanke: „Das Foto habe ich nicht.“
5. Dacia-Anliegen: vorbelegt mit „Fahrzeug: Dacia Sandero.“, die Mindestlänge von 20 Zeichen ist damit erfüllt.
6. Telefon: „Partner werden“ nur im Footer, nach 11 Wischbewegungen. Karte „03 Hausverwaltung“ nach 7.
7. Zwischenstand nach Abbruch: „Ihr Zwischenstand von zuletzt wurde geladen.“ („Weitermachen“, „Neu beginnen“). Golf-Treffer: Schritt 3 ohne Fahrzeugnamen.

## BEFUNDE NACH WIRKUNG
1. Ohne Fotos kein Weg zur Anzahlung, und im Schritt gibt es keinen Anruf ohne Scrollen (Stolperstein 2). Bild: /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/rentnerin-mobil-04-schritt8-fotos-pflicht.png
2. „VW Golf 7“ ohne Treffer, Rückmeldung unter der Fußleiste (Stolperstein 1). Bild: /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/rentnerin-mobil-03-suche-golf7-kein-treffer.png
3. Das Zweitschlüssel-Angebot widerspricht der Angabe (Stolperstein 3). Bild: /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/eilige-mobil-05-schritt7-leistung.png
4. Anrufen nur nach Scrollen auf allen Anfrage-Schritten. Bild: /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/rentnerin-mobil-02-anfrage-schritt1.png
5. Vorbelegtes Pflichtfeld (Stolperstein 5). Bild: /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/rentnerin-mobil-08-dacia-anliegen.png

## BELEGE
Protokolle `<persona>-<gerät>.json` und Bilder unter /home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E4-PROBENUTZER-01/. Nicht von mir verändert, aber seit 09:15 geändert: STATUS.md, PRUEFPUNKT.md, PLAN.md und .next/server/route-cache (vermutlich der Server beim Seitenaufruf).

## GEMEINSAME DATEIEN
Keine geändert. Wünsche, nicht umgesetzt: Trefferhinweis oberhalb der Fußleiste; Zweitschlüssel nur bei funktionierenden Schlüsseln; Schritte 8 und 9 mit einem Weg ohne Foto; Fahrzeugname in Schritt 3; Dacia-Anliegen ohne Vorbelegung; „Partner werden“ im mobilen Menü; Anrufleiste auf den Anfrage-Schritten.

## OFFENE FRAGEN
1. Im Ordner testdaten liegen keine Bilder. Bitte Bilder für Schlüssel und Fahrzeugschein bereitstellen, dann Nachlauf bis zur Anzahlung (Schritt 12 von 13).
2. Sind drei Pflichtfotos in Schritt 8 beabsichtigt?
3. Die Testmaus stand am Desktop über „Mehr“ (Menü offen). Klick und Tastatur sind ungeprüft.
4. Menschliches Zögern ist nicht gemessen; dafür braucht es Testpersonen.
