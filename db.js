// Local SQLite connection for SmartClinic
const sqlite = require("sqlite3").verbose();
const path = require("path");

// Database file path taken from environment
const databaseFile = process.env.DB_FILE || "smartclinic.db";

// Create or open the database
const connection = new sqlite.Database(
  path.resolve(__dirname, databaseFile),
  (err) => {
    if (err) {
      console.error("Failed to open SmartClinic database", err);
    } else {
      console.log("SmartClinic database ready.");
    }
  }
);

// Initialize all tables in one go
connection.serialize(() => {
  // User accounts (patients + doctors + admin)
  connection.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        pass_hash TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL CHECK(role IN ('patient','doctor','admin'))
      );
    `);

  // Clinics available in the system
  connection.run(`
      CREATE TABLE IF NOT EXISTS clinics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        address TEXT NOT NULL
      );
    `);

  // Doctors belong to a clinic
  connection.run(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        specialty TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES accounts(id),
        FOREIGN KEY(clinic_id) REFERENCES clinics(id)
      );
    `);

  // Appointment reservations
  connection.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        doctor_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'booked'
          CHECK(status IN ('booked','cancelled','finished')),
        payment TEXT NOT NULL CHECK(payment IN ('cash','visa')),
        FOREIGN KEY(patient_id) REFERENCES accounts(id),
        FOREIGN KEY(doctor_id) REFERENCES doctors(id),
        FOREIGN KEY(clinic_id) REFERENCES clinics(id)
      );
    `);

  // Basic log of authentication activity
  connection.run(`
      CREATE TABLE IF NOT EXISTS login_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT,
        action TEXT NOT NULL,
        ip TEXT,
        timestamp TEXT NOT NULL
      );
    `);
});

// Export connection to use in models
module.exports = connection;
