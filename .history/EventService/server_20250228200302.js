require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/events", eventRoutes);

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Event Service running on port ${PORT}`));
