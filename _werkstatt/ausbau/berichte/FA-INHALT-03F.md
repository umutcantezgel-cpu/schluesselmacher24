# Bericht FA-INHALT-03F · Texte menschlicher: Startseite unter dem Hub, Autoschlüssel-Übersicht, Marken- und Modellseiten

Stand 15.11.2026. Kein git, kein Server, kein Build. Prüfungen über die Datenweiche: vitest 205 Dateien / 3091 Tests grün, typecheck grün, lint grün. Zwischendurch war lint rot in einer fremden Datei (`src/components/fahrzeug-anfrage/seiten.tsx:91`, `<a>` statt `<Link>`, gleichzeitig in Arbeit bei FA-KERN-05); im Schlusslauf war der Befund behoben.

## GEÄNDERTE DATEIEN
- `src/app/(site)/page.tsx`: nur unter dem Hub. Lead im Autoschlüssel-Abschnitt, „Warum bei uns“ (drei Punkte), fünf Ablaufschritte, Kopf und Kartentexte „Direkt kaufen“, Kopf „Projekte“, Titel „Ratgeber“. Hub, Frage, Satz darunter, `generateMetadata`, `VERTRAUENSBASIS` (Firmendaten), `PartnerSektion` und Knopftexte unverändert.
- `src/app/(site)/autoschluessel/page.tsx`: Infotipps (Transponder, Bart, Smart Key), Begriffsliste (drei Gruppen), Fallback-FAQ, Aufbau-Texte 1 und 2, Hinweis Anzahlung und Vorlauf, Abschnittsköpfe, Fallback der Unterzeile, Weiterlesen. Neu: Verweise „Fahrzeug nicht gefunden?“ (über `anfrageHref()`) und die Fahrzeugklassen Motorrad, Roller, E-Scooter, Seniorenmobil, Fahrrad im Abschnitt „Fahrzeuge“ (Paket erlaubt das, weil der Verweis fehlte). `generateMetadata` unverändert.
- `src/app/(site)/autoschluessel/marken/page.tsx`: Fallback der Unterzeile, Fallback der Einleitung, zwei Absätze unter „Was Sie hier finden“, Leads „Übersicht“, „Von A bis Z“, „Der nächste Schritt“, zwei Knöpfe. `KATALOG_QUELLE` (Quellenvermerk KBA) und der Block `FahrzeugNichtGefunden` unverändert. Die gleichzeitige Änderung von FA-SEO-01B an `generateMetadata` in dieser Datei ist erhalten.
- `src/app/(site)/autoschluessel/marken/[make]/page.tsx`: Kopf-Lead, Modellsatz, Überschrift und drei Absätze der Einordnung, Lead „Modelle“, Satz im Block „Fahrzeug nicht gefunden?“ (Eigenschaft `satz`, Block selbst unverändert), Lead und Knopf „Der nächste Schritt“. Import `aufzaehlung` ergänzt.
- `src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx`: Wert „nicht erfasst“, vier Einordnungspunkte, Leads der Abschnitte 01, 02, 04, 05, 08, Vorbehaltskasten (Text, Titel unverändert), Gedankenstrich in „Ohne funktionierenden Schlüssel“.
- `src/lib/fahrzeug-texte.ts`: nur `einleitung`, `faq`, `mitbringen` in `modellTexte`. `metaTitel`, `metaBeschreibung`, `markenTexte` unverändert (FA-SEO-01B).
- `content/seo.json` und gleichlautend `src/lib/data/defaults/content.ts`: `subline` und `intro` der Routen `autoschluessel` und `autoschluessel/marken`. `headline`, `faq`, `seo.*` und alle anderen Routen unverändert. Im Rückfall stand bei `autoschluessel` noch eine ältere Unterzeile mit Gedankenstrich; beide Quellen sind jetzt gleich.
- Nicht geändert: Startseite `intro` und `faq` in seo.json und content.ts. `intro` der Startseite wird nirgends angezeigt (`page.tsx` liest nur `subline` und `headline`), `faq` ist leer. Tests: keine Änderung nötig, kein Test erwartet einen geänderten Wortlaut (der Test zu „verbindlich nach Prüfung der Unterlagen“ bleibt erfüllt).

