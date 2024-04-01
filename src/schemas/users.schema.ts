import { relations } from 'drizzle-orm';
import { serial, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { tasks } from './tasks.schema';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  name: varchar('name').notNull().default('UNKNOWN'),
});

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => {
  return {
    tasks: many(tasks),
  };
});
