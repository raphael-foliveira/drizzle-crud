import fastify from 'fastify';
import {
  getHome,
  getTasks,
  createTask,
  getUsers,
  createUser,
} from './controllers';

const app = fastify({ logger: true });

const registerPlugins = async () => {
  await app.register(async (app) => {
    app.get('/', getHome);
    app.get('/tasks', getTasks);
    app.post('/tasks', createTask);
    app.get('/users', getUsers);
    app.post('/users', createUser);
  });
  console.log(app.printRoutes());
};

const main = async () => {
  await registerPlugins();
  app.listen({ port: 3000 });
};

main();
