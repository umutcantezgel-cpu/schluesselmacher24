# LAGEBILD · Ausgangsstand E0 (2026-11-02)

Quellen: berichte/E0-KUNDSCHAFTER-01 bis -06, berichte/E0-PRUEFER-01, erhebung/E0-routen.tsv. Messwerte der Prüfstufe B (Lighthouse, axe, Bildsatz, Slop-Index) ergänzt E0-d in Abschnitt 4.

## 1. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 2. Bestand je Rubrik (Kundschafter 02, Fundstellen dort)

| Rubrik (G-03) | Heute | Abschluss | Nachweis | Lücke zum Gespräch |
|---|---|---|---|---|
| Autoschlüssel | /autoschluessel mit 7 Leistungsseiten, Marken (12) und Modelle (49), Termin-Assistent mit 13 Schritten | Termin mit Anzahlung (Stripe) | Fahrzeugschein serverseitig Pflicht; Vollmacht fehlt | Fahrzeugkatalog nur 12 Marken ab 1994 ohne Herkunft (G-14); kein Anfrageweg „Fahrzeug nicht dabei“ (G-15); Finder als Wissensseite fehlt (G-17) |
| Motorradschlüssel | fehlt | – | – | Anfrageweg mit Transponder-Pflichtfrage (G-19) |
| Autoschlüssel-Gehäuse | nur Leistung im Termin | – | – | Angebot mit Zahlungslink und Einsenden (G-20) |
| Transponder-Kopie | fehlt | – | – | nur für bestätigte Fahrzeuge (G-18) |
| Schlüssel nach Code | 52 Codelinien, Kategorien, Codesuche | Warenkorb, Kasse | Sicherungskarte nur bei zy-02, nur im Browser erzwungen | Sortiment gegen Bogen SORTIMENT (G-22); Hersteller überall Platzhalter |
| Schlüssel nach Foto | Foto-Anfrage, 8 Schritte, Freigabe mit Zahlungslink | Zahlungslink | Fotos nur im Browser Pflicht | Fotoanleitung mit drei Beispielen, Hinweis „nicht jedes Foto ablesbar“ (G-23) |
| Schlüssel einschicken | Seite ohne Formular | keiner | Sicherungskarte nur als Text | Adressformular, Versandmarke oder Begleitschein, versichert oder nicht, Rückversand mit Status (G-24 bis G-26) |
| Sperrschließung | gleichschließende Zylinder, Konfigurator mit 6 Schritten, Sätze bis 30 | Warenkorb, Kasse | Sicherungskarte nur als Option | Schließplan-Prinzip je Zylinder, Messhilfe mit Video, „Maße geprüft“ (G-28, G-29) |
| Schließanlage | Projekt-Konfigurator mit 11 Blöcken | Projektanfrage | Frage nach Sicherungskarte | Schließmatrix, Schlüssel und Planreserve, Kappen, Gesamtpreis, Schließplan-PDF, Kasse oder Projektanfrage (G-27, G-35) |
| Elektronische Schließsysteme | Zutritts-Konfigurator mit 7 Fragen | Projektanfrage | – | Hersteller und Technik, Anfrage (G-33) |
| Sicherheitstechnik | 7 Leistungsseiten, Sicherheitscheck | Anfrage | – | Schlüsselaufbewahrung fehlt (G-34) |
| Türen und Schließtechnik | 10 Leistungsseiten | Anfrage über ?thema= | – | Beratung per Anfrage (G-34) |
| Schlüsseldienst vor Ort (Partner) | /service-und-termin/vor-ort mit 6 Verweisen | keiner | – | Anfrage mit Ort und Vermittlung (G-40, G-41) |
| Beratung | Service-Anfrage, Kontaktseite ohne Formular | Anfrage | – | Kontaktformular mit Foto (G-36), Rückruf |
| Partner werden | Bewerbung mit 5 Schritten | Bewerbung | Nachweise frei | Statusautomat, Vertrag als PDF, Unterschrift, Partner-AGB, Abrechnung A/B (G-39, G-40) |

Querschnitt: Navigation und Hub stehen im Code (src/lib/navigation.ts); der Schnelleinstieg „Wobei können wir helfen?“ hat acht Kacheln unter dem Hero, mobil als Wischleiste (G-01 bis G-03 verletzt). Ablaufschritte mit Icons nur bei der Foto-Anfrage (G-10). Kein Über-uns, keine Karte, kein Video, keine PDF-Bibliothek (Vorgangsblatt nur als HTML-Druck). Vorgänge in einer Sammlung mit fünf Arten (bestellung, anfrage, termin, projekt, partner), Bereiche als Code-Enum.

