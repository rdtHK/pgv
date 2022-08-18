import ora from 'ora';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Client } from 'pg';

export const DB_DIR = path.join(process.cwd(), 'database');
export const MIGRATION_DIR = path.join(DB_DIR, 'migration');
export const SEED_DIR = path.join(DB_DIR, 'seed');

export function nameWithTimestamp(name: string) {
  const date = new Date();

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  return `${year}${month}${day}${hour}${minute}${second}_${name}.sql`;
}

export function compareFileTimestamp(f1: string, f2: string) {
  const [ts1] = f1.split('_', 2);
  const [ts2] = f2.split('_', 2);

  return parseInt(ts1) - parseInt(ts2);
}

export async function initDb(client: Client, table: string) {
  try {
    await client.query('BEGIN');

    const ddl = `
      CREATE TABLE IF NOT EXISTS ${table} (
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

export async function runChanges(dir: string, table: string, label: string) {
  const client = new Client();
  let spinner;
  try {
    console.log(`Running ${label}...`);

    // Open the connection
    await client.connect();

    // Initialize the database (if needed)
    await initDb(client, table);

    // List all files in the migration directory
    const dirFilenames = await fs.readdir(dir);

    // Sort them by timestamp
    dirFilenames.sort(compareFileTimestamp);

    // Query the migration table for files that are in that list
    let sql = `
      SELECT file
      FROM ${table}
      WHERE
        file = ANY ($1)
    `;
    const result = await client.query(sql, [dirFilenames]);

    // Turn the result into a set for quick access
    const dbFilenames: Set<string> = new Set(result.rows.map((row) => row.file));

    // Loop through files and, if they are not in the table, run the sql file
    for (let filename of dirFilenames) {
      if (!dbFilenames.has(filename)) {
        spinner = ora(filename).start();

        const fileFullPath: string = path.join(dir, filename);
        const fileSql: string = (await fs.readFile(fileFullPath)).toString();

        await client.query(fileSql);

        let sql = `INSERT INTO ${table}(file) VALUES($1)`;
        await client.query(sql, [filename]);

        spinner.stopAndPersist({
          symbol: '✔️',
        });
      }
    }
  } catch (error: any) {
    // If the changes directory does not exist, just returns.
    if (error.code === 'ENOENT') {
      return;
    }

    if (spinner) {
      spinner.stopAndPersist({
        symbol: '❌',
      });
    }
    console.error(`Error running ${label}: `);
    console.error(error);
  } finally {
    // Close the connection
    await client.end();
  }
}

export async function createChangeFile(dir: string, name: string, label: string) {
  await fs.mkdir(dir, { recursive: true });

  const fullName = nameWithTimestamp(name);
  const fullPath = path.join(dir, fullName);

  await fs.writeFile(fullPath, '', {
    flag: 'wx',
  });

  console.log(`New ${label} file created at '${fullPath}'`);
}
