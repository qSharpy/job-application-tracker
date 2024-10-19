// frontend/src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { getJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } from '../services/api';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getJobApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  };

  const handleCreate = async (data) => {
    try {
      await createJobApplication(data);
      fetchApplications();
    } catch (error) {
      console.error('Error creating application', error);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateJobApplication(id, data);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobApplication(id);
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application', error);
    }
  };

  return (
    <div>
      <h2>Job Applications Dashboard</h2>
      {/* Add form for creating new applications */}
      <ul>
        {applications.map((app) => (
          <li key={app._id}>
            {app.company} - {app.position} ({app.status})
            {/* Add buttons/forms for updating and deleting */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;