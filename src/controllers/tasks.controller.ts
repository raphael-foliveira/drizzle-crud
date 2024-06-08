import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';
import { database } from '../database';
import { tasks, users, TaskInsert } from '../schemas';

export const getTasks: RouteHandler = async (_, res) => {
  const result = await database
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      completed: tasks.completed,
      user: { id: users.id, email: users.email, name: users.name },
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.userId, users.id));

  return res.status(200).send(result);
};

export const createTask: RouteHandler<{
  Body: TaskInsert;
}> = async ({ body }, res) => {
  const [task] = await database.insert(tasks).values(body).returning({
    id: tasks.id,
    title: tasks.title,
    description: tasks.description,
    completed: tasks.completed,
  });

  return res.status(201).send(task);
};
