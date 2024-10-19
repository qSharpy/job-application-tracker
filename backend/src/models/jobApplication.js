
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  applicationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Applied', 'Interview Scheduled', 'Interviewed', 'Offer Received', 'Rejected', 'Withdrawn'],
    default: 'Applied'
  },
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // We'll implement User model later
}, {
  timestamps: true
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;