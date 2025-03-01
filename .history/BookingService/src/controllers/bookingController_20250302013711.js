const pool = require("../config/db");

exports.createBooking = async (req, res) => {
  const { user_id, event_id, tickets } = req.body;

  // Validate required fields
  if (!user_id || !event_id || !tickets) {
    return res.status(400).json({ error: "Missing required fields: user_id, event_id, and tickets are required" });
  }

  try {
    // Begin transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create booking with 'pending' status
      const bookingResult = await client.query(
        "INSERT INTO bookings (user_id, event_id, tickets, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
        [user_id, event_id, tickets]
      );
      
      await client.query('COMMIT');
      
      res.status(201).json({
        message: "Booking created successfully",
        booking: bookingResult.rows[0]
      });
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
