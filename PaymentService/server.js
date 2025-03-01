require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Payment Service running on http://localhost:${PORT}`);
});
