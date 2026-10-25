export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { item: string; cost: number }[];
  tier: 'STANDARD' | 'PRO' | 'ENTERPRISE';
};
