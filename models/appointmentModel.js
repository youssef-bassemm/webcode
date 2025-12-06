const db = require("../db");

// Create a new booking
function createBooking({ patientId, doctorId, clinicId, date, time, paymentMethod }) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO bookings 
      (patient_id, doctor_id, clinic_id, date, time, status, payment_method)
      VALUES (?, ?, ?, ?, ?, 'booked', ?)
    `;

    db.run(sql, [patientId, doctorId, clinicId, date, time, paymentMethod], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
}

// Get bookings for a patient
function getBookingsForUser(patientId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        b.id,
        b.date,
        b.time,
        b.status,
        b.payment_method,
        d.full_name AS doctor_name,
        d.specialty,
        c.title AS clinic_name
      FROM bookings b
      JOIN doctors d ON b.doctor_id = d.id
      JOIN clinics c ON b.clinic_id = c.id
      WHERE b.patient_id = ?
      ORDER BY b.date DESC, b.time DESC
    `;

    db.all(sql, [patientId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Cancel a booking
function cancelBooking(bookingId, patientId) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = ? AND patient_id = ?
    `;

    db.run(sql, [bookingId, patientId], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  createBooking,
  getBookingsForUser,
  cancelBooking,
};
