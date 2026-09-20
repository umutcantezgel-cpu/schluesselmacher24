import { z } from 'zod';

export const securityCheckSchema = z.object({
  doorType: z.enum(['WOHNUNG', 'HAUSTUER', 'GEWERBE']),
  lockType: z.enum(['EINFACH', 'MEHRFACH', 'ELEKTRONISCH']),
  urgency: z.enum(['STANDARD', 'HOCH']),
});

export type SecurityCheckInput = z.infer<typeof securityCheckSchema>;
