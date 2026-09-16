# SCHLÜSSELMACHER24 — Umsetzungsdokumentation

Stand: 15.09.2026 · Grundlage: Projektleitfaden SCHLÜSSELMACHER24, Version 2.1

Dieses Dokument beschreibt, wie die Website aufgebaut ist, wo welche Inhalte
gepflegt werden und was vor dem Livegang noch zu erledigen ist.

---

## 1. Technischer Aufbau

| Baustein | Umsetzung |
|---|---|
| Rahmenwerk | Next.js 16 (App Router, Turbopack) |
| Oberfläche | React 19, TypeScript im strengen Modus |
| Gestaltung | Tailwind CSS 3 mit semantischen CSS-Variablen |
| Formulare | react-hook-form-kompatible Bausteine, zod verfügbar |
| Datenhaltung | austauschbarer Adapter, Standard: JSON-Dateien unter `content/` |
| Zustand im Browser | zustand (Warenkorb), `localStorage` (Zwischenstände) |

Der technische Unterbau der Vorlage wurde beibehalten. Es fand kein
Technologiewechsel statt.

### Verzeichnisse

```
content/                     Pflegbare Inhalte als JSON (vom Backend beschrieben)
scripts/seed-content.mjs     Schreibt die Standardinhalte nach content/
src/app/                     Seiten und Routen
src/components/ui/           Schaltflächen, Karten, Hinweise, Info-Symbol, Bildplatzhalter
src/components/forms/        Eingabefelder, Auswahlkacheln, Foto-Upload
src/components/flow/         Rahmen für mehrstufige Abläufe
src/components/layout/       Kopf- und Fußbereich, Abschnitte, Zusammenfassung
src/components/seo/          Strukturierte Daten (JSON-LD)
src/lib/types.ts             Vollständiges Datenmodell
src/lib/data/                Datenschicht mit Adapter und Standardinhalten
src/lib/pricing.ts           Preisermittlung
src/lib/scheduling.ts        Terminlogik
src/lib/actions/             Server Actions für Formulare und Backend
src/lib/integrations/        Zahlung, Mailversand, Dateiablage (vorbereitet)
```

---

## 2. Die vier Kundenprozesse

Alle vier Wege nutzen dieselben Bausteine, dieselbe Sprache und dieselbe
Bedienlogik. Mehrstufige Abläufe laufen ausnahmslos über `FlowShell` und
`useFlow` — damit haben sie automatisch Fortschrittsanzeige und
Zwischenspeicherung im Browser.

| Prozess | Bereiche | Route |
|---|---|---|
| Direkt kaufen | Schlüssel nach Code, gleichschließende Zylinder | `/schluessel-nach-code`, `/gleichschliessende-zylinder/konfigurator` |
| Geführte Anfrage | Schlüssel nach Vorlage, Tür-/Schließtechnik, Sicherheitstechnik | `/schluessel-nach-vorlage/anfrage`, `/sicherheitstechnik/sicherheitscheck`, `/service-und-termin/anfrage` |
| Projektkonfigurator | Schließanlagen, elektronische Zutrittslösungen | `/schliessanlagen/konfigurator`, `/elektronische-zutrittsloesungen/konfigurator` |
| Termin mit Anzahlung | Autoschlüssel | `/autoschluessel/anfrage` |

Alle Vorgänge landen in einer gemeinsamen Struktur (`BusinessRecord`) und sind
im Backend unter `/admin/vorgaenge` einheitlich einsehbar.

---

## 3. Inhaltspflege ohne Entwickler

Alle Werte aus Abschnitt 06 des Leitfadens stehen **nicht** im Quellcode. Sie
werden im Backend gepflegt und liegen als JSON unter `content/`.

| Wert | Backend | Datei |
|---|---|---|
| Mindestvorlauf (Standard 7 Tage) | `/admin/preise` | `settings.json` |
| Anzahlung (Standard 69,90 €, Rahmen 50–80 €) | `/admin/preise` | `settings.json` |
| Preis je Fahrzeuggruppe und Leistung | `/admin/preise` | `service-pricing.json` |
| Terminlänge je Leistung | `/admin/preise` | `service-pricing.json` |
| Buchungsfenster und Öffnungszeiten | `/admin/termine` | `settings.json` |
| Sperrtage (Urlaub, Feiertage, intern) | `/admin/termine` | `blocked-days.json` |
| Codelinien (52 Produkte) | `/admin/produkte` | `code-lines.json` |
| Zylinderkatalog | `/admin/produkte` | `cylinder-catalog.json` |
| Fahrzeugmarken, Modelle, Schlüsselarten | `/admin/fahrzeugdaten` | `vehicles.json` |
| Titel, Beschreibung, Texte, interne Links | `/admin/inhalte` | `seo.json` |
| Ratgeberbeiträge | `/admin/inhalte` | `guides.json` |
| Einsatzgebiete | `/admin/inhalte` | `cities.json` |
| Firmendaten, Aufbewahrungsfristen, Versandarten | `/admin/einstellungen` | `settings.json` |

