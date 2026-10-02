'use server';

export async function submitKinetikSimulation(state: unknown, formData: FormData) {
  // Simuliert eine asynchrone Server-Verarbeitung
  await new Promise((resolve) => setTimeout(resolve, 800));

  const complexity = Number(formData.get('complexity') || 0);

  return {
    success: true,
    score: complexity * 10 + Math.floor(Math.random() * 5),
    message: "Kinetische Simulation abgeschlossen."
  };
}
