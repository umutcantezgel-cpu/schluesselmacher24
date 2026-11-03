# E1-interview · Inhaberinterview SCHLÜSSELMACHER24

Kennung E1-AUTOR-01 · Stand 2026-11-03 · 238 Fragen in 15 Rubriken und Allgemeines · Grundlage: Bestand (content/, src/lib/data/defaults/), AUFTRAG.md Abschnitte 4 und 11, FACHWISSEN.md, MENSCHEN.md und die Erhebungen E1 (Gegenprüfung, Transponder, Versand, Normen, Systeme, Fahrzeugquellen, Nachfrage).

## Anleitung für den Inhaber

Antworten Sie mit einer Nachricht in dieser Sitzung, die mit ANTWORTEN beginnt und die Kennungen nennt, zum Beispiel: ANTWORTEN: I-AUTO-01 Ja, I-AUTO-02 69,90 Euro. Mehrere Kennungen dürfen in einer Nachricht stehen, und „weiß nicht“ ist eine gültige Antwort. Fragen mit VERTRAULICH beantworten Sie nur als Nachricht in dieser Sitzung, nie als Datei oder Upload, weil das Repository öffentlich ist. Unbeantwortete Fragen behalten ihre Standardannahme aus dem Bestand oder der Recherche, oder sie bleiben unsichtbar, und die Seite zeigt dazu nichts Unbelegtes. Vorschläge aus der Recherche sind nur Vorschläge zum Prüfen und gelten nicht als Tatsache. Beginnen Sie mit den zehn Fragen unter Zuerst, weil sie Preise, Lieferzeiten und Abläufe am stärksten bestimmen.

## Zuerst

1. I-AUTO-01: Marken und Modelle im Bestand, gilt weiterhin
2. I-AUTO-02: Anzahlung für den Autoschlüsseltermin
3. I-AUTO-03: Werktage bis zum fertigen Autoschlüssel
4. I-AUTO-04: Berechtigungsnachweis beim Autoschlüssel
5. I-CODE-01: Sortiment der 52 Codelinien mit Hersteller
6. I-EINS-01: Versandweg für Einsendungen
7. I-EINS-02: Versandkosten beim Einschicken
8. I-SPERR-02: Zylinder je Set, Grenze 30
9. I-ANL-01: Lieferzeit der Schließanlage in Wochen
10. I-ALLG-01: Garantie auf Schlüssel, Zylinder und Programmierung

## Legende

- Kennung: I, Rubrikkürzel, Nummer. Die Reihenfolge innerhalb einer Rubrik ist nach Wirkung geordnet.
- Antwortform: Ja/Nein, Zahl mit Einheit, Liste, Auswahl oder kurzer Text.
- Wozu: Seite, Ablaufschritt, Anforderung (G-01 bis G-51 aus AUFTRAG.md Abschnitt 4), Grenze (G1 bis G13) oder Rote Linie (R1 bis R13) aus AUFTRAG.md Abschnitt 6.
- Vorschlag (Quelle): „Bestand“ ist der heutige Stand im Repository, „Gespräch“ eine Aussage aus AUFTRAG.md Abschnitt 4, „Standard bis zur Antwort“ eine Vorgabe aus MENSCHEN.md. „Vorschlag aus der Recherche, bitte prüfen“ ist ein Hinweis aus den Erhebungen, keine Tatsache. „Offen laut“ verweist auf eine Lücke der Gegenprüfung.
- Pfade: Erhebungen und Auftragsdateien ohne Präfix unter _werkstatt/ausbau/. Bestandsdateien ab dem Wurzelverzeichnis des Repositorys (content/, src/).
- Vertraulich: VERTRAULICH heißt, die Antwort kommt nur als Nachricht in die Sitzung.

## 1 Allgemeines (I-ALLG)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-ALLG-01 | Welche Garantie gibt die Werkstatt auf Schlüssel, Zylinder und Programmierung, und wie viele Monate gilt sie? | Zahl in Monaten, kurzer Text | Vertrauensblock aller Wege, Wortlaut prüft der Anwalt (R10) | kein | nein |
| I-ALLG-02 | Welche Maschinen stehen in der Werkstatt, zum Beispiel Schlüsselfräse, Zylinderprüfung oder Programmiergerät? | Liste | Ablauf der Fertigung und Maschinenhinweise (G-51) | kein | nein |
| I-ALLG-03 | Welche Zahlarten nimmt die Werkstatt vor Ort an, zum Beispiel Bar, EC-Karte oder Rechnung? | Liste | Kasse und Abholung, Zahlhinweis (G-38, Grenze G13) | Bestand: Online über Stripe nach Konfiguration, zum Beispiel Karte, PayPal, Klarna, SEPA-Lastschrift. Ohne Onlinezahlung: Überweisung nach Rechnung oder Zahlung vor Ort (src/lib/rechtliches/zahlarten.ts) | nein |
| I-ALLG-04 | Welche dieser Zahlarten sollen online angeboten werden, und welche nicht? | Auswahl | Kasse und Zahlungszeile, jede Änderung nur mit Ihrer Freigabe (Grenze G13) | Bestand: Stripe-Zahlarten nach Konfiguration (src/lib/rechtliches/zahlarten.ts) | nein |
| I-ALLG-05 | Wie viele Werktage dauert es von der Bestellung bis zur Lieferung, wenn ein Schlüssel oder Zylinder nicht auf Lager ist? | Zahl in Werktagen | Lieferzeit auf allen Kassenseiten (G-38, R9) | kein | nein |
| I-ALLG-06 | Welche drei Fehler bringen Kunden am häufigsten in die Werkstatt, und wie vermeiden sie die? | kurzer Text | Hinweise im Hub und in den Rubriken (G-10) | kein | nein |
| I-ALLG-07 | In welchen Orten und Landkreisen in Hessen fährt der Außendienst regelmäßig hin? | Liste | Karte der Einsatzgebiete (G-42), Stadtseiten nur mit Partner (G-41) | Bestand: Einsätze vor Ort nur nach Prüfung (content/cities.json) | nein |
| I-ALLG-08 | Wie hoch ist die Anfahrt je Kilometer ab Wetzlar, und ab welcher Entfernung wird sie berechnet? | Zahl in Euro und Kilometern | Anfahrtshinweis und Einsatzgebiet (R9) | Bestand: kein Anfahrtsbetrag hinterlegt (content/cities.json) | nein |
| I-ALLG-09 | Welche Auftragsarten sollen Partner übernehmen dürfen, zum Beispiel Autoschlüssel oder Schließanlagen? | Liste | Partnerseite und Vermittlung je Auftragsart (G-40) | Bestand: Partner vor allem für Autoschlüssel (content/seo.json, Route partner-werden) | nein |
| I-ALLG-10 | Soll der Kunde an die Werkstatt zahlen (Modell B) oder rechnet der Partner selbst ab (Modell A)? | Auswahl: A oder B | Partnerseite und Abrechnung, B erst nach anwaltlicher Prüfung (G-40, R10) | Bestand: Partner rechnet direkt mit dem Kunden ab (content/seo.json, Route partner-werden). Gespräch: Modell B (AUFTRAG.md G-40) | VERTRAULICH |
| I-ALLG-11 | Welche Provision je Auftragsart ist vorgesehen, in Prozent oder Euro? | Zahl je Auftragsart | Abrechnung und Bogen PARTNER (G-40, MENSCHEN.md MA-04) | kein | VERTRAULICH |
| I-ALLG-12 | Welche Angaben und Nachweise verlangen Sie von einem Partner, bevor er freigeschaltet wird? | Liste | Bewerbung und Freischaltung (G-39, MENSCHEN.md MA-16) | kein | nein |
| I-ALLG-13 | In welchen Orten arbeiten bereits geprüfte Partner, und wie heißen sie? | Liste | Stadtseiten nur mit aktivem Partner (G-41, R2) | kein | VERTRAULICH |
| I-ALLG-14 | Gilt weiterhin, dass Fahrzeugscheinfotos nach 90 Tagen und Schlüsselfotos nach 180 Tagen gelöscht werden, obwohl die PDF-Anfrage im Admin bleibt? | Ja/Nein oder Zahl in Tagen | Löschfristen und PDF-Anfrage (G-37, R10, Anwalt prüft) | Bestand: 90 und 180 Tage (content/settings.json, retentionDays) | nein |
| I-ALLG-15 | Wie viele Termine kann die Werkstatt im Schnitt pro Tag halten? | Zahl je Tag | Terminkalender und Lieferfristen (G-16) | Bestand: ein Termin je Zeitfenster (content/settings.json, booking.slotsPerWindow) | nein |
| I-ALLG-16 | Seit wann arbeitet der Betrieb mit Schlüsseln und Schließtechnik, und welche Ausbildung hat die Werkstattleitung? | kurzer Text | Über-uns-Seite, nur mit belegten Angaben (R4) | kein | nein |

