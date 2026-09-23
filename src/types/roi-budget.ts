export type RoiCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; value: number }[];
  tier: 'STANDARD' | 'ENTERPRISE' | 'PREMIUM';
  savingsPerYear: number;
};
