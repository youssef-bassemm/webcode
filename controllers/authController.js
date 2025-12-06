// controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import model functions
const {
  registerUser,
  getAccountByEmail,
  recordLogin,
} = require("../models/accountModel");


// ===============================
//  POST /auth/signup
// ===============================
async function signup(req, res) {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ error: "Missing user details" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const account = await registerUser({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      accountId: account.id,
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
}


// ===============================
//  POST /auth/login
// ===============================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    // Find existing account
    const account = await getAccountByEmail(email);
    if (!account) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Validate password
    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: account.id,
        role: account.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Record login activity
    await recordLogin(account.id);

    return res.json({
      message: "Login successful",
      token,
      account: {
        id: account.id,
        name: account.name,
        role: account.role,
      },
    });

  } catch (err) {
  console.error("Signup error:", err);
  return res.status(500).json({ error: "Signup failed" });
}

}


module.exports = {
  signup,
  login,
};


