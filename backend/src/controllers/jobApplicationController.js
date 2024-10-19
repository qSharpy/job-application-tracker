// backend/src/controllers/jobApplicationController.js

const JobApplication = require('../models/jobApplication');

// Create a new job application
exports.createJobApplication = async (req, res) => {
  try {
    const newJobApplication = new JobApplication({
      ...req.body,
      user: req.user._id
    });
    const savedJobApplication = await newJobApplication.save();
    res.status(201).json(savedJobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all job applications for the authenticated user
exports.getAllJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.find({ user: req.user._id });
    res.json(jobApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single job application by ID for the authenticated user
exports.getJobApplication = async (req, res) => {
  try {
    const jobApplication = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });
    if (!jobApplication) return res.status(404).json({ message: 'Job application not found' });
    res.json(jobApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a job application for the authenticated user
exports.updateJobApplication = async (req, res) => {
  try {
    const updatedJobApplication = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedJobApplication) return res.status(404).json({ message: 'Job application not found' });
    res.json(updatedJobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job application for the authenticated user
exports.deleteJobApplication = async (req, res) => {
  try {
    const deletedJobApplication = await JobApplication.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedJobApplication) return res.status(404).json({ message: 'Job application not found' });
    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};