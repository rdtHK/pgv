import ora from 'ora';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import { compareFileTimestamp, MIGRATION_DIR, nameWithTimestamp } from './common';

export async function create(name: string) {
  await fs.mkdir(MIGRATION_DIR, { recursive: true });

  const fullName = nameWithTimestamp(name);
  const fullPath = path.join(MIGRATION_DIR, fullName);

  await fs.writeFile(fullPath, '', {
    flag: 'wx',
  });

  console.log(`New migration file created at '${fullPath}'`);
}

export async function initDb(client: Client) {
  try {
    await client.query('BEGIN');

    const ddl = `
      CREATE TABLE IF NOT EXISTS _pgv_migration (
        id SERIAL NOT NULL PRIMARY KEY,
        file TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(ddl);

    await client.query('END');
  } catch (error) {
    await client.query('ROLLBACK');
  }
}

export async function run() {
  const client = new Client();
  let spinner;
  try {
    console.log('Running migrations...');

    // Open the connection
    await client.connect();

    // Initialize the database (if needed)
    await initDb(client);

    // List all files in the migration directory
    const files = await fs.readdir(MIGRATION_DIR);

    // Sort them by timestamp
    files.sort(compareFileTimestamp);

    // Query the migration table for files that are in that list
    let sql = `
      SELECT file
      FROM _pgv_migration
      WHERE
        file = ANY ($1)
    `;
    const result = await client.query(sql, [files]);

    // Turn the result into a set for quick access
    const migratedFiles: Set<string> = new Set(result.rows.map((row) => row.file));

    // Loop through files and, if they are not in the table, run the sql file
    for (let file of files) {
      if (!migratedFiles.has(file)) {
        spinner = ora(file).start();

        const migrationPath: string = path.join(MIGRATION_DIR, file);
        const migrationSql: string = (await fs.readFile(migrationPath)).toString();

        await client.query(migrationSql);

        let sql = `INSERT INTO _pgv_migration(file) VALUES($1)`;
        await client.query(sql, [file]);

        spinner.stopAndPersist({
          symbol: '✔️',
        });
      }
    }
  } catch (error) {
    if (spinner) {
      spinner.stopAndPersist({
        symbol: '❌',
      });
    }
    console.error('Error running migrations: ');
    console.error(error);
  } finally {
    // Close the connection
    await client.end();
  }
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
