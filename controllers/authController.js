// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = '1h';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

exports.signup = (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }

  userModel.findByEmail(email, (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (existing) return res.status(409).json({ error: 'Email is already registered' });

    const passwordHash = bcrypt.hashSync(password, 10);

    userModel.createUser(
      {
        name,
        email,
        passwordHash,
        phone: phone || null,
        role: role || 'patient',
      },
      (err2, newUser) => {
        if (err2) return res.status(500).json({ error: 'Failed to create user' });

        const token = generateToken(newUser);
        res.status(201).json({
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
          },
          token,
        });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  userModel.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  });
};

exports.refresh = (req, res) => {
  // Expect a current valid token, and return a new one
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  const oldToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(oldToken, JWT_SECRET);
    const newToken = generateToken(decoded);
    res.json({ token: newToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
