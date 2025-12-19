import { z } from 'zod';
import { insertAnalysisSchema, analyses, analysisResultSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  analyze: {
    submit: {
      method: 'POST' as const,
      path: '/api/analyze',
      input: insertAnalysisSchema,
      responses: {
        200: z.object({
          id: z.number(),
          atsScore: z.number(),
          analysisResult: analysisResultSchema,
          createdAt: z.string().optional() // timestamp comes as string from JSON
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal
      },
    },
    list: {
        method: 'GET' as const,
        path: '/api/history',
        responses: {
            200: z.array(z.custom<typeof analyses.$inferSelect>())
        }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
