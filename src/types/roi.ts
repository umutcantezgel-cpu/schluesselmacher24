export interface ROIResult {
  investment: number;
  annualSavings: number;
  netBenefit: number;
  paybackMonths: number;
  tier: 'STANDARD' | 'HIGH' | 'PREMIUM';
}
