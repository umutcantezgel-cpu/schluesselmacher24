export type BudgetTier = 'STANDARD' | 'ENTERPRISE' | 'CUSTOM';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; value: number }[];
  tier: BudgetTier;
}
