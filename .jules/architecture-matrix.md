# Architecture Matrix

| URL Path | Source File | Current Word Count | Target Word Count | Target Module | Schema Entities |
|---|---|---|---|---|---|
| /admin/[[...segments]] | src/app/(payload)/admin/[[...segments]]/page.tsx | 99 | 850 | AdminConfigurator | Organization, WebSite, FAQPage |
| /api/[...slug] | src/app/(payload)/api/[...slug]/route.ts | 70 | N/A | N/A | N/A |
| / | src/app/(payload)/layout.tsx | 98 | N/A | N/A | N/A |
| /api/kunden-upload | src/app/(site)/api/kunden-upload/route.ts | 704 | N/A | N/A | N/A |
| /artikel/[slug] | src/app/(site)/artikel/[slug]/page.tsx | 934 | 1434 | ArtikelFilterSystem | Organization, WebSite, FAQPage, Article |
| /artikel | src/app/(site)/artikel/page.tsx | 656 | 1156 | ArtikelFilterSystem | Organization, WebSite, FAQPage, Article |
| /autoschluessel/anfrage | src/app/(site)/autoschluessel/anfrage/page.tsx | 518 | 1018 | AnfrageConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/fahrzeugoeffnung | src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx | 1121 | 1621 | FahrzeugoeffnungConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/funkschluessel | src/app/(site)/autoschluessel/funkschluessel/page.tsx | 1091 | 1591 | FunkschluesselConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/kopieren | src/app/(site)/autoschluessel/kopieren/page.tsx | 1133 | 1633 | KopierenConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel | src/app/(site)/autoschluessel/layout.tsx | 36 | N/A | N/A | N/A |
| /autoschluessel/marken/[make]/[model] | src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx | 1223 | 1723 | [make]Configurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/marken/[make] | src/app/(site)/autoschluessel/marken/[make]/page.tsx | 979 | 1479 | MarkenConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/marken | src/app/(site)/autoschluessel/marken/page.tsx | 718 | 1218 | MarkenConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/nachmachen | src/app/(site)/autoschluessel/nachmachen/page.tsx | 1189 | 1689 | NachmachenConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel | src/app/(site)/autoschluessel/page.tsx | 2002 | 2502 | VehicleKeyMatcher | Organization, WebSite, FAQPage, Service |
| /autoschluessel/programmieren | src/app/(site)/autoschluessel/programmieren/page.tsx | 1222 | 1722 | ProgrammierenConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/schluesselbart-fraesen | src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx | 1042 | 1542 | SchluesselbartFraesenConfigurator | Organization, WebSite, FAQPage, Service |
| /autoschluessel/smart-key | src/app/(site)/autoschluessel/smart-key/page.tsx | 1207 | 1707 | SmartKeyConfigurator | Organization, WebSite, FAQPage, Service |
| /bestellung/[id] | src/app/(site)/bestellung/[id]/page.tsx | 1299 | 1799 | BestellungConfigurator | Organization, WebSite, FAQPage |
| /elektronische-zutrittsloesungen/konfigurator | src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx | 382 | 882 | KonfiguratorConfigurator | Organization, WebSite, FAQPage |
| /elektronische-zutrittsloesungen | src/app/(site)/elektronische-zutrittsloesungen/layout.tsx | 36 | N/A | N/A | N/A |
| /elektronische-zutrittsloesungen | src/app/(site)/elektronische-zutrittsloesungen/page.tsx | 2480 | 2980 | ElektronischeZutrittsloesungenConfigurator | Organization, WebSite, FAQPage |
| /gleichschliessende-zylinder/konfigurator | src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx | 310 | 850 | KonfiguratorConfigurator | Organization, WebSite, FAQPage |
| /gleichschliessende-zylinder | src/app/(site)/gleichschliessende-zylinder/layout.tsx | 36 | N/A | N/A | N/A |
| /gleichschliessende-zylinder | src/app/(site)/gleichschliessende-zylinder/page.tsx | 2081 | 2581 | GleichschliessendeZylinderConfigurator | Organization, WebSite, FAQPage |
| /kasse | src/app/(site)/kasse/page.tsx | 242 | 850 | KasseConfigurator | Organization, WebSite, FAQPage |
| / | src/app/(site)/layout.tsx | 258 | N/A | N/A | N/A |
| / | src/app/(site)/page.tsx | 1130 | 1630 | EnterpriseRoiCalculator | Organization, WebSite, FAQPage |
| /ratgeber/[slug] | src/app/(site)/ratgeber/[slug]/page.tsx | 359 | 859 | RatgeberFilterSystem | Organization, WebSite, FAQPage, Article |
| /ratgeber | src/app/(site)/ratgeber/page.tsx | 224 | 850 | RatgeberFilterSystem | Organization, WebSite, FAQPage, Article |
| /rechtliches/agb | src/app/(site)/rechtliches/agb/page.tsx | 416 | 916 | AgbConfigurator | Organization, WebSite, FAQPage |
| /rechtliches/cookie-einstellungen | src/app/(site)/rechtliches/cookie-einstellungen/page.tsx | 228 | 850 | CookieEinstellungenConfigurator | Organization, WebSite, FAQPage |
| /rechtliches/datenschutz | src/app/(site)/rechtliches/datenschutz/page.tsx | 715 | 1215 | DatenschutzConfigurator | Organization, WebSite, FAQPage |
| /rechtliches/impressum | src/app/(site)/rechtliches/impressum/page.tsx | 248 | 850 | ImpressumConfigurator | Organization, WebSite, FAQPage |
| /rechtliches | src/app/(site)/rechtliches/layout.tsx | 149 | N/A | N/A | N/A |
| /rechtliches/versand-und-zahlung | src/app/(site)/rechtliches/versand-und-zahlung/page.tsx | 427 | 927 | VersandUndZahlungConfigurator | Organization, WebSite, FAQPage |
| /rechtliches/widerruf | src/app/(site)/rechtliches/widerruf/page.tsx | 370 | 870 | WiderrufConfigurator | Organization, WebSite, FAQPage |
| /schliessanlagen/konfigurator | src/app/(site)/schliessanlagen/konfigurator/page.tsx | 368 | 868 | KonfiguratorConfigurator | Organization, WebSite, FAQPage |
| /schliessanlagen | src/app/(site)/schliessanlagen/layout.tsx | 36 | N/A | N/A | N/A |
| /schliessanlagen | src/app/(site)/schliessanlagen/page.tsx | 1873 | 2373 | SchliessanlagenConfigurator | Organization, WebSite, FAQPage |
| /schluessel-nach-code/[slug] | src/app/(site)/schluessel-nach-code/[slug]/page.tsx | 734 | 1234 | SchluesselNachCodeConfigurator | Organization, WebSite, FAQPage |
| /schluessel-nach-code | src/app/(site)/schluessel-nach-code/layout.tsx | 36 | N/A | N/A | N/A |
| /schluessel-nach-code | src/app/(site)/schluessel-nach-code/page.tsx | 497 | 997 | SchluesselNachCodeConfigurator | Organization, WebSite, FAQPage |
| /schluessel-nach-vorlage/anfrage | src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx | 221 | 850 | AnfrageConfigurator | Organization, WebSite, FAQPage |
| /schluessel-nach-vorlage | src/app/(site)/schluessel-nach-vorlage/layout.tsx | 36 | N/A | N/A | N/A |
| /schluessel-nach-vorlage | src/app/(site)/schluessel-nach-vorlage/page.tsx | 1793 | 2293 | SchluesselNachVorlageConfigurator | Organization, WebSite, FAQPage |
| /service-und-termin/anfrage | src/app/(site)/service-und-termin/anfrage/page.tsx | 151 | 850 | AnfrageConfigurator | Organization, WebSite, FAQPage |
| /service-und-termin/kontakt | src/app/(site)/service-und-termin/kontakt/page.tsx | 474 | 974 | KontaktConfigurator | Organization, WebSite, FAQPage |
| /service-und-termin | src/app/(site)/service-und-termin/layout.tsx | 36 | N/A | N/A | N/A |
| /service-und-termin | src/app/(site)/service-und-termin/page.tsx | 1578 | 2078 | ServiceUndTerminConfigurator | Organization, WebSite, FAQPage |
| /service-und-termin/terminstatus | src/app/(site)/service-und-termin/terminstatus/page.tsx | 107 | 850 | TerminstatusConfigurator | Organization, WebSite, FAQPage |
| /service-und-termin/vor-ort | src/app/(site)/service-und-termin/vor-ort/page.tsx | 655 | 1155 | VorOrtConfigurator | Organization, WebSite, FAQPage |
| /sicherheitstechnik/[slug] | src/app/(site)/sicherheitstechnik/[slug]/page.tsx | 644 | 1144 | SicherheitstechnikConfigurator | Organization, WebSite, FAQPage, Service |
| /sicherheitstechnik | src/app/(site)/sicherheitstechnik/layout.tsx | 36 | N/A | N/A | N/A |
| /sicherheitstechnik | src/app/(site)/sicherheitstechnik/page.tsx | 1020 | 1520 | SicherheitstechnikConfigurator | Organization, WebSite, FAQPage, Service |
| /sicherheitstechnik/sicherheitscheck | src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx | 329 | 850 | SicherheitscheckConfigurator | Organization, WebSite, FAQPage, Service |
| /standorte/[city] | src/app/(site)/standorte/[city]/page.tsx | 405 | 905 | StandorteConfigurator | Organization, WebSite, FAQPage |
| /standorte | src/app/(site)/standorte/page.tsx | 249 | 850 | StandorteConfigurator | Organization, WebSite, FAQPage |
| /tuer-und-schliesstechnik/[slug] | src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx | 493 | 993 | TuerUndSchliesstechnikConfigurator | Organization, WebSite, FAQPage |
| /tuer-und-schliesstechnik | src/app/(site)/tuer-und-schliesstechnik/layout.tsx | 36 | N/A | N/A | N/A |
| /tuer-und-schliesstechnik | src/app/(site)/tuer-und-schliesstechnik/page.tsx | 1784 | 2284 | TuerUndSchliesstechnikConfigurator | Organization, WebSite, FAQPage |
| /warenkorb | src/app/(site)/warenkorb/page.tsx | 261 | 850 | WarenkorbConfigurator | Organization, WebSite, FAQPage |
| /llms.txt | src/app/llms.txt/route.ts | 145 | N/A | N/A | N/A |
