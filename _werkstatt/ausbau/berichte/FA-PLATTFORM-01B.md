# FA-PLATTFORM-01B · Partnernetz, Teil B: Prüfliste mit Besuch vor Ort, Pausieren und Sperren, Region, Lead-Verlauf

Stand: 16.11.2026 · Rolle Baumeister · Anforderungen FA-07-13 bis FA-07-19, FA-22-36 bis FA-22-41 (FA-08-12 bis FA-08-15 aus Teil A unverändert) · Zusätze 7, 8, 9 des Orchestrators.

## GEÄNDERTE DATEIEN

Neu:
- `src/lib/partner/pruefliste.ts` (Prüfliste, Pflichtpunkte, Zusammenführen, Stand als Text)
- `src/lib/partner/region.ts` (`deckendePartner`: Abdeckung nach Postleitzahl und Leistung)
- `src/lib/partner/lead-verlauf.ts` (Einträge je Wechsel, Warnung, Hinweis, Filter „wartet auf Zuordnung“)
- `src/payload/hooks/partner-pruefung.ts` (beforeChange und afterChange des Partnerbetriebs, Gegenansicht, Stand der Prüfliste)
- `src/payload/hooks/lead-verlauf.ts` (Lead-Verlauf am Vorgang, Auswahl des Partnerbetriebs, Warnung, Hinweis)
- `src/payload/components/ZuordnungFilter.tsx` (Knopf „Wartet auf Zuordnung“ über der Liste der Vorgänge)
- `src/migrations/20261116_081528_partner_pruefung.ts` und `.json`
- `docs/betrieb/partner-pruefen.md`
- Tests: `src/lib/partner/pruefliste.test.ts`, `src/lib/partner/region.test.ts`, `src/lib/partner/lead-verlauf.test.ts`, `src/payload/hooks/lead-verlauf.test.ts`, `src/lib/partner/pruefung.db.test.ts`

Geändert:
- `src/lib/partner/bewerbung.ts` (Stand `gesperrt`, Übergänge, Prüfliste im Freischalt-Gate, Grund für Pausieren und Sperren, `sperreBeimWechsel`)
- `src/lib/partner/leistungen.ts` (Zusatz 7: `AUFTRAGSLEISTUNG_ZU_PARTNERLEISTUNG`, `auftragsartFuerLeistung`, `auftragsartFuerVorgang`)
- `src/lib/auftragsweg.ts` (nur: Auftragsart aus der Leistung in `terminstandorte`, Kommentar zu `gesperrt`)
- `src/lib/mail/nachricht-vorlagen.ts` (nur die Vorlage „Ihr ausführender Betrieb“ mit `betriebEinsetzen`, `betriebMitgeteilt`)
- `src/payload/collections/Partnerbetriebe.ts` (Prüfliste, Sperre, Orte und Landkreise, Gegenansicht, Hooks ausgelagert)
- `src/payload/collections/Vorgaenge.ts` (Lead-Verlauf, Angaben zum Wechsel, Warnung, Hinweis, Altfeld, Auswahl, Filterknopf, Hook-Reihenfolge)
- `src/payload/hooks/vermittlung.ts` (nur die Zeile, die die Auftragsart setzt)
- `src/payload/hooks/auftragsweg.ts` (Vorschlagsliste mit der Auftragsart des Vorgangs)
- `src/payload/hooks/kunden-nachricht.ts` (Firma und Ort für die neue Vorlage)
- `src/migrations/index.ts`, `src/payload-types.ts` (erzeugt), `src/app/(payload)/admin/importMap.js` (erzeugt, eine Zeile für den Filterknopf)
- Tests angepasst: `src/lib/partner/partner.test.ts`, `src/lib/partner/partnerbetriebe.db.test.ts`, `src/lib/partner/vermittlung.db.test.ts`, `src/lib/actions/auftragsweg.test.ts`, `src/payload/hooks/kunden-nachricht.test.ts`

Nicht angefasst: Partnerformular und Seiten unter `src/app/(site)/partner-werden`, Zahlungs- und Auszahlungsregeln (FA-KERN-03, -04), Navigation, Startseite, Vertragstext (MA-29), `src/lib/data/payload-mapping.ts` und `src/lib/types.ts` (nicht nötig, siehe unten).

## WAS UND WARUM

