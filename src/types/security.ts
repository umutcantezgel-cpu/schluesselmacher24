export interface SecurityCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ name: string; cost: number }>;
  tier: 'STANDARD' | 'PREMIUM';
}
