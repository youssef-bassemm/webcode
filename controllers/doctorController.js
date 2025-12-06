// controllers/doctorController.js
const doctorModel = require('../models/doctorModel');

exports.getAllDoctors = (req, res) => {
  doctorModel.getAllDoctors((err, doctors) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(doctors);
  });
};

exports.getDoctorById = (req, res) => {
  const { id } = req.params;
  doctorModel.getDoctorById(id, (err, doctor) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  });
};

exports.createDoctor = (req, res) => {
  const { name, specialty, clinic_id } = req.body;
  if (!name || !specialty) {
    return res.status(400).json({ error: 'name and specialty are required' });
  }

  doctorModel.createDoctor({ name, specialty, clinic_id }, (err, doctor) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json(doctor);
  });
};

exports.updateDoctor = (req, res) => {
  const { id } = req.params;
  const { name, specialty, clinic_id } = req.body;

  doctorModel.updateDoctor(id, { name, specialty, clinic_id }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.changes === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor updated successfully' });
  });
};

exports.deleteDoctor = (req, res) => {
  const { id } = req.params;

  doctorModel.deleteDoctor(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.changes === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  });
};
