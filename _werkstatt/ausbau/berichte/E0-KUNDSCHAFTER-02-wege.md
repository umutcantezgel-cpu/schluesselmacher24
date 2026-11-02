# E0-KUNDSCHAFTER-02 · Wege, Rubriken, Formulare, Navigation

Lesezugriff, Branch claude/affectionate-knuth-n7mjur. 54 page.tsx unter src/app/(site) gezählt. Inhaltsseiten nur zugeordnet.

## GEÄNDERTE DATEIEN
Keine. Geschrieben wurde nur dieser Bericht.

## WAS UND WARUM

### 1 Navigation (src/lib/navigation.ts, NAV_AREAS 35-270: 9 Bereiche, 49 Unterlinks, 7 Hervorhebungen)
- Autoschlüssel /autoschluessel: nachmachen, programmieren, kopieren, schluesselbart-fraesen; funkschluessel, smart-key, fahrzeugoeffnung; marken, ratgeber/autoschluessel-verloren-was-tun. Highlight autoschluessel/anfrage.
- Nach Foto /schluessel-nach-vorlage: anfrage, schluessel-einschicken, ratgeber/schluesselcode-finden.
- Nach Code /schluessel-nach-code: ratgeber/schluesselcode-finden, rechtliches/versand-und-zahlung.
- Zylinder /gleichschliessende-zylinder: konfigurator, ratgeber/zylinder-richtig-ausmessen, #nachbestellen.
- Schließanlagen /schliessanlagen: #systeme, konfigurator, ratgeber/welche-schliessanlage-passt, #nachbestellen.
- Zutritt /elektronische-zutrittsloesungen: konfigurator, ratgeber/mechanisch-oder-elektronisch.
- Tür- und Schließtechnik /tuer-und-schliesstechnik: profilzylinder-und-spezialzylinder, einsteckschloesser, mehrfachverriegelungen, schutzbeschlaege, tuerzusatzschloesser, tuerschliesser, panik-und-fluchttuertechnik, reparatur-und-austausch, technische-beratung, montage-und-anpassung.
- Sicherheitstechnik /sicherheitstechnik: videoueberwachung, alarmtechnik, aussenhautsicherung, mechanischer-schutz, smarte-funktionen, panik-und-alarmtaster, kombinierte-konzepte, ratgeber/einbruchschutz-wo-anfangen. Highlight sicherheitscheck.
- Service und Termin /service-und-termin: anfrage, terminstatus, vor-ort, kontakt.
- Hauptleiste site-header.tsx 41-48: Autoschlüssel, Nach Code, Zylinder ab 1024 px; Nach Foto, Schließanlagen ab 1280 px; Zutritt ab 1536 px. Rest unter „Mehr“ (216-233).
- Fuß: site-footer.tsx 121-131 (Bereiche), 152-163 (Service, navigation.ts 18, 296-301), 165-184 (Rechtliches, navigation.ts 286-294), Telefon 83-96.
- Mobil: Schublade site-header.tsx 307-315 und 401-547, Öffner 193-204. mobile-action-bar.tsx 13-18: 4 Ziele, ohne Telefon, ausgeblendet bei /anfrage, /konfigurator, /sicherheitscheck, /kasse, /admin.

### 2 Startseite (src/app/(site)/page.tsx, 504 Zeilen)
- Hero 124-211: Überschrift 128-130, Bildfläche 134-147, Knöpfe 165-175, Eckdaten 183-206.
- Schnelleinstieg 213-270, Titel „Wobei können wir helfen?“ in Zeile 221, also nach dem Hero. Acht Kacheln 226-268 aus QUICK_ENTRIES (navigation.ts 273): Autoschlüssel (/autoschluessel), Nach Foto (/schluessel-nach-vorlage), Nach Code (/schluessel-nach-code), Zylinder (/gleichschliessende-zylinder), Schließanlagen (/schliessanlagen), Zutritt (/elektronische-zutrittsloesungen), Tür- und Schließtechnik (/tuer-und-schliesstechnik), Sicherheitstechnik (/sicherheitstechnik). Icons aus bereich-icon.tsx 20-30. Herkunft: Code, nicht Daten.
- Weitere Blöcke: Vertrauen 272-310 (TRUST_POINTS 60-77, fest), Autoschlüssel-Ablauf 312-370 (carKeySteps 102-108, Zahlen statt Icons 358-360), Direkt kaufen 372-417, Projekte 419-469, Ratgeber 471-501 (content/guides.json).
- Animation: FraesbahnBewegung (src/components/visual/interaktiv/fraesbahn-bewegung.tsx 96) spielt einmal beim Sichtbarwerden (106-114), gezeichnet von ProfilschnittGrafik (src/components/visual/generators/profilschnitt.tsx 106), Takt 0,3 s und 1,1 s (52). Schlüssel: viewBox 480 x 360 (25-26), Reide 100 Einheiten (29), Halm x 140 bis 426 (35-36), Spitze x 456 (37). Länge 432 von 480 Einheiten.

