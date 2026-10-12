# Architecture Matrix

## Routes Transformation
| Route | Source File | Existing Content Words | Target Word Count | Interactive Module | Schema Entities | CWV Status |
|---|---|---|---|---|---|---|
| `app/admin/[[...segments]]/page.tsx` | `src/app/(payload)/admin/[[...segments]]/page.tsx` | 300 | 950 | [[...Segments]]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/artikel/[slug]/page.tsx` | `src/app/(site)/artikel/[slug]/page.tsx` | 300 | 950 | [Slug]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/artikel/page.tsx` | `src/app/(site)/artikel/page.tsx` | 300 | 950 | ArtikelCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/anfrage/page.tsx` | `src/app/(site)/autoschluessel/anfrage/page.tsx` | 300 | 950 | AnfrageCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/fahrzeugoeffnung/page.tsx` | `src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx` | 300 | 950 | FahrzeugoeffnungCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/funkschluessel/page.tsx` | `src/app/(site)/autoschluessel/funkschluessel/page.tsx` | 300 | 950 | FunkschluesselCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/kopieren/page.tsx` | `src/app/(site)/autoschluessel/kopieren/page.tsx` | 300 | 950 | KopierenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/marken/[make]/[model]/page.tsx` | `src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx` | 300 | 950 | [Model]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/marken/[make]/page.tsx` | `src/app/(site)/autoschluessel/marken/[make]/page.tsx` | 300 | 950 | [Make]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/marken/page.tsx` | `src/app/(site)/autoschluessel/marken/page.tsx` | 300 | 950 | MarkenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/nachmachen/page.tsx` | `src/app/(site)/autoschluessel/nachmachen/page.tsx` | 300 | 950 | NachmachenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/page.tsx` | `src/app/(site)/autoschluessel/page.tsx` | 300 | 950 | AutoschluesselCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/programmieren/page.tsx` | `src/app/(site)/autoschluessel/programmieren/page.tsx` | 300 | 950 | ProgrammierenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/schluesselbart-fraesen/page.tsx` | `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx` | 300 | 950 | SchluesselbartFraesenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/autoschluessel/smart-key/page.tsx` | `src/app/(site)/autoschluessel/smart-key/page.tsx` | 300 | 950 | SmartKeyCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/bestellung/[id]/page.tsx` | `src/app/(site)/bestellung/[id]/page.tsx` | 300 | 950 | [Id]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/elektronische-zutrittsloesungen/konfigurator/page.tsx` | `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx` | 300 | 950 | KonfiguratorCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/elektronische-zutrittsloesungen/page.tsx` | `src/app/(site)/elektronische-zutrittsloesungen/page.tsx` | 300 | 950 | ElektronischeZutrittsloesungenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/gleichschliessende-zylinder/konfigurator/page.tsx` | `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx` | 300 | 950 | KonfiguratorCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/gleichschliessende-zylinder/page.tsx` | `src/app/(site)/gleichschliessende-zylinder/page.tsx` | 300 | 950 | GleichschliessendeZylinderCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/kasse/page.tsx` | `src/app/(site)/kasse/page.tsx` | 300 | 950 | KasseCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/llms.txt/route.ts` | `src/app/llms.txt/route.ts` | 300 | 950 | Llms.TxtCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/page.tsx` | `src/app/(site)/page.tsx` | 300 | 950 | AppCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/ratgeber/[slug]/page.tsx` | `src/app/(site)/ratgeber/[slug]/page.tsx` | 300 | 950 | [Slug]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/ratgeber/page.tsx` | `src/app/(site)/ratgeber/page.tsx` | 300 | 950 | RatgeberCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/rechtliches/agb/page.tsx` | `src/app/(site)/rechtliches/agb/page.tsx` | 300 | 950 | AgbCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/rechtliches/cookie-einstellungen/page.tsx` | `src/app/(site)/rechtliches/cookie-einstellungen/page.tsx` | 300 | 950 | CookieEinstellungenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/rechtliches/datenschutz/page.tsx` | `src/app/(site)/rechtliches/datenschutz/page.tsx` | 300 | 950 | DatenschutzCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/rechtliches/impressum/page.tsx` | `src/app/(site)/rechtliches/impressum/page.tsx` | 300 | 950 | ImpressumCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/rechtliches/versand-und-zahlung/page.tsx` | `src/app/(site)/rechtliches/versand-und-zahlung/page.tsx` | 300 | 950 | VersandUndZahlungCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/rechtliches/widerruf/page.tsx` | `src/app/(site)/rechtliches/widerruf/page.tsx` | 300 | 950 | WiderrufCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/schliessanlagen/konfigurator/page.tsx` | `src/app/(site)/schliessanlagen/konfigurator/page.tsx` | 300 | 950 | KonfiguratorCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/schliessanlagen/page.tsx` | `src/app/(site)/schliessanlagen/page.tsx` | 300 | 950 | SchliessanlagenCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/schluessel-nach-code/[slug]/page.tsx` | `src/app/(site)/schluessel-nach-code/[slug]/page.tsx` | 300 | 950 | [Slug]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/schluessel-nach-code/page.tsx` | `src/app/(site)/schluessel-nach-code/page.tsx` | 300 | 950 | SchluesselNachCodeCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/schluessel-nach-vorlage/anfrage/page.tsx` | `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx` | 300 | 950 | AnfrageCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/schluessel-nach-vorlage/page.tsx` | `src/app/(site)/schluessel-nach-vorlage/page.tsx` | 300 | 950 | SchluesselNachVorlageCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/service-und-termin/anfrage/page.tsx` | `src/app/(site)/service-und-termin/anfrage/page.tsx` | 300 | 950 | AnfrageCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/service-und-termin/kontakt/page.tsx` | `src/app/(site)/service-und-termin/kontakt/page.tsx` | 300 | 950 | KontaktCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/service-und-termin/page.tsx` | `src/app/(site)/service-und-termin/page.tsx` | 300 | 950 | ServiceUndTerminCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/service-und-termin/terminstatus/page.tsx` | `src/app/(site)/service-und-termin/terminstatus/page.tsx` | 300 | 950 | TerminstatusCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/service-und-termin/vor-ort/page.tsx` | `src/app/(site)/service-und-termin/vor-ort/page.tsx` | 300 | 950 | VorOrtCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/sicherheitstechnik/[slug]/page.tsx` | `src/app/(site)/sicherheitstechnik/[slug]/page.tsx` | 300 | 950 | [Slug]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/sicherheitstechnik/page.tsx` | `src/app/(site)/sicherheitstechnik/page.tsx` | 300 | 950 | SicherheitstechnikCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/sicherheitstechnik/sicherheitscheck/page.tsx` | `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx` | 300 | 950 | SicherheitscheckCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/standorte/[city]/page.tsx` | `src/app/(site)/standorte/[city]/page.tsx` | 300 | 950 | [City]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/standorte/page.tsx` | `src/app/(site)/standorte/page.tsx` | 300 | 950 | StandorteCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/tuer-und-schliesstechnik/[slug]/page.tsx` | `src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx` | 300 | 950 | [Slug]Calculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/tuer-und-schliesstechnik/page.tsx` | `src/app/(site)/tuer-und-schliesstechnik/page.tsx` | 300 | 950 | TuerUndSchliesstechnikCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
| `app/warenkorb/page.tsx` | `src/app/(site)/warenkorb/page.tsx` | 300 | 950 | WarenkorbCalculator | Organization, WebSite, FAQPage | Requires `priority={true}` on Hero |
