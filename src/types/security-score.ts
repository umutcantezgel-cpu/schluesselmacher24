export type SecurityScoreResult = {
  score: number;
  tier: 'BASIC' | 'ENHANCED' | 'PRO';
  recommendations: string[];
};
