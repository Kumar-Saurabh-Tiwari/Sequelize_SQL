const { DataTypes, Sequelize } = require("sequelize");

const requiredEnvironmentVariables = ["DB_NAME", "DB_USER", "DB_PASSWORD"];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (variableName) => !process.env[variableName]
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`
  );
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  },
  { tableName: "Users", timestamps: false }
);

const Bus = sequelize.define(
  "Bus",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    busNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    totalSeats: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: 1 },
    },
    availableSeats: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: 0 },
    },
  },
  { tableName: "Buses", timestamps: false }
);

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "user_id" },
    busId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "bus_id" },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "booking_date",
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { tableName: "Bookings", timestamps: false }
);

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "booking_id",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "payment_date",
    },
  },
  { tableName: "Payments", timestamps: false }
);

module.exports = { sequelize, User, Bus, Booking, Payment };
