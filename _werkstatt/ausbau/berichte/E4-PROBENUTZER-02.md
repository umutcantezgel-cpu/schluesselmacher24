# E4-PROBENUTZER-02 · Probelauf des zweiten Anlaufs

Stand 2026-11-03, Prüfserver localhost:3000 (JSON). Zehn Läufe: vier Personas am Telefon und am Desktop, dazu zwei Wege ohne Fotos. Keine Abbrüche, nichts abgesendet, keine Zahlung ausgelöst.

## GEÄNDERTE DATEIEN
Keine Projektdatei. Geschrieben: protokolle/E4-PROBENUTZER-02/ (Lauf-JSON, Bilder, Belege) und dieser Bericht.

## WAS UND WARUM
Playwright-Skripte im Scratchpad, gestartet über sicher.sh. Jede Persona beginnt auf der Startseite und tippt nur sichtbare Knöpfe und Links. Testdaten: Erika Testkundin, test@example.invalid. Fremde Anfragen: 0. Zeiten sind Maschinenzeiten ohne Lesezeit, Wischbewegungen sind geschätzt.

## TABELLE JE PERSONA UND GERÄT

| Persona · Gerät | Tipps bis Eingabe | Sek. bis Ziel (Anzahlung / Anfrage) | Zögern über 5 s | Abbruch | Anrufen in einem Schritt (Link im Sichtfeld) | Ziel erreicht |
|---|---|---|---|---|---|---|
| Rentnerin · Telefon | 3 | 31,0 / 67,3 | nein | nein | Start ja, Fotoschritt ja, Anfrage nein | ja |
| Rentnerin · Desktop | 3 | 32,8 / 70,5 | nein | nein | Start ja, Fotoschritt ja, Anfrage nein | ja |
| Eilige · Telefon | 2 | 22,2 / 54,5 | nein | nein | Start ja, Fotoschritt ja, Anfrage nein | ja |
| Eilige · Desktop | 2 | 23,9 / 57,2 | nein | nein | Start ja, Fotoschritt ja, Anfrage nein | ja |
| Hausverwaltung · Telefon | keine | 2,6 (Planung) | nein | nein | Start ja, Planung nein | ja |
| Hausverwaltung · Desktop | keine | 2,7 (Planung) | nein | nein | Start ja, Planung nein | ja |
| Schlüsseldienst · Telefon | keine | 3,1 (Partnerseite) | nein | nein | Start ja, Partnerseite nein | ja |
| Schlüsseldienst · Desktop | keine | 3,1 (Partnerseite) | nein | nein | Start ja, Partnerseite nein | ja |
| Ohne Fotos, Rentnerin · Telefon | 3 | 23,2 (Prüfseite) | nein | nein | Fotoschritt ja | ja |
| Ohne Fotos, Eilige · Desktop | 2 | 20,6 (Prüfseite) | nein | nein | Fotoschritt ja | ja |

Rentnerin und Eilige erreichen die Anzahlung (Schritt 4 von 5) und die Dacia-Anfrage vor dem Absenden. Gesamttipps: 46, 46, 41, 41, 4, 4, 5, 4, 24, 23. Lauf 1 hatte zwei Abbrüche.

## PRÜFUNG UND ERGEBNIS
- Aus Lauf 1 behoben: Vorschlag für „VW Golf 7“, freiwillige Fotos, „Ersatzschlüssel“ statt „Zweitschlüssel“, Partner werden im Menü, Anruf im Fotoschritt. Offen: Zwischenstand.
- Nichts abgesendet: 0 Klicks auf Absendeknöpfe. Netzwerk: nur Serveraktionen und Uploads, keine Formularsendung, 0 Anfragen in drei Sekunden nach Ankunft auf Anzahlung und Prüfseite.
- Größte Antwortzeit 0,78 s. Menschliches Zögern ist nicht gemessen.

## STOLPERSTEINE (Ort · Zitat · Gedanke, Einschätzung)
1. Fotos (Rentnerin): „Dateien können gerade nicht gespeichert werden.“ Gedanke: Ist das gespeichert?
2. Anfrage, Zwischenstand (vier Läufe): „Ihr Zwischenstand von zuletzt wurde geladen.“ Gedanke: Warum bin ich bei der Anzahlung?
3. Leistung (Rentnerin): „… am Fahrzeug angelernt.“ Gedanke: Anlernen? Ich nehme, was nach Schlüssel klingt.
4. Unterlagen (Dacia): „Freiwillig.“ und „Ohne Fahrzeugschein fertigen wir keinen Schlüssel.“ Gedanke: Muss ich den Schein hochladen?
5. Fotoschritt: Link „Anfrage ohne Fotos senden“. Gedanke (Eilige): Senden? Ich will zuerst den Preis sehen.
6. Anzahlung: „Online-Zahlung ist noch nicht eingerichtet.“ Gedanke: 69,90 Euro, aber online geht das nicht?

Am Desktop öffnet sich das Menü „Mehr“ beim Überfahren und bleibt offen, bis ein Klick oder Escape folgt. Es verdeckt Kacheln. Weitere Stolpersteine: belege-stolpersteine.txt.

## BEFUNDE NACH WIRKUNG
1. Uploads scheitern: 14 von 14 antworten mit 503. „Weiter“ bleibt möglich, der Fahrzeugschein (R13) gilt im Browser als angenommen. Bild: protokolle/E4-PROBENUTZER-02/rentnerin-mobil-06-06-fotos-schluessel-hochgeladen.png
2. Zahlung widersprüchlich: „Die Anzahlung zahlen Sie online.“ (Startseite) gegen „Online-Zahlung ist noch nicht eingerichtet“ (Anzahlung). Bild: rentnerin-mobil-10-10-anzahlung.png
3. Ohne Fotos endet der Weg in „Allgemeine Anfrage“ ohne Preis. Bild: ohnefotos-rentnerin-mobil-06-06-gefuehrte-anfrage-ohne-fotos.png
4. Der zweite Auftrag startet auf der Anzahlung des ersten. Bild: rentnerin-mobil-12-12-zwischenstand-hinweis.png
5. Die Unterlagen widersprechen sich. Bild: rentnerin-mobil-16-unterlagen-3-von-5.png

## BELEGE
Je Lauf: protokolle/E4-PROBENUTZER-02/<persona>-<gerät>.json (Stationen, Tipps, Antworten, Anfragen). Textbelege: belege-*.txt. Desktop-Menü: belege-kopfleiste-mehr-hover-desktop.png.

## OFFENE FRAGEN
1. Entwicklung: Ist der 503 im JSON-Modus ein Umgebungsfehler? Wie wird der Fahrzeugschein geprüft, wenn der Upload scheitert?
2. Inhaber (G9, R9): Gilt „online“ oder „noch nicht eingerichtet“?
3. Rechtsprüfung (R10): Der Zustimmungstext zur Widerrufsfrist ist für Laien schwer verständlich.
4. Entwicklung: Welche Serveraktion läuft beim Öffnen von „Partner werden“?
5. Zögern und Lesezeit fehlen. Dafür braucht es Testpersonen.
