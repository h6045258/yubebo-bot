const mongoose = require('mongoose');
const { Schema } = mongoose;

const invSchema = new Schema({
  memberid: String,
  name: String,
  quanlity: Number,
  type : String,
  price: Number
});

module.exports = mongoose.model('invSchema', invSchema);