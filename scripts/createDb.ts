import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "postgres",
  password: "postgres",
  database: "expense_tracker",
  hostname: "localhost",
  port: 5432,
});
await client.connect();

await client.queryObject(`
  DROP TABLE IF EXISTS expenses;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS users;
`)

// generates users table
await client.queryObject(`
  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
  );
`);

await client.queryObject(`
  CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    user_id INTEGER,
    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id)
  );
`);

// generates expenses table
await client.queryObject(`
  CREATE TABLE expenses(
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id),
    CONSTRAINT fk_category
      FOREIGN KEY(category_id)
      REFERENCES categories(id) 
  );
`);
