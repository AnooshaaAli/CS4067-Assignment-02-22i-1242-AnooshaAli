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
  user: process.env.DB_USER || "your_user",
  host: process.env.DB_HOST || "postgres",
  database: process.env.DB_NAME || "booking_db", // Your existing database
  password: process.env.DB_PASSWORD || "your_password",
  port: process.env.DB_PORT || 5432,
});

// **1️⃣ Process a Payment**
app.post("/payments", async (req, res) => {
  const { user_id, booking_id, amount } = req.body;

  if (!user_id || !booking_id || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO payments (user_id, booking_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, booking_id, amount, "Success"]
    );
    res.status(201).json({ message: "Payment processed successfully!", payment: result.rows[0] });
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **2️⃣ Get All Payments**
app.get("/payments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payments");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Payment Service is running!");
});

// **3️⃣ Start the Server**
app.listen(port, () => {
  console.log(`🚀 Payment Service running on http://localhost:${port}`);
});
