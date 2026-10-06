export type Tier = 'BASIS' | 'STANDARD' | 'PREMIUM';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ label: string; cost: number }>;
  tier: Tier;
}
