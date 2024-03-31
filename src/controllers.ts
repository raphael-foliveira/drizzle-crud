import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';
import { database } from './database';
import { tasks, users, Task } from './schemas';

const getHome: RouteHandler = async (_, res) => {
  return res.status(200).send({ message: 'hello, world!' });
};

export const homeController = { getHome };

const getTasks: RouteHandler = async (_, res) => {
  const result = await database
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      completed: tasks.completed,
      user: { id: users.id, email: users.email },
    })
    .from(tasks)
    .innerJoin(users, eq(tasks.userId, users.id));

  return res.status(200).send(result);
};

const createTask: RouteHandler<{
  Body: Task;
}> = async (req, res) => {
  const { title, description, userId } = req.body;

  const task = await database
    .insert(tasks)
    .values({ title, description, userId })
    .returning({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      completed: tasks.completed,
    });

  return res.status(201).send(task);
};

export const tasksController = { createTask, getTasks };

const getUsers: RouteHandler = async (_, res) => {
  const result = await database.select().from(users);
  return res.status(200).send(result);
};

const createUser: RouteHandler<{ Body: { email: string } }> = async (
  req,
  res
) => {
  const { email } = req.body;
  const user = await database
    .insert(users)
    .values({ email })
    .returning({ id: users.id, email: users.email });
  return res.status(201).send(user);
};

export const usersController = { createUser, getUsers };
