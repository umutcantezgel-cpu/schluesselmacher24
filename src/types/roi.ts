export interface RoiCalculationResult {
  totalSavings: number;
  breakdown: { item: string; cost: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
}
