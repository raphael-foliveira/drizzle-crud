import { RouteHandler } from 'fastify';
import { tasksRepository } from '../repositories';
import { TaskInsert } from '../schemas';

export const getTasks: RouteHandler = async (_, res) => {
  const result = await tasksRepository.getTasks();
  return res.status(200).send(result);
};

export const createTask: RouteHandler<{
  Body: TaskInsert;
}> = async ({ body }, res) => {
  const task = await tasksRepository.createTask(body);
  return res.status(201).send(task);
};
