'use server';

export async function calculateSecurityScore(prevState: unknown, formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let score = 0;

  const doorLock = formData.get('doorLock');
  if (doorLock === 'high') score += 30;
  if (doorLock === 'medium') score += 15;

  const alarm = formData.get('alarm');
  if (alarm === 'yes') score += 30;

  const video = formData.get('video');
  if (video === 'yes') score += 20;

  const access = formData.get('access');
  if (access === 'electronic') score += 20;

  let recommendation = '';
  let level = 'STANDARD';

  if (score >= 80) {
    recommendation = 'Ihre Sicherheitsinfrastruktur ist auf einem exzellenten Niveau. Wir empfehlen regelmäßige Wartungsintervalle, um dieses Niveau zu halten.';
    level = 'HIGH';
  } else if (score >= 50) {
    recommendation = 'Guter Grundschutz vorhanden. Durch gezielte Upgrades in der Alarm- oder Videotechnik lässt sich die Sicherheit deutlich erhöhen.';
    level = 'MEDIUM';
  } else {
    recommendation = 'Ihr Objekt weist signifikante Sicherheitslücken auf. Wir empfehlen dringend eine umfassende Sicherheitsanalyse vor Ort.';
    level = 'LOW';
  }

  return {
    score,
    recommendation,
    level
  };
}
