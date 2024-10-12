const mongoose = require('mongoose')
const plantingSchema = new mongoose.Schema({
  memberid : String,
  ot: Number,
  lua: Number,
  carot: Number,
  cachua: Number,
  ngo: Number,
  khoaimi: Number,
  khoaitay: Number,
  caingot: Number,
  mia: Number,
  dao: Number,
  dautay: Number,
  duagang: Number,
  mit: Number,
})
module.exports = mongoose.model('plantingSchema', plantingSchema);