## WAS UND WARUM
Startseite (unter dem Hub)
- Ablaufschritt 2 heißt jetzt „Unterlagen hochladen“: Fahrzeugschein und drei Fotos, mit der Ausnahme bei Verlust aller Schlüssel (A-048, `pflicht.ts`, `unterlagen-pflicht.ts`). Schritt 3 erklärt „manuelle Prüfung“ als „prüfen wir zuerst von Hand“. Schritt 4 nennt die Anzahlung nur aus den Einstellungen („In der Regel {deposit}“). Schritt 5: Nachweis im Wortlaut von FA-INHALT-03A (Ausweis, Fahrzeugschein, Vollmacht des Halters).
- „Direkt kaufen“: Ohne veröffentlichte Codeprodukte (A-046) heißt der Kopf „Ohne Termin“ / „Ohne Termin bestellen oder anfragen“ statt „Direkt kaufen“ / „Bestellen ohne Termin“. Die Karte „Schlüssel nach Code“ sagt „Zurzeit nur auf Anfrage.“ und dann den Satz der Code-Seite. Mit Produkten bleibt der alte Kopf. Die Karte „Sperrschließung“ trägt die Laienerklärung „Ein Schlüssel für mehrere Türen“ und sagt, dass man im Konfigurator direkt bestellt. Keine Zahlen, Zeiten oder Zusagen neu.
- „Warum bei uns“: „Keine Überraschung vor Ort.“ (Satzfetzen, Zusage) gestrichen. „Nachvollziehbare Abläufe“ heißt „Stand selbst abrufen“. „Sichere Zahlung“ hieß nach etwas, das der Text nicht belegte; jetzt „Anzahlung zählt zum Preis“, der Satz zur Anrechnung bleibt wörtlich.
- Projekte: „strukturiert“, „geführte Konfiguratoren“ und „belastbares Angebot“ ersetzt durch „fragen wir Ihren Bedarf Schritt für Schritt ab … Zusammenfassung … Angebot“.
- Ratgeber: „häufigsten“ (nicht belegt) wurde „häufige“.
- Die Erreichbarkeit steht weiter nur über `erreichbarkeit(settings)` im Hub. Im Text ist keine Zeitangabe hinzugekommen.

Autoschlüssel-Übersicht
- Alle fünf Gedankenstriche entfernt. „Was ist der Schlüsselbart?“ als Infotitel wurde „Der Schlüsselbart“ (keine rhetorische Frage außerhalb der FAQ).
- Begriffsliste: Satzfetzen zu ganzen Sätzen („Kein Schlüssel mehr vorhanden.“ wurde „Sie haben keinen Schlüssel mehr.“), „bekannt gemacht“ wurde „Wir tragen den Schlüssel im Fahrzeug ein.“, „Zugriff auf das Fahrzeug“ wurde „muss das Fahrzeug vor Ort sein“ (wie im Infotipp ON_SITE_HINT und FACHWISSEN 8). „Zerstörungsfreies Öffnen“ wurde „ohne etwas zu beschädigen“.
- FAQ (Rückfall, wird angezeigt, weil `faq` in seo.json leer ist): kürzer. Neu nur Belegtes: Fotos entfallen bei Verlust aller Schlüssel (A-048), Erklärung „Rohling“. Fahrzeugöffnung nennt den Nachweis jetzt konkret im Wortlaut der Seite Fahrzeugöffnung aus FA-INHALT-03A (Ausweis, Fahrzeugschein, Vollmacht oder Bestätigung des Halters). Die Strukturdaten nehmen dieselbe Liste (R8).
- Ablaufkopf: „So läuft Ihr Auftrag ab: 5 Schritte zum Termin“ (Effekt-Doppelpunkt) wurde Titel „So läuft Ihr Auftrag ab“ und Oberzeile „Ablauf in 5 Schritten“ (Zahl weiter aus den Rubrikdaten). Die Schritte selbst kommen aus `content/rubriken.json` (Rubrikdaten, gesperrt), siehe OFFENE FRAGEN 1.
- Anzahlungshinweis: Betrag und Vorlauf weiter nur aus den Einstellungen; „standardmäßig“ wurde „in der Regel“, „können abweichende Werte gelten“ blieb als „können andere Werte gelten“.
- Unterzeile (seo.json und Rückfall): „Wir machen Autoschlüssel nach, programmieren und reparieren sie. Sie kommen mit festem Termin in unsere Werkstatt in Wetzlar, gern auch von weiter her.“ Aussage wie bisher (Werkstatt Wetzlar, fester Termin, Anreise von außerhalb).
- Fahrzeuge: Neue Verweise auf „Fahrzeug nicht gefunden?“ und die fünf weiteren Fahrzeugklassen (FA-06). Die Seiten existieren alle; ihre Inhalte gehören zu FA-KERN-05, hier stehen nur Verweise.
- Partnerweg: nichts dazu geschrieben.

