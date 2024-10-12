const mongoose = require('mongoose');
const { Schema } = mongoose;

const buffSchema = new Schema({
    memberid: String,
    quanlity: Number,
    type: Number,
    heso: Number
});

module.exports = mongoose.model('buffSchema', buffSchema);