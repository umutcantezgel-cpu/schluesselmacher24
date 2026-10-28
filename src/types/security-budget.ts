export interface SecurityBudgetResult {
  totalEstimate: number;
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  breakdown: Array<{
    label: string;
    cost: number;
  }>;
}
