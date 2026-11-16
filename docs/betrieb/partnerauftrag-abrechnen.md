# Partnerauftrag abrechnen: vom Zahlungseingang bis zur Auszahlung

Diese Anleitung ist für das Team im Adminbereich. Sie zeigt Schritt für Schritt, wie ein Auftrag über einen Partnerbetrieb läuft: vom Geld des Kunden bis zum Geld für den Partner. Dazu Storno und Rückzahlung.

**Wichtig:** Der Partnerweg ist abgeschaltet, solange der Schalter `PARTNERMODELL_B` nicht gesetzt ist. Die Seite selbst überweist kein Geld an Partner. Das Team überweist von Hand und trägt den Beleg ein. Die Auszahlung über einen Zahlungsdienst (Stripe Connect) ist vorbereitet, aber aus. Sie wird erst eingeschaltet, wenn Anwalt, Steuerberatung und Inhaber das freigeben und das Konto beim Zahlungsdienst eröffnet ist.

## Wo steht was

Im Vorgang, Reiter **Vermittlung**:

- **Stand der Vermittlung**: wo der Auftrag gerade steht
- **Partnerbetrieb**: Wählbar sind nur freigeschaltete Betriebe. Ein Betrieb, der inzwischen pausiert, gesperrt oder beendet ist, bleibt am Vorgang stehen, damit laufende Aufträge geklärt und abgerechnet werden können; am Vorgang steht dann eine Warnung
- **Auftragsart**: bei Autoschlüsseln kommt sie aus der gebuchten Leistung (eine der neun Leistungen des Partnernetzes), sonst „Autoschlüssel allgemein“
- **Gesamtbetrag, Plattformanteil, Partnerbetrag**: der Partnerbetrag wird berechnet
- **Bestätigung durch das Team**: nur wenn der Kunde nicht bestätigt
- **Auszahlung an den Partner**: Auszahlungsstand, freigegeben am und von, ausgezahlt am, Weg, Beleg, Notiz. Oben steht, welcher Weg gerade gilt.

Im Reiter **Zahlung**: Zahlungsstand und die Gruppe **Erstattung**.

In der Liste der Vorgänge: Spalten „Stand der Vermittlung“ und „Auszahlungsstand“. Über der Liste unter „Vermittlung und Partnerauszahlung“ stehen fertige Filter.

Am **Partnerbetrieb**: freiwillig die Konto-Kennung beim Zahlungsdienst (acct_…) und unten die Liste „Vorgänge mit offener Auszahlung“.

Jede Änderung steht danach mit Zeit und Namen unter **Notizen und Verlauf**. Was den Kunden betrifft, sieht er auch in seinem Verlauf.

## Die Stände der Reihe nach

| Stand | Wer setzt ihn | Was vorher stimmen muss |
|---|---|---|
| neu | Team | nichts |
| geprüft | Team | nichts |
| an Partner vermittelt | Team | Der Kunde hat den **Gesamtbetrag bezahlt**. Ein Partnerbetrieb ist gewählt, er ist freigeschaltet (nicht pausiert, nicht beendet) und übernimmt die Auftragsart. |
| vom Partner angenommen | Team | Der Partner ist weiter freigeschaltet. |
| Termin bestätigt | Team | Der Partner hat den Termin mit dem Kunden abgestimmt. |
| ausgeführt | Team | Vorher steht „Termin bestätigt“. Gesamtbetrag und Plattformanteil sind eingetragen. Mit diesem Schritt werden sie **festgeschrieben**. Der Kunde bekommt eine Mail mit der Bitte um Bestätigung. |
| Kunde bestätigt | nur der Kunde | Er klickt in der Mail auf „Auftrag wurde ausgeführt: bestätigen“. Der Link gilt nur einmal. |
| zur Auszahlung freigegeben | Team | Der Kunde hat bestätigt. Oder das Team hat die Ausführung anders belegt und trägt einen Grund unter „Bestätigung durch das Team“ ein. Es gibt keine Erstattung zum Auftrag. |
| ausgezahlt | Team | Freigegeben, Weg gewählt, bei Überweisung ein Beleg eingetragen. |

