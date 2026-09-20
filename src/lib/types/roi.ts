export interface RoiCalculationResult {
  traditionalCost: number;
  digitalCost: number;
  savedTimeHours: number;
  costSavings: number;
  roiPercentage: number;
  breakdown: Array<{ label: string; value: number }>;
  tier: 'ESSENTIAL' | 'PROFESSIONAL' | 'ENTERPRISE';
}
