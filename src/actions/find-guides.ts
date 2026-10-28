'use server';

export type GuideFinderResult = {
  status: 'idle' | 'loading' | 'success' | 'error';
  results: { id: string; title: string; slug: string; excerpt: string }[];
  message?: string;
};

export async function findRelevantGuides(
  prevState: GuideFinderResult,
  formData: FormData
): Promise<GuideFinderResult> {
  const role = formData.get('role') as string;
  const focus = formData.get('focus') as string;

  // Simulate network delay for realistic interaction
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!role || !focus) {
    return { status: 'error', results: [], message: 'Bitte wählen Sie eine Rolle und einen Fokus.' };
  }

  // Mock implementation for demonstration. In a real app, this would query the CMS or database.
  // We'll return dummy results matching the selected criteria.

  let mockResults = [];

  if (focus === 'mechanik') {
     mockResults = [
       { id: '1', title: 'Schließzylinder wechseln: Eine Schritt-für-Schritt Anleitung', slug: 'schliesszylinder-wechseln', excerpt: 'Erfahren Sie, wie Sie den Zylinder Ihrer Haustür sicher und fachgerecht austauschen.' },
       { id: '2', title: 'Einbruchschutz durch mechanische Zusatzschlösser', slug: 'zusatzschloesser', excerpt: 'Welche mechanischen Nachrüstungen wirklich sinnvoll sind und wie sie montiert werden.' }
     ];
  } else if (focus === 'elektronik') {
      mockResults = [
       { id: '3', title: 'Smart Locks im Vergleich: Sicherheit vs. Komfort', slug: 'smart-locks', excerpt: 'Die Vor- und Nachteile elektronischer Türschlösser und worauf beim Kauf zu achten ist.' },
       { id: '4', title: 'Zutrittskontrolle via Smartphone einrichten', slug: 'smartphone-zutritt', excerpt: 'Wie Sie mobile Berechtigungen sicher verwalten und widerrufen können.' }
     ];
  } else {
      mockResults = [
       { id: '5', title: 'Planung einer Schließanlage für Mehrfamilienhäuser', slug: 'schliessanlage-planung', excerpt: 'Grundlagen der Schließplanerstellung und Zylinderberechnung.' },
       { id: '6', title: 'Wartungsvertrag für Sicherheitstechnik', slug: 'wartung', excerpt: 'Warum regelmäßige Wartung wichtig ist und was ein guter Vertrag beinhalten sollte.' }
     ];
  }

  return {
    status: 'success',
    results: mockResults,
  };
}
