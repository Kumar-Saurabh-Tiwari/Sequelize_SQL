# Sequelize with MySQL

## Prerequisites

- Node.js 18 or newer
- MySQL Server running locally
- MySQL Workbench (optional, for verification)

## Run locally

1. Create a MySQL database:

   ```sql
   CREATE DATABASE sequelize_demo;
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Copy `.env.example` to `.env` and set your MySQL password and, if needed, the
   database name, user, host, or port.

   ```powershell
   Copy-Item .env.example .env
   ```

4. Create the table:

   ```powershell
   npm start
   ```

   Sequelize authenticates the connection and creates the `Users` table if it
   does not already exist. The table contains `id`, `name`, `email`,
   `createdAt`, and `updatedAt` columns.

## Verify in MySQL Workbench

Refresh the **Schemas** panel, expand `sequelize_demo` (or the database named
in `.env`), and open **Tables**. The `Users` table should be present. You can
also run:

```sql
USE sequelize_demo;
SHOW TABLES;
DESCRIBE Users;
```