1. Prüfliste vor der Freischaltung (FA-07-13 bis FA-07-18). Gruppe „Prüfliste vor der Freischaltung“ am Partnerbetrieb mit sechs Punkten in der Reihenfolge des Inhabers: Identität und Betrieb, Leistungsumfang und Fahrzeugabdeckung, Maschinen/Programmiergeräte/Werkstatt, Region und Radius (je erledigt, Datum, Prüfer, Notiz), Besuch vor Ort (Datum, wer, Ergebnis geeignet/mit Auflagen/nicht geeignet, Notiz, Fotos als interne Dateien über die vorhandene Sammlung `interne-dateien`, „Besuch nicht möglich“ mit Grund) und Qualitätsstandard schriftlich (wie ein Punkt plus Datei oder Vertragsverweis). Beim Abhaken setzt der Server Datum und Prüfer, wenn sie leer sind. `fehltFuerFreischaltung` verlangt die Punkte zusätzlich zu den bisherigen Häkchen und dem Vertrag; „freigeschaltet“ geht sonst nicht, die Meldung nennt jeden offenen Punkt. Der Besuch ist Pflicht, außer „Besuch nicht möglich“ mit Grund (Wortlaut „nach Möglichkeit“); ein Besuch mit „nicht geeignet“ sperrt die Freischaltung („nur geeignete Betriebe“). „Besuch nicht möglich“ ohne Grund wird schon beim Speichern abgelehnt (Feldprüfung und Hook). Oben in der Gruppe steht der Stand als Text (virtuell).
2. Altbestand (G6). Die Migration setzt nur die neue Spalte `pruefliste_vor_einfuehrung` für Betriebe, die freigeschaltet oder pausiert sind. Sie bleiben freigeschaltet und speicherbar; die Prüfliste zeigt „Vor Einführung der Prüfliste freigeschaltet“ und was offen ist. Den Vermerk setzt nur die Migration (Feld nur lesbar, der Hook übernimmt ihn nur aus dem gespeicherten Stand). Nach einer Sperre gilt die volle Prüfliste auch für den Altbestand.
3. Pausieren und Sperren (FA-07-19, FA-22-39). Neuer Stand `gesperrt` (freigeschaltet und pausiert nach gesperrt; gesperrt nach freigeschaltet oder beendet). Gruppe „Pausieren oder sperren“: Grund Pflicht für pausiert und gesperrt, Datum und Bearbeiter setzt der Server (Felder nur für den Server schreibbar). Beim Aufheben kommt der Eintrag als Zeile in die interne Notiz und die Gruppe wird geleert. Wirkung: `darfVermitteln` verlangt weiter „freigeschaltet“, also fallen pausiert und gesperrt aus jeder neuen Zuordnung (eine Stelle, `src/lib/auftragsweg.ts` und `vermittlungsWechselPruefen`). Im Admin: Die Auswahl am Vorgang bietet nur freigeschaltete Betriebe an, dazu den schon gespeicherten (sonst wäre ein laufender Auftrag nicht mehr speicherbar); die Vorschlagsliste zeigt nur freigeschaltete; am Vorgang steht eine Warnung „Partnerbetrieb nicht verfügbar“. Laufende Leads (neu bis Termin bestätigt) bekommen beim Pausieren, Sperren oder Beenden einen Eintrag „zur Klärung“ im Lead-Verlauf und eine Notiz und bleiben sichtbar.
4. Region zuordnen (FA-22-40). Unter „Einsatzgebiet“ neu „Orte und Landkreise“ (Art, Name, amtlicher Schlüssel mit fünf oder acht Ziffern), darf leer sein bis zur Ortsdatenbasis (FA-PLATTFORM-03); nur Dokumentation. Reine Funktion `deckendePartner(postleitzahl, leistung, partner)` in `src/lib/partner/region.ts`: freigeschaltet, Leistung abgedeckt, Postleitzahl im Muster. Der Umkreis wird nicht ausgewertet (keine Geodaten), der Hinweis „Ohne Postleitzahlen keine Zuordnung“ bleibt.
5. Lead-Verlauf (FA-22-41). Am Vorgang die Liste „Lead-Verlauf (angeboten an)“: Partnerbetrieb, Zeitpunkt, wer, Ergebnis (zugeteilt, angeboten, angenommen, abgelehnt, zurückgezogen, zur Klärung), Notiz. Der Hook `leadVerlaufVorAenderung` schreibt je Wechsel der Zuordnung einen Eintrag: Betrieb gewählt oder gewechselt = zugeteilt (der bisherige bekommt zurückgezogen, wenn sein letzter Eintrag noch offen ist), „an Partner vermittelt“ = angeboten, „vom Partner angenommen“ = angenommen, Schritt zurück = abgelehnt oder zurückgezogen. Ob abgelehnt oder zurückgezogen und eine Notiz gibt das Team in der Gruppe „Angaben zum Wechsel der Zuordnung“ an; sie gilt nur für dieses Speichern und wird danach geleert. Der Verlauf ist nur lesbar; ein von Hand gesendeter Verlauf wird verworfen. Gegenansicht am Partnerbetrieb: „Leads dieses Betriebs (Verlauf)“ (alle Leads, die ihm je angeboten oder zugeteilt wurden, mit Stand und letztem Eintrag) und „Aktuell zugeordnete Leads“ als Tabelle (Join). In der Liste der Vorgänge der Knopf „Wartet auf Zuordnung“ (Vermittlung bei neu oder geprüft, oder Partnerweg ohne Vermittlung; ohne storniert, abgeschlossen, nicht möglich, ohne Bewerbungen).
6. Zusatz 7, Sammelwert auflösen. `auftragsartFuerLeistung` ordnet die Leistungen des Assistenten eindeutig zu: Zweitschlüssel = Autoschlüssel nachmachen, Ersatz bei Verlust = Schlüsselverlust, Programmieren = Programmierung und Anlernen, Gehäuse/Tasten/Batterie = Reparaturen und Gehäuse, Fahrzeugöffnung = Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln. „Schlüsselbart fräsen“ bleibt beim Sammelwert (nicht eindeutig, siehe OFFENE FRAGEN). Gesetzt wird die Auftragsart an zwei Stellen: `terminstandorte` (Partnerweg für Kunden) und die Zeile in `vermittlungVorAenderung`, die bisher den Sammelwert setzte; dort nur, wenn noch keine Auftragsart gesetzt ist. Gespeicherte Vorgänge werden nicht umgeschrieben. Danach deckt ein Partner einen Auftrag mit zugeordneter Leistung nur, wenn er genau diese Leistung führt; für den Sammelwert gilt die Regel aus Teil A, die Provisionsregel (A-064) bleibt.
7. Zusatz 8, ausführender Betrieb (FA-07-03). Vorlage „Ihr ausführender Betrieb“ in `nachricht-vorlagen.ts` mit `{firma}` und `{ort}`; der Server setzt beim Senden Firma und Ort des Partnerbetriebs am Vorgang ein (ohne Betrieb Meldung, nichts geht hinaus). Kein automatischer Versand, im Test keine echte Mail (G5). Der Text nennt Betrieb und Vertragspartner für die Ausführung und dass der Betrieb den Termin abstimmt; keine Zusage zu Preis oder Frist. Hinweis am Vorgang bei „vom Partner angenommen“ und „Termin bestätigt“, bis eine Nachricht mit diesem Betreff gesendet ist.
8. Zusatz 9, Altfeld. `vermittlung.partner` heißt im Admin „Bewerbung (alt)“, ist nur lesbar und ausgeblendet, sobald ein Partnerbetrieb gesetzt ist. Spalte und Daten bleiben.
9. Betreiberanleitung `docs/betrieb/partner-pruefen.md`: Bewerbung prüfen, Prüfliste, Besuch, Freischalten, Pausieren und Sperren, Region, Lead anbieten und zuteilen, Nachricht an den Kunden.
10. Zugriffsrechte: Partnerbetriebe und Vorgänge liest weiter nur das Team (Sammlung). Die neuen Felder tragen zusätzlich `feldNurTeam` (Inhaber oder Mitarbeiter); Lead-Verlauf, Sperrdatum, Bearbeiter und Altvermerk schreibt nur der Server.
11. Öffentliche Partnerprofile (FA-22-36): nicht gebaut. Nötig wären: schriftliche Zustimmung jedes Betriebs zur Veröffentlichung (welche Angaben: Firma, Ort, Leistungen, Foto), am Partnerbetrieb Felder für die Zustimmung (Datum, Datei, Widerruf) und den Profiltext, eine Regel „nur freigeschaltet, nicht pausiert und nicht gesperrt sichtbar“, Entfernen bei Widerruf, Sperre oder Ende, Strukturdaten nur für Sichtbares (R8), keine Bewertungen (R5), eine rechtliche Prüfung der Darstellung der Vermittlerrolle (R10) und vorher die Entscheidung zu FA-22-36 (Profile oder Ortsseiten mit Partnerbezug, FA-PLATTFORM-03B).
12. JSON-Fallback (G6): Die neuen Felder gibt es nur mit Datenbank (Admin); Partnerbetriebe hatten schon in Teil A keinen JSON-Weg. Mapping und Typen der Seite brauchten keine Änderung; ein Test belegt, dass Änderungen über die Datenschicht (`vorgangAendern`) den Lead-Verlauf stehen lassen.

