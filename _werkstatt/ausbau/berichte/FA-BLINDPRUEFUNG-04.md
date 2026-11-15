# FA-BLINDPRUEFUNG-04 · Blindprüfung Kundschafter-Bericht 04 (Stadt- und Regionsseiten, Ortsdatenbasis)

Stufe 3, nur lesen. Grundlage: Arbeitsanweisung Zeilen 245-268 (Abschnitt 09), 710-804 (Anhang A mit „Technischer Auftrag“), 825-826 (Anhang B, letzter Punkt).

## Vollständigkeit der Anforderungsliste
Abschnitt 09: Einleitung (skalierbar), amtliche Basis, 3 Punkte, 2 Punkte, Kasten „Wichtig“ = 8 → FA-09-01 bis 08.
Anhang A: Einleitung (3 Aussagen) → AA-01 bis 03, Liste → AA-09, Technischer Auftrag (5 Punkte) → AA-04 bis 08. Anhang B letzter Punkt → AB-05.
Nichts übersehen.

## Nachprüfung
18 Urteile an Code und Daten nachgeprüft, 17 bestätigt, 1 geändert.

### Geändert
- **FA-AA-04 fehlt → teilweise.** `scripts/karte-aufbereiten.mjs:19,29,101` liest die bundesweite BKG-VG250-Datei (`DE_VG250.gpkg`, alle Gemeinden mit AGS, Name, Art) über `node:sqlite` und filtert nur per `WHERE SN_L = '06'` auf Hessen; mit Prüfsummen, Sollzahlen und Abbruch bei Abweichung (`content/karte/LIZENZ.md` „Erzeugung und jährliche Aktualisierung“). Ein wiederholbarer Importweg aus einer amtlichen Vollquelle existiert also, nur auf Hessen beschränkt und mit Kartenformen statt Datenbankeinträgen als Ziel. Zudem war das Urteil inkonsistent zu FA-09-07 (teilweise), das dieselbe Pflicht beschreibt. Wiederverwenden statt neu bauen.

### Bestätigt, mit Ergänzungen
- FA-09-01/03/08: Sammlung `einsatzgebiete` nur `stadt`, `bundesland` (Freitext), kein AGS, keine PLZ, kein Kreis. Bestand 1 Datensatz (Wetzlar); `defaults/content.ts:718-726` bewusst leer.
- FA-09-02/AA-02/AB-05: Hessen-Daten (425 Einträge = 421 Gemeinden + 4 gemeindefreie Gebiete) werden von `src/` nirgends gelesen (Suche nach `content/karte`, `hessen-gemeinden` ohne Treffer außerhalb des Skripts). Rohdaten liegen derzeit nicht lokal (`_werkstatt/ausbau/daten/geo/` existiert nicht).
- FA-09-04/AA-05: `payload-adapter.ts:108-110` sortiert nach `id`. Suchvolumen wurde nie erhoben (`erhebung/E1-nachfrage.md:166`). Partner-PLZ (`Partnerbetriebe.ts:85-93`) nur im Vertrags-PDF verwendet (`src/lib/pdf/partnervertrag.ts:104,132`).
- FA-09-05/AA-03/AA-06: Gate `stadtIndexierbar` prüft Platzhalter plus manuelles `seo.noindex`; zusätzlich Entwurfsstatus (`VEROEFFENTLICHT`). Kein Mehrwert- oder Leistungsweg-Kriterium. Urteil hält.
- FA-09-06: Fundstelle `page.tsx:207-223` existiert nicht (Datei hat 214 Zeilen). Ergänzung: fester Knopf „Autoschlüssel-Termin“ (`page.tsx:120-124`) auf jeder Ortsseite, auch wenn der Ort `autoschluessel` nicht anbietet; Kontaktweg also starr, nicht aus den Leistungen abgeleitet.
- FA-AA-07: bleibt fehlt; Bausteine: `kreis`-Zuordnung je Gemeinde in `hessen-gemeinden.json`, Partner-PLZ-Feld. Keine Verknüpfung im System.
- FA-AA-08: Slug und Kennung eindeutig (Migration 1333-1334). Abgleich nachgerechnet: 7 von 35 Hessen-Namen weichen ab (Oberursel, Langen, Neu Isenburg, Limburg an der Lahn, Friedberg Hessen, Mörfelden Walldorf, Bad Homburg vor der Höhe); teils Bindestrichverlust durch die PDF-Extraktion. Abgleich muss über AGS laufen, nicht über Namen.
- FA-AA-09: 348 Einträge nachgezählt, bestätigt.
- Offene Frage des Kundschafters erledigt: `_werkstatt/ausbau/daten/` ist per `_werkstatt/ausbau/.gitignore:3` ausgeschlossen.

## Risiken
1. Postleitzahlen: VG250 und GV-ISys enthalten keine vollständige PLZ-Zuordnung. PLZ-Daten der Deutschen Post sind lizenzpflichtig, OSM-Ableitungen unterliegen ODbL (Share-Alike). OFFENE FRAGE an den Inhaber.
2. Pflichtvermerk dl-de/by-2-0 (BKG, Destatis) muss sichtbar verlinkt werden, sobald Daten öffentlich genutzt werden; derzeit auf keiner Seite. Lizenz von GV-ISys ungeprüft (OFFENE FRAGE).
3. R2/R3, Leitfaden §5, `KARTE.md:11`: Ortsdatenbank (rund 11 000 Gemeinden) getrennt von veröffentlichten Ortsseiten halten; kein Massenanlegen in `einsatzgebiete`, keine automatische Veröffentlichung.
4. Skalierung: `alle()` lädt alle Dokumente ohne Paginierung mit depth 1, `getCity` sucht linear, `generateStaticParams` und Sitemap bauen alle. Bei Tausenden Einträgen Build- und Laufzeitlast.
5. Gebietsreformen ändern AGS und Namen: Slugs stabil halten, Weiterleitungen vorsehen.
6. Bestehende Tests: `src/app/sitemap.test.ts:64-69` (Wetzlar rein, Berlin raus), `payload-mapping.test.ts`, `leitfaden.db.test.ts`. Schemaänderung nur additiv (G6) mit JSON-Fallback in `json-adapter.ts`/`cities.json`.
7. G13: Prioritätsliste und Partnergewinnung sind intern; Prioritätswerte nicht ins öffentliche Repo, sondern in die Datenbank oder nach `_werkstatt/ausbau/daten`.
8. Partnerbezug auf öffentlichen Seiten: Nennung von Partnern braucht Vertrag und Einwilligung (Datenschutz, Wettbewerbsrecht); Partner-PLZ sind Teamdaten (Zugriff `istTeam`).
9. R8: `serviceAreaSchema` darf nur sichtbare Leistungen und Gebiete behaupten, auch nach Ausbau.
