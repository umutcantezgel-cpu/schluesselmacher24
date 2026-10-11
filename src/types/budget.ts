export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ label: string; amount: number }>;
  tier: 'STANDARD' | 'PRO' | 'ENTERPRISE';
}
