'use server';

export type SystemAnalyticsResult = {
  status: 'IDLE' | 'ANALYZING' | 'SUCCESS' | 'ERROR';
  data?: {
    memoryUsage: string;
    cpuLoad: string;
    uptime: string;
    activeSessions: number;
    securityScore: number;
    lastAudit: string;
  };
  message?: string;
};

export async function fetchSystemAnalytics(
  prevState: SystemAnalyticsResult,
  formData: FormData
): Promise<SystemAnalyticsResult> {
  // Simulate an async data fetch
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    status: 'SUCCESS',
    data: {
      memoryUsage: '42.3 MB',
      cpuLoad: '12%',
      uptime: '15d 4h 23m',
      activeSessions: 3,
      securityScore: 98,
      lastAudit: new Date().toISOString().split('T')[0],
    },
    message: 'Systemanalyse erfolgreich aktualisiert.',
  };
}
