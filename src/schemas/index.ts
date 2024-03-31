import { tasks, tasksRelations } from './tasks.schema';
import { users, usersRelations } from './users.schema';

export const schema = { users, tasks, usersRelations, tasksRelations };

export * from './tasks.schema';
export * from './users.schema';
