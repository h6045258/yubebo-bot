const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    id: String,
    name: String,
    quanlity: Number,
    type: String
});

module.exports = mongoose.model('animalSchema', animalSchema);