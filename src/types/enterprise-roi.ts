
export type EnterpriseRoiResult = {
  totalSavings: number;
  timeSaved: number;
  efficiencyGain: number;
  breakdown: { label: string; value: string }[];
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
};
