export interface BudgetCalculationResult {
  roi?: number;
  totalEstimate: number;
  breakdown: { item: string; cost: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
}
