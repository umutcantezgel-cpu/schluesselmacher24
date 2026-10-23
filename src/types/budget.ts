export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{
    description: string;
    amount: number;
  }>;
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
}
