"use server";

import type { BudgetCalculationResult } from "@/components/calculator/service-budget-calculator";

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get("scopeDays")) || 15;
  const keyType = formData.get("keyType")?.toString() || "nachmachen";

  let baseMultiplier = 150;
  let tier: "BASIC" | "STANDARD" | "PREMIUM" = "STANDARD";

  if (keyType === "kopieren") {
    baseMultiplier = 80;
    tier = "BASIC";
  } else if (keyType === "programmieren" || keyType === "smartkey") {
    baseMultiplier = 250;
    tier = "PREMIUM";
  }

  const totalEstimate = scopeDays * baseMultiplier;

  // Add artificial delay to simulate calculation process and see pending state
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    totalEstimate,
    breakdown: [
      { name: "Basisaufwand", cost: baseMultiplier },
      { name: "Faktor", cost: scopeDays }
    ],
    tier
  };
}
