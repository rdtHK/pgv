import * as dotenv from 'dotenv';
import * as path from 'path';
import { Command } from 'commander';
import * as migration from './migration';
import * as seed from './seed';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const program = new Command();
program.version('0.0.1');

program.command('migration:new <name>').action(migration.create);
program.command('migration:run').action(migration.run);
program.command('migration:clear').action(migration.clear);
program.command('migration:refresh').action(migration.refresh);
program.command('seed:new <name>').action(seed.create);
program.command('seed:run').action(seed.run);
program.command('run').action(async () => {
  await migration.run();
  await seed.run();
});
program.command('clear').action(migration.clear);
program.command('refresh').action(async () => {
  await migration.clear();
  await migration.run();
  await seed.run();
});

program.parseAsync(process.argv);
