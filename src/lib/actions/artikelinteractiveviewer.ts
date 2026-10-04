'use server';

export type ViewerState = {
  views: number;
  lastViewed: string | null;
  status: 'IDLE' | 'VIEWING' | 'ERROR';
  message: string;
};

export async function trackArtikelView(
  prevState: ViewerState,
  formData: FormData
): Promise<ViewerState> {
  const articleId = formData.get('articleId');

  if (!articleId || typeof articleId !== 'string') {
    return {
      ...prevState,
      status: 'ERROR',
      message: 'Invalid article ID provided.',
    };
  }

  // Simulate server delay and view recording
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    views: prevState.views + 1,
    lastViewed: new Date().toISOString(),
    status: 'VIEWING',
    message: 'Aufruf erfolgreich registriert.',
  };
}
