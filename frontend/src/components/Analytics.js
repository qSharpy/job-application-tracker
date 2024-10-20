// frontend/src/components/Analytics.js

import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analyticsData) return <div>Loading analytics...</div>;

  const { statusOverview, timeline, interviewPerformance, insights } = analyticsData;

  const statusData = statusOverview.map(item => ({
    name: item._id,
    value: item.count
  }));

  const timelineData = timeline.map(item => ({
    date: item._id,
    applications: item.count
  }));

  return (
    <div className="analytics">
      <h2>Advanced Analytics</h2>

      <div className="analytics-section">
        <h3>Application Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="value" data={statusData} fill="#8884d8" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-section">
        <h3>Application Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="applications" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-section">
        <h3>Interview Performance</h3>
        <p>Total Interviews: {interviewPerformance.totalInterviews}</p>
        <p>Offers Received: {interviewPerformance.offersReceived}</p>
        <p>Success Rate: {((interviewPerformance.offersReceived / interviewPerformance.totalInterviews) * 100).toFixed(2)}%</p>
      </div>

      <div className="analytics-section">
        <h3>Personalized Insights</h3>
        <ul>
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;