const path = require('path')
const { fileURLToPath } = require('url');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const exp = require('constants');
require('dotenv').config();



// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const app = express();

// Connect to MongoDB
connectDB();

app.options('*', cors());

// Middleware
app.use(cors());
app.use(express.json());

// Simple auth check
const checkAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Auth token required' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({    message: 'Invalid token' });
  }
};

app.use(express.static(path.join(__dirname, '/frontend')))
 
app.get('*', (req, res) => res.sendFile(path.join(__dirname, `${req.path}`)))
// Routes


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', checkAuth, require('./routes/donationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});