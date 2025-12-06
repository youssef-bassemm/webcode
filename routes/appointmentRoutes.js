// routes/appointmentRoutes.js
const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { authRequired } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/appointments
router.get('/', authRequired, appointmentController.getAllAppointments);

// GET /api/appointments/:id
router.get('/:id', authRequired, appointmentController.getAppointmentById);

// POST /api/appointments
router.post('/', authRequired, appointmentController.createAppointment);

// PUT /api/appointments/:id
router.put('/:id', authRequired, appointmentController.updateAppointment);

// DELETE /api/appointments/:id
router.delete('/:id', authRequired, appointmentController.deleteAppointment);

module.exports = router;
