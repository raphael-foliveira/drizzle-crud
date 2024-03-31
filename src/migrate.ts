import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { database, pool } from './database';

const runMigrations = async () => {
  console.log('Running migrations...');
  try {
    await migrate(database, { migrationsFolder: 'migrations' });
  } finally {
    await pool.end();
    console.log('Done');
  }
};

runMigrations();
