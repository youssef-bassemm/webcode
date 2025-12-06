// routes/paymentRoutes.js
const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authRequired } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/payment
router.post('/', authRequired, paymentController.createPayment);

// GET /api/payment/history
router.get('/history', authRequired, paymentController.getPaymentHistory);

module.exports = router;
