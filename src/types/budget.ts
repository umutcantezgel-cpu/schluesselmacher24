export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: string[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
}
