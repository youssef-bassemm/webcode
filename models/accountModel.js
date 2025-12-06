const db = require("../db");
const bcrypt = require("bcrypt");

// Create a new account
async function registerUser(info) {
  return new Promise((resolve, reject) => {
    const hashed = bcrypt.hashSync(info.password, 10);

    const sql = `
      INSERT INTO accounts (full_name, email, pass_hash, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      info.name,
      info.email,
      hashed,
      info.phone || null,
      info.role || "patient",
    ];

    db.run(sql, values, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
}

// Get one account by email (for login)
async function getAccountByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM accounts WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Save login attempts
async function recordLogin(email, action, ip) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO login_log (user_email, action, ip, timestamp)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [email, action, ip, now], function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  registerUser,
  getAccountByEmail,
  recordLogin,
};
