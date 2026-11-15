# FA-RECHERCHE-04: Zahlung über die Plattform und Auszahlung an Partner (Marktplatzlösung)

Zielmarkt: Deutschland. Stand der Quellen: abgerufen 2026-11-15.
Belegstufen: A = Zählung oder Messung eines genannten Anbieters; B = Angabe eines genannten Anbieters oder einer Lizenz (inkl. Fundstelle aus Sekundärquelle, ausdrücklich gekennzeichnet); C = eigene Ableitung.
Keine Rechtsberatung. Alle Aussagen zu ZAG, Steuer und Haftung sind Prüfhinweise für Anwalt und Steuerberater.

## 1. Bestand (Code-Lesung, eigene Ableitung C)

- `src/lib/integrations/stripe.ts`: Die Checkout-Sitzung wird im Modus `payment` angelegt. Die Parameter enthalten weder `transfer_data`, `on_behalf_of` noch `application_fee_amount`. Der Betrag geht damit auf das Konto der Plattform. Eine Auszahlung an Partner ist im Bestand nicht angelegt. [Quelle: lokale Datei src/lib/integrations/stripe.ts · Zeilen 150 bis 188 · Stufe C]
- `src/lib/partner/abrechnung.ts`: Modell A (Partner rechnet mit Kunde ab, Plattform stellt Provision in Rechnung) ist aktiv. Modell B (Kunde zahlt an Plattform, Partner erhält Auftragswert minus Provision) ist im Code gebaut, aber über `modellBFreigegeben` ausgeschaltet. [Quelle: lokale Datei src/lib/partner/abrechnung.ts · Zeilen 32 bis 52 · Stufe C]

## 2. Stripe Connect: Zahlungsflüsse

