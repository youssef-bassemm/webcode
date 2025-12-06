// models/paymentModel.js
const db = require('../db');

function createPayment(payment, callback) {
  const { user_id, appointment_id, amount, method, status } = payment;
  const sql = `
    INSERT INTO Payments (user_id, appointment_id, amount, method, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [user_id, appointment_id, amount, method, status || 'completed'];

  db.run(sql, params, function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, ...payment });
  });
}

function getPaymentHistoryByUser(userId, callback) {
  const sql = `
    SELECT * FROM Payments
    WHERE user_id = ?
    ORDER BY id DESC
  `;
  db.all(sql, [userId], callback);
}

module.exports = {
  createPayment,
  getPaymentHistoryByUser,
};