### 3 Wege
Route: Server Actions (Spalte Abschluss), Uploads /api/kunden-upload, Zahlung /api/zahlung/stripe und /rueckkehr. Vorgangsart: RecordKind (types.ts 583). * = Pflicht.

| Weg | Einstieg und Schritte | Uploads und Nachweis | Abschluss · Route · Vorgangsart | Status |
|---|---|---|---|---|
| Autoschlüssel Termin | /autoschluessel/anfrage, 13 Schritte. Baujahr*, Kontakt* (Vorname, Nachname, E-Mail, Telefon, PLZ, Ort, Land), Zustimmungen* | Vorderseite*, Rückseite*, Bart*, Fahrzeugschein*. Fahrzeugschein serverseitig (unterlagen-pflicht.ts 25). Vollmacht fehlt | Anzahlung, Stripe · submitRecord (records.ts 109) · termin | vorhanden |
| Autoschlüssel Modellseiten | /autoschluessel/marken, [make], [model]; keine Felder, Link ?marke=&modell= (174) | keine | Weiter in den Termin | vorhanden |
| Autoschlüssel Anfrage | fehlt. Bei fehlendem Preis nur „zurück“ (assistent.tsx 1525-1535) | Fahrzeugschein, Foto (G-15) | keine | fehlt |
| Schlüssel nach Code | /schluessel-nach-code/[slug]. Schlüsselcode*, Stückzahl, Foto je Linie (bestell-formular.tsx 146, 288) | zy-02: Sicherungskarten-Foto*, nur im Browser. 51 Linien frei | Warenkorb, Kasse · submitOrder (orders.ts 151) · bestellung | vorhanden |
| Schlüssel nach Foto | /schluessel-nach-vorlage/anfrage, 8 Schritte (anfrage-formular.tsx 30). Vorderseite*, Rückseite*, Spitze*, Stückzahl 1 bis 20, Kontakt* | Drei Fotos* nur im Browser, Beschriftung frei, kein Nachweis | Anfrage, Freigabe, Zahlungslink (foto-freigabe.ts) · submitRecord · anfrage | vorhanden |
| Schlüssel einschicken | /schluessel-einschicken, kein Formular, nur Weg zur Foto-Anfrage (page.tsx 143-148) | Sicherungskarte nur Texthinweis (page.tsx 77) | keine eigene Aktion | fehlt |
| Zylinder, Sperrschließung | /gleichschliessende-zylinder/konfigurator, 6 Schritte. Maß A*, Maß B*, Anzahl gemeinsamer Schlüssel* (konfigurator.tsx 636, 973, 998) | keine. Sicherungskarte nur als Option (cylinder-catalog.json) | Warenkorb, Kasse · submitOrder · bestellung | teilweise |
| Schließanlage | /schliessanlagen/konfigurator, 11 Blöcke, 29 Pflichtmarken (projekt-konfigurator.tsx 190-255). Sicherungskarte vorhanden?* (1319), Kontakt* | Dokumente und Grundriss frei, Nachweis nur als Frage | Projektanfrage ohne Zahlung · submitRecord · projekt | teilweise |
| Elektronische Zutrittslösungen | /elektronische-zutrittsloesungen/konfigurator, 7 Fragen, Kontakt (Vorname*, Nachname*, E-Mail*, Telefon*) | keine | Projektanfrage · submitRecord · projekt | vorhanden |
| Tür- und Schließtechnik | /tuer-und-schliesstechnik mit [slug], 10 Leistungsseiten (content/service-pages.json), Anfrage per ?thema=. Ablauf fehlt (G-10) | keine | Anfrage · submitRecord · anfrage | teilweise |
| Sicherheitstechnik | /sicherheitstechnik, [slug] (7), /sicherheitscheck mit 10 Schritten. Zugänge*, Internet*, WLAN*, App*, Protokoll*, Kontakt* inkl. Land* | Objektfotos, Grundriss frei | Anfrage · submitRecord · anfrage | vorhanden |
| Service und Termin | /service-und-termin/anfrage. Thema*, Anliegen*, Kontakt* | Unterlagen frei, max. 5 | Anfrage · submitRecord · anfrage (Bereich nach Thema) | vorhanden |
| Vor-Ort-Service | /service-und-termin/vor-ort, 6 Verweise (34-76), keine Felder | keine | keine eigene Aktion | vorhanden |
| Kontakt | /service-und-termin/kontakt, kein Formular. Telefon (113-125), E-Mail, Link zur Anfrage (48) | keine | keine | teilweise |
| Partner werden | /partner-werden, 5 Schritte. Firma*, Ansprechpartner*, Kontakt*, PLZ*, Ort*, Einsatzradius*, Datenschutz* | Nachweise frei. Kein Vertrag, keine Unterschrift | Bewerbung ohne Zahlung · submitRecord · partner | teilweise |
| Terminstatus | /service-und-termin/terminstatus. Vorgangsnummer*, E-Mail* | keine | Stand anzeigen · fetchRecordStatus (booking.ts 108) | vorhanden |
| Warenkorb und Kasse | /warenkorb, /kasse. Vorname*, Nachname*, E-Mail*, Telefon*, Anschrift*, Versandart*, AGB*, Anfertigungsbestätigung* | Fotos der Codelinien | Stripe oder Status offen · submitOrder · bestellung | vorhanden |
| Widerruf | /rechtliches/widerruf/erklaeren. Name*, E-Mail*, Vorgangsnummer frei | keine | Sammlung widerrufe, Mails · widerrufErklaeren (widerruf.ts 38) · keine Vorgangsart | vorhanden |

