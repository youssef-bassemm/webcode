const express = require("express");
const router = express.Router();

// Import controller functions
const {
  book,
  myAppointments,
  cancel,
} = require("../controllers/appointmentController");

// Import middleware
const authRequired = require("../middleware/authRequired");

// Book appointment
router.post("/book", authRequired, book);

// View user's appointments
router.get("/my", authRequired, myAppointments);

// Cancel appointment
router.delete("/:id/cancel", authRequired, cancel);

module.exports = router;
