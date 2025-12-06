// models/appointmentModel.js
const db = require('../db');

function getAllAppointments(callback) {
  db.all('SELECT * FROM Appointments', [], callback);
}

function getAppointmentById(id, callback) {
  db.get('SELECT * FROM Appointments WHERE id = ?', [id], callback);
}

function createAppointment(appointment, callback) {
  const { user_id, doctor_id, clinic_id, date, time, status } = appointment;
  const sql = `
    INSERT INTO Appointments (user_id, doctor_id, clinic_id, date, time, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [user_id, doctor_id, clinic_id, date, time, status || 'pending'], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, ...appointment });
  });
}

function updateAppointment(id, appointment, callback) {
  const { date, time, status } = appointment;
  const sql = `
    UPDATE Appointments
    SET date = ?, time = ?, status = ?
    WHERE id = ?
  `;
  db.run(sql, [date, time, status, id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

function deleteAppointment(id, callback) {
  db.run('DELETE FROM Appointments WHERE id = ?', [id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
