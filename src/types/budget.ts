export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { item: string; cost: number }[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
}
