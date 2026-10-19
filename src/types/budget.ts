export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'COMPLEX';
}
