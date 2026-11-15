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
   - **Hersteller** aus der Liste wählen.
   - **System**: so, wie der Hersteller das Schließsystem nennt. Pflicht bei Codeprodukten.
   - **Codebereich**: von bis oder Muster, wie der Hersteller es angibt, etwa „1 bis 999“.
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

Hinweis: Lieferzeit, System und Codebereich erscheinen bei Schlüsseln nach Code mit dem nächsten Ausbau der Shopseiten. Tragen Sie sie trotzdem jetzt schon ein. Bei Standardartikeln steht die Lieferzeit schon auf der Seite.

Schneller geht es mit einer Kopie: Einen ähnlichen Artikel öffnen, oben rechts im Menü **Duplizieren** wählen. Die Kopie bekommt eine neue Adresse mit „kopie“ darin und eine neue Kennung, und sie ist ein Entwurf. Adresse, Name, System, Codebereich und Code anpassen, dann veröffentlichen.

Die Liste **Artikel** zeigt die Spalten Hersteller, System, Preis, Verfügbarkeit und Kategorie. Über **Spalten** oben lassen sich weitere einblenden.

## 2. Neue Kategorie oder Unterkategorie anlegen

1. Links unter **Shop** auf **Shop-Kategorien** klicken, dann **Neu erstellen**.
2. **Name** eintragen. Die **Adresse** in der Seitenleiste dürfen Sie leer lassen, sie wird aus dem Namen gebildet.
3. **Übergeordnete Kategorie**: leer für eine Hauptkategorie. Für eine Unterkategorie hier die Hauptkategorie wählen.
4. **Beschreibung**: ein bis zwei kurze Sätze für Kunden.
5. **Wohin führt die Kategorie?** und **Ziel (Adresse)**: etwa „Schlüssel nach Code (Produktliste)“ mit `/schluessel-nach-code`. Gibt es noch keine Produkte, „Anfrage“ wählen und die Adresse der passenden Anfrage eintragen.
6. **Hinweis, solange Produkte fehlen**: etwa „Hier gibt es bald Produkte. Bis dahin fragen Sie bitte bei uns an.“ Leer lassen, sobald es Produkte gibt.
7. **Reihenfolge**: kleinere Zahl steht weiter vorn. **Im Shop zeigen**: Haken setzen, wenn Kunden die Kategorie später sehen sollen.
8. **Speichern**.

Umbenennen: Den **Namen** einfach ändern, die Adresse bleibt dabei gleich. Ändern Sie die **Adresse**, merkt sich die Kategorie die alte unter **Frühere Adressen**.

Hinweis: Die Kategorien, Hersteller und Weiterleitungen erscheinen mit dem nächsten Ausbau der Shopseiten auf der Seite. Bis dahin pflegen Sie die Einträge schon vor; Kunden sehen sie noch nicht, und frühere Adressen leiten noch nicht weiter.

Ein Artikel kommt in eine Kategorie über das Feld **Kategorie** rechts im Artikel.

## 3. Hersteller anlegen

1. Links unter **Shop** auf **Hersteller** klicken, dann **Neu erstellen**.
2. **Name** genau so schreiben wie der Hersteller selbst. Jeden Hersteller gibt es nur einmal; ein zweiter Eintrag mit gleichem Namen wird abgelehnt.
3. **Wofür die Systeme eingesetzt werden**: ein kurzer Satz, nur was Sie belegen können.
4. **Wir bieten Produkte dieses Herstellers an**: Haken setzen, sobald es Produkte gibt.
5. **Logo** nur, wenn der Hersteller die Nutzung erlaubt hat. Dann **Freigabe liegt vor** anhaken und notieren, wer wann zugestimmt hat. Ohne Haken zeigt die Seite kein Logo.
6. **Speichern**.

Hinweis: Hersteller, Logo und der Haken „angeboten“ erscheinen mit dem nächsten Ausbau der Shopseiten auf der Seite.

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

Hinweis: Bei Standardartikeln erscheint das Produktbild schon auf der Seite. Bei Schlüsseln nach Code zeigt die Seite derzeit das Bild der Codefundstelle (Reiter **Code**); das Produktbild kommt mit dem nächsten Ausbau der Shopseiten dazu.

## 6. Produkt auf „nicht lieferbar“ setzen

1. **Shop › Artikel**, den Artikel anklicken.
2. Rechts in der Seitenleiste **Verfügbarkeit** wählen:
   - **Lieferbar**: Kunden legen den Artikel in den Warenkorb.
   - **Auf Anfrage**: kein Warenkorb. Die Seite zeigt **Code anfragen** (bei Artikeln **Artikel anfragen**).
   - **Derzeit nicht lieferbar**: kein Warenkorb, keine Bestellung. Die Seite sagt es ruhig und zeigt die Übersicht.
3. **Veröffentlichen**.

Liegt der Artikel schon in einem Warenkorb, nimmt die Kasse die Bestellung nicht an und bittet den Kunden, ihn zu entfernen.

Soll ein Artikel gar nicht mehr erscheinen, legen Sie ihn in den Papierkorb (oben rechts im Menü **Löschen**). Artikel, auf die sich Bestellungen beziehen, lassen sich nicht endgültig löschen.

## 7. Vorschau

Oben rechts im Artikel öffnet **Vorschau** die Seite des Artikels. Sie zeigt die veröffentlichte Fassung. Ein Entwurf ist dort erst nach dem Veröffentlichen zu sehen.
