import fastify, { FastifyInstance } from 'fastify';
import {
  getHome,
  getTasks,
  createTask,
  getUsers,
  createUser,
} from './controllers';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createTaskSchema, createUserSchema } from './schemas';

export const createApp = async () => {
  const app = fastify({ logger: true });

  await app.register(registerPlugins);
  return app;
};

const tasksRoutes = async (app: FastifyInstance) => {
  app.get('/', getTasks);
  app.post('/', { schema: { body: createTaskSchema } }, createTask);
};

const usersRoutes = async (app: FastifyInstance) => {
  app.get('/', getUsers);
  app.post(
    '/',
    {
      schema: { body: createUserSchema },
    },
    createUser,
  );
};

const homeRoutes = async (app: FastifyInstance) => {
  app.get('/', getHome);
};

const overrideCompilers = async (app: FastifyInstance) => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
};

const registerPlugins = async (app: FastifyInstance) => {
  await overrideCompilers(app);
  await app.register(homeRoutes);
  await app.register(usersRoutes, { prefix: '/users' });
  await app.register(tasksRoutes, { prefix: '/tasks' });
};

const main = async () => {
  const app = await createApp();

  app.listen({ port: 3000 });
};

main();
