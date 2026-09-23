export type EnterpriseRoiCalculationResult = {
  estimatedCost: number;
  estimatedSavings: number;
  roiMonths: number;
  tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE';
};
