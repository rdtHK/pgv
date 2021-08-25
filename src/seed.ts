import { createChangeFile, runChanges, SEED_DIR } from './common';

export async function create(name: string) {
  return await createChangeFile(SEED_DIR, name, 'seed');
}

export async function run() {
  return await runChanges(SEED_DIR, '_pgv_seed', 'seeds');
}
