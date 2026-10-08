export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { name: string; amount: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
}
