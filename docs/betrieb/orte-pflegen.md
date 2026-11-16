# Ortsseiten pflegen

Diese Anleitung ist für das Team im Adminbereich. Sie zeigt, wie Sie eine Ortsseite aus dem Ortsstamm anlegen, wann sie in Suchmaschinen erscheint, wie Sie eine Partnerregion zuordnen und wie der Ortsstamm aktualisiert wird.

Zwei Ebenen sind getrennt:

- **Orte (Stamm)** unter **Inhalte > Orte (Stamm)**: alle rund 10.750 Gemeinden aus dem amtlichen Gemeindeverzeichnis. Nur lesbar. Daraus entsteht keine Seite.
- **Einsatzgebiete** unter **Inhalte > Einsatzgebiete**: die Ortsseiten, die Sie selbst anlegen und schreiben. Nur diese Seiten gibt es unter `/standorte/…`.

## 1. Neue Ortsseite aus dem Stamm anlegen

1. Unter **Inhalte > Orte (Stamm)** die Gemeinde suchen und den **Gemeindeschlüssel** (acht Ziffern) notieren. Bei gleichnamigen Gemeinden auf Kreis und Land achten (es gibt etwa zwei Gemeinden „Amberg“).
2. Unter **Inhalte > Einsatzgebiete** einen neuen Eintrag anlegen: Stadt, Bundesland, **Örtliche Einleitung**, Angaben, angebotene Leistungen.
3. Im Abschnitt **Ortsstamm und Veröffentlichung** den Gemeindeschlüssel eintragen. Landkreis und Postleitzahlen erscheinen dann von selbst auf der Seite. Die Stufe „in Anhang A“ setzt das System aus der Prioritätsliste.
4. **Priorität** nur eintragen, wenn die Reihenfolge des Inhabers eine andere ist als in Anhang A. Leer bedeutet: Platz in Anhang A, sonst hinten.
5. **Suchvolumen** und **Fahrzeit zur Werkstatt** leer lassen, bis eine belegte Zahl mit Quelle vorliegt. Nichts schätzen.
6. Speichern und veröffentlichen.

Je Gemeinde gibt es eine Ortsseite. Liegt eine Ortsseite derselben Gemeinde im Papierkorb, behält sie ihren Schlüssel, und das Speichern meldet das. Stellen Sie dann die Seite aus dem Papierkorb wieder her, oder leeren Sie dort den Gemeindeschlüssel.

Die Einleitung schreiben Sie für diesen Ort selbst. Ein Text, der einer anderen Ortsseite gleicht und nur einen anderen Ortsnamen trägt, zählt nicht.

## 2. Wann erscheint eine Ortsseite in Suchmaschinen?

Eine veröffentlichte Ortsseite ist immer erreichbar. In Suchmaschinen und in der Sitemap steht sie nur, wenn alles zutrifft:

1. **Eigener Text:** Die Einleitung hat keinen Platzhalter, mindestens 160 Zeichen und gleicht keiner anderen Ortsseite (auch nicht bis auf den Ortsnamen).
2. **Am Stamm:** Der Gemeindeschlüssel ist eingetragen und steht im Ortsstamm. Daraus kommen Landkreis und Postleitzahlen.
3. **Leistungsweg:** mindestens eines davon:
   - die Werkstatt liegt in diesem Ort oder im selben Landkreis,
   - ein freigeschalteter Partnerbetrieb deckt eine Postleitzahl des Orts für Autoschlüssel ab (pausierte und gesperrte zählen nicht),
   - im Feld **Konkrete Verfügbarkeit** steht ein eigener Text (etwa feste Tage vor Ort). Dieser Text erscheint auf der Seite. Nur Belegtes eintragen.

Fehlt etwas, steht die Seite auf „noindex“. Über der Liste der Einsatzgebiete zeigt die Tabelle **Veröffentlichung der Ortsseiten** je Seite, ob sie in Suchmaschinen steht, und sonst den Grund. Neben dem Gemeindeschlüssel steht der Name der Gemeinde im Stamm; passt er nicht zum Ort, steht dort ein Hinweis. Dann ist meist der Schlüssel falsch. Der Schalter „nicht in Suchmaschinen“ im SEO-Bereich gilt zusätzlich.

Auf der Seite stehen Landkreis und Postleitzahlen aus dem Stamm, die angebotenen Leistungen, der Satz „In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner.“ (nur wenn ein Partner abdeckt, nie mit Namen) und ein Knopf je Lage: Termin in unserer Werkstatt (mit ihrem Ort; die Anschrift steht im Kopf der Seite), Termin bei einem Partner (nur wenn der Partnerweg eingeschaltet ist) oder Anfrage. Im Fuß steht der Quellenvermerk.

## 3. Partnerregion zuordnen

1. Am Partnerbetrieb (**Aufträge > Partnerbetriebe**) das Einsatzgebiet pflegen: Postleitzahlen (etwa `35*, 36043`), einen Umkreis (mit der Postleitzahl des Betriebs) oder Orte und Landkreise mit amtlichem Schlüssel. Für „Partner deckt ab“ reicht eines davon. Umkreis und Orte und Landkreise wirken erst, wenn in der Prüfliste des Betriebs der Punkt „Region und Radius“ abgehakt ist; die Postleitzahlen wirken immer. Die Regel steht in `docs/betrieb/partner-pruefen.md`, Abschnitt 6.
2. An der Ortsseite im Feld **Partnerregion** den Betrieb wählen. Das Feld dokumentiert die Zuordnung für das Team. Auf der Seite erscheint nie ein Name.
3. Ob ein Partner den Ort abdeckt, zeigt die Spalte „Partner deckt ab“ der Tabelle über der Liste und die Spalte „Partner vorhanden“ der Prioritätsorte.

## 4. Prioritätsorte

Unter der Tabelle der Ortsseiten steht aufklappbar die Liste **Prioritätsorte des Inhabers (Anhang A)**: Land, Rang, Ort, Seite vorhanden, veröffentlicht, Partner vorhanden und die Zahl der Vorgänge der letzten zwölf Monate (gezählt über die Postleitzahl im Vorgang). Die Liste ist nur eine Anzeige: Aus ihr entsteht keine Seite, und die Zahlen setzen keine Priorität.

Steht bei einem Ort „offen, bitte bestätigen“, ist die Gemeinde nicht eindeutig. Der Inhaber bestätigt; danach trägt ein Entwickler die Zuordnung ein (siehe `content/orte/LIZENZ.md`).

## 5. Ortsstamm aktualisieren

Das Gemeindeverzeichnis erscheint einmal im Jahr. Ein Mensch beschafft die neue Ausgabe und die Postleitzahlen von GeoNames; ein Entwickler führt den Ablauf aus `content/orte/LIZENZ.md` (Abschnitt Aktualisierung) aus. Der Lauf meldet neue, entfallene und umbenannte Gemeinden über den Gemeindeschlüssel und fasst Ortsseiten nicht an. Adressen bleiben gleich.

Nach einer Gebietsreform kann ein Gemeindeschlüssel entfallen. Die Ortsseite zeigt dann „nicht im Stamm“ in der Tabelle; tragen Sie den neuen Schlüssel ein.

## Quellen

Gemeindeverzeichnis: Statistisches Bundesamt (Destatis), Gebietsstand 31.12.2025. Postleitzahlen: GeoNames, CC BY 4.0. Der Vermerk steht auf `/standorte` und im Fuß jeder Ortsseite mit Daten aus dem Stamm.
