import fastify, { FastifyInstance } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import {
  homeController,
  tasksController,
  usersController,
} from './controllers';
import { createTaskSchema, createUserSchema } from './schemas';
import { randomPostSchema } from './controllers/controllers';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export const createApp = async () => {
  const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  app.setErrorHandler((error, _, res) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return res.status(422).send({
        error: 'Validation error',
        details: error.validation.map((validation) => {
          const { code, message, ...rest } = validation.params.issue;
          return rest;
        }),
      });
    }

    if (isResponseSerializationError(error)) {
      app.log.error({ error }, 'RESPONSE VALIDATION ERROR');
      return res.code(500).send({
        error: 'Internal Server Error',
        details: {
          issues: error.cause.issues,
          method: error.method,
          url: error.url,
        },
      });
    }
    throw error;
  });
  await app.register(plugins);
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
  app.post(
    '/',
    { schema: { body: randomPostSchema } },
    homeController.randomPost
  );
};

const overrideCompilers = async (app: FastifyInstance) => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
};

const plugins = async (app: FastifyInstance) => {
  await overrideCompilers(app);
  await app.register(swagger, {
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });
  await app.register(homeRoutes);
  await app.register(usersRoutes, { prefix: '/users' });
  await app.register(tasksRoutes, { prefix: '/tasks' });
};
