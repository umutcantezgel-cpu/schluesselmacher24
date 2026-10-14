# Architecture Matrix

| Route | Source File | Ist-Zustand (Wortanzahl) | Soll-Zustand (Wortanzahl) | CWV-Status | Schema-Status | Interactive Module | Status |
|---|---|---|---|---|---|---|---|
| / (Layout) | app/(payload)/layout.tsx | 79 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_0 | PENDING_BUILDER |
| /api/[...slug] (API) | app/(payload)/api/[...slug]/route.ts | 69 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_1 | PENDING_BUILDER |
| /admin/[[...segments]] | app/(payload)/admin/[[...segments]]/page.tsx | 70 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| / | app/(site)/page.tsx | 459 | 959 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| / (Layout) | app/(site)/layout.tsx | 182 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_4 | PENDING_BUILDER |
| /ratgeber | app/(site)/ratgeber/page.tsx | 120 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /ratgeber/[slug] | app/(site)/ratgeber/[slug]/page.tsx | 215 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /schluessel-nach-vorlage | app/(site)/schluessel-nach-vorlage/page.tsx | 1127 | 1627 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /schluessel-nach-vorlage (Layout) | app/(site)/schluessel-nach-vorlage/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_8 | PENDING_BUILDER |
| /schluessel-nach-vorlage/anfrage | app/(site)/schluessel-nach-vorlage/anfrage/page.tsx | 116 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /warenkorb | app/(site)/warenkorb/page.tsx | 167 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /kasse | app/(site)/kasse/page.tsx | 141 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /api/kunden-upload (API) | app/(site)/api/kunden-upload/route.ts | 685 | 1185 | NEEDS_REVIEW | INCOMPLETE | SystemModule_12 | PENDING_BUILDER |
| /schluessel-nach-code | app/(site)/schluessel-nach-code/page.tsx | 291 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /schluessel-nach-code (Layout) | app/(site)/schluessel-nach-code/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_14 | PENDING_BUILDER |
| /schluessel-nach-code/[slug] | app/(site)/schluessel-nach-code/[slug]/page.tsx | 456 | 956 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /sicherheitstechnik | app/(site)/sicherheitstechnik/page.tsx | 515 | 1015 | NEEDS_REVIEW | INCOMPLETE | SecuritySystemCalculator | PENDING_BUILDER |
| /sicherheitstechnik (Layout) | app/(site)/sicherheitstechnik/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SecuritySystemCalculator | PENDING_BUILDER |
| /sicherheitstechnik/[slug] | app/(site)/sicherheitstechnik/[slug]/page.tsx | 375 | 875 | NEEDS_REVIEW | INCOMPLETE | SecuritySystemCalculator | PENDING_BUILDER |
| /sicherheitstechnik/sicherheitscheck | app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx | 174 | 850 | NEEDS_REVIEW | INCOMPLETE | SecuritySystemCalculator | PENDING_BUILDER |
| /tuer-und-schliesstechnik | app/(site)/tuer-und-schliesstechnik/page.tsx | 1184 | 1684 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /tuer-und-schliesstechnik (Layout) | app/(site)/tuer-und-schliesstechnik/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_21 | PENDING_BUILDER |
| /tuer-und-schliesstechnik/[slug] | app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx | 261 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /bestellung/[id] | app/(site)/bestellung/[id]/page.tsx | 865 | 1365 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /gleichschliessende-zylinder | app/(site)/gleichschliessende-zylinder/page.tsx | 1153 | 1653 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /gleichschliessende-zylinder (Layout) | app/(site)/gleichschliessende-zylinder/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_25 | PENDING_BUILDER |
| /gleichschliessende-zylinder/konfigurator | app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx | 180 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /elektronische-zutrittsloesungen | app/(site)/elektronische-zutrittsloesungen/page.tsx | 1705 | 2205 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /elektronische-zutrittsloesungen (Layout) | app/(site)/elektronische-zutrittsloesungen/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_28 | PENDING_BUILDER |
| /elektronische-zutrittsloesungen/konfigurator | app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx | 221 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /schliessanlagen | app/(site)/schliessanlagen/page.tsx | 1292 | 1792 | NEEDS_REVIEW | INCOMPLETE | SecuritySystemCalculator | PENDING_BUILDER |
| /schliessanlagen (Layout) | app/(site)/schliessanlagen/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SecuritySystemCalculator | PENDING_BUILDER |
| /schliessanlagen/konfigurator | app/(site)/schliessanlagen/konfigurator/page.tsx | 246 | 850 | NEEDS_REVIEW | INCOMPLETE | SecuritySystemCalculator | PENDING_BUILDER |
| /service-und-termin | app/(site)/service-und-termin/page.tsx | 1201 | 1701 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /service-und-termin (Layout) | app/(site)/service-und-termin/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_34 | PENDING_BUILDER |
| /service-und-termin/terminstatus | app/(site)/service-und-termin/terminstatus/page.tsx | 53 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /service-und-termin/anfrage | app/(site)/service-und-termin/anfrage/page.tsx | 82 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /service-und-termin/vor-ort | app/(site)/service-und-termin/vor-ort/page.tsx | 425 | 925 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /service-und-termin/kontakt | app/(site)/service-und-termin/kontakt/page.tsx | 214 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /rechtliches (Layout) | app/(site)/rechtliches/layout.tsx | 80 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_39 | PENDING_BUILDER |
| /rechtliches/impressum | app/(site)/rechtliches/impressum/page.tsx | 216 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /rechtliches/cookie-einstellungen | app/(site)/rechtliches/cookie-einstellungen/page.tsx | 191 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /rechtliches/versand-und-zahlung | app/(site)/rechtliches/versand-und-zahlung/page.tsx | 331 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /rechtliches/widerruf | app/(site)/rechtliches/widerruf/page.tsx | 330 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /rechtliches/agb | app/(site)/rechtliches/agb/page.tsx | 371 | 871 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /rechtliches/datenschutz | app/(site)/rechtliches/datenschutz/page.tsx | 661 | 1161 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /artikel | app/(site)/artikel/page.tsx | 413 | 913 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /artikel/[slug] | app/(site)/artikel/[slug]/page.tsx | 553 | 1053 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /standorte | app/(site)/standorte/page.tsx | 114 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /standorte/[city] | app/(site)/standorte/[city]/page.tsx | 209 | 850 | NEEDS_REVIEW | INCOMPLETE | EnterpriseRoiCalculator | PENDING_BUILDER |
| /autoschluessel | app/(site)/autoschluessel/page.tsx | 1308 | 1808 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel (Layout) | app/(site)/autoschluessel/layout.tsx | 27 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/marken | app/(site)/autoschluessel/marken/page.tsx | 414 | 914 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/marken/[make] | app/(site)/autoschluessel/marken/[make]/page.tsx | 523 | 1023 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/marken/[make]/[model] | app/(site)/autoschluessel/marken/[make]/[model]/page.tsx | 739 | 1239 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/funkschluessel | app/(site)/autoschluessel/funkschluessel/page.tsx | 165 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/programmieren | app/(site)/autoschluessel/programmieren/page.tsx | 204 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/anfrage | app/(site)/autoschluessel/anfrage/page.tsx | 336 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/kopieren | app/(site)/autoschluessel/kopieren/page.tsx | 198 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/nachmachen | app/(site)/autoschluessel/nachmachen/page.tsx | 102 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/smart-key | app/(site)/autoschluessel/smart-key/page.tsx | 235 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/schluesselbart-fraesen | app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx | 183 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /autoschluessel/fahrzeugoeffnung | app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx | 179 | 850 | NEEDS_REVIEW | INCOMPLETE | CarKeyFilter | PENDING_BUILDER |
| /llms.txt (API) | app/llms.txt/route.ts | 139 | 850 | NEEDS_REVIEW | INCOMPLETE | SystemModule_63 | PENDING_BUILDER |
