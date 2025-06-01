require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bookingRoutes = require("./src/routes/bookingRoutes");
const pool = require("./src/config/db.js");  // Import the pool from config.js

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
      event_id INTEGER NOT NULL,  -- Add this to match your booking query
      tickets INTEGER NOT NULL,   -- Add this for ticket count
      booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
  `;

  try {
    console.log("Attempting to create bookings table...");
    await pool.query(createTableQuery);
    console.log("Bookings table created (if it did not exist).");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

// Ensure table is created before starting the server
const initializeService = async () => {
  await createTable(); // Ensure table is created
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => {
    console.log(`🚀 Booking Service running on http://localhost:${PORT}`);
  });
};

initializeService(); // Call initialization
