# KARTE · Suchfamilien, Zielseiten, Spuren (Stand 2026-11-03, E1-OPUS-01)

Verdichtet aus erhebung/E1-nachfrage.md (E1-RECHERCHEUR-05, Markt DE, Websuche vom 2026-11-03), erhebung/E1-lagebild-suche.md (E1-RECHERCHEUR-04) und dem Bestand (Routen unter `src/app/(site)`, Rubriken in `src/lib/data/defaults/rubriken.ts`). Grundlage für E8-OPUS-02 (Schlüsselseiten, Titel, Kurzantworten, Teilfragen) und E7-AUTOR-01 (Wetzlar und Hessen).

## Regeln dieser Karte

- **Belegstufen** (Auftrag 13): A Messung oder Schätzung eines genannten Anbieters · B nachweislich verwendete Formulierung (Suchauszug oder Seite) · C abgeleitet. Suchvolumen liegt nicht vor: Die Seite ist nicht live, Search-Console-Daten fehlen, die Datenanfrage steht in MENSCHEN.md (MA-10). Bis dahin stützt sich jede Familie auf Stufe B (Formulierungen und Trefferbild), die KI-Fragen auf Stufe C.
- **Eine Zielseite je Familie.** Andere Seiten zum selben Thema verweisen auf die Zielseite und doppeln ihre Antwort nicht.
- **Spur** sagt, welche Arbeit die Zielseite braucht: **Führung** (Weg mit Preis oder Abschluss ist da; Titel, Kurzantwort und Teilfragen schärfen) · **Aufbau** (Seite ist da, Substanz oder Weg fehlt; Informationsgewinn aufbauen) · **Lücke** (Seite oder Weg fehlt bei uns; neu bauen, nur mit eigener Substanz, R2, R3).
- **KI-Fragen** sind Teilfragen, die KI-Übersichten und KI-Modus aus der Leitanfrage ableiten (Google zerlegt Fragen in Teilsuchen, E1-lagebild-suche Nr. 3). Jede gestützte Teilfrage bekommt auf der Zielseite eine Überschrift mit Kurzantwort, die Marke, Leistung und Ort nennt (Auftrag 13). Antworten nur aus FACHWISSEN.md, Bestand oder Inhaber (Faktenampel, R4); was rot ist, bleibt als Frage in MENSCHEN.md.
- **Bundesweit gegen regional** (G-41 bis G-43): Einsenden, Code, Foto und Konfiguratoren sind deutschlandweit bestellbar; Vor-Ort-Leistungen gelten für Wetzlar und die gepflegten Einsatzgebiete. Keine Städteseiten ohne Partner mit echten Angaben (R2, R3).

## Familien

