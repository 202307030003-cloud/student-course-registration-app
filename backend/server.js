const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/student_course_registration';
mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));

// Catch-all route to serve the frontend for any other requests (SPA-like behavior or generic redirect)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
