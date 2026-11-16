import Image from 'next/image';
import Link from 'next/link';

import { OptionCard } from '@/components/forms/option-card';
import { Alert } from '@/components/ui/alert';
import { HERSTELLER_ANGABE_SATZ, KEINE_HERSTELLER_VORGABE, type HerstellerSystem } from '@/lib/konfigurator';

/*
 * Bausteine des Konfigurators für gleichschließende Zylinder ohne eigenen Zustand (FA-SHOP-04B), damit
 * sie sich ohne Browser prüfen lassen: die Herstellerwahl ohne Herstellerpreise und der Weg in die Anfrage
 * bei unbestätigtem Preis. Kurze Sätze, keine Beträge.
 */

/**
 * Ein Logo nur mit Freigabe im Stamm (R12), mit Schutzraum und ohne Umfärbung; sonst nichts. Der Name steht
 * schon als Titel der Auswahl, das Logo ist daneben Schmuck (`alt=""`), damit er nur einmal vorgelesen wird.
 */
function Logo({ system }: { system: HerstellerSystem }) {
  if (!system.logo) return null;
  const svg = /\.svg(\?|$)/i.test(system.logo.url);
  return (
    <span className="block p-1">
      <span className="relative block h-10 w-32">
        <Image src={system.logo.url} alt="" fill sizes="128px" className="object-contain object-left" unoptimized={svg} />
      </span>
    </span>
  );
}

export interface HerstellerAngabeWahlProps {
  systeme: HerstellerSystem[];
  /** Kennung des gewählten Systems, `KEINE_HERSTELLER_VORGABE` oder leer. */
  wert: string;
  onWahl: (wert: string) => void;
}

/**
 * Herstellerwahl, solange der Zylinderkatalog keinen Hersteller mit Preisen führt: BKS, ABUS und weitere
 * Systeme aus der Stammliste mit dem Bereich „Sperrschließungen“. Die Wahl ist eine Angabe für die Werkstatt.
 */
export function HerstellerAngabeWahl({ systeme, wert, onWahl }: HerstellerAngabeWahlProps) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-3 text-body font-semibold text-foreground">Von welchem Hersteller sollen Ihre Zylinder sein?</legend>
        <div className="space-y-3">
          {systeme.map((system) => (
            <OptionCard
              key={system.id}
              name="hersteller"
              value={system.id}
              checked={wert === system.id}
              onSelect={onWahl}
              title={system.name}
              bild={system.logo ? <Logo system={system} /> : undefined}
            />
          ))}
          <OptionCard
            name="hersteller"
            value={KEINE_HERSTELLER_VORGABE}
            checked={wert === KEINE_HERSTELLER_VORGABE}
            onSelect={onWahl}
            title="Keine Vorgabe"
            description="Die Werkstatt wählt das System für Ihre Zylinder."
          />
        </div>
      </fieldset>
      <p className="text-small leading-relaxed text-foreground-muted">{HERSTELLER_ANGABE_SATZ}</p>
      <p className="text-small leading-relaxed text-foreground-muted">
        Weitere Hersteller oder Sonderlösungen auf Anfrage. Schreiben Sie uns über die{' '}
        <Link href="/service-und-termin/anfrage?thema=gleichschliessende-zylinder" className="font-semibold text-primary hover:underline">
          allgemeine Anfrage
        </Link>
        .
      </p>
    </div>
  );
}

export interface AnfrageWegProps {
  /** Satz der Preissperre, etwa „Der Preis für „Halbzylinder“ ist noch nicht bestätigt.“ */
  sperrText: string | null;
  href: string;
  /** Geht die Zusammenstellung als Plan mit? Sonst nennt der Kunde seine Angaben selbst. */
  mitPlan: boolean;
  /** Name des gewählten Herstellers, falls einer gewählt ist. */
  hersteller?: string;
  /** Zusatzkomponenten des Herstellers gewählt? Sie trägt der Plan nicht. */
  komponenten?: boolean;
}

/** Weg in die Anfrage bei unbestätigtem Preis: kein Betrag, kein Bestellknopf, ein ruhiger Satz (FA-SHOP-04B, Punkt 6). */
export function AnfrageWeg({ sperrText, href, mitPlan, hersteller, komponenten = false }: AnfrageWegProps) {
  const mit = mitPlan
    ? `Zylinder, Maße, Schlüssel, Optionen${hersteller ? ' und Hersteller' : ''} gehen mit.`
    : `Bitte nennen Sie uns in der Anfrage Bauform, Maße und Anzahl je Tür, die Zahl der Schlüssel, Ihre Optionen${
        hersteller ? ` und den Hersteller ${hersteller}` : ''
      }.`;
  return (
    <Alert tone="info" title="Diese Zusammenstellung bekommen Sie als Angebot">
      <p>
        {sperrText ? `${sperrText} ` : ''}Schicken Sie uns die Zusammenstellung als Anfrage. Sie bekommen ein Angebot mit Preis.{' '}
        {mit}
        {komponenten && mitPlan ? ' Zusatzkomponenten nennen Sie uns dort bitte bei den Hinweisen.' : ''}
      </p>
      <p className="mt-3">
        <Link href={href} prefetch={false} className="font-semibold text-primary underline">
          Zusammenstellung als Anfrage schicken
        </Link>
      </p>
    </Alert>
  );
}