| Nr | Familie | Leitanfrage | Absicht | Beleg | Zielseite | Spur |
|---|---|---|---|---|---|---|
| F01 | Autoschlüssel allgemein | „Autoschlüssel Ersatz“ | Überblick, dann Weg wählen | C (aus F02 bis F06 abgeleitet) | `/autoschluessel` (Rubrik, Finder-Einstieg) | Aufbau |
| F02 | Autoschlüssel nachmachen | „Autoschlüssel nachmachen Kosten“ | Wissen, dann Auftrag | B: ADAC, Allianz Direct, bussgeldkatalog.org; Trefferbild 16 Ratgeber, keine Karten | `/autoschluessel/nachmachen` | Aufbau |
| F03 | Autoschlüssel programmieren | „Autoschlüssel programmieren Kosten“ | Wissen, Kosten, Problem lösen | B: auto-motor-und-sport, motor-talk; Trefferbild 11 Ratgeber und Medien | `/autoschluessel/programmieren` | Aufbau |
| F04 | Autoschlüssel verloren | „Autoschlüssel verloren was tun“ | Notlage, Wissen, Versicherung | B: bussgeldkatalog.org, transparent-beraten.de; Trefferbild 17 Ratgeber | `/ratgeber/autoschluessel-verloren-was-tun` (Bestand), Handlung: Anfrage | Aufbau |
| F05 | Autoschlüssel-Gehäuse | „Autoschlüssel Gehäuse tauschen Kosten“ | Kaufen oder reparieren lassen | B: Trefferbild 15, davon 8 eBay; Kaufabsicht | `/autoschluessel-gehaeuse` (neu, G-20, E6-BAUMEISTER-02) | Lücke |
| F06 | Transponder kopieren | „Transponder kopieren Autoschlüssel“ | Problem lösen, Kopie bestellen | B: Trefferbild 12, davon 6 Foren, keine Hersteller- oder Behördenseite | `/transponder-kopie` (neu, G-18, E6-OPUS-03) | Lücke |
| F07 | Motorradschlüssel | „Motorradschlüssel nachmachen Deutschland“ | Ersatz, oft ohne Original | B: Trefferbild 15, nur 6 zum Thema | `/motorradschluessel` (neu, G-19, E6-BAUMEISTER-01) | Lücke |
| F08 | Schlüssel nach Code | „Schlüssel nach Code bestellen Deutschland“ | Kaufen | B: Trefferbild 16, davon 12 eBay-Angebote für Möbel und Zylinder | `/schluessel-nach-code` | Führung |
| F08a | Codeschlüssel je Kategorie | z. B. „Briefkastenschlüssel nach Nummer“, „Büromöbel Schlüssel nach Code“ | Kaufen | C (Teilfamilien von F08, Trefferbild Möbel) | `/schluessel-nach-code/kategorie/[familie]` | Führung |
| F09 | Schlüssel nach Foto | „Schlüssel nach Foto bestellen Deutschland“ | Kaufen ohne Original vor Ort | B: Trefferbild 17, keine deutsche Leistung „Schlüssel nach Foto“ | `/schluessel-nach-vorlage` | Führung |
| F10 | Schlüssel per Post | „Schlüssel per Post nachmachen Deutschland“ | Auftrag aus der Ferne | B: Trefferbild 17, kein deutscher Versanddienst; Post-Dienst für unverpackte Schlüssel endete 2024 | `/schluessel-einschicken` | Führung |
| F11 | Sperrschließung, gleichschließende Zylinder | „Sperrschließung gleichschließende Zylinder Deutschland“ | Kaufen, konfigurieren | B: Kaufland-Kategorie, VdS 2156-1; Trefferbild kaum Anbieter mit Leistung | `/gleichschliessende-zylinder` mit Konfigurator | Aufbau |
| F12 | Schließanlage planen | „Schließanlage planen Kosten Deutschland“ | Planen, Kosten verstehen | B: Heinze, Baunetz; Trefferbild 19, keine Preisliste | `/schliessanlagen` mit Konfigurator | Aufbau |
| F13 | Schließzylinder messen | „Schließzylinder messen Deutschland“ | Wissen vor dem Kauf | B: SimonsVoss-Messblatt, selbst.de, LKA Niedersachsen; Trefferbild 19 | `/ratgeber/zylinder-richtig-ausmessen` (Bestand), Messhilfe im Konfigurator | Aufbau |
| F14 | Elektronische Schließsysteme | „elektronische Schließsysteme Kosten Deutschland“ | Wissen, Beratung | B: Baunetz, bau.de-Forum; keine deutsche Preisliste | `/elektronische-zutrittsloesungen` | Aufbau |
| F15 | Einbruchschutz Tür | „Einbruchschutz Tür nachrüsten Kosten Deutschland“ | Wissen, Kosten | B: Ratgeber-Serie bau.de, GDV-Merkblatt (A: rund 500 EUR für eine einbruchhemmende Wohnungstür) | `/ratgeber/einbruchschutz-wo-anfangen` (Bestand), Handlung: Beratung Sicherheitstechnik | Aufbau |
| F16 | Schlüsseldienst Wetzlar | „Schlüsseldienst Wetzlar“ | Lokal beauftragen | B: Verzeichnisse, Lokalratgeber; Trefferbild 20, keine Kartenergebnisse sichtbar | `/standorte/wetzlar` | Führung |
| F17 | Einsatzgebiete Hessen | „Schlüsseldienst Lahn-Dill-Kreis“, „Schlüsseldienst Hessen“ | Lokal beauftragen | C (G-41, G-42; Gebiete aus erhebung/E1-karte-video.md) | `/standorte` mit Karte (E7-OPUS-03, E7-AUTOR-01) | Lücke |
| F18 | Schließanlage in fernen Städten | „Schließanlage Hamburg“, „Schließanlage Berlin“ | Anbieter finden | B: Trefferbild 24, kein Anbieter deckt beide Städte ab | `/schliessanlagen` (bundesweit bestellbar), keine Städteseite | Aufbau |
| F19 | Marke „Schlüsselmacher“ | „Schlüsselmacher“, „Schlüsselmacher24“ | Marke, Begriff | B: Trefferbild 18, davon 7 englische Spamseiten | `/` (Startseite), Markendefinition auf Über uns | Führung |
| F20 | Partner werden | „Schlüsseldienst Partner werden“ | Zusammenarbeit (Betriebe) | C (G-39, G-40) | `/partner-werden` | Aufbau |
| F21 | Autoschlüssel für ein Modell | z. B. „Autoschlüssel VW Golf 7 nachmachen“ | Kosten und Weg für das eigene Auto | C (KI-Teilfrage aus F02) | `/autoschluessel/marken/[make]/[model]`, nur für gepflegte Modelle mit eigener Substanz | Aufbau |

