require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Database Connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "booking_db",
  password: process.env.DB_PASSWORD || "your_password",
  port: process.env.DB_PORT || 5432,
});

// **Step 3: Create Payment Model**
app.post("/payments", async (req, res) => {
  const { user_id, booking_id, amount } = req.body;

  if (!user_id || !booking_id || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO payments (user_id, booking_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, booking_id, amount, "completed"]
    );
    res.status(201).json({ message: "Payment processed successfully!", payment: result.rows[0] });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Step 4: Get All Payments**
app.get("/payments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payments");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Step 5: Start the Server**
app.listen(port, () => {
  console.log(`🚀 Payment Service running on http://localhost:${port}`);
});
