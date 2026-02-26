import {
  pgEnum,
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  jsonb,
  text,
} from 'drizzle-orm/pg-core';

/**
 * Enum for match status
 * Represents the different states a match can be in during its lifecycle
 */
export const matchStatusEnum = pgEnum('match_status', [
  'scheduled',
  'live',
  'finished',
]);

/**
 * Matches table
 * Stores information about sports matches including team details, scores, and timing
 */
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: varchar('sport').notNull(),
  homeTeam: varchar('home_team').notNull(),
  awayTeam: varchar('away_team').notNull(),
  status: matchStatusEnum('status').notNull().default('scheduled'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Commentary table
 * Stores real-time events and commentary for matches with detailed metadata
 * Supports structured event tracking with minute, period, and sequencing
 */
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  minute: integer('minute'),
  sequence: integer('sequence'),
  period: varchar('period'),
  eventType: varchar('event_type'),
  actor: varchar('actor'),
  team: varchar('team'),
  message: text('message'),
  metadata: jsonb('metadata'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
