import { eq } from 'drizzle-orm';
import { database } from '../database';
import { Task, TaskDetail, TaskInsert, tasks, users } from '../schemas';

export const getTasks = async () => {
  return database
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      completed: tasks.completed,
      userId: tasks.userId,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
      },
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.userId, users.id));
};

export const createTask = async (schema: TaskInsert) => {
  const [task] = await database.insert(tasks).values(schema).returning();
  return task;
};
