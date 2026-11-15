# FA-SEO-01B · Bericht: Titel und Beschreibungen der übrigen Seiten, Rückfall der Ratgeber

Stand: 15.11.2026 · Rolle Texter · ohne Datenschema, ohne `--pg`, ohne git · Fortsetzung eines unterbrochenen Laufs (Zwischenstand im Commit 7e9a1b0 geprüft, übernommen, berichtigt und ergänzt)

## GEÄNDERTE DATEIEN

Seit Startcommit 90633dd, nur Dateien dieses Pakets (im Arbeitsbaum liegen daneben Änderungen von FA-KERN-05):

- `src/lib/titelbreite.ts` (neu, aus dem ersten Lauf): Breite eines Titels in 20px Arial ohne Browser, `titelPasst` (60 Zeichen und 580 px samt Markenzusatz)
- `src/lib/fahrzeug-texte.ts`: Titel- und Beschreibungsvorlage der Marken- und Modellseiten
- `src/lib/fahrzeug-texte.test.ts`: Preis-Erwartung auf die neue Vorlage umgestellt, Breite und Mindestlänge ergänzt
- `src/lib/codelinie-texte.ts`: Titel- und Beschreibungsvorlage der Codelinien-, Kategorie- und Herstellerseiten
- `content/guides.json`: Ratgebertitel ohne Gedankenstrich, `seo.title`, `seo.description` aller acht Beiträge, Verweis „Schlüssel nach Code“
- `src/lib/data/defaults/content.ts`: `guides()` wortgleich mit `content/guides.json` (excerpt, body, nextStep, seo samt Verweisen)
- `content/cities.json`: `seo.title` von Wetzlar, Verweis auf die Autoschlüssel-Anfrage „Termin anfragen“ (A-031, Nachbesserung)
- `src/lib/partner/gewinnung.ts`: `titel` von „Netzwerk Deutschland“ und „Kooperation“
- `src/app/(site)/service-und-termin/kontakt/suchtexte.ts` (neu, Nachbesserung): Titel und Beschreibung der Kontaktseite aus den gepflegten Einstellungen
- Feste Metadaten: `src/app/(site)/service-und-termin/kontakt/page.tsx` (seit der Nachbesserung `generateMetadata`), `service-und-termin/vor-ort/page.tsx`, `schliessanlagen/konfigurator/schliessplan/page.tsx`, `rechtliches/versand-und-zahlung/page.tsx` (nur Titel/Beschreibung), `standorte/page.tsx`, `ratgeber/page.tsx`
- Rückfälle in `generateMetadata`: `src/app/(site)/autoschluessel/page.tsx`, `nachmachen`, `programmieren`, `kopieren`, `funkschluessel`, `smart-key`, `schluesselbart-fraesen`, `fahrzeugoeffnung`, `marken`, `anfrage`, `gehaeuse`, `gehaeuse/anfrage`, `src/app/(site)/motorradschluessel/page.tsx`, `motorradschluessel/anfrage/page.tsx` (jeweils nur `title`/`description`; die übrigen Änderungen an den Motorradseiten stammen von FA-KERN-05)
- `src/lib/data/seo-laengen.test.ts`: Teil B ergänzt
- `src/components/fahrzeug-anfrage/seiten.test.tsx`: eine Erwartung (Rückfalltitel der Motorrad-Anfrage) an den neuen Titel angepasst
- dieser Bericht

Nicht angefasst: sichtbare Fließtexte und Überschriften (außer den Ratgebertiteln), Strukturdaten, Sitemap, robots, Navigation, Preise, Rechtstexte, `content/vehicles.json`, `content/fahrzeugkatalog.json`, `content/seo.json`, Formulare, `src/lib/mail`, `src/lib/zahlung`, `src/payload`.

## WAS UND WARUM

**Zählweise** wie in Teil A und `onpage.mjs`: fertiger Titel samt „ | SCHLÜSSELMACHER24“ höchstens 60 Zeichen und 580 px in 20px Arial, Beschreibung 120 bis 160 Zeichen. Die Generatoren können nicht im Browser messen. Darum summiert `src/lib/titelbreite.ts` die Vorschubbreiten von Arial. Das ist eine obere Schranke. Gegen die Messwerte des Onpage-Berichts stimmt sie: „Fahrzeugschlüssel-Netzwerk Deutschland“ ergibt 617,6 px, gemessen 618 px. „Autoschlüssel-Kooperation für Betriebe“ ergibt 591,0 px, gemessen 591 px.

