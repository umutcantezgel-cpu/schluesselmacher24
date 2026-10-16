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
