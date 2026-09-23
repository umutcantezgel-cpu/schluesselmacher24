
'use server';

import type { EnterpriseRoiResult } from '@/types/enterprise-roi';

export async function calculateEnterpriseRoi(
  prevState: EnterpriseRoiResult,
  formData: FormData
): Promise<EnterpriseRoiResult> {
  const doors = Number(formData.get('doors')) || 50;
  const users = Number(formData.get('users')) || 100;

  const adminTimePerUser = 0.5; // hours per user per year
  const costPerHour = 65; // EUR

  const totalAdminHours = users * adminTimePerUser;
  const oldCost = totalAdminHours * costPerHour;

  const newAdminHours = totalAdminHours * 0.15; // 85% savings
  const newCost = newAdminHours * costPerHour;

  const totalSavings = oldCost - newCost;
  const timeSaved = totalAdminHours - newAdminHours;

  let tier: 'BASIC' | 'PRO' | 'ENTERPRISE' = 'BASIC';
  if (doors > 20 || users > 50) tier = 'PRO';
  if (doors > 100 || users > 250) tier = 'ENTERPRISE';

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    totalSavings: Math.round(totalSavings),
    timeSaved: Math.round(timeSaved),
    efficiencyGain: 85,
    breakdown: [
      { label: 'Vorherige Admin-Kosten', value: `${Math.round(oldCost)} € / Jahr` },
      { label: 'Neue Admin-Kosten', value: `${Math.round(newCost)} € / Jahr` },
      { label: 'Eingesparte Zeit', value: `${Math.round(timeSaved)} Stunden / Jahr` }
    ],
    tier,
  };
}
