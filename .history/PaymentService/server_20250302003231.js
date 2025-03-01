const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5002;
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://localhost:5001";

// Mock database for payments (temporary storage)
const payments = [];

/**
 * @route POST /payments
 * @desc Process a mock payment
 */
app.post("/payments", async (req, res) => {
    const { user_id, booking_id, amount } = req.body;

    if (!user_id || !booking_id || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Simulate a payment processing delay (mock real-world behavior)
    setTimeout(async () => {
        const paymentId = `PAY-${Math.floor(Math.random() * 10000)}`;
        const paymentStatus = "Success";

        // Store the mock payment
        payments.push({ paymentId, user_id, booking_id, amount, status: paymentStatus });

        // Update the booking status (call the Booking Service)
        try {
            await axios.patch(`${BOOKING_SERVICE_URL}/bookings/${booking_id}`, { status: "Paid" });
            console.log(`Booking ${booking_id} marked as Paid`);
        } catch (error) {
            console.error("Failed to update booking:", error.message);
        }

        return res.json({ message: "Payment successful", paymentId, status: paymentStatus });
    }, 2000); // Simulate 2-second delay
});

/**
 * @route GET /payments
 * @desc Get all mock payments
 */
app.get("/payments", (req, res) => {
    res.json(payments);
});

/**
 * @route GET /payments/:id
 * @desc Get a specific payment
 */
app.get("/payments/:id", (req, res) => {
    const payment = payments.find(p => p.paymentId === req.params.id);
    if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
    }
    res.json(payment);
});

app.listen(PORT, () => {
    console.log(`Mock Payment Service running on port ${PORT}`);
});
