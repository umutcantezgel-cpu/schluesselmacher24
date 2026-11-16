import type { CylinderForm, VisualParamValue } from '@/lib/types';
import { ZylinderMassGrafik } from '@/components/visual/generators/zylinder-mass';
import { cn } from '@/lib/cn';

/** Bauform des Katalogs → Bauform der Maßzeichnung. */
export const BAUFORM_FUER_FORM: Record<CylinderForm, 'profil-doppel' | 'profil-halb' | 'knauf'> = {
  doppelzylinder: 'profil-doppel',
  halbzylinder: 'profil-halb',
  knaufzylinder: 'knauf',
};

export interface ZylinderMassLiveProps {
  form: CylinderForm;
  /** Maß A (außen) in mm. */
  aussen: number;
  /** Maß B (innen) in mm; bei Halbzylindern ohne Wirkung. */
  innen?: number;
  /** Name der Bauform für die Beschriftung, z. B. „Doppelzylinder“. */
  name: string;
  /**
   * Immer die schmale Fassung (300 Einheiten breit), auch ab 640 px: für Spalten unter etwa
   * 300 px Breite, in denen die breite Fassung (480 Einheiten) die Schrift unter 14 px drückt
   * (FA-26-01). Beispiel: Prüfliste „Ihre Zylinder“ im Zylinder-Konfigurator.
   */
  schmal?: boolean;
  className?: string;
}

/**
 * Zylindermaß live (Register B-17): Die Maßzeichnung folgt den gewählten Maßen
 * einer Tür und blendet bei jeder Änderung kurz über. Die Zeichnung ist
 * schematisch; maßgeblich sind die gewählten Zahlen.
 */
export function ZylinderMassLive({ form, aussen, innen, name, schmal = false, className }: ZylinderMassLiveProps) {
  const bauform = BAUFORM_FUER_FORM[form] ?? 'profil-doppel';
  const halb = bauform === 'profil-halb';
  const params: Record<string, VisualParamValue> = halb ? { bauform, aussen } : { bauform, aussen, innen: innen ?? aussen };
  const titel = halb
    ? `Maßzeichnung ${name}: Maß A ${aussen} mm`
    : `Maßzeichnung ${name}: Maß A ${aussen} mm, Maß B ${innen ?? aussen} mm`;

  return (
    <figure className={cn('sm24-ruhig', className)}>
      {/* Unter 640 px die schmale Fassung: Die Zeichnung ist dort etwa 250 px breit. */}
      <div key={`${bauform}-${aussen}-${innen ?? ''}`} className="animate-schleier-ein">
        <ZylinderMassGrafik params={{ ...params, format: 'schmal' }} title={titel} className={schmal ? undefined : 'sm:hidden'} />
        {!schmal && <ZylinderMassGrafik params={params} title={titel} className="hidden sm:block" />}
      </div>
      <figcaption className="mt-2 text-balance font-mono text-caption uppercase tracking-label text-foreground-muted">
        Schematisch. Maßgeblich sind die gewählten Maße
      </figcaption>
    </figure>
  );
}
