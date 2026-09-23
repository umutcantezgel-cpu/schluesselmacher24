export type RoiCalculationTier = 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

export interface RoiCalculationResult {
  totalEstimate: number;
  breakdown: Array<{
    label: string;
    amount: number;
  }>;
  tier: RoiCalculationTier;
}
