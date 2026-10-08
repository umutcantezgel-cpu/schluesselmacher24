# Architecture Matrix & Audit Report

## DNA Summary
- **Framework**: Next.js 16+
- **React Version**: 19.2+
- **Styling**: Tailwind CSS v4 (OKLCH)
- **Primary Color**: oklch(0.52 0.24 260)
- **Typography**: Swiss Modernist
- **Total Audited Routes**: 49

## Route Transformations

| URL Path | Source File | Current Words | Target Words | Planned Interactive Module |
|---|---|---|---|---|
| `/admin/[[...segments]]` | `src/app/(payload)/admin/[[...segments]]/page.tsx` | 79 | 950 | **AdminDashboardMetricsWidget** |
| `/artikel/[slug]` | `src/app/(site)/artikel/[slug]/page.tsx` | 435 | 1035 | **ArticleReadingProgressBento** |
| `/artikel` | `src/app/(site)/artikel/page.tsx` | 313 | 950 | **ArticleReadingProgressBento** |
| `/autoschluessel/anfrage` | `src/app/(site)/autoschluessel/anfrage/page.tsx` | 270 | 950 | **CarKeyServiceConfigurator** |
| `/autoschluessel/fahrzeugoeffnung` | `src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx` | 141 | 950 | **CarKeyServiceConfigurator** |
| `/autoschluessel/funkschluessel` | `src/app/(site)/autoschluessel/funkschluessel/page.tsx` | 129 | 950 | **CarKeyServiceConfigurator** |
| `/autoschluessel/kopieren` | `src/app/(site)/autoschluessel/kopieren/page.tsx` | 162 | 950 | **CarKeyServiceConfigurator** |
| `/autoschluessel/marken/[make]/[model]` | `src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx` | 595 | 1195 | **CarMakeSelectorFilter** |
| `/autoschluessel/marken/[make]` | `src/app/(site)/autoschluessel/marken/[make]/page.tsx` | 392 | 992 | **CarMakeSelectorFilter** |
| `/autoschluessel/marken` | `src/app/(site)/autoschluessel/marken/page.tsx` | 302 | 950 | **CarMakeSelectorFilter** |
| `/autoschluessel/nachmachen` | `src/app/(site)/autoschluessel/nachmachen/page.tsx` | 62 | 950 | **KeyDuplicationCostCalculator** |
| `/autoschluessel` | `src/app/(site)/autoschluessel/page.tsx` | 1200 | 1800 | **CarKeyServiceConfigurator** |
| `/autoschluessel/programmieren` | `src/app/(site)/autoschluessel/programmieren/page.tsx` | 162 | 950 | **CarKeyServiceConfigurator** |
| `/autoschluessel/schluesselbart-fraesen` | `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx` | 157 | 950 | **CarKeyServiceConfigurator** |
| `/autoschluessel/smart-key` | `src/app/(site)/autoschluessel/smart-key/page.tsx` | 189 | 950 | **CarKeyServiceConfigurator** |
| `/bestellung/[id]` | `src/app/(site)/bestellung/[id]/page.tsx` | 708 | 1308 | **[id]InteractiveWidget** |
| `/elektronische-zutrittsloesungen/konfigurator` | `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx` | 168 | 950 | **KonfiguratorInteractiveWidget** |
| `/elektronische-zutrittsloesungen` | `src/app/(site)/elektronische-zutrittsloesungen/page.tsx` | 1666 | 2266 | **ElektronischeZutrittsloesungenInteractiveWidget** |
| `/gleichschliessende-zylinder/konfigurator` | `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx` | 130 | 950 | **KonfiguratorInteractiveWidget** |
| `/gleichschliessende-zylinder` | `src/app/(site)/gleichschliessende-zylinder/page.tsx` | 1025 | 1625 | **GleichschliessendeZylinderInteractiveWidget** |
| `/kasse` | `src/app/(site)/kasse/page.tsx` | 109 | 950 | **KasseInteractiveWidget** |
| `/` | `src/app/(site)/page.tsx` | 385 | 985 | **EnterpriseRoiCalculator** |
| `/ratgeber/[slug]` | `src/app/(site)/ratgeber/[slug]/page.tsx` | 126 | 950 | **ArticleReadingProgressBento** |
| `/ratgeber` | `src/app/(site)/ratgeber/page.tsx` | 78 | 950 | **ArticleReadingProgressBento** |
| `/rechtliches/agb` | `src/app/(site)/rechtliches/agb/page.tsx` | 370 | 970 | **LegalDocumentNavigator** |
| `/rechtliches/cookie-einstellungen` | `src/app/(site)/rechtliches/cookie-einstellungen/page.tsx` | 183 | 950 | **LegalDocumentNavigator** |
| `/rechtliches/datenschutz` | `src/app/(site)/rechtliches/datenschutz/page.tsx` | 628 | 1228 | **LegalDocumentNavigator** |
| `/rechtliches/impressum` | `src/app/(site)/rechtliches/impressum/page.tsx` | 196 | 950 | **LegalDocumentNavigator** |
| `/rechtliches/versand-und-zahlung` | `src/app/(site)/rechtliches/versand-und-zahlung/page.tsx` | 296 | 950 | **LegalDocumentNavigator** |
| `/rechtliches/widerruf` | `src/app/(site)/rechtliches/widerruf/page.tsx` | 326 | 950 | **LegalDocumentNavigator** |
| `/schliessanlagen/konfigurator` | `src/app/(site)/schliessanlagen/konfigurator/page.tsx` | 186 | 950 | **MasterKeySystemConfiguratorAdvanced** |
| `/schliessanlagen` | `src/app/(site)/schliessanlagen/page.tsx` | 1210 | 1810 | **MasterKeySystemConfiguratorAdvanced** |
| `/schluessel-nach-code/[slug]` | `src/app/(site)/schluessel-nach-code/[slug]/page.tsx` | 342 | 950 | **[slug]InteractiveWidget** |
| `/schluessel-nach-code` | `src/app/(site)/schluessel-nach-code/page.tsx` | 220 | 950 | **SchluesselNachCodeInteractiveWidget** |
| `/schluessel-nach-vorlage/anfrage` | `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx` | 78 | 950 | **AnfrageInteractiveWidget** |
| `/schluessel-nach-vorlage` | `src/app/(site)/schluessel-nach-vorlage/page.tsx` | 1058 | 1658 | **SchluesselNachVorlageInteractiveWidget** |
| `/service-und-termin/anfrage` | `src/app/(site)/service-und-termin/anfrage/page.tsx` | 58 | 950 | **ServiceAppointmentBookingWidget** |
| `/service-und-termin/kontakt` | `src/app/(site)/service-und-termin/kontakt/page.tsx` | 140 | 950 | **ServiceAppointmentBookingWidget** |
| `/service-und-termin` | `src/app/(site)/service-und-termin/page.tsx` | 1059 | 1659 | **ServiceAppointmentBookingWidget** |
| `/service-und-termin/terminstatus` | `src/app/(site)/service-und-termin/terminstatus/page.tsx` | 36 | 950 | **ServiceAppointmentBookingWidget** |
| `/service-und-termin/vor-ort` | `src/app/(site)/service-und-termin/vor-ort/page.tsx` | 349 | 950 | **ServiceAppointmentBookingWidget** |
| `/sicherheitstechnik/[slug]` | `src/app/(site)/sicherheitstechnik/[slug]/page.tsx` | 278 | 950 | **[slug]InteractiveWidget** |
| `/sicherheitstechnik` | `src/app/(site)/sicherheitstechnik/page.tsx` | 440 | 1040 | **SicherheitstechnikInteractiveWidget** |
| `/sicherheitstechnik/sicherheitscheck` | `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx` | 125 | 950 | **SicherheitscheckInteractiveWidget** |
| `/standorte/[city]` | `src/app/(site)/standorte/[city]/page.tsx` | 110 | 950 | **LocationDistanceCalculator** |
| `/standorte` | `src/app/(site)/standorte/page.tsx` | 73 | 950 | **LocationDistanceCalculator** |
| `/tuer-und-schliesstechnik/[slug]` | `src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx` | 172 | 950 | **[slug]InteractiveWidget** |
| `/tuer-und-schliesstechnik` | `src/app/(site)/tuer-und-schliesstechnik/page.tsx` | 1092 | 1692 | **TuerUndSchliesstechnikInteractiveWidget** |
| `/warenkorb` | `src/app/(site)/warenkorb/page.tsx` | 131 | 950 | **WarenkorbInteractiveWidget** |