Seiten ohne belegte Familie (Bestand bleibt, keine Schlüsselseite, keine eigene Suchzielsetzung bis zu Daten aus MA-10): `/autoschluessel/smart-key`, `/autoschluessel/fahrzeugoeffnung`, `/autoschluessel/schluesselbart-fraesen`, `/autoschluessel/funkschluessel` (verweist auf F05 und F03), die zehn Leistungsseiten unter `/tuer-und-schliesstechnik` und die sieben unter `/sicherheitstechnik`, die Ratgeber `unterschied-kopie-und-programmierung`, `schluesselcode-finden`, `schluessel-verloren-wohnung`, `welche-schliessanlage-passt`, `mechanisch-oder-elektronisch`.

## KI-Fragen und Teilanfragen je Familie

Formulierungen in Anführungszeichen sind belegt (B, Quelle in erhebung/E1-nachfrage.md); die übrigen Fragen sind abgeleitet (C). Die Antwortquelle steht in Klammern; „Inhaber“ heißt: bis zur Antwort keine Zahl und kein Versprechen auf der Seite.

- **F01 Autoschlüssel allgemein**: Welcher Weg passt zu meinem Schlüssel (nachmachen, programmieren, Gehäuse, Transponder-Kopie, Werkstatt oder vor Ort)? (Rubrikdaten) · Welche Unterlagen brauche ich? (FACHWISSEN 8, R13) · Was kostet das ungefähr? (Bestand, Inhaber) · Muss das Auto in die Werkstatt? (FACHWISSEN 8) · Mein Fahrzeug ist nicht dabei, was nun? (G-15).
- **F02 nachmachen**: „Autoschlüssel nachmachen: So hoch sind Aufwand und Kosten“ · Kosten für ein bestimmtes Modell, etwa VW Golf 7 (Finder, Bestand) · Kopie ohne Original möglich? (FACHWISSEN 8, Inhaber) · Welche Unterlagen? (R13) · Wie lange dauert es? (Inhaber) · Schlüsseldienst oder Werkstatt? (FACHWISSEN 8).
- **F03 programmieren**: „Schlüssel umprogrammieren“ · Geht das ohne Autohaus? (FACHWISSEN 8) · Dauer (FACHWISSEN 8: Anlernen meist 30 bis 60 Minuten, Fachbetrieb) · Fahrzeugschein nötig? (R13) · Warum sind manche Marken teuer? (FACHWISSEN 8: AES-Generationen).
- **F04 verloren**: „Autoschlüssel verloren: Was tun? Wer zahlt? Woher Ersatz?“ · Zahlt die Kfz-Versicherung? (rot: Rechtslage ungeprüft, R10; nur Hinweis auf den eigenen Vertrag) · Welche Papiere? (R13) · Auto öffnen ohne Schlüssel? (Bestand `/autoschluessel/fahrzeugoeffnung`, kein Notdienstversprechen, R9) · Alten Schlüssel sperren lassen? (FACHWISSEN 8, Anlernen).
- **F05 Gehäuse**: Passt ein Gehäuse zu meinem Modell? (Fahrzeugkatalog, Inhaber) · Wird der Transponder umgesetzt? (FACHWISSEN 8) · Reparatur statt Tausch? (Inhaber) · Muss neu programmiert werden? (FACHWISSEN 8) · Was kostet der Tausch? (Inhaber, Angebot mit Zahlungslink).
- **F06 Transponder-Kopie**: „Woher bekommt man einen Transponder?“ · Darf man einen Transponder kopieren? (rot, R10) · Reicht ein Chip-Tausch? (FACHWISSEN 8: bei älteren Systemen oft, neuere brauchen den ganzen Schlüssel) · Warum erkennt das Auto die Kopie nicht? (FACHWISSEN 8) · Welche Fahrzeuge sind klonbar? (nur Bogen KLONBAR, G-18).
- **F07 Motorrad**: „Motorradschlüssel verloren oder gestohlen?“ · Ersatz ohne Original? (Inhaber) · Geht das per Post? (Einsenden) · Was kostet ein Schlüssel mit Wegfahrsperre? (Inhaber) · Wo steht die Schlüsselnummer? (Inhaber, Fotoanleitung).
- **F08 Code**: „Schlüssel nach Code geschnitten“ · Wo steht der Code? (Bestand, Codelinien mit Fundort) · Brauche ich einen Eigentumsnachweis? (R13, Sicherungskarte bei geschützten Profilen) · Was kostet ein Möbelschlüssel? (Bestand, Preise je Codelinie) · Liefern Sie bundesweit? (Bestand).
- **F09 Foto**: Wie fotografiere ich den Schlüssel richtig? (G-23, Fotoanleitung) · Reicht jedes Foto? (G-23: nein, dann Einsenden) · Brauche ich einen Nachweis? (R13) · Was kostet das? (Bestand) · Geht das auch für Autoschlüssel? (Rubrikgrenzen).
- **F10 Einsenden**: „Schlüssel verschicken“ · Ist der Versand versichert? (QUELLEN Versand: Einschreiben bis 25 EUR) · Wer zahlt das Porto? (rot bis MA-18) · Brauche ich die Sicherungskarte? (R13) · Wie bekomme ich den Schlüssel zurück? (G-25).
- **F11 Sperrschließung**: „Schließzylinder gleichschließend“ · Was heißt gleichschließend? (FACHWISSEN 1) · Wie viele Schlüssel bekomme ich? (Bestand, Konfigurator) · Sperrschließung oder Schließanlage? (FACHWISSEN 1, G-09 Laienbeispiel) · Ist das sicherer? (FACHWISSEN 3 und 4, nur mit Klasse je Produkt).
- **F12 Schließanlage**: „Schließanlagenplanung“ · Was kostet eine Anlage für ein Mehrfamilienhaus? (Konfigurator, Preisrahmen nur mit Inhaberpreisen, A-019) · Was passiert bei Verlust des Hauptschlüssels? (FACHWISSEN 1, Inhaber) · Wann lohnt elektronisch? (FACHWISSEN, Baunetz-Faktor 3 bis 10 nur mit Quelle) · Wie sieht ein Schließplan aus? (FACHWISSEN 1, Konfigurator) · Gibt es einen Betrieb in Hessen? (Standort Wetzlar).
- **F13 Messen**: Wie messe ich richtig? (FACHWISSEN 7) · Welche Länge passt? (FACHWISSEN 7) · Wie weit darf der Zylinder überstehen? (FACHWISSEN 7: höchstens 3 mm empfohlen) · Was bedeutet 30/30? (FACHWISSEN 7) · Welche Maße hat ein Profilzylinder? (Zylinderkatalog, Bestand).
- **F14 Elektronik**: Lohnt sich das im Gewerbe? (Beratung) · Was kostet ein elektronischer Zylinder? (Inhaber, G-33) · Lassen sich mechanisch und elektronisch mischen? (Inhaber) · Wartung, Batterie? (Inhaber).
- **F15 Einbruchschutz**: Was kostet eine einbruchhemmende Tür? (GDV, A, mit Quelle) · Nachrüsten statt Austausch? (Beratung) · Welcher Zylinder schützt? (FACHWISSEN 3 und 4) · Gibt es Förderung? (rot, nicht geprüft).
- **F16 Wetzlar**: „Woran erkennt man einen seriösen Schlüsseldienst?“ · Schlüsseldienst in der Nähe (Standort, Öffnungszeiten aus den Einstellungen) · Nachts geöffnet? (nur, wenn es stimmt; „24“ ist kein Notdienstversprechen, R9) · Was kostet ein Notdienst? (kein Notdienst im Bestand: ehrlicher Hinweis) · Schlüssel nachmachen in Wetzlar (Leistungen vor Ort).
- **F17 Hessen**: Welche Orte bedienen Sie? (Sammlung Einsatzgebiete, Karte) · Kommen Sie zu mir? (Außendienst laut Einstellungen, Inhaber) · Was geht ohne Anfahrt? (Einsenden, Code, Foto, G-26).
- **F18 ferne Städte**: Gibt es Anbieter für Hamburg und Berlin? (bundesweit bestellbare Konfiguratoren) · Kosten für ein Bürogebäude? (Konfigurator, Beratung) · Wie plane ich eine Schlüsselordnung? (FACHWISSEN 1).
- **F19 Marke**: Was ist ein Schlüsselmacher, was ein Schlüsseldienst? (Markendefinition, E8-AUTOR-02) · Wer steht hinter SCHLÜSSELMACHER24? (Über uns aus Belegen) · Was ist ein Schlüsselcode? (Bestand).
- **F20 Partner**: Welche Voraussetzungen? (G-39, MA-16) · Wie läuft die Abrechnung? (Modell A aktiv, B aus) · Welche Auftragsarten? (Partner-Modelle A-020).
- **F21 Modell**: Was bietet SCHLÜSSELMACHER24 für dieses Fahrzeug an? (Finder, nur belegte Angaben, G-17) · Was kostet es? (Bestand, Inhaber) · Welcher Transponder? (nur Kandidat mit Quelle, nie als Zusage).

