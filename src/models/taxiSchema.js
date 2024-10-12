const mongoose = require('mongoose');

const taxiSchema = new mongoose.Schema({
  guildid: String,
  channelid: String,
  tag: String
})

module.exports = mongoose.model('taxiSchema', taxiSchema);