export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};
