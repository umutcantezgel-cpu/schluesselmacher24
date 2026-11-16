# Shop pflegen: Codeprodukte, Kategorien, Preise, Bilder und Verfügbarkeit

Diese Anleitung ist für das Team im Adminbereich unter `/admin`. Alles hier geht ohne Entwickler. Der Shop steht links in der Gruppe **Shop** mit drei Listen:

- **Artikel**: alle Produkte, also Schlüssel nach Code und Standardartikel.
- **Shop-Kategorien**: Kategorien und Unterkategorien des Shops.
- **Hersteller**: die Liste der Hersteller. Artikel wählen ihren Hersteller hier aus.

Grundsätze:

- Neue Artikel zuerst als Entwurf speichern. Erst **Veröffentlichen** bringt sie auf die Seite.
- Was Sie speichern, prüft die Seite. Passt etwas nicht, steht oben eine Meldung in Klartext und das Feld ist rot markiert.
- Löschen legt einen Eintrag in den Papierkorb. Von dort lässt er sich wiederherstellen. Endgültig löschen kann nur der Inhaber.
- Nur echte eigene Fotos hochladen. Keine Bilder oder Texte aus fremden Angeboten übernehmen.

Weitere Anleitungen: [Admin im Alltag](admin-alltag.md).

## 1. Neues Codeprodukt anlegen

Vorher: Gibt es den Hersteller schon unter **Shop › Hersteller**? Wenn nicht, zuerst Abschnitt 3 „Hersteller anlegen“.

1. Links unter **Shop** auf **Artikel** klicken, dann oben rechts auf **Neu erstellen**.
2. Rechts in der Seitenleiste:
   - **Art des Artikels**: „Schlüssel nach Code“.
   - **Adresse (URL-Teil)**: etwa `briefkasten-serie-100`. Nur Kleinbuchstaben, Ziffern und Bindestriche.
   - **Verfügbarkeit**: meist „Lieferbar“.
   - **Kategorie**: „Schlüssel nach Code“ oder eine ihrer Unterkategorien.
   - Den Haken **Beispielartikel** nicht setzen.
3. Reiter **Artikel**:
   - **Name** und **Beschreibung** eintragen.
   - **Hersteller** aus der Liste wählen. Pflicht beim Veröffentlichen.
   - **System**: so, wie der Hersteller das Schließsystem nennt. Pflicht beim Veröffentlichen.
   - **Codebereich**: von bis oder Muster, wie der Hersteller es angibt, etwa „1 bis 999“. Pflicht beim Veröffentlichen.
   - **Schlüsseltyp**, **Einsatzbereich**, **Lieferumfang** und, falls bekannt, **Lieferzeit**.
4. Reiter **Preis und Versand**: **Preis je Stück**, bei Bedarf **Mengenrabatte**, **Höchstmenge je Bestellung** und **Versandklasse**.
5. Reiter **Code**:
   - **Aufbau des Codes (für Kunden)**, etwa „3 bis 4 Ziffern“.
   - **Prüfmuster**, etwa `^[0-9]{3,4}$`. Danach prüft die Seite jeden eingegebenen Code.
   - **Beispielcode**: muss zum Prüfmuster passen, sonst lässt sich nicht speichern.
   - **Wo steht der Code?** und ein Bild der Fundstelle.
   - **Foto vom Schlüssel**: „Pflicht“, wenn der Kunde seine Sicherungskarte zeigen muss.
6. Reiter **Bilder**: **Produktbild** mit eigenem Foto.
7. Reiter **Suchmaschinen**: Titel und Beschreibung, wenn Sie eigene Texte möchten.
8. Unten **Entwurf speichern**. Wenn alles stimmt: **Veröffentlichen**.

Pflichtangaben beim Veröffentlichen: Ein Codeprodukt lässt sich nur mit **Hersteller**, **System** und **Codebereich** veröffentlichen. Fehlt eine Angabe, ist das Feld rot markiert und darunter steht, was fehlt. Als Entwurf dürfen die Felder noch leer sein. Beispielartikel sind ausgenommen. Bei älteren Einträgen genügt als Hersteller auch der alte Freitext (Feld **Hersteller (alter Freitext)**). Platzhalter in eckigen Klammern wie „[Hersteller eintragen]“ zählen nicht.

