import fastify, { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createTaskSchema, createUserSchema } from './schemas';
import {
  homeController,
  tasksController,
  usersController,
} from './controllers';

export const createApp = async () => {
  const app = fastify({ logger: true });

  await app.register(registerPlugins);
  return app;
};

const tasksRoutes = async (app: FastifyInstance) => {
  app.get('/', tasksController.getTasks);
  app.post(
    '/',
    { schema: { body: createTaskSchema } },
    tasksController.createTask
  );
};

const usersRoutes = async (app: FastifyInstance) => {
  app.get('/', usersController.getUsers);
  app.post(
    '/',
    {
      schema: { body: createUserSchema },
    },
    usersController.createUser
  );
};

const homeRoutes = async (app: FastifyInstance) => {
  app.get('/', homeController.getHome);
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
