const mongoose = require('mongoose');

const vipSchema = new mongoose.Schema({
    memberid: String,
    type: String,
    used: Number,

})
module.exports = mongoose.model('vipSchema', vipSchema)
