// models/clinicModel.js
const db = require('../db');

function getAllClinics(callback) {
  db.all('SELECT * FROM Clinics', [], callback);
}

function getClinicById(id, callback) {
  db.get('SELECT * FROM Clinics WHERE id = ?', [id], callback);
}

function createClinic(clinic, callback) {
  const { name, address } = clinic;
  const sql = `
    INSERT INTO Clinics (name, address)
    VALUES (?, ?)
  `;
  db.run(sql, [name, address], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, name, address });
  });
}

function updateClinic(id, clinic, callback) {
  const { name, address } = clinic;
  const sql = `
    UPDATE Clinics
    SET name = ?, address = ?
    WHERE id = ?
  `;
  db.run(sql, [name, address, id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

function deleteClinic(id, callback) {
  db.run('DELETE FROM Clinics WHERE id = ?', [id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

module.exports = {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic,
};
