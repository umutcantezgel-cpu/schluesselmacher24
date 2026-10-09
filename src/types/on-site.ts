export interface OnSiteCalculationResult {
  estimatedTimeMinutes: number;
  estimatedCostTotal: number;
  breakdown: Array<{ label: string; value: number }>;
}
