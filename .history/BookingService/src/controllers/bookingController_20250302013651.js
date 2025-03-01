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
