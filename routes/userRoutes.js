// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authRequired } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/me
router.get('/me', authRequired, userController.getMe);

// PUT /api/users/me
router.put('/me', authRequired, userController.updateMe);

// GET /api/users/:id
router.get('/:id', authRequired, userController.getUserById);

module.exports = router;