## 2 Autoschlüssel (I-AUTO)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-AUTO-01 | Gilt weiterhin die Auswahl von zwölf Marken aus dem Bestand? G-14 verlangt alle gängigen Marken von 1998 bis 2026. | Ja/Nein oder Liste | Fahrzeugwahl (G-14) | Bestand: zwölf Marken mit 49 Modellen (content/vehicles.json) | nein |
| I-AUTO-02 | Gilt weiterhin eine Anzahlung von 69,90 Euro für den Autoschlüsseltermin, oder welcher Betrag gilt? | Zahl in Euro | Termin mit Anzahlung, Ablauf Schritt 4 (G-16) | Bestand: 69,90 Euro, Spanne 50 bis 80 Euro (content/settings.json, booking). Gespräch: 49, 59, 69, 90 und 99 Euro (MENSCHEN.md MA-03) | nein |
| I-AUTO-03 | Wie viele Werktage liegen zwischen Anzahlung und fertigem Autoschlüssel, wenn Material bestellt werden muss? | Zahl in Werktagen | Ablauf Schritt 4 und 5, Lieferzeit (G-16) | Bestand: Vorlauf 7 Tage für Termine (content/settings.json, booking.leadTimeDays) | nein |
| I-AUTO-04 | Welchen Nachweis verlangt die Werkstatt heute bei Autoschlüsseln: Fahrzeugschein, Ausweis oder Vollmacht bei Firmenwagen? | Liste | Berechtigungsnachweis im Autoschlüsselweg (R13) | Bestand: Fahrzeugschein (src/lib/data/defaults/rubriken.ts). Vorschlag aus der Recherche, bitte prüfen: Zulassungsbescheinigung Teil I, Personalausweis, bei Firmenwagen Vollmacht (erhebung/E1-transponder.md, Abschnitt 4) | nein |
| I-AUTO-05 | Welche Fehler bringen Autofahrer beim Autoschlüssel am häufigsten mit, zum Beispiel falsche Variante oder fehlende Papiere? | kurzer Text | Hinweise im Ablauf, Schritt 2 (G-10) | kein | nein |
| I-AUTO-06 | Wo parken Kunden mit dem Fahrzeug an der Werkstatt, und wie lange dauert der Aufenthalt beim Anlernen? | kurzer Text | Terminseite, Ablauf Schritt 5 (G-16) | Bestand: Werkstatt in der Langgasse 70 (content/settings.json, location) | nein |
| I-AUTO-07 | Welche Mercedes-Baureihen bearbeitet die Werkstatt ohne vorherige Prüfung? | Liste | Preisgruppe D nur nach Prüfung, Fahrzeugwahl (G-14, R9) | Bestand: Mercedes-Benz in Gruppe D mit Prüfung vorab (content/vehicles.json, content/pricing-groups.json) | nein |
| I-AUTO-08 | Welche fünf Modelle fragen Kunden am häufigsten an? | Liste | Reihenfolge der Fahrzeugwahl und des Finders (G-17) | Vorschlag aus der Recherche, bitte prüfen: häufigste Modellreihen nach KBA FZ 12 (erhebung/E1-fahrzeugquellen.md, Abschnitt 1) | nein |
| I-AUTO-09 | Für welche Autoschlüssel fräst die Werkstatt den Bart nur nach Fahrzeugdaten, ohne Originalschlüssel? | Liste | Schlüsselbart fräsen auf der Autoschlüsselseite (G-14) | Bestand: nach Vorlage oder Fahrzeugdaten (content/car-key-services.json) | nein |
| I-AUTO-10 | Welche Programmier- und Diagnosegeräte hat die Werkstatt für das Anlernen am Fahrzeug? | Liste | Programmierungsseite und Klonen (G-18) | Vorschlag aus der Recherche, bitte prüfen: AVDI mit Jahresabo, Abrites PROTAG (erhebung/E1-transponder.md, Abschnitt 2) | nein |
| I-AUTO-11 | Welche Transpondergenerationen kann die Werkstatt anlernen: Festcode, Crypto oder AES? | Auswahl, mehrere möglich | Programmierungsseite, Gruppen B und C (G-18) | Vorschlag aus der Recherche, bitte prüfen: Festcode, Crypto und AES laut Fachbetrieb (erhebung/E1-transponder.md, Abschnitt 1) | nein |
| I-AUTO-12 | Welche Schlüsselrohlinge kauft der Betrieb ein, und welchen Einkaufspreis hat jeder? | Liste mit Euro | Preislogik und Einkauf (Grenze G13, R9) | kein | VERTRAULICH |
| I-AUTO-13 | Gilt die Anzahlung auch, wenn ein Schlüssel nur kopiert und nicht programmiert wird? | Ja/Nein | Terminweg bei Kopie und Programmierung (G-16) | kein | nein |
| I-AUTO-14 | Welche Zusatzkosten können anfallen, zum Beispiel Anfahrt, Rohling oder Freischaltung durch den Hersteller, und wie hoch sind sie? | Liste mit Euro | Ehrlicher Gesamtpreis vor der Anzahlung (R9) | Bestand: Ersatz bei Verlust nur nach Prüfung (content/service-pricing.json, Gruppen C und D) | nein |
| I-AUTO-15 | Welche Autoschlüssel nimmt die Werkstatt nicht an, und wohin verweist sie den Kunden dann? | Liste | Grenzen des Wegs, Anfrage als Ausweg (G-15, R9) | kein | nein |
| I-AUTO-16 | Bis wann kann der Kunde einen Termin kostenlos absagen, und was passiert mit der Anzahlung? | kurzer Text | Terminweg und Rückerstattung (Grenze G9, R10, Entwurf zur Prüfung) | kein | nein |
| I-AUTO-17 | Welche Angaben auf dem Fahrzeugschein darf der Kunde beim Hochladen schwärzen? | Liste | Hinweis zum Upload und Datenschutz (R10) | kein | nein |

## 3 Motorradschlüssel (I-MOTO)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-MOTO-01 | Wie viele Werktage dauert es von der Anfrage bis zum Preis für einen Motorradschlüssel? | Zahl in Werktagen | Ablauf Schritt 4, ehrliche Erwartung (G-19, R9) | kein | nein |
| I-MOTO-02 | Soll bei Motorradschlüsseln eine Anzahlung gelten, und wenn ja, wie hoch? | Ja/Nein und Zahl in Euro | Abschluss der Anfrage (G-19, G-38) | kein | nein |
| I-MOTO-03 | Welchen Nachweis verlangt die Werkstatt bei Motorradschlüsseln? | Liste | Berechtigungsnachweis im Motorradweg (R13) | Bestand: Fahrzeugschein (src/lib/data/defaults/rubriken.ts, motorradschluessel) | nein |
| I-MOTO-04 | Wie viele Werktage dauert die Fertigung eines Motorradschlüssels nach der Zusage? | Zahl in Werktagen | Ablauf Schritt 4 (G-19) | kein | nein |
| I-MOTO-05 | Welche Motorradmarken und Baujahre hat die Werkstatt schon bearbeitet? | Liste | Typ- und Baujahr-Feld der Anfrage (G-19) | kein | nein |
| I-MOTO-06 | Welche Motorräder mit Wegfahrsperre kann die Werkstatt anlernen oder kopieren, und welche nicht? | Liste | Pflichtfrage Transponder, Ablauf Schritt 3 (G-19) | kein | nein |
| I-MOTO-07 | Welche Motorradschlüssel fertigt die Werkstatt nach Vorlage, mechanisch oder mit Chip? | Auswahl | Auswahl im Anfrageformular (G-19) | kein | nein |
| I-MOTO-08 | Welche Motorradmodelle bearbeitet die Werkstatt grundsätzlich nicht? | kurzer Text | Ehrliche Grenzen, Ende der Anfrage (R9) | kein | nein |
| I-MOTO-09 | Welche Fehler machen Motorradfahrer bei der Anfrage am häufigsten, zum Beispiel ein falsches Baujahr? | kurzer Text | Hinweise im Anfrageformular (G-19) | kein | nein |
| I-MOTO-10 | Welche Fotos außer Schlüssel und Fahrzeugschein braucht die Werkstatt, zum Beispiel vom Typenschild? | Liste | Hilfe beim Upload mit Fotohinweis (AUFTRAG.md Abschnitt 11) | kein | nein |
| I-MOTO-11 | Welche Angaben braucht die Werkstatt, damit eine Motorradanfrage ohne Rückfrage beantwortet werden kann? | Liste | Anfrageformular (G-19) | kein | nein |
| I-MOTO-12 | Wie erklären Sie Kunden, dass ein Motorrad mit Wegfahrsperre ohne Chip nicht startet? | kurzer Text | Erklärung der Pflichtfrage Transponder (G-19) | kein | nein |
| I-MOTO-13 | Welche Motorräder kommen am häufigsten in die Werkstatt, Roller eingeschlossen? | Liste | Motorradseite und Reihenfolge (G-19) | kein | nein |
| I-MOTO-14 | Welche Teile am Motorradschlüssel sind am häufigsten defekt, zum Beispiel Gehäuse oder Batterie? | kurzer Text | Hinweis zum Gehäuseweg (G-20) | kein | nein |

