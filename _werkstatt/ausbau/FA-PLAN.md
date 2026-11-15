# FA-PLAN · Umsetzung der Finalen Arbeitsanweisung vom 11.11.2026

Quelle der Lücken: `berichte/FA-ABGLEICH.md` (352 Anforderungen aus 29 Abschnitten und zwei Anhängen: 90 erfüllt, 184 teilweise, 68 fehlen, 10 widersprechen). Reihenfolge nach FA-28. Dieser Plan führt die FA-Pakete; `PLAN.json` bleibt der Plan des alten Laufs und wird am nächsten Tor zusammengeführt (A-046).

Regeln für die Wellen
- Höchstens ein Paket zur Zeit ändert das Datenschema (Payload-Sammlungen, Migration, `payload-types.ts`) und nutzt `sicher.sh --pg`. Pakete ohne Schema laufen daneben, mit getrennten Dateien.
- Jedes Paket: Paketdatei in `pakete/`, Umsetzung, zwei Gegenprüfer (Vorgabe und Wahrheit; Technik und Bestand), Nachbesserung, danach Abnahme durch den Orchestrator: Typprüfung, Lint, Unit, DB, Build, Sichtprobe; erst dann Commit.
- Was nur Menschen liefern können (echte Produkte, Preise, Fotos, Verträge, Konten), steht in MENSCHEN.md; die Technik dafür wird trotzdem fertig gebaut.

Status: offen · läuft · abgenommen · committet (mit Commit) · wartet (mit Grund)

## Priorität 1 · Sofort
| Paket | Inhalt | Anforderungen | Schema | Status |
|---|---|---|---|---|
| FA-SOFORT-01 | Ein Markenorange statt Blau, die 24 orange | FA-04 | nein | committet 65a74e9 |
| FA-SOFORT-02 | Erreichbarkeit statt Öffnungszeiten; Adresse Langgasse 61; Satz der Startseite | FA-23, FA-24, FA-03 (Sprache) | ja (klein) | committet b14913a |
| FA-SOFORT-03 | Leistung „Schlüssel nach Foto“ entfernen, Rubrik „Schlüssel nach Vorlage“ | FA-03, FA-12 | nein (Datenmigration Kennung) | committet 9c61bca, Migration berichtigt 01fb7cc |
| FA-SOFORT-04 | Demo-Daten raus: Beispiel-Codelinien und Beispielartikel nie live, „Code anfragen“ | FA-10-02, FA-11-02, FA-11-17 | nein | committet 97087fe |
| FA-SOFORT-05A | Vier Fach-Icons: Roller, E-Scooter, Seniorenmobil, Fahrradschlüssel | FA-03 | nein | committet 93273e0 |
| FA-SOFORT-05 | Hauptzugänge im Hub nach FA-03 (14 Einträge), Rubriken und Navigation; die Anfragewege baut FA-KERN-02 | FA-03, FA-06-05/06/14 | ja (Rubrik-Werte) | committet, voll geprüft (Unit 2.787, DB 107, Build 177/177; Sichtprobe bei 360, 390, 768, 1440; A-052, A-056) |

