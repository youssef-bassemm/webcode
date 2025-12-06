// controllers/appointmentController.js
const appointmentModel = require('../models/appointmentModel');

exports.getAllAppointments = (req, res) => {
  appointmentModel.getAllAppointments((err, appointments) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(appointments);
  });
};

exports.getAppointmentById = (req, res) => {
  const { id } = req.params;
  appointmentModel.getAppointmentById(id, (err, appointment) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  });
};

exports.createAppointment = (req, res) => {
  const { user_id, doctor_id, clinic_id, date, time, status } = req.body;

  if (!user_id || !doctor_id || !clinic_id || !date || !time) {
    return res.status(400).json({ error: 'Missing required appointment fields' });
  }

  appointmentModel.createAppointment(
    { user_id, doctor_id, clinic_id, date, time, status },
    (err, appointment) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json(appointment);
    }
  );
};

exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const { date, time, status } = req.body;

  appointmentModel.updateAppointment(id, { date, time, status }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment updated successfully' });
  });
};

exports.deleteAppointment = (req, res) => {
  const { id } = req.params;
  appointmentModel.deleteAppointment(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted successfully' });
  });
};
