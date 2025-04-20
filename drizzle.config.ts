import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: 'src/schemas/*.ts',
  out: 'migrations',
  dialect: 'postgresql',
  dbCredentials: {
    ssl: false,
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
} satisfies Config;
