import { RouteHandler } from 'fastify';

export const getHome: RouteHandler = async (_, res) => {
  return res.status(200).send({ message: 'hello, world!' });
};
