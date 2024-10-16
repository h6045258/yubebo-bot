const mongoose = require('mongoose');

const explvSchema = new mongoose.Schema({
    memberid: String,
    level: Number,

});

const expSchema = new mongoose.Schema({
    memberid: String,
    exp: Number,

});

mongoose.model('expSchema', expSchema);
mongoose.model('explvSchema', explvSchema);

module.exports = { explvSchema, expSchema };
