# mini-sql-engine

A lightweight SQL engine for querying in-memory JSON datasets.

## Run it

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Enter one query per line at the `sql>` prompt. Results are displayed as a table. Type `exit` or `quit` to close the program.

## Examples

Sort users by age and return the two oldest users aged 25 or more:

```sql
SELECT name, age FROM users WHERE age >= 25 ORDER BY age DESC LIMIT 2;
```

Result:

| name | age |
| --- | ---: |
| Charlie | 35 |
| Diana | 31 |

Filter by a string value, sort ascending, and return one row:

```sql
SELECT name FROM users WHERE role = 'developer' ORDER BY age ASC LIMIT 1;
```

Result: `Bob`

Use `<>` to select users whose role is not `developer`:

```sql
SELECT name, role FROM users WHERE role <> 'developer';
```

Result:

| name | role |
| --- | --- |
| Alice | admin |
| Diana | designer |
| Eve | intern |

The sample `users` dataset is defined in `src/data.ts`.

## Supported SQL

```sql
SELECT * | column [, column ...]
FROM table
[WHERE column comparison_operator value]
[ORDER BY column [ASC | DESC]]
[LIMIT number];
```

Comparison operators: `=`, `!=`, `<>`, `<`, `<=`, `>`, `>=`. The current version supports one `WHERE` condition per query.

## Development commands

```bash
npm test           # run the tokenizer, parser, and execution tests
npm run typecheck  # check TypeScript types
npm run build      # compile to dist/
```
