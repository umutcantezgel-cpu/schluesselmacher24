> Archiviert aus dem Arbeitsordner `_werkstatt/` des Gestaltungslaufs. Pfade wie `_werkstatt/…` in diesem Dokument beziehen sich auf den Stand in der Git-Geschichte (Zweig `claude/projekt-gestaltung-entwicklung-tofodh`, Commit `b8e7ea7`); dort liegen auch Bilder, Galerie und Protokolle.

# Textvorschläge

Vorschläge für Texte außerhalb der Mikrotexte. Nichts davon ist eingebaut; du entscheidest.

## Startseite (aus der Sichtabnahme E2-L-07)
| Stelle | Heute | Vorschlag | Grund |
|---|---|---|---|
| Unterzeile im Kopf (`content/seo.json` → `subline`, Vorgabe in `src/lib/data/defaults/content.ts`) | „Dazu Schlüssel, Schließanlagen, Zutrittslösungen und Sicherheitstechnik aus einer Hand.“ | „Dazu Schlüssel nach Code und Vorlage, Schließanlagen, Zutrittslösungen und Sicherheitstechnik – in der eigenen Werkstatt geprüft.“ | „aus einer Hand“ ist eine Floskel; die Leitidee verlangt „bemaßt statt behauptet“. |
| Abschnitt 01 (`src/app/(site)/page.tsx`) | „Wobei können wir helfen?“ | „Acht Bereiche, je ein klarer Ablauf“ | Eine Frage als Überschrift wirkt generisch; die Zahl ordnet ein. |

## Modellseite (`/autoschluessel/marken/[make]/[model]`)
- **Doppelte Verweise:** „Andere {Marke}-Modelle“ (Abschluss) und „Alle {Marke}-Modelle“ (Passend dazu) führen auf dieselbe Seite. Vorschlag: den zweiten Verweis streichen oder durch „Autoschlüssel-Leistungen im Überblick“ (`/autoschluessel`) ersetzen.

## Schlüssel nach Vorlage (`/schluessel-nach-vorlage`)
- **Schrittzahl:** Abschnittsüberschrift „Vier Abschnitte“, Fließtext „Der Ablauf hat acht Schritte“, Navigation „Acht Schritte, mobil bedienbar“. Vorschlag: einheitlich „Acht Schritte in vier Abschnitten“ oder die Abschnittsüberschrift „In vier Etappen“.

## Autoschlüssel-Assistent (`/autoschluessel/anfrage`)
- **Absenden oder buchen:** Der Schritt „Termin“ sagt „Danach senden Sie Ihre Anfrage ab“, der Schritt „Anzahlung“ „Erst danach senden Sie die Anfrage ab“, der Knopf heißt „Zahlungspflichtig buchen“. Vorschlag nach rechtlicher Prüfung: einheitlich „Danach buchen Sie den Termin zahlungspflichtig“.
- **Doppelter Hinweis im Terminschritt:** Bei einem nicht mehr freien Zeitfenster erscheinen zwei Warnungen mit ähnlichem Inhalt. Vorschlag: nur „Ihr zuletzt gewähltes Zeitfenster ist nicht mehr frei. Bitte wählen Sie einen anderen Termin.“


## Autoschlüssel (`/autoschluessel`, aus der Sichtabnahme E4-L-23)
| Stelle | Heute | Vorschlag | Grund |
|---|---|---|---|
| Abschnittstitel (`src/app/(site)/autoschluessel/page.tsx`) | „Worum es in diesem Bereich geht“ | „Mechanik und Elektronik“ | Der Absatz erklärt die Zweiteilung in Bart und Elektronik; der Titel sagt es, statt es anzukündigen. |
| Abschnittstitel unten (ebd.) | „Weiterführende Seiten“ | „Passende Seiten“ | Gleiche Wortwahl wie auf der Anfrage-Seite („Passende Seiten…“). |

## Tür- und Schließtechnik (`/tuer-und-schliesstechnik`, aus der Sichtabnahme E4-L-23)
Nur streichen, nichts Neues ergänzen (K-003 „bemaßt statt behauptet“):
| Stelle | Heute | Vorschlag |
|---|---|---|
| Einleitung Leistungen | „Unsere Kernkompetenzen in der Tür- und Schließtechnik. Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik.“ | „Unsere Leistungen in der Tür- und Schließtechnik.“ |
| Kasten Brand- und Fluchttüren | „… erfordern höchste fachliche Expertise und die strikte Einhaltung bauaufsichtlicher Zulassungen.“ | „… erfordern die strikte Einhaltung bauaufsichtlicher Zulassungen.“ |
| Einleitung Häufige Fragen | „Wir legen Wert auf transparente Aufklärung. Hier beantworten wir die komplexesten Fragen …“ | Einleitung streichen; die Fragen sprechen für sich. |

