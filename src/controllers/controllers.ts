import { RouteHandler } from 'fastify';
import { z } from 'zod';

export const getHome: RouteHandler = async (_, res) => {
  return res.status(200).send({
    message: 'Hello, world!',
  });
};

export const randomPostSchema = z.object({
  hello: z.object({
    world: z.string(),
  }),
});

export type RandomPostSchema = z.infer<typeof randomPostSchema>;

export const randomPost: RouteHandler<{ Body: RandomPostSchema }> = async (
  { body },
  res,
) => {
  return res.status(200).send(body);
};
