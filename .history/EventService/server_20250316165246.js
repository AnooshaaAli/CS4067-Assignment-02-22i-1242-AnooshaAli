const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// API Routes
app.use("/api/events", eventRoutes);

// Start Server
app.listen(PORT, () => console.log(`Event Service running on port ${PORT}`));
