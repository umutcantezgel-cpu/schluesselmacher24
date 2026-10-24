export interface BudgetBreakdown {
  label: string;
  cost: number;
}

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: BudgetBreakdown[];
  tier: 'STANDARD' | 'PREMIUM';
}
