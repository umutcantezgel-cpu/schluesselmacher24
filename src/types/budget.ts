export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ label: string; amount: number }>;
  tier: 'BASIC' | 'SMART' | 'PREMIUM' | 'STANDARD';
}
