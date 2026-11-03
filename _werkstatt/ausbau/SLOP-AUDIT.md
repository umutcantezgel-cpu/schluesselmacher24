# SLOP-AUDIT · Vorher-Index

Stand: 3. November 2026 · Paket E0-PRUEFER-08 · Spalte „nachher“ bleibt leer und wird im Nachher-Lauf gefüllt.

## Methode

- Stand des Produktionsservers: `next start` auf http://localhost:3000, Build-Kennung WOrCmISk5BVFwUFHanPQt.
- Werkzeug slopscan.mjs (Protokoll E0-vorher-slop.json): S1 bis S8 je Gerät, mobil 390 × 844 und desktop 1440 × 900, je Hauptansicht.
- Werkzeug stil.mjs (Protokoll E0-vorher-stil.json): S9 aus Gedankenstrichen, Floskeln, unnötigen Bindestrichen, Ausrufezeichen und Platzhaltern, Gerät desktop, sichtbarer Text von main und footer. Die Werte gelten je Hauptansicht. Die Seitenliste umfasst die 181 indexierbaren Seiten aus E0-vorher-inventar.json und zusätzlich H13 /kasse (noindex, eigens geprüft).
- Angaben in S1 bis S8 als „mobil / desktop“. Der Slop-Index ist die Summe S1 bis S8 je Gerät, so wie slopscan.mjs ihn zählt. S9 steht getrennt und ist nicht im Index enthalten.
- Emoji und Fragen aus stil.mjs gehören nicht zu S9; sie stehen im Protokoll.

## Tabelle je Hauptansicht

| Ansicht | Pfad | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 (Text) | Slop-Index vorher (m / d) | nachher |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H01-start | `/` | 1 / 1 | 3 / 3 | 7 / 7 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 23 | 13 / 13 |  |
| H02-autoschluessel | `/autoschluessel` | 1 / 1 | 0 / 0 | 7 / 7 | 0 / 0 | 1 / 1 | 4 / 4 | 0 / 0 | 1 / 1 | 20 | 14 / 14 |  |
| H03-modell-golf | `/autoschluessel/marken/volkswagen/golf` | 1 / 1 | 0 / 0 | 10 / 10 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 28 | 13 / 13 |  |
| H04-autoschluessel-anfrage | `/autoschluessel/anfrage` | 1 / 1 | 0 / 0 | 2 / 2 | 0 / 0 | 0 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 14 | 4 / 5 |  |
| H05-code | `/schluessel-nach-code` | 1 / 1 | 0 / 0 | 14 / 14 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 15 | 16 / 16 |  |
| H06-code-produkt | `/schluessel-nach-code/ms-01` | 1 / 1 | 0 / 0 | 6 / 6 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 17 | 9 / 9 |  |
| H07-foto | `/schluessel-nach-vorlage` | 1 / 1 | 0 / 0 | 7 / 7 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 22 | 10 / 10 |  |
| H08-einschicken | `/schluessel-einschicken` | 1 / 1 | 0 / 0 | 5 / 5 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 19 | 8 / 8 |  |
| H09-sperrschliessung-konfigurator | `/gleichschliessende-zylinder/konfigurator` | 1 / 1 | 0 / 0 | 2 / 2 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 13 | 5 / 5 |  |
| H10-schliessanlagen | `/schliessanlagen` | 1 / 1 | 4 / 4 | 7 / 7 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 22 | 14 / 14 |  |
| H11-schliessanlagen-konfigurator | `/schliessanlagen/konfigurator` | 1 / 1 | 1 / 1 | 2 / 2 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 12 | 6 / 6 |  |
| H12-partner-werden | `/partner-werden` | 1 / 1 | 0 / 0 | 4 / 4 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 13 | 7 / 7 |  |
| H13-kasse | `/kasse` | 1 / 1 | 0 / 0 | 2 / 2 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 1 / 1 | 11 | 5 / 5 |  |
| H14-ratgeber-messen | `/ratgeber/zylinder-richtig-ausmessen` | 1 / 1 | 0 / 0 | 1 / 1 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 13 | 3 / 3 |  |

