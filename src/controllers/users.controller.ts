import { RouteHandler } from 'fastify';
import { usersRepository } from '../repositories';
import { UserInsert } from '../schemas';

export const getUsers: RouteHandler = async (_, res) => {
  const result = await usersRepository.getUsers();
  return res.status(200).send(result);
};

export const createUser: RouteHandler<{ Body: UserInsert }> = async (
  { body },
  res
) => {
  const user = await usersRepository.createUser(body);
  return res.status(201).send(user);
};
