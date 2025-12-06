// Loads environment variables
require("dotenv").config();

// Imports core packages
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Create express application
const app = express();

// Core middlewares
app.use(express.json());           // accept JSON body
app.use(cookieParser());           // read cookies
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// === AUTH ROUTES ===
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// === APPOINTMENT ROUTES ===
const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/appointments", appointmentRoutes);

// Simple health check route
app.get("/status", (req, res) => {
  res.json({ ok: true, service: "SmartClinic API" });
});

// Export the app instance to be used in server.js
module.exports = app;
