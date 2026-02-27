import { z } from 'zod';

/**
 * Query schema for listing matches.
 * - limit: optional, coerced positive integer, max 100
 */
export const listMatchesQuerySchema = z.object({
  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

/**
 * Constant containing match status values in lowercase.
 */
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

/**
 * Path parameter schema for match ID.
 */
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Schema describing payload for creating a match.
 */
export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),
    startTime: z.string(),
    endTime: z.string(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .refine((data) => !isNaN(Date.parse(data.startTime)), {
    message: 'startTime must be a valid ISO date string',
    path: ['startTime'],
  })
  .refine((data) => !isNaN(Date.parse(data.endTime)), {
    message: 'endTime must be a valid ISO date string',
    path: ['endTime'],
  })
  .superRefine((data, ctx) => {
    const start = Date.parse(data.startTime);
    const end = Date.parse(data.endTime);
    if (!isNaN(start) && !isNaN(end) && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endTime must be after startTime',
        path: ['endTime'],
      });
    }
  });

/**
 * Schema for updating a match score.
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
