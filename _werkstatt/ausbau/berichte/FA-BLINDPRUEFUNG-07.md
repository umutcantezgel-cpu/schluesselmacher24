# FA-BLINDPRUEFUNG-07: Gehäuse, Customizing, Sperrschließung (Abschnitte 14 und 15)

Stand 15.11.2026. Nur gelesen: keine Projektbefehle, kein git, keine Tests.

## Zählung
Abschnitt 14: Bereichsziel, 4 Punkte unter Gehäuse und Reparatur, 5 Punkte unter Modifikation. Der Punkt „Vorher-Nachher, Kompatibilität, Auswahl“ ist in drei IDs geteilt. Ergibt 12 IDs.
Abschnitt 15: Bereichsziel und 6 Punkte. Der Punkt mit den Abfragen ist in sechs IDs geteilt. Ergibt 12 IDs.
Der Kundschafter hat alle 24 Anforderungen erfasst. Übersehen wurde nichts.

## Am Code nachgeprüft: 22 Urteile, 19 bleiben
- erfuellt (6): FA-15-04, -05, -06, -07, -09 und -10 bleiben. Die Angaben gehen durchgängig bis zur Bestellung: Die Kasse rechnet serverseitig neu (`src/lib/actions/orders.ts:255-278`). Maße, Funktion, Stückzahl, Schlüsselzahl, Optionen und Erweiterung landen über `zylinderDetails` (`src/lib/cylinder-summary.ts:16-70`) in den festgeschriebenen Bestellpositionen. Bauformen, Funktionen und Optionen pflegt das Team im Admin (`src/payload/globals/Zylinderkatalog.ts`).
- fehlt, bestätigt: FA-14-05, -06, -07, -08, -09 und FA-15-02. Gesucht wurde nach customiz, modifikation, umbau, vorher/nachher und optische, ohne einschlägigen Treffer. Es gibt kein `public/`-Verzeichnis, und der Herstellereintrag hat kein Bildfeld.
- teilweise, bestätigt: FA-14-00, -01, -11 sowie FA-15-00, -03, -08 und -11.

## Korrekturen
1. **FA-14-02 von „fehlt“ zu „teilweise“.** Die Dienstleistung `gehaeuse-reparatur` ist je Bauform buchbar: `keyKinds` funk, klappschluessel und smart-key (`content/car-key-services.json:59-70`). Der Autoschlüssel-Assistent filtert die Leistungen nach der gewählten Schlüsselart (`src/app/(site)/autoschluessel/anfrage/assistent.tsx:411-430`). Es fehlen die Gehäuse-Bauform Karte (`KeyKind` in `src/lib/types.ts:247-252` kennt sie nicht) und Gehäuse als Produkte.
2. **FA-14-10 von „fehlt“ zu „teilweise“.** Im Assistenten wählt der Kunde Marke und Modell aus dem Fahrzeugkatalog. Die Schlüsselarten des Modells und die passenden Leistungen folgen daraus, Gehäuse und Tasten eingeschlossen. Danach kommen Preis, Termin und Anzahlung (`assistent.tsx:397-430`, `:1223`). Die Modellseiten zeigen „Leistungen und Preise“ je Modell und verlinken auf den Assistenten (`src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:113`, `:277`, `:382-440`, `:619`). Es fehlt die Auswahl in der Gehäuse-Anfrage, die nur Freitext kennt, und im Customizing.
3. **FA-15-01 von „fehlt“ zu „teilweise“.** Der Schließanlagen-Konfigurator nennt ABUS und BKS sichtbar (`src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:307-308`, `:782`). Für die Sperrschließung bestehen ein Hersteller-Tab im Admin (`Zylinderkatalog.ts:127-183`) und ein Herstellerschritt mit Preiswirkung (`konfigurator.tsx:237-244`, `:291`). Es fehlen die Einträge selbst (`content/cylinder-catalog.json:19` ist leer) und eine Nennung auf der Sperrseite. Großteils ist das Datenpflege, kein Neubau.

## Hinweise zu bestätigten Urteilen
- **FA-14-01:** Das Urteil bleibt, die Begründung stimmt aber nicht. Die Schlüsselart wird abgefragt, nur nicht in der Gehäuse-Anfrage, sondern im Assistenten (Weg über die Dienstleistung). Es gibt also zwei Wege zum Gehäuse: den Assistenten mit Preis und Anzahlung und die Foto-Anfrage ohne Zahlung. Wer baut, muss sie zusammenführen, statt einen dritten Weg anzulegen.
- **FA-15-00, „zwei Preispfade widersprechen sich“:** `src/lib/konfigurator/preis.ts` gehört zum Schließplan-Planer. Dort führen aktive Hersteller bewusst zu einem Angebot, weil der Planer noch keine Herstellerwahl kennt (Kommentar Zeile 72). Der Sperr-Konfigurator rechnet mit Hersteller über `priceCylinderOrder`. Das ist eine Lücke im Planer, kein Widerspruch im Sperr-Konfigurator.
- **FA-15-11:** Die Beispielartikel sind serverseitig gesperrt, wenn `example` gesetzt ist (`orders.ts:236-238`). Im Standardstand ist `example: true` gesetzt (`src/lib/data/defaults/standard-articles.ts:152`). Ob die Datenbank das ebenso führt, bleibt offen. Der Hersteller hat nur einen Aufpreis je Zylinder und keine eigenen Produkte, Profile oder Grundpreise. „Tatsächlich hinterlegte Produkte“ von BKS und ABUS bildet das Schema nicht ab.

## OFFENE FRAGEN
- Stammen die Zylinder- und Gehäusepreise vom Inhaber (G9)? Laut Startwert-Snapshot 2026-10-25 gibt es sie seit dem Startstand.
- Soll das Gehäuse künftig über den Assistenten (Preis und Anzahlung) oder über die Foto-Anfrage (Angebot mit Zahlungslink) laufen?

## Risiken für den Bau
Siehe strukturierte Rückgabe: Markenrecht bei Logos, G9-Preise, BAUFORMEN- und KeyKind-Enums mit Migration und Tests, Widerrufsrecht bei Anfertigungen, Datenschutz bei Vorher-Nachher-Fotos, Haftung beim Einsenden von Elektronik.
