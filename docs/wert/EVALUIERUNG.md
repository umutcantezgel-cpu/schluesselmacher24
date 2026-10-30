# Evaluierung: Wert und Wertsteigerung von SCHLÜSSELMACHER24

- **Stand:** 25.10.2026
- **Code:** Zweig `claude/website-technical-integrations-jvkhdc`, Stand 393a5e4
- **Messbasis:** Produktionsbuild mit Testdaten unter localhost:3100, ohne Stripe und Resend. Gemessen wurde mit Playwright auf Desktop (1280×900) und Handy (390×844). Belege (verkleinerte Screenshots) unter [`belege/`](belege/).
- **Messlatte:** die Leitfäden des Inhabers, `docs/leitfaden/Projektleitfaden-v2.1-2026-09-15.txt` (PL) und `docs/leitfaden/Ergaenzender-Leitfaden-2026-10-08.txt` (Erg.)
- **Zu den Zahlen:** Alle Euro-Werte sind Spannen aus genannten Annahmen. Echte Zahlen liefert der Inhaber nach (Abschnitt 3).
- **Abkürzungen:** DB = Deckungsbeitrag, T€ = Tausend Euro.

---

## 1 Kurzfassung

1. **Kernaussage:** Im mittleren Fall spielt die Seite ihre 40–60 T€ in 2–3 Jahren etwa vier- bis sechsfach als Deckungsbeitrag ein (nach Abzug der Kosten für Paket A und B etwa drei- bis vierfach). Faktor 10 erreicht sie nur, wenn drei Dinge zusammenkommen: rund 50 zusätzliche Autoschlüssel-Termine pro Monat, rund 4 Projektaufträge von Hausverwaltungen und Gewerbe pro Monat und etwa eine zusätzliche Arbeitskraft, die diese Aufträge abarbeitet.
2. Die größten Verluste liegen in der 70-%-Linie Autoschlüssel:
   - Wer alle Schlüssel verloren hat, steckt nach 13–15 Klicks in Schritt 8 fest.
   - Der Preis erscheint erst in Schritt 11, nach vier Uploads.
   - Weder Ablauf noch Bestätigung noch Kundenseite nennen die Werkstatt Langgasse 70 in Wetzlar. Die Kundenseite schreibt sogar „Vor Ort bei Ihnen“.
3. Vor dem Livegang sind drei Punkte offen: ein aktiver Leitfaden-Verstoß (sechs Großstädte als Vor-Ort-Regionen auf einer indexierten Seite) und zwei JETZT-Punkte des Ergänzenden Leitfadens (Foto-Freigabe bis zur Bestellung, Seite „Partner werden“). Von 98 Leitfaden-Anforderungen sind 53 erfüllt, 33 teilweise erfüllt, 12 fehlen.
4. Paket A (≈ 5 Tage) enthält die fünf von der Gegenprüfung bestätigten Sofort-Hebel, die Pflichtkorrekturen und die Messgrundlage. Es bringt rechnerisch 0,3–3,6 T€ Deckungsbeitrag pro Monat, Paket B (≈ 19 Tage) weitere 0,6–5,0 T€. Nachweisen lässt sich keine dieser Wirkungen, solange PLZ, Status und Kennzahlen nicht erfasst werden.
5. Belastbar wird die Rechnung erst, wenn der Inhaber echte Mengen, Materialkosten und freie Werkstattstunden liefert. Außerdem muss er fünf Punkte entscheiden: öffentliche Preise, Terminort, Öffnungszeiten, Preisabgleich mit der Schlüssel Schmiede und Personal.

### Schon umgesetzt (25.10.2026, im selben Pull Request)

Die fünf Sofort-Hebel, die die Gegenprüfung bestätigt hat, dazu I-21 als Pflichtkorrektur. Alle ohne Schemaänderung, ohne neuen Dienst und ohne Eingriff in Preise oder Rechtstexte. Geprüft mit Typprüfung, Lint, 1574 Unit-Tests, 78 DB-Tests, Produktionsbuild und Browser-Durchlauf auf Handy (390×844) und Desktop (1280×900).

| ID | Änderung | Gemessen nachher |
|---|---|---|
| I-01 | Bei „Kein funktionierender Schlüssel“ sind die Schlüsselfotos freiwillig, mit eigenem Hinweis. Fahrzeugschein und Berechtigung bleiben Pflicht. `?vorhanden=0` (Ratgeber „Schlüssel verloren“) belegt die Auswahl vor. | Schritt 8 geht ohne Fotos weiter, Schritt 9 bleibt ohne Fahrzeugschein gesperrt, Preisrahmen ab 329 € in Schritt 11. Gegenprobe mit funktionierendem Schlüssel: Schritt 8 bleibt gesperrt. |
| I-05 | „Ihre Marke ist nicht dabei? Fall schildern“ unter dem Marken-Raster und auf der Markenseite, Ziel: Anfrage mit Thema Autoschlüssel. | Link in Schritt 1 und auf /autoschluessel/marken vorhanden. |
| I-08 | Am Handy springt „Weiter“ zur Schrittüberschrift, am Desktop wie bisher an den Seitenanfang. Gilt für alle Abläufe. | Überschrift bei y = 136 statt 449; Desktop scrollY 0. |
| I-15 | Werkstattzeile „Werkstatt und Abholung: Langgasse 70, 35576 Wetzlar · Telefon“ auf der Startseite, im letzten Terminschritt über „Zahlungspflichtig buchen“, auf den Code-Produktseiten, im Warenkorb bei Abholung und in der Kasse. Die Kasse nennt die Zahlarten, sobald Stripe eingerichtet ist. | Langgasse auf allen fünf Stellen sichtbar; ohne Stripe keine Zahlartenzeile. |
| I-17 | Wetzlar in den Titeln der Startseite und der acht Autoschlüssel-Seiten, „Werkstatt in Wetzlar (Mittelhessen)“ in den Beschreibungen, Ort und Anreise in den Unterzeilen von Startseite und /autoschluessel. Fahrzeugöffnung bewusst ausgelassen (Einsatzort nicht belegt). | Alle Titel ≤ 60 Zeichen ohne Marke, Test `seitentexte.test.ts`. |
| I-21 | Die Vor-Ort-Seite nennt Platzhalter-Gebiete nicht mehr als Vor-Ort-Regionen (wie schon /standorte und die Sitemap). | Berlin bis Stuttgart nicht mehr auf der Seite. |

Zu beachten:
- **Bestehende Datenbank:** Seitentexte (`content/seo.json`) und Ratgeber (`content/guides.json`) übernimmt der Seed nur beim ersten Import. Ist die Produktions-Datenbank schon befüllt, die neuen Titel und Unterzeilen im Backend unter „Seitentexte“ und den Ratgeber-Link „Anfrage für Ersatzschlüssel starten“ auf `/autoschluessel/anfrage?vorhanden=0` setzen.
- **Startseiten-Titel:** Die Marke steht jetzt hinten („… in Wetzlar | SCHLÜSSELMACHER24“), damit der Ort in den sichtbaren ersten 60 Zeichen bleibt. Wortlaut aller neuen Texte bitte freigeben.
- **Fahrzeugschein:** Ist heute nur im Browser Pflicht, nicht auf dem Server. Das war schon vorher so und ist unverändert.

### Leitfaden-Umsetzung (25.10.2026 abends, zweiter Pull Request)

Umgesetzt wurde alles aus beiden Leitfäden, was im Code machbar ist. Die Abschnitte 3 bis 8 bleiben als Grundlage stehen; diese Liste ersetzt den Status der offenen Zeilen aus Abschnitt 4.

| Bereich | Leitfaden | Stand |
|---|---|---|
| Foto-Freigabe: eingegangen → geprüft → freigegeben / Rückfrage / nicht möglich → Bestellung | Erg. §1, §2, §9; PL 07 | **umgesetzt.** Preis im Backend, Mail mit Zahlungslink (Stripe) und Einsendeanweisung, nach Zahlung „In Fertigung“ |
| „Partner werden“ mit Formular, Vermittlungsstatus bis „Provision abgerechnet“ | Erg. §6, §7, §9 | **umgesetzt.** Bewerbungen als Vorgang `SM24-N-…`, Vermittlung an jedem Vorgang |
| Wichtige Aktionen messen | Erg. §4, §9 | **umgesetzt.** Kennzahlen im Backend ohne Cookies; GA4 nur nach Einwilligung, sobald die Mess-ID gesetzt ist |
| Statusverlauf intern nachvollziehbar | Erg. §2 | **umgesetzt** |
| Termin-Erinnerungen | PL 17 | **umgesetzt.** Täglich, x Tage vorher, mit Kalenderdatei |
| Projektübersicht / Projektberichte als PDF, Produktionsansicht | PL 08, 11, 17 | **umgesetzt.** Vorgangsblatt und Produktionsliste zum Drucken bzw. Speichern als PDF |
| SEO je Seite pflegbar (Marken, Modelle) | PL 17 | **umgesetzt** |
| Backup und Wiederherstellung | PL 18 | **umgesetzt.** `scripts/sicherung.mjs` und Ablauf in `docs/LIVEGANG.md`; Aufbewahrung legt der Inhaber fest |
| 9 Bereiche in der Navigation, Handlungsaufforderung je Rubrik | PL 02; Erg. §2 | **umgesetzt** |
| Hauptseiten „Schlüssel nach Foto“, „Schlüssel einschicken“, „Sperrschließungen“ | Erg. §3 | **umgesetzt** |
| Kategorien Code → Anwendung → Produkt; Herstellerebene | Erg. §3 | **umgesetzt.** Herstellerebene erscheint automatisch mit den Herstellerdaten |
| Keine nahezu identischen Seiten | Erg. §3; PL 16 | **umgesetzt.** Code-, Marken- und Modellseiten aus den echten Daten; Textgleichheit Codeseiten 73 % → 56 %, Modelle 78 % → 68 % |
| Code-Suche | PL 08 | **umgesetzt.** Erkennt eingegebene Codes am Codeformat |
| Schwerpunkt Wetzlar, Anreise, Außeneinsatz nur nach Prüfung | Erg. §1 | **umgesetzt.** Werkstatt als Terminort in Ablauf, Mails und Kundenseite; PLZ-Hinweis; Seite `/standorte/wetzlar` |
| Vertrauensbasis Schlüssel Schmiede | Erg. §1 | **umgesetzt** (Startseite) |
| Keine künstlichen Städte | Erg. §5 | **umgesetzt.** Platzhalter-Städte im Papierkorb |
| ABUS/BKS-Konfiguratoren | Erg. §1 | **Struktur umgesetzt.** Herstellerschritt erscheint, sobald Hersteller mit Preisen im Backend gepflegt sind; Systemwahl ABUS/BKS im Projekt-Konfigurator |
| Anzahlung angerechnet, nie höher als der Preis; Fahrzeugtermin nur bei Bedarf | PL 05, 06 | **umgesetzt** |
| Unfertige Seiten schützen, Vorschauen noindex | Erg. §4 | **umgesetzt** |
| Fahrzeugschein Pflicht | PL 05 | **umgesetzt**, jetzt auch auf dem Server |

**Weiter offen, weil nur der Inhaber es liefern kann:**
- echte Fotos
- Hersteller, Profil und Codeserie der 52 Codelinien
- ABUS/BKS-Typen und -Preise
- Lieferzeiten je Versandart
- Fahrzeugöffnung als Notfall statt Termin (F-16)
- Endbetrag und Rechnung am Vorgang (F-09)
- Anwaltsprüfung der Rechtstexte und des Partnervertrags
- Search Console und Merchant Center nach dem Start

---

## 2 Hebelrechnung je Linie

### 2.1 Formeln

- **DB je Auftrag** = Preis brutto ÷ 1,19 − Material − Zahlungsgebühr. Für Stripe ist 1,5 % + 0,25 € auf den online gezahlten Betrag angesetzt (laut Sekundärquellen, auf stripe.com/de/pricing zu prüfen).
- **Wirkung einer Idee (€/Monat)** = betroffene Menge × Änderung der Quote × DB je Einheit. Bei Zeitersparnis: gesparte Minuten × Stundensatz (50–75 €/h).
- **Break-even je Monat** = Investition ÷ Laufzeit + 60 € Fixkosten (Vercel Pro und Supabase Pro laut `docs/LIVEGANG.md:9-15`, Resend Free).
- **Faktor-10-Ziel je Monat** = 10 × Investition ÷ Laufzeit:
  - 400 T€ ÷ 36 = **11.111 €**
  - 500 T€ ÷ 30 = **16.667 €**
  - 600 T€ ÷ 24 = **25.000 €**
