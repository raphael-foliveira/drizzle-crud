import { serial, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { pgTable, integer } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  description: varchar('description').notNull().default(''),
  completed: boolean('completed').notNull().default(false),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Task = typeof tasks.$inferSelect;
export type TaskInsert = typeof tasks.$inferInsert;

export const tasksRelations = relations(tasks, ({ one }) => {
  return {
    user: one(users, {
      fields: [tasks.userId],
      references: [users.id],
    }),
  };
});

export const createTaskSchema = z.object({
  title: z.string(),
  userId: z.number(),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});