## PRÜFUNG UND ERGEBNIS

Alle über die Datenweiche, nach dem letzten Eingriff:
- `sicher.sh --json -- npx vitest run`: 246 Dateien, 3815 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Befund.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 27 Dateien, 165 Tests, alle grün (die neue Migration läuft dabei auf der frischen Datenbank).
- `sicher.sh --json -- npm run build`: erfolgreich.

Hinweis: Im selben Arbeitsbaum lief ein anderes Paket (FA-KERN-07: Assistent, Ablauf, `src/lib/flow/**`). In einem Zwischenlauf scheiterten deshalb vier fremde Tests (`zustand.test.ts`) und die Typprüfung an `schritt-historie.test.ts`; beim Schlusslauf oben war alles grün. Ich habe nichts davon angefasst.

Verlangte Tests:
- Freischaltung ohne Prüfliste abgelehnt: `pruefliste.test.ts` („lehnt die Freischaltung ohne Prüfliste ab …“), `pruefung.db.test.ts` („lehnt die Freischaltung ohne Prüfliste ab, setzt Datum und Prüfer …“), `partnerbetriebe.db.test.ts` (erster Test, jetzt mit Prüfliste).
- „Besuch nicht möglich“ nur mit Grund: `pruefliste.test.ts`, `pruefung.db.test.ts` („nimmt „Besuch nicht möglich“ nur mit Grund an“).
- Pausierter und gesperrter Partner nicht zuordenbar: `region.test.ts`, `pruefung.db.test.ts` („verlangt einen Grund, hält Datum fest, schließt von neuer Zuordnung aus und markiert laufende Leads“: Vermitteln abgelehnt, Neuwahl am anderen Vorgang abgelehnt, gespeicherter bleibt speicherbar), Bestand `vermittlung.db.test.ts`.
- Abdeckung nach Postleitzahl und Leistung: `region.test.ts` (vier Fälle plus Zusatz 7 im Partnerweg).
- Lead-Verlauf je Wechsel ein Eintrag: `lead-verlauf.test.ts`, `hooks/lead-verlauf.test.ts`, `pruefung.db.test.ts` („schreibt je Wechsel einen Eintrag, lässt sich nicht von Hand ändern und erscheint am Partnerbetrieb“).
- Zugriffsrechte der neuen Felder: `pruefung.db.test.ts` („lässt nur das Team … lesen, Systemfelder schreibt nur der Server“), Altvermerk im Test zum Altbestand.
- Auszahlung: `pruefung.db.test.ts` („löst durch die Sperre keine Freigabe einer Auszahlung aus“).
- Zusatz 7: `region.test.ts`, `pruefung.db.test.ts` („setzt die Auftragsart aus der gebuchten Leistung …“). Zusatz 8: `lead-verlauf.test.ts`, `kunden-nachricht.test.ts` („setzt bei der Vorlage „Ihr ausführender Betrieb“ Firma und Ort … ein“).

