import { eq } from 'drizzle-orm';
import { database } from '../database';
import { User, UserDetail, UserInsert, tasks, users } from '../schemas';

export const getUsers = async (): Promise<UserDetail[]> => {
  const result = await database
    .select()
    .from(users)
    .leftJoin(tasks, eq(users.id, tasks.userId));

  const reduced = result.reduce<Record<number, UserDetail>>((acc, row) => {
    if (!acc[row.users.id]) {
      acc[row.users.id] = { ...row.users, tasks: [] };
    }
    if (row.tasks) {
      acc[row.users.id].tasks.push(row.tasks);
    }
    return acc;
  }, {});

  const usersResult: UserDetail[] = [];

  for (const key in reduced) {
    usersResult.push(reduced[key]);
  }

  return usersResult;
};

export const createUser = async (schema: UserInsert): Promise<User> => {
  const [user] = await database.insert(users).values(schema).returning();
  return user;
};
