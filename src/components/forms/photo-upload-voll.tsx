'use client';

import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PhotoUpload, type PhotoUploadProps } from './photo-upload';

/**
 * Foto-Upload, dessen Beispiel jede Zeichnung des Registers zeigen kann (FA-SEO-03D).
 *
 * Für Formulare, deren Beispielmotiv aus gepflegten Inhalten stammt (etwa der Schlüsseltyp einer
 * Codelinie in `schluessel-nach-code/[slug]/bestell-formular.tsx`): Dort ist nicht vorher bekannt,
 * welche Zeichnung `visualFuerMotiv` wählt. Alle anderen Formulare nutzen `PhotoUpload` mit den
 * Zeichnungen aus `UPLOAD_ZEICHNUNGEN` und laden so nicht alle Generatoren mit.
 */
export function PhotoUploadAlleZeichnungen(props: Omit<PhotoUploadProps, 'beispielFlaeche'>) {
  return <PhotoUpload {...props} beispielFlaeche={ImagePlaceholder} />;
}