## 4 Gehäuse für Autoschlüssel (I-GEH)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-GEH-01 | Gilt weiterhin der Festpreis von 59 Euro für Gehäuse, Tasten und Batterie in Gruppe A, oder soll das Gehäuse nur als Angebot erscheinen? | Auswahl: Festpreis oder Angebot | Angebot mit Zahlungslink (G-20) | Bestand: Gruppe A 59 Euro, Gruppe B 79 Euro, Gruppe C 99 bis 169 Euro (content/service-pricing.json, gehaeuse-reparatur) | nein |
| I-GEH-02 | Wie viele Werktage braucht die Werkstatt von der Anfrage bis zum Angebot mit Zahlungslink? | Zahl in Werktagen | Ablauf Schritt 2 (G-20) | kein | nein |
| I-GEH-03 | Wie viele Werktage braucht die Werkstatt vom Eingang des Schlüssels bis zum Rückversand? | Zahl in Werktagen | Ablauf Schritt 3 und 4 (G-20, G-25) | kein | nein |
| I-GEH-04 | Für welche Autoschlüsselgehäuse baut die Werkstatt neue Gehäuse, und welche Baujahre decken Sie ab? | Liste | Angebotsweg und Baujahre (G-20) | Gespräch: Baujahre mindestens 1998 bis 2022 (AUFTRAG.md G-20) | nein |
| I-GEH-05 | Welche Gehäuse hat der Betrieb auf Lager, nach Marke und Schlüsselart? | Liste | Lieferzeit des Gehäuses (G-20) | kein | nein |
| I-GEH-06 | Welchen Nachweis verlangt die Werkstatt für ein neues Gehäuse: Fahrzeugschein, Ausweis oder beides? | Liste | Berechtigungsnachweis im Gehäuseweg (R13) | Bestand: Fahrzeugschein (src/lib/data/defaults/rubriken.ts, autoschluessel-gehaeuse) | nein |
| I-GEH-07 | Muss der Schlüssel nach dem Gehäusewechsel neu angelernt werden, und wenn ja, nur mit dem Fahrzeug vor Ort? | Ja/Nein und kurzer Text | Hinweis im Ablauf (R9) | kein | nein |
| I-GEH-08 | Welche Fehler machen Kunden beim Gehäuse am häufigsten, zum Beispiel ein Gehäuse für das falsche Modell? | kurzer Text | Hinweise bei Fotos und Angebot (G-20) | kein | nein |
| I-GEH-09 | Gibt es Schlüssel, bei denen kein neues Gehäuse passt, und woran erkennt der Kunde das vorab? | kurzer Text | Ehrlichkeit vor dem Angebot (R9) | kein | nein |
| I-GEH-10 | Welche Preisspanne soll die Seite vor der Anfrage für ein Gehäuse nennen, von bis Euro? | Zahl von bis in Euro | Ehrlicher Preis vor der Anfrage (R9) | Bestand: Festpreise und Rahmen je Gruppe (content/service-pricing.json, gehaeuse-reparatur) | nein |
| I-GEH-11 | Welche Einkaufspreise hat der Betrieb für Gehäuse je Marke? | Liste mit Euro | Kalkulation des Angebots (Grenze G13, G-20) | kein | VERTRAULICH |
| I-GEH-12 | Welche Schäden an Gehäusen sind nicht reparierbar, und wann ist ein Neukauf nötig? | kurzer Text | Ehrliche Beratung (R9) | kein | nein |
| I-GEH-13 | Gibt es Gehäuse, die nur über den Hersteller erhältlich sind, und welche? | Ja/Nein und Liste | Lieferzeit und Verfügbarkeit (G-20) | kein | nein |
| I-GEH-14 | Welche Garantie gibt die Werkstatt auf ein eingesetztes Gehäuse, in Monaten? | Zahl in Monaten | Vertrauensblock Gehäuse (R10) | kein | nein |
| I-GEH-15 | Welche Fotos sind für die Gehäuseanfrage Pflicht, und welche Hinweise zum Foto geben Sie? | Liste | Fotohilfe und Upload (AUFTRAG.md Abschnitt 11) | kein | nein |

## 5 Schlüssel nach Code (I-CODE)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-CODE-01 | Welche der 52 Codelinien führt der Betrieb tatsächlich, und welchen Hersteller hat jede? | Liste | Sortimentsabgleich, Hersteller bisher leer (G-22, R4) | Bestand: 52 Codelinien, Hersteller leer (content/code-lines.json) | nein |
| I-CODE-02 | Welche Codelinien brauchen trotzdem den Originalschlüssel? | Liste | Hinweise im Ablauf, Schritt 1 (R4, R9) | Bestand: alle 52 Linien ohne Einsendung des Originals (content/code-lines.json, description) | nein |
| I-CODE-03 | Wie viele Werktage dauert die Fertigung eines Schlüssels nach Code, bis er versandfertig ist? | Zahl in Werktagen | Ablauf Schritt 3 (G-38) | kein | nein |
| I-CODE-04 | Welchen Nachweis verlangt die Werkstatt bei Codeschlüsseln, und wie prüft sie ihn? | kurzer Text | Berechtigungsnachweis und Missbrauchsschutz (R13) | Bestand: Sicherungskarte (src/lib/data/defaults/rubriken.ts, schluessel-nach-code) | nein |
| I-CODE-05 | Welche Fehler passieren bei der Codeeingabe am häufigsten, und wie vermeiden Kunden sie? | kurzer Text | Hinweise am Eingabefeld (G-10) | kein | nein |
| I-CODE-06 | Wie viele Tage braucht ein Rohling, wenn er nicht auf Lager liegt? | Zahl in Tagen | Lieferzeit der Fertigung (R9) | kein | nein |
| I-CODE-07 | Gibt es Codes, bei denen der Betrieb den Schlüssel nicht fertigt, zum Beispiel wegen fehlender Rohlinge? | Liste | Ehrliche Grenzen (R4, R9) | kein | nein |
| I-CODE-08 | Welchen Einkaufspreis hat der Betrieb je Codelinie, und wie hoch ist der Aufschlag? | Liste mit Euro | Kalkulation und Preise (Grenze G13, R9) | kein | VERTRAULICH |
| I-CODE-09 | Welche Fotos der Codelinien hat der Betrieb selbst aufgenommen, und welche fehlen? | Liste | Produktbilder ohne Fremdbilder (G-46, R11) | Bestand: Platzhalterfotos je Serie (content/code-lines.json, productImage) | nein |
| I-CODE-10 | Welche Codelinie verlangt bisher ein Pflichtfoto, und warum? | Auswahl | Fotopflicht prüfen (G-23) | Bestand: eine Codelinie mit Pflichtfoto (content/code-lines.json, photoUpload) | nein |
| I-CODE-11 | Versendet der Betrieb Codeschlüssel ins Ausland, und wenn ja, in welche Länder? | Liste | Versandkreis und Einsatzgebiet (G-24) | kein | nein |
| I-CODE-12 | Welche Codeschlüssel lassen sich nur vor Ort in der Werkstatt bestellen, nicht über das Internet? | Liste | Kasse und Abholung (G-38) | kein | nein |
| I-CODE-13 | Gibt es Codelinien, die nur über den Hersteller nachbestellt werden, und welche? | Ja/Nein und Liste | Lieferzeit und Verfügbarkeit (R9) | kein | nein |

## 6 Schlüssel nach Foto (I-FOTO)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-FOTO-01 | Wie viele Werktage dauert die Fotoprüfung, bis der Kunde Ja oder Nein erhält? | Zahl in Werktagen | Ablauf Schritt 2 (G-23) | kein | nein |
| I-FOTO-02 | Wie viele Werktage dauert die Fertigung nach der Zahlung bis zum Versand? | Zahl in Werktagen | Ablauf Schritt 4 (G-23) | kein | nein |
| I-FOTO-03 | Muss der Kunde vor der Fertigung zahlen, oder reicht die Zusage nach der Prüfung? | Auswahl | Ablauf Schritt 3 und 4 (G-38) | kein | nein |
| I-FOTO-04 | Wie viel Prozent der eingesandten Fotos lassen sich ohne Einsendung des Schlüssels fertigen? Eine grobe Schätzung genügt. | Zahl in Prozent | Hinweis, dass nicht jedes Foto ablesbar ist (G-23, R9) | kein | nein |
| I-FOTO-05 | Welche drei Motive sollen zeigen, wie das Schlüsselfoto aussehen soll? | Liste | Drei Beispielbilder (G-23, G-45, MENSCHEN.md MA-05) | kein | nein |
| I-FOTO-06 | Welche Schlüsselarten lassen sich nicht nach Foto fertigen, zum Beispiel Wendeschlüssel mit Chip? | Liste | Ehrlichkeit vor dem Upload (G-23, R9) | kein | nein |
| I-FOTO-07 | Welche Maße braucht die Werkstatt zusätzlich zum Foto, zum Beispiel Länge oder Bartbreite, und wie misst der Kunde sie? | kurzer Text | Fotoanleitung und Messhilfe (G-23) | kein | nein |
| I-FOTO-08 | Soll auf dem Foto ein Lineal oder eine Münze zur Größenangabe liegen? | Ja/Nein | Fotohilfe im Upload (AUFTRAG.md Abschnitt 11) | kein | nein |
| I-FOTO-09 | Welchen Berechtigungsnachweis verlangt die Werkstatt bei Fotoaufträgen: Sicherungskarte, Ausweis oder Schließplan? | Liste | Berechtigungsnachweis im Fotoweg (R13) | Bestand: Sicherungskarte (src/lib/data/defaults/rubriken.ts, schluessel-nach-foto) | nein |
| I-FOTO-10 | Wie lange gilt ein Preis mit Zahlungslink, bevor er neu geprüft wird? | Zahl in Tagen | Angebotsfrist (R9, R10) | kein | nein |
| I-FOTO-11 | Was kostet den Kunden eine Fotoprüfung, die negativ ausfällt? | kurzer Text oder Zahl in Euro | Ehrlicher Preis, keine Fertigungszusage (R9, G-23) | kein | nein |
| I-FOTO-12 | Welche Fehler machen Kunden bei Fotos am häufigsten, etwa Schatten oder Unschärfe? | kurzer Text | Fotohilfe im Upload (AUFTRAG.md Abschnitt 11) | kein | nein |
| I-FOTO-13 | Welche Schlüsselarten fragen Kunden per Foto am häufigsten an? | Liste | Auswahl der Beispiele und Hilfen (G-23) | kein | nein |
| I-FOTO-14 | Welche zusätzlichen Fotos braucht die Werkstatt bei Schlüsseln mit Chip oder Funkteil? | Liste | Hinweise zum Upload für Sonderfälle (G-23) | kein | nein |

