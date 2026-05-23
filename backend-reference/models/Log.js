const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String, // Stored even if User doesn't exist
  },
  action: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
  },
  deviceInfo: {
    type: String,
  },
  location: {
    type: String, // Derived from IP via Geolocation services
  },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Blocked'],
    default: 'Success',
  }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
