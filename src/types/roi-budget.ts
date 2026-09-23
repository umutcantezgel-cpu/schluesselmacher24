export type RoiBudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { category: string; amount: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  roiTimeMonths: number;
};
