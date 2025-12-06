// models/userModel.js
const db = require('../db');

function createUser({ name, email, passwordHash, phone, role }, callback) {
  const sql = `
    INSERT INTO Users (name, email, password, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [name, email, passwordHash, phone, role];

  db.run(sql, params, function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, name, email, phone, role });
  });
}

function findByEmail(email, callback) {
  db.get('SELECT * FROM Users WHERE email = ?', [email], callback);
}

function findById(id, callback) {
  db.get('SELECT * FROM Users WHERE id = ?', [id], callback);
}

function updateUser(id, data, callback) {
  const { name, phone } = data;
  const sql = `
    UPDATE Users
    SET name = ?, phone = ?
    WHERE id = ?
  `;
  db.run(sql, [name, phone, id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateUser,
};