Markenübersicht
- Längster Satz 27 → 18 Wörter („Anlernen“ als eigener Satz erklärt). Gedankenstrich entfernt. „Ist Ihre Marke … nicht aufgeführt … geführten Ablauf“ führt jetzt sprachlich in die Anfrage, wie der Block darunter. Knöpfe nach A-031 „Termin anfragen“. A–Z-Lead in drei kurzen Sätzen; der Zeilensatz „Wir prüfen Ihr Fahrzeug auf Anfrage.“ für Marken ohne eigene Seite blieb (schon kurz und ehrlich). Quellenvermerk KBA wörtlich.

Markenseite
- Lead ohne Gedankenstrich und ohne das Fachwort „Termin-Assistent“: „Es sind dieselben Preise wie bei der Terminanfrage.“ (Code: `leistungsPreise` ruft `quoteCarKeyService` wie der Assistent).
- Einordnung aus Daten: Der Satz „Nicht jedes Modell hat alle.“ erscheint nur, wenn die Marke mehr als eine Schlüsselart hat. Der Vor-Ort-Satz hat jetzt auch den Fall „bei keinem Modell“, und „Für Arbeiten nur am Bart gilt das nicht.“ steht nur, wenn mindestens ein Modell das Fahrzeug braucht. So stimmt jede Aussage für jede Marke.
- Knöpfe „{Marke} auswählen“ und „Ablauf mit {Marke} starten“ heißen beide „Termin für {Marke} anfragen“ (ein Text je Ziel, A-031; Marke bleibt vorbelegt).

Modellseite und fahrzeug-texte.ts
- Einleitung: „sind 1 Schlüsselarten erfasst“ (Fehler bei einer Art) wird zu „eine Schlüsselart“. Der Satz „6 Leistungen sind möglich … berechnet wie im Termin-Assistenten.“ stand auf fast allen 49 Seiten gleich und sagte wenig (R3). Er ist ersetzt durch den Preis des Modells: „Die Preise beginnen bei {ab}.“ oder, wenn alle Leistungen erst nach Prüfung einen Preis haben, „Den Preis nennen wir nach Prüfung Ihrer Unterlagen.“ Beides kommt aus den Preisregeln des Modells.
- „Bitte mitbringen“: Nachweis im Wortlaut von FA-INHALT-03A (R13), Titel „Fahrzeugschein und Ausweisdokument“ bleibt (Test).
- Einordnung: „Zugriff auf Ihren … ; ein Versand … löst die Aufgabe dann nicht.“ wurde „muss Ihr {Fahrzeug} bei uns sein. Den Schlüssel nur einzuschicken reicht dann nicht.“ Vorlaufsatz: „Bis zum frühesten Termin dauert es etwa {vorlauf}“ (funktioniert für „7 Tage“ und „7 bis 14 Tage“). Titel des ersten Punkts heißt ohne Leistungen „Fahrzeug zum Termin“ statt „Ohne Fahrzeug möglich“ (das war ohne Daten nicht belegt).
- Vorbehaltskasten: Gedankenstriche weg, „Rohlingstyp oder Elektronikvariante“ wurde „die Art des Rohlings oder der Elektronik“.
- „Was darin nicht steht, erfinden wir nicht“ (Selbstbeschreibung) gestrichen.

