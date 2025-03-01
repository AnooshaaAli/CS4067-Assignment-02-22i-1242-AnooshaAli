require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bookingRoutes = require("./src/routes/bookingRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/bookings", bookingRoutes); 

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Booking Service running on http://localhost:${PORT}`);
});