Ältere Codeprodukte, die schon veröffentlicht sind und eine dieser Angaben nicht haben, bleiben auf der Seite sichtbar. Speichern lassen sie sich aber erst wieder, wenn die fehlende Angabe eingetragen ist. Das gilt auch für kleine Änderungen wie den Preis: zuerst Hersteller oder Codebereich ergänzen, dann speichern.

Auf der Seite stehen Codeprodukte nach Hersteller gruppiert, darunter nach System. Lieferzeit, System und Codebereich erscheinen in der Liste und auf der Seite des Produkts. Die Lieferzeit zeigt die Seite nur, solange das Produkt lieferbar ist.

Schneller geht es mit einer Kopie: Einen ähnlichen Artikel öffnen, oben rechts im Menü **Duplizieren** wählen. Die Kopie bekommt eine neue Adresse mit „kopie“ darin und eine neue Kennung, und sie ist ein Entwurf. Adresse, Name, System, Codebereich und Code anpassen, dann veröffentlichen.

Die Liste **Artikel** zeigt die Spalten Hersteller, System, Preis, Verfügbarkeit und Kategorie. Über **Spalten** oben lassen sich weitere einblenden.

## 2. Neue Kategorie oder Unterkategorie anlegen

1. Links unter **Shop** auf **Shop-Kategorien** klicken, dann **Neu erstellen**.
2. **Name** eintragen. Die **Adresse** in der Seitenleiste dürfen Sie leer lassen, sie wird aus dem Namen gebildet.
3. **Übergeordnete Kategorie**: leer für eine Hauptkategorie. Für eine Unterkategorie hier die Hauptkategorie wählen.
4. **Beschreibung**: ein bis zwei kurze Sätze für Kunden.
5. **Wohin führt die Kategorie?** und **Ziel (Adresse)**: etwa „Schlüssel nach Code (Produktliste)“ mit `/schluessel-nach-code`. Gibt es noch keine Produkte, „Anfrage“ wählen und die Adresse der passenden Anfrage eintragen.
6. **Hinweis, solange Produkte fehlen**: etwa „Direkt bestellen können Sie hier derzeit nicht. Bitte fragen Sie bei uns an.“ Leer lassen, sobald es Produkte gibt.
7. **Reihenfolge**: kleinere Zahl steht weiter vorn. **Im Shop zeigen**: Haken setzen, wenn Kunden die Kategorie sehen sollen.
8. **Speichern**.

Umbenennen: Den **Namen** einfach ändern, die Adresse bleibt dabei gleich. Ändern Sie die **Adresse**, merkt sich die Kategorie die alte unter **Frühere Adressen**.

So erscheinen die Kategorien auf der Seite:

- Die Hauptkategorien mit Haken **Im Shop zeigen** stehen in ihrer Reihenfolge auf der Seite `/shop`. Jede führt auf ihr **Ziel**. Gibt es noch keine Produkte, steht dort der **Hinweis**, und der Knopf heißt **Anfragen**. Den Namen der Kategorie übernimmt nur die Anfrage zu einer Leistung (`/service-und-termin/anfrage`) und die Anfrage nach einem Artikel. Ein eigenes Ziel wie die Gehäuse-Anfrage öffnet sich ohne diese Vorbelegung.
- Jede sichtbare Unterkategorie von **Schlüssel nach Code** hat eine eigene Seite unter `/schluessel-nach-code/kategorie/…`. Ohne Artikel zeigt sie den Hinweis und **Code anfragen** und erscheint nicht in Suchmaschinen. Ändern Sie die Adresse, leitet die frühere Adresse dauerhaft auf die neue weiter.
- Ohne Haken bleibt die Kategorie samt Unterkategorien verborgen.

So erscheinen die Kategorien für Standardartikel (Art „Artikel“):

