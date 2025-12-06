// controllers/paymentController.js
const paymentModel = require('../models/paymentModel');

exports.createPayment = (req, res) => {
  const { user_id, appointment_id, amount, method, status } = req.body;

  if (!user_id || !appointment_id || !amount || !method) {
    return res.status(400).json({ error: 'Missing required payment fields' });
  }

  paymentModel.createPayment(
    { user_id, appointment_id, amount, method, status },
    (err, payment) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json(payment);
    }
  );
};

// GET /api/payment/history  (for logged-in user)
exports.getPaymentHistory = (req, res) => {
  const userId = req.user.id;

  paymentModel.getPaymentHistoryByUser(userId, (err, payments) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(payments);
  });
};
