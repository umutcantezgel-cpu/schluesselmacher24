export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ item: string; cost: number }>;
  tier: 'STANDARD' | 'PREMIUM';
}
