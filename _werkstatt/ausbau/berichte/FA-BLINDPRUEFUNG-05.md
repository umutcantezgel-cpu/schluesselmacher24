# FA-BLINDPRUEFUNG-05 · Blindprüfung Abschnitte 10 und 11 (Shop, Schlüssel nach Code)

Grundlage: arbeitsanweisung-2026-11-11.txt, Zeilen 271–301. Zählung: Abschnitt 10 = Einleitung (2 Sätze), 9 Kategorien, Terminabsatz; Abschnitt 11 = Einleitung, 6 Punkte, davon „Jedes Produkt mit …“ mit 10 Merkmalen. Der Kundschafter hat alle Punkte als FA-10-01…12 und FA-11-01…19 erfasst. Nichts übersehen.

Am Code nachgeprüft: 26 Urteile. Bestätigt: 21. Geändert: 5.

## Korrekturen

| ID | alt | neu | Grund |
|---|---|---|---|
| FA-10-03 | erfuellt | teilweise | Die Struktur ist fertig. Alle 52 Einträge der Kategorie sind aber Demo-Linien und **voll bestellbar**: content/code-lines.json hat kein `example`-Flag, `active: true`. orders.ts:201 sperrt nur `l.example`. Maßstab 01/29: keine Demo-Daten. Bau an der Kategorie ist nicht nötig, nur Datenersatz (FA-11-02/03). |
| FA-10-09 | erfuellt | teilweise | Konfigurator, Warenkorbart und Serverprüfung (orders.ts:254-279) stehen durchgehend. Aber content/cylinder-catalog.json hat `manufacturers: []`. Maßbereiche und Längen sind laut E1-gegenpruefung.md:66,74 (L2, L6) nicht belegt. Grundpreise ohne Quelle (G9, OFFENE FRAGE). |
| FA-10-10 | fehlt | teilweise | Es gibt Infrastruktur, die der Kundschafter nicht genannt hat: die Rubrikseite /tuer-und-schliesstechnik (+[slug]) und die Artikelart `standard` mit Admin (Produkte.ts:62), Versandklasse `zubehoer`, Warenkorb `addStandard` (cart.ts:87) und Serverprüfung (orders.ts:231-249). Ein Artikel mit `beispiel = false` ist heute schon bestellbar. Es fehlen die Kategorie bzw. Navigation „Schließtechnik und Zubehör“ und echte Artikel. Kein neuer Artikeltyp bauen. |
| FA-11-04 | erfuellt | teilweise | Der Mechanismus ist derselbe wie bei FA-11-19, das der Kundschafter selbst mit „teilweise“ bewertet. Ein neues Produkt lässt sich nicht mit allen Pflichtmerkmalen aus 11 pflegen: Bild unsichtbar, kein Feld für System und Codebereich, Hersteller als Freitext. Dazu kommt Seed-Verhalten (siehe Risiken). |
| FA-11-11 | fehlt | teilweise | Das Admin-Feld `produktbild` existiert (Produkte.ts:231), mit Migration und Mapping (payload-mapping.ts:257). Es fehlt nur die Anzeige in Liste und Detailseite. Den Kopf belegt ein generierter Profilschnitt (page.tsx:181-196). Bau ist klein (S). Kein neues Feld anlegen. |

## Bestätigt (Auswahl mit Befund)
- FA-10-02/FA-11-02 widerspricht: verschärft. Die 52 Demo-Linien sind nicht als Beispiel markiert, sind bestellbar und geben in productSchema (json-ld.tsx:176-183) ein Offer mit Status `InStock` aus.
- FA-10-05, FA-10-08, FA-10-11, FA-11-03, FA-11-06, FA-11-18 fehlt: Auch die gezielte Suche fand nichts. Zu eBay: Im Repo liegt keine Angebotsliste, die Treffer in KARTE.md und E1-* sind nur Trefferbilder bzw. Händlerwerte. Der Grep auf „Modifikation“ trifft tuer-und-schliesstechnik/page.tsx:346, aber ohne Bezug zum Thema.
- FA-10-07 fehlt: Die Shop-Kategorie fehlt. Hinweis: Die Leistung `gehaeuse-reparatur` existiert als Terminleistung mit Preisen je Preisgruppe (content/car-key-services.json:60, defaults/pricing.ts:129-158). Diese Daten wiederverwenden und nicht neu erfassen. Die Preise unterliegen G9.
- FA-10-04, FA-11-10, FA-11-12, FA-11-13, FA-11-14, FA-11-15, FA-11-16 erfuellt: Feld, Anzeige und Serverprüfung sind belegt (orders.ts:200-229). Die Daten dazu sind Demo-Daten und gehören zu FA-11-03.

## Präzisierung zu FA-11-02/FA-11-19 (Seed)
Der Seed füllt nicht nur eine leere Datenbank. `eintraegeUebernehmen` (seed.ts:259 ff.) legt bei jedem Lauf jeden JSON-Eintrag an, dessen Kennung die Datenbank noch nicht kennt. Felder in `abgleich` gleicht er ab, solange sie im Backend unverändert sind. Bereits gelöschte Einträge legt er nicht neu an. Wer die Demo-Linien nur aus content/code-lines.json streicht, lässt sie also in der Live-Datenbank stehen. Wer sie nur im Admin löscht, lässt sie in der JSON-Ausweichschicht stehen. Beides muss zusammen geschehen, mit Freigabe des Betreibers.

## Risiken
Siehe strukturierte Rückgabe: Demo-Bestellbarkeit, Seed-Doppelpflege, R13, R8/R12, G9, Tests, Einsendehaftung.

## OFFENE FRAGEN (zusätzlich zu denen des Kundschafters)
- Herkunft der Zylinder-Grundpreise und Maßbereiche (cylinder-catalog.json)?
- Soll R13 bei Schlüssel nach Code für alle Linien eine Sicherungskarte verlangen oder nur für Zylinderlinien? Heute ist das Foto bei 51 von 52 Linien freiwillig.
