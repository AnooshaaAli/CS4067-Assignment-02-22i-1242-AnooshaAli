const pool = require("../config/db");

exports.createBooking = async (req, res) => {
  const { user_id, event_id, tickets, amount } = req.body;

  try {
    // Create booking with pending status
    const result = await pool.query(
      "INSERT INTO bookings (user_id, event_id, tickets, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [user_id, event_id, tickets]
    );
    
    const booking = result.rows[0];
    
    // Call payment service
    try {
      const paymentResponse = await axios.post("http://localhost:5004/api/payments", {
        user_id,
        booking_id: booking.id,
        amount
      });
      
      // Update booking status to confirmed if payment succeeded
      if (paymentResponse.status === 201) {
        await pool.query(
          "UPDATE bookings SET status = 'confirmed' WHERE id = $1",
          [booking.id]
        );
      }
      
      res.status(201).json({
        booking,
        payment: paymentResponse.data
      });
    } catch (paymentError) {
      // If payment fails, still return the booking but with error
      res.status(201).json({
        booking,
        payment_error: "Payment processing failed"
      });
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking updated", booking: result.rows[0] });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM bookings WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted", booking: result.rows[0] });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};