Gegenlesen: Dieses Paket hatte kein Werkzeug, um Unteragenten zu starten. Ich habe deshalb zwei Lesungen nacheinander selbst gemacht. (1) Als älterer Kunde ohne Fachwissen: Ergebnis waren die Erklärungen zu Rohling und Anlernen, „von Hand“ statt „manuell“, „Terminanfrage“ statt „Termin-Assistent“ und ganze Sätze statt Stichwortfetzen. (2) Tatsachenprüfung gegen die Kopie der alten Fassung (Scratchpad, kein git), den Code (`pflicht.ts`, `unterlagen-pflicht.ts`, `leistungsPreise`, Rubrikdaten) und FACHWISSEN 8 sowie A-046, A-048: Ergebnis waren „können andere Werte gelten“ statt „gelten“, die Datenbedingungen auf der Markenseite (eine Art, kein Modell vor Ort) und der Titel „Fahrzeug zum Termin“. Eine unabhängige Gegenlesung durch zwei andere Leser steht aus (OFFENE FRAGEN 5).

## ZAHLEN VORHER UND NACHHER
Messung: `stil.mjs` braucht einen laufenden Server, der hier nicht erlaubt ist. Gemessen wurde mit `pruefeZeile` und `tsxZeilen` aus stil.mjs über die Seitendateien, dazu `headline`, `subline`, `intro`, `faq` aus seo.json je Route. Das ist eine Heuristik: Sie überspringt Zeichenketten mit `${…}`. Ein Teil des Wortzuwachses kommt daher, dass einige Texte jetzt ohne Platzhalter stehen und erst gezählt werden. Der Rest ist der vollständige Nachweis (R13), die neuen Verweise und die Erklärungen.

| Seite | Wörter vorher → nachher | längster Satz vorher → nachher | Mittel | Gedankenstriche vorher → nachher | Fragen | Bindestrich-Kandidaten |
|---|---|---|---|---|---|---|
| / (unter dem Hub) | 310 → 378 | 14 → 17 | 4,8 → 5,3 | 0 → 0 | 0 → 0 | 2 → 2 |
| /autoschluessel | 830 → 937 | 15 → 15 | 6,0 → 6,0 | 5 → 0 | 9 → 9 | 1 → 1 |
| /autoschluessel/marken | 274 → 291 | 27 → 18 | 6,7 → 6,2 | 1 → 0 | 2 → 2 | 0 → 0 |
| /autoschluessel/marken/[make] | 83 → 119 | 19 → 12 | 3,2 → 3,8 | 0 → 0 | 0 → 0 | 1 → 1 |
| /autoschluessel/marken/[make]/[model] mit fahrzeug-texte.ts | 408 → 469 | 14 → 13 | 5,4 → 5,5 | 6 → 0 | 0 → 0 | 2 → 1 |

Zusätzlich die erzeugten Texte aller 49 Modelle (Einleitung, FAQ, Mitbringliste, mit `tsx` erzeugt): vorher zwei Gedankenstriche je Modellseite (Einleitung und Mitbringliste), nachher keiner. Längster Satz vorher wie nachher 23 Wörter (FAQ-Antwort bei Modellen mit fünf Prüf-Leistungen, Liste der Leistungsnamen). Kein Satz über 25 Wörtern.

Fragen auf /autoschluessel: sechs echte FAQ-Fragen, „Fahrzeug nicht gefunden?“ (vorgegebener Name des Wegs) und zwei Ratgebertitel im Weiterlesen (gesperrt, gehören zu den Beiträgen); auf /autoschluessel/marken eine in der SEO-Beschreibung (gesperrt) und ein Ratgebertitel. Bindestrich-Kandidaten: „Autoschlüssel-Termin anfragen“ (Knopf wie in der Kopfzeile der Seite), „Autoschlüssel-Auftrag“, „Autoschlüssel-Werkstatt“ (SEO-Titel, gesperrt), „Autoschlüssel-Leistungen“; unverändert gelassen, siehe OFFENE FRAGEN 4.

