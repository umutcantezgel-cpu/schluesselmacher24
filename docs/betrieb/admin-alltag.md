# Admin im Alltag: Bestellungen, Kunden, Erstattungen und Inhalte

Diese Anleitung ist für das Team im Adminbereich unter `/admin`. Sie zeigt Schritt für Schritt die Handgriffe, die im Alltag anfallen. Für keinen davon braucht es einen Entwickler.

Grundsätze:

- Was Sie speichern, prüft die Seite. Passt etwas nicht, erscheint oben eine Meldung in Klartext und nichts wird gespeichert.
- Jede wichtige Änderung steht danach mit Zeit und Namen im Vorgang unter **Notizen und Verlauf**.
- Die Seite bewegt selbst kein Geld. Erstattungen machen Sie im Stripe-Dashboard, per Überweisung oder bar und tragen sie danach ein.

Weitere Anleitungen: [Mail einrichten](mail-einrichten.md) und [Partnerauftrag abrechnen](partnerauftrag-abrechnen.md).

## 1. Bestellung ansehen und Status ändern

1. Links unter **Aufträge** auf **Vorgänge** klicken.
2. Den Vorgang in der Liste anklicken. Oben steht die Vorgangsnummer.
3. Die Reiter zeigen alles zum Vorgang: **Übersicht**, **Positionen**, **Versand**, **Kontakt**, **Zahlung**, **E-Mails**, **Notizen und Verlauf**.
4. Rechts in der Seitenleiste den **Status** wählen, etwa „In Fertigung“ oder „Versendet“.
5. Soll der Kunde eine Mail zum neuen Status bekommen, das Häkchen **Bei Statuswechsel Kunden per E-Mail informieren** gesetzt lassen. Unter **Zusatz zur Statusmail** können Sie einen Satz ergänzen. Die Mail steht danach mit vollem Text im Reiter **E-Mails**.
6. Oben rechts auf **Speichern** klicken.

Beim Versand: im Reiter **Versand** Versanddienst und Sendungsnummer eintragen, dann Status „Versendet“. Die Sendungsnummer steht dann in der Mail an den Kunden.

Positionen und Summen einer bezahlten Bestellung bleiben fest. Sie sind der Beleg. Muss sich nach der Bestellung etwas am Betrag ändern, nutzen Sie eine Korrekturposition (Abschnitt 4).

## 2. Kunden anschreiben

### Mit Verlauf am Vorgang

1. Im Vorgang rechts in der Seitenleiste auf **Nachricht an den Kunden** klicken.
2. Unter **Vorlage** eine Vorlage wählen oder „Frei schreiben“. Es gibt Vorlagen für Rückfrage, Unterlagen fehlen, Termin verschieben und Abholung bereit.
3. **Betreff** und **Text** anpassen. In den Vorlagen stehen leere Zeilen, in die Sie Ihre Frage oder die fehlenden Unterlagen schreiben.
4. Anrede, Vorgangsnummer und Firmenangaben setzt die Mail selbst.
5. Auf **Nachricht senden** klicken und die Rückfrage bestätigen.
6. Die Seite neu laden. Im Reiter **E-Mails** steht die Nachricht mit Zeit, Art, Empfänger, Betreff, vollständigem Text und Ergebnis.

Im Reiter **E-Mails** stehen alle Mails zum Vorgang, die automatischen ebenso wie Ihre eigenen. So sehen Sie jederzeit, was der Kunde von uns bekommen hat. Steht dort als Ergebnis „fehlgeschlagen“, ging die Mail nicht hinaus. Der Text steht trotzdem dort.

Antworten des Kunden kommen in Ihr normales Postfach, nicht in den Vorgang.

Ist der Mailversand nicht eingerichtet, meldet der Knopf das. Wie Sie ihn einrichten, steht in [Mail einrichten](mail-einrichten.md).

### Ohne Verlauf

Im Reiter **Kontakt** stehen oben zwei Verweise:

- **E-Mail schreiben (eigenes Mailprogramm)** öffnet Ihr Mailprogramm mit Adresse und Vorgangsnummer im Betreff. Diese Mail steht nicht im Vorgang.
- **Anrufen** wählt die Nummer des Kunden, etwa am Telefon oder Handy.

## 3. Stornieren und erstatten

### Bestellung ohne Zahlung stornieren

Status **Storniert** wählen und speichern. Eine offene Zahlungsseite gilt danach nicht mehr.

### Bezahlte Bestellung stornieren

Bei einer bezahlten Bestellung fragt die Seite ausdrücklich nach der Erstattung. Ohne diese Entscheidung lässt sich nicht stornieren.

