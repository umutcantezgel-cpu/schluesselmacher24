export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; value: number }[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
}