## BELEGE

- Migration `20261116_081528_partner_pruefung`: `up` gelesen, nur additiv. Vier neue Wertelisten, ein neuer Wert `gesperrt` in `enum_partnerbetriebe_status` (ADD VALUE), drei neue Tabellen (`vorgaenge_lead_verlauf`, `partnerbetriebe_einsatzgebiet_regionen`, `partnerbetriebe_rels` für die Fotos), 2 neue Spalten an `vorgaenge`, 32 neue Spalten an `partnerbetriebe`, Fremdschlüssel und Indizes. Eine Anweisung von Hand: `UPDATE partnerbetriebe SET pruefliste_vor_einfuehrung = true WHERE status IN ('freigeschaltet','pausiert')` (nur die neue Spalte). Nichts wird gelöscht, umbenannt oder umgeschrieben. Der Verweis im Lead-Verlauf ist nicht Pflicht, damit ein endgültig gelöschter Betrieb den Verlauf nicht blockiert (ON DELETE SET NULL).
- Freischalt-Gate: `src/lib/partner/bewerbung.ts` (`fehltFuerFreischaltung`, `statuswechselPruefen`), `src/lib/partner/pruefliste.ts` (`prueflisteFehlt`).
- Eine Regel für die Zuordnung: `darfVermitteln` (`src/lib/partner/vermittlung.ts`, unverändert) über `passendePartner` (`src/lib/auftragsweg.ts`), `deckendePartner` (`src/lib/partner/region.ts`) und `vermittlungsWechselPruefen`.
- Lead-Verlauf: `src/lib/partner/lead-verlauf.ts` (`leadEintraege`), Hook `src/payload/hooks/lead-verlauf.ts`, Reihenfolge in `Vorgaenge.ts` nach `vermittlungVorAenderung`, damit nur gültige Wechsel hineinkommen.
- Erfundene Betriebe in allen Tests (G4, G13); keine Provisionssätze, Vertragsinhalte oder Partnerdaten im Repository.

