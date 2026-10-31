# Sequelize with MySQL

## Prerequisites

- Node.js 18 or newer
- MySQL Server running locally

## Run locally

1. Create a MySQL database:

   ```sql
   CREATE DATABASE sequelize_demo;
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Copy `.env.example` to `.env` and set the MySQL password and connection
   values.

4. Start the API:

   ```powershell
   npm start
   ```

The application creates the `Users`, `Buses`, `Bookings`, and `Payments` tables,
then inserts three users and two buses with Sequelize's `create()` method.
Seeding is idempotent, so restarting the app does not create duplicates.

## API endpoints

The server listens on `http://localhost:3000` by default. Set `PORT` in `.env`
to use another port.

### Users

- `POST /users` creates a user. Example body:

  ```json
  {
    "name": "Katherine Johnson",
    "email": "katherine.johnson@example.com"
  }
  ```

- `GET /users` retrieves all users.

### Buses

- `POST /buses` creates a bus. Example body:

  ```json
  {
    "busNumber": "BUS-303",
    "totalSeats": 50,
    "availableSeats": 35
  }
  ```

- `GET /buses/available/:seats` retrieves buses whose available seats are
  greater than the route parameter. For example,
  `GET /buses/available/10` returns buses with more than 10 available seats.

All models are exported from `src/models.js` and intentionally do not define
associations in this phase.