## 7 Schlüssel einschicken (I-EINS)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-EINS-01 | Welcher Versandweg gilt für Einsendungen: DHL Retoure mit Geschäftskundenvertrag oder Begleitschein mit Porto des Kunden? | Auswahl: a oder b | Begleitschein und Rückversand (G-24, MENSCHEN.md MA-08) | Standard bis zur Antwort: Begleitschein mit Porto des Kunden (MENSCHEN.md MA-08). Vorschlag aus der Recherche, bitte prüfen: DHL Retoure (erhebung/E1-versand.md, Abschnitt 5) | nein |
| I-EINS-02 | Gilt weiterhin der Versand für Codeschlüssel mit 4,95 Euro oder 7,95 Euro, wenn das Einschicken kostenlos sein soll? | Ja/Nein oder Auswahl | Kostenlos nur, wenn wirklich nichts berechnet wird (G-24, R9) | Bestand: 4,95 Euro verfolgbar, 7,95 Euro versichert (content/settings.json, shipping) | nein |
| I-EINS-03 | Wie viel Euro zahlt der Kunde für versicherten Versand, und welche Haftungssumme gilt dabei? | Zahl in Euro und Euro | Auswahl versichert oder unversichert (G-24) | Vorschlag aus der Recherche, bitte prüfen: Einschreiben 4,45 Euro mit 25 Euro Haftung, Paket bis 5 kg 7,69 Euro mit 500 Euro (erhebung/E1-versand.md, Abschnitte 4 und 7) | nein |
| I-EINS-04 | Welche Angaben soll der Begleitschein enthalten, außer Name, Anschrift und Schlüsselart? | Liste | Begleitschein im Ablauf Schritt 1 (G-24) | kein | nein |
| I-EINS-05 | Gilt weiterhin, dass Schlüssel erst nach Freigabe einer Fotoanfrage eingeschickt werden, oder darf der Kunde direkt einsenden? | Auswahl | Einsenden ohne Umweg (G-24) | Bestand: nur nach Freigabe der Fotoanfrage (content/seo.json, Route schluessel-einschicken) | nein |
| I-EINS-06 | Erhält der Kunde nach dem Eingang eine Bestätigung, und binnen wie vieler Tage? | Zahl in Tagen | Statusverlauf für den Kunden (G-25) | kein | nein |
| I-EINS-07 | Wie viele Werktage dauert die Prüfung eines eingegangenen Schlüssels, bis die Anfertigung beginnt? | Zahl in Werktagen | Ablauf Schritt 3 (G-25) | kein | nein |
| I-EINS-08 | Wie viele Werktage dauert der Rückversand nach der Anfertigung? | Zahl in Werktagen | Ablauf Schritt 4 (G-25) | kein | nein |
| I-EINS-09 | Was geschieht, wenn ein eingeschickter Schlüssel nicht gefertigt werden kann, und wer trägt die Rücksendung? | kurzer Text | Ablaufzweig Ablehnung (G-25, R9) | kein | nein |
| I-EINS-10 | Welchen Nachweis verlangt die Werkstatt bei eingeschickten Schlüsseln: Sicherungskarte oder Fahrzeugschein? | Liste | Berechtigungsnachweis im Einsendeweg (R13) | Bestand: Sicherungskarte (src/lib/data/defaults/rubriken.ts, schluessel-einschicken) | nein |
| I-EINS-11 | Welche Versandkosten trägt der Betrieb je Sendung tatsächlich, Porto und Versicherung? | Zahl in Euro | Kalkulation des Kundenpreises (G-24, Grenze G13) | kein | VERTRAULICH |
| I-EINS-12 | Soll der Betrieb das Porto für Kunden übernehmen? Der Anwalt prüft, ob eigene Internetmarken dafür zulässig sind. | Ja/Nein | Rechtliche Prüfung vor dem Versandweg (MENSCHEN.md MA-08, R10) | Vorschlag aus der Recherche, bitte prüfen: Portokasse-AGB zu Kundensendungen, Ziffer VI 4 (erhebung/E1-versand.md, Abschnitt 8) | nein |
| I-EINS-13 | Welche Verpackung soll der Kunde für den Schlüssel nutzen, zum Beispiel Luftpolsterumschlag oder Karton? | Auswahl | Schadensvermeidung im Ablauf Schritt 2 (G-24) | kein | nein |
| I-EINS-14 | Welche Schlüssel nimmt der Betrieb nicht per Post an, zum Beispiel Schlüssel mit Chip? | Liste | Ehrliche Grenzen des Einsendewegs (G-24, R9) | kein | nein |
| I-EINS-15 | Wie handelt die Werkstatt, wenn eine Sendung auf dem Weg verloren geht? | kurzer Text | Haftung und Status für den Kunden (R10) | Offen laut erhebung/E1-versand.md, Abschnitt 10, Punkt 1 | nein |