## OFFENE FRAGEN

1. Auszahlung an gesperrte Betriebe (Lücke): Die Sperre löst keine Freigabe aus (Test). Das Team kann aber für einen pausierten oder gesperrten Betrieb eine schon ausgeführte Vermittlung weiter „zur Auszahlung freigeben“ und „ausgezahlt“ setzen; `vermittlungsWechselPruefen` prüft bei diesen beiden Ständen den Partnerstand nicht. Die Regeln aus FA-KERN-04 habe ich nicht geändert. Soll eine Sperre auch die Auszahlung zurückhalten (etwa bis zur Klärung einer Reklamation) oder nur neue Zuordnungen verhindern? Die Warnung am Vorgang steht in diesen Ständen schon da.
2. „Schlüsselbart fräsen“: Gehört es zu „Autoschlüssel nachmachen“ oder auch zu „Schlüsselverlust“? Bis zur Antwort bleibt es beim Sammelwert.
3. Betriebe, die nur den Sammelwert „Autoschlüssel allgemein“ führen (Altbestand), bekommen Aufträge mit eindeutig zugeordneter Leistung nicht mehr, so wie Zusatz 7 es verlangt. Ihre Leistungen müssen am Partnerbetrieb nachgepflegt werden. Oder soll der Sammelwert am Betrieb weiter alle neun abdecken?
4. Rückkehr aus „gesperrt“: heute direkt nach „freigeschaltet“ mit voller Prüfliste. Soll eine Sperre endgültig sein oder eine neue Prüfung („in Prüfung“) verlangen?
5. Pausieren verlangt jetzt ebenfalls einen Grund (der Abgleich nannte den fehlenden Pflichtgrund als Lücke). Bitte bestätigen.
6. Ergebnis „zur Klärung“ ist ein sechster Wert neben den fünf der Paketdatei; er markiert laufende Leads bei Pause oder Sperre. „zugeteilt“ heißt: das Team hat den Betrieb am Vorgang gewählt.
7. Erkennung „Nachricht gesendet“ über den Betreffanfang „Ihr ausführender Betrieb“. Ändert das Team den Betreff, bleibt der Hinweis stehen. Der Hinweis gilt bei „angenommen“ und „Termin bestätigt“.
8. Schreibrechte in `Vorgaenge.ts`: Neben Lead-Verlauf, Filter, Hinweis und Altfeld habe ich die Auswahl des Partnerbetriebs (nur freigeschaltete plus der gespeicherte) und die Warnung eingebaut, weil Punkt 2 der Paketdatei „Warnung am Vorgang, kein Vorschlag in der Auswahl“ verlangt. Der Kommentar am Feld `auftragsart` („setzt der Server Autoschlüssel vor Ort“) ist damit ungenau; ich habe ihn nicht geändert.
9. `docs/betrieb/partnerauftrag-abrechnen.md` sagt noch, pausierte und beendete Betriebe stünden in der Auswahl und die Auftragsart sei immer „Autoschlüssel vor Ort“. Außerhalb meiner Schreibrechte; bitte im nächsten Paket mit dieser Datei anpassen.

## FÜR MENSCHEN

- Inhaber: Entscheidung zu den offenen Fragen 1 bis 5.
- Anwalt (R10, MA-29): Wortlaut der Vorlage „Ihr ausführender Betrieb“, besonders „Vertragspartner für die Ausführung“ bei Modell B (Kunde zahlt an Schlüsselmacher24). Der Text ist ein Entwurf zur Prüfung.
- Team: Die Prüfliste bei den Betrieben aus der Zeit davor nachholen (sie bleiben freigeschaltet), Besuche durchführen, den schriftlichen Qualitätsstandard als Datei oder Vertragsanlage hinterlegen, Leistungen von Altbetrieben mit nur „Autoschlüssel allgemein“ nachpflegen.
- Öffentliche Partnerprofile: Zustimmung der Betriebe einholen, bevor ein Paket sie baut (Nr. 11 oben).
- Probe im Admin mit lokaler Datenbank (FA-QA-01): Prüfliste, Sperre mit Warnung, Lead-Verlauf, Knopf „Wartet auf Zuordnung“; die Datenbanktests decken die Logik, der Admin selbst wurde nicht im Browser geprüft.

