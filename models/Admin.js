const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isMaster: { type: Boolean, default: false }
});

module.exports = mongoose.model('Admin', adminSchema); 