// FA-SEO-03D: Preis-Ergebnisse vor und nach dem Verschieben von fahrzeugVorOrtNoetig vergleichen.
import * as alt from "./pricing-alt"; // Stand vor dem Paket: git show b0aa692:src/lib/pricing.ts > pricing-alt.ts (neben dieses Skript)
import * as neu from '/home/user/schluesselmacher24/src/lib/pricing';
import { defaults } from '/home/user/schluesselmacher24/src/lib/data/defaults';
import { KEY_KIND_ORDER } from '/home/user/schluesselmacher24/src/components/autoschluessel/optionen';
const s = defaults.settings(); const rules = defaults.pricingRules(); const services = defaults.carKeyServices(); const makes = defaults.vehicleMakes();
let n = 0, diff = 0;
for (const make of makes) for (const model of [null, ...(make.models ?? [])]) for (const service of services) for (const keyKind of KEY_KIND_ORDER) for (const workingKeys of [0, 1, 2]) {
  const input = { make, model, service, keyKind, workingKeys } as any;
  const a = JSON.stringify(alt.quoteCarKeyService(input, rules, s.booking));
  const b = JSON.stringify(neu.quoteCarKeyService(input, rules, s.booking));
  const c = alt.fahrzeugVorOrtNoetig(service, model) === neu.fahrzeugVorOrtNoetig(service, model);
  n++; if (a !== b || !c) diff++;
}
console.log(JSON.stringify({ faelle: n, abweichungen: diff, hersteller: makes.length, leistungen: services.length }));