## 8 Sperrschließung (I-SPERR)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-SPERR-01 | Meint der Betrieb mit Sperrschließung dasselbe wie Gleichschließung? | Ja/Nein und kurzer Text | Begriff auf allen Seiten und im Konfigurator (G-09) | Offen laut erhebung/E1-gegenpruefung.md, Abschnitt 3, L4: Verwendung belegt, Gleichsetzung nicht | nein |
| I-SPERR-02 | Gilt weiterhin, dass Sets bis 30 Zylinder direkt bestellbar sind, oder ab wie vielen Zylindern verlangen Sie eine Anfrage? | Zahl | Grenze des Konfigurators (G-28, MENSCHEN.md MA-13) | Bestand: 30 Zylinder (content/cylinder-catalog.json, maxCylinders). Gespräch: 2 bis 10 Zylinder, mehr auf Anfrage (AUFTRAG.md G-28) | nein |
| I-SPERR-03 | Welche kleinste und größte Länge fertigt die Werkstatt bei Doppelzylindern, in Millimetern? | Zahl in Millimeter, klein und groß | Maßbereich im Konfigurator (G-27) | Bestand: 27 bis 80 Millimeter (content/cylinder-catalog.json). Gespräch: bis 120 Millimeter (AUFTRAG.md G-27). Offen laut erhebung/E1-gegenpruefung.md, Abschnitt 3, L6 | nein |
| I-SPERR-04 | Der Bestand nennt Bravus nicht, das Gespräch schon. Führt der Betrieb ABUS Bravus 2000? | Ja/Nein | ABUS-Konfigurator und Systemangabe (G-27) | Bestand: Bravus nicht in content/ (erhebung/E1-gegenpruefung.md, Abschnitt 1, S03) | nein |
| I-SPERR-05 | Welche Maßbereiche, Schrittweiten und Ebenen hat Bravus 2000 im Betrieb? | kurzer Text | ABUS-Konfigurator, Maße und Ebenen (G-27) | Offen laut erhebung/E1-gegenpruefung.md, Abschnitt 3, L2 | nein |
| I-SPERR-06 | Welche Klasse nach EN 1303 hat das ABUS-Profil, das der Betrieb führt? | kurzer Text | Schutzfunktionen im Konfigurator (G-27, FACHWISSEN.md Abschnitt 3) | Offen laut erhebung/E1-schliesstechnik-normen.md, Abschnitt 7, Frage 2 | nein |
| I-SPERR-07 | Wie nennt der Betrieb Schlüsselkappen: Pro Cap, Skuni Cap, Combi Cap oder Farbclip? | Auswahl | Produktnamen nur belegt (G-27, R4, MENSCHEN.md MA-14) | Gespräch: „Pro Cap“ und „Scun Cap“ (AUFTRAG.md G-27). Vorschlag aus der Recherche, bitte prüfen: Skuni Cap (erhebung/E1-schliesstechnik-systeme.md, Abschnitt 9, Punkt 9) | nein |
| I-SPERR-08 | Führt der Betrieb einen Freilauf als eigene Funktion, getrennt von der Not- und Gefahrenfunktion? | Ja/Nein | Getrennte Fragen im Konfigurator (G-27, FACHWISSEN.md Abschnitt 5) | Offen laut erhebung/E1-schliesstechnik-normen.md, Abschnitt 7, Frage 5: Entscheidung des Projekts | nein |
| I-SPERR-09 | Bietet der Betrieb Aufsperrschutz oder Schlagschutz an, und mit welcher Herstellerangabe? | Ja/Nein und Liste | Schutzfunktionen nur mit Herstellerangabe (FACHWISSEN.md Abschnitt 4) | Offen laut erhebung/E1-schliesstechnik-normen.md, Abschnitt 7, Frage 3 | nein |
| I-SPERR-10 | Welche Bauformen außer Doppel-, Knauf- und Halbzylinder führt der Betrieb, zum Beispiel Vorhangschloss oder Hebelzylinder? | Liste | Bauformen im Konfigurator (G-27) | Bestand: Doppel-, Knauf- und Halbzylinder (content/cylinder-catalog.json, forms) | nein |
| I-SPERR-11 | Liegt der Knauf bei Ihren Knaufzylindern innen, und gibt es Ausführungen mit Knauf außen? | Ja/Nein und kurzer Text | Knaufregel im Konfigurator (G-27, L7) | Bestand: Knauf innen (content/cylinder-catalog.json, knaufzylinder). Recherche: Datenblatt nennt Knauf innen und außen (erhebung/E1-gegenpruefung.md, Abschnitt 3, L7) | nein |
| I-SPERR-12 | Gibt es einen Doppelknauf, und wenn ja, für welche Maße? | Ja/Nein und Zahl in Millimeter | Bauformen im Konfigurator (G-27, L7) | Offen laut erhebung/E1-gegenpruefung.md, Abschnitt 3, L7 | nein |
| I-SPERR-13 | Gilt weiterhin, dass Maß A von der Mitte der Stulpschraube bis zum äußeren Ende des Zylinders reicht, oder bis zur Außenkante des Beschlags? | Auswahl | Messhilfe Maß A und Maß B (G-29) | Bestand: bis zum äußeren Ende des Zylinders (content/cylinder-catalog.json, measuringInfo). Recherche: bis zur Außenkante des Beschlags (FACHWISSEN.md Abschnitt 7) | nein |
| I-SPERR-14 | Gilt weiterhin, dass auf volle 5 Millimeter gerundet wird, oder immer auf die nächste Stufe von 5 Millimeter? | Auswahl | Messhilfetext (G-29) | Bestand: „Runden Sie auf volle 5 Millimeter“ (content/guides.json, zylinder-richtig-ausmessen). Recherche: nächsthöhere Stufe (FACHWISSEN.md Abschnitt 7) | nein |
| I-SPERR-15 | Was bedeutet die Option „Erweiterbar reservieren“ praktisch, und wie lange bleibt die Schließung gespeichert? | kurzer Text | Planreserve in Kundensprache (G-27, L3) | Bestand: Option für 15 Euro (content/cylinder-catalog.json, extras) | nein |
| I-SPERR-16 | Welchen Berechtigungsnachweis verlangt die Werkstatt bei Sperrschließungen? Der Bestand sieht keinen vor. | Auswahl | Berechtigungsnachweis im Sperrschließungsweg (R13) | Bestand: keiner (src/lib/data/defaults/rubriken.ts, sperrschliessung) | nein |
| I-SPERR-17 | Wie handelt die Werkstatt bei falschen Kundenmaßen, und wer trägt die Kosten einer Fehlanfertigung? | kurzer Text | Hinweis zur Anfertigung nach Kundenmaß, Entwurf für den Anwalt (G-29, R10) | kein | nein |

## 9 Schließanlage (I-ANL)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-ANL-01 | Wie viele Wochen dauert eine Schließanlage von der Bestellung bis zur Übergabe, wenn der Hersteller fertigt? | Zahl in Wochen | Ablauf Schritt 4 (G-27, G-38) | kein | nein |
| I-ANL-02 | Welche Anlagenarten bietet der Betrieb an: Gleichschließung, Zentralschließanlage, Hauptschlüsselanlage, Generalhauptschlüsselanlage? | Auswahl | Anlagenart im Konfigurator (G-27, G-30) | Vorschlag aus der Recherche, bitte prüfen: vier Anlagenarten (erhebung/E1-schliesstechnik-systeme.md, Abschnitt 2) | nein |
| I-ANL-03 | Wie funktioniert die Kombination aus Hauptschlüssel und Zentralzylindern (KHZ) bei den Systemen, die der Betrieb führt? | kurzer Text | Begriff im Konfigurator (G-27, L5) | Offen laut erhebung/E1-gegenpruefung.md, Abschnitt 3, L5 | nein |
| I-ANL-04 | Welche Norm nennt der Betrieb auf Angeboten für Schließanlagen, DIN EN 1303 oder VdS 2386? | Auswahl, mehrere möglich | Normangabe in Fachtexten (G-32, FACHWISSEN.md Abschnitt 3) | Vorschlag aus der Recherche, bitte prüfen: VdS 2386 für Schließanlagen (erhebung/E1-schliesstechnik-systeme.md, Abschnitt 8, Punkt 5) | nein |
| I-ANL-05 | Welchen Berechtigungsnachweis verlangt die Werkstatt für Nachschlüssel einer Anlage: Sicherungskarte, Vollmacht des Eigentümers oder Schließplan? | Liste | Berechtigungsnachweis im Anlagenweg (R13) | Bestand: keiner (src/lib/data/defaults/rubriken.ts, schliessanlage) | nein |
| I-ANL-06 | Welche Unterlagen braucht die Werkstatt vom Kunden für eine Anlage: Grundriss, Türliste, bestehender Schließplan? | Liste | Projektanfrage (G-35) | kein | nein |
| I-ANL-07 | Wie viele Werktage dauert ein Angebot nach einer Projektanfrage mit Fotos und Türliste? | Zahl in Werktagen | Ablauf Schritt 3 (G-35) | kein | nein |
| I-ANL-08 | Für welche Anlagen fährt die Werkstatt vor Ort, bevor sie ein Angebot macht? | Liste | Einsatz vor Ort und Projektanfrage (G-35, G-41) | Bestand: Einsätze vor Ort nur nach Prüfung (content/cities.json) | nein |
| I-ANL-09 | Gibt es einen Mindestauftragswert für Schließanlagen, und wenn ja, wie hoch ist er in Euro? | Ja/Nein und Zahl in Euro | Projektlogik und Preisangabe (R9, G-27) | kein | nein |
| I-ANL-10 | Welche Planungsfehler machen Kunden am häufigsten, etwa zu wenige Schlüssel oder falsche Türen? | kurzer Text | Hinweise im Schritt Türen planen (G-27) | kein | nein |
| I-ANL-11 | Welche Hersteller für Schließanlagen führt der Betrieb, zum Beispiel ABUS oder BKS? | Liste | Konfigurator und Herstellernennung, nur sachlich (R12) | Vorschlag aus der Recherche, bitte prüfen: ABUS und BKS (erhebung/E1-schliesstechnik-systeme.md, Abschnitte 4 und 5) | nein |
| I-ANL-12 | Gilt bei IKON oder einem anderen Hersteller ein Verbot für GHS, HS und GS aus Sicherheitsgründen? | Ja/Nein | Konfiguratorregel für Hauptschlüsselanlagen (G-32) | Vorschlag aus der Recherche, bitte prüfen: IKON-Ausschreibung 2017, Suchauszug (erhebung/E1-schliesstechnik-systeme.md, Abschnitt 8, Punkt 3) | nein |
| I-ANL-13 | Welche Unterlagen erhält der Kunde am Ende, zum Beispiel Schließplan als PDF, Sicherungskarte oder Schlüsselliste? | Liste | Übergabe der Anlage (G-27) | kein | nein |
| I-ANL-14 | Welche Kundengruppen betreut der Betrieb mit Schließanlagen: Privat, Hausverwaltung, Gewerbe oder Behörden? | Liste | Kundentyp im Konfigurator und Empfehlung (G-30) | kein | nein |
| I-ANL-15 | Ab wie vielen Türen empfiehlt der Betrieb eine Schließanlage statt einer Sperrschließung? | Zahl in Türen | Empfehlung für Firmen und Häuser (G-30) | Offen laut erhebung/E1-schliesstechnik-systeme.md, Abschnitt 9, Punkt 10: keine Quelle nennt eine Türenzahl | nein |
| I-ANL-16 | Wie viele Schlüssel dürfen im Projekt als Planreserve vorgemerkt werden, und ist das im Preis enthalten? | Zahl und Ja/Nein | Planreserve (L3, G-27) | Bestand: 3 Schlüssel inklusive, bis 50 Schlüssel (content/cylinder-catalog.json, includedKeys und maxKeys) | nein |
| I-ANL-17 | Welche Preisspanne kalkuliert der Betrieb je Zylinder und je Schlüssel in einer Anlage? | Zahl von bis in Euro | Preislogik und Kalkulation (Grenze G13, R9) | kein | VERTRAULICH |

