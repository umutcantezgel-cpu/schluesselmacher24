import { ratios } from '@/components/ui/bild-flaeche';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { cn } from '@/lib/cn';

/*
 * Schlüsselprofil einer Code-Position im Warenkorb, ohne das Register aller Generatoren (FA-SEO-03E, Regel A-076).
 *
 * Der Seitenkopf verlinkt `/warenkorb` auf jeder Seite; sein Vorabruf lud über `ImagePlaceholder` das Register
 * mit allen Zeichnungen. Die Code-Position zeichnet aber immer nur `schluessel` (fester Generator im Code, nicht
 * aus Inhalten). Dieser Baustein ergibt dasselbe Markup wie
 * `<ImagePlaceholder slot={{ motif: 'Schlüsselprofil zum Code', ratio: '1/1', visual: { generator: 'schluessel', params: { typ: 'zylinder', code } } }} frei />`
 * (`code-profil-bild.test.tsx` vergleicht beide). `schluessel` hat keine schmale Fassung.
 */
export function CodeProfilBild({ code }: { code: string }) {
  return (
    <div className={cn('relative w-full overflow-hidden', ratios['1/1'])}>
      <SchluesselGrafik params={{ typ: 'zylinder', code }} title="" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
