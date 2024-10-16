const mongoose = require('mongoose');


const wordSchema = new mongoose.Schema({
    word: String,
    censorId: String,
    suggesterId: String
});

module.exports = mongoose.model('dictionary', wordSchema);
