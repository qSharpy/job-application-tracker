// backend/src/controllers/jobApplicationController.js

const JobApplication = require('../models/jobApplication');

// Create a new job application
exports.createJobApplication = async (req, res) => {
  try {
    const newJobApplication = new JobApplication(req.body);
    const savedJobApplication = await newJobApplication.save();
    res.status(201).json(savedJobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all job applications
exports.getAllJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.find();
    res.json(jobApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single job application by ID
exports.getJobApplication = async (req, res) => {
  try {
    const jobApplication = await JobApplication.findById(req.params.id);
    if (!jobApplication) return res.status(404).json({ message: 'Job application not found' });
    res.json(jobApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a job application
exports.updateJobApplication = async (req, res) => {
  try {
    const updatedJobApplication = await JobApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJobApplication) return res.status(404).json({ message: 'Job application not found' });
    res.json(updatedJobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job application
exports.deleteJobApplication = async (req, res) => {
  try {
    const deletedJobApplication = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deletedJobApplication) return res.status(404).json({ message: 'Job application not found' });
    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};