## 10 Elektronische Schließsysteme (I-ELEK)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-ELEK-01 | Welche elektronischen Systeme installiert die Werkstatt selbst, und welche vermittelt sie nur? | Liste | Rubriktext und Angebotsweg (G-33) | Gespräch: BKS Xialo und SE, ABUS One, Burg-Wächter (AUFTRAG.md G-33) | nein |
| I-ELEK-02 | Welche Produktnamen dürfen auf der Seite stehen, zum Beispiel Xialo, SE oder One? | Liste | Produktnamen nur mit Bestätigung (G-33, R4, MENSCHEN.md MA-15) | Gespräch: Xialo, SE, One (AUFTRAG.md G-33) | nein |
| I-ELEK-03 | Welche Zutrittsmedien bietet der Betrieb an: Karte, Transponder, PIN, Smartphone oder digitaler Zylinder? | Auswahl, mehrere möglich | Identmedium im Konfigurator (G-33) | Bestand: Karte, Transponder, PIN, Smartphone, digitale Zylinder (content/seo.json, Route elektronische-zutrittsloesungen) | nein |
| I-ELEK-04 | Wie viele Wochen dauert es vom Angebot bis zur Montage eines elektronischen Systems? | Zahl in Wochen | Ablauf Schritt 3 (G-33) | kein | nein |
| I-ELEK-05 | Welche Angaben brauchen Sie zusätzlich zu Türen, Nutzern und Wünschen, damit ein Angebot ohne Rückfrage möglich ist? | Liste | Konfigurator (G-33, G-35) | kein | nein |
| I-ELEK-06 | Betreut der Betrieb die Benutzerverwaltung nach der Montage, und zu welchen Zeiten? | Ja/Nein und kurzer Text | Serviceangebot (G-33) | kein | nein |
| I-ELEK-07 | Legt der Betrieb die Berechtigungen an, oder bedient der Kunde die Verwaltung selbst? | Auswahl | Ablauf Beratung und Angebot (G-33) | kein | nein |
| I-ELEK-08 | Welche Datenschutzfragen klärt der Betrieb, bevor er Personendaten in einem Zutrittssystem speichert? | kurzer Text | Zweckbindung und Löschfristen (R10) | kein | nein |
| I-ELEK-09 | Welche Herstellerschulungen oder Nachweise liegen für elektronische Systeme vor? | Liste | Nur belegte Nachweise (R4) | kein | nein |
| I-ELEK-10 | Welche Einkaufspreise hat der Betrieb je Medium und je Komponente? | Liste mit Euro | Kalkulation (Grenze G13, R9) | kein | VERTRAULICH |
| I-ELEK-11 | In welchen Orten in Hessen montiert der Betrieb elektronische Systeme, und wo nur auf Anfrage? | Liste | Einsatzgebiet (G-42) | kein | nein |
| I-ELEK-12 | Welche Fehler machen Kunden bei der Wahl eines elektronischen Systems am häufigsten, etwa zu wenige Medien? | kurzer Text | Beratungstext (G-33) | kein | nein |
| I-ELEK-13 | Wie oft müssen Batterien oder Komponenten gewechselt werden, und wer übernimmt das? | kurzer Text | Laienhinweis (G-33) | kein | nein |
| I-ELEK-14 | Welchen Nachweis verlangt der Betrieb, wenn ein Kunde Medien für Dritte bestellt, etwa einen Eigentums- oder Verwalternachweis? | Liste | Berechtigungsnachweis im Angebotsweg (R13) | kein | nein |

## 11 Sicherheitstechnik (I-SICH)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-SICH-01 | Welche Sicherheitsleistungen baut der Betrieb selbst ein, und welche vermittelt er an Fachfirmen? | Auswahl je Leistung | Sieben Leistungsseiten (G-34) | Bestand: sieben Leistungen, zum Beispiel Videoüberwachung und Alarmtechnik (content/service-pages.json) | nein |
| I-SICH-02 | Welche Zertifikate oder Schulungen hat der Betrieb für Alarmtechnik, und welche davon kann er belegen? | Liste | Nur belegte Nachweise (R4) | kein | nein |
| I-SICH-03 | Plant der Betrieb Kameras nur für den eigenen Bereich, und wie prüft er die Blickfelder? | kurzer Text | Rechtsrahmen Videoüberwachung (R10) | Bestand: Ratgeber verlangt nur den eigenen Bereich (content/guides.json, einbruchschutz-wo-anfangen) | nein |
| I-SICH-04 | Wie viele Werktage dauert die Installation von Alarm- oder Kameratechnik ab Angebot? | Zahl in Werktagen | Ablauf Schritt 3 (G-34) | kein | nein |
| I-SICH-05 | Welche Hersteller für Alarm- und Kameratechnik nutzt der Betrieb, und für welche Produkte? | Liste | Herstellernennung nur sachlich (R12) | kein | nein |
| I-SICH-06 | Kostet der Sicherheitscheck etwas, und wird er bei einem Auftrag verrechnet? | Ja/Nein und Zahl in Euro | Ehrlicher Preis (R9) | kein | nein |
| I-SICH-07 | Welche Praxisbeispiele dürfen ohne Kundennamen und mit Zustimmung auf der Seite stehen? | kurzer Text | Informationsgewinn ohne erfundene Fälle (AUFTRAG.md Abschnitt 14, R4) | kein | VERTRAULICH |
| I-SICH-08 | Arbeitet der Betrieb beim Einbruchschutz nach VdS-Richtlinien oder nach einer anderen Richtlinie? | Auswahl | Fachaussagen nur belegt (R4, FACHWISSEN.md Abschnitt 3) | Vorschlag aus der Recherche, bitte prüfen: VdS 2156-1 für Einzelsperrschließung (erhebung/E1-gegenpruefung.md, Abschnitt 1, N05) | nein |
| I-SICH-09 | Gehören Fenstersicherungen und die Sicherung der Außenhaut zum Angebot, oder nur die Beratung? | Auswahl | Leistungsseiten (G-34) | kein | nein |
| I-SICH-10 | Welche Gebäude betreut der Betrieb mit Sicherheitstechnik: Einfamilienhaus, Mehrfamilienhaus, Gewerbe oder Objekte? | Liste | Zielgruppen und Konzepte (G-30) | kein | nein |
| I-SICH-11 | Welche Fehler machen Kunden beim Einbruchschutz am häufigsten, etwa Schutz nur an der Haustür? | kurzer Text | Reihenfolge im Ratgeber (G-34) | kein | nein |
| I-SICH-12 | In welchem Umkreis führt der Betrieb Termine vor Ort für Sicherheitstechnik durch? | Zahl in Kilometern | Termin vor Ort im Sicherheitscheck (G-34, G-41) | Bestand: Einsätze vor Ort nur nach Prüfung (content/cities.json) | nein |
| I-SICH-13 | Kennt der Betrieb Förderungen für Einbruchschutz, und dürfen sie auf der Seite stehen? | Ja/Nein und kurzer Text | Nur belegte Angaben (R4, R10) | Offen laut erhebung/E1-nachfrage.md, Abschnitt Offene Fragen, Punkt 6 | nein |
| I-SICH-14 | Welche Vorgaben für Panik- und Alarmtaster hält der Betrieb ein, und für welche Zwecke sind sie zulässig? | kurzer Text | Rechtsrahmen Panik- und Alarmtaster (R10) | Bestand: nur für zulässige Zwecke (content/service-pages.json, sicherheit-panik-und-alarmtaster) | nein |
| I-SICH-15 | Wie lange dauert ein Termin vor Ort für den Sicherheitscheck, und was erhält der Kunde danach schriftlich? | kurzer Text | Ablauf Schritte 2 und 3 (G-34, G-37) | kein | nein |

