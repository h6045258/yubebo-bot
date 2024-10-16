const mongoose = require('mongoose');

const status = new mongoose.Schema({
  userId: String,
  status: String
})

module.exports = mongoose.model('StatusSchema', status);
