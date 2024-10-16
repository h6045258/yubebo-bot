const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
    id: String,
    coins: Number,
    status: { type: String, default: 'available' }
});

module.exports = mongoose.model('moneySchema', moneySchema);
