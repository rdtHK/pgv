import ora from 'ora';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import { compareFileTimestamp, nameWithTimestamp, SEED_DIR } from './common';

export async function create(name: string) {
  await fs.mkdir(SEED_DIR, { recursive: true });

  const fullName = nameWithTimestamp(name);
  const fullPath = path.join(SEED_DIR, fullName);

  await fs.writeFile(fullPath, '', {
    flag: 'wx',
  });

  console.log(`New seed file created at '${fullPath}'`);
}

export async function initDb(client: Client) {
  try {
    await client.query('BEGIN');

    const ddl = `
      CREATE TABLE IF NOT EXISTS _pgv_seed (
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
    console.log('Running seeds...');

    // Open the connection
    await client.connect();

    // Initialize the database (if needed)
    await initDb(client);

    // List all files in the migration directory
    const files = await fs.readdir(SEED_DIR);

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
    const seededFiles: Set<string> = new Set(result.rows.map((row) => row.file));

    // Loop through files and, if they are not in the table, run the sql file
    for (let file of files) {
      if (!seededFiles.has(file)) {
        spinner = ora(file).start();

        const seedPath: string = path.join(SEED_DIR, file);
        const seedSql: string = (await fs.readFile(seedPath)).toString();

        await client.query(seedSql);

        let sql = `INSERT INTO _pgv_seed(file) VALUES($1)`;
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
    console.error('Error running seeds: ');
    console.error(error);
  } finally {
    // Close the connection
    await client.end();
  }
}
