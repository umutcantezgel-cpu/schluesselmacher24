# Lagebild · SCHLÜSSELMACHER24

Quellen: `_werkstatt/berichte/E0-KUNDSCHAFTER-01…05`, Lückenprüfung, L0-Berichte. „(Annahme)“ = abgeleitet, nicht belegt.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Marke und Zielgruppe (Annahme, aus Texten und UMSETZUNG.md abgeleitet)
- **Marke:** Fachbetrieb mit eigener Werkstatt, ausdrücklich keine Notdienst-Optik; Haltung „sachlich, nachvollziehbar, ohne Überraschungen“ (`src/app/(site)/page.tsx:224-227`). Werte: Erst prüfen, dann buchen; jeder Vorgang bekommt eine Nummer; Anzahlung wird angerechnet.
- **Zielgruppen:** (1) Privatleute mit Auto, die einen Zweit- oder Ersatzschlüssel brauchen (Schwerpunkt, Anzahlung, Termin); (2) Mieter, Eigentümer und kleine Betriebe, die Schlüssel nach Code oder Vorlage oder gleichschließende Zylinder bestellen; (3) Hausverwaltungen, Gewerbe und Bauherren, die Schließanlagen, Zutrittslösungen und Sicherheitstechnik planen.
- **Nutzung:** überwiegend mobil, oft unter leichtem Zeitdruck (Schlüssel verloren), dann wieder sorgfältig planend (Projekte).

## Hauptansichten (festgelegt, unveränderlich)
| ID | Route | Art | Warum |
|---|---|---|---|
| H01 | `/` | Erzähl · Referenz | Einstieg, höchster Verkehr, zeigt alle Bereiche |
| H02 | `/autoschluessel` | Erzähl | Schwerpunktbereich, führt zur Buchung mit Anzahlung |
| H03 | `/autoschluessel/marken/volkswagen/golf` | Erzähl | Vorlage für 49 Modellseiten, Suchverkehr |
| H04 | `/autoschluessel/anfrage` | Arbeit | Hauptaufgabe 1, Umsatz (Anzahlung) |
| H05 | `/schluessel-nach-code` | Erzähl | Direktkauf, 52 Codelinien |
| H06 | `/schluessel-nach-code/ms-01` | Erzähl | Vorlage für Produktseiten mit Bestellformular |
| H07 | `/gleichschliessende-zylinder/konfigurator` | Arbeit | Direktkauf mit Konfiguration |
| H08 | `/schliessanlagen` | Erzähl | Projektgeschäft, erklärungsbedürftig |
| H09 | `/tuer-und-schliesstechnik` | Erzähl | Bereichsseite mit Rechner und Nachweisen |
| H10 | `/warenkorb` | Arbeit | Umsatz |
| H11 | `/kasse` | Arbeit | Umsatz |
| H12 | `/ratgeber/autoschluessel-verloren-was-tun` | Erzähl | Vorlage für Ratgeber, Lesetypografie |

## Hauptaufgaben (K-002)
1. Autoschlüssel-Termin mit Anzahlung buchen (`/` → `/autoschluessel/anfrage`, 13 Schritte).
2. Schlüssel nach Code bestellen (`/schluessel-nach-code` → Codelinie → Warenkorb → `/kasse`).
3. Zylinder konfigurieren und in den Warenkorb legen (`/gleichschliessende-zylinder/konfigurator`).
4. Schlüssel nach Vorlage anfragen (`/schluessel-nach-vorlage/anfrage`, 8 Schritte mit Fotos).
5. Schließanlagen-Projekt erfassen (`/schliessanlagen/konfigurator`, 11 Schritte).
6. Terminstatus prüfen (`/service-und-termin/terminstatus`).