Offene Stellen je Seite: Startseite keine im Text, Ablaufschritte der Übersicht in den Rubrikdaten (OFFENE FRAGEN 1), Modellseite „Einsätze vor Ort nur nach Prüfung“ (Schlussredaktion).

## SCHLUSSREDAKTION (Liste für den Menschen)
Startseite
1. „Direkt kaufen“ ohne Codeprodukte: Kopf „Ohne Termin bestellen oder anfragen“, Karte „Zurzeit nur auf Anfrage.“ Passt das, bis Ihre echten Angebote (MA-34) online sind?
2. Ablaufschritt „Termin buchen“ nennt jetzt Ausweis, Fahrzeugschein und bei fremdem Halter die Vollmacht. Reicht dort der kurze Hinweis, oder soll die Vollmacht erst im Ablauf erscheinen?
3. „Warum bei uns“: „Stand selbst abrufen … jederzeit“ und „Anzahlung zählt zum Preis“. Stimmen Titel und Aussage für Sie?

Autoschlüssel-Übersicht
1. FAQ „Für Arbeiten nur am Bart oft nicht“ und „Für Arbeiten nur am Bart geht das oft“ (Bestand: „in vielen Fällen“). Fachlich so richtig?
2. Fahrzeugöffnung: Nachweis „Ausweis und Fahrzeugschein … Vollmacht oder Bestätigung des Halters“. Der Fahrzeugschein liegt oft im verschlossenen Fahrzeug. Wie soll der Kunde den Nachweis dann führen?
3. Begriffsliste „Wir fräsen den Bart und lernen die Elektronik an“ und „Wir tragen den Schlüssel im Fahrzeug ein“. Laienfreundlich und fachlich genau genug?

Markenübersicht
1. „Beim Anlernen tragen wir den neuen Schlüssel im Fahrzeug ein.“
2. „Fehlt Ihre Marke oder Ihr Modell, heißt das nicht, dass wir nicht helfen können.“ Wollen Sie diese Zusage so stehen lassen?
3. A–Z-Lead „Hat eine Marke eine eigene Seite, kommen Sie dorthin. Sonst kommen Sie zur Anfrage“.

Markenseite
1. „Es sind dieselben Preise wie bei der Terminanfrage.“
2. Knopf „Termin für {Marke} anfragen“ (vorher „{Marke} auswählen“ und „Ablauf mit {Marke} starten“).
3. Überschrift „Diese Schlüssel gibt es für {Marke}“ über der Einleitung aus den Fahrzeugdaten.

Modellseite
1. Einleitung „Die Preise beginnen bei …“ bzw. „Den Preis nennen wir nach Prüfung Ihrer Unterlagen.“
2. „Einsätze bei Ihnen vor Ort gibt es nur nach Prüfung.“ Stand aus dem Bestand. Gibt es diese Einsätze heute (Partnerweg ist für Kunden aus)?
3. „Bei manchen Fahrzeugen müssen beim Anlernen alle Schlüssel neu eingetragen werden.“

## OFFENE FRAGEN
1. Ablauf der Rubrik Autoschlüssel (`content/rubriken.json`, gesperrt): Schritt 2 heißt dort „Fotos hochladen“, nicht „Unterlagen hochladen“, und die Ausnahme bei Verlust aller Schlüssel fehlt. Die Übersicht zeigt diesen Ablauf. Auf der Startseite steht der neue Wortlaut. Ein Paket mit Schreibrecht auf die Rubrikdaten sollte den Schritt angleichen (A-034: nur Text ändern, Icon und Reihenfolge bleiben).
2. Verweis „Schlüssel nach Code“ auf der Startseite führt weiter auf `/schluessel-nach-code`. Ohne Produkte zeigt diese Seite „Auf Anfrage“ und als Hauptknopf „Code anfragen“, der Weg ist also ein Klick weiter. Ein direktes Ziel (`CODE_ANFRAGE_PFAD`) wäre eine Änderung am Verweis, nicht am Text; nicht gemacht, weil die Schreibrechte nur sichtbare Texte erlauben.
3. Startseite `intro` in seo.json und content.ts wird nirgends angezeigt. Ich habe es nicht geändert. Wird es noch gebraucht?
4. Bindestrich-Kandidaten „Autoschlüssel-Termin“, „Autoschlüssel-Auftrag“, „Autoschlüssel-Leistungen“ bleiben. Der Knopf „Autoschlüssel-Termin anfragen“ steht gleich in der Kopfzeile (`site-header.tsx`, nicht in diesem Paket); ändern nur gemeinsam.
5. Unabhängige Gegenlesung durch zwei andere Leser (Haiku als älterer Kunde, Opus als Tatsachenprüfer) fehlt; hier nur selbst in zwei Durchgängen gelesen.
6. Modellseite, Abschnitt 05 „Termin“: Der Satz „Einsätze vor Ort nur nach Prüfung“ aus dem Bestand ist bis zur Antwort des Inhabers weggelassen (Nachbesserung Befund 10). Gibt es Einsätze beim Kunden heute, obwohl der Partnerweg für Kunden aus ist? Wenn ja, kommt der Satz im Wortlaut des Inhabers zurück.

