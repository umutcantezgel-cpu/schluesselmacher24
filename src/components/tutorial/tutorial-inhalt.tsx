import Link from 'next/link';

import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import type { Tutorial } from '@/lib/types';
import { belegteSchritte } from '@/lib/tutorials/tutorials';

import { SCHRITT_BILD_EINZUG, SCHRITT_BILD_KLASSE, SCHRITT_BILD_SIZES } from './schritt-bild';
import { VideoHinweis } from './video-hinweis';

export interface TutorialInhaltProps {
  tutorial: Tutorial;
  /** Ratgeber, der das Thema vollständig erklärt (nur, wenn es ihn öffentlich gibt). */
  ratgeber?: { href: string; label: string } | null;
  /** Einbettung der Videos freigeschaltet (Schalter `SM24_VIDEOS`, auf dem Server gelesen; FA-INHALT-01B). */
  videosFrei?: boolean;
}

/**
 * Inhalt einer Tutorial-Seite (FA-INHALT-01): oben das Video, falls hinterlegt (ohne Freigabe nur der ruhige
 * Hinweis ohne Adresse, mit Freigabe die Einbettung, die erst nach dem Klick lädt), darunter die nummerierten Schritte mit Bildern. Die Seite ist auch ohne Video
 * vollständig. Weiter führen der Ratgeber, falls er das Thema ausführlich trägt, und die gepflegten Links.
 */
export function TutorialInhalt({ tutorial, ratgeber, videosFrei = false }: TutorialInhaltProps) {
  const schritte = belegteSchritte(tutorial);
  const weiter = tutorial.seo.internalLinks.filter(
    (link, index, alle) => link.label.trim() && link.href !== ratgeber?.href && alle.findIndex((l) => l.href === link.href) === index,
  );

  return (
    <div className="shell grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-gutter">
      <div className="min-w-0 lg:col-span-8">
        <VideoHinweis video={tutorial.video} freigegeben={videosFrei} titel={tutorial.title} className="mb-10" />

        {schritte.length > 0 && (
          <section aria-labelledby="schritte-titel">
            <h2 id="schritte-titel" className="font-mono text-caption uppercase tracking-label text-foreground-muted">
              Schritt für Schritt
            </h2>
            <ol className="mt-4 border-t border-border">
              {schritte.map((schritt, index) => (
                <li key={`${index}-${schritt.heading}`} className="grid gap-5 border-b border-border py-7">
                  <div className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="w-8 shrink-0 pt-0.5 font-mono text-small font-semibold tabular-nums text-area-strong"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-title-sm font-semibold text-foreground [overflow-wrap:anywhere]">
                        <span className="sr-only">Schritt {index + 1}: </span>
                        {schritt.heading}
                      </h3>
                      <p className="mt-2 max-w-measure text-body text-foreground-muted">{schritt.text}</p>
                    </div>
                  </div>
                  {/* Das Bild steht unter dem Text und nie in einer schmalen Spalte: Nur so bleibt die Schrift
                      der Zeichnungen bei jeder Fensterbreite mindestens 14 px groß (`schritt-bild.ts`). */}
                  {schritt.image && (
                    <div className={SCHRITT_BILD_EINZUG}>
                      <ImagePlaceholder slot={schritt.image} className={SCHRITT_BILD_KLASSE} sizes={SCHRITT_BILD_SIZES} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {(ratgeber || weiter.length > 0) && (
        <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <div className="space-y-8">
            {ratgeber && (
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Ausführlich im Ratgeber</p>
                <Link
                  href={ratgeber.href}
                  className="group mt-3 flex min-h-touch items-center justify-between gap-3 text-small font-semibold text-primary"
                >
                  <span className="[overflow-wrap:anywhere]">{ratgeber.label}</span>
                  <GlyphPfeilRechts
                    size={16}
                    className="shrink-0 transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}
            {weiter.length > 0 && (
              <nav aria-labelledby="tutorial-weiter">
                <p id="tutorial-weiter" className="font-mono text-caption uppercase tracking-label text-foreground-muted">
                  Weiter
                </p>
                <ul className="mt-3 border-t border-border">
                  {weiter.map((link) => (
                    <li key={link.href} className="border-b border-border">
                      <Link
                        href={link.href}
                        className="group flex min-h-touch items-center justify-between gap-3 py-3 text-small font-semibold text-foreground transition-colors duration-quick hover:text-primary"
                      >
                        <span className="[overflow-wrap:anywhere]">{link.label}</span>
                        <GlyphPfeilRechts
                          size={16}
                          className="shrink-0 text-foreground-muted transition duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