## Kannibalisierung und Auflösung

| Konflikt | Auflösung |
|---|---|
| F02, F03, F04 teilen Ratgeber und Kostenfrage | Je eine Zielseite; F04 auf dem Ratgeber, F02 und F03 auf ihren Leistungsseiten; jede verweist für die anderen Fragen, statt sie zu beantworten. |
| `/autoschluessel/kopieren`, Ratgeber `unterschied-kopie-und-programmierung`, neue Rubrik `/transponder-kopie` | F06 zielt auf `/transponder-kopie` (buchbarer Weg). `/autoschluessel/kopieren` und der Ratgeber beantworten dieselbe Wissensfrage „Kopie oder vollwertiger Schlüssel“: E8-OPUS-02 führt sie per Denkprotokoll zusammen oder trennt sie klar (Vorschlag: zusammenführen auf `/autoschluessel/kopieren`, Ratgeber leitet um). |
| `/autoschluessel/funkschluessel` gegen neue Rubrik `/autoschluessel-gehaeuse` | F05 zielt auf `/autoschluessel-gehaeuse`. Die Funkschlüssel-Seite erklärt den Aufbau und verweist auf Gehäuse (F05) und Programmieren (F03). |
| F08 Code gegen F11 Sperrschließung (beide „Zylinder nach Code“) | Codeschlüssel für Möbel, Briefkasten und Zylinder-Nachschlüssel nach Code gehören zu F08; neue gleichschließende Zylinder zu F11. Die Codeseiten nennen den Konfigurator nur als Verweis. |
| F11 Sperrschließung gegen F12 Schließanlage | Beide Seiten tragen das Laienbeispiel (G-09) und den Vergleich (KA5) in je einem Satz und verweisen; die Entscheidungshilfe Privat oder Unternehmen (G-30) steht ausführlich nur auf `/schliessanlagen`. |
| F13 Ratgeber Messen gegen Messhilfe im Konfigurator | Ratgeber ist die Zielseite der Wissensfrage; der Konfigurator nutzt dieselbe Grafik (E5-GRAFIKER-01) und verlinkt den Ratgeber, ohne den Text zu doppeln. |
| F16 Wetzlar gegen Startseite | Startseite zielt auf die Marke (F19), `/standorte/wetzlar` auf „Schlüsseldienst Wetzlar“. |
| F18 Hamburg, Berlin gegen Stadt-Hubs (G-41) | Keine Städteseite ohne aktiven Partner (noindex bis dahin, E7-BAUMEISTER-01); bundesweite Anfragen landen auf `/schliessanlagen`. |
| F21 Modellseiten gegen F02 | Eine Modellseite ist nur indexierbar, wenn sie eigene Substanz hat (Finder-Ergebnis mit Leistungen und Preisen für genau dieses Modell); sonst führt die Fahrzeugwahl zu F02 (R3). |

