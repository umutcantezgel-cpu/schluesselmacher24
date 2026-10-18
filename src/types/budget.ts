export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ label: string; cost: number }>;
  tier: 'STANDARD' | 'PREMIUM';
}
