# Gehäuse, Ersatzteile und Umbau-Beispiele pflegen

Diese Anleitung ist für das Team im Adminbereich unter `/admin`. Sie beschreibt die Pflege der Daten. Wie die Seiten für Kunden aussehen (Liste mit Filter, Customizing), ergänzt der nächste Ausbau.

Es gibt drei Stellen:

- **Shop › Artikel**: Gehäuse und Ersatzteile sind Standardartikel mit dem Reiter **Gehäuse und Ersatzteile**.
- **Shop › Bauformen**: die Liste der Bauformen, etwa Klappschlüssel, Smart Key oder Karte.
- **Autoschlüssel › Umbau-Beispiele**: echte Umbauten mit Foto vorher und nachher.

Grundsätze:

- Nur eintragen, was Sie geprüft haben. Was Sie hier angeben, sehen Kunden später als Zusage.
- Optischer Umbau nur dort anbieten, wo Elektronik, Transponder, Tasten und Bart technisch passend übernommen werden können.
- Neue Einträge zuerst als Entwurf speichern. Erst **Veröffentlichen** bringt sie auf die Seite. Im Entwurf darf noch etwas fehlen.
- Preise trägt nur der Inhaber ein oder gibt sie frei.
- Nur echte eigene Fotos. Keine Bilder aus fremden Angeboten, keine erzeugten Bilder.

Weitere Anleitungen: [Shop pflegen](shop-pflegen.md), [Admin im Alltag](admin-alltag.md).

## 1. Gehäuse oder Ersatzteil anlegen

Vorher: Gibt es die Bauform unter **Shop › Bauformen**? Wenn nicht, zuerst Abschnitt 2.

1. Unter **Shop** auf **Artikel**, dann **Neu erstellen**.
2. Rechts: **Art des Artikels** „Standardartikel“, **Adresse**, **Verfügbarkeit** und **Kategorie** (etwa „Autoschlüsselgehäuse“).
3. Reiter **Artikel**, **Preis und Versand** und **Bilder** wie bei jedem Standardartikel (siehe [Shop pflegen](shop-pflegen.md)).
4. Reiter **Gehäuse und Ersatzteile**:
   - Haken **Dieser Artikel ist ein Gehäuse oder Ersatzteil für Autoschlüssel** setzen. Erst dann erscheinen die Felder.
   - **Art des Teils**: Gehäuse, Tasten, Gummimatte, Batterie, Klappmechanismus, Schlüsselbart oder weiteres Ersatzteil.
   - **Elektronik und Transponder werden übernommen**: Ja, Nein oder Nur nach Prüfung. Im Zweifel „Nur nach Prüfung“.
   - **Kompatibilitätshinweis** (Pflicht): was vom alten Schlüssel übernommen wird und was nicht passt. Kurz und sachlich.
   - **Bauform**: eine oder mehrere aus der Liste. Bei Gehäusen Pflicht.
   - **Fahrzeugmarke**: genau so geschrieben wie im Fahrzeugkatalog (Autoschlüssel › Fahrzeugkatalog, Spalte Marke). Leer lassen heißt: passt markenübergreifend, etwa bei einer Batterie.
   - **Modelle oder Reihen**: erst die Marke eintragen, dann die Reihen wählen. Die Auswahl zeigt nur Reihen dieser Marke. Leer lassen heißt: passt zu allen Reihen der Marke.
   - **Baujahr von** und **Baujahr bis**: nur, wenn Sie sie wissen. „Bis“ darf nicht vor „von“ liegen.
   - **Tastenzahl**: bei Gehäuse, Tasten und Gummimatte Pflicht. 0 bei Schlüsseln ohne Tasten.
   - **Schlüsseltyp**: zu welchen Schlüsseltypen das Teil passt.
5. **Veröffentlichen**. Fehlt eine Pflichtangabe, nennt die Meldung oben das Feld.

Gut zu wissen:

- Ohne Haken oder ohne Pflichtangaben gilt der Artikel nicht als Gehäuse oder Ersatzteil. Er bleibt ein normaler Artikel ohne Fahrzeugbezug.
- Filter für Kunden zeigen ein Teil nur bei Merkmalen, die Sie eingetragen haben. Ein Gehäuse ohne Tastenzahl erscheint also nicht, wenn jemand nach „3 Tasten“ filtert.
- Eine Marke, die nicht im Fahrzeugkatalog steht, lehnt das Speichern ab. Fehlt eine Marke dort, bitte im Fahrzeugkatalog nachsehen, wie sie geschrieben ist.

## 2. Bauform anlegen oder ändern

1. Unter **Shop** auf **Bauformen**, dann **Neu erstellen**.
2. **Name**, so wie Kunden die Bauform kennen. Jeden Namen nur einmal.
3. **Kurze Erklärung**: optional, ein Satz, woran man die Bauform erkennt. Nur, was Sie belegen können.
4. **Reihenfolge**: kleinere Zahl steht weiter vorn.
5. **Adresse** leer lassen, sie wird aus dem Namen gebildet. Die **Kennung** bleibt danach fest.

Startbestand: Klappschlüssel, Smart Key, Karte, Fernbedienung, Schlüsselkopf. Eine Bauform, die Sie in den Papierkorb legen, kommt beim nächsten Einspielen nicht wieder.

## 3. Umbau-Beispiel mit Vorher und Nachher

Ein Beispiel erscheint auf der Seite nur, wenn alles vorliegt: veröffentlicht, Foto vorher und nachher mit Beschriftung und der Haken **Fotos freigegeben**. Ohne Beispiele zeigt die Seite keinen Vergleich und keine Platzhalter.

1. Unter **Autoschlüssel** auf **Umbau-Beispiele**, dann **Neu erstellen**.
2. **Titel**: kurz, was umgebaut wurde.
3. **Vorher** und **Nachher**: je ein Foto hochladen und eine **Beschriftung** schreiben. Die Beschriftung steht unter dem Bild und beschreibt es für Menschen, die das Bild nicht sehen.
4. **Fahrzeugmarke** und **Modell oder Reihe**: optional, wie beim Gehäuse aus dem Fahrzeugkatalog.
5. **Schlüsseltyp** und **Was übernommen wurde** (Elektronik, Transponder, Tasten, Schlüsselbart, weitere Teile).
6. **Hinweis** (Pflicht): unter welchen Bedingungen sich der Umbau auf andere Schlüssel übertragen lässt und was nicht geht.
7. **Wo das Beispiel erscheint**: Customizing, Gehäuse, Reparatur.
8. Fotos prüfen: Kennzeichen, Fahrzeugschein und Schlüsselnummern unkenntlich. Der Kunde ist einverstanden. Dann Haken **Fotos freigegeben**.
9. **Veröffentlichen**.

Ohne Fotos lässt sich ein Beispiel nur als Entwurf speichern.

## 4. Vorschau

Die Seiten mit Liste, Filter und Vergleich baut der nächste Ausbau. Bis dahin sehen Sie Gehäuse auf der Seite des Artikels unter `/artikel/…` wie jeden Standardartikel.
