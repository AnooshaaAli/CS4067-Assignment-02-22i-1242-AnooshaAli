const pool = require("../config/db");
const amqp = require("amqplib");

"amqp://rabbitmq:5672";
const QUEUE_NAME = "booking_notifications";

// Function to publish booking events to RabbitMQ
async function publishBookingEvent(eventMessage) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(eventMessage)));

    console.log("📢 Published Booking Event:", eventMessage);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("❌ Error publishing event to RabbitMQ:", error);
  }
}

// Create Booking
exports.createBooking = async (req, res) => {
  const { user_id, event_id, tickets, email } = req.body; // Get email from request

  try {
    const result = await pool.query(
      "INSERT INTO bookings (user_id, event_id, tickets, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [user_id, event_id, tickets]
    );

    const booking = result.rows[0];

    // ✅ Publish event with user email
    await publishBookingEvent({
      booking_id: booking.id,
      user_id: booking.user_id,
      event_id: booking.event_id,
      status: booking.status,
      email: email,  // Send email in event
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Bookings
exports.getBookings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Booking
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

    const updatedBooking = result.rows[0];

    // Publish event to RabbitMQ
    await publishBookingEvent({
      type: "BOOKING_UPDATED",
      booking_id: updatedBooking.id,
      user_id: updatedBooking.user_id,
      event_id: updatedBooking.event_id,
      status: updatedBooking.status,
    });

    res.status(200).json({ message: "Booking updated", booking: updatedBooking });
  } catch (error) {
    console.error("❌ Error updating booking:", error);
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

    const deletedBooking = result.rows[0];

    // Publish event to RabbitMQ
    await publishBookingEvent({
      type: "BOOKING_DELETED",
      booking_id: deletedBooking.id,
      user_id: deletedBooking.user_id,
      event_id: deletedBooking.event_id,
      status: "deleted",
    });

    res.status(200).json({ message: "Booking deleted", booking: deletedBooking });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};