## Service und Termin (`/service-und-termin`, aus der Kundschaft E5)
Floskeln und Superlative (K-003); Vorschläge streichen nur, Fachaussagen bleiben (zu prüfen in M-20):
| Stelle | Heute | Vorschlag |
|---|---|---|
| Abschnittstitel | „Vier Abläufe, ein Erlebnis“ | „Vier Abläufe“ |
| Abschnittstitel | „Präzision in jedem Schritt: Unsere Service-Architektur“ | „So arbeiten wir“ |
| Einleitung dazu | „… als integrierte architektonische Lösungen, die höchste Ansprüche an Präzision, Zuverlässigkeit und Langlebigkeit erfüllen müssen.“ | „Wir planen Schließ- und Sicherheitstechnik als Ganzes, nicht als einzelne Produkte.“ |
| Absatz Vorgehen | „… erfordert ein tiefgreifendes Verständnis …“, „exakt auf die spezifischen …“ | „… erfordert Verständnis …“, „auf die …“ |
| Fertigung | „… auf ein absolutes Minimum zu reduzieren.“ | „… kurz zu halten.“ |
| Montage | „… mit höchster handwerklicher Präzision.“ | Satzteil streichen. |
| Dokumentation | „… eine lückenlose Nachvollziehbarkeit und zukünftige Erweiterbarkeit garantieren.“ | „… damit die Anlage nachvollziehbar und erweiterbar bleibt.“ |
| Wartung | „… über Jahre hinweg konstant hoch bleibt …“ | „… erhalten bleibt …“ |

## Gleichschließende Zylinder (`/gleichschliessende-zylinder`, aus der Kundschaft E5)
- **Bestellbeispiel:** Die Tabelle „Beispiel aus der Beratungspraxis“ (Haustür 30/35, Wohnungstür 40/40, Kellertür 55/30) hat keine Quelle in `content/`. Ist es kein echter Fall, Vorschlag: „Musterbestellung“ (siehe M-22).
- **Maßschritt im Text:** „je angefangene 5 mm“ und „Fünf-Millimeter-Schritten“ stehen fest im Text, der Preis rechnet mit dem gepflegten Schritt (`stepMm`). Vorschlag: den Text aus den Daten bilden, sobald M-23 geklärt ist.

## Projekt-Konfigurator Schließanlagen (`/schliessanlagen/konfigurator`, aus der Kundschaft E5)
- **Zahl der Blöcke:** Metadaten und Unterzeile sagen „zehn Blöcke“, der Ablauf hat zehn Abfrage-Schritte und den Abschluss als elften. Vorschlag: „Zehn kurze Abschnitte, danach prüfen Sie alles auf einen Blick.“ – oder unverändert lassen, wenn der Abschluss nicht als Block zählt.

## Ratgeber (`/ratgeber/[slug]`, aus E5-BEFUND-H12)
- **Knopf „Ihr nächster Schritt“:** „Anfrage für Ersatzschlüssel starten“ (`content/guides.json`, `nextStep.label`) bricht auf Telefonen zweizeilig. Vorschlag: „Ersatzschlüssel anfragen“.

## Codelinien (`/schluessel-nach-code/[slug]`, aus E5-BEFUND-H06)
- **Erster Satz der Beschreibung:** In allen 51 Einträgen von `content/code-lines.json` beginnt `description` (und damit Meta-Beschreibung und JSON-LD) mit der kleingeschriebenen Anwendung, z. B. „Nachschlüssel für möbel- und büroschloss: büroschrank und rollcontainer.“ Die Seite zeigt diesen Satz schon als „Nachschlüssel für die Codelinie MS-01.“ (nur Anzeige). Vorschlag für die Daten: denselben Satz eintragen oder die Anwendung in Originalschreibung („… für Möbel- und Büroschloss: Büroschrank und Rollcontainer.“); `seo.description` entsprechend.