## Schlüsselseiten (Vorschlag für E8-OPUS-02, höchstens 40)

1. Start (F19). 2. bis 16. die Rubriken: Autoschlüssel (F01), Motorradschlüssel (F07), Autoschlüssel-Gehäuse (F05), Transponder-Kopie (F06), Schlüsselfinder `/autoschluessel/marken`, Schlüssel nach Code (F08), nach Foto (F09), Einschicken (F10), Sperrschließung (F11), Schließanlagen (F12), Elektronische Schließsysteme (F14), Türen und Schließtechnik, Sicherheitstechnik, Schlüsseldienst vor Ort, Beratung. 17. und 18. `/autoschluessel/nachmachen` (F02), `/autoschluessel/programmieren` (F03). 19. und 20. Ratgeber Autoschlüssel verloren (F04), Zylinder richtig ausmessen (F13). 21. bis 26. die Kategorien von Schlüssel nach Code (F08a, Zahl aus den Daten, höchstens sechs). 27. bis 32. die wichtigsten Marken- und Modellseiten nach KBA-Bestand, nur mit eigener Substanz (F21). 33. und 34. Wetzlar (F16) und Hessen (F17). 35. Partner werden (F20). 36. Über uns (Markendefinition, E8-AUTOR-02). 37. bis 39. Fachseiten mit dem größten Informationsgewinn (Vorschlag: Ratgeber Einbruchschutz F15, Glossar Schließtechnik E8-AUTOR-03, Vergleich mechanisch oder elektronisch). Summe 39.

## Offene Punkte

1. Suchvolumen und Ergebnisbilder für Deutschland und Hessen (MA-10); die Websuche kann US-gewichtet sein.
2. Motorrad, Gehäuse und Transponder-Kopie bekommen ihre Seiten erst mit eigener Substanz (E6); bis dahin keine indexierbare Platzhalterseite.
3. Kartenergebnisse für „Schlüsseldienst Wetzlar“ wurden nicht erhoben; das Unternehmensprofil ist Sache des Inhabers (AUSSEN.md, E8-DOKUMENTAR-01).
