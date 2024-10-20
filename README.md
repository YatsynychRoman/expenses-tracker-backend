# Expenses tracker backend

Backend for expenses tracker app. Written using Deno, using as few third-party libraries as possible.

## Presequities

* Deno
```sh
curl -fsSL https://deno.land/install.sh | sh
```
OR *(for windows)*
```sh
irm https://deno.land/install.ps1 | iex 
```

* PostgreSQL

## Installation

1. Fill in the `.env` file using `.env.example`;
2. Create database with the name you provided in `.env`;
3. Use the built in package manager which comes with Deno!
```bash
deno install
```
4. Run `deno run init-database` to create all the tables inside your DB;

## Usage
Start with 
```bash
deno run dev
```