### 4 Rubriken als Daten
content/service-pages.json: 17 Einträge (10 Tür, 7 Sicherheit), Felder id, slug, area, title, summary, bullets, image, process, ctaHref, ctaLabel, seo, active. Gelesen von den vier Rubrikseiten (lib/data/index.ts 70-80). Weitere Daten: car-key-services.json (6), vehicles.json (12 Marken, 49 Modelle), code-lines.json (52), cylinder-catalog.json, guides.json, cities.json (1), seo.json, settings.json. Navigation, Hub, Abläufe und Formulare stehen im Code.

### 5 Formular-Bausteine
Field (forms/field.tsx), TextInput, TextArea, Select, QuantityInput (forms/controls.tsx), OptionCard (forms/option-card.tsx), PhotoUpload (forms/photo-upload.tsx, max. 4 MB), SchutzFelder (forms/formular-schutz.tsx), SummaryList (layout/summary-list.tsx), FlowShell (flow/flow-shell.tsx). Validierung: zod in server/record-schema.ts, actions/orders.ts, rechtliches/widerruf-aufnahme.ts; im Browser unterlagen-pruefung.ts und kasse-formular.tsx 70-95.

### 6 „So läuft Ihr Auftrag ab“
Mit Fach-Icons nur schluessel-nach-vorlage/page.tsx 306-336 (fünf Schritte). Zahlen auf der Startseite und autoschluessel/page.tsx 492-505. Fehlt auf schluessel-nach-code, gleichschliessende-zylinder und schliessanlagen. Nur Verfahrensname auf tuer-und-schliesstechnik/page.tsx 246-260, sicherheitstechnik/page.tsx 190-196 und [slug]-Seiten.

### 7 Anrufen und Rückruf
Telefon im Fuß jeder Seite (site-footer.tsx 83-96), auf der Startseite über WerkstattZeile (page.tsx 208, 284), auf der Kontaktseite (113-125). Nicht im Kopf (site-header.tsx 163-205), nicht in Schublade oder Fußleiste. Kein Rückruf für Kunden, nur der Teamhinweis „Rückruf empfohlen“ (team-hinweis.ts 57).

