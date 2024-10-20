// backend/src/controllers/analyticsController.js

const JobApplication = require('../models/jobApplication');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Application Status Overview
    const statusOverview = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Application Timeline
    const timeline = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$applicationDate' } },
        count: { $sum: 1 }
      } },
      { $sort: { _id: 1 } }
    ]);

    // Interview Performance
    const interviewPerformance = await JobApplication.aggregate([
      { $match: { user: userId, status: { $in: ['Interviewed', 'Offer Received'] } } },
      { $group: {
        _id: null,
        totalInterviews: { $sum: 1 },
        offersReceived: {
          $sum: { $cond: [{ $eq: ['$status', 'Offer Received'] }, 1, 0] }
        }
      } }
    ]);

    // Personalized Insights
    const totalApplications = await JobApplication.countDocuments({ user: userId });
    const successfulApplications = await JobApplication.countDocuments({
      user: userId,
      status: { $in: ['Interview Scheduled', 'Interviewed', 'Offer Received'] }
    });

    const insights = [];
    if (totalApplications > 0) {
      const successRate = (successfulApplications / totalApplications) * 100;
      if (successRate < 10) {
        insights.push("Consider revising your resume and application strategy to improve your success rate.");
      } else if (successRate > 50) {
        insights.push("Great job! Your applications are performing well. Focus on interview preparation.");
      }
    }

    if (timeline.length > 0) {
      const recentApplications = timeline.slice(-7).reduce((sum, day) => sum + day.count, 0);
      if (recentApplications < 3) {
        insights.push("Try to increase your application rate to improve your chances of success.");
      } else if (recentApplications > 10) {
        insights.push("You're submitting a good number of applications. Ensure you're tailoring each one to the job.");
      }
    }

    res.json({
      statusOverview,
      timeline,
      interviewPerformance: interviewPerformance[0] || { totalInterviews: 0, offersReceived: 0 },
      insights
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};