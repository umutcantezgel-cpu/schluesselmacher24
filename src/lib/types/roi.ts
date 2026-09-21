export interface RoiInput {
  doorCount: number;
  employeeCount: number;
  keyReplacementsPerYear: number;
}

export interface RoiCalculationResult {
  mechanicalCost: number;
  electronicCost: number;
  savingsYear1: number;
  savingsYear3: number;
  breakEvenMonths: number;
  recommendation: 'MECHANICAL' | 'ELECTRONIC' | 'HYBRID';
}
