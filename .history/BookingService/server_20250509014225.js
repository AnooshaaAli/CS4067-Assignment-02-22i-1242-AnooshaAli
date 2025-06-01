require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bookingRoutes = require("./src/routes/bookingRoutes");
const pool = require("./config");  // Import the pool from config.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/bookings", bookingRoutes);

// Function to create bookings table if it doesn't exist
const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      booking_date TIMESTAMP NOT NULL,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Bookings table created (if it did not exist).');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

createTable();

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Booking Service running on http://localhost:${PORT}`);
});