## GEMEINSAME DATEIEN (gewünschte Änderungen)
1. src/lib/navigation.ts: Kacheln und Mehr-Einträge (Motorrad, Gehäuse, Transponder-Kopie, Schlüsselfinder, Partner werden, Ratgeber, Über uns), Begriff Sperrschließungen.
2. src/lib/types.ts 65-74, src/lib/server/record-schema.ts 11-21, src/components/visual/bereich-icon.tsx 20-30: neue Bereiche nur gemeinsam.
3. src/lib/server/datei-pruefung.ts 14-20: Kategorien für Vollmacht und Sicherungskarte.
4. src/lib/actions/orders.ts und src/lib/actions/records.ts 170-174: serverseitige Prüfung der Pflichtfotos.
5. src/app/(site)/page.tsx 102-226: Hub nach oben, Raster, Ablauf aus Daten.
6. src/components/visual/generators/profilschnitt.tsx 25-37 und src/components/visual/interaktiv/fraesbahn-bewegung.tsx (G-04, G-07).
7. content/cylinder-catalog.json: maxCylinders 30 gegen G-28 (10).

## PRÜFUNG UND ERGEBNIS
- 54 page.tsx gezählt. Wege: 18 Zeilen, davon 11 vorhanden, 5 teilweise, 2 fehlt (Autoschlüssel Anfrage, Einschicken).
- G-01 bis G-51: je eine Zeile. Ergebnis: 2 vorhanden, 27 teilweise, 1 abweichend, 10 fehlt, 11 nicht Wegebereich.
- Fehler im Bestand: Sicherungskarte (orders.ts) und Schlüsselfotos nur im Browser erzwungen, serverseitig nur der Fahrzeugschein (records.ts 170-174). Telefon serverseitig keine Pflicht (record-schema.ts 29). Navigation: „zehn Blöcke“ (navigation.ts 154), Konfigurator: elf. Kommentar „vier Schritte“ (schluessel-nach-vorlage/page.tsx 306) bei fünf.

## BELEGE
/home/user/schluesselmacher24/src/lib/navigation.ts · /home/user/schluesselmacher24/src/app/(site)/page.tsx · /home/user/schluesselmacher24/src/lib/server/unterlagen-pflicht.ts · /home/user/schluesselmacher24/src/lib/actions/records.ts · /home/user/schluesselmacher24/src/lib/actions/orders.ts · /home/user/schluesselmacher24/src/lib/server/record-schema.ts · /home/user/schluesselmacher24/src/components/visual/generators/profilschnitt.tsx · /home/user/schluesselmacher24/content/service-pages.json · /home/user/schluesselmacher24/content/cylinder-catalog.json

