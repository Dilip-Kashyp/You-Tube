const mongoose = require('mongoose');

const healthCheckSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const HealthCheck = mongoose.model('HealthCheck', healthCheckSchema);

module.exports = HealthCheck;
