// routes/clinicRoutes.js
const express = require('express');
const clinicController = require('../controllers/clinicController');
const { authRequired } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/clinics
router.get('/', authRequired, clinicController.getAllClinics);

// GET /api/clinics/:id
router.get('/:id', authRequired, clinicController.getClinicById);

// POST /api/clinics
router.post('/', authRequired, clinicController.createClinic);

// PUT /api/clinics/:id
router.put('/:id', authRequired, clinicController.updateClinic);

// DELETE /api/clinics/:id
router.delete('/:id', authRequired, clinicController.deleteClinic);

module.exports = router;
