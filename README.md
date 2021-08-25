# pgv

PostgreSQL migrations.

# Usage

## Installation

    $ npm install -g pgv

pgv is now available via:

    $ pgv

## Configuration

## Commands

### Creating Migration Files

    $ pgv migration:new <name>

Creates a new migration file in `./database/migration/`
Migration files contain a timestamp followed by the name provided
as an argument. E.g:

    $ pgv migration:new test

Will generate a file `/database/migration/202171923910_test.sql`

### Running Migrations

    $ pgv migration:run

This command will run all pending migration files following the
timestamp order.

### Clearing the Database

    $ pgv migration:clear

`migration:clear` will remove the public schema and recreate it.
Deleting all tables, triggers, functions etc.
This command should not be used in production or all data
stored in the database will be lost.


### Refreshing the Database

    $ pgv migration:refresh

This is a shortcut to `migration:clear` followed by
`migration:run`. It will clear the database and then
rerun all migrations.

### Creating Seed files

Seed files are useful to store testing data. They
are created with the following command:

    $ pgv seed:new <name>

This will a new seed file in `./database/seed/`
Seed files, like migration files, contain a timestamp followed by
the name provided as an argument. E.g:

    $ pgv seed:new test

Will generate a file `/database/seed/202171923910_test.sql`

### Running Seed files

    $ pgv seed:run

Will run all pending seeds in chronological order, just like
`migration:run` runs migrations.

### Shortcut: run

    $ pgv run

This command is a shortcut that will call `migration:run` then `seed:run`.

### Shortcut: clear

    $ pgv clear

This command is a shorter form of `migration:clear`.

### Shortcut: refresh

This command is a shortcut that is equivalent to calling
`migration:refresh` then `seed:run`.


# TODO
- [ ] Better help
- [ ] Better messages
- [ ] More colors?