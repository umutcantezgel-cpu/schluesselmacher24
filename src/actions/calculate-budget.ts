"use server";

import type { BudgetCalculationResult } from "@/types/budget";

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Extract inputs
  const scopeDays = Number(formData.get("scopeDays") || 15);
  const includeVideo = formData.get("includeVideo") === "on";
  const includeAlarm = formData.get("includeAlarm") === "on";
  const includeSmart = formData.get("includeSmart") === "on";

  // Base daily rate logic
  const baseRate = 850; // Daily rate in Euro

  // Calculate hardware/software additions based on features
  let hardwareEstimate = 0;
  if (includeVideo) hardwareEstimate += 2500;
  if (includeAlarm) hardwareEstimate += 1800;
  if (includeSmart) hardwareEstimate += 1200;

  const laborTotal = scopeDays * baseRate;
  const totalEstimate = laborTotal + hardwareEstimate;

  // Determine tier
  let tier: "BASIS" | "STANDARD" | "PREMIUM" = "STANDARD";
  if (totalEstimate < 10000) tier = "BASIS";
  else if (totalEstimate > 25000) tier = "PREMIUM";

  // Simulate network delay to show pending state
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate,
    breakdown: [
      { label: "Arbeitszeit & Planung", amount: laborTotal },
      { label: "Technik & Hardware", amount: hardwareEstimate },
    ],
    tier,
  };
}
