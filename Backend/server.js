const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/api/daily', require('./routes/dailyRoutes'));

// Routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');

// Use Routes
app.use('/api/admin', adminRoutes);           // Admin-related endpoints
app.use('/api/auth', authRoutes);             // Auth: login/signup
app.use('/api', submissionRoutes);            // Submissions & user-specific endpoints
app.use('/api/user', userRoutes);             // User data fetch/edit
app.use('/api/problem', problemRoutes);       // Problems CRUD & filters

// Root route
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
