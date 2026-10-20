import { notFound } from 'next/navigation';

/**
 * Unbekannte Adressen auf oberster Ebene: Die Website hat eigene Root-Layouts je
 * Gruppe, deshalb greift `not-found.tsx` nur innerhalb der Gruppe. Diese Route fängt
 * alles ab, was keine andere Route trifft, und zeigt die eigene 404-Seite mit Kopf
 * und Fuß statt der Standardseite (D-019). Bestimmte Routen, `/admin`, `/api` und
 * Dateien aus `public/` haben Vorrang.
 */
export default function UnbekannteSeite() {
  notFound();
}