## Runde 2 (aus der Sichtabnahme E5-L-29, gegengeprüft)
Je Zeile: Stelle · heute · Vorschlag · Grund, wie im Entwurf des Befundpakets. Werte aus Einstellungen stehen als Platzhalter (`{deposit}`, `{leadDays}`). Vorschläge zu Zahlungs- und Rechtstexten gelten nur nach rechtlicher Prüfung.

### Autoschlüssel (`/autoschluessel`)
- H02 Abschnitt 03 „Ablauf“, Hinweis „Anzahlung und Vorlauf“ (`src/app/(site)/autoschluessel/page.tsx` Z. 482–489; Werte aus den Einstellungen) · heute: „Die Anzahlung beträgt standardmäßig {deposit} und wird vollständig auf den Gesamtpreis angerechnet. Der Vorlauf von etwa {leadDays} Tagen entsteht durch die Beschaffung des passenden Schlüssels. Für einzelne Fahrzeuge und Leistungen können abweichende Werte gelten — diese sehen Sie im Ablauf, bevor Sie etwas verbindlich buchen.“ (derzeit 69,90 € und 7) · Vorschlag: nur den letzten Satz behalten („Für einzelne Fahrzeuge und Leistungen können abweichende Werte gelten — diese sehen Sie im Ablauf, bevor Sie etwas verbindlich buchen.“), Titel „Abweichende Werte“. Grund: Schritt 4 (Z. 258) und Schritt 5 (Z. 262) nennen Betrag, Anrechnung und Vorlauf mit Grund schon (E5-L-29 H02 Befund 3).

### Modellseite (`/autoschluessel/marken/[make]/[model]`)
- Abschnitt 02, Titel (page.tsx Z. 308) · heute „Diese Bauformen kommen beim {Marke} {Modell} vor“ · Vorschlag „Diese Schlüsselarten sind beim {Marke} {Modell} erfasst“ · Grund: Keyless steht künftig als Textzelle in der Reihe und ist keine Bauform (D-026: „Arten ohne eigene Bauform“). „Erfasst“ ist die Wortwahl der Datentabelle („Erfasste Schlüsselarten“) und passt zur Augenbraue „02 Schlüsselarten“.

### Ratgeber (`/ratgeber/[slug]`)
- content/guides.json · autoschluessel-verloren-was-tun · `excerpt` gegen `body` (Herkunft: Paketentwurf H12, kein Befund in E5-L-29) · heute: Die Unterzeile nennt „… erst sichern, dann prüfen, dann bestellen.“, die Kopfzeichnung zeigt daraus „01 sichern · 02 prüfen · 03 bestellen“. Die Abschnitte heißen „01 Zuerst: Ruhe bewahren und nachsehen · 02 Prüfen: … · 03 Sicherheitsfrage: Sollte etwas gesperrt werden? · 04 Was wir von Ihnen brauchen“ · Hinweis an die Redaktion: prüfen, ob die Reihenfolge der Unterzeile zur Reihenfolge der Abschnitte passt (meint „sichern“ den Abschnitt 03?). Die Zeichnung folgt der Unterzeile von selbst (`ablaufAusText`). Welche Reihenfolge fachlich gilt und ob überhaupt etwas zu ändern ist, entscheidet die Redaktion.

### Code-Shop (`/schluessel-nach-code`)
- `src/app/(site)/schluessel-nach-code/page.tsx`, Hinweis im Kopf (heute Alert, nach U2 Zeile mit GlyphInfo) · heute: Titel „Ihr Originalschlüssel bleibt bei Ihnen“, Absatz „Bei allen Artikeln in diesem Bereich ist keine Einsendung des Originalschlüssels nötig. Wir fertigen den Schlüssel allein anhand des Codes, den Sie bei der Bestellung angeben. Sie können Ihr Schloss also weiter benutzen, während der Nachschlüssel entsteht.“ und „Kein Code vorhanden? Dann geht es über Schlüssel nach Vorlage weiter.“ · Vorschlag: Titel und ersten Absatz streichen; nur „Kein Code vorhanden? Dann geht es über Schlüssel nach Vorlage weiter.“ als eine Zeile mit GlyphInfo und Link im Satz stehen lassen. Die Aussage steht schon im Lead („Ohne Einsendung des Originals“, content/seo.json `subline`) und in der Einleitung von Abschnitt 01 („Sie behalten Ihren Originalschlüssel“, `intro`); im Kopf steht sie heute dreimal (Quelle E5-L-29 H05 Befund 2).

