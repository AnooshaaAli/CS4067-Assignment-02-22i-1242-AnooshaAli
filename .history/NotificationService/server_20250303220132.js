require("dotenv").config();
const express = require("express");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "booking_notifications";

// Configure Email Transport (Replace with your credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email notifications
async function sendEmailNotification(to, subject, text) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

// RabbitMQ Consumer (Listening for Booking Events)
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

        // Send Notification (You can replace this with SMS or push notifications)
        const email = "customer@example.com"; // Replace with the real user's email
        const subject = `Booking ${booking.status}`;
        const text = `Your booking (ID: ${booking.booking_id}) for event ${booking.event_id} is now ${booking.status}.`;

        await sendEmailNotification(email, subject, text);
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("❌ Error consuming messages:", error);
  }
}

consumeMessages();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Notification Service running on port ${PORT}`));
