export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; value: number }[];
  tier: string;
}