## Priorität 2 · Kern
| Paket | Inhalt | Anforderungen | Schema | Status |
|---|---|---|---|---|
| FA-KERN-01 | Fahrzeugdatenbank: Fahrzeugklasse, Generationen mit Bauzeitraum, Quelle je Zeile, Importweg aus amtlicher und offener Quelle, Suche über alle Klassen, Marken A bis Z mit Untermarken | FA-06-01 bis -08, -U3 | ja | committet (Unit 2.603, DB 99, Build 168/168, Sichtprobe der Suche auf Telefon und Desktop) |
| FA-KERN-02 | Pflichtuploads serverseitig (Fahrzeugschein, drei Schlüsselfotos, Beschreibung) in allen Fahrzeugschlüssel-Wegen; „Fahrzeug nicht gefunden?“ überall mit Telefon und direkter Hilfe; Ersatzunterlage bei Kleinstfahrzeugen | FA-06-09 bis -17, -U1, -U2, FA-05-10, FA-05-11, FA-12-01, FA-12-03 | nein | Teil 1 (Steckplätze, Pflichtregel, bestehende Wege, Admin) committet ea1cee2 · Teil 2 FA-KERN-02B (gemeinsame Anfrage für alle Klassen, vier Einstiegsseiten, „Fahrzeug nicht gefunden?“, Verweis aus der allgemeinen Anfrage) committet, voll geprüft (Unit 2.760, DB 103, Build 177/177, Sichtprobe) |
| FA-KERN-03 | Auftragsweg und Zahlung: Hauptzentrale, Eigenbereich, Partner aus Postleitzahl und Terminort; Anzahlung 69,90 nur im Direktweg; Partnerauftrag erst nach Vollzahlung; Anzeige vor der Zahlung; Restbetrag | FA-05-12 bis -16, -20, FA-22-17 bis -19 | ja | committet, voll geprüft (Unit 2.830, DB 110, Build 177/177): Auftragsweg, Zahlung je Weg, Anzeige vor der Zahlung, Restbetrag; Partnerweg hinter dem Schalter |
| FA-KERN-04 | Partnerauszahlung im Admin: Partnerbetrag, Plattformanteil, Status bis „zur Auszahlung freigegeben“, Freigabe nach Bestätigung, Storno und Rückzahlung mit eindeutigem Stand | FA-05-17 bis -19, FA-22-20 bis -24, -27 | ja | committet, voll geprüft (Unit 2.875, DB 113, Build 177/177): Stände bis „ausgezahlt“, Kundenbestätigung, Plattformanteil und Partnerbetrag, Storno und Rückzahlung, Zahlungsdienst vorbereitet und aus |
| FA-KERN-05 | Admin Alltag: Kundenkontakt aus dem Auftrag mit Verlauf, Verfügbarkeit, Lieferzeit, Bestellung bearbeiten, Duplizieren geprüft | FA-22-02, -09, -10, -12, -13, -15, -16 | ja | committet cd6ba83, voll geprüft mit der Welle (Unit 3.175, DB 128, Build 177/177) |
| FA-KERN-06 | Mail: alle Systemmails mit der Domainadresse, Prüfung in der Livegang-Prüfung; Anleitung Zoho, SPF, DKIM, DMARC | FA-24 | nein | committet 0927630 |

## Priorität 3 · Shop
| Paket | Inhalt | Anforderungen | Schema | Status |
|---|---|---|---|---|
| FA-SHOP-01 | Kategorien und Unterkategorien als Daten; Codeprodukt mit Hersteller (Stammliste), System, Codebereich, Bild in Liste und Detail; Gruppierung nach Hersteller und System; Import der echten Angebote | FA-10-01, -03, FA-11-01 bis -19, FA-22-04, -05, -07 | ja | Teil 1 (Datenmodell und Admin) committet, voll geprüft (Unit 3.175, DB 128, Build 177/177) · Teil 2 FA-SHOP-01B (Seiten und Import) läuft · echte Angebote fehlen (MA-34, MA-47) |
| FA-SHOP-02 | Gehäuse, Reparatur, Customizing: Shopprodukte nach Hersteller, Modell, Tasten, Schlüsseltyp; Einsendeservice; Rubrik Customizing mit Vorher-Nachher und Kompatibilität | FA-14, FA-10-05 bis -08, FA-22-29, -30 | ja | offen |
| FA-SHOP-03 | Versand eingesendeter Schlüssel: DHL Paket, Einschreiben Einwurf, Einschreiben Wert mit Kosten und ehrlicher Haftung; Empfehlung für Originalschlüssel; Verpackungshinweis; Sendungsnummer; Label über Schnittstelle vorbereitet | FA-13, FA-AB-01 bis -03, FA-22-25 | ja | offen, wartet auf Recherche 03 |
| FA-SHOP-04 | Sperrschließungen: BKS und ABUS als Hersteller sichtbar, Zylindertypen, mehrere Maße in einer Bestellung geprüft, keine Demo-Preise | FA-15, FA-19-02 | ja (Logo-Feld) | offen |

## Priorität 4 · Plattform
| Paket | Inhalt | Anforderungen | Schema | Status |
|---|---|---|---|---|
| FA-PLATTFORM-01 | Partnernetz nur für Autoschlüssel: Leistungen nach FA-07, Qualitätskontrolle mit Besuch vor Ort, Pausieren wirkt, Region zuordnen, Lead-Verlauf | FA-07, FA-08-09 bis -15, FA-22-36 bis -41 | ja | offen |
| FA-PLATTFORM-02 | Partnergewinnung: Startseiten-Sektion „Autoschlüssel Profi? Partner werden“, fünf Seiten mit eigenem Anliegen | FA-08-01 bis -08 | nein | committet 4f494ef, Einbindung in Startseite, Fuß und Sitemap mit 97087fe |
| FA-PLATTFORM-03 | Ortsdatenbasis: amtliches Gemeindeverzeichnis importierbar, Stadt, Landkreis, Postleitzahl, Partnerregion verknüpft; Anhang A als Prioritätsliste; Veröffentlichung nur mit Substanz | FA-09, Anhang A, FA-AB-05 | ja | offen, wartet auf Recherche 02 |
| FA-PLATTFORM-04 | Unterschrift des Partnervertrags als Upload (Rest aus E7-OPUS-01 Teil 3) | G-39 | nein | offen |

