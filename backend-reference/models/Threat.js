const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Multiple Login Attempts', 
      'Rapid Action Detection', 
      'Bot Registration', 
      'Suspicious Email Pattern', 
      'Spam Activity', 
      'Unusual Login Time'
    ],
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  targetEmail: {
    type: String,
  },
  riskScoreIncrease: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Resolved', 'Ignored'],
    default: 'Active',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // flexible for IPs, payload, etc.
  }
}, { timestamps: true });

module.exports = mongoose.model('Threat', threatSchema);