## 12 Schlüsseldienst vor Ort (I-VOR)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-VOR-01 | Welchen Mindestpreis und welchen Stundensatz nennt der Betrieb für einen Einsatz vor Ort? | Zahl in Euro | Preisrahmen im Termin (R9, G-40) | kein | nein |
| I-VOR-02 | Wie viele Minuten dauert es in der Regel, bis ein Einsatz nach dem Anruf beginnt? | Zahl in Minuten | Reaktionszeit nur, wie sie stimmt (R9) | kein | nein |
| I-VOR-03 | Gibt es einen Notdienst außerhalb der Öffnungszeiten, und wenn ja, zu welchen Zeiten und zu welchem Preis? | kurzer Text | Name mit 24, kein Notdienstversprechen (R9) | kein | nein |
| I-VOR-04 | Wie erreichen Kunden den Betrieb außerhalb der Öffnungszeiten: per Nachricht, Rückruf oder Telefon? | Auswahl | Kontaktweg und Rückruf (G-38) | kein | nein |
| I-VOR-05 | Welche Leistungen erledigt der Außendienst vor Ort, und welche nur in der Werkstatt? | Liste | Ablauf des Einsatzes (G-26) | Bestand: Programmierung, Zweitschlüssel und Fahrzeugöffnung nur am Fahrzeug, Bart fräsen ohne Fahrzeug (content/car-key-services.json) | nein |
| I-VOR-06 | Welche Fahrzeuge öffnet der Betrieb vor Ort, und bei welchen nicht? | Liste | Fahrzeugöffnung und Ausschluss (R9, R13) | Bestand: Fahrzeugöffnung nur mit Nachweis der Verfügungsberechtigung (content/seo.json, Route autoschluessel/fahrzeugoeffnung) | nein |
| I-VOR-07 | Welchen Nachweis der Verfügungsberechtigung verlangt die Werkstatt vor einer Tür- oder Fahrzeugöffnung? | Liste | Berechtigungsnachweis vor Ort (R13) | Bestand: Nachweis der Verfügungsberechtigung (content/seo.json, Route autoschluessel/fahrzeugoeffnung) | nein |
| I-VOR-08 | Welche Anfahrts- und Vermittlungskosten zahlt der Betrieb an Partner vor Ort? | Zahl in Euro | Abrechnung mit Partnern (G-40, Grenze G13) | kein | VERTRAULICH |
| I-VOR-09 | Wie viele Minuten Anfahrt plant der Betrieb im Termin mit Preisrahmen ein? | Zahl in Minuten | Terminangabe und Preisrahmen (R9) | kein | nein |
| I-VOR-10 | Welche Notfälle kommen am häufigsten vor, etwa abgebrochener Schlüssel, klemmendes Schloss oder zugefallene Tür? | kurzer Text | Leistungstexte und Ablauf (G-10) | kein | nein |
| I-VOR-11 | Wie rechnet der Betrieb einen Einsatz vor Ort ab: Festpreis, Stundensatz oder nach Aufwand? | Auswahl | Ehrliche Preisangabe (R9) | kein | nein |
| I-VOR-12 | Welche Angaben braucht der Betrieb am Telefon, bevor er einen Einsatz zusagt? | Liste | Ablauf Schritt 1 und 2 (G-10) | kein | nein |
| I-VOR-13 | Wie viele Werktage liegen zwischen Anfrage und Termin vor Ort, wenn kein Notfall vorliegt? | Zahl in Werktagen | Terminangabe (R9) | kein | nein |
| I-VOR-14 | Welche Orte bedient der Betrieb vor Ort nicht, und an wen verweist er die Kunden dort? | Liste | Ehrliche Grenzen und Vermittlung (R2, G-41) | kein | nein |
| I-VOR-15 | Welche Unterlagen erhält der Kunde nach einem Einsatz vor Ort, zum Beispiel Rechnung oder Protokoll? | Liste | Vorgangsblatt (AUFTRAG.md Abschnitt 11) | kein | nein |

## 13 Beratung (I-BERA)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-BERA-01 | Kostet eine Beratung etwas, und wird sie bei einem Auftrag verrechnet? | Ja/Nein und Zahl in Euro | Ehrlicher Preis (R9) | kein | nein |
| I-BERA-02 | Wie viele Werktage dauert es in der Regel bis zum Rückruf, nachdem das Anliegen eingegangen ist? | Zahl in Werktagen | Rückrufzusage (G-10) | kein | nein |
| I-BERA-03 | Welche Themen gehören zur Beratung, und welche verweist die Werkstatt an Fachbetriebe? | Liste | Abgrenzung der Rubrik (G-10) | Bestand: Beratung für alles, was in keine Rubrik passt (src/lib/data/defaults/rubriken.ts, beratung) | nein |
| I-BERA-04 | Gibt die Werkstatt telefonisch oder per Mail eine erste Einschätzung ohne Termin? | Ja/Nein | Beratung als Einstieg (G-38) | kein | nein |
| I-BERA-05 | Welchen Nachweis verlangt die Werkstatt, wenn die Beratung zu einem Schlüssel führt? | Liste | Berechtigungsnachweis, sobald ein Schlüssel entsteht (R13) | kein | nein |
| I-BERA-06 | Welche Fragen stellen Kunden in der Beratung am häufigsten? | kurzer Text | Häufige Fragen und Hub (G-01) | kein | nein |
| I-BERA-07 | Welche Anliegen lehnt die Werkstatt ab, zum Beispiel das Öffnen fremder Türen ohne Nachweis? | kurzer Text | Grenzen der Beratung (R9, R13) | kein | nein |
| I-BERA-08 | Welche Unterlagen oder Fotos sollen Kunden vor dem Rückruf bereithalten? | Liste | Ablauf Schritt 1 (G-10) | kein | nein |
| I-BERA-09 | Wie wird aus einer Beratung ein Auftrag mit Preis, und wer entscheidet das? | kurzer Text | Übergang zum Auftrag (G-38) | kein | nein |
| I-BERA-10 | Berät die Werkstatt auch vor Ort, und zu welchen Kosten? | Ja/Nein und Zahl in Euro | Beratung vor Ort (R9, G-34) | kein | nein |
| I-BERA-11 | Welche Hilfen bietet der Betrieb Kunden mit wenig Technikerfahrung, etwa Telefon statt Formular? | kurzer Text | Laientauglichkeit (AUFTRAG.md Abschnitt 11) | kein | nein |
| I-BERA-12 | Welche Fachbegriffe erklären Kunden am häufigsten nicht, und welche soll die Seite erklären? | Liste | Glossar und Laiensprache (AUFTRAG.md Abschnitt 14) | kein | nein |
| I-BERA-13 | Was soll der Kunde im Rückrufformular angeben, damit der Rückruf gelingt? | Liste | Formular (AUFTRAG.md Abschnitt 11) | kein | nein |

## 14 Transponder kopieren (I-TRANS)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-TRANS-01 | Welche Fahrzeugmarken und Modelle kann die Werkstatt klonen, und ab welchem Baujahr? | Liste | Bogen KLONBAR, nur bestätigte Fahrzeuge (G-18) | Vorschlag aus der Recherche, bitte prüfen: Golf 6, Passat B7 und Audi A4 B8 mit ID48 (erhebung/E1-transponder.md, Abschnitt 5) | nein |
| I-TRANS-02 | Welche Schlüsseltypen klont die Werkstatt, zum Beispiel ID46, ID48 oder ID49? | Liste | Bogen KLONBAR (G-18) | Vorschlag aus der Recherche, bitte prüfen: ID46 und ID48 laut Hersteller klonbar (erhebung/E1-transponder.md, Abschnitt 6) | nein |
| I-TRANS-03 | Haben Sie ID88, ID49, ID4A, ID47 oder DST80 schon erfolgreich geklont? Bitte nur Bestätigtes nennen. | Liste mit Ja oder Nein | Offene Chips, nur belegte Klonbarkeit (G-18, R4) | Offen laut erhebung/E1-transponder.md, Abschnitt 8, Punkte 1 bis 6 | nein |
| I-TRANS-04 | Welche Geräte nutzt die Werkstatt zum Klonen, zum Beispiel AVDI, Abrites PROTAG oder Silca GTI Ultra? | Liste | Klongerät im Ablauf (G-18) | Vorschlag aus der Recherche, bitte prüfen: AVDI, Abrites PROTAG, Silca GTI Ultra (erhebung/E1-transponder.md, Abschnitt 2) | nein |
| I-TRANS-05 | Welche Lizenzen, Abos oder Jahresgebühren hat der Betrieb für das Klongerät, und was kosten sie? | Liste mit Euro | Kalkulation (Grenze G13) | kein | VERTRAULICH |
| I-TRANS-06 | Welchen Preis verlangt die Werkstatt für eine Transponderkopie je Schlüssel? | Zahl in Euro | Kasse und Preisangabe (G-18, R9) | Standard bis zur Antwort: kein Preis, nur Anfrage (MENSCHEN.md MA-04) | nein |
| I-TRANS-07 | Stimmt die Unterscheidung: Klonen geht ohne Fahrzeug, Anlernen braucht das Fahrzeug? | Ja/Nein | Ablauf der Transponderkopie (G-18) | Vorschlag aus der Recherche, bitte prüfen: Anlernen am Fahrzeug, Klonen auf einen Rohling (erhebung/E1-transponder.md, Abschnitt 3) | nein |
| I-TRANS-08 | Welche Nachweise verlangt die Werkstatt für eine Transponderkopie: Zulassungsbescheinigung Teil I, Ausweis oder Vollmacht? | Liste | Berechtigungsnachweis im Transponderweg (R13) | Vorschlag aus der Recherche, bitte prüfen: Teil I, Personalausweis, bei Firmenfahrzeugen Vollmacht (erhebung/E1-transponder.md, Abschnitt 4) | nein |
| I-TRANS-09 | Bei welchen AES-Fahrzeugen ist die Freigabe nur über das Herstellerbackend möglich, und welche davon sind bei Ihnen betroffen? | Liste | Ablehnungsregel (G-18, R9) | Vorschlag aus der Recherche, bitte prüfen: Freigabe über den Hersteller, Umfang offen (erhebung/E1-gegenpruefung.md, Abschnitt 1, T07) | nein |
| I-TRANS-10 | Wie prüft die Werkstatt, ob ein Chip beschreibbar ist, bevor sie schreibt, damit das Original nicht gesperrt wird? | kurzer Text | Schutz des Originals (R9, R10) | Vorschlag aus der Recherche, bitte prüfen: falsches Schreiben kann Chips dauerhaft sperren (erhebung/E1-transponder.md, Abschnitt 2) | nein |
| I-TRANS-11 | Wie viele Werktage dauert die Transponderkopie vom Eingang bis zum Rückversand? | Zahl in Werktagen | Ablauf Schritt 3 (G-18) | kein | nein |
| I-TRANS-12 | Was gilt, wenn die Kopie nicht funktioniert, und wer trägt die Kosten für das Original? | kurzer Text | Rückerstattung und Haftung (R9, R10) | kein | nein |
| I-TRANS-13 | Welche Fehler machen Kunden beim Klonen am häufigsten, etwa eine falsche Generation oder fehlende Papiere? | kurzer Text | Hinweise im Ablauf (G-18) | kein | nein |
| I-TRANS-14 | Wie viele Transponderkopien pro Fahrzeug nimmt die Werkstatt an? | Zahl in Stück | Bestellmenge in der Kasse (G-18) | kein | nein |
| I-TRANS-15 | Welche Rechtslage gilt für Besitz und Einsatz von Klongeräten im Betrieb, und welche Nachweispflichten bestehen? | kurzer Text | Anwalt prüft, keine Rechtsauskunft (R10) | Offen laut erhebung/E1-transponder.md, Abschnitt 8, Punkt 11 | nein |