- Die Liste `/artikel` zeigt die Artikel der ersten Kategorie mit der Art „Artikel“ (heute „Schließtechnik und Zubehör“) und ihrer Unterkategorien, dazu alle Artikel ohne Kategorie. Die Zahl auf der Seite `/shop` zählt genau diese Artikel.
- Gehäuse und Ersatzteile für Autoschlüssel (Artikel mit Angaben zum Fahrzeug) stehen nicht in dieser Liste, sondern nur in der Liste `/autoschluessel/gehaeuse/teile`.
- Ein Artikel in einer Kategorie einer anderen Art (etwa „Autoschlüsselgehäuse“) erscheint in keiner Artikelliste. Wählen Sie für Standardartikel eine Kategorie mit der Art „Artikel“ oder lassen Sie das Feld leer.
- Jede weitere sichtbare Kategorie mit der Art „Artikel“ und jede Unterkategorie davon hat eine eigene Liste unter `/artikel/kategorie/…` mit Name und Beschreibung der Kategorie. Ist dort als **Ziel** `/artikel` eingetragen oder nichts, führt der Knopf im Shop trotzdem auf diese eigene Liste. Ein anderes Ziel bleibt.
- Die Liste einer Hauptkategorie verlinkt ihre Unterkategorien, sobald dort Artikel stehen.
- Ohne Artikel zeigt die Liste den Hinweis und **Artikel anfragen**. Ohne echten Artikel (nur Beispiele oder keine) erscheint sie nicht in Suchmaschinen und nicht in der Sitemap.
- Auf der Seite eines Artikels steht oben in der Pfadzeile seine Kategorie, etwa „Shop › Schließtechnik und Zubehör › Name des Artikels“.

Ein Artikel kommt in eine Kategorie über das Feld **Kategorie** rechts im Artikel.

## 3. Hersteller anlegen

1. Links unter **Shop** auf **Hersteller** klicken, dann **Neu erstellen**.
2. **Name** genau so schreiben wie der Hersteller selbst. Jeden Hersteller gibt es nur einmal; ein zweiter Eintrag mit gleichem Namen wird abgelehnt.
3. **Wofür die Systeme eingesetzt werden**: ein kurzer Satz, nur was Sie belegen können.
4. **Wir bieten Produkte dieses Herstellers an**: Haken setzen, sobald es Produkte gibt.
5. **Logo** nur, wenn der Hersteller die Nutzung erlaubt hat. Dann **Freigabe liegt vor** anhaken und notieren, wer wann zugestimmt hat. Ohne Haken zeigt die Seite kein Logo.
6. **Speichern**.

Bei **Schlüssel nach Code** bekommt ein Hersteller eine eigene Seite unter `/schluessel-nach-code/hersteller/…`, sobald ihm mindestens ein veröffentlichtes Produkt zugeordnet ist. Dort stehen nur seine Produkte, nach System geordnet. Ein Hersteller ohne Produkte hat keine Seite. Das Logo erscheint nur mit Haken **Freigabe liegt vor**, sonst steht der Name als Text.

## 4. Preis ändern

1. **Shop › Artikel**, den Artikel anklicken.
2. Reiter **Preis und Versand**: **Preis je Stück** ändern. Mengenrabatte stehen in Prozent und passen sich dem neuen Preis an.
3. **Veröffentlichen**. Die Seite zeigt den neuen Preis beim nächsten Aufruf.

Bestellungen, die schon eingegangen sind, behalten ihren Preis.

## 5. Bild tauschen

1. **Shop › Artikel**, den Artikel anklicken, Reiter **Bilder**.
2. Unter **Produktbild** beim Feld **Foto (optional)** das alte Foto entfernen und ein neues hochladen oder aus der Medienablage wählen.
3. **Motiv** kurz beschreiben, etwa „Schlüssel der Serie 100 von vorn“. Das dient auch als Bildbeschreibung für Menschen, die nicht sehen.
4. **Veröffentlichen**.

Das Produktbild erscheint in der Liste und oben auf der Seite des Produkts. Ohne Foto zeigt die Liste ein Symbol und die Seite eine Zeichnung zum Beispielcode. Weitere Bilder (Galerie) zeigt die Seite bisher nur bei Standardartikeln.

## 6. Produkt auf „nicht lieferbar“ setzen

