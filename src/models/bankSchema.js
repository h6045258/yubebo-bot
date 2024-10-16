const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    id: String,
    coins: { type: Number, default: 0 },
    yucoins: { type: Number, default: 0 }
});

module.exports = mongoose.model('bankSchema', bankSchema);
