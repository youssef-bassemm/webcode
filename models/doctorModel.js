// models/doctorModel.js
const db = require('../db');

function getAllDoctors(callback) {
  db.all('SELECT * FROM Doctors', [], callback);
}

function getDoctorById(id, callback) {
  db.get('SELECT * FROM Doctors WHERE id = ?', [id], callback);
}

function createDoctor(doctor, callback) {
  const { name, specialty, clinic_id } = doctor;
  const sql = `
    INSERT INTO Doctors (name, specialty, clinic_id)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [name, specialty, clinic_id], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, name, specialty, clinic_id });
  });
}

function updateDoctor(id, doctor, callback) {
  const { name, specialty, clinic_id } = doctor;
  const sql = `
    UPDATE Doctors
    SET name = ?, specialty = ?, clinic_id = ?
    WHERE id = ?
  `;
  db.run(sql, [name, specialty, clinic_id, id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

function deleteDoctor(id, callback) {
  db.run('DELETE FROM Doctors WHERE id = ?', [id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
