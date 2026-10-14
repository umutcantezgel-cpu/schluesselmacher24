export interface BudgetBreakdown {
  label: string;
  amount: number;
}

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: BudgetBreakdown[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
}
