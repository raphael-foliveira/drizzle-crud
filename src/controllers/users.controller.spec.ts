import { faker } from '@faker-js/faker';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { database } from '../database';
import { createApp } from '../main';
import {
  User,
  createUserSchema,
  users,
  createTaskSchema,
  tasks,
  Task,
} from '../schemas';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('users', () => {
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
      }),
    );

    taskItems = await database.insert(tasks).values(tasksToCreate).returning();
    app = await createApp();
  });

  afterEach(async () => {
    await database.delete(users);
    await database.delete(tasks);
  });
  it('should create an user', async () => {
    const payload: z.infer<typeof createUserSchema> = {
      email: faker.internet.email(),
    };

    const response = await app.inject({
      path: '/users',
      method: 'POST',
      body: payload,
    });

    const responseJson = await response.json();

    expect(responseJson.email).toBe(payload.email);
    expect(response.statusCode).toBe(201);
  });

  it('should find all users', async () => {
    const response = await app.inject({ path: '/users', method: 'GET' });

    const responseJson = await response.json();

    expect(response.statusCode).toBe(200);
    expect(responseJson.length).toBe(userItems.length);
  });
});
