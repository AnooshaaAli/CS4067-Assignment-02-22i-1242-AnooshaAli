const pool = require("../../config/db");

exports.createBooking = async (req, res) => {
  const { user_id, event_id, tickets } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO bookings (user_id, event_id, tickets, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [user_id, event_id, tickets]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
