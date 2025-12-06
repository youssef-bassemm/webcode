// routes/doctorRoutes.js
const express = require('express');
const doctorController = require('../controllers/doctorController');
const { authRequired } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/doctors
router.get('/', authRequired, doctorController.getAllDoctors);

// GET /api/doctors/:id
router.get('/:id', authRequired, doctorController.getDoctorById);

// POST /api/doctors
router.post('/', authRequired, doctorController.createDoctor);

// PUT /api/doctors/:id
router.put('/:id', authRequired, doctorController.updateDoctor);

// DELETE /api/doctors/:id
router.delete('/:id', authRequired, doctorController.deleteDoctor);

module.exports = router;
