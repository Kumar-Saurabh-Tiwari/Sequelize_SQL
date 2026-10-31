require("dotenv").config();

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
    logging: console.log,
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
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

async function main() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection established.");

    await User.sync();
    console.log('The "Users" table is ready.');

    const [user, created] = await User.findOrCreate({
      where: { email: "ada.lovelace@example.com" },
      defaults: { name: "Ada Lovelace" },
    });
    console.log(
      created
        ? `Inserted user: ${user.name} (${user.email}).`
        : `User already exists: ${user.name} (${user.email}).`
    );
  } catch (error) {
    console.error("Unable to connect to MySQL, create the Users table, or insert the user.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
