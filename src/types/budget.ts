export interface BudgetBreakdownItem {
  label: string;
  amount: number;
}

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: BudgetBreakdownItem[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
}
