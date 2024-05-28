import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';
import { database } from './database';
import { TaskInsert, UserInsert, tasks, users } from './schemas';

export const getHome: RouteHandler = async (_, res) => {
  return res.status(200).send({ message: 'hello, world!' });
};

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

export const getUsers: RouteHandler = async (_, res) => {
  const result = await database
    .select()
    .from(users)
    .leftJoin(tasks, eq(users.id, tasks.userId));

  const usersResult = result.reduce<Record<string, any>>((acc, row) => {
    if (!acc[row.users.id]) {
      acc[row.users.id] = { ...row.users, tasks: [] };
    }
    acc[row.users.id].tasks.push(row.tasks);
    return acc;
  }, {});
  return res.status(200).send(Object.values(usersResult));
};

export const createUser: RouteHandler<{ Body: UserInsert }> = async (
  { body },
  res,
) => {
  const [user] = await database
    .insert(users)
    .values(body)
    .returning({ id: users.id, email: users.email });
  return res.status(201).send(user);
};
