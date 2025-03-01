const pool = require("../config/db");

exports.processPayment = async (req, res) => {
  const { user_id, booking_id, amount } = req.body;

  try {
    // Simulating a real payment processing (e.g., Stripe, PayPal, etc.)
    const paymentSuccess = Math.random() > 0.2; // 80% success rate

    if (!paymentSuccess) {
      return res.status(400).json({ error: "Payment failed" });
    }

    // Insert the payment record into the database
    const result = await pool.query(
      "INSERT INTO payments (user_id, booking_id, amount, status) VALUES ($1, $2, $3, 'success') RETURNING *",
      [user_id, booking_id, amount]
    );

    res.status(201).json({ message: "Payment successful", payment: result.rows[0] });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
