export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE';
}