## 3. Lücken gegen G und L (Zahlen; Einzelheiten in ANFORDERUNGEN.json)
- G-01 bis G-51 (Kundschafter 02): 2 vorhanden, 27 teilweise, 1 abweichend, 10 fehlen, 11 nicht Wegebereich.
- Leitfaden (EVALUIERUNG Abschnitt 4): 53 erfüllt, 33 teilweise, 12 fehlen oder verletzt; 15 Fehler aus 5.5 offen.
- Menschensachen des Gestaltungslaufs: 34 von 37 offen. Livegang: 38 Schritte offen (Konten, Domain, Rechtstexte).

## 4. Ausgangswerte (Prüfwege nach berichte/E0-PRUEFER-01, Lauf 2)
- Typprüfung 0 Fehler · Lint 0 Fehler, 0 Warnungen · Unit-Tests 1.735 von 1.735 (133 Dateien) · Datenbanktests 94 von 94 (15 Dateien).
- Build ohne Datenbank 224 von 224 Seiten · Build mit lokalem Postgres grün (Migrationen, Seed, Zugang, Livegang-Prüfung, 224 Seiten) · Livegang-Prüfung ohne Lücke in beiden Modi.
- Inventar laut Quelltext: 55 page.tsx, 181 indexierbare Adressen (alle in der Sitemap), 19 noindex.
- Funktionsliste 19 von 19 bestanden, Tastatur 3 von 3 (protokolle/E0-funktionsliste-vorher.json, -tastatur-vorher.json).
- Erster Bildschirm: 0 von 8 Schnelleinstieg-Kacheln ohne Scrollen sichtbar; Überschrift bei 1.145 bis 1.155 px mobil und 971 px Desktop (protokolle/E0-vorher-hub.json).
- Bildsatz 70 von 70 Läufen ohne Seitenüberlauf; Kontaktbögen in bilder/vorher.
- axe WCAG 2.2 AA: je Hauptansicht ein ernster Befund (target-size am Telefon-Link), auch mit offenem Menü; sonst keine.
- Konsole: 0 Fehler, 0 Warnungen. Reduzierte Bewegung: 0 Befunde.
- Lighthouse (Median aus 3, simulierte Drosselung): Budget in 0 von 28 Fällen; mobil LCP 2,86 bis 4,41 s, Leistung unter 90 in 11 Ansichten (Start 83), Barrierefreiheit 96 bis 97, SEO 92 (Start 100, Kasse 54 wegen noindex). Eigene Messung mit CDP-Drosselung: Budget in 28 von 28 (LCP mobil 484 bis 652 ms, CLS höchstens 0,010, TBT mobil 138 bis 221 ms). Maßstab für Z-15 ist Lighthouse; die Abweichung wird in E4 an der Startseite aufgeklärt.
- Inventar: 217 Adressen, 181 indexierbar, 18 noindex, keine Weiterleitungen, Fehlerstatus oder Dubletten. Snippets: Titel bis 580 px 28 von 181, Beschreibung 120 bis 160 Zeichen 146 von 181.
- Slop-Index 3 bis 16 je Ansicht (H05 16, H10 14, H02 14): S1 Inter überall, S2 Lila der Bereichsfarbe Schließanlagen, S3 Verlauf an der Augenbraue, S5 Radius 0 px auf über 40 % der Flächen, S8 Einblendung auf 12 Ansichten. Stil: 2.744 Gedankenstriche, 659 Bindestrich-Kandidaten, 51 Platzhalter auf 182 Seiten (SLOP-AUDIT.md).

## 5. Stärken
- Saubere Technik: strikte Typen, 1.829 grüne Tests, Datenweiche ohne Datenbank, additive Migrationen, Seed mit Startwert-Abgleich.
- Ehrliche Grundhaltung: Index-Steuerung nach Substanz, Platzhalter-Prüfung vor dem Livegang, Strukturdaten weitgehend nur für Sichtbares.
- Eigenes Formsystem: 54 Fach-Icons und 39 Glyphen in einer Familie (48er-Raster, 1,75 px), neun Grafik-Generatoren (Zylindermaß, Schließplan, Profilschnitt), keine fremden Icon-Sets.
- Sichere Uploads: Signaturprüfung, Einmal-Schlüssel, Ratenbegrenzung, Aufräumen nach Frist; Stripe mit Webhook-Signatur und Abgleich.
- Leitidee „Werkstattzeichnung“ (KERN 1.19) mit Bewegungsregister B-01 bis B-29.