## Nachbesserung (16.11.2026, nach zwei Gegenprüfungen)

Je Befund: behoben oder nicht zutreffend.

1. [rot] `besuchErledigt` mit „nicht geeignet“ plus „Besuch nicht möglich“: **behoben**. `src/lib/partner/pruefliste.ts`: Ergebnis „nicht geeignet“ liefert immer `false`, vor dem Zweig „nicht möglich“; `prueflisteSpeichernPruefen` lehnt „Besuch nicht möglich“ neben einem erfassten Ergebnis ab (neue Meldung `besuchMitErgebnis`). Test in `pruefliste.test.ts`. Anleitung Abschnitt Besuch ergänzt.
2. [rot] „Vertragspartner“ bei jedem Modell: **behoben**. Der Server (`src/payload/hooks/kunden-nachricht.ts`) lehnt die Vorlage mit Platzhaltern bei Abrechnung B und im Partnerweg (zentrale Zahlung, `auftragswegVon`) mit 400 ab (`MELDUNG_NUR_MODELL_A`). Code in Vorlage und Endpunkt als ENTWURF ZUR PRÜFUNG (R10) gekennzeichnet. Siehe neue offene Frage N1.
3. [rot] Gesperrter oder nicht zusagender Betrieb in der Kundenmail: **behoben**. Der Endpunkt verlangt `status === 'freigeschaltet'` und Vermittlung „angenommen“ oder „Termin bestätigt“, sonst 400 mit klarer Meldung (etwa „Der Partnerbetrieb ist gesperrt. Bitte zuerst einen anderen Betrieb zuordnen.“). Test in `kunden-nachricht.test.ts` (gesperrt, pausiert, neu, angefragt, Modell B, Partnerweg; kein Versand, kein Schreiben; danach 200 bei „Termin bestätigt“).
4. [rot] Vorschlagsliste nur im Partnerweg mit Modell B: **behoben**. `partnerVorschlaege` (`src/payload/hooks/auftragsweg.ts`) füllt die Liste jetzt für jeden Vorgang mit Stand der Vermittlung über `deckendePartner` (Modell egal); im Partnerweg bleibt `passendePartner` mit Modell B. Test in `auftragsweg.test.ts` (Modell A erscheint bei Vermittlung, fremde Postleitzahl ergibt die Meldung). Anleitung Schritt 1 entsprechend.
5. [gelb] „Der Betrieb stimmt den genauen Termin ab“ nach Terminbestätigung: **behoben**. Satz neutral: „Bei Fragen zum Termin helfen Ihnen der Betrieb oder wir. Antworten Sie dazu einfach auf diese E-Mail.“ Der Hinweis bleibt bei beiden Ständen.
6. [gelb] Altfeld `vermittlung.partner` nur in der Oberfläche gesperrt: **behoben**. Feldrecht `access: { create: () => false, update: () => false }` in `Vorgaenge.ts`. Die Datenschicht schreibt mit `overrideAccess: true` und behält Werte; ein Speichern über REST oder Backend lässt das Feld fallen. Folge: `src/lib/server/freigabe.db.test.ts` setzte das Altfeld bisher im Backend; der Test setzt den Altwert jetzt über die Datenschicht und prüft zusätzlich, dass das Backend ihn nicht setzen kann und ein weiteres Speichern ihn stehen lässt (Prüfung nicht gelockert, sondern an Zusatz 9 angepasst und erweitert; bitte bei der Abnahme ansehen).
7. [gelb] Verweis auf `docs/betrieb/partner-pruefen.md` im Admin: **behoben**. Ersetzt durch „Die Schritt-für-Schritt-Anleitung hat der Inhaber.“ (`Partnerbetriebe.ts`, Kommentar in `payload-types.ts` mitgezogen). Einen Hilfebereich im Admin gibt es nicht.
8. [gelb] Veraltete Aussagen in `docs/betrieb/partnerauftrag-abrechnen.md` und im Kommentar `Vorgaenge.ts`: **teilweise behoben**. Der Code-Kommentar zur Auftragsart in `Vorgaenge.ts` sagt jetzt „aus der gebuchten Leistung, sonst Autoschlüssel allgemein“. Die Anleitung `partnerauftrag-abrechnen.md` liegt außerhalb der Schreibrechte; bleibt offene Frage 8 und 9 mit den Wortlauten aus dem Befund.
9. [rot] `Number(null)` wird 0 im Lead-Verlauf: **behoben**. `src/payload/hooks/lead-verlauf.ts` lässt leere Verweise leer (`null`), auch bei neuen Einträgen. Test in `lead-verlauf.test.ts` mit einem Eintrag ohne Verweis und anschließendem Wechsel der Zuordnung (keine 0, neuer Betrieb 8).
10. [gelb] Auftragsart aus ungeprüftem `daten.serviceId`: **zutreffend, nicht im Paket behebbar**. Bestätigt: `records.ts` speichert `payload.serviceId` aus dem Browser, Preis und Terminstandort nutzen `verify.serviceId`. Die Abhilfe liegt in `src/lib/actions/records.ts` (außerhalb der Schreibrechte). Bis dahin beruht die vorgeschlagene Auftragsart (Zusatz 7) und damit Partnerauswahl und Provisionsvorschlag auf einer Angabe aus dem Browser; das Team sieht und ändert die Auftragsart am Vorgang. Offene Frage N2.
11. [gelb] Sperrgrund ließ sich ohne Wechsel leeren: **behoben**, mit einer Abweichung vom Vorschlag. `statuswechselPruefen` (`src/lib/partner/bewerbung.ts`) lehnt das Leeren ab, wenn vorher ein Grund gespeichert war (neues Feld `sperrGrundVorher`, vom Hook aus `originalDoc` gesetzt). Die Prüfung gilt nicht für ältere pausierte Betriebe ganz ohne gespeicherten Grund, damit sie bearbeitbar bleiben. Test in `pruefliste.test.ts`.
12. [gelb] Wie Nr. 6: **behoben** (dieselbe Änderung). Vorher geprüft: `vorgangAendern` und die Datenschicht schreiben mit `overrideAccess: true`, sie bleiben unberührt.
13. [gelb] `limit: 500` beim Pausieren oder Sperren: **behoben**. `partnerbetriebNachAenderung` lädt die laufenden Leads mit `pagination: false`.
14. [gelb] Teständerung in `src/lib/actions/auftragsweg.test.ts` (Abschnitt `anliegenArt: 'frage'`, FA-06-U2): **zutreffend, nur Zuordnung**. Diese Zeile gehört zu FA-KERN-07 (Regel aus Commit c5c82b0), nicht zu FA-PLATTFORM-01B; bitte bei der Abnahme FA-KERN-07 zurechnen.

