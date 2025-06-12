const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); // ✅ Connect to DB

const app = express();
app.use(express.json());

// Optional: use your routes here
// app.use('/api/auth', require('./routes/authRoutes'));
// ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