## 6. Schwächen mit Wirkung
1. **Erster Bildschirm verfehlt die Absicht** (hoch): Hub steht unter dem Hero, acht statt zwölf Kacheln, mobil seitlich gewischt. Wirkung: Laien müssen suchen statt tippen.
2. **Neue Wege fehlen** (hoch): Einsenden mit Versand, Motorrad, Gehäuse, Transponder, Fahrzeug nicht gefunden, Kontakt mit Foto, Partner mit Vertrag. Wirkung: Nachfrage aus ländlichen Gegenden und Gewerbe läuft ins Leere.
3. **Fahrzeugdaten zu schmal** (hoch): 12 Marken, 49 Modelle ohne Herkunft. Wirkung: Viele Fahrzeuge scheitern im ersten Schritt.
4. **Nachweise teils nur im Browser** (hoch, Sicherheit R13): Sicherungskarte und Schlüsselfotos serverseitig nicht erzwungen.
5. **Kein PDF für den Inhaber** (mittel): Anfragen kommen ohne Vorgangsblatt-Anhang, Rückfragen nötig (G-37).
6. **Text mit KI-Spuren** (mittel): über 1.000 Gedankenstriche, 14 Floskeln, Titel mit „—“ (G-48, S9).
7. **Typografie für Laien zu klein** (mittel): Fließtext mobil 15 px statt mindestens 17 px; Inter auf der Liste S1.
8. **Keine Lebendigkeit mit Schalter** (mittel): kein Bewegungsschalter, kein Pause-Knopf, keine Dauerbewegung (G-06); Startschlüssel zu lang (G-07).
9. **Suche** (mittel): FAQPage-Markup auf 109 Seiten trotz Wegfall der FAQ-Ergebnisse (R8), max-snippet und max-image-preview fehlen, doppelte WebPage-@id, kein Über-uns, Codelinien-Titel zu lang (31 von 52 über 60 Zeichen).
10. **Modularität** (mittel): Rubriken, Hub, Navigation, Abläufe und Formulare im Code statt in Daten (G-11).

## 7. Fremde Branches (Kundschafter 06)
Übernahmekandidaten nach Denkprotokoll in E3: fix/stripe-api-version (09e1d57, feste Stripe-API-Version), dependabot next-react (fee7aff, React 19.3.1 und eslint-config-next 16.4.2, Minor), seo/json-ld-detailseiten (abc1908, nur die Seitendateien). Alle übrigen sind enthalten, Major oder riskant.

## 8. Suche und KI-Antworten: geprüftes Lagebild (E1-RECHERCHEUR-04, Stand 2026-11-03)
Auftrag 13 nennt das Lagebild mit Stand Oktober 2026; die Prüfung gegen offizielle Quellen ergab 11 von 13 Aussagen bestätigt, keine widerlegt. Wo die Quelle genauer ist, gilt diese Fassung (Neueres geht vor). Belege mit Adresse in erhebung/E1-lagebild-suche.md.
- Spam-Richtlinien: seit 15.05.2026 ausdrücklich auch für generative KI-Antworten in der Google-Suche (Vermerk der Updates-Seite).
- Cloaking: Die Richtlinie spricht von Inhalten für Nutzer und Suchmaschinen; KI-Crawler nennt sie nicht. Für die Seite gilt trotzdem R1: eine Fassung für Menschen, Suchmaschinen und KI-Crawler.
- KI-Crawler und JavaScript: belegt nur für Dezember 2024 (Messung Vercel); eine neuere Messung fehlt. Regel KT2 bleibt: alles Wichtige im ersten HTML.
- Menschliche Prüfung KI-erzeugter Inhalte vor der Veröffentlichung, auch Titel, Beschreibungen, Strukturdaten und Alt-Texte: Leitfaden, im Vermerk vom 01.10.2026 genannt. Folge: REDAKTION.md und Freigabe durch den Inhaber vor dem Livegang.
- FAQ-Ergebnisse: seit 07.05.2026 entfallen, seit 15.06.2026 nicht mehr sichtbar. Das FAQPage-Markup im Bestand (109 Seiten) fällt in E8-OPUS-01 weg; die Fragen bleiben als sichtbare Teilfragen mit Kurzantwort.
- Bing Webmaster Tools: KI-Leistung (Zitate, Grounding-Anfragen, zitierte Seiten) als Vorschau seit 10.02.2026; Klicks nicht genannt.
- IndexNow: erreicht Bing und weitere Dienste, nicht Google.
- llms.txt: Google Search ignoriert die Datei (Hinweis vom 15.06.2026); der Bestand liefert sie aus denselben Daten wie die Seite (KL1).
- Neu seit Oktober 2026: Ein gemeinsames robots.txt-Signal gegen KI-Training ist für 2027 angekündigt, ohne Namen; KI-Übersichten und KI-Modus steuert eine Einstellung in der Search Console. Der Bericht zu generativer KI in der Search Console zeigt seit 03.06.2026 Impressionen, für alle Websites seit 31.08.2026.
- Inhaberentscheidung: Trainings-Bots (MA-19). Such- und Nutzer-Bots bleiben frei (KT1).