Geänderte Dateien der Nachbesserung: src/lib/partner/pruefliste.ts, src/lib/partner/pruefliste.test.ts, src/lib/partner/bewerbung.ts, src/lib/mail/nachricht-vorlagen.ts, src/payload/hooks/kunden-nachricht.ts, src/payload/hooks/kunden-nachricht.test.ts, src/payload/hooks/auftragsweg.ts, src/payload/hooks/auftragsweg.test.ts, src/payload/hooks/lead-verlauf.ts, src/payload/hooks/lead-verlauf.test.ts, src/payload/hooks/partner-pruefung.ts, src/payload/collections/Vorgaenge.ts, src/payload/collections/Partnerbetriebe.ts, src/payload-types.ts (nur Beschreibungstext), src/lib/server/freigabe.db.test.ts (Nr. 6), docs/betrieb/partner-pruefen.md.

Prüfung nach der Nachbesserung (über die Datenweiche):
- `vitest run`: 246 Dateien, 3829 Tests grün. Ein früherer Lauf hatte 2 Fehler in `src/lib/flow/schritt-historie.test.ts` (FA-QA-04B, parallel in Arbeit, nicht dieses Paket); im Wiederholungslauf grün.
- `vitest run -c vitest.db.config.ts`: 27 Dateien, 165 Tests grün.
- `typecheck`: ohne Fehler. `lint`: ohne Befund. `build`: erfolgreich.

