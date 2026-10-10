# Architecture Matrix & Semantic Audit

| Route | Path | Word Count | H1 | H2s | Status |
|-------|------|------------|----|-----|--------|
| / | `src/app/(site)/page.tsx` | 73 | {page?.headline ?? 'Autoschlüssel nachmachen und programmieren'} | Missing H2 | Needs Expansion |
| /admin/[[...segments]] | `src/app/(payload)/admin/[[...segments]]/page.tsx` | 29 | Missing H1 | Missing H2 | Needs Expansion |
| /artikel | `src/app/(site)/artikel/page.tsx` | 58 | Missing H1 | Derzeit sind hier keine Artikel eingestellt. | Needs Expansion |
| /artikel/[slug] | `src/app/(site)/artikel/[slug]/page.tsx` | 97 | Missing H1 | Beschreibung, Eigenschaften, Lieferumfang, Versand | Needs Expansion |
| /autoschluessel | `src/app/(site)/autoschluessel/page.tsx` | 165 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/anfrage | `src/app/(site)/autoschluessel/anfrage/page.tsx` | 53 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/fahrzeugoeffnung | `src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx` | 11 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/funkschluessel | `src/app/(site)/autoschluessel/funkschluessel/page.tsx` | 10 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/kopieren | `src/app/(site)/autoschluessel/kopieren/page.tsx` | 45 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/marken | `src/app/(site)/autoschluessel/marken/page.tsx` | 145 | Missing H1 | Passend dazu | Needs Expansion |
| /autoschluessel/marken/[make] | `src/app/(site)/autoschluessel/marken/[make]/page.tsx` | 177 | Missing H1 | Passend dazu | Needs Expansion |
| /autoschluessel/marken/[make]/[model] | `src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx` | 206 | Missing H1 | Passend dazu | Needs Expansion |
| /autoschluessel/nachmachen | `src/app/(site)/autoschluessel/nachmachen/page.tsx` | 8 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/programmieren | `src/app/(site)/autoschluessel/programmieren/page.tsx` | 12 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/schluesselbart-fraesen | `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx` | 10 | Missing H1 | Missing H2 | Needs Expansion |
| /autoschluessel/smart-key | `src/app/(site)/autoschluessel/smart-key/page.tsx` | 12 | Missing H1 | Missing H2 | Needs Expansion |
| /bestellung/[id] | `src/app/(site)/bestellung/[id]/page.tsx` | 175 | Missing H1 | Bestellte Artikel, Ihre Vorgangsnummer, Zahlung, Ihre Angaben, Wie es weitergeht, Fragen zur Bestellung? | Needs Expansion |
| /elektronische-zutrittsloesungen | `src/app/(site)/elektronische-zutrittsloesungen/page.tsx` | 172 | Missing H1 | Missing H2 | Needs Expansion |
| /elektronische-zutrittsloesungen/konfigurator | `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx` | 50 | Missing H1 | Passende Seiten | Needs Expansion |
| /gleichschliessende-zylinder | `src/app/(site)/gleichschliessende-zylinder/page.tsx` | 335 | Missing H1 | Missing H2 | Needs Expansion |
| /gleichschliessende-zylinder/konfigurator | `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx` | 34 | Missing H1 | Wenn Sie vorher etwas nachlesen möchten | Needs Expansion |
| /kasse | `src/app/(site)/kasse/page.tsx` | 10 | Missing H1 | Rechtliche Hinweise | Needs Expansion |
| /ratgeber | `src/app/(site)/ratgeber/page.tsx` | 11 | Missing H1 | {group.area.label} | Needs Expansion |
| /ratgeber/[slug] | `src/app/(site)/ratgeber/[slug]/page.tsx` | 24 | Missing H1 | {block.heading} | Needs Expansion |
| /rechtliches/agb | `src/app/(site)/rechtliches/agb/page.tsx` | 3 | Allgemeine Geschäftsbedingungen | 1. Geltungsbereich und Vertragspartner, 2. Vertragsschluss, 3. Preise, Preisrahmen und Prüfvorbehalt, 4. Anzahlung und Zahlung, 5. Termine, Verschiebung und Absage, 6. Mitwirkungspflichten des Kunden, 7. Nachweis der Verfügungsberechtigung, 8. Lieferung und Versand, 9. Eigentumsvorbehalt, 10. Gewährleistung und Haftung, 11. Schließanlagen, Sicherungskarten und Erweiterungen, 12. Sicherheitstechnik und Verantwortung des Betreibers, 13. Datenschutz, 14. Streitbeilegung, 15. Schlussbestimmungen | Needs Expansion |
| /rechtliches/cookie-einstellungen | `src/app/(site)/rechtliches/cookie-einstellungen/page.tsx` | 4 | Cookie-Einstellungen | Was genau gespeichert wird, Sobald weitere Dienste hinzukommen | Needs Expansion |
| /rechtliches/datenschutz | `src/app/(site)/rechtliches/datenschutz/page.tsx` | 461 | Datenschutzerklärung | 1. Verantwortliche Stelle, 2. Datenschutzbeauftragte Person, 3. Welche Daten wir verarbeiten, 4. Empfänger und Auftragsverarbeiter, 5. Übermittlung in Drittländer, 6. Cookies und Reichweitenmessung, 7. Videoüberwachung, Aufzeichnung und Zutrittsprotokollierung, 8. Ihre Rechte, 9. Sicherheit der Übertragung, 10. Änderungen dieser Erklärung | Needs Expansion |
| /rechtliches/impressum | `src/app/(site)/rechtliches/impressum/page.tsx` | 129 | Impressum | Anbieter, Vertreten durch, Kontakt, Registereintrag, Umsatzsteuer-Identifikationsnummer, Berufsbezeichnung und berufsrechtliche Regelungen, Aufsichtsbehörde, Verantwortlich für den Inhalt, Streitbeilegung, Haftung für Inhalte und Links, Urheberrecht | Needs Expansion |
| /rechtliches/versand-und-zahlung | `src/app/(site)/rechtliches/versand-und-zahlung/page.tsx` | 152 | Zahlung und Versand | Versandarten, Lieferzeiten, Zahlungsarten, Anzahlung bei Terminaufträgen, Preise | Needs Expansion |
| /rechtliches/widerruf | `src/app/(site)/rechtliches/widerruf/page.tsx` | 3 | Widerruf und Rückgabe | 1. Widerrufsbelehrung für Verbraucherinnen und Verbraucher, 2. Muster-Widerrufsformular, 3. Sonderanfertigungen und kundenspezifische Produkte, 4. Anzahlungen auf Termine, 5. Rückgabe und Reklamation, 6. Eingesandte Originalschlüssel | Needs Expansion |
| /schliessanlagen | `src/app/(site)/schliessanlagen/page.tsx` | 157 | Missing H1 | Wenige Türen, ein Schlüssel für alles?, Passend dazu | Needs Expansion |
| /schliessanlagen/konfigurator | `src/app/(site)/schliessanlagen/konfigurator/page.tsx` | 15 | Missing H1 | Noch unsicher? | Needs Expansion |
| /schluessel-nach-code | `src/app/(site)/schluessel-nach-code/page.tsx` | 34 | Missing H1 | Missing H2 | Needs Expansion |
| /schluessel-nach-code/[slug] | `src/app/(site)/schluessel-nach-code/[slug]/page.tsx` | 133 | Missing H1 | Was Sie erhalten, Technische Angaben, Wo steht der Code? | Needs Expansion |
| /schluessel-nach-vorlage | `src/app/(site)/schluessel-nach-vorlage/page.tsx` | 253 | Missing H1 | Missing H2 | Needs Expansion |
| /schluessel-nach-vorlage/anfrage | `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx` | 10 | Missing H1 | Missing H2 | Needs Expansion |
| /service-und-termin | `src/app/(site)/service-und-termin/page.tsx` | 499 | Missing H1 | Missing H2 | Needs Expansion |
| /service-und-termin/anfrage | `src/app/(site)/service-und-termin/anfrage/page.tsx` | 7 | Missing H1 | Missing H2 | Needs Expansion |
| /service-und-termin/kontakt | `src/app/(site)/service-und-termin/kontakt/page.tsx` | 66 | Missing H1 | Missing H2 | Needs Expansion |
| /service-und-termin/terminstatus | `src/app/(site)/service-und-termin/terminstatus/page.tsx` | 5 | Missing H1 | Missing H2 | Needs Expansion |
| /service-und-termin/vor-ort | `src/app/(site)/service-und-termin/vor-ort/page.tsx` | 76 | Missing H1 | Missing H2 | Needs Expansion |
| /sicherheitstechnik | `src/app/(site)/sicherheitstechnik/page.tsx` | 183 | Missing H1 | Missing H2 | Needs Expansion |
| /sicherheitstechnik/[slug] | `src/app/(site)/sicherheitstechnik/[slug]/page.tsx` | 51 | Missing H1 | Missing H2 | Needs Expansion |
| /sicherheitstechnik/sicherheitscheck | `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx` | 31 | Missing H1 | Missing H2 | Needs Expansion |
| /standorte | `src/app/(site)/standorte/page.tsx` | 36 | Missing H1 | Missing H2 | Needs Expansion |
| /standorte/[city] | `src/app/(site)/standorte/[city]/page.tsx` | 24 | Missing H1 | Missing H2 | Needs Expansion |
| /tuer-und-schliesstechnik | `src/app/(site)/tuer-und-schliesstechnik/page.tsx` | 265 | Missing H1 | Regulatorik: Fluchtwege und Brandschutz | Needs Expansion |
| /tuer-und-schliesstechnik/[slug] | `src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx` | 38 | Missing H1 | Missing H2 | Needs Expansion |
| /warenkorb | `src/app/(site)/warenkorb/page.tsx` | 9 | Missing H1 | Passend dazu | Needs Expansion |
