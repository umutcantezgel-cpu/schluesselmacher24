export interface RouteSuggestion {
  suggestedPath: string | null;
  reasoning: string | null;
  urgencyLevel: 'NORMAL' | 'HIGH' | 'CRITICAL';
}