## Priorität 5 · Inhalte
| Paket | Inhalt | Anforderungen | Schema | Status |
|---|---|---|---|---|
| FA-INHALT-01 | Tutorials: Rubrik, zehn Themen als Struktur, YouTube-Einbettung mit Einwilligung, im Admin ohne Entwickler pflegbar, Videos auf Leistungsseiten | FA-21, FA-22-32 | ja | offen |
| FA-INHALT-02 | Hersteller und Systeme früh sichtbar: Bereich auf der Startseite, BKS, ABUS, BURG-WÄCHTER sachlich; Logos erst nach Freigabe | FA-17-02, -03, -20, FA-19 | ja (Logo-Feld) | committet (Unit grün, Typprüfung und Lint der eigenen Dateien ohne Fehler; Build und Sichtprobe folgen mit FA-SHOP-01B): Herstellerbereich auf Startseite, Sperrschließungen und Zutritt; Logos erst nach Freigabe (MA-48) |
| FA-INHALT-03 | Texte menschlicher: kurze, klare Sätze auf Leistungsseiten, Gegenprüfung durch zwei unabhängige Leser, ohne Gedankenstriche | FA-02 | nein | Gruppen A bis G committet (Autoschlüssel-Leistungen, Tür- und Sicherheitstechnik, Rubrikseiten, Schlüsselwege im Shop, Ratgeber mit Artikeln und Warenkorb, Startseite mit Fahrzeugseiten, Kasse mit Vorgangsseite und Kundenmails) · offen: Standorte (nach FA-PLATTFORM-03), Texte der Shopseiten nach FA-SHOP-01B |
| FA-INHALT-04 | Bilder: Vorher-Nachher-Baustein, Logo unten rechts für eigene Fotos, Alt-Text-Pflicht, Hinweise zu Kennzeichen und Personen | FA-20 | ja | offen; Fotos fehlen (MA-05) |
| FA-INHALT-05 | Schließanlagen, Zutritt, Sicherheitstechnik: Zielgruppen, Erweiterbarkeit, Hinweis zu Ton und Aufzeichnung (FA-16-21 Erklärtexte pflegbar bleibt offen) | FA-16-06, -09, FA-17-18, FA-18-09, -13, -14 | nein | committet f54ce64 |

## Priorität 6 · SEO
| Paket | Inhalt | Anforderungen | Schema | Status |
|---|---|---|---|---|
| FA-SEO-01 | Titel und Beschreibungen in den Längen, Strukturdaten für Betrieb, Leistungen, Produkte, Brotkrumen überall, FAQ-Auszeichnung nach R8, Canonical und Indexstatus im Admin | FA-25, FA-22-44, -45 | ja (klein) | Teile A, B und C committet und voll geprüft; Onpage 134 Seiten, Median 100, kein Befund · offen: Canonical-Feld im Admin (Schema) |
| FA-SEO-02 | Eigene Onpage-Prüfung nach den Kriterien von Seobility über den Build (Schutz jeder Staging-Adresse liegt bei FA-SEO-01) | FA-25-21, -22, FA-AB-04 | nein | committet 1436cf3 |

## Priorität 7 · QA
| Paket | Inhalt | Anforderungen | Schema | Status |
|---|---|---|---|---|
| FA-QA-01 | Pflichttests je Hauptprozess als Browserläufe bis in den Admin (13 Zeilen aus FA-27), Geräteprofile iPhone, iPad, Android, Desktop | FA-27 | nein | offen |
| FA-QA-02 | Bedienbarkeit: Zurück ohne Datenverlust auch mit Dateien, Hilfe an kritischen Stellen, keine Sackgassen | FA-26 | nein | committet (Unit 3.420, Typprüfung, Lint grün): Hilfeblock, Fehlermeldung beim Absenden, Fortschritt für Vorleseprogramme, Rückfrage vor dem Verlassen, Auswege in allen 14 Formularen; Sichtprobe der Rückfrage im Browser folgt mit dem Build nach FA-SHOP-01B |
| FA-QA-03 | Abnahmebogen mit Testprotokollen und Bildern je Hauptprozess; Prüfung „keine Demo-Daten, keine Platzhalter, keine falschen Kontaktdaten“ | FA-27-15 bis -17 | nein | offen |
