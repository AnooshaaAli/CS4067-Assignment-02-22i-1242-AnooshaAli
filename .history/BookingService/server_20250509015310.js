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
§
  
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
