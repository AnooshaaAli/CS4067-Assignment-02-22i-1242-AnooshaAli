const pool = require("../config/db");
const axios = require("axios"); // You'll need to install this: npm install axios

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:5004/api/payments";

exports.createBooking = async (req, res) => {
  const { user_id, event_id, tickets, amount } = req.body;

  // Validate required fields
  if (!user_id || !event_id || !tickets || !amount) {
    return res.status(400).json({ error: "Missing required fields: user_id, event_id, tickets, and amount are required" });
  }

  try {
    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Create booking with 'pending' status
      const bookingResult = await client.query(
        "INSERT INTO bookings (user_id, event_id, tickets, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
        [user_id, event_id, tickets]
      );
      
      const booking = bookingResult.rows[0];
      
      // 2. Process payment through payment service
      try {
        const paymentResponse = await axios.post(PAYMENT_SERVICE_URL, {
          user_id,
          booking_id: booking.id,
          amount
        });
        
        // 3. If payment successful, update booking status
        if (paymentResponse.status === 201) {
          const updateResult = await client.query(
            "UPDATE bookings SET status = 'confirmed', payment_id = $1 WHERE id = $2 RETURNING *",
            [paymentResponse.data.payment.id, booking.id]
          );
          
          await client.query('COMMIT');
          
          res.status(201).json({
            message: "Booking created and payment processed successfully",
            booking: updateResult.rows[0],
            payment: paymentResponse.data.payment
          });
        }
      } catch (paymentError) {
        // If payment fails, rollback and return error
        await client.query('ROLLBACK');
        
        if (paymentError.response) {
          return res.status(paymentError.response.status).json({ 
            error: "Payment failed", 
            details: paymentError.response.data 
          });
        } else {
          return res.status(500).json({ 
            error: "Payment service unavailable", 
            details: paymentError.message 
          });
        }
      }
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, p.amount, p.status as payment_status 
      FROM bookings b
      LEFT JOIN payments p ON b.payment_id = p.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
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

exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if booking has an associated payment
    const bookingCheck = await pool.query(
      "SELECT payment_id FROM bookings WHERE id = $1",
      [id]
    );
    
    if (bookingCheck.rows.length > 0 && bookingCheck.rows[0].payment_id) {
      // Optional: Add logic to refund payment through payment service
      // This would involve calling the payment service with a refund endpoint
    }
    
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