import type { CylinderForm } from '@/lib/types';
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
  className?: string;
}

/**
 * Zylindermaß live (Register B-17): Die Maßzeichnung folgt den gewählten Maßen
 * einer Tür und blendet bei jeder Änderung kurz über. Die Zeichnung ist
 * schematisch; maßgeblich sind die gewählten Zahlen.
 */
export function ZylinderMassLive({ form, aussen, innen, name, className }: ZylinderMassLiveProps) {
  const bauform = BAUFORM_FUER_FORM[form] ?? 'profil-doppel';
  const halb = bauform === 'profil-halb';
  const titel = halb
    ? `Maßzeichnung ${name}: Maß A ${aussen} mm`
    : `Maßzeichnung ${name}: Maß A ${aussen} mm, Maß B ${innen ?? aussen} mm`;

  return (
    <figure className={cn('rounded-lg border border-border bg-surface p-3 sm:p-4', className)}>
      <div key={`${bauform}-${aussen}-${innen ?? ''}`} className="animate-schleier-ein">
        <ZylinderMassGrafik
          params={halb ? { bauform, aussen } : { bauform, aussen, innen: innen ?? aussen }}
          title={titel}
        />
      </div>
      <figcaption className="mt-2 font-mono text-caption uppercase tracking-label text-foreground-muted">
        Schematisch – maßgeblich sind die gewählten Maße
      </figcaption>
    </figure>
  );
}
