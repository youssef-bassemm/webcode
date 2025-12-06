// controllers/clinicController.js
const clinicModel = require('../models/clinicModel');

exports.getAllClinics = (req, res) => {
  clinicModel.getAllClinics((err, clinics) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(clinics);
  });
};

exports.getClinicById = (req, res) => {
  const { id } = req.params;
  clinicModel.getClinicById(id, (err, clinic) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });
    res.json(clinic);
  });
};

exports.createClinic = (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json({ error: 'name and address are required' });
  }

  clinicModel.createClinic({ name, address }, (err, clinic) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json(clinic);
  });
};

exports.updateClinic = (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  clinicModel.updateClinic(id, { name, address }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.changes === 0) return res.status(404).json({ error: 'Clinic not found' });
    res.json({ message: 'Clinic updated successfully' });
  });
};

exports.deleteClinic = (req, res) => {
  const { id } = req.params;
  clinicModel.deleteClinic(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.changes === 0) return res.status(404).json({ error: 'Clinic not found' });
    res.json({ message: 'Clinic deleted successfully' });
  });
};
