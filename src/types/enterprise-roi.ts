export type EnterpriseRoiTier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface EnterpriseRoiResult {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: EnterpriseRoiTier;
  amortizationMonths: number;
}
