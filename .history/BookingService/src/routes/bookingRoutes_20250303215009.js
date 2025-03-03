const express = require("express");
const router = express.Router();
const { createBooking, getBookings, updateBooking, deleteBooking } = require("../controllers/bookingController"); // ✅ Ensure deleteBooking is included

router.post("/", createBooking);
router.get("/", getBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking); // 🔴 This is causing the error if deleteBooking is undefined

module.exports = router;
