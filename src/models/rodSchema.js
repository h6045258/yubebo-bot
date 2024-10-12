const mongoose = require('mongoose');
const { Schema } = mongoose;

const rodSchema = new Schema({
  memberid: String,
  quanlity: Number,
  typeS: String,
  type : Number,
});

module.exports = mongoose.model('rodSchema', rodSchema);