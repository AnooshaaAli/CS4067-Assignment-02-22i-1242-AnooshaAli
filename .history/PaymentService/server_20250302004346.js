require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./config/db"); // PostgreSQL connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PAYMENT_SERVICE_PORT || 5004;
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://localhost:5003/api/bookings";

// Process Payment
app.post("/api/payments", async (req, res) => {
    const { user_id, booking_id, amount } = req.body;

    if (!user_id || !booking_id || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Insert payment into database
        const paymentResult = await pool.query(
            "INSERT INTO payments (user_id, booking_id, amount, status) VALUES ($1, $2, $3, 'Success') RETURNING *",
            [user_id, booking_id, amount]
        );

        // Notify Booking Service
        await axios.put(`${BOOKING_SERVICE_URL}/${booking_id}`, { status: "Paid" });

        return res.json({ message: "Payment successful", payment: paymentResult.rows[0] });

    } catch (error) {
        console.error("Payment processing failed:", error);
        return res.status(500).json({ error: "Payment failed" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Payment Service running on http://localhost:${PORT}`);
});