1. Rechts in der Seitenleiste unter **Storno: Erstattung** wählen:
   - **Ganz erstatten**
   - **Teilweise erstatten**
   - **Keine Erstattung**, dann im Feld **Grund ohne Erstattung** den Grund eintragen, etwa „Schlüssel schon gefertigt“.
2. Bei „Ganz“ oder „Teilweise“: das Geld zuerst wirklich zurückzahlen (siehe unten), dann im Reiter **Zahlung** in der Gruppe **Erstattung** eintragen:
   - **Art**: ganz oder teilweise
   - **Betrag**: in Cent, Summe aller Erstattungen (15,00 € = 1500). Bei „ganz“ kann er leer bleiben.
   - **Grund**
   - **Weg**: Zahlungsdienst (Stripe), Überweisung, bar oder sonstiger Weg
   - **Beleg oder Referenz**: bei Überweisung, bar oder sonstigem Weg Pflicht, etwa Buchungstext oder Quittungsnummer
3. Status **Storniert** wählen und speichern.

Entscheidung, Bearbeiter und Zeit stehen danach in der Seitenleiste und in den Notizen.

### Erstattung ohne Storno

Etwa bei einer Kulanz: nur die Gruppe **Erstattung** im Reiter **Zahlung** ausfüllen und speichern.

### Wo das Geld zurückgeht

- **Stripe (Karte und andere Online-Zahlungen):** Im Reiter **Zahlung** steht der Knopf **Erstattung beim Zahlungsdienst auslösen**. Er ist absichtlich ausgeschaltet. Daneben führt **Zahlung im Stripe-Dashboard öffnen** direkt zur Zahlung. Dort erstatten Sie. Danach die Gruppe **Erstattung** mit Weg „Zahlungsdienst (Stripe)“ ausfüllen.
- **Überweisung oder bar:** zurückzahlen, dann Weg und Beleg eintragen.

### Zahlungsstand lesen

Im Reiter **Zahlung** steht unter **Stand der Zahlung** ein Satz, etwa:

- „Bezahlt: 40,00 €.“
- „Teilweise erstattet: 15,00 € von 40,00 €. Es bleiben 25,00 €.“
- „Erstattet: 40,00 €.“

„Erstattet“ und „Teilweise erstattet“ setzt nur die Gruppe **Erstattung**. Von Hand zurücksetzen geht nicht.

### Irrtum berichtigen

Wurde eine Erstattung aus Versehen oder mit falschem Betrag eingetragen:

1. Im Reiter **Zahlung** in der Gruppe **Erstattung** unter **Berichtigung: Grund** den Grund eintragen, etwa „Falscher Vorgang“.
2. Den **Betrag** kleiner setzen, oder **Art** leeren, wenn gar nichts erstattet wurde.
3. Speichern.

Bei Erstattungen per Überweisung, bar oder sonstigem Weg kann das jedes Teammitglied. Zwei Fälle berichtigt nur der Inhaber, ebenfalls mit Grund:

- **Weg „Zahlungsdienst (Stripe)“**, etwa wenn die Erstattung zu früh oder beim falschen Vorgang eingetragen wurde. Vorher im Stripe-Dashboard nachsehen, was dort wirklich erstattet ist, und den Betrag auf diesen Stand setzen. Erstattet Stripe später doch mehr, hebt die Seite den Stand von selbst wieder an.
- **Vermittelte Partneraufträge.** Dort sperrt eine Erstattung die Auszahlung an den Partner. Die Berichtigung gibt sie wieder frei, deshalb entscheidet der Inhaber.

Die Berichtigung steht mit Grund und Namen in den Notizen.

## 4. Korrekturposition

Für eine Änderung am Betrag nach der Bestellung, etwa ein Nachlass oder eine Zusatzleistung:

1. Im Vorgang den Reiter **Positionen** öffnen.
2. Unter **Korrekturpositionen** auf **Korrektur hinzufügen** klicken.
3. **Betrag** in Cent eintragen: minus für einen Nachlass (5,00 € Nachlass = -500), plus für eine Zusatzleistung.
4. **Grund** eintragen und speichern.

Datum und Ihr Name kommen automatisch dazu. Darunter steht **Summe nach Korrektur** mit der ursprünglichen Summe daneben. Eine gespeicherte Korrektur bleibt stehen. Ist sie falsch, legen Sie eine weitere Korrektur mit dem Gegenbetrag an.

Korrekturpositionen gibt es nur bei Bestellungen. Geld bewegt eine Korrektur nicht. Geht dadurch Geld zurück, tragen Sie zusätzlich die Erstattung ein.

## 5. Produkt anlegen und duplizieren

### Neu anlegen

1. Links unter **Shop** auf **Artikel** klicken, dann oben auf **Neu erstellen**.
2. **Art des Artikels** wählen, Name, Beschreibung, Preis und die übrigen Felder ausfüllen.
3. **Speichern** speichert einen Entwurf. **Veröffentlichen** stellt den Artikel in den Shop.

