# E2-DATENPFLEGER-01 · Zuordnung der 216 offenen Anforderungen

## GEÄNDERTE DATEIEN
- `_werkstatt/ausbau/erhebung/E2-zuordnung.json` (neu, 216 Einträge im vorgegebenen Format)
- `_werkstatt/ausbau/berichte/E2-DATENPFLEGER-01.md` (neu, dieser Bericht)

## WAS UND WARUM
Jede Kennung aus der Liste „rest“ steht genau einmal in der Zuordnung (L 35, EL 42, M 36, E 103).
Ergebnis: **132 Paket**, **78 Menschensache**, **6 neu**. Die 132 Paketeinträge verteilen sich auf 45 Pakete. Am häufigsten: E6-OPUS-01 (13), E8-OPUS-01 (11), E8-OPUS-02 (10), E6-BAUMEISTER-05 (9), E9-OPUS-01 (8), E3-OPUS-01, E4-JURY-01, E4-OPUS-03, E8-TEXTER-01 und EA-JURY-01 (je 7). Die Zahl je Paket steht vollständig in der Zuordnungsdatei.

- Wirkungsaussagen (L-001, L-002, L-008, L-009, L-042, E-28, EL-15) gehen an E4-JURY-01 und EA-JURY-01.
- Fotos, Preise, Rechtstexte, Konten, Öffnungszeiten, Hersteller und Partnerfreischaltung sind Menschensachen mit Verweis auf einen MA- oder M-Eintrag.
- Die 33 M-Einträge verweisen auf sich selbst. M-10, M-11 und M-13 haben einen Codeanteil und gehen an E3-UPGRADE-01, E3-PRUEFER-01 und EA-OPUS-01.
- L-130 („beliebig viele Zylinder“) widerspricht G-28 (Sets 2 bis 10, Bestand bis 30). Nach Abschnitt 3 gilt das Gespräch, die Entscheidung liegt bei MA-13.

Neu-Vorschläge, alle sechs:
- L-120, E-13, E-89, E-90: Paket NEU-S Schlüssel nach Code mit Suche und Codeerkennung, Filter nach Typ, Codelinie und Anwendung sowie kompakter Produktseite. Das Wort „Shop“ kommt in keinem Paket von PLAN.json vor.
- L-427 (Phase 5) und EL-78 (Matching automatisieren): Konzeptnotiz in KONZEPTE.md. Ein Status „später“ ist nur für G-21 und G-50 zulässig.

## GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste)
1. `_werkstatt/ausbau/MENSCHEN.md`: neue Zeile nach MA-15:
   `| MA-16 | **Partnerfreischaltung**: Gewerbe, fachliche Eignung und Identität je Partner prüfen, Preisregeln und Zuverlässigkeit vereinbaren, Berechtigungsnachweis bei Autoschlüsseln festlegen, mit wenigen seriösen Partnern starten. | Vor jeder Freischaltung und vor der ersten Vermittlung. | Kein Partner wird freigeschaltet. | Nachricht: `ANTWORTEN: Partnerfreischaltung …` |`
   Verweise darauf: E-43, EL-67, EL-68, EL-69, EL-77.
2. `_werkstatt/ausbau/ANFORDERUNGEN.json`: Feld `pakete` je Eintrag aus der Zuordnungsdatei übernehmen, sobald der Orchestrator entschieden hat.
3. `_werkstatt/ausbau/ANFORDERUNGEN.json`: M-17 als umgesetzt mit Beleg aufnehmen (siehe OFFENE FRAGEN 1).
4. `_werkstatt/ausbau/PLAN.json` über E2-OPUS-02: Paket NEU-S anlegen, falls der Orchestrator zustimmt.

## PRÜFUNG UND ERGEBNIS
- 216 Einträge, jede Kennung einmal, Reihenfolge wie in „rest“. Die Datei wurde mit python3 gelesen und ist gültiges JSON.
- Alle 45 genannten Pakete existieren in PLAN.json (python3-Prüfung).
- Alle 78 Menschensachen haben einen Verweis. 73 zeigen auf vorhandene Einträge, 5 auf den neuen Eintrag MA-16 (siehe GEMEINSAME DATEIEN 1).
- Neu-Einträge haben leere Paketliste. Jeder Grund ist ein Satz ohne Gedankenstriche.

## BELEGE
- `ANFORDERUNGEN.json` (Inhalt, Bestand, Fundstelle je Eintrag), `PLAN.json` (127 Pakete).
- `_werkstatt/ausbau/MENSCHEN.md` (MA-01 bis MA-15), `docs/gestaltung/MENSCHEN.md` (M-01 bis M-37 ohne M-17).
- `AUFTRAG.md` Abschnitte 3, 4 (G-08, G-28, G-40), 10 bis 15.
- Bestandsbefunde aus `berichte/E0-DATENPFLEGER-01.md` bis `-03` (etwa L-115, L-118, L-127, L-130).

## OFFENE FRAGEN
1. M-17 (Beschreibungen der Codelinien, erledigt am 25.10.2026) fehlt in ANFORDERUNGEN.json. E0-DATENPFLEGER-03 hat ihn bewusst ausgelassen. Soll er als umgesetzt mit Beleg aufgenommen werden?
2. Soll das Paket NEU-S entstehen? Ohne Paket bleiben L-120, E-13, E-89 und E-90 offen.
3. L-427 und EL-78 haben kein Paket. Konzeptnotiz in KONZEPTE.md oder bewusst kein Eintrag?
4. E-131 (Suchvolumina, Ergebnisbilder) ist E1-RECHERCHEUR-05 zugeordnet, das noch läuft. Bitte bestätigen.
5. E-31, E-98 und EL-23 sind Menschensache (M-37), E-33 und EL-26 gehen an E8-OPUS-01 (M-37). Die Abgrenzung ist eine Vorentscheidung.