## Nachbesserung
Stand 15.11.2026 nach zwei Gegenprüfungen. Prüfungen über die Datenweiche danach: vitest 205 Dateien / 3095 Tests grün, typecheck grün, lint grün. Kein git, kein Server, kein Build.

1. [rot] Ablauf der Rubrik Autoschlüssel auf Übersicht und Markenübersicht (`content/rubriken.json`): **nicht in diesem Paket behebbar, offen.** Die Paketdatei sperrt die Rubrikdaten ausdrücklich („Nicht anfassen: … Rubrikdaten“). Den Ablauf auf beiden Seiten durch eigenen Seitentext zu ersetzen, hätte die Rubrikdaten als einzige Quelle umgangen (G-10, G-11, A-034). Der Befund trifft zu. Nötig ist ein Folgepaket mit Schreibrecht auf `content/rubriken.json` und den Rückfall in `src/lib/data/defaults`, das nur die Texte der Schritte 2 bis 5 an die Startseite angleicht: „Unterlagen hochladen“ mit Fahrzeugschein, drei Fotos und Ausnahme bei Verlust aller Schlüssel, „von Hand“ statt „manuelle Prüfung“, „In der Regel {anzahlung}“, Vollmacht des Halters wie FA-INHALT-03A. Icon und Reihenfolge bleiben (A-034). Bis dahin ist FA-INHALT-03F für die Autoschlüssel-Übersicht nicht vollständig.
2. [gelb] Code-Verweis auf der Startseite: **behoben.** Ohne Codeprodukte führen Karte und Knopf im Autoschlüssel-Abschnitt jetzt direkt auf `CODE_ANFRAGE_PFAD` (`@/lib/wege/code-anfrage`); das späte Vorladen (`heroZiele`) nimmt dasselbe Ziel. Mit Produkten bleibt `/schluessel-nach-code`. Der doppelte Satz „Zurzeit nur auf Anfrage.“ ist gestrichen, die Marke „Auf Anfrage“ sagt es. OFFENE FRAGEN 2 ist damit erledigt.
3. [gelb] „Stand selbst abrufen“: **behoben.** Neu: „Jeder Auftrag bekommt eine Vorgangsnummer. Mit ihr und Ihrer E-Mail-Adresse sehen Sie den Stand selbst nach.“ (die Abfrage verlangt beides).
4. [gelb] Knopftexte: **behoben.** Alle Knöpfe zu `/autoschluessel/anfrage` auf Modellseite (zwei) und Markenseite (zwei) heißen „Termin anfragen“ (A-031). Die Marke bleibt über `?marke=` vorbelegt. Schlussredaktion Markenseite Punkt 2 ist damit hinfällig.
5. [gelb] Fotos ohne Ausnahme: **behoben.** Zusatz „Sind alle Schlüssel verloren, entfallen die Fotos.“ in der Markenübersicht („Der nächste Schritt“), auf der Markenseite (Block „Fahrzeug nicht gefunden?“, Satz `satz`, und „Der nächste Schritt“) und auf der Modellseite (Abschnitt 08). Beleg: `unterlagen-pflicht.ts` (`keinSchluesselMehr`), gilt für alle Fahrzeugschlüssel-Wege (A-048).
6. [gelb] Lead Abschnitt 02 der Modellseite: **behoben.** „Die Preise gelten, wenn Sie noch einen funktionierenden Schlüssel haben. Wo es ohne Schlüssel anders ist, steht das dabei. Es sind dieselben Preise wie bei der Terminanfrage.“
7. [gelb] FAQ-Satzfetzen auf der Übersicht: **behoben.** „Wenn wir nur den Bart fräsen, muss Ihr Fahrzeug oft nicht da sein. Muss der Schlüssel elektronisch angelernt werden, brauchen wir das Fahrzeug.“ Die Strukturdaten nehmen dieselbe Liste. Schlussredaktion Übersicht Punkt 1 („oft“) bleibt als Frage.
8. [gelb] Doppelte Verneinung in der Markenübersicht: **behoben.** „Fehlt Ihre Marke oder Ihr Modell, können wir vielleicht trotzdem helfen. Senden Sie uns eine Anfrage. Wir prüfen Ihr Fahrzeug einzeln.“ „Vielleicht“ statt „oft“, weil „oft“ nicht belegt ist. Schlussredaktion Markenübersicht Punkt 2 fragt den Inhaber, ob er mehr zusagen will.
9. [gelb] Gleicher Befund wie 5: **behoben** mit denselben Änderungen (Markenübersicht Z. 213, Markenseite Z. 346 und 357, Modellseite Z. 617).
10. [gelb] „Einsätze bei Ihnen vor Ort“: **behoben.** Der Satz ist bis zur Antwort des Inhabers weggelassen. Der Lead heißt nur noch „Sie kommen zum Termin in unsere Werkstatt, gern auch von außerhalb Mittelhessens.“ Neu als OFFENE FRAGE 6; Schlussredaktion Modellseite Punkt 2 verweist darauf.
11. [gelb] Verweisliste der Fahrzeugklassen: **behoben.** Die Liste ist über `aria-labelledby` mit dem Satz davor verbunden (`id="andere-fahrzeuge"`), und die Linktexte sind ausgeschrieben: „Motorradschlüssel“, „Rollerschlüssel“, „E-Scooter-Schlüssel“, „Seniorenmobil-Schlüssel“, „Fahrradschlüssel“.