### Codelinien (`/schluessel-nach-code/[slug]`)
- H06 · Hinweiskasten „Anfertigung nach Ihrer Codeangabe“ (page.tsx Z. 198–215) und Fußtext der Bestellkarte (bestell-formular.tsx Z. 371–381) · heute: Der Hinweis auf das eingeschränkte Widerrufsrecht steht zweimal in einer Bildschirmhöhe (desktop__02) · Vorschlag: Wortlaut unverändert nur einmal an der Kaufhandlung. Links bleibt der erste Absatz als Zeile mit GlyphWaage. Erst nach Freigabe (M-27). Eintrag im bestehenden Abschnitt „Codelinien (… aus E5-BEFUND-H06)“.
- content/code-lines.json · `description` (alle 52), letzter Satz · heute: „Bitte prüfen Sie den Code vor dem Absenden sorgfältig, da die Anfertigung nach Ihrer Angabe erfolgt.“ Nach der Zusammenlegung steht er unter „02 Angaben“ direkt über dem Kasten, der dasselbe sagt · Vorschlag: den Satz in der Beschreibung streichen, er bleibt im Kasten. `seo.description` ist nicht betroffen. Eintrag im selben Abschnitt.

### Schließanlagen (`/schliessanlagen`)
- src/app/(site)/schliessanlagen/page.tsx Z. 348, Titel von Abschnitt 01 · heute „Die fünf Systeme in einfacher Sprache“ · Vorschlag „Vier Systeme in einfacher Sprache“. Grund: Die Auswahl zeigt vier Systeme, und die Erweiterbare Anlage nennt sich selbst „kein eigenes Schließsystem“ (system-erklaerung.tsx Z. 190). Das ist eine eigene Beobachtung ohne Befund im Bericht.
- src/components/schliessanlagen/system-erklaerung.tsx Z. 328–330, Tabellenbeschriftung (nur für Screenreader) · heute „Die fünf Schließsysteme im Vergleich: wer welche Tür öffnet, typische Einsatzfälle und Erweiterbarkeit.“ · Vorschlag „Die vier Schließsysteme und die erweiterbare Anlage im Vergleich: wer welche Tür öffnet, typische Einsatzfälle und Erweiterbarkeit.“ Grund wie oben, ebenfalls eine eigene Beobachtung.
- src/app/(site)/schliessanlagen/page.tsx Z. 362–364, Einleitung zum Vergleich · heute „… Die Tabelle zeigt die Unterschiede nebeneinander. …“ · Vorschlag „… Die Übersicht zeigt die Unterschiede nebeneinander. …“ Grund: Mobil ist der Vergleich künftig eine Leiste aus Karten (Befund 5), keine Tabelle.

### Tür- und Schließtechnik (`/tuer-und-schliesstechnik`)
- page.tsx `RELATED_AREAS`, Bereich „Elektronische Zutrittslösungen“ (Z. 76) · heute: „Karte, Transponder, PIN oder App statt Schlüssel — auch in Verbindung mit vorhandener Mechanik. Die flexible Alternative zur klassischen Mechanik.“ · Vorschlag: „Karte, Transponder, PIN oder App statt Schlüssel — auch in Verbindung mit vorhandener Mechanik.“ (Floskel nach K-003, E5-L-29 H09 Befund 2; nur streichen)
- page.tsx Abschnitt 01, erster Absatz (Z. 176) · heute: „Die Sicherheit einer Tür wird stets durch ihr schwächstes Glied definiert. … das Türsystem entsprechend aufzubauen.“ · Vorschlag: Absatz streichen. Lead und „Mechanische Kernkomponenten im Verbund“ tragen die Aussage vom Zusammenspiel, und der Weg zur Liste wird kürzer (E5-L-29 H09 Befund 4, Kürzung; nur streichen, nichts Neues).
- page.tsx Einleitung 02 (Z. 243) · heute: „Unsere Kernkompetenzen in der Tür- und Schließtechnik. Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik.“ · Vorschlag: „Unsere Leistungen in der Tür- und Schließtechnik.“ (schon eingetragen, E4-L-23; durch E5-L-29 bestätigt)
- page.tsx Abschnitt 03, Absatz 1 (Z. 299) · heute: „… erfordern höchste fachliche Expertise und die strikte Einhaltung bauaufsichtlicher Zulassungen.“ · Vorschlag: „… erfordern die strikte Einhaltung bauaufsichtlicher Zulassungen.“ (schon eingetragen; durch E5-L-29 bestätigt)
- page.tsx Einleitung 04 (Z. 330) · heute: „Wir legen Wert auf transparente Aufklärung. Hier beantworten wir die komplexesten Fragen …“ · Vorschlag: Einleitung streichen (schon eingetragen; durch E5-L-29 bestätigt)

