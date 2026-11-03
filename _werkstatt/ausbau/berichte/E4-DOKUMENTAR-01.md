# E4-DOKUMENTAR-01 · Bericht

Stand 2026-11-03, UTC. Ergebnis: Die vier Texte sind erfasst und neutralisiert, die Entscheidungen des Koordinators sind umgesetzt. Die neutrale Datei liegt unter daten/ und wird nicht committet.

## GEÄNDERTE DATEIEN
- _werkstatt/ausbau/daten/E4-blind-startseite.md (neutrale Datei: Leitanfrage, Faktenblatt mit 28 Einträgen, vier Texte)
- _werkstatt/ausbau/daten/E4-blind-schluessel.md (Zuordnung, Fundstellen, Abrufprotokoll)
- _werkstatt/ausbau/berichte/E4-DOKUMENTAR-01.md (dieser Bericht)

## WAS UND WARUM
- Die eigene Startseite wurde nach der Berichtigung neu gelesen.
- Fremde Startseiten per curl: je Domain robots.txt, dann die Startseite, mindestens 1,5 Sekunden Abstand, nur GET. Die robots.txt aller drei Seiten erlauben die Startseite für allgemeine Abrufer.
- Der sichtbare Text stammt aus einem Auszug aus dem HTML. Navigation, Fußbereiche, Cookie-Hinweise und Rechtstexte sind weggelassen.
- Fachwissen (F1 bis F15) und Angaben eines Anbieters zu seinem Angebot (B1 bis B13) stehen ohne Dateinamen. Die Fundstellen liegen in daten/.
- Personennamen aus Bewertungen, das Zitat einer bekannten Person und ein Gründername sind durch [Name] ersetzt.

## GEMEINSAME DATEIEN
Keine Änderung erbeten.

## PRÜFUNG UND ERGEBNIS
- Abrufe: sechs curl-Aufrufe, alle HTTP 200. Die Ergebnisse des ersten WebFetch-Laufs sind verworfen.
- Ersetzungen gesamt: Anbieter-Name und Marke 4, Domains 2, Orte 14, Telefonnummern 6, Personennamen 18. Ausgeschlossene Zeilen gesamt: 38.
- Selbstprüfung der neutralen Datei: je 0 Treffer für Anbieternamen, Domains, Telefonnummern, Projektdateinamen (.md) und Personennamen. Eine Ausnahme: Ein Firmenname eines Herstellers enthält einen Personennamen. Herstellernamen bleiben nach Vorgabe.
- Auffälligkeiten: Eine robots.txt enthält Anweisungen an KI-Agenten. Sie sind als Daten vermerkt und nicht befolgt. Eine Textstelle stammt aus dem HTML. Ihre Sichtbarkeit ist ohne Browser nicht geprüft.

## BELEGE
- Zuordnung, Fundstellen je Fakt, Abrufprotokoll und Prüfsummen: _werkstatt/ausbau/daten/E4-blind-schluessel.md (nicht committet)
- Neutrale Datei: _werkstatt/ausbau/daten/E4-blind-startseite.md (nicht committet)

## OFFENE FRAGEN
Keine. Die Entscheidungen des Koordinators sind umgesetzt.
