const mongoose = require('mongoose');

const BanGSchema = new mongoose.Schema({
  admins: String,
  memberid: { type: String },
  guildid: { type: String },
  username: { type: String },
  guildname: { type: String },
})

module.exports = mongoose.model('BanGSchema', BanGSchema)