### Autoschlüssel-Assistent (`/autoschluessel/anfrage`)
- Terminschritt, Hinweis „Frühester Termin nach etwa n Tagen“ (src/components/autoschluessel/termin-auswahl.tsx) · heute: „Der Vorlauf entsteht durch die Prüfung Ihrer Unterlagen und die Beschaffung des passenden Rohlings beziehungsweise Schlüsselgehäuses. Deshalb bieten wir erst Termine ab diesem Zeitpunkt an. Jeder Termin ist mit {Dauer} eingeplant.“ · Vorschlag: „Vorher prüfen wir Ihre Unterlagen und beschaffen den passenden Rohling beziehungsweise das Gehäuse. Jeder Termin ist mit {Dauer} eingeplant.“ {Dauer} bleibt `formatDuration(slotMinutes)`. Grund: Als Zeile unter der Datumsleiste ist der Text kürzer, und der zweite Satz wiederholt nur den Titel.
- Anzahlungsschritt, Hinweis „Wofür die Anzahlung steht“ (src/app/(site)/autoschluessel/anfrage/assistent.tsx) · heute: „Mit der Anzahlung reservieren wir Ihnen ein festes Zeitfenster und beginnen mit der Beschaffung des passenden Rohlings beziehungsweise Gehäuses. Dadurch entsteht uns Aufwand, bevor Sie in der Werkstatt sind.“ · Vorschlag: „Mit der Anzahlung reservieren wir Ihr Zeitfenster und beschaffen vorab den passenden Rohling beziehungsweise das Gehäuse.“ Grund: Zeile mit Glyphe statt Kasten, und der dritte Satz begründet nur. Wegen des Zahlungsbezugs erst nach rechtlicher Prüfung.
- Preisschritt, Prüfungsvorbehalt bis zu dreimal (preis-anzeige.tsx: letzter Satz der Erklärung zum festen Preis bzw. zum Preisrahmen; Daten `quote.note`; assistent.tsx Block „Prüfung vor der Ausführung“) · heute zum Beispiel „Den genauen Preis nennen wir Ihnen nach Sichtung Ihrer Unterlagen — vor der Ausführung.“ und „Ergibt die Sichtung Ihrer Fotos einen anderen Fall, sprechen wir Sie vor der Ausführung an.“ neben „Prüfung vor der Ausführung: Bevor wir arbeiten, sehen wir uns Ihre Fotos … an.“ · Vorschlag: Den Vorbehalt nur im Block „Prüfung vor der Ausführung“ führen und die beiden Schlusssätze der Preiserklärungen in preis-anzeige.tsx streichen. Erst nach rechtlicher Prüfung der Preisangaben.

### Zylinder-Konfigurator (`/gleichschliessende-zylinder/konfigurator`)
- Konfigurator, Abschnitt 01 Weiterführend (`src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx` Z. 71) · heute „Wenn Sie vorher etwas nachlesen möchten“ · Vorschlag „Passende Seiten zu diesem Ablauf“ (Wortlaut aus H04, autoschluessel/anfrage/page.tsx Z. 118). Grund: eine Form für den weiterführenden Block aller Abläufe. Die Sichtabnahme nennt den abweichenden Wortlaut im Abgleich mit E4-L-23.

### Warenkorb (`/warenkorb`)
- src/app/(site)/warenkorb/page.tsx Z.42, Einleitung (lead) im PageHeader · heute: „Prüfen Sie Ihre Positionen, wählen Sie die Versandart und gehen Sie anschließend zur Kasse.“ (fordert im leeren Korb zu etwas auf, das es nicht gibt; Ausblenden scheitert an LCP und CLS, siehe L-07a) · Vorschlag, passt leer wie gefüllt: „Im Warenkorb ändern Sie Stückzahlen, wählen die Versandart und sehen den Gesamtbetrag, bevor Sie zur Kasse gehen.“ Auflage: nicht kürzer als heute. Sonst ist die Einleitung mobil kleiner als der Leersatz, und der wird nach der Hydrierung spätes LCP.
- src/app/(site)/warenkorb/warenkorb-ansicht.tsx Z.459–475 · heute: „Weiter einkaufen: Schlüssel nach Code oder Zylinder-Konfigurator.“ · Vorschlag: Satz streichen. Direkt darunter steht nach diesem Paket „01 Weiterlesen · Passend dazu“ mit denselben zwei Zielen als ersten Zeilen („Schlüssel nach Code bestellen“, „Gleichschließende Zylinder zusammenstellen“).

