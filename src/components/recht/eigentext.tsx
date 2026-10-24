import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { LinkJSXConverter, RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';

import type { RichTextDocument } from '@/lib/types';

/**
 * Interne Links im Eigentext: Ziel ist die Seite mit dem Slug des verlinkten
 * Dokuments. Ohne Slug bleibt der Link auf der Seite stehen.
 */
function internerLink({ linkNode }: { linkNode: { fields: { doc?: unknown } } }): string {
  const ziel = (linkNode.fields.doc as { value?: unknown } | undefined)?.value;
  const slug = (ziel as { slug?: unknown } | undefined)?.slug;
  return typeof slug === 'string' && slug ? `/${slug.replace(/^\/+/, '')}` : '#';
}

const umwandler: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref: internerLink }),
});

/**
 * Eigene Fassung einer Rechtsseite aus dem Backend (Einstellungen →
 * Rechtstexte), z. B. vom Anwalt oder einem Rechtstexte-Dienst. Ersetzt den
 * eingebauten Entwurf vollständig; gestaltet über `prose-sm24` des Layouts.
 */
export function Eigentext({ dokument }: { dokument: RichTextDocument }) {
  return (
    <RichText
      data={dokument as unknown as SerializedEditorState}
      converters={umwandler}
      disableContainer
    />
  );
}

/** Rechtsseite mit Eigentext: Seitentitel aus dem Code, Inhalt aus dem Backend. */
export function EigentextSeite({ titel, dokument }: { titel: string; dokument: RichTextDocument }) {
  return (
    <>
      <h1 className="text-headline font-bold text-balance">{titel}</h1>
      <div className="mt-6">
        <Eigentext dokument={dokument} />
      </div>
    </>
  );
}