- **Faktor** = zusätzlicher DB pro Monat × wirksame Monate ÷ Investition.
  - Wirksame Monate = Laufzeit − 3, weil die ersten 6 Monate nur etwa die halbe Wirkung bringen.
  - Kanalwechsel bestehender Kunden der Schlüssel Schmiede wird abgezogen (Annahme 20–30 %).
- **RICE** = Reichweite × €/Monat (Mitte) × Konfidenz ÷ Aufwand in Tagen.
  - Reichweite: 3 = Hauptlinie oder alle Linien, 2 = Nebenlinie, 1 = Nische oder Schutzmaßnahme.
  - Konfidenz: hoch 1,0, mittel 0,8, niedrig 0,5.

### 2.2 Gemeinsame Annahmen (Monatswerte im Jahr 2 nach dem Livegang)

| Größe | Spanne | Herkunft |
|---|---|---|
| Starts des Autoschlüssel-Assistenten | 150–500 | Annahme. Laut Gegenprüfung sind 50–300 im Jahr 1–2 realistischer. |
| Bezahlte Autoschlüssel-Termine | 15–40 (Abschluss 6–10 %) | Annahme |
| DB je Autoschlüssel-Termin | 100–250 € (Verlustfall 200–300 €) | Preise 49–649 € aus `content/service-pricing.json`, Material angenommen |
| Code-Bestellungen | 30–120, DB 5–12 € vor Arbeitszeit | `content/code-lines.json`: Mittelwert 10,42 €, Versand 4,95 € |
| Zylinder-Bestellungen | 5–20, DB 40–120 € | `content/cylinder-catalog.json`, Wareneinsatz angenommen |
| Fotoanfragen (Schlüssel nach Vorlage) | 10–40, machbar 50–70 %, DB 15–40 € | Annahme |
| Projektanfragen (Hausverwaltung/Gewerbe) | 2–6, Abschluss 20–40 %, DB 450–2.400 € | Annahme |
| Stundensatz des Inhabers | 50–75 €/h | Annahme |
| Anteil Handy | 60–75 % | Annahme |
| Wirkung von SEO-Maßnahmen | ab Monat 4–9 | Annahme |
| Entwicklung | 600–900 € je Tag | Annahme für die Paketkosten |

### 2.3 Autoschlüssel je Leistung

Quellen: Preise aus `content/service-pricing.json`, Anzahlung aus `content/settings.json:102`. Die Materialkosten sind Annahmen (A).

| Leistung (Gruppe) | Preis brutto | Termin | Fenster | Material (A) | DB je Auftrag | DB je Fensterstunde |
|---|---|---|---|---|---|---|
| Zweitschlüssel B | 249 € | 60 min | 1 | 25–70 € | 138–183 € | 160 € |
| Zweitschlüssel C | 399–649 € | 90 min | 2 | 60–200 € | 134–484 € | 154 € |
| Zweitschlüssel D (Prüfung) | 450–900 € | 120 min | 2 | 80–250 € | 127–675 € | 200 € |
| Programmierung B | 129 € | 45 min | 1 | 0–15 € | 92–107 € | 100 € |
| Programmierung C | 179–299 € | 60 min | 1 | 0–30 € | 119–250 € | 185 € |
| Ersatz bei Verlust B | 329–489 € | 90 min | 2 | 30–90 € | 185–380 € | 141 € |
| Ersatz bei Verlust C (Prüfung) | 450–800 € | 120 min | 2 | 60–220 € | 157–611 € | 192 € |
| Ersatz bei Verlust D (Prüfung) | 600–1.100 € | 150 min | 3 | 100–300 € | 203–823 € | 171 € |
| Bart fräsen B | 69 € (Anzahlung 69,90 €, Fehler) | 30 min | 1 | 3–10 € | 47–54 € | 50 € |
| Gehäuse/Tasten B | 79 € | 30 min | 1 | 8–25 € | 40–57 € | 49 € |
| Fahrzeugöffnung B | 129–229 € | 45 min | 1 | 0 € | 107–191 € | 149 € |
| **Mischung (A)** | **Ø 325 €** | Ø 69 min | **Ø 1,43** | | **119–295 € (Mitte 207 €)** | |

Hinweise zur Tabelle:
- Preisgruppe A (49–149 €) ist keinem Fahrzeug zugeordnet (`content/vehicles.json`). Alle Modelle laufen deshalb zu B-Preisen oder höher.
- Für die einheitliche Rechnung unten gilt ein DB je Termin von 100–250 € (Mitte 175 €).

### 2.4 Kapazität der Werkstatt (online buchbar)

Grundlage: `content/settings.json:29-134` und `src/lib/scheduling.ts:148-160`. Gemessen im Browser: „Mo 6 frei … Fr 3 frei“ (`[vw-bart-termin.png](belege/geschaeft--vw-bart-termin.jpg)`).

| Stand | Fenster/Woche | Fenster/Monat (× 3,9) | Aufträge/Monat (÷ 1,43) | DB-Obergrenze Autoschlüssel (100–250 €) |
|---|---|---|---|---|
| Heute | 27 (Mo–Do 6, Fr 3) | ≈ 105 | **≈ 74** | 7,4–18,5 T€ |
| Mit Fenster 12–13 Uhr (I-11) | 32 | ≈ 125 | ≈ 87 | 8,7–21,8 T€ |
| Zusätzlich Samstag (K-08, nur nach Entscheidung) | ≈ 38–39 | ≈ 150 | ≈ 105 | 10,5–26,3 T€ |

Ab etwa 55 Autoschlüssel-Aufträgen im Monat wird die Kapazität zum Engpass.

### 2.5 Weitere Linien

| Linie | Ø Auftrag (Quelle) | Kosten (A) | DB je Auftrag |
|---|---|---|---|
| Zylinder-Satz (Beispiel aus dem Leitfaden 30/35, 40/40, 55/30 + 2 Schlüssel) | 134,50 + 29,80 + 7,95 € = 172,25 € (`src/lib/pricing.ts:142-199`) | Wareneinsatz 45–60 % netto, Paket 6 € | 53–74 € |
| Code-Schlüssel, 1 × 8 € | 12,95 € inkl. 4,95 € Versand (Versand = 38 % des Warenkorbs) | Rohling 0,80–2,50 €, Porto 3,30–4,15 €, Umschlag 0,30 €, Stripe 0,44 € | **3,49–5,84 € vor Arbeitszeit; nach 6–15 min Arbeit null oder negativ** |
| Code-Schlüssel, 3 × 7,20 € (Staffel) | 26,55 € | wie oben | 12–15 € vor Arbeitszeit |
| Schlüssel nach Vorlage | 15–40 € | Rohling, Versand, ca. 7 min Prüfung | 8–20 € (Mitte 12 €) |
| Projekt Schließanlage/Zutritt/Sicherheit | 1.500–8.000 € | Material und Montage, DB-Quote 25–40 % | 450–2.400 € (konservative Mitte 1.000 €) |
| Partnerprovision (noch nicht vorhanden) | 10–15 % auf 250–450 € | 15–30 min Vermittlung | brutto 20–50 €, netto 10–30 € |

Porto: 2026 Einschreiben Einwurf 3,30 € (Standardbrief) bzw. 4,15 € (Großbrief). 2027 voraussichtlich +0,55 € (briefmarkenmesse-essen.de, zdfheute.de 12.10.2026).

### 2.6 Basis-DB über die Seite (ohne neue Hebel)

| Linie | Menge pro Monat | DB je Einheit | DB pro Monat |
|---|---|---|---|
| Autoschlüssel | 15–40 Termine | 100–250 € | 1.500–10.000 € |
| Code-Shop | 30–120 Bestellungen | 5–12 € | 150–1.440 € |
| Zylinder | 5–20 Bestellungen | 40–120 € | 200–2.400 € |
| Schlüssel nach Vorlage | 10–40 Anfragen × 50–70 % machbar | 15–40 € | 75–1.120 € |
| Projekte | 2–6 Anfragen × 20–40 % Abschluss | 450–2.400 € | 180–5.760 € |
| Partnerprovision | 0 (gibt es noch nicht) | – | 0 € |
| **Summe** | | | **2,1–20,7 T€; Mitte (Menge-Mitte × DB-Mitte) ≈ 8,6 T€** |

Liegen die Assistent-Starts eher bei 50–300, sinkt der Autoschlüssel-Anteil um etwa 40 %.

### 2.7 Break-even: Aufträge pro Monat, wenn eine Linie die Kosten allein trägt

Angegeben ist der Wert mit DB-Mitte, in Klammern die Spanne.

| Linie (DB-Mitte) | 40 T€ / 36 Mon. (1.171 €/Mon.) | 40 T€ / 24 Mon. bzw. 60 T€ / 36 Mon. (1.727 €) | 60 T€ / 24 Mon. (2.560 €) |
|---|---|---|---|
| Autoschlüssel (175 €) | 7 (5–12) | 10 (7–17) | 15 (10–26) |
| Zylinder (80 €) | 15 (10–29) | 22 (14–43) | 32 (21–64) |
| Code-Shop (8 €) | 146 (98–234) | 216 (144–345) | 320 (213–512) |
| Projekt (1.000 €) | 1,2 (0,5–2,6) | 1,7 (0,7–3,8) | 2,6 (1,1–5,7) |
| Vorlage (25 €) | 47 | 69 | 102 |
| Partner netto (20 €) | 59 | 86 | 128 |

Lesart: Für den Break-even reichen 7–15 zusätzliche Autoschlüssel-Termine oder 1–3 Projekte im Monat. Der Code-Shop trägt die Kosten allein nicht.

### 2.8 Mengen für Faktor 10 (zusätzliche, nicht verlagerte Aufträge pro Monat)

| Linie (DB-Mitte) | unten: 11,1 T€ (400 T€/36 Mon.) | Mitte: 16,7 T€ (500 T€/30 Mon.) | oben: 25 T€ (600 T€/24 Mon.) |
|---|---|---|---|
| Autoschlüssel (175 €) | 35 → 6.125 € | 51 → 8.925 € | 80 → 14.000 € |
| Projekte (1.000 €) | 3 → 3.000 € | 4 → 4.000 € | 6 → 6.000 € |
| Zylinder (80 €) | 15 → 1.200 € | 25 → 2.000 € | 35 → 2.800 € |
| Code-Shop (8 €) | 80 → 640 € | 150 → 1.200 € | 200 → 1.600 € |
| Vorlage (25 €) | 10 → 250 € | 20 → 500 € | 25 → 625 € |
| Partner netto (20 €) | 0 | 10 → 200 € | 35 → 700 € |
| **Summe** | **11.215 €** | **16.825 €** | **25.725 €** |
| Anteil Autoschlüssel | 55 % | 53 % | 54 % |
| Auslastung Online-Fenster (105 / mit 12-Uhr-Fenster 125) | 48 % / 40 % | 69 % / 58 % | **109 % / 91 %: nur mit I-11 und Samstag** |
| Mehrarbeit (A: 69 min je Termin, 12 h je Projekt, 20/8/15/20 min) | ≈ 94 h (0,6 VZÄ) | ≈ 143 h (0,9 VZÄ) | ≈ 220 h (1,4 VZÄ) |

Der DB ist hier vor Personalkosten gerechnet. Muss der Inhaber für die Mehrarbeit einstellen, sinkt der Nettoeffekt (Abschnitt 9).

---

## 3 Abfrageliste an den Inhaber

**A – Zahlen, die die Spannen ersetzen**

| Nr | Frage | wofür |
|---|---|---|
| F-01 | Autoschlüssel heute pro Monat, getrennt nach Zweitschlüssel, Programmierung, Ersatz bei Verlust, Bart, Gehäuse und Öffnung. Wie groß ist der Anteil Totalverlust? Wie viele Anfragen kommen von außerhalb Mittelhessens? Wie oft erscheinen Kunden nicht zum Termin? | Basis 2.6, I-01, I-07, I-50 |
| F-02 | Material- und Einkaufskosten je Leistung: Rohling, Transponder, Funk- und Smart-Key-Ersatz, Lizenz- oder Tokenkosten der Programmiergeräte. Ø Auftragswert der Prüffälle C und D? | DB je Termin |
| F-03 | Code-Shop: Kosten je Schlüssel (Rohling, Minuten für Fertigung und Verpackung, Versandart, Porto). Wie viele Bestellungen erwarten Sie? | I-37, Marge je Bestellung |
| F-04 | Einkaufspreise für ABUS/BKS-Gleichschließungen je Zylinder und Schlüssel. Wie viele Zylinder-Bestellungen erwarten Sie? | I-39, Zylinder-DB |
| F-05 | Hausverwaltung und Gewerbe: Anteil an Ihren Kunden, Zahl der Bestandsobjekte, Häufigkeit von Nachbestellungen, typischer Auftragswert, DB-Quote, Anteil der Anfragen, die zum Auftrag werden. | I-44–I-46, Faktor-10-Bedingung Projekte |
| F-06 | Schlüssel nach Vorlage: erwartete Anfragen, Prüfdauer, Anteil freigegebener Anfragen. | I-42, I-43 |
| F-07 | Wie viele freie Werkstattstunden pro Woche stehen für Online-Termine bereit? Gibt es Personal für Fertigung, Versand und Fotoprüfung? Faktor 10 bedeutet 90–220 h Mehrarbeit im Monat. | Kapazität, Abschnitt 9 |
| F-08 | Welchen Stundensatz sollen wir für Ihre Zeit ansetzen? Gerechnet ist mit 50–75 €/h. | alle Zeit-Hebel |
| F-09 | Mit welcher Buchhaltung rechnen Sie ab? Soll der Endbetrag am Vorgang gepflegt werden? | I-62, Nachweis des Faktors |

