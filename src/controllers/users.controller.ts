import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';
import { database } from '../database';
import { users, tasks, UserInsert } from '../schemas';

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
