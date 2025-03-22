const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "postgres_db",
  database: process.env.DB_NAME || "booking_db", // Your existing database
  password: process.env.DB_PASSWORD || "123456",
  port: process.env.DB_PORT || 5433,
});

pool.connect()
  .then(() => console.log("📦 Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
