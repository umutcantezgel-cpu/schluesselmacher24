export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: string[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};
