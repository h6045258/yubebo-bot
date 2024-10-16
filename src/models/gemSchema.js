const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  memberid: String,
  quanlity: Number,
  typeS: String,
  type: Number
});

module.exports = mongoose.model('gemSchema', gemSchema);
