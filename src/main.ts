import fastify from 'fastify';
import {
  homeController,
  tasksController,
  usersController,
} from './controllers';

const app = fastify({ logger: true });

const registerPlugins = async () => {
  await app.register(async (app) => {
    app.get('/', homeController.getHome);
    app.get('/tasks', tasksController.getTasks);
    app.post('/tasks', tasksController.createTask);
    app.get('/users', usersController.getUsers);
    app.post('/users', usersController.createUser);
  });
  console.log(app.printRoutes());
};

const main = async () => {
  await registerPlugins();
  app.listen({ port: 3000 });
};

main();
