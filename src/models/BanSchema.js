
const mongoose = require('mongoose');

const BanSchema = new mongoose.Schema({
  admins: String,
  memberid: { type: String },
  guildid: { type: String },
  username: { type: String },
  guildname: { type: String },
  reason: { type: String, default: ""}
})

module.exports = mongoose.model('BanSchema', BanSchema)