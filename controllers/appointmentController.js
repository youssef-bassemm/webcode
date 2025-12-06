// controllers/appointmentController.js

// === IMPORT MODEL FUNCTIONS ===
// controllers/appointmentController.js

// =============================
// IMPORT MODEL FUNCTIONS
// =============================
const {
  createBooking,
  getBookingsForUser,
  cancelBooking,
} = require("../models/appointmentModel");


// =============================
// POST /appointments/book
// =============================
async function book(req, res) {
  try {
    const patientId = req.user.id; // from authRequired middleware
    const { doctorId, clinicId, date, time, paymentMethod } = req.body;

    // Validate input
    if (!doctorId || !clinicId || !date || !time || !paymentMethod) {
      return res.status(400).json({ error: "Missing booking details" });
    }

    // Create booking record
    const result = await createBooking({
      patientId,
      doctorId,
      clinicId,
      date,
      time,
      paymentMethod,
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      bookingId: result.id,
    });
  } catch (err) {
    console.error("Book error:", err);
    return res.status(500).json({ error: "Booking failed" });
  }
}


// =============================
// GET /appointments/my
// =============================
async function myAppointments(req, res) {
  try {
    const patientId = req.user.id;
    const rows = await getBookingsForUser(patientId);

    return res.json({
      bookings: rows,
    });
  } catch (err) {
    console.error("Get bookings error:", err);
    return res.status(500).json({ error: "Could not load bookings" });
  }
}


// =============================
// DELETE /appointments/:id/cancel
// =============================
async function cancel(req, res) {
  try {
    const patientId = req.user.id;
    const bookingId = req.params.id;

    const result = await cancelBooking(bookingId, patientId);

    if (!result.changes) {
      return res.status(400).json({ error: "Cannot cancel this booking" });
    }

    return res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("Cancel booking error:", err);
    return res.status(500).json({ error: "Cancellation failed" });
  }
}


// =============================
// EXPORT FUNCTIONS
// =============================
module.exports = {
  book,
  myAppointments,
  cancel,
};