## G-ANFORDERUNGEN (Schritt 8)
G-01 teilweise: Hub nach dem Hero, Zeile 221.
G-02 abweichend: mobil Wischleiste, ab 640 px zwei Spalten (page.tsx 226).
G-03 teilweise: acht von zwölf Kacheln, andere Reihenfolge, Daten im Code.
G-04 teilweise: Fräsbahn statt Verwandlung. Übergang nur beim Icon (seitenwechsel.tsx 23).
G-05 nicht Wegebereich.
G-06 nicht Wegebereich. Animation spielt einmal (fraesbahn-bewegung.tsx 106).
G-07 teilweise: Länge 432 von 480 Einheiten (profilschnitt.tsx 29-37).
G-08 teilweise: Leiste „Zylinder“. Autoschlüssel ohne Motorrad, Gehäuse, Transponder, Schlüsselfinder (navigation.ts 36-73). Mehr ohne Partner, Ratgeber, Über uns.
G-09 teilweise: Begriff vorhanden, kein Kind-Eltern-Beispiel (gleichschliessende-zylinder/page.tsx 149).
G-10 teilweise: Icons nur bei Foto-Anfrage (schluessel-nach-vorlage 306-336), sonst Zahlen oder fehlt.
G-11 teilweise: Leistungsseiten aus JSON, Rest im Code.
G-12 nicht Wegebereich.
G-13 nicht Wegebereich.
G-14 teilweise: 12 Marken, 49 Modelle, ab 1994, keine Herkunft (vehicles.json).
G-15 teilweise: Freitextmodell (assistent.tsx 967-980), kein Anfrageweg.
G-16 vorhanden: Anzahlung und Termin (assistent.tsx 1544-1643).
G-17 teilweise: Modellseite mit Preisen, kein Angebotsüberblick (model/page.tsx 114-137).
G-18 fehlt: kein Klonen, Bogen KLONBAR nicht im Bestand.
G-19 fehlt: kein Motorrad (0 Treffer).
G-20 teilweise: Gehäuse als Termin-Leistung (car-key-services.json), kein Anfrage- und Versandweg.
G-21 fehlt, später.
G-22 teilweise: 52 Codelinien, Bogen SORTIMENT fehlt im Bestand.
G-23 teilweise: Beispielplätze (anfrage-formular.tsx 530-647), kein Hinweis zu nicht ablesbaren Fotos.
G-24 fehlt: kein Adressformular, keine Versandmarke (0 Treffer).
G-25 teilweise: Status versendet und abgeschlossen (types.ts 589-600), kein Einsendeweg.
G-26 fehlt: kein Hinweis auf ländliche Gebiete.
G-27 teilweise: Projekterfassung, keine Schließmatrix, Schlüsselkappen oder Schließplan-PDF.
G-28 teilweise: bis 30 Zylinder je Satz (cylinder-catalog.json), verlangt sind 10.
G-29 teilweise: Maßgrafik, Pflichtmaße (konfigurator.tsx 971-998). Kein Video, keine Bestätigung „Maße geprüft“.
G-30 teilweise: Kundentyp-Auswahl (projekt-konfigurator.tsx 264-274), Empfehlung nicht belegt.
G-31 nicht Wegebereich.
G-32 nicht Wegebereich.
G-33 fehlt: keine Hersteller- oder Produktnamen (0 Treffer).
G-34 teilweise: Tür (10) und Sicherheit (7) vorhanden, Schlüsselaufbewahrung fehlt.
G-35 teilweise: Zylinderzahl (1150), Anlagenart (1363), Fotos (1789); Notizfeld fehlt.
G-36 teilweise: Anfrage mit Fotos (anfrage-formular.tsx 305-318), kein eigenes Kontaktformular.
G-37 fehlt: nur HTML-Vorgangsblatt (druckansichten.ts 1-12), kein PDF.
G-38 teilweise: Kasse und Anfrage. Kontakt, Vor-Ort und Einschicken ohne Abschluss.
G-39 teilweise: Bewerbung und Nachweise (partner-formular.tsx 446-452). Vertrag-PDF und Unterschrift fehlen.
G-40 nicht Wegebereich.
G-41 teilweise: ein Standort (cities.json).
G-42 fehlt: keine Karte, Anfahrt nur Platzhalter (kontakt/page.tsx 27).
G-43 nicht Wegebereich.
G-44 fehlt: kein Video (0 Treffer).
G-45 teilweise: Beispielplätze ohne Bilder (anfrage-formular.tsx 530-647).
G-46 nicht Wegebereich.
G-47 vorhanden: Generatoren zylinder-mass, schliessplan, profilschnitt.
G-48 teilweise: 395 Gedankenstriche in 72 Dateien (src/app/(site)), 221 in content/*.json.
G-49 nicht Wegebereich.
G-50 fehlt, später.
G-51 nicht Wegebereich.

## OFFENE FRAGEN
1. Vollmacht: eigene Nachweiskategorie? Bestand: kein Treffer.
2. Sicherungskarte: eigene Kategorie und serverseitige Pflicht (zy-02)?
3. Zylindersätze: 30 oder 10 mit Anfrage darüber (G-28)?
4. Bogen SORTIMENT und KLONBAR fehlen (G-18, G-22).
5. Gehäuse, Motorrad, Transponder: Daten vom Inhaber.
6. Anfahrt und Karte: Text und Standort fehlen (kontakt/page.tsx 27).
7. Autoschlüssel-Anfrage bei unbekanntem Fahrzeug: eigenes Formular?
8. Telefon serverseitig Pflicht (record-schema.ts 29)?