## 15 Angebot für Ihr Fahrzeug, Autoschlüssel-Finder (I-FIND)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-FIND-01 | Welche Angebote soll der Finder je Modell zeigen, etwa nachmachen, programmieren, Gehäuse oder Anfrage? | Liste | Ergebnis des Finders (G-17) | kein | nein |
| I-FIND-02 | Welche Modelle zeigen einen Preis, und bei welchen geht es nur über Anfrage? | Liste | Preis oder Anfrage (G-17, R9) | kein | nein |
| I-FIND-03 | Bei welchen Modellen reicht ein Schlüssel ohne Anlernen am Fahrzeug aus? | Liste | Hinweis zum Anlernen (G-17) | Bestand: alle 49 Modelle mit Anlernen am Fahrzeug (content/vehicles.json, requiresVehicleOnSite) | nein |
| I-FIND-04 | Welche Modelle aus dem Bestand decken Baujahre vor 1998 ab, und welche nicht? | Liste | Baujahrbereich 1998 bis 2026 (G-14) | Bestand: Einstiegsjahre vor 1998, zum Beispiel Audi A4 ab 1994 (content/vehicles.json) | nein |
| I-FIND-05 | Welche Marken sollen im Finder zuerst online stehen, weil die Werkstatt sie belegt bearbeitet? | Liste | Nur belegte Angaben (G-17) | kein | nein |
| I-FIND-06 | Welche Modelle haben eigene Substanz, zum Beispiel Fotos oder Besonderheiten, damit eine Modellseite indexiert werden darf? | Liste | Indexsteuerung und Vermeidung dünner Seiten (G-17, R2) | Gespräch: Modellseiten nur mit eigener Substanz (AUFTRAG.md G-17) | nein |
| I-FIND-07 | Welche Besonderheiten je Marke soll der Finder nennen, etwa Schlüsselart oder Sonderfälle? | kurzer Text | Modelltexte (G-17) | kein | nein |
| I-FIND-08 | Welche Angaben brauchen Sie außer Fahrzeugschein und Foto, damit eine Anfrage bei unbekanntem Modell vollständig ist? | Liste | Fahrzeug nicht gefunden (G-15) | kein | nein |
| I-FIND-09 | Woran erkennt der Betrieb das Fahrzeug: Fahrgestellnummer, Modell und Baujahr oder das Schlüsselfoto? | Auswahl | Fahrzeugwahl und Prüfung (G-14) | kein | nein |
| I-FIND-10 | Welche Fehler machen Kunden bei der Fahrzeugwahl, etwa eine falsche Variante oder ein falsches Baujahr? | kurzer Text | Hinweise im Finder (G-14) | kein | nein |
| I-FIND-11 | Soll der Finder Transponderkopie und Gehäuse nur für Modelle zeigen, die der Betrieb bestätigt hat? | Ja/Nein | Bogen KLONBAR und Gehäuseweg (G-18, G-20) | kein | nein |
| I-FIND-12 | Dürfen Herstellernamen im Finder stehen, und mit welchem Hinweis? | Ja/Nein und kurzer Text | Herstellermarken nur sachlich (R12) | kein | nein |
| I-FIND-13 | Welche Modelle bearbeitet der Betrieb nicht, und wie soll der Finder darauf hinweisen? | kurzer Text | Ehrliche Grenzen (R9) | kein | nein |
| I-FIND-14 | Welchen Nachweis verlangt die Werkstatt, wenn der Finder zu einer Anfrage führt? | Liste | Berechtigungsnachweis im Angebotsweg (R13) | Bestand: kein Nachweis hinterlegt (src/lib/data/defaults/rubriken.ts, schluesselfinder) | nein |

## 16 Türen und Schließtechnik (I-TUER)

| Kennung | Frage | Antwortform | Wozu | Vorschlag (Quelle) | Vertraulich |
|---|---|---|---|---|---|
| I-TUER-01 | Welche der zehn Leistungen aus dem Bestand führt die Werkstatt selbst aus, und welche nur auf Anfrage? | Auswahl je Leistung | Leistungsseiten und Anfrage-Weg (G-34) | Bestand: zehn Leistungen (content/service-pages.json) | nein |
| I-TUER-02 | Besitzt der Betrieb ein Zertifikat oder einen Schulungsnachweis für Panik- und Fluchttürverschlüsse nach DIN EN 179 und DIN EN 1125? | Ja/Nein | Aussage nur mit Nachweis (R4) | Bestand: Nachweis zum Bereithalten, nicht veröffentlicht (content/startwerte/2026-10-25/nachweise.json) | nein |
| I-TUER-03 | Bearbeitet die Werkstatt Türschließer für Rauchschutztüren, und welche Nachweise braucht sie dafür? | Ja/Nein und Liste | Türschließerleistung (R4, R10) | Bestand: Ausführungen für Rauchschutztüren (content/service-pages.json, tuer-tuerschliesser) | nein |
| I-TUER-04 | Welche Marken für Schlösser, Beschläge und Türschließer führt der Betrieb, und wie viele Werktage dauert die Lieferung? | Liste und Zahl in Werktagen | Lieferzeit für Türleistungen (G-34, G-38) | kein | nein |
| I-TUER-05 | Wie viele Werktage dauert die Montage nach Lieferung der Teile? | Zahl in Werktagen | Ablauf Schritt 3 (G-34) | kein | nein |
| I-TUER-06 | Kostet die technische Beratung vor Ort etwas, wenn es nicht zum Auftrag kommt? | Ja/Nein und Zahl in Euro | Ehrlicher Preis (R9) | kein | nein |
| I-TUER-07 | Welche Schutzbeschläge hat der Betrieb im Angebot, und für welche Türblattmaße? | Liste | Schutzbeschläge (G-29) | kein | nein |
| I-TUER-08 | Bei welchen Türen arbeitet der Betrieb nicht, etwa bei Brandschutz- oder Glastüren? | Liste | Ehrliche Grenzen (R9) | kein | nein |
| I-TUER-09 | Welche Probleme an Haus- und Wohnungstüren kommen am häufigsten vor, etwa klemmende Schlösser oder ausgeschlagene Beschläge? | kurzer Text | Ablauf Reparatur (G-34) | kein | nein |
| I-TUER-10 | Welchen Nachweis verlangt die Werkstatt beim Zylindertausch an Haus- und Wohnungstüren: Sicherungskarte, Eigentum oder Mietvertrag? | Liste | Berechtigungsnachweis im Zylinderweg (R13) | Bestand: kein Nachweis hinterlegt (src/lib/data/defaults/rubriken.ts, tuer-und-schliesstechnik) | nein |
| I-TUER-11 | Welche Einkaufspreise hat der Betrieb für Schlösser, Beschläge und Türschließer? | Liste mit Euro | Kalkulation (Grenze G13) | kein | VERTRAULICH |
| I-TUER-12 | Welche Nachweise braucht der Betrieb, bevor er ein Panikschloss an einer Fluchttür einbaut? | kurzer Text | Rechtsrahmen Fluchttür (R10) | kein | nein |
| I-TUER-13 | Führt der Betrieb Montagen außerhalb von Wetzlar aus, und in welchen Landkreisen? | Liste | Einsatzgebiet (G-42) | kein | nein |
| I-TUER-14 | Welche Schäden an Schlössern sind am häufigsten, und wie repariert die Werkstatt sie? | kurzer Text | Reparaturtext (G-34) | kein | nein |
