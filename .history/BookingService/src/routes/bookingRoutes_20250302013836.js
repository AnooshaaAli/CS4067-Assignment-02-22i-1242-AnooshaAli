const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookingController");
const { updateBooking, deleteBooking } = require("../controllers/bookingController");

router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.post("/", createBooking);
router.get("/", getBookings);

module.exports = router;