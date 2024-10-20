const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow only frontend origin
  credentials: true, // Allow cookies if your app uses them
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Test route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Job Application Tracker API" });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Job Application routes
app.use('/api/job-applications', jobApplicationRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});