import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: 'src/schemas/*.ts',
  out: 'migrations',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
} satisfies Config;
