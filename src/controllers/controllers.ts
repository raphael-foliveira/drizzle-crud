import { eq } from 'drizzle-orm';
import { RouteHandler } from 'fastify';
import { database } from '../database';
import { TaskInsert, UserInsert, tasks, users } from '../schemas';

export const getHome: RouteHandler = async (_, res) => {
  return res.status(200).send({ message: 'hello, world!' });
};
