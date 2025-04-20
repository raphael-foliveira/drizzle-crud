import { faker } from '@faker-js/faker';
import { z } from 'zod';
import {
  Task,
  User,
  createTaskSchema,
  createUserSchema,
  tasks,
  users,
} from '../src/schemas';
import { FastifyInstance } from 'fastify';
import { database } from '../src/database';
import { createApp } from '../src/app';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('TasksController', () => {
  let userItems: User[];
  let taskItems: Task[];
  let app: FastifyInstance;

  beforeEach(async () => {
    const usersToCreate: z.infer<typeof createUserSchema>[] = [];

    for (let i = 0; i < 10; i++) {
      usersToCreate.push({ email: faker.internet.email() });
    }
    userItems = await database.insert(users).values(usersToCreate).returning();
    const tasksToCreate: z.infer<typeof createTaskSchema>[] = [];

    userItems.forEach(({ id }) =>
      tasksToCreate.push({
        title: faker.lorem.word(),
        userId: id,
        completed: false,
      })
    );

    taskItems = await database.insert(tasks).values(tasksToCreate).returning();
    app = await createApp();
  });

  afterEach(async () => {
    await database.delete(tasks);
    await database.delete(users);
    await app.close();
  });

  it('should create a task', async () => {
    const payload: z.infer<typeof createTaskSchema> = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      userId: userItems[0].id,
      completed: false,
    };

    const response = await app.inject({
      path: '/tasks',
      method: 'POST',
      body: payload,
    });

    const responseJson = await response.json();

    expect(response.statusCode).toBe(201);
    expect(responseJson.title).toBe(payload.title);
  });

  it('should get all tasks', async () => {
    const response = await app.inject({ path: '/tasks', method: 'GET' });

    const responseJson = await response.json();

    expect(response.statusCode).toBe(200);
    expect(responseJson.length).toBe(taskItems.length);
  });
});