**B – Entscheidungen vor dem Livegang**

| Nr | Frage | wofür |
|---|---|---|
| F-10 | Wo finden Autoschlüssel-Termine statt? Nur in der Werkstatt Langgasse 70 oder auch beim Kunden in Wetzlar, Gießen und Lahn-Dill? Bis zu welchem Radius? Welcher Wortlaut soll im Termin-Schritt, in der Bestätigung und in den Mails stehen? | I-04, K-01 |
| F-11 | Dürfen Kunden mit Totalverlust ohne Schlüsselfotos anfragen, nur mit Fahrzeugschein und Berechtigungsnachweis? Ihr Ratgeber sagt bereits „falls es einen gibt“. | I-01 |
| F-12 | Dürfen die 6 Einsatzgebiete Berlin bis Stuttgart gelöscht werden? | I-21 |
| F-13 | Welche Öffnungszeiten gelten? SCHLÜSSELMACHER24 nennt Mo–Do 9–13 und 14–17 Uhr, Fr 9–13 Uhr. Die Schmiede nennt Mo–Sa 10–18 Uhr (Repo Mina-Saad, `lib/faqData.ts:164`). Ist 12–13 Uhr Werkstattzeit? Sind Samstagstermine möglich? | I-11, I-15, I-16, K-08 |
| F-14 | Dürfen Preise öffentlich auf den Seiten stehen (M-30)? Wie werden sie mit der Schmiede abgeglichen? Dort steht „Ersatzschlüssel ab 45 €“ und „Gehäusetausch ab 15“, hier „Zweitschlüssel ab 149 €“ und „Gehäuse 59 €“. Welche Fahrzeuge gehören in Gruppe A? | I-02, I-03, I-16 |
| F-15 | Bart fräsen B kostet 69,00 €, die Anzahlung beträgt 69,90 €. Soll die Anzahlung auf den Preis begrenzt werden, oder soll diese Leistung eine eigene Anzahlung bekommen? | I-12 |
| F-16 | Soll die Fahrzeugöffnung (Notfall) aus dem Terminablauf mit 7 Tagen Vorlauf herausgenommen werden? | Fehler 5.5 |
| F-17 | Was gilt für die Anzahlung bei Absage, Nichterscheinen oder abgelehntem Prüfpreis? (AGB §8(3), M-05) | K-05 |
| F-18 | Soll „Erweiterbar hinterlegen“ 15 € kosten oder kostenlos sein? Werden Schlüsselanhänger je Zylinder oder je Schlüssel berechnet? | I-35, Fehler 5.5 |
| F-19 | Sicherungskarte: Genügt ein Foto, oder muss das Original vorgelegt werden? Soll ZY-02 ein Kartenfoto verlangen? Wird nur an den Karteninhaber versandt? | I-44 |
| F-20 | Foto-Freigabe: Soll der Kunde danach online per Zahlungslink zahlen oder per Antwortmail bestellen? Bitte den Wortlaut der 4 Antwortvorlagen freigeben. | I-42, I-43 |
| F-21 | „Partner werden“: Soll die Seite zum Livegang online sein (Erg. §9 JETZT)? Wie hoch soll die Provision sein? Gibt es einen Partnervertrag? Kennen Sie 2–5 Betriebe für den Start? | I-49, I-50 |
| F-22 | Soll die Termin-Erinnerung 1 oder 2 Tage vorher kommen? Was gehört auf die Mitbringliste? | I-07, K-01 |
| F-23 | Darf SCHLÜSSELMACHER24 die Schlüssel Schmiede nennen und verlinken? Welche Rolle bekommt welche Domain? Soll das Google-Profil der Schmiede einen Termin-Link hierher bekommen? | I-15, I-16 |
| F-24 | Messung: Sind Sie mit einer anonymen, serverseitigen Zählung in der eigenen Datenbank einverstanden, nach Prüfung durch den Datenschutzberater? Darf die Search Console eingerichtet werden (`docs/LIVEGANG.md:157`)? | I-61, Nachweis |
| F-25 | Welche Zahlarten sollen in Stripe aktiv sein (Karte, Apple/Google Pay, Klarna, Banküberweisung)? PayPal wäre ein neues Konto und fällt deshalb aus dem Rahmen. | K-04 |
| F-26 | Welche Marken bedienen Sie außer den 12 gelisteten (Kia, Dacia, Peugeot, Citroën, Mazda, Volvo …) und in welcher Preisgruppe? | I-05 |
| F-27 | Darf Programmierung ohne Teilebedarf mit 2–3 Tagen Vorlauf buchbar sein? | I-10 |
| F-28 | Sind Gehäusetausch und Bart fräsen ohne Fahrzeug machbar? | Fehler 5.5 (Oder-Logik) |
| F-29 | Soll die Telefonnummer in der Kasse Pflichtfeld bleiben? Eine Änderung braucht eine Schemaänderung. | I-36 |
| F-30 | Bieten Sie einen Zusatzschlüssel im selben Termin an, und zu welchem Preis je Gruppe? Kopieren Sie beim Termin auch Haus- und Briefkastenschlüssel? | I-06, I-14 |

**C – Inhalte, die nur der Inhaber liefern kann**

| Nr | Frage | wofür |
|---|---|---|
| F-31 | Welche der 10 Fotomotive (Werkstatt mit Fräse, Fassade, Upload-Beispiele, Zylinder, Top-10-Codelinien) können Sie bis wann liefern? | I-18 |
| F-32 | Hersteller, Profil und Codeserie der 52 Codelinien (M-03). Dürfen die URLs vor dem Livegang umgestellt werden? | I-40, I-41 |
| F-33 | Modellspezifische Angaben (Generation, Rohling) für die wichtigsten Modelle. Ohne sie empfehlen wir noindex für die 49 Modellseiten. | I-22, I-23 |
| F-34 | Texte für Wetzlar, Gießen und Lahn-Dill: Anfahrt, typische Fälle, Radius. | I-20 |
| F-35 | Hausverwaltung und Gewerbe: Systeme, Leistungen, anonymisierte Beispiele. Ist das „Wartungskonzept“ auf der Service-Seite ein echtes Angebot? | I-46, I-30 |
| F-36 | Lieferzeit je Versandart (M-36). | I-33 |
| F-37 | Welche gleichschließenden Zusatzkomponenten von ABUS/BKS wollen Sie anbieten, und zu welchen Preisen? | I-39 |

---

## 4 Leitfaden-Abgleich (Soll/Ist, vollständig)

Quelle ist die Analyse „leitfaden“: 98 Anforderungen, davon 69 aus dem Projektleitfaden (Kap. 01–20) und 29 aus dem Ergänzenden Leitfaden (§1–9).

Drei Zeilen wurden nach den Messungen der anderen Analysen herabgestuft (mit „korrigiert“ markiert):
- **P02-a:** Die Kopfzeile zeigt nicht 5 + 4 Bereiche (`src/components/layout/site-header.tsx:108-116, :313`).
- **P05-c:** Die Fahrzeugpflicht greift auch bei Bart und Gehäuse, der Ort bleibt offen.
- **P06-c:** Bei Bart fräsen B ist die Anzahlung höher als der Gesamtpreis.

**Ergebnis: 53 erfüllt, 33 teilweise, 12 fehlen oder werden verletzt.**

