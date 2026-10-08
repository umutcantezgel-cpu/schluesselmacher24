export type SecurityCalculationResult = {
  totalEstimate: number;
  breakdown: { item: string; cost: number }[];
  tier: 'BASIC' | 'ADVANCED' | 'PREMIUM';
};