1. **Shop › Artikel**, den Artikel anklicken.
2. Rechts in der Seitenleiste **Verfügbarkeit** wählen:
   - **Lieferbar**: Kunden legen den Artikel in den Warenkorb.
   - **Auf Anfrage**: kein Warenkorb. Die Seite zeigt **Code anfragen** (bei Artikeln **Artikel anfragen**).
   - **Derzeit nicht lieferbar**: kein Warenkorb, keine Bestellung. Die Seite sagt es ruhig und zeigt die Übersicht.
3. **Veröffentlichen**.

Liegt der Artikel schon in einem Warenkorb, kennzeichnet der Warenkorb die Position mit der Verfügbarkeit und bittet den Kunden, sie zu entfernen. Die Kasse nimmt die Bestellung nicht an.

Soll ein Artikel gar nicht mehr erscheinen, legen Sie ihn in den Papierkorb (oben rechts im Menü **Löschen**). Artikel, auf die sich Bestellungen beziehen, lassen sich nicht endgültig löschen.

## 7. Vorschau

Oben rechts im Artikel öffnet **Vorschau** die Seite des Artikels. Sie zeigt die veröffentlichte Fassung. Ein Entwurf ist dort erst nach dem Veröffentlichen zu sehen.

## 8. Angebote aus einer Tabelle übernehmen

Viele Codeprodukte auf einmal, etwa die bestehenden Angebote, kommen über eine Tabelle in den Shop. Das Skript prüft jede Zeile und rät nichts. Passt etwas nicht, bricht es ab, nennt jede Stelle und ändert nichts.

1. Die Vorlage `_werkstatt/ausbau/erhebung/boegen/SORTIMENT-vorlage.csv` in einem Tabellenprogramm öffnen. Die zwei Zeilen mit „Beispiel“ sind nur Muster und werden nie übernommen.
2. Je Angebot eine Zeile ausfüllen:
   - **hersteller**: genau wie unter **Shop › Hersteller**. Steht er dort nicht, schlägt das Skript einen neuen Eintrag vor. Legen Sie ihn zuerst an (Abschnitt 3).
   - **system** und **codebereich**: wie der Hersteller sie nennt, etwa „1 bis 999“.
   - **beispielcode** und **codeformat**: das Prüfmuster, etwa `^[0-9]{3,4}$`. Der Beispielcode muss dazu passen.
   - **preis**: Preis je Stück, etwa `9,90`. **staffel** freiwillig, etwa `3:8,90|5:7,90` (ab 3 Stück 8,90 Euro je Stück, ab 5 Stück 7,90 Euro).
   - **max_stueck**: höchstens so viele Stück je Bestellung, 1 bis 99.
   - **hinweise**: wo der Code steht. **bild_datei**: Name des eigenen Fotos. Das Foto laden Sie danach im Backend hoch (Abschnitt 5).
   - **kategorie**: leer für „Schlüssel nach Code“ oder der Name einer ihrer Unterkategorien.
   - **quelle**: woher die Angaben stammen, etwa die Nummer Ihres eigenen Angebots. Pflicht.
   - **schluesseltyp** freiwillig, etwa „Flachschlüssel“. Landet im Feld **Schlüsseltyp**.
   - **einsatz** freiwillig, etwa „Briefkasten“. Landet im Feld **Einsatzbereich**. Leer bleibt dort wie bisher Hersteller und System.
   - Die beiden freiwilligen Spalten dürfen in der Tabelle auch ganz fehlen.
3. Als CSV (UTF-8, Semikolon) unter `_werkstatt/ausbau/eingang/sortiment.csv` speichern.
4. Ein Entwickler oder der Betrieb ruft `node scripts/sortiment-import.mjs --trocken` auf. Das prüft nur. Ohne Meldung folgt `node scripts/sortiment-import.mjs`. Es schreibt die Angebote in `content/code-lines.json`. Dort stehen sie zunächst unsichtbar (`"active": false`): Kunden sehen noch nichts.
5. `npm run seed` legt die neuen Angebote in der Datenbank als **Entwurf** an. Vorhandene Einträge bleiben unberührt.
6. Danach jedes neue Produkt im Backend öffnen: Produktbild hochladen, Texte prüfen, **Veröffentlichen**. Erst dann steht es im Shop.

Nur eigene Angaben und Fotos verwenden. Keine Texte oder Bilder aus Angeboten anderer übernehmen.
