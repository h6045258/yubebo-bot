
const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
  memberid: String,
  username: String,
  reason: String,
  guildname: String,
  guildid : String,
  global: { type: Boolean, default: false }
})

module.exports = mongoose.model('BlacklistSchema', BlacklistSchema)