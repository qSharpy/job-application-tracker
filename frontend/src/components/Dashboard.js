// frontend/src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getUserData,
  verifySubscription
} from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import SubscribeButton from './SubscribeButton';
import Analytics from './Analytics';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const [applicationsResponse, userResponse] = await Promise.all([
        getJobApplications(),
        getUserData()
      ]);
      setApplications(applicationsResponse.data);
      setUser(userResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Failed to fetch data. Please try again.');
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchData();

    // Check for successful Stripe checkout
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');
    if (sessionId) {
      handleSubscriptionVerification(sessionId);
    }
  }, [navigate, location]);

  const handleSubscriptionVerification = async (sessionId) => {
    try {
      await verifySubscription(sessionId);
      // Refetch user data to get updated premium status
      const userResponse = await getUserData();
      setUser(userResponse.data);
    } catch (error) {
      console.error('Error verifying subscription:', error);
      setError('Failed to verify subscription. Please contact support.');
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
        await fetchData(); // Refetch all data after update
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
        await fetchData(); // Refetch all data after deletion
      } catch (error) {
        console.error('Error deleting application', error);
        setError('Failed to delete application. Please try again.');
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    }
  };

  const renderPremiumFeatures = () => {
    if (user && user.isPremium) {
      return (
        <div className="premium-features">
          <h3>Premium Features</h3>
          <Analytics />
        </div>
      );
    } else {
      return (
        <div className="upgrade-prompt">
          <h3>Upgrade to Premium</h3>
          <p>Get access to advanced features and analytics!</p>
          <SubscribeButton />
        </div>
      );
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Job Applications Dashboard</h2>
      {error && <div className="error">{error}</div>}

      {renderPremiumFeatures()}

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