| Nr | Anforderung (Quelle) | Status | Beleg | Aufwand Tage | Bemerkung / Idee |
|---|---|---|---|---|---|
| P01-a | 70/30-Schwerpunkt Autoschlüssel sichtbar (PL 01, 20) | erfüllt | Hero-H1 „Autoschlüssel nachmachen und programmieren“, home-d.png; Navigation beginnt mit Autoschlüssel (navigation.ts:36) | 0 | |
| P01-b | Jede Hauptleistung mit klarem Prozess (PL 01, 15) | erfüllt | Startseiten-Kacheln mit Prozess-Label (s1.json) | 0 | |
| P01-c | Hochwertig, technisch, keine Notdienst-Optik (PL 01, 03) | erfüllt | home-d.png, KERN K-001 | 0 | |
| P02-a | Hauptnavigation mit 9 Bereichen (PL 02) | **teilweise (korrigiert)** | navigation.ts:36-254 hat 9 Bereiche. Gemessen: ab 1280 px 4 im Balken + „Mehr“, bei 1024–1279 px nur 2 + „Mehr“; Zylinder überall nur unter „Mehr“ (Messskript 08-breiten.cjs, nav-desktop-mehr.png) | 0,5 | I-29 |
| P02-b | Pflichtlinks im Fußbereich (PL 02, 18) | erfüllt | Impressum, Datenschutz, Widerruf, Vertrag widerrufen, Zahlung und Versand, AGB, Cookie-Einstellungen | 0 | |
| P02-c | Rechtstexte vor dem Livegang juristisch prüfen (PL 02, 18) | teilweise | Entwürfe, MENSCHEN.md M-05 | – | Anwalt |
| P03-a | Hero mit Hauptknopf zum Terminstart (PL 03) | erfüllt | „Autoschlüssel-Termin starten“ (home-d/m.png) | 0 | Wortlaut weicht leicht ab |
| P03-b | Schnelleinstiege, Vertrauen, Prozess, Shop-Teaser, Projekte, Ratgeber (PL 03) | erfüllt | s2: 8 Kacheln, „Warum wir“, 5 Schritte, „Bestellen ohne Termin“ | 0 | |
| P03-c | Echte Produkt- und Werkstattfotos statt Stockbilder (PL 03, Erg. §5) | teilweise | /api/medien totalDocs 0; Zeichnungen statt Fotos (M-01) | 0,5 | I-18 |
| P04-a | 10 Leistungsbegriffe KFZ und Unterseiten (PL 04) | erfüllt | 7 Seiten /autoschluessel/*, Ratgeber „verloren“ | 0 | |
| P04-b | Marken- und Modellseiten mit echtem Mehrwert (PL 04, 16) | teilweise | 12 Marken und 49 Modelle in der Sitemap; Daten ungeprüft (UMSETZUNG.md 9.4); Textgleichheit 0,94–1,00 | – | I-22, I-23 |
| P05-a | 13-Schritte-Assistent mit Baujahr/EZ und Motorisierung (PL 05) | erfüllt | assistent.tsx:69-143, :1019, :1034; gemessen „Schritt 1 von 13“ | 0 | auch FIN |
| P05-b | Kamera-Upload und Galerie, Beispielbilder am Upload (PL 05) | teilweise | capture=environment (photo-upload.tsx:420); Beispielbilder nur gezeichnet | – | I-18 |
| P05-c | Vor-Ort-Termin automatisch, wenn Fahrzeugzugriff nötig ist (PL 05) | **teilweise (korrigiert)** | requiresVehicleOnSite (pricing.ts:59-60). Die Oder-Logik und 49/49 Modelle mit Fahrzeugpflicht machen auch Bart und Gehäuse zum Fahrzeugtermin. Ort bleibt offen (termin-auswahl.tsx:203-205), Kundenseite zeigt „Vor Ort bei Ihnen“ (bestellung/[id]/page.tsx:251-253) | 0,5 | I-04, K-01, Fehlerticket Oder-Logik |
| P06-a | Vorlauf 7–8 Tage, im Backend änderbar (PL 06) | erfüllt | settings.json:101; Preisregeln.ts:86 | 0 | I-10 staffelt je Leistung |
| P06-b | Anzahlung 69,90 €, je Leistung 50–80 € (PL 06) | erfüllt | settings.json:102-104; Preisregeln.ts:81 | 0 | |
| P06-c | Anrechnung; Gesamtpreis, Anzahlung und Restbetrag (PL 06) | **teilweise (korrigiert)** | preis-anzeige.tsx:54 vorhanden, aber Bart fräsen B: Anzahlung 69,90 € > Preis 69,00 €, Rest 0,00 € ([vw-bart-preis.png](belege/geschaeft--vw-bart-preis.jpg); pricing.ts:79, :93-95) | 0,25 | I-12 nach F-15 |
| P06-d | Preisrahmen oder Prüfung vor verbindlicher Buchung (PL 06) | erfüllt | Preisregeln.ts:53-63; preis-anzeige.tsx:96-100 | 0 | |
| P06-e | Terminlänge je Leistung oder Gruppe (PL 06) | erfüllt | Preisregeln.ts:85 | 0 | |
| P06-f | Sperrtage pflegbar (PL 06) | erfüllt | Sammlung Sperrtage; scheduling.ts:135-160 | 0 | |
| P06-g | Online-Zahlung erweiterbar, Bestätigung nach Zahlung (PL 06) | erfüllt | Stripe, PAYMENT_METHODS (LIVEGANG.md §4); Mailvorlage zahlung.ts | 0 | heute nur Karte (K-04) |
| P06-h | Rechnung bzw. Zahlungsbeleg am Auftrag (PL 06) | teilweise | Vorgaenge.ts:404-461; CSV vorgaenge-csv.ts:15-27; Stripe-Rechnung nicht verknüpft (stripe.ts:164) | 0,75 | I-62 |
| P06-i | Werte nicht im Quellcode (PL 06) | erfüllt | Preisregeln, Einstellungen, Zylinderkatalog in Payload | 0 | |
| P07-a | Schlüssel nach Vorlage in 8 Schritten (PL 07) | erfüllt | anfrage-formular.tsx:29-75 | 0 | |
| P07-b | Machbarkeit, Preis und Einsendeanweisung nach der Prüfung (PL 07) | teilweise | versprochen in anfrage-formular.tsx:437-458; nur manuell per Nachricht | 0,5 | I-42, I-43 |
| P07-c | Hinweis: kopierter Bart ersetzt keinen Transponder (PL 07) | erfüllt | 5× „Transponder“ in schluessel-nach-vorlage/page.tsx | 0 | |
| P08-a | 50–52 Codelinien mit eigener Produktseite (PL 08) | erfüllt | 52 Links im HTML, 52 URLs in der Sitemap | 0 | |
| P08-b | Beispielbilder zur Codefundstelle (PL 08) | teilweise | allgemeine Zeichnung CodeFundstelleInteraktiv | – | Fotos je Linie fehlen (I-18) |
| P08-c | Code-Eingabe mit Plausibilitätsprüfung (PL 08) | erfüllt | codePattern (code-lines.json), code-pattern.ts | 0 | |
| P08-d | Foto-Upload je Linie optional oder Pflicht (PL 08) | erfüllt | Feld photoUpload | 0 | ZY-02 auf Pflicht (I-44) |
| P08-e | Hersteller, Anwendung, Codeformat, Lieferumfang, Stückzahl (PL 08) | teilweise | [slug]/page.tsx:69-78; Hersteller 52× Platzhalter (M-03) | – | Daten (F-32) |
| P08-f | Bezahlen, Bestätigung, interne Produktionsansicht (PL 08) | teilweise | Ansicht 2.033 px für 1 Artikel (admin-vorgang-2.png) | 1 | I-53, I-56 |
| P08-g | Suche und Filter nach Hersteller, Typ, Codelinie, Anwendung (PL 08) | teilweise | gemessen: Suche, Schlüsseltyp, Anwendungsfamilie; Herstellerfilter ausgeblendet (shop-liste.tsx:146); Suche „4711“ ergibt 0 Treffer | 0,5 | I-31; Herstellerfilter kommt mit den Daten |
| P08-h | Produktpflege ohne Programmierer (PL 08) | erfüllt | Sammlung Produkte (60) | 0 | |
| P08-i | Status von neu bis abgeschlossen (PL 08) | erfüllt | Vorgaenge.ts:9-19 | 0 | |
| P08-j | Versandart und Sendungsverfolgung je Produktklasse (PL 08) | erfüllt | settings.json shipping.productClasses; status.ts:29-47 | 0 | |
| P09-a | Zylinderart, Maße, Funktion, Menge, Schlüssel, Schutz, Erweiterung (PL 09) | erfüllt | cylinder-catalog.json; konfigurator.tsx:59-91 | 0 | „Erweiterbar“ ohne Option (I-35) |
| P09-b | Bauformen und Zusatzkomponenten je Hersteller (PL 09) | fehlt | Zylinderkatalog.ts:8-10 (feste Auswahl), kein Hersteller | 3 | I-39, Migration |
| P09-c | Maßzeichnung, Bauformen unterscheidbar, Plausibilität (PL 09) | erfüllt | Generator zylinder-mass, cylinder-rules.ts | 0 | |
| P10 | Gleichschließung, Z, HS, GHS, erweiterbar erklärt; Info-Symbol mit Grafik (PL 10) | erfüllt | system-erklaerung.tsx, schliessplan-interaktiv.tsx | 0 | |
| P11-a | 10 Frageblöcke Projektplanung (PL 11) | erfüllt | projekt-konfigurator.tsx:186-246 | 0 | |
| P11-b | Zusammenfassung vor dem Absenden (PL 11) | erfüllt | projekt-konfigurator.tsx:248, :452 | 0 | |
| P11-c | Projektübersicht als PDF oder interne Zusammenfassung (PL 11) | teilweise | Vorgaenge.ts:187-209; kein PDF/Druck; 9.152 px (50-projekt-detail.png) | 1 | I-56 |
| P12 | Zutritt als Hauptkategorie, Konfigurator mit 8 Abfragen (PL 12) | erfüllt | zutritt-konfigurator.tsx:372-410 | 0 | |
| P13 | Tür- und Schließtechnik als eigener Bereich (PL 13) | erfüllt | navigation.ts:192-206; 17 Leistungsseiten | 0 | Seiten dünn (125–198 Wörter) |
| P14-a | Sicherheitstechnik und geführter Sicherheitscheck (PL 14) | erfüllt | sicherheitscheck.tsx:227-281 | 0 | |
| P14-b | Rechtshinweise zu Video und Audio (PL 14) | teilweise | vorhanden, Prüfung offen (M-18) | – | Anwalt |
| P15 | Vier Prozesse mit einheitlicher Bedienung (PL 15) | erfüllt | FlowShell/useFlow (UMSETZUNG.md §2) | 0 | |
| P16-a | Leistungscluster (PL 16) | erfüllt | sitemap mit 168 URLs | 0 | |
| P16-b | Stadtseiten mit lokalem Mehrwert (PL 16) | fehlt | 6 Großstädte mit Platzhaltern (cities.json), noindex; /standorte/wetzlar 404 | 0,5 | I-20 (Texte vom Inhaber) |
| P16-c | Ratgeberseiten (PL 16) | erfüllt | 8 Ratgeber | 0 | dünn: 127–220 Wörter (I-26) |
| P16-d | Keine dünnen Massenkopien (PL 16) | teilweise | Codeseiten 90,6–96 % und Modellseiten 94–100 % wortgleich | 2 | I-22, I-40, I-41 |
| P17-a | Zentrale Vorgänge, Uploads am Vorgang (PL 17) | erfüllt | Vorgaenge.ts:86-113, :211-218 | 0 | Fotos nur als Dateinamen (I-55) |
| P17-b | Status und Filter je Bereich, interne Notizen (PL 17) | erfüllt | Vorgaenge.ts:507-516; admin-vorgaenge.png | 0 | I-52 |
| P17-c | Preise flexibel (PL 17) | erfüllt | siehe P06 | 0 | |
| P17-d | Termine verschieben, sperren, Auslastung steuern (PL 17) | erfüllt | TerminVerschieben; Sperrtage; slotsPerWindow (settings.json:107) | 0 | I-57 |
| P17-e | Erinnerungen versenden (PL 17) | fehlt | grep erinner/reminder: 0; Crons ohne Erinnerung (vercel.json) | 1 | I-07 |
| P17-f | Code- und Zylinderprodukte pflegbar (PL 17) | erfüllt | Produkte, Zylinderkatalog | 0 | |
| P17-g | Projektberichte als PDF oder intern (PL 17) | teilweise | siehe P11-c | 1 | I-56 |
| P17-h | SEO je Seite pflegbar (PL 17) | teilweise | seoFeld (gemeinsam.ts:186-219) in 5 Sammlungen; 61 Fahrzeugseiten ohne (Fahrzeugmarken.ts) | 1 | I-23, Migration |
| P17-i | Schnittstellen später möglich (PL 17) | erfüllt | Payload REST/GraphQL, CSV | 0 | |
| P17-j | Mobile zuerst, Fortschritt, Zwischenspeicherung (PL 17) | erfüllt | „Schritt 1 von 13“; client-state.ts:43-66 | 0 | I-08, I-09 |
| P18-a | HTTPS, geschützter Upload, Zugriff nur für das Team (PL 18) | erfüllt | Kundendateien.ts:20-23; datei-pruefung.ts; privater Bucket | 0 | |
| P18-b | Speicherfristen (PL 18) | erfüllt | Einstellungen.ts:321-323; Cron taeglich | 0 | |
| P18-c | Cookie- und Tracking-Konzept (PL 18) | erfüllt | cookie-einstellungen.tsx | 0 | |
| P18-d | Backup und Wiederherstellung (PL 18) | umgesetzt | nächtliche Sicherung von Datenbank und Dateien mit Probe-Wiederherstellung (`.github/workflows/sicherung.yml`, docs/SUPABASE.md); Free-Plan ohne Supabase-Backups | 0,75 | I-58 |
| P18-e | Spamschutz (PL 18) | erfüllt | formular-schutz.ts, rate-limit.ts | 0 | |
| P19 | MVP-Kernprozesse durchspielbar (PL 19) | erfüllt | Bestellungen SM24-B-2026-0001/0002 in der DB | 0 | |
| P20 | Abnahmeziel Kurzbriefing (PL 20) | teilweise | bis auf die genannten Lücken | – | |
| E1-a | 50–55 Codeangebote nach Hersteller, Profil und Codeserie (§1) | teilweise | 52 Linien nach Anwendungsfamilie, Hersteller fehlen (M-03) | – | F-32, I-40 |
| E1-b | Foto prüfen, dann Freigabe, Rückfrage oder Absage, erst danach Bestellung (§1) | teilweise | siehe E2-b | 2,5 | I-43 |
| E1-c | Schwerpunkt Wetzlar, Anreise möglich, Außeneinsatz nur nach Prüfung (§1) | fehlt | kein Wetzlar und keine Anreise im Seiten-Code; termin-auswahl.tsx:203-205; PLZ 20095 läuft bis „Zahlungspflichtig buchen“ ohne Hinweis ([assistent_termin_hh.png](belege/partner--assistent_termin_hh.jpg)) | 0,5 | I-04, I-15, I-17 |
| E1-d | Konfiguratoren ABUS bzw. ABUS/BKS (§1) | fehlt | 0 Treffer ABUS/BKS | 3 | I-39 |
| E1-e | Vertrauen: echte Schlüssel Schmiede in Wetzlar (§1) | teilweise | Wetzlar nur in der Adresse; „Schmiede“ 0× | 0,25 | I-15, I-16 |
| E2-a | Eindeutige Handlungsaufforderungen je Rubrik (§2) | teilweise | navigation.ts:41-146; 7 von 9 Rubriken eindeutig | 0,25 | I-28 |
| E2-b | Statusfluss Fotoanfrage bis zur Bestellung (§2) | teilweise | Vorgaenge.ts:9-19 ohne freigegeben/nicht möglich; status.ts:11 | 2,5 | I-43, Zwischenlösung I-42 |
| E2-c | Prüfung nicht mit Zusage verwechselbar (§2) | erfüllt | anfrage-formular.tsx:405-409, :445-451 | 0 | |
| E2-d | Einfache Formulare und Uploads am Handy (§2) | erfüllt | home-m.png, mobile Aktionsleiste | 0 | Kopf frisst Bildschirm (I-08) |
| E3-a | Dauerhafte URL mit Hersteller und Codeserie (§3) | teilweise | /schluessel-nach-code/ms-01 | 1–2 | I-40, vor dem Livegang ohne Weiterleitungen |
| E3-b | Je Angebot Title, H1, eigene Beschreibung, echte Bilder, Preis, Versand (§3) | teilweise | Title, H1, Preis und Versand vorhanden; Meta klein geschrieben (M-17); keine Fotos; 90–96 % gleich | – | I-41, I-18 |
| E3-c | Kategorien: Code → Hersteller/Typ → Produkt (§3) | teilweise | nur Anker (shop-liste.tsx:318-351); Produkte als Links erreichbar | 1,5 | I-40 |
| E3-d | Hauptseiten Foto, Einschicken, Autoschlüssel, Sperrschließung, Schließanlagen (§3) | teilweise | „Sperrschließung“ 0 Treffer; „Einschicken“ ohne eigene Seite | 0,1–1 | I-38 |
| E4-a | Mobile-first, Ladezeit, HTTPS, barrierearm (§4) | erfüllt | KERN.md-Budgets; axe 9/10 Kernseiten ohne Verstoß; LCP 0,58–0,79 s gedrosselt (Messlauf a11y-perf.json) | 0 | dl-Fehler auf /service-und-termin/kontakt |
| E4-b | Sprechende URLs, Titles, Meta, Überschriften (§4) | erfüllt | s1.json | 0 | koda/m-gane (I-24); Titel zu lang (93/169) |
| E4-c | Sitemap, robots, Canonical, interne Links (§4) | erfüllt | sitemap.ts, robots.ts, Canonical auf jeder Seite | 0 | |
| E4-d | Produkt-Strukturdaten zutreffend (§4) | erfüllt | json-ld.tsx:152-170 | 0 | ohne Bild und Versanddetails |
| E4-e | Unfertige Seiten vor Suchmaschinen schützen (§4) | teilweise | Städte noindex; /artikel mit Beispielartikeln indexiert | 0,25 | I-27, I-22, I-41 |
| E4-f | Search Console, Merchant Center (§4) | teilweise | Search Console in LIVEGANG.md:157; Merchant Center fehlt | – | nach dem Start; Merchant Center erst mit Fotos |
| E4-g | Wichtige Aktionen messen (§4) | fehlt | keine Messung im Code | 1,5 | I-59, I-60, I-61 |
| E5-a | Echte Fotos, Angaben zu Verfahren, Versand, Erreichbarkeit (§5) | teilweise | Medien 0; keine Lieferzeit auf der Produktseite (M-36) | – | I-18, I-33 |
| E5-b | Keine künstlichen Städte; regional und bundesweit getrennt (§5) | fehlt (verletzt) | vor-ort/page.tsx:161-180 listet 6 Großstädte, index,follow ([vor-ort-regionen-d.png](belege/leitfaden--vor-ort-regionen-d.jpg)) | 0,25 | I-21, Pflicht vor dem Livegang |
| E6 | Bundesweite Vermittlung an Partner (§6) | fehlt | – | – | mittelfristig, I-50 bedingt |
| E7-a | Infoseite und Bewerbungsformular „Partner werden“ (§7) | fehlt | /partner-werden 404 | 0,6 | I-49 |
| E7-b | Partner-Auftragsstatus bis „Provision abgerechnet“ (§7) | fehlt | kein Status in Vorgaenge.ts | 1 | I-50 bedingt, anfangs manuell über Notizen |
| E7-c | Partnerprüfung: Gewerbe, Eignung, Identität (§7) | fehlt | – | – | organisatorisch |
| E8-a | Datenschutz für Anfragen und Fotos (§8) | erfüllt | Löschfristen, privater Bucket, Entwurf der Datenschutzerklärung | 0 | |
| E8-b | Partnervertrag, Kundeninfo zum ausführenden Betrieb (§8) | fehlt | – | – | juristisch, vor der ersten Vermittlung |
| E9 | JETZT: Freigabe, Partnerseite, 55 SEO-Produktseiten; ZUM START: Messung (§9) | teilweise | Abläufe und Konfiguratoren erfüllt; Freigabe, Partner und Messung offen | – | I-43, I-49, I-40, I-59–I-61 |

---

## 5 Kundenwege

### 5.1 Persona-Messungen

Gemessen auf localhost:3100, Desktop 1280×900 und Handy 390×844 mit Touch. Die wichtigsten Screenshots liegen verkleinert unter `docs/wert/belege/`; Bildnamen ohne Link stammen aus dem lokalen Messlauf.

Zeitmodell:
- 3 s je Klick
- 0,3 s je Zeichen
- 1,5 s je Bildschirmhöhe Scrollweg
- 20 s je Upload

„tech“ ist die gemessene Laufzeit der Automatisierung, also eine Untergrenze.

| # | Persona | Gerät | Klicks bis 1. Preis / bis Absendeknopf | Sekunden (Modell · tech) | Ergebnis | Größtes Hindernis (Screenshot) |
|---|---|---|---|---|---|---|
| 1 | VW Golf 7, Schlüssel verloren | Desktop | **Sackgasse nach 15**; nur mit Ersatzfotos 33 / 40 (+60 Zeichen, 4 Uploads) | 45 s bis zur Sackgasse (197 / 218 s) · 5,8 s | „Weiter“ gesperrt, kein Preis (Rahmen 329–489 € erst dahinter) | 3 Pflichtfotos trotz „Kein funktionierender Schlüssel“ (p-p1-desktop-fotoschritt.png) |
| 1 | dto. | Handy | **Sackgasse nach 15** (33 / 40) | 45 s (197 / 218 s) · 5,4 s | Sackgasse | dto.; nur 2–3 Optionen je Schritt sichtbar (p-p1-handy-fotoschritt.png, p-handy-schritt2.png) |
| 2 | BMW 3er Zweitschlüssel | Desktop | 35 / 42 (+60 Zeichen, 4 Uploads, 5,7 Bildschirme) | 212 / 233 s · 11,3 / 13,7 s | 399–649 €, 1 Std. 30 Min., frühester Termin Mo 2.11.2026, „Zahlungspflichtig buchen“ | Modellseite nennt nur die Anzahlung 69,90 €; Preis erst in Schritt 11 (p-p2-desktop-modellseite.png, p-p2-desktop-preis.png) |
| 2 | dto. | Handy | 36 / 43 (10,8 Bildschirme) | 222 / 243 s · 13,1 / 15,5 s | wie Desktop | Modellseite 6.759 px ohne Preis (p-p2-handy-modellseite.png) |
| 3 | Hausverwaltung, 12 gleichschließende Zylinder | Desktop | 2 („ab 39 €“) / 36 bis Warenkorb / 47 bis Absenden (+72 Zeichen) | 6 / 108 / 163 s · 0,9 / 11,4 / 13,9 s | Erfolg: 4 Positionen, 12 Stück = 492 € + 7,95 € | Zylinder nur über Startseitenkarte oder „Mehr“; 9 Stepper-Klicks (p-p3-desktop-positionen.png) |
| 3 | dto. | Handy | 2 / 36 / 47 | 7 / 109 / 164 s · 0,9 / 10,1 / 12,6 s | Erfolg, Summe fest unten | Schnelleinstieg erst nach 0,6 Bildschirmen (p-p3-handy-konfig-start.png) |
| 4 | Möbelschlüssel nach Code | Desktop | 2 (8,00 €) / 4 bis Warenkorb / 16 bis Absenden (+98 Zeichen) | 11 / 23 / 81 s · 2,2 / 3,1 / 6,0 s | Erfolg | Suche nach dem Code „4711“ ergibt „0 von 52“; erster Bildschirm ohne Eingabe und ohne Knopf (p-p4-desktop-suche-code.png) |
| 4 | dto. | Handy | 2 / 4 / 16 | 11 / 22 / 82 s · 2,1 / 3,1 / 6,1 s | Erfolg | einziger Link im ersten Bildschirm führt zur Vorlage (seite-schluessel-nach-code-handy.png) |
| 5 | Gewerbe, Schließanlage mit 40 Türen | Desktop | kein Preis (Projekt) / 81 bis „Projekt absenden“ (+313 Zeichen, 11 Schritte) | 337 s · 18,1 s | Erfolg, Zusammenfassung schlägt HS vor | Türen und Gruppen müssen getippt werden, Türliste erst in Schritt 9 (p-p5-desktop-s05.png) |
| 5 | dto. | Handy | – / 82 | 340 s · 18,1 s | Erfolg | dto. (p-p5-handy-s05.png) |
| 6 | Arztpraxis, Zutritt für 8 Mitarbeitende | Desktop | kein Preis / 26 (+48 Zeichen, 9 Schritte) | 92 s · 9,1 s | Erfolg | Bereich nur unter „Mehr“; Einstieg „Bedarf erfassen“, Abschluss „Projekt absenden“ (p-p6-desktop-abschluss.png) |
| 6 | dto. | Handy | – / 26 | 92 s · 9,7 s | Erfolg | – (p-p6-handy-abschluss.png) |
| 7 | Sicherungskarte, Schlüssel nachbestellen | Desktop | über Schließanlagen: **Sackgasse nach 2**; über die Code-Suche „Sicherungskarte“: 2 (29 €) / 4 bis Warenkorb | 6 s · 10 / 22 s | Teilerfolg: ZY-02 ohne Kartennachweis bestellbar | „nachbestellen“ und „Sicherungskarte“ weder auf der Startseite noch in der Navigation (p-p7-desktop-schliessanlagen.png, p-p7-desktop-zy02.png) |
| 7 | dto. | Handy | Sackgasse nach 2 · 2 / 4 | 6 s · 10 / 21 s | wie Desktop | dto. (p-p7-handy-schliessanlagen.png) |

Auf keiner Seite und in keinem Ablauf gab es horizontalen Überlauf (0 px) oder JS-Fehler.

### 5.2 Wichtigste Hindernisse

| Rang | Hindernis | Beleg (Screenshot / Code) | Idee |
|---|---|---|---|
| 1 | Totalverlust endet in Schritt 8. Der Ausweg über den Ratgeber führt zurück in denselben Assistenten. | [p-p1-desktop-fotoschritt.png](belege/kundenwege--p-p1-desktop-fotoschritt.jpg); Gegenprüfung [handy-verlust-fotoschritt.png](belege/skeptiker1--handy-verlust-fotoschritt.jpg); assistent.tsx:408-411, :114; content/guides.json:23 | I-01 |
| 2 | Der Preis kommt erst in Schritt 11. Landing- und Modellseiten nennen nur die Anzahlung von 69,90 €. | [p-p2-desktop-modellseite.png](belege/kundenwege--p-p2-desktop-modellseite.jpg), p-p2-desktop-preis.png; assistent.tsx:519-528 | I-02, I-03 (schmal) |
| 3 | Der Terminort fehlt vor und nach der Anzahlung. | [assistent_termin_hh.png](belege/partner--assistent_termin_hh.jpg); [p-p1-desktop-termin.png](belege/kundenwege--p-p1-desktop-termin.jpg); [bestaetigung-handy.png](belege/vollst--bestaetigung-handy.jpg); [terminstatus-ort-handy.png](belege/vollst--terminstatus-ort-handy.jpg) | I-04, I-15, K-01 |
| 4 | Für eine Marke außerhalb der 12 gibt es keinen Weg. Die Markenseite verspricht einen. | [anfrage-schritt1-mobil.png](belege/geschaeft--anfrage-schritt1-mobil.jpg); marken/page.tsx:157-160 | I-05 |
| 5 | Am Handy steht die Schrittüberschrift bei y=449 von 844 px; sichtbar sind 2 von 7 Optionen. | [p-handy-schritt2.png](belege/kundenwege--p-handy-schritt2.jpg); Vorschlag [handy-schritt2-vorschlag.png](belege/skep2-d--handy-schritt2-vorschlag.jpg) (y=137, 5 von 7) | I-08 |
| 6 | Die Code-Suche erkennt keine Codes. Der Kaufknopf liegt auf dem Handy bei y=2321. | [p-p4-handy-suche-code.png](belege/kundenwege--p-p4-handy-suche-code.jpg); [handy-code-produkt-fold.png](belege/conversion--handy-code-produkt-fold.jpg) | I-31, I-32 |
| 7 | Zur Sicherungskarte gibt es keinen Nachbestellweg, und ZY-02 ist ohne Kartennachweis bestellbar. | [p-p7-desktop-schliessanlagen.png](belege/kundenwege--p-p7-desktop-schliessanlagen.jpg), p-p7-desktop-zy02.png | I-44 |
| 8 | Eine indexierte Seite nennt falsche Einsatzgebiete. | [vor-ort-regionen-d.png](belege/leitfaden--vor-ort-regionen-d.jpg); [vor-ort-regionen-mobil.png](belege/sichtbarkeit--vor-ort-regionen-mobil.jpg); [standort-berlin-mobil.png](belege/sichtbarkeit--standort-berlin-mobil.jpg) | I-21 |
| 9 | Der Zylinder-Shop steht nur unter „Mehr“. | [nav-desktop-mehr.png](belege/kundenwege--nav-desktop-mehr.jpg) | I-29 |
| 10 | Eine Großanlage braucht 81 Klicks, die Türliste kommt erst in Schritt 9. | [p-p5-desktop-s05.png](belege/kundenwege--p-p5-desktop-s05.jpg) | I-48 |

### 5.3 Nach der Buchung

Diese Strecke hatte keine der Analysen geprüft. Gemessen wurde sie in der Vollständigkeitsprüfung mit dem Vorgang SM24-T-2026-0002.

- Die Bestätigung sagt: „den Ort stimmen wir mit Ihnen ab“.
- Der Terminstatus zeigt „vor Ort“ ohne Adresse (status-formular.tsx:184).
- Die Kundenseite zeigt bei jedem Autoschlüssel-Termin „Vor Ort bei Ihnen“ (bestellung/[id]/page.tsx:251-253).
- Die einzige Adresse in den Mails ist der Firmensitz Gloelstraße 11 (src/lib/mail/html.ts:100-110). Die Werkstatt liegt in der Langgasse 70 (content/settings.json:21-25).
- Eine Mitbringliste fehlt in den Mails (grep „mitbring|ausweis“ in src/lib/mail: 0 Treffer).
- Scheitert die Anzahlung, wird der Termin still storniert (src/lib/zahlung/uebergaenge.ts:190-195). Das Team erfährt davon nichts (src/lib/server/benachrichtigungen.ts:185-194). Der Kunde muss 13 Schritte und 4 Uploads neu eingeben.

Daraus folgen die Ideen K-01, K-02 und K-03.

### 5.4 Wege des Inhabers im Backend

Quelle ist die Analyse „betrieb“. Bildnamen ohne Link stammen aus dem lokalen Messlauf.

| Arbeitsschritt | Heute gemessen | Seitenhöhe / Reiter | Zeit heute (Schätzung) | nach den Hebeln | Idee |
|---|---|---|---|---|---|
| Code-Bestellung fertigen und versenden | 13 Klicks + 1 Eingabe; Adresse von Hand ins Versandportal | 2.033 px, 4 Reiter (03-vorgang-detail.png) | 4–6 min | 1,5–2,5 min | I-53, I-54, I-56 |
| Fotoanfrage prüfen und beantworten | 14 Klicks, 164 Zeichen Freitext, 0 Vorschaubilder; Betreff „Wir brauchen noch etwas von Ihnen“ | 3.847 px (40b-anfrage-unten.png) | 8–12 min | 3–6 min | I-42, I-55 |
| Projektanfrage auswerten | 10,2 Bildschirme lesen, kein Druck | 9.152 px (50-projekt-detail.png) | 10–15 min | 4–6 min | I-56 |
| Telefontermin eintragen | 2 Klicks + 7 Felder, freie Fenster nicht sichtbar | Formular über der Liste | 2–3 min | 1–2 min | I-57 |
| Termin verschieben | 1 Klick + Dialog + 2 Eingaben, mit Belegungsprüfung und Kundenmail | Seitenleiste | 1 min | unverändert | – |
| Tagesüberblick | Startseite mit 21 Kacheln ohne Zahlen; Liste ohne Datum, Name und Zahlung | 01-dashboard.png, 02-vorgaenge-liste.png | 3–5 min/Tag | 0–1 min | I-52, I-07 |
| Monatsauswertung | nur CSV, danach Excel; Statuswechsel nicht protokolliert | – | 1–2 h | Kennzahlenansicht | I-59, I-60 |

### 5.5 Gefundene Fehler (unabhängig vom Wertausbau)

| Nr | Fehler | Beleg | Behebung | Entscheidung |
|---|---|---|---|---|
| 1 | Anzahlung 69,90 € höher als der Preis von 69,00 € (Bart fräsen B) | [vw-bart-preis.png](belege/geschaeft--vw-bart-preis.jpg); pricing.ts:79, :93-95 | I-12 | F-15 |
| 2 | „Erweiterbar: Ja“ ohne die 15-€-Option bestellbar | [handy-zylinder-warenkorb.png](belege/conversion--handy-zylinder-warenkorb.jpg); konfigurator.tsx:566-597 | I-35 | F-18 |
| 3 | ZY-02 ohne Kartennachweis bestellbar, widerspricht der eigenen FAQ | content/code-lines.json:1057; schliessanlagen/page.tsx:230-233 | I-44 | F-19 |
| 4 | Kundenseite zeigt „Vor Ort bei Ihnen“; Mails nennen den Firmensitz statt der Werkstatt | bestellung/[id]/page.tsx:251-253; gemeinsam.ts:67; html.ts:100-110 | K-01 | F-10 |
| 5 | Unbezahlte Bestellung ohne Warnung als „Versendet“ speicherbar | [33-bestellung-gespeichert.png](belege/betrieb--33-bestellung-gespeichert.jpg); vorgang-benachrichtigen.ts:90-105 | I-54 | – |
| 6 | Fahrzeugpflicht auch für Bart und Gehäuse (Oder-Logik, widerspricht optionen.ts:217) | pricing.ts:59-60; content/vehicles.json 49/49 | eigenes Fehlerticket (≈ 0,25 T) | F-28 |
| 7 | Falsche Einsatzgebiete auf einer indexierten Seite | vor-ort/page.tsx:161-180 | I-21 | F-12 |
| 8 | Slugs „koda“ und „m-gane“ | src/lib/data/defaults/vehicles.ts:34-43 | I-24 | – |
| 9 | 52 Meta-Beschreibungen kleingeschrieben | code-lines.ts:183/217; json-ld.tsx:156 | I-41 | – |
| 10 | Schlüsselanhänger je Zylinder berechnet, der Text verspricht einen je Schlüssel | cylinder-catalog.json:181-190; pricing.ts:188; [zyl-optionen-anhaenger.png](belege/geschaeft--zyl-optionen-anhaenger.jpg) | Preisentscheidung | F-18 |
| 11 | Fahrzeugöffnung (Notfall) mit 7 Tagen Vorlauf und Anzahlung buchbar | Messprotokoll run-vw-bart.log; fahrzeugoeffnung/page.tsx:217 | Entscheidung | F-16 |
| 12 | Telefontermin als „Termin mit Anzahlung“ gespeichert | termin-verwaltung.ts:190 | I-60 | – |
| 13 | Statuswechsel nicht protokolliert | API Vorgang 5: notizen=[] | I-60 | – |
| 14 | Preisgruppe A keinem Fahrzeug zugeordnet | content/vehicles.json | Datenpflege | F-14 |
| 15 | Bei abgebrochener Anzahlung erfährt das Team nichts | benachrichtigungen.ts:185-194 | K-02 | – |

---

## 6 Ideen-Tabelle

Legende:
- **€/Monat:** DB oder Zeitwert im Jahr 2. Bei den von der Gegenprüfung („Skeptiker“) bewerteten Ideen steht der korrigierte Wert.
- **Sofort „bestätigt“:** von der Gegenprüfung bestätigt (nur diese stehen in den Sofort-Hebeln). „ungeprüft“: Sofort-Kandidat laut Zusammenführung, nicht gegengeprüft. „aberkannt“: Sofort-Status von der Gegenprüfung entzogen.
- **K-xx:** neue Ideen aus der Vollständigkeitsprüfung.
- Die Spannen überschneiden sich, vor allem I-02/I-04/I-15/K-01, I-15/I-16/I-17/I-18 und I-31/I-32.

| ID | Idee | Wirkung | €/Monat | Tage | Konf. | RICE | Sofort | Paket | Status |
|---|---|---|---|---|---|---|---|---|---|
| I-01 | Verlust-Pfad öffnen: Schlüsselfotos bei Totalverlust freiwillig | Conversion | 100–900 | 0,75 | hoch | 2.000 | ja, bestätigt | A | besteht, korrigiert |
| I-02 | Preisvorschau ab Schritt 7 (nur gewählte Leistung) | Conversion | 50–800 | 0,5 | mittel | 2.040 | aberkannt | B | besteht, korrigiert |
| I-03 | Preise auf Landing-/Modellseiten, Ab-Preis auf der Startseite | Conversion | 30–500 (schmale Variante) | 2 | mittel | 318 | nein | C (nur schmal) | verworfen in dieser Form |
| I-04 | Terminort Wetzlar und Anreise-Regel im Ablauf, Hinweis bei PLZ ≠ 35 | Conversion | 50–650 | 0,5 | mittel | 1.680 | ungeprüft (Wortlaut F-10) | B | besteht |
| I-05 | „Marke nicht dabei?“ führt zur Anfrage | Conversion | 30–500 | 0,25 | mittel | 1.696 | ja, bestätigt | A | besteht, korrigiert |
| I-06 | Zusatzschlüssel im selben Termin ankreuzen | Warenkorb | 15–550 | 0,5 | niedrig | 848 | ungeprüft | B | besteht |
| I-07 | Termin-Erinnerung im Tages-Cron | DB | 20–270 | 1 | mittel | 348 | ungeprüft | B | besteht |
| I-08 | Handy: nach „Weiter“ zur Schrittüberschrift scrollen | Conversion | 5–150 | 0,5 | mittel | 372 | ja, bestätigt (reduziert) | A | besteht, reduziert |
| I-09 | Hinweis „Angefangene Anfrage weitermachen“ | Conversion | 15–650 | 0,75 | niedrig | 665 | ungeprüft | nachrangig | besteht |
| I-10 | Vorlauf je Leistung (2–3 statt 7 Tage) | Conversion | 50–500 | 0,1 | niedrig | 2.750 | Konfiguration (F-27) | A | besteht |
| I-11 | Zeitfenster 12–13 Uhr | DB | 0–300 | 0,1 | mittel | 2.400 | Konfiguration nach F-13 | A | besteht |
| I-12 | Anzahlung höchstens Gesamtpreis | Vertrauen | 0–30 | 0,25 | hoch | 60 | nein (Anzahlungsentscheidung F-15) | B | besteht |
| I-13 | Einsendung statt Termin für Gehäuse/Bart | DB | 0–250 | 2,5 | niedrig | 50 | nein | – | verworfen |
| I-14 | Hinweis: Haus- und Briefkastenschlüssel mitbringen | Warenkorb | 15–200 | 0,25 | niedrig | 430 | nein (Fachaussage F-30) | nachrangig | besteht |
| I-15 | Werkstattzeile Wetzlar an den Kaufstellen, Zahlarten in der Kasse | Vertrauen | 20–450 | 1 | mittel | 564 | ja, bestätigt (reduziert) | A | besteht, reduziert |
| I-16 | Schmiede-Website und Google-Profil als Zubringer, Zeiten und Preise vereinheitlichen | Sichtbarkeit | 20–350 | 1,25 | mittel | 355 | aberkannt | B | besteht, korrigiert |
| I-17 | Wetzlar/Mittelhessen in Titeln und Unterzeilen | Sichtbarkeit | 20–350 | 0,5 | mittel | 888 | ja, bestätigt | A | besteht, korrigiert |
| I-18 | Foto-Paket für 10 Bildplätze | Vertrauen | 50–600 | 2 | mittel | 390 | nein | B | besteht, korrigiert |
| I-19 | Eigene, geprüfte Bewertungen | Vertrauen | 40–800 | 3,5 | niedrig | 180 | nein | C | besteht |
| I-20 | Mittelhessen-Seiten mit echtem Inhalt | Sichtbarkeit | 50–750 | 0,5 | niedrig | 800 | nein (Texte F-34) | C | besteht |
| I-21 | Falsche Einsatzgebiete entfernen | Vertrauen/Recht | 0–100 | 0,25 | hoch | 400 | ungeprüft, Pflicht | A | besteht |
| I-22 | Modellseiten noindex bis zur Pflege | Sichtbarkeit | 0–100 | 0,5 | mittel | 80 | ungeprüft | B | besteht |
| I-23 | SEO-Felder für Fahrzeugmarken und -modelle | Sichtbarkeit | 0–300 | 1 | niedrig | 150 | nein (Migration) | C | besteht |
| I-24 | Slugs „koda“ und „m-gane“ korrigieren | Sichtbarkeit | 10–75 | 0,25 | hoch | 170 | ungeprüft | A | besteht |
| I-25 | BreadcrumbList, noindex für Vorschau, lastmod | Sichtbarkeit | 10–150 | 0,5 | niedrig | 160 | ungeprüft | nachrangig | besteht |
| I-26 | Ratgeberlücken schließen | Sichtbarkeit | 40–600 | 3 | niedrig | 107 | nein | C | besteht |
| I-27 | /artikel aus Index, Sitemap und Fußbereich | Vertrauen | 0–30 | 0,25 | hoch | 60 | ungeprüft, Pflicht | A | besteht |
| I-28 | Handlungsaufforderungen nach Erg. §2 | Conversion | 30–250 | 0,4 | niedrig | 525 | ungeprüft | B | besteht |
| I-29 | Zylinder in die Hauptleiste | DB | 10–350 | 0,5 | niedrig | 360 | ungeprüft (PL 02) | B | besteht |
| I-30 | Service-Hub straffen | Inhaberzeit | 0–100 | 0,5 | niedrig | 50 | ungeprüft | nachrangig | besteht |
| I-31 | Code-Suche erkennt Codes, Knopf „Nach Code bestellen“ | Conversion | 10–220 | 0,5 | mittel | 368 | ungeprüft | B | besteht |
| I-32 | Code-Produktseite kompakter | Conversion | 10–180 | 0,75 | mittel | 203 | ungeprüft | nachrangig | besteht |
| I-33 | Versandkosten und Lieferzeit früh nennen | Conversion | 10–200 | 0,5 | mittel | 336 | ungeprüft | B | besteht |
| I-34 | Mengen- und Reservehinweise | Warenkorb | 25–310 | 1 | mittel | 268 | ungeprüft | nachrangig | besteht |
| I-35 | „Erweiterbar: Ja“ setzt die 15-€-Option | Warenkorb | 10–100 | 0,25 | hoch | 220 | ungeprüft (nach F-18) | B | besteht |
| I-36 | Kasse: Abholung ohne Lieferanschrift, Eingaben behalten | Conversion | 10–100 | 0,5 | niedrig | 110 | ungeprüft | nachrangig | besteht |
| I-37 | Kleinbestellungen absichern | DB | 20–300 | 1 | niedrig | 160 | nein (Preis) | C | besteht |
| I-38 | „Sperrschließung“ in Titel und Unterzeile | Sichtbarkeit | 20–300 | 0,1 | niedrig | 800 | Konfiguration | A | besteht |
| I-39 | ABUS/BKS und Zusatzkomponenten | Warenkorb | 40–400 | 3 | niedrig | 73 | nein (Migration, Preise) | C | besteht |
| I-40 | Code-Kategorieseiten, URLs mit Hersteller/Serie | Sichtbarkeit | 20–600 | 3 | niedrig | 103 | nein | C | besteht |
| I-41 | Codelinien-Metadaten, noindex bis zur Herstellerpflege | Sichtbarkeit | 10–80 | 0,5 | hoch | 90 | ungeprüft | B | besteht |
| I-42 | Fotoanfragen: Mail bei „Geprüft“, Antwortvorlagen | Inhaberzeit | 25–250 | 1 | mittel | 220 | ungeprüft | B | besteht |
| I-43 | Foto-Freigabe → Zahlungslink | Conversion | 30–450 | 2,5 | niedrig | 96 | nein (Migration, Recht) | B (Erg. §9) | besteht |
| I-44 | Nachbestellweg mit Sicherungskarte, Kartenfoto bei ZY-02 Pflicht | DB | 20–500 | 0,6 | mittel | 693 | ungeprüft | B | besteht |
| I-45 | Nachbestell-Ablauf für Hausverwaltung/Gewerbe | DB | 20–1.500 | 2,5 | niedrig | 304 | nein | C | besteht |
| I-46 | Seite für Hausverwaltung/Gewerbe in Mittelhessen | DB | 40–500 | 2 | niedrig | 135 | nein | C | besteht |
| I-47 | Projektangebot online annehmen und Anzahlung leisten | Conversion | 0–150 | 4 | niedrig | 19 | nein | – | verworfen |
| I-48 | Türliste hochladen statt tippen | Conversion | 40–600 | 1,5 | niedrig | 213 | nein | C | besteht |
| I-49 | „Partner werden“, Stufe 0 | Abnahme | 0 | 0,6 | hoch | 0 | ungeprüft (Erg. §9) | B | besteht |
| I-50 | Partnernetz, Stufe 1 | DB | 0–300 | 7 | niedrig | 21 | nein | C, bedingt | verworfen in dieser Form |
| I-51 | Partnernetz, Stufe 2 | Inhaberzeit | 10–300 | 8 | niedrig | 10 | nein | – | zurückgestellt (folgt I-50) |
| I-52 | Arbeitsliste im Backend | Inhaberzeit | 55–150 | 0,75 | mittel | 328 | ungeprüft | B | besteht |
| I-53 | Produktionsliste Code/Zylinder | Inhaberzeit | 40–300 | 1 | mittel | 272 | ungeprüft | C | besteht |
| I-54 | „Versand melden“ mit Zahlungswarnung | Inhaberzeit | 20–175 | 0,5 | mittel | 312 | ungeprüft | B | besteht |
| I-55 | Vorschaubilder am Vorgang | Inhaberzeit | 20–200 | 0,5 | mittel | 528 | ungeprüft | B | besteht |
| I-56 | Vorgangsblatt mit Druck/PDF | Inhaberzeit | 25–225 | 1 | mittel | 200 | ungeprüft | B | besteht |
| I-57 | Termin-Wochenplan | Inhaberzeit | 40–150 | 1,25 | niedrig | 76 | nein | C | besteht |
| I-58 | Backup einschließlich Storage | Abnahme | 0–50 | 0,75 | mittel | 27 | ungeprüft (PL 18) | B | besteht |
| I-59 | CSV mit Status, PLZ, Region; Region in Team-Mail | Messung | 50–225 | 0,5 | hoch | 550 | ungeprüft | A | besteht |
| I-60 | Kennzahlen und Statusprotokoll | Messung | 50–150 | 1 | mittel | 240 | ungeprüft | B | besteht |
| I-61 | Anonyme Trichterzählung in eigener DB | Conversion | 30–800 | 2,25 | niedrig | 277 | nein (Migration, Datenschutz) | C | besteht |
| I-62 | Endbetrag und Rechnung am Vorgang | Inhaberzeit | 50–225 | 1,5 | mittel | 220 | nein (Migration) | C | besteht |
| K-01 | Termin-Unterlagen: Werkstattadresse statt „Vor Ort bei Ihnen“, Mitbringliste, .ics | Inhaberzeit | 25–450 | 0,75 | hoch | 950 | ungeprüft (Standardort F-10) | B | neu |
| K-02 | Rückruf-Hinweis an das Team bei abgebrochener Anzahlung | DB | 20–600 | 0,5 | mittel | 1.488 | ungeprüft | A | neu |
| K-03 | Neuer Termin für denselben Vorgang nach Abbruch | Conversion | 10–300 | 1,75 | mittel | 142 | nein | C | neu |
| K-04 | Zahlarten über Stripe erweitern (Klarna, Banküberweisung; ohne PayPal) | Conversion | 15–450 | 1 | mittel | 558 | nein (Datenschutztext) | C | neu, eingeschränkt |
| K-05 | Anzahlungsregel und Selbst-Umbuchung | Inhaberzeit | 15–400 | 1,5 | mittel | 221 | nein (AGB) | C | neu |
| K-06 | Telefonnummer in Abläufen, klickbar während der Öffnungszeiten | Conversion | 10–250 | 0,5 | niedrig | 390 | nein | nachrangig | neu |
| K-07 | Am Handy fortsetzen (Link ohne Personendaten) | Conversion | 5–200 | 0,75 | niedrig | 137 | nein | nachrangig | neu |
| K-08 | Samstagsfenster; Batterie und Gehäuse ohne Termin | DB | 0–400 | 0,25 | niedrig | 400 | nein (F-13) | C | neu |

---

## 7 Verworfene und zurückgestufte Ideen

**Ganz verworfen**

- **I-03, Preise auf Landing-, Modell- und Startseite in dieser Form.**
  - Der Ab-Preis „Zweitschlüssel ab 149 €“ käme aus Gruppe A. Dieser Gruppe ist aber kein Fahrzeug zugeordnet (Abfrage /api/fahrzeugmarken). Damit wäre er irreführende Preiswerbung.
  - Die Preise sind ungeprüfte Startwerte (MENSCHEN.md M-30), und die Schmiede wirbt mit „ab 45 €“.
  - Der Aufwand liegt bei 2 statt 1 Tag (keine Seite liest heute Preisregeln).
  - Später bleibt nur die schmale Variante: berechnete Preise je Modell, nach Freigabe M-30 und Preisabgleich (F-14).
- **I-13, Einsendung statt Termin für Gehäuse und Bart.**
  - Marktpreise: Die Schmiede nennt „Gehäusetausch ab 15“, Einsende-Reparaturen gibt es für etwa 34 €, Ersatzgehäuse für 7–9 €. SCHLÜSSELMACHER24 verlangt 59–169 €.
  - Eine neue Domain ohne bundesweite Rangposition bekommt kaum Einsendungen.
  - Der Vorlage-Ablauf passt ohne Umbau nicht.
  - Ergebnis: 0–250 € für 2,5 Tage.
  - Bleibt: Die Oder-Logik in `pricing.ts:59-60` wird als eigenes Fehlerticket behoben (Fehler 6 in 5.5).
- **I-47, Projektangebot online annehmen.**
  - Hausverwaltung und Gewerbe zahlen auf Rechnung. Die Annahme hängt an Beratung und Aufmaß, nicht an einem Knopf.
  - Nötig wären Migration, neuer Zahlungsweg und Rechtsprüfung, also etwa 4 Tage für 0–150 €.
  - Neu bewerten, wenn private Kunden von Schließanlagen messbar oft absagen.
- **I-50, Partnernetz Stufe 1 in dieser Form.**
  - Widerspricht Erg. §7 und §9: manuell starten, kein Portal.
  - Lohnt erst ab etwa 30 Anfragen pro Monat von außerhalb PLZ 35; realistisch 0–300 € für 7 Tage.
  - Stattdessen: I-49 (Seite und Formular), I-59 (PLZ messen), Vermittlung zunächst über Notizen am Vorgang.
- **I-51, Partnernetz Stufe 2:** zurückgestellt, weil es auf I-50 aufbaut.

**Teilweise verworfen**

- **I-08:**
  - Der Tastatur-Teil entfällt. Die Messung beruhte auf `setViewportSize(390×500)`. Reale Browser verkleinern bei offener Tastatur nur den Visual Viewport, und `globals.css:200-203` setzt bereits `scroll-padding-bottom: 8rem`.
  - Die Hinweiszeile „erst nach Fehlversuch“ entfällt ebenfalls. „Weiter“ ist deaktiviert, einen Fehlversuch gibt es also nicht.
- **I-15:** Der Name der Schmiede wird nicht fest im Code eingetragen. Öffnungszeiten werden erst nach F-13 angezeigt. Der Umbau von JSON-LD/sameAs entfällt (Wirkung spekulativ).
- **K-04:** Der PayPal-Teil entfällt, weil ein eigenes PayPal-Konto ein neuer Dienst wäre.

**Sofort-Status aberkannt** (die Idee bleibt bestehen)

- **I-02:** Die Wirkung ist ohne Trichtermessung nicht isolierbar, und die Preise sind ungeprüft.
- **I-16:** Erst müssen die Preise abgeglichen werden. Dazu kommen ein fremdes Repo und das Google-Konto.

**Bewusst nicht empfohlen**

- WhatsApp-Widget: ein neuer externer Kanal; die Schmiede bindet es mit gtag ein.
- Google Merchant Center vor den Produktfotos.
- Vercel Web Analytics statt eigener Zählung: ein neues Produkt, Custom Events hängen vom Tarif ab.
- Stadtseiten am Fließband (Erg. §5).

---

## 8 Drei Pakete

Kosten bei angenommenen 600–900 € je Entwicklertag. Die €-Spannen der Pakete sind nach Überschneidung gekürzt: A um 20 %, B und C um 30 % auf die Obergrenze.

### Paket A – Sofort (≤ 1 Woche)

| ID | Inhalt | Tage | €/Monat |
|---|---|---|---|
| I-01 | Verlust-Pfad öffnen (bestätigt) | 0,75 | 100–900 |
| I-05 | „Marke nicht dabei?“ (bestätigt) | 0,25 | 30–500 |
| I-08 | Handy: zur Schrittüberschrift scrollen (bestätigt, reduziert) | 0,5 | 5–150 |
| I-15 | Werkstattzeile und Zahlarten (bestätigt, reduziert) | 1 | 20–450 |
| I-17 | Wetzlar/Mittelhessen in Titeln und Unterzeilen (bestätigt) | 0,5 | 20–350 |
| I-21 | Falsche Einsatzgebiete entfernen (Pflicht, Erg. §5) | 0,25 | 0–100 |
| I-24 | Slugs koda/m-gane | 0,25 | 10–75 |
| I-27 | /artikel noindex (Erg. §4) | 0,25 | 0–30 |
| I-59 | Messgrundlage CSV mit PLZ, Status, Region | 0,5 | 50–225 |
| K-02 | Rückruf-Hinweis bei abgebrochener Anzahlung | 0,5 | 20–600 |
| I-10, I-38, I-11 | Konfiguration im Backend nach Entscheidung (F-27, F-13) | 0,3 | 70–1.100 |
| **Summe** | | **≈ 5** | **325–3.600** |

**Amortisation:** Das Paket kostet 3,0–4,5 T€.
- Bei der Mitte (≈ 2,0 T€/Monat) ist es nach 2–3 Monaten eingespielt, bei der Untergrenze nach 9–14 Monaten.
- I-17 wirkt erst ab Monat 4–9.

### Paket B – Hebel (2–4 Wochen)

Reihenfolge:
1. Leitfaden-Pflicht: I-43, I-49, I-58, I-29, I-42
2. Autoschlüssel: I-04, K-01, I-02, I-07, I-06, I-12
3. Backend: I-52, I-55, I-56, I-60, I-54
4. Vertrauen: I-18, I-16
5. Shop und SEO: I-44, I-31, I-33, I-35, I-28, I-22, I-41

| Block | IDs | Tage | €/Monat |
|---|---|---|---|
| Leitfaden-Pflicht | I-43, I-49, I-58, I-29, I-42 | 5,35 | 65–1.100 |
| Autoschlüssel | I-04, K-01, I-02, I-07, I-06, I-12 | 3,5 | 160–2.750 |
| Backend und Messung | I-52, I-55, I-56, I-60, I-54 | 3,75 | 170–900 |
| Vertrauen | I-18, I-16 | 3,25 | 70–950 |
| Shop, B2B, SEO | I-44, I-31, I-33, I-35, I-28, I-22, I-41 | 3,25 | 90–1.450 |
| **Summe** | 25 Ideen | **≈ 19** (davon ≈ 1 Tag Inhaber für Fotos) | **555–5.000** |

**Amortisation:** Das Paket kostet 10,8–16,2 T€.
- Bei der Mitte (≈ 2,8 T€/Monat) ist es nach 4–6 Monaten eingespielt, bei der Untergrenze erst nach 19–29 Monaten.
- Deshalb in Stufen freigeben: Die Blöcke 3–5 erst, wenn I-59/I-60 nach 6–8 Wochen echte Mengen zeigen.

### Paket C – Ausbau (über 4 Wochen, nur einzeln und bedingt)

| ID | Inhalt | Bedingung |
|---|---|---|
| I-40, I-41 (Fortsetzung) | Code-Kategorien, URLs nach Hersteller und Serie | Herstellerdaten (F-32) |
| I-39 | ABUS/BKS und Zusatzkomponenten | Einkaufspreise (F-04, F-37) |
| I-45, I-46, I-48 | Nachbestell-Ablauf, Seite und Türliste für Hausverwaltung/Gewerbe | ≥ 3 Bestandskunden, Angaben F-05/F-35 |
| I-19 | Eigene Bewertungen | ab Monat 6, Rechtsprüfung |
| I-61, I-62 | Trichterzählung, Endbetrag | Datenschutzberater (F-24), Buchhaltung (F-09) |
| I-57, I-53 | Wochenplan, Produktionsliste | ≥ 20 Telefontermine bzw. ≥ 60 Bestellungen im Monat |
| I-20, I-23, I-26, I-03 (schmal) | Mittelhessen-Seiten, SEO-Felder Fahrzeuge, Ratgeber, Modellpreise | Texte und Daten vom Inhaber, Preisfreigabe |
| K-03, K-04, K-05, K-08, I-37 | Neubuchung nach Abbruch, Zahlarten, Anzahlungsregel, Samstag, Kleinbestellungen | Entscheidungen F-13, F-17, F-25, F-03 |
| I-50 (bedingt) | Partnernetz Stufe 1 | ≥ 30 Fernanfragen/Monat über 2–3 Monate (I-59) |

- **Summe:** ≈ 33,5 Tage (+ 7 Tage für I-50, falls die Bedingung eintritt). 540–6.900 €/Monat (+0–300 € I-50).
- **Kosten:** 20,1–30,2 T€.
- **Amortisation:**
  - Bei der Mitte (≈ 3,7 T€/Monat) nach 5–8 Monaten ab Wirkung. Die SEO- und B2B-Teile wirken erst ab Monat 6–12.
  - Bei der Untergrenze nicht im 30-Monats-Horizont. Deshalb nur einzeln freigeben, wenn Daten die obere Spanne belegen.

### Nachrangig (nicht eingerechnet)

I-09, I-14, I-25, I-30, I-32, I-34, I-36, K-06, K-07. Jede hat einen kleinen Nutzen. Umsetzen bei Gelegenheit, wenn ein Bereich ohnehin bearbeitet wird.

### Übersicht

| Paket | Tage | €/Monat | Kosten | Amortisation (Mitte / Untergrenze) |
|---|---|---|---|---|
| A Sofort | ≈ 5 | 325–3.600 | 3,0–4,5 T€ | 2–3 / 9–14 Monate |
| B Hebel | ≈ 19 | 555–5.000 | 10,8–16,2 T€ | 4–6 / 19–29 Monate |
| C Ausbau | ≈ 33,5 (+7) | 540–6.900 | 20,1–30,2 T€ | 5–8 / > 30 Monate |

---

## 9 Was muss wahr sein für Faktor 10?

### 9.1 Bedingungen

1. **Autoschlüssel:** Es kommen rund 50 zusätzliche, nicht von der Schmiede verlagerte Termine pro Monat mit Ø-DB ≥ 175 € zustande. Das sind etwa 70 % der heutigen Online-Kapazität von 105 Fenstern. Dafür müssen Assistent-Starts und Abschlussquote am oberen Ende der Spannen liegen (≥ 400 Starts, ≥ 10 % Abschluss).
2. **Projekte:** Rund 4 Projektaufträge pro Monat von Hausverwaltung und Gewerbe mit ≥ 1.000 € DB. Das setzt einen B2B-Einstieg voraus (I-44, I-45, I-46) und einen Inhaber, der Angebote schnell macht (I-56).
3. **Kapazität:** Ab etwa 55 Autoschlüssel-Aufträgen im Monat sind die Fenster knapp. Für das obere Ziel braucht es das 12-Uhr-Fenster (I-11), Samstagsfenster (K-08) und Gehäuse und Batterie ohne Termin.
4. **Personal:** 90–220 h Mehrarbeit pro Monat, also 0,6–1,4 Vollzeitstellen. Der DB in dieser Rechnung ist vor Personalkosten gerechnet.
5. **Zusätzlichkeit:** Höchstens 20–30 % des Online-DB dürfen Kanalwechsel von Schmiede-Kunden sein. Dafür braucht es klare Rollen der beiden Domains und abgestimmte Preise (I-16, F-14).
6. **Sichtbarkeit:** Echter Ortsbezug (I-17), das Google-Profil der Schmiede als Zubringer (I-16) und Fotos (I-18). Die Wirkung setzt frühestens ab Monat 4–9 ein.
7. **Messung ab Tag 1:** PLZ, Status und Kennzahlen (I-59, I-60), später Endbetrag (I-62). Ohne sie lässt sich weder der Faktor nachweisen noch nachsteuern.
8. **Shop:** Code-Bestellungen müssen nach Arbeitszeit positiv bleiben (I-37, Staffelhinweise). Der Shop trägt im Faktor-10-Bild nur 5–10 %.
9. **Partner:** nur ein Zusatz, lohnend erst ab ≥ 30 Anfragen pro Monat außerhalb PLZ 35.
10. **Inhaberdaten:** Fotos, Herstellerdaten der 52 Codelinien, Mittelhessen-Texte und die Preisfreigabe kommen innerhalb der ersten 3 Monate.

### 9.2 Erwarteter Faktor in drei Fällen

| Fall | DB/Monat über die Seite (Basis + Pakete nach 25 % Überschneidung) | davon zusätzlich | Laufzeit / wirksame Monate | DB gesamt | Faktor auf 40–60 T€ | Faktor nach Paketkosten (oben auch Personal) |
|---|---|---|---|---|---|---|
| unten (Basis + A + B, jeweils Untergrenze) | 2,1 + 0,7 = 2,8 T€ | 70 % = 1,9 T€ | 24 / 21 | ≈ 41 T€ | 0,7–1,0 | 0,5–0,75 (A+B 14,4–21,6 T€) |
| Mitte (Basis + A + B, Mitte) | 8,6 + 3,6 = 12,1 T€ | 70 % = 8,5 T€ | 30 / 27 | ≈ 229 T€ | **3,8–5,7** | **2,8–4,2** |
| oben (Basis + A + B + C, Obergrenze) | 20,7 + 11,6 = 32,3 T€ | 80 % = 25,9 T€ | 36 / 33 | ≈ 854 T€ | 14–21 | 6–9 (A–C 34,6–51,8 T€; 1,4 VZÄ ≈ 5,6 T€/Monat) |

### 9.3 Lesart

- **Faktor 10 auf Deckungsbeitrag**, wie gefragt, erreicht die Seite nur im oberen Fall. Dort müssen fast alle oberen Annahmen gleichzeitig eintreten. Rechnet man die Kosten für die Pakete und das nötige Personal mit, landet auch der obere Fall bei 6–9.
- **Im mittleren Fall** spielt die Seite ihre Kosten in 2–3 Jahren drei- bis sechsfach ein.
- **Im unteren Fall** wird sie in 24 Monaten knapp nicht kostendeckend. Deshalb gilt: Paket B nur in Stufen und nach Messung freigeben, Paket C nur bei belegten Daten.
- **Gleich in allen Fällen:** Am meisten bringt es, die Lecks in der Autoschlüssel-Linie zu schließen (Paket A und der Autoschlüssel-Block in B). Diese Wirkung wächst mit jedem zusätzlichen Termin linear mit.

---

## 10 Offene Fragen, Widersprüche, Grenzen

**Widersprüche, die der Inhaber auflösen muss** (Details in Abschnitt 3)
- **Öffnungszeiten:** SCHLÜSSELMACHER24 nennt Mo–Do 9–13 und 14–17 Uhr, Fr 9–13 Uhr. Schmiede und Gelbe Seiten nennen Mo–Sa 10–18 Uhr (F-13).
- **Preise:** Die Schmiede wirbt mit „Ersatzschlüssel ab 45 €“ und „Gehäusetausch ab 15“. SCHLÜSSELMACHER24 nennt Zweitschlüssel ab 149 € (Gruppe A, keinem Fahrzeug zugeordnet) bzw. 249 € und Gehäuse 59 € (F-14).
- **Terminort:** Ablauf und Bestätigung sagen „Ort stimmen wir ab“, die Kundenseite „Vor Ort bei Ihnen“, die Schmiede „Fahrzeug zwingend bei uns am Laden“ (F-10).
- **Firmensitz und Werkstatt:** In den Mails steht die Gloelstraße 11, die Werkstatt liegt in der Langgasse 70.
- **Noindex-Abwägungen:** I-22 gegen sichtbare Modellseiten, I-41 gegen indexierte Code-Produktseiten bis zur Herstellerpflege.

**Grenzen dieser Bewertung**
- Es gibt keine gemessenen Suchvolumina, kein echtes Google.de-Ergebnis und keine lokale Kartenliste. Die Websuche lief über ein US-Werkzeug.
- Es gibt weder Besucher- noch Umsatzdaten. Alle Mengen sind Annahmen (2.2).
- Gemessen wurde ein Testbuild ohne Stripe und Resend, deshalb sind Zahlungs- und Mailwege nur im Code geprüft.
- Die Stripe-Gebühren stammen aus Sekundärquellen und sind auf stripe.com/de/pricing zu prüfen.

**Nebenwirkungen der Messläufe** (nur Test-DB, im Repo wurde nichts geändert)
- Angelegt wurden die Vorgänge SM24-A-2026-0001, SM24-P-2026-0001, SM24-B-2026-0003 (Status „Versendet“), SM24-T-2026-0001 und SM24-T-2026-0002.
- Rund 16 Testbilder (`dummy-*.jpg`) liegen in `private-uploads/`. Der Ordner ist per .gitignore ausgeschlossen, der tägliche Cron löscht sie nach 24 h.
- Vor dem Livegang die Test-DB bereinigen.

**Nächster Schritt:** Der Inhaber beantwortet F-10 bis F-15, F-23 und F-27. Danach Paket A umsetzen und I-59 aktivieren. Nach 6–8 Wochen anhand der echten Mengen über die Blöcke von Paket B entscheiden.
