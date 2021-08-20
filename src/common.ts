import * as path from 'path';

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