**Marken und Modelle.** Bisher entstanden Titel wie „VW Golf Autoschlüssel (2003–2024): Preise und Termin“ mit bis zu 810 px. Neu wählt die Vorlage den ersten Vorschlag, der passt:
- Marke: „{Marke} Autoschlüssel je Modell“, „Autoschlüssel für {Marke}“, „{Marke} Autoschlüssel“, „{Marke}“
- Modell: „{Marke} {Modell} Autoschlüssel“, „{Marke} {Modell} Schlüssel“, „{Marke} {Modell}“

Ein im Backend gepflegter Titel geht weiter vor. Die Beschreibung nennt nur, was die Seite zeigt: Baujahre, Schlüsselarten, Preis je Leistung oder Preis nach Prüfung, Termin in der Werkstatt, Fahrzeug zum Termin, mitzubringende Schlüssel und Unterlagen. Die Vorlage füllt bis mindestens 120 Zeichen und höchstens 160. Beträge, Vorlaufzeiten und Fristen stehen nicht mehr darin (R3, R4). Die Beträge zeigt die Seite selbst. Lange Modelllisten der Marke werden gekürzt: zuerst „N Modelle, darunter a, b und c“, dann „darunter a“, zuletzt nur die Zahl.

**Codelinien, Kategorien, Hersteller (Vorlagen).** Alle 52 Linien sind derzeit Beispiele und `noindex`. Die Vorlage gilt aber für echte Linien. Bisher hatte jeder Titel einen Gedankenstrich und alle waren zu breit, bis 801 px. Jetzt hat kein Titel einen Gedankenstrich, und alle passen in 580 px. Bei langen Anwendungsnamen tritt die Schlüsselart mit Kennung an die Stelle, etwa „Möbelschlüssel nach Code (MS-01)“. Die Beschreibungen nennen keine Beträge mehr (Regel 3 aus Teil A). Sie nennen Codeformat, Staffel ab Stückzahl und „Ihr Originalschlüssel bleibt bei Ihnen“ (Linien) bzw. „Ohne Einsendung des Originalschlüssels“ (Kategorien, Hersteller). Preis und Staffel stehen weiter auf der Seite.

**Ratgeber.** Seitentitel und Überschrift kommen aus `seo.title` bzw. `title`. Die sichtbaren Titel haben jetzt einen Doppelpunkt statt Gedankenstrich. Die Adressen bleiben. Die acht `seo.title` passen in 580 px, die Beschreibungen sind aus Auszug und Text gefasst. „Autoschlüssel verloren“ nennt die sichtbare Reihenfolge: erst prüfen, dann sichern, dann anfragen. Der Verweis „Codelinien ansehen“ heißt jetzt „Schlüssel nach Code“, in den Daten und im Rückfall. Der Rückfall `guides()` war bisher ein älterer Stand. Er ist jetzt wortgleich mit `content/guides.json`, auch bei Auszug, Abschnitten, nächstem Schritt und Verweisen. Die Übersicht `/ratgeber` hatte einen Gedankenstrich in der Beschreibung, der ist weg.

**Feste Metadaten.** Kontakt nennt die Erreichbarkeit im Wortlaut des Inhabers, ganz, denn die Länge trägt es (140 Zeichen). Seit der Nachbesserung bildet `generateMetadata` den Text aus `erreichbarkeitSatz(erreichbarkeit(settings))`, also aus denselben Einstellungen wie der sichtbare Abschnitt. Vor Ort, Schließplan, Zahlung und Versand sowie Einsatzgebiete haben jetzt Beschreibungen in der Länge. Sie stützen sich auf Sichtbares: Liefergebiet, Versandarten mit Kosten, Zahlungsarten und Anzahlung stehen im Versandtext (Lieferzeiten nur, wenn gepflegt, darum nicht in der Beschreibung), Speichern im Browser und Link im Kopf des Schließplans. `/beratung` und `/service-und-termin/anfrage` lagen bereits in der Länge (136 und 159 Zeichen). Der Onpage-Bericht hat einen älteren Stand gemessen. `/service-und-termin/terminstatus`, Warenkorb, Kasse und Vorgangsseiten sind `noindex`. Ich habe sie nicht geändert.

**Rückfälle unter `autoschluessel` und `motorradschluessel`.** Wo `content/seo.json` einen Eintrag hat, lautet der Rückfall jetzt genau gleich. Für Gehäuse, Gehäuse-Anfrage und die zwei Motorradseiten gibt es keinen Dateneintrag. Deren Rückfälle sind die Seitentexte, die der Onpage-Bericht gemessen hat. Sie sind jetzt kurz, ohne Gedankenstrich und aus dem Sichtbaren gefasst. „In sechs/fünf Schritten“ steht als „Sechs/Fünf Schritte“ in der Unterzeile des Formulars.

