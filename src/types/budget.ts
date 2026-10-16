export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
}
