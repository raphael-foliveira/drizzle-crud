import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from './schemas/index';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

export const pool = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT || '5432'),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const database = drizzle(pool, {
  schema,
});