**Fahrzeugklassen und „Fahrzeug nicht gefunden“.** Die Kopftexte in `content/seo.json` und im Rückfall `KLASSEN_SEITEN` lagen schon in den Grenzen (breitester Titel 579,8 px, „Fahrradschlüssel nachmachen lassen“). Sie sind gleichlautend, das prüft `seiten.test.tsx`. Ich habe nichts geändert.

**Orte und Partnerseiten.** „Wetzlar: Werkstatt und Leistungen“ (550 px statt 637 px). Partner: „Netzwerk für Fahrzeugschlüssel“ (529 px statt 618 px), „Kooperation für Autoschlüssel-Fälle“ (560 px statt 591 px). Beide stützen sich auf die sichtbare Überschrift.

**Artikel.** Titel und Beschreibung kommen aus den Daten des Artikels oder aus `kurztext` (höchstens 160 Zeichen). Die Übersicht hat einen kurzen Titel und 128 Zeichen. Derzeit gibt es nur Beispielartikel, alle `noindex`. Ich habe nichts geändert, siehe OFFENE FRAGE 2.

**Test.** `src/lib/data/seo-laengen.test.ts` hat jetzt einen Teil B mit denselben Regeln wie Teil A, dazu die Breite über `titelPasst`. Geprüft werden:
- alle 12 Marken und 49 Modelle über den Generator, dazu ein erfundener langer Marken- und Modellname, ohne Ausnahme in den Grenzen;
- 52 Codelinien und 10 Kategorien über die Vorlage (gepflegte Hersteller gibt es im Bestand keine);
- die 8 Ratgeber, der Rückfall `guides()` gegen `content/guides.json`, die Reihenfolge „prüfen, sichern, anfragen“ und der Verweis „Schlüssel nach Code“;
- die Orte und die vier Partnerseiten;
- 8 Seiten mit festem `metadata`, gelesen aus dem Quelltext wie in Teil A; Kontakt über `kontaktBeschreibung` mit dem Stand aus `content/settings.json`, dem Standard, einer abweichenden und einer zu langen Erreichbarkeit;
- 14 Rückfälle unter `autoschluessel` und `motorradschluessel`;
- Eindeutigkeit über beide Teile.

Die Ausnahme bei Kontakt steht im Test: Nur der Satz aus `erreichbarkeitSatz` fällt aus der Prüfung auf Zusagen heraus (`erlaubterWortlaut`), der Rest der Beschreibung wird wie überall geprüft.

## PRÜFUNG UND ERGEBNIS

Über die Datenweiche (`sicher.sh --json`):

| Prüfung | Ergebnis |
|---|---|
| `npx vitest run` | 205 Dateien, 3091 Tests, alle grün. Der erste Lauf hatte 1 roten Test: In `seiten.test.tsx` stand noch der alte Motorrad-Rückfalltitel. Die Erwartung ist angepasst. |
| gezielt `seo-laengen`, `codelinie-texte`, `fahrzeug-texte`, `gewinnung` | 4 Dateien, 421 Tests, grün |
| `npm run typecheck` | ohne Fehler. Ein Zwischenlauf zeigte Fehler in meinem Test (behoben) und in `src/lib/data/admin-alltag.db.test.ts` (FA-KERN-05). Im letzten Lauf war beides weg. |
| `npm run lint` | ohne Befund. Zwischenläufe zeigten einen Fehler in `src/components/fahrzeug-anfrage/seiten.tsx` (FA-KERN-05, `<a>` statt `<Link>`). Im letzten Lauf war er behoben. Meine Warnung (`modelCount` unbenutzt in `autoschluessel/marken/page.tsx`) ist ebenfalls behoben. |

Zahlen vorher und nachher. Gemessen ist an Daten und Vorlagen mit derselben Breitenrechnung, nicht am laufenden Server:

| | vorher | nachher |
|---|---|---|
| Marken- und Modelltitel über 580 px | 61 (Onpage-Bericht) | 0 (breitester 566 px) |
| Marken-/Modellbeschreibungen unter 120 | 7 (Onpage-Bericht) | 0 (126 bis 152 Zeichen) |
| Codelinien- und Kategorietitel über 580 px | 62 von 62 | 0 (breitester 578,7 px) |
| Code-Titel oder -Beschreibungen mit Gedankenstrich | 61 | 0 |
| Code-Beschreibungen mit Betrag | 42 | 0 |
| Ratgeber: Titel über 580 px / Beschreibung außerhalb 120 bis 160 | 6 / 8 | 0 / 0 |
| Seiten mit festen Metadaten oder eigenem Rückfall außerhalb der Grenzen (Kontakt, Vor Ort, Schließplan, Versand, Standorte, Ratgeberübersicht, 2 × Motorrad, 2 × Gehäuse) | 10 | 0 |
| Partner- und Ortstitel über 580 px | 3 | 0 |

