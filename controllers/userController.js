// controllers/userController.js
const userModel = require('../models/userModel');

exports.getMe = (req, res) => {
  const userId = req.user.id;

  userModel.findById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  userModel.findById(id, (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  });
};

exports.updateMe = (req, res) => {
  const userId = req.user.id;
  const { name, phone } = req.body;

  userModel.updateUser(userId, { name, phone }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.changes === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated successfully' });
  });
};
