const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const authRoutes = require('./routes/authRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// This line is for the Stripe webhook
app.use('/api/stripe/webhook', express.raw({type: 'application/json'}));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use('/api/auth', authRoutes);
app.use('/api/job-applications', jobApplicationRoutes);
app.use('/api/stripe', stripeRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});