Die Onpage-Messung nach dem nächsten Build macht der Orchestrator.

## BELEGE

Titel samt Marke: Z = Zeichen, px = Breite. Beschreibung: Z = Zeichen.

**Vorlagen Marke und Modell** (Beispiel Volkswagen Golf, Werkstatt Wetzlar):

| Quelle | Titel alt | Z/px | Titel neu | Z/px | Beschreibung neu | Z |
|---|---|---|---|---|---|---|
| Marke VW | Volkswagen Autoschlüssel: 6 Modelle, Preise und Termin | –/750 | Volkswagen Autoschlüssel je Modell | 54/566 | Autoschlüssel für Volkswagen: Golf, Passat, Polo, T-Roc, Tiguan und Transporter. Je Modell sehen Sie Baujahre, Schlüsselarten und Preise. | 137 |
| Modell Golf | Volkswagen Golf Autoschlüssel (…): Preise und Termin | –/786 | Volkswagen Golf Autoschlüssel | 49/523 | Autoschlüssel für Volkswagen Golf (ab 2003): Mechanisch, Klappschlüssel, Funk und Keyless. Preis je Leistung, teils nach Prüfung, und Termin in Wetzlar. | 152 |

Die alte Golf-Beschreibung nannte Leistungen mit Betrag („… 249,00 €“) und den Vorlauf.

Die drei breitesten Titel nachher: Marke Volkswagen 566,5 px, Mercedes-Benz C-Klasse („Mercedes-Benz C-Klasse Schlüssel“) 562,0 px, Mercedes-Benz A-Klasse 560,9 px. Die drei längsten Beschreibungen: Golf 152, Toyota Yaris 151, VW Transporter 150. Vorher (Onpage-Bericht): Passat 810 px, Tiguan 809 px, T-Roc 802 px. Mercedes A-Klasse hatte 104 Zeichen Beschreibung, Vito 101.

**Codeseiten (Vorlage), drei Beispiele:**

| Quelle | Titel alt | Z/px | Titel neu | Z/px | Beschreibung alt | Z | Beschreibung neu | Z |
|---|---|---|---|---|---|---|---|---|
| MS-01 | Büroschrank und Rollcontainer – Möbelschlüssel nach Code | 76/779 | Möbelschlüssel nach Code (MS-01) | 52/561 | … bestellen – Codelinie MS-01. Codeformat: 3 bis 4 Ziffern, z. B. 0812. 8,00 € je Stück. | 145 | … bestellen: Codelinie MS-01. Codeformat: 3 bis 4 Ziffern, z. B. 0812. Staffelpreis ab 3 Stück. | 152 |
| MS-03 (nach Nachbesserung) | | | | | | | … Codelinie MS-03. Codeformat: 4 Ziffern, z. B. 4471. Ihr Originalschlüssel bleibt bei Ihnen. | 160 |
| ZY-06 | Zimmertür mit Chubb-Bart – Profilschlüssel nach Code (ZY-06) | 80/801 | Zimmertür mit Chubb-Bart nach Code | 54/578 | … – Codelinie ZY-06 … | 151 | … Codelinie ZY-06. Codeformat: optional 1 Buchstabe, dann 3 bis 4 Ziffern, z. B. C482. | 150 |
| Kategorie Technik | Technik-, Zähler- und Versorgungsschränke nach Code | 71/737 | Technikschlüssel nach Code | 46/499 | … 5 Codelinien, 9,00 € bis 11,00 € je Stück. … | 156 | Technikschlüssel nach Code für Technik-, Zähler- und Versorgungsschränke: 5 Codelinien. Ohne Einsendung des Originalschlüssels. | 127 |

**Ratgeber** (Titel samt Marke, Beschreibung nachher wie in `content/guides.json`):

| Beitrag | Titel alt | Z/px | Titel neu | Z/px | Beschr. alt Z | Beschr. neu Z |
|---|---|---|---|---|---|---|
| autoschluessel-verloren-was-tun | Autoschlüssel verloren — was jetzt zu tun ist | 65/640 | Autoschlüssel verloren: Was tun? | 52/541 | 88 | 146 |
| unterschied-kopie-und-programmierung | Kopie oder Programmierung — wo ist der Unterschied? | 71/735 | Autoschlüssel: Kopie oder Anlernen? | 55/572 | 76 | 147 |
| zylinder-richtig-ausmessen | Zylinder richtig ausmessen | 46/482 | unverändert | 46/482 | 58 | 150 |
| welche-schliessanlage-passt | Welche Schließanlage passt zu meinem Objekt? | 64/674 | Welche Schließanlage passt zu mir? | 54/568 | 64 | 143 |
| schluesselcode-finden | Wo finde ich den Schlüsselcode? | 51/539 | unverändert | 51/539 | 62 | 156 |
| einbruchschutz-wo-anfangen | Einbruchschutz — wo fängt man sinnvoll an? | 62/643 | Einbruchschutz: Wo fange ich an? | 52/548 | 53 | 150 |
| schluessel-verloren-wohnung | Wohnungsschlüssel verloren — Schloss tauschen oder nicht? | 77/792 | Wohnungsschlüssel verloren | 46/500 | 74 | 151 |
| mechanisch-oder-elektronisch | Mechanisch oder elektronisch — was ist sinnvoller? | 70/702 | Zutritt mechanisch oder elektronisch? | 57/576 | 69 | 159 |

