const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://mongodb:27017/notification_service", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("✅ Connected to MongoDB"));
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));

// Define Notification Schema
const notificationSchema = new mongoose.Schema({
  user_id: Number,
  booking_id: Number,
  event_id: Number,
  status: String,
  message: String,
  created_at: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
