export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ name: string; amount: number }>;
  tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE';
}