Beschreibung „Autoschlüssel verloren“ alt: „Die richtige Reihenfolge spart Zeit und Geld: erst sichern, dann prüfen, dann bestellen.“ (88). Neu: „Suchen Sie zuerst gründlich. Hilft das nicht, gehen Sie in dieser Reihenfolge vor: erst prüfen, dann sichern, dann einen Ersatzschlüssel anfragen.“ (146).

**Feste Metadaten, Rückfälle, Orte, Partner:**

| Quelle | Titel alt | Z/px | Titel neu | Z/px | Beschr. alt Z | Beschreibung neu | Z |
|---|---|---|---|---|---|---|---|
| /service-und-termin/kontakt | Kontakt | 27/312 | Kontakt und Erreichbarkeit | 46/480 | 59 | „Anschrift, Telefon und E-Mail.“ + `erreichbarkeitSatz(erreichbarkeit(settings))`, beim heutigen Stand: Anschrift, Telefon und E-Mail. 24 Stunden erreichbar. Notdienst rund um die Uhr. Werkstatt und persönliche Beratung nach Terminvereinbarung. | 140 |
| /service-und-termin/vor-ort | unverändert | 47/494 | Service vor Ort nach Termin | 47/494 | 110 | Welche Arbeiten wir bei Ihnen im Objekt oder am Fahrzeug erledigen und was Sie dafür vorbereiten. Den Einsatz fragen Sie direkt auf dieser Seite an. | 148 |
| /schliessanlagen/konfigurator/schliessplan | unverändert | 46/483 | Schließplan selbst anlegen | 46/483 | 226 | Türen und Schlüssel anlegen, dann ankreuzen, wer welche Tür schließt. Ihr Plan bleibt in diesem Browser gespeichert und lässt sich als Link weitergeben. | 152 |
| /rechtliches/versand-und-zahlung | unverändert | 39/435 | Zahlung und Versand | 39/435 | 75 | Liefergebiet, Versandarten mit Kosten, Zahlungsarten und die Anzahlung bei Terminaufträgen: So laufen Zahlung und Versand bei SCHLÜSSELMACHER24. | 144 |
| /standorte | unverändert | 34/375 | Einsatzgebiete | 34/375 | 95 | Schlüssel nach Code und gleichschließende Zylinder versenden wir innerhalb Deutschlands. Hier finden Sie unsere Werkstatt und unsere Einsatzgebiete. | 148 |
| /ratgeber | unverändert | 28/326 | Ratgeber | 28/326 | 148 (mit „—“) | … und Einbruchschutz, jeweils mit einem klaren nächsten Schritt. | 147 |
| /motorradschluessel (Rückfall) | Motorradschlüssel nachmachen lassen: Anfrage mit Fotos | 74/759 | Motorradschlüssel nachmachen | 48/527 | 140 | Motorradschlüssel anfragen mit Fahrzeugschein, drei Fotos des Schlüssels und der Angabe zum Chip. Wir prüfen Ihre Angaben und melden uns mit Preis und Termin. | 158 |
| /motorradschluessel/anfrage (Rückfall) | Motorradschlüssel: Anfrage mit Fahrzeugschein und drei Fotos | 80/801 | Motorradschlüssel anfragen | 46/491 | 141 | Motorradschlüssel in sechs Schritten: Motorrad, Schlüssel und Chip, Unterlagen und drei Fotos, Beschreibung, Kontakt und Absenden. Die Anfrage ist kein Vertrag. | 160 |
| /autoschluessel/gehaeuse (Rückfall) | Autoschlüssel-Gehäuse erneuern: Anfrage mit Fotos | 69/710 | Autoschlüssel-Gehäuse erneuern | 50/541 | 136 | Ein neues Gehäuse für Ihren Funkschlüssel, die Elektronik bleibt. Senden Sie Fahrzeug, drei Fotos des Schlüssels und den Fahrzeugschein, wir nennen den Preis. | 158 |
| /autoschluessel/gehaeuse/anfrage (Rückfall) | Gehäuse-Anfrage: Fahrzeug, Fotos von Schlüssel und Fahrzeugschein | 85/874 | Gehäuse für Autoschlüssel anfragen | 54/568 | 119 | In fünf Schritten zum neuen Gehäuse: Fahrzeug, Tasten, Fotos von Schlüssel und Fahrzeugschein, Kontakt und Absenden. Mit der Anfrage entsteht noch kein Vertrag. | 160 |
| /standorte/wetzlar | Autoschlüssel und Schließtechnik in Wetzlar | 63/637 | Wetzlar: Werkstatt und Leistungen (nur `content/cities.json`, siehe OFFENE FRAGE 5) | 53/550 | 149 | unverändert | 149 |
| /partner-werden/netzwerk-deutschland | Fahrzeugschlüssel-Netzwerk Deutschland | 58/618 | Netzwerk für Fahrzeugschlüssel | 50/529 | 151 | unverändert | 151 |
| /partner-werden/kooperation | Autoschlüssel-Kooperation für Betriebe | 58/591 | Kooperation für Autoschlüssel-Fälle | 55/560 | 146 | unverändert | 146 |
| /autoschluessel/* (11 Rückfälle) | z. B. „Autoschlüssel – Leistungen im Überblick“, „Fahrzeugöffnung — zerstörungsfrei“ | | jetzt gleich `content/seo.json` (Teil A) | ≤ 56/573 | | gleich `content/seo.json` | 139 bis 160 |

Im Test belegt: `src/lib/data/seo-laengen.test.ts`, Abschnitte „Teil B (FA-SEO-01B)“.

## OFFENE FRAGEN

1. Bei Codeseiten nennt die Beschreibung jetzt keine Beträge mehr. Für Produktseiten könnte der Preis im Suchergebnis gewollt sein. Regel 3 aus FA-SEO-01A schließt Preise aus. Darf der Stückpreis in Code- und Artikelbeschreibungen stehen? FA-SHOP-01 baut diese Seiten ohnehin neu.
2. Artikelseiten (Vorlage) habe ich nicht geändert. Titel und Beschreibung kommen aus den Daten, sonst aus Name und `kurztext`. Zu kurze Texte echter Artikel fallen erst mit echten Artikeln auf. Soll FA-SHOP-01 eine Mindestlänge in die Vorlage aufnehmen?
3. Lange Codelinien-Anwendungen verdrängt jetzt „{Schlüsselart} nach Code ({Kennung})“, etwa „Briefkastenschlüssel (BK-05)“. Das ist eindeutig, aber weniger sprechend. Sollen echte Linien einen eigenen kurzen Suchtitel im Backend bekommen?
4. Die Modelle erscheinen in der Beschreibung so, wie die Schlüsselarten sie benennen, also groß („…: Mechanisch, Klappschlüssel, …“). Das stammt aus `keyKindShortLabel` und ist sichtbar gleich. Ich habe es nicht geändert.

5. Der neue Wetzlar-Titel und der Verweis „Termin anfragen“ stehen nur in `content/cities.json`. Der Seed-Plan `einsatzgebiete` in `src/payload/seed.ts` (Zeile 598) hat keinen `abgleich` und übernimmt SEO-Felder nicht, anders als Ratgeber und Seiten mit `SEO_ABGLEICH`. Produktion liest die Orte aus Payload (`payload-adapter.ts` Zeile 108). Dort bleibt der alte Titel „Autoschlüssel und Schließtechnik in Wetzlar“ (637 px) stehen, bis jemand ihn im Admin ändert. Die Vorgabe ist für die Ortsseite also nur in der JSON-Datei erfüllt. `src/payload` liegt außerhalb meiner Schreibrechte. Vorschlag für ein Folgepaket: bei `einsatzgebiete` einen Abgleich mit `...SEO_ABGLEICH` ergänzen; gepflegte Werte bleiben dabei erhalten wie in FA-SEO-01A Punkt 7.
6. `src/app/(site)/autoschluessel/anfrage/page.tsx` Zeile 55 verweist mit „Schlüssel verloren – was tun?“ auf den Ratgeber. Der Ratgebertitel hat keinen Gedankenstrich mehr. Der Verweis ist sichtbarer Text außerhalb meiner Schreibrechte. Vorschlag für ein Textpaket: „Autoschlüssel verloren: Was tun?“.
7. Der letzte Rückfall des Modelltitels ist jetzt der Modellname allein. Ein Modellname, der allein nicht in 580 px passt (mehr als etwa 40 Zeichen), bliebe zu breit. Im Bestand gibt es keinen solchen Namen; ein gepflegter Titel im Backend geht ohnehin vor.

## FÜR MENSCHEN

- Inhaber: Bitte freigeben, dass in Suchergebnis-Texten von Code- und Artikelseiten keine Preise stehen (OFFENE FRAGE 1).
- Orchestrator: Onpage-Messung nach dem nächsten Build ausführen; erwartet: kein gelber Befund mehr bei Titel und Beschreibung auf den Seiten dieses Pakets.

## NACHBESSERUNG

Zwei Gegenprüfer haben elf Befunde gemeldet. Ich habe jeden am Code geprüft. Alle trafen zu.

| Nr. | Befund | Ergebnis |
|---|---|---|
| 1 (rot) | Kontakt: Erreichbarkeit fest im Quelltext statt aus den Einstellungen | Behoben. `metadata` ist durch `generateMetadata` ersetzt. Die Beschreibung bildet `kontaktBeschreibung(settings)` in der neuen Datei `kontakt/suchtexte.ts`: „Anschrift, Telefon und E-Mail.“ und `erreichbarkeitSatz(erreichbarkeit(settings))`. Über 160 Zeichen bleibt nur die Kernaussage. Unter 120 Zeichen folgt ein Satz aus dem Kopf der Seite („Für Aufträge nutzen Sie den passenden Ablauf.“). Der Test bildet die Beschreibung aus `content/settings.json`, aus dem Standard, aus einer abweichenden Erreichbarkeit ohne Notdienst (dann steht nirgends „24 Stunden“ oder „rund um die Uhr“) und aus einer zu langen. Er prüft auch, dass die Seite `kontaktBeschreibung(settings)` aufruft. |
| 2 (rot) | Versand und Zahlung: Beschreibung kündigt Lieferzeiten an, die nicht gepflegt sind | Behoben. Neu: „Liefergebiet, Versandarten mit Kosten, Zahlungsarten und die Anzahlung bei Terminaufträgen: So laufen Zahlung und Versand bei SCHLÜSSELMACHER24.“ (144 Zeichen). Alles davon steht sichtbar in `versand-inhalt.tsx`. |
| 3 (rot) | Wetzlar-Titel nur in JSON, nicht in Datenbank | Trifft zu, liegt aber in `src/payload` und damit außerhalb der Schreibrechte. Nicht behoben, als OFFENE FRAGE 5 an den Orchestrator. Die Belegtabelle nennt die Einschränkung. |
| 4 (gelb) | Wetzlar-Verweis „Autoschlüssel-Termin anfragen“ | Behoben. Die Beschriftung lautet „Termin anfragen“. Der Test „der Verweis der Orte auf die Autoschlüssel-Anfrage heißt ‚Termin anfragen‘ (A-031)“ prüft das für alle Orte. In der Datenbank gilt dieselbe Einschränkung wie bei Befund 3. |
| 5 (gelb) | Codelinien: zwei gleichbedeutende Sätze zum Originalschlüssel | Behoben. „Ohne Einsendung des Originalschlüssels.“ ist aus der Linienbeschreibung gestrichen. „Ihr Originalschlüssel bleibt bei Ihnen.“ rückt an seine Stelle, wie in der Einleitung und im Bestellformular. Als letzter Satz kommt „Sie geben den Code ein, wir fertigen danach.“ dazu. Die Einleitung sagt dasselbe („gefertigt nach dem Code, den Sie eingeben“). Keine Linie enthält jetzt beide Sätze. Kategorie- und Herstellerseiten hatten die Doppelung nicht. |
| 6 (gelb) | Motorrad-Anfrage: „sechs Schritte“, aber fünf genannt, Fotos falsch zugeordnet | Behoben. Neu: „Motorradschlüssel in sechs Schritten: Motorrad, Schlüssel und Chip, Unterlagen und drei Fotos, Beschreibung, Kontakt und Absenden. Die Anfrage ist kein Vertrag.“ (160 Zeichen). Das entspricht `schritteFuer`. Den gleichen Fehler hatte der Rückfall der Gehäuse-Anfrage („fünf Schritte“, vier genannt). Neu: „… Fahrzeug, Tasten, Fotos von Schlüssel und Fahrzeugschein, Kontakt und Absenden. …“ (160 Zeichen), wie `STEPS` in `anfrage-formular.tsx`. |
| 7 (gelb) | Verweis „Schlüssel verloren – was tun?“ in `autoschluessel/anfrage/page.tsx` | Trifft zu, sichtbarer Text außerhalb der Schreibrechte. Nicht geändert, als OFFENE FRAGE 6 genannt. |
| 8 (gelb) | Kontakt: Erreichbarkeit fest im Code (wie Befund 1) | Mit Befund 1 behoben. Der Bericht schreibt jetzt, was im Code steht. |
| 9 (gelb) | `zusagenErlaubt` schaltet bei Kontakt die ganze Prüfung ab | Behoben. Der Schalter ist durch `erlaubterWortlaut` ersetzt. Nur dieser Satz fällt vor der Prüfung heraus. Bei Kontakt gilt `VERBOTEN` für den Rest der Beschreibung („schnell“, „günstig“, „€“, Fristen). Bei abweichender Erreichbarkeit gilt `VERBOTEN` ganz. |
| 10 (gelb) | Test „lange Namen“ lässt beim Modell einen zu breiten Titel durch | Behoben. `modellTexte` hat zwei weitere Vorschläge: „{Modell} Autoschlüssel“ und „{Modell}“. Der Test prüft den erfundenen langen Namen jetzt ohne Ausnahme mit `pruefeSuchtexte`, also auch Breite und Mindestlänge der Beschreibung. Er erwartet den Titel „Sprinter Kastenwagen Hochdach 1“. Die verbleibende Grenze (Modellname allein zu lang) steht als OFFENE FRAGE 7. Für den Bestand ändert sich nichts, denn alle echten Modelle passen schon mit dem ersten oder zweiten Vorschlag. |
| 11 (gelb) | `TITEL_MAX` mit gleichem Namen und verschiedener Bedeutung | Behoben. Beide Dateien leiten `TITEL_MAX` jetzt gleich ab: `TITEL_MAX_ZEICHEN - [...MARKENZUSATZ].length` aus `src/lib/titelbreite.ts` (= 40). Die Tests von `codelinie-texte` bleiben damit grün. |

Prüfung nach der Nachbesserung, über die Datenweiche (`sicher.sh --json`):

| Prüfung | Ergebnis |
|---|---|
| `npx vitest run` | 205 Dateien, 3095 Tests, alle grün. Ein Zwischenlauf von `seo-laengen` war rot: Die abweichende Erreichbarkeit ergab mit dem ersten Ergänzungssatz 161 Zeichen. Den Satz habe ich gekürzt. |
| `npm run typecheck` | ohne Fehler |
| `npm run lint` | ohne Befund |

Weitere geänderte Dateien in der Nachbesserung: `src/app/(site)/service-und-termin/kontakt/page.tsx`, `src/app/(site)/service-und-termin/kontakt/suchtexte.ts` (neu), `src/app/(site)/rechtliches/versand-und-zahlung/page.tsx`, `src/app/(site)/motorradschluessel/anfrage/page.tsx`, `src/app/(site)/autoschluessel/gehaeuse/anfrage/page.tsx`, `content/cities.json`, `src/lib/codelinie-texte.ts`, `src/lib/fahrzeug-texte.ts`, `src/lib/data/seo-laengen.test.ts`, dieser Bericht.

## ABNAHME (Orchestrator, 15.11.2026)

- **Seed-Abgleich für Ortsseiten ergänzt** (Befund 3): Der Plan `einsatzgebiete` in `src/payload/seed.ts` gleicht jetzt `seo.titel`, `seo.beschreibung` und die Verweise ab wie Ratgeber und Seiten. Der neue Wetzlar-Titel und der Verweis „Termin anfragen“ kommen damit auch in einer bestehenden Datenbank an, solange der Betrieb sie nicht selbst geändert hat. Der Datenbanktest zum Seed läuft mit der Abnahme von FA-KERN-05.
- **Verweis mit Gedankenstrich** (Befund 7): Im Termin-Assistenten heißt der Verweis auf den Ratgeber jetzt wie dessen Titel „Autoschlüssel verloren: Was jetzt zu tun ist“.
- **Preise in Suchergebnis-Texten** (offene Frage 1): bleiben draußen, auch bei Code- und Artikelseiten; der Preis steht auf der Seite und, wo er echt ist, in den Strukturdaten (FA-SHOP-01B).
- Typprüfung, Lint und Unit-Tests waren grün (3.095 Tests, mit den Tests gleichzeitig laufender Pakete). Build und Onpage-Messung folgen mit der Abnahme von FA-KERN-05, weil ein Build während dessen Umbau scheitern kann.
- **Onpage-Messung** (15.11.2026 22:50, Build mit FA-KERN-05, FA-INHALT-03F und diesem Paket): 134 Seiten, kein gelber Befund mehr bei Titel und Beschreibung (vorher Titel auf 74 und Beschreibung auf 24 Seiten). Der Lauf meldet auf allen Seiten „noindex“ als roten Befund: Das kommt aus dem gerade laufenden Paket FA-SEO-01C, das jede Umgebung außerhalb der Produktionsdomain auf noindex stellt; die Messung mit richtiger Indexierbarkeit folgt mit dessen Abnahme. Der Bericht `FA-SEO-02-onpage.md` bleibt bis dahin auf dem Stand vom 15.11. 18:45.
