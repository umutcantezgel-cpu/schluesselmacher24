export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; value: string }[];
  tier: 'STANDARD' | 'PREMIUM';
}
