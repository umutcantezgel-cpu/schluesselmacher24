export interface SecurityBudgetBreakdown {
  item: string;
  cost: number;
}

export interface SecurityBudgetCalculationResult {
  totalEstimate: number;
  breakdown: SecurityBudgetBreakdown[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
}
