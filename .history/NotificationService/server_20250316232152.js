const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const cors = require("cors");
const Notification = require("./db"); 

const app = express();
app.use(cors());
app.use(express.json());

const RABBITMQ_URL = "amqp://rabbitmq";
const QUEUE_NAME = "booking_notifications";

async function consumeMessages(retries = 10, delay = 5000) {
  try {
    console.log("⏳ Trying to connect to RabbitMQ...");
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    console.log(`✅ Connected to RabbitMQ and listening on queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      const booking = JSON.parse(msg.content.toString());
      console.log("📩 Received Booking Event:", booking);

      await Notification.create({
        user_id: booking.user_id,
        booking_id: booking.booking_id,
        event_id: booking.event_id,
        status: booking.status,
        message: `Your booking (ID: ${booking.booking_id}) for event ${booking.event_id} is now ${booking.status}.`,
      });

      console.log(`✅ Notification stored for user ${booking.user_id}`);
    }, { noAck: true });

  } catch (error) {
    console.error("❌ Error consuming messages:", error);
    
    if (retries > 0) {
      console.log(`🔄 Retrying in ${delay / 1000} seconds... (${retries} retries left)`);
      setTimeout(() => consumeMessages(retries - 1, delay), delay);
    } else {
      console.error("❌ Failed to connect after multiple retries. Exiting...");
      process.exit(1);
    }
  }
}

// Delay message consumption to allow RabbitMQ to be fully ready
setTimeout(() => consumeMessages(), 10000);


app.get("/notifications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      console.log("Fetching notifications for userId:", userId); // Debugging line
  
      const notifications = await Notification.find({ user_id: userId }).sort({ created_at: -1 });
  
      if (!notifications) {
        return res.status(404).json({ error: "No notifications found" });
      }
  
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error); // Debugging line
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });  
  