Neue offene Fragen:
- N1 (Anwalt, R10): Bei Vermittlung mit Modell A sagt die Mail „Ihr ausführender Betrieb“ dem Kunden „Vertragspartner für die Ausführung ist …“, Vertragsbestätigung und AGB sagen „Ihr Vertragspartner ist Schlüsselmacher24“. Welche Aussage gilt bei Modell A, und wie lautet der Text für Modell B und den Partnerweg? Bis dahin lehnt der Server die Vorlage bei B und im Partnerweg ab.
- N2 (nächstes Paket mit Schreibrecht auf `src/lib/actions/records.ts`): die geprüfte Leistung serverseitig festhalten (`payload.serviceId` mit `verify.serviceId` überschreiben oder eigener Schlüssel wie `AUFTRAGSWEG_DATEN`), damit Zusatz 7 und die Vorschlagsliste nicht auf einer Browserangabe beruhen.
- N3: Der Hinweis am Vorgang (Zusatz 8) erscheint auch bei Betrieben mit Modell B oder im Partnerweg, obwohl die Vorlage dort abgelehnt wird; bei Bedarf den Hinweis dort ausblenden oder umformulieren.

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-PLATTFORM-01B`, alle drei Pakete der Welle gemeinsam im Arbeitsbaum, nach allen Eingriffen): Typprüfung grün, Lint grün, Unit 3834 von 3834, Datenbanktests 165 von 165 (beide Partner-Migrationen laufen auf einer frischen Datenbank), Build 181 von 181 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 137 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Migration `20261116_081528_partner_pruefung`: `up` gelesen, nur additiv (vier neue Wertelisten, der neue Stand „gesperrt“, drei neue Tabellen, 34 neue Spalten, Fremdschlüssel und Indizes). Das eine `UPDATE` schreibt nur in die neue Spalte `pruefliste_vor_einfuehrung` und markiert Betriebe, die schon freigeschaltet oder pausiert sind; sie bleiben freigeschaltet (G6).

Geprüft nach dem Zwischenfall aus dem Bericht (die Datei `Partnerbetriebe.ts` wurde vom Baumeister neu geschrieben): Vergleich mit dem Startcommit. Alle früheren Felder sind da, die Zugriffsregeln ebenso (Team, Provisionen nur Inhaber), und die Prüfungen beim Speichern laufen weiter, jetzt im Hook `partnerbetriebVorAenderung` (frühere Auftragsarten, Provisionen, Statusautomat, Schalter für Modell B).

Erledigt außerhalb der Schreibrechte des Pakets:
- Offene Frage N2 (Befund der Gegenprüfung): Die Auftragsart beruhte auf `serviceId` aus dem Browser. `src/lib/actions/records.ts` schreibt jetzt bei jeder geprüften Buchung die geprüfte Leistung in die Daten; eine abweichende Angabe aus dem Browser geht nirgends hin. Test in `security.test.ts` („speichert die geprüfte Leistung, nicht die aus dem Browser“); ohne den Eingriff schlägt er fehl.
- Offene Frage N3: Der Hinweis „Ihr ausführender Betrieb“ erscheint im Partnerweg (zentrale Zahlung) nicht mehr, weil der Server die Nachricht dort ablehnt (`betriebHinweisFeld`, dieselbe Regel wie am Endpunkt, robust gegen unvollständige Dokumente). Der Datenbanktest erwartete den Hinweis an einem Auftrag im Partnerweg; er prüft jetzt, dass er dort fehlt, und zwei neue Unit-Tests prüfen den Hinweis außerhalb des Partnerwegs.
- `docs/betrieb/partnerauftrag-abrechnen.md`: Auswahl nur freigeschalteter Betriebe und Auftragsart aus der gebuchten Leistung nachgezogen.
- Die Teständerung in `src/lib/server/freigabe.db.test.ts` (Altfeld „Bewerbung (alt)“ nur lesbar) habe ich gelesen: Sie setzt den Altwert über die Datenschicht und prüft zusätzlich, dass das Backend das Feld nicht setzt. Keine Prüfung ist gelockert.

Nicht im Browser geprüft: der Admin (Prüfliste, Sperren, Lead-Verlauf, Filter „Wartet auf Zuordnung“, Vorschlagsliste, Nachricht an den Kunden). Das decken 165 Datenbanktests und die Unit-Tests der Hooks; eine Probe im Admin mit zwei Rollen gehört zu FA-QA-01.

Für Menschen: MA-54 ist um die Fragen aus diesem Paket ergänzt (Sperre und Auszahlung, „Schlüsselbart fräsen“, Betriebe mit nur „Autoschlüssel allgemein“, Rückkehr aus „gesperrt“). Die Frage, wer bei einer Vermittlung Vertragspartner des Kunden ist, geht an den Anwalt (MA-29); bis dahin sendet der Server die Nachricht nur bei Abrechnung A außerhalb des Partnerwegs.

=== ENDE FA-PLATTFORM-01B · BEREIT ZUR RÜCKGABE ===
