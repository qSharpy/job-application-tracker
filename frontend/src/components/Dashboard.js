import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
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

  if (!localStorage.getItem('token')) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <h2>Job Applications Dashboard</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            {...formik.getFieldProps('company')}
          />
          {formik.touched.company && formik.errors.company ? (
            <div>{formik.errors.company}</div>
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
            <div>{formik.errors.position}</div>
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
      <ul>
        {applications.map((app) => (
          <li key={app._id}>
            <strong>{app.company}</strong> - {app.position} ({app.status})
            <p>{app.notes}</p>
            <button onClick={() => handleEdit(app)}>Edit</button>
            <button onClick={() => handleDelete(app._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;