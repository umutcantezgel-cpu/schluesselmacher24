export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { category: string; cost: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'HIGH_END';
}
