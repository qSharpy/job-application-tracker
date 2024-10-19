// backend/src/routes/jobApplicationRoutes.js

const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');
const auth = require('../middleware/auth');

router.post('/', auth, jobApplicationController.createJobApplication);
router.get('/', auth, jobApplicationController.getAllJobApplications);
router.get('/:id', auth, jobApplicationController.getJobApplication);
router.put('/:id', auth, jobApplicationController.updateJobApplication);
router.delete('/:id', auth, jobApplicationController.deleteJobApplication);

module.exports = router;