### Duplizieren

1. Den Artikel öffnen, oben rechts das Menü mit den drei Punkten öffnen und **Duplizieren** wählen.
2. Die Kopie startet immer als **Entwurf** und erscheint noch nicht im Shop.
3. Sie bekommt eine eigene Adresse (Original mit „-kopie-“ und einem Kürzel) und eine eigene Kennung. Bestellungen und Warenkörbe des Originals bleiben beim Original.
4. Die Kopie zeigt dieselben Bilder wie das Original. Es entstehen keine neuen Bilddateien. Tauschen Sie die Bilder der Kopie bei Bedarf aus.
5. Name, Adresse und Texte anpassen, dann **Veröffentlichen**.

## 6. Bild tauschen

1. Den Artikel, die Seite oder den Ratgeber öffnen und zum Bildfeld gehen.
2. Das alte Bild mit dem kleinen x entfernen.
3. Ein neues Bild hochladen oder ein vorhandenes aus den Medien auswählen.
4. Speichern beziehungsweise veröffentlichen.

Bei Seiten gilt: Neue Seiten (Abschnitt 8) zeigen das Foto eines Abschnitts unter dessen Text. Die fest eingebauten Seiten zeigen ihre eigenen Bilder; ein Bild im Abschnitt der Seitentexte erscheint dort nicht.

Alle Bilder liegen unter **Inhalte** → **Medien**. Bitte immer einen kurzen Alternativtext eintragen: Was ist auf dem Bild zu sehen?

## 7. Text einer Seite ändern

1. Links unter **Inhalte** auf **Seitentexte** klicken.
2. Die Seite anhand der Adresse in der Seitenleiste suchen, etwa „autoschluessel“.
3. Überschrift, Einleitung, Abschnitte oder Fragen ändern.
4. **Veröffentlichen**. Die Seite zeigt den neuen Text nach kurzer Zeit.

### Partner und Partnerseiten

Die Hauptseite `partner-werden` und die vier Partnerseiten stehen unter **Seitentexte** mit diesen Adressen:

| Adresse | Seite |
| --- | --- |
| `partner-werden/auftraege-erhalten` | Aufträge erhalten |
| `partner-werden/netzwerk-deutschland` | Netzwerk Deutschland |
| `partner-werden/kfz-betriebe` | Kfz-Betriebe |
| `partner-werden/kooperation` | Kooperation |

**Pflegbar** sind auf den vier Partnerseiten:

- **Überschrift**: die große Überschrift oben auf der Seite.
- **Einleitung**: der Text direkt unter der Überschrift.
- **Unterzeile**: der Kurztext der Seite. Er steht in den Verweislisten auf der Hauptseite „Partner werden“ und auf den übrigen Partnerseiten und in der Übersicht für KI-Suchdienste (`/llms.txt`). Lassen Sie das Feld leer, gilt der Text aus dem Startinhalt.
- **Seitentitel** und **Beschreibung** im Bereich **Suchmaschinen**.

Ein leeres Feld löscht nichts: Dann steht wieder der eingebaute Text. **Nicht pflegbar** sind die Abschnitte, der Ablauf eines Auftrags, der Hinweis „Nur Autoschlüssel und Fahrzeugschlüssel“, die neun Partnerleistungen, der Qualitätsstandard, die Bundesländer und der nächste Schritt mit dem Knopf. Sie hängen an der Partnerlogik (Bewerbung, Vermittlung, Abrechnung) und müssen dazu passen; Änderungen daran macht die Entwicklung. Abschnitte und Fragen, die Sie bei diesen vier Seiten in den Seitentexten eintragen, erscheinen nicht, ein Vorschaubild ebenso wenig. Lassen Sie **Verwandte Seiten** bitte leer: Ein Eintrag dort erscheint nicht auf der Partnerseite, sondern als Verweis zurück auf die Partnerseite im Block „Passt dazu“ der verlinkten Seite. Den Haken **Nicht in Suchmaschinen aufnehmen** setzen Sie hier bitte nicht: Er nimmt die Partnerseite selbst nicht aus den Suchmaschinen, sondern nur aus diesen Rückverweisen.

Zahlweg: Kurztext und Beschreibung von „Aufträge erhalten“ nennen den Zahlweg, der gerade gilt (heute: der Betrieb rechnet direkt mit dem Kunden ab). Solange Sie diese beiden Felder nicht ändern, folgen sie einem späteren Wechsel des Zahlwegs von selbst. Haben Sie sie geändert, prüfen Sie sie bei einem Wechsel bitte von Hand. Schreiben Sie keine Provisionssätze, Fristen oder Zusagen hinein, die nicht im Partnervertrag stehen.

