const mongoose = require('mongoose')
const cooldownSchema = new mongoose.Schema({
  key: String,
  cooldown: Number,
})
module.exports = mongoose.model('cooldownSchema', cooldownSchema);