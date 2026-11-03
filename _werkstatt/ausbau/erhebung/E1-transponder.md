# E1 Transponder und Klonbarkeit

Abruf: 2026-11-02 · Verfasser: E1-FACHKUNDLER-03 · Vorschläge, bitte prüfen. Nichts ist bestätigt. Klonbarkeit erscheint auf der Seite nur, wenn der Inhaber sie im Bogen KLONBAR bestätigt.

Belegstufen: A Messung eines Anbieters (in den Quellen nicht gefunden) · B wörtlich belegte Aussage einer benannten Quelle · C von uns abgeleitet. Ampel gelb. Werbeaussagen sind keine Fakten. Quellen und Märkte: Abschnitt 7.

Begriffe (Stufe C): Transponder ist der Funkchip im Schlüssel. Wegfahrsperre ist die Diebstahlsperre am Motorstart. Klonen kopiert Chipdaten auf einen Rohling. Anlernen trägt einen Schlüssel im Fahrzeug ein.

## 1. Transpondertypen und Chips (Schritt 1)

- Generationen laut Fachbetrieb: Festcode (etwa 1995 bis 2000), Crypto mit Abfrage (etwa 1998 bis 2012), AES mit Herstellerbackend (ab etwa 2010). [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-generationen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- Chips: TI TMS37145 mit DST80 (80 Bit, aktiv), DST40 laut LSC obsolet. NXP: PCF7935, PCF7936, Hitag 2 (laut Dietrich ID46), Hitag 3, Hitag Pro, Hitag AES (laut Abrites). [Quelle: https://www.ti.com/product/TMS37145; https://lsc.com.au/transponder-generation; https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/; https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Namenskonflikte, offen: Silca RW5 nennt ID49-1E für Renault, Dacia, Kia und Hyundai. Silca T49C nennt NXP Hitag 3 für Honda ohne ID-Nummer. Das Paket führt ID49 als Hitag Pro. Dietrich nennt 4D TI-DST, Abrites Tiris 4D/4E. [Quelle: https://www.silca.biz/de/global/produkte/rw5; https://www.silca.biz/de/global/produkte/t49c; https://kfz-dietrich.com/blog/wegfahrsperre-transponder-generationen-erklaert/; https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]

## 2. Klonbarkeit laut Fachquellen (Schritt 2)

- Silca (Hersteller): GTI Ultra mit "adds full ID48 cloning capability" (Stand 2023-07-28). T49C: "Die weltweit erste Lösung für das Kopieren von NXP Hitag 3 Transpondern für Honda." RW5: Werbung "rund 99 %", nicht übernommen. [Quelle: https://www.silca.biz/en/global/events-and-news/news-about-us/2023-gti-ultra; https://www.silca.biz/de/global/produkte/t49c; https://www.silca.biz/de/global/produkte/rw5 · abgerufen 2026-11-02 · Stufe B]
- Abrites PROTAG (Hersteller, EU): Klonen je Typ mit Beispielfahrzeugen. Hitag 3, Hitag Pro und Hitag AES nur lesen, programmieren, authentifizieren. Die Verfahren brauchen eine AVDI-Schnittstelle mit Jahresabo. [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Autel AT100 (Hersteller, US): "supports cloning of" 14 Kennungen und MQB. ID88 und DST80 fehlen. [Quelle: https://autel.us/product/maxiim-at100/ · abgerufen 2026-11-02 · Stufe B]
- JMA (Fachpresse, Beitrag eines JMA-Vertriebsleiters, Stand 2010): TPX1 bis TPX3 mit TRS5000 klonbar, TP08 ohne klonbare Variante. [Quelle: https://www.locksmithledger.com/home/article/10222379/jma-automotive-key-blank-numbering-system (Stand 2010-12-03) · abgerufen 2026-11-02 · Stufe B]
- Dietrich (Fachbetrieb): Megamos Crypto und Hitag 2 brauchen Spezialwerkzeug (genannt: AVDI, ODIS). Falsches Schreiben kann Chips dauerhaft sperren. [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/; https://kfz-dietrich.com/blog/wegfahrsperre-transponder-generationen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- LSC (Anbieter, AU): Bei einigen Fahrzeugen braucht ID46 vor der Diagnose eine Grundkonfiguration. [Quelle: https://lsc.com.au/transponder-generation · abgerufen 2026-11-02 · Stufe B]

## 3. Verfahren: Klonen und Anlernen (Schritt 3)

- Anlernen geschieht am Fahrzeug über ein Diagnosegerät, alle Schlüssel werden so angelernt (ADAC). Das Fahrzeug muss also vor Ort sein (Stufe C). [Quelle: https://www.adac.de/rund-ums-fahrzeug/ausstattung-technik-zubehoer/zubehoer/autoschluessel-nachmachen/ · abgerufen 2026-11-02 · Stufe B]
- Mit Originalschlüssel dauert das Anlernen laut Dietrich 30 bis 60 Minuten. Ohne Original ist bei manchen Systemen (Mercedes FBS4, BMW FEM/BDC) ein Online-Prozess über den Hersteller nötig, oft mit mehrtägiger Wartezeit. [Quelle: https://kfz-dietrich.com/blog/schluesselservice-zweitschluessel-anlernen-lassen/ · abgerufen 2026-11-02 · Stufe B]
- Dritte Generation (AES): Freigabe nur über das Herstellerbackend mit einem nicht übertragbaren Werkstattzertifikat (Dietrich). Werkzeuge: XENTRY (Mercedes-Benz), ODIS (VW-Gruppe), ISTA (BMW). [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/; https://kfz-dietrich.com/blog/schluesselservice-zweitschluessel-anlernen-lassen/ · abgerufen 2026-11-02 · Stufe B]

## 4. Rechtliches und Nachweise (Schritt 4)

- ADAC: Ersatz mechanischer Schlüssel gegen Personalausweis und Zulassungsbescheinigung. Werkstatt: Fahrzeugpapiere, Personalausweis, Zweitschlüssel. [Quelle: https://www.adac.de/rund-ums-fahrzeug/ausstattung-technik-zubehoer/zubehoer/autoschluessel-nachmachen/ · abgerufen 2026-11-02 · Stufe B]
- Dietrich: Zulassungsbescheinigung Teil I, Personalausweis, bei Firmenfahrzeugen Vollmacht des Halters. "Ohne Herstellerzugang und ohne Berechtigungsnachweis entsteht kein funktionierender Schlüssel." [Quelle: https://kfz-dietrich.com/blog/schluesselservice-zweitschluessel-anlernen-lassen/; https://kfz-dietrich.com/blog/wegfahrsperre-transponder-generationen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- Der Fahrzeugschein heißt amtlich Zulassungsbescheinigung Teil I (eigene Einordnung). Herstellerseiten nennen keine Nachweisregel. Rechtslage: Abschnitt 8. [Quelle: https://kfz-dietrich.com/blog/schluesselservice-zweitschluessel-anlernen-lassen/; https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe C]

## 5. Fahrzeuge laut Quelle (Schritt 5)

- VW Golf 6, Passat B7, Audi A4 B8 · bis etwa 2015 · Megamos Crypto (ID48) [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- VW, Audi, Skoda, Seat · Immo III und IV · Hitag 2 [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- Mercedes-Benz W211, W204, W212 · Hitag 2 (EZS) [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- Peugeot, Citroën, Renault, Honda · ID46 (PCF7936) [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- Golf 7, Skoda Octavia 3, Audi A3 8V · ab 2013 · MQB-Chips, AES-128 [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- Toyota, Ford · Texas DST (4D) [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-generationen-erklaert/ · abgerufen 2026-11-02 · Stufe B]
- Mercedes-Benz Sprinter, Actros · Temic 11 und 12 (Beispiele) [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Mercedes oder Dodge Sprinter, Iveco, Porsche · Hitag 2 (Beispiele) [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Ford, Honda, Acura, Toyota · Tiris 4C (Beispiele) [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Subaru, Ford, Mazda · Tiris 4D und 4E (Beispiele) [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Toyota, Lexus, Scion (H Schlüssel) · DST AES und Hitag AES [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Toyota, Lexus, Scion (G Schlüssel) sowie Hyundai, Kia · Tiris DST+ [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- VW, Hyundai, Kia · Megamos 13 (Beispiele) [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Chevrolet · Megamos 48 (Beispiel) [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Opel, Peugeot, Renault · ID33 (Beispiele) [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B]
- Ford, Lincoln, Mercury · TP02, TP06, TP20, TPX1, TPX2 · Stand 2010 [Quelle: https://www.locksmithledger.com/home/article/10222379/jma-automotive-key-blank-numbering-system · abgerufen 2026-11-02 · Stufe B]
- Buick, Cadillac, Chevrolet, GMC, Hummer, Oldsmobile, Pontiac · TP05, TP08, TP12, TPX3 · Stand 2010 [Quelle: https://www.locksmithledger.com/home/article/10222379/jma-automotive-key-blank-numbering-system · abgerufen 2026-11-02 · Stufe B]
- Chrysler, Dodge, Jeep · TP12, TP21, TPX2, TPX3 · Stand 2010 [Quelle: https://www.locksmithledger.com/home/article/10222379/jma-automotive-key-blank-numbering-system · abgerufen 2026-11-02 · Stufe B]
- Honda · NXP Hitag 3 · ohne Baujahr [Quelle: https://www.silca.biz/de/global/produkte/t49c · abgerufen 2026-11-02 · Stufe B]
- Renault, Dacia, Kia, Hyundai · ID49-1E, Modelle der neuesten Generation 7K und 6K [Quelle: https://www.silca.biz/de/global/produkte/rw5 · abgerufen 2026-11-02 · Stufe B]
- Ford · DST40 · Zitat von 2005 [Quelle: https://en.wikipedia.org/wiki/Digital_signature_transponder · abgerufen 2026-11-02 · Stufe B]
- Toyota, Kia, Hyundai, Tesla · DST80 · Zitat von 2020 [Quelle: https://en.wikipedia.org/wiki/Digital_signature_transponder · abgerufen 2026-11-02 · Stufe B]

## 6. Ergebnistabelle (Schritt 6)

| Typ | Chip | Marken laut Quelle | Klonbar laut Quelle | Gerät laut Quelle | Quelle |
| --- | --- | --- | --- | --- | --- |
| ID4C, ID4D | Tiris 4C und 4D/4E (Abrites), TI laut LSC | Ford, Honda, Acura, Toyota; Subaru, Ford, Mazda | ja, Hersteller; 4D widersprüchlich | Abrites PROTAG, Autel AT100 | [Quelle: https://abrites.com/taxons/protag; https://autel.us/product/maxiim-at100/ · abgerufen 2026-11-02 · Stufe B] |
| ID11, ID12, ID33 | Temic (ID11, ID12), Philips (ID33) laut LSC | Mercedes-Benz Sprinter, Actros; Opel, Peugeot, Renault | ja, Hersteller | Abrites PROTAG, Autel AT100 (ID11, ID12) | [Quelle: https://abrites.com/taxons/protag; https://lsc.com.au/transponder-generation · abgerufen 2026-11-02 · Stufe B] |
| ID13 | Megamos (Dietrich, LSC) | VW, Hyundai, Kia | ja, Hersteller | Abrites PROTAG, Autel AT100 | [Quelle: https://abrites.com/taxons/protag; https://autel.us/product/maxiim-at100/ · abgerufen 2026-11-02 · Stufe B] |
| ID44 | PCF7935 (Dietrich), ID44-Zuordnung nicht belegt | nicht genannt | Festcode ja laut Dietrich; ID44 offen (Stufe C) | nicht genannt | [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ · abgerufen 2026-11-02 · Stufe B] |
| ID46 | PCF7936 (LSC), Hitag 2 (Dietrich) | Peugeot, Citroën, Renault, Honda; Opel, BMW, PSA | ja, Hersteller; mit Einschränkung laut Dietrich | Abrites PROTAG, Autel AT100, Silca RW5, AVDI | [Quelle: https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/; https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B] |
| ID47 | Hitag 3 laut Paket, nicht belegt | nicht genannt | ja laut Autel; Zuordnung offen | Autel AT100 | [Quelle: https://autel.us/product/maxiim-at100/ · abgerufen 2026-11-02 · Stufe B] |
| ID48 | Megamos Crypto (Dietrich, Keyline) | VW Golf 6, Passat B7, Audi A4 B8 bis etwa 2015; Chevrolet | ja, Hersteller; mit Einschränkung laut Dietrich | Silca GTI Ultra, Keyline 884 Decryptor, Abrites PROTAG, Autel AT100, AVDI | [Quelle: https://www.silca.biz/en/global/events-and-news/news-about-us/2023-gti-ultra; https://keyline.it/en/news/keyline-glass-chips-and-electronic-heads-for-transponder-key-cloning_en_324; https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B] |
| ID49 | NXP Hitag 3 (Silca T49C, Honda); ID49-1E (Silca RW5) | Honda; Renault, Dacia, Kia, Hyundai | ja laut Silca und Autel; Dietrich: nicht klassisch kopierbar; widersprüchlich | Silca T49C, Silca RW5, Autel AT100 | [Quelle: https://www.silca.biz/de/global/produkte/t49c; https://www.silca.biz/de/global/produkte/rw5; https://kfz-dietrich.com/blog/wegfahrsperre-transponder-generationen-erklaert/ · abgerufen 2026-11-02 · Stufe B] |
| ID4A | Hitag AES laut Abrites; Zuordnung offen | Toyota, Lexus, Scion (H Schlüssel) | ja laut Abrites und Autel; Dietrich: nicht klassisch kopierbar; widersprüchlich | Abrites PROTAG, Autel AT100 | [Quelle: https://abrites.com/taxons/protag; https://kfz-dietrich.com/blog/wegfahrsperre-transponder-generationen-erklaert/ · abgerufen 2026-11-02 · Stufe B] |
| ID88 | Megamos AES (nur Auflistung) | nicht belegt | offen, kein Hersteller nennt Klonen | nicht belegt | [Quelle: https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B] |
| Hitag Pro | NXP laut Abrites | nicht genannt; Dietrich: europäische Fahrzeuge ab etwa 2012 | nicht angegeben (Abrites: lesen, programmieren, authentifizieren) | Abrites PROTAG | [Quelle: https://abrites.com/taxons/protag; https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ · abgerufen 2026-11-02 · Stufe B] |
| DST40 | TI laut LSC, 40 Bit laut Wikipedia | Ford (Zitat 2005) | keine Angabe; laut LSC obsolet | nicht genannt | [Quelle: https://lsc.com.au/transponder-generation; https://en.wikipedia.org/wiki/Digital_signature_transponder · abgerufen 2026-11-02 · Stufe B] |
| DST80 (ID6F-60) | TI TMS37145, 80 Bit, aktiv | Toyota, Kia, Hyundai, Tesla (Zitat 2020) | mit Vorbehalt: Abrites nennt Tiris DST+ klonbar, Bezug zu DST80 nicht belegt | Abrites PROTAG | [Quelle: https://www.ti.com/product/TMS37145; https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B] |
| DST AES | DSTAES, AES-128 laut TI | Toyota, Lexus, Scion (H Schlüssel) | ja laut Abrites | Abrites PROTAG | [Quelle: https://www.ti.com/product/TMS37145; https://abrites.com/taxons/protag · abgerufen 2026-11-02 · Stufe B] |
| ID5C, ID8A, ID8C, ID64 | nicht belegt | nicht genannt | ja laut Autel | Autel AT100 | [Quelle: https://autel.us/product/maxiim-at100/ · abgerufen 2026-11-02 · Stufe B] |

## 7. Quellen und Märkte

Gelesen (14, alle abgerufen 2026-11-02):

1. ti.com (TMS37145), international, Hersteller, Stand 2020-01-29
2. kfz-dietrich.com (Typen), DE, Fachbetrieb, laut Seite KI-gestützt, Stand 2026-10-30
3. kfz-dietrich.com (Generationen), DE, Fachbetrieb, Stand 2026-10-30
4. kfz-dietrich.com (Anlernen), DE, Fachbetrieb, KI-gestützt laut Seite, Stand 2026-10-29
5. lsc.com.au, AU, Anbieter (Händler), ohne Datum
6. abrites.com (PROTAG), EU, englisch, Hersteller, ohne Datum
7. keyline.it, IT, international, Hersteller, ohne Datum
8. silca.biz (GTI Ultra, englisch), international, Hersteller, Stand 2023-07-28
9. silca.biz (T49C, deutsch), Hersteller, ohne Datum
10. silca.biz (RW5, deutsch), Hersteller, ohne Datum
11. autel.us (AT100), US, Hersteller, ohne Datum
12. locksmithledger.com (JMA), US, Fachpresse, Autor JMA-Vertriebsleiter, Stand 2010-12-03
13. en.wikipedia.org (Digital signature transponder), international, englisch, Enzyklopädie, Stand 2026-09-20
14. adac.de (Autoschlüssel nachmachen), DE, Automobilclub, Datum 2026-04-13 (Art unklar)

Nur Suchausschnitt, nicht als Fakt: Händler uhs-hardware.com, hickleys.com, clksupplies.com, keyfirst.eu, blog.obdii365.com.

Nicht erreicht: xhorse.com (robots.txt zweimal HTTP 503, keine Seite gelesen). Silca RW4 Plus: Extranet ohne Inhalt, DE und IT 404. Silca-ID49-Seiten (ES, PT): 404. NXP-Seiten zu Hitag Pro, Hitag 3 und Hitag AES nicht gefunden.

robots.txt je Domain vor dem ersten Abruf geprüft (ti.com mit Crawl-delay 1 Sekunde). Abrufe einzeln, keine Formulare, keine Downloads.

## 8. Offene Fragen

1. ID88: Kein Hersteller nennt Klonen. Silca RW4 Plus nicht abrufbar.
2. ID49: Hitag 3 (Honda) oder Hitag Pro (Paket)? Die Silca-ID49-Seite ist nicht abrufbar.
3. ID4A und Hitag AES: Abrites nennt Klonen, Dietrich verneint klassisches Kopieren. Widerspruch offen.
4. ID47: Hitag 3 laut Paket, klonbar laut Autel, ohne Herstellerquelle zur Zuordnung.
5. 4D: TI-DST (Dietrich) oder Tiris 4D/4E (Abrites).
6. DST80: Keine Hersteller-Klonangabe. Tiris DST+ (Abrites) ist nicht als DST80 belegt.
7. ID44 gleich PCF7935: nur Händlerangaben aus Suchausschnitten, nicht geprüft.
8. Lücken laut Abschnitt 7 (Xhorse, Silca RW4 Plus, NXP). JMA nur mit Stand 2010.
9. Herstellerseiten ohne Datum: Aktualität unbekannt.
10. Autel führt "MQB" ohne Chipnummer, vermutlich die Fahrzeugplattform. Klären.
11. Rechtslage zu Besitz, Einsatz und Nachweispflichten nicht erhoben, keine Rechtsquelle gefunden.
12. Werbeaussagen (Silca "rund 99 %", Keyline "ideal cloning process") nicht übernommen und nicht geprüft.

## Selbstprüfung

Jede Faktenzeile trägt Quelle, Abrufdatum und Stufe. 14 Quellen gelesen, Stufe A: 0 Zeilen, 12 offene Fragen.
