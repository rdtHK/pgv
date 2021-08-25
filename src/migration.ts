import { Client } from 'pg';
import { createChangeFile, MIGRATION_DIR, runChanges } from './common';

export async function create(name: string) {
  return await createChangeFile(MIGRATION_DIR, name, 'migration');
}

export async function run() {
  return await runChanges(MIGRATION_DIR, '_pgv_migration', 'migrations');
}

export async function clear() {
  const client = new Client();
  try {
    console.log('Cleaning up db...');

    // Open the connection
    await client.connect();

    const sql = `
    DROP SCHEMA public CASCADE;

    CREATE SCHEMA public
      AUTHORIZATION postgres;

    GRANT ALL ON SCHEMA public TO postgres;
    GRANT ALL ON SCHEMA public TO public;
    COMMENT ON SCHEMA public
      IS 'standard public schema';
    `;
    await client.query(sql);
  } catch (error) {
    console.error('Error while clearing the database: ');
    console.error(error);
  } finally {
    await client.end();
  }
}

export async function refresh() {
  await clear();
  await run();
}