## Funktionsliste (Bestandsschutz)
| Nr. | Funktion | Route | Prüfschritt |
|---|---|---|---|
| F-01 | Warenkorb: Code-Schlüssel hinzufügen, Menge ändern, entfernen, Versandart, Summe | `/schluessel-nach-code/ms-01`, `/warenkorb` | Eintrag erscheint, Summe stimmt, Entfernen leert |
| F-02 | Kasse: Pflichtfelder, zwei Bestätigungen, Absenden | `/kasse` | Absenden löst die (abgefangene) Bestellung aus |
| F-03 | Bestellseite nur mit gültigem Zugangsschlüssel | `/bestellung/x?t=falsch` | 404 |
| F-04 | Autoschlüssel-Assistent: Schritte, Fotos, Preis, Termin, Absenden | `/autoschluessel/anfrage` | bis zum Absenden durchlaufbar |
| F-05 | Zylinder-Konfigurator in den Warenkorb | `/gleichschliessende-zylinder/konfigurator` | Eintrag im Warenkorb |
| F-06 | Schließanlagen-Konfigurator bis Zusammenfassung und Absenden | `/schliessanlagen/konfigurator` | Absenden ausgelöst |
| F-07 | Weitere Abläufe: Vorlage-Anfrage, Sicherheitscheck, Zutritt, Service-Anfrage | jeweilige Route | erster und letzter Schritt erreichbar |
| F-08 | Terminstatus abfragen | `/service-und-termin/terminstatus` | Rückmeldung erscheint |
| F-09 | Cookie-Einstellungen speichern und löschen | `/rechtliches/cookie-einstellungen` | Speicherschlüssel gesetzt/entfernt |
| F-10 | Zwischenspeicherung in Abläufen (`sm24:flow:*`) | `/schluessel-nach-vorlage/anfrage` | nach Neuladen „Weitermachen“ |
| F-11 | Navigation: Megamenü, mobiler Drawer, Sprunglink, mobile Aktionsleiste | alle | öffnen, schließen, Fokus |
| F-12 | robots.txt, sitemap.xml, llms.txt, JSON-LD | `/robots.txt` u. a. | 200, Zahl der Einträge gleich |
| F-13 | Rechner Türabsicherung und Serviceeinsatz | `/tuer-und-schliesstechnik`, `/service-und-termin` | Ergebnis erscheint nach Auswahl |
| F-14 | Shop-Filter und Liste der Codelinien | `/schluessel-nach-code` | Filtern ändert die Liste |

## Ausgangswerte
(werden von E0-PRUEFER-05 erhoben und hier eingetragen)

## Stärken
- Saubere semantische HSL-Tokens, Bereichsfarben mit automatischem Kontrasttest (`src/lib/visual/area-theme.ts`).
- Eigenes, gut dokumentiertes Grafiksystem: 54 Fach-Icons auf gemeinsamer `IconBase`, 5 deterministische Generatoren mit Tests, CSS-Bewegungsbausteine mit Reduktionsregel (`src/components/visual/README.md`).
- Solide Bestandslogik: Server-Preisprüfung, atomare Vorgänge, Ratenbegrenzung, Upload-Prüfung, rund 300 Unit- und 52 DB-Tests.
- Klare Abläufe über `FlowShell`/`useFlow` mit Zwischenspeicherung; Sprunglink, `lang="de"`, globale Fokusregel.

## Schwächen mit Wirkung
| Schwäche | Wirkung |
|---|---|
| Grafiksystem auf keiner Seite genutzt; 37 Flächen zeigen „Bild folgt“ | Seite wirkt unfertig; Vertrauen und Unverwechselbarkeit fehlen |
| Zwei Icon-Familien möglich (lucide in 62 Dateien, Fach-Icons ungenutzt) | Kein eigenes Formsystem sichtbar; generischer Eindruck |
| Rund 690 freie Werte, keine Typo-, Dauer-, Schatten-, z-Skala | Uneinheitliche Hierarchie, 68 Texte unter 12 px |
| Gleichförmige Karten als vorherrschendes Muster, zentriertes Raster ohne Brüche | „Vorlagen-Look“, keine Blickführung |
| Fokus der Auswahlkarten unsichtbar (`option-card.tsx:57`) | Tastaturbedienung der Abläufe beeinträchtigt |
| iOS-Zoomschutz unwirksam (`text-[15px]` schlägt 16-px-Regel) | Seite zoomt beim Tippen in Formularen auf iPhones (Annahme, Kaskade) |
| Fortschritt animiert `width`, JS-Scroll ignoriert reduzierte Bewegung | Layoutarbeit und Barriere für bewegungsempfindliche Menschen |
| Kaputter Hover-Schatten (`page.tsx:301`), Platzhalter-Hersteller als Fakt | Fehler sichtbar für Besucher |

## Chancen
- Das Grafiksystem macht die Fachlichkeit sichtbar: Schlüsselprofil, Zylindermaß, Schließplan, Code-Fundstelle und Zutritt-Signal erklären Mechanik besser als Stockfotos.
- Die Leitidee „Werkstattzeichnung“ verbindet vorhandene Mittel (Plex Mono, Bemaßung in den Generatoren, Bereichsfarben) zu einer unverwechselbaren Sprache.
- Interaktive Grafiken an Kaufstellen (Live-Schlüssel aus dem Code, Schließplan zum Anklicken, Zylindermaß live) beantworten Fragen vor dem Kauf.
- Eine Typo- und Bewegungsskala macht Folgearbeit schneller und konsistent.
