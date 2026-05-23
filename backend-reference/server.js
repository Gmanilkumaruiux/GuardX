const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Log = require('./models/Log');
const Threat = require('./models/Threat');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guardx';
const JWT_SECRET = process.env.JWT_SECRET || 'guardx_super_secret_key_12345';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('⚡ Connected securely to MongoDB database.'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// 🛡️ AUTHENTICATION ENDPOINTS
// ==========================================

// Register Account
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: email.toLowerCase().includes('admin') ? 'admin' : (role || 'user'),
      riskScore: 0,
      status: 'active'
    });

    // Log the successful signup
    await Log.create({
      userId: newUser._id,
      email: newUser.email,
      action: 'Account Created',
      ipAddress: req.ip,
      status: 'Success'
    });

    // Create token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        riskScore: newUser.riskScore,
        status: newUser.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
});

// Login Account
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Email address not registered. Please sign up first.' });
    }

    // Check if blocked
    if (user.status === 'blocked' || user.status === 'suspended') {
      await Log.create({
        email: user.email,
        action: 'Blocked Login Denied',
        ipAddress: req.ip,
        status: 'Blocked'
      });
      return res.status(403).json({ message: 'This account has been administratively BLOCKED due to high risk scores.' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login count
      user.failedLoginAttempts += 1;
      
      // AI Logic: Trigger Warning if failures >= 3
      if (user.failedLoginAttempts >= 3) {
        user.riskScore = Math.min(100, user.riskScore + 20);
        
        await Threat.create({
          type: 'Multiple Login Attempts',
          severity: user.riskScore >= 80 ? 'Critical' : 'Medium',
          targetUserId: user._id,
          targetEmail: user.email,
          riskScoreIncrease: 20,
          metadata: { failedAttempts: user.failedLoginAttempts, ip: req.ip }
        });
      }

      await user.save();

      await Log.create({
        userId: user._id,
        email: user.email,
        action: 'Failed Login Attempt',
        ipAddress: req.ip,
        status: 'Failed'
      });

      return res.status(400).json({ message: 'Invalid password. Authentication failed.' });
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Log the successful login
    await Log.create({
      userId: user._id,
      email: user.email,
      action: 'Successful Login',
      ipAddress: req.ip,
      status: 'Success'
    });

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        riskScore: user.riskScore,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed.', error: error.message });
  }
});

// ==========================================
// 🛡️ ADMIN MANAGEMENT ENDPOINTS
// ==========================================

// Get All Users (Admin)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// Update User Status (Block/Unblock)
app.post('/api/admin/users/status', async (req, res) => {
  try {
    const { userId, status } = req.body; // status: 'active', 'blocked', 'suspended'

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.status = status;
    user.riskScore = status === 'blocked' ? 100 : 0;
    await user.save();

    // Log administrative action
    await Log.create({
      userId: user._id,
      email: user.email,
      action: status === 'blocked' ? 'Administratively Blocked' : 'Administratively Restored',
      ipAddress: req.ip,
      status: 'Success'
    });

    res.json({ message: 'User status successfully updated.', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status.' });
  }
});

// ==========================================
// 🛡️ THREATS & LOGS TELEMETRY
// ==========================================

// Get All Threats
app.get('/api/threats', async (req, res) => {
  try {
    const threats = await Threat.find({}).sort({ createdAt: -1 });
    res.json(threats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch threat timeline.' });
  }
});

// Report a New Threat (AI Triggered)
app.post('/api/threats/report', async (req, res) => {
  try {
    const { type, severity, email, riskScoreIncrease, metadata } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      user.riskScore = Math.min(100, user.riskScore + riskScoreIncrease);
      if (user.riskScore >= 80) user.status = 'blocked';
      await user.save();
    }

    const threat = await Threat.create({
      type,
      severity,
      targetUserId: user ? user._id : null,
      targetEmail: email,
      riskScoreIncrease,
      metadata
    });

    res.status(201).json(threat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to report threat.' });
  }
});

// Get All Activity Logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activity logs.' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GuardX AI Cybersecurity Server is running on port ${PORT}`);
  console.log(`🔌 Connect React frontend endpoints to: http://localhost:${PORT}/api`);
});
