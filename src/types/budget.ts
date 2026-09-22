export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{
    label: string;
    value: number;
  }>;
  tier: 'STANDARD' | 'ENTERPRISE' | 'CUSTOM';
}
