const mongoose = require('mongoose');
const { Schema } = mongoose;

const cooldowns = new Schema({
    memberid: String,
    key: String,
    value: Number
});

module.exports = mongoose.model('cooldowns', cooldowns);
