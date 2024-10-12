const mongoose = require('mongoose');

const anhcuoi = new mongoose.Schema({
  authorid: String,
  wifeid: String,
  anhcuoi: String
})

module.exports = mongoose.model('anhcuoi', anhcuoi);