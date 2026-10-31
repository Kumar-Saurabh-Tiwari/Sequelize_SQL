require("dotenv").config();

const express = require("express");
const { Op } = require("sequelize");
const { sequelize, User, Bus, Booking, Payment } = require("./models");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.post("/users", async (request, response, next) => {
  try {
    const user = await User.create(request.body);
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.get("/users", async (request, response, next) => {
  try {
    const users = await User.findAll({ order: [["id", "ASC"]] });
    response.json(users);
  } catch (error) {
    next(error);
  }
});

app.post("/buses", async (request, response, next) => {
  try {
    const bus = await Bus.create(request.body);
    response.status(201).json(bus);
  } catch (error) {
    next(error);
  }
});

app.post("/bookings", async (request, response, next) => {
  try {
    const booking = await Booking.create(request.body);
    response.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id/bookings", async (request, response, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: request.params.id },
      include: [{ model: Bus, as: "bus", attributes: ["busNumber"] }],
      order: [["id", "ASC"]],
      attributes: ["id", "seatNumber"],
    });
    response.json(bookings);
  } catch (error) {
    next(error);
  }
});

app.get("/buses/:id/bookings", async (request, response, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { busId: request.params.id },
      include: [{ model: User, as: "user", attributes: ["name", "email"] }],
      order: [["id", "ASC"]],
      attributes: ["id", "seatNumber"],
    });
    response.json(bookings);
  } catch (error) {
    next(error);
  }
});

app.get("/buses/available/:seats", async (request, response, next) => {
  const seats = Number(request.params.seats);
  if (!Number.isInteger(seats) || seats < 0) {
    response.status(400).json({ error: "seats must be a non-negative integer" });
    return;
  }

  try {
    const buses = await Bus.findAll({
      where: { availableSeats: { [Op.gt]: seats } },
      order: [["id", "ASC"]],
    });
    response.json(buses);
  } catch (error) {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
    response.status(400).json({ error: error.errors.map((item) => item.message) });
    return;
  }
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

async function seedData() {
  const users = [
    { name: "Ada Lovelace", email: "ada.lovelace@example.com" },
    { name: "Grace Hopper", email: "grace.hopper@example.com" },
    { name: "Alan Turing", email: "alan.turing@example.com" },
  ];
  const buses = [
    { busNumber: "BUS-101", totalSeats: 40, availableSeats: 25 },
    { busNumber: "BUS-202", totalSeats: 30, availableSeats: 8 },
  ];

  for (const user of users) {
    const existingUser = await User.findOne({ where: { email: user.email } });
    if (!existingUser) {
      await User.create(user);
    }
  }
  for (const bus of buses) {
    const existingBus = await Bus.findOne({ where: { busNumber: bus.busNumber } });
    if (!existingBus) {
      await Bus.create(bus);
    }
  }

  const seededBookings = [
    { userEmail: "ada.lovelace@example.com", busNumber: "BUS-101", seatNumber: 1 },
    { userEmail: "grace.hopper@example.com", busNumber: "BUS-202", seatNumber: 1 },
  ];
  for (const booking of seededBookings) {
    const user = await User.findOne({ where: { email: booking.userEmail } });
    const bus = await Bus.findOne({ where: { busNumber: booking.busNumber } });
    const existingBooking = await Booking.findOne({
      where: { userId: user.id, busId: bus.id, seatNumber: booking.seatNumber },
    });
    if (!existingBooking) {
      await Booking.create({
        userId: user.id,
        busId: bus.id,
        seatNumber: booking.seatNumber,
      });
    }
  }
}

async function start() {
  await sequelize.authenticate();
  await Promise.all([User.sync(), Bus.sync()]);
  await Booking.sync({ alter: true });
  await Payment.sync();
  await seedData();

  const users = await User.findAll({ order: [["id", "ASC"]] });
  const availableBuses = await Bus.findAll({
    where: { availableSeats: { [Op.gt]: 10 } },
    order: [["id", "ASC"]],
  });
  console.log(`Loaded ${users.length} users.`);
  console.log(`Found ${availableBuses.length} buses with more than 10 available seats.`);

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Unable to initialize the Sequelize application.");
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, sequelize, User, Bus, Booking, Payment, start };
