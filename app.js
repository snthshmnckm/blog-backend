const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const app = express();

dotenv.config();

// Middleware for parsing JSON
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// API Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

