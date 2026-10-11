export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; value: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
}
