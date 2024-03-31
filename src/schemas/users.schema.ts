import { serial, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull().unique(),
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