Hinweis zum Vorgehen: Die Änderungen der Startseite (Befunde 2 und 3) habe ich mit einem kurzen Skript gemacht, das die Datei las und zurückschrieb. Die Paketdatei verbietet das für geteilte Dateien. Der Diff der Datei enthält danach nur die Änderungen dieses Pakets. Alle weiteren Änderungen habe ich mit dem Bearbeitungswerkzeug an einzelnen Stellen gemacht.

## ABNAHME (Orchestrator, 15.11.2026)

- **Befund 1 (rot) erledigt:** Die Ablaufschritte der Rubrik Autoschlüssel in `content/rubriken.json` und `src/lib/data/defaults/rubriken.ts` tragen jetzt den Wortlaut der Startseite: „Unterlagen hochladen“ mit Fahrzeugschein und drei Fotos, der Ausnahme bei Verlust aller Schlüssel, „Manche Fälle prüfen wir zuerst von Hand“, „In der Regel {anzahlung}“ und beim Termin Ausweis, Fahrzeugschein und Vollmacht des Halters. Autoschlüssel-Übersicht und Markenübersicht zeigen damit denselben Ablauf wie die Startseite. Symbole und Reihenfolge bleiben.
- **Skript statt Bearbeitungswerkzeug an der Startseite:** geprüft; der Unterschied zum Startcommit enthält nur Änderungen dieses Pakets.
- Typprüfung, Lint und Unit-Tests des Pakets waren grün (3.095 Tests, mit den Tests gleichzeitig laufender Pakete); Build und Sichtprobe folgen mit der Abnahme von FA-KERN-05.
- Fragen an den Inhaber (Einsätze beim Kunden vor Ort, „vielleicht trotzdem helfen“, Nachweis bei der Fahrzeugöffnung, wenn der Fahrzeugschein im Fahrzeug liegt) stehen in MA-41.