Öffentliche Profile einzelner Partnerbetriebe gibt es nicht; dafür fehlt die Zustimmung der Partner.

## 8. Neue Seite anlegen

Neue Seiten kann nur der Inhaber anlegen. Mitarbeiter sehen den Knopf **Neu erstellen** hier nicht und können bestehende Seiten bearbeiten.

1. Unter **Inhalte** → **Seitentexte** oben auf **Neu erstellen** klicken.
2. In der Seitenleiste unter **Seite (Adresse)** eine freie Adresse eintragen: nur Kleinbuchstaben, Ziffern und einzelne Bindestriche, 3 bis 60 Zeichen, ohne Schrägstrich. Beispiel: `schluessel-fuer-vereine`. Umlaute schreiben Sie aus (ue, oe, ae, ss).
3. Überschrift, Einleitung, Abschnitte und Fragen ausfüllen, dazu die Felder für Suchmaschinen. Ein Foto im Abschnitt erscheint unter dessen Text; bitte mit Alternativtext. Ohne eigene Fragen zeigt eine neue Seite keine Fragen.
4. **Veröffentlichen**. Die Seite steht danach unter Ihrer Domain mit der gewählten Adresse, also `/<adresse>`.

Die Adresse lässt sich nach dem Anlegen nicht mehr ändern. Adressen, die die Seite schon nutzt (etwa `kasse` oder `ratgeber`), und reservierte Namen (etwa `impressum`, `datenschutz`, `agb`, `login`) lehnt die Seite ab.

Eine neue Seite steht zunächst auf **Nicht in Suchmaschinen aufnehmen**. Erst wenn Text und Bilder fertig sind, nehmen Sie den Haken im Bereich für Suchmaschinen heraus. Eine neue Seite erscheint nicht von selbst im Menü. Sie steht auch noch nicht in der Sitemap, selbst ohne den Haken. Suchmaschinen finden sie dann erst über Verweise, etwa von einer anderen Seite oder einem Ratgeber.

## 9. Ratgeber schreiben

1. Unter **Inhalte** auf **Ratgeber**, dann **Neu erstellen**.
2. **Titel**, **Kurzfassung**, **Thema** und **Abschnitte** ausfüllen, ein Bild wählen.
3. Als **Entwurf** speichern, gegenlesen lassen, dann **Veröffentlichen**.

Bitte nur schreiben, was stimmt und was wir selbst wissen. Keine Preise versprechen, die nicht im Shop stehen.

## 10. Erreichbarkeit ändern

1. Links unter **Verwaltung** auf **Einstellungen** klicken, Reiter **Erreichbarkeit**.
2. **Kernaussage** und **Weitere Zeilen** anpassen. Eine Aussage je Zeile.
3. Speichern. Die Angabe steht danach in der Fußzeile, auf der Kontaktseite und auf den Standortseiten.

Nur Inhaber können die Einstellungen ändern. Bitte nur schreiben, was wirklich gilt.

## 11. Termine sperren

Für Urlaub, Messe oder Krankheit:

1. Links unter **Termine** auf **Sperrtage**, dann **Neu erstellen**.
2. **Datum** und **Grund** eintragen, speichern.

An diesem Tag bietet die Terminbuchung keine Zeiten mehr an. Schon gebuchte Termine bleiben bestehen. Diese verschieben Sie im Vorgang und schreiben dem Kunden mit der Vorlage „Termin verschieben“.

## 12. Eine Rubrik pausieren

Unter **Rubriken** lässt sich der Stand einer Rubrik ändern. Steht sie nicht auf „live“, verschwindet sie aus der Startseite („Wobei können wir Ihnen helfen?“) und aus der Fußzeile. Was mit ihren Seiten passiert, hängt von der Rubrik ab:

- **Motorradschlüssel, Roller und Kleinstfahrzeuge, E-Scooter, Seniorenmobile und Fahrradschlüssel:** Einstiegs- und Anfrageseite zeigen statt des Formulars einen ruhigen Hinweis mit Telefonnummer. Die Seiten stehen auf „nicht in Suchmaschinen“ und fallen aus der Sitemap. Anfragen nimmt die Seite nicht an.
- **Autoschlüssel:** Nur die Anfrage „Fahrzeug nicht gefunden“ zeigt dann den Hinweis statt des Formulars und fällt aus der Sitemap. Die übrigen Autoschlüssel-Seiten bleiben online.
- **Alle anderen Rubriken** (etwa Schlüssel nach Vorlage, Schließanlage, Sicherheitstechnik): Ihre Seiten bleiben mit Formular erreichbar, in Suchmaschinen und in der Sitemap. Wer eine solche Rubrik wirklich pausieren will, braucht dafür noch eine Änderung am Code.

Auf „live“ zurück, und alles ist wieder da.
