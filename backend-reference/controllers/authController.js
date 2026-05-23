const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Log = require('../models/Log');

// Simulated AI Threat Detection Engine integration
const analyzeLoginRequest = async (req, email) => {
  const user = await User.findOne({ email });
  if (!user) return { isThreat: false };

  // Calculate Risk
  let scoreIncrease = 0;
  if (user.failedLoginAttempts > 3) scoreIncrease += 20;

  // Additional mock logic based on IP, Location, Time...
  
  if (scoreIncrease > 0) {
    user.riskScore += scoreIncrease;
    await user.save();
    
    // Auto-block if risk score > 80
    if (user.riskScore >= 80) {
      user.status = 'blocked';
      await user.save();
      return { isThreat: true, blocked: true };
    }
  }

  return { isThreat: false, blocked: user.status === 'blocked' };
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const analysis = await analyzeLoginRequest(req, email);
    if (analysis.blocked) {
      await Log.create({ email, action: 'Login Blocked - Risk Exceeded', ipAddress: req.ip, status: 'Blocked' });
      return res.status(403).json({ message: 'Account blocked due to suspicious activity. Contact Admin.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      if (user) {
        user.failedLoginAttempts += 1;
        await user.save();
      }
      await Log.create({ email, action: 'Failed Login Attempt', ipAddress: req.ip, status: 'Failed' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    await Log.create({ userId: user._id, email, action: 'Successful Login', ipAddress: req.ip, status: 'Success' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role, riskScore: user.riskScore } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
