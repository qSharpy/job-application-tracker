// frontend/src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getUserData  // Add this line
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import SubscribeButton from './SubscribeButton';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };
    fetchUserData();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getJobApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch applications. Please try again.');
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      company: '',
      position: '',
      status: 'Applied',
      notes: '',
    },
    validationSchema: Yup.object({
      company: Yup.string().required('Required'),
      position: Yup.string().required('Required'),
      status: Yup.string().required('Required'),
      notes: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingId) {
          await updateJobApplication(editingId, values);
          setEditingId(null);
        } else {
          await createJobApplication(values);
        }
        fetchApplications();
        resetForm();
      } catch (error) {
        console.error('Error saving application', error);
        setError('Failed to save application. Please try again.');
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    },
  });

  const handleEdit = (app) => {
    setEditingId(app._id);
    formik.setValues(app);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteJobApplication(id);
        fetchApplications();
      } catch (error) {
        console.error('Error deleting application', error);
        setError('Failed to delete application. Please try again.');
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    }
  };

  const getStatusCounts = () => {
    const counts = {};
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  };

  if (!localStorage.getItem('token')) {
    navigate('/login');
    return null;
  }

  const statusCounts = getStatusCounts();

  const renderPremiumFeatures = () => {
    if (user && user.isPremium) {
      return (
        <div className="premium-features">
          <h3>Premium Features</h3>
          <ul>
            <li>Advanced Analytics</li>
            <li>Email Reminders</li>
            <li>Interview Preparation Tips</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="upgrade-prompt">
          <h3>Upgrade to Premium</h3>
          <p>Get access to advanced features!</p>
          <SubscribeButton />
        </div>
      );
    }
  };

  return (
    <div>
      <h2>Job Applications Dashboard</h2>
      {error && <div className="error">{error}</div>}

      {renderPremiumFeatures()}

      <div className="stats">
        <h3>Application Statistics</h3>
        <ul>
          {Object.entries(statusCounts).map(([status, count]) => (
            <li key={status}>{status}: {count}</li>
          ))}
        </ul>
        <p>Total Applications: {applications.length}</p>
      </div>

      <h3>{editingId ? 'Edit' : 'Add'} Job Application</h3>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            {...formik.getFieldProps('company')}
          />
          {formik.touched.company && formik.errors.company ? (
            <div className="error">{formik.errors.company}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="position">Position</label>
          <input
            id="position"
            type="text"
            {...formik.getFieldProps('position')}
          />
          {formik.touched.position && formik.errors.position ? (
            <div className="error">{formik.errors.position}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            {...formik.getFieldProps('status')}
          >
            <option value="Applied">Applied</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Offer Received">Offer Received</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            {...formik.getFieldProps('notes')}
          />
        </div>
        <button type="submit">{editingId ? 'Update' : 'Add'} Application</button>
      </form>

      <h3>Your Applications</h3>
      <ul className="job-list">
        {applications.map((app) => (
          <li key={app._id} className="job-item">
            <h4>{app.company} - {app.position}</h4>
            <p>Status: {app.status}</p>
            <p>Notes: {app.notes}</p>
            <button onClick={() => handleEdit(app)}>Edit</button>
            <button onClick={() => handleDelete(app._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;