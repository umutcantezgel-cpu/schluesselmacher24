'use server';

export async function calculateServiceBudget(_prevState: unknown, _formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, timestamp: Date.now() };
}