### Kasse (`/kasse`)
- src/app/(site)/kasse/page.tsx, Einleitung (künftig PageHeader `lead`) · heute: „Bitte geben Sie Ihre Kontakt- und Lieferdaten an. Danach sehen Sie die vollständige Bestellübersicht.“ · Vorschlag: „Bitte geben Sie Ihre Kontakt- und Lieferdaten an. Die Bestellübersicht übernimmt Ihre Angaben sofort.“ Grund: Die Übersicht steht schon neben dem Formular (desktop) bzw. darüber im Akkordeon (mobil) und zeigt die Eingaben sofort. „Danach“ trifft also nicht zu.

### Service und Termin (`/service-und-termin`)
- /service-und-termin Abschnitt 03, Absatz Vorgehen (page.tsx Z. 225) · „Wir lehnen standardisierte "Out-of-the-box"-Lösungen ab …“ (gerade Anführungszeichen) · „Wir lehnen standardisierte „Out-of-the-box“-Lösungen ab …“ oder ohne Anführungszeichen „Standardlösungen“.
- /service-und-termin Abschnitt 03 (Z. 242, 258) und FAQ (Z. 68, 76; die FAQ ist auch JSON-LD) · „z.B.“ · „z. B.“ mit schmalem geschütztem Leerzeichen (U+202F).
- /service-und-termin Abschnitt 03.2 Standards (Z. 258) · „Die nahtlose Verzahnung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer fortschrittlichsten Lösungen.“ · „Die Verbindung von Mechanik und Elektronik (Mechatronik) bildet oft den Kern unserer Lösungen.“ (K-003 nennt „nahtlos“).
- /service-und-termin Abschnitt 03, Absatz Vorgehen (Z. 225, fünf Sätze; Kürzung der Textwand laut Sichtabnahme; Alternative zur bestehenden Zeile „Absatz Vorgehen“) · ganzer Absatz „Die Konzeption und Implementierung moderner Schließ- und Sicherheitstechnik erfordert … bedarfsorientierten Schutzziels.“ · nur den letzten Satz, gekürzt: „Jeder Auftrag beginnt mit einer Analyse der bestehenden Infrastruktur, ihrer Schwachstellen und des Schutzziels.“
- /service-und-termin Abschnitt 03.1, Einleitungssatz (Z. 236) · „Unser Prozess ist in streng definierte Phasen unterteilt, die von der initialen Bestandsaufnahme bis zur finalen Abnahme und Dokumentation reichen.“ · „Jeder Auftrag durchläuft fünf Phasen, von der Bestandsaufnahme bis zur Dokumentation.“ (bemaßt, passt zur Kopfzeichnung).
- /service-und-termin Abschnitt 03.1, Titel (Z. 233) · „Die Phasen unserer Service-Implementierung“ · „Fünf Phasen eines Auftrags“.

### Artikel-Shop (`/artikel`)
- /artikel, Abschnitt 01, Einleitung (page.tsx Z. 147–149, Rückfall für page.intro; Grundlage: Komposition 3, mobil 00, Bericht Z. 131) · heute: „Öffnen Sie einen Artikel, um Eigenschaften, Lieferumfang und Staffelpreise zu sehen und die Stückzahl zu wählen.“ · Vorschlag: „Eigenschaften, Lieferumfang und Staffelpreise stehen auf der Seite jedes Artikels.“ Begründung: Die Kopfeinleitung sagt schon „Stückzahl wählen und direkt in den Warenkorb legen“; mobil fällt eine Zeile vor der Suche weg.
- /artikel, Beispielhinweis, Satz (page.tsx Z. 129–130; Grundlage: Komposition 3, mobil 00, Bericht Z. 131) · heute: „Artikel mit dem Hinweis „Beispiel“ zeigen, wie Artikel hier dargestellt werden. Preise und Angaben sind Beispielwerte; diese Artikel können nicht bestellt werden.“ · Vorschlag: „Preise und Angaben sind Beispielwerte; diese Artikel können nicht bestellt werden.“ Begründung: Der Titel bleibt, die Aussage zu M-25 ist gleich, mobil 2 statt 4 Zeilen Text unter dem Titel.
