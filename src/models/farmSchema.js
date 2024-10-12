const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmSchema = new Schema({
    memberid: String,
    name: String,
    quanlity: Number,
    type: String
});

module.exports = mongoose.model('farmSchema', farmSchema);