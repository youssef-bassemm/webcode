// db.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'smartclinic.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', DB_PATH);
    initSchema();
  }
});

// Create all tables if they don't exist
function initSchema() {
  db.serialize(() => {
    // Users
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'patient'
      )
    `);

    // Clinics
    db.run(`
      CREATE TABLE IF NOT EXISTS Clinics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL
      )
    `);

    // Doctors
    db.run(`
      CREATE TABLE IF NOT EXISTS Doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        clinic_id INTEGER,
        FOREIGN KEY (clinic_id) REFERENCES Clinics(id)
      )
    `);

    // Appointments
    db.run(`
      CREATE TABLE IF NOT EXISTS Appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        doctor_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (doctor_id) REFERENCES Doctors(id),
        FOREIGN KEY (clinic_id) REFERENCES Clinics(id)
      )
    `);

    // Payments
    db.run(`
      CREATE TABLE IF NOT EXISTS Payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        appointment_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'completed',
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (appointment_id) REFERENCES Appointments(id)
      )
    `);

    console.log('Database schema initialized');
  });
}

module.exports = db;
