export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: Array<{ name: string; estimate: number }>;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
};
