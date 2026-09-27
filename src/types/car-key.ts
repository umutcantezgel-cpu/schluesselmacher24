export interface CarKeyCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ label: string; cost: number }>;
  tier: string;
}
