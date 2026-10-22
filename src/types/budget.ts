export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: string[];
  tier: 'STANDARD' | 'PREMIUM';
}
