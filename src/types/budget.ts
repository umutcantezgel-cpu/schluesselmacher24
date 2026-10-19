export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { category: string; cost: number }[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
}
