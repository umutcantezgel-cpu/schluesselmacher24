export interface RoiCalculationResult {
  totalEstimate: number;
  timeSaved: number;
  roiFactor: number;
  breakdown: { label: string; value: number }[];
}