Standardinhalte liegen zusätzlich als Quelltext in
`src/lib/data/defaults/`. Sie greifen, solange unter `content/` keine Datei
liegt. Mit `npm run seed` werden daraus echte Dateien.

---

## 4. Bildplatzhalter

Es befindet sich **keine einzige Bilddatei** mehr im Projekt. Jede Stelle, an
der später ein Bild stehen soll, ist als beschriftete Platzhalterfläche
angelegt (`<ImagePlaceholder>`), die das gewünschte Motiv benennt.

Es wurden bewusst **keine Stockfotos und keine erzeugten Bilder** eingesetzt.

---

## 5. Offene Anbindungen

Drei externe Dienste sind vorbereitet, aber ohne Zugangsdaten inaktiv. Der
Status ist im Backend unter `/admin/einstellungen` sichtbar. Zugangsdaten
werden ausschließlich über Umgebungsvariablen gesetzt (siehe `.env.example`).

| Anbindung | Variablen | Verhalten ohne Anbindung |
|---|---|---|
| Online-Zahlung | `PAYMENT_PROVIDER`, `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET` | Vorgang wird mit Zahlungsstatus „offen“ angelegt, Zahlung außerhalb des Systems, Bestätigung im Backend |
| E-Mail-Versand | `MAIL_PROVIDER`, `MAIL_API_KEY`, `MAIL_FROM_ADDRESS` | Keine automatischen Bestätigungen; Kunde erhält seine Vorgangsnummer auf der Bestätigungsseite |
| Dateiablage | `STORAGE_PROVIDER`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` | Uploads werden am Vorgang nur vermerkt, nicht dauerhaft gespeichert |

Die Anbindung erfolgt jeweils an genau einer Stelle in
`src/lib/integrations/index.ts`. Der übrige Ablauf bleibt unverändert.

---

## 6. Rechtstexte

Alle Pflichtseiten sind als vollständig gegliederte Seiten angelegt. Die
juristischen Inhalte sind **nicht erfunden**, sondern als klar gekennzeichnete
Platzhalter (`[Platzhalter: …]`) hinterlegt.

**Diese Texte müssen vor dem Livegang juristisch geprüft werden.** Besonders
zu prüfen sind kundenspezifische Sonderanfertigungen, Anzahlungen,
Datei-Uploads und Überwachungstechnik.

---

## 7. Datenschutz und Sicherheit

- Fahrzeugscheine, Schlüsselbilder und Objektpläne sind im Datenmodell als
  eigene Kategorien geführt, damit Aufbewahrungsfristen greifen können.
- Die Fristen werden im Backend gepflegt und erscheinen automatisch in der
  Datenschutzerklärung.
- Zwischenstände und Warenkorb liegen ausschließlich im Browser und werden
  erst beim Absenden übertragen.
- Die Seite setzt keine Analyse-, Werbe- oder Fremddienste ein. Die
  Cookie-Einstellungen sind funktionsfähig angelegt und auf spätere Dienste
  vorbereitet.
- `/admin`, `/kasse`, `/warenkorb` und `/bestellung` sind über `robots.ts` von
  der Indexierung ausgenommen.

---

## 8. Umfang der Umsetzung

| Kennzahl | Wert |
|---|---|
| Routen (Seiten) | 55 |
| Im Build erzeugte Seiten | 194 |
| Quelldateien (TypeScript/TSX) | 139 |
| Bildplatzhalter | 37 auf 23 Seiten |
| Info-Symbole mit Erklärung | 103 |
| Codelinien im Shop | 52 |
| Fahrzeugmarken / Modelle | 12 / 49 |
| Leistungsseiten (Tür-/Sicherheitstechnik) | 17 |
| Pflegbare Seitentexte | 24 |
| Ratgeber / Einsatzgebiete | 8 / 6 |

Prüfstand: `npm run build` ✓ · `npm run typecheck` ✓ · `npm run lint` ✓ ·
alle 47 Hauptrouten liefern HTTP 200.

---

## 9. Vor dem Livegang zu erledigen

### 9.1 Zugangsschutz für das Backend

`/admin` ist derzeit ohne Anmeldung erreichbar. Vor dem Livegang muss der
gesamte Bereich geschützt werden — durch eine Anmeldung oder auf Ebene des
Servers. Der Hinweis steht sichtbar auf jeder Backend-Seite.

### 9.2 Firmendaten eintragen

Alle Angaben unter `/admin/einstellungen` sind Platzhalter. Solange das so
ist, weist der Fußbereich darauf hin und die Firmenangaben bleiben aus den
strukturierten Daten für Suchmaschinen ausgespart.

### 9.3 Rechtstexte juristisch prüfen

| Seite | Besonders zu klären |
|---|---|
| Impressum | Berufsrechtliche Angaben, Aufsichtsbehörde, Streitbeilegung |
| Datenschutz | Rechtsgrundlagen, Auftragsverarbeiter, Aufsichtsbehörde, Video- und Protokollfunktionen |
| Widerruf | Ausschluss bei kundenspezifischer Anfertigung, Umgang mit Anzahlungen, eingesandte Originalschlüssel |
| AGB | Vertragsschluss je Prozess, Preisrahmen und Prüfvorbehalt, Nachweis der Verfügungsberechtigung, Sicherungskarten |
| Zahlung und Versand | Lieferzeiten, Erstattung der Anzahlung, Umsatzsteuerausweis |
| Cookie-Einstellungen | Sobald Analyse-, Karten- oder Marketingdienste hinzukommen |

### 9.4 Fachliche Datenpflege

- **Codelinien**: Bei allen 52 Linien steht `[Hersteller eintragen]`.
  Hersteller, Preis, Codeformat und Lieferumfang gehören fachlich befüllt.
- **Fahrzeugdaten**: 12 Marken mit 49 Modellen sind als pflegbares Gerüst
  angelegt, keine geprüfte Herstellerliste. Welche Schlüsselart ein Modell
  tatsächlich hat und ob das Fahrzeug vor Ort sein muss, ist zu prüfen.
- **Einsatzgebiete**: Die sechs Stadtseiten enthalten gekennzeichnete
  Platzhalter. Ohne echten örtlichen Mehrwert sollten sie nicht live gehen.
- **Preise**: Die hinterlegten Beträge sind Startwerte für den Betrieb.

### 9.5 Bildplatzhalter befüllen

37 Bildstellen sind beschriftet und warten auf echte Motive — Werkstatt- und
Produktfotos, Messzeichnungen für Zylinder, Schemazeichnungen der
Schließanlagensysteme und Beispielfotos an den Upload-Feldern. Stockfotos
sind dafür ausdrücklich nicht vorgesehen.

---

## 10. Eigene Entscheidungen, die zu bestätigen sind

1. **Datenhaltung als JSON-Dateien mit Adapter-Schnittstelle.** Statt einer
   externen Inhaltsverwaltung, die Zugangsdaten braucht, liegt der Inhalt in
   `content/` und wird über `/admin` gepflegt. Die Schnittstelle
   `DataAdapter` bleibt austauschbar. Auf Plattformen mit
   schreibgeschütztem Dateisystem ist ein Datenbank-Adapter nötig.
2. **Farbwelt und Schrift.** Graphit und Stahlblau auf kühlem Off-White,
   IBM Plex Sans und Inter. Bewusst keine Notdienst-Optik, keine
   Signalfarben als Fläche.
3. **Neun Hauptbereiche in der Navigation**, davon fünf direkt in der
   Kopfzeile und vier unter „Mehr“ — sonst bricht die Leiste um.
4. **Leistungsbegriffe ohne eigene Route** wurden bestehenden Seiten
   zugeordnet: Zweit- und Ersatzschlüssel → *nachmachen*, Transponder und
   Wegfahrsperre → *programmieren*, Gehäuse/Tasten/Batterie →
   *funkschluessel*. Eigene Unterseiten sind jederzeit ergänzbar.
5. **Preisermittlung serverseitig.** Preis, Anzahlung und Terminlänge werden
   beim Absenden aus den Stammdaten neu hergeleitet und das gewählte
   Zeitfenster erneut geprüft. Angaben aus dem Browser sind nie
   preisbestimmend.
6. **Vier Fahrzeug-Preisgruppen** (A bis D) statt Preise je Modell — sonst
   wäre die Pflege von 49 Modellen unzumutbar.
7. **52 Codelinien nach Anwendungsfamilie** statt nach Herstellern, weil
   ohne geprüfte Herstellerdaten keine Herstellerangabe erfunden werden
   sollte.
8. **Kein Cookie-Banner.** Es werden keine einwilligungspflichtigen Dienste
   eingesetzt; die Cookie-Einstellungen sind trotzdem als funktionsfähige
   Seite vorhanden und auf spätere Dienste vorbereitet.
9. **Backend ohne Anmeldung**, dafür mit dauerhaftem Warnhinweis — eine
   Zugangsbeschränkung hängt von der späteren Betriebsumgebung ab.

---

## 11. Hinweise für den Betrieb

- Änderungen direkt an den Dateien unter `content/` greifen erst nach einem
  Neustart, weil die Datenschicht die Inhalte im Arbeitsspeicher hält.
  Änderungen über `/admin` wirken sofort.
- `npm run seed -- --force` setzt alle Inhalte auf den Auslieferungsstand
  zurück. Das überschreibt auch gepflegte Texte.
- `content/records.json` enthält Kundendaten und ist von der
  Versionsverwaltung ausgenommen.
