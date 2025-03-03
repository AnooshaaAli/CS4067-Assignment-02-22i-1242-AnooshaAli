const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const cors = require("cors");
const Notification = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "booking_notifications";

// RabbitMQ Consumer
async function consumeMessages() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    console.log(`✅ Notification Service listening on queue: ${QUEUE_NAME}...`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        const booking = JSON.parse(msg.content.toString());
        console.log("📩 Received Booking Event:", booking);

        // Construct Notification Message
        const message = `Your booking (ID: ${booking.booking_id}) for event ${booking.event_id} is now ${booking.status}.`;

        // Save Notification to MongoDB
        await Notification.create({
          user_id: booking.user_id,
          booking_id: booking.booking_id,
          event_id: booking.event_id,
          status: booking.status,
          message: message,
        });

        console.log(`✅ Notification stored for user ${booking.user_id}`);
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("❌ Error consuming messages:", error);
  }
}

consumeMessages();