Ein Schritt zurück auf „geprüft“ geht bis zur Ausführung, etwa wenn ein anderer Partner übernehmen soll. Partnerbetrieb oder Auftragsart wechseln Sie nur zusammen mit diesem Schritt; der Wechsel steht danach in den Notizen. Seit „ausgeführt“ geht kein Wechsel mehr. Was nicht passt, lehnt die Seite beim Speichern mit einer Meldung ab.

## Schritt für Schritt

1. **Zahlung abwarten.** Der Zahlungsstand muss „Bezahlt“ sein und der Umfang „Gesamtbetrag“. Vorher geht keine Vermittlung.
2. **Partner wählen.** Unter „Passende Partnerbetriebe (Vorschlag)“ stehen Betriebe, deren Gebiet passt. Einen davon unter „Partnerbetrieb“ wählen.
3. **Vermitteln.** Stand auf „an Partner vermittelt“ setzen und speichern. Die Seite trägt den Gesamtbetrag aus der Zahlung ein und schlägt den Plattformanteil aus der Provision des Partners vor. Ist keine Provision hinterlegt, steht dort ein Hinweis. Dann den Plattformanteil von Hand eintragen. Den Partner informieren Sie wie bisher selbst.
4. **Annahme und Termin.** Sagt der Partner zu: „vom Partner angenommen“. Steht der Termin: „Termin bestätigt“.
5. **Ausführung.** Meldet der Partner den Auftrag als erledigt: Beträge prüfen, dann „ausgeführt“. Ab jetzt lassen sich Gesamtbetrag und Plattformanteil nicht mehr ändern. Der Kunde bekommt die Bitte um Bestätigung.
6. **Bestätigung.** Bestätigt der Kunde, steht der Stand auf „Kunde bestätigt“ mit Zeitpunkt. Meldet er sich nicht oder hat keine Mail bekommen: Ausführung anders klären (Anruf, Foto vom Partner) und den Grund unter „Bestätigung durch das Team“ eintragen.
7. **Freigeben.** Stand „zur Auszahlung freigegeben“. Datum und Name stehen danach in der Gruppe Auszahlung.
8. **Überweisen.** Den Partnerbetrag an den Partner überweisen. Dann Weg „Überweisung“, Beleg (etwa Buchungstext oder Belegnummer) eintragen und den Stand „ausgezahlt“ setzen. Das Datum setzt die Seite, wenn es leer ist.

## Storno und Rückzahlung

1. **Geld erstatten.** Die Erstattung selbst machen Sie im Stripe-Dashboard (Zahlung über Stripe) oder per Überweisung. Die Seite bewegt kein Geld.
2. **Erstattung eintragen.** Im Reiter Zahlung, Gruppe „Erstattung“:
   - Art: „Ganz“ oder „Teilweise“
   - Betrag in Cent: die Summe aller Erstattungen zu diesem Vorgang. Bei „Ganz“ darf er leer bleiben, dann gilt die ganze Zahlung.
   - Datum: leer lassen für jetzt
   - Grund: Pflicht
3. **Speichern.** Der Zahlungsstand wird „Erstattet“ oder „Teilweise erstattet“. Diese beiden Stände setzt nur die Gruppe Erstattung, und zurück auf „Bezahlt“ geht es danach nicht mehr. Der Kunde sieht auf seiner Vorgangsseite einen kurzen Satz dazu.
4. **Bei Partneraufträgen** ist die Auszahlung danach **gesperrt**. Ist schon ausgezahlt, steht in den Notizen der Hinweis, die Rückforderung mit dem Partner zu klären.
5. **Storno.** Soll der Auftrag ganz entfallen, zusätzlich den Status des Vorgangs auf „Storniert“ setzen.

Kommt eine Erstattung über Stripe herein (etwa aus dem Dashboard), setzt die Seite den Zahlungsstand selbst. Auch dann ist die Auszahlung gesperrt.

## Was die Seite nicht tut

- Sie überweist kein Geld, solange der Zahlungsdienst ausgeschaltet ist.
- Sie erstattet kein Geld.
- Sie schreibt keine Rechnung an den Partner und keine Gutschrift. Wie Rechnung, Provision und Umsatzsteuer abgebildet werden, klärt die Steuerberatung.
- Provisionssätze pflegt nur der Inhaber am Partnerbetrieb.
