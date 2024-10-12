const mongoose = require('mongoose');

const MarrySchema = new mongoose.Schema({
  authorid: String,
  husbandid: String,
  wifeid: String,
  nhan: String,
  together: Number,
  loihua: String,
  date: Number
})

module.exports = mongoose.model('MarrySchema', MarrySchema);