- Separate Charges and Transfers: Die Zahlung liegt auf dem Plattformkonto. Die Transfers an verbundene Konten sind davon entkoppelt und werden vom Plattformsaldo abgebucht. Stripe nennt diesen Typ für Fälle, in denen mehrere Parteien eine Zahlung teilen oder der Empfänger zum Zahlungszeitpunkt nicht feststeht. [Quelle: https://docs.stripe.com/connect/separate-charges-and-transfers.md?platform=web&integration=custom&ui=elements&api-integration=paymentintents · abgerufen 2026-11-15 · B]
- Bei diesem Typ wird das Plattformkonto um Stripe-Gebühren, Erstattungen und Chargebacks belastet. [Quelle: wie oben · abgerufen 2026-11-15 · B]
- Stripe nennt eine Private-Preview-Funktion „Funds segregation“, die Zahlungsmittel vor dem Transfer in einem geschützten Haltezustand führt. Zugang nur über den Account Manager. [Quelle: wie oben, Verweis auf https://docs.stripe.com/connect/funds-segregation.md · abgerufen 2026-11-15 · B]
- Destination Charges: Die Plattform nimmt die Zahlung entgegen und leitet die Mittel an das verbundene Konto weiter. Die Plattform behält ihre Gebühren. [Quelle: https://edge-docs.stripe.com/revenue-recognition/connect/destination-charges · abgerufen 2026-11-15 · B (Suchausschnitt)]
- Grenzüberschreitende Transfers können nach Stripes Angaben an Ländergrenzen scheitern. [Quelle: https://stripe.com/docs/connect/special-case-transfers · abgerufen 2026-11-15 · B (Suchausschnitt)]
- Rückerstattungen bei Destination Charges laufen laut Drittanbieter-Guides automatisch über den Transfer. Diese Aussage widerspricht sich zwischen Quellen und ist nicht durch Stripes Originaltext belegt. Siehe OFFENE FRAGEN.

## 3. Rechtlicher Rahmen (Verwahrung und Zahlungsdienst)

- Eine Plattform, die Kundengeld auf eigenem Konto annimmt und abzüglich eigener Provision an Verkäufer weiterleitet, fällt nach Sekundärliteratur in der Regel unter eine Erlaubnispflicht nach dem ZAG. [Quelle: https://www.deutsche-startups.de/2015/04/23/ueber-die-erforderlichkeit-einer-bafin-lizenz-fuer-marktplaetze/?amp=1 · abgerufen 2026-11-15 · B (Beitrag aus 2015, Stand überholt)]
- Genannte Wege: eigene Erlaubnis, reine Vermittlung bei Zahlung direkt an den Partner, oder Einschaltung eines zugelassenen Dienstleisters, der Gelder annimmt und weiterleitet. [Quelle: https://www.deutsche-startups.de/2015/04/23/ueber-die-erforderlichkeit-einer-bafin-lizenz-fuer-marktplaetze/?amp=1 · abgerufen 2026-11-15 · B]
- Handelsvertreterausnahme: § 2 Abs. 1 Nr. 2 ZAG, beruhend auf Art. 3 lit. b PSD2. Voraussetzung nach einer BaFin-Präsentation von 2017: Der Vermittler handelt nur für eine Partei und hat Verhandlungs- oder Abschlussvollmacht. Die Ausnahme greift nach Kanzleiangabe nicht bei bloßer Vertretung durch einen vom Auftraggeber benannten Vertreter. [Quelle: https://www.mayerbrown.com/Files/News/d41e985b-8338-42df-9944-36a826370200/Presentation/NewsAttachment/bee1eff4-d434-4a3b-9fba-39e65c9f2118/BB51Hilgard.pdf · abgerufen 2026-11-15 · B (Präsentation von 2017, zitiert durch Dritte)]
- Dieselbe Ausnahme erfasst nach Kanzleiangabe auch Zentralregulierer. [Quelle: https://cms.law/en/deu/legal-updates/germany-the-impact-of-payment-services-directive-2-on-the-commercial-agent-exception · abgerufen 2026-11-15 · B]
- Ein NWB-Dokument verweist auf eine Änderung von § 2 ZAG durch BGBl 2025 I Nr. 69. Ob Nr. 2 betroffen ist, ist nicht geprüft. Siehe OFFENE FRAGEN. [Quelle: https://datenbank.nwb.de/Dokument/369178_2/ · abgerufen 2026-11-15 · B (Suchausschnitt)]
- Fundstelle für den Wortlaut von § 2 ZAG: https://www.gesetze-im-internet.de/zag_2018/__2.html. Der Wortlaut wurde nicht abgerufen. [Quelle: Websuche · abgerufen 2026-11-15 · B (nur Fundstelle)]
- Zulassungspflichtige Zahlungsdienste nach BaFin: Fundstelle https://bafin.de/EN/Aufsicht/ZahlungsdienstePSD2/ZulassungspflichtigeZahlungsdienste/ZulassungspflichtigeZahlungsdienste_node_en.html. Inhalt nicht abgerufen. [Quelle: Websuche · abgerufen 2026-11-15 · B (nur Fundstelle)]
- Die BaFin hat ihr ZAG-Merkblatt nach Sekundärangabe am 14.02.2023 aktualisiert. Der Abschnitt zum Finanztransfergeschäft ist nach dieser Angabe relevant. [Quelle: https://www.it-finanzmagazin.de/?p=150948 · abgerufen 2026-11-15 · B (Sekundärquelle)]

## 4. Alternativen (je zwei Sätze)

- Mollie Connect: Split-Zahlungen sind standardmäßig aus und müssen über Antrag oder den Partner-Manager freigeschaltet werden. Beim Delayed Routing hält Mollie die Gelder, bis die Plattform per `POST /v2/payments/{id}/routes` aufteilt, was Bruttoabrechnung voraussetzt. [Quelle: https://docs.mollie.com/docs/connect-marketplaces-split-payments-with-delayed-routing · abgerufen 2026-11-15 · B] Die Plattform bleibt Zahlungsinhaberin und haftet gegenüber Mollie; Rechnungsstellung zwischen Plattform und Partner liegt nicht bei Mollie. [Quelle: https://docs.mollie.com/docs/connect-marketplaces-processing-payments · abgerufen 2026-11-15 · B]
- PayPal Commerce Platform: Vor der Integration ist ein Partner-Onboarding mit Prüfung durch PayPal nötig, der Zugang läuft über den Vertriebskontakt. Auszahlungen an Partner müssen je Partnerkonto freigeschaltet werden, und Partnergebühren gehen auf ein Bankkonto ohne PayPal-Saldo. [Quelle: https://developer.paypal.com/limited-release/commerce-platform/v2/partner-onboarding/ · abgerufen 2026-11-15 · B] Die Seiten sind als Limited Release markiert. [Quelle: https://developer.paypal.com/limited-release/platform-payouts/onboarding · abgerufen 2026-11-15 · B]
- Adyen for Platforms: Splits werden pro Transaktion über ein `splits`-Array bei Autorisierung, Capture oder Refund gesetzt oder über Split-Profile automatisiert. Ohne Split-Angaben landen Zahlung und Gebühren beim haftenden Plattformkonto. [Quelle: https://docs.adyen.com/platforms/online-payments/split-payments · abgerufen 2026-11-15 · B] Die Seiten enthalten klassische und neue Integrationen nebeneinander, daher ist die Version vor Umsetzung zu prüfen. [Quelle: https://docs.adyen.com/classic-platforms/processing-payments · abgerufen 2026-11-15 · B]

## 5. Steuerliche Grundfragen (Fragenliste für den Steuerberater)

Keine der folgenden Fragen ist beantwortet. Die Recherche hat dazu keine belastbare Quelle gefunden.

1. Wer ist Vertragspartner des Kunden: Plattform, Partner oder beide? Davon hängt ab, wer die Leistung schuldet.
2. Wer stellt die Rechnung über die Auftragsleistung aus: Partner im eigenen Namen, Plattform im Namen des Partners, oder Plattform im eigenen Namen?
3. Ist die Plattformprovision eine umsatzsteuerpflichtige Vermittlungsleistung, und welcher Steuersatz gilt?
4. Wie wird die Auszahlung an den Partner umsatzsteuerlich behandelt, wenn die Plattform den Gesamtbetrag vereinnahmt?
5. Wie sind Storno und Rückerstattung vor und nach Auftragsfreigabe umsatzsteuerlich zu korrigieren?
6. Welche Buchungsbelege sind für Modell A und Modell B nötig?

## 6. Empfehlung (zur Prüfung, keine Rechtsberatung)

Technisch passt zum Bestand am ehesten Stripe Connect mit Separate Charges and Transfers: Der Kunde zahlt auf das Plattformkonto, der Partner-Transfer erfolgt erst nach bestätigter Ausführung, und Gebühren, Rückerstattungen und Chargebacks laufen über das Plattformkonto. [Quelle: https://docs.stripe.com/connect/separate-charges-and-transfers.md?platform=web&integration=custom&ui=elements&api-integration=paymentintents · abgerufen 2026-11-15 · B] Ob die Plattform dafür selbst eine Erlaubnis nach ZAG braucht, ist offen. Vor Umsetzung ist die Zahlungsstruktur mit Anwalt und BaFin-Merkblatt zu klären. Als Alternative mit eigener Lizenz bietet sich ein zugelassener Zahlungsdienstleister an, der Gelder annimmt und weiterleitet (siehe Abschnitt 3).

Schritte für Menschen:
1. Anwalt beauftragen: ZAG-Erlaubnispflicht für das gewählte Modell und Handelsvertreterausnahme prüfen (Nr. 2) und den aktuellen Wortlaut von § 2 ZAG einholen.
2. Steuerberater beauftragen: Fragenliste aus Abschnitt 5 abarbeiten.
3. Stripe-Konto: Prüfen, ob Stripe Connect für die Firma aktiviert werden kann und welcher Kontotyp passt. Antrag und Freigabe durch den Inhaber.
4. Partnerkonten: Onboarding-Ablauf und Prüfpflichten bei Stripe festlegen, bevor Partner Geld erhalten.
5. Provisionssätze: Vom Inhaber festlegen lassen (G9). Nicht aus der Recherche ableiten.
6. Vor Livegang: Testdaten im Stripe-Testmodus, keine echten Zahlungen (G5).

## OFFENE FRAGEN

- Stripe-Konto-Typen (Standard, Express, Custom) und die Pflichten zur Identitäts- und Bankprüfung der Partner (KYC): keine Quelle abgerufen. Nicht belegt.
- Verfügbarkeit von Stripe Connect für ein deutsches Plattformkonto und Länderbeschränkungen: nicht geprüft.
- Rückerstattung bei Destination Charges: Drittanbieter-Guides nennen automatische Rückbuchung des Transfers, Stripe-Originaltext nicht geprüft. Widersprüchlich.
- Wortlaut § 2 ZAG nach BGBl 2025 I Nr. 69: nicht abgerufen. Ob Nr. 2 geändert wurde, ist offen.
- BaFin-Merkblatt zum ZAG in aktueller Fassung: nicht abgerufen. Die Aussagen oben stammen aus Sekundärquellen.
- Die Präsentation von 2017 und der Beitrag von 2015 sind veraltet und dienen nur als Hinweis.
- PayPal- und Mollie-Seiten: Teile der Aussagen stammen aus Suchausschnitten, nicht aus vollständig abgerufenen Seiten.
- Die hochgeladene Arbeitsanweisungs-PDF (Umut, Finale) wurde in dieser Erhebung nicht geöffnet.
- Vertragsgestaltung und Haftung zwischen Plattform und Partner: rechtlich offen, nicht Gegenstand dieser Recherche.
