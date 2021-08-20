import * as dotenv from 'dotenv';
import * as path from 'path';
import { Command } from 'commander';
import * as migration from './migration';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const program = new Command();
program.version('0.0.1');

program.command('migration:new <name>').action(migration.create);
program.command('migration:run').action(migration.run);
program.command('migration:clear').action(migration.clear);
program.command('migration:refresh').action(migration.refresh);
program.command('seed:new <name>');
program.command('seed:run');
program.command('run');
program.command('clear');
program.command('refresh');

program.parse(process.argv);

// TODO: Implement run, clear and refresh
// TODO: Better help
// TODO: Make it more colorful?
