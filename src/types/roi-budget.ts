export interface RoiCalculationResult {
  upfrontCost: number;
  annualMaintenance: number;
  estimatedSavings10Years: number;
  amortizationYears: number;
  tier: 'MECHANICAL' | 'ELECTRONIC' | 'MECHATRONIC';
}
